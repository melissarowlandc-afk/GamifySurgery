import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-statics/gs-018-v1');
const sourceRoot = 'generated_images/patient-character-sources-v1';
const peopleRoot = 'Photos for Codex 2/Patients or Staff or Other Characters';
const foundationRoot = 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-foundation-v2';
const foundationManifestPath = `${foundationRoot}/manifest.json`;
const foundationPoseRoot = 'Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/production-poses-v2';
const foundationPoseManifestPath = `${foundationPoseRoot}/manifest.json`;
const views = ['south', 'east', 'west', 'north'];
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const canvasSpec = { width: 160, height: 320, axisX: 80, floorY: 287 };
const id = (number) => `patient.adult.${String(number).padStart(3, '0')}`;
const founderId = (number) => `founder.${String(number).padStart(2, '0')}`;
const file = (path) => readFileSync(resolve(repo, path));
const sourceHash = (path) => sha(file(path));
const headRangeOverrides = {
  'patient.adult.004': { stand: { east: [19, 112] } },
  'patient.adult.007': { stand: { west: [11, 102] }, sit: { east: [20, 113], west: [20, 113], north: [20, 114] } },
  'patient.adult.009': { stand: { east: [10, 103], west: [14, 104] }, sit: { east: [22, 114], west: [22, 114], north: [20, 113] } },
};
const authoredSeatContactSourceY = {
  'patient.adult.001': { south: 533, east: 552, west: 552, north: 554 },
  'patient.adult.002': { south: 588, east: 582, west: 582, north: 588 },
  'patient.adult.003': { south: 590, east: 598, west: 598, north: 598 },
  'patient.adult.004': { south: 505, east: 510, west: 510, north: 505 },
  'patient.adult.005': { south: 600, east: 610, west: 610, north: 610 },
  'patient.adult.006': { south: 600, east: 621, west: 621, north: 622 },
  'patient.adult.007': { south: 590, east: 598, west: 598, north: 592 },
  'patient.adult.008': { south: 650, east: 650, west: 650, north: 650 },
  'patient.adult.009': { south: 490, east: 518, west: 518, north: 500 },
  'patient.adult.010': { south: 554, east: 568, west: 568, north: 568 },
  'patient.adult.011': { south: 590, east: 592, west: 592, north: 590 },
  'patient.adult.012': { south: 500, east: 538, west: 538, north: 540 },
  'patient.adult.013': { south: 600, east: 625, west: 625, north: 620 },
  'patient.adult.014': { south: 590, east: 620, west: 620, north: 620 },
  'patient.adult.015': { south: 650, east: 680, west: 680, north: 675 },
  'patient.adult.016': { south: 600, east: 630, west: 630, north: 633 },
  'patient.adult.017': { south: 500, east: 520, west: 520, north: 525 },
  'patient.adult.018': { south: 590, east: 610, west: 610, north: 612 },
  'patient.adult.019': { south: 590, east: 610, west: 610, north: 618 },
  'patient.adult.020': { south: 590, east: 610, west: 610, north: 620 },
  'patient.adult.021': { south: 676, east: 697, west: 697, north: 693 },
  'patient.adult.022': { south: 650, east: 650, west: 650, north: 650 },
  'patient.adult.023': { south: 652, east: 660, west: 660, north: 659 },
  'patient.adult.024': { south: 650, east: 650, west: 650, north: 650 },
  'patient.adult.025': { south: 697, east: 693, west: 693, north: 693 },
  'patient.adult.026': { south: 656, east: 659, west: 659, north: 659 },
  'patient.adult.027': { south: 626, east: 633, west: 633, north: 633 },
  'patient.adult.028': { south: 607, east: 607, west: 607, north: 606 },
  'patient.adult.029': { south: 676, east: 683, west: 683, north: 679 },
  'patient.adult.030': { south: 697, east: 697, west: 697, north: 697 },
  'patient.adult.031': { south: 665, east: 665, west: 664, north: 667 },
  'patient.adult.033': { south: 650, east: 650, west: 650, north: 650 },
  'patient.adult.034': { south: 684, east: 679, west: 679, north: 679 },
  'patient.adult.036': { south: 536, east: 539, west: 539, north: 536 },
  'patient.adult.037': { south: 539, east: 542, west: 542, north: 542 },
  'patient.adult.038': { south: 636, east: 636, west: 636, north: 639 },
  'patient.adult.040': { south: 546, east: 551, west: 551, north: 551 },
  'patient.adult.041': { south: 590, east: 591, west: 591, north: 589 },
  'patient.adult.042': { south: 554, east: 550, west: 550, north: 555 },
  'patient.adult.044': { south: 520, east: 516, west: 516, north: 516 },
  'patient.adult.045': { south: 521, east: 1121, west: 521, north: 521 },
  'patient.adult.047': { south: 501, east: 501, west: 501, north: 504 },
  'patient.adult.048': { south: 534, east: 536, west: 536, north: 538 },
  'patient.adult.049': { south: 527, east: 525, west: 525, north: 527 },
  'patient.adult.050': { south: 532, east: 532, west: 532, north: 532 },
};
const authoredFounderSeatContactSourceY = {
  'founder.01': { south: 547, east: 552, west: 552, north: 552 }, 'founder.02': { south: 551, east: 554, west: 554, north: 554 },
  'founder.03': { south: 530, east: 529, west: 529, north: 529 }, 'founder.04': { south: 522, east: 517, west: 517, north: 522 },
  'founder.05': { south: 533, east: 533, west: 533, north: 533 }, 'founder.06': { south: 528, east: 527, west: 526, north: 528 },
  'founder.07': { south: 558, east: 558, west: 558, north: 559 }, 'founder.08': { south: 544, east: 543, west: 543, north: 543 },
  'founder.09': { south: 567, east: 567, west: 567, north: 567 }, 'founder.10': { south: 534, east: 535, west: 536, north: 535 },
  'founder.11': { south: 529, east: 530, west: 530, north: 526 }, 'founder.12': { south: 519, east: 516, west: 516, north: 520 },
  'founder.13': { south: 542, east: 537, west: 538, north: 537 }, 'founder.14': { south: 529, east: 529, west: 529, north: 529 },
  'founder.15': { south: 546, east: 540, west: 540, north: 542 }, 'founder.16': { south: 531, east: 528, west: 529, north: 528 },
  'founder.17': { south: 537, east: 537, west: 537, north: 537 }, 'founder.18': { south: 519, east: 524, west: 524, north: 511 },
  'founder.19': { south: 512, east: 509, west: 509, north: 511 }, 'founder.20': { south: 632, east: 632, west: 632, north: 635 },
  'founder.21': { south: 627, east: 632, west: 632, north: 627 }, 'founder.22': { south: 620, east: 627, west: 626, north: 623 },
  'founder.23': { south: 656, east: 652, west: 651, north: 654 }, 'founder.24': { south: 745, east: 745, west: 745, north: 741 },
  'founder.25': { south: 619, east: 628, west: 628, north: 620 }, 'founder.26': { south: 526, east: 529, west: 529, north: 530 },
  'founder.27': { south: 571, east: 570, west: 570, north: 568 }, 'founder.28': { south: 751, east: 753, west: 754, north: 754 },
  'founder.29': { south: 733, east: 733, west: 733, north: 733 }, 'founder.30': { south: 569, east: 578, west: 578, north: 570 },
};
const authoredFinalSeatContactSourceY = {
  'retained.reference.038fac25': { south: 625, east: 630, west: 630, north: 630 },
  'retained.reference.54c78cba': { south: 595, east: 598, west: 598, north: 598 },
  'retained.reference.6ee80949': { south: 629, east: 624, west: 624, north: 625 },
  'mixed-20260910-patient-01': { south: 526, east: 525, west: 525, north: 540 },
  'mixed-20260910-patient-02': { south: 618, east: 618, west: 618, north: 618 },
  'mixed-20260910-receptionist-01': { south: 625, east: 625, west: 625, north: 623 },
  'mixed-20260910-nurse-01': { south: 681, east: 681, west: 681, north: 681 },
};
const auditedFounderClipboardCrops = {
  'founder.01': [473, 650, 202, 314], 'founder.02': [474, 646, 202, 318], 'founder.03': [473, 645, 202, 319],
  'founder.04': [473, 642, 202, 322], 'founder.05': [473, 637, 202, 327], 'founder.06': [473, 650, 202, 314],
  'founder.07': [473, 652, 202, 313], 'founder.08': [473, 646, 202, 319], 'founder.09': [473, 639, 202, 325],
  'founder.10': [473, 645, 202, 320], 'founder.11': [453, 665, 191, 345], 'founder.12': [453, 671, 191, 339],
  'founder.13': [453, 663, 191, 347], 'founder.14': [453, 668, 191, 342], 'founder.15': [453, 662, 191, 348],
  'founder.16': [453, 661, 191, 349], 'founder.17': [453, 665, 191, 345], 'founder.18': [453, 666, 191, 344],
  'founder.19': [453, 667, 191, 343], 'founder.20': [453, 661, 191, 349], 'founder.21': [488, 623, 209, 311],
  'founder.22': [488, 634, 209, 300], 'founder.23': [488, 620, 209, 314], 'founder.24': [488, 616, 209, 318],
  'founder.25': [488, 619, 209, 315], 'founder.27': [488, 602, 209, 332], 'founder.28': [488, 626, 209, 308],
  'founder.29': [488, 614, 209, 320],
};
const batchOutputDirectory = (identity) => {
  if (identity.startsWith('founder.')) return 'founders-01-30';
  if (identity.startsWith('retained.') || identity.startsWith('mixed-')) return 'final-seven-baselines';
  const number = Number(identity.split('.').at(-1));
  if (number <= 10) return 'patients-001-010';
  if (number <= 20) return 'patients-011-020';
  return 'patients-021-050';
};

function bounds(canvas, threshold = 20) {
  const { width, height } = canvas; const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] >= threshold) {
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  return right < 0 ? null : { x: left, y: top, width: right - left + 1, height: bottom - top + 1, right, bottom };
}

function bandBounds(canvas, top, bottom, threshold = 20) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width, first = canvas.height, right = -1, last = -1;
  for (let y = Math.max(0, top); y <= Math.min(canvas.height - 1, bottom); y++) for (let x = 0; x < canvas.width; x++) if (data[(y * canvas.width + x) * 4 + 3] >= threshold) {
    left = Math.min(left, x); first = Math.min(first, y); right = Math.max(right, x); last = Math.max(last, y);
  }
  return right < 0 ? null : { x: left, y: first, width: right - left + 1, height: last - first + 1, right, bottom: last };
}

function measureHeadBounds(canvas, identity, pose, view, visible) {
  const override = headRangeOverrides[identity]?.[pose]?.[view];
  let crownY = override?.[0] ?? visible.y, chinY = override?.[1] ?? null;
  if (chinY == null) {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; const spans = [];
    for (let y = 0; y < canvas.height; y++) {
      let left = canvas.width, right = -1; for (let x = 0; x < canvas.width; x++) if (data[(y * canvas.width + x) * 4 + 3] >= 20) { left = Math.min(left, x); right = Math.max(right, x); }
      spans[y] = right < 0 ? 0 : right - left + 1;
    }
    let best = null;
    for (let y = Math.round(visible.y + visible.height * 0.2); y <= Math.round(visible.y + visible.height * 0.42); y++) {
      const next = spans.slice(y + 2, y + 10).reduce((sum, width) => sum + width, 0) / 8;
      const previous = spans.slice(y - 5, y + 1).reduce((sum, width) => sum + width, 0) / 6;
      const score = next - spans[y] + (previous - spans[y]) * 0.25;
      if (!best || score > best.score) best = { y, score };
    }
    chinY = best.y;
  }
  const measured = bandBounds(canvas, crownY, chinY);
  return { ...measured, crownY, chinY, method: override ? 'authored crown/chin proof measurement override' : 'crown plus neck/shoulder silhouette inflection', acceptance: 'measurement only; visual QA decides proportion acceptance' };
}

function clearExteriorNeutral(canvas, minimumChannel = 235, maximumSpread = 12) {
  const context = canvas.getContext('2d'); const pixels = context.getImageData(0, 0, canvas.width, canvas.height); const { data } = pixels;
  const seen = new Uint8Array(canvas.width * canvas.height); const queue = [];
  const neutral = (p) => { const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2]; return Math.min(r, g, b) >= minimumChannel && Math.max(r, g, b) - Math.min(r, g, b) <= maximumSpread; };
  const add = (p) => { if (!seen[p] && neutral(p)) { seen[p] = 1; queue.push(p); } };
  for (let x = 0; x < canvas.width; x++) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y++) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const point = queue[cursor], x = point % canvas.width, y = Math.floor(point / canvas.width);
    for (const next of [point - 1, point + 1, point - canvas.width, point + canvas.width]) {
      if (next < 0 || next >= seen.length || seen[next]) continue;
      if ((next === point - 1 || next === point + 1) && Math.floor(next / canvas.width) !== y) continue;
      if (neutral(next)) { seen[next] = 1; queue.push(next); }
    }
  }
  for (const point of queue) data[point * 4 + 3] = 0;
  context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(pixels, 0, 0);
  return queue.length;
}

function largestComponent(canvas) {
  const context = canvas.getContext('2d'); const pixels = context.getImageData(0, 0, canvas.width, canvas.height); const { data } = pixels;
  const seen = new Uint8Array(canvas.width * canvas.height); let best = [];
  for (let start = 0; start < seen.length; start++) {
    if (seen[start] || data[start * 4 + 3] < 20) continue;
    const group = [start]; seen[start] = 1;
    for (let cursor = 0; cursor < group.length; cursor++) {
      const point = group[cursor], x = point % canvas.width, y = Math.floor(point / canvas.width);
      for (const next of [point - 1, point + 1, point - canvas.width, point + canvas.width]) {
        if (next < 0 || next >= seen.length || seen[next] || data[next * 4 + 3] < 20) continue;
        if ((next === point - 1 || next === point + 1) && Math.floor(next / canvas.width) !== y) continue;
        seen[next] = 1; group.push(next);
      }
    }
    if (group.length > best.length) best = group;
  }
  const keep = new Uint8Array(seen.length); for (const point of best) keep[point] = 1;
  for (let point = 0; point < keep.length; point++) if (!keep[point]) data[point * 4 + 3] = 0;
  context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(pixels, 0, 0);
  return best.length;
}

