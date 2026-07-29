import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  type GameCommand,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  FIRST_TUTORIAL_CASE_ID,
  SECOND_TUTORIAL_CASE_ID,
} from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { createTutorialStepView } from "./tutorialViewModels";
import { createPrototypePlayerView } from "./viewModels";

let sequence = 0;
type WithoutOperationId =
  GameCommand extends infer Command
    ? Command extends { operationId: string }
      ? Omit<Command, "operationId">
      : never
    : never;

function reduce(
  state: GameState,
  command: WithoutOperationId,
): GameState {
  sequence += 1;
  return gameReducer(state, {
    ...command,
    operationId: `tutorial.current.${sequence}`,
  } as GameCommand);
}

function tick(state: GameState): GameState {
  return reduce(state, { type: "ADVANCE_TICK" });
}

function advanceUntil(
  state: GameState,
  predicate: (candidate: GameState) => boolean,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 500; attempt += 1) {
    if (predicate(next)) {
      return next;
    }
    next = tick(next);
  }
  throw new Error("Tutorial state did not reach the expected condition.");
}

function answerCorrect(
  state: GameState,
  encounterId: string,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error("Expected an answer-ready tutorial question.");
  }
  const answer = question.node.answerChoices.find(
    (choice) => choice.isCorrect,
  )!;
  return reduce(state, {
    type: "SUBMIT_ANSWER",
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: answer.id,
    reviewedAtMs: 1_000 + sequence,
  });
}

function view(
  state: GameState,
  options: {
    introDismissed?: boolean;
    buildMode?: boolean;
    selectedRoomDefinitionId?: string | null;
    selectedRoomInstanceId?: string | null;
    acknowledged?: string[];
    summaryVisible?: boolean;
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
    selectedRoomInstanceId:
      options.selectedRoomInstanceId ?? null,
    summaryVisible: options.summaryVisible ?? false,
  });
}

