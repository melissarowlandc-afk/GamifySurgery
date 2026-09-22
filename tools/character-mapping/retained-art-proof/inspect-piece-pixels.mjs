import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const config = JSON.parse(readFileSync(resolve(import.meta.dirname, 'mapping.json')));
const inside = (x, y, polygon) => {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
for (const character of config.characters) {
  const short = character.sourcePath.match(/exec-([^.]+)\.png$/)[1].slice(0, 8);
  const image = await loadImage(resolve(repo, `artifacts/character-movement/retained-art-proof/candidates/${short}-walkEastA.png`));
  const canvas = createCanvas(240, 310), context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, 240, 310).data;
  console.log(short);
  for (const piece of character.pieces.filter(piece => piece.segment === 'shoe')) {
    const rows = new Map();
    for (let y = 0; y < 310; y++) for (let x = 0; x < 240; x++) if (inside(x + .5, y + .5, piece.polygon) && pixels[(y * 240 + x) * 4 + 3]) {
      const span = rows.get(y) ?? [x, x]; span[0] = Math.min(span[0], x); span[1] = Math.max(span[1], x); rows.set(y, span);
    }
    const ys = [...rows.keys()];
    console.log(piece.id, JSON.stringify({ minY: Math.min(...ys), maxY: Math.max(...ys), bottomRows: [...rows].slice(-5) }));
  }
}
