import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const source = await loadImage(resolve("apps/player/public/art/rooms/front-desk-v4/front-desk-shell-v4.png"));
const atlas = createCanvas(512, 512);
const ctx = atlas.getContext("2d");
ctx.imageSmoothingEnabled = false;
// These are native, one-logical-tile slices from the accepted Front Desk v4
// shell. Boundary-aware rooms tile/crop them; no artwork is resized to fit a
// partial exposed run.
const slices = [
  ["north", 212, 97, 166, 242, 0, 0],
  ["side", 157, 339, 55, 155, 192, 0],
  ["front", 212, 941, 166, 153, 256, 0],
  ["floor", 212, 339, 166, 155, 0, 272],
];
for (const [, sx, sy, sw, sh, dx, dy] of slices) ctx.drawImage(source, sx, sy, sw, sh, dx, dy, sw, sh);
mkdirSync(resolve("apps/player/public/art/rooms/surgery-center-v1"), { recursive: true });
writeFileSync(resolve("apps/player/public/art/rooms/surgery-center-v1/architecture-components-v1.png"), atlas.toBuffer("image/png"));
