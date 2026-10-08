import { getRoomDefinition, getStaffRoleDefinition, createGuidanceTipsState, TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID,
  type GameState, type EmployeeState, type DiagnosticOrderPlan, type DiagnosticOrderPhase, type ServiceOperationState, type EmployeeDiscussionState } from "../src";
import { timingFixture, pending } from "./diagnostic-timing-fixtures";

/** Existing content, open geometry and actual catalog resources; no new cases. */
export function tipsFixture() {
  const fixture = timingFixture();
  const { state, context, encounter, addRoom } = fixture;
  state.facilityTick = 1500; state.cash = 50_000; state.cashCents = 5_000_000; state.paused = false;
  state.nextFinancialPostingTick = 1515; state.clinicalXp = 500;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = true; state.serviceOperations = []; state.environment.litterItems = [];
  state.environment.founderActivity = null; state.environment.waterCoolerFillPercent = 100;
  state.environment.coffeeMoraleAppliedDayNumber = 0;
  state.alertHumor.guidanceTips = createGuidanceTipsState(0); state.alertHumor.lastPatientArrivalTick = 1500;
  state.alertHumor.guidanceTips.introductoryCompletedAtTick = 0;
  encounter.lifecycle = "waiting_unopened"; encounter.resolutionReason = null; encounter.checkInStatus = "checked_in";
  encounter.patientSatisfaction = 100; encounter.walkoutThreshold = 5; encounter.patientMovement = null;
  encounter.idleWaitingSinceTick = 0; encounter.waitingDestination = { roomInstanceId: null, location: { x: 4, y: 77 }, kind: "standing" };
  encounter.patientLocation = { x: 4, y: 77 }; encounter.assignedRoomInstanceId = null; encounter.waiting.patienceExempt = false;
  for (const id of [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID]) state.encounters[id] = {
    ...structuredClone(encounter), id, lifecycle: "resolved", resolutionReason: "completed", resolvedAtFacilityTick: 0,
    finalPatientSatisfaction: 100, patientLocation: null, pendingResult: null,
  };
  const employee = (roleId = "staff.receptionist", homeId = state.rooms[0]!.id): EmployeeState => {
    const room = state.rooms.find((room) => room.id === homeId)!;
    const role = getStaffRoleDefinition(roleId, context)!;
    const location = { x: room.x + 1, y: room.y + 1 };
    const entry: EmployeeState = { id: `${roleId}.${state.employees.length}`, staffRoleDefinitionId: roleId, displayName: "Alex", appearance: state.founder.appearance,
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: role.salaryPerExpenseInterval, morale: 80, trainingLevel: 1, homeRoomInstanceId: homeId,
      location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 99999, facilityTask: null };
    state.employees.push(entry); return entry;
  };
  const roomAndStaff = (roomId: string, roleId: string, count = 1) => {
    const result = addRoom(roomId);
    const staff = Array.from({ length: count }, () => employee(roleId, result.room.id));
    return { ...result, staff };
  };
  const diagnostic = (kind: DiagnosticOrderPhase["kind"], roomId: string, roles: string[], mode: "local" | "external" = "local") => {
    const phase: DiagnosticOrderPhase = { id: "phase.tip", componentId: null, kind, mode, patientPresent: false, durationMinutes: 10,
      dependsOn: [], requirement: mode === "local" ? { roomDefinitionId: roomId, staffRoleDefinitionIds: roles, providerRoleDefinitionIds: [], founderEligible: false, stationKind: roomId === "room.reading" ? "reading" : null } : null,
      resource: null, forecast: { readyAtTick: 0, startsAtTick: 1510, endsAtTick: 1520, queueMinutes: 10, walkingMinutes: 0, patientPath: [], employeePaths: [], founderPath: [], tilesPerTick: 1 },
      status: "queued", remainingMinutes: 10, startedAtTick: null, completedAtTick: null, serviceOperationId: null, operationPhaseId: null };
    const milestone = { afterPhaseIds: [phase.id], forecastAtTick: 1520, reachedAtTick: null };
    const plan: DiagnosticOrderPlan = { version: "diagnostic-order.v1", timingVersion: "diagnostic-timing.v1", orderId: "tip.order", encounterId: encounter.id,
      createdAtTick: 0, execution: "supported", sources: [], phases: [phase], resultReady: milestone, careComplete: milestone, visualResultReady: null };
    encounter.pendingResult = pending(plan); encounter.lifecycle = "active_pending_result"; encounter.idleWaitingSinceTick = null;
    encounter.patientLocation = null; return { phase, plan };
  };
  const service = (roomId: string, roles: string[], status: ServiceOperationState["status"] = "waiting_for_resources", id = "tip.service") => {
    const operation: ServiceOperationState = { id, incomeLineId: "income.laboratory_processing", catalogVersion: 1, actorKind: "remote", actorId: id, displayName: "Existing work", appearance: null,
      status, createdAtFacilityTick: 0, waitDeadlineFacilityTick: 3000, startedAtFacilityTick: status === "in_service" ? 0 : null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
      quoteFee: 80, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: null, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
      frozenOperationPhases: [{ id: "service.phase", roomDefinitionId: roomId, durationMinutes: 10, staffRoleDefinitionIds: roles, founderEligible: true }] };
    state.serviceOperations.push(operation); return operation;
  };
  const discussion = (participant: EmployeeState) => {
    const entry: EmployeeDiscussionState = { id: "discussion.tip", clinicalReleaseId: state.clinicalReleaseId,
      frozenCase: structuredClone(encounter.frozenCase), employeeId: participant.id, employeeDisplayName: participant.displayName,
      employeeAppearance: participant.appearance, lifecycle: "active_action_required", createdAtFacilityTick: 0, firstOpenedAtTick: 100,
      resolvedAtFacilityTick: null, cancellationReason: null, currentNodeIndex: 0, answers: [], steps: [] };
    state.employeeDiscussions = { [entry.id]: entry }; return entry;
  };
  return { ...fixture, employee, roomAndStaff, diagnostic, service, discussion };
}
export type TipsFixture = ReturnType<typeof tipsFixture>;

export function addLitter(state: GameState) {
  state.environment.litterItems.push({ id: "tip.litter", roomId: state.rooms[0]!.id, location: { ...state.environment.founderLocation }, spawnedAtFacilityTick: 0 });
}
