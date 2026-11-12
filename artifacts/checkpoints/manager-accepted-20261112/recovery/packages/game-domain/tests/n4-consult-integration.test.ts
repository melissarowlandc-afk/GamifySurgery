import { describe, expect, it } from "vitest";
import { QUESTION_N4_ACCEPTED_CASES, QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS,
  type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import handoff from "../../../docs/research/question-n4-runtime-integration-20261110.json";
import { createLevelFourIntegrationState } from "../../../tests/fixtures/level-four-integration";
import { PROTOTYPE_DOMAIN_CONTEXT as context, deserializeGameState, getAppAppointmentHomes,
  getCurrentQuestion, getPatientLists, serializeGameState, type DomainContext } from "../src";
import { clinicCaseMatchesLine } from "../src/clinic-consult-topics";
import { procedureConsultKind, procedureConsultPresentations } from "../src/founder-consults";
import { EXACT_TEST_CHOICE_ORDER_RECORDS, getExactTestChoiceOrderRecord } from "../src/test-choice-orders";
import { answerConsult, consultCommand as command, consultTick as tick } from "./founder-consults.fixture";
import { endoscopyReadyClinic } from "./routine-endoscopy-ready.fixture";
import { routineOrFixture } from "./routine-or-demand.fixture";

const procedures = QUESTION_N4_ACCEPTED_CASES.filter(c => procedureConsultKind(c) !== null);
const wounds = QUESTION_N4_ACCEPTED_CASES.filter(c => c.requiredClinicalSetting === "clinic");
function singleCaseContext(c: SyntheticClinicalCase): DomainContext {
  // Restrict selection to an exact accepted definition, retaining the real
  // 610-concept registry, capabilities, profiles, timings and operation rules.
  expect(context.clinicalRelease.cases.find(row => row.id === c.id)).toEqual(c);
  return { ...context, clinicalRelease: { ...context.clinicalRelease, cases: [c] } };
}
function procedureOpening(c: SyntheticClinicalCase) {
  const kind = procedureConsultKind(c)!;
  const state = structuredClone(kind === "operation" ? routineOrFixture().state : endoscopyReadyClinic().state);
  Object.assign(state, { facilityLevel: 4, paused: false, nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    nextEmployeeDiscussionTick: Number.MAX_SAFE_INTEGER });
  return { state, kind, ctx: singleCaseContext(c) };
}

describe("accepted N4 procedure and wound integration", () => {
  it("recognizes exactly four accepted OR and two endoscopy cases with their published patient profiles", () => {
    expect(procedures.filter(c => procedureConsultKind(c) === "operation")).toHaveLength(4);
    expect(procedures.filter(c => procedureConsultKind(c) === "endoscopy")).toHaveLength(2);
    for (const c of procedures) {
      const { state, kind, ctx } = procedureOpening(c);
      const row = handoff.affinity.find(row => row.caseId === c.id)!;
      expect(procedureConsultKind(c)).toBe(row.intendedLine === "income.endoscopy" ? "endoscopy" : "operation");
      const profiles = procedureConsultPresentations(state, ctx,
        kind === "operation" ? "income.ambulatory_operation" : "income.endoscopy");
      for (const p of c.approvedInstantiationProfiles?.length ? c.approvedInstantiationProfiles : [c]) {
        const demographics = p.prototypeDemographics ?? c.prototypeDemographics!;
        expect(profiles).toContainEqual({ sexLabel: demographics.sexLabel, ageYears: demographics.ageYears });
      }
    }
  });

  it("installs all eight exact approved preview-only diagnostic tuples", () => {
    expect(QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS).toEqual(handoff.acceptedDiagnosticOrders);
    expect(QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS).toHaveLength(8);
    for (const record of handoff.acceptedDiagnosticOrders) {
      expect(EXACT_TEST_CHOICE_ORDER_RECORDS.filter(row => row.caseId === record.caseId && row.nodeId === record.nodeId &&
        row.questionVariantId === record.questionVariantId && row.choiceId === record.choiceId)).toEqual([record]);
      expect(record.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
    }
  });

  it.each(procedures)("binds $id to a live procedure and preserves its hold through reload, answer and close", c => {
    let { state, kind, ctx } = procedureOpening(c);
    const roomDefinitionId = kind === "operation" ? "room.ambulatory_or" : "room.endoscopy";
    for (let i = 0; i < 600 && !state.serviceOperations.some(op => op.status === "in_service" &&
      op.frozenOperationPhases?.[op.phaseIndex]?.roomDefinitionId === roomDefinitionId); i++) state = tick(state, 1, ctx);
    const original = state.serviceOperations.find(op => op.status === "in_service" &&
      op.frozenOperationPhases?.[op.phaseIndex]?.roomDefinitionId === roomDefinitionId)!;
    expect(original).toBeDefined();
    const physical = { name: original.displayName, appearance: structuredClone(original.appearance), location: structuredClone(original.location) };
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    for (let i = 0; i < 5 && !state.serviceOperations.find(op => op.id === original.id)?.consultEncounterId; i++) state = tick(state, 1, ctx);
    const source = state.serviceOperations.find(op => op.id === original.id)!;
    const id = source.consultEncounterId!;
    expect(id).toBeTruthy();
    const encounter = state.encounters[id]!;
    expect(encounter.frozenCase.id).toBe(c.id);
    expect(encounter.consult).toMatchObject({ kind, serviceOperationId: source.id, phaseIndex: source.phaseIndex, closedAtFacilityTick: null });
    expect(encounter.patientDisplayName).toBe(physical.name);
    expect(encounter.patientAppearance).toEqual(physical.appearance);
    expect(encounter.patientLocation).toEqual(physical.location);
    expect(source).toMatchObject({ actorKind: "encounter", actorId: id, status: "in_service" });
    expect(source.reservedRoomInstanceIds).toContain(encounter.consult!.roomInstanceId);
    expect([...getPatientLists(state).waiting, ...getPatientLists(state).active].find(row => row.encounterId === id)?.actionRequired).toBe(true);
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.serviceAppointmentsEnabled = false;
    state = deserializeGameState(serializeGameState(state), context);
    state = tick(state, source.phaseEndsAtFacilityTick! - state.facilityTick + 5, ctx);
    expect(state.serviceOperations.find(op => op.id === source.id)).toMatchObject({ status: "in_service", phaseIndex: source.phaseIndex });
    state = command(state, { type: "OPEN_CHART", encounterId: id }, ctx);
    const q = getCurrentQuestion(state, id, ctx)!;
    for (const record of QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS.filter(row => row.caseId === c.id)) {
      expect(getExactTestChoiceOrderRecord(state.encounters[id]!, q.node, record.choiceId)).toEqual(record);
    }
    state = answerConsult(state, id, ctx);
    expect(state.serviceOperations.find(op => op.id === source.id)!.phaseIndex).toBe(source.phaseIndex);
    state = command(state, { type: "CLOSE_CHART", encounterId: id }, ctx);
    for (let i = 0; i < 300 && state.serviceOperations.find(op => op.id === source.id)!.completedAtFacilityTick === null; i++) state = tick(state, 1, ctx);
    expect(state.serviceOperations.find(op => op.id === source.id)!.completedAtFacilityTick).not.toBeNull();
    expect(state.serviceIncomeReceipts.filter(row => row.transactionKey.includes(source.id))).toHaveLength(1);
    // Future-planned diagnostics never order the already-running procedure or
    // introduce another service operation while answering its consult.
    expect(state.serviceOperations.every(op => op.id === source.id || op.createdAtFacilityTick <= encounter.waiting.arrivedAtTick)).toBe(true);
  });

  it.each(wounds)("selects $id from the actual wound clinic, retaining venous affinity", c => {
    const ctx = singleCaseContext(c), line = "income.wound_care";
    expect(clinicCaseMatchesLine(c, line)).toBe(true);
    let state = createLevelFourIntegrationState(`n4.wound.${c.id}`);
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
    for (const key of Object.keys(state.nextServiceAppointmentTicks)) state.nextServiceAppointmentTicks[key] = Number.MAX_SAFE_INTEGER;
    const homes = getAppAppointmentHomes(state, ctx, line);
    expect(homes.length).toBeGreaterThan(0);
    for (const home of homes) state.nextServiceAppointmentTicks[`${line}:${home}`] = state.facilityTick + 1;
    for (let i = 0; i < 300 && !state.serviceOperations.some(op => op.incomeLineId === line && op.status === "in_service"); i++) state = tick(state, 1, ctx);
    const source = state.serviceOperations.find(op => op.incomeLineId === line && op.status === "in_service")!;
    expect(source).toBeDefined();
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    state = tick(state, 1, ctx);
    const id = state.serviceOperations.find(op => op.id === source.id)!.consultEncounterId!;
    expect(state.encounters[id]?.frozenCase.id).toBe(c.id);
    expect(state.encounters[id]?.consult).toMatchObject({ kind: "wound_ostomy", serviceOperationId: source.id });
  });

  it.each(procedures)("never offers $id as an ordinary arrival without its procedure source", c => {
    let { state, ctx } = procedureOpening(c);
    state.serviceAppointmentsEnabled = false;
    state = tick(state, 60, ctx); // Hired staff reach their rooms; capabilities are live.
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    state = tick(state, 10, ctx);
    expect(state.serviceOperations).toHaveLength(0);
    expect(Object.values(state.encounters)).toHaveLength(0);
    expect(state.routineArrivalSequence).toBe(0);
  });

  it.each(["operation", "endoscopy"] as const)("still admits ordinary clinic content when an unsourced %s question is due", kind => {
    const procedural = procedures.find(c => procedureConsultKind(c) === kind)!;
    const ordinary = context.clinicalRelease.cases.find(c => c.id === "case.ventral-hernia.pulmonary-optimization.a")!;
    let { state } = procedureOpening(procedural);
    const ctx = { ...context, clinicalRelease: { ...context.clinicalRelease, cases: [procedural, ordinary] } };
    state.serviceAppointmentsEnabled = false;
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    state = tick(state, 1, ctx);
    expect(Object.values(state.encounters).map(e => e.frozenCase.id)).toEqual([ordinary.id]);
    expect(Object.values(state.encounters)[0]!.consult).toBeUndefined();
  });

  it("preserves an already-frozen unsourced procedural chart on load rather than rejecting or converting it", () => {
    const c = procedures.find(c => procedureConsultKind(c) === "operation")!;
    let { state, ctx } = procedureOpening(c);
    state.serviceAppointmentsEnabled = false;
    // Explicit admission constructs the shape produced by the old fallback;
    // the new source restriction applies to automatic offers, not save reopen.
    state = command(state, { type: "ADMIT_PATIENT", encounterId: "legacy.unsourced.or", caseId: c.id,
      patientDisplayName: c.patientDisplayName, arrivalClass: "routine" }, ctx);
    const frozen = structuredClone(state.encounters["legacy.unsourced.or"]!.frozenCase);
    state = deserializeGameState(serializeGameState(state), context);
    state = tick(state, 40, ctx);
    state = command(state, { type: "OPEN_CHART", encounterId: "legacy.unsourced.or" }, ctx);
    expect(state.encounters["legacy.unsourced.or"]!.frozenCase).toEqual(frozen);
    expect(state.openChartEncounterId).toBe("legacy.unsourced.or");
    expect(state.encounters["legacy.unsourced.or"]!.consult).toBeUndefined();
  });
});
