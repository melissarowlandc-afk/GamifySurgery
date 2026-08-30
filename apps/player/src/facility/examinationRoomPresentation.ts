import type { FixtureId } from "../art/fixtureArt";
import { SURGERY_CENTER_WALL_GEOMETRY } from "./surgeryCenterArchitecture";

/**
 * The Examination Room is an authored, north-up cutaway.  These two
 * compositions deliberately do not mechanically rotate one furnished room:
 * the 3-by-2 and 2-by-3 footprints each keep their rear wall at world north
 * and reserve an approachable, fixture-clear candidate on every wall.
 */
export type ExaminationRoomOrientation = 0 | 90;

export interface ExaminationFixturePlacement {
  id: FixtureId;
  centerXRatio: number;
  centerYRatio: number;
  widthRatio: number;
  heightRatio: number;
  /** Wall-mounted art is rendered against the north wall, never rotated. */
  wallMounted?: boolean;
  /** A chart is optional when a shorter exposed north run would cover it. */
  optionalNorthWallArt?: boolean;
}

export interface ExaminationRoomPresentation {
  orientation: ExaminationRoomOrientation;
  atlasId: "room-fixtures:examination-v2-horizontal" | "room-fixtures:examination-v2-vertical";
  sourceSize: number;
  /** Measured source bounds that map exactly to the semantic room rectangle. */
  floor: Readonly<{ x: number; y: number; width: number; height: number }>;
  /** Low south lip redrawn above actors for correct foreground occlusion. */
  frontOccluder: Readonly<{ x: number; y: number; width: number; height: number }>;
  /** Must remain the measured Front Desk v4 construction grammar. */
  wallGeometry: typeof SURGERY_CENTER_WALL_GEOMETRY;
  fixtures: readonly ExaminationFixturePlacement[];
}

const SOURCE_SIZE = 960;

/**
 * Fixtures are intentionally kept off the central north/south entries and
 * the open middle of either side.  Their semantic collision remains in the
 * domain; these are presentation envelopes only.
 */
const HORIZONTAL_FIXTURES: readonly ExaminationFixturePlacement[] = [
  { id: "sinkCabinet", centerXRatio: 0.17, centerYRatio: 0.23, widthRatio: 0.33, heightRatio: 0.46 },
  { id: "examTable", centerXRatio: 0.64, centerYRatio: 0.63, widthRatio: 0.32, heightRatio: 0.72 },
  { id: "rollingStool", centerXRatio: 0.34, centerYRatio: 0.64, widthRatio: 0.2, heightRatio: 0.27 },
  { id: "wasteBin", centerXRatio: 0.88, centerYRatio: 0.84, widthRatio: 0.13, heightRatio: 0.2 },
  { id: "diagnosticPanel", centerXRatio: 0.49, centerYRatio: 0.51, widthRatio: 0.17, heightRatio: 0.72, wallMounted: true },
  { id: "gloveDispenser", centerXRatio: 0.66, centerYRatio: 0.51, widthRatio: 0.1, heightRatio: 0.58, wallMounted: true },
  { id: "wallChart", centerXRatio: 0.83, centerYRatio: 0.51, widthRatio: 0.13, heightRatio: 0.7, wallMounted: true, optionalNorthWallArt: true },
];

const VERTICAL_FIXTURES: readonly ExaminationFixturePlacement[] = [
  { id: "sinkCabinet", centerXRatio: 0.23, centerYRatio: 0.18, widthRatio: 0.44, heightRatio: 0.31 },
  { id: "examTable", centerXRatio: 0.56, centerYRatio: 0.67, widthRatio: 0.46, heightRatio: 0.53 },
  { id: "rollingStool", centerXRatio: 0.49, centerYRatio: 0.42, widthRatio: 0.28, heightRatio: 0.18 },
  { id: "wasteBin", centerXRatio: 0.15, centerYRatio: 0.84, widthRatio: 0.18, heightRatio: 0.14 },
  { id: "diagnosticPanel", centerXRatio: 0.52, centerYRatio: 0.51, widthRatio: 0.2, heightRatio: 0.72, wallMounted: true },
  { id: "gloveDispenser", centerXRatio: 0.73, centerYRatio: 0.51, widthRatio: 0.12, heightRatio: 0.58, wallMounted: true },
];

export const EXAMINATION_ROOM_PRESENTATIONS: Readonly<Record<ExaminationRoomOrientation, ExaminationRoomPresentation>> = {
  0: {
    orientation: 0,
    atlasId: "room-fixtures:examination-v2-horizontal",
    sourceSize: SOURCE_SIZE,
    floor: { x: 118, y: 270, width: 724, height: 482 },
    frontOccluder: { x: 83, y: 732, width: 794, height: 80 },
    wallGeometry: SURGERY_CENTER_WALL_GEOMETRY,
    fixtures: HORIZONTAL_FIXTURES,
  },
  90: {
    orientation: 90,
    atlasId: "room-fixtures:examination-v2-vertical",
    sourceSize: SOURCE_SIZE,
    floor: { x: 237, y: 150, width: 482, height: 724 },
    frontOccluder: { x: 202, y: 854, width: 552, height: 80 },
    wallGeometry: SURGERY_CENTER_WALL_GEOMETRY,
    fixtures: VERTICAL_FIXTURES,
  },
};

export function getExaminationRoomPresentation(
  orientation: number | undefined,
): ExaminationRoomPresentation {
  return orientation === 90
    ? EXAMINATION_ROOM_PRESENTATIONS[90]
    : EXAMINATION_ROOM_PRESENTATIONS[0];
}
