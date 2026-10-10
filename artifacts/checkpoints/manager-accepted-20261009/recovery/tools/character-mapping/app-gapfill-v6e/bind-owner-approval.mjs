import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { batch, directions, hash, hashText, ownerInstruction, readJson, rel, repo, root, tool, writeJson } from './runtime-contract.mjs';

const planPath = 'docs/execplans/character-gapfill-v6-20261007.md';
const plan = readFileSync(resolve(repo, planPath), 'utf8');
const statement = plan.split(/\r?\n/).find(line => line.startsWith('- 2026-10-09: v6e APP MANAGER VISUAL ACCEPTANCE'));
assert(statement?.includes('PASS (32 pages/viewports, 24 images)') && statement.includes('append-only runtime integration as APP-only stills'));
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
const approval = {
  schemaVersion: `${batch}-owner-runtime-approval/v1`, status: 'approved', approvedBy: 'GamifySurgery manager (Claude Code)', authorizedBy: 'owner', date: '2026-10-09', ownerInstruction,
  managerAcceptance: { path: planPath, statement, sha256: hashText(statement) },
  scope: `Manager accepted ${batch} as APP-only art. Only these ${roster.identities.length} identities, ${roster.identities.length * 8} exact accepted poses and ${roster.identities.length * 4} authored contacts; append-only local integration. No Git or publication authorization.`,
  allocation: roster.allocation,
  selectability: 'staff.app only; excluded from all patient and other staff pools; existing current/departing employees retain compatible saved looks',
  evidence: [...['roster.json', 'review-acceptance.json', 'authored-contacts.json'].map(name => evidence(resolve(tool, name))),
    ...['review/index.html', 'worker-review/visual-review.json', 'alpha-normalization-report.json', 'validation/gallery-browser-results.json'].map(name => evidence(resolve(root, name))),
    evidence(resolve(root, 'review/manager/approved-apps-top-new-eight-below.png')), evidence(resolve(root, 'review/manager/style-review-manifest.json'))],
  acceptedSources, acceptedPoses, acceptedContacts, seatContactContractSha256, derivedAlphaReportSha256,
  historicalReviewPolicy: 'Original worker/root pending labels remain frozen. Separate owner-delegated manager approval and runtime receipts supersede them without rewriting accepted bytes or review history.',
};
const destination = resolve(tool, 'owner-approval.json');
if (existsSync(destination)) assert.deepEqual(readJson(destination), approval, 'refusing to replace existing approval');
else writeJson(destination, approval);
const { assertOwnerApproved } = await import('./runtime-contract.mjs'); assertOwnerApproved();
console.log(JSON.stringify({ status: 'PASS', approvedIdentities: roster.identities.length, approvedPoses: roster.identities.length * 8, approvedAuthoredContacts: roster.identities.length * 4, approvedBy: approval.approvedBy, ownerDelegated: true, sourceAndReviewControlsUnchanged: true }));
