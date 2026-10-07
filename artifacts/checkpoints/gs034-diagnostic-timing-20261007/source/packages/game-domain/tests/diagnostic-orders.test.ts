import { ANSWER_CHOICE_TIMING_REGISTRY } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getAnswerChoiceServicePreview, getDiagnosticOrderPlans, getDiagnosticOrderTiming,
  getPendingResultEta, serializeGameState, type GameState } from "../src";
import { getDiagnosticChoicePlanning } from "../src/diagnostic-order-requests";
import { timingFixture } from "./diagnostic-timing-fixtures";

function readyFixture(caseId: string, index = 0) {
  const fixture = timingFixture();
  const { state, encounter, context } = fixture;
  const clinicalCase = context.clinicalRelease.cases.find((entry) => entry.id === caseId);
  if (!clinicalCase) throw new Error(caseId);
  encounter.frozenCase = structuredClone(clinicalCase);
  encounter.arrivalClass = "routine";
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.currentNodeIndex = index;
  encounter.terminalFeedback = null;
  encounter.steps = encounter.frozenCase.decisionNodes.map((node, nodeIndex) => ({
    nodeIndex, decisionNodeId: node.id, questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
    status: nodeIndex < index ? "completed" : nodeIndex === index ? "action_required" : "locked", answer: null, result: null,
  }));
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  state.openChartEncounterId = encounter.id;
  state.attendedEncounterId = null;
  return fixture;
}

function order(fixture: ReturnType<typeof readyFixture>, choiceId?: string): GameState {
  const node = fixture.encounter.frozenCase.decisionNodes[fixture.encounter.currentNodeIndex]!;
  const answerOperationId = `diagnostic.answer.${fixture.encounter.id}`;
  const enactOperationId = `diagnostic.enact.${fixture.encounter.id}`;
  let state = gameReducer(fixture.state, { type: "SUBMIT_ANSWER", operationId: answerOperationId, encounterId: fixture.encounter.id,
    decisionNodeId: node.id, answerChoiceId: choiceId ?? node.answerChoices.find((choice) => choice.isCorrect)!.id }, fixture.context);
  expect(state.operationReceipts[answerOperationId]?.status).toBe("applied");
  if (state.encounters[fixture.encounter.id]!.steps[fixture.encounter.currentNodeIndex]!.status === "feedback_pending") {
    state = gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: enactOperationId, encounterId: fixture.encounter.id, decisionNodeId: node.id }, fixture.context);
    expect(state.operationReceipts[enactOperationId]?.status).toBe("applied");
  }
  return state;
}

function tick(fixture: ReturnType<typeof readyFixture>, state: GameState, predicate: (state: GameState) => boolean, limit = 700): GameState {
  for (let count = 0; !predicate(state) && count < limit; count++) {
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `diagnostic.tick.${state.facilityTick}` }, fixture.context);
  }
  expect(predicate(state), JSON.stringify(getDiagnosticOrderPlans(state).map((plan) => ({ phases: plan.phases.map((phase) => [phase.kind, phase.status, phase.serviceOperationId]), result: plan.resultReady, care: plan.careComplete })))).toBe(true);
  return state;
}

