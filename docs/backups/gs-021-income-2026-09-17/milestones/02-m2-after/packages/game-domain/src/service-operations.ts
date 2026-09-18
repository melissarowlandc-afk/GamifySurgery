import {
  SERVICE_INCOME_CATALOG,
  getServiceIncomeLine,
  type ServiceIncomeLine,
  type ServiceOperationPhase,
} from "@gamify-surgery/balance-config";
import { createPatientDisplayName, createPatientPixelAppearance } from "./appearance";
import { getDoorCells } from "./doors";
import {
  getCurrentCapabilities,
  getRoomDefinition,
  isEmployeeOperational,
  isRoomOperationalForFacilityWork,
} from "./selectors";
import { findDeterministicFacilityPath, getRoomNavigationAnchor } from "./spatial";
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

function pathFromEntrance(
  state: GameState,
  context: DomainContext,
  target: GridPoint,
): GridPoint[] {
  const entrance = getEntrance(state, context);
  if (!entrance) return [];
  const internal = findDeterministicFacilityPath(
    entrance.inside,
    target,
    state.rooms,
    state.doors,
    (id) => getRoomDefinition(id, context),
  );
  return internal.length > 0
    ? [entrance.outside, entrance.inside, ...internal.slice(1)]
    : [];
}

function pathToExit(
  state: GameState,
  context: DomainContext,
  start: GridPoint | null,
): GridPoint[] {
  const entrance = getEntrance(state, context);
  if (!entrance || !start) return [];
  const internal = findDeterministicFacilityPath(
    start,
    entrance.inside,
    state.rooms,
    state.doors,
    (id) => getRoomDefinition(id, context),
  );
  return internal.length > 0 ? [...internal, entrance.outside] : [];
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

interface ClinicalReservations {
  roomIds: Set<string>;
  roomDefinitionCounts: Map<string, number>;
  employeeIds: Set<string>;
  staffRoleCounts: Map<string, number>;
  founderReserved: boolean;
}

function incrementCount(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function clinicalReservations(state: GameState, context: DomainContext): ClinicalReservations {
  const result: ClinicalReservations = {
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

function requiredRoomDefinitions(line: ServiceIncomeLine): string[] {
  return [...new Set(line.operation?.phases.flatMap((phase) => phase.roomDefinitionId ? [phase.roomDefinitionId] : []) ?? [])];
}

function requiredStaffRoles(line: ServiceIncomeLine): string[] {
  return [...new Set(line.operation?.phases.flatMap((phase) => phase.staffRoleDefinitionIds) ?? [])];
}

function installedAndOperational(state: GameState, line: ServiceIncomeLine, context: DomainContext): boolean {
  if (!line.operation || state.facilityLevel < line.minimumFacilityLevel) return false;
  const capabilities = getCurrentCapabilities(state, context);
  if (!line.requiredCapabilityIds.every((capability) => capabilities.has(capability))) return false;
  if (!requiredRoomDefinitions(line).every((definitionId) => state.rooms.some(
    (room) => room.roomDefinitionId === definitionId && isRoomOperationalForFacilityWork(state, room.id, context),
  ))) return false;
  if (!requiredStaffRoles(line).every((roleId) => state.employees.some(
    (employee) => employee.staffRoleDefinitionId === roleId && isEmployeeOperational(state, employee.id, context),
  ))) return false;
  const providerPhase = line.operation.phases.find(
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

function phaseForEmployee(line: ServiceIncomeLine, roleId: string): ServiceOperationPhase | null {
  return line.operation?.phases.find((phase) => phase.staffRoleDefinitionIds.includes(roleId)) ?? null;
}

function tryReserve(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, context: DomainContext): boolean {
  const clinical = clinicalReservations(state, context);
  const usedRooms = getActiveServiceOperationRoomIds(state);
  const rooms = requiredRoomDefinitions(line).map((definitionId) => {
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
  for (const roleId of requiredStaffRoles(line)) {
    const available = state.employees
      .filter((candidate) => candidate.staffRoleDefinitionId === roleId && !candidate.facilityTask && !clinical.employeeIds.has(candidate.id) && !usedEmployees.has(candidate.id) && !selectedEmployees.includes(candidate.id) && isEmployeeOperational(state, candidate.id, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    const employee = available[clinical.staffRoleCounts.get(roleId) ?? 0];
    if (!employee) return false;
    selectedEmployees.push(employee.id);
  }

  const providerPhase = line.operation?.phases.find((phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible);
  let provider: ServiceOperationState["providerReservation"] = null;
  if (providerPhase) {
    const providerEmployee = state.employees
      .filter((candidate) => providerPhase.providerRoleDefinitionIds?.includes(candidate.staffRoleDefinitionId) && !candidate.facilityTask && !clinical.employeeIds.has(candidate.id) && !usedEmployees.has(candidate.id) && !selectedEmployees.includes(candidate.id) && isEmployeeOperational(state, candidate.id, context))
      .sort((a, b) => a.id.localeCompare(b.id))[0];
    if (providerEmployee) provider = { kind: "employee", employeeId: providerEmployee.id };
    else if (providerPhase.founderEligible && state.environment.founderActivity === null && !clinical.founderReserved && !founderHasActiveServiceOperation(state)) provider = { kind: "founder" };
    else return false;
  }

  const firstRoom = rooms[0];
  if (!firstRoom) return false;
  const firstDefinition = getRoomDefinition(firstRoom.roomDefinitionId, context)!;
  const patientTarget = getRoomNavigationAnchor(firstRoom, firstDefinition, "primary");
  let actorPath: GridPoint[] = [];
  if (operation.actorKind !== "remote") {
    actorPath = operation.actorKind === "visitor"
      ? pathFromEntrance(state, context, patientTarget)
      : operation.location
        ? findDeterministicFacilityPath(operation.location, patientTarget, state.rooms, state.doors, (id) => getRoomDefinition(id, context))
        : [];
    if (actorPath.length === 0) return false;
  }

  const employeePlans = selectedEmployees.map((employeeId) => {
    const employee = state.employees.find((candidate) => candidate.id === employeeId)!;
    const employeePhase = phaseForEmployee(line, employee.staffRoleDefinitionId)!;
    const targetRoom = rooms.find((room) => room?.roomDefinitionId === employeePhase.roomDefinitionId)!;
    const targetDefinition = getRoomDefinition(targetRoom.roomDefinitionId, context)!;
    const path = findDeterministicFacilityPath(employee.location, getRoomNavigationAnchor(targetRoom, targetDefinition, "staff"), state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    return { employee, path };
  });
  if (employeePlans.some((plan) => plan.path.length === 0)) return false;
  let providerEmployeePlan: { employee: GameState["employees"][number]; path: GridPoint[] } | null = null;
  let founderPath: GridPoint[] | null = null;
  if (provider?.kind === "employee") {
    const employee = state.employees.find((candidate) => candidate.id === provider.employeeId)!;
    const path = findDeterministicFacilityPath(employee.location, getRoomNavigationAnchor(firstRoom, firstDefinition, "staff"), state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    if (path.length === 0) return false;
    providerEmployeePlan = { employee, path };
  } else if (provider?.kind === "founder") {
    founderPath = findDeterministicFacilityPath(state.environment.founderLocation, getRoomNavigationAnchor(firstRoom, firstDefinition, "staff"), state.rooms, state.doors, (id) => getRoomDefinition(id, context));
    if (founderPath.length === 0) return false;
  }

  operation.reservedRoomInstanceIds = rooms.map((room) => room!.id);
  operation.reservedEmployeeIds = selectedEmployees;
  operation.providerReservation = provider;
  operation.path = actorPath;
  operation.pathIndex = 0;
  operation.status = "walking_to_service";
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

function resourcesArrived(state: GameState, operation: ServiceOperationState): boolean {
  const employees = [...operation.reservedEmployeeIds, ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : [])];
  return employees.every((id) => {
    const employee = state.employees.find((candidate) => candidate.id === id);
    return employee?.facilityTask?.targetId === operation.id && employee.pathIndex >= employee.path.length - 1;
  }) && (operation.providerReservation?.kind !== "founder" || (state.environment.founderActivity?.targetId === operation.id && state.environment.founderActivity.pathIndex >= state.environment.founderActivity.path.length - 1));
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

function cancel(state: GameState, operation: ServiceOperationState, reason: string, context: DomainContext): void {
  releaseResources(state, operation);
  operation.cancelledAtFacilityTick = state.facilityTick;
  operation.cancellationReason = reason;
  if (operation.actorKind === "visitor") {
    const location = operationLocation(state, operation);
    const path = pathToExit(state, context, location);
    operation.path = path;
    operation.pathIndex = 0;
    operation.status = "leaving";
  } else operation.status = "cancelled";
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
  const phase = line.operation!.phases[operation.phaseIndex]!;
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
  const completedPhase = line.operation!.phases[operation.phaseIndex]!;
  const futurePhases = line.operation!.phases.slice(operation.phaseIndex + 1);
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

function moveToNextPhase(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, context: DomainContext): void {
  const nextPhase = line.operation!.phases[operation.phaseIndex + 1];
  if (!nextPhase) {
    credit(state, operation);
    releaseCompletedPhase(state, operation, line);
    operation.phaseIndex += 1;
    releaseResources(state, operation);
    operation.completedAtFacilityTick = state.facilityTick;
    if (operation.actorKind === "visitor") {
      const location = operationLocation(state, operation);
      operation.path = pathToExit(state, context, location);
      operation.pathIndex = 0;
      operation.status = "leaving";
    } else operation.status = "completed";
    return;
  }
  releaseCompletedPhase(state, operation, line);
  operation.phaseIndex += 1;
  const phase = nextPhase;
  const roomId = operation.reservedRoomInstanceIds.find((id) => state.rooms.find((room) => room.id === id)?.roomDefinitionId === phase.roomDefinitionId);
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  const location = operationLocation(state, operation);
  if (!room || !definition || !location) { cancel(state, operation, "The next service phase became unavailable.", context); return; }
  operation.path = findDeterministicFacilityPath(location, getRoomNavigationAnchor(room, definition, "primary"), state.rooms, state.doors, (id) => getRoomDefinition(id, context));
  operation.pathIndex = 0;
  operation.status = "walking_between_phases";
  operation.phaseStartedAtFacilityTick = null;
  operation.phaseEndsAtFacilityTick = null;
}

function createOperation(state: GameState, line: ServiceIncomeLine, actorKind: "visitor" | "encounter" | "remote", actorId?: string, encounter?: EncounterState, context?: DomainContext): ServiceOperationState | null {
  const id = `service-operation.${state.serviceOperationSequence++}`;
  const entrance = context ? getEntrance(state, context) : null;
  if (actorKind === "visitor" && !entrance) return null;
  const actualActorId = actorId ?? id;
  return { id, incomeLineId: line.id, catalogVersion: 1, actorKind, actorId: actualActorId, displayName: encounter?.patientDisplayName ?? (actorKind === "visitor" ? createPatientDisplayName(state.campaignSeed, actualActorId) : line.displayName), appearance: encounter?.patientAppearance ?? (actorKind === "visitor" ? createPatientPixelAppearance(state.campaignSeed, actualActorId) : null), status: "waiting_for_resources", createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + WAIT_TIMEOUT_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: line.fee, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null, location: encounter?.patientLocation ?? entrance?.outside ?? null, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null };
}

export function startServiceOperation(state: GameState, lineId: string, actorKind: "visitor" | "remote", context: DomainContext): string | null {
  const line = getServiceIncomeLine(lineId);
  if (!line?.operation || line.kind === "retail" || !installedAndOperational(state, line, context)) return null;
  if (
    (actorKind === "remote" && line.operation.visitorMode !== "work_queue") ||
    (actorKind === "visitor" && line.operation.visitorMode === "work_queue")
  ) return null;
  const sameLine = state.serviceOperations.filter(
    (operation) => active(operation) && operation.actorKind === actorKind && operation.incomeLineId === lineId,
  );
  if (sameLine.length >= 2 || sameLine.some((operation) => operation.status === "waiting_for_resources")) return null;
  if (
    actorKind === "visitor" &&
    state.serviceOperations.filter((operation) => operation.actorKind === "visitor" && operation.status === "waiting_for_resources").length >= MAX_EXTERNAL_WAITING
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

function scheduleArrivals(state: GameState, context: DomainContext): void {
  for (const line of SERVICE_INCOME_CATALOG) {
    const cadence = line.operation?.visitorMode === "scheduled" ? line.operation.arrivalCadenceMinutes : null;
    if (!cadence || !state.serviceAppointmentsEnabled || !installedAndOperational(state, line, context)) {
      delete state.nextServiceAppointmentTicks[line.id];
      continue;
    }
    const due = state.nextServiceAppointmentTicks[line.id];
    if (due === undefined) { state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence; continue; }
    if (due > state.facilityTick) continue;
    state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence;
    if (state.lastServiceAppointmentArrivalTick !== null && state.facilityTick - state.lastServiceAppointmentArrivalTick < GLOBAL_ARRIVAL_SPACING_MINUTES) continue;
    const lineOperations = state.serviceOperations.filter((operation) => active(operation) && operation.incomeLineId === line.id && operation.actorKind === "visitor");
    if (lineOperations.length >= 2 || lineOperations.some((operation) => operation.status === "waiting_for_resources") || state.serviceOperations.filter((operation) => operation.actorKind === "visitor" && operation.status === "waiting_for_resources").length >= MAX_EXTERNAL_WAITING) continue;
    const operation = createOperation(state, line, "visitor", undefined, undefined, context);
    if (operation) { state.serviceOperations.push(operation); state.lastServiceAppointmentArrivalTick = state.facilityTick; }
  }
}

export function advanceServiceOperations(state: GameState, context: DomainContext): void {
  scheduleArrivals(state, context);
  for (const operation of state.serviceOperations) {
    const line = getServiceIncomeLine(operation.incomeLineId);
    if (!line?.operation || operation.status === "completed") continue;
    if (operation.status === "cancelled") continue;
    if (operation.status === "leaving") {
      advanceActorMovement(state, operation, context);
      if (operation.path.length === 0 || operation.pathIndex >= operation.path.length - 1) {
        operation.location = null;
        operation.status = operation.cancelledAtFacilityTick === null ? "completed" : "cancelled";
      }
      continue;
    }
    if (operation.status === "waiting_for_resources") {
      if (state.facilityTick >= operation.waitDeadlineFacilityTick) { cancel(state, operation, "The visitor could not start within 60 minutes.", context); continue; }
      if (operation.actorKind === "visitor" && state.serviceOperations.some((candidate) =>
        candidate.id !== operation.id &&
        candidate.actorKind === "visitor" &&
        candidate.incomeLineId === operation.incomeLineId &&
        (candidate.status === "walking_to_service" || candidate.status === "walking_between_phases" || candidate.status === "in_service"),
      )) continue;
      tryReserve(state, operation, line, context);
      continue;
    }
    if (!validateReservedResources(state, operation, context)) { cancel(state, operation, "Required service capacity became unavailable.", context); continue; }
    if (operation.status === "walking_to_service" || operation.status === "walking_between_phases") {
      advanceActorMovement(state, operation, context);
      if (operation.pathIndex >= operation.path.length - 1 && resourcesArrived(state, operation)) beginPhase(state, operation, line);
      continue;
    }
    if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null && state.facilityTick >= operation.phaseEndsAtFacilityTick) {
      moveToNextPhase(state, operation, line, context);
      continue;
    }
  }
}
