import { describe, expect, it } from "vitest";
import { createAppAppointmentsQaState } from "../../../tests/fixtures/app-appointments";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { advanceEmployeeMovement, advanceEmployeeTraining, advanceServiceOperations, createInitialGameState,
  deserializeGameState, gameReducer, getAppAppointmentHomes, getOperatingExpensePerFacilityHour, getRoomSalePreview,
  getRoomStaffCapacity, getRoomDefinition, getRoomNavigationAnchor, getEligibleServiceRoute, isAppAppointment, serializeGameState, startServiceOperation, type GameState } from "../src";

const context = createLevelFourRoomsQaContext();
let sequence = 0;
function fixture(): GameState {
  const state = createAppAppointmentsQaState(context);
  state.paused = false;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  return state;
}
const visits = (state: GameState) => state.serviceOperations.filter(isAppAppointment);
function minute(state: GameState): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `app.tick.${sequence++}` }, context);
}
function until(state: GameState, predicate: (state: GameState) => boolean, limit = 240): GameState {
  for (let i = 0; i < limit && !predicate(state); i++) state = minute(state);
  expect(predicate(state)).toBe(true);
  return state;
}
function learning(state: GameState) {
  return { clinicalXp: state.clinicalXp, histories: state.learningHistories, reviewIntents: state.reviewIntents,
    settlements: state.settlements, encounters: state.encounters, chart: state.openChartEncounterId, attended: state.attendedEncounterId };
}

