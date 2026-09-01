import type { CardinalDirection } from "@gamify-surgery/game-domain";

import type { FixtureId } from "../art/fixtureArt";

/**
 * Renderer-only packages for the five Level 1 rooms being redrawn from the
 * shared clinic reference. Room footprint, door rules, navigation, and saves
 * deliberately remain in the domain.
 */
export const FIVE_REFERENCE_ROOM_IDS = [
  "room.waiting",
  "room.bathroom",
  "room.xray",
  "room.imaging_control",
  "room.minor_procedure",
] as const;

export type FiveReferenceRoomId = (typeof FIVE_REFERENCE_ROOM_IDS)[number];
export type FiveRoomOrientation = 0 | 90;

export interface FiveRoomFixturePlacement {
  id: FixtureId;
  centerXRatio: number;
  centerYRatio: number;
  widthRatio: number;
  heightRatio: number;
  /** Keep authored perspective art north-up instead of rotating it with a room. */
  preserveScreenOrientation?: boolean;
  /** A wall fixture is bound to the physical north cutaway wall, never the floor. */
  wallMounted?: boolean;
  /** Whole wall art is omitted if a live north door occupies one of these cells. */
  northWallOffsets?: readonly number[];
}

export interface FiveRoomPresentation {
  roomId: FiveReferenceRoomId;
  orientation: FiveRoomOrientation;
  fixtures: readonly FiveRoomFixturePlacement[];
}

/** Reserved presentation-only doorway intervals from the approved room plan. */
export interface FiveRoomDoorClearZone {
  side: CardinalDirection;
  startRatio: number;
  endRatio: number;
}

const DOOR_CLEAR_ZONES: Readonly<Record<FiveReferenceRoomId, readonly FiveRoomDoorClearZone[]>> = {
  "room.waiting": [
    { side: "north", startRatio: 0.04, endRatio: 0.2 },
    { side: "east", startRatio: 0.4, endRatio: 0.56 },
    { side: "south", startRatio: 0.04, endRatio: 0.22 },
    { side: "west", startRatio: 0.12, endRatio: 0.3 },
  ],
  "room.bathroom": [
    { side: "north", startRatio: 0.54, endRatio: 0.74 },
    { side: "east", startRatio: 0.14, endRatio: 0.34 },
    { side: "south", startRatio: 0.14, endRatio: 0.34 },
    { side: "west", startRatio: 0.54, endRatio: 0.74 },
  ],
  "room.xray": [
    { side: "north", startRatio: 0.74, endRatio: 0.9 },
    { side: "east", startRatio: 0.42, endRatio: 0.58 },
    { side: "south", startRatio: 0.42, endRatio: 0.58 },
    { side: "west", startRatio: 0.76, endRatio: 0.92 },
  ],
  "room.imaging_control": [
    { side: "north", startRatio: 0.02, endRatio: 0.18 },
    { side: "east", startRatio: 0.4, endRatio: 0.58 },
    { side: "south", startRatio: 0.04, endRatio: 0.22 },
    { side: "west", startRatio: 0.74, endRatio: 0.92 },
  ],
  "room.minor_procedure": [
    { side: "north", startRatio: 0.04, endRatio: 0.2 },
    { side: "east", startRatio: 0.66, endRatio: 0.82 },
    { side: "south", startRatio: 0.8, endRatio: 0.96 },
    { side: "west", startRatio: 0.06, endRatio: 0.22 },
  ],
};

const WAITING_HORIZONTAL: readonly FiveRoomFixturePlacement[] = [
  { id: "waitingCouch", centerXRatio: 0.52, centerYRatio: 0.26, widthRatio: 0.52, heightRatio: 0.28, preserveScreenOrientation: true },
  { id: "visitorChair", centerXRatio: 0.25, centerYRatio: 0.67, widthRatio: 0.15, heightRatio: 0.24, preserveScreenOrientation: true },
  { id: "visitorChair", centerXRatio: 0.76, centerYRatio: 0.67, widthRatio: 0.15, heightRatio: 0.24, preserveScreenOrientation: true },
  { id: "coffeeTable", centerXRatio: 0.51, centerYRatio: 0.58, widthRatio: 0.28, heightRatio: 0.19, preserveScreenOrientation: true },
  { id: "magazineRack", centerXRatio: 0.91, centerYRatio: 0.2, widthRatio: 0.1, heightRatio: 0.14, preserveScreenOrientation: true },
  { id: "noticeBoard", centerXRatio: 0.4, centerYRatio: 0.5, widthRatio: 0.18, heightRatio: 0.7, wallMounted: true, northWallOffsets: [1] },
  { id: "framedPrint", centerXRatio: 0.73, centerYRatio: 0.5, widthRatio: 0.12, heightRatio: 0.7, wallMounted: true, northWallOffsets: [2] },
];

