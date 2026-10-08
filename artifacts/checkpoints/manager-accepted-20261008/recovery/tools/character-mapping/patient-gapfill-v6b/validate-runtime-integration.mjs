import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertOwnerApproved, approvalSnapshot, catalogPath, expectedCatalogSource, expectedRegistrySource, expectedRuntimeProvenance, hash, provenancePath, readIntegrationBaseline, readJson, registryPath, rel, repo, root, snapshotJson, tool, verifyAppendOnlyCatalog, verifyAppendOnlyRegistry, verifyFrozenReviewMetadata, writeJson } from './runtime-contract.mjs';

const baseline = readIntegrationBaseline(), { roster, approval } = assertOwnerApproved();
const registry = verifyAppendOnlyRegistry(), catalog = verifyAppendOnlyCatalog();
verifyFrozenReviewMetadata();
assert.equal(readFileSync(resolve(repo, catalogPath), 'utf8'), expectedCatalogSource(), 'catalog source may change only at the recorded append seams');
assert.equal(readFileSync(resolve(repo, 'apps/player/src/art/characterStillRegistry.ts'), 'utf8'), expectedRegistrySource(), 'registry source may only append the cohort type');
const pinned = readJson(resolve(tool, 'runtime-baseline.json'));
for (const asset of pinned.assets) {
  assert.equal(hash(resolve(repo, asset.path)), asset.sha256);
  assert.equal(statSync(resolve(repo, asset.path)).size, asset.bytes);
}
const before = snapshotJson(provenancePath), provenance = readJson(resolve(repo, provenancePath));
assert.deepEqual(provenance, expectedRuntimeProvenance(registry));
assert.deepEqual(provenance.assets.slice(0, 2150), before.assets, 'historical provenance records changed');
for (const [key, input] of Object.entries(before.inputs)) assert.deepEqual(provenance.inputs[key], input, 'historical input claim changed');
assert.equal(provenance.assets.length, 2310);
assert.equal(new Set(provenance.assets.map(asset => asset.outputFile)).size, 2310);
const runtimeByFile = new Map(registry.characters.flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])].map(asset => [`apps/player/public/${asset.url}`, { entry, asset }])));
for (const record of provenance.assets) {
  const runtime = runtimeByFile.get(record.outputFile); assert(runtime, 'unregistered provenance output');
  assert.equal(record.identityId, runtime.entry.id);
  assert.equal(record.outputSha256, runtime.asset.sha256);
  assert.equal(hash(resolve(repo, record.outputFile)), record.outputSha256);
  assert.equal(hash(resolve(repo, record.sourceFile)), record.sourceSha256);
  assert.equal(record.sourceSha256, record.outputSha256);
}
assert.equal(hash(approvalSnapshot), hash(resolve(tool, 'owner-approval.json')));
assert.deepEqual(readJson(approvalSnapshot), approval);
const cohortRoot = resolve(repo, 'apps/player/public/art/characters/patient-gapfill-v6b');
const files = readdirSync(cohortRoot, { recursive: true, withFileTypes: true }).filter(item => item.isFile()).map(item => rel(resolve(item.parentPath, item.name))).sort();
const expectedFiles = provenance.assets.filter(asset => asset.sourceInput === 'patientGapfillV6b').map(asset => asset.outputFile).sort();
assert.equal(files.length, 160); assert.deepEqual(files, expectedFiles);
assert.deepEqual(registry.characters.slice(265).map(entry => entry.id), roster.identities.map(identity => identity.stableId));
assert(catalog.slice(265).every(entry => entry.category === 'patient'), 'v6b may append only patients');
const patientPools = {};
for (const sex of ['Female', 'Male']) for (const ageBand of ['young_adult', 'adult', 'middle_aged', 'older_adult']) {
  patientPools[`${sex}.${ageBand}`] = catalog.filter(entry => entry.category === 'patient' && entry.compatibleSexLabel === sex && entry.ageBand === ageBand).length;
}
const receipt = readJson(resolve(root, 'runtime-integration.json'));
assert.equal(receipt.registry.sha256, hash(resolve(repo, registryPath)));
assert.equal(receipt.catalog.sha256, hash(resolve(repo, catalogPath)));
assert.equal(receipt.provenance.sha256, hash(resolve(repo, provenancePath)));
assert.deepEqual(receipt.runtimeFiles.map(file => file.path).sort(), expectedFiles);
for (const file of receipt.runtimeFiles) assert.equal(hash(resolve(repo, file.path)), file.sha256);
const result = { status: 'PASS', preservedIdentities: baseline.identityCount, preservedAssets: baseline.assetCount, preservedSourceControlArtHashes: baseline.approvedInputs.length,
  appendedIdentities: 20, appendedAssets: 160, totalIdentities: registry.characters.length, totalAssets: registry.counts.assets,
  adultPatientDesigns: catalog.filter(entry => entry.category === 'patient').length,
  patientPools, provenanceRecords: provenance.assets.length, exactApprovedRuntimeURLs: files.length, frozenReviewMetadataUnchanged: true, ownerDelegatedManagerApproval: true, selectionSourceByteIdentical: true, published: false };
writeJson(resolve(root, 'validation/runtime-integration-results.json'), result);
console.log(JSON.stringify(result));
