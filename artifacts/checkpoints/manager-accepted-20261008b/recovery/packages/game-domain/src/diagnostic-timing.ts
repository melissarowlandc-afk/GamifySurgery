import {
  DIAGNOSTIC_READING_WORKSTATIONS,
  DIAGNOSTIC_TIMING_RESOURCES,
  DIAGNOSTIC_TIMING_TABLE,
  DIAGNOSTIC_TIMING_VERSION,
  RADIOLOGIST_READ_INCOME,
  PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES,
  getDiagnosticTimingProfileMapping,
  getDiagnosticTimingRuleForService,
  getServiceIncomeForRoute,
  getServiceIncomeLine,
  type DiagnosticTimingRule,
  type ServiceOperationPhase,
  type ServiceRouteDefinition,
} from "@gamify-surgery/balance-config";
import { findCareAwareFacilityPath } from "./care-room-access";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getNewPeriopServiceOperationPhases, hasReadingStationContinuity, straightServiceVisitorSidewalkPath } from "./service-operations";
import { getDoorCells } from "./doors";
import { getEmployeeTrainingAvailability, getEmployeeTrainingHomeLocation, getEmployeeTrainingProjection, getQueuedEmployeeTrainingDepartures, isDiagnosticResourceWaitingForTraining, type EmployeeTrainingDeparture } from "./employee-training";
import { compareReadingQueueKeys, createReadingUpgradeWork, isReadingPlanWorkValid, isReadingWorkMinute, normalizeReadingUpgradeWork, quoteReadingUpgradeWork, readingMinutesEqual, readingOperationQueueKey, type ReadingQueueKey } from "./room-upgrade-reading";
import { getEmployeeTrainingWorkMinutes, getEmployeeTrainingWorkPercent, getServiceOperationTrainingMinutes, snapshotEmployeeTrainingCategories } from "./employee-training-effects";
import { forecastPeriopNurseAttentionEnd, getCurrentPeriopNurseAttention } from "./periop-nurse-attention";
import { createRoomUpgradeRevenueQuote, isRoomUpgradeRevenueQuoteValid } from "./room-upgrades";
import { createRoomUpgradeRecoveryQuote, isRoomUpgradeRecoveryQuoteValid } from "./room-upgrade-experience";
import { isRoomUpgradeSupportRemaining } from "./room-upgrade-support";
import { getOutsideReadPriorityEnd } from "./radiologist-read-income";
import { isEmployeeAwayForTraining } from "./employee-training";
import { getProcedureStaffStandingSpots, isProceduralSpecialistRole, usesApprovedProcedureStaffSpots } from "./procedural-staffing";
import { hasQueuedHomeRoomWork, staffHomeMismatchCount } from "./staff-dispatch";
import {
  getRoomDefinition,
  getStaffRoleDefinition,
  isRoomAvailableForNewFacilityWork,
} from "./selectors";
import { getRoomCareAnchor, getRoomCareStations, getRoomNavigationAnchor, getRoomSharedStaffAnchor, getRotatedFootprint, rotateRoomLocalPoint } from "./spatial";
import type {
  DiagnosticOrderMilestone,
  DiagnosticOrderPhase,
  DiagnosticOrderPlan,
  DiagnosticPhaseWork,
  DiagnosticPhysicalWork,
  DiagnosticResourceChoice,
  DiagnosticResourceRequirement,
  DomainContext,
  EmployeeState,
  GameState,
  GridPoint,
  ServiceOperationState,
} from "./types";

export interface DiagnosticTimingComponentRequest {
  componentId?: string;
  serviceId?: string;
  timingProfileId?: string;
  allowedRouteIds?: readonly string[] | null;
  /** Exact external-only dispositions must opt in before using another route. */
  allowOnsiteEquivalents?: boolean;
  specimenCollected?: boolean;
  resultKind?: "visual" | "pathology";
  /** Supplied approved/frozen physical work wins over static catalog rows. */
  operationPhases?: readonly (ServiceOperationPhase & { roomStationId?: string })[];
}

export interface DiagnosticTimingRequest extends DiagnosticTimingComponentRequest {
  orderId: string;
  encounterId: string;
  patientOrigin?: GridPoint;
  patientReturnLocation?: GridPoint;
  components?: readonly DiagnosticTimingComponentRequest[];
  /** Exact operational dispositions can retain an indivisible outside protocol. */
  retainedExternalProtocol?: { timingProfileId: string; label?: string; mode: "external_patient_visit" | "retained_protocol" };
  /** Mixed molecular, urine, MRI, mammography and specialist work stays explicit. */
  remainder?: {
    label: string;
    durationMinutes: number;
    mode: "external_patient_visit" | "external_processing" | "retained_protocol";
    startsAfter: "acquisition" | "care_completion";
  };
}

export type DiagnosticTimingQuote =
  | { kind: "planned"; plan: DiagnosticOrderPlan }
  | { kind: "unavailable"; reason: "unknown_service_or_profile" | "no_valid_route" | "missing_acquisition_contract"; estimateMinutes: number | null };

type Interval = { starts: number; ends: number };
type ActorInterval = Interval & { destination: GridPoint };
type OperationCompletion = { endsAtTick: number; phases: Map<string, number>; blocked: boolean;
  readingQuote?: { roomInstanceId: string; durationMinutes: number }; readingForecast?: DiagnosticOrderPhase["forecast"] };
type ReadingForecastRequest = {
  key: ReadingQueueKey; draft: DraftPhase; ready: number; remaining: number; origin: GridPoint;
  preferred: DiagnosticResourceChoice | null; operationId: string | null;
  current: { resource: DiagnosticResourceChoice; starts: number; ends: number; continuous: boolean } | null;
};
type ReadingProjection = { baseline: Calendar; requests: Map<string, ReadingForecastRequest>; results: Map<string, DiagnosticOrderPhase | null> };
type Calendar = {
  intervals: Map<string, Interval[]>;
  actors: Map<string, ActorInterval[]>;
  /** Occupied beds/transfer rooms must be claimed before future chains are seeded. */
  heldResources: Map<string, Set<string>>;
  operationCompletions: Map<string, OperationCompletion>;
  readingHandoffs: Map<string, { resource: DiagnosticResourceChoice; atTick: number }>;
  readingProjection: ReadingProjection | null;
};
type DraftPhase = Pick<DiagnosticOrderPhase, "id" | "componentId" | "kind" | "mode" | "patientPresent" | "durationMinutes" | "dependsOn" | "requirement" | "readingUpgradeWork">;
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const activeOperation = (operation: ServiceOperationState) => operation.status !== "completed" && operation.status !== "cancelled";

function cloneCalendar(calendar: Calendar): Calendar {
  return { intervals: new Map([...calendar.intervals].map(([key, intervals]) => [key, copy(intervals)])),
    actors: new Map([...calendar.actors].map(([key, intervals]) => [key, copy(intervals)])),
    heldResources: new Map([...calendar.heldResources].map(([key, owners]) => [key, new Set(owners)])),
    operationCompletions: new Map([...calendar.operationCompletions].map(([id, value]) => [id, { ...copy({ ...value, phases: undefined }), phases: new Map(value.phases) }])),
    readingHandoffs: new Map([...calendar.readingHandoffs].map(([id, value]) => [id, copy(value)])),
    readingProjection: calendar.readingProjection ? { baseline: cloneCalendar(calendar.readingProjection.baseline),
      requests: new Map([...calendar.readingProjection.requests].map(([id, value]) => [id, copy(value)])),
      results: new Map([...calendar.readingProjection.results].map(([id, value]) => [id, copy(value)])) } : null };
}

function holdResource(calendar: Calendar, key: string, ownerId: string): void {
  const owners = calendar.heldResources.get(key) ?? new Set<string>();
  owners.add(ownerId);
  calendar.heldResources.set(key, owners);
}

function heldByAnother(calendar: Calendar, resource: DiagnosticResourceChoice, ownerId?: string): boolean {
  return ["room:" + resource.roomInstanceId, ...resource.employeeIds.map((id) => `employee:${id}`),
    ...(resource.provider?.kind === "employee" ? [`employee:${resource.provider.employeeId}`] : []),
    ...(resource.stationId ? [`station:${resource.roomInstanceId}:${resource.stationId}`] :
    [...calendar.heldResources.keys()].filter((key) => key.startsWith(`station:${resource.roomInstanceId}:`)))].some((key) => {
    const owners = calendar.heldResources.get(key);
    return owners && (!ownerId || !owners.has(ownerId));
  });
}

function releaseHold(calendar: Calendar, key: string, ownerId: string, starts: number, ends: number): void {
  const owners = calendar.heldResources.get(key);
  owners?.delete(ownerId);
  if (!owners?.size) calendar.heldResources.delete(key);
  const intervals = calendar.intervals.get(key) ?? [];
  if (ends > starts) intervals.push({ starts, ends });
  calendar.intervals.set(key, intervals);
}

function sharedPeriop(resource: DiagnosticResourceChoice): boolean {
  return resource.roomDefinitionId === "room.periop_recovery" && resource.stationId !== null;
}

function reservationKeys(resource: DiagnosticResourceChoice): string[] {
  return [
    resource.stationId === null ? `room:${resource.roomInstanceId}` : `station:${resource.roomInstanceId}:${resource.stationId}`,
    ...resource.employeeIds.map((id) => sharedPeriop(resource) ? `coverage:${id}:${resource.roomInstanceId}` : `employee:${id}`),
    ...(resource.provider?.kind === "employee" ? [`employee:${resource.provider.employeeId}`] : resource.provider?.kind === "founder" ? ["founder"] : []),
  ];
}

function availabilityKeys(calendar: Calendar, resource: DiagnosticResourceChoice): string[] {
  return [
    ...reservationKeys(resource), `room:${resource.roomInstanceId}`,
    ...(resource.stationId === null ? [...calendar.intervals.keys()].filter((key) => key.startsWith(`station:${resource.roomInstanceId}:`)) : []),
    ...resource.employeeIds.map((id) => `employee:${id}`),
    ...resource.employeeIds.flatMap((id) => [...calendar.intervals.keys()].filter((key) => key.startsWith(`coverage:${id}:`) && key !== `coverage:${id}:${resource.roomInstanceId}`)),
  ].filter((key) => !sharedPeriop(resource) || !key.startsWith(`coverage:`) || !resource.employeeIds.some((id) => key === `coverage:${id}:${resource.roomInstanceId}`));
}

function reserve(calendar: Calendar, resource: DiagnosticResourceChoice, starts: number, ends: number): void {
  for (const key of reservationKeys(resource)) {
    const intervals = calendar.intervals.get(key) ?? [];
    intervals.push({ starts, ends });
    calendar.intervals.set(key, intervals);
  }
  for (const id of [...resource.employeeIds, ...(resource.provider?.kind === "employee" ? [resource.provider.employeeId] : resource.provider?.kind === "founder" ? ["founder"] : [])]) {
    const intervals = calendar.actors.get(id) ?? [];
    intervals.push({ starts, ends, destination: resource.staffAnchor });
    calendar.actors.set(id, intervals);
  }
  if (calendar.readingProjection) reserve(calendar.readingProjection.baseline, resource, starts, ends);
}

function actorOrigin(calendar: Calendar, actorId: string, atTick: number, fallback: GridPoint): GridPoint {
  return (calendar.actors.get(actorId) ?? []).filter((interval) => interval.ends <= atTick).sort((a, b) => b.ends - a.ends)[0]?.destination ?? fallback;
}

function firstSlot(calendar: Calendar, resource: DiagnosticResourceChoice, ready: number, minutes: number): number {
  let starts = ready;
  const intervals = availabilityKeys(calendar, resource).flatMap((key) => calendar.intervals.get(key) ?? []).sort((a, b) => a.starts - b.starts || a.ends - b.ends);
  for (const interval of intervals) {
    if (starts + minutes <= interval.starts) continue;
    if (starts < interval.ends && starts + minutes > interval.starts) starts = interval.ends;
  }
  return starts;
}

function roomAvailable(state: GameState, context: DomainContext, roomId: string): boolean {
  return isRoomAvailableForNewFacilityWork(state, roomId, context);
}

function installedEmployees(state: GameState, context: DomainContext, roleId: string, exactHomeRoomId?: string) {
  return state.employees.filter((employee) => employee.staffRoleDefinitionId === roleId && employee.homeRoomInstanceId !== null &&
    (!exactHomeRoomId || employee.homeRoomInstanceId === exactHomeRoomId) && roomAvailable(state, context, employee.homeRoomInstanceId)).sort((a, b) => a.id.localeCompare(b.id));
}

/** History is a fallback for background work; live carrier copies are authoritative. */
export function getDiagnosticOrderPlans(state: GameState): DiagnosticOrderPlan[] {
  const plans = new Map<string, DiagnosticOrderPlan>();
  for (const encounter of Object.values(state.encounters)) {
    for (const step of encounter.steps) if (step.result?.diagnosticTiming && !plans.has(step.result.diagnosticTiming.orderId)) plans.set(step.result.diagnosticTiming.orderId, step.result.diagnosticTiming);
  }
  for (const encounter of Object.values(state.encounters)) {
    for (const plan of [encounter.pendingResult?.diagnosticTiming, encounter.testOnlyContinuation?.diagnosticTiming,
      encounter.stagedResultOrder?.diagnosticTiming, encounter.stagedResultOrder?.remainder.diagnosticTiming,
      ...(encounter.stagedResultOrder?.components.map((component) => component.diagnosticTiming) ?? []), encounter.terminalTestOrder?.diagnosticTiming]) {
      if (plan) plans.set(plan.orderId, plan);
    }
  }
  return [...plans.values()].sort((a, b) => a.createdAtTick - b.createdAtTick || a.orderId.localeCompare(b.orderId));
}

