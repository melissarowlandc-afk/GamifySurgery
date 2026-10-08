import { getRoomUpgradePerPurchaseLabel, getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  employeeDepartureRiskIsActive,
  getAvailableEmployeeHomeRoom,
  getDiagnosticOrderPlans,
  getEmergencyGlp1Status,
  getNextRoomUpgradeCost,
  getRoomDefinition,
  getRoomStaffCapacity,
  getStaffRoleDefinition,
  isEmployeeAssignedToOperationalRoom,
  isRoomOperationalForFacilityWork,
  hasAutoTrashCoverage,
  hasAutoWaterCoverage,
  operatingDayMinutes,
  patientDepartureRiskIsActive,
  projectedNextOperatingPostingCents,
  upcomingOperatingPostingIsUnderfunded,
  evaluateGuidanceTipCandidates,
  guidanceOwnsCondition,
  guidanceDeliveryUnlocked,
  type DiagnosticResourceRequirement,
  type GameState,
} from "@gamify-surgery/game-domain";
import type { ClinicAlertAction, MessageBoardItemView, NeedsYouItemView } from "../ui/types";
import { createMessageBoardView } from "./alertViewModels";
import { facilityTimeLabel } from "./managementViewModels";
import { canRecommendAdvertising, getClinicAlertActionProblem, hasInstalledTelehealthCoverage } from "./clinicAlertActions";
import { ambientSpeaker, clinicFeedSpeaker, problemOnlyActionCopy, supersededConditionOccurrenceIds } from "./clinicFeedPresentation";
export { hasInstalledTelehealthCoverage } from "./clinicAlertActions";

export const clinicMoney = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function buildRemedy(state: GameState, definitionId: string) {
  const requested = getRoomDefinition(definitionId);
  const missingDependency = requested?.requiredRoomDefinitionIds.find((id) => !state.rooms.some((room) => room.roomDefinitionId === id));
  const definition = getRoomDefinition(missingDependency ?? definitionId);
  if (!definition) return null;
  const action: ClinicAlertAction = { kind: "place_room", definitionId: definition.id, expectedCost: definition.constructionCost };
  if (getClinicAlertActionProblem(state, action)) return null;
  return {
    action,
    actionLabel: `Place ${definition.displayName} · ${clinicMoney(definition.constructionCost)} (+${clinicMoney(definition.upkeepPerExpenseInterval)}/hour)`,
    targetType: "build_mode" as const,
    targetId: definition.id,
  };
}

function hireRemedy(state: GameState, roleId: string) {
  const definition = getStaffRoleDefinition(roleId);
  const home = getAvailableEmployeeHomeRoom(state, roleId);
  if (!definition || definition.unlockFacilityLevel > state.facilityLevel ||
    state.cash < definition.hiringCost || !home || !isRoomOperationalForFacilityWork(state, home.id) ||
    state.employees.filter((employee) => employee.staffRoleDefinitionId === roleId).length >= getRoomStaffCapacity(state, roleId).capacity) return null;
  return {
    action: { kind: "hire_staff", roleId, expectedCost: definition.hiringCost, requiresMissingCoverage: true } as ClinicAlertAction,
    actionLabel: `Hire ${definition.displayName} · ${clinicMoney(definition.hiringCost)} (+${clinicMoney(definition.salaryPerExpenseInterval)}/hour)`,
    targetType: "staff_role" as const,
    targetId: roleId,
    pin: { kind: "room" as const, id: home.id },
  };
}

function accessRemedy(state: GameState, roomId: string) {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  if (!room || room.maintenance?.status === "out_of_service" ||
    state.employees.some((employee) => employee.facilityTask?.kind === "repair_room" && employee.facilityTask.targetId === roomId)) return null;
  return {
    action: { kind: "restore_access", roomId } as ClinicAlertAction,
    actionLabel: `Fix ${getRoomDefinition(room.roomDefinitionId)?.displayName ?? "room"} access`,
    targetType: "room" as const,
    targetId: roomId,
    pin: { kind: "room" as const, id: roomId },
  };
}