function trimExteriorNeutralFringe(canvas, passes = 4) {
  const context = canvas.getContext('2d'); let removed = 0;
  for (let pass = 0; pass < passes; pass++) {
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height); const { data } = pixels; const clear = [];
    for (let y = 1; y < canvas.height - 1; y++) for (let x = 1; x < canvas.width - 1; x++) {
      const p = y * canvas.width + x, i = p * 4; if (data[i + 3] < 20) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (Math.min(r, g, b) < 80 || Math.max(r, g, b) - Math.min(r, g, b) > 110) continue;
      let exteriorNeighbor = false;
      for (let yy = y - 1; yy <= y + 1 && !exteriorNeighbor; yy++) for (let xx = x - 1; xx <= x + 1; xx++) if (data[(yy * canvas.width + xx) * 4 + 3] < 20) { exteriorNeighbor = true; break; }
      if (exteriorNeighbor) clear.push(p);
    }
    if (!clear.length) break;
    for (const p of clear) data[p * 4 + 3] = 0;
    removed += clear.length; context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(pixels, 0, 0);
  }
  return removed;
}

function cropCell(image, column, row, exteriorNeutralMinimum = 235) {
  const left = Math.round(column * image.width / 6), right = Math.round((column + 1) * image.width / 6);
  const top = row === 0 ? 20 : Math.round(row * image.height / 3), bottom = row === 0 ? Math.min(370, image.height) : Math.round((row + 1) * image.height / 3);
  const canvas = createCanvas(right - left, bottom - top); const context = canvas.getContext('2d');
  context.drawImage(image, left, top, right - left, bottom - top, 0, 0, canvas.width, canvas.height);
  const cleared = clearExteriorNeutral(canvas, exteriorNeutralMinimum); let pixels = largestComponent(canvas); const fringePixelsCleared = trimExteriorNeutralFringe(canvas); pixels = largestComponent(canvas);
  return { canvas, crop: { x: left, y: top, width: canvas.width, height: canvas.height }, cleared, fringePixelsCleared, pixels };
}

function cropFounderCell(image, column, row) {
  const left = Math.round(column * image.width / 7) + 14, right = Math.round((column + 1) * image.width / 7) - 14;
  const top = Math.round(row * image.height / 3) + 14, bottom = Math.round((row + 1) * image.height / 3) - 14;
  const canvas = createCanvas(right - left, bottom - top), context = canvas.getContext('2d');
  context.drawImage(image, left, top, right - left, bottom - top, 0, 0, canvas.width, canvas.height);
  let cleared = clearExteriorNeutral(canvas, 185, 35); let pixels = largestComponent(canvas);
  const fringePixelsCleared = trimExteriorNeutralFringe(canvas, 2); pixels = largestComponent(canvas);
  const contextAfter = canvas.getContext('2d'), imageData = contextAfter.getImageData(0, 0, canvas.width, canvas.height), alpha = imageData.data;
  let groundRow = -1, widest = 0;
  for (let y = Math.floor(canvas.height * 0.72); y < canvas.height; y++) {
    let count = 0; for (let x = 0; x < canvas.width; x++) if (alpha[(y * canvas.width + x) * 4 + 3] >= 20) count++;
    if (count > widest) { widest = count; groundRow = y; }
  }
  let groundLinePixelsCleared = 0;
  if (groundRow >= 0) for (let y = Math.max(0, groundRow - 2); y <= Math.min(canvas.height - 1, groundRow + 2); y++) for (let x = 0; x < canvas.width; x++) {
    const offset = (y * canvas.width + x) * 4; if (alpha[offset + 3] < 20) continue;
    const r = alpha[offset], g = alpha[offset + 1], b = alpha[offset + 2]; if (Math.max(r, g, b) - Math.min(r, g, b) > 100) continue;
    let supportedByBody = false;
    for (let yy = Math.max(0, groundRow - 14); yy <= groundRow - 4; yy++) if (alpha[(yy * canvas.width + x) * 4 + 3] >= 20) { supportedByBody = true; break; }
    if (!supportedByBody) { alpha[offset + 3] = 0; groundLinePixelsCleared++; }
  }
  contextAfter.clearRect(0, 0, canvas.width, canvas.height); contextAfter.putImageData(imageData, 0, 0);
  cleared += clearExteriorNeutral(canvas, 185, 35); pixels = largestComponent(canvas);
  return { canvas, crop: { x: left, y: top, width: canvas.width, height: canvas.height }, cleared, fringePixelsCleared, groundLinePixelsCleared, pixels };
}

function cropFounderClipboardCell(image, column, identity) {
  const audited = auditedFounderClipboardCrops[identity];
  if (!audited) return cropFounderCell(image, column, 2);
  const [left, top, width, height] = audited, right = left + width, bottom = top + height;
  const rowBoundary = Math.round(2 * image.height / 3);
  const canvas = createCanvas(right - left, bottom - top), context = canvas.getContext('2d');
  context.drawImage(image, left, top, right - left, bottom - top, 0, 0, canvas.width, canvas.height);
  const gridY = rowBoundary - top, imageData = context.getImageData(0, 0, canvas.width, canvas.height), data = imageData.data;
  for (let y = Math.max(0, gridY - 4); y <= Math.min(canvas.height - 1, gridY + 4); y++) {
    for (const direction of [1, -1]) {
      for (let x = direction === 1 ? 0 : canvas.width - 1; x >= 0 && x < canvas.width; x += direction) {
        const offset = (y * canvas.width + x) * 4, r = data[offset], g = data[offset + 1], b = data[offset + 2];
        const lineLike = data[offset + 3] >= 20 && Math.max(r, g, b) < 125 && Math.max(r, g, b) - Math.min(r, g, b) < 32;
        if (!lineLike) break;
        data[offset + 3] = 0;
      }
    }
  }
  context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(imageData, 0, 0);
  let cleared = clearExteriorNeutral(canvas, 185, 35); let pixels = largestComponent(canvas);
  const fringePixelsCleared = trimExteriorNeutralFringe(canvas, 2); pixels = largestComponent(canvas);
  const after = context.getImageData(0, 0, canvas.width, canvas.height), alpha = after.data;
  let groundRow = -1, widest = 0;
  for (let y = Math.floor(canvas.height * 0.65); y < canvas.height; y++) {
    let count = 0; for (let x = 0; x < canvas.width; x++) if (alpha[(y * canvas.width + x) * 4 + 3] >= 20) count++;
    if (count > widest) { widest = count; groundRow = y; }
  }
  let groundLinePixelsCleared = 0;
  if (groundRow >= 0) for (let y = Math.max(0, groundRow - 2); y <= Math.min(canvas.height - 1, groundRow + 2); y++) for (let x = 0; x < canvas.width; x++) {
    const offset = (y * canvas.width + x) * 4; if (alpha[offset + 3] < 20) continue;
    const r = alpha[offset], g = alpha[offset + 1], b = alpha[offset + 2]; if (Math.max(r, g, b) - Math.min(r, g, b) > 100) continue;
    let supportedByBody = false;
    for (let yy = Math.max(0, groundRow - 14); yy <= groundRow - 4; yy++) if (alpha[(yy * canvas.width + x) * 4 + 3] >= 20) { supportedByBody = true; break; }
    if (!supportedByBody) { alpha[offset + 3] = 0; groundLinePixelsCleared++; }
  }
  context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(after, 0, 0);
  cleared += clearExteriorNeutral(canvas, 185, 35); pixels = largestComponent(canvas);
  return { canvas, crop: { x: left, y: top, width: canvas.width, height: canvas.height }, cleared, fringePixelsCleared, groundLinePixelsCleared, pixels };
}

function clearNeutralConnectedRegion(canvas, region, seedX, seedYs = [250], minimumChannel = 140, maximumSpread = 100) {
  const context = canvas.getContext('2d'), pixels = context.getImageData(0, 0, canvas.width, canvas.height), { data } = pixels;
  const width = canvas.width, visited = new Uint8Array(width * canvas.height), queue = [];
  for (let x = region.left; x <= region.right; x++) queue.push([x, region.bottom]);
  for (const seedY of seedYs) queue.push([seedX, seedY]);
  let cleared = 0;
  while (queue.length) {
    const [x, y] = queue.pop(); if (x < region.left || x > region.right || y < region.top || y > region.bottom) continue;
    const p = y * width + x; if (visited[p]) continue; visited[p] = 1;
    const i = p * 4, alpha = data[i + 3], r = data[i], g = data[i + 1], b = data[i + 2];
    const traversable = alpha < 20 || (Math.min(r, g, b) >= minimumChannel && Math.max(r, g, b) - Math.min(r, g, b) <= maximumSpread);
    if (!traversable) continue;
    if (alpha >= 20) { data[i + 3] = 0; cleared++; }
    queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }
  context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(pixels, 0, 0); return cleared;
}

function clearKnownPaintedCheckerPixels(canvas, identity, pose, view, gapSeedX = 80) {
  if (!['stand', 'clipboard'].includes(pose)) return 0;
  const founderNumber = identity.startsWith('founder.') ? Number(identity.split('.').at(-1)) : null;
  const regions = identity === 'patient.adult.011' && ['south', 'north'].includes(view)
    ? [{ left: 0, top: 70, right: 159, bottom: 110 }]
    : identity === 'patient.adult.017' && ['south', 'north'].includes(view)
      ? [{ left: 72, top: 200, right: 88, bottom: 245 }]
      : identity === 'patient.adult.018' && ['south', 'north'].includes(view)
        ? [{ left: 70, top: 195, right: 92, bottom: 280 }]
        : [];
  const clearExactPaperResidue = founderNumber != null && founderNumber >= 26;
  const patient45SouthCaneGap = identity === 'patient.adult.045' && pose === 'stand' && view === 'south';
  if (!regions.length && !clearExactPaperResidue && founderNumber == null && !patient45SouthCaneGap) return 0;
  const context = canvas.getContext('2d'), pixels = context.getImageData(0, 0, canvas.width, canvas.height); let cleared = 0;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    const inRegion = regions.some((region) => x >= region.left && x <= region.right && y >= region.top && y <= region.bottom);
    const offset = (y * canvas.width + x) * 4, r = pixels.data[offset], g = pixels.data[offset + 1], b = pixels.data[offset + 2];
    const exactPaperResidue = clearExactPaperResidue && (r - 244) ** 2 + (g - 240) ** 2 + (b - 232) ** 2 <= 14 ** 2;
    let unsupportedGroundLine = false;
    if (founderNumber != null && y >= 280 && y <= 287 && Math.min(r, g, b) >= 140 && Math.max(r, g, b) - Math.min(r, g, b) <= 100) {
      unsupportedGroundLine = true;
      for (let yy = 260; yy <= 277; yy++) if (pixels.data[(yy * canvas.width + x) * 4 + 3] >= 20) { unsupportedGroundLine = false; break; }
    }
    if (!inRegion && !exactPaperResidue && !unsupportedGroundLine) continue;
    const knownLegGap = identity === 'patient.adult.018' && view === 'south' && x >= 79 && x <= 84 && y >= 205 && y <= 252;
    const minimumChannel = identity === 'patient.adult.011' ? 150 : identity === 'patient.adult.018' ? 180 : founderNumber != null ? 185 : 220;
    const maximumSpread = identity === 'patient.adult.011' ? 35 : founderNumber != null ? 35 : 14;
    if (pixels.data[offset + 3] >= 20 && (unsupportedGroundLine || exactPaperResidue || knownLegGap || (inRegion && Math.min(r, g, b) >= minimumChannel && Math.max(r, g, b) - Math.min(r, g, b) <= maximumSpread))) { pixels.data[offset + 3] = 0; cleared++; }
  }
  context.clearRect(0, 0, canvas.width, canvas.height); context.putImageData(pixels, 0, 0);
  if (founderNumber != null && ['south', 'north'].includes(view)) cleared += clearNeutralConnectedRegion(canvas, { left: Math.max(0, gapSeedX - 12), top: 198, right: Math.min(canvas.width - 1, gapSeedX + 12), bottom: 286 }, gapSeedX, ['founder.22', 'founder.24'].includes(identity) ? [250, 275] : [250]);
  const auditedGapSeed = pose === 'stand' ? {
    'founder.01:south': [80, 225], 'founder.20:south': [79, 281], 'founder.21:south': [62, 274], 'founder.21:north': [85, 274],
    'founder.23:south': [66, 274], 'founder.23:north': [87, 274], 'founder.25:north': [80, 277],
    'founder.28:north': [79, 275], 'founder.30:south': [79, 275], 'founder.30:north': [75, 274],
  }[`${identity}:${view}`] : null;
  if (auditedGapSeed) {
    const [seedX, seedY] = auditedGapSeed;
    cleared += clearNeutralConnectedRegion(canvas, { left: Math.max(0, seedX - 12), top: 198, right: Math.min(canvas.width - 1, seedX + 12), bottom: 286 }, seedX, [seedY]);
  }
  const auditedClipboardGapSeeds = pose === 'clipboard' ? {
    'founder.23': [[78, 260]], 'founder.24': [[78, 275]],
    'founder.28': [[86, 260], [87, 275]], 'founder.30': [[82, 259], [82, 271]],
  }[identity] ?? [] : [];
  for (const [seedX, seedY] of auditedClipboardGapSeeds) cleared += clearNeutralConnectedRegion(canvas, { left: Math.max(0, seedX - 12), top: 198, right: Math.min(canvas.width - 1, seedX + 12), bottom: 286 }, seedX, [seedY]);
  if (patient45SouthCaneGap) {
    cleared += clearNeutralConnectedRegion(canvas, { left: 40, top: 220, right: 48, bottom: 280 }, 44, [250], 220, 14);
    const fringeContext = canvas.getContext('2d'), fringePixels = fringeContext.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 233; y <= 275; y++) for (let x = 43; x <= 49; x++) {
      const offset = (y * canvas.width + x) * 4, r = fringePixels.data[offset], g = fringePixels.data[offset + 1], b = fringePixels.data[offset + 2];
      if (fringePixels.data[offset + 3] >= 20 && Math.min(r, g, b) >= 130 && Math.max(r, g, b) - Math.min(r, g, b) <= 20) { fringePixels.data[offset + 3] = 0; cleared++; }
    }
    fringeContext.clearRect(0, 0, canvas.width, canvas.height); fringeContext.putImageData(fringePixels, 0, 0);
  }
  if (identity === 'founder.22') {
    const finalContext = canvas.getContext('2d'), finalPixels = finalContext.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 282; y <= 284; y++) for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4, r = finalPixels.data[i], g = finalPixels.data[i + 1], b = finalPixels.data[i + 2];
      if (finalPixels.data[i + 3] >= 20 && Math.min(r, g, b) >= 120 && Math.max(r, g, b) - Math.min(r, g, b) <= 40) { finalPixels.data[i + 3] = 0; cleared++; }
    }
    finalContext.clearRect(0, 0, canvas.width, canvas.height); finalContext.putImageData(finalPixels, 0, 0);
  }
  return cleared;
}

