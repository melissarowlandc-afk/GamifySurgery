import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..', '..');
const fitPath = resolve(root, 'docs/features/character-movement/patient-01-north-south-fit.json');
const previewPath = resolve(root, 'docs/features/character-movement/patient-01-north-south-walk.html');
const displayPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-north-south-walk.html';
const round = value => Number(value.toFixed(4));
const p3 = (lateral, forward, height) => ({ lateral: round(lateral), forward: round(forward), height: round(height) });
const p2 = (x, y) => ({ x: round(x), y: round(y) });
const scale = 171 / 898;
const floorY = 181;
const axisX = 64;
const shoeRadius = 2.5;

const sub3 = (a, b) => p3(a.lateral - b.lateral, a.forward - b.forward, a.height - b.height);
const add3 = (a, b) => p3(a.lateral + b.lateral, a.forward + b.forward, a.height + b.height);
const mul3 = (a, amount) => p3(a.lateral * amount, a.forward * amount, a.height * amount);
const dot3 = (a, b) => a.lateral * b.lateral + a.forward * b.forward + a.height * b.height;
const length3 = a => Math.hypot(a.lateral, a.forward, a.height);
const distance3 = (a, b) => length3(sub3(b, a));
const unit3 = a => mul3(a, 1 / length3(a));
const solveJoint3 = (start, end, upper, lower, preferred) => {
  const delta = sub3(end, start), span = length3(delta);
  if (!span || span > upper + lower + 1e-3 || span < Math.abs(upper - lower) - 1e-3) throw new Error(`Unreachable 3D target ${span}`);
  const u = unit3(delta);
  const along = (upper ** 2 - lower ** 2 + span ** 2) / (2 * span);
  const radius = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  let perpendicular = sub3(preferred, mul3(u, dot3(preferred, u)));
  if (length3(perpendicular) < 1e-7) perpendicular = p3(0, 1, 0);
  perpendicular = unit3(perpendicular);
  return add3(add3(start, mul3(u, along)), mul3(perpendicular, radius));
};
const extend3 = (start, end, length) => add3(end, mul3(unit3(sub3(end, start)), length));
const mapTree = (value, pointMap) => {
  if (Array.isArray(value)) return value.map(child => mapTree(child, pointMap));
  if (value && typeof value === 'object') {
    if (Number.isFinite(value.lateral) && Number.isFinite(value.forward) && Number.isFinite(value.height)) return pointMap(value);
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, mapTree(child, pointMap)]));
  }
  return value;
};

const phaseLabels = [
  ['right-stride', 'right stride', 'main', 'Right leg and left arm reach forward in depth; the opposite limbs recover behind.'],
  ['toward-right-passing', 'toward right passing', 'intermediate', 'The right foot settles while the left knee begins its lifted forward recovery.'],
  ['right-support-passing', 'right support passing', 'main', 'Right leg is straight and planted; left knee is bent in passing; both arms hang down.'],
  ['toward-left-stride', 'toward left stride', 'intermediate', 'The left foot and right arm open into the opposite stride.'],
  ['left-stride', 'left stride', 'main', 'Left leg and right arm reach forward in depth; the opposite limbs recover behind.'],
  ['toward-left-passing', 'toward left passing', 'intermediate', 'The left foot settles while the right knee begins its lifted forward recovery.'],
  ['left-support-passing', 'left support passing', 'main', 'Left leg is straight and planted; right knee is bent in passing; both arms hang down.'],
  ['toward-right-stride', 'toward right stride', 'intermediate', 'The right foot and left arm open as the cycle returns to the first stride.']
];
const forwardByRight = [24, 12, 0, -12, -24, -12, 0, 12];
const forwardByLeft = forwardByRight.map((_, index) => forwardByRight[(index + 4) % 8]);
const liftByRight = [0, 0, 0, 0, 0, 3, 5, 2];
const liftByLeft = liftByRight.map((_, index) => liftByRight[(index + 4) % 8]);
const armForwardByLeft = [22, 11, 0, -11, -22, -11, 0, 11];
const armForwardByRight = armForwardByLeft.map((_, index) => armForwardByLeft[(index + 4) % 8]);
const supportByPhase = [null, null, 'right', null, null, null, 'left', null];
const hipHeightByPhase = forwardByRight.map((forward, index) => {
  if (index === 2 || index === 6) return 74;
  return round(8 + Math.sqrt(66 ** 2 - forward ** 2));
});

