import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { GREEN_RIG_V6, loadGreenRigV8, renderGreenV8, renderGreenV8Arm, renderGreenV8Hand, renderGreenV8Leg, v8Pose, v8StandingPose, V8_CALIBRATION } from './green-rig-v8.mjs';
import { loadGreenRigV7, renderGreenV7Arm, v7Pose } from './green-rig-v7.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/v8-motion');
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

function transformPoint(transform, point) {
  return { x: transform.a * point.x + transform.c * point.y + transform.e, y: transform.b * point.x + transform.d * point.y + transform.f };
}

function alphaBoundsInBand(canvas, top, bottom, threshold = 64) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width;
  let right = -1;
  for (let y = Math.max(0, Math.floor(top)); y <= Math.min(canvas.height - 1, Math.ceil(bottom)); y += 1) for (let x = 0; x < canvas.width; x += 1) if (data[(y * canvas.width + x) * 4 + 3] >= threshold) {
    left = Math.min(left, x);
    right = Math.max(right, x);
  }
  return { left, right, width: right - left + 1 };
}

function shoulderOverlap(armCanvas, torsoData, shoulder) {
  const armData = armCanvas.getContext('2d').getImageData(0, 0, armCanvas.width, armCanvas.height).data;
  let overlap = 0;
  for (let y = Math.round(shoulder.y) - 12; y <= Math.round(shoulder.y) + 22; y += 1) for (let x = Math.round(shoulder.x) - 22; x <= Math.round(shoulder.x) + 22; x += 1) {
    const index = (y * armCanvas.width + x) * 4;
    if (armData[index + 3] >= 64 && torsoData[index + 3] >= 64) overlap += 1;
  }
  return overlap;
}

function assertHandWinsTorso(handCanvas, torsoData, actualData, label) {
  const handData = handCanvas.getContext('2d').getImageData(0, 0, handCanvas.width, handCanvas.height).data;
  let overlap = 0;
  let opaqueWins = 0;
  for (let index = 0; index < handData.length; index += 4) {
    if (handData[index + 3] < 64 || torsoData[index + 3] < 64) continue;
    overlap += 1;
    if (handData[index + 3] === 255) {
      assert(actualData[index] === handData[index] && actualData[index + 1] === handData[index + 1] && actualData[index + 2] === handData[index + 2] && actualData[index + 3] === 255, `${label} torso paints over opaque hand`);
      opaqueWins += 1;
    }
  }
  assert(overlap > 0 && opaqueWins > 0, `${label} lacks measurable hand/torso occlusion`);
  return { overlap, opaqueWins };
}

assert(manifest.schemaVersion === 8 && manifest.status === 'arm-leg-fit-correction-awaiting-review', 'unexpected v8 manifest');
assert(manifest.sequences.map(sequence => sequence.id).join(',') === 'walk,stand,sit', 'v8 sequence scope changed');
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

