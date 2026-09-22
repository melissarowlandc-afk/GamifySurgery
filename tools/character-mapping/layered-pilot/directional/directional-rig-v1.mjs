import { createCanvas, loadImage } from '@napi-rs/canvas';
import { resolve } from 'node:path';
import { buildStandingGeometry, buildWalkGeometry } from '../../canonical-master/canonical-geometry.mjs';

export const DIRECTIONAL_VIEWS = Object.freeze(['east', 'west', 'north']);
export const CANVAS = Object.freeze({ width: 160, height: 320, axisX: 80, floorY: 287 });

const plateRelative = 'tools/character-mapping/layered-pilot/directional/assets/green-directional-parts-corrected-v1-transparent.png';
const headRoot = 'tools/character-mapping/layered-pilot/directional/assets';

const rectangles = {
  east: {
    torso: [216, 68, 136, 235],
    sleeves: { left: [163, 343, 82, 193], right: [323, 343, 82, 192] },
    hands: { left: [177, 576, 64, 78], right: [340, 576, 60, 79] },
    legs: { left: [141, 685, 125, 260], right: [320, 684, 135, 261] },
  },
  west: {
    torso: [684, 69, 139, 234],
    sleeves: { left: [635, 343, 85, 192], right: [793, 342, 82, 193] },
    hands: { left: [640, 576, 60, 79], right: [798, 576, 64, 78] },
    legs: { left: [586, 685, 135, 260], right: [781, 684, 124, 261] },
  },
  north: {
    torso: [1173, 71, 168, 232],
    sleeves: { left: [1116, 342, 86, 192], right: [1306, 342, 86, 192] },
    hands: { left: [1129, 574, 63, 79], right: [1319, 574, 63, 79] },
    legs: { left: [1117, 685, 105, 260], right: [1291, 683, 107, 262] },
  },
};

const headBounds = {
  east: { left: 7, top: 11, right: 80, bottom: 89 },
  west: { left: 6, top: 11, right: 79, bottom: 89 },
  north: { left: 10, top: 10, right: 80, bottom: 89 },
};

export const DIRECTIONAL_CALIBRATION = Object.freeze({
  plate: { path: plateRelative, rectangles },
  target: {
    visibleHeadTop: 39,
    torsoTop: { east: 117, west: 114, north: 109 },
    torsoHem: 207,
    hipY: 204,
    floorY: CANVAS.floorY,
    shoulderY: 134,
    cuffY: 196,
  },
  torsoScale: { east: 90 / 235, west: 93 / 234, north: 98 / 232 },
  legScale: { east: 80 / 260, west: 80 / 260, north: 80 / 260 },
  sleeveScale: { east: 62 / 193, west: 62 / 193, north: 62 / 192 },
  handScale: { east: 0.30, west: 0.30, north: 0.30 },
  // Profile arms retain their full forward reach.  Only the rearward half of
  // their swing is reduced from the canonical projection, so the transition
  // through the resting position remains continuous.
  profileBackwardArmScale: 0.70,
  thumbSourceLandmarks: {
    east: { left: { x: 61, y: 45 }, right: { x: 2, y: 45 } },
    west: { left: { x: 57, y: 45 }, right: { x: 2, y: 45 } },
  },
  shoulderSockets: {
    east: { left: { x: 65, y: 134 }, right: { x: 62, y: 134 } },
    west: { left: { x: 98, y: 131 }, right: { x: 95, y: 131 } },
    north: { left: { x: 50, y: 128 }, right: { x: 110, y: 128 } },
  },
  restingCuffs: {
    east: { left: { x: 66, y: 196 }, right: { x: 62, y: 196 } },
    west: { left: { x: 98, y: 196 }, right: { x: 94, y: 196 } },
    north: { left: { x: 51, y: 196 }, right: { x: 109, y: 196 } },
  },
  headBounds,
  headRegistrationY: { east: 3, west: 3, north: 3 },
  nearSide: { east: 'right', west: 'left' },
  neckBridgePlacement: { east: { x: 53, y: 98 }, west: { x: 32, y: 98 }, north: { x: 33.5, y: 99 } },
});

const canonicalStanding = Object.fromEntries(DIRECTIONAL_VIEWS.map(view => [view, buildStandingGeometry(view)]));
const canonicalWalking = buildWalkGeometry();

