import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = path.resolve(import.meta.dirname, '../../..');
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-navy-walk/west-candidate-v1');
const probeOnly = process.argv.includes('--probe');
mkdirSync(path.join(outputRoot, 'frames'), { recursive: true }); mkdirSync(path.join(outputRoot, 'authored'), { recursive: true }); mkdirSync(path.join(outputRoot, 'proofs'), { recursive: true });
const sha = value => createHash('sha256').update(value).digest('hex'), save = (file, canvas) => { const bytes = canvas.toBuffer('image/png'); writeFileSync(path.join(outputRoot, file), bytes); return { file, sha256: sha(bytes), width: canvas.width, height: canvas.height }; };
const sheets = {
  source1: { file: 'tools/character-mapping/gs019-navy-walk/west-whole-body-v1-source.png', prompt: 'tools/character-mapping/gs019-navy-walk/west-whole-body-v1-prompt.txt', cols: 4, rows: 2 },
  transitions: { file: 'tools/character-mapping/gs019-navy-walk/west-transitions-v1-source.png', prompt: 'tools/character-mapping/gs019-navy-walk/west-transitions-v1-prompt.txt', cols: 2, rows: 2 },
};
const specs = [
  { phase: '01', sheet: 'source1', cell: 0 }, { phase: '02', sheet: 'source1', cell: 2 }, { phase: '03', sheet: 'transitions', cell: 0 }, { phase: '04', sheet: 'transitions', cell: 1 },
  { phase: '05', sheet: 'source1', cell: 4 }, { phase: '06', sheet: 'source1', cell: 6 }, { phase: '07', sheet: 'transitions', cell: 2 }, { phase: '08', sheet: 'transitions', cell: 3 },
];
const standingFile = 'artifacts/character-movement/navy-vest-v1/frames/stand/west.png', eastStandingFile = 'artifacts/character-movement/navy-vest-v1/frames/stand/east.png', headFile = 'tools/character-mapping/layered-pilot/navy-vest-v1/assets/head-west-original-v1.png';
const standingBytes = readFileSync(path.join(repo, standingFile)), eastStandingBytes = readFileSync(path.join(repo, eastStandingFile)), headBytes = readFileSync(path.join(repo, headFile));
const standing = await loadImage(standingBytes), identity = await loadImage(headBytes), standingCanvas = createCanvas(160, 320); standingCanvas.getContext('2d').drawImage(standing, 0, 0);
const isNavy = (r, g, b, a) => a >= 160 && r < 115 && g < 130 && b < 145 && g >= r + 3 && b >= r + 6;
const isSkin = (r, g, b, a) => a >= 80 && r >= 95 && r >= g + 10 && g >= b + 8 && b < 160;
function sourceCell(image, index, cols, rows) { const width = image.width / cols, height = image.height / rows, out = createCanvas(width, height); out.getContext('2d').drawImage(image, (index % cols) * width, Math.floor(index / cols) * height, width, height, 0, 0, width, height); return out; }
function largest(canvas, threshold = 24) {
  const source = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), data = source.data, seen = new Uint8Array(canvas.width * canvas.height); let best = [];
  for (let seed = 0; seed < seen.length; seed++) { if (seen[seed] || data[seed * 4 + 3] < threshold) continue; const stack = [seed], component = []; seen[seed] = 1; while (stack.length) { const n = stack.pop(), x = n % canvas.width, y = Math.floor(n / canvas.width); component.push(n); for (const next of [x ? n - 1 : -1, x + 1 < canvas.width ? n + 1 : -1, y ? n - canvas.width : -1, y + 1 < canvas.height ? n + canvas.width : -1]) if (next >= 0 && !seen[next] && data[next * 4 + 3] >= threshold) { seen[next] = 1; stack.push(next); } } if (component.length > best.length) best = component; }
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1; for (const n of best) { const x = n % canvas.width, y = Math.floor(n / canvas.width); left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
  const out = createCanvas(right - left + 1, bottom - top + 1), context = out.getContext('2d'), pixels = context.createImageData(out.width, out.height);
  for (const n of best) { const x = n % canvas.width, y = Math.floor(n / canvas.width), from = n * 4, to = ((y - top) * out.width + x - left) * 4; for (let channel = 0; channel < 4; channel++) pixels.data[to + channel] = data[from + channel]; }
  context.putImageData(pixels, 0, 0); return { canvas: out, bounds: { x: left, y: top, width: out.width, height: out.height }, pixels: best.length };
}
function navyRows(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data, rows = [];
  for (let y = 0; y < canvas.height; y++) { let count = 0, left = canvas.width, right = -1; for (let x = 0; x < canvas.width; x++) { const i = (y * canvas.width + x) * 4; if (isNavy(data[i], data[i + 1], data[i + 2], data[i + 3])) { count++; left = Math.min(left, x); right = Math.max(right, x); } } rows.push({ y, count, width: right >= left ? right - left + 1 : 0, left, right }); }
  return rows;
}
function vestMetrics(canvas, native = false) {
  const rows = navyRows(canvas), maximum = Math.max(...rows.map(row => row.width)), countThreshold = native ? 10 : Math.max(5, Math.round(maximum * .2)), widthThreshold = native ? 30 : Math.max(8, Math.round(maximum * .55)), broad = rows.filter(row => row.count >= countThreshold && row.width >= widthThreshold), widths = broad.map(row => row.width).sort((a, b) => a - b), centers = broad.map(row => (row.left + row.right) / 2).sort((a, b) => a - b);
  if (!broad.length) throw new Error(`navy vest not found (${canvas.width}x${canvas.height}, max width ${maximum})`);
  return { firstBroad: broad[0].y, lastBroad: broad.at(-1).y, broadHeight: broad.at(-1).y - broad[0].y + 1, medianWidth: widths[Math.floor(widths.length / 2)], axisX: centers[Math.floor(centers.length / 2)], maximumWidth: maximum, countThreshold, widthThreshold };
}
function removeGeneratedHead(full) {
  const metrics = vestMetrics(full), cutY = Math.max(0, metrics.firstBroad - 8), context = full.getContext('2d'), pixels = context.getImageData(0, 0, full.width, full.height);
  for (let y = 0; y < cutY; y++) for (let x = 0; x < full.width; x++) pixels.data[(y * full.width + x) * 4 + 3] = 0;
  context.putImageData(pixels, 0, 0); return { cutY, sourceVest: metrics, policy: 'remove generated head above preserved rounded vest collar boundary; exact native head overlays remaining neck area' };
}
function resize(canvas, scale) { const out = createCanvas(Math.round(canvas.width * scale), Math.round(canvas.height * scale)), context = out.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(canvas, 0, 0, out.width, out.height); return out; }
function neckPatch() {
  const source = standingCanvas.getContext('2d').getImageData(0, 0, 160, 320), renderedHead = createCanvas(160, 320), headContext = renderedHead.getContext('2d'); headContext.imageSmoothingEnabled = false; headContext.drawImage(identity, -4, -23); const headData = headContext.getImageData(0, 0, 160, 320).data, selected = new Uint8Array(160 * 320);
  for (let y = 108; y <= 119; y++) for (let x = 72; x <= 105; x++) { const i = (y * 160 + x) * 4; if (headData[i + 3] < 24 && isSkin(source.data[i], source.data[i + 1], source.data[i + 2], source.data[i + 3])) selected[y * 160 + x] = 1; }
  const expanded = selected.slice(); for (let y = 108; y <= 119; y++) for (let x = 72; x <= 105; x++) { const n = y * 160 + x, i = n * 4; if (selected[n] || source.data[i + 3] < 80 || source.data[i] > 85 || source.data[i + 1] > 85 || source.data[i + 2] > 85) continue; let near = false; for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) if (selected[(y + dy) * 160 + x + dx]) { near = true; break; } if (near) expanded[n] = 1; }
  const canvas = createCanvas(160, 320), pixels = canvas.getContext('2d').createImageData(160, 320); let pixelCount = 0, skinPixels = 0; for (let n = 0; n < expanded.length; n++) if (expanded[n]) { const i = n * 4; for (let channel = 0; channel < 4; channel++) pixels.data[i + channel] = source.data[i + channel]; pixelCount++; if (selected[n]) skinPixels++; } canvas.getContext('2d').putImageData(pixels, 0, 0); return { canvas, pixelCount, skinPixels };
}
function clearUnder(frame, overlay, deltaY = 0) { const context = frame.getContext('2d'), target = context.getImageData(0, 0, 160, 320), source = overlay.getContext('2d').getImageData(0, 0, 160, 320).data; for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) { const sy = y - deltaY; if (sy >= 0 && sy < 320 && source[(sy * 160 + x) * 4 + 3]) target.data[(y * 160 + x) * 4 + 3] = 0; } context.putImageData(target, 0, 0); }
function removeSmallComponents(canvas, minimumSize = 4) { const context = canvas.getContext('2d'), pixels = context.getImageData(0, 0, canvas.width, canvas.height), data = pixels.data, hit = new Uint8Array(canvas.width * canvas.height), seen = new Uint8Array(hit.length); for (let n = 0; n < hit.length; n++) if (data[n * 4 + 3] >= 24) hit[n] = 1; let removedComponents = 0, removedPixels = 0; for (let seed = 0; seed < hit.length; seed++) { if (!hit[seed] || seen[seed]) continue; const stack = [seed], component = []; seen[seed] = 1; while (stack.length) { const n = stack.pop(), x = n % canvas.width, y = Math.floor(n / canvas.width); component.push(n); for (const next of [x ? n - 1 : -1, x + 1 < canvas.width ? n + 1 : -1, y ? n - canvas.width : -1, y + 1 < canvas.height ? n + canvas.width : -1]) if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); } } if (component.length >= minimumSize) continue; removedComponents++; removedPixels += component.length; for (const n of component) data[n * 4 + 3] = 0; } context.putImageData(pixels, 0, 0); return { minimumSize, removedComponents, removedPixels }; }

