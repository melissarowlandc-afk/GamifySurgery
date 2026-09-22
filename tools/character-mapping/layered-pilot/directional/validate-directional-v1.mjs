import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { buildWalkGeometry } from '../../canonical-master/canonical-geometry.mjs';
import { CANVAS, DIRECTIONAL_CALIBRATION, DIRECTIONAL_VIEWS, directionalStandingPose, directionalWalkPose, loadDirectionalRig, renderDirectionalDiagnosticLayers, renderDirectionalStanding, renderDirectionalWalk } from './directional-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/directional-v1');
const manifest = JSON.parse(readFileSync(resolve(output, 'manifest.json')));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const canonical = buildWalkGeometry();

async function pixels(input) {
  const image = typeof input === 'string' ? await loadImage(input) : input;
  const canvas = createCanvas(image.width, image.height);
  canvas.getContext('2d').drawImage(image, 0, 0);
  return { canvas, data: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data };
}

function componentReaches(canvas, start, targets, threshold = 24, seedRadius = 8) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  const seen = new Uint8Array(canvas.width * canvas.height);
  const queue = new Int32Array(canvas.width * canvas.height);
  let read = 0; let write = 0;
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
    const pixel = y * canvas.width + x;
    if (seen[pixel] || data[pixel * 4 + 3] < threshold) return;
    seen[pixel] = 1; queue[write++] = pixel;
  };
  for (let y = Math.round(start.y) - seedRadius; y <= Math.round(start.y) + seedRadius; y += 1) for (let x = Math.round(start.x) - seedRadius; x <= Math.round(start.x) + seedRadius; x += 1) enqueue(x, y);
  assert(write > 0, `no alpha seed near ${JSON.stringify(start)}`);
  while (read < write) {
    const pixel = queue[read++]; const x = pixel % canvas.width; const y = Math.floor(pixel / canvas.width);
    enqueue(x - 1, y); enqueue(x + 1, y); enqueue(x, y - 1); enqueue(x, y + 1);
  }
  return targets.map(target => {
    for (let y = Math.round(target.y) - seedRadius; y <= Math.round(target.y) + seedRadius; y += 1) for (let x = Math.round(target.x) - seedRadius; x <= Math.round(target.x) + seedRadius; x += 1) {
      if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height && seen[y * canvas.width + x]) return true;
    }
    return false;
  });
}

function alphaOverlap(first, second, threshold = 24) {
  const a = first.getContext('2d').getImageData(0, 0, first.width, first.height).data;
  const b = second.getContext('2d').getImageData(0, 0, second.width, second.height).data;
  let count = 0;
  for (let index = 3; index < a.length; index += 4) if (a[index] >= threshold && b[index] >= threshold) count += 1;
  return count;
}

function alphaOverlapNear(first, second, center, radius = 11, threshold = 24) {
  const a = first.getContext('2d').getImageData(0, 0, first.width, first.height).data;
  const b = second.getContext('2d').getImageData(0, 0, second.width, second.height).data;
  let count = 0;
  for (let y = Math.max(0, Math.floor(center.y - radius)); y <= Math.min(first.height - 1, Math.ceil(center.y + radius)); y += 1) {
    for (let x = Math.max(0, Math.floor(center.x - radius)); x <= Math.min(first.width - 1, Math.ceil(center.x + radius)); x += 1) {
      if ((x - center.x) ** 2 + (y - center.y) ** 2 > radius ** 2) continue;
      const index = (y * first.width + x) * 4 + 3;
      if (a[index] >= threshold && b[index] >= threshold) count += 1;
    }
  }
  return count;
}

function mapped(matrix, point) {
  return { x: matrix.a * point.x + matrix.c * point.y + matrix.e, y: matrix.b * point.x + matrix.d * point.y + matrix.f };
}

function assertClosePoint(actual, expected, message) {
  assert(Math.hypot(actual.x - expected.x, actual.y - expected.y) < 1e-6, `${message}: ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`);
}

function alphaInRow(data, width, row, threshold = 24) {
  let count = 0;
  for (let x = 0; x < width; x += 1) if (data[(row * width + x) * 4 + 3] >= threshold) count += 1;
  return count;
}

assert(manifest.schemaVersion === 1 && manifest.cadenceMs === 180, 'manifest contract changed');
assert(manifest.sequences.length === 3 && manifest.sequences.every(sequence => sequence.frames.length === 8), 'expected three eight-phase sequences');
for (const record of [manifest.canonical.module, manifest.canonical.approvedManifest]) assert(sha(readFileSync(resolve(repo, record.path))) === record.sha256, `${record.path} pin changed`);
const prep = manifest.sourcePins;
for (const record of [prep.immutableSource, prep.generatedPlates.initial, prep.generatedPlates.correctedOpaque, prep.generatedPlates.transparent]) assert(sha(readFileSync(resolve(repo, record.path))) === record.sha256, `${record.path} pin changed`);
assert(prep.generatedPlates.transparent.retainedRgbChanges === 0, 'plate foreground RGB was modified during matte removal');

