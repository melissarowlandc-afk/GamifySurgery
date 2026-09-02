import type { FacilityRoomView } from "./types";
import { getSurgeryCenterArchitectureAtScale } from "./surgeryCenterArchitecture";

export type HorizontalRoomBoundary = "north" | "south";
export type VerticalRoomBoundary = "west" | "east";

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

export interface RearWallArtworkProjection {
  /**
   * The artwork's unchanged position on the complete, unoccluded rear wall.
   * Renderers must not recompute this rectangle from the largest exposed run.
   */
  bounds: PixelRectangle;
  /**
   * Visible intersections with the exposed wall runs. Drawing only these
   * fragments crops the artwork without resizing or repositioning it.
   */
  visibleFragments: PixelRectangle[];
}

export interface NorthCornerReturn {
  side: VerticalRoomBoundary;
  /**
   * The north-wall tile offset where the upright wall meets this side return.
   */
  northOffset: number;
}

export interface BoundaryDoorOpening {
  side: "north" | "east" | "south" | "west";
  offset: number;
}

function isHallway(room: FacilityRoomView): boolean {
  return room.kind === "hallway" || room.definitionId === "room.hallway";
}

/**
 * Produces the single owner for vertical caps. West edges render only when
 * exposed; east edges render exposed caps and own closed room/hall partitions.
 * Hall-to-hall boundaries deliberately remain circulation, not partitions.
 */
export function getOwnedVerticalBoundaryRuns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: VerticalRoomBoundary,
  openings: readonly BoundaryDoorOpening[] = [],
): BoundaryRun[] {
  const height = roomHeight(room);
  const runs: BoundaryRun[] = [];
  let start: number | null = null;
  const hasDoor = (offset: number) => openings.some((opening) => opening.side === side && opening.offset === offset);
  for (let offset = 0; offset < height; offset += 1) {
    const segmentStart = room.tileY + offset;
    const segmentEnd = segmentStart + 1;
    const adjacent = rooms.find((candidate) => {
      if (!touchesVerticalBoundary(room, candidate, side)) return false;
      const candidateStart = candidate.tileY;
      const candidateEnd = candidate.tileY + roomHeight(candidate);
      return candidateStart < segmentEnd && candidateEnd > segmentStart;
    });
    const draw = !hasDoor(offset) && (
      !adjacent || (side === "east" && !(isHallway(room) && isHallway(adjacent)))
    );
    if (draw && start === null) start = offset;
    if (!draw && start !== null) {
      runs.push({ offset: start, length: offset - start });
      start = null;
    }
  }
  if (start !== null) runs.push({ offset: start, length: height - start });
  return runs;
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

function touchesVerticalBoundary(
  room: FacilityRoomView,
  candidate: FacilityRoomView,
  side: VerticalRoomBoundary,
): boolean {
  if (candidate.instanceId === room.instanceId) {
    return false;
  }
  if (side === "west") {
    return candidate.tileX + roomWidth(candidate) === room.tileX;
  }
  return room.tileX + roomWidth(room) === candidate.tileX;
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

/**
 * Returns the logical north/south edge segments which directly abut another
 * constructed room or hallway.  Unlike exposed runs, these are still real
 * room boundaries: renderers use them for a short, in-footprint wall rather
 * than treating them as an opening.
 */
export function getBackedHorizontalBoundaryRuns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: HorizontalRoomBoundary,
): BoundaryRun[] {
  const width = roomWidth(room);
  const runs: BoundaryRun[] = [];
  let runStart: number | null = null;

  for (let offset = 0; offset < width; offset += 1) {
    const backed = !isHorizontalBoundarySegmentExposed(room, rooms, side, offset);
    if (backed && runStart === null) runStart = offset;
    if (!backed && runStart !== null) {
      runs.push({ offset: runStart, length: offset - runStart });
      runStart = null;
    }
  }
  if (runStart !== null) runs.push({ offset: runStart, length: width - runStart });
  return runs;
}

/**
 * Logical horizontal wall ownership. North edges retain either a tall exposed
 * wall or a short shared wall; south edges retain only exposed foreground.
 */
export function getOwnedHorizontalBoundaryRuns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: HorizontalRoomBoundary,
  openings: readonly BoundaryDoorOpening[] = [],
): BoundaryRun[] {
  const width = roomWidth(room);
  const runs: BoundaryRun[] = [];
  let start: number | null = null;
  const hasDoor = (offset: number) => openings.some((opening) => opening.side === side && opening.offset === offset);
  for (let offset = 0; offset < width; offset += 1) {
    const exposed = isHorizontalBoundarySegmentExposed(room, rooms, side, offset);
    const segmentStart = room.tileX + offset;
    const segmentEnd = segmentStart + 1;
    const adjacent = rooms.find((candidate) => touchesBoundary(room, candidate, side) && candidate.tileX < segmentEnd && candidate.tileX + roomWidth(candidate) > segmentStart);
    const draw = !hasDoor(offset) && (side === "north"
      ? (exposed || !(isHallway(room) && adjacent && isHallway(adjacent)))
      : exposed);
    if (draw && start === null) start = offset;
    if (!draw && start !== null) { runs.push({ offset: start, length: offset - start }); start = null; }
  }
  if (start !== null) runs.push({ offset: start, length: width - start });
  return runs;
}

