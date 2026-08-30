/**
 * Packages the thirty supplied founder contact sheets for private owner review.
 * This is deliberately a review-only tool: it never reads or writes runtime art.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const ROOT = resolve(import.meta.dirname, "..");
const sourceDirectoryArgument = process.argv[2];
if (!sourceDirectoryArgument) {
  console.error("Usage: node tools/package-founder-mockups-v3.mjs <source-directory>");
  process.exit(1);
}
const SOURCE_DIRECTORY = resolve(sourceDirectoryArgument);
const OUTPUT_DIRECTORY = resolve(ROOT, "generated_images/founder-character-mockups-v3");
const POSE_SHEET_DIRECTORY = resolve(OUTPUT_DIRECTORY, "pose-sheets");
const INVERTED_STAND_ORDER = new Set([
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
]);

const FOUNDERS = [
  ["01", "The Attending", "exec-2dd2afc4-3cb2-479c-8c20-74cd45b3aa85.png"],
  ["02", "The Chart Keeper", "exec-07e780e6-9f83-4dde-ad2b-61c08ad04c52.png"],
  ["03", "The Quick Study", "exec-1fccac98-4b1b-4f26-b60e-5a3ebc1387b0.png"],
  ["04", "The Rounds Doctor", "exec-dcf0a5ca-7f26-402c-b248-3aa0fd6c9bd6.png"],
  ["05", "The Evening Consult", "exec-f018f8cf-49f8-44bb-aa7e-606098f1ce2e.png"],
  ["06", "The Clinic Runner", "exec-654fb364-8813-4994-85f9-6fadf415a56e.png"],
  ["07", "The Senior Fellow", "exec-fe80d268-920b-49b1-a537-c7f1c9e6d1c0.png"],
  ["08", "The Night Shift", "exec-3b8c1425-16e2-4a79-90d8-d453ed989e84.png"],
  ["09", "The Procedure Lead", "exec-f5d38ec7-38b3-40ec-bcb4-8d06f8ec328d.png"],
  ["10", "The On-Call Surgeon", "exec-33750b93-d61a-44f9-aa07-bd6c77750213.png"],
  ["11", "The Lead Clinician", "exec-d9e64ae1-1e0d-4bb1-a925-a7e8b3835625.png"],
  ["12", "The Analyst", "exec-aea139a1-0ef2-4e0d-b1a4-781f3c61cde0.png"],
  ["13", "The Organizer", "exec-fe3ab23d-51e5-4cb7-9a4b-18b40c50bf0f.png"],
  ["14", "The Consult Specialist", "exec-dee10de3-276b-4489-9413-70c6b4909f4d.png"],
  ["15", "The Quick Consult", "exec-812626d4-9171-4c5f-9eb8-92cf53baf873.png"],
  ["16", "The Long Call", "exec-f8a19667-95e6-4c22-9e64-05fcbc867696.png"],
  ["17", "The Note Taker", "exec-4ecc4cb7-88dc-4c0a-b1a4-e3cec69a7642.png"],
  ["18", "The Clinic Builder", "exec-96ba74d0-659f-4392-ae4a-406ec0b1b112.png"],
  ["19", "The After-Hours Doctor", "exec-b05d3e9b-34bb-48d2-9848-78a5fe15cb8a.png"],
  ["20", "The Headwrap Scholar", "exec-a83920d9-a271-4b11-a5ff-7fd0b1138867.png"],
  ["21", "Cat Clinician", "exec-867dfc7d-90a0-4a1b-bb00-cb80167d97f5.png"],
  ["22", "Penguin Resident", "exec-ac360066-3d36-4fb7-83a2-9671551f8117.png"],
  ["23", "Fox Specialist", "exec-1ddb488e-13f7-4e48-a509-d785243e0f9c.png"],
  ["24", "Rabbit Fellow", "exec-f8407397-4896-4111-bf63-32a1e4911266.png"],
  ["25", "Owl Consultant", "exec-aa13bdfc-ba71-47ec-b233-224f5b256bff.png"],
  ["26", "Frog Practitioner", "exec-77197b71-a5ed-4566-9491-9f6b78626085.png"],
  ["27", "Moon Alien", "exec-7ba47540-85c7-4cf7-a13d-dfbd35a12794.png"],
  ["28", "Antenna Alien", "exec-14653c57-aed9-4eb0-940d-fcc7b8376ace.png"],
  ["29", "Robot Clinician", "exec-f3e2a992-85bf-4921-b4b5-eb2eb5483d55.png"],
  ["30", "Axolotl Clinician", "exec-26ef736c-1506-4439-a0cb-0b760b39cf65.png"],
];

function slug(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// The generated sheets vary in dimensions. These proportional bounds preserve
// the same seven-by-three topology without assuming a fixed image size.
function cellBounds(width, height, row, column) {
  const left = Math.round((column * width) / 7);
  const right = Math.round(((column + 1) * width) / 7);
  const top = Math.round((row * height) / 3);
  const bottom = Math.round(((row + 1) * height) / 3);
  return { x: left, y: top, width: right - left, height: bottom - top };
}

function drawCell(context, image, source, target, mirror = false) {
  if (!mirror) {
    context.drawImage(image, source.x, source.y, source.width, source.height, target.x, target.y, target.width, target.height);
    return;
  }
  const flipped = createCanvas(target.width, target.height);
  const flippedContext = flipped.getContext("2d");
  flippedContext.imageSmoothingEnabled = false;
  flippedContext.translate(target.width, 0);
  flippedContext.scale(-1, 1);
  flippedContext.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, target.width, target.height);
  context.drawImage(flipped, target.x, target.y);
}

async function correctedSheet(founder) {
  const [id, label, filename] = founder;
  const image = await loadImage(resolve(SOURCE_DIRECTORY, filename));
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);

  // The human generation batch already uses the declared image-left/image-right
  // order. The nonhuman batch returned those two standing panels reversed, so
  // correct only that known source batch rather than disturbing valid humans.
  if (INVERTED_STAND_ORDER.has(id)) {
    const row1col2 = cellBounds(image.width, image.height, 0, 1);
    const row1col3 = cellBounds(image.width, image.height, 0, 2);
    drawCell(context, image, row1col3, row1col2);
    drawCell(context, image, row1col2, row1col3);
  }

  // Row two columns two/three are the canonical image-right walking pair.
  // Preserve them and derive the image-left pair only from those right frames.
  drawCell(context, image, cellBounds(image.width, image.height, 1, 1), cellBounds(image.width, image.height, 0, 6), true);
  drawCell(context, image, cellBounds(image.width, image.height, 1, 2), cellBounds(image.width, image.height, 1, 0), true);

  const target = resolve(POSE_SHEET_DIRECTORY, `founder-${id}-${slug(label)}.png`);
  writeFileSync(target, canvas.toBuffer("image/png"));
  return { ...founder, image: canvas };
}

function checkerboard(context, x, y, width, height) {
  const size = 16;
  for (let row = 0; row < height; row += size) {
    for (let column = 0; column < width; column += size) {
      context.fillStyle = ((row / size + column / size) % 2 === 0) ? "#f0ede6" : "#e0dbd0";
      context.fillRect(x + column, y + row, Math.min(size, width - column), Math.min(size, height - row));
    }
  }
}

function overview(filename, group, founders) {
  const cardWidth = 1024;
  const cardHeight = 600;
  const canvas = createCanvas(cardWidth * 2, cardHeight * 5);
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#1f2428";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < founders.length; index += 1) {
    const founder = founders[index];
    const x = (index % 2) * cardWidth;
    const y = Math.floor(index / 2) * cardHeight;
    context.fillStyle = "#f8f4eb";
    context.fillRect(x + 12, y + 12, cardWidth - 24, cardHeight - 24);
    context.fillStyle = "#24343a";
    context.font = "bold 28px sans-serif";
    context.fillText(`founder.${founder[0]}  ${founder[1]}`, x + 32, y + 48);
    context.font = "20px sans-serif";
    context.fillStyle = "#59666b";
    context.fillText(group, x + 32, y + 78);

    const map = cellBounds(founder.image.width, founder.image.height, 0, 0);
    const portrait = cellBounds(founder.image.width, founder.image.height, 2, 5);
    checkerboard(context, x + 34, y + 104, 412, 454);
    checkerboard(context, x + 576, y + 104, 412, 454);
    context.drawImage(founder.image, map.x, map.y, map.width, map.height, x + 54, y + 120, 372, 414);
    context.drawImage(founder.image, portrait.x, portrait.y, portrait.width, portrait.height, x + 596, y + 120, 372, 414);
    context.font = "bold 18px sans-serif";
    context.fillStyle = "#24343a";
    context.fillText("MAP-FRONT", x + 34, y + 586);
    context.fillText("PORTRAIT", x + 576, y + 586);
  }
  writeFileSync(resolve(OUTPUT_DIRECTORY, filename), canvas.toBuffer("image/png"));
}

mkdirSync(POSE_SHEET_DIRECTORY, { recursive: true });
const corrected = [];
for (const founder of FOUNDERS) corrected.push(await correctedSheet(founder));
overview("01-10-masculine-portrait-and-map-front.png", "Masculine-presenting human", corrected.slice(0, 10));
overview("11-20-feminine-portrait-and-map-front.png", "Feminine-presenting human", corrected.slice(10, 20));
overview("21-30-nonhuman-portrait-and-map-front.png", "Nonhuman founder", corrected.slice(20, 30));
console.log(`Wrote ${corrected.length} pose sheets and 3 owner-review overviews to ${OUTPUT_DIRECTORY}`);
