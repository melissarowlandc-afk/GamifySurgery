import { spawnSync } from 'node:child_process';
import { closeSync, existsSync, fsyncSync, lstatSync, openSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, validateGraph } from './index.mjs';
import { ARTIFACT_RELATIVE, ARTIFACT_SHA256, SCHEMA_SHA256, SYNTHETIC_ARTIFACT_RELATIVE, SYNTHETIC_ARTIFACT_SHA256, SYNTHETIC_DEPENDENCY_FINGERPRINT, emitBindingGraph, hashBytes, loadBindingArtifact, loadPinnedArtifact, resolveBinding } from './target-binding.mjs';

const DEFAULT_REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EVIDENCE_RELATIVE = 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/pose-process-proof-v1/binding-v1';
const SCHEMA_RELATIVE = 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/pose-process-proof-v1/parent-evidence/node-schemas.json';
const NAMES = Object.freeze({
  realRequest: 'patient01-right-walk-1-unbound-request-v3.json', realResolved: 'patient01-right-walk-1-unbound-resolved-v4.json',
  phase01Request: 'synthetic-right-walk-1-request-v3.json', phase01Resolved: 'synthetic-right-walk-1-resolved-v4.json', phase01Graph: 'synthetic-right-walk-1-graph-v4.json',
  phase03Request: 'synthetic-right-walk-3-request-v3.json', phase03Resolved: 'synthetic-right-walk-3-resolved-v4.json', phase03Graph: 'synthetic-right-walk-3-graph-v4.json',
});

function inside(path, root) { const rel = relative(root, path); return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)); }
export function guardLocalPath(path, root, { mustExist = true } = {}) {
  const absolute = resolve(path), base = resolve(root); if (!inside(absolute, base)) throw new Error(`path escapes repository root: ${absolute}`);
  const chain = []; let current = absolute; while (inside(current, base)) { chain.push(current); if (current === base) break; current = dirname(current); }
  for (const candidate of chain.reverse()) { try { const stat = lstatSync(candidate); if (stat.isSymbolicLink()) throw new Error(`linked path refused: ${candidate}`); } catch (error) { if (error.code !== 'ENOENT') throw error; if (candidate === absolute && mustExist) throw error; } }
  if (mustExist && realpathSync.native(absolute) !== absolute) throw new Error(`redirected path refused: ${absolute}`); return absolute;
}
export function guardedReadJson(path, root) { return JSON.parse(readFileSync(guardLocalPath(path, root), 'utf8')); }
export function readPinnedSchema(path, root) { const bytes = readFileSync(guardLocalPath(path, root)); if (hashBytes(bytes) !== SCHEMA_SHA256) throw new Error('captured schema byte hash mismatch'); return JSON.parse(bytes); }

export function parseValidationArgs(argv) {
  if (!Array.isArray(argv)) throw new Error('argv must be an array'); if (!argv.length) return { reportName: null };
  if (argv.length !== 2 || argv[0] !== '--write-report' || !/^[a-z0-9][a-z0-9._-]*[.]json$/.test(argv[1]) || basename(argv[1]) !== argv[1]) throw new Error('usage: target-binding-validation-v2.mjs [--write-report simple-name.json]');
  return { reportName: argv[1] };
}

