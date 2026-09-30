import {
  PROTOTYPE_ALERT_SCHEDULING,
  getPrototypeAlertDefinition,
  isPrototypeEventSuppressedFromPlayerFeed,
  renderPrototypeAlert,
} from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  alertCadencePolicy,
  employeeDepartureRiskCadenceGroup,
  employeeDepartureRiskIsActive,
  evaluateFacilityOperationalAlertConditions,
  getFacilityProgressionStatus,
  getOperationalGlp1AutomationCapacity,
  isEmployeeAssignedToOperationalRoom,
  isRoomOperationalForFacilityWork,
  operatingDayMinutes,
  patientDepartureRiskIsActive,
  getRoomNavigableTiles,
  getRoomDefinition,
  type DomainEvent,
  type FacilityAlertConditionKey,
  type FacilityConditionOccurrenceState,
  type GameState,
} from "@gamify-surgery/game-domain";
import type {
  MessageBoardItemView,
  MessageBoardTargetType,
} from "../ui";

function facilityTimeLabel(tick: number): string {
  const clock = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock;
  const minutesPerDay =
    (clock.dayEndHour - clock.dayStartHour) * 60;
  const day = Math.floor(tick / minutesPerDay) + 1;
  const minuteOfDay = tick % minutesPerDay;
  const hour24 =
    clock.dayStartHour + Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `Day ${day}, ${hour12}:${minute
    .toString()
    .padStart(2, "0")} ${hour24 >= 12 ? "PM" : "AM"}`;
}

function configuredAlertCopy(
  definitionId: string,
  values: Readonly<Record<string, string>>,
): { title: string; message: string } {
  const rendered = renderPrototypeAlert(definitionId, values);
  return {
    title: rendered.title,
    message: rendered.body,
  };
}

export interface LevelTwoOperationalGuidance {
  definitionId: string;
  message: string;
  targetType: MessageBoardTargetType;
  targetId?: string;
  actionLabel: string;
}

/** Stable setup rows; employee movement alone must not change them. */
export function getLevelTwoOperationalGuidance(
  state: GameState,
): LevelTwoOperationalGuidance[] {
  if (state.facilityLevel === 0) return [];
  const roomsFor = (definitionId: string) => state.rooms.filter(
    (room) => room.roomDefinitionId === definitionId,
  );
  const hasBuilt = (definitionId: string) => roomsFor(definitionId).length > 0;
  const hasOperationalRoom = (definitionId: string) => roomsFor(definitionId).some(
    (room) => isRoomOperationalForFacilityWork(state, room.id),
  );
  const hasAssignedStaff = (roleDefinitionId: string) => state.employees.some(
    (employee) => employee.staffRoleDefinitionId === roleDefinitionId &&
      isEmployeeAssignedToOperationalRoom(state, employee.id),
  );
  const roomAction = (definitionId: string, message: string) => ({
    targetType: "build_mode" as const,
    targetId: definitionId,
    actionLabel: "Open Build Mode",
    message,
  });
  const hiringAction = (roleDefinitionId: string, message: string) => ({
    targetType: "staff_role" as const,
    targetId: roleDefinitionId,
    actionLabel: "Show hiring",
    message,
  });
  const rows: LevelTwoOperationalGuidance[] = [];
  if (hasBuilt("room.endoscopy") &&
    (!hasOperationalRoom("room.endoscopy") || !hasOperationalRoom("room.periop_recovery"))) {
    const missingRoom = !hasOperationalRoom("room.periop_recovery")
      ? "room.periop_recovery"
      : "room.endoscopy";
    rows.push({
      definitionId: "alert.facility.endoscopy-inoperable",
      ...roomAction(
        missingRoom,
        missingRoom === "room.periop_recovery"
          ? "Endoscopy cannot run without an operational Peri-op Recovery Room. Build or reconnect it."
          : "Endoscopy cannot run because its room is not operational. Restore operational access.",
      ),
    });
  } else if (hasBuilt("room.endoscopy") &&
    (!hasAssignedStaff("staff.endoscopy_nurse") || !hasAssignedStaff("staff.periop_nurse"))) {
    const missingRole = !hasAssignedStaff("staff.endoscopy_nurse")
      ? "staff.endoscopy_nurse"
      : "staff.periop_nurse";
    rows.push({
      definitionId: "alert.facility.endoscopy-inoperable",
      ...hiringAction(
        missingRole,
        missingRole === "staff.endoscopy_nurse"
          ? "Endoscopy has room capacity but needs an Endoscopy Nurse. Hire one or restore their room assignment."
          : "Endoscopy has room capacity but needs a Peri-op Nurse. Hire one or restore their room assignment.",
      ),
    });
  }
  const builtImaging = ["room.ultrasound", "room.xray", "room.ct"].find(hasBuilt);
  const inoperableImaging = ["room.ultrasound", "room.xray", "room.ct"].find(
    (definitionId) => hasBuilt(definitionId) && !hasOperationalRoom(definitionId),
  );
  if (builtImaging && inoperableImaging) {
    const roomName = getRoomDefinition(inoperableImaging)?.displayName ?? "This imaging room";
    rows.push({ definitionId: "alert.facility.imaging-inoperable", ...roomAction(inoperableImaging, `${roomName} is not operational. Restore operational access.`) });
  } else if (builtImaging && !hasAssignedStaff("staff.imaging_technician")) {
    const roomName = getRoomDefinition(builtImaging)?.displayName ?? "This imaging room";
    rows.push({ definitionId: "alert.facility.imaging-inoperable", ...hiringAction("staff.imaging_technician", `${roomName} is operational but needs an Imaging Technician. Hire one or restore their room assignment.`) });
  }
  if (state.facilityLevel !== 2) {
    return rows;
  }
  if (hasBuilt("room.phlebotomy") && !hasOperationalRoom("room.phlebotomy")) {
    rows.push({ definitionId: "alert.facility.phlebotomy-inoperable", ...roomAction("room.phlebotomy", "The Phlebotomy Station is not operational. Restore operational access.") });
  } else if (hasBuilt("room.phlebotomy") && !hasAssignedStaff("staff.phlebotomist")) {
    rows.push({ definitionId: "alert.facility.phlebotomy-inoperable", ...hiringAction("staff.phlebotomist", "The Phlebotomy Station is operational but needs a Phlebotomist. Hire one or restore their room assignment.") });
  }
  if (hasBuilt("room.evs_closet") && !hasOperationalRoom("room.evs_closet")) {
    rows.push({ definitionId: "alert.facility.evs-inoperable", ...roomAction("room.evs_closet", "The EVS Closet is not operational. Restore operational access.") });
  } else if (hasBuilt("room.evs_closet") && !hasAssignedStaff("staff.evs_worker")) {
    rows.push({ definitionId: "alert.facility.evs-inoperable", ...hiringAction("staff.evs_worker", "The EVS Closet is operational but needs an EVS Worker. Hire one or restore their room assignment.") });
  }
  if (hasBuilt("room.glp1_telehealth_suite") && !hasOperationalRoom("room.glp1_telehealth_suite")) {
    rows.push({ definitionId: "alert.facility.glp1-inoperable", ...roomAction("room.glp1_telehealth_suite", "The telehealth suite is not operational. Restore operational access.") });
  } else if (hasBuilt("room.glp1_telehealth_suite") && getOperationalGlp1AutomationCapacity(state) === 0) {
    rows.push({ definitionId: "alert.facility.glp1-inoperable", ...hiringAction("staff.glp1_np", "The telehealth suite is operational but needs NP coverage before automation can begin. Hire one or restore their room assignment.") });
  }
  return rows;
}

