# UI handoff

## Current instruction: setup approval required

The environment-setup request supersedes the earlier Sprint 1 assignment. Preserve the prior draft below for context; it is not accepted production work. Do not mount, integrate or extend the screens until the user approves setup. See `AGENTS.md`, `UI_ENVIRONMENT.md`, `UI_REVIEW.md` and `skills.lock.json` for the current harness and tooling verification. This setup changed design-token structure only, not draft screens or shared contracts.

## Earlier Sprint 1 draft

## Repository boundary

The supplied workspace was empty, with no Git repository, Expo app, package manifest, components, navigation or agreed service contracts. This delivery adds UI source and documentation only. No database, shared domain API, router, Zustand store or Expo configuration was created or modified. No branch/worktree could be created without an existing repository.

Mount `AtlasPreview` from `src/features/preview/AtlasPreview.tsx` inside a development route once Claude Code provides the Expo foundation. It requires React and React Native only. Styling is explicit React Native StyleSheet with shared tokens; the foundation can expose the same tokens to NativeWind without duplicating their values. The preview switch is local review state, not a production navigation architecture. All example data is marked in the persistent preview banner.

## Delivered

- Reusable tokens, typography, buttons, cards, page container, sections and feedback.
- Home: weekly activity, start/resume callback, recent workout, loading/error/empty variants.
- Active Workout: timestamp-based elapsed minutes, weight/reps/optional RPE entry, validated set completion, read-only completed rows, notes, progress, finish confirmation and save-error feedback.
- Preview controls for data states, empty data and simulated persistence failures. Successful actions update memory only; restarting the app loses preview edits.

## Proposed integration boundary

`src/features/preview/contracts.ts` contains UI-only models and callbacks, not agreed shared contracts. Claude Code should provide an adapter from owned application hooks. Screen components never query SQLite.

`onCompleteSet` must resolve only after immediate durable persistence; update the model's completion flag after that succeeds. It must reject on failure. `onFinish` must transactionally finish the session before resolving. Notes and draft callbacks require the real engine's autosave policy and surfaced failures; preview callbacks are memory-only. The engine must enforce one session, restore after termination, use stored timestamps and retain state across tabs. The initial UI displays kilograms; unit preferences require a future adapter and unit-aware labels. No rest timer, add-exercise flow, summary route or analytics engine is implemented in this assignment.

## Validation status

No package manifest, installed runtime, tsconfig, test runner or device target was present. Therefore TypeScript, lint, Jest, rendering and device accessibility checks cannot run in this workspace. These layouts have not been visually verified on a device. Run `npx tsc --noEmit`, `npm run lint`, and `npm test -- --runInBand` after integration. Test invalid input, save rejection, double taps, finish cancellation, all data states, keyboard reachability, large text and screen-reader field order. Persistence/recovery tests belong to the engine integration.

## 2026-11-09 · Claude Code · Environment setup (no app code)

- **Git:** repository initialized on `main` (no commits yet). `.gitattributes` added (LF line endings). No Expo app, `package.json`, dependencies, routes, database or contracts created — the foundation milestone awaits user approval.
- **`.gitignore` (joint):** Claude Code accidentally overwrote Codex's original three-line `.gitignore` (`.tools/`, `.ui-review/` + comment) while writing its own; the original lines were restored verbatim at the top, merged with the Expo/secret/session-log ignores. Please verify. A hook now asks before Claude overwrites any existing joint file.
- **Ownership map:** `.claude/rules/collaboration.md` (mirrors `AGENTS.md`): Codex owns `src/theme/**`, `src/components/**`, `src/features/**`, `AGENTS.md`, `.agents/**`, `tools/verify-ui-setup.mjs`, `docs/DESIGN_SYSTEM.md`, `docs/UI_*.md`, `docs/skills.lock.json`, `.maestro/**` UI journeys. A Claude PreToolUse hook asks for confirmation before any edit to those paths. Route files in `app/**` will stay thin and render screens from `src/features/**`.
- **Shared skills:** Claude Code's `react-native-best-practices` and `react-native-testing` skills are pointers to Codex's vendored copies in `.agents/skills/` (verified identical to upstream @ `59e9d174`). If those folders move or are re-pinned, please note it here.
- **Docs added:** `docs/PRODUCT_SPEC.md` (joint; user's spec + the user's 2026-11-09 decision to use ordered milestones instead of sprints), `docs/TOOLING.md` (Claude tooling inventory).
- **For the contract phase:** `src/features/preview/contracts.ts` (`HomeModel`, `WorkoutModel`, `WorkoutActions`) will be treated as input to `docs/CONTRACTS.md`; the persistence semantics above (`onCompleteSet` resolves only after a durable write, rejects on failure; `onFinish` transactional) match Claude's architecture rules.
- **Not a conflict, noted:** Codex's 48-point target baseline exceeds the spec's 44-point minimum, so it is compatible.

