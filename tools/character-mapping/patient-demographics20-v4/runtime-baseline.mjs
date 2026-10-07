import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { baselineManifest, runtimeIntegrationState, verifyAppendOnlyCatalog } from './runtime-contract.mjs';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const baselineFile = resolve(tool, 'runtime-baseline.json');
const registryFile = resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json');
const catalogFile = resolve(repo, 'packages/game-domain/src/characterStillCatalog.ts');
const appearanceFile = resolve(repo, 'packages/game-domain/src/patientAppearanceCatalog.ts');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const rel = file => relative(repo, file).replaceAll('\\', '/');

// These two established, side-effect-free data modules are the only evaluated
// modules. This reports current presentation counts; it never changes selection.
function loadCatalog() {
  const allowed = new Set([catalogFile, appearanceFile]), cache = new Map();
  function load(file) {
    assert(allowed.has(file), 'unexpected catalog dependency ' + file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const stripped = stripTypeScriptTypes(readFileSync(file, 'utf8'));
    const exports = [...stripped.matchAll(/export (?:const|function) (\w+)/g)].map(match => match[1]);
    const compiled = stripped.replace(/import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["'];/g, (_, names, specifier) => 'const {' + names + '} = require(' + JSON.stringify(specifier) + ');').replace(/\bexport /g, '') + '\nmodule.exports = {' + exports.join(',') + '};';
    runInNewContext(compiled, { module, require: specifier => load(resolve(dirname(file), specifier + '.ts')) }, { filename: file });
    return module.exports;
  }
  return JSON.parse(JSON.stringify(load(catalogFile).CHARACTER_STILL_CATALOG));
}

export function captureRuntimeBaseline() {
  if (existsSync(baselineFile)) return verifyRuntimeBaseline();
  const registry = json(registryFile), catalog = loadCatalog();
  const assets = registry.characters.flatMap(character => [
    ...Object.values(character.poses.stand), ...Object.values(character.poses.sit), ...(character.clipboard ? [character.clipboard] : []),
  ]).map(asset => {
    const file = resolve(repo, 'apps/player/public', asset.url.replace(/^\//, ''));
    assert.equal(hash(file), asset.sha256, 'runtime registry asset hash mismatch ' + asset.url);
    return { path: rel(file), sha256: hash(file), bytes: statSync(file).size };
  });
  assert.equal(registry.characters.length, 205, 'runtime identity baseline drift');
  assert.equal(registry.counts.identities, 205); assert.equal(registry.counts.assets, 1670);
  assert.equal(assets.length, 1670, 'runtime asset baseline drift');
  assert.equal(new Set(assets.map(item => item.path)).size, 1670, 'runtime asset paths must be unique');
  assert.equal(catalog.length, 205);
  assert.equal(catalog.filter(item => item.category === 'patient').length, 96);
  const baseline = {
    schemaVersion: 'patient-demographics20-v4-runtime-baseline/v1',
    registry: { path: rel(registryFile), sha256: hash(registryFile) },
    catalogFiles: [catalogFile, appearanceFile].map(file => ({ path: rel(file), sha256: hash(file) })),
    identityCount: 205, assetCount: 1670, selectablePatientCount: 96, assets,
  };
  writeFileSync(baselineFile, JSON.stringify(baseline, null, 2) + '\n');
  return baseline;
}

export function verifyRuntimeBaseline() {
  const baseline = json(baselineFile);
  assert.equal(baseline.schemaVersion, 'patient-demographics20-v4-runtime-baseline/v1');
  assert.equal(baseline.identityCount, 205); assert.equal(baseline.assetCount, 1670);
  assert.equal(baseline.selectablePatientCount, 96); assert.equal(baseline.assets.length, 1670);
  assert.equal(new Set(baseline.assets.map(item => item.path)).size, 1670);
  const integration = runtimeIntegrationState();
  if (existsSync(baselineManifest)) verifyAppendOnlyCatalog({ allowBefore: !integration.ready });
  for (const item of [...baseline.catalogFiles, ...baseline.assets]) {
    if (item.path === rel(catalogFile) && existsSync(baselineManifest)) continue; // Exact catalog values are checked above.
    assert.equal(hash(resolve(repo, item.path)), item.sha256, 'runtime data or asset changed: ' + item.path);
    if ('bytes' in item) assert.equal(statSync(resolve(repo, item.path)).size, item.bytes);
  }
  return baseline;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const baseline = captureRuntimeBaseline(); verifyRuntimeBaseline();
  const integration = runtimeIntegrationState();
  console.log(JSON.stringify({ status: 'PASS', preservedIdentities: baseline.identityCount, preservedAssets: baseline.assetCount, priorSelectablePatients: baseline.selectablePatientCount, runtimeReady: integration.ready, ownerApproval: integration.ownerApproval, priorRegistrySha256: baseline.registry.sha256 }));
}
