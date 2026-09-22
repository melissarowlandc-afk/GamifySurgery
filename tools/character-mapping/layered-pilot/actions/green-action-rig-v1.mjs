import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { buildJumpGeometry } from '../../canonical-actions/action-geometry.mjs';
import {
  CANVAS as DIRECTIONAL_CANVAS,
  DIRECTIONAL_CALIBRATION,
  loadDirectionalRig,
} from '../directional/directional-rig-v1.mjs';
import {
  GREEN_RIG_V6,
  V8_CALIBRATION,
  loadGreenRigV8,
  renderGreenV8,
  renderGreenV8Leg,
  v8StandingPose,
} from '../green-rig-v8.mjs';

const jumpSouth = buildJumpGeometry().south;
const phaseIds = Object.freeze(Object.keys(jumpSouth));
const armProjection = Object.freeze({ x: -0.55, y: 0.84 });

export const GREEN_ACTION_RIG_V1 = Object.freeze({
  id: 'patient.adult.046.actions.v1',
  view: 'south',
  action: 'starJump',
  phaseIds,
  durationMs: 180,
  canvas: GREEN_RIG_V6.canvas,
  floorY: GREEN_RIG_V6.floorY,
  armProjection,
  sourceActionFrame: { width: 280, height: 350, axisX: 140, floorY: 330 },
  sitting: {
    views: ['south', 'east', 'west', 'north'],
    bodyDrop: 16,
    waistY: 205,
    seatY: 236,
    lowerBodyScale: { south: 0.37, east: 0.38, west: 0.38, north: 0.38 },
    armScale: { south: 0.395, east: 0.40, west: 0.40, north: 0.38 },
    handTargets: {
      south: { left: { x: 64, y: 217 }, right: { x: 96, y: 217 } },
      east: { left: { x: 96, y: 216 }, right: { x: 94, y: 214 } },
      west: { left: { x: 64, y: 216 }, right: { x: 66, y: 214 } },
      north: { left: { x: 63, y: 216 }, right: { x: 97, y: 216 } },
    },
  },
  clipboard: {
    view: 'south',
    armScale: { left: 0.14, right: 0.12 },
    board: { x: 55, y: 145, width: 41, height: 40 },
    shoulders: { left: { x: 50, y: 130 }, right: { x: 110, y: 130 } },
    handTargets: { left: { x: 71, y: 184 }, right: { x: 95, y: 174 } },
  },
});

const actionAssetRoot = 'tools/character-mapping/layered-pilot/actions/assets';

function imagePixels(image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height).data;
}

function topAnchor(data, imageWidth, bounds) {
  const bandBottom = bounds.y + Math.max(8, Math.round(bounds.height * 0.10));
  let weight = 0;
  let sumX = 0;
  let sumY = 0;
  for (let y = bounds.y; y < bandBottom; y += 1) for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
    const alpha = data[(y * imageWidth + x) * 4 + 3];
    if (alpha < 32) continue;
    weight += alpha;
    sumX += x * alpha;
    sumY += y * alpha;
  }
  if (!weight) throw new Error('action arm has no shoulder-cap pixels');
  return { x: sumX / weight, y: sumY / weight };
}

function bottomAnchor(data, imageWidth, bounds) {
  const bandTop = bounds.y + bounds.height - Math.max(18, Math.round(bounds.height * 0.18));
  let weight = 0;
  let sumX = 0;
  let sumY = 0;
  for (let y = bandTop; y < bounds.y + bounds.height; y += 1) for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
    const alpha = data[(y * imageWidth + x) * 4 + 3];
    if (alpha < 32) continue;
    weight += alpha;
    sumX += x * alpha;
    sumY += y * alpha;
  }
  if (!weight) throw new Error('action arm has no hand pixels');
  return { x: sumX / weight, y: sumY / weight };
}

