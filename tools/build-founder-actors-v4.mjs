/**
 * Extracts the approved 7x3 founder review sheets into compact transparent
 * 5x6 runtime atlases.  The sheets are source artwork only; runtime never
 * crops them directly.  Each output cell is a complete actor, so the old
 * independently-layered head/body seam cannot recur.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "generated_images/founder-character-mockups-v3/pose-sheets");
const target = resolve(root, "apps/player/public/art/characters/founders-v4");
const columns = 5;
const rows = 6;
const cellWidth = 96;
const cellHeight = 144;

const poses = {
  "front-idle": [0, 0], "left-idle": [0, 1], "right-idle": [0, 2], "back-idle": [0, 3],
  "front-walk-a": [0, 4], "front-walk-b": [0, 5], "left-walk-a": [0, 6], "left-walk-b": [1, 2],
  "right-walk-a": [1, 1], "right-walk-b": [1, 0], "back-walk-a": [1, 3], "back-walk-b": [1, 4],
  "front-seated": [1, 5], "left-seated": [1, 6], "right-seated": [2, 0], "front-working": [2, 1],
  clipboard: [2, 2], "jump-recovery": [2, 3], "star-jump": [2, 4], portrait: [2, 5],
};

function sheetCell(image, row, column) {
  const x = Math.round((column * image.width) / 7);
  const right = Math.round(((column + 1) * image.width) / 7);
  const y = Math.round((row * image.height) / 3);
  const bottom = Math.round(((row + 1) * image.height) / 3);
  return { x, y, width: right - x, height: bottom - y };
}

/** Removes the sheet's pale neutral panel by flood filling near-white pixels
 * connected to the source-cell edge.  Interior white details (eyes, badges,
 * coats) remain because only edge-connected background is cleared. */
