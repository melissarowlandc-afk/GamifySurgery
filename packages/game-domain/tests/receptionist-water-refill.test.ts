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
  it("returns an idle receptionist to the Front Desk staff post instead of wandering", () => {
    let state = preparedState();
    state.environment.waterCoolerFillPercent = 100;
    state.environment.waterCoolerEmptySinceTick = null;
    const receptionist = state.employees[0]!;
    const frontDesk = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    )!;
    receptionist.location = { x: frontDesk.x + 4, y: frontDesk.y + 1 };
    receptionist.path = [{ ...receptionist.location }];
    receptionist.pathIndex = 0;

    state = advance(state, 1);
    expect(state.employees[0]!.path.at(-1)).toEqual(
      state.environment.founderLocation,
    );
    state = advance(state, 20);
    expect(state.employees[0]!.location).toEqual(
      state.environment.founderLocation,
    );
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("starts in the next idle desk gap, pauses with the simulation, then refills", () => {
    let state = preparedState();
    state.paused = true;
    state = advance(state, 1);
    expect(state.facilityTick).toBe(100);
    expect(state.employees[0]!.facilityTask).toBeNull();

    state.paused = false;
    state = advance(state, 1);
    expect(state.facilityTick).toBe(101);
    expect(state.employees[0]!.facilityTask).toMatchObject({
      kind: "refill_water",
      startedAtFacilityTick: 101,
      workMinutesRemaining: 2,
    });
    expect(state.environment.waterCoolerFillPercent).toBe(0);

    state = advance(state, 2);
    expect(state.environment.waterCoolerFillPercent).toBe(100);
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("does not add a post-hire delay when the cooler is already empty", () => {
    let state = preparedState({
      facilityTick: 100,
      emptySinceTick: 0,
      hiredAtFacilityTick: 100,
    });

    state = advance(state, 1);
    expect(state.employees[0]!.facilityTask).toMatchObject({
      kind: "refill_water",
      startedAtFacilityTick: 101,
    });
  });

  it("routes receptionist refill work to B5 beside the occupied A5 cooler", () => {
    let state = advance(preparedState(), 1);
    const frontDesk = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    );
    if (!frontDesk) throw new Error("Starter Front Desk is missing.");

    expect(state.employees[0]!.facilityTask?.kind).toBe("refill_water");
    expect(state.employees[0]!.path.at(-1)).toEqual({
      x: frontDesk.x + 4,
      y: frontDesk.y + 1,
    });
  });

  it("routes a manual founder refill to B5 rather than into the A5 fixture", () => {
    const state = preparedState();
    state.employees = [];
    const next = gameReducer(state, {
      type: "REFILL_WATER_COOLER",
      operationId: "water-refill.founder-approach",
    });
    const frontDesk = next.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    );
    if (!frontDesk) throw new Error("Starter Front Desk is missing.");
    expect(next.environment.founderActivity?.path.at(-1)).toEqual({
      x: frontDesk.x + 4,
      y: frontDesk.y + 1,
    });
    expect(next.environment.founderActivity?.path).not.toContainEqual({
      x: frontDesk.x + 4,
      y: frontDesk.y,
    });
  });

  it("persists an in-progress refill and prevents a duplicate founder action", () => {
    let state = advance(preparedState(), 1);
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
      startedAtFacilityTick: 101,
      workMinutesRemaining: 2,
    });

    const completed = advance(restored, 2);
    expect(completed.environment.waterCoolerFillPercent).toBe(100);
    expect(completed.employees[0]!.facilityTask).toBeNull();
  });

  it("does not leave the desk for a full or missing cooler", () => {
    const full = preparedState();
    full.environment.waterCoolerFillPercent = 100;
    full.environment.waterCoolerEmptySinceTick = null;
    expect(advance(full, 3).employees[0]!.facilityTask).toBeNull();

    const missing = preparedState();
    missing.rooms = missing.rooms.filter(
      (room) => room.roomDefinitionId !== "room.front_desk",
    );
    missing.doors = missing.doors.filter(
      (door) => missing.rooms.some((room) => room.id === door.roomId),
    );
    const after = advance(missing, 3);
    expect(after.environment.waterCoolerFillPercent).toBe(0);
    expect(after.employees[0]!.facilityTask).toBeNull();
  });

  it("does not credit a refill when the cooler is removed after assignment", () => {
    let state = advance(preparedState(), 1);
    expect(state.employees[0]!.facilityTask?.kind).toBe("refill_water");
    const frontDeskId = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    )!.id;
    state.rooms = state.rooms.filter((room) => room.id !== frontDeskId);
    state.doors = state.doors.filter((door) => door.roomId !== frontDeskId);
    state = advance(state, 2);
    expect(state.environment.waterCoolerFillPercent).toBe(0);
    expect(state.employees[0]!.facilityTask).toBeNull();
    expect(
      state.events.some((event) => event.type === "water_cooler_refilled"),
    ).toBe(false);
  });

  it("keeps an approaching patient ahead of refill work", () => {
    let state = preparedState();
    const source = Object.values(createInitialGameState().encounters)[0]!;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "water-refill.patient-priority.admit",
      encounterId: "encounter.water-refill.priority",
      caseId: source.frozenCase.id,
      patientDisplayName: "Priority Patient",
      arrivalClass: "routine",
    });
    state = advance(state, 1);
    expect(state.encounters["encounter.water-refill.priority"]?.checkInStatus).toBe(
      "approaching",
    );
    expect(state.employees[0]!.facilityTask).toBeNull();
    expect(state.environment.waterCoolerFillPercent).toBe(0);
  });

  it("cancels travel on patient arrival, preserves empty water, and retries after check-in", () => {
    let state = advance(preparedState(), 1);
    expect(state.employees[0]!.facilityTask?.kind).toBe("refill_water");
    const source = Object.values(createInitialGameState().encounters)[0]!;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "water-refill.interrupt.admit",
      encounterId: "encounter.water-refill.interrupt",
      caseId: source.frozenCase.id,
      patientDisplayName: "Interrupting Patient",
      arrivalClass: "routine",
    });
    state = advance(state, 1);
    expect(state.environment.waterCoolerFillPercent).toBe(0);
    expect(state.employees[0]!.facilityTask).toBeNull();
    expect(state.employees[0]!.path.at(-1)).toEqual(
      state.environment.founderLocation,
    );

    const patient = state.encounters["encounter.water-refill.interrupt"]!;
    patient.checkInStatus = "checked_in";
    patient.patientMovement = null;
    state = advance(state, 1);
    expect(state.employees[0]!.facilityTask?.kind).toBe("refill_water");
  });

  it("cancels a completion on the exact tick a scheduled patient is admitted", () => {
    let state = preparedState();
    const receptionist = state.employees[0]!;
    const frontDesk = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    )!;
    const approach = { x: frontDesk.x + 4, y: frontDesk.y + 1 };
    receptionist.location = approach;
    receptionist.path = [approach];
    receptionist.pathIndex = 0;
    receptionist.facilityTask = {
      kind: "refill_water",
      startedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 1,
    };
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    state = advance(state, 1);

    expect(Object.values(state.encounters)).toHaveLength(1);
    expect(Object.values(state.encounters)[0]!.checkInStatus).toBe("approaching");
    expect(state.environment.waterCoolerFillPercent).toBe(0);
    expect(state.employees[0]!.facilityTask).toBeNull();
  });
});
