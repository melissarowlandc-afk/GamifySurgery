import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const artifactRoot = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const packageRoot = resolve(artifactRoot, 'packages');
const staging = JSON.parse(readFileSync(resolve(artifactRoot, 'staging-registry.json'), 'utf8'));
const roster = JSON.parse(readFileSync(resolve(tool, 'roster.json'), 'utf8'));
const baseline = JSON.parse(readFileSync(resolve(artifactRoot, 'runtime-baseline.json'), 'utf8'));
const integrationBaseline = JSON.parse(readFileSync(resolve(artifactRoot, 'runtime-integration-baseline/manifest.json'), 'utf8'));
const registryPath = resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json');
const publicRoot = resolve(repo, 'apps/player/public/art/characters/level3-roster-v2');
const directions = ['south', 'east', 'west', 'north'];
const relativePath = path => relative(repo, path).replaceAll('\\', '/');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');

const adultMetadata = {
  '015': { intendedSex: 'Male', displayGender: 'Man' },
  '016': { intendedSex: 'Male', displayGender: 'Man' },
  '017': { intendedSex: 'Male', displayGender: 'Man' },
  '018': { intendedSex: 'Female', displayGender: 'Woman' },
  '019': { intendedSex: 'Female', displayGender: 'Woman' },
  '020': { intendedSex: 'Male', displayGender: 'Man' },
};

const roleByCategory = {
  surgeon: 'staff.surgeon',
  'or-nurse': 'staff.or_nurse',
  'laboratory-technician': 'staff.laboratory_technician',
  pharmacist: 'staff.pharmacist',
  'repair-person': 'staff.repair_person',
  radiologist: 'staff.radiologist',
};

function assertHistoricalBaseline() {
  const snapshot = integrationBaseline.files.find(file => file.path === 'apps/player/src/art/characterStillRegistry.generated.json');
  assert(snapshot && !snapshot.missing, 'runtime integration baseline lacks the pre-edit registry snapshot');
  const snapshotPath = resolve(repo, snapshot.copiedTo);
  assert(existsSync(snapshotPath), 'pre-edit registry snapshot is unavailable');
  assert.equal(hash(snapshotPath), baseline.registry.sha256, 'pre-edit registry does not match the historical 153-identity baseline');
  const historical = JSON.parse(readFileSync(snapshotPath, 'utf8'));
  assert.equal(historical.characters.length, 153, 'historical baseline must contain 153 identities');
  assert.equal(historical.counts.assets, 1254, 'historical baseline must contain 1,254 assets');
  for (const asset of baseline.assets) {
    const assetPath = resolve(repo, 'apps/player/public', asset.path.replace(/^apps\/player\/public\//, ''));
    assert(existsSync(assetPath), `historical runtime asset missing: ${asset.path}`);
    assert.equal(hash(assetPath), asset.sha256, `historical runtime asset changed: ${asset.path}`);
  }
  return historical;
}

function packagePose(identity, posture, direction) {
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, identity.number, 'manifest.json'), 'utf8'));
  const source = manifest.poses?.[posture]?.[direction];
  assert(source, `missing ${identity.number} ${posture}/${direction} package metadata`);
  const sourcePath = resolve(repo, source.file);
  assert(existsSync(sourcePath), `missing ${relativePath(sourcePath)}`);
  assert.equal(hash(sourcePath), source.sha256, `package hash mismatch ${identity.number} ${posture}/${direction}`);
  const destination = resolve(publicRoot, identity.stableId, `${posture}-${direction}.png`);
  mkdirSync(resolve(publicRoot, identity.stableId), { recursive: true });
  cpSync(sourcePath, destination);
  assert.equal(hash(destination), source.sha256, `public copy mismatch ${identity.number} ${posture}/${direction}`);
  return {
    url: `art/characters/level3-roster-v2/${identity.stableId}/${posture}-${direction}.png`,
    sha256: source.sha256,
    width: 160,
    height: 320,
    anchors: source.anchors,
    visibleBounds: source.visibleBounds,
  };
}

function entryFor(identity) {
  const poses = Object.fromEntries(['stand', 'sit'].map(posture => [posture, Object.fromEntries(directions.map(direction => [direction, packagePose(identity, posture, direction)]))]));
  const common = { id: identity.stableId, cohort: 'level3RosterV2', poses };
  if (identity.category === 'patient') {
    const metadata = adultMetadata[identity.number];
    assert(metadata, `missing authorized adult demographic metadata for ${identity.number}`);
    return { ...common, category: 'patient-or-general-population', intendedAge: identity.age, ...metadata };
  }
  if (identity.category === 'future-pediatric-presentation') {
    return { ...common, category: 'future-pediatric-presentation', intendedVisualAge: identity.visualAge, currentClinicalEligibility: 'excluded-until-future-approved-pediatric-release' };
  }
  const role = roleByCategory[identity.category];
  assert(role, `missing staff role mapping for ${identity.number}`);
  if (identity.category === 'radiologist') return { ...common, category: 'future-staff-presentation', role, availability: 'level4-locked' };
  return { ...common, category: 'employee', role };
}

const historical = assertHistoricalBaseline();
assert.equal(staging.runtimeIntegration.authorized, false, 'staging ledger must remain historical and non-authorizing');
assert.equal(staging.entries.length, 32, 'expected all 32 staged identities');
assert.equal(staging.totals.poses, 256, 'expected 256 staged poses');
assert.deepEqual(staging.entries.map(entry => entry.number), roster.identities.map(identity => identity.number), 'staging and roster identity order differ');

const appended = roster.identities.map(entryFor);
const registry = {
  ...historical,
  integrationStatus: 'agent-production-qa-accepted-local-integration-authorized-not-published',
  counts: { identities: 185, cardinalPoses: 1480, clipboardPoses: 30, assets: 1510 },
  characters: [...historical.characters, ...appended],
};
assert.equal(new Set(registry.characters.map(entry => entry.id)).size, 185, 'runtime registry IDs must be unique');
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', historicalIdentities: 153, appendedIdentities: appended.length, identities: registry.characters.length, appendedAssets: 256, assets: registry.counts.assets }));