function removePanelBackground(canvas) {
  const context = canvas.getContext("2d");
  const data = context.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height } = canvas;
  const pixels = data.data;
  const visited = new Uint8Array(width * height);
  const stack = [];
  const edgeColors = [];
  const addEdge = (index) => {
    const offset = index * 4;
    if (pixels[offset + 3] > 0) edgeColors.push([pixels[offset], pixels[offset + 1], pixels[offset + 2]]);
  };
  // Corners/near-corners are deliberately inset away from the panel rule.
  for (const x of [1, 4, width - 5, width - 2]) for (const y of [1, 4, height - 5, height - 2]) addEdge(y * width + x);
  const isPanelColor = (r, g, b) => {
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    // The review panels use lightly warm/cool greys. Treat the whole neutral
    // family as floodable, not merely one sampled shade; a white coat remains
    // safe because it is enclosed by the actor outline rather than edge-linked.
    return (Math.max(r, g, b) > 125 && spread < 34) || edgeColors.some(([er, eg, eb]) =>
      Math.abs(r - er) + Math.abs(g - eg) + Math.abs(b - eb) < 42,
    );
  };
  const pale = (index) => {
    const offset = index * 4;
    return pixels[offset + 3] > 0 && isPanelColor(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
  };
  // A simple edge flood can leak through a one-pixel anti-aliased break in an
  // outline, then erase pale fur, faces, coats, or gills inside that outline.
  // Build a *closed* contour barrier from non-panel pixels before flooding.
  // The approved paintings have occasional four-pixel breaks where a pale
  // coat/fur edge blends into the neutral review panel. Close that contour
  // before flooding. This only controls flood reach; it preserves original
  // actor RGB and still leaves genuinely open limb/tail space outside the
  // recovered silhouette transparent.
  const contourRadius = 5;
  const size = width * height;
  const barrier = new Uint8Array(size);
  for (let index = 0; index < size; index += 1) barrier[index] = pale(index) ? 0 : 1;
  // Box morphology via integral images keeps the stronger recovery radius
  // cheap even on all 600 source panels. The previous nested-neighbour
  // implementation became prohibitively slow when increasing the radius.
  const summed = (mask) => {
    const prefix = new Int32Array((width + 1) * (height + 1));
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
      const at = (y + 1) * (width + 1) + x + 1;
      prefix[at] = mask[y * width + x] + prefix[at - 1] + prefix[at - (width + 1)] - prefix[at - (width + 2)];
    }
    return prefix;
  };
  const areaSum = (prefix, minX, minY, maxX, maxY) => {
    const x0 = Math.max(0, minX); const y0 = Math.max(0, minY);
    const x1 = Math.min(width - 1, maxX); const y1 = Math.min(height - 1, maxY);
    if (x0 > x1 || y0 > y1) return 0;
    const stride = width + 1; const a = y0 * stride + x0; const b = y0 * stride + x1 + 1; const c = (y1 + 1) * stride + x0; const d = (y1 + 1) * stride + x1 + 1;
    return prefix[d] - prefix[b] - prefix[c] + prefix[a];
  };
  const barrierPrefix = summed(barrier);
  const dilated = new Uint8Array(size);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const index = y * width + x;
    dilated[index] = Number(areaSum(barrierPrefix, x - contourRadius, y - contourRadius, x + contourRadius, y + contourRadius) > 0);
  }
  const dilatedPrefix = summed(dilated);
  const closedBarrier = new Uint8Array(size);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const index = y * width + x;
    const minX = x - contourRadius; const minY = y - contourRadius; const maxX = x + contourRadius; const maxY = y + contourRadius;
    const clippedWidth = Math.min(width - 1, maxX) - Math.max(0, minX) + 1;
    const clippedHeight = Math.min(height - 1, maxY) - Math.max(0, minY) + 1;
    const allFilled = areaSum(dilatedPrefix, minX, minY, maxX, maxY) === clippedWidth * clippedHeight;
    closedBarrier[index] = barrier[index] || Number(allFilled);
  }
  for (let x = 0; x < width; x += 1) stack.push(x, (height - 1) * width + x);
  for (let y = 1; y < height - 1; y += 1) stack.push(y * width, y * width + width - 1);
  while (stack.length) {
    const index = stack.pop();
    if (index === undefined || visited[index] || !pale(index) || closedBarrier[index]) continue;
    visited[index] = 1;
    pixels[index * 4 + 3] = 0;
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) stack.push(index - 1);
    if (x + 1 < width) stack.push(index + 1);
    if (y > 0) stack.push(index - width);
    if (y + 1 < height) stack.push(index + width);
  }
  context.putImageData(data, 0, 0);
}

function actorComponents(canvas) {
  const context = canvas.getContext("2d");
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const seen = new Uint8Array(canvas.width * canvas.height);
  const components = [];
  for (let start = 0; start < seen.length; start += 1) {
    if (seen[start] || data[start * 4 + 3] < 20) continue;
    const queue = [start]; seen[start] = 1;
    const pixels = []; let minX = canvas.width; let minY = canvas.height; let maxX = 0; let maxY = 0;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const pixel = queue[cursor]; const x = pixel % canvas.width; const y = Math.floor(pixel / canvas.width);
      pixels.push(pixel); minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = x + dx; const ny = y + dy; const next = ny * canvas.width + nx;
        if (nx >= 0 && ny >= 0 && nx < canvas.width && ny < canvas.height && !seen[next] && data[next * 4 + 3] >= 20) { seen[next] = 1; queue.push(next); }
      }
    }
    components.push({ pixels, minX, minY, maxX, maxY, area: pixels.length });
  }
  const centreX = canvas.width / 2;
  const candidates = components.filter((component) => component.area > 12 && component.minY < canvas.height * 0.82);
  const main = candidates.sort((a, b) => (b.area - a.area) - Math.abs(((b.minX + b.maxX) / 2) - centreX) + Math.abs(((a.minX + a.maxX) / 2) - centreX))[0];
  if (!main) throw new Error(`No central actor component after panel cleanup (${canvas.width}x${canvas.height}).`);
  // Include close detached authored details (glasses, antenna tips) but reject
  // captions, panel borders, and guide rules below/outside the actor.
  const chosen = components.filter((component) => component === main || (
    component.area > 3 && component.minY < canvas.height * 0.80 &&
    component.maxX >= main.minX - 18 && component.minX <= main.maxX + 18 &&
    component.maxY >= main.minY - 18 && component.minY <= main.maxY + 18
  ));
  const isolated = createCanvas(canvas.width, canvas.height); const output = isolated.getContext("2d");
  const outputData = output.createImageData(canvas.width, canvas.height);
  let minX = canvas.width; let minY = canvas.height; let maxX = 0; let maxY = 0;
  for (const component of chosen) for (const pixel of component.pixels) {
    const offset = pixel * 4; outputData.data[offset] = data[offset]; outputData.data[offset + 1] = data[offset + 1]; outputData.data[offset + 2] = data[offset + 2]; outputData.data[offset + 3] = data[offset + 3];
    const x = pixel % canvas.width; const y = Math.floor(pixel / canvas.width); minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  output.putImageData(outputData, 0, 0);
  return { canvas: isolated, bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } };
}

