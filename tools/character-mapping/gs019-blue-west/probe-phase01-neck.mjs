import { createCanvas, loadImage } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const output = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-v3-neck-probe');
mkdirSync(path.join(output, 'proofs'), { recursive: true });

function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function largestComponent(canvas, threshold = 160) {
  const { width, height } = canvas;
  const context = canvas.getContext('2d');
  const pixels = context.getImageData(0, 0, width, height), data = pixels.data;
  const hit = new Uint8Array(width * height), seen = new Uint8Array(width * height);
  for (let i = 0; i < hit.length; i++) hit[i] = data[i * 4 + 3] >= threshold ? 1 : 0;
  let best = [];
  for (let seed = 0; seed < hit.length; seed++) {
    if (!hit[seed] || seen[seed]) continue;
    const stack = [seed], component = [];
    seen[seed] = 1;
    while (stack.length) {
      const n = stack.pop(); component.push(n);
      const x = n % width, y = Math.floor(n / width);
      for (const next of [x ? n - 1 : -1, x + 1 < width ? n + 1 : -1, y ? n - width : -1, y + 1 < height ? n + width : -1]) {
        if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
      }
    }
    if (component.length > best.length) best = component;
  }
  let l = width, t = height, r = -1, b = -1;
  for (const n of best) { const x = n % width, y = Math.floor(n / width); l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y); }
  const out = createCanvas(r - l + 1, b - t + 1), ox = out.getContext('2d'), image = ox.createImageData(out.width, out.height);
  for (const n of best) { const x = n % width, y = Math.floor(n / width), s = n * 4, d = ((y - t) * out.width + x - l) * 4; image.data[d] = data[s]; image.data[d + 1] = data[s + 1]; image.data[d + 2] = data[s + 2]; image.data[d + 3] = 255; }
  ox.putImageData(image, 0, 0);
  return { canvas: out, bounds: { x: l, y: t, width: out.width, height: out.height } };
}

const donor = await loadImage(path.join(import.meta.dirname, 'whole-body-v3-source.png'));
const cell = createCanvas(384, 512), cellContext = cell.getContext('2d');
cellContext.drawImage(donor, 0, 0, 384, 512, 0, 0, 384, 512);
// Authored in the original phase-01 source cell. The lower edge follows the
// visible blue collar: all generated head/neck pixels above it are deleted.
const headPolygon = [[102, 12], [276, 12], [276, 170], [231, 170], [215, 156], [199, 171], [183, 184], [155, 186], [140, 168], [102, 168]];
const sourcePixels = cellContext.getImageData(0, 0, 384, 512);
for (let y = 0; y < 512; y++) for (let x = 0; x < 384; x++) if (pointInPolygon(x + 0.5, y + 0.5, headPolygon)) sourcePixels.data[(y * 384 + x) * 4 + 3] = 0;
cellContext.putImageData(sourcePixels, 0, 0);

const extracted = largestComponent(cell);
const scale = 174 / 324.5;
const scaled = createCanvas(Math.round(extracted.canvas.width * scale), Math.round(extracted.canvas.height * scale));
const scaledContext = scaled.getContext('2d'); scaledContext.imageSmoothingEnabled = false; scaledContext.drawImage(extracted.canvas, 0, 0, scaled.width, scaled.height);
const axisSourceX = 107.5 - extracted.bounds.x + 82;
const scaledAxisX = axisSourceX * scale;
const scaledNeckY = Math.round((168 - extracted.bounds.y) * scale);
const frame = createCanvas(160, 320), frameContext = frame.getContext('2d'); frameContext.imageSmoothingEnabled = false;
const bodyX = Math.round(80 - scaledAxisX), bodyY = 287 - (scaled.height - 1), neck = { x: 80, y: bodyY + scaledNeckY };
frameContext.drawImage(scaled, bodyX, bodyY);

