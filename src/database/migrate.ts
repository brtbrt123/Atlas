// Startup migration runner (FND-11). Implements the FK-safe policy from DEC-013:
//   foreign keys OFF around the migration -> apply pending migrations in ONE transaction ->
//   PRAGMA foreign_key_check (any row = failure, roll back) -> foreign keys ON.
// Why not drizzle's migrator: it runs with foreign keys on inside a transaction, where a table
// rebuild would cascade-delete history (proven in tests/integration/migrations.rebuild.test.ts).
//
// Applied migrations are tracked by journal tag in `__atlas_migrations` (DEC-015).
// Every PRAGMA that matters is READ BACK: SQLite silently ignores `PRAGMA foreign_keys` inside an
// open transaction, and expo-sqlite shares one native connection per file.
import { AtlasError } from '../types/errors';

/** Minimal async SQLite surface; expo-sqlite's SQLiteDatabase satisfies it, tests wrap node:sqlite. */
export interface SqlDatabase {
  execAsync(sql: string): Promise<void>;
  getAllAsync<T>(sql: string): Promise<T[]>;
  getFirstAsync<T>(sql: string): Promise<T | null>;
  runAsync(sql: string, ...params: (string | number | null)[]): Promise<unknown>;
}

/** Shape of drizzle/migrations.js. */
export interface MigrationBundle {
  journal: { entries: { idx: number; tag: string }[] };
  migrations: Record<string, string>;
}

const TRACKING_TABLE = '__atlas_migrations';

/** Value of a single-value PRAGMA (e.g. foreign_keys), or null if unreadable. */
async function pragma(db: SqlDatabase, name: string): Promise<string | number | null> {
  const row = await db.getFirstAsync<Record<string, string | number>>(`PRAGMA ${name}`);
  return row ? (Object.values(row)[0] ?? null) : null;
}

/** Per-connection settings; applied on every open, and verified. */
export async function configureConnection(db: SqlDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  await db.execAsync('PRAGMA busy_timeout = 5000');
  const mode = String(await pragma(db, 'journal_mode')).toLowerCase();
  if (mode !== 'wal' && mode !== 'memory') {
    throw new AtlasError('MIGRATION', 'The database could not be configured.', { setting: 'journal_mode', value: mode });
  }
  if (Number(await pragma(db, 'foreign_keys')) !== 1) {
    throw new AtlasError('MIGRATION', 'The database could not be configured.', { setting: 'foreign_keys' });
  }
}

function statementsOf(sql: string): string[] {
  return sql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface MigrationResult {
  applied: string[];
}

export async function runMigrations(db: SqlDatabase, bundle: MigrationBundle): Promise<MigrationResult> {
  const entries = [...bundle.journal.entries].sort((a, b) => a.idx - b.idx);
  const applied: string[] = [];
  let step = 'start';
  let inTransaction = false;

  try {
    step = 'pragma foreign_keys=OFF';
    await db.execAsync('PRAGMA foreign_keys = OFF');
    // Ignored (stays 1) if the shared connection is already inside a transaction: refuse to continue.
    if (Number(await pragma(db, 'foreign_keys')) !== 0) {
      throw new AtlasError('MIGRATION', 'The database is busy. Please restart the app.', { step });
    }

    step = 'create tracking table';
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS ${TRACKING_TABLE} (tag text PRIMARY KEY NOT NULL, applied_at integer NOT NULL)`,
    );

    const done = new Set((await db.getAllAsync<{ tag: string }>(`SELECT tag FROM ${TRACKING_TABLE}`)).map((r) => r.tag));
    const known = new Set(entries.map((e) => e.tag));
    const unknown = [...done].filter((tag) => !known.has(tag));
    if (unknown.length > 0) {
      throw new AtlasError('MIGRATION', 'This data was created by a newer version of ATLAS. Please update the app.', { unknown });
    }

    const pending = entries.filter((e) => !done.has(e.tag));
    if (pending.length > 0) {
      step = 'begin';
      await db.execAsync('BEGIN IMMEDIATE');
      inTransaction = true;
      for (const entry of pending) {
        step = `migration ${entry.tag}`;
        const key = `m${String(entry.idx).padStart(4, '0')}`;
        const sql = bundle.migrations[key];
        if (sql === undefined) throw new AtlasError('MIGRATION', `Migration file missing for ${entry.tag}.`, { key });
        for (const statement of statementsOf(sql)) await db.execAsync(statement);
        await db.runAsync(`INSERT INTO ${TRACKING_TABLE} (tag, applied_at) VALUES (?, ?)`, entry.tag, Date.now());
        applied.push(entry.tag);
      }

      step = 'foreign_key_check';
      const violations = await db.getAllAsync<Record<string, unknown>>('PRAGMA foreign_key_check');
      if (violations.length > 0) {
        throw new AtlasError('MIGRATION', 'The migration left rows that break foreign keys.', {
          violationCount: violations.length,
        });
      }

      step = 'commit';
      await db.execAsync('COMMIT');
      inTransaction = false;
    }
  } catch (error) {
    if (inTransaction) {
      try {
        await db.execAsync('ROLLBACK');
      } catch {
        // connection already unusable; the original error is what matters
      }
    }
    applied.length = 0;
    if (error instanceof AtlasError) throw error;
    throw new AtlasError('MIGRATION', 'The database could not be updated.', { step }, error);
  } finally {
    try {
      await db.execAsync('PRAGMA foreign_keys = ON');
    } catch {
      // verified below on the success path; on failure the migration error is what matters
    }
  }

  step = 'pragma foreign_keys=ON';
  if (Number(await pragma(db, 'foreign_keys')) !== 1) {
    throw new AtlasError('MIGRATION', 'The database could not be configured.', { step });
  }
  return { applied };
}
