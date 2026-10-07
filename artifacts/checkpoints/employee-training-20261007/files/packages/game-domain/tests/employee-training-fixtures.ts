import { createInitialGameState, getRoomDefinition, getRoomNavigationAnchor, advanceEmployeeTraining,
  advanceEmployeeMovement, PROTOTYPE_DOMAIN_CONTEXT, type EmployeeState, type GameState, type DomainContext } from "../src";

export function trainingFixture(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.employee-training", campaignSeed: "employee-training", createdAtRealMs: 0 });
  state.facilityLevel = 3;
  state.paused = false;
  state.cash = 25_000;
  state.cashCents = 2_500_000;
  state.encounters = {};
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.waterCoolerFillPercent = 100;
  state.rooms.push(
    { id: "room.test.training", roomDefinitionId: "room.training", x: 29, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[25, 26, 27, 28].map((y) => ({ id: `room.test.training-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.training-front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.test.training", roomId: "room.test.training", side: "east", offset: 1, exterior: false },
  );
  return state;
}

export function addTrainingEmployee(state: GameState, id: string, role = "staff.receptionist", homeId = "room.instance.founder_desk"): EmployeeState {
  const room = state.rooms.find((candidate) => candidate.id === homeId)!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const location = getRoomNavigationAnchor(room, definition, "staff");
  const employee: EmployeeState = {
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 20, morale: 100, trainingLevel: 1,
    homeRoomInstanceId: homeId, location, path: [{ ...location }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  };
  state.employees.push(employee);
  return employee;
}

export function advanceTrainingMinutes(state: GameState, minutes = 1, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): void {
  for (let minute = 0; minute < minutes; minute += 1) {
    state.facilityTick += 1;
    advanceEmployeeTraining(state, context);
    advanceEmployeeMovement(state, context);
  }
}

export function reachTrainingStage(state: GameState, employeeId: string, stage: NonNullable<EmployeeState["training"]>["stage"]): void {
  for (let minute = 0; minute < 120; minute += 1) {
    if (state.employees.find((employee) => employee.id === employeeId)?.training?.stage === stage) return;
    advanceTrainingMinutes(state);
  }
  throw new Error(`Training did not reach ${stage}.`);
}
