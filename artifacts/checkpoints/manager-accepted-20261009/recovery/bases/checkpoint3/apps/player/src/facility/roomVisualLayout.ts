import type { CardinalDirection, RoomOrientation } from "@gamify-surgery/game-domain";

/**
 * Renderer-only room layout metadata.
 *
 * Logical room footprints, navigation masks, door placement and save data live
 * in the domain. This module intentionally describes only how a stable room
 * definition presents its existing interior artwork.
 */
export interface RoomLocalFixturePlacement {
  centerXRatio: number;
  centerYRatio: number;
  widthRatio: number;
  heightRatio: number;
}

export interface FixtureClearDoorZone {
  side: CardinalDirection;
  /** Room-local offset along the named wall, measured from its west/north end. */
  offsetRatio: number;
  /** Candidate clear span along the named wall. Domain validation remains authoritative. */
  lengthRatio: number;
}

export interface WorldNorthWallDecorPlacement {
  /** Wall art is always projected onto the exposed world-north cutaway wall. */
  binding: "world-north";
  /** Hide a decoration when no exposed northern run can support it. */
  minimumExposedRunTiles?: number;
}

export interface RoomVisualLayout {
  /** Square rooms and the founder front desk retain a fixed furniture package. */
  fixedFurnitureOrientation?: boolean;
  /** Orientations offered by the visual design. Legacy state still renders defensively. */
  approvedOrientations: readonly RoomOrientation[];
  /** Template-clear wall spans; these do not bypass domain door legality. */
  doorClearZones: readonly FixtureClearDoorZone[];
}

export interface RoomVisualDoorSlot {
  definitionId: string;
  orientation?: RoomOrientation;
  width: number;
  height: number;
  side: CardinalDirection;
  offset: number;
}

const EVERY_WALL_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.38, lengthRatio: 0.24 },
  { side: "east", offsetRatio: 0.38, lengthRatio: 0.24 },
  { side: "south", offsetRatio: 0.38, lengthRatio: 0.24 },
  { side: "west", offsetRatio: 0.38, lengthRatio: 0.24 },
];

const FRONT_DESK_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  // North A2-A4; the complete consecutive span is deliberately selectable.
  { side: "north", offsetRatio: 0.2, lengthRatio: 0.6 },
  // East B/C and west B/C/D. East/west offsets are rows in the engine.
  { side: "east", offsetRatio: 0.25, lengthRatio: 0.5 },
  { side: "south", offsetRatio: 0.4, lengthRatio: 0.2 },
  { side: "west", offsetRatio: 0.25, lengthRatio: 0.75 },
];

const WAITING_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.4, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.04, lengthRatio: 0.18 },
  { side: "west", offsetRatio: 0.12, lengthRatio: 0.18 },
];

const EXAMINATION_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.42, lengthRatio: 0.16 },
  // Align this span with a concrete half-tile candidate in the 3-by-2 shell;
  // after the supported 90-degree presentation transform it likewise maps to
  // a concrete 2-by-3 south-wall candidate.
  { side: "east", offsetRatio: 0.7, lengthRatio: 0.16 },
  // The ordinary patient approach is the central south wall segment; keep it
  // clear alongside the table's side approaches so a new exam room can be
  // made operational using the same route as the existing clinic fixture.
  { side: "south", offsetRatio: 0.42, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.1, lengthRatio: 0.16 },
];

const BATHROOM_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.54, lengthRatio: 0.2 },
  { side: "east", offsetRatio: 0.14, lengthRatio: 0.2 },
  { side: "south", offsetRatio: 0.14, lengthRatio: 0.2 },
  { side: "west", offsetRatio: 0.54, lengthRatio: 0.2 },
];

const XRAY_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.74, lengthRatio: 0.16 },
  // Centered patient and control approaches align with the real Level 1
  // public/control door geometry while leaving the northwest machine base.
  { side: "east", offsetRatio: 0.42, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.42, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.76, lengthRatio: 0.16 },
];

const IMAGING_CONTROL_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.02, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.4, lengthRatio: 0.18 },
  { side: "south", offsetRatio: 0.04, lengthRatio: 0.18 },
  { side: "west", offsetRatio: 0.74, lengthRatio: 0.18 },
];

const MINOR_PROCEDURE_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.66, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.8, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.06, lengthRatio: 0.16 },
];

const ULTRASOUND_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.78, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.78, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.08, lengthRatio: 0.16 },
];

const CT_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.8, lengthRatio: 0.14 },
  { side: "east", offsetRatio: 0.08, lengthRatio: 0.14 },
  { side: "south", offsetRatio: 0.8, lengthRatio: 0.14 },
  { side: "west", offsetRatio: 0.78, lengthRatio: 0.14 },
];

