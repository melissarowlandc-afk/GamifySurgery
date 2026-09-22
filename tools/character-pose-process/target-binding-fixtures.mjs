import { ARTIFACT_RELATIVE, ARTIFACT_SHA256, DEPENDENCY_FINGERPRINT, SYNTHETIC_ARTIFACT_RELATIVE, SYNTHETIC_ARTIFACT_SHA256, SYNTHETIC_DEPENDENCY_FINGERPRINT } from './target-binding.mjs';
import { numericDefinitionHash } from './index.mjs';

function source(color) {
  return { kind: 'synthetic-numeric-definition', dimensions: { width: 24, height: 170 }, primitives: [
    { id: 'limb', shape: 'rectangle', x: 8, y: 10, width: 8, height: 146, color, transparency: 0 },
    { id: 'joint-marker', shape: 'rectangle', x: 5, y: 7, width: 14, height: 8, color: 16777215, transparency: 0 },
  ] };
}

function piece(id, side, layerGroup, color, exactLength) {
  const definition = source(color);
  return {
    id, layerGroup, layerWithinGroup: 0,
    source: definition, sourceHash: numericDefinitionHash(definition), sourceHashKind: 'canonical-numeric-definition-sha256',
    crop: { x: 0, y: 0, width: 24, height: 170 }, pivot: { x: 12, y: 10 }, restVector: { x: 0, y: exactLength }, sourceOffset: { x: 0, y: 0 },
    overlap: { proximalPixels: 8, distalPixels: 8 }, anatomy: { side, part: 'upper-arm', lineage: 'synthetic-fixture' },
    proximalRef: `geometry.nativeMaster.joints.${side}.shoulder`, distalRef: `geometry.nativeMaster.joints.${side}.elbow`,
    segmentLength: { frameScalarRef: 'anatomy.segmentLengths.upperArm', roundedNativeScalarRef: 'geometry.nativeMaster.segmentLengths.upperArm' },
  };
}

export function bindingRequest(artifact, outputKey, { bound = true } = {}) {
  const target = artifact.targets.find(value => value.outputKey === outputKey);
  if (!target) throw new Error(`fixture target absent: ${outputKey}`);
  const exactLength = target.anatomy.segmentLengths.upperArm / target.geometry.registration.scale;
  const pieces = bound ? [piece('left-upper-arm', 'left', 'left-far-limbs', 3373055, exactLength), piece('right-upper-arm', 'right', 'right-near-limbs', 14762560, exactLength)] : [];
  return {
    schemaVersion: 1,
    artifact: artifact.artifactClass === 'synthetic-target-fixture' ? { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT } : { path: ARTIFACT_RELATIVE, sha256: ARTIFACT_SHA256, dependencyFingerprint: DEPENDENCY_FINGERPRINT },
    selection: { outputKey: target.outputKey, view: target.view, assetView: target.assetView, phaseId: target.phaseId, phaseIndex: target.phaseIndex, normalizedCycle: target.normalizedCycle, reviewFrameMilliseconds: target.reviewFrameMilliseconds, lineageKind: target.lineage.kind },
    canvas: { width: 448, height: 1024 }, coordinateSystem: 'source448x1024/top-left/x-right/y-down/continuous-pixels', projectionStrategy: 'lateral-rigid-2d',
    output: { prefixStem: `binding-v1-phase${target.phaseId}` }, pieces,
  };
}
