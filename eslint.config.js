const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  globalIgnores(['node_modules', '.expo', 'dist', 'coverage', '.agents', '.claude', '.tools', '.ui-review', 'scripts', 'tools']),
  {
    // Layering (.claude/rules/architecture.md): screens and UI never touch persistence or services.
    // They receive data through adapter hooks in src/hooks.
    files: ['src/features/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}', 'src/theme/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/database', '**/database/*', '**/database/**'], message: 'UI code must not import the database layer; use an adapter hook (src/hooks).' },
            { group: ['**/services', '**/services/*', '**/services/**'], message: 'UI code must not import services directly; use an adapter hook (src/hooks).' },
            { group: ['expo-sqlite', 'drizzle-orm', 'drizzle-orm/*'], message: 'UI code must not import SQLite or Drizzle.' },
          ],
        },
      ],
    },
  },
]);