function renderPose(identity, pose, view, extracted, sourcePath, sourceSha256, scaleOverride = null, seatContactSourceY = null) {
  const visible = bounds(extracted.canvas); if (!visible) throw Error(`${identity}/${pose}/${view} has no source alpha`);
  const scale = scaleOverride ?? Math.min(1, canvasSpec.floorY / visible.height);
  const axis = Math.round((visible.x + visible.right) / 2); const e = canvasSpec.axisX - axis * scale; const f = canvasSpec.floorY - visible.bottom * scale;
  const canvas = createCanvas(canvasSpec.width, canvasSpec.height); const context = canvas.getContext('2d'); context.imageSmoothingEnabled = false;
  context.setTransform(scale, 0, 0, scale, e, f); context.drawImage(extracted.canvas, 0, 0);
  const preliminaryBounds = bounds(canvas), preliminaryHead = measureHeadBounds(canvas, identity, pose, view, preliminaryBounds);
  const gapSeedX = pose === 'clipboard' ? identity === 'founder.24' ? 78 : Math.round(preliminaryHead.x + preliminaryHead.width / 2) : canvasSpec.axisX;
  const knownPaintedCheckerPixelsCleared = clearKnownPaintedCheckerPixels(canvas, identity, pose, view, gapSeedX);
  const outputBounds = bounds(canvas); if (!outputBounds || outputBounds.y < 0 || outputBounds.right > 158 || outputBounds.x < 1) throw Error(`${identity}/${pose}/${view} clips after registration`);
  const headBounds = measureHeadBounds(canvas, identity, pose, view, outputBounds);
  const relative = `${batchOutputDirectory(identity)}/${identity}/${pose}-${view}.png`; const bytes = canvas.toBuffer('image/png');
  const absolute = resolve(output, relative); mkdirSync(resolve(absolute, '..'), { recursive: true }); writeFileSync(absolute, bytes);
  const anchors = { bodyAxis: { sourceX: axis, x: 80 }, sole: { sourceY: visible.bottom, y: 287 }, floor: { sourceY: visible.bottom, y: 287, method: 'measured opaque lower bound registered to canonical floor' } };
  anchors.headBounds = headBounds;
  if (pose === 'sit') {
    if (!Number.isInteger(seatContactSourceY)) throw Error(`${identity}/${pose}/${view} lacks authored source-pixel seat contact`);
    anchors.seatContact = { sourceY: seatContactSourceY, y: seatContactSourceY * scale + f, method: 'authored visual measurement at underside pelvis/thigh support plane on source coordinate proof' };
  }
  return { file: `artifacts/character-statics/gs-018-v1/${relative}`, sha256: sha(bytes), width: 160, height: 320, source: { path: sourcePath, sha256: sourceSha256, crop: extracted.crop, exteriorNeutralPixelsCleared: extracted.cleared, exteriorNeutralFringePixelsCleared: extracted.fringePixelsCleared ?? 0, groundLinePixelsCleared: extracted.groundLinePixelsCleared ?? 0, knownPaintedCheckerPixelsCleared, largestComponentPixels: extracted.pixels }, matrix: { a: scale, b: 0, c: 0, d: scale, e, f }, anchors, visibleBounds: outputBounds, proportions: { headWidthToBodyHeight: headBounds.width / outputBounds.height }, qaStatus: 'source-imported-awaiting-parent-visual-review' };
}

function cropAlphaSheet(image, column, columns = 4) {
  const left = Math.round(column * image.width / columns), right = Math.round((column + 1) * image.width / columns);
  const canvas = createCanvas(right - left, image.height); const context = canvas.getContext('2d'); context.drawImage(image, left, 0, right - left, image.height, 0, 0, canvas.width, canvas.height);
  return { canvas, crop: { x: left, y: 0, width: canvas.width, height: canvas.height }, cleared: 0, pixels: largestComponent(canvas) };
}

function wholeAlphaImage(image) {
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  return { canvas, crop: { x: 0, y: 0, width: image.width, height: image.height }, cleared: 0, pixels: largestComponent(canvas) };
}

function acceptedRecord(identity, artifactPath, sourcePath = null) {
  const artifact = JSON.parse(file(artifactPath)); const statics = artifact.characters ? artifact.characters[identity]?.poses : artifact.statics;
  const poses = artifact.characters ? statics : Object.fromEntries(Object.entries(statics).map(([pose, entries]) => [pose, Object.fromEntries(Object.entries(entries).map(([view, entry]) => [view, { file: `artifacts/character-movement/${artifactPath.split('artifacts/character-movement/')[1].replace('/manifest.json', '')}/${entry.file}`, sha256: entry.sha256 }]))]));
  return { status: 'accepted-reuse-immutable', source: sourcePath ? { path: sourcePath, sha256: sourceHash(sourcePath) } : null, poses };
}

const blankCoverage = (blocker) => Object.fromEntries(['stand', 'sit'].map((pose) => [pose, Object.fromEntries(views.map((view) => [view, { required: true, status: 'pending-static-production', blocker }]))]));

function coverageFromPoses(poses, status, missingPosePlan = {}) {
  const coverage = blankCoverage('required pose has no reusable whole-body source yet');
  for (const pose of ['stand', 'sit']) for (const view of views) {
    const entry = poses?.[pose]?.[view] ?? null;
    coverage[pose][view] = entry
      ? { required: true, status, file: entry.file, sha256: entry.sha256 }
      : { required: true, status: 'blocked', blocker: missingPosePlan[`${pose}.${view}`] ?? 'required pose has no reusable whole-body source yet' };
  }
  return coverage;
}

function retainedReference(identity, entry, descriptor, blocker) {
  return {
    kind: 'retained-reference-only',
    identityPolicy: 'stable reference-only ID; no runtime identity fabricated',
    descriptor,
    source: { path: entry.file, sha256: entry.sourceSha256, revision: 'retained source sheet; exact hash has no patient-manifest join' },
    baseline: { stand: views, seat: views },
    coverage: blankCoverage(blocker),
    clipboard: { required: false, status: 'not-applicable' },
    status: 'concrete-source-blocker',
    readiness: 'not-integration-ready',
  };
}

function foundationRecord(template, poseManifest) {
  const sourcePath = `${foundationRoot}/${template.masters.standingMaster.path}`;
  const framesByView = { south: template.frames.front, east: template.frames.right, west: template.frames.left, north: template.frames.back };
  const poses = { stand: {}, sit: { south: null, east: null, west: null, north: null } };
  for (const view of views) {
    const frame = framesByView[view];
    const framePath = `${foundationRoot}/${frame.path}`;
    poses.stand[view] = { file: framePath, sha256: frame.metrics.sha256, width: frame.metrics.dimensions[0], height: frame.metrics.dimensions[1], anchors: { floor: { x: template.frames.front.floorAnchor[0], y: template.frames.front.floorAnchor[1] } }, qaStatus: 'accepted-standalone-reuse' };
  }
  const slug = template.id.replace('mixed-20260910-', '');
  const foundationPoseMap = { 'seated-front': ['sit', 'south'], 'seated-right': ['sit', 'east'], 'seated-left': ['sit', 'west'] };
  const supplementalStatics = {};
  for (const asset of poseManifest.assets) {
    if (!asset.output.path.startsWith(`characters/${slug}/`)) continue;
    const path = `${foundationPoseRoot}/${asset.output.path}`;
    if (foundationPoseMap[asset.pose]) {
      const [pose, view] = foundationPoseMap[asset.pose];
      poses[pose][view] = { file: path, sha256: asset.output.sha256, width: asset.output.dimensions[0], height: asset.output.dimensions[1], anchors: { floor: { y: asset.registration.frameFloorY ?? 181 }, seatContact: { y: 136, method: 'inherited production-pose seatAnchor contract' } }, qaStatus: asset.standaloneAcceptance };
    } else if (asset.pose === 'exam-table') {
      supplementalStatics.exam = { file: path, sha256: asset.output.sha256, width: asset.output.dimensions[0], height: asset.output.dimensions[1], status: asset.standaloneAcceptance, integration: 'fixture-and-runtime-not-accepted' };
    }
  }
  const missingPosePlan = {};
  for (const pose of ['stand', 'sit']) for (const view of views) if (!poses[pose][view]) missingPosePlan[`${pose}.${view}`] = 'foundation identity retained; cardinal static source has not been authored';
  return {
    kind: template.role === 'Patient' ? 'foundation-patient-template' : 'foundation-employee-template',
    identityPolicy: 'established stable visual ID from production-foundation-v2',
    role: template.role,
    source: { path: sourcePath, sha256: template.masters.standingMaster.metrics.sha256, revision: 'production-foundation-v2 owner-approved standing design' },
    sourceEvidence: [
      { path: foundationManifestPath, sha256: sourceHash(foundationManifestPath), relationship: 'canonical foundation package manifest' },
      { path: foundationPoseManifestPath, sha256: sourceHash(foundationPoseManifestPath), relationship: 'accepted standalone seated/exam package manifest' },
    ],
    baseline: { stand: views, seat: views }, poses, missingPosePlan,
    coverage: coverageFromPoses(poses, 'accepted-standalone-reuse', missingPosePlan),
    supplementalStatics,
    clipboard: { required: false, status: 'not-applicable' },
    status: 'partial-accepted-standalone-coverage', readiness: 'not-integration-ready',
  };
}

function inventory() {
  const records = {};
  for (let n = 1; n <= 50; n++) {
    const source = `${sourceRoot}/patient-${String(n).padStart(3, '0')}.png`;
    records[id(n)] = { kind: 'patient', source: { path: source, sha256: sourceHash(source), revision: 'patients-v1 canonical 6x3 authored source' }, baseline: { stand: views, seat: views }, coverage: blankCoverage('canonical source exists; reusable 160x320 static has not yet been imported'), clipboard: { required: false, status: 'not-applicable' }, status: 'pending-static-production', readiness: 'not-integration-ready' };
  }
  records['patient.adult.014'].sourceObservations = { 'stand.east': 'both canonical row0 profile cells face West; East standing source is concretely missing', identityCriticalDetail: 'silver hearing aid behind anatomical left ear is visible in left profile and portrait and must be preserved' };
  records['patient.adult.014'].coverage.stand.east.blocker = 'both canonical row0 profile cells face West; an exact East standing source preserving the left-ear silver hearing aid is required';
  records['patient.adult.018'].sourceObservations = { 'stand.east': 'both canonical row0 profile cells face West; East standing source is concretely missing', identityCriticalDetail: 'patterned shoulder bag remains on anatomical right shoulder/right hip and is near camera in East' };
  records['patient.adult.018'].coverage.stand.east.blocker = 'both canonical row0 profile cells face West; an exact East standing source preserving the anatomical-right bag is required';
  for (let n = 1; n <= 30; n++) {
    const path = readdirSync(resolve(repo, 'generated_images/founder-character-mockups-v3/pose-sheets')).find((name) => name.startsWith(`founder-${String(n).padStart(2, '0')}-`));
    const source = `generated_images/founder-character-mockups-v3/pose-sheets/${path}`;
    records[`founder.${String(n).padStart(2, '0')}`] = { kind: 'verified-founder', source: { path: source, sha256: sourceHash(source), revision: 'founder-v3 canonical 7x3 pose sheet' }, baseline: { stand: views, seat: views }, coverage: blankCoverage('verified founder source exists; reusable whole-body static has not yet been imported'), clipboard: { required: true, direction: 'south', status: 'pending-owner-review' }, status: 'pending-static-production', readiness: 'not-integration-ready' };
  }
  const retainedRoster = JSON.parse(file('artifacts/character-movement/retained-roster/retained-roster.json'));
  const unmatched = Object.fromEntries(retainedRoster.retainedSources.filter((entry) => !entry.stableId).map((entry) => [entry.sourceSha256, entry]));
  records['retained.reference.038fac25'] = retainedReference('retained.reference.038fac25', unmatched['038fac252afb2f6276e82380102d0685b069086800adb5a3f100c3bf2ec6ed3f'], 'older gray-haired man, dark quilted vest', 'distinct retained design has no established runtime identity or accepted whole-body static set');
  records['retained.gray-braid'] = retainedReference('retained.gray-braid', unmatched['1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4'], 'older gray-braid woman with glasses and dark jacket', 'accepted immutable whole-body static set is applied below');
  records['retained.reference.54c78cba'] = retainedReference('retained.reference.54c78cba', unmatched['54c78cba8df7a02bf508d79a38f23e07284c764a1f607b6ce0358aa20b39517e'], 'short-haired older woman, dark quilted vest', 'distinct retained design has no established runtime identity or accepted whole-body static set');
  records['retained.reference.6ee80949'] = retainedReference('retained.reference.6ee80949', unmatched['6ee809492fc0dcbb82c3319e3c4f2c66bcec509aa779b35f66dec8601ac272e5'], 'white-bob older woman with glasses and burgundy cardigan', 'distinct retained design has no established runtime identity or accepted whole-body static set');
  const foundation = JSON.parse(file(foundationManifestPath));
  const foundationPoses = JSON.parse(file(foundationPoseManifestPath));
  for (const template of foundation.templates) records[template.id] = foundationRecord(template, foundationPoses);
  return records;
}

