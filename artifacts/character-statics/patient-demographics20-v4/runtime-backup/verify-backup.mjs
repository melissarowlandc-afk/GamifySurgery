import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Read-only, dependency-free archive verification. No gameplay imports or writes.
const backup = fileURLToPath(new URL('.', import.meta.url));
const repo = resolve(backup, '../../../..');
const json = path => JSON.parse(readFileSync(resolve(repo, path), 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(resolve(repo, path))).digest('hex');
const art = 'artifacts/character-statics/patient-demographics20-v4';
const tool = 'tools/character-mapping/patient-demographics20-v4';
const manifest = json(`${art}/runtime-backup/backup-manifest.json`);
for (const item of manifest.files) {
  const resolved = resolve(repo, item.path);
  assert(!relative(repo, resolved).startsWith('..'), 'path escapes repository');
  assert(statSync(resolved).isFile());
  assert.equal(statSync(resolved).size, item.bytes, item.path);
  assert.equal(hash(item.path), item.sha256, item.path);
}
const mapping = json(`${art}/runtime-backup/snapshot-map.json`).snapshots;
assert.equal(mapping.length, 6);
const snapshot = live => mapping.find(item => item.livePath === live);
for (const item of mapping) {
  assert.equal(hash(item.snapshot), item.sha256);
  assert.equal(hash(item.before), item.beforeSha256);
  assert.equal(hash(item.patch), item.patchSha256);
}
const registryItem = snapshot('apps/player/src/art/characterStillRegistry.generated.json');
const provenanceItem = snapshot('tools/character-mapping/gs026-runtime-stills/provenance-manifest.json');
const registry = json(registryItem.snapshot), beforeRegistry = json(registryItem.before);
const provenance = json(provenanceItem.snapshot), beforeProvenance = json(provenanceItem.before);
assert.equal(registry.characters.length, 225);
assert.equal(new Set(registry.characters.map(entry => entry.id)).size, 225);
assert.deepEqual(registry.characters.slice(0, 205), beforeRegistry.characters);
assert.deepEqual({ ...registry, counts: beforeRegistry.counts, characters: beforeRegistry.characters }, beforeRegistry);
assert.deepEqual(registry.counts, { identities: 225, cardinalPoses: 1800, clipboardPoses: 30, assets: 1830 });
assert.deepEqual(provenance.assets.slice(0, 1670), beforeProvenance.assets);
for (const [key, input] of Object.entries(beforeProvenance.inputs)) assert.deepEqual(provenance.inputs[key], input);
assert.equal(provenance.assets.length, 1830);
assert.equal(new Set(provenance.assets.map(record => record.outputFile)).size, 1830);
assert.equal(provenance.registry.sha256, registryItem.sha256);
const poses = registry.characters.flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]);
assert.equal(poses.length, 1830);
assert.equal(new Set(poses.map(pose => pose.url)).size, 1830);
for (const pose of poses) {
  const file = `apps/player/public/${pose.url}`;
  assert.equal(hash(file), pose.sha256);
  const bytes = readFileSync(resolve(repo, file));
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 160); assert.equal(bytes.readUInt32BE(20), 320);
  assert.equal(bytes[24], 8); assert.equal(bytes[25], 6);
}
for (const record of provenance.assets) {
  const character = registry.characters.find(entry => entry.id === record.identityId);
  assert(character);
  const pose = [...Object.values(character.poses.stand), ...Object.values(character.poses.sit), ...(character.clipboard ? [character.clipboard] : [])].find(asset => `apps/player/public/${asset.url}` === record.outputFile);
  assert(pose); assert.equal(pose.sha256, record.outputSha256);
  assert.equal(hash(record.outputFile), record.outputSha256);
  assert.equal(hash(record.sourceFile), record.sourceSha256);
  assert.equal(record.sourceSha256, record.outputSha256);
}
for (const input of Object.values(provenance.inputs)) assert.equal(hash(input.file), input.sha256);
const approval = json(`${tool}/owner-approval.json`), acceptance = json(`${tool}/review-acceptance.json`);
assert.equal(approval.status, 'approved'); assert.equal(approval.approvedBy, 'owner');
assert.equal(hash(acceptance.ownerRuntimeApproval.receipt), acceptance.ownerRuntimeApproval.sha256);
const baseline = json(`${art}/runtime-integration-baseline/manifest.json`);
for (const item of baseline.files) assert.equal(hash(item.copiedTo), item.sha256);
for (const evidence of [approval.reviewGallery, approval.overview]) {
  const item = baseline.files.find(entry => entry.path === evidence.path);
  assert.equal(item.sha256, evidence.sha256);
}
const roster = json(`${tool}/roster.json`);
assert.deepEqual(registry.characters.slice(205).map(entry => entry.id), roster.identities.map(entry => entry.stableId));
assert.equal(new Set(registry.characters.slice(205).flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit)]).map(pose => pose.sha256)).size, 160);
assert.equal(provenance.assets.filter(record => record.sourceInput === 'patientDemographics20V4').length, 160);
const directions = ['south', 'east', 'west', 'north'];
const contacts = roster.identities.map(identity => {
  const dir = `${art}/sources/${identity.number}`;
  for (const [receipt, image, prompt, args] of [
    ['provenance.json', 'source.png', 'exact-prompt.txt', 'tool-args.json'],
    ['stage1-provenance.json', 'stage1-standing-cardinals.png', 'stage1-exact-prompt.txt', 'stage1-tool-args.json'],
  ]) {
    const p = json(`${dir}/${receipt}`);
    assert.equal(hash(`${dir}/${image}`), p.nativeOutput.sha256);
    assert.equal(p.workspaceCopy.sha256, p.nativeOutput.sha256);
    assert.equal(hash(`${dir}/${prompt}`), p.prompt.sha256);
    const exact = readFileSync(resolve(repo, dir, prompt), 'utf8');
    assert.equal(json(`${dir}/${args}`).prompt, exact);
  }
  assert.equal(hash(`${dir}/source.png`), approval.acceptedSources[identity.number]);
  assert.equal(acceptance.accepted[identity.number], approval.acceptedSources[identity.number]);
  const contact = acceptance.seatContacts[identity.number];
  assert.deepEqual([...contact.approvedDirections].sort(), [...directions].sort());
  const character = registry.characters.find(entry => entry.id === identity.stableId);
  for (const direction of directions) {
    assert.equal(character.poses.sit[direction].anchors.seatContactY, contact[direction]);
    assert.equal(character.poses.sit[direction].anchors.seatContactStatus, 'owner-approved-authored-contact');
  }
  return { number: identity.number, sourceSha256: contact.sourceSha256, contacts: Object.fromEntries(directions.map(direction => [direction, contact[direction]])) };
});
const contract = createHash('sha256').update(JSON.stringify(contacts)).digest('hex');
assert.equal(contract, approval.seatContactContractSha256);
assert.equal(contract, acceptance.seatContactAcceptance.contractSha256);
assert.equal(hash(`${art}/alpha-normalization-report.json`), approval.derivedAlphaReportSha256);
assert.equal(hash(`${art}/alpha-normalization-report.json`), acceptance.derivedAlphaWarningAcceptance.reportSha256);
console.log(JSON.stringify({ status: 'PASS', files: manifest.files.length, identities: 225, assets: 1830, newPatients: 20, newPoses: 160, nativePromptPairs: 40, readOnly: true, playableHeadClaimed: false, published: false }));
