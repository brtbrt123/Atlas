/** @jest-environment node */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import bundle from '../../drizzle/migrations';
import { configureConnection, runMigrations, type MigrationBundle } from '../../src/database/migrate';
import { AtlasError } from '../../src/types';
import { asyncDb, type NodeAsyncDb } from '../helpers/asyncDb';

const real = bundle as unknown as MigrationBundle;
let db: NodeAsyncDb;
beforeEach(() => {
  db = asyncDb();
});
afterEach(() => db.close());

const one = (sql: string) => db.raw.prepare(sql).get() as Record<string, number | string>;
const tableCount = () => (one("SELECT count(*) AS c FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").c as number);

describe('runMigrations', () => {
  it('applies the shipped migration to an empty database and leaves foreign keys ON', async () => {
    await configureConnection(db);
    const result = await runMigrations(db, real);
    expect(result.applied).toEqual(['0000_init']);
    expect(tableCount()).toBe(10); // nine app tables + __atlas_migrations
    expect(one('PRAGMA foreign_keys').foreign_keys).toBe(1);
  });

  it('is idempotent: a second run applies nothing', async () => {
    await runMigrations(db, real);
    expect((await runMigrations(db, real)).applied).toEqual([]);
    expect(one('SELECT count(*) AS c FROM __atlas_migrations').c).toBe(1);
  });

  it('applies only new migrations to an existing database and keeps its data', async () => {
    await runMigrations(db, real);
    db.raw.exec("INSERT INTO exercises (id, name, created_at, updated_at) VALUES ('e1', 'Bench', 1, 1)");
    const next: MigrationBundle = {
      journal: { entries: [...real.journal.entries, { idx: 1, tag: '0001_add_col' }] },
      migrations: { ...real.migrations, m0001: 'ALTER TABLE `exercises` ADD `color` text;' },
    };
    expect((await runMigrations(db, next)).applied).toEqual(['0001_add_col']);
    expect(one("SELECT name FROM exercises WHERE id = 'e1'").name).toBe('Bench');
    expect(() => db.raw.exec("UPDATE exercises SET color = 'red'")).not.toThrow();
  });

  it('rolls back everything when a migration fails and reports a MIGRATION error', async () => {
    const broken: MigrationBundle = {
      journal: { entries: [{ idx: 0, tag: '0000_init' }, { idx: 1, tag: '0001_broken' }] },
      migrations: { ...real.migrations, m0001: 'CREATE TABLE ok_table (id text);--> statement-breakpoint\nTHIS IS NOT SQL;' },
    };
    const error = await runMigrations(db, broken).catch((e) => e);
    expect(error).toBeInstanceOf(AtlasError);
    expect(error.code).toBe('MIGRATION');
    expect(error.details).toEqual({ step: 'migration 0001_broken' });
    // atomic: not even the good first migration or the earlier statement of the broken one remain
    expect(tableCount()).toBe(1); // only the tracking table created before the transaction
    expect(one('SELECT count(*) AS c FROM __atlas_migrations').c).toBe(0);
    expect(one('PRAGMA foreign_keys').foreign_keys).toBe(1);
  });

  it('rejects a database created by a newer app version', async () => {
    await runMigrations(db, real);
    db.raw.exec("INSERT INTO __atlas_migrations (tag, applied_at) VALUES ('0099_future', 1)");
    const error = await runMigrations(db, real).catch((e) => e);
    expect(error.code).toBe('MIGRATION');
    expect(error.details).toEqual({ unknown: ['0099_future'] });
  });

  it('rejects a journal entry with no SQL', async () => {
    const error = await runMigrations(db, { journal: { entries: [{ idx: 0, tag: '0000_init' }] }, migrations: {} }).catch((e) => e);
    expect(error.code).toBe('MIGRATION');
  });

  it('rolls back a table rebuild that orphans rows (foreign_key_check) and keeps all data', async () => {
    await runMigrations(db, real);
    db.raw.exec("INSERT INTO exercises (id, name, created_at, updated_at) VALUES ('e1', 'Bench', 1, 1)");
    db.raw.exec("INSERT INTO exercise_muscles VALUES ('e1', 'chest', 'primary')");
    const orphaning: MigrationBundle = {
      journal: { entries: [...real.journal.entries, { idx: 1, tag: '0001_orphan' }] },
      migrations: { ...real.migrations, m0001: 'DROP TABLE `exercises`;--> statement-breakpoint\nCREATE TABLE `exercises` (`id` text PRIMARY KEY NOT NULL);' },
    };
    const error = await runMigrations(db, orphaning).catch((e) => e);
    expect(error.code).toBe('MIGRATION');
    expect(error.details).toEqual({ violationCount: 1 });
    expect(one('SELECT count(*) AS c FROM exercises').c).toBe(1);
    expect(one('SELECT count(*) AS c FROM exercise_muscles').c).toBe(1);
  });

  it('keeps history intact through a real table-rebuild migration (DEC-013)', async () => {
    await runMigrations(db, real);
    db.raw.exec("INSERT INTO exercises (id, name, created_at, updated_at) VALUES ('e1', 'Bench', 1, 1)");
    db.raw.exec("INSERT INTO exercise_muscles VALUES ('e1', 'chest', 'primary')");
    db.raw.exec("INSERT INTO workout_sessions (id, name, status, started_at, ended_at, created_at, updated_at) VALUES ('s1', 'S', 'completed', 1, 2, 1, 1)");
    db.raw.exec("INSERT INTO session_exercises (id, session_id, exercise_id, name, tracking_type, position) VALUES ('se1', 's1', 'e1', 'Bench', 'weight_reps', 0)");
    const rebuild: MigrationBundle = {
      journal: { entries: [...real.journal.entries, { idx: 1, tag: '0001_rebuild' }] },
      migrations: {
        ...real.migrations,
        m0001: [
          'CREATE TABLE `__new_exercises` (`id` text PRIMARY KEY NOT NULL, `builtin_key` text, `name` text NOT NULL, `equipment` text, `tracking_type` text DEFAULT \'weight_reps\' NOT NULL, `is_custom` integer DEFAULT false NOT NULL, `is_archived` integer DEFAULT false NOT NULL, `notes` text, `created_at` integer NOT NULL, `updated_at` integer NOT NULL)',
          'INSERT INTO `__new_exercises` SELECT * FROM `exercises`',
          'DROP TABLE `exercises`',
          'ALTER TABLE `__new_exercises` RENAME TO `exercises`',
          'CREATE UNIQUE INDEX `exercises_builtin_key_uq` ON `exercises` (`builtin_key`)',
        ].join('--> statement-breakpoint\n'),
      },
    };
    expect((await runMigrations(db, rebuild)).applied).toEqual(['0001_rebuild']);
    expect(one('SELECT count(*) AS c FROM exercise_muscles').c).toBe(1);
    expect(one("SELECT exercise_id AS x FROM session_exercises WHERE id = 'se1'").x).toBe('e1');
  });
});