function extractActor(image, sourceRect, portrait = false, sourceInsets = {}) {
  // Remove the source panel's border/label band before sampling its edge.
  const insetX = Math.max(10, Math.round(sourceRect.width * 0.07));
  const defaultInsetY = Math.max(12, Math.round(sourceRect.height * 0.09));
  const insetTop = sourceInsets.top ?? defaultInsetY;
  const insetBottom = sourceInsets.bottom ?? defaultInsetY;
  const safe = { x: sourceRect.x + insetX, y: sourceRect.y + insetTop, width: sourceRect.width - insetX * 2, height: sourceRect.height - insetTop - insetBottom };
  const cell = createCanvas(safe.width, safe.height);
  const ctx = cell.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, safe.x, safe.y, safe.width, safe.height, 0, 0, safe.width, safe.height);
  removePanelBackground(cell);
  const actor = actorComponents(cell);
  const output = createCanvas(cellWidth, cellHeight);
  const outputCtx = output.getContext("2d");
  outputCtx.imageSmoothingEnabled = false;
  // Preserve a common ground anchor. Portraits remain a separate detailed
  // source while using the same compact atlas geometry for CSS/Phaser crops.
  // Keep a six-pixel horizontal safety gutter for authored ears, tails and
  // elbows.  A cell must never borrow visual pixels from its neighbouring
  // founder in an atlas.
  const scale = portrait
    ? Math.min(0.90, 120 / actor.bounds.height)
    : Math.min(0.92, 128 / actor.bounds.height, 84 / actor.bounds.width);
  const width = Math.round(actor.bounds.width * scale);
  const height = Math.round(actor.bounds.height * scale);
  outputCtx.drawImage(actor.canvas, actor.bounds.x, actor.bounds.y, actor.bounds.width, actor.bounds.height, Math.round((cellWidth - width) / 2), portrait ? 10 : cellHeight - height - 8, width, height);
  return output;
}

function deriveFrontGait(frontIdle, phase, nonHuman) {
  const out = createCanvas(cellWidth, cellHeight);
  const context = out.getContext("2d");
  const source = frontIdle.getContext("2d").getImageData(0, 0, cellWidth, cellHeight);
  const target = context.createImageData(cellWidth, cellHeight);
  // Front gait is deliberately a same-actor transformation.  Keep the
  // complete head/face/torso source pixel-for-pixel.  At the lower leg/foot
  // band, gently diverge each half from the centreline as it approaches the
  // floor. This produces alternate leading feet without importing an
  // independently generated profile, detached panel fragment, or rectangle.
  const splitY = nonHuman ? 116 : 88;
  const direction = phase === "a" ? -1 : 1;
  for (let y = 0; y < cellHeight; y += 1) for (let x = 0; x < cellWidth; x += 1) {
    const from = (y * cellWidth + x) * 4;
    if (source.data[from + 3] === 0) continue;
    let offset = 0;
    if (y >= splitY) {
      const progress = Math.min(1, (y - splitY) / Math.max(1, 136 - splitY));
      const side = x < cellWidth / 2 ? -1 : 1;
      offset = Math.round(progress * 3 * side * direction);
    }
    const destinationX = Math.max(1, Math.min(cellWidth - 2, x + offset));
    const to = (y * cellWidth + destinationX) * 4;
    target.data[to] = source.data[from]; target.data[to + 1] = source.data[from + 1]; target.data[to + 2] = source.data[from + 2]; target.data[to + 3] = source.data[from + 3];
  }
  context.putImageData(target, 0, 0);
  return out;
}

