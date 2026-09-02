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
  /** A backed shared north boundary is wall decoration, not a foreground lip. */
  shortNorthHeight: number;
}

export interface CanonicalRoomShellLayout {
  components: readonly CanonicalRoomShellComponent[];
  geometry: CanonicalRoomShellGeometry;
  /** Remaining north-wall intervals, in display pixels, for wall decor clips. */
  northWallFaceRuns: readonly CanonicalRoomWallRun[];
}

/** Footprint-relative north-edge segments backed by constructed space. */
export interface CanonicalRoomBackedNorthRun {
  offset: number;
  length: number;
}

/** Actual exposed hall perimeter segments in floor-local display pixels. */
export interface CanonicalRoomExposedEdges {
  north: readonly CanonicalRoomWallRun[];
  east: readonly CanonicalRoomWallRun[];
  south: readonly CanonicalRoomWallRun[];
  west: readonly CanonicalRoomWallRun[];
}

export interface CanonicalRoomWallDecorBounds extends CanonicalRoomShellRect {}

/** Clips wall art to real remaining north-wall face runs, including doors. */
export function getCanonicalNorthWallDecorFragments(
  layout: CanonicalRoomShellLayout,
  floor: CanonicalRoomShellRect,
  decor: CanonicalRoomWallDecorBounds,
): readonly CanonicalRoomWallDecorBounds[] {
  const wallTop = floor.y - layout.geometry.northHeight + 2;
  const wallBottom = floor.y - 2;
  return layout.northWallFaceRuns.flatMap((run) => {
    const left = Math.max(decor.x, floor.x + run.start + 2);
    const right = Math.min(decor.x + decor.width, floor.x + run.start + run.length - 2);
    const top = Math.max(decor.y, wallTop);
    const bottom = Math.min(decor.y + decor.height, wallBottom);
    return right > left && bottom > top
      ? [{ x: left, y: top, width: right - left, height: bottom - top }]
      : [];
  });
}

/**
 * Whole-art guard for independently positioned wall sprites. A decoration
 * must fit inside one real tall north-wall face; it is never cropped or moved
 * onto a backed short wall.
 */
export function isCanonicalNorthWallDecorFullySupported(
  layout: CanonicalRoomShellLayout,
  floor: CanonicalRoomShellRect,
  decor: CanonicalRoomWallDecorBounds,
): boolean {
  const wallTop = floor.y - layout.geometry.northHeight;
  const wallBottom = floor.y;
  if (decor.y < wallTop || decor.y + decor.height > wallBottom) return false;
  return layout.northWallFaceRuns.some((run) => {
    const left = floor.x + run.start;
    const right = left + run.length;
    return decor.x >= left && decor.x + decor.width <= right;
  });
}

/** Enclosed room definitions that use the common cutaway construction. */
export const CANONICAL_ENCLOSED_ROOM_DEFINITION_IDS = [
  "room.waiting",
  "room.bathroom",
  "room.xray",
  "room.imaging_control",
  "room.minor_procedure",
  "room.ultrasound",
  "room.ct",
  "room.phlebotomy",
  "room.evs_closet",
  "room.endoscopy",
  "room.periop_recovery",
  "room.training",
  "room.coffee_kiosk",
  "room.glp1_telehealth_suite",
] as const;

export function isCanonicalEnclosedRoomDefinition(definitionId: string): boolean {
  return (CANONICAL_ENCLOSED_ROOM_DEFINITION_IDS as readonly string[]).includes(definitionId);
}

const FRONT_DESK_COLUMNS = 5;
const FRONT_DESK_VISIBLE_FLOOR_ASPECT_RATIO = 1.53;
const NORTH_HEIGHT_PER_TILE =
  (FRONT_DESK_COLUMNS / FRONT_DESK_VISIBLE_FLOOR_ASPECT_RATIO) * 0.34;
// The floor-plate's straight side border measures about fifteen percent of a
// tile at the shared 64px map scale.  Side walls are top-down caps, never the
// former half-tile upright returns.
const SIDE_WIDTH_PER_TILE = 0.15;
const FRONT_HEIGHT_PER_TILE =
  (FRONT_DESK_COLUMNS / FRONT_DESK_VISIBLE_FLOOR_ASPECT_RATIO) * (0.27 / 2);
// Backed north edges are deliberately only a baseboard plus a sliver of the
// room's wallpaper.  They must never read as the cutaway's south foreground.
const SHORT_NORTH_HEIGHT_PER_TILE = 0.10;
/** A persisted doorway owns its entire logical wall tile, with no shoulders. */
const DOOR_APERTURE_RATIO = 1;
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

