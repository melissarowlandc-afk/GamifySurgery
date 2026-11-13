/** Offline production scene/cache loading replay. No browser or actual network:
 * fixed80ms request latency, actual public PNG/WebP byte sizes,20MB/s per-request
 * throughput and100MP/s raster replay. Measures scheduler behavior; manager's
 * production browser/iPhone run measures real download/decode/paint latency.
 * PHONE_ART_LEVEL=4|5 (default5), PHONE_ART_PHASE=after|before, optional
 * PHONE_ART_CAPTURE=<round2/entry> freezes packages/session modules and supplies
 * the old mobile/scene source for a before run. Never swaps working-tree files.
 */
import './runtime-asset-fetch.mjs';
import { build } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd(), phase = process.env.PHONE_ART_PHASE ?? 'after';
if (!['after', 'before'].includes(phase)) throw Error('Expected PHONE_ART_PHASE=after|before');
const out = resolve(`.local-dev/phone-art-loading/${phase}`), capture = process.env.PHONE_ART_CAPTURE;
await mkdir(out, { recursive: true });
process.env.PHONE_ART_OUTPUT = out;
const pluginFile = resolve(out, 'plugin.mjs');
await build({ configFile: false, root, logLevel: 'error', build: { ssr: true, minify: true, outDir: out, emptyOutDir: false,
  rolldownOptions: { input: resolve('scripts/vite/runtime-clinical-data.ts'), output: { entryFileNames: 'plugin.mjs' } } } });
const { runtimeClinicalData } = await import(pathToFileURL(pluginFile));
const shim = resolve(out, 'phaser-shim.ts');
await writeFile(shim, `export default {Scene:class {},BlendModes:{MULTIPLY:2,SCREEN:3},Textures:{FilterMode:{NEAREST:0,LINEAR:1}},
Loader:{Events:{COMPLETE:'complete'}},Display:{Color:{HexStringToColor:s=>({color:parseInt(s.replace('#',''),16)})}}};`);
await build({ configFile: false, root, logLevel: 'error', plugins: [runtimeClinicalData(root), {
  name: 'phone-art-source-control', enforce: 'pre', load(id) {
    if (!capture) return;
    const name = relative(root, id.split('?')[0]).replaceAll('\\', '/');
    if (name.startsWith('packages/') || name.startsWith('apps/player/src/session/') || phase === 'before' &&
      (name.startsWith('apps/player/src/mobile/performance/') || name === 'apps/player/src/facility/FacilityScene.ts')) {
      const file = resolve(capture, name); if (existsSync(file)) return readFileSync(file, 'utf8');
    }
  },
}], resolve: { alias: { phaser: shim } }, ssr: { noExternal: [/^@gamify-surgery\//] },
  build: { emitAssets: true, ssr: resolve('scripts/qa/phone-art-loading.entry.ts'), target: 'node22', minify: true, outDir: out, emptyOutDir: false,
    rolldownOptions: { output: { entryFileNames: 'loading.mjs' } } } });
await import(pathToFileURL(resolve(out, 'loading.mjs')));
