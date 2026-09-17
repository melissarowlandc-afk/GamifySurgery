import { renderPrototypeAlert } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
} from "./context";
import { validateFacilityAccess } from "./doors";
import { getOccupiedTiles } from "./spatial";
import type {
  DomainContext,
  FacilityConditionAlertTarget,
  FacilityConditionOccurrenceState,
  FacilityExperienceConditionKey,
  GameState,
  PatientDissatisfactionCause,
} from "./types";

const MAX_FACILITY_CONDITION_OCCURRENCES = 500;
const FACILITY_EXPERIENCE_CONDITION_KEYS =
  new Set<FacilityExperienceConditionKey>([
    "visible_litter",
    "dirty_cleanliness",
    "empty_water_cooler",
    "missing_waiting_room",
    "missing_examination_room",
    "missing_bathroom",
    "no_receptionist",
    "low_staff_morale",
    "unavailable_onsite_xray",
  ]);

export interface FacilityExperienceCondition {
  conditionKey: FacilityExperienceConditionKey;
  penalty: number;
  cause: PatientDissatisfactionCause;
}

export interface FacilityExperienceEvaluation {
  conditions: FacilityExperienceCondition[];
  totalPenalty: number;
}

function roomDefinition(
  context: DomainContext,
  definitionId: string,
) {
  return (
    context.balanceRelease.facility.roomDefinitions.find(
      (definition) => definition.id === definitionId,
    ) ?? null
  );
}

function staffDefinition(
  context: DomainContext,
  definitionId: string,
) {
  return (
    context.balanceRelease.facility.staffRoleDefinitions.find(
      (definition) => definition.id === definitionId,
    ) ?? null
  );
}

function accessValidation(
  state: GameState,
  context: DomainContext,
) {
  return validateFacilityAccess(
    state.rooms,
    state.doors,
    (definitionId) => roomDefinition(context, definitionId),
    context.balanceRelease.facility.gridWidth,
    context.balanceRelease.facility.gridHeight,
    new Set(
      context.balanceRelease.facility.protectedRoomDefinitionIds,
    ),
  );
}

function isRoomAvailable(
  state: GameState,
  definitionId: string,
  unreachableRoomIds: ReadonlySet<string>,
): boolean {
  return state.rooms.some(
    (room) =>
      room.roomDefinitionId === definitionId &&
      !unreachableRoomIds.has(room.id),
  );
}

function isEmployeeOperational(
  state: GameState,
  employeeId: string,
  unreachableRoomIds: ReadonlySet<string>,
  context: DomainContext,
): boolean {
  const employee = state.employees.find(
    (candidate) => candidate.id === employeeId,
  );
  const homeRoom = employee
    ? state.rooms.find(
        (candidate) => candidate.id === employee.homeRoomInstanceId,
      )
    : null;
  const definition = homeRoom
    ? roomDefinition(context, homeRoom.roomDefinitionId)
    : null;
  return Boolean(
    employee &&
      homeRoom &&
      definition &&
      !unreachableRoomIds.has(homeRoom.id) &&
      getOccupiedTiles(homeRoom, definition).some(
        (point) =>
          point.x === employee.location.x &&
          point.y === employee.location.y,
      ),
  );
}

function hasOperationalImagingTechnician(
  state: GameState,
  unreachableRoomIds: ReadonlySet<string>,
  context: DomainContext,
): boolean {
  return state.employees.some((employee) => {
    if (
      employee.staffRoleDefinitionId !==
        "staff.imaging_technician" ||
      !isEmployeeOperational(
        state,
        employee.id,
        unreachableRoomIds,
        context,
      )
    ) {
      return false;
    }
    return Boolean(
      staffDefinition(context, employee.staffRoleDefinitionId)
        ?.capabilityIds.includes(
          "capability.staff.imaging_technician",
        ),
    );
  });
}

function isUnlocked(
  state: GameState,
  context: DomainContext,
  definitionId: string,
): boolean {
  const definition = roomDefinition(context, definitionId);
  return Boolean(
    definition &&
      definition.unlockFacilityLevel <= state.facilityLevel,
  );
}

function hasCheckedInPatient(state: GameState): boolean {
  return Object.values(state.encounters).some((encounter) => {
    if (
      encounter.resolutionReason !== null ||
      encounter.patientLocation === null
    ) {
      return false;
    }
    const movementKind = encounter.patientMovement?.kind;
    return (
      movementKind !== "arriving_for_check_in" &&
      movementKind !== "returning_from_offsite_testing" &&
      movementKind !== "departing_for_offsite_testing" &&
      movementKind !== "leaving_after_walkout" &&
      movementKind !== "leaving_after_resolution"
    );
  });
}

