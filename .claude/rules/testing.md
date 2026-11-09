---
paths:
  - "tests/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "jest.config.*"
  - "jest.setup.*"
  - "src/database/**"
  - "src/services/**"
  - "src/stores/**"
---

# Testing rules

## Runners

- Jest via `jest-expo` (SDK-matched). Gate: `npm test -- --runInBand`.
- React Native Testing Library for hook/component behavior (see the `react-native-testing` skill; check the installed RNTL/React versions before choosing sync vs async render APIs).
- Maestro for device journeys once a development build exists (not yet installed). iOS Maestro needs macOS or Maestro Cloud.

## What Claude Code tests (unit + integration)

- Repositories and migrations against a real in-memory SQLite database in Node (same Drizzle schema and generated migrations as the app) — no mocking of SQL.
- Services: business rules, validation, transactions (assert rollback on failure), one-active-workout enforcement, history snapshots surviving routine/exercise edits, unit conversion round-trips, analytics excluding incomplete sets.
- Recovery: an active session persisted mid-workout is restored intact after "restart" (new DB connection).
- Stores/adapter hooks: state transitions and that persistence callbacks resolve only after commit and reject on failure.

Codex owns UI rendering/accessibility tests; do not write or edit tests under Codex-owned paths.

## Conventions

- Test files: `tests/unit/**`, `tests/integration/**`, or co-located `*.test.ts` next to Claude-owned modules.
- Deterministic: inject clock and UUID generator; no real timers, network or wall-clock dependence.
- Each bug fix adds a failing test first.
- Never mark tests skipped/only in committed code. Never claim a test passed unless it was run; report exact commands and results.
