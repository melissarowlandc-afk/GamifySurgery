import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "../src";
import type { DiagnosticOrderPlan, DomainContext, EmployeeState, GameState, PendingResult, PlacedRoom, ServiceOperationState } from "../src";

export function timingFixture() {
  const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
  context.balanceRelease.facility.gridWidth = 80;
  context.balanceRelease.facility.gridHeight = 80;
  // Small open rooms make travel/queue assertions independent of artwork masks.
  for (const definition of context.balanceRelease.facility.roomDefinitions) {
    const hallway = definition.id === "room.hallway";
    const size = hallway ? 1 : 4;
    definition.width = size;
    definition.height = size;
    definition.requiredRoomDefinitionIds = [];
    definition.navigation = {
      blockedTiles: [], primaryAnchor: { x: hallway ? 0 : 1, y: hallway ? 0 : 1 },
      staffAnchor: { x: hallway ? 0 : 1, y: hallway ? 0 : 1 }, waitingAnchors: [],
      patientCareAnchor: { x: 1, y: 1 }, clinicianCareAnchor: { x: 1, y: 1 },
      ...(definition.id === "room.periop_recovery" ? { careStations: [
        { id: "N3", kind: "periop_bed" as const, patientAnchor: { x: 1, y: 1 }, facing: "north" as const },
        { id: "N4", kind: "periop_bed" as const, patientAnchor: { x: 2, y: 1 }, facing: "north" as const },
      ] } : {}),
    };
  }
  const state = createInitialGameState(context, { campaignId: "campaign.diagnostic-timing", campaignSeed: "diagnostic-timing", createdAtRealMs: 0 });
  state.facilityLevel = 3;
  state.facilityTick = 0;
  state.serviceOperations = [];
  state.employees = [];
  const founderRoom = state.rooms.find((room) => room.id === "room.instance.founder_desk")!;
  state.rooms = [{ ...founderRoom, x: 3, y: 76, orientation: 0, doorSide: null }];
  state.doors = [
    { id: "door.fixture.exterior", roomId: founderRoom.id, side: "south", offset: 1, exterior: true },
    { id: "door.fixture.interior", roomId: founderRoom.id, side: "east", offset: 1, exterior: false },
  ];
  for (let y = 4; y <= 77; y++) state.rooms.push({ id: `hall.${y}`, roomDefinitionId: "room.hallway", x: 7, y, orientation: 0, doorSide: null, upgradeLevel: 1 });
  state.environment.founderLocation = { x: 4, y: 77 };
  state.environment.founderActivity = null;
  const encounter = Object.values(state.encounters)[0]!;
  encounter.id = "encounter.fixture";
  encounter.patientLocation = { x: 9, y: 4 };
  encounter.assignedRoomInstanceId = "room.fixture.examination";
  encounter.patientMovement = null;
  encounter.pendingResult = null;
  state.encounters = { [encounter.id]: encounter };
  let roomIndex = 0;
  const addRoom = (definitionId: string, employeeRoleId?: string, employeeCount = 1) => {
    const roomId = `room.fixture.${definitionId.slice(5)}`;
    const y = 3 + roomIndex++ * 6;
    const room: PlacedRoom = { id: roomId, roomDefinitionId: definitionId, x: 8, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 };
    state.rooms.push(room);
    state.doors.push({ id: `door.${roomId}`, roomId, side: "west", offset: 1, exterior: false });
    if (employeeRoleId) for (let index = 0; index < employeeCount; index++) {
      const location = { x: room.x + 1, y: room.y + 1 };
      state.employees.push({ id: `${employeeRoleId}.${index + 1}`, staffRoleDefinitionId: employeeRoleId, displayName: employeeRoleId,
        appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 80,
        trainingLevel: 1, homeRoomInstanceId: roomId, location, path: [location], pathIndex: 0,
        lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 9999, facilityTask: null } satisfies EmployeeState);
    }
    return { room, anchor: { x: room.x + 1, y: room.y + 1 } };
  };
  addRoom("room.examination");
  return { state, context, encounter, addRoom };
}

export function pending(plan?: DiagnosticOrderPlan): PendingResult {
  return { operationId: "pending.fixture", gateId: "gate.fixture", originatingNodeIndex: 0, resultTypeId: "service.basic_labs", pendingLabel: "Laboratory work", resultNarrative: "Fixture result",
    routeId: "route.basic_labs.phlebotomy_sendout", routeDisplayName: "Collected laboratory work", scheduledAtTick: 0, serviceDurationTicks: 75, durationTicks: 75, dueTick: 75,
    deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, ...(plan ? { diagnosticTiming: plan } : {}) };
}

export function manualLab(state: GameState, status: "in_service" | "waiting_for_resources" = "in_service", id = "manual.lab"): ServiceOperationState {
  const room = state.rooms.find((entry) => entry.roomDefinitionId === "room.laboratory")!;
  const worker = state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.laboratory_technician")!;
  return { id, incomeLineId: "income.laboratory_processing", catalogVersion: 1, actorKind: "remote", actorId: id,
    displayName: "Existing manual Lab work", appearance: null, status, createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60,
    startedAtFacilityTick: status === "in_service" ? 0 : null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
    quoteFee: 80, phaseIndex: 0, phaseStartedAtFacilityTick: status === "in_service" ? 0 : null, phaseEndsAtFacilityTick: status === "in_service" ? 60 : null,
    reservedRoomInstanceIds: status === "in_service" ? [room.id] : [], reservedEmployeeIds: status === "in_service" ? [worker.id] : [], providerReservation: null,
    location: null, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null };
}
