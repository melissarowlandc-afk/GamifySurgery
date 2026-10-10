import {
  GUIDANCE_TIP_CATALOG, GUIDANCE_TIP_POLICY, SERVICE_INCOME_CATALOG,
  PROTOTYPE_ALERT_SCHEDULING,
  getCurrentRoomUpgradeDefinition, getRoomUpgradePerPurchaseLabel, getServiceIncomeLine,
  type GuidanceTipId,
} from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID } from "./context";
import {
  getRoomDefinition, getStaffRoleDefinition, isEmployeeAssignedToOperationalRoom,
  isRoomOperationalForFacilityWork, isRoomAccessibleForFacilityWork,
  getNextRoomUpgradeCost, getCurrentQuestion, getEmployeeDiscussionBlockedReason,
  getFacilityProgressionStatus, getWorkloadSnapshot, getEmergencyGlp1Status,
  isEmployeeOperational, getCurrentCapabilities,
} from "./selectors";
import { getDiagnosticOrderPlans } from "./diagnostic-timing";
import { getEmployeeTrainingQuote, getEmployeeTrainingRole } from "./employee-training";
import { getEffectiveEmployeeMorale } from "./staff";
import { getAvailableEmployeeHomeRoom, getRoomStaffCapacity } from "./room-capacity";
import { getRoomCareStations, getRoomWaitingAnchors, getRoomNavigationAnchor, getRotatedFootprint } from "./spatial";
import { findCareAwareFacilityPath } from "./care-room-access";
import { hasAutoTrashCoverage, hasAutoWaterCoverage, getWaterCoolerApproachLocation } from "./facility-automation";
import { patientDepartureRiskIsActive, upcomingOperatingPostingIsUnderfunded } from "./departure-risk-alerts";
import { getRoutinePatientAvailability } from "./routine-patient-availability";
import { getFunctionalScheduledEndoscopyCapacity, getFunctionalScheduledAmbulatoryOperationCapacity } from "./service-operations";
import { progressionMetricGuidance, progressionRemedyHasLiveCondition } from "./guidance-progression";
import type { DomainContext, GameState, EmployeeState, DiagnosticResourceRequirement, DiagnosticOrderPhase, PlacedRoom } from "./types";
import type { GuidanceTipAction, GuidanceTipCandidate, GuidanceTipsState } from "./guidance-tip-types";
import { guidanceTopicsForTip, recordGuidanceTopicExposure } from "./guidance-topics";

const moneyFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value: number) => `$${moneyFormatter.format(value)}`;
const ongoing = (status: string) => !["completed", "cancelled", "abandoned"].includes(status);
const keyPoint = (point: { x: number; y: number }) => `${point.x},${point.y}`;

export function createGuidanceTipsState(tick: number): GuidanceTipsState {
  return { version: "guidance-tips.v1", initializedAtTick: tick, introductoryCompletedAtTick: null,
    eligibleSince: {}, lastEmittedById: {}, lastEmittedByFamily: {}, emissionCounts: {},
    rollingEmissionTicks: [], lastEmittedAtTick: null, lastDireAtTick: null, observations: {},
    rootLocks: {}, taughtServiceSetups: [], sequence: 0, history: [] };
}

export function guidanceIntroductoryEncountersComplete(state: GameState): boolean {
  return state.facilityLevel >= 1 || [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].every((id) =>
    state.encounters[id]?.lifecycle === "resolved" && state.encounters[id]?.resolutionReason === "completed");
}

