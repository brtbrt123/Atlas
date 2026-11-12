import type { ExerciseRepository } from '../database/repositories/exerciseRepository';
import { AtlasError, ExerciseFilterSchema } from '../types';
import type { ExerciseService } from './contracts';

// Canonical normalization makes composed/decomposed names compare consistently across platforms.
const searchText = (value: string) => value.normalize('NFC').toLowerCase();

/** Read-only portion of ExerciseService; mutations arrive with EXL-04. */
export function createExerciseSearchService(
  repository: Pick<ExerciseRepository, 'list'>,
): Pick<ExerciseService, 'list'> {
  return {
    async list(input) {
      const result = ExerciseFilterSchema.safeParse(input === undefined ? {} : input);
      if (!result.success) {
        throw new AtlasError('VALIDATION', 'The exercise filters are invalid.', {
          issues: result.error.issues,
        });
      }
      const filter = result.data;
      const query = searchText(filter.query ?? '');
      try {
        // Retain the repository's deterministic name/id ordering. No database access in screens.
        return repository.list({ includeArchived: filter.includeArchived }).filter(exercise =>
          searchText(exercise.name).includes(query) &&
          (filter.equipment === undefined || exercise.equipment === filter.equipment) &&
          (filter.muscle === undefined || exercise.muscles.some(item => item.muscle === filter.muscle)),
        );
      } catch (cause) {
        throw new AtlasError('PERSISTENCE', 'The exercise library could not be loaded. Please try again.', undefined, cause);
      }
    },
  };
}
