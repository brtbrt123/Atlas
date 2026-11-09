/** @jest-environment node */
// DEC-013: SQLite cannot alter CHECK constraints, so adding an enum value (e.g. a new tracking
// type) makes drizzle-kit emit a table REBUILD. Run inside a transaction with foreign keys ON,
// dropping the old parent table cascades/nulls child rows, destroying workout history.
// These tests pin both the hazard and the policy (FKs off around migrate + foreign_key_check)
// that the startup runner (FND-11) must implement.
import { count, createTestDb, get, run, seed, type TestDb } from '../helpers/testDb';

// What drizzle-kit generates when 'assisted' is added to exercises.tracking_type.
const REBUILD_EXERCISES = [
  `CREATE TABLE \`__new_exercises\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`builtin_key\` text,
    \`name\` text NOT NULL,
    \`equipment\` text,
    \`tracking_type\` text DEFAULT 'weight_reps' NOT NULL,
    \`is_custom\` integer DEFAULT false NOT NULL,
    \`is_archived\` integer DEFAULT false NOT NULL,
    \`notes\` text,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL,
    CONSTRAINT "exercises_name_not_blank" CHECK(length(trim(name)) > 0),
    CONSTRAINT "exercises_tracking_type_valid" CHECK(tracking_type IN ('weight_reps', 'bodyweight_reps', 'duration', 'distance_duration', 'assisted'))
  )`,
  'INSERT INTO `__new_exercises` SELECT `id`, `builtin_key`, `name`, `equipment`, `tracking_type`, `is_custom`, `is_archived`, `notes`, `created_at`, `updated_at` FROM `exercises`',
  'DROP TABLE `exercises`',
  'ALTER TABLE `__new_exercises` RENAME TO `exercises`',
  'CREATE UNIQUE INDEX `exercises_builtin_key_uq` ON `exercises` (`builtin_key`)',
];

/** The policy the startup runner must follow (DEC-013). */
function applyFkSafe(db: TestDb, statements: string[]) {
  db.exec('PRAGMA foreign_keys = OFF');
  try {
    db.exec('BEGIN');
    try {
      for (const s of statements) db.exec(s);
      const violations = db.prepare('PRAGMA foreign_key_check').all();
      if (violations.length > 0) throw new Error(`foreign_key_check failed: ${JSON.stringify(violations)}`);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  } finally {
    db.exec('PRAGMA foreign_keys = ON');
  }
}

/** Populated database: a routine, a completed session with history, muscles. */
function populate(db: TestDb) {
  seed.exercise(db, 'e1', { name: 'Bench Press' });
  run(db, "INSERT INTO exercise_muscles VALUES ('e1', 'chest', 'primary')");
  run(db, "INSERT INTO exercise_muscles VALUES ('e1', 'triceps', 'secondary')");
  seed.routine(db, 'r1');
  run(db, "INSERT INTO routine_exercises (id, routine_id, exercise_id, position) VALUES ('re1', 'r1', 'e1', 0)");
  seed.session(db, 's1', { status: 'completed', routineId: 'r1' });
  seed.sessionExercise(db, 'se1', 's1', 'e1');
  seed.set(db, 'w1', 'se1');
}

describe('table-rebuild migration on a populated database', () => {
  it('HAZARD: with foreign keys ON a rebuild is blocked by RESTRICT or wipes child rows', () => {
    const db = createTestDb();
    populate(db);
    // routine_exercises uses ON DELETE RESTRICT, so the rebuild aborts while a routine uses the exercise.
    db.exec('BEGIN');
    expect(() => REBUILD_EXERCISES.forEach((s) => db.exec(s))).toThrow(/FOREIGN KEY/);
    db.exec('ROLLBACK');

    // Without routine usage, the rebuild "succeeds" but silently destroys history links and muscles.
    run(db, "DELETE FROM routine_exercises WHERE id = 're1'");
    db.exec('BEGIN');
    REBUILD_EXERCISES.forEach((s) => db.exec(s));
    db.exec('COMMIT');
    expect(count(db, 'exercise_muscles')).toBe(0);
    expect(get<{ exercise_id: string | null }>(db, "SELECT exercise_id FROM session_exercises WHERE id = 'se1'").exercise_id).toBeNull();
    db.close();
  });

  it('POLICY: with foreign keys off around the migration, all data and links survive', () => {
    const db = createTestDb();
    populate(db);
    applyFkSafe(db, REBUILD_EXERCISES);

    expect(get<{ foreign_keys: number }>(db, 'PRAGMA foreign_keys').foreign_keys).toBe(1);
    expect(count(db, 'exercises')).toBe(1);
    expect(count(db, 'exercise_muscles')).toBe(2);
    expect(count(db, 'routine_exercises')).toBe(1);
    expect(get(db, "SELECT exercise_id, name FROM session_exercises WHERE id = 'se1'")).toEqual({
      exercise_id: 'e1',
      name: 'Snapshot name',
    });
    expect(count(db, 'workout_sets')).toBe(1);
    // The new enum value is accepted and old constraints still apply.
    expect(() =>
      run(db, "INSERT INTO exercises (id, name, tracking_type, created_at, updated_at) VALUES ('e2', 'Assisted Pull-up', 'assisted', 1, 1)"),
    ).not.toThrow();
    expect(() => run(db, "INSERT INTO exercises (id, name, created_at, updated_at) VALUES ('e3', '  ', 1, 1)")).toThrow(/not_blank/);
    expect(() => run(db, "INSERT INTO exercises (id, name, builtin_key, created_at, updated_at) VALUES ('e4', 'A', 'k', 1, 1)")).not.toThrow();
    expect(() => run(db, "INSERT INTO exercises (id, name, builtin_key, created_at, updated_at) VALUES ('e5', 'B', 'k', 1, 1)")).toThrow(/UNIQUE/);
    db.close();
  });

  it('POLICY: a rebuild that leaves orphans is rejected and rolled back', () => {
    const db = createTestDb();
    populate(db);
    const dropWithoutRebuild = ['DROP TABLE `exercises`', 'CREATE TABLE `exercises` (`id` text PRIMARY KEY NOT NULL)'];
    expect(() => applyFkSafe(db, dropWithoutRebuild)).toThrow(/foreign_key_check failed/);
    expect(count(db, 'exercises')).toBe(1);
    expect(get<{ foreign_keys: number }>(db, 'PRAGMA foreign_keys').foreign_keys).toBe(1);
    db.close();
  });
});
