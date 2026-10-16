type Crop = readonly [x: number, y: number, width: number, height: number];

export interface BacklessRollingStoolDerivation {
  readonly removeAboveY: number;
  readonly backPost: Crop;
  readonly coveredSeat: Crop;
  readonly coveredColumn: Crop;
  readonly columnSample: Crop;
}

export interface ApprovedRollingStoolSource {
  readonly id: string;
  readonly assetId: string;
  readonly sourceRect: Crop;
  readonly derivation?: BacklessRollingStoolDerivation;
}

/**
 * Owner direction, 2026-10-08: rolling stools are backless and entirely below
 * their sitter. These crop identities reference the unchanged approved atlases
 * in bitmapAssetManifest.ts. Runtime derivation v1 retains each crop's original
 * dimensions/placement; it never writes to source art. Most crops are already
 * backless, including the legacy bitmap and procedural examination stools.
 *
 * The two front-facing back posts obscure a narrow strip of cushion/column.
 * Restore that strip from neighboring cushion pixels on the same source row
 * and a short exposed column sample from the same crop, after alpha-masking
 * the back. No generated artwork or external image is used.
 */
export const BACKLESS_ROLLING_STOOL_VERSION = "backless-v1";
export const APPROVED_ROLLING_STOOL_SOURCES: readonly ApprovedRollingStoolSource[] = [
  { id: "examination", assetId: "gs015:examination:props", sourceRect: [322, 69, 264, 357] },
  {
    id: "minor-procedure", assetId: "gs015:minor-procedure:furniture", sourceRect: [8, 2448, 266, 427],
    derivation: {
      removeAboveY: 103, backPost: [108, 83, 45, 135], coveredSeat: [108, 103, 45, 105],
      coveredColumn: [116, 208, 27, 10], columnSample: [116, 218, 27, 10],
    },
  },
  {
    id: "ultrasound", assetId: "gs015:ultrasound:furniture", sourceRect: [8, 1582, 351, 516],
    derivation: {
      removeAboveY: 139, backPost: [143, 100, 66, 166], coveredSeat: [143, 139, 66, 115],
      coveredColumn: [157, 254, 31, 12], columnSample: [157, 266, 31, 12],
    },
  },
  { id: "phlebotomy-south", assetId: "gs015:phlebotomy:south", sourceRect: [654, 0, 405, 430] },
  { id: "phlebotomy-east", assetId: "gs015:phlebotomy:east", sourceRect: [605, 8, 409, 517] },
  { id: "recovery", assetId: "gs015:recovery:furniture", sourceRect: [2844, 0, 264, 357] },
  { id: "training", assetId: "gs015:training:furniture", sourceRect: [2497, 0, 264, 357] },
  { id: "legacy-examination", assetId: "room-fixtures:examination-v1", sourceRect: [200, 785, 220, 264] },
];

/** Match art identity rather than a room/id, so approved touch-up reuse follows the same rule. */
export function getApprovedRollingStoolSource(
  draw: Readonly<{ assetId: string; sourceRect: readonly number[] }>,
): ApprovedRollingStoolSource | undefined {
  return APPROVED_ROLLING_STOOL_SOURCES.find((source) => source.assetId === draw.assetId &&
    source.sourceRect.length === draw.sourceRect.length &&
    source.sourceRect.every((part, index) => part === draw.sourceRect[index]));
}

/** Derive an independent RGBA crop; untouched seat sides, column and base remain byte-exact. */
export function deriveBacklessRollingStoolPixels(
  source: Uint8ClampedArray,
  width: number,
  height: number,
  derivation: BacklessRollingStoolDerivation,
): Uint8ClampedArray {
  const result = source.slice();
  const offset = (x: number, y: number) => (y * width + x) * 4;
  for (let y = 0; y < Math.min(height, derivation.removeAboveY); y += 1) {
    for (let x = 0; x < width; x += 1) result[offset(x, y) + 3] = 0;
  }
  const [postX, postY, postWidth, postHeight] = derivation.backPost;
  for (let y = postY; y < postY + postHeight; y += 1) {
    for (let x = postX; x < postX + postWidth; x += 1) result[offset(x, y) + 3] = 0;
  }
  const [seatX, seatY, seatWidth, seatHeight] = derivation.coveredSeat;
  for (let y = seatY; y < seatY + seatHeight; y += 1) {
    const left = offset(seatX - 1, y), right = offset(seatX + seatWidth, y);
    for (let x = seatX; x < seatX + seatWidth; x += 1) {
      const fraction = (x - seatX + 1) / (seatWidth + 1);
      for (let channel = 0; channel < 4; channel += 1) {
        result[offset(x, y) + channel] = Math.round(source[left + channel]! +
          (source[right + channel]! - source[left + channel]!) * fraction);
      }
    }
  }
  const [columnX, columnY, columnWidth, columnHeight] = derivation.coveredColumn;
  const [sampleX, sampleY] = derivation.columnSample;
  for (let y = 0; y < columnHeight; y += 1) {
    for (let x = 0; x < columnWidth; x += 1) {
      const from = offset(sampleX + x, sampleY + y), to = offset(columnX + x, columnY + y);
      result.set(source.subarray(from, from + 4), to);
    }
  }
  return result;
}
