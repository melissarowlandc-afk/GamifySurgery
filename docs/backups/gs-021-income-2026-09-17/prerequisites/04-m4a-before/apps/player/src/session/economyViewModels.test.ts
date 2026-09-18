import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("economy player view models", () => {
  it("keeps the GLP-1 control available until a suite is operationally staffed", () => {
    const state = createInitialGameState();
    const view = createPrototypePlayerView(state, null, false, null);

    expect(view.emergencyGlp1).toMatchObject({
      visible: true,
      enabled: true,
      paymentLabel: "+$50",
      statusLabel: "Ready now; one consult per facility hour.",
    });
    expect(JSON.stringify(view.emergencyGlp1)).not.toContain("daily");

    state.cash = 500;
    state.cashCents = 50_000;
    const highCashView = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).emergencyGlp1;
    expect(highCashView).toMatchObject({
      visible: true,
      enabled: true,
      statusLabel: "Ready now; one consult per facility hour.",
    });
    expect(JSON.stringify(highCashView)).not.toContain(
      "Available below",
    );

    state.rooms.push({
      ...state.rooms[0]!,
      id: "room.instance.glp1.telehealth",
      roomDefinitionId:
        "room.glp1_telehealth_suite",
    });
    expect(
      createPrototypePlayerView(state, null, false, null).emergencyGlp1
        .visible,
    ).toBe(true);
  });

  it("presents the current centralized advertising tier", () => {
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
      arrivalFrequencyLabel: "+19% arrival frequency",
      canDecrease: true,
      canIncrease: true,
    });
  });

  it("projects durable income receipts for display without recalculating their cash", () => {
    const state = createInitialGameState();
    const cashBeforeProjection = state.cash;
    state.serviceIncomeReceipts = [
      {
        id: "income.glp1.manual.operation.1.0",
        transactionKey: "income.glp1.manual.operation.1",
        incomeLineId: "income.glp1_telehealth",
        catalogVersion: 1,
        routeId: null,
        actorKind: "founder",
        actorId: "founder",
        grossAmount: 50,
        stockCost: 0,
        netCashDelta: 50,
        completedAtFacilityTick: 12,
      },
    ];

    const facility = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility;

    expect(facility.campaignId).toBe(state.campaignId);
    expect(facility.earningsReceipts).toEqual([
      {
        transactionKey: "income.glp1.manual.operation.1",
        actorKind: "founder",
        actorId: "founder",
        grossAmount: 50,
      },
    ]);
    expect(state.cash).toBe(cashBeforeProjection);
  });
});
