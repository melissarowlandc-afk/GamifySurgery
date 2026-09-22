import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../../..');
const assets = resolve(import.meta.dirname, 'assets');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/directional-v1/preparation');
const sourceRelative = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png';
const sourcePath = resolve(repo, sourceRelative);
const initialPath = resolve(assets, 'green-directional-parts-initial-v1.png');
const correctedPath = resolve(assets, 'green-directional-parts-corrected-v1-opaque.png');
const transparentPath = resolve(assets, 'green-directional-parts-corrected-v1-transparent.png');
const expected = {
  source: 'fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63',
  initial: '2d9456a21476956b834ba27f9d1b59a19dff00c1aa3e517268c0bc82df1c120f',
  corrected: 'a1068656b268ee275d369fade9f4ddab281120ec4a6c274adb9b7281b7f8996b',
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const [id, path] of Object.entries({ source: sourcePath, initial: initialPath, corrected: correctedPath })) {
  const actual = hash(readFileSync(path));
  if (actual !== expected[id]) throw new Error(`${id} changed: ${actual}`);
}
mkdirSync(output, { recursive: true });

function floodExterior(imageData, width, height, candidate) {
  const mask = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let read = 0;
  let write = 0;
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (mask[pixel] || !candidate(pixel * 4)) return;
    mask[pixel] = 1;
    queue[write++] = pixel;
  };
  for (let x = 0; x < width; x += 1) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 1; y < height - 1; y += 1) { enqueue(0, y); enqueue(width - 1, y); }
  while (read < write) {
    const pixel = queue[read++];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
      if (dx || dy) enqueue(x + dx, y + dy);
    }
  }
  return mask;
}

function alphaBounds(data, width, height, threshold = 16) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  let pixels = 0;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (data[(y * width + x) * 4 + 3] < threshold) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); pixels += 1;
  }
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1, pixels };
}

const corrected = await loadImage(correctedPath);
const plate = createCanvas(corrected.width, corrected.height);
const plateContext = plate.getContext('2d');
plateContext.drawImage(corrected, 0, 0);
const platePixels = plateContext.getImageData(0, 0, plate.width, plate.height);
const beforePlate = new Uint8ClampedArray(platePixels.data);
const magenta = index => {
  const r = platePixels.data[index];
  const g = platePixels.data[index + 1];
  const b = platePixels.data[index + 2];
  return r >= 70 && b >= 70 && g <= Math.min(r, b) * 0.72 && Math.abs(r - b) <= 105;
};
const plateBackground = floodExterior(platePixels.data, plate.width, plate.height, magenta);
let removedPlate = 0;
let retainedPlate = 0;
let retainedRgbChanges = 0;
for (let pixel = 0; pixel < plateBackground.length; pixel += 1) {
  const index = pixel * 4;
  if (plateBackground[pixel]) { platePixels.data[index + 3] = 0; removedPlate += 1; } else retainedPlate += 1;
  if (!plateBackground[pixel] && (platePixels.data[index] !== beforePlate[index] || platePixels.data[index + 1] !== beforePlate[index + 1] || platePixels.data[index + 2] !== beforePlate[index + 2])) retainedRgbChanges += 1;
}
plateContext.putImageData(platePixels, 0, 0);
const transparentBytes = plate.toBuffer('image/png');
writeFileSync(transparentPath, transparentBytes);

