// The drizzle database types shared by the client, repositories and tests (a type-only module, so
// importing it never loads expo-sqlite). The Expo driver is synchronous; repositories use the sync
// API (.all/.get/.run and sync transactions) so the same code runs in the app and in Jest.
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import type { SQLiteRunResult } from 'expo-sqlite';

import type { schema } from './schema';

/** The top-level database handle opened at startup. */
export type AtlasDb = ExpoSQLiteDatabase<typeof schema>;

/**
 * What repositories accept: the top-level database OR a transaction handle. A service composes
 * several repositories in one transaction with `db.transaction((tx) => createXRepository(tx)...)`;
 * a repository's own `transaction()` call inside it becomes a savepoint, so each stays atomic.
 */
export type AtlasExecutor = BaseSQLiteDatabase<'sync', SQLiteRunResult, typeof schema>;
