import {
  PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES,
  SERVICE_INCOME_CATALOG,
  getServiceIncomeLine,
  type ServiceIncomeLine,
  type ServiceOperationPhase,
} from "@gamify-surgery/balance-config";
import { createPatientDisplayName, createPatientPixelAppearance, getPatientAppearanceSelectionContext, getPresentPatientDisplayNames } from "./appearance";
import { getDoorCells } from "./doors";
import {
  getCurrentCapabilities,
  getRoomDefinition,
  isEmployeeAssignedToOperationalRoom,
  isEmployeeOperational,
  isRoomAccessibleForFacilityWork,
  isRoomAvailableForNewFacilityWork,
  isRoomOperationalForFacilityWork,
} from "./selectors";
import { getRoomCareAnchor, getRoomCareStations, getRoomNavigationAnchor, getRoomWaitingAnchors, getRotatedFootprint } from "./spatial";
import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { findCareAwareFacilityPath, pathEntersUnauthorizedProtectedRoom } from "./care-room-access";
import { hasActivePatientAmenityTrip } from "./patient-amenities";
import { getRadiologistReadingStation } from "./reading-stations";
import { advanceOutsideRadiologyReads, creditRadiologistRead, prepareRadiologistForInHouseRead, recordRadiologistReadCompletion } from "./radiologist-read-income";
import type {
  DiagnosticOrderPlan,
  DiagnosticResourceChoice,
  DomainContext,
  EncounterState,
  GameState,
  GridPoint,
  ServiceOperationState,
} from "./types";
import { recordLevelThreeRoomUse } from "./level-three-support";
import { earmarkQueuedEmployeeTrainingDepartures, getQueuedEmployeeTrainingDepartures, isDiagnosticResourceWaitingForTraining, isEmployeeAwayForTraining } from "./employee-training";
import { bindReadingUpgradeWork, compareReadingOperations, enableReadingPhase, quoteReadingUpgradeWork } from "./room-upgrade-reading";
import { bindServiceOperationTraining, snapshotEmployeeTrainingCategories } from "./employee-training-effects";
import { advancePeriopNurseAttention, beginPeriopNurseAttention, createPeriopNurseAttention, getCurrentPeriopNurseAttention, hasInstalledPeriopNurse } from "./periop-nurse-attention";
import { releaseLegacyPeriopCoverage } from "./legacy-periop-coverage";
import { bindServiceOperationRoomRevenue, cloneRoomUpgradeRevenueQuote, createRoomUpgradeRevenueQuote } from "./room-upgrades";
import { bindServiceOperationRecoveryExperience, cloneRoomUpgradeRecoveryQuote, completeServiceOperationRecoveryExperience, completeWaitingRoomExperience, createRoomUpgradeRecoveryQuote } from "./room-upgrade-experience";
import { getProcedureStaffStandingSpots, getProceduralSpecialistReadyAt, isProceduralSpecialistRole, usesApprovedProcedureStaffSpots } from "./procedural-staffing";
import { compareStaffHomePreference, hasQueuedHomeRoomWork } from "./staff-dispatch";

