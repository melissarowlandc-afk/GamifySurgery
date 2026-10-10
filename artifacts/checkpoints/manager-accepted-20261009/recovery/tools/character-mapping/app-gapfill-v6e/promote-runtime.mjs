import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { activeCounts, addedAssets, addedIdentities, assertOwnerApproved, approvalSnapshot, batch, captureIntegrationBaseline, catalogPath, expectedCatalogSource, expectedRegistry, expectedRegistrySource, expectedRuntimeProvenance, hash, priorCounts, priorPatientCount, provenancePath, readJson, registryPath, rel, repo, resultingCounts, resultingPatientCount, root, snapshotJson, staffPools, successorIntegrated, tool, verifyAppendOnlyCatalog, verifyAppendOnlyRegistry, verifyFrozenReviewMetadata, writeJson } from './runtime-contract.mjs';

// Same strict preflight/write/idempotence sequence as accepted v6a/v6b/v5.
// All validation completes before the first runtime or public-art write.
captureIntegrationBaseline();
const { roster, approval } = assertOwnerApproved(); verifyFrozenReviewMetadata();
await import('./validate-approved-batch.mjs');
const before = snapshotJson(registryPath), current = readJson(resolve(repo, registryPath)), expected = expectedRegistry();
const alreadyPromoted = current.characters.length >= resultingCounts.identities;
assert.deepEqual(current, alreadyPromoted ? expected : before, 'refuse unrelated registry changes');
const originalCatalog = readFileSync(resolve(root, 'runtime-integration-baseline', catalogPath), 'utf8'), expandedCatalog = expectedCatalogSource();
const currentCatalog = readFileSync(resolve(repo, catalogPath), 'utf8');
assert([originalCatalog, expandedCatalog].includes(currentCatalog), 'catalog has unrelated edits; refusing overwrite');
verifyAppendOnlyCatalog({ allowBefore: !alreadyPromoted });
const registrySourcePath = 'apps/player/src/art/characterStillRegistry.ts';
const originalRegistrySource = readFileSync(resolve(root, 'runtime-integration-baseline', registrySourcePath), 'utf8'), expandedRegistrySource = expectedRegistrySource();
const currentRegistrySource = readFileSync(resolve(repo, registrySourcePath), 'utf8');
assert([originalRegistrySource, expandedRegistrySource].includes(currentRegistrySource), 'registry source has unrelated edits; refusing overwrite');
if (existsSync(approvalSnapshot)) assert.equal(hash(approvalSnapshot), hash(resolve(tool, 'owner-approval.json')));
const cohortRoot = resolve(repo, 'apps/player/public/art/characters', batch);
const copies = roster.identities.flatMap(identity => {
  const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
  return ['stand', 'sit'].flatMap(posture => Object.entries(manifest.poses[posture]).map(([direction, pose]) => ({ source: resolve(repo, pose.file), output: resolve(cohortRoot, identity.stableId, `${posture}-${direction}.png`), sha256: approval.acceptedPoses[identity.number][`${posture}-${direction}`] })));
});
assert.equal(copies.length, addedAssets);
const allowed = new Set(copies.map(copy => copy.output));
if (existsSync(cohortRoot)) for (const entry of readdirSync(cohortRoot, { recursive: true, withFileTypes: true })) if (entry.isFile()) assert(allowed.has(resolve(entry.parentPath, entry.name)), 'unexpected cohort destination file');
for (const copy of copies) { assert.equal(hash(copy.source), copy.sha256); if (existsSync(copy.output)) assert.equal(hash(copy.output), copy.sha256, 'destination differs; refusing overwrite'); }
const priorProvenance = snapshotJson(provenancePath), currentProvenance = readJson(resolve(repo, provenancePath));
assert.deepEqual(currentProvenance, alreadyPromoted ? expectedRuntimeProvenance(current) : priorProvenance, 'unrelated provenance mutation');
const receiptFile = resolve(root, 'runtime-integration.json');
assert.equal(existsSync(receiptFile), alreadyPromoted, 'unexpected integration receipt state');

