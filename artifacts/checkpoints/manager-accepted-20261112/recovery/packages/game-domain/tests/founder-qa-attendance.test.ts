import { describe, expect, it } from "vitest";
import { deserializeGameState, getCurrentQuestion, getRoomCareAnchor, getRoomDefinition, serializeGameState } from "../src";
import { qaAttendanceCommand as command, qaAttendanceFixture, qaAttendanceTick as tick } from "./founder-qa-attendance.fixture";

describe("retained M10 launch-unmet chart attendance", () => {
  it.each(["offsite", "returning", "result_ready"] as const)("attends Sophia's later decision after opening while %s, without another click", stage => {
    let { state, id } = qaAttendanceFixture(stage);
    const originalLocation = structuredClone(state.encounters[id]!.patientLocation);
    const originalMovement = structuredClone(state.encounters[id]!.patientMovement);
    state = command(state, { type: "OPEN_CHART", encounterId: id });
    if (stage !== "result_ready") {
      expect(state.encounters[id]!.patientLocation).toEqual(originalLocation);
      expect(state.encounters[id]!.patientMovement).toEqual(originalMovement);
    }
    state = deserializeGameState(serializeGameState(state));
    state = tick(state, 180);
    const patient = state.encounters[id]!;
    const room = state.rooms.find(room => room.id === patient.assignedRoomInstanceId)!;
    expect(patient.currentNodeIndex).toBe(1);
    expect(room?.roomDefinitionId).toBe("room.examination");
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    expect(patient.patientLocation).toEqual(getRoomCareAnchor(room, definition, "patient"));
    expect(patient.patientMovement).toBeNull(); expect(patient.waitingDestination).toBeNull();
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
    expect(state.environment.founderLocation).toEqual(getRoomCareAnchor(room, definition, "clinician"));
    expect(state.openChartEncounterId).toBe(id);
    const positions = [patient.patientLocation, state.environment.founderLocation];
    state = tick(state, 60);
    expect([state.encounters[id]!.patientLocation, state.environment.founderLocation]).toEqual(positions);
    state = command(state, { type: "CLOSE_CHART", encounterId: id });
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
  });

  it("keeps attendance through the answer, feedback and acknowledged summary until close", () => {
    let { state, id } = qaAttendanceFixture("result_ready");
    state = command(state, { type: "OPEN_CHART", encounterId: id }); state = tick(state, 60);
    const positions = [state.encounters[id]!.patientLocation, state.environment.founderLocation];
    const question = getCurrentQuestion(state, id)!;
    state = command(state, { type: "SUBMIT_ANSWER", encounterId: id, decisionNodeId: question.node.id,
      answerChoiceId: question.node.answerChoices.find(c => c.isCorrect)!.id, reviewedAtMs: state.createdAtRealMs + state.facilityTick * 60_000 });
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
    state = command(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: id });
    state = deserializeGameState(serializeGameState(state)); state = tick(state, 90);
    expect([state.encounters[id]!.patientLocation, state.environment.founderLocation]).toEqual(positions);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
    state = command(state, { type: "CLOSE_CHART", encounterId: id });
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
    expect(state.encounters[id]!.patientMovement?.kind).toBe("leaving_after_resolution");
  });
});
