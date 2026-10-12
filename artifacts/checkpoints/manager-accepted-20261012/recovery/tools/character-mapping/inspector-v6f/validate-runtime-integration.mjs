import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from '../app-gapfill-v6e/runtime-contract.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const artifact = 'artifacts/character-statics/inspector-v6f';
const read = path => readFileSync(resolve(repo, path));
const json = path => JSON.parse(read(path).toString('utf8'));
const hash = path => createHash('sha256').update(read(path)).digest('hex');
const registryPath = 'apps/player/src/art/characterStillRegistry.generated.json';
const provenancePath = 'tools/character-mapping/gs026-runtime-stills/provenance-manifest.json';
const registry = json(registryPath), before = json(`${artifact}/runtime-integration-baseline/${registryPath}`);
const provenance = json(provenancePath), priorProvenance = json(`${artifact}/runtime-integration-baseline/${provenancePath}`);
const approval = json(`${artifact}/runtime-approval.json`), receipt = json(`${artifact}/runtime-integration.json`);
const roster = json('tools/character-mapping/inspector-v6f/roster.json');
assert(read(approval.managerAcceptance.path).toString('utf8').includes(approval.managerAcceptance.statement));
assert.equal(createHash('sha256').update(approval.managerAcceptance.statement).digest('hex'), approval.managerAcceptance.sha256);
assert.equal(hash(approval.authoredContacts.path), approval.authoredContacts.sha256);
assert.equal(hash(registryPath), provenance.registry.sha256);
assert.deepEqual(registry.counts, { identities: 336, cardinalPoses: 2688, clipboardPoses: 30, assets: 2718 });
assert.deepEqual(registry.characters.slice(0, 326), before.characters);
assert.deepEqual(provenance.assets.slice(0, 2638), priorProvenance.assets);
for (const [id, input] of Object.entries(priorProvenance.inputs)) assert.deepEqual(provenance.inputs[id], input);
const catalog = loadCatalog(), inspectors = catalog.filter(row => row.category === 'inspector');
assert.equal(catalog.length, 336); assert.equal(inspectors.length, 10);
assert.equal(catalog.filter(row => row.category === 'patient').length, 179);
assert.equal(catalog.filter(row => row.category === 'staff').length, 99);
assert.equal(catalog.filter(row => row.category === 'staff' && row.eligibleStaffRoleDefinitionIds.some(role => /inspector|inspection/.test(role))).length, 0);
const sourcePath = 'packages/game-domain/src/characterStillCatalog.ts';
const source = read(sourcePath).toString('utf8');
const reconstructed = source
  .replace(/  \| \{\n      \/\*\* Inspection art is never eligible[\s\S]*?readonly presentationRole: "inspection-agent";\n    \}\n/, '')
  .replace(/\n\/\*\* Manager-accepted v6f cast;[\s\S]*?presentationRole: "inspection-agent" as const,\n\}\)\);\n/, '')
  .replace('  ...INSPECTOR_CHARACTER_STILLS,\n', '');
assert.equal(reconstructed, read(`${artifact}/runtime-integration-baseline/${sourcePath}`).toString('utf8').replaceAll('\r\n', '\n'), 'unrelated catalog change');
const allHashes = new Set(); let bytes = 0, contacts = 0;
for (const identity of roster.identities) {
  const entry = registry.characters.find(row => row.id === identity.stableId);
  assert.equal(entry.category, 'inspection-presentation'); assert.equal(entry.role, 'inspection-agent');
  assert.deepEqual(entry.eligibleStaffRoleDefinitionIds, []);
  assert.equal(entry.intendedAge, identity.intendedAge); assert.equal(entry.intendedSex, identity.compatibleSexLabel);
  const design = inspectors.find(row => row.stillId === identity.stableId);
  assert.deepEqual(design, { stillId: identity.stableId, category: 'inspector', sourceCohort: 'inspector-v6f', presentationRole: 'inspection-agent' });
  const manifest = json(`${artifact}/packages/${identity.number}/manifest.json`);
  for (const posture of ['stand', 'sit']) for (const direction of ['south', 'east', 'west', 'north']) {
    const pose = entry.poses[posture][direction], original = manifest.poses[posture][direction];
    const output = `apps/player/public/${pose.url}`;
    assert.equal(hash(output), original.sha256); assert.equal(hash(original.file), original.sha256);
    assert.equal(pose.sha256, approval.approvedPoses[identity.number][`${posture}-${direction}`]);
    assert.deepEqual(pose.visibleBounds, original.visibleBounds);
    assert.equal(pose.anchors.bodyAxisX, 80); assert.equal(pose.anchors.floorY, 287);
    if (posture === 'sit') { assert.equal(pose.anchors.seatContactY, approval.approvedContacts[identity.number][direction]); contacts++; }
    const png = read(output); assert.equal(png.readUInt32BE(16), 160); assert.equal(png.readUInt32BE(20), 320); assert.equal(png[25], 6);
    bytes += png.length; allHashes.add(pose.sha256);
    if (process.argv.includes('--dist')) assert.equal(hash(output.replace('/public/', '/dist/')), pose.sha256);
  }
}
for (const entry of before.characters) for (const pose of [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])])
  assert.equal(hash(`apps/player/public/${pose.url}`), pose.sha256, 'prior runtime asset changed');
assert.equal(allHashes.size, 80); assert.equal(contacts, 40); assert.equal(receipt.files.length, 80);
console.log(JSON.stringify({ status: 'PASS', readOnly: true, identities: 10, exactPngs: 80, authoredContacts: contacts,
  bytes, preservedRegistryRows: 326, preservedPngs: 2638, preservedProvenanceRows: 2638,
  patientPool: 179, staffPool: 99, inspectorsInPatientOrStaffPools: 0, dist: process.argv.includes('--dist') }));
