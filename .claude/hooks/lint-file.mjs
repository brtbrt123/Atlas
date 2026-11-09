// PostToolUse (Edit|Write|MultiEdit): record the touched file for the Stop checks and
// run ESLint on that single file (report-only, never --fix). No-op until ESLint is installed.
import fs from 'node:fs';
import path from 'node:path';
import {
  CODE_EXT,
  emit,
  localBin,
  projectDir,
  readInput,
  relPath,
  run,
  touchedFile,
  truncate,
} from './lib.mjs';

const input = await readInput();
const root = projectDir(input);
const toolInput = input.tool_input ?? {};
const rel = relPath(root, toolInput.file_path);

if (!rel || rel.startsWith('.claude/session-log/')) process.exit(0);

// Record for stop-checks.mjs (one path per line).
try {
  fs.appendFileSync(touchedFile(root, input.session_id), `${rel}\n`);
} catch {
  /* best effort */
}

const abs = path.join(root, rel);
const eslint = localBin(root, 'eslint', 'bin/eslint.js');
const ignored = /^(node_modules|dist|coverage|\.expo|android|ios|drizzle)\//.test(rel);

if (!CODE_EXT.test(rel) || ignored || !eslint || !fs.existsSync(abs)) process.exit(0);

const res = run(process.execPath, [eslint, '--no-warn-ignored', '--format', 'stylish', abs], {
  cwd: root,
  timeoutMs: 40_000,
});

if (res.timedOut) {
  emit({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `ESLint timed out on ${rel}; not checked.` } });
} else if (res.status === 1) {
  emit({ decision: 'block', reason: `ESLint reported problems in ${rel} (not auto-fixed):\n${truncate(res.out)}` });
} else if (res.status !== 0) {
  emit({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `ESLint could not run on ${rel} (exit ${res.status}):\n${truncate(res.out, 1500)}`,
    },
  });
}
process.exit(0);
