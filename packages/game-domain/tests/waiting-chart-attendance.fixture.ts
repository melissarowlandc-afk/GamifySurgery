import {
  createInitialGameState, gameReducer, getRoomDefinition, getRoomNavigationAnchor,
  type GameState,
} from "../src";

export const WAITING_CHART_PATIENT = "encounter.waiting-chart";

export function waitingChartFixture(): GameState {
  let state = createInitialGameState(undefined, {
    campaignId: "campaign.waiting-chart", campaignSeed: "waiting-chart", createdAtRealMs: 0,
  });
  const sample = structuredClone(Object.values(state.encounters)[0]!);
  state.encounters = {};
  state.facilityLevel = 1;
  state.paused = false;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "waiting", roomDefinitionId: "room.waiting", x: 29, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "exam", roomDefinitionId: "room.examination", x: 29, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push(
    { id: "waiting.east", roomId: "waiting", side: "east", offset: 2, exterior: false },
    { id: "exam.south", roomId: "exam", side: "south", offset: 2, exterior: false },
  );
  const front = state.rooms[0]!;
  const frontDefinition = getRoomDefinition(front.roomDefinitionId)!;
  state.environment.founderLocation = getRoomNavigationAnchor(front, frontDefinition, "staff");
  state.environment.founderActivity = null;
  state.encounters[WAITING_CHART_PATIENT] = {
    ...sample, id: WAITING_CHART_PATIENT, arrivalClass: "routine", protectedGuaranteeId: null,
    lifecycle: "waiting_unopened", checkInStatus: "awaiting_staff",
    patientLocation: getRoomNavigationAnchor(front, frontDefinition, "primary"), patientMovement: null,
    waitingDestination: null, assignedRoomInstanceId: front.id, queuedCareRoomInstanceId: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
  };
  // Complete real desk check-in and the allocated waiting walk before opening.
  for (let minute = 0; minute < 20; minute++) {
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `waiting-chart.check-in.${minute}` });
    const patient = state.encounters[WAITING_CHART_PATIENT]!;
    if (patient.checkInStatus === "checked_in" && patient.patientMovement === null) break;
  }
  return state;
}
