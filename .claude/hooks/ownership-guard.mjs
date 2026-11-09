// PreToolUse (Edit|Write|MultiEdit|NotebookEdit): ask for confirmation before Claude
// edits Codex-owned files, or fully overwrites an existing joint file.
// Never denies outright — the user can approve a documented handoff.
import fs from 'node:fs';
import path from 'node:path';
import { emit, ownerOf, projectDir, readInput, relPath } from './lib.mjs';

const input = await readInput();
const root = projectDir(input);
const toolInput = input.tool_input ?? {};
const file = toolInput.file_path ?? toolInput.notebook_path;
const rel = relPath(root, file);

if (rel) {
  const owner = ownerOf(rel);
  let reason = null;

  if (owner === 'codex') {
    reason =
      `"${rel}" is Codex-owned (see .claude/rules/collaboration.md). ` +
      'Edit only with a documented handoff in docs/HANDOFFS.md or the user\'s explicit approval.';
  } else if (owner === 'joint' && input.tool_name === 'Write' && fs.existsSync(path.join(root, rel))) {
    reason =
      `"${rel}" is a joint file that already exists. Overwriting it with Write can destroy the other agent's content — ` +
      'merge with Edit (HANDOFFS.md is append-only) unless the user approves a full rewrite.';
  }

  if (reason) {
    emit({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    });
  }
}
process.exit(0);
