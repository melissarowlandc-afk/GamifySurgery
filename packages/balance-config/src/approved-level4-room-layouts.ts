import type { ApprovedFloorPoint, ApprovedRoomNavigationContract } from "./approved-room-layouts";

/** M5/M6 reserve these ids and bind actual actors. M2 adds no gameplay.
 * Integer walking endpoints are distinct from static furniture contacts. */
export interface ApprovedLevel4SupportNavigation {
  id: string;
  fixtureId: string;
  anchor: ApprovedFloorPoint;
  standingApproach: ApprovedFloorPoint;
  approachPath: ApprovedFloorPoint[];
  maxAgeExclusive?: number;
  allowedActors: Array<"child" | "parent" | "patient" | "provider">;
  hiddenByDoorSlots?: Array<{ side: "north" | "east" | "south" | "west"; offset: number }>;
}

export const APPROVED_LEVEL4_SUPPORT_NAVIGATION: Record<string, ApprovedLevel4SupportNavigation[]> = {
  "room.wound_ostomy": [
    { id: "recliner:patient", fixtureId: "recliner", anchor: { x: 0, y: 2 }, standingApproach: { x: .95, y: 2.3 },
      approachPath: [{ x: .5, y: 2.5 }, { x: .95, y: 2.3 }], allowedActors: ["patient"] },
    { id: "stool:clinician", fixtureId: "stool", anchor: { x: 2, y: 1 }, standingApproach: { x: 2.65, y: 1.75 },
      approachPath: [{ x: 2.5, y: 1.5 }, { x: 2.65, y: 1.75 }], allowedActors: ["provider"] },
  ],
  "room.pediatric_examination": [
    { id: "table:patient", fixtureId: "pedsTable", anchor: { x: 1, y: 1 }, standingApproach: { x: 1.1, y: 1.15 },
      approachPath: [{ x: 1.5, y: 1.5 }, { x: 1.1, y: 1.5 }, { x: 1.1, y: 1.15 }], allowedActors: ["child"] },
    { id: "stool:clinician", fixtureId: "stool", anchor: { x: 2, y: 1 }, standingApproach: { x: 1.95, y: 1.8 },
      approachPath: [{ x: 2.5, y: 1.5 }, { x: 1.95, y: 1.5 }, { x: 1.95, y: 1.8 }], allowedActors: ["provider"] },
    { id: "parentChair", fixtureId: "parentChair", anchor: { x: 1, y: 2 }, standingApproach: { x: 1.95, y: 2.5 },
      approachPath: [{ x: 1.5, y: 2.5 }, { x: 1.95, y: 2.5 }], allowedActors: ["parent"] },
  ],
  "room.pediatric_waiting": [
    { id: "bench:seat-1", fixtureId: "bench", anchor: { x: 1, y: 1 }, standingApproach: { x: 1.55, y: 1.2 },
      approachPath: [{ x: 1.5, y: 1.5 }, { x: 1.55, y: 1.2 }], allowedActors: ["child", "parent"] },
    { id: "bench:seat-2", fixtureId: "bench", anchor: { x: 2, y: 1 }, standingApproach: { x: 2.45, y: 1.2 },
      approachPath: [{ x: 2.5, y: 1.5 }, { x: 2.45, y: 1.2 }], allowedActors: ["child", "parent"] },
    { id: "armchair", fixtureId: "armchair", anchor: { x: 3, y: 2 }, standingApproach: { x: 2.8, y: 2.15 },
      approachPath: [{ x: 3.5, y: 2.5 }, { x: 2.8, y: 2.5 }, { x: 2.8, y: 2.15 }], allowedActors: ["child", "parent"] },
    { id: "olderChildChair", fixtureId: "adultChairEastNorth", anchor: { x: 1, y: 1 }, standingApproach: { x: 1.15, y: 1.95 },
      approachPath: [{ x: 1.5, y: 1.5 }, { x: 1.15, y: 1.5 }, { x: 1.15, y: 1.95 }], allowedActors: ["child", "parent"], hiddenByDoorSlots: [{ side: "west", offset: 1 }] },
    { id: "spareAdultChair", fixtureId: "adultChairEastSouth", anchor: { x: 1, y: 3 }, standingApproach: { x: 1.15, y: 3.18 },
      approachPath: [{ x: 1.5, y: 3.5 }, { x: 1.15, y: 3.5 }, { x: 1.15, y: 3.18 }], allowedActors: ["child", "parent"], hiddenByDoorSlots: [{ side: "west", offset: 2 }, { side: "west", offset: 3 }] },
    { id: "kidWest", fixtureId: "kidStoolWest", anchor: { x: 0, y: 2 }, standingApproach: { x: 1.15, y: 2.66 },
      approachPath: [{ x: .5, y: 2.5 }, { x: 1.15, y: 2.5 }, { x: 1.15, y: 2.66 }], allowedActors: ["child"], maxAgeExclusive: 10 },
    { id: "kidEast", fixtureId: "kidStoolEast", anchor: { x: 3, y: 2 }, standingApproach: { x: 2.85, y: 2.66 },
      approachPath: [{ x: 3.5, y: 2.5 }, { x: 2.85, y: 2.5 }, { x: 2.85, y: 2.66 }], allowedActors: ["child"], maxAgeExclusive: 10 },
    { id: "kidNorth", fixtureId: "kidStoolNorth", anchor: { x: 2, y: 1 }, standingApproach: { x: 2, y: 1.85 },
      approachPath: [{ x: 2.5, y: 1.5 }, { x: 2, y: 1.5 }, { x: 2, y: 1.85 }], allowedActors: ["child"], maxAgeExclusive: 10 },
    { id: "kidSouth", fixtureId: "kidStoolSouth", anchor: { x: 2, y: 3 }, standingApproach: { x: 2, y: 3.3 },
      approachPath: [{ x: 2.5, y: 3.5 }, { x: 2, y: 3.5 }, { x: 2, y: 3.3 }], allowedActors: ["child"], maxAgeExclusive: 10 },
  ],
  "room.mri": [
    { id: "operator", fixtureId: "operator-chair", anchor: { x: 0, y: 2 }, standingApproach: { x: 1.12, y: 2.9 },
      approachPath: [{ x: .5, y: 2.5 }, { x: 1.12, y: 2.9 }], allowedActors: ["provider"] },
    { id: "patient-standing", fixtureId: "table", anchor: { x: 2, y: 3 }, standingApproach: { x: 2.45, y: 3.3 },
      approachPath: [{ x: 2.5, y: 3.5 }, { x: 2.45, y: 3.3 }], allowedActors: ["patient"] },
    { id: "patient-seated", fixtureId: "table", anchor: { x: 2, y: 3 }, standingApproach: { x: 2.18, y: 2.8 },
      approachPath: [{ x: 2.5, y: 3.5 }, { x: 2.45, y: 3.3 }, { x: 2.18, y: 3.3 }, { x: 2.18, y: 2.8 }], allowedActors: ["patient"] },
  ],
};

