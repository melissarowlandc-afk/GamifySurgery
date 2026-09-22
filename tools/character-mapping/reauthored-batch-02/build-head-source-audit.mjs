import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const batch = JSON.parse(readFileSync(resolve(import.meta.dirname, 'characters.json'), 'utf8'));
const slug = process.argv[2] ?? 'braid';
const character = Object.values(batch.characters).find(candidate => candidate.slug === slug);
if (!character) throw new Error(`unknown batch-02 character slug: ${slug}`);
const source = await loadImage(resolve(repositoryRoot, character.original.path));
const sourceX = { south: 50, east: 300, west: 550, north: 800 };
const canvas = createCanvas(960, 620), context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
for (const [index, direction] of Object.keys(sourceX).entries()) {
  context.fillStyle = '#f000f0'; context.fillRect(index * 240, 0, 240, 620);
  context.drawImage(source, sourceX[direction] + 45, 50, 150, 190, index * 240, 0, 240, 304);
  context.fillStyle = '#fff'; context.font = 'bold 15px sans-serif'; context.fillText(direction, index * 240 + 6, 18);
}
const outputRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-batch-02/review');
mkdirSync(outputRoot, { recursive: true });
const output = resolve(outputRoot, `${slug}-head-source-crops.png`);
writeFileSync(output, canvas.toBuffer('image/png'));
console.log(output);
