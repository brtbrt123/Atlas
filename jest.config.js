/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}', '<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/app/**/*.test.{ts,tsx}'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  // Lets tests load the same generated migration bundle the app uses (drizzle/migrations.js).
  transform: { '\.sql$': '<rootDir>/tests/helpers/sql-transform.js' },
};
