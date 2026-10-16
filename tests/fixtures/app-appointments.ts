import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export const APP_APPOINTMENTS_QA_CAMPAIGN_ID = "campaign.qa.level-four-app-appointments-m4";

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`APP QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** Real hires, frozen identities, separate exam homes, and a real training room. */
export function createAppAppointmentsQaState(context = createLevelFourRoomsQaContext()): GameState {
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = APP_APPOINTMENTS_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-four-app-appointments-m4";
  for (const [i, x] of [28, 38].entries()) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `app.qa.exam.${i}`, roomId: `room.app.${i}`,
      roomDefinitionId: "room.examination", x, y: 24, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `app.qa.door.${i}`, doorId: `door.app.${i}`,
      roomId: `room.app.${i}`, side: "south", offset: 1 }, context);
    state = apply(state, { type: "HIRE_STAFF", operationId: `app.qa.hire.${i}`, employeeId: `app.${i}`,
      staffRoleDefinitionId: "staff.app" }, context);
  }
  state = apply(state, { type: "PLACE_ROOM", operationId: "app.qa.training", roomId: "room.app.training",
    roomDefinitionId: "room.training", x: 33, y: 23, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_DOOR", operationId: "app.qa.training.door", doorId: "door.app.training",
    roomId: "room.app.training", side: "south", offset: 1 }, context);
  state.serviceAppointmentsEnabled = true;
  // Observe the hires walking in, followed by two independently arriving visitors.
  for (const roomId of ["room.app.0", "room.app.1"]) state.nextServiceAppointmentTicks[`income.app_consult:${roomId}`] = state.facilityTick + 1;
  return state;
}
