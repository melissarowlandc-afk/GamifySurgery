/**
 * Builds clean, unified actor atlases from the accepted source contact sheets.
 *
 * The source sheets are illustrations, not grid-aligned sprite sheets.  v2
 * cropped a rectangular region for each figure, which occasionally retained a
 * neighbour that crossed a guessed region edge.  This tool assigns connected
 * opaque components to their measured source cell and writes only the owned
 * pixels into a single full-character frame.  Runtime therefore never layers
 * separately cropped heads and bodies.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE = resolve(ROOT, "apps/player/public/art/characters/v1");
const DESTINATION = resolve(ROOT, "apps/player/public/art/characters/v3");
const COLUMNS = 5;
const ROWS = 6;
const CELL_WIDTH = 160;
const CELL_HEIGHT = 240;
const NECK_Y = 102;
const FLOOR_Y = 220;
const MAX_HEAD = { width: 120, height: 112 };
const MAX_BODY = { width: 132, height: 160 };

const BOUNDARIES = {
  // These are midpoint gaps between the actual *source* rows, measured from
  // all views. The v2 boundaries placed row-four heads and bodies one row too
  // low, splitting a person into two source bands during side poses.
  head: { x: [0, 255, 505, 747, 982, 1254], y: [0, 220, 435, 625, 805, 1015, 1254] },
  body: { x: [0, 356, 606, 870, 1138, 1536], y: [0, 180, 360, 530, 690, 845, 1024] },
};

const POSES = [
  ["actors-front-idle-v3.png", "heads-front-v1.png", "bodies-front-idle-v1.png", "head", "body"],
  ["actors-left-idle-v3.png", "heads-left-v1.png", "bodies-left-idle-v1.png", "head", "body"],
  ["actors-back-idle-v3.png", "heads-back-v1.png", "bodies-back-idle-v1.png", "head", "body"],
  ["actors-left-walk-a-v3.png", "heads-left-v1.png", "bodies-left-walk-a-v1.png", "head", "body"],
  ["actors-left-walk-b-v3.png", "heads-left-v1.png", "bodies-left-walk-b-v1.png", "head", "body"],
  ["actors-front-seated-v3.png", "heads-front-v1.png", "bodies-front-seated-v1.png", "head", "body"],
  ["actors-front-working-v3.png", "heads-front-v1.png", "bodies-front-working-v1.png", "head", "body"],
  ["actors-left-interaction-v3.png", "heads-left-v1.png", "bodies-left-interaction-v1.png", "head", "body"],
  ["actors-front-star-jump-v3.png", "heads-front-v1.png", "bodies-front-star-jump-v1.png", "head", "body"],
];

function cellBounds(kind, variant) {
  const boundaries = BOUNDARIES[kind];
  const column = variant % COLUMNS;
  const row = Math.floor(variant / COLUMNS);
  return {
    left: boundaries.x[column], right: boundaries.x[column + 1],
    top: boundaries.y[row], bottom: boundaries.y[row + 1],
  };
}

function components(imageData, width, height) {
  const { data } = imageData;
  const visited = new Uint8Array(width * height);
  const output = [];
  const opaque = (index) => data[index * 4 + 3] >= 80;
  for (let start = 0; start < visited.length; start += 1) {
    if (visited[start] || !opaque(start)) continue;
    const queue = [start];
    visited[start] = 1;
    const pixels = [];
    let minX = width; let minY = height; let maxX = 0; let maxY = 0;
    let sumX = 0; let sumY = 0;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      const x = current % width; const y = Math.floor(current / width);
      pixels.push(current); sumX += x; sumY += y;
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = x + dx; const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const next = ny * width + nx;
        if (!visited[next] && opaque(next)) { visited[next] = 1; queue.push(next); }
      }
    }
    output.push({ pixels, minX, minY, maxX, maxY, cx: sumX / pixels.length, cy: sumY / pixels.length });
  }
  return output;
}

const sourceCache = new Map();

async function sourceSheet(sourceFile) {
  let cached = sourceCache.get(sourceFile);
  if (cached) return cached;
  const image = await loadImage(resolve(SOURCE, sourceFile));
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height);
  const all = components(data, image.width, image.height);
  // Every source except the known front-idle body merge has thirty substantial
  // figure components. Derive its order from actual content rather than a
  // guessed y-grid: long hair and animal ears legitimately cross any fixed
  // visual row boundary.
  const substantial = all.filter((component) => component.pixels.length >= 5_000);
  let byVariant;
  if (substantial.length === 30) {
    byVariant = [];
    const rows = [...substantial].sort((a, b) => a.cy - b.cy);
    for (let row = 0; row < ROWS; row += 1) {
      const ordered = rows.slice(row * COLUMNS, (row + 1) * COLUMNS).sort((a, b) => a.cx - b.cx);
      byVariant.push(...ordered);
    }
  }
  cached = { image, data, all, byVariant };
  sourceCache.set(sourceFile, cached);
  return cached;
}

async function cleanCell(sourceFile, kind, variant) {
  const { image, data, all, byVariant } = await sourceSheet(sourceFile);
  const bounds = cellBounds(kind, variant);
  // Components belong to the figure containing their visual centre.  A rare
  // source merge (front-idle body) is clipped to that figure's measured cell,
  // which prevents a vertically touching neighbour from being copied too.
  const owned = byVariant
    ? [byVariant[variant]]
    : all.filter((component) =>
      component.cx >= bounds.left && component.cx < bounds.right &&
      component.cy >= bounds.top && component.cy < bounds.bottom,
    );
  let selected = owned.flatMap((component) => component.pixels.filter((pixel) => {
    const x = pixel % image.width; const y = Math.floor(pixel / image.width);
    return byVariant || (x >= bounds.left && x < bounds.right && y >= bounds.top && y < bounds.bottom);
  }));
  // One supplied front-idle body component bridges two vertically adjacent
  // figures. Its centre belongs to neither lower source cell, so preserve the
  // local portion only; the measured cell boundary deliberately sits in the
  // empty inter-figure gap and prevents the adjoining body from leaking in.
  if (selected.length === 0) {
    for (let y = bounds.top; y < bounds.bottom; y += 1) {
      for (let x = bounds.left; x < bounds.right; x += 1) {
        const pixel = y * image.width + x;
        if (data.data[pixel * 4 + 3] >= 80) selected.push(pixel);
      }
    }
  }
  if (selected.length === 0) throw new Error(`No owned pixels: ${sourceFile} #${variant}`);
  let minX = image.width; let minY = image.height; let maxX = 0; let maxY = 0;
  const extracted = createCanvas(image.width, image.height);
  const extractedContext = extracted.getContext("2d");
  const extractedData = extractedContext.createImageData(image.width, image.height);
  for (const pixel of selected) {
    const x = pixel % image.width; const y = Math.floor(pixel / image.width);
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    const offset = pixel * 4;
    extractedData.data[offset] = data.data[offset]; extractedData.data[offset + 1] = data.data[offset + 1];
    extractedData.data[offset + 2] = data.data[offset + 2]; extractedData.data[offset + 3] = data.data[offset + 3];
  }
  extractedContext.putImageData(extractedData, 0, 0);
  return { canvas: extracted, bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } };
}

async function build(outputName, headFile, bodyFile) {
  const output = createCanvas(COLUMNS * CELL_WIDTH, ROWS * CELL_HEIGHT);
  const context = output.getContext("2d"); context.imageSmoothingEnabled = false;
  for (let variant = 0; variant < COLUMNS * ROWS; variant += 1) {
    const [head, body] = await Promise.all([cleanCell(headFile, "head", variant), cleanCell(bodyFile, "body", variant)]);
    const cellX = (variant % COLUMNS) * CELL_WIDTH; const cellY = Math.floor(variant / COLUMNS) * CELL_HEIGHT;
    for (const [part, maximum, baseline] of [[head, MAX_HEAD, NECK_Y], [body, MAX_BODY, FLOOR_Y]]) {
      const scale = Math.min(maximum.width / part.bounds.width, maximum.height / part.bounds.height);
      const width = Math.max(1, Math.round(part.bounds.width * scale)); const height = Math.max(1, Math.round(part.bounds.height * scale));
      const x = cellX + Math.round((CELL_WIDTH - width) / 2); const y = cellY + baseline - height;
      context.drawImage(part.canvas, part.bounds.x, part.bounds.y, part.bounds.width, part.bounds.height, x, y, width, height);
    }
  }
  const target = resolve(DESTINATION, outputName); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, output.toBuffer("image/png"));
}

for (const [output, head, body] of POSES) await build(output, head, body);
