import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  type GameCommand,
  type GameState,
} from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";
import { createTutorialStepView } from "./tutorialViewModels";
import { createPrototypePlayerView } from "./viewModels";

let operationSequence = 0;

type CommandWithoutOperationId =
  GameCommand extends infer Command
    ? Command extends { operationId: string }
      ? Omit<Command, "operationId">
      : never
    : never;

function reduce(
  state: GameState,
  command: CommandWithoutOperationId,
): GameState {
  operationSequence += 1;
  return gameReducer(state, {
    ...command,
    operationId: `tutorial-view.${operationSequence}`,
  } as Parameters<typeof gameReducer>[1]);
}

function answerCorrect(
  state: GameState,
  encounterId: string,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error("Expected an action-ready tutorial question.");
  }
  const correctChoice = question.node.answerChoices.find(
    (choice) => choice.isCorrect,
  );
  if (!correctChoice) {
    throw new Error("Expected a correct tutorial answer.");
  }
  return reduce(state, {
    type: "SUBMIT_ANSWER",
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: correctChoice.id,
    reviewedAtMs: 1_000 + operationSequence,
  });
}

function answerIncorrect(
  state: GameState,
  encounterId: string,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error("Expected an action-ready tutorial question.");
  }
  const incorrectChoice = question.node.answerChoices.find(
    (choice) => !choice.isCorrect,
  );
  if (!incorrectChoice) {
    throw new Error("Expected an incorrect tutorial answer.");
  }
  return reduce(state, {
    type: "SUBMIT_ANSWER",
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: incorrectChoice.id,
    reviewedAtMs: 1_000 + operationSequence,
  });
}

function view(
  state: GameState,
  options: {
    introDismissed?: boolean;
    acknowledged?: string[];
    buildMode?: boolean;
    selectedRoomDefinitionId?: string | null;
  } = {},
) {
  return createTutorialStepView({
    state,
    tutorialsEnabled: true,
    introDismissed: options.introDismissed ?? true,
    acknowledgedStepIds: new Set(
      (options.acknowledged ?? []).map(
        (id) => `${state.campaignId}:${id}`,
      ),
    ),
    buildMode: options.buildMode ?? false,
    selectedRoomDefinitionId:
      options.selectedRoomDefinitionId ?? null,
  });
}

