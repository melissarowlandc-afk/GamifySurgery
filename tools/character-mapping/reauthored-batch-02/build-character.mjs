import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compileLateral, compileNorthSouth } from '../math.mjs';
import { inspectAlpha, keyConnectedBackground, renderRigidPiece, renderSkinnedPart } from '../reauthored-pilot/mesh-engine.mjs';
import { validateSourceProfiles } from '../reauthored-pilot/source-profile.mjs';

const direction = process.argv[2] ?? 'east';
const runtimeId = process.argv[3] ?? 'patient.adult.046';
const checkpointOnly = process.argv[4] === 'checkpoint';
if (!['east', 'west', 'south', 'north'].includes(direction)) throw new Error(`unsupported direction: ${direction}`);
const repositoryRoot = resolve(import.meta.dirname, '../../..'), outputRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/checkpoint');
mkdirSync(outputRoot, { recursive: true });
const batch = JSON.parse(readFileSync(resolve(import.meta.dirname, 'characters.json'), 'utf8')), character = batch.characters[runtimeId];
if (!character) throw new Error(`unknown batch-02 character: ${runtimeId}`);
const characterSlug = character.slug;
const profiles = validateSourceProfiles(JSON.parse(readFileSync(resolve(import.meta.dirname, 'source-profiles.json'), 'utf8')), { allowPending: true });
const profile = profiles.characters[runtimeId].views[direction];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const loadPinned = async source => {
  const absolute = resolve(repositoryRoot, source.path), bytes = readFileSync(absolute);
  if (sha(bytes) !== source.sha256) throw new Error(`source hash mismatch: ${source.path}`);
  return loadImage(absolute);
};
const imageToData = image => { const canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0); return context.getImageData(0, 0, canvas.width, canvas.height); };
const atlasImage = await loadPinned(profile.source), keyed = keyConnectedBackground(imageToData(atlasImage), { color: [255, 0, 255], tolerance: 96, magentaDominanceThreshold: 20 }), atlasData = keyed.imageData;

