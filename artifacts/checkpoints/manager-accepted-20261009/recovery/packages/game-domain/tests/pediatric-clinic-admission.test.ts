import { describe, expect, it } from "vitest";
import { PEDIATRIC_CLINIC_CASES, PEDIATRIC_CLINIC_FAMILY_CONTEXTS, SYNTHETIC_CLINICAL_RELEASE,
  type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID as encounterId } from "../../../tests/fixtures/pediatric-charts";
import { applyFsrsReview, characterStillCatalogEntryById, clinicalCaseHasSupportedPatientSemantics,
  createInitialGameState, createNewFsrsCard, deserializeGameState, gameReducer, getClinicalCaseEligibilityIssue,
  getRoutinePatientAvailability, pediatricFamilyForActor, pediatricPairAtReservation, pediatricRoomAtPoint,
  pediatricStillEligibleEntries, PROTOTYPE_DOMAIN_CONTEXT, reconcilePediatricFamilies, recordPediatricVisitCompletion,
  selectRoutineClinicalCase, serializeGameState, type DomainContext, type GameCommand, type GameState } from "../src";

const context = createLevelFourRoomsQaContext();
const NOW = 1_000_000;
let sequence = 0;
const onlyCases = (cases: SyntheticClinicalCase[]): DomainContext => ({ ...context,
  clinicalRelease: { ...context.clinicalRelease, cases } });
function vacantState(): GameState {
  const state = createPediatricChartsQaState(context);
  state.encounters = {}; state.pediatricFamilies = {}; state.retailExternalActors = [];
  state.openChartEncounterId = null; state.attendedEncounterId = null;
  state.paused = false; state.nextRoutineArrivalTick = 0;
  return state;
}
function apply(state: GameState, command: GameCommand, ctx = context): GameState {
  const next = gameReducer(state, command, ctx);
  expect(next.operationReceipts[command.operationId], command.operationId).toMatchObject({ status: "applied" });
  return next;
}
function pairTogether(state: GameState): void {
  const child = state.encounters[encounterId]!;
  const family = pediatricFamilyForActor(state, "encounter", encounterId)!;
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
  expect(pediatricRoomAtPoint(state, context, child.patientLocation)?.id).toBe(pediatricRoomAtPoint(state, context, parent.location)?.id);
  if (!child.patientLocation) expect(parent.location).toBeNull();
}
function until(state: GameState, predicate: (state: GameState) => boolean): GameState {
  for (let i = 0; i < 240 && !predicate(state); i++) {
    state = apply({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `m7.tick.${sequence++}` });
    pairTogether(state);
  }
  expect(predicate(state), JSON.stringify(state.encounters[encounterId])).toBe(true);
  return state;
}

