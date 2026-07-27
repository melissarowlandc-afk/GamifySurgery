import {
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import { getDoorCells } from "./doors";
import { getRoomDefinition, getStaffRoleDefinition } from "./selectors";
import {
  findDeterministicRoomPath,
  getOccupiedTiles,
  getRotatedFootprint,
  getRoomCenter,
} from "./spatial";
import type { DomainContext, EmployeeState, GameState, GridPoint } from "./types";

function samePoint(left: GridPoint, right: GridPoint): boolean {
  return left.x === right.x && left.y === right.y;
}

/**
 * Advances presentation-safe employee wandering.
 *
 * It deliberately stays inside the employee's home room until task assignment
 * provides a destination. The persisted path keeps refreshes from moving a
 * character to a different place.
 */
export function advanceEmployeeMovement(
  state: GameState,
  context: DomainContext,
): void {
  const interval = context.balanceRelease.facility.staffMovementIntervalTicks;
  if (state.facilityTick === 0 || state.facilityTick % interval !== 0) {
    return;
  }

  for (const employee of state.employees) {
    if (
      employee.path.length > 0 &&
      employee.pathIndex < employee.path.length - 1
    ) {
      employee.pathIndex += 1;
      employee.location = { ...employee.path[employee.pathIndex]! };
      employee.lastMovedAtFacilityTick = state.facilityTick;
      continue;
    }
    if (state.facilityTick < employee.nextIdleActionAtFacilityTick) {
      continue;
    }
    const idleConfig = context.balanceRelease.environment;
    const idleSpread =
      idleConfig.idleActionMaximumMinutes -
      idleConfig.idleActionMinimumMinutes +
      1;
    employee.nextIdleActionAtFacilityTick =
      state.facilityTick +
      idleConfig.idleActionMinimumMinutes +
      deterministicInteger(
        state.campaignSeed,
        RANDOM_STREAMS.environment,
        `${employee.id}:next-idle:${state.facilityTick}`,
        idleSpread,
      );
    const activityRoll = deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `${employee.id}:idle-roll:${state.facilityTick}`,
      100,
    );
    if (activityRoll >= idleConfig.idleActionChancePercent) {
      continue;
    }

    const homeRoom = state.rooms.find(
      (room) => room.id === employee.homeRoomInstanceId,
    );
    const definition = homeRoom
      ? getRoomDefinition(homeRoom.roomDefinitionId, context)
      : null;
    if (!homeRoom || !definition) {
      employee.path = [];
      employee.pathIndex = 0;
      continue;
    }

    const blockedDoorTiles = new Set(
      state.doors
        .filter((door) => door.roomId === homeRoom.id)
        .flatMap((door) => {
          const cells = getDoorCells(door, homeRoom, definition);
          return cells ? [`${cells.inside.x},${cells.inside.y}`] : [];
        }),
    );
    const candidates = getOccupiedTiles(homeRoom, definition)
      .filter((point) => !samePoint(point, employee.location))
      .filter(
        (point) => !blockedDoorTiles.has(`${point.x},${point.y}`),
      )
      .sort((left, right) => left.y - right.y || left.x - right.x);
    if (candidates.length === 0) {
      continue;
    }
    const candidateIndex = deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `${employee.id}:waypoint:${state.facilityTick}`,
      candidates.length,
    );
    const target = candidates[candidateIndex]!;
    const path: GridPoint[] = [{ ...employee.location }];
    let cursor = { ...employee.location };
    while (cursor.x !== target.x) {
      cursor = {
        x: cursor.x + Math.sign(target.x - cursor.x),
        y: cursor.y,
      };
      path.push(cursor);
    }
    while (cursor.y !== target.y) {
      cursor = {
        x: cursor.x,
        y: cursor.y + Math.sign(target.y - cursor.y),
      };
      path.push(cursor);
    }
    employee.path = path;
    employee.pathIndex = 0;
  }
}

