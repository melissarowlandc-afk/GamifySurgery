import type { CardinalDirection } from "@gamify-surgery/game-domain";

export interface PixelRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PixelPoint {
  x: number;
  y: number;
}

export interface DoorInteractionGeometry {
  hitRegion: PixelRectangle;
  center: PixelPoint;
  horizontal: boolean;
}

export interface DoorInteractionGeometryOptions {
  room: PixelRectangle;
  side: CardinalDirection;
  offset: number;
  tileSize: number;
  exposedNorthWall: boolean;
  northWallHeight: number;
}

/**
 * Produces one shared map-space geometry for a door highlight and its pointer
 * target. North-facing exposed walls include the visible cutaway wall face;
 * all other openings stay grounded on the room boundary.
 */
export function getDoorInteractionGeometry({
  room,
  side,
  offset,
  tileSize,
  exposedNorthWall,
  northWallHeight,
}: DoorInteractionGeometryOptions): DoorInteractionGeometry {
  const safeTileSize = Math.max(1, tileSize);
  const segmentCenter = (Math.max(0, offset) + 0.5) * safeTileSize;
  const opening = Math.max(6, Math.min(safeTileSize, safeTileSize * 0.72));
  const boundaryTolerance = Math.max(
    5,
    Math.min(12, safeTileSize * 0.24),
  );

  if (side === "north" || side === "south") {
    const centerX = room.x + segmentCenter;
    const edgeY = side === "north" ? room.y : room.y + room.height;
    const wallHeight =
      side === "north" && exposedNorthWall
        ? Math.max(boundaryTolerance * 2, northWallHeight)
        : boundaryTolerance * 2;
    const regionY =
      side === "north" && exposedNorthWall
        ? edgeY - wallHeight
        : edgeY - boundaryTolerance;
    return {
      hitRegion: {
        x: centerX - opening / 2,
        y: regionY,
        width: opening,
        height: wallHeight,
      },
      center: {
        x: centerX,
        y:
          side === "north" && exposedNorthWall
            ? edgeY - wallHeight / 2
            : edgeY,
      },
      horizontal: true,
    };
  }

  const centerY = room.y + segmentCenter;
  const edgeX = side === "west" ? room.x : room.x + room.width;
  return {
    hitRegion: {
      x: edgeX - boundaryTolerance,
      y: centerY - opening / 2,
      width: boundaryTolerance * 2,
      height: opening,
    },
    center: { x: edgeX, y: centerY },
    horizontal: false,
  };
}

export function containsDoorInteractionPoint(
  geometry: DoorInteractionGeometry,
  point: PixelPoint,
): boolean {
  const { hitRegion } = geometry;
  return (
    point.x >= hitRegion.x &&
    point.x <= hitRegion.x + hitRegion.width &&
    point.y >= hitRegion.y &&
    point.y <= hitRegion.y + hitRegion.height
  );
}

export function doorInteractionDistanceSquared(
  geometry: DoorInteractionGeometry,
  point: PixelPoint,
): number {
  const deltaX = point.x - geometry.center.x;
  const deltaY = point.y - geometry.center.y;
  return deltaX * deltaX + deltaY * deltaY;
}
