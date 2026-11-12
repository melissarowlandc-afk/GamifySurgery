#!/usr/bin/env node
// No installs, network, Git or fixture rewrites. Run with --expose-gc.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import os from 'node:os';
import { performance } from 'node:perf_hooks';
import { Session } from 'node:inspector/promises';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const option = (name, fallback) => args.find(arg => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const implementation = option('implementation', 'current');
const iterations = Number(option('iterations', '12')), batches = Number(option('batches', '3'));
const histories = option('histories', '100,1000,10000').split(',').map(Number);
const levels = option('levels', '1,5').split(',').map(Number);
const snapshotDirectory = option('snapshots', '');
const inputPaths = ['packages/game-domain/src/game-evidence.ts', 'packages/game-domain/src/game-evidence-json.ts',
  'packages/game-domain/src/game-evidence-index.ts', 'packages/game-domain/src/game-evidence-capture.ts', 'packages/game-domain/src/reducer.ts',
  'packages/game-domain/tests/fixtures/game-evidence-legacy.ts', 'packages/game-domain/tests/fixtures/game-evidence-json-legacy.ts',
  'packages/game-domain/tests/fixtures/evidence-perf.ts', 'tests/fixtures/level-five-integration-checkpoints-20261012.json',
  'tools/perf/evidence-incremental.mjs'];
const fingerprints = () => Object.fromEntries(inputPaths.map(file => [file, createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
const sourceHashes = fingerprints();
const api = await import(implementation === 'legacy'
  ? '../../packages/game-domain/tests/fixtures/game-evidence-legacy.ts'
  : '../../packages/game-domain/src/game-evidence.ts');
const { evidencePerfCheckpoint } = await import('../../packages/game-domain/tests/fixtures/evidence-perf.ts');
const { freezeEvidence } = await import('../../packages/game-domain/src/game-evidence-json.ts');
const { gameReducer } = await import('../../packages/game-domain/src/reducer.ts');
let checksum = 0;
const rows = [];
for (const level of levels) for (const history of histories) for (const kind of ['command', 'tick']) {
  const checkpoint = snapshotDirectory && level === 5
    ? freezeEvidence(JSON.parse(fs.readFileSync(`${snapshotDirectory}/level5-${history}.json`, 'utf8')))
    : evidencePerfCheckpoint(level, history);
  // First adoption/import is a separately measured verification boundary.
  const adoptStart = performance.now();
  const replay = checkpoint.evidence.records.findLast(record => record.kind === 'transition').value.command;
  api.applyGameEvidenceCommand(checkpoint, replay);
  const adoptionMs = performance.now() - adoptStart;
  let serial = 0;
  const run = () => {
    // Independent branches from the SAME fixed operational state/history;
    // excludes fixture construction, explicit export and worker/save codecs.
    const command = kind === 'tick'
      ? { type: 'ADVANCE_TICK', operationId: `perf.tick.${serial++}`, advancedAtRealMs: 2_000_000_000_000 }
      : { type: 'SET_SIMULATION_SPEED', speed: 2, operationId: `perf.speed.${serial++}` };
    const result = api.applyGameEvidenceCommand(checkpoint, command);
    checksum += result.state.facilityTick + result.appendedEvidence.length;
    return result;
  };
  for (let i = 0; i < 3; i++) run();
  const times = [];
  for (let batch = 0; batch < batches; batch++) {
    global.gc?.();
    const start = performance.now();
    for (let i = 0; i < iterations; i++) run();
    times.push((performance.now() - start) / iterations);
  }
  // V8 sampled allocated bytes (including objects collected during the run),
  // measured separately so inspector overhead cannot inflate the wall times.
  const inspector = new Session(); inspector.connect();
  global.gc?.();
  await inspector.post('HeapProfiler.startSampling', { samplingInterval: 1024,
    includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
  for (let i = 0; i < iterations; i++) run();
  const { profile } = await inspector.post('HeapProfiler.stopSampling');
  inspector.disconnect();
  const allocatedBytes = profile.samples.reduce((sum, sample) => sum + sample.size, 0) / iterations;
  const result = run(), cloneStart = performance.now();
  // Native worker-input clone INCLUDING lazy array/patch materialization.
  // This deliberately remains proportional to the full checkpoint (B scope).
  structuredClone(result.checkpoint);
  const checkpointCloneMs = performance.now() - cloneStart, exportStart = performance.now();
  api.importGameEvidence(result.checkpoint.snapshot, result.checkpoint.evidence);
  const verifiedCheckpointMs = performance.now() - exportStart;
  const sorted = [...times].sort((a, b) => a - b);
  const state = api.importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  const reducerStart = performance.now();
  for (let i = 0; i < iterations; i++) gameReducer(state, kind === 'tick'
    ? { type: 'ADVANCE_TICK', operationId: `perf.reducer.${i}`, advancedAtRealMs: 2_000_000_000_000 }
    : { type: 'SET_SIMULATION_SPEED', speed: 2, operationId: `perf.reducer.${i}` });
  const reducerOnlyMs = (performance.now() - reducerStart) / iterations;
  const row = { level, history, kind, medianMs: sorted[Math.floor(sorted.length / 2)], batchMs: times,
    sampledAllocatedBytesPerOp: Math.round(allocatedBytes), adoptionMs, checkpointCloneMs, verifiedCheckpointMs, reducerOnlyMs,
    appendedRecords: result.appendedEvidence.length };
  rows.push(row); console.log(JSON.stringify(row));
}
const slopes = [];
for (const level of levels) for (const kind of ['command', 'tick']) {
  const group = rows.filter(row => row.level === level && row.kind === kind);
  const xm = group.reduce((s, r) => s + r.history, 0) / group.length;
  const ym = group.reduce((s, r) => s + r.medianMs, 0) / group.length;
  slopes.push({ level, kind, msPer1000History: 1000 * group.reduce((s, r) => s + (r.history - xm) * (r.medianMs - ym), 0)
    / group.reduce((s, r) => s + (r.history - xm) ** 2, 0) });
}
if (JSON.stringify(sourceHashes) !== JSON.stringify(fingerprints())) throw new Error('Benchmark inputs changed during measurement.');
const report = { implementation, snapshotDirectory, sourceHashes, node: process.version, platform: `${process.platform}/${process.arch}`, cpu: os.cpus()[0].model,
  iterations, batches, method: 'fixed-state valid neutral prefix (or explicit real replay snapshots); actual measured commands; V8 allocations sampled separately at 1024 bytes; native checkpoint clone/materialization and complete verification reported separately',
  rows, slopes, checksum };
const output = option('output', '');
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ implementation, slopes, checksum }));
