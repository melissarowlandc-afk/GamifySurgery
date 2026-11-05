import { describe, expect, it } from "vitest";
import {
  deserializeGameState, gameReducer, getFacilityAccessValidation, getRoomCareAnchor, getRoomDefinition, serializeGameState,
  type GameState,
} from "../src";
import { releaseBusyRoom, serviceQueueFixture } from "./service-queue-waiting.fixture";
import { WAITING_CHART_PATIENT, waitingChartFixture } from "./waiting-chart-attendance.fixture";

let sequence = 0;
const tick = (state: GameState) => gameReducer(state, { type: "ADVANCE_TICK", operationId: `waiting-chart.tick.${sequence++}` });
const open = (state: GameState) => gameReducer(state, {
  type: "OPEN_CHART", operationId: `waiting-chart.open.${sequence++}`, encounterId: WAITING_CHART_PATIENT,
});

function assertExamArrival(state: GameState) {
  const room = state.rooms.find((candidate) => candidate.id === "exam")!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  expect(state.encounters[WAITING_CHART_PATIENT]).toMatchObject({
    patientMovement: { kind: "walking_to_care", destinationRoomInstanceId: room.id }, waitingDestination: null,
  });
  expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: WAITING_CHART_PATIENT });
  expect(state.environment.founderActivity!.path.at(-1)).toEqual(getRoomCareAnchor(room, definition, "clinician"));
  for (let minute = 0; minute < 20; minute++) state = tick(state);
  expect(state.encounters[WAITING_CHART_PATIENT]).toMatchObject({
    patientLocation: getRoomCareAnchor(room, definition, "patient"), assignedRoomInstanceId: room.id,
    patientMovement: null, waitingDestination: null,
  });
  expect(state.environment.founderLocation).toEqual(getRoomCareAnchor(room, definition, "clinician"));
  return state;
}

describe("opening a seated waiting patient's chart", () => {
  it.each([false, true])("sends both actors to the exam room after desk check-in (reload=%s)", (reload) => {
    let state = waitingChartFixture();
    expect(getFacilityAccessValidation(state).valid).toBe(true);
    expect(state.encounters[WAITING_CHART_PATIENT]).toMatchObject({
      checkInStatus: "checked_in", lifecycle: "waiting_unopened", patientMovement: null,
      assignedRoomInstanceId: "waiting", waitingDestination: { roomInstanceId: "waiting", kind: "chair" },
    });
    if (reload) state = deserializeGameState(serializeGameState(state));
    assertExamArrival(open(state));
  });

  it("redirects the founder from an explicitly chosen waiting chair and supports reopening", () => {
    let state = waitingChartFixture();
    state = gameReducer(state, {
      type: "SEAT_FOUNDER_IN_CHAIR", operationId: "waiting-chart.founder-seat", roomInstanceId: "waiting", location: { x: 29, y: 29 },
    });
    expect(state.environment.founderActivity?.kind).toBe("sit_in_chair");
    state = assertExamArrival(open(state));
    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "waiting-chart.close", encounterId: WAITING_CHART_PATIENT });
    for (let minute = 0; minute < 20; minute++) state = tick(state);
    expect(state.encounters[WAITING_CHART_PATIENT]!.waitingDestination?.roomInstanceId).toBe("waiting");
    assertExamArrival(open(state));
  });

  it("retries attendance without a second chart click when the occupied exam room clears", () => {
    let state = waitingChartFixture();
    const room = state.rooms.find((candidate) => candidate.id === "exam")!;
    state.encounters.outgoing = {
      ...structuredClone(state.encounters[WAITING_CHART_PATIENT]!), id: "outgoing", lifecycle: "resolved",
      resolutionReason: "completed", assignedRoomInstanceId: room.id, waitingDestination: null,
      patientLocation: getRoomCareAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "patient"),
    };
    state = open(state);
    expect(state.encounters[WAITING_CHART_PATIENT]!.patientMovement).toBeNull();
    expect(state.encounters[WAITING_CHART_PATIENT]!.waitingDestination?.roomInstanceId).toBe("waiting");
    delete state.encounters.outgoing;
    state = tick(state);
    assertExamArrival(state);
  });

  it.each(["visitor", "encounter"] as const)("keeps a busy service %s seated until its own room frees", (kind) => {
    const service = serviceQueueFixture("room.ultrasound", kind);
    let state = waitingChartFixture();
    state.rooms.push({ id: "service", roomDefinitionId: "room.ultrasound", x: 33, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "service.south", roomId: "service", side: "south", offset: 1, exterior: false });
    state.serviceOperations = service.state.serviceOperations;
    if (kind === "encounter") state.encounters[service.operation.actorId] = service.state.encounters[service.operation.actorId]!;
    for (let minute = 0; minute < 20; minute++) state = tick(state);
    const queued = state.serviceOperations.find((operation) => operation.id === "queued")!;
    expect(queued.status).toBe("waiting_for_resources");
    const location = kind === "visitor" ? queued.location : state.encounters[queued.actorId]!.patientLocation;
    expect(location).not.toBeNull();
    expect(location!.x).toBeGreaterThanOrEqual(29);
    expect(location!.x).toBeLessThan(33);
    expect(location!.y).toBeGreaterThanOrEqual(28);
    expect(location!.y).toBeLessThan(31);
    // Opening routine care must not displace another actor's service queue.
    state = assertExamArrival(open(state));
    const waitingLocation = kind === "visitor"
      ? state.serviceOperations.find((operation) => operation.id === "queued")!.location
      : state.encounters[service.operation.actorId]!.patientLocation;
    expect(waitingLocation).toEqual(location);
    expect(state.serviceOperations.find((operation) => operation.id === "queued")!.status).toBe("waiting_for_resources");
    releaseBusyRoom(state);
    for (let minute = 0; minute < 20 && state.serviceOperations.find((operation) => operation.id === "queued")!.status !== "in_service"; minute++) state = tick(state);
    expect(state.serviceOperations.find((operation) => operation.id === "queued")).toMatchObject({
      status: "in_service", reservedRoomInstanceIds: ["service"],
    });
  });
});