const loaded = await loadGreenRigV8(repo);
const loadedV7 = await loadGreenRigV7(repo);
const headImage = loaded.images.head;
let exactHeadPixels = 0;
let matchedNearOpaqueTorsoPixels = 0;
let connectedLegChecks = 0;
let connectedArmChecks = 0;
let deterministicFrames = 0;
let transformedCuffChecks = 0;
let minimumShoulderOverlap = Infinity;
let maximumUpperSleeveWidthRatio = 0;
const sleeveAngles = [];
const sleeveLengths = [];
let minimumHandTorsoOverlap = Infinity;
let handOcclusionChecks = 0;
for (const frame of manifest.sequences[0].frames) {
  const pose = v8Pose(frame.index);
  const rendered = renderGreenV8(loaded, pose);
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
  const handMask = createCanvas(160, 320);
  const handMaskContext = handMask.getContext('2d');
  for (const side of ['left', 'right']) handMaskContext.drawImage(renderGreenV8Hand(loaded, pose, side).canvas, 0, 0);
  const handMaskData = handMaskContext.getImageData(0, 0, 160, 320).data;
  for (let index = 0; index < actual.data.length; index += 4) {
    if (headData[index + 3] === 255) {
      assert(actual.data[index] === headData[index] && actual.data[index + 1] === headData[index + 1] && actual.data[index + 2] === headData[index + 2] && actual.data[index + 3] === 255, `${frame.file} changed an opaque head pixel`);
      exactHeadPixels += 1;
    }
    if (torsoData[index + 3] >= 252 && headData[index + 3] === 0 && handMaskData[index + 3] === 0) {
      assert(Math.abs(actual.data[index] - torsoData[index]) <= 3 && Math.abs(actual.data[index + 1] - torsoData[index + 1]) <= 3 && Math.abs(actual.data[index + 2] - torsoData[index + 2]) <= 3, `${frame.file} changed a near-opaque torso pixel`);
      matchedNearOpaqueTorsoPixels += 1;
    }
  }

  for (const side of ['left', 'right']) {
    const leg = renderGreenV8Leg(loaded, pose, side);
    const legReach = componentReaches(leg.canvas, leg.joints.hip, [leg.joints.knee, leg.joints.ankle]);
    assert(legReach.every(Boolean), `${frame.file} ${side} leg alpha component breaks at a joint`);
    assert(Object.values(frame.continuity[side]).every(value => value > 0 || value === 0), `${frame.file} ${side} continuity metadata invalid`);
    assert(frame.continuity[side].thighPathMisses === 0 && frame.continuity[side].shinPathMisses === 0, `${frame.file} ${side} centerline misses alpha`);
    connectedLegChecks += 2;
    const arm = renderGreenV8Arm(loaded, pose, side);
    const armReach = componentReaches(arm.canvas, arm.metadata.shoulder, [arm.metadata.handAnchor]);
    assert(armReach[0], `${frame.file} ${side} sleeve/hand alpha component disconnected`);
    assert(arm.metadata.cuff.x === arm.metadata.handAnchor.x && arm.metadata.cuff.y === arm.metadata.handAnchor.y, `${frame.file} ${side} hand does not share cuff anchor`);
    const mappedShoulder = transformPoint(arm.metadata.sleeveTransform, V8_CALIBRATION.sleeves.shoulderAnchors[side]);
    const mappedCuff = transformPoint(arm.metadata.sleeveTransform, V8_CALIBRATION.sleeves.cuffAnchors[side]);
    assert(Math.hypot(mappedShoulder.x - arm.metadata.shoulder.x, mappedShoulder.y - arm.metadata.shoulder.y) < 1e-6, `${frame.file} ${side} sleeve transform misses shoulder`);
    assert(Math.hypot(mappedCuff.x - arm.metadata.handAnchor.x, mappedCuff.y - arm.metadata.handAnchor.y) < 1e-6, `${frame.file} ${side} sleeve transform misses hand anchor`);
    transformedCuffChecks += 2;
    sleeveAngles.push(arm.metadata.radians);
    sleeveLengths.push(Math.hypot(arm.metadata.cuff.x - arm.metadata.shoulder.x, arm.metadata.cuff.y - arm.metadata.shoulder.y));
    const overlap = shoulderOverlap(arm.canvas, torsoData, arm.metadata.shoulder);
    minimumShoulderOverlap = Math.min(minimumShoulderOverlap, overlap);
    assert(overlap >= 20, `${frame.file} ${side} shoulder does not overlap torso`);
    const v7Arm = renderGreenV7Arm(loadedV7, v7Pose(frame.index), side);
    const v8Width = alphaBoundsInBand(arm.canvas, arm.metadata.shoulder.y - 8, arm.metadata.shoulder.y + 42).width;
    const v7Width = alphaBoundsInBand(v7Arm.canvas, v7Arm.metadata.shoulder.y - 8, v7Arm.metadata.shoulder.y + 42).width;
    maximumUpperSleeveWidthRatio = Math.max(maximumUpperSleeveWidthRatio, v8Width / v7Width);
    assert(v8Width <= v7Width - 4, `${frame.file} ${side} upper sleeve was not narrowed`);
    const hand = renderGreenV8Hand(loaded, pose, side);
    const occlusion = assertHandWinsTorso(hand.canvas, torsoData, actual.data, `${frame.file} ${side}`);
    minimumHandTorsoOverlap = Math.min(minimumHandTorsoOverlap, occlusion.overlap);
    handOcclusionChecks += 1;
    connectedArmChecks += 1;
  }
}
assert(matchedNearOpaqueTorsoPixels > 10000, 'torso transform comparison sampled too few pixels');

