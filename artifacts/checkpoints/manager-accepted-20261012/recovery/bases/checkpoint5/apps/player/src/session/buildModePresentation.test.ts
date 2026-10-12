import { describe, expect, it } from "vitest";
import {
  describeBuildUndoAction,
  describeRoomUpgradeBenefit,
  letteredRoomNames,
  roomBuildCategory,
  roomBuildSortKey,
} from "./buildModePresentation";

const names: Record<string, string> = {
  "room.waiting": "Waiting Room",
  "room.examination": "Examination Room",
  "room.front_desk": "Front Desk",
};
const displayNameOf = (id: string) => names[id] ?? id;

describe("Build Mode room lettering", () => {
  it("letters same-type rooms in build order only while two or more exist", () => {
    const lettered = letteredRoomNames(
      [
        { id: "a", roomDefinitionId: "room.front_desk" },
        { id: "b", roomDefinitionId: "room.waiting" },
        { id: "c", roomDefinitionId: "room.examination" },
        { id: "d", roomDefinitionId: "room.waiting" },
      ],
      displayNameOf,
    );
    expect(lettered.get("a")).toBe("Front Desk");
    expect(lettered.get("b")).toBe("Waiting Room A");
    expect(lettered.get("d")).toBe("Waiting Room B");
    expect(lettered.get("c")).toBe("Examination Room");
  });

  it("closes letters up after a sale", () => {
    const afterSale = letteredRoomNames(
      [
        { id: "b", roomDefinitionId: "room.waiting" },
        { id: "e", roomDefinitionId: "room.waiting" },
      ],
      displayNameOf,
    );
    expect(afterSale.get("b")).toBe("Waiting Room A");
    expect(afterSale.get("e")).toBe("Waiting Room B");
    const lone = letteredRoomNames(
      [{ id: "e", roomDefinitionId: "room.waiting" }],
      displayNameOf,
    );
    expect(lone.get("e")).toBe("Waiting Room");
  });

  it("orders rooms by group, then catalog order", () => {
    expect(roomBuildCategory("room.bathroom")).toBe("patient");
    expect(roomBuildCategory("room.ct")).toBe("diagnostics");
    expect(roomBuildCategory("room.ambulatory_or")).toBe("procedures");
    expect(roomBuildCategory("room.coffee_kiosk")).toBe("support");
    expect(roomBuildCategory("room.pharmacy")).toBe("services");
    expect(roomBuildSortKey("room.waiting")).toBeLessThan(roomBuildSortKey("room.examination"));
    expect(roomBuildSortKey("room.bathroom")).toBeLessThan(roomBuildSortKey("room.xray"));
    expect(roomBuildSortKey("room.ambulatory_or")).toBeLessThan(roomBuildSortKey("room.training"));
  });
});

describe("Build Mode upgrade benefit text", () => {
  const base = {
    roomDefinitionId: "room.waiting",
    maxUpgradeLevel: 5,
    upkeepPerLevel: 2,
  };

  it("describes the used room's satisfaction points with current and next totals", () => {
    const benefit = describeRoomUpgradeBenefit({
      ...base,
      upgradeLevel: 2,
    })!;
    expect(benefit.perUpgradeLabel).toBe("+2 satisfaction points for waiting patients");
    expect(benefit.currentLabel).toBe("+2 points");
    expect(benefit.nextLabel).toBe("+4 points");
    expect(benefit.totalCaption).toBeUndefined();
    expect(benefit.note).toBeUndefined();
    expect(benefit.upkeepLabel).toBe("Upkeep +$2/hr");
  });

  it("starts at Baseline and has no clinic-wide cap", () => {
    const benefit = describeRoomUpgradeBenefit({
      ...base,
      upgradeLevel: 1,
    })!;
    expect(benefit.currentLabel).toBe("Baseline");
    expect(benefit.nextLabel).toBe("+2 points");
    expect(describeRoomUpgradeBenefit({ ...base, upgradeLevel: 4 })?.currentLabel).toBe("+6 points");
  });

  it("omits the next total at maximum level", () => {
    const benefit = describeRoomUpgradeBenefit({
      ...base,
      upgradeLevel: 5,
    })!;
    expect(benefit.currentLabel).toBe("+8 points");
    expect(benefit.nextLabel).toBeUndefined();
    expect(benefit.upkeepLabel).toBe("Upkeep +$8/hr from upgrades");
  });

  it.each([
    ["room.examination", "+2 satisfaction points after examination", "+6 points", "+8 points"],
    ["room.laboratory", "+6% paid laboratory-processing revenue", "+18%", "+24%"],
    ["room.reading", "Scan reading takes 10% less time", "30% less time", "40% less time"],
    ["room.bathroom", "10% slower cleanliness loss", "30% slower loss", "40% slower loss"],
    ["room.coffee_kiosk", "+1 staff morale point from daily coffee", "+3 points", "+4 points"],
    ["room.staff_break", "+2 staff morale points per break", "+6 points", "+8 points"],
  ])("describes the approved scope for %s", (roomDefinitionId, perUpgradeLabel, currentLabel, nextLabel) => {
    expect(describeRoomUpgradeBenefit({ ...base, roomDefinitionId, upgradeLevel: 4 })).toMatchObject({
      perUpgradeLabel, currentLabel, nextLabel,
    });
  });

  it.each(["room.front_desk", "room.hallway", "room.imaging_control", "room.founder_office", "room.unknown"])(
    "does not offer a benefit for non-purchasable %s", (roomDefinitionId) => {
      expect(describeRoomUpgradeBenefit({ ...base, roomDefinitionId, upgradeLevel: 1 })).toBeUndefined();
    },
  );
});

describe("Build Mode undo label", () => {
  const rooms = [
    { id: "w1", roomDefinitionId: "room.waiting" },
    { id: "w2", roomDefinitionId: "room.waiting" },
  ];
  it("labels the clinic tray's reversible cash changes clearly", () => {
    expect(describeBuildUndoAction({ cash: 500, rooms }, { cash: 320, rooms }, { type: "HIRE_STAFF" }, displayNameOf)).toBe("Hire staff (+$180 back)");
    expect(describeBuildUndoAction({ cash: 10, rooms }, { cash: 60, rooms }, { type: "RUN_EMERGENCY_GLP1_CONSULTATION" }, displayNameOf)).toBe("Emergency consult (−$50)");
    expect(describeBuildUndoAction({ cash: 500, rooms }, { cash: 500, rooms }, { type: "SET_ADVERTISING_LEVEL" }, displayNameOf)).toBe("Change advertising");
  });

  it("names upgrades with the money Undo returns", () => {
    expect(
      describeBuildUndoAction(
        { cash: 500, rooms },
        { cash: 330, rooms },
        { type: "UPGRADE_ROOM", roomId: "w2" },
        displayNameOf,
      ),
    ).toBe("Upgrade Waiting Room B (+$170 back)");
  });

  it("names sales with the refund Undo takes back", () => {
    expect(
      describeBuildUndoAction(
        { cash: 100, rooms },
        { cash: 275, rooms: rooms.slice(1) },
        { type: "SELL_ROOM", roomId: "w1" },
        displayNameOf,
      ),
    ).toBe("Sell Waiting Room A (−$175)");
  });

  it("names free door changes without money", () => {
    expect(
      describeBuildUndoAction(
        { cash: 100, rooms },
        { cash: 100, rooms },
        { type: "PLACE_DOOR" },
        displayNameOf,
      ),
    ).toBe("Add door");
  });
});