export async function loadDirectionalRig(repo) {
  const plate = await loadImage(resolve(repo, plateRelative));
  const heads = {};
  const neckBridges = {};
  for (const view of DIRECTIONAL_VIEWS) {
    heads[view] = await loadImage(resolve(repo, headRoot, `green-head-${view}-source-v1.png`));
    neckBridges[view] = await loadImage(resolve(repo, headRoot, `green-neck-${view}-source-v1.png`));
  }
  const plateCanvas = createCanvas(plate.width, plate.height);
  const plateContext = plateCanvas.getContext('2d'); plateContext.drawImage(plate, 0, 0);
  const plateData = plateContext.getImageData(0, 0, plate.width, plate.height).data;
  const sleeveAnchors = {};
  for (const view of DIRECTIONAL_VIEWS) {
    sleeveAnchors[view] = {};
    for (const side of ['left', 'right']) {
      const [x, y, width, height] = rectangles[view].sleeves[side];
      const centroid = (top, bottom) => {
        let weight = 0; let sumX = 0; let sumY = 0;
        for (let localY = top; localY < bottom; localY += 1) for (let localX = 0; localX < width; localX += 1) {
          const alpha = plateData[((y + localY) * plate.width + x + localX) * 4 + 3];
          if (alpha < 32) continue;
          weight += alpha; sumX += localX * alpha; sumY += localY * alpha;
        }
        return { x: sumX / weight, y: sumY / weight };
      };
      sleeveAnchors[view][side] = { cap: centroid(0, Math.min(4, height)), cuff: centroid(Math.max(0, height - 8), height) };
    }
  }
  return { plate, heads, neckBridges, sleeveAnchors };
}

function drawPart(context, image, rect, centerX, visibleTop, scale, mirrorAcross = false) {
  const [x, y, width, height] = rect;
  const targetX = centerX - width * scale / 2;
  const targetY = visibleTop;
  context.save();
  if (mirrorAcross) { context.translate(centerX, 0); context.scale(-1, 1); context.translate(-centerX, 0); }
  context.drawImage(image, x, y, width, height, targetX, targetY, width * scale, height * scale);
  context.restore();
  return { x: targetX, y: targetY, width: width * scale, height: height * scale, scale, sourceRect: rect, mirrorAcross };
}

function axialAngle(start, end) {
  return Math.atan2(end.y - start.y, end.x - start.x) - Math.PI / 2;
}

function extend(start, end, amount) {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  return { x: end.x + (end.x - start.x) / length * amount, y: end.y + (end.y - start.y) / length * amount };
}

function retract(start, end, amount) {
  return extend(end, start, amount);
}

function drawAxialPart(context, image, rect, start, end, acrossScale, clipRadius = null, mirrorAcross = false) {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = rect;
  const targetLength = Math.hypot(end.x - start.x, end.y - start.y);
  const targetContext = clipRadius ? createCanvas(CANVAS.width, CANVAS.height).getContext('2d') : context;
  targetContext.save();
  targetContext.translate(start.x, start.y);
  targetContext.rotate(axialAngle(start, end));
  targetContext.scale(acrossScale, targetLength / sourceHeight);
  if (mirrorAcross) targetContext.scale(-1, 1);
  targetContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, -sourceWidth / 2, 0, sourceWidth, sourceHeight);
  targetContext.restore();
  if (clipRadius) {
    targetContext.globalCompositeOperation = 'destination-in';
    targetContext.strokeStyle = '#fff';
    targetContext.lineWidth = clipRadius * 2;
    targetContext.lineCap = 'round';
    targetContext.beginPath(); targetContext.moveTo(start.x, start.y); targetContext.lineTo(end.x, end.y); targetContext.stroke();
    targetContext.globalCompositeOperation = 'source-over';
    context.drawImage(targetContext.canvas, 0, 0);
  }
  return { sourceRect: rect, start, end, acrossScale, alongScale: targetLength / sourceHeight, mirrorAcross };
}

function transformPoint(matrix, point) {
  return { x: matrix.a * point.x + matrix.c * point.y + matrix.e, y: matrix.b * point.x + matrix.d * point.y + matrix.f };
}

