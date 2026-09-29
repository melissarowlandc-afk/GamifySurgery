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
import { findDeterministicFacilityPath, getRoomCareAnchor, getRoomCareStations, getRoomNavigationAnchor, getRoomSharedStaffAnchor, getRoomWaitingAnchors, getRotatedFootprint } from "./spatial";
import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { hasActivePatientAmenityTrip } from "./patient-amenities";
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
const SCHEDULED_ENDOSCOPY_LINE_IDS = new Set([
  "income.endoscopy",
  "income.advanced_endoscopy",
]);

const PERIOP_PHASE_FLOW_LINE_IDS = new Set([
  "income.endoscopy",
  "income.advanced_endoscopy",
  "income.ambulatory_operation",
  "income.ambulatory_operation_extended",
]);

type FrozenOperationPhase = NonNullable<ServiceOperationState["frozenOperationPhases"]>[number];

function cloneOperationPhase(phase: ServiceOperationPhase): FrozenOperationPhase {
  return {
    id: phase.id,
    roomDefinitionId: phase.roomDefinitionId,
    durationMinutes: phase.durationMinutes,
    staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds],
    ...(phase.providerRoleDefinitionIds
      ? { providerRoleDefinitionIds: [...phase.providerRoleDefinitionIds] }
      : {}),
    ...(phase.founderEligible ? { founderEligible: true as const } : {}),
  };
}

/** Frozen phase contract for newly-created periop-first operations only. */
export function getNewPeriopServiceOperationPhases(
  lineId: string,
  sourcePhases?: readonly ServiceOperationPhase[],
): FrozenOperationPhase[] | null {
  if (!PERIOP_PHASE_FLOW_LINE_IDS.has(lineId)) return null;
  const line = getServiceIncomeLine(lineId);
  const phases = sourcePhases ?? line?.operation?.phases;
  if (!phases || phases.length < 2) return null;
  const recoveryIndex = phases.findIndex(
    (phase) => phase.roomDefinitionId === "room.periop_recovery",
  );
  if (recoveryIndex < 0) return null;
  const recovery = {
    ...cloneOperationPhase(phases[recoveryIndex]!),
    durationMinutes: 60,
    roomStationId: "periop_recovery" as const,
  };
  const prep: FrozenOperationPhase = {
    id: "periop_preparation",
    roomDefinitionId: "room.periop_recovery",
    durationMinutes: 30,
    staffRoleDefinitionIds: ["staff.periop_nurse"],
    roomStationId: "periop_preparation",
  };
  const beforeRecovery = phases.slice(0, recoveryIndex).map(cloneOperationPhase);
  if (lineId === "income.endoscopy" || lineId === "income.advanced_endoscopy") {
    const combined = beforeRecovery[0];
    if (!combined || combined.roomDefinitionId !== "room.endoscopy" || combined.durationMinutes <= 30) {
      return null;
    }
    const procedure: FrozenOperationPhase = {
      ...combined,
      id: `${combined.id}.procedure`,
      durationMinutes: combined.durationMinutes - 30,
    };
    return [prep, procedure, recovery, ...phases.slice(recoveryIndex + 1).map(cloneOperationPhase)];
  }
  return [prep, ...beforeRecovery, recovery, ...phases.slice(recoveryIndex + 1).map(cloneOperationPhase)];
}

function samePoint(left: GridPoint | null, right: GridPoint | null): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

function active(operation: ServiceOperationState): boolean {
  return operation.status !== "completed" && operation.status !== "cancelled";
}