mkdirSync(output, { recursive: true });
const records = inventory();
const accepted = {
  'patient.adult.046': acceptedRecord('green', 'tools/character-mapping/whole-body-static-v1/registry-v1.json', `${peopleRoot}/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png`),
  'retained.gray-braid': acceptedRecord('gray-braid', 'tools/character-mapping/whole-body-static-v1/registry-v1.json', `${peopleRoot}/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png`),
  'patient.adult.032': acceptedRecord('gray-overshirt', 'tools/character-mapping/whole-body-static-v1/registry-v1.json', `${peopleRoot}/exec-33437146-564e-4cb1-a7e2-ad41504ea752.png`),
  'patient.adult.043': acceptedRecord('brown-beanie', 'tools/character-mapping/whole-body-static-v1/registry-v1.json', `${peopleRoot}/exec-092d31ac-7592-4634-8883-167ddac564df.png`),
  'patient.adult.035': acceptedRecord(null, 'artifacts/character-movement/navy-vest-v1/manifest.json', `${peopleRoot}/exec-ee82180f-799f-4617-9159-27eefa97f158.png`),
  'patient.adult.039': acceptedRecord(null, 'artifacts/character-movement/blue-glasses-v1/manifest.json', `${peopleRoot}/exec-492d528d-52f8-422a-a1dc-fe63b3cd04cb.png`),
};
for (const [identity, record] of Object.entries(accepted)) records[identity] = { ...records[identity], ...record, coverage: coverageFromPoses(record.poses, 'accepted-reuse-immutable'), clipboard: records[identity]?.clipboard ?? { required: false, status: 'not-applicable' } };

