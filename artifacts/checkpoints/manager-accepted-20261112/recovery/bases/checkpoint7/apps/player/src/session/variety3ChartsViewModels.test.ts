import { describe, expect, it } from "vitest";
import { VARIETY3_ADULT_CONTEXTS as adults, VARIETY3_CASES as cases, VARIETY3_TIMING_ENTRIES as timings } from "@gamify-surgery/clinical-content";
import { getAnswerChoiceServicePreview } from "@gamify-surgery/game-domain";
import { createVariety3ChartsQaState, VARIETY3_CHARTS_QA_ENCOUNTER_ID as encounterId } from "../../../../tests/fixtures/variety3-charts";
import { createPrototypePlayerView } from "./viewModels";

describe("Variety-3 admitted chart presentation", () => {
  it.each(cases.map(clinicalCase => [clinicalCase.id, clinicalCase] as const))
    ("shows the exact named adult, complete task, shuffled choices and every test estimate for %s", (_id, clinicalCase) => {
      const state = createVariety3ChartsQaState(undefined, clinicalCase.id);
      const encounter = state.encounters[encounterId]!;
      const adult = adults.find(item => item.caseId === clinicalCase.id)!;
      // Display-only projection; the domain suite separately exercises actual travel/care.
      encounter.checkInStatus = "checked_in";
      encounter.patientMovement = null;
      encounter.lifecycle = "active_action_required";
      state.openChartEncounterId = encounterId;
      const view = createPrototypePlayerView(state, encounterId, false, null);
      const chart = view.chart!;
      expect(chart).toMatchObject({ patientName: adult.patientName,
        ageLabel: `${adult.prototypeDemographics.ageYears} years`, sexLabel: adult.prototypeDemographics.sexLabel,
        presentation: clinicalCase.presentation, chiefComplaint: clinicalCase.chiefComplaint });
      expect(chart.decisionSteps![0]!.questionPrompt).toBe(clinicalCase.decisionNodes[0]!.stem);
      expect(chart.answerChoices.map(choice => choice.label))
        .toEqual(encounter.frozenCase.decisionNodes[0]!.answerChoices.map(choice => choice.label));
      const classification = timings.find(item => item.caseId === clinicalCase.id)!.classification;
      for (const choice of chart.decisionSteps![0]!.answerChoices) {
        const preview = getAnswerChoiceServicePreview(state, encounterId, choice.id);
        if (classification.kind === "no_test") {
          expect(preview).toBeNull();
          expect(choice.etaLabel).toBeUndefined();
        } else {
          const timing = classification.choices.find(item => item.choiceId === choice.id)!.timing;
          if (timing.kind === "test") {
            expect(preview?.durationTicks).toBeGreaterThan(0);
            expect(choice.etaLabel).toMatch(/\d+ (?:hours?|min)/);
          } else expect(choice.etaLabel).toBe("No test wait");
        }
      }
    });
});