function getNextProgressionGuidance(
  state: GameState,
): LevelTwoOperationalGuidance | null {
  if (
    state.facilityLevel === 0 ||
    [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].some(
      (encounterId) =>
        state.encounters[encounterId]?.resolutionReason !== "completed",
    )
  ) {
    return null;
  }
  const progression = getFacilityProgressionStatus(state);
  if (progression.eligible) return null;
  const unmet = progression.requirements.filter((requirement) => !requirement.met);
  const nextRequirement = unmet.find((requirement) =>
    requirement.id.startsWith("progression.room.") ||
    requirement.id.startsWith("progression.staff."),
  ) ?? unmet[0];
  if (!nextRequirement) return null;

  const roomPrefix = "progression.room.";
  const staffPrefix = "progression.staff.";
  const goalLabel = progression.nextFacilityLevel === null
    ? "the current clinic goal"
    : "the next level";
  const target = nextRequirement.id.startsWith(roomPrefix)
    ? {
        targetType: "build_mode" as const,
        targetId: nextRequirement.id.slice(roomPrefix.length),
        actionLabel: "Open Build Mode",
      }
    : nextRequirement.id.startsWith(staffPrefix)
      ? {
          targetType: "staff_role" as const,
          targetId: nextRequirement.id.slice(staffPrefix.length),
          actionLabel: "Show hiring",
        }
      : {
          targetType: "goal" as const,
          actionLabel: "View goals",
        };
  const message = nextRequirement.id.startsWith(roomPrefix)
    ? `${nextRequirement.label.replace(/^Build /, "")} is needed for ${goalLabel}. Build it or restore its access.`
    : nextRequirement.id.startsWith(staffPrefix)
      ? `${nextRequirement.label} to work toward ${goalLabel}. Open hiring to add that role.`
      : nextRequirement.id === "progression.clinical_xp"
        ? `Complete patient encounters to earn Clinical XP for ${goalLabel} (${nextRequirement.current}/${nextRequirement.required}).`
      : nextRequirement.id === "progression.completed_encounters"
          ? `Finish patient encounters for ${goalLabel} (${nextRequirement.current}/${nextRequirement.required}).`
      : nextRequirement.id === "progression.satisfaction"
            ? `Complete visits with better satisfaction for ${goalLabel} (${nextRequirement.current}/${nextRequirement.required}).`
      : nextRequirement.id === "progression.endoscopy_completion"
              ? `Complete your first endoscopy to finish the current clinic goal (${nextRequirement.current}/${nextRequirement.required}).`
              : `${nextRequirement.label} is needed for ${goalLabel} (${nextRequirement.current}/${nextRequirement.required}).`;
  return {
    definitionId: "alert.progress.next-step",
    message,
    ...target,
  };
}

function eventTarget(
  event: DomainEvent,
): Pick<MessageBoardItemView, "targetType" | "targetId" | "actionLabel"> {
  if (
    event.alertCategory === "ambient_flavor" ||
    event.alertCategory === "walkout_review" ||
    event.definitionId === "alert.patient.leaving"
  ) {
    return {};
  }
  if (
    event.type === "water_cooler_low" ||
    event.type === "water_cooler_refilled"
  ) {
    return {
      targetType: "water_cooler",
      actionLabel: "Show water cooler",
    };
  }
  if (
    event.definitionId === "alert.patient.check-in-unattended" &&
    event.target?.kind === "room"
  ) {
    return {
      targetType: "room",
      targetId: event.target.id,
      actionLabel: "Show Front Desk",
    };
  }
  if (event.target?.kind === "encounter" || event.encounterId) {
    return {
      targetType: "patient",
      targetId: event.target?.id ?? event.encounterId ?? undefined,
      actionLabel: "Open chart",
    };
  }
  if (event.target?.kind === "room") {
    return {
      targetType: "room",
      targetId: event.target.id,
      actionLabel: "Show room",
    };
  }
  if (event.target?.kind === "employee") {
    return {
      targetType: "employee",
      targetId: event.target.id,
      actionLabel: "Show employee",
    };
  }
  if (event.type === "facility_level_advanced") {
    return { targetType: "goal", actionLabel: "View goals" };
  }
  return {};
}

function conditionOccurrenceTarget(
  occurrence: FacilityConditionOccurrenceState,
): Pick<
  MessageBoardItemView,
  "targetType" | "targetId" | "actionLabel"
