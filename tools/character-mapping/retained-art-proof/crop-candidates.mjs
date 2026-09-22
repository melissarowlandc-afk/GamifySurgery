import { createCanvas, loadImage } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../..');
const output = resolve(repo, 'artifacts/character-movement/retained-art-proof/candidates');
mkdirSync(output, { recursive: true });
const rectangles = {
  standingEast: { x: 300, y: 20, width: 210, height: 340 },
  walkEastA: { x: 1000, y: 360, width: 240, height: 310 },
  walkEastB: { x: 1250, y: 360, width: 250, height: 310 },
  walkEastC: { x: 30, y: 660, width: 230, height: 310 },
  walkEastD: { x: 270, y: 660, width: 250, height: 310 },
};

function clearConnectedBackground(context, width, height) {
  const image = context.getImageData(0, 0, width, height);
  const data = image.data;
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let head = 0;
  let tail = 0;
  const eligible = index => {
    const offset = index * 4;
    const red = data[offset], green = data[offset + 1], blue = data[offset + 2];
    return Math.min(red, green, blue) >= 232 && Math.max(red, green, blue) - Math.min(red, green, blue) <= 18;
  };
  const add = index => { if (!visited[index] && eligible(index)) { visited[index] = 1; queue[tail++] = index; } };
  for (let x = 0; x < width; x += 1) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y += 1) { add(y * width); add(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++], x = index % width, y = Math.floor(index / width);
    if (x > 0) add(index - 1); if (x + 1 < width) add(index + 1);
    if (y > 0) add(index - width); if (y + 1 < height) add(index + width);
  }
  for (let index = 0; index < visited.length; index += 1) if (visited[index]) data[index * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
}

for (const sourcePath of process.argv.slice(2)) {
  const image = await loadImage(resolve(repo, sourcePath));
  const stem = basename(sourcePath, '.png').slice(5, 13);
  for (const [name, crop] of Object.entries(rectangles)) {
    const canvas = createCanvas(crop.width, crop.height), context = canvas.getContext('2d');
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    clearConnectedBackground(context, crop.width, crop.height);
    writeFileSync(resolve(output, `${stem}-${name}.png`), canvas.toBuffer('image/png'));
  }
}
