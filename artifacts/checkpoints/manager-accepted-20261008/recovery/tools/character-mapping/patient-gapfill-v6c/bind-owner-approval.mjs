import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { batch, directions, hash, hashText, ownerInstruction, readJson, rel, repo, root, tool, writeJson } from './runtime-contract.mjs';

const planPath = 'docs/execplans/character-gapfill-v6-20261007.md';
const plan = readFileSync(resolve(repo, planPath), 'utf8');
const statement = plan.split(/\r?\n/).find(line => line.startsWith('- 2026-10-08: v6c (.018 regenerated) and v6d (.008 navy correction) MANAGER ACCEPTED'));
assert(statement?.includes('gallery validators PASS after fixes') && statement.includes('combined v6c+v6d append-only runtime integration'));
assert(plan.replace(/\r?\n/g, ' ').includes(ownerInstruction));
const roster = readJson(resolve(tool, 'roster.json')), acceptance = readJson(resolve(tool, 'review-acceptance.json'));
const visual = readJson(resolve(root, 'worker-review/visual-review.json'));
const acceptedSources = {}, acceptedPoses = {}, acceptedContacts = {};
const contacts = roster.identities.map(identity => {
  const sourceSha256 = hash(resolve(root, 'sources', identity.number, 'source.png'));
  assert.equal(acceptance.workerVisualAcceptance[identity.number].sourceSha256, sourceSha256);
  assert(!acceptance.rejected?.[identity.number]?.includes(sourceSha256));
  acceptedSources[identity.number] = sourceSha256;
  const contact = acceptance.seatContacts[identity.number];
  assert.equal(contact.sourceSha256, sourceSha256); assert.deepEqual(contact.workerReviewedDirections, directions);
  acceptedContacts[identity.number] = Object.fromEntries(directions.map(direction => [direction, contact[direction]]));
  const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
  assert.equal(manifest.source.stage2.png.sha256, sourceSha256);
  acceptedPoses[identity.number] = Object.fromEntries(['stand', 'sit'].flatMap(posture => directions.map(direction => {
    const pose = manifest.poses[posture][direction]; assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
    if (posture === 'sit') assert.equal(pose.anchors.seatContactY, contact[direction]);
    return [`${posture}-${direction}`, pose.sha256];
  })));
  return { number: identity.number, sourceSha256, contacts: acceptedContacts[identity.number] };
});
const seatContactContractSha256 = hashText(JSON.stringify(contacts));
assert.equal(acceptance.seatContactWorkerReview.contractSha256, seatContactContractSha256);
assert.equal(visual.authoredContactContractSha256, seatContactContractSha256);
const derivedAlphaReportSha256 = hash(resolve(root, 'alpha-normalization-report.json'));
assert.equal(visual.alphaReport.sha256, derivedAlphaReportSha256);
const evidence = file => ({ path: rel(file), sha256: hash(file) });
const patient = batch === 'patient-gapfill-v6c';
const correctionFiles = patient
  ? [resolve(root, 'review/manager/018-adult-before-after-game-scale.png'), resolve(root, 'review/manager/018-revision-review-manifest.json'), resolve(tool, 'analysis/018-regeneration/intake.json')]
  : [resolve(tool, 'corrections/008-navy-palette-v1.json'), resolve(root, 'corrections/008-navy-palette-v1/before-reference-after.png')];
const approval = {
  schemaVersion: `${batch}-owner-runtime-approval/v1`, status: 'approved', approvedBy: 'GamifySurgery manager (Claude Code)', authorizedBy: 'owner', date: '2026-10-08', ownerInstruction,
  managerAcceptance: { path: planPath, statement, sha256: hashText(statement) },
  scope: `Manager accepted ${batch} after its requested correction. Only these ${roster.identities.length} identities, ${roster.identities.length * 8} exact accepted poses and ${roster.identities.length * 4} authored contacts; append-only local integration. No Git or publication authorization.`,
  allocation: roster.allocation,
  selectability: patient ? 'existing exact sex/age-band patientStillEligibleEntries pools and unchanged occupancy/LRU selection' : 'exactly the single assigned eligibleStaffRoleDefinitionIds role per identity; existing employees retain compatible saved looks',
  evidence: [...['roster.json', 'review-acceptance.json', 'authored-contacts.json'].map(name => evidence(resolve(tool, name))),
    ...['review/index.html', 'worker-review/visual-review.json', 'alpha-normalization-report.json', 'validation/gallery-browser-results.json'].map(name => evidence(resolve(root, name))),
    evidence(resolve(root, patient ? 'review/manager/v6b-top-v6c-bottom.png' : 'comparison/surgeon-old-and-new.png')), ...correctionFiles.map(evidence)],
  acceptedCorrection: { identityId: patient ? 'patient-gapfill-v6c.018' : 'staff-gapfill-v6d.008', kind: patient ? 'manager-accepted-adult-regeneration' : 'manager-accepted-derived-navy-palette-correction', evidence: correctionFiles.map(evidence) },
  acceptedSources, acceptedPoses, acceptedContacts, seatContactContractSha256, derivedAlphaReportSha256,
  historicalReviewPolicy: 'Original worker/root pending labels remain frozen. Separate owner-delegated manager approval and runtime receipts supersede them without rewriting accepted bytes or review history.',
};
const destination = resolve(tool, 'owner-approval.json');
if (existsSync(destination)) assert.deepEqual(readJson(destination), approval, 'refusing to replace existing approval');
else writeJson(destination, approval);
const { assertOwnerApproved } = await import('./runtime-contract.mjs'); assertOwnerApproved();
console.log(JSON.stringify({ status: 'PASS', approvedIdentities: roster.identities.length, approvedPoses: roster.identities.length * 8, approvedAuthoredContacts: roster.identities.length * 4, approvedBy: approval.approvedBy, ownerDelegated: true, acceptedCorrection: approval.acceptedCorrection.identityId, sourceAndReviewControlsUnchanged: true }));
