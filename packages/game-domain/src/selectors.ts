import type {
  ArrivalClass,
  CurrentQuestion,
  DomainContext,
  EmergencyGlp1Status,
  EncounterState,
  FacilityProgressionStatus,
  GameState,
  GridPoint,
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
  getOffsitePatientTravelPresentation,
} from "./patient-travel";
import {
  validateFacilityAccess,
  type FacilityAccessValidation,
} from "./doors";

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
    (clock.dayEndHour - clock.dayStartHour) * 60;
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
            config.cooldownMinutes -
            state.facilityTick,
        );
  const cashEligible = true;
  const nextUse = usage + 1;
  const payment =
    nextUse <= config.fullPaymentUseLimit
      ? config.fullPayment
      : config.reducedPayment;
  const blockedReason = usage >= config.dailyUseCap
      ? `Daily limit reached (${config.dailyUseCap}/${config.dailyUseCap}).`
      : cooldownRemainingTicks > 0
        ? `Available in ${cooldownRemainingTicks} minute${
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
  const operatingMinutesPerDay = operatingHoursPerDay * 60;
  const elapsedFacilityMinutes = state.facilityTick;
  const dayNumber =
    Math.floor(elapsedFacilityMinutes / operatingMinutesPerDay) + 1;
  const minuteOfDay =
    elapsedFacilityMinutes % operatingMinutesPerDay;
  const hour24 =
    clock.dayStartHour + Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return {
    dayNumber,
    hour24,
    hour12,
    minute,
    meridiem,
    displayLabel: `Day ${dayNumber} ${hour12}:${minute
      .toString()
      .padStart(2, "0")} ${meridiem}`,
    operatingHoursPerDay,
    operatingMinutesPerDay,
    realMillisecondsPerFacilityHour:
      clock.realMillisecondsPerFacilityHour,
    realMillisecondsPerFacilityMinuteAt1x:
      clock.realMillisecondsPerFacilityMinuteAt1x,
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

export function getClinicSatisfaction(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number | null {
  const completed = Object.values(state.encounters)
    .filter(
      (encounter) =>
        encounter.finalPatientSatisfaction !== null &&
        encounter.resolvedAtFacilityTick !== null &&
        (encounter.resolutionReason === "completed" ||
          encounter.resolutionReason === "walkout"),
    )
    .sort(
      (left, right) =>
        (right.resolvedAtFacilityTick ?? 0) -
          (left.resolvedAtFacilityTick ?? 0) ||
        right.id.localeCompare(left.id),
    )
    .slice(
      0,
      context.balanceRelease.patientSatisfaction.rollingWindowSize,
    );
  if (completed.length === 0) {
    return null;
  }
  return Math.round(
    completed.reduce(
      (total, encounter) =>
        total + (encounter.finalPatientSatisfaction ?? 0),
      0,
    ) / completed.length,
  );
}

/** @deprecated Use getClinicSatisfaction when the unmeasured state matters. */
export function getEffectiveSatisfaction(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): number {
  return getClinicSatisfaction(state, context) ?? 0;
}

export function getFacilityAccessValidation(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): FacilityAccessValidation {
  const facility = context.balanceRelease.facility;
  return validateFacilityAccess(
    state.rooms,
    state.doors,
    (definitionId) => getRoomDefinition(definitionId, context),
    facility.gridWidth,
    facility.gridHeight,
    new Set(facility.protectedRoomDefinitionIds),
  );
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
  const effectiveSatisfaction = getClinicSatisfaction(state, context);
  const accessValidation = getFacilityAccessValidation(state, context);
  const requirements = [
    {
      id: "progression.clinical_xp",
      label: "Clinical XP",
      met: state.clinicalXp >= definition.minimumClinicalXp,
      current: state.clinicalXp,
      required: definition.minimumClinicalXp,
    },
    ...(definition.minimumCompletedEncounters > 0
      ? [
          {
            id: "progression.completed_encounters",
            label: "Completed patients",
            met:
              completedEncounters >=
              definition.minimumCompletedEncounters,
            current: completedEncounters,
            required: definition.minimumCompletedEncounters,
          },
        ]
      : []),
    {
      id: "progression.satisfaction",
      label: `Satisfaction above ${definition.satisfactionMustBeGreaterThan}%`,
      met:
        effectiveSatisfaction !== null &&
        effectiveSatisfaction >
        definition.satisfactionMustBeGreaterThan,
      current: effectiveSatisfaction ?? 0,
      required: definition.satisfactionMustBeGreaterThan + 1,
    },
    ...definition.requiredRoomDefinitionIds.map((roomDefinitionId) => {
      const room = getRoomDefinition(roomDefinitionId, context);
      const instances = state.rooms.filter(
        (candidate) =>
          candidate.roomDefinitionId === roomDefinitionId,
      );
      const functioning = instances.some(
        (instance) =>
          !accessValidation.unreachableRoomIds.includes(instance.id) &&
          !(
            roomDefinitionId === "room.xray" &&
            accessValidation.issues.some(
              (issue) =>
                issue.startsWith("X-ray Room requires") ||
                issue.startsWith(
                  "X-ray Room must share a wall",
                ),
            )
          ),
      );
      return {
        id: `progression.room.${roomDefinitionId}`,
        label: `Build ${room?.displayName ?? roomDefinitionId}`,
        met: functioning,
        current: functioning ? 1 : 0,
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
  const waitingMinutes =
    encounter.idleWaitingSinceTick === null
      ? 0
      : Math.max(0, state.facilityTick - encounter.idleWaitingSinceTick);
  const remaining = null;
  const patienceWarning =
    encounter.lifecycle === "waiting_unopened" &&
    encounter.waiting.warningThresholdsShown.length > 0;

  let statusLabel: string;
  if (encounter.patientMovement) {
    statusLabel =
      encounter.patientMovement.kind === "arriving_for_check_in"
        ? "Walking to Check-In"
        : encounter.patientMovement.kind === "walking_to_care"
          ? "Walking to Examination"
          : encounter.patientMovement.kind ===
                "departing_for_offsite_testing"
            ? "Leaving for Testing"
            : encounter.patientMovement.kind ===
                  "returning_from_offsite_testing"
              ? "Returning to Clinic"
              : encounter.patientMovement.kind === "idle_within_room"
                ? encounter.lifecycle === "waiting_unopened"
                  ? "Waiting"
                  : "Awaiting decision"
                : "Leaving Clinic";
  } else if (encounter.lifecycle === "waiting_unopened") {
    statusLabel = patienceWarning ? "Waiting - patience warning" : "Waiting";
  } else if (encounter.lifecycle === "active_action_required") {
    statusLabel = "Action required";
  } else if (encounter.lifecycle === "active_pending_result") {
    statusLabel = encounter.pendingResult?.pendingLabel ?? "Result pending";
  } else if (encounter.lifecycle === "resolved_summary_available") {
    statusLabel = "Complete - summary available";
  } else {
    statusLabel =
      encounter.resolutionReason === "walkout"
        ? "Walked out"
        : "Resolved";
  }

  return {
    encounterId: encounter.id,
    patientDisplayName: encounter.patientDisplayName,
    lifecycle: encounter.lifecycle,
    arrivalClass: encounter.arrivalClass,
    statusLabel,
    actionRequired:
      encounter.lifecycle === "active_action_required" &&
      encounter.patientMovement === null,
    pendingLabel:
      encounter.lifecycle === "active_pending_result"
        ? (encounter.pendingResult?.pendingLabel ?? null)
        : null,
    patientSatisfaction: encounter.patientSatisfaction,
    waitingMinutes,
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
  if (
    !encounter ||
    encounter.lifecycle !== "active_action_required" ||
    encounter.patientMovement !== null
  ) {
    return null;
  }
  if (
    encounter.steps[encounter.currentNodeIndex]?.status !==
    "action_required"
  ) {
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

export function getEncounterPatientLocation(
  state: GameState,
  encounterId: string,
): GridPoint | null {
  const encounter = state.encounters[encounterId];
  if (!encounter) {
    return null;
  }
  if (encounter.patientMovement !== null) {
    return encounter.patientLocation
      ? { ...encounter.patientLocation }
      : null;
  }
  return (
    getPendingPatientLocation(state, encounterId) ??
    (encounter.patientLocation
      ? { ...encounter.patientLocation }
      : null)
  );
}

export function getPendingOffsitePatientTravel(
  state: GameState,
  encounterId: string,
) {
  const pendingResult = state.encounters[encounterId]?.pendingResult;
  return pendingResult
    ? getOffsitePatientTravelPresentation(
        pendingResult,
        state.facilityTick,
        encounterId,
      )
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
  return -(roomExpense + staffExpense);
}

export function getLearningSummary(
  state: GameState,
  encounterId: string,
): string | null {
  const encounter = state.encounters[encounterId];
  if (
    !encounter ||
    encounter.resolutionReason === "walkout" ||
    (encounter.lifecycle !== "resolved_summary_available" &&
      encounter.lifecycle !== "resolved")
  ) {
    return null;
  }
  return encounter.frozenCase.learningSummary;
}
