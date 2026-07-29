import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getOperatingExpensePerFacilityHour,
  serializeGameState,
  type GameState,
} from "../src";

function advanceMinute(state: GameState, id: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: id,
  });
}

describe("persistent advertising", () => {
  it("changes the persisted tier, recurring hourly cost, and future arrival interval", () => {
    const initial = createInitialGameState(undefined, {
      campaignSeed: "advertising-levels",
    });
    initial.facilityLevel = 1;
    initial.routineArrivalSequence = 2;
    initial.nextRoutineArrivalTick = initial.facilityTick + 100;

    const off = gameReducer(initial, {
      type: "SET_ADVERTISING_LEVEL",
      operationId: "advertising.off",
      level: 0,
    });
    const advertised = gameReducer(initial, {
      type: "SET_ADVERTISING_LEVEL",
      operationId: "advertising.level-three",
      level: 3,
    });

    expect(advertised.advertisingLevel).toBe(3);
    expect(advertised.nextRoutineArrivalTick).toBeLessThan(
      off.nextRoutineArrivalTick,
    );
    expect(getOperatingExpensePerFacilityHour(advertised)).toBe(
      getOperatingExpensePerFacilityHour(off) -
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.advertising.levels[3]!
          .hourlyCost,
    );

    const restored = deserializeGameState(serializeGameState(advertised));
    expect(restored.advertisingLevel).toBe(3);
    expect(restored.nextRoutineArrivalTick).toBe(
      advertised.nextRoutineArrivalTick,
    );
  });

  it("rejects unknown tiers without changing the active setting", () => {
    const initial = createInitialGameState();
    const rejected = gameReducer(initial, {
      type: "SET_ADVERTISING_LEVEL",
      operationId: "advertising.invalid",
      level: 99,
    });

    expect(rejected.advertisingLevel).toBe(0);
    expect(rejected.operationReceipts["advertising.invalid"]).toMatchObject({
      status: "rejected",
    });
  });
});

describe("zero-cash operations", () => {
  it("posts only available cash and never creates a negative balance", () => {
    const state = createInitialGameState();
    state.cashCents = 1;
    state.cash = 0.01;
    state.nextFinancialPostingTick = 1;

    const next = advanceMinute(state, "insolvency.cash-floor");

    expect(next.cashCents).toBe(0);
    expect(next.cash).toBe(0);
    expect(next.events.some((event) => event.type === "operating_expense")).toBe(
      true,
    );
  });

  it("reduces morale on unpaid postings and removes staff at the quitting threshold", () => {
    let state = createInitialGameState();
    state.facilityLevel = 1;
    state.cashCents = 500_000;
    state.cash = 5_000;
    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "insolvency.hire",
      employeeId: "employee.insolvency",
      staffRoleDefinitionId: "staff.receptionist",
    });
    expect(state.employees).toHaveLength(1);

    state.cashCents = 0;
    state.cash = 0;
    state.employees[0]!.morale = 50;
    state.nextFinancialPostingTick = state.facilityTick + 1;

    let next = advanceMinute(state, "insolvency.unpaid-posting");

    expect(next.employees[0]?.morale).toBe(
      50 -
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.insolvency
          .moraleDecayPerPosting,
    );
    next.employees[0]!.morale =
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.insolvency
        .employeeQuittingThreshold + 3;
    next.nextFinancialPostingTick = next.facilityTick + 1;
    next = advanceMinute(next, "insolvency.quitting-posting");

    expect(next.cash).toBe(0);
    expect(next.employees).toHaveLength(0);
    expect(next.events).toContainEqual(
      expect.objectContaining({
        type: "staff_quit",
        target: { kind: "campaign", id: next.campaignId },
      }),
    );
  });
});
