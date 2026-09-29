import {
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import { getDoorCells } from "./doors";
import { getRoomDefinition, getStaffRoleDefinition } from "./selectors";
import {
  findDeterministicFacilityPath,
  getRoomNavigableTiles,
  getRotatedFootprint,
  getRoomNavigationAnchor,
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
  if (state.facilityTick === 0) {
    return;
  }

  for (const employee of state.employees) {
    const hasActiveRetailTrip = state.retailOperations.some(
      (operation) =>
        operation.actorKind === "employee" &&
        operation.actorId === employee.id &&
        operation.status !== "completed" &&
        operation.status !== "abandoned" &&
        operation.status !== "cancelled",
    );
    if (hasActiveRetailTrip && !employee.facilityTask) {
      continue;
    }
    if (
      employee.path.length > 0 &&
      employee.pathIndex < employee.path.length - 1
    ) {
      const elapsedTicks = Math.max(
        1,
        state.facilityTick - employee.lastMovedAtFacilityTick,
      );
      employee.pathIndex = Math.min(
        employee.path.length - 1,
        employee.pathIndex +
          elapsedTicks *
            context.balanceRelease.facility
              .characterTravelTilesPerTick,
      );
      employee.location = { ...employee.path[employee.pathIndex]! };
      employee.lastMovedAtFacilityTick = state.facilityTick;
      continue;
    }
    if (employee.facilityTask) {
      continue;
    }
    // Reception and GLP-1 NPs are posts, not idle-wander roles. The water-
    // cooler task is the intentional exception above; once it is complete,
    // route back to the assigned station and remain there for arriving work.
    const fixedStation = employee.staffRoleDefinitionId === "staff.receptionist"
      ? (() => {
          const room = employee.homeRoomInstanceId
            ? state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId)
            : null;
          const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
          return room && definition ? getRoomNavigationAnchor(room, definition, "staff") : null;
        })()
      : getGlp1NursePractitionerStation(state, employee, context);
    if (fixedStation) {
      const homeRoom = employee.homeRoomInstanceId
        ? state.rooms.find((room) => room.id === employee.homeRoomInstanceId)
        : null;
      const definition = homeRoom
        ? getRoomDefinition(homeRoom.roomDefinitionId, context)
        : null;
      if (homeRoom && definition) {
        if (samePoint(employee.location, fixedStation)) {
          employee.path = [];
          employee.pathIndex = 0;
          continue;
        }
        const path = findDeterministicFacilityPath(
          employee.location,
          fixedStation,
          state.rooms,
          state.doors,
          (definitionId) => getRoomDefinition(definitionId, context),
        );
        if (path.length > 1) {
          employee.path = path;
          employee.pathIndex = 0;
          employee.lastMovedAtFacilityTick = state.facilityTick;
          continue;
        }
      }
    }
    if (state.facilityTick % interval !== 0) {
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
    const candidates = getRoomNavigableTiles(
      homeRoom,
      definition,
      state.doors,
    )
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
    const path = findDeterministicFacilityPath(
      employee.location,
      target,
      state.rooms,
      state.doors,
      (definitionId) => getRoomDefinition(definitionId, context),
    );
    if (path.length <= 1) {
      continue;
    }
    employee.path = path;
    employee.pathIndex = 0;
  }
}

function getGlp1NursePractitionerHomes(
  state: GameState,
  context: DomainContext,
): Array<{ homeRoomInstanceId: string; location: GridPoint }> {
  return state.rooms
    .filter((room) => room.roomDefinitionId === "room.glp1_telehealth_suite")
    .sort((left, right) => left.id.localeCompare(right.id))
    .flatMap((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      if (!definition) return [];
      const assignedCount = state.employees.filter(
        (employee) =>
          employee.staffRoleDefinitionId === "staff.glp1_np" &&
          employee.homeRoomInstanceId === room.id,
      ).length;
      if (assignedCount >= 2) return [];
      return [{
        homeRoomInstanceId: room.id,
        location: getRoomNavigationAnchor(
          room,
          definition,
          assignedCount === 0 ? "staff" : "primary",
        ),
      }];
    });
}

/**
 * Returns the fixed workstation assigned to a GLP-1 NP. The sorted employee
 * assignment is shared with presentation so both NPs retain their own chair.
 */
export function getGlp1NursePractitionerStation(
  state: GameState,
  employee: EmployeeState,
  context: DomainContext,
): GridPoint | null {
  if (employee.staffRoleDefinitionId !== "staff.glp1_np" || !employee.homeRoomInstanceId) {
    return null;
  }
  const room = state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  if (!room || room.roomDefinitionId !== "room.glp1_telehealth_suite" || !definition) {
    return null;
  }
  const assignedEmployees = state.employees
    .filter(
      (candidate) =>
        candidate.staffRoleDefinitionId === "staff.glp1_np" &&
        candidate.homeRoomInstanceId === room.id,
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  return getRoomNavigationAnchor(
    room,
    definition,
    assignedEmployees.findIndex((candidate) => candidate.id === employee.id) <= 0
      ? "staff"
      : "primary",
  );
}

export function getEmployeeHomeLocation(
  state: GameState,
  employeeRoleId: string,
  context: DomainContext,
): { homeRoomInstanceId: string | null; location: GridPoint } {
  if (employeeRoleId === "staff.glp1_np") {
    return getGlp1NursePractitionerHomes(state, context)[0] ?? {
      homeRoomInstanceId: null,
      location: { x: 0, y: 0 },
    };
  }
  const role = getStaffRoleDefinition(employeeRoleId, context);
  const requiredRoomDefinitionIds = [
    ...(role?.requiredRoomDefinitionIds ?? []),
    ...(role?.requiredAnyRoomDefinitionIds ?? []),
  ];
  const homeRoom =
    requiredRoomDefinitionIds
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
        ? getRoomNavigationAnchor(homeRoom, definition, "staff")
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
  employeeId: string,
  context: DomainContext,
): {
  homeRoomInstanceId: string;
  location: GridPoint;
  path: GridPoint[];
} | null {
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
  if (!entryRoom || !entryDefinition) {
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
  const entryCenter = getRoomNavigationAnchor(
    entryRoom,
    entryDefinition,
    "staff",
  );
  const entersFromLeft =
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `${employeeId}:staff-arrival-side.v1`,
      2,
    ) === 0;
  const offscreenStart = {
    x: entersFromLeft
      ? -2
      : context.balanceRelease.facility.gridWidth + 1,
    y: entryApproach.y,
  };
  const exteriorPath = [
    ...openGridPath(offscreenStart, entryApproach),
    entryDoor,
  ];
  const homes = employeeRoleId === "staff.glp1_np"
    ? getGlp1NursePractitionerHomes(state, context)
    : [getEmployeeHomeLocation(state, employeeRoleId, context)];
  for (const home of homes) {
    const homeRoom = state.rooms.find((room) => room.id === home.homeRoomInstanceId);
    const homeDefinition = homeRoom
      ? getRoomDefinition(homeRoom.roomDefinitionId, context)
      : null;
    if (!homeRoom || !homeDefinition) continue;
    const internalPath = findDeterministicFacilityPath(
      entryDoor,
      homeRoom.id === entryRoom.id ? entryCenter : home.location,
      state.rooms,
      state.doors,
      (definitionId) => getRoomDefinition(definitionId, context),
    );
    if (internalPath.length === 0) continue;
    const path = [...exteriorPath, ...internalPath.slice(1)];
    return {
      homeRoomInstanceId: homeRoom.id,
      location: { ...path[0]! },
      path: path.map((point) => ({ ...point })),
    };
  }
  return null;
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
