import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, fsyncSync, lstatSync, openSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, validateGraph } from './index.mjs';
import { SCHEMA_SHA256, assertNoLinkedPath, hashBytes, loadBindingV2Artifact, resolveBinding, emitBindingGraph } from './target-binding.mjs';
import { parseObservedTap } from './target-binding-validation-v2.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1', 'binding-v2');
const toolRoot = join(repo, 'tools', 'character-pose-process');
const testEntries = [
  'tools/character-pose-process/target-binding.test.mjs',
  'tools/character-pose-process/target-binding-validation-v2.test.mjs',
  'tools/character-pose-process/target-binding-v2.test.mjs',
];

export function parseV2ValidationArgs(argv) {
  if (!Array.isArray(argv)) throw new Error('argv must be an array');
  if (argv.length === 0) return { seal: false };
  if (argv.length === 1 && argv[0] === '--seal') return { seal: true };
  throw new Error('usage: node tools/character-pose-process/target-binding-v2-validate.mjs [--seal]');
}

function guardedRead(path) { return readFileSync(assertNoLinkedPath(path, repo)); }
function readJson(path) { return JSON.parse(guardedRead(path)); }
function hash(path) { return createHash('sha256').update(guardedRead(path)).digest('hex'); }
function exclusive(path, value) {
  const safe = assertNoLinkedPath(path, repo, { mustExist: false });
  const fd = openSync(safe, 'wx');
  try { writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`); fsyncSync(fd); } finally { closeSync(fd); }
}

function filesUnder(folder) {
  const safeFolder = assertNoLinkedPath(folder, repo), result = [];
  for (const name of readdirSync(safeFolder)) {
    const path = assertNoLinkedPath(join(safeFolder, name), repo);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error(`linked checksum path ${path}`);
    if (stat.isDirectory()) result.push(...filesUnder(path));
    else result.push(path);
  }
  return result;
}

function verifyImmutableBytes() {
  const manifestPath = join(root, 'immutable-pre-cleanup.json');
  const pre = readJson(manifestPath);
  if (pre.state !== 'pre-cleanup immutable numeric/kit/graph byte hashes') throw new Error('immutable pre-cleanup manifest state invalid');
  const mismatches = [];
  for (const [path, expected] of Object.entries(pre.entries)) {
    const actual = hash(join(root, path));
    if (actual !== expected) mismatches.push({ path, expected, actual });
  }
  if (mismatches.length) throw new Error(`immutable numeric/kit/graph bytes changed: ${mismatches.map(value => value.path).join(', ')}`);
  return { fileCount: Object.keys(pre.entries).length, manifestSha256: hash(manifestPath), mismatches };
}

export function validateV2Package() {
  assertNoLinkedPath(root, repo);
  const schemaPath = assertNoLinkedPath(join(root, '..', 'parent-evidence', 'node-schemas.json'), repo);
  const schemaBytes = guardedRead(schemaPath);
  if (hashBytes(schemaBytes) !== SCHEMA_SHA256) throw new Error('schema pin mismatch');
  const schema = JSON.parse(schemaBytes);

  const guardedTestEntries = testEntries.map(path => assertNoLinkedPath(join(repo, path), repo));
  const testArgs = ['--test', ...guardedTestEntries];
  const testResult = spawnSync(process.execPath, testArgs, { cwd: repo, encoding: 'utf8' });
  const observedCounts = parseObservedTap(testResult);
  const observedTests = { command: [process.execPath, ...testArgs], status: testResult.status, stdout: testResult.stdout, stderr: testResult.stderr, tests: observedCounts.tests, passed: observedCounts.passed, failed: observedCounts.failed };

  const summary = readJson(join(root, 'generation-summary.json'));
  const manifest = readJson(join(root, 'compiler-artifact-manifest.json'));
  if (summary.graphCount !== 48 || summary.requestCount !== 48 || summary.resolvedCount !== 48 || manifest.fixtures.length !== 3) throw new Error('coverage summary mismatch');
  const prefixes = new Set(), kitProof = [], fixtureVariation = {};
  let maximumEndpointResidual = 0;
  for (const fixtureId of ['baseline', 'ratio', 'registration']) {
    const loaded = loadBindingV2Artifact(repo, fixtureId), kit = readJson(join(root, 'kits', `${fixtureId}.json`)), kitCanonical = canonicalJson(kit.pieces);
    let records = 0;
    for (const view of ['east', 'west']) for (let phase = 1; phase <= 8; phase++) {
      const phaseId = String(phase).padStart(2, '0'), folder = join(root, 'generated', fixtureId, view, `phase-${phaseId}`);
      const request = readJson(join(folder, 'request.json')), savedResolved = readJson(join(folder, 'resolved.json')), savedGraph = readJson(join(folder, 'graph.json'));
      if (canonicalJson(request.pieces) !== kitCanonical) throw new Error(`${fixtureId} kit changed at ${view}/${phaseId}`);
      const resolved = resolveBinding(loaded.artifact, request);
      if (canonicalJson(resolved) !== canonicalJson(savedResolved)) throw new Error('resolved reproduction mismatch');
      const graph = emitBindingGraph(resolved, schema);
      if (canonicalJson(graph) !== canonicalJson(savedGraph)) throw new Error('graph reproduction mismatch');
      validateGraph(graph.graph, schema);
      for (const output of graph.outputs) { if (prefixes.has(output.filenamePrefix)) throw new Error(`colliding output prefix ${output.filenamePrefix}`); prefixes.add(output.filenamePrefix); }
      for (const piece of resolved.pieces) maximumEndpointResidual = Math.max(maximumEndpointResidual, piece.lengthEvidence.endpointResidual);
      records++;
    }
    kitProof.push({ fixtureId, kitIdentitySha256: kit.kitIdentitySha256, pieceCount: kit.pieces.length, requestCountUsingExactKit: records });
    const target = loaded.artifact.targets.find(value => value.view === 'east' && value.phaseId === '01');
    fixtureVariation[fixtureId] = { segmentLengths: target.anatomy.segmentLengths, registration: target.geometry.registration, leftShoulder: target.geometry.nativeMaster.joints.left.shoulder };
  }
  if (prefixes.size !== 96 || maximumEndpointResidual > 0.001) throw new Error('output-prefix or residual evidence invalid');
  return {
    schemaVersion: 2,
    state: 'offline-synthetic-binding-v2-validated-unexecuted',
    observedTests,
    coverage: { fixtureCount: 3, views: ['east', 'west'], phasesPerView: 8, graphCount: 48, outputPrefixCount: 96, segments: ['upper-arm', 'forearm', 'thigh', 'shin'], anatomicalSides: ['left', 'right'] },
    compiler: { codeFingerprint: manifest.compilerCodeFingerprint, artifacts: manifest.fixtures.map(value => ({ fixtureId: value.fixtureId, artifactSha256: value.artifactSha256, dependencyFingerprint: value.dependencyFingerprint, targetCount: value.targetCount })) },
    kitReuse: kitProof,
    maximumEndpointResidual,
    pipelineRoundingBoundPolicy: 'sqrt(2)*0.0001/scale + sqrt(2)*0.0001; rounded native scalar residual independently <=0.00005',
    fixtureVariation,
    immutableByteProof: verifyImmutableBytes(),
    claims: { graphsSaved: true, graphsExecuted: false, filesCheckedIn: false, imageBytesRead: false, privateDonorsBound: false, networkUsed: false, productionReady: false },
  };
}

function seal(report) {
  const reportPath = join(root, 'final-validation-v3.json'), checksumPath = join(root, 'final-checksums-v3.json');
  assertNoLinkedPath(reportPath, repo, { mustExist: false }); assertNoLinkedPath(checksumPath, repo, { mustExist: false });
  exclusive(reportPath, report);
  const toolFiles = readdirSync(assertNoLinkedPath(toolRoot, repo)).filter(name => name === 'index.mjs' || name.startsWith('target-binding')).map(name => assertNoLinkedPath(join(toolRoot, name), repo));
  const all = [...toolFiles, ...filesUnder(root).filter(path => path !== checksumPath)].sort();
  const checksums = { schemaVersion: 3, state: 'binding-v2-final-empty-test-guard-current-files', excludes: ['final-checksums-v3.json (self)'], entries: Object.fromEntries(all.map(path => [relative(repo, path).replaceAll('\\', '/'), hash(path)])) };
  exclusive(checksumPath, checksums);
  return { reportPath, checksumPath, filesHashed: all.length };
}

export function main(argv = process.argv.slice(2)) { const args = parseV2ValidationArgs(argv); const report = validateV2Package(); return args.seal ? { report, sealed: seal(report) } : { report, sealed: null }; }
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) { try { console.log(JSON.stringify(main())); } catch (error) { console.error(error.message); process.exitCode = 1; } }
