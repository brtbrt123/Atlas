# Changelog

Verified changes to ATLAS, newest first. Each entry names its author and the task ID whose evidence is recorded in `docs/FEATURE_TRACKER.md`. Drafts, mocks, and work whose checks fail are not listed until they pass. Both agents append here; Codex records visual and interaction changes.

## Unreleased

### 2026-11-11

- **EXL-04** (Codex temporary takeover, Done): implemented complete exercise service with injected ids/clock, schema-validated creation and edits, archive/restore, protected custom deletion and preserved workout snapshots. Built-in removal directs users to archive. Twenty-five new integration checks and all 165 tests pass, with typecheck/lint also passing.

- **EXL-03** (Codex temporary takeover, Done): added validated exercise name search and combined muscle/equipment filters, secondary-muscle matching, archived exclusion and safe read failures. Thirteen new integration checks pass; typecheck, lint and all 140 tests pass.

- **EXL-02** (Codex temporary engineering takeover, In Review): added 65 original built-in exercise definitions and insert-only startup seeding after migrations. Catalog upgrades preserve existing names, muscle links, notes and archive choices. Five new real-SQLite integration tests pass, along with typecheck, lint and all 127 tests. Native seed timing awaits a connected phone.

- **DS-06** (Codex, In Review): wired tab icons and shared header styling, switched status-bar text to dark and removed the redundant dev preview header with safe-area handling. Typecheck, lint and all 122 tests pass. Native verification awaits a connected phone.

### 2026-11-09

#### Added
- **EXL-06/07/08** (Codex): corrected Figma layout fidelity following user review, including compact search/create controls, recent figures, segmented form controls, muscle selection and detail section order. Native library/detail captures reviewed. 122 tests, typecheck and lint pass. Navigation integration remains pending.
- **DS-01, DS-06, EXL-06/07/08** (Codex): DEC-020 light tokens and Plus Jakarta Sans, semantic action contrast, soft card shadow, local equipment images, SVG body maps, filter modal, sample performance and saved detail preview. Added navigation icon/options exports for Claude to mount. Native Infinix review recorded; 122 tests, typecheck, lint and setup checks pass. Screen tasks remain In Progress pending final fidelity and integration.
- **DS-09** (Claude Code): foundations for the new look the user approved (DEC-020; PRODUCT_SPEC §5 tokens updated). Design assets from the user's Gemini images in `assets/images/` (15 equipment pictures named by `EQUIPMENT` id, 2 empty-state pictures, an app-icon concept, and the muscle model as front/back SVGs with one path per muscle part); originals in `assets/source/`. Plus Jakarta Sans embedded at build time as one family with weights 400–800, `react-native-svg` added, light native background and splash (DEC-021). `expo install --check`, tsc, lint and 122 tests pass. Verified on the Infinix with a new development build and a dev-only check screen (`/dev/foundations`): all five weights render in Plus Jakarta Sans and react-native-svg draws. iOS unverified.
- **EXL-06/07/08** (Codex): redesigned six Figma frames with illustrated equipment, condensed headings, last-session figures, grouped editing controls and bottom save action. Reviewed the six renders at 390 × 844.
- **EXL-06/07/08** (Codex) — Added six editable Figma frames for browsing exercises, filtering by chest, inspecting recent performance, and reviewing a sample custom save. Reviewed all six renders at 390 × 844. The prototype awaits user feedback.
- **EXL-06/07/08** (Codex, In Progress): exercise presentation components and memory-only dev preview: virtualized library, controlled search/muscle/equipment filtering, detail with distinct unavailable/empty history, and validated custom form with pending lock and failed-save draft retention. Six new UI tests pass; typecheck, lint and full 120-test suite pass. Default Android screenshots reviewed; production adapters/routes and broader native accessibility/keyboard verification remain pending.
- **EXL-01** (Claude Code): exercise repository (create, read, list, partial update with muscle replacement, archive) over the real drizzle expo driver, transaction-composable; fixed `MUSCLES` and `EQUIPMENT` vocabularies in `src/types`; DEC-018; tests run on a fake of three expo-sqlite methods over node:sqlite. Review fixes applied; all checks pass. Not run on a device.
- **FND-15** (Claude Code): first local debug build of ATLAS installed and run on the Infinix X695 (Android 11, arm64) at no cost: tab shell renders, Codex's dev-only UI preview renders with its mock-data banner, and the migration was verified inside the on-device database (9 tables, `0000_init`, WAL, clean `foreign_key_check`). Build recipe and Windows/network workarounds in `scripts/android/`, `docs/TOOLING.md` and DEC-016.
- **FND-14** (Shared, verified by Claude Code): Codex's isolated UI preview mounted at the development-only route `/dev/preview` (unmodified, mock-data banner kept), with a dev-only link on Home. Production bundles exclude it (checked in the exported bundle). 3 tests; tsc, lint and 89 tests pass.
- Android dev build prepared (not built): `expo prebuild` generated the git-ignored `android/` project; toolchain audit and the single-architecture build command are in `docs/TOOLING.md`.
- **FND-11** (Claude Code): startup migration runner (foreign-key-safe, atomic, newer-database guard, read-back pragmas), single-flight database open, `DatabaseGate` blocking error screen, `.sql` bundling in Metro/Babel, UI-layer import restrictions (ESLint). Review fixes applied. 9 suites / 86 tests pass; Android export contains the migration SQL. Not run on a device.
- **FND-09** (Claude Code): Expo Router skeleton: 5 tabs (Home, Exercises, Routines, History, Progress), Settings, active workout, routine and exercise detail routes with typed routes, placeholder screens and a route map in `docs/CONTRACTS.md`. 12 navigation tests; tsc, lint, 66 tests and the Android bundle export pass. Not run on a device.
- **FND-13** (Claude Code, In Review): domain contracts v1 (Zod schemas, `AtlasError`, settings parsing, service interfaces, ports), `docs/CONTRACTS.md`, `docs/ARCHITECTURE.md`, DEC-013/DEC-014. 21 new unit tests; all checks pass. Pending Codex acknowledgement.
- **FND-12** (Claude Code): in-memory SQLite test harness using the app's generated migrations, 26 integration tests (schema constraints, one-active-workout, history independence, FK-safe table-rebuild policy). Jest loads `.sql` via a transformer. `npm test -- --runInBand`: 4 suites, 33 tests pass.
- **FND-10** (Claude Code): Drizzle schema for the nine spec tables (`src/database/schema.ts`), `drizzle.config.ts`, generated migration `drizzle/0000_init.sql`, `docs/DATABASE.md`; DEC-013 database policies. Verified: `drizzle-kit check`, 28 constraint checks on real SQLite, tsc/lint/tests pass, architecture review fixes applied.
- **DS-01** (Codex): design-token sign-off after strict TypeScript compilation and static palette/contrast/invariant checks passed.
- **FND-07** (Claude Code): ESLint (expo config), Jest (jest-expo) and RNTL 14 with scripts `lint`, `test`, `typecheck`; all three gates pass. Includes a user-approved one-line lint fix in Codex draft `ActiveWorkoutScreen.tsx` (lazy `useState` initializer, no behavior change).
- **FND-06** (Claude Code): Expo SDK 58 app scaffolded in place (`package.json`, `app.json`, `tsconfig.json` strict with `@/` alias and typed routes, `app/_layout.tsx`, `app/index.tsx`, `expo-dev-client`). Verified: `expo install --check` clean, `tsc --noEmit` exit 0 (Codex drafts compile, untouched), `expo export --platform android` exit 0.
- **FND-16** (Codex): pinned Markdown-only Ponytail, Superpowers systematic-debugging and verification-before-completion skills, with Claude Code pointers sharing the same files. Six new guidance files match upstream; setup verification passes for all seven skill bundles and three new pointers. No hooks, global settings, application visuals or interactions changed. Host discovery remains to be confirmed next session.
- **FND-04** (Claude Code): milestone-based tracking.
  - `docs/FEATURE_TRACKER.md`: 10 milestones, 81 tasks.
  - `docs/PROJECT_STATUS.md`: progress section generated from the tracker.
  - `docs/CHANGELOG.md` and `docs/DECISIONS.md`.
  - `scripts/tracker.mjs`: validates the tracker rules and computes progress (18 scripted tests passed).
  - The Claude Code Stop hook now validates tracker edits.