const headRects = {
  east: [373, 58, 90, 90],
  west: [600, 58, 90, 90],
  north: [831, 58, 90, 90],
};
const source = await loadImage(sourcePath);
const heads = {};
for (const [view, rect] of Object.entries(headRects)) {
  const canvas = createCanvas(rect[2], rect[3]);
  const context = canvas.getContext('2d');
  context.drawImage(source, ...rect, 0, 0, rect[2], rect[3]);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const before = new Uint8ClampedArray(pixels.data);
  const neutral = index => {
    const r = pixels.data[index]; const g = pixels.data[index + 1]; const b = pixels.data[index + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) <= 30 && (r + g + b) / 3 >= 155;
  };
  const background = floodExterior(pixels.data, canvas.width, canvas.height, neutral);
  let removed = 0;
  let retained = 0;
  let retainedRgbChanges = 0;
  for (let pixel = 0; pixel < background.length; pixel += 1) {
    const index = pixel * 4;
    if (background[pixel]) { pixels.data[index + 3] = 0; removed += 1; } else retained += 1;
    if (!background[pixel] && (pixels.data[index] !== before[index] || pixels.data[index + 1] !== before[index + 1] || pixels.data[index + 2] !== before[index + 2])) retainedRgbChanges += 1;
  }
  // The immutable head rectangles include the original garment at their bottom.
  // Keep only view-specific neck skin there; the arm-free torso owns every collar pixel.
  let removedOriginalGarment = 0;
  const lowerHeadPolygons = {
    east: [[48, 70, 86, 67, 85, 75, 78, 82, 59, 85, 46, 79], [31, 70, 62, 70, 68, 77, 61, 89, 35, 89, 27, 82], [15, 70, 37, 70, 37, 77, 32, 82, 27, 79, 21, 80, 15, 75]],
    west: [[4, 67, 37, 68, 40, 75, 33, 83, 15, 86, 4, 79], [32, 70, 56, 70, 64, 78, 57, 89, 35, 89, 27, 82], [56, 70, 72, 70, 72, 76, 67, 79, 61, 77]],
    north: [[16, 70, 74, 70, 75, 78, 64, 82, 55, 80, 45, 80, 35, 80, 26, 82, 15, 77]],
  };
  const inside = (x, y, polygon) => {
    let result = false;
    for (let current = 0, previous = polygon.length - 2; current < polygon.length; previous = current, current += 2) {
      const currentX = polygon[current]; const currentY = polygon[current + 1];
      const previousX = polygon[previous]; const previousY = polygon[previous + 1];
      if ((currentY > y) !== (previousY > y) && x < (previousX - currentX) * (y - currentY) / (previousY - currentY) + currentX) result = !result;
    }
    return result;
  };
  for (let y = 70; y < canvas.height; y += 1) for (let x = 0; x < canvas.width; x += 1) {
    const index = (y * canvas.width + x) * 4;
    if (!pixels.data[index + 3]) continue;
    if (!lowerHeadPolygons[view].some(polygon => inside(x + 0.5, y + 0.5, polygon))) { pixels.data[index + 3] = 0; removedOriginalGarment += 1; }
  }
  context.putImageData(pixels, 0, 0);
  const bytes = canvas.toBuffer('image/png');
  const file = `green-head-${view}-source-v1.png`;
  writeFileSync(resolve(assets, file), bytes);
  heads[view] = { file: `tools/character-mapping/layered-pilot/directional/assets/${file}`, sourceRect: rect, sha256: hash(bytes), removed, retained, removedOriginalGarment, retainedRgbChanges, bounds: alphaBounds(pixels.data, canvas.width, canvas.height) };
}