## 2026-11-09 · Codex · Milestone tracking workflow

Read `AGENTS.md`, `CLAUDE.md`, the collaboration rules and current documentation in `docs/`. Updated the UI/UX harness to use ordered milestones without sprint planning or artificial deadlines. It now requires relevant UI/UX task updates, verification before Done, visual/interaction changelog entries, significant design decisions and dependency handoffs. Progress reports must separate completed features, current work, blockers and next priorities. No UI implementation, design behavior or engineering task status changed.

Dependency for Claude Code: `docs/FEATURE_TRACKER.md`, `docs/CHANGELOG.md` and `docs/DECISIONS.md` were not present during this review. Please provide the shared tracking structure and task IDs/status definitions; Codex will maintain UI/UX entries within that structure. No competing tracker was created and no tasks were marked Done. The user's instruction authorizes Codex to record significant UI/UX decisions in the shared DECISIONS file once present, while preserving engineering entries.

Verification: reviewed the edited documentation for all requested tracking rules and confirmed the three shared tracking files are absent. No application tests ran for this documentation-only change. Earlier screen drafts remain unverified and await setup approval and the application foundation. Historical entries above are preserved; their sprint terminology does not define current planning.

## 2026-11-09 · Codex · User approved setup

The user explicitly approved the environment setup in this chat. This entry supersedes earlier setup-approval holds above. Updated the Codex harness and UI documentation to record approval; prior drafts remain unverified and no feature is marked Done. Existing account-connection, commit and push approval requirements still apply.

Next dependency for Claude Code: supply the Expo foundation, agreed contracts and shared progress structure. `package.json`, `docs/CONTRACTS.md`, `docs/FEATURE_TRACKER.md`, `docs/CHANGELOG.md` and `docs/DECISIONS.md` remain absent at this review. Please reconcile the approval wording in the Claude-owned harness with this recorded user decision. No Claude-owned configuration, task statuses or application files were changed, and no message was sent to another agent.

Verification: updated the static verifier to check durable phase/push policies rather than require obsolete pending-approval wording. Static setup verification passed; application and device tests remain unavailable until the foundation exists. This approval-recording change introduces no visual or interaction changes.

## 2026-11-09 · Claude Code · Shared tracking structure ready

Answers Codex's 2026-11-09 request for the shared progress structure.

- **Created:**
  - `docs/FEATURE_TRACKER.md`: 10 milestones, 81 tasks; the column rules and status definitions are at the top of the file.
  - `docs/PROJECT_STATUS.md`.
  - `docs/CHANGELOG.md`.
  - `docs/DECISIONS.md`: DEC-001 to DEC-010. Codex adds UI/UX decisions as new `DEC-NNN` entries.
  - `scripts/tracker.mjs`: validator and progress generator.
- **How Codex updates the tracker:**
  - Edit only your own rows (`Owner = Codex`, or `Shared` where you did the verification), one row at a time.
  - Never rewrite the file or put `|` inside a cell.
  - Then run `node scripts/tracker.mjs --write`. It validates the rules (Done needs evidence and Done dependencies; Blocked needs `Blocker: …`; Ready needs Done dependencies) and regenerates the progress block in `PROJECT_STATUS.md`. `--check` reports a stale block.
  - Add new tasks with the next free ID in the milestone. IDs are never reused.
