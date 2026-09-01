import type { GridPoint } from "@gamify-surgery/game-domain";

import type { FixtureId } from "../art/fixtureArt";
import type { LandscapingAtlasFrameId } from "../art/bitmapAssetManifest";
import type {
  FacilityFounderView,
  FacilityRoomView,
  FacilityStaffView,
} from "./types";

/**
 * The Front Desk is the only fixed-orientation starter room.  Keeping its
 * composition here makes its visual contract explicit instead of leaving it
 * as a special case in the general room-fixture switch.
 */
export const FRONT_DESK_PRESENTATION = {
  footprint: { width: 5, height: 4 },
  orientation: 0,
  anchors: {
    staff: { x: 2, y: 1 },
    public: { x: 2, y: 3 },
    waiting: [
      { x: 1, y: 3 },
      { x: 3, y: 3 },
    ],
  },
  grid: {
    cabinet: { x: 0, y: 0 }, // A1
    cooler: { x: 4, y: 0 }, // A5
    coolerApproach: { x: 4, y: 1 }, // B5
    staff: { x: 2, y: 1 }, // B3
    counter: { x: 2, y: 2 }, // C3
    public: { x: 2, y: 3 }, // D3
  },
  /** The counter must sort over the seated staff base but below public side. */
  depthContract: {
    staffBaseRow: 1.72,
    counterContactRow: 2.46,
    publicBaseRow: 3.72,
  },
  /** Light, large square commercial tiles, deliberately separate from grid. */
  floor: {
    tileColumns: 5,
    tileRows: 4,
  },
  fixtures: [
    // Rear-left storage includes the small plant/binder arrangement.
    // Height envelopes intentionally accommodate the authored aspect ratios;
    // nominal width alone would make the counter/cabinet visibly too small.
    {
      id: "filingCabinet",
      x: 0.08,
      y: 0.3,
      width: 0.22,
      height: 0.5,
      contact: { x: 0.08, y: 0.31 },
    },
    // The counter is centered directly in front of staff anchor (2, 1).
    {
      id: "secretaryChair",
      x: 0.29,
      y: 0.49,
      width: 0.16,
      height: 0.24,
      contact: { x: 0.29, y: 0.53 },
    },
    {
      id: "frontDesk",
      x: 0.34,
      y: 0.61,
      width: 0.45,
      height: 0.38,
      contact: { x: 0.34, y: 0.7 },
    },
    // Water cooler is live at rear-right A5; workers approach from B5.
    {
      id: "wasteBin",
      x: 0.94,
      y: 0.25,
      width: 0.085,
      height: 0.18,
      contact: { x: 0.94, y: 0.31 },
    },
    // This is deliberately a separately sorted object, never part of the
    // south wall or a patient sheet. Its inset keeps east-wall slot 1 clear.
    {
      id: "visitorChair",
      x: 0.9,
      y: 0.78,
      width: 0.16,
      height: 0.29,
      contact: { x: 0.9, y: 0.92 },
    },
  ] as const satisfies readonly FrontDeskFixturePlacement[],
  /**
   * Live water-cooler interaction remains a distinct scene object. Its
   * logical A5 tile is unchanged; only this visual contact point and sprite
   * envelope are used to ground it against the rear A row.
   */
  waterCooler: {
    footprint: { x: 4, y: 0 },
    contact: { x: 0.83, y: 0.31 },
    widthInTiles: 0.66,
    heightInTiles: 1.14,
  },
  /** Authored seated sheets include their own chair; this shifts only art. */
  seatedPresentation: { towardCounterTiles: 0.28 },
  northWallFixtures: [
    { id: "noticeBoard", x: 0.19, y: 0.46, width: 0.18, height: 0.55 },
    { id: "wallClock", x: 0.32, y: 0.44, width: 0.1, height: 0.43 },
  ] as const satisfies readonly FrontDeskWallFixturePlacement[],
  /** Target-measured visual poses for non-moving actors at logical anchors. */
  v5ActorDisplay: {
    // The room frame is intentionally larger than ordinary tiles; stationary
    // reception poses scale down only in this display seam to match its
    // reference figures. Moving actors retain canonical map scale.
    staff: { x: 0.29, y: 0.53, scale: 0.82 },
    public: { x: 0.62, y: 0.82, scale: 0.82 },
  },
  /** One unoccupied integer-compatible door option per wall, by visual design. */
  clearDoorCandidates: {
    north: 2,
    east: 1,
    south: 2,
    west: 3,
  },
  /**
   * Exterior-only entrance beds. Their room-local X positions are measured in
   * tiles across the fixed five-tile frontage; their Y positions occupy the
   * rear portion of the one-tile sidewalk. They never alter the 5x4 floor.
   */
  entrancePlanters: [
    {
      side: "west",
      centerXInTiles: 0.95,
      baseYInSidewalk: 0.5,
      widthInTiles: 1.55,
      heightInTiles: 0.5,
      bloomAccents: [
        {
          id: "landscape:flowers-white",
          centerXInTiles: 0.64,
          baseYInSidewalk: 0.43,
          widthInTiles: 0.52,
          heightInTiles: 0.43,
          alpha: 0.96,
        },
        {
          id: "landscape:flowers-pink",
          centerXInTiles: 1.22,
          baseYInSidewalk: 0.57,
          widthInTiles: 0.46,
          heightInTiles: 0.38,
          alpha: 0.9,
        },
      ],
    },
    {
      side: "east",
      centerXInTiles: 4.05,
      baseYInSidewalk: 0.5,
      widthInTiles: 1.55,
      heightInTiles: 0.5,
      bloomAccents: [
        {
          id: "landscape:flowers-pink",
          centerXInTiles: 3.78,
          baseYInSidewalk: 0.43,
          widthInTiles: 0.5,
          heightInTiles: 0.42,
          alpha: 0.92,
        },
        {
          id: "landscape:flowers-white",
          centerXInTiles: 4.35,
          baseYInSidewalk: 0.57,
          widthInTiles: 0.48,
          heightInTiles: 0.38,
          alpha: 0.9,
        },
      ],
    },
  ] as const satisfies readonly FrontDeskEntrancePlanterPlacement[],
} as const;

