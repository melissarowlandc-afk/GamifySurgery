import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const batch = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const manifestPath = resolve(repo, batch, 'manifest.json');
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const expectedIds = Array.from({ length: 20 }, (_, index) => `gs022-new-employee-${String(index + 1).padStart(3, '0')}`);
const roleIds = ['staff.receptionist', 'staff.imaging_technician', 'staff.periop_nurse', 'staff.endoscopy_nurse', 'staff.endoscopist', 'staff.phlebotomist', 'staff.evs_worker', 'staff.glp1_np'];
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
assert.deepEqual(manifest.records.map((record) => record.id), expectedIds, 'reserved GS-022 employee IDs changed');
assert.equal(manifest.records.length, 20);
assert.equal(manifest.runtimeIntegration.authorized, false);
assert.equal(manifest.runtimeIntegration.ready, false);
assert.equal(manifest.status, 'employee-identities-and-front-concepts-owner-approved');
assert.equal(sha(resolve(repo, manifest.approvalReceipt.path)), manifest.approvalReceipt.sha256, 'approval receipt changed');
const receipt = JSON.parse(readFileSync(resolve(repo, manifest.approvalReceipt.path), 'utf8'));
assert.equal(receipt.exactOwnerQuote, 'Great, those are approved.');
assert.equal(receipt.frontCandidates.length, 20);
assert.equal(sha(resolve(repo, receipt.reviewedBoard.file)), receipt.reviewedBoard.sha256, 'reviewed board changed');
assert.equal(sha(resolve(repo, manifest.designSpecs.path)), manifest.designSpecs.sha256, 'design specifications changed');
assert.equal(manifest.proofLedger.length, 7, 'owner review ledger is incomplete');
for (const proof of manifest.proofLedger) { assert.equal(proof.status, 'approved-identity-and-front-concept-only'); assert.equal(sha(resolve(repo, proof.file)), proof.sha256, `proof changed: ${proof.file}`); }
const assigned = Object.entries(manifest.roleAssignments).flatMap(([role, ids]) => ids.map((id) => ({ role, id })));
assert.deepEqual([...new Set(assigned.map((entry) => entry.role))].sort(), roleIds.sort(), 'role set drifted');
assert.deepEqual(assigned.map((entry) => entry.id).sort(), expectedIds, 'role assignments must cover each candidate exactly once');
assert.equal(new Set(assigned.map((entry) => entry.id)).size, 20, 'role assignments must not duplicate an employee');

let packaged = 0;
for (const record of manifest.records) {
  assert.equal(record.ownerApproval, 'approved-identity-and-front-concept-only');
  assert.equal(record.runtimeReady, false);
  for (const pose of ['stand', 'sit']) for (const direction of ['south', 'east', 'west', 'north']) assert(record.poses[pose][direction], `${record.id} lacks ${pose}.${direction}`);
  if (!record.source) continue;
  packaged++;
  const expectedRole = assigned.find((entry) => entry.id === record.id).role;
  assert.equal(record.role, expectedRole, `${record.id} role is not bound to settled distribution`);
  assert.equal(sha(resolve(repo, record.source.path)), record.source.sha256, `${record.id} source changed`);
  assert.equal(typeof record.source.visibleBand.left, 'number', `${record.id} missing alpha-projection band`);
  assert.equal(record.source.transform.scale, 0.375, `${record.id} reviewed uniform scale changed`);
  assert.equal(record.source.transform.policy, 'uniform scale and translation of the original transparent sheet; no retouch, cleanup, segmentation, or equal-grid crop');
  assert.equal(sha(resolve(repo, record.prompt.path)), record.prompt.sha256, `${record.id} prompt changed`);
  const south = record.poses.stand.south;
  assert.equal(south.status, 'candidate-generated-pending-owner-review');
  assert.equal(south.ownerApproval, 'approved-identity-and-front-concept-only');
  assert.equal(sha(resolve(repo, south.file)), south.sha256, `${record.id} candidate changed`);
  const receiptFront = receipt.frontCandidates.find((entry) => entry.id === record.id);
  assert(receiptFront, `${record.id} is absent from the approval receipt`);
  assert.deepEqual(receiptFront, { id: record.id, file: south.file, sha256: south.sha256 }, `${record.id} approval snapshot drift`);
  const image = await loadImage(resolve(repo, south.file));
  assert.deepEqual([image.width, image.height], [160, 320], `${record.id} production dimensions`);
  const canvas = createCanvas(160, 320); const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, 160, 320).data;
  let transparent = 0; let left = 160; let top = 320; let right = -1; let bottom = -1;
  for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) {
    const alpha = data[(y * 160 + x) * 4 + 3];
    if (alpha === 0) transparent++;
    if (alpha >= 20) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  }
  assert(transparent > 0, `${record.id} has no observed transparent pixels`);
  assert(right >= 0, `${record.id} contains no visible pixels`);
  assert(left > 0 && right < 159 && top > 0 && bottom <= 287, `${record.id} visible bounds are clipped or exceed floor: ${[left, top, right, bottom]}`);
  assert.equal(south.alpha.observedTransparentPixels, transparent, `${record.id} alpha measurement drift`);
  assert.deepEqual(south.visibleBounds, { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 }, `${record.id} bounds measurement drift`);
  for (const pose of ['stand', 'sit']) for (const direction of ['south', 'east', 'west', 'north']) if (!(pose === 'stand' && direction === 'south')) assert.equal(record.poses[pose][direction].status, 'pending');
}
assert.equal(packaged, 20, 'all twenty front-standing candidates must be packaged');
console.log(JSON.stringify({ status: 'PASS', records: 20, packagedSouthCandidates: packaged, approvedFrontConcepts: 20, remainingPendingPoses: 160 - packaged, runtimeReady: false }));
