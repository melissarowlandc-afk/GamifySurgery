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
  });
}

describe("state-driven tutorial coach", () => {
  it("teaches arrival, care movement, feedback, send-out time, and the returned decision", () => {
    let state = createInitialGameState();
    expect(view(state)?.id).toBe("first-patient-arriving");

    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[TUTORIAL_ENCOUNTER_ID]!
          .patientMovement === null,
    );
    expect(view(state)?.id).toBe("open-first-chart");

    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("first-patient-walking-to-care");
    state = advanceUntil(
      state,
      (candidate) =>
        getCurrentQuestion(candidate, TUTORIAL_ENCOUNTER_ID) !== null,
    );
    expect(view(state)?.id).toBe("first-decision");

    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    expect(view(state)?.id).toBe("first-feedback");
    const step =
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.steps[0]!;
    state = reduce(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      encounterId: TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: step.decisionNodeId,
    });
    expect(view(state)?.id).toBe("off-site-result");

    state = advanceUntil(
      state,
      (candidate) =>
        candidate.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle ===
        "active_action_required",
    );
    expect(view(state)?.id).toBe("results-ready");
    state = reduce(state, {
      type: "OPEN_CHART",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(view(state)?.id).toBe("follow-up-decision");
  });

  it("teaches the room footprint and explicit $0 door before allowing build exit", () => {
    const state = createInitialGameState();
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle = "resolved";
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason =
      "completed";
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientMovement = null;
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientLocation = null;
    const second = JSON.parse(
      JSON.stringify(state.encounters[TUTORIAL_ENCOUNTER_ID]!),
    ) as GameState["encounters"][string];
    second.id = SECOND_TUTORIAL_ENCOUNTER_ID;
    second.lifecycle = "resolved";
    second.resolutionReason = "completed";
    second.patientMovement = null;
    second.patientLocation = null;
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = second;

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
    expect(view(state, { buildMode: true })?.id).toBe(
      "select-exam-room-for-door",
    );
    expect(
      view(state, {
        buildMode: true,
        selectedRoomInstanceId: "room.exam.tutorial",
      })?.id,
    ).toBe("place-exam-room-door");

    state.doors.push({
      id: "door.exam.tutorial",
      roomId: "room.exam.tutorial",
      side: "south",
      offset: 1,
      exterior: false,
    });
    expect(view(state, { buildMode: true })?.id).toBe(
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
      title: "The patient is walking to the care area",
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
