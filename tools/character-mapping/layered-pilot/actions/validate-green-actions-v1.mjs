import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { DIRECTIONAL_CALIBRATION } from '../directional/directional-rig-v1.mjs';
import { renderGreenV8, v8StandingPose } from '../green-rig-v8.mjs';
import {
  GREEN_ACTION_RIG_V1,
  greenStarJumpPose,
  loadGreenActionRigV1,
  renderGreenClipboard,
  renderGreenSeated,
  renderGreenStarJump,
} from './green-action-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/actions-v1');
const manifestBytes = readFileSync(resolve(output, 'manifest.json'));
const manifest = JSON.parse(manifestBytes);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const loaded = await loadGreenActionRigV1(repo);

function imageData(image) {
  const canvas = createCanvas(image.width, image.height);
  canvas.getContext('2d').drawImage(image, 0, 0);
  return canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
}

const transformPoint = (matrix, point) => ({
  x: matrix.a * point.x + matrix.c * point.y + matrix.e,
  y: matrix.b * point.x + matrix.d * point.y + matrix.f,
});

function connectedLandmarks(canvas, start, targets) {
  const width = canvas.width;
  const height = canvas.height;
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  const startPixels = [];
  for (let y = Math.round(start.y) - 4; y <= Math.round(start.y) + 4; y += 1) {
    for (let x = Math.round(start.x) - 4; x <= Math.round(start.x) + 4; x += 1) {
      if (x >= 0 && x < width && y >= 0 && y < height && data[(y * width + x) * 4 + 3]) startPixels.push(y * width + x);
    }
  }
  assert(startPixels.length, 'arm has no alpha at shoulder');
  const seen = new Uint8Array(width * height);
  const queue = [...startPixels];
  for (const pixel of queue) seen[pixel] = 1;
  for (let index = 0; index < queue.length; index += 1) {
    const pixel = queue[index];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    for (const next of [x ? pixel - 1 : -1, x + 1 < width ? pixel + 1 : -1,
      y ? pixel - width : -1, y + 1 < height ? pixel + width : -1]) {
      if (next >= 0 && !seen[next] && data[next * 4 + 3]) {
        seen[next] = 1;
        queue.push(next);
      }
    }
  }
  return targets.map(target => {
    for (let y = Math.round(target.y) - 4; y <= Math.round(target.y) + 4; y += 1) {
      for (let x = Math.round(target.x) - 4; x <= Math.round(target.x) + 4; x += 1) {
        if (x >= 0 && x < width && y >= 0 && y < height && seen[y * width + x]) return true;
      }
    }
    return false;
  });
}

function combinedArmCanvas(rendered, side) {
  const canvas = createCanvas(GREEN_ACTION_RIG_V1.canvas.width, GREEN_ACTION_RIG_V1.canvas.height);
  const context = canvas.getContext('2d');
  context.drawImage(rendered.diagnostics.arms[side].sleeveCanvas, 0, 0);
  context.drawImage(rendered.diagnostics.arms[side].handCanvas, 0, 0);
  return canvas;
}

function assertRigidHead(rendered, source, placement, label) {
  const expected = createCanvas(GREEN_ACTION_RIG_V1.canvas.width, GREEN_ACTION_RIG_V1.canvas.height);
  expected.getContext('2d').drawImage(source, placement.x, placement.y);
  const expectedData = expected.getContext('2d').getImageData(0, 0, expected.width, expected.height).data;
  const actualData = rendered.canvas.getContext('2d').getImageData(0, 0, rendered.canvas.width, rendered.canvas.height).data;
  let pixels = 0;
  for (let index = 0; index < expectedData.length; index += 4) {
    if (expectedData[index + 3] !== 255) continue;
    assert.deepEqual([...actualData.slice(index, index + 4)], [...expectedData.slice(index, index + 4)],
      `${label} rigid head pixel ${index / 4}`);
    pixels += 1;
  }
  return pixels;
}

