import { PERIOP_POST_OP_NURSE_ATTENTION_MINUTES, PERIOP_PRE_OP_NURSE_ATTENTION_MINUTES } from "@gamify-surgery/balance-config";
import { getDoorCells } from "./doors";
import { findCareAwareFacilityPath } from "./care-room-access";
import { getEmployeeRoleTrainingPercent, getEmployeeTrainingWorkMinutes } from "./employee-training-effects";
import { getEmployeeTrainingAvailability, getQueuedEmployeeTrainingDepartures, isEmployeeAwayForTraining } from "./employee-training";
import { getRoomDefinition, isEmployeeAssignedToOperationalRoom, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomCareStations, getRoomNavigableTiles, rotateRoomLocalPoint } from "./spatial";
import type { DomainContext, EmployeeState, GameState, GridPoint, PeriopNurseAttentionState, PeriopNurseAttentionTask, ServiceOperationState } from "./types";

type Phases = NonNullable<ServiceOperationState["frozenOperationPhases"]>;
const same = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);
const active = (operation: ServiceOperationState) => !["completed", "cancelled", "discharging", "leaving"].includes(operation.status);
const baseline = (kind: PeriopNurseAttentionTask["kind"]) => kind === "pre_op" ? PERIOP_PRE_OP_NURSE_ATTENTION_MINUTES : PERIOP_POST_OP_NURSE_ATTENTION_MINUTES;

/** Recovery room upgrades add satisfaction, not preparation speed. No timing
 * room modifier currently applies here. Category training follows the existing
 * preparation contract and is never inferred from an already-modified phase.
 */
export function createPeriopNurseAttention(state: GameState, phases: Phases, trainingPercent = getEmployeeRoleTrainingPercent(state, "staff.periop_nurse")): PeriopNurseAttentionState | undefined {
  const tasks = phases.flatMap((phase, phaseIndex): PeriopNurseAttentionTask[] => {
    if (phase.roomDefinitionId !== "room.periop_recovery" || !phase.roomStationId) return [];
    const kind = phase.roomStationId === "periop_preparation" ? "pre_op" : "post_op";
    const durationMinutes = getEmployeeTrainingWorkMinutes(baseline(kind), trainingPercent);
    return [{ phaseIndex, kind, durationMinutes, remainingMinutes: durationMinutes,
      readyAtFacilityTick: null, requiredUntilFacilityTick: null, employeeId: null, standingPoint: null,
      startedAtFacilityTick: null, completedAtFacilityTick: null, lastProgressAtFacilityTick: null }];
  });
  return tasks.length ? { version: "periop-nurse-attention.v1", trainingPercent, tasks } : undefined;
}

export function getCurrentPeriopNurseAttention(operation: ServiceOperationState): PeriopNurseAttentionTask | undefined {
  return operation.periopNurseAttention?.tasks.find((task) => task.phaseIndex === operation.phaseIndex);
}

function patientAtBed(state: GameState, operation: ServiceOperationState): boolean {
  return same(operation.actorKind === "encounter" ? state.encounters[operation.actorId]?.patientLocation : operation.location,
    operation.periopBedReservation?.endpoint);
}

/** Ready time is physical arrival and phase start, not admission/bed booking.
 * One clinic-wide FIFO uses ready tick, operation creation tick, then stable ID.
 */
export function getPeriopNurseAttentionQueue(state: GameState) {
  return state.serviceOperations.flatMap((operation) => {
    const task = getCurrentPeriopNurseAttention(operation);
    return active(operation) && operation.status === "in_service" && task && task.readyAtFacilityTick !== null &&
      task.completedAtFacilityTick === null && task.employeeId === null && patientAtBed(state, operation) ? [{ operation, task }] : [];
  }).sort((a, b) => a.task.readyAtFacilityTick! - b.task.readyAtFacilityTick! ||
    a.operation.createdAtFacilityTick - b.operation.createdAtFacilityTick || a.operation.id.localeCompare(b.operation.id));
}

export function beginPeriopNurseAttention(operation: ServiceOperationState, tick: number): void {
  const task = getCurrentPeriopNurseAttention(operation);
  if (!task || task.completedAtFacilityTick !== null) return;
  task.readyAtFacilityTick ??= tick;
  task.requiredUntilFacilityTick = operation.phaseEndsAtFacilityTick;
}