export function parseObservedTap(result) {
  if (!result || !Number.isInteger(result.status)) throw new Error('test process result missing status');
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`; const number = label => { const matches = [...output.matchAll(new RegExp(`\\b${label}\\s+(\\d+)\\s*$`, 'gm'))]; if (matches.length !== 1) throw new Error(`test output lacks one observed ${label} total`); return Number(matches[0][1]); };
  const observed = { tests: number('tests'), passed: number('pass'), failed: number('fail'), status: result.status };
  if (observed.tests === 0 || result.status !== 0 || observed.failed !== 0 || observed.tests !== observed.passed + observed.failed) throw new Error(`focused tests failed, empty or totals conflict: status=${result.status} tests=${observed.tests} pass=${observed.passed} fail=${observed.failed}`); return observed;
}

function defaultTestRunner(repoRoot) { const entry = guardLocalPath(join(repoRoot, 'tools', 'character-pose-process', 'target-binding.test.mjs'), repoRoot); return spawnSync(process.execPath, ['--test', entry], { cwd: repoRoot, encoding: 'utf8' }); }
export function validateBindingPackage({ repoRoot = DEFAULT_REPO, testRunner = defaultTestRunner } = {}) {
  const root = guardLocalPath(repoRoot, repoRoot); const evidence = guardLocalPath(join(root, EVIDENCE_RELATIVE), root); const schema = readPinnedSchema(join(root, SCHEMA_RELATIVE), root);
  const real = loadPinnedArtifact(root); const synthetic = loadBindingArtifact(root, { path: SYNTHETIC_ARTIFACT_RELATIVE, sha256: SYNTHETIC_ARTIFACT_SHA256, dependencyFingerprint: SYNTHETIC_DEPENDENCY_FINGERPRINT });
  if (real.bytes.length < 1 || synthetic.bytes.length < 1 || real.artifact.dependencyFingerprint === synthetic.artifact.dependencyFingerprint) throw new Error('artifact authentication evidence invalid');
  const read = name => guardedReadJson(join(evidence, name), root); const requests = { real: read(NAMES.realRequest), phase01: read(NAMES.phase01Request), phase03: read(NAMES.phase03Request) };
  const resolved = { real: resolveBinding(real.artifact, requests.real), phase01: resolveBinding(synthetic.artifact, requests.phase01), phase03: resolveBinding(synthetic.artifact, requests.phase03) };
  const savedResolved = { real: read(NAMES.realResolved), phase01: read(NAMES.phase01Resolved), phase03: read(NAMES.phase03Resolved) };
  for (const key of Object.keys(resolved)) if (canonicalJson(resolved[key]) !== canonicalJson(savedResolved[key])) throw new Error(`${key} saved resolved record differs from deterministic resolution`);
  const emitted = { phase01: emitBindingGraph(resolved.phase01, schema), phase03: emitBindingGraph(resolved.phase03, schema) }; const savedGraphs = { phase01: read(NAMES.phase01Graph), phase03: read(NAMES.phase03Graph) };
  for (const key of Object.keys(emitted)) { if (canonicalJson(emitted[key]) !== canonicalJson(savedGraphs[key])) throw new Error(`${key} saved graph differs from deterministic emission`); validateGraph(savedGraphs[key].graph, schema); }
  const tests = parseObservedTap(testRunner(root)); const sourceHashes = value => value.pieces.map(piece => piece.sourceHash); const graphTransforms = value => Object.values(value.graph).filter(node => node.class_type === 'AddLayer' && ['left-upper-arm', 'right-upper-arm'].includes(node.inputs.name)).map(node => [node.inputs.x, node.inputs.y, node.inputs.rotation]);
  const checks = { realArtifactPinned: requests.real.artifact.sha256 === ARTIFACT_SHA256 && requests.real.artifact.path === ARTIFACT_RELATIVE, syntheticArtifactPinned: requests.phase01.artifact.sha256 === SYNTHETIC_ARTIFACT_SHA256, realUnbound: resolved.real.state === 'unbound-donor' && !resolved.real.graphEligible, sourcesStableAcrossPhases: canonicalJson(sourceHashes(resolved.phase01)) === canonicalJson(sourceHashes(resolved.phase03)), graphTransformsChangeAcrossPhases: canonicalJson(graphTransforms(emitted.phase01)) !== canonicalJson(graphTransforms(emitted.phase03)), phase01GraphReproduced: true, phase03GraphReproduced: true };
  if (!Object.values(checks).every(Boolean)) throw new Error(`package checks failed: ${Object.entries(checks).filter(([, value]) => !value).map(([key]) => key).join(',')}`);
  return { schemaVersion: 2, state: 'read-only-validated', evidenceVersion: 'v4-resolved-and-graphs', checks, observedTests: { command: `${process.execPath} --test tools/character-pose-process/target-binding.test.mjs`, ...tests }, constraints: { networkUsed: false, imagesRead: false, reportWritten: false } };
}

export function writeValidationReportExclusive(report, path, repoRoot = DEFAULT_REPO) { const evidence = guardLocalPath(join(repoRoot, EVIDENCE_RELATIVE), repoRoot); const destination = guardLocalPath(path, repoRoot, { mustExist: false }); if (dirname(destination) !== evidence) throw new Error('report output must be directly inside binding-v1'); const bytes = `${JSON.stringify({ ...report, constraints: { ...report.constraints, reportWritten: true } }, null, 2)}\n`; const fd = openSync(destination, 'wx'); try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); } return destination; }

export function main(argv = process.argv.slice(2)) { const args = parseValidationArgs(argv); const report = validateBindingPackage(); if (args.reportName) writeValidationReportExclusive(report, join(DEFAULT_REPO, EVIDENCE_RELATIVE, args.reportName)); return report; }
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) { try { console.log(JSON.stringify(main())); } catch (error) { console.error(error.message); process.exitCode = 1; } }