function resourceCandidates(state: GameState, context: DomainContext, requirement: DiagnosticResourceRequirement): DiagnosticResourceChoice[] {
  const candidates: DiagnosticResourceChoice[] = [];
  for (const room of [...state.rooms].sort((a, b) => a.id.localeCompare(b.id))) {
    if (room.roomDefinitionId !== requirement.roomDefinitionId || !roomAvailable(state, context, room.id)) continue;
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    let groups: string[][] = [[]];
    for (const role of requirement.staffRoleDefinitionIds) {
      const exactHome = role === "staff.radiologist" || role === "staff.laboratory_technician";
      const employees = installedEmployees(state, context, role, exactHome ? room.id : undefined).filter((employee) =>
        requirement.stationKind !== "periop_bed" || employee.facilityTask?.kind !== "cover_periop" || employee.facilityTask.targetId === room.id);
      groups = groups.flatMap((group) => employees.filter((employee) => !group.includes(employee.id)).map((employee) => [...group, employee.id]));
    }
    const providers: DiagnosticResourceChoice["provider"][] = requirement.providerRoleDefinitionIds.length
      ? requirement.providerRoleDefinitionIds.flatMap((role) => installedEmployees(state, context, role).map((employee) => ({ kind: "employee" as const, employeeId: employee.id })))
      : requirement.founderEligible ? [] : [null];
    if (requirement.founderEligible) providers.push({ kind: "founder" });
    if (requirement.stationKind === "reading") {
      const readers = installedEmployees(state, context, "staff.radiologist", room.id);
      const assigned = new Map<string, string>();
      for (const reader of readers) if (reader.readingStationId && DIAGNOSTIC_READING_WORKSTATIONS.some((station) => station.id === reader.readingStationId) &&
        ![...assigned.values()].includes(reader.readingStationId)) assigned.set(reader.id, reader.readingStationId);
      // Accepted choices remain stable when staff are hired/dismissed later.
      for (const resource of [
        ...state.serviceOperations.flatMap((operation) => operation.diagnosticPhaseWork?.resource ? [operation.diagnosticPhaseWork.resource] : []),
        ...getDiagnosticOrderPlans(state).flatMap((plan) => plan.phases.flatMap((phase) => phase.resource ? [phase.resource] : [])),
      ]) {
        if (resource.roomInstanceId === room.id && resource.stationId !== null && readers.some((reader) => reader.id === resource.employeeIds[0]) &&
          !assigned.has(resource.employeeIds[0]!) && ![...assigned.values()].includes(resource.stationId)) assigned.set(resource.employeeIds[0]!, resource.stationId);
      }
      for (const reader of readers) {
        if (assigned.has(reader.id)) continue;
        const station = DIAGNOSTIC_READING_WORKSTATIONS.find((entry) => ![...assigned.values()].includes(entry.id));
        if (station) assigned.set(reader.id, station.id);
      }
      for (const reader of readers) {
        const station = DIAGNOSTIC_READING_WORKSTATIONS.find((entry) => entry.id === assigned.get(reader.id));
        if (!station) continue;
        const local = rotateRoomLocalPoint(station.staffAnchor, definition, room.orientation);
        const anchor = { x: room.x + local.x, y: room.y + local.y };
        candidates.push({ roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId, stationId: station.id,
          employeeIds: [reader.id], provider: null, patientAnchor: anchor, staffAnchor: anchor });
      }
      continue;
    }
    const stations = requirement.stationKind === "periop_bed"
      ? getRoomCareStations(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context)).map((station) => ({ id: station.id, anchor: station.patientAnchor }))
      : [{ id: null, anchor: room.roomDefinitionId === "room.phlebotomy" ? getRoomCareAnchor(room, definition, "patient") : getRoomNavigationAnchor(room, definition, "primary") }];
    for (const group of groups) for (const provider of providers) for (const station of stations) {
      if (provider?.kind === "employee" && group.includes(provider.employeeId)) continue;
      const procedureSpots = provider && requirement.providerRoleDefinitionIds.some(isProceduralSpecialistRole) && usesApprovedProcedureStaffSpots(room, definition);
      const providerSpot = procedureSpots ? getProcedureStaffStandingSpots(room, definition, state.doors, "provider")[0] : null;
      if (procedureSpots && (!providerSpot || !getProcedureStaffStandingSpots(room, definition, state.doors, "nurse").length)) continue;
      candidates.push({ roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId, stationId: station.id,
        employeeIds: group, provider, patientAnchor: station.anchor, staffAnchor: requirement.stationKind === "periop_bed" ? getRoomSharedStaffAnchor(room, definition) :
          providerSpot?.anchor ?? (room.roomDefinitionId === "room.phlebotomy" && requirement.staffRoleDefinitionIds.includes("staff.phlebotomist") ? getRoomCareAnchor(room, definition, "clinician") : getRoomNavigationAnchor(room, definition, "staff")) });
    }
  }
  return candidates;
}

function requirementForOperation(phase: ServiceOperationPhase & { roomStationId?: string }): DiagnosticResourceRequirement | null {
  return phase.roomDefinitionId ? {
    roomDefinitionId: phase.roomDefinitionId, staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds],
    providerRoleDefinitionIds: [...(phase.providerRoleDefinitionIds ?? [])], founderEligible: phase.founderEligible === true,
    stationKind: phase.roomStationId === "periop_preparation" || phase.roomStationId === "periop_recovery" ? "periop_bed" : null,
  } : null;
}

function processingRequirement(kind: "interpretation" | "laboratory_processing" | "pathology"): DiagnosticResourceRequirement {
  const resource = kind === "interpretation" ? DIAGNOSTIC_TIMING_RESOURCES.interpretation : DIAGNOSTIC_TIMING_RESOURCES.processing;
  return { roomDefinitionId: resource.roomDefinitionId, staffRoleDefinitionIds: [resource.staffRoleDefinitionId], providerRoleDefinitionIds: [], founderEligible: false,
    stationKind: kind === "interpretation" ? "reading" : null };
}

function path(state: GameState, context: DomainContext, origin: GridPoint, destination: GridPoint, roomId?: string): GridPoint[] {
  return findCareAwareFacilityPath(state, context, origin, destination, new Set(roomId ? [roomId] : []));
}

function containingRoomId(state: GameState, context: DomainContext, point: GridPoint): string | undefined {
  return state.rooms.find((room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) return false;
    const footprint = getRotatedFootprint(definition, room.orientation);
    return point.x >= room.x && point.y >= room.y && point.x < room.x + footprint.width && point.y < room.y + footprint.height;
  })?.id;
}

function schedulePhase(state: GameState, context: DomainContext, calendar: Calendar, draft: DraftPhase, ready: number,
  patientOrigin: GridPoint, preferred?: DiagnosticResourceChoice | null, remaining = draft.durationMinutes, ownerId?: string, workHasArrived = false,
  initialTiming?: (resource: DiagnosticResourceChoice | null) => number, preferredStationOnly = false): DiagnosticOrderPhase | null {
  if (draft.readingUpgradeWork && calendar.readingProjection) {
    const work = draft.readingUpgradeWork;
    const key: ReadingQueueKey = { readyAtTick: work.readyAtTick ?? ready, acceptedAtTick: work.acceptedAtTick,
      orderId: ownerId ?? draft.id, phaseId: draft.id, operationId: `forecast:${ownerId ?? draft.id}:${draft.id}` };
    const id = readingRequestId(key);
    if (!calendar.readingProjection.requests.has(id)) calendar.readingProjection.requests.set(id, {
      key, draft: copy(draft), ready: work.readyAtTick ?? ready, remaining, origin: copy(patientOrigin),
      preferred: preferred ? copy(preferred) : null, operationId: null, current: null,
    });
    projectReadingCalendar(state, context, calendar);
    return copy(calendar.readingProjection.results.get(id) ?? null);
  }
  const tilesPerTick = context.balanceRelease.facility.characterTravelTilesPerTick;
  // A replacement nurse can cover the accepted bed without changing its station.
  const choices = draft.requirement ? resourceCandidates(state, context, draft.requirement).filter((resource) =>
    (preferred || sharedPeriop(resource) || [...resource.employeeIds, ...(resource.provider?.kind === "employee" ? [resource.provider.employeeId] : [])].every(id => {
      const employee = state.employees.find(candidate => candidate.id === id)!;
      return employee.homeRoomInstanceId === resource.roomInstanceId || !hasQueuedHomeRoomWork(state, employee, ownerId);
    })) &&
    !heldByAnother(calendar, resource, ownerId) && (!preferred || (resource.roomInstanceId === preferred.roomInstanceId && resource.stationId === preferred.stationId &&
      (preferredStationOnly || resource.employeeIds.join(":") === preferred.employeeIds.join(":") && JSON.stringify(resource.provider) === JSON.stringify(preferred.provider)))))
    .map((resource) => preferred && !preferredStationOnly ? copy(preferred) : resource) : [null];
  const reachableOptions = choices.flatMap((resource) => {
    const workMinutes = initialTiming ? initialTiming(resource) : remaining;
    const patientPath = !workHasArrived && draft.patientPresent && resource ? path(state, context, patientOrigin, resource.patientAnchor, resource.roomInstanceId) : [];
    if (!workHasArrived && draft.patientPresent && resource && patientPath.length === 0) return [];
    const employeeIds = resource ? [...resource.employeeIds, ...(resource.provider?.kind === "employee" ? [resource.provider.employeeId] : [])] : [];
    const handoff = resource ? calendar.readingHandoffs.get(resource.employeeIds[0]!) : null;
    const canInherit = draft.readingUpgradeWork && handoff && resource && draft.readingUpgradeWork.executionEnabledAtTick !== null &&
      resource.roomInstanceId === handoff.resource.roomInstanceId && resource.stationId === handoff.resource.stationId &&
      draft.readingUpgradeWork.acceptedAtTick <= handoff.atTick && draft.readingUpgradeWork.executionEnabledAtTick <= handoff.atTick &&
      (draft.readingUpgradeWork.readyAtTick ?? ready) <= handoff.atTick;
    let starts = canInherit ? Math.min(ready, handoff.atTick) : ready;
    // A release and its rounded boundary each need an availability pass.
    const availabilityChanges = [...calendar.intervals.values(), ...calendar.actors.values()].reduce((total, intervals) => total + intervals.length, 0);
    const maximumAttempts = 2 * (availabilityChanges + 2);
    for (let attempt = 0; attempt < maximumAttempts; attempt++) {
      const employeePaths = employeeIds.map((employeeId) => {
        const employee = state.employees.find((entry) => entry.id === employeeId)!;
        const room = state.rooms.find((entry) => entry.id === resource!.roomInstanceId)!;
        const definition = getRoomDefinition(room.roomDefinitionId, context)!;
        const isProcedureNurse = employee.staffRoleDefinitionId === "staff.endoscopy_nurse" || employee.staffRoleDefinitionId === "staff.or_nurse";
        const anchor = isProcedureNurse ? getProcedureStaffStandingSpots(room, definition, state.doors, "nurse")[0]?.anchor ?? resource!.staffAnchor : resource!.staffAnchor;
        return { employeeId, path: workHasArrived ? [anchor] : path(state, context, actorOrigin(calendar, employeeId, starts, employee.location), anchor, resource!.roomInstanceId) };
      });
      if (employeePaths.some((entry) => entry.path.length === 0)) return [];
      const founderPath = resource?.provider?.kind === "founder" ? workHasArrived ? [resource.staffAnchor] : path(state, context, actorOrigin(calendar, "founder", starts, state.environment.founderLocation), resource.staffAnchor, resource.roomInstanceId) : [];
      if (resource?.provider?.kind === "founder" && founderPath.length === 0) return [];
      const walkingMinutes = Math.max(0, ...[patientPath, founderPath, ...employeePaths.map((entry) => entry.path)].map((entry) => Math.ceil(Math.max(0, entry.length - 1) / tilesPerTick)));
      const slot = resource ? firstSlot(calendar, resource, starts, walkingMinutes + workMinutes) : starts;
      if (slot !== starts) { starts = slot; continue; }
      const continuous = canInherit && walkingMinutes === 0 && starts === handoff!.atTick;
      const observedStart = continuous ? starts : Math.ceil(Math.max(state.facilityTick, starts));
      if (observedStart !== starts) { starts = observedStart; continue; }
      const ends = starts + walkingMinutes + workMinutes;
      let afterNext = starts;
      for (const actorId of [...employeeIds, ...(resource?.provider?.kind === "founder" ? ["founder"] : [])]) {
        const next = (calendar.actors.get(actorId) ?? []).filter((interval) => interval.starts >= ends).sort((a, b) => a.starts - b.starts)[0];
        if (!next || !resource) continue;
        const onward = path(state, context, resource.staffAnchor, next.destination, containingRoomId(state, context, next.destination));
        if (!onward.length || ends + Math.ceil(Math.max(0, onward.length - 1) / tilesPerTick) > next.starts) afterNext = Math.max(afterNext, next.ends);
      }
      if (afterNext !== starts) { starts = afterNext; continue; }
      return [{ resource, homeMismatch: resource ? staffHomeMismatchCount(state, resource) : 0, starts, patientPath, employeePaths, founderPath, walkingMinutes, workMinutes }];
    }
    return [];
  });
  // At a given room, equally available home staff win before travel speed.
  // A busy home team can still be covered by a spare; other rooms retain their
  // independent queue/travel ranking. Frozen saved choices are never replaced.
  const options = reachableOptions.filter(option => !option.resource || sharedPeriop(option.resource) || !reachableOptions.some(other => other.resource &&
    other.resource.roomInstanceId === option.resource!.roomInstanceId && other.resource.stationId === option.resource!.stationId &&
    other.resource.provider?.kind === option.resource!.provider?.kind && other.starts <= option.starts &&
    other.homeMismatch < option.homeMismatch))
    .sort((a, b) => (a.starts + a.walkingMinutes + (initialTiming ? a.workMinutes : 0)) - (b.starts + b.walkingMinutes + (initialTiming ? b.workMinutes : 0)) ||
    (a.resource?.roomInstanceId ?? "").localeCompare(b.resource?.roomInstanceId ?? "") ||
    (a.resource?.stationId ?? "").localeCompare(b.resource?.stationId ?? "") ||
    (a.resource?.employeeIds.join(":") ?? "").localeCompare(b.resource?.employeeIds.join(":") ?? ""));
  // Provider priority is independent of walking speed and training modifiers.
  // The common room/nurse queue is shared: compare dispatch availability to the
  // earliest founder dispatch, allowing at most the named short extra wait.
  const founderOptions = options.filter((option) => option.resource?.provider?.kind === "founder");
  const founderReady = founderOptions.length ? Math.min(...founderOptions.map((option) => option.starts)) : ready;
  const specialists = draft.requirement?.providerRoleDefinitionIds.some(isProceduralSpecialistRole)
    ? options.filter((option) => {
        const provider = option.resource?.provider;
        return provider?.kind === "employee" &&
          !isEmployeeAwayForTraining(state.employees.find((employee) => employee.id === provider.employeeId)!) &&
          option.starts <= founderReady + PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES;
      })
    : [];
  const option = specialists[0] ?? (draft.requirement?.providerRoleDefinitionIds.some(isProceduralSpecialistRole)
    ? founderOptions[0] ?? options[0] : options[0]);
  if (!option) return null;
  const startsAtTick = option.starts + option.walkingMinutes;
  const endsAtTick = startsAtTick + option.workMinutes;
  if (option.resource) reserve(calendar, option.resource, option.starts, endsAtTick);
  const forecastReady = Math.min(ready, option.starts);
  return { ...copy(draft), resource: option.resource ? copy(option.resource) : null,
    ...(initialTiming ? { durationMinutes: option.workMinutes } : {}),
    forecast: { readyAtTick: forecastReady, startsAtTick, endsAtTick, queueMinutes: option.starts - forecastReady, walkingMinutes: option.walkingMinutes,
      patientPath: option.patientPath, employeePaths: option.employeePaths, founderPath: option.founderPath, tilesPerTick },
    status: "pending", remainingMinutes: option.workMinutes, startedAtTick: null, completedAtTick: null, serviceOperationId: null, operationPhaseId: null };
}

/** Prefer any schedulable spare before constructing a paused local contract. */
function scheduleNewPhase(state: GameState, context: DomainContext, calendar: Calendar, draft: DraftPhase, ready: number,
  origin: GridPoint, preferred?: DiagnosticResourceChoice | null, initialTiming?: (resource: DiagnosticResourceChoice | null) => number, ownerId?: string): DiagnosticOrderPhase | null {
  const actual = schedulePhase(state, context, calendar, draft, ready, origin, preferred, draft.durationMinutes, ownerId, false, initialTiming);
  if (actual) return actual;
  const structural = cloneCalendar(calendar);
  let relaxed = false;
  for (const [key, owners] of structural.heldResources) {
    for (const owner of owners) if (owner.startsWith("training:")) { owners.delete(owner); relaxed = true; }
    if (!owners.size) structural.heldResources.delete(key);
  }
  if (structural.readingProjection) for (const [key, owners] of structural.readingProjection.baseline.heldResources) {
    for (const owner of owners) if (owner.startsWith("training:")) owners.delete(owner);
    if (!owners.size) structural.readingProjection.baseline.heldResources.delete(key);
  }
  if (!relaxed) return null;
  // Nominal clocks allow acceptance, never a player ETA or completion witness.
  const nominal = schedulePhase(state, context, structural, draft, ready, origin, preferred, draft.durationMinutes, ownerId, false, initialTiming);
  if (nominal) { calendar.intervals = structural.intervals; calendar.actors = structural.actors; }
  return nominal;
}

function routeIsLocal(route: ServiceRouteDefinition): boolean {
  return Boolean(route.patientTravel || route.patientRemainsOnsite || route.resourceRequirements.length);
}

function installedCapabilities(state: GameState, context: DomainContext): Set<string> {
  const capabilities = new Set<string>();
  for (const room of state.rooms) if (roomAvailable(state, context, room.id)) {
    for (const id of getRoomDefinition(room.roomDefinitionId, context)?.capabilityIds ?? []) capabilities.add(id);
  }
  for (const employee of state.employees) if (employee.homeRoomInstanceId && roomAvailable(state, context, employee.homeRoomInstanceId)) {
    for (const id of getStaffRoleDefinition(employee.staffRoleDefinitionId, context)?.capabilityIds ?? []) capabilities.add(id);
  }
  const installedRoom = (id: string) => state.rooms.some((room) => room.roomDefinitionId === id && roomAvailable(state, context, room.id));
  if (installedRoom("room.endoscopy") && installedRoom("room.periop_recovery") &&
    installedEmployees(state, context, "staff.endoscopy_nurse").length && installedEmployees(state, context, "staff.periop_nurse").length) capabilities.add("capability.endoscopy");
  return capabilities;
}