export async function loadGreenActionRigV1(repo) {
  const [south, directional] = await Promise.all([loadGreenRigV8(repo), loadDirectionalRig(repo)]);
  const provenanceFile = `${actionAssetRoot}/action-assets-v1-provenance.json`;
  const provenance = JSON.parse(readFileSync(resolve(repo, provenanceFile), 'utf8'));
  const seatedFile = `${actionAssetRoot}/${provenance.seated.output.file}`;
  const clipboardFile = `${actionAssetRoot}/${provenance.clipboard.output.file}`;
  const [seated, clipboard] = await Promise.all([
    loadImage(resolve(repo, seatedFile)),
    loadImage(resolve(repo, clipboardFile)),
  ]);
  const seatedPixels = imagePixels(seated);
  const clipboardPixels = imagePixels(clipboard);
  const seatedAnchors = {};
  for (const view of GREEN_ACTION_RIG_V1.sitting.views) {
    seatedAnchors[view] = {};
    for (const side of ['left', 'right']) {
      const bounds = provenance.seated.cells[`${view}.${side}Arm`].bounds;
      seatedAnchors[view][side] = {
        shoulder: topAnchor(seatedPixels, seated.width, bounds),
        hand: bottomAnchor(seatedPixels, seated.width, bounds),
      };
    }
  }
  const clipboardAnchors = Object.fromEntries(['left', 'right'].map(side => {
    const bounds = provenance.clipboard.cells[`${side}Arm`].bounds;
    return [side, {
      shoulder: topAnchor(clipboardPixels, clipboard.width, bounds),
      hand: bottomAnchor(clipboardPixels, clipboard.width, bounds),
    }];
  }));
  return {
    ...south,
    directional,
    actionAssets: { seated, clipboard, provenance, seatedAnchors, clipboardAnchors },
    files: {
      ...south.files,
      seatedParts: seatedFile,
      clipboardArms: clipboardFile,
      actionAssetProvenance: provenanceFile,
    },
  };
}

function axialAngle(start, end) {
  return Math.atan2(end.y - start.y, end.x - start.x) - Math.PI / 2;
}

function mapActionPoint(point) {
  return {
    x: 80 + (point.x - GREEN_ACTION_RIG_V1.sourceActionFrame.axisX) * V8_CALIBRATION.projectionScale.x,
    y: GREEN_RIG_V6.floorY
      - (GREEN_ACTION_RIG_V1.sourceActionFrame.floorY - point.y) * V8_CALIBRATION.projectionScale.y,
  };
}

function toV8Point(point) {
  return {
    x: V8_CALIBRATION.canonicalFrame.axisX
      + point.x - GREEN_ACTION_RIG_V1.sourceActionFrame.axisX,
    y: V8_CALIBRATION.canonicalFrame.floorY
      - (GREEN_ACTION_RIG_V1.sourceActionFrame.floorY - point.y),
  };
}

function actionLegGeometry(geometry) {
  return {
    joints: Object.fromEntries(['left', 'right'].map(side => {
      const joints = geometry.joints[side];
      const soleY = (joints.heel.y + joints.toe.y) / 2;
      return [side, {
        hip: toV8Point(joints.hip),
        knee: toV8Point(joints.knee),
        ankle: toV8Point(joints.ankle),
        soleContact: toV8Point({ x: joints.ankle.x, y: soleY }),
      }];
    })),
    layerPolicy: ['leftLeg', 'rightLeg'],
  };
}

