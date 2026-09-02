import {
  getCanonicalRoomShellLayout,
  getCanonicalRoomWallRuns,
  type CanonicalRoomShellComponent,
  type CanonicalRoomWallOpening,
  type CanonicalRoomBackedNorthRun,
  type CanonicalRoomWallRun,
} from "./canonicalRoomShell";

export type ExaminationWallSide = "north" | "east" | "south" | "west";

export type ExaminationDoorOpening = CanonicalRoomWallOpening;

export interface ExaminationWallRun {
  offset: number;
  length: number;
}

/**
 * Presentation-only wall subtraction.  Room adjacency is deliberately not an
 * input: Examination walls remain closed until a live door owns a slot.
 */
export function getExaminationV3WallRuns(
  width: number,
  height: number,
  openings: readonly ExaminationDoorOpening[],
): Readonly<Record<ExaminationWallSide, readonly ExaminationWallRun[]>> {
  const lengthFor = (side: ExaminationWallSide) => side === "north" || side === "south" ? width : height;
  const forSide = (side: ExaminationWallSide): readonly ExaminationWallRun[] =>
    getCanonicalRoomWallRuns(lengthFor(side), openings, side, lengthFor(side))
      .map((run) => ({ offset: run.start, length: run.length }));
  return { north: forSide("north"), east: forSide("east"), south: forSide("south"), west: forSide("west") };
}

/** The front lip stays intentionally shallow and shares fixture baseline sort. */
export function getExaminationV3ForegroundGeometry(tileSize: number) {
  const layout = getCanonicalRoomShellLayout(
    { x: 0, y: 0, width: tileSize, height: tileSize },
    { width: 1, height: 1 },
    [],
    false,
  );
  return { height: layout.geometry.frontHeight, inset: Math.max(2, Math.round(tileSize * 0.04)) };
}

/** Shared Front Desk-derived components; Examination retains its own floor skin. */
export function getExaminationV3ArchitectureComponents(
  floor: Readonly<{ x: number; y: number; width: number; height: number }>,
  footprint: Readonly<{ width: number; height: number }>,
  openings: readonly ExaminationDoorOpening[],
  backedNorthRuns: readonly CanonicalRoomBackedNorthRun[] = [],
  backedSouthRuns: readonly CanonicalRoomBackedNorthRun[] = [],
  sideRuns?: Readonly<Partial<Record<"west" | "east", readonly CanonicalRoomWallRun[]>>>,
): readonly CanonicalRoomShellComponent[] {
  return getCanonicalRoomShellLayout(floor, footprint, openings, false, undefined, backedNorthRuns, backedSouthRuns, sideRuns).components;
}
