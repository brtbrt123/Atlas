/// <reference types="node" />
// In-memory SQLite for tests, built from the SAME generated migration bundle the app ships
// (drizzle/migrations.js). Uses Node's built-in `node:sqlite` (real SQLite engine, no mocks).
import { DatabaseSync } from 'node:sqlite';

import bundle from '../../drizzle/migrations';

export type TestDb = DatabaseSync;

/** Ordered migration SQL statements from the bundle (journal order, split on drizzle breakpoints). */
export function migrationStatements(): string[] {
  const { journal, migrations } = bundle as {
    journal: { entries: { idx: number }[] };
    migrations: Record<string, string>;
  };
  return journal.entries
    .flatMap((entry) => (migrations[`m${String(entry.idx).padStart(4, '0')}`] ?? '').split('--> statement-breakpoint'))
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Fresh database with foreign keys ON and every migration applied. */
export function createTestDb(): TestDb {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  for (const statement of migrationStatements()) db.exec(statement);
  return db;
}

export function run(db: TestDb, sql: string, ...params: (string | number | null)[]) {
  return db.prepare(sql).run(...params);
}

export function get<T = Record<string, unknown>>(db: TestDb, sql: string, ...params: (string | number | null)[]): T {
  return db.prepare(sql).get(...params) as T;
}

export function count(db: TestDb, table: string): number {
  return get<{ c: number }>(db, `SELECT count(*) AS c FROM ${table}`).c;
}

const T = 1_000;

export const seed = {
  exercise(db: TestDb, id = 'e1', extra: { builtinKey?: string | null; name?: string } = {}) {
    run(
      db,
      'INSERT INTO exercises (id, name, builtin_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      id,
      extra.name ?? `Exercise ${id}`,
      extra.builtinKey ?? null,
      T,
      T,
    );
    return id;
  },
  routine(db: TestDb, id = 'r1') {
    run(db, 'INSERT INTO routines (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)', id, `Routine ${id}`, T, T);
    return id;
  },
  session(db: TestDb, id = 's1', opts: { status?: 'active' | 'completed'; routineId?: string | null; endedAt?: number | null } = {}) {
    const status = opts.status ?? 'active';
    run(
      db,
      'INSERT INTO workout_sessions (id, routine_id, name, status, started_at, ended_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id,
      opts.routineId ?? null,
      `Session ${id}`,
      status,
      T,
      status === 'completed' ? (opts.endedAt ?? 2 * T) : null,
      T,
      T,
    );
    return id;
  },
  sessionExercise(db: TestDb, id: string, sessionId: string, exerciseId: string | null, position = 0) {
    run(
      db,
      "INSERT INTO session_exercises (id, session_id, exercise_id, name, tracking_type, position) VALUES (?, ?, ?, 'Snapshot name', 'weight_reps', ?)",
      id,
      sessionId,
      exerciseId,
      position,
    );
    return id;
  },
  set(db: TestDb, id: string, sessionExerciseId: string, position = 0) {
    run(
      db,
      'INSERT INTO workout_sets (id, session_exercise_id, position, weight_kg, reps, created_at, updated_at) VALUES (?, ?, ?, 60, 8, ?, ?)',
      id,
      sessionExerciseId,
      position,
      T,
      T,
    );
    return id;
  },
};