export function hasInstalledPeriopNurse(state: GameState, context: DomainContext): boolean {
  return state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse" &&
    state.rooms.some((room) => room.id === employee.homeRoomInstanceId && room.roomDefinitionId === "room.periop_recovery") &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context));
}

/** All eight beds keep their authored endpoints. Their bedside aisles can be
 * diagonal neighbors on the coarse grid; bed contacts, chairs, the staff desk,
 * doorway thresholds and other actors' claimed spots are never standing spots.
 */
export function getPeriopNurseStandingPoints(state: GameState, operation: ServiceOperationState, context: DomainContext): GridPoint[] {
  const bed = operation.periopBedReservation;
  const room = bed && state.rooms.find((candidate) => candidate.id === bed.roomInstanceId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!room || !definition || !bed) return [];
  const contacts = [
    ...getRoomCareStations(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context)).map((station) => station.patientAnchor),
    ...(definition.navigation?.endpointOnlyTiles ?? []).map((point) => {
      const local = rotateRoomLocalPoint(point, definition, room.orientation);
      return { x: room.x + local.x, y: room.y + local.y };
    }),
    ...state.doors.flatMap((door) => {
      const owner = state.rooms.find((candidate) => candidate.id === door.roomId);
      const ownerDefinition = owner && getRoomDefinition(owner.roomDefinitionId, context);
      const cells = owner && ownerDefinition && getDoorCells(door, owner, ownerDefinition);
      return cells ? [cells.inside, cells.outside] : [];
    }),
  ];
  return getRoomNavigableTiles(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context))
    .filter((point) => Math.max(Math.abs(point.x - bed.endpoint.x), Math.abs(point.y - bed.endpoint.y)) === 1 &&
      !contacts.some((contact) => same(contact, point)))
    .sort((a, b) => (Math.abs(a.x - bed.endpoint.x) + Math.abs(a.y - bed.endpoint.y)) -
      (Math.abs(b.x - bed.endpoint.x) + Math.abs(b.y - bed.endpoint.y)) || a.y - b.y || a.x - b.x);
}

function available(state: GameState, employee: EmployeeState, context: DomainContext): boolean {
  return employee.staffRoleDefinitionId === "staff.periop_nurse" && !employee.facilityTask && !isEmployeeAwayForTraining(employee) &&
    state.rooms.some((room) => room.id === employee.homeRoomInstanceId && room.roomDefinitionId === "room.periop_recovery") &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
    !state.serviceOperations.some((operation) => active(operation) && (operation.reservedEmployeeIds.includes(employee.id) ||
      operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id)) &&
    !state.retailOperations.some((trip) => !["completed", "cancelled", "abandoned"].includes(trip.status) &&
      (trip.servingEmployeeId === employee.id || trip.actorKind === "employee" && trip.actorId === employee.id));
}

function release(employee: EmployeeState | undefined, task: PeriopNurseAttentionTask, operationId: string): void {
  if (employee?.facilityTask?.kind === "periop_attention" && employee.facilityTask.targetId === operationId) {
    employee.facilityTask = null;
    employee.path = [{ ...employee.location }];
    employee.pathIndex = 0;
  }
  task.employeeId = null;
  task.standingPoint = null;
}

export function periopNurseAttentionStatus(operation: ServiceOperationState, tick: number): string | null {
  const task = getCurrentPeriopNurseAttention(operation);
  if (!task || operation.status !== "in_service" || task.completedAtFacilityTick !== null || task.requiredUntilFacilityTick === null) return null;
  if ((task.startedAtFacilityTick === null || task.employeeId === null) && tick + task.remainingMinutes > task.requiredUntilFacilityTick) return "Waiting for peri-op nurse";
  return null;
}

/** Read-only estimate for the diagnostic calendar. Actual completion still
 * requires the task witness. A paused/unreachable nurse has no invented ETA.
 */
