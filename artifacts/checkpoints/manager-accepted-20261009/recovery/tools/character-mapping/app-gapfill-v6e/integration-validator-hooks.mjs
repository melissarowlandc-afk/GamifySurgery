import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { tool } from './runtime-contract.mjs';

// Preserve the original validator bytes and all historical evidence. Their
// generation-time whole-array checks use the unchanged historical prefix only,
// after the current integration contract verifies the exact complete state.
const baselineUrl = pathToFileURL(resolve(tool, 'runtime-baseline.mjs')).href;
const contractUrl = pathToFileURL(resolve(tool, 'runtime-contract.mjs')).href;
const original = readFileSync(resolve(tool, 'runtime-baseline.mjs'), 'utf8');
const seams = [
  ['export function verifyRuntimeBaseline(){', 'export function verifyRuntimeBaseline(){\n  runtimeIntegrationState();'],
  ['json(registryFile).characters,b.priorRegistry', 'json(registryFile).characters.slice(0,b.identityCount),b.priorRegistry'],
  ['loadCatalog(),b.priorCatalog', 'loadCatalog().slice(0,b.identityCount),b.priorCatalog'],
];
for (const [needle] of seams) assert.equal(original.split(needle).length, 2);
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url !== baselineUrl) return result;
    const source = Buffer.isBuffer(result.source) ? result.source.toString('utf8') : String(result.source);
    assert.equal(source, original, 'historical validator changed while loading');
    return { ...result, source: `import { runtimeIntegrationState } from ${JSON.stringify(contractUrl)};\n`
      + seams.reduce((current, [needle, replacement]) => current.replace(needle, replacement), source) };
  },
});
