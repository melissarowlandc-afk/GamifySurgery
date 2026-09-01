import { createInitialGameState } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";

import {
  FRONT_DESK_PRESENTATION,
  getFrontDeskEntrancePlanterDisplayBounds,
  getFrontDeskV5StationaryActorDisplay,
  shouldRenderEmptyFrontDeskChair,
  shouldRenderFounderSeatedAtFrontDesk,
  shouldRenderReceptionistSeatedAtFrontDesk,
} from "./frontDeskPresentation";

const frontDesk = {
  instanceId: "room.front-desk",
  definitionId: "room.front_desk",
  displayName: "Front Desk",
  tileX: 8,
  tileY: 4,
  width: 5,
  height: 4,
  isFounderRoom: true,
} as const;

describe("Front Desk founder presentation", () => {
  it("keeps the starter room's sole baseline door as the protected south entrance", () => {
    const state = createInitialGameState();
    const frontDesk = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    );
    expect(frontDesk).toBeDefined();
    const frontDeskDoors = state.doors.filter(
      (door) => door.roomId === frontDesk?.id,
    );
    expect(frontDeskDoors).toEqual([
      expect.objectContaining({
        id: "door.instance.front_entrance",
        side: "south",
        offset: 2,
        exterior: true,
      }),
    ]);
  });

  it("declares the target's isolated baseline room with its southeast visitor chair", () => {
    expect(FRONT_DESK_PRESENTATION.footprint).toEqual({ width: 5, height: 4 });
    expect(FRONT_DESK_PRESENTATION.orientation).toBe(0);
    expect(FRONT_DESK_PRESENTATION.fixtures.map((fixture) => fixture.id)).toEqual([
      "filingCabinet",
      "secretaryChair",
      "frontDesk",
      "wasteBin",
      "visitorChair",
    ]);
    const fixtureIds: readonly string[] = FRONT_DESK_PRESENTATION.fixtures.map(
      (fixture) => fixture.id,
    );
    expect(fixtureIds).not.toContain("floorRug");
    expect(fixtureIds).toContain("visitorChair");
    expect(FRONT_DESK_PRESENTATION.entrancePlanters).toHaveLength(2);
    expect(FRONT_DESK_PRESENTATION.grid).toMatchObject({
      cabinet: { x: 0, y: 0 },
      cooler: { x: 4, y: 0 },
      coolerApproach: { x: 4, y: 1 },
      staff: { x: 2, y: 1 },
      counter: { x: 2, y: 2 },
      public: { x: 2, y: 3 },
    });
    expect(
      FRONT_DESK_PRESENTATION.fixtures.find(
        (fixture) => fixture.id === "frontDesk",
      ),
    ).toMatchObject({ x: 0.34, width: 0.45, height: 0.38, contact: { x: 0.34, y: 0.7 } });
  });

  it("keeps both declarative entrance beds in the rear sidewalk band and out of the front walk lane", () => {
    const centeredEntrance = { left: 2, top: 0, right: 3, bottom: 1 };
    const frontWalkLaneTop = 0.62;
    expect(FRONT_DESK_PRESENTATION.entrancePlanters.map((planter) => planter.side))
      .toEqual(["west", "east"]);

    for (const planter of FRONT_DESK_PRESENTATION.entrancePlanters) {
      const displayBounds = getFrontDeskEntrancePlanterDisplayBounds(planter);
      expect(displayBounds).toHaveLength(1 + planter.bloomAccents.length);
      for (const bounds of displayBounds) {
        expect(bounds.left).toBeGreaterThanOrEqual(0);
        expect(bounds.right).toBeLessThanOrEqual(
          FRONT_DESK_PRESENTATION.footprint.width,
        );
        expect(bounds.top).toBeGreaterThanOrEqual(0);
        expect(bounds.bottom).toBeLessThanOrEqual(frontWalkLaneTop);
        expect(
          bounds.right <= centeredEntrance.left || bounds.left >= centeredEntrance.right,
        ).toBe(true);
      }
    }
  });

  it("keeps logical tiles separate from grounded visual contact envelopes", () => {
    const cabinet = FRONT_DESK_PRESENTATION.fixtures.find(
      (fixture) => fixture.id === "filingCabinet",
    );
    expect(cabinet).toMatchObject({
      contact: { x: 0.08, y: 0.31 },
      width: 0.22,
      height: 0.5,
    });
    expect(FRONT_DESK_PRESENTATION.grid.cabinet).toEqual({ x: 0, y: 0 });
    expect(FRONT_DESK_PRESENTATION.waterCooler).toEqual({
      footprint: { x: 4, y: 0 },
      contact: { x: 0.83, y: 0.31 },
      widthInTiles: 0.66,
      heightInTiles: 1.14,
    });
    expect(FRONT_DESK_PRESENTATION.seatedPresentation.towardCounterTiles)
      .toBeGreaterThan(0);
    expect(
      FRONT_DESK_PRESENTATION.fixtures.find(
        (fixture) => fixture.id === "secretaryChair",
      ),
    ).toMatchObject({ contact: { x: 0.29, y: 0.53 } });
    const bin = FRONT_DESK_PRESENTATION.fixtures.find(
      (fixture) => fixture.id === "wasteBin",
    );
    expect(bin).toMatchObject({ contact: { x: 0.94, y: 0.31 } });
    expect(
      (bin?.contact?.x ?? 0) - FRONT_DESK_PRESENTATION.waterCooler.contact.x,
    ).toBeGreaterThan(0.1);
  });

  it("keeps target wall decor, actor contacts, and one visual door candidate on every wall", () => {
    expect(FRONT_DESK_PRESENTATION.northWallFixtures).toEqual([
      expect.objectContaining({ id: "noticeBoard", x: 0.19 }),
      expect.objectContaining({ id: "wallClock", x: 0.32 }),
    ]);
    expect(FRONT_DESK_PRESENTATION.v5ActorDisplay).toEqual({
      staff: { x: 0.29, y: 0.53, scale: 0.82 },
      public: { x: 0.62, y: 0.82, scale: 0.82 },
    });
    expect(FRONT_DESK_PRESENTATION.clearDoorCandidates).toEqual({
      north: 2, east: 1, south: 2, west: 3,
    });
  });

  it("keeps deterministic worker-counter-public depth ordering", () => {
    const { staffBaseRow, counterContactRow, publicBaseRow } =
      FRONT_DESK_PRESENTATION.depthContract;
    expect(staffBaseRow).toBeLessThan(counterContactRow);
    expect(counterContactRow).toBeLessThan(publicBaseRow);
  });

  it("moves only stationary actors at Front Desk anchors into target display positions", () => {
    expect(getFrontDeskV5StationaryActorDisplay(
      { x: 10, y: 5 }, false, "staff", [frontDesk],
    )).toEqual({ x: 0.29, y: 0.53, scale: 0.82 });
    expect(getFrontDeskV5StationaryActorDisplay(
      { x: 10, y: 7 }, false, "public", [frontDesk],
    )).toEqual({ x: 0.62, y: 0.82, scale: 0.82 });
    expect(getFrontDeskV5StationaryActorDisplay(
      { x: 10, y: 5 }, true, "staff", [frontDesk],
    )).toBeUndefined();
  });
  it("uses the seated pose only at the stationary staff anchor", () => {
    expect(
      shouldRenderFounderSeatedAtFrontDesk(
        { x: 10, y: 5 },
        false,
        undefined,
        [frontDesk],
      ),
    ).toBe(true);
  });

  it("does not seat a walking founder, active founder, or public-side patient position", () => {
    expect(
      shouldRenderFounderSeatedAtFrontDesk(
        { x: 10, y: 5 },
        true,
        undefined,
        [frontDesk],
      ),
    ).toBe(false);
    expect(
      shouldRenderFounderSeatedAtFrontDesk(
        { x: 10, y: 5 },
        false,
        "Refilling water cooler",
        [frontDesk],
      ),
    ).toBe(false);
    expect(
      shouldRenderFounderSeatedAtFrontDesk(
        { x: 10, y: 7 },
        false,
        undefined,
        [frontDesk],
      ),
    ).toBe(false);
  });

  it("uses the same seated pose for a stationary receptionist at the desk", () => {
    expect(
      shouldRenderReceptionistSeatedAtFrontDesk(
        { x: 10, y: 5 },
        false,
        "staff.receptionist",
        "room.front-desk",
        [frontDesk],
      ),
    ).toBe(true);
    expect(
      shouldRenderReceptionistSeatedAtFrontDesk(
        { x: 10, y: 5 },
        true,
        "staff.receptionist",
        "room.front-desk",
        [frontDesk],
      ),
    ).toBe(false);
    expect(
      shouldRenderReceptionistSeatedAtFrontDesk(
        { x: 10, y: 5 },
        false,
        "staff.imaging_technician",
        "room.front-desk",
        [frontDesk],
      ),
    ).toBe(false);
  });

  it("shows one empty chair only when the Front Desk staff anchor is vacant", () => {
    expect(shouldRenderEmptyFrontDeskChair(
      { location: { x: 9, y: 6 }, moving: false },
      [],
      [frontDesk],
    )).toBe(true);
    expect(shouldRenderEmptyFrontDeskChair(
      { location: { x: 10, y: 5 }, moving: false },
      [],
      [frontDesk],
    )).toBe(false);
    expect(shouldRenderEmptyFrontDeskChair(
      { location: { x: 9, y: 6 }, moving: false },
      [{
        location: { x: 10, y: 5 },
        moving: false,
        staffRoleDefinitionId: "staff.receptionist",
        homeRoomInstanceId: "room.front-desk",
      }],
      [frontDesk],
    )).toBe(false);
  });
});
