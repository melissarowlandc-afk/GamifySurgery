export const MAP_CHARACTER_REFERENCE_TILE_SIZE = 52;
export const MAP_CHARACTER_REFERENCE_HEIGHT = 54;

export interface CharacterFrameSize {
  width: number;
  height: number;
}

export interface CharacterPresentationMetrics {
  width: number;
  height: number;
}

export function getCharacterPresentationMetrics(
  frame: CharacterFrameSize,
  tileSize: number,
): CharacterPresentationMetrics {
  const height = Math.max(6, Math.round((tileSize * MAP_CHARACTER_REFERENCE_HEIGHT) / MAP_CHARACTER_REFERENCE_TILE_SIZE));
  return {
    width: Math.max(4, Math.round((height * frame.width) / frame.height)),
    height,
  };
}

/** Integer, exact-aspect sizing for authored bitmap frames only. */
export function getAuthoredCharacterPresentationMetrics(
  frame: CharacterFrameSize,
  tileSize: number,
  displayScale = 1,
): CharacterPresentationMetrics {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const positiveInteger = (value: number): number => (
    Number.isFinite(value) && value > 0 ? Math.max(1, Math.round(value)) : 1
  );
  const safeWidth = positiveInteger(frame.width);
  const safeHeight = positiveInteger(frame.height);
  const divisor = gcd(safeWidth, safeHeight);
  const unitWidth = safeWidth / divisor;
  const unitHeight = safeHeight / divisor;
  const safeTileSize = Number.isFinite(tileSize) && tileSize > 0 ? tileSize : 1;
  const safeDisplayScale = Number.isFinite(displayScale) && displayScale > 0
    ? displayScale
    : 1;
  const targetWidth = Math.max(
    unitWidth,
    Math.round(safeTileSize * 1.35 * safeDisplayScale),
  );
  const multiplier = Math.max(1, Math.round(targetWidth / unitWidth));
  return { width: unitWidth * multiplier, height: unitHeight * multiplier };
}