function transformForAxis(sourceStart, sourceEnd, targetStart, targetEnd, acrossScale) {
  const sourceLength = Math.hypot(sourceEnd.x - sourceStart.x, sourceEnd.y - sourceStart.y);
  const targetLength = Math.hypot(targetEnd.x - targetStart.x, targetEnd.y - targetStart.y);
  const sourceAlong = {
    x: (sourceEnd.x - sourceStart.x) / sourceLength,
    y: (sourceEnd.y - sourceStart.y) / sourceLength,
  };
  const sourceAcross = { x: -sourceAlong.y, y: sourceAlong.x };
  const targetAlong = {
    x: (targetEnd.x - targetStart.x) / targetLength,
    y: (targetEnd.y - targetStart.y) / targetLength,
  };
  const targetAcross = { x: -targetAlong.y, y: targetAlong.x };
  const alongScale = targetLength / sourceLength;
  const a = targetAlong.x * alongScale * sourceAlong.x
    + targetAcross.x * acrossScale * sourceAcross.x;
  const c = targetAlong.x * alongScale * sourceAlong.y
    + targetAcross.x * acrossScale * sourceAcross.y;
  const b = targetAlong.y * alongScale * sourceAlong.x
    + targetAcross.y * acrossScale * sourceAcross.x;
  const d = targetAlong.y * alongScale * sourceAlong.y
    + targetAcross.y * acrossScale * sourceAcross.y;
  return {
    a, b, c, d,
    e: targetStart.x - a * sourceStart.x - c * sourceStart.y,
    f: targetStart.y - b * sourceStart.x - d * sourceStart.y,
    alongScale,
    acrossScale,
  };
}

function transformPoint(matrix, point) {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f,
  };
}

function drawIntactSleeve(context, image, sourceStart, sourceEnd, targetStart, targetEnd) {
  const transform = transformForAxis(
    sourceStart,
    sourceEnd,
    targetStart,
    targetEnd,
    V8_CALIBRATION.sleeves.acrossScale,
  );
  context.save();
  context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
  context.drawImage(image, 0, 0);
  context.restore();
  return transform;
}

function drawAttachedHand(context, image, side, wrist, radians) {
  const sourceY = V8_CALIBRATION.hands.sourceSkinY;
  const anchor = V8_CALIBRATION.hands.skinAnchors[side];
  const scale = V8_CALIBRATION.hands.scale;
  context.save();
  context.translate(wrist.x, wrist.y);
  context.rotate(radians);
  context.scale(scale, scale);
  context.drawImage(image, 0, sourceY, image.width, image.height - sourceY,
    -anchor.x, 0, image.width, image.height - sourceY);
  context.restore();
}

function mapArm(side, joints, bodyBob) {
  const shoulder = {
    x: V8_CALIBRATION.correctedRest.shoulders[side].x,
    y: V8_CALIBRATION.correctedRest.shoulders[side].y + bodyBob,
  };
  const projectRelative = point => ({
    x: shoulder.x + (point.x - joints.shoulder.x) * armProjection.x,
    y: shoulder.y + (point.y - joints.shoulder.y) * armProjection.y,
  });
  return {
    shoulder,
    elbow: projectRelative(joints.elbow),
    wrist: projectRelative(joints.wrist),
  };
}

function renderBentArm(loaded, side, joints, bodyBob) {
  const key = side === 'left' ? 'Left' : 'Right';
  const image = loaded.images[`sleeve${key}`];
  const hand = loaded.images[`hand${key}`];
  const sourceShoulder = V8_CALIBRATION.sleeves.shoulderAnchors[side];
  const sourceCuff = V8_CALIBRATION.sleeves.cuffAnchors[side];
  const arm = mapArm(side, joints, bodyBob);
  const sleeveCanvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const sleeveContext = sleeveCanvas.getContext('2d');
  const sleeveTransform = drawIntactSleeve(
    sleeveContext, image, sourceShoulder, sourceCuff, arm.shoulder, arm.wrist,
  );
  const handCanvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const handRadians = axialAngle(arm.elbow, arm.wrist);
  drawAttachedHand(handCanvas.getContext('2d'), hand, side, arm.wrist, handRadians);
  return {
    ...arm,
    handAnchor: { ...arm.wrist },
    handRadians,
    source: { shoulder: sourceShoulder, cuff: sourceCuff },
    sleeveTransform,
    sleeveCanvas,
    handCanvas,
  };
}

