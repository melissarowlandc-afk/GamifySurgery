import { DIAGNOSTIC_READING_WORKSTATIONS } from "./diagnostic-timing";

export interface ApprovedFloorPoint {
  x: number;
  y: number;
}

export interface ApprovedFloorFootprint {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ApprovedSolidFixture {
  id: string;
  footprint: ApprovedFloorFootprint;
  /** Proof-declared actor-clearance mask when it differs from drawn contact. */
  navigationFootprint?: ApprovedFloorFootprint;
  /** Definition-local integer tiles owned by this solid fixture. */
  blockedTiles: ApprovedFloorPoint[];
  /** Contacts on solid furniture are valid path endpoints, never transit tiles. */
  endpointOnlyContacts?: ApprovedFloorPoint[];
  hiddenByDoorSlots?: Array<{
    side: "north" | "east" | "south" | "west";
    offset: number;
  }>;
}

export interface ApprovedCompanionSeat {
  id: string;
  kind: "armchair";
  anchor: ApprovedFloorPoint;
  facing: "north" | "east" | "south" | "west";
}

export interface ApprovedProcedureStaffSpot {
  id: string;
  actor: "provider" | "nurse";
  anchor: ApprovedFloorPoint;
  ground: ApprovedFloorPoint;
  facing: "north" | "east" | "south" | "west";
}

/** Clear bedside aisles in the approved layouts. Foot-end alternatives let
 * staff avoid a door on the usual standing tile without crossing the table.
 * Provider contacts retain the approved proof's standing use points.
 */
export const APPROVED_PROCEDURE_STAFF_SPOTS: Readonly<Record<string, readonly ApprovedProcedureStaffSpot[]>> = {
  "room.endoscopy": [
    { id: "provider", actor: "provider", anchor: { x: 2, y: 1 }, ground: { x: 2.3, y: 1.5 }, facing: "west" },
    { id: "provider:foot", actor: "provider", anchor: { x: 2, y: 2 }, ground: { x: 2.3, y: 1.85 }, facing: "west" },
    { id: "nurse", actor: "nurse", anchor: { x: 0, y: 1 }, ground: { x: 0.65, y: 1.5 }, facing: "east" },
    { id: "nurse:foot", actor: "nurse", anchor: { x: 0, y: 2 }, ground: { x: 0.65, y: 1.85 }, facing: "east" },
  ],
  "room.ambulatory_or": [
    { id: "surgeon", actor: "provider", anchor: { x: 0, y: 2 }, ground: { x: 1.15, y: 2.6 }, facing: "east" },
    { id: "surgeon:foot", actor: "provider", anchor: { x: 0, y: 3 }, ground: { x: 1.15, y: 3.05 }, facing: "east" },
    { id: "nurse", actor: "nurse", anchor: { x: 3, y: 2 }, ground: { x: 2.85, y: 2.6 }, facing: "west" },
    { id: "nurse:foot", actor: "nurse", anchor: { x: 3, y: 3 }, ground: { x: 2.85, y: 3.05 }, facing: "west" },
  ],
};

/** Two inward-facing armchairs per corner; separate from patient bed contacts. */
export const PERIOP_COMPANION_SEATS: ApprovedCompanionSeat[] = [
  { id: "companion.NW.north", kind: "armchair", anchor: { x: 1, y: 0 }, facing: "south" },
  { id: "companion.NW.west", kind: "armchair", anchor: { x: 0, y: 1 }, facing: "east" },
  { id: "companion.NE.north", kind: "armchair", anchor: { x: 4, y: 0 }, facing: "south" },
  { id: "companion.NE.east", kind: "armchair", anchor: { x: 5, y: 1 }, facing: "west" },
  { id: "companion.SW.west", kind: "armchair", anchor: { x: 0, y: 4 }, facing: "east" },
  { id: "companion.SW.south", kind: "armchair", anchor: { x: 1, y: 5 }, facing: "north" },
  { id: "companion.SE.east", kind: "armchair", anchor: { x: 5, y: 4 }, facing: "west" },
  { id: "companion.SE.south", kind: "armchair", anchor: { x: 4, y: 5 }, facing: "north" },
];

export interface ApprovedRoomNavigationContract {
  roomDefinitionId: string;
  width: number;
  height: number;
  allowedOrientations: Array<0 | 270>;
  solidFixtures: ApprovedSolidFixture[];
  /** Definition-local proof door segments. Omit when every wall segment is selectable. */
  allowedDoorSlots?: Array<{ side: "north" | "east" | "south" | "west"; offset: number }>;
  /** Proof-valid sub-tile approaches whose integer threshold tile is blocked. */
  doorThresholdExceptions?: Array<{ side: "north" | "east" | "south" | "west"; offset: number }>;
  primaryAnchor: ApprovedFloorPoint | null;
  waitingAnchors: ApprovedFloorPoint[];
  /** Companion-only seating does not change patient waiting or bed capacity. */
  companionSeats?: ApprovedCompanionSeat[];
  standingWaitingAnchors?: ApprovedFloorPoint[];
  staffAnchor: ApprovedFloorPoint | null;
  patientCareAnchor?: ApprovedFloorPoint | null;
  clinicianCareAnchor?: ApprovedFloorPoint | null;
  /** Stable furniture stations used by persisted care reservations. */
  careStations?: Array<{
    id: string;
    kind: "periop_bed";
    patientAnchor: ApprovedFloorPoint;
    facing: "north" | "east" | "south" | "west";
  }>;
  /** Shared clinical coverage post, distinct from patient care stations. */
  sharedStaffAnchor?: ApprovedFloorPoint | null;
  publicWaitingArea?: boolean;
}

/**
 * Proof floor coordinates are continuous room-local tile units. The domain
 * remains an integer grid: each approved solid fixture explicitly owns the
 * tile centers it obstructs, while a listed furniture contact may be entered
 * only as the first or final path tile. Door-owned fixtures clear with their
 * matching opening; the few proof-valid sub-tile approaches are declared as
 * threshold exceptions instead of making solid furniture generally passable.
 */
export const APPROVED_ROOM_NAVIGATION_CONTRACTS: Record<
  string,
  ApprovedRoomNavigationContract
> = {
  "room.front_desk": {
    roomDefinitionId: "room.front_desk", width: 5, height: 4, allowedOrientations: [0],
    solidFixtures: [
      { id: "desk", footprint: { left: 1, top: 2, width: 2, height: 0.75 }, blockedTiles: [{ x: 1, y: 2 }, { x: 2, y: 2 }] },
      { id: "receptionist-chair", footprint: { left: 1, top: 1, width: 1, height: 1 }, blockedTiles: [{ x: 1, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }] },
      { id: "visitor-chair", footprint: { left: 4, top: 3, width: 1, height: 1 }, blockedTiles: [{ x: 4, y: 3 }], endpointOnlyContacts: [{ x: 4, y: 3 }], hiddenByDoorSlots: [{ side: "east", offset: 3 }] },
    ],
    allowedDoorSlots: [
      { side: "north", offset: 0 }, { side: "north", offset: 1 },
      { side: "north", offset: 2 }, { side: "north", offset: 3 },
      { side: "north", offset: 4 },
      { side: "west", offset: 0 }, { side: "east", offset: 0 },
      { side: "west", offset: 1 }, { side: "east", offset: 1 },
      { side: "west", offset: 2 }, { side: "east", offset: 2 },
      { side: "west", offset: 3 }, { side: "east", offset: 3 },
      { side: "south", offset: 2 },
    ],
    primaryAnchor: { x: 2, y: 3 }, waitingAnchors: [{ x: 4, y: 3 }, { x: 3, y: 3 }], standingWaitingAnchors: [{ x: 3, y: 3 }], staffAnchor: { x: 1, y: 1 }, publicWaitingArea: true,
  },
  "room.examination": {
    roomDefinitionId: "room.examination", width: 3, height: 2, allowedOrientations: [0, 270],
    solidFixtures: [
      { id: "examination-table", footprint: { left: 1.3, top: 0.65, width: 1.55, height: 0.7 }, navigationFootprint: { left: 1.09, top: 0.44, width: 1.97, height: 1.12 }, blockedTiles: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }] },
      // Owner rule (2026-10-07): the table's south-east tile is owned here so an
      // EA door can walk through the table's east end to the bedside contact.
      // It stays blocked unless EA is open.
      { id: "examination-table-east-passage", footprint: { left: 2, top: 0.65, width: 0.85, height: 0.7 }, blockedTiles: [{ x: 2, y: 1 }], hiddenByDoorSlots: [{ side: "east", offset: 0 }] },
    ],
    doorThresholdExceptions: [
      { side: "north", offset: 1 }, { side: "north", offset: 2 },
      { side: "south", offset: 1 }, { side: "south", offset: 2 },
      // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
      { side: "east", offset: 0 }, { side: "east", offset: 1 },
    ],
    // The proof's clinician contact sits in the sub-tile south aisle beside
    // the bed. The integer domain shares the terminal bed contact with the
    // patient; renderer role attachments retain the two distinct proof poses.
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 }, patientCareAnchor: { x: 1, y: 1 }, clinicianCareAnchor: { x: 1, y: 1 },
  },
  "room.hallway": { roomDefinitionId: "room.hallway", width: 1, height: 1, allowedOrientations: [0], solidFixtures: [], primaryAnchor: { x: 0, y: 0 }, waitingAnchors: [], staffAnchor: null, publicWaitingArea: true },
  "room.waiting": {
    roomDefinitionId: "room.waiting", width: 4, height: 3, allowedOrientations: [0, 270],
    solidFixtures: [
      { id: "bench", footprint: { left: 1.05, top: 0.55, width: 1.9, height: 0.4 }, blockedTiles: [{ x: 1, y: 0 }, { x: 2, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }, { x: 2, y: 0 }] },
      { id: "left-chair", footprint: { left: 0.42, top: 1.45, width: 0.56, height: 0.5 }, blockedTiles: [{ x: 0, y: 1 }], endpointOnlyContacts: [{ x: 0, y: 1 }] },
      { id: "right-chair", footprint: { left: 3.02, top: 1.45, width: 0.56, height: 0.5 }, blockedTiles: [{ x: 3, y: 1 }], endpointOnlyContacts: [{ x: 3, y: 1 }] },
      // The proof table is optional. Its visibility toggle is presentation
      // state, so it owns no always-on domain tile; the permanent seats remain
      // authoritative blockers and leave the center aisle functional.
      { id: "table", footprint: { left: 1.35, top: 1.48, width: 1.3, height: 0.6 }, blockedTiles: [] },
    ],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "north", offset: 1 }, { side: "north", offset: 2 }, { side: "west", offset: 1 }, { side: "east", offset: 1 }],
    primaryAnchor: { x: 0, y: 2 }, waitingAnchors: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 3, y: 1 }], staffAnchor: null, publicWaitingArea: true,
  },
  "room.bathroom": {
    roomDefinitionId: "room.bathroom", width: 2, height: 2, allowedOrientations: [0],
    solidFixtures: [
      { id: "sink", footprint: { left: 0.36, top: 0.46, width: 0.38, height: 0.38 }, blockedTiles: [{ x: 0, y: 0 }] },
      { id: "toilet", footprint: { left: 1.22, top: 0.46, width: 0.42, height: 0.62 }, blockedTiles: [{ x: 1, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }] },
    ],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "north", offset: 0 }, { side: "north", offset: 1 }, { side: "west", offset: 0 }, { side: "east", offset: 0 }],
    primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: null,
  },
  "room.xray": {
    roomDefinitionId: "room.xray", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{ id: "detector", footprint: { left: 1.225, top: 1.5, width: 0.55, height: 0.35 }, blockedTiles: [{ x: 1, y: 1 }] }],
    primaryAnchor: { x: 1, y: 2 }, waitingAnchors: [], staffAnchor: { x: 2, y: 2 }, patientCareAnchor: { x: 1, y: 2 }, clinicianCareAnchor: { x: 2, y: 2 },
  },
  "room.minor_procedure": {
    roomDefinitionId: "room.minor_procedure", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{ id: "procedure-table", footprint: { left: 1.15, top: 0.55, width: 0.7, height: 1.4 }, blockedTiles: [{ x: 1, y: 1 }] }],
    primaryAnchor: { x: 1, y: 2 }, waitingAnchors: [], staffAnchor: { x: 1, y: 2 }, patientCareAnchor: { x: 1, y: 2 }, clinicianCareAnchor: { x: 1, y: 2 },
  },
  "room.ultrasound": {
    roomDefinitionId: "room.ultrasound", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{ id: "ultrasound-table", footprint: { left: 0.6, top: 1.1, width: 1.8, height: 0.65 }, blockedTiles: [{ x: 1, y: 1 }] }],
    primaryAnchor: { x: 2, y: 2 }, waitingAnchors: [], staffAnchor: { x: 0, y: 2 }, patientCareAnchor: { x: 2, y: 2 }, clinicianCareAnchor: { x: 0, y: 2 },
  },
  "room.ct": {
    roomDefinitionId: "room.ct", width: 4, height: 4, allowedOrientations: [0],
    solidFixtures: [
      { id: "scanner", footprint: { left: 0.5, top: 1, width: 1.8, height: 1.65 }, blockedTiles: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
      { id: "partition", footprint: { left: 2.69, top: 0.75, width: 0.12, height: 2.4 }, blockedTiles: [{ x: 2, y: 1 }, { x: 2, y: 2 }] },
    ],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "west", offset: 1 }, { side: "west", offset: 2 }],
    primaryAnchor: { x: 1, y: 3 }, waitingAnchors: [], staffAnchor: { x: 3, y: 2 }, patientCareAnchor: { x: 1, y: 3 }, clinicianCareAnchor: { x: 3, y: 2 },
  },
  "room.phlebotomy": {
    roomDefinitionId: "room.phlebotomy", width: 3, height: 2, allowedOrientations: [0, 270],
    solidFixtures: [{ id: "patient-chair", footprint: { left: 1.05, top: 0.5, width: 0.9, height: 0.48 }, blockedTiles: [{ x: 1, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }] }],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "north", offset: 1 }],
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 }, patientCareAnchor: { x: 1, y: 0 }, clinicianCareAnchor: { x: 1, y: 1 },
  },
  "room.evs_closet": { roomDefinitionId: "room.evs_closet", width: 2, height: 2, allowedOrientations: [0], solidFixtures: [], primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 } },
  "room.endoscopy": {
    roomDefinitionId: "room.endoscopy", width: 4, height: 3, allowedOrientations: [0, 270],
    solidFixtures: [{ id: "procedure-table", footprint: { left: 0.95, top: 0.35, width: 1, height: 1.6 }, blockedTiles: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "north", offset: 1 }],
    primaryAnchor: { x: 1, y: 2 }, waitingAnchors: [], staffAnchor: { x: 2, y: 1 }, patientCareAnchor: { x: 1, y: 2 }, clinicianCareAnchor: { x: 2, y: 1 },
  },
  "room.periop_recovery": {
    roomDefinitionId: "room.periop_recovery", width: 6, height: 6, allowedOrientations: [0],
    solidFixtures: [
      { id: "N3", footprint: { left: 1.9, top: 0, width: 0.7, height: 1.55 }, blockedTiles: [{ x: 2, y: 0 }, { x: 2, y: 1 }], hiddenByDoorSlots: [{ side: "north", offset: 2 }] },
      { id: "N4", footprint: { left: 3.4, top: 0, width: 0.7, height: 1.55 }, blockedTiles: [{ x: 3, y: 0 }, { x: 3, y: 1 }], hiddenByDoorSlots: [{ side: "north", offset: 3 }] },
      // The proof leaves 0.45-tile aisles between the side beds and station.
      // The coarse grid preserves those verified aisles on the inner column.
      { id: "WC", footprint: { left: 0, top: 1.9, width: 1.55, height: 0.7 }, blockedTiles: [{ x: 0, y: 2 }], hiddenByDoorSlots: [{ side: "west", offset: 2 }] },
      { id: "WD", footprint: { left: 0, top: 3.4, width: 1.55, height: 0.7 }, blockedTiles: [{ x: 0, y: 3 }], hiddenByDoorSlots: [{ side: "west", offset: 3 }] },
      { id: "EC", footprint: { left: 4.45, top: 1.9, width: 1.55, height: 0.7 }, blockedTiles: [{ x: 5, y: 2 }], hiddenByDoorSlots: [{ side: "east", offset: 2 }] },
      { id: "ED", footprint: { left: 4.45, top: 3.4, width: 1.55, height: 0.7 }, blockedTiles: [{ x: 5, y: 3 }], hiddenByDoorSlots: [{ side: "east", offset: 3 }] },
      { id: "S3", footprint: { left: 1.9, top: 4.45, width: 0.7, height: 1.55 }, blockedTiles: [{ x: 2, y: 4 }, { x: 2, y: 5 }], endpointOnlyContacts: [{ x: 2, y: 4 }], hiddenByDoorSlots: [{ side: "south", offset: 2 }] },
      { id: "S4", footprint: { left: 3.4, top: 4.45, width: 0.7, height: 1.55 }, blockedTiles: [{ x: 3, y: 4 }, { x: 3, y: 5 }], endpointOnlyContacts: [{ x: 3, y: 4 }], hiddenByDoorSlots: [{ side: "south", offset: 3 }] },
      { id: "station", footprint: { left: 2, top: 3, width: 2, height: 0.65 }, blockedTiles: [{ x: 2, y: 3 }, { x: 3, y: 3 }], endpointOnlyContacts: [{ x: 3, y: 3 }] },
      ...PERIOP_COMPANION_SEATS.map((seat): ApprovedSolidFixture => {
        const side = seat.facing === "south" ? "north" : seat.facing === "north" ? "south" : seat.facing === "east" ? "west" : "east";
        return {
          // The solid tile is a conservative contact mask. The approved
          // chair art is smaller, leaving clearance at corner door approaches.
          id: seat.id, footprint: { left: seat.anchor.x + 0.15, top: seat.anchor.y + 0.15, width: 0.7, height: 0.7 },
          blockedTiles: [{ ...seat.anchor }], endpointOnlyContacts: [{ ...seat.anchor }],
          hiddenByDoorSlots: [{ side, offset: side === "north" || side === "south" ? seat.anchor.x : seat.anchor.y }],
        };
      }),
    ],
    primaryAnchor: { x: 3, y: 2 }, waitingAnchors: [{ x: 1, y: 2 }], staffAnchor: { x: 3, y: 2 },
    companionSeats: PERIOP_COMPANION_SEATS,
    careStations: [
      { id: "N3", kind: "periop_bed", patientAnchor: { x: 2, y: 2 }, facing: "south" },
      { id: "N4", kind: "periop_bed", patientAnchor: { x: 3, y: 2 }, facing: "south" },
      { id: "S3", kind: "periop_bed", patientAnchor: { x: 2, y: 4 }, facing: "north" },
      { id: "S4", kind: "periop_bed", patientAnchor: { x: 3, y: 4 }, facing: "north" },
      { id: "WC", kind: "periop_bed", patientAnchor: { x: 1, y: 2 }, facing: "east" },
      { id: "WD", kind: "periop_bed", patientAnchor: { x: 1, y: 3 }, facing: "east" },
      { id: "EC", kind: "periop_bed", patientAnchor: { x: 4, y: 2 }, facing: "west" },
      { id: "ED", kind: "periop_bed", patientAnchor: { x: 4, y: 3 }, facing: "west" },
    ],
    sharedStaffAnchor: { x: 3, y: 3 },
  },
  "room.training": {
    roomDefinitionId: "room.training", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{ id: "training-bench", footprint: { left: 0.65, top: 0.85, width: 1.7, height: 0.6 }, blockedTiles: [{ x: 1, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }] }],
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 },
  },
  "room.coffee_kiosk": {
    roomDefinitionId: "room.coffee_kiosk", width: 2, height: 2, allowedOrientations: [0],
    solidFixtures: [{ id: "island", footprint: { left: 0.5, top: 0.6, width: 1, height: 0.8 }, blockedTiles: [{ x: 0, y: 1 }, { x: 1, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }] }],
    doorThresholdExceptions: [
      { side: "south", offset: 0 }, { side: "south", offset: 1 },
      { side: "west", offset: 1 }, { side: "east", offset: 1 },
    ],
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: null,
  },
  "room.glp1_telehealth_suite": {
    roomDefinitionId: "room.glp1_telehealth_suite", width: 3, height: 2, allowedOrientations: [0, 270],
    // Preserve the proof's half-tile aisle around the divider in both views.
    solidFixtures: [{ id: "station", footprint: { left: 1, top: 0.5, width: 1, height: 1 }, blockedTiles: [{ x: 1, y: 0 }] }],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "north", offset: 1 }],
    primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 2, y: 1 }, patientCareAnchor: { x: 0, y: 1 }, clinicianCareAnchor: { x: 2, y: 1 },
  },
  "room.ambulatory_or": {
    roomDefinitionId: "room.ambulatory_or", width: 4, height: 4, allowedOrientations: [0],
    solidFixtures: [{
      id: "surgical-table",
      footprint: { left: 1.55, top: 1.4, width: 0.9, height: 1.8 },
      blockedTiles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    }],
    primaryAnchor: { x: 2, y: 3 }, waitingAnchors: [], staffAnchor: { x: 3, y: 2 },
    patientCareAnchor: { x: 2, y: 3 }, clinicianCareAnchor: { x: 0, y: 2 },
  },
  "room.laboratory": {
    roomDefinitionId: "room.laboratory", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{
      id: "testing-bench",
      footprint: { left: 0.8, top: 1.1, width: 1.4, height: 0.65 },
      blockedTiles: [{ x: 1, y: 1 }],
    }],
    primaryAnchor: { x: 1, y: 2 }, waitingAnchors: [], staffAnchor: { x: 1, y: 2 },
  },
  "room.pharmacy": {
    roomDefinitionId: "room.pharmacy", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{
      id: "dispensing-counter",
      footprint: { left: 0.4, top: 1.15, width: 1.75, height: 0.65 },
      blockedTiles: [{ x: 0, y: 1 }, { x: 1, y: 1 }],
    }],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "west", offset: 1 }],
    primaryAnchor: { x: 1, y: 2 }, waitingAnchors: [], staffAnchor: { x: 2, y: 1 },
  },
  "room.maintenance_workshop": {
    roomDefinitionId: "room.maintenance_workshop", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [{
      id: "repair-bench",
      footprint: { left: 0.575, top: 1.2, width: 1.85, height: 0.65 },
      blockedTiles: [{ x: 1, y: 1 }],
    }],
    primaryAnchor: { x: 1, y: 2 }, waitingAnchors: [], staffAnchor: { x: 1, y: 2 },
  },
  "room.staff_break": {
    roomDefinitionId: "room.staff_break", width: 4, height: 4, allowedOrientations: [0],
    solidFixtures: [
      { id: "large-seating", footprint: { left: 0.78, top: 0.55, width: 2.44, height: 1.57 }, blockedTiles: [{ x: 1, y: 1 }, { x: 2, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }, { x: 2, y: 1 }] },
      { id: "massage-chair", footprint: { left: 0.65, top: 2, width: 0.8, height: 1 }, blockedTiles: [{ x: 1, y: 2 }], endpointOnlyContacts: [{ x: 1, y: 2 }] },
      { id: "small-seating", footprint: { left: 2.3, top: 2.05, width: 0.8, height: 1.52 }, blockedTiles: [{ x: 2, y: 2 }, { x: 2, y: 3 }], endpointOnlyContacts: [{ x: 2, y: 2 }, { x: 2, y: 3 }] },
      // The approved bookshelf and plants intentionally remain pass-through
      // decor at the domain's coarse navigation resolution.
    ],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "south", offset: 2 }],
    primaryAnchor: { x: 1, y: 3 }, waitingAnchors: [], staffAnchor: { x: 1, y: 3 },
  },
  "room.surgeon_office": {
    roomDefinitionId: "room.surgeon_office", width: 2, height: 2, allowedOrientations: [0],
    // The compact proof's plant and bookcase are deliberate pass-through
    // decor. The desk is retained visually without consuming the only coarse
    // grid route to its seated work contact.
    solidFixtures: [{ id: "writing-desk", footprint: { left: 0.46, top: 0.78, width: 1.35, height: 0.65 }, blockedTiles: [] }],
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 },
  },
  "room.vending": {
    roomDefinitionId: "room.vending", width: 2, height: 2, allowedOrientations: [0],
    solidFixtures: [{ id: "vending-machine", footprint: { left: 0.5, top: 0.05, width: 1, height: 1.05 }, blockedTiles: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }],
    // Owner rule (2026-10-07): every wall is a legal door; doorway furniture is passable.
    doorThresholdExceptions: [{ side: "north", offset: 0 }, { side: "north", offset: 1 }, { side: "west", offset: 0 }, { side: "east", offset: 0 }],
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: null, publicWaitingArea: true,
  },
  "room.reading": {
    roomDefinitionId: "room.reading", width: 4, height: 4, allowedOrientations: [0],
    // Fractional footprints preserve the approved pinwheel proof. The four
    // central blocked cells are a conservative coarse-grid clearance mask,
    // not a claim of exact continuous collision equivalence. Perimeter
    // circulation stays clear for all sixteen approved door segments.
    solidFixtures: [
      { id: "centralCoreBase", footprint: { left: 1.78, top: 1.78, width: 0.44, height: 0.44 }, blockedTiles: [] },
      { id: "northwestDeskBase", footprint: { left: 0.70, top: 1.66, width: 1.08, height: 0.76 }, blockedTiles: [{ x: 1, y: 2 }] },
      { id: "northeastDeskBase", footprint: { left: 1.78, top: 0.70, width: 0.56, height: 1.08 }, blockedTiles: [{ x: 2, y: 1 }] },
      { id: "southeastDeskCoreBase", footprint: { left: 2.22, top: 1.78, width: 0.72, height: 0.56 }, blockedTiles: [] },
      { id: "southeastDeskFloorBase", footprint: { left: 3.00, top: 2.70, width: 0.39, height: 0.25 }, blockedTiles: [] },
      { id: "southwestDeskBase", footprint: { left: 1.66, top: 2.22, width: 0.56, height: 1.10 }, blockedTiles: [] },
      { id: "southwestDeskWestPedestal", footprint: { left: 1.28, top: 2.95, width: 0.25, height: 0.37 }, blockedTiles: [] },
      { id: "northwestChair", footprint: { left: 0.94, top: 1.55, width: 0.72, height: 0.42 }, blockedTiles: [{ x: 1, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }] },
      // These two proof contacts fall on the clear perimeter. Reserving an
      // operational post must not permanently split that circulation ring.
      { id: "northeastChair", footprint: { left: 2.87, top: 1.47, width: 0.62, height: 0.44 }, blockedTiles: [] },
      { id: "southeastChair", footprint: { left: 2.28, top: 2.51, width: 0.72, height: 0.42 }, blockedTiles: [{ x: 2, y: 2 }], endpointOnlyContacts: [{ x: 2, y: 2 }] },
      { id: "southwestChair", footprint: { left: 0.59, top: 2.64, width: 0.62, height: 0.44 }, blockedTiles: [] },
    ],
    primaryAnchor: { x: 0, y: 3 }, waitingAnchors: [],
    staffAnchor: DIAGNOSTIC_READING_WORKSTATIONS[0].staffAnchor,
  },
};

