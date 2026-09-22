import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const sourceName = process.argv[3] ?? 'olive';
const sourcePath = resolve(repositoryRoot, `artifacts/character-movement/reauthored-pilot/sources/${sourceName}-rig-ready-v1.png`);
const outputRoot = resolve(repositoryRoot, 'artifacts/character-movement/reauthored-pilot/olive-first-checkpoint');
mkdirSync(outputRoot, { recursive: true });
const source = await loadImage(sourcePath), scale = 3, cell = 256, selectedRow = Number(process.argv[2] ?? 1), viewLabel = ['south', 'east', 'north', 'west'][selectedRow];
const selections = [
  [`${viewLabel}-reference`, 0, selectedRow], [`${viewLabel}-body`, 1, selectedRow], [`${viewLabel}-left-arm`, 2, selectedRow], [`${viewLabel}-right-arm`, 3, selectedRow], [`${viewLabel}-left-leg`, 4, selectedRow], [`${viewLabel}-right-leg`, 5, selectedRow],
];
const canvas = createCanvas(cell * scale * 3, cell * scale * 2), context = canvas.getContext('2d');
context.fillStyle = '#17191d'; context.fillRect(0, 0, canvas.width, canvas.height);
for (let index = 0; index < selections.length; index += 1) {
  const [label, column, row] = selections[index], offsetX = index % 3 * cell * scale, offsetY = Math.floor(index / 3) * cell * scale;
  context.imageSmoothingEnabled = false;
  context.drawImage(source, column * cell, row * cell, cell, cell, offsetX, offsetY, cell * scale, cell * scale);
  context.strokeStyle = 'rgba(0,0,0,.35)'; context.fillStyle = '#fff'; context.font = '18px monospace';
  for (let value = 0; value <= cell; value += 10) {
    context.beginPath(); context.moveTo(offsetX + value * scale, offsetY); context.lineTo(offsetX + value * scale, offsetY + cell * scale); context.stroke();
    context.beginPath(); context.moveTo(offsetX, offsetY + value * scale); context.lineTo(offsetX + cell * scale, offsetY + value * scale); context.stroke();
    if (value % 20 === 0) { context.fillText(String(value), offsetX + value * scale + 2, offsetY + 18); context.fillText(String(value), offsetX + 2, offsetY + value * scale + 18); }
  }
  context.fillStyle = '#fff'; context.font = 'bold 22px sans-serif'; context.fillText(label, offsetX + 8, offsetY + cell * scale - 10);
}
writeFileSync(resolve(outputRoot, `${sourceName}-${viewLabel}-measurement-grid.png`), canvas.toBuffer('image/png'));
console.log(resolve(outputRoot, `${sourceName}-${viewLabel}-measurement-grid.png`));