function physicalPhases(route: ServiceRouteDefinition, request: DiagnosticTimingComponentRequest, rule: DiagnosticTimingRule): (ServiceOperationPhase & { roomStationId?: string })[] {
  if (request.operationPhases) return copy([...request.operationPhases]);
  const income = getServiceIncomeForRoute(route.id);
  if ((rule.family === "endoscopy" || income?.id === "income.advanced_endoscopy") && income?.operation) return copy(getNewPeriopServiceOperationPhases(income.id) ?? [...income.operation.phases]);
  // Explicit resource-bound route work is authoritative, including approved biopsies.
  const bound = route.timingPhases.filter((phase) => phase.resourceBound);
  if (bound.length) return bound.map((phase) => {
    const catalog = income?.operation?.phases.find((entry) => entry.id === phase.id) ?? income?.operation?.phases[0];
    const resource = route.resourceRequirements[0];
    return { id: phase.id, roomDefinitionId: catalog?.roomDefinitionId ?? resource?.roomDefinitionId ?? route.patientTravel?.destinationRoomDefinitionId ?? null,
      durationMinutes: phase.durationTicks, staffRoleDefinitionIds: catalog?.staffRoleDefinitionIds ?? (resource?.staffRoleDefinitionId ? [resource.staffRoleDefinitionId] : []),
      providerRoleDefinitionIds: catalog?.providerRoleDefinitionIds ?? (route.providerRequirement ? [route.providerRequirement.preferredEmployeeStaffRoleDefinitionId] : []),
      founderEligible: catalog?.founderEligible ?? route.providerRequirement?.founderEligible };
  });
  if (income?.operation) return copy([...income.operation.phases]);
  return [{ id: "acquisition", roomDefinitionId: route.resourceRequirements[0]?.roomDefinitionId ?? route.patientTravel?.destinationRoomDefinitionId ?? null,
    durationMinutes: route.durationTicks, staffRoleDefinitionIds: route.resourceRequirements.flatMap((resource) => resource.staffRoleDefinitionId ? [resource.staffRoleDefinitionId] : []),
    providerRoleDefinitionIds: route.providerRequirement ? [route.providerRequirement.preferredEmployeeStaffRoleDefinitionId] : [], founderEligible: route.providerRequirement?.founderEligible }];
}

function originFor(state: GameState, context: DomainContext, encounterId: string): GridPoint {
  const encounter = state.encounters[encounterId];
  if (encounter?.patientLocation) return encounter.patientLocation;
  const room = state.rooms.find((entry) => entry.id === encounter?.assignedRoomInstanceId) ?? state.rooms.find((entry) => entry.roomDefinitionId === "room.examination");
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  return room && definition ? getRoomCareAnchor(room, definition, "patient") : state.environment.founderLocation;
}