export function forecastPeriopNurseAttentionEnd(state: GameState, operation: ServiceOperationState, context: DomainContext): number | null {
  const target = getCurrentPeriopNurseAttention(operation);
  if (!target || target.readyAtFacilityTick === null) return operation.phaseEndsAtFacilityTick;
  if (target.completedAtFacilityTick !== null) return target.completedAtFacilityTick;
  const now = state.facilityTick;
  const travel = (path: GridPoint[], index = 0) => Math.ceil(Math.max(0, path.length - 1 - index) / context.balanceRelease.facility.characterTravelTilesPerTick);
  const timelines = state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse" &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context)).flatMap((employee) => {
    const training = getEmployeeTrainingAvailability(state, employee, context);
    if (training.kind === "blocked") return [];
    let at = training.kind === "returning_at" ? training.availableAtTick : now;
    let location = training.kind === "returning_at" ? training.homeLocation : employee.location;
    const duty = employee.facilityTask;
    if (duty?.kind === "periop_attention") {
      const assignedOperation = state.serviceOperations.find((entry) => entry.id === duty.targetId);
      const assigned = assignedOperation && getCurrentPeriopNurseAttention(assignedOperation);
      if (assigned?.employeeId === employee.id && assigned.completedAtFacilityTick === null) {
        at = now + travel(employee.path, employee.pathIndex) + assigned.remainingMinutes;
        location = assigned.standingPoint ?? location;
      }
    } else if (duty) {
      if (duty.workMinutesRemaining === Number.MAX_SAFE_INTEGER) return [];
      at = Math.max(at, now + travel(employee.path, employee.pathIndex) + duty.workMinutesRemaining);
      location = employee.path.at(-1) ?? location;
    }
    return [{ id: employee.id, at, location, lastAssignment: employee.lastPeriopAttentionAssignedAtFacilityTick ?? -1 }];
  });
  if (target.employeeId) return timelines.find((entry) => entry.id === target.employeeId)?.at ?? null;
  for (const { operation: queuedOperation, task } of getPeriopNurseAttentionQueue(state)) {
    const roomId = queuedOperation.periopBedReservation?.roomInstanceId;
    if (!roomId) return null;
    const choice = timelines.slice().sort((a, b) => a.at - b.at || a.lastAssignment - b.lastAssignment || a.id.localeCompare(b.id)).flatMap((nurse) => {
      const routes = getPeriopNurseStandingPoints(state, queuedOperation, context).map((standing) =>
        findCareAwareFacilityPath(state, context, nurse.location, standing, new Set([roomId])))
        .filter((path) => path.length > 0).sort((a, b) => a.length - b.length);
      return routes[0] ? [{ nurse, path: routes[0] }] : [];
    })[0];
    if (!choice) return null;
    choice.nurse.lastAssignment = choice.nurse.at;
    choice.nurse.at += travel(choice.path) + task.remainingMinutes;
    choice.nurse.location = choice.path.at(-1)!;
    if (queuedOperation.id === operation.id) return choice.nurse.at;
  }
  return null;
}

/** Called before phase completion and after all newly-arrived patients become
 * ready. The progress witness makes the two calls in one minute idempotent.
 */