describe('safety checks (FND-11 review)', () => {
  it('refuses to run when foreign_keys cannot be turned OFF (connection already in a transaction)', async () => {
    db.raw.exec('BEGIN');
    const error = await runMigrations(db, real).catch((e) => e);
    expect(error.code).toBe('MIGRATION');
    expect(error.message).toMatch(/busy/i);
    db.raw.exec('ROLLBACK');
    expect(tableCount()).toBe(0);
  });

  it('stores migration tags with a bound parameter (a quote in a tag cannot break the SQL)', async () => {
    const quirky: MigrationBundle = {
      journal: { entries: [{ idx: 0, tag: "0000_o'brien" }] },
      migrations: { m0000: 'CREATE TABLE t (id text);' },
    };
    await runMigrations(db, quirky);
    expect(one('SELECT tag FROM __atlas_migrations').tag).toBe("0000_o'brien");
  });

  it('is harmless when a rebuild migration contains its own PRAGMA foreign_keys statements (drizzle-kit style)', async () => {
    await runMigrations(db, real);
    db.raw.exec("INSERT INTO exercises (id, name, created_at, updated_at) VALUES ('e1', 'Bench', 1, 1)");
    db.raw.exec("INSERT INTO exercise_muscles VALUES ('e1', 'chest', 'primary')");
    const withPragmas: MigrationBundle = {
      journal: { entries: [...real.journal.entries, { idx: 1, tag: '0001_pragmas' }] },
      migrations: {
        ...real.migrations,
        m0001: [
          'PRAGMA foreign_keys=OFF',
          "CREATE TABLE `__new_exercises` (`id` text PRIMARY KEY NOT NULL, `builtin_key` text, `name` text NOT NULL, `equipment` text, `tracking_type` text DEFAULT 'weight_reps' NOT NULL, `is_custom` integer DEFAULT false NOT NULL, `is_archived` integer DEFAULT false NOT NULL, `notes` text, `created_at` integer NOT NULL, `updated_at` integer NOT NULL)",
          'INSERT INTO `__new_exercises` SELECT * FROM `exercises`',
          'DROP TABLE `exercises`',
          'ALTER TABLE `__new_exercises` RENAME TO `exercises`',
          'PRAGMA foreign_keys=ON',
        ].join('--> statement-breakpoint\n'),
      },
    };
    await runMigrations(db, withPragmas);
    expect(one('SELECT count(*) AS c FROM exercise_muscles').c).toBe(1);
    expect(one('PRAGMA foreign_keys').foreign_keys).toBe(1);
  });
});

describe('configureConnection', () => {
  it('turns on foreign keys and WAL on a file database, with a busy timeout', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-db-'));
    const file = asyncDb(path.join(dir, 'atlas.db'));
    try {
      await configureConnection(file);
      expect(file.raw.prepare('PRAGMA journal_mode').get()).toEqual({ journal_mode: 'wal' });
      expect(file.raw.prepare('PRAGMA foreign_keys').get()).toEqual({ foreign_keys: 1 });
      expect(file.raw.prepare('PRAGMA busy_timeout').get()).toEqual({ timeout: 5000 });
      await runMigrations(file, real);
      expect(file.raw.prepare('PRAGMA foreign_keys').get()).toEqual({ foreign_keys: 1 });
    } finally {
      file.close();
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
