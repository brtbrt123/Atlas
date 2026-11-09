# ATLAS feature tracker

The single source of truth for ATLAS work status. Shared by Claude Code and Codex; structure maintained by Claude Code. Progress figures live in `docs/PROJECT_STATUS.md` and are generated from this file by `node scripts/tracker.mjs --write`, never typed by hand.

## How to use this tracker

**One task = one table row.** Edit only the row you are changing (never rewrite the file), so concurrent edits by both agents don't collide and Git merges stay line-local. Do not put `|` inside a cell.

| Column | Rule |
|---|---|
| ID | `<PREFIX>-<NN>`, unique, never reused or renumbered. New tasks take the next free number in their milestone. |
| Task | One small, verifiable outcome. |
| Owner | `Claude Code` (architecture, persistence, logic, integration, builds), `Codex` (UI/UX, design system, accessibility, UI tests) or `Shared`. Only the owner changes a task's status; `Shared` tasks are updated by whoever performs the verification step. |
| Status | One of the six statuses below. |
| Depends on | Comma-separated task IDs, or `—`. |
| Acceptance criteria | What must be observably true for Done. |
| Evidence | For **Done**: the command(s) run and result, file paths, commit, screenshot path and date. For **Blocked**: must start with `Blocker:`. Otherwise optional notes (e.g. location of an unverified draft). |

| Status | Meaning |
|---|---|
| Backlog | Defined; not started, or dependencies not yet Done. |
| Ready | All dependencies Done; can start once the user approves feature work. |
| In Progress | Being worked on, or verification failed and it is being fixed. |
| Blocked | Cannot proceed: an external prerequisite (account, hardware, decision) or a stalled dependency. Evidence names the blocker. |
| In Review | Implemented; awaiting verification evidence or the other agent's/user's review. Not counted as complete. |
| Done | Every acceptance criterion met, required checks run and passing, evidence recorded. Never for partial, mocked, draft or untested work, and never while tests fail. |

After changing any row: run `node scripts/tracker.mjs --write` (validates rules and regenerates `docs/PROJECT_STATUS.md`), then record verified changes in `docs/CHANGELOG.md`, decisions in `docs/DECISIONS.md`, and anything the other agent must act on in `docs/HANDOFFS.md`.