const PHLEBOTOMY_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.08, lengthRatio: 0.18 },
  { side: "east", offsetRatio: 0.78, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.76, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.1, lengthRatio: 0.18 },
];

const EVS_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.76, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.08, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.78, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.08, lengthRatio: 0.16 },
];

const ENDOSCOPY_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.8, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.8, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.06, lengthRatio: 0.16 },
];

const PERIOP_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.44, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.78, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.82, lengthRatio: 0.14 },
  { side: "west", offsetRatio: 0.8, lengthRatio: 0.16 },
];

const TRAINING_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.08, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.8, lengthRatio: 0.16 },
];

const COFFEE_KIOSK_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.8, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.08, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.8, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.72, lengthRatio: 0.16 },
];

const GLP1_DOOR_ZONES: readonly FixtureClearDoorZone[] = [
  { side: "north", offsetRatio: 0.04, lengthRatio: 0.16 },
  { side: "east", offsetRatio: 0.8, lengthRatio: 0.16 },
  { side: "south", offsetRatio: 0.06, lengthRatio: 0.16 },
  { side: "west", offsetRatio: 0.8, lengthRatio: 0.16 },
];

const FIXED_ROOM_LAYOUT: RoomVisualLayout = {
  fixedFurnitureOrientation: true,
  approvedOrientations: [0],
  doorClearZones: EVERY_WALL_DOOR_ZONES,
};

const TWO_ORIENTATION_LAYOUT: RoomVisualLayout = {
  approvedOrientations: [0, 90],
  doorClearZones: EVERY_WALL_DOOR_ZONES,
};

const ROOM_VISUAL_LAYOUTS: Readonly<Record<string, RoomVisualLayout>> = {
  "room.front_desk": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: FRONT_DESK_DOOR_ZONES,
  },
  "room.hallway": FIXED_ROOM_LAYOUT,
  "room.waiting": {
    ...TWO_ORIENTATION_LAYOUT,
    doorClearZones: WAITING_DOOR_ZONES,
  },
  "room.examination": {
    ...TWO_ORIENTATION_LAYOUT,
    doorClearZones: EXAMINATION_DOOR_ZONES,
  },
  "room.bathroom": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: BATHROOM_DOOR_ZONES,
  },
  "room.xray": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: XRAY_DOOR_ZONES,
  },
  "room.imaging_control": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: IMAGING_CONTROL_DOOR_ZONES,
  },
  "room.minor_procedure": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: MINOR_PROCEDURE_DOOR_ZONES,
  },
  "room.ultrasound": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: ULTRASOUND_DOOR_ZONES,
  },
  "room.ct": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: CT_DOOR_ZONES,
  },
  "room.phlebotomy": {
    ...TWO_ORIENTATION_LAYOUT,
    doorClearZones: PHLEBOTOMY_DOOR_ZONES,
  },
  "room.evs_closet": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: EVS_DOOR_ZONES,
  },
  "room.endoscopy": {
    ...TWO_ORIENTATION_LAYOUT,
    doorClearZones: ENDOSCOPY_DOOR_ZONES,
  },
  "room.periop_recovery": {
    ...TWO_ORIENTATION_LAYOUT,
    doorClearZones: PERIOP_DOOR_ZONES,
  },
  "room.training": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: TRAINING_DOOR_ZONES,
  },
  "room.coffee_kiosk": {
    ...FIXED_ROOM_LAYOUT,
    doorClearZones: COFFEE_KIOSK_DOOR_ZONES,
  },
  "room.glp1_telehealth_suite": {
    ...TWO_ORIENTATION_LAYOUT,
    doorClearZones: GLP1_DOOR_ZONES,
  },
};

export const PRIMARY_ROOM_VISUAL_IDS = [
  "room.front_desk",
  "room.hallway",
  "room.waiting",
  "room.examination",
  "room.bathroom",
  "room.xray",
  "room.imaging_control",
] as const;

