import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export const PEDIATRIC_APPOINTMENTS_QA_CAMPAIGN_ID = "campaign.qa.level-four-pediatric-families-m5";
function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`Pediatric QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** Operational visits only: no clinical fixture, chart or authored content. */
export function createPediatricAppointmentsQaState(context = createLevelFourRoomsQaContext(), homes = 1): GameState {
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = PEDIATRIC_APPOINTMENTS_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-four-pediatric-families-m5";
  state = apply(state, { type: "PLACE_ROOM", operationId: "peds.qa.wait", roomId: "room.peds.wait",
    roomDefinitionId: "room.pediatric_waiting", x: 29, y: 22, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_DOOR", operationId: "peds.qa.wait.door", doorId: "room.peds.wait.door",
    roomId: "room.peds.wait", side: "south", offset: 2 }, context);
  for (const [i, x] of [35, 23].slice(0, homes).entries()) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `peds.qa.exam.${i}`, roomId: `room.peds.exam.${i}`,
      roomDefinitionId: "room.pediatric_examination", x, y: 23, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `peds.qa.door.${i}`, doorId: `room.peds.exam.${i}.door`,
      roomId: `room.peds.exam.${i}`, side: "south", offset: i ? 2 : 1 }, context);
    state = apply(state, { type: "HIRE_STAFF", operationId: `peds.qa.hire.${i}`, employeeId: `app.peds.${i}`,
      staffRoleDefinitionId: "staff.app" }, context);
  }
  state = apply(state, { type: "PLACE_ROOM", operationId: "peds.qa.training", roomId: "room.peds.training",
    roomDefinitionId: "room.training", x: 40, y: 23, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_DOOR", operationId: "peds.qa.training.door", doorId: "room.peds.training.door",
    roomId: "room.peds.training", side: "south", offset: 1 }, context);
  state.serviceAppointmentsEnabled = true;
  for (let i = 0; i < homes; i++) state.nextServiceAppointmentTicks[`income.pediatric_consult:room.peds.exam.${i}`] = state.facilityTick + 1;
  return state;
}
