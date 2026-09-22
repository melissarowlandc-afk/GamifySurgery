import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { GREEN_RIG_V6, loadGreenRigV6, renderGreenPose } from './green-rig-v6.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/v6-motion');
const manifest = JSON.parse(readFileSync(resolve(output, 'manifest.json')));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fileHash = path => sha(readFileSync(path));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(manifest.schemaVersion === 6, 'unexpected manifest schema');
assert(manifest.status === 'motion-pilot-awaiting-visual-review', 'motion draft status changed');
assert(JSON.stringify(manifest.rig) === JSON.stringify(GREEN_RIG_V6), 'manifest rig differs from renderer rig');
assert(manifest.rig.head.rigid && manifest.rig.head.scale === 1, 'head is not rigid at source scale');
assert(manifest.rig.view === 'south', 'pilot scope expanded beyond South');

for (const record of Object.values(manifest.assetPins)) {
  assert(fileHash(resolve(repo, record.path)) === record.sha256, `${record.path} hash changed`);
  for (const linked of [record.provenance, record.prompt].filter(Boolean)) {
    assert(fileHash(resolve(repo, linked.path)) === linked.sha256, `${linked.path} hash changed`);
  }
}

async function pixels(path) {
  const image = await loadImage(path);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return { width: image.width, height: image.height, data: context.getImageData(0, 0, image.width, image.height).data };
}

const armsProvenance = JSON.parse(readFileSync(resolve(repo, manifest.assetPins.seatedArms.provenance.path)));
const opaqueArms = await pixels(resolve(repo, armsProvenance.opaqueSource.path));
const transparentArms = await pixels(resolve(repo, armsProvenance.transparentOutput.path));
let retainedArmPixels = 0;
let exactArmRgb = 0;
for (let index = 0; index < transparentArms.data.length; index += 4) {
  if (!transparentArms.data[index + 3]) continue;
  retainedArmPixels += 1;
  if (transparentArms.data[index] === opaqueArms.data[index]
    && transparentArms.data[index + 1] === opaqueArms.data[index + 1]
    && transparentArms.data[index + 2] === opaqueArms.data[index + 2]) exactArmRgb += 1;
}
assert(retainedArmPixels === exactArmRgb, 'seated-arm retained RGB changed');
assert(retainedArmPixels === armsProvenance.alpha.retained, 'seated-arm retained alpha count changed');

const expected = { walk: 16, 'sit-down': 16, 'seated-hold': 8, 'stand-up': 16 };
assert(manifest.sequences.length === 4, 'sequence count changed');
const loaded = await loadGreenRigV6(repo);
let frameCount = 0;
let plantedChecks = 0;
let maximumSupportError = 0;
for (const sequence of manifest.sequences) {
  assert(sequence.frames.length === expected[sequence.id], `${sequence.id} frame count changed`);
  for (const frame of sequence.frames) {
    frameCount += 1;
    assert(frame.width === 160 && frame.height === 320, `${frame.file} dimensions changed`);
    assert(frame.head.scale === 1 && frame.pose.headScale === 1, `${frame.file} head scale changed`);
    assert(frame.pose.travelX === 0, `${frame.file} falsely declares travel`);
    assert(frame.bounds.left > 0 && frame.bounds.right < 159 && frame.bounds.top > 0 && frame.bounds.bottom <= GREEN_RIG_V6.floorY, `${frame.file} clips or crosses floor`);
    const bytes = readFileSync(resolve(output, frame.file));
    assert(sha(bytes) === frame.sha256, `${frame.file} hash changed`);
    const rerendered = renderGreenPose(loaded, frame.pose).canvas.toBuffer('image/png');
    assert(sha(rerendered) === frame.sha256, `${frame.file} is nondeterministic`);
    for (const contact of frame.contacts) {
      if (contact.planted) {
        plantedChecks += 1;
        assert(contact.floorY === GREEN_RIG_V6.floorY, `${frame.file} planted foot misses floor`);
        const error = Math.abs(contact.actualSupportX - contact.supportX);
        maximumSupportError = Math.max(maximumSupportError, error);
        assert(error <= 0.75, `${frame.file} planted support slides ${error}px`);
      }
      if (contact.kind === 'replacement') assert(contact.floorY === GREEN_RIG_V6.floorY, `${frame.file} seated feet miss floor`);
    }
  }
}

const byId = Object.fromEntries(manifest.sequences.map(sequence => [sequence.id, sequence]));
assert(new Set(byId.walk.frames.map(frame => frame.sha256)).size >= 12, 'walk cycle has too few distinct frames');
assert(new Set(byId['sit-down'].frames.map(frame => frame.sha256)).size === 16, 'sit transition contains duplicate frames');
assert(byId['sit-down'].frames[0].sha256 === byId['stand-up'].frames.at(-1).sha256, 'standing endpoints differ');
assert(byId['sit-down'].frames.at(-1).sha256 === byId['seated-hold'].frames[0].sha256, 'seated hold endpoint differs');
assert(byId['sit-down'].frames.at(-1).sha256 === byId['stand-up'].frames[0].sha256, 'stand-up does not reverse seated endpoint');
for (let index = 0; index < 16; index += 1) {
  assert(byId['sit-down'].frames[index].sha256 === byId['stand-up'].frames[15 - index].sha256, `stand-up is not exact reversal at ${index}`);
  assert(byId['sit-down'].frames[index].pose.replacement === (index >= GREEN_RIG_V6.seated.replacementFrame), `replacement boundary changed at ${index}`);
}
assert(byId.walk.frames.every(frame => frame.contacts.some(contact => contact.planted)), 'walk frame without a planted foot');

for (const outputRecord of [manifest.atlas, manifest.contacts.walk, manifest.contacts.sit, manifest.sourceComparison]) {
  assert(fileHash(resolve(output, outputRecord.file)) === outputRecord.sha256, `${outputRecord.file} hash changed`);
}
const atlas = await loadImage(resolve(output, manifest.atlas.file));
assert(atlas.width === 1280 && atlas.height === 2240, 'atlas dimensions changed');
assert(manifest.replacementContract.noCrossfade && manifest.replacementContract.noDoubleExposure, 'replacement contract weakened');

console.log(JSON.stringify({
  status: 'PASS',
  frameCount,
  sequences: expected,
  deterministicRenders: frameCount,
  rigidHeadScaleChecks: frameCount,
  plantedChecks,
  maximumSupportError,
  exactSeatedArmRgb: exactArmRgb,
  endpointAndReverseChecks: 18,
  atlas: { width: atlas.width, height: atlas.height, sha256: manifest.atlas.sha256 },
  scope: 'South-only in-place motion pilot; visual acceptance remains separate',
}, null, 2));
