import {
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import { getDoorCells } from "./doors";
import {
  findCareAwareFacilityPath,
  isProtectedCareRoom,
  pathEntersUnauthorizedProtectedRoom,
  protectedCareRoomAtPoint,
} from "./care-room-access";
import { getRoomDefinition, getStaffRoleDefinition } from "./selectors";
import {
  getRoomCareAnchor,
  getRoomNavigableTiles,
  getRotatedFootprint,
  getRoomNavigationAnchor,
} from "./spatial";
import type { DomainContext, EmployeeState, GameState, GridPoint, PlacedRoom } from "./types";
import { getPlacedRoomIdleSpots } from "./employee-idle-spots";
import { getAvailableEmployeeHomeRoom, reconcileImagingIdleSeats } from "./room-capacity";
import { findRouteFromDisplacedLocationToRoom } from "./displaced-routing";
import { isEmployeeAwayForTraining } from "./employee-training";
import { getNextReadingStationLocation, getRadiologistReadingStation, reconcileReadingStations } from "./reading-stations";
import { getPeriopNurseAttentionQueue } from "./periop-nurse-attention";

function samePoint(left: GridPoint, right: GridPoint): boolean {
  return left.x === right.x && left.y === right.y;
}

/**
 * An idle employee splits time evenly between sitting on a free chair,
 * using a free workstation and standing somewhere else in their room. A room
 * without a chair or workstation splits between what it has. Spots another
 * employee stands on or is walking to are taken.
 */
function chooseIdleTarget(
  state: GameState,
  employee: EmployeeState,
  homeRoom: PlacedRoom,
  candidates: readonly GridPoint[],
): GridPoint {
  const pick = <T>(items: readonly T[], label: string): T => items[deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.environment,
    `${employee.id}:${label}:${state.facilityTick}`,
    items.length,
  )]!;
  const spots = getPlacedRoomIdleSpots(homeRoom);
  const claimed = state.employees
    .filter((other) => other.id !== employee.id)
    .flatMap((other) => [other.location, other.path.at(-1)])
    .filter((point): point is GridPoint => Boolean(point));
  const open = (point: GridPoint) => candidates.some((candidate) => samePoint(candidate, point)) &&
    !claimed.some((taken) => samePoint(taken, point));
  const freeSpots = spots.filter((candidate) => open(candidate.tile));
  const standing = candidates.filter((candidate) => !spots.some((idleSpot) => samePoint(idleSpot.tile, candidate)));
  const activities = [
    ...(standing.length > 0 ? [standing] : []),
    ...(["seat", "workstation"] as const)
      .map((kind) => freeSpots.filter((candidate) => candidate.kind === kind).map((candidate) => candidate.tile))
      .filter((tiles) => tiles.length > 0),
  ];
  if (activities.length === 0) return pick(candidates, "waypoint");
  return pick(pick(activities, "idle-activity"), "waypoint");
}

/** Released peri-op nurses settle promptly. Once seated, their existing idle
 * schedule still runs; returning true forever would pin them to the stool.
 * Retail, training and break tasks own travel before this branch.
 */
function settleIdlePeriopNurse(state: GameState, employee: EmployeeState, context: DomainContext): boolean {
  if (employee.staffRoleDefinitionId !== "staff.periop_nurse" || getPeriopNurseAttentionQueue(state).length) return false;
  const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId && room.roomDefinitionId === "room.periop_recovery");
  const definition = home && getRoomDefinition(home.roomDefinitionId, context);
  if (!home || !definition) return false;
  const navigable = getRoomNavigableTiles(home, definition, state.doors);
  const claimed = state.employees.filter((other) => other.id !== employee.id).flatMap((other) => [other.location, other.path.at(-1)]);
  const seats = getPlacedRoomIdleSpots(home).filter((spot) => spot.kind === "seat" &&
    navigable.some((point) => samePoint(point, spot.tile)) && !claimed.some((point) => point && samePoint(point, spot.tile)))
    .sort((a, b) => (Math.abs(a.tile.x - employee.location.x) + Math.abs(a.tile.y - employee.location.y)) -
      (Math.abs(b.tile.x - employee.location.x) + Math.abs(b.tile.y - employee.location.y)) || a.id.localeCompare(b.id));
  for (const seat of seats) {
    if (samePoint(employee.location, seat.tile)) return state.facilityTick < employee.nextIdleActionAtFacilityTick;
    const path = findCareAwareFacilityPath(state, context, employee.location, seat.tile, new Set([home.id]));
    if (!path.length) continue;
    employee.path = path;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.nextIdleActionAtFacilityTick = Math.max(employee.nextIdleActionAtFacilityTick,
      state.facilityTick + context.balanceRelease.environment.idleActionMinimumMinutes);
    return true;
  }
  return false;
}

