/**
 * The measured architectural grammar of the accepted Front Desk v4 shell.
 * Values are normalized against its semantic 5-by-4 floor (832 by 622px),
 * so every surgery-center room can use the same cutaway construction at the
 * current tile scale without inheriting its furniture or floor material.
 */
export const FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS = {
  floor: { width: 832, height: 622, tilesWide: 5, tilesHigh: 4 },
  sideWallPixels: 55,
  northEnvelopePixels: 242,
  /** Source crop begins at 941 while the floor ends at 961. */
  foregroundInsetPixels: 20,
  foregroundOutsetPixels: 133,
  outerBorderPixels: 7,
  bevelPixels: 5,
  baseboardPixels: 17,
  shadowOffsetPixels: { x: 18, y: 20 },
} as const;

const tileWidth =
  FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.width /
  FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.tilesWide;
const tileHeight =
  FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.height /
  FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.floor.tilesHigh;

/** One normalized, testable wall contract shared by Front Desk and Exam. */
export const SURGERY_CENTER_WALL_GEOMETRY = {
  sideThicknessTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.sideWallPixels / tileWidth,
  northEnvelopeTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.northEnvelopePixels / tileHeight,
  foregroundInsetTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.foregroundInsetPixels / tileHeight,
  foregroundOutsetTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.foregroundOutsetPixels / tileHeight,
  outerBorderXTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.outerBorderPixels / tileWidth,
  outerBorderYTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.outerBorderPixels / tileHeight,
  bevelXTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.bevelPixels / tileWidth,
  bevelYTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.bevelPixels / tileHeight,
  baseboardYTiles:
    FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.baseboardPixels / tileHeight,
  shadowOffsetTiles: {
    x: FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.shadowOffsetPixels.x / tileWidth,
    y: FRONT_DESK_V4_ARCHITECTURE_MEASUREMENTS.shadowOffsetPixels.y / tileHeight,
  },
} as const;

export interface SurgeryCenterArchitectureAtScale {
  sideThickness: number;
  northEnvelope: number;
  foregroundInset: number;
  foregroundOutset: number;
  outerBorderX: number;
  outerBorderY: number;
  bevelX: number;
  bevelY: number;
  baseboard: number;
  shadowOffset: Readonly<{ x: number; y: number }>;
}

export function getSurgeryCenterArchitectureAtScale(
  tileSize: number,
): SurgeryCenterArchitectureAtScale {
  const scale = Math.max(1, tileSize);
  return {
    sideThickness: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.sideThicknessTiles)),
    northEnvelope: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.northEnvelopeTiles)),
    foregroundInset: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.foregroundInsetTiles)),
    foregroundOutset: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.foregroundOutsetTiles)),
    outerBorderX: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.outerBorderXTiles)),
    outerBorderY: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.outerBorderYTiles)),
    bevelX: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.bevelXTiles)),
    bevelY: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.bevelYTiles)),
    baseboard: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.baseboardYTiles)),
    shadowOffset: {
      x: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.shadowOffsetTiles.x)),
      y: Math.max(1, Math.round(scale * SURGERY_CENTER_WALL_GEOMETRY.shadowOffsetTiles.y)),
    },
  };
}