export function advancePeriopNurseAttention(state: GameState, context: DomainContext): void {
  for (const operation of state.serviceOperations) for (const task of operation.periopNurseAttention?.tasks ?? []) {
    const employee = state.employees.find((candidate) => candidate.id === task.employeeId);
    if (!active(operation) || operation.phaseIndex !== task.phaseIndex || operation.status !== "in_service" || task.completedAtFacilityTick !== null) {
      if (task.employeeId) release(employee, task, operation.id);
      continue;
    }
    if (task.employeeId) {
      const valid = patientAtBed(state, operation) && employee && !isEmployeeAwayForTraining(employee) && isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
        employee.facilityTask?.kind === "periop_attention" && employee.facilityTask.targetId === operation.id &&
        task.standingPoint && getPeriopNurseStandingPoints(state, operation, context).some((point) => same(point, task.standingPoint));
      if (!valid) release(employee, task, operation.id);
      else if (employee.pathIndex >= employee.path.length - 1 && same(employee.location, task.standingPoint) &&
        same(operation.actorKind === "encounter" ? state.encounters[operation.actorId]?.patientLocation : operation.location, operation.periopBedReservation?.endpoint)) {
        // Arrival ends the walking interval; attention starts after that instant.
        const justArrived = task.startedAtFacilityTick === null || employee.lastMovedAtFacilityTick === state.facilityTick;
        task.startedAtFacilityTick ??= state.facilityTick;
        const last = justArrived ? state.facilityTick : task.lastProgressAtFacilityTick ?? state.facilityTick;
        task.remainingMinutes = Math.max(0, task.remainingMinutes - Math.max(0, state.facilityTick - last));
        task.lastProgressAtFacilityTick = state.facilityTick;
        if (task.remainingMinutes === 0) {
          task.completedAtFacilityTick = state.facilityTick;
          release(employee, task, operation.id);
        } else employee.facilityTask!.workMinutesRemaining = task.remainingMinutes;
      } else task.lastProgressAtFacilityTick = state.facilityTick;
    }
    if (task.requiredUntilFacilityTick !== null) {
      operation.phaseEndsAtFacilityTick = Math.max(task.requiredUntilFacilityTick,
        task.completedAtFacilityTick ?? state.facilityTick + task.remainingMinutes);
      operation.resourceWaitReason = periopNurseAttentionStatus(operation, state.facilityTick);
    }
  }
  // An idle nurse whose paid training place is ready gets to leave between tasks.
  const trainingDepartures = new Set(getQueuedEmployeeTrainingDepartures(state, context).map((entry) => entry.employeeId));
  const nurses = state.employees.filter((employee) => available(state, employee, context) && !trainingDepartures.has(employee.id))
    // FIFO patients, longest-rested eligible nurse. Always picking the first
    // employee ID starves colleagues when procedure returns are staggered.
    .sort((a, b) => (a.lastPeriopAttentionAssignedAtFacilityTick ?? -1) - (b.lastPeriopAttentionAssignedAtFacilityTick ?? -1) || a.id.localeCompare(b.id));
  for (const { operation, task } of getPeriopNurseAttentionQueue(state)) {
    const bed = operation.periopBedReservation;
    if (!bed || !isRoomOperationalForFacilityWork(state, bed.roomInstanceId, context)) continue;
    let assigned = false;
    for (const nurse of nurses) {
      if (nurse.facilityTask) continue;
      const claimed = [
        ...state.employees.filter((other) => other.id !== nurse.id).flatMap((other) => [other.location, other.path.at(-1)]),
        ...state.retailExternalActors.filter((actor) => actor.lifecycle !== "departed").flatMap((actor) => [actor.location, actor.path.at(-1)]),
      ];
      for (const standing of getPeriopNurseStandingPoints(state, operation, context).sort((a, b) =>
        (Math.abs(a.x - nurse.location.x) + Math.abs(a.y - nurse.location.y)) -
        (Math.abs(b.x - nurse.location.x) + Math.abs(b.y - nurse.location.y)))) {
        if (claimed.some((point) => same(point, standing))) continue;
        const path = findCareAwareFacilityPath(state, context, nurse.location, standing, new Set([bed.roomInstanceId]));
        if (!path.length || !same(path.at(-1), standing)) continue;
        task.employeeId = nurse.id;
        task.standingPoint = { ...standing };
        task.lastProgressAtFacilityTick = state.facilityTick;
        nurse.path = path;
        nurse.pathIndex = 0;
        nurse.lastMovedAtFacilityTick = state.facilityTick;
        nurse.lastPeriopAttentionAssignedAtFacilityTick = state.facilityTick;
        nurse.facilityTask = { kind: "periop_attention", targetId: operation.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: task.remainingMinutes };
        if (path.length === 1) task.startedAtFacilityTick ??= state.facilityTick;
        assigned = true;
        break;
      }
      if (assigned) break;
    }
    // Do not let a newer task overtake a waiting patient's unavailable bedside.
    if (!assigned) break;
  }
}

