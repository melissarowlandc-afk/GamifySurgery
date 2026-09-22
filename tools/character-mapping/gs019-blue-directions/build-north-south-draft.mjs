import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/north-south-draft-v1');
mkdirSync(path.join(outputRoot, 'frames'), { recursive: true });
mkdirSync(path.join(outputRoot, 'proofs'), { recursive: true });
mkdirSync(path.join(outputRoot, 'authored'), { recursive: true });
const sha = (value) => createHash('sha256').update(value).digest('hex');
const reference = JSON.parse(readFileSync(path.join(repo, 'artifacts/character-movement/gs019-blue-directions/source-reference/source-investigation.json'), 'utf8'));
const loaded = await loadRig(repo);
const sheetConfigs = {
  southV2: { file: 'tools/character-mapping/gs019-blue-directions/south-whole-body-v2-source.png', prompt: 'tools/character-mapping/gs019-blue-directions/south-whole-body-v2-prompt.txt', cols: 4, rows: 2 },
  northV1: { file: 'tools/character-mapping/gs019-blue-directions/north-whole-body-v1-source.png', prompt: 'tools/character-mapping/gs019-blue-directions/north-whole-body-v1-prompt.txt', cols: 4, rows: 2 },
  northTransitions: { file: 'tools/character-mapping/gs019-blue-directions/north-transitions-v1-source.png', prompt: 'tools/character-mapping/gs019-blue-directions/north-transitions-v1-prompt.txt', cols: 2, rows: 2 },
};
const specs = {
  south: [
    { phase: '01', sheet: 'southV2', cell: 4 }, { phase: '02', sheet: 'southV2', cell: 5 }, { phase: '03', sheet: 'southV2', cell: 6 }, { phase: '04', sheet: 'southV2', cell: 3 },
    { phase: '05', sheet: 'southV2', cell: 0 }, { phase: '06', sheet: 'southV2', cell: 5, mirror: true }, { phase: '07', sheet: 'southV2', cell: 6, mirror: true }, { phase: '08', sheet: 'southV2', cell: 3, mirror: true },
  ],
  north: [
    { phase: '01', sheet: 'northV1', cell: 4 }, { phase: '02', sheet: 'northV1', cell: 1 }, { phase: '03', sheet: 'northV1', cell: 2 }, { phase: '04', sheet: 'northV1', cell: 3 },
    { phase: '05', sheet: 'northV1', cell: 0 }, { phase: '06', sheet: 'northV1', cell: 1, mirror: true }, { phase: '07', sheet: 'northV1', cell: 2, mirror: true }, { phase: '08', sheet: 'northV1', cell: 3, mirror: true },
  ],
};
const isShirt = (r, g, b, a) => a >= 160 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;
const isBlueCollar = (r, g, b, a) => a >= 24 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165;

function sourceCell(image, index, cols, rows) {
  const width = image.width / cols;
  const height = image.height / rows;
  const canvas = createCanvas(width, height);
  canvas.getContext('2d').drawImage(image, (index % cols) * width, Math.floor(index / cols) * height, width, height, 0, 0, width, height);
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

function removeGeneratedHead(cell, preserveRearCollar = false) {
  const { width, height } = cell, context = cell.getContext('2d'), pixels = context.getImageData(0, 0, width, height), data = pixels.data;
  const shirt = new Uint8Array(width * height), seen = new Uint8Array(width * height);
  for (let y = 0; y < Math.round(height * 0.7); y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) shirt[y * width + x] = 1; }
  let best = [], bestRecord = null, garmentComponents = [], componentRecords = [];
  for (let seed = 0; seed < shirt.length; seed++) {
    if (!shirt[seed] || seen[seed]) continue;
    const stack = [seed], component = []; seen[seed] = 1;
    let minX = width, maxX = -1, minY = height, maxY = -1;
    while (stack.length) { const n = stack.pop(); component.push(n); const x = n % width, y = Math.floor(n / width); minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); for (const next of [x ? n - 1 : -1, x + 1 < width ? n + 1 : -1, y ? n - width : -1, y + 1 < height ? n + width : -1]) if (next >= 0 && shirt[next] && !seen[next]) { seen[next] = 1; stack.push(next); } }
    const record = { component, minX, maxX, minY, maxY }; componentRecords.push(record);
    if (component.length > best.length) { best = component; bestRecord = record; }
    if (component.length >= 200 && maxY >= height * .35) garmentComponents.push(component);
  }
  if (preserveRearCollar && bestRecord) for (const record of componentRecords) {
    const overlapsShirt = record.maxX >= bestRecord.minX && record.minX <= bestRecord.maxX;
    const nearShirtTop = record.maxY >= bestRecord.minY - 20 && record.minY <= bestRecord.minY + 10;
    if (record.component.length >= 10 && overlapsShirt && nearShirtTop && !garmentComponents.includes(record.component)) garmentComponents.push(record.component);
  }
  shirt.fill(0); for (const component of garmentComponents.length ? garmentComponents : [best]) for (const n of component) shirt[n] = 1;
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

