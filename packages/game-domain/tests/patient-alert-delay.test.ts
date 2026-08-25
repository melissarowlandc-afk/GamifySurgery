import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  type GameState,
} from "../src";

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId,
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

function quietTutorialState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.patient-alert-delay",
    campaignSeed: "patient-alert-delay",
    createdAtRealMs: 0,
  });
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.alertHumor.nextAmbientAlertTick = null;
  const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 34, y: 29 };
  encounter.assignedRoomInstanceId = "room.instance.founder_desk";
  encounter.idleWaitingSinceTick = state.facilityTick;
  return state;
}

describe("delayed patient attention events", () => {
  it("records checked-in waiting only after more than five unresolved facility minutes", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.firstOpenedAtTick = null;
    encounter.feedAttentionKind = "checked_in";
    encounter.feedAttentionStartedAtTick = state.facilityTick;

    state = advance(state, 5, "checked-in.before-threshold");
    expect(
      state.events.some(
        (event) => event.definitionId === "alert.patient.arrived",
      ),
    ).toBe(false);

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters[TUTORIAL_ENCOUNTER_ID],
    ).toMatchObject({
      feedAttentionKind: "checked_in",
      feedAttentionStartedAtTick: 0,
    });

    state = tick(restored, "checked-in.after-threshold");
    expect(
      state.events.filter(
        (event) => event.definitionId === "alert.patient.arrived",
      ),
    ).toHaveLength(1);
    expect(
      state.events.find(
        (event) => event.definitionId === "alert.patient.arrived",
      ),
    ).toMatchObject({
      facilityTick: 6,
      priority: "action_required",
      target: {
        kind: "encounter",
        id: TUTORIAL_ENCOUNTER_ID,
      },
    });
  });

  it("never records a brief checked-in wait that the player addresses", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.firstOpenedAtTick = null;
    encounter.feedAttentionKind = "checked_in";
    encounter.feedAttentionStartedAtTick = 0;

    state = advance(state, 5, "checked-in.brief");
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "checked-in.open",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = advance(state, 2, "checked-in.after-open");

    expect(
      state.events.some(
        (event) => event.definitionId === "alert.patient.arrived",
      ),
    ).toBe(false);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: null,
      feedAttentionStartedAtTick: null,
    });
  });

  it("records a plain clinical-decision wait only after more than five minutes", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[encounter.currentNodeIndex]!.status =
      "action_required";
    encounter.feedAttentionKind = "clinical_decision";
    encounter.feedAttentionStartedAtTick = 0;

    state = advance(state, 5, "decision.before-threshold");
    expect(
      state.events.some(
        (event) =>
          event.definitionId === "alert.patient.decision-required",
      ),
    ).toBe(false);

    state = tick(state, "decision.after-threshold");
    expect(
      state.events.find(
        (event) =>
          event.definitionId === "alert.patient.decision-required",
      ),
    ).toMatchObject({
      type: "patient_arrived",
      facilityTick: 6,
      message: expect.stringContaining(
        "is ready for a clinical decision",
      ),
      priority: "action_required",
    });
  });

  it("delays result-ready rows and retains the emitted event after the chart is opened", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[encounter.currentNodeIndex]!.status =
      "action_required";
    encounter.feedAttentionKind = "result_ready";
    encounter.feedAttentionStartedAtTick = 0;
    encounter.pendingResult = {
      operationId: "result.delay.test",
      gateId: "gate.delay.test",
      originatingNodeIndex: -1,
      resultTypeId: "result.synthetic",
      pendingLabel: "Second training result pending",
      resultNarrative: "Synthetic result.",
      routeId: "service.route.synthetic",
      routeDisplayName: "Synthetic service",
      scheduledAtTick: 0,
      serviceDurationTicks: 10,
      durationTicks: 10,
      dueTick: 0,
      deliveredAtTick: 0,
      offsiteReturnStartedAtTick: null,
      offsiteTravel: null,
      patientTravel: null,
    };

    state = advance(state, 5, "result.before-threshold");
    expect(
      state.events.some((event) => event.type === "result_ready"),
    ).toBe(false);

    state = tick(state, "result.after-threshold");
    const delayed = state.events.find(
      (event) => event.type === "result_ready",
    );
    expect(delayed).toMatchObject({
      facilityTick: 6,
      message:
        expect.stringContaining(
          "Second training result pending is ready",
        ),
    });

    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "result.open",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(state.events.some((event) => event.id === delayed?.id)).toBe(
      true,
    );
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: null,
      feedAttentionStartedAtTick: null,
    });
  });

  it("normalizes legacy unresolved attention timing without rerolling it", () => {
    const state = quietTutorialState();
    state.facilityTick = 4;
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.idleWaitingSinceTick = 2;
    encounter.feedAttentionKind = "checked_in";
    encounter.feedAttentionStartedAtTick = 2;
    const legacy = JSON.parse(
      serializeGameState(state),
    ) as {
      encounters: Record<string, Record<string, unknown>>;
    };
    delete legacy.encounters[TUTORIAL_ENCOUNTER_ID]!
      .feedAttentionKind;
    delete legacy.encounters[TUTORIAL_ENCOUNTER_ID]!
      .feedAttentionStartedAtTick;

    const restored = deserializeGameState(JSON.stringify(legacy));
    expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: "checked_in",
      feedAttentionStartedAtTick: 2,
    });
  });
});
