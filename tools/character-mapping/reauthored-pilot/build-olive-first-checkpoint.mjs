import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compileLateral, compileNorthSouth } from '../math.mjs';
import { inspectAlpha, keyConnectedBackground, renderRigidPiece, renderSkinnedPart } from './mesh-engine.mjs';
import { validateSourceProfiles } from './source-profile.mjs';

const direction = process.argv[2] ?? 'east';
const runtimeId = process.argv[3] ?? 'patient.adult.033';
const checkpointOnly = process.argv[4] === 'checkpoint';
const characterSlug = runtimeId === 'patient.adult.032' ? 'gray' : 'olive';
if (!['east', 'west', 'south', 'north'].includes(direction)) throw new Error(`unsupported direction: ${direction}`);
const repositoryRoot = resolve(import.meta.dirname, '../../..'), outputRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-pilot/olive-first-checkpoint');
mkdirSync(outputRoot, { recursive: true });
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
    maskContext.beginPath(); profile.identityHead.polygon.forEach(([x, y], index) => index ? maskContext.lineTo(x, y) : maskContext.moveTo(x, y)); maskContext.closePath(); maskContext.clip(); maskContext.drawImage(canvas, 0, 0);
    return masked;
  });
}
const headCanvas = await keyedOriginalHead();

const mappings = JSON.parse(readFileSync(resolve(repositoryRoot, 'tools/character-mapping/retained-donor-merge/mapping.json'), 'utf8')), mappingCharacter = mappings.characters.find(value => value.id === (runtimeId === 'patient.adult.032' ? 'retained-dark-hair-beard-gray-overshirt' : 'retained-auburn-glasses-olive-jacket'));
const lateralConfig = structuredClone(mappingCharacter.recipe), frameAxisX = lateralConfig.frame.axisX, frameFloorY = lateralConfig.frame.floorY;
lateralConfig.registration = { east: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 }, west: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 } };
const lateralRecipe = { identity: { templateId: mappingCharacter.id }, lateral: lateralConfig, lineage: { east: { kind: 'independent' }, west: { kind: 'independent' } } };
const lengths = lateralConfig.segmentLengths, legLength = lengths.thigh + lengths.shin, armLength = lengths.upperArm + lengths.forearm;
const allDirectionKits = JSON.parse(readFileSync(resolve(repositoryRoot, 'tools/character-mapping/retained-donor-merge/all-directions-kits.json'), 'utf8')), directionKit = allDirectionKits.characters.find(value => value.runtimeId === runtimeId);
const northSouthRecipe = { identity: lateralRecipe.identity, lineage: { south: { kind: 'independent' }, north: { kind: 'independent' } }, northSouth: { frame: { width: 240, height: 310, axisX: frameAxisX, floorY: frameFloorY }, registration: { south: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 }, north: { scale: 1, sourceAxisX: frameAxisX, sourceFloorY: frameFloorY, sourceWidth: 240, sourceHeight: 310 } }, segmentLengths3D: { thigh: lengths.thigh, shin: lengths.shin, upperArm: lengths.upperArm, forearm: lengths.forearm, hand: lengths.hand }, lanes: { hipHalfWidth: runtimeId === 'patient.adult.033' ? 15 : 14, kneeBendLateralPreference: .055 }, body: directionKit.body, projection: { verticalScale: 1, depthScale: .22, lateralScale: 1 }, foot: { ankleHeight: 10, contactForwardOffset: 2, heelForwardOffset: -4, toeForwardOffset: 8, heelHalfWidth: 12, toeHalfWidth: 15, liftedHeelRise: 1, liftedToeRise: 3 }, motion: { strideReach: 24 / 66 * legLength, transitionReach: 12 / 66 * legLength, recoveryLift: 3 / 66 * legLength, passingLift: 5 / 66 * legLength, transitionLift: 2 / 66 * legLength, armStrideReach: 22 / 63 * armLength, armTransitionReach: 11 / 63 * armLength, armStrideSpan: 61 / 63 * armLength, armTransitionSpan: 61.5 / 63 * armLength, armPassingSpan: armLength } } };
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
function drawHead(context, targetHip) { context.drawImage(headCanvas, targetHip.x - profile.identityHead.sourceHip.x + (profile.targetRegistration.headOffsetX ?? 0), targetHip.y - profile.identityHead.sourceHip.y); }
function render(geometry, { nearArmBehindBody = false } = {}) {
  const output = createCanvas(240, 310), context = output.getContext('2d'), hip = averageHip(geometry), diagnostics = {};
  const pieces = profile.parts;
  const reflectedSourcePart = name => {
    const part = pieces[name], side = name.startsWith('left') ? 'left' : 'right'; if (profile.targetRegistration.armSourceOrientationBySide?.[side] !== 'mirror-x-local') return { imageData: atlasData, part };
    const imageData = { width: atlasData.width, height: atlasData.height, data: new Uint8ClampedArray(atlasData.data) }, { x, y, width, height } = part.bounds;
    for (let row = y; row < y + height; row += 1) for (let column = 0; column < width; column += 1) { const destination = (row * imageData.width + x + column) * 4, source = (row * atlasData.width + x + width - 1 - column) * 4; imageData.data.set(atlasData.data.subarray(source, source + 4), destination); }
    const reflectPoint = point => ({ x: x * 2 + width - 1 - point.x, y: point.y });
    return { imageData, part: { ...part, rig: Object.fromEntries(Object.entries(part.rig).map(([key, point]) => [key, reflectPoint(point)])), sourceOrientation: 'locally-reflected-horizontal-with-rig-reindexed' } };
  };
  const renderLimb = (name, rig) => { try { const source = reflectedSourcePart(name), rendered = renderSkinnedPart(source.imageData, source.part, rig, profile.targetFrame); diagnostics[name] = { sourceOrientation: source.part.sourceOrientation ?? 'authored', mesh: rendered.mesh.diagnostics, deformation: rendered.deformation }; return rendered.canvas; } catch (error) { throw new Error(`${name}: ${error.message}`, { cause: error }); } };
  const renderLeg = (name, joint) => {
    const part = pieces[name], target = legRig(joint, part), cuffY = part.rig.terminal.y, overlap = 5;
    const masked = predicate => { const data = { width: atlasData.width, height: atlasData.height, data: new Uint8ClampedArray(atlasData.data) }; for (let y = 0; y < data.height; y += 1) if (!predicate(y)) for (let x = part.bounds.x; x < part.bounds.x + part.bounds.width; x += 1) data.data[(y * data.width + x) * 4 + 3] = 0; return data; };
    const upperData = masked(y => y < cuffY + overlap), terminalData = masked(y => y >= cuffY - overlap);
    const upperTerminalSourceY = part.rig.end.y, sourceRatio = (cuffY - part.rig.joint.y) / (upperTerminalSourceY - part.rig.joint.y), kneeToCuff = { x: target.terminal.x - target.joint.x, y: target.terminal.y - target.joint.y };
    const fakeTerminal = { x: target.joint.x + kneeToCuff.x / sourceRatio, y: target.joint.y + kneeToCuff.y / sourceRatio }, fakeDirection = { x: fakeTerminal.x - target.joint.x, y: fakeTerminal.y - target.joint.y }, fakeLength = Math.hypot(fakeDirection.x, fakeDirection.y), fakeEnd = { x: fakeTerminal.x + fakeDirection.x / fakeLength, y: fakeTerminal.y + fakeDirection.y / fakeLength };
    const upperPart = { ...part, bounds: { ...part.bounds, height: cuffY + overlap - part.bounds.y }, rig: { ...part.rig, terminal: { x: part.rig.terminal.x, y: upperTerminalSourceY }, end: { x: part.rig.terminal.x, y: upperTerminalSourceY + 1 } }, skinning: { ...part.skinning, jointBlendPixels: [part.skinning.jointBlendPixels[0], 0], terminalTransition: { before: 0, after: 0 } } };
    const upperTarget = { proximal: target.proximal, joint: target.joint, terminal: fakeTerminal, end: fakeEnd };
    const terminalPart = { ...part, bounds: { x: part.bounds.x, y: cuffY - overlap, width: part.bounds.width, height: part.bounds.y + part.bounds.height - (cuffY - overlap) }, rig: { proximal: { x: part.rig.terminal.x, y: cuffY - overlap }, joint: { x: part.rig.terminal.x, y: cuffY }, terminal: { x: part.rig.terminal.x, y: cuffY + 1 }, end: part.rig.end }, skinning: { jointBlendPixels: [0, 0], terminalTransition: { before: 0, after: 0 } } };
    const terminalTarget = { proximal: { x: target.terminal.x, y: target.terminal.y - overlap * part.normalizationScale }, joint: target.terminal, terminal: { x: target.terminal.x, y: target.terminal.y + part.normalizationScale }, end: target.end };
    const upper = renderSkinnedPart(upperData, upperPart, upperTarget, profile.targetFrame), terminal = renderSkinnedPart(terminalData, terminalPart, terminalTarget, profile.targetFrame), combined = createCanvas(240, 310), combinedContext = combined.getContext('2d');
    combinedContext.drawImage(terminal.canvas, 0, 0); combinedContext.drawImage(upper.canvas, 0, 0);
    const alpha = inspectAlpha(combinedContext.getImageData(0, 0, 240, 310), { x: 0, y: 0, width: 240, height: 310 });
    if (alpha.componentCount !== 1) throw new Error(`${name}: cuff overlap produced ${alpha.componentCount} opaque components`);
    diagnostics[name] = { method: 'authored-cuff-overlap-plus-rigid-complete-shoe', sourceCuffY: cuffY, overlapPixels: overlap, upper: { mesh: upper.mesh.diagnostics, deformation: upper.deformation }, terminal: { mesh: terminal.mesh.diagnostics, deformation: terminal.deformation }, outputAlpha: alpha };
    return combined;
  };
  const leftLeg = renderLeg('leftLeg', geometry.joints.left), rightLeg = renderLeg('rightLeg', geometry.joints.right);
  const leftArm = renderLimb('leftArm', armRig(geometry.joints.left)), rightArm = renderLimb('rightArm', armRig(geometry.joints.right));
  const legOrder = geometry.visibility?.legsFarToNear ?? (direction === 'east' ? ['left', 'right'] : ['right', 'left']);
  const armOrder = geometry.visibility?.armsFarToNear ?? (direction === 'east' ? ['left', 'right'] : ['right', 'left']);
  const limbBySide = { left: { leg: leftLeg, arm: leftArm }, right: { leg: rightLeg, arm: rightArm } };
  const farLeg = limbBySide[legOrder[0]].leg, nearLeg = limbBySide[legOrder[1]].leg;
  const farArm = limbBySide[armOrder[0]].arm, nearArm = limbBySide[armOrder[1]].arm;
  const bodyCanvas = renderRigidPiece(atlasData, pieces.body, hip, profile.targetFrame), headLayer = createCanvas(240, 310), headContext = headLayer.getContext('2d'); drawHead(headContext, hip);
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
const lateralNeutral = {
  joints: {
    left: { shoulder: { x: 126, y: 112 }, elbow: { x: 126, y: 148 }, wrist: { x: 126, y: 185 }, hand: { x: 126, y: 194 }, hip: { x: 106, y: 191 }, knee: { x: 106, y: 229 }, ankle: { x: 106, y: 263 }, shoeContact: { x: 106, y: 275 } },
    right: { shoulder: { x: 100, y: 112 }, elbow: { x: 100, y: 148 }, wrist: { x: 100, y: 185 }, hand: { x: 100, y: 194 }, hip: { x: 118, y: 191 }, knee: { x: 118, y: 229 }, ankle: { x: 118, y: 263 }, shoeContact: { x: 118, y: 275 } }
  }
};
const neutral = direction === 'east' || direction === 'west' ? lateralNeutral : {
  visibility: targets['03'].visibility,
  joints: Object.fromEntries(['left', 'right'].map(side => {
    const sample = targets['03'].joints[side];
    return [side, { shoulder: { x: sample.shoulder.x, y: 112 }, elbow: { x: sample.elbow.x, y: 150 }, wrist: { x: sample.wrist.x, y: 186 }, hand: { x: sample.hand.x, y: 195 }, hip: { x: sample.hip.x, y: 191 }, knee: { x: sample.hip.x, y: 229 }, ankle: { x: sample.hip.x, y: 263 }, shoeContact: { x: sample.hip.x, y: 275 }, support: true }];
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
  const frontalArmsBehindBody = direction === 'south' || direction === 'north', opaqueLayerOrder = frontalArmsBehindBody ? ['farArm', 'nearArm', 'farLeg', 'nearLeg', 'body', 'head'] : ['farArm', 'farLeg', 'nearLeg', 'body', 'head', 'nearArm'];
  const report = { status: checkpointOnly ? `${direction}-correction-checkpoint` : `${direction}-cycle-review`, source: profile.source, identityHead: profile.identityHead.source, acceptedSolver: direction === 'east' || direction === 'west' ? 'tools/character-mapping/math.mjs#compileLateral' : 'tools/character-mapping/math.mjs#compileNorthSouth', phaseIds, direction, renderPolicy: { opaqueLayerOrder, farArmBehindBothLegs: true, frontalArmsBehindBody, neutralNearArmBehindBody: frontalArmsBehindBody }, headRegistration: { offsetX: profile.targetRegistration.headOffsetX ?? 0, method: 'target hip minus measured source hip plus explicit per-view horizontal fit' }, sourceOrientation: { completeArmLocalTransformByAnatomicalSide: profile.targetRegistration.armSourceOrientationBySide, provenance: 'per-view local source-surface chirality correction; anatomical IDs and watch ownership unchanged' }, armTargetRegistration: { walkingShoulderHeightAboveHip: profile.targetRegistration.walkingShoulderHeightAboveHip, neutralShoulderHeightAboveHip: neutral.joints.left.hip.y - neutral.joints.left.shoulder.y, neutralUsesFixedStandingJointHeights: true }, neutralGeometry: neutral, neutralDiagnostics: renders[`${direction}-neutral`].diagnostics, frames: directionCycle, outputs: { contact: { file: contactFile, sha256: sha(contactSheetBytes) } }, limitations: ['pilot preview assembly requires visual review', 'torso uses one recorded width/height calibration; every complete limb uses one uniform scale', 'shoe region is independently rigid-transformed and overlaps the authored trouser cuff'] };
  writeFileSync(resolve(outputRoot, `${characterSlug}-${direction}-checkpoint.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ contact: resolve(outputRoot, contactFile), phase07SupportLeg: directionCycle['07']?.supportLegStraightness ?? null }, null, 2));
  process.exit(0);
}

const sourceReference = createCanvas(240, 310), sourceContext = sourceReference.getContext('2d');
const originalImage = await loadPinned(profile.identityHead.source), originalEastCrop = createCanvas(240, 340), originalEastContext = originalEastCrop.getContext('2d');
originalEastContext.drawImage(originalImage, 290, 20, 240, 340, 0, 0, 240, 340); keyNeutralBackground(originalEastCrop); sourceContext.drawImage(originalEastCrop, 16, -38);
const sheet = createCanvas(1000, 360), sheetContext = sheet.getContext('2d'); sheetContext.fillStyle = '#17191d'; sheetContext.fillRect(0, 0, sheet.width, sheet.height); sheetContext.fillStyle = '#fff'; sheetContext.font = 'bold 19px sans-serif';
sheetContext.font = 'bold 14px sans-serif';
for (const [index, [label, canvas]] of [['approved original reference', sourceReference], ['neutral + original head', renders.neutral.canvas], ['shared gait · East 01', renders.east01.canvas], ['shared gait · East 03', renders.east03.canvas]].entries()) {
  const x = 10 + index * 247; sheetContext.fillText(label, x, 25); sheetContext.fillStyle = '#eeece6'; sheetContext.fillRect(x, 35, 240, 310); sheetContext.drawImage(canvas, x, 35); sheetContext.fillStyle = '#fff';
}
const sheetBytes = sheet.toBuffer('image/png'); writeFileSync(resolve(outputRoot, 'olive-east-first-review.png'), sheetBytes);

const donorSheet = createCanvas(1000, 360), donorContext = donorSheet.getContext('2d'); donorContext.fillStyle = '#17191d'; donorContext.fillRect(0, 0, donorSheet.width, donorSheet.height); donorContext.fillStyle = '#fff'; donorContext.font = 'bold 18px sans-serif';
for (const [index, name] of ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'].entries()) {
  const x = 10 + index * 247, part = profile.parts[name], target = name.includes('Arm') ? armRig(neutral.joints[name.startsWith('left') ? 'left' : 'right']) : legRig(neutral.joints[name.startsWith('left') ? 'left' : 'right'], part);
  donorContext.fillText(`${name} · scale ${part.normalizationScale}`, x, 25); donorContext.fillStyle = '#eeece6'; donorContext.fillRect(x, 35, 240, 310); donorContext.drawImage(renderSkinnedPart(atlasData, part, target, profile.targetFrame).canvas, x, 35); donorContext.fillStyle = '#fff';
}
const donorBytes = donorSheet.toBuffer('image/png'); writeFileSync(resolve(outputRoot, 'olive-east-normalized-parts.png'), donorBytes);
const report = { status: 'east-cycle-review-required-west-pending', source: profile.source, identityHead: profile.identityHead.source, acceptedSolver: 'tools/character-mapping/math.mjs#compileLateral', phaseIds, directions: ['east', 'west', 'south', 'north'], characters: [{ id: 'reauthored-olive-jacket-pilot', runtimeId: 'patient.adult.033', directions: { east: eastCycle, west: {}, south: {}, north: {} }, static: {} }], alphaKey: { removedPixelCount: keyed.removedPixelCount, defringedPixelCount: keyed.defringedPixelCount, residualMagentaDominantPixels: 0 }, profile: { body: profile.parts.body, limbs: Object.fromEntries(['leftArm', 'rightArm', 'leftLeg', 'rightLeg'].map(name => [name, profile.parts[name]])) }, diagnostics: Object.fromEntries(Object.entries(renders).map(([name, value]) => [name, value.diagnostics])), outputs: { review: { file: 'olive-east-first-review.png', sha256: sha(sheetBytes) }, eastContact: { file: 'olive-east-01-08-contact.png', sha256: sha(eastSheetBytes) }, parts: { file: 'olive-east-normalized-parts.png', sha256: sha(donorBytes) } }, limitations: ['East cycle complete for review; West/North/South not yet claimed', 'torso uses one recorded width/height calibration; every complete limb uses one uniform scale', 'shoe terminal uses measured cuff-to-sole registration; terminal rigidity is not yet claimed'] };
writeFileSync(resolve(outputRoot, 'olive-east-first-checkpoint.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ review: resolve(outputRoot, report.outputs.review.file), parts: resolve(outputRoot, report.outputs.parts.file), alphaKey: report.alphaKey }, null, 2));