describe("state-driven tutorial coach", () => {
  it("keeps the first tutorial to one immediate decision and gates every explanation on acknowledgment", () => {
    let state = createInitialGameState();
    const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(first.frozenCase.id).toBe(FIRST_TUTORIAL_CASE_ID);
    expect(first.frozenCase.decisionNodes).toHaveLength(1);
    expect(first.frozenCase.decisionNodes[0]!.resultGateAfter).toBeNull();
    expect(first.waiting.patienceExempt).toBe(true);

    expect(view(state)?.id).toBe("first-patient-arriving");
    expect(view(state)?.id).toBe("first-patient-arriving");

    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[TUTORIAL_ENCOUNTER_ID]!
          .patientMovement === null,
    );
    expect(
      view(state, { acknowledged: ["first-patient-arriving"] })?.id,
    ).toBe("open-first-chart");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    const beforeDecision = [
      "first-patient-arriving",
      "open-first-chart",
    ];
    expect(view(state, { acknowledged: beforeDecision })?.id).toBe(
      "first-decision",
    );

    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    const completedChart = createPrototypePlayerView(
      state,
      TUTORIAL_ENCOUNTER_ID,
      false,
      null,
    ).chart;
    expect(completedChart?.decisionSteps?.[0]?.rewardLabel).toBe(
      "Decision XP: +20",
    );
    expect(completedChart?.reward).toMatchObject({
      heading: "Decisions Correct: 1/1",
      xpLabel: "Encounter XP: +20",
    });
    expect(
      view(state, {
        acknowledged: [...beforeDecision, "first-decision"],
      })?.id,
    ).toBe("first-feedback");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe(
      "resolved_summary_available",
    );

    state = reduce(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    const throughFeedback = [
      ...beforeDecision,
      "first-decision",
      "first-feedback",
    ];
    expect(view(state, { acknowledged: throughFeedback })).toMatchObject({
      id: "first-encounter-summary",
      target: "encounter-summary",
    });
    expect(
      view(state, {
        acknowledged: [
          ...throughFeedback,
          "first-encounter-summary",
        ],
      }),
    ).toMatchObject({
      id: "flip-first-chart",
      title: "Flip for More Disease Information",
    });
    expect(
      view(state, {
        acknowledged: [
          ...throughFeedback,
          "first-encounter-summary",
          "flip-first-chart",
        ],
        summaryVisible: true,
      }),
    ).toMatchObject({
      id: "resolve-first-chart",
      title: "Resolve Completed Chart",
    });
  });

  it("uses the protected second patient to explain a ten-minute facility-time service and returned decision", () => {
    let state = createInitialGameState();
    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[TUTORIAL_ENCOUNTER_ID]!.patientMovement ===
        null,
    );
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    state = reduce(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = tick(state);

    const second = state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!;
    expect(second.frozenCase.id).toBe(SECOND_TUTORIAL_CASE_ID);
    expect(second.frozenCase.decisionNodes).toHaveLength(2);
    expect(second.waiting.patienceExempt).toBe(true);
    expect(
      second.frozenCase.decisionNodes[0]!.resultGateAfter,
    ).not.toBeNull();

    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!
          .patientMovement === null,
    );
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    const acknowledged = [
      "first-patient-arriving",
      "open-first-chart",
      "first-decision",
      "first-feedback",
      "first-encounter-summary",
      "flip-first-chart",
      "resolve-first-chart",
      "between-tutorial-patients",
      "second-patient-arriving",
      "open-second-chart",
    ];
    const timedDecision = view(state, { acknowledged });
    expect(timedDecision).toMatchObject({
      id: "second-first-decision",
      target: "answer-choices",
    });
    expect(timedDecision?.body).toContain("10 minutes");
    expect(timedDecision?.body).toContain("facility clock");

    state = answerCorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
    expect(
      view(state, {
        acknowledged: [...acknowledged, "second-first-decision"],
      })?.id,
    ).toBe("second-plan-feedback");

    const firstStep =
      state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.steps[0]!;
    state = reduce(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: firstStep.decisionNodeId,
    });
    expect(
      view(state, {
        acknowledged: [
          ...acknowledged,
          "second-first-decision",
          "second-plan-feedback",
        ],
      })?.id,
    ).toBe("second-sendout-wait");

    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!
          .lifecycle === "active_action_required",
    );
    const throughWait = [
      ...acknowledged,
      "second-first-decision",
      "second-plan-feedback",
      "second-sendout-wait",
    ];
    expect(view(state, { acknowledged: throughWait })?.id).toBe(
      "second-result-ready",
    );
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    expect(
      view(state, {
        acknowledged: [...throughWait, "second-result-ready"],
      })?.id,
    ).toBe("second-follow-up-decision");
  });

  it("teaches the room footprint and explicit $0 door before allowing build exit", () => {
    let state = createInitialGameState();
    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[TUTORIAL_ENCOUNTER_ID]!.patientMovement ===
        null,
    );
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    state = reduce(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = tick(state);
    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!
          .patientMovement === null,
    );
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    state = answerCorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
    const secondFirstStep =
      state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.steps[0]!;
    state = reduce(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: secondFirstStep.decisionNodeId,
    });
    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!
          .lifecycle === "active_action_required",
    );
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    state = answerCorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
    state = reduce(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
    state = reduce(state, {
      type: "CLOSE_CHART",
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });

    const beforeBuild = [
      "first-patient-arriving",
      "open-first-chart",
      "first-decision",
      "first-feedback",
      "first-encounter-summary",
      "flip-first-chart",
      "resolve-first-chart",
      "between-tutorial-patients",
      "second-patient-arriving",
      "open-second-chart",
      "second-first-decision",
      "second-plan-feedback",
      "second-sendout-wait",
      "second-result-ready",
      "second-follow-up-decision",
      "second-final-feedback",
      "resolve-second-chart",
      "alerts-tour",
    ];
    expect(
      view(state, {
        acknowledged: beforeBuild.slice(0, -1),
        summaryVisible: true,
      })?.id,
    ).toBe("alerts-tour");
    expect(
      view(state, {
        acknowledged: beforeBuild,
        summaryVisible: true,
      })?.id,
    ).toBe("enter-build-mode");
    expect(
      view(state, {
        acknowledged: [...beforeBuild, "enter-build-mode"],
        buildMode: true,
        summaryVisible: true,
      })?.id,
    ).toBe(
      "select-exam-room",
    );
    expect(
      view(state, {
        buildMode: true,
        acknowledged: [
          ...beforeBuild,
          "enter-build-mode",
          "select-exam-room",
        ],
        selectedRoomDefinitionId: "room.examination",
        summaryVisible: true,
      })?.id,
    ).toBe("place-exam-room");

    state.rooms.push({
      id: "room.exam.tutorial",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    expect(
      view(state, {
        buildMode: true,
        acknowledged: [
          ...beforeBuild,
          "enter-build-mode",
          "select-exam-room",
          "place-exam-room",
        ],
        summaryVisible: true,
      })?.id,
    ).toBe("select-exam-room-for-door");
    expect(
      view(state, {
        buildMode: true,
        acknowledged: [
          ...beforeBuild,
          "enter-build-mode",
          "select-exam-room",
          "place-exam-room",
          "select-exam-room-for-door",
        ],
        selectedRoomInstanceId: "room.exam.tutorial",
        summaryVisible: true,
      })?.id,
    ).toBe("place-exam-room-door");

    state.doors.push({
      id: "door.exam.tutorial",
      roomId: "room.exam.tutorial",
      side: "south",
      offset: 1,
      exterior: false,
    });
    expect(
      view(state, {
        buildMode: true,
        acknowledged: [
          ...beforeBuild,
          "enter-build-mode",
          "select-exam-room",
          "place-exam-room",
          "select-exam-room-for-door",
          "place-exam-room-door",
        ],
        summaryVisible: true,
      })?.id,
    ).toBe(
      "exit-build-mode",
    );
  });

  it("introduces routine arrival and movement before a Level 1 service drill", () => {
    let state = createInitialGameState();
    state.facilityLevel = 1;
    state.encounters = {};
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    expect(view(state)?.id).toBe("level-one-ready");

    state = reduce(state, {
      type: "ADMIT_PATIENT",
      encounterId: "encounter.level-one.service-drill",
      caseId: "case.synthetic.lab-routing",
      patientDisplayName: "Tutorial Router",
      arrivalClass: "routine",
    });
    expect(view(state)).toMatchObject({
      id: "level-one-first-arrival",
      title: "A patient is walking to check-in",
    });
    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters["encounter.level-one.service-drill"]!
          .patientMovement === null,
    );
    expect(view(state)).toMatchObject({
      id: "level-one-first-arrival",
      target: "waiting-patient",
    });

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: "encounter.level-one.service-drill",
    });
    expect(view(state)).toMatchObject({
      id: "level-one-service-drill",
      title: "This artificial patient demonstrates service routing",
      target: "answer-choices",
    });
    state = advanceUntil(
      state,
      (candidate) =>
        getCurrentQuestion(
          candidate,
          "encounter.level-one.service-drill",
        ) !== null,
    );
    expect(view(state)).toMatchObject({
      id: "level-one-service-drill",
      target: "answer-choices",
    });
  });

  it("returns no coach when prototype tools disable tutorials", () => {
    expect(
      createTutorialStepView({
        state: createInitialGameState(),
        tutorialsEnabled: false,
        introDismissed: false,
        acknowledgedStepIds: new Set(),
        buildMode: false,
        selectedRoomDefinitionId: null,
      }),
    ).toBeNull();
  });
});
