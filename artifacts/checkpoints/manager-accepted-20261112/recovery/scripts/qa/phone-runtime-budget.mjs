/** Offline production-bundle allocation/retention regression. No browser, save
 * service or private inputs. Run: node --expose-gc scripts/qa/phone-runtime-budget.mjs
 * Exercises the real worker client, processor and view patches for ten game
 * hours, with the existing 512-command local compaction barrier. Art and codec
 * lifetime have separate player tests/browser budgets. Node RSS is NOT iOS RAM.
 */
import { build } from 'vite';
import { Worker } from 'node:worker_threads';
import { Session } from 'node:inspector';
import { serialize } from 'node:v8';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

if (!global.gc) throw Error('Run with node --expose-gc');
const root = process.cwd(), label = process.env.PHONE_BUDGET_LABEL ?? '';
assert.match(label, /^[a-z0-9-]*$/);
const out = resolve(`.local-dev/phone-runtime-budget${label ? '-' + label : ''}`);
// Optional source-capture control for this measured pass. Ordinary regression
// runs always use current sources. Only the transport generator differs in a
// controlled before/after pair; no working-tree file is swapped or rewritten.
const capture = process.env.PHONE_BUDGET_CAPTURE;
const referenceDiff = process.env.PHONE_BUDGET_REFERENCE_DIFF === '1';
const capturePlugin = { name: 'phone-budget-source-control', enforce: 'pre', load(id) {
  if (!capture) return;
  const name = relative(root, id.split('?')[0]).replaceAll('\\', '/');
  if (name === 'apps/player/src/session/cloud/operationalStatePatch.ts' && !referenceDiff) return;
  if (!/^(apps\/player\/src|packages)\//.test(name)) return;
  const file = resolve(capture, name); if (existsSync(file)) return readFileSync(file, 'utf8');
} };
await mkdir(out, { recursive: true });
const pluginFile = resolve(out, 'plugin.mjs');
await build({ configFile: false, root, logLevel: 'error', build: { ssr: true, minify: true, outDir: out, emptyOutDir: false,
  rolldownOptions: { input: resolve('scripts/vite/runtime-clinical-data.ts'), output: { entryFileNames: 'plugin.mjs' } } } });
const { runtimeClinicalData } = await import(pathToFileURL(pluginFile));
const path = name => JSON.stringify(resolve(root, name).replaceAll('\\', '/'));
const worker = `import {parentPort} from 'node:worker_threads'; import {Session} from 'node:inspector';
import {OperationalEngineProcessor} from ${path('apps/player/src/session/cloud/operationalEngineProcessor.ts')};
import {dispatchOperationalEngineRequest} from ${path('apps/player/src/session/cloud/operationalEngineDispatch.ts')};
const inspector=new Session();inspector.connect();
const engine=new OperationalEngineProcessor();
const allocated=()=>new Promise((done,fail)=>inspector.post('HeapProfiler.getSamplingProfile',(e,r)=>{if(e)return fail(e);let bytes=0;const visit=n=>{bytes+=n.selfSize;for(const c of n.children??[])visit(c);};visit(r.profile.head);done(bytes);}));
parentPort.on('message',async request=>{if(request.budget){global.gc();const memory=process.memoryUsage();
 const bytes=request.allocations?await allocated():undefined;
 parentPort.postMessage({budget:request.budget,heap:memory.heapUsed,external:memory.external,allocated:bytes});
 if(request.start)inspector.post('HeapProfiler.startSampling',{samplingInterval:32768,includeObjectsCollectedByMajorGC:true,includeObjectsCollectedByMinorGC:true});return;}
 await dispatchOperationalEngineRequest(engine,request,reply=>parentPort.postMessage(reply));});`;
const main = `export {OperationalEngineClient} from ${path('apps/player/src/session/cloud/operationalEngineClient.ts')};
export {deserializeGameState,createGameEvidenceCheckpoint,PROTOTYPE_DOMAIN_CONTEXT} from '@gamify-surgery/game-domain';`;
for (const [name, source] of [['main', main], ['engine', worker]]) await build({ configFile: false, root, logLevel: 'error',
  plugins: [runtimeClinicalData(capture ?? root), capturePlugin, { name: 'phone-budget-entry', resolveId(id) { if (id === 'phone-budget') return '\0phone-budget'; }, load(id) { if (id === '\0phone-budget') return source; } }],
  define: { 'import.meta.env.MODE': '"production"', 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true' },
  build: { ssr: true, target: 'node22', minify: true, outDir: out, emptyOutDir: false, rolldownOptions: { input: 'phone-budget', output: { entryFileNames: `${name}.mjs`, chunkFileNames: `chunks/${name}-[name]-[hash].mjs` } } },
  ssr: { noExternal: [/^@gamify-surgery\//] } });
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
  const seed = app.createGameEvidenceCheckpoint(state), native = new Worker(pathToFileURL(resolve(out, 'engine.mjs')), { execArgv: [] });
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
  assert.ok(rows.every(row => row.main < 90 * 1024 ** 2 * allowance && row.worker.heap < 110 * 1024 ** 2 * allowance), 'Main/engine retained heap budget');
  assert.ok(mainAllocated / count < 1_500_000 * allowance, 'Main allocations per command');
  assert.ok(final.allocated / count < 40_000_000 * allowance, 'Engine allocations per command');
  assert.ok(rows.at(-1).worker.heap - rows[0].worker.heap < 24 * 1024 ** 2 * allowance, 'Bounded retained tail after ten game hours');
  results.push(row); console.log(JSON.stringify({ ...row, replySizes: undefined })); client.dispose(); await native.terminate();
}
inspector.disconnect();
await writeFile(resolve(out, 'results.json'), JSON.stringify({ node: process.version, allowance, results }, null, 2));
console.log('PASS: public Level4/5 production worker/view heap, allocation and transport budgets');