## M1 · Project Foundation

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| FND-01 | Git repository on `main` with LF normalization and merged ignore rules | Shared | Done | — | Repo exists on `main`; `.gitattributes` enforces LF; `.gitignore` holds both agents' entries plus secrets/native/build ignores | 2026-11-09: `git symbolic-ref --short HEAD` → `main`; `.gitattributes` (`* text=auto eol=lf`); `.gitignore` merged and restored per HANDOFFS 2026-11-09. No commits yet (see FND-05). |
| FND-02 | Claude Code harness: CLAUDE.md, rules, subagents, hooks, permissions, plugins, LSP | Claude Code | Done | — | Hooks pass scripted tests; plugins enabled; LSP answers; settings valid; tooling documented with sources | 2026-11-09 (docs/TOOLING.md): hook tests 21/21 PASS; Stop-hook tests 4/4 PASS; LSP `initialize` PASS; `claude doctor` no issues; `claude plugin list` shows expo, typescript-lsp, context7 enabled; live PostToolUse/SessionEnd hooks observed. Re-verified 2026-11-09 after adding tracker validation to stop-checks.mjs: hook tests ALL PASSED, Stop-hook tests 4/4 PASS (an earlier 2 failures came from a stale test fixture, not the hook), tracker --check runs in the Stop hook. |
| FND-03 | Codex harness: AGENTS.md, pinned `.agents/skills`, UI_ENVIRONMENT/UI_REVIEW docs, project-local Maestro | Codex | In Review | — | `node tools/verify-ui-setup.mjs` exits 0; skills match `docs/skills.lock.json`; Maestro CLI version verified | 2026-11-09 Codex: static verifier PASS for 7 bundles; Maestro launcher returns 2.12.1 in the tool's PowerShell 7.6.9 session. Java stderr failure reproduced in PowerShell 5.1 and repaired with Process-based capture; isolated probe passes in 5.1. Full script invocation in 5.1 is blocked by its execution policy; no policy changed. |
| FND-04 | Milestone tracking system: tracker, status, changelog, decisions, handoffs, validator | Claude Code | Done | — | `node scripts/tracker.mjs --check` exits 0; all five tracking docs exist; Stop hook validates tracker edits | 2026-11-09: `node scripts/tracker.mjs --check` → `Tracker: OK`; docs/PROJECT_STATUS.md, FEATURE_TRACKER.md, CHANGELOG.md, DECISIONS.md, HANDOFFS.md present; stop-checks.mjs runs the validator when the tracker is edited. |
| FND-05 | Baseline commit of the current setup and private GitHub remote | Shared | Ready | FND-01 | First commit on `main` with the user's Git identity and agreed attribution; private repo created; push approved by the user | Partial 2026-11-09: baseline commit ee75740 on main (125 files, user git identity, no AI trailer per AGENTS.md). Remaining: private GitHub repo and push, each needing user approval. |
| FND-06 | Scaffold Expo SDK 58 app in place: strict TypeScript, `@/` alias, typed routes, `expo-dev-client`; existing `src/` preserved | Claude Code | Done | FND-02 | `npx expo install --check` clean; `npx tsc --noEmit` passes (Codex drafts compile or exclusions are documented); `npx expo export --platform android` succeeds; no Codex file modified | 2026-11-09: root package.json/app.json/tsconfig.json + app/_layout.tsx, app/index.tsx added; `npm install` ok; `npx expo install --check` → "Dependencies are up to date"; `npx tsc --noEmit` exit 0 (Codex `src/` drafts compile, none modified); `npx expo export --platform android` exit 0 (2.5MB Hermes bundle). Placeholder app id com.atlas.fitness (REL-01 to confirm). |
| FND-07 | Lint and test tooling: ESLint (expo config), Jest via jest-expo, RNTL; npm scripts for the three gates | Claude Code | Done | FND-06 | `npm run lint` and `npm test -- --runInBand` run (with a sample test); hook ESLint and Jest paths observed working live | 2026-11-09: eslint 9 + eslint-config-expo, jest 30 + jest-expo, RNTL 14 installed (react-dom pinned 19.3.0). After the user-approved one-line fix to Codex draft ActiveWorkoutScreen.tsx:13 (lazy `useState(() => Date.now())`): `npx tsc --noEmit` exit 0; `npm run lint` exit 0; `npm test -- --runInBand` 2 suites / 7 tests PASS; `node tools/verify-ui-setup.mjs` PASS. Hooks observed live: lint-file blocks on lint errors, stop-checks PASS tsc + jest --findRelatedTests. |
| FND-08 | NativeWind 4.2 + Tailwind 3.4 consuming `src/theme` tokens without duplicating values | Claude Code | Backlog | FND-06, DS-01 | Tailwind config imports token values; a token class renders in a dev build; export succeeds; Codex reviews | — |
| FND-09 | Expo Router skeleton: tabs (Home, Exercises, Routines, History, Progress), Settings, `session/active`, `routine/[id]`, `exercise/[id]` | Claude Code | Ready | FND-06 | Thin route files compile with typed routes; route map recorded in docs/CONTRACTS.md; navigation smoke test passes | — |
| FND-10 | Drizzle schema for the nine spec tables plus the first generated migration | Claude Code | Done | FND-06 | UUID text keys, explicit FKs, kg REAL, epoch-ms timestamps, one-active partial unique index; `drizzle-kit generate` output reviewed and committed | 2026-11-09: src/database/schema.ts + drizzle.config.ts + generated drizzle/0000_init.sql (regenerated after review, SQL read by hand); `npx drizzle-kit check` OK; 28 constraint checks PASS on real SQLite (node:sqlite); tsc/lint/test pass; architecture-reviewer APPROVE WITH FIXES, fixes applied, policies in DEC-012; docs/DATABASE.md written. Committed 2026-11-09 with user approval (see git log). |
| FND-11 | Startup migration runner with blocking error state; WAL and `foreign_keys` pragmas | Claude Code | Backlog | FND-09, FND-10 | Migrations apply before any route renders; a forced failure shows the blocking error state; pragmas verified by test; runner sets foreign_keys OFF around migrate(), runs foreign_key_check, then ON (DEC-012); .sql loads in Metro | — |
| FND-12 | Node test harness: in-memory SQLite running the generated migrations; constraint tests | Claude Code | Backlog | FND-07, FND-10 | Tests prove FK enforcement, one-active-workout index and migrate-from-empty; runs inside `npm test`; includes a populated-data table-rebuild migration test (history rows and links unchanged); .sql loads in Jest | — |
| FND-13 | Domain contracts v1: Zod schemas and types, `Result`/`AtlasError`, service interfaces; CONTRACTS, ARCHITECTURE and DATABASE docs | Claude Code | Backlog | FND-10 | Types compile; schemas tested; docs list each contract with invariants and error behaviour; Codex acknowledges in HANDOFFS | — |
| FND-14 | Codex preview mounted in a development-only route; drafts compile under strict TypeScript | Shared | Backlog | FND-09 | Dev route renders AtlasPreview with its mock banner; excluded from production navigation; `tsc` passes | — |
| FND-15 | Android development build installs and launches on a physical device | Claude Code | Blocked | FND-11 | Dev build installs, launches, runs migrations and shows the tab shell on a physical Android phone | Blocker: no JDK 17 / Android Studio / SDK on this PC (free local APK build); also needs FND-11. |
| FND-16 | Approved workflow skill guidance shared with Claude Code: Ponytail and selected Superpowers skills | Codex | Done | — | Three pinned Markdown-only skill bundles installed; hashes match upstream; Claude pointers resolve to the same copies; no plugin hooks installed | 2026-11-09: upstream Git blob comparison PASS for 6 new Markdown files; `node tools/verify-ui-setup.mjs` exit 0 for all 7 skill bundles and 3 Claude pointers. Lock: docs/skills.lock.json. Host discovery/invocation pending next session; no runtime plugin installed. |