if (!existsSync(approvalSnapshot)) copyFileSync(resolve(tool, 'owner-approval.json'), approvalSnapshot);
for (const copy of copies) if (!existsSync(copy.output)) { mkdirSync(dirname(copy.output), { recursive: true }); copyFileSync(copy.source, copy.output); }
if (currentCatalog === originalCatalog) writeFileSync(resolve(repo, catalogPath), expandedCatalog);
if (currentRegistrySource === originalRegistrySource) writeFileSync(resolve(repo, registrySourcePath), expandedRegistrySource);
if (!alreadyPromoted) writeJson(resolve(repo, registryPath), expected);
const registry = verifyAppendOnlyRegistry(); const catalog = verifyAppendOnlyCatalog();
const provenance = expectedRuntimeProvenance(registry);
if (!alreadyPromoted) writeJson(resolve(repo, provenancePath), provenance);
if (!alreadyPromoted) writeJson(receiptFile, {
  schemaVersion: `${batch}-runtime-integration/v1`, status: 'owner-delegated-manager-approved-locally-integrated-not-published',
  prior: { ...priorCounts, patients: priorPatientCount },
  appended: { identities: addedIdentities, assets: addedAssets, patients: resultingPatientCount - priorPatientCount, staff: addedIdentities },
  resulting: { ...resultingCounts, patients: resultingPatientCount }, staffPools: staffPools(catalog),
  registry: { path: registryPath, sha256: hash(resolve(repo, registryPath)) }, catalog: { path: catalogPath, sha256: hash(resolve(repo, catalogPath)) }, provenance: { path: provenancePath, sha256: hash(resolve(repo, provenancePath)) },
  ownerApproval: { path: rel(approvalSnapshot), sha256: hash(approvalSnapshot) },
  frozenArtReview: { policy: 'Original generation tools, pending worker/root labels and accepted source/pose/contact/chair/gallery/correction bytes stay exact. Separate owner-delegated manager approval and runtime receipts are the current status authority.' },
  selectability: { patients: roster.identities.filter(identity => identity.category === 'patient').map(identity => ({ stillId: identity.stableId, sex: identity.compatibleSexLabel, ageBand: identity.ageBand, intendedAge: identity.intendedAge })),
    staff: roster.identities.filter(identity => identity.category === 'staff').map(identity => ({ stillId: identity.stableId, eligibleStaffRoleDefinitionIds: identity.eligibleStaffRoleDefinitionIds })),
    enforcement: 'Exact existing sex/age-band patient pools or the single explicit staff role. Compatible saved patient and current/departing employee IDs are retained by unchanged selection/persistence code. appearance.ts is byte-identical.' },
  provenancePreservation: { preservedGlobalRecords: priorCounts.assets, newOwnerApprovedRecords: addedAssets }, runtimeFiles: copies.map(copy => ({ path: rel(copy.output), sha256: copy.sha256 })),
});
if (alreadyPromoted) {
  const receipt = readJson(receiptFile);
  assert.deepEqual(receipt.prior, { ...priorCounts, patients: priorPatientCount }); assert.deepEqual(receipt.resulting, { ...resultingCounts, patients: resultingPatientCount });
  assert.deepEqual(receipt.runtimeFiles, copies.map(copy => ({ path: rel(copy.output), sha256: copy.sha256 })));
  assert.equal(receipt.ownerApproval.sha256, hash(approvalSnapshot));
  for (const path of [registryPath, catalogPath, provenancePath]) {
    const key = path === registryPath ? 'registry' : path === catalogPath ? 'catalog' : 'provenance';
    // An earlier batch receipt stays immutable when its approved successor is
    // appended; the successor's pre-edit snapshot binds those historical bytes.
    const source = successorIntegrated() ? resolve(repo, 'artifacts/character-statics/staff-gapfill-v6d/runtime-integration-baseline', path) : resolve(repo, path);
    assert.equal(receipt[key].sha256, hash(source));
  }
}
console.log(JSON.stringify({ status: 'PASS', batch, integrated: addedIdentities, poses: addedAssets, runtime: activeCounts(), patients: resultingPatientCount, staffPools: staffPools(catalog), alreadyPromoted, ownerDelegatedManagerApproval: true, published: false }));