/** Missing installed capacity, never an ordinary busy-resource queue. */
function missingResourceRemedy(state: GameState, requirement: DiagnosticResourceRequirement) {
  const rooms = state.rooms.filter((room) => room.roomDefinitionId === requirement.roomDefinitionId);
  const operational = rooms.filter((room) => isRoomOperationalForFacilityWork(state, room.id));
  if (operational.length === 0) {
    if (rooms.length > 0) {
      const room = rooms[0]!;
      if (room.maintenance?.status === "out_of_service") {
        if (state.employees.some((employee) => employee.facilityTask?.kind === "repair_room" && employee.facilityTask.targetId === room.id)) return null;
        if (state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.repair_person" && isEmployeeAssignedToOperationalRoom(state, employee.id))) return null;
        return state.rooms.some((candidate) => candidate.roomDefinitionId === "room.maintenance_workshop")
          ? hireRemedy(state, "staff.repair_person") : buildRemedy(state, "room.maintenance_workshop");
      }
      return accessRemedy(state, room.id);
    }
    return buildRemedy(state, requirement.roomDefinitionId);
  }
  const installedRole = (roleId: string) => state.employees.some((employee) =>
    employee.staffRoleDefinitionId === roleId && isEmployeeAssignedToOperationalRoom(state, employee.id) &&
    (!["staff.radiologist", "staff.phlebotomist", "staff.laboratory_technician"].includes(roleId) ||
      operational.some((room) => room.id === employee.homeRoomInstanceId)),
  );
  const missingRole = requirement.staffRoleDefinitionIds.find((roleId) => !installedRole(roleId)) ??
    (!requirement.founderEligible && requirement.providerRoleDefinitionIds.length > 0 &&
      !requirement.providerRoleDefinitionIds.some(installedRole) ? requirement.providerRoleDefinitionIds[0] : undefined);
  if (!missingRole) return null;
  const existing = state.employees.find((employee) => employee.staffRoleDefinitionId === missingRole &&
    employee.homeRoomInstanceId && !isEmployeeAssignedToOperationalRoom(state, employee.id));
  return existing?.homeRoomInstanceId ? accessRemedy(state, existing.homeRoomInstanceId) : hireRemedy(state, missingRole);
}

function physicallyPresent(state: GameState, point: { x: number; y: number } | null | undefined) {
  return Boolean(point && state.rooms.some((room) => {
    const definition = getRoomDefinition(room.roomDefinitionId);
    if (!definition) return false;
    const turned = room.orientation === 90 || room.orientation === 270;
    const width = turned ? definition.height : definition.width;
    const height = turned ? definition.width : definition.height;
    return point.x >= room.x && point.x < room.x + width && point.y >= room.y && point.y < room.y + height;
  }));
}

export function createNeedsYouView(state: GameState): NeedsYouItemView[] {
  const cards: NeedsYouItemView[] = [];
  const patientCards = new Map<string, NeedsYouItemView>();
  const patientRiskOrder = new Map<string, number>();
  const patientIdleOrder = new Map<string, number>();
  for (const encounter of Object.values(state.encounters)) {
    if (!patientDepartureRiskIsActive(state, encounter)) continue;
    patientCards.set(encounter.id, {
      id: `need.patient.${encounter.id}`,
      kind: "patient",
      title: `${encounter.patientDisplayName} may walk out`,
      why: "Their satisfaction is close to their departure threshold.",
      sortKey: encounter.departureRiskWarningAtTick ?? encounter.idleWaitingSinceTick ?? encounter.waiting.arrivedAtTick,
      action: { kind: "open_chart", encounterId: encounter.id },
      actionLabel: "Open chart",
      targetType: "patient",
      targetId: encounter.id,
      pin: { kind: "patient", id: encounter.id },
    });
    patientRiskOrder.set(encounter.id, encounter.patientSatisfaction - encounter.walkoutThreshold);
    patientIdleOrder.set(encounter.id, encounter.idleWaitingSinceTick ?? encounter.waiting.arrivedAtTick);
  }
  const addHardBlock = (actorId: string, title: string, onset: number, requirement: DiagnosticResourceRequirement, visitor = false) => {
    const remedy = missingResourceRemedy(state, requirement);
    if (!remedy) return;
    const existingRisk = patientCards.get(actorId);
    const card: NeedsYouItemView = {
      id: `need.patient.${actorId}`,
      kind: existingRisk ? "patient" : "resource",
      title: existingRisk?.title ?? `${title} is blocked`,
      why: `${title} needs ${getRoomDefinition(requirement.roomDefinitionId)?.displayName ?? "a resource"} coverage or access.`,
      sortKey: existingRisk?.sortKey ?? onset,
      ...remedy,
      pin: { kind: visitor ? "service_visitor" : "patient", id: actorId },
    };
    patientCards.set(actorId, card);
  };
  for (const plan of getDiagnosticOrderPlans(state)) {
    const encounter = state.encounters[plan.encounterId];
    if (!encounter || encounter.resolutionReason !== null || plan.execution !== "supported" ||
      encounter.checkInStatus !== "checked_in" || !physicallyPresent(state, encounter.patientLocation) ||
      (encounter.patientMovement && encounter.patientMovement.kind !== "idle_within_room")) continue;
    const phase = plan.phases.find((candidate) => candidate.mode === "local" && candidate.requirement &&
      (candidate.status === "queued" || candidate.status === "pending") &&
      candidate.dependsOn.every((id) => plan.phases.find((dependency) => dependency.id === id)?.status === "completed") &&
      candidate.forecast.readyAtTick <= state.facilityTick && missingResourceRemedy(state, candidate.requirement));
    if (phase?.requirement) addHardBlock(encounter.id, encounter.patientDisplayName, phase.forecast.readyAtTick, phase.requirement);
  }
  for (const operation of state.serviceOperations) {
    if (!["waiting_for_resources", "waiting_for_next_phase"].includes(operation.status) ||
      operation.actorKind === "remote" || !physicallyPresent(state, operation.location) ||
      operation.pathIndex < operation.path.length - 1 ||
      (operation.nextPhaseReadyAtFacilityTick != null && operation.nextPhaseReadyAtFacilityTick > state.facilityTick)) continue;
    const phases = operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases ?? [];
    const phase = phases[operation.phaseIndex + (operation.status === "waiting_for_next_phase" ? 1 : 0)];
    if (!phase?.roomDefinitionId) continue;
    addHardBlock(operation.actorId, operation.displayName,
      operation.nextPhaseReadyAtFacilityTick ?? operation.createdAtFacilityTick,
      { roomDefinitionId: phase.roomDefinitionId, staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds],
        providerRoleDefinitionIds: [...(phase.providerRoleDefinitionIds ?? [])], founderEligible: phase.founderEligible === true, stationKind: null },
      operation.actorKind === "visitor");
  }
  cards.push(...patientCards.values());
  if (state.employees.length > 0 && upcomingOperatingPostingIsUnderfunded(state, PROTOTYPE_DOMAIN_CONTEXT)) {
    const emergency = getEmergencyGlp1Status(state);
    const action: ClinicAlertAction | null = emergency.eligible && !hasInstalledTelehealthCoverage(state)
      ? { kind: "emergency_consult" }
      : state.advertisingLevel > 0 ? { kind: "set_advertising", level: state.advertisingLevel - 1, fromLevel: state.advertisingLevel } : null;
    if (action) {
      const atRisk = state.employees.filter((employee) => employeeDepartureRiskIsActive(state, employee, PROTOTYPE_DOMAIN_CONTEXT));
      const shortfall = (projectedNextOperatingPostingCents(state, PROTOTYPE_DOMAIN_CONTEXT) - state.cashCents) / 100;
      const interval = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.economy.postingIntervalMinutes;
      const onset = state.events.find((event) => event.type === "staff_departure_risk")?.facilityTick ?? Math.max(0, state.nextFinancialPostingTick - interval);
      cards.push({
        id: "need.finance.payroll", kind: "payroll", title: "Next payroll is underfunded",
        why: `${clinicMoney(shortfall)} is missing.${atRisk.length ? ` ${atRisk.map((employee) => employee.displayName).join(", ")} could quit.` : " Staff morale is at risk."}`,
        sortKey: onset,
        timeLabel: facilityTimeLabel(state, onset),
        action,
        actionLabel: action.kind === "emergency_consult" ? `Emergency consult · +${clinicMoney(emergency.payment)}` : "Lower advertising one step",
        targetType: "money",
        deadline: { minutesLeft: Math.max(0, state.nextFinancialPostingTick - state.facilityTick), windowMinutes: interval, label: `Posting ${facilityTimeLabel(state, state.nextFinancialPostingTick)}` },
      });
    }
  }
  const rank = (card: NeedsYouItemView) => card.kind === "patient" ? 0 : card.kind === "payroll" ? 1 : 2;
  const actorId = (card: NeedsYouItemView) => card.pin?.kind === "patient" ? card.pin.id : card.targetId ?? "";
  return cards.sort((left, right) => rank(left) - rank(right) ||
    (left.kind === "patient" && right.kind === "patient" ?
      (patientRiskOrder.get(actorId(left)) ?? Infinity) - (patientRiskOrder.get(actorId(right)) ?? Infinity) ||
      (patientIdleOrder.get(actorId(left)) ?? Infinity) - (patientIdleOrder.get(actorId(right)) ?? Infinity) : 0) ||
    left.sortKey - right.sortKey || left.id.localeCompare(right.id))
    .map((card) => ({ ...card, timeLabel: card.timeLabel ?? facilityTimeLabel(state, card.sortKey) }));
}

