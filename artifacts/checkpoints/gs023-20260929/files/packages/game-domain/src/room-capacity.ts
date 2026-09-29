import { deterministicShuffle, RANDOM_STREAMS } from "./randomness";
import type { DomainContext, EmployeeState, GameState, PlacedRoom } from "./types";

const STAFF_SLOTS: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  "staff.receptionist": { "room.front_desk": 1 },
  "staff.imaging_technician": {
    "room.ultrasound": 1,
    "room.xray": 1,
    "room.ct": 1,
  },
  "staff.periop_nurse": { "room.periop_recovery": 2 },
  "staff.endoscopy_nurse": { "room.endoscopy": 1 },
  "staff.endoscopist": { "room.endoscopy": 1 },
  "staff.phlebotomist": { "room.phlebotomy": 1 },
  "staff.evs_worker": { "room.evs_closet": 1 },
  "staff.glp1_np": { "room.glp1_telehealth_suite": 2 },
};

export interface RoomStaffCapacity {
  staffRoleDefinitionId: string;
  builtRoomCount: number;
  capacity: number;
  slotsByRoomInstanceId: Readonly<Record<string, number>>;
}

export interface RoomSalePreview {
  roomId: string;
  roomDefinitionId: string;
  dismissedEmployees: Array<Pick<EmployeeState, "id" | "displayName" | "staffRoleDefinitionId">>;
  confirmationToken: string;
}

function slotsForRole(roleId: string): Readonly<Record<string, number>> {
  return STAFF_SLOTS[roleId] ?? {};
}

function eligibleRooms(
  state: GameState,
  roleId: string,
  excludedRoomId?: string,
): PlacedRoom[] {
  const slotDefinitions = slotsForRole(roleId);
  return state.rooms
    .filter((room) => room.id !== excludedRoomId && (slotDefinitions[room.roomDefinitionId] ?? 0) > 0)
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function getRoomStaffCapacity(
  state: GameState,
  staffRoleDefinitionId: string,
): RoomStaffCapacity {
  const slotDefinitions = slotsForRole(staffRoleDefinitionId);
  const slotsByRoomInstanceId = Object.fromEntries(
    eligibleRooms(state, staffRoleDefinitionId).map((room) => [
      room.id,
      slotDefinitions[room.roomDefinitionId] ?? 0,
    ]),
  );
  return {
    staffRoleDefinitionId,
    builtRoomCount: Object.keys(slotsByRoomInstanceId).length,
    capacity: Object.values(slotsByRoomInstanceId).reduce((total, slots) => total + slots, 0),
    slotsByRoomInstanceId,
  };
}

/**
 * Rebalances legacy first-room assignments without moving or dismissing anyone.
 * Existing valid seats are retained; overflow gets the first deterministic free
 * compatible seat. Legacy excess staff keep an existing compatible home and
 * remain employed until capacity is added or a later sale confirms dismissal.
 */
export function reconcileEmployeeRoomSeats(state: GameState): void {
  for (const roleId of Object.keys(STAFF_SLOTS)) {
    const rooms = eligibleRooms(state, roleId);
    const slotDefinitions = slotsForRole(roleId);
    const remaining = new Map(rooms.map((room) => [room.id, slotDefinitions[room.roomDefinitionId] ?? 0]));
    const overflow: Array<{ employee: EmployeeState; priorHomeRoomInstanceId: string | null }> = [];
    for (const employee of state.employees
      .filter((candidate) => candidate.staffRoleDefinitionId === roleId)
      .sort((left, right) => left.id.localeCompare(right.id))) {
      const remainingAtHome = employee.homeRoomInstanceId
        ? remaining.get(employee.homeRoomInstanceId)
        : undefined;
      if (remainingAtHome !== undefined && remainingAtHome > 0) {
        remaining.set(employee.homeRoomInstanceId!, remainingAtHome - 1);
      } else {
        overflow.push({ employee, priorHomeRoomInstanceId: employee.homeRoomInstanceId });
      }
    }
    for (const { employee, priorHomeRoomInstanceId } of overflow) {
      const room = rooms.find((candidate) => (remaining.get(candidate.id) ?? 0) > 0);
      const priorHomeCompatible = priorHomeRoomInstanceId !== null &&
        (rooms.some((candidate) => candidate.id === priorHomeRoomInstanceId) ||
          roleId === "staff.imaging_technician" &&
          state.rooms.some((candidate) => candidate.id === priorHomeRoomInstanceId));
      employee.homeRoomInstanceId = room?.id ?? (priorHomeCompatible ? priorHomeRoomInstanceId : null);
      if (room) remaining.set(room.id, (remaining.get(room.id) ?? 0) - 1);
    }
  }
}

/** Keeps idle shared imaging technicians in distinct rooms not currently being used by another tech. */
export function reconcileImagingIdleSeats(state: GameState): void {
  const imagingRooms = eligibleRooms(state, "staff.imaging_technician");
  // A supplied future context can introduce a modality before this release's
  // capacity catalog knows its room ID. Preserve that valid saved assignment.
  if (imagingRooms.length === 0) return;
  const activeRoomIds = new Set<string>();
  const activeEmployeeIds = new Set<string>();
  for (const operation of state.serviceOperations) {
    if (operation.status === "completed" || operation.status === "cancelled") continue;
    const hasImagingTech = operation.reservedEmployeeIds.some((id) =>
      state.employees.some((employee) => employee.id === id && employee.staffRoleDefinitionId === "staff.imaging_technician"),
    );
    if (hasImagingTech) {
      operation.reservedRoomInstanceIds.forEach((id) => activeRoomIds.add(id));
      operation.reservedEmployeeIds.forEach((id) => activeEmployeeIds.add(id));
    }
  }
  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (pending?.deliveredAtTick === null && pending.imagingTechnicianId && pending.patientTravel) {
      activeRoomIds.add(pending.patientTravel.destinationRoomInstanceId);
      activeEmployeeIds.add(pending.imagingTechnicianId);
    }
  }
  const available = imagingRooms.filter((room) => !activeRoomIds.has(room.id));
  const used = new Set<string>();
  for (const employee of state.employees
    .filter((candidate) => candidate.staffRoleDefinitionId === "staff.imaging_technician" &&
      !candidate.facilityTask && !activeEmployeeIds.has(candidate.id))
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const currentAvailable = available.some((room) => room.id === employee.homeRoomInstanceId) &&
      !used.has(employee.homeRoomInstanceId!);
    if (!currentAvailable) {
      employee.homeRoomInstanceId = available.find((room) => !used.has(room.id))?.id ?? null;
    }
    if (employee.homeRoomInstanceId) used.add(employee.homeRoomInstanceId);
  }
}

