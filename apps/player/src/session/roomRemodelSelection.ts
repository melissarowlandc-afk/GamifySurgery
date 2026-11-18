import { getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT, roomHasActiveRemodelWork, type GameState } from "@gamify-surgery/game-domain";

/** UI selection/preview adapter. The domain predicate remains the only work
 * gate; home assignments, idle occupants and ordinary routes are not blockers. */
export function roomRemodelSelectionReason(state: GameState, roomId: string): string | null {
  const room = state.rooms.find(candidate => candidate.id === roomId);
  if (!room || !getRoomDefinition(room.roomDefinitionId)) return "That room is no longer available.";
  return roomHasActiveRemodelWork(state, room, PROTOTYPE_DOMAIN_CONTEXT)
    ? "This room is in use - finish the active work first." : null;
}
