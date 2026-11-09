# Architecture rules

## Layering (dependencies point downward only)

```
app/**                 Expo Router routes + layouts (Claude). Thin: read params, call hooks, render a Codex screen.
src/features/**        Screens and feature UI (Codex). Receive data + callbacks via props/hooks only.
src/hooks/**           Adapter hooks (Claude). Bridge services/stores to UI-friendly models.
src/stores/**          Zustand stores (Claude). UI/session cache only — SQLite is the source of truth.
src/services/**        Domain services (Claude). Business rules, validation, orchestration, transactions.
src/database/**        Drizzle schema, client, migrations, repositories (Claude). The only code that touches SQLite.
src/types/**           Zod schemas + inferred domain types, shared enums, Result/error types (Claude).
```

- Screens and components never import from `src/database/**` or call SQL. Hooks never import repositories directly — go through services.
- Services depend on repository **interfaces**, so they can be tested with an in-memory database.
- Domain types are defined once in `src/types` (Zod schema → `z.infer`). Do not hand-write parallel interfaces.
- Contracts consumed by Codex are documented in `docs/CONTRACTS.md` and change only with a handoff entry.

## Errors and results

- Services return typed results or throw typed domain errors (`AtlasError` with a `code`); never leak raw SQLite errors to UI.
- A UI callback that represents persistence (e.g. completing a set) resolves only after the write commits and rejects on failure.

## State

- Zustand holds ephemeral UI/session state and caches; anything that must survive termination is written to SQLite first.
- Active-workout duration and rest timers derive from stored timestamps, not from JS intervals.
- Exactly one active workout; app start restores it from the database.

## Units, time, identity

- Weights stored in kilograms (REAL); convert only at the display/input adapter. Changing units never rewrites stored data.
- Timestamps stored as integer epoch milliseconds (UTC); format at the edge.
- Primary keys are UUID v4 strings generated in the app.

## Scope discipline

- Implement one milestone / feature slice at a time; no speculative abstractions.
- Out of MVP scope: social, AI prescriptions, calorie tracking, wearables, payments, cloud sync.