describe("Level 0 tutorial view model", () => {
  it("guides the full chart, result, construction, and level-up loop", () => {
    let state = createInitialGameState();

    expect(
      createTutorialStepView({
        state,
        tutorialsEnabled: true,
        introDismissed: false,
        acknowledgedStepIds: new Set(),
        buildMode: false,
        selectedRoomDefinitionId: null,
      })?.id,
    ).toBe("welcome");
    expect(view(state)?.id).toBe("open-first-chart");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("first-decision");

    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    expect(view(state)?.id).toBe("off-site-result");
    const pendingResult =
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.pendingResult;
    expect(pendingResult).not.toBeNull();
    expect(
      pendingResult!.dueTick - state.facilityTick,
    ).toBe(1);

    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "DEV_FAST_FORWARD",
      tickCount: 1,
    });
    expect(view(state)?.id).toBe("results-ready");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("follow-up-decision");
    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    expect(view(state)?.id).toBe("resolve-first-chart");
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "DEV_FAST_FORWARD",
      tickCount: 1,
    });
    expect(view(state)?.id).toBe("second-patient");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("second-decision");
    state = answerCorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
    expect(view(state)?.id).toBe("resolve-second-chart");
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });

    expect(view(state)?.id).toBe("enter-build-mode");
    expect(view(state, { buildMode: true })?.id).toBe(
      "select-exam-room",
    );
    expect(
      view(state, {
        buildMode: true,
        selectedRoomDefinitionId: "room.examination",
      })?.id,
    ).toBe("place-exam-room");

    state = {
      ...state,
      rooms: [
        ...state.rooms,
        {
          id: "room.instance.tutorial-test-exam",
          roomDefinitionId: "room.examination",
          x: 3,
          y: 3,
          orientation: 0,
          doorSide: "south",
          upgradeLevel: 1,
        },
      ],
    };
    expect(view(state, { buildMode: true })?.id).toBe(
      "exit-build-mode",
    );
    expect(view(state)?.id).toBe("advance-level");

    state = reduce(state, { type: "LEVEL_UP" });
    expect(view(state)?.id).toBe("level-one-ready");
    expect(
      view(state, { acknowledged: ["level-one-ready"] }),
    ).toBeNull();
    expect(view(state)?.primaryAction).toEqual({
      id: "acknowledge-step",
      label: "Close tutorial",
    });
  });

  it("introduces Level 1 arrivals and send-out testing through real controls", () => {
    let state: GameState = {
      ...createInitialGameState(),
      facilityLevel: 1,
      encounters: {},
      nextRoutineArrivalTick: 10,
    };

    expect(view(state)).toMatchObject({
      id: "level-one-ready",
      targetSelector: ".facility-time-chip",
    });
    expect(view(state)?.primaryAction).toEqual({
      id: "acknowledge-step",
      label: "Close tutorial",
    });

    state = reduce(state, {
      type: "ADMIT_PATIENT",
      encounterId: "encounter.level-one.service-drill",
      caseId: "case.synthetic.lab-routing",
      patientDisplayName: "Tutorial Router",
      arrivalClass: "routine",
    });
    expect(view(state)).toMatchObject({
      id: "level-one-first-arrival",
      patientEncounterId: "encounter.level-one.service-drill",
    });
    expect(view(state)?.primaryAction).toBeUndefined();

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: "encounter.level-one.service-drill",
    });
    expect(view(state)).toMatchObject({
      id: "level-one-service-drill",
      target: "answer-choices",
    });
    expect(view(state)?.primaryAction).toBeUndefined();

    state = answerCorrect(
      state,
      "encounter.level-one.service-drill",
    );
    expect(view(state)).toMatchObject({
      id: "level-one-sendout-wait",
      patientEncounterId: "encounter.level-one.service-drill",
    });
    expect(view(state)?.primaryAction).toBeUndefined();
    const patientTab = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).patients.find(
      (patient) =>
        patient.id === "encounter.level-one.service-drill",
    );
    expect(patientTab?.statusLabel).toMatch(
      /returns in \d+ hours?/,
    );
    expect(patientTab?.statusLabel).not.toContain("tick");
    const pending =
      state.encounters["encounter.level-one.service-drill"]!
        .pendingResult;
    expect(pending).not.toBeNull();

    state = reduce(state, {
      type: "DEV_FAST_FORWARD",
      tickCount: pending!.dueTick - state.facilityTick,
    });
    expect(view(state)).toMatchObject({
      id: "level-one-result-ready",
    });
    expect(view(state)?.primaryAction).toBeUndefined();

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: "encounter.level-one.service-drill",
    });
    expect(view(state)).toMatchObject({
      id: "level-one-returned-result",
      target: "answer-choices",
    });
    expect(view(state)?.primaryAction).toBeUndefined();
  });

  it("returns no tutorial when prototype tools disable guidance", () => {
    const state = createInitialGameState();
    expect(
      createTutorialStepView({
        state,
        tutorialsEnabled: false,
        introDismissed: false,
        acknowledgedStepIds: new Set(),
        buildMode: false,
        selectedRoomDefinitionId: null,
      }),
    ).toBeNull();
  });

  it("guides players back after they close charts off the happy path", () => {
    let state = createInitialGameState();

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("reopen-first-chart");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "DEV_FAST_FORWARD",
      tickCount: 1,
    });
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = answerIncorrect(state, TUTORIAL_ENCOUNTER_ID);
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("reopen-first-feedback");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "DEV_FAST_FORWARD",
      tickCount: 1,
    });

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("reopen-second-chart");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    state = answerIncorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("reopen-second-feedback");
  });
});
