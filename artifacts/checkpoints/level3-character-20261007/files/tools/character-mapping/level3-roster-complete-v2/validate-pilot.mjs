import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCanvas, measure } from '../gs026-employee-expansion-v1/pipeline.mjs';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const pilot = resolve(root, 'pilot/001');
const manifestFile = resolve(pilot, 'manifest.json');
assert(existsSync(manifestFile), 'build the pilot before validating it');

const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
assert.equal(manifest.status, 'candidate-packaged-not-runtime-ready');
assert.equal(manifest.identity.stableId, 'level3-roster-v2.001');
assert.equal(manifest.normalization.target.width, 160);
assert.equal(manifest.normalization.target.height, 320);

const poseEntries = ['stand', 'sit'].flatMap(pose =>
  ['south', 'east', 'west', 'north'].map(direction => ({ pose, direction, entry: manifest.poses[pose][direction] }))
);
assert.equal(poseEntries.length, 8);
const scales = new Set();
for (const { pose, direction, entry } of poseEntries) {
  const file = resolve(repo, entry.file);
  assert(existsSync(file), `missing ${pose}-${direction}`);
  assert.equal(hash(file), entry.sha256, `hash mismatch for ${pose}-${direction}`);
  const canvas = await loadCanvas(file);
  assert.equal(canvas.width, 160, `${pose}-${direction} width`);
  assert.equal(canvas.height, 320, `${pose}-${direction} height`);
  assert.equal(measure(canvas).borderPixels, 0, `${pose}-${direction} has strong-alpha clipping`);
  assert.equal(entry.anchors.bodyAxisX, 80, `${pose}-${direction} body axis`);
  assert.equal(entry.anchors.floorY, 287, `${pose}-${direction} floor`);
  if (pose === 'sit') assert.equal(entry.anchors.seatContactStatus, 'provisional-pending-parent-authorship-and-visual-review');
  scales.add(entry.transform.scale);
}
assert.equal(scales.size, 1, 'all eight poses must share one identity-wide scale');

for (const [name, proof] of Object.entries(manifest.proofs)) {
  const file = resolve(repo, proof.file);
  assert(existsSync(file), `missing ${name} proof`);
  assert.equal(hash(file), proof.sha256, `${name} proof hash mismatch`);
}
const transparentProof = await loadCanvas(resolve(repo, manifest.proofs.fullTransparent.file));
const alpha = transparentProof.getContext('2d').getImageData(0, 0, transparentProof.width, transparentProof.height).data;
assert(alpha.some((value, index) => index % 4 === 3 && value === 0), 'transparent full-pose proof lacks alpha-zero perimeter');

console.log(JSON.stringify({ status: 'PASS', identity: manifest.identity.stableId, poses: poseEntries.length, runtimeReady: false }));
