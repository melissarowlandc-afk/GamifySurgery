import { describe, expect, it } from "vitest";
import { gameReducer } from "@gamify-surgery/game-domain";
import { waitingChartFixture, WAITING_CHART_PATIENT } from "../../../../packages/game-domain/tests/waiting-chart-attendance.fixture";
import { createPrototypePlayerView } from "./viewModels";

describe("founder consult standing and exam-chair presentation", () => {
  it.each([false, true])("projects an arrived chart founder correctly with exam=%s", exam => {
    let state = waitingChartFixture();
    if (!exam) { state.rooms = state.rooms.filter(room => room.id !== "exam"); state.doors = state.doors.filter(door => door.roomId !== "exam"); }
    state = gameReducer(state, { type: "OPEN_CHART", encounterId: WAITING_CHART_PATIENT, operationId: "consult-view.open" });
    for (let i = 0; i < 40; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `consult-view.tick.${i}` });
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.founder.seated).toBe(exam);
    if (!exam) expect(view.facility.founder.supportRole).toBeUndefined();
    state = gameReducer(state, { type: "CLOSE_CHART", encounterId: WAITING_CHART_PATIENT, operationId: "consult-view.close" });
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
  });
});