function scanBounds(canvas) {
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  let left = canvas.width;
  let top = canvas.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < canvas.height; y += 1) for (let x = 0; x < canvas.width; x += 1) {
    if (!data[(y * canvas.width + x) * 4 + 3]) continue;
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }
  return right < left ? null : { left, top, right, bottom };
}

export function greenStarJumpPose(index) {
  const normalized = ((index % phaseIds.length) + phaseIds.length) % phaseIds.length;
  const phaseId = phaseIds[normalized];
  const geometry = jumpSouth[phaseId];
  const standingHipY = GREEN_ACTION_RIG_V1.sourceActionFrame.floorY - 96;
  const bodyBob = Math.round((geometry.hipCenter.y - standingHipY) * V8_CALIBRATION.projectionScale.y);
  return { index: normalized, phaseId, stage: geometry.stage, geometry, bodyBob };
}

export function renderGreenStarJump(loaded, pose) {
  if (pose.phaseId === '08') {
    const ready = renderGreenV8(loaded, v8StandingPose());
    return {
      canvas: ready.canvas,
      metadata: {
        ...ready.metadata,
        pose: { index: pose.index, phaseId: pose.phaseId, stage: pose.stage, bodyBob: 0 },
        actionGeometry: pose.geometry,
        exactStandingEndpoint: true,
        bounds: scanBounds(ready.canvas),
      },
      diagnostics: { ready: true },
    };
  }

  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const legGeometry = actionLegGeometry(pose.geometry);
  const legs = {};
  for (const side of ['left', 'right']) {
    legs[side] = renderGreenV8Leg(loaded, { geometry: legGeometry }, side);
    context.drawImage(legs[side].canvas, 0, 0);
  }

  const arms = Object.fromEntries(['left', 'right'].map(side => [
    side,
    renderBentArm(loaded, side, pose.geometry.joints[side], pose.bodyBob),
  ]));
  for (const side of ['left', 'right']) context.drawImage(arms[side].sleeveCanvas, 0, 0);

  const torsoScale = loaded.torsoScale;
  const torsoX = 80 - (loaded.torsoBounds.x + loaded.torsoBounds.width / 2) * torsoScale;
  const torsoY = GREEN_RIG_V6.torso.topY - loaded.torsoBounds.y * torsoScale + pose.bodyBob;
  const torsoCanvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  torsoCanvas.getContext('2d').drawImage(
    loaded.images.torso,
    torsoX,
    torsoY,
    loaded.images.torso.width * torsoScale,
    loaded.images.torso.height * torsoScale,
  );
  context.drawImage(torsoCanvas, 0, 0);
  for (const side of ['left', 'right']) context.drawImage(arms[side].handCanvas, 0, 0);

  const head = { x: GREEN_RIG_V6.head.x, y: GREEN_RIG_V6.head.y + pose.bodyBob, scale: 1 };
  context.drawImage(loaded.images.head, head.x, head.y);
  const armMetadata = Object.fromEntries(Object.entries(arms).map(([side, arm]) => [side, {
    shoulder: arm.shoulder,
    elbow: arm.elbow,
    wrist: arm.wrist,
    handAnchor: arm.handAnchor,
    handRadians: arm.handRadians,
    source: arm.source,
    sleeveTransform: arm.sleeveTransform,
  }]));
  return {
    canvas,
    metadata: {
      pose: { index: pose.index, phaseId: pose.phaseId, stage: pose.stage, bodyBob: pose.bodyBob },
      actionGeometry: pose.geometry,
      joints: Object.fromEntries(Object.entries(legs).map(([side, leg]) => [side, leg.joints])),
      continuity: Object.fromEntries(Object.entries(legs).map(([side, leg]) => [side, leg.diagnostics])),
      arms: armMetadata,
      torso: { x: torsoX, y: torsoY, scale: torsoScale },
      head,
      exactStandingEndpoint: false,
      bounds: scanBounds(canvas),
    },
    diagnostics: {
      ready: false,
      arms: Object.fromEntries(Object.entries(arms).map(([side, arm]) => [side, {
        sleeveCanvas: arm.sleeveCanvas,
        handCanvas: arm.handCanvas,
      }])),
      torsoCanvas,
    },
  };
}

