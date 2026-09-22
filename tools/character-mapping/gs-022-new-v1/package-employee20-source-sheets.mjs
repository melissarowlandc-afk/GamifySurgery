import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const batch = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const at = (...parts) => resolve(repo, batch, ...parts);
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const manifestPath = at('manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const specs = JSON.parse(readFileSync(at('design-specs.json'), 'utf8')).characters;
const approved = manifest.approvalReceipt
  ? new Map(JSON.parse(readFileSync(resolve(repo, manifest.approvalReceipt.path), 'utf8')).frontCandidates.map((entry) => [entry.id, entry]))
  : null;
if (approved) assert.equal(approved.size, 20, 'approved receipt must cover every front');
const roles = new Map(Object.entries(manifest.roleAssignments).flatMap(([role, ids]) => ids.map((id) => [id, role])));

function sourceBands(sheet) {
  const canvas = createCanvas(sheet.width, sheet.height); const context = canvas.getContext('2d'); context.drawImage(sheet, 0, 0);
  const pixels = context.getImageData(0, 0, sheet.width, sheet.height).data;
  const used = Array.from({ length: sheet.width }, (_, x) => Array.from({ length: sheet.height }, (_, y) => pixels[(y * sheet.width + x) * 4 + 3] >= 20).some(Boolean));
  const spans = []; let start = null; let gap = 0;
  for (let x = 0; x <= sheet.width; x++) if (x < sheet.width && used[x]) { if (start === null) start = x; gap = 0; } else if (start !== null && ++gap > 24) { const right = x - gap; if (right - start > 100) spans.push([start, right]); start = null; gap = 0; }
  assert.equal(spans.length, 5, `expected five visually separated source bands, got ${spans.length}`);
  return spans.map(([left, right]) => { let top = sheet.height; let bottom = -1; for (let y = 0; y < sheet.height; y++) for (let x = left; x <= right; x++) if (pixels[(y * sheet.width + x) * 4 + 3] >= 20) { top = Math.min(top, y); bottom = Math.max(bottom, y); } return { left, right, top, bottom, width: right - left + 1, height: bottom - top + 1 }; });
}
function measure(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, 160, 320).data; let transparent = 0; let left = 160; let top = 320; let right = -1; let bottom = -1;
  for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) { const alpha = data[(y * 160 + x) * 4 + 3]; if (alpha === 0) transparent++; if (alpha >= 20) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); } }
  assert(transparent > 0 && right >= 0 && left > 0 && right < 159 && top > 0 && bottom <= 287, 'candidate transparency, bounds, or floor check failed');
  return { alpha: { observedTransparentPixels: transparent, observedAlphaMethod: 'decoded RGBA pixel inspection; reports observed transparency only' }, visibleBounds: { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 } };
}
for (let sheetNumber = 1; sheetNumber <= 4; sheetNumber++) {
  const source = `${batch}/sources/sheet-${sheetNumber}-v1.png`; const prompt = `${batch}/prompts/sheet-${sheetNumber}-v1.txt`; const sheet = await loadImage(resolve(repo, source));
  sourceBands(sheet).forEach((band, offset) => {
    const number = (sheetNumber - 1) * 5 + offset + 1; const id = `gs022-new-employee-${String(number).padStart(3, '0')}`; const record = manifest.records.find((entry) => entry.id === id); const spec = specs.find((entry) => entry.number === number); assert(record && spec);
    const scale = 0.375; const tx = 80 - ((band.left + band.right + 1) / 2) * scale; const ty = 287 - (band.bottom + 1) * scale; const candidateRelative = `${batch}/candidates/${id}/stand-south-candidate.png`;
    const canvas = createCanvas(160, 320); const context = canvas.getContext('2d'); context.imageSmoothingEnabled = false; context.translate(tx, ty); context.scale(scale, scale); context.drawImage(sheet, 0, 0); const outputHash = createHash('sha256').update(canvas.toBuffer('image/png')).digest('hex');
    if (approved) {
      const receipt = approved.get(id); assert(receipt && receipt.file === candidateRelative, `${id} receipt binding changed`); assert.equal(sha(resolve(repo, candidateRelative)), receipt.sha256, `${id} approved front changed on disk`); assert.equal(outputHash, receipt.sha256, `${id} rebuilt pixels differ from approved front; refusing write`); assert.equal(record.poses.stand.south.ownerApproval, 'approved-identity-and-front-concept-only'); assert.equal(record.source.sha256, sha(resolve(repo, source)), `${id} approved source changed`); assert.equal(record.prompt.sha256, sha(resolve(repo, prompt)), `${id} approved prompt changed`); return;
    }
    mkdirSync(at('candidates', id), { recursive: true }); writeFileSync(resolve(repo, candidateRelative), canvas.toBuffer('image/png'));
    record.role = roles.get(id); record.appearanceSpec = spec.appearance; record.source = { path: source, sha256: sha(resolve(repo, source)), visibleBand: band, transform: { scale, translateX: tx, translateY: ty, policy: 'uniform scale and translation of original source; no retouch, cleanup, segmentation, or equal-grid crop' } }; record.prompt = { path: prompt, sha256: sha(resolve(repo, prompt)) }; record.poses.stand.south = { status: 'candidate-generated-pending-owner-review', file: candidateRelative, sha256: outputHash, ...measure(canvas), anchors: { bodyAxisX: 80, floorY: 287 } };
  });
}
if (approved) {
  console.log(JSON.stringify({ status: 'APPROVED_FRONT_PRESERVED', candidates: 20, ownerApproval: 'approved-identity-and-front-concept-only', filesWritten: 0 }));
} else {
  manifest.status = 'front-standing-candidates-packaged-pending-owner-review'; manifest.artDirectionStatus = 'candidate-review-pending'; writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'PACKAGED', candidates: 20, ownerApproval: 'pending', runtimeReady: false, remainingPoses: 140 }));
}
