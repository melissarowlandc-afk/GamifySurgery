import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, SECOND_TUTORIAL_ENCOUNTER_ID, TUTORIAL_ENCOUNTER_ID,
  createInitialGameState, deserializeGameState, gameReducer, getCurrentQuestion,
  getRoomDefinition, getRoomNavigableTiles, getRoomNavigationAnchor, serializeGameState,
  type GameCommand, type GameState,
} from "../src";

type CommandInput = {[K in GameCommand["type"]]: Omit<Extract<GameCommand, {type: K}>, "operationId">}[GameCommand["type"]];
let sequence = 0;
const reduce = (state: GameState, command: CommandInput) => gameReducer(state, {...command, operationId: `tutorial-recovery.${sequence++}`} as GameCommand);
const tick = (state: GameState) => reduce(state, {type: "ADVANCE_TICK"});
function until(state: GameState, predicate: (next: GameState) => boolean): GameState {
  for (let index = 0; !predicate(state) && index < 80; index += 1) state = tick(state);
  expect(predicate(state)).toBe(true);
  return state;
}
function arrival(encounterId: string): GameState {
  let state = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId: "campaign.tutorial-recovery", campaignSeed: "tutorial-recovery", createdAtRealMs: 0,
  });
  if (encounterId === SECOND_TUTORIAL_ENCOUNTER_ID) {
    state = until(state, (s) => s.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus === "checked_in");
    state = reduce(state, {type: "OPEN_CHART", encounterId: TUTORIAL_ENCOUNTER_ID});
    const question = getCurrentQuestion(state, TUTORIAL_ENCOUNTER_ID)!;
    state = reduce(state, {type: "SUBMIT_ANSWER", encounterId: TUTORIAL_ENCOUNTER_ID,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((c) => c.isCorrect)!.id, reviewedAtMs: 1000});
    state = reduce(state, {type: "CLOSE_CHART", encounterId: TUTORIAL_ENCOUNTER_ID});
    state = until(state, (s) => s.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] !== undefined);
  }
  return state;
}
function moveAway(state: GameState): {state: GameState; desk: {x: number; y: number}} {
  const room = state.rooms.find((r) => r.roomDefinitionId === "room.front_desk")!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const desk = getRoomNavigationAnchor(room, definition, "staff");
  const destination = getRoomNavigableTiles(room, definition, state.doors)
    .filter((point) => point.x !== desk.x || point.y !== desk.y)
    .sort((a, b) => Math.abs(b.x - desk.x) + Math.abs(b.y - desk.y) - Math.abs(a.x - desk.x) - Math.abs(a.y - desk.y))[0]!;
  const next = reduce(state, {type: "MOVE_FOUNDER", destination});
  expect(Object.values(next.operationReceipts).at(-1)?.status).toBe("applied");
  return {state: next, desk};
}

describe("protected first-shift check-in recovery", () => {
  it.each([TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID])("returns a moved founder for %s, including a save during the return", (encounterId) => {
    const away = moveAway(arrival(encounterId));
    let state = away.state;
    const frozen = structuredClone(state.encounters[encounterId]!.frozenCase);
    const reviews = structuredClone(state.reviewIntents);
    const settlements = structuredClone(state.settlements);
    state = until(state, (s) => s.encounters[encounterId]!.checkInStatus === "awaiting_staff" &&
      s.environment.founderActivity?.kind === "return_to_front_desk");
    const waitingSince = state.encounters[encounterId]!.checkInWaitingSinceTick!;
    expect(state.environment.founderActivity!.path.at(-1)).toEqual(away.desk);
    expect(state.environment.founderLocation).not.toEqual(away.desk);
    state = reduce(state, {type: "SET_PAUSED", paused: true});
    const saved = deserializeGameState(serializeGameState(state));
    expect(saved.environment.founderActivity).toEqual(state.environment.founderActivity);
    expect(saved.encounters[encounterId]!.frozenCase).toEqual(frozen);
    expect(tick(saved).facilityTick).toBe(saved.facilityTick);
    state = until(reduce(saved, {type: "SET_PAUSED", paused: false}), (s) => s.encounters[encounterId]!.checkInStatus === "checked_in");
    expect(state.facilityTick - waitingSince).toBeLessThanOrEqual(10);
    expect(state.environment.founderLocation).toEqual(away.desk);
    expect(state.environment.founderActivity).toBeNull();
    expect(state.encounters[encounterId]!.unstaffedCheckInOverdueApplied).toBe(false);
    expect(state.reviewIntents).toEqual(reviews);
    expect(state.settlements).toEqual(settlements);
    state = reduce(state, {type: "OPEN_CHART", encounterId});
    expect(state.openChartEncounterId).toBe(encounterId);
    expect(state.encounters[encounterId]!.frozenCase).toEqual(frozen);
  });

  it("lets a protected arrival supersede optional explicit seating", () => {
    const away = moveAway(arrival(TUTORIAL_ENCOUNTER_ID));
    let state = until(away.state, (s) => s.environment.founderActivity === null);
    const location = {...state.environment.founderLocation};
    state.environment.founderActivity = {kind: "sit_in_chair", explicitSeat: true,
      targetId: "seat.optional", path: [location], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER};
    state = until(state, (s) => s.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus === "checked_in");
    expect(state.environment.founderLocation).toEqual(away.desk);
    expect(state.environment.founderActivity).toBeNull();
  });

  it.each(["ordinary", "advanced"])("preserves ordinary founder movement for %s arrivals", (kind) => {
    const initial = arrival(TUTORIAL_ENCOUNTER_ID);
    if (kind === "ordinary") {
      const patient = initial.encounters[TUTORIAL_ENCOUNTER_ID]!;
      patient.id = "encounter.ordinary-check-in";
      initial.encounters = {[patient.id]: patient};
    } else initial.facilityLevel = 1;
    const away = moveAway(initial);
    const encounterId = kind === "ordinary" ? "encounter.ordinary-check-in" : TUTORIAL_ENCOUNTER_ID;
    let state = until(away.state, (s) => s.encounters[encounterId]!.checkInStatus === "awaiting_staff");
    for (let index = 0; index < 4; index += 1) state = tick(state);
    expect(state.environment.founderLocation).not.toEqual(away.desk);
    expect(state.environment.founderActivity?.kind).not.toBe("return_to_front_desk");
    expect(state.encounters[encounterId]!.checkInStatus).toBe("awaiting_staff");
  });
});