export interface FrontDeskFixturePlacement {
  id: FixtureId;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Floor-contact location for the visual envelope, separate from routing. */
  contact?: Readonly<{ x: number; y: number }>;
}

export interface FrontDeskWallFixturePlacement extends FrontDeskFixturePlacement {}

export interface FrontDeskEntranceBloomAccent {
  id: Extract<
    LandscapingAtlasFrameId,
    "landscape:flowers-white" | "landscape:flowers-pink"
  >;
  centerXInTiles: number;
  baseYInSidewalk: number;
  widthInTiles: number;
  heightInTiles: number;
  alpha: number;
}

export interface FrontDeskEntrancePlanterPlacement {
  side: "west" | "east";
  centerXInTiles: number;
  baseYInSidewalk: number;
  widthInTiles: number;
  heightInTiles: number;
  bloomAccents: readonly FrontDeskEntranceBloomAccent[];
}

export interface FrontDeskEntranceDisplayBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function boundsForEntranceDisplay(
  centerXInTiles: number,
  baseYInSidewalk: number,
  widthInTiles: number,
  heightInTiles: number,
): FrontDeskEntranceDisplayBounds {
  return {
    left: centerXInTiles - widthInTiles / 2,
    top: baseYInSidewalk - heightInTiles,
    right: centerXInTiles + widthInTiles / 2,
    bottom: baseYInSidewalk,
  };
}

/**
 * Bounds are intentionally tile-local and rendering-independent so the
 * Front Desk's only public walk can remain clear as exterior art evolves.
 */
export function getFrontDeskEntrancePlanterDisplayBounds(
  planter: FrontDeskEntrancePlanterPlacement,
): readonly FrontDeskEntranceDisplayBounds[] {
  return [
    boundsForEntranceDisplay(
      planter.centerXInTiles,
      planter.baseYInSidewalk,
      planter.widthInTiles,
      planter.heightInTiles,
    ),
    ...planter.bloomAccents.map((accent) =>
      boundsForEntranceDisplay(
        accent.centerXInTiles,
        accent.baseYInSidewalk,
        accent.widthInTiles,
        accent.heightInTiles,
      ),
    ),
  ];
}