/** Backed north segments actually owned by this space (hall/hall stays open). */
export function getOwnedBackedNorthBoundaryRuns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  openings: readonly BoundaryDoorOpening[] = [],
): BoundaryRun[] {
  const owned = getOwnedHorizontalBoundaryRuns(room, rooms, "north", openings);
  const width = roomWidth(room);
  const runs: BoundaryRun[] = [];
  let start: number | null = null;
  for (let offset = 0; offset < width; offset += 1) {
    const inOwned = owned.some((run) => offset >= run.offset && offset < run.offset + run.length);
    const backed = !isHorizontalBoundarySegmentExposed(room, rooms, "north", offset);
    if (inOwned && backed && start === null) start = offset;
    if ((!inOwned || !backed) && start !== null) { runs.push({ offset: start, length: offset - start }); start = null; }
  }
  if (start !== null) runs.push({ offset: start, length: width - start });
  return runs;
}

/**
 * Returns true when a one-tile segment of a vertical room edge faces the
 * exterior. This is used to terminate an exposed rear wall with a short,
 * grounded side return only when that corner is genuinely outside.
 */
export function isVerticalBoundarySegmentExposed(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: VerticalRoomBoundary,
  offset: number,
): boolean {
  const segmentStart = room.tileY + Math.floor(offset);
  const segmentEnd = segmentStart + 1;
  return !rooms.some((candidate) => {
    if (!touchesVerticalBoundary(room, candidate, side)) {
      return false;
    }
    const candidateStart = candidate.tileY;
    const candidateEnd = candidate.tileY + roomHeight(candidate);
    return candidateStart < segmentEnd && candidateEnd > segmentStart;
  });
}

/**
 * Collapses adjacent exposed vertical segments into drawable side-wall runs.
 * As with horizontal runs, neighboring rooms and hallways both suppress a
 * shared wall so the visible floor plane remains continuous.
 */
