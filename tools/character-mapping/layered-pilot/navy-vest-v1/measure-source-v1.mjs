import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const sourcePath = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-ee82180f-799f-4617-9159-27eefa97f158.png';
const output = resolve(repo, 'artifacts/character-movement/navy-vest-v1');
const views = ['south', 'east', 'west', 'north'];
const cropX = { south: 50, east: 300, west: 550, north: 800 };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

function removeBorderNeutral(canvas) {
  const context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = image, seen = new Uint8Array(canvas.width * canvas.height), queue = [];
  const neutral = p => {
    const i = p * 4, lo = Math.min(data[i], data[i + 1], data[i + 2]), hi = Math.max(data[i], data[i + 1], data[i + 2]);
    return lo >= 230 && hi - lo <= 16;
  };
  const add = p => { if (!seen[p] && neutral(p)) { seen[p] = 1; queue.push(p); } };
  for (let x = 0; x < canvas.width; x++) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y++) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i], x = p % canvas.width, y = Math.floor(p / canvas.width);
    for (const n of [p - 1, p + 1, p - canvas.width, p + canvas.width])
      if (n >= 0 && n < canvas.width * canvas.height && (n !== p - 1 && n !== p + 1 || Math.floor(n / canvas.width) === y)) add(n);
  }
  for (const p of queue) data[p * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
  return queue.length;
}

function alphaBounds(canvas, threshold = 20) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++)
    if (data[(y * canvas.width + x) * 4 + 3] >= threshold) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  return right < 0 ? null : { x: left, y: top, width: right - left + 1, height: bottom - top + 1, right, bottom };
}

const bytes = readFileSync(resolve(repo, sourcePath));
if (sha(bytes) !== '9f843a7297c830ce3263a95a6476f1a953a42fe9fef6b883c9f324fb6e7be4f2') throw Error('Navy Vest original source hash changed.');
const source = await loadImage(resolve(repo, sourcePath));
mkdirSync(output, { recursive: true });
const proof = createCanvas(4 * 720, 990), context = proof.getContext('2d');
context.fillStyle = '#ded8ce'; context.fillRect(0, 0, proof.width, proof.height); context.imageSmoothingEnabled = false;
const report = { source: { path: sourcePath, sha256: sha(bytes), dimensions: [source.width, source.height] }, views: {} };
for (const [index, view] of views.entries()) {
  const crop = createCanvas(240, 330), cropContext = crop.getContext('2d');
  cropContext.drawImage(source, cropX[view], 20, 240, 330, 0, 0, 240, 330);
  const removedBackgroundPixels = removeBorderNeutral(crop), bounds = alphaBounds(crop);
  report.views[view] = { crop: { x: cropX[view], y: 20, width: 240, height: 330 }, removedBackgroundPixels, bounds };
  context.drawImage(crop, index * 720, 0, 720, 990);
  context.fillStyle = '#20242a'; context.fillRect(index * 720, 0, 720, 30); context.fillStyle = '#fff'; context.font = 'bold 20px sans-serif'; context.fillText(view, index * 720 + 8, 22);
}
const upperPath = resolve(import.meta.dirname, 'assets/upper-generated-v1.png');
try {
  const upper = await loadImage(upperPath), upperBytes = readFileSync(upperPath);
  report.upper = { path: 'tools/character-mapping/layered-pilot/navy-vest-v1/assets/upper-generated-v1.png', sha256: sha(upperBytes), dimensions: [upper.width, upper.height], cells: {} };
  const xBound = [0, ...[1, 2, 3].map(i => Math.floor(upper.width * i / 4)), upper.width];
  const yBound = [0, ...[1, 2, 3, 4].map(i => Math.floor(upper.height * i / 5)), upper.height];
  for (let row = 0; row < 5; row++) for (let column = 0; column < 4; column++) {
    const cell = createCanvas(xBound[column + 1] - xBound[column], yBound[row + 1] - yBound[row]), cx = cell.getContext('2d');
    cx.drawImage(upper, xBound[column], yBound[row], cell.width, cell.height, 0, 0, cell.width, cell.height);
    const b = alphaBounds(cell);
    report.upper.cells[`${row}.${column}`] = b ? { x: xBound[column] + b.x, y: yBound[row] + b.y, width: b.width, height: b.height } : null;
  }
} catch {}
writeFileSync(resolve(output, 'source-stands-3x.png'), proof.toBuffer('image/png'));
const walkCells = [[1050,350],[1300,350],[50,680],[300,680]], walkProof = createCanvas(4 * 720, 990), wx = walkProof.getContext('2d');
wx.fillStyle = '#ded8ce'; wx.fillRect(0, 0, walkProof.width, walkProof.height); wx.imageSmoothingEnabled = false;
for (const [index, [sx, sy]] of walkCells.entries()) { const c = createCanvas(240,330), cx = c.getContext('2d'); cx.drawImage(source,sx,sy,240,330,0,0,240,330); removeBorderNeutral(c); wx.drawImage(c,index*720,0,720,990); }
writeFileSync(resolve(output, 'source-profile-walks-3x.png'), walkProof.toBuffer('image/png'));
writeFileSync(resolve(output, 'source-measurements.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', ...report.source, views: report.views }));