/** An old idle route can outlive a room/door/furniture edit. Never follow its
 * obsolete edges through a solid fixture; let the ordinary idle branch choose
 * a fresh destination. Outside hiring/retail and assigned task travel retain
 * their own lifecycle. Finished routes no longer look like in-flight paths.
 */
function discardStaleIdlePeriopPath(state: GameState, employee: EmployeeState, context: DomainContext): void {
  if (employee.staffRoleDefinitionId !== "staff.periop_nurse" || employee.facilityTask || !employee.path.length) return;
  if (employee.pathIndex >= employee.path.length - 1) {
    employee.path = [];
    employee.pathIndex = 0;
    return;
  }
  const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId);
  const definition = home && getRoomDefinition(home.roomDefinitionId, context);
  if (!home || !definition || !getRoomNavigableTiles(home, definition, state.doors).some((point) => samePoint(point, employee.location))) return;
  const remaining = [{ ...employee.location }, ...employee.path.slice(employee.pathIndex + 1)];
  const allowed = new Set([home.id]);
  // Approved corner doors have direct diagonal clearance bridges. Use the
  // actual facility graph rather than assuming every edge is cardinal.
  const stale = !samePoint(employee.path[employee.pathIndex]!, employee.location) || remaining.slice(1).some((point, index) =>
    findCareAwareFacilityPath(state, context, remaining[index]!, point, allowed).length !== 2);
  if (stale) {
    employee.path = [];
    employee.pathIndex = 0;
  }
}

function employeeAuthorizedCareRooms(
  state: GameState,
  employee: EmployeeState,
): Set<string> {
  const allowed = new Set<string>();
  if (employee.homeRoomInstanceId) allowed.add(employee.homeRoomInstanceId);
  const task = employee.facilityTask;
  if (!task) return allowed;

  if (task.kind === "periop_attention") {
    const operation = state.serviceOperations.find((candidate) => candidate.id === task.targetId);
    if (operation?.periopBedReservation && operation.periopNurseAttention?.tasks.some((attention) => attention.employeeId === employee.id)) {
      allowed.add(operation.periopBedReservation.roomInstanceId);
    }
    return allowed;
  }

  if (task.kind === "clean_room" || task.kind === "cover_periop" ||
      task.kind === "take_break" || task.kind === "repair_room") {
    if (task.targetId && state.rooms.some((room) => room.id === task.targetId)) {
      allowed.add(task.targetId);
    }
    return allowed;
  }
  if (task.kind === "collect_litter") {
    const litter = state.environment.litterItems.find((item) => item.id === task.targetId);
    if (litter) allowed.add(litter.roomId);
    return allowed;
  }
  if (task.kind !== "perform_imaging" && task.kind !== "perform_service") {
    return allowed;
  }

  const operation = state.serviceOperations.find((candidate) => candidate.id === task.targetId);
  const assignedToOperation = operation && (
    operation.reservedEmployeeIds.includes(employee.id) ||
    (operation.providerReservation?.kind === "employee" &&
      operation.providerReservation.employeeId === employee.id)
  );
  if (operation && assignedToOperation) {
    for (const roomId of operation.reservedRoomInstanceIds) allowed.add(roomId);
    for (const roomId of operation.transitionHeldRoomInstanceIds ?? []) allowed.add(roomId);
    if (operation.periopBedReservation) {
      allowed.add(operation.periopBedReservation.roomInstanceId);
    }
  }

  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (!pending || pending.operationId !== task.targetId) continue;
    const assignedToPending =
      pending.imagingTechnicianId === employee.id ||
      pending.phlebotomistId === employee.id ||
      (pending.providerReservation?.kind === "employee" &&
        pending.providerReservation.employeeId === employee.id);
    if (!assignedToPending) continue;
    const destinationRoomId = pending.patientTravel?.destinationRoomInstanceId;
    if (destinationRoomId) allowed.add(destinationRoomId);
    if (pending.patientRemainsOnsite && encounter.assignedRoomInstanceId) {
      allowed.add(encounter.assignedRoomInstanceId);
    }
  }
  return allowed;
}

