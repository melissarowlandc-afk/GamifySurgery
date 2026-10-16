import { APPROVED_PROCEDURE_STAFF_SPOTS, APPROVED_ROOM_NAVIGATION_CONTRACTS, type RoomDefinition } from "@gamify-surgery/balance-config";
import { getDoorCells } from "./doors";
import { isEmployeeAwayForTraining } from "./employee-training";
import { rotateRoomLocalPoint } from "./spatial";
import type { DomainContext, DoorState, EmployeeState, GameState, GridPoint, PlacedRoom } from "./types";

export function isProceduralSpecialistRole(roleId: string): boolean {
  return roleId === "staff.endoscopist" || roleId === "staff.surgeon";
}

/** Idle travel/shopping is preemptible. Training and an unobserved release
 * cannot promise a short wait. Existing accepted care keeps its reservations.
 */
export function getProceduralSpecialistReadyAt(state: GameState, employee: EmployeeState, context: DomainContext): number {
  if (isEmployeeAwayForTraining(employee)) return Number.POSITIVE_INFINITY;
  let ready = state.facilityTick;
  let trackedTask = false;
  for (const operation of state.serviceOperations) {
    if (operation.status === "completed" || operation.status === "cancelled" ||
        !(operation.reservedEmployeeIds.includes(employee.id) || operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id)) continue;
    trackedTask ||= employee.facilityTask?.targetId === operation.id;
    if (operation.status !== "in_service" || operation.phaseEndsAtFacilityTick === null) return Number.POSITIVE_INFINITY;
    ready = Math.max(ready, operation.phaseEndsAtFacilityTick);
  }
  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (!pending || pending.deliveredAtTick !== null || pending.providerReservation?.kind !== "employee" || pending.providerReservation.employeeId !== employee.id) continue;
    const ends = pending.timingPhases?.filter((phase) => phase.resourceBound).at(-1)?.endsAtTick ?? pending.patientTravel?.serviceCompletionTick ?? pending.dueTick;
    const feedbackPending = encounter.steps[pending.originatingNodeIndex]?.status === "feedback_pending";
    if (ends <= state.facilityTick && !feedbackPending) continue;
    if (ends <= state.facilityTick) return Number.POSITIVE_INFINITY;
    trackedTask ||= employee.facilityTask?.targetId === pending.operationId;
    ready = Math.max(ready, ends);
  }
  const task = employee.facilityTask;
  if (task && !trackedTask) {
    if (!Number.isFinite(task.workMinutesRemaining) || task.workMinutesRemaining >= Number.MAX_SAFE_INTEGER) return Number.POSITIVE_INFINITY;
    const walking = Math.ceil(Math.max(0, employee.path.length - 1 - employee.pathIndex) / context.balanceRelease.facility.characterTravelTilesPerTick);
    ready = Math.max(ready, state.facilityTick + walking + Math.max(0, task.workMinutesRemaining));
  }
  return ready;
}

/** Door-free endpoints on the appropriate side of the approved table. Custom
 * layouts keep their own authored anchors; no save fields or paths are added.
 */
export function getProcedureStaffStandingSpots(room: PlacedRoom, definition: RoomDefinition, doors: readonly DoorState[], actor: "provider" | "nurse") {
  if (!usesApprovedProcedureStaffSpots(room, definition)) return [];
  const thresholds = doors.filter((door) => door.roomId === room.id).map((door) => getDoorCells(door, room, definition)?.inside);
  return (APPROVED_PROCEDURE_STAFF_SPOTS[room.roomDefinitionId] ?? []).filter((spot) => spot.actor === actor).flatMap((spot) => {
    if (definition.navigation?.blockedTiles.some((tile) => tile.x === spot.anchor.x && tile.y === spot.anchor.y)) return [];
    const local = rotateRoomLocalPoint(spot.anchor, definition, room.orientation);
    const anchor = { x: room.x + local.x, y: room.y + local.y };
    return thresholds.some((tile) => tile?.x === anchor.x && tile.y === anchor.y) ? [] : [{ ...spot, anchor }];
  });
}

export function usesApprovedProcedureStaffSpots(room: PlacedRoom, definition: RoomDefinition): boolean {
  const contract = APPROVED_ROOM_NAVIGATION_CONTRACTS[room.roomDefinitionId];
  const clinician = definition.navigation?.clinicianCareAnchor;
  return Boolean(APPROVED_PROCEDURE_STAFF_SPOTS[room.roomDefinitionId] && contract &&
    definition.width === contract.width && definition.height === contract.height && clinician &&
    clinician.x === contract.clinicianCareAnchor?.x && clinician.y === contract.clinicianCareAnchor?.y);
}

export function getProcedureStaffSupportId(room: PlacedRoom, definition: RoomDefinition, location: GridPoint, actor: "provider" | "nurse"): string | undefined {
  return getProcedureStaffStandingSpots(room, definition, [], actor).find((spot) => spot.anchor.x === location.x && spot.anchor.y === location.y)?.id;
}
