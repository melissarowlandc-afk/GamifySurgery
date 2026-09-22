import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const intakeRoot = 'artifacts/character-statics/gs-022-new-v1/patient-public20-v1';
const outputRoot = 'artifacts/character-statics/patient-public20-statics-v1';
const manifest = JSON.parse(readFileSync(resolve(repo, intakeRoot, 'manifest.json'), 'utf8'));
const receiptRelative = `${outputRoot}/approvals/patient-public20-front-concepts-user-approval-v1.json`;
const receiptPath = resolve(repo, receiptRelative);
const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const expectedIds = Array.from({ length: 20 }, (_, index) => `gs022-new-person-${String(index + 1).padStart(3, '0')}`);
const approvedFronts = new Map(receipt.frontCandidates.map((entry) => [entry.id, entry]));
const padding = 16;

assert.deepEqual(manifest.records.map((record) => record.id), expectedIds, 'employee roster drift');
assert.equal(receipt.exactUserQuote, 'Create stills for the 20 more new characters (patients or general public) who were just approved', 'unexpected approval receipt');
assert.equal(sha256(resolve(repo, receipt.sourceIntake.path)), receipt.sourceIntake.sha256, 'approval receipt intake binding drift');
assert.equal(approvedFronts.size, 20, 'approval receipt must bind all 20 fronts');

mkdirSync(resolve(repo, outputRoot, 'references'), { recursive: true });
const references = [];
for (const record of manifest.records) {
  const approved = approvedFronts.get(record.id);
  const south = record.poses.stand.south;
  assert(approved, `${record.id} missing from approval receipt`);
  assert.deepEqual(approved, { id: record.id, file: south.file, sha256: south.sha256 }, `${record.id} approval binding drift`);
  assert.equal(sha256(resolve(repo, approved.file)), approved.sha256, `${record.id} approved front hash drift`);
  assert.equal(sha256(resolve(repo, record.source.path)), record.source.sha256, `${record.id} approved source hash drift`);

  const image = await loadImage(resolve(repo, record.source.path));
  const band = record.source.visibleBand;
  const crop = {
    x: Math.max(0, band.left - padding),
    y: Math.max(0, band.top - padding),
    rightExclusive: Math.min(image.width, band.right + 1 + padding),
    bottomExclusive: Math.min(image.height, band.bottom + 1 + padding),
  };
  crop.width = crop.rightExclusive - crop.x;
  crop.height = crop.bottomExclusive - crop.y;
  assert(crop.width > band.width && crop.height > band.height, `${record.id} lacks transparent crop margin`);

  const canvas = createCanvas(crop.width, crop.height);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  const relativeFile = `${outputRoot}/references/${record.id}-approved-source.png`;
  writeFileSync(resolve(repo, relativeFile), canvas.toBuffer('image/png'));
  references.push({
    id: record.id,
    file: relativeFile,
    sha256: sha256(resolve(repo, relativeFile)),
    dimensions: { width: crop.width, height: crop.height },
    source: {
      file: record.source.path,
      sha256: record.source.sha256,
      dimensions: { width: image.width, height: image.height },
      visibleBand: band,
      crop,
      transparentPaddingRequestedPx: padding,
      pixelPolicy: 'Decoded RGBA is copied exactly from the approved source crop; no scaling, retouching, cleanup, or color change.',
    },
    approvedFront: approved,
    demographics: {
      category: record.category,
      intendedAge: record.intendedAge,
      intendedSex: record.intendedSex,
      displayGender: record.displayGender,
      demographicEvidence: record.demographicEvidence,
    },
    approvalAuthority: {
      receipt: receiptRelative,
      receiptSha256: sha256(receiptPath),
      scope: receipt.approvalScope,
      exactUserQuote: receipt.exactUserQuote,
    },
  });
}

const referenceManifest = {
  schemaVersion: 1,
  status: 'approved-source-reference-crops-prepared',
  count: references.length,
  paddingPx: padding,
  references,
};
writeFileSync(resolve(repo, outputRoot, 'reference-manifest.json'), `${JSON.stringify(referenceManifest, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', references: references.length, first: references[0].file }));
