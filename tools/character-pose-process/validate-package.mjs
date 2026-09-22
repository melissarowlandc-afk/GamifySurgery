#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import {
  ALLOWED_CLASSES, canonicalJson, emitProceduralGraph, hashFile, loadJson,
  validateGraph, validateLedger, validateRecipe, writeExclusiveJson,
} from './index.mjs';

function parseArgs(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 2) {
    if (!values[index]?.startsWith('--') || values[index + 1] === undefined) throw new Error('arguments must be --proof PATH --report PATH --checksums PATH');
    result[values[index].slice(2)] = values[index + 1];
  }
  return result;
}

function walk(directory) {
  return readdirSync(directory).flatMap(name => {
    const path = join(directory, name); return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const options = parseArgs(process.argv.slice(2));
const proof = resolve(options.proof); const reportPath = resolve(options.report); const checksumsPath = resolve(options.checksums);
if (!reportPath.startsWith(`${proof}\\`) || !checksumsPath.startsWith(`${proof}\\`)) throw new Error('report and checksums must stay inside the proof folder');
const tools = resolve(import.meta.dirname); const repo = resolve(tools, '../..');
const schemaPath = join(proof, 'parent-evidence', 'node-schemas.json');
const recipePath = join(proof, 'fixture-recipe.json'); const proposalPath = join(proof, 'synthetic-compositor-proposal.json'); const ledgerPath = join(proof, 'ledger-output.json');
const schema = loadJson(schemaPath), recipe = loadJson(recipePath), proposal = loadJson(proposalPath), ledger = loadJson(ledgerPath);

validateRecipe(recipe, { schemaFileSha256: hashFile(schemaPath) }); validateGraph(proposal.graph, schema); validateLedger(ledger);
const regenerated = emitProceduralGraph(recipe, schema, { schemaFileSha256: hashFile(schemaPath) });
if (canonicalJson(regenerated) !== canonicalJson(proposal)) throw new Error('saved proposal differs from deterministic emission');

const testRun = spawnSync(process.execPath, ['--test', join(tools, 'index.test.mjs')], { cwd: repo, encoding: 'utf8' });
if (testRun.status !== 0) throw new Error(`focused tests failed:\n${testRun.stdout}\n${testRun.stderr}`);
const testCount = Number(/(?:^|\n).*tests (\d+)/.exec(testRun.stdout)?.[1]);
const passCount = Number(/(?:^|\n).*pass (\d+)/.exec(testRun.stdout)?.[1]);
const failCount = Number(/(?:^|\n).*fail (\d+)/.exec(testRun.stdout)?.[1]);
if (![testCount, passCount, failCount].every(Number.isInteger) || testCount !== passCount + failCount || failCount !== 0) throw new Error('could not derive a passing focused-test count from TAP output');

const classCounts = {};
for (const node of Object.values(proposal.graph)) classCounts[node.class_type] = (classCounts[node.class_type] ?? 0) + 1;
if (Object.keys(classCounts).some(classType => !ALLOWED_CLASSES.includes(classType))) throw new Error('proposal contains a non-whitelisted class');
const saveNodes = Object.entries(proposal.graph).filter(([, node]) => node.class_type === 'SaveImage');
if (saveNodes.length !== 2 || proposal.outputs.length !== 2) throw new Error('proposal must declare exactly two SaveImage outputs');
const cases = [...new Set(proposal.transforms.map(transform => transform.probeCase))].sort();
const expectedCases = ['alpha-opaque', 'alpha-transparent', 'control', 'negative-rotation', 'noncentral-pivot', 'positive-rotation', 'signed-clipping'];
if (canonicalJson(cases) !== canonicalJson(expectedCases)) throw new Error('procedural case set mismatch');
if (ledger.revision !== 1 || ledger.events[0]?.status !== 'unexecuted' || ledger.events[0]?.jobId !== null || Object.values(ledger.events[0].actualDurationsMs).some(value => value !== null)) throw new Error('M1 ledger must record one unexecuted proposal with unknown actual durations');

const historyRoot = join(proof, 'prior-scaffold'); const historyList = readFileSync(join(historyRoot, 'SHA256SUMS.txt'), 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
const historyChecks = historyList.map(line => {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line); if (!match) throw new Error(`invalid historical checksum line ${line}`);
  const path = join(historyRoot, match[2]); const actual = hashFile(path); if (actual !== match[1]) throw new Error(`historical scaffold changed: ${match[2]}`);
  return { path: match[2].replaceAll('\\', '/'), sha256: actual };
});

const report = {
  schemaVersion: 1, state: 'm1-local-only-unexecuted-proposal', validatedAt: new Date().toISOString(),
  schemaEvidence: { path: relative(repo, schemaPath).replaceAll('\\', '/'), sha256: hashFile(schemaPath) },
  proposal: { path: relative(repo, proposalPath).replaceAll('\\', '/'), sha256: hashFile(proposalPath), deterministicReemissionMatches: true, nodeCount: Object.keys(proposal.graph).length, classCounts, saveNodes: saveNodes.map(([nodeId, node]) => ({ nodeId, filenamePrefix: node.inputs.filename_prefix })), probeCases: cases },
  ledger: { path: relative(repo, ledgerPath).replaceAll('\\', '/'), revision: ledger.revision, stateSha256: ledger.stateSha256, summary: ledger.summary },
  historicalScaffold: { preservedFiles: historyChecks.length, checks: historyChecks },
  focusedTests: { command: 'node --test tools/character-pose-process/index.test.mjs', exitCode: testRun.status, tests: testCount, passed: passCount, failed: failCount },
  assertions: {
    privateOrResidentInputsUsed: false, networkUsed: false, submitted: false, renderedOutputExists: false,
    measuredInstalledPivotOrClippingBehavior: false,
    notes: 'Schema validation and deterministic graph emission passed. Runtime compositor behavior remains an M2 proof gate.',
  },
};
writeExclusiveJson(reportPath, report);

const ownedFiles = [
  ...walk(tools),
  ...walk(proof).filter(path => !path.startsWith(join(proof, 'parent-evidence')) && path !== checksumsPath),
].filter(path => path !== checksumsPath);
const entries = Object.fromEntries(ownedFiles.sort().map(path => [relative(repo, path).replaceAll('\\', '/'), hashFile(path)]));
writeExclusiveJson(checksumsPath, { schemaVersion: 1, excludes: ['package-checksums.json (self)', 'parent-evidence/ (parent-owned; pinned separately in validation-report.json)'], entries });
process.stdout.write(`${JSON.stringify({ ok: true, report: reportPath, checksums: checksumsPath, filesHashed: Object.keys(entries).length, proposalSha256: report.proposal.sha256 })}\n`);