function magentaPixels(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let count = 0;
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    if (data[index + 3] >= 24 && red >= 140 && blue >= 130 && green <= 110
      && red > green * 1.5 && blue > green * 1.5
      && red + blue - green * 2 >= 200
      && Math.abs(red - blue) <= 95) count += 1;
  }
  return count;
}

assert.equal(manifest.status, 'green-star-jump-south-owner-review');
assert.deepEqual(manifest.rig.phaseIds, GREEN_ACTION_RIG_V1.phaseIds);
assert.equal(manifest.sequences.length, 1);
assert.equal(manifest.sequences[0].frames.length, 8);
for (const pin of Object.values(manifest.assetPins)) {
  assert.equal(sha256(readFileSync(resolve(repo, pin.file))), pin.sha256, `${pin.file} changed`);
}
assert.equal(sha256(readFileSync(resolve(repo, manifest.sourceV8Manifest.file))), manifest.sourceV8Manifest.sha256,
  'v8 manifest changed');

const headData = imageData(loaded.images.head);
let deterministicFrames = 0;
let exactHeadPixels = 0;
let connectedArmChecks = 0;
let transformedCapCuffChecks = 0;
let shoulderTorsoOverlapChecks = 0;
let minimumShoulderTorsoOverlap = Infinity;
const frameHashes = new Set();
for (const [index, frame] of manifest.sequences[0].frames.entries()) {
  const pose = greenStarJumpPose(index);
  const rendered = renderGreenStarJump(loaded, pose);
  const bytes = rendered.canvas.toBuffer('image/png');
  assert.equal(sha256(bytes), frame.sha256, `${frame.file} is nondeterministic`);
  assert.equal(sha256(readFileSync(resolve(output, frame.file))), frame.sha256, `${frame.file} file hash`);
  frameHashes.add(frame.sha256);
  deterministicFrames += 1;
  const actual = rendered.canvas.getContext('2d').getImageData(0, 0,
    GREEN_ACTION_RIG_V1.canvas.width, GREEN_ACTION_RIG_V1.canvas.height).data;
  for (let y = 0; y < loaded.images.head.height; y += 1) for (let x = 0; x < loaded.images.head.width; x += 1) {
    const sourceIndex = (y * loaded.images.head.width + x) * 4;
    if (!headData[sourceIndex + 3]) continue;
    const targetX = x + rendered.metadata.head.x;
    const targetY = y + rendered.metadata.head.y;
    const targetIndex = (targetY * GREEN_ACTION_RIG_V1.canvas.width + targetX) * 4;
    assert.deepEqual([...actual.slice(targetIndex, targetIndex + 4)], [...headData.slice(sourceIndex, sourceIndex + 4)],
      `${frame.file} head pixel ${x},${y}`);
    exactHeadPixels += 1;
  }
  assert(rendered.metadata.bounds.left > 0 && rendered.metadata.bounds.right < GREEN_ACTION_RIG_V1.canvas.width - 1,
    `${frame.file} clips horizontally`);
  assert(rendered.metadata.bounds.top > 0 && rendered.metadata.bounds.bottom <= GREEN_ACTION_RIG_V1.floorY,
    `${frame.file} clips vertically or crosses floor`);
  const grounded = ['01', '06', '07', '08'].includes(frame.pose.phaseId);
  for (const side of ['left', 'right']) {
    const soleY = rendered.metadata.joints[side].soleContact.y;
    if (grounded) assert(Math.abs(soleY - GREEN_ACTION_RIG_V1.floorY) < 1e-9,
      `${frame.file} ${side} should be grounded`);
    else assert(soleY < GREEN_ACTION_RIG_V1.floorY, `${frame.file} ${side} should be airborne`);
    assert.equal(rendered.metadata.continuity[side].thighPathMisses, 0, `${frame.file} ${side} thigh gap`);
    assert.equal(rendered.metadata.continuity[side].shinPathMisses, 0, `${frame.file} ${side} shin gap`);
    if (frame.pose.phaseId === '08') continue;
    const arm = rendered.metadata.arms[side];
    const armCanvas = combinedArmCanvas(rendered, side);
    assert(connectedLandmarks(armCanvas, arm.shoulder, [arm.wrist, arm.handAnchor]).every(Boolean),
      `${frame.file} ${side} disconnected sleeve/hand`);
    const mappedCap = transformPoint(arm.sleeveTransform, arm.source.shoulder);
    const mappedCuff = transformPoint(arm.sleeveTransform, arm.source.cuff);
    assert(Math.hypot(mappedCap.x - arm.shoulder.x, mappedCap.y - arm.shoulder.y) < 1e-6,
      `${frame.file} ${side} sleeve cap misses shoulder`);
    assert(Math.hypot(mappedCuff.x - arm.wrist.x, mappedCuff.y - arm.wrist.y) < 1e-6,
      `${frame.file} ${side} sleeve cuff misses hand anchor`);
    const torsoData = rendered.diagnostics.torsoCanvas.getContext('2d').getImageData(0, 0,
      GREEN_ACTION_RIG_V1.canvas.width, GREEN_ACTION_RIG_V1.canvas.height).data;
    const sleeveData = rendered.diagnostics.arms[side].sleeveCanvas.getContext('2d').getImageData(0, 0,
      GREEN_ACTION_RIG_V1.canvas.width, GREEN_ACTION_RIG_V1.canvas.height).data;
    let overlap = 0;
    for (let y = Math.round(arm.shoulder.y) - 8; y <= Math.round(arm.shoulder.y) + 12; y += 1) {
      for (let x = Math.round(arm.shoulder.x) - 12; x <= Math.round(arm.shoulder.x) + 12; x += 1) {
        const pixel = (y * GREEN_ACTION_RIG_V1.canvas.width + x) * 4;
        if (torsoData[pixel + 3] && sleeveData[pixel + 3]) overlap += 1;
      }
    }
    assert(overlap >= 20, `${frame.file} ${side} shoulder misses torso`);
    minimumShoulderTorsoOverlap = Math.min(minimumShoulderTorsoOverlap, overlap);
    connectedArmChecks += 1;
    transformedCapCuffChecks += 2;
    shoulderTorsoOverlapChecks += 1;
  }
}
assert.equal(frameHashes.size, 8, 'star jump phases are not distinct');

