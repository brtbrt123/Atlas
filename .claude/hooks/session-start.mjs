// SessionStart: inject a short, read-only status brief (branch, working tree, latest
// handoff, scaffold state) and prune stale touched-file markers.
import fs from 'node:fs';
import path from 'node:path';
import { emit, git, projectDir, readInput, sessionLogDir } from './lib.mjs';

const input = await readInput();
const root = projectDir(input);

const branch = git(root, ['symbolic-ref', '--short', 'HEAD']) || git(root, ['rev-parse', '--short', 'HEAD']) || '(no git)';
const status = git(root, ['status', '--porcelain']);
const changed = status ? status.split('\n').filter(Boolean).length : 0;
const lastCommit = git(root, ['log', '-1', '--format=%h %s (%cr)']) || '(no commits yet)';

let latestHandoff = '(docs/HANDOFFS.md not found)';
try {
  const handoffs = fs.readFileSync(path.join(root, 'docs', 'HANDOFFS.md'), 'utf8');
  const lines = handoffs.split('\n');
  // Entries are dated "## YYYY-MM-DD · author · topic" headings; fall back to the last H1.
  const dated = lines.filter((l) => /^#{1,2} \d{4}-\d{2}-\d{2}/.test(l));
  const h1 = lines.filter((l) => /^# /.test(l));
  latestHandoff = (dated.at(-1) ?? h1.at(-1))?.replace(/^#+ /, '') ?? '(no entries)';
} catch {
  /* missing */
}

const scaffolded = fs.existsSync(path.join(root, 'package.json'));
const deps = fs.existsSync(path.join(root, 'node_modules'));

// Prune touched-file markers older than 2 days.
try {
  const dir = sessionLogDir(root);
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  for (const name of fs.readdirSync(dir)) {
    if (!name.startsWith('.touched-')) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).mtimeMs < cutoff) fs.rmSync(p, { force: true });
  }
} catch {
  /* ignore */
}

const lines = [
  'ATLAS session brief (from .claude/hooks/session-start.mjs):',
  `- Git: branch ${branch}; ${changed} uncommitted path(s); last commit: ${lastCommit}`,
  `- Latest handoff: ${latestHandoff}`,
  `- App scaffold: ${scaffolded ? 'package.json present' : 'not scaffolded yet'}${scaffolded && !deps ? ' (node_modules missing — run install before checks)' : ''}`,
  '- Reminder: Codex owns src/theme, src/components, src/features, AGENTS.md, .agents and UI docs — do not edit without a documented handoff. Read existing files before writing.',
];

emit({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: lines.join('\n') } });
process.exit(0);