function keyNeutralBackground(canvas) {
    const context = canvas.getContext('2d');
    const data = context.getImageData(0, 0, canvas.width, canvas.height), seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length); let head = 0, tail = 0;
    const background = pixel => { const index = pixel * 4, values = [data.data[index], data.data[index + 1], data.data[index + 2]]; return Math.min(...values) >= 150 && Math.max(...values) - Math.min(...values) <= 32; };
    const add = pixel => { if (!seen[pixel] && background(pixel)) { seen[pixel] = 1; queue[tail++] = pixel; } };
    for (let x = 0; x < canvas.width; x += 1) { add(x); add((canvas.height - 1) * canvas.width + x); }
    for (let y = 0; y < canvas.height; y += 1) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
    while (head < tail) { const pixel = queue[head++], x = pixel % canvas.width, y = Math.floor(pixel / canvas.width); if (x) add(pixel - 1); if (x + 1 < canvas.width) add(pixel + 1); if (y) add(pixel - canvas.width); if (y + 1 < canvas.height) add(pixel + canvas.width); }
    for (let pixel = 0; pixel < seen.length; pixel += 1) if (seen[pixel]) data.data[pixel * 4 + 3] = 0;
    context.putImageData(data, 0, 0);
    return canvas;
}
function neutralizeMagentaDominantMatte(canvas, includesPixel) {
  const context = canvas.getContext('2d'), data = context.getImageData(0, 0, canvas.width, canvas.height); let changedPixels = 0;
  for (let index = 0; index < data.data.length; index += 4) {
    if (!data.data[index + 3] || !includesPixel(index / 4)) continue;
    const neutral = Math.min(data.data[index], data.data[index + 2]);
    if (neutral - data.data[index + 1] <= 20) continue;
    data.data[index + 1] = neutral;
    changedPixels += 1;
  }
  context.putImageData(data, 0, 0);
  return changedPixels;
}
function keyedOriginalHead() {
  const source = profile.identityHead.source, absolute = resolve(repositoryRoot, source.path), bytes = readFileSync(absolute);
  if (sha(bytes) !== source.sha256) throw new Error('approved original head source hash mismatch');
  return loadImage(absolute).then(image => {
    const crop = profile.identityHead.crop, canvas = createCanvas(crop.width, crop.height), context = canvas.getContext('2d');
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height); keyNeutralBackground(canvas);
    const masked = createCanvas(canvas.width, canvas.height), maskContext = masked.getContext('2d');
    const drawClipped = (targetContext, sourceCanvas, polygon) => { targetContext.save(); targetContext.beginPath(); polygon.forEach(([x, y], index) => index ? targetContext.lineTo(x, y) : targetContext.moveTo(x, y)); targetContext.closePath(); targetContext.clip(); targetContext.drawImage(sourceCanvas, 0, 0); targetContext.restore(); };
    const headLayer = createCanvas(canvas.width, canvas.height), headContext = headLayer.getContext('2d'); drawClipped(headContext, canvas, profile.identityHead.polygon);
    const headData = headContext.getImageData(0, 0, canvas.width, canvas.height), visited = new Uint8Array(canvas.width * canvas.height), headComponents = [];
    for (let start = 0; start < visited.length; start += 1) {
      if (visited[start] || !headData.data[start * 4 + 3]) continue;
      const queue = [start], component = []; visited[start] = 1;
      while (queue.length) {
        const pixel = queue.pop(), x = pixel % canvas.width, y = Math.floor(pixel / canvas.width); component.push(pixel);
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const nextX = x + offsetX, nextY = y + offsetY; if ((!offsetX && !offsetY) || nextX < 0 || nextX >= canvas.width || nextY < 0 || nextY >= canvas.height) continue;
          const neighbor = nextY * canvas.width + nextX; if (!visited[neighbor] && headData.data[neighbor * 4 + 3]) { visited[neighbor] = 1; queue.push(neighbor); }
        }
      }
      headComponents.push(component);
    }
    const headComponent = headComponents.sort((left, right) => right.length - left.length)[0];
    if (!headComponent) throw new Error('approved identity head mask has no opaque pixels');
    const allowed = new Uint8Array(visited.length); for (const pixel of headComponent) allowed[pixel] = 1;
    for (let pixel = 0; pixel < allowed.length; pixel += 1) if (!allowed[pixel]) headData.data[pixel * 4 + 3] = 0;
    for (const exclusion of profile.identityHead.pixelExclusions ?? []) {
      for (let y = exclusion.y; y < exclusion.y + exclusion.height; y += 1) for (let x = exclusion.x; x < exclusion.x + exclusion.width; x += 1) headData.data[(y * canvas.width + x) * 4 + 3] = 0;
    }
    headContext.putImageData(headData, 0, 0); maskContext.drawImage(headLayer, 0, 0);
    for (const polygon of profile.identityHead.hairPolygons ?? []) {
      const hairLayer = createCanvas(canvas.width, canvas.height), hairContext = hairLayer.getContext('2d');
      drawClipped(hairContext, canvas, polygon);
      const data = hairContext.getImageData(0, 0, canvas.width, canvas.height), keep = new Uint8Array(canvas.width * canvas.height), selection = profile.identityHead.hairSelection;
      for (let pixel = 0; pixel < keep.length; pixel += 1) {
        const offset = pixel * 4, red = data.data[offset], green = data.data[offset + 1], blue = data.data[offset + 2];
        const luma = (red + green + blue) / 3, range = Math.max(red, green, blue) - Math.min(red, green, blue);
        if (data.data[offset + 3] && luma >= selection.minimumCoreLuma && range <= selection.maximumCoreChannelRange && (!selection.requireRedAtLeastBlue || red >= blue)) keep[pixel] = 1;
      }
      if (selection.largestCoreComponentOnly) {
        const visited = new Uint8Array(keep.length), components = [];
        for (let start = 0; start < keep.length; start += 1) {
          if (!keep[start] || visited[start]) continue;
          const queue = [start], component = []; visited[start] = 1;
          while (queue.length) {
            const pixel = queue.pop(), x = pixel % canvas.width, y = Math.floor(pixel / canvas.width); component.push(pixel);
            for (const neighbor of [x ? pixel - 1 : -1, x + 1 < canvas.width ? pixel + 1 : -1, y ? pixel - canvas.width : -1, y + 1 < canvas.height ? pixel + canvas.width : -1]) if (neighbor >= 0 && keep[neighbor] && !visited[neighbor]) { visited[neighbor] = 1; queue.push(neighbor); }
          }
          components.push(component);
        }
        const largest = components.sort((left, right) => right.length - left.length)[0] ?? [], selected = new Uint8Array(keep.length);
        for (const pixel of largest) selected[pixel] = 1;
        keep.set(selected);
      }
      for (let pass = 0; pass < selection.outlineGrowthPixels; pass += 1) {
        const grown = new Uint8Array(keep);
        for (let pixel = 0; pixel < keep.length; pixel += 1) {
          if (keep[pixel] || !data.data[pixel * 4 + 3]) continue;
          const offset = pixel * 4;
          if (selection.requireRedAtLeastBlue && data.data[offset] < data.data[offset + 2]) continue;
          const x = pixel % canvas.width, y = Math.floor(pixel / canvas.width);
          if ((x && keep[pixel - 1]) || (x + 1 < canvas.width && keep[pixel + 1]) || (y && keep[pixel - canvas.width]) || (y + 1 < canvas.height && keep[pixel + canvas.width])) grown[pixel] = 1;
        }
        keep.set(grown);
      }
      for (let pixel = 0; pixel < keep.length; pixel += 1) if (!keep[pixel]) data.data[pixel * 4 + 3] = 0;
      hairContext.putImageData(data, 0, 0);
      maskContext.drawImage(hairLayer, 0, 0);
    }
    return masked;
  });
}
const headCanvas = await keyedOriginalHead();