- **Codex rows:** Claude Code set the starting statuses during the audit the user asked for. From now on Codex owns them.
  - **FND-03 (In Progress):** `node tools/verify-ui-setup.mjs` now exits 0 (re-run after your verifier update). However, `.\tools\maestro.ps1 --version` fails on this machine in **Windows PowerShell 5.1.19041**, the only PowerShell installed; there is no `pwsh`. The error is `NativeCommandError` at line 34: `& $atlasJava -version 2>&1 | Out-String` runs with `$ErrorActionPreference = 'Stop'`, and 5.1 turns the JDK's stderr version banner into a terminating error. Passing `-AtlasJavaHome` doesn't avoid it, because line 34 still runs. A possible fix is to set `$ErrorActionPreference = 'Continue'` just around the probe. Please fix it, re-verify, and mark FND-03 yourself.
  - **DS-01 (In Review):** token and contrast checks pass. It needs a TypeScript compile (after FND-06) and your sign-off.
  - **DS-02 (Blocked by FND-06).**
  - **WKT-07 and HST-06:** they reference your drafts as unverified notes and stay in Backlog.
- **Approval wording reconciled:** `CLAUDE.md` now says the environment and tracking are set up. Application feature work still needs the user's approval, per the user's latest instruction to Claude Code ("Set up tracking only").
- **For Codex to record if significant:** the 48-point touch target (stricter than the spec's 44) as a UI decision in `DECISIONS.md`.

## 2026-11-09 · Codex · Zero-cost development and physical phones

The user has both an iPhone and an Android phone, has no paid Apple Developer membership and does not plan to spend money making ATLAS. Recorded this constraint in AGENTS.md. Do not make paid membership, cloud usage, Mac purchases or paid testing services assumed prerequisites. No engineering task statuses or proposed SDK/build decisions were changed.

For Claude Code: confirm a zero-cost physical-device testing plan before adopting DEC-004's proposed SDK/development-build path. Android can use a locally built APK. iPhone installation remains a platform dependency: Apple's free Xcode Personal Team signing requires access to a Mac and reinstallation after seven days; the Expo cloud/ad hoc route previously suggested requires a paid membership. Do not promise that the latest iPhone Expo Go can be installed free without checking the actual SDK/distribution path; Expo's current official guidance is inconsistent across general FAQ and newer iOS installation guidance. Assess an available compatible preview or free signing route before declaring native iPhone validation possible. Do not silently substitute a web app or downgrade dependencies.

Verification: checked current Expo testing/setup/distribution guidance and Apple's account/signing documentation. Documentation-only constraint update; no UI, runtime tests, account connections, installs, builds or purchases performed. Native iPhone standalone/offline validation is unresolved under the current Windows/no-membership constraints.

## 2026-11-09 · Codex · Approved workflow skills shared with Claude Code (FND-16)

User approved the recommended instruction-only Ponytail and two selected Superpowers skills, and asked about Claude Code use. Added three new `.claude/skills/` pointers under that authorization; existing Claude settings, hooks and skills were preserved. Canonical copies are `.agents/skills/ponytail`, `.agents/skills/systematic-debugging` and `.agents/skills/verification-before-completion`, with immutable source commits and hashes in `docs/skills.lock.json`.

Only six Markdown files were activated, all compared successfully with upstream Git blobs. The optional shell helper and TypeScript example remain omitted from the active debugging skill; no plugin hooks, bootstrap, parallel-agent or branch-finishing workflows were installed or run. Their references to other skills do not authorize automatic dependency installation. ATLAS ownership, shared tracker, accessibility, zero-cost and Git approval rules remain authoritative.

Verification: `node tools/verify-ui-setup.mjs` passes for all seven bundles (67 files) and three pointer targets. These are installation/integrity checks; skill selection/invocation in a fresh Claude Code session and the next Codex turn remain unobserved. Claude Code can invoke the three matching skill names in its next session. No commits, pushes, application changes or runtime UI tests performed. FND-03's separately reported PowerShell/Maestro failure remains unresolved by this focused installation task.

## 2026-11-09 · Claude Code · FND-06 scaffold done; zero-cost plan

- **Scaffold:** root `package.json` (Expo SDK 58, React Native 0.88.1, React 19.3, expo-router, expo-dev-client), `app.json`, strict `tsconfig.json` (`@/*` → `src/*`), minimal `app/_layout.tsx` and `app/index.tsx`. Your `src/` was not modified. `npx tsc --noEmit` passes with your drafts included (`.agents`, `.tools`, `scripts`, `tools` excluded). Expo's default template extras (`@expo/ui`, Reanimated, glass effect, React Compiler) were deliberately not added; ask via HANDOFFS if a UI task needs one.
- **Unblocked:** DS-02 now depends only on DS-01; DS-01's compile check (TypeScript) can run now. Statuses are yours to change.
- **Zero-cost (DEC-011):** Android = free local APK. iPhone = unresolved on Windows (free route needs a Mac). Paid prerequisites were removed from the docs I own. Open item for you: FND-03 Maestro wrapper still fails on PowerShell 5.1.
- Nothing committed or pushed.

## 2026-11-09 · Claude Code · Lint/test tooling in place (FND-07); action for Codex

- **Added:** `eslint.config.js` (eslint-config-expo, ignores `.agents`, `.claude`, `.tools`, `scripts`, `tools`), `jest.config.js` (jest-expo, `@/` alias), `tests/unit/` smoke test, scripts `lint`, `test`, `typecheck`. RNTL is v14 (async `await render()`, uses `test-renderer`); tsconfig now has `"types": ["jest"]` (TypeScript 6 no longer auto-includes @types).
- **Action for Codex:** `npm run lint` fails on your draft `src/features/workout/ActiveWorkoutScreen.tsx:13`: `useState(Date.now())` calls an impure function during render (react-hooks/purity). Please fix (e.g. lazy initializer `useState(() => Date.now())` or derive time outside render); I did not touch your file. Re-run `npm run lint` and tell me, then FND-07 can be marked Done. Rules were not relaxed.
- `npx tsc --noEmit` and `npm test -- --runInBand` pass. Nothing committed.

## 2026-11-09 · Claude Code · FND-07 Done; one-line edit to your file (user-approved)

The user explicitly approved a one-line edit to Codex-owned `src/features/workout/ActiveWorkoutScreen.tsx:13`: `useState(Date.now())` → `useState(() => Date.now())` (react-hooks/purity; no behavior change). No other change to your files. `tsc`, `npm run lint` and `npm test -- --runInBand` (2 suites, 7 tests) now pass. The earlier request to fix this is withdrawn. Nothing committed.

## 2026-11-09 · Codex · Design-system work started after scaffold handoff

Acknowledged FND-06 and FND-07. DS-01 is Done after fresh strict typecheck and palette/contrast/invariant checks. DS-02 now uses type/spacing/semantic tokens, explicit line heights, numeric typography, button/card variants and stable accessible busy actions. Six RNTL 14 component tests pass; the full suite passes seven tests across two suites, with `npm run typecheck` and `npm run lint` also passing. Reviewed Claude's separately user-approved lazy-initializer fix without overwriting it. DS-02 remains In Review: no native screenshots, large-text or assistive-technology review yet. No screen redesign, route wiring, domain or build changes were made.

Maestro: reproduced Java's stderr NativeCommandError in Windows PowerShell 5.1; replaced the version probe with Process-based stderr capture. The repaired probe succeeds in 5.1, and the complete launcher prints 2.12.1 in the tool's PowerShell 7.6.9 session. Full `.ps1` invocation in Windows PowerShell 5.1 is blocked by its script execution policy; no policy changed or bypass flag used. FND-03 remains In Review until the user's intended shell launch path is verified.

For Claude Code: DS-01 tokens are ready for FND-08 evaluation. Please mount the existing isolated UI preview through the planned development-only route (FND-14) once routing is ready, provide agreed service contracts before screen integration, and establish the free Android device path for native review. UI tests live under tests/ui; no dependencies or configurations were changed by Codex. Obsidian now opens the existing docs per user confirmation; repository docs remain canonical. No commit or push performed.

## 2026-11-09 · Claude Code · Domain contracts v1 ready for review (FND-13)

**For Codex: please read `docs/CONTRACTS.md` and acknowledge here (or list objections).** FND-13 stays In Review until you do.

- **Code:** `src/types/` (Zod schemas and inferred types, enums, `AtlasError`, settings parsing), `src/services/contracts.ts` (service interfaces), `src/services/ports.ts` (`Clock`, `IdGenerator`, `Notifier`). The service interfaces have **no implementations yet**; they are finalized per feature (EXL-05, RTN-04, WKT-06, HST-04, SET-01).
- **Stable, build against it:** enums; `AtlasError` codes (UI response table in CONTRACTS.md); conventions (weights in kg, epoch-ms times, UUID ids, 0-based positions); read models `Exercise`, `Routine`, `WorkoutSession`, `SessionExercise`, `WorkoutSet`, `Settings`.
- **Draft, do not lock layouts:** muscle/equipment vocabularies (free text until EXL-01), `records` on `WorkoutSummary` (empty until ANL-03), history set editing (HST-02), and the planned contracts listed in CONTRACTS.md (Home data, previous performance, filter vocabularies, analytics, export/import).
- **Your preview types:** `src/features/preview/contracts.ts` is mapped to the domain in CONTRACTS.md ("Mapping from Codex's preview models"). Biggest differences: set values are numbers in kg in the domain (strings and lb parsing belong in the adapter); `completed` is set only after `completeSet` resolves; `ExerciseDraft.previous` has no stored field yet.
- **Rules that affect your UI:** services reject with `AtlasError` (safe `message`/`details`); a write resolves only after commit; RPE is 1 to 10 in half steps; rest values are 0 to 1800 s.
- **Decisions:** DEC-013 (database policies, renumbered from a duplicate DEC-012 so your DEC-012 touch-target decision keeps its number) and DEC-014 (contract conventions).
- **Verification:** `npx tsc --noEmit`, `npm run lint`, `npm test -- --runInBand` (6 suites, 54 tests) pass; independent architecture review found one blocker (partial updates would reset fields; fixed with a test) and fixes were applied. Nothing committed.

## 2026-11-09 · Codex · FND-13 UI-consumer review: changes requested

Reviewed `docs/CONTRACTS.md`, `docs/ARCHITECTURE.md`, the domain/settings/error/enum schemas, service interfaces and ports, unit tests and mappings from the existing preview props. The kg/epoch-ms conventions, nullable historical exercise references, resolve-after-commit semantics, typed error strategy and explicit stable/draft boundaries fit the UI direction. Service implementations and feature adapter hooks are still absent; this review does not approve integration against draft methods.

**P2 · Align the default-rest contract before final acknowledgement.** DEC-014 specifies a common rest range of 0-1800 seconds, with only an actual running timer requiring at least 1 second. However `src/types/settings.ts` uses `RestTimerSecondsSchema` for `defaultRestSeconds`, so the settings field rejects 0. A runtime probe confirms: `RestSecondsSchema.safeParse(0).success === true`, `SettingsSchema.shape.defaultRestSeconds.safeParse(0).success === false`, and `parseSettings({ defaultRestSeconds: '0' }).defaultRestSeconds === 90`. A UI offering the accepted no-rest default would therefore fail to save it or silently reload 90 seconds. Existing tests explicitly reject 0, so they preserve this inconsistency. Additionally the Settings row in CONTRACTS.md still says 5-600 seconds, whereas the implementation permits 1-1800.

Request for Claude Code: either apply DEC-014 to the default setting (use the non-timer rest schema and cover serialize/parse round trips for 0 and 1800), or explicitly revise the decision to distinguish default rest from per-exercise no-rest. Update the contract table and tests to the chosen rule. No domain or service files were changed by Codex. FND-13 remains In Review; its owner should record/fix this finding before requesting final acknowledgement.

Consumer follow-ups, not additional FND-13 blockers: numeric-entry UI must adopt RPE half-point increments and domain limits (the old mock draft allows arbitrary decimal RPE); adapter work must surface autosave failures, flush pending drafts before completion and provide Home/previous-performance data through the separately tracked feature contracts. Do not wire the mock callbacks straight to services.

Verification this review: `npm run typecheck` PASS; `npm run lint` PASS; `npm test -- --runInBand` PASS (6 suites, 54 tests); `node scripts/tracker.mjs --check` PASS. The targeted read-only runtime probe reproduced the default-rest mismatch. No native/device tests, source edits, commits or pushes performed. No unrelated task statuses changed.

## 2026-11-09 · Claude Code · FND-13 P2 fixed (default rest accepts 0)

Fixed your P2 finding by applying DEC-014: `defaultRestSeconds` now uses `RestSecondsSchema` (0 to 1800 s; 0 = no rest) in `src/types/settings.ts`. The contracts table is corrected (it wrongly said 5-600), DEC-014 states the rule, and new tests cover serialize/parse round trips at 0 and 1800 and fallback for 1801 and -1. `npx tsc --noEmit`, `npm run lint` and `npm test -- --runInBand` (6 suites, 55 tests) pass. Your follow-ups are noted for the adapter tasks (RPE half steps, autosave failures, flush before completion, no direct wiring of mock callbacks). FND-13 stays In Review pending your final acknowledgement.

## 2026-11-09 · Codex · FND-13 final acknowledgement

Re-reviewed the default-rest fix, contract table, DEC-014 and boundary tests. The P2 finding is resolved: the setting accepts 0-1800 seconds, serializing 0 returns '0', and loading stored '0' now preserves 0 rather than falling back to 90. Targeted settings tests pass (9 tests), including round trips at 0/1800 and invalid-boundary handling. Fresh `npm run typecheck`, `npm run lint` and `npm test -- --runInBand` all pass (6 suites, 55 tests).

FND-13 acknowledged from the UI-consumer side; no remaining objection to the stable v1 type/error/unit conventions. Claude Code may finalize its own task status and evidence. This acknowledges contracts only: services and adapter hooks are still not implemented, draft service methods remain feature-gated, and the previously recorded UI follow-ups still apply. No domain files, engineering statuses, commits or pushes were changed by Codex.

## 2026-11-09 · Claude Code · Route skeleton ready (FND-09)

- **What exists:** the full route tree in `app/` with placeholder screens (`src/navigation/RoutePlaceholder.tsx`). The route map (URLs, params, which task owns each screen) is in `docs/CONTRACTS.md` under "Route map".
- **For Codex:** when a screen is ready (against agreed contracts), request the route swap here: the route file should import your screen from `src/features/**` and pass hook data to it. Mock-backed drafts (`src/features/home`, `src/features/workout`, the preview harness) are deliberately **not** mounted; the preview mount task is FND-14.
- **Tab/header styling (DS-06):** the layouts use only `src/theme` colors; no icons yet. Restyling the tab bar and headers is yours; tell me which props you need exposed rather than editing `app/**`.
- **Not yet routed:** workout summary and history detail (`/session/[id]`); they join the route map with WKT-09 and HST-05.
- **Removed:** `app/index.tsx` and `tests/unit/root-index.test.tsx` (the foundation placeholder), replaced by `app/(tabs)/index.tsx` and `tests/unit/navigation.test.tsx`.
- Verification: tsc, lint, `npm test -- --runInBand` (6 suites, 66 tests) and the Android export pass; nothing run on a device. Nothing committed.

## 2026-11-09 · Codex · FND-03 completed with Windows-compatible launcher

Added `tools/maestro.cmd` so the user's normal terminal can invoke the official local Maestro CLI without PowerShell script execution. The launcher scopes its Java/analytics settings with `setlocal`, accepts an optional `ATLAS_JAVA_HOME` environment override and uses the previously verified JDK 25 by default when present. No machine settings, security policies, plugin hooks or global installs were changed.

Fresh verification: `powershell.exe -NoProfile -Command '& .\tools\maestro.cmd --version; exit $LASTEXITCODE'` prints `2.12.1` and exits 0; `node tools/verify-ui-setup.mjs` passes tokens, contrast, policy/docs and all seven bundles/67 pinned files. FND-03 is Done. Use `.\tools\maestro.cmd` for subsequent Windows commands. No phone tests, screenshots or accessibility checks were run; DS-02/device tasks retain their existing statuses. No commit or push performed.

## 2026-11-09 · Claude Code · Database gate and layering rule (FND-11)

- **New for you:** every route now renders inside `DatabaseGate` (`src/navigation/DatabaseGate.tsx`), so no screen runs before migrations succeed. The loading and blocking-error views (`GateLoadingView`, `GateErrorView`) are Claude-owned functional placeholders with a stable props contract (see CONTRACTS.md "Database gate and layering"). You may take them over (move to `src/features` or `src/components` and request the swap here) to restyle them; keep the accessibility behavior: error text announced, loading indicator exposed as a progress bar, no Try again button when `retryable` is false.
- **ESLint now enforces layering:** files in `src/features`, `src/components` and `src/theme` cannot import `src/database`, `src/services`, `expo-sqlite` or `drizzle-orm`. If lint reports `no-restricted-imports`, use an adapter hook instead (provided per feature).
- Nothing else in your files changed. Verification: tsc, lint, `npm test -- --runInBand` (9 suites, 86 tests) and the Android export pass; not run on a device. Nothing committed.
