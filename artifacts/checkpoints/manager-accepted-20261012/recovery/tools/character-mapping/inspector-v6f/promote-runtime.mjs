import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const batch = 'inspector-v6f', cohort = 'inspectorV6f';
const artifact = `artifacts/character-statics/${batch}`;
const registryPath = 'apps/player/src/art/characterStillRegistry.generated.json';
const provenancePath = 'tools/character-mapping/gs026-runtime-stills/provenance-manifest.json';
const hash = path => createHash('sha256').update(readFileSync(resolve(repo, path))).digest('hex');
const json = path => JSON.parse(readFileSync(resolve(repo, path), 'utf8'));
const write = (path, value) => writeFileSync(resolve(repo, path), JSON.stringify(value, null, 2) + '\n');
const directions = ['south', 'east', 'west', 'north'];
const planPath = 'docs/execplans/character-gapfill-v6-20261007.md';
const statement = readFileSync(resolve(repo, planPath), 'utf8').split(/\r?\n/)
  .find(line => line.startsWith('- 2026-10-11: v6f INSPECTOR MANAGER VISUAL ACCEPTANCE'));
assert(statement?.includes('Approved for runtime integration as inspection-agent stills in the Level 5 inspection milestone'));
const roster = json(`tools/character-mapping/${batch}/roster.json`);
const contacts = json(`tools/character-mapping/${batch}/authored-contacts.json`);
const staging = json(`${artifact}/staging-registry.json`);
assert.equal(roster.identities.length, 10); assert.equal(staging.entries.length, 10);
const files = [], characters = [], approvedPoses = {}, approvedContacts = {};
for (const [index, identity] of roster.identities.entries()) {
  assert.equal(identity.stableId, `${batch}.${String(index + 1).padStart(3, '0')}`);
  assert.deepEqual(identity.eligibleStaffRoleDefinitionIds, []);
  const manifestPath = `${artifact}/packages/${identity.number}/manifest.json`;
  const manifest = json(manifestPath), coordinates = contacts.coordinates[identity.number];
  approvedContacts[identity.number] = Object.fromEntries(directions.map((direction, i) => [direction, coordinates[i]]));
  approvedPoses[identity.number] = {};
  const poses = Object.fromEntries(['stand', 'sit'].map(posture => [posture, Object.fromEntries(directions.map(direction => {
    const pose = manifest.poses[posture][direction], url = `art/characters/${batch}/${identity.stableId}/${posture}-${direction}.png`;
    assert.equal(hash(pose.file), pose.sha256);
    const bytes = readFileSync(resolve(repo, pose.file));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), 160); assert.equal(bytes.readUInt32BE(20), 320);
    assert.equal(bytes[25], 6);
    assert.equal(pose.anchors.bodyAxisX, 80); assert.equal(pose.anchors.floorY, 287);
    if (posture === 'sit') assert.equal(pose.anchors.seatContactY, approvedContacts[identity.number][direction]);
    approvedPoses[identity.number][`${posture}-${direction}`] = pose.sha256;
    const outputFile = `apps/player/public/${url}`;
    if (existsSync(resolve(repo, outputFile))) assert.equal(hash(outputFile), pose.sha256, 'refusing unequal destination');
    files.push({ identityId: identity.stableId, pose: `${posture}-${direction}`, sourceFile: pose.file,
      outputFile, sourceSha256: pose.sha256, outputSha256: pose.sha256,
      manifest: { path: manifestPath, sha256: hash(manifestPath) }, sourceSheet: manifest.source.stage2.png,
      sourceProvenance: manifest.source.stage2.provenance });
    return [direction, { url, sha256: pose.sha256, width: 160, height: 320,
      anchors: { bodyAxisX: 80, floorY: 287, ...(posture === 'sit' ? {
        seatContactY: approvedContacts[identity.number][direction], seatContactStatus: 'manager-approved-authored-contact' } : {}) },
      visibleBounds: pose.visibleBounds }];
  }))]));
  characters.push({ id: identity.stableId, cohort, category: 'inspection-presentation', role: 'inspection-agent',
    eligibleStaffRoleDefinitionIds: [], intendedAge: identity.intendedAge,
    intendedSex: identity.compatibleSexLabel, displayGender: identity.compatibleSexLabel === 'Female' ? 'Woman' : 'Man', poses });
}
const approval = { schemaVersion: 'inspector-v6f-runtime-approval/v1', status: 'manager-accepted-inspection-presentation-only',
  approvedBy: 'GamifySurgery manager (Claude Code)', approvalAuthority: 'owner-delegated-manager', date: '2026-10-11',
  managerAcceptance: { path: planPath, statement, sha256: createHash('sha256').update(statement).digest('hex') },
  integrationBrief: 'Level 5 M7b: exact accepted 10 identities/80 poses and authored contacts; inspector-only presentation, no patient or staff eligibility.',
  approvedPoses, approvedContacts, authoredContacts: { path: `tools/character-mapping/${batch}/authored-contacts.json`, sha256: hash(`tools/character-mapping/${batch}/authored-contacts.json`) },
  frozenReviewPolicy: 'Original pending worker labels remain immutable historical evidence; the manager acceptance and M7b brief authorize this integration.' };