const lateralConfig = { frame: character.frame, centers: character.lateral.centers, foot: character.lateral.foot, envelope: character.lateral.envelope, segmentLengths: character.lateral.segmentLengths, motion: {} }, frameAxisX = lateralConfig.frame.axisX, frameFloorY = lateralConfig.frame.floorY;
const gaitScale = lateralConfig.segmentLengths.thigh + lateralConfig.segmentLengths.shin;
const armScale = lateralConfig.segmentLengths.upperArm + lateralConfig.segmentLengths.forearm;
lateralConfig.motion = { bobStride: 7.58 / 72 * gaitScale, bobTransition: 2.53 / 72 * gaitScale, bobPassing: 0, strideReach: 31.58 / 72 * gaitScale, transitionReach: 16.42 / 72 * gaitScale, recoveryLift: 6.32 / 72 * gaitScale, passingLift: 5.05 / 72 * gaitScale, transitionLift: 2.53 / 72 * gaitScale, armStrideReach: 37.77 / 73 * armScale, armTransitionReach: 19.55 / 73 * armScale, armStrideDrop: 61.27 / 73 * armScale, armTransitionDrop: 69.09 / 73 * armScale, armPassingDrop: armScale };
lateralConfig.registration = { east: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 }, west: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 } };
const lateralRecipe = { identity: { templateId: character.previewId }, lateral: lateralConfig, lineage: { east: { kind: 'independent' }, west: { kind: 'independent' } } };
const lengths = lateralConfig.segmentLengths, legLength = lengths.thigh + lengths.shin, armLength = lengths.upperArm + lengths.forearm;
const northSouthRecipe = { identity: lateralRecipe.identity, lineage: { south: { kind: 'independent' }, north: { kind: 'independent' } }, northSouth: { frame: character.frame, registration: { south: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 }, north: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 } }, segmentLengths3D: { thigh: lengths.thigh, shin: lengths.shin, upperArm: lengths.upperArm, forearm: lengths.forearm, hand: lengths.hand }, lanes: { hipHalfWidth: character.northSouth.hipHalfWidth, kneeBendLateralPreference: .055 }, body: character.northSouth.body, projection: { verticalScale: 1, depthScale: .22, lateralScale: 1 }, foot: { ankleHeight: character.frame.floorY - character.neutral.ankleY, contactForwardOffset: 2, heelForwardOffset: -4, toeForwardOffset: 8, heelHalfWidth: 12, toeHalfWidth: 15, liftedHeelRise: 1, liftedToeRise: 3 }, motion: { strideReach: 24 / 66 * legLength, transitionReach: 12 / 66 * legLength, recoveryLift: 3 / 66 * legLength, passingLift: 5 / 66 * legLength, transitionLift: 2 / 66 * legLength, armStrideReach: 22 / 63 * armLength, armTransitionReach: 11 / 63 * armLength, armStrideSpan: 61 / 63 * armLength, armTransitionSpan: 61.5 / 63 * armLength, armPassingSpan: armLength } } };
const compiled = direction === 'east' || direction === 'west' ? compileLateral(lateralRecipe) : compileNorthSouth(northSouthRecipe);
const normalizeGeometry = target => {
  if (target.geometry.joints) return target.geometry;
  const frame = target.geometry.frame;
  return { ...frame, joints: Object.fromEntries(Object.entries(frame.joints).map(([side, joint]) => [side, { ...joint, shoeContact: joint.contact, shoeHeel: joint.heel, shoeToe: joint.toe }])), visibility: target.geometry.visibility, registration: target.geometry.registration };
};
const targets = Object.fromEntries(compiled.filter(value => value.view === direction).map(value => [value.phaseId, normalizeGeometry(value)]));
function applyTargetRegistration(geometry) {
  const adjusted = structuredClone(geometry), armKeys = ['shoulder', 'elbow', 'wrist', 'hand'];
  for (const side of ['left', 'right']) {
    const joint = adjusted.joints[side]; let deltaX = 0;
    if (profile.targetRegistration.armShoulderTargetX) deltaX = profile.targetRegistration.armShoulderTargetX[side] - joint.shoulder.x;
    else if (profile.targetRegistration.armChainInsetPixels) deltaX = Math.sign(frameAxisX - joint.shoulder.x) * profile.targetRegistration.armChainInsetPixels;
    const deltaY = profile.targetRegistration.walkingShoulderHeightAboveHip === undefined
      ? profile.targetRegistration.armChainOffsetY ?? 0
      : joint.hip.y - profile.targetRegistration.walkingShoulderHeightAboveHip - joint.shoulder.y;
    for (const key of armKeys) { joint[key].x += deltaX; joint[key].y += deltaY; }
  }
  return adjusted;
}
for (const phaseId of Object.keys(targets)) targets[phaseId] = applyTargetRegistration(targets[phaseId]);

