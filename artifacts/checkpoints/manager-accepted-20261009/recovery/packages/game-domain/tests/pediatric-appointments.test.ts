import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import { createPediatricAppointmentsQaState } from "../../../tests/fixtures/pediatric-appointments";
import { createPediatricFamilyFixture } from "../../../tests/fixtures/pediatric-families";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { advanceEmployeeMovement, advanceServiceOperations, deserializeGameState, gameReducer, getAppAppointmentHomes,
  getRoomDefinition, getRoomSalePreview, getEligibleServiceRoute, planDiagnosticOrder, pediatricFamilyForActor, pediatricPairAtReservation, pediatricRoomAtPoint, serializeGameState,
  startEncounterProcedureOperation, startServiceOperation, type GameState } from "../src";

const context = createLevelFourRoomsQaContext();
let sequence = 0;
const visits = (state: GameState) => state.serviceOperations.filter(row => row.clinicVisit?.kind === "pediatric_consult");
const learning = (state: GameState) => ({ xp: state.clinicalXp, histories: state.learningHistories, intents: state.reviewIntents,
  settlements: state.settlements, encounters: state.encounters, chart: state.openChartEncounterId, attended: state.attendedEncounterId });
function sameRoom(state: GameState) {
  for (const op of visits(state)) {
    const family = pediatricFamilyForActor(state, "service_visitor", op.id)!;
    const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
    expect(pediatricRoomAtPoint(state, context, parent.location)?.id, `Parent split from ${op.id}`).toBe(pediatricRoomAtPoint(state, context, op.location)?.id);
    if (!op.location) expect(parent.location).toBeNull();
    if (family.reservation) expect(family.reservation.parentSeatId?.startsWith("kid")).toBe(false);
  }
}
function minute(state: GameState) {
  const next = gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `peds.visit.tick.${sequence++}` }, context);
  sameRoom(next); return next;
}
function until(state: GameState, predicate: (value: GameState) => boolean, limit = 400) {
  for (let i = 0; i < limit && !predicate(state); i++) state = minute(state);
  expect(predicate(state), JSON.stringify(visits(state).map(row => ({ status: row.status, location: row.location, reason: row.resourceWaitReason,
    provider: row.providerReservation, path: row.path.length, index: row.pathIndex })))).toBe(true);
  return state;
}

