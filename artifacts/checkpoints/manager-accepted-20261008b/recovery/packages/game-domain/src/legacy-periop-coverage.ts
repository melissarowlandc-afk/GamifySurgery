import type { GameState } from "./types";

/** Legacy pre/post phases already count as attended. They retain their frozen
 * timers and installed-room requirements, but no longer depend on an indefinite
 * room-wide employee duty. Release before movement/dispatch/training, including
 * the decremented MAX_SAFE_INTEGER sentinel found in older campaign saves.
 */
export function releaseLegacyPeriopCoverage(state: GameState): void {
  for (const employee of state.employees) {
    const task = employee.facilityTask;
    if (!task) continue;
    const sentinel = !Number.isFinite(task.workMinutesRemaining) ||
      task.workMinutesRemaining >= Number.MAX_SAFE_INTEGER - Math.max(0, state.facilityTick - task.startedAtFacilityTick);
    const roomCoverage = employee.staffRoleDefinitionId === "staff.periop_nurse" && task.kind === "perform_service" && sentinel &&
      (!task.targetId || state.rooms.some((room) => room.id === task.targetId && room.roomDefinitionId === "room.periop_recovery")) &&
      !state.serviceOperations.some((operation) => operation.status !== "completed" && operation.status !== "cancelled" &&
        (operation.id === task.targetId || operation.reservedEmployeeIds.includes(employee.id) ||
          operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id));
    if (task.kind !== "cover_periop" && !roomCoverage) continue;
    employee.facilityTask = null;
    employee.path = [{ ...employee.location }];
    employee.pathIndex = 0;
  }
}
