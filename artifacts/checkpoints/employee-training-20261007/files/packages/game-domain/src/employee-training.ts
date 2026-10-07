import {
  EMPLOYEE_TRAINING_CAPACITY,
  EMPLOYEE_TRAINING_PLACES,
  EMPLOYEE_TRAINING_SESSION_MINUTES,
  getEmployeeTrainingCost,
  getEmployeeTrainingLevelBenefit,
  getEmployeeTrainingRole,
  type EmployeeTrainingBenefit,
  type EmployeeTrainingPlaceId,
} from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { findCareAwareFacilityPath } from "./care-room-access";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getRadiologistReadingStation } from "./reading-stations";
import { getGlp1NursePractitionerStation } from "./staff";
import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomNavigationAnchor, rotateRoomLocalPoint } from "./spatial";
import type { DiagnosticResourceChoice, DomainContext, EmployeeState, EmployeeTrainingState, GameState, GridPoint, RoomUpgradeLevel } from "./types";

export { getEmployeeTrainingCost, getEmployeeTrainingPercent, getEmployeeTrainingRole,
  EMPLOYEE_TRAINING_SESSION_MINUTES, EMPLOYEE_TRAINING_CAPACITY } from "@gamify-surgery/balance-config";
export type { EmployeeTrainingBenefit, EmployeeTrainingPlaceId } from "@gamify-surgery/balance-config";

export function isEmployeeAwayForTraining(employee: EmployeeState): boolean {
  return Boolean(employee.training && employee.training.stage !== "queued");
}

/** Queued work may use a spare while its initially chosen employee trains. */
export function isDiagnosticResourceWaitingForTraining(state: GameState, resource: DiagnosticResourceChoice | null | undefined): boolean {
  if (!resource) return false;
  const employeeIds = [...resource.employeeIds, ...(resource.provider?.kind === "employee" ? [resource.provider.employeeId] : [])];
  return employeeIds.some((id) => state.employees.some((employee) => employee.id === id && isEmployeeAwayForTraining(employee)));
}

export function getEmployeeTrainingBenefit(staffRoleDefinitionId: string, level: RoomUpgradeLevel): EmployeeTrainingBenefit | null {
  return getEmployeeTrainingLevelBenefit(staffRoleDefinitionId, level);
}

export interface EmployeeTrainingPlace {
  roomInstanceId: string;
  placeId: EmployeeTrainingPlaceId;
  location: GridPoint;
  /** Exact stool floor/ground contact in continuous room-local tile units. */
  floorContact: GridPoint;
  facing: "north";
  employeeId: string | null;
}

export function getEmployeeTrainingPlaces(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): EmployeeTrainingPlace[] {
  return state.rooms.filter((room) => room.roomDefinitionId === "room.training")
    .sort((a, b) => a.id.localeCompare(b.id)).flatMap((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      if (!definition) return [];
      return EMPLOYEE_TRAINING_PLACES.map((place) => {
        const local = rotateRoomLocalPoint(place.approach, definition, room.orientation);
        return {
          roomInstanceId: room.id, placeId: place.id,
          location: { x: room.x + local.x, y: room.y + local.y },
          floorContact: { ...place.floorContact }, facing: place.facing,
          employeeId: state.employees.find((employee) => employee.training &&
            (employee.training.stage === "walking_to_training" || employee.training.stage === "training") &&
            employee.training.roomInstanceId === room.id && employee.training.placeId === place.id)?.id ?? null,
        };
      });
    });
}

function samePoint(a: GridPoint, b: GridPoint): boolean { return a.x === b.x && a.y === b.y; }

function allowedRooms(employee: EmployeeState): Set<string> {
  return new Set(employee.homeRoomInstanceId ? [employee.homeRoomInstanceId] : []);
}

function pathTo(state: GameState, employee: EmployeeState, target: GridPoint, context: DomainContext): GridPoint[] {
  const allowed = allowedRooms(employee);
  const normal = findCareAwareFacilityPath(state, context, employee.location, target, allowed);
  return normal.length ? normal : findRouteFromDisplacedLocationToPoint(state, context, employee.location, target, allowed);
}

function usablePlaces(state: GameState, employee: EmployeeState, context: DomainContext): EmployeeTrainingPlace[] {
  return getEmployeeTrainingPlaces(state, context).filter((place) =>
    isRoomOperationalForFacilityWork(state, place.roomInstanceId, context) && pathTo(state, employee, place.location, context).length > 0);
}