const registry = json(registryPath), provenance = json(provenancePath);
const promoted = registry.characters.some(entry => entry.cohort === cohort);
const baselinePath = `${artifact}/runtime-integration-baseline`;
const baselineRegistry = promoted ? json(`${baselinePath}/${registryPath}`) : registry;
const baselineProvenance = promoted ? json(`${baselinePath}/${provenancePath}`) : provenance;
assert.equal(baselineRegistry.characters.length, 326); assert.equal(baselineRegistry.counts.assets, 2638);
const expectedRegistry = { ...baselineRegistry, counts: { ...baselineRegistry.counts, identities: 336, cardinalPoses: 2688, assets: 2718 },
  characters: [...baselineRegistry.characters, ...characters] };
const approvalPath = `${artifact}/runtime-approval.json`;
const registryHash = createHash('sha256').update(JSON.stringify(expectedRegistry, null, 2) + '\n').digest('hex');
const approvalHash = createHash('sha256').update(JSON.stringify(approval, null, 2) + '\n').digest('hex');
const expectedProvenance = { ...baselineProvenance,
  inputs: { ...baselineProvenance.inputs, [cohort]: { file: approvalPath, sha256: approvalHash,
    reviewStatus: approval.status, approvalAuthority: approval.approvalAuthority, sourceCohort: batch, inspectionPresentationOnly: true } },
  registry: { ...baselineProvenance.registry, sha256: registryHash }, counts: expectedRegistry.counts,
  assets: [...baselineProvenance.assets, ...files.map(({ manifest: _manifest, ...file }) => ({ ...file, sourceInput: cohort,
    ownerApproval: { file: approvalPath, sha256: approvalHash }, seatContactContractSha256: approval.authoredContacts.sha256 }))] };
assert.deepEqual(registry, promoted ? expectedRegistry : baselineRegistry);
assert.deepEqual(provenance, promoted ? expectedProvenance : baselineProvenance);
if (process.argv.includes('--check')) {
  assert(promoted, 'inspector cohort has not been promoted');
  assert.deepEqual(json(approvalPath), approval);
  for (const file of files) assert.equal(hash(file.outputFile), file.outputSha256);
  if (process.argv.includes('--dist')) for (const file of files)
    assert.equal(hash(file.outputFile.replace('apps/player/public/', 'apps/player/dist/')), file.outputSha256);
} else if (!promoted) {
  // Every preflight above completes before promotion. Reread shared files before the exact append.
  const registryBefore = hash(registryPath), provenanceBefore = hash(provenancePath);
  for (const path of [registryPath, provenancePath, 'packages/game-domain/src/characterStillCatalog.ts', 'apps/player/src/art/characterStillRegistry.ts']) {
    const output = resolve(repo, baselinePath, path); assert(!existsSync(output)); mkdirSync(dirname(output), { recursive: true }); copyFileSync(resolve(repo, path), output);
  }
  write(approvalPath, approval);
  for (const file of files) { mkdirSync(dirname(resolve(repo, file.outputFile)), { recursive: true }); copyFileSync(resolve(repo, file.sourceFile), resolve(repo, file.outputFile)); }
  assert.equal(hash(registryPath), registryBefore); assert.equal(hash(provenancePath), provenanceBefore);
  write(registryPath, expectedRegistry); write(provenancePath, expectedProvenance);
  write(`${artifact}/runtime-integration.json`, { schemaVersion: 'inspector-v6f-runtime-integration/v1',
    status: 'locally-integrated-not-published', prior: baselineRegistry.counts, appended: { identities: 10, poses: 80, authoredSeatedContacts: 40 },
    resulting: expectedRegistry.counts, role: 'inspection-agent', patientPoolDelta: 0, staffPoolDelta: 0,
    registry: { path: registryPath, sha256: hash(registryPath) }, approval: { path: approvalPath, sha256: hash(approvalPath) }, files });
}
console.log(JSON.stringify({ status: 'PASS', mode: process.argv.includes('--check') ? 'read-only' : promoted ? 'idempotent-no-write' : 'promotion',
  identities: 10, poses: files.length, authoredSeatedContacts: 40, runtimeIdentities: 336, runtimeAssets: 2718,
  pngBytes: files.reduce((sum, file) => sum + readFileSync(resolve(repo, file.sourceFile)).length, 0),
  previousRowsPreserved: 326, previousProvenancePreserved: 2638, published: false }));
