/** @jest-environment node */
import { createExerciseService } from '../../src/services/exerciseService';
import { createExerciseRepository } from '../../src/database/repositories/exerciseRepository';
import type { ExerciseInput, ExerciseUpdate } from '../../src/types';
import { createDrizzleTestDb, type TestDrizzle } from '../helpers/drizzleDb';

const MISSING = '6ff363c2-59ae-4c58-9127-84f1319ac261';
const input: ExerciseInput = {
  name: '  My press  ', equipment: 'dumbbell', trackingType: 'weight_reps', notes: '  Bench setting 2  ',
  muscles: [{ muscle: 'chest', role: 'primary' }, { muscle: 'triceps', role: 'secondary' }],
};

let database: TestDrizzle;
let service: ReturnType<typeof createExerciseService>;
let time: number;
let sequence: number;
beforeEach(() => {
  database = createDrizzleTestDb();
  time = 1_000;
  sequence = 0;
  service = createExerciseService(database.db, {
    clock: { now: () => time },
    ids: { uuid: () => `a2fc63ec-ea67-41dd-a8d2-${String(++sequence).padStart(12, '0')}` },
  });
});
afterEach(() => database.close());

function addHistory(id: string, status: 'active' | 'completed' = 'completed') {
  database.raw.prepare("INSERT INTO workout_sessions (id, name, status, started_at, ended_at, created_at, updated_at) VALUES ('session', 'Upper A', ?, 1, ?, 1, 1)").run(status, status === 'completed' ? 2 : null);
  database.raw.prepare("INSERT INTO session_exercises (id, session_id, exercise_id, name, tracking_type, position) VALUES ('history-exercise', 'session', ?, 'Original snapshot', 'weight_reps', 0)").run(id);
  database.raw.exec("INSERT INTO workout_sets (id, session_exercise_id, position, weight_kg, reps, is_completed, completed_at, created_at, updated_at) VALUES ('set', 'history-exercise', 0, 20, 10, 1, 2, 1, 2)");
}

function addRoutine(id: string) {
  database.raw.exec("INSERT INTO routines (id, name, created_at, updated_at) VALUES ('routine', 'Upper A', 1, 1)");
  database.raw.prepare("INSERT INTO routine_exercises (id, routine_id, exercise_id, position) VALUES ('routine-exercise', 'routine', ?, 0)").run(id);
}

function history() {
  return {
    sessions: database.raw.prepare('SELECT * FROM workout_sessions').all(),
    exercises: database.raw.prepare('SELECT * FROM session_exercises').all(),
    sets: database.raw.prepare('SELECT * FROM workout_sets').all(),
  };
}

test('creates a normalized custom exercise with a generated v4 id and committed muscle links', async () => {
  const created = await service.create(input);
  expect(created).toMatchObject({
    id: 'a2fc63ec-ea67-41dd-a8d2-000000000001', builtinKey: null, name: 'My press',
    isCustom: true, isArchived: false, createdAt: 1_000, updatedAt: 1_000, notes: 'Bench setting 2',
  });
  expect(created.muscles).toEqual(input.muscles);
  expect(await service.get(created.id)).toEqual(created);
  expect(await service.list({ query: 'my press', muscle: 'triceps' })).toEqual([created]);
});

test('create supplies omitted defaults and ignores caller-supplied system metadata', async () => {
  const created = await service.create({ name: 'My row', id: MISSING, isCustom: false, builtinKey: 'forged' } as ExerciseInput);
  expect(created).toMatchObject({
    equipment: null, notes: null, trackingType: 'weight_reps', muscles: [], isCustom: true, builtinKey: null,
  });
  expect(created.id).not.toBe(MISSING);
});

test.each([
  { name: ' ' },
  { name: 'x'.repeat(101) },
  { name: 'X', equipment: 'invalid' },
  { name: 'X', notes: 'x'.repeat(2001) },
  { name: 'X', muscles: [{ muscle: 'chest', role: 'primary' }, { muscle: 'chest', role: 'secondary' }] },
])('invalid create rejects without writing or consuming an id: %j', async invalid => {
  await expect(service.create(invalid as ExerciseInput)).rejects.toMatchObject({
    code: 'VALIDATION', details: { issues: expect.any(Array) },
  });
  expect(sequence).toBe(0);
  expect(await service.list()).toEqual([]);
});

