import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import { findCareAwareFacilityPath } from "./care-room-access";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomNavigableTiles, getRoomNavigationAnchor } from "./spatial";
import type { DomainContext, EmployeeState, GameState, GridPoint, LevelThreeBreakSeatId, PlacedRoom } from "./types";

export const LEVEL_THREE_MAINTAINED_ROOM_IDS = [
  "room.ambulatory_or",
  "room.laboratory",
  "room.pharmacy",
] as const;

export const LEVEL_THREE_BREAK_SEATS: ReadonlyArray<{
  id: LevelThreeBreakSeatId;
  contact: { x: number; y: number };
}> = [
  { id: "massage", contact: { x: 1.05, y: 3.5 } },
  { id: "largeNorth", contact: { x: 2, y: 0.28 } },
  { id: "largeSouth", contact: { x: 2, y: 2.32 } },
  { id: "largeWest", contact: { x: 0.55, y: 1.33 } },
  { id: "largeEast", contact: { x: 3.45, y: 1.33 } },
  { id: "smallNorth", contact: { x: 3.32, y: 2.25 } },
  { id: "smallSouth", contact: { x: 2.7, y: 3.8 } },
];

export interface LevelThreeSupportStatus {
  maintenanceDueRoomIds: string[];
  maintenanceOutOfServiceRoomIds: string[];
  queuedQiReviewCount: number;
  completedQiReviewCount: number;
  firstQiReviewCompleted: boolean;
  occupiedBreakSeats: Array<{ roomId: string; seatId: LevelThreeBreakSeatId; employeeId: string }>;
}

export function getLevelThreeSupportStatus(state: GameState): LevelThreeSupportStatus {
  const reviews = state.levelThreeQiReviews ?? [];
  return {
    maintenanceDueRoomIds: state.rooms.filter((room) => room.maintenance?.status === "due").map((room) => room.id),
    maintenanceOutOfServiceRoomIds: state.rooms.filter((room) => room.maintenance?.status === "out_of_service").map((room) => room.id),
    queuedQiReviewCount: reviews.filter((review) => review.status === "queued").length,
    completedQiReviewCount: reviews.filter((review) => review.status === "completed").length,
    firstQiReviewCompleted: reviews.some((review) => review.status === "completed"),
    occupiedBreakSeats: state.employees.flatMap((employee) =>
      employee.facilityTask?.kind === "take_break" && employee.facilityTask.targetId && employee.facilityTask.seatId
        ? [{ roomId: employee.facilityTask.targetId, seatId: employee.facilityTask.seatId, employeeId: employee.id }]
        : [],
    ),
  };
}

function maintained(room: PlacedRoom): boolean {
  return (LEVEL_THREE_MAINTAINED_ROOM_IDS as readonly string[]).includes(room.roomDefinitionId);
}

function maintenance(room: PlacedRoom): NonNullable<PlacedRoom["maintenance"]> {
  return room.maintenance ??= {
    status: "operational",
    completedUses: 0,
    dueAtFacilityTick: null,
    outOfServiceAtFacilityTick: null,
    appliedUseKeys: [],
  };
}

export function recordLevelThreeRoomUse(
  state: GameState,
  roomId: string,
  useKey: string,
  context: DomainContext,
): void {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  if (!room || !maintained(room)) return;
  state.levelThreeMaintenanceAppliedUseKeys ??= [];
  if (state.levelThreeMaintenanceAppliedUseKeys.includes(useKey)) return;
  const record = maintenance(room);
  if (record.appliedUseKeys.includes(useKey)) {
    state.levelThreeMaintenanceAppliedUseKeys.push(useKey);
    return;
  }
  state.levelThreeMaintenanceAppliedUseKeys.push(useKey);
  record.appliedUseKeys.push(useKey);
  record.completedUses += 1;
  const tuning = context.balanceRelease.environment.levelThreeSupport;
  if (record.status === "operational" && record.completedUses >= tuning.maintenanceUseThreshold) {
    record.status = "due";
    record.dueAtFacilityTick = state.facilityTick;
    record.outOfServiceAtFacilityTick = state.facilityTick + tuning.maintenanceGraceMinutes;
  }
}