/**
 * The single source of truth for current, reversible clinic-environment
 * pressure. It is deliberately pure so admissions, HUD selectors, progression,
 * tests, and alert-occurrence materialization cannot drift apart.
 */
export function evaluateFacilityExperienceConditions(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): FacilityExperienceEvaluation {
  const config =
    context.balanceRelease.patientSatisfaction
      .facilityConditionPenalties;
  const conditions: FacilityExperienceCondition[] = [];
  const validation = accessValidation(state, context);
  const unreachableRoomIds = new Set(
    validation.unreachableRoomIds,
  );
  const clinicalRooms = state.rooms.filter(
    (room) =>
      roomDefinition(context, room.roomDefinitionId)?.kind !==
      "hallway",
  );
  const averageCleanliness =
    clinicalRooms.length === 0
      ? 100
      : clinicalRooms.reduce(
          (sum, room) => sum + (room.cleanliness ?? 100),
          0,
        ) / clinicalRooms.length;

  const litterPenalty = Math.min(
    config.visibleLitterMaximum,
    state.environment.litterItems.length *
      config.visibleLitterPerItem,
  );
  if (litterPenalty > 0) {
    conditions.push({
      conditionKey: "visible_litter",
      penalty: litterPenalty,
      cause: "poor_cleanliness",
    });
  }
  if (
    averageCleanliness <=
      context.balanceRelease.patientSatisfaction
        .dirtyRoomThreshold &&
    config.dirtyCleanliness > 0
  ) {
    conditions.push({
      conditionKey: "dirty_cleanliness",
      penalty: config.dirtyCleanliness,
      cause: "poor_cleanliness",
    });
  }
  if (
    state.environment.waterCoolerFillPercent <= 0 &&
    config.emptyWaterCooler > 0
  ) {
    conditions.push({
      conditionKey: "empty_water_cooler",
      penalty: config.emptyWaterCooler,
      cause: "missing_amenities",
    });
  }

  if (
    isUnlocked(state, context, "room.waiting") &&
    !isRoomAvailable(
      state,
      "room.waiting",
      unreachableRoomIds,
    ) &&
    config.missingWaitingRoom > 0
  ) {
    conditions.push({
      conditionKey: "missing_waiting_room",
      penalty: config.missingWaitingRoom,
      cause: "missing_amenities",
    });
  }
  if (
    isUnlocked(state, context, "room.examination") &&
    !isRoomAvailable(
      state,
      "room.examination",
      unreachableRoomIds,
    ) &&
    config.missingExaminationRoom > 0
  ) {
    conditions.push({
      conditionKey: "missing_examination_room",
      penalty: config.missingExaminationRoom,
      cause: "missing_amenities",
    });
  }
  if (
    isUnlocked(state, context, "room.bathroom") &&
    !isRoomAvailable(
      state,
      "room.bathroom",
      unreachableRoomIds,
    ) &&
    config.missingBathroom > 0
  ) {
    conditions.push({
      conditionKey: "missing_bathroom",
      penalty: config.missingBathroom,
      cause: "missing_amenities",
    });
  }
  const receptionistDefinition = staffDefinition(
    context,
    "staff.receptionist",
  );
  const receptionistAvailable = state.employees.some(
    (employee) =>
      employee.staffRoleDefinitionId === "staff.receptionist" &&
      isEmployeeOperational(
        state,
        employee.id,
        unreachableRoomIds,
        context,
      ),
  );
  if (
    receptionistDefinition &&
    receptionistDefinition.unlockFacilityLevel <=
      state.facilityLevel &&
    hasCheckedInPatient(state) &&
    !receptionistAvailable &&
    config.noReceptionist > 0
  ) {
    conditions.push({
      conditionKey: "no_receptionist",
      penalty: config.noReceptionist,
      cause: "no_receptionist",
    });
  }
  const lowMoraleEmployee = state.employees
    .filter(
      (employee) =>
        employee.morale <=
        context.balanceRelease.patientSatisfaction
          .unhappyStaffMoraleThreshold,
    )
    .sort(
      (left, right) =>
        left.morale - right.morale ||
        left.id.localeCompare(right.id),
    )[0];
  if (lowMoraleEmployee && config.lowStaffMorale > 0) {
    conditions.push({
      conditionKey: "low_staff_morale",
      penalty: config.lowStaffMorale,
      cause: "general",
    });
  }

  const xrayDefinition = roomDefinition(context, "room.xray");
  if (
    xrayDefinition &&
    xrayDefinition.unlockFacilityLevel <= state.facilityLevel
  ) {
    const xrayRoomsAvailable = isRoomAvailable(
      state,
      "room.xray",
      unreachableRoomIds,
    );
    const controlAvailable = isRoomAvailable(
      state,
      "room.imaging_control",
      unreachableRoomIds,
    );
    const xrayConnectionInvalid = validation.issues.some(
      (issue) =>
        issue.startsWith(`${xrayDefinition.displayName} `) &&
        (issue.includes("Imaging Control Room") ||
          issue.includes("patient-facing door")),
    );
    const onsiteXrayAvailable =
      xrayRoomsAvailable &&
      controlAvailable &&
      !xrayConnectionInvalid &&
      hasOperationalImagingTechnician(
        state,
        unreachableRoomIds,
        context,
      );
    if (
      !onsiteXrayAvailable &&
      config.unavailableOnsiteXray > 0
    ) {
      conditions.push({
        conditionKey: "unavailable_onsite_xray",
        penalty: config.unavailableOnsiteXray,
        cause: "imaging_unavailable",
      });
    }
  }

  return {
    conditions,
    totalPenalty: Math.min(
      config.maximumTotal,
      conditions.reduce(
        (sum, condition) => sum + condition.penalty,
        0,
      ),
    ),
  };
}

