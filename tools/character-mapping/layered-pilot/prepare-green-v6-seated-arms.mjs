import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = resolve(import.meta.dirname, '../../..');
const source = resolve(import.meta.dirname, 'assets/green-south-seated-arms-v6-opaque-source.png');
const output = resolve(import.meta.dirname, 'assets/green-south-seated-arms-v6.png');
const provenance = resolve(import.meta.dirname, 'assets/green-south-seated-arms-v6-provenance.json');
const prompt = resolve(root, 'docs/execplans/layered-seated-arm-edit-prompt.txt');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

const sourceBytes = readFileSync(source);
const image = await loadImage(source);
const canvas = createCanvas(image.width, image.height);
const context = canvas.getContext('2d');
context.drawImage(image, 0, 0);
const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
const { data } = pixels;
const pixelCount = canvas.width * canvas.height;
const exterior = new Uint8Array(pixelCount);
const queue = new Int32Array(pixelCount);
let readIndex = 0;
let writeIndex = 0;

// The generated checkerboard is light and nearly neutral. Only connected exterior
// pixels qualify, preserving enclosed light cuff and hand highlights.
function isBackgroundCandidate(byteIndex) {
  const red = data[byteIndex];
  const green = data[byteIndex + 1];
  const blue = data[byteIndex + 2];
  return Math.max(red, green, blue) - Math.min(red, green, blue) <= 30
    && (red + green + blue) / 3 >= 155;
}

function enqueue(x, y) {
  const pixelIndex = y * canvas.width + x;
  if (exterior[pixelIndex] || !isBackgroundCandidate(pixelIndex * 4)) return;
  exterior[pixelIndex] = 1;
  queue[writeIndex++] = pixelIndex;
}

for (let x = 0; x < canvas.width; x += 1) {
  enqueue(x, 0);
  enqueue(x, canvas.height - 1);
}
for (let y = 1; y < canvas.height - 1; y += 1) {
  enqueue(0, y);
  enqueue(canvas.width - 1, y);
}
while (readIndex < writeIndex) {
  const pixelIndex = queue[readIndex++];
  const x = pixelIndex % canvas.width;
  const y = Math.floor(pixelIndex / canvas.width);
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      const adjacentX = x + offsetX;
      const adjacentY = y + offsetY;
      if ((offsetX || offsetY) && adjacentX >= 0 && adjacentX < canvas.width
        && adjacentY >= 0 && adjacentY < canvas.height) enqueue(adjacentX, adjacentY);
    }
  }
}

let removed = 0;
let retained = 0;
let retainedLight = 0;
for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
  const byteIndex = pixelIndex * 4;
  if (exterior[pixelIndex]) {
    data[byteIndex + 3] = 0;
    removed += 1;
  } else {
    retained += 1;
    if (isBackgroundCandidate(byteIndex)) retainedLight += 1;
  }
}
context.putImageData(pixels, 0, 0);
const outputBytes = canvas.toBuffer('image/png');
writeFileSync(output, outputBytes);

const record = {
  schemaVersion: 1,
  opaqueSource: {
    path: 'tools/character-mapping/layered-pilot/assets/green-south-seated-arms-v6-opaque-source.png',
    sha256: sha(sourceBytes),
    dimensions: [image.width, image.height],
  },
  transparentOutput: {
    path: 'tools/character-mapping/layered-pilot/assets/green-south-seated-arms-v6.png',
    sha256: sha(outputBytes),
  },
  prompt: {
    path: 'docs/execplans/layered-seated-arm-edit-prompt.txt',
    sha256: sha(readFileSync(prompt)),
  },
  method: '8-connected exterior neutral flood; range <=30; mean >=155; alpha only',
  alpha: { removed, retained, retainedLight, partial: 0 },
  retainedRgb: 'byte-identical where alpha is nonzero',
};
writeFileSync(provenance, `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 2));