/**
 * Founder side-walk B source panels proved direction-ambiguous in live play.
 * Preserve each approved identity and proportions by deriving B from the
 * opposite canonical A frame: right-facing A mirrored becomes left-facing B,
 * and vice versa. The cell geometry/floor baseline stay exactly unchanged.
 */
function mirrorActorCell(source) {
  const out = createCanvas(cellWidth, cellHeight);
  const context = out.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.translate(cellWidth, 0);
  context.scale(-1, 1);
  context.drawImage(source, 0, 0);
  return out;
}

function synthesizeJump(idle) {
  const out = createCanvas(cellWidth, cellHeight); const context = out.getContext("2d");
  context.drawImage(idle, 0, -18);
  return out;
}

/** A deterministic fingerprint of the unmodified head/face/torso zone.  It
 * deliberately excludes the leg band that changes between gait phases. */
function upperIdentitySignature(canvas) {
  const data = canvas.getContext("2d").getImageData(0, 0, cellWidth, 88).data;
  let hash = 2166136261;
  for (let index = 0; index < data.length; index += 1) {
    hash = Math.imul(hash ^ data[index], 16777619);
  }
  return hash >>> 0;
}

function drawChecker(context, x, y, width, height, size = 8) {
  for (let row = 0; row < Math.ceil(height / size); row += 1) for (let column = 0; column < Math.ceil(width / size); column += 1) {
    context.fillStyle = (row + column) % 2 === 0 ? "#eef0ee" : "#626d70";
    context.fillRect(x + column * size, y + row * size, size, size);
  }
}

