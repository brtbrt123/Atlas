# Changelog

Verified changes to ATLAS, newest first. Each entry names its author and the task ID whose evidence is recorded in `docs/FEATURE_TRACKER.md`. Drafts, mocks, and work whose checks fail are not listed until they pass. Both agents append here; Codex records visual and interaction changes.

## Unreleased

### 2026-11-09

#### Added
- **FND-10** (Claude Code): Drizzle schema for the nine spec tables (`src/database/schema.ts`), `drizzle.config.ts`, generated migration `drizzle/0000_init.sql`, `docs/DATABASE.md`; DEC-012 database policies. Verified: `drizzle-kit check`, 28 constraint checks on real SQLite, tsc/lint/tests pass, architecture review fixes applied.
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
- **DS-02** (Codex, device review pending): reusable primitives consume type/spacing/semantic-variant tokens; busy actions reject presses and retain readable labels; danger actions have their semantic border. Added six passing component tests for action states, retry, headings and numeric typography. Native visual/accessibility acceptance remains open.
- **FND-01**: restored Codex's original `.gitignore` entries (`.tools/`, `.ui-review/`) after Claude Code accidentally overwrote the file (see `docs/HANDOFFS.md`).