const loaded = await loadDirectionalRig(repo);
const immutableSource = await pixels(resolve(repo, prep.immutableSource.path));
let exactSourceHeadPixels = 0;
let exactSourceNeckPixels = 0;
for (const view of DIRECTIONAL_VIEWS) {
  const record = prep.heads[view];
  assert(sha(readFileSync(resolve(repo, record.file))) === record.sha256, `${view} head pin changed`);
  assert(record.retainedRgbChanges === 0, `${view} head retained RGB changed`);
  const head = await pixels(loaded.heads[view]);
  const [sourceX, sourceY] = record.sourceRect;
  for (let y = 0; y < loaded.heads[view].height; y += 1) for (let x = 0; x < loaded.heads[view].width; x += 1) {
    const index = (y * loaded.heads[view].width + x) * 4;
    if (!head.data[index + 3]) continue;
    const sourceIndex = ((sourceY + y) * immutableSource.canvas.width + sourceX + x) * 4;
    assert(head.data[index] === immutableSource.data[sourceIndex] && head.data[index + 1] === immutableSource.data[sourceIndex + 1] && head.data[index + 2] === immutableSource.data[sourceIndex + 2], `${view} head RGB is not exact source RGB`);
    exactSourceHeadPixels += 1;
  }
  const bridgeRecord = prep.neckBridges[view];
  assert(sha(readFileSync(resolve(repo, bridgeRecord.file))) === bridgeRecord.sha256, `${view} neck bridge pin changed`);
  const bridge = await pixels(loaded.neckBridges[view]);
  const [bridgeSourceX, bridgeSourceY] = bridgeRecord.sourceRect;
  for (let y = 0; y < loaded.neckBridges[view].height; y += 1) for (let x = 0; x < loaded.neckBridges[view].width; x += 1) {
    const index = (y * loaded.neckBridges[view].width + x) * 4;
    if (!bridge.data[index + 3]) continue;
    const sourceIndex = ((bridgeSourceY + y) * immutableSource.canvas.width + bridgeSourceX + x) * 4;
    assert(bridge.data[index] === immutableSource.data[sourceIndex] && bridge.data[index + 1] === immutableSource.data[sourceIndex + 1] && bridge.data[index + 2] === immutableSource.data[sourceIndex + 2], `${view} neck bridge RGB is not exact source RGB`);
    exactSourceNeckPixels += 1;
  }
}

