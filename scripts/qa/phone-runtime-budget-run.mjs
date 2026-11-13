// Runs in a fresh realm so Vite's build graph is never charged to the phone.
import './runtime-asset-fetch.mjs';
import { workerData, Worker } from 'node:worker_threads';
import { Session } from 'node:inspector';
import { serialize } from 'node:v8';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { root, out, capture } = workerData;
const app = await import(pathToFileURL(resolve(out, 'main.mjs')));
const fixtures = await (async () => {
  const all = JSON.parse(await readFile('tests/fixtures/level-five-integration-checkpoints-20261012.json', 'utf8'));
  return { 'integration-l4': all['integration-l4'], 'integration-build': all['integration-build'] };
})(); // Do not keep the entire journey's historical snapshots in the harness.
const allowance = process.env.CI ? 1.5 : 1, results = [];
const inspector = new Session(); inspector.connect();
const allocation = () => new Promise((done, fail) => inspector.post('HeapProfiler.getSamplingProfile', (e, r) => {
  if (e) return fail(e); let bytes = 0; const visit = n => { bytes += n.selfSize; for (const c of n.children ?? []) visit(c); }; visit(r.profile.head); done(bytes);
}));
for (const level of [4, 5]) {
  const state = app.deserializeGameState(JSON.stringify(fixtures[level === 4 ? 'integration-l4' : 'integration-build']));
  state.paused = false; state.openChartEncounterId = null; state.simulationSpeed = 4;
  const seed = app.createGameEvidenceCheckpoint(state), native = new Worker(pathToFileURL(resolve(out, 'engine.mjs')), { execArgv: ['--import='+pathToFileURL(resolve('scripts/qa/runtime-asset-fetch.mjs')).href] });
  const pending = new Map(); let sampleId = 0, maximumReplyBytes = 0, commandIndex = 0;
  const replySizes = [];
  const port = { onmessage: null, onerror: null, onmessageerror: null, terminate: () => { void native.terminate(); }, postMessage: data => native.postMessage(data) };
  native.on('message', data => { if (data.budget) { pending.get(data.budget)(data); pending.delete(data.budget); }
    else { if (data.kind === 'applied') { const bytes = serialize(data).byteLength; replySizes.push({ command: commandIndex, bytes }); if(commandIndex>2) maximumReplyBytes = Math.max(maximumReplyBytes, bytes); } port.onmessage?.({ data }); } });
  native.on('error', error => port.onerror?.({ error, preventDefault() {} }));
  const sample = (start = false, allocations = false) => new Promise(done => { const budget = ++sampleId; pending.set(budget, done); native.postMessage({ budget, start, allocations }); });
  const client = await app.OperationalEngineClient.create({ checkpoint: seed, visibleState: state, context: app.PROTOTYPE_DOMAIN_CONTEXT,
    useBundledContext: true, adoptSharedSeed: true, snapshotOnly: true, atRealMs: 1_800_000_000_000 }, () => port);
  client.setProjection([null, false, null, false, null, 0, { zoom: 1, panX: 0, panY: 0 }, [], false]);
  const baseline = await sample(true); global.gc();
  inspector.post('HeapProfiler.startSampling', { samplingInterval: 32768, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
  const rows = [], times = [], count = Number(process.env.PHONE_BUDGET_TICKS ?? 600); let advanced = 0;
  for (let tick = 1; tick <= count; tick++) {
    commandIndex = tick;
    if (client.state.paused) await client.execute({ type: 'SET_PAUSED', paused: false, operationId: `phone-budget.resume.${tick}` });
    const prior = client.state.facilityTick, at = performance.now();
    await client.execute({ type: 'ADVANCE_TICK', advancedAtRealMs: 1_800_000_000_000 + tick * 250, operationId: `phone-budget.${tick}` });
    advanced += Number(client.state.facilityTick > prior); times.push(performance.now() - at);
    if (tick % 512 === 0) await client.compact();
    if (tick % 120 === 0 || tick === count) { global.gc(); rows.push({ tick, main: process.memoryUsage().heapUsed, worker: await sample() }); }
  }
  const final = await sample(false, true), mainAllocated = await allocation();
  await new Promise(done => inspector.post('HeapProfiler.stopSampling', done));
  const row = { level, ticks: count, advanced, baseline, rows, final, mainAllocated, mainBytesPerTick: mainAllocated / count,
    engineBytesPerTick: final.allocated / count, maximumReplyBytes, replySizes, meanWallMs: times.reduce((a, b) => a + b, 0) / times.length,
    stateSha256: createHash('sha256').update(JSON.stringify(client.state)).digest('hex') };
  await writeFile(resolve(out, `level${level}.json`), JSON.stringify(row, null, 2));
  assert.equal(advanced, count, 'Every tick must advance; day-end resume is explicit');
  assert.ok(maximumReplyBytes < 768_000, 'Per-tick transport must remain smaller than a full clinic snapshot');
  assert.ok(rows.every(row => row.main < (capture ? 90 : 60) * 1024 ** 2 * allowance && row.worker.heap < (capture ? 110 : 70) * 1024 ** 2 * allowance), 'Main/engine retained heap budget');
  assert.ok(mainAllocated / count < 1_500_000 * allowance, 'Main allocations per command');
  assert.ok(final.allocated / count < 40_000_000 * allowance, 'Engine allocations per command');
  assert.ok(rows.at(-1).worker.heap - rows[0].worker.heap < 24 * 1024 ** 2 * allowance, 'Bounded retained tail after ten game hours');
  if (!capture) assert.ok(final.catalogue.indexed && final.catalogue.decodedCases <= 16, 'Engine template cache is bounded; no full parsed bank');
  if (!capture) assert.ok(final.catalogue.bankBytes > 0 && final.catalogue.bankBytes < 4_500_000, 'Compressed native catalogue budget');
  results.push(row); console.log(JSON.stringify({ ...row, replySizes: undefined })); client.dispose(); await native.terminate();
}
inspector.disconnect();
await writeFile(resolve(out, 'results.json'), JSON.stringify({ node: process.version, allowance, results }, null, 2));
console.log('PASS: public Level4/5 production worker/view heap, allocation and transport budgets');
