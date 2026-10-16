import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
  getAnswerChoiceServicePreview,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("multistep diagnostic choice timing", () => {
  it("shows a facility-time return estimate for every diagnostic choice", () => {
    let state = createInitialGameState();
    state.encounters = {};
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "timed-choice.admit",
      encounterId: "encounter.timed-choice",
      caseId: "case.breast-cyst.under-30-asymptomatic-simple",
      patientDisplayName: "Timing Test Patient",
      arrivalClass: "routine",
    });
    const encounter = state.encounters["encounter.timed-choice"]!;
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.patientLocation = {
      ...state.environment.founderLocation,
    };
    encounter.steps[0]!.status = "action_required";

    const chart = createPrototypePlayerView(
      state,
      encounter.id,
      false,
      null,
    ).chart;
    const current = chart?.decisionSteps?.find((step) => step.current);
    expect(current?.answerChoices).toHaveLength(4);
    for (const choice of current!.answerChoices) {
      const preview = getAnswerChoiceServicePreview(state, encounter.id, choice.id)!;
      const plan = preview.diagnosticTiming!;
      const total = Math.max(...plan.phases.map((phase) => phase.forecast.endsAtTick)) - state.facilityTick;
      expect(preview.durationTicks).toBe(total);
      expect(choice.etaLabel).toBe(total >= 60 && total % 60 === 0 ? `${total / 60} hours` : `${total} min`);
      expect(choice.detailLabel).toContain("Estimated total (game time; includes queues and walking).");
      expect(choice.detailLabel).toContain("Travel to outside service");
    }
  });
});
