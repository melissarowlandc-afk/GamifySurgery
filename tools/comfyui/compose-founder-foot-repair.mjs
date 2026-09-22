import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = resolve(import.meta.dirname, "../..");
const reviewDirectory = resolve(
  root,
  "Photos for Codex 2/Codex Founders 2/founder-11-foot-repair",
);
const candidateDirectory = resolve(reviewDirectory, "composed-candidates-424242");
const cell = { width: 128, height: 192 };
const floorAnchorY = 181;
const configurations = [
  {
    pose: "front-idle",
    generation: "front-idle-candidate-sourceonly-424242/raw-generation-qa.png",
    clear: [{ left: 35, top: 169, right: 95, bottom: 182 }],
    shoes: [
      { source: { x: 370, y: 944, width: 122, height: 52 }, destination: { x: 37, y: 170, width: 27, height: 11 } },
      { source: { x: 535, y: 944, width: 126, height: 52 }, destination: { x: 64, y: 170, width: 29, height: 11 } },
    ],
  },
  {
    pose: "left-idle",
    generation: "left-idle-candidate-sourceonly-424242/raw-generation-qa.png",
    clear: [{ left: 30, top: 169, right: 78, bottom: 182 }],
    shoes: [
      { source: { x: 405, y: 940, width: 160, height: 57 }, destination: { x: 49, y: 173, width: 22, height: 8 } },
      { source: { x: 360, y: 940, width: 135, height: 55 }, destination: { x: 35, y: 169, width: 29, height: 12 } },
    ],
  },
  {
    pose: "right-idle",
    generation: "right-idle-candidate-sourceonly-424242/raw-generation-qa.png",
    clear: [{ left: 44, top: 169, right: 93, bottom: 182 }],
    shoes: [
      { source: { x: 455, y: 940, width: 135, height: 56 }, destination: { x: 55, y: 173, width: 22, height: 8 } },
      { source: { x: 525, y: 940, width: 135, height: 55 }, destination: { x: 64, y: 169, width: 29, height: 12 } },
    ],
  },
];

function sourceCellPath(pose) {
  return resolve(reviewDirectory, `founder-11-${pose}-source-cell.png`);
}

function within(rectangle, x, y) {
  return x >= rectangle.left && x < rectangle.right &&
    y >= rectangle.top && y < rectangle.bottom;
}

function isolateDarkShoe(image, source) {
  const output = createCanvas(source.width, source.height);
  const context = output.getContext("2d");
  context.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    source.width,
    source.height,
  );
  const data = context.getImageData(0, 0, output.width, output.height);
  for (let index = 0; index < data.data.length; index += 4) {
    const red = data.data[index];
    const green = data.data[index + 1];
    const blue = data.data[index + 2];
    const alpha = data.data[index + 3];
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const warmSkin = red > 120 && red > green * 1.08 && green > blue * 1.08;
    const darkness = Math.max(0, Math.min(1, (158 - luminance) / 52));
    data.data[index + 3] = warmSkin ? 0 : Math.round(alpha * darkness);
  }
  context.putImageData(data, 0, 0);
  return output;
}

function pixelDifference(source, candidate, permittedRects) {
  const sourcePixels = source.getContext("2d").getImageData(0, 0, cell.width, cell.height).data;
  const candidatePixels = candidate.getContext("2d").getImageData(0, 0, cell.width, cell.height).data;
  let changed = 0;
  let outside = 0;
  let left = cell.width;
  let top = cell.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < cell.height; y += 1) for (let x = 0; x < cell.width; x += 1) {
    const index = (y * cell.width + x) * 4;
    let different = false;
    for (let channel = 0; channel < 4; channel += 1) {
      if (sourcePixels[index + channel] !== candidatePixels[index + channel]) different = true;
    }
    if (!different) continue;
    changed += 1;
    if (!permittedRects.some((rectangle) => within(rectangle, x, y))) outside += 1;
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }
  let alphaBottom = -1;
  let floorBandAlpha = 0;
  for (let y = 0; y < cell.height; y += 1) for (let x = 0; x < cell.width; x += 1) {
    const alpha = candidatePixels[(y * cell.width + x) * 4 + 3];
    if (alpha > 12) {
      alphaBottom = Math.max(alphaBottom, y);
      if (y >= 170 && y <= floorAnchorY) floorBandAlpha += 1;
    }
  }
  return {
    changed,
    outside,
    changedBounds: changed ? { left, top, right, bottom } : null,
    alphaBottom,
    floorBandAlpha,
  };
}

