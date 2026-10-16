import { gameReducer, getOperationalGlp1AutomationCapacity, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";

/** Opt-in disposable QA state only, loaded by the guarded 5184 bootstrap. */
export function withGlp1NpHiredQaState(original: GameState, context: DomainContext): GameState {
  let state = original;
  const apply = (command: GameCommand) => {
    state = gameReducer(state, command, context);
    const receipt = state.operationReceipts[command.operationId];
    if (receipt?.status !== "applied") throw new Error(`GLP-1 NP QA ${command.operationId}: ${receipt?.message}`);
  };
  apply({ type: "PLACE_ROOM", operationId: "mb10.qa.glp1.suite", roomDefinitionId: "room.glp1_telehealth_suite",
    roomId: "room.mb10.qa.glp1", x: 23, y: 27, orientation: 0 });
  apply({ type: "PLACE_DOOR", operationId: "mb10.qa.glp1.door", doorId: "door.mb10.qa.glp1",
    roomId: "room.mb10.qa.glp1", side: "north", offset: 2 });
  apply({ type: "HIRE_STAFF", operationId: "mb10.qa.glp1.hire", employeeId: "employee.mb10.qa.glp1",
    staffRoleDefinitionId: "staff.glp1_np" });
  apply({ type: "SET_PAUSED", operationId: "mb10.qa.glp1.walk-in", paused: false });
  for (let tick = 0; tick < 240 && getOperationalGlp1AutomationCapacity(state, context) === 0; tick++) {
    apply({ type: "ADVANCE_TICK", operationId: `mb10.qa.glp1.arrival.${tick}` });
  }
  apply({ type: "SET_PAUSED", operationId: "mb10.qa.glp1.restore-pause", paused: original.paused });
  if (getOperationalGlp1AutomationCapacity(state, context) < 1) throw new Error("GLP-1 NP QA did not produce operational coverage.");
  return state;
}