const armRig = joint => ({ proximal: joint.shoulder, joint: joint.elbow, terminal: joint.wrist, end: joint.hand });
const legRig = (joint, part) => {
  const terminalLength = Math.hypot(part.rig.end.x - part.rig.terminal.x, part.rig.end.y - part.rig.terminal.y) * part.normalizationScale;
  return { proximal: joint.hip, joint: joint.knee, terminal: { x: joint.shoeContact.x, y: joint.shoeContact.y - terminalLength }, end: joint.shoeContact };
};
const averageHip = geometry => ({ x: (geometry.joints.left.hip.x + geometry.joints.right.hip.x) / 2, y: (geometry.joints.left.hip.y + geometry.joints.right.hip.y) / 2 });
function drawHead(context, targetHip) { context.drawImage(headCanvas, targetHip.x - profile.identityHead.sourceHip.x + (profile.targetRegistration.headOffsetX ?? 0), targetHip.y - profile.identityHead.sourceHip.y + (profile.targetRegistration.headOffsetY ?? 0)); }
function renderBody(targetAnchor) {
  const part = profile.parts.body, calibration = part.calibration, envelope = calibration.widthEnvelope;
  if (!envelope) return renderRigidPiece(atlasData, part, targetAnchor, profile.targetFrame);
  const canvas = createCanvas(profile.targetFrame.width, profile.targetFrame.height), context = canvas.getContext('2d'), output = context.createImageData(canvas.width, canvas.height);
  const envelopeScale = progress => {
    if (progress <= envelope[0][0]) return envelope[0][1];
    for (let index = 1; index < envelope.length; index += 1) if (progress <= envelope[index][0]) { const [previousAt, previousScale] = envelope[index - 1], [nextAt, nextScale] = envelope[index], amount = (progress - previousAt) / (nextAt - previousAt); return previousScale + (nextScale - previousScale) * amount; }
    return envelope.at(-1)[1];
  };
  for (let y = 0; y < canvas.height; y += 1) {
    const sourceY = Math.floor(part.anchor.y + (y + .5 - targetAnchor.y) / calibration.scaleY), progress = (sourceY - part.bounds.y) / Math.max(1, part.bounds.height - 1);
    if (sourceY < part.bounds.y || sourceY >= part.bounds.y + part.bounds.height) continue;
    const rowScaleX = calibration.scaleX * envelopeScale(progress);
    for (let x = 0; x < canvas.width; x += 1) {
      const sourceX = Math.floor(part.anchor.x + (x + .5 - targetAnchor.x) / rowScaleX);
      if (sourceX < part.bounds.x || sourceX >= part.bounds.x + part.bounds.width) continue;
      const sourceOffset = (sourceY * atlasData.width + sourceX) * 4, targetOffset = (y * canvas.width + x) * 4;
      output.data.set(atlasData.data.subarray(sourceOffset, sourceOffset + 4), targetOffset);
    }
  }
  context.putImageData(output, 0, 0);
  return canvas;
}
function render(geometry, { nearArmBehindBody = false } = {}) {
  const output = createCanvas(240, 310), context = output.getContext('2d'), hip = averageHip(geometry), diagnostics = {};
  const pieces = profile.parts;
  const reflectedSourcePart = name => {
    const part = pieces[name], side = name.startsWith('left') ? 'left' : 'right';
    const orientation = profile.targetRegistration.sourceOrientationByPart?.[name] ?? profile.targetRegistration.armSourceOrientationBySide?.[side] ?? 'authored';
    if (orientation !== 'mirror-x-local') return { imageData: atlasData, part };
    const imageData = { width: atlasData.width, height: atlasData.height, data: new Uint8ClampedArray(atlasData.data) }, { x, y, width, height } = part.bounds;
    for (let row = y; row < y + height; row += 1) for (let column = 0; column < width; column += 1) { const destination = (row * imageData.width + x + column) * 4, source = (row * atlasData.width + x + width - 1 - column) * 4; imageData.data.set(atlasData.data.subarray(source, source + 4), destination); }
    const reflectPoint = point => ({ x: x * 2 + width - 1 - point.x, y: point.y });
    return { imageData, part: { ...part, rig: Object.fromEntries(Object.entries(part.rig).map(([key, point]) => [key, reflectPoint(point)])), sourceOrientation: 'locally-reflected-horizontal-with-rig-reindexed' } };
  };
  const renderLimb = (name, rig) => { try { const source = reflectedSourcePart(name), rendered = renderSkinnedPart(source.imageData, source.part, rig, profile.targetFrame); diagnostics[name] = { sourceOrientation: source.part.sourceOrientation ?? 'authored', mesh: rendered.mesh.diagnostics, deformation: rendered.deformation }; return rendered.canvas; } catch (error) { throw new Error(`${name}: ${error.message}`, { cause: error }); } };
  const renderLeg = (name, joint) => {
    const source = reflectedSourcePart(name), part = source.part, target = legRig(joint, part);
    const rendered = renderSkinnedPart(source.imageData, part, target, profile.targetFrame);
    const alpha = inspectAlpha(rendered.canvas.getContext('2d').getImageData(0, 0, 240, 310), { x: 0, y: 0, width: 240, height: 310 });
    const rasterEdgeIslands = alpha.components.filter(component => component.pixelCount <= 1);
    if (alpha.componentCount !== 1) throw new Error(`${name}: complete surface produced ${alpha.componentCount} opaque components ${JSON.stringify(alpha.components)}`);
    diagnostics[name] = { method: 'complete-single-surface-soft-knee-rigid-terminal', sourceOrientation: source.part.sourceOrientation ?? 'authored', mesh: rendered.mesh.diagnostics, deformation: rendered.deformation, outputAlpha: alpha, rasterEdgeIslands };
    return rendered.canvas;
  };
  const leftLeg = renderLeg('leftLeg', geometry.joints.left), rightLeg = renderLeg('rightLeg', geometry.joints.right);
  const leftArm = renderLimb('leftArm', armRig(geometry.joints.left)), rightArm = renderLimb('rightArm', armRig(geometry.joints.right));
  const legOrder = geometry.visibility?.legsFarToNear ?? (direction === 'east' ? ['left', 'right'] : ['right', 'left']);
  const armOrder = geometry.visibility?.armsFarToNear ?? (direction === 'east' ? ['left', 'right'] : ['right', 'left']);
  const limbBySide = { left: { leg: leftLeg, arm: leftArm }, right: { leg: rightLeg, arm: rightArm } };
  const farLeg = limbBySide[legOrder[0]].leg, nearLeg = limbBySide[legOrder[1]].leg;
  const farArm = limbBySide[armOrder[0]].arm, nearArm = limbBySide[armOrder[1]].arm;
  const bodyCanvas = renderBody(hip), headLayer = createCanvas(240, 310), headContext = headLayer.getContext('2d'); drawHead(headContext, hip);
  const bodyPixels = bodyCanvas.getContext('2d').getImageData(0, 0, 240, 310).data, headPixels = headContext.getImageData(0, 0, 240, 310).data, overlapRows = new Set(); let overlapPixels = 0;
  for (let pixel = 0; pixel < 240 * 310; pixel += 1) if (bodyPixels[pixel * 4 + 3] && headPixels[pixel * 4 + 3]) { overlapPixels += 1; overlapRows.add(Math.floor(pixel / 240)); }
  diagnostics.headBodyContact = { overlapPixels, overlapRows: [...overlapRows] };
  if (overlapRows.size < profile.targetRegistration.headBodyMinOverlapRows) throw new Error(`head/body contact has ${overlapRows.size} overlapping rows; expected ${profile.targetRegistration.headBodyMinOverlapRows}`);
  const frontalArmsBehindBody = direction === 'south' || direction === 'north';
  if (frontalArmsBehindBody) {
    context.drawImage(farArm, 0, 0); context.drawImage(nearArm, 0, 0); context.drawImage(farLeg, 0, 0); context.drawImage(nearLeg, 0, 0); context.drawImage(bodyCanvas, 0, 0); context.drawImage(headLayer, 0, 0);
  } else {
    context.drawImage(farArm, 0, 0); context.drawImage(farLeg, 0, 0); context.drawImage(nearLeg, 0, 0); context.drawImage(bodyCanvas, 0, 0); context.drawImage(headLayer, 0, 0); context.drawImage(nearArm, 0, 0);
  }
  diagnostics.layerPolicy = { nearArmBehindBody: frontalArmsBehindBody || nearArmBehindBody, frontalArmsBehindBody };
  diagnostics.compositeMatteNeutralizedPixels = neutralizeMagentaDominantMatte(output, pixel => bodyPixels[pixel * 4 + 3] > 0 && headPixels[pixel * 4 + 3] > 0);
  return { canvas: output, diagnostics };
}
const lateralShoulders = profile.targetRegistration.armShoulderTargetX ?? { left: character.lateral.centers.shoulderLeftX, right: character.lateral.centers.shoulderRightX };
const lateralNeutral = {
  joints: {
    left: { shoulder: { x: lateralShoulders.left, y: character.neutral.shoulderY }, elbow: { x: lateralShoulders.left, y: character.neutral.elbowY }, wrist: { x: lateralShoulders.left, y: character.neutral.wristY }, hand: { x: lateralShoulders.left, y: character.neutral.handY }, hip: { x: frameAxisX - 6, y: character.neutral.hipY }, knee: { x: frameAxisX - 6, y: character.neutral.kneeY }, ankle: { x: frameAxisX - 6, y: character.neutral.ankleY }, shoeContact: { x: frameAxisX - 6, y: character.neutral.floorY } },
    right: { shoulder: { x: lateralShoulders.right, y: character.neutral.shoulderY }, elbow: { x: lateralShoulders.right, y: character.neutral.elbowY }, wrist: { x: lateralShoulders.right, y: character.neutral.wristY }, hand: { x: lateralShoulders.right, y: character.neutral.handY }, hip: { x: frameAxisX + 6, y: character.neutral.hipY }, knee: { x: frameAxisX + 6, y: character.neutral.kneeY }, ankle: { x: frameAxisX + 6, y: character.neutral.ankleY }, shoeContact: { x: frameAxisX + 6, y: character.neutral.floorY } }
  }
};
const neutral = direction === 'east' || direction === 'west' ? lateralNeutral : {
  visibility: targets['03'].visibility,
  joints: Object.fromEntries(['left', 'right'].map(side => {
    const sample = targets['03'].joints[side];
    return [side, { shoulder: { x: sample.shoulder.x, y: character.neutral.shoulderY }, elbow: { x: sample.elbow.x, y: character.neutral.elbowY }, wrist: { x: sample.wrist.x, y: character.neutral.wristY }, hand: { x: sample.hand.x, y: character.neutral.handY }, hip: { x: sample.hip.x, y: character.neutral.hipY }, knee: { x: sample.hip.x, y: character.neutral.kneeY }, ankle: { x: sample.hip.x, y: character.neutral.ankleY }, shoeContact: { x: sample.hip.x, y: character.neutral.floorY }, support: true }];
  })),
};
const renders = {};
for (const [name, geometry, options] of [[`${direction}-neutral`, neutral, { nearArmBehindBody: profile.targetRegistration.neutralNearArmBehindBody === true }], [`${direction}01`, targets['01'], {}], [`${direction}03`, targets['03'], {}]]) {
  renders[name] = render(geometry, options);
  writeFileSync(resolve(outputRoot, `${characterSlug}-${name}.png`), renders[name].canvas.toBuffer('image/png'));
}
const phaseIds = checkpointOnly ? ['01', '03'] : ['01', '02', '03', '04', '05', '06', '07', '08'], framesRoot = resolve(outputRoot, 'frames'); mkdirSync(framesRoot, { recursive: true });
const directionCycle = {};
for (const phaseId of phaseIds) {
  let rendered; try { rendered = phaseId === '01' ? renders[`${direction}01`] : phaseId === '03' ? renders[`${direction}03`] : render(targets[phaseId]); } catch (error) { throw new Error(`${direction} ${phaseId}: ${error.message}`, { cause: error }); }
  const file = `frames/${characterSlug}-${direction}-${phaseId}.png`, bytes = rendered.canvas.toBuffer('image/png'); writeFileSync(resolve(outputRoot, file), bytes);
  directionCycle[phaseId] = { clean: file, guide: null, sha256: { clean: sha(bytes), guide: null }, geometry: { registration: { frameAxisX, frameFloorY }, joints: targets[phaseId].joints }, targetRegistration: { sourceCuffY: profile.parts.rightLeg.rig.terminal.y, sourceSoleY: profile.parts.rightLeg.rig.end.y }, diagnostics: rendered.diagnostics };
}
const contactSheet = createCanvas(960, 660), contactContext = contactSheet.getContext('2d'); contactContext.fillStyle = '#17191d'; contactContext.fillRect(0, 0, contactSheet.width, contactSheet.height); contactContext.fillStyle = '#fff'; contactContext.font = 'bold 16px sans-serif';
for (const [index, phaseId] of phaseIds.entries()) { const x = index % 4 * 240, y = Math.floor(index / 4) * 330, frame = await loadImage(resolve(outputRoot, directionCycle[phaseId].clean)); contactContext.fillStyle = '#eeece6'; contactContext.fillRect(x, y + 20, 240, 310); contactContext.drawImage(frame, x, y + 20); contactContext.fillStyle = '#fff'; contactContext.fillText(`${direction[0].toUpperCase()}${direction.slice(1)} ${phaseId}`, x + 8, y + 17); }
const contactSheetBytes = contactSheet.toBuffer('image/png'), contactFile = `${characterSlug}-${direction}-01-08-contact.png`; writeFileSync(resolve(outputRoot, contactFile), contactSheetBytes);

