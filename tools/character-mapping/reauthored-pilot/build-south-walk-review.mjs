import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const source = resolve(repo, 'artifacts/character-movement/reauthored-pilot/olive-first-checkpoint');
const output = resolve(repo, 'artifacts/character-movement/reauthored-pilot/correction-review');
mkdirSync(output, { recursive: true });

const columns = [['South 01', 'south-01'], ['South 03', 'south-03'], ['South neutral', 'south-neutral']];
const canvas = createCanvas(720, 660);
const context = canvas.getContext('2d');
context.fillStyle = '#17191d';
context.fillRect(0, 0, canvas.width, canvas.height);
context.font = 'bold 16px sans-serif';

for (const [row, character] of ['olive', 'gray'].entries()) {
  for (const [column, [label, suffix]] of columns.entries()) {
    const x = column * 240;
    const y = row * 330;
    const relative = suffix === 'south-neutral' ? `${character}-${suffix}.png` : `frames/${character}-${suffix}.png`;
    const image = await loadImage(resolve(source, relative));
    context.fillStyle = '#f0eee8';
    context.fillRect(x, y + 20, 240, 310);
    context.drawImage(image, x, y + 20);
    context.fillStyle = '#fff';
    context.fillText(`${character === 'olive' ? 'Olive' : 'Gray'} · ${label}`, x + 7, y + 16);
  }
}

const file = resolve(output, 'two-character-south-walk-offset-checkpoint.png');
writeFileSync(file, canvas.toBuffer('image/png'));
console.log(file);
