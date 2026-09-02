import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { verifyFounderActors } from "./verify-character-resolution-alpha.mjs";

const root = resolve(import.meta.dirname, "..");
const directory = resolve(root, "apps/player/public/art/characters/founders-v4");
const manifest = JSON.parse(readFileSync(resolve(directory, "manifest.json"), "utf8"));
const directions = ["front", "left", "right", "back"];
function lowerBodyHashes(image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  const hashes = [];
  for (let index = 0; index < 30; index += 1) {
    const col = index % 5; const row = Math.floor(index / 5);
    let hash = 2166136261;
    for (let y = row * 192 + 109; y < row * 192 + 192; y += 1) for (let x = col * 128; x < col * 128 + 128; x += 1) {
      const offset = (y * image.width + x) * 4;
      hash = Math.imul(hash ^ data[offset], 16777619);
      hash = Math.imul(hash ^ data[offset + 1], 16777619);
      hash = Math.imul(hash ^ data[offset + 2], 16777619);
      hash = Math.imul(hash ^ data[offset + 3], 16777619);
    }
    hashes.push(hash >>> 0);
  }
  return hashes;
}
function upperIdentityHashes(image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  const hashes = [];
  for (let index = 0; index < 30; index += 1) {
    const col = index % 5; const row = Math.floor(index / 5);
    let hash = 2166136261;
    for (let y = row * 192; y < row * 192 + 117; y += 1) for (let x = col * 128; x < col * 128 + 128; x += 1) {
      const offset = (y * image.width + x) * 4;
      for (const value of [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]]) hash = Math.imul(hash ^ value, 16777619);
    }
    hashes.push(hash >>> 0);
  }
  return hashes;
}
function alphaFloorRows(image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  return Array.from({ length: 30 }, (_, index) => {
    const left = (index % 5) * 128;
    const top = Math.floor(index / 5) * 192;
    let floor = -1;
    for (let y = 0; y < 192; y += 1) for (let x = 0; x < 128; x += 1) {
      if (data[((top + y) * image.width + left + x) * 4 + 3] > 12) floor = Math.max(floor, y);
    }
    return floor;
  });
}
function assertExactHorizontalMirror(
  derived,
  canonicalOpposite,
  label,
) {
  const derivedCanvas = createCanvas(derived.width, derived.height);
  const oppositeCanvas = createCanvas(canonicalOpposite.width, canonicalOpposite.height);
  derivedCanvas.getContext("2d").drawImage(derived, 0, 0);
  oppositeCanvas.getContext("2d").drawImage(canonicalOpposite, 0, 0);
  const actual = derivedCanvas.getContext("2d").getImageData(0, 0, derived.width, derived.height).data;
  const expected = oppositeCanvas.getContext("2d").getImageData(0, 0, canonicalOpposite.width, canonicalOpposite.height).data;
  for (let founder = 0; founder < 30; founder += 1) {
    const left = (founder % 5) * 128;
    const top = Math.floor(founder / 5) * 192;
    for (let y = 0; y < 192; y += 1) for (let x = 0; x < 128; x += 1) {
      const actualOffset = ((top + y) * derived.width + left + x) * 4;
      const expectedOffset = ((top + y) * canonicalOpposite.width + left + 127 - x) * 4;
      for (let channel = 0; channel < 4; channel += 1) if (actual[actualOffset + channel] !== expected[expectedOffset + channel]) {
        throw new Error(`${label} founder ${founder + 1} is not an exact horizontal mirror of its canonical opposite-facing A stride.`);
      }
    }
  }
}
function assertTransparentPerimeters(image, pose) {
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  for (let index = 0; index < 30; index += 1) {
    const left = (index % 5) * 128; const top = Math.floor(index / 5) * 192;
    let opaqueEdge = 0;
    for (let x = left; x < left + 128; x += 1) for (const y of [top, top + 191]) if (data[(y * image.width + x) * 4 + 3] > 12) opaqueEdge += 1;
    for (let y = top + 1; y < top + 191; y += 1) for (const x of [left, left + 127]) if (data[(y * image.width + x) * 4 + 3] > 12) opaqueEdge += 1;
    if (opaqueEdge > 0) throw new Error(`${pose} founder ${index + 1} has opaque cell-edge panel residue.`);
  }
}
function assertNoChromaMatte(image, pose) {
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  for (let index = 0; index < data.length; index += 4) {
    const [r, g, b, alpha] = [data[index], data[index + 1], data[index + 2], data[index + 3]];
    // Chroma key is reserved for source-sheet background only.  The runtime
    // atlas may contain warm skin and pink gills, but not studio-magenta.
    if (alpha > 12 && r >= 230 && b >= 190 && g <= 80) {
      throw new Error(`${pose} retains opaque chroma-matte residue.`);
    }
  }
}
function assertFrontIdleFeet(image) {
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  for (let founder = 0; founder < 30; founder += 1) {
    const left = (founder % 5) * 128; const top = Math.floor(founder / 5) * 192;
    let lowerBodyPixels = 0;
    for (let y = top + 173; y < top + 191; y += 1) for (let x = left + 11; x < left + 117; x += 1) {
      if (data[(y * image.width + x) * 4 + 3] > 12) lowerBodyPixels += 1;
    }
    if (lowerBodyPixels === 0) throw new Error(`front-idle founder ${founder + 1} has no visible feet in the floor band.`);
  }
}
function assertFrontWalkCoverage(image, phase) {
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  for (let founder = 0; founder < 30; founder += 1) {
    const left = (founder % 5) * 128; const top = Math.floor(founder / 5) * 192;
    let torsoCoverage = 0;
    for (let y = top + 36; y < top + 108; y += 1) for (let x = left + 24; x < left + 72; x += 1) {
      if (data[(y * image.width + x) * 4 + 3] > 12) torsoCoverage += 1;
    }
    // A front-facing person/creature occupies a substantial central body area.
    // This catches a broken panel extraction that leaves a large transparent
    // wedge through the founder while permitting natural inter-leg spacing.
    if (torsoCoverage < 620) throw new Error(`front ${phase} founder ${founder + 1} has implausibly sparse central body coverage.`);
  }
}
/** Detect alpha holes that a light proof can hide. We recover a one-pixel
 * closed alpha silhouette and inspect only its upper body, leaving natural
 * foot/tail spacing below the torso outside this diagnostic. */
