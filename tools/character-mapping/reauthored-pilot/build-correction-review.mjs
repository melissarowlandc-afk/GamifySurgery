import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..'), source = resolve(repo, 'artifacts/character-movement/reauthored-pilot/olive-first-checkpoint'), out = resolve(repo, 'artifacts/character-movement/reauthored-pilot/correction-review');
mkdirSync(out, { recursive: true });
const columns = [['East 01','east-01'],['East 03','east-03'],['West 01','west-01'],['West 03','west-03'],['South neutral','south-neutral'],['North 01','north-01'],['North 03','north-03']];
const canvas = createCanvas(1680, 660), context = canvas.getContext('2d'); context.fillStyle = '#17191d'; context.fillRect(0, 0, canvas.width, canvas.height); context.font = 'bold 16px sans-serif';
for (const [row, slug] of ['olive','gray'].entries()) for (const [column, [label, suffix]] of columns.entries()) {
  const x = column * 240, y = row * 330, file = suffix.includes('neutral') ? `${slug}-${suffix}.png` : `frames/${slug}-${suffix}.png`, image = await loadImage(resolve(source, file));
  context.fillStyle = '#f0eee8'; context.fillRect(x, y + 20, 240, 310); context.drawImage(image, x, y + 20); context.fillStyle = '#fff'; context.fillText(`${slug === 'olive' ? 'Olive' : 'Gray'} · ${label}`, x + 7, y + 16);
}
const path = resolve(out, 'two-character-arm-neck-correction-checkpoint.png'); writeFileSync(path, canvas.toBuffer('image/png')); console.log(path);
