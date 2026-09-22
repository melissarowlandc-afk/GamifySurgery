import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..'); const batch = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const hash = (relative) => createHash('sha256').update(readFileSync(resolve(repo, relative))).digest('hex');
const manifest = JSON.parse(readFileSync(resolve(repo, batch, 'manifest.json'), 'utf8'));
assert.equal(hash(manifest.approvalReceipt.path), manifest.approvalReceipt.sha256, 'approval receipt hash changed');
const receipt = JSON.parse(readFileSync(resolve(repo, manifest.approvalReceipt.path), 'utf8'));
assert.equal(receipt.frontCandidates.length, 20); assert.equal(manifest.proofLedger.length, 7);
for (const record of manifest.records) { const expected = receipt.frontCandidates.find((entry) => entry.id === record.id); assert(expected); assert.equal(record.ownerApproval, 'approved-identity-and-front-concept-only'); assert.equal(record.poses.stand.south.ownerApproval, 'approved-identity-and-front-concept-only'); assert.equal(hash(record.source.path), record.source.sha256, `${record.id} source drift`); assert.equal(hash(record.poses.stand.south.file), expected.sha256, `${record.id} approved front drift`); }
for (const proof of manifest.proofLedger) { assert.equal(proof.status, 'approved-identity-and-front-concept-only'); assert.equal(hash(proof.file), proof.sha256, `proof drift: ${proof.file}`); }
console.log(JSON.stringify({ status: 'PASS', approvedReceipt: manifest.approvalReceipt.sha256, approvedSources: 20, approvedFronts: 20, approvedProofs: 7, remainingPendingPoses: 140, runtimeReady: false }));
