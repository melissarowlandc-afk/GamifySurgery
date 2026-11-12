import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { measureFigure, encodePng } from './character-proportions.mjs';
import { decodeRgbaPng } from '../character-mapping/staff-gapfill-v6d/rgba-png.mjs';

test('alpha measurements exclude faint fringe, use an exclusive floor and retain crop coordinates', () => {
  const image = { width: 40, height: 80, rgba: Buffer.alloc(40 * 80 * 4) };
  function rect(x, y, w, h, alpha) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) image.rgba[(yy * image.width + xx) * 4 + 3] = alpha; }
  rect(0, 0, 40, 80, 1); rect(15, 10, 10, 20, 255); rect(18, 30, 4, 5, 255); rect(10, 35, 20, 25, 255); rect(13, 60, 5, 15, 255); rect(22, 60, 5, 15, 255);
  const result = measureFigure(image);
  assert.deepEqual({ x: result.x, y: result.y, width: result.width, height: result.height, floor: result.footBaseline }, { x: 10, y: 10, width: 20, height: 65, floor: 75 });
  assert(result.neckY >= 30 && result.neckY <= 34); assert.equal(result.shoulderWidth, 20);
  const cropped = measureFigure(image, { x: 8, y: 8, width: 24, height: 70 });
  assert.equal(cropped.x, 2); assert.equal(cropped.y, 2); assert.equal(cropped.footBaseline, 67);
});

test('contact sheet PNG encoding round-trips exact RGBA pixels', () => {
  const image = { width: 3, height: 2, rgba: Buffer.from([255,0,0,255, 0,255,0,128, 0,0,255,0, 45,60,90,255, 255,255,255,255, 0,0,0,255]) };
  const decoded = decodeRgbaPng(encodePng(image));
  assert.equal(decoded.width, image.width); assert.equal(decoded.height, image.height); assert.deepEqual(decoded.rgba, image.rgba);
});