export function getApprovedRoomNavigation(roomDefinitionId: string) {
  const contract = APPROVED_ROOM_NAVIGATION_CONTRACTS[roomDefinitionId];
  if (!contract) return undefined;
  return {
    blockedTiles: contract.solidFixtures.flatMap((fixture) => fixture.blockedTiles),
    endpointOnlyTiles: contract.solidFixtures.flatMap(
      (fixture) => fixture.endpointOnlyContacts ?? [],
    ),
    dynamicBlockers: contract.solidFixtures.flatMap((fixture) =>
      fixture.hiddenByDoorSlots
        ? [{ fixtureId: fixture.id, tiles: fixture.blockedTiles, doorSlots: fixture.hiddenByDoorSlots }]
        : [],
    ),
    ...(contract.allowedDoorSlots ? { allowedDoorSlots: contract.allowedDoorSlots } : {}),
    ...(contract.doorThresholdExceptions ? { doorThresholdExceptions: contract.doorThresholdExceptions } : {}),
    primaryAnchor: contract.primaryAnchor,
    waitingAnchors: contract.waitingAnchors,
    ...(contract.companionSeats ? { companionSeats: contract.companionSeats } : {}),
    ...(contract.standingWaitingAnchors ? { standingWaitingAnchors: contract.standingWaitingAnchors } : {}),
    staffAnchor: contract.staffAnchor,
    patientCareAnchor: contract.patientCareAnchor,
    clinicianCareAnchor: contract.clinicianCareAnchor,
    ...(contract.careStations ? { careStations: contract.careStations } : {}),
    ...(contract.sharedStaffAnchor === undefined ? {} : { sharedStaffAnchor: contract.sharedStaffAnchor }),
    ...(contract.publicWaitingArea === undefined ? {} : { publicWaitingArea: contract.publicWaitingArea }),
  };
}
