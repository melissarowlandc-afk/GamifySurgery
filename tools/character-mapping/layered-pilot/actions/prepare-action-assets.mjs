import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const assets = resolve(import.meta.dirname, 'assets');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

function isMatte(data, index) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  return red >= 150 && blue >= 140 && green <= 160
    && red + blue - green * 2 >= 80
    && Math.abs(red - blue) <= 95;
}

function isMagentaFringe(data, index) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  return red >= 140 && blue >= 130 && green <= 110
    && red > green * 1.5 && blue > green * 1.5
    && red + blue - green * 2 >= 200
    && Math.abs(red - blue) <= 95;
}

function alphaBounds(data, width, rect) {
  const [x, y, rectWidth, rectHeight] = rect;
  let left = x + rectWidth;
  let top = y + rectHeight;
  let right = -1;
  let bottom = -1;
  for (let row = y; row < y + rectHeight; row += 1) for (let column = x; column < x + rectWidth; column += 1) {
    if (!data[(row * width + column) * 4 + 3]) continue;
    left = Math.min(left, column);
    top = Math.min(top, row);
    right = Math.max(right, column);
    bottom = Math.max(bottom, row);
  }
  if (right < left) throw new Error(`empty action asset cell ${rect.join(',')}`);
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

async function removeExteriorMatte(sourceName, outputName, cells) {
  const sourcePath = resolve(assets, sourceName);
  const sourceBytes = readFileSync(sourcePath);
  const image = await loadImage(sourcePath);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height);
  const { data } = pixels;
  const count = image.width * image.height;
  const exterior = new Uint8Array(count);
  const queue = new Int32Array(count);
  let readIndex = 0;
  let writeIndex = 0;
  const enqueue = (x, y) => {
    const pixel = y * image.width + x;
    if (exterior[pixel] || !isMatte(data, pixel * 4)) return;
    exterior[pixel] = 1;
    queue[writeIndex++] = pixel;
  };
  for (let x = 0; x < image.width; x += 1) {
    enqueue(x, 0);
    enqueue(x, image.height - 1);
  }
  for (let y = 1; y < image.height - 1; y += 1) {
    enqueue(0, y);
    enqueue(image.width - 1, y);
  }
  while (readIndex < writeIndex) {
    const pixel = queue[readIndex++];
    const x = pixel % image.width;
    const y = Math.floor(pixel / image.width);
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      const nextX = x + offsetX;
      const nextY = y + offsetY;
      if ((offsetX || offsetY) && nextX >= 0 && nextX < image.width && nextY >= 0 && nextY < image.height) enqueue(nextX, nextY);
    }
  }
  let removed = 0;
  let retained = 0;
  for (let pixel = 0; pixel < count; pixel += 1) {
    const index = pixel * 4;
    if (exterior[pixel] || isMagentaFringe(data, index)) {
      data[index] = 0;
      data[index + 1] = 0;
      data[index + 2] = 0;
      data[index + 3] = 0;
      removed += 1;
    } else retained += 1;
  }
  context.putImageData(pixels, 0, 0);
  const outputBytes = canvas.toBuffer('image/png');
  writeFileSync(resolve(assets, outputName), outputBytes);
  const outputPixels = context.getImageData(0, 0, image.width, image.height).data;
  return {
    source: { file: sourceName, sha256: sha256(sourceBytes), dimensions: [image.width, image.height] },
    output: { file: outputName, sha256: sha256(outputBytes) },
    method: '8-connected exterior #FF00FF-family flood plus global magenta-fringe key; removed RGBA cleared to prevent interpolation halos; retained RGB unchanged',
    alpha: { removed, retained },
    cells: Object.fromEntries(Object.entries(cells).map(([id, rect]) => [id, {
      cell: rect,
      bounds: alphaBounds(outputPixels, image.width, rect),
    }])),
  };
}

const seatedCells = {};
for (const [column, view] of ['south', 'east', 'west', 'north'].entries()) {
  seatedCells[`${view}.lowerBody`] = [column * 362, 100, 362, 300];
  seatedCells[`${view}.leftArm`] = [column * 362, 420, 362, 300];
  seatedCells[`${view}.rightArm`] = [column * 362, 730, 362, 300];
}
const clipboardCells = {
  leftArm: [0, 0, 627, 1254],
  rightArm: [627, 0, 627, 1254],
};

const record = {
  schemaVersion: 1,
  seated: await removeExteriorMatte(
    'green-seated-parts-v1-matte.png',
    'green-seated-parts-v1-transparent.png',
    seatedCells,
  ),
  clipboard: await removeExteriorMatte(
    'green-clipboard-arms-v1-matte.png',
    'green-clipboard-arms-v1-transparent.png',
    clipboardCells,
  ),
};
const bytes = Buffer.from(`${JSON.stringify(record, null, 2)}\n`);
writeFileSync(resolve(assets, 'action-assets-v1-provenance.json'), bytes);
console.log(JSON.stringify({ provenanceSha256: sha256(bytes), seated: record.seated.output,
  clipboard: record.clipboard.output, removed: {
    seated: record.seated.alpha.removed,
    clipboard: record.clipboard.alpha.removed,
  } }, null, 2));
