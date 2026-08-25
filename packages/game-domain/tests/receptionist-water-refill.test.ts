import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  type GameState,
} from "../src";

function preparedState(options?: {
  facilityTick?: number;
  emptySinceTick?: number;
  hiredAtFacilityTick?: number;
}): GameState {
  const facilityTick = options?.facilityTick ?? 100;
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.receptionist-water-refill",
    campaignSeed: "receptionist-water-refill",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.facilityTick = facilityTick;
  state.encounters = {};
  state.nextRoutineArrivalTick = 100_000;
  state.nextFinancialPostingTick = 100_000;
  state.environment.nextLitterSpawnTick = 100_000;
  state.environment.nextWaterCoolerDrainTick = 100_000;
  state.environment.waterCoolerFillPercent = 0;
  state.environment.waterCoolerEmptySinceTick =
    options?.emptySinceTick ?? facilityTick;
  state.environment.nextWaterCoolerReminderTick = 100_000;

  const location = { ...state.environment.founderLocation };
  state.employees.push({
    id: "employee.receptionist",
    staffRoleDefinitionId: "staff.receptionist",
    displayName: "Morgan",
    appearance: state.founder.appearance,
    hiredAtFacilityTick:
      options?.hiredAtFacilityTick ?? 0,
    salaryPerExpenseInterval: 18,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId: "room.instance.founder_desk",
    location,
    path: [location],
    pathIndex: 0,
    lastMovedAtFacilityTick: facilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 100_000,
    facilityTask: null,
  });
  return state;
}

let operationSequence = 0;

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `water-refill.tick.${operationSequence++}`,
    });
  }
  return next;
}

describe("receptionist water-cooler work", () => {
  it("waits one full facility hour, pauses with the simulation, then refills", () => {
    let state = preparedState();

    state = advance(state, 59);
    expect(state.facilityTick).toBe(159);
    expect(state.environment.waterCoolerFillPercent).toBe(0);
    expect(state.employees[0]!.facilityTask).toBeNull();

    state.paused = true;
    state = advance(state, 1);
    expect(state.facilityTick).toBe(159);
    expect(state.employees[0]!.facilityTask).toBeNull();

    state.paused = false;
    state = advance(state, 1);
    expect(state.facilityTick).toBe(160);
    expect(state.employees[0]!.facilityTask).toMatchObject({
      kind: "refill_water",
      startedAtFacilityTick: 160,
      workMinutesRemaining: 1,
    });
    expect(state.environment.waterCoolerFillPercent).toBe(0);

    state = advance(state, 1);
    expect(state.environment.waterCoolerFillPercent).toBe(100);
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("starts the hour from hiring when the cooler was already empty", () => {
    let state = preparedState({
      facilityTick: 100,
      emptySinceTick: 0,
      hiredAtFacilityTick: 100,
    });

    state = advance(state, 59);
    expect(state.employees[0]!.facilityTask).toBeNull();

    state = advance(state, 1);
    expect(state.employees[0]!.facilityTask).toMatchObject({
      kind: "refill_water",
      startedAtFacilityTick: 160,
    });
  });

  it("persists an in-progress refill and prevents a duplicate founder action", () => {
    let state = advance(preparedState(), 60);
    expect(state.employees[0]!.facilityTask?.kind).toBe("refill_water");

    state = gameReducer(state, {
      type: "REFILL_WATER_COOLER",
      operationId: "water-refill.manual-while-receptionist-active",
    });
    expect(
      state.operationReceipts[
        "water-refill.manual-while-receptionist-active"
      ],
    ).toMatchObject({
      status: "rejected",
      message: "The receptionist is already refilling the water cooler.",
    });

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees[0]!.facilityTask).toMatchObject({
      kind: "refill_water",
      startedAtFacilityTick: 160,
      workMinutesRemaining: 1,
    });

    const completed = advance(restored, 1);
    expect(completed.environment.waterCoolerFillPercent).toBe(100);
    expect(completed.employees[0]!.facilityTask).toBeNull();
  });
});
