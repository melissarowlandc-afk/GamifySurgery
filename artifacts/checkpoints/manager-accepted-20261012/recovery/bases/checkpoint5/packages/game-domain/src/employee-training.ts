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
import { getRoomDefinition, isRoomAccessibleForFacilityWork, isRoomOperationalForFacilityWork } from "./selectors";
import { getOccupiedTiles, getRoomNavigationAnchor, rotateRoomLocalPoint } from "./spatial";
import { bindRoomUpgradeSupportWork, createRoomUpgradeSupportWork, isRoomUpgradeSupportRemaining, normalizeRoomUpgradeSupportWork } from "./room-upgrade-support";
import type { DiagnosticResourceChoice, DomainContext, EmployeeState, EmployeeTrainingState, GameState, GridPoint, RoomUpgradeLevel } from "./types";

export { getEmployeeTrainingCost, getEmployeeTrainingPercent, getEmployeeTrainingRole,
  EMPLOYEE_TRAINING_SESSION_MINUTES, EMPLOYEE_TRAINING_CAPACITY } from "@gamify-surgery/balance-config";
export type { EmployeeTrainingBenefit, EmployeeTrainingPlaceId } from "@gamify-surgery/balance-config";

// These claims survive intervening reservations in one reducer tick only. They
// are neither saved training progress nor a second training-controller pass.
const departureClaims = new WeakMap<GameState, { tick: number; departures: EmployeeTrainingDeparture[] }>();
const departingEmployees = new WeakMap<EmployeeState, { state: GameState; tick: number }>();

export function isEmployeeAwayForTraining(employee: EmployeeState): boolean {
  const departure = departingEmployees.get(employee);
  return Boolean(employee.training && employee.training.stage !== "queued" || departure && departure.state.facilityTick === departure.tick);
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
  // Prefer public circulation. Training is an assigned staff trip, so a suite
  // connected through another care room must still be able to use its real
  // doors. This fallback retains the same walls and fixture masks; displaced
  // routing can re-enter via the front door only from outside room footprints.
  return normal.length ? normal : findRouteFromDisplacedLocationToPoint(
    state, context, employee.location, target, new Set(state.rooms.map((room) => room.id)),
  );
}

function trainingAccessBlockedReason(state: GameState, employee: EmployeeState, context: DomainContext): string | null {
  const rooms = state.rooms.filter((room) => room.roomDefinitionId === "room.training");
  if (!rooms.length) return "Build a Training Room before requesting training.";
  const places = getEmployeeTrainingPlaces(state, context).filter((place) =>
    isRoomOperationalForFacilityWork(state, place.roomInstanceId, context));
  if (!places.length) {
    if (!rooms.some((room) => isRoomAccessibleForFacilityWork(state, room.id, context))) {
      return "No Training Room has usable access to the clinic. Add a door connection to the Front Desk through rooms or hallways.";
    }
    return "Every accessible Training Room is out of service. Repair a Training Room before requesting training.";
  }
  const reachable = places.filter((place) => pathTo(state, employee, place.location, context).length > 0);
  if (!reachable.length) {
    const currentRoom = state.rooms.find((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      return definition && getOccupiedTiles(room, definition).some((point) => samePoint(point, employee.location));
    });
    const roomName = currentRoom ? getRoomDefinition(currentRoom.roomDefinitionId, context)?.displayName : null;
    return `${employee.displayName} cannot reach a Training Room from ${roomName ? `the ${roomName}` : "their current location"}. Restore a usable door and hallway route.`;
  }
  const home = homeTarget(state, employee, context);
  if (!home) return `${employee.displayName} needs an assigned home room before training.`;
  if (!reachable.some((place) => pathTo(state, { ...employee, location: place.location }, home, context).length > 0)) {
    const room = state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId);
    const roomName = room ? getRoomDefinition(room.roomDefinitionId, context)?.displayName : null;
    return `${employee.displayName} cannot return from training to ${roomName ? `their assigned ${roomName}` : "their home room"}. Restore its door connection.`;
  }
  return null;
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
    : trainingAccessBlockedReason(state, employee, context);
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
    roomUpgradeWork: createRoomUpgradeSupportWork(state, "training_duration_reduction_percent", EMPLOYEE_TRAINING_SESSION_MINUTES),
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