function drawMappedSleeve(context, image, rect, anchors, shoulder, cuff, acrossScale, mirrorAcross = false) {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = rect;
  const sourceDx = anchors.cuff.x - anchors.cap.x;
  const sourceDy = anchors.cuff.y - anchors.cap.y;
  const sourceLength = Math.hypot(sourceDx, sourceDy);
  const targetDx = cuff.x - shoulder.x;
  const targetDy = cuff.y - shoulder.y;
  const targetLength = Math.hypot(targetDx, targetDy);
  if (sourceLength < 1 || targetLength < 1) throw new Error('sleeve anchors must define a nonzero axis');
  const sourceAlong = { x: sourceDx / sourceLength, y: sourceDy / sourceLength };
  const sourceAcross = { x: -sourceAlong.y, y: sourceAlong.x };
  const targetAlong = { x: targetDx / targetLength, y: targetDy / targetLength };
  const targetAcross = { x: -targetAlong.y, y: targetAlong.x };
  const alongScale = targetLength / sourceLength;
  const sign = mirrorAcross ? -1 : 1;
  const matrix = {
    a: targetAlong.x * alongScale * sourceAlong.x + targetAcross.x * acrossScale * sign * sourceAcross.x,
    b: targetAlong.y * alongScale * sourceAlong.x + targetAcross.y * acrossScale * sign * sourceAcross.x,
    c: targetAlong.x * alongScale * sourceAlong.y + targetAcross.x * acrossScale * sign * sourceAcross.y,
    d: targetAlong.y * alongScale * sourceAlong.y + targetAcross.y * acrossScale * sign * sourceAcross.y,
    e: 0, f: 0,
  };
  matrix.e = shoulder.x - matrix.a * anchors.cap.x - matrix.c * anchors.cap.y;
  matrix.f = shoulder.y - matrix.b * anchors.cap.x - matrix.d * anchors.cap.y;
  context.save(); context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight); context.restore();
  return { sourceRect: rect, sourceAnchors: anchors, shoulder, cuff, matrix, mappedCap: transformPoint(matrix, anchors.cap), mappedCuff: transformPoint(matrix, anchors.cuff), acrossScale, alongScale, mirrorAcross };
}

function drawRigidShoe(context, image, rect, soleContact, scale) {
  const [sourceX, sourceY, sourceWidth, sourceHeight] = rect;
  const x = soleContact.x - sourceWidth * scale / 2;
  const y = soleContact.y - sourceHeight * scale + 0.5;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, sourceWidth * scale, sourceHeight * scale);
  return { sourceRect: rect, x, y, width: sourceWidth * scale, height: sourceHeight * scale, scale };
}

function drawTexturedTriangle(context, image, source, target) {
  const [s0, s1, s2] = source;
  const [t0, t1, t2] = target;
  const denominator = s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  const coefficient = (p0, p1, p2) => ({
    x: (p0 * (s1.y - s2.y) + p1 * (s2.y - s0.y) + p2 * (s0.y - s1.y)) / denominator,
    y: (p0 * (s2.x - s1.x) + p1 * (s0.x - s2.x) + p2 * (s1.x - s0.x)) / denominator,
    offset: (p0 * (s1.x * s2.y - s2.x * s1.y) + p1 * (s2.x * s0.y - s0.x * s2.y) + p2 * (s0.x * s1.y - s1.x * s0.y)) / denominator,
  });
  const horizontal = coefficient(t0.x, t1.x, t2.x);
  const vertical = coefficient(t0.y, t1.y, t2.y);
  context.save();
  context.beginPath(); context.moveTo(t0.x, t0.y); context.lineTo(t1.x, t1.y); context.lineTo(t2.x, t2.y); context.closePath(); context.clip();
  context.setTransform(horizontal.x, vertical.x, horizontal.y, vertical.y, horizontal.offset, vertical.offset);
  context.drawImage(image, 0, 0);
  context.restore();
}

function drawTexturedQuad(context, image, sourceRect, targetQuad) {
  const [x, y, width, height] = sourceRect;
  const sourceQuad = [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }];
  drawTexturedTriangle(context, image, [sourceQuad[0], sourceQuad[1], sourceQuad[2]], [targetQuad[0], targetQuad[1], targetQuad[2]]);
  drawTexturedTriangle(context, image, [sourceQuad[0], sourceQuad[2], sourceQuad[3]], [targetQuad[0], targetQuad[2], targetQuad[3]]);
  return { sourceRect, targetQuad };
}

