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
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
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

function makeQuestionReady(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) {
      return next;
    }
    const encounter = next.encounters[encounterId];
    if (!encounter) {
      throw new Error(`Missing encounter ${encounterId}.`);
    }
    if (
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement === null
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

describe("current prototype contracts", () => {
  it("validates the approved synthetic content and centralized Level 0–1 balance", () => {
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
      patientTravelTilesPerTick: 4,
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
    const initial = createInitialGameState(undefined, {
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
      createInitialGameState(undefined, {
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
      schemaVersion: 6,
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
