// Exercise and muscle data access (EXL-01). Pure persistence: no validation, no clock, no id
// generation. Services (EXL-03/04) validate input with the Zod schemas, generate ids and
// timestamps, own the surrounding transaction and translate database errors into AtlasError.
// Only src/database imports Drizzle. Do not use `this` here: methods must survive being detached.
import { asc, eq, inArray, sql } from 'drizzle-orm';

import type { Equipment, Exercise, ExerciseMuscle, MuscleRole, TrackingType } from '../../types';
import { exerciseMuscles, exercises } from '../schema';
import type { AtlasExecutor } from '../types';

export interface NewExercise {
  id: string;
  builtinKey: string | null;
  name: string;
  equipment: Equipment | null;
  trackingType: TrackingType;
  isCustom: boolean;
  notes: string | null;
  muscles: ExerciseMuscle[];
  /** epoch ms, used for createdAt and updatedAt */
  now: number;
}

/**
 * One rule for every field: `undefined` (or absent) = leave unchanged, `null` = clear (nullable
 * fields only), any other value = set. `muscles`, when present, REPLACES all muscle links.
 */
export interface ExercisePatch {
  name?: string;
  equipment?: Equipment | null;
  trackingType?: TrackingType;
  notes?: string | null;
  muscles?: ExerciseMuscle[];
}

type ExerciseRow = typeof exercises.$inferSelect;
type MuscleRow = typeof exerciseMuscles.$inferSelect;

const ROLE_ORDER: Record<MuscleRole, number> = { primary: 0, secondary: 1 };
const ordinal = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

function toDomain(row: ExerciseRow, muscleRows: MuscleRow[]): Exercise {
  const muscles = muscleRows
    .map((m) => ({ muscle: m.muscle, role: m.role }) as ExerciseMuscle)
    .sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role] || ordinal(a.muscle, b.muscle));
  return {
    id: row.id,
    builtinKey: row.builtinKey,
    name: row.name,
    equipment: row.equipment as Equipment | null,
    trackingType: row.trackingType,
    isCustom: row.isCustom,
    isArchived: row.isArchived,
    notes: row.notes,
    muscles,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function createExerciseRepository(db: AtlasExecutor) {
  const loadMuscles = (ids: string[] | 'all'): Map<string, MuscleRow[]> => {
    const byExercise = new Map<string, MuscleRow[]>();
    const add = (rows: MuscleRow[]) => {
      for (const row of rows) {
        const list = byExercise.get(row.exerciseId);
        if (list) list.push(row);
        else byExercise.set(row.exerciseId, [row]);
      }
    };
    if (ids === 'all') {
      add(db.select().from(exerciseMuscles).all());
    } else {
      // Chunked to stay far below SQLite's variable limit.
      for (let i = 0; i < ids.length; i += 500) {
        add(db.select().from(exerciseMuscles).where(inArray(exerciseMuscles.exerciseId, ids.slice(i, i + 500))).all());
      }
    }
    return byExercise;
  };

  const findById = (id: string): Exercise | null => {
    const row = db.select().from(exercises).where(eq(exercises.id, id)).limit(1).get();
    return row ? toDomain(row, loadMuscles([id]).get(id) ?? []) : null;
  };

  const findByBuiltinKey = (builtinKey: string): Exercise | null => {
    const row = db.select().from(exercises).where(eq(exercises.builtinKey, builtinKey)).limit(1).get();
    return row ? toDomain(row, loadMuscles([row.id]).get(row.id) ?? []) : null;
  };

  /** Inserts the exercise and its muscle links atomically (a savepoint when already in a transaction). */
  const create = (input: NewExercise): Exercise => {
    db.transaction((tx) => {
      tx.insert(exercises)
        .values({
          id: input.id,
          builtinKey: input.builtinKey,
          name: input.name,
          equipment: input.equipment,
          trackingType: input.trackingType,
          isCustom: input.isCustom,
          isArchived: false,
          notes: input.notes,
          createdAt: input.now,
          updatedAt: input.now,
        })
        .run();
      for (const m of input.muscles) {
        tx.insert(exerciseMuscles).values({ exerciseId: input.id, muscle: m.muscle, role: m.role }).run();
      }
    });
    const created = findById(input.id);
    if (!created) throw new Error('exercise vanished after insert');
    return created;
  };

  /** All exercises ordered by name (ASCII case-insensitive). Search and filters arrive with EXL-03. */
  const list = (options: { includeArchived?: boolean } = {}): Exercise[] => {
    const rows = db
      .select()
      .from(exercises)
      .where(options.includeArchived ? undefined : eq(exercises.isArchived, false))
      .orderBy(asc(sql`${exercises.name} collate nocase`), asc(exercises.id))
      .all();
    const muscles = loadMuscles('all');
    return rows.map((row) => toDomain(row, muscles.get(row.id) ?? []));
  };

  /** Returns null when the exercise does not exist; an empty patch changes nothing (no updatedAt bump). */
  const update = (id: string, patch: ExercisePatch, now: number): Exercise | null => {
    const found = db.select({ id: exercises.id }).from(exercises).where(eq(exercises.id, id)).limit(1).get();
    if (!found) return null;
    const changes: Partial<typeof exercises.$inferInsert> = {};
    if (patch.name !== undefined) changes.name = patch.name;
    if (patch.equipment !== undefined) changes.equipment = patch.equipment;
    if (patch.trackingType !== undefined) changes.trackingType = patch.trackingType;
    if (patch.notes !== undefined) changes.notes = patch.notes;
    const muscles = patch.muscles;
    if (Object.keys(changes).length === 0 && muscles === undefined) return findById(id);

    db.transaction((tx) => {
      tx.update(exercises)
        .set({ ...changes, updatedAt: now })
        .where(eq(exercises.id, id))
        .run();
      if (muscles !== undefined) {
        tx.delete(exerciseMuscles).where(eq(exerciseMuscles.exerciseId, id)).run();
        for (const m of muscles) {
          tx.insert(exerciseMuscles).values({ exerciseId: id, muscle: m.muscle, role: m.role }).run();
        }
      }
    });
    return findById(id);
  };

  /** Archived exercises keep their history and routine references. Returns false if not found. */
  const setArchived = (id: string, archived: boolean, now: number): boolean =>
    db.update(exercises).set({ isArchived: archived, updatedAt: now }).where(eq(exercises.id, id)).run().changes > 0;

  return { create, findById, findByBuiltinKey, list, update, setArchived };
}

export type ExerciseRepository = ReturnType<typeof createExerciseRepository>;
