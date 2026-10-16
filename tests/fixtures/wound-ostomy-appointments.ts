import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export const WOUND_OSTOMY_APPOINTMENTS_QA_CAMPAIGN_ID = "campaign.qa.level-four-wound-ostomy-m6";
function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`Wound/ostomy QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** APP-operated, unscored visits; no supply authorization or procedure fixture. */
export function createWoundOstomyAppointmentsQaState(context = createLevelFourRoomsQaContext(), homes = 1): GameState {
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = WOUND_OSTOMY_APPOINTMENTS_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-four-wound-ostomy-m6";
  for (const [i, x] of [28, 38].slice(0, homes).entries()) {
    const roomId = `room.wound.qa.${i}`;
    state = apply(state, { type: "PLACE_ROOM", operationId: `wound.qa.place.${i}`, roomId,
      roomDefinitionId: "room.wound_ostomy", x, y: 23, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `wound.qa.door.${i}`, doorId: `door.${roomId}`,
      roomId, side: "south", offset: 1 }, context);
    state = apply(state, { type: "HIRE_STAFF", operationId: `wound.qa.hire.${i}`, employeeId: `app.wound.${i}`,
      staffRoleDefinitionId: "staff.app" }, context);
  }
  state = apply(state, { type: "PLACE_ROOM", operationId: "wound.qa.training", roomId: "room.wound.training",
    roomDefinitionId: "room.training", x: 33, y: 23, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_DOOR", operationId: "wound.qa.training.door", doorId: "door.wound.training",
    roomId: "room.wound.training", side: "south", offset: 1 }, context);
  state.serviceAppointmentsEnabled = true;
  // Two ordinary 180-minute streams, staggered so the one APP can serve both.
  for (let i = 0; i < homes; i++) {
    state.nextServiceAppointmentTicks[`income.wound_care:room.wound.qa.${i}`] = state.facilityTick + 1;
    state.nextServiceAppointmentTicks[`income.ostomy_support:room.wound.qa.${i}`] = state.facilityTick + 91;
  }
  return state;
}
