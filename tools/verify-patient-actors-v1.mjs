/**
 * Structural lint for the checked-in patient-v1 source sheets and derived
 * atlases. This deliberately validates extraction; it never redraws art.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = resolve(import.meta.dirname, "..");
const sourceDir = resolve(root, "generated_images/patient-character-sources-v1");
const dir = resolve(root, "apps/player/public/art/characters/patients-v1");
const manifest = JSON.parse(readFileSync(resolve(dir, "manifest.json"), "utf8"));
const ids = Array.from({ length: 50 }, (_, index) => `patient.adult.${String(index + 1).padStart(3, "0")}`);
const mapPoses = ["front-idle", "left-idle", "right-idle", "back-idle", "front-walk-a", "front-walk-b", "back-walk-a", "back-walk-b", "left-walk-a", "left-walk-neutral", "left-walk-b", "right-walk-a", "right-walk-neutral", "right-walk-b", "seated-front", "seated-left", "seated-right", "exam-table"];
const allPoses = [...mapPoses, "thumbnail", "portrait"];
function assert(condition, message) { if (!condition) throw new Error(message); }
function sha(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function pixels(image) { const canvas = createCanvas(image.width, image.height); const ctx = canvas.getContext("2d"); ctx.drawImage(image, 0, 0); return ctx.getImageData(0, 0, image.width, image.height).data; }
function hash(data, width, left, top, cellW, cellH) { let value = 2166136261; for (let y = top; y < top + cellH; y++) for (let x = left; x < left + cellW; x++) { const offset = (y * width + x) * 4; for (let channel = 0; channel < 4; channel++) value = Math.imul(value ^ data[offset + channel], 16777619); } return value >>> 0; }
function assertExactHorizontalMirror(source, target, index, sourceLabel, targetLabel) {
  const left = index % 5 * 96, top = Math.floor(index / 5) * 144;
  for (let y = 0; y < 144; y++) for (let x = 0; x < 96; x++) for (let channel = 0; channel < 4; channel++) {
    const from = ((top + y) * source.image.width + left + x) * 4 + channel;
    const mirrored = ((top + y) * target.image.width + left + (95 - x)) * 4 + channel;
    assert(source.data[from] === target.data[mirrored], `${ids[index]} ${targetLabel} must be an exact horizontal mirror of ${sourceLabel}`);
  }
}
function assertExactRows(source, target, index, endRow, sourceLabel, targetLabel) {
  const left = index % 5 * 96, top = Math.floor(index / 5) * 144;
  for (let y = 0; y <= endRow; y++) for (let x = 0; x < 96; x++) for (let channel = 0; channel < 4; channel++) {
    const from = ((top + y) * source.image.width + left + x) * 4 + channel;
    const to = ((top + y) * target.image.width + left + x) * 4 + channel;
    assert(source.data[from] === target.data[to], `${ids[index]} ${targetLabel} must preserve ${sourceLabel} head/torso pixels through row ${endRow}`);
  }
}
function floorRow(data, atlasWidth, left, top) { let floor = -1; for (let y = 0; y < 144; y += 1) for (let x = 0; x < 96; x += 1) if (data[((top + y) * atlasWidth + left + x) * 4 + 3] > 12) floor = Math.max(floor, y); return floor; }
function alphaComponents(data, atlasWidth, left, top, cellW, cellH) {
  const visited = new Uint8Array(cellW * cellH), components = [], opaqueAt = (x, y) => data[((top + y) * atlasWidth + left + x) * 4 + 3] > 12;
  for (let start = 0; start < visited.length; start++) {
    if (visited[start]) continue;
    const startX = start % cellW, startY = Math.floor(start / cellW);
    if (!opaqueAt(startX, startY)) { visited[start] = 1; continue; }
    const queue = [start]; visited[start] = 1; let count = 0, minX = startX, maxX = startX, minY = startY, maxY = startY, meaningful = false;
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const index = queue[cursor], x = index % cellW, y = Math.floor(index / cellW), offset = ((top + y) * atlasWidth + left + x) * 4, r = data[offset], g = data[offset + 1], b = data[offset + 2]; count++; meaningful ||= Math.min(r, g, b) < 205 || Math.max(r, g, b) - Math.min(r, g, b) > 26; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) { const nx = x + dx, ny = y + dy, next = ny * cellW + nx; if (nx >= 0 && nx < cellW && ny >= 0 && ny < cellH && !visited[next] && opaqueAt(nx, ny)) { visited[next] = 1; queue.push(next); } }
    }
    components.push({ count, minX, maxX, minY, maxY, meaningful });
  }
  return components;
}
function bboxGap(a, b) { const horizontal = a.maxX < b.minX ? b.minX - a.maxX - 1 : b.maxX < a.minX ? a.minX - b.maxX - 1 : 0; const vertical = a.maxY < b.minY ? b.minY - a.maxY - 1 : b.maxY < a.minY ? a.minY - b.maxY - 1 : 0; return Math.max(horizontal, vertical); }
function cellChecks(data, atlasWidth, index, cellW, cellH, pose) {
  const left = (index % 5) * cellW, top = Math.floor(index / 5) * cellH;
  let perimeter = 0, opaque = 0, topOpaque = 0, lowerOpaque = 0, innerOpaque = 0;
  for (let y = 0; y < cellH; y++) for (let x = 0; x < cellW; x++) {
    const alpha = data[((top + y) * atlasWidth + left + x) * 4 + 3];
    if (alpha <= 12) continue;
    opaque++;
    if (x === 0 || y === 0 || x === cellW - 1 || y === cellH - 1) perimeter++;
    if (y < Math.ceil(cellH * .48)) topOpaque++;
    if (cellH === 144 && y >= 104) lowerOpaque++;
    if (x > 5 && x < cellW - 6 && y > 5 && y < cellH - 6) innerOpaque++;
  }
  assert(perimeter === 0, `${pose} ${ids[index]} leaks into a cell perimeter`);
  assert(opaque > 180 && innerOpaque > 150, `${pose} ${ids[index]} is implausibly empty`);
  assert(topOpaque > 28, `${pose} ${ids[index]} has clipped or missing head content`);
  if (cellH === 144) assert(lowerOpaque > 4, `${pose} ${ids[index]} has no lower-body/floor content`);
  const components = alphaComponents(data, atlasWidth, left, top, cellW, cellH).sort((a, b) => b.count - a.count), primary = components[0], allowedGap = cellH === 224 ? 14 : 9;
  assert(primary, `${pose} ${ids[index]} has no retained actor component`);
  for (const component of components.slice(1)) { const gap = bboxGap(component, primary); assert(component.meaningful && (gap <= 4 || (component.count <= 28 && gap <= allowedGap)), `${pose} ${ids[index]} retains disconnected exterior/checker noise (${component.count}px, gap ${gap}px, meaningful=${component.meaningful})`); }
}

assert(manifest.contentRevision === "patients-v1-r6", "patient pack must be revision r6");
assert(manifest.sourceContract?.grid?.join("x") === "6x3", "missing canonical 6x3 source contract");
assert(manifest.sourceContract?.strategy === "row actor detection + per-actor exterior-connected checker removal", "wrong source-cleaning strategy");
assert(Object.keys(manifest.sourceContract?.poseSlots ?? {}).length === 18, "manifest must retain all 18 source pose slots");
const horizontalDirectionSlots = manifest.sourceContract?.horizontalDirectionSlots;
assert(JSON.stringify(horizontalDirectionSlots?.right) === JSON.stringify({ a: [4, 1], b: [5, 1] }), "right patient A/B must use the two canonical right-facing source slots");
assert(horizontalDirectionSlots?.left?.a === "mirror:right-walk-a" && horizontalDirectionSlots?.left?.b === "mirror:right-walk-b", "left patient A/B must derive from the same canonical right-facing source pair");
assert(manifest.horizontalWalkDerivation?.["left-walk-a"]?.mirrorOf === "right-walk-a", "left patient A must mirror canonical right A");
assert(manifest.horizontalWalkDerivation?.["left-walk-neutral"]?.mirrorOf === "right-walk-neutral", "left patient neutral must mirror canonical right neutral");
assert(manifest.horizontalWalkDerivation?.["left-walk-b"]?.mirrorOf === "right-walk-b", "left patient B must mirror canonical right B");
assert(manifest.horizontalWalkDerivation?.["right-walk-b"]?.upperBodyRowsFrom === "right-walk-a", "right patient B must preserve canonical right A upper profile");
assert(manifest.horizontalWalkDerivation?.["right-walk-neutral"]?.legInsetOf === "right-walk-a", "right neutral must derive from a direction-safe right A frame");
assert(manifest.variants?.length === 50, "manifest must list exactly 50 variants");
assert(manifest.variants.map((variant) => variant.id).join("|") === ids.join("|"), "manifest roster/domain ID parity failed");
assert(Object.keys(manifest.poses ?? {}).length === 20, "manifest must expose exactly 20 pose families including directional lateral neutral frames");
assert(manifest.mapCell?.floorAnchor?.x === 48 && manifest.mapCell?.floorAnchor?.y === 136, "map floor anchor mismatch");
assert(manifest.mapCell?.seatAnchor?.x === 48 && manifest.mapCell?.seatAnchor?.y === 102, "map seat anchor mismatch");
assert(manifest.walkPhases?.a === "left-foot-forward" && manifest.walkPhases?.b === "right-foot-forward", "stride phase declaration missing");
const sources = readdirSync(sourceDir).filter((name) => /^patient-\d{3}\.png$/.test(name)).sort();
assert(sources.length === 50, `expected 50 source sheets, found ${sources.length}`);
const sourceSignatures = new Set();
for (let index = 0; index < 50; index++) {
  const file = `patient-${String(index + 1).padStart(3, "0")}.png`, path = resolve(sourceDir, file), bytes = readFileSync(path), image = await loadImage(path), data = pixels(image);
  assert(sources[index] === file, `source order mismatch at ${index + 1}`);
  assert(image.width >= 6 && image.height >= 3, `${file} cannot be a 6x3 source sheet`);
  let opaque = 0; for (let offset = 3; offset < data.length; offset += 4) if (data[offset] > 12) opaque++;
  // The generated source sheets carry an opaque light checkerboard. The builder
  // removes that known high-neutral background before cropping; runtime atlases,
  // not source inputs, are required to retain transparent alpha.
  assert(opaque > image.width * image.height * .98, `${file} source pixels are unexpectedly incomplete`);
  const signature = sha(bytes); assert(!sourceSignatures.has(signature), `${file} duplicates a canonical source sheet`); sourceSignatures.add(signature);
  const listed = manifest.variants[index]; assert(listed.source === file && listed.sourceSha256 === signature, `${ids[index]} source hash mismatch`);
}
const loaded = {};
for (const pose of allPoses) {
  const file = manifest.poses[pose]; assert(typeof file === "string" && existsSync(resolve(dir, file)), `missing ${pose} atlas`);
  const image = await loadImage(resolve(dir, file)); const expected = pose === "portrait" ? [960, 2240] : pose === "thumbnail" ? [480, 1120] : [480, 1440];
  assert(image.width === expected[0] && image.height === expected[1], `${pose} atlas geometry ${image.width}x${image.height} != ${expected.join("x")}`);
  const data = pixels(image); for (let index = 0; index < 50; index++) cellChecks(data, image.width, index, expected[0] / 5, expected[1] / 10, pose);
  loaded[pose] = { image, data };
}
for (const direction of ["front", "back", "left", "right"]) for (let index = 0; index < 50; index++) {
  const a = loaded[`${direction}-walk-a`], b = loaded[`${direction}-walk-b`], left = index % 5 * 96, top = Math.floor(index / 5) * 144;
  assert(hash(a.data, a.image.width, left, top + 78, 96, 58) !== hash(b.data, b.image.width, left, top + 78, 96, 58), `${ids[index]} ${direction} A/B stride is identical`);
  const aFloor = floorRow(a.data, a.image.width, left, top), bFloor = floorRow(b.data, b.image.width, left, top);
  assert(aFloor === bFloor && aFloor <= manifest.mapCell.floorAnchor.y, `${ids[index]} ${direction} gait phases must share the canonical floor anchor`);
}
for (let index = 0; index < 50; index++) {
  // Every lateral phase is direction-locked across the complete roster. This
  // catches the prior failure where a side-idle neutral silently pointed the
  // opposite way for part of the generated patient set.
  assertExactHorizontalMirror(loaded["right-walk-a"], loaded["left-walk-a"], index, "right-walk-a", "left-walk-a");
  assertExactHorizontalMirror(loaded["right-walk-neutral"], loaded["left-walk-neutral"], index, "right-walk-neutral", "left-walk-neutral");
  assertExactHorizontalMirror(loaded["right-walk-b"], loaded["left-walk-b"], index, "right-walk-b", "left-walk-b");
  // Neutral may alter only the lower limb band. Its exact upper body is the
  // same canonical facing view, so head/torso can never flip mid-route.
  assertExactRows(loaded["right-walk-a"], loaded["right-walk-neutral"], index, 95, "right-walk-a", "right-walk-neutral");
  assertExactRows(loaded["left-walk-a"], loaded["left-walk-neutral"], index, 95, "left-walk-a", "left-walk-neutral");
  assertExactRows(loaded["right-walk-a"], loaded["right-walk-b"], index, 95, "right-walk-a", "right-walk-b");
  assertExactRows(loaded["left-walk-a"], loaded["left-walk-b"], index, 95, "left-walk-a", "left-walk-b");
  const row = Math.floor(index / 5), column = index % 5, left = column * 96, top = row * 144;
  for (const direction of ["left", "right"]) {
    const a = loaded[`${direction}-walk-a`], neutral = loaded[`${direction}-walk-neutral`], b = loaded[`${direction}-walk-b`];
    assert(hash(a.data, a.image.width, left, top + 96, 96, 48) !== hash(neutral.data, neutral.image.width, left, top + 96, 96, 48), `${ids[index]} ${direction} neutral must visibly change the lower limb band`);
    assert(hash(b.data, b.image.width, left, top + 96, 96, 48) !== hash(neutral.data, neutral.image.width, left, top + 96, 96, 48), `${ids[index]} ${direction} neutral must stay distinct from the opposite stride`);
  }
}
for (const suffix of ["idle", "walk-a", "walk-neutral", "walk-b"]) assert(readFileSync(resolve(dir, manifest.poses[`left-${suffix}`])).compare(readFileSync(resolve(dir, manifest.poses[`right-${suffix}`]))) !== 0, `left/right ${suffix} requires explicit directional art`);
for (let index = 0; index < 50; index++) {
  const row = Math.floor(index / 5), column = index % 5;
  const front = hash(loaded["front-idle"].data, loaded["front-idle"].image.width, column * 96, row * 144, 96, 112);
  const thumb = hash(loaded.thumbnail.data, loaded.thumbnail.image.width, column * 96, row * 112, 96, 112);
  const portrait = hash(loaded.portrait.data, loaded.portrait.image.width, column * 192, row * 224, 192, 224);
  assert(front !== thumb && thumb !== portrait, `${ids[index]} UI art lacks a distinct matched rendering`);
}
for (const id of ["patient.adult.003", "patient.adult.017", "patient.adult.018"]) {
  const index = ids.indexOf(id); assert(index >= 0, `missing regression identity ${id}`);
  for (const pose of allPoses) {
    const item = loaded[pose], width = pose === "portrait" ? 192 : 96, height = pose === "portrait" ? 224 : pose === "thumbnail" ? 112 : 144;
    cellChecks(item.data, item.image.width, index, width, height, `${pose} regression`);
  }
}
console.log("Verified patients-v1-r6: 50 canonical source identities, 20 clean extracted atlas families, direction-locked A/neutral/B upper-body and exact-mirror orientation contracts.");