test('partial edits preserve omitted fields, allow nullable clearing and leave empty patches unchanged', async () => {
  const created = await service.create(input);
  time = 2_000;
  const renamed = await service.update(created.id, { name: 'Renamed', equipment: undefined });
  expect(renamed).toMatchObject({ name: 'Renamed', equipment: 'dumbbell', notes: 'Bench setting 2', updatedAt: 2_000, createdAt: 1_000 });
  expect(renamed.muscles).toEqual(created.muscles);
  time = 3_000;
  expect(await service.update(created.id, { name: undefined })).toEqual(renamed);
  expect(await service.update(created.id, {})).toEqual(renamed);
  expect(await service.update(created.id, { notes: null, equipment: null, muscles: [] })).toMatchObject({
    notes: null, equipment: null, muscles: [], updatedAt: 3_000,
  });
});

test('invalid updates preserve all existing fields', async () => {
  const created = await service.create(input);
  await expect(service.update(created.id, { name: '' })).rejects.toMatchObject({ code: 'VALIDATION' });
  await expect(service.update(created.id, { trackingType: 'bad' } as unknown as ExerciseUpdate)).rejects.toMatchObject({ code: 'VALIDATION' });
  expect(await service.get(created.id)).toEqual(created);
});

test('edit, archive and unarchive preserve routine references and completed snapshots and sets', async () => {
  const created = await service.create(input);
  addRoutine(created.id);
  addHistory(created.id);
  const before = history();
  time = 2_000;
  await service.update(created.id, { name: 'Renamed', trackingType: 'duration', muscles: [{ muscle: 'shoulders', role: 'primary' }] });
  await service.archive(created.id);
  expect(await service.list()).toEqual([]);
  expect(await service.get(created.id)).toMatchObject({ isArchived: true });
  time = 3_000;
  await service.archive(created.id);
  expect((await service.get(created.id)).updatedAt).toBe(2_000);
  await service.unarchive(created.id);
  expect(await service.list()).toHaveLength(1);
  expect(await service.get(created.id)).toMatchObject({ isArchived: false, updatedAt: 3_000 });
  expect(history()).toEqual(before);
  expect(database.raw.prepare('SELECT exercise_id FROM routine_exercises').get()).toEqual({ exercise_id: created.id });
  expect(database.raw.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
});

test('remove rejects routine references and permits deletion after the reference is removed', async () => {
  const created = await service.create(input);
  addRoutine(created.id);
  await expect(service.remove(created.id)).rejects.toMatchObject({ code: 'EXERCISE_IN_USE' });
  expect(await service.get(created.id)).toEqual(created);
  database.raw.exec('DELETE FROM routine_exercises');
  await service.remove(created.id);
  await expect(service.get(created.id)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  expect(database.raw.prepare('SELECT * FROM exercise_muscles').all()).toEqual([]);
});

test.each(['active', 'completed'] as const)('remove refuses an exercise referenced by a %s session', async status => {
  const created = await service.create(input);
  addHistory(created.id, status);
  const before = history();
  await expect(service.remove(created.id)).rejects.toMatchObject({ code: 'HAS_HISTORY' });
  expect(await service.get(created.id)).toEqual(created);
  expect(history()).toEqual(before);
});

test.each(['get', 'archive', 'unarchive', 'remove'] as const)('%s rejects malformed and missing ids', async method => {
  await expect(service[method]('invalid')).rejects.toMatchObject({ code: 'VALIDATION' });
  await expect(service[method](MISSING)).rejects.toMatchObject({ code: 'NOT_FOUND' });
});

test('update rejects malformed and missing ids', async () => {
  await expect(service.update('invalid', {})).rejects.toMatchObject({ code: 'VALIDATION' });
  await expect(service.update(MISSING, {})).rejects.toMatchObject({ code: 'NOT_FOUND' });
});

test('a database failure rolls back an entire create and allows retry', async () => {
  database.raw.exec("CREATE TRIGGER fail_muscle BEFORE INSERT ON exercise_muscles BEGIN SELECT RAISE(ABORT, 'private SQL failure'); END");
  await expect(service.create(input)).rejects.toMatchObject({ code: 'PERSISTENCE' });
  expect(await service.list()).toEqual([]);
  expect(database.raw.prepare('SELECT * FROM exercise_muscles').all()).toEqual([]);
  database.raw.exec('DROP TRIGGER fail_muscle');
  expect(await service.create(input)).toMatchObject({ name: 'My press' });
});

test('a failed muscle edit rolls back name, links and timestamp and preserves history', async () => {
  const created = await service.create(input);
  addHistory(created.id);
  const before = history();
  time = 5_000;
  database.raw.exec("CREATE TRIGGER fail_muscle BEFORE INSERT ON exercise_muscles BEGIN SELECT RAISE(ABORT, 'private SQL failure'); END");
  await expect(service.update(created.id, { name: 'Changed', muscles: [{ muscle: 'abs', role: 'primary' }] })).rejects.toMatchObject({ code: 'PERSISTENCE' });
  expect(await service.get(created.id)).toEqual(created);
  expect(history()).toEqual(before);
  database.raw.exec('DROP TRIGGER fail_muscle');
  await expect(service.update(created.id, { name: 'Changed' })).resolves.toMatchObject({ name: 'Changed' });
});

test('persistence errors expose safe messages and retain low-level details only in cause', async () => {
  const created = await service.create(input);
  database.raw.exec("CREATE TRIGGER fail_delete BEFORE DELETE ON exercises BEGIN SELECT RAISE(ABORT, 'private SQL failure'); END");
  let failure: Error | undefined;
  try { await service.remove(created.id); } catch (error) { failure = error as Error; }
  expect(failure).toMatchObject({ code: 'PERSISTENCE' });
  expect(failure?.message).not.toContain('private SQL failure');
  expect(failure?.cause).toBeInstanceOf(Error);
  expect(await service.get(created.id)).toEqual(created);
});

test('invalid dependency values fail as internal errors without creating records', async () => {
  const invalid = createExerciseService(database.db, { clock: { now: () => -1 }, ids: { uuid: () => MISSING } });
  await expect(invalid.create(input)).rejects.toMatchObject({ code: 'INTERNAL' });
  const invalidId = createExerciseService(database.db, { clock: { now: () => 1 }, ids: { uuid: () => 'invalid' } });
  await expect(invalidId.create(input)).rejects.toMatchObject({ code: 'INTERNAL' });
  expect(await service.list()).toEqual([]);
});

test('built-ins can be edited and archived while retaining their seed identity; delete offers archive', async () => {
  createExerciseRepository(database.db).create({
    id: MISSING, builtinKey: 'builtin-test', name: 'Built-in press', equipment: 'barbell',
    trackingType: 'weight_reps', muscles: [], notes: null, isCustom: false, now: 1_000,
  });
  await service.update(MISSING, { name: 'My built-in name' });
  await service.archive(MISSING);
  await expect(service.remove(MISSING)).rejects.toMatchObject({ code: 'VALIDATION' });
  expect(await service.get(MISSING)).toMatchObject({
    name: 'My built-in name', builtinKey: 'builtin-test', isCustom: false, isArchived: true,
  });
});

test('overlapping partial update calls preserve independent changes', async () => {
  const created = await service.create(input);
  await Promise.all([
    service.update(created.id, { notes: 'New setup' }),
    service.update(created.id, { equipment: 'barbell' }),
  ]);
  expect(await service.get(created.id)).toMatchObject({ notes: 'New setup', equipment: 'barbell' });
});

test('an id collision rejects creation without overwriting an existing exercise', async () => {
  const created = await service.create(input);
  const repeated = createExerciseService(database.db, {
    clock: { now: () => 5_000 }, ids: { uuid: () => created.id },
  });
  await expect(repeated.create({ name: 'Duplicate id' })).rejects.toMatchObject({ code: 'PERSISTENCE' });
  expect(await service.list()).toEqual([created]);
});
