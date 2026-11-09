/// <reference types="node" />
// Runs the REAL drizzle expo-sqlite driver in Node by faking the few expo-sqlite methods it calls
// (prepareSync / executeSync / executeForRawResultSync) on top of node:sqlite (a real SQLite engine).
// Repositories are therefore tested with exactly the Drizzle code path the app uses.
//
// Known differences from real expo-sqlite (verify on a device, EXL-09):
//  - Errors are re-thrown as plain `Error("Error code <n>: <sqlite message>")` with NO extra properties,
//    like expo's wrapped native errors. Error translation must match the SQLite message text only.
//  - node:sqlite rejects boolean parameters (expo maps them to 1/0) and integers above 2^53; Drizzle
//    already maps booleans, so only raw `sql` templates could trip this in Jest.
//  - The database comes from the shipped migrations via `exec` (createTestDb), so WAL and busy_timeout
//    from configureConnection are not exercised here.
//  - Statements are prepared per execution and never held open, so native statement lifecycle
//    (leaks, "prepared statement ran again" errors) is not modelled.
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { DatabaseSync, StatementSync } from 'node:sqlite';

import { schema } from '../../src/database/schema';
import type { AtlasDb } from '../../src/database/types';
import { createTestDb } from './testDb';

type Param = string | number | null;

const isWrite = (sql: string) => /^\s*(insert|update|delete|replace|with)\b/i.test(sql);

/** Mimics expo-sqlite's wrapped native error: message only, SQLite's primary result code, no extras. */
function wrap(error: unknown): Error {
  const e = error as { message?: string; errcode?: number };
  const code = typeof e.errcode === 'number' ? e.errcode & 0xff : 1;
  return new Error(`Error code ${code}: ${e.message ?? String(error)}`);
}

function fakeStatement(raw: DatabaseSync, sql: string) {
  let stmt: StatementSync;
  try {
    stmt = raw.prepare(sql);
  } catch (error) {
    throw wrap(error);
  }
  const reader = stmt.columns().length > 0; // true for SELECT and for statements with RETURNING
  const counters = () => {
    if (!isWrite(sql)) return { changes: 0, lastInsertRowId: 0 };
    const row = raw.prepare('select changes() as c, last_insert_rowid() as r').get() as { c: number; r: number };
    return { changes: Number(row.c), lastInsertRowId: Number(row.r) };
  };
  const exec = <T>(arrays: boolean, fn: () => T): T => {
    stmt.setReturnArrays(arrays);
    try {
      return fn();
    } catch (error) {
      throw wrap(error);
    }
  };
  return {
    executeSync(params: Param[] = []) {
      if (reader) {
        const rows = exec(false, () => stmt.all(...params)) as Record<string, unknown>[];
        return { ...counters(), getAllSync: () => rows, getFirstSync: () => rows[0] ?? null };
      }
      exec(false, () => stmt.run(...params));
      return { ...counters(), getAllSync: () => [], getFirstSync: () => null };
    },
    executeForRawResultSync(params: Param[] = []) {
      const rows = reader
        ? (exec(true, () => stmt.all(...params)) as unknown as unknown[][])
        : (exec(true, () => stmt.run(...params)), []);
      return { getAllSync: () => rows };
    },
    finalizeSync() {},
  };
}

export interface TestDrizzle {
  db: AtlasDb;
  raw: DatabaseSync;
  close(): void;
}

/** Fresh in-memory database (all migrations applied, foreign keys ON) behind the real drizzle driver. */
export function createDrizzleTestDb(): TestDrizzle {
  const raw = createTestDb();
  const client = { prepareSync: (sql: string) => fakeStatement(raw, sql) };
  const db = drizzle(client as never, { schema }) as AtlasDb;
  return { db, raw, close: () => raw.close() };
}
