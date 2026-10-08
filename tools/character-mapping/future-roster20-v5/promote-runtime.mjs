import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { assertOwnerApproved, approvalSnapshot, captureIntegrationBaseline, catalogPath, expectedCatalogSource, expectedRuntimeCharacters, expectedRuntimeProvenance, hash, provenancePath, readJson, registryPath, rel, repo, resultingCounts, root, snapshotJson, tool, verifyAppendOnlyCatalog, verifyAppendOnlyRegistry, verifyFrozenReviewMetadata, writeJson } from './runtime-contract.mjs';

// Complete source, approval, preservation, destination and provenance preflight
// before the first runtime write. Never replace an existing image or baseline.
captureIntegrationBaseline();
const { roster, approval } = assertOwnerApproved();
verifyFrozenReviewMetadata();
const originalArguments = [...process.argv];
process.argv.push('--require-root-review', '--check-only');
try { await import('./validate-roster.mjs'); } finally { process.argv = originalArguments; }
const before = snapshotJson(registryPath), current = readJson(resolve(repo, registryPath));
const expected = { ...before, counts: resultingCounts, characters: [...before.characters, ...expectedRuntimeCharacters()] };
assert([225, 245].includes(current.characters.length), 'unrelated runtime additions detected');
const alreadyPromoted = current.characters.length === 245;
assert.deepEqual(current, alreadyPromoted ? expected : before, 'registry differs from the only allowed append-only states');
const catalogSnapshot = resolve(root, 'runtime-integration-baseline', catalogPath);
const originalCatalog = readFileSync(catalogSnapshot, 'utf8'), expandedCatalog = expectedCatalogSource();
const currentCatalog = readFileSync(resolve(repo, catalogPath), 'utf8');
assert([originalCatalog, expandedCatalog].includes(currentCatalog), 'catalog has unrelated edits; refusing overwrite');
verifyAppendOnlyCatalog({ allowBefore: !alreadyPromoted });
if (existsSync(approvalSnapshot)) assert.equal(hash(approvalSnapshot), hash(resolve(tool, 'owner-approval.json')));
const cohortRoot = resolve(repo, 'apps/player/public/art/characters/future-roster20-v5');
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
if (!alreadyPromoted) writeJson(resolve(repo, registryPath), expected);
const registry = verifyAppendOnlyRegistry(); verifyAppendOnlyCatalog();
const provenance = expectedRuntimeProvenance(registry);
if (!alreadyPromoted) writeJson(resolve(repo, provenancePath), provenance);
const receipt = {
  schemaVersion: 'future-roster20-v5-runtime-integration/v1', status: 'owner-approved-locally-integrated-not-published',
  prior: { identities: 225, assets: 1830, patients: 116, radiologists: 4 },
  appended: { identities: 20, assets: 160, radiologists: 12, registeredInactiveStaff: 4, patients: 4 },
  resulting: { ...registry.counts, patients: 120, radiologists: 16 },
  registry: { path: registryPath, sha256: hash(resolve(repo, registryPath)) }, catalog: { path: catalogPath, sha256: hash(resolve(repo, catalogPath)) }, provenance: { path: provenancePath, sha256: hash(resolve(repo, provenancePath)) },
  ownerApproval: { path: rel(approvalSnapshot), sha256: hash(approvalSnapshot) },
  frozenArtReview: { policy: 'Historical art-review status labels stay byte-exact. This receipt and the exact owner approval supersede pending labels without changing approved sources, controls, poses, proofs or coordinates.' },
  selectability: { radiologists: roster.identities.filter(identity => identity.eligibleStaffRoleDefinitionIds?.length).map(identity => identity.stableId), inactiveStaff: roster.identities.filter(identity => identity.plannedStaffRole).map(identity => identity.stableId), patients: roster.identities.filter(identity => identity.category === 'patient').map(identity => identity.stableId), enforcement: 'staffStillEligibleEntries requires explicit role membership; APP and executive entries have empty lists and no runtime role. Existing patient age/sex occupancy and LRU selection is unchanged.' },
  provenancePreservation: { preservedGlobalRecords: 1830, newOwnerApprovedRecords: 160 },
  runtimeFiles: copies.map(copy => ({ path: rel(copy.output), sha256: copy.sha256 })),
};
if (existsSync(receiptFile)) assert.deepEqual(readJson(receiptFile), receipt, 'existing integration receipt changed');
else writeJson(receiptFile, receipt);
console.log(JSON.stringify({ status: 'PASS', integrated: 20, poses: 160, runtime: registry.counts, selectableRadiologists: 16, inactiveRegisteredStaff: 4, patients: 120, published: false }));
