import { getDoorCells } from "./doors";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getRoomDefinition } from "./selectors";
import { getRotatedFootprint } from "./spatial";
import { chooseWaitingAreaDestination, type WaitingActor } from "./waiting-destinations";
import type { DomainContext, GameState, GridPoint } from "./types";

export function restroomAtPoint(state: GameState, context: DomainContext, point: GridPoint | null | undefined) {
  return point ? state.rooms.find(room => {
    if (room.roomDefinitionId !== "room.bathroom") return false;
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    const size = definition && getRotatedFootprint(definition, room.orientation);
    return size && point.x >= room.x && point.x < room.x + size.width && point.y >= room.y && point.y < room.y + size.height;
  }) : undefined;
}

/** Failed/obsolete returns use the ordinary queue seats and overflow, never check-in.
 * Disconnected or unowned native positions use a real public destination from
 * the entrance graph, without inventing an escape through a removed door or an
 * unauthorized care room. No new save state. */
export function planRestroomRecovery(state: GameState, context: DomainContext, actor: WaitingActor) {
  const occupied = new Set(state.retailExternalActors.filter(row => row.lifecycle !== "departed" && row.id !== actor.id)
    .flatMap(row => [row.location, row.path.at(-1), row.procedureCompanion?.waitingReservation?.location])
    .filter((point): point is GridPoint => Boolean(point)).map(point => `${point.x},${point.y}`));
  const planFrom = (start: GridPoint) => chooseWaitingAreaDestination(state, context, { ...actor, location: start }, true, target =>
    restroomAtPoint(state, context, target) || occupied.has(`${target.x},${target.y}`) ? []
      : findRouteFromDisplacedLocationToPoint(state, context, start, target));
  // An orphan has no retained native escape path. Never search the integer
  // grass graph from a fractional lattice that cannot reach its integer goal.
  if (actor.location && Number.isInteger(actor.location.x) && Number.isInteger(actor.location.y)) {
    const plan = planFrom(actor.location);
    if (plan.reservation) return { ...plan, relocated: false };
  }
  for (const door of state.doors.filter(row => row.exterior).sort((a, b) => a.id.localeCompare(b.id))) {
    const room = state.rooms.find(row => row.id === door.roomId);
    const definition = room && getRoomDefinition(room.roomDefinitionId, context);
    const cells = room && definition && getDoorCells(door, room, definition);
    if (!cells) continue;
    const plan = planFrom(cells.inside);
    if (plan.reservation) return { ...plan, relocated: true };
  }
  return null;
}
