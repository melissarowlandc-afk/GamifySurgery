import { describe, expect, it } from "vitest";
import {
  EXAMINATION_ROOM_DEFINITION_ID,
  PROTOTYPE_BALANCE_RELEASE,
  validatePrototypeBalanceRelease,
} from "@gamify-surgery/balance-config";
import {
  SYNTHETIC_CLINICAL_RELEASE,
  validateSyntheticClinicalRelease,
} from "@gamify-surgery/clinical-content";
import {
  TUTORIAL_ENCOUNTER_ID,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  getLearningSummary,
  getFacilityProgressionStatus,
  getPatientLists,
  getPendingResultEta,
  getWorkloadSnapshot,
  serializeGameState,
  validateDomainContext,
  type GameState,
} from "../src";

function cloneFixture<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function openTutorial(state: GameState, operationId = "op.open-tutorial"): GameState {
  return gameReducer(state, {
    type: "OPEN_CHART",
    operationId,
    encounterId: TUTORIAL_ENCOUNTER_ID,
  });
}

function advanceTicks(
  state: GameState,
  count: number,
  operationPrefix: string,
): GameState {
  let next = state;
  for (let index = 1; index <= count; index += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${operationPrefix}.${index}`,
    });
  }
  return next;
}

function answer(
  state: GameState,
  answerChoiceId: string,
  operationId: string,
): GameState {
  const question = getCurrentQuestion(state, TUTORIAL_ENCOUNTER_ID);
  if (!question) {
    throw new Error("Expected an action-ready tutorial question.");
  }
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId,
    encounterId: TUTORIAL_ENCOUNTER_ID,
    decisionNodeId: question.node.id,
    answerChoiceId,
  });
}

function answerEncounter(
  state: GameState,
  encounterId: string,
  answerChoiceId: string,
  operationId: string,
  reviewedAtMs: number,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error(`Expected an action-ready question for ${encounterId}.`);
  }
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId,
    reviewedAtMs,
  });
}

function withoutIntroPatients(): GameState {
  const state = createInitialGameState();
  state.encounters = {};
  return state;
}

function completeTutorialIncorrectly(): GameState {
  let state = openTutorial(createInitialGameState());
  state = answer(state, "choice.signal.beta", "op.answer.signal.wrong");
  state = advanceTicks(state, 3, "op.result-tick");
  return answer(state, "choice.action.triangle", "op.answer.action.wrong");
}

describe("validated synthetic prototype data", () => {
  it("is visibly synthetic and rejects an incomplete final-answer disposition", () => {
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe(
      "synthetic_unapproved_prototype",
    );
    expect(SYNTHETIC_CLINICAL_RELEASE.disclaimer.toLowerCase()).toContain(
      "not clinically approved",
    );
    expect(PROTOTYPE_BALANCE_RELEASE.publicationStatus).toBe(
      "prototype_unpublished",
    );

    const invalid = cloneFixture(SYNTHETIC_CLINICAL_RELEASE);
    invalid.cases[0]!.decisionNodes[1]!.terminalDispositions.pop();
    expect(() => validateSyntheticClinicalRelease(invalid)).toThrow(
      /Every wrong final answer/,
    );

    const invalidBalance = cloneFixture(PROTOTYPE_BALANCE_RELEASE);
    invalidBalance.clinicalSettlement.patientSatisfactionDeltaMaximum = 101;
    expect(() => validatePrototypeBalanceRelease(invalidBalance)).toThrow();

    const invalidDevelopmentBalance = cloneFixture(PROTOTYPE_BALANCE_RELEASE);
    invalidDevelopmentBalance.development.addMoneyAmount = 0;
    expect(() =>
      validatePrototypeBalanceRelease(invalidDevelopmentBalance),
    ).toThrow();

    const incompatibleContext = cloneFixture(PROTOTYPE_DOMAIN_CONTEXT);
    incompatibleContext.clinicalRelease.cases[0]!.decisionNodes[0]!
      .resultGateAfter!.allowedServiceRouteIds = ["route.synthetic.missing"];
    expect(() => validateDomainContext(incompatibleContext)).toThrow(
      /missing route/,
    );
  });
});

describe("tutorial clinical lifecycle", () => {
  it("protects the tutorial patient, corrects forward, pauses result time, and resolves deterministically", () => {
    let state = createInitialGameState();
    state = advanceTicks(state, 12, "op.tutorial-patience");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe(
      "waiting_unopened",
    );

    state = openTutorial(state);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe(
      "active_action_required",
    );
    expect(state.openChartEncounterId).toBe(TUTORIAL_ENCOUNTER_ID);
    expect(state.attendedEncounterId).toBe(TUTORIAL_ENCOUNTER_ID);

    state = answer(state, "choice.signal.beta", "op.first-wrong");
    expect(state.reviewIntents).toHaveLength(1);
    expect(state.reviewIntents[0]!.rating).toBe("Again");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe(
      "active_pending_result",
    );
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.pendingResult?.routeId,
    ).toBe("route.synthetic.outsourced");
    expect(getPendingResultEta(state, TUTORIAL_ENCOUNTER_ID)).toBe(3);

    state = gameReducer(state, {
      type: "SET_PAUSED",
      operationId: "op.pause",
      paused: true,
    });
    const pausedAtTick = state.facilityTick;
    state = gameReducer(state, {
      type: "ADVANCE_TICK",
      operationId: "op.paused-tick",
    });
    expect(state.facilityTick).toBe(pausedAtTick);
    expect(getPendingResultEta(state, TUTORIAL_ENCOUNTER_ID)).toBe(3);

    state = gameReducer(state, {
      type: "SET_PAUSED",
      operationId: "op.resume",
      paused: false,
    });
    state = advanceTicks(state, 3, "op.after-resume");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe(
      "active_action_required",
    );
    expect(getCurrentQuestion(state, TUTORIAL_ENCOUNTER_ID)?.questionNumber).toBe(
      2,
    );

    const finalAnswerCommand = {
      type: "SUBMIT_ANSWER" as const,
      operationId: "op.final-wrong",
      encounterId: TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: "node.synthetic.action",
      answerChoiceId: "choice.action.triangle",
    };
    state = gameReducer(state, finalAnswerCommand);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe(
      "resolved_summary_available",
    );
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.terminalFeedback?.outcome?.severity,
    ).toBe("major");
    expect(state.openChartEncounterId).toBe(TUTORIAL_ENCOUNTER_ID);
    expect(state.attendedEncounterId).toBeNull();
    expect(state.reviewIntents.map((intent) => intent.rating)).toEqual([
      "Again",
      "Again",
    ]);
    expect(state.settlements).toHaveLength(1);
    expect(state.cash).toBe(140);
    expect(state.satisfaction).toBe(93);
    expect(state.clinicalXp).toBe(0);

    const idempotentRetry = gameReducer(state, finalAnswerCommand);
    expect(idempotentRetry).toBe(state);
    expect(idempotentRetry.settlements).toHaveLength(1);
    expect(idempotentRetry.reviewIntents).toHaveLength(2);

    state = gameReducer(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: "op.ack",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: "op.close",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe("resolved");
    expect(state.openChartEncounterId).toBeNull();
    expect(getLearningSummary(state, TUTORIAL_ENCOUNTER_ID)).toContain(
      "Read the explicitly labeled signal",
    );

    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "op.reopen-resolved",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(state.openChartEncounterId).toBe(TUTORIAL_ENCOUNTER_ID);
    expect(state.attendedEncounterId).toBeNull();
    expect(state.settlements).toHaveLength(1);
  });

  it("maps correct answers to Good and applies one normalized all-correct settlement", () => {
    let state = openTutorial(createInitialGameState());
    state = answer(state, "choice.signal.alpha", "op.good.signal");
    state = advanceTicks(state, 3, "op.good.result");
    state = answer(state, "choice.action.circle", "op.good.action");

    expect(state.reviewIntents.map((intent) => intent.rating)).toEqual([
      "Good",
      "Good",
    ]);
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.terminalFeedback?.kind,
    ).toBe("completion");
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.terminalFeedback?.outcome,
    ).toBeNull();
    expect(state.settlements).toHaveLength(1);
    expect(state.cash).toBe(160);
    expect(state.satisfaction).toBe(97);
    expect(state.clinicalXp).toBe(10);
  });
});

describe("facility, capacity, and patience primitives", () => {
  it("places the exam room locally, deducts once, rejects overlap, and enables the fast route", () => {
    let state = completeTutorialIncorrectly();
    expect(state.cash).toBe(140);
    expect(getWorkloadSnapshot(state).routineLimit).toBe(2);

    const placement = {
      type: "PLACE_ROOM" as const,
      operationId: "op.place-exam",
      roomId: "room.instance.exam-1",
      roomDefinitionId: EXAMINATION_ROOM_DEFINITION_ID,
      x: 7,
      y: 2,
    };
    state = gameReducer(state, placement);
    expect(state.cash).toBe(20);
    expect(getWorkloadSnapshot(state).routineLimit).toBe(4);
    expect(state.rooms).toHaveLength(2);

    const duplicatePlacement = gameReducer(state, placement);
    expect(duplicatePlacement).toBe(state);
    expect(duplicatePlacement.cash).toBe(20);
    expect(duplicatePlacement.rooms).toHaveLength(2);

    state = gameReducer(state, {
      type: "PLACE_ROOM",
      operationId: "op.place-overlap",
      roomId: "room.instance.exam-overlap",
      roomDefinitionId: EXAMINATION_ROOM_DEFINITION_ID,
      x: 4,
      y: 3,
    });
    expect(state.operationReceipts["op.place-overlap"]?.status).toBe("rejected");
    expect(state.cash).toBe(20);

    state = gameReducer(state, {
      type: "PLACE_ROOM",
      operationId: "op.place-outside-grid",
      roomId: "room.instance.exam-outside",
      roomDefinitionId: EXAMINATION_ROOM_DEFINITION_ID,
      x: 14,
      y: 9,
    });
    expect(state.operationReceipts["op.place-outside-grid"]?.status).toBe(
      "rejected",
    );
    expect(state.cash).toBe(20);

    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "op.admit-after-room",
      encounterId: "encounter.routine.after-room",
      caseId: "case.synthetic.tutorial",
      patientDisplayName: "Synthetic Routine Patient",
      arrivalClass: "routine",
    });
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "op.open-after-room",
      encounterId: "encounter.routine.after-room",
    });
    const question = getCurrentQuestion(state, "encounter.routine.after-room")!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER",
      operationId: "op.answer-after-room",
      encounterId: "encounter.routine.after-room",
      decisionNodeId: question.node.id,
      answerChoiceId: "choice.signal.alpha",
    });
    expect(
      state.encounters["encounter.routine.after-room"]!.pendingResult?.routeId,
    ).toBe("route.synthetic.in_house");
    expect(getPendingResultEta(state, "encounter.routine.after-room")).toBe(1);
  });

  it("pauses routine intake at capacity and preserves the reserved critical slot", () => {
    let state = createInitialGameState();
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "op.admit-routine-one",
      encounterId: "encounter.routine.one",
      caseId: "case.synthetic.tutorial",
      patientDisplayName: "Routine One",
      arrivalClass: "routine",
    });
    expect(getWorkloadSnapshot(state).occupancy).toBe(2);

    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "op.admit-routine-blocked",
      encounterId: "encounter.routine.blocked",
      caseId: "case.synthetic.tutorial",
      patientDisplayName: "Routine Blocked",
      arrivalClass: "routine",
    });
    expect(state.operationReceipts["op.admit-routine-blocked"]?.status).toBe(
      "rejected",
    );
    expect(state.encounters["encounter.routine.blocked"]).toBeUndefined();

    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "op.admit-critical",
      encounterId: "encounter.critical.one",
      caseId: "case.synthetic.tutorial",
      patientDisplayName: "Critical Reserved",
      arrivalClass: "progression_critical",
      protectedGuaranteeId: "guarantee.synthetic.one",
    });
    expect(getWorkloadSnapshot(state).occupancy).toBe(3);
    expect(state.criticalGuarantees["guarantee.synthetic.one"]).toBe(
      "in_progress",
    );
  });

  it("shows the final routine patience warning before departure and lets Open win at the deadline", () => {
    let state = withoutIntroPatients();
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "op.admit-patience",
      encounterId: "encounter.routine.patience",
      caseId: "case.synthetic.tutorial",
      patientDisplayName: "Patient Waiting",
      arrivalClass: "routine",
    });
    state = advanceTicks(state, 12, "op.patience-to-deadline");
    const waiting = state.encounters["encounter.routine.patience"]!;
    expect(waiting.lifecycle).toBe("waiting_unopened");
    expect(waiting.waiting.warningThresholdsShown).toEqual([5, 2, 0]);
    expect(
      state.events.some(
        (event) =>
          event.type === "patience_warning" &&
          event.encounterId === "encounter.routine.patience" &&
          event.facilityTick === 12,
      ),
    ).toBe(true);

    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "op.open-at-deadline",
      encounterId: "encounter.routine.patience",
    });
    state = advanceTicks(state, 1, "op.after-deadline-open");
    expect(state.encounters["encounter.routine.patience"]!.lifecycle).toBe(
      "active_action_required",
    );
  });

  it("files a pre-open departure without clinical evidence or a learning summary", () => {
    let state = withoutIntroPatients();
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "op.admit-departure",
      encounterId: "encounter.routine.departure",
      caseId: "case.synthetic.tutorial",
      patientDisplayName: "Patient Departure",
      arrivalClass: "routine",
    });
    state = advanceTicks(state, 13, "op.departure-ticks");
    const departed = state.encounters["encounter.routine.departure"]!;

    expect(departed.lifecycle).toBe("resolved");
    expect(departed.resolutionReason).toBe("left_before_seen");
    expect(departed.answers).toHaveLength(0);
    expect(departed.settlementId).toBeNull();
    expect(state.reviewIntents).toHaveLength(0);
    expect(state.settlements).toHaveLength(0);
    expect(state.satisfaction).toBe(93);
    expect(getLearningSummary(state, departed.id)).toBeNull();
    expect(getPatientLists(state).resolved[0]?.statusLabel).toBe(
      "Left before being seen",
    );
  });
});

describe("save serialization", () => {
  it("round-trips exact scheduled timing and immutable pins", () => {
    let state = openTutorial(createInitialGameState());
    state = answer(state, "choice.signal.alpha", "op.persist-answer");
    const restored = deserializeGameState(serializeGameState(state));

    expect(restored).toEqual(state);
    expect(restored.clinicalReleaseId).toBe(SYNTHETIC_CLINICAL_RELEASE.id);
    expect(restored.balanceReleaseId).toBe(PROTOTYPE_BALANCE_RELEASE.id);
    expect(
      restored.encounters[TUTORIAL_ENCOUNTER_ID]!.pendingResult?.dueTick,
    ).toBe(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.pendingResult?.dueTick,
    );
  });

  it("bounds transient command receipts so long local campaigns do not grow on every tick forever", () => {
    let state = createInitialGameState();
    state = gameReducer(state, {
      type: "SET_PAUSED",
      operationId: "receipt-bound.pause",
      paused: true,
    });
    for (let index = 0; index < 520; index += 1) {
      state = gameReducer(state, {
        type: "ADVANCE_TICK",
        operationId: `receipt-bound.tick.${index}`,
      });
    }

    expect(Object.keys(state.operationReceipts)).toHaveLength(500);
    expect(
      state.operationReceipts["receipt-bound.tick.0"],
    ).toBeUndefined();
    expect(
      state.operationReceipts["receipt-bound.tick.519"]?.status,
    ).toBe("applied");
  });
});

function completePlayableLevelZero(): GameState {
  let state = createInitialGameState(undefined, {
    campaignId: "campaign.test.level-zero",
    campaignSeed: "seed-level-zero",
    createdAtRealMs: 1_000_000,
  });
  state = gameReducer(state, {
    type: "OPEN_CHART",
    operationId: "level0.open.first",
    encounterId: TUTORIAL_ENCOUNTER_ID,
  });
  state = answerEncounter(
    state,
    TUTORIAL_ENCOUNTER_ID,
    "choice.signal.alpha",
    "level0.answer.first.1",
    1_000_001,
  );
  state = advanceTicks(state, 3, "level0.first.result");
  state = answerEncounter(
    state,
    TUTORIAL_ENCOUNTER_ID,
    "choice.action.circle",
    "level0.answer.first.2",
    1_000_002,
  );
  state = advanceTicks(state, 1, "level0.second-arrival");
  expect(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]?.arrivalClass).toBe(
    "tutorial",
  );
  state = gameReducer(state, {
    type: "OPEN_CHART",
    operationId: "level0.open.second",
    encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
  });
  state = answerEncounter(
    state,
    SECOND_TUTORIAL_ENCOUNTER_ID,
    "choice.laceration.assess-history",
    "level0.answer.second",
    1_000_003,
  );
  state = gameReducer(state, {
    type: "PLACE_ROOM",
    operationId: "level0.place.exam",
    roomId: "room.instance.exam.level0",
    roomDefinitionId: EXAMINATION_ROOM_DEFINITION_ID,
    x: 7,
    y: 2,
  });
  return state;
}

describe("campaign learning, progression, and Level 1 management", () => {
  it("adds the configured development cash amount once and persists its audit trail", () => {
    const initial = createInitialGameState();
    const command = {
      type: "DEV_ADD_MONEY",
      operationId: "money.add.100",
    } as const;

    const state = gameReducer(initial, command);
    expect(PROTOTYPE_BALANCE_RELEASE.development.addMoneyAmount).toBe(100);
    expect(state.cash).toBe(initial.cash + 100);
    expect(state.operationReceipts[command.operationId]).toMatchObject({
      commandType: "DEV_ADD_MONEY",
      status: "applied",
      message: "Development tool added $100.",
    });
    expect(state.events.at(-1)).toMatchObject({
      id: `event.development-money-added.${command.operationId}`,
      type: "development_money_added",
      facilityTick: initial.facilityTick,
      encounterId: null,
      message: "Development tool added $100.",
    });

    const idempotentRetry = gameReducer(state, command);
    expect(idempotentRetry).toBe(state);
    expect(idempotentRetry.cash).toBe(initial.cash + 100);
    expect(
      idempotentRetry.events.filter(
        (event) => event.type === "development_money_added",
      ),
    ).toHaveLength(1);

    expect(deserializeGameState(serializeGameState(state))).toEqual(state);
  });

  it("uses normal tick processing during development fast-forward", () => {
    let state = openTutorial(createInitialGameState(), "fast.open");
    state = answerEncounter(
      state,
      TUTORIAL_ENCOUNTER_ID,
      "choice.signal.alpha",
      "fast.answer",
      10_000,
    );
    expect(getPendingResultEta(state, TUTORIAL_ENCOUNTER_ID)).toBe(3);
    state = gameReducer(state, {
      type: "DEV_FAST_FORWARD",
      operationId: "fast.advance",
      tickCount: 3,
    });
    expect(getPendingResultEta(state, TUTORIAL_ENCOUNTER_ID)).toBeNull();
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]?.lifecycle,
    ).toBe("active_action_required");
    expect(
      state.events.some(
        (event) =>
          event.type === "result_ready" &&
          event.encounterId === TUTORIAL_ENCOUNTER_ID,
      ),
    ).toBe(true);
  });

  it("keeps FSRS histories campaign-scoped with explicit immutable scheduler pins", () => {
    const campaignA = createInitialGameState(undefined, {
      campaignId: "campaign.test.a",
      campaignSeed: "seed-a",
      createdAtRealMs: 5_000_000,
    });
    const campaignB = createInitialGameState(undefined, {
      campaignId: "campaign.test.b",
      campaignSeed: "seed-b",
      createdAtRealMs: 5_000_000,
    });
    let reviewedA = openTutorial(campaignA, "fsrs.open.a");
    reviewedA = answerEncounter(
      reviewedA,
      TUTORIAL_ENCOUNTER_ID,
      "choice.signal.beta",
      "fsrs.answer.a",
      5_100_000,
    );

    expect(
      reviewedA.learningHistories["concept.synthetic.signal"]!.reviews,
    ).toHaveLength(1);
    expect(
      campaignB.learningHistories["concept.synthetic.signal"]!.reviews,
    ).toHaveLength(0);
    expect(
      reviewedA.learningHistories["concept.synthetic.signal"]!.card.dueAtMs,
    ).toBeGreaterThan(5_100_000);
    expect(reviewedA.schedulerPins).toEqual({
      integrationVersion: "fsrs-adapter.v1",
      libraryName: "ts-fsrs",
      libraryVersion: "5.4.1",
      algorithmVersion: "FSRS-6",
      parameterSetId: "learning.prototype.fsrs6.v1",
    });
    expect(reviewedA.reviewIntents[0]?.reviewedAtMs).toBe(5_100_000);
  });

  it("sequences two tutorials, meets the configurable Level 0 gate, and advances only on command", () => {
    let state = completePlayableLevelZero();
    const progression = getFacilityProgressionStatus(state);
    expect(progression.facilityLevel).toBe(0);
    expect(progression.eligible).toBe(true);
    expect(
      progression.requirements.find(
        (requirement) => requirement.id === "progression.completed_encounters",
      )?.current,
    ).toBe(2);
    expect(state.facilityLevel).toBe(0);

    state = gameReducer(state, {
      type: "LEVEL_UP",
      operationId: "level0.advance",
    });
    expect(state.facilityLevel).toBe(1);
    expect(state.events.at(-1)?.type).toBe("facility_level_advanced");
    expect(
      state.criticalGuarantees["guarantee.level0.second-tutorial"],
    ).toBe("satisfied");
  });

  it("enforces Level 1 build and staff dependencies, pays expenses, and admits a seeded routine patient", () => {
    let state = completePlayableLevelZero();
    state = gameReducer(state, {
      type: "LEVEL_UP",
      operationId: "level1.advance",
    });
    state.cash = 2_000;

    state = gameReducer(state, {
      type: "PLACE_ROOM",
      operationId: "level1.xray.too-early",
      roomId: "room.instance.xray.too-early",
      roomDefinitionId: "room.xray",
      x: 10,
      y: 5,
    });
    expect(state.operationReceipts["level1.xray.too-early"]?.status).toBe(
      "rejected",
    );

    const placements = [
      ["bathroom", "room.bathroom", 0, 7],
      ["waiting", "room.waiting", 3, 7],
      ["control", "room.imaging_control", 11, 2],
      ["xray", "room.xray", 10, 5],
      ["procedure", "room.minor_procedure", 13, 5],
    ] as const;
    for (const [suffix, roomDefinitionId, x, y] of placements) {
      state = gameReducer(state, {
        type: "PLACE_ROOM",
        operationId: `level1.place.${suffix}`,
        roomId: `room.instance.${suffix}`,
        roomDefinitionId,
        x,
        y,
      });
      expect(state.operationReceipts[`level1.place.${suffix}`]?.status).toBe(
        "applied",
      );
    }

    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "level1.hire.reception",
      employeeId: "employee.reception.1",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Casey Reception",
    });
    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "level1.hire.imaging",
      employeeId: "employee.imaging.1",
      staffRoleDefinitionId: "staff.imaging_technician",
      displayName: "Taylor Imaging",
    });
    expect(state.employees).toHaveLength(2);

    const beforeTick = state.facilityTick;
    const beforeCash = state.cash;
    state = advanceTicks(state, 6, "level1.arrival");
    expect(state.facilityTick).toBe(beforeTick + 6);
    expect(
      Object.values(state.encounters).some(
        (encounter) =>
          encounter.id === "encounter.auto.1.0" &&
          encounter.arrivalClass === "routine",
      ),
    ).toBe(true);
    expect(state.totalOperatingExpenses).toBeGreaterThan(0);
    expect(state.cash).toBeLessThan(beforeCash);
    expect(getWorkloadSnapshot(state).routineLimit).toBe(8);
  });

  it("migrates the unpublished v1 local save to schema v2 and rebuilds its review evidence", () => {
    let state = openTutorial(
      createInitialGameState(undefined, {
        campaignId: "campaign.to-legacy",
        campaignSeed: "seed-to-legacy",
        createdAtRealMs: 0,
      }),
      "migration.open",
    );
    state = answerEncounter(
      state,
      TUTORIAL_ENCOUNTER_ID,
      "choice.signal.alpha",
      "migration.answer",
      60_000,
    );
    const legacy = JSON.parse(serializeGameState(state)) as Record<
      string,
      unknown
    >;
    legacy.schemaVersion = 1;
    for (const key of [
      "campaignId",
      "campaignSeed",
      "createdAtRealMs",
      "schedulerPins",
      "facilityLevel",
      "employees",
      "learningHistories",
      "nextRoutineArrivalTick",
      "routineArrivalSequence",
      "totalOperatingExpenses",
    ]) {
      delete legacy[key];
    }
    legacy.reviewIntents = (
      legacy.reviewIntents as Array<Record<string, unknown>>
    ).map(({ reviewedAtMs: _removed, ...intent }) => intent);

    const migrated = deserializeGameState(JSON.stringify(legacy));
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.campaignId).toBe("campaign.migrated.local-v1");
    expect(
      migrated.learningHistories["concept.synthetic.signal"]?.reviews,
    ).toHaveLength(1);
    expect(migrated.schedulerPins.libraryVersion).toBe("5.4.1");
  });
});