function drawAffineStrip(context, image, sourceRect, targetQuad) {
  const [x, y, width, height] = sourceRect;
  const source = [{ x, y }, { x: x + width, y }, { x, y: y + height }];
  const target = [targetQuad[0], targetQuad[1], targetQuad[3]];
  const [s0, s1, s2] = source; const [t0, t1, t2] = target;
  const denominator = s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  const coefficient = (p0, p1, p2) => ({
    x: (p0 * (s1.y - s2.y) + p1 * (s2.y - s0.y) + p2 * (s0.y - s1.y)) / denominator,
    y: (p0 * (s2.x - s1.x) + p1 * (s0.x - s2.x) + p2 * (s1.x - s0.x)) / denominator,
    offset: (p0 * (s1.x * s2.y - s2.x * s1.y) + p1 * (s2.x * s0.y - s0.x * s2.y) + p2 * (s0.x * s1.y - s1.x * s0.y)) / denominator,
  });
  const horizontal = coefficient(t0.x, t1.x, t2.x); const vertical = coefficient(t0.y, t1.y, t2.y);
  context.save();
  context.beginPath(); context.moveTo(targetQuad[0].x, targetQuad[0].y); for (let index = 1; index < 4; index += 1) context.lineTo(targetQuad[index].x, targetQuad[index].y); context.closePath(); context.clip();
  context.setTransform(horizontal.x, vertical.x, horizontal.y, vertical.y, horizontal.offset, vertical.offset); context.drawImage(image, 0, 0); context.restore();
}

function drawTexturedStripMesh(context, image, sourceRect, topSection, bottomSection) {
  const [x, y, width, height] = sourceRect;
  const strips = 4;
  const lerp = (first, second, amount) => ({ x: first.x + (second.x - first.x) * amount, y: first.y + (second.y - first.y) * amount });
  for (let strip = 0; strip < strips; strip += 1) {
    const top = Math.max(0, strip / strips - 0.012);
    const bottom = Math.min(1, (strip + 1) / strips + 0.012);
    const sourceTop = y + height * top;
    const sourceBottom = y + height * bottom;
    const targetTop = [lerp(topSection[0], bottomSection[0], top), lerp(topSection[1], bottomSection[1], top)];
    const targetBottom = [lerp(topSection[0], bottomSection[0], bottom), lerp(topSection[1], bottomSection[1], bottom)];
    drawAffineStrip(context, image, [x, sourceTop, width, sourceBottom - sourceTop], [targetTop[0], targetTop[1], targetBottom[1], targetBottom[0]]);
  }
  return { sourceRect, topSection, bottomSection, strips };
}

function perpendicular(start, end) {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  return { x: -(end.y - start.y) / length, y: (end.x - start.x) / length };
}

function section(center, normal, halfWidth) {
  return [{ x: center.x + normal.x * halfWidth, y: center.y + normal.y * halfWidth }, { x: center.x - normal.x * halfWidth, y: center.y - normal.y * halfWidth }];
}

function legBands(rect) {
  const [x, y, width, height] = rect;
  const thighHeight = 110;
  const shinHeight = 95;
  return {
    thigh: [x, y, width, thighHeight],
    shin: [x, y + thighHeight, width, shinHeight],
    shoe: [x, y + thighHeight + shinHeight, width, height - thighHeight - shinHeight],
  };
}

function mapJoint(view, point) {
  const xScale = view === 'north' ? 32 / 26 : 1;
  const yScale = (CANVAS.floorY - DIRECTIONAL_CALIBRATION.target.hipY) / 96;
  return { x: CANVAS.axisX + (point.x - 112) * xScale, y: CANVAS.floorY - (296 - point.y) * yScale };
}

function mapArmJoint(view, point, role, bodyBob) {
  const xScale = view === 'north' ? 58 / 68 : 1;
  const referenceY = role === 'shoulder' ? 122 : 197;
  const targetY = role === 'shoulder' ? DIRECTIONAL_CALIBRATION.target.shoulderY : DIRECTIONAL_CALIBRATION.target.cuffY;
  return { x: CANVAS.axisX + (point.x - 112) * xScale, y: targetY + (point.y - referenceY) * 0.84 + bodyBob };
}

