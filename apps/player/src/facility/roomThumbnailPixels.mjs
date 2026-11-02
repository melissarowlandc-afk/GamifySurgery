/** Pure browser/Node helpers: verification decodes the PNG, never trusts stored metrics. */
export function roomThumbnailStage(width, height) {
  if (![width, height].every(value => Number.isInteger(value) && value > 0)) throw new Error("Invalid room footprint");
  const tileSize = 120, margin = 3 * tileSize;
  return { tileSize, originX: margin, originY: margin,
    width: width * tileSize + 2 * margin, height: height * tileSize + 2 * margin };
}

export function roomThumbnailFootprint(width, height) {
  const stage = roomThumbnailStage(width, height);
  return { x: stage.originX, y: stage.originY, width: width * stage.tileSize, height: height * stage.tileSize };
}

export function thumbnailFootprintInFrame(footprint, source, destination) {
  for (const bounds of [footprint, source, destination]) {
    if (![bounds?.x, bounds?.y, bounds?.width, bounds?.height].every(Number.isFinite) || bounds.width <= 0 || bounds.height <= 0) {
      throw new Error("Invalid thumbnail footprint mapping");
    }
  }
  return { x: destination.x + (footprint.x - source.x) * destination.width / source.width,
    y: destination.y + (footprint.y - source.y) * destination.height / source.height,
    width: footprint.width * destination.width / source.width, height: footprint.height * destination.height / source.height };
}

/**
 * Inspect the floor interior, excluding 4% at each edge so a surviving wall
 * cannot disguise a blank room. No vignette, shadow or framing pixels count.
 * RGBA coverage + coarse color diversity reject empty/solid/near-solid fills,
 * including a gradient with many subtly different colors. The approved bare
 * hallway passes (40 exact colors / 14 coarse bins in the manager's PNG).
 */
export function assertRoomThumbnailPixels(rgba, width, height, footprint) {
  if (![width, height].every(value => Number.isInteger(value) && value > 0) || rgba.length !== width * height * 4 ||
      ![footprint?.x, footprint?.y, footprint?.width, footprint?.height].every(Number.isFinite) ||
      footprint.width <= 0 || footprint.height <= 0) throw new Error("Invalid thumbnail pixel buffer/footprint");
  const left = Math.ceil(footprint.x + footprint.width * .04), top = Math.ceil(footprint.y + footprint.height * .04);
  const right = Math.floor(footprint.x + footprint.width * .96), bottom = Math.floor(footprint.y + footprint.height * .96);
  if (left < 0 || top < 0 || right > width || bottom > height || right <= left || bottom <= top) throw new Error("Thumbnail footprint is outside its pixels");
  const colors = new Set(), bins = new Map();
  let opaque = 0, dominant = 0, dominantBin = 0;
  for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
    const index = (y * width + x) * 4;
    if (rgba[index + 3] < 240) continue;
    opaque++;
    const r = rgba[index], g = rgba[index + 1], b = rgba[index + 2];
    colors.add((r << 16) | (g << 8) | b);
    const bin = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const count = (bins.get(bin) ?? 0) + 1;
    bins.set(bin, count);
    if (count > dominant) { dominant = count; dominantBin = bin; }
  }
  // A neutral vignette can have hundreds of exact colors but no real room
  // detail. Require 2% of floor pixels at least three 4-bit bins (48 levels)
  // away from the dominant color in one channel. Existing valid PNGs have
  // at least 11.6% such pixels, including the deliberately sparse hallway.
  let contrasting = 0;
  for (const [bin, count] of bins) {
    if ([8, 4, 0].some(shift => Math.abs(((bin >> shift) & 15) - ((dominantBin >> shift) & 15)) >= 3)) contrasting += count;
  }
  const stats = { version: 1, bounds: { x: left, y: top, width: right - left, height: bottom - top },
    samples: (right - left) * (bottom - top), opaqueCoverage: opaque / ((right - left) * (bottom - top)),
    distinctColors: colors.size, quantizedColors: bins.size, dominantFraction: opaque ? dominant / opaque : 1,
    contrastFraction: opaque ? contrasting / opaque : 0 };
  if (stats.opaqueCoverage < .9 || stats.distinctColors < 24 || stats.quantizedColors < 8 || stats.contrastFraction < .02) {
    throw new Error(`Room capture is blank/background-only: ${JSON.stringify(stats)}`);
  }
  return stats;
}
