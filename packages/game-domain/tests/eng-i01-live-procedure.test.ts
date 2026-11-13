import { afterEach, describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema } from "@gamify-surgery/clinical-content";
import { clinicalCaseHasSupportedPatientSemantics, deserializeGameState, getClinicalCaseEligibilityIssue,
  getCurrentQuestion, pediatricRoomAtPoint, pediatricStillEligibleEntries, procedureConsultKind, serializeGameState,
  gameReducer, getRoomSalePreview, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "../src";
import { declaredProcedurePresentation, selectProcedureConsult } from "../src/founder-consults";
import { clinicCaseMatchesLine, pediatricConsultPresentations } from "../src/clinic-consult-topics";
import { normalizeProcedureVisit, procedureCaseRequiresSource } from "../src/procedure-context";
import { answerConsult } from "./founder-consults.fixture";
import { advanceEngProcedure, engCommand, engProcedureClinic, engTick, mechanicalProcedureCase,
  openEngConsult, registerMechanicalTiming } from "./eng-i01-live-procedure.fixture";

const cleanups: Array<() => void> = [];
afterEach(() => {for (const cleanup of cleanups.splice(0)) cleanup();});
const operation = (state: GameState, id: string) => state.serviceOperations.find(op => op.id === id)!;
const reload = (state: GameState, context: Parameters<typeof deserializeGameState>[1]) => {
  const loaded = deserializeGameState(serializeGameState(state), context);
  // The existing source-consult reader refreshes its non-decaying live score
  // clock on load; assert all other persisted data and optional metadata.
  const expected = JSON.parse(serializeGameState(state));
  const actual = JSON.parse(serializeGameState(loaded));
  for (const [id, encounter] of Object.entries(expected.encounters) as Array<[string, {consult?: unknown; lastSatisfactionDecayAtTick: number}]>) {
    if (encounter.consult) {
      expect(actual.encounters[id].lastSatisfactionDecayAtTick).toBeGreaterThanOrEqual(encounter.lastSatisfactionDecayAtTick);
      expect(actual.encounters[id].lastSatisfactionDecayAtTick).toBeLessThanOrEqual(state.facilityTick);
      actual.encounters[id].lastSatisfactionDecayAtTick = encounter.lastSatisfactionDecayAtTick;
    }
  }
  expect(actual).toEqual(expected);
  return loaded;
};

describe("ENG-I01 declarative live source admission", () => {
  it("does not weight procedure presentations by duplicate question records", () => {
    const c = mechanicalProcedureCase("operation");
    const {state, context} = engProcedureClinic("operation", c);
    const expanded = {...context, clinicalRelease: {...context.clinicalRelease,
      cases: [...context.clinicalRelease.cases, {...c, id: `${c.id}.other-version`}]}};
    for (let n = 0; n < 10; n++) expect(declaredProcedurePresentation(state, expanded, "income.ambulatory_operation", `sample.${n}`))
      .toEqual(declaredProcedurePresentation(state, context, "income.ambulatory_operation", `sample.${n}`));
  });

  it("does not reinterpret the generic EUS/ERCP line as a declared EGD/colonoscopy source", () => {
    const c = mechanicalProcedureCase("endoscopy");
    if (c.procedureContext?.mode !== "live") throw new Error("Expected a mechanical live context");
    c.procedureContext.allowedIncomeLineIds = ["income.advanced_endoscopy"];
    const {state, context} = engProcedureClinic("endoscopy", c);
    expect(procedureConsultKind(c)).toBeNull();
    expect(declaredProcedurePresentation(state, context, "income.advanced_endoscopy", "advanced.family")).toBeUndefined();
    expect(() => normalizeProcedureVisit({version: "procedure-visit.v1", kind: "endoscopy", familyId: "procedure.egd",
      demographics: {ageYears: 40, sexLabel: "Female"}}, "income.advanced_endoscopy")).toThrow(/procedure visit/);
    c.procedureContext.familyId = "procedure.ercp";
    expect(procedureConsultKind(c)).toBeNull();
    expect(procedureCaseRequiresSource(c)).toBe(true);
  });

  it.each(["missing_family", "missing_capability"] as const)("keeps actual timing, fees and cash byte-exact when a %s candidate cannot be offered", unavailable => {
    const c = mechanicalProcedureCase("operation");
    if (unavailable === "missing_family") delete c.procedureContext;
    else if (c.procedureContext?.mode === "live") c.procedureContext.requiredCapabilityIds = ["capability.unavailable_frozen_section"];
    const {state, context, id} = engProcedureClinic("operation", c);
    const controlContext = {...context, clinicalRelease: {...context.clinicalRelease, cases: context.clinicalRelease.cases.filter(row => row.id !== c.id)}};
    state.nextRoutineArrivalTick = state.facilityTick;
    const actual = engTick(structuredClone(state), context, 450);
    const control = engTick(structuredClone(state), controlContext, 450);
    // Receipt operation IDs identify the test's commands, not gameplay outcomes.
    actual.operationReceipts = {}; control.operationReceipts = {};
    expect(serializeGameState(actual)).toBe(serializeGameState(control));
    expect(operation(actual, id).completedAtFacilityTick).not.toBeNull();
    expect(actual.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
  });
  it.each(["operation", "endoscopy"] as const)("schedules and freezes a %s family before live admission; holds a two-node chart through close", kind => {
    const c = mechanicalProcedureCase(kind, false, true);
    let {state, context, id} = engProcedureClinic(kind, c);
    const frozen = structuredClone(operation(state, id).procedureContext);
    expect(frozen).toMatchObject({version: "procedure-visit.v1", familyId: c.procedureContext!.familyId, kind});
    expect(operation(state, id).consultEncounterId).toBeUndefined();
    state = reload(state, context);
    state = advanceEngProcedure(state, context, id);
    const quote = operation(state, id).quoteFee;
    const opened = openEngConsult(state, context, id); state = opened.state;
    const encounterId = opened.encounterId;
    expect(state.encounters[encounterId]!.consult).toMatchObject({kind, serviceOperationId: id});
    expect(state.encounters[encounterId]!.patientAppearance).toEqual(operation(state, id).appearance);
    expect(operation(state, id).procedureContext).toEqual(frozen);
    const phaseIndex = operation(state, id).phaseIndex;
    state = engTick(state, context, 140);
    expect(operation(state, id)).toMatchObject({phaseIndex, completedAtFacilityTick: null, quoteFee: quote});
    state = reload(state, context);
    const question = getCurrentQuestion(state, encounterId, context)!;
    state = engCommand(state, {type: "SUBMIT_ANSWER", encounterId, decisionNodeId: question.node.id,
      answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id, reviewedAtMs: state.facilityTick * 1000}, context);
    state = engCommand(state, {type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId, decisionNodeId: question.node.id}, context);
    expect(state.encounters[encounterId]!.currentNodeIndex).toBe(1);
    expect(getCurrentQuestion(state, encounterId, context)!.node.currentUpdate).toBe("Mechanical second observation checkpoint.");
    state = answerConsult(state, encounterId, context);
    state = engTick(state, context, 5);
    expect(operation(state, id).phaseIndex).toBe(phaseIndex);
    state = engCommand(state, {type: "CLOSE_CHART", encounterId}, context);
    for (let n = 0; n < 400 && operation(state, id).completedAtFacilityTick === null; n++) state = engTick(state, context);
    expect(operation(state, id).completedAtFacilityTick).not.toBeNull();
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
    expect(operation(state, id).quoteFee).toBe(quote);
    reload(state, context);
  });

  it.each(["family", "room", "capability", "nurse", "provider", "phase"] as const)("does not offer a live chart when %s is incompatible", missing => {
    const c = mechanicalProcedureCase("operation");
    let {state, context, id} = engProcedureClinic("operation", c);
    state = advanceEngProcedure(state, context, id);
    const op = operation(state, id), before = structuredClone(op);
    if (missing === "family") op.procedureContext!.familyId = "procedure.laparoscopic_cholecystectomy";
    if (missing === "room") state.rooms = state.rooms.filter(room => !op.reservedRoomInstanceIds.includes(room.id));
    if (missing === "capability" && c.procedureContext?.mode === "live") c.procedureContext.requiredCapabilityIds = ["capability.unavailable_frozen_section"];
    if (missing === "nurse") state.employees = state.employees.filter(e => e.staffRoleDefinitionId !== "staff.or_nurse");
    if (missing === "provider") op.providerReservation = null;
    if (missing === "phase") op.status = "walking_between_phases";
    expect(selectProcedureConsult(state, context, 1000, new Set())).toBeNull();
    expect(op.consultEncounterId).toBeUndefined();
    expect(op.quoteFee).toBe(before.quoteFee);
    expect(op.phaseEndsAtFacilityTick).toBe(before.phaseEndsAtFacilityTick);
    expect(state.serviceIncomeReceipts).toHaveLength(0);
  });

  it.each(["missing", "unknown", "result_gate", "service_choice"] as const)("never offers unsupported %s live content as an ordinary arrival", unsupported => {
    const c = mechanicalProcedureCase("operation");
    if (unsupported === "missing") delete c.procedureContext;
    if (unsupported === "unknown" && c.procedureContext?.mode === "live") c.procedureContext.familyId = "procedure.unsupported_hospital_operation";
    if (unsupported === "result_gate") c.decisionNodes[0]!.resultGateAfter = {mechanical: true} as never;
    if (unsupported === "service_choice") c.decisionNodes[0]!.answerChoices[0]!.serviceRequest = {serviceId: "service.mechanical"} as never;
    const {state, context} = engProcedureClinic("operation", c);
    expect(procedureConsultKind(c)).toBeNull();
    expect(procedureCaseRequiresSource(c)).toBe(true);
    const admitted = gameReducer(state, {type: "ADMIT_PATIENT", operationId: "eng.rejected", encounterId: "eng.unsourced", caseId: c.id, patientDisplayName: c.patientDisplayName, arrivalClass: "routine"}, context);
    expect(admitted.operationReceipts["eng.rejected"]?.status).toBe("rejected");
    state.nextRoutineArrivalTick = state.facilityTick;
    const advanced = engTick(state, context, 5);
    expect(Object.values(advanced.encounters)).toHaveLength(0);
    expect(advanced.serviceOperations.some(op => op.consultEncounterId)).toBe(false);
  });

  it("admits hospital record reviews through the ordinary clinic route with explicit record metadata", () => {
    const c = mechanicalProcedureCase("operation");
    c.requiredClinicalSetting = "clinic";
    c.procedureContext = {version: "procedure-context.v1", mode: "chart_review", familyId: "procedure.hospital_operation",
      recordKind: "operative_note", recordCheckpoint: "Recorded postoperative checkpoint"};
    const {state, context} = engProcedureClinic("operation", c);
    const admitted = engCommand(state, {type: "ADMIT_PATIENT", encounterId: "eng.record", caseId: c.id, patientDisplayName: c.patientDisplayName, arrivalClass: "routine"}, context);
    expect(admitted.encounters["eng.record"]!.consult).toBeUndefined();
    expect(admitted.encounters["eng.record"]!.frozenCase.procedureContext).toEqual(c.procedureContext);
    reload(admitted, context);
  });
});

describe("ENG-I01 pediatric live procedures", () => {
  it("keeps procedure-only children out of the pediatric clinic handoff and permits ordinary pediatric record framing", () => {
    const c = mechanicalProcedureCase("endoscopy", true);
    const {state, context} = engProcedureClinic("endoscopy", c);
    expect(clinicCaseMatchesLine(c, "income.pediatric_consult")).toBe(false);
    expect(pediatricConsultPresentations(state, context)).toEqual([]);
    c.requiredClinicalSetting = "clinic";
    c.procedureContext = {version: "procedure-context.v1", mode: "chart_review", familyId: "procedure.hospital_operation",
      recordKind: "operative_note", recordCheckpoint: "Recorded checkpoint"};
    expect(clinicalCaseHasSupportedPatientSemantics(c)).toBe(true);
    expect(clinicCaseMatchesLine(c, "income.pediatric_consult")).toBe(true);
  });
  it.each(["operation", "endoscopy"] as const)("freezes one child/parent for %s, with consent, onsite updates, recovery and one payment", kind => {
    const c = mechanicalProcedureCase(kind, true, true); cleanups.push(registerMechanicalTiming(c));
    expect(clinicalCaseHasSupportedPatientSemantics(c)).toBe(true);
    let {state, context, id} = engProcedureClinic(kind, c);
    const source = operation(state, id), familyId = source.clinicVisit!.pediatricFamilyId!;
    const familyContext = source.procedureContext!.pediatricFamilyContext!;
    const appearance = structuredClone(source.appearance);
    expect(source.clinicVisit?.kind).toBe("pediatric_procedure");
    expect(source.displayName).toBe(familyContext.childName);
    expect(source.appearance?.stillId).toBe(familyContext.childStillId);
    expect(state.retailExternalActors.filter(actor => actor.pediatricFamilyId === familyId)).toHaveLength(1);
    state = reload(state, context);
    let sawConsent = false;
    for (let n = 0; n < 700; n++) {
      const op = operation(state, id), family = state.pediatricFamilies![familyId]!;
      if (op.status === "in_service" && op.phaseIndex === 0) {
        sawConsent = true;
        expect(family.procedureFlow?.phase).toBe("consent");
        const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
        expect(parent.location).toEqual(family.procedureFlow!.parentCheckpoint!.location);
        state = reload(state, context);
        break;
      }
      state = engTick(state, context);
    }
    expect(sawConsent).toBe(true);
    state = advanceEngProcedure(state, context, id);
    const family = state.pediatricFamilies![familyId]!, parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
    expect(parent.procedureCompanion).toBeUndefined();
    expect(parent.displayName).toBe(familyContext.parentName);
    expect(pediatricRoomAtPoint(state, context, parent.location)?.roomDefinitionId).toBe("room.periop_recovery");
    expect(pediatricRoomAtPoint(state, context, operation(state, id).location)?.roomDefinitionId).toBe(kind === "operation" ? "room.ambulatory_or" : "room.endoscopy");
    state = reload(state, context); // Explicitly supported child/parent separation.
    const opened = openEngConsult(state, context, id); state = opened.state;
    expect(state.encounters[opened.encounterId]!.pediatricFamilyId).toBe(familyId);
    expect(state.encounters[opened.encounterId]!.patientAppearance).toEqual(appearance);
    expect(state.pediatricFamilies![familyId]!.procedureFlow?.phase).toBe("update");
    expect(state.retailExternalActors.filter(actor => actor.pediatricFamilyId === familyId)).toHaveLength(1);
    state = reload(state, context);
    state = answerConsult(state, opened.encounterId, context);
    state = engCommand(state, {type: "CLOSE_CHART", encounterId: opened.encounterId}, context);
    let sawRecovery = false;
    for (let n = 0; n < 450; n++) {
      if (state.pediatricFamilies![familyId]!.procedureFlow?.phase === "recovery") {
        sawRecovery = true;
        state = reload(state, context);
      }
      if (operation(state, id).completedAtFacilityTick !== null) break;
      state = engTick(state, context);
    }
    expect(sawRecovery).toBe(true);
    expect(operation(state, id).completedAtFacilityTick).not.toBeNull();
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
    expect(state.levelFourCompletion?.pediatricVisitWithParent ?? null).toBeNull();
    state = engTick(state, context, 90);
    expect(state.pediatricFamilies![familyId]!.phase).toBe("departed");
    expect(state.retailExternalActors.find(actor => actor.pediatricFamilyId === familyId)?.lifecycle).toBe("departed");
    reload(state, context);
  });

  it.each(["missing", "level", "disconnected", "outage", "ordinary_exam"] as const)("does not schedule or admit children with %s pediatric gate", missing => {
    const c = mechanicalProcedureCase("operation", true);
    const {state, context, id} = engProcedureClinic("operation", c, missing !== "missing");
    if (missing === "level") state.facilityLevel = 3;
    if (missing === "disconnected") state.doors = state.doors.filter(d => d.roomId !== "eng.pediatric");
    if (missing === "outage") state.rooms.find(r => r.id === "eng.pediatric")!.maintenance = {status: "out_of_service", dueAtFacilityTick: 0,
      outOfServiceAtFacilityTick: 0, completedUses: 0, appliedUseKeys: []};
    if (missing === "ordinary_exam") state.rooms.find(r => r.id === "eng.pediatric")!.roomDefinitionId = "room.examination";
    expect(getClinicalCaseEligibilityIssue(state, c, context, new Set(["capability.pediatric_consult", ...c.requiredCapabilityIds]))).not.toBeNull();
    if (missing === "missing") expect(operation(state, id).procedureContext).toBeUndefined();
    const admitted = gameReducer(state, {type: "ADMIT_PATIENT", operationId: "eng.child.unsourced", encounterId: "eng.child", caseId: c.id, patientDisplayName: c.patientDisplayName, arrivalClass: "routine"}, context);
    expect(admitted.operationReceipts["eng.child.unsourced"]?.status).toBe("rejected");
  });

  it("keeps undeclared/unrelated pediatric semantics and unsupported diagnostics closed", () => {
    const c = mechanicalProcedureCase("endoscopy", true);
    const undeclared = structuredClone(c); delete undeclared.procedureContext;
    expect(clinicalCaseHasSupportedPatientSemantics(undeclared)).toBe(false);
    const wrongArt = structuredClone(c);
    if (wrongArt.procedureContext?.mode === "live") wrongArt.procedureContext.pediatricFamilyContext!.childStillId = pediatricStillEligibleEntries(c.prototypeDemographics!.sexLabel === "Male" ? "Female" : "Male", c.prototypeDemographics!.ageYears)[0]!.stillId;
    expect(clinicalCaseHasSupportedPatientSemantics(wrongArt)).toBe(false);
    const promise = structuredClone(c);
    promise.decisionNodes[0]!.answerChoices[1]!.serviceRequest = {serviceId: "service.mri"} as never;
    expect(clinicalCaseHasSupportedPatientSemantics(promise)).toBe(false);
  });

  it.each([5, 8, 9, 12, 13, 17])("requires the exact supported child art at age %i", age => {
    const c = mechanicalProcedureCase("operation", true);
    c.prototypeDemographics!.ageYears = age;
    c.approvedInstantiationProfiles![0]!.prototypeDemographics!.ageYears = age;
    if (c.procedureContext?.mode === "live") c.procedureContext.pediatricFamilyContext!.childStillId =
      pediatricStillEligibleEntries(c.prototypeDemographics!.sexLabel, age)[0]!.stillId;
    expect(clinicalCaseHasSupportedPatientSemantics(c)).toBe(true);
    expect(syntheticClinicalCaseSchema.safeParse(c).success).toBe(true);
  });

  it.each([4, 18])("does not extend live pediatric admission to age %i", age => {
    const c = mechanicalProcedureCase("operation", true);
    c.prototypeDemographics!.ageYears = age;
    c.approvedInstantiationProfiles![0]!.prototypeDemographics!.ageYears = age;
    expect(clinicalCaseHasSupportedPatientSemantics(c)).toBe(false);
    expect(syntheticClinicalCaseSchema.safeParse(c).success).toBe(false);
  });

  it("keeps an admitted child/parent/source across pediatric gate removal and still settles once", () => {
    const c = mechanicalProcedureCase("operation", true);
    let {state, context, id} = engProcedureClinic("operation", c);
    state = advanceEngProcedure(state, context, id);
    const opened = openEngConsult(state, context, id); state = opened.state;
    const frozen = structuredClone(state.encounters[opened.encounterId]!.frozenCase);
    const familyId = state.encounters[opened.encounterId]!.pediatricFamilyId!;
    state = engCommand(state, {type: "SELL_ROOM", roomId: "eng.pediatric"}, context);
    state = reload(state, context);
    expect(getClinicalCaseEligibilityIssue(state, c, context)).not.toBeNull(); // Fresh demand is closed.
    expect(state.encounters[opened.encounterId]!.frozenCase).toEqual(frozen);
    expect(state.pediatricFamilies![familyId]!.procedureFlow?.phase).toBe("update");
    state = answerConsult(state, opened.encounterId, context);
    state = engCommand(state, {type: "CLOSE_CHART", encounterId: opened.encounterId}, context);
    state = engTick(state, context, 350);
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
    reload(state, context);
  });

  it("preserves the frozen unanswered chart and onsite parent when the source room is sold", () => {
    const c = mechanicalProcedureCase("operation", true);
    let {state, context, id} = engProcedureClinic("operation", c);
    state = advanceEngProcedure(state, context, id);
    const opened = openEngConsult(state, context, id); state = opened.state;
    const familyId = state.encounters[opened.encounterId]!.pediatricFamilyId!;
    const roomId = state.encounters[opened.encounterId]!.consult!.roomInstanceId;
    state = engCommand(state, {type: "SELL_ROOM", roomId, saleConfirmationToken: getRoomSalePreview(state, roomId, context)!.confirmationToken}, context);
    state = engTick(state, context, 3);
    expect(operation(state, id).status).toBe("cancelled");
    expect(state.encounters[opened.encounterId]!.resolutionReason).toBeNull();
    expect(state.encounters[opened.encounterId]!.frozenCase.procedureContext).toEqual(c.procedureContext);
    expect(state.retailExternalActors.find(actor => actor.id === state.pediatricFamilies![familyId]!.parentActorId)?.lifecycle).toBe("onsite");
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(0);
    const loaded = deserializeGameState(serializeGameState(state), context);
    // Existing departing-employee/idle-clock repairs are independent of the
    // frozen patient, family and cancelled source that this regression owns.
    expect(loaded.encounters[opened.encounterId]!.frozenCase).toEqual(state.encounters[opened.encounterId]!.frozenCase);
    expect(loaded.encounters[opened.encounterId]!.patientAppearance).toEqual(state.encounters[opened.encounterId]!.patientAppearance);
    expect(loaded.learningHistories).toEqual(state.learningHistories);
    expect(loaded.pediatricFamilies).toEqual(state.pediatricFamilies);
    expect(operation(loaded, id).procedureContext).toEqual(operation(state, id).procedureContext);
    expect(serializeGameState(deserializeGameState(serializeGameState(loaded), context))).toBe(serializeGameState(loaded));
  });

  it.each(["flow_version", "source", "family", "appearance", "adult_companion", "unmarked_separation"] as const)("rejects malformed saved pediatric %s", broken => {
    const c = mechanicalProcedureCase("operation", true);
    let {state, context, id} = engProcedureClinic("operation", c);
    state = advanceEngProcedure(state, context, id);
    const raw = JSON.parse(serializeGameState(state)), op = raw.serviceOperations.find((op: {id: string}) => op.id === id);
    const family = raw.pediatricFamilies[op.clinicVisit.pediatricFamilyId];
    if (broken === "flow_version") family.procedureFlow.version = "unknown";
    if (broken === "source") family.procedureFlow.serviceOperationId = "absent.source";
    if (broken === "family") op.procedureContext.familyId = "procedure.egd";
    if (broken === "appearance") op.procedureContext.pediatricFamilyContext.childStillId = "absent.child";
    if (broken === "adult_companion") raw.retailExternalActors.find((actor: {id: string}) => actor.id === family.parentActorId).procedureCompanion = {};
    if (broken === "unmarked_separation") delete family.procedureFlow;
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow();
  });
});

describe("ENG-I01 optional schema and legacy shape", () => {
  it("retains exact old procedural tuples without opening a family-less future version", () => {
    const c = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c => c.id === "case.n4.cholecystectomy-neck-plane-bailout.v1")!);
    expect(procedureConsultKind(c)).toBe("operation");
    c.decisionNodes[0]!.questionVariantId += ".future";
    expect(procedureConsultKind(c)).toBeNull();
    expect(procedureCaseRequiresSource(c)).toBe(true);
  });
  it("requires exact versioned context fields and preserves omission", () => {
    const c = mechanicalProcedureCase("operation");
    expect(syntheticClinicalCaseSchema.safeParse(c).success).toBe(true);
    const invalid = structuredClone(c) as unknown as Record<string, unknown>;
    invalid.procedureContext = {version: "procedure-context.v1", mode: "live", kind: "operation"};
    expect(syntheticClinicalCaseSchema.safeParse(invalid).success).toBe(false);
    delete c.procedureContext;
    expect(syntheticClinicalCaseSchema.parse(c)).not.toHaveProperty("procedureContext");
  });
});