const readyBytes = renderGreenStarJump(loaded, greenStarJumpPose(7)).canvas.toBuffer('image/png');
const v8StandBytes = renderGreenV8(loaded, v8StandingPose()).canvas.toBuffer('image/png');
assert(readyBytes.equals(v8StandBytes), 'ready frame is not exact v8 standing endpoint');
for (const record of [manifest.contactSheet, ...Object.values(manifest.inspection)]) {
  assert.equal(sha256(readFileSync(resolve(output, record.file))), record.sha256, `${record.file} changed`);
  await loadImage(resolve(output, record.file));
}


let seatedRigidHeadPixels = 0;
let seatedFloorChecks = 0;
let seatedArmAnchorChecks = 0;
for (const view of GREEN_ACTION_RIG_V1.sitting.views) {
  const record = manifest.statics.sitting[view];
  const rendered = renderGreenSeated(loaded, view);
  const bytes = rendered.canvas.toBuffer('image/png');
  assert.equal(sha256(bytes), record.sha256, `sit ${view} nondeterministic`);
  assert.equal(sha256(readFileSync(resolve(output, record.file))), record.sha256, `sit ${view} file hash`);
  assert.equal(rendered.metadata.bounds.bottom, GREEN_ACTION_RIG_V1.floorY, `sit ${view} misses floor`);
  assert(rendered.metadata.waistY < rendered.metadata.seatY
    && rendered.metadata.seatY < rendered.metadata.floorY, `sit ${view} seat registration`);
  assert.equal(magentaPixels(rendered.canvas), 0, `sit ${view} retains magenta fringe`);
  const sourceHead = view === 'south' ? loaded.images.head : loaded.directional.heads[view];
  seatedRigidHeadPixels += assertRigidHead(rendered, sourceHead, rendered.metadata.head, `sit ${view}`);
  const expectedTorsoScale = view === 'south' ? loaded.torsoScale : DIRECTIONAL_CALIBRATION.torsoScale[view];
  assert.equal(rendered.metadata.torso.scale, expectedTorsoScale, `sit ${view} torso scale changed`);
  for (const side of ['left', 'right']) {
    const arm = rendered.metadata.arms[side];
    const mappedShoulder = transformPoint(arm.transform, arm.sourceAnchors.shoulder);
    assert(Math.hypot(mappedShoulder.x - arm.shoulder.x, mappedShoulder.y - arm.shoulder.y) < 1e-6,
      `sit ${view} ${side} cap misses socket`);
    assert(arm.hand.y >= 198, `sit ${view} ${side} hand does not reach lap`);
    seatedArmAnchorChecks += 1;
  }
  seatedFloorChecks += 1;
}