function intersectWallRuns(
  left: readonly CanonicalRoomWallRun[],
  right: readonly CanonicalRoomWallRun[],
): CanonicalRoomWallRun[] {
  return left.flatMap((leftRun) => right.flatMap((rightRun) => {
    const start = Math.max(leftRun.start, rightRun.start);
    const end = Math.min(leftRun.start + leftRun.length, rightRun.start + rightRun.length);
    return end > start + 0.5 ? [{ start, length: end - start }] : [];
  }));
}

function subtractWallRuns(
  source: readonly CanonicalRoomWallRun[],
  removed: readonly CanonicalRoomWallRun[],
): CanonicalRoomWallRun[] {
  let remaining = [...source];
  for (const cut of removed) {
    remaining = remaining.flatMap((run) => {
      const start = run.start;
      const end = run.start + run.length;
      const cutStart = Math.max(start, cut.start);
      const cutEnd = Math.min(end, cut.start + cut.length);
      if (cutEnd <= cutStart) return [run];
      return [
        ...(cutStart > start + 0.5 ? [{ start, length: cutStart - start }] : []),
        ...(cutEnd < end - 0.5 ? [{ start: cutEnd, length: end - cutEnd }] : []),
      ];
    });
  }
  return remaining;
}

/**
 * Produces only the component strips needed around an open circulation floor.
 * It shares the enclosed-shell geometry exactly, but intentionally has no
 * implicit walls or side-return shoulder extensions on suppressed edges.
 */
