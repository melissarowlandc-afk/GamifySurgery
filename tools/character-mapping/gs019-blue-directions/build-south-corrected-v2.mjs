import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const priorRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/north-south-draft-v1');
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/south-corrected-v2');
const probeOnly = process.argv.includes('--probe');
mkdirSync(path.join(outputRoot, 'frames'), { recursive: true });
mkdirSync(path.join(outputRoot, 'authored'), { recursive: true });
mkdirSync(path.join(outputRoot, 'proofs'), { recursive: true });
const sha = value => createHash('sha256').update(value).digest('hex');
const priorManifestBytes = readFileSync(path.join(priorRoot, 'manifest.json'));
const prior = JSON.parse(priorManifestBytes);
const south = prior.directions.south;
const phases = prior.phaseContract.ids;
const correctionScale = 106 / 113;
const loaded = await loadRig(repo);
const headMetadata = renderPose(loaded, standingPose('south')).metadata.head;
const approvedBytes = readFileSync(path.join(repo, south.approvedStanding.file));
const approvedImage = await loadImage(approvedBytes), approvedCanvas = createCanvas(160, 320);
approvedCanvas.getContext('2d').drawImage(approvedImage, 0, 0);

const isShirt = (r, g, b, a) => a >= 160 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;
const isSkin = (r, g, b, a) => a >= 80 && r >= 90 && r >= g + 8 && g >= b + 5 && b < 150;
function resize(canvas, scale) {
  const out = createCanvas(Math.round(canvas.width * scale), Math.round(canvas.height * scale));
  const context = out.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(canvas, 0, 0, out.width, out.height); return out;
}
function shirtMetrics(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let top = canvas.height; const widths = [], centers = [];
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) { const i = (y * canvas.width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) top = Math.min(top, y); }
  for (let y = top + 8; y <= Math.min(canvas.height - 1, top + 44); y++) {
    let left = canvas.width, right = -1;
    for (let x = 0; x < canvas.width; x++) { const i = (y * canvas.width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) { left = Math.min(left, x); right = Math.max(right, x); } }
    if (right >= left) { widths.push(right - left + 1); centers.push((left + right) / 2); }
  }
  widths.sort((a, b) => a - b); centers.sort((a, b) => a - b);
  return { top, shoulderWidth: widths[Math.floor(widths.length / 2)], axisX: centers[Math.floor(centers.length / 2)] };
}
function renderHead(matrix) {
  const canvas = createCanvas(160, 320), context = canvas.getContext('2d'); context.imageSmoothingEnabled = false;
  drawStandardSlot(context, loaded.images.identity, headMetadata.id, matrix); return canvas;
}
function nativeNeckPatch() {
  const source = approvedCanvas.getContext('2d').getImageData(0, 0, 160, 320), data = source.data;
  const selected = new Uint8Array(160 * 320);
  for (let y = 112; y <= 132; y++) for (let x = 58; x <= 102; x++) { const i = (y * 160 + x) * 4; if (isSkin(data[i], data[i + 1], data[i + 2], data[i + 3])) selected[y * 160 + x] = 1; }
  const expanded = selected.slice();
  for (let y = 112; y <= 132; y++) for (let x = 58; x <= 102; x++) {
    const n = y * 160 + x, i = n * 4; if (selected[n] || data[i + 3] < 80 || data[i] > 90 || data[i + 1] > 90 || data[i + 2] > 90) continue;
    let nearSkin = false; for (let dy = -1; dy <= 1 && !nearSkin; dy++) for (let dx = -1; dx <= 1; dx++) if (selected[(y + dy) * 160 + x + dx]) { nearSkin = true; break; }
    if (nearSkin) expanded[n] = 1;
  }
  const patch = createCanvas(160, 320), pixels = patch.getContext('2d').createImageData(160, 320); let pixelCount = 0, skinPixels = 0;
  for (let n = 0; n < expanded.length; n++) if (expanded[n]) { const i = n * 4; pixels.data[i] = data[i]; pixels.data[i + 1] = data[i + 1]; pixels.data[i + 2] = data[i + 2]; pixels.data[i + 3] = data[i + 3]; pixelCount++; if (selected[n]) skinPixels++; }
  patch.getContext('2d').putImageData(pixels, 0, 0); return { canvas: patch, pixelCount, skinPixels, bounds: { left: 58, top: 112, right: 102, bottom: 132 } };
}
function clearUnder(frame, overlay, deltaY = 0) {
  const context = frame.getContext('2d'), target = context.getImageData(0, 0, 160, 320), source = overlay.getContext('2d').getImageData(0, 0, 160, 320).data;
  for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) { const sourceY = y - deltaY; if (sourceY < 0 || sourceY >= 320) continue; if (source[(sourceY * 160 + x) * 4 + 3]) target.data[(y * 160 + x) * 4 + 3] = 0; }
  context.putImageData(target, 0, 0);
}
const neckPatch = nativeNeckPatch();
const prepared = {};
for (const phase of phases) {
  const authoredBytes = readFileSync(path.join(priorRoot, south.authored[phase].file)), authoredImage = await loadImage(authoredBytes), source = createCanvas(authoredImage.width, authoredImage.height);
  source.getContext('2d').drawImage(authoredImage, 0, 0); const scaled = resize(source, correctionScale), metrics = shirtMetrics(scaled);
  const bodyX = Math.round(80 - metrics.axisX), bodyY = 287 - (scaled.height - 1), socketY = bodyY + metrics.top;
  prepared[phase] = { scaled, metrics, bodyX, bodyY, socketY, priorAuthoredSha256: sha(authoredBytes) };
}
const baseSocketY = prepared['01'].socketY;
const report = {
  schemaVersion: 'gs019-blue-directions/south-corrected-v2', status: probeOnly ? 'probe' : 'prototype-needs-owner-review',
  canvas: prior.canvas, phaseContract: prior.phaseContract,
  correction: { reason: 'South donor body was uniformly oversized relative to approved standing raster', uniformScaleFromPrior: correctionScale, priorUniformScale: south.scales.southV2.uniformScale, correctedUniformScale: south.scales.southV2.uniformScale * correctionScale, floorY: 287, headBaseline: south.approvedHeadReference.matrix, neckPatch: { source: south.approvedStanding, pixelCount: neckPatch.pixelCount, skinPixels: neckPatch.skinPixels, bounds: neckPatch.bounds, policy: 'exact approved-standing native neck skin plus immediately attached dark outline; no stretching' } },
  pins: { priorManifest: { file: 'artifacts/character-movement/gs019-blue-directions/north-south-draft-v1/manifest.json', sha256: sha(priorManifestBytes) }, approvedStanding: south.approvedStanding, identitySource: south.identitySource }, frames: {}, authored: {}, proofs: {},
};
const buildPhases = probeOnly ? ['01', '05'] : phases;
for (const phase of buildPhases) {
  const item = prepared[phase], authoredBytes = item.scaled.toBuffer('image/png'), authoredFile = `authored/south-${phase}.png`;
  writeFileSync(path.join(outputRoot, authoredFile), authoredBytes);
  const deltaY = item.socketY - baseSocketY, headMatrix = { ...south.approvedHeadReference.matrix, f: south.approvedHeadReference.matrix.f + deltaY }, head = renderHead(headMatrix);
  const frame = createCanvas(160, 320), context = frame.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(item.scaled, item.bodyX, item.bodyY);
  clearUnder(frame, neckPatch.canvas, deltaY); clearUnder(frame, head); context.drawImage(neckPatch.canvas, 0, deltaY); context.drawImage(head, 0, 0);
  const frameBytes = frame.toBuffer('image/png'), frameFile = `frames/south-${phase}.png`; writeFileSync(path.join(outputRoot, frameFile), frameBytes);
  report.authored[phase] = { file: authoredFile, sha256: sha(authoredBytes), width: item.scaled.width, height: item.scaled.height, priorSha256: item.priorAuthoredSha256, uniformScaleFromPrior: correctionScale };
  report.frames[phase] = { file: frameFile, sha256: sha(frameBytes), bodyPlacement: { x: item.bodyX, y: item.bodyY, width: item.scaled.width, height: item.scaled.height }, shirtMetrics: item.metrics, socketY: item.socketY, deltaY, headMatrix };
}
const proof = createCanvas(960, 664 * buildPhases.length), proofContext = proof.getContext('2d'); proofContext.fillStyle = '#ded8ce'; proofContext.fillRect(0, 0, proof.width, proof.height); proofContext.fillStyle = '#20242a'; proofContext.font = '18px sans-serif'; proofContext.imageSmoothingEnabled = false;
for (const [row, phase] of buildPhases.entries()) {
  const priorImage = await loadImage(path.join(priorRoot, south.frames[phase].file)), correctedImage = await loadImage(path.join(outputRoot, report.frames[phase].file));
  for (const [column, [label, image]] of [['Standing', approvedImage], [`Prior ${phase}`, priorImage], [`Corrected ${phase}`, correctedImage]].entries()) { const x = column * 320, y = row * 664; proofContext.fillText(label, x + 8, y + 22); proofContext.drawImage(image, 0, 0, 160, 320, x, y + 24, 320, 640); }
}
const proofBytes = proof.toBuffer('image/png'), proofFile = probeOnly ? 'proofs/south-01-05-standing-prior-corrected-2x.png' : 'proofs/south-all8-standing-prior-corrected-2x.png'; writeFileSync(path.join(outputRoot, proofFile), proofBytes); report.proofs.comparison = { file: proofFile, sha256: sha(proofBytes), width: proof.width, height: proof.height };
const manifestBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`); writeFileSync(path.join(outputRoot, probeOnly ? 'probe-manifest.json' : 'manifest.json'), manifestBytes);
console.log(JSON.stringify({ status: 'PASS', mode: probeOnly ? 'probe' : 'all8', manifestSha256: sha(manifestBytes), proof: report.proofs.comparison, measurements: Object.fromEntries(Object.entries(report.frames).map(([phase, frame]) => [phase, { body: frame.bodyPlacement, shirt: frame.shirtMetrics, socketY: frame.socketY, deltaY: frame.deltaY, headF: frame.headMatrix.f }])) }, null, 2));
