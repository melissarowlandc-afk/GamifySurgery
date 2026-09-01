import type { FrontDeskV3ArchitectureId } from "../art/bitmapAssetManifest";
import {
  getCanonicalRoomShellLayout,
  type CanonicalRoomWallOpening,
} from "./canonicalRoomShell";

/** A display-only rectangle. Logical room geometry remains in game-domain tiles. */
export interface FrontDeskV5DisplayRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FRONT_DESK_V5_LOGICAL_FOOTPRINT = { width: 5, height: 4 } as const;

/**
 * The v3 plate carries a little transparent frame around its visible tiles.
 * This compensates in the display projection so the assembled room retains
 * the reference's wide-but-not-squat interior.
 */
export const FRONT_DESK_V5_VISIBLE_FLOOR_ASPECT_RATIO = 1.53;

export interface FrontDeskV5Projection {
  logicalBounds: FrontDeskV5DisplayRect;
  floorBounds: FrontDeskV5DisplayRect;
  /** The floor's south edge is deliberately fixed to the logical entrance. */
  southEntranceY: number;
  scaleX: number;
  scaleY: number;
}

/**
 * A Front Desk connection uses its designed openings, not the legacy shell.
 * Its v5 pieces remain coherent whether a north/south neighbor is attached
 * or the room is isolated; the boundary-aware legacy renderer is reserved for
 * room types that still need it.
 */
export function shouldRenderFrontDeskV5Architecture(
  definitionId: string,
  v5AssetsReady: boolean,
  _hasSharedHorizontalBoundary: boolean,
): boolean {
  return definitionId === "room.front_desk" && v5AssetsReady;
}

/**
 * Projects the protected five-by-four Front Desk grid into the reference's
 * deliberately wide, shallow display floor. This changes pixels only: room
 * placement, collision, paths, doors, and saves continue to use logicalBounds.
 */
export function getFrontDeskV5Projection(
  logicalBounds: FrontDeskV5DisplayRect,
): FrontDeskV5Projection {
  const floorWidth = Math.max(1, logicalBounds.width);
  const floorHeight = Math.max(
    1,
    floorWidth / FRONT_DESK_V5_VISIBLE_FLOOR_ASPECT_RATIO,
  );
  const southEntranceY = logicalBounds.y + logicalBounds.height;
  return {
    logicalBounds,
    floorBounds: {
      x: logicalBounds.x,
      y: southEntranceY - floorHeight,
      width: floorWidth,
      height: floorHeight,
    },
    southEntranceY,
    scaleX: floorWidth / FRONT_DESK_V5_LOGICAL_FOOTPRINT.width,
    scaleY: floorHeight / FRONT_DESK_V5_LOGICAL_FOOTPRINT.height,
  };
}

/** Reuses the same visual projection for future fixture and actor placement. */
export function projectFrontDeskV5LogicalPoint(
  projection: FrontDeskV5Projection,
  point: Readonly<{ x: number; y: number }>,
): Readonly<{ x: number; y: number }> {
  return {
    x: projection.floorBounds.x + point.x * projection.scaleX,
    y: projection.floorBounds.y + point.y * projection.scaleY,
  };
}

export type FrontDeskV5ArchitectureLayer = "base" | "front-occluder";

export interface FrontDeskV5ArchitectureComponent {
  key: string;
  frameId: FrontDeskV3ArchitectureId;
  bounds: FrontDeskV5DisplayRect;
  layer: FrontDeskV5ArchitectureLayer;
}

/** A live door expressed in the Front Desk's unchanged logical wall slots. */
export type FrontDeskV5WallOpening = CanonicalRoomWallOpening;

/**
 * Component layout for a rectangular, cutaway Front Desk. Wall runs are solid
 * by default; only a live door removes its own logical wall slot.
 */
export function getFrontDeskV5ArchitectureComponents(
  projection: FrontDeskV5Projection,
  openings: readonly FrontDeskV5WallOpening[] = [],
): readonly FrontDeskV5ArchitectureComponent[] {
  return getCanonicalRoomShellLayout(
    projection.floorBounds,
    FRONT_DESK_V5_LOGICAL_FOOTPRINT,
    openings,
  ).components as readonly FrontDeskV5ArchitectureComponent[];
}
