import type {
  ArrivalClass,
  CurrentQuestion,
  DomainContext,
  EncounterState,
  FacilityProgressionStatus,
  GameState,
  PatientListItem,
  PatientLists,
  WorkloadSnapshot,
} from "./types";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";

const CAPACITY_LIFECYCLES = new Set([
  "waiting_unopened",
  "active_action_required",
  "active_pending_result",
]);

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

export function getWorkloadSnapshot(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): WorkloadSnapshot {
  const occupancy = Object.values(state.encounters).filter((encounter) =>
    CAPACITY_LIFECYCLES.has(encounter.lifecycle),
  ).length;
  const roomContribution = state.rooms.reduce((total, placedRoom) => {
    const definition = getRoomDefinition(placedRoom.roomDefinitionId, context);
    return total + (definition?.workloadLimitContribution ?? 0);
  }, 0);
  const staffContribution = state.employees.reduce((total, employee) => {
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

export function getPatientLists(state: GameState): PatientLists {
  const byArrivalThenId = (left: EncounterState, right: EncounterState) =>
    left.waiting.arrivedAtTick - right.waiting.arrivedAtTick ||
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