const rig = {
  frame: { width: 128, height: 192, axisX, bodyGroundOrigin: [64, 181], bottomEdgeY: 192 },
  latentCoordinateSystem: { lateral: 'anatomical right is positive', forward: 'direction the character faces is positive', height: 'up from the authored ground plane is positive', units: 'frame authoring units before projection' },
  segmentLengths3D: { thigh: 34, shin: 32, upperArm: 32, forearm: 31, hand: 9 },
  lanes: { right: 10, left: -10, note: 'Hip, ankle and foot center stay in these fixed anatomical lanes. Knee lateral flexion cue stays below one frame unit.' },
  body: { shoulderHeightAboveHip: 65, headHeightAboveHip: 95, shoulderHalfWidth: 20, wristHalfWidth: 25, hipHalfWidth: 10, torsoShoulderHalfWidth: 23, torsoChestHalfWidth: 25, torsoHipHalfWidth: 18, headRadiusLateral: 18, headRadiusHeight: 25 },
  projection: { verticalScale: 0.88, depthScale: 0.22, lateralScale: 1, classification: 'stylized orthographic authoring projection, not camera-calibrated' },
  foot: { ankleHeight: 8, contactForwardOffset: 2, heelForwardOffset: -4, toeForwardOffset: 8, heelHalfWidth: 5, toeHalfWidth: 8, shoeStrokeWidth: 5, renderedCenterInset: shoeRadius, observedRegisteredShoeWidthApprox: [19, 21] },
  hipHeightByPhase,
  phaseBobFromLowest: hipHeightByPhase.map(value => round(value - Math.min(...hipHeightByPhase)))
};

const makeLatentSide = (side, index) => {
  const sign = side === 'right' ? 1 : -1;
  const lane = sign * rig.lanes.right;
  const footForward = (side === 'right' ? forwardByRight : forwardByLeft)[index];
  const footLift = (side === 'right' ? liftByRight : liftByLeft)[index];
  const hipHeight = hipHeightByPhase[index];
  const hip = p3(lane, 0, hipHeight);
  const ankle = p3(lane, footForward, rig.foot.ankleHeight + footLift);
  const support = supportByPhase[index] === side;
  const knee = support
    ? add3(hip, mul3(unit3(sub3(ankle, hip)), rig.segmentLengths3D.thigh))
    : solveJoint3(hip, ankle, rig.segmentLengths3D.thigh, rig.segmentLengths3D.shin, p3(-sign * 0.055, 1, 0));
  const shoulder = p3(sign * rig.body.shoulderHalfWidth, 0, hipHeight + rig.body.shoulderHeightAboveHip);
  const armForward = (side === 'right' ? armForwardByRight : armForwardByLeft)[index];
  const wristSpan = [61, 61.5, 63, 61.5, 61, 61.5, 63, 61.5][index];
  const lateralDelta = sign * (rig.body.wristHalfWidth - rig.body.shoulderHalfWidth);
  const verticalDrop = Math.sqrt(wristSpan ** 2 - armForward ** 2 - lateralDelta ** 2);
  const wrist = p3(sign * rig.body.wristHalfWidth, armForward, shoulder.height - verticalDrop);
  const elbow = solveJoint3(shoulder, wrist, rig.segmentLengths3D.upperArm, rig.segmentLengths3D.forearm, p3(sign * 0.35, -Math.sign(armForward || 1), -0.1));
  const hand = extend3(shoulder, wrist, rig.segmentLengths3D.hand);
  const contact = p3(lane, footForward + rig.foot.contactForwardOffset, footLift);
  const heel = p3(lane, footForward + rig.foot.heelForwardOffset, footLift + (footLift ? 1 : 0));
  const toe = p3(lane, footForward + rig.foot.toeForwardOffset, footLift + (footLift ? 3 : 0));
  return { shoulder, elbow, wrist, hand, hip, knee, ankle, contact, heel, toe, footLift, support };
};

