import {
  SERVICE_INCOME_CATALOG,
  getServiceIncomeLine,
  type ServiceIncomeLine,
  type ServiceOperationPhase,
} from "@gamify-surgery/balance-config";
import { createPatientDisplayName, createPatientPixelAppearance, getPresentPatientDisplayNames } from "./appearance";
import { getDoorCells } from "./doors";
import {
  getCurrentCapabilities,
  getRoomDefinition,
  isEmployeeAssignedToOperationalRoom,
  isEmployeeOperational,
  isRoomOperationalForFacilityWork,
} from "./selectors";
import { findDeterministicFacilityPath, getRoomCareAnchor, getRoomNavigationAnchor } from "./spatial";
import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import type {
  DomainContext,
  EncounterState,
  GameState,
  GridPoint,
  ServiceOperationState,
} from "./types";

const WAIT_TIMEOUT_MINUTES = 60;
const GLOBAL_ARRIVAL_SPACING_MINUTES = 30;
const MAX_EXTERNAL_WAITING = 2;

function samePoint(left: GridPoint | null, right: GridPoint | null): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

function active(operation: ServiceOperationState): boolean {
  return operation.status !== "completed" && operation.status !== "cancelled";
}

export function getActiveServiceOperationRoomIds(state: GameState): Set<string> {
  return new Set(state.serviceOperations.filter(active).flatMap((operation) => operation.reservedRoomInstanceIds));
}

export function getActiveServiceOperationEmployeeIds(state: GameState): Set<string> {
  return new Set(state.serviceOperations.filter(active).flatMap((operation) => [
    ...operation.reservedEmployeeIds,
    ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : []),
  ]));
}

export function founderHasActiveServiceOperation(state: GameState): boolean {
  return state.serviceOperations.some(
    (operation) => active(operation) && operation.providerReservation?.kind === "founder",
  );
}

export function encounterHasActiveServiceOperation(state: GameState, encounterId: string): boolean {
  return state.serviceOperations.some(
    (operation) => active(operation) && operation.actorKind === "encounter" && operation.actorId === encounterId,
  );
}

function getEntrance(state: GameState, context: DomainContext): { inside: GridPoint; outside: GridPoint } | null {
  for (const door of [...state.doors].filter((candidate) => candidate.exterior).sort((a, b) => a.id.localeCompare(b.id))) {
    const room = state.rooms.find((candidate) => candidate.id === door.roomId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    const cells = room && definition ? getDoorCells(door, room, definition) : null;
    if (cells) return cells;
  }
  return null;
}

function joinPaths(...paths: readonly GridPoint[][]): GridPoint[] {
  const joined: GridPoint[] = [];
  for (const path of paths) {
    for (const point of path) {
      const previous = joined.at(-1);
      if (!previous || previous.x !== point.x || previous.y !== point.y) joined.push({ ...point });
    }
  }
  return joined;
}

export function straightServiceVisitorSidewalkPath(start: GridPoint, goal: GridPoint): GridPoint[] {
  const path: GridPoint[] = [{ ...start }];
  let cursor = { ...start };
  while (cursor.x !== goal.x) {
    cursor = { x: cursor.x + Math.sign(goal.x - cursor.x), y: cursor.y };
    path.push(cursor);
  }
  while (cursor.y !== goal.y) {
    cursor = { x: cursor.x, y: cursor.y + Math.sign(goal.y - cursor.y) };
    path.push(cursor);
  }
  return path;
}

function visitorOffscreenEndpoint(
  state: GameState,
  context: DomainContext,
  operationId: string,
): GridPoint | null {
  const entrance = getEntrance(state, context);
  if (!entrance) return null;
  const leftSide = deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.routineArrivalTiming,
    `${operationId}:sidewalk-direction.v1`,
    2,
  ) === 0;
  return {
    x: leftSide ? -2 : context.balanceRelease.facility.gridWidth + 1,
    y: entrance.outside.y,
  };
}

export function pathServiceVisitorFromCurrentLocation(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  target: GridPoint,
): GridPoint[] {
  const entrance = getEntrance(state, context);
  if (!entrance) return [];
  const outside = start.y >= context.balanceRelease.facility.gridHeight;
  if (outside) {
    const internal = findDeterministicFacilityPath(
      entrance.inside,
      target,
      state.rooms,
      state.doors,
      (id) => getRoomDefinition(id, context),
    );
    return internal.length > 0
      ? joinPaths(straightServiceVisitorSidewalkPath(start, entrance.outside), [entrance.inside], internal)
      : [];
  }
  return findDeterministicFacilityPath(
    start,
    target,
    state.rooms,
    state.doors,
    (id) => getRoomDefinition(id, context),
  );
}

export function pathServiceVisitorToOffscreenEndpoint(
  state: GameState,
  context: DomainContext,
  start: GridPoint | null,
  endpoint: GridPoint,
): GridPoint[] {
  const entrance = getEntrance(state, context);
  if (!entrance || !start) return [];
  if (start.y >= context.balanceRelease.facility.gridHeight) {
    return straightServiceVisitorSidewalkPath(start, endpoint);
  }
  const internal = findDeterministicFacilityPath(
    start,
    entrance.inside,
    state.rooms,
    state.doors,
    (id) => getRoomDefinition(id, context),
  );
  return internal.length > 0
    ? joinPaths(internal, [entrance.outside], straightServiceVisitorSidewalkPath(entrance.outside, endpoint))
    : [];
}