function removeSmallAlphaComponents(canvas, minimumSize = 4) {
  const context = canvas.getContext('2d'), image = context.getImageData(0, 0, canvas.width, canvas.height), data = image.data;
  const hit = new Uint8Array(canvas.width * canvas.height), seen = new Uint8Array(hit.length);
  for (let n = 0; n < hit.length; n++) if (data[n * 4 + 3]) hit[n] = 1;
  let removedComponents = 0, removedPixels = 0;
  for (let seed = 0; seed < hit.length; seed++) {
    if (!hit[seed] || seen[seed]) continue;
    const stack = [seed], component = []; seen[seed] = 1;
    while (stack.length) {
      const n = stack.pop(), x = n % canvas.width, y = Math.floor(n / canvas.width); component.push(n);
      for (const next of [x ? n - 1 : -1, x + 1 < canvas.width ? n + 1 : -1, y ? n - canvas.width : -1, y + 1 < canvas.height ? n + canvas.width : -1]) if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
    }
    if (component.length >= minimumSize) continue;
    removedComponents++; removedPixels += component.length;
    for (const n of component) data[n * 4 + 3] = 0;
  }
  context.putImageData(image, 0, 0);
  return { minimumSize, removedComponents, removedPixels };
}

function mirror(canvas) { const out = createCanvas(canvas.width, canvas.height), context = out.getContext('2d'); context.imageSmoothingEnabled = false; context.translate(canvas.width, 0); context.scale(-1, 1); context.drawImage(canvas, 0, 0); return out; }

function isolateIdentity(head) {
  const context = head.getContext('2d'), pixels = context.getImageData(0, 0, head.width, head.height), data = pixels.data;
  let top = head.height, bottom = -1;
  for (let y = 0; y < head.height; y++) for (let x = 0; x < head.width; x++) if (data[(y * head.width + x) * 4 + 3] >= 24) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
  const collarStart = top + Math.floor((bottom - top + 1) * 0.86); let removed = 0;
  for (let y = collarStart; y < head.height; y++) { let firstBlue = head.width, right = -1; for (let x = 0; x < head.width; x++) { const i = (y * head.width + x) * 4; if (data[i + 3] >= 24) right = x; if (isBlueCollar(data[i], data[i + 1], data[i + 2], data[i + 3])) firstBlue = Math.min(firstBlue, x); } if (firstBlue < head.width) for (let x = firstBlue; x <= right; x++) { const i = (y * head.width + x) * 4; if (data[i + 3]) removed++; data[i + 3] = 0; } }
  context.putImageData(pixels, 0, 0); return { removed, collarStart, top, bottom };
}

