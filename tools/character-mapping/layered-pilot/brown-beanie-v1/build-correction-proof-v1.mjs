import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/brown-beanie-v1');
const [before, after] = await Promise.all([
  loadImage(resolve(output, 'correction-review/before-source-vs-fit-stands.png')),
  loadImage(resolve(output, 'draft-source-vs-fit-stands.png')),
]);
const views = ['South', 'East', 'West', 'North'];
const rows = [
  { label: 'Exact source', image: before, y: 22 },
  { label: 'Before correction', image: before, y: 364 },
  { label: 'After atlas-first correction', image: after, y: 364 },
];
const canvas = createCanvas(1280, rows.length * 342), context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
for (let row = 0; row < rows.length; row++) {
  const item = rows[row], top = row * 342;
  context.fillStyle = '#20242a'; context.fillRect(0, top, 1280, 22);
  context.fillStyle = '#fff'; context.font = 'bold 13px sans-serif';
  for (let col = 0; col < 4; col++) context.fillText(`${item.label} · ${views[col]}`, col * 320 + 5, top + 15);
  context.drawImage(item.image, 0, item.y, 1280, 320, 0, top + 22, 1280, 320);
}
const bytes = canvas.toBuffer('image/png');
const file = resolve(output, 'correction-review/source-before-after-four-stands.png');
writeFileSync(file, bytes);
console.log(JSON.stringify({ file, width: canvas.width, height: canvas.height, sha256: createHash('sha256').update(bytes).digest('hex') }));