function drawWalkingLeg(context, loaded, view, side, joints) {
  const bands = legBands(rectangles[view].legs[side]);
  const scale = DIRECTIONAL_CALIBRATION.legScale[view];
  const thighNormal = perpendicular(joints.hip, joints.knee);
  const shinNormal = perpendicular(joints.knee, joints.ankle);
  const summed = { x: thighNormal.x + shinNormal.x, y: thighNormal.y + shinNormal.y };
  const summedLength = Math.hypot(summed.x, summed.y);
  const kneeNormal = summedLength > 1e-6 ? { x: summed.x / summedLength, y: summed.y / summedLength } : thighNormal;
  const halfWidth = rectangles[view].legs[side][2] * scale / 2;
  const kneeHalfWidth = halfWidth;
  const hipSection = section(joints.hip, thighNormal, halfWidth);
  const kneeSection = section(joints.knee, kneeNormal, kneeHalfWidth);
  const ankleSection = section(joints.ankle, shinNormal, halfWidth);
  const trouserCanvas = createCanvas(CANVAS.width, CANVAS.height);
  const trouserContext = trouserCanvas.getContext('2d');
  const thigh = drawTexturedStripMesh(trouserContext, loaded.plate, bands.thigh, hipSection, kneeSection);
  const shin = drawTexturedStripMesh(trouserContext, loaded.plate, bands.shin, kneeSection, ankleSection);
  trouserContext.globalCompositeOperation = 'destination-in';
  trouserContext.strokeStyle = '#fff'; trouserContext.lineWidth = halfWidth * 2;
  trouserContext.lineCap = 'round'; trouserContext.lineJoin = 'round';
  trouserContext.beginPath(); trouserContext.moveTo(joints.hip.x, joints.hip.y); trouserContext.lineTo(joints.knee.x, joints.knee.y); trouserContext.lineTo(joints.ankle.x, joints.ankle.y); trouserContext.stroke();
  trouserContext.globalCompositeOperation = 'source-over';
  context.drawImage(trouserCanvas, 0, 0);
  const shoe = drawRigidShoe(context, loaded.plate, bands.shoe, joints.soleContact, scale);
  return { joints, bands, transforms: { thigh, shin, shoe } };
}

function armTargets(view, side, geometry, bodyBob) {
  const standing = canonicalStanding[view].joints[side];
  const current = geometry.joints[side];
  const standingVector = { x: standing.wrist.x - standing.shoulder.x, y: standing.wrist.y - standing.shoulder.y };
  const currentVector = { x: current.wrist.x - current.shoulder.x, y: current.wrist.y - current.shoulder.y };
  const swing = { x: currentVector.x - standingVector.x, y: currentVector.y - standingVector.y };
  if (view === 'east' || view === 'west') {
    const facing = view === 'east' ? 1 : -1;
    // Screen-space motion opposite the walking direction is the rearward
    // portion of the profile swing.  Scale that portion only; zero remains
    // fixed, which preserves a smooth phase-to-phase handoff at rest.
    if (swing.x * facing < 0) swing.x *= DIRECTIONAL_CALIBRATION.profileBackwardArmScale;
  }
  return {
    shoulder: { x: DIRECTIONAL_CALIBRATION.shoulderSockets[view][side].x, y: DIRECTIONAL_CALIBRATION.shoulderSockets[view][side].y + bodyBob },
    cuff: {
      x: DIRECTIONAL_CALIBRATION.restingCuffs[view][side].x + swing.x * (view === 'north' ? 0.85 : 1),
      y: DIRECTIONAL_CALIBRATION.restingCuffs[view][side].y + swing.y * 0.84 + bodyBob,
    },
  };
}