// This is a separate portrait package, not a rotated copy of the landscape
// furniture. The perspective tops and contact shadows stay north-up.
const WAITING_VERTICAL: readonly FiveRoomFixturePlacement[] = [
  { id: "waitingCouch", centerXRatio: 0.53, centerYRatio: 0.2, widthRatio: 0.62, heightRatio: 0.21, preserveScreenOrientation: true },
  { id: "visitorChair", centerXRatio: 0.23, centerYRatio: 0.61, widthRatio: 0.19, heightRatio: 0.18, preserveScreenOrientation: true },
  { id: "visitorChair", centerXRatio: 0.72, centerYRatio: 0.61, widthRatio: 0.19, heightRatio: 0.18, preserveScreenOrientation: true },
  { id: "coffeeTable", centerXRatio: 0.5, centerYRatio: 0.47, widthRatio: 0.3, heightRatio: 0.15, preserveScreenOrientation: true },
  { id: "magazineRack", centerXRatio: 0.88, centerYRatio: 0.22, widthRatio: 0.1, heightRatio: 0.14, preserveScreenOrientation: true },
  { id: "noticeBoard", centerXRatio: 0.43, centerYRatio: 0.5, widthRatio: 0.18, heightRatio: 0.7, wallMounted: true, northWallOffsets: [1] },
  { id: "framedPrint", centerXRatio: 0.76, centerYRatio: 0.5, widthRatio: 0.12, heightRatio: 0.7, wallMounted: true, northWallOffsets: [2] },
];

const BATHROOM: readonly FiveRoomFixturePlacement[] = [
  { id: "handSink", centerXRatio: 0.2, centerYRatio: 0.24, widthRatio: 0.26, heightRatio: 0.31, preserveScreenOrientation: true },
  { id: "toilet", centerXRatio: 0.73, centerYRatio: 0.72, widthRatio: 0.29, heightRatio: 0.43, preserveScreenOrientation: true },
  { id: "wallMirror", centerXRatio: 0.2, centerYRatio: 0.5, widthRatio: 0.18, heightRatio: 0.7, wallMounted: true, northWallOffsets: [0] },
];

const XRAY: readonly FiveRoomFixturePlacement[] = [
  { id: "xrayTable", centerXRatio: 0.51, centerYRatio: 0.6, widthRatio: 0.3, heightRatio: 0.48, preserveScreenOrientation: true },
  { id: "xrayTube", centerXRatio: 0.28, centerYRatio: 0.42, widthRatio: 0.2, heightRatio: 0.42, preserveScreenOrientation: true },
  { id: "xrayBucky", centerXRatio: 0.72, centerYRatio: 0.4, widthRatio: 0.15, heightRatio: 0.38, preserveScreenOrientation: true },
  { id: "supplyCabinet", centerXRatio: 0.25, centerYRatio: 0.69, widthRatio: 0.18, heightRatio: 0.24, preserveScreenOrientation: true },
  { id: "leadApron", centerXRatio: 0.18, centerYRatio: 0.5, widthRatio: 0.12, heightRatio: 0.68, wallMounted: true, northWallOffsets: [0] },
  { id: "radiationMarker", centerXRatio: 0.52, centerYRatio: 0.5, widthRatio: 0.11, heightRatio: 0.68, wallMounted: true, northWallOffsets: [1] },
];

const IMAGING_CONTROL: readonly FiveRoomFixturePlacement[] = [
  { id: "imagingConsole", centerXRatio: 0.54, centerYRatio: 0.31, widthRatio: 0.62, heightRatio: 0.35, preserveScreenOrientation: true },
  { id: "officeChair", centerXRatio: 0.54, centerYRatio: 0.68, widthRatio: 0.18, heightRatio: 0.21, preserveScreenOrientation: true },
  { id: "serverRack", centerXRatio: 0.12, centerYRatio: 0.48, widthRatio: 0.15, heightRatio: 0.42, preserveScreenOrientation: true },
  { id: "lightBox", centerXRatio: 0.67, centerYRatio: 0.5, widthRatio: 0.24, heightRatio: 0.7, wallMounted: true, northWallOffsets: [1] },
];