export interface EmployeeTrainingQuote {
  employeeId: string;
  currentLevel: RoomUpgradeLevel;
  targetLevel: 2 | 3 | 4 | 5 | null;
  cost: number | null;
  canTrain: boolean;
  blockedReason: string | null;
  status: "idle" | "queued" | "walking" | "training" | "returning" | "max_level";
  minutesRemaining: number | null;
  currentBenefit: EmployeeTrainingBenefit | null;
  nextBenefit: EmployeeTrainingBenefit | null;
}

export function getEmployeeTrainingQuote(state: GameState, employeeId: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): EmployeeTrainingQuote {
  const employee = state.employees.find((candidate) => candidate.id === employeeId);
  const currentLevel = employee?.trainingLevel ?? 1;
  const session = employee?.training;
  const targetLevel = session?.targetLevel ?? (currentLevel < 5 ? currentLevel + 1 as 2 | 3 | 4 | 5 : null);
  const cost = session?.paidAmount ?? (employee && targetLevel ? getEmployeeTrainingCost(employee.staffRoleDefinitionId, targetLevel) : null);
  const status = session ? session.stage === "walking_to_training" ? "walking" : session.stage : currentLevel === 5 ? "max_level" : "idle";
  const blockedReason = !employee ? "That employee does not exist."
    : !getEmployeeTrainingRole(employee.staffRoleDefinitionId) ? "Training is unavailable for this employee role."
    : session ? session.stage !== "queued" && session.stage !== "returning" &&
        (!session.roomInstanceId || !isRoomOperationalForFacilityWork(state, session.roomInstanceId, context))
      ? "Training Room unavailable; paid training is paused." : "This employee already has a paid training request."
    : currentLevel === 5 ? "Maximum training level reached."
    : cost !== null && state.cash < cost ? "There is not enough cash for this training."
    : usablePlaces(state, employee, context).length === 0 ? "An operational, reachable Training Room is required."
    : null;
  return {
    employeeId, currentLevel, targetLevel, cost, canTrain: blockedReason === null, blockedReason, status,
    minutesRemaining: session ? session.remainingMinutes : null,
    currentBenefit: employee ? getEmployeeTrainingBenefit(employee.staffRoleDefinitionId, currentLevel) : null,
    nextBenefit: employee && targetLevel ? getEmployeeTrainingBenefit(employee.staffRoleDefinitionId, targetLevel) : null,
  };
}

function changeCash(state: GameState, dollars: number): void {
  state.cashCents = Math.max(0, state.cashCents + Math.round(dollars * 100));
  state.cash = state.cashCents / 100;
}

/** Mutates a reducer-owned clone, charging once before joining the paid queue. */
export function requestEmployeeTraining(state: GameState, employeeId: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): { applied: boolean; message: string } {
  const quote = getEmployeeTrainingQuote(state, employeeId, context);
  if (!quote.canTrain || quote.targetLevel === null || quote.cost === null) return { applied: false, message: quote.blockedReason ?? "Training is unavailable." };
  const employee = state.employees.find((candidate) => candidate.id === employeeId)!;
  const sequence = Math.max(state.employeeTrainingSequence ?? 0, ...state.employees.map((candidate) => (candidate.training?.requestSequence ?? -1) + 1));
  employee.training = {
    version: 1, requestSequence: sequence, requestedAtFacilityTick: state.facilityTick,
    earliestDepartureAtFacilityTick: employee.staffRoleDefinitionId === "staff.glp1_np"
      ? state.environment.glp1AutomationSlots.find((slot) => slot.employeeId === employee.id)?.nextPayoutTick ?? state.facilityTick
      : state.facilityTick,
    paidAmount: quote.cost, targetLevel: quote.targetLevel, stage: "queued", roomInstanceId: null, placeId: null,
    remainingMinutes: EMPLOYEE_TRAINING_SESSION_MINUTES, startedAtFacilityTick: null, completedAtFacilityTick: null,
    lastProgressAtFacilityTick: state.facilityTick,
  };
  state.employeeTrainingSequence = sequence + 1;
  changeCash(state, -quote.cost);
  return { applied: true, message: "Training paid and queued; the employee keeps working until a place is available." };
}

/** Dismissal removes the request; payment is refunded only before seated work begins. */
export function cancelEmployeeTrainingForDismissal(state: GameState, employeeId: string): void {
  const employee = state.employees.find((candidate) => candidate.id === employeeId);
  if (!employee?.training) return;
  if (employee.training.startedAtFacilityTick === null) changeCash(state, employee.training.paidAmount);
  employee.training = null;
}

