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
    maxUpgradeLevel: 5,
    satisfactionPerLevel: 1,
    satisfactionCap: 3,
    upkeepPerLevel: 2,
  };

  it("describes the shared satisfaction bonus with now and next totals", () => {
    const benefit = describeRoomUpgradeBenefit({
      ...base,
      upgradeLevel: 2,
      clinicSatisfactionTotal: 1,
    });
    expect(benefit.perUpgradeLabel).toBe("+1 patient satisfaction per completed visit");
    expect(benefit.totalCaption).toBe("Clinic total");
    expect(benefit.currentLabel).toBe("+1");
    expect(benefit.nextLabel).toBe("+2");
    expect(benefit.note).toBe("Shared by all rooms, up to +3 for the clinic.");
    expect(benefit.upkeepLabel).toBe("Upkeep +$2/hr");
  });

  it("warns when the clinic already has the full shared bonus", () => {
    const benefit = describeRoomUpgradeBenefit({
      ...base,
      upgradeLevel: 2,
      clinicSatisfactionTotal: 5,
    });
    expect(benefit.currentLabel).toBe("+3");
    expect(benefit.nextLabel).toBeUndefined();
    expect(benefit.note).toContain("adds no satisfaction for now");
  });

  it("omits the next total at maximum level", () => {
    const benefit = describeRoomUpgradeBenefit({
      ...base,
      upgradeLevel: 5,
      clinicSatisfactionTotal: 3,
    });
    expect(benefit.nextLabel).toBeUndefined();
    expect(benefit.upkeepLabel).toBe("Upkeep +$8/hr from upgrades");
  });
});

describe("Build Mode undo label", () => {
  const rooms = [
    { id: "w1", roomDefinitionId: "room.waiting" },
    { id: "w2", roomDefinitionId: "room.waiting" },
  ];

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