if (directionCycle['07']) {
  const [supportSide, supportLeg] = Object.entries(targets['07'].joints).find(([, leg]) => leg.support);
  const upper = Math.hypot(supportLeg.knee.x - supportLeg.hip.x, supportLeg.knee.y - supportLeg.hip.y), lower = Math.hypot(supportLeg.shoeContact.x - supportLeg.knee.x, supportLeg.shoeContact.y - supportLeg.knee.y);
  const cross = Math.abs((supportLeg.knee.x - supportLeg.hip.x) * (supportLeg.shoeContact.y - supportLeg.hip.y) - (supportLeg.knee.y - supportLeg.hip.y) * (supportLeg.shoeContact.x - supportLeg.hip.x));
  directionCycle['07'].supportLegStraightness = { anatomicalSide: supportSide, perpendicularDistance: cross / Math.hypot(supportLeg.shoeContact.x - supportLeg.hip.x, supportLeg.shoeContact.y - supportLeg.hip.y), upperLength: upper, lowerLength: lower };
}

if (true) {
  const frontalArmsBehindBody = direction === 'south' || direction === 'north', opaqueLayerOrder = frontalArmsBehindBody ? ['farArm','nearArm','farLeg','nearLeg','body','head'] : ['farArm','farLeg','nearLeg','body','head','nearArm'];
  const report = { status: checkpointOnly ? `${direction}-correction-checkpoint` : `${direction}-cycle-review`, source: profile.source, identityHead: profile.identityHead.source, acceptedSolver: direction === 'east' || direction === 'west' ? 'tools/character-mapping/math.mjs#compileLateral' : 'tools/character-mapping/math.mjs#compileNorthSouth', phaseIds, direction, renderPolicy: { opaqueLayerOrder, farArmBehindBothLegs: true, frontalArmsBehindBody }, headRegistration: { offsetX: profile.targetRegistration.headOffsetX ?? 0, method: 'target hip minus measured source hip plus explicit per-view horizontal fit' }, sourceOrientation: { completePartLocalTransform: profile.targetRegistration.sourceOrientationByPart, provenance: 'per-view local source-surface transform; anatomical IDs unchanged' }, armTargetRegistration: { walkingShoulderHeightAboveHip: profile.targetRegistration.walkingShoulderHeightAboveHip, neutralShoulderHeightAboveHip: neutral.joints.left.hip.y - neutral.joints.left.shoulder.y, neutralUsesFixedStandingJointHeights: true }, neutralGeometry: neutral, neutralDiagnostics: renders[`${direction}-neutral`].diagnostics, frames: directionCycle, outputs: { contact: { file: contactFile, sha256: sha(contactSheetBytes) } }, limitations: ['batch-02 fitting checkpoint requires visual review', 'torso uses one recorded width/height calibration; every complete limb uses one uniform scale', 'each leg is one connected surface with a soft knee and a rigid terminal shoe transition'] };
  writeFileSync(resolve(outputRoot, `${characterSlug}-${direction}-checkpoint.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ contact: resolve(outputRoot, contactFile), phase07SupportLeg: directionCycle['07']?.supportLegStraightness ?? null }, null, 2));
  process.exit(0);
}
