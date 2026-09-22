import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { GREEN_RIG_V6, loadGreenRigV7, renderGreenV7, renderGreenV7Arm, renderGreenV7Leg, v7Pose, V7_CALIBRATION } from './green-rig-v7.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/v7-motion');
const manifest = JSON.parse(readFileSync(resolve(output, 'manifest.json')));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fileHash = path => sha(readFileSync(path));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function raster(path) {
  const image = await loadImage(path);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return { image, canvas, data: context.getImageData(0, 0, image.width, image.height).data };
}

function componentReaches(canvas, start, targets, alphaThreshold = 64) {
  const context = canvas.getContext('2d');
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const visited = new Uint8Array(canvas.width * canvas.height);
  const queue = new Int32Array(canvas.width * canvas.height);
  let readIndex = 0;
  let writeIndex = 0;
  const enqueue = (x, y) => {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;
    const index = y * canvas.width + x;
    if (visited[index] || data[index * 4 + 3] < alphaThreshold) return;
    visited[index] = 1;
    queue[writeIndex++] = index;
  };
  for (let y = Math.round(start.y) - 6; y <= Math.round(start.y) + 6; y += 1) {
    for (let x = Math.round(start.x) - 6; x <= Math.round(start.x) + 6; x += 1) enqueue(x, y);
  }
  assert(writeIndex > 0, `no alpha seed near ${JSON.stringify(start)}`);
  while (readIndex < writeIndex) {
    const index = queue[readIndex++];
    const x = index % canvas.width;
    const y = Math.floor(index / canvas.width);
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) for (let offsetX = -1; offsetX <= 1; offsetX += 1) if (offsetX || offsetY) enqueue(x + offsetX, y + offsetY);
  }
  return targets.map(target => {
    for (let y = Math.round(target.y) - 6; y <= Math.round(target.y) + 6; y += 1) for (let x = Math.round(target.x) - 6; x <= Math.round(target.x) + 6; x += 1) {
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height && visited[y * canvas.width + x]) return true;
    }
    return false;
  });
}

assert(manifest.schemaVersion === 7 && manifest.status === 'same-art-walk-proof-awaiting-review', 'unexpected v7 manifest');
assert(manifest.sequences.map(sequence => sequence.id).join(',') === 'walk,stand,sit', 'v7 sequence scope changed');
assert(manifest.sequences[0].frames.length === 8, 'walk must have eight phases');
assert(Math.abs(manifest.sequences[0].fps - 1000 / 180) < 1e-12, 'walk cadence changed');
assert(manifest.rig.head.scale === 1 && manifest.rig.head.rigid, 'rigid source head contract changed');
assert(manifest.calibration.fixedRasterScale === manifest.rig.legsUniformScale || manifest.calibration.fixedRasterScale > 0, 'fixed raster scale missing');
const bands = manifest.calibration.sourceBands;
assert(bands.thigh.y + bands.thigh.height === bands.shin.y, 'thigh/shin source rows overlap or gap');
assert(bands.shin.y + bands.shin.height === bands.shoe.y, 'shin/shoe source rows overlap or gap');

for (const record of [...Object.values(manifest.assetPins), ...Object.values(manifest.canonical)]) {
  assert(fileHash(resolve(repo, record.path)) === record.sha256, `${record.path} hash changed`);
}

