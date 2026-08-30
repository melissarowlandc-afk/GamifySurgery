import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
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
    expect(
      Object.fromEntries(
        current!.answerChoices.map((choice) => [
          choice.id,
          {
            etaLabel: choice.etaLabel,
            detailLabel: choice.detailLabel,
          },
        ]),
      ),
    ).toEqual({
      targeted_ultrasound: {
        etaLabel: "150 min",
        detailLabel: "Off-site ultrasound",
      },
      diagnostic_mammography: {
        etaLabel: "2 hours",
        detailLabel: "Off-site mammography",
      },
      breast_mri: {
        etaLabel: "3 hours",
        detailLabel: "Off-site breast MRI",
      },
      core_biopsy: {
        etaLabel: "3 hours",
        detailLabel: "Off-site core-needle biopsy",
      },
    });
  });
});