export function getActiveServiceOperationRoomIds(state: GameState): Set<string> {
  return new Set(state.serviceOperations.filter(active).flatMap((operation) => [
    ...operation.reservedRoomInstanceIds,
    ...(operation.transitionHeldRoomInstanceIds ?? []),
    ...(operation.periopBedReservation ? [operation.periopBedReservation.roomInstanceId] : []),
  ]));
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

function isScheduledEndoscopyLine(line: ServiceIncomeLine): boolean {
  return line.operation?.visitorMode === "scheduled" &&
    SCHEDULED_ENDOSCOPY_LINE_IDS.has(line.id);
}

/**
 * Installed endoscopy demand follows staffed, reachable suite capacity. Busy
 * people and rooms remain installed capacity; live reservations only decide
 * when a queued visitor can begin work.
 */
export function getFunctionalScheduledEndoscopyCapacity(
  state: GameState,
  context: DomainContext,
): number {
  const operationalRoomCount = (roomDefinitionId: string) =>
    state.rooms.filter(
      (room) =>
        room.roomDefinitionId === roomDefinitionId &&
        isRoomOperationalForFacilityWork(state, room.id, context),
    ).length;
  const operationalStaffCount = (roleId: string) =>
    state.employees.filter(
      (employee) =>
        employee.staffRoleDefinitionId === roleId &&
        isEmployeeAssignedToOperationalRoom(state, employee.id, context),
    ).length;

  if (
    operationalRoomCount("room.periop_recovery") === 0 ||
    operationalStaffCount("staff.periop_nurse") === 0
  ) return 0;

  const endoscopyRooms = operationalRoomCount("room.endoscopy");
  const endoscopyNurses = operationalStaffCount("staff.endoscopy_nurse");
  const providers =
    operationalStaffCount("staff.endoscopist") +
    // The owner-founder is an installed provider slot even while temporarily
    // busy; reservation logic still prevents overlapping use.
    1;
  return Math.min(endoscopyRooms, endoscopyNurses, providers);
}

function scheduledLineCapacity(
  state: GameState,
  line: ServiceIncomeLine,
  context: DomainContext,
): number {
  if (isScheduledEndoscopyLine(line)) {
    if (!line.operation || state.facilityLevel < line.minimumFacilityLevel) return 0;
    const functionalCapacity = getFunctionalScheduledEndoscopyCapacity(state, context);
    if (functionalCapacity <= 0) return 0;
    // The functional-capacity helper explicitly proves the two shared
    // Endoscopy capabilities without depending on employees' temporary
    // physical positions. Preserve any future line-specific capability gate.
    const sharedCapabilityIds = new Set([
      "capability.endoscopy",
      "capability.periop_recovery",
    ]);
    const installedCapabilities = getCurrentCapabilities(state, context);
    return line.requiredCapabilityIds
      .filter((capabilityId) => !sharedCapabilityIds.has(capabilityId))
      .every((capabilityId) => installedCapabilities.has(capabilityId))
      ? functionalCapacity
      : 0;
  }
  return installedAndOperational(state, line, context) ? 1 : 0;
}

export function getCapacityScaledArrivalCadenceMinutes(
  baseCadenceMinutes: number,
  capacity: number,
): number {
  return Math.max(1, Math.ceil(baseCadenceMinutes / Math.max(1, capacity)));
}

function scheduledCadenceMinutes(line: ServiceIncomeLine, capacity: number): number {
  return getCapacityScaledArrivalCadenceMinutes(
    line.operation?.arrivalCadenceMinutes ?? 0,
    capacity,
  );
}

function isScheduledEndoscopyOperation(operation: ServiceOperationState): boolean {
  return operation.actorKind === "visitor" &&
    SCHEDULED_ENDOSCOPY_LINE_IDS.has(operation.incomeLineId);
}

function canAdmitScheduledVisitor(
  state: GameState,
  line: ServiceIncomeLine,
  capacity: number,
): boolean {
  if (isScheduledEndoscopyLine(line)) {
    const activeEndoscopy = state.serviceOperations.filter(
      (operation) =>
        active(operation) &&
        operation.status !== "leaving" &&
        isScheduledEndoscopyOperation(operation),
    );
    const waitingEndoscopy = activeEndoscopy.filter(
      (operation) =>
        operation.status === "arriving" ||
        operation.status === "waiting_for_resources",
    );
    return activeEndoscopy.length < capacity * 2 &&
      waitingEndoscopy.length < capacity;
  }

  const sameLine = state.serviceOperations.filter(
    (operation) =>
      active(operation) &&
      operation.status !== "leaving" &&
      operation.actorKind === "visitor" &&
      operation.incomeLineId === line.id,
  );
  const generalWaiting = state.serviceOperations.filter(
    (operation) =>
      operation.actorKind === "visitor" &&
      !isScheduledEndoscopyOperation(operation) &&
      (operation.status === "arriving" ||
        operation.status === "waiting_for_resources"),
  );
  return sameLine.length < 2 &&
    !sameLine.some(
      (operation) =>
        operation.status === "arriving" ||
        operation.status === "waiting_for_resources",
    ) &&
    generalWaiting.length < MAX_EXTERNAL_WAITING;
}

function phaseForEmployee(phases: readonly ServiceOperationPhase[], roleId: string): ServiceOperationPhase | null {
  return phases.find((phase) => phase.staffRoleDefinitionIds.includes(roleId)) ?? null;
}

function operationPhases(operation: ServiceOperationState, line: ServiceIncomeLine): readonly FrozenOperationPhase[] {
  return (operation.frozenOperationPhases ?? line.operation?.phases ?? []) as readonly FrozenOperationPhase[];
}

function operationRoomStation(
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
): FrozenOperationPhase["roomStationId"] | null {
  if (operation.phaseFlowVersion !== 1) return null;
  return operationPhases(operation, line)[operation.phaseIndex]?.roomStationId ?? null;
}

function isPeriopBedPhase(
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
): boolean {
  return operation.periopBedFlowVersion === 1 &&
    operationPhases(operation, line)[operation.phaseIndex]?.roomDefinitionId === "room.periop_recovery";
}

function operationRoomIds(operation: ServiceOperationState): string[] {
  return [
    ...operation.reservedRoomInstanceIds,
    ...(operation.transitionHeldRoomInstanceIds ?? []),
    ...(operation.periopBedReservation ? [operation.periopBedReservation.roomInstanceId] : []),
  ];
}

function roomConflictsWithActiveOperation(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  roomId: string,
  stationId: FrozenOperationPhase["roomStationId"] | null,
): boolean {
  return state.serviceOperations.some((candidate) => {
    if (candidate.id === operation.id || !active(candidate) || !operationRoomIds(candidate).includes(roomId)) {
      return false;
    }
    if (
      operation.periopBedFlowVersion === 1 &&
      candidate.periopBedFlowVersion === 1 &&
      state.rooms.find((room) => room.id === roomId)?.roomDefinitionId === "room.periop_recovery"
    ) return false;
    const candidateLine = getServiceIncomeLine(candidate.incomeLineId);
    const candidateStation = candidateLine
      ? operationRoomStation(candidate, candidateLine)
      : null;
    return !stationId || !candidateStation || candidateStation === stationId;
  });
}

function availablePeriopBedReservation(
  state: GameState,
  operation: ServiceOperationState,
  context: DomainContext,
  blockedRoomIds: ReadonlySet<string>,
): NonNullable<ServiceOperationState["periopBedReservation"]> | null {
  if (operation.periopBedReservation) {
    const room = state.rooms.find((candidate) => candidate.id === operation.periopBedReservation!.roomInstanceId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    const station = room && definition
      ? getRoomCareStations(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context))
        .find((candidate) => candidate.id === operation.periopBedReservation!.bedId)
      : null;
    return station && samePoint(station.patientAnchor, operation.periopBedReservation.endpoint) &&
      isRoomOperationalForFacilityWork(state, room!.id, context)
      ? operation.periopBedReservation
      : null;
  }
  const occupied = new Set(state.serviceOperations.flatMap((candidate) =>
    candidate.id !== operation.id && active(candidate) && candidate.periopBedReservation
      ? [`${candidate.periopBedReservation.roomInstanceId}:${candidate.periopBedReservation.bedId}`]
      : [],
  ));
  for (const room of state.rooms
    .filter((candidate) =>
      candidate.roomDefinitionId === "room.periop_recovery" &&
      !blockedRoomIds.has(candidate.id) &&
      isRoomOperationalForFacilityWork(state, candidate.id, context) &&
      !state.serviceOperations.some((other) =>
        other.id !== operation.id && active(other) && other.periopBedFlowVersion !== 1 && operationRoomIds(other).includes(candidate.id),
      ),
    )
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    const stations = getRoomCareStations(
      room,
      definition,
      state.doors,
      state.rooms,
      (id) => getRoomDefinition(id, context),
    );
    for (const station of stations) {
      if (station.kind !== "periop_bed" || occupied.has(`${room.id}:${station.id}`)) continue;
      const actorLocation = operationLocation(state, operation);
      if (!actorLocation || findDeterministicFacilityPath(
        actorLocation,
        station.patientAnchor,
        state.rooms,
        state.doors,
        (id) => getRoomDefinition(id, context),
      ).length === 0 || !planPeriopCoverage(state, room.id, context)) continue;
      return {
        version: "periop-bed-reservation.v1",
        roomInstanceId: room.id,
        bedId: station.id,
        endpoint: { ...station.patientAnchor },
      };
    }
  }
  return null;
}

function getPeriopCoverageEmployee(
  state: GameState,
  roomId: string,
): GameState["employees"][number] | null {
  return state.employees.find((employee) =>
    employee.staffRoleDefinitionId === "staff.periop_nurse" &&
    employee.facilityTask?.kind === "cover_periop" &&
    employee.facilityTask.targetId === roomId,
  ) ?? null;
}

function planPeriopCoverage(
  state: GameState,
  roomId: string,
  context: DomainContext,
): { employee: GameState["employees"][number]; path: GridPoint[]; existing: boolean } | null {
  const existing = getPeriopCoverageEmployee(state, roomId);
  if (existing) return isEmployeeAssignedToOperationalRoom(state, existing.id, context)
    ? { employee: existing, path: existing.path, existing: true }
    : null;
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  if (!room || !definition) return null;
  const target = getRoomSharedStaffAnchor(room, definition);
  const usedEmployees = getActiveServiceOperationEmployeeIds(state);
  for (const employee of state.employees
    .filter((candidate) =>
      candidate.staffRoleDefinitionId === "staff.periop_nurse" &&
      !candidate.facilityTask &&
      !usedEmployees.has(candidate.id) &&
      isEmployeeAssignedToOperationalRoom(state, candidate.id, context),
    )
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const path = findDeterministicFacilityPath(
      employee.location,
      target,
      state.rooms,
      state.doors,
      (id) => getRoomDefinition(id, context),
    );
    if (path.length > 0) return { employee, path, existing: false };
  }
  return null;
}

function periopCoverageReady(state: GameState, roomId: string, context: DomainContext): boolean {
  const employee = getPeriopCoverageEmployee(state, roomId);
  return Boolean(
    employee &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
    employee.pathIndex >= employee.path.length - 1,
  );
}

function commitPeriopCoveragePlan(
  state: GameState,
  roomId: string,
  plan: ReturnType<typeof planPeriopCoverage>,
): void {
  if (!plan || plan.existing) return;
  preemptEmployeeShopping(state, plan.employee.id);
  plan.employee.path = plan.path;
  plan.employee.pathIndex = 0;
  plan.employee.lastMovedAtFacilityTick = state.facilityTick;
  plan.employee.facilityTask = {
    kind: "cover_periop",
    targetId: roomId,
    startedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER,
  };
}

function tryReserve(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  movementStatus: "walking_to_service" | "walking_between_phases" = "walking_to_service",
): boolean {
  const amenityKind = operation.actorKind === "encounter" ? "encounter" : "service_visitor";
  const amenityId = operation.actorKind === "encounter" ? operation.actorId : operation.id;
  if (hasActivePatientAmenityTrip(state, amenityKind, amenityId)) return false;
  const phases = operationPhases(operation, line);
  const reservationPhases = operation.phaseFlowVersion === 1
    ? phases.slice(operation.phaseIndex, operation.phaseIndex + 1)
    : phases;
  if (reservationPhases.length === 0) return false;
  const clinical = getClinicalResourceReservations(state, context);
  const desiredStation = reservationPhases[0]?.roomStationId ?? null;
  const periopBedPhase = isPeriopBedPhase(operation, line);
  const bedReservation = periopBedPhase
    ? availablePeriopBedReservation(state, operation, context, clinical.roomIds)
    : null;
  if (periopBedPhase && !bedReservation) return false;
  const rooms = requiredRoomDefinitions(reservationPhases).map((definitionId) => {
    if (definitionId === "room.periop_recovery" && bedReservation) {
      return state.rooms.find((room) => room.id === bedReservation.roomInstanceId) ?? null;
    }
    const available = state.rooms
      .filter((room) => room.roomDefinitionId === definitionId &&
        !roomConflictsWithActiveOperation(state, operation, line, room.id, desiredStation) &&
        !clinical.roomIds.has(room.id) &&
        isRoomOperationalForFacilityWork(state, room.id, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    return available[clinical.roomDefinitionCounts.get(definitionId) ?? 0] ?? null;
  });
  if (rooms.some((room) => room === null)) return false;

  const usedEmployees = getActiveServiceOperationEmployeeIds(state);
  const selectedEmployees: string[] = [];
  for (const roleId of requiredStaffRoles(reservationPhases).filter((roleId) =>
    !(periopBedPhase && roleId === "staff.periop_nurse"),
  )) {
    const available = state.employees
      .filter((candidate) => candidate.staffRoleDefinitionId === roleId && !candidate.facilityTask && !clinical.employeeIds.has(candidate.id) && !usedEmployees.has(candidate.id) && !selectedEmployees.includes(candidate.id) && isServiceEmployeeOperational(state, candidate.id, roleId, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    const employee = available[clinical.staffRoleCounts.get(roleId) ?? 0];
    if (!employee) return false;
    selectedEmployees.push(employee.id);
  }

  const providerPhase = reservationPhases.find((phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible);
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
  const patientTarget = bedReservation
    ? bedReservation.endpoint
    : desiredStation === "periop_preparation"
    ? (getRoomWaitingAnchors(firstRoom, firstDefinition)[0] ??
      getRoomNavigationAnchor(firstRoom, firstDefinition, "primary"))
    : firstRoom.roomDefinitionId === "room.phlebotomy"
      ? getRoomCareAnchor(firstRoom, firstDefinition, "patient")
      : getRoomNavigationAnchor(firstRoom, firstDefinition, "primary");
  let actorPath: GridPoint[] = [];
  if (operation.actorKind !== "remote") {
    actorPath = operation.location
      ? (() => {
          const ordinary = operation.actorKind === "visitor"
            ? pathServiceVisitorFromCurrentLocation(state, context, operation.location!, patientTarget)
            : findDeterministicFacilityPath(operation.location!, patientTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
          return ordinary.length > 0
            ? ordinary
            : findRouteFromDisplacedLocationToPoint(state, context, operation.location!, patientTarget);
        })()
      : [];
    if (actorPath.length === 0) return false;
  }

  const employeePlans = selectedEmployees.map((employeeId) => {
    const employee = state.employees.find((candidate) => candidate.id === employeeId)!;
    const employeePhase = phaseForEmployee(reservationPhases, employee.staffRoleDefinitionId)!;
    const targetRoom = rooms.find((room) => room?.roomDefinitionId === employeePhase.roomDefinitionId)!;
    const targetDefinition = getRoomDefinition(targetRoom.roomDefinitionId, context)!;
    const staffTarget = employee.staffRoleDefinitionId === "staff.phlebotomist" &&
      targetRoom.roomDefinitionId === "room.phlebotomy"
      ? getRoomCareAnchor(targetRoom, targetDefinition, "clinician")
      : getRoomNavigationAnchor(targetRoom, targetDefinition, "staff");
    const ordinary = findDeterministicFacilityPath(employee.location, staffTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    const path = ordinary.length > 0
      ? ordinary
      : findRouteFromDisplacedLocationToPoint(state, context, employee.location, staffTarget);
    return { employee, path };
  });
  if (employeePlans.some((plan) => plan.path.length === 0)) return false;
  const coveragePlan = bedReservation
    ? planPeriopCoverage(state, bedReservation.roomInstanceId, context)
    : null;
  if (bedReservation && !coveragePlan) return false;
  let providerEmployeePlan: { employee: GameState["employees"][number]; path: GridPoint[] } | null = null;
  let founderPath: GridPoint[] | null = null;
  const providerRoom = providerPhase?.roomDefinitionId
    ? rooms.find((room) => room?.roomDefinitionId === providerPhase.roomDefinitionId) ?? firstRoom
    : firstRoom;
  const providerDefinition = getRoomDefinition(providerRoom.roomDefinitionId, context)!;
  const providerTarget = getRoomNavigationAnchor(providerRoom, providerDefinition, "staff");
  if (provider?.kind === "employee") {
    const employee = state.employees.find((candidate) => candidate.id === provider.employeeId)!;
    const ordinary = findDeterministicFacilityPath(employee.location, providerTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    const path = ordinary.length > 0
      ? ordinary
      : findRouteFromDisplacedLocationToPoint(state, context, employee.location, providerTarget);
    if (path.length === 0) return false;
    providerEmployeePlan = { employee, path };
  } else if (provider?.kind === "founder") {
    const ordinary = findDeterministicFacilityPath(state.environment.founderLocation, providerTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    founderPath = ordinary.length > 0
      ? ordinary
      : findRouteFromDisplacedLocationToPoint(state, context, state.environment.founderLocation, providerTarget);
    if (founderPath.length === 0) return false;
  }

  operation.reservedRoomInstanceIds = rooms.map((room) => room!.id);
  operation.reservedEmployeeIds = selectedEmployees;
  operation.providerReservation = provider;
  operation.path = actorPath;
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  operation.status = movementStatus;
  if (bedReservation) operation.periopBedReservation = {
    ...bedReservation,
    endpoint: { ...bedReservation.endpoint },
  };
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
  if (coveragePlan && !coveragePlan.existing) {
    commitPeriopCoveragePlan(state, bedReservation!.roomInstanceId, coveragePlan);
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

function operationInsideRoom(
  state: GameState,
  operation: ServiceOperationState,
  roomId: string,
  context: DomainContext,
): boolean {
  const location = operationLocation(state, operation);
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  if (!location || !room || !definition) return false;
  const footprint = getRotatedFootprint(definition, room.orientation);
  return location.x >= room.x && location.x < room.x + footprint.width &&
    location.y >= room.y && location.y < room.y + footprint.height;
}

function releaseClearedTransitionRooms(
  state: GameState,
  operation: ServiceOperationState,
  context: DomainContext,
): void {
  operation.transitionHeldRoomInstanceIds = (operation.transitionHeldRoomInstanceIds ?? []).filter(
    (roomId) => operationInsideRoom(state, operation, roomId, context),
  );
}

function holdResolvedEncounterForActiveOperation(
  state: GameState,
  operation: ServiceOperationState,
): void {
  if (operation.actorKind !== "encounter") return;
  const encounter = state.encounters[operation.actorId];
  if (!encounter) return;
  if (operation.status === "discharging" && encounter.patientMovement && encounter.patientLocation) {
    operation.location = { ...encounter.patientLocation };
    return;
  }
  if (operation.status === "leaving" && encounter.patientMovement && encounter.patientLocation) {
    operation.location = { ...encounter.patientLocation };
    return;
  }
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

function resourcesArrived(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, context: DomainContext): boolean {
  const employees = [...operation.reservedEmployeeIds, ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : [])];
  const assignedArrived = employees.every((id) => {
    const employee = state.employees.find((candidate) => candidate.id === id);
    return employee?.facilityTask?.targetId === operation.id && employee.pathIndex >= employee.path.length - 1;
  }) && (operation.providerReservation?.kind !== "founder" || (state.environment.founderActivity?.targetId === operation.id && state.environment.founderActivity.pathIndex >= state.environment.founderActivity.path.length - 1));
  return assignedArrived && (!isPeriopBedPhase(operation, line) || Boolean(
    operation.periopBedReservation && periopCoverageReady(state, operation.periopBedReservation.roomInstanceId, context),
  ));
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

function releasePeriopBed(operation: ServiceOperationState): void {
  operation.periopBedReservation = undefined;
  operation.transitionHeldRoomInstanceIds = [];
  operation.nextPhaseReadyAtFacilityTick = null;
}

function queueInterruptedCurrentPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
): void {
  const phase = operationPhases(operation, line)[operation.phaseIndex];
  const remainingPhaseMinutes = operation.saleTransfer?.remainingPhaseMinutes ??
    (operation.phaseEndsAtFacilityTick === null
      ? phase?.durationMinutes ?? 1
      : Math.max(1, operation.phaseEndsAtFacilityTick - state.facilityTick));
  releaseResources(state, operation);
  operation.phaseStartedAtFacilityTick = null;
  operation.phaseEndsAtFacilityTick = null;
  operation.path = operation.location ? [{ ...operation.location }] : [];
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  operation.status = "waiting_for_resources";
  operation.waitDeadlineFacilityTick = Number.MAX_SAFE_INTEGER;
  operation.nextPhaseReadyAtFacilityTick = null;
  operation.saleTransfer = {
    version: "room-sale-transfer.v1",
    interruptedAtFacilityTick: state.facilityTick,
    remainingPhaseMinutes,
  };
}

/**
 * Releases work whose physical room was sold. Work can reserve another room
 * of the same type on the next tick; otherwise it follows the ordinary
 * cancellation/departure path and never reaches the income-credit step.
 */
export function interruptServiceOperationsForRoomSale(
  state: GameState,
  roomId: string,
  roomDefinitionId: string,
  context: DomainContext,
): string[] {
  const interrupted: string[] = [];
  for (const operation of state.serviceOperations) {
    if (!active(operation)) continue;
    const touchesRoom = operation.reservedRoomInstanceIds.includes(roomId) ||
      operation.transitionHeldRoomInstanceIds?.includes(roomId) ||
      operation.periopBedReservation?.roomInstanceId === roomId;
    if (!touchesRoom) continue;
    interrupted.push(operation.id);
    const line = getServiceIncomeLine(operation.incomeLineId);
    const currentPhase = line ? operationPhases(operation, line)[operation.phaseIndex] : null;
    if (operation.status === "waiting_for_next_phase") {
      const nextPhase = line ? operationPhases(operation, line)[operation.phaseIndex + 1] : null;
      const soldCapacityNeededNext = nextPhase?.roomDefinitionId === roomDefinitionId;
      const nextCapacityRemains = !soldCapacityNeededNext || state.rooms.some(
        (candidate) => candidate.id !== roomId && candidate.roomDefinitionId === roomDefinitionId,
      );
      if (!nextCapacityRemains) {
        cancel(state, operation, "The next service phase became unavailable when its room was sold.", context);
        continue;
      }
      operation.transitionHeldRoomInstanceIds = (operation.transitionHeldRoomInstanceIds ?? [])
        .filter((candidate) => candidate !== roomId);
      operation.reservedRoomInstanceIds = operation.reservedRoomInstanceIds
        .filter((candidate) => candidate !== roomId);
      if (operation.periopBedReservation?.roomInstanceId === roomId) {
        delete operation.periopBedReservation;
      }
      releaseResources(state, operation);
      continue;
    }
    const compatibleDefinitionId = currentPhase?.roomDefinitionId ?? roomDefinitionId;
    const compatibleRoomRemains = state.rooms.some(
      (room) => room.id !== roomId && room.roomDefinitionId === compatibleDefinitionId,
    );
    if (operation.periopBedFlowVersion === 1 && operation.periopBedReservation?.roomInstanceId === roomId) {
      if (operation.status === "discharging") {
        releasePeriopBed(operation);
        operation.status = operation.actorKind === "visitor" ? "leaving" : "completed";
        continue;
      }
      if (currentPhase?.roomDefinitionId !== "room.periop_recovery" && compatibleRoomRemains) {
        delete operation.periopBedReservation;
        continue;
      }
      if (compatibleRoomRemains && line) {
        delete operation.periopBedReservation;
        queueInterruptedCurrentPhase(state, operation, line);
        continue;
      }
      cancel(state, operation, "The assigned Periop bed was removed before this service finished.", context);
      continue;
    }
    if (operation.periopBedFlowVersion === 1) {
      const reservedCurrentRoom = operation.reservedRoomInstanceIds.includes(roomId);
      operation.transitionHeldRoomInstanceIds = (operation.transitionHeldRoomInstanceIds ?? [])
        .filter((candidate) => candidate !== roomId);
      if (!reservedCurrentRoom) continue;
      if (!compatibleRoomRemains) {
        cancel(state, operation, "The procedure suite was sold before this service finished.", context);
        continue;
      }
      if (!line) {
        cancel(state, operation, "The procedure definition became unavailable.", context);
        continue;
      }
      queueInterruptedCurrentPhase(state, operation, line);
      continue;
    }
    operation.transitionHeldRoomInstanceIds = (operation.transitionHeldRoomInstanceIds ?? [])
      .filter((candidate) => candidate !== roomId);
    if (operation.periopBedReservation?.roomInstanceId === roomId) {
      delete operation.periopBedReservation;
    }
    if (compatibleRoomRemains) {
      if (!line) {
        cancel(state, operation, "The service definition became unavailable.", context);
        continue;
      }
      queueInterruptedCurrentPhase(state, operation, line);
      continue;
    }
    cancel(state, operation, "The clinic room was sold before this service finished.", context);
  }
  return interrupted;
}

export function interruptServiceOperationsForEmployeeDismissal(
  state: GameState,
  employeeIds: ReadonlySet<string>,
): void {
  for (const operation of state.serviceOperations) {
    if (!active(operation)) continue;
    const affected = operation.reservedEmployeeIds.some((id) => employeeIds.has(id)) ||
      (operation.providerReservation?.kind === "employee" && employeeIds.has(operation.providerReservation.employeeId));
    if (!affected) continue;
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.operation) continue;
    // The current phase has already completed in this state. Preserve that
    // progress and let the ordinary next-phase reservation select replacement
    // staff instead of repeating the completed phase.
    if (operation.status === "waiting_for_next_phase") {
      releaseResources(state, operation);
      continue;
    }
    if (operation.periopBedFlowVersion === 1) {
      operation.transitionHeldRoomInstanceIds = [...new Set([
        ...(operation.transitionHeldRoomInstanceIds ?? []),
        ...operation.reservedRoomInstanceIds,
      ])];
    }
    queueInterruptedCurrentPhase(state, operation, line);
  }
}

export function cancelServiceOperationsById(
  state: GameState,
  operationIds: ReadonlySet<string>,
  reason: string,
  context: DomainContext,
): void {
  for (const operation of state.serviceOperations) {
    if (operationIds.has(operation.id) && active(operation)) {
      cancel(state, operation, reason, context);
    }
  }
}

function cancel(
  state: GameState,
  operation: ServiceOperationState,
  reason: string,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  releaseResources(state, operation);
  releasePeriopBed(operation);
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
      operation.testChoiceOrder?.purpose === "staged_result_component" ||
      operation.testChoiceOrder?.purpose === "result_gate")
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
  return operationRoomIds(operation).every((id) => isRoomOperationalForFacilityWork(state, id, context)) &&
    (!operation.periopBedReservation || Boolean(availablePeriopBedReservation(state, operation, context, new Set()))) &&
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
  operation.phaseEndsAtFacilityTick = state.facilityTick +
    (operation.saleTransfer?.remainingPhaseMinutes ?? phase.durationMinutes);
  operation.saleTransfer = undefined;
  if (operation.startedAtFacilityTick === null) operation.startedAtFacilityTick = state.facilityTick;
}

function releaseCompletedPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  retainCompletedRoom = false,
): void {
  const phases = operationPhases(operation, line);
  const completedPhase = phases[operation.phaseIndex]!;
  const futurePhases = phases.slice(operation.phaseIndex + 1);
  if (
    !retainCompletedRoom &&
    !futurePhases.some((phase) => phase.roomDefinitionId === completedPhase.roomDefinitionId)
  ) {
    operation.reservedRoomInstanceIds = operation.reservedRoomInstanceIds.filter((roomId) =>
      state.rooms.find((room) => room.id === roomId)?.roomDefinitionId !== completedPhase.roomDefinitionId,
    );
  }
  const completedRoles = new Set(completedPhase.staffRoleDefinitionIds);
  for (const employeeId of [...operation.reservedEmployeeIds]) {
    const employee = state.employees.find((candidate) => candidate.id === employeeId);
    if (!employee || !completedRoles.has(employee.staffRoleDefinitionId)) continue;
    if (
      operation.phaseFlowVersion !== 1 &&
      futurePhases.some((phase) => phase.staffRoleDefinitionIds.includes(employee.staffRoleDefinitionId))
    ) continue;
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

function tryReserveNextPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
): boolean {
  const nextPhaseIndex = operation.phaseIndex + 1;
  if (!operationPhases(operation, line)[nextPhaseIndex]) return false;
  const candidate: ServiceOperationState = {
    ...operation,
    phaseIndex: nextPhaseIndex,
    phaseStartedAtFacilityTick: null,
    phaseEndsAtFacilityTick: null,
    reservedRoomInstanceIds: [],
    reservedEmployeeIds: [],
    providerReservation: null,
    path: operation.location ? [{ ...operation.location }] : [],
    pathIndex: 0,
  };
  if (!tryReserve(
    state,
    candidate,
    line,
    context,
    "walking_between_phases",
  )) {
    return false;
  }
  operation.phaseIndex = candidate.phaseIndex;
  operation.phaseStartedAtFacilityTick = null;
  operation.phaseEndsAtFacilityTick = null;
  operation.reservedRoomInstanceIds = candidate.reservedRoomInstanceIds;
  operation.reservedEmployeeIds = candidate.reservedEmployeeIds;
  operation.providerReservation = candidate.providerReservation;
  operation.path = candidate.path;
  operation.pathIndex = candidate.pathIndex;
  operation.lastMovedAtFacilityTick = candidate.lastMovedAtFacilityTick;
  operation.status = candidate.status;
  operation.nextPhaseReadyAtFacilityTick = null;
  return true;
}

function beginPeriopBedDischarge(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  credit(state, operation);
  releaseCompletedPhase(state, operation, line);
  releaseResources(state, operation);
  operation.phaseIndex += 1;
  operation.completedAtFacilityTick = state.facilityTick;
  operation.nextPhaseReadyAtFacilityTick = null;
  operation.status = "discharging";
  if (operation.actorKind === "visitor") {
    const location = operationLocation(state, operation);
    const travel = ensureVisitorTravel(state, operation, context);
    const path = travel ? pathServiceVisitorToOffscreenEndpoint(state, context, location, travel.offscreenEndpoint) : [];
    if (path.length > 0) setOperationPath(state, operation, path, "discharging");
  } else if (
    operation.actorKind === "encounter" &&
    operation.testChoiceOrder?.purpose !== "continuation" &&
    operation.testChoiceOrder?.purpose !== "staged_result_component" &&
    operation.testChoiceOrder?.purpose !== "result_gate"
  ) {
    startResolvedEncounterDeparture(state, operation, context, departurePlanner);
  }
}

function movePeriopBedFlowToNextPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  const phases = operationPhases(operation, line);
  const completed = phases[operation.phaseIndex];
  const nextPhase = phases[operation.phaseIndex + 1];
  if (!completed) return;
  if (!nextPhase) {
    beginPeriopBedDischarge(state, operation, line, context, departurePlanner);
    return;
  }
  if (completed.roomDefinitionId && completed.roomDefinitionId !== "room.periop_recovery") {
    operation.transitionHeldRoomInstanceIds = [...new Set([
      ...(operation.transitionHeldRoomInstanceIds ?? []),
      ...operation.reservedRoomInstanceIds.filter((roomId) =>
        state.rooms.find((room) => room.id === roomId)?.roomDefinitionId === completed.roomDefinitionId,
      ),
    ])];
  }
  releaseCompletedPhase(state, operation, line);
  operation.reservedRoomInstanceIds = [];
  operation.status = "waiting_for_next_phase";
  operation.phaseStartedAtFacilityTick = null;
  operation.phaseEndsAtFacilityTick = null;
  operation.nextPhaseReadyAtFacilityTick = state.facilityTick;
}

function moveToNextPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  if (operation.periopBedFlowVersion === 1) {
    movePeriopBedFlowToNextPhase(state, operation, line, context, departurePlanner);
    return;
  }
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
        operation.testChoiceOrder?.purpose === "staged_result_component" ||
        operation.testChoiceOrder?.purpose === "result_gate")
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
  if (operation.phaseFlowVersion === 1) {
    releaseCompletedPhase(state, operation, line, true);
    operation.status = "waiting_for_next_phase";
    operation.phaseStartedAtFacilityTick = null;
    operation.phaseEndsAtFacilityTick = null;
    tryReserveNextPhase(state, operation, line, context);
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
  const periopPhases = getNewPeriopServiceOperationPhases(line.id);
  return { id, incomeLineId: line.id, catalogVersion: 1, actorKind, actorId: actualActorId, displayName: encounter?.patientDisplayName ?? (actorKind === "visitor" ? createPatientDisplayName(state.campaignSeed, actualActorId, undefined, excludedDisplayNames) : line.displayName), appearance: encounter?.patientAppearance ?? (actorKind === "visitor" ? createPatientPixelAppearance(state.campaignSeed, actualActorId) : null), status: actorKind === "visitor" ? "arriving" : "waiting_for_resources", createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + WAIT_TIMEOUT_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: actorKind === "visitor" ? line.scheduledVisitorFee ?? line.fee : line.fee, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null, location: actorKind === "visitor" ? endpoint : encounter?.patientLocation ?? entrance?.outside ?? null, path: arrivalPath, pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null, ...(actorKind === "visitor" && endpoint ? { visitorTravel: { version: "service-visitor-travel.v1" as const, offscreenEndpoint: endpoint, arrivedAtFacilityTick: null } } : {}), ...(actorKind === "encounter" ? { resourceQueueVersion: 1 as const } : {}), ...(periopPhases ? { phaseFlowVersion: 1 as const, periopBedFlowVersion: 1 as const, nextPhaseReadyAtFacilityTick: null, transitionHeldRoomInstanceIds: [], frozenOperationPhases: periopPhases } : {}) };
}

export function startServiceOperation(state: GameState, lineId: string, actorKind: "visitor" | "remote", context: DomainContext): string | null {
  const line = getServiceIncomeLine(lineId);
  if (!line?.operation || line.kind === "retail" || !installedAndOperational(state, line, context)) return null;
  if (line.operation.encounterOnly) return null;
  if (
    (actorKind === "remote" && line.operation.visitorMode !== "work_queue") ||
    (actorKind === "visitor" && line.operation.visitorMode === "work_queue")
  ) return null;
  if (actorKind === "visitor" && isScheduledEndoscopyLine(line)) {
    const capacity = getFunctionalScheduledEndoscopyCapacity(state, context);
    if (capacity <= 0 || !canAdmitScheduledVisitor(state, line, capacity)) return null;
  } else {
    const sameLine = state.serviceOperations.filter(
      (operation) => active(operation) && operation.status !== "leaving" && operation.actorKind === actorKind && operation.incomeLineId === lineId,
    );
    if (sameLine.length >= 2 || sameLine.some((operation) => operation.status === "arriving" || operation.status === "waiting_for_resources")) return null;
    if (
      actorKind === "visitor" &&
      state.serviceOperations.filter((operation) => operation.actorKind === "visitor" && (operation.status === "arriving" || operation.status === "waiting_for_resources")).length >= MAX_EXTERNAL_WAITING
    ) return null;
  }
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
  const dueLines: Array<{ line: ServiceIncomeLine; capacity: number; cadence: number }> = [];
  for (const line of SERVICE_INCOME_CATALOG) {
    const baseCadence = line.operation?.visitorMode === "scheduled" ? line.operation.arrivalCadenceMinutes : null;
    const capacity = baseCadence ? scheduledLineCapacity(state, line, context) : 0;
    if (!baseCadence || !state.serviceAppointmentsEnabled || capacity <= 0) {
      delete state.nextServiceAppointmentTicks[line.id];
      continue;
    }
    const cadence = scheduledCadenceMinutes(line, capacity);
    const lastArrival = state.lastServiceAppointmentTicks[line.id];
    if (lastArrival !== undefined) {
      state.nextServiceAppointmentTicks[line.id] = lastArrival + cadence;
    } else if (
      isScheduledEndoscopyLine(line) &&
      (state.nextServiceAppointmentTicks[line.id] ?? Number.MAX_SAFE_INTEGER) >
        state.facilityTick + cadence
    ) {
      // Old saves can carry the former 300-minute first appointment. Clamp
      // only future endoscopy timers so the new staffed-room cadence applies
      // promptly without delaying an appointment that is already sooner.
      state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence;
    }
    const due = state.nextServiceAppointmentTicks[line.id];
    if (due === undefined) { state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence; continue; }
    if (due > state.facilityTick) continue;
    dueLines.push({ line, capacity, cadence });
  }
  const globalSpacingBlocked = state.lastServiceAppointmentArrivalTick !== null &&
    state.facilityTick - state.lastServiceAppointmentArrivalTick < GLOBAL_ARRIVAL_SPACING_MINUTES;
  const eligibleDueLines = globalSpacingBlocked
    ? dueLines.filter(({ line }) => isScheduledEndoscopyLine(line))
    : dueLines;
  const orderedIds = SERVICE_INCOME_CATALOG.map((line) => line.id);
  eligibleDueLines.sort((left, right) =>
    (state.lastServiceAppointmentTicks[left.line.id] ?? -1) - (state.lastServiceAppointmentTicks[right.line.id] ?? -1) ||
    orderedIds.indexOf(left.line.id) - orderedIds.indexOf(right.line.id),
  );
  for (const { line, capacity, cadence } of eligibleDueLines) {
    if (!canAdmitScheduledVisitor(state, line, capacity)) continue;
    const operation = createOperation(state, line, "visitor", undefined, undefined, context);
    if (operation) {
      state.serviceOperations.push(operation);
      if (!isScheduledEndoscopyLine(line)) {
        state.lastServiceAppointmentArrivalTick = state.facilityTick;
      }
      state.lastServiceAppointmentLineId = line.id;
      state.lastServiceAppointmentTicks[line.id] = state.facilityTick;
      state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence;
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
  for (const employee of state.employees) {
    if (
      employee.facilityTask?.kind === "cover_periop" &&
      !isEmployeeAssignedToOperationalRoom(state, employee.id, context)
    ) employee.facilityTask = null;
  }
  for (const roomId of new Set(state.serviceOperations.flatMap((operation) =>
    active(operation) && operation.periopBedReservation
      ? [operation.periopBedReservation.roomInstanceId]
      : [],
  ))) {
    if (!getPeriopCoverageEmployee(state, roomId)) {
      commitPeriopCoveragePlan(state, roomId, planPeriopCoverage(state, roomId, context));
    }
  }
  for (const operation of state.serviceOperations) {
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.operation) continue;
    if (operation.status === "completed" || operation.status === "cancelled") continue;
    const amenityKind = operation.actorKind === "encounter" ? "encounter" : "service_visitor";
    const amenityId = operation.actorKind === "encounter" ? operation.actorId : operation.id;
    const departureRetail = state.retailOperations.find((trip) =>
      trip.departureServiceOperationId === operation.id &&
      trip.status !== "completed" && trip.status !== "cancelled" && trip.status !== "abandoned",
    );
    if (departureRetail) {
      operation.location = { ...departureRetail.location };
      if (operation.actorKind === "encounter") {
        const encounter = state.encounters[operation.actorId];
        if (encounter) encounter.patientLocation = { ...departureRetail.location };
      }
      continue;
    }
    if (hasActivePatientAmenityTrip(state, amenityKind, amenityId)) {
      if (operation.periopBedFlowVersion === 1 && !validateReservedResources(state, operation, context)) {
        state.patientAmenityTrips = state.patientAmenityTrips?.filter((trip) =>
          !(trip.actorKind === amenityKind && trip.actorId === amenityId),
        );
        cancel(state, operation, "Required service capacity became unavailable.", context, departurePlanner);
        continue;
      }
      if (
        operation.status === "in_service" &&
        operation.phaseEndsAtFacilityTick !== null &&
        operation.periopBedFlowVersion === 1 &&
        operation.phaseIndex === 0
      ) operation.phaseEndsAtFacilityTick += 1;
      continue;
    }
    holdResolvedEncounterForActiveOperation(state, operation);
    releaseClearedTransitionRooms(state, operation, context);
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
        const encounter = state.encounters[operation.actorId];
        const location = encounter?.patientLocation;
        if (encounter?.patientMovement === null && location &&
          (location.x < 0 || location.y < 0 ||
            location.x >= context.balanceRelease.facility.gridWidth ||
            location.y >= context.balanceRelease.facility.gridHeight)) {
          operation.location = { ...location };
          operation.status = operation.cancelledAtFacilityTick === null ? "completed" : "cancelled";
          continue;
        }
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
    if (operation.status === "discharging") {
      if (!operation.periopBedReservation && operation.departureItinerary) {
        if (operation.departureItinerary.status === "pending" || operation.departureItinerary.status === "bathroom" || operation.departureItinerary.status === "retail") continue;
        if (operation.actorKind === "visitor") {
          ensureCompleteVisitorDeparture(state, operation, context);
          operation.status = "leaving";
        } else {
          const departureStarted = startResolvedEncounterDeparture(state, operation, context, departurePlanner);
          operation.status = departureStarted
            ? operation.cancelledAtFacilityTick === null ? "completed" : "cancelled"
            : "leaving";
        }
        continue;
      }
      if (operation.actorKind === "visitor") {
        ensureCompleteVisitorDeparture(state, operation, context);
        advanceActorMovement(state, operation, context);
      } else if (
        operation.actorKind === "encounter" &&
        operation.testChoiceOrder?.purpose !== "continuation" &&
        operation.testChoiceOrder?.purpose !== "staged_result_component" &&
        operation.testChoiceOrder?.purpose !== "result_gate"
      ) {
        startResolvedEncounterDeparture(state, operation, context, departurePlanner);
      }
      const bedRoomId = operation.periopBedReservation?.roomInstanceId;
      if (bedRoomId && !operationInsideRoom(state, operation, bedRoomId, context)) {
        releasePeriopBed(operation);
        const encounter = operation.actorKind === "encounter" ? state.encounters[operation.actorId] : null;
        const terminalDeparture = operation.periopBedFlowVersion === 1 &&
          (operation.actorKind === "visitor" || encounter?.lifecycle === "resolved");
        if (terminalDeparture) {
          operation.departureItinerary = {
            version: "service-departure-itinerary.v1", status: "pending", choiceKind: null,
            selectedAtFacilityTick: null, completedAtFacilityTick: null, linkedTripId: null, retailIncomeLineId: null,
          };
          operation.path = operation.location ? [{ ...operation.location }] : [];
          operation.pathIndex = 0;
          if (encounter) encounter.patientMovement = null;
        } else {
          operation.status = operation.actorKind === "visitor" ? "leaving" : "completed";
        }
      }
      continue;
    }
    if (operation.status === "waiting_for_resources") {
      if ((operation.actorKind !== "encounter" || operation.resourceQueueVersion !== 1) && state.facilityTick >= operation.waitDeadlineFacilityTick) { cancel(state, operation, "The visitor could not start within 60 minutes.", context, departurePlanner); continue; }
      if (operation.actorKind === "visitor" && state.retailOperations.some((trip) =>
        trip.actorKind === "service_visitor" && trip.actorId === operation.id &&
        trip.status !== "completed" && trip.status !== "cancelled" && trip.status !== "abandoned",
      )) continue;
      if (operation.actorKind === "visitor" && operation.phaseFlowVersion !== 1 && state.serviceOperations.some((candidate) =>
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
    if (operation.status === "waiting_for_next_phase") {
      if (
        (operation.periopBedFlowVersion === 1 && !validateReservedResources(state, operation, context)) ||
        (operation.periopBedFlowVersion !== 1 && !operation.reservedRoomInstanceIds.every((id) =>
          isRoomOperationalForFacilityWork(state, id, context)
        ))
      ) {
        cancel(
          state,
          operation,
          "The room holding the patient between service phases became unavailable.",
          context,
          departurePlanner,
        );
        continue;
      }
      if (operation.periopBedFlowVersion !== 1) tryReserveNextPhase(state, operation, line, context);
      continue;
    }
    if (!validateReservedResources(state, operation, context)) { cancel(state, operation, "Required service capacity became unavailable.", context, departurePlanner); continue; }
    if (operation.status === "walking_to_service" || operation.status === "walking_between_phases") {
      advanceActorMovement(state, operation, context);
      releaseClearedTransitionRooms(state, operation, context);
      if (operation.pathIndex >= operation.path.length - 1 && resourcesArrived(state, operation, line, context)) beginPhase(state, operation, line);
      continue;
    }
    if (
      operation.status === "in_service" &&
      isPeriopBedPhase(operation, line) &&
      operation.phaseEndsAtFacilityTick !== null &&
      (!operation.periopBedReservation ||
        !samePoint(operationLocation(state, operation), operation.periopBedReservation.endpoint) ||
        !periopCoverageReady(state, operation.periopBedReservation.roomInstanceId, context))
    ) {
      operation.phaseEndsAtFacilityTick += 1;
      continue;
    }
    if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null && state.facilityTick >= operation.phaseEndsAtFacilityTick) {
      moveToNextPhase(state, operation, line, context, departurePlanner);
      continue;
    }
  }
  for (const operation of state.serviceOperations
    .filter((candidate) => candidate.periopBedFlowVersion === 1 && candidate.status === "waiting_for_next_phase" &&
      !hasActivePatientAmenityTrip(
        state,
        candidate.actorKind === "encounter" ? "encounter" : "service_visitor",
        candidate.actorKind === "encounter" ? candidate.actorId : candidate.id,
      ))
    .sort((left, right) =>
      (left.nextPhaseReadyAtFacilityTick ?? Number.MAX_SAFE_INTEGER) - (right.nextPhaseReadyAtFacilityTick ?? Number.MAX_SAFE_INTEGER) ||
      left.createdAtFacilityTick - right.createdAtFacilityTick ||
      left.id.localeCompare(right.id),
    )) {
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.operation || !operation.periopBedReservation) continue;
    const completedPhase = operationPhases(operation, line)[operation.phaseIndex];
    if (
      completedPhase?.roomDefinitionId === "room.periop_recovery" &&
      !samePoint(operationLocation(state, operation), operation.periopBedReservation.endpoint)
    ) continue;
    tryReserveNextPhase(state, operation, line, context);
  }
  const coveredRoomIds = new Set(state.serviceOperations.flatMap((operation) =>
    active(operation) && operation.periopBedReservation
      ? [operation.periopBedReservation.roomInstanceId]
      : [],
  ));
  for (const employee of state.employees) {
    if (
      employee.facilityTask?.kind === "cover_periop" &&
      (!employee.facilityTask.targetId || !coveredRoomIds.has(employee.facilityTask.targetId))
    ) employee.facilityTask = null;
  }
}
