import { describe, expect, it } from "vitest";
import { createWoundOstomyAppointmentsQaState } from "../../../tests/fixtures/wound-ostomy-appointments";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { advanceEmployeeMovement, advanceServiceOperations, createInitialGameState, deserializeGameState, gameReducer,
  getAppAppointmentHomes, getRoomCareAnchor, getRoomDefinition, getRoomSalePreview, isAppAppointment,
  serializeGameState, startEncounterProcedureOperation, startServiceOperation, type GameState } from "../src";

const context = createLevelFourRoomsQaContext();
let sequence = 0;
const visits = (state: GameState) => state.serviceOperations.filter(isAppAppointment);
const learning = (state: GameState) => ({ xp: state.clinicalXp, histories: state.learningHistories, intents: state.reviewIntents,
  settlements: state.settlements, encounters: state.encounters, chart: state.openChartEncounterId, attended: state.attendedEncounterId });
function fixture(homes = 1) { const state = createWoundOstomyAppointmentsQaState(context, homes); state.paused = false; return state; }
function minute(state: GameState) {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `wound.minute.${sequence++}` }, context);
}
function until(state: GameState, predicate: (state: GameState) => boolean, limit = 300) {
  for (let i = 0; i < limit && !predicate(state); i++) state = minute(state);
  expect(predicate(state), JSON.stringify(visits(state).map(row => [row.id, row.status, row.resourceWaitReason]))).toBe(true);
  return state;
}

