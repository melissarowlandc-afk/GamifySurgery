import { createCanvas } from '@napi-rs/canvas';
import { buildStandingGeometry, buildWalkGeometry } from '../canonical-master/canonical-geometry.mjs';
import { GREEN_RIG_V6, loadGreenRigV6 } from './green-rig-v6.mjs';

export { GREEN_RIG_V6 };

const canonicalWalk = buildWalkGeometry().south;
const canonicalStand = buildStandingGeometry('south');
const hipSpan = canonicalStand.joints.right.hip.x - canonicalStand.joints.left.hip.x;
const verticalSpan = canonicalStand.joints.left.soleContact.y - canonicalStand.joints.left.hip.y;
const V8_HIPS = Object.freeze({ left: { x: 65, y: 197 }, right: { x: 95, y: 197 } });
const V8_SHOULDERS = Object.freeze({ left: { x: 50, y: 130 }, right: { x: 110, y: 130 } });
const scaleX = (V8_HIPS.right.x - V8_HIPS.left.x) / hipSpan;
const scaleY = (GREEN_RIG_V6.floorY - GREEN_RIG_V6.hips.left.y) / verticalSpan;

function mapJoint(point) {
  return {
    x: 80 + (point.x - canonicalStand.hipCenter.x) * scaleX,
    y: GREEN_RIG_V6.floorY - (canonicalStand.joints.left.soleContact.y - point.y) * scaleY,
  };
}

const standingArmReference = Object.fromEntries(['left', 'right'].map(side => [side, {
  shoulder: mapJoint(canonicalStand.joints[side].shoulder),
  wrist: mapJoint(canonicalStand.joints[side].wrist),
}]));

export const V8_CALIBRATION = Object.freeze({
  canonicalFrame: { width: 240, height: 310, axisX: 112, floorY: 296 },
  correctedRest: { hips: V8_HIPS, shoulders: V8_SHOULDERS, floorY: GREEN_RIG_V6.floorY },
  projectionScale: { x: scaleX, y: scaleY },
  sourceBands: {
    thigh: { y: 67, height: 452 },
    shin: { y: 519, height: 421 },
    shoe: { y: 940, height: 201 },
  },
  destinationSeamOverlap: 0.8,
  sleeves: {
    acrossScale: 0.29,
    shoulderAnchors: { left: { x: 65.0056, y: 15.0024 }, right: { x: 40.3096, y: 14.9216 } },
    cuffAnchors: { left: { x: 45.6548, y: 176.1736 }, right: { x: 58.0176, y: 176.3477 } },
    restCuffs: { left: { x: 48, y: 193 }, right: { x: 112, y: 193 } },
  },
  hands: { sourceSkinY: 35, scale: 0.25, skinAnchors: { left: { x: 47, y: 35 }, right: { x: 49, y: 35 } } },
});

function imageData(image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

function alphaBounds(data, imageWidth, rect, threshold = 128) {
  const [rectX, rectY, rectWidth, rectHeight] = rect;
  let left = rectX + rectWidth;
  let top = rectY + rectHeight;
  let right = -1;
  let bottom = -1;
  for (let y = rectY; y < rectY + rectHeight; y += 1) {
    for (let x = rectX; x < rectX + rectWidth; x += 1) {
      if (data[(y * imageWidth + x) * 4 + 3] < threshold) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < left) throw new Error(`empty source band ${rect.join(',')}`);
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

export async function loadGreenRigV8(repo) {
  const loaded = await loadGreenRigV6(repo);
  const pixels = imageData(loaded.images.legs);
  const bands = {};
  for (const side of ['left', 'right']) {
    const [sourceX, , sourceWidth] = loaded.legRects[side];
    bands[side] = {};
    for (const [name, band] of Object.entries(V8_CALIBRATION.sourceBands)) {
      const rect = [sourceX, band.y, sourceWidth, band.height];
      bands[side][name] = { rect, bounds: alphaBounds(pixels.data, loaded.images.legs.width, rect) };
    }
  }
  return { ...loaded, bands };
}

function angle(start, end) {
  return Math.atan2(end.y - start.y, end.x - start.x) - Math.PI / 2;
}

function extend(start, end, amount) {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  return { x: end.x + (end.x - start.x) / distance * amount, y: end.y + (end.y - start.y) / distance * amount };
}

function retract(start, end, amount) {
  return extend(end, start, amount);
}

function drawAxialBand(context, image, band, start, end, rasterScale) {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = band.rect;
  const sourceCenterX = band.bounds.left - sourceX + band.bounds.width / 2;
  const destinationLength = Math.hypot(end.x - start.x, end.y - start.y);
  context.save();
  context.translate(start.x, start.y);
  context.rotate(angle(start, end));
  context.scale(rasterScale, destinationLength / sourceHeight);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, -sourceCenterX, 0, sourceWidth, sourceHeight);
  context.restore();
}

function drawRigidShoe(context, image, band, soleContact, rasterScale) {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = band.rect;
  const sourceCenterX = band.bounds.left - sourceX + band.bounds.width / 2;
  const sourceBottom = band.bounds.bottom - sourceY;
  const scale = rasterScale;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, soleContact.x - sourceCenterX * scale, soleContact.y - sourceBottom * scale, sourceWidth * scale, sourceHeight * scale);
}

function alphaSampler(canvas) {
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  return (x, y, radius = 2) => {
    let count = 0;
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const sampleX = Math.round(x + offsetX);
      const sampleY = Math.round(y + offsetY);
      if (sampleX >= 0 && sampleX < canvas.width && sampleY >= 0 && sampleY < canvas.height && data[(sampleY * canvas.width + sampleX) * 4 + 3] > 0) count += 1;
    }
    return count;
  };
}