function drawGeneratedPart(context, image, bounds, sourceAnchor, targetAnchor, scale) {
  const x = targetAnchor.x - (sourceAnchor.x - bounds.x) * scale;
  const y = targetAnchor.y - (sourceAnchor.y - bounds.y) * scale;
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  context.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height, x, y, width, height);
  return { x, y, width, height, scale, sourceRect: [bounds.x, bounds.y, bounds.width, bounds.height], sourceAnchor, targetAnchor };
}

function drawGeneratedLimb(context, image, bounds, sourceAnchors, targetShoulder, targetHand, scale) {
  const sourceAngle = Math.atan2(
    sourceAnchors.hand.y - sourceAnchors.shoulder.y,
    sourceAnchors.hand.x - sourceAnchors.shoulder.x,
  );
  const targetAngle = Math.atan2(targetHand.y - targetShoulder.y, targetHand.x - targetShoulder.x);
  const radians = targetAngle - sourceAngle;
  const cosine = Math.cos(radians) * scale;
  const sine = Math.sin(radians) * scale;
  const transform = {
    a: cosine,
    b: sine,
    c: -sine,
    d: cosine,
    e: targetShoulder.x - cosine * sourceAnchors.shoulder.x + sine * sourceAnchors.shoulder.y,
    f: targetShoulder.y - sine * sourceAnchors.shoulder.x - cosine * sourceAnchors.shoulder.y,
  };
  context.save();
  context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
  context.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height,
    bounds.x, bounds.y, bounds.width, bounds.height);
  context.restore();
  const mappedHand = transformPoint(transform, sourceAnchors.hand);
  return {
    transform,
    scale,
    radians,
    sourceRect: [bounds.x, bounds.y, bounds.width, bounds.height],
    sourceAnchors,
    shoulder: targetShoulder,
    hand: mappedHand,
    handGuide: targetHand,
  };
}

function drawSeatedLowerBody(context, loaded, view) {
  const record = loaded.actionAssets.provenance.seated.cells[`${view}.lowerBody`];
  const pixels = imagePixels(loaded.actionAssets.seated);
  const waistAnchor = topAnchor(pixels, loaded.actionAssets.seated.width, record.bounds);
  const scale = GREEN_ACTION_RIG_V1.sitting.lowerBodyScale[view];
  const lower = drawGeneratedPart(context, loaded.actionAssets.seated, record.bounds,
    { x: waistAnchor.x, y: record.bounds.y + record.bounds.height },
    { x: GREEN_RIG_V6.canvas.width / 2, y: GREEN_ACTION_RIG_V1.floorY + 1 }, scale);
  lower.waistY = lower.y + (waistAnchor.y - record.bounds.y) * scale;
  return lower;
}

function drawSeatedArm(context, loaded, view, side) {
  const record = loaded.actionAssets.provenance.seated.cells[`${view}.${side}Arm`];
  const sourceAnchors = loaded.actionAssets.seatedAnchors[view][side];
  const targetShoulder = view === 'south'
    ? {
      x: V8_CALIBRATION.correctedRest.shoulders[side].x,
      y: V8_CALIBRATION.correctedRest.shoulders[side].y + GREEN_ACTION_RIG_V1.sitting.bodyDrop,
    }
    : {
      x: DIRECTIONAL_CALIBRATION.shoulderSockets[view][side].x,
      y: DIRECTIONAL_CALIBRATION.shoulderSockets[view][side].y + GREEN_ACTION_RIG_V1.sitting.bodyDrop,
    };
  return drawGeneratedLimb(context, loaded.actionAssets.seated, record.bounds, sourceAnchors,
    targetShoulder, GREEN_ACTION_RIG_V1.sitting.handTargets[view][side],
    GREEN_ACTION_RIG_V1.sitting.armScale[view]);
}

