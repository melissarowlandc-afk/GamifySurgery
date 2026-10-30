#!/usr/bin/env node
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Worker } from 'node:worker_threads';
const option = (name, fallback = '') => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const workers = Number(option('workers', '3')), chunkSize = Number(option('chunk', '2500')), directory = option('directory');
const historicalFixtureMode = option('historical', 'require');
if (!directory || !Number.isInteger(workers) || workers < 1 || !Number.isInteger(chunkSize) || chunkSize < 1) throw new Error('Provide --directory and positive worker/chunk counts.');
if (!['require', 'report'].includes(historicalFixtureMode)) throw new Error('Unknown historical fixture mode.');
fs.mkdirSync(directory, { recursive: true });
const sourcePaths = [];
function collect(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = dir + '/' + entry.name;
  if (entry.isDirectory()) collect(file); else if (/\.(ts|json|mjs)$/.test(file)) sourcePaths.push(file);
} }
['packages/game-domain/src', 'packages/balance-config/src', 'packages/clinical-content/src'].forEach(collect);
sourcePaths.push('tests/fixtures/level-five-integration.ts', 'tests/fixtures/level-five-integration-checkpoints-20261012.json',
  'packages/game-domain/tests/fixtures/evidence-differential.ts', 'packages/game-domain/tests/fixtures/game-evidence-legacy.ts',
  'packages/game-domain/tests/fixtures/game-evidence-json-legacy.ts', 'tools/perf/evidence-full-replay.mjs', 'tools/perf/evidence-replay-worker.mjs');
const sha = text => createHash('sha256').update(text).digest('hex');
const fingerprints = () => Object.fromEntries(sourcePaths.sort().map(file => [file, sha(fs.readFileSync(file))]));
const sourceHashes = fingerprints(), started = performance.now();
const { captureEvidenceStream } = await import('../../packages/game-domain/tests/fixtures/evidence-differential.ts');
const stream = captureEvidenceStream(chunkSize, console.log, { historicalFixtureMode });
const endpoints = stream.endpoints.map(endpoint => ({ step: endpoint.step, text: JSON.stringify(endpoint.checkpoint) }));
fs.writeFileSync(path.join(directory, 'stream-summary.json'), JSON.stringify({ ...stream.summary, commandStreamSha256: sha(JSON.stringify(stream.commands)) }, null, 2) + '\n');
// Resumeable immutable work inputs; no regeneration is needed after a worker
// interruption. Each interval's expected endpoint is independently checked.
const jobs = endpoints.slice(1).map((end, range) => ({ range, start: endpoints[range].step,
  startCheckpoint: endpoints[range].text, expectedEndSha256: sha(end.text),
  commands: stream.commands.slice(endpoints[range].step, end.step) }));
for (const job of jobs) fs.writeFileSync(path.join(directory, `range-${job.range}.json`), JSON.stringify(job));
const results = [];
let next = 0;
async function runQueue() {
  while (next < jobs.length) {
    const job = jobs[next++];
    const result = await new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./evidence-replay-worker.mjs', import.meta.url), { workerData: job });
      let completed = false;
      worker.on('message', message => {
        if (message.kind === 'result') { completed = true; resolve(message); }
        else console.log(`Range ${message.range}: ${message.step}/${stream.commands.length}`);
      });
      worker.on('error', reject);
      worker.on('exit', code => { if (!completed) reject(new Error(`Range ${job.range} exited ${code} before a result.`)); });
    });
    fs.writeFileSync(path.join(directory, `result-${job.range}.json`), JSON.stringify(result, null, 2) + '\n');
    results.push(result); console.log(JSON.stringify(result));
  }
}
await Promise.all(Array.from({ length: workers }, runQueue));
results.sort((a, b) => a.range - b.range);
for (let i = 1; i < results.length; i++) {
  assert.equal(results[i - 1].end, results[i].start); assert.equal(results[i - 1].endSha256, results[i].startSha256);
}
assert.equal(results.reduce((sum, result) => sum + result.commands, 0), 26_710);
assert.deepEqual(fingerprints(), sourceHashes, 'Sources changed during replay.');
const report = { ...stream.summary, workers, historicalFixtureMode, ranges: results, commandStreamSha256: sha(JSON.stringify(stream.commands)),
  fullDeepEqualityAtEveryStep: true, exactBytesAndContinuousEndpoints: true,
  sourceHashes, elapsedMs: performance.now() - started };
fs.writeFileSync(path.join(directory, 'full-replay.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...stream.summary, elapsedMs: report.elapsedMs, ranges: results.length }));