const proofEntries = []; const firstBatch = []; const secondBatch = []; const remainingPatientBatch = [];
const immutablePatientNumbers = new Set([32, 35, 39, 43, 46]);
const parentApprovedRemainingPatientNumbers = new Set([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 36, 37, 38, 40, 41, 42, 44, 45, 47, 48, 49, 50]);
const correctedPatientSeats = {
  22: { version: 'v2', prompt: 'patient-022-seated-v2-exact-prompt.txt' },
  23: { version: 'v3', prompt: 'patient-023-seated-v3-exact-prompt.txt' },
  24: { version: 'v2', prompt: 'patient-024-seated-v2-exact-prompt.txt' },
  31: { version: 'v4', prompt: 'patient-031-seated-v4-exact-prompt.txt' },
  33: { version: 'v2', prompt: 'patient-033-seated-v2-exact-prompt.txt' },
  45: { version: 'v2', prompt: 'patient-045-seated-v2-prompt.txt' },
};
for (let n = 1; n <= 50; n++) {
  if (immutablePatientNumbers.has(n)) continue;
  const identity = id(n), sourcePath = records[identity].source.path, sourceSha256 = records[identity].source.sha256;
  const image = await loadImage(resolve(repo, sourcePath)); const poseSlots = { south: 0, east: 1, west: 2, north: 3 };
  const poses = { stand: {}, sit: { south: null, east: null, west: null, north: null } };
  const standSources = Object.fromEntries(Object.entries(poseSlots).map(([view, column]) => [view, cropCell(image, column, 0, [11, 17].includes(n) ? 225 : 235)]));
  const standScale = Math.min(1, ...Object.values(standSources).map((entry) => canvasSpec.floorY / bounds(entry.canvas).height));
  for (const [view] of Object.entries(poseSlots)) poses.stand[view] = renderPose(identity, 'stand', view, standSources[view], sourcePath, sourceSha256, standScale);
  if (n === 4) {
    const westPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v2.png'; const westPromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v2-prompt.txt';
    const westImage = await loadImage(resolve(repo, westPath)); const westSource = wholeAlphaImage(westImage); const westBounds = bounds(westSource.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale; const westScale = targetHeight / westBounds.height;
    poses.stand.west = renderPose(identity, 'stand', 'west', westSource, westPath, sourceHash(westPath), westScale);
    records[identity].alternateStandingSource = { direction: 'west', path: westPath, sha256: sourceHash(westPath), promptPath: westPromptPath, promptSha256: sourceHash(westPromptPath), status: 'parent-accepted-scaled-proof', reason: 'canonical source West slot faces East; v2 is a clean true-alpha exact West profile with parent-approved source-matched three-head body proportion' };
    records[identity].supersededStandingSources = [{ path: 'tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v1.png', sha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v1.png'), promptPath: 'tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v1-prompt.txt', promptSha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v1-prompt.txt'), status: 'rejected-small-head-narrow-body-long-leg-proportions-preserved-for-provenance', alphaStatus: 'clean-true-alpha' }];
  }
  if (n === 12) {
    const northPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-012-north-v1.png'; const northPromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-012-north-v1-prompt.txt';
    const northImage = await loadImage(resolve(repo, northPath)); const northSource = wholeAlphaImage(northImage); const northBounds = bounds(northSource.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale; const northScale = targetHeight / northBounds.height;
    poses.stand.north = renderPose(identity, 'stand', 'north', northSource, northPath, sourceHash(northPath), northScale);
    records[identity].alternateStandingSource = { direction: 'north', path: northPath, sha256: sourceHash(northPath), promptPath: northPromptPath, promptSha256: sourceHash(northPromptPath), status: 'parent-accepted-scaled-proof', reason: 'canonical North standing bag disagrees with the front anatomical-left placement; correction places bag on screen-left hip with strap from screen-right shoulder' };
  }
  if (n === 14 || n === 18) {
    const version = n === 14 ? 'v2' : 'v1';
    const eastPath = `tools/character-mapping/gs-018-statics-v1/assets/patient-${String(n).padStart(3, '0')}-east-${version}.png`; const eastPromptPath = `tools/character-mapping/gs-018-statics-v1/assets/patient-${String(n).padStart(3, '0')}-east-${version}-prompt.txt`;
    const eastImage = await loadImage(resolve(repo, eastPath)); const eastSource = wholeAlphaImage(eastImage); const eastBounds = bounds(eastSource.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale; const eastScale = targetHeight / eastBounds.height;
    poses.stand.east = renderPose(identity, 'stand', 'east', eastSource, eastPath, sourceHash(eastPath), eastScale);
    records[identity].alternateStandingSource = { direction: 'east', path: eastPath, sha256: sourceHash(eastPath), promptPath: eastPromptPath, promptSha256: sourceHash(eastPromptPath), status: 'parent-accepted-scaled-proof', reason: n === 14 ? 'both canonical profile cells face West; generated East hides the far-side anatomical-left hearing aid' : 'both canonical profile cells face West; generated East preserves the near-camera anatomical-right shoulder bag' };
  }
  if (n === 18) {
    const correctionPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-018-west-north-v1.png'; const correctionPromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-018-west-north-v1-prompt.txt';
    const correctionImage = await loadImage(resolve(repo, correctionPath)); const westSource = cropAlphaSheet(correctionImage, 0, 2), northSource = cropAlphaSheet(correctionImage, 1, 2);
    const targetHeight = bounds(standSources.south.canvas).height * standScale; const correctionScale = targetHeight / bounds(westSource.canvas).height;
    poses.stand.west = renderPose(identity, 'stand', 'west', westSource, correctionPath, sourceHash(correctionPath), correctionScale);
    poses.stand.north = renderPose(identity, 'stand', 'north', northSource, correctionPath, sourceHash(correctionPath), correctionScale);
    records[identity].alternateStandingSources = [records[identity].alternateStandingSource, { directions: ['west', 'north'], path: correctionPath, sha256: sourceHash(correctionPath), promptPath: correctionPromptPath, promptSha256: sourceHash(correctionPromptPath), status: 'parent-accepted-scaled-proof', reason: 'canonical West and North put the anatomical-right bag on the wrong side; correction preserves far-side West placement and screen-right back placement' }];
    delete records[identity].alternateStandingSource;
  }
  const singleStandingCorrections = {
    24: { direction: 'north', file: 'patient-024-north-v2.png', prompt: 'patient-024-north-v2-exact-prompt.txt', reason: 'canonical North tote side disagrees with the anatomical-left placement; v2 restores screen-left back placement' },
    31: { direction: 'north', file: 'patient-031-north-v2.png', prompt: 'patient-031-north-v2-exact-prompt.txt', reason: 'canonical North bag side disagrees with the anatomical-left placement; v2 restores screen-left back placement' },
    45: { direction: 'west', file: 'patient-045-west-v2.png', prompt: 'patient-045-west-v2-prompt.txt', reason: 'canonical West cane is near-side; v2 preserves the anatomical-right cane as far-side/hidden in true West profile' },
  }[n];
  if (singleStandingCorrections) {
    const correctionPath = `tools/character-mapping/gs-018-statics-v1/assets/${singleStandingCorrections.file}`, promptPath = `tools/character-mapping/gs-018-statics-v1/assets/${singleStandingCorrections.prompt}`;
    const correctionImage = await loadImage(resolve(repo, correctionPath)), correctionSource = wholeAlphaImage(correctionImage), correctionBounds = bounds(correctionSource.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale, correctionScale = Math.min(targetHeight / correctionBounds.height, 154 / correctionBounds.width);
    poses.stand[singleStandingCorrections.direction] = renderPose(identity, 'stand', singleStandingCorrections.direction, correctionSource, correctionPath, sourceHash(correctionPath), correctionScale);
    records[identity].alternateStandingSource = { direction: singleStandingCorrections.direction, path: correctionPath, sha256: sourceHash(correctionPath), promptPath, promptSha256: sourceHash(promptPath), promptProvenance: 'verbatim-invocation-retained', status: 'parent-selected-source-pending-scaled-proof-acceptance', reason: singleStandingCorrections.reason };
  }
  if (n === 33) {
    const correctionPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-033-stand-profiles-v2.png', promptPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-033-stand-profiles-v2-exact-prompt.txt';
    const correctionImage = await loadImage(resolve(repo, correctionPath)), eastSource = cropAlphaSheet(correctionImage, 0, 2), westSource = cropAlphaSheet(correctionImage, 1, 2);
    const targetHeight = bounds(standSources.south.canvas).height * standScale, correctionScale = Math.min(targetHeight / bounds(eastSource.canvas).height, 154 / bounds(eastSource.canvas).width, 154 / bounds(westSource.canvas).width);
    poses.stand.east = renderPose(identity, 'stand', 'east', eastSource, correctionPath, sourceHash(correctionPath), correctionScale);
    poses.stand.west = renderPose(identity, 'stand', 'west', westSource, correctionPath, sourceHash(correctionPath), correctionScale);
    records[identity].alternateStandingSources = [{ directions: ['east', 'west'], path: correctionPath, sha256: sourceHash(correctionPath), promptPath, promptSha256: sourceHash(promptPath), promptProvenance: 'verbatim-invocation-retained', status: 'parent-selected-source-pending-scaled-proof-acceptance', reason: 'v2 restores glasses in both exact 90-degree standing profiles' }];
  }
  const correctedSeat = correctedPatientSeats[n];
  const seatedVersion = correctedSeat?.version ?? ([10, 12, 14].includes(n) ? 'v2' : 'v1');
  const seatedAsset = `assets/patient-${String(n).padStart(3, '0')}-seated-${seatedVersion}.png`;
  const seatedPrompt = `assets/${correctedSeat?.prompt ?? `patient-${String(n).padStart(3, '0')}-seated-${seatedVersion}-prompt.txt`}`;
  const hasCardinalSeatSource = existsSync(resolve(import.meta.dirname, seatedAsset));
  const hasSeatedPrompt = existsSync(resolve(import.meta.dirname, seatedPrompt));
  if (hasCardinalSeatSource) {
    const generatedPath = `tools/character-mapping/gs-018-statics-v1/${seatedAsset}`; const generatedBytes = file(generatedPath); const generated = await loadImage(resolve(repo, generatedPath));
    const reference = cropCell(image, 4, 0); const referenceBounds = bounds(reference.canvas); const generatedSouth = cropAlphaSheet(generated, 0); const generatedBounds = bounds(generatedSouth.canvas);
    const parentScaleCalibration = n === 2 ? 1.04 : 1;
    const seatScale = standScale * referenceBounds.height / generatedBounds.height * parentScaleCalibration;
    const seatColumns = n === 8 ? { south: 0, east: 1, west: 3, north: 2 } : { south: 0, east: 1, west: 2, north: 3 };
    for (const view of views) poses.sit[view] = renderPose(identity, 'sit', view, cropAlphaSheet(generated, seatColumns[view]), generatedPath, sha(generatedBytes), seatScale, authoredSeatContactSourceY[identity][view]);
    let alternateSeatedSource = null;
    if (n === 45) {
      const alternatePath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-045-east-seated-v3.png', alternatePromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/patient-045-east-seated-v3-prompt.txt';
      const alternateImage = await loadImage(resolve(repo, alternatePath)), alternate = wholeAlphaImage(alternateImage), alternateBounds = bounds(alternate.canvas);
      const targetHeight = generatedBounds.height * seatScale, alternateScale = Math.min(targetHeight / alternateBounds.height, 156 / alternateBounds.width);
      poses.sit.east = renderPose(identity, 'sit', 'east', alternate, alternatePath, sourceHash(alternatePath), alternateScale, authoredSeatContactSourceY[identity].east);
      alternateSeatedSource = { direction: 'east', path: alternatePath, sha256: sourceHash(alternatePath), promptPath: alternatePromptPath, promptSha256: sourceHash(alternatePromptPath), promptProvenance: 'verbatim-invocation-retained', status: 'parent-selected-source-pending-scaled-proof-acceptance', scaleReference: { method: 'standalone East whole-body height matched to the selected v2 South seated render; raw source scale intentionally differs from the four-cell sheet', targetRenderedHeight: targetHeight, scale: alternateScale }, reason: 'v2 East placed the anatomical-right cane in the far hand; v3 restores near-camera East cane placement' };
    }
    const promptPath = hasSeatedPrompt ? `tools/character-mapping/gs-018-statics-v1/${seatedPrompt}` : null;
    records[identity] = { ...records[identity], ...(alternateSeatedSource ? { alternateSeatedSource } : {}), seatedSource: { path: generatedPath, sha256: sha(generatedBytes), ...(promptPath ? { promptPath, promptSha256: sourceHash(promptPath), promptProvenance: 'verbatim-invocation-retained' } : { promptPath: null, promptSha256: null, promptProvenance: 'exact-prompt-unavailable-do-not-reconstruct' }), version: seatedVersion, scaleReference: { source: sourcePath, sourceCrop: reference.crop, sourceContentBounds: referenceBounds, generatedSouthBounds: generatedBounds, baseScale: standScale * referenceBounds.height / generatedBounds.height, parentDirectedWholeBodyScaleCalibration: parentScaleCalibration, scale: seatScale, note: n === 2 ? 'Parent-directed 1.04 whole-body scale calibration after visual crown/chin comparison; floor remains registered and source South seat is approximate only.' : 'Original South seat is an approximate height reference; authored crown/chin comparison and visual QA govern.' }, seatContact: { status: 'authored-source-pixel-measurements', method: 'per-view underside pelvis/thigh support plane; long clothing hems are not used as contact', sourceY: authoredSeatContactSourceY[identity] } } };
    if (n === 10) records[identity].supersededSeatedSources = [{ path: 'tools/character-mapping/gs-018-statics-v1/assets/patient-010-seated-v1.png', sha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-010-seated-v1.png'), promptPath: 'tools/character-mapping/gs-018-statics-v1/assets/patient-010-seated-v1-prompt.txt', promptSha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-010-seated-v1-prompt.txt'), status: 'rejected-small-head-proportions-preserved-for-provenance' }];
    if (n === 12) records[identity].supersededSeatedSources = [{ path: 'tools/character-mapping/gs-018-statics-v1/assets/patient-012-seated-v1.png', sha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-012-seated-v1.png'), promptPath: 'tools/character-mapping/gs-018-statics-v1/assets/patient-012-seated-v1-prompt.txt', promptSha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-012-seated-v1-prompt.txt'), status: 'rejected-north-bag-anatomical-side-inconsistency-preserved-for-provenance' }];
    if (n === 12) records[identity].seatedSource.correctionReview = { status: 'parent-accepted-scaled-proof', issue: 'original and v1 North bag disagreed with South/front anatomical-left placement', correction: 'North bag moved to screen-left hip with strap from screen-right shoulder; first three cells unchanged per prompt' };
    const supersededSeatVersions = { 22: ['v1'], 23: ['v1', 'v2'], 24: ['v1'], 31: ['v1', 'v2', 'v3'], 33: ['v1'], 45: ['v1'] }[n];
    if (supersededSeatVersions) records[identity].supersededSeatedSources = supersededSeatVersions.map((version) => {
      const path = `tools/character-mapping/gs-018-statics-v1/assets/patient-${String(n).padStart(3, '0')}-seated-${version}.png`;
      const promptCandidates = [`tools/character-mapping/gs-018-statics-v1/assets/patient-${String(n).padStart(3, '0')}-seated-${version}-exact-prompt.txt`, `tools/character-mapping/gs-018-statics-v1/assets/patient-${String(n).padStart(3, '0')}-seated-${version}-prompt.txt`];
      const priorPromptPath = promptCandidates.find((candidate) => existsSync(resolve(repo, candidate))) ?? null;
      const rejected = (n === 23 && version === 'v2') || (n === 31 && ['v2', 'v3'].includes(version));
      return { path, sha256: sourceHash(path), ...(priorPromptPath ? { promptPath: priorPromptPath, promptSha256: sourceHash(priorPromptPath) } : {}), status: rejected ? 'rejected-accessory-placement-preserved-for-provenance' : 'superseded-by-selected-correction-source' };
    });
  }
  const missingPosePlan = { ...(!hasCardinalSeatSource ? Object.fromEntries(views.map((view) => [`sit.${view}`, 'pending parent-authored exact 90-degree cardinal seat source'])) : {}) };
  const headScaleAudit = { method: 'authored/derived crown-to-chin output bounds; generated seat compared with imported source standing view', historicalAcceptedReferenceRange: [0.872, 1.118], decisionPolicy: 'metrics never approve artwork; parent visual QA decides', views: {} };
  for (const view of views) {
    const stand = poses.stand[view]?.anchors.headBounds, sit = poses.sit[view]?.anchors.headBounds;
    if (!stand || !sit) continue;
    const ratio = sit.height / stand.height;
    headScaleAudit.views[view] = { stand: { crownY: stand.crownY, chinY: stand.chinY, height: stand.height }, sit: { crownY: sit.crownY, chinY: sit.chinY, height: sit.height }, ratio, metricStatus: ratio >= 0.872 && ratio <= 1.118 ? 'within-historical-reference-range' : 'outside-historical-reference-range-requires-visual-decision' };
  }
  const parentApproved = n <= 20 || parentApprovedRemainingPatientNumbers.has(n);
  if (parentApproved) for (const group of Object.values(poses)) for (const entry of Object.values(group)) if (entry) entry.qaStatus = 'parent-visual-approved';
  records[identity] = { ...records[identity], status: parentApproved ? 'parent-visual-approved' : 'production-source-imported-pending-parent-visual-review', poses, missingPosePlan, headScaleAudit, coverage: coverageFromPoses(poses, parentApproved ? 'parent-visual-approved' : 'source-imported-awaiting-parent-visual-review', missingPosePlan), readiness: parentApproved ? 'ready-for-integration-not-deployed' : 'not-integration-ready' };
  for (const view of views) if (poses.stand[view]) proofEntries.push({ identity, pose: `stand ${view}`, file: poses.stand[view].file }); for (const [view, entry] of Object.entries(poses.sit)) if (entry) proofEntries.push({ identity, pose: `sit ${view}`, file: entry.file });
  if (n <= 10) firstBatch.push(identity);
  else if (n <= 20) secondBatch.push(identity);
  else remainingPatientBatch.push(identity);
}

const founderSeatVersions = { 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 2, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 16: 1, 17: 2, 18: 1, 19: 2, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 2, 27: 1, 28: 1, 29: 2, 30: 1 };
const nonverbatimFounderPromptRecords = new Set([2, 3, 9, 10, 11, 12, 13, 14, 15]);
const founderBatch = []; const founderProofEntries = []; const clipboardProofEntries = [];
for (let n = 1; n <= 30; n++) {
  const identity = founderId(n), sourcePath = records[identity].source.path, sourceSha256 = records[identity].source.sha256;
  const image = await loadImage(resolve(repo, sourcePath));
  const standColumns = { south: 0, west: 1, east: 2, north: 3 };
  const standSources = Object.fromEntries(Object.entries(standColumns).map(([view, column]) => [view, cropFounderCell(image, column, 0)]));
  const standScale = Math.min(1, ...Object.values(standSources).map((entry) => { const visible = bounds(entry.canvas); return Math.min(canvasSpec.floorY / visible.height, 154 / visible.width); }));
  const poses = { stand: {}, sit: {} };
  for (const view of views) poses.stand[view] = renderPose(identity, 'stand', view, standSources[view], sourcePath, sourceSha256, standScale);
  let alternateStandingSource = null, supersededStandingSources = [];
  if (n === 1) {
    const alternatePath = 'tools/character-mapping/gs-018-statics-v1/assets/founder-01-west-v2.png', alternatePromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/founder-01-west-v2-exact-prompt.txt';
    const alternateImage = await loadImage(resolve(repo, alternatePath)), alternate = wholeAlphaImage(alternateImage), alternateVisible = bounds(alternate.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale, alternateScale = Math.min(targetHeight / alternateVisible.height, 154 / alternateVisible.width);
    poses.stand.west = renderPose(identity, 'stand', 'west', alternate, alternatePath, sourceHash(alternatePath), alternateScale);
    alternateStandingSource = { direction: 'west', path: alternatePath, sha256: sourceHash(alternatePath), promptPath: alternatePromptPath, promptSha256: sourceHash(alternatePromptPath), status: 'source-candidate-parent-selected-pending-scaled-proof-acceptance', reason: 'canonical West standing source omits the anatomical-left chest badge; v2 restores the badge and matches canonical standing head/body proportions in true West profile' };
    supersededStandingSources = [{ direction: 'west', path: 'tools/character-mapping/gs-018-statics-v1/assets/founder-01-west-v1.png', sha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/founder-01-west-v1.png'), promptPath: 'tools/character-mapping/gs-018-statics-v1/assets/founder-01-west-v1-exact-prompt.txt', promptSha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/founder-01-west-v1-exact-prompt.txt'), status: 'superseded-after-scaled-proof-review', reason: 'clean alpha and correct badge, but head was materially smaller than the canonical South/East standing proportions' }];
  }
  if (n === 6) {
    const alternatePath = 'tools/character-mapping/gs-018-statics-v1/assets/founder-06-east-v1.png', alternatePromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/founder-06-east-v1-prompt.txt';
    const alternateImage = await loadImage(resolve(repo, alternatePath)), alternate = wholeAlphaImage(alternateImage), alternateVisible = bounds(alternate.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale, alternateScale = Math.min(targetHeight / alternateVisible.height, 154 / alternateVisible.width);
    poses.stand.east = renderPose(identity, 'stand', 'east', alternate, alternatePath, sourceHash(alternatePath), alternateScale);
    alternateStandingSource = { direction: 'east', path: alternatePath, sha256: sourceHash(alternatePath), promptPath: alternatePromptPath, promptSha256: sourceHash(alternatePromptPath), status: 'source-candidate-parent-reviewed-pending-scaled-proof-acceptance', reason: 'canonical East standing source showed the watch on the wrong anatomical side; correction removes the watch from East' };
  }
  if (n === 13) {
    const alternatePath = 'tools/character-mapping/gs-018-statics-v1/assets/founder-13-east-v1.png', alternatePromptPath = 'tools/character-mapping/gs-018-statics-v1/assets/founder-13-east-v1-exact-prompt.txt';
    const alternateImage = await loadImage(resolve(repo, alternatePath)), alternate = wholeAlphaImage(alternateImage), alternateVisible = bounds(alternate.canvas);
    const targetHeight = bounds(standSources.south.canvas).height * standScale, alternateScale = Math.min(targetHeight / alternateVisible.height, 154 / alternateVisible.width);
    poses.stand.east = renderPose(identity, 'stand', 'east', alternate, alternatePath, sourceHash(alternatePath), alternateScale);
    alternateStandingSource = { direction: 'east', path: alternatePath, sha256: sourceHash(alternatePath), promptPath: alternatePromptPath, promptSha256: sourceHash(alternatePromptPath), status: 'source-candidate-parent-reviewed-pending-scaled-proof-acceptance', reason: 'canonical East standing source duplicated the left-facing profile; correction supplies the missing true East profile' };
  }

  const version = founderSeatVersions[n], short = String(n).padStart(2, '0');
  const seatedPath = `tools/character-mapping/gs-018-statics-v1/assets/founder-${short}-seated-v${version}.png`;
  const promptPath = `tools/character-mapping/gs-018-statics-v1/assets/founder-${short}-seated-v${version}-prompt.txt`;
  const seatedBytes = file(seatedPath), seatedImage = await loadImage(resolve(repo, seatedPath));
  const seatColumns = n === 13 ? { south: 0, west: 1, east: 2, north: 3 } : n === 18 ? { south: 0, east: 1, north: 2, west: 3 } : { south: 0, east: 1, west: 2, north: 3 };
  const seatedSources = Object.fromEntries(views.map((view) => [view, cropAlphaSheet(seatedImage, seatColumns[view])]));
  const standHead = measureHeadBounds(standSources.south.canvas, identity, 'stand', 'south', bounds(standSources.south.canvas));
  const seatedSouthHead = measureHeadBounds(seatedSources.south.canvas, identity, 'sit', 'south', bounds(seatedSources.south.canvas));
  const headMatchedScale = standScale * standHead.height / seatedSouthHead.height;
  const seatFitLimits = Object.values(seatedSources).map((entry) => { const visible = bounds(entry.canvas); return Math.min(canvasSpec.floorY / visible.height, 156 / visible.width); });
  const uncalibratedSeatScale = Math.min(headMatchedScale, ...seatFitLimits);
  const parentDirectedAnimalScaleCalibration = n === 22 ? 0.81 : n === 24 ? 1.35 : 1;
  const calibratedHeadScale = uncalibratedSeatScale * parentDirectedAnimalScaleCalibration;
  const seatScale = Math.min(calibratedHeadScale, ...seatFitLimits);
  for (const view of views) poses.sit[view] = renderPose(identity, 'sit', view, seatedSources[view], seatedPath, sha(seatedBytes), seatScale, authoredFounderSeatContactSourceY[identity][view]);

  const clipboardSource = cropFounderClipboardCell(image, 2, identity), clipboardVisible = bounds(clipboardSource.canvas);
  const clipboardScale = n === 18 ? Math.min(278 / clipboardVisible.height, canvasSpec.floorY / clipboardVisible.height, 156 / clipboardVisible.width) : Math.min(standScale, canvasSpec.floorY / clipboardVisible.height, 156 / clipboardVisible.width);
  const clipboardPose = renderPose(identity, 'clipboard', 'south', clipboardSource, sourcePath, sourceSha256, clipboardScale);
  clipboardPose.qaStatus = 'owner-visual-approved';
  for (const group of Object.values(poses)) for (const entry of Object.values(group)) entry.qaStatus = 'parent-visual-approved';
  records[identity] = {
    ...records[identity],
    ...(alternateStandingSource ? { alternateStandingSource } : {}), ...(supersededStandingSources.length ? { supersededStandingSources } : {}),
    status: 'production-source-imported-pending-parent-visual-review', readiness: 'not-integration-ready', poses,
    coverage: coverageFromPoses(poses, 'source-imported-awaiting-parent-visual-review'), missingPosePlan: {},
    seatedSource: {
      path: seatedPath, sha256: sha(seatedBytes), promptPath, promptSha256: sourceHash(promptPath), version,
      promptProvenance: nonverbatimFounderPromptRecords.has(n) ? 'production-constraints-record-not-verbatim-invocation' : 'verbatim-invocation-retained',
      sourceOrder: Object.entries(seatColumns).sort((a, b) => a[1] - b[1]).map(([view]) => view),
      scaleReference: { source: sourcePath, method: parentDirectedAnimalScaleCalibration === 1 ? 'South crown/chin head-height match against canonical standing source; one uniform whole-body transform for all seated views' : 'Parent-directed visual whole-body scale calibration from face/head width excluding animal ears; one uniform transform for all seated views', standingSouthHeadSourceBounds: standHead, generatedSouthHeadSourceBounds: seatedSouthHead, headMatchedScale, uncalibratedSeatScale, parentDirectedAnimalScaleCalibration, calibratedHeadScale, scale: seatScale, fitConstraintApplied: seatScale !== calibratedHeadScale },
      seatContact: { status: 'authored-source-pixel-measurements', method: 'per-view underside posterior/upper-thigh chair support plane; long clothing hems and hip center are not used as contact', sourceY: authoredFounderSeatContactSourceY[identity], viewBasis: { south: 'visually measured at underside upper-thigh support plane', east: 'visually measured at underside posterior/upper-thigh chair plane', west: 'visually measured at underside posterior/upper-thigh chair plane', north: 'anatomical chair plane inferred from matched lateral views where posterior contact is occluded' } },
    },
    headScaleAudit: { method: 'South source crown/chin match establishes uniform seated scale; output measurements remain informational', decisionPolicy: 'metrics never approve artwork; parent visual QA decides', views: Object.fromEntries(views.map((view) => [view, { stand: poses.stand[view].anchors.headBounds, sit: poses.sit[view].anchors.headBounds, ratio: poses.sit[view].anchors.headBounds.height / poses.stand[view].anchors.headBounds.height }])) },
    clipboard: { required: true, direction: 'south', status: 'owner-visual-approved', candidate: clipboardPose, sourceCell: { row: 2, column: 2, grid: '7x3', crop: clipboardSource.crop }, scaleReview: n === 18 ? { authorization: 'owner directed uniform whole-body scaling only', targetVisibleHeight: 278, actualVisibleHeight: clipboardPose.visibleBounds.height, floorY: 287, baselineFounderPosesUnchanged: true, parentComparisonProofStatus: 'accepted' } : null, finding: n === 18 ? 'front-facing clipboard source uniformly scaled to the owner-directed peer stature and parent-verified at the owner-approved size' : 'front-facing whole-body clipboard source approved by owner at the reviewed candidate hash' },
  };
  for (const group of Object.values(poses)) for (const entry of Object.values(group)) entry.qaStatus = 'parent-visual-approved';
  records[identity].status = 'parent-visual-approved'; records[identity].readiness = 'ready-for-integration-not-deployed'; records[identity].coverage = coverageFromPoses(poses, 'parent-visual-approved');
  for (const view of views) { founderProofEntries.push({ identity, pose: `stand ${view}`, file: poses.stand[view].file }); founderProofEntries.push({ identity, pose: `sit ${view}`, file: poses.sit[view].file }); }
  clipboardProofEntries.push({ identity, pose: 'clipboard south OWNER REVIEW', label: `Founder ${short}`, file: clipboardPose.file });
  founderBatch.push(identity);
}

const finalSevenConfigs = [
  { identity: 'retained.reference.038fac25', sourceType: 'retained-6x3' },
  { identity: 'retained.reference.54c78cba', sourceType: 'retained-6x3' },
  { identity: 'retained.reference.6ee80949', sourceType: 'retained-6x3' },
  { identity: 'mixed-20260910-patient-01', sourceType: 'foundation-masters', slug: 'patient-01' },
  { identity: 'mixed-20260910-patient-02', sourceType: 'foundation-masters', slug: 'patient-02' },
  { identity: 'mixed-20260910-receptionist-01', sourceType: 'foundation-masters', slug: 'receptionist-01' },
  { identity: 'mixed-20260910-nurse-01', sourceType: 'foundation-masters', slug: 'nurse-01' },
];
const finalSevenBatch = [], finalSevenProofEntries = [];
for (const config of finalSevenConfigs) {
  const { identity } = config, poses = { stand: {}, sit: {} };
  let standSources, standingEvidence;
  if (config.sourceType === 'retained-6x3') {
    const sourcePath = records[identity].source.path, sourceImage = await loadImage(resolve(repo, sourcePath));
    standSources = Object.fromEntries(views.map((view, column) => [view, cropCell(sourceImage, column, 0)]));
    standingEvidence = [{ path: sourcePath, sha256: records[identity].source.sha256, directions: views, sourceOrder: views, contract: 'opaque-checker 6x3 row0' }];
  } else {
    const directionalFiles = { south: 'standing-master.png', east: 'right-idle-master.png', west: 'left-idle-master.png', north: 'back-idle-master.png' };
    standSources = {}; standingEvidence = [];
    for (const [view, filename] of Object.entries(directionalFiles)) {
      const path = `${foundationRoot}/characters/${config.slug}/${filename}`, image = await loadImage(resolve(repo, path));
      standSources[view] = wholeAlphaImage(image); standingEvidence.push({ path, sha256: sourceHash(path), direction: view, contract: 'accepted 448x1024 transparent directional master' });
    }
  }
  const standScale = Math.min(...Object.values(standSources).map((entry) => { const visible = bounds(entry.canvas); return Math.min(canvasSpec.floorY / visible.height, 154 / visible.width); }));
  for (const view of views) {
    const evidence = standingEvidence.find((entry) => entry.direction === view) ?? standingEvidence[0];
    poses.stand[view] = renderPose(identity, 'stand', view, standSources[view], evidence.path, evidence.sha256, standScale);
  }
  const seatedPath = `tools/character-mapping/gs-018-statics-v1/assets/${identity}-seated-v1.png`, promptPath = `tools/character-mapping/gs-018-statics-v1/assets/${identity}-seated-v1-exact-prompt.txt`;
  const seatedBytes = file(seatedPath), seatedImage = await loadImage(resolve(repo, seatedPath)), seatedSources = Object.fromEntries(views.map((view, column) => [view, cropAlphaSheet(seatedImage, column)]));
  const standSouthBounds = bounds(standSources.south.canvas), seatedSouthBounds = bounds(seatedSources.south.canvas);
  const standHead = measureHeadBounds(standSources.south.canvas, identity, 'stand', 'south', standSouthBounds), seatedHead = measureHeadBounds(seatedSources.south.canvas, identity, 'sit', 'south', seatedSouthBounds);
  const headMatchedScale = standScale * standHead.height / seatedHead.height;
  const uncalibratedSeatScale = Math.min(headMatchedScale, ...Object.values(seatedSources).map((entry) => { const visible = bounds(entry.canvas); return Math.min(canvasSpec.floorY / visible.height, 156 / visible.width); }));
  const parentDirectedWholeBodyScaleCalibration = identity === 'retained.reference.54c78cba' ? 0.83 : 1;
  const seatScale = uncalibratedSeatScale * parentDirectedWholeBodyScaleCalibration;
  for (const view of views) poses.sit[view] = renderPose(identity, 'sit', view, seatedSources[view], seatedPath, sha(seatedBytes), seatScale, authoredFinalSeatContactSourceY[identity][view]);
  records[identity] = {
    ...records[identity], poses, standingSources: standingEvidence,
    seatedSource: { path: seatedPath, sha256: sha(seatedBytes), promptPath, promptSha256: sourceHash(promptPath), promptProvenance: 'verbatim-invocation-retained', version: 'v1', sourceOrder: views, scaleReference: { method: parentDirectedWholeBodyScaleCalibration === 1 ? 'South crown/chin head-height match against the canonical standing source; one uniform whole-body transform for all seated views' : 'Parent-directed uniform whole-body scale correction after native proof head/body comparison', standingSouthHeadSourceBounds: standHead, generatedSouthHeadSourceBounds: seatedHead, headMatchedScale, uncalibratedSeatScale, parentDirectedWholeBodyScaleCalibration, scale: seatScale, fitConstraintApplied: uncalibratedSeatScale !== headMatchedScale }, seatContact: { status: 'parent-accepted-authored-source-pixel-measurements', method: 'per-view underside posterior/upper-thigh chair support plane; long clothing hems and hip center are not used as contact', sourceY: authoredFinalSeatContactSourceY[identity] } },
    status: 'parent-visual-approved', readiness: 'static-art-ready-local-only', runtimeMapping: identity.startsWith('retained.') ? { status: 'not-authorized-reference-only', reason: 'stable production reference only; no runtime identity join was established or invented' } : { status: 'not-deployed' }, coverage: coverageFromPoses(poses, 'parent-visual-approved'), missingPosePlan: {},
    headScaleAudit: { method: 'South source crown/chin match establishes uniform seated scale; output measurements remain informational', decisionPolicy: 'metrics never approve artwork; parent visual QA decides', views: Object.fromEntries(views.map((view) => [view, { stand: poses.stand[view].anchors.headBounds, sit: poses.sit[view].anchors.headBounds, ratio: poses.sit[view].anchors.headBounds.height / poses.stand[view].anchors.headBounds.height }])) },
  };
  for (const view of views) { finalSevenProofEntries.push({ identity, pose: `stand ${view}`, file: poses.stand[view].file }); finalSevenProofEntries.push({ identity, pose: `sit ${view}`, file: poses.sit[view].file }); }
  finalSevenBatch.push(identity);
}

function proof(entries, scale, name) {
  const cellW = 160 * scale, cellH = 320 * scale, label = 24; const columns = 5, rows = Math.ceil(entries.length / columns);
  const canvas = createCanvas(columns * cellW, rows * (cellH + label)); const context = canvas.getContext('2d'); context.fillStyle = '#20242a'; context.fillRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = false;
  return Promise.all(entries.map(async (entry, index) => { const image = await loadImage(resolve(repo, entry.file.replace('artifacts/character-statics/gs-018-v1/', 'artifacts/character-statics/gs-018-v1/'))); const x = index % columns * cellW, y = Math.floor(index / columns) * (cellH + label); context.drawImage(image, x, y, cellW, cellH); context.fillStyle = '#ffffff'; context.font = '12px sans-serif'; context.fillText(entry.label ?? `${entry.identity} ${entry.pose}`, x + 4, y + cellH + 16); })).then(() => { const path = resolve(output, 'proofs', name); mkdirSync(resolve(path, '..'), { recursive: true }); const bytes = canvas.toBuffer('image/png'); writeFileSync(path, bytes); return { file: `artifacts/character-statics/gs-018-v1/proofs/${name}`, sha256: sha(bytes), width: canvas.width, height: canvas.height }; });
}

async function characterProof(identity, poses, scale, theme) {
  const cellW = canvasSpec.width * scale, cellH = canvasSpec.height * scale;
  const canvas = createCanvas(cellW * 4, cellH * 2); const context = canvas.getContext('2d');
  const background = theme === 'light' ? '#e9e6de' : '#20242a'; const foreground = theme === 'light' ? '#17191c' : '#ffffff';
  context.fillStyle = background; context.fillRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = false;
  const entries = [...views.map((view) => ({ pose: 'stand', view, entry: poses.stand[view] })), ...views.map((view) => ({ pose: 'sit', view, entry: poses.sit[view] }))];
  for (const [index, item] of entries.entries()) {
    const x = index % 4 * cellW, y = Math.floor(index / 4) * cellH;
    context.strokeStyle = theme === 'light' ? '#aaa69d' : '#4e555e'; context.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);
    if (item.entry) {
      const image = await loadImage(resolve(repo, item.entry.file)); context.drawImage(image, x, y, cellW, cellH);
    } else {
      context.strokeStyle = '#c84b4b'; context.lineWidth = Math.max(2, scale); context.beginPath(); context.moveTo(x + cellW * 0.35, y + cellH * 0.35); context.lineTo(x + cellW * 0.65, y + cellH * 0.65); context.moveTo(x + cellW * 0.65, y + cellH * 0.35); context.lineTo(x + cellW * 0.35, y + cellH * 0.65); context.stroke();
    }
    context.fillStyle = foreground; context.font = `${12 * scale}px sans-serif`; context.fillText(`${item.pose} ${item.view}${item.entry ? '' : ' MISSING'}`, x + 4 * scale, y + 16 * scale);
  }
  const directory = batchOutputDirectory(identity), suffix = scale === 1 ? 'native' : '2x'; const name = `${identity}-${suffix}-${theme}.png`; const path = resolve(output, 'proofs', directory, name);
  mkdirSync(resolve(path, '..'), { recursive: true }); const bytes = canvas.toBuffer('image/png'); writeFileSync(path, bytes);
  return { file: `artifacts/character-statics/gs-018-v1/proofs/${directory}/${name}`, sha256: sha(bytes), width: canvas.width, height: canvas.height, layout: '4x2', order: ['stand south', 'stand east', 'stand west', 'stand north', 'sit south', 'sit east', 'sit west', 'sit north'], background: theme };
}

async function seatAnchorOverlayProof(identity, poses) {
  const scale = 2, cellW = 320, cellH = 640, canvas = createCanvas(cellW * 4, cellH), context = canvas.getContext('2d'); context.imageSmoothingEnabled = false;
  for (const [index, view] of views.entries()) {
    const x = index * cellW, entry = poses.sit[view], seatY = entry.anchors.seatContact.y * scale; context.fillStyle = '#20242a'; context.fillRect(x, 0, cellW, cellH);
    const sprite = await loadImage(resolve(repo, entry.file)); context.drawImage(sprite, x, 0, cellW, cellH);
    context.strokeStyle = '#28d7d0'; context.lineWidth = 3; context.beginPath(); context.moveTo(x + 24, seatY); context.lineTo(x + cellW - 24, seatY); context.stroke();
    context.strokeStyle = 'rgba(40,215,208,.65)'; context.lineWidth = 2; context.strokeRect(x + 48, seatY, cellW - 96, 18);
    context.fillStyle = '#ffffff'; context.font = '20px sans-serif'; context.fillText(`${view} seat y=${entry.anchors.seatContact.y.toFixed(2)} src=${entry.anchors.seatContact.sourceY}`, x + 8, 28);
  }
  const directory = batchOutputDirectory(identity), name = `${identity}-seat-anchor-overlay-2x-dark.png`, path = resolve(output, 'proofs', directory, name), bytes = canvas.toBuffer('image/png'); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, bytes);
  return { file: `artifacts/character-statics/gs-018-v1/proofs/${directory}/${name}`, sha256: sha(bytes), width: canvas.width, height: canvas.height, layout: '4x1 seated cardinal chair-plane overlay', background: 'dark' };
}

