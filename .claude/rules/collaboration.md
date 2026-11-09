# Collaboration rules (Claude Code ↔ Codex)

Two agents work in this repository for one human developer. Neither agent changes the other's owned files without a documented handoff in `docs/HANDOFFS.md` or the user's explicit approval.

## Ownership map

| Path / area | Owner |
|---|---|
| `package.json`, lockfile, `app.json`/`app.config.*`, `babel.config.*`, `metro.config.*`, `tailwind.config.*`, `tsconfig.json`, `eslint.config.*`, `jest.config.*`, `drizzle.config.*`, `eas.json` | Claude Code |
| `app/**` (routes, layouts, route groups), `src/navigation/**` (route placeholders and navigation helpers) | Claude Code |
| `src/database/**`, `src/services/**`, `src/stores/**`, `src/types/**`, `src/hooks/**` | Claude Code |
| `drizzle/**` migrations, `tests/unit/**`, `tests/integration/**` | Claude Code |
| `docs/CONTRACTS.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/TOOLING.md` | Claude Code (Codex may propose via HANDOFFS) |
| `CLAUDE.md`, `.claude/**`, `scripts/**` (incl. `scripts/tracker.mjs`) | Claude Code |
| `docs/FEATURE_TRACKER.md`, `docs/PROJECT_STATUS.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md` | Joint — structure by Claude Code; each agent edits only its own task rows / entries (see `.claude/rules/tracking.md`) |
| `src/theme/**`, `src/components/**`, `src/features/**` | Codex |
| UI/accessibility tests, `.maestro/**` UI journeys | Codex |
| `AGENTS.md`, `.agents/**`, `tools/verify-ui-setup.mjs`, `.tools/`, `.ui-review/` | Codex |
| `docs/DESIGN_SYSTEM.md`, `docs/UI_*.md`, `docs/skills.lock.json` | Codex |
| `docs/PRODUCT_SPEC.md`, `docs/HANDOFFS.md`, `.gitignore`, `.gitattributes`, `assets/**` | Joint — append/merge, never replace the other agent's content |

## Working rules

- Before editing any existing file you did not create in this session, read it. Before writing a "new" file, check it does not already exist.
- Shared files: merge, never overwrite wholesale. `docs/HANDOFFS.md` is append-only (newest entry at the bottom, dated, with author).
- Contracts flow one way: Claude defines types/services → documents in `docs/CONTRACTS.md` → Codex consumes via adapter hooks. Codex's UI-only proposal types (e.g. `src/features/preview/contracts.ts`) are input to contract design, not shared contracts.
- Shared configuration, route definitions and database schemas are never edited by both agents at the same time. Once git branches exist: Claude works on `feature/core` (worktree `../atlas-core`), Codex on `feature/ui` (worktree `../atlas-ui`); merge only after validation.
- Do not message or instruct the other agent directly; communicate through docs and the user.
- If you find a conflict (e.g. Codex's touch-target baseline differs from the spec), record it in HANDOFFS and ask the user — don't silently "fix" the other side.
