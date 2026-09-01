import type { FrontDeskV3ArchitectureId } from "../art/bitmapAssetManifest";

/** A renderer-only rectangle; gameplay continues to use logical room tiles. */
export interface CanonicalRoomShellRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CanonicalRoomWallSide = "north" | "east" | "south" | "west";

export interface CanonicalRoomWallOpening {
  side: CanonicalRoomWallSide;
  offset: number;
}

export interface CanonicalRoomWallRun {
  start: number;
  length: number;
}

export type CanonicalRoomShellLayer = "base" | "front-occluder";

export interface CanonicalRoomShellComponent {
  key: string;
  frameId: FrontDeskV3ArchitectureId;
  bounds: CanonicalRoomShellRect;
  layer: CanonicalRoomShellLayer;
  side?: CanonicalRoomWallSide;
  /** Metadata seam for a future same-geometry room-specific wall skin. */
  skinId: string;
}

export interface CanonicalRoomShellSkin {
  /** A material identity only; it must never change structural geometry. */
  id: string;
}

export interface CanonicalRoomShellGeometry {
  northHeight: number;
  sideWidth: number;
  sideTop: number;
  sideHeight: number;
  /** The Front Desk v5 front lip was 27% of the floor; canonical is half. */
  frontHeight: number;
  frontTop: number;
}

export interface CanonicalRoomShellLayout {
  components: readonly CanonicalRoomShellComponent[];
  geometry: CanonicalRoomShellGeometry;
  /** Remaining north-wall intervals, in display pixels, for wall decor clips. */
  northWallFaceRuns: readonly CanonicalRoomWallRun[];
}

const FRONT_DESK_COLUMNS = 5;
const FRONT_DESK_VISIBLE_FLOOR_ASPECT_RATIO = 1.53;
const NORTH_HEIGHT_PER_TILE =
  (FRONT_DESK_COLUMNS / FRONT_DESK_VISIBLE_FLOOR_ASPECT_RATIO) * 0.34;
const SIDE_WIDTH_PER_TILE = FRONT_DESK_COLUMNS * 0.105;
const FRONT_HEIGHT_PER_TILE =
  (FRONT_DESK_COLUMNS / FRONT_DESK_VISIBLE_FLOOR_ASPECT_RATIO) * (0.27 / 2);
const DOOR_APERTURE_RATIO = 0.68;
const DEFAULT_SKIN: CanonicalRoomShellSkin = { id: "front-desk-v3" };

export function getCanonicalRoomWallRuns(
  length: number,
  openings: readonly CanonicalRoomWallOpening[],
  side: CanonicalRoomWallSide,
  slotCount: number,
): readonly CanonicalRoomWallRun[] {
  const tileSpan = length / Math.max(1, slotCount);
  let cursor = 0;
  const runs: CanonicalRoomWallRun[] = [];
  for (const opening of openings
    .filter((candidate) => candidate.side === side && candidate.offset >= 0 && candidate.offset < slotCount)
    .map((candidate) => {
      const center = (candidate.offset + 0.5) * tileSpan;
      const half = tileSpan * DOOR_APERTURE_RATIO / 2;
      return { start: Math.max(0, center - half), end: Math.min(length, center + half) };
    })
    .sort((left, right) => left.start - right.start)) {
    if (opening.start > cursor) runs.push({ start: cursor, length: opening.start - cursor });
    cursor = Math.max(cursor, opening.end);
  }
  if (cursor < length) runs.push({ start: cursor, length: length - cursor });
  return runs.filter((run) => run.length > 0.5);
}

/**
 * The one structural grammar used by enclosed cutaway rooms. The exact v3
 * component atlas supplies the common bevels, corners, and return language;
 * callers may keep their own floor and later apply room-specific wall skins.
 */
export function getCanonicalRoomShellLayout(
  floor: CanonicalRoomShellRect,
  footprint: Readonly<{ width: number; height: number }>,
  openings: readonly CanonicalRoomWallOpening[] = [],
  includeFloor = true,
  skin: CanonicalRoomShellSkin = DEFAULT_SKIN,
): CanonicalRoomShellLayout {
  // A floor's logical width always maps to its on-screen tile width. This is
  // deliberately not based on total room dimensions: a 5x4 desk and either
  // 3x2/2x3 Examination footprint therefore share one exact wall grammar.
  const unit = floor.width / Math.max(1, footprint.width);
  const northHeight = unit * NORTH_HEIGHT_PER_TILE;
  const sideWidth = unit * SIDE_WIDTH_PER_TILE;
  const sideTop = floor.y - northHeight * 0.18;
  const sideHeight = floor.height + northHeight * 0.28;
  const frontHeight = unit * FRONT_HEIGHT_PER_TILE;
  const frontTop = floor.y + floor.height - frontHeight;
  const geometry = { northHeight, sideWidth, sideTop, sideHeight, frontHeight, frontTop };
  const northRuns = getCanonicalRoomWallRuns(floor.width, openings, "north", footprint.width);
  const southRuns = getCanonicalRoomWallRuns(floor.width, openings, "south", footprint.width);
  const westRuns = getCanonicalRoomWallRuns(floor.height, openings, "west", footprint.height);
  const eastRuns = getCanonicalRoomWallRuns(floor.height, openings, "east", footprint.height);
  const base: CanonicalRoomShellComponent[] = includeFloor
    ? [{ key: "floor", frameId: "floorPlate", bounds: floor, layer: "base", skinId: skin.id }]
    : [];
  northRuns.forEach((run, index) => base.push({ key: `north-wall-${index}`, frameId: "northWall", bounds: { x: floor.x + run.start, y: floor.y - northHeight, width: run.length, height: northHeight }, layer: "base", side: "north", skinId: skin.id }));
  const addSide = (side: "west" | "east", runs: readonly CanonicalRoomWallRun[], frameId: FrontDeskV3ArchitectureId) => {
    const x = side === "west" ? floor.x : floor.x + floor.width - sideWidth;
    const push = (key: string, y: number, height: number) => {
      if (height > 0.5) base.push({ key, frameId, bounds: { x, y, width: sideWidth, height }, layer: "base", side, skinId: skin.id });
    };
    // The side return's top/bottom extensions are structural, while apertures
    // remain anchored to real floor slots (not to sideTop).
    push(`${side}-return-top`, sideTop, floor.y - sideTop);
    runs.forEach((run, index) => push(`${side}-return-${index}`, floor.y + run.start, run.length));
    push(`${side}-return-bottom`, floor.y + floor.height, sideTop + sideHeight - (floor.y + floor.height));
  };
  addSide("west", westRuns, "westReturn");
  addSide("east", eastRuns, "eastReturn");
  southRuns.forEach((run, index) => base.push({ key: `front-${index}-base`, frameId: run.start === 0 ? "frontWest" : "frontEast", bounds: { x: floor.x + run.start, y: frontTop, width: run.length, height: frontHeight }, layer: "base", side: "south", skinId: skin.id }));
  return {
    components: [...base, ...base.filter((component) => component.side === "south").map((component) => ({ ...component, key: component.key.replace("-base", "-occluder"), layer: "front-occluder" as const }))],
    geometry,
    northWallFaceRuns: northRuns,
  };
}
