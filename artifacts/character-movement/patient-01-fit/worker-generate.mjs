import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..', '..', '..');
const fitPath = resolve(repositoryRoot, 'docs/features/character-movement/patient-01-fit.json');
const previewPath = resolve(repositoryRoot, 'docs/features/character-movement/patient-01-fitted-walk.html');
const displayPath = 'C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-fitted-walk.html';
const scale = 171 / 893;
const round = value => Number(value.toFixed(4));
const p = (x, y) => ({ x: round(x), y: round(y) });
const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const solveJoint = (a, b, upper, lower, bendForward) => {
  const dx = b.x - a.x, dy = b.y - a.y, span = Math.hypot(dx, dy);
  if (!span || span > upper + lower || span < Math.abs(upper - lower)) throw new Error(`Unreachable target: ${span}`);
  const along = (upper ** 2 - lower ** 2 + span ** 2) / (2 * span);
  const height = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  const base = p(a.x + dx * along / span, a.y + dy * along / span);
  const sign = bendForward ? -1 : 1;
  return p(base.x + sign * (-dy / span) * height, base.y + sign * (dx / span) * height);
};
const pointAlong = (a, b, amount) => {
  const span = distance(a, b);
  return p(a.x + (b.x - a.x) * amount / span, a.y + (b.y - a.y) * amount / span);
};
const extend = (a, b, amount) => {
  const span = distance(a, b);
  return p(b.x + (b.x - a.x) * amount / span, b.y + (b.y - a.y) * amount / span);
};
const reflect = value => p(128 - value.x, value.y);
const toNativePoint = (value, sourceAxisX) => p(sourceAxisX + (value.x - 64) / scale, 941 + (value.y - 181) / scale);
const toNativeTree = (value, sourceAxisX) => {
  if (Array.isArray(value)) return value.map(child => toNativeTree(child, sourceAxisX));
  if (value && typeof value === 'object') {
    if (Number.isFinite(value.x) && Number.isFinite(value.y)) return toNativePoint(value, sourceAxisX);
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, toNativeTree(child, sourceAxisX)]));
  }
  return value;
};

const labels = [
  ['right-stride', 'right stride', 'main', 'Right leg and left arm reach far forward; the opposite limbs reach back.'],
  ['toward-right-passing', 'toward right passing', 'intermediate', 'The right foot settles while the left leg begins to swing through.'],
  ['right-support-passing', 'right support passing', 'main', 'Right leg is straight and planted; left knee is slightly bent; both arms are down.'],
  ['toward-left-stride', 'toward left stride', 'intermediate', 'The left foot reaches forward as the arms begin the opposite swing.'],
  ['left-stride', 'left stride', 'main', 'Left leg and right arm reach far forward; the opposite limbs reach back.'],
  ['toward-left-passing', 'toward left passing', 'intermediate', 'The left foot settles while the right leg begins to swing through.'],
  ['left-support-passing', 'left support passing', 'main', 'Left leg is straight and planted; right knee is slightly bent; both arms are down.'],
  ['toward-right-stride', 'toward right stride', 'intermediate', 'The right foot reaches forward as the cycle returns to the first stride.']
];
const bob = [6, 2, 0, 2, 6, 2, 0, 2];
const rightFootX = [25, 13, 0, -13, -25, -13, 0, 13];
const rightLift = [0, 0, 0, 0, 0, 5, 4, 2];
const leftFootX = [-25, -13, 0, 13, 25, 13, 0, -13];
const leftLift = [0, 5, 4, 2, 0, 0, 0, 0];
const leftWristX = [29, 15, 0, -15, -29, -15, 0, 15];
const rightWristX = [-29, -15, 0, 15, 29, 15, 0, -15];
const wristY = [47, 53, 56, 53, 47, 53, 56, 53];
const supports = [null, null, 'right', null, null, null, 'left', null];
const rig = {
  frame: { width: 128, height: 192, floorEdgeY: 181, axisX: 64 },
  centers: {
    head: { x: 64, y: 31 },
    shoulder: { leftX: 62, rightX: 66, y: 59 },
    hip: { leftX: 64, rightX: 64, y: 116 },
    ankleY: 173
  },
  envelope: { headRadiusX: 19, headRadiusY: 21, torsoShoulderHalfDepth: 14, torsoChestHalfDepth: 15, torsoHipHalfDepth: 12 },
  segmentLengths: { upperArm: 28, forearm: 28, hand: 8, thigh: 29, shin: 28 },
  nativeSegmentLengths: {
    upperArm: round(28 / scale), forearm: round(28 / scale), hand: round(8 / scale),
    thigh: round(29 / scale), shin: round(28 / scale)
  },
  strokeWidths: { arm: 9, leg: 12 },
  bobByPhase: bob,
  nativeBobByPhase: bob.map(value => round(value / scale))
};

