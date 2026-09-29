import { describe, expect, it, vi } from "vitest";

const randomCalls = vi.hoisted(() => ({ count: 0, priority: 0, first: 0, forcePriorityTie: false }));

vi.mock("../src/randomness", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/randomness")>();
  return {
    ...actual,
    deterministicInteger: (...args: Parameters<typeof actual.deterministicInteger>) => {
      randomCalls.count += 1;
      if (args[2].startsWith("optional-priority.")) {
        randomCalls.priority += 1;
        if (randomCalls.forcePriorityTie) return 0;
      }
      if (args[2].startsWith("optional-first.")) randomCalls.first += 1;
      return actual.deterministicInteger(...args);
    },
  };
});

import {
  advanceRetailOperations,
  createInitialGameState,
  gameReducer,
  getFacilityAccessValidation,
  PROTOTYPE_DOMAIN_CONTEXT,
  type GameState,
  type PendingResult,
} from "../src";

function employee(
  state: GameState,
  id: string,
  location: { x: number; y: number },
) {
  return {
    id,
    staffRoleDefinitionId: "staff.imaging_technician",
    displayName: id,
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 20,
    morale: 75,
    trainingLevel: 1 as const,
    homeRoomInstanceId: "room.retail.ultrasound",
    location,
    path: [location],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  };
}

function retailState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "retail-scheduling-performance",
    campaignSeed: "retail-scheduling-performance",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    { id: "room.retail.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.retail.xray", roomDefinitionId: "room.xray", x: 29, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.retail.ct", roomDefinitionId: "room.ct", x: 24, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.retail.coffee", roomDefinitionId: "room.coffee_kiosk", x: 30, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([21, 22, 23, 24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.retail.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    ...([28, 29, 30, 31] as const).map((x) => ({ id: `room.retail.ct-hall.${x}`, roomDefinitionId: "room.hallway", x, y: 25, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.retail.ultrasound", roomId: "room.retail.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.retail.xray", roomId: "room.retail.xray", side: "east", offset: 1, exterior: false },
    { id: "door.retail.ct", roomId: "room.retail.ct", side: "east", offset: 1, exterior: false },
    { id: "door.retail.coffee", roomId: "room.retail.coffee", side: "east", offset: 1, exterior: false },
    { id: "door.retail.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push(
    { ...employee(state, "employee.shopper", { x: 31, y: 21 }), homeRoomInstanceId: "room.retail.xray" },
    { ...employee(state, "employee.two", { x: 27, y: 25 }), homeRoomInstanceId: "room.retail.ct" },
    employee(state, "employee.future", { x: 34, y: 25 }),
  );
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, issues: [], unreachableRoomIds: [] });
  return state;
}

function addWaitingPatient(state: GameState, id: string): void {
  const source = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (candidate) => candidate.earliestFacilityStage <= 1 && candidate.requiredCapabilityIds.length === 0 && candidate.decisionNodes.length > 1,
  )!;
  const admitted = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `admit.${id}`,
    encounterId: id,
    caseId: source.id,
    patientDisplayName: id,
    arrivalClass: "routine",
  });
  Object.assign(state, admitted);
  const encounter = state.encounters[id]!;
  const pending: PendingResult = {
    operationId: `pending.${id}`,
    gateId: "gate",
    originatingNodeIndex: 0,
    resultTypeId: "service.basic_labs",
    pendingLabel: "Waiting",
    resultNarrative: "Ready",
    routeId: "route.basic_labs.external",
    routeDisplayName: "External",
    scheduledAtTick: 0,
    serviceDurationTicks: 500,
    durationTicks: 500,
    dueTick: 500,
    deliveredAtTick: null,
    offsiteReturnStartedAtTick: null,
    offsiteTravel: null,
    patientTravel: null,
    patientRemainsOnsite: true,
    timingPhases: [{ id: "external", durationTicks: 500, resourceBound: false, startsAtTick: 0, endsAtTick: 500 }],
  };
  encounter.lifecycle = "active_pending_result";
  encounter.pendingResult = pending;
  encounter.steps[0]!.status = "result_pending";
  encounter.steps[0]!.result = pending;
  encounter.patientLocation = { x: 35, y: 25 };
  encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = "room.retail.ultrasound";
}

describe("optional retail scheduling", () => {
  it("does not evaluate a deterministic priority for future opportunities and initializes a new one once", () => {
    const state = retailState();
    state.retailNextOpportunityTicks = {
      "employee:employee.shopper": 100,
      "employee:employee.two": 100,
      "employee:employee.future": 100,
      "founder:founder": 100,
    };

    randomCalls.count = 0;
    randomCalls.priority = 0;
    randomCalls.first = 0;
    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(randomCalls.priority).toBe(0);
    expect(randomCalls.first).toBe(0);

    delete state.retailNextOpportunityTicks["employee:employee.future"];
    randomCalls.count = 0;
    randomCalls.priority = 0;
    randomCalls.first = 0;
    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(randomCalls.priority).toBe(0);
    expect(randomCalls.first).toBe(1);
    expect(state.retailNextOpportunityTicks["employee:employee.future"]).toBeGreaterThan(state.facilityTick);
  });

  it("evaluates exactly one priority for each due actor", () => {
    const state = retailState();
    state.retailNextOpportunityTicks = {
      "employee:employee.shopper": 0,
      "employee:employee.two": 0,
      "employee:employee.future": 100,
      "founder:founder": 0,
    };

    randomCalls.count = 0;
    randomCalls.priority = 0;
    randomCalls.first = 0;
    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(randomCalls.priority).toBe(3);
  });

  it("retains actor construction order when due priorities tie", () => {
    const state = retailState();
    state.retailNextOpportunityTicks = {
      "employee:employee.shopper": 0,
      "employee:employee.two": 0,
      "employee:employee.future": 100,
      "founder:founder": 100,
    };
    randomCalls.forcePriorityTie = true;
    try {
      advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    } finally {
      randomCalls.forcePriorityTie = false;
    }
    expect(state.retailOperations[0]?.actorId).toBe("employee.shopper");
  });

  it("retains mixed opportunity outcomes across 60 ticks", () => {
    let state = retailState();
    addWaitingPatient(state, "encounter.overdue");
    addWaitingPatient(state, "encounter.future");
    state.retailNextOpportunityTicks = {
      "employee:employee.shopper": 1,
      "employee:employee.two": 1,
      "employee:employee.future": 100,
      "encounter:encounter.overdue": 1,
      "encounter:encounter.future": 100,
      "founder:founder": 1,
    };
    for (let index = 0; index < 60; index += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `retail-scheduling.${index}` });
    }
    expect(state.facilityTick).toBe(60);
    expect(state.retailOperations.some((operation) => operation.actorId === "employee.shopper")).toBe(true);
    expect(state.retailOperations.some((operation) => operation.actorId === "employee.two")).toBe(true);
    expect(state.retailOperations.some((operation) => operation.actorId === "encounter.overdue")).toBe(true);
    expect(state.retailOperations.some((operation) => operation.actorId === "employee.future" || operation.actorId === "encounter.future")).toBe(false);
    expect(state.retailNextOpportunityTicks).toMatchObject({
      "employee:employee.future": 100,
      "encounter:encounter.future": 100,
    });
    expect(state.retailActorLedgers["employee:employee.shopper"]?.lastTripAtFacilityTick).toBeGreaterThanOrEqual(1);
    expect(state.retailActorLedgers["employee:employee.future"]).toBeUndefined();
  });
});
