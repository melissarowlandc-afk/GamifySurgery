import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "./level-four-rooms";

export const MRI_APPOINTMENTS_QA_CAMPAIGN_ID = "campaign.qa.level-four-mri-m6";

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") throw new Error(`MRI QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  return next;
}

/** Ordinary room/technician/reader hires, separate from owner storage and L3. */
export function createMriAppointmentsQaState(context = createLevelFourRoomsQaContext()): GameState {
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = MRI_APPOINTMENTS_QA_CAMPAIGN_ID;
  state.campaignSeed = "level-four-mri-m6";
  for (const [definition, roomId, x, y, offset] of [
    ["room.mri", "room.mri.qa", 23, 22, 2], ["room.reading", "room.mri.reading", 29, 22, 2],
    ["room.training", "room.mri.training", 35, 23, 1],
  ] as const) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `mri.qa.${roomId}`, roomDefinitionId: definition, roomId, x, y, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `mri.qa.door.${roomId}`, doorId: `door.${roomId}`, roomId, side: "south", offset }, context);
  }
  for (const [role, employeeId] of [["staff.imaging_technician", "tech.mri.qa"], ["staff.radiologist", "reader.mri.qa"]]) {
    state = apply(state, { type: "HIRE_STAFF", operationId: `mri.qa.hire.${employeeId}`, staffRoleDefinitionId: role!, employeeId: employeeId! }, context);
  }
  state.serviceAppointmentsEnabled = true;
  state.nextServiceAppointmentTicks["income.mri"] = state.facilityTick + 1;
  return state;
}
