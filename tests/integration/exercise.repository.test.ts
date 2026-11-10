/** @jest-environment node */
import { createExerciseRepository, type NewExercise } from '../../src/database/repositories/exerciseRepository';
import { createDrizzleTestDb, type TestDrizzle } from '../helpers/drizzleDb';

const ID_A = '3f2b8c1e-5a47-4d1f-9c3a-7e2d4b6a8f10';
const ID_B = '9a1c7e4d-2b36-4f58-8d0e-1c5a3b7f9e22';
const ID_C = 'c4d2e6f8-1a3b-4c5d-8e7f-9a0b1c2d3e4f';

const bench = (over: Partial<NewExercise> = {}): NewExercise => ({
  id: ID_A,
  builtinKey: 'bench_press_barbell',
  name: 'Bench Press',
  equipment: 'barbell',
  trackingType: 'weight_reps',
  isCustom: false,
  notes: null,
  muscles: [
    { muscle: 'triceps', role: 'secondary' },
    { muscle: 'chest', role: 'primary' },
    { muscle: 'shoulders', role: 'secondary' },
  ],
  now: 1_000,
  ...over,
});

let t: TestDrizzle;
let repo: ReturnType<typeof createExerciseRepository>;
beforeEach(() => {
  t = createDrizzleTestDb();
  repo = createExerciseRepository(t.db);
});
afterEach(() => t.close());

describe('create and read', () => {
  it('stores an exercise with its muscles and reads it back through the real drizzle driver', () => {
    const created = repo.create(bench());
    expect(created).toEqual({
      id: ID_A,
      builtinKey: 'bench_press_barbell',
      name: 'Bench Press',
      equipment: 'barbell',
      trackingType: 'weight_reps',
      isCustom: false,
      isArchived: false,
      notes: null,
      // primary first, then secondary alphabetically
      muscles: [
        { muscle: 'chest', role: 'primary' },
        { muscle: 'shoulders', role: 'secondary' },
        { muscle: 'triceps', role: 'secondary' },
      ],
      createdAt: 1_000,
      updatedAt: 1_000,
    });
    expect(repo.findById(ID_A)).toEqual(created);
  });

  it('returns null for an unknown id and finds built-ins by key', () => {
    expect(repo.findById(ID_B)).toBeNull();
    repo.create(bench());
    expect(repo.findByBuiltinKey('bench_press_barbell')?.id).toBe(ID_A);
    expect(repo.findByBuiltinKey('nope')).toBeNull();
  });

  it('keeps booleans as booleans and supports an exercise with no muscles or equipment', () => {
    const custom = repo.create(bench({ id: ID_B, builtinKey: null, isCustom: true, equipment: null, muscles: [], name: 'My Move' }));
    expect(custom.isCustom).toBe(true);
    expect(custom.isArchived).toBe(false);
    expect(custom.equipment).toBeNull();
    expect(custom.muscles).toEqual([]);
  });

  it('rolls back the whole create when a muscle link is invalid (atomic)', () => {
    const duplicateMuscle = bench({ muscles: [{ muscle: 'chest', role: 'primary' }, { muscle: 'chest', role: 'secondary' }] });
    expect(() => repo.create(duplicateMuscle)).toThrow(/UNIQUE/);
    expect(repo.findById(ID_A)).toBeNull();
  });

  it('enforces database rules: unique builtin_key, unique-per-exercise muscles, non-blank name', () => {
    repo.create(bench());
    expect(() => repo.create(bench({ id: ID_B }))).toThrow(/builtin_key/);
    expect(() => repo.create(bench({ id: ID_C, builtinKey: null, name: '   ' }))).toThrow(/not_blank/);
  });
});

