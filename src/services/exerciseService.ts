import { createExerciseRepository } from '../database/repositories/exerciseRepository';
import type { AtlasDb, AtlasExecutor } from '../database/types';
import {
  AtlasError, EpochMsSchema, ExerciseInputSchema, ExerciseUpdateSchema, IdSchema, isAtlasError,
} from '../types';
import type { Exercise } from '../types';
import type { ExerciseService } from './contracts';
import { createExerciseSearchService } from './exerciseSearchService';
import type { Clock, IdGenerator } from './ports';

function persist<T>(run: () => T): T {
  try {
    return run();
  } catch (cause) {
    if (isAtlasError(cause)) throw cause;
    throw new AtlasError('PERSISTENCE', 'The exercise could not be saved or loaded. Please try again.', undefined, cause);
  }
}

function validId(input: string): string {
  const result = IdSchema.safeParse(input);
  if (!result.success) {
    throw new AtlasError('VALIDATION', 'The exercise identifier is invalid.', { issues: result.error.issues });
  }
  return result.data;
}

function find(db: AtlasExecutor, id: string): Exercise {
  const exercise = createExerciseRepository(db).findById(id);
  if (!exercise) throw new AtlasError('NOT_FOUND', 'This exercise could not be found.');
  return exercise;
}

/** All writes resolve after the synchronous transaction has committed. */
export function createExerciseService(db: AtlasDb, ports: { clock: Clock; ids: IdGenerator }): ExerciseService {
  const repository = createExerciseRepository(db);
  const now = () => {
    try {
      return EpochMsSchema.parse(ports.clock.now());
    } catch (cause) {
      throw new AtlasError('INTERNAL', 'The exercise timestamp could not be generated.', undefined, cause);
    }
  };
  const newId = () => {
    try {
      const id = IdSchema.parse(ports.ids.uuid());
      if (id[14] !== '4') throw new Error('Expected a UUID v4');
      return id;
    } catch (cause) {
      throw new AtlasError('INTERNAL', 'The exercise identifier could not be generated.', undefined, cause);
    }
  };
  const setArchived = async (inputId: string, archived: boolean) => {
    const id = validId(inputId);
    persist(() => db.transaction(tx => {
      if (find(tx, id).isArchived === archived) return;
      createExerciseRepository(tx).setArchived(id, archived, now());
    }));
  };
  return {
    ...createExerciseSearchService(repository),
    async get(inputId) {
      const id = validId(inputId);
      return persist(() => find(db, id));
    },
    async create(input) {
      const result = ExerciseInputSchema.safeParse(input);
      if (!result.success) {
        throw new AtlasError('VALIDATION', 'The exercise is invalid.', { issues: result.error.issues });
      }
      const id = newId();
      const timestamp = now();
      return persist(() => db.transaction(tx => createExerciseRepository(tx).create({
        ...result.data, id, builtinKey: null, isCustom: true, now: timestamp,
      })));
    },
    async update(inputId, input) {
      const id = validId(inputId);
      const result = ExerciseUpdateSchema.safeParse(input);
      if (!result.success) {
        throw new AtlasError('VALIDATION', 'The exercise changes are invalid.', { issues: result.error.issues });
      }
      return persist(() => db.transaction(tx => {
        const current = find(tx, id);
        const changed = Object.values(result.data).some(value => value !== undefined);
        if (!changed) return current;
        createExerciseRepository(tx).update(id, result.data, now());
        return find(tx, id);
      }));
    },
    archive: id => setArchived(id, true),
    unarchive: id => setArchived(id, false),
    async remove(inputId) {
      const id = validId(inputId);
      persist(() => db.transaction(tx => {
        if (!find(tx, id).isCustom) {
          throw new AtlasError('VALIDATION', 'Built-in exercises can be archived instead of deleted.');
        }
        const transactionRepository = createExerciseRepository(tx);
        const usage = transactionRepository.references(id);
        if (usage.inRoutine) throw new AtlasError('EXERCISE_IN_USE', 'A routine uses this exercise. Archive it instead.');
        if (usage.inSession) throw new AtlasError('HAS_HISTORY', 'A workout uses this exercise. Archive it instead.');
        transactionRepository.remove(id);
      }));
    },
  };
}