async function seatSourceCoordinateProof(identity, record) {
  const source = await loadImage(resolve(repo, record.seatedSource.path)), canvas = createCanvas(source.width, source.height), context = canvas.getContext('2d');
  context.fillStyle = '#20242a'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(source, 0, 0); context.font = '16px sans-serif';
  for (let y = 0; y < canvas.height; y += 50) {
    context.strokeStyle = y % 100 === 0 ? 'rgba(255,220,60,.8)' : 'rgba(255,255,255,.35)'; context.lineWidth = y % 100 === 0 ? 2 : 1; context.beginPath(); context.moveTo(0, y + .5); context.lineTo(canvas.width, y + .5); context.stroke();
    if (y % 100 === 0) { context.fillStyle = '#ffe65c'; for (let column = 0; column < 4; column++) context.fillText(String(y), column * canvas.width / 4 + 4, y + 18); }
  }
  const sourceOrder = record.seatedSource.sourceOrder ?? (identity === 'patient.adult.008' ? ['south', 'east', 'north', 'west'] : views);
  const seatContacts = identity.startsWith('founder.') ? authoredFounderSeatContactSourceY[identity] : authoredFinalSeatContactSourceY[identity] ?? authoredSeatContactSourceY[identity];
  for (let column = 0; column <= 4; column++) { context.strokeStyle = '#00d7ff'; context.lineWidth = 2; context.beginPath(); context.moveTo(column * canvas.width / 4 + .5, 0); context.lineTo(column * canvas.width / 4 + .5, canvas.height); context.stroke(); }
  for (const [column, view] of sourceOrder.entries()) { const y = seatContacts[view]; context.strokeStyle = '#ff4fd8'; context.lineWidth = 4; context.beginPath(); context.moveTo(column * canvas.width / 4, y + .5); context.lineTo((column + 1) * canvas.width / 4, y + .5); context.stroke(); context.fillStyle = '#ff8be4'; context.font = 'bold 18px sans-serif'; context.fillText(`${view} authored seat=${y}`, column * canvas.width / 4 + 8, y - 8); }
  const number = Number(identity.split('.').at(-1)), version = record.seatedSource.version ? `v${record.seatedSource.version}` : [10, 12, 14].includes(number) ? 'v2' : 'v1', short = identity.split('.').at(-1);
  const prefix = identity.startsWith('founder.') ? 'founder' : identity.startsWith('patient.') ? 'patient' : identity.replaceAll('.', '-'), name = `${prefix}-${short}-${version}.png`, path = resolve(output, 'proofs', 'seat-source-coordinates', name), bytes = canvas.toBuffer('image/png'); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, bytes);
  const result = { file: `artifacts/character-statics/gs-018-v1/proofs/seat-source-coordinates/${name}`, sha256: sha(bytes), width: canvas.width, height: canvas.height, purpose: 'source-pixel coordinate page with authored pelvis/thigh support-plane measurements' };
  if (record.alternateSeatedSource) {
    const alternate = await loadImage(resolve(repo, record.alternateSeatedSource.path)), alternateCanvas = createCanvas(alternate.width, alternate.height), alternateContext = alternateCanvas.getContext('2d');
    alternateContext.fillStyle = '#20242a'; alternateContext.fillRect(0, 0, alternateCanvas.width, alternateCanvas.height); alternateContext.drawImage(alternate, 0, 0); alternateContext.font = '16px sans-serif';
    for (let y = 0; y < alternateCanvas.height; y += 100) { alternateContext.strokeStyle = 'rgba(255,220,60,.55)'; alternateContext.lineWidth = 1; alternateContext.beginPath(); alternateContext.moveTo(0, y + .5); alternateContext.lineTo(alternateCanvas.width, y + .5); alternateContext.stroke(); alternateContext.fillStyle = '#ffe65c'; alternateContext.fillText(String(y), 4, y + 18); }
    const alternateY = seatContacts[record.alternateSeatedSource.direction]; alternateContext.strokeStyle = '#ff4fd8'; alternateContext.lineWidth = 4; alternateContext.beginPath(); alternateContext.moveTo(0, alternateY + .5); alternateContext.lineTo(alternateCanvas.width, alternateY + .5); alternateContext.stroke(); alternateContext.fillStyle = '#ff8be4'; alternateContext.font = 'bold 18px sans-serif'; alternateContext.fillText(`${record.alternateSeatedSource.direction} authored seat=${alternateY}`, 8, alternateY - 8);
    const alternateName = `${prefix}-${short}-${record.alternateSeatedSource.direction}-alternate-source.png`, alternatePath = resolve(output, 'proofs', 'seat-source-coordinates', alternateName), alternateBytes = alternateCanvas.toBuffer('image/png'); writeFileSync(alternatePath, alternateBytes);
    result.alternateSourceProof = { file: `artifacts/character-statics/gs-018-v1/proofs/seat-source-coordinates/${alternateName}`, sha256: sha(alternateBytes), width: alternateCanvas.width, height: alternateCanvas.height, purpose: 'standalone alternate source coordinate page with authored pelvis/thigh support-plane measurement' };
  }
  return result;
}