/** Care-aware Founder availability, also repeated by the normal command. */
export function guidanceFounderIsFree(state: GameState): boolean {
  if (state.environment.pendingFounderConsult || state.openEmployeeDiscussionId ||
    state.openChartEncounterId && getCurrentQuestion(state, state.openChartEncounterId)) return false;
  const activity = state.environment.founderActivity;
  if (activity && !["walk_to_point", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(activity.kind)) return false;
  return !state.serviceOperations.some((operation) => ongoing(operation.status) && operation.providerReservation?.kind === "founder") &&
    !Object.values(state.encounters).some((encounter) => encounter.pendingResult?.deliveredAtTick === null && encounter.pendingResult.providerReservation?.kind === "founder");
}

function waitingPatients(state: GameState) {
  return Object.values(state.encounters).filter((encounter) => encounter.resolutionReason === null &&
    ["waiting_unopened", "active_action_required"].includes(encounter.lifecycle) && encounter.checkInStatus === "checked_in" &&
    encounter.patientLocation && encounter.waitingDestination && encounter.idleWaitingSinceTick !== null &&
    (!encounter.patientMovement || encounter.patientMovement.kind === "idle_within_room"));
}

function latestEvent(state: GameState, types: string[], target?: string): number | null {
  return state.events.reduce<number | null>((latest, event) => types.includes(event.type) &&
    (!target || event.target?.id === target || event.encounterId === target)
    ? Math.max(latest ?? 0, event.facilityTick) : latest, null);
}

function newest(...ticks: (number | null | undefined)[]): number | null {
  const valid = ticks.filter((tick): tick is number => typeof tick === "number");
  return valid.length ? Math.max(...valid) : null;
}

function employeeWelfareFix(state: GameState, employee: EmployeeState, context: DomainContext): number | null {
  const coffee = state.environment.coffeeMoraleAppliedDayNumber;
  const clock = context.balanceRelease.clock;
  return newest(employee.hiredAtFacilityTick, employee.lastPraisedAtFacilityTick, employee.lastBreakAtFacilityTick,
    latestEvent(state, ["staff_salary_changed", "employee_praised"], employee.id),
    coffee > 0 ? (coffee - 1) * (clock.dayEndHour - clock.dayStartHour) * 60 : null);
}

function optionalPurchaseAllowed(state: GameState, cost: number, context: DomainContext): boolean {
  const cashCents = state.cashCents - Math.round(cost * 100);
  return cashCents >= context.balanceRelease.emergencyGlp1.lowCashAlertThreshold * 100 &&
    !upcomingOperatingPostingIsUnderfunded({ ...state, cash: cashCents / 100, cashCents }, context);
}

interface Remedy { action?: GuidanceTipAction; actionLabel?: string; fix: string; rootKey: string; lastFixTick: number | null }

/** Select an actual dependency first; no detached "Build" link loses its room. */
function placeRemedy(state: GameState, requestedId: string, context: DomainContext, optional = false): Remedy | null {
  const requested = getRoomDefinition(requestedId, context);
  if (!requested) return null;
  const missing = requested.requiredRoomDefinitionIds.find((id) => !state.rooms.some((room) => room.roomDefinitionId === id));
  if (missing) return placeRemedy(state, missing, context, optional);
  if (!requested.buildable || requested.unlockFacilityLevel > state.facilityLevel || state.cash < requested.constructionCost ||
    requested.maximumInstances !== null && state.rooms.filter((room) => room.roomDefinitionId === requested.id).length >= requested.maximumInstances ||
    optional && !optionalPurchaseAllowed(state, requested.constructionCost, context)) return null;
  return { action: { kind: "place_room", definitionId: requested.id, expectedCost: requested.constructionCost },
    actionLabel: `Place ${requested.displayName} · ${money(requested.constructionCost)} (+${money(requested.upkeepPerExpenseInterval)}/hour)`,
    fix: `Build ${requested.displayName}`, rootKey: `setup:${requested.id}`,
    lastFixTick: newest(...state.rooms.filter((room) => room.roomDefinitionId === requested.id).map((room) => latestEvent(state, ["room_placed", "room_sold", "room_moved", "door_placed", "door_removed"], room.id))) };
}

function accessRemedy(state: GameState, room: PlacedRoom, context: DomainContext): Remedy | null {
  if (getRoomDefinition(room.roomDefinitionId, context)?.requiredRoomDefinitionIds.some((id) => !state.rooms.some((candidate) => candidate.roomDefinitionId === id))) return null;
  if (room.maintenance?.status === "out_of_service" || isRoomAccessibleForFacilityWork(state, room.id, context)) return null;
  const name = getRoomDefinition(room.roomDefinitionId, context)?.displayName ?? room.roomDefinitionId;
  return { action: { kind: "restore_access", roomId: room.id }, actionLabel: `Fix ${name} access`, fix: `Restore ${name} access`,
    rootKey: `room:${room.id}`, lastFixTick: latestEvent(state, ["room_placed", "room_moved", "room_rotated", "door_placed", "door_removed"], room.id) };
}

function hireRemedy(state: GameState, roleId: string, context: DomainContext, optional = false, capacity = false): Remedy | null {
  const role = getStaffRoleDefinition(roleId, context);
  const employed = state.employees.filter((employee) => employee.staffRoleDefinitionId === roleId);
  if (!role || role.unlockFacilityLevel > state.facilityLevel || state.cash < role.hiringCost ||
    employed.length >= role.maximumEmployees || employed.length >= getRoomStaffCapacity(state, roleId).capacity ||
    !capacity && employed.length > 0 || optional && !optionalPurchaseAllowed(state, role.hiringCost, context)) return null;
  const home = getAvailableEmployeeHomeRoom(state, roleId);
  if (!home || !isRoomOperationalForFacilityWork(state, home.id, context)) return null;
  return { action: { kind: "hire_staff", roleId, expectedCost: role.hiringCost, requiresMissingCoverage: !capacity },
    actionLabel: `Hire ${role.displayName} · ${money(role.hiringCost)} (+${money(role.salaryPerExpenseInterval)}/hour)`,
    fix: `Hire ${role.displayName}`, rootKey: `setup:${home.roomDefinitionId}`,
    lastFixTick: newest(...employed.map((employee) => employee.hiredAtFacilityTick), latestEvent(state, ["room_placed", "room_moved", "door_placed"], home.id)) };
}

function missingSetupRemedy(state: GameState, requirement: DiagnosticResourceRequirement, context: DomainContext, optional = false): Remedy | null {
  const rooms = state.rooms.filter((room) => room.roomDefinitionId === requirement.roomDefinitionId);
  const missingSupport = getRoomDefinition(requirement.roomDefinitionId, context)?.requiredRoomDefinitionIds.find((id) => !state.rooms.some((room) => room.roomDefinitionId === id));
  if (missingSupport) return placeRemedy(state, missingSupport, context, optional);
  const operational = rooms.filter((room) => isRoomOperationalForFacilityWork(state, room.id, context));
  if (!operational.length) return rooms.length ? accessRemedy(state, rooms[0]!, context) : placeRemedy(state, requirement.roomDefinitionId, context, optional);
  const installed = (roleId: string) => state.employees.some((employee) => employee.staffRoleDefinitionId === roleId &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
    (!["staff.radiologist", "staff.phlebotomist", "staff.laboratory_technician"].includes(roleId) || operational.some((room) => room.id === employee.homeRoomInstanceId)));
  const missing = requirement.staffRoleDefinitionIds.find((id) => !installed(id)) ??
    (!requirement.founderEligible && requirement.providerRoleDefinitionIds.length && !requirement.providerRoleDefinitionIds.some(installed) ? requirement.providerRoleDefinitionIds[0] : undefined);
  if (!missing) return null;
  const existing = state.employees.find((employee) => employee.staffRoleDefinitionId === missing);
  const home = existing?.homeRoomInstanceId ? state.rooms.find((room) => room.id === existing.homeRoomInstanceId) : null;
  return home ? accessRemedy(state, home, context) : hireRemedy(state, missing, context, optional);
}

function installedSetup(state: GameState, required: DiagnosticResourceRequirement, context: DomainContext): boolean {
  const rooms = state.rooms.filter((room) => room.roomDefinitionId === required.roomDefinitionId && isRoomOperationalForFacilityWork(state, room.id, context));
  const installed = (role: string) => state.employees.some((employee) => employee.staffRoleDefinitionId === role &&
    isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
    (!["staff.radiologist", "staff.phlebotomist", "staff.laboratory_technician"].includes(role) || rooms.some((room) => room.id === employee.homeRoomInstanceId)));
  return rooms.length > 0 && required.staffRoleDefinitionIds.every(installed) &&
    (required.founderEligible || !required.providerRoleDefinitionIds.length || required.providerRoleDefinitionIds.some(installed));
}

function requirement(roomDefinitionId: string, roles: string[] = [], founderEligible = false): DiagnosticResourceRequirement {
  return { roomDefinitionId, staffRoleDefinitionIds: roles, providerRoleDefinitionIds: [], founderEligible, stationKind: null };
}

/** Actual accepted demand; a forecast alone never implies a missing resource. */
function demand(state: GameState) {
  const diagnostic = getDiagnosticOrderPlans(state).filter((plan) => plan.execution === "supported" &&
    state.encounters[plan.encounterId]?.resolutionReason === null).flatMap((plan) => plan.phases.filter((phase) => ongoing(phase.status)).map((phase) => ({
      phase, plan, ready: phase.dependsOn.every((id) => plan.phases.find((other) => other.id === id)?.status === "completed"),
    })));
  const services = state.serviceOperations.filter((operation) => ongoing(operation.status)).flatMap((operation) => {
    const phases = operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? [];
    const phase = phases[operation.phaseIndex + (operation.status === "waiting_for_next_phase" ? 1 : 0)];
    return phase?.roomDefinitionId ? [{ operation, phase,
      queued: ["waiting_for_resources", "waiting_for_next_phase"].includes(operation.status) &&
        (operation.nextPhaseReadyAtFacilityTick == null || operation.nextPhaseReadyAtFacilityTick <= state.facilityTick) }] : [];
  });
  return { diagnostic, services };
}

/** Pure catalog predicates. Delivery clocks are handled separately below. */
export function evaluateGuidanceTipCandidates(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
  asOfRealMs = state.createdAtRealMs + state.facilityTick * 60_000): GuidanceTipCandidate[] {
  const candidates: GuidanceTipCandidate[] = [];
  const W = waitingPatients(state);
  const work = demand(state);
  const serviceIsFor = (operation: GameState["serviceOperations"][number], roomId: string) =>
    (operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? []).some((phase) => phase.roomDefinitionId === roomId);
  // Predicates share one unchanged snapshot. Reuse eligibility within this
  // evaluation only; edits, movement and timers are rechecked on the next call.
  const installedByRole = new Map<string, EmployeeState[]>();
  const builtByDefinition = new Map<string, PlacedRoom[]>();
  const operationalByDefinition = new Map<string, PlacedRoom[]>();
  const installed = (id: string) => {
    let matches = installedByRole.get(id);
    if (!matches) {
      matches = state.employees.filter((employee) => employee.staffRoleDefinitionId === id && isEmployeeAssignedToOperationalRoom(state, employee.id, context));
      installedByRole.set(id, matches);
    }
    return matches;
  };
  const built = (id: string) => {
    let matches = builtByDefinition.get(id);
    if (!matches) {
      matches = state.rooms.filter((room) => room.roomDefinitionId === id);
      builtByDefinition.set(id, matches);
    }
    return matches;
  };
  const R = (id: string) => {
    let matches = operationalByDefinition.get(id);
    if (!matches) {
      matches = built(id).filter((room) => isRoomOperationalForFacilityWork(state, room.id, context));
      operationalByDefinition.set(id, matches);
    }
    return matches;
  };
  let cachedProgression: ReturnType<typeof getFacilityProgressionStatus> | undefined;
  const progressionStatus = () => cachedProgression ??= getFacilityProgressionStatus(state, context);
  const dirty = state.rooms.filter((room) => room.roomDefinitionId !== "room.hallway" && (room.cleanliness ?? 100) < context.balanceRelease.environment.evsRoomCleanlinessThreshold && isRoomOperationalForFacilityWork(state, room.id, context));
  const liveRoleWork = (roleId: string) => work.services.some(({ phase, operation, queued }) =>
    (queued || operation.status === "in_service") && (phase.staffRoleDefinitionIds.includes(roleId) || phase.providerRoleDefinitionIds?.includes(roleId))) ||
    work.diagnostic.some(({ phase, ready }) => ready && phase.mode === "local" && phase.durationMinutes > 0 &&
      (phase.status === "active" || phase.forecast.queueMinutes > 0) &&
      (phase.requirement?.staffRoleDefinitionIds.includes(roleId) || phase.requirement?.providerRoleDefinitionIds.includes(roleId)));
  const roleActivity = (roleId: string) => roleId === "staff.receptionist" ? W.length > 0 :
    roleId === "staff.glp1_np" ? state.environment.glp1AutomationSlots.some((slot) => installed(roleId).some((employee) => employee.id === slot.employeeId)) :
    roleId === "staff.pharmacist" ? state.retailOperations.some((operation) => ongoing(operation.status) && operation.incomeLineId.includes("pharmacy")) :
    roleId === "staff.evs_worker" ? dirty.length > 0 || installed(roleId).some((employee) => employee.facilityTask?.kind === "clean_room") :
    roleId === "staff.repair_person" ? state.rooms.some((room) => ["due", "out_of_service"].includes(room.maintenance?.status ?? "")) || installed(roleId).some((employee) => employee.facilityTask?.kind === "repair_room") :
    roleId === "staff.surgeon" ? liveRoleWork(roleId) || (state.levelThreeQiReviews ?? []).some((review) => review.status !== "completed") : liveRoleWork(roleId);
  const add = (id: GuidanceTipId, targetKey: string, remedy: Remedy | null, options: { values?: Record<string, string>; speaker?: string; rootKey?: string; priority?: 0 | 1 | 2; optional?: boolean; lastFixTick?: number | null } = {}): void => {
    const definition = GUIDANCE_TIP_CATALOG.find((entry) => entry.id === id)!;
    if (!remedy || state.facilityLevel < definition.minimumLevel) return;
    if (id !== "tip.access.restore" && remedy.action?.kind === "restore_access") {
      const roomId = remedy.action.roomId;
      const room = state.rooms.find((entry) => entry.id === roomId);
      const name = room && getRoomDefinition(room.roomDefinitionId, context)?.displayName;
      add("tip.access.restore", roomId, remedy, { speaker: name ?? "Front Desk", values: { room: name ?? "Room" } });
      return;
    }
    const lastFixTick = newest(remedy.lastFixTick, options.lastFixTick);
    if (lastFixTick !== null && state.facilityTick - lastFixTick < GUIDANCE_TIP_POLICY.recentFixMinutes) return;
    candidates.push({ id, targetKey, rootKey: options.rootKey ?? remedy.rootKey, priority: options.priority ?? 0,
      values: { fix: remedy.fix, ...options.values }, speaker: options.speaker ?? "Front Desk",
      action: remedy.action, actionLabel: remedy.actionLabel, optional: options.optional ?? false, lastFixTick });
  };
  const simple = (action: GuidanceTipAction, label: string, rootKey: string): Remedy => ({ action, actionLabel: label, fix: label, rootKey, lastFixTick: null });
  const training = (id: GuidanceTipId, roleId: string) => {
    for (const employee of installed(roleId).filter((employee) => roleActivity(roleId)).sort((a, b) => a.trainingLevel - b.trainingLevel || a.id.localeCompare(b.id))) {
      const quote = getEmployeeTrainingQuote(state, employee.id, context);
      if (employee.training || employee.trainingLevel >= 5 || !quote.canTrain || quote.cost === null || !optionalPurchaseAllowed(state, quote.cost, context)) continue;
      // A paid request normally queues behind work. Preserve the sole worker
      // holding present patient care, and repairs restoring blocked care.
      const soleUrgent = installed(roleId).length === 1 && (work.services.some(({ operation }) =>
        (operation.reservedEmployeeIds.includes(employee.id) || operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === employee.id) &&
        operation.status === "in_service" && operation.actorKind !== "remote") || work.diagnostic.some(({ phase }) =>
          phase.status === "active" && phase.patientPresent && phase.resource?.employeeIds.includes(employee.id)) ||
        employee.facilityTask?.kind === "repair_room" && work.services.some(({ phase, queued, operation }) => queued && operation.location &&
          state.rooms.some((room) => room.id === employee.facilityTask?.targetId && room.roomDefinitionId === phase.roomDefinitionId)));
      if (soleUrgent) continue;
      const metric = getEmployeeTrainingRole(roleId);
      const benefit = metric?.metric === "consult_payment"
        ? `increase the trained role's consultation payment bonus by ${metric.percentPerLevel} percentage points on new work`
        : `${metric?.direction === "increases" ? "increase" : "reduce"} ${metric?.shortMetric ?? "role work"} by ${employee.trainingLevel === 1 ? `${quote.nextBenefit?.incrementalPercent ?? 0}%` : `another ${quote.nextBenefit?.incrementalPercent ?? 0} percentage points`} on new work`;
      add(id, employee.id, simple({ kind: "train_employee", employeeId: employee.id, expectedCost: quote.cost }, `Train ${employee.displayName} · ${money(quote.cost)}`, roleId === "staff.evs_worker" ? "evs" : `employee:${employee.id}`),
        { speaker: employee.displayName, values: { name: employee.displayName, benefit }, priority: 1, optional: true,
          lastFixTick: newest(employee.hiredAtFacilityTick, latestEvent(state, ["staff_hired"], employee.id)) });
    }
  };
  const upgrade = (id: GuidanceTipId, room: PlacedRoom, rootKey = `room:${room.id}`) => {
    const cost = getNextRoomUpgradeCost(state, room.id, context);
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (cost === null || !definition || definition.unlockFacilityLevel > state.facilityLevel || !getCurrentRoomUpgradeDefinition(room.roomDefinitionId) || !isRoomOperationalForFacilityWork(state, room.id, context) || !optionalPurchaseAllowed(state, cost, context)) return;
    const effect = getCurrentRoomUpgradeDefinition(room.roomDefinitionId)!;
    let benefit = getRoomUpgradePerPurchaseLabel(room.roomDefinitionId) ?? "improve this room";
    if (effect.effectKind === "revenue_percent") benefit += " on new work";
    const futureDurationSubjects: Record<string, string> = {
      cleaning_duration_reduction_percent: "new cleaning jobs", training_duration_reduction_percent: "newly accepted training sessions",
      repair_duration_reduction_percent: "future repairs", quality_review_duration_reduction_percent: "future quality reviews",
      reading_duration_reduction_percent: "new onsite reading work",
    };
    if (futureDurationSubjects[effect.effectKind]) benefit = `${futureDurationSubjects[effect.effectKind]} with ${effect.amountPerUpgrade}% less baseline time`;
    if (effect.effectKind === "daily_coffee_morale_points") benefit = `+${effect.amountPerUpgrade} staff morale points at the next daily coffee award`;
    if (effect.effectKind === "break_morale_points") benefit = `+${effect.amountPerUpgrade} staff morale points on future breaks`;
    if (effect.effectKind === "cleanliness_decay_reduction_percent") benefit += " on future use";
    add(id, room.id, simple({ kind: "upgrade_room", roomId: room.id, expectedCost: cost }, `Upgrade ${definition.displayName} · ${money(cost)} (+${money(definition.upkeepPerUpgradeLevel)}/hour)`, rootKey),
      { speaker: definition.displayName, values: { room: definition.displayName, benefit }, priority: 1, optional: true,
        lastFixTick: latestEvent(state, ["room_placed", "room_upgraded", "room_moved", "room_rotated", "door_placed", "door_removed"], room.id) });
  };

  // T01–T04: welfare and role-specific paid training.
  for (const employee of state.employees) {
    const role = getStaffRoleDefinition(employee.staffRoleDefinitionId, context);
    if (!role) continue;
    const salary = Math.min(role.maximumSalaryPerExpenseInterval, employee.salaryPerExpenseInterval + role.salaryAdjustmentStep);
    if (employee.morale <= context.balanceRelease.patientSatisfaction.unhappyStaffMoraleThreshold && salary > employee.salaryPerExpenseInterval &&
      getEffectiveEmployeeMorale({ ...employee, salaryPerExpenseInterval: salary }, context) > employee.morale &&
      state.cash >= context.balanceRelease.emergencyGlp1.lowCashAlertThreshold &&
      !upcomingOperatingPostingIsUnderfunded({ ...state, employees: state.employees.map((other) => other.id === employee.id ? { ...other, salaryPerExpenseInterval: salary } : other) }, context)) {
      add("tip.staff.salary", employee.id, simple({ kind: "raise_salary", employeeId: employee.id, salary, fromSalary: employee.salaryPerExpenseInterval }, `Raise ${employee.displayName} to ${money(salary)}/hour`, `employee:${employee.id}`),
        { speaker: employee.displayName, values: { name: employee.displayName }, priority: 1, optional: true, lastFixTick: employeeWelfareFix(state, employee, context) });
    }
    const reachable = [{ x: employee.location.x - 1, y: employee.location.y }, { x: employee.location.x + 1, y: employee.location.y },
      { x: employee.location.x, y: employee.location.y - 1 }, { x: employee.location.x, y: employee.location.y + 1 }].some((point) =>
      findCareAwareFacilityPath(state, context, state.environment.founderLocation, point, new Set(employee.homeRoomInstanceId ? [employee.homeRoomInstanceId] : [])).length > 0);
    if (employee.morale < context.balanceRelease.patientSatisfaction.happyStaffMoraleThreshold && !employee.training && !employee.facilityTask &&
      (employee.lastPraisedAtFacilityTick === null || state.facilityTick - employee.lastPraisedAtFacilityTick >= context.balanceRelease.environment.praiseCooldownMinutes) && guidanceFounderIsFree(state) && reachable) {
      add("tip.staff.praise", employee.id, simple({ kind: "praise_employee", employeeId: employee.id }, `Praise ${employee.displayName}`, `employee:${employee.id}`),
        { speaker: employee.displayName, values: { name: employee.displayName }, priority: 1, optional: true, lastFixTick: employeeWelfareFix(state, employee, context) });
    }
  }
  if (!built("room.training").length && state.employees.some((employee) => employee.trainingLevel < 5 && !employee.training && getEmployeeTrainingRole(employee.staffRoleDefinitionId) && roleActivity(employee.staffRoleDefinitionId)))
    add("tip.training.build", "room.training", placeRemedy(state, "room.training", context, true), { priority: 1, optional: true });
  const specialized = ["staff.evs_worker", "staff.imaging_technician", "staff.radiologist", "staff.laboratory_technician", "staff.repair_person"];
  for (const roleId of new Set(state.employees.map((employee) => employee.staffRoleDefinitionId))) if (!specialized.includes(roleId)) training("tip.training.role", roleId);

  // T05–T13: concrete coverage and manual amenities, with durable automation.
  if (!installed("staff.glp1_np").length && (built("room.glp1_telehealth_suite").length || state.emergencyGlp1.totalUses > 0)) {
    const remedy = built("room.glp1_telehealth_suite").length ? missingSetupRemedy(state, requirement("room.glp1_telehealth_suite", ["staff.glp1_np"]), context, true) : placeRemedy(state, "room.glp1_telehealth_suite", context, true);
    add("tip.telehealth.automation", "telehealth", remedy, { optional: true, values: { fix: built("room.glp1_telehealth_suite").length ? "Hire a telehealth NP" : "Build a telehealth suite and hire an NP" } });
  }
  if (!state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.receptionist") &&
    (W.length || Object.values(state.encounters).some((encounter) => encounter.checkInStatus === "awaiting_staff" && encounter.checkInWaitingSinceTick !== null && state.facilityTick - encounter.checkInWaitingSinceTick > context.balanceRelease.patientSatisfaction.unstaffedCheckInDelayMinutes)))
    add("tip.reception.coverage", "reception", hireRemedy(state, "staff.receptionist", context));
  for (const room of state.rooms) {
    const relevant = state.employees.some((employee) => employee.homeRoomInstanceId === room.id) ||
      work.diagnostic.some(({ phase }) => phase.requirement?.roomDefinitionId === room.roomDefinitionId) ||
      work.services.some(({ phase }) => phase.roomDefinitionId === room.roomDefinitionId) ||
      W.length > 0 && ["room.waiting", "room.examination", "room.bathroom", "room.training", "room.evs_closet"].includes(room.roomDefinitionId);
    if (relevant) add("tip.access.restore", room.id, accessRemedy(state, room, context), { values: { room: getRoomDefinition(room.roomDefinitionId, context)?.displayName ?? "Room" } });
  }
  if (W.length && !built("room.waiting").length) add("tip.waiting.build", "room.waiting", placeRemedy(state, "room.waiting", context));
  const claimed = new Set([
    ...Object.values(state.encounters).flatMap((encounter) => encounter.resolutionReason === null && encounter.waitingDestination ? [keyPoint(encounter.waitingDestination.location)] : []),
    ...state.employees.flatMap((employee) => [keyPoint(employee.location), ...employee.path.slice(-1).map(keyPoint)]),
    keyPoint(state.environment.founderLocation), ...state.environment.founderActivity?.path.slice(-1).map(keyPoint) ?? [],
  ]);
  const openChair = R("room.waiting").some((room) => getRoomWaitingAnchors(room, getRoomDefinition(room.roomDefinitionId, context)!).some((point) => !claimed.has(keyPoint(point)) &&
    W.some((encounter) => findCareAwareFacilityPath(state, context, encounter.patientLocation!, point).length > 0)));
  const overflow = W.filter((encounter) => encounter.waitingDestination?.kind !== "chair");
  if (R("room.waiting").length && overflow.length && !openChair) {
    const room = getRoomDefinition("room.waiting", context)!;
    const atCap = room.maximumInstances !== null && built(room.id).length >= room.maximumInstances;
    const oldest = overflow.sort((a, b) => (a.idleWaitingSinceTick ?? 0) - (b.idleWaitingSinceTick ?? 0))[0]!;
    add("tip.waiting.overflow", "waiting-seats", atCap ? simple({ kind: "open_chart", encounterId: oldest.id }, "Open chart", "waiting-seats") : placeRemedy(state, room.id, context, true),
      { rootKey: "waiting-seats", optional: !atCap, values: { fix: atCap ? "Work through the waiting queue" : "Build another Waiting Room" } });
  }
  if (W.some((encounter) => state.facilityTick - encounter.idleWaitingSinceTick! >= 30) && !built("room.bathroom").length)
    add("tip.amenities.bathroom", "room.bathroom", placeRemedy(state, "room.bathroom", context));
  const waterTarget = getWaterCoolerApproachLocation(state);
  if (state.environment.waterCoolerFillPercent <= 0 && state.environment.waterCoolerEmptySinceTick !== null && state.facilityTick - state.environment.waterCoolerEmptySinceTick > 60 &&
    !hasAutoWaterCoverage(state, context) && guidanceFounderIsFree(state) && waterTarget && findCareAwareFacilityPath(state, context, state.environment.founderLocation, waterTarget).length)
    add("tip.water.manual", "water", simple({ kind: "refill_water" }, "Send founder to refill", "water"), { speaker: "Water cooler", lastFixTick: latestEvent(state, ["water_cooler_refilled"]) });
  if ((state.environment.litterItems.length || dirty.length) && !state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.evs_worker") && state.environment.founderActivity?.kind !== "collect_litter")
    add("tip.evs.coverage", "evs", built("room.evs_closet").length ? missingSetupRemedy(state, requirement("room.evs_closet", ["staff.evs_worker"]), context) : placeRemedy(state, "room.evs_closet", context),
      { rootKey: "evs", speaker: "Housekeeping", values: { fix: built("room.evs_closet").length ? "Hire an EVS worker" : "Build an EVS closet and hire its worker" }, lastFixTick: newest(state.environment.lastLitterCleanupAtTick, state.environment.lastEvsRoomCleanupAtTick) });
  for (const litter of state.environment.litterItems) if (state.facilityTick - litter.spawnedAtFacilityTick > 60 && !hasAutoTrashCoverage(state, litter.id, context) && guidanceFounderIsFree(state) &&
    findCareAwareFacilityPath(state, context, state.environment.founderLocation, litter.location, new Set([litter.roomId])).length)
    add("tip.litter.manual", litter.id, simple({ kind: "collect_litter", litterId: litter.id }, "Send founder to clean", "evs"), { speaker: "Housekeeping", lastFixTick: newest(state.environment.lastLitterCleanupAtTick, state.environment.lastEvsRoomCleanupAtTick) });

  // T14–T25: specialist skill, local capability and exact upgrade effects.
  training("tip.evs.training", "staff.evs_worker");
  if (dirty.length) for (const employee of installed("staff.evs_worker")) {
    const room = state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId);
    if (room?.roomDefinitionId === "room.evs_closet" && dirty.some((target) => findCareAwareFacilityPath(state, context, employee.location, getRoomNavigationAnchor(target, getRoomDefinition(target.roomDefinitionId, context)!, "staff"), new Set([target.id, room.id])).length))
      upgrade("tip.evs.room-upgrade", room, "evs");
  }
  if (getWorkloadSnapshot(state, context).atRoutineCapacity && W.length && R("room.examination").length > 0 && R("room.examination").length === built("room.examination").length)
    add("tip.examination.capacity", "room.examination", placeRemedy(state, "room.examination", context, true), { optional: true });
  for (const room of state.rooms.filter((room) => ["room.waiting", "room.examination", "room.periop_recovery"].includes(room.roomDefinitionId))) {
    if (room.roomDefinitionId === "room.periop_recovery" && state.facilityLevel < 2) continue;
    const patients = Object.values(state.encounters).filter((encounter) => encounter.resolutionReason === null && encounter.patientSatisfaction < 90 &&
      (encounter.assignedRoomInstanceId === room.id || encounter.waitingDestination?.roomInstanceId === room.id ||
        Object.values(encounter.roomUpgradeExperience ?? {}).some((witness) => witness && typeof witness === "object" && "roomInstanceId" in witness && witness.roomInstanceId === room.id)));
    const frozenRecovery = room.roomDefinitionId === "room.periop_recovery" && state.serviceOperations.some((operation) => ongoing(operation.status) && operation.roomUpgradeRecovery?.candidates.some((candidate) => candidate.roomInstanceId === room.id));
    if (patients.length && !frozenRecovery) upgrade("tip.comfort.room-upgrade", room);
  }
  const roomDemand = (roomId: string, kinds?: DiagnosticOrderPhase["kind"][]) => work.diagnostic.filter(({ phase, plan }) =>
    (!kinds || kinds.includes(phase.kind)) && (phase.requirement?.roomDefinitionId === roomId ||
      phase.mode === "external" && (roomId === "room.reading" && phase.kind === "interpretation" ||
        roomId === "room.phlebotomy" && phase.kind === "collection" || roomId === "room.laboratory" && ["laboratory_processing", "pathology"].includes(phase.kind) ||
        phase.kind === "acquisition" && plan.sources.filter((source) => source.componentId === phase.componentId).some((source) =>
          source.operationPhases.some((part) => part.roomDefinitionId === roomId) || context.balanceRelease.services.find((service) => service.id === source.serviceId)?.routes.some((route) => route.resourceRequirements.some((resource) => resource.roomDefinitionId === roomId))))));
  for (const roomId of ["room.ultrasound", "room.xray", "room.ct"]) {
    const req = requirement(roomId, ["staff.imaging_technician"]);
    if (roomDemand(roomId, ["acquisition"]).some(({ ready }) => ready) || work.services.some(({ phase, queued }) => queued && phase.roomDefinitionId === roomId) ||
      roomId === "room.xray" && Object.values(state.encounters).some((encounter) => encounter.resolutionReason === null && encounter.pendingResult?.routeId.includes("xray") && !encounter.pendingResult.patientRemainsOnsite))
      add("tip.imaging.coverage", roomId, missingSetupRemedy(state, req, context));
  }
  training("tip.imaging.training", "staff.imaging_technician");
  if (!built("room.reading").length && roomDemand("room.reading", ["interpretation"]).some(({ phase }) => phase.mode === "external"))
    add("tip.reading.build", "room.reading", placeRemedy(state, "room.reading", context, true), { optional: true, priority: 1 });
  const readingQueued = roomDemand("room.reading", ["interpretation"]).some(({ phase, ready }) => ready && phase.mode === "local" && phase.durationMinutes > 0 && phase.forecast.queueMinutes > 0 && ["queued", "pending"].includes(phase.status));
  if (readingQueued && R("room.reading").length && !installed("staff.radiologist").some((employee) => employee.training))
    add("tip.reading.capacity", "reading-capacity", hireRemedy(state, "staff.radiologist", context, true, true));
  training("tip.reading.training", "staff.radiologist");
  for (const room of R("room.reading")) if (installed("staff.radiologist").some((employee) => employee.homeRoomInstanceId === room.id) &&
    roomDemand("room.reading", ["interpretation"]).some(({ phase, ready }) => ready && phase.mode === "local" &&
      (phase.status === "active" || phase.forecast.queueMinutes > 0) && (phase.resource ? phase.resource.roomInstanceId === room.id : R("room.reading")[0]?.id === room.id))) upgrade("tip.reading.room-upgrade", room);
  for (const [roomId, role, activity, kinds] of [
    ["room.phlebotomy", "staff.phlebotomist", "collection", ["collection"]],
    ["room.laboratory", "staff.laboratory_technician", "processing", ["laboratory_processing", "pathology"]],
  ] as const) if (roomDemand(roomId, [...kinds]).some(({ ready, phase }) => ready || phase.mode === "external") || work.services.some(({ phase, queued }) => queued && phase.roomDefinitionId === roomId))
    add("tip.labs.coverage", roomId, missingSetupRemedy(state, requirement(roomId, [role]), context), { values: { activity } });
  training("tip.labs.training", "staff.laboratory_technician");

  // T26–T31: staffed care chains, measured capacity and maintained equipment.
  const careChain = (roomId: string, nurse: string) => [requirement("room.periop_recovery", ["staff.periop_nurse"]), requirement(roomId, [nurse], true)];
  const unmetGoal = (id: string) => progressionStatus().requirements.some((goal) => goal.id === id && !goal.met);
  for (const [tip, roomId, nurse, goal] of [
    ["tip.endoscopy.setup", "room.endoscopy", "staff.endoscopy_nurse", "progression.endoscopy_completion"],
    ["tip.surgery.setup", "room.ambulatory_or", "staff.or_nurse", "progression.ambulatory_operation_completion"],
  ] as const) if ((built(roomId).length || tip === "tip.surgery.setup" && unmetGoal(goal)) && (work.services.some(({ operation, queued }) => queued && serviceIsFor(operation, roomId)) || unmetGoal(goal))) {
    const remedy = careChain(roomId, nurse).map((req) => missingSetupRemedy(state, req, context)).find(Boolean);
    add(tip, roomId, remedy ?? null, { rootKey: `care-chain:${roomId}`,
      priority: work.services.some(({ operation, queued }) => queued && serviceIsFor(operation, roomId)) ? 0 : 2 });
  }
  if (state.serviceOperations.some((operation) => ongoing(operation.status) && operation.providerReservation?.kind === "founder" &&
    (operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases)?.some((phase) => phase.roomDefinitionId === "room.endoscopy")) &&
    work.services.some(({ operation, queued }) => queued && serviceIsFor(operation, "room.endoscopy")) &&
    careChain("room.endoscopy", "staff.endoscopy_nurse").every((req) => installedSetup(state, req, context)) && !state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.endoscopist"))
    add("tip.endoscopy.provider", "endoscopy-provider", hireRemedy(state, "staff.endoscopist", context, true), { optional: true });
  const periopQueue = work.services.filter(({ phase, queued, operation }) => queued && phase.roomDefinitionId === "room.periop_recovery" &&
    operation.pathIndex >= operation.path.length - 1 && operation.location !== null);
  const periopDiagnosticQueue = work.diagnostic.filter(({ phase, ready }) => ready && phase.mode === "local" &&
    ["preparation", "recovery"].includes(phase.kind) && ["pending", "queued"].includes(phase.status) && phase.requirement?.roomDefinitionId === "room.periop_recovery" && phase.forecast.queueMinutes > 0);
  if ((periopQueue.length || periopDiagnosticQueue.length) && R("room.periop_recovery").length && installed("staff.periop_nurse").length && !installed("staff.periop_nurse").some((employee) => employee.training)) {
    const usedBeds = new Set(state.serviceOperations.filter((operation) => ongoing(operation.status) && operation.periopBedReservation).map((operation) => `${operation.periopBedReservation!.roomInstanceId}:${operation.periopBedReservation!.bedId}`));
    const beds = R("room.periop_recovery").flatMap((room) => getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId, context)!, state.doors, state.rooms, (id) => getRoomDefinition(id, context)).map((bed) => `${room.id}:${bed.id}`));
    const busyNurses = new Set(state.serviceOperations.filter((operation) => ongoing(operation.status)).flatMap((operation) => operation.reservedEmployeeIds));
    for (const { phase } of work.diagnostic.filter(({ phase }) => phase.status === "active" && phase.resource)) {
      for (const id of phase.resource!.employeeIds) busyNurses.add(id);
      if (phase.resource!.stationId) usedBeds.add(`${phase.resource!.roomInstanceId}:${phase.resource!.stationId}`);
    }
    for (const operation of state.serviceOperations.filter((operation) => ongoing(operation.status) && !operation.periopBedReservation))
      for (const bed of beds) if (operation.reservedRoomInstanceIds.some((id) => bed.startsWith(`${id}:`))) usedBeds.add(bed);
    const allNursesBusy = installed("staff.periop_nurse").every((employee) => busyNurses.has(employee.id) || employee.facilityTask?.kind === "perform_service");
    const remedy = beds.length > 0 && beds.every((bed) => usedBeds.has(bed)) ? placeRemedy(state, "room.periop_recovery", context, true) : allNursesBusy ? hireRemedy(state, "staff.periop_nurse", context, true, true) : null;
    add("tip.periop.capacity", "periop-capacity", remedy, { optional: true });
  }
  const maintenance = state.rooms.filter((room) => ["room.ambulatory_or", "room.laboratory", "room.pharmacy"].includes(room.roomDefinitionId) && ["due", "out_of_service"].includes(room.maintenance?.status ?? ""));
  for (const room of maintenance) if (!installed("staff.repair_person").length && !state.employees.some((employee) => employee.facilityTask?.kind === "repair_room" && employee.facilityTask.targetId === room.id))
    add("tip.maintenance.coverage", room.id, built("room.maintenance_workshop").length ? missingSetupRemedy(state, requirement("room.maintenance_workshop", ["staff.repair_person"]), context) : placeRemedy(state, "room.maintenance_workshop", context),
      { rootKey: `maintenance:${room.id}`, values: { room: getRoomDefinition(room.roomDefinitionId, context)?.displayName ?? "Room" } });
  training("tip.maintenance.training", "staff.repair_person");

  // T32–T40: established improvements, quiet arrivals, money, goals and learning.
  const unhappy = state.employees.filter((employee) => employee.morale < context.balanceRelease.patientSatisfaction.happyStaffMoraleThreshold && !employee.training && !employee.facilityTask);
  if (!built("room.staff_break").length && unhappy.some((employee) => employee.lastBreakAtFacilityTick == null || state.facilityTick - employee.lastBreakAtFacilityTick >= context.balanceRelease.environment.levelThreeSupport.breakCooldownMinutes))
    add("tip.staff.break-room", "room.staff_break", placeRemedy(state, "room.staff_break", context, true), { rootKey: "staff-welfare", priority: 1, optional: true, lastFixTick: newest(...unhappy.map((employee) => employeeWelfareFix(state, employee, context))) });
  if (!built("room.coffee_kiosk").length && unhappy.length)
    add("tip.staff.coffee", "room.coffee_kiosk", placeRemedy(state, "room.coffee_kiosk", context, true), { rootKey: "staff-welfare", priority: 1, optional: true, lastFixTick: newest(...unhappy.map((employee) => employeeWelfareFix(state, employee, context))) });
  const separateUpgrades = ["room.waiting", "room.examination", "room.periop_recovery", "room.evs_closet", "room.reading"];
  for (const room of state.rooms.filter((room) => !separateUpgrades.includes(room.roomDefinitionId))) {
    const attributed = state.serviceOperations.some((operation) => operation.reservedRoomInstanceIds.includes(room.id) || operation.completedCareProvenance?.roomInstanceId === room.id || operation.roomUpgradeRevenue?.boundRoom?.roomInstanceId === room.id) ||
      state.retailOperations.some((operation) => operation.outletRoomInstanceId === room.id && ongoing(operation.status)) ||
      state.employees.some((employee) => ["repair_room", "clean_room"].includes(employee.facilityTask?.kind ?? "") && employee.homeRoomInstanceId === room.id || employee.facilityTask?.kind === "take_break" && employee.facilityTask.targetId === room.id) ||
      room.roomDefinitionId === "room.training" && state.employees.some((employee) => !employee.training && roleActivity(employee.staffRoleDefinitionId) && getEmployeeTrainingQuote(state, employee.id, context).canTrain) ||
      room.roomDefinitionId === "room.bathroom" && (room.cleanliness ?? 100) < context.balanceRelease.environment.evsRoomCleanlinessThreshold ||
      room.roomDefinitionId === "room.surgeon_office" && (state.levelThreeQiReviews ?? []).some((review) => review.status !== "completed" && state.employees.some((employee) => employee.id === review.surgeonEmployeeId && employee.homeRoomInstanceId === room.id)) ||
      room.roomDefinitionId === "room.coffee_kiosk" && unhappy.length > 0;
    if (attributed) upgrade("tip.room.other-upgrade", room);
  }
  const availability = getRoutinePatientAvailability({ ...state, paused: false }, asOfRealMs, context).reason;
  const adTier = context.balanceRelease.advertising.levels.find((tier) => tier.level === state.advertisingLevel);
  if (state.advertisingLevel === 0 && guidanceIntroductoryEncountersComplete(state) && state.alertHumor.lastPatientArrivalTick !== null &&
    state.facilityTick - state.alertHumor.lastPatientArrivalTick > GUIDANCE_TIP_POLICY.quietArrivalsMinutes &&
    !getWorkloadSnapshot(state, context).atRoutineCapacity && ["available", "arrival_scheduled"].includes(availability)) {
    const tier = context.balanceRelease.advertising.levels.find((tier) => tier.level === state.advertisingLevel + 1);
    if (tier && optionalPurchaseAllowed({ ...state, advertisingLevel: tier.level }, 0, context)) add("tip.advertising.increase", "advertising", simple({ kind: "set_advertising", level: tier.level, fromLevel: state.advertisingLevel }, `Raise advertising · ${money(tier.hourlyCost)}/hour`, "advertising"),
      { speaker: "Front Desk", priority: 1, optional: true, lastFixTick: latestEvent(state, ["advertising_level_changed"]) });
  }
  if (state.advertisingLevel > 0 && (adTier?.hourlyCost ?? 0) > 0 && (getWorkloadSnapshot(state, context).atRoutineCapacity || ["reviews_not_due", "content_unavailable"].includes(availability) || upcomingOperatingPostingIsUnderfunded(state, context))) {
    const tier = context.balanceRelease.advertising.levels.find((tier) => tier.level === state.advertisingLevel - 1);
    if (tier) add("tip.advertising.reduce", "advertising", simple({ kind: "set_advertising", level: tier.level, fromLevel: state.advertisingLevel }, `Lower advertising · saves ${money((adTier?.hourlyCost ?? 0) - tier.hourlyCost)}/hour`, "advertising"),
      { speaker: "Finance", lastFixTick: latestEvent(state, ["advertising_level_changed"]) });
  }
  const emergency = getEmergencyGlp1Status(state, context);
  if (state.cash < context.balanceRelease.emergencyGlp1.lowCashAlertThreshold && !installed("staff.glp1_np").length && emergency.eligible)
    add("tip.cash.manual-consult", "cash", simple({ kind: "emergency_consult" }, `Emergency consult · +${money(emergency.payment)}`, "finance"),
      { speaker: "Finance", values: { payment: money(emergency.payment) }, lastFixTick: state.emergencyGlp1.lastUsedAtFacilityTick });
  const progression = progressionStatus();
  if (progression.eligible) add("tip.progression.next-step", `advance:${state.facilityLevel}`, simple({ kind: "level_up" }, "Advance level", "progression"),
    { priority: 2, speaker: "Goals", values: { guidance: `Advance the clinic to Level ${progression.nextFacilityLevel}.` } });
  else if (guidanceIntroductoryEncountersComplete(state)) {
    const unmet = progression.requirements.filter((entry) => !entry.met);
    // Requirements are listed metrics-first in Goals. A legal concrete remedy
    // takes precedence here, in requirement order, even when XP is also unmet.
    const concrete = unmet.map((goal) => {
      const roomId = goal.id.startsWith("progression.room.") ? goal.id.slice("progression.room.".length) : null;
      const roleId = goal.id.startsWith("progression.staff.") ? goal.id.slice("progression.staff.".length) : null;
      let remedy: Remedy | null = null;
      let guidance: string | undefined;
      if (roomId) {
        remedy = built(roomId).length ? accessRemedy(state, built(roomId)[0]!, context) : placeRemedy(state, roomId, context, true);
        guidance = remedy?.action?.kind === "place_room" && remedy.action.definitionId !== roomId
          ? `${remedy.fix} first to support the ${getRoomDefinition(roomId, context)!.displayName} requirement.`
          : `${remedy?.fix} to meet this room requirement.`;
      } else if (roleId) {
        const homeIds = getStaffRoleDefinition(roleId, context)?.requiredRoomDefinitionIds ?? [];
        const missingHome = homeIds.find((id) => !built(id).length);
        remedy = hireRemedy(state, roleId, context, true) ?? (missingHome ? placeRemedy(state, missingHome, context, true) :
          homeIds.flatMap((id) => built(id)).map((room) => accessRemedy(state, room, context)).find(Boolean) ?? null);
        guidance = remedy?.action?.kind === "hire_staff" ? `${remedy.fix} to meet this staffing requirement.` :
          `${remedy?.fix} first to support ${getStaffRoleDefinition(roleId, context)!.displayName} staffing.`;
      } else if (["progression.endoscopy_completion", "progression.ambulatory_operation_completion"].includes(goal.id)) {
        const endoscopy = goal.id === "progression.endoscopy_completion";
        remedy = careChain(endoscopy ? "room.endoscopy" : "room.ambulatory_or", endoscopy ? "staff.endoscopy_nurse" : "staff.or_nurse")
          .map((req) => missingSetupRemedy(state, req, context, true)).find(Boolean) ?? null;
        guidance = `${remedy?.fix} to support the first ${endoscopy ? "endoscopy" : "ambulatory operation"} visit goal.`;
      }
      return { goal, remedy, guidance };
    }).find((entry) => entry.remedy);
    if (concrete) {
      // Yield completely to an already visible condition; do not fall through
      // to a metric while its more concrete blocker is already being explained.
      if (!progressionRemedyHasLiveCondition(state, concrete.remedy!.action, context))
        add("tip.progression.next-step", concrete.goal.id, concrete.remedy,
          { priority: 2, speaker: "Goals", values: { guidance: concrete.guidance! } });
    } else if (!unmet.some((goal) => goal.id.startsWith("progression.room.") || goal.id.startsWith("progression.staff.") ||
      goal.id === "progression.endoscopy_completion" && !careChain("room.endoscopy", "staff.endoscopy_nurse").every((req) => installedSetup(state, req, context)) ||
      goal.id === "progression.ambulatory_operation_completion" && !careChain("room.ambulatory_or", "staff.or_nurse").every((req) => installedSetup(state, req, context)))) {
      // An unavailable/unaffordable concrete goal yields; only metrics remain.
      const goal = unmet.find((entry) => !entry.id.startsWith("progression.room.") && !entry.id.startsWith("progression.staff."));
      const guidance = goal && progressionMetricGuidance(state, goal, context);
      if (goal && guidance) add("tip.progression.next-step", goal.id,
        { fix: guidance, rootKey: `progression:${goal.id}`, lastFixTick: latestEvent(state, ["facility_level_advanced"]) },
        { priority: 2, speaker: "Goals", values: { guidance } });
    }
  }
  for (const discussion of Object.values(state.employeeDiscussions ?? {})) if (["waiting_unopened", "active_action_required"].includes(discussion.lifecycle) &&
    state.facilityTick - discussion.createdAtFacilityTick >= GUIDANCE_TIP_POLICY.recentFixMinutes && state.openEmployeeDiscussionId !== discussion.id &&
    getEmployeeDiscussionBlockedReason(state, discussion.id, context) === null && state.employees.some((employee) => employee.id === discussion.employeeId && !employee.training && !employee.facilityTask &&
      isEmployeeOperational(state, employee.id, context) && isEmployeeAssignedToOperationalRoom(state, employee.id, context)))
    add("tip.learning.team-discussion", discussion.id, simple({ kind: "open_discussion", discussionId: discussion.id }, `Open ${discussion.employeeDisplayName}'s discussion`, `discussion:${discussion.id}`),
      { speaker: discussion.employeeDisplayName, values: { name: discussion.employeeDisplayName }, priority: 1, lastFixTick: latestEvent(state, ["employee_discussion_decision"]) });
  if (!state.serviceAppointmentsEnabled) {
    const capabilities = getCurrentCapabilities(state, context);
    const supported = SERVICE_INCOME_CATALOG.filter((line) => line.operation?.visitorMode === "scheduled" && line.minimumFacilityLevel <= state.facilityLevel &&
      line.requiredCapabilityIds.every((id) => capabilities.has(id)) &&
      line.operation.phases.every((phase) => !phase.roomDefinitionId || R(phase.roomDefinitionId).length > 0) &&
      line.operation.phases.every((phase) => phase.staffRoleDefinitionIds.every((role) => installed(role).length > 0)) &&
      line.operation.phases.every((phase) => !phase.providerRoleDefinitionIds?.length || phase.founderEligible || phase.providerRoleDefinitionIds.some((role) => installed(role).length > 0)));
    const roomTypes = new Set(supported.flatMap((line) => line.operation!.phases.flatMap((phase) => phase.roomDefinitionId ? [phase.roomDefinitionId] : [])));
    const relevantRooms = state.rooms.filter((room) => roomTypes.has(room.roomDefinitionId));
    const setup = supported.length ? JSON.stringify([supported.map((line) => line.id).sort(), relevantRooms.map((room) => room.id).sort(), state.employees.filter((employee) => relevantRooms.some((room) => room.id === employee.homeRoomInstanceId)).map((employee) => employee.id).sort()]) : "";
    const queued = work.services.some(({ queued, phase }) => queued && roomTypes.has(phase.roomDefinitionId!));
    const meaningful = supported.some((line) => line.operation?.phases.some((phase) => phase.roomDefinitionId === "room.endoscopy") ? getFunctionalScheduledEndoscopyCapacity(state, context) > 0 :
      line.operation?.phases.some((phase) => phase.roomDefinitionId === "room.ambulatory_or") ? getFunctionalScheduledAmbulatoryOperationCapacity(state, context) > 0 : true);
    if (setup && meaningful && !queued)
      add("tip.services.appointments", setup, simple({ kind: "enable_appointments" }, "Enable Scheduled appointments", "appointments"), { priority: 1, optional: true });
  }
  // One target per ID, stable across render/reload. Specialist tips beat generic
  // setup/goal advice through priority, root ownership and longest live age.
  return [...new Map(candidates.map((candidate) => [`${candidate.id}:${candidate.targetKey}`, candidate])).values()];
}