function dedicatedGaitCell(image, row, column) {
  const sourceRect = { x: Math.round((column * image.width) / 4), y: Math.round((row * image.height) / 2) };
  sourceRect.width = Math.round(((column + 1) * image.width) / 4) - sourceRect.x;
  sourceRect.height = Math.round(((row + 1) * image.height) / 2) - sourceRect.y;
  const inset = Math.max(4, Math.round(Math.min(sourceRect.width, sourceRect.height) * 0.025));
  const cell = createCanvas(sourceRect.width - inset * 2, sourceRect.height - inset * 2);
  const ctx = cell.getContext("2d"); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, sourceRect.x + inset, sourceRect.y + inset, cell.width, cell.height, 0, 0, cell.width, cell.height);
  // The approved gait sheets use an opaque neutral checkerboard.  Clearing
  // checker-like pixels independently left anti-aliased source fragments in
  // some cells; those fragments showed through a moving founder.  Instead,
  // clear only edge-connected checker background and then keep the one actor
  // component (plus its close authored details) exactly as static extraction
  // does.  This makes every runtime cell true alpha with no neighbouring
  // panel/background residue.
  const data = ctx.getImageData(0, 0, cell.width, cell.height);
  const pixels = data.data;
  const floodable = (index) => {
    const offset = index * 4;
    if (pixels[offset + 3] === 0) return false;
    const r = pixels[offset]; const g = pixels[offset + 1]; const b = pixels[offset + 2];
    const neutralChecker = Math.min(r, g, b) >= 204 && Math.max(r, g, b) - Math.min(r, g, b) <= 28;
    // Several approved source sheets use the deliberately obvious magenta
    // studio matte instead of the neutral checker.  It is safe to clear only
    // when edge-connected: pink/red authored skin, clothing, and the
    // Axolotl's gills remain enclosed actor components and are retained.
    const chromaMatte = r >= 200 && b >= 150 && g <= 115;
    return neutralChecker || chromaMatte;
  };
  const visited = new Uint8Array(cell.width * cell.height);
  const stack = [];
  for (let x = 0; x < cell.width; x += 1) stack.push(x, (cell.height - 1) * cell.width + x);
  for (let y = 1; y + 1 < cell.height; y += 1) stack.push(y * cell.width, y * cell.width + cell.width - 1);
  while (stack.length) {
    const index = stack.pop();
    if (index === undefined || visited[index] || !floodable(index)) continue;
    visited[index] = 1;
    pixels[index * 4 + 3] = 0;
    const x = index % cell.width; const y = Math.floor(index / cell.width);
    if (x > 0) stack.push(index - 1);
    if (x + 1 < cell.width) stack.push(index + 1);
    if (y > 0) stack.push(index - cell.width);
    if (y + 1 < cell.height) stack.push(index + cell.width);
  }
  // A few source panels contain a small studio-matte island enclosed by an
  // illustrated outline.  Unlike broad pink/purple removal, this deliberately
  // targets only the saturated #ff00ff-style production key and therefore
  // leaves warm skin, clothing, and Axolotl details intact.
  for (let index = 0; index < cell.width * cell.height; index += 1) {
    const offset = index * 4;
    const r = pixels[offset]; const g = pixels[offset + 1]; const b = pixels[offset + 2];
    if (pixels[offset + 3] > 0 && r >= 230 && b >= 190 && g <= 80) pixels[offset + 3] = 0;
  }
  ctx.putImageData(data, 0, 0);
  const actor = actorComponents(cell);
  const output = createCanvas(cellWidth, cellHeight); const outputCtx = output.getContext("2d"); outputCtx.imageSmoothingEnabled = false;
  const scale = Math.min(0.86, 132 / actor.bounds.height, 90 / actor.bounds.width);
  const width = Math.round(actor.bounds.width * scale); const height = Math.round(actor.bounds.height * scale);
  outputCtx.drawImage(actor.canvas, actor.bounds.x, actor.bounds.y, actor.bounds.width, actor.bounds.height, Math.round((cellWidth - width) / 2), cellHeight - height - 8, width, height);
  return output;
}

