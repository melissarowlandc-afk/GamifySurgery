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
  standingWaitingAnchors?: ApprovedFloorPoint[];
  staffAnchor: ApprovedFloorPoint | null;
  patientCareAnchor?: ApprovedFloorPoint | null;
  clinicianCareAnchor?: ApprovedFloorPoint | null;
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
    solidFixtures: [{ id: "examination-table", footprint: { left: 1.3, top: 0.65, width: 1.55, height: 0.7 }, navigationFootprint: { left: 1.09, top: 0.44, width: 1.97, height: 1.12 }, blockedTiles: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }], endpointOnlyContacts: [{ x: 1, y: 1 }] }],
    doorThresholdExceptions: [
      { side: "north", offset: 1 }, { side: "north", offset: 2 },
      { side: "south", offset: 1 }, { side: "south", offset: 2 },
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
    primaryAnchor: { x: 0, y: 2 }, waitingAnchors: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 3, y: 1 }], staffAnchor: null, publicWaitingArea: true,
  },
  "room.bathroom": {
    roomDefinitionId: "room.bathroom", width: 2, height: 2, allowedOrientations: [0],
    solidFixtures: [
      { id: "sink", footprint: { left: 0.36, top: 0.46, width: 0.38, height: 0.38 }, blockedTiles: [{ x: 0, y: 0 }] },
      { id: "toilet", footprint: { left: 1.22, top: 0.46, width: 0.42, height: 0.62 }, blockedTiles: [{ x: 1, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }] },
    ],
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
    primaryAnchor: { x: 1, y: 3 }, waitingAnchors: [], staffAnchor: { x: 3, y: 2 }, patientCareAnchor: { x: 1, y: 3 }, clinicianCareAnchor: { x: 3, y: 2 },
  },
  "room.phlebotomy": {
    roomDefinitionId: "room.phlebotomy", width: 3, height: 2, allowedOrientations: [0, 270],
    solidFixtures: [{ id: "patient-chair", footprint: { left: 1.05, top: 0.5, width: 0.9, height: 0.48 }, blockedTiles: [{ x: 1, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }] }],
    primaryAnchor: { x: 1, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 }, patientCareAnchor: { x: 1, y: 0 }, clinicianCareAnchor: { x: 1, y: 1 },
  },
  "room.evs_closet": { roomDefinitionId: "room.evs_closet", width: 2, height: 2, allowedOrientations: [0], solidFixtures: [], primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 } },
  "room.endoscopy": {
    roomDefinitionId: "room.endoscopy", width: 4, height: 3, allowedOrientations: [0, 270],
    solidFixtures: [{ id: "procedure-table", footprint: { left: 0.95, top: 0.35, width: 1, height: 1.6 }, blockedTiles: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }],
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
      { id: "S3", footprint: { left: 1.9, top: 4.45, width: 0.7, height: 1.55 }, blockedTiles: [{ x: 2, y: 4 }, { x: 2, y: 5 }], hiddenByDoorSlots: [{ side: "south", offset: 2 }] },
      { id: "S4", footprint: { left: 3.4, top: 4.45, width: 0.7, height: 1.55 }, blockedTiles: [{ x: 3, y: 4 }, { x: 3, y: 5 }], hiddenByDoorSlots: [{ side: "south", offset: 3 }] },
      { id: "station", footprint: { left: 2, top: 3, width: 2, height: 0.65 }, blockedTiles: [{ x: 2, y: 3 }, { x: 3, y: 3 }] },
    ],
    primaryAnchor: { x: 3, y: 2 }, waitingAnchors: [{ x: 1, y: 2 }], staffAnchor: { x: 3, y: 2 },
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
    primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 2, y: 1 }, patientCareAnchor: { x: 0, y: 1 }, clinicianCareAnchor: { x: 2, y: 1 },
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
    ...(contract.standingWaitingAnchors ? { standingWaitingAnchors: contract.standingWaitingAnchors } : {}),
    staffAnchor: contract.staffAnchor,
    patientCareAnchor: contract.patientCareAnchor,
    clinicianCareAnchor: contract.clinicianCareAnchor,
    ...(contract.publicWaitingArea === undefined ? {} : { publicWaitingArea: contract.publicWaitingArea }),
  };
}
