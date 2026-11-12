import retainedCheckpoint from "../../../tests/fixtures/founder-qa-attendance-20261110.json";
import { deserializeGameState, gameReducer, type GameCommand, type GameState } from "../src";

type Command = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
export function qaAttendanceCommand(state: GameState, command: Command): GameState {
  let sequence = 0;
  let operationId = `qa-attendance.${state.facilityTick}.${command.type}.${sequence}`;
  while (state.operationReceipts[operationId]) operationId = `qa-attendance.${state.facilityTick}.${command.type}.${++sequence}`;
  const next = gameReducer(state, { ...command, operationId } as GameCommand);
  if (next.operationReceipts[operationId]?.status !== "applied") throw new Error(next.operationReceipts[operationId]?.message);
  return next;
}
export function qaAttendanceTick(state: GameState, minutes = 1): GameState {
  for (let i = 0; i < minutes; i++) state = qaAttendanceCommand(state, { type: "ADVANCE_TICK" });
  return state;
}
export function qaAttendanceUntil(state: GameState, predicate: (state: GameState) => boolean, limit = 300): GameState {
  for (let i = 0; i < limit && !predicate(state); i++) state = qaAttendanceTick(state);
  if (!predicate(state)) throw new Error(`QA attendance condition not reached by tick ${state.facilityTick}`);
  return state;
}
/** The exact retained checkpoint and ordinary M10 context, without a QA balance override. */
export function qaAttendanceFixture(stage: "offsite" | "returning" | "result_ready" = "offsite") {
  // Preserve the original public Sophia regression across later Level 5 rebinds.
  let state = deserializeGameState(JSON.stringify(retainedCheckpoint));
  state.campaignId = "campaign.qa.level-five-launch-m10.launch-unmet";
  state.clinicalXp = 749;
  const id = Object.values(state.encounters).find(e => e.patientDisplayName === "Sophia Young")!.id;
  if (state.openChartEncounterId) state = qaAttendanceCommand(state, { type: "CLOSE_CHART", encounterId: state.openChartEncounterId });
  state = qaAttendanceCommand(state, { type: "SET_PAUSED", paused: false });
  state = qaAttendanceCommand(state, { type: "SET_SIMULATION_SPEED", speed: 4 });
  if (stage === "returning") state = qaAttendanceUntil(state, s => s.encounters[id]?.patientMovement?.kind === "returning_from_offsite_testing");
  if (stage === "result_ready") state = qaAttendanceUntil(state, s => s.encounters[id]?.lifecycle === "active_action_required");
  return { state, id };
}
