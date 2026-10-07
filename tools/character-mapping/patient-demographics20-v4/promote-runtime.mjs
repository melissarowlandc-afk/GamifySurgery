import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { assertOwnerApproved, approvalSnapshot, captureIntegrationBaseline, expectedRuntimeCharacters, expectedRuntimeProvenance, hash, provenancePath, readJson, registryPath, rel, repo, resultingCounts, root, snapshotJson, tool, verifyAppendOnlyCatalog, verifyAppendOnlyRegistry, writeJson } from './runtime-contract.mjs';

// Complete approval, source, catalog and destination checks precede promotion.
// A rerun is valid only when it is already this exact append-only expansion.
captureIntegrationBaseline();
const { roster, approval } = assertOwnerApproved();
execFileSync(process.execPath, [resolve(tool, 'validate-roster.mjs'), '--require-root-review'], { stdio: 'inherit' });
verifyAppendOnlyCatalog();
const before = snapshotJson(registryPath), current = readJson(resolve(repo, registryPath)), additions = expectedRuntimeCharacters();
const expected = { ...before, counts: resultingCounts, characters: [...before.characters, ...additions] };
assert.deepEqual(current.characters.slice(0, 205), before.characters);
assert([205, 225].includes(current.characters.length), 'unrelated runtime additions detected');
assert.deepEqual(current, current.characters.length === 205 ? before : expected, 'registry differs from allowed append-only states');
if (existsSync(approvalSnapshot)) assert.deepEqual(readJson(approvalSnapshot), approval);
const cohortRoot = resolve(repo, 'apps/player/public/art/characters/patient-demographics20-v4');
const copies = roster.identities.flatMap(identity => {
  const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
  return ['stand', 'sit'].flatMap(posture => Object.entries(manifest.poses[posture]).map(([direction, pose]) => ({ source: resolve(repo, pose.file), output: resolve(cohortRoot, identity.stableId, `${posture}-${direction}.png`), sha256: pose.sha256 })));
});
assert.equal(copies.length, 160);
const allowed = new Set(copies.map(copy => copy.output));
if (existsSync(cohortRoot)) for (const name of readdirSync(cohortRoot, { recursive: true, withFileTypes: true })) {
  if (name.isFile()) assert(allowed.has(resolve(name.parentPath, name.name)), 'unrelated public cohort file detected');
}
for (const copy of copies) {
  assert.equal(hash(copy.source), copy.sha256);
  if (existsSync(copy.output)) assert.equal(hash(copy.output), copy.sha256, 'existing destination differs; refusing overwrite');
}
const priorProvenance = snapshotJson(provenancePath), currentProvenance = readJson(resolve(repo, provenancePath));
if (current.characters.length === 205) assert.deepEqual(currentProvenance, priorProvenance, 'provenance changed before promotion');
else assert.deepEqual(currentProvenance, expectedRuntimeProvenance(current), 'unrelated provenance mutation detected');

if (!existsSync(approvalSnapshot)) copyFileSync(resolve(tool, 'owner-approval.json'), approvalSnapshot);
for (const copy of copies) if (!existsSync(copy.output)) { mkdirSync(dirname(copy.output), { recursive: true }); copyFileSync(copy.source, copy.output); }
if (current.characters.length === 205) writeJson(resolve(repo, registryPath), expected);
const registry = verifyAppendOnlyRegistry();
const provenance = expectedRuntimeProvenance(registry);
if (current.characters.length === 205) writeJson(resolve(repo, provenancePath), provenance);
const receipt = {
  schemaVersion: 'patient-demographics20-v4-runtime-integration/v1', status: 'owner-approved-locally-integrated-not-published',
  prior: { identities: 205, assets: 1670, patients: 96 }, appended: { identities: 20, assets: 160, patients: 20 }, resulting: { ...registry.counts, patients: 116 },
  registry: { path: registryPath, sha256: hash(resolve(repo, registryPath)) }, provenance: { path: provenancePath, sha256: hash(resolve(repo, provenancePath)) },
  ownerApproval: { path: rel(approvalSnapshot), sha256: hash(approvalSnapshot) },
  approvalScope: 'This cohort only. All1670 existing provenance records and prior input approval claims remain unchanged.',
  provenancePreservation: { preservedGlobalRecords: 1670, newOwnerApprovedRecords: 160 },
  runtimeFiles: copies.map(copy => ({ path: rel(copy.output), sha256: copy.sha256 })),
};
const receiptFile = resolve(root, 'runtime-integration.json');
if (existsSync(receiptFile)) assert.deepEqual(readJson(receiptFile), receipt, 'existing integration receipt changed');
else writeJson(receiptFile, receipt);
console.log(JSON.stringify({ status: 'PASS', integrated: 20, poses: 160, runtime: registry.counts, published: false }));