> {
  const target = occurrence.target;
  if (!target) {
    return {};
  }
  switch (target.kind) {
    case "litter":
      return {
        targetType: "litter",
        targetId: target.id,
        actionLabel: "Show trash",
      };
    case "water_cooler":
      return {
        targetType: "water_cooler",
        targetId: target.id,
        actionLabel: "Show water cooler",
      };
    case "build_mode":
      return {
        targetType: "build_mode",
        targetId: target.id,
        actionLabel: "Open Build Mode",
      };
    case "room":
      return {
        targetType: "room",
        targetId: target.id,
        actionLabel: "Show room",
      };
    case "staff_role":
      return {
        targetType: "staff_role",
        targetId: target.id,
        actionLabel: "Show hiring",
      };
    case "employee":
      return {
        targetType: "employee",
        targetId: target.id,
        actionLabel: "Show employee",
      };
    case "emergency_glp1":
      return {
        targetType: "emergency_glp1",
        targetId: target.id,
        actionLabel: "Open emergency cash option",
      };
    case "advertising":
      return {
        targetType: "advertising",
        targetId: target.id,
        actionLabel: "Show Advertising",
      };
    case "goal":
      return {
        targetType: "goal",
        targetId: target.id,
        actionLabel: "View goals",
      };
  }
}

const CLINIC_WIDE_COMPLAINT_DEFINITION_IDS = new Set([
  "alert.facility.private-exam-needed",
  "alert.staff.receptionist-recommended",
  "alert.facility.onsite-imaging-requested",
  "alert.staff.imaging-technician-needed",
  "alert.facility.waiting-room-needed",
  "alert.facility.bathroom-needed",
  "alert.patient.cleanliness-complaint",
  "alert.patient.room-upgrade-requested",
  "alert.facility.waiting-room-crowded",
]);

function conditionOccurrenceToMessage(
  occurrence: FacilityConditionOccurrenceState,
  isLatestForCondition: boolean,
): MessageBoardItemView {
  const unresolved = occurrence.resolvedAtFacilityTick === null;
  const requiresAttention =
    unresolved &&
    isLatestForCondition &&
    occurrence.priority === "action_required";
  const rendered = renderPrototypeAlert(occurrence.definitionId);
  const message = CLINIC_WIDE_COMPLAINT_DEFINITION_IDS.has(
    occurrence.definitionId,
  )
    ? rendered.body
    : occurrence.message;
  return {
    id: occurrence.id,
    priority: requiresAttention
      ? "action_required"
      : "informational",
    category: requiresAttention ? "action_required" : "guidance",
    showAttentionMarker: requiresAttention,
    title: rendered.title,
    message,
    timeLabel: facilityTimeLabel(occurrence.occurredAtFacilityTick),
    sortKey: occurrence.occurredAtFacilityTick,
    persistent: false,
    ...(unresolved && isLatestForCondition
      ? conditionOccurrenceTarget(occurrence)
      : {}),
  };
}

function fallbackEventTitle(event: DomainEvent): string {
  switch (event.type) {
    case "patient_arrived":
      return "New patient";
    case "ambient_message":
      return "Around the clinic";
    case "success_message":
      return "Clinic success";
    case "patience_warning":
      return "Patient waiting";
    case "left_before_seen":
      return "Patient left";
    case "employee_discussion_decision":
      return "Team learning decision";
    case "clinical_decision_recorded":
      return event.definitionId === "event.clinical.decision-correct"
        ? "Decision recorded"
        : "Corrective review";
    case "result_ready":
      return "Results ready";
    case "encounter_settled":
      return "Encounter complete";
    case "room_placed":
      return "Construction complete";
    case "room_moved":
      return "Room moved";
    case "room_rotated":
      return "Room rotated";
    case "door_placed":
      return "Door placed";
    case "door_removed":
      return "Door removed";
    case "room_sold":
      return "Room sold";
    case "room_upgraded":
      return "Upgrade complete";
    case "staff_hired":
      return "Employee hired";
    case "staff_fired":
      return "Employee fired";
    case "staff_quit":
      return "Employee quit";
    case "staff_departure_risk":
      return "Employee may quit soon";
    case "staff_salary_changed":
      return "Salary updated";
    case "facility_level_advanced":
      return "Level complete";
    case "day_rollover":
      return "New clinic day";
    case "operating_expense":
      return "Clinic expenses";
    case "development_money_added":
      return "Prototype tool";
    case "emergency_glp1_consultation":
      return "Emergency side business";
    case "litter_appeared":
      return "Facility update";
    case "litter_collected":
      return "Clean-up complete";
    case "water_cooler_low":
      return "Water cooler";
    case "water_cooler_refilled":
      return "Water cooler refilled";
    case "employee_praised":
      return "Staff update";
  }
}

function eventContentValues(
  state: GameState,
  event: DomainEvent,
): Record<string, string | number> {
  const encounter = event.encounterId
    ? state.encounters[event.encounterId]
    : event.target?.kind === "encounter"
      ? state.encounters[event.target.id]
      : undefined;
  const room =
    event.target?.kind === "room"
      ? state.rooms.find((candidate) => candidate.id === event.target?.id)
      : undefined;
  const employee =
    event.target?.kind === "employee"
      ? state.employees.find(
          (candidate) => candidate.id === event.target?.id,
        )
      : undefined;
  return {
    patient_name: encounter?.patientDisplayName ?? "The patient",
    patient_id: encounter?.id ?? "the-patient",
    room_name:
      (room
        ? getRoomDefinition(room.roomDefinitionId)?.displayName
        : null) ?? "The room",
    room_id: room?.id ?? "the-room",
    employee_name: employee?.displayName ?? "The employee",
    employee_id: employee?.id ?? "the-employee",
    amount: Math.abs(event.reward?.cashDelta ?? 0),
    cleanliness: room?.cleanliness ?? 100,
    morale: employee?.morale ?? 100,
    level: state.facilityLevel,
  };
}

function effectiveEventDefinitionId(
  state: GameState,
  event: DomainEvent,
): string | undefined {
  const room =
    event.target?.kind === "room"
      ? state.rooms.find((candidate) => candidate.id === event.target?.id)
      : undefined;
  const employee =
    event.target?.kind === "employee"
      ? state.employees.find(
          (candidate) => candidate.id === event.target?.id,
        )
      : undefined;
  if (
    event.type === "staff_hired" &&
    employee?.staffRoleDefinitionId === "staff.receptionist"
  ) {
    return "alert.success.receptionist-hired";
  }
  if (
    event.type === "staff_hired" &&
    employee?.staffRoleDefinitionId === "staff.imaging_technician"
  ) {
    return "alert.success.imaging-technician-hired";
  }
  if (
    event.type === "room_placed" &&
    room?.roomDefinitionId === "room.waiting"
  ) {
    return "alert.success.waiting-room-constructed";
  }
  if (
    event.type === "room_placed" &&
    room?.roomDefinitionId === "room.xray"
  ) {
    return "alert.success.xray-constructed";
  }
  if (event.type === "water_cooler_refilled") {
    return "alert.success.water-refilled";
  }
  if (event.type === "litter_collected") {
    return "alert.success.trash-cleaned";
  }
  if (event.type === "room_upgraded") {
    return "alert.success.room-upgraded";
  }
  return event.definitionId;
}