describe("M6 APP wound/ostomy visits", () => {
  it("runs real APP care, freezes identity and pays once with a durable completion witness and no learning/supply orders", () => {
    let state = fixture();
    const before = structuredClone(learning(state));
    expect(getAppAppointmentHomes(state, context, "income.wound_care")).toEqual(["room.wound.qa.0"]);
    state = until(state, value => visits(value).some(row => row.status === "arriving"));
    const id = visits(state)[0]!.id;
    const identity = structuredClone([visits(state)[0]!.displayName, visits(state)[0]!.appearance, visits(state)[0]!.clinicVisit]);
    expect(visits(state)[0]!.clinicVisit).toMatchObject({ kind: "wound_care", requestedRoomInstanceId: "room.wound.qa.0" });
    expect(state.levelFourCompletion?.woundOstomyCareVisit).toBeFalsy();
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const operation = visits(state).find(row => row.id === id)!;
    expect(operation.providerReservation).toEqual({ kind: "employee", employeeId: "app.wound.0" });
    expect(operation.reservedEmployeeIds).toEqual([]);
    expect(operation.reservedRoomInstanceIds).toEqual(["room.wound.qa.0"]);
    const room = state.rooms.find(row => row.id === "room.wound.qa.0")!;
    expect(operation.location).toEqual(getRoomCareAnchor(room, getRoomDefinition(room.roomDefinitionId, context)!, "patient"));
    expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(30);
    expect(operation.appAppointmentRevenue).toMatchObject({ baseFee: 60, trainingPercent: 0, fee: 60 });
    expect(state.levelFourCompletion?.woundOstomyCareVisit).toBeFalsy();
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null);
    const completed = visits(state).find(row => row.id === id)!;
    expect(state.levelFourCompletion?.woundOstomyCareVisit).toEqual({ serviceOperationId: id, encounterId: null,
      incomeLineId: "income.wound_care", completedAtFacilityTick: completed.completedAtFacilityTick });
    expect(state.levelFourCompletion?.acknowledgedAtFacilityTick).toBeNull();
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.wound_care").map(row => row.grossAmount)).toEqual([60]);
    expect([completed.displayName, completed.appearance, completed.clinicVisit]).toEqual(identity);
    const witness = structuredClone(state.levelFourCompletion!.woundOstomyCareVisit);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).some(row => row.incomeLineId === "income.ostomy_support" && row.completedAtFacilityTick !== null));
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.ostomy_support").map(row => row.grossAmount)).toEqual([75]);
    expect(state.levelFourCompletion!.woundOstomyCareVisit).toEqual(witness);
    expect(state.retailOrders).toEqual([]);
    expect(state.serviceIncomeReceipts.some(row => ["income.wound_supply", "income.wound_procedure"].includes(row.incomeLineId))).toBe(false);
    expect(learning(state)).toEqual(before);
  });

  it("makes an ostomy visit alone count, without requiring a wound visit or receipt retained forever", () => {
    let state = fixture();
    state.nextServiceAppointmentTicks["income.wound_care:room.wound.qa.0"] = Number.MAX_SAFE_INTEGER;
    state.nextServiceAppointmentTicks["income.ostomy_support:room.wound.qa.0"] = 1;
    state = until(state, value => Boolean(value.levelFourCompletion?.woundOstomyCareVisit));
    expect(state.levelFourCompletion!.woundOstomyCareVisit!.incomeLineId).toBe("income.ostomy_support");
    const witness = structuredClone(state.levelFourCompletion);
    state.serviceOperations = []; state.serviceIncomeReceipts = [];
    expect(deserializeGameState(serializeGameState(state), context).levelFourCompletion).toEqual(witness);
  });

  it("scales both demand streams by staffed home and meets option B without a global visitor cap", () => {
    const state = fixture(2);
    for (let i = 0; i < 540; i++) {
      state.facilityTick++; advanceEmployeeMovement(state, context); advanceServiceOperations(state, context);
      const active = visits(state).filter(row => ["in_service", "walking_to_service"].includes(row.status));
      expect(new Set(active.map(row => row.providerReservation?.kind === "employee" ? row.providerReservation.employeeId : null)).size).toBe(active.length);
    }
    const receipts = state.serviceIncomeReceipts.filter(row => ["income.wound_care", "income.ostomy_support"].includes(row.incomeLineId));
    expect(receipts.filter(row => row.incomeLineId === "income.wound_care")).toHaveLength(6);
    expect(receipts.filter(row => row.incomeLineId === "income.ostomy_support")).toHaveLength(6);
    expect(receipts.reduce((sum, row) => sum + row.grossAmount, 0)).toBe(810);
    expect(810 - 2 * (30 + 2) * 9).toBe(234);
    expect(new Set(visits(state).map(row => row.clinicVisit?.requestedRoomInstanceId)).size).toBe(2);
  });

  it("finishes care before training, keeps demand while away and freezes the returning provider's fee", () => {
    let state = until(fixture(), value => visits(value).some(row => row.status === "in_service"));
    const histories = structuredClone(state.learningHistories);
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", operationId: "wound.train", employeeId: "app.wound.0" }, context);
    expect(state.operationReceipts["wound.train"]?.status).toBe("applied");
    expect(state.employees[0]!.training?.stage).toBe("queued");
    state = until(state, value => value.employees[0]!.training?.stage === "training");
    state = deserializeGameState(serializeGameState(state), context);
    state.nextServiceAppointmentTicks["income.ostomy_support:room.wound.qa.0"] = state.facilityTick;
    state = until(state, value => visits(value).some(row => row.incomeLineId === "income.ostomy_support" && row.status === "waiting_for_resources"));
    const id = visits(state).find(row => row.incomeLineId === "income.ostomy_support")!.id;
    expect(visits(state).find(row => row.id === id)!.providerReservation).toBeNull();
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service", 400);
    const revenue = structuredClone(visits(state).find(row => row.id === id)!.appAppointmentRevenue);
    expect(revenue).toMatchObject({ baseFee: 75, providerEmployeeId: "app.wound.0", trainingPercent: 10, fee: 82.5 });
    state.employees[0]!.trainingLevel = 5;
    state.rooms.find(row => row.id === "room.wound.qa.0")!.upgradeLevel = 5;
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null);
    expect(visits(state).find(row => row.id === id)!.appAppointmentRevenue).toEqual(revenue);
    expect(state.serviceIncomeReceipts.find(row => row.actorId === id)?.grossAmount).toBe(82.5);
    expect(state.learningHistories).toEqual(histories);
  });

  it("cross-covers only spare APPs and gives pending home wound/ostomy work priority", () => {
    const state = fixture(2); state.serviceAppointmentsEnabled = false;
    for (let i = 0; i < 60; i++) { state.facilityTick++; advanceEmployeeMovement(state, context); }
    state.employees[0]!.facilityTask = { kind: "take_break", targetId: "room.wound.training", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 90 };
    const first = startServiceOperation(state, "income.wound_care", "visitor", context)!;
    const home = startServiceOperation(state, "income.ostomy_support", "visitor", context)!;
    expect([first, home].every(Boolean)).toBe(true);
    for (const operation of visits(state)) {
      operation.status = "waiting_for_resources"; operation.location = { ...state.environment.founderLocation };
      operation.path = [operation.location]; operation.pathIndex = 0;
    }
    visits(state).find(row => row.id === first)!.clinicVisit!.requestedRoomInstanceId = "room.wound.qa.0";
    visits(state).find(row => row.id === home)!.clinicVisit!.requestedRoomInstanceId = "room.wound.qa.1";
    advanceServiceOperations(state, context);
    expect(visits(state).find(row => row.id === first)!.providerReservation).toBeNull();
    expect(visits(state).find(row => row.id === home)!.providerReservation).toEqual({ kind: "employee", employeeId: "app.wound.1" });
    visits(state).find(row => row.id === home)!.status = "cancelled";
    visits(state).find(row => row.id === home)!.reservedRoomInstanceIds = [];
    visits(state).find(row => row.id === home)!.providerReservation = null;
    state.employees[1]!.facilityTask = null;
    advanceServiceOperations(state, context);
    expect(visits(state).find(row => row.id === first)!.providerReservation).toEqual({ kind: "employee", employeeId: "app.wound.1" });
  });

  it("withholds payment and completion evidence for interrupted care and never uses founder/peri-op nurses", () => {
    let state = until(fixture(), value => visits(value).some(row => row.status === "in_service"));
    const id = visits(state)[0]!.id;
    const preview = getRoomSalePreview(state, "room.wound.qa.0", context)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "wound.sell", roomId: "room.wound.qa.0", saleConfirmationToken: preview.confirmationToken }, context);
    expect(state.operationReceipts["wound.sell"]?.status).toBe("applied");
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.cancelledAtFacilityTick !== null);
    expect(state.levelFourCompletion?.woundOstomyCareVisit).toBeFalsy();
    expect(state.serviceIncomeReceipts).toEqual([]);
    state = fixture(); state.employees[0]!.staffRoleDefinitionId = "staff.periop_nurse";
    expect(getAppAppointmentHomes(state, context, "income.wound_care")).toEqual([]);
    for (const incomeLineId of ["income.wound_care", "income.ostomy_support", "income.wound_procedure"]) {
      expect(startServiceOperation(state, incomeLineId, "visitor", context)).toBeNull();
    }
    const scored = Object.values(createInitialGameState(context).encounters)[0]!;
    state.encounters[scored.id] = scored;
    expect(startEncounterProcedureOperation(state, scored, "income.wound_care", context)).toBe(false);
  });

  it("preserves accepted fees and optional legacy markers on load, while rejecting malformed new revenue", () => {
    const state = until(fixture(), value => visits(value).some(row => row.status === "in_service"));
    const operation = visits(state)[0]!;
    delete operation.appAppointmentRevenue;
    state.employees[0]!.trainingLevel = 5;
    const loaded = deserializeGameState(serializeGameState(state), context);
    expect(visits(loaded)[0]!.quoteFee).toBe(60);
    expect(visits(loaded)[0]!.appAppointmentRevenue).toBeUndefined();
    expect(visits(loaded)[0]!.clinicVisit).toEqual(operation.clinicVisit);
    operation.appAppointmentRevenue = { version: "app-appointment-revenue.v1", providerEmployeeId: "app.wound.0",
      baseFee: 60, trainingLevel: 2, trainingPercent: 10, fee: 999 };
    expect(() => deserializeGameState(serializeGameState(state), context)).toThrow("APP appointment revenue");
  });

  it("composes the existing room and APP quotes once and retains them after sale and cross-cover", () => {
    let state = fixture(2); state.serviceAppointmentsEnabled = false;
    state.rooms.find(row => row.id === "room.wound.qa.0")!.upgradeLevel = 3;
    state.rooms.find(row => row.id === "room.wound.qa.1")!.upgradeLevel = 5;
    state.employees[0]!.trainingLevel = 3; state.employees[1]!.trainingLevel = 5;
    const id = startServiceOperation(state, "income.wound_care", "visitor", context)!;
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const operation = visits(state).find(row => row.id === id)!;
    expect(operation.quoteFee).toBe(80.64); // $60 x 1.12 room x 1.20 actual APP.
    expect(operation.appAppointmentRevenue).toMatchObject({ baseFee: 67.2, fee: 80.64, providerEmployeeId: "app.wound.0" });
    const quote = structuredClone([operation.roomUpgradeRevenue, operation.appAppointmentRevenue]);
    const preview = getRoomSalePreview(state, "room.wound.qa.0", context)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "wound.sell.reroute", roomId: "room.wound.qa.0", saleConfirmationToken: preview.confirmationToken }, context);
    expect(state.operationReceipts["wound.sell.reroute"]?.status).toBe("applied");
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const rerouted = visits(state).find(row => row.id === id)!;
    expect(rerouted.providerReservation).toEqual({ kind: "employee", employeeId: "app.wound.1" });
    expect([rerouted.roomUpgradeRevenue, rerouted.appAppointmentRevenue]).toEqual(quote);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null);
    expect(state.serviceIncomeReceipts.filter(row => row.actorId === id).map(row => row.grossAmount)).toEqual([80.64]);
    expect(state.levelFourCompletion?.woundOstomyCareVisit?.serviceOperationId).toBe(id);
  });
});