/** Same admitted hard-block semantics as the panel: installed busy staff is safe. */
export function guidanceHasLiveDireProblem(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): boolean {
  const inClinic = (point: { x: number; y: number } | null) => point && state.rooms.some((room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    const footprint = definition && getRotatedFootprint(definition, room.orientation);
    return footprint && point.x >= room.x && point.x < room.x + footprint.width && point.y >= room.y && point.y < room.y + footprint.height;
  });
  if (Object.values(state.encounters).some((encounter) => patientDepartureRiskIsActive(state, encounter))) return true;
  const emergency = getEmergencyGlp1Status(state, context);
  const automated = state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.glp1_np" && isEmployeeAssignedToOperationalRoom(state, employee.id, context));
  if (state.employees.length && upcomingOperatingPostingIsUnderfunded(state, context) && (emergency.eligible && !automated || state.advertisingLevel > 0)) return true;
  const work = demand(state);
  return work.diagnostic.some(({ phase, plan, ready }) => {
    const encounter = state.encounters[plan.encounterId];
    return ready && ["queued", "pending"].includes(phase.status) && phase.mode === "local" && phase.requirement &&
      phase.forecast.readyAtTick <= state.facilityTick && inClinic(encounter?.patientLocation ?? null) && encounter?.checkInStatus === "checked_in" && (!encounter.patientMovement || encounter.patientMovement.kind === "idle_within_room") &&
      missingSetupRemedy(state, phase.requirement, context) !== null;
  }) || work.services.some(({ phase, operation, queued }) => queued && operation.actorKind !== "remote" && inClinic(operation.location) &&
    operation.pathIndex >= operation.path.length - 1 && missingSetupRemedy(state, { ...requirement(phase.roomDefinitionId!, [...phase.staffRoleDefinitionIds], phase.founderEligible ?? false), providerRoleDefinitionIds: [...phase.providerRoleDefinitionIds ?? []] }, context) !== null);
}