function removeNorthNativeCollar(head) {
  const context = head.getContext('2d'), pixels = context.getImageData(0, 0, head.width, head.height), data = pixels.data;
  const clothing = new Uint8Array(head.width * head.height), outline = new Uint8Array(clothing.length);
  let top = head.height, bottom = -1;
  for (let y = 0; y < head.height; y++) for (let x = 0; x < head.width; x++) if (data[(y * head.width + x) * 4 + 3] >= 24) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
  const scanStart = top + Math.floor((bottom - top + 1) * .78);
  let minX = head.width, maxX = -1, minY = head.height, maxY = -1, clothingPixels = 0;
  for (let y = scanStart; y < head.height; y++) for (let x = 0; x < head.width; x++) {
    const i = (y * head.width + x) * 4;
    if (!isBlueCollar(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
    clothing[y * head.width + x] = 1; clothingPixels++;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  // Remove only the rendered blue garment and its immediately attached dark
  // lower outline.  The previous rectangular clear also erased neck/hair pixels.
  if (maxX >= minX) for (let y = minY; y <= Math.min(head.height - 1, maxY + 2); y++) for (let x = Math.max(0, minX - 2); x <= Math.min(head.width - 1, maxX + 2); x++) {
    const n = y * head.width + x, i = n * 4;
    if (data[i + 3] < 24 || clothing[n]) continue;
    const darkOutline = data[i] <= 80 && data[i + 1] <= 80 && data[i + 2] <= 80;
    const neutralCollarHighlight = data[i] >= 100 && Math.abs(data[i] - data[i + 1]) <= 12 && data[i + 1] - data[i + 2] >= 8 && data[i + 1] - data[i + 2] <= 32;
    if (!darkOutline && !neutralCollarHighlight) continue;
    let touchesClothing = false;
    for (let dy = -2; dy <= 2 && !touchesClothing; dy++) for (let dx = -2; dx <= 2; dx++) {
      const px = x + dx, py = y + dy;
      if (px >= 0 && px < head.width && py >= 0 && py < head.height && clothing[py * head.width + px]) { touchesClothing = true; break; }
    }
    if (touchesClothing) outline[n] = 1;
  }
  let removed = 0, outlinePixels = 0;
  for (let n = 0; n < clothing.length; n++) if (clothing[n] || outline[n]) { if (data[n * 4 + 3]) removed++; if (outline[n]) outlinePixels++; data[n * 4 + 3] = 0; }
  context.putImageData(pixels, 0, 0);
  return { removed, clothingPixels, attachedEdgePixels: outlinePixels, scanStart, bounds: { minX, minY, maxX, maxY }, policy: 'blue garment pixels plus immediately attached dark outline or neutral collar-edge highlight only' };
}

function clearUnderHead(frame, head) {
  const context = frame.getContext('2d'), body = context.getImageData(0, 0, 160, 320), identity = head.getContext('2d').getImageData(0, 0, 160, 320).data;
  for (let i = 0; i < 160 * 320; i++) if (identity[i * 4 + 3]) body.data[i * 4 + 3] = 0;
  context.putImageData(body, 0, 0);
}

const sheets = {}, bodyLibrary = {};
for (const [id, config] of Object.entries(sheetConfigs)) {
  const bytes = readFileSync(path.join(repo, config.file)), image = await loadImage(path.join(repo, config.file)); sheets[id] = { ...config, bytes, image }; bodyLibrary[id] = [];
  for (let cellIndex = 0; cellIndex < config.cols * config.rows; cellIndex++) { const cell = sourceCell(image, cellIndex, config.cols, config.rows), headRemoval = removeGeneratedHead(cell, id.startsWith('north')), body = largestComponent(cell), metrics = shirtMetrics(body.canvas); bodyLibrary[id].push({ cellIndex, ...body, headRemoval, metrics }); }
}
const report = { schemaVersion: 'gs019-blue-directions/north-south-draft-v1', status: 'prototype-needs-parent-motion-review', canvas: { width: 160, height: 320, axisX: 80, floorY: 287 }, phaseContract: reference.phaseContract, headPolicy: { north: 'native raster head identity retained; native blue garment pixels and immediately attached lower outline removed so the intact whole-body donor collar remains', south: 'full native raster head identity including native collar retained; generated donor head removed at source shirt boundary' }, directions: {} };
for (const direction of ['north', 'south']) {
  const approved = await loadImage(path.join(repo, reference.directions[direction].approvedStanding.file)), approvedCanvas = createCanvas(160, 320); approvedCanvas.getContext('2d').drawImage(approved, 0, 0); const approvedMetrics = shirtMetrics(approvedCanvas, 90), targetSpan = 287 - approvedMetrics.top + 1;
  const usedSheets = [...new Set(specs[direction].map(spec => spec.sheet))], scales = {}, scaleEvidence = {};
  for (const sheetId of usedSheets) { const records = bodyLibrary[sheetId], spans = records.map(record => record.canvas.height - record.metrics.top).sort((a, b) => a - b), widths = records.map(record => record.metrics.shoulderWidth).sort((a, b) => a - b), middle = (values) => values.length % 2 ? values[Math.floor(values.length / 2)] : (values[values.length / 2 - 1] + values[values.length / 2]) / 2, medianSpan = middle(spans), medianWidth = middle(widths), scale = targetSpan / medianSpan; scales[sheetId] = scale; scaleEvidence[sheetId] = { medianSpan, medianShoulderWidth: medianWidth, uniformScale: scale, renderedShoulderWidth: medianWidth * scale, approvedShoulderWidth: approvedMetrics.shoulderWidth, shoulderDelta: medianWidth * scale - approvedMetrics.shoulderWidth }; }
  const metadata = renderPose(loaded, standingPose(direction)).metadata.head, native = reference.directions[direction].actualStandingRasterHead, prepared = {};
  for (const spec of specs[direction]) { const source = bodyLibrary[spec.sheet][spec.cell], oriented = spec.mirror ? mirror(source.canvas) : source.canvas, scaled = resize(oriented, scales[spec.sheet]), componentCleanup = removeSmallAlphaComponents(scaled), metrics = shirtMetrics(scaled), bodyX = Math.round(80 - metrics.axisX), bodyY = 287 - (scaled.height - 1), socketY = bodyY + metrics.top; prepared[spec.phase] = { spec, source, scaled, componentCleanup, metrics, bodyX, bodyY, socketY }; }
  const baseSocketY = prepared['01'].socketY, frames = {}, authored = {};
  for (const phase of reference.phaseContract.ids) { const item = prepared[phase], authoredBytes = item.scaled.toBuffer('image/png'), authoredFile = `authored/${direction}-${phase}.png`; writeFileSync(path.join(outputRoot, authoredFile), authoredBytes); authored[phase] = { file: authoredFile, sha256: sha(authoredBytes), width: item.scaled.width, height: item.scaled.height, sourceSheet: item.spec.sheet, sourceCell: item.spec.cell + 1, mirrored: Boolean(item.spec.mirror), scale: scales[item.spec.sheet] };
    const deltaY = item.socketY - baseSocketY, frame = createCanvas(160, 320), context = frame.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(item.scaled, item.bodyX, item.bodyY); const headMatrix = { ...native.matrix, f: native.matrix.f + deltaY }, head = createCanvas(160, 320), headContext = head.getContext('2d'); headContext.imageSmoothingEnabled = false; drawStandardSlot(headContext, loaded.images.identity, metadata.id, headMatrix); const identityMask = direction === 'north' ? removeNorthNativeCollar(head) : { removed: 0, policy: 'full native South head and collar retained' }; clearUnderHead(frame, head); context.drawImage(head, 0, 0); const bytes = frame.toBuffer('image/png'), file = `frames/${direction}-${phase}.png`; writeFileSync(path.join(outputRoot, file), bytes); frames[phase] = { file, sha256: sha(bytes), bodyPlacement: { x: item.bodyX, y: item.bodyY, width: item.scaled.width, height: item.scaled.height }, componentCleanup: item.componentCleanup, socketY: item.socketY, deltaY, headMatrix, identityMask };
  }
  report.directions[direction] = { approvedStanding: reference.directions[direction].approvedStanding, identitySource: reference.directions[direction].identitySource, approvedHeadReference: native, approvedMetrics, scales: scaleEvidence, sourcePins: Object.fromEntries(usedSheets.map(id => [id, { file: sheets[id].file, sha256: sha(sheets[id].bytes), prompt: sheets[id].prompt, promptSha256: sha(readFileSync(path.join(repo, sheets[id].prompt))) }])), authored, frames };
}
const proof = createCanvas(1280, 1328), proofContext = proof.getContext('2d'); proofContext.fillStyle = '#ded8ce'; proofContext.fillRect(0, 0, proof.width, proof.height); proofContext.fillStyle = '#20242a'; proofContext.font = '16px sans-serif'; proofContext.imageSmoothingEnabled = false;
for (const [row, direction] of ['north', 'south'].entries()) for (let index = 0; index < 8; index++) { const phase = reference.phaseContract.ids[index], image = await loadImage(path.join(outputRoot, report.directions[direction].frames[phase].file)), x = (index % 4) * 320, y = row * 664 + Math.floor(index / 4) * 332; proofContext.fillText(`${direction.toUpperCase()} ${phase}`, x + 8, y + 18); proofContext.drawImage(image, 0, 0, 160, 320, x, y + 24, 160, 320); }
const proofBytes = proof.toBuffer('image/png'); writeFileSync(path.join(outputRoot, 'proofs', 'north-south-all8-native.png'), proofBytes); report.proof = { file: 'proofs/north-south-all8-native.png', sha256: sha(proofBytes), width: proof.width, height: proof.height };
const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`); writeFileSync(path.join(outputRoot, 'manifest.json'), reportBytes); console.log(JSON.stringify({ status: 'PASS', manifestSha256: sha(reportBytes), directions: Object.fromEntries(Object.entries(report.directions).map(([key, value]) => [key, { scales: value.scales, frames: value.frames }])) }, null, 2));