let deterministicFrames = 0;
let exactCanonicalRecords = 0;
let legJointConnections = 0;
let armConnections = 0;
let minimumShoulderOverlap = Infinity;
let minimumSocketOverlap = Infinity;
let exactSleeveAnchorMappings = 0;
let exactRenderedHeadPixels = 0;
let floorContactChecks = 0;
let thumbDirectionChecks = 0;
let profileBackwardSwingChecks = 0;
let profileForwardSwingChecks = 0;
let visibleNeckOverlapChecks = 0;
let minimumHeadNeckOverlap = Infinity;
let minimumNeckTorsoOverlap = Infinity;
for (const sequence of manifest.sequences) {
  const view = sequence.view;
  assert(sequence.fps === 1000 / 180, `${view} cadence differs`);
  assert(new Set(sequence.frames.map(frame => frame.sha256)).size === 8, `${view} phases are not distinct`);
  for (const frame of sequence.frames) {
    const pose = directionalWalkPose(view, frame.index);
    assert(JSON.stringify(frame.canonicalGeometry) === JSON.stringify(canonical[view][frame.phaseId]), `${view} ${frame.phaseId} canonical geometry changed`);
    exactCanonicalRecords += 1;
    const rendered = renderDirectionalWalk(loaded, pose);
    const bytes = rendered.canvas.toBuffer('image/png');
    assert(sha(bytes) === frame.sha256 && sha(readFileSync(resolve(output, frame.file))) === frame.sha256, `${view} ${frame.phaseId} is nondeterministic`);
    deterministicFrames += 1;
    const actual = await pixels(rendered.canvas);
    const expectedHead = createCanvas(CANVAS.width, CANVAS.height);
    expectedHead.getContext('2d').drawImage(loaded.heads[view], frame.head.x, frame.head.y);
    const headData = expectedHead.getContext('2d').getImageData(0, 0, CANVAS.width, CANVAS.height).data;
    for (let index = 0; index < headData.length; index += 4) if (headData[index + 3] === 255) {
      assert(actual.data[index] === headData[index] && actual.data[index + 1] === headData[index + 1] && actual.data[index + 2] === headData[index + 2] && actual.data[index + 3] === 255, `${view} ${frame.phaseId} changed an opaque head pixel`);
      exactRenderedHeadPixels += 1;
    }
    const layers = renderDirectionalDiagnosticLayers(loaded, pose);
    const headNeckOverlap = alphaOverlap(layers.head.canvas, layers.neckBridge.canvas);
    const neckTorsoOverlap = alphaOverlap(layers.neckBridge.canvas, layers.torso.canvas);
    minimumHeadNeckOverlap = Math.min(minimumHeadNeckOverlap, headNeckOverlap);
    minimumNeckTorsoOverlap = Math.min(minimumNeckTorsoOverlap, neckTorsoOverlap);
    assert(headNeckOverlap >= 20, `${view} ${frame.phaseId} lacks exact head/neck pixel overlap`);
    assert(neckTorsoOverlap >= 20, `${view} ${frame.phaseId} lacks exact neck/torso pixel overlap`);
    visibleNeckOverlapChecks += 2;
    for (const side of ['left', 'right']) {
      assert(componentReaches(layers.legs[side].canvas, layers.joints[side].hip, [layers.joints[side].knee, layers.joints[side].ankle]).every(Boolean), `${view} ${frame.phaseId} ${side} leg breaks at hip/knee/ankle`);
      legJointConnections += 2;
      assert(componentReaches(layers.arms[side].canvas, layers.arms[side].shoulder, [layers.arms[side].cuff]).every(Boolean), `${view} ${frame.phaseId} ${side} cuff is detached from sleeve`);
      assert(layers.arms[side].cuff.x === layers.arms[side].handAnchor.x && layers.arms[side].cuff.y === layers.arms[side].handAnchor.y, `${view} ${frame.phaseId} ${side} hand anchor differs from cuff`);
      const expectedSocket = DIRECTIONAL_CALIBRATION.shoulderSockets[view][side];
      assert(layers.arms[side].shoulder.x === expectedSocket.x && layers.arms[side].shoulder.y === expectedSocket.y + layers.bodyBob, `${view} ${frame.phaseId} ${side} sleeve is not bound to its anatomical socket`);
      assertClosePoint(mapped(layers.arms[side].sleeve.matrix, layers.arms[side].sleeve.sourceAnchors.cap), layers.arms[side].shoulder, `${view} ${frame.phaseId} ${side} source cap mapping`);
      assertClosePoint(mapped(layers.arms[side].sleeve.matrix, layers.arms[side].sleeve.sourceAnchors.cuff), layers.arms[side].cuff, `${view} ${frame.phaseId} ${side} source cuff mapping`);
      exactSleeveAnchorMappings += 2;
      const overlap = alphaOverlap(layers.arms[side].canvas, layers.torso.canvas);
      minimumShoulderOverlap = Math.min(minimumShoulderOverlap, overlap);
      assert(overlap >= 12, `${view} ${frame.phaseId} ${side} shoulder does not overlap torso`);
      const socketOverlap = alphaOverlapNear(layers.arms[side].canvas, layers.torso.canvas, layers.arms[side].shoulder);
      minimumSocketOverlap = Math.min(minimumSocketOverlap, socketOverlap);
      assert(socketOverlap >= 8, `${view} ${frame.phaseId} ${side} has no local sleeve-cap/torso overlap at the anatomical socket`);
      armConnections += 1;
      if (view !== 'north') {
        const expectedDonor = view === 'east' ? (side === 'right' ? 'left' : 'right') : (side === 'left' ? 'right' : 'left');
        assert(layers.arms[side].donor.side === expectedDonor, `${view} ${frame.phaseId} ${side} uses the wrong whole arm donor`);
        const thumbDelta = layers.arms[side].thumbLandmark.x - layers.arms[side].thumbReference.x;
        assert(view === 'east' ? thumbDelta > 0.5 : thumbDelta < -0.5, `${view} ${frame.phaseId} ${side} thumb points backward`);
        thumbDirectionChecks += 1;
        const standing = directionalStandingPose(view).geometry.joints[side];
        const canonicalSwing = frame.canonicalGeometry.joints[side].wrist.x - frame.canonicalGeometry.joints[side].shoulder.x - (standing.wrist.x - standing.shoulder.x);
        const renderedSwing = layers.arms[side].cuff.x - DIRECTIONAL_CALIBRATION.restingCuffs[view][side].x;
        const facing = view === 'east' ? 1 : -1;
        if (canonicalSwing * facing < 0) {
          assert(Math.abs(renderedSwing - canonicalSwing * DIRECTIONAL_CALIBRATION.profileBackwardArmScale) < 1e-6, `${view} ${frame.phaseId} ${side} rearward swing was not reduced`);
          profileBackwardSwingChecks += 1;
        } else {
          assert(Math.abs(renderedSwing - canonicalSwing) < 1e-6, `${view} ${frame.phaseId} ${side} forward swing changed`);
          profileForwardSwingChecks += 1;
        }
      }
    }
    const planted = Object.values(frame.joints).filter(joints => Math.abs(joints.soleContact.y - CANVAS.floorY) < 1e-6);
    assert(planted.length >= 1, `${view} ${frame.phaseId} has no canonical planted support`);
    assert(alphaInRow(actual.data, CANVAS.width, CANVAS.floorY) > 0, `${view} ${frame.phaseId} has no rendered floor contact`);
    floorContactChecks += 1;
  }
  const standing = renderDirectionalStanding(loaded, view);
  assert(sha(standing.canvas.toBuffer('image/png')) === sequence.stand.sha256, `${view} standing is nondeterministic`);
  assert(componentReaches(standing.canvas, { x: CANVAS.axisX, y: 70 }, [{ x: CANVAS.axisX, y: 135 }], 24, 12)[0], `${view} source head is visibly detached from torso`);
  const standingLayers = renderDirectionalDiagnosticLayers(loaded, directionalStandingPose(view));
  for (const side of ['left', 'right']) {
    const arm = standingLayers.arms[side];
    const expectedSocket = DIRECTIONAL_CALIBRATION.shoulderSockets[view][side];
    assertClosePoint(arm.shoulder, expectedSocket, `${view} stand ${side} shoulder socket`);
    assertClosePoint(mapped(arm.sleeve.matrix, arm.sleeve.sourceAnchors.cap), arm.shoulder, `${view} stand ${side} source cap mapping`);
    assertClosePoint(mapped(arm.sleeve.matrix, arm.sleeve.sourceAnchors.cuff), arm.cuff, `${view} stand ${side} source cuff mapping`);
    const socketOverlap = alphaOverlapNear(arm.canvas, standingLayers.torso.canvas, arm.shoulder);
    minimumSocketOverlap = Math.min(minimumSocketOverlap, socketOverlap);
    assert(socketOverlap >= 8, `${view} stand ${side} lacks local socket overlap`);
    exactSleeveAnchorMappings += 2;
  }
  if (view !== 'north') for (const side of ['left', 'right']) {
    const arm = standing.metadata.parts.arms[side];
    const thumbDelta = arm.thumbLandmark.x - arm.thumbReference.x;
    assert(view === 'east' ? thumbDelta > 0.5 : thumbDelta < -0.5, `${view} stand ${side} thumb points backward`);
    thumbDirectionChecks += 1;
  }
}

