import { describe, expect, it } from "vitest";

import {
  APPROVED_ROOM_NAVIGATION_CONTRACTS,
  getApprovedRoomNavigation,
} from "./approved-room-layouts";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("approved proof navigation contract", () => {
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

  it("covers all sixteen approved rooms and resolves the same navigation used by balance", () => {
    expect(Object.keys(APPROVED_ROOM_NAVIGATION_CONTRACTS)).toHaveLength(16);
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
