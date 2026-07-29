import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("economy player view models", () => {
  it("shows low-cash GLP-1 availability as an hourly-only cooldown", () => {
    const state = createInitialGameState();
    const view = createPrototypePlayerView(state, null, false, null);

    expect(view.emergencyGlp1).toMatchObject({
      visible: true,
      enabled: true,
      paymentLabel: "+$25",
      cooldownLabel: "Hourly consult ready",
    });
    expect(JSON.stringify(view.emergencyGlp1)).not.toContain("daily");

    state.cash = 500;
    state.cashCents = 50_000;
    expect(
      createPrototypePlayerView(state, null, false, null).emergencyGlp1.visible,
    ).toBe(false);
  });

  it("presents the current advertising tier and every centralized option", () => {
    const state = createInitialGameState();
    state.advertisingLevel = 2;

    const advertising = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).advertising;

    expect(advertising).toMatchObject({
      currentLevel: 2,
      currentDisplayName: "Neighborhood ads",
      hourlyCostLabel: "$8/hr",
      canDecrease: true,
      canIncrease: true,
    });
    expect(advertising.levels).toHaveLength(4);
    expect(advertising.levels.filter((level) => level.selected)).toEqual([
      expect.objectContaining({ level: 2 }),
    ]);
  });
});
