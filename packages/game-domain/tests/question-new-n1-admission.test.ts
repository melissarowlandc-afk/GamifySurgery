import { describe, expect, it } from "vitest";
import { QUESTION_NEW_N1_CASES as cases, QUESTION_NEW_N1_TESTED_CONCEPTS as concepts,
  QUESTION_NEW_N1_TIMING_ENTRIES as timings, QUESTION_NEW_N1_PRE_RELEASE, QUESTION_NEW_N2_PRE_RELEASE } from "@gamify-surgery/clinical-content";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "../../../tests/fixtures/level-four-rooms";
import { applyFsrsReview, createInitialGameState, createNewFsrsCard, deserializeGameState,
  gameReducer, getAnswerChoiceServicePreview, getClinicalCaseEligibilityIssue, getCurrentQuestion,
  getRoutinePatientAvailability, selectRoutineClinicalCase, serializeGameState,
  type DomainContext, type GameCommand, type GameState } from "../src";
import { getExactTestChoiceOrderRecord } from "../src/test-choice-orders";

// Original N1 exact versions remain testable after the separate round-two fresh-case projection.
const context = { ...createLevelFourRoomsQaContext(), clinicalRelease: QUESTION_NEW_N2_PRE_RELEASE }, NOW = 1_800_000_000_000;
const encounterId = "encounter.test.n1";
function apply(state: GameState, command: GameCommand, ctx = context): GameState {
  const next = gameReducer(state, command, ctx);
  expect(next.operationReceipts[command.operationId], command.operationId).toMatchObject({ status: "applied" });
  return next;
}
function vacant(level: GameState["facilityLevel"] = 4): GameState {
  const state = createLevelFourRoomsQaState(context);
  Object.assign(state, { facilityLevel: level, paused: false, nextRoutineArrivalTick: 0 });
  return state;
}
const only = (selected: SyntheticClinicalCase[]): DomainContext => ({ ...context,
  clinicalRelease: { ...context.clinicalRelease, cases: selected } });
function reviewed(state: GameState, clinicalCase: SyntheticClinicalCase, dueAtMs: number): void {
  const node = clinicalCase.decisionNodes[0]!, conceptId = node.primaryConceptId;
  const update = applyFsrsReview(createNewFsrsCard(0), "Good", 1_000, context.balanceRelease.learning);
  state.learningHistories[conceptId] = { conceptId, card: { ...update.card, dueAtMs }, reviews: [{
    id: `review.n1.${conceptId}`, encounterId: "encounter.n1.old", decisionNodeId: node.id,
    questionVariantId: node.questionVariantId, patientPresentationVariantId: clinicalCase.patientPresentationVariantId,
    primaryConceptId: conceptId, answerChoiceId: node.answerChoices.find(c => c.isCorrect)!.id,
    correct: true, rating: "Good", reviewedAtMs: 1_000, facilityTick: 0, schedulerLog: update.log,
  }] };
}
function admit(clinicalCase: SyntheticClinicalCase, ctx = context): GameState {
  return apply(vacant(clinicalCase.earliestFacilityStage as GameState["facilityLevel"]), {
    type: "ADMIT_PATIENT", operationId: `n1.admit.${clinicalCase.id}`, encounterId,
    caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine",
  }, ctx);
}