const WAIT_TIMEOUT_MINUTES = 60;
const GLOBAL_ARRIVAL_SPACING_MINUTES = 30;
const MAX_EXTERNAL_WAITING = 2;
const SCHEDULED_ENDOSCOPY_LINE_IDS = new Set([
  "income.endoscopy",
  "income.advanced_endoscopy",
]);
const SCHEDULED_AMBULATORY_OPERATION_LINE_IDS = new Set([
  "income.ambulatory_operation",
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

function diagnosticPhysicalIncomeLine(line: ServiceIncomeLine | null, phases: readonly FrozenOperationPhase[]): ServiceIncomeLine | null {
  if (!line || line.kind === "retail" || phases.length === 0) return null;
  // Some existing route fee rows predate the physical operation engine.
  // Marked work supplies its own frozen engine contract and keeps that fee ID.
  return line.operation ? line : { ...line, operation: { visitorMode: "explicit_only", arrivalCadenceMinutes: null, encounterOnly: true, phases } };
}

function operationIncomeLine(operation: ServiceOperationState): ServiceIncomeLine | null {
  const line = getServiceIncomeLine(operation.incomeLineId);
  return operation.diagnosticPhysicalWork ? diagnosticPhysicalIncomeLine(line, operation.frozenOperationPhases ?? []) : line;
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
  allowedProtectedRoomInstanceIds: ReadonlySet<string> = new Set(),
): GridPoint[] {
  const entrance = getEntrance(state, context);
  if (!entrance) return [];
  const outside = start.y >= context.balanceRelease.facility.gridHeight;
  if (outside) {
    const internal = findCareAwareFacilityPath(
      state, context, entrance.inside, target, allowedProtectedRoomInstanceIds,
    );
    return internal.length > 0
      ? joinPaths(straightServiceVisitorSidewalkPath(start, entrance.outside), [entrance.inside], internal)
      : [];
  }
  return findCareAwareFacilityPath(
    state, context, start, target, allowedProtectedRoomInstanceIds,
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
  const internal = findCareAwareFacilityPath(
    state, context, start, entrance.inside,
  );
  return internal.length > 0
    ? joinPaths(internal, [entrance.outside], straightServiceVisitorSidewalkPath(entrance.outside, endpoint))
    : [];
}

function hasActiveClinicalResourcePhase(encounter: EncounterState, facilityTick: number): boolean {
  const pending = encounter.pendingResult;
  if (pending?.diagnosticTiming) return false;
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
  return isEmployeeAssignedToOperationalRoom(state, employeeId, context);
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
      (isServiceEmployeeOperational(state, employee.id, roleId, context) ||
        isEmployeeAwayForTraining(employee) && isEmployeeAssignedToOperationalRoom(state, employee.id, context)),
  ))) return false;
  const providerPhase = phases.find(
    (phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible,
  );
  return !providerPhase || Boolean(
    providerPhase.founderEligible || state.employees.some(
      (employee) =>
        providerPhase.providerRoleDefinitionIds?.includes(employee.staffRoleDefinitionId) &&
        (isEmployeeOperational(state, employee.id, context) ||
          isEmployeeAwayForTraining(employee) && isEmployeeAssignedToOperationalRoom(state, employee.id, context)),
    ),
  );
}

function isScheduledEndoscopyLine(line: ServiceIncomeLine): boolean {
  return line.operation?.visitorMode === "scheduled" &&
    SCHEDULED_ENDOSCOPY_LINE_IDS.has(line.id);
}

function isScheduledAmbulatoryOperationLine(line: ServiceIncomeLine): boolean {
  return line.operation?.visitorMode === "scheduled" &&
    SCHEDULED_AMBULATORY_OPERATION_LINE_IDS.has(line.id);
}

function isCapacityScaledScheduledLine(line: ServiceIncomeLine): boolean {
  return isScheduledEndoscopyLine(line) || isScheduledAmbulatoryOperationLine(line);
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

/** Installed ambulatory-OR demand follows every staffed phase of its route. */
export function getFunctionalScheduledAmbulatoryOperationCapacity(
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

  return Math.min(
    operationalRoomCount("room.ambulatory_or"),
    operationalRoomCount("room.periop_recovery"),
    operationalStaffCount("staff.or_nurse"),
    operationalStaffCount("staff.periop_nurse"),
    operationalStaffCount("staff.surgeon") + 1,
  );
}

export function getRemoteWorkQueueAvailability(
  state: GameState,
  lineId: string,
  context: DomainContext,
): { functionalCapacity: number; activeCount: number; waitingCount: number; canStart: boolean } {
  const line = getServiceIncomeLine(lineId);
  if (!line?.operation || line.operation.visitorMode !== "work_queue" ||
      state.facilityLevel < line.minimumFacilityLevel ||
      !installedAndOperational(state, line, context)) {
    return { functionalCapacity: 0, activeCount: 0, waitingCount: 0, canStart: false };
  }
  const roomCapacities = line.operation.phases.map((phase) =>
    state.rooms.filter((room) =>
      room.roomDefinitionId === phase.roomDefinitionId &&
      isRoomOperationalForFacilityWork(state, room.id, context),
    ).length,
  );
  const staffCapacities = requiredStaffRoles(line.operation.phases).map((roleId) =>
    state.employees.filter((employee) =>
      employee.staffRoleDefinitionId === roleId &&
      isEmployeeAssignedToOperationalRoom(state, employee.id, context),
    ).length,
  );
  const functionalCapacity = Math.min(...roomCapacities, ...staffCapacities);
  const matching = state.serviceOperations.filter((operation) =>
    active(operation) && operation.incomeLineId === lineId && operation.actorKind === "remote",
  );
  const waitingCount = matching.filter((operation) => operation.status === "waiting_for_resources").length;
  return {
    functionalCapacity,
    activeCount: matching.length,
    waitingCount,
    canStart: functionalCapacity > 0 &&
      matching.length < functionalCapacity * 2 &&
      waitingCount < functionalCapacity,
  };
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
  if (isScheduledAmbulatoryOperationLine(line)) {
    if (!line.operation || state.facilityLevel < line.minimumFacilityLevel) return 0;
    const functionalCapacity = getFunctionalScheduledAmbulatoryOperationCapacity(state, context);
    if (functionalCapacity <= 0) return 0;
    const sharedCapabilityIds = new Set([
      "capability.ambulatory_or",
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

function isCapacityScaledScheduledOperation(operation: ServiceOperationState): boolean {
  return operation.actorKind === "visitor" &&
    (SCHEDULED_ENDOSCOPY_LINE_IDS.has(operation.incomeLineId) ||
      SCHEDULED_AMBULATORY_OPERATION_LINE_IDS.has(operation.incomeLineId));
}

function canAdmitScheduledVisitor(
  state: GameState,
  line: ServiceIncomeLine,
  capacity: number,
): boolean {
  if (isCapacityScaledScheduledLine(line)) {
    const activeScheduled = state.serviceOperations.filter(
      (operation) =>
        active(operation) &&
        operation.status !== "leaving" &&
        operation.actorKind === "visitor" &&
        (isScheduledEndoscopyLine(line)
          ? SCHEDULED_ENDOSCOPY_LINE_IDS.has(operation.incomeLineId)
          : operation.incomeLineId === line.id),
    );
    const waitingScheduled = activeScheduled.filter(
      (operation) =>
        operation.status === "arriving" ||
        operation.status === "waiting_for_resources",
    );
    return activeScheduled.length < capacity * 2 &&
      waitingScheduled.length < capacity;
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
      !isCapacityScaledScheduledOperation(operation) &&
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
    const candidateLine = operationIncomeLine(candidate);
    const candidateStation = candidateLine
      ? operationRoomStation(candidate, candidateLine)
      : null;
    return !stationId || !candidateStation || candidateStation === stationId;
  });
}

function isPhaseBlockedOnlyByMaintenance(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  phase: FrozenOperationPhase | undefined,
  context: DomainContext,
): boolean {
  if (!phase?.roomDefinitionId) return false;
  const matching = state.rooms.filter((room) => room.roomDefinitionId === phase.roomDefinitionId);
  if (!matching.some((room) => room.maintenance?.status === "out_of_service")) return false;
  const clinical = getClinicalResourceReservations(state, context);
  const usable = matching.filter((room) =>
    isRoomAvailableForNewFacilityWork(state, room.id, context) &&
    !clinical.roomIds.has(room.id) &&
    !roomConflictsWithActiveOperation(state, operation, line, room.id, phase.roomStationId ?? null));
  return usable.length <= (clinical.roomDefinitionCounts.get(phase.roomDefinitionId) ?? 0);
}

function availablePeriopBedReservation(
  state: GameState,
  operation: ServiceOperationState,
  context: DomainContext,
  blockedRoomIds: ReadonlySet<string>,
): NonNullable<ServiceOperationState["periopBedReservation"]> | null {
  const preferred = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource;
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
      (!preferred || candidate.id === preferred.roomInstanceId) &&
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
      if (station.kind !== "periop_bed" || (preferred && station.id !== preferred.stationId) || occupied.has(`${room.id}:${station.id}`)) continue;
      const actorLocation = operationLocation(state, operation);
      if (!actorLocation || findRouteFromDisplacedLocationToPoint(
        state, context, actorLocation, station.patientAnchor, new Set([room.id]),
      ).length === 0 || !hasInstalledPeriopNurse(state, context)) continue;
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

function diagnosticProcessingChoices(state: GameState, operation: ServiceOperationState, context: DomainContext): DiagnosticResourceChoice[] {
  const work = operation.diagnosticPhaseWork!;
  const reading = work.kind === "interpretation";
  const roomDefinitionId = reading ? "room.reading" : "room.laboratory";
  const roleId = reading ? "staff.radiologist" : "staff.laboratory_technician";
  return state.employees.filter((employee) => employee.staffRoleDefinitionId === roleId && employee.homeRoomInstanceId &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context)).flatMap((employee) => {
    const room = state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId && candidate.roomDefinitionId === roomDefinitionId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    if (!room || !definition || !isRoomAvailableForNewFacilityWork(state, room.id, context)) return [];
    const post = reading ? getRadiologistReadingStation(state, employee, context) : null;
    if (reading && !post) return [];
    const anchor = post?.location ?? getRoomNavigationAnchor(room, definition, "staff");
    return [{ roomInstanceId: room.id, roomDefinitionId, stationId: post?.station.id ?? null, employeeIds: [employee.id], provider: null,
      patientAnchor: anchor, staffAnchor: anchor } satisfies DiagnosticResourceChoice];
  }).sort((a, b) => a.roomInstanceId.localeCompare(b.roomInstanceId) || (a.stationId ?? "").localeCompare(b.stationId ?? "") || a.employeeIds[0]!.localeCompare(b.employeeIds[0]!));
}

function sameDiagnosticChoice(a: DiagnosticResourceChoice, b: DiagnosticResourceChoice): boolean {
  return a.roomInstanceId === b.roomInstanceId && a.stationId === b.stationId && a.employeeIds.join(":") === b.employeeIds.join(":") &&
    JSON.stringify(a.provider) === JSON.stringify(b.provider);
}

function diagnosticPhysicalChoiceCompatible(state: GameState, operation: ServiceOperationState, context: DomainContext): boolean {
  const resource = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource;
  if (!resource) return true;
  const queuedAttention = Boolean(operation.periopNurseAttention && resource.roomDefinitionId === "room.periop_recovery");
  if (!queuedAttention && isDiagnosticResourceWaitingForTraining(state, resource)) return false;
  const room = state.rooms.find((candidate) => candidate.id === resource.roomInstanceId);
  if (!room || room.roomDefinitionId !== resource.roomDefinitionId || !isRoomOperationalForFacilityWork(state, room.id, context)) return false;
  if (!queuedAttention && !resource.employeeIds.every((id) => isEmployeeAssignedToOperationalRoom(state, id, context))) return false;
  if (resource.provider?.kind === "employee" && !isEmployeeAssignedToOperationalRoom(state, resource.provider.employeeId, context)) return false;
  if (resource.stationId) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition || !getRoomCareStations(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context)).some((station) =>
      station.id === resource.stationId && samePoint(station.patientAnchor, resource.patientAnchor))) return false;
  }
  return true;
}

function queueDiagnosticProcessing(state: GameState, operation: ServiceOperationState): void {
  const work = operation.diagnosticPhaseWork!;
  if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null) work.remainingMinutes = work.readingUpgradeWork && operation.phaseStartedAtFacilityTick !== null
    ? Math.max(0, work.remainingMinutes - Math.max(0, state.facilityTick - operation.phaseStartedAtFacilityTick))
    : Math.max(0, operation.phaseEndsAtFacilityTick - state.facilityTick);
  releaseResources(state, operation);
  work.resource = null;
  operation.status = "waiting_for_resources";
  operation.phaseStartedAtFacilityTick = null;
  operation.phaseEndsAtFacilityTick = null;
  operation.path = [];
  operation.pathIndex = 0;
  operation.waitDeadlineFacilityTick = Number.MAX_SAFE_INTEGER;
}

interface ReadingHandoff { resource: DiagnosticResourceChoice; atTick: number }

function tryReserveDiagnosticProcessing(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, context: DomainContext, handoff?: ReadingHandoff): boolean {
  const work = operation.diagnosticPhaseWork!;
  if (work.readingUpgradeWork && (work.readingUpgradeWork.readyAtTick === null || (handoff?.atTick ?? state.facilityTick) < work.readingUpgradeWork.readyAtTick)) return false;
  const choices = diagnosticProcessingChoices(state, operation, context);
  if (work.resource && (isDiagnosticResourceWaitingForTraining(state, work.resource) || !choices.some((choice) => sameDiagnosticChoice(choice, work.resource!)))) work.resource = null;
  const clinical = getClinicalResourceReservations(state, context);
  const departures = work.kind === "interpretation" ? getQueuedEmployeeTrainingDepartures(state, context, state.facilityTick, new Set(), true) : [];
  for (const resource of choices.filter((choice) => !work.resource || sameDiagnosticChoice(choice, work.resource))) {
    if (handoff && !sameDiagnosticChoice(resource, handoff.resource)) continue;
    const employee = state.employees.find((candidate) => candidate.id === resource.employeeIds[0])!;
    if (isEmployeeAwayForTraining(employee) || employee.facilityTask || clinical.employeeIds.has(employee.id) || getActiveServiceOperationEmployeeIds(state).has(employee.id) || clinical.roomIds.has(resource.roomInstanceId) ||
      (clinical.roomDefinitionCounts.get(resource.roomDefinitionId) ?? 0) > 0 || departures.some((departure) => departure.employeeId === employee.id)) continue;
    const roomBusy = state.serviceOperations.some((other) => other.id !== operation.id && active(other) && operationRoomIds(other).includes(resource.roomInstanceId) &&
      !(work.kind === "interpretation" && other.diagnosticPhaseWork?.kind === "interpretation" && other.diagnosticPhaseWork.resource?.stationId !== resource.stationId));
    if (roomBusy) continue;
    const employeePath = findCareAwareFacilityPath(state, context, employee.location, resource.staffAnchor, new Set([resource.roomInstanceId]));
    if (!employeePath.length || handoff && (employeePath.length !== 1 || !samePoint(employee.location, resource.staffAnchor))) continue;
    if (work.kind === "interpretation" && !prepareRadiologistForInHouseRead(state, employee.id, context)) continue;
    work.resource = resource;
    if (work.readingUpgradeWork?.durationMinutes === null) {
      work.readingUpgradeWork.quotedRoomInstanceId = resource.roomInstanceId;
      work.durationMinutes = work.remainingMinutes = quoteReadingUpgradeWork(work.readingUpgradeWork, resource.roomInstanceId);
      operation.frozenOperationPhases![0]!.durationMinutes = work.durationMinutes;
    }
    operation.reservedRoomInstanceIds = [resource.roomInstanceId];
    operation.reservedEmployeeIds = [employee.id];
    operation.path = [];
    operation.pathIndex = 0;
    operation.status = "walking_to_service";
    preemptEmployeeShopping(state, employee.id);
    employee.path = employeePath;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.facilityTask = { kind: "perform_service", targetId: operation.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    if (resourcesArrived(state, operation, line, context)) beginPhase(state, operation, line, handoff?.atTick);
    return true;
  }
  return false;
}

function tryReserve(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  movementStatus: "walking_to_service" | "walking_between_phases" = "walking_to_service",
): boolean {
  if (operation.diagnosticPhaseWork || isPeriopBedPhase(operation, line)) {
    return tryReserveInRooms(state, operation, line, context, movementStatus);
  }
  if (operation.diagnosticPhysicalWork && !diagnosticPhysicalChoiceCompatible(state, operation, context)) {
    operation.diagnosticPhysicalWork.phaseBindings[operation.phaseIndex]!.resource = null;
  }
  const preferred = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource;
  // Accepted room/employee choices remain frozen. Unbound work tries every
  // reachable room/team rather than abandoning the first unusable ID pair.
  if (preferred) return tryReserveInRooms(state, operation, line, context, movementStatus);
  const phases = operationPhases(operation, line);
  const reservationPhases = operation.phaseFlowVersion === 1 ? phases.slice(operation.phaseIndex, operation.phaseIndex + 1) : phases;
  const clinical = getClinicalResourceReservations(state, context);
  const usedEmployees = getActiveServiceOperationEmployeeIds(state);
  let combinations: GameState["rooms"][] = [[]];
  for (const definitionId of requiredRoomDefinitions(reservationPhases)) {
    const available = state.rooms.filter(room => room.roomDefinitionId === definitionId &&
      !roomConflictsWithActiveOperation(state, operation, line, room.id, reservationPhases[0]?.roomStationId ?? null) &&
      !clinical.roomIds.has(room.id) && isRoomAvailableForNewFacilityWork(state, room.id, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    combinations = available.length > (clinical.roomDefinitionCounts.get(definitionId) ?? 0)
      ? combinations.flatMap(rooms => available.map(room => [...rooms, room])) : [];
  }
  const choices = combinations.map(rooms => {
    const first = rooms[0];
    if (!first) return { rooms, homeShortage: 0, distance: 0 };
    const definition = getRoomDefinition(first.roomDefinitionId, context)!;
    const target = first.roomDefinitionId === "room.phlebotomy" ? getRoomCareAnchor(first, definition, "patient") : getRoomNavigationAnchor(first, definition, "primary");
    const allowed = new Set(rooms.map(room => room.id));
    const origin = operationLocation(state, operation);
    const patientPath = operation.actorKind === "remote" ? [target] : origin
      ? operation.actorKind === "visitor" ? pathServiceVisitorFromCurrentLocation(state, context, origin, target, allowed)
        : findCareAwareFacilityPath(state, context, origin, target, allowed)
      : [];
    const distance = patientPath.length ? patientPath.length : Number.MAX_SAFE_INTEGER;
    const homeShortage = requiredStaffRoles(reservationPhases).filter(role => {
      const phase = phaseForEmployee(reservationPhases, role)!;
      const room = rooms.find(room => room.roomDefinitionId === phase.roomDefinitionId);
      return !state.employees.some(employee => employee.staffRoleDefinitionId === role && employee.homeRoomInstanceId === room?.id &&
        !employee.facilityTask && !isEmployeeAwayForTraining(employee) && !usedEmployees.has(employee.id) && !clinical.employeeIds.has(employee.id));
    }).length;
    return { rooms, homeShortage, distance };
  }).sort((a, b) => a.homeShortage - b.homeShortage || a.distance - b.distance ||
    a.rooms.map(room => room.id).join(":").localeCompare(b.rooms.map(room => room.id).join(":")));
  return choices.some(choice => tryReserveInRooms(state, operation, line, context, movementStatus, choice.rooms));
}

function tryReserveInRooms(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  movementStatus: "walking_to_service" | "walking_between_phases" = "walking_to_service",
  dispatchRooms?: GameState["rooms"],
): boolean {
  if (operation.diagnosticPhaseWork) return tryReserveDiagnosticProcessing(state, operation, line, context);
  if (operation.diagnosticPhysicalWork && !diagnosticPhysicalChoiceCompatible(state, operation, context)) {
    operation.diagnosticPhysicalWork.phaseBindings[operation.phaseIndex]!.resource = null;
  }
  const amenityKind = operation.actorKind === "encounter" ? "encounter" : "service_visitor";
  const amenityId = operation.actorKind === "encounter" ? operation.actorId : operation.id;
  if (hasActivePatientAmenityTrip(state, amenityKind, amenityId)) return false;
  const phases = operationPhases(operation, line);
  const reservationPhases = operation.phaseFlowVersion === 1
    ? phases.slice(operation.phaseIndex, operation.phaseIndex + 1)
    : phases;
  if (reservationPhases.length === 0) return false;
  const clinical = getClinicalResourceReservations(state, context);
  const preferred = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource;
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
        isRoomAvailableForNewFacilityWork(state, room.id, context))
      .sort((a, b) => a.id.localeCompare(b.id));
    const anonymousCount = clinical.roomDefinitionCounts.get(definitionId) ?? 0;
    if (definitionId !== "room.periop_recovery" && available.length <= anonymousCount) return null;
    const scoped = available.filter(room => (!dispatchRooms || dispatchRooms.some(candidate => candidate.id === room.id)) &&
      (!preferred || room.id === preferred.roomInstanceId));
    return scoped[definitionId === "room.periop_recovery" && !dispatchRooms ? anonymousCount : 0] ?? null;
  });
  if (rooms.some((room) => room === null)) return false;

  const usedEmployees = getActiveServiceOperationEmployeeIds(state);
  const selectedEmployees: string[] = [];
  const employeePath = (employee: GameState["employees"][number], room: GameState["rooms"][number]): GridPoint[] => {
    const definition = getRoomDefinition(room.roomDefinitionId, context)!;
    const fallback = preferred?.staffAnchor ?? (employee.staffRoleDefinitionId === "staff.phlebotomist" && room.roomDefinitionId === "room.phlebotomy"
      ? getRoomCareAnchor(room, definition, "clinician") : getRoomNavigationAnchor(room, definition, "staff"));
    const procedureNurse = employee.staffRoleDefinitionId === "staff.endoscopy_nurse" || employee.staffRoleDefinitionId === "staff.or_nurse";
    const targets = procedureNurse && usesApprovedProcedureStaffSpots(room, definition)
      ? getProcedureStaffStandingSpots(room, definition, state.doors, "nurse").map(spot => spot.anchor) : [fallback];
    for (const target of targets) {
      const allowed = new Set([room.id]);
      const ordinary = findCareAwareFacilityPath(state, context, employee.location, target, allowed);
      const path = ordinary.length ? ordinary : findRouteFromDisplacedLocationToPoint(state, context, employee.location, target, allowed);
      if (path.length) return path;
    }
    return [];
  };
  const employeePlans: { employee: GameState["employees"][number]; path: GridPoint[] }[] = [];
  for (const roleId of requiredStaffRoles(reservationPhases).filter((roleId) =>
    !(periopBedPhase && roleId === "staff.periop_nurse"),
  )) {
    const employeePhase = phaseForEmployee(reservationPhases, roleId)!;
    const targetRoom = rooms.find(room => room?.roomDefinitionId === employeePhase.roomDefinitionId)!;
    const available = state.employees
      .filter((candidate) => candidate.staffRoleDefinitionId === roleId && !candidate.facilityTask && !isEmployeeAwayForTraining(candidate) && !clinical.employeeIds.has(candidate.id) && !usedEmployees.has(candidate.id) && !selectedEmployees.includes(candidate.id) &&
        (operation.diagnosticPhysicalWork ? isEmployeeAssignedToOperationalRoom(state, candidate.id, context) : isServiceEmployeeOperational(state, candidate.id, roleId, context)))
      .filter(employee => preferred || employee.homeRoomInstanceId === targetRoom.id || roleId === "staff.periop_nurse" ||
        !hasQueuedHomeRoomWork(state, employee, operation.id))
      .map(employee => ({ employee, path: employeePath(employee, targetRoom) }))
      .filter(plan => roleId === "staff.periop_nurse" || plan.path.length > 0)
      .sort((a, b) => (roleId === "staff.periop_nurse" ? 0 : compareStaffHomePreference(a.employee, b.employee, targetRoom.id) || a.path.length - b.path.length) || a.employee.id.localeCompare(b.employee.id));
    const scoped = available.filter(plan => !preferred || preferred.employeeIds.includes(plan.employee.id));
    // Anonymous legacy reservations reserve a quantity, not the first ranked
    // home employee. Keep enough staff unused while taking the best spare.
    const anonymousCount = clinical.staffRoleCounts.get(roleId) ?? 0;
    const plan = roleId === "staff.periop_nurse" ? scoped[anonymousCount] : available.length > anonymousCount ? scoped[0] : undefined;
    if (!plan) return false;
    selectedEmployees.push(plan.employee.id);
    employeePlans.push(plan);
  }

  const providerPhase = reservationPhases.find((phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible);
  const firstRoom = rooms[0];
  if (!firstRoom) return false;
  const providerRoom = providerPhase?.roomDefinitionId
    ? rooms.find((room) => room?.roomDefinitionId === providerPhase.roomDefinitionId) ?? firstRoom
    : firstRoom;
  const providerDefinition = getRoomDefinition(providerRoom.roomDefinitionId, context)!;
  const providerTarget = preferred?.staffAnchor ?? getRoomNavigationAnchor(providerRoom, providerDefinition, "staff");
  const staffPath = (location: GridPoint, room: NonNullable<typeof firstRoom>, actor: "provider" | "nurse", fallback: GridPoint) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context)!;
    const targets = usesApprovedProcedureStaffSpots(room, definition)
      ? getProcedureStaffStandingSpots(room, definition, state.doors, actor).map((spot) => spot.anchor)
      : [fallback];
    for (const target of targets) {
      const roomIds = new Set([room.id]);
      const ordinary = findCareAwareFacilityPath(state, context, location, target, roomIds);
      const path = ordinary.length > 0 ? ordinary : findRouteFromDisplacedLocationToPoint(state, context, location, target, roomIds);
      if (path.length) return path;
    }
    return [];
  };
  let provider: ServiceOperationState["providerReservation"] = null;
  let providerEmployeePlan: { employee: GameState["employees"][number]; path: GridPoint[] } | null = null;
  if (providerPhase) {
    const specialistPriority = providerPhase.providerRoleDefinitionIds?.some(isProceduralSpecialistRole);
    const candidates = state.employees
      .filter((candidate) => providerPhase.providerRoleDefinitionIds?.includes(candidate.staffRoleDefinitionId) &&
        (specialistPriority || !preferred || preferred.provider?.kind === "employee" && preferred.provider.employeeId === candidate.id) &&
        !isEmployeeAwayForTraining(candidate) && !selectedEmployees.includes(candidate.id) &&
        (specialistPriority || operation.diagnosticPhysicalWork ? isEmployeeAssignedToOperationalRoom(state, candidate.id, context) : isEmployeeOperational(state, candidate.id, context)))
      .filter(employee => preferred || employee.homeRoomInstanceId === providerRoom.id || !hasQueuedHomeRoomWork(state, employee, operation.id))
      .map((employee) => ({ employee, path: staffPath(employee.location, providerRoom, "provider", providerTarget) }))
      .filter((candidate) => candidate.path.length > 0)
      .sort((a, b) => compareStaffHomePreference(a.employee, b.employee, providerRoom.id) || a.path.length - b.path.length || a.employee.id.localeCompare(b.employee.id));
    providerEmployeePlan = candidates.find(({ employee }) => !employee.facilityTask && !clinical.employeeIds.has(employee.id) && !usedEmployees.has(employee.id)) ?? null;
    if (providerEmployeePlan) provider = { kind: "employee", employeeId: providerEmployeePlan.employee.id };
    else if (specialistPriority && candidates.some(({ employee }) => getProceduralSpecialistReadyAt(state, employee, context) <= state.facilityTick + PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES)) return false;
    else if (
      providerPhase.founderEligible &&
      (specialistPriority || !preferred || preferred.provider?.kind === "founder") &&
      (state.environment.founderActivity === null ||
        ["return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(
          state.environment.founderActivity.kind,
        )) &&
      !clinical.founderReserved &&
      !founderHasActiveServiceOperation(state)
    ) provider = { kind: "founder" };
    else return false;
  }

  const firstDefinition = getRoomDefinition(firstRoom.roomDefinitionId, context)!;
  const reservedRoomIds = new Set(rooms.map((room) => room!.id));
  const patientTarget = preferred?.patientAnchor ?? (bedReservation
    ? bedReservation.endpoint
    : desiredStation === "periop_preparation"
    ? (getRoomWaitingAnchors(firstRoom, firstDefinition)[0] ??
      getRoomNavigationAnchor(firstRoom, firstDefinition, "primary"))
    : firstRoom.roomDefinitionId === "room.phlebotomy"
      ? getRoomCareAnchor(firstRoom, firstDefinition, "patient")
      : getRoomNavigationAnchor(firstRoom, firstDefinition, "primary"));
  let actorPath: GridPoint[] = [];
  if (operation.actorKind !== "remote") {
    actorPath = operation.location
      ? (() => {
          const ordinary = operation.actorKind === "visitor"
            ? pathServiceVisitorFromCurrentLocation(state, context, operation.location!, patientTarget, reservedRoomIds)
            : findCareAwareFacilityPath(state, context, operation.location!, patientTarget, reservedRoomIds);
          return ordinary.length > 0
            ? ordinary
            : findRouteFromDisplacedLocationToPoint(state, context, operation.location!, patientTarget, reservedRoomIds);
        })()
      : [];
    if (actorPath.length === 0) return false;
  }

  if (employeePlans.some(plan => plan.path.length === 0)) return false;
  if (bedReservation && !hasInstalledPeriopNurse(state, context)) return false;
  let founderPath: GridPoint[] | null = null;
  if (provider?.kind === "founder") {
    founderPath = staffPath(state.environment.founderLocation, providerRoom, "provider", providerTarget);
    if (founderPath.length === 0) return false;
  }

  operation.reservedRoomInstanceIds = rooms.map((room) => room!.id);
  operation.reservedEmployeeIds = selectedEmployees;
  operation.providerReservation = provider;
  bindServiceOperationTraining(state, operation, reservationPhases.map((_, index) => operation.phaseFlowVersion === 1 ? operation.phaseIndex : index));
  operation.path = actorPath;
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  operation.status = movementStatus;
  if (bedReservation) operation.periopBedReservation = {
    ...bedReservation,
    endpoint: { ...bedReservation.endpoint },
  };
  if (operation.diagnosticPhysicalWork) {
    const binding = operation.diagnosticPhysicalWork.phaseBindings[operation.phaseIndex]!;
    binding.resource = { roomInstanceId: firstRoom.id, roomDefinitionId: firstRoom.roomDefinitionId,
      stationId: bedReservation?.bedId ?? null, employeeIds: [...selectedEmployees], provider: provider ? { ...provider } : null,
      patientAnchor: { ...patientTarget }, staffAnchor: { ...(providerEmployeePlan?.path.at(-1) ?? founderPath?.at(-1) ?? providerTarget) } };
  }
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

function operationInsideRoom(
  state: GameState,
  operation: ServiceOperationState,
  roomId: string,
  context: DomainContext,
): boolean {
  const location = operationLocation(state, operation);
  return Boolean(location && pointInsideRoom(state, location, roomId, context));
}

function pointInsideRoom(
  state: GameState,
  point: GridPoint,
  roomId: string,
  context: DomainContext,
): boolean {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  if (!room || !definition) return false;
  const footprint = getRotatedFootprint(definition, room.orientation);
  return point.x >= room.x && point.x < room.x + footprint.width &&
    point.y >= room.y && point.y < room.y + footprint.height;
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
): boolean {
  const travel = ensureVisitorTravel(state, operation, context);
  const location = operationLocation(state, operation);
  if (!travel || !location) return false;
  if (samePoint(location, travel.offscreenEndpoint)) return true;
  const final = operation.path.at(-1);
  if (final && samePoint(final, travel.offscreenEndpoint) &&
      !pathEntersUnauthorizedProtectedRoom(
        state, context, operation.path, operation.pathIndex,
      )) return true;
  const continuation = pathServiceVisitorToOffscreenEndpoint(state, context, location, travel.offscreenEndpoint);
  if (continuation.length > 0) {
    setOperationPath(state, operation, continuation, "leaving");
    return true;
  }
  operation.path = [{ ...location }];
  operation.pathIndex = 0;
  operation.lastMovedAtFacilityTick = state.facilityTick;
  return false;
}

function currentReservationPhases(
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
): readonly FrozenOperationPhase[] {
  const phases = operationPhases(operation, line);
  return operation.phaseFlowVersion === 1 || operation.phaseIndex > 0
    ? phases.slice(operation.phaseIndex, operation.phaseIndex + 1)
    : phases;
}

function currentOperationRoomIds(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
): string[] {
  if (operation.periopBedReservation && isPeriopBedPhase(operation, line)) {
    return [operation.periopBedReservation.roomInstanceId];
  }
  const definitionIds = new Set(
    currentReservationPhases(operation, line)
      .map((phase) => phase.roomDefinitionId)
      .filter((id): id is string => Boolean(id)),
  );
  return operation.reservedRoomInstanceIds.filter((roomId) => {
    const room = state.rooms.find((candidate) => candidate.id === roomId);
    return Boolean(room && definitionIds.has(room.roomDefinitionId));
  });
}

function operationActorTarget(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
): { point: GridPoint; roomIds: Set<string> } | null {
  if (operation.periopBedReservation && isPeriopBedPhase(operation, line)) {
    return {
      point: { ...operation.periopBedReservation.endpoint },
      roomIds: new Set([operation.periopBedReservation.roomInstanceId]),
    };
  }
  const frozenResource = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource;
  if (frozenResource) return { point: { ...frozenResource.patientAnchor }, roomIds: new Set([frozenResource.roomInstanceId]) };
  const phase = currentReservationPhases(operation, line)[0];
  const room = phase?.roomDefinitionId
    ? operation.reservedRoomInstanceIds
        .map((id) => state.rooms.find((candidate) => candidate.id === id))
        .find((candidate) => candidate?.roomDefinitionId === phase.roomDefinitionId)
    : null;
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  if (!room || !definition) return null;
  const desiredStation = phase?.roomStationId ?? null;
  const point = desiredStation === "periop_preparation"
    ? (getRoomWaitingAnchors(room, definition)[0] ??
      getRoomNavigationAnchor(room, definition, "primary"))
    : room.roomDefinitionId === "room.phlebotomy"
      ? getRoomCareAnchor(room, definition, "patient")
      : getRoomNavigationAnchor(room, definition, "primary");
  return { point, roomIds: new Set([room.id]) };
}

function reconcileOperationActorRoute(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
): void {
  if (operation.actorKind === "remote") return;
  const location = operationLocation(state, operation);
  const target = operationActorTarget(state, operation, line, context);
  if (!location || !target) return;
  const exactTarget = isPeriopBedPhase(operation, line) || Boolean(operation.diagnosticPhysicalWork);
  const arrived = exactTarget ? samePoint(location, target.point) : [...target.roomIds].some((roomId) =>
    pointInsideRoom(state, location, roomId, context));
  const routeIsUnsafe = pathEntersUnauthorizedProtectedRoom(
    state, context, operation.path, operation.pathIndex, target.roomIds,
  );
  const continuing = operation.pathIndex < operation.path.length - 1 &&
    samePoint(operation.path[operation.pathIndex] ?? null, location) && samePoint(operation.path.at(-1) ?? null, target.point) &&
    state.facilityTick - operation.lastMovedAtFacilityTick < WAIT_TIMEOUT_MINUTES;
  if (!routeIsUnsafe && (continuing || arrived)) return;
  const replanned = findRouteFromDisplacedLocationToPoint(
    state, context, location, target.point, target.roomIds,
  );
  if (replanned.length > 0) {
    setOperationPath(state, operation, replanned, operation.status);
    return;
  }
  setOperationPath(state, operation, [{ ...location }], operation.status);
  operation.resourceWaitReason = "Waiting for a connected route to the care room.";
}

/** Load/tick watchdog: repair missing physical journeys without restarting an
 * accepted phase or charging/crediting work. MAX_SAFE_INTEGER is a legitimate
 * resource queue deadline, never proof that care is complete. */
export function reconcileServiceOperationFlow(state: GameState, context: DomainContext): void {
  for (const operation of state.serviceOperations) {
    if (!active(operation)) continue;
    const line = operationIncomeLine(operation);
    if (!line?.operation) continue;
    const phases = operationPhases(operation, line);
    if (!operation.periopNurseAttention && operation.status === "waiting_for_next_phase" && operation.periopBedReservation &&
        phases[0]?.roomStationId === "periop_preparation" && phases.some((phase) => phase.roomStationId === "periop_recovery")) {
      operation.phaseFlowVersion = operation.periopBedFlowVersion = 1;
      operation.nextPhaseReadyAtFacilityTick ??= operation.createdAtFacilityTick;
    }
    const task = getCurrentPeriopNurseAttention(operation);
    if (operation.status === "waiting_for_next_phase" && task?.readyAtFacilityTick !== null &&
        task?.readyAtFacilityTick !== undefined && task.completedAtFacilityTick === null) {
      // A transition without its attention witness must finish the current task.
      operation.status = "in_service";
      operation.phaseStartedAtFacilityTick = task.readyAtFacilityTick;
      operation.phaseEndsAtFacilityTick = Math.max(task.requiredUntilFacilityTick ?? state.facilityTick, state.facilityTick + task.remainingMinutes);
    }
    if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick === null && phases[operation.phaseIndex]) {
      operation.phaseStartedAtFacilityTick ??= state.facilityTick;
      operation.phaseEndsAtFacilityTick = task?.requiredUntilFacilityTick ?? operation.phaseStartedAtFacilityTick + phases[operation.phaseIndex]!.durationMinutes;
      beginPeriopNurseAttention(operation, operation.phaseStartedAtFacilityTick);
    }
    const actorKind = operation.actorKind === "encounter" ? "encounter" : "service_visitor";
    const actorId = operation.actorKind === "encounter" ? operation.actorId : operation.id;
    if (hasActivePatientAmenityTrip(state, actorKind, actorId) || state.retailOperations.some((trip) =>
      !["completed", "cancelled", "abandoned"].includes(trip.status) &&
      (trip.departureServiceOperationId === operation.id || trip.actorKind === actorKind && trip.actorId === actorId))) continue;
    if (operation.periopBedFlowVersion === 1 && operation.status === "waiting_for_next_phase" && !operation.periopBedReservation &&
        !operation.diagnosticPhysicalWork && phases[operation.phaseIndex + 1]?.roomDefinitionId === "room.periop_recovery") {
      operation.periopBedReservation = availablePeriopBedReservation(state, { ...operation, phaseIndex: operation.phaseIndex + 1 }, context, new Set()) ?? undefined;
    }
    if (isPeriopBedPhase(operation, line) && ["in_service", "waiting_for_next_phase", "walking_to_service", "walking_between_phases"].includes(operation.status)) {
      holdResolvedEncounterForActiveOperation(state, operation);
      const location = operationLocation(state, operation);
      const previousBed = operation.periopBedReservation;
      const validBed = availablePeriopBedReservation(state, operation, context, new Set());
      const path = location && validBed
        ? findRouteFromDisplacedLocationToPoint(state, context, location, validBed.endpoint, new Set([validBed.roomInstanceId])) : [];
      if (!validBed || !path.length) {
        // Accepted diagnostic choices are rebound by their existing interruption
        // machinery; ordinary legacy visits can select another free real bed.
        if (!operation.diagnosticPhysicalWork) {
          operation.periopBedReservation = undefined;
          const replacement = availablePeriopBedReservation(state, operation, context, new Set());
          operation.periopBedReservation = replacement ?? (validBed ? previousBed : undefined);
          if (replacement && operation.status !== "waiting_for_next_phase") operation.reservedRoomInstanceIds = [replacement.roomInstanceId];
          else if (!operation.periopBedReservation) operation.reservedRoomInstanceIds = [];
        }
        if (!operation.periopBedReservation) {
          if (operation.status !== "waiting_for_next_phase") queueInterruptedCurrentPhase(state, operation, line);
          operation.resourceWaitReason = "Waiting for a connected peri-op bed.";
          continue;
        }
      }
      reconcileOperationActorRoute(state, operation, line, context);
    }
    const waitingSince = operation.status === "waiting_for_next_phase"
      ? operation.nextPhaseReadyAtFacilityTick ?? operation.createdAtFacilityTick : operation.createdAtFacilityTick;
    if (["waiting_for_resources", "waiting_for_next_phase"].includes(operation.status) && !operation.resourceWaitReason &&
        state.facilityTick - waitingSince >= WAIT_TIMEOUT_MINUTES) {
      const phase = phases[operation.phaseIndex + Number(operation.status === "waiting_for_next_phase")];
      const room = phase?.roomDefinitionId ? getRoomDefinition(phase.roomDefinitionId, context) : null;
      operation.resourceWaitReason = `Waiting for available ${room?.displayName ?? "service"} capacity or a connected route.`;
    }
  }
}

