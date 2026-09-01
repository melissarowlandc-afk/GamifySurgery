import { describe, expect, it } from "vitest";
import {
  getRoomVisualLayout,
  getRoomVisualOrientation,
  getApprovedPlacementOrientations,
  getOrientedDoorClearZones,
  isRoomVisualDoorSlotClear,
  ADVANCED_ROOM_VISUAL_IDS,
  PRIMARY_ROOM_VISUAL_IDS,
  shouldRenderWorldNorthWallDecor,
  transformRoomLocalFixture,
} from "./roomVisualLayout";

describe("room visual layout", () => {
  const fixture = {
    centerXRatio: 0.2,
    centerYRatio: 0.7,
    widthRatio: 0.3,
    heightRatio: 0.1,
  };

  it("rotates grounded fixture positions and spans through 0 and 90 degrees", () => {
    expect(transformRoomLocalFixture(fixture, 0)).toEqual(fixture);
    expect(transformRoomLocalFixture(fixture, 90)).toMatchObject({
      centerYRatio: 0.2,
      widthRatio: 0.1,
      heightRatio: 0.3,
    });
    expect(transformRoomLocalFixture(fixture, 90).centerXRatio).toBeCloseTo(
      0.3,
    );
  });

  it("defensively renders legacy 180 and 270 degree orientations", () => {
    expect(transformRoomLocalFixture(fixture, 180)).toMatchObject({
      centerXRatio: 0.8,
      widthRatio: 0.3,
      heightRatio: 0.1,
    });
    expect(transformRoomLocalFixture(fixture, 180).centerYRatio).toBeCloseTo(
      0.3,
    );
    expect(transformRoomLocalFixture(fixture, 270)).toMatchObject({
      centerYRatio: 0.8,
      widthRatio: 0.1,
      heightRatio: 0.3,
    });
    expect(transformRoomLocalFixture(fixture, 270).centerXRatio).toBeCloseTo(
      0.7,
    );
  });

  it("keeps fixed room furniture in its approved presentation orientation", () => {
    const frontDesk = getRoomVisualLayout("room.front_desk");
    expect(getRoomVisualOrientation(frontDesk, 90)).toBe(0);
    expect(frontDesk.doorClearZones).toHaveLength(4);
    expect(new Set(frontDesk.doorClearZones.map((zone) => zone.side))).toEqual(
      new Set(["north", "east", "south", "west"]),
    );
  });

  it("keeps an eligible integer door candidate on every wall of the exact 5x4 Front Desk", () => {
    for (const side of ["north", "east", "south", "west"] as const) {
      const wallLength = side === "north" || side === "south" ? 5 : 4;
      const eligibleOffsets = Array.from({ length: wallLength }, (_, offset) =>
        isRoomVisualDoorSlotClear({
          definitionId: "room.front_desk",
          orientation: 0,
          width: 5,
          height: 4,
          side,
          offset,
        }),
      );
      expect(eligibleOffsets).toContain(true);
    }
  });

  it("declares all four fixture-clear wall zones for the primary room slice", () => {
    for (const definitionId of PRIMARY_ROOM_VISUAL_IDS) {
      const layout = getRoomVisualLayout(definitionId);
      expect(new Set(layout.doorClearZones.map((zone) => zone.side))).toEqual(
        new Set(["north", "east", "south", "west"]),
      );
    }
    expect(getRoomVisualLayout("room.examination").approvedOrientations).toEqual(
      [0, 90],
    );
    expect(getRoomVisualLayout("room.xray").fixedFurnitureOrientation).toBe(
      true,
    );
  });

  it("keeps known primary-room furniture conflicts out of door candidate zones", () => {
    const zone = (roomId: string, side: string) =>
      getRoomVisualLayout(roomId).doorClearZones.find(
        (candidate) => candidate.side === side,
      )!;
    expect(zone("room.waiting", "north").offsetRatio).toBeLessThan(0.2);
    expect(zone("room.waiting", "south").offsetRatio).toBeLessThan(0.2);
    expect(zone("room.bathroom", "north").offsetRatio).toBeGreaterThan(0.5);
    expect(zone("room.bathroom", "south").offsetRatio).toBeLessThan(0.25);
    expect(zone("room.xray", "south").offsetRatio).toBeGreaterThan(0.4);
    expect(zone("room.xray", "west").offsetRatio).toBeGreaterThan(0.7);
    expect(
      zone("room.imaging_control", "north").offsetRatio,
    ).toBeLessThan(0.1);
  });

  it("declares every advanced room's clear door walls and supported orientations", () => {
    for (const definitionId of ADVANCED_ROOM_VISUAL_IDS) {
      const layout = getRoomVisualLayout(definitionId);
      expect(new Set(layout.doorClearZones.map((zone) => zone.side))).toEqual(
        new Set(["north", "east", "south", "west"]),
      );
    }
    for (const definitionId of [
      "room.minor_procedure",
      "room.ultrasound",
      "room.ct",
      "room.evs_closet",
      "room.training",
      "room.coffee_kiosk",
    ]) {
      expect(getRoomVisualLayout(definitionId).approvedOrientations).toEqual([
        0,
      ]);
    }
    for (const definitionId of [
      "room.phlebotomy",
      "room.endoscopy",
      "room.periop_recovery",
      "room.glp1_telehealth_suite",
    ]) {
      expect(getRoomVisualLayout(definitionId).approvedOrientations).toEqual([
        0,
        90,
      ]);
    }
  });

  it("keeps imaging and procedure candidates away from their central equipment approaches", () => {
    const zone = (roomId: string, side: string) =>
      getRoomVisualLayout(roomId).doorClearZones.find(
        (candidate) => candidate.side === side,
      )!;
    expect(zone("room.ultrasound", "east").offsetRatio).toBeGreaterThan(0.7);
    expect(zone("room.ct", "north").offsetRatio).toBeGreaterThan(0.7);
    expect(zone("room.ct", "west").offsetRatio).toBeGreaterThan(0.7);
    expect(
      zone("room.minor_procedure", "north").offsetRatio,
    ).toBeLessThan(0.1);
    expect(zone("room.endoscopy", "east").offsetRatio).toBeGreaterThan(0.7);
  });

  it("keeps wall decor on the exposed world-north wall or suppresses it", () => {
    expect(
      shouldRenderWorldNorthWallDecor(
        { binding: "world-north", minimumExposedRunTiles: 2 },
        2,
      ),
    ).toBe(true);
    expect(
      shouldRenderWorldNorthWallDecor(
        { binding: "world-north", minimumExposedRunTiles: 2 },
        1,
      ),
    ).toBe(false);
  });

  it("rotates authored door-clear spans with a supported room orientation", () => {
    const base = getRoomVisualLayout("room.examination").doorClearZones.find(
      (zone) => zone.side === "north",
    )!;
    const rotated = getOrientedDoorClearZones("room.examination", 90).find(
      (zone) => zone.side === "east",
    )!;
    expect(rotated.offsetRatio).toBe(base.offsetRatio);
    expect(rotated.lengthRatio).toBe(base.lengthRatio);

    const east = getRoomVisualLayout("room.examination").doorClearZones.find(
      (zone) => zone.side === "east",
    )!;
    const rotatedSouth = getOrientedDoorClearZones("room.examination", 90).find(
      (zone) => zone.side === "south",
    )!;
    expect(rotatedSouth.offsetRatio).toBeCloseTo(
      1 - east.offsetRatio - east.lengthRatio,
    );
  });

  it("filters new door previews to domain-enabled slots inside authored spans without affecting legacy doors", () => {
    expect(
      isRoomVisualDoorSlotClear({
        definitionId: "room.waiting",
        orientation: 0,
        width: 4,
        height: 4,
        side: "north",
        offset: 0,
      }),
    ).toBe(true);
    expect(
      isRoomVisualDoorSlotClear({
        definitionId: "room.waiting",
        orientation: 0,
        width: 4,
        height: 4,
        side: "north",
        offset: 2,
      }),
    ).toBe(false);
    // A persisted legacy orientation still maps clear zones deterministically.
    expect(getOrientedDoorClearZones("room.examination", 270)).toHaveLength(4);
    expect(
      isRoomVisualDoorSlotClear({
        definitionId: "room.examination",
        orientation: 0,
        width: 3,
        height: 2,
        side: "south",
        offset: 1,
      }),
    ).toBe(true);
    expect(
      isRoomVisualDoorSlotClear({
        definitionId: "room.xray",
        orientation: 0,
        width: 3,
        height: 3,
        side: "east",
        offset: 1,
      }),
    ).toBe(true);
  });

  it("keeps at least one fixture-clear candidate on every Examination Room wall in both authored footprints", () => {
    for (const [orientation, width, height] of [
      [0, 3, 2],
      [90, 2, 3],
    ] as const) {
      for (const side of ["north", "east", "south", "west"] as const) {
        const wallLength = side === "north" || side === "south" ? width : height;
        expect(
          Array.from({ length: wallLength }, (_, offset) =>
            isRoomVisualDoorSlotClear({
              definitionId: "room.examination",
              orientation,
              width,
              height,
              side,
              offset,
            }),
          ),
        ).toContain(true);
      }
    }
  });

  it("only offers fixed or approved 0/90 placement orientations", () => {
    expect(getApprovedPlacementOrientations("room.xray")).toEqual([0]);
    expect(getApprovedPlacementOrientations("room.examination")).toEqual([0, 90]);
    expect(getApprovedPlacementOrientations("room.hallway")).toEqual([0]);
  });
});
