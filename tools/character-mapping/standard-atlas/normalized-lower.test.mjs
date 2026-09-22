import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { slotRect } from './schema-v1.mjs';
import { loadNormalizedLowerParts } from './normalized-lower-loader.mjs';
import { triangulatedQuad } from './normalized-lower-renderer.mjs';

test('two-triangle quad fills the bent fourth corner and shared diagonal', () => {
  const source = createCanvas(100, 100), donor = source.getContext('2d');
  donor.fillStyle = '#595047'; donor.fillRect(0, 0, 100, 100);
  const output = createCanvas(128, 128), context = output.getContext('2d');
  triangulatedQuad(context, source, { x: 0, y: 0, width: 100, height: 100 }, [
    { x: 10, y: 10 }, { x: 100, y: 10 }, { x: 80, y: 110 }, { x: 20, y: 110 },
  ]);
  const pixels = context.getImageData(0, 0, 128, 128).data;
  for (let y = 18; y <= 102; y += 7) {
    const left = Math.ceil(10 + (y - 10) * .1 + 3);
    const right = Math.floor(100 - (y - 10) * .2 - 3);
    for (let x = left; x <= right; x++)
      assert(pixels[(y * 128 + x) * 4 + 3] >= 240, `transparent interior at ${x},${y}`);
  }
  // A single affine parallelogram would end near x=110 here, outside the target.
  assert.equal(pixels[(105 * 128 + 100) * 4 + 3], 0);
});

test('normalized lower loader samples the actual packed alpha for all Brown Beanie slots', async () => {
  const root = resolve(import.meta.dirname, '../layered-pilot/brown-beanie-v1/assets');
  const report = JSON.parse(readFileSync(resolve(root, 'lower-parts-v1.json'), 'utf8'));
  const image = await loadImage(resolve(root, 'lower-v1.png'));
  const lower = loadNormalizedLowerParts(image, report.parts);
  assert.equal(Object.keys(report.parts).length, 24);
  let scalesBeyondLegacy = 0;
  for (const [id, record] of Object.entries(report.parts)) {
    const [, view, kind, side] = /^lower\.(south|east|west|north)\.(thigh|shin|shoe)\.(left|right)$/.exec(id);
    const packed = lower[view][side][kind], slot = slotRect(id), alpha = record.contentBounds;
    const visible = { x: slot.x + alpha.x, y: slot.y + alpha.y, right: slot.x + alpha.x + alpha.width, bottom: slot.y + alpha.y + alpha.height };
    assert(packed.rect.x <= visible.x + 2 && packed.rect.y <= visible.y + 2 && packed.rect.x + packed.rect.width >= visible.right - 2 && packed.rect.y + packed.rect.height >= visible.bottom - 2, `${id} source rect omits visible packed alpha`);
    if (Math.abs(record.normalization.scale - 1) > .3) scalesBeyondLegacy++;
  }
  assert(scalesBeyondLegacy >= 8, 'fixture must include real non-unit normalized parts');
});
