import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("Build Mode view models", () => {
  it("describes upgrade effects and door positions in player language", () => {
    const initial = createInitialGameState();
    initial.cash = 1_000;
    initial.cashCents = 100_000;
    const state = gameReducer(initial, {
      type: "PLACE_ROOM",
      operationId: "test.place.exam",
      roomId: "room.test.exam",
      roomDefinitionId: "room.examination",
      x: 33,
      y: 26,
    });

    const view = createPrototypePlayerView(
      state,
      null,
      false,
      null,
      true,
      "room.test.exam",
    );

    expect(
      view.facility.rooms.find(
        (room) => room.instanceId === "room.test.exam",
      )?.upgradeAvailable,
    ).toBe(true);
    expect(view.selectedRoomBuild).toMatchObject({
      upgradeLevel: 1,
      nextUpgradeLevel: 2,
      upgradeCostLabel: "$90",
    });
    expect(view.selectedRoomBuild?.upgradeImprovements).toEqual(
      expect.arrayContaining([
        "Room finish and fixed fixtures advance to Level 2.",
        "Routine workload capacity +1.",
        "Room service time 5% faster.",
        "Hourly upkeep +$1.",
      ]),
    );
    expect(
      view.selectedRoomBuild?.doorSlots.every(
        (slot) => !slot.label.includes("/"),
      ),
    ).toBe(true);
    expect(
      view.selectedRoomBuild?.doorSlots.some((slot) =>
        /wall · (left|center|right|top|middle|bottom)$/.test(
          slot.label,
        ),
      ),
    ).toBe(true);
  });
});
