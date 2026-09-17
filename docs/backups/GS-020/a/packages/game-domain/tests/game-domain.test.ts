import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_BALANCE_RELEASE,
  validatePrototypeBalanceRelease,
} from "@gamify-surgery/balance-config";
import {
  SYNTHETIC_CLINICAL_RELEASE,
  validateSyntheticClinicalRelease,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEmergencyGlp1Status,
  getFacilityAccessValidation,
  getCurrentQuestion,
  getEncounterSettlement,
  serializeGameState,
  validateDomainContext,
  type GameState,
} from "../src";

function tick(state: GameState, id: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: id,
  });
}

function createTutorialState(
  options?: Parameters<typeof createInitialGameState>[1],
): GameState {
  return createInitialGameState(undefined, options);
}

function makeQuestionReady(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) {
      return next;
    }
    const encounter = next.encounters[encounterId];
    if (!encounter) {
      throw new Error(`Missing encounter ${encounterId}.`);
    }
    if (
      encounter.lifecycle === "waiting_unopened" &&
      encounter.checkInStatus === "checked_in"
    ) {
      next = gameReducer(next, {
        type: "OPEN_CHART",
        operationId: `${prefix}.open.${attempt}`,
        encounterId,
      });
      continue;
    }
    next = tick(next, `${prefix}.tick.${attempt}`);
  }
  throw new Error(`Question for ${encounterId} did not become ready.`);
}

function answerCurrent(
  state: GameState,
  encounterId: string,
  correct: boolean,
  prefix: string,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error("Expected an action-ready question.");
  }
  const choice = question.node.answerChoices.find(
    (candidate) => candidate.isCorrect === correct,
  );
  if (!choice) {
    throw new Error("The synthetic question lacks the requested answer.");
  }
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId: `${prefix}.answer`,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs: 1_000,
  });
}

function completeTutorialCorrectly(
  state: GameState,
  prefix: string,
): GameState {
  let next = state;
  let decision = 0;
  while (
    next.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason === null
  ) {
    next = makeQuestionReady(
      next,
      TUTORIAL_ENCOUNTER_ID,
      `${prefix}.ready.${decision}`,
    );
    next = answerCurrent(
      next,
      TUTORIAL_ENCOUNTER_ID,
      true,
      `${prefix}.decision.${decision}`,
    );
    const encounter = next.encounters[TUTORIAL_ENCOUNTER_ID]!;
    const step = encounter.steps[encounter.currentNodeIndex];
    if (step?.status === "feedback_pending") {
      next = gameReducer(next, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: `${prefix}.ack.${decision}`,
        encounterId: TUTORIAL_ENCOUNTER_ID,
        decisionNodeId: step.decisionNodeId,
      });
    }
    decision += 1;
  }
  return next;
}

function completeEncounterIncorrectly(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  let next = state;
  let decision = 0;
  while (next.encounters[encounterId]!.resolutionReason === null) {
    next = makeQuestionReady(
      next,
      encounterId,
      `${prefix}.ready.${decision}`,
    );
    next = answerCurrent(
      next,
      encounterId,
      false,
      `${prefix}.decision.${decision}`,
    );
    const encounter = next.encounters[encounterId]!;
    const step = encounter.steps[encounter.currentNodeIndex];
    if (step?.status === "feedback_pending") {
      next = gameReducer(next, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: `${prefix}.ack.${decision}`,
        encounterId,
        decisionNodeId: step.decisionNodeId,
      });
    }
    decision += 1;
  }
  next = gameReducer(next, {
    type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
    operationId: `${prefix}.ack-terminal`,
    encounterId,
  });
  next = gameReducer(next, {
    type: "CLOSE_CHART",
    operationId: `${prefix}.close`,
    encounterId,
  });
  return next;
}

