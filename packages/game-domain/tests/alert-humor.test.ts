import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_ALERT_SCHEDULING,
  PROTOTYPE_AMBIENT_ALERT_DEFINITIONS,
} from "@gamify-surgery/balance-config";
import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  serializeGameState,
  type EncounterState,
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

function makeTutorialsResolved(seed = "alert-humor"): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  first.lifecycle = "resolved";
  first.resolutionReason = "completed";
  first.finalPatientSatisfaction = first.patientSatisfaction;
  first.resolvedAtFacilityTick = state.facilityTick;
  first.patientMovement = null;
  first.patientLocation = null;
  state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = {
    ...(JSON.parse(JSON.stringify(first)) as EncounterState),
    id: SECOND_TUTORIAL_ENCOUNTER_ID,
    patientDisplayName: "Second Tutorial Patient",
  };
  return state;
}

function acknowledgeAlertsTutorial(
  state: GameState,
  operationId = "alerts.ack",
): GameState {
  return gameReducer(state, {
    type: "ACKNOWLEDGE_ALERTS_TUTORIAL",
    operationId,
  });
}

function resolveSingleDecisionRoutine(
  state: GameState,
  encounterId: string,
): GameState {
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  for (const previous of Object.values(state.encounters)) {
    if (previous.resolutionReason === "completed") {
      previous.lifecycle = "resolved";
      previous.patientMovement = null;
      previous.patientLocation = null;
    }
  }
  let next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `${encounterId}.admit`,
    encounterId,
    caseId: "case.prototype.tutorial-laceration",
    patientDisplayName: `Patient ${encounterId}`,
    arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId]!;
  encounter.patientMovement = null;
  encounter.patientLocation = {
    ...next.environment.founderLocation,
  };
  encounter.assignedRoomInstanceId =
    "room.instance.founder_desk";
  encounter.idleWaitingSinceTick = next.facilityTick;
  next = gameReducer(next, {
    type: "OPEN_CHART",
    operationId: `${encounterId}.open`,
    encounterId,
  });
  const question = getCurrentQuestion(next, encounterId);
  if (!question) {
    throw new Error("The ordinary test patient never checked in.");
  }
  const answer = question.node.answerChoices.find(
    (choice) => choice.isCorrect,
  )!;
  return gameReducer(next, {
    type: "SUBMIT_ANSWER",
    operationId: `${encounterId}.answer`,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: answer.id,
    reviewedAtMs: 1_000,
  });
}

