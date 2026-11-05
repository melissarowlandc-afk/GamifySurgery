import type { RoomDefinition } from "@gamify-surgery/balance-config";
import type { DomainContext, DoorState, PlacedRoom } from "./types";

type DefinitionReader = (id: string) => RoomDefinition | null;
type Geometry = { doors: readonly DoorState[]; reader: DefinitionReader; ids: string[]; definitions: (RoomDefinition | null)[]; key: string };
type Scope = WeakMap<readonly PlacedRoom[], Geometry[]>;
let scope: Scope | null = null;
let readers: WeakMap<DomainContext, DefinitionReader> | null = null;

/** Stable only within the same read-only geometry scope. A later command reads
 * actual definitions again, including replacement or in-place QA edits. */
export function facilityDefinitionReader(context: DomainContext): DefinitionReader {
  const known = readers?.get(context);
  if (known) return known;
  const read: DefinitionReader = id => context.balanceRelease.facility.roomDefinitions.find(definition => definition.id === id) ?? null;
  readers?.set(context, read);
  return read;
}

/** Only for an operation that cannot edit placement or navigation definitions.
 * Ticks edit condition/occupancy, not geometry; view projections edit nothing.
 * Ordinary builder calls still compare actual geometry on every query. A fresh
 * scope is installed for every command/projection, never for a mutable lifetime.
 */
export function withFacilityNavigationScope<T>(read: () => T): T {
  if (scope) return read();
  scope = new WeakMap();
  readers = new WeakMap();
  try { return read(); } finally { scope = null; readers = null; }
}

export function facilityNavigationKey(rooms: readonly PlacedRoom[], doors: readonly DoorState[], getDefinition: DefinitionReader): string {
  const known = scope?.get(rooms);
  if (known) for (const entry of known) {
    if (entry.doors === doors && (entry.reader === getDefinition || entry.ids.every((id, i) => getDefinition(id) === entry.definitions[i]))) return entry.key;
  }
  const ids = [...new Set(rooms.map(room => room.roomDefinitionId))];
  const definitions = ids.map(id => getDefinition(id));
  const key = JSON.stringify([
    rooms.map(room => [room.id, room.roomDefinitionId, room.x, room.y, room.orientation, room.doorSide, room.upgradeLevel]),
    doors.map(door => [door.id, door.roomId, door.side, door.offset, door.exterior]),
    definitions.map((definition, i) => [ids[i], definition ? [definition.kind, definition.width, definition.height, definition.navigation] : null]),
  ]);
  if (scope) { const entries = known ?? []; entries.push({ doors, reader: getDefinition, ids, definitions, key }); scope.set(rooms, entries); }
  return key;
}

/** Bounded by geometry, not state identity, tick, actor or save history. Values
 * are private to spatial.ts; neither graphs nor cached paths escape to callers.
 */
export function createFacilityNavigationCache<T>(limit = 16) {
  const layouts = new Map<string, T>();
  return (rooms: readonly PlacedRoom[], doors: readonly DoorState[], getDefinition: DefinitionReader, build: () => T): T => {
    const key = facilityNavigationKey(rooms, doors, getDefinition);
    let result = layouts.get(key);
    if (result === undefined) result = build();
    layouts.delete(key); layouts.set(key, result);
    while (layouts.size > limit) layouts.delete(layouts.keys().next().value!);
    return result;
  };
}
