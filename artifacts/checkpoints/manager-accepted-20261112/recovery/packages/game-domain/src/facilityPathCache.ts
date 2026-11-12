import type { RoomDefinition } from "@gamify-surgery/balance-config";
import type { DoorState, PlacedRoom } from "./types";

type Graph = Map<string, Set<string>>;
const layouts = new Map<string, Graph>();
const MAX_LAYOUT_GRAPHS = 8;

/** Key actual geometry, not a mutable GameState/room identity. Cleaning,
 * maintenance and time do not change a graph; doors, rotations, furniture
 * navigation definitions and endpoint-only contacts do. Preserve source order
 * because graph/neighbor insertion order determines equally short routes.
 */
export function cachedFacilityAdjacency(rooms: readonly PlacedRoom[], doors: readonly DoorState[],
  getDefinition: (id: string) => RoomDefinition | null, endpointOnly: ReadonlySet<string>, build: () => Graph): Graph {
  const definitions = [...new Set(rooms.map(room => room.roomDefinitionId))].map(id => {
    const definition = getDefinition(id);
    return [id, definition ? [definition.kind, definition.width, definition.height, definition.navigation] : null];
  });
  const key = JSON.stringify([rooms.map(room => [room.id, room.roomDefinitionId, room.x, room.y, room.orientation, room.doorSide, room.upgradeLevel]),
    doors.map(door => [door.id, door.roomId, door.side, door.offset, door.exterior]), definitions, [...endpointOnly].sort()]);
  let graph = layouts.get(key);
  if (!graph) graph = build();
  layouts.delete(key); layouts.set(key, graph);
  while (layouts.size > MAX_LAYOUT_GRAPHS) layouts.delete(layouts.keys().next().value!);
  // Queries remove protected rooms and can add a legacy origin. Never publish
  // the cache's Map/Sets to those mutations or to a caller.
  return new Map([...graph].map(([point, neighbors]) => [point, new Set(neighbors)]));
}
