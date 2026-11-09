# Progress tracking rules

ATLAS uses ordered milestones and small verifiable tasks — no sprints, story points or deadlines (DEC-001). `docs/FEATURE_TRACKER.md` is the only task system (DEC-002); never create a parallel list, board or TODO file.

## Status integrity

- **Done** only when every acceptance criterion is met, the required checks were actually run in this session and passed, and the Evidence cell records what was run, the result and the date. Never Done for drafts, mocks, partial work, untested code, or while any check fails.
- Verification failing on a previously Done task → move it back to **In Progress** and record why.
- **Blocked** requires `Blocker: <reason>` in Evidence. **Ready** requires all dependencies Done.
- Change status only on tasks you own (`Claude Code`), or `Shared` tasks where you performed the verification. Never change Codex-owned rows — record the finding in `docs/HANDOFFS.md` instead.

## After meaningful work (in this order)

1. Update the affected task row(s) in `docs/FEATURE_TRACKER.md` with Edit — one row at a time, never rewrite the file. New tasks take the next free ID in their milestone; IDs are never reused.
2. Run `node scripts/tracker.mjs --write` — validates the rules and regenerates the progress block in `docs/PROJECT_STATUS.md`; update its narrative sections (phase, blockers, recommended next task) if they changed.
3. Add verified changes to `docs/CHANGELOG.md` under today's date with author and task ID.
4. Add significant engineering decisions to `docs/DECISIONS.md` (new DEC-NNN; supersede, never rewrite).
5. Append a dated `## YYYY-MM-DD · Claude Code · <topic>` entry to `docs/HANDOFFS.md` when Codex needs to act (new contracts, unblocked UI tasks, failing Codex checks).

The Stop hook runs `node scripts/tracker.mjs --check` whenever the tracker or status file was edited and blocks once if the rules are violated or `PROJECT_STATUS.md` is stale.

## Concurrency

Codex edits the same files in the same working tree. Re-read a tracking file immediately before editing it, edit only your rows/entries, and never use Write on an existing tracking file. With separate worktrees, reconcile tracker rows during integration (row-level merge; re-run `--write` after resolving).