function firstActivePatientName(state: GameState): string | undefined {
  return Object.values(state.encounters).find(
    (encounter) => encounter.resolutionReason === null,
  )?.patientDisplayName;
}

function occurrencePresentation(
  state: GameState,
  conditionKey: FacilityExperienceConditionKey,
  context: DomainContext,
): {
  definitionId: string;
  message: string;
  priority: "action_required" | "informational";
  target: FacilityConditionAlertTarget | null;
} {
  const patientName = firstActivePatientName(state);
  const firstLitter = state.environment.litterItems[0];
  const dirtiestRoom = [...state.rooms].sort(
    (left, right) =>
      (left.cleanliness ?? 100) - (right.cleanliness ?? 100),
  )[0];
  const averageCleanliness =
    state.rooms.length === 0
      ? 100
      : Math.round(
          state.rooms.reduce(
            (sum, room) => sum + (room.cleanliness ?? 100),
            0,
          ) / state.rooms.length,
        );
  const lowMoraleEmployee = state.employees
    .filter(
      (employee) =>
        employee.morale <=
        context.balanceRelease.patientSatisfaction
          .unhappyStaffMoraleThreshold,
    )
    .sort(
      (left, right) =>
        left.morale - right.morale ||
        left.id.localeCompare(right.id),
    )[0];
  const configured = (() => {
    switch (conditionKey) {
      case "visible_litter":
        {
          const teachingComplete =
            state.environment
              .trashTeachingAcknowledgedAtTick !== null;
          const definitionId = teachingComplete
            ? "alert.patient.cleanliness-complaint"
            : "alert.environment.trash-visible";
        return {
          definitionId,
          values: {
            patient_name: patientName,
          },
          priority: "informational" as const,
          target: firstLitter
            ? ({
                kind: "litter",
                id: firstLitter.id,
              } satisfies FacilityConditionAlertTarget)
            : null,
        };
        }
      case "dirty_cleanliness":
        return {
          definitionId: "alert.facility.cleanliness-low",
          values: { cleanliness: averageCleanliness },
          priority: "action_required" as const,
          target: dirtiestRoom
            ? ({
                kind: "room",
                id: dirtiestRoom.id,
              } satisfies FacilityConditionAlertTarget)
            : null,
        };
      case "empty_water_cooler":
        return {
          definitionId: "alert.environment.water-empty",
          values: {},
          priority: "action_required" as const,
          target: {
            kind: "water_cooler",
            id: "water-cooler.front-desk",
          } satisfies FacilityConditionAlertTarget,
        };
      case "missing_waiting_room":
        return {
          definitionId: "alert.facility.waiting-room-needed",
          values: { patient_name: patientName },
          priority: "informational" as const,
          target: {
            kind: "build_mode",
            id: "room.waiting",
          } satisfies FacilityConditionAlertTarget,
        };
      case "missing_examination_room":
        return {
          definitionId: "alert.facility.private-exam-needed",
          values: { patient_name: patientName },
          priority: "action_required" as const,
          target: {
            kind: "build_mode",
            id: "room.examination",
          } satisfies FacilityConditionAlertTarget,
        };
      case "missing_bathroom":
        return {
          definitionId: "alert.facility.bathroom-needed",
          values: { patient_name: patientName },
          priority: "informational" as const,
          target: {
            kind: "build_mode",
            id: "room.bathroom",
          } satisfies FacilityConditionAlertTarget,
        };
      case "no_receptionist":
        return {
          definitionId: "alert.staff.receptionist-recommended",
          values: {},
          priority: "informational" as const,
          target: {
            kind: "staff_role",
            id: "staff.receptionist",
          } satisfies FacilityConditionAlertTarget,
        };
      case "low_staff_morale":
        return {
          definitionId: "alert.staff.morale-low",
          values: {
            employee_name: lowMoraleEmployee?.displayName,
            morale: lowMoraleEmployee?.morale,
          },
          priority: "action_required" as const,
          target: lowMoraleEmployee
            ? ({
                kind: "employee",
                id: lowMoraleEmployee.id,
              } satisfies FacilityConditionAlertTarget)
            : null,
        };
      case "unavailable_onsite_xray":
        {
          const xrayRoomExists = state.rooms.some(
            (room) => room.roomDefinitionId === "room.xray",
          );
          const imagingTechnicianExists = state.employees.some(
            (employee) =>
              employee.staffRoleDefinitionId ===
              "staff.imaging_technician",
          );
          if (xrayRoomExists && !imagingTechnicianExists) {
            return {
              definitionId:
                "alert.staff.imaging-technician-needed",
              values: { patient_name: patientName },
              priority: "informational" as const,
              target: {
                kind: "staff_role",
                id: "staff.imaging_technician",
              } satisfies FacilityConditionAlertTarget,
            };
          }
        return {
          definitionId: "alert.facility.onsite-imaging-requested",
          values: { patient_name: patientName },
          priority: "informational" as const,
          target: {
            kind: "build_mode",
            id: "room.xray",
          } satisfies FacilityConditionAlertTarget,
        };
        }
    }
  })();
  const rendered = renderPrototypeAlert(
    configured.definitionId,
    configured.values,
  );
  return {
    definitionId: rendered.definitionId,
    message: rendered.body,
    priority: configured.priority,
    target: configured.target,
  };
}