function drawWalkingArm(context, loaded, view, side, geometry, bodyBob) {
  const donor = armDonor(view, side);
  const { shoulder, cuff } = armTargets(view, side, geometry, bodyBob);
  const sleeve = drawMappedSleeve(context, loaded.plate, rectangles[view].sleeves[donor.side], loaded.sleeveAnchors[view][donor.side], shoulder, cuff, DIRECTIONAL_CALIBRATION.sleeveScale[view], donor.mirrorAcross);
  const handRect = rectangles[view].hands[donor.side];
  const handScale = DIRECTIONAL_CALIBRATION.handScale[view];
  const radians = axialAngle(shoulder, cuff);
  context.save();
  context.translate(cuff.x, cuff.y);
  context.rotate(radians);
  if (donor.mirrorAcross) context.scale(-1, 1);
  context.drawImage(loaded.plate, ...handRect, -handRect[2] * handScale / 2, -1, handRect[2] * handScale, handRect[3] * handScale);
  context.restore();
  let thumbLandmark = null;
  let thumbReference = null;
  if (view !== 'north') {
    const sourceThumb = DIRECTIONAL_CALIBRATION.thumbSourceLandmarks[view][donor.side];
    const localX = (sourceThumb.x - handRect[2] / 2) * handScale * (donor.mirrorAcross ? -1 : 1);
    const localY = -1 + sourceThumb.y * handScale;
    thumbLandmark = { x: cuff.x + Math.cos(radians) * localX - Math.sin(radians) * localY, y: cuff.y + Math.sin(radians) * localX + Math.cos(radians) * localY };
    thumbReference = { x: cuff.x - Math.sin(radians) * localY, y: cuff.y + Math.cos(radians) * localY };
  }
  return { shoulder, cuff, handAnchor: { ...cuff }, thumbLandmark, thumbReference, donor, sleeve, hand: { sourceRect: handRect, scale: handScale, radians, mirrorAcross: donor.mirrorAcross } };
}

function drawHead(context, loaded, view, bodyBob = 0) {
  const image = loaded.heads[view];
  const bounds = headBounds[view];
  const visibleWidth = bounds.right - bounds.left + 1;
  const imageX = CANVAS.axisX - visibleWidth / 2 - bounds.left;
  const imageY = DIRECTIONAL_CALIBRATION.target.visibleHeadTop - bounds.top + DIRECTIONAL_CALIBRATION.headRegistrationY[view] + bodyBob;
  context.drawImage(image, imageX, imageY);
  return { x: imageX, y: imageY, scale: 1, sourceBounds: bounds };
}

function drawNeckBridge(context, loaded, view, bodyBob = 0) {
  const placement = DIRECTIONAL_CALIBRATION.neckBridgePlacement[view];
  const y = placement.y + DIRECTIONAL_CALIBRATION.headRegistrationY[view] + bodyBob;
  context.drawImage(loaded.neckBridges[view], placement.x, y);
  return { x: placement.x, y, scale: 1 };
}

function armDonor(view, anatomicalSide) {
  if (view === 'north') return { side: anatomicalSide, mirrorAcross: false };
  const near = DIRECTIONAL_CALIBRATION.nearSide[view];
  return { side: anatomicalSide === 'left' ? 'right' : 'left', mirrorAcross: anatomicalSide !== near };
}

function sideCenters(view) {
  const facing = view === 'east' ? 1 : -1;
  return {
    legs: { left: CANVAS.axisX - facing * 3, right: CANVAS.axisX + facing * 3 },
    sleeves: { left: CANVAS.axisX - facing * 8, right: CANVAS.axisX + facing * 8 },
  };
}

function northCenters() {
  return { legs: { left: 64, right: 96 }, sleeves: { left: 51, right: 109 } };
}

function staticParts(view) {
  const centers = view === 'north' ? northCenters() : sideCenters(view);
  return { centers, rects: rectangles[view] };
}

function drawStaticLeg(context, loaded, view, side, centerX, bodyBob) {
  return drawPart(context, loaded.plate, rectangles[view].legs[side], centerX, DIRECTIONAL_CALIBRATION.target.torsoHem + bodyBob, DIRECTIONAL_CALIBRATION.legScale[view]);
}