function samePoint(left: GridPoint, right: GridPoint): boolean {
  return left.x === right.x && left.y === right.y;
}

function targetForBreakSeat(state: GameState, room: PlacedRoom, seatId: LevelThreeBreakSeatId, context: DomainContext): GridPoint | null {
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  const seat = LEVEL_THREE_BREAK_SEATS.find((candidate) => candidate.id === seatId);
  if (!definition || !seat) return null;
  const candidates = getRoomNavigableTiles(room, definition, state.doors);
  const exact = { x: room.x + seat.contact.x, y: room.y + seat.contact.y };
  return candidates.sort((left, right) =>
    (Math.abs(left.x - exact.x) + Math.abs(left.y - exact.y)) -
      (Math.abs(right.x - exact.x) + Math.abs(right.y - exact.y)) ||
    left.y - right.y || left.x - right.x,
  )[0] ?? null;
}

function employeeHasCareDemand(state: GameState, employee: EmployeeState): boolean {
  if (state.serviceOperations.some((operation) =>
    operation.status !== "completed" && operation.status !== "cancelled" &&
    (operation.reservedEmployeeIds.includes(employee.id) || operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id),
  )) return true;
  for (const operation of state.serviceOperations) {
    if (operation.status !== "waiting_for_resources" && operation.status !== "waiting_for_next_phase") continue;
    const line = getServiceIncomeLine(operation.incomeLineId);
    const demandIndex = operation.status === "waiting_for_next_phase" ? operation.phaseIndex + 1 : operation.phaseIndex;
    const phase = operation.frozenOperationPhases?.[demandIndex] ?? line?.operation?.phases[demandIndex];
    if (phase?.staffRoleDefinitionIds.includes(employee.staffRoleDefinitionId) ||
        phase?.providerRoleDefinitionIds?.includes(employee.staffRoleDefinitionId)) return true;
  }
  if (Object.values(state.employeeDiscussions ?? {}).some((discussion) =>
    discussion.employeeId === employee.id && discussion.lifecycle !== "resolved" && discussion.lifecycle !== "cancelled",
  )) return true;
  if (employee.staffRoleDefinitionId === "staff.receptionist" && Object.values(state.encounters).some((encounter) =>
    encounter.lifecycle === "waiting_unopened" || encounter.checkInStatus !== "checked_in",
  )) return true;
  return state.retailOperations.some((operation) =>
    operation.status === "queued" && operation.staffRoleDefinitionId === employee.staffRoleDefinitionId,
  );
}

function idle(state: GameState, employee: EmployeeState): boolean {
  return !employee.facilityTask && employee.pathIndex >= Math.max(0, employee.path.length - 1) &&
    !state.serviceOperations.some((operation) => operation.status !== "completed" && operation.status !== "cancelled" &&
      (operation.reservedEmployeeIds.includes(employee.id) || operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id)) &&
    !state.retailOperations.some((operation) => operation.servingEmployeeId === employee.id &&
      !["completed", "cancelled", "abandoned"].includes(operation.status)) &&
    !state.retailOperations.some((operation) => operation.actorKind === "employee" && operation.actorId === employee.id &&
      !["completed", "cancelled", "abandoned"].includes(operation.status));
}

function employeeHasAssignedCare(state: GameState, employee: EmployeeState): boolean {
  return state.serviceOperations.some((operation) =>
    operation.status !== "completed" && operation.status !== "cancelled" &&
    (operation.reservedEmployeeIds.includes(employee.id) ||
      operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id),
  ) || state.retailOperations.some((operation) =>
    !["completed", "cancelled", "abandoned"].includes(operation.status) &&
    (operation.servingEmployeeId === employee.id || operation.actorKind === "employee" && operation.actorId === employee.id),
  );
}