/** Strict optional save marker. Unmarked legacy operations are never opted in. */
export function normalizePeriopNurseAttention(value: unknown, phases: Phases): PeriopNurseAttentionState | undefined {
  if (value === undefined) return undefined;
  const invalid = (): never => { throw new Error("The saved peri-op nurse attention is invalid."); };
  if (!value || typeof value !== "object") return invalid();
  const raw = value as PeriopNurseAttentionState;
  if (raw.version !== "periop-nurse-attention.v1" || !Number.isFinite(raw.trainingPercent) || raw.trainingPercent < 0 || raw.trainingPercent > 40 || !Array.isArray(raw.tasks)) return invalid();
  const expected = phases.flatMap((phase, phaseIndex) => phase.roomDefinitionId === "room.periop_recovery" && phase.roomStationId ? [phaseIndex] : []);
  if (!expected.length || raw.tasks.length !== expected.length) return invalid();
  const tick = (v: unknown) => v === null || typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
  const tasks = raw.tasks.map((task, index) => {
    const kind = phases[expected[index]!]!.roomStationId === "periop_preparation" ? "pre_op" : "post_op";
    if (!task || task.phaseIndex !== expected[index] || task.kind !== kind || task.durationMinutes !== getEmployeeTrainingWorkMinutes(baseline(kind), raw.trainingPercent) ||
      !Number.isSafeInteger(task.remainingMinutes) || task.remainingMinutes < 0 || task.remainingMinutes > task.durationMinutes ||
      ![task.readyAtFacilityTick, task.requiredUntilFacilityTick, task.startedAtFacilityTick, task.completedAtFacilityTick, task.lastProgressAtFacilityTick].every(tick) ||
      (task.readyAtFacilityTick === null) !== (task.requiredUntilFacilityTick === null) ||
      (task.employeeId !== null && (typeof task.employeeId !== "string" || !task.employeeId)) ||
      (task.employeeId === null) !== (task.standingPoint === null) ||
      task.standingPoint !== null && (!Number.isSafeInteger(task.standingPoint?.x) || !Number.isSafeInteger(task.standingPoint?.y)) ||
      (task.completedAtFacilityTick !== null) !== (task.remainingMinutes === 0) ||
      task.completedAtFacilityTick !== null && (task.startedAtFacilityTick === null || task.completedAtFacilityTick < task.startedAtFacilityTick || task.employeeId !== null) ||
      task.startedAtFacilityTick !== null && (task.readyAtFacilityTick === null || task.startedAtFacilityTick < task.readyAtFacilityTick)) return invalid();
    return { ...task, standingPoint: task.standingPoint && { ...task.standingPoint } };
  });
  return { version: "periop-nurse-attention.v1", trainingPercent: raw.trainingPercent, tasks };
}

/** Missing/dismissed nurses return accepted remaining work to its original
 * queue position. The save retains progress and never starts a second timer.
 */
export function reconcilePeriopNurseAttentionReservations(state: GameState, context: DomainContext): void {
  const claims = new Set<string>();
  const spots = new Set<string>();
  for (const operation of state.serviceOperations) for (const task of operation.periopNurseAttention?.tasks ?? []) {
    if ([task.readyAtFacilityTick, task.startedAtFacilityTick, task.completedAtFacilityTick, task.lastProgressAtFacilityTick]
      .some((tick) => tick !== null && tick > state.facilityTick)) throw new Error("The saved peri-op attention progress is in the future.");
    if (!task.employeeId) continue;
    const employee = state.employees.find((candidate) => candidate.id === task.employeeId);
    const spot = task.standingPoint && `${task.standingPoint.x},${task.standingPoint.y}`;
    if (claims.has(task.employeeId) || spot && spots.has(spot)) throw new Error("The saved peri-op nurse is double booked.");
    if (!patientAtBed(state, operation) || !employee || employee.facilityTask?.kind !== "periop_attention" || employee.facilityTask.targetId !== operation.id ||
      isEmployeeAwayForTraining(employee) || !getPeriopNurseStandingPoints(state, operation, context).some((point) => same(point, task.standingPoint))) {
      release(employee, task, operation.id);
      continue;
    }
    claims.add(task.employeeId);
    if (spot) spots.add(spot);
  }
  for (const employee of state.employees) if (employee.facilityTask?.kind === "periop_attention" && !claims.has(employee.id)) {
    employee.facilityTask = null;
    employee.path = [{ ...employee.location }];
    employee.pathIndex = 0;
  }
}
