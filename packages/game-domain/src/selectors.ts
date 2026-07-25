import type {
  ArrivalClass,
  CurrentQuestion,
  DomainContext,
  EmergencyGlp1Status,
  EncounterState,
  FacilityProgressionStatus,
  GameState,
  PatientListItem,
  PatientLists,
  WorkloadSnapshot,
} from "./types";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import {
  getOccupiedTiles,
  getRotatedFootprint,
} from "./spatial";
import {
  createFrozenServiceRouteTiming,
  getFrozenPatientTravelLocation,
} from "./patient-travel";

const CAPACITY_LIFECYCLES = new Set([
  "waiting_unopened",
  "active_action_required",
  "active_pending_result",
]);

export function getFacilityDayNumber(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number {
  const clock = context.balanceRelease.clock;
  const operatingTicksPerDay =
    (clock.dayEndHour - clock.dayStartHour) / clock.facilityHoursPerTick;
  return Math.floor(state.facilityTick / operatingTicksPerDay) + 1;
}

export function getEmergencyGlp1Status(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): EmergencyGlp1Status {
  const config = context.balanceRelease.emergencyGlp1;
  const dayNumber = getFacilityDayNumber(state, context);
  const usage =
    state.emergencyGlp1.dayNumber === dayNumber
      ? state.emergencyGlp1.usesToday
      : 0;
  const cooldownRemainingTicks =
    state.emergencyGlp1.lastUsedAtFacilityTick === null
      ? 0
      : Math.max(
          0,
          state.emergencyGlp1.lastUsedAtFacilityTick +
            config.cooldownTicks -
            state.facilityTick,
        );
  const cashEligible = state.cash < config.cashEligibilityThreshold;
  const nextUse = usage + 1;
  const payment =
    nextUse <= config.fullPaymentUseLimit
      ? config.fullPayment
      : config.reducedPayment;
  const blockedReason = !cashEligible
    ? `Available only below $${config.cashEligibilityThreshold}.`
    : usage >= config.dailyUseCap
      ? `Daily limit reached (${config.dailyUseCap}/${config.dailyUseCap}).`
      : cooldownRemainingTicks > 0
        ? `Available in ${cooldownRemainingTicks} facility hour${
            cooldownRemainingTicks === 1 ? "" : "s"
          }.`
        : null;
  return {
    dayNumber,
    usesToday: usage,
    dailyUseCap: config.dailyUseCap,
    payment,
    cooldownRemainingTicks,
    cashEligible,
    eligible: blockedReason === null,
    blockedReason,
  };
}

export function getRoomDefinition(
  roomDefinitionId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
) {
  return (
    context.balanceRelease.facility.roomDefinitions.find(
      (room) => room.id === roomDefinitionId,
    ) ?? null
  );
}

export function getStaffRoleDefinition(
  staffRoleDefinitionId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
) {
  return (
    context.balanceRelease.facility.staffRoleDefinitions.find(
      (role) => role.id === staffRoleDefinitionId,
    ) ?? null
  );
}

export function isEmployeeOperational(
  state: GameState,
  employeeId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): boolean {
  const employee = state.employees.find(
    (candidate) => candidate.id === employeeId,
  );
  const homeRoom = employee
    ? state.rooms.find((room) => room.id === employee.homeRoomInstanceId)
    : null;
  const definition = homeRoom
    ? getRoomDefinition(homeRoom.roomDefinitionId, context)
    : null;
  return Boolean(
    employee &&
      homeRoom &&
      definition &&
      getOccupiedTiles(homeRoom, definition).some(
        (point) =>
          point.x === employee.location.x &&
          point.y === employee.location.y,
      ),
  );
}

export function getCurrentCapabilities(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): Set<string> {
  const capabilities = new Set<string>();
  for (const placedRoom of state.rooms) {
    const definition = getRoomDefinition(placedRoom.roomDefinitionId, context);
    for (const capabilityId of definition?.capabilityIds ?? []) {
      capabilities.add(capabilityId);
    }
  }
  for (const employee of state.employees) {
    if (!isEmployeeOperational(state, employee.id, context)) {
      continue;
    }
    const definition = getStaffRoleDefinition(
      employee.staffRoleDefinitionId,
      context,
    );
    for (const capabilityId of definition?.capabilityIds ?? []) {
      capabilities.add(capabilityId);
    }
  }
  return capabilities;
}

export function getEligibleServiceRoute(
  state: GameState,
  serviceId: string,
  allowedRouteIds: readonly string[] | null = null,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
) {
  const service = context.balanceRelease.services.find(
    (candidate) => candidate.id === serviceId,
  );
  if (!service) {
    return null;
  }
  const capabilities = getCurrentCapabilities(state, context);
  const allowed =
    allowedRouteIds === null ? null : new Set(allowedRouteIds);
  const route =
    service.routes
      .flatMap((candidate) => {
        if (
          (allowed !== null && !allowed.has(candidate.id)) ||
          (candidate.requiredCapabilityId !== null &&
            !capabilities.has(candidate.requiredCapabilityId)) ||
          !candidate.requiredCapabilityIds.every((capabilityId) =>
            capabilities.has(capabilityId),
          )
        ) {
          return [];
        }
        const timing = createFrozenServiceRouteTiming(
          state,
          context,
          candidate,
        );
        return timing ? [{ route: candidate, timing }] : [];
      })
      .sort(
        (left, right) =>
          left.route.preference - right.route.preference ||
          left.timing.durationTicks - right.timing.durationTicks ||
          left.route.id.localeCompare(right.route.id),
      )[0] ?? null;
  return route ? { service, route: route.route, timing: route.timing } : null;
}

export function getAnswerChoiceServicePreview(
  state: GameState,
  encounterId: string,
  answerChoiceId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
) {
  const question = getCurrentQuestion(state, encounterId, context);
  const choice = question?.node.answerChoices.find(
    (candidate) => candidate.id === answerChoiceId,
  );
  const serviceId = choice?.serviceRequest?.serviceId;
  if (!choice || !serviceId) {
    return null;
  }
  const allowedRouteIds =
    question?.node.resultGateAfter?.resultTypeId === serviceId
      ? question.node.resultGateAfter.allowedServiceRouteIds
      : null;
  const selected = getEligibleServiceRoute(
    state,
    serviceId,
    allowedRouteIds,
    context,
  );
  if (!selected) {
    return {
      answerChoiceId,
      serviceId,
      serviceDisplayName: serviceId,
      routeId: null,
      routeDisplayName: null,
      durationTicks: null,
    };
  }
  return {
    answerChoiceId,
    serviceId,
    serviceDisplayName: selected.service.displayName,
    routeId: selected.route.id,
    routeDisplayName: selected.route.displayName,
    durationTicks: selected.timing.durationTicks,
  };
}

export function getFacilityClock(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
) {
  const clock = context.balanceRelease.clock;
  const operatingHoursPerDay = clock.dayEndHour - clock.dayStartHour;
  const elapsedFacilityHours =
    state.facilityTick * clock.facilityHoursPerTick;
  const dayNumber = Math.floor(elapsedFacilityHours / operatingHoursPerDay) + 1;
  const hour24 =
    clock.dayStartHour + (elapsedFacilityHours % operatingHoursPerDay);
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return {
    dayNumber,
    hour24,
    hour12,
    meridiem,
    displayLabel: `Day ${dayNumber} ${hour12} ${meridiem}`,
    operatingHoursPerDay,
    realMillisecondsPerFacilityHour:
      clock.realMillisecondsPerFacilityHour,
  };
}

export function getWorkloadSnapshot(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): WorkloadSnapshot {
  const occupancy = Object.values(state.encounters).filter((encounter) =>
    CAPACITY_LIFECYCLES.has(encounter.lifecycle),
  ).length;
  const roomContribution = state.rooms.reduce((total, placedRoom) => {
    const definition = getRoomDefinition(placedRoom.roomDefinitionId, context);
    return (
      total +
      (definition?.workloadLimitContribution ?? 0) +
      (definition?.workloadLimitContributionPerUpgradeLevel ?? 0) *
        Math.max(0, placedRoom.upgradeLevel - 1)
    );
  }, 0);
  const staffContribution = state.employees.reduce((total, employee) => {
    if (!isEmployeeOperational(state, employee.id, context)) {
      return total;
    }
    const definition = getStaffRoleDefinition(
      employee.staffRoleDefinitionId,
      context,
    );
    return total + (definition?.workloadLimitContribution ?? 0);
  }, 0);
  const routineLimit =
    context.balanceRelease.workload.baseRoutineLimit +
    roomContribution +
    staffContribution;
  const criticalLimit =
    routineLimit + context.balanceRelease.workload.criticalReservedSlots;

  return {
    occupancy,
    routineLimit,
    criticalLimit,
    atRoutineCapacity: occupancy >= routineLimit,
    overRoutineCapacity: occupancy > routineLimit,
  };
}

export function getRoomInstanceFootprint(
  state: GameState,
  roomId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): { width: number; height: number } | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  return room && definition
    ? getRotatedFootprint(definition, room.orientation)
    : null;
}

