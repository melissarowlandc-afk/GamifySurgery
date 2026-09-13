import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

const ENCOUNTER_ID = "encounter.service-labels";
const CORRECT_CHOICE_ID = "ttg_total_iga_1";

function actionableCeliacState(): GameState {
  let state = createInitialGameState();
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: "service-labels.admit",
    encounterId: ENCOUNTER_ID,
    caseId: "case.celiac.chronic-diarrhea",
    patientDisplayName: "Service Label Patient",
    arrivalClass: "routine",
  });
  const encounter = state.encounters[ENCOUNTER_ID]!;
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = { ...state.environment.founderLocation };
  encounter.steps[0]!.status = "action_required";
  return state;
}

function chart(state: GameState) {
  return createPrototypePlayerView(state, ENCOUNTER_ID, false, null).chart!;
}

function currentStep(state: GameState) {
  return chart(state).decisionSteps!.find((step) => step.current)!;
}

describe("clinical service choice labels", () => {
  it("uses the same neutral timing label for live routes and configured fallback estimates", () => {
    const available = actionableCeliacState();
    expect(
      chart(available).answerChoices.find((choice) => choice.id === CORRECT_CHOICE_ID)
        ?.detailLabel,
    ).toBe("Estimated test wait (game time)");
    expect(
      currentStep(available).answerChoices.find(
        (choice) => choice.id === CORRECT_CHOICE_ID,
      )?.detailLabel,
    ).toBe("Estimated test wait (game time)");

    const unavailable = structuredClone(available);
    const choice = unavailable.encounters[ENCOUNTER_ID]!.frozenCase
      .decisionNodes[0]!.answerChoices.find(
        (candidate) => candidate.id === CORRECT_CHOICE_ID,
      )!;
    choice.serviceRequest = { serviceId: "service.test.unavailable" };
    expect(
      chart(unavailable).answerChoices.find(
        (candidate) => candidate.id === CORRECT_CHOICE_ID,
      )?.detailLabel,
    ).toBe("Estimated test wait (game time)");
    expect(
      currentStep(unavailable).answerChoices.find(
        (candidate) => candidate.id === CORRECT_CHOICE_ID,
      )?.detailLabel,
    ).toBe("Estimated test wait (game time)");
    expect(
      chart(unavailable).answerChoices.find(
        (candidate) => candidate.id === CORRECT_CHOICE_ID,
      )?.etaLabel,
    ).toBe("1 hour");
  });

  it("does not label answered or pending history as unavailable", () => {
    let state = actionableCeliacState();
    const node = state.encounters[ENCOUNTER_ID]!.frozenCase.decisionNodes[0]!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER",
      operationId: "service-labels.answer",
      encounterId: ENCOUNTER_ID,
      decisionNodeId: node.id,
      answerChoiceId: CORRECT_CHOICE_ID,
      reviewedAtMs: 1_800_000_000_000,
    });
    expect(chart(state).answerChoices.map((choice) => choice.detailLabel)).not.toContain(
      "Service route unavailable",
    );
    expect(
      currentStep(state).answerChoices.map((choice) => choice.detailLabel),
    ).not.toContain("Service route unavailable");

    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "service-labels.acknowledge",
      encounterId: ENCOUNTER_ID,
      decisionNodeId: node.id,
    });
    expect(state.encounters[ENCOUNTER_ID]!.lifecycle).toBe("active_pending_result");
    expect(chart(state).answerChoices).toEqual([]);
    expect(
      chart(state).decisionSteps![0]!.answerChoices.map(
        (choice) => choice.detailLabel,
      ),
    ).not.toContain("Service route unavailable");
  });
});