const clipboardRecord = manifest.statics.clipboard.south;
const clipboard = renderGreenClipboard(loaded);
const clipboardBytes = clipboard.canvas.toBuffer('image/png');
assert.equal(sha256(clipboardBytes), clipboardRecord.sha256, 'clipboard nondeterministic');
assert.equal(sha256(readFileSync(resolve(output, clipboardRecord.file))), clipboardRecord.sha256,
  'clipboard file hash');
assert(clipboard.metadata.bounds.bottom >= GREEN_ACTION_RIG_V1.floorY - 1
  && clipboard.metadata.bounds.bottom <= GREEN_ACTION_RIG_V1.floorY, 'clipboard misses floor');
assert.equal(magentaPixels(clipboard.canvas), 0, 'clipboard retains magenta fringe');
const clipboardHeadPixels = assertRigidHead(clipboard, loaded.images.head, clipboard.metadata.head, 'clipboard');
assert.equal(clipboard.metadata.torso.scale, loaded.torsoScale, 'clipboard torso scale changed');
for (const side of ['left', 'right']) {
  const arm = clipboard.metadata.arms[side];
  const mappedShoulder = transformPoint(arm.transform, arm.sourceAnchors.shoulder);
  assert(Math.hypot(mappedShoulder.x - arm.shoulder.x, mappedShoulder.y - arm.shoulder.y) < 1e-6,
    `clipboard ${side} cap misses socket`);
}
const board = clipboard.metadata.board;
assert(clipboard.metadata.arms.left.hand.y >= board.y + board.height - 5,
  'clipboard support palm is not under bottom edge');
assert(Math.abs(clipboard.metadata.arms.right.hand.x - (board.x + board.width)) <= 6,
  'clipboard right hand misses side edge');
for (const record of Object.values(manifest.staticReview)) {
  assert.equal(sha256(readFileSync(resolve(output, record.file))), record.sha256, `${record.file} changed`);
  await loadImage(resolve(output, record.file));
}

console.log(JSON.stringify({
  status: 'PASS',
  deterministicFrames,
  distinctFrames: frameHashes.size,
  exactOpaqueHeadPixels: exactHeadPixels,
  connectedSleeveHandChecks: connectedArmChecks,
  transformedCapCuffChecks,
  shoulderTorsoOverlapChecks,
  minimumShoulderTorsoOverlapPixels: minimumShoulderTorsoOverlap,
  groundedFrames: 4,
  airborneFrames: 4,
  exactV8StandingEndpoint: 1,
  seatedDeterministicFrames: 4,
  seatedRigidHeadPixels,
  seatedFloorChecks,
  seatedArmAnchorChecks,
  clipboardDeterministicFrames: 1,
  clipboardRigidHeadPixels: clipboardHeadPixels,
  clipboardSupportEdgeChecks: 2,
  magentaFringePixels: 0,
  note: 'Technical validation does not establish visual approval.',
}, null, 2));