export const APPROVED_LEVEL4_ROOM_NAVIGATION_CONTRACTS: Record<string, ApprovedRoomNavigationContract> = {
  "room.wound_ostomy": {
    roomDefinitionId: "room.wound_ostomy", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [
      { id: "recliner", footprint: { left: .35, top: 1.55, width: 1.15, height: .4 }, blockedTiles: [{ x: 0, y: 1 }, { x: 1, y: 1 }], endpointOnlyContacts: [{ x: 0, y: 1 }] },
      { id: "lamp", footprint: { left: 1.5, top: 1.08, width: .22, height: .12 }, blockedTiles: [] },
      { id: "sink", footprint: { left: .25, top: .18, width: .4, height: .12 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "north", offset: 0 }, { side: "west", offset: 0 }] },
      { id: "ostomyShelf", footprint: { left: 1.65, top: .18, width: .72, height: .12 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "north", offset: 1 }, { side: "north", offset: 2 }] },
      { id: "dressingCart", footprint: { left: 2.45, top: 2.76, width: .34, height: .1 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "south", offset: 2 }, { side: "east", offset: 2 }] },
      { id: "curtain", footprint: { left: .08, top: 2.22, width: .16, height: .1 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "west", offset: 2 }] },
      { id: "bio", footprint: { left: .22, top: 2.76, width: .24, height: .1 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "south", offset: 0 }, { side: "west", offset: 2 }] },
    ],
    doorThresholdExceptions: [{ side: "west", offset: 1 }],
    primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 2, y: 1 },
    patientCareAnchor: { x: 0, y: 1 }, clinicianCareAnchor: { x: 2, y: 1 },
  },
  "room.pediatric_examination": {
    roomDefinitionId: "room.pediatric_examination", width: 3, height: 3, allowedOrientations: [0],
    solidFixtures: [
      { id: "pedsTable", footprint: { left: .12, top: .5, width: .74, height: 1.5 }, blockedTiles: [{ x: 0, y: 0 }, { x: 0, y: 1 }], endpointOnlyContacts: [{ x: 0, y: 1 }] },
      { id: "parentChair", footprint: { left: 2.24, top: 2.38, width: .56, height: .5 }, blockedTiles: [{ x: 2, y: 2 }], endpointOnlyContacts: [{ x: 2, y: 2 }] },
      { id: "scaleCounter", footprint: { left: 2.06, top: .18, width: .82, height: .12 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "north", offset: 2 }, { side: "east", offset: 0 }] },
      { id: "toyBin", footprint: { left: .21, top: 2.74, width: .26, height: .1 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "south", offset: 0 }, { side: "west", offset: 2 }] },
    ],
    doorThresholdExceptions: [{ side: "north", offset: 0 }, { side: "west", offset: 0 }, { side: "west", offset: 1 }, { side: "south", offset: 2 }, { side: "east", offset: 2 }],
    primaryAnchor: { x: 0, y: 1 }, waitingAnchors: [], staffAnchor: { x: 1, y: 1 },
    patientCareAnchor: { x: 0, y: 1 }, clinicianCareAnchor: { x: 1, y: 1 },
  },
  "room.pediatric_waiting": {
    roomDefinitionId: "room.pediatric_waiting", width: 4, height: 4, allowedOrientations: [0],
    solidFixtures: [
      { id: "bench", footprint: { left: 1.05, top: .55, width: 1.9, height: .4 }, blockedTiles: [{ x: 1, y: 0 }, { x: 2, y: 0 }], endpointOnlyContacts: [{ x: 1, y: 0 }, { x: 2, y: 0 }] },
      { id: "armchair", footprint: { left: 3.02, top: 1.45, width: .56, height: .5 }, blockedTiles: [] },
      // This conditional grid passage represents the proof's .50-tile gap
      // around the fixed chair; it never hides or removes its physical solid.
      { id: "north-east-grid-passage", footprint: { left: 3.02, top: 1.45, width: .56, height: .5 }, blockedTiles: [{ x: 3, y: 1 }],
        hiddenByDoorSlots: [{ side: "north", offset: 3 }, { side: "east", offset: 0 }] },
      { id: "kidsTable", footprint: { left: 1.7, top: 2.42, width: .6, height: .18 }, blockedTiles: [] },
      { id: "adultChairEastNorth", footprint: { left: .24, top: 1.45, width: .56, height: .5 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "west", offset: 1 }] },
      { id: "north-west-grid-passage", footprint: { left: .24, top: 1.45, width: .56, height: .5 }, blockedTiles: [{ x: 0, y: 1 }],
        hiddenByDoorSlots: [{ side: "north", offset: 0 }, { side: "west", offset: 0 }, { side: "west", offset: 1 }] },
      { id: "adultChairEastSouth", footprint: { left: .24, top: 2.68, width: .56, height: .5 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "west", offset: 2 }, { side: "west", offset: 3 }] },
      { id: "aquarium", footprint: { left: .14, top: .18, width: .8, height: .12 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "north", offset: 0 }, { side: "west", offset: 0 }] },
      { id: "toyChest", footprint: { left: .05, top: 3.6, width: .9, height: .28 }, blockedTiles: [{ x: 0, y: 3 }], hiddenByDoorSlots: [{ side: "west", offset: 3 }, { side: "south", offset: 0 }] },
      { id: "bookBin", footprint: { left: 3.28, top: 3.54, width: .64, height: .32 }, blockedTiles: [{ x: 3, y: 3 }], hiddenByDoorSlots: [{ side: "east", offset: 3 }, { side: "south", offset: 3 }] },
    ],
    doorThresholdExceptions: [{ side: "north", offset: 1 }, { side: "north", offset: 2 }, { side: "east", offset: 1 }],
    primaryAnchor: { x: 0, y: 2 }, waitingAnchors: [], staffAnchor: null,
  },
  "room.mri": {
    roomDefinitionId: "room.mri", width: 4, height: 4, allowedOrientations: [0],
    solidFixtures: [
      { id: "glass", footprint: { left: 1.6, top: .72, width: .12, height: 2.46 }, blockedTiles: [{ x: 1, y: 1 }, { x: 1, y: 2 }] },
      { id: "table", footprint: { left: 1.8, top: 1.95, width: .95, height: .45 }, blockedTiles: [{ x: 2, y: 1 }, { x: 2, y: 2 }] },
      { id: "gantry", footprint: { left: 2.42, top: 1.3, width: 1.54, height: 1.670390086093987 }, blockedTiles: [{ x: 3, y: 1 }, { x: 3, y: 2 }] },
      { id: "console", footprint: { left: .7600000000000001, top: 1.79, width: .72, height: .35 }, blockedTiles: [] },
      { id: "operator-chair", footprint: { left: .9500000000000001, top: 2.34, width: .34, height: .2 }, blockedTiles: [] },
      { id: "coilCabinet", footprint: { left: 3.3, top: .18, width: .5, height: .14 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "north", offset: 3 }, { side: "east", offset: 0 }] },
      { id: "openShelves", footprint: { left: .14, top: 3.74, width: .62, height: .14 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "south", offset: 0 }, { side: "west", offset: 3 }] },
      { id: "comfortCart", footprint: { left: 3.17, top: 3.74, width: .62, height: .14 }, blockedTiles: [], hiddenByDoorSlots: [{ side: "south", offset: 3 }, { side: "east", offset: 3 }] },
    ],
    // Approved EB/EC gantry threshold only. The table/glass remain blocked.
    doorThresholdExceptions: [{ side: "east", offset: 1 }, { side: "east", offset: 2 }],
    primaryAnchor: { x: 2, y: 3 }, waitingAnchors: [], staffAnchor: { x: 0, y: 2 },
    patientCareAnchor: { x: 2, y: 3 }, clinicianCareAnchor: { x: 0, y: 2 },
  },
};

export function isApprovedLevel4SupportEligible(
  support: ApprovedLevel4SupportNavigation, actor: "child" | "parent" | "patient" | "provider", age?: number,
): boolean {
  return support.allowedActors.includes(actor) && (support.maxAgeExclusive === undefined ||
    (actor === "child" && age !== undefined && Number.isFinite(age) && age >= 0 && age < support.maxAgeExclusive));
}
