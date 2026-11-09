// Stop: validate what this turn changed, then report.
//  - Tracker docs edited → `node scripts/tracker.mjs --check` (rules + PROJECT_STATUS freshness).
//  - Code files edited (once the app is scaffolded) → `tsc --noEmit` + Jest tests related to them.
// Blocks the stop at most ONCE per turn (so Claude can fix the failure); when
// stop_hook_active is set it only reports, preventing retry loops. Never modifies files.
import fs from 'node:fs';
import path from 'node:path';
import {
  CODE_EXT,
  clearTouched,
  emit,
  localBin,
  projectDir,
  readInput,
  readTouched,
  run,
  truncate,
} from './lib.mjs';

const TRACKER_DOCS = new Set([
  'docs/feature_tracker.md',
  'docs/project_status.md',
]);

const input = await readInput();
const root = projectDir(input);
const touched = readTouched(root, input.session_id);
clearTouched(root, input.session_id);

const results = [];

// 1. Tracker validation (works before the app exists).
const trackerScript = path.join(root, 'scripts', 'tracker.mjs');
if (touched.some((f) => TRACKER_DOCS.has(f.toLowerCase())) && fs.existsSync(trackerScript)) {
  const r = run(process.execPath, [trackerScript, '--check'], { cwd: root, timeoutMs: 30_000 });
  results.push({
    name: 'tracker --check',
    ok: r.status === 0,
    detail: r.timedOut ? 'timed out after 30s' : r.out,
  });
}

// 2. Type check + related tests (only once the app is scaffolded).
const code = touched.filter(
  (f) => CODE_EXT.test(f) && !f.startsWith('.claude/') && fs.existsSync(path.join(root, f)),
);
const tsc = localBin(root, 'typescript', 'bin/tsc');
if (code.length > 0 && fs.existsSync(path.join(root, 'package.json')) && tsc) {
  const t = run(process.execPath, [tsc, '--noEmit', '--pretty', 'false'], { cwd: root, timeoutMs: 180_000 });
  results.push({ name: 'tsc --noEmit', ok: t.status === 0, detail: t.timedOut ? 'timed out after 180s' : t.out });

  const jest = localBin(root, 'jest', 'bin/jest.js');
  if (jest) {
    const j = run(
      process.execPath,
      [jest, '--findRelatedTests', ...code, '--bail', '--passWithNoTests', '--runInBand', '--silent'],
      { cwd: root, timeoutMs: 240_000 },
    );
    results.push({
      name: `jest --findRelatedTests (${code.length} file${code.length === 1 ? '' : 's'})`,
      ok: j.status === 0,
      detail: j.timedOut ? 'timed out after 240s' : j.out,
    });
  }
}

if (results.length === 0) process.exit(0);

const failed = results.filter((r) => !r.ok);
const summary = results.map((r) => `${r.ok ? 'PASS' : 'FAIL'} ${r.name}`).join(' · ');

if (failed.length === 0) {
  emit({ systemMessage: `Checks: ${summary}` });
} else if (!input.stop_hook_active) {
  emit({
    decision: 'block',
    reason:
      `Validation failed after this turn's edits — fix the root cause (do not weaken tests, types or tracker rules):\n\n` +
      failed.map((r) => `### ${r.name}\n${truncate(r.detail, 3500)}`).join('\n\n'),
  });
} else {
  emit({ systemMessage: `Checks still failing (not retrying automatically): ${summary}` });
}
process.exit(0);