function hasCurrentDuty(state: GameState, employee: EmployeeState): boolean {
  if (employee.facilityTask || employee.pathIndex < Math.max(0, employee.path.length - 1)) return true;
  if (state.serviceOperations.some((operation) => operation.status !== "completed" && operation.status !== "cancelled" &&
      (operation.reservedEmployeeIds.includes(employee.id) || operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id))) return true;
  if (Object.values(state.encounters).some((encounter) => {
    const pending = encounter.pendingResult;
    return pending && pending.deliveredAtTick === null &&
      (pending.imagingTechnicianId === employee.id || pending.phlebotomistId === employee.id ||
        pending.providerReservation?.kind === "employee" && pending.providerReservation.employeeId === employee.id) &&
      (encounter.steps[pending.originatingNodeIndex]?.status === "feedback_pending" || !pending.timingPhases?.length ||
        pending.timingPhases.some((phase) => phase.resourceBound && state.facilityTick < phase.endsAtTick));
  })) return true;
  if (state.retailOperations.some((operation) => !["completed", "abandoned", "cancelled"].includes(operation.status) &&
      (operation.servingEmployeeId === employee.id || operation.actorKind === "employee" && operation.actorId === employee.id))) return true;
  if (Object.values(state.employeeDiscussions ?? {}).some((discussion) => discussion.employeeId === employee.id &&
      discussion.lifecycle !== "resolved" && discussion.lifecycle !== "cancelled")) return true;
  if (state.environment.founderActivity?.kind === "praise_employee" && state.environment.founderActivity.targetId === employee.id) return true;
  // An automated NP consultation has no facilityTask. Finish its current hour.
  return state.facilityTick < (employee.training?.earliestDepartureAtFacilityTick ?? 0);
}

function setPath(state: GameState, employee: EmployeeState, path: GridPoint[]): void {
  employee.path = path.length ? path : [{ ...employee.location }];
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = state.facilityTick;
}

function advanceTravel(state: GameState, employee: EmployeeState, target: GridPoint, context: DomainContext): boolean {
  if (samePoint(employee.location, target)) { setPath(state, employee, [{ ...target }]); return true; }
  const path = pathTo(state, employee, target, context);
  if (!path.length) { setPath(state, employee, []); return false; }
  const elapsed = Math.max(0, state.facilityTick - employee.lastMovedAtFacilityTick);
  const steps = Math.min(path.length - 1, elapsed * context.balanceRelease.facility.characterTravelTilesPerTick);
  employee.path = path;
  employee.pathIndex = steps;
  employee.location = { ...path[steps]! };
  employee.lastMovedAtFacilityTick = state.facilityTick;
  return samePoint(employee.location, target);
}

function homeTarget(state: GameState, employee: EmployeeState, context: DomainContext): GridPoint | null {
  const fixed = getRadiologistReadingStation(state, employee, context)?.location ?? getGlp1NursePractitionerStation(state, employee, context);
  if (fixed) return fixed;
  const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId);
  const definition = home ? getRoomDefinition(home.roomDefinitionId, context) : null;
  return home && definition ? getRoomNavigationAnchor(home, definition, "staff") : null;
}