function candidateKey(candidate: Pick<GuidanceTipCandidate, "id" | "targetKey">) { return `${candidate.id}|${candidate.targetKey}`; }

function rootSignature(state: GameState, rootKey: string): string {
  // Only levers/fixes enter this fingerprint: fluctuations in demand, cash and
  // cleanliness do not endlessly renew grace or erase continuous eligibility.
  if (rootKey.startsWith("employee:")) {
    const employee = state.employees.find((entry) => entry.id === rootKey.slice(9));
    return JSON.stringify(employee ? [employee.salaryPerExpenseInterval, employee.trainingLevel, Boolean(employee.training), employee.lastPraisedAtFacilityTick, employee.lastBreakAtFacilityTick ?? null] : null);
  }
  if (rootKey === "advertising") return String(state.advertisingLevel);
  if (rootKey === "appointments") return String(state.serviceAppointmentsEnabled);
  if (rootKey === "water") return String(latestEvent(state, ["water_cooler_refilled"]));
  if (rootKey === "evs") return JSON.stringify([state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.evs_worker").map((employee) => [employee.id, employee.trainingLevel, Boolean(employee.training)]), state.rooms.filter((room) => room.roomDefinitionId === "room.evs_closet").map((room) => [room.id, room.upgradeLevel]), state.environment.lastLitterCleanupAtTick, state.environment.lastEvsRoomCleanupAtTick]);
  const roomId = rootKey.startsWith("room:") ? rootKey.slice(5) : null;
  const typeId = rootKey.startsWith("setup:") ? rootKey.slice(6) : rootKey.startsWith("care-chain:") ? rootKey.slice(11) : null;
  const selected = state.rooms.filter((room) => roomId ? room.id === roomId : typeId ? room.roomDefinitionId === typeId : true);
  return JSON.stringify([selected.map((room) => [room.id, room.roomDefinitionId, room.upgradeLevel, room.x, room.y, room.orientation]),
    state.doors.filter((door) => selected.some((room) => room.id === door.roomId)).map((door) => [door.id, door.roomId, door.side, door.offset, door.exterior]),
    state.employees.filter((employee) => !roomId && !typeId || selected.some((room) => room.id === employee.homeRoomInstanceId)).map((employee) => [employee.id, employee.homeRoomInstanceId])]);
}

/** Mutates only a reducer-owned clone and emits at most one receipt, never debt. */
export function advanceGuidanceTips(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
  asOfRealMs = state.createdAtRealMs + state.facilityTick * 60_000): boolean {
  if (state.paused) return false;
  const tips = state.alertHumor.guidanceTips ??= createGuidanceTipsState(state.facilityTick);
  const tick = state.facilityTick;
  if (tips.introductoryCompletedAtTick === null && guidanceIntroductoryEncountersComplete(state))
    tips.introductoryCompletedAtTick = newest(...[TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].map((id) => state.encounters[id]?.resolvedAtFacilityTick)) ?? tick;
  // Observe levers even when their advice is ineligible (including turning
  // appointments off). Their absence from bounded event history is unknown.
  const watchedRoots = ["advertising", "appointments", "evs", "water", "staff-welfare", ...state.employees.map((employee) => `employee:${employee.id}`),
    ...state.rooms.map((room) => `room:${room.id}`), ...context.balanceRelease.facility.roomDefinitions.map((room) => `setup:${room.id}`)];
  for (const root of watchedRoots) {
    const signature = rootSignature(state, root);
    const prior = tips.observations[root];
    if (!prior || signature !== prior.signature) {
      tips.observations[root] = { signature, changedAtTick: tick };
      delete tips.rootLocks[root];
    }
  }
  if (tips.introductoryCompletedAtTick === null) return false;
  const candidates = evaluateGuidanceTipCandidates(state, context, asOfRealMs);
  const liveKeys = new Set(candidates.map(candidateKey));
  for (const key of Object.keys(tips.eligibleSince)) if (!liveKeys.has(key)) delete tips.eligibleSince[key];
  for (const [root, lock] of Object.entries(tips.rootLocks)) if (!candidates.some((candidate) => candidate.id === lock.tipId && candidate.targetKey === lock.targetKey)) delete tips.rootLocks[root];
  for (const candidate of candidates) {
    const signature = rootSignature(state, candidate.rootKey);
    const observation = tips.observations[candidate.rootKey];
    if (!observation) tips.observations[candidate.rootKey] = { signature, changedAtTick: candidate.lastFixTick ?? tips.initializedAtTick };
    else if (observation.signature !== signature) {
      tips.observations[candidate.rootKey] = { signature, changedAtTick: tick };
      delete tips.rootLocks[candidate.rootKey];
      for (const other of candidates.filter((entry) => entry.rootKey === candidate.rootKey)) delete tips.eligibleSince[candidateKey(other)];
    }
    const key = candidateKey(candidate);
    if (candidate.optional && tick - tips.observations[candidate.rootKey]!.changedAtTick < GUIDANCE_TIP_POLICY.recentFixMinutes) { delete tips.eligibleSince[key]; continue; }
    tips.eligibleSince[key] ??= tick;
  }
  tips.rollingEmissionTicks = tips.rollingEmissionTicks.filter((emitted) => tick - emitted < GUIDANCE_TIP_POLICY.rollingWindowMinutes);
  if (context.guidanceTipsDeliveryBlocked || guidanceHasLiveDireProblem(state, context)) { tips.lastDireAtTick = tick; return false; }
  if (context.guidanceAttentionBlocked || state.openChartEncounterId || state.openEmployeeDiscussionId || state.environment.pendingFounderConsult ||
    tips.lastDireAtTick !== null && tick - tips.lastDireAtTick < GUIDANCE_TIP_POLICY.resolvedCardQuietMinutes ||
    tips.introductoryCompletedAtTick === null || tick - tips.introductoryCompletedAtTick < GUIDANCE_TIP_POLICY.introductoryQuietMinutes ||
    tips.lastEmittedAtTick !== null && tick - tips.lastEmittedAtTick < GUIDANCE_TIP_POLICY.intervalMinutes || tips.rollingEmissionTicks.length >= GUIDANCE_TIP_POLICY.rollingLimit) return false;
  const eligible = candidates.filter((candidate) => {
    if (guidanceTopicsForTip(state, candidate.id, candidate.action).some((id) => context.guidanceBlockedTopicIds?.includes(id))) return false;
    const definition = GUIDANCE_TIP_CATALOG.find((entry) => entry.id === candidate.id)!;
    const age = tips.eligibleSince[candidateKey(candidate)];
    const lastId = tips.lastEmittedById[candidate.id];
    const lastFamily = tips.lastEmittedByFamily[definition.family];
    const lock = tips.rootLocks[candidate.rootKey];
    return !(candidate.id === "tip.services.appointments" && tips.taughtServiceSetups.includes(candidate.targetKey)) &&
      age !== undefined && tick - age >= GUIDANCE_TIP_POLICY.eligibilityMinutes &&
      (lastId === undefined || tick - lastId >= definition.cooldownMinutes) &&
      (lastFamily === undefined || tick - lastFamily >= GUIDANCE_TIP_POLICY.familyMinutes) &&
      (!lock || lock.tipId === candidate.id && lock.targetKey === candidate.targetKey);
  }).sort((a, b) => a.priority - b.priority || tips.eligibleSince[candidateKey(a)]! - tips.eligibleSince[candidateKey(b)]! || a.id.localeCompare(b.id) || a.targetKey.localeCompare(b.targetKey));
  const candidate = eligible[0];
  if (!candidate) return false;
  const definition = GUIDANCE_TIP_CATALOG.find((entry) => entry.id === candidate.id)!;
  const count = tips.emissionCounts[candidate.id] ?? 0;
  const contextualB = candidate.id === "tip.progression.next-step" && state.facilityLevel === context.balanceRelease.facility.maximumPlayableLevel ||
    candidate.id === "tip.surgery.setup" && !state.rooms.some((room) => room.roomDefinitionId === "room.ambulatory_or");
  const variant = contextualB ? "B" : count % 2 === 0 ? "A" : "B";
  const message = definition.variants[variant === "A" ? 0 : 1].replace(/\{([^}]+)\}/g, (_, key: string) => candidate.values[key] ?? "");
  tips.history.push({ id: `tip.occurrence.${tips.sequence++}`, tipId: candidate.id, targetKey: candidate.targetKey, rootKey: candidate.rootKey,
    emittedAtTick: tick, variant, message, speaker: candidate.speaker });
  tips.history = tips.history.slice(-GUIDANCE_TIP_POLICY.historyLimit);
  recordGuidanceTopicExposure(state, guidanceTopicsForTip(state, candidate.id, candidate.action));
  tips.lastEmittedAtTick = tick;
  tips.lastEmittedById[candidate.id] = tick;
  tips.lastEmittedByFamily[definition.family] = tick;
  tips.emissionCounts[candidate.id] = count + 1;
  tips.rollingEmissionTicks.push(tick);
  tips.rootLocks[candidate.rootKey] = { tipId: candidate.id, targetKey: candidate.targetKey };
  if (candidate.id === "tip.services.appointments") tips.taughtServiceSetups.push(candidate.targetKey);
  if (state.alertHumor.nextAmbientAlertTick !== null && state.alertHumor.nextAmbientAlertTick <= tick)
    state.alertHumor.nextAmbientAlertTick = tick + PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMinimumMinutes;
  return true;
}
