import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const checkpointRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/checkpoint');
const reviewRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/review');
const batch = JSON.parse(readFileSync(resolve(import.meta.dirname, 'characters.json'), 'utf8'));
const requestedSlug = process.argv[2] ?? 'cardigan';
const character = Object.values(batch.characters).find(candidate => candidate.slug === requestedSlug);
if (!character) throw new Error(`unknown batch-02 character slug: ${requestedSlug}`);

mkdirSync(reviewRoot, { recursive: true });
const directions = (process.argv[3] ?? 'south,east,north,west').split(',');
const canvas = createCanvas(960, directions.length * 330), context = canvas.getContext('2d');
context.fillStyle = '#17191d';
context.fillRect(0, 0, canvas.width, canvas.height);
context.font = 'bold 15px sans-serif';
const original = await loadImage(resolve(repositoryRoot, character.original.path));
const sourceColumnX = { south: 50, east: 300, west: 550, north: 800 };
for (const [row, direction] of directions.entries()) {
  const y = row * 330;
  const cells = [
    { label: `${direction} · approved original`, image: original, source: [sourceColumnX[direction], 20, 240, 310] },
    { label: `${direction} · fitted neutral`, path: `${requestedSlug}-${direction}-neutral.png` },
    { label: `${direction} · phase 01`, path: `${requestedSlug}-${direction}01.png` },
    { label: `${direction} · phase 03`, path: `${requestedSlug}-${direction}03.png` },
  ];
  for (const [column, cell] of cells.entries()) {
    const x = column * 240;
    context.fillStyle = '#eeece6';
    context.fillRect(x, y + 20, 240, 310);
    if (cell.source) context.drawImage(cell.image, ...cell.source, x, y + 20, 240, 310);
    else context.drawImage(await loadImage(resolve(checkpointRoot, cell.path)), x, y + 20);
    context.fillStyle = '#fff';
    context.fillText(cell.label, x + 7, y + 17);
  }
}
const output = resolve(reviewRoot, `${requestedSlug}-all-view-neutral-01-03-review.png`);
writeFileSync(output, canvas.toBuffer('image/png'));
console.log(output);