describe("autonomous appointments in clinic", () => {
  it("runs two independent homes concurrently, pays once and never creates learning/chart evidence", () => {
    let state = fixture();
    const initialLearning = structuredClone(learning(state));
    const hourly = getOperatingExpensePerFacilityHour(state, context);
    expect(hourly - getOperatingExpensePerFacilityHour({ ...state, employees: [] }, context)).toBe(-60);
    state = until(state, value => visits(value).filter(operation => operation.status === "in_service").length === 2);
    const inCare = visits(state).filter(operation => operation.status === "in_service");
    expect(new Set(inCare.flatMap(operation => operation.reservedRoomInstanceIds)).size).toBe(2);
    expect(new Set(inCare.map(operation => operation.providerReservation?.kind === "employee" ? operation.providerReservation.employeeId : null)).size).toBe(2);
    for (const operation of inCare) {
      expect(operation.providerReservation?.kind).toBe("employee");
      const provider = state.employees.find(employee => employee.id === (operation.providerReservation?.kind === "employee" ? operation.providerReservation.employeeId : ""))!;
      expect(provider.homeRoomInstanceId).toBe(operation.clinicVisit?.requestedRoomInstanceId);
      expect(operation.reservedRoomInstanceIds).toContain(provider.homeRoomInstanceId);
      expect(operation.clinicVisit?.demographics.ageYears).toBeGreaterThanOrEqual(18);
      expect(operation.appearance?.stillId).toBeTruthy();
    }
    const started = JSON.parse(JSON.stringify(inCare));
    state = deserializeGameState(serializeGameState(state), context);
    expect(JSON.parse(JSON.stringify(visits(state).filter(operation => operation.status === "in_service")))).toEqual(started);
    state = until(state, value => value.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.app_consult").length === 2);
    expect(state.serviceIncomeReceipts.map(receipt => receipt.grossAmount)).toEqual([80, 80]);
    expect(learning(state)).toEqual(initialLearning);
    expect(state.cash).toBeLessThan(28_000); // Hires, rooms and hourly wages still cost money.
    state = deserializeGameState(serializeGameState(state), context);
    for (let i = 0; i < 5; i++) state = minute(state);
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.app_consult")).toHaveLength(2);
  });

  it("scales ordinary demand per home without a global visitor cap or income cliff", () => {
    const state = fixture();
    // Isolate the live dispatch/scheduler, with the same real navigation, wages
    // checked above, and no clinical cases or amenity interruptions.
    for (let i = 0; i < 600; i++) {
      state.facilityTick++;
      advanceEmployeeMovement(state, context);
      advanceServiceOperations(state, context);
    }
    const receipts = state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.app_consult");
    expect(receipts).toHaveLength(10);
    expect(receipts.reduce((total, row) => total + row.grossAmount, 0)).toBe(800);
    // 10 game hours: each home gross $400, salary $300, upkeep $20 => $80.
    expect(800 - 2 * (30 + 2) * 10).toBe(160);
    expect(new Set(visits(state).map(operation => operation.clinicVisit?.requestedRoomInstanceId)).size).toBe(2);
  });

  it("finishes current work, leaves for training, queues visitors and returns with a provider-specific fee", () => {
    const initial = fixture();
    initial.employees = initial.employees.filter(employee => employee.id === "app.0");
    const initialHistories = structuredClone(initial.learningHistories);
    let state = until(initial, value => visits(value).some(operation => operation.status === "in_service"));
    const cash = state.cash;
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", operationId: "app.train", employeeId: "app.0" }, context);
    expect(state.operationReceipts["app.train"]?.status).toBe("applied");
    expect(state.cash).toBe(cash - 150);
    expect(state.employees[0]?.training?.stage).toBe("queued");
    state = until(state, value => value.employees[0]?.training?.stage === "training");
    state = deserializeGameState(serializeGameState(state), context);
    const home = state.employees[0]!.homeRoomInstanceId!;
    state.nextServiceAppointmentTicks[`income.app_consult:${home}`] = state.facilityTick;
    state = until(state, value => visits(value).some(operation => operation.clinicVisit?.requestedRoomInstanceId === home && operation.status === "waiting_for_resources"));
    const visitorId = visits(state).find(operation => operation.clinicVisit?.requestedRoomInstanceId === home && operation.status === "waiting_for_resources")!.id;
    expect(visits(state).find(operation => operation.id === visitorId)?.providerReservation).toBeNull();
    state = until(state, value => value.employees[0]?.trainingLevel === 2 && !value.employees[0]?.training, 300);
    state = until(state, value => visits(value).find(operation => operation.id === visitorId)?.completedAtFacilityTick !== null);
    const operation = visits(state).find(row => row.id === visitorId)!;
    expect(operation.cancelledAtFacilityTick).toBeNull();
    expect(operation.appAppointmentRevenue).toMatchObject({ providerEmployeeId: "app.0", trainingPercent: 10, fee: 88 });
    const frozen = structuredClone(operation.appAppointmentRevenue);
    state.employees[0]!.trainingLevel = 5;
    state = deserializeGameState(serializeGameState(state), context);
    expect(visits(state).find(row => row.id === visitorId)?.appAppointmentRevenue).toEqual(frozen);
    expect(learning(state).histories).toEqual(initialHistories);
  });

  it("cross-covers reachable spare capacity, keeps queued home work first, and never double-books", () => {
    const state = fixture();
    state.serviceAppointmentsEnabled = false;
    state.nextServiceAppointmentTicks = {};
    for (let i = 0; i < 60; i++) { state.facilityTick++; advanceEmployeeMovement(state, context); }
    state.employees[0]!.facilityTask = { kind: "take_break", targetId: "room.app.training", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 90 };
    const id = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    expect(id).toBeTruthy();
    const operation = visits(state).find(row => row.id === id)!;
    operation.status = "waiting_for_resources";
    operation.location = { ...state.environment.founderLocation };
    operation.path = [operation.location]; operation.pathIndex = 0;
    advanceServiceOperations(state, context);
    expect(operation.providerReservation).toEqual({ kind: "employee", employeeId: "app.1" });
    expect(operation.reservedRoomInstanceIds).toEqual(["room.app.0"]);
    const second = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    expect(second).toBeTruthy();
    const other = visits(state).find(row => row.id === second)!;
    other.status = "waiting_for_resources"; other.location = { ...state.environment.founderLocation }; other.path = [other.location];
    advanceServiceOperations(state, context);
    expect(other.providerReservation).toBeNull();
    expect(state.employees[1]!.facilityTask?.targetId).toBe(id);
  });

  it("keeps a pending home appointment ahead of borrowed cross-cover", () => {
    const state = fixture();
    state.serviceAppointmentsEnabled = false;
    for (let i = 0; i < 60; i++) { state.facilityTick++; advanceEmployeeMovement(state, context); }
    state.employees[0]!.facilityTask = { kind: "take_break", targetId: "room.app.training", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 90 };
    const first = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    const second = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    for (const operation of visits(state)) {
      operation.status = "waiting_for_resources"; operation.location = { ...state.environment.founderLocation };
      operation.path = [operation.location]; operation.pathIndex = 0;
    }
    advanceServiceOperations(state, context);
    expect(visits(state).find(row => row.id === first)?.providerReservation).toBeNull();
    expect(visits(state).find(row => row.id === second)?.providerReservation).toEqual({ kind: "employee", employeeId: "app.1" });
    expect(visits(state).find(row => row.id === second)?.reservedRoomInstanceIds).toEqual(["room.app.1"]);
  });

  it("prefers a reachable APP for existing Minor-Procedure routes and retains founder fallback", () => {
    let state = fixture();
    state.serviceAppointmentsEnabled = false;
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: "app.minor.room", roomId: "room.app.minor",
      roomDefinitionId: "room.minor_procedure", x: 23, y: 23, orientation: 0 }, context);
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "app.minor.door", doorId: "door.app.minor",
      roomId: "room.app.minor", side: "south", offset: 2 }, context);
    expect(state.operationReceipts["app.minor.door"]?.status).toBe("applied");
    const minor = state.rooms.find(room => room.id === "room.app.minor")!;
    const app = state.employees[0]!;
    app.homeRoomInstanceId = minor.id;
    app.location = getRoomNavigationAnchor(minor, getRoomDefinition(minor.roomDefinitionId, context)!, "staff");
    app.path = [app.location]; app.pathIndex = 0;
    state.environment.founderActivity = null;
    for (const service of ["service.anoscopy", "service.skin_excisional_biopsy", "service.cutaneous_lesion_biopsy", "service.nipple_areolar_biopsy"]) {
      expect(getEligibleServiceRoute(state, service, null, context)?.providerReservation).toMatchObject({ kind: "employee", employeeId: "app.0" });
    }
    for (const employee of state.employees) employee.facilityTask = { kind: "perform_service", targetId: "other.work", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 20 };
    expect(getEligibleServiceRoute(state, "service.anoscopy", null, context)?.providerReservation).toEqual({ kind: "founder" });
  });

  it("yields both occupied exam rooms to scored-care priority without changing the scored question", () => {
    let state = until(fixture(), value => visits(value).filter(operation => operation.status === "in_service").length === 2);
    const scored = structuredClone(Object.values(createInitialGameState(context).encounters)[0]!);
    scored.checkInStatus = "checked_in"; scored.patientMovement = null; scored.patientLocation = { ...state.environment.founderLocation };
    scored.assignedRoomInstanceId = null; scored.queuedCareRoomInstanceId = null;
    state.encounters[scored.id] = scored;
    const frozenCase = structuredClone(scored.frozenCase);
    state = gameReducer(state, { type: "OPEN_CHART", operationId: "app.scored.open", encounterId: scored.id }, context);
    expect(state.operationReceipts["app.scored.open"]?.status).toBe("applied");
    expect(visits(state).some(operation => operation.status === "waiting_for_resources" && operation.saleTransfer)).toBe(true);
    state = until(state, value => value.encounters[scored.id]?.assignedRoomInstanceId !== null, 100);
    expect(state.encounters[scored.id]?.frozenCase).toEqual(frozenCase);
    const roomId = state.encounters[scored.id]!.assignedRoomInstanceId;
    expect(visits(state).filter(operation => ["walking_to_service", "in_service"].includes(operation.status)).every(operation => !operation.reservedRoomInstanceIds.includes(roomId!))).toBe(true);
    expect(state.environment.founderActivity?.targetId).toBe(scored.id);
    expect(state.clinicalXp).toBe(0);
  });

  it("clears a queued interrupted visitor from the sole exam so an away APP cannot strand founder care", () => {
    const initial = fixture();
    initial.employees = initial.employees.filter(employee => employee.id === "app.0");
    initial.rooms = initial.rooms.filter(room => room.id !== "room.app.1");
    initial.doors = initial.doors.filter(door => door.roomId !== "room.app.1");
    let state = until(initial, value => visits(value).some(operation => operation.status === "in_service"));
    state.employees[0]!.facilityTask = { kind: "take_break", targetId: "room.app.training", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 30 };
    state = minute(state);
    expect(visits(state)[0]?.status).toBe("waiting_for_resources");
    const scored = structuredClone(Object.values(createInitialGameState(context).encounters)[0]!);
    scored.checkInStatus = "checked_in"; scored.patientMovement = null; scored.patientLocation = { ...state.environment.founderLocation };
    scored.assignedRoomInstanceId = null; scored.queuedCareRoomInstanceId = null;
    state.encounters[scored.id] = scored;
    state = gameReducer(state, { type: "OPEN_CHART", operationId: "app.away.scored.open", encounterId: scored.id }, context);
    state = until(state, value => value.encounters[scored.id]?.assignedRoomInstanceId === "room.app.0", 80);
    expect(state.environment.founderActivity?.targetId).toBe(scored.id);
    expect(visits(state)[0]?.status).toBe("waiting_for_resources");
    expect(visits(state)[0]?.providerReservation).toBeNull();
  });

  it("reroutes after firing and selling, then sends visitors home if the final APP is fired", () => {
    let state = until(fixture(), value => visits(value).filter(operation => operation.status === "in_service").length === 2);
    const preview = getRoomSalePreview(state, "room.app.0", context)!;
    expect(preview.dismissedEmployees.map(employee => employee.id)).toEqual(["app.0"]);
    expect(getRoomStaffCapacity({ ...state, rooms: state.rooms.filter(room => room.id !== "room.app.0") }, "staff.app").capacity).toBe(1);
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "app.sell", roomId: "room.app.0", saleConfirmationToken: preview.confirmationToken }, context);
    expect(state.operationReceipts["app.sell"]?.status).toBe("applied");
    expect(getRoomStaffCapacity(state, "staff.app").capacity).toBe(1);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => value.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.app_consult").length >= 2, 200);
    const cancelledId = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    expect(cancelledId).toBeTruthy();
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "app.fire.final", employeeId: "app.1" }, context);
    expect(state.operationReceipts["app.fire.final"]?.status).toBe("applied");
    state = until(state, value => visits(value).every(operation => ["completed", "cancelled"].includes(operation.status)), 120);
    expect(getAppAppointmentHomes(state, context)).toEqual([]);
    expect(visits(state).find(operation => operation.id === cancelledId)?.cancelledAtFacilityTick).not.toBeNull();
  });

  it("requires the specialty home, keeps wound procedures dormant and rejects malformed payment markers", () => {
    const state = fixture();
    for (const id of ["income.pediatric_consult", "income.wound_care", "income.wound_procedure", "income.ostomy_support"]) expect(startServiceOperation(state, id, "visitor", context)).toBeNull();
    const id = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    const operation = visits(state).find(row => row.id === id)!;
    operation.appAppointmentRevenue = { version: "app-appointment-revenue.v1", providerEmployeeId: "app.0", baseFee: 80, trainingLevel: 2, trainingPercent: 10, fee: 999 };
    expect(() => deserializeGameState(serializeGameState(state), context)).toThrow("APP appointment revenue");
  });

  it("takes real morale-restoring breaks without free wages or lost visitors", () => {
    let state = fixture();
    state.serviceAppointmentsEnabled = false;
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: "app.break.room", roomId: "room.app.break",
      roomDefinitionId: "room.staff_break", x: 23, y: 22, orientation: 0 }, context);
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "app.break.door", doorId: "door.app.break",
      roomId: "room.app.break", side: "south", offset: 2 }, context);
    expect(state.operationReceipts["app.break.door"]?.status).toBe("applied");
    state = until(state, value => value.employees.some(employee => employee.facilityTask?.kind === "take_break"));
    const employee = state.employees.find(row => row.facilityTask?.kind === "take_break")!;
    const morale = employee.morale;
    const wageDifference = getOperatingExpensePerFacilityHour(state, context) - getOperatingExpensePerFacilityHour({ ...state, employees: [] }, context);
    expect(wageDifference).toBe(-60);
    const id = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    expect(id).toBeTruthy();
    state = until(state, value => value.employees.find(row => row.id === employee.id)!.morale > morale, 100);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null, 150);
    expect(visits(state).find(row => row.id === id)?.cancelledAtFacilityTick).toBeNull();
  });

  it("adds visitors beside the unchanged normal scored-arrival flow", () => {
    let withAppointments = fixture();
    withAppointments.nextRoutineArrivalTick = 1;
    let withoutAppointments = structuredClone(withAppointments);
    withoutAppointments.serviceAppointmentsEnabled = false;
    for (let i = 0; i < 35; i++) {
      withAppointments = minute(withAppointments);
      withoutAppointments = minute(withoutAppointments);
    }
    const scoredIds = Object.keys(withAppointments.encounters);
    expect(scoredIds.length).toBeGreaterThan(0);
    expect(scoredIds).toEqual(Object.keys(withoutAppointments.encounters));
    expect(scoredIds.map(id => withAppointments.encounters[id]!.frozenCase)).toEqual(scoredIds.map(id => withoutAppointments.encounters[id]!.frozenCase));
    expect(visits(withAppointments)).toHaveLength(2);
    expect(visits(withoutAppointments)).toHaveLength(0);
    expect(withAppointments.learningHistories).toEqual(withoutAppointments.learningHistories);
    expect(withAppointments.clinicalXp).toBe(withoutAppointments.clinicalXp);
  });
});
