import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = resolve(import.meta.dirname, "../..");
const founderDirectory = resolve(
  root,
  "apps/player/public/art/characters/founders-v4",
);
const reviewDirectory = resolve(
  root,
  "Photos for Codex 2/Codex Founders 2/founder-11-foot-repair",
);
const manifest = JSON.parse(
  readFileSync(resolve(founderDirectory, "manifest.json"), "utf8"),
);

const identityIndex = 10;
const shoeReferenceIdentityIndex = 9;
const cell = manifest.cells;
const reviewCanvas = { width: 1024, height: 1024 };
const placement = { x: 192, y: 32, scale: 5 };
const poses = [
  {
    standing: "front-idle",
    orientation: "front-facing",
    maskRects: [
      { left: 41, top: 142, right: 63, bottom: 168 },
      { left: 65, top: 142, right: 88, bottom: 168 },
      { left: 36, top: 164, right: 64, bottom: 182 },
      { left: 64, top: 164, right: 94, bottom: 182 },
    ],
  },
  {
    standing: "left-idle",
    orientation: "left-facing side profile",
    maskRects: [
      { left: 43, top: 142, right: 75, bottom: 169 },
      { left: 31, top: 164, right: 77, bottom: 182 },
    ],
  },
  {
    standing: "right-idle",
    orientation: "right-facing side profile",
    maskRects: [
      { left: 47, top: 142, right: 76, bottom: 169 },
      { left: 45, top: 164, right: 91, bottom: 182 },
    ],
  },
];

function destinationFor(index) {
  return {
    x: (index % cell.columns) * cell.width,
    y: Math.floor(index / cell.columns) * cell.height,
  };
}

function extractCell(atlas, index) {
  const source = destinationFor(index);
  const output = createCanvas(cell.width, cell.height);
  output.getContext("2d").drawImage(
    atlas,
    source.x,
    source.y,
    cell.width,
    cell.height,
    0,
    0,
    cell.width,
    cell.height,
  );
  return output;
}

function makeReviewInput(actor) {
  const output = createCanvas(reviewCanvas.width, reviewCanvas.height);
  const context = output.getContext("2d");
  context.fillStyle = "#eee9df";
  context.fillRect(0, 0, output.width, output.height);
  context.imageSmoothingEnabled = false;
  context.drawImage(
    actor,
    placement.x,
    placement.y,
    cell.width * placement.scale,
    cell.height * placement.scale,
  );
  return output;
}

function makeEditMask(maskRects) {
  const output = createCanvas(reviewCanvas.width, reviewCanvas.height);
  const context = output.getContext("2d");
  context.fillStyle = "#000000";
  context.fillRect(0, 0, output.width, output.height);
  context.fillStyle = "#ffffff";
  for (const rectangle of maskRects) {
    context.fillRect(
      placement.x + rectangle.left * placement.scale,
      placement.y + rectangle.top * placement.scale,
      (rectangle.right - rectangle.left) * placement.scale,
      (rectangle.bottom - rectangle.top) * placement.scale,
    );
  }
  return output;
}

mkdirSync(reviewDirectory, { recursive: true });
const records = [];
for (const pose of poses) {
  const standingAtlas = await loadImage(
    resolve(founderDirectory, manifest.poses[pose.standing]),
  );
  const standingCell = extractCell(standingAtlas, identityIndex);
  const shoeReferenceCell = extractCell(standingAtlas, shoeReferenceIdentityIndex);
  const prefix = `founder-11-${pose.standing}`;
  const files = {
    sourceCell: `${prefix}-source-cell.png`,
    current: `${prefix}-current-1024.png`,
    reference: `${prefix}-standing-shoe-reference-1024.png`,
    mask: `${prefix}-mask-1024.png`,
    prompt: `${prefix}-prompt.txt`,
  };
  writeFileSync(resolve(reviewDirectory, files.sourceCell), standingCell.toBuffer("image/png"));
  writeFileSync(resolve(reviewDirectory, files.current), makeReviewInput(standingCell).toBuffer("image/png"));
  writeFileSync(resolve(reviewDirectory, files.reference), makeReviewInput(shoeReferenceCell).toBuffer("image/png"));
  writeFileSync(resolve(reviewDirectory, files.mask), makeEditMask(pose.maskRects).toBuffer("image/png"));
  const prompt = [
    "Use case: precise-object-edit",
    "Asset type: high-resolution 2D game character sprite repair",
    `Primary request: In the white edit-mask region only, add two complete small dark charcoal-black closed-toe shoes to the ${pose.orientation} standing clinician, naturally continuing below the two existing trouser cuffs. Make both feet recognizable and grounded without changing the stance or leg length.`,
    "Input images: Image 1 is the exact standing edit target and the only conditioning image.",
    "Style/medium: preserve the exact soft-edged high-resolution pixel-painted game sprite style, line weight, lighting, limited palette, proportions, and transparent-cutout intent of Image 1.",
    "Composition/framing: preserve the character center and the existing floor-contact baseline; keep the entire body visible.",
    "Constraints: change only pixels inside the white mask; keep every pixel outside it unchanged; preserve the white coat, dark trousers, pose, identity, scale, and anatomy; no background objects, text, shadow, or extra accessories.",
    "Avoid: cropped toes, flat unfinished trouser bottoms, fused feet, extra limbs, high heels, oversized shoes, photorealism, blur, halo, white fringe, or a changed background.",
  ].join("\n");
  writeFileSync(resolve(reviewDirectory, files.prompt), `${prompt}\n`, "utf8");
  records.push({ ...pose, files, prompt });
}

writeFileSync(
  resolve(reviewDirectory, "repair-manifest.json"),
  JSON.stringify({
    identityIndex,
    shoeReferenceIdentityIndex,
    founderId: manifest.variants[identityIndex].id,
    contentRevision: manifest.contentRevision,
    cell,
    floorAnchor: manifest.floorAnchor,
    reviewCanvas,
    placement,
    poses: records,
  }, null, 2),
  "utf8",
);

console.log(`Prepared ${records.length} founder-foot repair inputs in ${reviewDirectory}`);
