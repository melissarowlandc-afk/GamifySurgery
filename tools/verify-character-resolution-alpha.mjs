/** Shared topology-aware validation for rebuilt high-resolution actor atlases. */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = resolve(import.meta.dirname, "..");
const threshold = 12;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
function dataOf(image) { const canvas = createCanvas(image.width, image.height); const ctx = canvas.getContext("2d"); ctx.drawImage(image, 0, 0); return ctx.getImageData(0, 0, image.width, image.height).data; }
function parts(data, imageWidth, left, top, width, height) {
  const seen = new Uint8Array(width * height), result = [];
  for (let start = 0; start < seen.length; start += 1) {
    if (seen[start]) continue;
    const sx = start % width, sy = Math.floor(start / width), startOffset = ((top + sy) * imageWidth + left + sx) * 4;
    if (data[startOffset + 3] <= threshold) { seen[start] = 1; continue; }
    const queue = [start]; seen[start] = 1; let minX = sx, maxX = sx, minY = sy, maxY = sy, pale = 0;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const at = queue[cursor], x = at % width, y = Math.floor(at / width), offset = ((top + y) * imageWidth + left + x) * 4;
      if (Math.min(data[offset], data[offset + 1], data[offset + 2]) >= 220 && Math.max(data[offset], data[offset + 1], data[offset + 2]) - Math.min(data[offset], data[offset + 1], data[offset + 2]) <= 24) pale += 1;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const nx = x + dx, ny = y + dy, next = ny * width + nx; if (nx >= 0 && ny >= 0 && nx < width && ny < height && !seen[next]) { const nextOffset = ((top + ny) * imageWidth + left + nx) * 4; if (data[nextOffset + 3] > threshold) { seen[next] = 1; queue.push(next); } } }
    }
    result.push({ count: queue.length, minX, maxX, minY, maxY, pale });
  }
  return result.sort((a, b) => b.count - a.count);
}
function sourceMatteKind(r, g, b) {
  // Runtime art intentionally contains white coats and pale paper. The source
  // mattes are narrower families: a mid-pale neutral checker (not clean white)
  // or the high-saturation magenta studio key. We inspect only meaningful
  // clusters that touch transparent exterior, never every light artwork pixel.
  // Keep this much narrower than ordinary grey/white clothing: the canonical
  // checker uses a flat, mid-pale neutral swatch, while coat shading spans a
  // wider range and clean white remains above this band.
  const neutralChecker = Math.min(r, g, b) >= 205 && Math.max(r, g, b) <= 220 && Math.max(r, g, b) - Math.min(r, g, b) <= 6;
  const chromaKey = r >= 210 && b >= 150 && g <= 120;
  return chromaKey ? 2 : neutralChecker ? 1 : 0;
}
function assertNoMatteBoundaryClusters(data, imageWidth, left, top, width, height, label) {
  const marked = new Uint8Array(width * height), seen = new Uint8Array(width * height);
  for (let y = 1; y + 1 < height; y += 1) for (let x = 1; x + 1 < width; x += 1) {
    const offset = ((top + y) * imageWidth + left + x) * 4;
    const kind = sourceMatteKind(data[offset], data[offset + 1], data[offset + 2]);
    if (data[offset + 3] <= threshold || !kind) continue;
    // It is a visible rim/remnant only when connected to transparent exterior.
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (data[((top + y + dy) * imageWidth + left + x + dx) * 4 + 3] <= threshold) { marked[y * width + x] = kind; break; }
  }
  for (let start = 0; start < marked.length; start += 1) {
    if (!marked[start] || seen[start]) continue;
    const queue = [start]; seen[start] = 1; let chroma = marked[start] === 2 ? 1 : 0;
    for (let cursor = 0; cursor < queue.length; cursor += 1) { const at = queue[cursor], x = at % width, y = Math.floor(at / width); for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) { const nx = x + dx, ny = y + dy, next = ny * width + nx; if (nx >= 0 && ny >= 0 && nx < width && ny < height && marked[next] && !seen[next]) { seen[next] = 1; chroma += marked[next] === 2 ? 1 : 0; queue.push(next); } } }
    // A short neutral anti-alias sequence can legitimately sit on a pale coat
    // edge. A >=20px run is a visible checker/matte rim; chroma is never
    // authored at the source-key hue, so even a compact three-pixel cluster is
    // meaningful evidence of an unfinished extraction.
    assert(!(queue.length >= 20 || chroma >= 3), `${label} retains a ${queue.length}px source-matte/checker/chroma rim on its silhouette boundary.`);
  }
}
function checkCell(data, imageWidth, left, top, width, height, floor, label) {
  let opaque = 0;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const offset = ((top + y) * imageWidth + left + x) * 4;
    if (data[offset + 3] <= threshold) continue;
    opaque += 1;
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) throw new Error(`${label} has alpha in its gutter.`);
  }
  assert(opaque > width * height * .01, `${label} lacks a retained actor.`);
  assertNoMatteBoundaryClusters(data, imageWidth, left, top, width, height, label);
  const all = parts(data, imageWidth, left, top, width, height), primary = all[0]; assert(primary?.count > 120, `${label} has no primary actor component.`);
  for (const part of all.slice(1)) {
    const shallow = part.maxY - part.minY < Math.max(4, height * .045), wide = part.maxX - part.minX > width * .25, nearFloor = part.minY >= floor - height * .11, neutral = part.pale / part.count > .80;
    assert(!(shallow && wide && nearFloor && neutral), `${label} retains a detached pale baseline.`);
    const dx = part.maxX < primary.minX ? primary.minX - part.maxX - 1 : primary.maxX < part.minX ? part.minX - primary.maxX - 1 : 0;
    const dy = part.maxY < primary.minY ? primary.minY - part.maxY - 1 : primary.maxY < part.minY ? part.minY - primary.maxY - 1 : 0;
    assert(!(part.count > 20 && Math.max(dx, dy) > width * .09 && part.pale / part.count > .70), `${label} retains exterior neutral matte residue.`);
  }
}
async function pack({ folder, revision, identities, rows, poseNames, whiteRegression }) {
  const directory = resolve(root, folder), manifest = JSON.parse(readFileSync(resolve(directory, "manifest.json"), "utf8"));
  const cell = manifest.cells ?? manifest.mapCell, anchor = manifest.floorAnchor ?? cell.floorAnchor;
  assert(manifest.contentRevision === revision, `${folder} revision mismatch.`); assert(manifest.variants?.length === identities, `${folder} identity count mismatch.`);
  assert(cell.width === 128 && cell.height === 192 && anchor.x === 64 && anchor.y === 181, `${folder} must use 128x192 cells anchored at 64,181.`);
  const expectedPoseCount = folder.includes("patients-v1") ? poseNames.length + 2 : poseNames.length;
  assert(Object.keys(manifest.poses ?? {}).length === expectedPoseCount, `${folder} pose ordering/count changed.`);
  for (const pose of poseNames) {
    const filename = manifest.poses[pose]; assert(filename && existsSync(resolve(directory, filename)), `${folder} missing ${pose}.`);
    const image = await loadImage(resolve(directory, filename)); assert(image.width === 640 && image.height === rows * 192, `${folder} ${pose} wrong atlas dimensions.`);
    const data = dataOf(image); for (let index = 0; index < identities; index += 1) checkCell(data, image.width, index % 5 * 128, Math.floor(index / 5) * 192, 128, 192, 181, `${folder} ${pose} #${index + 1}`);
  }
  // These deliberately named white-art regressions demonstrate that cleanup
  // is topology-aware rather than a global white key. They must retain bright
  // pixels inside the actor silhouette after every rebuild.
  for (const { pose, identity, minimumChannel, minimumCount } of whiteRegression) {
    const image = await loadImage(resolve(directory, manifest.poses[pose])); const data = dataOf(image);
    const left = identity % 5 * 128, top = Math.floor(identity / 5) * 192; let bright = 0;
    for (let y = 0; y < 192; y += 1) for (let x = 0; x < 128; x += 1) { const offset = ((top + y) * image.width + left + x) * 4; if (data[offset + 3] > threshold && Math.min(data[offset], data[offset + 1], data[offset + 2]) >= minimumChannel) bright += 1; }
    assert(bright >= minimumCount, `${folder} ${pose} #${identity + 1} lost a meaningful area of known white/light clothing or authored light detail.`);
  }
}
const founderPoses = ["front-idle", "left-idle", "right-idle", "back-idle", "front-walk-a", "front-walk-b", "left-walk-a", "left-walk-b", "right-walk-a", "right-walk-b", "back-walk-a", "back-walk-b", "front-seated", "left-seated", "right-seated", "front-working", "clipboard", "jump-recovery", "star-jump", "portrait"];
const patientPoses = ["front-idle", "left-idle", "right-idle", "back-idle", "seated-front", "exam-table", "front-walk-a", "front-walk-b", "back-walk-a", "back-walk-b", "left-walk-a", "left-walk-neutral", "left-walk-b", "right-walk-a", "right-walk-neutral", "right-walk-b", "seated-left", "seated-right"];
export const verifyFounderActors = () => pack({ folder: "apps/player/public/art/characters/founders-v4", revision: "founders-v4-r9-hires", identities: 30, rows: 6, poseNames: founderPoses, whiteRegression: [{ pose: "front-idle", identity: 0, minimumChannel: 220, minimumCount: 300 }, { pose: "front-idle", identity: 13, minimumChannel: 220, minimumCount: 300 }] });
export const verifyPatientActors = () => pack({ folder: "apps/player/public/art/characters/patients-v1", revision: "patients-v1-r7-hires", identities: 50, rows: 10, poseNames: patientPoses, whiteRegression: [{ pose: "front-idle", identity: 7, minimumChannel: 190, minimumCount: 250 }, { pose: "front-idle", identity: 9, minimumChannel: 190, minimumCount: 250 }] });
if (process.argv[1]?.endsWith("verify-character-resolution-alpha.mjs")) { await verifyFounderActors(); await verifyPatientActors(); console.log("Character resolution and alpha verifier passed."); }
