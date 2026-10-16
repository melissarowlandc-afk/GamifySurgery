import { describe, expect, it } from "vitest";
import { createMriAppointmentsQaState } from "../../../tests/fixtures/mri-appointments";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { deserializeGameState, forecastDiagnosticOrderPlan, gameReducer, getAnswerChoiceServicePreview, getDiagnosticOrderPlans,
  getEligibleServiceRoute, getRoomStaffCapacity, planDiagnosticOrder, serializeGameState, type DiagnosticOrderPlan, type GameState } from "../src";
import { getDiagnosticChoicePlanning } from "../src/diagnostic-order-requests";
import { timingFixture } from "./diagnostic-timing-fixtures";

const context = createLevelFourRoomsQaContext();
let sequence = 0;
const visits = (state: GameState) => state.serviceOperations.filter(row => row.clinicVisit?.kind === "mri");
const learning = (state: GameState) => ({ xp: state.clinicalXp, histories: state.learningHistories, intents: state.reviewIntents,
  settlements: state.settlements, encounters: state.encounters, chart: state.openChartEncounterId, attended: state.attendedEncounterId });
function minute(state: GameState) {
  return gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `mri.minute.${sequence++}` }, context);
}
function until(state: GameState, predicate: (state: GameState) => boolean, limit = 360) {
  for (let i = 0; i < limit && !predicate(state); i++) state = minute(state);
  expect(predicate(state), JSON.stringify(visits(state).map(row => ({ status: row.status, reason: row.resourceWaitReason,
    plan: row.diagnosticTiming?.phases.map(phase => [phase.kind, phase.status, phase.serviceOperationId]) })))).toBe(true);
  return state;
}
function planned(quote: ReturnType<typeof planDiagnosticOrder>): DiagnosticOrderPlan {
  expect(quote.kind).toBe("planned");
  if (quote.kind !== "planned") throw new Error(quote.reason);
  return quote.plan;
}