const perCharacterProofs = {};
for (const identity of [...firstBatch, ...secondBatch, ...remainingPatientBatch, ...founderBatch, ...finalSevenBatch]) {
  perCharacterProofs[identity] = {};
  for (const theme of ['light', 'dark']) for (const scale of [1, 2]) {
    const key = `${scale === 1 ? 'native' : '2x'}-${theme}`;
    perCharacterProofs[identity][key] = await characterProof(identity, records[identity].poses, scale, theme);
  }
  perCharacterProofs[identity]['seat-anchor-overlay'] = await seatAnchorOverlayProof(identity, records[identity].poses);
  perCharacterProofs[identity]['seat-source-coordinates'] = await seatSourceCoordinateProof(identity, records[identity]);
}

async function clipboardCandidateProof(identity, entry) {
  const scale = 2, cellW = canvasSpec.width * scale, cellH = canvasSpec.height * scale;
  const canvas = createCanvas(cellW * 2, cellH), context = canvas.getContext('2d'); context.imageSmoothingEnabled = false;
  const sprite = await loadImage(resolve(repo, entry.file));
  for (const [index, theme] of ['light', 'dark'].entries()) {
    context.fillStyle = theme === 'light' ? '#e9e6de' : '#20242a'; context.fillRect(index * cellW, 0, cellW, cellH);
    context.drawImage(sprite, index * cellW, 0, cellW, cellH); context.fillStyle = theme === 'light' ? '#17191c' : '#ffffff'; context.font = '24px sans-serif';
    context.fillText(`Founder ${identity.split('.').at(-1)} — South`, index * cellW + 8, 32);
  }
  const name = `${identity}-clipboard-candidate-2x-light-dark.png`, path = resolve(output, 'proofs', 'founder-clipboard-candidates', name), bytes = canvas.toBuffer('image/png'); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, bytes);
  return { file: `artifacts/character-statics/gs-018-v1/proofs/founder-clipboard-candidates/${name}`, sha256: sha(bytes), width: canvas.width, height: canvas.height, status: records[identity].clipboard.status, layout: '2x1 light/dark' };
}
const clipboardCandidateProofs = {};
for (const identity of founderBatch) clipboardCandidateProofs[identity] = await clipboardCandidateProof(identity, records[identity].clipboard.candidate);
const clipboardApprovedSnapshotPath = 'tools/character-mapping/gs-018-statics-v1/clipboard-approved-30.json', clipboardApprovedHashes = JSON.parse(file(clipboardApprovedSnapshotPath));
for (const [identity, reviewedHash] of Object.entries(clipboardApprovedHashes)) if (records[identity].clipboard.candidate.sha256 !== reviewedHash) throw Error(`owner-approved clipboard candidate drift: ${identity}`);
const clipboardCandidateReviewSnapshotPath = 'tools/character-mapping/gs-018-statics-v1/clipboard-candidate-30-pending-review.json', priorClipboardCandidateHashes = JSON.parse(file(clipboardCandidateReviewSnapshotPath));
if (records['founder.18'].clipboard.candidate.sha256 === priorClipboardCandidateHashes['founder.18']) throw Error('Founder 18 owner-authorized clipboard scale adjustment did not change the candidate');
const clipboardCandidateReviewSnapshot = { path: clipboardApprovedSnapshotPath, sha256: sourceHash(clipboardApprovedSnapshotPath), candidateCount: Object.keys(clipboardApprovedHashes).length, status: 'owner-visual-approved', policy: 'all 30 owner-approved candidate pose hashes are durable; Founder 18 includes the owner-directed and parent-verified uniform scale adjustment', founder18PriorCandidate: { path: clipboardCandidateReviewSnapshotPath, snapshotSha256: sourceHash(clipboardCandidateReviewSnapshotPath), sha256: priorClipboardCandidateHashes['founder.18'], status: 'owner-reviewed-superseded-by-owner-directed-scale-adjustment' } };
const founder18ClipboardComparison = { native: await proof([17, 18, 19].map((n) => ({ identity: founderId(n), pose: 'clipboard south', label: `Founder ${String(n).padStart(2, '0')} — ${records[founderId(n)].clipboard.candidate.visibleBounds.height}px`, file: records[founderId(n)].clipboard.candidate.file })), 1, 'founder-18-clipboard-peer-comparison-native.png'), enlarged: await proof([17, 18, 19].map((n) => ({ identity: founderId(n), pose: 'clipboard south', label: `Founder ${String(n).padStart(2, '0')} — ${records[founderId(n)].clipboard.candidate.visibleBounds.height}px`, file: records[founderId(n)].clipboard.candidate.file })), 2, 'founder-18-clipboard-peer-comparison-2x.png') };

async function extractionComparisonProof() {
  const identity = 'patient.adult.002', entry = records[identity].poses.stand.south, source = await loadImage(resolve(repo, records[identity].source.path));
  const crop = entry.source.crop, raw = createCanvas(crop.width, crop.height); raw.getContext('2d').drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  const legacy = createCanvas(crop.width, crop.height); legacy.getContext('2d').drawImage(raw, 0, 0); clearExteriorNeutral(legacy); largestComponent(legacy);
  const refined = await loadImage(resolve(repo, entry.file)); const canvas = createCanvas(160 * 3, 320); const context = canvas.getContext('2d'); context.imageSmoothingEnabled = false;
  const panels = [{ label: 'raw source crop', canvas: raw, transform: entry.matrix }, { label: 'legacy neutral flood', canvas: legacy, transform: entry.matrix }, { label: 'refined imported alpha', canvas: refined, transform: null }];
  for (const [index, panel] of panels.entries()) {
    const x = index * 160; context.fillStyle = '#20242a'; context.fillRect(x, 0, 160, 320); context.save();
    if (panel.transform) { const m = panel.transform; context.setTransform(m.a, 0, 0, m.d, x + m.e, m.f); context.drawImage(panel.canvas, 0, 0); }
    else context.drawImage(panel.canvas, x, 0);
    context.restore(); context.fillStyle = '#ffffff'; context.font = '11px sans-serif'; context.fillText(panel.label, x + 4, 16);
  }
  const path = resolve(output, 'proofs', 'patient002-source-extraction-dark-comparison.png'); const bytes = canvas.toBuffer('image/png'); writeFileSync(path, bytes);
  return { file: 'artifacts/character-statics/gs-018-v1/proofs/patient002-source-extraction-dark-comparison.png', sha256: sha(bytes), width: 480, height: 320, purpose: 'raw source vs legacy extraction vs refined boundary-only neutral fringe removal; source RGB is never rewritten' };
}
const extractionProof = await extractionComparisonProof();