## M2 · Design System

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| DS-01 | Design tokens: palette, typography with tabular numerals, 4-pt spacing, radii, motion with reduced variants, accessibility thresholds, component variants | Codex | Done | — | Exact spec palette; contrast thresholds pass; tokens compile under strict TS; single entry point `src/theme/tokens.ts` | 2026-11-09 Codex sign-off: `npm run typecheck` exit 0 with strict tsconfig and all src/theme files included; `node tools/verify-ui-setup.mjs` exact palette, contrast, type scale, spacing and reduced-motion invariants PASS. Entry point src/theme/tokens.ts. Native motion behavior remains DS-04/DS-05. |
| DS-02 | Core primitives: Type, Button, Card, Screen, Section, Feedback with variants, disabled/busy states and accessibility roles | Codex | In Review | DS-01, FND-06 | Primitives compile, render on device in all states, expose roles/labels, use only tokens | 2026-11-09: src/components/ui.tsx now consumes semantic variants and type/spacing tokens; tests/ui/primitives.test.tsx 6/6 PASS; strict typecheck and lint PASS; full test suite 7/7 PASS. Pending native device rendering, large-text/screenshots and assistive-technology review; no route wiring changed. |
| DS-03 | Numeric entry primitive for weight, reps and RPE: validation, invalid/focus states, unit label, numeric keyboard | Codex | Backlog | DS-02 | Rejects invalid input visibly; announces unit and value to screen readers; 48-pt targets | — |
| DS-04 | Reduced motion and dynamic type: honours system setting changes; text scales to 200% without clipping | Codex | Backlog | DS-02 | Verified on device at default and largest text; reduced motion removes spatial animation | Draft `useReducedMotion` exists in `src/components/ui.tsx` (unverified). |
| DS-05 | Press and haptic feedback primitive: optional, platform-aware, never the only feedback | Codex | Backlog | DS-02 | Works with haptics disabled; no feedback implies persistence before service confirmation | — |
| DS-06 | Navigation chrome styled with tokens: tab bar and headers on native stack/tabs | Codex | Backlog | FND-09, DS-01 | Tab bar and headers use tokens; native transitions retained; screen-reader labels on tabs | — |
| DS-07 | RNTL tests for primitives: roles, names, disabled/busy, invalid numeric input | Codex | Backlog | FND-07, DS-02, DS-03 | Tests run in `npm test` and pass | — |
| DS-08 | Native screenshot review of primitives (Android and iOS, default and large text) | Codex | Backlog | DS-02, FND-15 | Reviewed screenshots stored in `.ui-review/` with device, OS and revision recorded | — |

