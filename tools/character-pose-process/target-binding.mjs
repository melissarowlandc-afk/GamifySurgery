import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { CANVAS, ROUNDING, canonicalJson, numericDefinitionHash, roundPlacement, validateGraph } from './index.mjs';

export const ARTIFACT_RELATIVE = 'artifacts/character-movement/mapping-pipeline/parent-runs/mixed-20260910-patient-01/5da58c99ef43e60b192fd8b2e71ab5eea7a27701ea262a66684e1b7635f37dda/targets.json';
export const ARTIFACT_SHA256 = 'f5c016d0575d0e22d0a6cbed5c12707b55076864a892924a3fa3ae169564f05c';
export const DEPENDENCY_FINGERPRINT = '5da58c99ef43e60b192fd8b2e71ab5eea7a27701ea262a66684e1b7635f37dda';
export const COMPILER_CODE_FINGERPRINT = 'e2061adf31ca3e02a345cf8fa8c827591ad1881be23f8b3550df771c93824aa3';
export const SYNTHETIC_ARTIFACT_RELATIVE = 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/pose-process-proof-v1/binding-v1/synthetic-target-artifact.json';
export const SYNTHETIC_ARTIFACT_SHA256 = 'f27472449b4da40c0d45183c4e5b60a9adc2c4c180f5899f09d33a585e640df4';
export const SYNTHETIC_DEPENDENCY_FINGERPRINT = '35253b1aa620edc5eed7f867c95e6bbdafa135c52a4a8a78337f5a10de8e0111';
export const V2_MANIFEST_RELATIVE = 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/pose-process-proof-v1/binding-v2/compiler-artifact-manifest.json';
export const V2_MANIFEST_SHA256 = '20f12a7349ea1c1cadc28ed907e7ee81162fc57d01edaa3df6cdd316d4324a6c';
export const SCHEMA_SHA256 = '3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a';
const VIEW_ASSET = Object.freeze({ east: 'right', west: 'left', south: 'front', north: 'back' });
const LATERAL = new Set(['east', 'west']);
const SHA = /^[a-f0-9]{64}$/;
const ID = /^[a-z0-9][a-z0-9_-]*$/;
const REF = /^geometry[.]nativeMaster[.]joints[.](?:left|right)[.](?:shoulder|elbow|wrist|hip|knee|ankle)$/;
const PRIVATE = /(?:resident:|privateRef|private[_-]?asset|production-foundation|Photos for Codex)/i;
const verifiedArtifacts = new WeakMap(), authenticatedBindings = new WeakMap();
function verifiedArtifact(value, pin, kind = 'legacy') { verifiedArtifacts.set(value, { contentHash: hashBytes(Buffer.from(canonicalJson(value))), pin, kind }); return value; }
function authenticated(value) { authenticatedBindings.set(value, hashBytes(Buffer.from(canonicalJson(value)))); return value; }

function fail(message) { throw new Error(message); }
function plain(value) { return value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; }
function exact(value, keys, label) { if (!plain(value) || canonicalJson(Object.keys(value).sort()) !== canonicalJson([...keys].sort())) fail(`${label} fields invalid`); }
function finite(value, label) { if (!Number.isFinite(value)) fail(`${label} must be finite`); }
function integer(value, label, min, max) { if (!Number.isInteger(value) || value < min || value > max) fail(`${label} invalid`); }
function point(value, label) { exact(value, ['x', 'y'], label); finite(value.x, `${label}.x`); finite(value.y, `${label}.y`); }
function rejectPrivate(value, label = 'value') { if (typeof value === 'string' && PRIVATE.test(value)) fail(`${label} contains unsupported private/image reference`); if (Array.isArray(value)) value.forEach((entry, index) => rejectPrivate(entry, `${label}[${index}]`)); else if (plain(value)) for (const [key, entry] of Object.entries(value)) { if (PRIVATE.test(key)) fail(`${label}.${key} is a private field`); rejectPrivate(entry, `${label}.${key}`); } }
export const hashBytes = bytes => createHash('sha256').update(bytes).digest('hex');