const latentPhase = index => {
  const hipHeight = hipHeightByPhase[index];
  return {
    coordinateSpace: 'latent3D-frame-authoring-units', phaseBob: rig.phaseBobFromLowest[index],
    body: {
      axisBottom: p3(0, 0, hipHeight), shoulderCenter: p3(0, 0, hipHeight + 65), headCenter: p3(0, 0, hipHeight + 95),
      torso: [p3(-23, 0, hipHeight + 65), p3(-25, 0, hipHeight + 37), p3(-18, 0, hipHeight), p3(18, 0, hipHeight), p3(25, 0, hipHeight + 37), p3(23, 0, hipHeight + 65)]
    },
    joints: { left: makeLatentSide('left', index), right: makeLatentSide('right', index) }
  };
};

const projectionFor = facing => {
  const south = facing === 'south';
  return point => p2(axisX + (south ? -point.lateral : point.lateral), floorY - rig.projection.verticalScale * point.height + (south ? 1 : -1) * rig.projection.depthScale * point.forward);
};
const toNativePoint = (point, sourceAxis) => p2(sourceAxis + (point.x - 64) / scale, 941 + (point.y - 181) / scale);
const toNativeTree = (value, sourceAxis) => {
  if (Array.isArray(value)) return value.map(child => toNativeTree(child, sourceAxis));
  if (value && typeof value === 'object') {
    if (Number.isFinite(value.x) && Number.isFinite(value.y)) return toNativePoint(value, sourceAxis);
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, toNativeTree(child, sourceAxis)]));
  }
  return value;
};

const viewFor = (latent, facing) => {
  const project = projectionFor(facing);
  const sourceAxis = facing === 'south' ? 238 : 238.5;
  const joints = {};
  for (const side of ['left', 'right']) {
    const source = latent.joints[side];
    const projected = mapTree(source, project);
    delete projected.footLift;
    const groundPoint = key => project(p3(source[key].lateral, source[key].forward, 0));
    joints[side] = {
      ...projected,
      renderContact: p2(projected.contact.x, projected.contact.y - shoeRadius),
      renderHeel: p2(projected.heel.x, projected.heel.y - shoeRadius),
      renderToe: p2(projected.toe.x, projected.toe.y - shoeRadius),
      projectedGround: { contact: groundPoint('contact'), heel: groundPoint('heel'), toe: groundPoint('toe') },
      latentFootLift: source.footLift,
      footLift: round(rig.projection.verticalScale * source.footLift),
      footLiftUnits: 'frame-pixels-upward',
      projectedFootLiftY: round(rig.projection.verticalScale * source.footLift),
      projectedFootLiftYUnits: 'frame-pixels-upward', support: source.support
    };
  }
  const bodyProjected = mapTree(latent.body, project);
  const body = {
    ...bodyProjected,
    shoulderY: project(latent.body.shoulderCenter).y,
    headEnvelope: { center: project(latent.body.headCenter), radiusX: rig.body.headRadiusLateral, radiusY: round(rig.body.headRadiusHeight * rig.projection.verticalScale) }
  };
  const cameraDepth = side => {
    const source = latent.joints[side];
    const multiplier = facing === 'south' ? 1 : -1;
    return { leg: round(multiplier * (source.knee.forward + source.ankle.forward) / 2), arm: round(multiplier * (source.elbow.forward + source.wrist.forward) / 2) };
  };
  const depths = { left: cameraDepth('left'), right: cameraDepth('right') };
  const order = kind => ['left', 'right'].sort((a, b) => depths[a][kind] - depths[b][kind]);
  const frame = { coordinateSpace: 'frame128x192', body, joints };
  const nativeBody = toNativeTree(body, sourceAxis);
  nativeBody.shoulderY = round(941 + (body.shoulderY - 181) / scale);
  nativeBody.headEnvelope.radiusX = round(body.headEnvelope.radiusX / scale);
  nativeBody.headEnvelope.radiusY = round(body.headEnvelope.radiusY / scale);
  const nativeJoints = toNativeTree(joints, sourceAxis);
  for (const side of ['left', 'right']) {
    delete nativeJoints[side].footLift;
    delete nativeJoints[side].footLiftUnits;
    delete nativeJoints[side].projectedFootLiftY;
    delete nativeJoints[side].projectedFootLiftYUnits;
    nativeJoints[side].latentFootLift = latent.joints[side].footLift;
    nativeJoints[side].latentFootLiftUnits = 'latent-frame-authoring-units';
    nativeJoints[side].footLift = round(frame.joints[side].footLift / scale);
    nativeJoints[side].footLiftUnits = 'source-pixels-upward';
    nativeJoints[side].projectedFootLiftY = round(frame.joints[side].projectedFootLiftY / scale);
    nativeJoints[side].projectedFootLiftYUnits = 'source-pixels-upward';
  }
  const nativeMaster = {
    coordinateSpace: 'source448x1024-via-fixed-frame-projection', sourceAxisX: sourceAxis, floorExclusiveEdgeY: 941,
    projectionDependent: true, body: nativeBody, joints: nativeJoints,
    projectedUpwardBobSourcePixels: round(rig.projection.verticalScale * latent.phaseBob / scale),
    note: 'These are explicit inverse-registered projected authoring points. Latent lengths remain in latent units and are not multiplied into claims of measured PNG anatomy.'
  };
  return {
    facing, anatomicalRightScreenSide: facing === 'south' ? 'left' : 'right', sourceAxisX: sourceAxis,
    projection: { ...rig.projection, depthSign: facing === 'south' ? 1 : -1 }, latent, frame, nativeMaster,
    visibility: { depthScores: depths, legsFarToNear: order('leg'), armsFarToNear: order('arm') }
  };
};