mkdirSync(target, { recursive: true });
const sources = readdirSync(source).filter((name) => /^founder-\d\d-.*\.png$/i.test(name)).sort();
if (sources.length !== 30) throw new Error(`Expected 30 approved founder sheets, found ${sources.length}.`);
const poseKeys = Object.keys(poses);
const gaitPoseKeys = poseKeys.filter((pose) => pose.includes("-walk-"));
const atlases = Object.fromEntries(poseKeys.map((pose) => [pose, createCanvas(columns * cellWidth, rows * cellHeight)]));
const sourceIdentitySignatures = Object.fromEntries(gaitPoseKeys.map((pose) => [pose, []]));
for (const canvas of Object.values(atlases)) canvas.getContext("2d").imageSmoothingEnabled = false;
for (let variant = 0; variant < sources.length; variant += 1) {
  // Every live gait begins with the exact approved 21-panel founder sheet.
  // Do not use independently generated gait people: their identities drifted
  // from the canonical creator/portrait/idle actor family.
  const poseImage = await loadImage(resolve(source, sources[variant]));
  for (const pose of poseKeys) {
    const out = atlases[pose];
    const walk = /^(front|left|right|back)-walk-([ab])$/.exec(pose);
    const isFrontWalk = Boolean(walk) && (pose === "front-walk-a" || pose === "front-walk-b");
    const sourcePose = isFrontWalk ? "front-idle" : pose;
    const [sourceRow, sourceColumn] = poses[sourcePose];
    // The clipboard art sits high in its review-panel cell: the generic label
    // inset cuts through hair, ears, and antennae before component isolation.
    // Keep only the thin panel-rule margin above that pose; all other source
    // pose insets remain unchanged.
    const sourceInsets = pose === "clipboard" ? { top: 4 } : undefined;
    let cell = extractActor(poseImage, sheetCell(poseImage, sourceRow, sourceColumn), pose === "portrait", sourceInsets);
    // Both front phases are derived from canonical front idle, never from an
    // ambiguously oriented walk panel. This guarantees front-facing founder
    // identity for humans and nonhumans alike.
    if (isFrontWalk) cell = deriveFrontGait(cell, walk[2], variant >= 20);
    if (pose === "left-walk-b" || pose === "right-walk-b") {
      const oppositeA = pose === "left-walk-b" ? "right-walk-a" : "left-walk-a";
      const [oppositeRow, oppositeColumn] = poses[oppositeA];
      const oppositeCell = extractActor(
        poseImage,
        sheetCell(poseImage, oppositeRow, oppositeColumn),
      );
      cell = mirrorActorCell(oppositeCell);
    }
    if (walk) sourceIdentitySignatures[pose].push(upperIdentitySignature(cell));
    const x = (variant % columns) * cellWidth;
    const y = Math.floor(variant / columns) * cellHeight;
    out.getContext("2d").drawImage(cell, x, y);
  }
}
for (const [pose, canvas] of Object.entries(atlases)) writeFileSync(resolve(target, `founders-${pose}-v4.png`), canvas.toBuffer("image/png"));
// Human-readable proof from the exact runtime cells, not a separate mockup.
const reviewFounders = [0, 3, 10, 13, 20, 21, 23, 29];
const proof = createCanvas(8 * 150, reviewFounders.length * 180); const proofCtx = proof.getContext("2d");
proofCtx.fillStyle = "#d9dddc"; proofCtx.fillRect(0, 0, proof.width, proof.height); proofCtx.imageSmoothingEnabled = false;
for (let row = 0; row < reviewFounders.length; row += 1) {
  const variant = reviewFounders[row];
  for (let column = 0; column < 8; column += 1) {
    const direction = ["front", "front", "back", "back", "left", "left", "right", "right"][column];
    const phase = column % 2 === 0 ? "a" : "b";
    const atlas = atlases[`${direction}-walk-${phase}`]; const x = (variant % columns) * cellWidth; const y = Math.floor(variant / columns) * cellHeight;
    drawChecker(proofCtx, column * 150 + 2, row * 180 + 2, 146, 176);
    proofCtx.drawImage(atlas, x, y, cellWidth, cellHeight, column * 150 + 27, row * 180 + 18, 96, 144);
    proofCtx.fillStyle = "#20282a"; proofCtx.font = "bold 12px sans-serif"; proofCtx.fillText(`${direction} ${phase.toUpperCase()}`, column * 150 + 34, row * 180 + 166);
  }
  proofCtx.fillStyle = "#20282a"; proofCtx.font = "bold 12px sans-serif"; proofCtx.fillText(`founder.${String(variant + 1).padStart(2, "0")}`, 4, row * 180 + 14);
}
mkdirSync(resolve(root, "artifacts/screenshots"), { recursive: true });
writeFileSync(resolve(root, "artifacts/screenshots/founder-v4-gait-proof.png"), proof.toBuffer("image/png"));
// A dense all-founder continuity sheet makes identity drift auditable at a
// glance: canonical front idle, then the two live front gait phases.
const frontIdleAtlas = await loadImage(resolve(target, "founders-front-idle-v4.png"));
const continuity = createCanvas(5 * 288, 6 * 154); const continuityCtx = continuity.getContext("2d");
continuityCtx.fillStyle = "#eef0ee"; continuityCtx.fillRect(0, 0, continuity.width, continuity.height); continuityCtx.imageSmoothingEnabled = false;
for (let variant = 0; variant < 30; variant += 1) {
  const groupX = (variant % 5) * 288; const groupY = Math.floor(variant / 5) * 154;
  continuityCtx.fillStyle = "#d6dcda"; continuityCtx.fillRect(groupX + 1, groupY + 1, 286, 152);
  drawChecker(continuityCtx, groupX + 3, groupY + 18, 282, 132, 6);
  continuityCtx.fillStyle = "#20282a"; continuityCtx.font = "bold 11px sans-serif"; continuityCtx.fillText(`founder.${String(variant + 1).padStart(2, "0")}`, groupX + 8, groupY + 13);
  for (const [index, [label, atlas]] of [["idle", frontIdleAtlas], ["front A", atlases["front-walk-a"]], ["front B", atlases["front-walk-b"]]].entries()) {
    const sourceX = (variant % columns) * cellWidth; const sourceY = Math.floor(variant / columns) * cellHeight;
    const destinationX = groupX + 7 + index * 93;
    continuityCtx.drawImage(atlas, sourceX, sourceY, cellWidth, cellHeight, destinationX, groupY + 23, 86, 129);
    continuityCtx.fillStyle = "#20282a"; continuityCtx.font = "10px sans-serif"; continuityCtx.fillText(label, destinationX + 23, groupY + 147);
  }
}
writeFileSync(resolve(root, "artifacts/screenshots/founder-v4-identity-continuity-all-30.png"), continuity.toBuffer("image/png"));
// Clipboard work pose proof, from exact runtime cells on a checkerboard, makes
// head/ear/antenna clipping visible before a Phaser scene is opened.
const clipboardProof = createCanvas(5 * 144, 6 * 166); const clipboardCtx = clipboardProof.getContext("2d");
clipboardCtx.fillStyle = "#d9dddc"; clipboardCtx.fillRect(0, 0, clipboardProof.width, clipboardProof.height); clipboardCtx.imageSmoothingEnabled = false;
for (let variant = 0; variant < 30; variant += 1) {
  const groupX = (variant % 5) * 144; const groupY = Math.floor(variant / 5) * 166;
  drawChecker(clipboardCtx, groupX + 3, groupY + 17, 138, 144, 6);
  const sourceX = (variant % columns) * cellWidth; const sourceY = Math.floor(variant / columns) * cellHeight;
  clipboardCtx.drawImage(atlases.clipboard, sourceX, sourceY, cellWidth, cellHeight, groupX + 24, groupY + 14, 96, 144);
  clipboardCtx.fillStyle = "#20282a"; clipboardCtx.font = "bold 11px sans-serif"; clipboardCtx.fillText(`founder.${String(variant + 1).padStart(2, "0")}`, groupX + 7, groupY + 12);
}
writeFileSync(resolve(root, "artifacts/screenshots/founder-v4-clipboard-proof.png"), clipboardProof.toBuffer("image/png"));
writeFileSync(resolve(target, "manifest.json"), JSON.stringify({
  version: 4, contentRevision: "founders-v4-r8", cells: { width: cellWidth, height: cellHeight, columns, rows }, floorAnchor: { x: 48, y: 136 },
  clipboardExtraction: { sourceTopInset: 4, completeHeadRequired: true },
  variants: sources.map((name, index) => ({ id: `founder.${String(index + 1).padStart(2, "0")}`, source: name })),
  // These source slots are part of the gait contract: authored sheet row 2
  // contains two opposing side-facing strides.  Keep the semantic direction
  // explicit so a future extraction cannot silently swap east and west.
  sourcePoseSlots: poses,
  horizontalWalkDerivation: {
    "left-walk-b": { mirrorOf: "right-walk-a" },
    "right-walk-b": { mirrorOf: "left-walk-a" },
  },
  sourceIdentitySignatures,
  poses: Object.fromEntries(Object.keys(poses).map((pose) => [pose, `founders-${pose}-v4.png`])),
  walkPhases: { a: "left-foot-forward", b: "right-foot-forward" },
}, null, 2));
console.log(`Built ${Object.keys(poses).length} founder v4 atlases for ${sources.length} founders.`);