function eventCategory(
  event: DomainEvent,
  definitionId: string | undefined,
): MessageBoardItemView["category"] {
  const definition = definitionId
    ? getPrototypeAlertDefinition(definitionId)
    : undefined;
  return (
    event.alertCategory ??
    definition?.category ??
    (event.type === "left_before_seen"
      ? "walkout_review"
      : event.priority === "action_required" ||
          event.priority === "critical"
        ? "action_required"
        : event.priority === "flavor"
          ? "ambient_flavor"
          : "success")
  );
}

function eventPriority(
  event: DomainEvent,
): MessageBoardItemView["priority"] {
  return event.type === "left_before_seen"
    ? "informational"
    : (event.priority ??
      (event.type === "patient_arrived" ||
      event.type === "result_ready" ||
      event.type === "patience_warning"
        ? "action_required"
        : "informational"));
}

function attentionGroup(event: DomainEvent): string | null {
  if (
    event.encounterId &&
    (event.type === "patient_arrived" ||
      event.type === "patience_warning" ||
      event.type === "result_ready" ||
      event.type === "encounter_settled")
  ) {
    return `patient:${event.encounterId}`;
  }
  if (event.type === "water_cooler_low") {
    return "environment:water-cooler";
  }
  if (
    event.type === "staff_departure_risk" &&
    event.target?.kind === "employee"
  ) {
    return `staff:${event.target.id}:departure-risk`;
  }
  return null;
}

function attentionConditionActive(
  state: GameState,
  event: DomainEvent,
): boolean {
  const definitionId = effectiveEventDefinitionId(state, event);
  if (eventCategory(event, definitionId) !== "action_required") {
    return false;
  }

  if (event.type === "water_cooler_low") {
    return (
      state.environment.waterCoolerFillPercent <=
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment
        .waterCoolerLowThreshold
    );
  }

  if (
    definitionId === "alert.staff.departure-risk" &&
    event.target?.kind === "employee"
  ) {
    const employee = state.employees.find(
      (candidate) => candidate.id === event.target?.id,
    );
    return Boolean(
      employee &&
        employeeDepartureRiskIsActive(
          state,
          employee,
          PROTOTYPE_DOMAIN_CONTEXT,
        ),
    );
  }

  const encounter = event.encounterId
    ? state.encounters[event.encounterId]
    : undefined;
  if (definitionId === "alert.patient.check-in-unattended") {
    return encounter?.checkInStatus === "awaiting_staff";
  }
  if (
    event.type === "patient_arrived" ||
    event.type === "patience_warning" ||
    event.type === "result_ready" ||
    event.type === "encounter_settled"
  ) {
    if (!encounter || encounter.lifecycle === "resolved") {
      return false;
    }
    if (event.definitionId === "alert.patient.leaving") {
      return (
        encounter.patientMovement?.kind ===
        "leaving_after_walkout"
      );
    }
    if (event.type === "patient_arrived") {
      if (event.definitionId === "alert.patient.decision-required") {
        return (
          encounter.feedAttentionKind === "clinical_decision" &&
          state.openChartEncounterId !== encounter.id
        );
      }
      return (
        encounter.feedAttentionKind === "checked_in" &&
        state.openChartEncounterId !== encounter.id
      );
    }
    if (definitionId === "alert.patient.departure-risk") {
      return patientDepartureRiskIsActive(state, encounter);
    }
    if (event.type === "patience_warning") {
      return (
        (encounter.lifecycle === "waiting_unopened" ||
          encounter.lifecycle === "active_action_required") &&
        state.openChartEncounterId !== encounter.id &&
        encounter.patientMovement?.kind !==
          "leaving_after_walkout"
      );
    }
    if (event.type === "encounter_settled") {
      return encounter.lifecycle === "resolved_summary_available";
    }
    return (
      encounter.feedAttentionKind === "result_ready" &&
      state.openChartEncounterId !== encounter.id
    );
  }

  // One-shot actionable events without a modeled resolution condition retain
  // their authored marker. Condition-backed alerts are resolved above.
  return true;
}

function eventToMessage(
  state: GameState,
  event: DomainEvent,
  attentionActive: boolean,
): MessageBoardItemView {
  const definitionId = effectiveEventDefinitionId(state, event);
  const definition = definitionId
    ? getPrototypeAlertDefinition(definitionId)
    : undefined;
  const originalCategory = eventCategory(event, definitionId);
  const originalPriority = eventPriority(event);
  const wasActionable = originalCategory === "action_required";
  const category =
    wasActionable && !attentionActive
      ? "guidance"
      : originalCategory;
  const priority =
    wasActionable && !attentionActive
      ? "informational"
      : originalPriority;
  const rendered = definition
    ? renderPrototypeAlert(
        definition,
        eventContentValues(state, event),
        event.alertVariantId,
      )
    : null;
  return {
    id: event.id,
    priority,
    category,
    showAttentionMarker: wasActionable && attentionActive,
    // Reducer events freeze the selected, rendered copy so later catalog edits
    // do not rewrite a campaign's recent history on reload.
    message: event.message,
    title: rendered?.title ?? fallbackEventTitle(event),
    timeLabel: facilityTimeLabel(event.facilityTick),
    sortKey: event.facilityTick,
    persistent: false,
    ...(wasActionable && !attentionActive
      ? {}
      : eventTarget(event)),
  };
}

