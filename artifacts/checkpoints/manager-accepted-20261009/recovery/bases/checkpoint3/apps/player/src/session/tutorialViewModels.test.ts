import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  gameReducer,
  serializeGameState,
  deserializeGameState,
  getCurrentQuestion,
  getRoomDefinition,
  getEmergencyGlp1Status,
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

function createTutorialState(): GameState {
  return createInitialGameState();
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
    dailyRoutineTipsStarted?: boolean;
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
    dailyRoutineTipsStarted: options.dailyRoutineTipsStarted ?? false,
    buildMode: options.buildMode ?? false,
    selectedRoomDefinitionId:
      options.selectedRoomDefinitionId ?? null,
    selectedRoomInstanceId:
      options.selectedRoomInstanceId ?? null,
    summaryVisible: options.summaryVisible ?? false,
  });
}

describe("first shift derived from native state", () => {
  it("recovers early Build without asking for a hidden chart action", () => {
    const state = openedFirst();
    expect(view(state, {buildMode: true})?.id).toBe("exit-build-mode");
    expect(view(state, {buildMode: true})?.body).toContain("chart stays saved");
    expect(view(state)?.id).toBe("first-decision");
  });

  it.each([[false, false, false], [false, true, false], [true, true, true]])("graduates naturally with honest answer history %j", (...correct) => {
    let state = openedFirst();
    const ids = [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID] as const;
    const answer = (encounterId: string, right: boolean) => {
      const question = getCurrentQuestion(state, encounterId)!;
      state = reduce(state, {type: "SUBMIT_ANSWER", encounterId, decisionNodeId: question.node.id,
        answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect === right)!.id, reviewedAtMs: 1_000 + sequence});
    };
    const file = (encounterId: string) => {
      if (!state.encounters[encounterId]!.terminalFeedback?.acknowledged) state = reduce(state, {type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId});
      state = reduce(state, {type: "CLOSE_CHART", encounterId});
    };
    answer(TUTORIAL_ENCOUNTER_ID, correct[0]!);
    file(TUTORIAL_ENCOUNTER_ID);
    state = advanceUntil(state, (s) => s.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]?.checkInStatus === "checked_in");
    state = reduce(state, {type: "OPEN_CHART", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID});
    answer(SECOND_TUTORIAL_ENCOUNTER_ID, correct[1]!);
    state = reduce(state, {type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.steps[0]!.decisionNodeId});
    state = advanceUntil(state, (s) => getCurrentQuestion(s, SECOND_TUTORIAL_ENCOUNTER_ID) !== null);
    answer(SECOND_TUTORIAL_ENCOUNTER_ID, correct[2]!);
    file(SECOND_TUTORIAL_ENCOUNTER_ID);
    const frozen = ids.map((id) => state.encounters[id]!.frozenCase);
    const answers = ids.flatMap((id) => state.encounters[id]!.answers);
    const reviews = structuredClone(state.reviewIntents);
    const settlements = structuredClone(state.settlements);
    expect(answers.map((entry) => entry.correct)).toEqual(correct);
    expect(reviews).toHaveLength(3);
    expect(settlements).toHaveLength(2);
    const price = getRoomDefinition("room.examination")!.constructionCost;
    for (let attempt = 0; state.cash < price && attempt < 8; attempt += 1) {
      state = advanceUntil(state, (s) => getEmergencyGlp1Status(s).eligible);
      state = reduce(state, {type: "RUN_EMERGENCY_GLP1_CONSULTATION"});
      state = advanceUntil(state, (s) => s.environment.pendingFounderConsult === null);
    }
    expect(state.cash).toBeGreaterThanOrEqual(price);
    state = reduce(state, {type: "SET_PAUSED", paused: true});
    const cash = state.cash;
    state = reduce(state, {type: "PLACE_ROOM", roomId: "exam.natural", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0});
    expect(state.cash).toBe(cash - price);
    state = reduce(state, {type: "LEVEL_UP"});
    expect(state.facilityLevel).toBe(0); // A paid shell without access is insufficient.
    state = deserializeGameState(serializeGameState(state));
    expect(view(state)?.id).toBe("place-exam-room-door");
    state = reduce(state, {type: "PLACE_DOOR", doorId: "exam.natural.door", roomId: "exam.natural", side: "south", offset: 1});
    expect(view(state)?.id).toBe("advance-level");
    state = reduce(state, {type: "LEVEL_UP"});
    expect(state.facilityLevel).toBe(1);
    expect(view(state)).toBeNull();
    state = deserializeGameState(serializeGameState(state));
    expect(ids.map((id) => state.encounters[id]!.frozenCase)).toEqual(frozen);
    expect(ids.flatMap((id) => state.encounters[id]!.answers)).toEqual(answers);
    expect(state.reviewIntents).toEqual(reviews);
    expect(state.settlements).toEqual(settlements);
  });

  it("advances arrival and decision without any coach acknowledgment", () => {
    let state = createTutorialState();
    const frozen = JSON.stringify(state.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase);
    expect(view(state)?.id).toBe("first-patient-arriving");
    state = advanceUntil(state, (s) => s.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus === "checked_in");
    expect(view(state)?.id).toBe("open-first-chart");
    expect(view(state, { acknowledged: ["open-first-chart", "first-decision"] })?.id).toBe("open-first-chart");
    state = reduce(state, { type: "OPEN_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
    expect(view(state)?.id).toBe("first-decision");
    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    expect(view(state)?.id).toBe("resolve-first-chart");
    expect(view(state)?.body).toContain("Money funds the clinic");
    expect(view(state)?.primaryAction).toBeUndefined();
    expect(JSON.stringify(state.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase)).toBe(frozen);
  });

  it("recovers a closed unfinished or answered chart and reloads the same beat", () => {
    let state = openedFirst();
    state = reduce(state, { type: "CLOSE_CHART", encounterId: state.openChartEncounterId! });
    expect(view(state)?.id).toBe("reopen-first-chart");
    state = reduce(state, { type: "OPEN_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
    const question = getCurrentQuestion(state, TUTORIAL_ENCOUNTER_ID)!;
    state = reduce(state, {type: "SUBMIT_ANSWER", encounterId: TUTORIAL_ENCOUNTER_ID, decisionNodeId: question.node.id,
      answerChoiceId: question.node.answerChoices.find((c) => !c.isCorrect)!.id, reviewedAtMs: 1000});
    state = reduce(state, { type: "CLOSE_CHART", encounterId: state.openChartEncounterId! });
    expect(view(state)?.id).toBe("reopen-first-feedback");
    const restored = deserializeGameState(serializeGameState(state));
    expect(view(restored)).toEqual(view(state));
    expect(restored.reviewIntents).toEqual(state.reviewIntents);
    expect(restored.settlements).toEqual(state.settlements);
  });

  it.each([true, false])("keeps terminal filing optional-information free (correct=%s)", (correct) => {
    let state = openedFirst();
    const question = getCurrentQuestion(state, TUTORIAL_ENCOUNTER_ID)!;
    state = reduce(state, { type: "SUBMIT_ANSWER", encounterId: TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((c) => c.isCorrect === correct)!.id, reviewedAtMs: 1000 });
    expect(view(state)?.body).toContain(correct ? "Money funds the clinic" : "answer stays recorded");
    state = reduce(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: TUTORIAL_ENCOUNTER_ID });
    expect(view(state)?.id).toBe("resolve-first-chart");
    state = reduce(state, { type: "CLOSE_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
    expect(view(state)?.id).not.toBe("flip-first-chart");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.answers).toHaveLength(1);
    expect(state.settlements.filter((s) => s.encounterId === TUTORIAL_ENCOUNTER_ID)).toHaveLength(1);
  });

  it("uses the actual timed plan, feedback, physical return and next decision", () => {
    let state = openedSecond();
    const frozen = JSON.stringify(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.frozenCase);
    expect(view(state)?.id).toBe("second-first-decision");
    const question = getCurrentQuestion(state, SECOND_TUTORIAL_ENCOUNTER_ID)!;
    state = reduce(state, { type: "SUBMIT_ANSWER", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((c) => !c.isCorrect)!.id, reviewedAtMs: 2000 });
    expect(view(state)?.id).toBe("enact-second-plan");
    expect(view(state)?.body).toContain("Enact Corrected Plan");
    const feedback = view(state);
    state = reduce(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID, decisionNodeId: "invalid-node" });
    expect(view(state)).toEqual(feedback);
    state = reduce(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID, decisionNodeId: question.node.id });
    expect(view(state)?.id).toBe("second-sendout-wait");
    state = reduce(state, { type: "CLOSE_CHART", encounterId: state.openChartEncounterId! });
    state = advanceUntil(state, (s) => s.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.patientLocation === null && s.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.patientMovement === null);
    expect(view(state)?.id).toBe("sendout-management");
    expect(createTutorialStepView({state, tutorialsEnabled: true, introDismissed: false, acknowledgedStepIds: new Set(),
      buildMode: false, selectedRoomDefinitionId: null, exposedTopicIds: ["management"]})?.id).toBe("second-sendout-wait");
    const saved = deserializeGameState(serializeGameState(state));
    expect(saved.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.pendingResult).toEqual(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.pendingResult);
    state = advanceUntil(saved, (s) => getCurrentQuestion(s, SECOND_TUTORIAL_ENCOUNTER_ID) !== null);
    expect(view(state)?.id).toBe("second-result-ready");
    state = reduce(state, { type: "OPEN_CHART", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID });
    expect(view(state)?.id).toBe("second-follow-up-decision");
    expect(JSON.stringify(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.frozenCase)).toBe(frozen);
  });

  it("handles an older multistep first encounter without replacing its frozen case", () => {
    let state = openedSecond();
    const oldFirst = structuredClone(state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!);
    oldFirst.id = TUTORIAL_ENCOUNTER_ID;
    state.encounters[TUTORIAL_ENCOUNTER_ID] = oldFirst;
    state.openChartEncounterId = TUTORIAL_ENCOUNTER_ID;
    state = answerCorrect(state, TUTORIAL_ENCOUNTER_ID);
    expect(view(state)?.title).toBe("Make it happen");
    const nodeId = oldFirst.frozenCase.decisionNodes[0]!.id;
    state = reduce(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: TUTORIAL_ENCOUNTER_ID, decisionNodeId: nodeId });
    expect(view(state)?.id).toBe("off-site-result");
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase).toEqual(oldFirst.frozenCase);
    expect(view(restored)?.id).toBe("off-site-result");
  });

  it("ignores retired lesson receipts and never creates the operations pause", () => {
    let state = openedSecond();
    state = answerCorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
    const nodeId = state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.steps[0]!.decisionNodeId;
    state = reduce(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID, decisionNodeId: nodeId });
    state = reduce(state, { type: "SET_PAUSED", paused: true });
    expect(view(state, { dailyRoutineTipsStarted: true, acknowledged: ["sendout-management", "sendout-trash"] })?.body).toContain("Resume");
    expect(view(state)?.targetSelector).toBe(".pause-button");
  });

  it("advances real room selection; invalid placement does not finish construction", () => {
    let state = filedVisits();
    state.cash = 500; state.cashCents = 50000;
    expect(view(state)?.id).toBe("enter-build-mode");
    expect(view(state, {buildMode: true})?.id).toBe("select-exam-room");
    expect(view(state, {buildMode: true, selectedRoomDefinitionId: "room.examination"})?.id).toBe("place-exam-room");
    state = reduce(state, { type: "PLACE_ROOM", roomId: "exam.test", roomDefinitionId: "room.examination", x: -1, y: -1, orientation: 0 });
    expect(view(state, {buildMode: true, selectedRoomDefinitionId: "room.examination"})?.id).toBe("place-exam-room");
    state = reduce(state, { type: "PLACE_ROOM", roomId: "exam.test", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0 });
    expect(view(state, {buildMode: true})?.id).toBe("place-exam-room-door");
    expect(view(state)?.body).toContain("existing room");
    state = reduce(state, { type: "PLACE_DOOR", doorId: "exam.door", roomId: "exam.test", side: "south", offset: 1 });
    expect(view(state, {buildMode: true})?.id).toBe("exit-build-mode");
    expect(view(state)?.id).toBe("advance-level");
    state = reduce(state, {type: "LEVEL_UP"});
    expect(state.facilityLevel).toBe(1);
    expect(view(state)).toBeNull();
    expect(view({...state, paused: true})).toBeNull();
  });

  it("offers only live priced paid-consult recovery when exam cash is short", () => {
    const state = filedVisits();
    state.cash = 0; state.cashCents = 0;
    expect(view(state)?.target).toBe("waiting-actions");
    expect(view(state)?.body).toContain("pays $");
    state.emergencyGlp1.lastUsedAtFacilityTick = state.facilityTick;
    expect(view(state)?.body).not.toContain("available emergency consult");
  });

  it.each([1,2,3] as const)("ends advanced legacy guidance at level %s even without protected records", (facilityLevel) => {
    const state = createTutorialState(); state.facilityLevel = facilityLevel;
    delete state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
    expect(view(state)).toBeNull();
  });
});

function openedFirst(): GameState {
  let state = advanceUntil(createTutorialState(), (s) => s.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus === "checked_in");
  return reduce(state, { type: "OPEN_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
}
function openedSecond(): GameState {
  let state = answerCorrect(openedFirst(), TUTORIAL_ENCOUNTER_ID);
  state = reduce(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: TUTORIAL_ENCOUNTER_ID });
  state = reduce(state, { type: "CLOSE_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
  state = advanceUntil(state, (s) => s.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]?.checkInStatus === "checked_in");
  return reduce(state, { type: "OPEN_CHART", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID });
}
function filedVisits(): GameState {
  let state = answerCorrect(openedSecond(), SECOND_TUTORIAL_ENCOUNTER_ID);
  state = reduce(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    decisionNodeId: state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.steps[0]!.decisionNodeId });
  state = advanceUntil(state, (s) => getCurrentQuestion(s, SECOND_TUTORIAL_ENCOUNTER_ID) !== null);
  state = answerCorrect(state, SECOND_TUTORIAL_ENCOUNTER_ID);
  state = reduce(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID });
  return reduce(state, { type: "CLOSE_CHART", encounterId: SECOND_TUTORIAL_ENCOUNTER_ID });
}
