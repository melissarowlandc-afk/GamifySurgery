import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const artifactRoot = resolve(repo, 'artifacts/character-movement/reauthored-pilot');
const beforeRoot = resolve(artifactRoot, 'correction-review/refinement-before');
const afterRoot = resolve(artifactRoot, 'olive-first-checkpoint');
const outputRoot = resolve(artifactRoot, 'correction-review');
mkdirSync(outputRoot, { recursive: true });

const columns = [
  ['East neutral', 'east-neutral'], ['East 01', 'east-01'], ['East 03', 'east-03'],
  ['West neutral', 'west-neutral'], ['West 01', 'west-01'], ['West 03', 'west-03'],
  ['South neutral', 'south-neutral'],
];
const canvas = createCanvas(columns.length * 240, 1320);
const context = canvas.getContext('2d');
context.fillStyle = '#17191d';
context.fillRect(0, 0, canvas.width, canvas.height);
context.font = 'bold 15px sans-serif';

for (const [characterIndex, character] of ['olive', 'gray'].entries()) {
  for (const [versionIndex, version] of ['Before', 'After'].entries()) {
    const row = characterIndex * 2 + versionIndex;
    for (const [column, [label, suffix]] of columns.entries()) {
      const x = column * 240;
      const y = row * 330;
      const root = version === 'Before' ? beforeRoot : afterRoot;
      const relative = version === 'Before' || suffix.endsWith('neutral') ? `${character}-${suffix}.png` : `frames/${character}-${suffix}.png`;
      const image = await loadImage(resolve(root, relative));
      context.fillStyle = '#f0eee8';
      context.fillRect(x, y + 20, 240, 310);
      context.drawImage(image, x, y + 20);
      context.fillStyle = '#fff';
      context.fillText(`${character === 'olive' ? 'Olive' : 'Gray'} · ${version} · ${label}`, x + 6, y + 16);
    }
  }
}

const file = resolve(outputRoot, 'two-character-directional-refinement-checkpoint.png');
writeFileSync(file, canvas.toBuffer('image/png'));
console.log(file);
