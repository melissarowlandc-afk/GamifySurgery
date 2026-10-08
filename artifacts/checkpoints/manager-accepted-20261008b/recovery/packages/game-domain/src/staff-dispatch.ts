import type { DiagnosticOrderPlan, DiagnosticResourceChoice, EmployeeState, GameState } from "./types";

/** Home assignments are dispatch preferences, never a replacement for routing. */
export function compareStaffHomePreference(left: EmployeeState, right: EmployeeState, roomId: string): number {
  return Number(right.homeRoomInstanceId === roomId) - Number(left.homeRoomInstanceId === roomId);
}

export function staffHomeMismatchCount(state: GameState, resource: DiagnosticResourceChoice): number {
  const ids = [...resource.employeeIds, ...(resource.provider?.kind === "employee" ? [resource.provider.employeeId] : [])];
  return ids.reduce((count, id) => count + Number(state.employees.find(employee => employee.id === id)?.homeRoomInstanceId !== resource.roomInstanceId), 0);
}

/** Do not lend an idle employee whose accepted home work is waiting to start.
 * Already frozen assignments keep their existing queue and save contract.
 */
export function hasQueuedHomeRoomWork(state: GameState, employee: EmployeeState, excludedOperationId?: string): boolean {
  if (!employee.homeRoomInstanceId) return false;
  const excluded = state.serviceOperations.find(operation => operation.id === excludedOperationId);
  const excludedOrderId = excluded?.diagnosticPhysicalWork?.orderId ?? excluded?.diagnosticPhaseWork?.orderId ?? excludedOperationId;
  const usesHomeStaff = (resource: DiagnosticResourceChoice | null | undefined) => Boolean(resource &&
    resource.roomInstanceId === employee.homeRoomInstanceId &&
    (resource.employeeIds.includes(employee.id) || resource.provider?.kind === "employee" && resource.provider.employeeId === employee.id));
  for (const operation of state.serviceOperations) {
    if (operation.id === excludedOperationId || !["arriving", "waiting_for_resources", "waiting_for_next_phase"].includes(operation.status)) continue;
    if (usesHomeStaff(operation.diagnosticPhaseWork?.resource) || operation.diagnosticPhysicalWork?.phaseBindings
      .slice(operation.phaseIndex).some(binding => usesHomeStaff(binding.resource))) return true;
  }
  for (const encounter of Object.values(state.encounters)) {
    const plans: (DiagnosticOrderPlan | null | undefined)[] = [encounter.pendingResult?.diagnosticTiming, encounter.terminalTestOrder?.diagnosticTiming,
      encounter.testOnlyContinuation?.diagnosticTiming, encounter.stagedResultOrder?.diagnosticTiming,
      encounter.stagedResultOrder?.remainder.diagnosticTiming, ...(encounter.stagedResultOrder?.components.map(component => component.diagnosticTiming) ?? [])];
    if (plans.some(plan => plan && plan.orderId !== excludedOrderId && plan.phases.some(phase => phase.status !== "completed" &&
      phase.serviceOperationId !== excludedOperationId && usesHomeStaff(phase.resource)))) return true;
  }
  return false;
}
