import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getClinicSatisfaction,
  getCurrentQuestion,
  getFacilityClock,
  getPendingOffsitePatientTravel,
  serializeGameState,
  type GameState,
} from "../src";

const XRAY_CASE_ID = "case.synthetic.xray-routing";

function tick(state: GameState, id: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: id,
  });
}

function advance(
  state: GameState,
  minutes: number,
  prefix: string,
): GameState {
  let next = state;
  for (let minute = 1; minute <= minutes; minute += 1) {
    next = tick(next, `${prefix}.${minute}`);
  }
  return next;
}

function emptyLevelOne(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}

function admit(
  state: GameState,
  encounterId: string,
  caseId = XRAY_CASE_ID,
): GameState {
  return gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `admit.${encounterId}`,
    encounterId,
    caseId,
    patientDisplayName: "Routing Test Patient",
    arrivalClass: "routine",
  });
}

function makeQuestionReady(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) {
      return next;
    }
    const encounter = next.encounters[encounterId]!;
    if (
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement === null
    ) {
      next = gameReducer(next, {
        type: "OPEN_CHART",
        operationId: `${prefix}.open.${attempt}`,
        encounterId,
      });
    } else {
      next = tick(next, `${prefix}.tick.${attempt}`);
    }
  }
  throw new Error("The patient never reached an answer-ready state.");
}

function answerCorrect(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  const choice = question.node.answerChoices.find(
    (candidate) => candidate.isCorrect,
  )!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId: `${prefix}.answer`,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs: 1_000,
  });
}

describe("minute simulation and economy", () => {
  it("uses minute clocks, 1×/2×/4× speed state, and continuous day rollover", () => {
    let state = createInitialGameState();
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 1,
      hour24: 8,
      minute: 0,
      displayLabel: "Day 1 8:00 AM",
    });
    state = gameReducer(state, {
      type: "SET_SIMULATION_SPEED",
      operationId: "speed.4",
      speed: 4,
    });
    expect(state.simulationSpeed).toBe(4);

    state = advance(state, 600, "clock.day");
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 2,
      hour24: 8,
      minute: 0,
    });
  });

  it("accrues continuously and posts hourly rates on quarter-hour boundaries", () => {
    let state = createInitialGameState();
    const startingCash = state.cash;
    state = advance(state, 14, "expense.before-quarter");
    expect(state.cash).toBe(startingCash);
    expect(state.operatingAccrualSixtiethCents).toBeGreaterThan(0);

    state = tick(state, "expense.quarter");
    expect(state.facilityTick).toBe(15);
    expect(state.cash).toBe(startingCash - 2.5);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.nextFinancialPostingTick).toBe(30);
    expect(restored.operatingAccrualSixtiethCents).toBe(
      state.operatingAccrualSixtiethCents,
    );
  });

  it("persists irregular, non-quarter-hour patient arrival timestamps", () => {
    const state = createInitialGameState(undefined, {
      campaignSeed: "irregular-arrival-current",
    });
    expect(state.nextRoutineArrivalTick).toBeGreaterThanOrEqual(35);
    expect(state.nextRoutineArrivalTick).toBeLessThanOrEqual(75);
    expect(state.nextRoutineArrivalTick % 15).not.toBe(0);

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.nextRoutineArrivalTick).toBe(
      state.nextRoutineArrivalTick,
    );
  });
});