export function appendFacilityConditionOccurrence(
  state: GameState,
  input: Omit<FacilityConditionOccurrenceState, "id">,
): FacilityConditionOccurrenceState {
  state.environment.facilityConditionOccurrenceSequence += 1;
  const occurrence: FacilityConditionOccurrenceState = {
    id: `facility-condition.${input.conditionKey}.${state.environment.facilityConditionOccurrenceSequence}`,
    ...input,
  };
  state.environment.facilityConditionOccurrences.push(occurrence);
  while (
    state.environment.facilityConditionOccurrences.length >
    MAX_FACILITY_CONDITION_OCCURRENCES
  ) {
    const removableIndex =
      state.environment.facilityConditionOccurrences.findIndex(
        (candidate) =>
          candidate.resolvedAtFacilityTick !== null,
      );
    if (removableIndex < 0) {
      break;
    }
    state.environment.facilityConditionOccurrences.splice(
      removableIndex,
      1,
    );
  }
  return occurrence;
}

/**
 * Materializes condition onset/resolution history without deleting old rows.
 * The player feed can therefore remove attention from a resolved occurrence
 * while letting ordinary later messages push that row out naturally.
 */
export function synchronizeFacilityConditionOccurrences(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): void {
  const evaluation = evaluateFacilityExperienceConditions(
    state,
    context,
  );
  const shouldMaterialize = (
    conditionKey: FacilityExperienceConditionKey,
  ): boolean => {
    const checkedInWaiting = Object.values(state.encounters).filter(
      (encounter) =>
        encounter.lifecycle === "waiting_unopened" &&
        encounter.patientMovement?.kind !==
          "arriving_for_check_in" &&
        encounter.patientMovement?.kind !==
          "leaving_after_walkout",
    );
    if (conditionKey === "visible_litter") {
      return (
        state.environment.trashTeachingAcknowledgedAtTick === null ||
        state.environment.litterItems.length >= 2
      );
    }
    if (conditionKey === "missing_examination_room") {
      if (state.facilityLevel === 0) {
        return (
          state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]
            ?.lifecycle === "resolved"
        );
      }
      return checkedInWaiting.length > 0;
    }
    if (conditionKey === "missing_waiting_room") {
      return state.facilityLevel === 1 && checkedInWaiting.length > 0;
    }
    if (conditionKey === "missing_bathroom") {
      const firstWaitingPatient = checkedInWaiting[0];
      return Boolean(
        state.facilityLevel === 1 &&
          firstWaitingPatient &&
          state.facilityTick -
            firstWaitingPatient.waiting.arrivedAtTick >=
            30,
      );
    }
    if (conditionKey === "no_receptionist") {
      return state.facilityLevel === 1 && checkedInWaiting.length > 0;
    }
    if (conditionKey === "unavailable_onsite_xray") {
      return Object.values(state.encounters).some(
        (encounter) =>
          encounter.lifecycle === "active_pending_result" &&
          encounter.pendingResult?.resultTypeId === "service.xray" &&
          encounter.pendingResult.routeId ===
            "route.xray.outsourced" &&
          encounter.pendingResult.deliveredAtTick === null,
      );
    }
    return true;
  };
  const activeKeys = new Set(
    evaluation.conditions
      .filter((condition) =>
        shouldMaterialize(condition.conditionKey),
      )
      .map((condition) => condition.conditionKey),
  );
  for (const occurrence of state.environment
    .facilityConditionOccurrences) {
    if (
      occurrence.resolvedAtFacilityTick === null &&
      FACILITY_EXPERIENCE_CONDITION_KEYS.has(
        occurrence.conditionKey as FacilityExperienceConditionKey,
      ) &&
      !activeKeys.has(
        occurrence.conditionKey as FacilityExperienceConditionKey,
      )
    ) {
      occurrence.resolvedAtFacilityTick = state.facilityTick;
    }
  }

  for (const condition of evaluation.conditions) {
    if (!shouldMaterialize(condition.conditionKey)) {
      continue;
    }
    const presentation = occurrencePresentation(
      state,
      condition.conditionKey,
      context,
    );
    const activeOccurrence =
      state.environment.facilityConditionOccurrences.find(
        (occurrence) =>
          occurrence.conditionKey === condition.conditionKey &&
          occurrence.resolvedAtFacilityTick === null,
      );
    const targetMatches =
      activeOccurrence?.target?.kind ===
        presentation.target?.kind &&
      activeOccurrence?.target?.id === presentation.target?.id;
    if (
      activeOccurrence &&
      activeOccurrence.definitionId ===
        presentation.definitionId &&
      targetMatches
    ) {
      continue;
    }
    if (activeOccurrence) {
      activeOccurrence.resolvedAtFacilityTick =
        state.facilityTick;
    }
    appendFacilityConditionOccurrence(state, {
      conditionKey: condition.conditionKey,
      kind: "onset",
      occurredAtFacilityTick: state.facilityTick,
      resolvedAtFacilityTick: null,
      ...presentation,
    });
  }

  const waterIsEmpty =
    state.environment.waterCoolerFillPercent <= 0;
  if (!waterIsEmpty) {
    state.environment.waterCoolerEmptySinceTick = null;
    state.environment.nextWaterCoolerReminderTick = null;
    return;
  }
  if (state.environment.waterCoolerEmptySinceTick === null) {
    state.environment.waterCoolerEmptySinceTick =
      state.facilityTick;
    state.environment.nextWaterCoolerReminderTick =
      state.facilityTick +
      context.balanceRelease.environment
        .waterCoolerEmptyReminderMinutes;
  }
  const reminderInterval =
    context.balanceRelease.environment
      .waterCoolerEmptyReminderMinutes;
  while (
    state.environment.nextWaterCoolerReminderTick !== null &&
    state.environment.nextWaterCoolerReminderTick <=
      state.facilityTick
  ) {
    const reminderTick =
      state.environment.nextWaterCoolerReminderTick;
    // A reminder is the newest actionable occurrence. Older rows remain in
    // chronological history but no longer retain competing attention marks.
    for (const occurrence of state.environment
      .facilityConditionOccurrences) {
      if (
        occurrence.conditionKey === "empty_water_cooler" &&
        occurrence.resolvedAtFacilityTick === null
      ) {
        occurrence.resolvedAtFacilityTick = reminderTick;
      }
    }
    appendFacilityConditionOccurrence(state, {
      conditionKey: "empty_water_cooler",
      kind: "reminder",
      occurredAtFacilityTick: reminderTick,
      resolvedAtFacilityTick: null,
      definitionId: "alert.environment.water-empty",
      message:
        "The water cooler has remained empty for a full clinic day. Refill it.",
      priority: "action_required",
      target: {
        kind: "water_cooler",
        id: "water-cooler.front-desk",
      },
    });
    state.environment.nextWaterCoolerReminderTick =
      reminderTick + reminderInterval;
  }
}