function resourcesArrived(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, context: DomainContext): boolean {
  const phaseRoomIds = currentOperationRoomIds(state, operation, line);
  const actorLocation = operationLocation(state, operation);
  const actorTarget = operationActorTarget(state, operation, line, context);
  const frozenTarget = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource?.patientAnchor;
  const actorArrived = operation.actorKind === "remote" || (frozenTarget ? samePoint(actorLocation, frozenTarget) : Boolean(
    actorLocation && actorTarget && [...actorTarget.roomIds].some((roomId) =>
      pointInsideRoom(state, actorLocation, roomId, context),
    ),
  ));
  const phases = currentReservationPhases(operation, line);
  const employees = [...operation.reservedEmployeeIds, ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : [])];
  const assignedArrived = employees.every((id) => {
    const employee = state.employees.find((candidate) => candidate.id === id);
    if (!employee || employee.facilityTask?.targetId !== operation.id ||
        employee.pathIndex < employee.path.length - 1) return false;
    if (operation.diagnosticPhaseWork?.readingUpgradeWork && (!operation.diagnosticPhaseWork.resource ||
      !samePoint(employee.location, operation.diagnosticPhaseWork.resource.staffAnchor) ||
      !samePoint(employee.path.at(-1) ?? null, operation.diagnosticPhaseWork.resource.staffAnchor))) return false;
    const phase = operation.providerReservation?.kind === "employee" &&
      operation.providerReservation.employeeId === employee.id
      ? phases.find((candidate) => candidate.providerRoleDefinitionIds?.includes(employee.staffRoleDefinitionId))
      : phaseForEmployee(phases, employee.staffRoleDefinitionId);
    const expectedRoomIds = phase?.roomDefinitionId
      ? operation.reservedRoomInstanceIds.filter((roomId) =>
          state.rooms.find((room) => room.id === roomId)?.roomDefinitionId === phase.roomDefinitionId)
      : phaseRoomIds;
    return expectedRoomIds.some((roomId) =>
      pointInsideRoom(state, employee.location, roomId, context),
    );
  }) && (operation.providerReservation?.kind !== "founder" || (() => {
    const activity = state.environment.founderActivity;
    if (activity?.targetId !== operation.id || activity.pathIndex < activity.path.length - 1) return false;
    const providerPhase = phases.find((phase) => phase.founderEligible);
    const expectedRoomIds = providerPhase?.roomDefinitionId
      ? operation.reservedRoomInstanceIds.filter((roomId) =>
          state.rooms.find((room) => room.id === roomId)?.roomDefinitionId === providerPhase.roomDefinitionId)
      : phaseRoomIds;
    return expectedRoomIds.some((roomId) =>
      pointInsideRoom(state, state.environment.founderLocation, roomId, context),
    );
  })());
  return actorArrived && assignedArrived && (Boolean(operation.periopNurseAttention) || !isPeriopBedPhase(operation, line) || Boolean(
    operation.periopBedReservation && hasInstalledPeriopNurse(state, context),
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
    operation.diagnosticPhysicalWork?.remainingPhaseMinutes ??
    (operation.phaseEndsAtFacilityTick === null
      ? phase?.durationMinutes ?? 1
      : Math.max(operation.diagnosticPhysicalWork ? 0 : 1, operation.phaseEndsAtFacilityTick - state.facilityTick));
  if (operation.diagnosticPhysicalWork) {
    operation.diagnosticPhysicalWork.remainingPhaseMinutes = operation.phaseEndsAtFacilityTick === null ? remainingPhaseMinutes : Math.max(0, operation.phaseEndsAtFacilityTick - state.facilityTick);
    const interruptedRoomId = operation.diagnosticPhysicalWork.phaseBindings[operation.phaseIndex]?.resource?.roomInstanceId;
    for (const binding of operation.diagnosticPhysicalWork.phaseBindings) if (binding.resource?.roomInstanceId === interruptedRoomId) binding.resource = null;
  }
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
    remainingPhaseMinutes: operation.diagnosticPhysicalWork?.remainingPhaseMinutes ?? remainingPhaseMinutes,
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
    if (operation.diagnosticPhaseWork) { queueDiagnosticProcessing(state, operation); continue; }
    const line = operationIncomeLine(operation);
    const currentPhase = line ? operationPhases(operation, line)[operation.phaseIndex] : null;
    if (operation.diagnosticPhysicalWork && line) {
      for (const binding of operation.diagnosticPhysicalWork.phaseBindings) if (binding.resource?.roomInstanceId === roomId) binding.resource = null;
      operation.transitionHeldRoomInstanceIds = (operation.transitionHeldRoomInstanceIds ?? []).filter((id) => id !== roomId);
      if (operation.periopBedReservation?.roomInstanceId === roomId) releasePeriopBed(operation);
      if (operation.status === "discharging") { operation.status = "completed"; continue; }
      if (operation.status === "waiting_for_next_phase") {
        releaseResources(state, operation);
        continue;
      }
      if (currentPhase?.roomDefinitionId === roomDefinitionId) queueInterruptedCurrentPhase(state, operation, line);
      continue;
    }
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
    if (operation.diagnosticPhaseWork && operation.diagnosticPhaseWork.resource?.employeeIds.some((id) => employeeIds.has(id))) {
      queueDiagnosticProcessing(state, operation);
      continue;
    }
    const affected = operation.reservedEmployeeIds.some((id) => employeeIds.has(id)) ||
      (operation.providerReservation?.kind === "employee" && employeeIds.has(operation.providerReservation.employeeId));
    if (!affected) continue;
    const line = operationIncomeLine(operation);
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
  if (operation.diagnosticPhaseWork && operation.phaseEndsAtFacilityTick !== null) {
    operation.diagnosticPhaseWork.remainingMinutes = Math.max(0, operation.phaseEndsAtFacilityTick - state.facilityTick);
  }
  if (operation.diagnosticPhysicalWork && operation.phaseEndsAtFacilityTick !== null) {
    operation.diagnosticPhysicalWork.remainingPhaseMinutes = Math.max(0, operation.phaseEndsAtFacilityTick - state.facilityTick);
  }
  releaseResources(state, operation);
  releasePeriopBed(operation);
  operation.cancelledAtFacilityTick = state.facilityTick;
  operation.cancellationReason = reason;
  if (operation.diagnosticPhysicalWork || operation.diagnosticPhaseWork) {
    operation.status = "cancelled";
  } else if (operation.actorKind === "visitor") {
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
  return operationRoomIds(operation).every((id) => isRoomAccessibleForFacilityWork(state, id, context)) &&
    (!operation.periopBedReservation || Boolean(availablePeriopBedReservation(state, operation, context, new Set()))) &&
    [...operation.reservedEmployeeIds, ...(operation.providerReservation?.kind === "employee" ? [operation.providerReservation.employeeId] : [])].every((id) => state.employees.some((employee) => employee.id === id && employee.facilityTask?.targetId === operation.id)) &&
    (operation.providerReservation?.kind !== "founder" || state.environment.founderActivity?.targetId === operation.id);
}

function credit(state: GameState, operation: ServiceOperationState, context: DomainContext): void {
  if (operation.diagnosticPhaseWork) {
    const work = operation.diagnosticPhaseWork;
    if (work.kind === "interpretation" && work.readIncomeFee !== undefined && work.resource?.employeeIds[0]) {
      creditRadiologistRead(state, "in_house", `income.diagnostic-read.${work.orderId}.${work.phaseId}`,
        work.resource.employeeIds[0], work.readIncomeFee, context);
    } else if (work.kind === "interpretation") {
      recordRadiologistReadCompletion(state, "in_house", 0, context);
    }
    return;
  }
  if (operation.diagnosticPhysicalWork?.billing === "none") return;
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
  // Only accepted legacy split work carries a withheld read portion.
  // New additive reads leave the complete acquisition quote payable here.
  const amount = operation.quoteFee - (operation.diagnosticPhysicalWork?.readIncomeFee ?? 0);
  state.serviceIncomeReceipts.push({ id: `${transactionKey}.${state.nextServiceIncomeReceiptSequence++}`, transactionKey, incomeLineId: operation.incomeLineId, catalogVersion: 1, routeId: null, actorKind: operation.actorKind === "encounter" ? "patient" : operation.actorKind === "visitor" ? "visitor" : "remote", actorId: operation.actorId, ...(displayAnchor ? { displayAnchor } : {}), grossAmount: amount, stockCost: 0, netCashDelta: amount, completedAtFacilityTick: state.facilityTick });
  state.cashCents = Math.max(0, state.cashCents + Math.round(amount * 100));
  state.cash = state.cashCents / 100;
  if (operation.incomeLineId === "income.image_read") recordRadiologistReadCompletion(state, "in_house", amount, context);
}

function beginPhase(state: GameState, operation: ServiceOperationState, line: ServiceIncomeLine, readingStart?: number): void {
  const phase = operationPhases(operation, line)[operation.phaseIndex]!;
  const reading = operation.diagnosticPhaseWork?.readingUpgradeWork;
  if (reading && reading.durationMinutes === null) {
    const work = operation.diagnosticPhaseWork!;
    work.durationMinutes = work.remainingMinutes = bindReadingUpgradeWork(reading, work.resource!.roomInstanceId);
    phase.durationMinutes = work.durationMinutes;
  }
  const starts = reading ? readingStart ?? state.facilityTick : state.facilityTick;
  if (operation.actorKind === "encounter" && !operation.diagnosticPhaseWork && phase.roomDefinitionId !== null) {
    const encounter = state.encounters[operation.actorId];
    if (encounter) completeWaitingRoomExperience(encounter, state.facilityTick);
  }
  bindServiceOperationRecoveryExperience(state, operation);
  bindServiceOperationRoomRevenue(state, operation);
  operation.status = "in_service";
  operation.phaseStartedAtFacilityTick = starts;
  operation.phaseEndsAtFacilityTick = starts +
    (operation.diagnosticPhaseWork?.remainingMinutes ?? operation.saleTransfer?.remainingPhaseMinutes ?? operation.diagnosticPhysicalWork?.remainingPhaseMinutes ?? phase.durationMinutes);
  beginPeriopNurseAttention(operation, starts);
  if (operation.diagnosticPhysicalWork) {
    operation.diagnosticPhysicalWork.remainingPhaseMinutes = operation.phaseEndsAtFacilityTick - state.facilityTick;
    const witness = operation.diagnosticPhysicalWork.phaseWitnesses[operation.phaseIndex]!;
    if (witness.startedAtFacilityTick === null) witness.startedAtFacilityTick = state.facilityTick;
  }
  operation.saleTransfer = undefined;
  if (operation.startedAtFacilityTick === null) operation.startedAtFacilityTick = starts;
}

function releaseCompletedPhase(
  state: GameState,
  operation: ServiceOperationState,
  line: ServiceIncomeLine,
  context: DomainContext,
  retainCompletedRoom = false,
): void {
  const phases = operationPhases(operation, line);
  const completedPhase = phases[operation.phaseIndex]!;
  completeServiceOperationRecoveryExperience(state, operation);
  const completedRoomId = completedPhase.roomDefinitionId
    ? operation.reservedRoomInstanceIds.find((roomId) =>
        state.rooms.find((room) => room.id === roomId)?.roomDefinitionId === completedPhase.roomDefinitionId,
      )
    : undefined;
  if (completedRoomId && !operation.diagnosticPhaseWork && operation.diagnosticPhysicalWork?.billing !== "none") {
    recordLevelThreeRoomUse(state, completedRoomId, `service:${operation.id}:phase:${operation.phaseIndex}`, context);
  }
  if (completedPhase.roomDefinitionId === "room.endoscopy" ||
      completedPhase.roomDefinitionId === "room.ambulatory_or") {
    const roomInstanceId = operation.reservedRoomInstanceIds.find(
      (roomId) => state.rooms.find((room) => room.id === roomId)?.roomDefinitionId === completedPhase.roomDefinitionId,
    );
    if (roomInstanceId) {
      operation.completedCareProvenance = {
        version: "completed-care-provenance.v1",
        roomInstanceId,
        provider: operation.providerReservation
          ? { ...operation.providerReservation }
          : null,
      };
    }
  }
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
  operation.periopBedReservation = candidate.periopBedReservation;
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
  credit(state, operation, context);
  releaseCompletedPhase(state, operation, line, context);
  releaseResources(state, operation);
  operation.phaseIndex += 1;
  operation.completedAtFacilityTick = state.facilityTick;
  operation.nextPhaseReadyAtFacilityTick = null;
  operation.status = "discharging";
  if (operation.diagnosticPhysicalWork) return;
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
  releaseCompletedPhase(state, operation, line, context);
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
  if (operation.diagnosticPhysicalWork) {
    const witness = operation.diagnosticPhysicalWork.phaseWitnesses[operation.phaseIndex];
    if (witness) witness.completedAtFacilityTick = state.facilityTick;
    operation.diagnosticPhysicalWork.remainingPhaseMinutes = null;
  }
  if (operation.diagnosticPhaseWork) operation.diagnosticPhaseWork.remainingMinutes = 0;
  if (operation.periopBedFlowVersion === 1) {
    movePeriopBedFlowToNextPhase(state, operation, line, context, departurePlanner);
    return;
  }
  const nextPhase = operationPhases(operation, line)[operation.phaseIndex + 1];
  if (!nextPhase) {
    credit(state, operation, context);
    releaseCompletedPhase(state, operation, line, context);
    operation.phaseIndex += 1;
    releaseResources(state, operation);
    operation.completedAtFacilityTick = operation.diagnosticPhaseWork?.readingUpgradeWork ? operation.phaseEndsAtFacilityTick : state.facilityTick;
    if (operation.diagnosticPhysicalWork) {
      operation.status = "completed";
    } else if (operation.actorKind === "visitor") {
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
    releaseCompletedPhase(state, operation, line, context, true);
    operation.status = "waiting_for_next_phase";
    operation.phaseStartedAtFacilityTick = null;
    operation.phaseEndsAtFacilityTick = null;
    tryReserveNextPhase(state, operation, line, context);
    return;
  }
  releaseCompletedPhase(state, operation, line, context);
  operation.phaseIndex += 1;
  const phase = nextPhase;
  const roomId = operation.reservedRoomInstanceIds.find((id) => state.rooms.find((room) => room.id === id)?.roomDefinitionId === phase.roomDefinitionId);
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  const location = operationLocation(state, operation);
  if (!room || !definition || !location) { cancel(state, operation, "The next service phase became unavailable.", context, departurePlanner); return; }
  operation.path = findCareAwareFacilityPath(
    state, context, location, getRoomNavigationAnchor(room, definition, "primary"), new Set([room.id]),
  );
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
  const frozenPhases = periopPhases ?? line.operation?.phases.map(cloneOperationPhase) ?? [];
  const trainingTiming: NonNullable<ServiceOperationState["trainingTiming"]> = {
    version: "employee-training-timing.v1", categoryPercents: snapshotEmployeeTrainingCategories(state),
    phases: frozenPhases.map((phase) => ({ phaseId: phase.id, baselineMinutes: phase.durationMinutes, boundPercent: null })),
  };
  return { periopNurseAttention: periopPhases ? createPeriopNurseAttention(state, frozenPhases, trainingTiming?.categoryPercents["staff.periop_nurse"]) : undefined, roomUpgradeRecovery: actorKind === "encounter" ? createRoomUpgradeRecoveryQuote(state, frozenPhases) : undefined, id, incomeLineId: line.id, catalogVersion: 1, actorKind, actorId: actualActorId, displayName: encounter?.patientDisplayName ?? (actorKind === "visitor" ? createPatientDisplayName(state.campaignSeed, actualActorId, undefined, excludedDisplayNames) : line.displayName), appearance: encounter?.patientAppearance ?? (actorKind === "visitor" ? createPatientPixelAppearance(state.campaignSeed, actualActorId, {}, "patient", getPatientAppearanceSelectionContext(state)) : null), status: actorKind === "visitor" ? "arriving" : "waiting_for_resources", createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + WAIT_TIMEOUT_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: actorKind === "visitor" ? line.scheduledVisitorFee ?? line.fee : line.fee, roomUpgradeRevenue: createRoomUpgradeRevenueQuote(state, actorKind === "visitor" ? line.scheduledVisitorFee ?? line.fee : line.fee, frozenPhases.map((phase) => phase.roomDefinitionId)), phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null, location: actorKind === "visitor" ? endpoint : encounter?.patientLocation ?? entrance?.outside ?? null, path: arrivalPath, pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null, frozenOperationPhases: frozenPhases, trainingTiming, ...(actorKind === "visitor" && endpoint ? { visitorTravel: { version: "service-visitor-travel.v1" as const, offscreenEndpoint: endpoint, arrivedAtFacilityTick: null } } : {}), ...(actorKind === "encounter" ? { resourceQueueVersion: 1 as const } : {}), ...(periopPhases ? { phaseFlowVersion: 1 as const, periopBedFlowVersion: 1 as const, nextPhaseReadyAtFacilityTick: null, transitionHeldRoomInstanceIds: [] } : {}) };
}

export function startServiceOperation(state: GameState, lineId: string, actorKind: "visitor" | "remote", context: DomainContext): string | null {
  const line = getServiceIncomeLine(lineId);
  if (!line?.operation || line.kind === "retail" || !installedAndOperational(state, line, context)) return null;
  if (line.operation.encounterOnly) return null;
  if (
    (actorKind === "remote" && line.operation.visitorMode !== "work_queue") ||
    (actorKind === "visitor" && line.operation.visitorMode === "work_queue")
  ) return null;
  if (actorKind === "remote" && line.operation.visitorMode === "work_queue") {
    if (!getRemoteWorkQueueAvailability(state, lineId, context).canStart) return null;
  } else if (actorKind === "visitor" && isCapacityScaledScheduledLine(line)) {
    const capacity = isScheduledEndoscopyLine(line)
      ? getFunctionalScheduledEndoscopyCapacity(state, context)
      : getFunctionalScheduledAmbulatoryOperationCapacity(state, context);
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

/** New accepted patient work uses the frozen plan, with the existing paid engine. */
export function startDiagnosticAcquisitionOperation(
  state: GameState,
  encounter: EncounterState,
  plan: DiagnosticOrderPlan,
  componentId: string | null,
  lineId: string | null,
  testChoiceOrder: NonNullable<ServiceOperationState["testChoiceOrder"]>,
  context: DomainContext,
): string | null {
  if (plan.execution !== "supported" || plan.encounterId !== encounter.id) return null;
  const existing = state.serviceOperations.find((operation) => operation.diagnosticPhysicalWork?.orderId === plan.orderId &&
    operation.diagnosticPhysicalWork.componentId === componentId);
  if (existing) return existing.id;
  if (encounterHasActiveServiceOperation(state, encounter.id)) return null;
  const physical = plan.phases.filter((phase) => phase.componentId === componentId && phase.mode === "local" && phase.patientPresent && phase.requirement);
  const currentIndex = physical.findIndex((phase) => phase.status !== "completed");
  if (currentIndex < 0 || physical.some((phase) => phase.status === "cancelled")) return null;
  const current = physical[currentIndex]!;
  if (!current.dependsOn.every((id) => plan.phases.find((phase) => phase.id === id)?.status === "completed")) return null;
  // A nonbillable physical operation still needs a catalog identity for the
  // legacy engine. Its frozen requirements, never this template, bind work.
  const source = plan.sources.find((entry) => entry.componentId === componentId);
  const frozenLineId = source?.incomeLineId ?? lineId;
  const frozenPhases: FrozenOperationPhase[] = physical.map((phase) => ({
    id: phase.operationPhaseId ?? phase.id,
    roomDefinitionId: phase.requirement!.roomDefinitionId,
    durationMinutes: phase.durationMinutes,
    staffRoleDefinitionIds: [...phase.requirement!.staffRoleDefinitionIds],
    ...(phase.requirement!.providerRoleDefinitionIds.length ? { providerRoleDefinitionIds: [...phase.requirement!.providerRoleDefinitionIds] } : {}),
    ...(phase.requirement!.founderEligible ? { founderEligible: true as const } : {}),
    ...(phase.kind === "preparation" ? { roomStationId: "periop_preparation" as const } :
      phase.kind === "recovery" && phase.requirement!.stationKind === "periop_bed" ? { roomStationId: "periop_recovery" as const } : {}),
  }));
  const line = diagnosticPhysicalIncomeLine(getServiceIncomeLine(frozenLineId ?? "income.ultrasound"), frozenPhases);
  if (!line?.operation) return null;
  const operation = createOperation(state, line, "encounter", encounter.id, encounter, context);
  if (!operation) return null;
  operation.frozenOperationPhases = frozenPhases;
  operation.trainingTiming = undefined;
  operation.periopNurseAttention = plan.periopNurseAttentionQuote
    ? createPeriopNurseAttention(state, frozenPhases, plan.periopNurseAttentionQuote.trainingPercent) : undefined;
  operation.phaseFlowVersion = 1;
  operation.periopBedFlowVersion = operation.frozenOperationPhases.some((phase) => phase.roomStationId === "periop_recovery") ? 1 : undefined;
  operation.phaseIndex = currentIndex;
  operation.nextPhaseReadyAtFacilityTick = null;
  operation.transitionHeldRoomInstanceIds = [];
  operation.waitDeadlineFacilityTick = Number.MAX_SAFE_INTEGER;
  operation.quoteFee = source?.quoteFee ?? (frozenLineId === null ? 0 : operation.quoteFee);
  // The plan is the original acceptance contract. Older plans must not inherit
  // the factory's new opt-in snapshot when they dispatch after an upgrade.
  operation.roomUpgradeRevenue = cloneRoomUpgradeRevenueQuote(source?.roomUpgradeRevenue);
  operation.roomUpgradeRecovery = cloneRoomUpgradeRecoveryQuote(source?.roomUpgradeRecovery, frozenPhases);
  operation.testChoiceOrder = { ...testChoiceOrder };
  operation.diagnosticPhysicalWork = {
    version: "diagnostic-physical-work.v1", orderId: plan.orderId, encounterId: encounter.id, componentId,
    billing: frozenLineId === null ? "none" : "existing_service",
    ...(source?.readIncomeFee !== undefined && source.readIncomeBilling !== "additive" && frozenLineId !== null ? { readIncomeFee: source.readIncomeFee } : {}),
    phaseBindings: physical.map((phase, index) => ({ diagnosticPhaseId: phase.id, operationPhaseId: operation.frozenOperationPhases![index]!.id,
      resource: phase.resource ? JSON.parse(JSON.stringify(phase.resource)) as DiagnosticResourceChoice : null })),
    phaseWitnesses: physical.map((phase, index) => ({ operationPhaseId: operation.frozenOperationPhases![index]!.id,
      startedAtFacilityTick: phase.startedAtTick, completedAtFacilityTick: phase.completedAtTick })),
    remainingPhaseMinutes: current.remainingMinutes,
  };
  encounter.patientMovement = null;
  state.serviceOperations.push(operation);
  if (tryReserve(state, operation, line, context) && resourcesArrived(state, operation, line, context)) beginPhase(state, operation, line);
  return operation.id;
}

/** Pays the frozen read fee: additive for new work, held portion for old splits. */
export function startDiagnosticProcessingOperation(
  state: GameState,
  plan: DiagnosticOrderPlan,
  phaseId: string,
  context: DomainContext,
): string | null {
  if (plan.execution !== "supported") return null;
  const existing = state.serviceOperations.find((operation) => operation.diagnosticPhaseWork?.orderId === plan.orderId && operation.diagnosticPhaseWork.phaseId === phaseId);
  if (existing) return existing.id;
  const phase = plan.phases.find((entry) => entry.id === phaseId);
  if (!phase || phase.mode !== "local" || phase.patientPresent || !phase.requirement ||
    (phase.kind !== "interpretation" && phase.kind !== "laboratory_processing" && phase.kind !== "pathology") ||
    phase.status === "completed" || phase.status === "cancelled" ||
    !phase.dependsOn.every((id) => plan.phases.find((entry) => entry.id === id)?.status === "completed")) return null;
  const line = getServiceIncomeLine(phase.kind === "interpretation" ? "income.image_read" : "income.laboratory_processing")!;
  // A late factory inherits the original accepted inputs, never current bonuses.
  enableReadingPhase(plan, phase, state.facilityTick);
  const operation = createOperation(state, line, "remote", plan.encounterId, undefined, context);
  if (!operation) return null;
  operation.quoteFee = 0;
  operation.roomUpgradeRevenue = undefined;
  operation.roomUpgradeRecovery = undefined;
  operation.location = null;
  operation.waitDeadlineFacilityTick = Number.MAX_SAFE_INTEGER;
  operation.frozenOperationPhases = [{ id: phase.id, roomDefinitionId: phase.requirement.roomDefinitionId,
    durationMinutes: phase.durationMinutes, staffRoleDefinitionIds: [...phase.requirement.staffRoleDefinitionIds] }];
  operation.trainingTiming = undefined;
  operation.diagnosticPhaseWork = { version: "diagnostic-phase-work.v1", orderId: plan.orderId, encounterId: plan.encounterId,
    phaseId: phase.id, kind: phase.kind, billing: "none", durationMinutes: phase.durationMinutes, remainingMinutes: phase.remainingMinutes,
    resource: phase.resource ? JSON.parse(JSON.stringify(phase.resource)) as DiagnosticResourceChoice : null };
  const source = plan.sources.find((entry) => entry.componentId === phase.componentId);
  if (phase.kind === "interpretation" && source?.readIncomeFee !== undefined) operation.diagnosticPhaseWork.readIncomeFee = source.readIncomeFee;
  if (phase.readingUpgradeWork) operation.diagnosticPhaseWork.readingUpgradeWork = JSON.parse(JSON.stringify(phase.readingUpgradeWork));
  state.serviceOperations.push(operation);
  tryReserveDiagnosticProcessing(state, operation, line, context);
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
      isCapacityScaledScheduledLine(line) &&
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
    ? dueLines.filter(({ line }) => isCapacityScaledScheduledLine(line))
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
      if (!isCapacityScaledScheduledLine(line)) {
        state.lastServiceAppointmentArrivalTick = state.facilityTick;
      }
      state.lastServiceAppointmentLineId = line.id;
      state.lastServiceAppointmentTicks[line.id] = state.facilityTick;
      state.nextServiceAppointmentTicks[line.id] = state.facilityTick + cadence;
      return;
    }
  }
}

/** Concrete seated continuity, shared with the nonmutating Reading forecast. */
export function hasReadingStationContinuity(state: GameState, operation: ServiceOperationState, context: DomainContext, end: number): boolean {
  const resource = operation.diagnosticPhaseWork?.resource;
  const employee = resource ? state.employees.find((entry) => entry.id === resource.employeeIds[0]) : null;
  const line = operationIncomeLine(operation);
  if (!operation.diagnosticPhaseWork?.readingUpgradeWork || operation.status !== "in_service" || !resource || !employee || !line ||
    employee.lastMovedAtFacilityTick > Math.floor(end) || isEmployeeAwayForTraining(employee) ||
    !resourcesArrived(state, operation, line, context) || !validateReservedResources(state, operation, context) ||
    !diagnosticProcessingChoices(state, operation, context).some((choice) => sameDiagnosticChoice(choice, resource))) return false;
  if (state.serviceOperations.some((other) => other.id !== operation.id && active(other) && other.reservedEmployeeIds.includes(employee.id)) ||
    state.retailOperations.some((trip) => !["completed", "cancelled", "abandoned"].includes(trip.status) && (trip.servingEmployeeId === employee.id || trip.actorKind === "employee" && trip.actorId === employee.id)) ||
    Object.values(state.employeeDiscussions ?? {}).some((discussion) => discussion.employeeId === employee.id && discussion.lifecycle !== "resolved" && discussion.lifecycle !== "cancelled") ||
    state.environment.founderActivity?.kind === "praise_employee" && state.environment.founderActivity.targetId === employee.id) return false;
  return true;
}

const readingOrder = compareReadingOperations;

/** Reading alone drains exact seated handoffs; all observation/travel stays integral. */
function advanceDiagnosticReading(state: GameState, context: DomainContext): void {
  const reads = state.serviceOperations.filter((operation) => operation.diagnosticPhaseWork?.kind === "interpretation" && active(operation)).sort(readingOrder);
  for (const operation of reads) {
    const resource = operation.diagnosticPhaseWork!.resource;
    const line = operationIncomeLine(operation)!;
    if ((operation.status === "in_service" || operation.status === "walking_to_service") &&
      (!resource || !diagnosticProcessingChoices(state, operation, context).some((choice) => sameDiagnosticChoice(choice, resource)) ||
        !validateReservedResources(state, operation, context) || operation.status === "in_service" && operation.diagnosticPhaseWork!.readingUpgradeWork && !resourcesArrived(state, operation, line, context))) {
      queueDiagnosticProcessing(state, operation);
    }
    if (operation.status === "walking_to_service" && resourcesArrived(state, operation, line, context)) beginPhase(state, operation, line);
  }
  const due = reads.filter((operation) => operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null && operation.phaseEndsAtFacilityTick <= state.facilityTick)
    .sort((a, b) => a.phaseEndsAtFacilityTick! - b.phaseEndsAtFacilityTick! || readingOrder(a, b));
  const tokens: Array<ReadingHandoff & { source: ServiceOperationState }> = [];
  for (const operation of due) {
    const end = operation.phaseEndsAtFacilityTick!;
    if (Math.ceil(end) === state.facilityTick && hasReadingStationContinuity(state, operation, context, end)) {
      tokens.push({ resource: JSON.parse(JSON.stringify(operation.diagnosticPhaseWork!.resource)), atTick: end, source: operation });
    }
    moveToNextPhase(state, operation, operationIncomeLine(operation)!, context);
  }
  if (due.length) earmarkQueuedEmployeeTrainingDepartures(state, context);
  // An inherited token is proof from this dispatch, even though our own
  // zero-distance reservation updates the integer last-movement bookkeeping.
  while (tokens.length) {
    tokens.sort((a, b) => a.atTick - b.atTick || readingOrder(a.source, b.source));
    const token = tokens.shift()!;
    const successor = reads.find((operation) => operation.status === "waiting_for_resources" &&
      operation.diagnosticPhaseWork!.readingUpgradeWork?.readyAtTick !== null && operation.diagnosticPhaseWork!.readingUpgradeWork?.readyAtTick !== undefined &&
      operation.diagnosticPhaseWork!.readingUpgradeWork!.readyAtTick! <= token.atTick &&
      tryReserveDiagnosticProcessing(state, operation, operationIncomeLine(operation)!, context, token));
    if (!successor || successor.status !== "in_service" || successor.phaseEndsAtFacilityTick! > state.facilityTick) continue;
    const end = successor.phaseEndsAtFacilityTick!;
    moveToNextPhase(state, successor, operationIncomeLine(successor)!, context);
    tokens.push({ ...token, atTick: end, source: successor });
  }
  for (const operation of reads) if (operation.status === "waiting_for_resources") {
    tryReserveDiagnosticProcessing(state, operation, operationIncomeLine(operation)!, context);
    if ((operation as ServiceOperationState).status === "in_service" && operation.phaseEndsAtFacilityTick! <= state.facilityTick) {
      moveToNextPhase(state, operation, operationIncomeLine(operation)!, context);
    }
  }
}

export function advanceServiceOperations(
  state: GameState,
  context: DomainContext,
  waitingPlanner?: WaitingDestinationPlanner,
  departurePlanner?: EncounterDeparturePlanner,
): void {
  releaseLegacyPeriopCoverage(state);
  scheduleArrivals(state, context);
  advanceOutsideRadiologyReads(state, context, false);
  advanceDiagnosticReading(state, context);
  reconcileServiceOperationFlow(state, context);
  advancePeriopNurseAttention(state, context);
  for (const operation of state.serviceOperations) {
    const line = operationIncomeLine(operation);
    if (!line?.operation) continue;
    if (operation.status === "completed" || operation.status === "cancelled") continue;
    if (operation.diagnosticPhaseWork?.kind === "interpretation") continue;
    if (operation.diagnosticPhaseWork) {
      const resource = operation.diagnosticPhaseWork.resource;
      if ((operation.status === "in_service" || operation.status === "walking_to_service") &&
        (!resource || !diagnosticProcessingChoices(state, operation, context).some((choice) => sameDiagnosticChoice(choice, resource)) ||
          !validateReservedResources(state, operation, context))) queueDiagnosticProcessing(state, operation);
      if (operation.status === "waiting_for_resources") tryReserveDiagnosticProcessing(state, operation, line, context);
      else if (operation.status === "walking_to_service" && resourcesArrived(state, operation, line, context)) beginPhase(state, operation, line);
      if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null && state.facilityTick >= operation.phaseEndsAtFacilityTick) moveToNextPhase(state, operation, line, context);
      continue;
    }
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
      ) {
        operation.phaseEndsAtFacilityTick += 1;
        const attention = getCurrentPeriopNurseAttention(operation);
        if (attention?.requiredUntilFacilityTick !== null && attention?.requiredUntilFacilityTick !== undefined) attention.requiredUntilFacilityTick += 1;
      }
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
      const canAdvance = ensureCompleteVisitorDeparture(state, operation, context);
      if (canAdvance) advanceActorMovement(state, operation, context);
      if (
        operation.visitorTravel &&
        operation.location &&
        samePoint(operation.location, operation.visitorTravel.offscreenEndpoint)
      ) {
        operation.location = null;
        operation.status = operation.cancelledAtFacilityTick === null ? "completed" : "cancelled";
      }
      continue;
    }
    if (operation.status === "discharging") {
      if (operation.diagnosticPhysicalWork) {
        const location = operationLocation(state, operation);
        if (location) operation.location = { ...location };
        const bedRoomId = operation.periopBedReservation?.roomInstanceId;
        if (!bedRoomId || !operationInsideRoom(state, operation, bedRoomId, context)) {
          releasePeriopBed(operation);
          operation.status = "completed";
        }
        continue;
      }
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
        if (ensureCompleteVisitorDeparture(state, operation, context)) {
          advanceActorMovement(state, operation, context);
        }
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
      const waitingPhase = operationPhases(operation, line)[operation.phaseIndex];
      operation.resourceWaitReason = null;
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
      const reserved = tryReserve(state, operation, line, context);
      if (reserved && operation.diagnosticPhysicalWork && resourcesArrived(state, operation, line, context)) beginPhase(state, operation, line);
      if (!reserved && isPhaseBlockedOnlyByMaintenance(state, operation, line, waitingPhase, context)) {
        operation.resourceWaitReason = "Waiting for equipment repair.";
        operation.waitDeadlineFacilityTick = state.facilityTick + WAIT_TIMEOUT_MINUTES;
      }
      if (!reserved && operation.actorKind === "encounter" && waitingPlanner) {
        const encounter = state.encounters[operation.actorId];
        if (encounter && encounter.patientMovement === null && !encounter.waitingDestination) {
          routeResolvedEncounterToWaiting(state, encounter, waitingPlanner);
        }
      }
      continue;
    }
    if (operation.status === "waiting_for_next_phase") {
      const nextPhase = operationPhases(operation, line)[operation.phaseIndex + 1];
      operation.resourceWaitReason = null;
      if (isPeriopBedPhase(operation, line) && operation.periopBedReservation &&
          !samePoint(operationLocation(state, operation), operation.periopBedReservation.endpoint)) {
        advanceActorMovement(state, operation, context);
        if (!samePoint(operationLocation(state, operation), operation.periopBedReservation.endpoint)) continue;
      }
      if (
        (operation.periopBedFlowVersion === 1 && !validateReservedResources(state, operation, context)) ||
        (operation.periopBedFlowVersion !== 1 && !operation.reservedRoomInstanceIds.every((id) =>
          isRoomOperationalForFacilityWork(state, id, context)
        ))
      ) {
        if (operation.diagnosticPhysicalWork) {
          releaseResources(state, operation);
          if (operation.periopBedReservation && !isRoomOperationalForFacilityWork(state, operation.periopBedReservation.roomInstanceId, context)) releasePeriopBed(operation);
          operation.transitionHeldRoomInstanceIds = (operation.transitionHeldRoomInstanceIds ?? []).filter((id) => isRoomOperationalForFacilityWork(state, id, context));
        } else {
          cancel(state, operation, "The room holding the patient between service phases became unavailable.", context, departurePlanner);
          continue;
        }
      }
      if (operation.periopBedFlowVersion !== 1 && !tryReserveNextPhase(state, operation, line, context) &&
          isPhaseBlockedOnlyByMaintenance(state, operation, line, nextPhase, context)) {
        operation.resourceWaitReason = "Waiting for equipment repair.";
      }
      continue;
    }
    if (!validateReservedResources(state, operation, context) || operation.diagnosticPhysicalWork && !diagnosticPhysicalChoiceCompatible(state, operation, context)) {
      if (operation.diagnosticPhysicalWork) {
        if (operation.periopBedReservation && !isRoomOperationalForFacilityWork(state, operation.periopBedReservation.roomInstanceId, context)) releasePeriopBed(operation);
        queueInterruptedCurrentPhase(state, operation, line);
      } else cancel(state, operation, "Required service capacity became unavailable.", context, departurePlanner);
      continue;
    }
    if (operation.status === "walking_to_service" || operation.status === "walking_between_phases") {
      reconcileOperationActorRoute(state, operation, line, context);
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
        (!operation.periopNurseAttention && !hasInstalledPeriopNurse(state, context)))
    ) {
      advanceActorMovement(state, operation, context);
      operation.phaseEndsAtFacilityTick += 1;
      continue;
    }
    if (operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null && state.facilityTick >= operation.phaseEndsAtFacilityTick) {
      const attention = getCurrentPeriopNurseAttention(operation);
      if (attention && attention.completedAtFacilityTick === null) continue;
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
    const line = operationIncomeLine(operation);
    if (!line?.operation || !operation.periopBedReservation && !operation.diagnosticPhysicalWork) continue;
    const completedPhase = operationPhases(operation, line)[operation.phaseIndex];
    if (
      completedPhase?.roomDefinitionId === "room.periop_recovery" && operation.periopBedReservation &&
      !samePoint(operationLocation(state, operation), operation.periopBedReservation.endpoint)
    ) continue;
    if (!operationPhases(operation, line)[operation.phaseIndex + 1]) {
      beginPeriopBedDischarge(state, operation, line, context, departurePlanner);
      continue;
    }
    if (!tryReserveNextPhase(state, operation, line, context)) {
      const nextPhase = operationPhases(operation, line)[operation.phaseIndex + 1];
      operation.resourceWaitReason = isPhaseBlockedOnlyByMaintenance(state, operation, line, nextPhase, context)
        ? "Waiting for equipment repair."
        : null;
    }
  }
  reconcileServiceOperationFlow(state, context);
  advancePeriopNurseAttention(state, context);
  advanceOutsideRadiologyReads(state, context, true);
}
