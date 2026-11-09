// SessionEnd: write a machine-generated handoff summary to .claude/session-log/
// (git-ignored). The human-readable handoff goes to docs/HANDOFFS.md via docs-maintainer.
import fs from 'node:fs';
import path from 'node:path';
import { clearTouched, git, projectDir, readInput, readTouched, sessionLogDir } from './lib.mjs';

const input = await readInput();
const root = projectDir(input);
const now = new Date();
const stamp = now.toISOString().slice(0, 10);
const sid = String(input.session_id || 'unknown').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 8) || 'unknown';

const branch = git(root, ['symbolic-ref', '--short', 'HEAD']) || '(no git)';
const status = git(root, ['status', '--short']) || '(clean or no git)';
const diffStat = git(root, ['diff', '--stat']) || '(no unstaged changes)';
const commits = git(root, ['log', '-5', '--format=%h %s (%cr)']) || '(no commits yet)';
const pending = readTouched(root, input.session_id);
clearTouched(root, input.session_id);

const body = [
  `# Session ${sid} — ended ${now.toISOString()}`,
  '',
  `- Reason: ${input.reason ?? 'unknown'}`,
  `- Branch: ${branch}`,
  '',
  '## Working tree',
  '```',
  status,
  '```',
  '',
  '## Diff stat (unstaged)',
  '```',
  diffStat,
  '```',
  '',
  '## Recent commits',
  '```',
  commits,
  '```',
  '',
  '## Files edited since the last Stop check',
  pending.length ? pending.map((f) => `- ${f}`).join('\n') : '- (none)',
  '',
].join('\n');

try {
  fs.writeFileSync(path.join(sessionLogDir(root), `${stamp}-${sid}.md`), body);
} catch {
  /* best effort */
}
process.exit(0);
