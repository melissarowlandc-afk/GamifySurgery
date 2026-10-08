import { describe, expect, it } from "vitest";

import {
  APPROVED_ROOM_NAVIGATION_CONTRACTS,
  PERIOP_COMPANION_SEATS,
  getApprovedRoomNavigation,
} from "./approved-room-layouts";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("approved proof navigation contract", () => {
  it("defines eight inward-facing Periop companion armchairs with exact doorway ownership", () => {
    const recovery = APPROVED_ROOM_NAVIGATION_CONTRACTS["room.periop_recovery"]!;
    expect(recovery.companionSeats).toEqual(PERIOP_COMPANION_SEATS);
    expect(recovery.companionSeats).toHaveLength(8);
    expect(recovery.companionSeats!.map((seat) => [seat.anchor.x, seat.anchor.y, seat.facing])).toEqual([
      [1, 0, "south"], [0, 1, "east"], [4, 0, "south"], [5, 1, "west"],
      [0, 4, "east"], [1, 5, "north"], [5, 4, "west"], [4, 5, "north"],
    ]);
    for (const seat of recovery.companionSeats!) {
      const fixture = recovery.solidFixtures.find((candidate) => candidate.id === seat.id)!;
      expect(fixture.blockedTiles).toEqual([seat.anchor]);
      expect(fixture.endpointOnlyContacts).toEqual([seat.anchor]);
      expect(fixture.hiddenByDoorSlots).toHaveLength(1);
      expect(recovery.careStations!.some((bed) => bed.patientAnchor.x === seat.anchor.x && bed.patientAnchor.y === seat.anchor.y)).toBe(false);
    }
  });

  it("preserves two Front Desk waiting slots with one proof chair and one standing overflow", () => {
    const front = APPROVED_ROOM_NAVIGATION_CONTRACTS["room.front_desk"]!;
    expect(front.waitingAnchors).toEqual([{ x: 4, y: 3 }, { x: 3, y: 3 }]);
    expect(front.standingWaitingAnchors).toEqual([{ x: 3, y: 3 }]);
  });

  it("preserves simulation waiting capacity while adding no proof-art seats", () => {
    const expected = new Map([
      ["room.front_desk", 2],
      ["room.waiting", 4],
      ["room.periop_recovery", 1],
    ]);
    for (const contract of Object.values(APPROVED_ROOM_NAVIGATION_CONTRACTS)) {
      expect(
        contract.waitingAnchors.length,
        contract.roomDefinitionId,
      ).toBe(expected.get(contract.roomDefinitionId) ?? 0);
    }
  });

  it("covers all twenty-four approved rooms and resolves the same navigation used by balance", () => {
    expect(Object.keys(APPROVED_ROOM_NAVIGATION_CONTRACTS)).toHaveLength(24);
    for (const contract of Object.values(APPROVED_ROOM_NAVIGATION_CONTRACTS)) {
      const definition = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(
        (candidate) => candidate.id === contract.roomDefinitionId,
      );
      expect(definition, contract.roomDefinitionId).toBeDefined();
      expect([definition!.width, definition!.height]).toEqual([
        contract.width,
        contract.height,
      ]);
      expect(definition!.navigation).toEqual(
        getApprovedRoomNavigation(contract.roomDefinitionId),
      );
      const blocked = new Set(
        definition!.navigation!.blockedTiles.map((point) => `${point.x},${point.y}`),
      );
      for (const endpoint of definition!.navigation!.endpointOnlyTiles ?? []) {
        expect(blocked.has(`${endpoint.x},${endpoint.y}`)).toBe(true);
      }
    }
  });

  it("publishes the approved Level 3 dimensions and pass-through office contract", () => {
    expect(Object.fromEntries(
      ["room.ambulatory_or", "room.laboratory", "room.pharmacy", "room.maintenance_workshop", "room.staff_break", "room.surgeon_office", "room.vending", "room.reading"]
        .map((id) => {
          const contract = APPROVED_ROOM_NAVIGATION_CONTRACTS[id]!;
          return [id, `${contract.width}x${contract.height}`];
        }),
    )).toEqual({
      "room.ambulatory_or": "4x4",
      "room.laboratory": "3x3",
      "room.pharmacy": "3x3",
      "room.maintenance_workshop": "3x3",
      "room.staff_break": "4x4",
      "room.surgeon_office": "2x2",
      "room.vending": "2x2",
      "room.reading": "4x4",
    });
    expect(
      APPROVED_ROOM_NAVIGATION_CONTRACTS["room.surgeon_office"]!.solidFixtures.flatMap(
        (fixture) => fixture.blockedTiles,
      ),
    ).toEqual([]);
  });

  it("preserves canonical proof collision and clearance metadata", () => {
    const examination = APPROVED_ROOM_NAVIGATION_CONTRACTS["room.examination"]!;
    expect(examination.solidFixtures[0]).toMatchObject({
      id: "examination-table",
      footprint: { left: 1.3, top: 0.65, width: 1.55, height: 0.7 },
      navigationFootprint: { left: 1.09, top: 0.44, width: 1.97, height: 1.12 },
    });
    expect(
      APPROVED_ROOM_NAVIGATION_CONTRACTS["room.bathroom"]!.solidFixtures.map(
        (fixture) => fixture.id,
      ),
    ).toEqual(["sink", "toilet"]);
    expect(
      APPROVED_ROOM_NAVIGATION_CONTRACTS["room.waiting"]!.solidFixtures.map(
        (fixture) => fixture.id,
      ),
    ).toEqual(["bench", "left-chair", "right-chair", "table"]);
  });

  it("keeps approved rectangular builds on 0/270 and Recovery fixed at 0", () => {
    for (const id of [
      "room.examination",
      "room.waiting",
      "room.phlebotomy",
      "room.endoscopy",
      "room.glp1_telehealth_suite",
    ]) {
      expect(APPROVED_ROOM_NAVIGATION_CONTRACTS[id]!.allowedOrientations).toEqual([0, 270]);
    }
    expect(
      APPROVED_ROOM_NAVIGATION_CONTRACTS["room.periop_recovery"]!.allowedOrientations,
    ).toEqual([0]);
  });

  it("publishes eight unique Periop bed endpoints and a separate central nurse post", () => {
    const recovery = APPROVED_ROOM_NAVIGATION_CONTRACTS["room.periop_recovery"]!;
    expect(recovery.careStations).toEqual([
      { id: "N3", kind: "periop_bed", patientAnchor: { x: 2, y: 2 }, facing: "south" },
      { id: "N4", kind: "periop_bed", patientAnchor: { x: 3, y: 2 }, facing: "south" },
      { id: "S3", kind: "periop_bed", patientAnchor: { x: 2, y: 4 }, facing: "north" },
      { id: "S4", kind: "periop_bed", patientAnchor: { x: 3, y: 4 }, facing: "north" },
      { id: "WC", kind: "periop_bed", patientAnchor: { x: 1, y: 2 }, facing: "east" },
      { id: "WD", kind: "periop_bed", patientAnchor: { x: 1, y: 3 }, facing: "east" },
      { id: "EC", kind: "periop_bed", patientAnchor: { x: 4, y: 2 }, facing: "west" },
      { id: "ED", kind: "periop_bed", patientAnchor: { x: 4, y: 3 }, facing: "west" },
    ]);
    expect(new Set(recovery.careStations!.map((station) => `${station.patientAnchor.x},${station.patientAnchor.y}`)).size).toBe(8);
    expect(recovery.sharedStaffAnchor).toEqual({ x: 3, y: 3 });
    expect(recovery.careStations!.some((station) =>
      station.patientAnchor.x === recovery.sharedStaffAnchor!.x && station.patientAnchor.y === recovery.sharedStaffAnchor!.y,
    )).toBe(false);
  });

  it("keeps dynamic solid ownership disjoint and records no solid backing-owned fixtures", () => {
    for (const contract of Object.values(APPROVED_ROOM_NAVIGATION_CONTRACTS)) {
      const ownerByTile = new Map<string, string>();
      for (const fixture of contract.solidFixtures) {
        if (!fixture.hiddenByDoorSlots) continue;
        for (const tile of fixture.blockedTiles) {
          const key = `${tile.x},${tile.y}`;
          expect(ownerByTile.has(key), `${contract.roomDefinitionId} ${key}`).toBe(false);
          ownerByTile.set(key, fixture.id);
        }
      }
    }
    // Canonical proofs hide only nonblocking decor on backed north walls.
    // Every solid dynamic fixture is door-owned explicitly above.
    expect(
      Object.values(APPROVED_ROOM_NAVIGATION_CONTRACTS)
        .flatMap((contract) => contract.solidFixtures)
        .some((fixture) => "hiddenByBackingSlots" in fixture),
    ).toBe(false);
  });
});