describe('review fixes (EXL-01)', () => {
  it('treats undefined as "leave unchanged" for every field and null as "clear"', () => {
    repo.create(bench({ notes: 'keep elbows in' }));
    const untouched = repo.update(ID_A, { name: 'Flat Bench', notes: undefined, equipment: undefined, trackingType: undefined }, 2_000)!;
    expect(untouched).toMatchObject({ name: 'Flat Bench', notes: 'keep elbows in', equipment: 'barbell', trackingType: 'weight_reps' });
    expect(repo.update(ID_A, { notes: null }, 3_000)).toMatchObject({ notes: null, equipment: 'barbell' });
  });

  it('works when methods are detached from the repository object (no hidden this)', () => {
    const { create, update, setArchived, findById } = repo;
    expect(create(bench()).id).toBe(ID_A);
    expect(update(ID_A, { name: 'X' }, 2_000)?.name).toBe('X');
    expect(setArchived(ID_A, true, 3_000)).toBe(true);
    expect(findById(ID_A)?.isArchived).toBe(true);
    const callbacks = [bench({ id: ID_B, builtinKey: 'k2' })].map(create);
    expect(callbacks[0].id).toBe(ID_B);
  });

  it('composes with a caller transaction: two repository calls commit or roll back together', () => {
    t.db.transaction((tx) => {
      const txRepo = createExerciseRepository(tx);
      txRepo.create(bench({ id: ID_A, builtinKey: 'a' }));
      txRepo.create(bench({ id: ID_B, builtinKey: 'b' }));
    });
    expect(repo.list().map((e) => e.id).sort()).toEqual([ID_A, ID_B].sort());

    expect(() =>
      t.db.transaction((tx) => {
        const txRepo = createExerciseRepository(tx);
        txRepo.create(bench({ id: ID_C, builtinKey: 'c' }));
        txRepo.update(ID_A, { name: 'Changed' }, 5_000);
        throw new Error('service failed after two repository calls');
      }),
    ).toThrow('service failed');
    expect(repo.findById(ID_C)).toBeNull();
    expect(repo.findById(ID_A)!.name).toBe('Bench Press');
  });

  it('keeps a repository call atomic inside a caller transaction (savepoint): a failed create does not undo earlier work', () => {
    t.db.transaction((tx) => {
      const txRepo = createExerciseRepository(tx);
      txRepo.create(bench({ id: ID_A, builtinKey: 'a' }));
      expect(() => txRepo.create(bench({ id: ID_B, builtinKey: 'a' }))).toThrow(/builtin_key/); // duplicate key
      txRepo.create(bench({ id: ID_C, builtinKey: 'c' }));
    });
    expect(repo.list().map((e) => e.id).sort()).toEqual([ID_A, ID_C].sort());
  });

  it('surfaces database errors as plain Error("Error code <n>: <sqlite message>"), like expo-sqlite', () => {
    repo.create(bench());
    let thrown: Error | undefined;
    try {
      repo.create(bench({ id: ID_B }));
    } catch (error) {
      thrown = error as Error;
    }
    expect(thrown).toBeInstanceOf(Error);
    expect(thrown!.message).toMatch(/^Error code 19: UNIQUE constraint failed: exercises.builtin_key/);
    expect(Object.keys(thrown!)).toEqual([]); // no errcode/code properties to lean on
  });

  it('reports the real change count for a write', () => {
    repo.create(bench());
    expect(repo.setArchived(ID_B, true, 1)).toBe(false);
    expect(repo.setArchived(ID_A, true, 1)).toBe(true);
  });
});

describe('muscle roles', () => {
  it('stores primary and secondary roles and rejects unknown roles at the database', () => {
    repo.create(bench());
    expect(
      t.raw.prepare("select role, count(*) as c from exercise_muscles where exercise_id = ? group by role order by role").all(ID_A),
    ).toEqual([
      { role: 'primary', c: 1 },
      { role: 'secondary', c: 2 },
    ]);
    expect(() => t.raw.exec(`insert into exercise_muscles values ('${ID_A}', 'abs', 'tertiary')`)).toThrow(/role_valid/);
  });
});

describe('list', () => {
  it('orders case-insensitively by name and hides archived exercises unless asked', () => {
    repo.create(bench({ id: ID_A, builtinKey: 'a', name: 'squat', muscles: [] }));
    repo.create(bench({ id: ID_B, builtinKey: 'b', name: 'Bench Press', muscles: [{ muscle: 'chest', role: 'primary' }] }));
    repo.create(bench({ id: ID_C, builtinKey: 'c', name: 'Deadlift', muscles: [] }));
    repo.setArchived(ID_C, true, 2_000);

    expect(repo.list().map((e) => e.name)).toEqual(['Bench Press', 'squat']);
    expect(repo.list({ includeArchived: true }).map((e) => e.name)).toEqual(['Bench Press', 'Deadlift', 'squat']);
    expect(repo.list()[0].muscles).toEqual([{ muscle: 'chest', role: 'primary' }]);
  });

  it('returns an empty list for an empty database', () => {
    expect(repo.list()).toEqual([]);
  });
});

