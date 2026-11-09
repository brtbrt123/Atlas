const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  globalIgnores(['node_modules', '.expo', 'dist', 'coverage', '.agents', '.claude', '.tools', '.ui-review', 'scripts', 'tools']),
]);
