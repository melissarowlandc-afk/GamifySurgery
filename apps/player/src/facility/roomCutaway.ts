import type { FacilityRoomView } from "./types";

export type HorizontalRoomBoundary = "north" | "south";

export interface BoundaryRun {
  offset: number;
  length: number;
}

export interface PixelRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RearWallRunProjection {
  cap: PixelRectangle;
  face: PixelRectangle;
  groundY: number;
}

function roomWidth(room: FacilityRoomView): number {
  return Math.max(1, Math.floor(room.width));
}

function roomHeight(room: FacilityRoomView): number {
  return Math.max(1, Math.floor(room.height));
}

function touchesBoundary(
  room: FacilityRoomView,
  candidate: FacilityRoomView,
  side: HorizontalRoomBoundary,
): boolean {
  if (candidate.instanceId === room.instanceId) {
    return false;
  }
  if (side === "north") {
    return candidate.tileY + roomHeight(candidate) === room.tileY;
  }
  return room.tileY + roomHeight(room) === candidate.tileY;
}

/**
 * Returns true when a one-tile segment of a horizontal room edge faces the
 * exterior rather than the floor of another constructed room or hallway.
 *
 * The facility projection already stores rotated room footprints, so width and
 * height can be compared directly without applying orientation again.
 */
export function isHorizontalBoundarySegmentExposed(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: HorizontalRoomBoundary,
  offset: number,
): boolean {
  const segmentStart = room.tileX + Math.floor(offset);
  const segmentEnd = segmentStart + 1;
  return !rooms.some((candidate) => {
    if (!touchesBoundary(room, candidate, side)) {
      return false;
    }
    const candidateStart = candidate.tileX;
    const candidateEnd = candidate.tileX + roomWidth(candidate);
    return candidateStart < segmentEnd && candidateEnd > segmentStart;
  });
}

export function getExposedHorizontalBoundaryRuns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: HorizontalRoomBoundary,
): BoundaryRun[] {
  const width = roomWidth(room);
  const runs: BoundaryRun[] = [];
  let runStart: number | null = null;

  for (let offset = 0; offset < width; offset += 1) {
    const exposed = isHorizontalBoundarySegmentExposed(
      room,
      rooms,
      side,
      offset,
    );
    if (exposed && runStart === null) {
      runStart = offset;
    }
    if (!exposed && runStart !== null) {
      runs.push({ offset: runStart, length: offset - runStart });
      runStart = null;
    }
  }

  if (runStart !== null) {
    runs.push({ offset: runStart, length: width - runStart });
  }
  return runs;
}

export function getLargestBoundaryRun(
  runs: readonly BoundaryRun[],
): BoundaryRun | null {
  return (
    [...runs].sort(
      (left, right) =>
        right.length - left.length || left.offset - right.offset,
    )[0] ?? null
  );
}

/**
 * Projects a cutaway rear wall north of the immutable room-floor rectangle.
 * The face ends exactly at the floor's northern edge and never consumes or
 * enlarges the grid footprint.
 */
export function projectRearWallRun(
  floor: PixelRectangle,
  run: BoundaryRun,
  tileSize: number,
  faceHeight: number,
  capHeight: number,
): RearWallRunProjection {
  const x = floor.x + run.offset * tileSize;
  const width = Math.max(
    0,
    Math.min(
      floor.x + floor.width - x,
      run.length * tileSize,
    ),
  );
  const normalizedFaceHeight = Math.max(1, faceHeight);
  const normalizedCapHeight = Math.max(1, capHeight);
  return {
    cap: {
      x,
      y: floor.y - normalizedFaceHeight - normalizedCapHeight,
      width,
      height: normalizedCapHeight,
    },
    face: {
      x,
      y: floor.y - normalizedFaceHeight,
      width,
      height: normalizedFaceHeight,
    },
    groundY: floor.y,
  };
}
