import { createCanvas } from '@napi-rs/canvas';
import { buildStandingGeometry, buildWalkGeometry } from '../canonical-master/canonical-geometry.mjs';
import { GREEN_RIG_V6, loadGreenRigV6 } from './green-rig-v6.mjs';

export { GREEN_RIG_V6 };

const canonicalWalk = buildWalkGeometry().south;
const canonicalStand = buildStandingGeometry('south');
const hipSpan = canonicalStand.joints.right.hip.x - canonicalStand.joints.left.hip.x;
const verticalSpan = canonicalStand.joints.left.soleContact.y - canonicalStand.joints.left.hip.y;
const scaleX = (GREEN_RIG_V6.hips.right.x - GREEN_RIG_V6.hips.left.x) / hipSpan;
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

export const V7_CALIBRATION = Object.freeze({
  canonicalFrame: { width: 240, height: 310, axisX: 112, floorY: 296 },
  v6Rest: { hips: GREEN_RIG_V6.hips, shoulders: GREEN_RIG_V6.shoulders, floorY: GREEN_RIG_V6.floorY },
  projectionScale: { x: scaleX, y: scaleY },
  sourceBands: {
    thigh: { y: 67, height: 452 },
    shin: { y: 519, height: 421 },
    shoe: { y: 940, height: 201 },
  },
  destinationSeamOverlap: 0.8,
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

export async function loadGreenRigV7(repo) {
  const loaded = await loadGreenRigV6(repo);
  const pixels = imageData(loaded.images.legs);
  const bands = {};
  for (const side of ['left', 'right']) {
    const [sourceX, , sourceWidth] = loaded.legRects[side];
    bands[side] = {};
    for (const [name, band] of Object.entries(V7_CALIBRATION.sourceBands)) {
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
  const overlap = V7_CALIBRATION.destinationSeamOverlap;
  drawAxialBand(context, loaded.images.legs, loaded.bands[side].thigh, joints.hip, extend(joints.hip, joints.knee, overlap), loaded.legScale);
  drawAxialBand(context, loaded.images.legs, loaded.bands[side].shin, retract(joints.knee, joints.ankle, overlap), extend(joints.knee, joints.ankle, overlap), loaded.legScale);
  drawRigidShoe(context, loaded.images.legs, loaded.bands[side].shoe, joints.soleContact, loaded.legScale);
  const alphaNear = alphaSampler(canvas);
  return { canvas, diagnostics: { hipAlpha: alphaNear(joints.hip.x, joints.hip.y, 3), kneeAlpha: alphaNear(joints.knee.x, joints.knee.y, 3), ankleAlpha: alphaNear(joints.ankle.x, joints.ankle.y, 3), thighPathMisses: pathMisses(alphaNear, joints.hip, joints.knee), shinPathMisses: pathMisses(alphaNear, joints.knee, joints.ankle) } };
}

function drawPivot(context, image, pivot, scale, world, radians) {
  context.save();
  context.translate(world.x, world.y);
  context.rotate(radians);
  context.scale(scale, scale);
  context.drawImage(image, -pivot.x, -pivot.y);
  context.restore();
}

function drawArm(context, loaded, side, canonicalJoints, bodyBob) {
  const key = side === 'left' ? 'Left' : 'Right';
  const shoulder = { x: GREEN_RIG_V6.shoulders[side].x, y: GREEN_RIG_V6.shoulders[side].y + bodyBob };
  const reference = standingArmReference[side].wrist;
  const referenceShoulder = standingArmReference[side].shoulder;
  const canonicalShoulder = mapJoint(canonicalJoints.shoulder);
  const wrist = mapJoint(canonicalJoints.wrist);
  const handTarget = {
    x: GREEN_RIG_V6.arms.restHands[side].x + ((wrist.x - canonicalShoulder.x) - (reference.x - referenceShoulder.x)) * 0.4,
    y: GREEN_RIG_V6.arms.restHands[side].y + bodyBob + (wrist.y - canonicalShoulder.y) - (reference.y - referenceShoulder.y),
  };
  const radians = angle(shoulder, handTarget);
  drawPivot(context, loaded.images[`sleeve${key}`], GREEN_RIG_V6.arms.sleevePivot, GREEN_RIG_V6.arms.sleeveScale, shoulder, radians);
  drawPivot(context, loaded.images[`hand${key}`], GREEN_RIG_V6.arms.handPivot, GREEN_RIG_V6.arms.handScale, handTarget, radians);
  return { shoulder, hand: handTarget, radians };
}

export function renderGreenV7Leg(loaded, pose, side) {
  const joints = Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact'].map(name => [name, mapJoint(pose.geometry.joints[side][name])]));
  const rendered = drawLeg(loaded, side, joints);
  return { ...rendered, joints };
}

export function renderGreenV7Arm(loaded, pose, side) {
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const metadata = drawArm(canvas.getContext('2d'), loaded, side, pose.geometry.joints[side], pose.bodyBob);
  return { canvas, metadata };
}

export function v7Pose(index) {
  const normalizedIndex = ((index % 8) + 8) % 8;
  const geometry = canonicalWalk[String(normalizedIndex + 1).padStart(2, '0')];
  return { index: normalizedIndex, phaseId: geometry.phaseId, geometry, bodyBob: Math.round(mapJoint(geometry.hipCenter).y - GREEN_RIG_V6.hips.left.y) };
}

export function renderGreenV7(loaded, pose) {
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const joints = {};
  const legs = {};
  for (const side of ['left', 'right']) joints[side] = Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact'].map(name => [name, mapJoint(pose.geometry.joints[side][name])]));
  for (const layer of pose.geometry.layerPolicy.filter(name => name.endsWith('Leg'))) {
    const side = layer.startsWith('left') ? 'left' : 'right';
    legs[side] = renderGreenV7Leg(loaded, pose, side);
    context.drawImage(legs[side].canvas, 0, 0);
  }
  const arms = Object.fromEntries(['left', 'right'].map(side => [side, drawArm(context, loaded, side, pose.geometry.joints[side], pose.bodyBob)]));
  const torsoBounds = loaded.torsoBounds;
  const torsoScale = loaded.torsoScale;
  const torsoX = 80 - (torsoBounds.x + torsoBounds.width / 2) * torsoScale;
  const torsoY = GREEN_RIG_V6.torso.topY - torsoBounds.y * torsoScale + pose.bodyBob;
  context.drawImage(loaded.images.torso, torsoX, torsoY, loaded.images.torso.width * torsoScale, loaded.images.torso.height * torsoScale);
  context.drawImage(loaded.images.head, GREEN_RIG_V6.head.x, GREEN_RIG_V6.head.y + pose.bodyBob);
  return { canvas, metadata: { pose: { index: pose.index, phaseId: pose.phaseId, bodyBob: pose.bodyBob }, joints, continuity: Object.fromEntries(Object.entries(legs).map(([side, leg]) => [side, leg.diagnostics])), arms, head: { x: GREEN_RIG_V6.head.x, y: GREEN_RIG_V6.head.y + pose.bodyBob, scale: 1 }, torso: { x: torsoX, y: torsoY, scale: torsoScale } } };
}
