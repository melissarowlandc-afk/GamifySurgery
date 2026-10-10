import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { addedAssets, addedIdentities, assertOwnerApproved, approvalSnapshot, batch, catalogPath, cohort, expectedCatalogSource, expectedRegistrySource, expectedRuntimeProvenance, hash, priorCounts, provenancePath, readIntegrationBaseline, readJson, registryPath, rel, repo, resultingCounts, resultingPatientCount, root, snapshotJson, staffPools, successorIntegrated, tool, verifyAppendOnlyCatalog, verifyAppendOnlyRegistry, verifyFrozenReviewMetadata, writeJson } from './runtime-contract.mjs';

const baseline = readIntegrationBaseline(), { roster, approval } = assertOwnerApproved();
const registry = verifyAppendOnlyRegistry(), catalog = verifyAppendOnlyCatalog(); verifyFrozenReviewMetadata();
assert.equal(readFileSync(resolve(repo, catalogPath), 'utf8'), expectedCatalogSource(), 'only recorded catalog append seams may change');
assert.equal(readFileSync(resolve(repo, 'apps/player/src/art/characterStillRegistry.ts'), 'utf8'), expectedRegistrySource(), 'only the registry cohort union may change');
const before = snapshotJson(provenancePath), provenance = readJson(resolve(repo, provenancePath));
assert.deepEqual(provenance, expectedRuntimeProvenance(registry));
assert.deepEqual(provenance.assets.slice(0, priorCounts.assets), before.assets, 'historical provenance records changed');
for (const [key, input] of Object.entries(before.inputs)) assert.deepEqual(provenance.inputs[key], input, 'historical input claims changed');
assert.equal(provenance.assets.length, registry.counts.assets); assert.equal(new Set(provenance.assets.map(asset => asset.outputFile)).size, registry.counts.assets);
const runtimeByFile = new Map(registry.characters.flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])].map(asset => [`apps/player/public/${asset.url}`, { entry, asset }])));
for (const record of provenance.assets) {
  const runtime = runtimeByFile.get(record.outputFile); assert(runtime, 'unregistered provenance output');
  assert.equal(record.identityId, runtime.entry.id); assert.equal(record.outputSha256, runtime.asset.sha256);
  assert.equal(hash(resolve(repo, record.outputFile)), record.outputSha256); assert.equal(hash(resolve(repo, record.sourceFile)), record.sourceSha256); assert.equal(record.sourceSha256, record.outputSha256);
}
assert.equal(hash(approvalSnapshot), hash(resolve(tool, 'owner-approval.json'))); assert.deepEqual(readJson(approvalSnapshot), approval);
const cohortRoot = resolve(repo, 'apps/player/public/art/characters', batch);
const files = readdirSync(cohortRoot, { recursive: true, withFileTypes: true }).filter(item => item.isFile()).map(item => rel(resolve(item.parentPath, item.name))).sort();
const expectedFiles = provenance.assets.filter(asset => asset.sourceInput === cohort).map(asset => asset.outputFile).sort();
assert.equal(files.length, addedAssets); assert.deepEqual(files, expectedFiles);
assert.deepEqual(registry.characters.slice(priorCounts.identities, resultingCounts.identities).map(entry => entry.id), roster.identities.map(identity => identity.stableId));
const additions = catalog.slice(priorCounts.identities, resultingCounts.identities);
assert(additions.every(entry => entry.category === 'staff'));
assert(additions.every(entry => JSON.stringify(entry.eligibleStaffRoleDefinitionIds) === JSON.stringify(['staff.app'])));
const priorCatalog = readJson(resolve(repo, baseline.catalog.path));
for (const role of new Set(priorCatalog.filter(entry => entry.category === 'staff').flatMap(entry => entry.eligibleStaffRoleDefinitionIds))) {
  if (role === 'staff.app') continue;
  assert.deepEqual(catalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes(role)), priorCatalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes(role)), 'other role pool changed: ' + role);
}
assert.equal(catalog.filter(entry => entry.category === 'staff' && entry.eligibleStaffRoleDefinitionIds.includes('staff.app')).length, 10);
assert.deepEqual(catalog.filter(entry => entry.category === 'patient' || entry.category === 'pediatric'), priorCatalog.filter(entry => entry.category === 'patient' || entry.category === 'pediatric'));
const patientPools = {};
for (const sex of ['Female', 'Male']) for (const ageBand of ['young_adult', 'adult', 'middle_aged', 'older_adult']) patientPools[`${sex}.${ageBand}`] = catalog.filter(entry => entry.category === 'patient' && entry.compatibleSexLabel === sex && entry.ageBand === ageBand).length;
const receipt = readJson(resolve(root, 'runtime-integration.json'));
assert.equal(receipt.schemaVersion, `${batch}-runtime-integration/v1`); assert.deepEqual(receipt.resulting, { ...resultingCounts, patients: resultingPatientCount });
for (const [key, path] of [['registry', registryPath], ['catalog', catalogPath], ['provenance', provenancePath]]) {
  const file = successorIntegrated() ? resolve(repo, 'artifacts/character-statics/staff-gapfill-v6d/runtime-integration-baseline', path) : resolve(repo, path);
  assert.equal(receipt[key].sha256, hash(file), 'batch receipt must retain its exact integration-state fingerprint');
}
assert.deepEqual(receipt.runtimeFiles.map(file => file.path).sort(), expectedFiles);
for (const file of receipt.runtimeFiles) assert.equal(hash(resolve(repo, file.path)), file.sha256);
const result = { status: 'PASS', batch, preservedIdentities: baseline.identityCount, preservedAssets: baseline.assetCount, preservedSourceControlArtHashes: baseline.approvedInputs.length,
  appendedIdentities: addedIdentities, appendedAssets: addedAssets, totalIdentities: registry.characters.length, totalAssets: registry.counts.assets, adultPatientDesigns: catalog.filter(entry => entry.category === 'patient').length,
  staffDesigns: catalog.filter(entry => entry.category === 'staff').length, patientPools, staffPools: staffPools(catalog), provenanceRecords: provenance.assets.length, exactApprovedRuntimeURLs: files.length,
  frozenReviewMetadataUnchanged: true, originalBatchToolsByteIdentical: true, ownerDelegatedManagerApproval: true, selectionSourceByteIdentical: true, authorizedSuccessorIntegrated: successorIntegrated(), hireableAppLooks: 10, otherRolePoolsUnchanged: true, pediatricCatalogUnchanged: true, published: false };
writeJson(resolve(root, 'validation/runtime-integration-results.json'), result); console.log(JSON.stringify(result));
