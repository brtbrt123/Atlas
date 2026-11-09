/** @jest-environment node */
import { count, createTestDb, get, run, seed, type TestDb } from '../helpers/testDb';

let db: TestDb;
beforeEach(() => {
  db = createTestDb();
});
afterEach(() => db.close());

describe('migration', () => {
  it('creates the nine spec tables', () => {
    const rows = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
      .all() as { name: string }[];
    expect(rows.map((r) => r.name)).toEqual([
      'app_settings',
      'exercise_muscles',
      'exercises',
      'routine_exercises',
      'routine_sets',
      'routines',
      'session_exercises',
      'workout_sessions',
      'workout_sets',
    ]);
  });

  it('has foreign key enforcement on', () => {
    expect(get<{ foreign_keys: number }>(db, 'PRAGMA foreign_keys').foreign_keys).toBe(1);
  });
});

describe('exercises and muscles', () => {
  it('applies defaults', () => {
    seed.exercise(db);
    expect(get(db, "SELECT tracking_type, is_custom, is_archived FROM exercises WHERE id = 'e1'")).toEqual({
      tracking_type: 'weight_reps',
      is_custom: 0,
      is_archived: 0,
    });
  });

  it('rejects a blank name and an unknown tracking type', () => {
    expect(() => seed.exercise(db, 'e1', { name: '   ' })).toThrow(/exercises_name_not_blank/);
    expect(() =>
      run(db, "INSERT INTO exercises (id, name, tracking_type, created_at, updated_at) VALUES ('e2', 'X', 'bogus', 1, 1)"),
    ).toThrow(/exercises_tracking_type_valid/);
  });

  it('allows many custom exercises but rejects a duplicate builtin_key', () => {
    seed.exercise(db, 'c1');
    seed.exercise(db, 'c2');
    seed.exercise(db, 'b1', { builtinKey: 'squat_v1' });
    expect(() => seed.exercise(db, 'b2', { builtinKey: 'squat_v1' })).toThrow(/builtin_key/);
  });

  it('rejects muscles for a missing exercise and duplicate muscles per exercise', () => {
    expect(() => run(db, "INSERT INTO exercise_muscles VALUES ('nope', 'chest', 'primary')")).toThrow(/FOREIGN KEY/);
    seed.exercise(db);
    run(db, "INSERT INTO exercise_muscles VALUES ('e1', 'chest', 'primary')");
    expect(() => run(db, "INSERT INTO exercise_muscles VALUES ('e1', 'chest', 'secondary')")).toThrow(/UNIQUE/);
    expect(() => run(db, "INSERT INTO exercise_muscles VALUES ('e1', 'back', 'tertiary')")).toThrow(/role_valid/);
  });
});

describe('routines', () => {
  it('rejects duplicate positions and negative targets', () => {
    seed.exercise(db);
    seed.routine(db);
    run(db, "INSERT INTO routine_exercises (id, routine_id, exercise_id, position) VALUES ('re1', 'r1', 'e1', 0)");
    expect(() =>
      run(db, "INSERT INTO routine_exercises (id, routine_id, exercise_id, position) VALUES ('re2', 'r1', 'e1', 0)"),
    ).toThrow(/UNIQUE/);
    run(db, "INSERT INTO routine_sets (id, routine_exercise_id, position, target_reps, target_weight_kg) VALUES ('rs1', 're1', 0, 8, 60)");
    expect(() =>
      run(db, "INSERT INTO routine_sets (id, routine_exercise_id, position, target_weight_kg) VALUES ('rs2', 're1', 1, -1)"),
    ).toThrow(/routine_sets_targets_nonneg/);
  });

  it('restricts hard-deleting an exercise used by a routine', () => {
    seed.exercise(db);
    seed.routine(db);
    run(db, "INSERT INTO routine_exercises (id, routine_id, exercise_id, position) VALUES ('re1', 'r1', 'e1', 0)");
    expect(() => run(db, "DELETE FROM exercises WHERE id = 'e1'")).toThrow(/FOREIGN KEY/);
  });
});

describe('one active workout', () => {
  it('rejects a second active session', () => {
    seed.session(db, 's1');
    expect(() => seed.session(db, 's2')).toThrow(/UNIQUE constraint failed: workout_sessions.status/);
  });

  it('allows a new active session once the previous one is completed', () => {
    seed.session(db, 's1');
    run(db, "UPDATE workout_sessions SET status = 'completed', ended_at = 2000 WHERE id = 's1'");
    expect(() => seed.session(db, 's2')).not.toThrow();
  });

  it('keeps ended_at consistent with status', () => {
    seed.session(db, 's1');
    expect(() => run(db, "UPDATE workout_sessions SET ended_at = 2000 WHERE id = 's1'")).toThrow(/end_matches_status/);
    expect(() =>
      run(db, "INSERT INTO workout_sessions (id, name, status, started_at, created_at, updated_at) VALUES ('s2', 'X', 'completed', 1, 1, 1)"),
    ).toThrow(/end_matches_status/);
    expect(() =>
      run(db, "INSERT INTO workout_sessions (id, name, status, started_at, ended_at, created_at, updated_at) VALUES ('s3', 'X', 'completed', 5000, 4000, 1, 1)"),
    ).toThrow(/end_matches_status/);
  });

  it('persists the rest timer end time', () => {
    seed.session(db, 's1');
    run(db, "UPDATE workout_sessions SET rest_timer_ends_at = 5000 WHERE id = 's1'");
    expect(get<{ r: number }>(db, "SELECT rest_timer_ends_at AS r FROM workout_sessions WHERE id = 's1'").r).toBe(5000);
  });
});

