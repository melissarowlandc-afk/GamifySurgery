import { describe, expect, it } from "vitest";
import { gameReducer, getRoomCareAnchor, getRoomDefinition } from "@gamify-surgery/game-domain";
import { WAITING_CHART_PATIENT, waitingChartFixture } from "../../../../packages/game-domain/tests/waiting-chart-attendance.fixture";
import { createPrototypePlayerView } from "../session/viewModels";

describe("waiting chart attendance presentation", () => {
  it("releases the waiting pose and projects both actors walking to and arriving in the exam room", () => {
    let state = waitingChartFixture();
    const view = () => createPrototypePlayerView(state, null, false, null).facility;
    expect(view().patients!.find((patient) => patient.instanceId === WAITING_CHART_PATIENT)).toMatchObject({
      seated: true, moving: false, supportRole: "waiting-seat",
    });
    state = gameReducer(state, { type: "OPEN_CHART", operationId: "waiting-chart.presentation.open", encounterId: WAITING_CHART_PATIENT });
    const walking = view();
    expect(walking.patients!.find((patient) => patient.instanceId === WAITING_CHART_PATIENT)).toMatchObject({ moving: true, seated: false });
    expect(walking.patients!.find((patient) => patient.instanceId === WAITING_CHART_PATIENT)!.supportRole).toBeUndefined();
    expect(walking.founder).toMatchObject({ moving: true, seated: false });
    for (let minute = 0; minute < 20; minute++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `waiting-chart.presentation.${minute}` });
    const arrived = view(), room = state.rooms.find((candidate) => candidate.id === "exam")!;
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    expect(arrived.patients!.find((patient) => patient.instanceId === WAITING_CHART_PATIENT)).toMatchObject({
      location: getRoomCareAnchor(room, definition, "patient"), moving: false, seated: false, pose: "exam-table",
    });
    expect(arrived.founder).toMatchObject({ location: getRoomCareAnchor(room, definition, "clinician"), moving: false });
  });
});