function pathMisses(alphaNear, start, end) {
  let misses = 0;
  for (let index = 0; index <= 20; index += 1) {
    const progress = index / 20;
    if (!alphaNear(start.x + (end.x - start.x) * progress, start.y + (end.y - start.y) * progress, 3)) misses += 1;
  }
  return misses;
}

function drawLeg(loaded, side, joints) {
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const overlap = V8_CALIBRATION.destinationSeamOverlap;
  drawAxialBand(context, loaded.images.legs, loaded.bands[side].thigh, joints.hip, extend(joints.hip, joints.knee, overlap), loaded.legScale);
  drawAxialBand(context, loaded.images.legs, loaded.bands[side].shin, retract(joints.knee, joints.ankle, overlap), extend(joints.knee, joints.ankle, overlap), loaded.legScale);
  drawRigidShoe(context, loaded.images.legs, loaded.bands[side].shoe, joints.soleContact, loaded.legScale);
  const alphaNear = alphaSampler(canvas);
  return { canvas, diagnostics: { hipAlpha: alphaNear(joints.hip.x, joints.hip.y, 3), kneeAlpha: alphaNear(joints.knee.x, joints.knee.y, 3), ankleAlpha: alphaNear(joints.ankle.x, joints.ankle.y, 3), thighPathMisses: pathMisses(alphaNear, joints.hip, joints.knee), shinPathMisses: pathMisses(alphaNear, joints.knee, joints.ankle) } };
}

function drawMappedSleeve(context, image, sourceShoulder, sourceCuff, targetShoulder, targetCuff) {
  const sourceLength = Math.hypot(sourceCuff.x - sourceShoulder.x, sourceCuff.y - sourceShoulder.y);
  const targetLength = Math.hypot(targetCuff.x - targetShoulder.x, targetCuff.y - targetShoulder.y);
  const sourceAlong = { x: (sourceCuff.x - sourceShoulder.x) / sourceLength, y: (sourceCuff.y - sourceShoulder.y) / sourceLength };
  const sourceAcross = { x: -sourceAlong.y, y: sourceAlong.x };
  const targetAlong = { x: (targetCuff.x - targetShoulder.x) / targetLength, y: (targetCuff.y - targetShoulder.y) / targetLength };
  const targetAcross = { x: -targetAlong.y, y: targetAlong.x };
  const alongScale = targetLength / sourceLength;
  const acrossScale = V8_CALIBRATION.sleeves.acrossScale;
  const a = targetAlong.x * alongScale * sourceAlong.x + targetAcross.x * acrossScale * sourceAcross.x;
  const c = targetAlong.x * alongScale * sourceAlong.y + targetAcross.x * acrossScale * sourceAcross.y;
  const b = targetAlong.y * alongScale * sourceAlong.x + targetAcross.y * acrossScale * sourceAcross.x;
  const d = targetAlong.y * alongScale * sourceAlong.y + targetAcross.y * acrossScale * sourceAcross.y;
  const e = targetShoulder.x - a * sourceShoulder.x - c * sourceShoulder.y;
  const f = targetShoulder.y - b * sourceShoulder.x - d * sourceShoulder.y;
  context.save();
  context.setTransform(a, b, c, d, e, f);
  context.drawImage(image, 0, 0);
  context.restore();
  return { a, b, c, d, e, f, alongScale, acrossScale };
}

function drawAttachedHand(context, image, side, cuff, radians) {
  const sourceY = V8_CALIBRATION.hands.sourceSkinY;
  const anchor = V8_CALIBRATION.hands.skinAnchors[side];
  const scale = V8_CALIBRATION.hands.scale;
  context.save();
  context.translate(cuff.x, cuff.y);
  context.rotate(radians);
  context.scale(scale, scale);
  context.drawImage(image, 0, sourceY, image.width, image.height - sourceY, -anchor.x, 0, image.width, image.height - sourceY);
  context.restore();
}