const eastFramePhase = index => {
  const phaseBob = bob[index], support = supports[index];
  const makeSide = side => {
    const right = side === 'right';
    const shoulder = p(right ? rig.centers.shoulder.rightX : rig.centers.shoulder.leftX, rig.centers.shoulder.y + phaseBob);
    const hip = p(64, rig.centers.hip.y + phaseBob);
    const lift = (right ? rightLift : leftLift)[index];
    const ankle = p(64 + (right ? rightFootX : leftFootX)[index], rig.centers.ankleY - lift);
    const knee = support === side
      ? pointAlong(hip, ankle, rig.segmentLengths.thigh)
      : solveJoint(hip, ankle, rig.segmentLengths.thigh, rig.segmentLengths.shin, true);
    const wrist = p(shoulder.x + (right ? rightWristX : leftWristX)[index], shoulder.y + wristY[index]);
    const elbow = solveJoint(shoulder, wrist, rig.segmentLengths.upperArm, rig.segmentLengths.forearm, false);
    const hand = extend(shoulder, wrist, rig.segmentLengths.hand);
    const soleY = rig.frame.floorEdgeY - lift;
    return {
      shoulder, elbow, wrist, hand, hip, knee, ankle,
      shoeContact: p(ankle.x, soleY),
      shoeHeel: p(ankle.x - 5, soleY),
      shoeToe: p(ankle.x + 12, soleY),
      footLift: lift,
      support: support === side
    };
  };
  return {
    coordinateSpace: 'frame128x192',
    facing: 'east',
    facingVectorX: 1,
    nearSide: 'right',
    farSide: 'left',
    phaseBob: phaseBob,
    headEnvelope: { center: p(64, 31 + phaseBob), radiusX: 19, radiusY: 21 },
    torso: {
      shoulderBack: p(50, 59 + phaseBob), shoulderFront: p(78, 59 + phaseBob),
      chestBack: p(49, 82 + phaseBob), chestFront: p(79, 82 + phaseBob),
      hipBack: p(52, 116 + phaseBob), hipFront: p(76, 116 + phaseBob)
    },
    joints: { left: makeSide('left'), right: makeSide('right') },
    renderingOrder: ['left-far-limbs', 'torso-and-head', 'right-near-limbs']
  };
};
const westFrameFromEast = east => {
  const map = value => {
    if (Array.isArray(value)) return value.map(map);
    if (value && typeof value === 'object') {
      if (Number.isFinite(value.x) && Number.isFinite(value.y)) return reflect(value);
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, map(child)]));
    }
    return value;
  };
  const west = map(east);
  west.facing = 'west';
  west.facingVectorX = -1;
  west.nearSide = 'left';
  west.farSide = 'right';
  west.renderingOrder = ['right-far-limbs', 'torso-and-head', 'left-near-limbs'];
  return west;
};
const nativeView = (frame, sourceAxisX, view) => {
  const joints = toNativeTree(frame.joints, sourceAxisX);
  for (const side of ['left', 'right']) {
    joints[side].footLift = round(frame.joints[side].footLift / scale);
    joints[side].footLiftUnits = 'source-pixels';
  }
  return {
    coordinateSpace: 'source448x1024', sourceView: view, sourceAxisX,
    floorExclusiveEdgeY: 941, phaseBob: round(frame.phaseBob / scale),
    nearSide: frame.nearSide, farSide: frame.farSide,
    headEnvelope: {
      center: toNativePoint(frame.headEnvelope.center, sourceAxisX),
      radiusX: round(frame.headEnvelope.radiusX / scale),
      radiusY: round(frame.headEnvelope.radiusY / scale)
    },
    torso: toNativeTree(frame.torso, sourceAxisX), joints,
    segmentLengths: rig.nativeSegmentLengths,
    renderingOrder: frame.renderingOrder
  };
};

const phases = labels.map(([id, label, kind, detail], index) => {
  const eastFrame = eastFramePhase(index), westFrame = westFrameFromEast(eastFrame);
  return {
    index: index + 1, id, label, kind, detail, support: supports[index],
    east: { ...eastFrame, nativeMaster: nativeView(eastFrame, 228, 'right-idle-master') },
    west: { ...westFrame, nativeMaster: nativeView(westFrame, 232, 'left-idle-master') }
  };
});