function routeEmployeeHome(state: GameState, employee: EmployeeState, context: DomainContext): void {
  if (employeeHasAssignedCare(state, employee)) return;
  const home = employee.homeRoomInstanceId
    ? state.rooms.find((room) => room.id === employee.homeRoomInstanceId)
    : null;
  const definition = home ? getRoomDefinition(home.roomDefinitionId, context) : null;
  if (!home || !definition) {
    employee.path = [{ ...employee.location }];
    employee.pathIndex = 0;
    return;
  }
  const target = getRoomNavigationAnchor(home, definition, "staff");
  const allowedRooms = new Set([home.id]);
  const ordinary = findCareAwareFacilityPath(state, context, employee.location, target, allowedRooms);
  const path = ordinary.length > 0
    ? ordinary
    : findRouteFromDisplacedLocationToPoint(state, context, employee.location, target, allowedRooms);
  employee.path = path.length > 0 ? path : [{ ...employee.location }];
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = state.facilityTick;
}

function clearSupportTask(state: GameState, employee: EmployeeState, context: DomainContext): void {
  if (employee.facilityTask?.kind === "review_ambulatory_qi" && employee.facilityTask.targetId) {
    const review = state.levelThreeQiReviews.find((candidate) => candidate.id === employee.facilityTask!.targetId);
    if (review?.status === "in_progress") {
      review.status = "queued";
      review.surgeonEmployeeId = null;
      review.startedAtFacilityTick = null;
    }
  }
  employee.facilityTask = null;
  routeEmployeeHome(state, employee, context);
}

function reconcileSupportAssignments(state: GameState, context: DomainContext): void {
  const claimedBreakSeats = new Set<string>();
  for (const employee of [...state.employees].sort((left, right) => left.id.localeCompare(right.id))) {
    const task = employee.facilityTask;
    if (task?.kind !== "take_break") continue;
    const room = task.targetId ? state.rooms.find((candidate) => candidate.id === task.targetId) : null;
    const claim = room?.roomDefinitionId === "room.staff_break" && task.seatId
      ? `${room.id}:${task.seatId}` : null;
    if (!claim || claimedBreakSeats.has(claim)) {
      employee.facilityTask = null;
      routeEmployeeHome(state, employee, context);
      continue;
    }
    claimedBreakSeats.add(claim);
  }

  for (const review of state.levelThreeQiReviews) {
    if (review.status !== "in_progress") continue;
    const surgeon = review.surgeonEmployeeId
      ? state.employees.find((candidate) => candidate.id === review.surgeonEmployeeId && candidate.staffRoleDefinitionId === "staff.surgeon")
      : null;
    const office = surgeon?.homeRoomInstanceId
      ? state.rooms.find((candidate) => candidate.id === surgeon.homeRoomInstanceId && candidate.roomDefinitionId === "room.surgeon_office")
      : null;
    const matchingTask = surgeon?.facilityTask?.kind === "review_ambulatory_qi" && surgeon.facilityTask.targetId === review.id;
    if (surgeon && office && matchingTask && isRoomOperationalForFacilityWork(state, office.id, context)) continue;
    if (surgeon?.facilityTask?.kind === "review_ambulatory_qi" && surgeon.facilityTask.targetId === review.id) {
      surgeon.facilityTask = null;
      routeEmployeeHome(state, surgeon, context);
    }
    review.status = "queued";
    review.surgeonEmployeeId = null;
    review.startedAtFacilityTick = null;
  }
}

function progressTasks(state: GameState, context: DomainContext): void {
  const tuning = context.balanceRelease.environment.levelThreeSupport;
  for (const employee of state.employees) {
    const task = employee.facilityTask;
    if (!task || !["take_break", "repair_room", "review_ambulatory_qi"].includes(task.kind)) continue;
    if (employeeHasCareDemand(state, employee) && task.kind !== "repair_room") {
      clearSupportTask(state, employee, context);
      continue;
    }
    if (employee.pathIndex < Math.max(0, employee.path.length - 1)) continue;
    task.workMinutesRemaining -= 1;
    if (task.workMinutesRemaining > 0) continue;
    if (task.kind === "take_break") {
      employee.morale = Math.min(100, employee.morale + tuning.breakMoraleGain);
      employee.lastBreakAtFacilityTick = state.facilityTick;
    } else if (task.kind === "repair_room" && task.targetId) {
      const room = state.rooms.find((candidate) => candidate.id === task.targetId);
      if (room?.maintenance) {
        room.maintenance = { status: "operational", completedUses: 0, dueAtFacilityTick: null, outOfServiceAtFacilityTick: null, appliedUseKeys: room.maintenance.appliedUseKeys };
      }
    } else if (task.kind === "review_ambulatory_qi" && task.targetId) {
      const review = state.levelThreeQiReviews.find((candidate) => candidate.id === task.targetId);
      if (review) {
        review.status = "completed";
        review.completedAtFacilityTick = state.facilityTick;
      }
    }
    employee.facilityTask = null;
    routeEmployeeHome(state, employee, context);
  }
}

