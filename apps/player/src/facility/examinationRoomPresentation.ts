import type { FixtureId } from "../art/fixtureArt";
import { SURGERY_CENTER_WALL_GEOMETRY } from "./surgeryCenterArchitecture";

/** Version 3: deliberately authored north-up Examination compositions. */
export type ExaminationRoomOrientation = 0 | 90;

export interface ExaminationFixturePlacement {
  id: FixtureId;
  centerXRatio: number;
  centerYRatio: number;
  widthRatio: number;
  heightRatio: number;
  wallMounted?: boolean;
  /** The real logical north-wall slot(s) this decoration occupies. */
  northWallOffsets?: readonly number[];
  /** Presentation-only sprite rotation; never changes the logical room. */
  rotationDegrees?: 0 | 90 | 180 | 270;
  /** Makes the deliberately directional examination-bed pose reviewable. */
  footDirection?: "left" | "north";
}

export interface ExaminationRoomPresentation {
  orientation: ExaminationRoomOrientation;
  version: 3;
  wallGeometry: typeof SURGERY_CENTER_WALL_GEOMETRY;
  fixtures: readonly ExaminationFixturePlacement[];
}

/**
 * These are display-only authoring grids over the existing logical footprints:
 * horizontal = 4 columns x 2 rows, vertical = 2 columns x 4 rows.  They are
 * intentionally north-up compositions, rather than a second transform of
 * domain orientation.
 */
const HORIZONTAL_FIXTURES: readonly ExaminationFixturePlacement[] = [
  { id: "sinkCabinet", centerXRatio: 0.125, centerYRatio: 0.25, widthRatio: 0.22, heightRatio: 0.42 },
  { id: "examinationPaperTowel", centerXRatio: 0.125, centerYRatio: 0.22, widthRatio: 0.075, heightRatio: 0.22, wallMounted: true, northWallOffsets: [0] },
  { id: "wasteBin", centerXRatio: 0.125, centerYRatio: 0.42, widthRatio: 0.065, heightRatio: 0.10 },
  { id: "rollingStool", centerXRatio: 0.375, centerYRatio: 0.75, widthRatio: 0.19, heightRatio: 0.24 },
  // The atlas bed is portrait with its foot at source-bottom. Clockwise 90°
  // makes that foot point left toward B2.
  { id: "examTable", centerXRatio: 0.75, centerYRatio: 0.75, widthRatio: 0.46, heightRatio: 0.36, rotationDegrees: 90, footDirection: "left" },
  { id: "diagnosticPanel", centerXRatio: 0.875, centerYRatio: 0.48, widthRatio: 0.12, heightRatio: 0.54, wallMounted: true, northWallOffsets: [2] },
];

const VERTICAL_FIXTURES: readonly ExaminationFixturePlacement[] = [
  { id: "sinkCabinet", centerXRatio: 0.75, centerYRatio: 0.125, widthRatio: 0.34, heightRatio: 0.20 },
  { id: "examinationPaperTowel", centerXRatio: 0.75, centerYRatio: 0.42, widthRatio: 0.12, heightRatio: 0.18, wallMounted: true, northWallOffsets: [1] },
  { id: "wasteBin", centerXRatio: 0.87, centerYRatio: 0.20, widthRatio: 0.08, heightRatio: 0.10 },
  { id: "rollingStool", centerXRatio: 0.25, centerYRatio: 0.375, widthRatio: 0.28, heightRatio: 0.15 },
  // A half-turn retains the portrait silhouette and sends source-bottom up
  // toward the B1 stool.
  { id: "examTable", centerXRatio: 0.25, centerYRatio: 0.75, widthRatio: 0.34, heightRatio: 0.46, rotationDegrees: 180, footDirection: "north" },
  { id: "diagnosticPanel", centerXRatio: 0.25, centerYRatio: 0.48, widthRatio: 0.20, heightRatio: 0.42, wallMounted: true, northWallOffsets: [0] },
];

export const EXAMINATION_ROOM_PRESENTATIONS: Readonly<Record<ExaminationRoomOrientation, ExaminationRoomPresentation>> = {
  0: { orientation: 0, version: 3, wallGeometry: SURGERY_CENTER_WALL_GEOMETRY, fixtures: HORIZONTAL_FIXTURES },
  90: { orientation: 90, version: 3, wallGeometry: SURGERY_CENTER_WALL_GEOMETRY, fixtures: VERTICAL_FIXTURES },
};

/** A wall fixture renders only while every authored logical north slot remains wall. */
export function isExaminationNorthWallFixtureVisible(
  fixture: ExaminationFixturePlacement,
  liveNorthDoorOffsets: readonly number[],
): boolean {
  if (!fixture.wallMounted) return false;
  return !(fixture.northWallOffsets ?? []).some((offset) =>
    liveNorthDoorOffsets.includes(offset),
  );
}

/** A backed wall suppresses only fixtures anchored in the backed slot(s). */
export function isExaminationNorthWallFixtureBacked(
  fixture: ExaminationFixturePlacement,
  backedNorthOffsets: readonly number[],
): boolean {
  return fixture.wallMounted === true && (fixture.northWallOffsets ?? []).some(
    (offset) => backedNorthOffsets.includes(offset),
  );
}

export function getExaminationRoomPresentation(orientation: number | undefined): ExaminationRoomPresentation {
  return orientation === 90 ? EXAMINATION_ROOM_PRESENTATIONS[90] : EXAMINATION_ROOM_PRESENTATIONS[0];
}
