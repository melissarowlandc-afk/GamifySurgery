import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const intakeRoot = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const outputRoot = 'artifacts/character-statics/employee20-statics-v1';
const intake = JSON.parse(readFileSync(resolve(repo, intakeRoot, 'manifest.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(repo, outputRoot, 'manifest.json'), 'utf8'));
const references = JSON.parse(readFileSync(resolve(repo, outputRoot, 'reference-manifest.json'), 'utf8'));
const receipt = JSON.parse(readFileSync(resolve(repo, intake.approvalReceipt.path), 'utf8'));
const config = JSON.parse(readFileSync(resolve(import.meta.dirname, 'employee20-config.json'), 'utf8'));
const approvedIds = new Set(config.parentApprovedIds ?? []), artApprovedIds = new Set(config.artApprovedIds ?? []);
const completeMode = process.argv.includes('--complete');
const preservation = JSON.parse(readFileSync(resolve(import.meta.dirname, 'gs018-preservation-baseline.json'), 'utf8'));
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const expectedIds = Array.from({ length: 20 }, (_, index) => `gs022-new-employee-${String(index + 1).padStart(3, '0')}`);
const receiptById = new Map(receipt.frontCandidates.map((entry) => [entry.id, entry]));
const views = ['south', 'east', 'west', 'north'];

async function inspect(file, threshold = 20) {
  const image = await loadImage(file); const canvas = createCanvas(image.width, image.height); const context = canvas.getContext('2d'); context.drawImage(image, 0, 0); const data = context.getImageData(0, 0, image.width, image.height).data;
  let left = image.width; let top = image.height; let right = -1; let bottom = -1; let transparent = 0;
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) { const alpha = data[(y * image.width + x) * 4 + 3]; if (alpha === 0) transparent++; if (alpha >= threshold) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); } }
  assert(right >= 0, `${file} has no visible pixels`); return { width: image.width, height: image.height, transparent, bounds: { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 } };
}