export function getEmployeeHomeLocation(
  state: GameState,
  employeeRoleId: string,
  context: DomainContext,
): { homeRoomInstanceId: string | null; location: GridPoint } {
  const role = getStaffRoleDefinition(employeeRoleId, context);
  const homeRoom =
    role?.requiredRoomDefinitionIds
      .map((definitionId) =>
        state.rooms
          .filter((room) => room.roomDefinitionId === definitionId)
          .sort((left, right) => left.id.localeCompare(right.id))[0],
      )
      .find((room) => room !== undefined) ??
    state.rooms.find((room) =>
      context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
        room.roomDefinitionId,
      ),
    );
  const definition = homeRoom
    ? getRoomDefinition(homeRoom.roomDefinitionId, context)
    : null;
  return {
    homeRoomInstanceId: homeRoom?.id ?? null,
    location:
      homeRoom && definition
        ? getRoomCenter(homeRoom, definition)
        : { x: 0, y: 0 },
  };
}

function openGridPath(start: GridPoint, goal: GridPoint): GridPoint[] {
  const path = [{ ...start }];
  let cursor = { ...start };
  while (cursor.x !== goal.x) {
    cursor = {
      x: cursor.x + Math.sign(goal.x - cursor.x),
      y: cursor.y,
    };
    path.push(cursor);
  }
  while (cursor.y !== goal.y) {
    cursor = {
      x: cursor.x,
      y: cursor.y + Math.sign(goal.y - cursor.y),
    };
    path.push(cursor);
  }
  return path;
}

export function getEmployeeArrival(
  state: GameState,
  employeeRoleId: string,
  context: DomainContext,
): {
  homeRoomInstanceId: string;
  location: GridPoint;
  path: GridPoint[];
} | null {
  const home = getEmployeeHomeLocation(state, employeeRoleId, context);
  const homeRoom = state.rooms.find(
    (room) => room.id === home.homeRoomInstanceId,
  );
  const entryRoom = state.rooms
    .filter((room) =>
      context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
        room.roomDefinitionId,
      ),
    )
    .sort((left, right) => left.id.localeCompare(right.id))[0];
  const entryDefinition = entryRoom
    ? getRoomDefinition(entryRoom.roomDefinitionId, context)
    : null;
  const homeDefinition = homeRoom
    ? getRoomDefinition(homeRoom.roomDefinitionId, context)
    : null;
  if (!entryRoom || !entryDefinition || !homeRoom || !homeDefinition) {
    return null;
  }
  const entrySize = getRotatedFootprint(
    entryDefinition,
    entryRoom.orientation,
  );
  // The protected Front Desk has a fixed exterior entrance centered on its
  // south wall. Its saved rotatable door remains available for internal
  // construction, so staff visibly arrive from the sidewalk instead of
  // materializing at an internal doorway.
  const entryDoor = {
    x: entryRoom.x + Math.floor((entrySize.width - 1) / 2),
    y: entryRoom.y + entrySize.height - 1,
  };
  const entryApproach = { x: entryDoor.x, y: entryDoor.y + 1 };
  const entryCenter = getRoomCenter(entryRoom, entryDefinition);
  const exteriorPath = [
    { ...entryApproach },
    ...openGridPath(entryDoor, entryCenter),
  ];

  let path: GridPoint[];
  if (entryRoom.id === homeRoom.id) {
    path = exteriorPath;
  } else {
    const internalPath = findDeterministicRoomPath(
      entryRoom,
      homeRoom,
      (definitionId) => getRoomDefinition(definitionId, context),
      state.rooms,
      new Set(
        context.balanceRelease.facility.protectedRoomDefinitionIds,
      ),
      state.doors,
    );
    path =
      internalPath.length === 0
        ? []
        : [...exteriorPath, ...internalPath.slice(1)];
  }
  if (path.length === 0) {
    return null;
  }
  return {
    homeRoomInstanceId: homeRoom.id,
    location: { ...path[0]! },
    path: path.map((point) => ({ ...point })),
  };
}

export function getEffectiveEmployeeMorale(
  employee: EmployeeState,
  context: DomainContext,
): number {
  const role = getStaffRoleDefinition(
    employee.staffRoleDefinitionId,
    context,
  );
  if (!role) {
    return employee.morale;
  }
  const stepsFromDefault =
    (employee.salaryPerExpenseInterval - role.salaryPerExpenseInterval) /
    role.salaryAdjustmentStep;
  return Math.max(
    0,
    Math.min(
      100,
      role.baseMorale + stepsFromDefault * role.moralePerSalaryStep,
    ),
  );
}