## M3 · Exercise Library

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| EXL-01 | Exercise and muscle repositories: create, read, update, archive | Claude Code | Backlog | FND-12, FND-13 | Integration tests on in-memory SQLite cover CRUD, muscle roles and archive | — |
| EXL-02 | Built-in exercise catalog: original seed data (name, equipment, primary/secondary muscles, tracking type) seeded idempotently | Claude Code | Backlog | EXL-01 | Seed runs once per install and on upgrade without duplicates; content is original | — |
| EXL-03 | Exercise search and filter service: name, muscle, equipment; case-insensitive | Claude Code | Backlog | EXL-01 | Tests cover combined filters, empty results and archived exclusion | — |
| EXL-04 | Custom exercises: create, edit, archive with Zod validation; history stays intact | Claude Code | Backlog | EXL-01 | Archiving or deleting an exercise never alters completed sessions (test); hard-delete refused when history exists (DEC-012) | — |
| EXL-05 | Exercise contracts and adapter hooks documented in CONTRACTS.md | Claude Code | Backlog | EXL-03, EXL-04 | Hooks tested; HANDOFFS entry tells Codex what to consume | — |
| EXL-06 | Exercise Library screen: search, filters, loading/empty/error/content states | Codex | Backlog | EXL-05, DS-02 | Uses adapter hooks only; RNTL tests; device screenshot review | — |
| EXL-07 | Exercise detail screen | Codex | Backlog | EXL-05, DS-02 | Shows muscles, equipment and recent performance; all states covered | — |
| EXL-08 | Custom exercise form | Codex | Backlog | EXL-05, DS-03 | Validation errors surfaced; save confirmed only after service success | — |
| EXL-09 | Exercise Library integration verified on device: search, open detail, create custom exercise | Shared | Backlog | EXL-06, EXL-07, EXL-08, FND-15 | Journey passes on a physical Android device; offline | — |

## M4 · Routine Management

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| RTN-01 | Routine repositories: routines, routine_exercises, routine_sets | Claude Code | Backlog | FND-12, EXL-01 | Integration tests for CRUD and cascade behaviour | — |
| RTN-02 | Routine service: create, edit, duplicate, delete in transactions; target validation (reps, weight kg, rest s, set type) | Claude Code | Backlog | RTN-01 | Transaction rollback tested; duplicate is a deep copy; invalid targets rejected | — |
| RTN-03 | Reorder exercises and sets with stable positions | Claude Code | Backlog | RTN-02 | Reorder tests including duplicate-after-reorder integrity; two-phase reorder (DEC-012) | — |
| RTN-04 | Routine contracts and adapter hooks | Claude Code | Backlog | RTN-02, RTN-03 | Hooks tested; CONTRACTS.md and HANDOFFS updated | — |
| RTN-05 | Routine Library screen: list, duplicate, delete confirmation, start | Codex | Backlog | RTN-04, DS-02 | All states; destructive actions confirmed; RNTL tests | — |
| RTN-06 | Routine Builder screen: add exercises, reorder, configure sets, reps and rest | Codex | Backlog | RTN-04, DS-03, EXL-06 | Reorder is accessible without drag; validation surfaced; RNTL tests | — |
| RTN-07 | Routine management verified on device: create, edit, duplicate, delete | Shared | Backlog | RTN-05, RTN-06, FND-15 | Journey passes on a physical Android device; offline | — |

