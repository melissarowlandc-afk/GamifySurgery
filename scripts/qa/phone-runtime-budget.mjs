/** Offline production-bundle allocation/retention regression. No browser, save
 * service or private inputs. Run: node --expose-gc scripts/qa/phone-runtime-budget.mjs
 * Exercises the real worker client, processor and view patches for ten game
 * hours, with the existing 512-command local compaction barrier. Art and codec
 * lifetime have separate player tests/browser budgets. Node RSS is NOT iOS RAM.
 */
import './runtime-asset-fetch.mjs';
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
  rolldownOptions: { input: resolve(capture ?? root, 'scripts/vite/runtime-clinical-data.ts'), output: { entryFileNames: 'plugin.mjs' } } } });
const { runtimeClinicalData } = await import(pathToFileURL(pluginFile));
const path = name => JSON.stringify(resolve(root, name).replaceAll('\\', '/'));
const worker = `import {parentPort} from 'node:worker_threads'; import {Session} from 'node:inspector';
import {prepareRuntimeCaseCatalogue,runtimeCatalogueStatus} from ${path('apps/player/src/mobile/performance/runtimeCatalogue.ts')};
import {OperationalEngineProcessor} from ${path('apps/player/src/session/cloud/operationalEngineProcessor.ts')};
import {dispatchOperationalEngineRequest} from ${path('apps/player/src/session/cloud/operationalEngineDispatch.ts')};
const inspector=new Session();inspector.connect();
const engine=new OperationalEngineProcessor();
const allocated=()=>new Promise((done,fail)=>inspector.post('HeapProfiler.getSamplingProfile',(e,r)=>{if(e)return fail(e);let bytes=0;const visit=n=>{bytes+=n.selfSize;for(const c of n.children??[])visit(c);};visit(r.profile.head);done(bytes);}));
parentPort.on('message',async request=>{if(request.budget){global.gc();const memory=process.memoryUsage();
 const bytes=request.allocations?await allocated():undefined;
 parentPort.postMessage({budget:request.budget,heap:memory.heapUsed,external:memory.external,arrayBuffers:memory.arrayBuffers,catalogue:runtimeCatalogueStatus(),allocated:bytes});
 if(request.start)inspector.post('HeapProfiler.startSampling',{samplingInterval:32768,includeObjectsCollectedByMajorGC:true,includeObjectsCollectedByMinorGC:true});return;}
 await prepareRuntimeCaseCatalogue(); dispatchOperationalEngineRequest(engine,request,reply=>parentPort.postMessage(reply));});`;
const main = `export {OperationalEngineClient} from ${path('apps/player/src/session/cloud/operationalEngineClient.ts')};
export {deserializeGameState,createGameEvidenceCheckpoint,PROTOTYPE_DOMAIN_CONTEXT} from '@gamify-surgery/game-domain';`;
for (const [name, source] of [['main', main], ['engine', worker]]) await build({ configFile: false, root, logLevel: 'error',
  plugins: [runtimeClinicalData(capture ?? root), capturePlugin, { name: 'phone-budget-entry', resolveId(id) { if (id === 'phone-budget') return '\0phone-budget'; }, load(id) { if (id === '\0phone-budget') return source; } }],
  define: { 'import.meta.env.MODE': '"production"', 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true' },
  build: { ssr: true, emitAssets: true, target: 'node22', minify: true, outDir: out, emptyOutDir: false, rolldownOptions: { input: 'phone-budget', output: { entryFileNames: `${name}.mjs`, chunkFileNames: `chunks/${name}-[name]-[hash].mjs` } } },
  ssr: { noExternal: [/^@gamify-surgery\//] } });
// Compiler/plugin caches can retain tens of MB in Node; production pages
// never import Vite. Measure the actual bundle in a separate fresh JS realm.
const runner = new Worker(new URL('./phone-runtime-budget-run.mjs', import.meta.url), {
  execArgv: [], workerData: { root, out, capture }, stdout: true, stderr: true,
});
runner.stdout.pipe(process.stdout); runner.stderr.pipe(process.stderr);
await new Promise((done, fail) => { runner.once('error', fail); runner.once('exit', code => code === 0 ? done() : fail(Error('Phone budget runner exited ' + code))); });
