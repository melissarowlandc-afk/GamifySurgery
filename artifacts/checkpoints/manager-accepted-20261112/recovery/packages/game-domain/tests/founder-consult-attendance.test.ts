import { describe, expect, it } from "vitest";
import {
  createInitialGameState, deserializeGameState, gameReducer, getRoomCareAnchor,
  getRoomDefinition, serializeGameState, type GameCommand, type GameState,
} from "../src";
import { waitingChartFixture, WAITING_CHART_PATIENT } from "./waiting-chart-attendance.fixture";

type Command = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
function apply(state: GameState, command: Command) {
  const operationId = `consult-attendance.${state.facilityTick}.${Object.keys(state.operationReceipts).length}`;
  const next = gameReducer(state, { ...command, operationId } as GameCommand);
  expect(next.operationReceipts[operationId]?.status).toBe("applied"); return next;
}
function tick(state: GameState, count = 1) {
  for (let i = 0; i < count; i++) state = apply(state, { type: "ADVANCE_TICK" }); return state;
}
export function noExamAttendanceFixture() {
  let state = createInitialGameState(undefined, { campaignId: "consult-attendance", campaignSeed: "consult-attendance", createdAtRealMs: 0 });
  state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < 60 && Object.values(state.encounters)[0]!.checkInStatus !== "checked_in"; i++) state = tick(state);
  return state;
}

describe("founder chart attendance targets", () => {
  it("walks beside a checked-in patient without an exam room and stays until close", () => {
    let state = noExamAttendanceFixture(); const id = Object.keys(state.encounters)[0]!;
    const patient = { ...state.encounters[id]!.patientLocation! };
    state = apply(state, { type: "OPEN_CHART", encounterId: id });
    const target = state.environment.founderActivity!.path.at(-1)!;
    expect(Math.abs(target.x - patient.x) + Math.abs(target.y - patient.y)).toBe(1);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
    state = tick(state, 40);
    expect(state.environment.founderLocation).toEqual(target);
    expect(state.encounters[id]!.patientLocation).toEqual(patient);
    state = deserializeGameState(serializeGameState(state)); state = tick(state, 5);
    expect(state.environment.founderActivity?.targetId).toBe(id);
    state = apply(state, { type: "CLOSE_CHART", encounterId: id });
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
  });

  it("uses the exam bed and clinician chair, then releases attendance on close", () => {
    let state = waitingChartFixture(); const id = WAITING_CHART_PATIENT;
    state = apply(state, { type: "OPEN_CHART", encounterId: id }); state = tick(state, 40);
    const room = state.rooms.find(room => room.id === "exam")!, definition = getRoomDefinition(room.roomDefinitionId)!;
    expect(state.encounters[id]!.assignedRoomInstanceId).toBe(room.id);
    expect(state.encounters[id]!.patientLocation).toEqual(getRoomCareAnchor(room, definition, "patient"));
    expect(state.environment.founderLocation).toEqual(getRoomCareAnchor(room, definition, "clinician"));
    expect(state.environment.founderActivity?.kind).toBe("attend_encounter");
    state = apply(state, { type: "CLOSE_CHART", encounterId: id });
    expect(state.encounters[id]!.assignedRoomInstanceId).not.toBe(room.id);
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
  });

  it("keeps a busy-room patient in waiting and retries after the occupant leaves", () => {
    let state = waitingChartFixture(); const id = WAITING_CHART_PATIENT;
    const room = state.rooms.find(room => room.id === "exam")!, definition = getRoomDefinition(room.roomDefinitionId)!;
    state.encounters.other = { ...structuredClone(state.encounters[id]!), id: "other", assignedRoomInstanceId: room.id,
      patientMovement: null, waitingDestination: null, patientLocation: getRoomCareAnchor(room, definition, "patient") };
    state = apply(state, { type: "OPEN_CHART", encounterId: id });
    expect(state.encounters[id]!.waitingDestination?.roomInstanceId).toBe("waiting");
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
    state.encounters.other!.lifecycle = "resolved"; state.encounters.other!.patientLocation = { x: -2, y: -2 };
    state.encounters.other!.assignedRoomInstanceId = null;
    state = tick(state, 40);
    expect(state.encounters[id]!.assignedRoomInstanceId).toBe(room.id);
    expect(state.environment.founderActivity?.targetId).toBe(id);
  });
});
