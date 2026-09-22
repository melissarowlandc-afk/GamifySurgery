import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/north-south-probe-v1');
mkdirSync(path.join(outputRoot, 'frames'), { recursive: true });
mkdirSync(path.join(outputRoot, 'proofs'), { recursive: true });
const sha = (value) => createHash('sha256').update(value).digest('hex');
const reference = JSON.parse(readFileSync(path.join(repo, 'artifacts/character-movement/gs019-blue-directions/source-reference/source-investigation.json'), 'utf8'));
const loaded = await loadRig(repo);
const phaseCells = { '01': 4, '05': 0 };
const sheetFiles = {
  north: 'tools/character-mapping/gs019-blue-directions/north-whole-body-v1-source.png',
  south: 'tools/character-mapping/gs019-blue-directions/south-whole-body-v1-source.png',
};
const promptFiles = {
  north: 'tools/character-mapping/gs019-blue-directions/north-whole-body-v1-prompt.txt',
  south: 'tools/character-mapping/gs019-blue-directions/south-whole-body-v1-prompt.txt',
};
const isShirt = (r, g, b, a) => a >= 160 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;
const isBlueCollar = (r, g, b, a) => a >= 24 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;

function sourceCell(image, index) {
  const width = image.width / 4;
  const height = image.height / 2;
  const canvas = createCanvas(width, height);
  canvas.getContext('2d').drawImage(image, (index % 4) * width, Math.floor(index / 4) * height, width, height, 0, 0, width, height);
  return canvas;
}

function largestComponent(canvas, threshold = 160) {
  const { width, height } = canvas;
  const source = canvas.getContext('2d').getImageData(0, 0, width, height);
  const hit = new Uint8Array(width * height), seen = new Uint8Array(hit.length);
  for (let i = 0; i < hit.length; i++) hit[i] = source.data[i * 4 + 3] >= threshold ? 1 : 0;
  let best = [];
  for (let seed = 0; seed < hit.length; seed++) {
    if (!hit[seed] || seen[seed]) continue;
    const stack = [seed], component = [];
    seen[seed] = 1;
    while (stack.length) {
      const n = stack.pop(); component.push(n);
      const x = n % width, y = Math.floor(n / width);
      for (const next of [x ? n - 1 : -1, x + 1 < width ? n + 1 : -1, y ? n - width : -1, y + 1 < height ? n + width : -1]) if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
    }
    if (component.length > best.length) best = component;
  }
  let left = width, top = height, right = -1, bottom = -1;
  const selected = new Uint8Array(width * height);
  for (const n of best) { selected[n] = 1; const x = n % width, y = Math.floor(n / width); left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
  const out = createCanvas(right - left + 1, bottom - top + 1);
  const context = out.getContext('2d'), pixels = context.createImageData(out.width, out.height);
  for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) if (selected[y * width + x]) {
    const from = (y * width + x) * 4, to = ((y - top) * out.width + x - left) * 4;
    pixels.data[to] = source.data[from]; pixels.data[to + 1] = source.data[from + 1]; pixels.data[to + 2] = source.data[from + 2]; pixels.data[to + 3] = source.data[from + 3];
  }
  context.putImageData(pixels, 0, 0);
  return { canvas: out, bounds: { x: left, y: top, width: out.width, height: out.height }, pixels: best.length };
}

function removeGeneratedHead(cell) {
  const { width, height } = cell, context = cell.getContext('2d'), pixels = context.getImageData(0, 0, width, height), data = pixels.data;
  const shirt = new Uint8Array(width * height), seen = new Uint8Array(width * height);
  for (let y = 0; y < Math.round(height * 0.7); y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) shirt[y * width + x] = 1; }
  let best = [];
  for (let seed = 0; seed < shirt.length; seed++) {
    if (!shirt[seed] || seen[seed]) continue;
    const stack = [seed], component = []; seen[seed] = 1;
    while (stack.length) { const n = stack.pop(); component.push(n); const x = n % width, y = Math.floor(n / width); for (const next of [x ? n - 1 : -1, x + 1 < width ? n + 1 : -1, y ? n - width : -1, y + 1 < height ? n + width : -1]) if (next >= 0 && shirt[next] && !seen[next]) { seen[next] = 1; stack.push(next); } }
    if (component.length > best.length) best = component;
  }
  shirt.fill(0); for (const n of best) shirt[n] = 1;
  const top = new Array(width).fill(null), protectedMask = new Uint8Array(width * height);
  for (let x = 0; x < width; x++) for (let y = 0; y < Math.round(height * 0.7); y++) if (shirt[y * width + x]) { top[x] = y; break; }
  const known = []; for (let x = 0; x < width; x++) if (Number.isFinite(top[x])) known.push(x);
  if (known.length < 20) throw new Error('shirt collar not found');
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (shirt[y * width + x]) for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (dx * dx + dy * dy <= 16) { const px = x + dx, py = y + dy; if (px >= 0 && px < width && py >= 0 && py < height) protectedMask[py * width + px] = 1; }
  const minX = known[0], maxX = known.at(-1);
  for (let x = 0; x < width; x++) if (!Number.isFinite(top[x])) top[x] = top[x < minX ? minX : maxX];
  let removed = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (y <= top[x] + 4 && !protectedMask[y * width + x]) { const i = (y * width + x) * 4; if (data[i + 3]) removed++; data[i + 3] = 0; }
  context.putImageData(pixels, 0, 0);
  return { removed, shirtX: [minX, maxX], shirtTop: [Math.min(...top), Math.max(...top)] };
}