function hasActiveClinicalResourcePhase(encounter: EncounterState, facilityTick: number): boolean {
  const pending = encounter.pendingResult;
  return Boolean(
    pending &&
      pending.deliveredAtTick === null &&
      (encounter.steps[pending.originatingNodeIndex]?.status === "feedback_pending" ||
        !(pending.timingPhases?.length) ||
        pending.timingPhases.some(
          (phase) => phase.resourceBound && facilityTick < phase.endsAtTick,
        )),
  );
}

export interface ClinicalResourceReservations {
  roomIds: Set<string>;
  roomDefinitionCounts: Map<string, number>;
  employeeIds: Set<string>;
  staffRoleCounts: Map<string, number>;
  founderReserved: boolean;
}

export type EncounterDeparturePlanner = (
  state: GameState,
  encounter: EncounterState,
  start: GridPoint,
) => GridPoint[];

function incrementCount(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

export function getClinicalResourceReservations(state: GameState, context: DomainContext): ClinicalResourceReservations {
  const result: ClinicalResourceReservations = {
    roomIds: new Set(),
    roomDefinitionCounts: new Map(),
    employeeIds: new Set(),
    staffRoleCounts: new Map(),
    founderReserved: false,
  };
  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (!pending || !hasActiveClinicalResourcePhase(encounter, state.facilityTick)) continue;
    const resources = pending.resourceReservations ??
      context.balanceRelease.services
        .flatMap((service) => service.routes)
        .find((route) => route.id === pending.routeId)?.resourceRequirements ?? [];
    const concreteRoomId = pending.patientTravel?.destinationRoomInstanceId ?? null;
    const concreteRoomDefinitionId = concreteRoomId
      ? state.rooms.find((room) => room.id === concreteRoomId)?.roomDefinitionId ?? null
      : null;
    if (concreteRoomId) result.roomIds.add(concreteRoomId);
    if (pending.imagingTechnicianId) result.employeeIds.add(pending.imagingTechnicianId);
    if (pending.phlebotomistId) result.employeeIds.add(pending.phlebotomistId);
    if (pending.providerReservation?.kind === "employee") {
      result.employeeIds.add(pending.providerReservation.employeeId);
    } else if (pending.providerReservation?.kind === "founder") {
      result.founderReserved = true;
    }
    for (const resource of resources) {
      if (resource.roomDefinitionId !== concreteRoomDefinitionId) {
        incrementCount(result.roomDefinitionCounts, resource.roomDefinitionId);
      }
      if (!resource.staffRoleDefinitionId) continue;
      const concreteEmployeeForRole = [
        pending.imagingTechnicianId,
        pending.phlebotomistId,
        pending.providerReservation?.kind === "employee"
          ? pending.providerReservation.employeeId
          : null,
      ].some((employeeId) =>
        state.employees.some(
          (employee) =>
            employee.id === employeeId &&
            employee.staffRoleDefinitionId === resource.staffRoleDefinitionId,
        ),
      );
      if (!concreteEmployeeForRole) {
        incrementCount(result.staffRoleCounts, resource.staffRoleDefinitionId);
      }
    }
  }
  return result;
}

function requiredRoomDefinitions(phases: readonly ServiceOperationPhase[]): string[] {
  return [...new Set(phases.flatMap((phase) => phase.roomDefinitionId ? [phase.roomDefinitionId] : []))];
}

function requiredStaffRoles(phases: readonly ServiceOperationPhase[]): string[] {
  return [...new Set(phases.flatMap((phase) => phase.staffRoleDefinitionIds))];
}

function isServiceEmployeeOperational(
  state: GameState,
  employeeId: string,
  roleId: string,
  context: DomainContext,
): boolean {
  return roleId === "staff.imaging_technician"
    ? isEmployeeAssignedToOperationalRoom(state, employeeId, context)
    : isEmployeeOperational(state, employeeId, context);
}

