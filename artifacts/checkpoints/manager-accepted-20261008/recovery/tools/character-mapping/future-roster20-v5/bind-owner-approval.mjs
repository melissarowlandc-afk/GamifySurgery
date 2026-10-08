import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('.', import.meta.url)), repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/future-roster20-v5');
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const evidence = path => ({ path, sha256: hash(resolve(repo, path)) });
const roster = read(resolve(tool, 'roster.json')), acceptance = read(resolve(tool, 'review-acceptance.json'));
const directions = ['south', 'east', 'west', 'north'];
assert.equal(roster.identities.length, 20);
assert.equal(acceptance.reviewer, 'root');
const acceptedSources = {}, acceptedPoses = {};
const contacts = roster.identities.map(identity => {
  const sourceSha256 = hash(resolve(root, 'sources', identity.number, 'source.png'));
  assert.equal(acceptance.accepted[identity.number], sourceSha256);
  acceptedSources[identity.number] = sourceSha256;
  const contact = acceptance.seatContacts[identity.number];
  assert.equal(contact.sourceSha256, sourceSha256);
  assert.deepEqual([...contact.approvedDirections].sort(), [...directions].sort());
  const manifest = read(resolve(root, 'packages', identity.number, 'manifest.json'));
  acceptedPoses[identity.number] = Object.fromEntries(['stand', 'sit'].flatMap(posture => directions.map(direction => {
    const pose = manifest.poses[posture][direction];
    assert.equal(hash(resolve(repo, pose.file)), pose.sha256);
    return [`${posture}-${direction}`, pose.sha256];
  })));
  return { number: identity.number, sourceSha256, contacts: Object.fromEntries(directions.map(direction => [direction, contact[direction]])) };
});
const seatContactContractSha256 = createHash('sha256').update(JSON.stringify(contacts)).digest('hex');
assert.equal(acceptance.seatContactAcceptance.contractSha256, seatContactContractSha256);
const derivedAlphaReportSha256 = hash(resolve(root, 'alpha-normalization-report.json'));
assert.equal(acceptance.derivedAlphaWarningAcceptance.reportSha256, derivedAlphaReportSha256);
const approval = {
  schemaVersion: 'future-roster20-v5-owner-runtime-approval/v1', status: 'approved', approvedBy: 'owner', date: '2026-10-07',
  ownerInstruction: 'I reviewed the character stills in 033, those are approved and can be implemented into the game.',
  scope: 'Only the 20 GS-033 future-roster20-v5 identities and their 160 exact approved poses and authored contacts. Append-only local runtime integration; no publication or Git authorization.',
  allocation: roster.allocation,
  selectability: { radiologists: 'staff.radiologist', patients: 'existing compatible age/sex occupancy and LRU pools', APPs: 'registered with no eligible staff roles', executives: 'registered with no eligible staff roles' },
  roster: evidence('tools/character-mapping/future-roster20-v5/roster.json'),
  reviewAcceptance: evidence('tools/character-mapping/future-roster20-v5/review-acceptance.json'),
  reviewGallery: evidence('artifacts/character-statics/future-roster20-v5/review/index.html'),
  overview: evidence('artifacts/character-statics/future-roster20-v5/review/owner-overview-stand-south-sit-east.png'),
  acceptedSources, acceptedPoses, seatContactContractSha256, derivedAlphaReportSha256,
};
const destination = resolve(tool, 'owner-approval.json');
if (existsSync(destination)) assert.deepEqual(read(destination), approval, 'refusing to replace an existing approval');
else writeFileSync(destination, JSON.stringify(approval, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', approvedIdentities: 20, approvedPoses: 160, sourceAndReviewControlsUnchanged: true }));
