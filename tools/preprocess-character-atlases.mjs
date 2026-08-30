import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const [source, destination, transparent = "false"] = process.argv.slice(2);
if (!source || !destination) {
  throw new Error("Usage: node preprocess-character-atlases.mjs <source> <destination> [alreadyTransparent]");
}

const image = await loadImage(resolve(source));
const canvas = createCanvas(image.width, image.height);
const context = canvas.getContext("2d");
context.drawImage(image, 0, 0);
const imageData = context.getImageData(0, 0, image.width, image.height);
const { data } = imageData;
const width = image.width;
const height = image.height;

const pixelOffset = (x, y) => (y * width + x) * 4;
const isEdgeBackground = (offset) => {
  const [r, g, b, alpha] = data.subarray(offset, offset + 4);
  if (alpha <= 5) return true;
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  return high >= 176 && high - low <= 24;
};

if (transparent === "true") {
  for (let index = 3; index < data.length; index += 4) {
    if (data[index] <= 5) data[index] = 0;
  }
} else {
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let read = 0;
  let write = 0;
  const add = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    const offset = index * 4;
    if (!isEdgeBackground(offset)) return;
    visited[index] = 1;
    queue[write++] = index;
  };
  for (let x = 0; x < width; x += 1) { add(x, 0); add(x, height - 1); }
  for (let y = 0; y < height; y += 1) { add(0, y); add(width - 1, y); }
  while (read < write) {
    const index = queue[read++];
    const x = index % width;
    const y = Math.floor(index / width);
    data[index * 4 + 3] = 0;
    add(x - 1, y); add(x + 1, y); add(x, y - 1); add(x, y + 1);
  }
}

context.putImageData(imageData, 0, 0);
mkdirSync(dirname(resolve(destination)), { recursive: true });
writeFileSync(resolve(destination), canvas.toBuffer("image/png"));