export const ADVANCED_ROOM_VISUAL_IDS = [
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

/** Returns a conservative fixed layout for square or not-yet-authored rooms. */
export function getRoomVisualLayout(definitionId: string): RoomVisualLayout {
  return ROOM_VISUAL_LAYOUTS[definitionId] ?? FIXED_ROOM_LAYOUT;
}

/**
 * Uses a fixed furniture package where the approved visual design calls for
 * one. For a loaded legacy orientation the transform below still supports all
 * four cardinal rotations, so no fixture can render upside down or detached.
 */
export function getRoomVisualOrientation(
  layout: RoomVisualLayout,
  orientation: RoomOrientation | undefined,
): RoomOrientation {
  if (layout.fixedFurnitureOrientation) {
    return 0;
  }
  return orientation ?? 0;
}

/** New Build Mode placements are limited to the approved visual package
 * orientations. Legacy rooms can still render in any cardinal orientation. */
export function getApprovedPlacementOrientations(
  definitionId: string,
): readonly RoomOrientation[] {
  return getRoomVisualLayout(definitionId).approvedOrientations;
}

function rotateDoorSide(
  side: CardinalDirection,
  orientation: RoomOrientation,
): { side: CardinalDirection; reverseOffset: boolean } {
  switch (orientation) {
    case 90:
      switch (side) {
        case "north": return { side: "east", reverseOffset: false };
        case "east": return { side: "south", reverseOffset: true };
        case "south": return { side: "west", reverseOffset: false };
        case "west": return { side: "north", reverseOffset: true };
      }
    case 180:
      switch (side) {
        case "north": return { side: "south", reverseOffset: true };
        case "east": return { side: "west", reverseOffset: true };
        case "south": return { side: "north", reverseOffset: true };
        case "west": return { side: "east", reverseOffset: true };
      }
    case 270:
      switch (side) {
        case "north": return { side: "west", reverseOffset: true };
        case "east": return { side: "north", reverseOffset: false };
        case "south": return { side: "east", reverseOffset: true };
        case "west": return { side: "south", reverseOffset: false };
      }
    case 0:
    default:
      return { side, reverseOffset: false };
  }
}

/**
 * Converts authored room-local wall spans into the room's rendered world-side
 * spans. This is deliberately renderer-only: domain door validation still
 * decides adjacency, reachability, and the final placement.
 */
export function getOrientedDoorClearZones(
  definitionId: string,
  orientation?: RoomOrientation,
): readonly FixtureClearDoorZone[] {
  const layout = getRoomVisualLayout(definitionId);
  const visualOrientation = getRoomVisualOrientation(layout, orientation);
  return layout.doorClearZones.map((zone) => {
    const rotated = rotateDoorSide(zone.side, visualOrientation);
    return {
      side: rotated.side,
      offsetRatio: rotated.reverseOffset
        ? 1 - zone.offsetRatio - zone.lengthRatio
        : zone.offsetRatio,
      lengthRatio: zone.lengthRatio,
    };
  });
}

/** A domain-enabled preview slot is highlighted only when its segment midpoint
 * lies within a fixture-clear span for the rendered room orientation. */
export function isRoomVisualDoorSlotClear(
  slot: RoomVisualDoorSlot,
): boolean {
  const sideLength =
    slot.side === "north" || slot.side === "south"
      ? slot.width
      : slot.height;
  if (!Number.isInteger(slot.offset) || sideLength <= 0 || slot.offset < 0 || slot.offset >= sideLength) {
    return false;
  }
  const midpoint = (slot.offset + 0.5) / sideLength;
  return getOrientedDoorClearZones(slot.definitionId, slot.orientation).some(
    (zone) =>
      zone.side === slot.side &&
      midpoint >= zone.offsetRatio &&
      midpoint <= zone.offsetRatio + zone.lengthRatio,
  );
}

/**
 * Rotates a grounded fixture around its room-local center. Width and height
 * spans rotate with the footprint at 90 and 270 degrees.
 */
export function transformRoomLocalFixture(
  placement: RoomLocalFixturePlacement,
  orientation: RoomOrientation,
): RoomLocalFixturePlacement {
  switch (orientation) {
    case 90:
      return {
        centerXRatio: 1 - placement.centerYRatio,
        centerYRatio: placement.centerXRatio,
        widthRatio: placement.heightRatio,
        heightRatio: placement.widthRatio,
      };
    case 180:
      return {
        centerXRatio: 1 - placement.centerXRatio,
        centerYRatio: 1 - placement.centerYRatio,
        widthRatio: placement.widthRatio,
        heightRatio: placement.heightRatio,
      };
    case 270:
      return {
        centerXRatio: placement.centerYRatio,
        centerYRatio: 1 - placement.centerXRatio,
        widthRatio: placement.heightRatio,
        heightRatio: placement.widthRatio,
      };
    case 0:
    default:
      return placement;
  }
}

/**
 * World-north decor never rotates with the floor package. It is therefore
 * either attached to a sufficiently exposed north wall or omitted altogether,
 * never redrawn floating on a room floor.
 */
export function shouldRenderWorldNorthWallDecor(
  placement: WorldNorthWallDecorPlacement,
  largestExposedRunTiles: number,
): boolean {
  return largestExposedRunTiles >= (placement.minimumExposedRunTiles ?? 1);
}