mkdirSync(candidateDirectory, { recursive: true });
const results = [];
for (const configuration of configurations) {
  const [sourceImage, generatedImage] = await Promise.all([
    loadImage(sourceCellPath(configuration.pose)),
    loadImage(resolve(reviewDirectory, configuration.generation)),
  ]);
  const source = createCanvas(cell.width, cell.height);
  source.getContext("2d").drawImage(sourceImage, 0, 0);
  const candidate = createCanvas(cell.width, cell.height);
  const context = candidate.getContext("2d");
  context.drawImage(sourceImage, 0, 0);
  for (const rectangle of configuration.clear) {
    context.clearRect(
      rectangle.left,
      rectangle.top,
      rectangle.right - rectangle.left,
      rectangle.bottom - rectangle.top,
    );
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  for (const shoe of configuration.shoes) {
    const isolated = isolateDarkShoe(generatedImage, shoe.source);
    context.drawImage(
      isolated,
      0,
      0,
      isolated.width,
      isolated.height,
      shoe.destination.x,
      shoe.destination.y,
      shoe.destination.width,
      shoe.destination.height,
    );
  }
  // The map registration contract permits contact on row 181, never below it.
  context.clearRect(0, floorAnchorY + 1, cell.width, cell.height - floorAnchorY - 1);
  const metrics = pixelDifference(source, candidate, configuration.clear);
  if (metrics.outside !== 0) throw new Error(`${configuration.pose} changed ${metrics.outside} pixels outside its approved repair region.`);
  if (metrics.alphaBottom > floorAnchorY) throw new Error(`${configuration.pose} exceeds floor row ${floorAnchorY}.`);
  if (metrics.floorBandAlpha < 40) throw new Error(`${configuration.pose} has too little visible shoe coverage (${metrics.floorBandAlpha}).`);
  const filename = `founder-11-${configuration.pose}-composed-candidate.png`;
  writeFileSync(resolve(candidateDirectory, filename), candidate.toBuffer("image/png"));
  results.push({ ...configuration, filename, metrics });
}

const proofScale = 4;
const proof = createCanvas(configurations.length * cell.width * proofScale, cell.height * proofScale * 2 + 52);
const proofContext = proof.getContext("2d");
proofContext.fillStyle = "#d9dddc";
proofContext.fillRect(0, 0, proof.width, proof.height);
proofContext.font = "bold 18px sans-serif";
proofContext.fillStyle = "#20282a";
proofContext.fillText("SOURCE", 8, 21);
proofContext.fillText("CORTAN SHOE COMPOSITE", 8, cell.height * proofScale + 47);
proofContext.imageSmoothingEnabled = false;
for (let index = 0; index < results.length; index += 1) {
  const result = results[index];
  const [sourceImage, candidateImage] = await Promise.all([
    loadImage(sourceCellPath(result.pose)),
    loadImage(resolve(candidateDirectory, result.filename)),
  ]);
  const x = index * cell.width * proofScale;
  proofContext.drawImage(sourceImage, x, 26, cell.width * proofScale, cell.height * proofScale);
  proofContext.drawImage(candidateImage, x, cell.height * proofScale + 52, cell.width * proofScale, cell.height * proofScale);
  proofContext.fillStyle = "#20282a";
  proofContext.fillText(result.pose, x + 8, 21);
}
writeFileSync(resolve(candidateDirectory, "source-vs-composed-proof.png"), proof.toBuffer("image/png"));
writeFileSync(
  resolve(candidateDirectory, "composition-audit.json"),
  JSON.stringify({ floorAnchorY, results }, null, 2),
  "utf8",
);
console.log(`Composed ${results.length} Cortan-derived founder-foot candidates in ${candidateDirectory}`);