describe("persisted alert humor scheduler", () => {
  it("rejects an early acknowledgement and leaves ambient messages locked", () => {
    const state = createInitialGameState(undefined, {
      campaignSeed: "early-alert-ack",
      createdAtRealMs: 0,
    });
    const next = acknowledgeAlertsTutorial(state);

    expect(next.operationReceipts["alerts.ack"]).toMatchObject({
      status: "rejected",
    });
    expect(next.alertHumor).toMatchObject({
      alertsTutorialAcknowledgedAtTick: null,
      nextAmbientAlertTick: null,
      ambientSequence: 0,
    });
  });

  it("schedules the first message 10-20 facility minutes after an idempotent acknowledgement", () => {
    const state = makeTutorialsResolved("first-alert-delay");
    const acknowledged = acknowledgeAlertsTutorial(state);
    const dueTick = acknowledged.alertHumor.nextAmbientAlertTick!;

    expect(
      dueTick - acknowledged.facilityTick,
    ).toBeGreaterThanOrEqual(
      PROTOTYPE_ALERT_SCHEDULING.firstAmbientMinimumMinutes,
    );
    expect(
      dueTick - acknowledged.facilityTick,
    ).toBeLessThanOrEqual(
      PROTOTYPE_ALERT_SCHEDULING.firstAmbientMaximumMinutes,
    );

    const acknowledgedAgain = acknowledgeAlertsTutorial(
      acknowledged,
      "alerts.ack-again",
    );
    expect(
      acknowledgedAgain.alertHumor.nextAmbientAlertTick,
    ).toBe(dueTick);
    expect(
      acknowledgedAgain.alertHumor
        .alertsTutorialAcknowledgedAtTick,
    ).toBe(acknowledged.facilityTick);
  });

  it("emits at the persisted deadline, avoids repeats, and schedules 45-90 minutes later", () => {
    let state = acknowledgeAlertsTutorial(
      makeTutorialsResolved("ambient-sequence"),
    );
    const firstDue = state.alertHumor.nextAmbientAlertTick!;
    state = advance(
      state,
      firstDue - state.facilityTick - 1,
      "before-first-ambient",
    );
    expect(
      state.events.filter((event) => event.type === "ambient_message"),
    ).toHaveLength(0);

    state = tick(state, "first-ambient");
    const first = state.events.find(
      (event) => event.type === "ambient_message",
    )!;
    expect(first).toMatchObject({
      priority: "flavor",
      alertCategory: "ambient_flavor",
      definitionId: expect.stringMatching(/^alert\.ambient\./),
      alertVariantId: expect.any(String),
    });
    expect(
      state.alertHumor.nextAmbientAlertTick! - state.facilityTick,
    ).toBeGreaterThanOrEqual(
      PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMinimumMinutes,
    );
    expect(
      state.alertHumor.nextAmbientAlertTick! - state.facilityTick,
    ).toBeLessThanOrEqual(
      PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMaximumMinutes,
    );

    const secondDue = state.alertHumor.nextAmbientAlertTick!;
    state = advance(
      state,
      secondDue - state.facilityTick,
      "second-ambient",
    );
    const ambient = state.events.filter(
      (event) => event.type === "ambient_message",
    );
    expect(ambient).toHaveLength(2);
    expect(ambient[1]!.definitionId).not.toBe(first.definitionId);
    expect(
      PROTOTYPE_AMBIENT_ALERT_DEFINITIONS.some(
        (definition) => definition.id === ambient[1]!.definitionId,
      ),
    ).toBe(true);
  });

  it("freezes while paused and resumes the exact saved countdown after reload", () => {
    let state = acknowledgeAlertsTutorial(
      makeTutorialsResolved("ambient-reload"),
    );
    const dueTick = state.alertHumor.nextAmbientAlertTick!;
    state = gameReducer(state, {
      type: "SET_PAUSED",
      operationId: "pause",
      paused: true,
    });
    const paused = tick(state, "paused-tick");
    expect(paused.facilityTick).toBe(state.facilityTick);
    expect(paused.alertHumor.nextAmbientAlertTick).toBe(dueTick);

    state = gameReducer(paused, {
      type: "SET_PAUSED",
      operationId: "resume",
      paused: false,
    });
    state = advance(state, 4, "before-reload");
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.alertHumor).toEqual(state.alertHumor);

    const uninterrupted = advance(
      state,
      dueTick - state.facilityTick,
      "uninterrupted",
    );
    const reloaded = advance(
      restored,
      dueTick - restored.facilityTick,
      "uninterrupted",
    );
    expect(reloaded.alertHumor).toEqual(uninterrupted.alertHumor);
    expect(
      reloaded.events.filter((event) => event.type === "ambient_message"),
    ).toEqual(
      uninterrupted.events.filter(
        (event) => event.type === "ambient_message",
      ),
    );
  });

  it("migrates schema-v5 campaigns into a sanitized locked scheduler", () => {
    const state = makeTutorialsResolved("schema-five-alerts");
    const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    first.patientSatisfaction = 82;
    const legacy = JSON.parse(
      serializeGameState(state),
    ) as Record<string, unknown>;
    legacy.schemaVersion = 5;
    delete legacy.alertHumor;
    const legacyEncounters = legacy.encounters as Record<
      string,
      Record<string, unknown>
    >;
    delete legacyEncounters[TUTORIAL_ENCOUNTER_ID]!
      .dissatisfactionByCause;

    const restored = deserializeGameState(JSON.stringify(legacy));
    expect(restored.schemaVersion).toBe(6);
    expect(restored.alertHumor).toEqual({
      alertsTutorialAcknowledgedAtTick: null,
      nextAmbientAlertTick: null,
      ambientSequence: 0,
      ambientCycle: 0,
      ambientUsedDefinitionIds: [],
      recentAmbientDefinitionIds: [],
      recentWalkoutReviewVariantIds: [],
    });
    expect(
      restored.encounters[TUTORIAL_ENCOUNTER_ID]!
        .dissatisfactionByCause.general?.pointsLost,
    ).toBe(18);
  });

  it("freezes first-ordinary and true satisfaction-crossing success copy into events", () => {
    let state = createInitialGameState(undefined, {
      campaignId: "campaign.success-events",
      campaignSeed: "success-events",
      createdAtRealMs: 0,
    });
    state.facilityLevel = 1;
    state.encounters = {};
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state = resolveSingleDecisionRoutine(
      state,
      "encounter.ordinary.first",
    );

    expect(
      state.events.filter(
        (event) =>
          event.definitionId ===
          "alert.success.first-ordinary-patient-resolved",
      ),
    ).toHaveLength(1);
    expect(
      state.events.some(
        (event) =>
          event.definitionId ===
          "alert.success.satisfaction-above-90",
      ),
    ).toBe(false);

    const first = state.encounters["encounter.ordinary.first"]!;
    first.patientSatisfaction = 85;
    first.finalPatientSatisfaction = 85;
    state = resolveSingleDecisionRoutine(
      state,
      "encounter.ordinary.second",
    );

    expect(
      state.events.filter(
        (event) =>
          event.definitionId ===
          "alert.success.first-ordinary-patient-resolved",
      ),
    ).toHaveLength(1);
    expect(
      state.events.find(
        (event) =>
          event.definitionId ===
          "alert.success.satisfaction-above-90",
      ),
    ).toMatchObject({
      type: "success_message",
      alertCategory: "success",
      alertVariantId: expect.any(String),
    });
  });
});

