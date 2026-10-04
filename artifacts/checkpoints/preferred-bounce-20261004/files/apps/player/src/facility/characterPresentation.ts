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

export const CHARACTER_STEP_BOUNCE_HEIGHT = 7;
export const CHARACTER_STEP_BOUNCE_HERTZ = 2;
export const CHARACTER_STEP_SWAY_DEGREES = 1.5;
export const CHARACTER_STEP_SWAY_HERTZ = 1;
export const CHARACTER_STOP_SETTLE_MILLISECONDS = 120;

export interface CharacterStepMotion {
  readonly lift: number;
  readonly angle: number;
}

export function isCharacterMovingPose(pose: string): boolean {
  return pose === "walk-a" || pose === "walk-neutral" || pose === "walk-b";
}

/** Full cosine arc: grounded at each cycle boundary and seven base-world
 * pixels high at its midpoint. Camera zoom is applied by the scene. */
export function getCharacterStepBounceLift(
  elapsedMilliseconds: number,
  pose: string,
): number {
  if (!isCharacterMovingPose(pose) || !Number.isFinite(elapsedMilliseconds)) return 0;
  const elapsedSeconds = Math.max(0, elapsedMilliseconds) / 1_000;
  const wave = Math.PI * 2 * CHARACTER_STEP_BOUNCE_HERTZ * elapsedSeconds;
  return (0.5 - 0.5 * Math.cos(wave)) * CHARACTER_STEP_BOUNCE_HEIGHT;
}

/** Direction changes select a still without restarting this shared gait phase. */
export function getCharacterStepMotion(
  elapsedMilliseconds: number,
  pose: string,
  direction: "front" | "side" | "back",
): CharacterStepMotion {
  if (!isCharacterMovingPose(pose) || !Number.isFinite(elapsedMilliseconds)) {
    return { lift: 0, angle: 0 };
  }
  const elapsedSeconds = Math.max(0, elapsedMilliseconds) / 1_000;
  const swayWave = Math.PI * 2 * CHARACTER_STEP_SWAY_HERTZ * elapsedSeconds;
  return {
    lift: getCharacterStepBounceLift(elapsedMilliseconds, pose),
    angle: direction === "side" ? 0 : Math.sin(swayWave) * CHARACTER_STEP_SWAY_DEGREES,
  };
}

/** One scale for every GS-026 standing and seated 160x320 frame. The factor
 * preserves the previous 128px source's 181px floor span at tile*1.35. */
export const CHARACTER_STILL_WIDTH_IN_TILES = 1.35 * (181 / 128) * (160 / 287);

export function getCharacterStillPresentationMetrics(
  tileSize: number,
  displayScale = 1,
): CharacterPresentationMetrics {
  const safeTileSize = Number.isFinite(tileSize) && tileSize > 0 ? tileSize : 1;
  const safeDisplayScale = Number.isFinite(displayScale) && displayScale > 0 ? displayScale : 1;
  const width = Math.max(1, Math.round(safeTileSize * CHARACTER_STILL_WIDTH_IN_TILES * safeDisplayScale));
  return { width, height: width * 2 };
}

export function alignCharacterStillSeatToWorld(
  worldSeatY: number,
  floorY: number,
  seatContactY: number,
  renderedHeight: number,
  nativeHeight = 320,
): number {
  return worldSeatY + (floorY - seatContactY) * (renderedHeight / nativeHeight);
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
