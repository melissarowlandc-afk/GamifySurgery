import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { inspectAlpha, keyConnectedBackground } from '../reauthored-pilot/mesh-engine.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['cardigan', 'braid'];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

for (const name of names) {
  const path = resolve(repo, `artifacts/character-movement/reauthored-batch-02/sources/${name}-rig-ready-v1.png`);
  const bytes = readFileSync(path), image = await loadImage(path), canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const keyed = keyConnectedBackground(context.getImageData(0, 0, image.width, image.height), { color: [255, 0, 255], tolerance: 96, magentaDominanceThreshold: 20 });
  const rows = {};
  for (const [row, direction] of ['south', 'east', 'north', 'west'].entries()) {
    rows[direction] = [];
    for (let column = 0; column < 6; column += 1) {
      const cell = { x: column * 256, y: row * 256, width: 256, height: 256 }, alpha = inspectAlpha(keyed.imageData, cell);
      rows[direction].push(alpha.components.map(component => ({ pixelCount: component.pixelCount, bounds: component.bounds })));
    }
  }
  console.log(JSON.stringify({ name, path, sha256: sha(bytes), width: image.width, height: image.height, removedBackgroundPixels: keyed.removedPixelCount, removedMagentaPixels: keyed.defringedPixelCount, rows }, null, 2));
}