function drawStaticArm(context, loaded, view, side, bodyBob, handOnly = false) {
  const donor = armDonor(view, side);
  const { shoulder, cuff } = armTargets(view, side, canonicalStanding[view], bodyBob);
  const sleeve = handOnly ? null : drawMappedSleeve(context, loaded.plate, rectangles[view].sleeves[donor.side], loaded.sleeveAnchors[view][donor.side], shoulder, cuff, DIRECTIONAL_CALIBRATION.sleeveScale[view], donor.mirrorAcross);
  const handRect = rectangles[view].hands[donor.side];
  const handScale = DIRECTIONAL_CALIBRATION.handScale[view];
  const radians = axialAngle(shoulder, cuff);
  context.save(); context.translate(cuff.x, cuff.y); context.rotate(radians);
  if (donor.mirrorAcross) context.scale(-1, 1);
  context.drawImage(loaded.plate, ...handRect, -handRect[2] * handScale / 2, -1, handRect[2] * handScale, handRect[3] * handScale); context.restore();
  const hand = { sourceRect: handRect, scale: handScale, radians, mirrorAcross: donor.mirrorAcross };
  let thumbLandmark = null; let thumbReference = null;
  if (view !== 'north') {
    const landmark = DIRECTIONAL_CALIBRATION.thumbSourceLandmarks[view][donor.side];
    const localX = (landmark.x - handRect[2] / 2) * handScale * (donor.mirrorAcross ? -1 : 1);
    const localY = -1 + landmark.y * handScale;
    thumbLandmark = { x: cuff.x + Math.cos(radians) * localX - Math.sin(radians) * localY, y: cuff.y + Math.sin(radians) * localX + Math.cos(radians) * localY };
    thumbReference = { x: cuff.x - Math.sin(radians) * localY, y: cuff.y + Math.cos(radians) * localY };
  }
  return { shoulder, cuff, handAnchor: { ...cuff }, sleeve, hand, donor, thumbLandmark, thumbReference };
}

export function directionalStandingPose(view) {
  if (!DIRECTIONAL_VIEWS.includes(view)) throw new Error(`unsupported view ${view}`);
  return { view, phaseId: 'stand', geometry: canonicalStanding[view], bodyBob: 0 };
}

export function directionalWalkPose(view, index) {
  if (!DIRECTIONAL_VIEWS.includes(view)) throw new Error(`unsupported view ${view}`);
  const normalized = ((index % 8) + 8) % 8;
  const geometry = canonicalWalking[view][String(normalized + 1).padStart(2, '0')];
  return { view, index: normalized, phaseId: geometry.phaseId, geometry };
}

export function renderDirectionalStanding(loaded, view) {
  const canvas = createCanvas(CANVAS.width, CANVAS.height);
  const context = canvas.getContext('2d');
  const { centers, rects } = staticParts(view);
  const parts = { legs: {}, arms: {} };
  if (view === 'north') {
    for (const side of ['left', 'right']) parts.legs[side] = drawStaticLeg(context, loaded, view, side, centers.legs[side], 0);
    for (const side of ['left', 'right']) parts.arms[side] = drawStaticArm(context, loaded, view, side, 0, false);
  } else {
    const near = DIRECTIONAL_CALIBRATION.nearSide[view];
    const far = near === 'left' ? 'right' : 'left';
    parts.legs[far] = drawStaticLeg(context, loaded, view, far, centers.legs[far], 0);
    parts.arms[far] = drawStaticArm(context, loaded, view, far, 0, false);
    parts.legs[near] = drawStaticLeg(context, loaded, view, near, centers.legs[near], 0);
  }
  const torsoScale = DIRECTIONAL_CALIBRATION.torsoScale[view];
  const torso = drawPart(context, loaded.plate, rects.torso, CANVAS.axisX, DIRECTIONAL_CALIBRATION.target.torsoTop[view], torsoScale);
  const neckBridge = drawNeckBridge(context, loaded, view, 0);
  if (view === 'north') {
    // Hands are visible beside the back torso while sleeves remain behind it.
    for (const side of ['left', 'right']) drawStaticArm(context, loaded, view, side, 0, true);
  } else {
    const near = DIRECTIONAL_CALIBRATION.nearSide[view];
    parts.arms[near] = drawStaticArm(context, loaded, view, near, 0, false);
  }
  const head = drawHead(context, loaded, view, 0);
  return { canvas, metadata: { view, pose: 'stand', geometry: canonicalStanding[view], torso, neckBridge, head, parts } };
}