describe("facility diagnostic orders and answer estimates", () => {
  it("provides a pure facility-dependent quote for every current testing choice, including distractors", () => {
    const fixture = readyFixture("case.esophageal-dysphagia.bread-sticking");
    const cases = new Map(fixture.context.clinicalRelease.cases.map((entry) => [entry.id, entry]));
    let testingChoices = 0;
    for (const entry of ANSWER_CHOICE_TIMING_REGISTRY) {
      if (entry.classification.kind !== "test_choices") continue;
      const clinicalCase = cases.get(entry.caseId);
      const node = clinicalCase?.decisionNodes.find((candidate) => candidate.id === entry.nodeId && candidate.questionVariantId === entry.questionVariantId);
      if (!clinicalCase || !node) continue;
      fixture.encounter.frozenCase = clinicalCase;
      for (const choice of entry.classification.choices) {
        if (choice.timing.kind !== "test") continue;
        const before = JSON.stringify(fixture.state);
        const diagnostic = getDiagnosticChoicePlanning(fixture.state, fixture.encounter, node, choice.choiceId, fixture.context);
        expect(diagnostic, `${entry.caseId}/${choice.choiceId}`).not.toBeNull();
        expect(diagnostic!.quote.kind, `${entry.caseId}/${choice.choiceId}`).toBe("planned");
        if (diagnostic!.quote.kind === "planned") {
          expect(Math.max(...diagnostic!.quote.plan.phases.map((phase) => phase.forecast.endsAtTick))).toBeGreaterThan(fixture.state.facilityTick);
        } else expect(diagnostic!.quote.estimateMinutes).toBeGreaterThan(0);
        expect(JSON.stringify(fixture.state)).toBe(before);
        testingChoices++;
      }
    }
    expect(testingChoices).toBeGreaterThan(1000);
  }, 30_000);

  it("freezes the same quoted phases at acceptance and preserves wholly external120-minute laboratory work", () => {
    const fixture = readyFixture("case.fhh.suggestive-results-confirmation");
    const node = fixture.encounter.frozenCase.decisionNodes[0]!;
    const choice = node.answerChoices.find((candidate) => candidate.isCorrect)!;
    const preview = getAnswerChoiceServicePreview(fixture.state, fixture.encounter.id, choice.id, fixture.context)!;
    let state = order(fixture);
    const plan = state.encounters[fixture.encounter.id]!.terminalTestOrder!.diagnosticTiming!;
    expect(plan.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes])).toEqual(
      preview.diagnosticTiming!.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes]));
    expect(plan.phases.filter((phase) => phase.durationMinutes).map((phase) => phase.durationMinutes)).toEqual([120]);
    expect(preview.durationTicks).toBe(Math.max(...plan.phases.map((phase) => phase.forecast.endsAtTick)));
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.careComplete.reachedAtTick !== null);
    expect(getDiagnosticOrderPlans(state)[0]!.careComplete.reachedAtTick).toBe(preview.durationTicks);
    expect(state.serviceIncomeReceipts).toHaveLength(0);
  });

  it("starts named labs with15-minute collection and15-minute onsite processing, without an extra processing fee", () => {
    const fixture = readyFixture("case.fhh.suggestive-results-confirmation");
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    let state = order(fixture);
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.resultReady.reachedAtTick !== null);
    const plan = getDiagnosticOrderPlans(state)[0]!;
    expect(plan.phases.filter((phase) => phase.durationMinutes).map((phase) => [phase.kind, phase.durationMinutes])).toEqual([["collection", 15], ["laboratory_processing", 15]]);
    expect(state.serviceOperations.filter((operation) => operation.diagnosticPhaseWork)).toHaveLength(1);
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.laboratory_processing")).toHaveLength(0);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    const restored = deserializeGameState(serializeGameState(state), fixture.context);
    expect(getDiagnosticOrderPlans(restored)).toEqual(getDiagnosticOrderPlans(state));
  });

  it("keeps visual findings ready during protected Endoscopy recovery and preserves care on chart open/close", () => {
    const fixture = readyFixture("case.recovered-diverticulitis.drained-abscess");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    let state = order(fixture);
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.resultReady.reachedAtTick !== null);
    const plan = getDiagnosticOrderPlans(state)[0]!;
    expect(plan.phases.some((phase) => phase.kind === "pathology")).toBe(false);
    expect(plan.careComplete.reachedAtTick).toBeNull();
    const operation = state.serviceOperations.find((entry) => entry.diagnosticPhysicalWork)!;
    expect(operation.periopBedReservation).toBeDefined();
    const care = structuredClone(operation.periopBedReservation);
    state = gameReducer(state, { type: "OPEN_CHART", operationId: "diagnostic.view", encounterId: fixture.encounter.id }, fixture.context);
    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "diagnostic.close", encounterId: fixture.encounter.id }, fixture.context);
    expect(state.serviceOperations.find((entry) => entry.id === operation.id)!.periopBedReservation).toEqual(care);
    expect(state.encounters[fixture.encounter.id]!.pendingResult!.deliveredAtTick).toBeNull();
    state = tick(fixture, state, (candidate) => candidate.encounters[fixture.encounter.id]!.currentNodeIndex === 1);
    expect(getDiagnosticOrderPlans(state)[0]!.careComplete.reachedAtTick).not.toBeNull();
  });

  it.each(["case.pigmented-skin-lesion.changing-back-lesion", "case.internal-hemorrhoids.commute"])(
    "reserves the founder for a founder-only local procedure in %s", (caseId) => {
      const fixture = readyFixture(caseId);
      fixture.addRoom("room.minor_procedure");
      let state = order(fixture);
      const plan = getDiagnosticOrderPlans(state)[0]!;
      const procedure = plan.phases.find((phase) => phase.kind === "procedure")!;
      expect(procedure.resource?.provider).toEqual({ kind: "founder" });
      state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.careComplete.reachedAtTick !== null);
      expect(getDiagnosticOrderPlans(state)[0]!.phases.find((phase) => phase.id === procedure.id)?.status).toBe("completed");
      expect(state.serviceIncomeReceipts).toHaveLength(1);
    });

  it("suppresses a finite ETA when accepted local processing loses all compatible capacity", () => {
    const fixture = readyFixture("case.fhh.suggestive-results-confirmation");
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    let state = order(fixture);
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.phases.some((phase) => phase.kind === "collection" && phase.status === "completed"));
    state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.laboratory_technician");
    expect(getPendingResultEta(state, fixture.encounter.id, fixture.context)).toBeNull();
  });

  it("resumes only remaining laboratory work after capacity loss, a blocked save and replacement staffing", () => {
    const fixture = readyFixture("case.fhh.suggestive-results-confirmation");
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.state.cash = 20_000;
    fixture.state.cashCents = 2_000_000;
    let state = order(fixture);
    state = tick(fixture, state, (candidate) => candidate.serviceOperations.some((operation) => operation.diagnosticPhaseWork && operation.status === "in_service"));
    const workId = state.serviceOperations.find((operation) => operation.diagnosticPhaseWork)!.id;
    const beganAt = state.facilityTick;
    state = tick(fixture, state, (candidate) => candidate.facilityTick === beganAt + 5);
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "diagnostic.reject.busy-dismissal",
      employeeId: "staff.laboratory_technician.1" }, fixture.context);
    expect(state.operationReceipts["diagnostic.reject.busy-dismissal"]?.status).toBe("rejected");
    state.employees.find((employee) => employee.id === "staff.laboratory_technician.1")!.homeRoomInstanceId = null;
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "diagnostic.processor-unavailable" }, fixture.context);
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "diagnostic.dismiss.processor",
      employeeId: "staff.laboratory_technician.1" }, fixture.context);
    expect(state.operationReceipts["diagnostic.dismiss.processor"]?.status).toBe("applied");
    expect(state.serviceOperations.find((operation) => operation.id === workId)?.diagnosticPhaseWork?.remainingMinutes).toBe(9);
    expect(getDiagnosticOrderTiming(state, fixture.encounter.id, fixture.context)).toMatchObject({ blocked: true, totalRemainingTicks: null });
    state = deserializeGameState(serializeGameState(state), fixture.context);
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "diagnostic.replace.processor",
      employeeId: "processor.replacement", staffRoleDefinitionId: "staff.laboratory_technician" }, fixture.context);
    expect(state.operationReceipts["diagnostic.replace.processor"]?.status).toBe("applied");
    state = tick(fixture, state, (candidate) => candidate.serviceOperations.find((operation) => operation.id === workId)?.status === "in_service");
    const resumedAt = state.serviceOperations.find((operation) => operation.id === workId)!.phaseStartedAtFacilityTick!;
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.resultReady.reachedAtTick !== null);
    const work = state.serviceOperations.find((operation) => operation.id === workId)!;
    expect(work.completedAtFacilityTick! - resumedAt).toBe(9);
    expect(state.serviceOperations.filter((operation) => operation.diagnosticPhysicalWork)).toHaveLength(1);
    expect(state.serviceOperations.filter((operation) => operation.diagnosticPhaseWork)).toHaveLength(1);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it.each([1, 2])("executes image reads serially per radiologist and concurrently across %i staffed positions", (readerCount) => {
    const fixture = readyFixture("case.breast-cyst.under-30-asymptomatic-simple");
    fixture.addRoom("room.reading", "staff.radiologist", readerCount);
    const second = structuredClone(fixture.encounter);
    second.id = "encounter.second-image";
    second.patientDisplayName = "Second Image Patient";
    let state = order(fixture);
    state.encounters[second.id] = second;
    state = order({ ...fixture, state, encounter: second });
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate).every((plan) => plan.resultReady.reachedAtTick !== null));
    const reads = state.serviceOperations.filter((operation) => operation.diagnosticPhaseWork?.kind === "interpretation");
    expect(reads).toHaveLength(2);
    expect(reads.every((operation) => operation.diagnosticPhaseWork!.durationMinutes === 5)).toBe(true);
    const starts = reads.map((operation) => operation.startedAtFacilityTick!);
    if (readerCount === 1) {
      expect(new Set(reads.map((operation) => operation.diagnosticPhaseWork!.resource!.employeeIds[0]))).toHaveLength(1);
      const sorted = [...reads].sort((a, b) => a.startedAtFacilityTick! - b.startedAtFacilityTick!);
      expect(sorted[1]!.startedAtFacilityTick).toBeGreaterThanOrEqual(sorted[0]!.completedAtFacilityTick!);
    } else {
      expect(new Set(reads.map((operation) => operation.diagnosticPhaseWork!.resource!.stationId))).toHaveLength(2);
      expect(starts[0]).toBe(starts[1]);
    }
    expect(state.serviceIncomeReceipts).toHaveLength(0);
  });

  it.each([
    ["case.mammary-paget.crusted-nipple", "room.ultrasound"],
    ["case.primary-aldosteronism.resistant-three-drugs", "room.ct"],
  ])("includes and executes the outside patient visit after the local component of %s", (caseId, roomId) => {
    const fixture = readyFixture(caseId, 1);
    fixture.addRoom(roomId, "staff.imaging_technician");
    const node = fixture.encounter.frozenCase.decisionNodes[1]!;
    const diagnostic = getDiagnosticChoicePlanning(fixture.state, fixture.encounter, node,
      node.answerChoices.find((choice) => choice.isCorrect)!.id, fixture.context)!;
    expect(diagnostic.quote.kind).toBe("planned");
    if (diagnostic.quote.kind !== "planned") throw new Error("Missing compound fixture plan");
    const quoted = diagnostic.quote.plan;
    expect(quoted.phases).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "acquisition", mode: "local" }),
      expect.objectContaining({ id: "diagnostic.remainder.patient_departure" }),
      expect.objectContaining({ id: "diagnostic.remainder", patientPresent: true }),
      expect.objectContaining({ id: "diagnostic.remainder.patient_return" }),
    ]));
    let state = order(fixture);
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.phases.some((phase) =>
      phase.id === "diagnostic.remainder" && phase.status === "active"));
    expect(state.encounters[fixture.encounter.id]!.patientLocation).toBeNull();
    expect(getDiagnosticOrderPlans(state)[0]!.careComplete.reachedAtTick).toBeNull();
    state = deserializeGameState(serializeGameState(state), fixture.context);
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.careComplete.reachedAtTick !== null, 1200);
    const completed = getDiagnosticOrderPlans(state)[0]!;
    expect(completed.phases.every((phase) => phase.status === "completed")).toBe(true);
    expect(completed.careComplete.reachedAtTick).toBe(Math.max(...quoted.phases.map((phase) => phase.forecast.endsAtTick)));
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("delivers a local pathology result on its actual completion tick after care has returned", () => {
    const fixture = readyFixture("case.thyroid-nodule.palpable-referral");
    fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    // Keep the exterior entrance at the map boundary, and put local care near
    // Front Desk so return finishes before the thirty-minute pathology phase.
    for (const room of fixture.state.rooms.filter((room) => room.id.startsWith("room.fixture."))) room.y += 60;
    fixture.encounter.patientLocation!.y += 60;
    for (const employee of fixture.state.employees) {
      employee.location.y += 60;
      employee.path = [{ ...employee.location }];
    }
    let state = order(fixture);
    state = tick(fixture, state, (candidate) => getDiagnosticOrderPlans(candidate)[0]!.resultReady.reachedAtTick !== null);
    const plan = getDiagnosticOrderPlans(state)[0]!;
    expect(plan.phases.some((phase) => phase.kind === "pathology" && phase.mode === "local")).toBe(true);
    expect(plan.careComplete.reachedAtTick).not.toBeNull();
    expect(plan.careComplete.reachedAtTick!).toBeLessThan(plan.resultReady.reachedAtTick!);
    expect(state.encounters[fixture.encounter.id]!.pendingResult!.deliveredAtTick).toBe(plan.resultReady.reachedAtTick);
    expect(state.encounters[fixture.encounter.id]!.currentNodeIndex).toBe(1);
  });
});