describe('workout sets', () => {
  beforeEach(() => {
    seed.session(db, 's1');
    seed.sessionExercise(db, 'se1', 's1', null);
  });

  it('keeps planned targets separate from actual values', () => {
    run(db, "INSERT INTO workout_sets (id, session_exercise_id, position, target_reps, target_weight_kg, created_at, updated_at) VALUES ('w1', 'se1', 0, 5, 100, 1, 1)");
    expect(get(db, "SELECT target_reps, target_weight_kg, reps, weight_kg FROM workout_sets WHERE id = 'w1'")).toEqual({
      target_reps: 5,
      target_weight_kg: 100,
      reps: null,
      weight_kg: null,
    });
  });

  it('requires is_completed and completed_at to agree', () => {
    expect(() =>
      run(db, "INSERT INTO workout_sets (id, session_exercise_id, position, is_completed, created_at, updated_at) VALUES ('w1', 'se1', 0, 1, 1, 1)"),
    ).toThrow(/completed_matches_time/);
    expect(() =>
      run(db, "INSERT INTO workout_sets (id, session_exercise_id, position, is_completed, completed_at, created_at, updated_at) VALUES ('w2', 'se1', 0, 0, 1500, 1, 1)"),
    ).toThrow(/completed_matches_time/);
    expect(() =>
      run(db, "INSERT INTO workout_sets (id, session_exercise_id, position, is_completed, completed_at, created_at, updated_at) VALUES ('w3', 'se1', 0, 1, 1500, 1, 1)"),
    ).not.toThrow();
  });

  it.each([
    ['rpe above 10', 'rpe', 11],
    ['rpe below 1', 'rpe', 0],
    ['negative reps', 'reps', -2],
    ['negative weight', 'weight_kg', -1],
    ['negative target', 'target_weight_kg', -5],
  ])('rejects %s', (_label, column, value) => {
    expect(() =>
      run(db, `INSERT INTO workout_sets (id, session_exercise_id, position, ${column}, created_at, updated_at) VALUES ('w1', 'se1', 0, ?, 1, 1)`, value),
    ).toThrow(/CHECK constraint failed/);
  });

  it('rejects duplicate positions within an exercise', () => {
    seed.set(db, 'w1', 'se1', 0);
    expect(() => seed.set(db, 'w2', 'se1', 0)).toThrow(/UNIQUE/);
  });
});

describe('history is independent of routine and exercise edits', () => {
  it('keeps sessions, snapshots and sets when the routine and exercise are deleted', () => {
    seed.exercise(db);
    seed.routine(db);
    seed.session(db, 's1', { status: 'completed', routineId: 'r1' });
    seed.sessionExercise(db, 'se1', 's1', 'e1');
    seed.set(db, 'w1', 'se1');

    run(db, "DELETE FROM routines WHERE id = 'r1'");
    expect(get<{ routine_id: string | null }>(db, "SELECT routine_id FROM workout_sessions WHERE id = 's1'").routine_id).toBeNull();

    run(db, "DELETE FROM exercises WHERE id = 'e1'");
    expect(get(db, "SELECT exercise_id, name FROM session_exercises WHERE id = 'se1'")).toEqual({
      exercise_id: null,
      name: 'Snapshot name',
    });
    expect(count(db, 'workout_sets')).toBe(1);
  });

  it('cascades from a session to its exercises and sets only', () => {
    seed.exercise(db);
    seed.session(db, 's1');
    seed.sessionExercise(db, 'se1', 's1', 'e1');
    seed.set(db, 'w1', 'se1');
    run(db, "DELETE FROM workout_sessions WHERE id = 's1'");
    expect(count(db, 'session_exercises')).toBe(0);
    expect(count(db, 'workout_sets')).toBe(0);
    expect(count(db, 'exercises')).toBe(1);
  });
});

describe('app settings', () => {
  it('requires a value', () => {
    expect(() => run(db, "INSERT INTO app_settings (key, value, updated_at) VALUES ('units', NULL, 1)")).toThrow(/NOT NULL/);
  });
});