const phases = phaseLabels.map(([id, label, kind, detail], index) => {
  const latent = latentPhase(index);
  return { index: index + 1, id, label, kind, detail, support: supportByPhase[index], south: viewFor(latent, 'south'), north: viewFor(latent, 'north') };
});

const fit = {
  schemaVersion: 1,
  id: 'patient-01-eight-phase-north-south-fit-v1',
  status: 'numeric_fitting_reference_unaccepted',
  purpose: 'A bounded numeric and vector authoring reference for natural Patient 01 north/back and south/front eight-pose walking under MOV-003.',
  exclusions: ['No private raster pixels are embedded, copied, or converted into derivative raster art.', 'This reference is not final character art, runtime integration, a generalized rig engine, or owner acceptance.'],
  sources: {
    manifest: { path: 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/manifest.json', evidence: 'Patient 01 independently authored front/back masters and packed-frame registration.' },
    southFront: { path: 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/characters/patient-01/standing-master.png', sha256: 'ed1e2e6a5b425081f8f237e8793107e66c9caf5f72117a88c432f90d9c941166', dimensions: [448, 1024], alphaBBoxExclusive: [71, 43, 405, 941], lastOpaqueRow: 940, independentMaster: true },
    northBack: { path: 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/characters/patient-01/back-idle-master.png', sha256: '9345fc8de8466010ea82008d9c0ddd84664a9b8807c79a15e913e880dbd73511', dimensions: [448, 1024], alphaBBoxExclusive: [68, 43, 409, 941], lastOpaqueRow: 940, independentMaster: true }
  },
  observedSilhouette: {
    method: 'Original-resolution visual inspection plus exact alpha bounds; ranges below are visual estimates unless marked exact.',
    southFront: { exactAlphaBBoxExclusive: [71, 43, 405, 941], estimatedHairToChinY: [43, 278], estimatedHeadWidthAtY120: 181, estimatedJacketHemY: [605, 620], estimatedHandLowerExtentY: [645, 665], estimatedCombinedTrouserWidthAtY660: [199, 203] },
    northBack: { exactAlphaBBoxExclusive: [68, 43, 409, 941], estimatedHairToNapeY: [43, 262], estimatedHeadWidthAtY120: 184, estimatedJacketHemY: [605, 620], estimatedHandLowerExtentY: [645, 665], estimatedCombinedTrouserWidthAtY660: [199, 203] },
    classification: 'Observed silhouette evidence includes clothing and overlap. It does not expose exact shoulder, hip, knee, ankle, elbow, or wrist centers.'
  },
  inferredFit: {
    classification: 'estimated hidden joint centers and projection choices',
    latentLandmarks: { headCenterHeight: 'hip height + 95', shoulderCenterHeight: 'hip height + 65', hipCenterHeightByPhase: hipHeightByPhase, anatomicalHipLanes: { left: -10, right: 10 }, anatomicalShoulderLanes: { left: -20, right: 20 } },
    projectedFrameLandmarks: { headCenterX: 64, headCenterYRange: [32.28, 36.2561], shoulderCenterX: 64, shoulderCenterYRange: [58.68, 62.6561], hipCenterX: 64, hipCenterYRange: [115.88, 119.8561], note: 'Ranges are signed frame y after 0.88 vertical projection; lower y is visually higher.' },
    jointUncertaintyFramePx: { headCenter: 3, shoulder: 4, elbow: 5, wrist: 4, hand: 4, hip: 4, knee: 6, ankle: 4, shoeContact: 2 },
    authoredSegmentWarning: 'The fixed latent lengths are fitted authoring values, not direct measurements of PNG bones. Their 2D projections foreshorten with depth.',
    clothingWidthTreatment: 'Wrist lanes stay at anatomical ±25 while shoulders stay at ±20, giving a constant outward rest angle and a clothed arm envelope near ±30 with stroke. This standing width does not oscillate by phase.',
    identityContract: { preserve: ['approved front face and back-of-head identity', 'head scale and envelope', 'torso/jacket width, hem and scale', 'independently authored front/back outline and clothing asymmetry'], avoid: ['whole-character raster flips', 'per-phase autoscale or recentering', 'periodic torso sway', 'periodic foot-lane splay'] }
  },
  registration: {
    targetFrame: [128, 192], bodyGroundOrigin: [64, 181], commonIsotropicScale: scale, sourceFloorExclusiveEdgeY: 941,
    equation: 'frameX = 64 + (masterX - sourceAxisX) * scale; frameY = 181 + (masterY - 941) * scale. This preserves each independent source view without mirroring; anatomical screen-side signs belong only to latent projection.',
    inverseProjectedEquation: 'masterX = sourceAxisX + (frameX - 64) / scale; masterY = 941 + (frameY - 181) / scale.',
    sourceAxisByView: { southFront: 238, northBack: 238.5 },
    historicalManifestPackingEvidence: { southFront: { placement: [32, 10], resizedDimensions: [64, 171] }, northBack: { placement: [31, 10], resizedDimensions: [65, 171] } },
    stableTransformPolicy: 'All phases share this scale, source floor and per-view axis. The body center x is fixed; only intentional vertical bob changes.',
    groundPolicy: 'The latent ground is one plane. Fore/aft position projects each planted heel/toe to a different screen y. Frame point (64,181) is the body ground origin, not a forced sole row. Rendered sole centers are inset by half the 5px stroke so their lower edge meets the projected contact edge; 10px heel and 16px toe caps plus round stroke fit the observed 19–21px registered shoe width.',
    boundsAssessment: 'All authored projected joints and stroked shoe centers remain inside 128×192. Final clothed silhouettes require GS-010 art review at the same stable transform.'
  },
  gaitContract: {
    anatomicalPhaseIdentity: { 1: 'right leg and left arm forward', 2: 'intermediate toward right support', 3: 'right support straight; left passing bent; arms down', 4: 'intermediate toward left stride', 5: 'left leg and right arm forward', 6: 'intermediate toward left support', 7: 'left support straight; right passing bent; arms down', 8: 'intermediate returning to right stride' },
    cameraConvention: { south: 'front view; anatomical right is screen-left', north: 'back view; anatomical right is screen-right' },
    projectionCaveat: 'The same fixed-length latent gait is independently projected into front and back views. This is a symmetric gait identity rule, not a claim that approved front/back raster pixels are mirror-equal.',
    noSwayPolicy: 'Body axis, head center x, torso widths, hip lanes and foot lanes remain fixed. Sub-one-pixel knee lateral offsets occur only while flexed to separate the bend silhouette.'
  },
  rig,
  phases
};

const source = readFileSync(previewPath, 'utf8');
const start = '/*__FIT_DATA_START__*/', end = '/*__FIT_DATA_END__*/';
const i = source.indexOf(start), j = source.indexOf(end);
if (i < 0 || j <= i) throw new Error('Literal preview is missing data markers');
const payload = JSON.stringify({ rig, phases });
const preview = source.slice(0, i + start.length) + payload + source.slice(j);
writeFileSync(fitPath, JSON.stringify(fit, null, 2) + '\n');
writeFileSync(previewPath, preview);
writeFileSync(displayPath, preview);
console.log(JSON.stringify({ fitPath, previewPath, displayPath, phases: phases.length }));
