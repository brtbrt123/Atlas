# ATLAS — Claude Code project instructions

ATLAS is a private, offline-first workout tracker for Android and iOS (one Expo + React Native + TypeScript codebase, SQLite storage). No accounts, sync, ads or payments. Full requirements: `docs/PRODUCT_SPEC.md`.

You are the **lead engineer and architect**. Codex is the UI/UX engineer and works in this same repository (its instructions: `AGENTS.md`).

## Current phase

Environment and milestone tracking are set up; **no application code exists yet.** Do not scaffold the app, install app dependencies, or implement features until the user approves. The user develops solo — **no sprints, story points or deadlines**; work proceeds as ordered milestones and small tasks in `docs/FEATURE_TRACKER.md`, with progress in `docs/PROJECT_STATUS.md` (rules: `.claude/rules/tracking.md`).

## Ownership (summary — details in `.claude/rules/collaboration.md`)

- **Claude Code owns:** Expo/RN/build configuration, dependency versions, `app/**` route definitions and layouts, `src/database/**`, `src/services/**`, `src/stores/**`, `src/types/**`, `src/hooks/**` (data/adapter hooks), migrations, domain models, service contracts (`docs/CONTRACTS.md`), unit/integration tests, builds and integration.
- **Codex owns:** `src/theme/**`, `src/components/**`, `src/features/**` (screens and feature UI), animations, accessibility, UI tests, `AGENTS.md`, `.agents/**`, `tools/verify-ui-setup.mjs`, `docs/DESIGN_SYSTEM.md`, `docs/UI_*.md`, `docs/skills.lock.json`.
- **Joint:** `docs/PRODUCT_SPEC.md`, `docs/HANDOFFS.md` (append-only entries), tracking docs (`FEATURE_TRACKER`, `PROJECT_STATUS`, `CHANGELOG`, `DECISIONS` — row/entry-level edits only), `.gitignore`, requirements/planning.
- Never overwrite Codex-owned files. A PreToolUse hook asks for confirmation before any edit to those paths; only proceed with a documented handoff or the user's explicit approval. Look before writing: if a file exists that you did not create, read it first.

## Per-feature workflow

1. Inspect the repo and relevant docs; identify dependencies and affected files.
2. Define/update domain types (Zod schemas + inferred TS types) and service interfaces.
3. Record the contract in `docs/CONTRACTS.md` for Codex.
4. Implement persistence and domain logic behind those interfaces.
5. Write and run tests.
6. Integrate Codex's UI through adapter hooks (screens never touch the database).
7. Run the validation gates, then update tracking (`.claude/rules/tracking.md`): task row → `node scripts/tracker.mjs --write` → CHANGELOG (verified only) → DECISIONS → HANDOFFS when Codex must act. Report changes and limitations. Never mark a task Done while any check fails.

## Validation gates (available once the app is scaffolded)

```bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```

Never claim a check passed unless it was actually executed in this session; report passed / failed / not run separately.

## Model routing and subagents

- Main session: Opus for architecture, planning, hard debugging; Sonnet for routine implementation (switch in the model picker; `opusplan` is an option).
- `architecture-reviewer` (Opus, read-only): layering, contracts, migrations, ownership — run before merging any schema/contract change.
- `test-debugger` (Sonnet; pass `model: opus` for hard bugs): writes/runs tests, finds root causes.
- `docs-maintainer` (Haiku): keeps docs, contracts and handoffs in sync with verified code.
- `feature-implementer` (Sonnet): well-specified implementation tasks with a written contract.

## Hooks (`.claude/hooks/`, report-only, never modify files)

SessionStart context · ownership guard (PreToolUse) · per-file ESLint (PostToolUse) · Stop: tracker validation when tracking docs were edited, TypeScript + related Jest tests when code was edited (blocks at most once per turn) · session log to `.claude/session-log/` (SessionEnd).

## Hard rules

- Strict TypeScript; no `any` without a justified comment. Validate external/persisted data with Zod.
- Persist each completed set immediately; multi-record writes use transactions; historical sessions never change when routines/exercises change.
- No Supabase, cloud sync, analytics SDKs or network calls in app code (offline-first, private).
- Do not commit, push, create repos/PRs or run EAS builds without the user's explicit request.
- Prefer official docs for current APIs (Expo plugin skills, Expo MCP `read_documentation`, Context7). Verify versions against the installed Expo SDK, not old examples.
- Tooling inventory and sources: `docs/TOOLING.md`.