describe("current prototype contracts", () => {
  it("starts without an Examination Room and lets only the two protected tutorial visits use the Front Desk", () => {
    let state = createInitialGameState();
    expect(state.rooms).toEqual([
      expect.objectContaining({
        id: "room.instance.founder_desk",
        roomDefinitionId: "room.front_desk",
      }),
    ]);
    expect(state.rooms.some((room) => room.roomDefinitionId === "room.examination")).toBe(false);
    expect(state.doors).toEqual([
      expect.objectContaining({
        id: "door.instance.front_entrance",
        roomId: "room.instance.founder_desk",
      }),
    ]);
    expect(getFacilityAccessValidation(state)).toMatchObject({
      valid: true,
      unreachableRoomIds: [],
    });

    for (let tickIndex = 0; tickIndex < 120; tickIndex += 1) {
      state = tick(state, `starter-exam.arrive.${tickIndex}`);
      if (state.encounters[TUTORIAL_ENCOUNTER_ID]?.checkInStatus === "checked_in") break;
    }
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]?.checkInStatus).toBe("checked_in");
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "first-tutorial.front-desk",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(state.operationReceipts["first-tutorial.front-desk"]?.status).toBe("applied");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      lifecycle: "active_action_required",
    });
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]?.patientMovement
        ?.destinationRoomInstanceId,
    ).toBe("room.instance.founder_desk");
    expect(state.environment.founderActivity).toBeNull();

    state = completeTutorialCorrectly(state, "front-desk-bridge");
    expect(state.cash).toBeGreaterThanOrEqual(160);
  });

  it("funds and persists a player-built Examination Room after both protected tutorials are answered incorrectly", () => {
    let state = createTutorialState({
      campaignId: "campaign.player-built-exam",
      campaignSeed: "player-built-exam",
      createdAtRealMs: 0,
    });

    state = completeEncounterIncorrectly(
      state,
      TUTORIAL_ENCOUNTER_ID,
      "incorrect.first-tutorial",
    );
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      resolutionReason: "completed",
    });
    expect(getEncounterSettlement(state, TUTORIAL_ENCOUNTER_ID)).toMatchObject({
      netCashDelta: 25,
      correctAnswers: 0,
      incorrectAnswers: 1,
    });

    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]) break;
      state = tick(state, `incorrect.second-tutorial.spawn.${attempt}`);
    }
    expect(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]).toBeDefined();
    state = completeEncounterIncorrectly(
      state,
      SECOND_TUTORIAL_ENCOUNTER_ID,
      "incorrect.second-tutorial",
    );
    expect(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      resolutionReason: "completed",
    });
    expect(
      getEncounterSettlement(state, SECOND_TUTORIAL_ENCOUNTER_ID),
    ).toMatchObject({
      netCashDelta: 35,
      correctAnswers: 0,
      incorrectAnswers: 2,
    });
    expect({
      facilityTick: state.facilityTick,
      cash: state.cash,
    }).toEqual({ facilityTick: 196, cash: 160.5 });
    expect(state.cash).toBeGreaterThanOrEqual(160);

    let delayed = deserializeGameState(serializeGameState(state));
    while (delayed.facilityTick < 210) {
      delayed = tick(delayed, `delayed-reader.${delayed.facilityTick}`);
    }
    expect(delayed.cash).toBeLessThan(160);
    expect(getEmergencyGlp1Status(delayed)).toMatchObject({
      eligible: true,
      blockedReason: null,
    });
    delayed = gameReducer(delayed, {
      type: "RUN_EMERGENCY_GLP1_CONSULTATION",
      operationId: "delayed-reader.emergency-consult",
    });
    expect(
      delayed.operationReceipts["delayed-reader.emergency-consult"]?.status,
    ).toBe("applied");
    expect(delayed.cash).toBeGreaterThanOrEqual(160);
    delayed = gameReducer(delayed, {
      type: "PLACE_ROOM",
      operationId: "delayed-reader.build-exam",
      roomId: "room.delayed-reader.examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
    });
    expect(
      delayed.operationReceipts["delayed-reader.build-exam"]?.status,
    ).toBe("applied");

    const cashBeforeRoom = state.cash;
    state = gameReducer(state, {
      type: "PLACE_ROOM",
      operationId: "player-build.exam-room",
      roomId: "room.player-built.examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
    });
    expect(state.operationReceipts["player-build.exam-room"]?.status).toBe(
      "applied",
    );
    expect(state.cash).toBe(cashBeforeRoom - 160);
    expect(state.rooms).toContainEqual(
      expect.objectContaining({
        id: "room.player-built.examination",
        roomDefinitionId: "room.examination",
      }),
    );

    state = gameReducer(state, {
      type: "PLACE_DOOR",
      operationId: "player-build.exam-door",
      doorId: "door.player-built.examination",
      roomId: "room.player-built.examination",
      side: "south",
      offset: 1,
    });
    expect(state.operationReceipts["player-build.exam-door"]?.status).toBe(
      "applied",
    );
    expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true });

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.rooms).toContainEqual(
      expect.objectContaining({
        id: "room.player-built.examination",
        roomDefinitionId: "room.examination",
      }),
    );
    expect(restored.doors).toContainEqual(
      expect.objectContaining({
        id: "door.player-built.examination",
        roomId: "room.player-built.examination",
      }),
    );
    expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      resolutionReason: "completed",
    });
    expect(restored.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      resolutionReason: "completed",
    });
    expect(restored.cash).toBe(state.cash);
    expect(restored.clinicalXp).toBe(state.clinicalXp);
  });

  it("keeps ordinary and unreachable-room care gated after the protected tutorials", () => {
    const protectedWithUnreachableRoom = createInitialGameState();
    const protectedEncounter =
      protectedWithUnreachableRoom.encounters[TUTORIAL_ENCOUNTER_ID]!;
    protectedEncounter.checkInStatus = "checked_in";
    protectedEncounter.patientMovement = null;
    protectedWithUnreachableRoom.rooms.push({
      id: "room.protected.unreachable-examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    const protectedRejected = gameReducer(protectedWithUnreachableRoom, {
      type: "OPEN_CHART",
      operationId: "protected.unreachable-exam",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(
      protectedRejected.operationReceipts["protected.unreachable-exam"]?.status,
    ).toBe("rejected");

    const state = createInitialGameState();
    const tutorial = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.encounters = {
      "encounter.ordinary": {
        ...tutorial,
        id: "encounter.ordinary",
        arrivalClass: "routine",
        checkInStatus: "checked_in",
        patientMovement: null,
        lifecycle: "waiting_unopened",
      },
    };

    let rejected = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "ordinary.no-exam",
      encounterId: "encounter.ordinary",
    });
    expect(rejected.operationReceipts["ordinary.no-exam"]?.status).toBe("rejected");
    expect(rejected.operationReceipts["ordinary.no-exam"]?.message).toBe(
      "No reachable Examination Room is available for this visit.",
    );

    rejected.rooms.push({
      id: "room.unreachable.examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    rejected = gameReducer(rejected, {
      type: "OPEN_CHART",
      operationId: "ordinary.unreachable-exam",
      encounterId: "encounter.ordinary",
    });
    expect(
      rejected.operationReceipts["ordinary.unreachable-exam"]?.status,
    ).toBe("rejected");
    expect(
      rejected.operationReceipts["ordinary.unreachable-exam"]?.message,
    ).toBe("No reachable Examination Room is available for this visit.");
  });

  it("validates the approved synthetic content and centralized Level 0-2 balance", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(() =>
      validatePrototypeBalanceRelease(PROTOTYPE_BALANCE_RELEASE),
    ).not.toThrow();
    expect(() =>
      validateDomainContext(PROTOTYPE_DOMAIN_CONTEXT),
    ).not.toThrow();

    expect(PROTOTYPE_BALANCE_RELEASE.facility).toMatchObject({
      gridWidth: 72,
      gridHeight: 32,
      startingCash: 120,
      characterTravelTilesPerTick: 2,
    });
    expect(
      PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions,
    ).toEqual([
      expect.objectContaining({
        level: 0,
        minimumClinicalXp: 10,
        requiredRoomDefinitionIds: ["room.examination"],
      }),
      expect.objectContaining({
        level: 1,
        minimumClinicalXp: 150,
        requiredRoomDefinitionIds: [
          "room.xray",
          "room.minor_procedure",
        ],
        nextFacilityLevel: 2,
      }),
      expect.objectContaining({
        level: 2,
        minimumClinicalXp: 300,
        requiredRoomDefinitionIds: [
          "room.endoscopy",
          "room.periop_recovery",
        ],
        requiredStaffRoleIds: [
          "staff.periop_nurse",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
        ],
        nextFacilityLevel: null,
      }),
    ]);
    expect(PROTOTYPE_BALANCE_RELEASE.clock.supportedSpeeds).toEqual([
      1, 2, 4,
    ]);
  });

  it("requires authored consequence data for every no-vignette final choice", () => {
    const dispositions = SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(
      (clinicalCase) =>
        clinicalCase.decisionNodes.flatMap(
          (node) => node.terminalDispositions,
        ),
    );
    const authoredNoVignette = dispositions.find(
      (disposition) => disposition.kind === "no_terminal_outcome",
    );
    expect(authoredNoVignette).toMatchObject({
      kind: "no_terminal_outcome",
      consequenceNarrative: expect.any(String),
      clinicalRationale: expect.any(String),
      sourceLabels: expect.any(Array),
    });

    const invalid = JSON.parse(
      JSON.stringify(SYNTHETIC_CLINICAL_RELEASE),
    ) as Record<string, unknown>;
    const cases = invalid.cases as Array<Record<string, unknown>>;
    const nodes = cases.flatMap(
      (clinicalCase) =>
        clinicalCase.decisionNodes as Array<Record<string, unknown>>,
    );
    const bareDisposition = nodes
      .flatMap(
        (node) =>
          node.terminalDispositions as Array<Record<string, unknown>>,
      )
      .find(
        (disposition) =>
          disposition.kind === "no_terminal_outcome",
      );
    expect(bareDisposition).toBeDefined();
    delete bareDisposition!.consequenceNarrative;

    expect(() => validateSyntheticClinicalRelease(invalid)).toThrow();
  });

  it("routes the tutorial patient, scores one concept per decision, and settles with current formulas", () => {
    const initial = createTutorialState({
      campaignSeed: "current-tutorial",
      createdAtRealMs: 0,
    });
    expect(
      initial.encounters[TUTORIAL_ENCOUNTER_ID]!.patientMovement?.kind,
    ).toBe("arriving_for_check_in");

    const complete = completeTutorialCorrectly(initial, "tutorial");
    const encounter = complete.encounters[TUTORIAL_ENCOUNTER_ID]!;
    const settlement = getEncounterSettlement(
      complete,
      TUTORIAL_ENCOUNTER_ID,
    );

    expect(encounter.answers).toHaveLength(1);
    expect(
      encounter.answers.every(
        (answer) => answer.primaryConceptId.length > 0,
      ),
    ).toBe(true);
    expect(settlement).toMatchObject({
      completionRevenue: 75,
      qualityRevenueBonus: 0,
      netCashDelta: 75,
      clinicalXpAwarded: 20,
      correctAnswers: 1,
      incorrectAnswers: 0,
    });
    expect(complete.clinicalXp).toBe(20);
    for (const answer of encounter.answers) {
      expect(
        complete.learningHistories[answer.primaryConceptId]?.reviews,
      ).toHaveLength(1);
    }
  });

  it("keeps FSRS histories isolated between campaigns", () => {
    const learned = completeTutorialCorrectly(
      createTutorialState({
        campaignId: "campaign.learned",
        campaignSeed: "campaign-learned",
        createdAtRealMs: 0,
      }),
      "learned",
    );
    const fresh = createInitialGameState(undefined, {
      campaignId: "campaign.fresh",
      campaignSeed: "campaign-fresh",
      createdAtRealMs: 0,
    });

    expect(
      Object.values(learned.learningHistories).some(
        (history) => history.reviews.length > 0,
      ),
    ).toBe(true);
    expect(
      Object.values(fresh.learningHistories).every(
        (history) => history.reviews.length === 0,
      ),
    ).toBe(true);
  });

  it("round-trips movement, timing, founder, and immutable release pins", () => {
    let state = createInitialGameState(undefined, {
      campaignId: "campaign.save",
      campaignSeed: "save-current",
      createdAtRealMs: 123,
    });
    state = tick(state, "save.tick.1");
    const restored = deserializeGameState(serializeGameState(state));

    expect(restored).toMatchObject({
      schemaVersion: 7,
      campaignId: state.campaignId,
      campaignSeed: state.campaignSeed,
      clinicalReleaseId: state.clinicalReleaseId,
      balanceReleaseId: state.balanceReleaseId,
      facilityTick: 1,
    });
    expect(
      restored.encounters[TUTORIAL_ENCOUNTER_ID]!.patientMovement,
    ).toEqual(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientMovement,
    );
    expect(restored.schedulerPins).toEqual(state.schedulerPins);
  });

  it("normalizes pre-consequence schema-v5 terminal feedback safely", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.old-terminal-feedback",
      campaignSeed: "old-terminal-feedback",
      createdAtRealMs: 0,
    });
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    (
      encounter as unknown as {
        terminalFeedback: Record<string, unknown>;
      }
    ).terminalFeedback = {
      kind: "correction",
      outcome: null,
      correction: "Historical corrective feedback.",
      acknowledged: false,
    };

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters[TUTORIAL_ENCOUNTER_ID]!.terminalFeedback,
    ).toMatchObject({
      correction: "Historical corrective feedback.",
      consequence: null,
    });
  });
});