function shirtMetrics(canvas, minY = 0) {
  const { width, height } = canvas, data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let top = height;
  for (let y = minY; y < Math.min(height, 220); y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) top = Math.min(top, y); }
  const widths = [], centers = [];
  for (let y = top + 8; y <= Math.min(height - 1, top + 44); y++) {
    let left = width, right = -1;
    for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) { left = Math.min(left, x); right = Math.max(right, x); } }
    if (right >= left) { widths.push(right - left + 1); centers.push((left + right) / 2); }
  }
  widths.sort((a, b) => a - b); centers.sort((a, b) => a - b);
  return { top, shoulderWidth: widths[Math.floor(widths.length / 2)], axisX: centers[Math.floor(centers.length / 2)] };
}

function resize(canvas, scale) {
  const out = createCanvas(Math.round(canvas.width * scale), Math.round(canvas.height * scale));
  const context = out.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(canvas, 0, 0, out.width, out.height); return out;
}

function isolateIdentity(head) {
  const context = head.getContext('2d'), pixels = context.getImageData(0, 0, head.width, head.height), data = pixels.data;
  let top = head.height, bottom = -1;
  for (let y = 0; y < head.height; y++) for (let x = 0; x < head.width; x++) if (data[(y * head.width + x) * 4 + 3] >= 24) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
  const collarStart = top + Math.floor((bottom - top + 1) * 0.86); let removed = 0;
  for (let y = collarStart; y < head.height; y++) { let firstBlue = head.width, right = -1; for (let x = 0; x < head.width; x++) { const i = (y * head.width + x) * 4; if (data[i + 3] >= 24) right = x; if (isBlueCollar(data[i], data[i + 1], data[i + 2], data[i + 3])) firstBlue = Math.min(firstBlue, x); } if (firstBlue < head.width) for (let x = firstBlue; x <= right; x++) { const i = (y * head.width + x) * 4; if (data[i + 3]) removed++; data[i + 3] = 0; } }
  context.putImageData(pixels, 0, 0); return { removed, collarStart, top, bottom };
}

function clearUnderHead(frame, head) {
  const context = frame.getContext('2d'), body = context.getImageData(0, 0, 160, 320), identity = head.getContext('2d').getImageData(0, 0, 160, 320).data;
  for (let i = 0; i < 160 * 320; i++) if (identity[i * 4 + 3]) body.data[i * 4 + 3] = 0;
  context.putImageData(body, 0, 0);
}