const nativeVest = vestMetrics(standingCanvas, true), library = {}, loadedSheets = {};
const normalizeScript = `from PIL import Image
from collections import deque
import sys
im=Image.open(sys.argv[1]).convert('RGBA'); cols=int(sys.argv[3]); rows=int(sys.argv[4]); w,h=im.size; cw=w//cols; ch=h//rows; p=im.load()
for row in range(rows):
 for col in range(cols):
  x0=col*cw; y0=row*ch; exterior=set(); q=deque()
  for x in range(x0,x0+cw):
   for y in (y0,y0+ch-1):
    if p[x,y][3]<24 and (x,y) not in exterior: exterior.add((x,y)); q.append((x,y))
  for y in range(y0,y0+ch):
   for x in (x0,x0+cw-1):
    if p[x,y][3]<24 and (x,y) not in exterior: exterior.add((x,y)); q.append((x,y))
  while q:
   x,y=q.popleft()
   for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
    if x0<=nx<x0+cw and y0<=ny<y0+ch and p[nx,ny][3]<24 and (nx,ny) not in exterior: exterior.add((nx,ny)); q.append((nx,ny))
  for y in range(y0,y0+ch):
   for x in range(x0,x0+cw):
    r,g,b,a=p[x,y]
    if a<160 and (x,y) not in exterior and r+g+b>0: p[x,y]=(r,g,b,255)
im.save(sys.argv[2])`;
for (const [id, config] of Object.entries(sheets)) { const bytes = readFileSync(path.join(repo, config.file)), normalizedFile = path.join(outputRoot, `${id}-normalized.png`); execFileSync('python', ['-c', normalizeScript, path.join(repo, config.file), normalizedFile, String(config.cols), String(config.rows)]); const normalizedBytes = readFileSync(normalizedFile), image = await loadImage(normalizedBytes); loadedSheets[id] = { ...config, bytes, image, normalizedFile, normalizedSha256: sha(normalizedBytes) }; library[id] = []; for (let cell = 0; cell < config.cols * config.rows; cell++) { const raw = sourceCell(image, cell, config.cols, config.rows), full = largest(raw), headRemoval = removeGeneratedHead(full.canvas), body = largest(full.canvas), metrics = vestMetrics(body.canvas); library[id].push({ cell, ...body, headRemoval, metrics }); } }
const scales = {}, scaleEvidence = {};
for (const id of Object.keys(sheets)) { const heights = library[id].map(item => item.canvas.height).sort((a, b) => a - b), medianHeight = heights[Math.floor(heights.length / 2)], targetBodyHeight = id === 'transitions' ? 182 : 179; scales[id] = targetBodyHeight / medianHeight; scaleEvidence[id] = { uniformScale: scales[id], sourceMedianBodyHeight: medianHeight, targetBodyHeight, rationale: 'native West collar-to-floor fit; transitions increase 1.7% to hold collar baseline within three pixels without independent head correction', nativeVest }; }
const patch = neckPatch(), prepared = {};
for (const spec of specs) { const source = library[spec.sheet][spec.cell], scaled = resize(source.canvas, scales[spec.sheet]), metrics = vestMetrics(scaled), bodyX = Math.round(nativeVest.axisX - metrics.axisX), bodyY = 287 - (scaled.height - 1), socketY = bodyY + metrics.firstBroad; prepared[spec.phase] = { spec, source, scaled, metrics, bodyX, bodyY, socketY }; }
const baseSocketY = prepared['01'].socketY, frameIds = probeOnly ? ['01', '05'] : specs.map(spec => spec.phase), frames = {}, eastFrames = {}, authored = {};
for (const phase of frameIds) { const item = prepared[phase], authoredFile = `authored/west-${phase}.png`; authored[phase] = save(authoredFile, item.scaled); const deltaY = item.socketY - baseSocketY, headTranslation = { e: -4, f: -23 + deltaY }, frame = createCanvas(160, 320), context = frame.getContext('2d'); context.imageSmoothingEnabled = false; context.drawImage(item.scaled, item.bodyX, item.bodyY); const head = createCanvas(160, 320), headContext = head.getContext('2d'); headContext.imageSmoothingEnabled = false; headContext.drawImage(identity, headTranslation.e, headTranslation.f); clearUnder(frame, patch.canvas, deltaY); clearUnder(frame, head); context.drawImage(patch.canvas, 0, deltaY); context.drawImage(head, 0, 0); const componentCleanup = removeSmallComponents(frame); frames[phase] = { ...save(`frames/west-${phase}.png`, frame), sourceSheet: item.spec.sheet, sourceCell: item.spec.cell + 1, sourceBounds: item.source.bounds, headRemoval: item.source.headRemoval, uniformScale: scales[item.spec.sheet], bodyPlacement: { x: item.bodyX, y: item.bodyY, width: item.scaled.width, height: item.scaled.height }, vestMetrics: item.metrics, socketY: item.socketY, deltaY, headTranslation, componentCleanup }; const east = createCanvas(160, 320), eastContext = east.getContext('2d'); eastContext.imageSmoothingEnabled = false; eastContext.translate(160, 0); eastContext.scale(-1, 1); eastContext.drawImage(frame, 0, 0); eastFrames[phase] = { ...save(`frames/east-${phase}.png`, east), exactHorizontalMirrorOf: frames[phase].file }; }
function proof(scale, suffix) { const cellWidth = 160 * scale, cellHeight = 320 * scale, canvas = createCanvas(cellWidth * 3, cellHeight + 24), context = canvas.getContext('2d'); context.fillStyle = '#ded8ce'; context.fillRect(0, 0, canvas.width, canvas.height); context.fillStyle = '#20242a'; context.font = '14px sans-serif'; context.imageSmoothingEnabled = false; for (const [column, [label, image]] of [['Standing', standing], ['Phase 01', null], ['Phase 05', null]].entries()) { context.fillText(label, column * cellWidth + 6, 17); if (image) context.drawImage(image, 0, 0, 160, 320, column * cellWidth, 24, cellWidth, cellHeight); } return Promise.all(['01', '05'].map(async (phase, index) => { const image = await loadImage(readFileSync(path.join(outputRoot, frames[phase].file))); context.drawImage(image, 0, 0, 160, 320, (index + 1) * cellWidth, 24, cellWidth, cellHeight); })).then(() => save(`proofs/west-early-01-05-${suffix}.png`, canvas)); }
const proofs = { native1x: await proof(1, '1x'), enlarged2x: await proof(2, '2x') };
if (!probeOnly) { const all = createCanvas(640, 1376), context = all.getContext('2d'); context.fillStyle = '#ded8ce'; context.fillRect(0, 0, all.width, all.height); context.fillStyle = '#20242a'; context.font = '14px sans-serif'; context.imageSmoothingEnabled = false; for (const [directionIndex, directionFrames] of [frames, eastFrames].entries()) for (const [index, phase] of frameIds.entries()) { const image = await loadImage(readFileSync(path.join(outputRoot, directionFrames[phase].file))), column = index % 4, row = directionIndex * 2 + Math.floor(index / 4), x = column * 160, y = row * 344; context.fillText(`${directionIndex ? 'EAST' : 'WEST'} ${phase}`, x + 5, y + 17); context.drawImage(image, x, y + 24); } proofs.all8 = save('proofs/west-east-all8-native.png', all); }
const manifest = { schemaVersion: 'gs019-navy-walk/west-candidate-v1', status: probeOnly ? 'probe-needs-parent-review' : 'prototype-needs-owner-review', characterId: 'patient.adult.035', canvas: { width: 160, height: 320, axisX: 80, floorY: 287 }, phaseContract: { ids: specs.map(spec => spec.phase), cadenceMs: 180 }, pins: { standing: { file: standingFile, sha256: sha(standingBytes) }, eastStanding: { file: eastStandingFile, sha256: sha(eastStandingBytes) }, identityHead: { file: headFile, sha256: sha(headBytes) }, sources: Object.fromEntries(Object.entries(loadedSheets).map(([id, sheet]) => [id, { file: sheet.file, sha256: sha(sheet.bytes), normalizedFile: path.relative(repo, sheet.normalizedFile).replaceAll('\\', '/'), normalizedSha256: sheet.normalizedSha256, normalization: 'RGBA conversion plus original-RGB alpha restoration only for enclosed low-alpha interior pixels', prompt: sheet.prompt, promptSha256: sha(readFileSync(path.join(repo, sheet.prompt))) }])) }, nativeReference: { headTranslation: { e: -4, f: -23 }, vest: nativeVest }, scaleEvidence, neckPatch: { source: standingFile, pixelCount: patch.pixelCount, skinPixels: patch.skinPixels, policy: patch.pixelCount === 0 ? 'no additional patch: the exact native head already contains the approved neck pixels' : 'exact approved-standing skin absent from the isolated head plus immediate dark outline; translated only by torso socket delta' }, authored, frames, eastFrames, proofs };
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`); writeFileSync(path.join(outputRoot, probeOnly ? 'probe-manifest.json' : 'manifest.json'), manifestBytes); console.log(JSON.stringify({ status: 'PASS', mode: probeOnly ? 'probe' : 'all8', manifestSha256: sha(manifestBytes), nativeVest, scales: scaleEvidence, neckPatch: manifest.neckPatch, measurements: Object.fromEntries(Object.entries(frames).map(([phase, frame]) => [phase, { bodyPlacement: frame.bodyPlacement, vestMetrics: frame.vestMetrics, socketY: frame.socketY, deltaY: frame.deltaY, headTranslation: frame.headTranslation }])), proofs }, null, 2));
