import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..');
const batch = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const manifestPath = resolve(repo, batch, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const hash = (relative) => createHash('sha256').update(readFileSync(resolve(repo, relative))).digest('hex');
assert.equal(manifest.records.length, 20);
const fronts = manifest.records.map((record) => {
  const front = record.poses.stand.south;
  assert.equal(front.status, 'candidate-generated-pending-owner-review');
  assert.equal(hash(front.file), front.sha256, `front changed: ${record.id}`);
  return { id: record.id, file: front.file, sha256: front.sha256 };
});
const reviewFile = `${batch}/proofs/employee20-owner-review-light-CANDIDATE-NOT-APPROVED.png`;
const receipt = {
  schemaVersion: 1,
  approvalScope: 'new employee visual identity and front-standing concept only',
  exactOwnerQuote: 'Great, those are approved.',
  approvedAt: '2026-09-17',
  exclusions: ['remaining seven pose slots per employee remain pending', 'runtime integration remains unauthorized and not ready'],
  frontCandidates: fronts,
  reviewedBoard: { file: reviewFile, sha256: hash(reviewFile) },
};
const receiptRelative = `${batch}/approvals/employee20-front-concepts-owner-approval-v1.json`;
mkdirSync(resolve(repo, batch, 'approvals'), { recursive: true });
writeFileSync(resolve(repo, receiptRelative), `${JSON.stringify(receipt, null, 2)}\n`);
for (const record of manifest.records) { record.ownerApproval = 'approved-identity-and-front-concept-only'; record.poses.stand.south.ownerApproval = 'approved-identity-and-front-concept-only'; }
manifest.status = 'employee-identities-and-front-concepts-owner-approved';
manifest.artDirectionStatus = 'identity-and-front-concepts-owner-approved';
manifest.approvalReceipt = { path: receiptRelative, sha256: hash(receiptRelative), scope: receipt.approvalScope };
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ status: 'APPROVED_RECEIPT_RECORDED', identities: 20, approvedFronts: 20, remainingPendingPoses: 140, runtimeReady: false }));
