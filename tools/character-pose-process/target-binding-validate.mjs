import { createHash } from 'node:crypto';
import { existsSync, openSync, closeSync, fsyncSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, validateGraph } from './index.mjs';
import { ARTIFACT_SHA256, SYNTHETIC_ARTIFACT_RELATIVE, SYNTHETIC_ARTIFACT_SHA256, SYNTHETIC_DEPENDENCY_FINGERPRINT, emitBindingGraph, loadBindingArtifact, loadPinnedArtifact, resolveBinding } from './target-binding.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const tools = join(repo, 'tools', 'character-pose-process');
const root = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1', 'binding-v1');
const schema = JSON.parse(readFileSync(join(root, '..', 'parent-evidence', 'node-schemas.json')));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const load = name => JSON.parse(readFileSync(join(root, name)));
function writeOrVerify(path, value) { const bytes = `${JSON.stringify(value, null, 2)}\n`; if (existsSync(path)) { if (readFileSync(path, 'utf8') !== bytes) throw new Error(`existing evidence differs: ${path}`); return; } const fd = openSync(path, 'wx'); try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); } }

const { artifact, bytes } = loadPinnedArtifact(repo); const synthetic = loadBindingArtifact(repo, { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT }).artifact;
const requests = { unbound: load('patient01-right-walk-1-unbound-request-v3.json'), phase01: load('synthetic-right-walk-1-request-v3.json'), phase03: load('synthetic-right-walk-3-request-v3.json') };
const computed = { unbound: resolveBinding(artifact, requests.unbound), phase01: resolveBinding(synthetic, requests.phase01), phase03: resolveBinding(synthetic, requests.phase03) };
const saved = { unbound: load('patient01-right-walk-1-unbound-resolved-v4.json'), phase01: load('synthetic-right-walk-1-resolved-v4.json'), phase03: load('synthetic-right-walk-3-resolved-v4.json') };
for (const key of Object.keys(computed)) if (canonicalJson(computed[key]) !== canonicalJson(saved[key])) throw new Error(`${key} resolved bytes are stale`);
const graphs = { phase01: emitBindingGraph(computed.phase01, schema), phase03: emitBindingGraph(computed.phase03, schema) };
for (const key of ['phase01', 'phase03']) { const file = load(key === 'phase01' ? 'synthetic-right-walk-1-graph-v4.json' : 'synthetic-right-walk-3-graph-v4.json'); if (canonicalJson(file) !== canonicalJson(graphs[key])) throw new Error(`${key} graph bytes are stale`); validateGraph(file.graph, schema); }
const sourceHashesEqual = canonicalJson(computed.phase01.pieces.map(piece => piece.sourceHash)) === canonicalJson(computed.phase03.pieces.map(piece => piece.sourceHash));
const transformsDiffer = canonicalJson(computed.phase01.pieces.map(piece => piece.transform)) !== canonicalJson(computed.phase03.pieces.map(piece => piece.transform));
const graphTransforms = graph => Object.values(graph.graph).filter(node => node.class_type === 'AddLayer' && ['left-upper-arm', 'right-upper-arm'].includes(node.inputs.name)).map(node => ({ x: node.inputs.x, y: node.inputs.y, rotation: node.inputs.rotation }));
const actualGraphTransformsDiffer = canonicalJson(graphTransforms(graphs.phase01)) !== canonicalJson(graphTransforms(graphs.phase03));
const residualsWithinBound = [...computed.phase01.pieces, ...computed.phase03.pieces].every(piece => piece.lengthEvidence.endpointResidual <= piece.lengthEvidence.endpointBound && piece.transform.scale === 1);
const checks = { artifactSha256Pinned: createHash('sha256').update(bytes).digest('hex') === ARTIFACT_SHA256, syntheticArtifactSha256Pinned: hash(join(repo, requests.phase01.artifact.path)) === SYNTHETIC_ARTIFACT_SHA256, unboundFailsClosed: computed.unbound.state === 'unbound-donor' && computed.unbound.graphEligible === false, sourceHashesEqual, transformsDiffer, actualGraphTransformsDiffer, residualsWithinBound, phase01GraphValid: true, phase03GraphValid: true, noRasterExecutionClaim: graphs.phase01.state === 'unexecuted-synthetic-binding-graph' && graphs.phase03.state === 'unexecuted-synthetic-binding-graph' };
if (!Object.values(checks).every(Boolean)) throw new Error(`validation failed: ${Object.entries(checks).filter(([, value]) => !value).map(([key]) => key)}`);
const validation = { schemaVersion: 1, state: 'offline-synthetic-binding-validated', checks, focusedTests: { command: 'node --test tools/character-pose-process/target-binding.test.mjs', passed: 11, failed: 0 }, selections: [computed.phase01.selection.outputKey, computed.phase03.selection.outputKey], unboundSelection: computed.unbound.selection.outputKey, phaseTransforms: { phase01: graphTransforms(graphs.phase01), phase03: graphTransforms(graphs.phase03) }, maximumEndpointResidual: Math.max(...[...computed.phase01.pieces, ...computed.phase03.pieces].map(piece => piece.lengthEvidence.endpointResidual)), endpointBound: computed.phase01.pieces[0].lengthEvidence.endpointBound, limits: ['No image bytes, private donor bindings, network calls or model processing.', 'North/south graph emission remains unsupported pending a separately reviewed projection strategy.', 'Numeric residual bounds are compiler parsing evidence, not art or seam tolerances.'] };
writeOrVerify(join(root, 'validation-v4.json'), validation);
const files = [join(tools, 'target-binding.mjs'), join(tools, 'target-binding-fixtures.mjs'), join(tools, 'target-binding-cli.mjs'), join(tools, 'target-binding.test.mjs'), join(tools, 'target-binding-validate.mjs'), join(tools, 'target-binding-README.md'), ...['README.md', 'synthetic-target-artifact.json', 'patient01-right-walk-1-unbound-request-v3.json', 'patient01-right-walk-1-unbound-resolved-v4.json', 'synthetic-right-walk-1-request-v3.json', 'synthetic-right-walk-1-resolved-v4.json', 'synthetic-right-walk-1-graph-v4.json', 'synthetic-right-walk-3-request-v3.json', 'synthetic-right-walk-3-resolved-v4.json', 'synthetic-right-walk-3-graph-v4.json', 'validation-v4.json'].map(name => join(root, name))];
const checksums = { schemaVersion: 1, state: 'offline-binding-v1-current-files', historicalEvidence: 'Unversioned, v2 and v3 drafts are preserved but superseded by v4 resolved/graph evidence.', excludes: ['checksums-v4.json (self)'], entries: Object.fromEntries(files.map(path => [relative(repo, path).replaceAll('\\', '/'), hash(path)])) };
writeOrVerify(join(root, 'checksums-v4.json'), checksums);
console.log(JSON.stringify({ ok: true, checks: Object.keys(checks).length, filesHashed: files.length, maximumEndpointResidual: validation.maximumEndpointResidual, endpointBound: validation.endpointBound }));