function assertNoLargeInteriorAlphaHoles(image, pose) {
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  for (let founder = 0; founder < 30; founder += 1) {
    const left = (founder % 5) * 128; const top = Math.floor(founder / 5) * 192;
    const width = 128; const height = 112; const count = width * height;
    const opaque = new Uint8Array(count);
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) opaque[y * width + x] = data[((top + y) * image.width + left + x) * 4 + 3] > 12 ? 1 : 0;
    const dilated = new Uint8Array(count);
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
      for (let dy = -1; dy <= 1 && !dilated[y * width + x]; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx; const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && opaque[ny * width + nx]) { dilated[y * width + x] = 1; break; }
      }
    }
    const closed = new Uint8Array(count);
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
      let allFilled = true;
      for (let dy = -1; dy <= 1 && allFilled; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx; const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height || !dilated[ny * width + nx]) { allFilled = false; break; }
      }
      closed[y * width + x] = opaque[y * width + x] || Number(allFilled);
    }
    const seen = new Uint8Array(count); let largestHole = 0;
    for (let start = 0; start < count; start += 1) {
      if (seen[start] || opaque[start] || !closed[start]) continue;
      const queue = [start]; seen[start] = 1;
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const pixel = queue[cursor]; const x = pixel % width; const y = Math.floor(pixel / width);
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = x + dx; const ny = y + dy; const next = ny * width + nx;
          if (nx >= 0 && ny >= 0 && nx < width && ny < height && !seen[next] && !opaque[next] && closed[next]) { seen[next] = 1; queue.push(next); }
        }
      }
      largestHole = Math.max(largestHole, queue.length);
    }
    // Smaller recovered pockets occur naturally between arms, ears, tails,
    // and coats. A matte leak is substantially larger (as the former Rabbit,
    // Axolotl, and white-coat failures were), so keep the threshold high
    // enough to avoid rejecting authored negative space while still catching
    // a visible checkerboard-sized hole.
    if (largestHole > 64) throw new Error(`${pose} founder ${founder + 1} has a ${largestHole}px transparent hole inside its recovered upper-body silhouette.`);
  }
}
async function assertCompleteClipboardHeads() {
  const image = await loadImage(resolve(directory, manifest.poses.clipboard));
  const canvas = createCanvas(image.width, image.height); const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, image.width, image.height).data;
  for (let founder = 0; founder < 30; founder += 1) {
    const left = (founder % 5) * 128; const top = Math.floor(founder / 5) * 192;
    let headPixels = 0; let firstOpaque = 192;
    // The rendered head/ears/antennae must occupy the complete top identity
    // zone, rather than a re-scaled neck/torso after the source crop removes
    // its actual top. This catches the former clipboard-only panel-inset bug.
    for (let y = 4; y < 54; y += 1) for (let x = 12; x < 84; x += 1) {
      if (data[((top + y) * image.width + left + x) * 4 + 3] > 12) { headPixels += 1; firstOpaque = Math.min(firstOpaque, y); }
    }
    if (firstOpaque > 13 || headPixels < 450) throw new Error(`clipboard founder ${founder + 1} has a clipped or missing head (top=${firstOpaque}, pixels=${headPixels}).`);
  }
}
if (manifest.variants.length !== 30) throw new Error("Founder manifest must contain exactly 30 identities.");
if (manifest.contentRevision !== "founders-v4-r9-hires") throw new Error("Founder manifest must declare the active r8 content revision.");
if (manifest.clipboardExtraction?.sourceTopInset > 6 || manifest.clipboardExtraction?.completeHeadRequired !== true) throw new Error("Clipboard atlas must retain the complete source head above the panel-label inset.");
if (manifest.floorAnchor?.y !== 181) throw new Error("Founder feet must use the approved-pose floor baseline.");
if (!manifest.sourceIdentitySignatures) throw new Error("Founder manifest must include source-driven identity signatures.");
const expectedHorizontalSourceSlots = {
  "left-walk-a": [0, 6],
  "right-walk-a": [1, 1],
};
for (const [pose, expected] of Object.entries(expectedHorizontalSourceSlots)) {
  const actual = manifest.sourcePoseSlots?.[pose];
  if (!Array.isArray(actual) || actual.length !== 2 || actual[0] !== expected[0] || actual[1] !== expected[1]) {
    throw new Error(`${pose} must retain its canonical ${pose.startsWith("left") ? "left" : "right"}-facing source slot ${expected.join(",")}.`);
  }
}
const expectedDerivations = {
  "left-walk-b": "right-walk-a",
  "right-walk-b": "left-walk-a",
};
for (const [pose, mirrorOf] of Object.entries(expectedDerivations)) {
  if (manifest.horizontalWalkDerivation?.[pose]?.mirrorOf !== mirrorOf) {
    throw new Error(`${pose} must be recorded as a deterministic horizontal mirror of ${mirrorOf}.`);
  }
}
for (const variant of manifest.variants) if (Object.hasOwn(variant, "gaitSource")) throw new Error("Live founder gaits must not use independent gait-source identities.");
if (manifest.walkPhases.a !== "left-foot-forward" || manifest.walkPhases.b !== "right-foot-forward") throw new Error("Walk phase contract missing.");
for (const direction of directions) {
  for (const phase of ["a", "b"]) {
    const filename = manifest.poses[`${direction}-walk-${phase}`];
    if (!filename || !existsSync(resolve(directory, filename))) throw new Error(`Missing ${direction} walk ${phase}.`);
  }
  const [a, b] = await Promise.all(["a", "b"].map((phase) => loadImage(resolve(directory, manifest.poses[`${direction}-walk-${phase}`]))));
  if (a.width !== 640 || a.height !== 1152 || b.width !== 640 || b.height !== 1152) throw new Error(`Unexpected ${direction} atlas geometry.`);
  assertTransparentPerimeters(a, `${direction}-a`); assertTransparentPerimeters(b, `${direction}-b`);
  assertNoChromaMatte(a, `${direction}-a`); assertNoChromaMatte(b, `${direction}-b`);
  // Distinct source atlases provide an auditable lower-body phase difference.
  if (readFileSync(resolve(directory, manifest.poses[`${direction}-walk-a`])).equals(readFileSync(resolve(directory, manifest.poses[`${direction}-walk-b`])))) throw new Error(`${direction} walk A/B atlases are identical.`);
  const aHashes = lowerBodyHashes(a); const bHashes = lowerBodyHashes(b);
  const aUpper = upperIdentityHashes(a); const bUpper = upperIdentityHashes(b);
  const aFloors = alphaFloorRows(a); const bFloors = alphaFloorRows(b);
  // B is intentionally an *exact* mirror of the canonical opposite-facing A
  // frame. A small number of approved source identities drew the two A poses
  // as mirror-equivalent lower bodies, so their transformed A/B pixels are
  // necessarily equal. The exact mirror contract below is stronger than a
  // synthetic lower-body displacement and keeps their approved proportions.
  const distinctStrideCount = aHashes.filter((hash, founder) => hash !== bHashes[founder]).length;
  if (distinctStrideCount === 0) throw new Error(`${direction} gait pair contains no distinct authored stride extremes.`);
  for (let founder = 0; founder < 30; founder += 1) if (aFloors[founder] !== bFloors[founder] || aFloors[founder] > manifest.floorAnchor.y || bFloors[founder] > manifest.floorAnchor.y) {
    throw new Error(`${direction} founder ${founder + 1} changes or exceeds the canonical floor anchor across gait phases.`);
  }
  for (const [phase, hashes] of [["a", aUpper], ["b", bUpper]]) {
    const expected = manifest.sourceIdentitySignatures[`${direction}-walk-${phase}`];
    if (!Array.isArray(expected) || expected.length !== 30) throw new Error(`${direction} ${phase} has no complete canonical source signature.`);
    for (let founder = 0; founder < 30; founder += 1) if (hashes[founder] !== expected[founder]) {
      throw new Error(`${direction} ${phase} founder ${founder + 1} does not match its canonical approved source identity.`);
    }
  }
}
const [leftB, rightA, rightB, leftA] = await Promise.all([
  "left-walk-b", "right-walk-a", "right-walk-b", "left-walk-a",
].map((pose) => loadImage(resolve(directory, manifest.poses[pose]))));
assertExactHorizontalMirror(leftB, rightA, "left walk B");
assertExactHorizontalMirror(rightB, leftA, "right walk B");
const frontIdle = await loadImage(resolve(directory, manifest.poses["front-idle"]));
assertFrontIdleFeet(frontIdle);
await assertCompleteClipboardHeads();
const [frontWalkA, frontWalkB] = await Promise.all(["a", "b"].map((phase) => loadImage(resolve(directory, manifest.poses[`front-walk-${phase}`]))));
const idleUpper = upperIdentityHashes(frontIdle);
for (const [phase, image] of [["a", frontWalkA], ["b", frontWalkB]]) {
  const upper = upperIdentityHashes(image);
  assertFrontWalkCoverage(image, phase);
  for (let founder = 0; founder < 30; founder += 1) if (upper[founder] !== idleUpper[founder]) {
    throw new Error(`front ${phase} founder ${founder + 1} changes canonical idle upper-body identity.`);
  }
}
for (const [pose, filename] of Object.entries(manifest.poses)) {
  if (!existsSync(resolve(directory, filename))) throw new Error(`Missing ${pose} atlas.`);
  assertNoLargeInteriorAlphaHoles(await loadImage(resolve(directory, filename)), pose);
}
console.log("Founder v4 verifier passed: 30 identities, 20 pose atlases, four explicit A/B walk pairs.");

await verifyFounderActors();
console.log("Founder v4 shared high-resolution alpha audit passed.");
