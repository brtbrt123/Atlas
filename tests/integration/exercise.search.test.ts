/** @jest-environment node */
import { createExerciseRepository } from '../../src/database/repositories/exerciseRepository';
import { seedExercises } from '../../src/database/seedExercises';
import { createExerciseSearchService } from '../../src/services/exerciseSearchService';
import { AtlasError } from '../../src/types';
import type { ExerciseFilter } from '../../src/types';
import { createDrizzleTestDb, type TestDrizzle } from '../helpers/drizzleDb';

let database: TestDrizzle;
let repository: ReturnType<typeof createExerciseRepository>;
let service: ReturnType<typeof createExerciseSearchService>;

beforeEach(() => {
  database = createDrizzleTestDb();
  seedExercises(database.db, undefined, 1_000);
  repository = createExerciseRepository(database.db);
  service = createExerciseSearchService(repository);
});
afterEach(() => database.close());

test('default and empty queries return the repository ordering', async () => {
  const expected = repository.list();
  expect(await service.list()).toEqual(expected);
  expect(await service.list({ query: '   ' })).toEqual(expected);
});

test('names use a trimmed case-insensitive literal substring match', async () => {
  const result = await service.list({ query: '  DUMBBELL PRESS  ' });
  expect(result.map(exercise => exercise.name)).toEqual(['Incline dumbbell press']);
});

test('name, muscle and equipment filters combine and include secondary muscles', async () => {
  const result = await service.list({ query: 'press', equipment: 'dumbbell', muscle: 'triceps' });
  expect(result.map(exercise => exercise.name)).toEqual([
    'Dumbbell bench press', 'Dumbbell shoulder press', 'Incline dumbbell press',
  ]);
  expect(result.every(exercise => exercise.muscles.some(item => item.muscle === 'triceps' && item.role === 'secondary'))).toBe(true);
  expect(await service.list({ query: 'press', equipment: 'dumbbell', muscle: 'calves' })).toEqual([]);
});

test('muscle-only and equipment-only filters work independently without duplicate results', async () => {
  const shoulders = await service.list({ muscle: 'shoulders' });
  expect(shoulders.length).toBeGreaterThan(0);
  expect(shoulders.every(exercise => exercise.muscles.some(item => item.muscle === 'shoulders'))).toBe(true);
  expect(new Set(shoulders.map(exercise => exercise.id)).size).toBe(shoulders.length);
  const cable = await service.list({ equipment: 'cable' });
  expect(cable.length).toBeGreaterThan(0);
  expect(cable.every(exercise => exercise.equipment === 'cable')).toBe(true);
});

test('archived exercises are excluded unless explicitly included, including with combined filters', async () => {
  const archived = repository.list().find(exercise => exercise.name === 'Incline dumbbell press')!;
  repository.setArchived(archived.id, true, 2_000);
  const filter = { query: 'incline', muscle: 'chest', equipment: 'dumbbell' } as const;
  expect(await service.list(filter)).toEqual([]);
  expect(await service.list({ ...filter, includeArchived: true })).toEqual([
    expect.objectContaining({ id: archived.id, isArchived: true }),
  ]);
  expect((await service.list()).some(exercise => exercise.id === archived.id)).toBe(false);
});

test('custom and built-in exercises share the same search behavior, including Unicode and punctuation', async () => {
  repository.create({
    id: 'ccac2a66-0ac7-4bba-9520-95a856428faf',
    builtinKey: null, isCustom: true, now: 1_000, name: "Élan 100%_ 'press'",
    equipment: null, trackingType: 'bodyweight_reps', notes: null,
    muscles: [{ muscle: 'chest', role: 'primary' }],
  });
  const custom = await service.list({ query: 'E\u0301LAN' });
  expect(custom).toHaveLength(1);
  expect(custom[0].isCustom).toBe(true);
  expect(await service.list({ query: "%_ 'PRESS'" })).toEqual(custom);
  expect(await service.list({ query: "%' OR 1=1 --" })).toEqual([]);
});

test.each([
  null,
  [],
  { query: 'x'.repeat(101) },
  { muscle: 'invalid' },
  { equipment: 'invalid' },
  { includeArchived: 'true' },
])('invalid filters reject before repository access: %j', async input => {
  const list = jest.fn();
  const search = createExerciseSearchService({ list });
  await expect(search.list(input as unknown as ExerciseFilter)).rejects.toMatchObject({
    code: 'VALIDATION', details: { issues: expect.any(Array) },
  });
  expect(list).not.toHaveBeenCalled();
});

test('repository errors reject with a safe persistence message and retain the cause', async () => {
  const cause = new Error('private database path or SQL');
  const search = createExerciseSearchService({ list: () => { throw cause; } });
  let failure: unknown;
  try { await search.list(); } catch (error) { failure = error; }
  expect(failure).toBeInstanceOf(AtlasError);
  expect(failure).toMatchObject({ code: 'PERSISTENCE', cause });
  expect((failure as AtlasError).message).not.toContain(cause.message);
});
