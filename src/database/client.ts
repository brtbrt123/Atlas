// The only place that opens the app database. Repositories receive the drizzle instance.
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import bundle from '../../drizzle/migrations';
import { schema } from './schema';
import { configureConnection, runMigrations, type MigrationBundle, type SqlDatabase } from './migrate';
import { singleFlight } from './singleFlight';

export const DATABASE_NAME = 'atlas.db';

export type AtlasDb = ReturnType<typeof createDrizzle>;

export function createDrizzle(sqlite: SQLiteDatabase) {
  return drizzle(sqlite, { schema });
}

export interface OpenedDatabase {
  sqlite: SQLiteDatabase;
  db: AtlasDb;
}

export type OpenAndMigrate = () => Promise<OpenedDatabase>;

/**
 * Opens the app database, configures the connection and applies pending migrations. Single-flight:
 * every caller (effect re-runs, retries, fast refresh) shares one attempt and one connection.
 */
export const openAndMigrate: OpenAndMigrate = singleFlight(async () => {
  const sqlite = await openDatabaseAsync(DATABASE_NAME);
  try {
    await configureConnection(sqlite as SqlDatabase);
    await runMigrations(sqlite as SqlDatabase, bundle as unknown as MigrationBundle);
  } catch (error) {
    await sqlite.closeAsync().catch(() => undefined);
    throw error;
  }
  return { sqlite, db: createDrizzle(sqlite) };
});
