import { createInitialGameState } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";

import {
  FRONT_DESK_PRESENTATION,
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

  it("declares the isolated baseline room without a rug or visitor chair", () => {
    expect(FRONT_DESK_PRESENTATION.footprint).toEqual({ width: 5, height: 4 });
    expect(FRONT_DESK_PRESENTATION.orientation).toBe(0);
    expect(FRONT_DESK_PRESENTATION.fixtures.map((fixture) => fixture.id)).toEqual([
      "filingCabinet",
      "secretaryChair",
      "frontDesk",
      "wasteBin",
    ]);
    const fixtureIds: readonly string[] = FRONT_DESK_PRESENTATION.fixtures.map(
      (fixture) => fixture.id,
    );
    expect(fixtureIds).not.toContain("floorRug");
    expect(fixtureIds).not.toContain("visitorChair");
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
    ).toMatchObject({ width: 0.52, height: 0.35 });
  });

  it("keeps logical tiles separate from grounded visual contact envelopes", () => {
    const cabinet = FRONT_DESK_PRESENTATION.fixtures.find(
      (fixture) => fixture.id === "filingCabinet",
    );
    expect(cabinet).toMatchObject({
      contact: { x: 0.12, y: 0.26 },
      width: 0.27,
      height: 0.5,
    });
    expect(FRONT_DESK_PRESENTATION.grid.cabinet).toEqual({ x: 0, y: 0 });
    expect(FRONT_DESK_PRESENTATION.waterCooler).toEqual({
      footprint: { x: 4, y: 0 },
      contact: { x: 0.84, y: 0.26 },
      widthInTiles: 0.72,
      heightInTiles: 1.25,
    });
    expect(FRONT_DESK_PRESENTATION.seatedPresentation.towardCounterTiles)
      .toBeGreaterThan(0);
    expect(
      FRONT_DESK_PRESENTATION.fixtures.find(
        (fixture) => fixture.id === "secretaryChair",
      ),
    ).toMatchObject({ contact: { x: 0.5, y: 0.5 } });
    const bin = FRONT_DESK_PRESENTATION.fixtures.find(
      (fixture) => fixture.id === "wasteBin",
    );
    expect(bin).toMatchObject({ contact: { x: 0.96, y: 0.27 } });
    expect(
      (bin?.contact?.x ?? 0) - FRONT_DESK_PRESENTATION.waterCooler.contact.x,
    ).toBeGreaterThan(0.1);
  });

  it("keeps deterministic worker-counter-public depth ordering", () => {
    const { staffBaseRow, counterContactRow, publicBaseRow } =
      FRONT_DESK_PRESENTATION.depthContract;
    expect(staffBaseRow).toBeLessThan(counterContactRow);
    expect(counterContactRow).toBeLessThan(publicBaseRow);
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
