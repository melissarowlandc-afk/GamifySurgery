import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = path.resolve(import.meta.dirname, '../../..');
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/donor-analysis-v1');
mkdirSync(outputRoot, { recursive: true });
const sha = (value) => createHash('sha256').update(value).digest('hex');
const sources = {
  south: 'tools/character-mapping/gs019-blue-directions/south-whole-body-v1-source.png',
  north: 'tools/character-mapping/gs019-blue-directions/north-whole-body-v1-source.png',
};

const isShoe = (r, g, b, a) => a >= 160 && r >= 55 && r <= 180 && g >= 28 && g <= 125 && b <= 90 && r >= g + 15 && g >= b + 8;
function shoeComponents(cell) {
  const { width, height } = cell, data = cell.getContext('2d').getImageData(0, 0, width, height).data, hit = new Uint8Array(width * height), seen = new Uint8Array(hit.length), components = [];
  for (let y = Math.floor(height * .55); y < height; y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (isShoe(data[i], data[i + 1], data[i + 2], data[i + 3])) hit[y * width + x] = 1; }
  for (let seed = 0; seed < hit.length; seed++) {
    if (!hit[seed] || seen[seed]) continue;
    const stack = [seed]; seen[seed] = 1; let pixels = 0, left = width, top = height, right = -1, bottom = -1;
    while (stack.length) { const n = stack.pop(), x = n % width, y = Math.floor(n / width); pixels++; left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); for (const next of [x ? n - 1 : -1, x + 1 < width ? n + 1 : -1, y ? n - width : -1, y + 1 < height ? n + width : -1]) if (next >= 0 && hit[next] && !seen[next]) { seen[next] = 1; stack.push(next); } }
    if (pixels >= 25) components.push({ pixels, left, top, right, bottom, width: right - left + 1, height: bottom - top + 1, centerX: (left + right) / 2 });
  }
  return components.sort((a, b) => b.pixels - a.pixels).slice(0, 2).sort((a, b) => a.centerX - b.centerX);
}

const report = { schemaVersion: 'gs019-blue-directions/donor-cell-analysis-v1', coordinateConvention: 'screen-left/screen-right within each 384x512 cell; bottom is larger y', directions: {} };
for (const direction of ['south', 'north']) {
  const sourceBytes = readFileSync(path.join(repo, sources[direction])), source = await loadImage(path.join(repo, sources[direction]));
  const annotated = createCanvas(source.width, source.height), context = annotated.getContext('2d'); context.drawImage(source, 0, 0); context.font = 'bold 16px sans-serif'; context.textBaseline = 'top'; context.lineWidth = 3;
  const cells = {};
  for (let index = 0; index < 8; index++) {
    const cellX = (index % 4) * 384, cellY = Math.floor(index / 4) * 512, cell = createCanvas(384, 512); cell.getContext('2d').drawImage(source, cellX, cellY, 384, 512, 0, 0, 384, 512);
    const components = shoeComponents(cell), left = components[0] ?? null, right = components[1] ?? null;
    const lowerSide = left && right ? left.bottom > right.bottom ? 'screen-left' : right.bottom > left.bottom ? 'screen-right' : 'even' : 'unresolved';
    const bottomDelta = left && right ? left.bottom - right.bottom : null;
    cells[String(index + 1).padStart(2, '0')] = { screenLeftShoe: left, screenRightShoe: right, lowerSide, bottomDeltaLeftMinusRight: bottomDelta };
    context.fillStyle = 'rgba(0,0,0,.78)'; context.fillRect(cellX + 4, cellY + 4, 376, 44); context.fillStyle = '#fff'; context.fillText(`cell${String(index + 1).padStart(2, '0')} lower:${lowerSide.replace('screen-', '')}`, cellX + 10, cellY + 8);
    for (const [side, box, color] of [['L', left, '#00e5ff'], ['R', right, '#ff4fd8']]) if (box) { context.strokeStyle = color; context.strokeRect(cellX + box.left, cellY + box.top, box.width, box.height); context.fillStyle = color; context.fillText(`${side} b${box.bottom} ${box.width}x${box.height}`, cellX + box.left, cellY + Math.max(52, box.top - 20)); }
  }
  const bytes = annotated.toBuffer('image/png'), file = `${direction}-donor-cells-shoe-bounds.png`; writeFileSync(path.join(outputRoot, file), bytes);
  report.directions[direction] = { source: { file: sources[direction], sha256: sha(sourceBytes) }, cells, annotatedProof: { file, sha256: sha(bytes), width: annotated.width, height: annotated.height } };
}

report.proposedPhaseMap = {
  south: {
    status: 'provisional pending corrected-proportion donor',
    phases: { '01': 'cell05', '02': 'cell06', '03': 'cell07', '04': 'cell04', '05': 'cell01', '06': 'horizontal-mirror body cell06', '07': 'horizontal-mirror body cell07', '08': 'horizontal-mirror body cell04' },
    rationale: 'cell05/cell01 provide opposite contacts; cell04 supplies the opposite approaching-contact side missing from cell08; mirrored body cells restore the opposite half while the exact unmirrored South identity head is composited afterward',
    limitation: 'source-v1 body is broader/shorter than the approved static and remains rejected; full phase fidelity must be checked on replacement donor',
  },
  north: {
    status: 'blocked on complete-body passing replacements',
    provisionalPhases: { '01': 'cell05', '02': 'cell06', '03': 'replacement required', '04': 'cell04', '05': 'cell01', '06': 'horizontal-mirror body cell06', '07': 'horizontal-mirror of phase03 replacement', '08': 'horizontal-mirror body cell04' },
    rationale: 'cell05/cell01 provide opposite contacts and cell04 supplies approaching contact; no source cell cleanly shows a foot passing close beside the planted ankle, so cells03/07 are not accepted as passing poses',
  },
};
const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`); writeFileSync(path.join(outputRoot, 'donor-cell-analysis.json'), reportBytes); console.log(JSON.stringify({ status: 'PASS', reportSha256: sha(reportBytes), proposedPhaseMap: report.proposedPhaseMap, cells: Object.fromEntries(Object.entries(report.directions).map(([direction, value]) => [direction, value.cells])) }, null, 2));
