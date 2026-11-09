import { defineConfig } from 'drizzle-kit';

// `drizzle-kit generate` only. Never `push` or `drop` against app data (.claude/rules/database.md).
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/database/schema.ts',
  out: './drizzle',
});
