import {
  PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID, createInitialGameState,
  gameReducer, getRoomDefinition, getRoomNavigationAnchor, getStaffRoleDefinition,
  type EmployeeState, type GameState,
} from "@gamify-surgery/game-domain";
import { createWoundOstomyAppointmentsQaState } from "./wound-ostomy-appointments";

export const LEVEL_THREE_READY_QA_CAMPAIGN_ID = "campaign.qa.level-three-ready-m8";
export const LEVEL_FOUR_ALMOST_QA_CAMPAIGN_ID = "campaign.qa.level-four-almost-m8";

/** Synthetic mature legacy shape, including durable first-operation credit. */
export function createLevelThreeReadyQaState(): GameState {
  const state = createInitialGameState();
  state.campaignId = LEVEL_THREE_READY_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-three-ready-m8";
  state.facilityLevel = 3;
  state.facilityTick = 1200;
  state.nextFinancialPostingTick = 1215;
  state.cash = 30000; state.cashCents = 3000000;
  state.paused = true;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.clinicalXp = 500;
  state.environment.litterItems = [];
  const ended = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  ended.lifecycle = "resolved";
  ended.resolutionReason = "completed";
  ended.resolvedAtFacilityTick = 1;
  ended.finalPatientSatisfaction = 100;
  state.encounters = { [ended.id]: ended };
  const rooms = [
    { id: "pharmacy", definitionId: "room.pharmacy", x: 29, y: 24 },
    { id: "waiting", definitionId: "room.waiting", x: 28, y: 19 },
    { id: "bathroom", definitionId: "room.bathroom", x: 30, y: 16 },
    { id: "exam", definitionId: "room.examination", x: 29, y: 12 },
    { id: "xray", definitionId: "room.xray", x: 33, y: 20 },
    { id: "control", definitionId: "room.imaging_control", x: 36, y: 20 },
  ];
  state.rooms.push(
    ...rooms.map((room) => ({ id: `room.goal.${room.id}`, roomDefinitionId: room.definitionId, x: room.x, y: room.y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    ...Array.from({ length: 16 }, (_, index) => ({ id: `room.goal.hall.${13 + index}`, roomDefinitionId: "room.hallway", x: 32, y: 13 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.goal.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    ...rooms.map((room) => ({ id: `door.goal.${room.id}`, roomId: `room.goal.${room.id}`, side: room.id === "xray" || room.id === "control" ? "west" as const : "east" as const, offset: room.id === "bathroom" ? 0 : 1, exterior: false })),
    { id: "door.goal.xray-control", roomId: "room.goal.xray", side: "east", offset: 1, exterior: false },
  );
  const staff = (roleId: string, homeRoomInstanceId: string): EmployeeState => {
    const role = getStaffRoleDefinition(roleId)!;
    const home = state.rooms.find((room) => room.id === homeRoomInstanceId)!;
    const location = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    return {
      id: `employee.goal.${roleId}`, staffRoleDefinitionId: roleId, displayName: role.displayName,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: role.salaryPerExpenseInterval, morale: 100, trainingLevel: 1,
      homeRoomInstanceId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 1, facilityTask: null,
    };
  };
  state.employees = [staff("staff.pharmacist", "room.goal.pharmacy"), staff("staff.imaging_technician", "room.goal.control")];
  state.serviceIncomeReceipts.push({
    id: "receipt.goal.first-operation", transactionKey: "receipt.goal.first-operation",
    incomeLineId: "income.ambulatory_operation", catalogVersion: 1, routeId: null,
    actorKind: "visitor", actorId: "visitor.goal.first-operation", grossAmount: 900,
    stockCost: 0, netCashDelta: 900, completedAtFacilityTick: 220,
  });
  const second = createInitialGameState().encounters[TUTORIAL_ENCOUNTER_ID]!;
  second.id = SECOND_TUTORIAL_ENCOUNTER_ID;
  second.lifecycle = "resolved"; second.resolutionReason = "completed";
  second.resolvedAtFacilityTick = 2; second.finalPatientSatisfaction = 100;
  state.encounters[second.id] = second;
  return state;
}

/** One historical pediatric witness; completing the actual wound visit finishes L4. */
export function createLevelFourAlmostQaState(context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  let state = createWoundOstomyAppointmentsQaState(context);
  const apply = (command: import("@gamify-surgery/game-domain").GameCommand) => {
    state = gameReducer(state, command, context);
    if (state.operationReceipts[command.operationId]?.status !== "applied") throw new Error(state.operationReceipts[command.operationId]?.message);
  };
  for (const x of [42, 43]) apply({ type: "PLACE_ROOM", operationId: `almost.hall.${x}`, roomId: `room.almost.hall.${x}`,
    roomDefinitionId: "room.hallway", x, y: 26, orientation: 0 });
  for (const [id, definition, x, y, offset] of [
    ["exam", "room.examination", 23, 24, 2], ["waiting", "room.waiting", 38, 23, 2], ["bathroom", "room.bathroom", 42, 24, 0],
  ] as const) {
    apply({ type: "PLACE_ROOM", operationId: `almost.place.${id}`, roomId: `room.almost.${id}`, roomDefinitionId: definition, x, y, orientation: 0 });
    apply({ type: "PLACE_DOOR", operationId: `almost.door.${id}`, doorId: `door.almost.${id}`, roomId: `room.almost.${id}`, side: "south", offset });
  }
  apply({ type: "HIRE_STAFF", operationId: "almost.reception", employeeId: "employee.almost.reception", staffRoleDefinitionId: "staff.receptionist" });
  state.campaignId = LEVEL_FOUR_ALMOST_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-four-almost-m8";
  state.clinicalXp = 750;
  state.levelFourCompletion = {
    version: "level-four-completion.v1", acknowledgedAtFacilityTick: null,
    pediatricVisitWithParent: { serviceOperationId: "retired.qa.pediatric", encounterId: null,
      parentActorId: "retired.qa.parent", incomeLineId: "income.pediatric_consult", completedAtFacilityTick: 0 },
    woundOstomyCareVisit: null,
  };
  // Keep this focused completion fixture free of unrelated amenity deterioration.
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  return state;
}
