import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const baseline = JSON.parse(readFileSync(resolve(root, 'runtime-baseline.json'), 'utf8'));
const integrationBaseline = JSON.parse(readFileSync(resolve(root, 'runtime-integration-baseline/manifest.json'), 'utf8'));
const roster = JSON.parse(readFileSync(resolve(tool, 'roster.json'), 'utf8'));
const registry = JSON.parse(readFileSync(resolve(repo, 'apps/player/src/art/characterStillRegistry.generated.json'), 'utf8'));
const directions = ['south', 'east', 'west', 'north'];

const snapshot = integrationBaseline.files.find(file => file.path === 'apps/player/src/art/characterStillRegistry.generated.json');
assert(snapshot && !snapshot.missing, 'runtime integration baseline has no registry snapshot');
const historical = JSON.parse(readFileSync(resolve(repo, snapshot.copiedTo), 'utf8'));
assert.equal(hash(resolve(repo, snapshot.copiedTo)), baseline.registry.sha256, 'historical baseline registry hash changed');
assert.equal(historical.characters.length, 153, 'historical baseline identity count changed');
assert.equal(historical.counts.assets, 1254, 'historical baseline asset count changed');
for (const asset of baseline.assets) {
  const assetPath = resolve(repo, 'apps/player/public', asset.path.replace(/^apps\/player\/public\//, ''));
  assert(existsSync(assetPath), `historical runtime asset missing: ${asset.path}`);
  assert.equal(hash(assetPath), asset.sha256, `historical runtime asset changed: ${asset.path}`);
}
assert.deepEqual(registry.characters.slice(0, 153), historical.characters, 'existing runtime registry entries changed; integration must be append-only');
assert.deepEqual(registry.counts, { identities: 185, cardinalPoses: 1480, clipboardPoses: 30, assets: 1510 }, 'runtime registry counts do not match 153 + 32 / 1254 + 256');

const appended = registry.characters.slice(153);
assert.equal(appended.length, 32, 'runtime registry must append exactly 32 identities');
assert.deepEqual(appended.map(entry => entry.id), roster.identities.map(identity => identity.stableId), 'runtime registry appended IDs differ from the authorized roster');
for (const entry of appended) {
  assert.equal(entry.cohort, 'level3RosterV2', `wrong cohort for ${entry.id}`);
  for (const posture of ['stand', 'sit']) for (const direction of directions) {
    const asset = entry.poses?.[posture]?.[direction];
    assert(asset, `missing ${entry.id} ${posture}/${direction}`);
    const file = resolve(repo, 'apps/player/public', asset.url);
    assert(existsSync(file), `unreadable public asset ${asset.url}`);
    assert.equal(hash(file), asset.sha256, `public asset hash mismatch ${asset.url}`);
    assert.equal(asset.width, 160, `incorrect width ${asset.url}`);
    assert.equal(asset.height, 320, `incorrect height ${asset.url}`);
  }
}

const adults = appended.filter(entry => entry.category === 'patient-or-general-population');
assert.equal(adults.length, 6, 'must append six adult patient identities');
assert.deepEqual(adults.map(entry => [entry.intendedSex, entry.intendedAge]), [['Male', 19], ['Male', 24], ['Male', 28], ['Female', 21], ['Female', 26], ['Male', 38]], 'adult demographic metadata drifted');
const futurePediatric = appended.filter(entry => entry.category === 'future-pediatric-presentation');
assert.equal(futurePediatric.length, 12, 'must register twelve future pediatric presentation identities');
assert(futurePediatric.every(entry => entry.currentClinicalEligibility === 'excluded-until-future-approved-pediatric-release'), 'pediatric assets must remain excluded from current clinical selection');
const futureRadiologists = appended.filter(entry => entry.category === 'future-staff-presentation');
assert.equal(futureRadiologists.length, 4, 'must register four future radiologists');
assert(futureRadiologists.every(entry => entry.role === 'staff.radiologist' && entry.availability === 'level4-locked'), 'radiologists must remain level-4 locked');
const staffRoles = appended.filter(entry => entry.category === 'employee').map(entry => entry.role).sort();
assert.deepEqual(staffRoles, ['staff.laboratory_technician', 'staff.laboratory_technician', 'staff.or_nurse', 'staff.or_nurse', 'staff.pharmacist', 'staff.pharmacist', 'staff.repair_person', 'staff.repair_person', 'staff.surgeon', 'staff.surgeon'], 'staff role mapping drifted');
console.log(JSON.stringify({ status: 'PASS', historical: '153 identities/1254 assets unchanged', appended: '32 identities/256 assets', adults: adults.length, futurePediatric: futurePediatric.length, futureRadiologists: futureRadiologists.length }));