function reconcileMaintenance(state: GameState): void {
  const activeRoomIds = new Set(state.serviceOperations.filter((operation) => operation.status !== "completed" && operation.status !== "cancelled").flatMap((operation) => [
    ...operation.reservedRoomInstanceIds,
    ...(operation.transitionHeldRoomInstanceIds ?? []),
    ...(operation.periopBedReservation ? [operation.periopBedReservation.roomInstanceId] : []),
  ]));
  const activeRetailRoomIds = new Set(state.retailOperations.filter((operation) =>
    operation.status === "purchasing",
  ).map((operation) => operation.outletRoomInstanceId));
  for (const room of state.rooms) {
    if (!maintained(room)) continue;
    const record = maintenance(room);
    if (record.status === "due" && record.outOfServiceAtFacilityTick !== null &&
        state.facilityTick >= record.outOfServiceAtFacilityTick &&
        !activeRoomIds.has(room.id) && !activeRetailRoomIds.has(room.id)) {
      record.status = "out_of_service";
    }
  }
}

function enqueueQi(state: GameState): void {
  const reviewedReceiptIds = new Set(state.levelThreeQiReviews.map((review) => review.receiptId));
  for (const receipt of state.serviceIncomeReceipts) {
    if (receipt.incomeLineId !== "income.ambulatory_operation" && receipt.incomeLineId !== "income.ambulatory_operation_extended") continue;
    if (reviewedReceiptIds.has(receipt.id)) continue;
    state.levelThreeQiReviews.push({
      id: `level-three-qi.${state.levelThreeQiReviewSequence++}`,
      receiptId: receipt.id,
      status: "queued",
      surgeonEmployeeId: null,
      enqueuedAtFacilityTick: state.facilityTick,
      startedAtFacilityTick: null,
      completedAtFacilityTick: null,
    });
    reviewedReceiptIds.add(receipt.id);
  }
}

function routeTask(state: GameState, employee: EmployeeState, target: GridPoint, allowedRoomId: string, context: DomainContext): boolean {
  const path = findCareAwareFacilityPath(state, context, employee.location, target, new Set([allowedRoomId]));
  if (path.length === 0 || !samePoint(path.at(-1)!, target)) return false;
  employee.path = path;
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = state.facilityTick;
  return true;
}

function assignRepairs(state: GameState, context: DomainContext): void {
  const tuning = context.balanceRelease.environment.levelThreeSupport;
  const activeRoomIds = new Set(state.serviceOperations.filter((operation) => operation.status !== "completed" && operation.status !== "cancelled").flatMap((operation) => [
    ...operation.reservedRoomInstanceIds,
    ...(operation.transitionHeldRoomInstanceIds ?? []),
  ]));
  const purchasingRoomIds = new Set(state.retailOperations.filter((operation) => operation.status === "purchasing").map((operation) => operation.outletRoomInstanceId));
  for (const room of state.rooms.filter((candidate) => candidate.maintenance?.status === "due" || candidate.maintenance?.status === "out_of_service")) {
    if (activeRoomIds.has(room.id) || purchasingRoomIds.has(room.id)) continue;
    if (state.employees.some((employee) => employee.facilityTask?.kind === "repair_room" && employee.facilityTask.targetId === room.id)) continue;
    const repairer = state.employees.find((employee) => {
      if (employee.staffRoleDefinitionId !== "staff.repair_person" || !idle(state, employee)) return false;
      const home = employee.homeRoomInstanceId ? state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId) : null;
      return home?.roomDefinitionId === "room.maintenance_workshop" && isRoomOperationalForFacilityWork(state, home.id, context);
    });
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!repairer || !definition || !routeTask(state, repairer, getRoomNavigationAnchor(room, definition, "staff"), room.id, context)) continue;
    room.maintenance!.status = "out_of_service";
    repairer.facilityTask = { kind: "repair_room", targetId: room.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: tuning.repairDurationMinutes };
  }
}