const loaded = await loadRig(repo), standMeta = renderPose(loaded, standingPose('west')).metadata;
const baseMatrix = { ...standMeta.head.matrix, e: standMeta.head.matrix.e + (neck.x - standMeta.head.neckMid.x), f: standMeta.head.matrix.f + (neck.y - standMeta.head.neckMid.y) };
const bodyBeforeHead = frameContext.getImageData(0, 0, 160, 320);
function renderHead(dy) {
  const layer = createCanvas(160, 320), context = layer.getContext('2d'); context.imageSmoothingEnabled = false;
  drawStandardSlot(context, loaded.images.identity, standMeta.head.id, { ...baseMatrix, f: baseMatrix.f + dy });
  return layer;
}
function collarContacts(layer) {
  const headData = layer.getContext('2d').getImageData(0, 0, 160, 320).data, bodyData = bodyBeforeHead.data;
  let contacts = 0;
  for (let y = 80; y < 180; y++) for (let x = 48; x < 112; x++) {
    const i = y * 160 + x;
    if (headData[i * 4 + 3] < 24) continue;
    for (const n of [i - 1, i + 1, i - 160, i + 160]) if (bodyData[n * 4 + 3] >= 24) { contacts++; break; }
  }
  return contacts;
}
const unshiftedHead = renderHead(0), unshiftedData = unshiftedHead.getContext('2d').getImageData(0, 0, 160, 320).data;
let socketShiftY = 0;
for (let x = 70; x <= 82; x++) {
  let headBottom = -1, bodyTop = 320;
  for (let y = 70; y < 180; y++) {
    if (unshiftedData[(y * 160 + x) * 4 + 3] >= 24) headBottom = y;
    if (bodyBeforeHead.data[(y * 160 + x) * 4 + 3] >= 24) bodyTop = Math.min(bodyTop, y);
  }
  if (headBottom >= 0 && bodyTop < 320) socketShiftY = Math.max(socketShiftY, bodyTop - headBottom - 1);
}
if (socketShiftY > 20) throw new Error(`implausible measured collar shift ${socketShiftY}`);
const head = renderHead(socketShiftY), contactCount = collarContacts(head);
if (contactCount < 2) throw new Error('exact head did not meet preserved collar socket');
const matrix = { ...baseMatrix, f: baseMatrix.f + socketShiftY };
const headContext = head.getContext('2d');
const headProbe = headContext.getImageData(0, 0, 160, 320).data;
const socketProfile = [];
for (let x = 58; x <= 100; x += 3) {
  let headBottom = -1, bodyTop = 320;
  for (let y = 70; y < 180; y++) {
    if (headProbe[(y * 160 + x) * 4 + 3] >= 24) headBottom = y;
    if (bodyBeforeHead.data[(y * 160 + x) * 4 + 3] >= 24) bodyTop = Math.min(bodyTop, y);
  }
  socketProfile.push({ x, headBottom, bodyTop: bodyTop === 320 ? null : bodyTop, gap: bodyTop === 320 || headBottom < 0 ? null : bodyTop - headBottom - 1 });
}
const bodyPixels = frameContext.getImageData(0, 0, 160, 320), headPixels = headContext.getImageData(0, 0, 160, 320);
for (let i = 0; i < 160 * 320; i++) if (headPixels.data[i * 4 + 3]) bodyPixels.data[i * 4 + 3] = 0;
frameContext.putImageData(bodyPixels, 0, 0); frameContext.drawImage(head, 0, 0);
writeFileSync(path.join(output, 'phase01.png'), frame.toBuffer('image/png'));

const approved = await loadImage(path.join(repo, 'artifacts/character-movement/blue-glasses-v1/frames/stand/west.png'));
const proof = createCanvas(672, 688), proofContext = proof.getContext('2d'); proofContext.imageSmoothingEnabled = false;
proofContext.fillStyle = '#ded8ce'; proofContext.fillRect(0, 0, proof.width, proof.height);
proofContext.fillStyle = '#20242a'; proofContext.font = '18px sans-serif'; proofContext.fillText('approved standing 2x', 8, 24); proofContext.fillText('phase 01 source-boundary mask 2x', 344, 24);
proofContext.drawImage(approved, 8, 40, 320, 640); proofContext.drawImage(frame, 344, 40, 320, 640);
writeFileSync(path.join(output, 'proofs/approved-vs-phase01-2x.png'), proof.toBuffer('image/png'));
console.log(JSON.stringify({ output: path.relative(repo, output), sourceBoundary: headPolygon, extractedBounds: extracted.bounds, bodyX, bodyY, neck, socketShiftY, contactCount, headMatrix: matrix, socketProfile }, null, 2));