assert(minimumShoulderOverlap >= 12, 'shoulder overlap minimum failed');
assert(minimumSocketOverlap >= 8, 'anatomical socket overlap minimum failed');
for (const [view, region] of Object.entries({ east: [15, 37, 70, 83, 150], west: [56, 72, 70, 80, 85] })) {
  const head = await pixels(loaded.heads[view]);
  let retainedSkullPixels = 0;
  for (let y = region[2]; y < region[3]; y += 1) for (let x = region[0]; x < region[1]; x += 1) if (head.data[(y * head.canvas.width + x) * 4 + 3] >= 24) retainedSkullPixels += 1;
  assert(retainedSkullPixels >= region[4], `${view} lower rear skull pixels were clipped (${retainedSkullPixels})`);
}
const eastFrames = manifest.sequences.find(sequence => sequence.view === 'east').frames;
const westFrames = manifest.sequences.find(sequence => sequence.view === 'west').frames;
assert([...eastFrames, ...westFrames].every(frame => Object.values(frame.joints).every(joints => joints.soleContact.x > 40 && joints.soleContact.x < 120)), 'profile support leaves the calibrated frame');
assert(eastFrames[0].joints.right.soleContact.x > eastFrames[4].joints.right.soleContact.x, 'East forward-foot direction reversed');
assert(westFrames[0].joints.right.soleContact.x < westFrames[4].joints.right.soleContact.x, 'West forward-foot direction reversed');
assert(sha(readFileSync(resolve(output, manifest.contactSheet.file))) === manifest.contactSheet.sha256, 'contact sheet hash changed');

console.log(JSON.stringify({ status: 'PASS', deterministicFrames, exactCanonicalRecords, exactSourceHeadPixels, exactSourceNeckPixels, exactRenderedHeadPixels, legJointConnections, armConnections, exactSleeveAnchorMappings, thumbDirectionChecks, profileBackwardSwingChecks, profileForwardSwingChecks, visibleNeckOverlapChecks, minimumHeadNeckOverlap, minimumNeckTorsoOverlap, minimumShoulderOverlap, minimumSocketOverlap, floorContactChecks, matteRemovedPixels: prep.generatedPlates.transparent.alpha.removed, retainedPlateRgbChanges: prep.generatedPlates.transparent.retainedRgbChanges, note: 'Technical checks do not establish visual approval.' }, null, 2));
