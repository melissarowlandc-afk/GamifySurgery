import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const [source, destination, kind] = process.argv.slice(2);
if (!source || !destination || !["head", "body"].includes(kind)) {
  throw new Error(
    "Usage: node normalise-character-atlases.mjs <source> <destination> <head|body>",
  );
}

const COLUMNS = 5;
const ROWS = 6;
// Every independently authored source layer is resampled into this same
// transparent local coordinate space. Runtime composition can therefore use
// one measured neck/floor datum instead of relying on the source sheets having
// matching margins, cell sizes, or visual centres.
const CELL_WIDTH = 160;
const CELL_HEIGHT = 240;
const FLOOR_Y = 220;
const NECK_Y = 102;
const MAX_HEAD = { width: 120, height: 112 };
const MAX_BODY = { width: 132, height: 160 };

const image = await loadImage(resolve(source));
const sourceCanvas = createCanvas(image.width, image.height);
const sourceContext = sourceCanvas.getContext("2d");
sourceContext.drawImage(image, 0, 0);
const sourceData = sourceContext.getImageData(0, 0, image.width, image.height);

const alphaAt = (x, y) => sourceData.data[(y * image.width + x) * 4 + 3] ?? 0;

// The source sheets were generated as a visual contact sheet, not as a uniform
// sprite atlas. These measured boundaries come from the actual inter-figure
// gaps: use them before alpha trimming so one figure never borrows a neighbour
// (notably the robot/rabbit pair that touches vertically in one source sheet).
const SOURCE_CELL_BOUNDARIES = kind === "head"
  ? { x: [0, 255, 505, 747, 982, 1254], y: [0, 245, 465, 675, 875, 1050, 1254] }
  : { x: [0, 356, 606, 870, 1138, 1536], y: [0, 216, 408, 590, 750, 902, 1024] };

function measuredBounds(variant) {
  const column = variant % COLUMNS;
  const row = Math.floor(variant / COLUMNS);
  const left = SOURCE_CELL_BOUNDARIES.x[column];
  const right = SOURCE_CELL_BOUNDARIES.x[column + 1];
  const top = SOURCE_CELL_BOUNDARIES.y[row];
  const bottom = SOURCE_CELL_BOUNDARIES.y[row + 1];
  let minX = right;
  let minY = bottom;
  let maxX = left - 1;
  let maxY = top - 1;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      if (alphaAt(x, y) < 80) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) {
    throw new Error(`Could not measure opaque content for ${source}, variant ${variant}.`);
  }
  return {
    x: Math.max(left, minX - 2),
    y: Math.max(top, minY - 2),
    width: Math.min(right - 1, maxX + 2) - Math.max(left, minX - 2) + 1,
    height: Math.min(bottom - 1, maxY + 2) - Math.max(top, minY - 2) + 1,
  };
}

const output = createCanvas(COLUMNS * CELL_WIDTH, ROWS * CELL_HEIGHT);
const context = output.getContext("2d");
context.imageSmoothingEnabled = false;
for (let variant = 0; variant < COLUMNS * ROWS; variant += 1) {
  const bounds = measuredBounds(variant);
  const maximum = kind === "head" ? MAX_HEAD : MAX_BODY;
  const scale = Math.min(maximum.width / bounds.width, maximum.height / bounds.height);
  const width = Math.max(1, Math.round(bounds.width * scale));
  const height = Math.max(1, Math.round(bounds.height * scale));
  const cellX = (variant % COLUMNS) * CELL_WIDTH;
  const cellY = Math.floor(variant / COLUMNS) * CELL_HEIGHT;
  const x = cellX + Math.round((CELL_WIDTH - width) / 2);
  const y = cellY + (kind === "head" ? NECK_Y - height : FLOOR_Y - height);
  context.drawImage(
    sourceCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    x,
    y,
    width,
    height,
  );
}

mkdirSync(dirname(resolve(destination)), { recursive: true });
writeFileSync(resolve(destination), output.toBuffer("image/png"));