function employeeHomeTarget(
  state: GameState,
  employee: EmployeeState,
  context: DomainContext,
): GridPoint | null {
  const fixedStation = getRadiologistReadingStation(state, employee, context)?.location ??
    getGlp1NursePractitionerStation(state, employee, context);
  if (fixedStation) return fixedStation;
  const room = employee.homeRoomInstanceId
    ? state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId)
    : null;
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  return room && definition
    ? getRoomNavigationAnchor(room, definition, "staff")
    : null;
}

function directPendingTaskTarget(
  state: GameState,
  employee: EmployeeState,
  context: DomainContext,
): GridPoint | null {
  const task = employee.facilityTask;
  if (!task || (task.kind !== "perform_imaging" && task.kind !== "perform_service")) {
    return null;
  }
  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (!pending || pending.operationId !== task.targetId) continue;
    const assigned =
      pending.imagingTechnicianId === employee.id ||
      pending.phlebotomistId === employee.id ||
      (pending.providerReservation?.kind === "employee" &&
        pending.providerReservation.employeeId === employee.id);
    if (!assigned) continue;
    const roomId = pending.patientTravel?.destinationRoomInstanceId ??
      (pending.patientRemainsOnsite ? encounter.assignedRoomInstanceId : null);
    const room = roomId
      ? state.rooms.find((candidate) => candidate.id === roomId)
      : null;
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    if (!room || !definition) return null;
    return pending.phlebotomistId === employee.id
      ? getRoomCareAnchor(room, definition, "clinician")
      : getRoomNavigationAnchor(room, definition, "staff");
  }
  return null;
}

function shortestPublicEgress(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
): GridPoint[] {
  return state.rooms
    .filter((room) => !isProtectedCareRoom(room))
    .flatMap((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      return definition
        ? getRoomNavigableTiles(room, definition, state.doors)
            .map((target) => ({
              target,
              path: findCareAwareFacilityPath(state, context, start, target),
            }))
            .filter(({ target, path }) =>
              path.length > 0 && samePoint(path.at(-1)!, target)
            )
            .map(({ path }) => path)
        : [];
    })
    .sort((left, right) => left.length - right.length)[0] ?? [];
}

