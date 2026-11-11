import { z } from 'zod';

import { AtlasError, ExerciseInputSchema, IdSchema } from '../types';
import { BUILTIN_EXERCISES, type BuiltinExercise } from './catalog/exercises';
import { createExerciseRepository } from './repositories/exerciseRepository';
import { exercises } from './schema';
import type { AtlasDb } from './types';

const catalogSchema = z.array(ExerciseInputSchema.extend({
  id: IdSchema,
  builtinKey: z.string().min(1),
})).superRefine((entries, context) => {
  const ids = new Set<string>();
  const keys = new Set<string>();
  entries.forEach((entry, index) => {
    if (ids.has(entry.id) || keys.has(entry.builtinKey)) {
      context.addIssue({ code: 'custom', message: 'Duplicate catalog identity', path: [index] });
    }
    ids.add(entry.id);
    keys.add(entry.builtinKey);
  });
});

/** Insert-only catalog upgrades. One synchronous transaction preserves user edits and references. */
export function seedExercises(
  db: AtlasDb,
  catalog: readonly BuiltinExercise[] = BUILTIN_EXERCISES,
  now = Date.now(),
): { inserted: number; skipped: number } {
  const entries = catalogSchema.parse(catalog);
  try {
    return db.transaction(tx => {
      const existing = new Set(tx.select({ key: exercises.builtinKey }).from(exercises).all().map(row => row.key));
      const repository = createExerciseRepository(tx);
      let inserted = 0;
      for (const entry of entries) {
        if (existing.has(entry.builtinKey)) continue;
        repository.create({ ...entry, isCustom: false, now });
        inserted += 1;
      }
      return { inserted, skipped: entries.length - inserted };
    });
  } catch (cause) {
    throw new AtlasError('PERSISTENCE', 'The exercise library could not be prepared. Please try again.', undefined, { cause });
  }
}