describe("N1 native admission, FSRS supply, previews and persistence", () => {
  it.each(cases.map(c => [c.id, c] as const))("gates explicit and automatic admission at the authored stage for %s", (_id, clinicalCase) => {
    const ctx = only([clinicalCase]), level = clinicalCase.earliestFacilityStage as GameState["facilityLevel"];
    const below = vacant((level - 1) as GameState["facilityLevel"]);
    expect(getClinicalCaseEligibilityIssue(below, clinicalCase, ctx)).toContain(`Level ${level}`);
    expect(getRoutinePatientAvailability(below, NOW, ctx).reason).toBe("content_unavailable");
    const command: GameCommand = { type: "ADMIT_PATIENT", operationId: "n1.gated", encounterId,
      caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" };
    expect(gameReducer(below, command, ctx).operationReceipts[command.operationId]?.status).toBe("rejected");
    expect(Object.values(apply(below, { type: "ADVANCE_TICK", operationId: "n1.auto.blocked", advancedAtRealMs: NOW }, ctx).encounters)).toEqual([]);
    const state = vacant(level);
    expect(getClinicalCaseEligibilityIssue(state, clinicalCase, ctx)).toBeNull();
    expect(getRoutinePatientAvailability(state, NOW, ctx).reason).toBe("available");
    const explicit = admit(clinicalCase, ctx), frozen = explicit.encounters[encounterId]!.frozenCase;
    expect(frozen.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
    expect(frozen.selectedInstantiationProfileId).toBe(clinicalCase.approvedInstantiationProfiles![0]!.id);
    expect(frozen.presentation).toBe(clinicalCase.presentation.split("{patientName}").join(explicit.encounters[encounterId]!.patientDisplayName));
    expect(frozen.decisionNodes[0]!.answerChoices.map(c => c.id).sort()).toEqual(clinicalCase.decisionNodes[0]!.answerChoices.map(c => c.id).sort());
    expect(deserializeGameState(serializeGameState(explicit), context).encounters[encounterId]).toEqual(explicit.encounters[encounterId]);
    const automatic = apply(state, { type: "ADVANCE_TICK", operationId: "n1.auto.available", advancedAtRealMs: NOW }, ctx);
    expect(Object.values(automatic.encounters)[0]!.frozenCase.id).toBe(clinicalCase.id);
    const autoEncounter = Object.values(automatic.encounters)[0]!;
    expect(autoEncounter.frozenCase.presentation).toContain(autoEncounter.patientDisplayName);
    expect(autoEncounter.frozenCase.presentation).not.toContain("{patientName}");
    expect(automatic.learningHistories).toEqual(state.learningHistories);
  });

  it.each(cases.map(c => [c.id, c] as const))("blocks future-due and active repeats, then admits a due review for %s", (_id, clinicalCase) => {
    const ctx = only([clinicalCase]), state = vacant();
    reviewed(state, clinicalCase, NOW + 86_400_000);
    expect(selectRoutineClinicalCase(state, [clinicalCase], NOW)).toBeNull();
    expect(getRoutinePatientAvailability(state, NOW, ctx)).toMatchObject({ reason: "reviews_scheduled", nextReviewAtRealMs: NOW + 86_400_000 });
    const blocked = apply(state, { type: "ADVANCE_TICK", operationId: "n1.not-due", advancedAtRealMs: NOW }, ctx);
    expect(Object.values(blocked.encounters)).toEqual([]);
    expect(blocked.nextRoutineArrivalTick).toBeGreaterThan(blocked.facilityTick);
    state.learningHistories[clinicalCase.decisionNodes[0]!.primaryConceptId]!.card.dueAtMs = NOW;
    expect(selectRoutineClinicalCase(state, [clinicalCase], NOW)).toMatchObject({ kind: "due_review" });
    const next = apply(state, { type: "ADVANCE_TICK", operationId: "n1.due", advancedAtRealMs: NOW }, ctx);
    expect(Object.values(next.encounters)[0]!.frozenCase.id).toBe(clinicalCase.id);
    expect(selectRoutineClinicalCase(next, [clinicalCase], NOW)).toBeNull();
    expect(getRoutinePatientAvailability(next, NOW, ctx).reason).toBe("in_progress");
  });

  it("adds exactly forty independent unseen patient opportunities even with all old concepts future-due", () => {
    const state = vacant();
    for (const clinicalCase of QUESTION_NEW_N1_PRE_RELEASE.cases) for (const node of clinicalCase.decisionNodes) {
      const represented = { ...clinicalCase, decisionNodes: [node] };
      reviewed(state, represented, NOW + 86_400_000);
    }
    const introduced = new Set<string>();
    for (let count = 0; count < 40; count++) {
      const selected = selectRoutineClinicalCase(state, cases, NOW)!;
      expect(selected?.kind).toBe("new_concept");
      introduced.add(selected.selectedConceptId);
      reviewed(state, selected.clinicalCase, NOW + 86_400_000);
      state.routineArrivalSequence++;
    }
    expect(introduced.size).toBe(40);
    expect(introduced).toEqual(new Set(concepts.map(c => c.id)));
    expect(selectRoutineClinicalCase(state, cases, NOW)).toBeNull();
  });

  it("shuffles actual frozen keys across positions and supplies every exact testing preview without executing a service", () => {
    const positions = new Set<number>();
    let timedChoices = 0;
    for (const clinicalCase of cases) {
      const state = admit(clinicalCase), encounter = state.encounters[encounterId]!;
      positions.add(encounter.frozenCase.decisionNodes[0]!.answerChoices.findIndex(c => c.isCorrect));
      // CurrentQuestion is gated by chart attendance; this projection-only state
      // uses the native frozen encounter and the established fixture technique.
      encounter.lifecycle = "active_action_required";
      encounter.patientMovement = null;
      encounter.checkInStatus = "checked_in";
      state.openChartEncounterId = encounterId;
      state.attendedEncounterId = encounterId;
      const classification = timings.find(t => t.caseId === clinicalCase.id)!.classification;
      for (const choice of encounter.frozenCase.decisionNodes[0]!.answerChoices) {
        const preview = getAnswerChoiceServicePreview(state, encounterId, choice.id, context);
        if (classification.kind === "no_test") expect(preview).toBeNull();
        else {
          const timing = classification.choices.find(c => c.choiceId === choice.id)!.timing;
          expect(preview?.kind).toBe(timing.kind);
          if (timing.kind === "test") {
            expect(getExactTestChoiceOrderRecord(encounter, encounter.frozenCase.decisionNodes[0]!, choice.id)).toMatchObject({
              timingProfileId: timing.timingProfileId, disposition: { kind: "not_executed", reason: "external_only" },
            });
            expect(preview?.durationTicks).toBeGreaterThan(0);
            timedChoices++;
          }
        }
      }
      expect(state.serviceOperations).toEqual([]);
    }
    expect(positions.size).toBeGreaterThan(1);
    expect(timedChoices).toBeGreaterThan(25);
  });

  it("opens an older catalog save with all old FSRS cards and frozen charts intact", () => {
    const legacyContext: DomainContext = { ...context, clinicalRelease: QUESTION_NEW_N1_PRE_RELEASE };
    const legacy = createInitialGameState(legacyContext, { campaignSeed: "n1.legacy", createdAtRealMs: NOW });
    const restored = deserializeGameState(serializeGameState(legacy), context);
    expect(restored.encounters).toEqual(legacy.encounters);
    for (const [id, history] of Object.entries(legacy.learningHistories)) expect(restored.learningHistories[id]).toEqual(history);
    for (const concept of concepts) expect(restored.learningHistories[concept.id]).toMatchObject({
      conceptId: concept.id, reviews: [], card: { reps: 0, lastReviewAtMs: null },
    });
  });

  it.each(["breast-thirties-imaging", "phyllodes-suspicious-node", "vka-pcc-selection", "chylous-nutrition"])
    ("takes %s through ordinary clinic care, scores once and executes no proposed hospital work", slug => {
      const clinicalCase = cases.find(c => c.id === `case.n1.${slug}.v1`)!;
      let state = vacant();
      state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
      state = apply(state, { type: "PLACE_ROOM", operationId: "n1.flow.exam", roomDefinitionId: "room.examination",
        roomId: "room.n1.exam", x: 35, y: 24, orientation: 0 });
      state = apply(state, { type: "PLACE_DOOR", operationId: "n1.flow.door", roomId: "room.n1.exam",
        doorId: "door.n1.exam", side: "south", offset: 1 });
      state = apply(state, { type: "ADMIT_PATIENT", operationId: "n1.flow.admit", encounterId,
        caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" });
      let opened = false;
      for (let tick = 0; tick < 240; tick++) {
        state = apply(state, { type: "ADVANCE_TICK", operationId: `n1.flow.tick.${tick}`, advancedAtRealMs: NOW });
        const encounter = state.encounters[encounterId]!;
        if (!opened && encounter.checkInStatus === "checked_in" && !encounter.patientMovement) {
          state = apply(state, { type: "OPEN_CHART", operationId: "n1.flow.open", encounterId });
          opened = true;
        }
        const question = getCurrentQuestion(state, encounterId, context);
        if (!opened || state.encounters[encounterId]!.assignedRoomInstanceId !== "room.n1.exam" ||
          state.encounters[encounterId]!.patientMovement || !question) continue;
        const command: GameCommand = { type: "SUBMIT_ANSWER", operationId: "n1.flow.answer", encounterId,
          decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find(c => c.isCorrect)!.id,
          reviewedAtMs: NOW };
        state = apply(state, command);
        expect(gameReducer(state, command, context)).toBe(state);
        expect(state.learningHistories[question.node.primaryConceptId]!.reviews).toHaveLength(1);
        expect(state.encounters[encounterId]!.pendingResult).toBeNull();
        expect(state.encounters[encounterId]!.terminalTestOrder).toBeUndefined();
        expect(state.serviceOperations).toEqual([]);
        const restored = deserializeGameState(serializeGameState(state), context);
        expect(restored.encounters[encounterId]!.frozenCase).toEqual(state.encounters[encounterId]!.frozenCase);
        expect(restored.learningHistories).toEqual(state.learningHistories);
        return;
      }
      throw new Error(`N1 ${slug} did not reach ordinary examination-room care`);
    });
});
