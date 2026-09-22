import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const outputRoot = 'artifacts/character-statics/patient-public20-statics-v1';
const manifest = JSON.parse(readFileSync(resolve(repo, outputRoot, 'reference-manifest.json'), 'utf8'));
const intake = JSON.parse(readFileSync(resolve(repo, 'artifacts/character-statics/gs-022-new-v1/patient-public20-v1/manifest.json'), 'utf8'));
const expectedIds = Array.from({ length: 20 }, (_, index) => `gs022-new-person-${String(index + 1).padStart(3, '0')}`);
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const rgba = async (file) => {
  const image = await loadImage(file);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return { image, data: context.getImageData(0, 0, image.width, image.height).data };
};

assert.equal(manifest.count, 20);
assert.equal(manifest.references.length, 20);
assert.deepEqual(manifest.references.map((entry) => entry.id), expectedIds);
assert.equal(new Set(manifest.references.map((entry) => entry.id)).size, 20);
for (const entry of manifest.references) {
  const intakeRecord = intake.records.find((record) => record.id === entry.id); assert(intakeRecord, `${entry.id} absent from intake`);
  assert.deepEqual(entry.demographics, { category: intakeRecord.category, intendedAge: intakeRecord.intendedAge, intendedSex: intakeRecord.intendedSex, displayGender: intakeRecord.displayGender, demographicEvidence: intakeRecord.demographicEvidence }, `${entry.id} demographic metadata drift`);
  const outputPath = resolve(repo, entry.file);
  const sourcePath = resolve(repo, entry.source.file);
  assert.equal(sha256(outputPath), entry.sha256, `${entry.id} reference hash drift`);
  assert.equal(sha256(sourcePath), entry.source.sha256, `${entry.id} source hash drift`);
  assert.equal(sha256(resolve(repo, entry.approvedFront.file)), entry.approvedFront.sha256, `${entry.id} approved front hash drift`);
  assert.equal(sha256(resolve(repo, entry.approvalAuthority.receipt)), entry.approvalAuthority.receiptSha256, `${entry.id} receipt hash drift`);
  const output = await rgba(outputPath);
  const source = await rgba(sourcePath);
  const crop = entry.source.crop;
  assert.deepEqual([output.image.width, output.image.height], [crop.width, crop.height], `${entry.id} crop dimensions drift`);
  for (let y = 0; y < crop.height; y++) for (let x = 0; x < crop.width; x++) {
    const outputIndex = (y * crop.width + x) * 4;
    const sourceIndex = ((crop.y + y) * source.image.width + crop.x + x) * 4;
    for (let channel = 0; channel < 4; channel++) assert.equal(output.data[outputIndex + channel], source.data[sourceIndex + channel], `${entry.id} RGBA mismatch at ${x},${y}, channel ${channel}`);
  }
}
console.log(JSON.stringify({ status: 'PASS', references: 20, rgbaSourceCropMatches: 20, approvalReceiptBindings: 20 }));