## M5 · Active Workout Tracking

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| WKT-01 | Session engine: start empty or from a routine (name and target snapshots); exactly one active session | Claude Code | Backlog | RTN-02 | Second start is rejected (DB index and service); snapshots unaffected by later routine edits (test) | — |
| WKT-02 | Set logging: completing a set commits immediately; edit/delete/add sets; add or remove exercises mid-session | Claude Code | Backlog | WKT-01 | Completion resolves only after commit and rejects on failure (test); no debounced writes | — |
| WKT-03 | Recovery: active session restored after process kill; survives tab switches; duration from stored timestamps | Claude Code | Backlog | WKT-02 | Restart test with a new DB connection restores the session intact; no JS interval drives duration | — |
| WKT-04 | Finish and discard: transactional finish; summary data (duration, exercises, completed sets, volume) | Claude Code | Backlog | WKT-02 | Incomplete sets excluded from summary; failure mid-finish rolls back (test); finish clamps ended_at to max(now, started_at) (DEC-012) | — |
| WKT-05 | Rest timer engine: end-timestamp countdown, adjust, survives backgrounding, local notification | Claude Code | Backlog | WKT-02 | Timer correct after backgrounding (test with injected clock); notification scheduled and cancelled | — |
| WKT-06 | Workout contracts and adapters replacing the UI proposals in `src/features/preview/contracts.ts` | Claude Code | Backlog | WKT-02, WKT-04, WKT-05 | Adapter satisfies the screen props; CONTRACTS.md and HANDOFFS updated | — |
| WKT-07 | Active Workout screen (production): minimal-tap set entry, notes, completion, finish confirmation | Codex | Backlog | WKT-06, DS-03 | All states; success shown only after persistence; RNTL tests; device review | Unverified pre-milestone draft: `src/features/workout/ActiveWorkoutScreen.tsx`. |
| WKT-08 | Rest timer UI: countdown, adjust, dismiss | Codex | Backlog | WKT-06, DS-02 | Accessible announcements; works with reduced motion | — |
| WKT-09 | Workout summary screen: duration, exercises, completed sets, records | Codex | Backlog | WKT-06, DS-02 | Values match engine summary; all states | — |
| WKT-10 | Active workout verified on device: full log, kill app mid-session, relaunch restores, offline | Shared | Backlog | WKT-07, WKT-08, WKT-09, FND-15 | Journey and recovery pass on a physical Android device in airplane mode | — |

## M6 · Workout History

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| HST-01 | History queries: paginated completed sessions and session detail from snapshots | Claude Code | Backlog | WKT-04 | Pagination and ordering tested; detail independent of later routine/exercise edits | — |
| HST-02 | Edit and delete completed sessions transactionally | Claude Code | Backlog | HST-01 | Edits re-validated; delete cascades; analytics inputs consistent afterwards (test) | — |
| HST-03 | Home data service: weekly activity, most recent workout, quick start or resume | Claude Code | Backlog | HST-01, WKT-03 | Week boundaries and resume-active behaviour tested | — |
| HST-04 | History and Home contracts and adapter hooks | Claude Code | Backlog | HST-01, HST-02, HST-03 | Hooks tested; CONTRACTS.md and HANDOFFS updated | — |
| HST-05 | History list and session detail screens | Codex | Backlog | HST-04, DS-02 | All states; edit/delete confirmed; RNTL tests | — |
| HST-06 | Home screen (production): weekly activity, recent workout, quick-start action | Codex | Backlog | HST-04 | All states; uses adapter hooks; device review | Unverified pre-milestone draft: `src/features/home/HomeScreen.tsx`. |
| HST-07 | History and Home verified on device | Shared | Backlog | HST-05, HST-06, FND-15 | Journey passes on a physical Android device; offline | — |

## M7 · Progress Analytics

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| ANL-01 | Strength analytics: per-exercise best set and estimated 1RM over time (formula documented) | Claude Code | Backlog | HST-01 | Completed sets of completed sessions only; matches a hand-computed fixture | — |
| ANL-02 | Volume and frequency aggregates (weekly, monthly, by muscle) | Claude Code | Backlog | HST-01 | Aggregates match fixture; unit-independent (kg internally) | — |
| ANL-03 | Personal records detection (weight, reps, estimated 1RM, volume) | Claude Code | Backlog | ANL-01 | PRs recomputed correctly after history edits and deletes (test) | — |
| ANL-04 | Chart stack: Victory Native and Skia installed and rendering on SDK 58 | Claude Code | Backlog | FND-15 | A sample chart renders in the Android dev build; versions recorded in DECISIONS.md | — |
| ANL-05 | Analytics contracts and adapter hooks | Claude Code | Backlog | ANL-01, ANL-02, ANL-03 | Hooks tested; CONTRACTS.md and HANDOFFS updated | — |
| ANL-06 | Progress screen: strength chart, volume, frequency, records | Codex | Backlog | ANL-05, ANL-04 | Charts readable and accessible (text alternative); all states | — |
| ANL-07 | Progress analytics verified on device against a known dataset | Shared | Backlog | ANL-06 | On-device values equal fixture expectations | — |

