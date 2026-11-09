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