const MINOR_PROCEDURE: readonly FiveRoomFixturePlacement[] = [
  { id: "procedureTable", centerXRatio: 0.48, centerYRatio: 0.63, widthRatio: 0.38, heightRatio: 0.38, preserveScreenOrientation: true },
  { id: "instrumentTray", centerXRatio: 0.72, centerYRatio: 0.63, widthRatio: 0.17, heightRatio: 0.23, preserveScreenOrientation: true },
  { id: "sinkCabinet", centerXRatio: 0.16, centerYRatio: 0.48, widthRatio: 0.24, heightRatio: 0.28, preserveScreenOrientation: true },
  { id: "supplyCabinet", centerXRatio: 0.85, centerYRatio: 0.31, widthRatio: 0.18, heightRatio: 0.27, preserveScreenOrientation: true },
  { id: "biohazardBin", centerXRatio: 0.17, centerYRatio: 0.76, widthRatio: 0.13, heightRatio: 0.18, preserveScreenOrientation: true },
  // The authored lamp has a standing base and remains grounded behind the table.
  { id: "procedureLight", centerXRatio: 0.48, centerYRatio: 0.4, widthRatio: 0.22, heightRatio: 0.29, preserveScreenOrientation: true },
  { id: "medicalSign", centerXRatio: 0.52, centerYRatio: 0.5, widthRatio: 0.12, heightRatio: 0.68, wallMounted: true, northWallOffsets: [1] },
];

const PRESENTATIONS: readonly FiveRoomPresentation[] = [
  { roomId: "room.waiting", orientation: 0, fixtures: WAITING_HORIZONTAL },
  { roomId: "room.waiting", orientation: 90, fixtures: WAITING_VERTICAL },
  { roomId: "room.bathroom", orientation: 0, fixtures: BATHROOM },
  { roomId: "room.xray", orientation: 0, fixtures: XRAY },
  { roomId: "room.imaging_control", orientation: 0, fixtures: IMAGING_CONTROL },
  { roomId: "room.minor_procedure", orientation: 0, fixtures: MINOR_PROCEDURE },
];

export function isFiveReferenceRoomDefinition(definitionId: string): definitionId is FiveReferenceRoomId {
  return (FIVE_REFERENCE_ROOM_IDS as readonly string[]).includes(definitionId);
}

export function getFiveRoomPresentation(
  definitionId: string,
  orientation: number | undefined,
): FiveRoomPresentation | undefined {
  const normalizedOrientation: FiveRoomOrientation = orientation === 90 ? 90 : 0;
  return PRESENTATIONS.find((presentation) =>
    presentation.roomId === definitionId && presentation.orientation === normalizedOrientation,
  );
}

export function getFiveRoomDoorClearZones(
  definitionId: FiveReferenceRoomId,
): readonly FiveRoomDoorClearZone[] {
  return DOOR_CLEAR_ZONES[definitionId];
}

/**
 * Tests whether a floor fixture blocks a shallow edge strip reserved for a
 * legal door candidate. A central object is not a blocker just because it
 * shares the interval along the wall; it must also reach that actual edge.
 */
export function isFiveRoomFloorFixtureClearOfDoorZone(
  fixture: FiveRoomFixturePlacement,
  zone: FiveRoomDoorClearZone,
  edgeStripThickness = 0.14,
): boolean {
  if (fixture.wallMounted) return true;
  const fixtureLeft = fixture.centerXRatio - fixture.widthRatio / 2;
  const fixtureRight = fixture.centerXRatio + fixture.widthRatio / 2;
  const fixtureTop = fixture.centerYRatio - fixture.heightRatio / 2;
  const fixtureBottom = fixture.centerYRatio + fixture.heightRatio / 2;
  const strip = (() => {
    switch (zone.side) {
      case "north": return { left: zone.startRatio, right: zone.endRatio, top: 0, bottom: edgeStripThickness };
      case "east": return { left: 1 - edgeStripThickness, right: 1, top: zone.startRatio, bottom: zone.endRatio };
      case "south": return { left: zone.startRatio, right: zone.endRatio, top: 1 - edgeStripThickness, bottom: 1 };
      case "west": return { left: 0, right: edgeStripThickness, top: zone.startRatio, bottom: zone.endRatio };
    }
  })();
  return fixtureRight <= strip.left || fixtureLeft >= strip.right || fixtureBottom <= strip.top || fixtureTop >= strip.bottom;
}

/** Exact authored slots are intentionally independent of nearby door openings. */
export function isFiveRoomNorthWallFixtureVisible(
  fixture: FiveRoomFixturePlacement,
  liveNorthDoorOffsets: readonly number[],
): boolean {
  return fixture.wallMounted === true && !(fixture.northWallOffsets ?? []).some((offset) =>
    liveNorthDoorOffsets.includes(offset),
  );
}
