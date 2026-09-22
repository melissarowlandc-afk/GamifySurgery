import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..'); const batch = 'artifacts/character-statics/gs-022-new-v1/patient-public20-v1';
const manifest = JSON.parse(readFileSync(resolve(repo, batch, 'manifest.json'), 'utf8'));
const ids = Array.from({ length: 20 }, (_, index) => `gs022-new-person-${String(index + 1).padStart(3, '0')}`);
assert.deepEqual(manifest.records.map((record) => record.id), ids); assert.equal(manifest.runtimeIntegration.authorized, false); assert.equal(manifest.runtimeIntegration.ready, false);
for (const record of manifest.records) { assert.equal(record.ownerApproval, 'pending'); assert.equal(record.runtimeReady, false); assert.equal(record.intendedAge, null); assert.equal(record.intendedSex, null); assert.equal(record.demographicEvidence, null); for (const pose of ['stand', 'sit']) for (const direction of ['south', 'east', 'west', 'north']) assert.equal(record.poses[pose][direction].status, 'pending-source'); }
console.log(JSON.stringify({ status: 'PASS', records: 20, demographicsSpecified: 0, sourceCandidates: 0, ownerApproved: 0, runtimeReady: false }));