describe("M6 MRI acquisition and reading", () => {
  it("uses exact adult equivalence opt-in, keeps outside protocols and excludes generic/pediatric MRI", () => {
    const fixture = timingFixture();
    fixture.state.facilityLevel = 4;
    fixture.addRoom("room.mri", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    const request = { orderId: "mri.plan", encounterId: fixture.encounter.id, serviceId: "service.mrcp", allowedRouteIds: ["route.mrcp.outsourced"] };
    const before = JSON.stringify(fixture.state);
    expect(planned(planDiagnosticOrder(fixture.state, { ...request, allowOnsiteEquivalents: true }, fixture.context)).sources[0]?.routeId).toBe("route.mrcp.in_house");
    const outside = planned(planDiagnosticOrder(fixture.state, { ...request, allowOnsiteEquivalents: false }, fixture.context));
    expect(outside.sources[0]?.routeId).toBe("route.mrcp.outsourced");
    expect(outside.phases.filter(phase => phase.durationMinutes).map(phase => [phase.mode, phase.durationMinutes])).toEqual([["external", 150], ["external", 30]]);
    expect(getEligibleServiceRoute(fixture.state, "service.mrcp", request.allowedRouteIds, fixture.context)?.route.id).toBe("route.mrcp.in_house");
    expect(getEligibleServiceRoute(fixture.state, "service.mrcp", request.allowedRouteIds, fixture.context, fixture.encounter.id, false)?.route.id).toBe("route.mrcp.outsourced");
    for (const serviceId of ["service.breast_mri", "service.liver_mri", "service.pelvic_mri", "service.hepatobiliary_contrast_mrcp", "service.imaging.repeat-mri-mrcp"]) {
      const plan = planned(planDiagnosticOrder(fixture.state, { ...request, serviceId, allowedRouteIds: null, allowOnsiteEquivalents: true }, fixture.context));
      expect(plan.phases.some(phase => phase.requirement?.roomDefinitionId === "room.mri")).toBe(false);
    }
    expect(planned(planDiagnosticOrder(fixture.state, { orderId: "generic.preview", encounterId: fixture.encounter.id,
      timingProfileId: "timing.test.mri" }, fixture.context)).phases.some(phase => phase.mode === "local" && phase.requirement)).toBe(false);
    expect(JSON.stringify(fixture.state)).toBe(before);
    fixture.encounter.frozenCase.pediatricProfile = { version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" };
    expect(planDiagnosticOrder(fixture.state, request, fixture.context)).toMatchObject({ kind: "unavailable", estimateMinutes: null });
    expect(getEligibleServiceRoute(fixture.state, "service.mrcp", null, fixture.context, fixture.encounter.id)).toBeNull();
  });

  it("falls back to the full inclusive outside visit when acquisition is missing, even with a reader", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.reading", "staff.radiologist");
    const plan = planned(planDiagnosticOrder(fixture.state, { orderId: "mri.outside", encounterId: fixture.encounter.id, serviceId: "service.mrcp" }, fixture.context));
    expect(plan.sources[0]).toMatchObject({ routeId: "route.mrcp.outsourced", inclusiveDurationMinutes: 180 });
    expect(plan.sources[0]?.readIncomeFee).toBeUndefined();
    expect(plan.phases.filter(phase => phase.durationMinutes).map(phase => phase.durationMinutes)).toEqual([150, 30]);
  });

  it("runs scheduled visitors through real MRI and Reading rooms, saves each phase and pays acquisition plus one additive read", () => {
    let state = createMriAppointmentsQaState(context);
    const before = structuredClone(learning(state));
    expect(getRoomStaffCapacity(state, "staff.imaging_technician").capacity).toBe(1);
    expect(state.employees.find(row => row.id === "tech.mri.qa")?.homeRoomInstanceId).toBe("room.mri.qa");
    state = until(state, value => visits(value).some(row => row.status === "arriving"));
    const id = visits(state)[0]!.id;
    const identity = structuredClone([visits(state)[0]!.displayName, visits(state)[0]!.appearance, visits(state)[0]!.clinicVisit]);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "in_service");
    const visit = visits(state).find(row => row.id === id)!;
    expect(visit.reservedRoomInstanceIds).toEqual(["room.mri.qa"]);
    expect(visit.reservedEmployeeIds).toEqual(["tech.mri.qa"]);
    expect(visit.phaseEndsAtFacilityTick! - visit.phaseStartedAtFacilityTick!).toBe(60);
    expect(state.serviceOperations.some(row => row.diagnosticPhaseWork?.orderId === visit.diagnosticTiming!.orderId)).toBe(false);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.status === "waiting_for_results");
    const acquired = visits(state).find(row => row.id === id)!;
    expect(acquired.completedAtFacilityTick).toBeNull();
    expect(acquired.reservedEmployeeIds).toEqual([]);
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.mri").map(row => row.grossAmount)).toEqual([240]);
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => value.serviceOperations.some(row => row.diagnosticPhaseWork?.orderId === acquired.diagnosticTiming!.orderId && row.status === "in_service"));
    const reading = state.serviceOperations.find(row => row.diagnosticPhaseWork?.orderId === acquired.diagnosticTiming!.orderId)!;
    const readKey = `income.diagnostic-read.${reading.diagnosticPhaseWork!.orderId}.${reading.diagnosticPhaseWork!.phaseId}`;
    expect(reading.reservedRoomInstanceIds).toEqual(["room.mri.reading"]);
    expect(reading.reservedEmployeeIds).toEqual(["reader.mri.qa"]);
    expect(reading.diagnosticPhaseWork).toMatchObject({ durationMinutes: 5, readIncomeFee: 5 });
    state = deserializeGameState(serializeGameState(state), context);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null);
    const completed = visits(state).find(row => row.id === id)!;
    expect(completed.diagnosticTiming!.resultReady.reachedAtTick).not.toBeNull();
    expect(state.serviceIncomeReceipts.filter(row => row.transactionKey === readKey).map(row => row.grossAmount)).toEqual([5]);
    expect([completed.displayName, completed.appearance, completed.clinicVisit]).toEqual(identity);
    expect(learning(state)).toEqual(before);
    const receipts = state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.mri" || row.transactionKey === readKey);
    state = deserializeGameState(serializeGameState(state), context);
    for (let i = 0; i < 10; i++) state = minute(state);
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.mri" || row.transactionKey === readKey)).toEqual(receipts);
  });

  it("freezes external reading without a local reader and does not reprice or append another read on reload", () => {
    let state = createMriAppointmentsQaState(context);
    state.employees = state.employees.filter(row => row.staffRoleDefinitionId !== "staff.radiologist");
    state = until(state, value => visits(value).some(row => row.status === "in_service"));
    const id = visits(state)[0]!.id;
    const saved = structuredClone(visits(state)[0]!.diagnosticTiming);
    expect(saved!.phases.find(phase => phase.kind === "interpretation")).toMatchObject({ mode: "external", durationMinutes: 30 });
    state.rooms.find(row => row.id === "room.mri.qa")!.upgradeLevel = 5;
    state.employees.find(row => row.id === "tech.mri.qa")!.trainingLevel = 5;
    state = deserializeGameState(serializeGameState(state), context);
    expect(visits(state)[0]!.diagnosticTiming).toEqual(saved);
    state = until(state, value => visits(value).find(row => row.id === id)?.completedAtFacilityTick !== null);
    const visit = visits(state).find(row => row.id === id)!;
    const read = visit.diagnosticTiming!.phases.find(phase => phase.kind === "interpretation")!;
    expect(read.completedAtTick! - read.startedAtTick!).toBe(30);
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.mri").map(row => row.grossAmount)).toEqual([240]);
    expect(state.serviceOperations.some(row => row.diagnosticPhaseWork)).toBe(false);
  });

  it("quotes busy scanner work in the same queue without reserving resources or mutating frozen jobs", () => {
    let state = createMriAppointmentsQaState(context);
    state = until(state, value => visits(value).some(row => row.status === "in_service"));
    const before = JSON.stringify(state);
    const quote = planned(planDiagnosticOrder(state, { orderId: "mri.queued", encounterId: "preview.only", serviceId: "service.mri",
      patientOrigin: { x: 35, y: 29 } }, context));
    const acquisition = quote.phases.find(row => row.kind === "acquisition")!;
    expect(acquisition.forecast.queueMinutes).toBeGreaterThan(0);
    expect(forecastDiagnosticOrderPlan(state, quote, context).blockedPhaseIds).toEqual([]);
    expect(JSON.stringify(state)).toBe(before);
  });

  it("executes an existing adult MRCP chart through the scanner and reader with the quoted result ETA", () => {
    const fixture = timingFixture();
    fixture.state.facilityLevel = 4;
    fixture.context.balanceRelease.facility.maximumPlayableLevel = 4;
    fixture.addRoom("room.mri", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    const clinicalCase = fixture.context.clinicalRelease.cases.find(row => row.decisionNodes.some(node => node.resultGateAfter?.resultTypeId === "service.mrcp"))!;
    expect(clinicalCase).toBeDefined();
    const encounter = fixture.encounter;
    encounter.frozenCase = structuredClone(clinicalCase);
    encounter.arrivalClass = "routine"; encounter.lifecycle = "active_action_required"; encounter.checkInStatus = "checked_in";
    encounter.currentNodeIndex = encounter.frozenCase.decisionNodes.findIndex(node => node.resultGateAfter?.resultTypeId === "service.mrcp");
    encounter.steps = encounter.frozenCase.decisionNodes.map((node, nodeIndex) => ({ nodeIndex, decisionNodeId: node.id, questionVariantId: node.questionVariantId,
      primaryConceptId: node.primaryConceptId, status: nodeIndex < encounter.currentNodeIndex ? "completed" : nodeIndex === encounter.currentNodeIndex ? "action_required" : "locked", answer: null, result: null }));
    fixture.state.openChartEncounterId = encounter.id; fixture.state.serviceAppointmentsEnabled = false;
    fixture.state.nextRoutineArrivalTick = fixture.state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
    const choice = node.answerChoices.find(row => row.isCorrect)!;
    const diagnostic = getDiagnosticChoicePlanning(fixture.state, encounter, node, choice.id, fixture.context)!;
    expect(diagnostic.executionAllowed).toBe(true);
    expect(getAnswerChoiceServicePreview(fixture.state, encounter.id, choice.id, fixture.context)?.diagnosticTiming?.sources[0]?.routeId).toBe("route.mrcp.in_house");
    let state = gameReducer(fixture.state, { type: "SUBMIT_ANSWER", operationId: "mri.chart.answer", encounterId: encounter.id, decisionNodeId: node.id, answerChoiceId: choice.id }, fixture.context);
    state = gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "mri.chart.enact", encounterId: encounter.id, decisionNodeId: node.id }, fixture.context);
    const initialPlan = getDiagnosticOrderPlans(state)[0]!;
    expect(initialPlan.sources[0]?.routeId).toBe("route.mrcp.in_house");
    state = deserializeGameState(serializeGameState(state), fixture.context);
    for (let i = 0; i < 500 && getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick === null; i++) {
      state = gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `mri.chart.tick.${i}` }, fixture.context);
    }
    const plan = getDiagnosticOrderPlans(state)[0]!;
    expect(plan.resultReady.reachedAtTick).not.toBeNull();
    expect(plan.phases.find(row => row.kind === "interpretation")?.completedAtTick).toBe(plan.resultReady.reachedAtTick);
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.mri").map(row => row.grossAmount)).toEqual([240]);
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.radiologist_in_house_read").map(row => row.grossAmount)).toEqual([5]);
  });
});
