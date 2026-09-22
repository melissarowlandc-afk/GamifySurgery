import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { inspectAlpha, keyConnectedBackground } from './mesh-engine.mjs';

const input = process.argv[2];
if (!input) throw new Error('usage: node inspect-atlas.mjs <repo-relative-atlas.png>');
const repositoryRoot = resolve(import.meta.dirname, '../../..'), absolute = resolve(repositoryRoot, input), bytes = readFileSync(absolute), image = await loadImage(absolute);
if (image.width % 6 || image.height % 4) throw new Error('expected a six-column, four-row atlas');
const canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d');
context.drawImage(image, 0, 0);
const keyed = keyConnectedBackground(context.getImageData(0, 0, image.width, image.height), { color: [255, 0, 255], tolerance: 96, magentaDominanceThreshold: 20 });
const cellWidth = image.width / 6, cellHeight = image.height / 4, views = ['south', 'east', 'north', 'west'], columns = ['reference', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
const cells = {};
for (let row = 0; row < 4; row += 1) {
  cells[views[row]] = {};
  for (let column = 0; column < 6; column += 1) {
    const cell = { x: column * cellWidth, y: row * cellHeight, width: cellWidth, height: cellHeight }, alpha = inspectAlpha(keyed.imageData, cell);
    const occupied = alpha.components.reduce((best, component) => {
      const box = component.bounds;
      return { x: Math.min(best.x, box.x), y: Math.min(best.y, box.y), right: Math.max(best.right, box.x + box.width), bottom: Math.max(best.bottom, box.y + box.height) };
    }, { x: Infinity, y: Infinity, right: -Infinity, bottom: -Infinity });
    cells[views[row]][columns[column]] = { cell, occupiedBounds: { x: occupied.x, y: occupied.y, width: occupied.right - occupied.x, height: occupied.bottom - occupied.y }, ...alpha };
  }
}
let residualHotPinkPixels = 0, residualMagentaDominantPixels = 0;
for (let index = 0; index < keyed.imageData.data.length; index += 4) {
  const [red, green, blue, alpha] = keyed.imageData.data.slice(index, index + 4);
  if (alpha && red >= 159 && blue >= 159 && green <= 96) residualHotPinkPixels += 1;
  if (alpha && Math.min(red, blue) - green > 20) residualMagentaDominantPixels += 1;
}
console.log(JSON.stringify({ path: input, sha256: createHash('sha256').update(bytes).digest('hex'), dimensions: { width: image.width, height: image.height }, background: { ...keyed, imageData: undefined, residualHotPinkPixels, residualMagentaDominantPixels }, cells }, null, 2));