const report = { schemaVersion: 'gs019-blue-directions/north-south-contact-probe-v1', phaseMap: { '01': 'cell05', '05': 'cell01' }, directions: {} };
const proofs = [];
for (const direction of ['north', 'south']) {
  const sheetBytes = readFileSync(path.join(repo, sheetFiles[direction])), sheet = await loadImage(path.join(repo, sheetFiles[direction]));
  if (sheet.width !== 1536 || sheet.height !== 1024) throw new Error(`${direction} donor dimensions`);
  const approvedBytes = readFileSync(path.join(repo, reference.directions[direction].approvedStanding.file)), approved = await loadImage(path.join(repo, reference.directions[direction].approvedStanding.file)), approvedCanvas = createCanvas(160, 320); approvedCanvas.getContext('2d').drawImage(approved, 0, 0);
  const approvedMetrics = shirtMetrics(approvedCanvas, 90), targetSpan = 287 - approvedMetrics.top + 1;
  const bodies = [], rawMetrics = [];
  for (let cellIndex = 0; cellIndex < 8; cellIndex++) { const cell = sourceCell(sheet, cellIndex), headRemoval = removeGeneratedHead(cell), body = largestComponent(cell), metrics = shirtMetrics(body.canvas); bodies.push({ cellIndex, ...body, headRemoval, metrics }); rawMetrics.push({ span: body.canvas.height - metrics.top, shoulderWidth: metrics.shoulderWidth }); }
  const spans = rawMetrics.map((item) => item.span).sort((a, b) => a - b), medianSpan = (spans[3] + spans[4]) / 2, scale = targetSpan / medianSpan;
  const widths = rawMetrics.map((item) => item.shoulderWidth).sort((a, b) => a - b), medianWidth = (widths[3] + widths[4]) / 2, scaleFromWidth = approvedMetrics.shoulderWidth / medianWidth;
  const metadata = renderPose(loaded, standingPose(direction)).metadata.head, native = reference.directions[direction].actualStandingRasterHead;
  const directionFrames = {};
  let baseSocketY = null;
  const prepared = {};
  for (const phase of ['01', '05']) {
    const bodyRecord = bodies[phaseCells[phase]], scaled = resize(bodyRecord.canvas, scale), scaledMetrics = shirtMetrics(scaled), bodyX = Math.round(80 - scaledMetrics.axisX), bodyY = 287 - (scaled.height - 1), socketY = bodyY + scaledMetrics.top;
    prepared[phase] = { bodyRecord, scaled, scaledMetrics, bodyX, bodyY, socketY }; if (phase === '01') baseSocketY = socketY;
  }
  for (const phase of ['01', '05']) {
    const item = prepared[phase], deltaY = item.socketY - baseSocketY, frame = createCanvas(160, 320), context = frame.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(item.scaled, item.bodyX, item.bodyY);
    const headMatrix = { ...native.matrix, f: native.matrix.f + deltaY }, head = createCanvas(160, 320), headContext = head.getContext('2d'); headContext.imageSmoothingEnabled = false; drawStandardSlot(headContext, loaded.images.identity, metadata.id, headMatrix); const identityMask = isolateIdentity(head); clearUnderHead(frame, head); context.drawImage(head, 0, 0);
    const bytes = frame.toBuffer('image/png'), file = `frames/${direction}-${phase}.png`; writeFileSync(path.join(outputRoot, file), bytes); directionFrames[phase] = { file, sha256: sha(bytes), sourceCell: item.bodyRecord.cellIndex + 1, bodyPlacement: { x: item.bodyX, y: item.bodyY, width: item.scaled.width, height: item.scaled.height }, socketY: item.socketY, deltaY, headMatrix, identityMask };
  }
  report.directions[direction] = { pins: { donor: { file: sheetFiles[direction], sha256: sha(sheetBytes) }, prompt: { file: promptFiles[direction], sha256: sha(readFileSync(path.join(repo, promptFiles[direction]))) }, approvedStanding: reference.directions[direction].approvedStanding, identitySource: reference.directions[direction].identitySource }, approvedMetrics, targetSpan, medianDonorSpan: medianSpan, uniformScale: scale, medianDonorShoulderWidth: medianWidth, scaleFromShoulderWidth: scaleFromWidth, renderedMedianShoulderWidth: medianWidth * scale, shoulderWidthDelta: medianWidth * scale - approvedMetrics.shoulderWidth, frames: directionFrames };
}

const full = createCanvas(960, 1328), fullContext = full.getContext('2d'); fullContext.fillStyle = '#ded8ce'; fullContext.fillRect(0, 0, full.width, full.height); fullContext.fillStyle = '#20242a'; fullContext.font = '16px sans-serif'; fullContext.imageSmoothingEnabled = false;
for (const [row, direction] of ['north', 'south'].entries()) { const y = row * 664, directionReport = report.directions[direction], approved = await loadImage(path.join(repo, directionReport.pins.approvedStanding.file)), phase01 = await loadImage(path.join(outputRoot, directionReport.frames['01'].file)), phase05 = await loadImage(path.join(outputRoot, directionReport.frames['05'].file)); fullContext.fillText(`${direction.toUpperCase()} standing`, 8, y + 18); fullContext.fillText(`${direction.toUpperCase()} 01 · cell05`, 328, y + 18); fullContext.fillText(`${direction.toUpperCase()} 05 · cell01`, 648, y + 18); fullContext.drawImage(approved, 0, 0, 160, 320, 0, y + 24, 320, 640); fullContext.drawImage(phase01, 0, 0, 160, 320, 320, y + 24, 320, 640); fullContext.drawImage(phase05, 0, 0, 160, 320, 640, y + 24, 320, 640); }
const fullBytes = full.toBuffer('image/png'); writeFileSync(path.join(outputRoot, 'proofs', 'north-south-01-05-standing-probe-2x.png'), fullBytes); report.proof = { file: 'proofs/north-south-01-05-standing-probe-2x.png', sha256: sha(fullBytes), width: full.width, height: full.height };
const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`); writeFileSync(path.join(outputRoot, 'probe-report.json'), reportBytes); console.log(JSON.stringify({ status: 'PASS', reportSha256: sha(reportBytes), directions: report.directions }, null, 2));