## M8 · Settings and Data Management

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| SET-01 | Settings service: units, theme, notifications, default rest; Zod-validated key/value with defaults | Claude Code | Backlog | FND-13 | Corrupt or missing values fall back to defaults (test) | — |
| SET-02 | Unit conversion adapter (kg and lb display/input, rounding rules); switching units never rewrites stored data | Claude Code | Backlog | SET-01 | Round-trip tests; stored kg values unchanged after toggling units | — |
| SET-03 | Export all user data as versioned JSON via the share sheet | Claude Code | Backlog | EXL-01, RTN-01, HST-01 | Export schema documented; export of a fixture DB validates against it | — |
| SET-04 | Import and restore: validation, version migration, transactional apply, conflict policy | Claude Code | Backlog | SET-03 | Export then import round-trip reproduces identical data; invalid files rejected without partial writes | — |
| SET-05 | Settings screen: units, theme, notifications, export/import, privacy information | Codex | Backlog | SET-01, SET-04, DS-02 | All states; destructive import confirmed | — |
| SET-06 | Data management verified on device: export, reinstall, import restores identical history | Shared | Backlog | SET-05, FND-15 | Round trip passes on a physical Android device | — |

## M9 · Testing and Optimization

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| QA-01 | Core-journey Maestro flow on Android: create routine, start, log sets, finish, history, progress | Shared | Backlog | RTN-07, WKT-10, HST-07, ANL-07 | Flow passes on a physical device with recorded Maestro version | — |
| QA-02 | Termination-recovery end-to-end test on device | Shared | Backlog | WKT-10 | Kill during a workout and relaunch restores every completed set | — |
| QA-03 | Offline verification: full journey in airplane mode; no network requests | Shared | Backlog | QA-01 | Journey passes offline; no outbound requests observed | — |
| QA-04 | Performance: release build profiled on a lower-end Android device (set entry, list scrolling) | Shared | Backlog | QA-01 | Findings and fixes recorded; no jank on set entry | — |
| QA-05 | Accessibility audit: TalkBack and VoiceOver, 200% text, reduced motion, contrast | Codex | Backlog | QA-01 | Issues fixed or recorded; audit notes in `.ui-review/` | — |
| QA-06 | Coverage gate: services and repositories at 80% line coverage or more | Claude Code | Backlog | WKT-06, HST-04, ANL-05, SET-04 | Coverage report meets threshold under `npm test` | — |

## M10 · Private Android and iOS Distribution

| ID | Task | Owner | Status | Depends on | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|
| REL-01 | App identity: name, bundle identifiers, version scheme, icon and splash assets | Shared | Backlog | FND-06 | Codex supplies assets; Claude configures app config; builds show correct identity | — |
| REL-02 | `eas.json` profiles (development, internal preview) and build instructions | Claude Code | Backlog | FND-06 | Profiles validate; instructions in docs/TOOLING.md | — |
| REL-03 | Android internal build installs on a physical device; upgrade over the previous build keeps data | Claude Code | Backlog | REL-01, REL-02, FND-15 | APK installs and launches; data survives upgrade | Prerequisite: local Android SDK + JDK 17 (free). |
| REL-04 | iOS build installs on a physical iPhone via a zero-cost route (no paid membership) | Claude Code | Blocked | REL-01, REL-02 | App installs and launches on the user's iPhone without paid services | Blocker: no free iPhone install route confirmed on Windows without a Mac (see DEC-011); paid Apple membership is out of scope. |
| REL-05 | Regression pass on both devices against the PRODUCT_SPEC §11 acceptance criteria | Shared | Backlog | REL-03, REL-04, QA-01, QA-02, QA-03, QA-04, QA-05 | Every §11 criterion checked and recorded on Android and iOS | — |
| REL-06 | Final device-level UI review on Android and iOS | Codex | Backlog | REL-03, REL-04 | Screenshot matrix reviewed; open issues triaged | — |
