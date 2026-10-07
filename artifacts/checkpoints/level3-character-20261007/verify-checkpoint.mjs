import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const checkpoint = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(checkpoint, 'manifest.json'), 'utf8'));
const sourceHashes = JSON.parse(readFileSync(join(checkpoint, 'recovery/SOURCE_HASHES.json'), 'utf8'));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = data => createHash('sha256').update(data).digest('hex');
function owned(relativePath) {
  const target = resolve(checkpoint, relativePath);
  if (!target.startsWith(checkpoint + sep)) throw new Error('Unsafe archive path: ' + relativePath);
  return target;
}
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const paths = new Set(manifest.payloads.map(payload => payload.archivePath));
assert(paths.size === manifest.payloadCount, 'Payload count or duplicate paths');
assert(manifest.payloadBytes === manifest.payloads.reduce((sum, payload) => sum + payload.bytes, 0), 'Payload byte total');
for (const payload of manifest.payloads) {
  const target = owned(payload.archivePath);
  assert(existsSync(target), 'Missing payload: ' + payload.archivePath);
  if (!existsSync(target)) continue;
  const bytes = readFileSync(target);
  assert(bytes.length === payload.bytes && sha256(bytes) === payload.sha256, 'Payload hash: ' + payload.archivePath);
  assert(bytes.length < 100 * 1024 * 1024, 'GitHub file size: ' + payload.archivePath);
  assert(!/(^|\/)(\.env(?:\.|$)|\.private-clinical-data|\.clinical-workbench|node_modules|dist|test-results|playwright-report)(\/|$)/.test(payload.archivePath), 'Excluded path: ' + payload.archivePath);
  assert(!/(?:^|\/)(?:clinical-data|packages\/clinical-content)\//.test(payload.originalPath ?? ''), 'Unrelated clinical source path: ' + payload.archivePath);
  assert(!payload.archivePath.endsWith('/or-timeout-state.json'), 'Diagnostic save fixture included');
  if (payload.category === 'runtime-character-pose') {
    assert(bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'PNG signature: ' + payload.archivePath);
    assert(bytes.readUInt32BE(16) === 160 && bytes.readUInt32BE(20) === 320 && bytes[25] === 6, '160x320 RGBA pose: ' + payload.archivePath);
    const packagePath = payload.archivePath.replace('apps/player/public/art/characters/level3-roster-v2/level3-roster-v2.', 'artifacts/character-statics/level3-roster-complete-v2/packages/');
    assert(paths.has(packagePath) && sha256(readFileSync(owned(packagePath))) === payload.sha256, 'Derived/runtime pose mismatch: ' + payload.archivePath);
  }
  if (/\.(?:md|json|txt|mjs|ts|tsx|css|patch)$/.test(payload.archivePath)) {
    const text = bytes.toString('utf8');
    const credentialPatterns = [/(?:ghp_|github_pat_)[A-Za-z0-9_]{25,}/, /(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{24,}/, /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/, /AKIA[A-Z0-9]{16}/];
    assert(!credentialPatterns.some(pattern => pattern.test(text)), 'Potential credential: ' + payload.archivePath);
  }
}
for (const file of walk(checkpoint)) {
  const relativePath = file.substring(checkpoint.length + 1).replaceAll('\\', '/');
  assert(relativePath === 'manifest.json' || paths.has(relativePath), 'Unlisted archive file: ' + relativePath);
}
const count = category => manifest.payloads.filter(payload => payload.category === category).length;
assert(count('runtime-character-pose') === 256, 'Runtime pose count');
assert(count('accepted-native-character-source') === 32, 'Native source count');
assert(count('approved-level3-room-proof') === 7, 'Approved room proof count');
const runtimeRoomImages = manifest.payloads.filter(payload => payload.category === 'promoted-approved-room-runtime-asset' && payload.archivePath.endsWith('.webp'));
assert(runtimeRoomImages.length === 82, 'Runtime room image count');
for (const payload of runtimeRoomImages) {
  const original = payload.originalPath.split('/');
  const room = original.at(-2), filename = original.at(-1);
  const proofAsset = `files/tools/room-design/level-3/${room}/proof/processed-assets/${filename}`;
  assert(paths.has(proofAsset) && sha256(readFileSync(owned(proofAsset))) === payload.sha256, 'Room proof/runtime mismatch: ' + payload.archivePath);
}
const approvedSources = JSON.parse(readFileSync(owned('files/tools/character-mapping/level3-roster-complete-v2/review-acceptance.json'), 'utf8')).accepted;
for (const [identity, expected] of Object.entries(approvedSources)) {
  const native = `files/artifacts/character-statics/level3-roster-complete-v2/sources/${identity}/source.png`;
  assert(sha256(readFileSync(owned(native))) === expected, 'Accepted native source drift: ' + identity);
}
const referenceIndex = JSON.parse(readFileSync(owned('recovery/required-generation-references.json'), 'utf8'));
for (const reference of referenceIndex.references) assert(sha256(readFileSync(owned('files/' + reference.originalPath))) === reference.sha256, 'Generation reference drift: ' + reference.originalPath);
for (const gallery of ['files/artifacts/character-statics/level3-roster-complete-v2/review/index.html', 'files/artifacts/character-statics/level3-roster-complete-v2/contact-review/index.html']) {
  const html = readFileSync(owned(gallery), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|data:|#)/.test(match[1])) continue;
    assert(existsSync(resolve(dirname(owned(gallery)), match[1])), 'Broken gallery link: ' + match[1]);
  }
}
const scenePatch = readFileSync(owned('recovery/patches/apps__player__src__facility__FacilityScene.ts.patch'), 'utf8');
assert(!/^[+-].*(?:characterStepBounce|setAngle|applyStepBounce|routeMotion|gait-)/m.test(scenePatch), 'Motion change in Scene patch');
assert(!readFileSync(owned('documents/character-stills-then-level-three.md'), 'utf8').includes('melissadesktop.taile'), 'Private hostname in sanitized plan');
function reconstruct(base, patch) {
  const original = base.toString('utf8').split('\n');
  if (original.at(-1) === '') original.pop();
  const lines = patch.split('\n'); let result = [], cursor = 0;
  for (let index = 0; index < lines.length; index++) {
    const hunk = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(lines[index]);
    if (!hunk) continue;
    const start = Number(hunk[1]) - 1; result.push(...original.slice(cursor, start)); cursor = start;
    for (index++; index < lines.length && !/^@@ /.test(lines[index]); index++) {
      const kind = lines[index][0], content = lines[index].slice(1);
      if (![' ', '+', '-'].includes(kind)) continue;
      if (kind !== '+' && original[cursor] !== content) throw new Error('Patch context mismatch at old line ' + (cursor + 1));
      if (kind !== '-') result.push(content);
      if (kind !== '+') cursor++;
    }
    index--;
  }
  result.push(...original.slice(cursor)); return Buffer.from(result.join('\n') + '\n');
}
if (process.argv.includes('--check-local-baselines')) {
  for (const patch of sourceHashes.patches) {
    assert(existsSync(patch.baselinePath), 'Missing compatible baseline: ' + patch.baselinePath);
    if (!existsSync(patch.baselinePath)) continue;
    const base = readFileSync(patch.baselinePath);
    assert(sha256(base) === patch.baselineSha256, 'Baseline hash: ' + patch.targetPath);
    try { assert(sha256(reconstruct(base, readFileSync(owned(patch.patchPath), 'utf8'))) === patch.acceptedSha256, 'Reconstructed target hash: ' + patch.targetPath); }
    catch (error) { failures.push(patch.targetPath + ': ' + error.message); }
  }
}
console.log(JSON.stringify({ checkpoint: manifest.checkpoint, payloads: manifest.payloadCount, payloadBytes: manifest.payloadBytes, recoveryPatches: sourceHashes.patches.length, characters: 32, runtimePoses: 256, approvedRoomProofs: 7, roomImages: 82, localPatchReconstruction: process.argv.includes('--check-local-baselines'), failures }, null, 2));
if (failures.length) process.exitCode = 1;
