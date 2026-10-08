import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let tick = 0; tick < 250; tick += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${tick}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${tick}` });
  }
  throw new Error("Encounter did not become question-ready.");
}

function chart(state: GameState, encounterId: string) {
  return createPrototypePlayerView(state, encounterId, false, null).chart!;
}

function actionableThyroid(): GameState {
  let state = createInitialGameState();
  state.facilityLevel = 1;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: "sc.thyroid.admit", encounterId: "encounter.sc.thyroid",
    caseId: "case.thyroid-nodule.palpable-referral", patientDisplayName: "Preview Patient", arrivalClass: "routine",
  });
  return ready(state, "encounter.sc.thyroid", "sc.thyroid");
}

describe("surgery-center test timing previews", () => {
  it("shows neutral complete test timing in both chart choice paths", () => {
    const state = actionableThyroid();
    expect(
      state.encounters["encounter.sc.thyroid"]!.frozenCase.decisionNodes[0]!.showServicePreviews,
    ).toBe(false);
    const view = chart(state, "encounter.sc.thyroid");
    for (const choice of view.answerChoices) {
      expect(choice.detailLabel).toBe("Estimated test wait (game time)");
      expect(choice.etaLabel).toBeDefined();
    }
    for (const choice of view.decisionSteps!.find((step) => step.current)!.answerChoices) {
      expect(choice.detailLabel).toBe("Estimated test wait (game time)");
      expect(choice.etaLabel).toBeDefined();
    }
    expect(Object.fromEntries(view.answerChoices.map((choice) => [choice.id, choice.etaLabel]))).toEqual({
      thyroid_fna_1: "3 hours",
      repeat_tsh_1: "1 hour",
      radionuclide_scan_1: "3 hours",
      repeat_ultrasound_1: "150 min",
    });
  });

  it("ignores the retired concealment flag and preserves the scheduled external service after an answer", () => {
    let state = actionableThyroid();
    const encounterId = "encounter.sc.thyroid";
    const node = state.encounters[encounterId]!.frozenCase.decisionNodes[0]!;
    node.showServicePreviews = undefined;
    expect(chart(state, encounterId).answerChoices.find((choice) => choice.id === "thyroid_fna_1")?.detailLabel).toBe("Estimated test wait (game time)");

    node.showServicePreviews = false;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER", operationId: "sc.thyroid.answer", encounterId, decisionNodeId: node.id,
      answerChoiceId: "thyroid_fna_1", reviewedAtMs: 1_800_000_000_000,
    });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "sc.thyroid.ack", encounterId, decisionNodeId: node.id,
    });
    const pending = state.encounters[encounterId]!.pendingResult!;
    expect(pending.routeDisplayName).toBe("Off-site thyroid fine-needle aspiration");
    expect(chart(state, encounterId).pendingLabel).toContain("Off-site thyroid fine-needle aspiration");
    expect(chart(state, encounterId).decisionSteps![0]!.statusLabel).toBe("External service in progress");
  });

  it("labels an onsite EGD route as onsite care while its result is pending", () => {
    const state = actionableThyroid();
    const encounter = state.encounters["encounter.sc.thyroid"]!;
    const step = encounter.steps[0]!;
    step.status = "result_pending";
    step.result = {
      operationId: "result.egds.status", originatingNodeIndex: 0,
      gateId: "gate.egds.status", resultTypeId: "service.endoscopy", pendingLabel: "EGD pending",
      resultNarrative: "fixture", routeId: "route.endoscopy.in_house", routeDisplayName: "Onsite endoscopy workflow",
      scheduledAtTick: state.facilityTick, dueTick: state.facilityTick + 120, deliveredAtTick: null,
      serviceDurationTicks: 120, durationTicks: 120, offsiteReturnStartedAtTick: null, offsiteTravel: null,
      patientTravel: {
        version: "patient-travel.v1", originRoomInstanceId: "room.instance.exam", destinationRoomInstanceId: "room.instance.endoscopy",
        outboundPath: [{ x: 1, y: 1 }], returnPath: [{ x: 1, y: 1 }], tilesPerTick: 2,
        outboundStartTick: 0, outboundArrivalTick: 1, serviceCompletionTick: 120, returnArrivalTick: 121,
      },
      resourceReservations: [], providerReservation: { kind: "founder" }, timingPhases: [],
    };
    expect(chart(state, "encounter.sc.thyroid").decisionSteps![0]!.statusLabel).toBe("Onsite care in progress");
  });
});