assert.deepEqual(manifest.records.map((record) => record.id), expectedIds, 'employee IDs drifted');
assert.equal(manifest.records.length, 20);
assert.equal(manifest.runtimeIntegration.authorized, false);
assert.equal(manifest.runtimeIntegration.ready, false);
assert.equal(manifest.sourceContract.generatedSouth, 'calibration-only-excluded-from-final-eight');
assert.equal(sha(resolve(repo, intake.approvalReceipt.path)), intake.approvalReceipt.sha256, 'approval receipt changed');
assert.equal(receiptById.size, 20);
assert.equal(references.references.length, 20);
for (const entry of preservation.files) assert.equal(sha(resolve(repo, entry.path)), entry.sha256, `GS-018 preservation guard failed: ${entry.path}`);
for (const id of approvedIds) assert(artApprovedIds.has(id), `${id} fully approved status must be a subset of art-approved status`);
let generatedSources = 0; let packaged = 0; let approvedSouth = 0;
for (const record of manifest.records) {
  const sourceRecord = intake.records.find((entry) => entry.id === record.id); const receiptEntry = receiptById.get(record.id); const reference = references.references.find((entry) => entry.id === record.id);
  assert(sourceRecord && receiptEntry && reference, `${record.id} provenance incomplete`);
  assert.deepEqual(receiptEntry, { id: record.id, file: sourceRecord.poses.stand.south.file, sha256: sourceRecord.poses.stand.south.sha256 }, `${record.id} receipt binding drift`);
  assert.equal(sha(resolve(repo, receiptEntry.file)), receiptEntry.sha256, `${record.id} approved original changed`);
  assert.equal(sha(resolve(repo, reference.file)), reference.sha256, `${record.id} reference changed`);
  const south = record.poses.stand.south; assert.equal(south.status, 'owner-approved-original-front-reused'); assert.equal(south.sha256, receiptEntry.sha256); assert.equal(sha(resolve(repo, south.file)), receiptEntry.sha256, `${record.id} final South is not byte-preserved`); assert.deepEqual(readFileSync(resolve(repo, south.file)), readFileSync(resolve(repo, receiptEntry.file)), `${record.id} South bytes differ`);
  const southImage = await inspect(resolve(repo, south.file)); assert.deepEqual([southImage.width, southImage.height], [160, 320]); assert(southImage.bounds.bottom <= 287); approvedSouth++; packaged++;
  if (record.generatedSource) {
    generatedSources++; assert.equal(sha(resolve(repo, record.generatedSource.path)), record.generatedSource.sha256, `${record.id} generated source changed`); assert.equal(sha(resolve(repo, record.generatedSource.exactPromptPath)), record.generatedSource.exactPromptSha256, `${record.id} exact prompt changed`); if (artApprovedIds.has(record.id)) assert(record.generatedSource.toolOutputProvenance.path, `${record.id} approved art lacks retained tool-output provenance`); if (record.generatedSource.toolOutputProvenance.path) assert.equal(sha(resolve(repo, record.generatedSource.toolOutputProvenance.path)), record.generatedSource.toolOutputProvenance.sha256, `${record.id} tool-output provenance changed`); assert.equal(record.generatedSource.generatedSouthUse, 'calibration-only-excluded-from-final-eight'); assert.equal(record.generatedSource.calibration.headProportionAcceptance, artApprovedIds.has(record.id) ? 'parent-visual-approved' : 'pending-parent-visual-review');
    for (const pose of ['stand', 'sit']) for (const direction of views) {
      const entry = record.poses[pose][direction]; if (pose === 'stand' && direction === 'south') continue;
      assert.equal(entry.status, approvedIds.has(record.id) ? 'parent-visual-approved-static-art-ready-local-only' : artApprovedIds.has(record.id) ? 'parent-art-approved-contact-review-pending' : 'source-packaged-pending-parent-visual-review', `${record.id} ${pose}.${direction} status is not truthful`); assert.equal(sha(resolve(repo, entry.file)), entry.sha256, `${record.id} ${pose}.${direction} hash drift`); const image = await inspect(resolve(repo, entry.file)); assert.deepEqual([image.width, image.height], [160, 320]); assert(image.transparent > 0); assert(image.bounds.left >= 0 && image.bounds.right < 160 && image.bounds.top >= 0 && image.bounds.bottom <= 287, `${record.id} ${pose}.${direction} registration failed`); assert(image.bounds.width <= 154, `${record.id} ${pose}.${direction} exceeds width contract`); packaged++;
      if (pose === 'sit') { const contact = entry.anchors.seatContact, approved = approvedIds.has(record.id); assert.equal(contact.status, approved ? 'parent-accepted-authored-source-pixel-measurement' : contact.sourceY === undefined ? 'pending-parent-authored-source-pixel-measurement' : 'authored-source-pixel-measurement-pending-parent-review', `${record.id} ${direction} contact status drift`); if (approved) { assert(Number.isFinite(config.seatContacts[record.id]?.[direction]), `${record.id} ${direction} approved contact is missing from authored config`); assert.equal(contact.sourceY, config.seatContacts[record.id][direction], `${record.id} ${direction} manifest contact is not bound to authored config`); } if (contact.sourceY !== undefined) { assert(Number.isFinite(contact.sourceY) && Number.isFinite(contact.y), `${record.id} ${direction} contact is not finite`); assert(contact.sourceY >= 0 && contact.sourceY < entry.sourceCell.rect.height, `${record.id} ${direction} source contact is outside its source cell`); const expectedY = contact.sourceY * entry.transform.scale + entry.transform.translateY; assert(Math.abs(contact.y - expectedY) < 1e-9, `${record.id} ${direction} rendered contact transform drift`); assert(contact.y >= 0 && contact.y <= 287, `${record.id} ${direction} rendered contact is outside the native canvas`); } }
    }
    for (const proof of Object.values(record.proofs)) { assert.equal(sha(resolve(repo, proof.file)), proof.sha256, `${record.id} proof drift: ${proof.file}`); }
  } else {
    for (const pose of ['stand', 'sit']) for (const direction of views) if (!(pose === 'stand' && direction === 'south')) assert.equal(record.poses[pose][direction].status, 'pending-source-art');
  }
}
assert.equal(manifest.counts.identities, 20);
assert.equal(manifest.counts.requiredPoses, 160);
assert.equal(manifest.counts.approvedOriginalSouth, approvedSouth);
assert.equal(manifest.counts.generatedSourcesAvailable, generatedSources);
assert.equal(manifest.counts.parentArtApprovedNewPoses, artApprovedIds.size * 7);
assert.equal(manifest.counts.parentFullyApprovedNewPoses, approvedIds.size * 7);
assert.equal(manifest.counts.newlyPackagedArtPendingReview, generatedSources * 7 - artApprovedIds.size * 7);
assert.equal(manifest.counts.contactReviewPendingForArtApprovedPoses, artApprovedIds.size * 7 - approvedIds.size * 7);
assert.equal(manifest.counts.packagedPoses, packaged);
assert.equal(manifest.counts.pendingPoses, 160 - packaged);
for (const id of artApprovedIds) { const record = manifest.records.find((entry) => entry.id === id); assert(record?.generatedSource, `${id} approval configured without a generated source`); assert(record.generatedSource.toolOutputProvenance.path, `${id} approval configured without provenance sidecar`); const snapshot = JSON.parse(readFileSync(resolve(import.meta.dirname, `approved-employee${id.slice(-3)}-7.json`), 'utf8')); assert.equal(snapshot.identity, id); assert.equal(snapshot.generatedSourceSha256, record.generatedSource.sha256, `${id} snapshot source binding drift`); if (approvedIds.has(id)) assert.deepEqual(snapshot.seatContactSourceY, config.seatContacts[id], `${id} frozen contact coordinates drift`); const expectedSlots = ['stand.east', 'stand.west', 'stand.north', 'sit.south', 'sit.east', 'sit.west', 'sit.north']; assert.deepEqual(snapshot.poses.map((pose) => `${pose.pose}.${pose.direction}`).sort(), [...expectedSlots].sort(), `${id} frozen snapshot must contain seven unique expected slots`); for (const frozen of snapshot.poses) { const pose = record.poses[frozen.pose]?.[frozen.direction]; assert(pose?.file && pose?.sha256, `${id} frozen slot is not populated: ${frozen.pose}.${frozen.direction}`); assert.deepEqual({ pose: frozen.pose, direction: frozen.direction, file: pose.file, sha256: pose.sha256 }, frozen, `${id} manifest pose is not bound to durable snapshot`); assert.equal(sha(resolve(repo, frozen.file)), frozen.sha256, `${id} durable approved pose drift`); } if (approvedIds.has(id)) { assert.equal(record.proofs.sourceCoordinates.status, 'parent-accepted-authored-contact-lines'); assert.equal(record.proofs.seatContact.status, 'parent-accepted-authored-contact-overlay'); } }
const complete = generatedSources === 20 && packaged === 160 && approvedIds.size === 20 && artApprovedIds.size === 20 && manifest.counts.pendingPoses === 0 && manifest.counts.newlyPackagedArtPendingReview === 0 && manifest.counts.contactReviewPendingForArtApprovedPoses === 0;
if (completeMode) assert(complete, 'complete mode requires 20 sources, 160 populated slots, and parent art/contact approval for all 140 new poses');
if (complete) assert.equal(manifest.status, 'parent-production-qa-approved-local-static-package-complete');
console.log(JSON.stringify({ status: complete ? 'PASS_COMPLETE' : 'PARTIAL_VALID', identities: 20, approvedOriginalSouth: approvedSouth, parentArtApprovedNewPoses: artApprovedIds.size * 7, parentFullyApprovedNewPoses: approvedIds.size * 7, generatedSources, newlyPackagedArtPendingReview: generatedSources * 7 - artApprovedIds.size * 7, contactReviewPendingForArtApprovedPoses: artApprovedIds.size * 7 - approvedIds.size * 7, packagedPoses: packaged, pendingPoses: 160 - packaged, generatedSouthCalibrationExcluded: generatedSources, gs018PreservationFiles: preservation.files.length, runtimeReady: false }));
