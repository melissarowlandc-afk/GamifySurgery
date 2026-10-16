import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";

export const LEVEL_FIVE_ROOMS_QA_PLACEMENTS = [
  { roomDefinitionId: "room.founder_office", roomId: "room.qa.level5.founder", x: 23, y: 18, doorOffset: 1 },
  { roomDefinitionId: "room.executive_office", roomId: "room.qa.level5.executive", x: 29, y: 19, doorOffset: 1 },
  { roomDefinitionId: "room.gift_shop", roomId: "room.qa.level5.gift", x: 34, y: 18, doorOffset: 1 },
  { roomDefinitionId: "room.indoor_garden", roomId: "room.qa.level5.garden", x: 39, y: 17, doorOffset: 2 },
  { roomDefinitionId: "room.staff_gym", roomId: "room.qa.level5.gym", x: 45, y: 17, doorOffset: 1 },
] as const;

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const next = gameReducer(state, command, context);
  if (next.operationReceipts[command.operationId]?.status !== "applied") {
    throw new Error(`Level 5 room QA ${command.operationId}: ${next.operationReceipts[command.operationId]?.message}`);
  }
  return next;
}

/** Real construction/access receipts; no effects, employees, work or revenue. */
export function placeLevelFiveRoomsQaRooms(state: GameState, context: DomainContext): GameState {
  for (let y = 21; y <= 25; y++) state = apply(state, { type: "PLACE_ROOM", operationId: `level5.rooms.link.${y}`,
    roomId: `room.level5.rooms.link.${y}`, roomDefinitionId: "room.hallway", x: 35, y, orientation: 0 }, context);
  for (let x = 22; x <= 49; x++) {
    if (x === 35) continue;
    state = apply(state, { type: "PLACE_ROOM", operationId: `level5.rooms.hall.${x}`,
      roomId: `room.level5.rooms.hall.${x}`, roomDefinitionId: "room.hallway", x, y: 21, orientation: 0 }, context);
  }
  for (const site of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `level5.rooms.place.${site.roomId}`, roomId: site.roomId,
      roomDefinitionId: site.roomDefinitionId, x: site.x, y: site.y, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `level5.rooms.door.${site.roomId}`, doorId: `door.${site.roomId}`,
      roomId: site.roomId, side: "south", offset: site.doorOffset }, context);
  }
  return state;
}
