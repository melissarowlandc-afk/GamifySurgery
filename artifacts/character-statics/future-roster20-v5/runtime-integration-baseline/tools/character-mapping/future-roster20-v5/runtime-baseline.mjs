import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const baselineFile = resolve(tool, 'runtime-baseline.json');
const registryFile = resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json');
const catalogFile = resolve(repo, 'packages/game-domain/src/characterStillCatalog.ts');
const appearanceFile = resolve(repo, 'packages/game-domain/src/patientAppearanceCatalog.ts');
const protectedFiles = [
  registryFile, catalogFile, appearanceFile,
  resolve(repo, 'tools/character-mapping/gs026-employee-expansion-v1/pipeline.mjs'),
  resolve(repo, 'tools/character-mapping/gs026-employee-expansion-v1/assets/gs026-employee-001-cardinals-v1.png'),
  resolve(repo, 'apps/player/src/facility/approvedRoomPresentation.ts'),
  resolve(repo, 'apps/player/src/facility/approvedRoomProofData.json'),
  resolve(repo, 'apps/player/src/facility/characterPresentation.ts'),
  resolve(repo, 'apps/player/src/art/characterBitmapArt.ts'),
  resolve(repo, 'apps/player/public/art/rooms/gs015-v1/front-desk/furniture.webp'),
];
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const rel = file => relative(repo, file).replaceAll('\\', '/');

// Evaluate only the two existing, side-effect-free presentation data modules.
// No gameplay, selection, clinical content or saved state is executed here.
function loadCatalog() {
  const allowed = new Set([catalogFile, appearanceFile]), cache = new Map();
  function load(file) {
    assert(allowed.has(file), 'unexpected catalog dependency ' + file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const stripped = stripTypeScriptTypes(readFileSync(file, 'utf8'));
    const exports = [...stripped.matchAll(/export (?:const|function) (\w+)/g)].map(match => match[1]);
    const compiled = stripped.replace(/import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["'];/g,
      (_, names, specifier) => 'const {' + names + '} = require(' + JSON.stringify(specifier) + ');')
      .replace(/\bexport /g, '') + '\nmodule.exports = {' + exports.join(',') + '};';
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
  assert.equal(registry.characters.length, 225, 'runtime identity baseline drift');
  assert.equal(registry.counts.identities, 225); assert.equal(registry.counts.assets, 1830);
  assert.equal(assets.length, 1830); assert.equal(new Set(assets.map(item => item.path)).size, 1830);
  assert.equal(catalog.length, 225); assert.equal(catalog.filter(item => item.category === 'patient').length, 116);
  const baseline = {
    schemaVersion: 'future-roster20-v5-runtime-baseline/v1',
    policy: 'Exact hashes are immutable for this art-only batch. Any runtime, pipeline or approved chair source drift requires an explicit parent decision; no automatic rebasing.',
    protectedFiles: protectedFiles.map(file => ({ path: rel(file), sha256: hash(file), bytes: statSync(file).size })),
    identityCount: 225, assetCount: 1830, selectablePatientCount: 116,
    categoryCounts: Object.fromEntries([...new Set(catalog.map(item => item.category))].map(category => [category, catalog.filter(item => item.category === category).length])),
    stableIds: registry.characters.map(character => character.id), assets,
  };
  writeFileSync(baselineFile, JSON.stringify(baseline, null, 2) + '\n');
  return baseline;
}

export function verifyRuntimeBaseline() {
  const baseline = json(baselineFile);
  assert.equal(baseline.schemaVersion, 'future-roster20-v5-runtime-baseline/v1');
  assert.equal(baseline.identityCount, 225); assert.equal(baseline.assetCount, 1830);
  assert.equal(baseline.selectablePatientCount, 116); assert.equal(baseline.assets.length, 1830);
  assert.equal(baseline.stableIds.length, 225); assert.equal(new Set(baseline.stableIds).size, 225);
  assert.equal(new Set(baseline.assets.map(item => item.path)).size, 1830);
  assert.deepEqual(baseline.protectedFiles.map(item => item.path), protectedFiles.map(rel));
  for (const item of [...baseline.protectedFiles, ...baseline.assets]) {
    const file = resolve(repo, item.path);
    assert.equal(hash(file), item.sha256, 'protected runtime, source or asset changed: ' + item.path);
    assert.equal(statSync(file).size, item.bytes, 'protected file size changed: ' + item.path);
  }
  return baseline;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const baseline = captureRuntimeBaseline(); verifyRuntimeBaseline();
  console.log(JSON.stringify({ status: 'PASS', preservedIdentities: baseline.identityCount, preservedAssets: baseline.assetCount,
    selectablePatients: baseline.selectablePatientCount, protectedFiles: baseline.protectedFiles.length, runtimeReady: false, ownerApproval: 'pending' }));
}
