import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateGraph } from './index.mjs';
import { ARTIFACT_RELATIVE, ARTIFACT_SHA256, DEPENDENCY_FINGERPRINT, SYNTHETIC_ARTIFACT_RELATIVE, SYNTHETIC_ARTIFACT_SHA256, SYNTHETIC_DEPENDENCY_FINGERPRINT, assertNoLinkedPath, emitBindingGraph, hashBytes, loadBindingArtifact, loadPinnedArtifact, resolveBinding } from './target-binding.mjs';
import { bindingRequest } from './target-binding-fixtures.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const artifactPath = join(repo, ARTIFACT_RELATIVE); const artifact = loadPinnedArtifact(repo).artifact; const synthetic = loadBindingArtifact(repo, { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT }).artifact;
const schema = JSON.parse(readFileSync(join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1', 'parent-evidence', 'node-schemas.json')));
let tmp;
function clone(value) { return structuredClone(value); }
function request(key = 'synthetic-binding-fixture:right-walk-1') { return bindingRequest(synthetic, key); }

test.before(() => { tmp = mkdtempSync(join(repo, 'tools', 'character-pose-process', '.target-binding-test-tmp-')); assert.equal(resolve(tmp).startsWith(resolve(repo, 'tools', 'character-pose-process')), true); });
test.after(() => { assert.equal(resolve(tmp).startsWith(resolve(repo, 'tools', 'character-pose-process')), true); rmSync(tmp, { recursive: true, force: true }); assert.equal(existsSync(tmp), false); });

test('pinned artifact bytes and dependency fingerprint load exactly', () => {
  const loaded = loadPinnedArtifact(repo); assert.equal(hashBytes(loaded.bytes), ARTIFACT_SHA256); assert.equal(loaded.artifact.dependencyFingerprint, DEPENDENCY_FINGERPRINT); assert.equal(loadBindingArtifact(repo, { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT }).artifact.artifactClass, 'synthetic-target-fixture');
  const fake = join(tmp, 'repo'); mkdirSync(dirname(join(fake, ARTIFACT_RELATIVE)), { recursive: true }); cpSync(artifactPath, join(fake, ARTIFACT_RELATIVE));
  const changed = readFileSync(join(fake, ARTIFACT_RELATIVE)); changed[changed.length - 2] ^= 1; writeFileSync(join(fake, ARTIFACT_RELATIVE), changed); assert.throws(() => loadPinnedArtifact(fake), /byte hash/);
});

test('authenticated artifact objects reject cross-pinning in both directions', () => {
  const realAsSynthetic = bindingRequest(artifact, 'mixed-20260910-patient-01:right-walk-1'); realAsSynthetic.artifact = { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT }; assert.throws(() => resolveBinding(artifact, realAsSynthetic), /does not match authenticated/);
  const syntheticAsReal = request(); syntheticAsReal.artifact = { path: ARTIFACT_RELATIVE, sha256: ARTIFACT_SHA256, dependencyFingerprint: DEPENDENCY_FINGERPRINT }; assert.throws(() => resolveBinding(synthetic, syntheticAsReal), /does not match authenticated/);
});

test('unbound Patient01 phase1 inspect retains identity and refuses graph eligibility', () => {
  const resolved = resolveBinding(artifact, bindingRequest(artifact, 'mixed-20260910-patient-01:right-walk-1', { bound: false }));
  assert.equal(resolved.state, 'unbound-donor'); assert.equal(resolved.graphEligible, false); assert.equal(resolved.selection.phaseId, '01'); assert.equal(resolved.lineage.kind, 'independent'); assert.match(resolved.blockers[0], /No donor pieces/);
});

test('two lateral phases preserve synthetic sources and change actual AddLayer transforms', () => {
  const a = resolveBinding(synthetic, request()); const b = resolveBinding(synthetic, request('synthetic-binding-fixture:right-walk-3'));
  assert.deepEqual(a.pieces.map(piece => piece.sourceHash), b.pieces.map(piece => piece.sourceHash));
  assert.notDeepEqual(a.pieces.map(piece => piece.transform), b.pieces.map(piece => piece.transform));
  const ga = emitBindingGraph(a, schema), gb = emitBindingGraph(b, schema); assert.equal(validateGraph(ga.graph, schema), true); assert.equal(validateGraph(gb.graph, schema), true);
  const transforms = graph => Object.values(graph.graph).filter(node => node.class_type === 'AddLayer' && ['left-upper-arm', 'right-upper-arm'].includes(node.inputs.name)).map(node => [node.inputs.x, node.inputs.y, node.inputs.rotation]);
  assert.notDeepEqual(transforms(ga), transforms(gb)); assert.deepEqual(ga.transforms.map(piece => piece.sourceHash), gb.transforms.map(piece => piece.sourceHash));
});

test('tight compiler-derived endpoint residual is reported and changed geometry fails', () => {
  const resolved = resolveBinding(synthetic, request()); for (const piece of resolved.pieces) { assert.ok(piece.lengthEvidence.endpointResidual <= piece.lengthEvidence.endpointBound); assert.equal(piece.transform.scale, 1); assert.match(piece.lengthEvidence.boundPolicy, /not an art tolerance/); }
  const changed = clone(synthetic); changed.targets.find(target => target.outputKey.endsWith('right-walk-1')).geometry.nativeMaster.joints.left.elbow.x += 1;
  assert.throws(() => resolveBinding(changed, request()), /not authenticated/);
});

test('selection rejects missing, duplicate, phase, view, lineage and registration mismatches', () => {
  const missing = request(); missing.selection.outputKey += '-absent'; assert.throws(() => resolveBinding(synthetic, missing), /missing or duplicate/);
  const duplicate = clone(synthetic); duplicate.targets.push(clone(duplicate.targets.find(target => target.outputKey.endsWith('right-walk-1')))); assert.throws(() => resolveBinding(duplicate, request()), /not authenticated/);
  for (const [field, value, pattern] of [['phaseId', '99', /phaseId mismatch/], ['view', 'west', /view mismatch/], ['lineageKind', 'reflected', /lineage mismatch/]]) { const valueRequest = request(); valueRequest.selection[field] = value; assert.throws(() => resolveBinding(synthetic, valueRequest), pattern); }
  const dimensions = request(); dimensions.canvas.width = 449; assert.throws(() => resolveBinding(synthetic, dimensions), /448x1024/);
  const units = request(); units.coordinateSystem = 'frame128x192'; assert.throws(() => resolveBinding(synthetic, units), /coordinate space/);
});

test('piece mappings reject unsafe endpoints, source kinds, offsets, duplicate ids/order and private refs', () => {
  const unsafe = request(); unsafe.pieces[0].proximalRef = 'geometry.nativeMaster.__proto__.x'; assert.throws(() => resolveBinding(synthetic, unsafe), /endpoint refs/);
  const image = request(); image.pieces[0].source.kind = 'image-file'; assert.throws(() => resolveBinding(synthetic, image), /source kind unsupported/);
  const offset = request(); offset.pieces[0].sourceOffset.x = 1; assert.throws(() => resolveBinding(synthetic, offset), /sourceOffset/);
  const duplicate = request(); duplicate.pieces[1].id = duplicate.pieces[0].id; assert.throws(() => resolveBinding(synthetic, duplicate), /duplicate piece id/);
  const order = request(); order.pieces[0].layerGroup = 'unknown-layer'; assert.throws(() => resolveBinding(synthetic, order), /renderingOrder/);
  const privateRef = request(); privateRef.pieces[0].source.privateRef = 'resident:asset'; assert.throws(() => resolveBinding(synthetic, privateRef), /private/);
});

test('north/south rigid reuse and unknown projection strategies fail', () => {
  const north = bindingRequest(artifact, 'mixed-20260910-patient-01:back-walk-1'); assert.throws(() => resolveBinding(artifact, north), /north\/south requires/);
  const northInspect = bindingRequest(artifact, 'mixed-20260910-patient-01:back-walk-1', { bound: false }); northInspect.projectionStrategy = 'unsupported-north-south'; const diagnostic = resolveBinding(artifact, northInspect); assert.deepEqual(diagnostic.coordinateSpaces, { frame: 'frame128x192', latent: 'latent3D-frame-authoring-units', nativeMaster: 'source448x1024-via-projection', compositor: 'source448x1024/top-left/x-right/y-down/continuous-pixels' }); assert.deepEqual(diagnostic.visibility, artifact.targets.find(target => target.outputKey.endsWith('back-walk-1')).geometry.visibility);
  const west = bindingRequest(artifact, 'mixed-20260910-patient-01:left-walk-1', { bound: false }); const westResolved = resolveBinding(artifact, west); assert.deepEqual(westResolved.visibility.renderingOrder, ['right-far-limbs', 'torso-and-head', 'left-near-limbs']);
  const lateral = request(); lateral.projectionStrategy = 'unknown'; assert.throws(() => resolveBinding(synthetic, lateral), /lateral projectionStrategy/);
});

test('emission refuses unbound state and unsafe output prefix', () => {
  const unbound = resolveBinding(artifact, bindingRequest(artifact, 'mixed-20260910-patient-01:right-walk-1', { bound: false })); assert.throws(() => emitBindingGraph(unbound, schema), /only resolved/);
  const bad = request(); bad.output.prefixStem = '../escape'; assert.throws(() => resolveBinding(synthetic, bad), /unsafe binding output/);
  const mutated = resolveBinding(synthetic, request()); mutated.graphEligible = false; assert.throws(() => emitBindingGraph(mutated, schema), /unchanged/);
  assert.throws(() => emitBindingGraph({ ...resolveBinding(synthetic, request()) }, schema), /directly/);
});

test('linked path redirection is refused', t => {
  const real = join(tmp, 'real'); const link = join(tmp, 'link'); mkdirSync(real);
  try { symlinkSync(real, link, 'junction'); } catch (error) { if (['EPERM', 'EACCES'].includes(error.code)) return t.skip('Windows symlink creation unavailable'); throw error; }
  assert.throws(() => assertNoLinkedPath(join(link, 'out.json'), tmp, { mustExist: false }), /linked path/);
});

test('CLI rejects unknown/duplicate flags, extra positionals and overwrites', () => {
  const cli = 'tools/character-pose-process/target-binding-cli.mjs';
  for (const args of [['inspect', '--bogus', 'x'], ['inspect', '--request', 'x.json', '--request', 'y.json'], ['fixtures', 'extra']]) { const result = spawnSync('node', [cli, ...args], { cwd: repo, encoding: 'utf8' }); assert.notEqual(result.status, 0); }
  const runRoot = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1', 'binding-v1');
  const before = readFileSync(join(runRoot, 'synthetic-right-walk-1-resolved-v4.json')); const result = spawnSync('node', [cli, 'resolve', '--request', 'synthetic-right-walk-1-request-v3.json', '--output', 'synthetic-right-walk-1-resolved-v4.json'], { cwd: repo, encoding: 'utf8' }); assert.notEqual(result.status, 0); assert.match(result.stderr, /EEXIST|exist/i); assert.deepEqual(readFileSync(join(runRoot, 'synthetic-right-walk-1-resolved-v4.json')), before);
});
