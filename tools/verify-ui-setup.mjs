import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
// Evaluate only our declarative tokens. This is a value check, not a TypeScript compiler.
const context = vm.createContext({});
const tokens = {};
for (const [file, name] of [
  ['colors', 'colors'], ['spacing', 'space'], ['typography', 'typographyTokens'],
  ['radii', 'radius'], ['motion', 'motion'], ['accessibility', 'accessibility'], ['variants', 'componentVariants'],
]) {
  const source = stripTypeScriptTypes(read(`src/theme/${file}.ts`))
    .replace(/^import .*;\s*$/gm, '').replace(/export const /g, 'const ');
  tokens[name] = vm.runInContext(`${source}\n;${name}`, context, { timeout: 1000 });
}
const { colors, space, typographyTokens, radius, motion, accessibility, componentVariants } = tokens;
assert.deepEqual(Object.values(colors), ['#101418', '#1E252B', '#293239', '#B7F36B', '#F5F7F8', '#A6B0B7', '#344047', '#EF7777']);
assert.ok(Object.values(space).every(value => value > 0 && value % 4 === 0));
assert.ok(Object.values(radius).every(value => value >= 0));
for (const role of Object.keys(typographyTokens.size)) assert.ok(typographyTokens.lineHeight[role] >= typographyTokens.size[role]);
assert.ok(accessibility.minTouchTarget >= 48 && accessibility.targetGap >= 8);
assert.equal(motion.reduced.spatialDuration, 0);
assert.equal(motion.reduced.scale, 1);
assert.equal(motion.reduced.overshoot, false);

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
for (const background of [colors.background, colors.surface, colors.elevated]) {
  for (const foreground of [colors.text, colors.muted, colors.accent, colors.danger]) {
    assert.ok(contrast(foreground, background) >= accessibility.textContrast, `Text contrast: ${foreground} on ${background}`);
  }
}
for (const [name, variant] of Object.entries(componentVariants.button)) {
  assert.ok(contrast(variant.foreground, variant.background) >= accessibility.textContrast, `Button contrast: ${name}`);
}
for (const [name, variant] of Object.entries(componentVariants.input)) {
  assert.ok(contrast(variant.foreground, variant.background) >= accessibility.textContrast, `Input text: ${name}`);
  assert.ok(contrast(variant.border, variant.background) >= accessibility.essentialGraphicContrast, `Input boundary: ${name}`);
}
console.log(`PASS tokens and enabled-state contrast; decorative border on background: ${contrast(colors.border, colors.background).toFixed(2)}:1`);

const lock = JSON.parse(read('docs/skills.lock.json'));
assert.equal(new Set(lock.skills.map(skill => skill.name)).size, lock.skills.length, 'Duplicate locked skill names');
for (const required of ['expo-native-ui', 'expo-animation', 'react-native-best-practices', 'react-native-testing', 'ponytail', 'systematic-debugging', 'verification-before-completion']) {
  assert.ok(lock.skills.some(skill => skill.name === required), `Missing required skill: ${required}`);
}
for (const skill of lock.skills) {
  const directory = path.join(root, skill.installedPath);
  const skillText = fs.readFileSync(path.join(directory, 'SKILL.md'), 'utf8');
  assert.match(skillText, /^---\r?\n/);
  assert.match(skillText, /^name:\s*\S+/m);
  assert.match(skillText, /^description:/m);
  if (skill.claudePointer) {
    const pointer = read(skill.claudePointer);
    assert.ok(pointer.includes(`name: ${skill.name}`));
    assert.ok(pointer.includes(`${skill.installedPath}/SKILL.md`));
  }
  for (const file of skill.files) {
    const data = fs.readFileSync(path.join(directory, file.path));
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), file.sha256, `${skill.name}/${file.path}`);
    assert.ok(!/\.(?:exe|dll|bat|cmd|sh|ps1|mjs|js|py)$/i.test(file.path), `Unexpected executable: ${file.path}`);
    if (skill.mode === 'markdown-only') assert.ok(file.path.endsWith('.md'), `Unexpected non-Markdown guidance: ${file.path}`);
  }
  console.log(`PASS ${skill.name}: ${skill.files.length} pinned files`);
}
for (const file of ['AGENTS.md', 'docs/DESIGN_SYSTEM.md', 'docs/UI_ENVIRONMENT.md', 'docs/UI_REVIEW.md']) assert.ok(read(file).length > 100);
assert.match(read('AGENTS.md'), /## Current phase and authority/);
assert.match(read('AGENTS.md'), /Never push on your own/);
console.log('PASS setup documentation, phase policy and push-approval rule');
console.log('NOT RUN React Native typecheck, lint, RNTL, Maestro device flows, native screenshots or assistive technology checks: no app foundation/device configured.');