export function renderDirectionalWalk(loaded, pose) {
  const { view, geometry } = pose;
  const canvas = createCanvas(CANVAS.width, CANVAS.height);
  const context = canvas.getContext('2d');
  const mappedHip = mapJoint(view, geometry.hipCenter);
  const bodyBob = Math.round(mappedHip.y - DIRECTIONAL_CALIBRATION.target.hipY);
  const joints = {};
  for (const side of ['left', 'right']) {
    joints[side] = Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact'].map(name => [name, mapJoint(view, geometry.joints[side][name])]));
  }
  const legs = {};
  const arms = {};
  const drawLeg = side => { legs[side] = drawWalkingLeg(context, loaded, view, side, joints[side]); };
  const drawArm = side => { arms[side] = drawWalkingArm(context, loaded, view, side, geometry, bodyBob); };
  let near;
  let far;
  if (view === 'north') {
    drawLeg('left'); drawLeg('right');
    drawArm('left'); drawArm('right');
  } else {
    near = DIRECTIONAL_CALIBRATION.nearSide[view];
    far = near === 'left' ? 'right' : 'left';
    drawLeg(far); drawArm(far); drawLeg(near);
  }
  const torso = drawPart(context, loaded.plate, rectangles[view].torso, CANVAS.axisX, DIRECTIONAL_CALIBRATION.target.torsoTop[view] + bodyBob, DIRECTIONAL_CALIBRATION.torsoScale[view]);
  const neckBridge = drawNeckBridge(context, loaded, view, bodyBob);
  if (view === 'north') {
    // Redraw only the hands above the torso; sleeves remain correctly behind the back.
    for (const side of ['left', 'right']) {
      const arm = arms[side];
      const rect = rectangles[view].hands[side];
      const scale = DIRECTIONAL_CALIBRATION.handScale[view];
      context.save(); context.translate(arm.cuff.x, arm.cuff.y); context.rotate(arm.hand.radians);
      context.drawImage(loaded.plate, ...rect, -rect[2] * scale / 2, -1, rect[2] * scale, rect[3] * scale); context.restore();
    }
  } else drawArm(near);
  const head = drawHead(context, loaded, view, bodyBob);
  return { canvas, metadata: { view, pose: pose.phaseId, phaseId: pose.phaseId, bodyBob, canonicalGeometry: geometry, joints, arms, legs, torso, neckBridge, head } };
}

export function renderDirectionalDiagnosticLayers(loaded, pose) {
  const { view, geometry } = pose;
  const mappedHip = mapJoint(view, geometry.hipCenter);
  const bodyBob = Math.round(mappedHip.y - DIRECTIONAL_CALIBRATION.target.hipY);
  const joints = {};
  for (const side of ['left', 'right']) {
    joints[side] = Object.fromEntries(['hip', 'knee', 'ankle', 'soleContact'].map(name => [name, mapJoint(view, geometry.joints[side][name])]));
  }
  const legs = {};
  const arms = {};
  for (const side of ['left', 'right']) {
    const legCanvas = createCanvas(CANVAS.width, CANVAS.height);
    const leg = drawWalkingLeg(legCanvas.getContext('2d'), loaded, view, side, joints[side]);
    legs[side] = { canvas: legCanvas, ...leg };
    const armCanvas = createCanvas(CANVAS.width, CANVAS.height);
    const arm = drawWalkingArm(armCanvas.getContext('2d'), loaded, view, side, geometry, bodyBob);
    arms[side] = { canvas: armCanvas, ...arm };
  }
  const torso = createCanvas(CANVAS.width, CANVAS.height);
  const torsoMetadata = drawPart(torso.getContext('2d'), loaded.plate, rectangles[view].torso, CANVAS.axisX, DIRECTIONAL_CALIBRATION.target.torsoTop[view] + bodyBob, DIRECTIONAL_CALIBRATION.torsoScale[view]);
  const neckBridge = createCanvas(CANVAS.width, CANVAS.height);
  const neckBridgeMetadata = drawNeckBridge(neckBridge.getContext('2d'), loaded, view, bodyBob);
  const head = createCanvas(CANVAS.width, CANVAS.height);
  const headMetadata = drawHead(head.getContext('2d'), loaded, view, bodyBob);
  return { bodyBob, joints, legs, arms, torso: { canvas: torso, ...torsoMetadata }, neckBridge: { canvas: neckBridge, ...neckBridgeMetadata }, head: { canvas: head, ...headMetadata } };
}
