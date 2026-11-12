import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getAnswerChoiceServicePreview,
  getCurrentQuestion,
  serializeGameState,
  type GameState,
} from "../src";

function readyEncounter(caseId: string, encounterId = "encounter.timing"): GameState {
  let state = createInitialGameState();
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `${encounterId}.admit`,
    encounterId,
    caseId,
    patientDisplayName: "Timing Patient",
    arrivalClass: "routine",
  });
  const encounter = state.encounters[encounterId]!;
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = { ...state.environment.founderLocation };
  encounter.steps[0]!.status = "action_required";
  return state;
}

describe("answer-choice test timing previews", () => {
  it("resolves every declared timing profile exactly once with a positive duration", () => {
    for (const entry of ANSWER_CHOICE_TIMING_REGISTRY) {
      if (entry.classification.kind !== "test_choices") continue;
      for (const choice of entry.classification.choices) {
        if (choice.timing.kind !== "test") continue;
        const timingProfileId = choice.timing.timingProfileId;
        const profiles = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.answerChoiceTimingProfiles.filter(
          (profile) => profile.id === timingProfileId,
        );
        expect(profiles, `${entry.caseId} / ${entry.nodeId} / ${choice.choiceId}`).toHaveLength(1);
        expect(profiles[0]!.durationTicks).toBeGreaterThan(0);
      }
    }
  });

  it("shows estimates for wrong tests and explicit no-test waits on mixed nodes", () => {
    const state = readyEncounter("case.fhh.suggestive-results-confirmation");
    const question = getCurrentQuestion(state, "encounter.timing")!;
    expect(
      Object.fromEntries(
        question.node.answerChoices.map((choice) => [
          choice.id,
          getAnswerChoiceServicePreview(state, "encounter.timing", choice.id)?.kind,
        ]),
      ),
    ).toEqual({
      suspect_fhh_genetic_testing: "test",
      diagnose_phpt_schedule_surgery: "no_test",
      ratio_alone_confirms_fhh: "no_test",
      malignancy_hypercalcemia: "no_test",
    });
  });

  it("does not derive timing from correctness or answer order", () => {
    const state = readyEncounter("case.breast-cyst.under-30-asymptomatic-simple");
    const encounter = state.encounters["encounter.timing"]!;
    const before = Object.fromEntries(
      encounter.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => [
        choice.id,
        getAnswerChoiceServicePreview(state, encounter.id, choice.id)?.durationTicks,
      ]),
    );
    encounter.frozenCase.decisionNodes[0]!.answerChoices.reverse();
    for (const choice of encounter.frozenCase.decisionNodes[0]!.answerChoices) {
      choice.isCorrect = !choice.isCorrect;
    }
    const after = Object.fromEntries(
      encounter.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => [
        choice.id,
        getAnswerChoiceServicePreview(state, encounter.id, choice.id)?.durationTicks,
      ]),
    );
    expect(after).toEqual(before);
  });

  it("uses the configured estimate when an executable service has no eligible live route", () => {
    const state = readyEncounter("case.breast-cyst.under-30-asymptomatic-simple");
    const context = JSON.parse(
      JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT),
    ) as typeof PROTOTYPE_DOMAIN_CONTEXT;
    const ultrasound = context.balanceRelease.services.find((service) => service.id === "service.ultrasound")!;
    ultrasound.routes = ultrasound.routes.map((route) => ({
      ...route,
      requiredCapabilityId: "capability.unavailable_for_test",
      requiredCapabilityIds: ["capability.unavailable_for_test"],
    }));
    expect(
      getAnswerChoiceServicePreview(state, "encounter.timing", "targeted_ultrasound", context),
    ).toMatchObject({ kind: "test", durationTicks: 150, timingProfileId: "timing.test.ultrasound" });
  });

  it("uses the same live EGD timing for implemented and preview-only EGD choices", () => {
    const context = JSON.parse(
      JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT),
    ) as typeof PROTOTYPE_DOMAIN_CONTEXT;
    const route = context.balanceRelease.services
      .find((service) => service.id === "service.endoscopy")!
      .routes[0]!;
    route.durationTicks = 222;
    route.requiredCapabilityId = null;
    route.requiredCapabilityIds = [];
    route.resourceRequirements = [];
    route.providerRequirement = null;
    route.timingPhases = [];
    route.patientTravel = null;

    const implemented = readyEncounter("case.achalasia.water-and-solids", "encounter.implemented-egd");
    implemented.encounters["encounter.implemented-egd"]!.frozenCase = JSON.parse(
      JSON.stringify(
        PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
          (clinicalCase) => clinicalCase.id === "case.esophageal-dysphagia.bread-sticking",
        ),
      ),
    );
    const previewOnly = readyEncounter("case.achalasia.water-and-solids", "encounter.preview-egd");
    expect(
      getAnswerChoiceServicePreview(implemented, "encounter.implemented-egd", "egd_1", context)?.durationTicks,
    ).toBe(222);
    expect(
      getAnswerChoiceServicePreview(previewOnly, "encounter.preview-egd", "repeat_egd_1", context)?.durationTicks,
    ).toBe(222);
  });

  it("preserves uniform fully routed legacy previews while suppressing incomplete groups", () => {
    const state = readyEncounter("case.breast-cyst.under-30-asymptomatic-simple");
    const encounter = state.encounters["encounter.timing"]!;
    encounter.frozenCase.id = "case.retired.fully-routed";
    expect(Object.fromEntries(
      encounter.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => [
        choice.id,
        getAnswerChoiceServicePreview(state, encounter.id, choice.id)?.durationTicks,
      ]),
    )).toEqual({
      targeted_ultrasound: 150,
      diagnostic_mammography: 120,
      breast_mri: 180,
      core_biopsy: 180,
    });
    encounter.frozenCase.decisionNodes[0]!.answerChoices[1]!.serviceRequest = null;
    expect(
      encounter.frozenCase.decisionNodes[0]!.answerChoices.map((choice) =>
        getAnswerChoiceServicePreview(state, encounter.id, choice.id),
      ),
    ).toEqual([null, null, null, null]);

    const stale = readyEncounter("case.thyroid-nodule.palpable-referral", "encounter.stale-label");
    stale.encounters["encounter.stale-label"]!.frozenCase.decisionNodes[0]!
      .answerChoices[0]!.label += " (retired wording)";
    expect(
      stale.encounters["encounter.stale-label"]!.frozenCase.decisionNodes[0]!.answerChoices.map(
        (choice) => getAnswerChoiceServicePreview(stale, "encounter.stale-label", choice.id),
      ),
    ).toEqual([null, null, null, null]);
  });

  it("omits timing for a pure diagnosis node", () => {
    const state = readyEncounter("case.achalasia.water-and-solids");
    const encounter = state.encounters["encounter.timing"]!;
    encounter.currentNodeIndex = 1;
    encounter.steps[0]!.status = "completed";
    encounter.steps[1]!.status = "action_required";
    expect(getAnswerChoiceServicePreview(state, encounter.id, "achalasia_1")).toBeNull();
  });

  it("leaves pending scheduling unchanged across a save round trip", () => {
    const schedule = (readPreviews: boolean) => {
      let scheduled = readyEncounter("case.breast-cyst.under-30-asymptomatic-simple");
      const question = getCurrentQuestion(scheduled, "encounter.timing")!;
      if (readPreviews) {
        for (const choice of question.node.answerChoices) {
          getAnswerChoiceServicePreview(scheduled, "encounter.timing", choice.id);
        }
      }
      scheduled = gameReducer(scheduled, {
        type: "SUBMIT_ANSWER",
        operationId: "timing.answer",
        encounterId: "encounter.timing",
        decisionNodeId: question.node.id,
        answerChoiceId: "targeted_ultrasound",
        reviewedAtMs: 1,
      });
      return gameReducer(scheduled, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: "timing.ack",
        encounterId: "encounter.timing",
        decisionNodeId: question.node.id,
      });
    };
    const baseline = schedule(false);
    let state = schedule(true);
    const encounterId = "encounter.timing";
    const before = state.encounters[encounterId]!.pendingResult;
    expect(before).not.toBeNull();
    expect(before).toMatchObject({ resultTypeId: "service.ultrasound" });
    expect(before!.dueTick).toBeGreaterThan(before!.scheduledAtTick);
    expect(before).toEqual(baseline.encounters[encounterId]!.pendingResult);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.pendingResult).toEqual(before);
    state = restored;
    while (state.facilityTick < before!.dueTick) {
      state = gameReducer(state, {
        type: "ADVANCE_TICK",
        operationId: `timing.delivery.${state.facilityTick}`,
      });
    }
    expect(state.encounters[encounterId]!.deliveredResultNarratives).toHaveLength(1);
    expect(state.learningHistories["concept.breast-mass.under-30-initial-ultrasound"]?.reviews).toHaveLength(1);
  });
});