- **FND-02** (Claude Code): Claude Code harness.
  - `CLAUDE.md`; rules for architecture, React Native, database, testing, collaboration and tracking.
  - Four subagents.
  - Five report-only hooks with an ownership guard.
  - Permission rules.
  - Plugins `expo` 1.13.9, `typescript-lsp` and `context7`; pointer skills to Codex's pinned Callstack skills.
  - Global `typescript-language-server` 6.0.3 and `typescript` 6.0.3.
  - Verification is recorded in `docs/TOOLING.md`.
- **FND-01** (Shared): Git repository on `main` with LF normalization (`.gitattributes`) and combined ignore rules for native builds, secrets, Expo output, local tooling and session logs.
- `docs/PRODUCT_SPEC.md`: the user's master specification, amended for milestone-based planning.

#### Fixed
- **FND-03** (Codex): added `tools/maestro.cmd` for normal Windows terminals. Verified Maestro 2.12.1 startup from Windows PowerShell 5.1 without changing execution policy; static setup/skill-integrity checks pass. The UI tooling setup task is now Done; no device test is implied.
- **DS-02** (Codex, device review pending): reusable primitives consume type/spacing/semantic-variant tokens; busy actions reject presses and retain readable labels; danger actions have their semantic border. Added six passing component tests for action states, retry, headings and numeric typography. Native visual/accessibility acceptance remains open.
- **FND-01**: restored Codex's original `.gitignore` entries (`.tools/`, `.ui-review/`) after Claude Code accidentally overwrote the file (see `docs/HANDOFFS.md`).
