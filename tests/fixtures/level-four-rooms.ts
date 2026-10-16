import { PROTOTYPE_BALANCE_RELEASE, prototypeBalanceReleaseSchema } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, gameReducer, validateDomainContext,
  type DomainContext, type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";

/** Disposable room-only QA. Never imported by the ordinary player entry point. */
export const LEVEL_FOUR_ROOMS_QA_CAMPAIGN_ID = "campaign.qa.level-four-rooms-m3";
export const LEVEL_FOUR_ROOMS_QA_PLACEMENTS = [
  { roomDefinitionId: "room.mri", roomId: "room.qa.mri", x: 23, y: 22, doorOffset: 2 },
  { roomDefinitionId: "room.pediatric_waiting", roomId: "room.qa.pediatric_waiting", x: 29, y: 22, doorOffset: 2 },
  { roomDefinitionId: "room.pediatric_examination", roomId: "room.qa.pediatric_examination", x: 35, y: 23, doorOffset: 1 },
  { roomDefinitionId: "room.wound_ostomy", roomId: "room.qa.wound_ostomy", x: 40, y: 23, doorOffset: 1 },
] as const;

export function createLevelFourRoomsQaContext(): DomainContext {
  const balance = JSON.parse(JSON.stringify(PROTOTYPE_BALANCE_RELEASE)) as typeof PROTOTYPE_BALANCE_RELEASE;
  // Use the shipped progression contract; only the disposable campaign differs.
  return validateDomainContext({ ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: prototypeBalanceReleaseSchema.parse(balance) });
}

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  const receipt = next.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") throw new Error(`QA fixture ${command.operationId}: ${receipt?.message}`);
  return next;
}

/** Ready for ordinary Build controls: cash, empty expansion sites and a corridor. */
export function createLevelFourRoomsQaState(context = createLevelFourRoomsQaContext()): GameState {
  let state = createInitialGameState(context, { campaignId: LEVEL_FOUR_ROOMS_QA_CAMPAIGN_ID,
    campaignSeed: "level-four-rooms-m3", createdAtRealMs: 0 });
  Object.assign(state, { facilityLevel: 4, paused: true, cash: 30_000, cashCents: 3_000_000,
    encounters: {}, openChartEncounterId: null, attendedEncounterId: null,
    serviceAppointmentsEnabled: false, nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER });
  for (let x = 25; x <= 41; x++) state = apply(state, { type: "PLACE_ROOM", operationId: `qa.hall.${x}`,
    roomDefinitionId: "room.hallway", roomId: `room.qa.hall.${x}`, x, y: 26, orientation: 0 }, context);
  state = apply(state, { type: "PLACE_ROOM", operationId: "qa.hall.connect", roomDefinitionId: "room.hallway",
    roomId: "room.qa.hall.connect", x: 35, y: 27, orientation: 0 }, context);
  return apply(state, { type: "PLACE_DOOR", operationId: "qa.desk.door", doorId: "door.qa.desk",
    roomId: "room.instance.founder_desk", side: "north", offset: 2 }, context);
}

/** Uses real placement/door commands, not pre-inserted room records. */
export function placeLevelFourRoomsQaRooms(state: GameState, context = createLevelFourRoomsQaContext()): GameState {
  for (const placement of LEVEL_FOUR_ROOMS_QA_PLACEMENTS) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `qa.place.${placement.roomId}`,
      roomId: placement.roomId, roomDefinitionId: placement.roomDefinitionId,
      x: placement.x, y: placement.y, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `qa.door.${placement.roomId}`,
      doorId: `door.${placement.roomId}`, roomId: placement.roomId, side: "south", offset: placement.doorOffset }, context);
  }
  return state;
}
