import { gameReducer, selectStaffStillId, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { placeLevelFiveRoomsQaRooms } from "./level-five-rooms";

export const LEVEL_FIVE_EXECUTIVE_QA_PREFIX = "campaign.qa.level-five-executive-m4";
function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`Executive QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** Real construction, hire, pay and later work. No daily completion/savings seeded. */
export function prepareLevelFiveExecutiveQaState(state: GameState, context: DomainContext, scenario: "executive" | "executive-look2" | "executive-hire" | "executive-visits"): GameState {
  state = placeLevelFiveRoomsQaRooms(state, context);
  state = apply(state, { type: "PLACE_ROOM", operationId: "m4.training.room", roomId: "room.qa.level5.training", roomDefinitionId: "room.training", x: 29, y: 23, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_DOOR", operationId: "m4.training.door", doorId: "door.qa.level5.training", roomId: "room.qa.level5.training", side: "south", offset: 1 }, context);
  if (scenario !== "executive-hire") {
    const desired = scenario === "executive-look2" ? "future-roster20-v5.004" : "future-roster20-v5.003";
    const employeeId = Array.from({ length: 100 }, (_, i) => `employee.qa.level5.executive.${i}`).find(id => selectStaffStillId(state.campaignSeed, id, "staff.executive") === desired);
    if (!employeeId) throw new Error("The approved Executive look was not found in the hire pool.");
    state = apply(state, { type: "HIRE_STAFF", operationId: "m4.executive.hire", employeeId, staffRoleDefinitionId: "staff.executive",
      displayName: scenario === "executive-look2" ? "Jordan Lane" : "Morgan Blake" }, context);
  }
  if (scenario === "executive-visits") {
    state = apply(state, { type: "HIRE_STAFF", operationId: "m4.app.hire", employeeId: "employee.qa.level5.app", staffRoleDefinitionId: "staff.app", displayName: "Taylor Reed" }, context);
    state = apply(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", operationId: "m4.appointments.on", enabled: true }, context);
  }
  return state;
}
