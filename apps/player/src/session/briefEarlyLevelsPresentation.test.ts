import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY, BRIEF_EARLY_LEVELS_20260917_CASES } from "@gamify-surgery/clinical-content";
import { createInitialGameState, gameReducer, patientRosterEntryById } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

function admit(caseId: string, index: number) {
  let state = createInitialGameState(); state.facilityLevel = 2; state.encounters = {}; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  const encounterId = `encounter.sept17.presentation.${index}`;
  state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `sept17.presentation.${index}`, encounterId, caseId, patientDisplayName: `September Patient ${index}`, arrivalClass: "routine" });
  const encounter = state.encounters[encounterId]!; encounter.lifecycle = "active_action_required"; encounter.patientMovement = null; encounter.patientLocation = { ...state.environment.founderLocation };
  return { state, encounter, encounterId };
}

describe("September 17 brief early-level chart presentation", () => {
  it("renders each runtime patient and every choice wait", () => {
    for (const [caseIndex, clinicalCase] of BRIEF_EARLY_LEVELS_20260917_CASES.entries()) {
      const { state, encounter, encounterId } = admit(clinicalCase.id, caseIndex); const demographics = encounter.frozenCase.prototypeDemographics!; const sexWord = demographics.sexLabel === "Female" ? "woman" : "man";
      expect(encounter.frozenCase.presentation).toContain(`${demographics.ageYears}-year-old ${sexWord}`); expect(patientRosterEntryById(encounter.patientAppearance.patientIdentityId)?.compatibleSexLabel).toBe(demographics.sexLabel);
      for (const [nodeIndex, node] of encounter.frozenCase.decisionNodes.entries()) {
        encounter.currentNodeIndex = nodeIndex; encounter.steps.forEach((step, index) => { step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked"; });
        const chart = createPrototypePlayerView(state, encounterId, false, null).chart!; expect(chart.presentation).toContain(`September Patient ${caseIndex}`); expect(chart.presentation).not.toContain("{patientName}"); expect(chart.presentation).toContain(`${demographics.ageYears}-year-old ${sexWord}`);
        const choices = chart.decisionSteps?.find((step) => step.current)?.answerChoices ?? chart.answerChoices; expect(choices).toHaveLength(4);
        const timing = ANSWER_CHOICE_TIMING_REGISTRY.find((entry) => entry.questionVariantId === node.questionVariantId)!;
        for (const choice of choices) { const authored = timing.classification.kind === "test_choices" ? timing.classification.choices.find((item) => item.choiceId === choice.id) : undefined; if (authored?.timing.kind === "test") { expect(choice.etaLabel).toBeTruthy(); expect(choice.detailLabel).toBe("Estimated test wait (game time)"); } else if (timing.classification.kind === "test_choices") { expect(choice.etaLabel).toBe("No test wait"); expect(choice.detailLabel).toBeUndefined(); } else { expect(choice.etaLabel).toBeUndefined(); expect(choice.detailLabel).toBeUndefined(); } }
      }
    }
  });
});
