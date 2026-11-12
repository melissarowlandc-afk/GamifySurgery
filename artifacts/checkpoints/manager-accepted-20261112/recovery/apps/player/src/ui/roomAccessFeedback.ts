import {
  findCareAwareFacilityPath, findDeterministicFacilityPath, getEmployeeHomeLocation,
  getRoomDefinition, getRoomNavigationAnchor, getRotatedFootprint, getStaffRoleDefinition,
  isProtectedCareRoom, protectedCareRoomAtPoint, PROTOTYPE_DOMAIN_CONTEXT, validateDoorPlacement,
  type CardinalDirection, type DomainContext, type GameCommand, type GameState, type PlacedRoom,
} from "@gamify-surgery/game-domain";

function entryPoint(state: GameState, context: DomainContext) {
  const front = state.rooms.filter(room => context.balanceRelease.facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId))
    .sort((a, b) => a.id.localeCompare(b.id))[0];
  const definition = front && getRoomDefinition(front.roomDefinitionId, context);
  if (!front || !definition) return null;
  const size = getRotatedFootprint(definition, front.orientation);
  // Same fixed public entrance as getEmployeeArrival; no invented route rules.
  return { x: front.x + Math.floor((size.width - 1) / 2), y: front.y + size.height - 1 };
}

function blockedCorridor(state: GameState, room: PlacedRoom, context: DomainContext) {
  const start = entryPoint(state, context), definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!start || !definition) return { reachable: false, blocker: null };
  const goal = getRoomNavigationAnchor(room, definition, "staff");
  if (findCareAwareFacilityPath(state, context, start, goal, new Set([room.id])).length)
    return { reachable: true, blocker: null };
  const path = findDeterministicFacilityPath(start, goal, state.rooms, state.doors, id => getRoomDefinition(id, context));
  const blocker = path.map(point => protectedCareRoomAtPoint(state, context, point))
    .find(candidate => candidate && candidate.id !== room.id && isProtectedCareRoom(candidate));
  return { reachable: false, blocker: blocker ? getRoomDefinition(blocker.roomDefinitionId, context)?.displayName ?? null : null };
}

/** Read-only presentation. A warning requires an actual unrestricted route that
 * fails the care-aware pathfinder; adjacency to an OR alone proves nothing.
 * For a new room, test only doors permitted by the real door validator. If ANY
 * safe door can be added, do not claim that access is possible only through care.
 */
export function getRoomAccessWarning(state: GameState, roomId: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): string | null {
  const room = state.rooms.find(candidate => candidate.id === roomId), definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!room || !definition || definition.kind === "hallway" || context.balanceRelease.facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId)) return null;
  const actual = blockedCorridor(state, room, context);
  if (actual.reachable) return null;
  let blocker = actual.blocker;
  if (!state.doors.some(door => door.roomId === room.id)) {
    const size = getRotatedFootprint(definition, room.orientation), facility = context.balanceRelease.facility;
    for (const side of ["north", "east", "south", "west"] as const) {
      const length = side === "north" || side === "south" ? size.width : size.height;
      for (let offset = 0; offset < length; offset++) {
        const door = { id: `door.access-preview.${room.id}.${side}.${offset}`, roomId: room.id, side: side as CardinalDirection, offset, exterior: false };
        const validation = validateDoorPlacement(door, state.rooms, state.doors, id => getRoomDefinition(id, context),
          facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
        if (!validation.valid) continue;
        const option = blockedCorridor({ ...state, doors: [...state.doors, door] }, room, context);
        if (option.reachable) return null;
        blocker ??= option.blocker;
      }
    }
  }
  return blocker ? `Staff can't walk through the ${blocker}. Give the ${definition.displayName} a door to a hallway or waiting area.` : null;
}

export function getBuildAccessWarning(state: GameState, preferredRoomId?: string): string | null {
  const rooms = preferredRoomId ? [...state.rooms.filter(room => room.id === preferredRoomId), ...state.rooms.filter(room => room.id !== preferredRoomId)] : state.rooms;
  for (const room of rooms) {
    const warning = getRoomAccessWarning(state, room.id);
    if (warning) return warning;
  }
  return null;
}

const article = (name: string) => /^[aeiou]/i.test(name) ? "an" : "a";
export function missingHireRoomMessage(state: GameState, roleId: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): string | null {
  const role = getStaffRoleDefinition(roleId, context);
  if (!role) return null;
  const placed = new Set(state.rooms.map(room => room.roomDefinitionId));
  const missing = role.requiredRoomDefinitionIds.find(id => !placed.has(id));
  const alternatives = role.requiredAnyRoomDefinitionIds;
  const ids = missing ? [missing] : alternatives.length && !alternatives.some(id => placed.has(id)) ? alternatives : [];
  if (!ids.length) return null;
  const names = ids.map(id => getRoomDefinition(id, context)?.displayName ?? id);
  return `Build ${names.map(name => `${article(name)} ${name}`).join(" or ")} to hire ${article(role.displayName)} ${role.displayName}.`;
}

/** Improve only the known generic hire rejections; all other reducer messages
 * remain authoritative (cash, capacity, unlocks, stale questions, etc.). */
export function presentActionRejection(state: GameState, command: Pick<GameCommand, "type"> & { staffRoleDefinitionId?: string }, reason: string): string {
  if (command.type !== "HIRE_STAFF" || !command.staffRoleDefinitionId) return reason;
  const roleId = command.staffRoleDefinitionId;
  if (/compatible room|before hiring this role/.test(reason)) return missingHireRoomMessage(state, roleId) ?? reason;
  if (!reason.includes("no connected path from the Front Desk to the required room")) return reason;
  const role = getStaffRoleDefinition(roleId), home = getEmployeeHomeLocation(state, roleId, PROTOTYPE_DOMAIN_CONTEXT);
  const room = state.rooms.find(candidate => candidate.id === home.homeRoomInstanceId), definition = room && getRoomDefinition(room.roomDefinitionId);
  if (!role || !room || !definition) return missingHireRoomMessage(state, roleId) ?? reason;
  const warning = getRoomAccessWarning(state, room.id);
  return `The ${role.displayName} can't reach the ${definition.displayName}. ${warning ?? `Connect it to the Front Desk with doors and a hallway or waiting area.`}`;
}