describe("physical patient routing", () => {
  it("walks through check-in and care before exposing the first decision", () => {
    const admitted = admit(
      emptyLevelOne("arrival-route"),
      "encounter.arrival-route",
    );
    expect(
      admitted.encounters["encounter.arrival-route"]!.patientMovement
        ?.kind,
    ).toBe("arriving_for_check_in");
    expect(
      getCurrentQuestion(admitted, "encounter.arrival-route"),
    ).toBeNull();

    const ready = makeQuestionReady(
      admitted,
      "encounter.arrival-route",
      "arrival-route",
    );
    expect(
      ready.encounters["encounter.arrival-route"]!.patientMovement,
    ).toBeNull();
    expect(
      getCurrentQuestion(ready, "encounter.arrival-route"),
    ).not.toBeNull();
  });

  it("walks out for send-out testing, remains away, and returns before results become actionable", () => {
    const encounterId = "encounter.offsite-route";
    let state = makeQuestionReady(
      admit(emptyLevelOne("offsite-route"), encounterId),
      encounterId,
      "offsite.ready",
    );
    state = answerCorrect(state, encounterId, "offsite.order");
    const step =
      state.encounters[encounterId]!.steps[
        state.encounters[encounterId]!.currentNodeIndex
      ]!;
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "offsite.ack",
      encounterId,
      decisionNodeId: step.decisionNodeId,
    });

    expect(state.encounters[encounterId]!.patientMovement?.kind).toBe(
      "departing_for_offsite_testing",
    );
    let sawAway = false;
    let sawReturningInside = false;
    for (let minute = 0; minute < 500; minute += 1) {
      const travel = getPendingOffsitePatientTravel(
        state,
        encounterId,
      );
      sawAway ||= travel?.phase === "away";
      sawReturningInside ||=
        state.encounters[encounterId]!.patientMovement?.kind ===
        "returning_from_offsite_testing";
      if (
        state.encounters[encounterId]!.lifecycle ===
        "active_action_required"
      ) {
        break;
      }
      state = tick(state, `offsite.wait.${minute}`);
    }

    expect(sawAway).toBe(true);
    expect(sawReturningInside).toBe(true);
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "active_action_required",
      patientMovement: null,
    });
    expect(getCurrentQuestion(state, encounterId)).not.toBeNull();
  });

  it("persists a walkout threshold and resolves only after the patient reaches the exit", () => {
    const encounterId = "encounter.walkout";
    let state = admit(emptyLevelOne("walkout"), encounterId);
    while (state.encounters[encounterId]!.patientMovement) {
      state = tick(state, `walkout.arrival.${state.facilityTick}`);
    }
    const encounter = state.encounters[encounterId]!;
    encounter.patientSatisfaction = 59;
    encounter.walkoutThreshold = 59;
    encounter.idleWaitingSinceTick =
      state.facilityTick -
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
        .idleGraceMinutes -
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
        .decayIntervalMinutes;
    encounter.lastSatisfactionDecayAtTick =
      encounter.idleWaitingSinceTick;

    state = tick(state, "walkout.trigger");
    expect(state.encounters[encounterId]).toMatchObject({
      resolutionReason: null,
      patientMovement: {
        kind: "leaving_after_walkout",
      },
    });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.walkoutThreshold).toBe(59);

    state = restored;
    for (let minute = 0; minute < 30; minute += 1) {
      if (state.encounters[encounterId]!.resolutionReason === "walkout") {
        break;
      }
      state = tick(state, `walkout.exit.${minute}`);
    }
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved",
      resolutionReason: "walkout",
      patientLocation: null,
      patientMovement: null,
      finalPatientSatisfaction: expect.any(Number),
    });
  });
});

describe("rolling clinic satisfaction", () => {
  it("uses only the configured most-recent completed encounter window", () => {
    const state = emptyLevelOne("rolling-satisfaction");
    expect(getClinicSatisfaction(state)).toBeNull();
    for (let index = 0; index < 12; index += 1) {
      const encounter = JSON.parse(
        JSON.stringify(
          createInitialGameState().encounters[
            "encounter.synthetic.tutorial"
          ]!,
        ),
      ) as GameState["encounters"][string];
      encounter.id = `encounter.completed.${index}`;
      encounter.lifecycle = "resolved";
      encounter.resolutionReason = "completed";
      encounter.patientMovement = null;
      encounter.patientLocation = null;
      encounter.finalPatientSatisfaction = index < 2 ? 0 : 90;
      encounter.resolvedAtFacilityTick = index + 1;
      state.encounters[encounter.id] = encounter;
    }
    expect(getClinicSatisfaction(state)).toBe(90);
  });
});
