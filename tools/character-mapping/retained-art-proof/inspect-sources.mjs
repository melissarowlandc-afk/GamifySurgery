import { loadImage, createCanvas } from '@napi-rs/canvas';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..');
const sources = process.argv.slice(2);

for (const relativePath of sources) {
  const image = await loadImage(resolve(repo, relativePath));
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  let transparent = 0;
  let partial = 0;
  let opaque = 0;
  const colors = new Map();
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] === 0) transparent += 1;
    else if (pixels[index] === 255) opaque += 1;
    else partial += 1;
    const key = `${pixels[index - 3]},${pixels[index - 2]},${pixels[index - 1]}`;
    colors.set(key, (colors.get(key) ?? 0) + 1);
  }
  const commonColors = [...colors].sort((left, right) => right[1] - left[1]).slice(0, 12);
  console.log(JSON.stringify({ relativePath, width: image.width, height: image.height, alpha: { transparent, partial, opaque }, commonColors }));
}