function armKinematics(side, canonicalJoints, bodyBob) {
  const shoulder = { x: V8_SHOULDERS[side].x, y: V8_SHOULDERS[side].y + bodyBob };
  const reference = standingArmReference[side].wrist;
  const referenceShoulder = standingArmReference[side].shoulder;
  const canonicalShoulder = mapJoint(canonicalJoints.shoulder);
  const wrist = mapJoint(canonicalJoints.wrist);
  const cuff = {
    x: V8_CALIBRATION.sleeves.restCuffs[side].x + ((wrist.x - canonicalShoulder.x) - (reference.x - referenceShoulder.x)) * 0.4,
    y: V8_CALIBRATION.sleeves.restCuffs[side].y + bodyBob + (wrist.y - canonicalShoulder.y) - (reference.y - referenceShoulder.y),
  };
  const radians = angle(shoulder, cuff);
  return { shoulder, cuff, handAnchor: { ...cuff }, radians };
}

function drawArmSleeve(context, loaded, side, arm) {
  const key = side === 'left' ? 'Left' : 'Right';
  arm.sleeveTransform = drawMappedSleeve(context, loaded.images[`sleeve${key}`], V8_CALIBRATION.sleeves.shoulderAnchors[side], V8_CALIBRATION.sleeves.cuffAnchors[side], arm.shoulder, arm.cuff);
}

function drawArmHand(context, loaded, side, arm) {
  const key = side === 'left' ? 'Left' : 'Right';
  drawAttachedHand(context, loaded.images[`hand${key}`], side, arm.handAnchor, arm.radians);
}

export function renderGreenV8Leg(loaded, pose, side) {
  const joints = Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact'].map(name => [name, mapJoint(pose.geometry.joints[side][name])]));
  const rendered = drawLeg(loaded, side, joints);
  return { ...rendered, joints };
}

export function renderGreenV8Arm(loaded, pose, side) {
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const metadata = armKinematics(side, pose.geometry.joints[side], pose.bodyBob);
  drawArmSleeve(context, loaded, side, metadata);
  drawArmHand(context, loaded, side, metadata);
  return { canvas, metadata };
}

export function renderGreenV8Hand(loaded, pose, side) {
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const metadata = armKinematics(side, pose.geometry.joints[side], pose.bodyBob);
  drawArmHand(canvas.getContext('2d'), loaded, side, metadata);
  return { canvas, metadata };
}

export function v8Pose(index) {
  const normalizedIndex = ((index % 8) + 8) % 8;
  const geometry = canonicalWalk[String(normalizedIndex + 1).padStart(2, '0')];
  return { index: normalizedIndex, phaseId: geometry.phaseId, geometry, bodyBob: Math.round(mapJoint(geometry.hipCenter).y - V8_HIPS.left.y) };
}

export function v8StandingPose() {
  return { index: 0, phaseId: 'stand', geometry: canonicalStand, bodyBob: 0 };
}

export function renderGreenV8(loaded, pose) {
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const joints = {};
  const legs = {};
  for (const side of ['left', 'right']) joints[side] = Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact'].map(name => [name, mapJoint(pose.geometry.joints[side][name])]));
  for (const layer of pose.geometry.layerPolicy.filter(name => name.endsWith('Leg'))) {
    const side = layer.startsWith('left') ? 'left' : 'right';
    legs[side] = renderGreenV8Leg(loaded, pose, side);
    context.drawImage(legs[side].canvas, 0, 0);
  }
  const arms = Object.fromEntries(['left', 'right'].map(side => [side, armKinematics(side, pose.geometry.joints[side], pose.bodyBob)]));
  for (const side of ['left', 'right']) drawArmSleeve(context, loaded, side, arms[side]);
  const torsoBounds = loaded.torsoBounds;
  const torsoScale = loaded.torsoScale;
  const torsoX = 80 - (torsoBounds.x + torsoBounds.width / 2) * torsoScale;
  const torsoY = GREEN_RIG_V6.torso.topY - torsoBounds.y * torsoScale + pose.bodyBob;
  context.drawImage(loaded.images.torso, torsoX, torsoY, loaded.images.torso.width * torsoScale, loaded.images.torso.height * torsoScale);
  for (const side of ['left', 'right']) drawArmHand(context, loaded, side, arms[side]);
  context.drawImage(loaded.images.head, GREEN_RIG_V6.head.x, GREEN_RIG_V6.head.y + pose.bodyBob);
  return { canvas, metadata: { pose: { index: pose.index, phaseId: pose.phaseId, bodyBob: pose.bodyBob }, joints, continuity: Object.fromEntries(Object.entries(legs).map(([side, leg]) => [side, leg.diagnostics])), arms, head: { x: GREEN_RIG_V6.head.x, y: GREEN_RIG_V6.head.y + pose.bodyBob, scale: 1 }, torso: { x: torsoX, y: torsoY, scale: torsoScale } } };
}