function persistentPatientMessages(
  state: GameState,
  recentEvents: readonly DomainEvent[],
): MessageBoardItemView[] {
  return Object.values(state.encounters).flatMap((encounter) => {
    const warningTick = encounter.departureRiskWarningAtTick;
    if (
      warningTick == null ||
      !patientDepartureRiskIsActive(state, encounter) ||
      recentEvents.some(
        (event) =>
          event.encounterId === encounter.id &&
          event.definitionId === "alert.patient.departure-risk",
      )
    ) return [];
    const configuredCopy = configuredAlertCopy(
      "alert.patient.departure-risk",
      { patient_name: encounter.patientDisplayName },
    );
    return [{
      id: `event.patient-departure-risk.${encounter.id}`,
      priority: "critical",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(warningTick),
      actionLabel: "Open chart",
      targetType: "patient",
      targetId: encounter.id,
      sortKey: warningTick,
      persistent: true,
    } satisfies MessageBoardItemView];
  });
}

function persistentSystemMessages(
  state: GameState,
  recentEvents: readonly DomainEvent[],
  materializedConditionKeys: ReadonlySet<FacilityAlertConditionKey>,
): MessageBoardItemView[] {
  const messages: MessageBoardItemView[] = [];
  const lowCashThreshold =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1
      .lowCashAlertThreshold;
  if (
    state.cash > 0 &&
    state.cash < lowCashThreshold &&
    !materializedConditionKeys.has("low_cash")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.finance.low-cash",
      { threshold: String(lowCashThreshold) },
    );
    messages.push({
      id: "persistent.finance.low-cash",
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "emergency_glp1",
      actionLabel: "Open emergency cash option",
      sortKey: 0.06,
      persistent: true,
    });
  }
  const secondTutorial =
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
  const hasExaminationRoom = state.rooms.some(
    (room) => room.roomDefinitionId === "room.examination",
  );
  if (
    state.facilityLevel === 0 &&
    secondTutorial?.lifecycle === "resolved" &&
    !hasExaminationRoom &&
    !materializedConditionKeys.has("missing_examination_room")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.facility.private-exam-needed",
      { patient_name: secondTutorial.patientDisplayName },
    );
    messages.push({
      id: "persistent.facility.private-exam-needed",
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "goal",
      actionLabel: "View goal",
      sortKey:
        (secondTutorial.resolvedAtFacilityTick ??
          secondTutorial.waiting.arrivedAtTick) + 0.065,
      persistent: true,
    });
  }

  const checkedInWaiting = Object.values(state.encounters).filter(
    (encounter) =>
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement?.kind !== "arriving_for_check_in" &&
      encounter.patientMovement?.kind !== "leaving_after_walkout",
  );
  const hasReceptionist = state.employees.some(
    (employee) =>
      employee.staffRoleDefinitionId === "staff.receptionist",
  );
  if (
    state.facilityLevel === 1 &&
    checkedInWaiting.length > 0 &&
    !hasReceptionist &&
    !materializedConditionKeys.has("no_receptionist")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.staff.receptionist-recommended",
      {},
    );
    messages.push({
      id: "persistent.staff.receptionist-recommended",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "staff_role",
      targetId: "staff.receptionist",
      actionLabel: "Show receptionist hiring",
      sortKey:
        Math.min(
          ...checkedInWaiting.map(
            (encounter) => encounter.waiting.arrivedAtTick,
          ),
        ) + 0.054,
      persistent: true,
    });
  }

  const pendingOffsiteXray = Object.values(state.encounters).find(
    (encounter) =>
      encounter.lifecycle === "active_pending_result" &&
      encounter.pendingResult?.resultTypeId === "service.xray" &&
      encounter.pendingResult.routeId === "route.xray.outsourced" &&
      encounter.pendingResult.deliveredAtTick === null,
  );
  if (
    pendingOffsiteXray &&
    !materializedConditionKeys.has("unavailable_onsite_xray")
  ) {
    const hasXrayRoom = state.rooms.some(
      (room) => room.roomDefinitionId === "room.xray",
    );
    const hasImagingTechnician = state.employees.some(
      (employee) =>
        employee.staffRoleDefinitionId ===
        "staff.imaging_technician",
    );
    if (!hasXrayRoom) {
      const configuredCopy = configuredAlertCopy(
        "alert.facility.onsite-imaging-requested",
        { patient_name: pendingOffsiteXray.patientDisplayName },
      );
      messages.push({
        id: "persistent.facility.onsite-imaging-requested",
        priority: "informational",
        category: "guidance",
        showAttentionMarker: false,
        title: configuredCopy.title,
        message: configuredCopy.message,
        timeLabel: facilityTimeLabel(state.facilityTick),
        targetType: "build_mode",
        actionLabel: "Open Build Mode",
        sortKey:
          pendingOffsiteXray.pendingResult!.scheduledAtTick + 0.043,
        persistent: true,
      });
    } else if (!hasImagingTechnician) {
      const configuredCopy = configuredAlertCopy(
        "alert.staff.imaging-technician-needed",
        { patient_name: pendingOffsiteXray.patientDisplayName },
      );
      messages.push({
        id: "persistent.staff.imaging-technician-needed",
        priority: "informational",
        category: "guidance",
        showAttentionMarker: false,
        title: configuredCopy.title,
        message: configuredCopy.message,
        timeLabel: facilityTimeLabel(state.facilityTick),
        targetType: "staff_role",
        targetId: "staff.imaging_technician",
        actionLabel: "Show imaging technician hiring",
        sortKey:
          pendingOffsiteXray.pendingResult!.scheduledAtTick + 0.055,
        persistent: true,
      });
    }
  }

  const firstWaitingPatient = checkedInWaiting[0];
  if (
    state.facilityLevel === 1 &&
    firstWaitingPatient &&
    !state.rooms.some(
      (room) => room.roomDefinitionId === "room.waiting",
    ) &&
    !materializedConditionKeys.has("missing_waiting_room")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.facility.waiting-room-needed",
      { patient_name: firstWaitingPatient.patientDisplayName },
    );
    messages.push({
      id: "persistent.facility.waiting-room-needed",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "build_mode",
      actionLabel: "Open Build Mode",
      sortKey: firstWaitingPatient.waiting.arrivedAtTick + 0.041,
      persistent: true,
    });
  }
  if (
    state.facilityLevel === 1 &&
    firstWaitingPatient &&
    state.facilityTick - firstWaitingPatient.waiting.arrivedAtTick >=
      30 &&
    !state.rooms.some(
      (room) => room.roomDefinitionId === "room.bathroom",
    ) &&
    !materializedConditionKeys.has("missing_bathroom")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.facility.bathroom-needed",
      { patient_name: firstWaitingPatient.patientDisplayName },
    );
    messages.push({
      id: "persistent.facility.bathroom-needed",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "build_mode",
      actionLabel: "Open Build Mode",
      sortKey: firstWaitingPatient.waiting.arrivedAtTick + 30.04,
      persistent: true,
    });
  }

  const firstLitter = state.environment.litterItems[0];
  const dirtiestRoom = [...state.rooms].sort(
    (left, right) =>
      (left.cleanliness ?? 100) - (right.cleanliness ?? 100),
  )[0];
  const cleanlinessRoom =
    (dirtiestRoom?.cleanliness ?? 100) <=
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
      .dirtyRoomThreshold
      ? dirtiestRoom
      : null;
  const trashTeachingComplete =
    state.environment.trashTeachingAcknowledgedAtTick !== null;
  if (
    firstLitter &&
    !trashTeachingComplete &&
    !materializedConditionKeys.has("visible_litter")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.environment.trash-visible",
      {},
    );
    messages.push({
      id: "persistent.environment.trash-visible",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "litter",
      targetId: firstLitter.id,
      actionLabel: "Show trash",
      sortKey: firstLitter.spawnedAtFacilityTick + 0.0395,
      persistent: true,
    });
  }
  const complaintPatient =
    checkedInWaiting[0] ??
    Object.values(state.encounters).find(
      (encounter) =>
        encounter.lifecycle === "active_action_required" &&
        encounter.patientLocation !== null &&
        encounter.patientMovement?.kind !==
          "departing_for_offsite_testing" &&
        encounter.patientMovement?.kind !==
          "returning_from_offsite_testing",
    );
  const cleanlinessComplaintDefinition =
    getPrototypeAlertDefinition(
      "alert.patient.cleanliness-complaint",
    );
  const trashLessonSeparationElapsed =
    state.facilityTick -
      (state.environment.trashTeachingAcknowledgedAtTick ?? 0) >=
    (cleanlinessComplaintDefinition?.cooldownMinutes ?? 45);
  const trashHasAccumulated =
    state.environment.litterItems.length >=
    PROTOTYPE_ALERT_SCHEDULING.dirtyClinicComplaintMinimumLitterItems;
  if (
    trashTeachingComplete &&
    trashLessonSeparationElapsed &&
    complaintPatient &&
    firstLitter &&
    (trashHasAccumulated || cleanlinessRoom) &&
    !materializedConditionKeys.has("visible_litter") &&
    !materializedConditionKeys.has("dirty_cleanliness")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.patient.cleanliness-complaint",
      {
        patient_name: complaintPatient.patientDisplayName,
        patient_id: complaintPatient.id,
      },
    );
    messages.push({
      id: "persistent.environment.trash-accumulated",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      sortKey:
        Math.max(
          firstLitter.spawnedAtFacilityTick,
          (state.environment.trashTeachingAcknowledgedAtTick ?? 0) +
            (cleanlinessComplaintDefinition?.cooldownMinutes ?? 45),
        ) + 0.039,
      persistent: true,
      targetType: "litter",
      targetId: firstLitter.id,
      actionLabel: "Show trash",
    });
  }

  const roomUpgradeComplaintDefinition =
    getPrototypeAlertDefinition(
      "alert.patient.room-upgrade-requested",
    );
  const roomUpgradeComplaint = Object.values(state.encounters)
    .filter(
      (encounter) =>
        encounter.lifecycle === "waiting_unopened" ||
        encounter.lifecycle === "active_action_required" ||
        encounter.lifecycle === "active_pending_result",
    )
    .map((encounter) => ({
      encounter,
      room: encounter.assignedRoomInstanceId
        ? state.rooms.find(
            (candidate) =>
              candidate.id === encounter.assignedRoomInstanceId,
          )
        : undefined,
    }))
    .find(({ encounter, room }) => {
      const definition = room
        ? getRoomDefinition(room.roomDefinitionId)
        : undefined;
      if (
        state.facilityLevel !== 1 ||
        !room ||
        !definition ||
        !encounter.patientLocation
      ) {
        return false;
      }
      const patientOccupiesRoom = getRoomNavigableTiles(
        room,
        definition,
        state.doors,
      ).some(
        (point) =>
          point.x === encounter.patientLocation?.x &&
          point.y === encounter.patientLocation.y,
      );
      return (
        patientOccupiesRoom &&
        encounter.patientMovement?.kind !==
          "departing_for_offsite_testing" &&
        encounter.patientMovement?.kind !==
          "returning_from_offsite_testing" &&
        room.upgradeLevel === 1 &&
        definition.maximumUpgradeLevel > 1 &&
        encounter.patientSatisfaction < 90 &&
        state.facilityTick - encounter.waiting.arrivedAtTick >=
          (roomUpgradeComplaintDefinition?.cooldownMinutes ?? 60)
      );
    });
  if (
    roomUpgradeComplaint?.room &&
    !materializedConditionKeys.has("room_upgrade_requested")
  ) {
    const roomName =
      getRoomDefinition(
        roomUpgradeComplaint.room.roomDefinitionId,
      )?.displayName ?? "the room";
    const configuredCopy = configuredAlertCopy(
      "alert.patient.room-upgrade-requested",
      {
        patient_name:
          roomUpgradeComplaint.encounter.patientDisplayName,
        patient_id: roomUpgradeComplaint.encounter.id,
        room_name: roomName,
        room_id: roomUpgradeComplaint.room.id,
      },
    );
    messages.push({
      id: `persistent.room-upgrade-requested.${roomUpgradeComplaint.room.id}`,
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "room",
      targetId: roomUpgradeComplaint.room.id,
      actionLabel: "Show room",
      sortKey:
        roomUpgradeComplaint.encounter.waiting.arrivedAtTick +
        (roomUpgradeComplaintDefinition?.cooldownMinutes ?? 60) +
        0.0385,
      persistent: true,
    });
  }

  const hasRetainedWaterAlert = recentEvents.some(
    (event) => event.type === "water_cooler_low",
  );
  if (
    !hasRetainedWaterAlert &&
    !materializedConditionKeys.has("empty_water_cooler") &&
    state.environment.waterCoolerFillPercent <= 0
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.environment.water-empty",
      {},
    );
    messages.push({
      id: "persistent.environment.water-cooler-low",
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "water_cooler",
      actionLabel: "Show water cooler",
      sortKey:
        Math.max(
          0,
          state.environment.nextWaterCoolerDrainTick -
            PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment
              .waterCoolerDrainIntervalMinutes,
        ) + 0.038,
      persistent: true,
    });
  }

  for (const employee of state.employees.filter((candidate) =>
    employeeDepartureRiskIsActive(
      state,
      candidate,
      PROTOTYPE_DOMAIN_CONTEXT,
    ),
  )) {
    const cadenceGroup = employeeDepartureRiskCadenceGroup(employee.id);
    const warningTick =
      state.alertHumor.conditionLastEmittedTicks[cadenceGroup];
    if (
      warningTick === undefined ||
      recentEvents.some(
        (event) =>
          event.definitionId === "alert.staff.departure-risk" &&
          event.target?.kind === "employee" &&
          event.target.id === employee.id,
      )
    ) continue;
    const configuredCopy = configuredAlertCopy(
      "alert.staff.departure-risk",
      {
        employee_name: employee.displayName,
        morale: String(employee.morale),
      },
    );
    messages.push({
      id: `event.staff-departure-risk.${employee.id}.${warningTick}`,
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(warningTick),
      targetType: "employee",
      targetId: employee.id,
      actionLabel: "Show employee",
      sortKey: warningTick,
      persistent: true,
    });
  }

  if (
    state.cash <= 0 &&
    !materializedConditionKeys.has("no_cash")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.finance.no-cash",
      {},
    );
    messages.push({
      id: "persistent.finance.no-cash",
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "emergency_glp1",
      actionLabel: "Open emergency cash option",
      sortKey: 0.061,
      persistent: true,
    });
  }

  if (
    state.facilityLevel === 1 &&
    state.advertisingLevel === 0 &&
    checkedInWaiting.length === 0 &&
    state.nextRoutineArrivalTick - state.facilityTick >= 45 &&
    !materializedConditionKeys.has("advertising_recommended")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.advertising.recommended",
      {},
    );
    messages.push({
      id: "persistent.advertising.recommended",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "advertising",
      actionLabel: "Show Advertising",
      sortKey:
        Math.max(0, state.nextRoutineArrivalTick - 45) + 0.036,
      persistent: true,
    });
  }

  if (
    state.facilityLevel === 1 &&
    checkedInWaiting.length >= 3 &&
    state.rooms.some((room) => room.roomDefinitionId === "room.waiting") &&
    !materializedConditionKeys.has("waiting_room_crowded")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.facility.waiting-room-crowded",
      {},
    );
    messages.push({
      id: "persistent.facility.waiting-room-crowded",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "build_mode",
      actionLabel: "Open Build Mode",
      sortKey:
        Math.max(
          ...checkedInWaiting.map(
            (encounter) => encounter.waiting.arrivedAtTick,
          ),
        ) + 0.037,
      persistent: true,
    });
  }

  const operationalGuidance = getLevelTwoOperationalGuidance(state);
  for (const guidance of operationalGuidance) {
    const configuredCopy = configuredAlertCopy(guidance.definitionId, {});
    messages.push({
      id: `persistent.${guidance.definitionId}`,
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: guidance.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: guidance.targetType,
      targetId: guidance.targetId,
      actionLabel: guidance.actionLabel,
      sortKey: state.facilityTick + 0.041,
      persistent: true,
    });
  }

  const progression = getFacilityProgressionStatus(state);
  const nextProgressionGuidance =
    operationalGuidance.length === 0 && state.cash >= lowCashThreshold
      ? getNextProgressionGuidance(state)
      : null;
  if (nextProgressionGuidance) {
    const levelStartedAtTick = state.events
      .filter((event) => event.type === "facility_level_advanced")
      .at(-1)?.facilityTick;
    messages.push({
      id: `persistent.progress.next-step.${state.facilityLevel}`,
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: "Next clinic step",
      message: nextProgressionGuidance.message,
      ...(levelStartedAtTick === undefined
        ? {}
        : { timeLabel: facilityTimeLabel(levelStartedAtTick) }),
      targetType: nextProgressionGuidance.targetType,
      targetId: nextProgressionGuidance.targetId,
      actionLabel: nextProgressionGuidance.actionLabel,
      sortKey: (levelStartedAtTick ?? 0) + 0.042,
      persistent: true,
    });
  }
  if (
    progression.eligible &&
    !materializedConditionKeys.has("progression_eligible")
  ) {
    const configuredCopy = configuredAlertCopy(
      "alert.progress.level-complete",
      { level: String(state.facilityLevel) },
    );
    messages.push({
      id: `persistent.progress.level.${state.facilityLevel}`,
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "goal",
      actionLabel: "View goals",
      sortKey:
        Math.max(
          0,
          ...state.events
            .filter((event) =>
              [
                "clinical_decision_recorded",
                "room_placed",
                "staff_hired",
                "encounter_settled",
              ].includes(event.type),
            )
            .map((event) => event.facilityTick),
        ) + 0.06,
      persistent: true,
    });
  }
  return messages;
}

