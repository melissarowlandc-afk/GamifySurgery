import { describe, expect, it } from "vitest";
import { getEmployeeTrainingPercent, PERIOP_POST_OP_NURSE_ATTENTION_MINUTES, PERIOP_PRE_OP_NURSE_ATTENTION_MINUTES } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT as context, advancePeriopNurseAttention, advanceServiceOperations,
  beginPeriopNurseAttention, createInitialGameState, createPeriopNurseAttention, deserializeGameState,
  getCurrentPeriopNurseAttention, getNewPeriopServiceOperationPhases, getPeriopNurseAttentionQueue,
  getPeriopNurseStandingPoints, getRoomCareStations, getRoomDefinition, isRoomOperationalForFacilityWork,
  normalizePeriopNurseAttention, periopNurseAttentionStatus, serializeGameState,
  forecastPeriopNurseAttentionEnd, startRetailPurchase,
  type GameState, type ServiceOperationState,
} from "../src";
import { advanceEmployeeMovement } from "../src/staff";
import { advanceEmployeeTraining, requestEmployeeTraining } from "../src/employee-training";
import { advanceLevelThreeSupport } from "../src/level-three-support";
import { getPlacedRoomIdleSpots } from "../src/employee-idle-spots";

/** Synthetic gameplay fixture; no authored medical content or owner save. */
function fixture(nurseCount = 1): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.nurse-queue", campaignSeed: "nurse-queue", createdAtRealMs: 0 });
  state.encounters = {};
  state.serviceAppointmentsEnabled = false;
  state.facilityLevel = 3;
  state.rooms.push(
    { id: "periop.one", roomDefinitionId: "room.periop_recovery", x: 38, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "periop.two", roomDefinitionId: "room.periop_recovery", x: 38, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[22, 23, 24, 25, 26, 27].map((y) => ({ id: `hall.${y}`, roomDefinitionId: "room.hallway", x: 37, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "periop.one.west", roomId: "periop.one", side: "west", offset: 2, exterior: false },
    { id: "front.north", roomId: "room.instance.founder_desk", side: "north", offset: 4, exterior: false },
    { id: "periop.two.west", roomId: "periop.two", side: "west", offset: 2, exterior: false },
  );
  const locations = [{ x: 39, y: 27 }, { x: 42, y: 27 }, { x: 39, y: 24 }];
  for (let index = 0; index < nurseCount; index++) state.employees.push({
    id: `nurse.${index}`, displayName: `Nurse ${index}`, staffRoleDefinitionId: "staff.periop_nurse",
    appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0,
    morale: 100, trainingLevel: 1, homeRoomInstanceId: index < 2 ? "periop.one" : "periop.two",
    location: locations[index]!, path: [locations[index]!], pathIndex: 0, lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  expect(isRoomOperationalForFacilityWork(state, "periop.one", context)).toBe(true);
  expect(isRoomOperationalForFacilityWork(state, "periop.two", context)).toBe(true);
  return state;
}

function patient(state: GameState, index: number, kind: "pre_op" | "post_op" = "pre_op", ready = state.facilityTick): ServiceOperationState {
  const room = state.rooms.find((candidate) => candidate.id === "periop.one")!;
  const beds = getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition);
  const bed = beds[index]!;
  const phases = getNewPeriopServiceOperationPhases("income.endoscopy")!;
  const phaseIndex = kind === "pre_op" ? 0 : 2;
  const operation: ServiceOperationState = {
    id: `operation.${index}`, incomeLineId: "income.endoscopy", catalogVersion: 1, actorKind: "visitor", actorId: `patient.${index}`,
    displayName: index === 0 ? "Maya Reed" : `Patient ${index}`, appearance: state.founder.appearance,
    status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60,
    startedAtFacilityTick: ready, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
    quoteFee: 0, phaseIndex, phaseStartedAtFacilityTick: ready, phaseEndsAtFacilityTick: ready + phases[phaseIndex]!.durationMinutes,
    reservedRoomInstanceIds: [room.id], reservedEmployeeIds: [], providerReservation: null,
    location: bed.patientAnchor, path: [bed.patientAnchor], pathIndex: 0, lastMovedAtFacilityTick: ready, cancellationReason: null,
    frozenOperationPhases: phases, phaseFlowVersion: 1, periopBedFlowVersion: 1,
    periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: room.id, bedId: bed.id, endpoint: bed.patientAnchor },
    periopNurseAttention: createPeriopNurseAttention(state, phases),
    visitorTravel: { version: "service-visitor-travel.v1", offscreenEndpoint: { x: -2, y: 32 }, arrivedAtFacilityTick: ready },
  };
  if (kind === "post_op") Object.assign(operation.periopNurseAttention!.tasks[0]!, {
    readyAtFacilityTick: 0, requiredUntilFacilityTick: 30, startedAtFacilityTick: 0, completedAtFacilityTick: 15, remainingMinutes: 0,
  });
  beginPeriopNurseAttention(operation, ready);
  state.serviceOperations.push(operation);
  return operation;
}

function tick(state: GameState, minutes = 1): void {
  for (let index = 0; index < minutes; index++) {
    state.facilityTick++;
    advanceEmployeeMovement(state, context);
    advanceServiceOperations(state, context);
  }
}

describe("Peri-op nurse attention queue", () => {
  it.each([1, 2, 3])("divides FIFO work across %i nurses, without booking a third nurse in one room", (nurseCount) => {
    const state = fixture(nurseCount);
    // Reverse storage order proves the stable operation-ID tie-break.
    for (const index of [3, 2, 1, 0]) patient(state, index);
    advanceServiceOperations(state, context);
    const assigned = state.serviceOperations.filter((operation) => getCurrentPeriopNurseAttention(operation)?.employeeId).map((operation) => operation.id).sort();
    expect(assigned).toEqual(Array.from({ length: nurseCount }, (_, index) => `operation.${index}`));
    expect(getPeriopNurseAttentionQueue(state).map((entry) => entry.operation.id)).toEqual(Array.from({ length: 4 - nurseCount }, (_, index) => `operation.${index + nurseCount}`));
    const completions: string[] = [];
    for (let minute = 0; minute < 100; minute++) {
      tick(state);
      for (const operation of state.serviceOperations.slice().sort((a, b) => a.id.localeCompare(b.id))) {
        if (operation.periopNurseAttention!.tasks[0]!.completedAtFacilityTick !== null && !completions.includes(operation.id)) completions.push(operation.id);
      }
    }
    expect(completions).toEqual(["operation.0", "operation.1", "operation.2", "operation.3"]);
    expect(state.employees.every((employee) => !employee.facilityTask)).toBe(true);
  });

  it("uses ready time before creation time and stable ID, and combines pre/post work in one fair queue", () => {
    const state = fixture(2);
    state.facilityTick = 10;
    const newer = patient(state, 0, "pre_op", 8);
    const older = patient(state, 1, "post_op", 5);
    const tied = patient(state, 2, "pre_op", 8);
    newer.createdAtFacilityTick = 1;
    tied.createdAtFacilityTick = 0;
    expect(getPeriopNurseAttentionQueue(state).map((entry) => entry.operation.id)).toEqual([older.id, tied.id, newer.id]);
  });

  it("provides a reachable standing spot for every authored bed and eventually serves all eight patients", () => {
    const state = fixture();
    // A corner door leaves all eight beds usable; the regular fixture's west
    // middle door deliberately removes the two door-owned bed contacts.
    state.doors.find((door) => door.id === "periop.one.west")!.offset = 0;
    const operations = Array.from({ length: 8 }, (_, index) => patient(state, index));
    for (const operation of operations) expect(getPeriopNurseStandingPoints(state, operation, context).length).toBeGreaterThan(0);
    advanceServiceOperations(state, context);
    for (let minute = 0; minute < 200 && operations.some((operation) => operation.periopNurseAttention!.tasks[0]!.completedAtFacilityTick === null); minute++) tick(state);
    expect(operations.every((operation) => operation.periopNurseAttention!.tasks[0]!.completedAtFacilityTick !== null)).toBe(true);
  });

  it("fits a free nurse's 15-minute check inside 30-minute preparation and releases the nurse before the procedure", () => {
    const state = fixture();
    const operation = patient(state, 0);
    advanceServiceOperations(state, context);
    expect(getCurrentPeriopNurseAttention(operation)).toMatchObject({ employeeId: "nurse.0", startedAtFacilityTick: 0 });
    tick(state, 14);
    expect(getCurrentPeriopNurseAttention(operation)?.remainingMinutes).toBe(1);
    expect(operation.status).toBe("in_service");
    tick(state);
    expect(getCurrentPeriopNurseAttention(operation)?.completedAtFacilityTick).toBe(15);
    expect(state.employees[0]!.facilityTask).toBeNull();
    expect(operation.phaseEndsAtFacilityTick).toBe(30);
    tick(state, 15);
    expect(operation).toMatchObject({ phaseIndex: 0, status: "waiting_for_next_phase", nextPhaseReadyAtFacilityTick: 30 });
  });

  it("extends backed-up pre-op only until the check finishes, and blocks procedure entry until then", () => {
    const state = fixture();
    patient(state, 0);
    patient(state, 1);
    const third = patient(state, 2);
    advanceServiceOperations(state, context);
    tick(state, 30);
    expect(third).toMatchObject({ phaseIndex: 0, status: "in_service" });
    expect(getCurrentPeriopNurseAttention(third)?.completedAtFacilityTick).toBeNull();
    const task = getCurrentPeriopNurseAttention(third)!;
    while (third.status === "in_service" && state.facilityTick < 100) tick(state);
    expect(task.completedAtFacilityTick).toBeGreaterThan(30);
    expect(third.nextPhaseReadyAtFacilityTick).toBe(task.completedAtFacilityTick);
    expect(third.phaseIndex).toBe(0);
  });

  it("overlaps a free post-op check with recovery and holds delayed discharge until post-op attention completes", () => {
    const state = fixture();
    const operations = Array.from({ length: 6 }, (_, index) => patient(state, index, "post_op"));
    advanceServiceOperations(state, context);
    tick(state, 15);
    expect(operations[0]!.periopNurseAttention!.tasks[1]!.completedAtFacilityTick).toBe(15);
    expect(operations[0]!.phaseEndsAtFacilityTick).toBe(60);
    tick(state, 45);
    const delayed = operations[5]!;
    expect(delayed).toMatchObject({ phaseIndex: 2, status: "in_service" });
    expect(delayed.periopBedReservation).toBeDefined();
    expect(delayed.periopNurseAttention!.tasks[1]!.completedAtFacilityTick).toBeNull();
    while (delayed.status === "in_service" && state.facilityTick < 150) tick(state);
    expect(delayed.completedAtFacilityTick).toBe(delayed.periopNurseAttention!.tasks[1]!.completedAtFacilityTick);
    expect(delayed.completedAtFacilityTick).toBeGreaterThan(60);
  });

  it("walks to a distinct, furniture-free bedside spot and faces the patient from there", () => {
    const state = fixture(2);
    const operation = patient(state, 0);
    state.employees[0]!.location = { x: 39, y: 24 };
    state.employees[0]!.path = [state.employees[0]!.location];
    advanceServiceOperations(state, context);
    const task = getCurrentPeriopNurseAttention(operation)!;
    const nurse = state.employees.find((employee) => employee.id === task.employeeId)!;
    expect(nurse.path.length).toBeGreaterThan(1);
    expect(task.startedAtFacilityTick).toBeNull();
    tick(state, 1);
    expect(task.remainingMinutes).toBe(15);
    while (task.startedAtFacilityTick === null && state.facilityTick < 20) tick(state);
    expect(nurse.location).toEqual(task.standingPoint);
    expect(getPeriopNurseStandingPoints(state, operation, context)).toContainEqual(nurse.location);
    expect(Math.max(Math.abs(nurse.location.x - operation.location!.x), Math.abs(nurse.location.y - operation.location!.y))).toBe(1);
    expect(nurse.location).not.toEqual(operation.location);
    expect(task.remainingMinutes).toBe(15);
    const arrivedAt = task.startedAtFacilityTick!;
    tick(state, 14);
    expect(task.remainingMinutes).toBe(1);
    tick(state);
    expect(task.completedAtFacilityTick).toBe(arrivedAt + 15);
  });

  it("does not reduce work while a nurse is walking and never progresses twice in one minute", () => {
    const state = fixture();
    const operation = patient(state, 0);
    advancePeriopNurseAttention(state, context);
    state.facilityTick = 1;
    advancePeriopNurseAttention(state, context);
    advancePeriopNurseAttention(state, context);
    expect(getCurrentPeriopNurseAttention(operation)?.remainingMinutes).toBe(14);
  });

  it("allows idle nurses to take an existing staff break, but excludes a nurse currently on break from the queue", () => {
    const state = fixture();
    state.rooms.push({ id: "break.qa", roomDefinitionId: "room.staff_break", x: 28, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[25, 26, 27, 28].map((y) => ({ id: `break.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
    state.doors.push({ id: "break.qa.east", roomId: "break.qa", side: "east", offset: 1, exterior: false },
      { id: "break.front.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
    state.employees[0]!.morale = 50;
    expect(isRoomOperationalForFacilityWork(state, "break.qa", context)).toBe(true);
    advanceLevelThreeSupport(state, context);
    expect(state.employees[0]!.facilityTask?.kind).toBe("take_break");
    const operation = patient(state, 0);
    advancePeriopNurseAttention(state, context);
    expect(getCurrentPeriopNurseAttention(operation)?.employeeId).toBeNull();
    for (let minute = 0; minute < 80 && state.employees[0]!.facilityTask?.kind === "take_break"; minute++) {
      state.facilityTick++;
      advanceLevelThreeSupport(state, context);
      advanceEmployeeMovement(state, context);
    }
    advancePeriopNurseAttention(state, context);
    expect(getCurrentPeriopNurseAttention(operation)?.employeeId).toBe("nurse.0");
  });

  it("returns a released nurse to the existing idle policy, which selects a free staff seat without claiming its occupied neighbor", () => {
    const state = fixture(2);
    const operation = patient(state, 0);
    advanceServiceOperations(state, context);
    tick(state, 15);
    expect(getCurrentPeriopNurseAttention(operation)?.completedAtFacilityTick).toBe(15);
    const room = state.rooms.find((entry) => entry.id === "periop.one")!;
    const seats = getPlacedRoomIdleSpots(room);
    const occupied = seats[0]!.tile;
    const free = seats[1]!.tile;
    state.employees[1]!.location = { ...occupied };
    state.employees[1]!.path = [{ ...occupied }];
    state.employees[1]!.pathIndex = 0;
    state.employees[0]!.nextIdleActionAtFacilityTick = 0;
    let selectedFreeSeat = false;
    for (let minute = 0; minute < 300 && !selectedFreeSeat; minute++) {
      state.facilityTick++;
      advanceEmployeeMovement(state, context);
      const destination = state.employees[0]!.path.at(-1);
      expect(destination).not.toEqual(occupied);
      selectedFreeSeat = destination?.x === free.x && destination.y === free.y;
    }
    expect(selectedFreeSeat).toBe(true);
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("lets a paid idle training request depart between patients, leaving its nurse unavailable", () => {
    const state = fixture();
    state.cash = 10000;
    state.cashCents = 1000000;
    state.rooms.push({ id: "training.qa", roomDefinitionId: "room.training", x: 33, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.rooms.push({ id: "training.hall", roomDefinitionId: "room.hallway", x: 34, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "training.qa.south", roomId: "training.qa", side: "south", offset: 1, exterior: false },
      { id: "training.front.north", roomId: "room.instance.founder_desk", side: "north", offset: 1, exterior: false });
    expect(requestEmployeeTraining(state, "nurse.0", context).applied).toBe(true);
    advanceEmployeeTraining(state, context);
    expect(state.employees[0]!.training?.stage).toBe("walking_to_training");
    const operation = patient(state, 0);
    advancePeriopNurseAttention(state, context);
    expect(getCurrentPeriopNurseAttention(operation)?.employeeId).toBeNull();
    expect(getPeriopNurseAttentionQueue(state)).toHaveLength(1);
  });

  it("lets an idle nurse buy coffee, and does not assign attention during that trip", () => {
    const state = fixture();
    state.rooms.push({ id: "coffee.qa", roomDefinitionId: "room.coffee_kiosk", x: 33, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[26, 27].map((y) => ({ id: `coffee.hall.${y}`, roomDefinitionId: "room.hallway", x: 34, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
    state.doors.push({ id: "coffee.qa.south", roomId: "coffee.qa", side: "south", offset: 1, exterior: false },
      { id: "coffee.front.north", roomId: "room.instance.founder_desk", side: "north", offset: 1, exterior: false });
    expect(startRetailPurchase(state, "income.coffee", "employee", "nurse.0", context)).not.toBeNull();
    const operation = patient(state, 0);
    advancePeriopNurseAttention(state, context);
    expect(getCurrentPeriopNurseAttention(operation)?.employeeId).toBeNull();
  });

  it("reports the current queue's future extension and a short delay without emitting alerts", () => {
    const state = fixture();
    patient(state, 0); patient(state, 1); const third = patient(state, 2);
    const alertCount = state.environment.facilityConditionOccurrences.length;
    advanceServiceOperations(state, context);
    expect(forecastPeriopNurseAttentionEnd(state, third, context)).toBeGreaterThan(30);
    tick(state, 16);
    expect(periopNurseAttentionStatus(third, state.facilityTick)).toBe("Waiting for peri-op nurse");
    expect(state.environment.facilityConditionOccurrences).toHaveLength(alertCount);
  });

  it("uses the existing category-training factor once on each check, with no Recovery-room timing bonus", () => {
    const state = fixture(2);
    state.employees[0]!.trainingLevel = 5;
    state.employees[1]!.trainingLevel = 1;
    state.rooms.find((room) => room.id === "periop.one")!.upgradeLevel = 5;
    const percent = getEmployeeTrainingPercent("staff.periop_nurse", 5) / 2;
    const operation = patient(state, 0);
    expect(operation.periopNurseAttention!.trainingPercent).toBe(percent);
    expect(operation.periopNurseAttention!.tasks.map((task) => task.durationMinutes)).toEqual([Math.ceil(15 * (1 - percent / 100)), Math.ceil(15 * (1 - percent / 100))]);
    expect(operation.frozenOperationPhases?.[2]?.durationMinutes).toBe(60);
    state.employees[1]!.trainingLevel = 5;
    expect(operation.periopNurseAttention!.trainingPercent).toBe(percent);
    expect(PERIOP_PRE_OP_NURSE_ATTENTION_MINUTES).toBe(15);
    expect(PERIOP_POST_OP_NURSE_ATTENTION_MINUTES).toBe(15);
  });

  it("round-trips an active check and a delayed queue, preserving work and FIFO order", () => {
    let state = fixture();
    patient(state, 0); patient(state, 1); patient(state, 2);
    advanceServiceOperations(state, context);
    tick(state, 7);
    const before = structuredClone(state.serviceOperations.map((operation) => operation.periopNurseAttention));
    state = deserializeGameState(serializeGameState(state));
    expect(state.serviceOperations.map((operation) => operation.periopNurseAttention)).toEqual(before);
    tick(state, 8);
    expect(state.serviceOperations[0]!.periopNurseAttention!.tasks[0]!.completedAtFacilityTick).toBe(15);
    expect(getCurrentPeriopNurseAttention(state.serviceOperations[1]!)?.employeeId).toBe("nurse.0");
    expect(getPeriopNurseAttentionQueue(state).map((entry) => entry.operation.id)).toEqual(["operation.2"]);
  });

  it("returns a dismissed nurse's partial task to its original queue position without repeating completed work", () => {
    let state = fixture();
    patient(state, 0); patient(state, 1);
    advanceServiceOperations(state, context);
    tick(state, 7);
    state.employees = [];
    state = deserializeGameState(serializeGameState(state));
    expect(getCurrentPeriopNurseAttention(state.serviceOperations[0]!)).toMatchObject({ employeeId: null, remainingMinutes: 8, readyAtFacilityTick: 0 });
    expect(getPeriopNurseAttentionQueue(state).map((entry) => entry.operation.id)).toEqual(["operation.0", "operation.1"]);
    state.facilityTick = 30;
    expect(periopNurseAttentionStatus(state.serviceOperations[0]!, state.facilityTick)).toBe("Waiting for peri-op nurse");
  });

  it.each(["pre_op", "post_op"] as const)("keeps legacy %s work attended and unchanged on reload", (kind) => {
    let state = fixture();
    const operation = patient(state, 0, kind);
    delete operation.periopNurseAttention;
    state.facilityTick = 20;
    state.employees[0]!.location = { x: 41, y: 29 };
    state.employees[0]!.path = [state.employees[0]!.location];
    state = deserializeGameState(serializeGameState(state));
    expect(state.serviceOperations[0]!.periopNurseAttention).toBeUndefined();
    const originalEnd = state.serviceOperations[0]!.phaseEndsAtFacilityTick;
    advanceServiceOperations(state, context);
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick).toBe(originalEnd);
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("rejects malformed attention duration/progress instead of silently losing the phase gate", () => {
    const state = fixture();
    const operation = patient(state, 0);
    operation.periopNurseAttention!.tasks[0]!.durationMinutes = 1;
    expect(() => normalizePeriopNurseAttention(operation.periopNurseAttention, operation.frozenOperationPhases!)).toThrow(/attention/);
  });
});
