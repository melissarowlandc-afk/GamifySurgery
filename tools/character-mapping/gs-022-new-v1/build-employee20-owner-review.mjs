import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..'); const batch = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const manifest = JSON.parse(readFileSync(resolve(repo, batch, 'manifest.json'), 'utf8'));
const labels = { 'staff.receptionist': ['Receptionist'], 'staff.imaging_technician': ['Imaging', 'technician'], 'staff.periop_nurse': ['Perioperative', 'nurse'], 'staff.endoscopy_nurse': ['Endoscopy', 'nurse'], 'staff.endoscopist': ['Endoscopist'], 'staff.phlebotomist': ['Phlebotomist'], 'staff.evs_worker': ['EVS worker'], 'staff.glp1_np': ['GLP-1 nurse', 'practitioner'] };
const records = manifest.records;
async function render(name, background, foreground, scale) {
  const width = 5 * 160 * scale, title = 32 * scale, label = 30 * scale, height = title + 4 * (320 + label) * scale; const canvas = createCanvas(width, height), context = canvas.getContext('2d'); context.imageSmoothingEnabled = false; context.fillStyle = background; context.fillRect(0, 0, width, height); context.fillStyle = foreground; context.font = `${15 * scale}px sans-serif`; context.fillText('20 employee designs • First-look concepts', 8 * scale, 21 * scale);
  for (let index = 0; index < records.length; index++) { const record = records[index], image = await loadImage(resolve(repo, record.poses.stand.south.file)), x = index % 5 * 160 * scale, y = title + Math.floor(index / 5) * (320 + label) * scale; context.font = `${10 * scale}px sans-serif`; context.fillText(record.id.slice(-3), x + 3 * scale, y + 12 * scale); const lines = labels[record.role]; context.textAlign = 'right'; context.fillText(lines[0], x + 156 * scale, y + 12 * scale); if (lines[1]) context.fillText(lines[1], x + 156 * scale, y + 24 * scale); context.textAlign = 'left'; context.drawImage(image, 0, 0, 160, 320, x, y + label, 160 * scale, 320 * scale); }
  writeFileSync(resolve(repo, batch, 'proofs', name), canvas.toBuffer('image/png'));
}
await render('employee20-owner-review-light-CANDIDATE-NOT-APPROVED.png', '#f8fafc', '#111827', 1);
await render('employee20-owner-review-dark-CANDIDATE-NOT-APPROVED.png', '#17212b', '#f8fafc', 1);
await render('employee20-owner-review-enlarged-2x-light-CANDIDATE-NOT-APPROVED.png', '#f8fafc', '#111827', 2);
const hash = (relative) => createHash('sha256').update(readFileSync(resolve(repo, batch, relative))).digest('hex');
const proofFiles = ['proofs/employee20-native-32x64-dark-CANDIDATE-NOT-APPROVED.png', 'proofs/employee20-production-light-CANDIDATE-NOT-APPROVED.png', 'proofs/employee20-production-dark-CANDIDATE-NOT-APPROVED.png', 'proofs/employee20-enlarged-2x-light-CANDIDATE-NOT-APPROVED.png', 'proofs/employee20-owner-review-light-CANDIDATE-NOT-APPROVED.png', 'proofs/employee20-owner-review-dark-CANDIDATE-NOT-APPROVED.png', 'proofs/employee20-owner-review-enlarged-2x-light-CANDIDATE-NOT-APPROVED.png'];
manifest.designSpecs = { path: `${batch}/design-specs.json`, sha256: hash('design-specs.json') };
const proofStatus = manifest.approvalReceipt ? 'approved-identity-and-front-concept-only' : 'candidate-not-owner-approved';
manifest.proofLedger = proofFiles.map((file) => ({ file: `${batch}/${file}`, sha256: hash(file), status: proofStatus }));
writeFileSync(resolve(repo, batch, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ status: 'OWNER_REVIEW_BUILT', candidates: 20, ownerApproval: manifest.approvalReceipt ? 'approved-identity-and-front-concept-only' : 'pending' }));
