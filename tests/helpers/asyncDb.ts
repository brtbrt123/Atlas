/// <reference types="node" />
// Wraps node:sqlite in the async SqlDatabase interface used by the migration runner and the
// database gate, so they run against a real SQLite engine in Jest.
import { DatabaseSync } from 'node:sqlite';

import type { SqlDatabase } from '../../src/database/migrate';

export type NodeAsyncDb = SqlDatabase & { raw: DatabaseSync; close(): void };

export function asyncDb(path = ':memory:'): NodeAsyncDb {
  const raw = new DatabaseSync(path);
  return {
    raw,
    async execAsync(sql) {
      raw.exec(sql);
    },
    async getAllAsync<T>(sql: string) {
      return raw.prepare(sql).all() as T[];
    },
    async getFirstAsync<T>(sql: string) {
      return (raw.prepare(sql).get() as T | undefined) ?? null;
    },
    async runAsync(sql, ...params) {
      return raw.prepare(sql).run(...params);
    },
    close() {
      raw.close();
    },
  };
}