function assignQi(state: GameState, context: DomainContext): void {
  if (state.levelThreeQiReviews.some((candidate) => candidate.status === "in_progress")) return;
  const review = state.levelThreeQiReviews.find((candidate) => candidate.status === "queued");
  if (!review) return;
  const surgeon = state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.surgeon" && idle(state, employee) && !employeeHasCareDemand(state, employee));
  const office = surgeon?.homeRoomInstanceId ? state.rooms.find((candidate) => candidate.id === surgeon.homeRoomInstanceId) : null;
  const definition = office ? getRoomDefinition(office.roomDefinitionId, context) : null;
  if (!surgeon || office?.roomDefinitionId !== "room.surgeon_office" || !definition || !isRoomOperationalForFacilityWork(state, office.id, context)) return;
  if (!routeTask(state, surgeon, getRoomNavigationAnchor(office, definition, "staff"), office.id, context)) return;
  review.status = "in_progress";
  review.surgeonEmployeeId = surgeon.id;
  review.startedAtFacilityTick = state.facilityTick;
  surgeon.facilityTask = { kind: "review_ambulatory_qi", targetId: review.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: context.balanceRelease.environment.levelThreeSupport.qiReviewDurationMinutes };
}

function assignBreaks(state: GameState, context: DomainContext): void {
  const tuning = context.balanceRelease.environment.levelThreeSupport;
  const occupied = new Set(state.employees.flatMap((employee) => employee.facilityTask?.kind === "take_break" && employee.facilityTask.targetId && employee.facilityTask.seatId
    ? [`${employee.facilityTask.targetId}:${employee.facilityTask.seatId}`] : []));
  for (const employee of state.employees) {
    if (!idle(state, employee) || employeeHasCareDemand(state, employee) || employee.morale >= 100 ||
        (employee.lastBreakAtFacilityTick != null && state.facilityTick - employee.lastBreakAtFacilityTick < tuning.breakCooldownMinutes)) continue;
    for (const room of state.rooms.filter((candidate) => candidate.roomDefinitionId === "room.staff_break" && isRoomOperationalForFacilityWork(state, candidate.id, context))) {
      const seat = LEVEL_THREE_BREAK_SEATS.find((candidate) => !occupied.has(`${room.id}:${candidate.id}`));
      const target = seat ? targetForBreakSeat(state, room, seat.id, context) : null;
      if (!seat || !target || !routeTask(state, employee, target, room.id, context)) continue;
      employee.facilityTask = { kind: "take_break", targetId: room.id, seatId: seat.id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: tuning.breakDurationMinutes };
      occupied.add(`${room.id}:${seat.id}`);
      break;
    }
  }
}

export function advanceLevelThreeSupport(state: GameState, context: DomainContext): void {
  state.levelThreeQiReviews ??= [];
  state.levelThreeQiReviewSequence ??= state.levelThreeQiReviews.reduce((highest, review) => {
    const match = /^level-three-qi\.(\d+)$/.exec(review.id);
    return match ? Math.max(highest, Number.parseInt(match[1]!, 10) + 1) : highest;
  }, 0);
  state.levelThreeMaintenanceAppliedUseKeys ??= state.rooms.flatMap((room) => room.maintenance?.appliedUseKeys ?? []);
  reconcileSupportAssignments(state, context);
  progressTasks(state, context);
  reconcileMaintenance(state);
  enqueueQi(state);
  assignRepairs(state, context);
  assignQi(state, context);
  assignBreaks(state, context);
}
