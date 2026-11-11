/** @jest-environment node */
import { BUILTIN_EXERCISES } from '../../src/database/catalog/exercises';
import { createExerciseRepository } from '../../src/database/repositories/exerciseRepository';
import { seedExercises } from '../../src/database/seedExercises';
import { EQUIPMENT, ExerciseSchema, MUSCLES, TRACKING_TYPES } from '../../src/types';
import { createDrizzleTestDb, type TestDrizzle } from '../helpers/drizzleDb';

let testDb: TestDrizzle;
beforeEach(() => { testDb = createDrizzleTestDb(); });
afterEach(() => { testDb.close(); });

test('the shipped catalog persists valid entities covering the fixed vocabularies', () => {
  expect(seedExercises(testDb.db, undefined, 1_000)).toEqual({
    inserted: BUILTIN_EXERCISES.length,
    skipped: 0,
  });
  const items = createExerciseRepository(testDb.db).list();
  items.forEach(item => {
    expect(ExerciseSchema.safeParse(item).success).toBe(true);
    expect(item).toMatchObject({ isCustom: false, isArchived: false, createdAt: 1_000, updatedAt: 1_000 });
    expect(item.muscles.some(muscle => muscle.role === 'primary')).toBe(true);
  });
  expect(new Set(items.flatMap(item => item.muscles.map(muscle => muscle.muscle)))).toEqual(new Set(MUSCLES));
  expect(new Set(items.map(item => item.equipment))).toEqual(new Set(EQUIPMENT));
  expect(new Set(items.map(item => item.trackingType))).toEqual(new Set(TRACKING_TYPES));
  expect(testDb.raw.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
});

test('repeated startup does not duplicate rows or muscle links', () => {
  seedExercises(testDb.db, undefined, 1_000);
  const before = testDb.raw.prepare('SELECT * FROM exercise_muscles ORDER BY exercise_id, muscle').all();
  expect(seedExercises(testDb.db, undefined, 2_000)).toEqual({
    inserted: 0, skipped: BUILTIN_EXERCISES.length,
  });
  expect(createExerciseRepository(testDb.db).list()).toHaveLength(BUILTIN_EXERCISES.length);
  expect(testDb.raw.prepare('SELECT * FROM exercise_muscles ORDER BY exercise_id, muscle').all()).toEqual(before);
});

test('upgrades add missing keys while preserving edited, archived and custom exercises', () => {
  const [first, second, third] = BUILTIN_EXERCISES;
  seedExercises(testDb.db, [first, second], 1_000);
  const repository = createExerciseRepository(testDb.db);
  repository.update(first.id, {
    name: 'My renamed press', equipment: null, notes: 'My setup',
    muscles: [{ muscle: 'shoulders', role: 'primary' }], trackingType: 'duration',
  }, 2_000);
  repository.setArchived(first.id, true, 3_000);
  const custom = repository.create({
    ...third, builtinKey: null, isCustom: true, now: 3_000,
  });
  const edited = repository.findById(first.id);
  expect(seedExercises(testDb.db, [first, second], 4_000)).toEqual({ inserted: 0, skipped: 2 });
  expect(repository.findById(first.id)).toEqual(edited);
  // A custom exercise with the same name must never suppress the built-in entry.
  const added = { ...third, id: 'ab8c2648-9f65-416e-b91b-246c6fbb0fd8' };
  expect(seedExercises(testDb.db, [first, second, added], 5_000)).toEqual({ inserted: 1, skipped: 2 });
  expect(repository.findById(custom.id)).toEqual(custom);
  expect(repository.findByBuiltinKey(third.builtinKey)?.id).toBe(added.id);
  expect(repository.findById(first.id)).toEqual(edited);
});

test('a failure after an insertion rolls back the complete seed transaction and permits retry', () => {
  const [first, second] = BUILTIN_EXERCISES;
  const repository = createExerciseRepository(testDb.db);
  repository.create({ ...second, builtinKey: null, isCustom: true, now: 1_000 });
  expect(() => seedExercises(testDb.db, [first, second], 2_000)).toThrow(
    expect.objectContaining({ code: 'PERSISTENCE' }),
  );
  expect(repository.findById(first.id)).toBeNull();
  expect(testDb.raw.prepare('SELECT * FROM exercise_muscles WHERE exercise_id = ?').all(first.id)).toEqual([]);
  expect(repository.list()).toHaveLength(1);
  const repaired = { ...second, id: 'ab8c2648-9f65-416e-b91b-246c6fbb0fd8' };
  expect(seedExercises(testDb.db, [first, repaired], 3_000)).toEqual({ inserted: 2, skipped: 0 });
});

test('duplicate identities are refused before writing', () => {
  const first = BUILTIN_EXERCISES[0];
  expect(() => seedExercises(testDb.db, [first, first])).toThrow('Duplicate catalog identity');
  expect(createExerciseRepository(testDb.db).list()).toEqual([]);
});