const loaded = await loadGreenRigV7(repo);
const headImage = loaded.images.head;
let exactHeadPixels = 0;
let matchedNearOpaqueTorsoPixels = 0;
let connectedLegChecks = 0;
let connectedArmChecks = 0;
let deterministicFrames = 0;
for (const frame of manifest.sequences[0].frames) {
  const pose = v7Pose(frame.index);
  const rendered = renderGreenV7(loaded, pose);
  const bytes = rendered.canvas.toBuffer('image/png');
  assert(sha(bytes) === frame.sha256, `${frame.file} is nondeterministic`);
  assert(fileHash(resolve(output, frame.file)) === frame.sha256, `${frame.file} hash changed`);
  assert(JSON.stringify(rendered.metadata.joints) === JSON.stringify(frame.joints), `${frame.file} geometry differs from canonical adapter`);
  assert(Number.isInteger(frame.pose.bodyBob), `${frame.file} uses fractional body bob`);
  assert(frame.head.scale === 1, `${frame.file} head scale changed`);
  deterministicFrames += 1;

  const actual = await raster(resolve(output, frame.file));
  const expectedHead = createCanvas(160, 320);
  expectedHead.getContext('2d').drawImage(headImage, frame.head.x, frame.head.y);
  const headData = expectedHead.getContext('2d').getImageData(0, 0, 160, 320).data;
  const expectedTorso = createCanvas(160, 320);
  expectedTorso.getContext('2d').drawImage(loaded.images.torso, frame.torso.x, frame.torso.y, loaded.images.torso.width * frame.torso.scale, loaded.images.torso.height * frame.torso.scale);
  const torsoData = expectedTorso.getContext('2d').getImageData(0, 0, 160, 320).data;
  for (let index = 0; index < actual.data.length; index += 4) {
    if (headData[index + 3] === 255) {
      assert(actual.data[index] === headData[index] && actual.data[index + 1] === headData[index + 1] && actual.data[index + 2] === headData[index + 2] && actual.data[index + 3] === 255, `${frame.file} changed an opaque head pixel`);
      exactHeadPixels += 1;
    }
    if (torsoData[index + 3] >= 252 && headData[index + 3] === 0) {
      assert(Math.abs(actual.data[index] - torsoData[index]) <= 3 && Math.abs(actual.data[index + 1] - torsoData[index + 1]) <= 3 && Math.abs(actual.data[index + 2] - torsoData[index + 2]) <= 3, `${frame.file} changed a near-opaque torso pixel`);
      matchedNearOpaqueTorsoPixels += 1;
    }
  }

  for (const side of ['left', 'right']) {
    const leg = renderGreenV7Leg(loaded, pose, side);
    const legReach = componentReaches(leg.canvas, leg.joints.hip, [leg.joints.knee, leg.joints.ankle]);
    assert(legReach.every(Boolean), `${frame.file} ${side} leg alpha component breaks at a joint`);
    assert(Object.values(frame.continuity[side]).every(value => value > 0 || value === 0), `${frame.file} ${side} continuity metadata invalid`);
    assert(frame.continuity[side].thighPathMisses === 0 && frame.continuity[side].shinPathMisses === 0, `${frame.file} ${side} centerline misses alpha`);
    connectedLegChecks += 2;
    const arm = renderGreenV7Arm(loaded, pose, side);
    const armReach = componentReaches(arm.canvas, arm.metadata.shoulder, [arm.metadata.hand]);
    assert(armReach[0], `${frame.file} ${side} sleeve/hand alpha component disconnected`);
    connectedArmChecks += 1;
  }
}
assert(matchedNearOpaqueTorsoPixels > 10000, 'torso transform comparison sampled too few pixels');

const walk = manifest.sequences[0].frames;
assert(new Set(walk.map(frame => frame.sha256)).size === 8, 'walk phases are not distinct');
assert(walk.every(frame => frame.joints.left.soleContact.y === GREEN_RIG_V6.floorY || frame.joints.right.soleContact.y === GREEN_RIG_V6.floorY), 'phase without a planted foot');
assert(walk[2].joints.left.soleContact.y < walk[2].joints.right.soleContact.y && walk[6].joints.right.soleContact.y < walk[6].joints.left.soleContact.y, 'opposed passing-foot phases changed');

for (const sequence of manifest.sequences.slice(1)) {
  const frame = sequence.frames[0];
  const source = sequence.id === 'stand' ? manifest.endpointContract.stand : manifest.endpointContract.sit;
  const sourcePath = resolve(output, manifest.endpointContract.sourceRoot, source);
  assert(readFileSync(resolve(output, frame.file)).equals(readFileSync(sourcePath)), `${sequence.id} endpoint is not byte-identical v6`);
}
assert(manifest.endpointContract.transition === 'instant', 'static transition is no longer instant');
for (const record of [manifest.atlas, manifest.contactSheet]) assert(fileHash(resolve(output, record.file)) === record.sha256, `${record.file} hash changed`);

console.log(JSON.stringify({
  status: 'PASS',
  deterministicFrames,
  frozenAssetPins: Object.keys(manifest.assetPins).length,
  exactCanonicalGeometryFrames: 8,
  exactOpaqueHeadPixels: exactHeadPixels,
  matchedNearOpaqueTorsoPixels,
  connectedLegJointChecks: connectedLegChecks,
  connectedSleeveHandChecks: connectedArmChecks,
  plantedPhaseChecks: 8,
  opposedPassingChecks: 2,
  exactV6StaticEndpoints: 2,
  sourceBands: V7_CALIBRATION.sourceBands,
  note: 'Technical validation does not establish visual approval.',
}, null, 2));