function projectedDismissals(state: GameState, roomId: string): EmployeeState[] {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  if (!room) return [];
  const imagingRoom = room.roomDefinitionId === "room.ultrasound" ||
    room.roomDefinitionId === "room.xray" || room.roomDefinitionId === "room.ct";
  if (imagingRoom) {
    const technicians = state.employees
      .filter((employee) => employee.staffRoleDefinitionId === "staff.imaging_technician")
      .sort((left, right) => left.id.localeCompare(right.id));
    const remainingCapacity = eligibleRooms(state, "staff.imaging_technician", roomId).length;
    const excess = Math.max(0, technicians.length - remainingCapacity);
    if (excess === 0) return [];
    return deterministicShuffle(
      technicians,
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `room-sale-layoff:${roomId}:${state.facilityTick}:v1`,
    ).slice(0, excess);
  }
  return state.employees
    .filter((employee) => employee.homeRoomInstanceId === roomId)
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function getRoomSalePreview(
  state: GameState,
  roomId: string,
  context: DomainContext,
): RoomSalePreview | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  if (!room || !context.balanceRelease.facility.roomDefinitions.some(
    (definition) => definition.id === room.roomDefinitionId,
  )) return null;
  const dismissedEmployees = projectedDismissals(state, roomId).map((employee) => ({
    id: employee.id,
    displayName: employee.displayName,
    staffRoleDefinitionId: employee.staffRoleDefinitionId,
  }));
  const identity = dismissedEmployees.map((employee) => employee.id).join(",");
  return {
    roomId,
    roomDefinitionId: room.roomDefinitionId,
    dismissedEmployees,
    confirmationToken: `${roomId}|${state.facilityTick}|${identity}`,
  };
}

export function getAvailableEmployeeHomeRoom(
  state: GameState,
  roleId: string,
): PlacedRoom | null {
  const capacity = getRoomStaffCapacity(state, roleId);
  const counts = new Map<string, number>();
  for (const employee of state.employees.filter((candidate) => candidate.staffRoleDefinitionId === roleId)) {
    if (employee.homeRoomInstanceId) counts.set(employee.homeRoomInstanceId, (counts.get(employee.homeRoomInstanceId) ?? 0) + 1);
  }
  return eligibleRooms(state, roleId).find(
    (room) => (counts.get(room.id) ?? 0) < (capacity.slotsByRoomInstanceId[room.id] ?? 0),
  ) ?? null;
}

export function getConfiguredStaffRoleIds(): string[] {
  return Object.keys(STAFF_SLOTS);
}