const bridgeSpecs = {
  east: { rect: [390, 128, 70, 33], keep: [20, 0, 70, 0, 70, 33, 15, 33, 0, 20] },
  west: { rect: [595, 128, 85, 33], keep: [0, 0, 65, 0, 85, 20, 70, 33, 0, 33] },
  north: { rect: [830, 128, 90, 33], keep: [0, 0, 90, 0, 90, 33, 0, 33] },
};
const neckBridges = {};
for (const [view, spec] of Object.entries(bridgeSpecs)) {
  const [sourceX, sourceY, width, height] = spec.rect;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.drawImage(source, sourceX, sourceY, width, height, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height);
  const neutral = index => {
    const r = pixels.data[index]; const g = pixels.data[index + 1]; const b = pixels.data[index + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) <= 30 && (r + g + b) / 3 >= 155;
  };
  const background = floodExterior(pixels.data, width, height, neutral);
  const insideKeep = (x, y) => {
    let result = false;
    const polygon = spec.keep;
    for (let current = 0, previous = polygon.length - 2; current < polygon.length; previous = current, current += 2) {
      const currentX = polygon[current]; const currentY = polygon[current + 1]; const previousX = polygon[previous]; const previousY = polygon[previous + 1];
      if ((currentY > y) !== (previousY > y) && x < (previousX - currentX) * (y - currentY) / (previousY - currentY) + currentX) result = !result;
    }
    return result;
  };
  const semantic = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const pixel = y * width + x; const index = pixel * 4;
    if (background[pixel] || !insideKeep(x + 0.5, y + 0.5)) continue;
    const r = pixels.data[index]; const g = pixels.data[index + 1]; const b = pixels.data[index + 2];
    const skin = r > 70 && r > g * 1.06 && r > b * 1.15;
    if (skin) semantic[pixel] = 1;
  }
  const outlined = new Uint8Array(semantic);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const pixel = y * width + x; const index = pixel * 4;
    if (background[pixel] || !insideKeep(x + 0.5, y + 0.5)) continue;
    const darkness = (pixels.data[index] + pixels.data[index + 1] + pixels.data[index + 2]) / 3;
    if (darkness >= 125) continue;
    for (let dy = -2; dy <= 2 && !outlined[pixel]; dy += 1) for (let dx = -2; dx <= 2; dx += 1) {
      const neighborX = x + dx; const neighborY = y + dy;
      if (neighborX >= 0 && neighborY >= 0 && neighborX < width && neighborY < height && semantic[neighborY * width + neighborX]) { outlined[pixel] = 1; break; }
    }
  }
  let retained = 0; let removed = 0;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const pixel = y * width + x; const index = pixel * 4;
    if (!outlined[pixel]) { pixels.data[index + 3] = 0; removed += 1; } else retained += 1;
  }
  context.putImageData(pixels, 0, 0);
  const bytes = canvas.toBuffer('image/png');
  const file = `green-neck-${view}-source-v1.png`;
  writeFileSync(resolve(assets, file), bytes);
  neckBridges[view] = { file: `tools/character-mapping/layered-pilot/directional/assets/${file}`, sourceRect: spec.rect, keepPolygon: spec.keep, sha256: hash(bytes), retained, removed, retainedRgbChanges: 0, bounds: alphaBounds(pixels.data, width, height) };
}

const proof = createCanvas(900, 300);
const proofContext = proof.getContext('2d');
proofContext.fillStyle = '#f4efe2'; proofContext.fillRect(0, 0, proof.width, proof.height);
proofContext.fillStyle = '#182129'; proofContext.fillRect(450, 0, 450, proof.height);
proofContext.font = 'bold 16px sans-serif';
for (const [index, view] of Object.keys(heads).entries()) {
  const head = await loadImage(resolve(repo, heads[view].file));
  const x = index * 145 + 28;
  proofContext.fillStyle = '#28323a'; proofContext.fillText(view.toUpperCase(), x, 24);
  proofContext.drawImage(head, x, 38);
  proofContext.fillStyle = '#fff'; proofContext.fillText(view.toUpperCase(), x + 450, 24);
  proofContext.drawImage(head, x + 450, 38);
}
writeFileSync(resolve(output, 'directional-source-heads-light-dark.png'), proof.toBuffer('image/png'));

const manifest = {
  schemaVersion: 1,
  immutableSource: { path: sourceRelative, sha256: expected.source },
  generatedPlates: {
    initial: { path: 'tools/character-mapping/layered-pilot/directional/assets/green-directional-parts-initial-v1.png', sha256: expected.initial, role: 'first source-referenced E/W/N layered plate; top torso row rejected because sleeve lobes remained' },
    correctedOpaque: { path: 'tools/character-mapping/layered-pilot/directional/assets/green-directional-parts-corrected-v1-opaque.png', sha256: expected.corrected, role: 'targeted top-row edit removing arms; matte magenta background', sourceGeneratedPath: 'C:/Users/Kyle Kent/.codex/generated_images/01a09b55-147e-72f0-b413-e8b6827c7287/exec-1e74c3b6-4728-4769-aa40-2e7418884cd7.png' },
    transparent: { path: 'tools/character-mapping/layered-pilot/directional/assets/green-directional-parts-corrected-v1-transparent.png', sha256: hash(transparentBytes), method: '8-connected exterior flood over magenta-dominant pixels; alpha changed only', alpha: { removed: removedPlate, retained: retainedPlate }, retainedRgbChanges },
  },
  promptProvenance: { initialGeneratedPath: 'C:/Users/Kyle Kent/.codex/generated_images/01a09b55-147e-72f0-b413-e8b6827c7287/exec-65608186-eeee-4ebb-8f44-022af7c98415.png', correctionInstruction: 'Targeted edit of only the top row to remove arms fully and use a matte magenta background. Exact prompt text was supplied outside this owned directory.' },
  heads,
  neckBridges,
};
writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
