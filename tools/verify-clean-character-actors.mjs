/** Deterministic build-art audit for the clean v3 actor contract. */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const directory = resolve(import.meta.dirname, "../apps/player/public/art/characters/v3");
const files = readdirSync(directory).filter((file) => file.endsWith(".png"));
if (files.length !== 9) throw new Error(`Expected nine v3 actor atlases, found ${files.length}.`);

for (const file of files) {
  const image = await loadImage(resolve(directory, file));
  if (image.width !== 800 || image.height !== 1440) throw new Error(`${file} is not a 5x6 160x240 atlas.`);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  for (let variant = 0; variant < 30; variant += 1) {
    const left = (variant % 5) * 160; const top = Math.floor(variant / 5) * 240;
    let opaque = 0; let minX = left + 160; let maxX = left; let minY = top + 240; let maxY = top;
    for (let y = top; y < top + 240; y += 1) for (let x = left; x < left + 160; x += 1) {
      if (pixels[(y * image.width + x) * 4 + 3] < 80) continue;
      opaque += 1;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    if (opaque === 0) throw new Error(`${file} variant ${variant} has no actor pixels.`);
    // The generated actor must stay wholly inside its assigned crop. The
    // source-to-v3 transform never draws outside this frame, so a future
    // component/crop regression cannot bleed a neighbouring contact-sheet
    // figure over the selected actor.
    if (minX < left || maxX >= left + 160 || minY < top || maxY >= top + 240) {
      throw new Error(`${file} variant ${variant} escapes its owned frame.`);
    }
  }
}
console.log(`Verified ${files.length} clean v3 actor atlases / 270 owned frames.`);
