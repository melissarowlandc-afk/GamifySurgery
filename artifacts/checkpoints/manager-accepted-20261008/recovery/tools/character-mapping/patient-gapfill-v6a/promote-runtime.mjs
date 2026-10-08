import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { assertOwnerApproved, approvalSnapshot, captureIntegrationBaseline, catalogPath, expectedCatalogSource, expectedRegistrySource, expectedRuntimeCharacters, expectedRuntimeProvenance, hash, provenancePath, readJson, registryPath, rel, repo, resultingCounts, root, snapshotJson, tool, verifyAppendOnlyCatalog, verifyAppendOnlyRegistry, verifyFrozenReviewMetadata, writeJson } from './runtime-contract.mjs';

// Complete source, approval, preservation, destination and provenance preflight
// before the first runtime write. Never replace an existing image or baseline.
captureIntegrationBaseline();
const { roster, approval } = assertOwnerApproved();
verifyFrozenReviewMetadata();
const originalArguments = [...process.argv];
process.argv.push('--require-complete', '--check-only');
try {
  await import('./validate-roster.mjs');
  await import('./validate-placement-qa.mjs');
  await import('./validate-worker-review.mjs');
} finally { process.argv = originalArguments; }
const before = snapshotJson(registryPath), current = readJson(resolve(repo, registryPath));
const expected = { ...before, counts: resultingCounts, characters: [...before.characters, ...expectedRuntimeCharacters()] };
assert([245, 265].includes(current.characters.length), 'unrelated runtime additions detected');
const alreadyPromoted = current.characters.length === 265;
assert.deepEqual(current, alreadyPromoted ? expected : before, 'registry differs from the only allowed append-only states');
const catalogSnapshot = resolve(root, 'runtime-integration-baseline', catalogPath);
const originalCatalog = readFileSync(catalogSnapshot, 'utf8'), expandedCatalog = expectedCatalogSource();
const currentCatalog = readFileSync(resolve(repo, catalogPath), 'utf8');
assert([originalCatalog, expandedCatalog].includes(currentCatalog), 'catalog has unrelated edits; refusing overwrite');
verifyAppendOnlyCatalog({ allowBefore: !alreadyPromoted });
const registrySourcePath = 'apps/player/src/art/characterStillRegistry.ts';
const originalRegistrySource = readFileSync(resolve(root, 'runtime-integration-baseline', registrySourcePath), 'utf8');
const expandedRegistrySource = expectedRegistrySource(), currentRegistrySource = readFileSync(resolve(repo, registrySourcePath), 'utf8');
assert([originalRegistrySource, expandedRegistrySource].includes(currentRegistrySource), 'registry source has unrelated edits; refusing overwrite');
if (existsSync(approvalSnapshot)) assert.equal(hash(approvalSnapshot), hash(resolve(tool, 'owner-approval.json')));
const cohortRoot = resolve(repo, 'apps/player/public/art/characters/patient-gapfill-v6a');
const copies = roster.identities.flatMap(identity => {
  const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
  return ['stand', 'sit'].flatMap(posture => Object.entries(manifest.poses[posture]).map(([direction, pose]) => ({ source: resolve(repo, pose.file), output: resolve(cohortRoot, identity.stableId, `${posture}-${direction}.png`), sha256: approval.acceptedPoses[identity.number][`${posture}-${direction}`] })));
});
assert.equal(copies.length, 160);
const allowed = new Set(copies.map(copy => copy.output));
if (existsSync(cohortRoot)) for (const entry of readdirSync(cohortRoot, { recursive: true, withFileTypes: true })) if (entry.isFile()) assert(allowed.has(resolve(entry.parentPath, entry.name)), 'unrelated public cohort file detected');
for (const copy of copies) {
  assert.equal(hash(copy.source), copy.sha256);
  if (existsSync(copy.output)) assert.equal(hash(copy.output), copy.sha256, 'destination differs; refusing overwrite');
}
const priorProvenance = snapshotJson(provenancePath), currentProvenance = readJson(resolve(repo, provenancePath));
assert.deepEqual(currentProvenance, alreadyPromoted ? expectedRuntimeProvenance(current) : priorProvenance, 'unrelated provenance mutation detected');
const receiptFile = resolve(root, 'runtime-integration.json');
if (!alreadyPromoted) assert(!existsSync(receiptFile), 'unexpected prior integration receipt');

if (!existsSync(approvalSnapshot)) copyFileSync(resolve(tool, 'owner-approval.json'), approvalSnapshot);
for (const copy of copies) if (!existsSync(copy.output)) { mkdirSync(dirname(copy.output), { recursive: true }); copyFileSync(copy.source, copy.output); }
if (currentCatalog === originalCatalog) writeFileSync(resolve(repo, catalogPath), expandedCatalog);
if (currentRegistrySource === originalRegistrySource) writeFileSync(resolve(repo, registrySourcePath), expandedRegistrySource);
if (!alreadyPromoted) writeJson(resolve(repo, registryPath), expected);
const registry = verifyAppendOnlyRegistry(); verifyAppendOnlyCatalog();
const provenance = expectedRuntimeProvenance(registry);
if (!alreadyPromoted) writeJson(resolve(repo, provenancePath), provenance);
const receipt = {
  schemaVersion: 'patient-gapfill-v6a-runtime-integration/v1', status: 'owner-delegated-manager-approved-locally-integrated-not-published',
  prior: { identities: 245, assets: 1990, patients: 120 },
  appended: { identities: 20, assets: 160, patients: 20 },
  resulting: { ...registry.counts, patients: 140 },
  registry: { path: registryPath, sha256: hash(resolve(repo, registryPath)) }, catalog: { path: catalogPath, sha256: hash(resolve(repo, catalogPath)) }, provenance: { path: provenancePath, sha256: hash(resolve(repo, provenancePath)) },
  ownerApproval: { path: rel(approvalSnapshot), sha256: hash(approvalSnapshot) },
  frozenArtReview: { policy: 'Historical worker-review status labels stay byte-exact. This receipt and the owner-delegated manager approval supersede pending labels without changing accepted sources, controls, poses, proofs or coordinates.' },
  selectability: { patients: roster.identities.map(identity => ({ stillId: identity.stableId, sex: identity.compatibleSexLabel, ageBand: identity.ageBand, intendedAge: identity.intendedAge })), enforcement: 'Only existing compatible patientStillEligibleEntries sex/age-band pools. Patient occupancy/LRU logic and compatible saved IDs are unchanged; appearance.ts is byte-identical to the pre-edit baseline.' },
  provenancePreservation: { preservedGlobalRecords: 1990, newOwnerApprovedRecords: 160 },
  runtimeFiles: copies.map(copy => ({ path: rel(copy.output), sha256: copy.sha256 })),
};
if (existsSync(receiptFile)) assert.deepEqual(readJson(receiptFile), receipt, 'existing integration receipt changed');
else writeJson(receiptFile, receipt);
console.log(JSON.stringify({ status: 'PASS', integrated: 20, poses: 160, runtime: registry.counts, patients: 140, ownerDelegatedManagerApproval: true, published: false }));