const fit = {
  schemaVersion: 1,
  id: 'patient-01-eight-phase-lateral-fit-v1',
  status: 'numeric_fitting_reference_unaccepted',
  purpose: 'A numeric authoring reference for fitting the accepted MOV-001 gait to Patient 01 proportions.',
  exclusions: ['No private raster pixels are embedded or derived into an output image.', 'This is not final character art, runtime integration, or owner acceptance.'],
  sources: {
    manifest: { path: 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/manifest.json', evidence: 'Patient 01 directional masters and packed frame registration.' },
    eastRightView: {
      path: 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/characters/patient-01/right-idle-master.png',
      sha256: '0452d5fbef808dec3edcd2c71f033c6d71a7cd1b3dc69220f494c86dd80fcff6',
      dimensions: [448, 1024], alphaBBoxExclusive: [129, 48, 326, 941], lastOpaqueRow: 940, independentMaster: true
    },
    westLeftView: {
      path: 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2/characters/patient-01/left-idle-master.png',
      sha256: '85e35c92c93e6631c2838e8f2e53d5b292b4fc919100c5798389128b6d425ee2',
      dimensions: [448, 1024], alphaBBoxExclusive: [130, 49, 334, 941], lastOpaqueRow: 940, independentMaster: true
    }
  },
  observedSilhouette: {
    method: 'Direct original-resolution visual review plus alpha bounds and row/color-range inspection; ranges are approximate unless explicitly marked exact.',
    eastRightView: {
      exactAlphaBBoxExclusive: [129, 48, 326, 941],
      estimatedHeadHairToChinY: [48, 255], estimatedHeadProfileX: [129, 325],
      estimatedTorsoAndJacketCoreY: [260, 605], estimatedJacketAndSleeveX: [129, 294],
      estimatedSleeveAndHandLowerExtentY: [640, 660],
      note: 'The shoulder joint is hidden inside the jacket; the torso hem is separate from the lower sleeve and hand extent.'
    },
    westLeftView: {
      exactAlphaBBoxExclusive: [130, 49, 334, 941],
      estimatedHeadHairToChinY: [49, 263], estimatedHeadProfileX: [130, 334],
      estimatedTorsoAndJacketCoreY: [260, 605], estimatedJacketAndSleeveX: [150, 333],
      estimatedSleeveAndHandLowerExtentY: [640, 660],
      note: 'The shoulder joint is hidden inside the jacket. The independently authored outline and clothing details are asymmetric with the east master.'
    },
    idleShoeObservation: 'The far shoe appears higher than the near shoe in both idle masters. The pixels do not establish a shorter anatomical leg; depth stagger, pose, and occlusion are all plausible.'
  },
  inferredAnatomy: {
    classification: 'estimated_hidden_joint_centers',
    warning: 'Clothing, overlap, and the idle stance occlude shoulder, hip, knee, ankle, and far-limb centers. These are authoring estimates, not recovered anatomy.',
    frameEstimates: {
      headCenter: { value: [64, 31], uncertainty: [3, 3] },
      shoulderCenterY: { value: 59, uncertainty: 3 },
      hipCenterY: { value: 116, uncertainty: 4 },
      standingKneeCenterY: { value: 144.5, uncertainty: 5 },
      standingAnkleCenterY: { value: 173, uncertainty: 3 }
    },
    jointUncertaintyFramePx: { shoulder: 3, elbow: 4, wrist: 3, hand: 3, hip: 4, knee: 5, ankle: 3, shoeContact: 1 },
    jointUncertaintyNativePx: { shoulder: 15.7, elbow: 20.9, wrist: 15.7, hand: 15.7, hip: 20.9, knee: 26.1, ankle: 15.7, shoeContact: 5.2 },
    schematicVisibilityOffsets: {
      shoulderLateralOffsetsFromAxis: { left: -2, right: 2 },
      hips: 'Both anatomical hip centers use the side-view axis x=64.',
      classification: 'Shoulder offsets keep both arm paths visible in the vector study. They are display offsets within the estimated shoulder envelope, not recovered anatomical depth.'
    },
    fitComparison: {
      mappedObservedHeadEnvelopeApprox: { eastRightView: { x: [45, 82.6], y: [10, 49.6] }, westLeftView: { x: [44.5, 83.5], y: [10.2, 51.2] } },
      authoredHeadEnvelopeAtPassing: { x: [45, 83], y: [10, 52] },
      mappedObservedTorsoBottomApproxY: [112, 117], authoredHipCenterY: 116,
      mappedObservedHandLowerExtentApproxY: [123.4, 127.2], authoredPassingArmChain: { shoulderY: 59, elbowY: 87, wristY: 115, handEndY: 123 }
    },
    authoredFixedLengths: rig.segmentLengths,
    identityContract: {
      preserve: ['approved head and face identity', 'head envelope', 'torso depth and height', 'jacket outline and hem scale', 'independent left/right clothing asymmetry'],
      doNotUse: ['per-phase autoscale', 'whole-character raster flip as an authored opposite view', 'joint estimates as claims of anatomical precision']
    }
  },
  registration: {
    targetFrame: [128, 192], targetFloorAnchorEdge: [64, 181],
    commonIsotropicScale: scale, sourceFloorExclusiveEdgeY: 941,
    equation: 'frameX = 64 + (masterX - sourceAxisX) * scale; frameY = 181 + (masterY - 941) * scale',
    inverseEquation: 'masterX = sourceAxisX + (frameX - 64) / scale; masterY = 941 + (frameY - 181) / scale',
    sourceAxisByView: { eastRightView: 228, westLeftView: 232 },
    historicalManifestPackingEvidence: {
      eastRightView: { placement: [45, 10], resizedDimensions: [38, 171], axisRounding: 'x and y rounded independently' },
      westLeftView: { placement: [44, 10], resizedDimensions: [39, 171], axisRounding: 'x and y rounded independently' }
    },
    authoredWalkPolicy: 'Use this stable isotropic fit, per-view source axis, and explicit phase bob for all eight frames; never align or scale a changing silhouette independently.',
    groundPolicy: {
      choice: 'Normalize both anatomical feet to one schematic ground edge at y=181 when planted.',
      reason: 'The idle far-shoe height is depth/pose ambiguous and cannot justify different leg lengths.',
      deferred: 'GS-010 decides whether final raster art retains a constant far-depth offset while preserving equal anatomical segment lengths.'
    },
    boundsAssessment: {
      frameGeometryFits: true, masterCanvasConflict: false,
      note: 'The authored stride uses the transparent side margins of the 448px masters. Final clothed raster extents may be wider and require GS-010 review, but must keep this fixed scale and floor registration.'
    }
  },
  rig,
  reflectionContract: {
    cameraConvention: 'south-side camera',
    eastRightView: { nearAnatomicalSide: 'right', farAnatomicalSide: 'left' },
    westLeftView: { nearAnatomicalSide: 'left', farAnatomicalSide: 'right' },
    labeledJointReflection: {
      rule: 'For this symmetric numeric rig, reflect every x coordinate around frame x=64, preserve anatomical R/L labels and the same phase index, then swap far/near rendering order.',
      phasePermutation: [1, 2, 3, 4, 5, 6, 7, 8],
      scope: 'Canonical gait coordinates only; this does not claim that independently fitted outline pixels or view-specific source registration are mirror-equal.'
    },
    plainRasterFlip: {
      warning: 'A plain raster flip preserves the visually near layer while the opposite camera view changes which anatomical side is near, so its R/L interpretation swaps.',
      symmetricGaitCorrection: 'For the canonical symmetric gait identity, apply a half-cycle phase permutation after the anatomy swap.',
      phasePermutation: { '1': 5, '2': 6, '3': 7, '4': 8, '5': 1, '6': 2, '7': 3, '8': 4 },
      schematicShoulderOffsetCaveat: 'The vector guide separates shoulders by 2px for visibility. After an anatomy swap, these display offsets also swap; validate gait identity from support, foot lift, forward leg, and opposing arm semantics rather than demanding pixel equality.'
    },
    approvedMasterPolicy: 'The approved east and west masters are independently generated and asymmetric; do not assert pixel mirror equivalence or replace either with a whole-character flip.'
  },
  phases
};

const currentPreview = readFileSync(previewPath, 'utf8');
const startMarker = '/*__FIT_DATA_START__*/';
const endMarker = '/*__FIT_DATA_END__*/';
const dataStart = currentPreview.indexOf(startMarker);
const dataEnd = currentPreview.indexOf(endMarker);
if (dataStart < 0 || dataEnd <= dataStart) {
  throw new Error('Preview is missing generated-data markers');
}
const embedded = JSON.stringify({ rig, phases });
const preview = currentPreview.slice(0, dataStart + startMarker.length) + embedded + currentPreview.slice(dataEnd);
writeFileSync(fitPath, JSON.stringify(fit, null, 2) + '\n');
writeFileSync(previewPath, preview);
writeFileSync(displayPath, preview);
console.log(JSON.stringify({ fitPath, previewPath, displayPath, phases: phases.length }));
