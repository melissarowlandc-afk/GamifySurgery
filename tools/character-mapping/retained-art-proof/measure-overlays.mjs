import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const config = JSON.parse(readFileSync(resolve(import.meta.dirname, 'mapping.json')));
const output = resolve(repo, 'artifacts/character-movement/retained-art-proof/measurement');
mkdirSync(output, { recursive: true });

for (const character of config.characters) {
  const short = character.sourcePath.match(/exec-([^.]+)\.png$/)[1].slice(0, 8);
  const image = await loadImage(resolve(repo, `artifacts/character-movement/retained-art-proof/candidates/${short}-walkEastA.png`));
  const canvas = createCanvas(720, 930), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.fillStyle = '#16181d'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, 720, 930);
  context.scale(3, 3);
  context.lineWidth = 1 / 3;
  for (let x = 0; x <= 240; x += 10) {
    context.strokeStyle = x % 20 ? '#66c6ff55' : '#66c6ff99';
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 310); context.stroke();
    if (x % 20 === 0) { context.fillStyle = '#fff'; context.font = '4px monospace'; context.fillText(String(x), x + 1, 5); }
  }
  for (let y = 0; y <= 310; y += 10) {
    context.strokeStyle = y % 20 ? '#66c6ff55' : '#66c6ff99';
    context.beginPath(); context.moveTo(0, y); context.lineTo(240, y); context.stroke();
    if (y % 20 === 0) { context.fillStyle = '#fff'; context.font = '4px monospace'; context.fillText(String(y), 1, y + 4); }
  }
  for (const piece of character.pieces) {
    context.beginPath(); piece.polygon.forEach((p, i) => i ? context.lineTo(...p) : context.moveTo(...p)); context.closePath();
    context.strokeStyle = piece.side === 'left' ? '#4da3ff' : piece.side === 'right' ? '#ff4d88' : '#ffc14d';
    context.lineWidth = 1;
    context.stroke();
    const [x, y] = piece.polygon[0]; context.fillStyle = context.strokeStyle; context.font = '5px monospace'; context.fillText(piece.id, x, y - 2);
  }
  writeFileSync(resolve(output, `${short}-native-grid-current-polygons.png`), canvas.toBuffer('image/png'));
}