function hasCurrentDuty(state: GameState, employee: EmployeeState, atTick = state.facilityTick, released = new Set<string>()): boolean {
  if (employee.facilityTask && !released.has(employee.facilityTask.targetId ?? "") || employee.pathIndex < Math.max(0, employee.path.length - 1)) return true;
  if (state.serviceOperations.some((operation) => operation.status !== "completed" && operation.status !== "cancelled" &&
      !released.has(operation.id) &&
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
  return atTick < (employee.training?.earliestDepartureAtFacilityTick ?? 0);
}

export interface EmployeeTrainingDeparture {
  employeeId: string;
  place: EmployeeTrainingPlace;
  /** First whole minute ordinary services can reserve the returned employee. */
  availableAtTick: number;
  seatedAtTick: number;
  completedAtTick: number;
  homeLocation: GridPoint;
}

/** Shared FIFO selection, with a nonmutating view of genuine seated progress. */
export function getQueuedEmployeeTrainingDepartures(
  state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
  atTick = state.facilityTick, releasedOperationIds = new Set<string>(), projectProgress = false,
): EmployeeTrainingDeparture[] {
  const releasedSeats = new Set(state.employees.filter((employee) => {
    const session = employee.training;
    if (!projectProgress || session?.stage !== "training") return false;
    const place = getEmployeeTrainingPlaces(state, context).find((candidate) => candidate.roomInstanceId === session.roomInstanceId && candidate.placeId === session.placeId);
    return place && isRoomOperationalForFacilityWork(state, place.roomInstanceId, context) && samePoint(employee.location, place.location) &&
      session.remainingMinutes <= Math.max(0, atTick - session.lastProgressAtFacilityTick);
  }).map((employee) => employee.id));
  const places = getEmployeeTrainingPlaces(state, context).map((place) => ({ ...place, employeeId: place.employeeId && releasedSeats.has(place.employeeId) ? null : place.employeeId }));
  let reserved = state.employees.filter((employee) => employee.training?.roomInstanceId && !releasedSeats.has(employee.id) &&
    (employee.training.stage === "walking_to_training" || employee.training.stage === "training")).length;
  const selected: EmployeeTrainingDeparture[] = [];
  for (const employee of state.employees.filter((entry) => entry.training && (entry.training.stage === "queued" ||
    entry.training.stage === "walking_to_training" && entry.training.roomInstanceId === null))
    .sort((a, b) => a.training!.requestSequence - b.training!.requestSequence || a.id.localeCompare(b.id))) {
    if (reserved >= EMPLOYEE_TRAINING_CAPACITY) break;
    if (employee.training!.stage === "queued" && hasCurrentDuty(state, employee, atTick, releasedOperationIds)) continue;
    const homeLocation = homeTarget(state, employee, context);
    if (!homeLocation) continue;
    const place = places.find((candidate) => candidate.employeeId === null && isRoomOperationalForFacilityWork(state, candidate.roomInstanceId, context) &&
      pathTo(state, employee, candidate.location, context).length > 0 &&
      pathTo(state, { ...employee, location: candidate.location }, homeLocation, context).length > 0);
    if (!place) continue;
    const walking = (route: GridPoint[]) => Math.max(1, Math.ceil(Math.max(0, route.length - 1) / context.balanceRelease.facility.characterTravelTilesPerTick));
    const session = employee.training!;
    const minutes = session.roomUpgradeWork?.durationMinutes === null
      ? bindRoomUpgradeSupportWork(JSON.parse(JSON.stringify(session.roomUpgradeWork)), place.roomInstanceId) : session.remainingMinutes;
    const seatedAtTick = atTick + walking(pathTo(state, employee, place.location, context));
    const completedAtTick = seatedAtTick + Math.ceil(minutes);
    selected.push({ employeeId: employee.id, place: { ...place }, homeLocation, seatedAtTick, completedAtTick,
      availableAtTick: completedAtTick + walking(pathTo(state, { ...employee, location: place.location }, homeLocation, context)) + 1 });
    place.employeeId = employee.id;
    reserved += 1;
  }
  return selected;
}

/** Called once after the complete due-Reading cohort has released its duties. */
export function earmarkQueuedEmployeeTrainingDepartures(state: GameState, context: DomainContext): EmployeeTrainingDeparture[] {
  const existing = departureClaims.get(state);
  if (existing?.tick === state.facilityTick) return existing.departures;
  const departures = getQueuedEmployeeTrainingDepartures(state, context, state.facilityTick, new Set(), true);
  departureClaims.set(state, { tick: state.facilityTick, departures });
  for (const departure of departures) {
    const employee = state.employees.find((entry) => entry.id === departure.employeeId)!;
    departingEmployees.set(employee, { state, tick: state.facilityTick });
  }
  return departures;
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

/** Private forecast clocks; never advances a real session or frees a nominal seat. */
export function getEmployeeTrainingProjection(state: GameState, employee: EmployeeState, context: DomainContext): EmployeeTrainingDeparture | null {
  const session = employee.training;
  if (!session || session.stage === "queued") return null;
  const homeLocation = homeTarget(state, employee, context);
  if (!homeLocation) return null;
  const walking = (route: GridPoint[]) => Math.max(1, Math.ceil(Math.max(0, route.length - 1) / context.balanceRelease.facility.characterTravelTilesPerTick));
  if (session.stage === "returning") {
    const route = pathTo(state, employee, homeLocation, context);
    if (!route.length) return null;
    return { employeeId: employee.id, place: { roomInstanceId: "", placeId: EMPLOYEE_TRAINING_PLACES[0]!.id, location: employee.location,
      floorContact: employee.location, facing: "north", employeeId: null }, seatedAtTick: state.facilityTick, completedAtTick: state.facilityTick,
      availableAtTick: state.facilityTick + walking(route) + 1, homeLocation };
  }
  const place = getEmployeeTrainingPlaces(state, context).find(candidate => candidate.roomInstanceId === session.roomInstanceId && candidate.placeId === session.placeId);
  if (!place || !isRoomOperationalForFacilityWork(state, place.roomInstanceId, context)) return null;
  const outbound = pathTo(state, employee, place.location, context), returning = pathTo(state, { ...employee, location: place.location }, homeLocation, context);
  if (!outbound.length || !returning.length) return null;
  const seated = session.stage === "training" && samePoint(employee.location, place.location);
  const seatedAtTick = seated ? session.lastProgressAtFacilityTick : state.facilityTick + walking(outbound);
  const completedAtTick = Math.max(state.facilityTick, seatedAtTick + Math.ceil(session.remainingMinutes));
  return { employeeId: employee.id, place: { ...place }, seatedAtTick, completedAtTick,
    availableAtTick: completedAtTick + walking(returning) + 1, homeLocation };
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

  const earmarks = departureClaims.get(state);
  const heldDepartures = earmarks?.tick === state.facilityTick ? earmarks.departures : [];
  for (const batch of [heldDepartures, null]) for (const departure of batch ?? getQueuedEmployeeTrainingDepartures(state, context)) {
    const employee = state.employees.find((entry) => entry.id === departure.employeeId);
    const place = departure.place;
    if (!employee?.training || (employee.training.stage !== "queued" && !(employee.training.stage === "walking_to_training" && employee.training.roomInstanceId === null))) continue;
    if (hasCurrentDuty(state, employee) || !isRoomOperationalForFacilityWork(state, place.roomInstanceId, context) ||
      getEmployeeTrainingPlaces(state, context).some((candidate) => candidate.roomInstanceId === place.roomInstanceId && candidate.placeId === place.placeId && candidate.employeeId !== null)) continue;
    const session = employee.training!;
    if (session.roomUpgradeWork?.durationMinutes === null) {
      session.remainingMinutes = bindRoomUpgradeSupportWork(session.roomUpgradeWork, place.roomInstanceId);
    }
    session.stage = "walking_to_training";
    session.roomInstanceId = place.roomInstanceId;
    session.placeId = place.placeId;
    session.lastProgressAtFacilityTick = state.facilityTick;
    setPath(state, employee, pathTo(state, employee, place.location, context));
  }
  departureClaims.delete(state);
  for (const employee of state.employees) departingEmployees.delete(employee);

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
  const roomUpgradeWork = normalizeRoomUpgradeSupportWork(raw.roomUpgradeWork, "training_duration_reduction_percent");
  const acceptedDuration = roomUpgradeWork?.durationMinutes ?? EMPLOYEE_TRAINING_SESSION_MINUTES;
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
      (roomUpgradeWork ? !isRoomUpgradeSupportRemaining(roomUpgradeWork, raw.remainingMinutes, true) : !integer("remainingMinutes")) ||
      (raw.remainingMinutes as number) > acceptedDuration ||
      (roomUpgradeWork && (roomUpgradeWork.baselineMinutes !== EMPLOYEE_TRAINING_SESSION_MINUTES ||
        (raw.stage === "queued" && roomUpgradeWork.boundRoomInstanceId !== null) ||
        (raw.stage !== "queued" && roomUpgradeWork.durationMinutes === null))) ||
      (raw.stage === "returning" ? raw.targetLevel !== employee.trainingLevel || raw.remainingMinutes !== 0 ||
        raw.startedAtFacilityTick === null || raw.completedAtFacilityTick === null || raw.roomInstanceId !== null
        : raw.targetLevel !== employee.trainingLevel + 1 || raw.remainingMinutes === 0 || raw.completedAtFacilityTick !== null) ||
      (raw.startedAtFacilityTick === null && raw.remainingMinutes !== acceptedDuration) ||
      (raw.stage === "training" && (raw.startedAtFacilityTick === null || raw.roomInstanceId === null)) ||
      (raw.stage === "queued" && (raw.startedAtFacilityTick !== null || raw.roomInstanceId !== null))) {
    throw new Error("The saved employee training request is invalid.");
  }
  return { version: 1, requestSequence: raw.requestSequence as number, requestedAtFacilityTick: raw.requestedAtFacilityTick as number,
    earliestDepartureAtFacilityTick: raw.earliestDepartureAtFacilityTick as number,
    paidAmount: raw.paidAmount as number, targetLevel: raw.targetLevel as EmployeeTrainingState["targetLevel"], stage: raw.stage as EmployeeTrainingState["stage"],
    roomInstanceId: raw.roomInstanceId as string | null, placeId: raw.placeId as EmployeeTrainingPlaceId | null,
    remainingMinutes: raw.remainingMinutes as number, startedAtFacilityTick: raw.startedAtFacilityTick as number | null,
    completedAtFacilityTick: raw.completedAtFacilityTick as number | null, lastProgressAtFacilityTick: raw.lastProgressAtFacilityTick as number,
    ...(roomUpgradeWork ? { roomUpgradeWork } : {}) };
}