export function isFrontDeskRoom(room: FacilityRoomView): boolean {
  return room.definitionId === "room.front_desk";
}

export type FrontDeskStationaryActorAnchor = "staff" | "public";

/**
 * Returns a display-only target position for a stationary actor on one of the
 * protected Front Desk anchors. Route samples and every other actor continue
 * to use their exact logical position.
 */
export function getFrontDeskV5StationaryActorDisplay(
  location: GridPoint | undefined,
  moving: boolean,
  anchor: FrontDeskStationaryActorAnchor,
  rooms: readonly FacilityRoomView[],
): Readonly<{ x: number; y: number; scale: number }> | undefined {
  if (!location || moving) return undefined;
  const frontDesk = rooms.find(isFrontDeskRoom);
  const logicalAnchor = FRONT_DESK_PRESENTATION.anchors[anchor];
  if (
    !frontDesk ||
    location.x !== frontDesk.tileX + logicalAnchor.x ||
    location.y !== frontDesk.tileY + logicalAnchor.y
  ) {
    return undefined;
  }
  return FRONT_DESK_PRESENTATION.v5ActorDisplay[anchor];
}

/**
 * The protected Front Desk uses a fixed five-by-four visual footprint. Its
 * navigation contract keeps the staff anchor behind the counter and the public
 * anchor on the other side. This only selects a rendering pose after the
 * domain has already placed the founder.
 */
export function shouldRenderFounderSeatedAtFrontDesk(
  location: GridPoint | undefined,
  moving: boolean,
  activityLabel: string | undefined,
  rooms: readonly FacilityRoomView[],
): boolean {
  if (!location || moving || activityLabel?.trim()) {
    return false;
  }
  const frontDesk = rooms.find(isFrontDeskRoom);
  return Boolean(
    frontDesk &&
      location.x === frontDesk.tileX + FRONT_DESK_PRESENTATION.anchors.staff.x &&
      location.y === frontDesk.tileY + FRONT_DESK_PRESENTATION.anchors.staff.y,
  );
}

/** Receptionists share the same quiet seated desk pose as the founder. */
export function shouldRenderReceptionistSeatedAtFrontDesk(
  location: GridPoint | undefined,
  moving: boolean,
  staffRoleDefinitionId: string | undefined,
  homeRoomInstanceId: string | null | undefined,
  rooms: readonly FacilityRoomView[],
): boolean {
  if (
    !location ||
    moving ||
    staffRoleDefinitionId !== "staff.receptionist"
  ) {
    return false;
  }
  const frontDesk = rooms.find(isFrontDeskRoom);
  return Boolean(
    frontDesk &&
      homeRoomInstanceId === frontDesk.instanceId &&
      location.x === frontDesk.tileX + FRONT_DESK_PRESENTATION.anchors.staff.x &&
      location.y === frontDesk.tileY + FRONT_DESK_PRESENTATION.anchors.staff.y,
  );
}

/**
 * Seated actor sheets already include the Front Desk work chair. Rendering the
 * standalone chair only while B3 is vacant prevents a second chair appearing
 * behind a founder or receptionist without changing any logical position.
 */
export function shouldRenderEmptyFrontDeskChair(
  founder: Pick<FacilityFounderView, "location" | "moving" | "activityLabel">,
  staff: readonly Pick<
    FacilityStaffView,
    "location" | "moving" | "staffRoleDefinitionId" | "homeRoomInstanceId"
  >[],
  rooms: readonly FacilityRoomView[],
): boolean {
  if (
    shouldRenderFounderSeatedAtFrontDesk(
      founder.location,
      Boolean(founder.moving),
      founder.activityLabel,
      rooms,
    )
  ) {
    return false;
  }
  return !staff.some((employee) =>
    shouldRenderReceptionistSeatedAtFrontDesk(
      employee.location,
      Boolean(employee.moving),
      employee.staffRoleDefinitionId,
      employee.homeRoomInstanceId,
      rooms,
    ),
  );
}