function externalWalk(state: GameState, context: DomainContext, origin: GridPoint, returnLocation = origin): { outbound: GridPoint[]; returning: GridPoint[] } | null {
  const candidates = state.doors.filter((door) => door.exterior).flatMap((door) => {
    const room = state.rooms.find((entry) => entry.id === door.roomId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    const cells = room && definition ? getDoorCells(door, room, definition) : null;
    if (!cells) return [];
    const indoor = path(state, context, origin, cells.inside, room!.id);
    if (!indoor.length) return [];
    const returnIndoor = path(state, context, cells.inside, returnLocation, containingRoomId(state, context, returnLocation));
    if (!returnIndoor.length) return [];
    return [-2, context.balanceRelease.facility.gridWidth + 1].map((x) => {
      const sidewalk = straightServiceVisitorSidewalkPath(cells.outside, { x, y: cells.outside.y });
      const outbound = [...indoor, ...sidewalk];
      return { doorId: door.id, outbound, returning: [...sidewalk].reverse().concat(returnIndoor).map((point) => ({ ...point })) };
    });
  }).sort((a, b) => a.outbound.length - b.outbound.length || a.doorId.localeCompare(b.doorId));
  return candidates[0] ?? null;
}

const readingRequestId = (key: ReadingQueueKey): string => JSON.stringify([key.orderId, key.phaseId]);

function currentFacilityDutyEnd(state: GameState, employee: EmployeeState, context: DomainContext): number | null {
  const task = employee.facilityTask;
  if (!task || task.workMinutesRemaining === Number.MAX_SAFE_INTEGER || task.workMinutesRemaining < 0 ||
    !(Number.isSafeInteger(task.workMinutesRemaining) || task.roomUpgradeWork?.version === "room-upgrade-support.v1" &&
      task.roomUpgradeWork.durationMinutes !== null && isRoomUpgradeSupportRemaining(task.roomUpgradeWork, task.workMinutesRemaining, true))) return null;
  const endpoint = employee.path.at(-1);
  if (!endpoint) return null;
  const allowed = new Set([employee.homeRoomInstanceId, state.rooms.find(room => room.id === task.targetId)?.id,
    containingRoomId(state, context, endpoint)].filter((id): id is string => Boolean(id)));
  const route = findCareAwareFacilityPath(state, context, employee.location, endpoint, allowed);
  if (!route.length) return null;
  const walking = Math.ceil(Math.max(0, route.length - 1) / context.balanceRelease.facility.characterTravelTilesPerTick);
  return state.facilityTick + walking + Math.ceil(task.workMinutesRemaining);
}

/** Replays only Reading/training predictions from fixed reservations, never real controllers. */
function projectReadingCalendar(state: GameState, context: DomainContext, calendar: Calendar): void {
  const projection = calendar.readingProjection!;
  // With no accepted or prospective reads, the baseline is already the full
  // calendar. Avoid cloning the campaign and projecting unrelated staff duties
  // for every non-reading order/ETA. Later reads still project from that baseline.
  if (projection.requests.size === 0) {
    projection.results.clear();
    calendar.readingHandoffs.clear();
    return;
  }
  const working = cloneCalendar(projection.baseline);
  // Projection changes only the clock, employee travel/training/duties and
  // service status. Keep those records private while sharing read-only history,
  // encounters and layout instead of repeatedly copying a long-running save.
  const predicted: GameState = {
    ...state,
    employees: copy(state.employees),
    serviceOperations: copy(state.serviceOperations),
  };
  const requests = [...projection.requests.values()].sort((a, b) => compareReadingQueueKeys(a.key, b.key));
  const pending = requests.filter(request => !request.current);
  const results = new Map<string, DiagnosticOrderPhase | null>(requests.map(request => [readingRequestId(request.key), null]));
  type Segment = { request: ReadingForecastRequest; phase: DiagnosticOrderPhase; continuous: boolean };
  const active: Segment[] = [];
  const sessions = new Map<string, EmployeeTrainingDeparture>();
  const events = new Set<number>([state.facilityTick]);
  let processedBoundary = state.facilityTick - 1;
  const addEvent = (tick: number) => { if (Number.isFinite(tick) && tick >= state.facilityTick && tick <= Number.MAX_SAFE_INTEGER && Math.ceil(tick) > processedBoundary) events.add(Math.ceil(tick)); };
  const readingIds = new Set(requests.flatMap(request => request.operationId ? [request.operationId] : []));
  const dutyEnds = new Map(state.employees.map(employee => [employee.id, currentFacilityDutyEnd(state, employee, context)]));
  for (const ends of dutyEnds.values()) if (ends !== null) addEvent(ends);
  for (const operation of predicted.serviceOperations) if (readingIds.has(operation.id)) operation.status = "cancelled";
  for (const employee of predicted.employees) {
    if (employee.facilityTask && readingIds.has(employee.facilityTask.targetId ?? "")) employee.facilityTask = null;
    const session = getEmployeeTrainingProjection(state, state.employees.find(entry => entry.id === employee.id)!, context);
    if (session) {
      sessions.set(employee.id, session);
      [session.seatedAtTick, session.completedAtTick, session.availableAtTick].forEach(addEvent);
    }
    if (employee.training?.stage === "queued") addEvent(employee.training.earliestDepartureAtFacilityTick);
  }
  for (const intervals of working.intervals.values()) for (const interval of intervals) { addEvent(interval.starts); addEvent(interval.ends); }
  for (const request of pending) addEvent(request.ready);
  const taskId = (request: ReadingForecastRequest) => `forecast-reading:${readingRequestId(request.key)}`;
  const busy = (segment: Segment) => {
    const employee = predicted.employees.find(entry => entry.id === segment.phase.resource!.employeeIds[0])!;
    employee.facilityTask = { kind: "perform_service", targetId: taskId(segment.request), startedAtFacilityTick: predicted.facilityTick,
      workMinutesRemaining: segment.phase.remainingMinutes };
    employee.path = segment.phase.forecast.employeePaths[0]?.path.map(point => ({ ...point })) ?? [{ ...employee.location }];
    employee.pathIndex = 0;
    active.push(segment); addEvent(segment.phase.forecast.endsAtTick);
  };
  for (const request of requests.filter(entry => entry.current)) {
    const current = request.current!;
    const phase: DiagnosticOrderPhase = { ...copy(request.draft), resource: copy(current.resource), status: "pending", remainingMinutes: request.remaining,
      startedAtTick: null, completedAtTick: null, serviceOperationId: null, operationPhaseId: null,
      forecast: { readyAtTick: Math.min(current.starts, request.key.readyAtTick), startsAtTick: current.starts, endsAtTick: current.ends,
        queueMinutes: Math.max(0, current.starts - request.key.readyAtTick), walkingMinutes: 0, patientPath: [],
        employeePaths: [{ employeeId: current.resource.employeeIds[0]!, path: [copy(current.resource.staffAnchor)] }], founderPath: [],
        tilesPerTick: context.balanceRelease.facility.characterTravelTilesPerTick } };
    results.set(readingRequestId(request.key), phase); busy({ request, phase, continuous: current.continuous });
  }
  const finish = (segment: Segment) => {
    active.splice(active.indexOf(segment), 1);
    const employee = predicted.employees.find(entry => entry.id === segment.phase.resource!.employeeIds[0])!;
    if (employee.facilityTask?.targetId === taskId(segment.request)) employee.facilityTask = null;
    employee.location = copy(segment.phase.resource!.staffAnchor); employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
  };
  const carries = (resource: DiagnosticResourceChoice) => {
    const employeeId = resource.employeeIds[0]!;
    return !Object.values(predicted.employeeDiscussions ?? {}).some(discussion => discussion.employeeId === employeeId && !["resolved", "cancelled"].includes(discussion.lifecycle)) &&
      !(predicted.environment.founderActivity?.kind === "praise_employee" && predicted.environment.founderActivity.targetId === employeeId) &&
      !predicted.retailOperations.some(operation => !["completed", "cancelled", "abandoned"].includes(operation.status) &&
        (operation.servingEmployeeId === employeeId || operation.actorKind === "employee" && operation.actorId === employeeId));
  };
  const accept = (request: ReadingForecastRequest, phase: DiagnosticOrderPhase): Segment => {
    pending.splice(pending.indexOf(request), 1);
    if (phase.readingUpgradeWork?.durationMinutes === null) phase.readingUpgradeWork.quotedRoomInstanceId = phase.resource!.roomInstanceId;
    results.set(readingRequestId(request.key), phase);
    const segment = { request, phase, continuous: Boolean(request.draft.readingUpgradeWork && carries(phase.resource!)) };
    busy(segment); return segment;
  };
  const schedule = (request: ReadingForecastRequest, boundary: number, token?: { resource: DiagnosticResourceChoice; atTick: number }) => {
    const trial = cloneCalendar(working);
    trial.readingHandoffs.clear();
    if (token) trial.readingHandoffs.set(token.resource.employeeIds[0]!, copy(token));
    const compatible = !request.preferred || resourceCandidates(predicted, context, request.draft.requirement!).some(resource =>
      resource.roomInstanceId === request.preferred!.roomInstanceId && resource.stationId === request.preferred!.stationId &&
      resource.employeeIds.join(":") === request.preferred!.employeeIds.join(":"));
    const effectivePreferred = isDiagnosticResourceWaitingForTraining(predicted, request.preferred) || !compatible ? null : request.preferred;
    if (token && effectivePreferred && (token.resource.roomInstanceId !== effectivePreferred.roomInstanceId ||
      token.resource.stationId !== effectivePreferred.stationId || token.resource.employeeIds.join(":") !== effectivePreferred.employeeIds.join(":"))) return null;
    const preferred = token?.resource ?? effectivePreferred;
    const work = request.draft.readingUpgradeWork;
    const phase = schedulePhase(predicted, context, trial, request.draft, token ? request.ready : Math.max(boundary, request.ready), request.origin, preferred,
      request.remaining, request.operationId ?? request.key.orderId, false,
      work?.durationMinutes === null ? resource => quoteReadingUpgradeWork(work, resource!.roomInstanceId) : undefined);
    if (!phase || !phase.resource || phase.forecast.startsAtTick - phase.forecast.walkingMinutes > boundary ||
      token && (phase.forecast.walkingMinutes !== 0 || phase.forecast.startsAtTick !== token.atTick)) {
      if (phase) addEvent(phase.forecast.startsAtTick - phase.forecast.walkingMinutes);
      return null;
    }
    working.intervals = trial.intervals; working.actors = trial.actors;
    // The event boundary gates reservations, not the original dependency-ready queue clock.
    const forecastReady = Math.min(phase.forecast.startsAtTick - phase.forecast.walkingMinutes, Math.max(state.facilityTick, request.ready));
    phase.forecast.readyAtTick = forecastReady;
    phase.forecast.queueMinutes = phase.forecast.startsAtTick - phase.forecast.walkingMinutes - forecastReady;
    return accept(request, phase);
  };
  while (events.size && (pending.length || active.length)) {
    const boundary = Math.min(...events); events.delete(boundary); processedBoundary = boundary; predicted.facilityTick = boundary;
    const due = active.filter(segment => segment.phase.forecast.endsAtTick <= boundary)
      .sort((a, b) => a.phase.forecast.endsAtTick - b.phase.forecast.endsAtTick || compareReadingQueueKeys(a.request.key, b.request.key));
    due.forEach(finish);
    // A committed successor, not just the originally saved task, keeps its reader busy.
    for (const segment of active) if (segment.phase.forecast.startsAtTick <= boundary) {
      const employee = predicted.employees.find(entry => entry.id === segment.phase.resource!.employeeIds[0])!;
      employee.location = copy(segment.phase.resource!.staffAnchor); employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
    }
    for (const [employeeId, session] of sessions) {
      const employee = predicted.employees.find(entry => entry.id === employeeId)!;
      if (!employee.training) continue;
      if (session.availableAtTick <= boundary) {
        employee.training = null; employee.location = copy(session.homeLocation); employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
      } else if (session.completedAtTick <= boundary) {
        employee.training.stage = "returning"; employee.training.roomInstanceId = null; employee.training.placeId = null;
      } else if (session.seatedAtTick <= boundary) {
        employee.training.stage = "training"; employee.training.lastProgressAtFacilityTick = session.seatedAtTick;
        employee.training.remainingMinutes = session.completedAtTick - session.seatedAtTick;
        employee.location = copy(session.place.location); employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
      }
    }
    // Retire only actual, finitely forecast current duties, never prospective bookings.
    for (const operation of predicted.serviceOperations) {
      const completion = working.operationCompletions.get(operation.id);
      if (!readingIds.has(operation.id) && completion && !completion.blocked && completion.endsAtTick <= boundary) {
        operation.status = "completed";
        for (const employee of predicted.employees) if (employee.facilityTask?.targetId === operation.id) employee.facilityTask = null;
      }
    }
    for (const employee of predicted.employees) {
      const original = state.employees.find(entry => entry.id === employee.id)!, task = original.facilityTask;
      if (!task || readingIds.has(task.targetId ?? "")) continue;
      const ends = dutyEnds.get(employee.id);
      if (ends !== null && ends !== undefined && ends <= boundary && employee.facilityTask?.targetId === task.targetId) {
        employee.facilityTask = null; employee.location = actorOrigin(projection.baseline, employee.id, boundary, employee.location);
        employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
      }
    }
    for (const departure of getQueuedEmployeeTrainingDepartures(predicted, context, boundary, new Set(), true)) {
      if (sessions.has(departure.employeeId)) continue;
      sessions.set(departure.employeeId, departure);
      const employee = predicted.employees.find(entry => entry.id === departure.employeeId)!;
      employee.training!.stage = "walking_to_training"; employee.training!.roomInstanceId = departure.place.roomInstanceId; employee.training!.placeId = departure.place.placeId;
      const outgoing = due.find(segment => segment.phase.resource!.employeeIds.includes(employee.id));
      const starts = outgoing?.phase.forecast.endsAtTick ?? boundary;
      const intervals = working.intervals.get(`employee:${employee.id}`) ?? [];
      intervals.push({ starts, ends: departure.availableAtTick }); working.intervals.set(`employee:${employee.id}`, intervals);
      const actors = working.actors.get(employee.id) ?? [];
      actors.push({ starts, ends: departure.availableAtTick, destination: copy(departure.homeLocation) }); working.actors.set(employee.id, actors);
      [departure.seatedAtTick, departure.completedAtTick, departure.availableAtTick].forEach(addEvent);
    }
    const tokens = due.filter(segment => segment.continuous && Math.ceil(segment.phase.forecast.endsAtTick) === boundary &&
      predicted.employees.find(employee => employee.id === segment.phase.resource!.employeeIds[0])!.training?.stage !== "walking_to_training")
      .map(segment => ({ resource: segment.phase.resource!, atTick: segment.phase.forecast.endsAtTick, key: segment.request.key }));
    while (tokens.length) {
      tokens.sort((a, b) => a.atTick - b.atTick || compareReadingQueueKeys(a.key, b.key));
      const token = tokens.shift()!;
      const next = pending.find(request => request.draft.readingUpgradeWork && request.draft.readingUpgradeWork.executionEnabledAtTick !== null &&
        request.draft.readingUpgradeWork.acceptedAtTick <= token.atTick && request.draft.readingUpgradeWork.executionEnabledAtTick <= token.atTick &&
        request.ready <= token.atTick && schedule(request, boundary, token));
      if (!next) continue;
      const segment = active.find(entry => entry.request === next)!;
      if (segment.phase.forecast.endsAtTick <= boundary) {
        finish(segment); tokens.push({ ...token, atTick: segment.phase.forecast.endsAtTick, key: next.key });
      }
    }
    working.readingHandoffs.clear();
    for (const request of [...pending]) if (request.ready <= boundary) {
      const segment = schedule(request, boundary);
      if (segment && segment.phase.forecast.endsAtTick <= boundary) finish(segment);
    }
  }
  projection.results = results;
  calendar.intervals = working.intervals; calendar.actors = working.actors; calendar.readingHandoffs.clear();
  calendar.operationCompletions = working.operationCompletions;
  for (const request of requests) if (request.operationId) {
    const phase = results.get(readingRequestId(request.key));
    calendar.operationCompletions.set(request.operationId, phase ? { endsAtTick: phase.forecast.endsAtTick,
      phases: new Map([[request.key.phaseId, phase.forecast.endsAtTick]]), blocked: false, readingForecast: copy(phase.forecast),
      ...(request.draft.readingUpgradeWork?.durationMinutes === null ? { readingQuote: { roomInstanceId: phase.resource!.roomInstanceId, durationMinutes: phase.durationMinutes } } : {}) }
      : { endsAtTick: state.facilityTick, phases: new Map(), blocked: true });
  }
}

function calendarFor(state: GameState, context: DomainContext, ignoredOrderId: string, encounterId: string): Calendar {
  const calendar: Calendar = { intervals: new Map(), actors: new Map(), heldResources: new Map(), operationCompletions: new Map(), readingHandoffs: new Map(), readingProjection: null };
  const now = state.facilityTick;
  const operations = state.serviceOperations.filter(activeOperation).sort((a, b) =>
    Number(b.phaseEndsAtFacilityTick !== null) - Number(a.phaseEndsAtFacilityTick !== null) || a.createdAtFacilityTick - b.createdAtFacilityTick || a.id.localeCompare(b.id));
  const trackedIds = new Set(operations.map((operation) => operation.id));
  const operationCompletions = calendar.operationCompletions;
  for (const operation of state.serviceOperations.filter((entry) => entry.diagnosticPhysicalWork)) {
    const witnessed = operation.diagnosticPhysicalWork!.phaseWitnesses.filter((witness) => witness.completedAtFacilityTick !== null);
    if (witnessed.length) operationCompletions.set(operation.id, { endsAtTick: Math.max(...witnessed.map((witness) => witness.completedAtFacilityTick!)),
      phases: new Map(witnessed.map((witness) => [witness.operationPhaseId, witness.completedAtFacilityTick!])), blocked: false });
  }
  for (const operation of state.serviceOperations.filter((entry) => entry.status === "completed" && entry.completedAtFacilityTick !== null)) {
    if (operation.diagnosticPhysicalWork) continue;
    const phases = operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? [];
    operationCompletions.set(operation.id, { endsAtTick: operation.completedAtFacilityTick!, phases: new Map(phases.length === 1 ? [[phases[0]!.id, operation.completedAtFacilityTick!]] : []), blocked: false });
  }
  for (const operation of operations) {
    if (operation.periopBedReservation) holdResource(calendar, `station:${operation.periopBedReservation.roomInstanceId}:${operation.periopBedReservation.bedId}`, operation.id);
    for (const roomId of [...(operation.transitionHeldRoomInstanceIds ?? []), ...(operation.status === "waiting_for_next_phase" ? operation.reservedRoomInstanceIds : [])]) {
      holdResource(calendar, `room:${roomId}`, operation.id);
    }
  }
  const reserveFiniteWork = (key: string, actorPath: GridPoint[], pathIndex: number, workMinutes: number, observedEnd?: number) => {
    if (observedEnd === undefined && (!Number.isSafeInteger(workMinutes) || workMinutes < 0 || workMinutes === Number.MAX_SAFE_INTEGER)) return;
    const walking = Math.ceil(Math.max(0, actorPath.length - 1 - pathIndex) / context.balanceRelease.facility.characterTravelTilesPerTick);
    const ends = observedEnd ?? now + walking + workMinutes;
    if (ends > now) calendar.intervals.set(key, [{ starts: now, ends }]);
    const endpoint = actorPath.at(-1);
    if (endpoint) calendar.actors.set(key === "founder" ? key : key.slice("employee:".length), [{ starts: now, ends, destination: endpoint }]);
  };
  for (const employee of state.employees) {
    const training = getEmployeeTrainingAvailability(state, employee, context);
    if (training.kind === "blocked") {
      holdResource(calendar, `employee:${employee.id}`, `training:${employee.id}`);
      const home = getEmployeeTrainingHomeLocation(state, employee, context);
      if (home) calendar.actors.set(employee.id, [{ starts: now, ends: now, destination: home }]);
      continue;
    }
    if (training.kind === "returning_at") {
      // Service reservations run before training clears the returning stage on
      // tick T. New queued work can first claim that employee on tick T + 1.
      const reservableAtTick = training.availableAtTick + 1;
      calendar.intervals.set(`employee:${employee.id}`, [{ starts: now, ends: reservableAtTick }]);
      calendar.actors.set(employee.id, [{ starts: now, ends: reservableAtTick, destination: training.homeLocation }]);
      continue;
    }
    const outsidePriorityEnd = getOutsideReadPriorityEnd(state, employee.id, context);
    if (outsidePriorityEnd !== null) {
      calendar.intervals.set(`employee:${employee.id}`, [{ starts: now, ends: outsidePriorityEnd }]);
      calendar.actors.set(employee.id, [{ starts: now, ends: outsidePriorityEnd, destination: employee.location }]);
    }
    const task = employee.facilityTask;
    if (!task || task.kind === "cover_periop" || task.targetId && trackedIds.has(task.targetId)) continue;
    const trackedAcquisition = Object.values(state.encounters).some((entry) => entry.pendingResult?.deliveredAtTick === null &&
      (entry.pendingResult.imagingTechnicianId === employee.id || entry.pendingResult.phlebotomistId === employee.id));
    if (trackedAcquisition && (task.kind === "perform_imaging" || task.kind === "perform_service")) continue;
    const observedEnd = currentFacilityDutyEnd(state, employee, context);
    if (observedEnd !== null) reserveFiniteWork(`employee:${employee.id}`, employee.path, employee.pathIndex, task.workMinutesRemaining, observedEnd);
    else if (isProceduralSpecialistRole(employee.staffRoleDefinitionId)) holdResource(calendar, `employee:${employee.id}`, `duty:${employee.id}`);
  }
  const founder = state.environment.founderActivity;
  const preemptibleFounderKinds = ["return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"];
  // Enact Plan releases attendance for this chart; it is not another queue item.
  if (founder && !(founder.kind === "attend_encounter" && founder.targetId === encounterId) &&
    !preemptibleFounderKinds.includes(founder.kind) && !trackedIds.has(founder.targetId)) {
    reserveFiniteWork("founder", founder.path, founder.pathIndex, founder.workMinutesRemaining);
  }
  const currentClaims = new Map<string, { resource: DiagnosticResourceChoice; endsAtTick: number }>();
  for (const operation of operations) {
    const phase = (operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? [])[operation.phaseIndex];
    if (!phase?.roomDefinitionId || ["arriving", "waiting_for_resources", "waiting_for_next_phase", "discharging", "leaving"].includes(operation.status)) continue;
    const room = state.rooms.find((entry) => operation.reservedRoomInstanceIds.includes(entry.id) && entry.roomDefinitionId === phase.roomDefinitionId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    if (!room || !definition) continue;
    if (operation.diagnosticPhaseWork) {
      const resource = operation.diagnosticPhaseWork.resource;
      const compatible = resource && resourceCandidates(state, context, processingRequirement(operation.diagnosticPhaseWork.kind)).some((candidate) =>
        candidate.roomInstanceId === resource.roomInstanceId && candidate.stationId === resource.stationId && candidate.employeeIds.join(":") === resource.employeeIds.join(":"));
      if (!compatible) continue;
    }
    const movingActors = [operation, ...state.employees.filter((employee) => operation.reservedEmployeeIds.includes(employee.id)),
      ...(state.environment.founderActivity?.targetId === operation.id ? [state.environment.founderActivity] : [])];
    const walking = Math.max(0, ...movingActors.map((actor) => Math.ceil(Math.max(0, actor.path.length - 1 - actor.pathIndex) / context.balanceRelease.facility.characterTravelTilesPerTick)));
    const attentionReady = getCurrentPeriopNurseAttention(operation)?.readyAtFacilityTick != null;
    const attentionEnd = attentionReady ? forecastPeriopNurseAttentionEnd(state, operation, context) : now;
    if (attentionEnd === null) continue;
    const requiredEndsAtTick = operation.diagnosticPhaseWork?.readingUpgradeWork && operation.status === "in_service" && operation.phaseEndsAtFacilityTick !== null
      ? operation.phaseEndsAtFacilityTick : Math.max(now, operation.phaseEndsAtFacilityTick ?? now + walking + (operation.saleTransfer?.remainingPhaseMinutes ?? operation.diagnosticPhaseWork?.remainingMinutes ?? operation.diagnosticPhysicalWork?.remainingPhaseMinutes ?? phase.durationMinutes));
    const endsAtTick = attentionReady ? Math.max(requiredEndsAtTick, attentionEnd) : requiredEndsAtTick;
    const resource = operation.diagnosticPhaseWork?.resource ?? operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource ?? {
      roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId, stationId: operation.periopBedReservation?.roomInstanceId === room.id ? operation.periopBedReservation.bedId : null,
      employeeIds: [...operation.reservedEmployeeIds], provider: operation.providerReservation,
      patientAnchor: operation.periopBedReservation?.roomInstanceId === room.id ? operation.periopBedReservation.endpoint : room.roomDefinitionId === "room.phlebotomy" ?
        getRoomCareAnchor(room, definition, "patient") : getRoomNavigationAnchor(room, definition, "primary"),
      staffAnchor: room.roomDefinitionId === "room.periop_recovery" ? getRoomSharedStaffAnchor(room, definition) : room.roomDefinitionId === "room.phlebotomy" ?
        getRoomCareAnchor(room, definition, "clinician") : getRoomNavigationAnchor(room, definition, "staff"),
    };
    reserve(calendar, resource, now, endsAtTick);
    currentClaims.set(operation.id, { resource, endsAtTick });
  }
  const scheduleOperation = (operation: ServiceOperationState) => {
    const frozen = operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? [];
    let ready = now;
    const phaseCompletions = new Map(operation.diagnosticPhysicalWork?.phaseWitnesses.flatMap((witness) => witness.completedAtFacilityTick !== null ? [[witness.operationPhaseId, witness.completedAtFacilityTick] as const] : []) ?? []);
    let actorOrigin = operation.actorKind === "encounter" ? state.encounters[operation.actorId]?.patientLocation ?? operation.location ?? state.environment.founderLocation : operation.location ?? state.environment.founderLocation;
    const waitingForNext = operation.status === "waiting_for_next_phase";
    const workFinished = operation.status === "discharging" || operation.status === "leaving";
    const startIndex = workFinished ? frozen.length : operation.phaseIndex + (waitingForNext ? 1 : 0);
    if ((waitingForNext || workFinished) && frozen[operation.phaseIndex] && !phaseCompletions.has(frozen[operation.phaseIndex]!.id)) phaseCompletions.set(frozen[operation.phaseIndex]!.id,
      operation.completedAtFacilityTick ?? operation.nextPhaseReadyAtFacilityTick ?? now);
    const clearHeldRoom = (roomId: string, patientPath: GridPoint[], movementStarts: number) => {
      const firstOutside = patientPath.findIndex((point) => containingRoomId(state, context, point) !== roomId);
      if (firstOutside < 0) return;
      const clearsAt = movementStarts + Math.ceil(firstOutside / context.balanceRelease.facility.characterTravelTilesPerTick);
      releaseHold(calendar, `room:${roomId}`, operation.id, now, clearsAt);
    };
    if (operation.path.length && ["walking_between_phases", "discharging", "leaving"].includes(operation.status)) {
      for (const roomId of operation.transitionHeldRoomInstanceIds ?? []) clearHeldRoom(roomId, operation.path.slice(operation.pathIndex), now);
    }
    let blocked = false;
    let readingQuote: OperationCompletion["readingQuote"];
    let readingForecast: OperationCompletion["readingForecast"];
    for (let index = startIndex; index < frozen.length; index += 1) {
      const phase = frozen[index]!;
      const requirement = operation.diagnosticPhaseWork ? processingRequirement(operation.diagnosticPhaseWork.kind) : requirementForOperation(phase);
      if (!requirement) { ready += phase.durationMinutes; phaseCompletions.set(phase.id, ready); continue; }
      const isCurrent = index === operation.phaseIndex;
      if (isCurrent && getCurrentPeriopNurseAttention(operation)?.readyAtFacilityTick != null &&
        forecastPeriopNurseAttentionEnd(state, operation, context) === null) { blocked = true; break; }
      const current = isCurrent ? currentClaims.get(operation.id) : null;
      if (current) {
        ready = current.endsAtTick;
        actorOrigin = current.resource.patientAnchor;
      } else {
        const remaining = isCurrent ? operation.saleTransfer?.remainingPhaseMinutes ?? operation.diagnosticPhaseWork?.remainingMinutes ?? operation.diagnosticPhysicalWork?.remainingPhaseMinutes ?? phase.durationMinutes : phase.durationMinutes;
        const heldBed = requirement.stationKind === "periop_bed" && operation.periopBedReservation ? resourceCandidates(state, context, requirement).find((resource) =>
          resource.roomInstanceId === operation.periopBedReservation!.roomInstanceId && resource.stationId === operation.periopBedReservation!.bedId) : null;
        if (requirement.stationKind === "periop_bed" && operation.periopBedReservation && !heldBed) { blocked = true; break; }
        const acceptedResource = operation.diagnosticPhysicalWork?.phaseBindings[index]?.resource ?? (isCurrent ? operation.diagnosticPhaseWork?.resource ?? heldBed : heldBed);
        const replaceStaff = isDiagnosticResourceWaitingForTraining(state, acceptedResource) || Boolean(operation.diagnosticPhaseWork?.readingUpgradeWork && acceptedResource &&
          !resourceCandidates(state, context, requirement).some((resource) => resource.roomInstanceId === acceptedResource.roomInstanceId &&
            resource.stationId === acceptedResource.stationId && resource.employeeIds.join(":") === acceptedResource.employeeIds.join(":")));
        const retainBed = replaceStaff && requirement.stationKind === "periop_bed" && Boolean(heldBed ?? acceptedResource);
        const reading = operation.diagnosticPhaseWork?.readingUpgradeWork;
        const scheduled = schedulePhase(state, context, calendar, { id: operation.id + ":" + phase.id, componentId: null, kind: "retained", mode: "local",
          patientPresent: operation.actorKind !== "remote", durationMinutes: phase.durationMinutes, dependsOn: [], requirement,
          ...(reading ? { readingUpgradeWork: reading } : {}) }, ready, actorOrigin,
          replaceStaff ? retainBed ? heldBed ?? acceptedResource : null : acceptedResource, remaining, operation.id, false,
          reading?.durationMinutes === null ? (resource) => quoteReadingUpgradeWork(reading, resource!.roomInstanceId) :
            operation.trainingTiming?.phases[index]?.boundPercent === null ? (resource) => getServiceOperationTrainingMinutes(state, operation, index, resource?.provider ?? null) : undefined, retainBed);
        if (!scheduled) { blocked = true; break; }
        if (reading?.durationMinutes === null && scheduled.resource) readingQuote = { roomInstanceId: scheduled.resource.roomInstanceId, durationMinutes: scheduled.durationMinutes };
        if (reading) readingForecast = scheduled.forecast;
        const movementStarts = scheduled.forecast.readyAtTick + scheduled.forecast.queueMinutes;
        if (index === startIndex) for (const roomId of [...(operation.transitionHeldRoomInstanceIds ?? []), ...(waitingForNext ? operation.reservedRoomInstanceIds : [])]) {
          clearHeldRoom(roomId, scheduled.forecast.patientPath, movementStarts);
        }
        const outgoing = currentClaims.get(operation.id);
        if (index === operation.phaseIndex + 1 && outgoing && outgoing.resource.roomDefinitionId !== "room.periop_recovery") {
          const firstOutside = scheduled.forecast.patientPath.findIndex((point) => containingRoomId(state, context, point) !== outgoing.resource.roomInstanceId);
          if (firstOutside >= 0) {
            const key = `room:${outgoing.resource.roomInstanceId}`;
            const intervals = calendar.intervals.get(key) ?? [];
            intervals.push({ starts: outgoing.endsAtTick, ends: movementStarts + Math.ceil(firstOutside / context.balanceRelease.facility.characterTravelTilesPerTick) });
            calendar.intervals.set(key, intervals);
          }
        }
        ready = scheduled.forecast.endsAtTick;
        actorOrigin = scheduled.resource?.patientAnchor ?? actorOrigin;
      }
      phaseCompletions.set(phase.id, ready);
    }
    if (operation.periopBedReservation) {
      const reservation = operation.periopBedReservation;
      const key = `station:${reservation.roomInstanceId}:${reservation.bedId}`;
      const remainingWalking = workFinished ? Math.ceil(Math.max(0, operation.path.length - 1 - operation.pathIndex) / context.balanceRelease.facility.characterTravelTilesPerTick) : 0;
      if (!blocked) releaseHold(calendar, key, operation.id, now, ready + remainingWalking);
    }
    operationCompletions.set(operation.id, { endsAtTick: ready, phases: phaseCompletions, blocked,
      ...(readingQuote ? { readingQuote } : {}), ...(readingForecast ? { readingForecast } : {}) });
  };
  // Legacy acquisitions already have frozen clocks and concrete workers.
  const orderedEncounters = Object.values(state.encounters).sort((a, b) => a.waiting.arrivedAtTick - b.waiting.arrivedAtTick || a.id.localeCompare(b.id));
  for (const encounter of orderedEncounters.filter((entry) => !entry.pendingResult?.resourceQueue)) {
    const pending = encounter.pendingResult;
    if (!pending || pending.diagnosticTiming || pending.deliveredAtTick !== null || pending.localServiceOperation) continue;
    const phases = pending.timingPhases?.filter((phase) => phase.resourceBound && phase.endsAtTick > now) ?? [];
    const ends = phases.length ? Math.max(...phases.map((phase) => phase.endsAtTick)) : pending.timingPhases?.length ? now : pending.dueTick;
    if (ends <= now) continue;
    for (const requirement of pending.resourceReservations ?? []) {
      const destination = pending.patientTravel?.destinationRoomInstanceId;
      const room = state.rooms.find((entry) => entry.id === destination && entry.roomDefinitionId === requirement.roomDefinitionId) ??
        state.rooms.find((entry) => entry.roomDefinitionId === requirement.roomDefinitionId && entry.id === encounter.assignedRoomInstanceId) ?? state.rooms.find((entry) => entry.roomDefinitionId === requirement.roomDefinitionId);
      const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
      if (!room || !definition) continue;
      const explicitEmployee = requirement.staffRoleDefinitionId === "staff.imaging_technician" ? pending.imagingTechnicianId : requirement.staffRoleDefinitionId === "staff.phlebotomist" ? pending.phlebotomistId : null;
      const employeeId = explicitEmployee ?? state.employees.find((employee) => employee.homeRoomInstanceId === room.id && employee.staffRoleDefinitionId === requirement.staffRoleDefinitionId)?.id;
      reserve(calendar, { roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId, stationId: null,
        employeeIds: employeeId ? [employeeId] : [], provider: pending.providerReservation ?? null,
        patientAnchor: getRoomCareAnchor(room, definition, "patient"), staffAnchor: getRoomNavigationAnchor(room, definition, "staff") }, now, ends);
    }
  }
  // Every current claim is seeded before any operation forecasts its next phase.
  // Existing patients farthest through their reserved bed chain release capacity
  // before a newly queued operation is allowed to choose that bed.
  for (const operation of operations.filter(entry => entry.diagnosticPhaseWork?.kind !== "interpretation").sort((a, b) => Number(Boolean(b.periopBedReservation)) - Number(Boolean(a.periopBedReservation)) ||
    b.phaseIndex - a.phaseIndex || Number(b.status === "waiting_for_next_phase") - Number(a.status === "waiting_for_next_phase") ||
    (a.phaseEndsAtFacilityTick ?? now) - (b.phaseEndsAtFacilityTick ?? now) || a.createdAtFacilityTick - b.createdAtFacilityTick || a.id.localeCompare(b.id))) scheduleOperation(operation);
  // Separate insertion lane; unrelated service ordering never switches comparators.
  calendar.readingProjection = { baseline: cloneCalendar(calendar), requests: new Map(), results: new Map() };
  for (const operation of operations.filter(entry => entry.diagnosticPhaseWork?.kind === "interpretation")) {
    const work = operation.diagnosticPhaseWork!, key = readingOperationQueueKey(operation), current = currentClaims.get(operation.id);
    calendar.readingProjection.requests.set(readingRequestId(key), { key, operationId: operation.id,
      draft: { id: work.phaseId, componentId: null, kind: "interpretation", mode: "local", patientPresent: false, durationMinutes: work.durationMinutes,
        dependsOn: [], requirement: processingRequirement("interpretation"), ...(work.readingUpgradeWork ? { readingUpgradeWork: copy(work.readingUpgradeWork) } : {}) },
      ready: work.readingUpgradeWork?.readyAtTick ?? now, remaining: work.remainingMinutes, origin: copy(state.environment.founderLocation), preferred: copy(work.resource),
      current: current ? { resource: copy(current.resource), ends: current.endsAtTick,
        starts: operation.phaseStartedAtFacilityTick ?? current.endsAtTick - work.remainingMinutes,
        continuous: hasReadingStationContinuity(state, operation, context, current.endsAtTick) } : null });
  }
  projectReadingCalendar(state, context, calendar);
  for (const encounter of orderedEncounters.filter((entry) => entry.pendingResult?.resourceQueue && !entry.pendingResult.diagnosticTiming)) {
    const pending = encounter.pendingResult!;
    const route = context.balanceRelease.services.find((service) => service.id === pending.resourceQueue!.serviceId)?.routes.find((entry) => entry.id === pending.resourceQueue!.routeId);
    if (!route) continue;
    let ready = now;
    let origin = originFor(state, context, encounter.id);
    for (const phase of physicalPhases(route, {}, getDiagnosticTimingRuleForService(pending.resourceQueue!.serviceId) ?? { family: "retained", reason: "existing_procedure" })) {
      const scheduled = schedulePhase(state, context, calendar, { id: pending.operationId + ":" + phase.id, componentId: null, kind: "retained", mode: "local", patientPresent: true,
        durationMinutes: phase.durationMinutes, dependsOn: [], requirement: requirementForOperation(phase) }, ready, origin);
      if (scheduled) { ready = scheduled.forecast.endsAtTick; origin = scheduled.resource?.patientAnchor ?? origin; }
    }
  }
  for (const plan of getDiagnosticOrderPlans(state).filter((entry) => entry.orderId !== ignoredOrderId)) {
    forecastFrozenPlan(state, plan, context, calendar);
  }
  return calendar;
}

export interface DiagnosticOrderForecast {
  plan: DiagnosticOrderPlan;
  /** These phases have no valid completion estimate until capacity is restored. */
  blockedPhaseIds: string[];
}

function setForecastEnd(phase: DiagnosticOrderPhase, end: number, createdAtTick: number): void {
  const starts = phase.readingUpgradeWork && phase.startedAtTick !== null ? phase.startedAtTick :
    Math.max(createdAtTick, end - Math.min(phase.readingUpgradeWork ? phase.remainingMinutes : phase.durationMinutes, Math.max(0, end - createdAtTick)));
  const ready = Math.min(starts, phase.forecast.readyAtTick);
  const walking = Math.min(phase.forecast.walkingMinutes, Math.floor(starts - ready));
  phase.forecast = { ...phase.forecast, readyAtTick: ready, startsAtTick: starts, endsAtTick: end,
    queueMinutes: starts - ready - walking, walkingMinutes: walking };
}

function applyReadingProjection(plan: DiagnosticOrderPlan, calendar: Calendar, ends?: Map<string, number>, blocked?: Set<string>): void {
  const projection = calendar.readingProjection;
  if (!projection) return;
  for (const phase of plan.phases) {
    if (!phase.readingUpgradeWork || phase.status === "completed" || phase.status === "cancelled") continue;
    const id = JSON.stringify([plan.orderId, phase.id]);
    if (!projection.requests.has(id)) continue;
    const result = projection.results.get(id);
    if (!result) { blocked?.add(phase.id); continue; }
    phase.forecast = copy(result.forecast); ends?.set(phase.id, result.forecast.endsAtTick);
    if (phase.readingUpgradeWork.durationMinutes === null) {
      phase.readingUpgradeWork.quotedRoomInstanceId = result.resource!.roomInstanceId;
      phase.durationMinutes = phase.remainingMinutes = result.durationMinutes;
    }
  }
}

/** Shared calendar insertion and frozen-plan forecast, with no balance timing lookup. */
function forecastFrozenPlan(state: GameState, frozenPlan: DiagnosticOrderPlan, context: DomainContext, calendar: Calendar): DiagnosticOrderForecast {
  const plan = copy(frozenPlan);
  const now = state.facilityTick;
  const ends = new Map<string, number>();
  const blocked = new Set<string>();
  let origin = originFor(state, context, plan.encounterId);
  for (const phase of plan.phases) {
    if (phase.status === "completed" || phase.status === "cancelled") {
      const completed = phase.completedAtTick ?? now;
      if (phase.status === "completed") setForecastEnd(phase, completed, plan.createdAtTick);
      ends.set(phase.id, completed);
      if (phase.patientPresent) origin = phase.forecast.patientPath.at(-1) ?? phase.resource?.patientAnchor ?? origin;
      continue;
    }
    if (phase.dependsOn.some((id) => blocked.has(id))) { blocked.add(phase.id); continue; }
    const linked = phase.serviceOperationId ? calendar.operationCompletions.get(phase.serviceOperationId) : null;
    if (linked) {
      const end = phase.operationPhaseId ? linked.phases.get(phase.operationPhaseId) : linked.endsAtTick;
      if (linked.blocked && (!phase.operationPhaseId || end === undefined)) { blocked.add(phase.id); continue; }
      const completion = end ?? linked.endsAtTick;
      if (phase.readingUpgradeWork?.durationMinutes === null && linked.readingQuote) {
        phase.readingUpgradeWork.quotedRoomInstanceId = linked.readingQuote.roomInstanceId;
        phase.durationMinutes = phase.remainingMinutes = linked.readingQuote.durationMinutes;
      }
      if (phase.readingUpgradeWork && linked.readingForecast) phase.forecast = copy(linked.readingForecast);
      else setForecastEnd(phase, completion, plan.createdAtTick);
      ends.set(phase.id, completion);
      if (phase.patientPresent) origin = phase.resource?.patientAnchor ?? phase.forecast.patientPath.at(-1) ?? origin;
      continue;
    }
    const ready = Math.max(now, ...phase.dependsOn.map((id) => ends.get(id) ?? now));
    const elapsed = phase.status === "active" && phase.startedAtTick !== null ? Math.max(0, now - phase.startedAtTick) : 0;
    if (phase.kind === "patient_return" || phase.kind === "patient_departure") {
      const frozenWalking = Math.ceil(Math.max(0, phase.forecast.patientPath.length - 1) / phase.forecast.tilesPerTick);
      const walking = Math.max(0, frozenWalking - elapsed);
      phase.forecast = { ...phase.forecast, readyAtTick: ready, startsAtTick: ready + walking, endsAtTick: ready + walking, walkingMinutes: walking, queueMinutes: 0 };
      ends.set(phase.id, phase.forecast.endsAtTick);
      origin = phase.forecast.patientPath.at(-1) ?? origin;
      continue;
    }
    const remaining = Math.max(0, phase.remainingMinutes - elapsed);
    const replaceStaff = phase.status !== "active" && (isDiagnosticResourceWaitingForTraining(state, phase.resource) || Boolean(phase.readingUpgradeWork && phase.resource && phase.requirement &&
      !resourceCandidates(state, context, phase.requirement).some((resource) => resource.roomInstanceId === phase.resource!.roomInstanceId &&
        resource.stationId === phase.resource!.stationId && resource.employeeIds.join(":") === phase.resource!.employeeIds.join(":"))));
    const retainBed = replaceStaff && phase.requirement?.stationKind === "periop_bed";
    const preferred = replaceStaff && !retainBed ? null : phase.resource;
    const reading = phase.readingUpgradeWork;
    const scheduled = schedulePhase(state, context, calendar, phase, ready, origin, preferred, remaining, plan.orderId, phase.status === "active",
      reading?.durationMinutes === null ? (resource) => quoteReadingUpgradeWork(reading, resource!.roomInstanceId) : undefined, retainBed);
    if (!scheduled) { blocked.add(phase.id); continue; }
    phase.forecast = scheduled.forecast;
    if (reading?.durationMinutes === null && scheduled.resource) {
      reading.quotedRoomInstanceId = scheduled.resource.roomInstanceId;
      phase.durationMinutes = phase.remainingMinutes = scheduled.durationMinutes;
    }
    // A cleared choice may be forecast against compatible capacity without
    // allocating or changing the persisted choice used by the executor.
    ends.set(phase.id, phase.forecast.endsAtTick);
    if (phase.patientPresent && scheduled.resource) origin = scheduled.resource.patientAnchor;
  }
  applyReadingProjection(plan, calendar, ends, blocked);
  for (const marker of [plan.resultReady, plan.careComplete, plan.visualResultReady]) {
    if (!marker) continue;
    if (marker.reachedAtTick !== null) marker.forecastAtTick = marker.reachedAtTick;
    else if (!marker.afterPhaseIds.some((id) => blocked.has(id))) marker.forecastAtTick = Math.max(plan.createdAtTick, ...marker.afterPhaseIds.map((id) => ends.get(id) ?? now));
  }
  const prep = plan.phases.find((phase) => phase.kind === "preparation" && phase.resource?.stationId);
  if (prep?.resource && plan.careComplete.reachedAtTick === null && !plan.careComplete.afterPhaseIds.some((id) => blocked.has(id))) {
    reserve(calendar, { ...prep.resource, provider: null }, Math.max(now, prep.forecast.readyAtTick), Math.max(now, plan.careComplete.forecastAtTick));
  }
  return { plan, blockedPhaseIds: [...blocked] };
}

/** Dynamic ETA from frozen inputs; status, choices, IDs and reached clocks stay intact. */
export function forecastDiagnosticOrderPlan(state: GameState, frozenPlan: DiagnosticOrderPlan, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): DiagnosticOrderForecast {
  return forecastFrozenPlan(state, frozenPlan, context, calendarFor(state, context, frozenPlan.orderId, frozenPlan.encounterId));
}

function milestone(phases: DiagnosticOrderPhase[], ids: string[], now: number): DiagnosticOrderMilestone {
  return { afterPhaseIds: ids, forecastAtTick: Math.max(now, ...ids.map((id) => phases.find((phase) => phase.id === id)!.forecast.endsAtTick)), reachedAtTick: null };
}

function appendFrozenWalking(plan: DiagnosticOrderPlan, id: string, patientPath: GridPoint[], dependsOn: string[], kind: "patient_departure" | "patient_return", now: number, tilesPerTick: number): DiagnosticOrderPhase {
  const ready = Math.max(now, ...dependsOn.map((dependency) => plan.phases.find((phase) => phase.id === dependency)!.forecast.endsAtTick));
  const walkingMinutes = Math.ceil(Math.max(0, patientPath.length - 1) / tilesPerTick);
  const phase: DiagnosticOrderPhase = { id, componentId: null, kind, mode: "local", patientPresent: true, durationMinutes: 0, dependsOn,
    requirement: null, resource: null, forecast: { readyAtTick: ready, startsAtTick: ready + walkingMinutes, endsAtTick: ready + walkingMinutes,
      queueMinutes: 0, walkingMinutes, patientPath: copy(patientPath), employeePaths: [], founderPath: [], tilesPerTick },
    status: "pending", remainingMinutes: 0, startedAtTick: null, completedAtTick: null, serviceOperationId: null, operationPhaseId: null };
  plan.phases.push(phase);
  return phase;
}

/** One calculation for a quote and the frozen accepted order; never writes state. */
export function planDiagnosticOrder(state: GameState, request: DiagnosticTimingRequest, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): DiagnosticTimingQuote {
  const calendar = calendarFor(state, context, request.orderId, request.encounterId);
  const trainingCategories = snapshotEmployeeTrainingCategories(state);
  const plan: DiagnosticOrderPlan = { version: "diagnostic-order.v1", timingVersion: DIAGNOSTIC_TIMING_VERSION,
    periopNurseAttentionQuote: { version: "periop-nurse-attention.v1", trainingPercent: trainingCategories["staff.periop_nurse"] ?? 0 },
    orderId: request.orderId, encounterId: request.encounterId,
    createdAtTick: state.facilityTick, execution: "supported", sources: [], phases: [], resultReady: milestone([], [], state.facilityTick), visualResultReady: null, careComplete: milestone([], [], state.facilityTick) };
  const origin = request.patientOrigin ?? originFor(state, context, request.encounterId);
  let patientLocation = origin;
  const resultIds: string[] = [];
  const careIds: string[] = [];
  const visualIds: string[] = [];
  const capabilities = installedCapabilities(state, context);
  if (request.retainedExternalProtocol) {
    const input = request.retainedExternalProtocol;
    const profile = context.balanceRelease.answerChoiceTimingProfiles.find((entry) => entry.id === input.timingProfileId);
    if (!profile) return { kind: "unavailable", reason: "unknown_service_or_profile", estimateMinutes: null };
    const outside = input.mode === "external_patient_visit" ? externalWalk(state, context, origin, request.patientReturnLocation ?? origin) : null;
    if (input.mode === "external_patient_visit" && !outside) return { kind: "unavailable", reason: "no_valid_route", estimateMinutes: profile.durationTicks };
    const departure = outside ? appendFrozenWalking(plan, "diagnostic.protocol.patient_departure", outside.outbound, [], "patient_departure", state.facilityTick, context.balanceRelease.facility.characterTravelTilesPerTick) : null;
    const protocol = schedulePhase(state, context, calendar, { id: "diagnostic.protocol", componentId: null, kind: "retained", mode: "external",
      patientPresent: input.mode === "external_patient_visit", durationMinutes: profile.durationTicks, dependsOn: departure ? [departure.id] : [], requirement: null },
      departure?.forecast.endsAtTick ?? state.facilityTick, origin)!;
    plan.phases.push(protocol);
    const returningPath = outside?.returning ?? path(state, context, origin, request.patientReturnLocation ?? origin, containingRoomId(state, context, request.patientReturnLocation ?? origin));
    const returning = appendFrozenWalking(plan, "diagnostic.protocol.patient_return", returningPath.length ? returningPath : [origin], outside ? [protocol.id] : [], "patient_return", state.facilityTick, context.balanceRelease.facility.characterTravelTilesPerTick);
    plan.sources.push({ componentId: null, serviceId: null, timingProfileId: input.timingProfileId, routeId: null, routeDisplayName: input.label ?? profile.displayName,
      kind: "retained_profile", inclusiveDurationMinutes: profile.durationTicks, routePhases: [], operationPhases: [] });
    plan.resultReady = milestone(plan.phases, [protocol.id], state.facilityTick);
    plan.careComplete = milestone(plan.phases, [returning.id], state.facilityTick);
    return { kind: "planned", plan };
  }
  const components = request.components?.length ? request.components : [request];
  for (const [componentIndex, component] of components.entries()) {
    const mapping = component.timingProfileId ? getDiagnosticTimingProfileMapping(component.timingProfileId) : null;
    const serviceId = component.serviceId ?? mapping?.previewServiceId ?? null;
    const service = context.balanceRelease.services.find((entry) => entry.id === serviceId);
    const profile = context.balanceRelease.answerChoiceTimingProfiles.find((entry) => entry.id === component.timingProfileId);
    const rule = component.serviceId ? getDiagnosticTimingRuleForService(component.serviceId) : mapping?.rule;
    if (component.serviceId && !service) return { kind: "unavailable", reason: "unknown_service_or_profile", estimateMinutes: profile?.durationTicks ?? null };
    if (!rule && !profile) return { kind: "unavailable", reason: "unknown_service_or_profile", estimateMinutes: null };
    const actualRule = rule ?? { family: "retained", reason: "specialist" };
    if (!component.serviceId) plan.execution = "preview_only";
    const routes = (service?.routes ?? []).filter((route) => !component.allowedRouteIds || component.allowedRouteIds.includes(route.id) ||
      (component.allowOnsiteEquivalents === true && routeIsLocal(route))).sort((a, b) => a.preference - b.preference || a.id.localeCompare(b.id));
    const bedsideRequirement: DiagnosticResourceRequirement = { roomDefinitionId: "room.examination", staffRoleDefinitionIds: [], providerRoleDefinitionIds: [], founderEligible: false, stationKind: null };
    const examinationId = state.encounters[request.encounterId]?.assignedRoomInstanceId ?? containingRoomId(state, context, patientLocation);
    const bedsideRoom = actualRule.family === "bladder_scan" ? resourceCandidates(state, context, bedsideRequirement).find((resource) => resource.roomInstanceId === examinationId) : null;
    const bedsideChoice = bedsideRoom ? { ...bedsideRoom, patientAnchor: { ...patientLocation } } : null;
    const canAcquire = (route: ServiceRouteDefinition) => {
      if (actualRule.family === "bladder_scan" && route.patientRemainsOnsite && !route.resourceRequirements.length) return Boolean(bedsideChoice);
      const probe = cloneCalendar(calendar);
      let ready = Math.max(state.facilityTick, ...careIds.map((id) => plan.phases.find((phase) => phase.id === id)!.forecast.endsAtTick));
      let location = patientLocation;
      for (const [index, input] of physicalPhases(route, component, actualRule as DiagnosticTimingRule).entries()) {
        const phase = scheduleNewPhase(state, context, probe, { id: `probe.${index}`, componentId: null, kind: "acquisition", mode: "local", patientPresent: true,
          durationMinutes: input.durationMinutes, dependsOn: [], requirement: requirementForOperation(input) }, ready, location);
        if (!phase) return false;
        ready = phase.forecast.endsAtTick;
        location = phase.resource?.patientAnchor ?? location;
      }
      return true;
    };
    const local = routes.find((route) => routeIsLocal(route) &&
      [route.requiredCapabilityId, ...route.requiredCapabilityIds].every((id) => id === null || capabilities.has(id)) &&
      canAcquire(route));
    const external = routes.find((route) => !routeIsLocal(route) &&
      [route.requiredCapabilityId, ...route.requiredCapabilityIds].every((id) => id === null || capabilities.has(id)));
    let route = local ?? external ?? null;
    if (actualRule.family === "collected_lab") {
      const collection = DIAGNOSTIC_TIMING_RESOURCES.collection;
      const requirement: DiagnosticResourceRequirement = { roomDefinitionId: collection.roomDefinitionId, staffRoleDefinitionIds: [collection.staffRoleDefinitionId], providerRoleDefinitionIds: [], founderEligible: false, stationKind: null };
      if (!resourceCandidates(state, context, requirement).length) route = external ?? null;
    }
    // The owner authorized a supplied answer-choice profile as the external
    // fallback for an explicit local-only service. Inferred representatives
    // remain preview-only and never authorize execution.
    const profileFallback = !route && Boolean(service && profile && !service.routes.some((entry) => !routeIsLocal(entry)));
    if (!route && service && actualRule.family !== "bladder_scan" && !profileFallback) return { kind: "unavailable", reason: profile ? "no_valid_route" : "missing_acquisition_contract", estimateMinutes: profile?.durationTicks ?? null };
    const inclusive = route?.durationTicks ?? profile?.durationTicks ?? DIAGNOSTIC_TIMING_TABLE.bladderScan.offsiteTotalMinutes;
    const componentId = component.componentId ?? (components.length > 1 ? `component.${componentIndex + 1}` : null);
    const prefix = `diagnostic.${componentIndex + 1}`;
    let lastPhysicalId: string | null = null;
    let lastResultId: string | null = null;
    let sourceKind: DiagnosticOrderPlan["sources"][number]["kind"] = route?.timingPhases.length ? "explicit_route_phases" : route ? "retained_inclusive_total" : "retained_profile";
    let physical: (ServiceOperationPhase & { roomStationId?: string })[] = [];
    let selectedBed: DiagnosticResourceChoice | null = null;
    const append = (kind: DraftPhase["kind"], mode: DraftPhase["mode"], durationMinutes: number, patientPresent: boolean,
      requirement: DiagnosticResourceRequirement | null, dependsOn: string[], suffix: string, preferred?: DiagnosticResourceChoice | null): DiagnosticOrderPhase | null => {
      const ready = Math.max(state.facilityTick, ...dependsOn.map((id) => plan.phases.find((phase) => phase.id === id)!.forecast.endsAtTick));
      const readingWork = kind === "interpretation" && mode === "local" && requirement?.roomDefinitionId === "room.reading"
        ? createReadingUpgradeWork(state, getEmployeeTrainingWorkPercent(trainingCategories,
          { kind, roomDefinitionId: requirement.roomDefinitionId, staffRoleDefinitionIds: requirement.staffRoleDefinitionIds }, null), "provisional.reading") : undefined;
      const effectiveMinutes = (resource: DiagnosticResourceChoice | null) => {
        const provider = resource?.provider;
        const providerRole = provider?.kind === "employee" ? state.employees.find((employee) => employee.id === provider.employeeId)?.staffRoleDefinitionId ?? null : null;
        const percent = getEmployeeTrainingWorkPercent(trainingCategories,
          { kind, roomDefinitionId: requirement?.roomDefinitionId ?? null, staffRoleDefinitionIds: requirement?.staffRoleDefinitionIds ?? [] }, providerRole);
        return readingWork ? quoteReadingUpgradeWork(readingWork, resource!.roomInstanceId)
          : getEmployeeTrainingWorkMinutes(durationMinutes, percent);
      };
      const phase = scheduleNewPhase(state, context, calendar, { id: `${prefix}.${suffix}`, componentId, kind, mode, durationMinutes, patientPresent, requirement, dependsOn,
        ...(readingWork ? { readingUpgradeWork: readingWork } : {}) },
        ready, patientLocation, requirement?.stationKind === "periop_bed" ? selectedBed : preferred,
        mode === "local" && requirement ? effectiveMinutes : undefined, readingWork ? plan.orderId : undefined);
      if (phase) {
        if (phase.readingUpgradeWork) {
          phase.readingUpgradeWork.quotedRoomInstanceId = phase.resource!.roomInstanceId;
          // Forecasts quote a room/time, not a reader reservation. Independent
          // studies must select available readers when their real work starts.
          phase.resource = null;
        }
        plan.phases.push(phase);
        if (phase.patientPresent && phase.resource) patientLocation = phase.resource.patientAnchor;
        if (kind === "preparation" && phase.resource?.stationId) selectedBed = phase.resource;
      }
      return phase;
    };
    const addProcessing = (kind: "interpretation" | "laboratory_processing" | "pathology", dependsOn: string[]) => {
      const requirement = processingRequirement(kind);
      const localMinutes = kind === "interpretation" ? DIAGNOSTIC_TIMING_TABLE.imaging.onsiteInterpretationMinutes : kind === "pathology" ? DIAGNOSTIC_TIMING_TABLE.pathology.onsiteProcessingMinutes : DIAGNOSTIC_TIMING_TABLE.collectedLab.onsiteProcessingMinutes;
      const externalMinutes = kind === "interpretation" ? DIAGNOSTIC_TIMING_TABLE.imaging.offsiteInterpretationMinutes : kind === "pathology" ? DIAGNOSTIC_TIMING_TABLE.pathology.offsiteProcessingMinutes : DIAGNOSTIC_TIMING_TABLE.collectedLab.offsiteProcessingMinutes;
      const localPhase = append(kind, "local", localMinutes, false, requirement, dependsOn, kind);
      const phase = localPhase ?? append(kind, "external", externalMinutes, false, null, dependsOn, kind)!;
      lastResultId = phase.id;
    };
    let physicalDependency = careIds.length ? [careIds.at(-1)!] : [];
    const outsideWalking = (!route || !routeIsLocal(route)) ? externalWalk(state, context, patientLocation, request.patientReturnLocation ?? patientLocation) : null;
    const appendWalking = (id: string, kind: "patient_departure" | "patient_return", patientPath: GridPoint[], dependsOn: string[]) => {
      const ready = Math.max(state.facilityTick, ...dependsOn.map((dependency) => plan.phases.find((phase) => phase.id === dependency)!.forecast.endsAtTick));
      const phase = schedulePhase(state, context, calendar, { id, componentId, kind, mode: "local", patientPresent: true, durationMinutes: 0, dependsOn, requirement: null }, ready, patientLocation)!;
      phase.forecast.patientPath = copy(patientPath);
      phase.forecast.walkingMinutes = Math.ceil(Math.max(0, patientPath.length - 1) / phase.forecast.tilesPerTick);
      phase.forecast.startsAtTick = phase.forecast.endsAtTick = ready + phase.forecast.walkingMinutes;
      plan.phases.push(phase);
      patientLocation = patientPath.at(-1) ?? patientLocation;
      return phase;
    };
    if (outsideWalking) physicalDependency = [appendWalking(`${prefix}.patient_departure`, "patient_departure", outsideWalking.outbound, physicalDependency).id];
    if (actualRule.family === "collected_lab") {
      if (route && routeIsLocal(route)) {
        const collection = DIAGNOSTIC_TIMING_RESOURCES.collection;
        const phase = append("collection", "local", DIAGNOSTIC_TIMING_TABLE.collectedLab.onsiteCollectionMinutes, true,
          { roomDefinitionId: collection.roomDefinitionId, staffRoleDefinitionIds: [collection.staffRoleDefinitionId], providerRoleDefinitionIds: [], founderEligible: false, stationKind: null }, physicalDependency, "collection");
        if (!phase) return { kind: "unavailable", reason: "no_valid_route", estimateMinutes: inclusive };
        lastPhysicalId = phase.id;
        phase.operationPhaseId = "collection";
        addProcessing("laboratory_processing", [phase.id]);
      } else {
        lastPhysicalId = lastResultId = append("collection", "external", DIAGNOSTIC_TIMING_TABLE.collectedLab.offsiteTotalMinutes, true, null, physicalDependency, "external_lab")!.id;
      }
    } else if (actualRule.family === "bladder_scan") {
      const isLocal = route && routeIsLocal(route);
      if (route && isLocal) physical = physicalPhases(route, component, actualRule);
      const bedside = Boolean(isLocal && route?.patientRemainsOnsite && !route.resourceRequirements.length);
      if (bedside) physical = [{ id: "acquisition", roomDefinitionId: "room.examination", durationMinutes: DIAGNOSTIC_TIMING_TABLE.bladderScan.onsiteAcquisitionMinutes, staffRoleDefinitionIds: [] }];
      const phase = append("acquisition", isLocal ? "local" : "external", isLocal ? DIAGNOSTIC_TIMING_TABLE.bladderScan.onsiteAcquisitionMinutes : DIAGNOSTIC_TIMING_TABLE.bladderScan.offsiteTotalMinutes,
        true, isLocal ? requirementForOperation(physical[0]!) : null, physicalDependency, "scan", bedside ? bedsideChoice : null);
      if (!phase) return { kind: "unavailable", reason: "no_valid_route", estimateMinutes: inclusive };
      lastPhysicalId = lastResultId = phase.id;
      phase.operationPhaseId = physical[0]?.id ?? null;
    } else if (actualRule.family === "imaging" || actualRule.family === "biopsy" || actualRule.family === "endoscopy") {
      const pathology = actualRule.family === "biopsy" || (actualRule.family === "endoscopy" &&
        (component.resultKind === "pathology" || component.specimenCollected === true || (component.resultKind !== "visual" && component.specimenCollected !== false && actualRule.result === "pathology")));
      if (route && routeIsLocal(route)) {
        physical = physicalPhases(route, component, actualRule);
        sourceKind = component.operationPhases || actualRule.family === "endoscopy" || !route.timingPhases.length && getServiceIncomeForRoute(route.id)?.operation ? "approved_operation" : sourceKind;
        for (const [index, input] of physical.entries()) {
          const kind = actualRule.family === "imaging" ? "acquisition" : input.roomStationId === "periop_preparation" || input.id === "preparation" ? "preparation" :
            input.roomStationId === "periop_recovery" || input.id === "recovery" ? "recovery" : "procedure";
          const phase = append(kind, "local", input.durationMinutes, true, requirementForOperation(input), lastPhysicalId ? [lastPhysicalId] : physicalDependency, `physical.${index + 1}`);
          if (!phase) return { kind: "unavailable", reason: "no_valid_route", estimateMinutes: inclusive };
          lastPhysicalId = phase.id;
          phase.operationPhaseId = input.id;
          if (kind === "procedure") {
            if (actualRule.family === "endoscopy") visualIds.push(phase.id);
            if (pathology) addProcessing("pathology", [phase.id]);
            else lastResultId = phase.id;
            if (actualRule.family === "endoscopy" && component.resultKind === "visual") lastResultId = phase.id;
          }
        }
        if (actualRule.family === "imaging" && lastPhysicalId) addProcessing("interpretation", [lastPhysicalId]);
        const heldBed = selectedBed as DiagnosticResourceChoice | null;
        if (heldBed && lastPhysicalId) reserve(calendar, { ...heldBed, provider: null },
          plan.phases.find((phase) => phase.resource?.stationId === heldBed.stationId && phase.componentId === componentId)!.forecast.readyAtTick,
          plan.phases.find((phase) => phase.id === lastPhysicalId)!.forecast.endsAtTick);
      } else {
        if (!route && !profileFallback) plan.execution = "preview_only";
        const processing = actualRule.family === "imaging" ? DIAGNOSTIC_TIMING_TABLE.imaging.offsiteInterpretationMinutes : pathology ? DIAGNOSTIC_TIMING_TABLE.pathology.offsiteProcessingMinutes : 0;
        if (inclusive <= processing) return { kind: "unavailable", reason: "missing_acquisition_contract", estimateMinutes: inclusive };
        const phase = append(actualRule.family === "imaging" ? "acquisition" : "procedure", "external", inclusive - processing, true, null, physicalDependency, "external_acquisition")!;
        lastPhysicalId = phase.id;
        if (actualRule.family === "endoscopy") visualIds.push(phase.id);
        if (actualRule.family === "imaging") addProcessing("interpretation", [phase.id]);
        else if (pathology) addProcessing("pathology", [phase.id]);
        else lastResultId = phase.id;
        if (actualRule.family === "endoscopy" && component.resultKind === "visual") lastResultId = phase.id;
        sourceKind = "retained_inclusive_total";
      }
    } else if (route && routeIsLocal(route)) {
      physical = physicalPhases(route, component, actualRule as DiagnosticTimingRule);
      sourceKind = component.operationPhases || getNewPeriopServiceOperationPhases(getServiceIncomeForRoute(route.id)?.id ?? "") ? "approved_operation" : sourceKind;
      for (const [index, input] of physical.entries()) {
        const kind = input.roomStationId === "periop_preparation" ? "preparation" : input.roomStationId === "periop_recovery" || input.id === "recovery" ? "recovery" : "procedure";
        const phase = append(kind, "local", input.durationMinutes, true, requirementForOperation(input), lastPhysicalId ? [lastPhysicalId] : physicalDependency, `physical.${index + 1}`);
        if (!phase) return { kind: "unavailable", reason: "no_valid_route", estimateMinutes: inclusive };
        phase.operationPhaseId = input.id;
        lastPhysicalId = lastResultId = phase.id;
      }
      const externalPhases = route.timingPhases.filter((phase) => !phase.resourceBound);
      for (const [index, input] of externalPhases.entries()) {
        const phase = append("retained", "external", input.durationTicks, false, null, lastResultId ? [lastResultId] : physicalDependency, `retained.${index + 1}`)!;
        lastResultId = phase.id;
      }
      const heldBed = selectedBed as DiagnosticResourceChoice | null;
      if (heldBed && lastPhysicalId) reserve(calendar, { ...heldBed, provider: null },
        plan.phases.find((phase) => phase.resource?.stationId === heldBed.stationId && phase.componentId === componentId)!.forecast.readyAtTick,
        plan.phases.find((phase) => phase.id === lastPhysicalId)!.forecast.endsAtTick);
    } else {
      // No heuristic relabeling of specialist, molecular or combined protocols.
      const duration = profile?.durationTicks ?? inclusive;
      const phase = append("retained", "external", duration, true, null, physicalDependency, "retained")!;
      lastPhysicalId = lastResultId = phase.id;
      if (!route && !profileFallback) plan.execution = "preview_only";
    }
    if (!lastPhysicalId || !lastResultId) return { kind: "unavailable", reason: "missing_acquisition_contract", estimateMinutes: inclusive };
    if (outsideWalking) lastPhysicalId = appendWalking(`${prefix}.patient_return`, "patient_return", outsideWalking.returning, [lastPhysicalId]).id;
    careIds.push(lastPhysicalId);
    resultIds.push(lastResultId);
    if (profileFallback) sourceKind = "retained_profile";
    const acquisitionIncome = route ? getServiceIncomeForRoute(route.id) : null;
    plan.sources.push({ componentId, serviceId, timingProfileId: component.timingProfileId ?? null, routeId: route?.id ?? null,
      routeDisplayName: route?.displayName ?? profile?.displayName ?? "External diagnostic work", kind: sourceKind, inclusiveDurationMinutes: inclusive,
      ...(plan.phases.some((phase) => phase.componentId === componentId && phase.kind === "interpretation" && phase.mode === "local")
        ? { readIncomeFee: RADIOLOGIST_READ_INCOME.inHouseFee, readIncomeBilling: "additive" as const } : {}),
      roomUpgradeRecovery: plan.phases.some((phase) => phase.componentId === componentId && phase.kind === "recovery" &&
        phase.mode === "local" && phase.patientPresent && phase.requirement?.roomDefinitionId === "room.periop_recovery")
        ? createRoomUpgradeRecoveryQuote(state, physical) : undefined,
      ...(acquisitionIncome && plan.phases.some((phase) => phase.componentId === componentId && phase.mode === "local" && phase.patientPresent && phase.requirement)
        ? { incomeLineId: acquisitionIncome.id, quoteFee: acquisitionIncome.fee,
            roomUpgradeRevenue: createRoomUpgradeRevenueQuote(state, acquisitionIncome.fee,
              plan.phases.filter((phase) => phase.componentId === componentId && phase.mode === "local" && phase.patientPresent && phase.requirement)
                .map((phase) => phase.requirement!.roomDefinitionId)) } : {}),
      routePhases: route?.timingPhases.map((phase) => ({ id: phase.id, durationMinutes: phase.durationTicks, resourceBound: phase.resourceBound })) ?? [],
      operationPhases: physical.map((phase) => ({ id: phase.id, roomDefinitionId: phase.roomDefinitionId, durationMinutes: phase.durationMinutes,
        staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds], providerRoleDefinitionIds: [...(phase.providerRoleDefinitionIds ?? [])], founderEligible: phase.founderEligible === true, roomStationId: phase.roomStationId ?? null })) });
  }
  if (request.remainder) {
    const input = request.remainder;
    let dependsOn = input.startsAfter === "care_completion" ? [...careIds] : plan.phases.filter((phase) => phase.kind === "collection" || phase.kind === "procedure" || phase.kind === "acquisition").map((phase) => phase.id);
    const outside = input.mode === "external_patient_visit" ? externalWalk(state, context, patientLocation, request.patientReturnLocation ?? origin) : null;
    if (input.mode === "external_patient_visit") {
      if (!outside) return { kind: "unavailable", reason: "no_valid_route", estimateMinutes: input.durationMinutes };
      const departure = appendFrozenWalking(plan, "diagnostic.remainder.patient_departure", outside.outbound, [...new Set([...dependsOn, ...careIds])], "patient_departure", state.facilityTick, context.balanceRelease.facility.characterTravelTilesPerTick);
      dependsOn = [departure.id];
      patientLocation = outside.outbound.at(-1) ?? patientLocation;
    }
    const ready = Math.max(state.facilityTick, ...dependsOn.map((id) => plan.phases.find((phase) => phase.id === id)!.forecast.endsAtTick));
    const phase = schedulePhase(state, context, calendar, { id: "diagnostic.remainder", componentId: null, kind: "retained", mode: "external",
      patientPresent: input.mode === "external_patient_visit", durationMinutes: input.durationMinutes, dependsOn, requirement: null }, ready, patientLocation)!;
    plan.phases.push(phase);
    resultIds.push(phase.id);
    if (outside) {
      const returning = appendFrozenWalking(plan, "diagnostic.remainder.patient_return", outside.returning, [phase.id], "patient_return", state.facilityTick, context.balanceRelease.facility.characterTravelTilesPerTick);
      careIds.push(returning.id);
      patientLocation = outside.returning.at(-1) ?? patientLocation;
    }
    plan.sources.push({ componentId: null, serviceId: null, timingProfileId: null, routeId: null, routeDisplayName: input.label,
      kind: "retained_profile", inclusiveDurationMinutes: input.durationMinutes, routePhases: [], operationPhases: [] });
  }
  const returnLocation = request.patientReturnLocation ?? origin;
  const returnPath = path(state, context, patientLocation, returnLocation, containingRoomId(state, context, returnLocation));
  if (returnPath.length > 1 && plan.phases.some((phase) => phase.mode === "local" && phase.patientPresent && phase.requirement !== null)) {
    const ready = Math.max(state.facilityTick, ...careIds.map((id) => plan.phases.find((phase) => phase.id === id)!.forecast.endsAtTick));
    const walkingMinutes = Math.ceil((returnPath.length - 1) / context.balanceRelease.facility.characterTravelTilesPerTick);
    const phase = schedulePhase(state, context, calendar, { id: "diagnostic.patient_return", componentId: null, kind: "patient_return", mode: "local", patientPresent: true,
      durationMinutes: 0, dependsOn: [...careIds], requirement: null }, ready, patientLocation)!;
    phase.forecast.patientPath = returnPath;
    phase.forecast.walkingMinutes = walkingMinutes;
    phase.forecast.startsAtTick = phase.forecast.endsAtTick = ready + walkingMinutes;
    plan.phases.push(phase);
    careIds.push(phase.id);
  }
  applyReadingProjection(plan, calendar);
  plan.resultReady = milestone(plan.phases, resultIds, state.facilityTick);
  plan.careComplete = milestone(plan.phases, careIds, state.facilityTick);
  plan.visualResultReady = visualIds.length ? milestone(plan.phases, visualIds, state.facilityTick) : null;
  return { kind: "planned", plan };
}

/** Pure interruption update for the later executor; completed phases stay intact. */
export function requeueDiagnosticPhase(plan: DiagnosticOrderPlan, phaseId: string, atTick: number): DiagnosticOrderPlan {
  const updated = copy(plan);
  const phase = updated.phases.find((entry) => entry.id === phaseId);
  if (!phase || phase.status === "completed" || phase.status === "cancelled") return updated;
  if (phase.status === "active" && phase.startedAtTick !== null) phase.remainingMinutes = Math.max(0, phase.remainingMinutes - Math.max(0, atTick - phase.startedAtTick));
  phase.status = "queued";
  phase.startedAtTick = null;
  phase.resource = null;
  phase.serviceOperationId = null;
  return updated;
}

export function hasOutstandingDiagnosticWork(plan: DiagnosticOrderPlan): boolean {
  return plan.phases.some((phase) => phase.status !== "completed" && phase.status !== "cancelled") ||
    (plan.resultReady.reachedAtTick === null || plan.careComplete.reachedAtTick === null) && plan.phases.some((phase) => phase.status !== "cancelled");
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const textId = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const minute = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const nullableMinute = (value: unknown) => value === null || minute(value);
const nullableId = (value: unknown) => value === null || textId(value);
const stringList = (value: unknown): value is string[] => Array.isArray(value) && value.every(textId) && new Set(value).size === value.length;
const point = (value: unknown): value is GridPoint => record(value) && typeof value.x === "number" && Number.isSafeInteger(value.x) && typeof value.y === "number" && Number.isSafeInteger(value.y) && only(value, ["x", "y"]);
const points = (value: unknown) => Array.isArray(value) && value.every(point);
const only = (value: Record<string, unknown>, fields: string[]) => Object.keys(value).every((key) => fields.includes(key));
const oneOf = (value: unknown, choices: readonly string[]) => typeof value === "string" && choices.includes(value);

function validResource(value: unknown): value is DiagnosticResourceChoice {
  if (!record(value) || !only(value, ["roomInstanceId", "roomDefinitionId", "stationId", "employeeIds", "provider", "patientAnchor", "staffAnchor"]) ||
    !textId(value.roomInstanceId) || !textId(value.roomDefinitionId) || !nullableId(value.stationId) || !stringList(value.employeeIds) || !point(value.patientAnchor) || !point(value.staffAnchor)) return false;
  if (value.provider !== null && (!record(value.provider) ||
    !(value.provider.kind === "founder" && only(value.provider, ["kind"]) || value.provider.kind === "employee" && textId(value.provider.employeeId) && only(value.provider, ["kind", "employeeId"])))) return false;
  if (value.stationId !== null && value.roomDefinitionId === "room.reading" && !DIAGNOSTIC_READING_WORKSTATIONS.some((station) => station.id === value.stationId)) return false;
  return true;
}

function validRequirement(value: unknown): value is DiagnosticResourceRequirement {
  return record(value) && only(value, ["roomDefinitionId", "staffRoleDefinitionIds", "providerRoleDefinitionIds", "founderEligible", "stationKind"]) &&
    textId(value.roomDefinitionId) && stringList(value.staffRoleDefinitionIds) && stringList(value.providerRoleDefinitionIds) && typeof value.founderEligible === "boolean" &&
    (value.stationKind === null || oneOf(value.stationKind, ["reading", "periop_bed"]));
}

function validPhase(value: unknown, readingClocks = false): value is DiagnosticOrderPhase {
  if (!record(value)) return false;
  const reading = normalizeReadingUpgradeWork(value.readingUpgradeWork);
  const workMinute = reading ? isReadingWorkMinute : minute;
  const clock = readingClocks ? isReadingWorkMinute : minute;
  const workClock = (candidate: unknown) => candidate === null || workMinute(candidate);
  if (!only(value, ["id", "componentId", "kind", "mode", "patientPresent", "durationMinutes", "dependsOn", "requirement", "resource", "forecast", "status", "remainingMinutes", "startedAtTick", "completedAtTick", "serviceOperationId", "operationPhaseId", "readingUpgradeWork"]) ||
    !textId(value.id) || !nullableId(value.componentId) || !oneOf(value.kind, ["collection", "acquisition", "preparation", "procedure", "recovery", "interpretation", "laboratory_processing", "pathology", "retained", "patient_departure", "patient_return"]) ||
    !oneOf(value.mode, ["local", "external"]) || typeof value.patientPresent !== "boolean" || !workMinute(value.durationMinutes) || (value.durationMinutes === 0 && value.kind !== "patient_return" && value.kind !== "patient_departure") ||
    !stringList(value.dependsOn) || !(value.requirement === null || validRequirement(value.requirement)) || !(value.resource === null || validResource(value.resource)) ||
    !oneOf(value.status, ["pending", "queued", "active", "completed", "cancelled"]) || !workMinute(value.remainingMinutes) || value.remainingMinutes > value.durationMinutes ||
    !workClock(value.startedAtTick) || !workClock(value.completedAtTick) || !nullableId(value.serviceOperationId) || !nullableId(value.operationPhaseId)) return false;
  if ((value.kind === "interpretation" || value.kind === "laboratory_processing" || value.kind === "pathology") && value.patientPresent ||
    value.mode === "external" && (value.requirement !== null || value.resource !== null) ||
    value.resource !== null && (value.requirement === null || value.resource.roomDefinitionId !== value.requirement.roomDefinitionId)) return false;
  if (value.status === "active" && value.startedAtTick === null || value.status === "completed" && (value.completedAtTick === null || value.remainingMinutes !== 0) ||
    value.completedAtTick !== null && value.status !== "completed" || value.startedAtTick !== null && value.completedAtTick !== null && value.completedAtTick < value.startedAtTick) return false;
  const forecast = value.forecast;
  return record(forecast) && only(forecast, ["readyAtTick", "startsAtTick", "endsAtTick", "queueMinutes", "walkingMinutes", "patientPath", "employeePaths", "founderPath", "tilesPerTick"]) &&
    clock(forecast.readyAtTick) && clock(forecast.startsAtTick) && clock(forecast.endsAtTick) && clock(forecast.queueMinutes) && minute(forecast.walkingMinutes) &&
    readingMinutesEqual(forecast.startsAtTick, forecast.readyAtTick + forecast.queueMinutes + forecast.walkingMinutes) && forecast.endsAtTick >= forecast.startsAtTick &&
    forecast.endsAtTick - forecast.startsAtTick <= value.durationMinutes + (reading ? 1e-9 : 0) && points(forecast.patientPath) && points(forecast.founderPath) && minute(forecast.tilesPerTick) && forecast.tilesPerTick > 0 &&
    Array.isArray(forecast.employeePaths) && forecast.employeePaths.every((entry) => record(entry) && only(entry, ["employeeId", "path"]) && textId(entry.employeeId) && points(entry.path));
}

function validSource(value: unknown): boolean {
  return record(value) && only(value, ["componentId", "serviceId", "timingProfileId", "routeId", "routeDisplayName", "incomeLineId", "quoteFee", "readIncomeFee", "readIncomeBilling", "roomUpgradeRevenue", "roomUpgradeRecovery", "kind", "inclusiveDurationMinutes", "routePhases", "operationPhases"]) &&
    nullableId(value.componentId) && nullableId(value.serviceId) && nullableId(value.timingProfileId) && nullableId(value.routeId) && textId(value.routeDisplayName) &&
    ((value.incomeLineId === undefined && value.quoteFee === undefined) || textId(value.incomeLineId) && Boolean(getServiceIncomeLine(value.incomeLineId)) && getServiceIncomeLine(value.incomeLineId)?.kind !== "retail" &&
      typeof value.quoteFee === "number" && Number.isFinite(value.quoteFee) && value.quoteFee >= 0) &&
    (value.readIncomeFee === undefined || typeof value.readIncomeFee === "number" && Number.isFinite(value.readIncomeFee) && value.readIncomeFee >= 0 &&
      (value.readIncomeBilling === "additive" || value.quoteFee === undefined || typeof value.quoteFee === "number" && value.readIncomeFee <= value.quoteFee)) &&
    (value.readIncomeBilling === undefined || value.readIncomeBilling === "additive" && value.readIncomeFee !== undefined) &&
    isRoomUpgradeRevenueQuoteValid(value.roomUpgradeRevenue, value.quoteFee,
      typeof value.incomeLineId === "string" ? getServiceIncomeLine(value.incomeLineId)?.operation?.phases.map((phase) => phase.roomDefinitionId) : []) &&
    oneOf(value.kind, ["explicit_route_phases", "approved_operation", "retained_inclusive_total", "retained_profile"]) && minute(value.inclusiveDurationMinutes) && value.inclusiveDurationMinutes > 0 &&
    Array.isArray(value.routePhases) && value.routePhases.every((phase) => record(phase) && only(phase, ["id", "durationMinutes", "resourceBound"]) && textId(phase.id) && minute(phase.durationMinutes) && phase.durationMinutes > 0 && typeof phase.resourceBound === "boolean") &&
    Array.isArray(value.operationPhases) && value.operationPhases.every((phase) => record(phase) && only(phase, ["id", "roomDefinitionId", "durationMinutes", "staffRoleDefinitionIds", "providerRoleDefinitionIds", "founderEligible", "roomStationId"]) &&
      textId(phase.id) && nullableId(phase.roomDefinitionId) && minute(phase.durationMinutes) && phase.durationMinutes > 0 && stringList(phase.staffRoleDefinitionIds) &&
      stringList(phase.providerRoleDefinitionIds) && typeof phase.founderEligible === "boolean" && nullableId(phase.roomStationId)) &&
    isRoomUpgradeRecoveryQuoteValid(value.roomUpgradeRecovery, value.operationPhases as DiagnosticOrderPlan["sources"][number]["operationPhases"]) &&
    (value.roomUpgradeRecovery === undefined || record(value.roomUpgradeRecovery) && value.roomUpgradeRecovery.boundRoom === null);
}

/** Strict opt-in parsing. Frozen durations never validate against current balance. */
export function normalizeDiagnosticOrderPlan(value: unknown): DiagnosticOrderPlan | null {
  if (!record(value) || !only(value, ["version", "timingVersion", "orderId", "encounterId", "createdAtTick", "execution", "sources", "phases", "resultReady", "visualResultReady", "careComplete", "periopNurseAttentionQuote"]) ||
    value.version !== "diagnostic-order.v1" || value.timingVersion !== "diagnostic-timing.v1" || !textId(value.orderId) || !textId(value.encounterId) || !minute(value.createdAtTick) ||
    !oneOf(value.execution, ["supported", "preview_only"]) || !Array.isArray(value.sources) || value.sources.length === 0 || !value.sources.every(validSource) ||
    !Array.isArray(value.phases) || value.phases.length === 0 || !value.phases.every((phase) => validPhase(phase, (value.phases as unknown[]).some((entry) => record(entry) && entry.readingUpgradeWork !== undefined)))) return null;
  const phases = value.phases as DiagnosticOrderPhase[];
  const attentionQuote = value.periopNurseAttentionQuote;
  if (attentionQuote !== undefined && (!record(attentionQuote) || !only(attentionQuote, ["version", "trainingPercent"]) ||
    attentionQuote.version !== "periop-nurse-attention.v1" || typeof attentionQuote.trainingPercent !== "number" ||
    !Number.isFinite(attentionQuote.trainingPercent) || attentionQuote.trainingPercent < 0 || attentionQuote.trainingPercent > 40)) return null;
  for (const source of value.sources as DiagnosticOrderPlan["sources"]) {
    if (source.readIncomeFee !== undefined && phases.filter((phase) => phase.componentId === source.componentId && phase.kind === "interpretation" && phase.mode === "local").length !== 1) return null;
    if (source.roomUpgradeRecovery && !phases.some((phase) => phase.componentId === source.componentId &&
      phase.kind === "recovery" && phase.mode === "local" && phase.patientPresent && phase.requirement?.roomDefinitionId === "room.periop_recovery")) return null;
    if (!isRoomUpgradeRevenueQuoteValid(source.roomUpgradeRevenue, source.quoteFee,
      phases.filter((phase) => phase.componentId === source.componentId && phase.mode === "local" && phase.patientPresent && phase.requirement)
        .map((phase) => phase.requirement!.roomDefinitionId))) return null;
  }
  const createdAtTick = value.createdAtTick;
  const previous = new Set<string>();
  for (const phase of phases) {
    if (previous.has(phase.id) || phase.dependsOn.some((id) => !previous.has(id)) || phase.forecast.readyAtTick < value.createdAtTick) return null;
    // Forecasts are snapshots. Actual completion/interruptions may outlive them;
    // the structural dependency graph remains authoritative during resumption.
    previous.add(phase.id);
  }
  if (!isReadingPlanWorkValid(value as unknown as DiagnosticOrderPlan)) return null;
  const clock = phases.some((phase) => phase.readingUpgradeWork) ? isReadingWorkMinute : minute;
  const validMilestone = (candidate: unknown): boolean => record(candidate) && only(candidate, ["afterPhaseIds", "forecastAtTick", "reachedAtTick"]) &&
    stringList(candidate.afterPhaseIds) && candidate.afterPhaseIds.length > 0 && candidate.afterPhaseIds.every((id) => previous.has(id)) &&
    clock(candidate.forecastAtTick) && (candidate.forecastAtTick === Math.max(...candidate.afterPhaseIds.map((id) => phases.find((phase) => phase.id === id)!.forecast.endsAtTick)) ||
      candidate.reachedAtTick !== null && candidate.forecastAtTick === candidate.reachedAtTick) &&
    (candidate.reachedAtTick === null || clock(candidate.reachedAtTick)) && (candidate.reachedAtTick === null || candidate.reachedAtTick >= createdAtTick &&
      candidate.afterPhaseIds.every((id) => { const phase = phases.find((entry) => entry.id === id)!; return phase.status === "completed" && phase.completedAtTick! <= (candidate.reachedAtTick as number); }));
  if (!validMilestone(value.resultReady) || !validMilestone(value.careComplete) || !(value.visualResultReady === null || validMilestone(value.visualResultReady))) return null;
  return copy(value) as unknown as DiagnosticOrderPlan;
}

export function normalizeDiagnosticPhaseWork(value: unknown): DiagnosticPhaseWork | null {
  if (!record(value)) return null;
  const reading = normalizeReadingUpgradeWork(value.readingUpgradeWork);
  const workMinute = reading ? isReadingWorkMinute : minute;
  if (!only(value, ["version", "orderId", "encounterId", "phaseId", "kind", "billing", "durationMinutes", "remainingMinutes", "resource", "readingUpgradeWork", "readIncomeFee"]) ||
    value.version !== "diagnostic-phase-work.v1" || !textId(value.orderId) || !textId(value.encounterId) || !textId(value.phaseId) ||
    !oneOf(value.kind, ["interpretation", "laboratory_processing", "pathology"]) || value.billing !== "none" || !workMinute(value.durationMinutes) || value.durationMinutes === 0 ||
    !workMinute(value.remainingMinutes) || value.remainingMinutes > value.durationMinutes || !(value.resource === null || validResource(value.resource))) return null;
  if (value.readIncomeFee !== undefined && (value.kind !== "interpretation" || typeof value.readIncomeFee !== "number" || !Number.isFinite(value.readIncomeFee) || value.readIncomeFee < 0)) return null;
  if (reading && (value.kind !== "interpretation" || reading.readyAtTick === null ||
    value.durationMinutes !== quoteReadingUpgradeWork(reading, reading.quotedRoomInstanceId) ||
    reading.durationMinutes === null && value.remainingMinutes !== value.durationMinutes)) return null;
  if (value.resource !== null && (value.resource.provider !== null || value.resource.employeeIds.length !== 1 ||
    (value.kind === "interpretation" ? value.resource.roomDefinitionId !== "room.reading" || value.resource.stationId === null : value.resource.roomDefinitionId !== "room.laboratory" || value.resource.stationId !== null))) return null;
  return copy(value) as unknown as DiagnosticPhaseWork;
}

export function normalizeDiagnosticPhysicalWork(value: unknown): DiagnosticPhysicalWork | null {
  if (!record(value) || !only(value, ["version", "orderId", "encounterId", "componentId", "billing", "phaseBindings", "phaseWitnesses", "remainingPhaseMinutes", "readIncomeFee"]) ||
    value.version !== "diagnostic-physical-work.v1" || !textId(value.orderId) || !textId(value.encounterId) || !nullableId(value.componentId) ||
    !oneOf(value.billing, ["existing_service", "none"]) || !nullableMinute(value.remainingPhaseMinutes) ||
    !Array.isArray(value.phaseBindings) || !value.phaseBindings.length || !value.phaseBindings.every((binding) => record(binding) &&
      only(binding, ["diagnosticPhaseId", "operationPhaseId", "resource"]) && textId(binding.diagnosticPhaseId) && textId(binding.operationPhaseId) && (binding.resource === null || validResource(binding.resource))) ||
    !Array.isArray(value.phaseWitnesses) || value.phaseWitnesses.length !== value.phaseBindings.length) return null;
  if (value.readIncomeFee !== undefined && (value.billing !== "existing_service" || typeof value.readIncomeFee !== "number" || !Number.isFinite(value.readIncomeFee) || value.readIncomeFee < 0)) return null;
  const ids = value.phaseBindings.map((binding) => binding.operationPhaseId);
  if (new Set(ids).size !== ids.length || new Set(value.phaseBindings.map((binding) => binding.diagnosticPhaseId)).size !== ids.length ||
    !value.phaseWitnesses.every((witness, index) => record(witness) && only(witness, ["operationPhaseId", "startedAtFacilityTick", "completedAtFacilityTick"]) &&
      witness.operationPhaseId === ids[index] && nullableMinute(witness.startedAtFacilityTick) && nullableMinute(witness.completedAtFacilityTick) &&
      (witness.completedAtFacilityTick === null || witness.startedAtFacilityTick !== null && (witness.completedAtFacilityTick as number) >= (witness.startedAtFacilityTick as number)))) return null;
  return copy(value) as unknown as DiagnosticPhysicalWork;
}