function installedAndOperational(state: GameState, line: ServiceIncomeLine, context: DomainContext): boolean {
  if (!line.operation || state.facilityLevel < line.minimumFacilityLevel) return false;
  const phases = line.operation.phases;
  const capabilities = getCurrentCapabilities(state, context);
  if (!line.requiredCapabilityIds.every((capability) => capabilities.has(capability))) return false;
  if (!requiredRoomDefinitions(phases).every((definitionId) => state.rooms.some(
    (room) => room.roomDefinitionId === definitionId && isRoomOperationalForFacilityWork(state, room.id, context),
  ))) return false;
  if (!requiredStaffRoles(phases).every((roleId) => state.employees.some(
    (employee) => employee.staffRoleDefinitionId === roleId &&
      isServiceEmployeeOperational(state, employee.id, roleId, context),
  ))) return false;
  const providerPhase = phases.find(
    (phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible,
  );
  return !providerPhase || Boolean(
    providerPhase.founderEligible || state.employees.some(
      (employee) =>
        providerPhase.providerRoleDefinitionIds?.includes(employee.staffRoleDefinitionId) &&
        isEmployeeOperational(state, employee.id, context),
    ),
  );
}

function phaseForEmployee(phases: readonly ServiceOperationPhase[], roleId: string): ServiceOperationPhase | null {
  return phases.find((phase) => phase.staffRoleDefinitionIds.includes(roleId)) ?? null;
}

function operationPhases(operation: ServiceOperationState, line: ServiceIncomeLine): readonly ServiceOperationPhase[] {
  return operation.frozenOperationPhases ?? line.operation?.phases ?? [];
}

function tryReserve(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, context: DomainContext): boolean {
  const phases = operationPhases(operation, line);
  const clinical = getClinicalResourceReservations(state, context);
  const usedRooms = getActiveServiceOperationRoomIds(state);
  const rooms = requiredRoomDefinitions(phases).map((definitionId) => {
    const available = state.rooms
      .filter((room) => room.roomDefinitionId === definitionId &&
        !usedRooms.has(room.id) &&
        !clinical.roomIds.has(room.id) &&
        isRoomOperationalForFacilityWork(state, room.id, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    return available[clinical.roomDefinitionCounts.get(definitionId) ?? 0] ?? null;
  });
  if (rooms.some((room) => room === null)) return false;

  const usedEmployees = getActiveServiceOperationEmployeeIds(state);
  const selectedEmployees: string[] = [];
  for (const roleId of requiredStaffRoles(phases)) {
    const available = state.employees
      .filter((candidate) => candidate.staffRoleDefinitionId === roleId && !candidate.facilityTask && !clinical.employeeIds.has(candidate.id) && !usedEmployees.has(candidate.id) && !selectedEmployees.includes(candidate.id) && isServiceEmployeeOperational(state, candidate.id, roleId, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    const employee = available[clinical.staffRoleCounts.get(roleId) ?? 0];
    if (!employee) return false;
    selectedEmployees.push(employee.id);
  }

  const providerPhase = phases.find((phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible);
  let provider: ServiceOperationState["providerReservation"] = null;
  if (providerPhase) {
    const providerEmployee = state.employees
      .filter((candidate) => providerPhase.providerRoleDefinitionIds?.includes(candidate.staffRoleDefinitionId) && !candidate.facilityTask && !clinical.employeeIds.has(candidate.id) && !usedEmployees.has(candidate.id) && !selectedEmployees.includes(candidate.id) && isEmployeeOperational(state, candidate.id, context))
      .sort((a, b) => a.id.localeCompare(b.id))[0];
    if (providerEmployee) provider = { kind: "employee", employeeId: providerEmployee.id };
    else if (
      providerPhase.founderEligible &&
      (state.environment.founderActivity === null ||
        ["return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(
          state.environment.founderActivity.kind,
        )) &&
      !clinical.founderReserved &&
      !founderHasActiveServiceOperation(state)
    ) provider = { kind: "founder" };
    else return false;
  }

  const firstRoom = rooms[0];
  if (!firstRoom) return false;
  const firstDefinition = getRoomDefinition(firstRoom.roomDefinitionId, context)!;
  const patientTarget = firstRoom.roomDefinitionId === "room.phlebotomy"
    ? getRoomCareAnchor(firstRoom, firstDefinition, "patient")
    : getRoomNavigationAnchor(firstRoom, firstDefinition, "primary");
  let actorPath: GridPoint[] = [];
  if (operation.actorKind !== "remote") {
    actorPath = operation.location
      ? operation.actorKind === "visitor"
        ? pathServiceVisitorFromCurrentLocation(state, context, operation.location, patientTarget)
        : findDeterministicFacilityPath(operation.location, patientTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context))
      : [];
    if (actorPath.length === 0) return false;
  }

  const employeePlans = selectedEmployees.map((employeeId) => {
    const employee = state.employees.find((candidate) => candidate.id === employeeId)!;
    const employeePhase = phaseForEmployee(phases, employee.staffRoleDefinitionId)!;
    const targetRoom = rooms.find((room) => room?.roomDefinitionId === employeePhase.roomDefinitionId)!;
    const targetDefinition = getRoomDefinition(targetRoom.roomDefinitionId, context)!;
    const staffTarget = employee.staffRoleDefinitionId === "staff.phlebotomist" &&
      targetRoom.roomDefinitionId === "room.phlebotomy"
      ? getRoomCareAnchor(targetRoom, targetDefinition, "clinician")
      : getRoomNavigationAnchor(targetRoom, targetDefinition, "staff");
    const path = findDeterministicFacilityPath(employee.location, staffTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    return { employee, path };
  });
  if (employeePlans.some((plan) => plan.path.length === 0)) return false;
  let providerEmployeePlan: { employee: GameState["employees"][number]; path: GridPoint[] } | null = null;
  let founderPath: GridPoint[] | null = null;
  const providerRoom = providerPhase?.roomDefinitionId
    ? rooms.find((room) => room?.roomDefinitionId === providerPhase.roomDefinitionId) ?? firstRoom
    : firstRoom;
  const providerDefinition = getRoomDefinition(providerRoom.roomDefinitionId, context)!;
  const providerTarget = getRoomNavigationAnchor(providerRoom, providerDefinition, "staff");
  if (provider?.kind === "employee") {
    const employee = state.employees.find((candidate) => candidate.id === provider.employeeId)!;
    const path = findDeterministicFacilityPath(employee.location, providerTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    if (path.length === 0) return false;
    providerEmployeePlan = { employee, path };
  } else if (provider?.kind === "founder") {
    founderPath = findDeterministicFacilityPath(state.environment.founderLocation, providerTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    if (founderPath.length === 0) return false;
  }

  operation.reservedRoomInstanceIds = rooms.map((room) => room!.id);
  operation.reservedEmployeeIds = selectedEmployees;
  operation.providerReservation = provider;
  operation.path = actorPath;
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  operation.status = "walking_to_service";
  if (operation.actorKind === "encounter") {
    const encounter = state.encounters[operation.actorId];
    if (encounter) encounter.waitingDestination = null;
  }
  for (const employeeId of [...selectedEmployees, ...(provider?.kind === "employee" ? [provider.employeeId] : [])]) preemptEmployeeShopping(state, employeeId);
  for (const { employee, path } of employeePlans) {
    employee.path = path;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.facilityTask = { kind: "perform_service", targetId: operation.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
  }
  if (providerEmployeePlan) {
    const { employee, path } = providerEmployeePlan;
    employee.path = path;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.facilityTask = { kind: "perform_service", targetId: operation.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
  } else if (founderPath) {
    state.environment.founderActivity = { kind: "perform_service", targetId: operation.id, path: founderPath, pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
  }
  return true;
}

function operationLocation(state: GameState, operation: ServiceOperationState): GridPoint | null {
  return operation.actorKind === "encounter"
    ? state.encounters[operation.actorId]?.patientLocation ?? operation.location
    : operation.location;
}

function holdResolvedEncounterForActiveOperation(
  state: GameState,
  operation: ServiceOperationState,
): void {
  if (operation.actorKind !== "encounter") return;
  const encounter = state.encounters[operation.actorId];
  if (!encounter) return;
  const cancelledDeparture = encounter.patientMovement?.kind === "leaving_after_resolution";
  if (cancelledDeparture) {
    encounter.patientMovement = null;
    if (operation.location) encounter.patientLocation = { ...operation.location };
  }
  if (operation.status === "waiting_for_resources" && !cancelledDeparture) {
    operation.location = encounter.patientLocation
      ? { ...encounter.patientLocation }
      : operation.location;
    return;
  }
  if (operation.location) {
    encounter.patientLocation = { ...operation.location };
  }
}

type WaitingDestinationPlanner = (
  state: GameState,
  encounter: EncounterState,
) => {
  roomId: string | null;
  path: GridPoint[];
  reservation: EncounterState["waitingDestination"];
};

function routeResolvedEncounterToWaiting(
  state: GameState,
  encounter: EncounterState,
  planner: WaitingDestinationPlanner,
): void {
  const destination = planner(state, encounter);
  if (!destination.reservation || destination.path.length === 0) return;
  encounter.waitingDestination = destination.reservation;
  encounter.assignedRoomInstanceId = null;
  encounter.queuedCareRoomInstanceId = null;
  encounter.patientMovement = destination.path.length > 1
    ? {
        kind: "walking_to_waiting",
        path: destination.path.map((point) => ({ ...point })),
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        destinationRoomInstanceId: destination.roomId,
      }
    : null;
}

function startResolvedEncounterDeparture(
  state: GameState,
  operation: ServiceOperationState,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): boolean {
  if (operation.actorKind !== "encounter") return false;
  const encounter = state.encounters[operation.actorId];
  if (
    !encounter ||
    encounter.lifecycle !== "resolved" ||
    encounter.patientMovement !== null ||
    state.serviceOperations.some(
      (candidate) =>
        candidate.id !== operation.id &&
        active(candidate) &&
        candidate.actorKind === "encounter" &&
        candidate.actorId === encounter.id,
    )
  ) {
    return false;
  }
  const location = encounter.patientLocation;
  if (!location) return false;
  const path = departurePlanner?.(state, encounter, location) ?? [];
  if (path.length === 0) return false;
  encounter.assignedRoomInstanceId = null;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.patientMovement = {
    kind: "leaving_after_resolution",
    path: path.map((point) => ({ ...point })),
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    destinationRoomInstanceId: null,
  };
  return true;
}

function setOperationLocation(state: GameState, operation: ServiceOperationState, location: GridPoint): void {
  operation.location = { ...location };
  if (operation.actorKind === "encounter" && state.encounters[operation.actorId]) {
    state.encounters[operation.actorId]!.patientLocation = { ...location };
  }
}

function advanceActorMovement(state: GameState, operation: ServiceOperationState, context: DomainContext): void {
  if (operation.pathIndex >= operation.path.length - 1) return;
  const elapsed = Math.max(1, state.facilityTick - operation.lastMovedAtFacilityTick);
  operation.pathIndex = Math.min(operation.path.length - 1, operation.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick);
  operation.lastMovedAtFacilityTick = state.facilityTick;
  const location = operation.path[operation.pathIndex];
  if (location) setOperationLocation(state, operation, location);
}

function setOperationPath(
  state: GameState,
  operation: ServiceOperationState,
  path: GridPoint[],
  status: ServiceOperationState["status"],
): void {
  operation.path = path.map((point) => ({ ...point }));
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  operation.status = status;
  const start = operation.path[0];
  if (start) setOperationLocation(state, operation, start);
}

function ensureVisitorTravel(
  state: GameState,
  operation: ServiceOperationState,
  context: DomainContext,
): NonNullable<ServiceOperationState["visitorTravel"]> | null {
  if (operation.actorKind !== "visitor") return null;
  if (!operation.visitorTravel) {
    const endpoint = visitorOffscreenEndpoint(state, context, operation.id);
    if (!endpoint) return null;
    operation.visitorTravel = {
      version: "service-visitor-travel.v1",
      offscreenEndpoint: endpoint,
      // Existing saved visitors continue from their current position. Only new
      // operations are explicitly created in the arriving state.
      arrivedAtFacilityTick: operation.status === "arriving" ? null : operation.createdAtFacilityTick,
    };
  }
  return operation.visitorTravel;
}

function ensureCompleteVisitorDeparture(
  state: GameState,
  operation: ServiceOperationState,
  context: DomainContext,
): void {
  const travel = ensureVisitorTravel(state, operation, context);
  const location = operationLocation(state, operation);
  if (!travel || !location) return;
  const final = operation.path.at(-1);
  if (final && samePoint(final, travel.offscreenEndpoint)) return;
  const continuation = pathServiceVisitorToOffscreenEndpoint(state, context, location, travel.offscreenEndpoint);
  if (continuation.length > 0) setOperationPath(state, operation, continuation, "leaving");
}

function resourcesArrived(state: GameState, operation: ServiceOperationState): boolean {
  const employees = [...operation.reservedEmployeeIds, ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : [])];
  return employees.every((id) => {
    const employee = state.employees.find((candidate) => candidate.id === id);
    return employee?.facilityTask?.targetId === operation.id && employee.pathIndex >= employee.path.length - 1;
  }) && (operation.providerReservation?.kind !== "founder" || (state.environment.founderActivity?.targetId === operation.id && state.environment.founderActivity.pathIndex >= state.environment.founderActivity.path.length - 1));
}

function preemptEmployeeShopping(state: GameState, employeeId: string): void {
  for (const trip of state.retailOperations) {
    if (trip.actorKind === "employee" && trip.actorId === employeeId && trip.status !== "completed" && trip.status !== "cancelled" && trip.status !== "abandoned") {
      trip.status = "cancelled";
      trip.cancellationReason = "Required clinical work superseded optional shopping.";
    }
  }
}

function releaseResources(state: GameState, operation: ServiceOperationState): void {
  for (const employee of state.employees) {
    if (employee.facilityTask?.kind === "perform_service" && employee.facilityTask.targetId === operation.id) employee.facilityTask = null;
  }
  if (state.environment.founderActivity?.kind === "perform_service" && state.environment.founderActivity.targetId === operation.id) state.environment.founderActivity = null;
  operation.reservedEmployeeIds = [];
  operation.reservedRoomInstanceIds = [];
  operation.providerReservation = null;
}

function cancel(
  state: GameState,
  operation: ServiceOperationState,
  reason: string,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  releaseResources(state, operation);
  operation.cancelledAtFacilityTick = state.facilityTick;
  operation.cancellationReason = reason;
  if (operation.actorKind === "visitor") {
    const location = operationLocation(state, operation);
    const travel = ensureVisitorTravel(state, operation, context);
    const path = travel ? pathServiceVisitorToOffscreenEndpoint(state, context, location, travel.offscreenEndpoint) : [];
    setOperationPath(state, operation, path, "leaving");
  } else if (
    operation.actorKind === "encounter" &&
    (operation.testChoiceOrder?.purpose === "continuation" ||
      operation.testChoiceOrder?.purpose === "staged_result_component")
  ) {
    operation.status = "cancelled";
  } else if (operation.actorKind === "encounter") {
    operation.status = "leaving";
    if (startResolvedEncounterDeparture(state, operation, context, departurePlanner)) {
      operation.status = "cancelled";
    }
  } else {
    operation.status = "cancelled";
  }
}

function validateReservedResources(state: GameState, operation: ServiceOperationState, context: DomainContext): boolean {
  return operation.reservedRoomInstanceIds.every((id) => isRoomOperationalForFacilityWork(state, id, context)) &&
    [...operation.reservedEmployeeIds, ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : [])].every((id) => state.employees.some((employee) => employee.id === id && employee.facilityTask?.targetId === operation.id)) &&
    (operation.providerReservation?.kind !== "founder" || state.environment.founderActivity?.targetId === operation.id);
}

function credit(state: GameState, operation: ServiceOperationState): void {
  const transactionKey = `income.service-operation.${operation.id}.${operation.incomeLineId}`;
  if (state.serviceIncomeReceipts.some((receipt) => receipt.transactionKey === transactionKey)) return;
  const displayAnchor = operation.actorKind === "remote"
    ? operation.providerReservation?.kind === "employee"
      ? { actorKind: "employee" as const, actorId: operation.providerReservation.employeeId }
      : operation.providerReservation?.kind === "founder"
        ? { actorKind: "founder" as const, actorId: "founder" as const }
        : operation.reservedEmployeeIds[0]
          ? { actorKind: "employee" as const, actorId: operation.reservedEmployeeIds[0] }
          : undefined
    : undefined;
  state.serviceIncomeReceipts.push({ id: `${transactionKey}.${state.nextServiceIncomeReceiptSequence++}`, transactionKey, incomeLineId: operation.incomeLineId, catalogVersion: 1, routeId: null, actorKind: operation.actorKind === "encounter" ? "patient" : operation.actorKind === "visitor" ? "visitor" : "remote", actorId: operation.actorId, ...(displayAnchor ? { displayAnchor } : {}), grossAmount: operation.quoteFee, stockCost: 0, netCashDelta: operation.quoteFee, completedAtFacilityTick: state.facilityTick });
  state.cashCents = Math.max(0, state.cashCents + Math.round(operation.quoteFee * 100));
  state.cash = state.cashCents / 100;
}

function beginPhase(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine): void {
  const phase = operationPhases(operation, line)[operation.phaseIndex]!;
  operation.status = "in_service";
  operation.phaseStartedAtFacilityTick = state.facilityTick;
  operation.phaseEndsAtFacilityTick = state.facilityTick + phase.durationMinutes;
  if (operation.startedAtFacilityTick === null) operation.startedAtFacilityTick = state.facilityTick;
}

function releaseCompletedPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
): void {
  const phases = operationPhases(operation, line);
  const completedPhase = phases[operation.phaseIndex]!;
  const futurePhases = phases.slice(operation.phaseIndex + 1);
  if (!futurePhases.some((phase) => phase.roomDefinitionId === completedPhase.roomDefinitionId)) {
    operation.reservedRoomInstanceIds = operation.reservedRoomInstanceIds.filter((roomId) =>
      state.rooms.find((room) => room.id === roomId)?.roomDefinitionId !== completedPhase.roomDefinitionId,
    );
  }
  const completedRoles = new Set(completedPhase.staffRoleDefinitionIds);
  for (const employeeId of [...operation.reservedEmployeeIds]) {
    const employee = state.employees.find((candidate) => candidate.id === employeeId);
    if (!employee || !completedRoles.has(employee.staffRoleDefinitionId)) continue;
    if (futurePhases.some((phase) => phase.staffRoleDefinitionIds.includes(employee.staffRoleDefinitionId))) continue;
    if (employee.facilityTask?.kind === "perform_service" && employee.facilityTask.targetId === operation.id) {
      employee.facilityTask = null;
    }
    operation.reservedEmployeeIds = operation.reservedEmployeeIds.filter((id) => id !== employeeId);
  }
  if (completedPhase.providerRoleDefinitionIds?.length || completedPhase.founderEligible) {
    if (operation.providerReservation?.kind === "employee") {
      const providerId = operation.providerReservation.employeeId;
      const employee = state.employees.find((candidate) => candidate.id === providerId);
      if (employee?.facilityTask?.kind === "perform_service" && employee.facilityTask.targetId === operation.id) employee.facilityTask = null;
    } else if (state.environment.founderActivity?.kind === "perform_service" && state.environment.founderActivity.targetId === operation.id) {
      state.environment.founderActivity = null;
    }
    operation.providerReservation = null;
  }
}

function moveToNextPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  const nextPhase = operationPhases(operation, line)[operation.phaseIndex + 1];
  if (!nextPhase) {
    credit(state, operation);
    releaseCompletedPhase(state, operation, line);
    operation.phaseIndex += 1;
    releaseResources(state, operation);
    operation.completedAtFacilityTick = state.facilityTick;
    if (operation.actorKind === "visitor") {
      const location = operationLocation(state, operation);
      const travel = ensureVisitorTravel(state, operation, context);
      const path = travel ? pathServiceVisitorToOffscreenEndpoint(state, context, location, travel.offscreenEndpoint) : [];
      setOperationPath(state, operation, path, "leaving");
    } else if (
      operation.actorKind === "encounter" &&
      (operation.testChoiceOrder?.purpose === "continuation" ||
        operation.testChoiceOrder?.purpose === "staged_result_component")
    ) {
      operation.status = "completed";
    } else if (operation.actorKind === "encounter") {
      operation.status = "leaving";
      if (startResolvedEncounterDeparture(state, operation, context, departurePlanner)) {
        operation.status = "completed";
      }
    } else {
      operation.status = "completed";
    }
    return;
  }
  releaseCompletedPhase(state, operation, line);
  operation.phaseIndex += 1;
  const phase = nextPhase;
  const roomId = operation.reservedRoomInstanceIds.find((id) => state.rooms.find((room) => room.id === id)?.roomDefinitionId === phase.roomDefinitionId);
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  const location = operationLocation(state, operation);
  if (!room || !definition || !location) { cancel(state, operation, "The next service phase became unavailable.", context, departurePlanner); return; }
  operation.path = findDeterministicFacilityPath(location, getRoomNavigationAnchor(room, definition, "primary"), state.rooms, state.doors, (id) => getRoomDefinition(id, context));
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  operation.status = "walking_between_phases";
  operation.phaseStartedAtFacilityTick = null;
  operation.phaseEndsAtFacilityTick = null;
}

function createOperation(state: GameState, line: ServiceIncomeLine, actorKind: "visitor" | "encounter" | "remote", actorId?: string, encounter?: EncounterState, context?: DomainContext): ServiceOperationState | null {
  const id = `service-operation.${state.serviceOperationSequence++}`;
  const entrance = context ? getEntrance(state, context) : null;
  if (actorKind === "visitor" && !entrance) return null;
  const actualActorId = actorId ?? id;
  const excludedDisplayNames = getPresentPatientDisplayNames(state);
  const endpoint = actorKind === "visitor" && context ? visitorOffscreenEndpoint(state, context, id) : null;
  const arrivalPath = actorKind === "visitor" && endpoint && entrance
    ? joinPaths(straightServiceVisitorSidewalkPath(endpoint, entrance.outside), [entrance.inside])
    : [];
  return { id, incomeLineId: line.id, catalogVersion: 1, actorKind, actorId: actualActorId, displayName: encounter?.patientDisplayName ?? (actorKind === "visitor" ? createPatientDisplayName(state.campaignSeed, actualActorId, undefined, excludedDisplayNames) : line.displayName), appearance: encounter?.patientAppearance ?? (actorKind === "visitor" ? createPatientPixelAppearance(state.campaignSeed, actualActorId) : null), status: actorKind === "visitor" ? "arriving" : "waiting_for_resources", createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + WAIT_TIMEOUT_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: line.fee, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null, location: actorKind === "visitor" ? endpoint : encounter?.patientLocation ?? entrance?.outside ?? null, path: arrivalPath, pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null, ...(actorKind === "visitor" && endpoint ? { visitorTravel: { version: "service-visitor-travel.v1" as const, offscreenEndpoint: endpoint, arrivedAtFacilityTick: null } } : {}), ...(actorKind === "encounter" ? { resourceQueueVersion: 1 as const } : {}) };
}

export function startServiceOperation(state: GameState, lineId: string, actorKind: "visitor" | "remote", context: DomainContext): string | null {
  const line = getServiceIncomeLine(lineId);
  if (!line?.operation || line.kind === "retail" || !installedAndOperational(state, line, context)) return null;
  if (line.operation.encounterOnly) return null;
  if (
    (actorKind === "remote" && line.operation.visitorMode !== "work_queue") ||
    (actorKind === "visitor" && line.operation.visitorMode === "work_queue")
  ) return null;
  const sameLine = state.serviceOperations.filter(
    (operation) => active(operation) && operation.status !== "leaving" && operation.actorKind === actorKind && operation.incomeLineId === lineId,
  );
  if (sameLine.length >= 2 || sameLine.some((operation) => operation.status === "arriving" || operation.status === "waiting_for_resources")) return null;
  if (
    actorKind === "visitor" &&
    state.serviceOperations.filter((operation) => operation.actorKind === "visitor" && (operation.status === "arriving" || operation.status === "waiting_for_resources")).length >= MAX_EXTERNAL_WAITING
  ) return null;
  const operation = createOperation(state, line, actorKind, undefined, undefined, context);
  if (!operation) return null;
  state.serviceOperations.push(operation);
  return operation.id;
}

export function startEncounterProcedureOperation(state: GameState, encounter: EncounterState, lineId: string, context: DomainContext): boolean {
  const line = getServiceIncomeLine(lineId);
  if (!line?.operation || !installedAndOperational(state, line, context) || encounterHasActiveServiceOperation(state, encounter.id)) return false;
  const operation = createOperation(state, line, "encounter", encounter.id, encounter, context);
  if (!operation) return false;
  encounter.patientMovement = null;
  state.serviceOperations.push(operation);
  return true;
}

export function startEncounterTestOperation(
  state: GameState,
  encounter: EncounterState,
  lineId: string,
  context: DomainContext,
  testChoiceOrder: NonNullable<ServiceOperationState["testChoiceOrder"]>,
): string | null {
  const started = startEncounterProcedureOperation(state, encounter, lineId, context);
  if (!started) return null;
  const operation = [...state.serviceOperations].reverse().find(
    (candidate) =>
      candidate.actorKind === "encounter" &&
      candidate.actorId === encounter.id &&
      candidate.status !== "completed" &&
      candidate.status !== "cancelled",
  );
  if (!operation) return null;
  operation.testChoiceOrder = testChoiceOrder;
  return operation.id;
}

function scheduleArrivals(state: GameState, context: DomainContext): void {
  const dueLines: ServiceIncomeLine[] = [];
  for (const line of SERVICE_INCOME_CATALOG) {
    const cadence = line.operation?.visitorMode === "scheduled" ? line.operation.arrivalCadenceMinutes : null;
    if (!cadence || !state.serviceAppointmentsEnabled || !installedAndOperational(state, line, context)) {
      delete state.nextServiceAppointmentTicks[line.id];
      continue;
    }
    const due = state.nextServiceAppointmentTicks[line.id];
    if (due === undefined) { state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence; continue; }
    if (due > state.facilityTick) continue;
    dueLines.push(line);
  }
  if (state.lastServiceAppointmentArrivalTick !== null && state.facilityTick - state.lastServiceAppointmentArrivalTick < GLOBAL_ARRIVAL_SPACING_MINUTES) return;
  const orderedIds = SERVICE_INCOME_CATALOG.map((line) => line.id);
  dueLines.sort((left, right) =>
    (state.lastServiceAppointmentTicks[left.id] ?? -1) - (state.lastServiceAppointmentTicks[right.id] ?? -1) ||
    orderedIds.indexOf(left.id) - orderedIds.indexOf(right.id),
  );
  for (const line of dueLines) {
    const lineOperations = state.serviceOperations.filter((operation) => active(operation) && operation.status !== "leaving" && operation.incomeLineId === line.id && operation.actorKind === "visitor");
    if (lineOperations.length >= 2 || lineOperations.some((operation) => operation.status === "arriving" || operation.status === "waiting_for_resources") || state.serviceOperations.filter((operation) => operation.actorKind === "visitor" && (operation.status === "arriving" || operation.status === "waiting_for_resources")).length >= MAX_EXTERNAL_WAITING) continue;
    const operation = createOperation(state, line, "visitor", undefined, undefined, context);
    if (operation) {
      state.serviceOperations.push(operation);
      state.lastServiceAppointmentArrivalTick = state.facilityTick;
      state.lastServiceAppointmentLineId = line.id;
      state.lastServiceAppointmentTicks[line.id] = state.facilityTick;
      state.nextServiceAppointmentTicks[line.id] = state.facilityTick + line.operation!.arrivalCadenceMinutes!;
      return;
    }
  }
}

export function advanceServiceOperations(
  state: GameState,
  context: DomainContext,
  waitingPlanner?: WaitingDestinationPlanner,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  scheduleArrivals(state, context);
  for (const operation of state.serviceOperations) {
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.operation) continue;
    if (operation.status === "completed" || operation.status === "cancelled") continue;
    holdResolvedEncounterForActiveOperation(state, operation);
    if (operation.status === "arriving") {
      const travel = ensureVisitorTravel(state, operation, context);
      advanceActorMovement(state, operation, context);
      if (operation.path.length === 0 || operation.pathIndex >= operation.path.length - 1) {
        if (travel) travel.arrivedAtFacilityTick = state.facilityTick;
        operation.status = "waiting_for_resources";
        operation.waitDeadlineFacilityTick = state.facilityTick + WAIT_TIMEOUT_MINUTES;
        operation.path = operation.location ? [{ ...operation.location }] : [];
        operation.pathIndex = 0;
        operation.lastMovedAtFacilityTick = state.facilityTick;
      }
      continue;
    }
    if (operation.status === "leaving") {
      if (operation.actorKind === "encounter") {
        if (startResolvedEncounterDeparture(state, operation, context, departurePlanner)) {
          operation.status = operation.cancelledAtFacilityTick === null
            ? "completed"
            : "cancelled";
        }
        continue;
      }
      ensureCompleteVisitorDeparture(state, operation, context);
      advanceActorMovement(state, operation, context);
      if (operation.path.length === 0 || operation.pathIndex >= operation.path.length - 1) {
        operation.location = null;
        operation.status = operation.cancelledAtFacilityTick === null ? "completed" : "cancelled";
      }
      continue;
    }
    if (operation.status === "waiting_for_resources") {
      if ((operation.actorKind !== "encounter" || operation.resourceQueueVersion !== 1) && state.facilityTick >= operation.waitDeadlineFacilityTick) { cancel(state, operation, "The visitor could not start within 60 minutes.", context, departurePlanner); continue; }
      if (operation.actorKind === "visitor" && state.retailOperations.some((trip) =>
        trip.actorKind === "service_visitor" && trip.actorId === operation.id &&
        trip.status !== "completed" && trip.status !== "cancelled" && trip.status !== "abandoned",
      )) continue;
      if (operation.actorKind === "visitor" && state.serviceOperations.some((candidate) =>
        candidate.id !== operation.id &&
        candidate.actorKind === "visitor" &&
        candidate.incomeLineId === operation.incomeLineId &&
        (candidate.status === "walking_to_service" || candidate.status === "walking_between_phases" || candidate.status === "in_service"),
      )) continue;
      if (
        operation.actorKind === "encounter" &&
        state.encounters[operation.actorId]?.patientMovement !== null
      ) continue;
      if (!tryReserve(state, operation, line, context) && operation.actorKind === "encounter" && waitingPlanner) {
        const encounter = state.encounters[operation.actorId];
        if (encounter && encounter.patientMovement === null && !encounter.waitingDestination) {
          routeResolvedEncounterToWaiting(state, encounter, waitingPlanner);
        }
      }
      continue;
    }
    if (!validateReservedResources(state, operation, context)) { cancel(state, operation, "Required service capacity became unavailable.", context, departurePlanner); continue; }
    if (operation.status === "walking_to_service" || operation.status === "walking_between_phases") {
      advanceActorMovement(state, operation, context);
      if (operation.pathIndex >= operation.path.length - 1 && resourcesArrived(state, operation)) beginPhase(state, operation, line);
      continue;
    }
    if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null && state.facilityTick >= operation.phaseEndsAtFacilityTick) {
      moveToNextPhase(state, operation, line, context, departurePlanner);
      continue;
    }
  }
}
