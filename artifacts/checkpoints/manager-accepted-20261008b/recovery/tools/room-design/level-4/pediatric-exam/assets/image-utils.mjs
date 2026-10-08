import fs from 'node:fs';
import crypto from 'node:crypto';
import { createCanvas, loadImage } from '@napi-rs/canvas';
export const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
export async function decode(file) {
  const image = await loadImage(file), canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  return { image, canvas, context, pixels: context.getImageData(0, 0, canvas.width, canvas.height) };
}
export function bounds(data, width, height, threshold = 1) {
  let left = width, top = height, right = -1, bottom = -1, count = 0, edgeAlphaMax = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const a = data[(y * width + x) * 4 + 3];
    if (!x || !y || x === width - 1 || y === height - 1) edgeAlphaMax = Math.max(edgeAlphaMax, a);
    if (a < threshold) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); count++;
  }
  return count ? { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1, pixels: count, edgeAlphaMax } : null;
}
export function alphaStats(data, width, height) {
  let transparent = 0, opaque = 0, min = 255, max = 0;
  for (let i = 3; i < data.length; i += 4) { const a = data[i]; if (!a) transparent++; if (a >= 160) opaque++; min = Math.min(min, a); max = Math.max(max, a); }
  const all = bounds(data, width, height);
  return { transparent, opaque, min, max, edgeAlphaMax: all?.edgeAlphaMax ?? 0 };
}