export function getCanonicalHallwayEdgeComponents(
  floor: CanonicalRoomShellRect,
  footprint: Readonly<{ width: number; height: number }>,
  exposed: CanonicalRoomExposedEdges,
  skin: CanonicalRoomShellSkin = DEFAULT_SKIN,
  shortNorth: readonly CanonicalRoomWallRun[] = [],
  sideRuns?: Readonly<Partial<Record<"west" | "east", readonly CanonicalRoomWallRun[]>>>,
): readonly CanonicalRoomShellComponent[] {
  const shell = getCanonicalRoomShellLayout(floor, footprint, [], false, skin);
  const { geometry } = shell;
  const components: CanonicalRoomShellComponent[] = [];
  exposed.north.forEach((run, index) => components.push({
    key: `hallway-north-${index}`, frameId: "northWall",
    bounds: { x: floor.x + run.start, y: floor.y - geometry.northHeight, width: run.length, height: geometry.northHeight },
    layer: "base", side: "north", skinId: skin.id,
  }));
  shortNorth.forEach((run, index) => components.push({
    key: `hallway-north-short-${index}`, frameId: run.start === 0 ? "frontWest" : "frontEast",
    bounds: { x: floor.x + run.start, y: floor.y, width: run.length, height: geometry.shortNorthHeight },
    layer: "base", side: "north", skinId: skin.id,
  }));
  const addSide = (side: "west" | "east", runs: readonly CanonicalRoomWallRun[], frameId: FrontDeskV3ArchitectureId) => {
    const x = side === "west" ? floor.x - geometry.sideWidth / 2 : floor.x + floor.width - geometry.sideWidth / 2;
    runs.forEach((run, index) => components.push({
      key: `hallway-${side}-${index}`, frameId,
      bounds: { x, y: floor.y + run.start, width: geometry.sideWidth, height: run.length },
      layer: "base", side, skinId: skin.id,
    }));
  };
  addSide("west", sideRuns?.west ?? exposed.west, "westCap");
  addSide("east", sideRuns?.east ?? exposed.east, "eastCap");
  exposed.south.forEach((run, index) => {
    const component: CanonicalRoomShellComponent = {
      key: `hallway-front-${index}-base`, frameId: run.start === 0 ? "frontWest" : "frontEast",
      bounds: { x: floor.x + run.start, y: geometry.frontTop, width: run.length, height: geometry.frontHeight },
      layer: "base", side: "south", skinId: skin.id,
    };
    components.push(component, { ...component, key: component.key.replace("-base", "-occluder"), layer: "front-occluder" });
  });
  return components;
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
  backedNorthRuns: readonly CanonicalRoomBackedNorthRun[] = [],
  backedSouthRuns: readonly CanonicalRoomBackedNorthRun[] = [],
  sideRuns?: Readonly<Partial<Record<"west" | "east", readonly CanonicalRoomWallRun[]>>>,
): CanonicalRoomShellLayout {
  // A floor's logical width always maps to its on-screen tile width. This is
  // deliberately not based on total room dimensions: a 5x4 desk and either
  // 3x2/2x3 Examination footprint therefore share one exact wall grammar.
  const unit = floor.width / Math.max(1, footprint.width);
  const northHeight = unit * NORTH_HEIGHT_PER_TILE;
  const sideWidth = unit * SIDE_WIDTH_PER_TILE;
  // Side caps begin and end exactly at the floor.  North and south own their
  // respective horizontal corner regions, so no side shoulder/extension can
  // survive under a live east/west door gap.
  const sideTop = floor.y;
  const sideHeight = floor.height;
  const frontHeight = unit * FRONT_HEIGHT_PER_TILE;
  const shortNorthHeight = unit * SHORT_NORTH_HEIGHT_PER_TILE;
  const frontTop = floor.y + floor.height - frontHeight;
  const geometry = { northHeight, sideWidth, sideTop, sideHeight, frontHeight, frontTop, shortNorthHeight };
  // Doors subtract their exact aperture first. Backing then merely changes
  // the remaining wall's presentation height, never its existence.
  const northRuns = getCanonicalRoomWallRuns(floor.width, openings, "north", footprint.width);
  const backedNorthPixels = backedNorthRuns
    .map((run) => ({
      start: Math.max(0, run.offset) * unit,
      length: Math.max(0, Math.min(footprint.width - Math.max(0, run.offset), run.length)) * unit,
    }))
    .filter((run) => run.length > 0.5);
  const shortNorthRuns = intersectWallRuns(northRuns, backedNorthPixels);
  const tallNorthRuns = subtractWallRuns(northRuns, backedNorthPixels);
  const backedSouthPixels = backedSouthRuns
    .map((run) => ({ start: Math.max(0, run.offset) * unit, length: Math.max(0, Math.min(footprint.width - Math.max(0, run.offset), run.length)) * unit }))
    .filter((run) => run.length > 0.5);
  // A shared horizontal edge is owned by the constructed space south of it.
  // The northern neighbor never repeats a foreground lip over that short wall.
  const southRuns = subtractWallRuns(
    getCanonicalRoomWallRuns(floor.width, openings, "south", footprint.width),
    backedSouthPixels,
  );
  const westRuns = sideRuns?.west ?? getCanonicalRoomWallRuns(floor.height, openings, "west", footprint.height);
  const eastRuns = sideRuns?.east ?? getCanonicalRoomWallRuns(floor.height, openings, "east", footprint.height);
  const base: CanonicalRoomShellComponent[] = includeFloor
    ? [{ key: "floor", frameId: "floorPlate", bounds: floor, layer: "base", skinId: skin.id }]
    : [];
  tallNorthRuns.forEach((run, index) => base.push({ key: `north-wall-${index}`, frameId: "northWall", bounds: { x: floor.x + run.start, y: floor.y - northHeight, width: run.length, height: northHeight }, layer: "base", side: "north", skinId: skin.id }));
  // A backed north boundary uses only a compressed baseboard/wallpaper strip
  // inside the southern floor. It is never repeated as a foreground occluder.
  shortNorthRuns.forEach((run, index) => base.push({ key: `north-short-${index}-base`, frameId: run.start === 0 ? "frontWest" : "frontEast", bounds: { x: floor.x + run.start, y: floor.y, width: run.length, height: shortNorthHeight }, layer: "base", side: "north", skinId: skin.id }));
  const addSide = (side: "west" | "east", runs: readonly CanonicalRoomWallRun[], frameId: FrontDeskV3ArchitectureId) => {
    // Side caps straddle a global tile border. Shared-boundary ownership in
    // the caller ensures this produces one cap, rather than two inset caps.
    const x = side === "west" ? floor.x - sideWidth / 2 : floor.x + floor.width - sideWidth / 2;
    runs.forEach((run, index) => {
      if (run.length > 0.5) {
        base.push({
          key: `${side}-return-${index}`,
          frameId,
          bounds: { x, y: floor.y + run.start, width: sideWidth, height: run.length },
          layer: "base",
          side,
          skinId: skin.id,
        });
      }
    });
  };
  addSide("west", westRuns, "westCap");
  addSide("east", eastRuns, "eastCap");
  southRuns.forEach((run, index) => base.push({ key: `front-${index}-base`, frameId: run.start === 0 ? "frontWest" : "frontEast", bounds: { x: floor.x + run.start, y: frontTop, width: run.length, height: frontHeight }, layer: "base", side: "south", skinId: skin.id }));
  return {
    components: [...base, ...base.filter((component) => component.side === "south").map((component) => ({ ...component, key: component.key.replace("-base", "-occluder"), layer: "front-occluder" as const }))],
    geometry,
    northWallFaceRuns: tallNorthRuns,
  };
}