export function getEffectiveRoomUpkeep(
  state: GameState,
  roomId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  return room && definition
    ? definition.upkeepPerExpenseInterval +
        definition.upkeepPerUpgradeLevel *
          Math.max(0, room.upgradeLevel - 1)
    : null;
}

export function getNextRoomUpgradeCost(
  state: GameState,
  roomId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  if (
    !room ||
    !definition ||
    room.upgradeLevel >= definition.maximumUpgradeLevel
  ) {
    return null;
  }
  return definition.upgradeCosts[room.upgradeLevel - 1] ?? null;
}

export function getRoomResaleValue(
  state: GameState,
  roomId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  if (!room || !definition) {
    return null;
  }
  const upgradeInvestment = definition.upgradeCosts
    .slice(0, Math.max(0, room.upgradeLevel - 1))
    .reduce((total, cost) => total + cost, 0);
  return Math.floor(
    ((definition.constructionCost + upgradeInvestment) *
      context.balanceRelease.facility.roomResalePercent) /
      100,
  );
}

export function getStaffRoleCount(
  state: GameState,
  staffRoleDefinitionId: string,
): number {
  return state.employees.filter(
    (employee) =>
      employee.staffRoleDefinitionId === staffRoleDefinitionId,
  ).length;
}

export function getBestServiceDurationReductionPercent(
  state: GameState,
  requiredCapabilityIds: readonly string[],
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number {
  const required = new Set(requiredCapabilityIds);
  return state.rooms.reduce((best, room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (
      !definition ||
      !definition.capabilityIds.some((capabilityId) =>
        required.has(capabilityId),
      )
    ) {
      return best;
    }
    return Math.max(
      best,
      definition.serviceDurationReductionPercentPerUpgradeLevel *
        Math.max(0, room.upgradeLevel - 1),
    );
  }, 0);
}

export function getCompletedEncounterCount(state: GameState): number {
  return Object.values(state.encounters).filter(
    (encounter) => encounter.resolutionReason === "completed",
  ).length;
}

export function getFacilityProgressionStatus(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): FacilityProgressionStatus {
  const definition = context.balanceRelease.facility.stageDefinitions.find(
    (stage) => stage.level === state.facilityLevel,
  );
  if (!definition) {
    throw new Error(
      `Missing progression definition for Level ${state.facilityLevel}.`,
    );
  }
  const placedRoomTypes = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const hiredRoleTypes = new Set(
    state.employees.map((employee) => employee.staffRoleDefinitionId),
  );
  const completedEncounters = getCompletedEncounterCount(state);
  const requirements = [
    {
      id: "progression.clinical_xp",
      label: "Clinical XP",
      met: state.clinicalXp >= definition.minimumClinicalXp,
      current: state.clinicalXp,
      required: definition.minimumClinicalXp,
    },
    {
      id: "progression.completed_encounters",
      label: "Completed patients",
      met: completedEncounters >= definition.minimumCompletedEncounters,
      current: completedEncounters,
      required: definition.minimumCompletedEncounters,
    },
    {
      id: "progression.satisfaction",
      label: `Satisfaction above ${definition.satisfactionMustBeGreaterThan}%`,
      met: state.satisfaction > definition.satisfactionMustBeGreaterThan,
      current: state.satisfaction,
      required: definition.satisfactionMustBeGreaterThan + 1,
    },
    ...definition.requiredRoomDefinitionIds.map((roomDefinitionId) => {
      const room = getRoomDefinition(roomDefinitionId, context);
      return {
        id: `progression.room.${roomDefinitionId}`,
        label: `Build ${room?.displayName ?? roomDefinitionId}`,
        met: placedRoomTypes.has(roomDefinitionId),
        current: placedRoomTypes.has(roomDefinitionId) ? 1 : 0,
        required: 1,
      };
    }),
    ...definition.requiredStaffRoleIds.map((staffRoleDefinitionId) => {
      const role = getStaffRoleDefinition(staffRoleDefinitionId, context);
      return {
        id: `progression.staff.${staffRoleDefinitionId}`,
        label: `Hire ${role?.displayName ?? staffRoleDefinitionId}`,
        met: hiredRoleTypes.has(staffRoleDefinitionId),
        current: hiredRoleTypes.has(staffRoleDefinitionId) ? 1 : 0,
        required: 1,
      };
    }),
  ];
  return {
    facilityLevel: state.facilityLevel,
    displayName: definition.displayName,
    requirements,
    eligible:
      definition.nextFacilityLevel !== null &&
      requirements.every((requirement) => requirement.met),
    nextFacilityLevel:
      definition.nextFacilityLevel === 1 ? definition.nextFacilityLevel : null,
    maximumPlayableLevel:
      context.balanceRelease.facility.maximumPlayableLevel,
  };
}

export function canAdmitPatient(
  state: GameState,
  arrivalClass: ArrivalClass,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): boolean {
  const workload = getWorkloadSnapshot(state, context);
  return arrivalClass === "routine"
    ? workload.occupancy < workload.routineLimit
    : workload.occupancy < workload.criticalLimit;
}

function toPatientListItem(state: GameState, encounter: EncounterState): PatientListItem {
  const remaining =
    encounter.lifecycle === "waiting_unopened" &&
    encounter.waiting.departureDueTick !== null
      ? Math.max(0, encounter.waiting.departureDueTick - state.facilityTick)
      : null;
  const patienceWarning =
    encounter.lifecycle === "waiting_unopened" &&
    encounter.waiting.warningThresholdsShown.length > 0;

  let statusLabel: string;
  if (encounter.lifecycle === "waiting_unopened") {
    statusLabel = patienceWarning ? "Waiting - patience warning" : "Waiting";
  } else if (encounter.lifecycle === "active_action_required") {
    statusLabel = "Action required";
  } else if (encounter.lifecycle === "active_pending_result") {
    statusLabel = encounter.pendingResult?.pendingLabel ?? "Result pending";
  } else if (encounter.lifecycle === "resolved_summary_available") {
    statusLabel = "Complete - summary available";
  } else {
    statusLabel =
      encounter.resolutionReason === "left_before_seen"
        ? "Left before being seen"
        : "Resolved";
  }

  return {
    encounterId: encounter.id,
    patientDisplayName: encounter.patientDisplayName,
    lifecycle: encounter.lifecycle,
    arrivalClass: encounter.arrivalClass,
    statusLabel,
    actionRequired: encounter.lifecycle === "active_action_required",
    pendingLabel:
      encounter.lifecycle === "active_pending_result"
        ? (encounter.pendingResult?.pendingLabel ?? null)
        : null,
    patienceRemainingTicks: remaining,
    patienceWarning,
  };
}

function getResolutionTick(
  state: GameState,
  encounter: EncounterState,
): number {
  if (encounter.settlementId !== null) {
    const settlement = state.settlements.find(
      (candidate) => candidate.id === encounter.settlementId,
    );
    if (settlement) {
      return settlement.settledAtFacilityTick;
    }
  }

  let resolutionEventTick: number | null = null;
  for (const event of state.events) {
    if (
      event.encounterId === encounter.id &&
      (event.type === "encounter_settled" ||
        event.type === "left_before_seen") &&
      (resolutionEventTick === null ||
        event.facilityTick > resolutionEventTick)
    ) {
      resolutionEventTick = event.facilityTick;
    }
  }
  if (resolutionEventTick !== null) {
    return resolutionEventTick;
  }

  const latestAnswerTick = encounter.answers.reduce(
    (latest, answer) => Math.max(latest, answer.answeredAtFacilityTick),
    Number.NEGATIVE_INFINITY,
  );
  if (Number.isFinite(latestAnswerTick)) {
    return latestAnswerTick;
  }

  if (encounter.waiting.departureDueTick !== null) {
    return encounter.waiting.departureDueTick + 1;
  }
  return encounter.waiting.arrivedAtTick;
}

export function getPatientLists(state: GameState): PatientLists {
  const byArrivalThenId = (left: EncounterState, right: EncounterState) =>
    left.waiting.arrivedAtTick - right.waiting.arrivedAtTick ||
    left.id.localeCompare(right.id);
  const byNewestResolution = (
    left: EncounterState,
    right: EncounterState,
  ) =>
    getResolutionTick(state, right) - getResolutionTick(state, left) ||
    right.waiting.arrivedAtTick - left.waiting.arrivedAtTick ||
    left.id.localeCompare(right.id);
  const encounters = Object.values(state.encounters).sort(byArrivalThenId);

  return {
    waiting: encounters
      .filter((encounter) => encounter.lifecycle === "waiting_unopened")
      .map((encounter) => toPatientListItem(state, encounter)),
    active: encounters
      .filter(
        (encounter) =>
          encounter.lifecycle === "active_action_required" ||
          encounter.lifecycle === "active_pending_result" ||
          encounter.lifecycle === "resolved_summary_available",
      )
      .map((encounter) => toPatientListItem(state, encounter)),
    resolved: encounters
      .filter((encounter) => encounter.lifecycle === "resolved")
      .sort(byNewestResolution)
      .map((encounter) => toPatientListItem(state, encounter)),
  };
}

export function getCurrentQuestion(
  state: GameState,
  encounterId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): CurrentQuestion | null {
  const encounter = state.encounters[encounterId];
  if (!encounter || encounter.lifecycle !== "active_action_required") {
    return null;
  }
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex];
  if (!node) {
    return null;
  }

  return {
    encounterId,
    caseDisplayName: encounter.frozenCase.displayName,
    presentation: encounter.frozenCase.presentation,
    resultNarratives: [...encounter.deliveredResultNarratives],
    node,
    questionNumber: encounter.currentNodeIndex + 1,
    questionCount: encounter.frozenCase.decisionNodes.length,
    syntheticDisclaimer: context.clinicalRelease.disclaimer,
  };
}