export function getEmployeeTrainingHomeLocation(state: GameState, employee: EmployeeState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GridPoint | null {
  return homeTarget(state, employee, context);
}

export type EmployeeTrainingAvailability =
  | { kind: "available" }
  | { kind: "returning_at"; availableAtTick: number; remainingMinutes: number; homeLocation: GridPoint }
  | { kind: "blocked"; reason: "training_room_unavailable" | "training_path_unavailable" | "home_unavailable" };

/** Uses the same care-aware routes and exact NP/reading home stations as execution. */
export function getEmployeeTrainingAvailability(state: GameState, employee: EmployeeState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): EmployeeTrainingAvailability {
  const session = employee.training;
  if (!session || session.stage === "queued") return { kind: "available" };
  const homeLocation = homeTarget(state, employee, context);
  if (!homeLocation) return { kind: "blocked", reason: "home_unavailable" };
  const walkingMinutes = (route: GridPoint[]) => Math.ceil(Math.max(0, route.length - 1) / context.balanceRelease.facility.characterTravelTilesPerTick);
  if (session.stage === "returning") {
    const returning = pathTo(state, employee, homeLocation, context);
    if (!returning.length) return { kind: "blocked", reason: "home_unavailable" };
    const remainingMinutes = Math.max(1, walkingMinutes(returning));
    return { kind: "returning_at", availableAtTick: state.facilityTick + remainingMinutes, remainingMinutes, homeLocation };
  }
  const place = getEmployeeTrainingPlaces(state, context).find((entry) => entry.roomInstanceId === session.roomInstanceId && entry.placeId === session.placeId);
  if (!place || !isRoomOperationalForFacilityWork(state, place.roomInstanceId, context)) return { kind: "blocked", reason: "training_room_unavailable" };
  const outbound = pathTo(state, employee, place.location, context);
  const returning = pathTo(state, { ...employee, location: place.location }, homeLocation, context);
  if (!outbound.length || !returning.length) return { kind: "blocked", reason: "training_path_unavailable" };
  const outgoingMinutes = session.stage === "walking_to_training" || !samePoint(employee.location, place.location)
    ? Math.max(1, walkingMinutes(outbound)) : 0;
  const remainingMinutes = outgoingMinutes + session.remainingMinutes + Math.max(1, walkingMinutes(returning));
  return { kind: "returning_at", availableAtTick: state.facilityTick + remainingMinutes, remainingMinutes, homeLocation };
}

/** Resolve duplicate/damaged seat claims without erasing paid work or advancing a level. */
export function reconcileEmployeeTrainingReservations(state: GameState): void {
  const claims = new Set<string>();
  let reserved = 0;
  for (const employee of [...state.employees].sort((a, b) => (a.training?.requestSequence ?? 0) - (b.training?.requestSequence ?? 0) || a.id.localeCompare(b.id))) {
    const session = employee.training;
    if (!session || session.stage === "queued" || session.stage === "returning") continue;
    const room = state.rooms.find((candidate) => candidate.id === session.roomInstanceId && candidate.roomDefinitionId === "room.training");
    const claim = room && session.placeId ? `${room.id}:${session.placeId}` : null;
    if (!claim || claims.has(claim) || reserved >= EMPLOYEE_TRAINING_CAPACITY) {
      session.stage = "walking_to_training";
      session.roomInstanceId = null;
      session.placeId = null;
      setPath(state, employee, []);
    } else { claims.add(claim); reserved += 1; }
  }
}

/** Advances only on game ticks. Started work pauses safely through room/access loss. */
export function advanceEmployeeTraining(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): void {
  reconcileEmployeeTrainingReservations(state);
  for (const employee of state.employees) {
    const session = employee.training;
    if (!session || session.stage === "queued") continue;
    if (session.stage === "returning") {
      const target = homeTarget(state, employee, context);
      if (target && advanceTravel(state, employee, target, context)) {
        employee.training = null;
        employee.nextIdleActionAtFacilityTick = state.facilityTick + context.balanceRelease.environment.idleActionMinimumMinutes;
      } else if (!target) setPath(state, employee, []);
      continue;
    }
    const place = getEmployeeTrainingPlaces(state, context).find((candidate) => candidate.roomInstanceId === session.roomInstanceId && candidate.placeId === session.placeId);
    if (!place || !isRoomOperationalForFacilityWork(state, place.roomInstanceId, context)) {
      session.lastProgressAtFacilityTick = state.facilityTick;
      setPath(state, employee, []);
      continue;
    }
    if (session.stage === "walking_to_training") {
      if (advanceTravel(state, employee, place.location, context)) {
        session.stage = "training";
        session.startedAtFacilityTick ??= state.facilityTick;
      }
      session.lastProgressAtFacilityTick = state.facilityTick;
      continue;
    }
    if (!samePoint(employee.location, place.location)) {
      session.stage = "walking_to_training";
      session.lastProgressAtFacilityTick = state.facilityTick;
      setPath(state, employee, pathTo(state, employee, place.location, context));
      continue;
    }
    const elapsed = Math.max(0, state.facilityTick - session.lastProgressAtFacilityTick);
    session.lastProgressAtFacilityTick = state.facilityTick;
    session.remainingMinutes = Math.max(0, session.remainingMinutes - elapsed);
    if (session.remainingMinutes > 0) continue;
    employee.trainingLevel = session.targetLevel;
    session.completedAtFacilityTick = state.facilityTick;
    session.stage = "returning";
    session.roomInstanceId = null;
    session.placeId = null;
    const target = homeTarget(state, employee, context);
    setPath(state, employee, target ? pathTo(state, employee, target, context) : []);
  }

  let reserved = state.employees.filter((employee) => employee.training?.roomInstanceId &&
    (employee.training.stage === "walking_to_training" || employee.training.stage === "training")).length;
  const waiting = state.employees.filter((employee) => employee.training && (employee.training.stage === "queued" ||
    employee.training.stage === "walking_to_training" && employee.training.roomInstanceId === null))
    .sort((a, b) => a.training!.requestSequence - b.training!.requestSequence || a.id.localeCompare(b.id));
  for (const employee of waiting) {
    if (reserved >= EMPLOYEE_TRAINING_CAPACITY) break;
    if (employee.training!.stage === "queued" && hasCurrentDuty(state, employee)) continue;
    const place = usablePlaces(state, employee, context).find((candidate) => candidate.employeeId === null);
    if (!place) continue;
    const session = employee.training!;
    session.stage = "walking_to_training";
    session.roomInstanceId = place.roomInstanceId;
    session.placeId = place.placeId;
    session.lastProgressAtFacilityTick = state.facilityTick;
    setPath(state, employee, pathTo(state, employee, place.location, context));
    reserved += 1;
  }

  // A queued NP starts another consult after a missed training opportunity.
  // Keep its departure boundary current until a place is taken at a payout.
  for (const employee of state.employees) {
    const session = employee.training;
    if (employee.staffRoleDefinitionId !== "staff.glp1_np" || session?.stage !== "queued" ||
      session.earliestDepartureAtFacilityTick > state.facilityTick) continue;
    const slot = state.environment.glp1AutomationSlots.find((entry) => entry.employeeId === employee.id);
    if (slot && slot.nextPayoutTick > state.facilityTick) session.earliestDepartureAtFacilityTick = slot.nextPayoutTick;
  }
}

/** Strict additive save read prevents malformed paid work silently disappearing. */
export function normalizeEmployeeTraining(value: unknown, employee: EmployeeState, facilityTick: number): EmployeeTrainingState | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "object") throw new Error("The saved employee training request is invalid.");
  const raw = value as Record<string, unknown>;
  const integer = (key: string, minimum = 0): boolean => typeof raw[key] === "number" && Number.isSafeInteger(raw[key]) && (raw[key] as number) >= minimum;
  const tick = (key: string): boolean => integer(key) && (raw[key] as number) <= facilityTick;
  const nullableTick = (key: string): boolean => raw[key] === null || tick(key);
  const validStage = raw.stage === "queued" || raw.stage === "walking_to_training" || raw.stage === "training" || raw.stage === "returning";
  const validTarget = raw.targetLevel === 2 || raw.targetLevel === 3 || raw.targetLevel === 4 || raw.targetLevel === 5;
  const validRoom = raw.roomInstanceId === null || typeof raw.roomInstanceId === "string";
  const validPlace = raw.placeId === null || raw.placeId === "stool1" || raw.placeId === "stool2";
  if (raw.version !== 1 || !validStage || !validTarget || !validRoom || !validPlace ||
      (raw.roomInstanceId === null) !== (raw.placeId === null) || !integer("requestSequence") || !tick("requestedAtFacilityTick") || !integer("earliestDepartureAtFacilityTick") ||
      !tick("lastProgressAtFacilityTick") || !nullableTick("startedAtFacilityTick") || !nullableTick("completedAtFacilityTick") ||
      !integer("paidAmount", 1) || getEmployeeTrainingCost(employee.staffRoleDefinitionId, raw.targetLevel as number) === null ||
      !integer("remainingMinutes") || (raw.remainingMinutes as number) > EMPLOYEE_TRAINING_SESSION_MINUTES ||
      (raw.stage === "returning" ? raw.targetLevel !== employee.trainingLevel || raw.remainingMinutes !== 0 ||
        raw.startedAtFacilityTick === null || raw.completedAtFacilityTick === null || raw.roomInstanceId !== null
        : raw.targetLevel !== employee.trainingLevel + 1 || raw.remainingMinutes === 0 || raw.completedAtFacilityTick !== null) ||
      (raw.startedAtFacilityTick === null && raw.remainingMinutes !== EMPLOYEE_TRAINING_SESSION_MINUTES) ||
      (raw.stage === "training" && (raw.startedAtFacilityTick === null || raw.roomInstanceId === null)) ||
      (raw.stage === "queued" && (raw.startedAtFacilityTick !== null || raw.roomInstanceId !== null))) {
    throw new Error("The saved employee training request is invalid.");
  }
  return { version: 1, requestSequence: raw.requestSequence as number, requestedAtFacilityTick: raw.requestedAtFacilityTick as number,
    earliestDepartureAtFacilityTick: raw.earliestDepartureAtFacilityTick as number,
    paidAmount: raw.paidAmount as number, targetLevel: raw.targetLevel as EmployeeTrainingState["targetLevel"], stage: raw.stage as EmployeeTrainingState["stage"],
    roomInstanceId: raw.roomInstanceId as string | null, placeId: raw.placeId as EmployeeTrainingPlaceId | null,
    remainingMinutes: raw.remainingMinutes as number, startedAtFacilityTick: raw.startedAtFacilityTick as number | null,
    completedAtFacilityTick: raw.completedAtFacilityTick as number | null, lastProgressAtFacilityTick: raw.lastProgressAtFacilityTick as number };
}