function reconcileEmployeeCareRoomRoute(
  state: GameState,
  employee: EmployeeState,
  context: DomainContext,
): boolean {
  const allowed = employeeAuthorizedCareRooms(state, employee);
  const currentRoom = protectedCareRoomAtPoint(state, context, employee.location);
  const standsInUnauthorizedRoom = Boolean(currentRoom && !allowed.has(currentRoom.id));
  const routeIsUnauthorized = employee.path.length > 0 &&
    pathEntersUnauthorizedProtectedRoom(
      state,
      context,
      employee.path,
      employee.pathIndex,
      allowed,
    );
  if (!standsInUnauthorizedRoom && !routeIsUnauthorized) {
    if (employee.pathIndex < employee.path.length - 1) return false;
    const taskTarget = directPendingTaskTarget(state, employee, context);
    if (!taskTarget || samePoint(employee.location, taskTarget)) return false;
    const retried = findCareAwareFacilityPath(
      state,
      context,
      employee.location,
      taskTarget,
      allowed,
    );
    if (retried.length <= 1) return false;
    employee.path = retried;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    return true;
  }
  if (standsInUnauthorizedRoom && !routeIsUnauthorized &&
      employee.pathIndex < employee.path.length - 1) {
    return false;
  }

  let repaired: GridPoint[] = [];
  if (employee.facilityTask && routeIsUnauthorized) {
    const target = employee.path.at(-1);
    if (target) {
      repaired = findCareAwareFacilityPath(
        state,
        context,
        employee.location,
        target,
        allowed,
      );
      if (repaired.length <= 1) repaired = [];
    }
  }
  if (repaired.length === 0) {
    const homeTarget = employeeHomeTarget(state, employee, context);
    if (homeTarget) {
      repaired = findCareAwareFacilityPath(
        state,
        context,
        employee.location,
        homeTarget,
        employee.homeRoomInstanceId
          ? new Set([employee.homeRoomInstanceId])
          : new Set(),
      );
    }
  }
  if (repaired.length === 0) {
    repaired = shortestPublicEgress(state, context, employee.location);
  }
  employee.path = repaired.length > 0 ? repaired : [{ ...employee.location }];
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = state.facilityTick;
  return true;
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
  reconcileImagingIdleSeats(state);
  reconcileReadingStations(state);
  const interval = context.balanceRelease.facility.staffMovementIntervalTicks;
  if (state.facilityTick === 0) {
    return;
  }

  for (const employee of state.employees) {
    // Training owns its protected travel, seated work and return lifecycle.
    if (isEmployeeAwayForTraining(employee)) continue;
    if (reconcileEmployeeCareRoomRoute(state, employee, context)) {
      continue;
    }
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
    discardStaleIdlePeriopPath(state, employee, context);
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
    // Reading chairs are valid endpoints even when excluded from walking
    // clearance. A seated reader must not be displaced to the room's first desk.
    const readingStation = getRadiologistReadingStation(state, employee, context);
    const standsInBuiltRoom = Boolean(readingStation && samePoint(employee.location, readingStation.location)) || state.rooms.some((room) => {
      const roomDefinition = getRoomDefinition(room.roomDefinitionId, context);
      return Boolean(roomDefinition && getRoomNavigableTiles(room, roomDefinition, state.doors).some(
        (point) => samePoint(point, employee.location),
      ));
    });
    const standsInAssignedImagingRoom = employee.staffRoleDefinitionId !== "staff.imaging_technician" ||
      !employee.homeRoomInstanceId || (() => {
        const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId);
        const definition = home ? getRoomDefinition(home.roomDefinitionId, context) : null;
        return Boolean(home && definition && getRoomNavigableTiles(home, definition, state.doors).some(
          (point) => samePoint(point, employee.location),
        ));
      })();
    if ((!standsInBuiltRoom || !standsInAssignedImagingRoom) && employee.homeRoomInstanceId) {
      const displacedPath = findRouteFromDisplacedLocationToRoom(
        state,
        context,
        employee.location,
        employee.homeRoomInstanceId,
      );
      if (displacedPath.length > 1) {
        employee.path = displacedPath;
        employee.pathIndex = 0;
        employee.lastMovedAtFacilityTick = state.facilityTick;
        continue;
      }
    }
    // Reception, radiologists and GLP-1 NPs are fixed posts. The water-
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
      : readingStation?.location ??
        getGlp1NursePractitionerStation(state, employee, context);
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
        const path = findCareAwareFacilityPath(state, context, employee.location, fixedStation, new Set([homeRoom.id]));
        if (path.length > 1) {
          employee.path = path;
          employee.pathIndex = 0;
          employee.lastMovedAtFacilityTick = state.facilityTick;
          continue;
        }
      }
    }
    if (settleIdlePeriopNurse(state, employee, context)) continue;
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
    const target = chooseIdleTarget(state, employee, homeRoom, candidates);
    const path = findCareAwareFacilityPath(state, context, employee.location, target, new Set([homeRoom.id]));
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
  const availableConfiguredRoom = getAvailableEmployeeHomeRoom(state, employeeRoleId);
  if (availableConfiguredRoom) {
    const definition = getRoomDefinition(availableConfiguredRoom.roomDefinitionId, context);
    if (definition) {
      const assignedCount = state.employees.filter(
        (employee) => employee.staffRoleDefinitionId === employeeRoleId && employee.homeRoomInstanceId === availableConfiguredRoom.id,
      ).length;
      return {
        homeRoomInstanceId: availableConfiguredRoom.id,
        location: (employeeRoleId === "staff.radiologist"
          ? getNextReadingStationLocation(state, availableConfiguredRoom.id, context) : null) ?? getRoomNavigationAnchor(
          availableConfiguredRoom,
          definition,
          assignedCount === 0 ? "staff" : "primary",
        ),
      };
    }
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
  const homes = [getEmployeeHomeLocation(state, employeeRoleId, context)];
  for (const home of homes) {
    const homeRoom = state.rooms.find((room) => room.id === home.homeRoomInstanceId);
    const homeDefinition = homeRoom
      ? getRoomDefinition(homeRoom.roomDefinitionId, context)
      : null;
    if (!homeRoom || !homeDefinition) continue;
    const internalPath = findCareAwareFacilityPath(state, context, entryDoor, homeRoom.id === entryRoom.id ? entryCenter : home.location, new Set([homeRoom.id]));
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