export function getPendingResultEta(
  state: GameState,
  encounterId: string,
): number | null {
  const pendingResult = state.encounters[encounterId]?.pendingResult;
  if (!pendingResult || pendingResult.deliveredAtTick !== null) {
    return null;
  }
  return Math.max(0, pendingResult.dueTick - state.facilityTick);
}

export function getPendingPatientLocation(
  state: GameState,
  encounterId: string,
) {
  const travel = state.encounters[encounterId]?.pendingResult?.patientTravel;
  return travel
    ? getFrozenPatientTravelLocation(travel, state.facilityTick)
    : null;
}

export function getEncounterSettlement(
  state: GameState,
  encounterId: string,
) {
  const settlementId = state.encounters[encounterId]?.settlementId;
  return settlementId
    ? (state.settlements.find(
        (settlement) => settlement.id === settlementId,
      ) ?? null)
    : null;
}

export function getOperatingExpensePerFacilityHour(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number {
  const roomExpense = state.rooms.reduce((total, room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) {
      return total;
    }
    return (
      total +
      definition.upkeepPerExpenseInterval +
      (room.upgradeLevel - 1) * definition.upkeepPerUpgradeLevel
    );
  }, 0);
  const staffExpense = state.employees.reduce(
    (total, employee) => total + employee.salaryPerExpenseInterval,
    0,
  );
  return (
    -(roomExpense + staffExpense) /
    (context.balanceRelease.economy.expenseIntervalTicks *
      context.balanceRelease.clock.facilityHoursPerTick)
  );
}

export function getLearningSummary(
  state: GameState,
  encounterId: string,
): string | null {
  const encounter = state.encounters[encounterId];
  if (
    !encounter ||
    encounter.resolutionReason === "left_before_seen" ||
    (encounter.lifecycle !== "resolved_summary_available" &&
      encounter.lifecycle !== "resolved")
  ) {
    return null;
  }
  return encounter.frozenCase.learningSummary;
}
