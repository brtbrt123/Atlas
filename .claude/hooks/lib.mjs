// Shared helpers for ATLAS Claude Code hooks.
// Hooks are report-only: they never modify project source files. They only write
// under .claude/session-log/ (git-ignored).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function projectDir(input = {}) {
  return path.resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
}

/** Project-relative POSIX path, or null when the file is outside the project. */
export function relPath(root, file) {
  if (!file) return null;
  const rel = path.relative(root, path.resolve(root, file));
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join('/');
}

export function run(cmd, args, { cwd, timeoutMs = 60_000 } = {}) {
  const res = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    windowsHide: true,
    env: { ...process.env, FORCE_COLOR: '0', CI: process.env.CI ?? '' },
  });
  return {
    status: res.status,
    timedOut: res.error?.code === 'ETIMEDOUT',
    error: res.error,
    out: `${res.stdout ?? ''}${res.stderr ?? ''}`.trim(),
  };
}

export function git(root, args) {
  const r = run('git', args, { cwd: root, timeoutMs: 10_000 });
  return r.status === 0 ? r.out : '';
}

export function sessionLogDir(root) {
  const dir = path.join(root, '.claude', 'session-log');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function safeId(id) {
  return String(id || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'unknown';
}

export function touchedFile(root, sessionId) {
  return path.join(sessionLogDir(root), `.touched-${safeId(sessionId)}`);
}

export function readTouched(root, sessionId) {
  try {
    const lines = fs.readFileSync(touchedFile(root, sessionId), 'utf8').split('\n');
    return [...new Set(lines.map((l) => l.trim()).filter(Boolean))];
  } catch {
    return [];
  }
}

export function clearTouched(root, sessionId) {
  try {
    fs.rmSync(touchedFile(root, sessionId), { force: true });
  } catch {
    /* ignore */
  }
}

export function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

export function truncate(text, max = 4000) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}\n… (truncated)` : text;
}

/** Local node_modules binary entry point (JS file), or null if not installed. */
export function localBin(root, pkg, rel) {
  const p = path.join(root, 'node_modules', pkg, rel);
  return fs.existsSync(p) ? p : null;
}

export const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/i;

// Ownership map — keep in sync with .claude/rules/collaboration.md.
const CODEX_PREFIXES = [
  'src/theme/',
  'src/components/',
  'src/features/',
  '.agents/',
  '.tools/',
  '.ui-review/',
  '.maestro/',
];
const CODEX_FILES = new Set([
  'agents.md',
  'tools/verify-ui-setup.mjs',
  'docs/design_system.md',
  'docs/skills.lock.json',
]);
const JOINT_FILES = new Set([
  'docs/handoffs.md',
  'docs/product_spec.md',
  'docs/feature_tracker.md',
  'docs/project_status.md',
  'docs/changelog.md',
  'docs/decisions.md',
  '.gitignore',
  '.gitattributes',
]);

export function ownerOf(rel) {
  const p = rel.toLowerCase();
  if (CODEX_FILES.has(p) || CODEX_PREFIXES.some((pre) => p.startsWith(pre))) return 'codex';
  if (/^docs\/ui_[^/]*\.md$/.test(p)) return 'codex';
  if (JOINT_FILES.has(p) || p.startsWith('assets/')) return 'joint';
  return 'claude';
}
