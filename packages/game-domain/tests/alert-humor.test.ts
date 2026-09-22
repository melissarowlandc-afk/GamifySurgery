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
  if (!state.rooms.some((room) => room.roomDefinitionId === "room.examination")) {
    state.rooms.push({
      id: "room.test.alert-humor-examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.alert-humor-examination",
      roomId: "room.test.alert-humor-examination",
      side: "south",
      offset: 1,
      exterior: false,
    });
  }
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
    caseId: "case.ventral-hernia.pulmonary-optimization.b",
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
  encounter.checkInStatus = "checked_in";
  encounter.checkInWaitingSinceTick = null;
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
      ambientCadenceVersion: 1,
      ambientSequence: 0,
    });
  });

  it("schedules the first message at least 120 facility minutes after acknowledgement", () => {
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

  it("emits at the persisted deadline, avoids repeats, and schedules at least 120 minutes later", () => {
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
    expect(restored.schemaVersion).toBe(7);
    expect(restored.alertHumor).toEqual({
      alertsTutorialAcknowledgedAtTick: null,
      nextAmbientAlertTick: null,
      ambientCadenceVersion: 1,
      lastPatientArrivalTick: restored.facilityTick,
      conditionActiveSinceTicks: {},
      conditionLastEmittedTicks: {},
      lastComplaintAlertTick: null,
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

  it("preserves explicit no-arrival state and migrates missing cadence without a reload burst", () => {
    const state = createInitialGameState();
    state.facilityTick = 100;
    state.alertHumor.lastPatientArrivalTick = null;
    state.alertHumor.conditionActiveSinceTicks = { visible_litter: 40 };
    state.alertHumor.conditionLastEmittedTicks = {
      "environment.litter": 70,
    };
    state.alertHumor.lastComplaintAlertTick = 70;
    const roundTrip = deserializeGameState(serializeGameState(state));
    expect(roundTrip.alertHumor).toMatchObject({
      lastPatientArrivalTick: null,
      conditionActiveSinceTicks: { visible_litter: 40 },
      conditionLastEmittedTicks: { "environment.litter": 70 },
      lastComplaintAlertTick: 70,
    });

    const legacy = JSON.parse(serializeGameState(state)) as {
      alertHumor: Record<string, unknown>;
      environment: {
        facilityConditionOccurrences: unknown[];
        facilityConditionOccurrenceSequence: number;
      };
    };
    delete legacy.alertHumor.lastPatientArrivalTick;
    delete legacy.alertHumor.conditionActiveSinceTicks;
    delete legacy.alertHumor.conditionLastEmittedTicks;
    delete legacy.alertHumor.lastComplaintAlertTick;
    legacy.environment.facilityConditionOccurrenceSequence = 1;
    legacy.environment.facilityConditionOccurrences = [{
      id: "facility-condition.visible_litter.1",
      conditionKey: "visible_litter",
      kind: "onset",
      occurredAtFacilityTick: 50,
      resolvedAtFacilityTick: null,
      definitionId: "alert.environment.trash-visible",
      message: "Select the trash to clean it up.",
      priority: "informational",
      target: { kind: "litter", id: "litter.legacy" },
    }];
    const migrated = deserializeGameState(JSON.stringify(legacy));
    expect(migrated.alertHumor).toMatchObject({
      lastPatientArrivalTick: 100,
      conditionActiveSinceTicks: { visible_litter: 50 },
      conditionLastEmittedTicks: { "environment.litter": 100 },
      lastComplaintAlertTick: 100,
    });
  });

  it("migrates old ambient deadlines once and preserves the migrated deadline on reload", () => {
    const state = acknowledgeAlertsTutorial(
      makeTutorialsResolved("legacy-ambient-cadence"),
    );
    state.facilityTick = 110;
    state.alertHumor.ambientSequence = 1;
    state.alertHumor.nextAmbientAlertTick = 130;
    state.events.push({
      id: "event.ambient.legacy",
      type: "ambient_message",
      facilityTick: 100,
      encounterId: null,
      message: "Legacy ambient message.",
      priority: "flavor",
      definitionId: "alert.ambient.01",
      alertCategory: "ambient_flavor",
      alertVariantId: "alert.ambient.01.default",
      target: { kind: "campaign", id: state.campaignId },
    });
    const legacy = JSON.parse(serializeGameState(state)) as {
      alertHumor: Record<string, unknown>;
      events: unknown[];
    };
    delete legacy.alertHumor.ambientCadenceVersion;

    const migrated = deserializeGameState(JSON.stringify(legacy));
    expect(migrated.alertHumor).toMatchObject({
      ambientCadenceVersion: 1,
      nextAmbientAlertTick: 220,
    });
    expect(
      deserializeGameState(serializeGameState(migrated)).alertHumor
        .nextAmbientAlertTick,
    ).toBe(220);

    legacy.events = [];
    const withoutHistory = deserializeGameState(JSON.stringify(legacy));
    expect(withoutHistory.alertHumor.nextAmbientAlertTick).toBe(230);
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