describe("cause-aware walkout reviews", () => {
  it("selects and persists a one- or two-star review without adding another penalty", () => {
    let state = makeTutorialsResolved("walkout-review");
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.resolutionReason = null;
    encounter.resolvedAtFacilityTick = null;
    encounter.finalPatientSatisfaction = null;
    encounter.patientSatisfaction = 31;
    encounter.dissatisfactionByCause = {
      excessive_waiting: {
        pointsLost: 9,
        lastAppliedAtFacilityTick: 2,
      },
      poor_cleanliness: {
        pointsLost: 60,
        lastAppliedAtFacilityTick: 1,
      },
    };
    encounter.patientLocation = { x: 1, y: 1 };
    encounter.patientMovement = {
      kind: "leaving_after_walkout",
      path: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      destinationRoomInstanceId: null,
    };
    encounter.waiting.patienceExempt = false;
    const cashBefore = state.cashCents;
    const xpBefore = state.clinicalXp;

    state = tick(state, "finish-walkout");
    const review = state.events.find(
      (event) => event.type === "left_before_seen",
    )!;
    expect(review).toMatchObject({
      alertCategory: "walkout_review",
      alertVariantId: expect.any(String),
      walkoutReview: {
        cause: "poor_cleanliness",
        rating: expect.any(Number),
      },
    });
    expect([1, 2]).toContain(review.walkoutReview?.rating);
    expect(review.walkoutReview?.rating).toBe(2);
    expect(review.message).toMatch(/^New 2-star review from .+: .+/);
    expect(review.definitionId).toBe(
      "alert.review.poor-cleanliness",
    );
    expect(state.cashCents).toBe(cashBefore);
    expect(state.clinicalXp).toBe(xpBefore);
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!
        .finalPatientSatisfaction,
    ).toBe(31);
    expect(
      state.alertHumor.recentWalkoutReviewVariantIds,
    ).toContain(review.alertVariantId);
  });
});