describe("M7 scored pediatric prototype admission", () => {
  it.each(PEDIATRIC_CLINIC_CASES.map(clinicalCase => [clinicalCase.id, clinicalCase] as const))
    ("freezes the constrained child, exact still and named parent for %s", (_id, clinicalCase) => {
      const familyContext = PEDIATRIC_CLINIC_FAMILY_CONTEXTS.find(family => family.caseId === clinicalCase.id)!;
      const state = createPediatricChartsQaState(context, clinicalCase.id);
      const encounter = state.encounters[encounterId]!;
      const family = pediatricFamilyForActor(state, "encounter", encounterId)!;
      const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
      expect(encounter.patientDisplayName).toBe(familyContext.childName);
      expect(encounter.frozenCase.patientDisplayName).toBe(familyContext.childName);
      expect(encounter.frozenCase.prototypeDemographics).toEqual(familyContext.prototypeDemographics);
      expect(encounter.frozenCase.selectedInstantiationProfileId).toBe(familyContext.profileId);
      expect(encounter.frozenCase.presentation).toBe(clinicalCase.presentation);
      expect(encounter.frozenCase.decisionNodes[0]!.stem).toBe(clinicalCase.decisionNodes[0]!.stem);
      expect(encounter.patientAppearance.stillId).toBe(familyContext.childStillId);
      expect(encounter.patientAppearance.patientIdentityId).toBeUndefined();
      expect(pediatricStillEligibleEntries(familyContext.prototypeDemographics.sexLabel, familyContext.prototypeDemographics.ageYears)
        .some(entry => entry.stillId === encounter.patientAppearance.stillId)).toBe(true);
      expect(parent.displayName).toBe(familyContext.parentName);
      const parentStill = characterStillCatalogEntryById(parent.appearance.stillId);
      expect(parentStill && "compatibleSexLabel" in parentStill ? parentStill.compatibleSexLabel : null)
        .toBe(familyContext.parentRelationship === "mother" ? "Female" : "Male");
      expect(state.retailExternalActors).toHaveLength(1);
      expect(Object.values(state.pediatricFamilies!)).toHaveLength(1);
      expect(state.serviceOperations).toEqual([]);
      expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
      const restored = deserializeGameState(serializeGameState(state), context);
      expect(restored.encounters).toEqual(state.encounters);
      expect(restored.pediatricFamilies).toEqual(state.pediatricFamilies);
      expect(restored.retailExternalActors).toEqual(state.retailExternalActors);
    });

  it("randomizes every node while retaining exact choice meaning and the child name even with an override", () => {
    let nonFirstKeys = 0;
    for (const clinicalCase of PEDIATRIC_CLINIC_CASES) {
      let state = vacantState();
      const histories = structuredClone(state.learningHistories);
      state = apply(state, { type: "ADMIT_PATIENT", operationId: `m7.shuffle.${clinicalCase.id}`, encounterId,
        caseId: clinicalCase.id, arrivalClass: "routine", patientDisplayName: "Override attempt" });
      const encounter = state.encounters[encounterId]!;
      expect(encounter.patientDisplayName).toBe(clinicalCase.patientDisplayName);
      const choices = encounter.frozenCase.decisionNodes[0]!.answerChoices;
      expect([...choices].sort((a, b) => a.id.localeCompare(b.id)))
        .toEqual([...clinicalCase.decisionNodes[0]!.answerChoices].sort((a, b) => a.id.localeCompare(b.id)));
      nonFirstKeys += choices.findIndex(choice => choice.isCorrect) > 0 ? 1 : 0;
      expect(state.learningHistories).toEqual(histories);
    }
    expect(nonFirstKeys).toBeGreaterThan(0);
  });

  it("requires Level 4 and a real operational Pediatric Examination for explicit and automatic admission and availability", () => {
    const clinicalCase = PEDIATRIC_CLINIC_CASES[0]!;
    const ctx = onlyCases([clinicalCase]);
    const command: GameCommand = { type: "ADMIT_PATIENT", operationId: "m7.gate", encounterId,
      caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" };
    for (const gate of ["level3", "no-exam", "no-access", "wrong-room"] as const) {
      const state = vacantState();
      if (gate === "level3") state.facilityLevel = 3;
      if (gate === "no-exam") state.rooms = state.rooms.filter(room => room.id !== "room.peds.exam");
      if (gate === "no-access") state.doors = state.doors.filter(door => door.roomId !== "room.peds.exam");
      if (gate === "wrong-room") {
        state.rooms.find(room => room.id === "room.peds.exam")!.roomDefinitionId = "room.examination";
        // Even a separately supplied same-named capability is insufficient.
        ctx.balanceRelease = { ...context.balanceRelease, facility: { ...context.balanceRelease.facility,
          roomDefinitions: context.balanceRelease.facility.roomDefinitions.map(room => room.id === "room.examination"
            ? { ...room, capabilityIds: [...room.capabilityIds, "capability.pediatric_examination"] } : room) } };
      }
      const rejected = gameReducer(state, command, ctx);
      expect(rejected.operationReceipts[command.operationId]?.status, gate).toBe("rejected");
      expect(rejected.encounters).toEqual({});
      expect(getRoutinePatientAvailability(state, NOW, ctx).reason, gate).toBe(gate === "level3" ? "content_unavailable" : "capabilities_unavailable");
      const advanced = apply(state, { type: "ADVANCE_TICK", operationId: `m7.auto.${gate}`, advancedAtRealMs: NOW }, ctx);
      expect(advanced.encounters).toEqual({});
    }
    const state = vacantState();
    expect(getRoutinePatientAvailability(state, NOW, context).reason).toBe("available");
    const advanced = apply(state, { type: "ADVANCE_TICK", operationId: "m7.auto.available", advancedAtRealMs: NOW }, onlyCases([clinicalCase]));
    const child = Object.values(advanced.encounters)[0]!;
    expect(child.frozenCase.id).toBe(clinicalCase.id);
    expect(child.patientDisplayName).toBe(clinicalCase.patientDisplayName);
    expect(pediatricFamilyForActor(advanced, "encounter", child.id)).toBeTruthy();
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.maximumPlayableLevel).toBe(4);
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.stageDefinitions.find(stage => stage.level === 3)?.nextFacilityLevel).toBe(4);
  });

  it.each(["service.mrcp", "service.endoscopy", "service.sedation", "income.ambulatory_operation", "income.wound_procedure"])
    ("withholds a broken distractor promise for %s", serviceId => {
      const clinicalCase = structuredClone(PEDIATRIC_CLINIC_CASES[0]!);
      clinicalCase.decisionNodes[0]!.answerChoices[1]!.serviceRequest = { serviceId };
      const ctx = onlyCases([clinicalCase]);
      const state = vacantState();
      expect(clinicalCaseHasSupportedPatientSemantics(clinicalCase)).toBe(false);
      expect(getRoutinePatientAvailability(state, NOW, ctx).reason).toBe("content_unavailable");
      const rejected = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "m7.unsupported", encounterId,
        caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" }, ctx);
      expect(rejected.operationReceipts["m7.unsupported"]?.status).toBe("rejected");
      expect(rejected.encounters).toEqual({});
      expect(rejected.pediatricFamilies).toEqual({});
    });

  it("applies semantic release gating even if stage/capability fields drift, and rejects a mismatched frozen child profile", () => {
    const clinicalCase = structuredClone(PEDIATRIC_CLINIC_CASES[0]!);
    clinicalCase.earliestFacilityStage = 0; clinicalCase.requiredCapabilityIds = [];
    const state = vacantState(); state.facilityLevel = 3;
    expect(getClinicalCaseEligibilityIssue(state, clinicalCase, context)).toBe("This patient becomes eligible at Level 4.");
    state.facilityLevel = 4; state.rooms = state.rooms.filter(room => room.id !== "room.peds.exam");
    expect(getClinicalCaseEligibilityIssue(state, clinicalCase, context)).toBe("This patient requires an operational Pediatric Examination Room.");
    clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics!.ageYears = 8;
    expect(clinicalCaseHasSupportedPatientSemantics(clinicalCase)).toBe(false);
  });

  it("keeps a due adult review of the unchanged concept available before L4 and preserves old frozen charts/history", () => {
    const conceptId = "concept.umbilical-epigastric-hernia.clinical-recognition";
    const adultCases = SYNTHETIC_CLINICAL_RELEASE.cases.filter(clinicalCase => !clinicalCase.pediatricProfile &&
      clinicalCase.decisionNodes.length === 1 && clinicalCase.decisionNodes[0]!.primaryConceptId === conceptId);
    expect(adultCases.length).toBeGreaterThan(0);
    const state = createInitialGameState();
    const frozen = structuredClone(state.encounters);
    state.facilityLevel = 3; state.encounters = {}; state.openChartEncounterId = null; state.attendedEncounterId = null;
    state.paused = false; state.nextRoutineArrivalTick = 0;
    const adult = adultCases[0]!; const node = adult.decisionNodes[0]!;
    const review = applyFsrsReview(createNewFsrsCard(0), "Good", 1_000, context.balanceRelease.learning);
    state.learningHistories[conceptId] = { conceptId, card: { ...review.card, dueAtMs: NOW }, reviews: [{
      id: "review.old.midline", encounterId: "encounter.old.midline", decisionNodeId: node.id,
      questionVariantId: node.questionVariantId, patientPresentationVariantId: adult.patientPresentationVariantId,
      primaryConceptId: conceptId, answerChoiceId: node.answerChoices.find(choice => choice.isCorrect)!.id,
      correct: true, rating: "Good", reviewedAtMs: 1_000, facilityTick: 0, schedulerLog: review.log,
    }] };
    const histories = structuredClone(state.learningHistories);
    const ctx = onlyCases([...adultCases, ...PEDIATRIC_CLINIC_CASES]);
    expect(getRoutinePatientAvailability(state, NOW, ctx).reason).toBe("available");
    const eligible = ctx.clinicalRelease.cases.filter(clinicalCase => getClinicalCaseEligibilityIssue(state, clinicalCase, ctx) === null);
    expect(selectRoutineClinicalCase(state, eligible, NOW)).toMatchObject({ kind: "due_review", selectedConceptId: conceptId });
    const advanced = apply(state, { type: "ADVANCE_TICK", operationId: "m7.old.due", advancedAtRealMs: NOW }, ctx);
    const admitted = Object.values(advanced.encounters)[0]!;
    expect(admitted.frozenCase.pediatricProfile).toBeUndefined();
    expect(admitted.frozenCase.decisionNodes[0]!.primaryConceptId).toBe(conceptId);
    expect(advanced.learningHistories).toEqual(histories);
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts.filter(concept => concept.id === conceptId)).toHaveLength(1);
    const oldSave = { ...state, paused: true, encounters: frozen };
    const restored = deserializeGameState(serializeGameState(oldSave));
    expect(restored.encounters).toEqual(frozen);
    expect(restored.learningHistories).toEqual(histories);
  });

  it.each(["case.pediatric-clinic.intermittent-groin-swelling", "case.pediatric-clinic.epigastric-standing-bulge",
    "case.pediatric-clinic.pilonidal-mild-cleft-symptoms"])
    ("routes a scored visit with its parent, records M5's witness once and survives reload/retirement: %s", caseId => {
      let state = createPediatricChartsQaState(context, caseId);
      const identity = structuredClone([state.encounters[encounterId]!.patientAppearance,
        state.retailExternalActors[0]!.appearance, state.retailExternalActors[0]!.displayName]);
      state = until(state, value => value.encounters[encounterId]!.checkInStatus === "checked_in" &&
        !value.encounters[encounterId]!.patientMovement);
      const family = pediatricFamilyForActor(state, "encounter", encounterId)!;
      expect(family.reservation?.roomInstanceId).toBe("room.peds.wait");
      expect(family.reservation?.parentSeatId?.startsWith("kid")).toBe(false);
      expect(family.reservation?.childSeatId?.startsWith("kid")).toBe(state.encounters[encounterId]!.frozenCase.prototypeDemographics!.ageYears < 10);
      state = deserializeGameState(serializeGameState(state), context); pairTogether(state);
      state = apply(state, { type: "OPEN_CHART", operationId: `m7.open.${caseId}`, encounterId });
      state = until(state, value => pediatricPairAtReservation(value, pediatricFamilyForActor(value, "encounter", encounterId)!) &&
        value.encounters[encounterId]!.assignedRoomInstanceId === "room.peds.exam");
      expect(pediatricFamilyForActor(state, "encounter", encounterId)!.reservation)
        .toMatchObject({ roomInstanceId: "room.peds.exam", childSeatId: "table:patient", parentSeatId: "parentChair" });
      expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
      state = deserializeGameState(serializeGameState(state), context);
      const node = state.encounters[encounterId]!.frozenCase.decisionNodes[0]!;
      state = apply(state, { type: "SUBMIT_ANSWER", operationId: `m7.answer.${caseId}`, encounterId,
        decisionNodeId: node.id, answerChoiceId: node.answerChoices.find(choice => choice.isCorrect)!.id, reviewedAtMs: NOW });
      expect(state.levelFourCompletion?.pediatricVisitWithParent).toEqual({ serviceOperationId: null, encounterId,
        incomeLineId: "income.pediatric_consult", completedAtFacilityTick: state.facilityTick,
        parentActorId: family.parentActorId });
      expect(state.learningHistories[node.primaryConceptId]!.reviews).toHaveLength(1);
      expect(state.serviceOperations).toEqual([]);
      expect([state.encounters[encounterId]!.patientAppearance, state.retailExternalActors[0]!.appearance,
        state.retailExternalActors[0]!.displayName]).toEqual(identity);
      const witness = structuredClone(state.levelFourCompletion);
      const income = structuredClone(state.serviceIncomeReceipts);
      state = apply(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", operationId: `m7.ack.${caseId}`, encounterId });
      state = apply(state, { type: "CLOSE_CHART", operationId: `m7.close.${caseId}`, encounterId });
      state = until(state, value => value.encounters[encounterId]!.patientLocation === null);
      expect(state.levelFourCompletion).toEqual(witness);
      expect(state.serviceIncomeReceipts).toEqual(income);
      state.encounters = {}; state.pediatricFamilies = {}; state.retailExternalActors = [];
      state.rooms = state.rooms.filter(room => !["room.peds.wait", "room.peds.exam"].includes(room.id));
      state.doors = state.doors.filter(door => !["room.peds.wait", "room.peds.exam"].includes(door.roomId));
      state = deserializeGameState(serializeGameState(state), context);
      expect(state.levelFourCompletion).toEqual(witness);
    });

  it("does not award the witness for unanswered, waiting-room-only or split-parent completion", () => {
    const state = createPediatricChartsQaState(context);
    const encounter = state.encounters[encounterId]!;
    recordPediatricVisitCompletion(state, encounter);
    expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
    encounter.resolutionReason = "completed";
    encounter.lifecycle = "resolved_summary_available";
    const family = pediatricFamilyForActor(state, "encounter", encounterId)!;
    const parent = state.retailExternalActors[0]!;
    family.reservation = { roomInstanceId: "room.peds.wait", childLocation: encounter.patientLocation!,
      parentLocation: parent.location!, childSeatId: null, parentSeatId: null };
    reconcilePediatricFamilies(state, context);
    recordPediatricVisitCompletion(state, encounter);
    expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
    family.reservation = { ...family.reservation, roomInstanceId: "room.peds.exam",
      childSeatId: "table:patient", parentSeatId: "parentChair", parentLocation: { x: 35, y: 24 } };
    recordPediatricVisitCompletion(state, encounter);
    expect(state.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
  });
});