const walk = manifest.sequences[0].frames;
assert(new Set(walk.map(frame => frame.sha256)).size === 8, 'walk phases are not distinct');
assert(walk.every(frame => frame.joints.left.soleContact.y === GREEN_RIG_V6.floorY || frame.joints.right.soleContact.y === GREEN_RIG_V6.floorY), 'phase without a planted foot');
assert(walk[2].joints.left.soleContact.y < walk[2].joints.right.soleContact.y && walk[6].joints.right.soleContact.y < walk[6].joints.left.soleContact.y, 'opposed passing-foot phases changed');
assert(walk.every(frame => Math.abs(frame.joints.right.hip.x - frame.joints.left.hip.x - 30) < 1e-9), 'leg lane span is not 30px');
assert(new Set(sleeveAngles.map(value => value.toFixed(4))).size >= 4, 'sleeve rotation does not vary with gait');
assert(new Set(sleeveLengths.map(value => value.toFixed(3))).size >= 3, 'sleeve length does not vary with gait');

const standFrame = manifest.sequences.find(sequence => sequence.id === 'stand').frames[0];
const standingPose = v8StandingPose();
const standingRender = renderGreenV8(loaded, standingPose);
assert(sha(standingRender.canvas.toBuffer('image/png')) === standFrame.sha256, 'corrected standing endpoint is nondeterministic');
assert(Math.abs(standFrame.joints.right.hip.x - standFrame.joints.left.hip.x - 30) < 1e-9, 'standing leg lane span is not 30px');
const standingActual = await raster(resolve(output, standFrame.file));
const standingTorsoCanvas = createCanvas(160, 320);
standingTorsoCanvas.getContext('2d').drawImage(loaded.images.torso, standFrame.torso.x, standFrame.torso.y, loaded.images.torso.width * standFrame.torso.scale, loaded.images.torso.height * standFrame.torso.scale);
const standingTorsoData = standingTorsoCanvas.getContext('2d').getImageData(0, 0, 160, 320).data;
for (const side of ['left', 'right']) {
  const hand = renderGreenV8Hand(loaded, standingPose, side);
  const occlusion = assertHandWinsTorso(hand.canvas, standingTorsoData, standingActual.data, `stand ${side}`);
  minimumHandTorsoOverlap = Math.min(minimumHandTorsoOverlap, occlusion.overlap);
  handOcclusionChecks += 1;
}
const sitFrame = manifest.sequences.find(sequence => sequence.id === 'sit').frames[0];
const sitSource = resolve(output, manifest.endpointContract.sourceRoot, manifest.endpointContract.sit);
assert(readFileSync(resolve(output, sitFrame.file)).equals(readFileSync(sitSource)), 'sitting endpoint is not byte-identical v6');
assert(manifest.endpointContract.transition === 'instant', 'static transition is no longer instant');
for (const record of [manifest.atlas, manifest.contactSheet, manifest.previousReference]) assert(fileHash(resolve(output, record.file)) === record.sha256, `${record.file} hash changed`);

console.log(JSON.stringify({
  status: 'PASS',
  deterministicFrames,
  frozenAssetPins: Object.keys(manifest.assetPins).length,
  exactCanonicalGeometryFrames: 8,
  exactOpaqueHeadPixels: exactHeadPixels,
  matchedNearOpaqueTorsoPixels,
  connectedLegJointChecks: connectedLegChecks,
  connectedSleeveHandChecks: connectedArmChecks,
  transformedShoulderCuffChecks: transformedCuffChecks,
  minimumShoulderTorsoOverlapPixels: minimumShoulderOverlap,
  handInFrontOcclusionChecks: handOcclusionChecks,
  minimumHandTorsoOverlapPixels: minimumHandTorsoOverlap,
  maximumUpperSleeveWidthRatioToV7: maximumUpperSleeveWidthRatio,
  legLaneSpan: 30,
  plantedPhaseChecks: 8,
  opposedPassingChecks: 2,
  deterministicCorrectedStand: 1,
  exactV6SittingEndpoint: 1,
  sourceBands: V8_CALIBRATION.sourceBands,
  note: 'Technical validation does not establish visual approval.',
}, null, 2));
