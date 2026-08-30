import type { BitmapAtlasFrameDescriptor } from "./bitmapAssetManifest";

export interface RgbaPixel {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly alpha: number;
}

/**
 * The generated landscaping sheet has a small number of fully opaque,
 * neutral-white background holes inside tree crowns. This intentionally strict
 * color key removes only those gaps; foliage highlights and all flower frames
 * retain their source pixels unchanged.
 */
export function isUnintendedTreeGapPixel(pixel: RgbaPixel): boolean {
  return (
    pixel.alpha > 0 &&
    pixel.red >= 248 &&
    pixel.green >= 248 &&
    pixel.blue >= 248 &&
    Math.max(pixel.red, pixel.green, pixel.blue) -
      Math.min(pixel.red, pixel.green, pixel.blue) <= 5
  );
}

export function cleanTreeFrameWhiteGaps(
  data: Uint8ClampedArray,
  atlasWidth: number,
  treeFrames: readonly Pick<BitmapAtlasFrameDescriptor, "sourceRect">[],
): number {
  let cleared = 0;
  for (const frame of treeFrames) {
    const { x, y, width, height } = frame.sourceRect;
    for (let row = y; row < y + height; row += 1) {
      for (let column = x; column < x + width; column += 1) {
        const index = (row * atlasWidth + column) * 4;
        if (!isUnintendedTreeGapPixel({
          red: data[index] ?? 0,
          green: data[index + 1] ?? 0,
          blue: data[index + 2] ?? 0,
          alpha: data[index + 3] ?? 0,
        })) continue;
        data[index + 3] = 0;
        cleared += 1;
      }
    }
  }
  return cleared;
}