describe('update', () => {
  it('changes only the fields sent and bumps updatedAt, leaving everything else and the muscles alone', () => {
    repo.create(bench());
    const updated = repo.update(ID_A, { name: 'Flat Bench Press' }, 5_000)!;
    expect(updated.name).toBe('Flat Bench Press');
    expect(updated.equipment).toBe('barbell');
    expect(updated.trackingType).toBe('weight_reps');
    expect(updated.muscles).toHaveLength(3);
    expect(updated.createdAt).toBe(1_000);
    expect(updated.updatedAt).toBe(5_000);
  });

  it('clears nullable fields only when they are explicitly null', () => {
    repo.create(bench({ notes: 'keep elbows in' }));
    expect(repo.update(ID_A, { notes: null, equipment: null }, 2_000)).toMatchObject({ notes: null, equipment: null });
    expect(repo.update(ID_A, { name: 'X' }, 3_000)).toMatchObject({ notes: null, equipment: null });
  });

  it('replaces the muscle links when muscles are provided, and clears them with an empty list', () => {
    repo.create(bench());
    expect(repo.update(ID_A, { muscles: [{ muscle: 'lats', role: 'primary' }] }, 2_000)!.muscles).toEqual([
      { muscle: 'lats', role: 'primary' },
    ]);
    expect(repo.update(ID_A, { muscles: [] }, 3_000)!.muscles).toEqual([]);
  });

  it('is atomic: a failing muscle replacement keeps the old muscles and the old name', () => {
    repo.create(bench());
    const bad = [{ muscle: 'abs' as const, role: 'primary' as const }, { muscle: 'abs' as const, role: 'secondary' as const }];
    expect(() => repo.update(ID_A, { name: 'Renamed', muscles: bad }, 2_000)).toThrow(/UNIQUE/);
    const after = repo.findById(ID_A)!;
    expect(after.name).toBe('Bench Press');
    expect(after.updatedAt).toBe(1_000);
    expect(after.muscles.map((m) => m.muscle)).toEqual(['chest', 'shoulders', 'triceps']);
  });

  it('does not touch updatedAt for an empty patch and returns null for an unknown id', () => {
    repo.create(bench());
    expect(repo.update(ID_A, {}, 9_000)!.updatedAt).toBe(1_000);
    expect(repo.update(ID_B, { name: 'X' }, 9_000)).toBeNull();
  });

  it('changes the tracking type', () => {
    repo.create(bench());
    expect(repo.update(ID_A, { trackingType: 'duration' }, 2_000)!.trackingType).toBe('duration');
    expect(() => repo.update(ID_A, { trackingType: 'bogus' as never }, 3_000)).toThrow(/tracking_type_valid/);
  });
});

describe('archive', () => {
  it('archives and unarchives without losing data', () => {
    repo.create(bench());
    expect(repo.setArchived(ID_A, true, 4_000)).toBe(true);
    const archived = repo.findById(ID_A)!;
    expect(archived).toMatchObject({ isArchived: true, updatedAt: 4_000, name: 'Bench Press' });
    expect(archived.muscles).toHaveLength(3);
    expect(repo.setArchived(ID_A, false, 5_000)).toBe(true);
    expect(repo.findById(ID_A)).toMatchObject({ isArchived: false, updatedAt: 5_000 });
  });

  it('returns false for an unknown id', () => {
    expect(repo.setArchived(ID_B, true, 1)).toBe(false);
  });

  it('keeps an archived exercise referenced by a routine and by workout history', () => {
    repo.create(bench());
    t.raw.exec(`insert into routines (id, name, created_at, updated_at) values ('${ID_B}', 'R', 1, 1)`);
    t.raw.exec(`insert into routine_exercises (id, routine_id, exercise_id, position) values ('${ID_C}', '${ID_B}', '${ID_A}', 0)`);
    t.raw.exec(`insert into workout_sessions (id, name, status, started_at, ended_at, created_at, updated_at) values ('s1', 'S', 'completed', 1, 2, 1, 1)`);
    t.raw.exec(`insert into session_exercises (id, session_id, exercise_id, name, tracking_type, position) values ('se1', 's1', '${ID_A}', 'Bench Press', 'weight_reps', 0)`);
    repo.setArchived(ID_A, true, 2_000);
    // still referenced; hard deletion stays blocked while a routine uses it
    expect(() => t.raw.exec(`delete from exercises where id = '${ID_A}'`)).toThrow(/FOREIGN KEY/);
    expect(t.raw.prepare('select exercise_id as x from session_exercises').get()).toEqual({ x: ID_A });
  });
});