export function assertNoLinkedPath(path, root, { mustExist = true } = {}) {
  const absolute = resolve(path), base = resolve(root);
  if (isAbsolute(relative(base, absolute)) || relative(base, absolute).startsWith('..')) fail(`path escapes root: ${absolute}`);
  let current = absolute;
  while (true) {
    try { const stat = lstatSync(current); if (stat.isSymbolicLink()) fail(`linked path refused: ${current}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; if (current === absolute && mustExist) throw error; }
    if (current === base) break;
    const parent = dirname(current); if (parent === current) fail('path root not reached'); current = parent;
  }
  if (mustExist && realpathSync.native(absolute) !== absolute) fail(`redirected path refused: ${absolute}`);
  return absolute;
}

export function loadPinnedArtifact(repoRoot) {
  const path = assertNoLinkedPath(resolve(repoRoot, ARTIFACT_RELATIVE), repoRoot);
  const bytes = readFileSync(path);
  if (hashBytes(bytes) !== ARTIFACT_SHA256) fail('target artifact byte hash mismatch');
  const artifact = JSON.parse(bytes);
  if (artifact.dependencyFingerprint !== DEPENDENCY_FINGERPRINT || artifact.dependencies?.codeFingerprint !== COMPILER_CODE_FINGERPRINT) fail('target dependency fingerprint mismatch');
  if (!Array.isArray(artifact.targets) || artifact.targets.length !== 32 || new Set(artifact.targets.map(target => target.outputKey)).size !== 32) fail('target artifact cardinality/keys invalid');
  return { path, bytes, artifact: verifiedArtifact(artifact, { path: ARTIFACT_RELATIVE, sha256: ARTIFACT_SHA256, dependencyFingerprint: DEPENDENCY_FINGERPRINT }) };
}

export function loadBindingArtifact(repoRoot, pin) {
  exact(pin, ['path', 'sha256', 'dependencyFingerprint'], 'artifact pin');
  const expected = pin.path === ARTIFACT_RELATIVE ? [ARTIFACT_SHA256, DEPENDENCY_FINGERPRINT] : pin.path === SYNTHETIC_ARTIFACT_RELATIVE ? [SYNTHETIC_ARTIFACT_SHA256, SYNTHETIC_DEPENDENCY_FINGERPRINT] : fail('artifact path is not pinned');
  if (pin.sha256 !== expected[0] || pin.dependencyFingerprint !== expected[1]) fail('artifact request pin mismatch');
  const path = assertNoLinkedPath(resolve(repoRoot, pin.path), repoRoot); const bytes = readFileSync(path); if (hashBytes(bytes) !== expected[0]) fail('target artifact byte hash mismatch'); const artifact = JSON.parse(bytes);
  if (artifact.dependencyFingerprint !== expected[1]) fail('target dependency fingerprint mismatch');
  if (!Array.isArray(artifact.targets) || !artifact.targets.length || new Set(artifact.targets.map(target => target.outputKey)).size !== artifact.targets.length) fail('target artifact cardinality/keys invalid');
  if (pin.path === SYNTHETIC_ARTIFACT_RELATIVE && (artifact.parentArtifact?.sha256 !== ARTIFACT_SHA256 || artifact.parentArtifact?.dependencyFingerprint !== DEPENDENCY_FINGERPRINT || artifact.parentArtifact?.compilerCodeFingerprint !== COMPILER_CODE_FINGERPRINT || artifact.subset?.targetCount !== 2 || artifact.subset?.viewCount !== 1)) fail('synthetic artifact parent/subset pin mismatch');
  return { path, bytes, artifact: verifiedArtifact(artifact, { ...pin }) };
}

export function loadBindingV2Artifact(repoRoot, fixtureId) {
  if (!['baseline', 'ratio', 'registration'].includes(fixtureId)) fail('unknown binding-v2 fixture');
  const manifestPath = assertNoLinkedPath(resolve(repoRoot, V2_MANIFEST_RELATIVE), repoRoot), manifestBytes = readFileSync(manifestPath); if (hashBytes(manifestBytes) !== V2_MANIFEST_SHA256) fail('binding-v2 manifest byte hash mismatch'); const manifest = JSON.parse(manifestBytes); if (manifest.compilerCodeFingerprint !== COMPILER_CODE_FINGERPRINT) fail('binding-v2 compiler fingerprint mismatch');
  const record = manifest.fixtures.find(value => value.fixtureId === fixtureId); if (!record || record.targetCount !== 32 || record.compilerCodeFingerprint !== COMPILER_CODE_FINGERPRINT) fail('binding-v2 manifest record invalid'); const path = assertNoLinkedPath(resolve(repoRoot, record.artifactPath), repoRoot), bytes = readFileSync(path); if (hashBytes(bytes) !== record.artifactSha256) fail('binding-v2 artifact byte hash mismatch'); const artifact = JSON.parse(bytes); if (artifact.dependencyFingerprint !== record.dependencyFingerprint || artifact.dependencies.codeFingerprint !== COMPILER_CODE_FINGERPRINT || artifact.targets.length !== 32) fail('binding-v2 artifact dependency mismatch'); const pin = { path: record.artifactPath, sha256: record.artifactSha256, dependencyFingerprint: record.dependencyFingerprint }; return { path, bytes, artifact: verifiedArtifact(artifact, pin, 'binding-v2-synthetic'), pin, record };
}

function expectedGroupFor(target, side) { return target.geometry.farSide === side ? `${side}-far-limbs` : target.geometry.nearSide === side ? `${side}-near-limbs` : null; }

function atPath(value, path) {
  if (!REF.test(path)) fail(`unsafe endpoint reference ${path}`);
  let current = value; for (const part of path.split('.')) { if (!plain(current) || !Object.hasOwn(current, part)) fail(`missing endpoint reference ${path}`); current = current[part]; }
  point(current, path); return { x: current.x, y: current.y };
}
function rotate(pointValue, center, degrees) { const a = degrees * Math.PI / 180, dx = pointValue.x - center.x, dy = pointValue.y - center.y; return { x: center.x + Math.cos(a) * dx - Math.sin(a) * dy, y: center.y + Math.sin(a) * dx + Math.cos(a) * dy }; }
function tightTolerance(scale) { return Math.SQRT2 * 0.0001 / scale + Math.SQRT2 * 0.0001; }
function validatePrimitive(value, dimensions, label) { exact(value, ['id', 'shape', 'x', 'y', 'width', 'height', 'color', 'transparency'], label); if (!ID.test(value.id) || value.shape !== 'rectangle') fail(`${label} identity/shape invalid`); for (const key of ['x', 'y']) integer(value[key], `${label}.${key}`, 0, 16384); for (const key of ['width', 'height']) integer(value[key], `${label}.${key}`, 1, 16384); if (value.x + value.width > dimensions.width || value.y + value.height > dimensions.height) fail(`${label} exceeds source`); integer(value.color, `${label}.color`, 0, 16777215); finite(value.transparency, `${label}.transparency`); if (value.transparency < 0 || value.transparency > 1) fail(`${label}.transparency invalid`); }

function validatePiece(piece, index, target) {
  const label = `pieces[${index}]`;
  exact(piece, ['id', 'layerGroup', 'layerWithinGroup', 'source', 'sourceHash', 'sourceHashKind', 'crop', 'pivot', 'restVector', 'sourceOffset', 'overlap', 'anatomy', 'proximalRef', 'distalRef', 'segmentLength'], label);
  if (!ID.test(piece.id)) fail(`${label}.id invalid`);
  if (piece.layerGroup !== 'target-derived' && !target.geometry.renderingOrder.includes(piece.layerGroup)) fail(`${label}.layerGroup not in target renderingOrder`);
  integer(piece.layerWithinGroup, `${label}.layerWithinGroup`, 0, 99);
  exact(piece.source, ['kind', 'dimensions', 'primitives'], `${label}.source`); if (piece.source.kind !== 'synthetic-numeric-definition') fail(`${label} source kind unsupported`);
  exact(piece.source.dimensions, ['width', 'height'], `${label}.source.dimensions`); integer(piece.source.dimensions.width, `${label}.source.width`, 1, 16384); integer(piece.source.dimensions.height, `${label}.source.height`, 1, 16384);
  if (!Array.isArray(piece.source.primitives) || !piece.source.primitives.length) fail(`${label}.source.primitives empty`); const primitiveIds = new Set(); piece.source.primitives.forEach((value, i) => { validatePrimitive(value, piece.source.dimensions, `${label}.source.primitives[${i}]`); if (primitiveIds.has(value.id)) fail(`${label} duplicate primitive id`); primitiveIds.add(value.id); });
  if (piece.sourceHashKind !== 'canonical-numeric-definition-sha256' || piece.sourceHash !== numericDefinitionHash(piece.source)) fail(`${label} source hash mismatch`);
  exact(piece.crop, ['x', 'y', 'width', 'height'], `${label}.crop`); if (piece.crop.x !== 0 || piece.crop.y !== 0 || piece.crop.width !== piece.source.dimensions.width || piece.crop.height !== piece.source.dimensions.height) fail(`${label} procedural crop must be full source`);
  point(piece.pivot, `${label}.pivot`); if (piece.pivot.x < 0 || piece.pivot.x > piece.crop.width || piece.pivot.y < 0 || piece.pivot.y > piece.crop.height) fail(`${label}.pivot outside crop`); point(piece.restVector, `${label}.restVector`); point(piece.sourceOffset, `${label}.sourceOffset`); if (piece.sourceOffset.x !== 0 || piece.sourceOffset.y !== 0) fail(`${label}.sourceOffset must be zero`);
  exact(piece.overlap, ['proximalPixels', 'distalPixels'], `${label}.overlap`); integer(piece.overlap.proximalPixels, `${label}.overlap.proximalPixels`, 0, 16384); integer(piece.overlap.distalPixels, `${label}.overlap.distalPixels`, 0, 16384);
  exact(piece.anatomy, ['side', 'part', 'lineage'], `${label}.anatomy`); if (!['left', 'right', 'none'].includes(piece.anatomy.side) || !ID.test(piece.anatomy.part) || piece.anatomy.lineage !== 'synthetic-fixture') fail(`${label}.anatomy invalid`);
  if (!REF.test(piece.proximalRef) || !REF.test(piece.distalRef) || piece.proximalRef === piece.distalRef) fail(`${label} endpoint refs invalid`);
  exact(piece.segmentLength, ['frameScalarRef', 'roundedNativeScalarRef'], `${label}.segmentLength`);
  if (!/^anatomy[.]segmentLengths[.](?:upperArm|forearm|thigh|shin)$/.test(piece.segmentLength.frameScalarRef)) fail(`${label}.frameScalarRef invalid`);
  if (!/^geometry[.]nativeMaster[.]segmentLengths[.](?:upperArm|forearm|thigh|shin)$/.test(piece.segmentLength.roundedNativeScalarRef)) fail(`${label}.roundedNativeScalarRef invalid`);
  const expected = { 'upper-arm': ['shoulder', 'elbow', 'upperArm'], forearm: ['elbow', 'wrist', 'forearm'], thigh: ['hip', 'knee', 'thigh'], shin: ['knee', 'ankle', 'shin'] }[piece.anatomy.part]; if (!expected) fail(`${label}.anatomy.part unsupported`);
  const prefix = `geometry.nativeMaster.joints.${piece.anatomy.side}.`; if (piece.proximalRef !== prefix + expected[0] || piece.distalRef !== prefix + expected[1] || !piece.segmentLength.frameScalarRef.endsWith(`.${expected[2]}`) || !piece.segmentLength.roundedNativeScalarRef.endsWith(`.${expected[2]}`)) fail(`${label} anatomy/endpoints/segment scalar mismatch`);
  const expectedGroup = expectedGroupFor(target, piece.anatomy.side); if (piece.layerGroup !== expectedGroup && piece.layerGroup !== 'target-derived') fail(`${label} anatomical side/layer group mismatch`);
}
function genericPath(value, path) { let current = value; for (const part of path.split('.')) { if (!plain(current) || !Object.hasOwn(current, part)) fail(`missing scalar ${path}`); current = current[part]; } finite(current, path); return current; }

export function resolveBinding(artifact, request) {
  const verification = verifiedArtifacts.get(artifact); if (!verification || verification.contentHash !== hashBytes(Buffer.from(canonicalJson(artifact)))) fail('artifact object is not authenticated from pinned bytes or was mutated');
  exact(request, ['schemaVersion', 'artifact', 'selection', 'canvas', 'coordinateSystem', 'projectionStrategy', 'output', 'pieces'], 'request'); rejectPrivate({ ...request, artifact: null });
  if (request.schemaVersion !== 1) fail('request schemaVersion invalid');
  exact(request.artifact, ['path', 'sha256', 'dependencyFingerprint'], 'request.artifact');
  const actualArtifact = request.artifact.path === ARTIFACT_RELATIVE && request.artifact.sha256 === ARTIFACT_SHA256 && request.artifact.dependencyFingerprint === DEPENDENCY_FINGERPRINT;
  const syntheticArtifact = request.artifact.path === SYNTHETIC_ARTIFACT_RELATIVE && request.artifact.sha256 === SYNTHETIC_ARTIFACT_SHA256 && request.artifact.dependencyFingerprint === SYNTHETIC_DEPENDENCY_FINGERPRINT;
  const bindingV2Artifact = verification.kind === 'binding-v2-synthetic'; if (!actualArtifact && !syntheticArtifact && !bindingV2Artifact) fail('request artifact pin invalid');
  if (canonicalJson(verification.pin) !== canonicalJson(request.artifact)) fail('request artifact pin does not match authenticated artifact object');
  exact(request.canvas, ['width', 'height'], 'request.canvas'); if (request.canvas.width !== CANVAS.width || request.canvas.height !== CANVAS.height) fail('only 448x1024 compositor canvas supported');
  if (request.coordinateSystem !== 'source448x1024/top-left/x-right/y-down/continuous-pixels') fail('coordinate space unsupported');
  exact(request.output, ['prefixStem'], 'request.output'); if (!/(?:^binding-v1-phase(?:01|03)$)|(?:^binding-v2-(?:baseline|ratio|registration)-(?:east|west|north|south)-phase0[1-8]$)/.test(request.output.prefixStem)) fail('unsafe binding output prefix');
  exact(request.selection, ['outputKey', 'view', 'assetView', 'phaseId', 'phaseIndex', 'normalizedCycle', 'reviewFrameMilliseconds', 'lineageKind'], 'request.selection');
  const matches = artifact.targets.filter(target => target.outputKey === request.selection.outputKey); if (matches.length !== 1) fail('selection outputKey missing or duplicate'); const target = matches[0];
  for (const key of ['view', 'assetView', 'phaseId', 'phaseIndex', 'normalizedCycle', 'reviewFrameMilliseconds']) if (target[key] !== request.selection[key]) fail(`selection ${key} mismatch`);
  if (VIEW_ASSET[target.view] !== target.assetView || request.selection.assetView !== VIEW_ASSET[request.selection.view]) fail('cardinal view/assetView mismatch');
  if (target.phaseId !== String(target.phaseIndex).padStart(2, '0') || Math.abs(target.normalizedCycle - (target.phaseIndex - 1) / 8) > 1e-12) fail('phase identity/index/cycle mismatch');
  const expectedPrefix = bindingV2Artifact ? `binding-v2-${artifact.identity.outputKey.replace('synthetic-binding-', '')}-${target.view}-phase${target.phaseId}` : `binding-v1-phase${target.phaseId}`; if (request.output.prefixStem !== expectedPrefix) fail('output prefix/selected phase mismatch');
  if (target.outputKey !== `${artifact.identity.outputKey}:${target.assetView}-walk-${target.phaseIndex}`) fail('target outputKey/view/phase mismatch');
  if (target.lineage?.kind !== request.selection.lineageKind || !['independent', 'reflected', 'synthetic'].includes(target.lineage?.kind)) fail('lineage mismatch');
  if (canonicalJson(target.lineage) !== canonicalJson(artifact.sourceLineageVerification?.lineage?.[target.view])) fail('target lineage differs from artifact view lineage');
  const registration = target.geometry?.registration; exact(registration, ['frameAxisX', 'frameFloorY', 'scale', 'sourceAxisX', 'sourceFloorY', 'sourceHeight', 'sourceWidth'], 'target.registration'); for (const key of ['frameAxisX', 'frameFloorY', 'scale', 'sourceAxisX', 'sourceFloorY', 'sourceHeight', 'sourceWidth']) finite(registration[key], `target.registration.${key}`); if (registration.sourceWidth !== 448 || registration.sourceHeight !== 1024 || registration.scale <= 0) fail('target source registration unsupported');
  const isLateral = LATERAL.has(target.view); if (!isLateral && request.projectionStrategy !== 'unsupported-north-south') fail('north/south requires separately proven projectionStrategy');
  if (isLateral && request.projectionStrategy !== 'lateral-rigid-2d') fail('lateral projectionStrategy unsupported');
  if (isLateral && (target.geometry.coordinateSpace !== 'frame128x192' || target.geometry.nativeMaster?.coordinateSpace !== 'source448x1024')) fail('lateral target coordinate-space labels unsupported');
  const expectedOrder = target.geometry.farSide === 'left' && target.geometry.nearSide === 'right' ? ['left-far-limbs', 'torso-and-head', 'right-near-limbs'] : target.geometry.farSide === 'right' && target.geometry.nearSide === 'left' ? ['right-far-limbs', 'torso-and-head', 'left-near-limbs'] : null;
  if (isLateral && (!expectedOrder || canonicalJson(target.geometry.renderingOrder) !== canonicalJson(expectedOrder))) fail('lateral renderingOrder mismatch');
  if (!Array.isArray(request.pieces)) fail('request pieces must be array');
  const preserved = { artifactIdentity: artifact.identity, phaseContract: artifact.phaseContract, sourceLineageVerification: artifact.sourceLineageVerification, artifactProvenance: syntheticArtifact ? { parentArtifact: artifact.parentArtifact, dependencyInputs: artifact.dependencyInputs, subset: artifact.subset, parentPhaseContract: artifact.parentPhaseContract } : { dependencies: artifact.dependencies, dependencyFingerprint: artifact.dependencyFingerprint } };
  const coordinateSpaces = isLateral ? { target: target.geometry.coordinateSpace, nativeMaster: target.geometry.nativeMaster.coordinateSpace, compositor: request.coordinateSystem } : { frame: target.geometry.frame.coordinateSpace, latent: target.geometry.latent.coordinateSpace, nativeMaster: target.geometry.nativeMaster.coordinateSpace, compositor: request.coordinateSystem };
  const visibility = isLateral ? { facing: target.geometry.facing, nearSide: target.geometry.nearSide, farSide: target.geometry.farSide, renderingOrder: target.geometry.renderingOrder } : target.geometry.visibility;
  if (!request.pieces.length) return authenticated({ schemaVersion: 1, state: 'unbound-donor', graphEligible: false, artifact: request.artifact, output: request.output, ...preserved, selection: { ...request.selection, motionId: target.motionId, kind: target.kind }, registration, coordinateSpaces, lineage: target.lineage, visibility, projectionStrategy: request.projectionStrategy, blockers: ['No donor pieces are bound; source lineage is declared only and no image bytes were read.'], pieces: [] });
  if (actualArtifact) fail('real Patient01 artifact remains unbound in B1; synthetic fixture artifact required for pieces');
  if (!isLateral) fail('north/south graph emission unsupported without proven projection strategy');
  const ids = new Set(), groupSlots = new Set(); const pieces = request.pieces.map((piece, index) => {
    validatePiece(piece, index, target); if (ids.has(piece.id)) fail(`duplicate piece id ${piece.id}`); ids.add(piece.id); const slotGroup = piece.layerGroup === 'target-derived' ? expectedGroupFor(target, piece.anatomy.side) : piece.layerGroup, slot = `${slotGroup}:${piece.layerWithinGroup}`; if (groupSlots.has(slot)) fail(`duplicate layer slot ${slot}`); groupSlots.add(slot);
    const proximal = atPath(target, piece.proximalRef), distal = atPath(target, piece.distalRef); const dx = distal.x - proximal.x, dy = distal.y - proximal.y, requestedLength = Math.hypot(dx, dy);
    const frameScalar = genericPath(target, piece.segmentLength.frameScalarRef), exactNativeLength = frameScalar / registration.scale, roundedNativeScalar = genericPath(target, piece.segmentLength.roundedNativeScalarRef);
    const endpointResidual = Math.abs(requestedLength - exactNativeLength), endpointBound = tightTolerance(registration.scale); if (endpointResidual > endpointBound) fail(`${piece.id} endpoint length residual ${endpointResidual} exceeds ${endpointBound}`);
    const roundedScalarResidual = Math.abs(roundedNativeScalar - exactNativeLength), roundedScalarBound = 0.00005; if (roundedScalarResidual > roundedScalarBound) fail(`${piece.id} rounded native scalar residual exceeds bound`);
    const restLength = Math.hypot(piece.restVector.x, piece.restVector.y); if (Math.abs(restLength - exactNativeLength) > 1e-9) fail(`${piece.id} rest length must equal exact frame scalar/scale; no per-pose scaling`);
    const rotationDegrees = (Math.atan2(dy, dx) - Math.atan2(piece.restVector.y, piece.restVector.x)) * 180 / Math.PI; const center = { x: piece.crop.width / 2, y: piece.crop.height / 2 }, rotatedPivot = rotate(piece.pivot, center, rotationDegrees); const placement = { x: proximal.x - rotatedPivot.x, y: proximal.y - rotatedPivot.y };
    const resolvedGroup = piece.layerGroup === 'target-derived' ? expectedGroupFor(target, piece.anatomy.side) : piece.layerGroup, boundPolicy = bindingV2Artifact ? 'sqrt(2)*0.0001/scale + sqrt(2)*0.0001 pipeline rounding bound; rounded native scalar alone <=0.00005; not an art tolerance' : 'sqrt(2)*0.0001/scale + sqrt(2)*0.0001; +0.00005 only for rounded native scalar comparison; not an art tolerance'; return { id: piece.id, layerGroup: resolvedGroup, layerWithinGroup: piece.layerWithinGroup, layerOrder: target.geometry.renderingOrder.indexOf(resolvedGroup) * 100 + piece.layerWithinGroup, source: piece.source, sourceHash: piece.sourceHash, sourceHashKind: piece.sourceHashKind, crop: piece.crop, pivot: piece.pivot, restVector: piece.restVector, sourceOffset: piece.sourceOffset, overlap: piece.overlap, anatomy: piece.anatomy, endpoints: { proximalRef: piece.proximalRef, distalRef: piece.distalRef, proximal, distal }, lengthEvidence: { requestedEndpointLength: requestedLength, exactNativeLength, endpointResidual, endpointBound, roundedNativeScalar, roundedScalarResidual, roundedScalarBound, boundPolicy }, transform: { rotationDegrees, placement, quantizedPlacement: { x: roundPlacement(placement.x), y: roundPlacement(placement.y) }, scale: 1 } };
  });
  return authenticated({ schemaVersion: 1, state: 'resolved-synthetic-lateral', graphEligible: true, artifact: request.artifact, output: request.output, ...preserved, selection: { ...request.selection, motionId: target.motionId, kind: target.kind }, registration, coordinateSpaces, lineage: target.lineage, visibility, projectionStrategy: request.projectionStrategy, pieces });
}

function add(state, class_type, inputs) { const id = String(state.next++); state.graph[id] = { class_type, inputs }; return id; }
function transparentLayers(state, width, height, name) { const image = add(state, 'EmptyImage', { width: 1, height: 1, batch_size: 1, color: 0 }); const mask = add(state, 'SolidMask', { value: 1, width: 1, height: 1 }); return add(state, 'LayersFromBoundingBoxes', { image: [image, 0], bboxes: JSON.stringify([{ bbox: [0, 0, 1, 1], metadata: { name, z_index: -1000 } }]), mask: [mask, 0], crop_to_content: false, canvas_width: width, canvas_height: height }); }
function buildPiece(state, piece) { let layers = transparentLayers(state, piece.crop.width, piece.crop.height, `${piece.id}-transparent-base`); for (const [index, primitive] of piece.source.primitives.entries()) { const image = add(state, 'EmptyImage', { width: primitive.width, height: primitive.height, batch_size: 1, color: primitive.color }); const mask = add(state, 'SolidMask', { value: primitive.transparency, width: primitive.width, height: primitive.height }); layers = add(state, 'AddLayer', { image: [image, 0], layers: [layers, 0], mask: [mask, 0], name: `${piece.id}-${primitive.id}`, x: primitive.x, y: primitive.y, opacity: 1, blend_mode: 'normal', rotation: 0, width: 0, height: 0, z_index: index, flip_h: false, flip_v: false }); } return add(state, 'ImageCompositor', { layers: [layers, 0], compositor: {} }); }

export function emitBindingGraph(resolved, capturedSchema) {
  if (!authenticatedBindings.has(resolved) || authenticatedBindings.get(resolved) !== hashBytes(Buffer.from(canonicalJson(resolved)))) fail('binding must be unchanged and come directly from resolveBinding');
  if (resolved.state !== 'resolved-synthetic-lateral' || !resolved.graphEligible) fail('only resolved synthetic lateral bindings emit graphs');
  const prefixStem = resolved.output?.prefixStem; if (!/(?:^binding-v1-phase(?:01|03)$)|(?:^binding-v2-(?:baseline|ratio|registration)-(?:east|west)-phase0[1-8]$)/.test(prefixStem)) fail('unsafe binding output prefix');
  const state = { graph: {}, next: 1 }; let layers = transparentLayers(state, CANVAS.width, CANVAS.height, 'fixed-transparent-document');
  for (const piece of [...resolved.pieces].sort((a, b) => a.layerOrder - b.layerOrder)) { const source = buildPiece(state, piece); layers = add(state, 'AddLayer', { image: [source, 0], layers: [layers, 0], mask: [source, 1], name: piece.id, x: piece.transform.quantizedPlacement.x, y: piece.transform.quantizedPlacement.y, opacity: 1, blend_mode: 'normal', rotation: piece.transform.rotationDegrees, width: 0, height: 0, z_index: piece.layerOrder, flip_h: false, flip_v: false }); }
  const compositor = add(state, 'ImageCompositor', { layers: [layers, 0], compositor: {} }); const maskImage = add(state, 'MaskToImage', { mask: [compositor, 1] }); const prefix = `synthetic/pose-process-proof-v1/${prefixStem}`; const imageSave = add(state, 'SaveImage', { images: [compositor, 0], filename_prefix: `${prefix}-composite` }); const maskSave = add(state, 'SaveImage', { images: [maskImage, 0], filename_prefix: `${prefix}-transparency` }); validateGraph(state.graph, capturedSchema);
  return { schemaVersion: 1, state: 'unexecuted-synthetic-binding-graph', sourceArtifact: resolved.artifact, artifactIdentity: resolved.artifactIdentity, phaseContract: resolved.phaseContract, sourceLineageVerification: resolved.sourceLineageVerification, artifactProvenance: resolved.artifactProvenance, selection: resolved.selection, registration: resolved.registration, coordinateSpaces: resolved.coordinateSpaces, lineage: resolved.lineage, visibility: resolved.visibility, renderingOrder: resolved.visibility.renderingOrder, projectionStrategy: resolved.projectionStrategy, rounding: ROUNDING, transforms: resolved.pieces.map(({ source, ...piece }) => piece), graph: state.graph, outputs: [{ nodeId: imageSave, role: 'composite-image', filenamePrefix: `${prefix}-composite` }, { nodeId: maskSave, role: 'transparency-mask-as-image', filenamePrefix: `${prefix}-transparency` }] };
}