function drawSouthTorso(context, loaded, bodyDrop) {
  const scale = loaded.torsoScale;
  const x = 80 - (loaded.torsoBounds.x + loaded.torsoBounds.width / 2) * scale;
  const y = GREEN_RIG_V6.torso.topY - loaded.torsoBounds.y * scale + bodyDrop;
  context.drawImage(loaded.images.torso, x, y, loaded.images.torso.width * scale, loaded.images.torso.height * scale);
  return { x, y, scale };
}

function drawSouthHead(context, loaded, bodyDrop) {
  const head = { x: GREEN_RIG_V6.head.x, y: GREEN_RIG_V6.head.y + bodyDrop, scale: 1 };
  context.drawImage(loaded.images.head, head.x, head.y);
  return head;
}

function drawDirectionalTorso(context, loaded, view, bodyDrop) {
  const rect = DIRECTIONAL_CALIBRATION.plate.rectangles[view].torso;
  const scale = DIRECTIONAL_CALIBRATION.torsoScale[view];
  const x = DIRECTIONAL_CANVAS.axisX - rect[2] * scale / 2;
  const y = DIRECTIONAL_CALIBRATION.target.torsoTop[view] + bodyDrop;
  context.drawImage(loaded.directional.plate, ...rect, x, y, rect[2] * scale, rect[3] * scale);
  return { x, y, width: rect[2] * scale, height: rect[3] * scale, scale, sourceRect: rect };
}

function drawDirectionalHeadAndNeck(context, loaded, view, bodyDrop) {
  const placement = DIRECTIONAL_CALIBRATION.neckBridgePlacement[view];
  const neck = {
    x: placement.x,
    y: placement.y + DIRECTIONAL_CALIBRATION.headRegistrationY[view] + bodyDrop,
    scale: 1,
  };
  context.drawImage(loaded.directional.neckBridges[view], neck.x, neck.y);
  const bounds = DIRECTIONAL_CALIBRATION.headBounds[view];
  const visibleWidth = bounds.right - bounds.left + 1;
  const head = {
    x: DIRECTIONAL_CANVAS.axisX - visibleWidth / 2 - bounds.left,
    y: DIRECTIONAL_CALIBRATION.target.visibleHeadTop - bounds.top
      + DIRECTIONAL_CALIBRATION.headRegistrationY[view] + bodyDrop,
    scale: 1,
  };
  context.drawImage(loaded.directional.heads[view], head.x, head.y);
  return { head, neck };
}

export function renderGreenSeated(loaded, view) {
  if (!GREEN_ACTION_RIG_V1.sitting.views.includes(view)) throw new Error(`unsupported seated view ${view}`);
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const arms = {};
  let lowerBody;
  let torso;
  let head;
  let neck = null;
  const drawArm = side => { arms[side] = drawSeatedArm(context, loaded, view, side); };
  if (view === 'south') {
    lowerBody = drawSeatedLowerBody(context, loaded, view);
    torso = drawSouthTorso(context, loaded, GREEN_ACTION_RIG_V1.sitting.bodyDrop);
    head = drawSouthHead(context, loaded, GREEN_ACTION_RIG_V1.sitting.bodyDrop);
    drawArm('left');
    drawArm('right');
  } else if (view === 'north') {
    drawArm('left');
    drawArm('right');
    lowerBody = drawSeatedLowerBody(context, loaded, view);
    torso = drawDirectionalTorso(context, loaded, view, GREEN_ACTION_RIG_V1.sitting.bodyDrop);
    ({ head, neck } = drawDirectionalHeadAndNeck(context, loaded, view, GREEN_ACTION_RIG_V1.sitting.bodyDrop));
  } else {
    const near = DIRECTIONAL_CALIBRATION.nearSide[view];
    const far = near === 'left' ? 'right' : 'left';
    drawArm(far);
    lowerBody = drawSeatedLowerBody(context, loaded, view);
    torso = drawDirectionalTorso(context, loaded, view, GREEN_ACTION_RIG_V1.sitting.bodyDrop);
    ({ head, neck } = drawDirectionalHeadAndNeck(context, loaded, view, GREEN_ACTION_RIG_V1.sitting.bodyDrop));
    drawArm(near);
  }
  return {
    canvas,
    metadata: {
      view,
      pose: 'sit',
      bodyDrop: GREEN_ACTION_RIG_V1.sitting.bodyDrop,
      waistY: lowerBody.waistY,
      seatY: GREEN_ACTION_RIG_V1.sitting.seatY,
      floorY: GREEN_ACTION_RIG_V1.floorY,
      layerPolicy: view === 'south' ? ['lowerBody', 'torso', 'head', 'arms']
        : view === 'north' ? ['arms', 'lowerBody', 'torso', 'neck', 'head']
          : ['farArm', 'lowerBody', 'torso', 'neck', 'head', 'nearArm'],
      lowerBody,
      torso,
      neck,
      head,
      arms,
      bounds: scanBounds(canvas),
    },
  };
}

