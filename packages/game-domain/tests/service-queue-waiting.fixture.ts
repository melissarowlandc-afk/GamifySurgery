import { createInitialGameState, getRoomDefinition, getRoomNavigationAnchor,
  type GameState, type ServiceOperationState } from "../src";

/** Unstaffed synthetic phases isolate movement/room contention from clinical work. */
export function serviceQueueFixture(roomDefinitionId = "room.ultrasound", actorKind: "visitor" | "encounter" = "visitor") {
  const state = createInitialGameState(undefined, { campaignId: "campaign.service-waiting", campaignSeed: "service-waiting", createdAtRealMs: 0 });
  const sample = Object.values(state.encounters)[0]!;
  state.encounters = {};
  state.facilityLevel = 5;
  state.paused = false;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.rooms.push(
    { id: "service", roomDefinitionId, x: 33, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "waiting", roomDefinitionId: "room.waiting", x: 28, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 8 }, (_, index) => ({ id: `hall.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 21 + index,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "service.west", roomId: "service", side: "west", offset: 1, exterior: false },
    { id: "waiting.east", roomId: "waiting", side: "east", offset: 1, exterior: false },
    { id: "desk.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  const front = state.rooms[0]!;
  const checkIn = getRoomNavigationAnchor(front, getRoomDefinition(front.roomDefinitionId)!, "primary");
  const operation: ServiceOperationState = {
    id: "queued", incomeLineId: "income.ultrasound", catalogVersion: 1, actorKind, actorId: "waiting.actor",
    displayName: "Waiting visitor", appearance: state.founder.appearance, status: "waiting_for_resources",
    createdAtFacilityTick: 0, waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER,
    startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
    quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
    reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
    location: { ...checkIn }, path: [{ ...checkIn }], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
    frozenOperationPhases: [{ id: "synthetic.capacity", roomDefinitionId, durationMinutes: 5, staffRoleDefinitionIds: [] }],
    resourceQueueVersion: 1,
  };
  if (actorKind === "encounter") state.encounters[operation.actorId] = {
    ...structuredClone(sample), id: operation.actorId, checkInStatus: "checked_in", lifecycle: "resolved",
    resolvedAtFacilityTick: 0, resolutionReason: "completed", patientLocation: { ...checkIn }, patientMovement: null,
    assignedRoomInstanceId: front.id, waitingDestination: null, queuedCareRoomInstanceId: null,
  };
  const blocker: ServiceOperationState = { ...structuredClone(operation), id: "busy", actorKind: "remote", actorId: "busy.actor",
    status: "in_service", startedAtFacilityTick: 0, phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 100_000,
    reservedRoomInstanceIds: ["service"], location: null, path: [] };
  state.serviceOperations = [blocker, operation];
  return { state, operation, blocker, checkIn };
}

export function releaseBusyRoom(state: GameState): void {
  const blocker = state.serviceOperations.find((operation) => operation.id === "busy")!;
  blocker.status = "completed";
  blocker.completedAtFacilityTick = state.facilityTick;
  blocker.reservedRoomInstanceIds = [];
}