const retainedRoster = JSON.parse(file('artifacts/character-movement/retained-roster/retained-roster.json'));
const referenceIdsByHash = { '038fac252afb2f6276e82380102d0685b069086800adb5a3f100c3bf2ec6ed3f': 'retained.reference.038fac25', '1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4': 'retained.gray-braid', '54c78cba8df7a02bf508d79a38f23e07284c764a1f607b6ce0358aa20b39517e': 'retained.reference.54c78cba', '6ee809492fc0dcbb82c3319e3c4f2c66bcec509aa779b35f66dec8601ac272e5': 'retained.reference.6ee80949' };
const referenceBoardHash = '93f978c57ab340e0c0207e61a04aa615696ef09cb2d5aa82e4777d331fe68e82';
const peopleAudit = retainedRoster.retainedSources.map((entry) => ({ path: entry.file, sha256: entry.sourceSha256, classification: entry.stableId ? 'exact-patient-hash-join' : entry.sourceSha256 === referenceBoardHash ? 'reference-board-provenance-excluded' : 'retained-reference-only-record', stableId: entry.stableId ?? referenceIdsByHash[entry.sourceSha256] ?? null }));
const categoryCounts = Object.values(records).reduce((counts, record) => { counts[record.kind] = (counts[record.kind] ?? 0) + 1; return counts; }, {});
const clipboardCropAuditData = { method: 'per-founder source-pixel rectangles from read-only full-sheet body-bound audit; right and bottom are exclusive', reviewedCoverage: 30, auditedOverrides: Object.fromEntries(Object.entries(auditedFounderClipboardCrops).map(([identity, [x, y, width, height]]) => [identity, { x, y, width, height }])), nominalCropConfirmedComplete: ['founder.26', 'founder.30'] };
const clipboardCropAuditBytes = Buffer.from(`${JSON.stringify(clipboardCropAuditData, null, 2)}\n`); writeFileSync(resolve(output, 'clipboard-source-crop-audit.json'), clipboardCropAuditBytes);
const clipboardSourceCropAudit = { file: 'artifacts/character-statics/gs-018-v1/clipboard-source-crop-audit.json', sha256: sha(clipboardCropAuditBytes), ...clipboardCropAuditData };
const clipboardReviewHtml = `<!doctype html><meta charset="utf-8"><title>Founder clipboard candidates — all 30 owner approved</title><style>body{margin:24px;background:#15181c;color:#f5f5f5;font:16px system-ui}h1{font-size:24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(660px,1fr));gap:18px}figure{margin:0;padding:10px;background:#252a30;border-radius:8px}img{display:block;width:640px;max-width:100%;height:auto}figcaption{margin:0 0 8px;font-weight:700}</style><h1>Founder clipboard candidates — all 30 owner approved</h1><div class="grid">${founderBatch.map((identity) => `<figure><figcaption>${identity.replace('founder.', 'Founder ')} — owner approved</figcaption><img src="proofs/founder-clipboard-candidates/${identity}-clipboard-candidate-2x-light-dark.png" alt="${identity} clipboard candidate on light and dark backgrounds"></figure>`).join('')}</div>`;
const clipboardReviewBytes = Buffer.from(`${clipboardReviewHtml}\n`); writeFileSync(resolve(output, 'founder-clipboard-review.html'), clipboardReviewBytes);
const clipboardReviewPacket = { file: 'artifacts/character-statics/gs-018-v1/founder-clipboard-review.html', sha256: sha(clipboardReviewBytes), status: 'owner-visual-approved', candidates: founderBatch.length, ownerApprovedCandidates: 30, founder18ClipboardComparison };
const approvedBaselineSnapshotPath = 'tools/character-mapping/gs-018-statics-v1/approved-baseline-448.json', approvedBaselineHashes = JSON.parse(file(approvedBaselineSnapshotPath));
for (const [key, approvedHash] of Object.entries(approvedBaselineHashes)) {
  const [identity, pose, view] = key.split('/'), currentHash = records[identity]?.poses?.[pose]?.[view]?.sha256;
  if (currentHash !== approvedHash) throw Error(`approved baseline drift: ${key} expected ${approvedHash} got ${currentHash}`);
}
const approvedBaselineSnapshot = { path: approvedBaselineSnapshotPath, sha256: sourceHash(approvedBaselineSnapshotPath), approvedPoseCount: Object.keys(approvedBaselineHashes).length, policy: 'durable reviewed hash snapshot; builder fails on drift and never expands approval automatically' };
const approvedBaseline648SnapshotPath = 'tools/character-mapping/gs-018-statics-v1/approved-baseline-648.json', approvedBaseline648Hashes = JSON.parse(file(approvedBaseline648SnapshotPath));
for (const [key, approvedHash] of Object.entries(approvedBaseline648Hashes)) {
  const [identity, pose, view] = key.split('/'), currentHash = records[identity]?.poses?.[pose]?.[view]?.sha256;
  if (currentHash !== approvedHash) throw Error(`approved 648-baseline drift: ${key} expected ${approvedHash} got ${currentHash}`);
}
const approvedBaseline648Snapshot = { path: approvedBaseline648SnapshotPath, sha256: sourceHash(approvedBaseline648SnapshotPath), approvedPoseCount: Object.keys(approvedBaseline648Hashes).length, status: 'parent-visual-approved', policy: 'durable reviewed hash snapshot for all approved patient, inherited, and founder baselines; final seven excluded until explicit parent acceptance' };
const approvedBaseline704SnapshotPath = 'tools/character-mapping/gs-018-statics-v1/approved-baseline-704.json', approvedBaseline704Hashes = JSON.parse(file(approvedBaseline704SnapshotPath));
for (const [key, approvedHash] of Object.entries(approvedBaseline704Hashes)) {
  const [identity, pose, view] = key.split('/'), currentHash = records[identity]?.poses?.[pose]?.[view]?.sha256;
  if (currentHash !== approvedHash) throw Error(`approved 704-baseline drift: ${key} expected ${approvedHash} got ${currentHash}`);
}
const approvedBaseline704Snapshot = { path: approvedBaseline704SnapshotPath, sha256: sourceHash(approvedBaseline704SnapshotPath), approvedPoseCount: Object.keys(approvedBaseline704Hashes).length, status: 'parent-visual-approved', policy: 'durable reviewed hash snapshot for all 88 identities and every required standing/seated cardinal slot; local static art only' };
const approvedRemainingPatientsSnapshotPath = 'tools/character-mapping/gs-018-statics-v1/approved-patients-remaining19-152.json', approvedRemainingPatientsHashes = JSON.parse(file(approvedRemainingPatientsSnapshotPath));
for (const [key, approvedHash] of Object.entries(approvedRemainingPatientsHashes)) {
  const [identity, pose, view] = key.split('/'), currentHash = records[identity]?.poses?.[pose]?.[view]?.sha256;
  if (currentHash !== approvedHash) throw Error(`approved remaining-patient baseline drift: ${key} expected ${approvedHash} got ${currentHash}`);
}
const approvedRemainingPatientsSnapshot = { path: approvedRemainingPatientsSnapshotPath, sha256: sourceHash(approvedRemainingPatientsSnapshotPath), approvedIdentityCount: 19, approvedPoseCount: Object.keys(approvedRemainingPatientsHashes).length, policy: 'durable pre-correction pose snapshot for the 19 parent-approved unchanged-source patient sets; builder fails on drift' };
const founderApprovalLedgerData = { status: 'parent-visual-approved', scope: '30 founder baseline sets; standing and seated South/East/West/North only; clipboard candidates excluded', approvedPoseCount: 240, sourceSnapshot: approvedBaselineSnapshot, poseHashes: Object.fromEntries(founderBatch.map((identity) => [identity, Object.fromEntries(['stand', 'sit'].flatMap((pose) => views.map((view) => [`${pose}.${view}`, approvedBaselineHashes[`${identity}/${pose}/${view}`]])))])) };
const founderApprovalLedgerBytes = Buffer.from(`${JSON.stringify(founderApprovalLedgerData, null, 2)}\n`); writeFileSync(resolve(output, 'founder-baseline-approval-ledger.json'), founderApprovalLedgerBytes);
const founderBaselineApproval = { file: 'artifacts/character-statics/gs-018-v1/founder-baseline-approval-ledger.json', sha256: sha(founderApprovalLedgerBytes), ...founderApprovalLedgerData };
const manifest = {
  schemaVersion: 'gs-018-statics/v1', canvas: canvasSpec,
  requiredBaseline: { standingDirections: views, seatedDirections: views, eastWestRequirement: 'exact full 90-degree profiles; three-quarter views do not satisfy East or West' },
  sourceContracts: { patients: { grid: '6x3', row0: { south: 0, east: 1, west: 2, north: 3, seatedSouth: 4, seatedThreeQuarterReferenceOnly: 5 }, extraction: 'exterior-connected near-neutral removal then largest opaque component' }, founders: { grid: '7x3', source: 'v3 pose sheets' }, foundation: { manifest: { path: foundationManifestPath, sha256: sourceHash(foundationManifestPath) }, standalonePoseManifest: { path: foundationPoseManifestPath, sha256: sourceHash(foundationPoseManifestPath) } } },
  identityInventory: { total: Object.keys(records).length, canonicalPatients: 50, verifiedFounders: 30, unmatchedRetainedReferences: 4, foundationVisualIds: 4, categoryCounts },
  deduplication: { method: 'exact source SHA-256 joins plus visual/provenance review; revisions, view sheets, atlases, proofs, motion outputs and multi-subject reference boards do not create identities', canonicalCohorts: [{ count: 50, evidence: 'patients-v1 manifest and retained-roster exact hash joins' }, { count: 30, evidence: 'founders-v4 manifest; v1/v2/v4 are revisions of the same founder IDs' }, { count: 4, evidence: 'visually distinct unmatched retained source sheets, each retained as a stable reference-only production record' }, { count: 4, evidence: 'production-foundation-v2 established stable visual IDs; distinct from the 50-patient and 30-founder manifests' }], excludedReferenceBoards: [{ sourceSha256: referenceBoardHash, subjectCount: 7, reason: 'documented style-guide montage, not one identity and not seven approved runtime identities' }] },
  exclusions: { revisionsAndViewSheets: ['apps/player/public/art/characters/v1', 'apps/player/public/art/characters/v2', 'apps/player/public/art/characters/v3', 'generated_images/founder-character-mockups-v1', 'generated_images/founder-character-mockups-v2', 'generated_images/founder-character-mockups-v4', 'artifacts/character-movement'], referenceBoards: peopleAudit.filter((entry) => entry.classification === 'reference-board-provenance-excluded').map(({ path, sha256 }) => ({ path, sha256, reason: 'seven-subject style-guide board retained as provenance; excluded from identity and required-pose counts' })), reason: 'revision/view/atlas/proof/motion provenance and multi-subject reference boards do not create identities' },
  sourceIdentityAudit: { directory: peopleRoot, totalExecPngs: peopleAudit.length, exactPatientHashJoins: peopleAudit.filter((entry) => entry.classification === 'exact-patient-hash-join').length, unmatchedReferences: peopleAudit.filter((entry) => entry.classification === 'retained-reference-only-record').length, referenceBoardsExcluded: peopleAudit.filter((entry) => entry.classification === 'reference-board-provenance-excluded').length, entries: peopleAudit }, clipboardSourceCropAudit, clipboardReviewPacket, clipboardCandidateReviewSnapshot, approvedBaselineSnapshot, approvedBaseline648Snapshot, approvedBaseline704Snapshot, approvedRemainingPatientsSnapshot, founderBaselineApproval,
  candidateAudit: { patient004West: { decision: 'v2-parent-accepted-scaled-proof', reason: 'v1 alpha is clean but its small head, narrow body and long legs were rejected; parent accepted v2 source-matched three-head body proportion and alpha in the rebuilt scaled proof', importedSource: { path: 'tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v2.png', sha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v2.png') }, rejectedSource: { path: 'tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v1.png', sha256: sourceHash('tools/character-mapping/gs-018-statics-v1/assets/patient-004-west-v1.png'), status: 'rejected-proportions-clean-alpha' }, candidates: [{ path: 'C:/Users/Kyle Kent/.codex/generated_images/01a0b014-c58a-7332-9c2d-fdc8a78b4eee/exec-0f406f4e-ac40-48ce-975e-5f9c5d6a5a5b.png', sha256: '293478d6962caa54ec50d81de823073bf81ff429dd8ad05399396983773e4ca6', alpha: { zero: 1315889, partial: 256975, opaque: 0, nonzeroBounds: [65, 37, 961, 1493], greaterThanOneBounds: [351, 178, 693, 1374] } }, { path: 'C:/Users/Kyle Kent/.codex/generated_images/01a0b014-c58a-7332-9c2d-fdc8a78b4eee/exec-016f5674-5ca9-4330-a3c6-b40d505e2ef3.png', sha256: '11dd194d7f16ab5059cebad1558f99f30e2215f40c2a00585e08b69b8beedfdd', alpha: { zero: 1319124, partial: 253740, opaque: 0, nonzeroBounds: [65, 37, 937, 1495], greaterThanOneBounds: [351, 178, 695, 1373] } }] } },
  records, firstBatch, secondBatch, remainingPatientBatch, founderBatch, finalSevenBatch,
  proofs: { aggregate: { native: await proof(proofEntries.filter((entry) => firstBatch.includes(entry.identity)), 1, 'patients-001-010-native.png'), enlarged: await proof(proofEntries.filter((entry) => firstBatch.includes(entry.identity)), 2, 'patients-001-010-enlarged.png'), secondBatchNative: await proof(proofEntries.filter((entry) => secondBatch.includes(entry.identity)), 1, 'patients-011-020-native.png'), secondBatchEnlarged: await proof(proofEntries.filter((entry) => secondBatch.includes(entry.identity)), 2, 'patients-011-020-enlarged.png'), remainingPatientsNative: await proof(proofEntries.filter((entry) => remainingPatientBatch.includes(entry.identity)), 1, 'patients-021-050-native.png'), remainingPatientsEnlarged: await proof(proofEntries.filter((entry) => remainingPatientBatch.includes(entry.identity)), 2, 'patients-021-050-enlarged.png'), foundersNative: await proof(founderProofEntries, 1, 'founders-01-30-native.png'), foundersEnlarged: await proof(founderProofEntries, 2, 'founders-01-30-enlarged.png'), finalSevenNative: await proof(finalSevenProofEntries, 1, 'final-seven-native.png'), finalSevenEnlarged: await proof(finalSevenProofEntries, 2, 'final-seven-enlarged.png'), clipboardCandidatesNative: await proof(clipboardProofEntries, 1, 'founder-clipboard-candidates-native.png'), clipboardCandidatesEnlarged: await proof(clipboardProofEntries, 2, 'founder-clipboard-candidates-enlarged.png') }, perCharacter: perCharacterProofs, clipboardCandidates: clipboardCandidateProofs, extraction: extractionProof },
  integration: { status: 'not-deployed', authorization: 'none' },
};
writeFileSync(resolve(output, 'coverage-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', identities: Object.keys(records).length, firstBatch, secondBatch, remainingPatientBatch, founderBatch, importedPatientPoses: proofEntries.length, importedFounderPoses: founderProofEntries.length, clipboardCandidates: clipboardProofEntries.length, peopleAudit: manifest.sourceIdentityAudit, proofs: manifest.proofs }));