function drawClipboard(context, spec) {
  const { x, y, width, height } = spec;
  context.fillStyle = '#2d2922';
  context.fillRect(x - 2, y - 2, width + 4, height + 4);
  context.fillStyle = '#806547';
  context.fillRect(x, y, width, height);
  context.fillStyle = '#f4eedf';
  context.fillRect(x + 5, y + 7, width - 10, height - 12);
  context.fillStyle = '#25292a';
  context.fillRect(x + width / 2 - 8, y - 4, 16, 7);
  context.fillStyle = '#a4a5a0';
  context.fillRect(x + width / 2 - 5, y - 2, 10, 3);
  return { ...spec };
}

function drawClipboardArm(context, loaded, side) {
  const record = loaded.actionAssets.provenance.clipboard.cells[`${side}Arm`];
  const sourceAnchors = loaded.actionAssets.clipboardAnchors[side];
  const targetShoulder = GREEN_ACTION_RIG_V1.clipboard.shoulders[side];
  return drawGeneratedLimb(context, loaded.actionAssets.clipboard, record.bounds, sourceAnchors,
    targetShoulder, GREEN_ACTION_RIG_V1.clipboard.handTargets[side],
    GREEN_ACTION_RIG_V1.clipboard.armScale[side]);
}

export function renderGreenClipboard(loaded) {
  const pose = v8StandingPose();
  const canvas = createCanvas(GREEN_RIG_V6.canvas.width, GREEN_RIG_V6.canvas.height);
  const context = canvas.getContext('2d');
  const legs = {};
  for (const side of ['left', 'right']) {
    legs[side] = renderGreenV8Leg(loaded, pose, side);
    context.drawImage(legs[side].canvas, 0, 0);
  }
  const torso = drawSouthTorso(context, loaded, 0);
  const head = drawSouthHead(context, loaded, 0);
  const board = drawClipboard(context, GREEN_ACTION_RIG_V1.clipboard.board);
  const arms = {
    left: drawClipboardArm(context, loaded, 'left'),
    right: drawClipboardArm(context, loaded, 'right'),
  };
  return {
    canvas,
    metadata: {
      view: 'south',
      pose: 'clipboard',
      floorY: GREEN_ACTION_RIG_V1.floorY,
      layerPolicy: ['legs', 'torso', 'head', 'clipboard', 'arms'],
      joints: Object.fromEntries(Object.entries(legs).map(([side, leg]) => [side, leg.joints])),
      continuity: Object.fromEntries(Object.entries(legs).map(([side, leg]) => [side, leg.diagnostics])),
      torso,
      head,
      board,
      arms,
      bounds: scanBounds(canvas),
    },
  };
}

export const greenActionInternals = Object.freeze({ mapActionPoint, actionLegGeometry });