function isSuppressedFromPlayerFeed(event: DomainEvent): boolean {
  if (event.type === "result_ready") {
    return true;
  }
  if (event.type === "patient_arrived") {
    return true;
  }
  return isPrototypeEventSuppressedFromPlayerFeed(
    event.type,
    event.definitionId,
  );
}

function isCadenceManagedPersistentMessage(
  item: MessageBoardItemView,
): boolean {
  return [
    "persistent.finance.low-cash",
    "persistent.finance.no-cash",
    "persistent.facility.waiting-room-needed",
    "persistent.facility.private-exam-needed",
    "persistent.facility.bathroom-needed",
    "persistent.staff.receptionist-recommended",
    "persistent.facility.onsite-imaging-requested",
    "persistent.staff.imaging-technician-needed",
    "persistent.environment.trash-visible",
    "persistent.environment.trash-accumulated",
    "persistent.environment.water-cooler-low",
    "persistent.advertising.recommended",
    "persistent.facility.waiting-room-crowded",
  ].includes(item.id) || item.id.startsWith("persistent.room-upgrade-requested.");
}

function projectFacilityConditionOccurrences(
  state: GameState,
  occurrences: readonly FacilityConditionOccurrenceState[],
): FacilityConditionOccurrenceState[] {
  const projected: FacilityConditionOccurrenceState[] = [];
  const representativeByGroup = new Map<
    string,
    { index: number; occurredAtFacilityTick: number }
  >();
  for (const occurrence of occurrences) {
    if (occurrence.conditionKey === "low_staff_morale") {
      continue;
    }
    const policy = alertCadencePolicy(
      occurrence.conditionKey,
      PROTOTYPE_DOMAIN_CONTEXT,
    );
    if (!policy) {
      projected.push(occurrence);
      continue;
    }
    const representative = representativeByGroup.get(policy.group);
    if (
      representative &&
      occurrence.occurredAtFacilityTick -
        representative.occurredAtFacilityTick <
        policy.cooldownMinutes
    ) {
      const prior = projected[representative.index]!;
      projected[representative.index] = {
        ...occurrence,
        id: prior.id,
        occurredAtFacilityTick: prior.occurredAtFacilityTick,
      };
      continue;
    }
    representativeByGroup.set(policy.group, {
      index: projected.length,
      occurredAtFacilityTick: occurrence.occurredAtFacilityTick,
    });
    projected.push(occurrence);
  }
  const activeOperational = new Map<
    string,
    ReturnType<typeof evaluateFacilityOperationalAlertConditions>[number]
  >(
    evaluateFacilityOperationalAlertConditions(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
    ).map((condition) => [condition.conditionKey, condition]),
  );
  return projected.map((occurrence) => {
    const operational = activeOperational.get(occurrence.conditionKey);
    if (operational) {
      return {
        ...occurrence,
        resolvedAtFacilityTick: null,
        definitionId: operational.definitionId,
        message: operational.message,
        priority: operational.priority,
        target: operational.target,
      };
    }
    return state.alertHumor.conditionActiveSinceTicks[
      occurrence.conditionKey
    ] !== undefined
      ? { ...occurrence, resolvedAtFacilityTick: null }
      : occurrence;
  });
}

