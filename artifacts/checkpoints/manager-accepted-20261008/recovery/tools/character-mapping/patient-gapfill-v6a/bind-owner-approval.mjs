import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { directions, hash, hashText, readJson, repo, root, tool } from './runtime-contract.mjs';

const planPath = 'docs/execplans/character-gapfill-v6-20261007.md';
const plan = readFileSync(resolve(repo, planPath), 'utf8');
const managerAcceptance = plan.split(/\r?\n/).find(line => line.startsWith('- 2026-10-07: v6a MANAGER VISUAL ACCEPTANCE'));
assert(managerAcceptance?.includes('Approved for append-only runtime integration.'), 'manager acceptance must precede approval binding');
const ownerInstruction = 'use codex to design characters to fill in all the gaps, make sure the style of these characters is matching the style of all the previously generated characters. If they look okay to you, you can implement them into the game.';
assert(plan.replace(/\r?\n/g, ' ').includes(ownerInstruction));
const roster = readJson(resolve(tool, 'roster.json')), acceptance = readJson(resolve(tool, 'review-acceptance.json'));
const visual = readJson(resolve(root, 'worker-review/visual-review.json'));
assert.equal(roster.identities.length, 20); assert.equal(acceptance.reviewer, 'sol-v6a-worker');
const acceptedSources = {}, acceptedPoses = {}, acceptedContacts = {};
const contacts = roster.identities.map(identity => {
  assert.equal(identity.category, 'patient');
  const sourceSha256 = hash(resolve(root, 'sources', identity.number, 'source.png'));
  assert.equal(acceptance.workerVisualAcceptance[identity.number].sourceSha256, sourceSha256);
  assert(!acceptance.rejected?.[identity.number]?.includes(sourceSha256));
  acceptedSources[identity.number] = sourceSha256;
  const contact = acceptance.seatContacts[identity.number];
  assert.equal(contact.sourceSha256, sourceSha256);
  assert.deepEqual(contact.workerReviewedDirections, directions);
  acceptedContacts[identity.number] = Object.fromEntries(directions.map(direction => [direction, contact[direction]]));
  const manifest = readJson(resolve(root, 'packages', identity.number, 'manifest.json'));
  assert.equal(manifest.source.stage2.png.sha256, sourceSha256);
  acceptedPoses[identity.number] = Object.fromEntries(['stand', 'sit'].flatMap(posture => directions.map(direction => {
    const pose = manifest.poses[posture][direction];
    assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
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
const evidence = path => ({ path, sha256: hash(resolve(repo, path)) });
const approval = {
  schemaVersion: 'patient-gapfill-v6a-owner-runtime-approval/v1', status: 'approved',
  approvedBy: 'GamifySurgery manager (Claude Code)', authorizedBy: 'owner', date: '2026-10-07', ownerInstruction,
  managerAcceptance: { path: planPath, statement: managerAcceptance, sha256: hashText(managerAcceptance) },
  scope: 'Manager accepted v6a under owner-delegated visual approval. Only these 20 adult patients, 160 exact packaged poses and 80 authored contacts; append-only local runtime integration. No Git or publication authorization.',
  allocation: roster.allocation, selectability: 'existing exact sex/age-band patientStillEligibleEntries pools and unchanged occupancy/LRU selection',
  roster: evidence('tools/character-mapping/patient-gapfill-v6a/roster.json'),
  reviewAcceptance: evidence('tools/character-mapping/patient-gapfill-v6a/review-acceptance.json'),
  reviewGallery: evidence('artifacts/character-statics/patient-gapfill-v6a/review/index.html'),
  overview: evidence('artifacts/character-statics/patient-gapfill-v6a/review/manager/old-top-new-bottom.png'),
  workerReview: evidence('artifacts/character-statics/patient-gapfill-v6a/worker-review/visual-review.json'),
  authoredContacts: evidence('tools/character-mapping/patient-gapfill-v6a/authored-contacts.json'),
  acceptedSources, acceptedPoses, acceptedContacts, seatContactContractSha256, derivedAlphaReportSha256,
  historicalReviewPolicy: 'Worker/root pending labels remain frozen history. Manager acceptance above supersedes those labels without rewriting source, art, proof, contact or review evidence.',
};
const destination = resolve(tool, 'owner-approval.json');
if (existsSync(destination)) assert.deepEqual(readJson(destination), approval, 'refusing to replace an existing approval');
else writeFileSync(destination, JSON.stringify(approval, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', approvedIdentities: 20, approvedPoses: 160, approvedAuthoredContacts: 80, approvedBy: approval.approvedBy, ownerDelegated: true, sourceAndReviewControlsUnchanged: true }));