/** Feed projection is distinct from admission; M3 supplies ordinary tip rows here. */
export function createClinicFeedView(state: GameState): MessageBoardItemView[] {
  const needs = createNeedsYouView(state);
  const livePatients = new Set(needs.flatMap((card) => card.pin?.kind === "patient" ? [card.pin.id] : []));
  const events = new Map(state.events.map((event) => [event.id, event]));
  const occurrences = new Map(state.environment.facilityConditionOccurrences.map((occurrence) => [occurrence.id, occurrence]));
  const renewedOccurrences = supersededConditionOccurrenceIds(state.environment.facilityConditionOccurrences);
  const feed = createMessageBoardView(state).flatMap((item): MessageBoardItemView[] => {
    const event = events.get(item.id);
    const occurrence = occurrences.get(item.id);
    if (occurrence?.resolvedAtFacilityTick === null && guidanceOwnsCondition(state, occurrence.conditionKey)) return [];
    if (!occurrence && state.alertHumor.guidanceTips && item.persistent &&
      (item.category === "guidance" || item.id.startsWith("persistent.environment.") || item.id.startsWith("persistent.progress.")) &&
      ["build_mode", "staff_role", "room", "employee", "litter", "water_cooler", "advertising", "goal"].includes(item.targetType ?? "")) return [];
    if (event?.type === "water_cooler_low" && guidanceOwnsCondition(state, "empty_water_cooler") && state.environment.waterCoolerFillPercent <= PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.waterCoolerLowThreshold) return [];
    if (guidanceDeliveryUnlocked(state) && state.alertHumor.guidanceTips?.history.some((tip) => tip.tipId === "tip.cash.manual-consult") &&
      (occurrence?.conditionKey === "low_cash" || occurrence?.conditionKey === "no_cash") && occurrence.resolvedAtFacilityTick === null) return [];
    if (renewedOccurrences.has(item.id)) return [];
    if ((event?.definitionId === "alert.patient.departure-risk" && livePatients.has(event.encounterId ?? "")) ||
      (item.id.startsWith("event.patient-departure-risk.") && item.targetId && livePatients.has(item.targetId))) return [];
    const base = { ...item, speaker: clinicFeedSpeaker(state, item, event, occurrence), showAttentionMarker: false, priority: item.priority === "flavor" ? "flavor" as const : "informational" as const, rowKind: "event" as const };
    if (event?.type === "ambient_message") return [{ ...base, rowKind: "humor", speaker: ambientSpeaker(item.message) }];
    if (event?.type === "staff_quit") return [{ ...base, rowKind: "resolved", speaker: "Handled", actionLabel: undefined, targetType: undefined, targetId: undefined }];
    if (event?.type === "facility_level_advanced" || event?.type === "success_message") {
      return [{ ...base, rowKind: "milestone", speaker: "Milestone", actionLabel: undefined, targetType: undefined, targetId: undefined }];
    }
    if (event?.definitionId === "alert.patient.departure-risk") {
      const name = state.encounters[event.encounterId ?? ""]?.patientDisplayName ?? "The patient";
      return [{ ...base, rowKind: "resolved", speaker: "Handled", message: `${name} was close to walking out. That warning ended.`, actionLabel: undefined, targetType: undefined, targetId: undefined }];
    }
    if (occurrence?.resolvedAtFacilityTick != null) {
      return [{ ...base, rowKind: "resolved", speaker: "Handled", message: `${item.title ?? "Clinic condition"} was resolved.`,
        timeLabel: facilityTimeLabel(state, occurrence.resolvedAtFacilityTick), sortKey: occurrence.resolvedAtFacilityTick,
        actionLabel: undefined, targetType: undefined, targetId: undefined }];
    }
    if (event?.type === "staff_departure_risk" || item.id.startsWith("event.staff-departure-risk.")) {
      if (needs.some((card) => card.kind === "payroll")) return [];
      const employee = state.employees.find((candidate) => candidate.id === event?.target?.id);
      return [{ ...base, message: employee && employeeDepartureRiskIsActive(state, employee, PROTOTYPE_DOMAIN_CONTEXT)
        ? "Next payroll needs more cash. Current money controls cannot cover it in one step."
        : "An earlier payroll warning ended.", rowKind: employee && employeeDepartureRiskIsActive(state, employee, PROTOTYPE_DOMAIN_CONTEXT) ? "event" : "resolved",
        targetType: "money", targetId: undefined, actionLabel: "Show money" }];
    }
    const key = occurrence?.conditionKey;
    if (key === "no_receptionist" && state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.receptionist" && isEmployeeAssignedToOperationalRoom(state, employee.id))) return [];
    // Retired proxy alerts remain in saved history, but do not teach false fixes.
    if (key === "waiting_room_crowded" || item.id === "persistent.facility.waiting-room-crowded") return [];
    if (key === "dirty_cleanliness") {
      const evs = state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.evs_worker" && isEmployeeAssignedToOperationalRoom(state, employee.id));
      if (evs) return [];
      const remedy = state.rooms.some((room) => room.roomDefinitionId === "room.evs_closet") ? hireRemedy(state, "staff.evs_worker") : buildRemedy(state, "room.evs_closet");
      return [{ ...base, message: "Room cleanliness is low. EVS coverage restores it; room upgrades do not.", actionLabel: remedy?.actionLabel, action: remedy?.action, targetType: undefined, targetId: undefined }];
    }
    if (item.targetType === "water_cooler" || event?.type === "water_cooler_low") {
      if (hasAutoWaterCoverage(state)) return [];
      if (state.environment.waterCoolerFillPercent > PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.waterCoolerLowThreshold) return [{ ...base, rowKind: "resolved", message: "The water cooler was refilled.", actionLabel: undefined, targetType: undefined, targetId: undefined }];
      const action: ClinicAlertAction = { kind: "refill_water" };
      return [{ ...base, action: getClinicAlertActionProblem(state, action) ? undefined : action,
        actionLabel: getClinicAlertActionProblem(state, action) ? undefined : "Send founder to refill", targetType: undefined, targetId: undefined }];
    }
    if (item.targetType === "litter" || key === "visible_litter") {
      const litterId = item.targetId ?? state.environment.litterItems[0]?.id;
      if (!litterId || hasAutoTrashCoverage(state, litterId) || state.environment.founderActivity?.kind === "collect_litter" && state.environment.founderActivity.targetId === litterId) return [];
      const action: ClinicAlertAction = { kind: "collect_litter", litterId };
      return [{ ...base, action: getClinicAlertActionProblem(state, action) ? undefined : action,
        actionLabel: getClinicAlertActionProblem(state, action) ? undefined : "Send founder to clean", targetType: undefined, targetId: undefined }];
    }
    if (item.targetType === "advertising" || key === "advertising_recommended") {
      if (!canRecommendAdvertising(state)) return [];
      const action: ClinicAlertAction = { kind: "set_advertising", level: state.advertisingLevel + 1, fromLevel: state.advertisingLevel };
      const tier = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.advertising.levels.find((level) => level.level === action.level);
      return [{ ...base, message: "Arrivals are quiet and the clinic has capacity. Local listings can shorten the wait.", action: getClinicAlertActionProblem(state, action) ? undefined : action,
        actionLabel: getClinicAlertActionProblem(state, action) ? undefined : `Raise advertising · ${clinicMoney(tier?.hourlyCost ?? 0)}/hour`, targetType: undefined, targetId: undefined }];
    }
    if (key === "room_upgrade_requested" || item.id.startsWith("persistent.room-upgrade-requested.")) {
      const room = state.rooms.find((candidate) => candidate.id === item.targetId);
      if (!room) return [{ ...base, message: occurrence?.message ?? item.message, actionLabel: undefined, targetType: undefined, targetId: undefined }];
      const name = getRoomDefinition(room.roomDefinitionId)?.displayName ?? "Room";
      const cost = getNextRoomUpgradeCost(state, room.id);
      const action: ClinicAlertAction = { kind: "upgrade_room", roomId: room.id, expectedCost: cost ?? undefined };
      const canBuy = cost !== null && state.cash - cost >= PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.lowCashAlertThreshold && !upcomingOperatingPostingIsUnderfunded(state, PROTOTYPE_DOMAIN_CONTEXT) && !getClinicAlertActionProblem(state, action);
      return [{ ...base, message: `${name} could use an upgrade. ${getRoomUpgradePerPurchaseLabel(room.roomDefinitionId) ?? "Its next upgrade improves the room."}`,
        action: canBuy ? action : undefined, actionLabel: canBuy ? `Upgrade ${name} · ${clinicMoney(cost!)} (+${clinicMoney(getRoomDefinition(room.roomDefinitionId)?.upkeepPerUpgradeLevel ?? 0)}/hour)` : undefined, targetType: undefined, targetId: undefined }];
    }
    if (key === "unavailable_onsite_xray") {
      const remedy = missingResourceRemedy(state, { roomDefinitionId: "room.xray", staffRoleDefinitionIds: ["staff.imaging_technician"], providerRoleDefinitionIds: [], founderEligible: false, stationKind: null });
      if (!remedy) return [];
      return [{ ...base, message: "On-site X-ray coverage is unavailable for future orders. Accepted off-site work keeps its route.", ...remedy }];
    }
    if (item.targetType === "emergency_glp1" || key === "low_cash" || key === "no_cash") {
      const action: ClinicAlertAction = { kind: "emergency_consult" };
      const canRun = !getClinicAlertActionProblem(state, action);
      return [{ ...base, message: state.cash <= 0 ? "Cash is at zero. Operating costs are still accruing." : state.cash < PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.lowCashAlertThreshold ? "Cash is low. Keep operating costs funded." : "The clinic's earlier low-cash warning ended.",
        action: canRun ? action : undefined, actionLabel: canRun ? `Emergency consult · +${clinicMoney(getEmergencyGlp1Status(state).payment)}` : undefined, targetType: canRun ? "money" : undefined, targetId: undefined }];
    }
    if (item.targetType === "staff_role" && item.targetId) {
      const remedy = hireRemedy(state, item.targetId);
      return [{ ...base, action: remedy?.action, actionLabel: remedy?.actionLabel, targetType: undefined, targetId: undefined,
        message: item.message.replace("Hire one or restore their room assignment.", "Hire coverage when a staff place is free.") }];
    }
    if (item.targetType === "build_mode" && item.targetId) {
      const existing = state.rooms.find((room) => room.roomDefinitionId === item.targetId);
      const remedy = existing ? (!isRoomOperationalForFacilityWork(state, existing.id) ? accessRemedy(state, existing.id) : null) : buildRemedy(state, item.targetId);
      return [{ ...base, action: remedy?.action, actionLabel: remedy?.actionLabel, targetType: undefined, targetId: undefined }];
    }
    if (item.targetType === "patient" && item.targetId) {
      const action: ClinicAlertAction = { kind: "open_chart", encounterId: item.targetId };
      const canOpen = !getClinicAlertActionProblem(state, action);
      return [{ ...base, action: canOpen ? action : undefined, actionLabel: canOpen ? "Open chart" : undefined, targetType: undefined, targetId: undefined }];
    }
    return [base];
  });
  for (const event of state.events.filter((candidate) => candidate.type === "day_rollover")) {
    const snapshot = event.clinicDaySummary;
    const dayNumber = snapshot?.dayNumber ?? Math.floor(event.facilityTick / operatingDayMinutes(PROTOTYPE_DOMAIN_CONTEXT));
    feed.push({
      id: event.id, rowKind: "day_summary", category: "success", priority: "informational", speaker: `End of day ${dayNumber}`,
      title: `End of day ${dayNumber}`, timeLabel: facilityTimeLabel(state, event.facilityTick), sortKey: event.facilityTick - 0.0001,
      message: snapshot ? `${snapshot.patientsSeen} patients seen · ${clinicMoney(snapshot.moneyEarnedCents / 100)} earned · satisfaction ${Math.round(snapshot.satisfactionPercent)}%` : "Day ended. This older save did not record a daily summary.",
      ...(snapshot ? { daySummary: { dayNumber, patientsSeen: snapshot.patientsSeen,
        moneyEarnedLabel: clinicMoney(snapshot.moneyEarnedCents / 100), satisfactionLabel: `${Math.round(snapshot.satisfactionPercent)}%`,
        reviewLine: snapshot.reviewLine, partial: snapshot.partial } } : {}),
    });
  }
  const tipCandidates = state.alertHumor.guidanceTips?.history.length ? evaluateGuidanceTipCandidates(state) : [];
  const latestTipIds = new Map((state.alertHumor.guidanceTips?.history ?? []).map((receipt) => [`${receipt.tipId}|${receipt.targetKey}`, receipt.id]));
  for (const receipt of state.alertHumor.guidanceTips?.history ?? []) {
    const candidate = latestTipIds.get(`${receipt.tipId}|${receipt.targetKey}`) === receipt.id ? tipCandidates.find((tip) => tip.id === receipt.tipId && tip.targetKey === receipt.targetKey) : undefined;
    feed.push({ id: receipt.id, rowKind: "tip", category: "guidance", priority: "informational", speaker: receipt.speaker,
      message: receipt.message, sortKey: receipt.emittedAtTick, timeLabel: facilityTimeLabel(state, receipt.emittedAtTick),
      showAttentionMarker: false, ...(candidate?.action ? { action: { ...candidate.action, tip: { id: receipt.tipId, targetKey: receipt.targetKey } }, actionLabel: candidate.actionLabel } : {}) });
  }
  return feed.map((item) => ({ ...item, speaker: item.rowKind === "resolved" ? "Handled" : item.speaker,
    message: item.action && item.rowKind !== "tip" ? problemOnlyActionCopy(item.message) : item.message,
  })).sort((left, right) => (left.sortKey ?? 0) - (right.sortKey ?? 0)).slice(-80);
}
