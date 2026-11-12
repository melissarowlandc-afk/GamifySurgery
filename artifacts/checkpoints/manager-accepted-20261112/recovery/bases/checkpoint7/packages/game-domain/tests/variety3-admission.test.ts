import { describe, expect, it } from "vitest";
import { VARIETY3_ADULT_CONTEXTS as adults, VARIETY3_CASES as cases,
  VARIETY3_TESTED_CONCEPTS as concepts, VARIETY3_TIMING_ENTRIES as timings,
  type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "../../../tests/fixtures/level-four-rooms";
import { createVariety3ChartsQaState, VARIETY3_CHARTS_QA_ENCOUNTER_ID as encounterId } from "../../../tests/fixtures/variety3-charts";
import { applyFsrsReview, createInitialGameState, createNewFsrsCard, deserializeGameState,
  gameReducer, getAnswerChoiceServicePreview, getClinicalCaseEligibilityIssue, getCurrentQuestion,
  getRoutinePatientAvailability, selectRoutineClinicalCase, serializeGameState,
  type DomainContext, type GameCommand, type GameState } from "../src";
import { EXACT_TEST_CHOICE_ORDER_RECORDS, getExactTestChoiceOrderRecord } from "../src/test-choice-orders";

const context = createLevelFourRoomsQaContext();
const NOW = 1_800_000_000_000;
const onlyCases = (selected: SyntheticClinicalCase[]): DomainContext => ({ ...context,
  clinicalRelease: { ...context.clinicalRelease, cases: selected } });
const sortedChoices = (clinicalCase: SyntheticClinicalCase) => [...clinicalCase.decisionNodes[0]!.answerChoices]
  .sort((a, b) => a.id.localeCompare(b.id));
function vacant(level = 3): GameState {
  const state = createLevelFourRoomsQaState(context);
  state.facilityLevel = level as GameState["facilityLevel"];
  state.paused = false;
  state.nextRoutineArrivalTick = 0;
  return state;
}
function apply(state: GameState, command: GameCommand, ctx = context): GameState {
  const next = gameReducer(state, command, ctx);
  expect(next.operationReceipts[command.operationId], command.operationId).toMatchObject({ status: "applied" });
  return next;
}
function reviewed(state: GameState, clinicalCase: SyntheticClinicalCase, dueAtMs: number): void {
  const node = clinicalCase.decisionNodes[0]!;
  const conceptId = node.primaryConceptId;
  const review = applyFsrsReview(createNewFsrsCard(0), "Good", 1_000, context.balanceRelease.learning);
  state.learningHistories[conceptId] = { conceptId, card: { ...review.card, dueAtMs }, reviews: [{
    id: `review.variety3.${conceptId}`, encounterId: "encounter.old.review", decisionNodeId: node.id,
    questionVariantId: node.questionVariantId, patientPresentationVariantId: clinicalCase.patientPresentationVariantId,
    primaryConceptId: conceptId, answerChoiceId: node.answerChoices.find(choice => choice.isCorrect)!.id,
    correct: true, rating: "Good", reviewedAtMs: 1_000, facilityTick: 0, schedulerLog: review.log,
  }] };
}

describe("Variety-3 real prototype admission and availability", () => {
  it.each(cases.map(clinicalCase => [clinicalCase.id, clinicalCase] as const))
    ("freezes the authored adult/profile/still, shuffled answers and reload for %s", (_id, clinicalCase) => {
      const adult = adults.find(item => item.caseId === clinicalCase.id)!;
      const before = vacant(clinicalCase.earliestFacilityStage);
      const histories = structuredClone(before.learningHistories);
      const command: GameCommand = { type: "ADMIT_PATIENT", operationId: "variety3.identity", encounterId,
        caseId: clinicalCase.id, patientDisplayName: "Override attempt", arrivalClass: "routine" };
      const state = apply(before, command);
      expect(gameReducer(state, command, context)).toBe(state);
      const encounter = state.encounters[encounterId]!;
      expect(encounter.patientDisplayName).toBe(adult.patientName);
      expect(encounter.patientAppearance.stillId).toBe(adult.patientStillId);
      expect(encounter.frozenCase).toMatchObject({ patientDisplayName: adult.patientName,
        prototypeDemographics: adult.prototypeDemographics, selectedInstantiationProfileId: adult.profileId,
        chiefComplaint: clinicalCase.chiefComplaint, presentation: clinicalCase.presentation,
        earliestFacilityStage: clinicalCase.earliestFacilityStage, releasePointId: clinicalCase.releasePointId,
        requiredClinicalSetting: "clinic", requiredCapabilityIds: [] });
      expect(encounter.frozenCase.decisionNodes[0]!.stem).toBe(clinicalCase.decisionNodes[0]!.stem);
      expect(sortedChoices(encounter.frozenCase)).toEqual(sortedChoices(clinicalCase));
      expect(state.learningHistories).toEqual(histories);
      expect(state.serviceOperations).toEqual([]);
      const restored = deserializeGameState(serializeGameState(state), context);
      expect(restored.encounters[encounterId]).toEqual(encounter);
      expect(restored.learningHistories).toEqual(histories);
    });

  it("does not keep keys first at the actual freeze boundary", () => {
    const positions = cases.map(clinicalCase => createVariety3ChartsQaState(context, clinicalCase.id)
      .encounters[encounterId]!.frozenCase.decisionNodes[0]!.answerChoices.findIndex(choice => choice.isCorrect));
    expect(new Set(positions).size).toBeGreaterThan(1);
    expect(positions.some(position => position > 0)).toBe(true);
  });

  it.each(cases.map(clinicalCase => [clinicalCase.id, clinicalCase] as const))
    ("gates explicit/automatic arrivals and availability at the exact declared level for %s", (_id, clinicalCase) => {
      const ctx = onlyCases([clinicalCase]);
      const command: GameCommand = { type: "ADMIT_PATIENT", operationId: "variety3.gate", encounterId,
        caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" };
      const below = vacant((clinicalCase.earliestFacilityStage - 1) as GameState["facilityLevel"]);
      expect(getClinicalCaseEligibilityIssue(below, clinicalCase, ctx)).toContain(`Level ${clinicalCase.earliestFacilityStage}`);
      expect(gameReducer(below, command, ctx).operationReceipts[command.operationId]?.status).toBe("rejected");
      expect(getRoutinePatientAvailability(below, NOW, ctx).reason).toBe("content_unavailable");
      const blocked = apply(below, { type: "ADVANCE_TICK", operationId: "variety3.auto.blocked", advancedAtRealMs: NOW }, ctx);
      expect(blocked.encounters).toEqual({});
      for (const level of [clinicalCase.earliestFacilityStage, 4] as const) {
        const state = vacant(level);
        expect(getClinicalCaseEligibilityIssue(state, clinicalCase, ctx)).toBeNull();
        expect(getRoutinePatientAvailability(state, NOW, ctx).reason).toBe("available");
        expect(apply(state, command, ctx).encounters[encounterId]!.frozenCase.id).toBe(clinicalCase.id);
        const automatic = apply(state, { type: "ADVANCE_TICK", operationId: "variety3.auto.available", advancedAtRealMs: NOW }, ctx);
        const admitted = Object.values(automatic.encounters)[0]!;
        expect(admitted.frozenCase.id).toBe(clinicalCase.id);
        expect(admitted.patientDisplayName).toBe(clinicalCase.patientDisplayName);
        expect(automatic.learningHistories).toEqual(state.learningHistories);
      }
    });

  it.each(concepts.map(concept => [concept.id, concept] as const))
    ("keeps both variants of %s available for due review and blocks active/not-due repeats", (_id, concept) => {
      const variants = cases.filter(item => item.decisionNodes[0]!.primaryConceptId === concept.id);
      const ctx = onlyCases(variants);
      const state = vacant(concept.earliestFacilityStage);
      reviewed(state, variants[0]!, NOW + 60_000);
      expect(selectRoutineClinicalCase(state, variants, NOW)).toBeNull();
      expect(getRoutinePatientAvailability(state, NOW, ctx)).toMatchObject({ reason: "reviews_scheduled", nextReviewAtRealMs: NOW + 60_000 });
      state.learningHistories[concept.id]!.card.dueAtMs = NOW;
      const histories = structuredClone(state.learningHistories);
      expect(selectRoutineClinicalCase(state, variants, NOW)).toMatchObject({ kind: "due_review", selectedConceptId: concept.id });
      expect(getRoutinePatientAvailability(state, NOW, ctx).reason).toBe("available");
      const automatic = apply(state, { type: "ADVANCE_TICK", operationId: "variety3.due.auto", advancedAtRealMs: NOW }, ctx);
      expect(variants.map(item => item.id)).toContain(Object.values(automatic.encounters)[0]!.frozenCase.id);
      expect(automatic.learningHistories).toEqual(histories);
      expect(selectRoutineClinicalCase(automatic, variants, NOW)).toBeNull();
      expect(getRoutinePatientAvailability(automatic, NOW, ctx).reason).toBe("in_progress");
    });

  it("prioritizes an existing due concept over all new content and retains old frozen charts and histories", () => {
    const legacy = createInitialGameState(context);
    const frozen = structuredClone(legacy.encounters);
    const legacyHistories = structuredClone(legacy.learningHistories);
    const oldSave = JSON.parse(serializeGameState(legacy)) as { learningHistories: Record<string, unknown> };
    // An actual older bank has none of these ten new FSRS identities yet.
    for (const concept of concepts) delete oldSave.learningHistories[concept.id];
    const restored = deserializeGameState(JSON.stringify(oldSave), context);
    expect(restored.encounters).toEqual(frozen);
    for (const [id, history] of Object.entries(legacyHistories)) {
      if (!concepts.some(concept => concept.id === id)) expect(restored.learningHistories[id]).toEqual(history);
    }
    for (const concept of concepts) expect(restored.learningHistories[concept.id]).toMatchObject({
      conceptId: concept.id, card: { reps: 0, lastReviewAtMs: null }, reviews: [],
    });
    const oldCase = context.clinicalRelease.cases.find(item => item.id === "case.ventral-hernia.pulmonary-optimization.a")!;
    const conceptId = oldCase.decisionNodes[0]!.primaryConceptId;
    const state = vacant(3);
    reviewed(state, oldCase, NOW);
    const histories = structuredClone(state.learningHistories);
    const ctx = onlyCases([oldCase, ...cases]);
    expect(selectRoutineClinicalCase(state, ctx.clinicalRelease.cases, NOW)).toMatchObject({ kind: "due_review", selectedConceptId: conceptId });
    const automatic = apply(state, { type: "ADVANCE_TICK", operationId: "variety3.old.due", advancedAtRealMs: NOW }, ctx);
    expect(Object.values(automatic.encounters)[0]!.frozenCase.id).toBe(oldCase.id);
    expect(automatic.learningHistories).toEqual(histories);
  });

  it("previews all 28 proposed tests, including distractors, without changing state or executing outside plans", () => {
    const exact = EXACT_TEST_CHOICE_ORDER_RECORDS.filter(item => item.caseId.startsWith("case.variety3."));
    expect(exact).toHaveLength(28);
    expect(exact.every(item => item.disposition.kind === "not_executed" && item.disposition.reason === "external_only")).toBe(true);
    let timedChoices = 0;
    for (const clinicalCase of cases) {
      const state = createVariety3ChartsQaState(context, clinicalCase.id);
      const encounter = state.encounters[encounterId]!;
      encounter.checkInStatus = "checked_in";
      encounter.lifecycle = "active_action_required";
      encounter.patientMovement = null;
      encounter.patientLocation = { ...state.environment.founderLocation };
      const before = structuredClone(state);
      const classification = timings.find(item => item.caseId === clinicalCase.id)!.classification;
      for (const choice of encounter.frozenCase.decisionNodes[0]!.answerChoices) {
        const preview = getAnswerChoiceServicePreview(state, encounterId, choice.id, context);
        if (classification.kind === "no_test") expect(preview).toBeNull();
        else {
          const registered = classification.choices.find(item => item.choiceId === choice.id)!;
          expect(preview?.kind).toBe(registered.timing.kind);
          if (registered.timing.kind === "test") {
            expect(getExactTestChoiceOrderRecord(encounter, encounter.frozenCase.decisionNodes[0]!, choice.id))
              .toMatchObject({ choiceLabel: choice.label, timingProfileId: registered.timing.timingProfileId,
                disposition: { kind: "not_executed", reason: "external_only" } });
            expect(preview?.timingProfileId).toBe(registered.timing.timingProfileId);
            expect(preview?.durationTicks).toBeGreaterThan(0);
            timedChoices++;
          }
        }
      }
      expect(state).toEqual(before);
    }
    expect(timedChoices).toBe(28);
  });

  it("takes the outside-colonoscopy QA case through real clinic care, scores once and creates no local procedure", () => {
    let state = createVariety3ChartsQaState(context);
    let opened = false;
    for (let tick = 0; tick < 240; tick++) {
      state = apply({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `variety3.qa.tick.${tick}`, advancedAtRealMs: NOW });
      const encounter = state.encounters[encounterId]!;
      if (!opened && encounter.checkInStatus === "checked_in" && !encounter.patientMovement) {
        state = apply(state, { type: "OPEN_CHART", operationId: "variety3.qa.open", encounterId });
        opened = true;
      }
      if (!opened || state.encounters[encounterId]!.assignedRoomInstanceId !== "room.variety3.exam" ||
        state.encounters[encounterId]!.patientMovement || !getCurrentQuestion(state, encounterId, context)) continue;
      const question = getCurrentQuestion(state, encounterId, context)!;
      const conceptId = question.node.primaryConceptId;
      const correct = question.node.answerChoices.find(choice => choice.isCorrect)!;
      const command: GameCommand = { type: "SUBMIT_ANSWER", operationId: "variety3.qa.answer", encounterId,
        decisionNodeId: question.node.id, answerChoiceId: correct.id, reviewedAtMs: NOW };
      state = apply(state, command);
      expect(gameReducer(state, command, context)).toBe(state);
      expect(state.learningHistories[conceptId]!.reviews).toHaveLength(1);
      expect(state.encounters[encounterId]!.pendingResult).toBeNull();
      expect(state.encounters[encounterId]!.terminalTestOrder).toBeUndefined();
      expect(state.serviceOperations).toEqual([]);
      const restored = deserializeGameState(serializeGameState(state), context);
      expect(restored.learningHistories).toEqual(state.learningHistories);
      expect(restored.encounters[encounterId]!.frozenCase).toEqual(state.encounters[encounterId]!.frozenCase);
      return;
    }
    throw new Error("Variety-3 QA patient did not reach the ordinary Examination Room.");
  });
});