function projectDailyFeedEvents(
  events: readonly DomainEvent[],
): DomainEvent[] {
  const day = operatingDayMinutes(PROTOTYPE_DOMAIN_CONTEXT);
  const lastProjectedTicks = new Map<string, number>();
  return events.filter((event) => {
    const dailyGroup =
      event.type === "ambient_message" &&
      event.definitionId &&
      event.alertVariantId
        ? `ambient:${event.definitionId}:${event.alertVariantId}`
        : event.definitionId === "alert.success.satisfaction-above-90"
          ? "success.satisfaction-above-90"
          : null;
    if (!dailyGroup) return true;
    const lastProjected = lastProjectedTicks.get(dailyGroup);
    if (
      lastProjected !== undefined &&
      event.facilityTick - lastProjected < day
    ) return false;
    lastProjectedTicks.set(dailyGroup, event.facilityTick);
    return true;
  });
}

export function createMessageBoardView(
  state: GameState,
): MessageBoardItemView[] {
  const recentEvents = state.events.slice(-80);
  const recentConditionOccurrences = projectFacilityConditionOccurrences(
    state,
    state.environment.facilityConditionOccurrences ?? [],
  ).slice(-80);
  // Apply player-feed eligibility before the bounded display window. Routine
  // receipts remain durable domain history, but must not crowd a readable
  // ambient or guidance row out of the 80-row presentation window.
  const visibleEvents = projectDailyFeedEvents(
    state.events.filter((event) => !isSuppressedFromPlayerFeed(event)),
  )
    .slice(-80);
  const latestAttentionEventIdByGroup = new Map<string, string>();
  for (const event of visibleEvents) {
    const group = attentionGroup(event);
    if (
      group &&
      eventCategory(
        event,
        effectiveEventDefinitionId(state, event),
      ) === "action_required"
    ) {
      latestAttentionEventIdByGroup.set(group, event.id);
    }
  }
  const eventItems = visibleEvents.map((event) => {
    const group = attentionGroup(event);
    const isLatestForCondition =
      group === null ||
      latestAttentionEventIdByGroup.get(group) === event.id;
    return eventToMessage(
      state,
      event,
      isLatestForCondition &&
        attentionConditionActive(state, event),
    );
  });
  const latestOccurrenceIdByCondition = new Map<
    FacilityAlertConditionKey,
    string
  >();
  for (const occurrence of recentConditionOccurrences) {
    latestOccurrenceIdByCondition.set(
      occurrence.conditionKey,
      occurrence.id,
    );
  }
  const conditionItems = recentConditionOccurrences
    .filter(
      (occurrence) =>
        occurrence.conditionKey !== "room_upgrade_requested" ||
        state.facilityLevel >= 3,
    )
    .map(
    (occurrence) =>
      conditionOccurrenceToMessage(
        occurrence,
        latestOccurrenceIdByCondition.get(
          occurrence.conditionKey,
        ) === occurrence.id,
      ),
  );
  const materializedConditionKeys = new Set(
    (state.environment.facilityConditionOccurrences ?? []).map(
      (occurrence) => occurrence.conditionKey,
    ),
  );
  const persistent = [
    ...persistentPatientMessages(state, visibleEvents),
    ...persistentSystemMessages(
      state,
      visibleEvents,
      materializedConditionKeys,
    ).filter((item) => !isCadenceManagedPersistentMessage(item)),
  ];
  const retainedHistory = [...eventItems, ...conditionItems]
    .sort(
      (left, right) =>
        (left.sortKey ?? 0) - (right.sortKey ?? 0),
    )
    .slice(-80);
  return [...retainedHistory, ...persistent];
}

export function targetTypeForDomainKind(
  kind: NonNullable<DomainEvent["target"]>["kind"],
): MessageBoardTargetType | null {
  if (kind === "encounter") {
    return "patient";
  }
  if (kind === "room") {
    return "room";
  }
  if (kind === "employee") {
    return "employee";
  }
  if (kind === "campaign") {
    return "goal";
  }
  return null;
}