export function getExposedVerticalBoundaryRuns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
  side: VerticalRoomBoundary,
): BoundaryRun[] {
  const runs: BoundaryRun[] = [];
  let runStart: number | null = null;
  const height = roomHeight(room);
  for (let offset = 0; offset < height; offset += 1) {
    const exposed = isVerticalBoundarySegmentExposed(
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
    runs.push({ offset: runStart, length: height - runStart });
  }
  return runs;
}

/**
 * Identifies the exposed northwest and northeast corners where the rear wall
 * may turn down into a short side-wall return. A corner is eligible only when
 * both its north segment and its adjoining side segment face the exterior.
 */
export function getExposedNorthCornerReturns(
  room: FacilityRoomView,
  rooms: readonly FacilityRoomView[],
): NorthCornerReturn[] {
  const width = roomWidth(room);
  const returns: NorthCornerReturn[] = [];
  if (
    isHorizontalBoundarySegmentExposed(room, rooms, "north", 0) &&
    isVerticalBoundarySegmentExposed(room, rooms, "west", 0)
  ) {
    returns.push({ side: "west", northOffset: 0 });
  }
  if (
    isHorizontalBoundarySegmentExposed(
      room,
      rooms,
      "north",
      width - 1,
    ) &&
    isVerticalBoundarySegmentExposed(room, rooms, "east", 0)
  ) {
    returns.push({ side: "east", northOffset: width - 1 });
  }
  return returns;
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

function intersectRectangles(
  left: PixelRectangle,
  right: PixelRectangle,
): PixelRectangle | null {
  const x = Math.max(left.x, right.x);
  const y = Math.max(left.y, right.y);
  const rightEdge = Math.min(left.x + left.width, right.x + right.width);
  const bottomEdge = Math.min(
    left.y + left.height,
    right.y + right.height,
  );
  if (rightEdge <= x || bottomEdge <= y) {
    return null;
  }
  return {
    x,
    y,
    width: rightEdge - x,
    height: bottomEdge - y,
  };
}

/**
 * Clips already-sized artwork to the exposed rear-wall faces. Keeping this
 * separate from projection lets a renderer preserve the pixel sprite's native
 * aspect ratio before applying the cutaway crop.
 */
export function getVisibleRearWallArtworkFragments(
  artworkBounds: PixelRectangle,
  floor: PixelRectangle,
  exposedRuns: readonly BoundaryRun[],
  tileSize: number,
  faceHeight: number,
): PixelRectangle[] {
  const normalizedFaceHeight = Math.max(1, faceHeight);
  return exposedRuns.flatMap((run) => {
    const face = projectRearWallRun(
      floor,
      run,
      tileSize,
      normalizedFaceHeight,
      1,
    ).face;
    const fragment = intersectRectangles(artworkBounds, face);
    return fragment ? [fragment] : [];
  });
}

/**
 * Places rear-wall artwork against the complete wall coordinate system and
 * then clips it to exposed runs. Partial northern coverage therefore removes
 * the covered portion instead of squeezing the entire decoration into whichever
 * exposed run happens to be largest.
 */
export function projectRearWallArtwork(
  floor: PixelRectangle,
  exposedRuns: readonly BoundaryRun[],
  tileSize: number,
  faceHeight: number,
  centerXRatio: number,
  centerYRatio: number,
  widthRatio: number,
  heightRatio: number,
): RearWallArtworkProjection {
  const normalizedFaceHeight = Math.max(1, faceHeight);
  const artworkWidth = Math.max(1, floor.width * Math.max(0, widthRatio));
  const artworkHeight = Math.max(
    1,
    normalizedFaceHeight * Math.max(0, heightRatio),
  );
  const wallTop = floor.y - normalizedFaceHeight;
  const bounds: PixelRectangle = {
    x:
      floor.x +
      floor.width * Math.max(0, Math.min(1, centerXRatio)) -
      artworkWidth / 2,
    y:
      wallTop +
      normalizedFaceHeight * Math.max(0, Math.min(1, centerYRatio)) -
      artworkHeight / 2,
    width: artworkWidth,
    height: artworkHeight,
  };
  const visibleFragments = getVisibleRearWallArtworkFragments(
    bounds,
    floor,
    exposedRuns,
    tileSize,
    normalizedFaceHeight,
  );
  return { bounds, visibleFragments };
}

/**
 * Returns the visible wall-face portion of the shared surgery-center
 * north-wall envelope. The remaining outer-border cap is supplied by the
 * renderer, so face plus cap is always the measured Front Desk v4 envelope.
 * `roomPixelHeight` remains a compatibility argument but cannot affect the
 * architectural height.
 */
export function getRearWallFaceHeight(
  _roomPixelHeight: number,
  tileSize: number,
): number {
  const geometry = getSurgeryCenterArchitectureAtScale(tileSize);
  return Math.max(1, geometry.northEnvelope - geometry.outerBorderY);
}