describe("M5c pediatric APP appointments", () => {
  it("runs a family through waiting, exam and departure, freezes fees and earns a durable witness without learning", () => {
    let state = createPediatricAppointmentsQaState(context);
    const before = structuredClone(learning(state));
    state = until(state, value => visits(value).some(row => row.status === "waiting_for_resources"));
    const op = visits(state)[0]!;
    const id = op.id;
    const family = pediatricFamilyForActor(state, "service_visitor", id)!;
    expect(family.reservation?.roomInstanceId).toBe("room.peds.wait");
    expect(op.clinicVisit?.demographics.ageYears).toBeGreaterThanOrEqual(5);
    expect(op.clinicVisit?.demographics.ageYears).toBeLessThanOrEqual(17);
    expect(state.retailExternalActors).toHaveLength(1);
    const identity = JSON.parse(JSON.stringify([op.clinicVisit, op.appearance, op.displayName, state.retailExternalActors[0]?.appearance, state.retailExternalActors[0]?.displayName]));
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const active = visits(state).find(row => row.id === id)!;
    const activeFamily = pediatricFamilyForActor(state, "service_visitor", id)!;
    expect(pediatricPairAtReservation(state, activeFamily)).toBe(true);
    expect(activeFamily.reservation).toMatchObject({ childSeatId: "table:patient", parentSeatId: "parentChair", roomInstanceId: "room.peds.exam.0" });
    expect(active.appAppointmentRevenue).toMatchObject({ fee: 80, providerEmployeeId: "app.peds.0" });
    expect(JSON.parse(JSON.stringify([active.clinicVisit, active.appearance, active.displayName, state.retailExternalActors[0]?.appearance, state.retailExternalActors[0]?.displayName]))).toEqual(identity);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "completed");
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.pediatric_consult").map(row => row.grossAmount)).toEqual([80]);
    expect(state.levelFourCompletion?.pediatricVisitWithParent).toMatchObject({ serviceOperationId: id, parentActorId: family.parentActorId });
    expect(learning(state)).toEqual(before);
    const witness = structuredClone(state.levelFourCompletion);
    state.serviceAppointmentsEnabled = false;
    state.serviceOperations = []; state.pediatricFamilies = {}; state.retailExternalActors = [];
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.levelFourCompletion).toEqual(witness);
  });

  it("reuses independent per-home demand and has option-B salary/upkeep coverage", () => {
    const state = createPediatricAppointmentsQaState(context, 2);
    const line = getServiceIncomeLine("income.pediatric_consult")!;
    expect(getAppAppointmentHomes(state, context, line.id)).toHaveLength(2);
    const cost = state.employees[0]!.salaryPerExpenseInterval + getRoomDefinition("room.pediatric_examination", context)!.upkeepPerExpenseInterval +
      getRoomDefinition("room.pediatric_waiting", context)!.upkeepPerExpenseInterval;
    expect(cost).toBe(33);
    expect(line.fee * 60 / line.operation!.arrivalCadenceMinutes! - cost).toBeCloseTo(20.3333333);
    for (let i = 0; i < 600; i++) {
      state.facilityTick++; advanceEmployeeMovement(state, context); advanceServiceOperations(state, context); sameRoom(state);
    }
    // Six completed visits per home in ten hours; the seventh is still in
    // transit/care at the cutoff. Installed demand remains every 90 minutes.
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === line.id)).toHaveLength(12);
    expect(new Set(visits(state).map(row => row.clinicVisit?.requestedRoomInstanceId)).size).toBe(2);
    expect(state.nextServiceAppointmentTicks[line.id]).toBeUndefined();
  });

  it("routes a future scored fixture only to Pediatric Examination and disallows pediatric procedure starts", () => {
    let { state, encounter } = createPediatricFamilyFixture(10, context);
    state = gameReducer(state, { type: "OPEN_CHART", operationId: "peds.fixture.chart", encounterId: encounter.id }, context);
    expect(state.operationReceipts["peds.fixture.chart"]?.status).toBe("applied");
    expect(state.encounters[encounter.id]?.patientMovement?.destinationRoomInstanceId).toBe("room.peds.exam");
    expect(state.pediatricFamilies![encounter.pediatricFamilyId!]!.reservation?.parentSeatId).toBe("parentChair");
    const checkScoredPair = () => {
      const child = state.encounters[encounter.id]!;
      const parent = state.retailExternalActors.find(row => row.id === child.pediatricFamilyId!.replace("pediatric-family.", "parent."))!;
      expect(pediatricRoomAtPoint(state, context, child.patientLocation)?.id).toBe(pediatricRoomAtPoint(state, context, parent.location)?.id);
    };
    for (let i = 0; i < 80 && state.encounters[encounter.id]!.patientMovement; i++) { state = minute(state); checkScoredPair(); }
    expect(state.encounters[encounter.id]?.assignedRoomInstanceId).toBe("room.peds.exam");
    expect(pediatricPairAtReservation(state, state.pediatricFamilies![encounter.pediatricFamilyId!]!)).toBe(true);
    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "peds.fixture.close", encounterId: encounter.id }, context);
    for (let i = 0; i < 80 && state.encounters[encounter.id]!.patientMovement; i++) { state = minute(state); checkScoredPair(); }
    state = deserializeGameState(serializeGameState(state), context);
    state = gameReducer(state, { type: "OPEN_CHART", operationId: "peds.fixture.reopen", encounterId: encounter.id }, context);
    for (let i = 0; i < 80 && state.encounters[encounter.id]!.patientMovement; i++) { state = minute(state); checkScoredPair(); }
    expect(pediatricPairAtReservation(state, state.pediatricFamilies![encounter.pediatricFamilyId!]!)).toBe(true);
    for (const line of ["income.mri", "income.endoscopy", "income.ambulatory_operation", "income.wound_procedure"]) {
      expect(startEncounterProcedureOperation(state, state.encounters[encounter.id]!, line, context)).toBe(false);
    }
    for (const serviceId of ["service.mrcp", "service.endoscopy", "service.endoscopy.eus-ercp-sampling"]) {
      expect(getEligibleServiceRoute(state, serviceId, null, context, encounter.id)).toBeNull();
      expect(planDiagnosticOrder(state, { serviceId, orderId: `peds.restricted.${serviceId}`, encounterId: encounter.id }, context).kind).toBe("unavailable");
    }
    // Fixture-only lifecycle states exercise the future M7 results/discharge
    // seams without adding or activating a pediatric teaching point.
    state.encounters[encounter.id]!.lifecycle = "active_pending_result";
    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "peds.fixture.results", encounterId: encounter.id }, context);
    for (let i = 0; i < 20; i++) { state = minute(state); checkScoredPair(); }
    state = deserializeGameState(serializeGameState(state), context);
    checkScoredPair();
    expect(state.pediatricFamilies![encounter.pediatricFamilyId!]!.phase).toBe("results_wait");
    state.encounters[encounter.id]!.lifecycle = "resolved_summary_available";
    state.encounters[encounter.id]!.terminalFeedback = {
      kind: "completion", outcome: null, consequence: null, correction: null, acknowledged: true,
    };
    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "peds.fixture.discharge", encounterId: encounter.id }, context);
    for (let i = 0; i < 80 && state.encounters[encounter.id]!.patientLocation; i++) { state = minute(state); checkScoredPair(); }
    expect(state.encounters[encounter.id]!.patientLocation).toBeNull();
    expect(state.pediatricFamilies![encounter.pediatricFamilyId!]!.phase).toBe("departed");
  });

  it("waits through real APP training and freezes the actual returning provider's fee", () => {
    let state = createPediatricAppointmentsQaState(context);
    state = until(state, value => visits(value).some(row => row.status === "in_service"));
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", operationId: "peds.train", employeeId: "app.peds.0" }, context);
    expect(state.operationReceipts["peds.train"]?.status).toBe("applied");
    expect(state.employees[0]?.training?.stage).toBe("queued");
    state = until(state, value => value.employees[0]?.training?.stage === "training");
    state.nextServiceAppointmentTicks["income.pediatric_consult:room.peds.exam.0"] = state.facilityTick;
    state = until(state, value => visits(value).some(row => row.status === "waiting_for_resources"));
    const id = visits(state).find(row => row.status === "waiting_for_resources")!.id;
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null);
    const operation = visits(state).find(row => row.id === id)!;
    expect(operation.appAppointmentRevenue).toMatchObject({ fee: 88, trainingPercent: 10, providerEmployeeId: "app.peds.0" });
    const frozen = structuredClone(operation.appAppointmentRevenue);
    state.employees[0]!.trainingLevel = 5;
    state = deserializeGameState(serializeGameState(state), context);
    expect(visits(state).find(row => row.id === id)?.appAppointmentRevenue).toEqual(frozen);
  });

  it("keeps a stalled family together after door loss and reload, then resumes with no unpaid credit", () => {
    let state = createPediatricAppointmentsQaState(context);
    state = until(state, value => visits(value).some(row => row.status === "walking_to_service"));
    const id = visits(state).find(row => row.status === "walking_to_service")!.id;
    state.serviceAppointmentsEnabled = false;
    const door = state.doors.find(row => row.id === "room.peds.exam.0.door")!;
    state.doors = state.doors.filter(row => row.id !== door.id);
    const op = visits(state).find(row => row.id === id)!;
    const family = pediatricFamilyForActor(state, "service_visitor", id)!;
    const frozenIdentity = structuredClone([op.appearance, state.retailExternalActors.find(row => row.id === family.parentActorId)!.appearance]);
    for (let i = 0; i < 90; i++) state = minute(state);
    expect(visits(state).find(row => row.id === id)?.status).toBe("waiting_for_resources");
    expect(state.serviceIncomeReceipts).toHaveLength(0);
    expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
    state = deserializeGameState(serializeGameState(state), context); sameRoom(state);
    state.doors.push(door);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "completed");
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect([visits(state).find(row => row.id === id)!.appearance, state.retailExternalActors.find(row => row.id === family.parentActorId)!.appearance]).toEqual(frozenIdentity);
  });

  it("evacuates a sold exam together and preserves remaining work and the frozen fee in a second home", () => {
    let state = createPediatricAppointmentsQaState(context, 2);
    state.serviceAppointmentsEnabled = false;
    const id = startServiceOperation(state, "income.pediatric_consult", "visitor", context)!;
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const active = visits(state).find(row => row.id === id)!;
    const roomId = active.reservedRoomInstanceIds[0]!;
    const frozenFee = structuredClone(active.appAppointmentRevenue);
    const sale = getRoomSalePreview(state, roomId, context)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "peds.sale", roomId, saleConfirmationToken: sale.confirmationToken }, context);
    expect(state.operationReceipts["peds.sale"]?.status).toBe("applied");
    sameRoom(state);
    expect(visits(state).find(row => row.id === id)?.saleTransfer?.remainingPhaseMinutes).toBe(30);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "completed");
    expect(visits(state).find(row => row.id === id)?.appAppointmentRevenue).toEqual(frozenFee);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.levelFourCompletion?.pediatricVisitWithParent?.serviceOperationId).toBe(id);
  });

  it("departs together without payment or completion when the last pediatric exam is sold", () => {
    let state = createPediatricAppointmentsQaState(context);
    state.serviceAppointmentsEnabled = false;
    const id = startServiceOperation(state, "income.pediatric_consult", "visitor", context)!;
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const roomId = visits(state).find(row => row.id === id)!.reservedRoomInstanceIds[0]!;
    const sale = getRoomSalePreview(state, roomId, context)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "peds.last.sale", roomId, saleConfirmationToken: sale.confirmationToken }, context);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "cancelled");
    expect(state.serviceIncomeReceipts).toHaveLength(0);
    expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
    expect(state.retailExternalActors.find(row => row.linkedServiceOperationId === id)?.location).toBeNull();
  });
});
