import {
  getPrototypeAlertDefinition,
  renderPrototypeAlert,
} from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  getFacilityProgressionStatus,
  getRoomDefinition,
  type DomainEvent,
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

function eventTarget(
  event: DomainEvent,
): Pick<MessageBoardItemView, "targetType" | "targetId" | "actionLabel"> {
  if (
    event.alertCategory === "ambient_flavor" ||
    event.alertCategory === "walkout_review"
  ) {
    return {};
  }
  if (event.type === "water_cooler_low") {
    return {
      targetType: "water_cooler",
      actionLabel: "Show water cooler",
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

function eventToMessage(
  state: GameState,
  event: DomainEvent,
): MessageBoardItemView {
  const definitionId = effectiveEventDefinitionId(state, event);
  const definition = definitionId
    ? getPrototypeAlertDefinition(definitionId)
    : undefined;
  const category =
    event.alertCategory ??
    definition?.category ??
    (event.type === "left_before_seen"
      ? "walkout_review"
      : event.priority === "action_required" ||
          event.priority === "critical"
        ? "action_required"
        : event.priority === "flavor"
          ? "ambient_flavor"
          : "success");
  const priority =
    event.type === "left_before_seen"
      ? "informational"
      : (event.priority ??
        (event.type === "patient_arrived" ||
        event.type === "result_ready" ||
        event.type === "patience_warning"
          ? "action_required"
          : "informational"));
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
    showAttentionMarker: category === "action_required",
    // Reducer events freeze the selected, rendered copy so later catalog edits
    // do not rewrite a campaign's recent history on reload.
    message: event.message,
    title: rendered?.title ?? fallbackEventTitle(event),
    timeLabel: facilityTimeLabel(event.facilityTick),
    sortKey: event.facilityTick,
    persistent: false,
    ...eventTarget(event),
  };
}

function persistentPatientMessages(state: GameState): MessageBoardItemView[] {
  return Object.values(state.encounters).flatMap((encounter) => {
    if (encounter.lifecycle === "waiting_unopened") {
      if (
        state.openChartEncounterId === encounter.id ||
        encounter.patientMovement?.kind === "arriving_for_check_in" ||
        encounter.patientMovement?.kind === "leaving_after_walkout"
      ) {
        return [];
      }
      const leaveWarningActive =
        !encounter.waiting.patienceExempt &&
        encounter.patientSatisfaction < 75;
      const configuredCopy = configuredAlertCopy(
        leaveWarningActive
          ? "alert.patient.patience"
          : "alert.patient.arrived",
        {
          patient_name: encounter.patientDisplayName,
        },
      );
      return [
        {
          id: leaveWarningActive
            ? `persistent.patient.${encounter.id}.leave-warning`
            : `persistent.patient.${encounter.id}.waiting`,
          priority: leaveWarningActive ? "critical" : "action_required",
          category: "action_required",
          showAttentionMarker: true,
          title: configuredCopy.title,
          message: configuredCopy.message,
          timeLabel: facilityTimeLabel(encounter.waiting.arrivedAtTick),
          actionLabel: "Open chart",
          targetType: "patient",
          targetId: encounter.id,
          sortKey:
            state.facilityTick + (leaveWarningActive ? 0.9 : 0.5),
          persistent: true,
        } satisfies MessageBoardItemView,
      ];
    }
    if (encounter.lifecycle === "active_action_required") {
      const hasResults = encounter.deliveredResultNarratives.length > 0;
      const configuredCopy = configuredAlertCopy(
        hasResults
          ? "alert.patient.result-ready"
          : "alert.patient.decision-required",
        {
          patient_name: encounter.patientDisplayName,
          result_name: "New information",
        },
      );
      return [
        {
          id: `persistent.patient.${encounter.id}.decision`,
          priority: "action_required",
          category: "action_required",
          showAttentionMarker: true,
          title: configuredCopy.title,
          message: configuredCopy.message,
          timeLabel: facilityTimeLabel(state.facilityTick),
          actionLabel: "Open chart",
          targetType: "patient",
          targetId: encounter.id,
          sortKey: state.facilityTick + 0.8,
          persistent: true,
        } satisfies MessageBoardItemView,
      ];
    }
    if (encounter.lifecycle === "resolved_summary_available") {
      const configuredCopy = configuredAlertCopy(
        "alert.patient.complete",
        { patient_name: encounter.patientDisplayName },
      );
      return [
        {
          id: `persistent.patient.${encounter.id}.complete`,
          priority: "action_required",
          category: "action_required",
          showAttentionMarker: true,
          title: configuredCopy.title,
          message: configuredCopy.message,
          timeLabel: facilityTimeLabel(state.facilityTick),
          actionLabel: "Open chart",
          targetType: "patient",
          targetId: encounter.id,
          sortKey: state.facilityTick + 0.7,
          persistent: true,
        } satisfies MessageBoardItemView,
      ];
    }
    return [];
  });
}

function persistentSystemMessages(state: GameState): MessageBoardItemView[] {
  const messages: MessageBoardItemView[] = [];
  const lowCashThreshold =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1
      .cashEligibilityThreshold;
  if (state.cash > 0 && state.cash < lowCashThreshold) {
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
      sortKey: state.facilityTick + 0.6,
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
    !hasExaminationRoom
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
      sortKey: state.facilityTick + 0.65,
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
    !hasReceptionist
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
      sortKey: state.facilityTick + 0.54,
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
  if (pendingOffsiteXray) {
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
        sortKey: state.facilityTick + 0.43,
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
        sortKey: state.facilityTick + 0.55,
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
    )
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
      sortKey: state.facilityTick + 0.41,
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
    )
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
      sortKey: state.facilityTick + 0.4,
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
  if (firstLitter) {
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
      sortKey: state.facilityTick + 0.395,
      persistent: true,
    });
  }
  if (cleanlinessRoom) {
    const roomName =
      getRoomDefinition(cleanlinessRoom.roomDefinitionId)
        ?.displayName ?? "A clinic room";
    const configuredCopy = configuredAlertCopy(
      "alert.facility.cleanliness-low",
      {
        room_name: roomName,
        cleanliness: String(cleanlinessRoom.cleanliness ?? 100),
      },
    );
    messages.push({
      id: "persistent.facility.cleanliness-low",
      priority: "informational",
      category: "guidance",
      showAttentionMarker: false,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      sortKey: state.facilityTick + 0.39,
      persistent: true,
      ...(firstLitter
        ? {
            targetType: "litter" as const,
            targetId: firstLitter.id,
            actionLabel: "Show trash",
          }
        : {}),
    });
  }

  if (
    state.environment.waterCoolerFillPercent <=
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment
      .waterCoolerLowThreshold
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
      sortKey: state.facilityTick + 0.38,
      persistent: true,
    });
  }

  const lowMoraleThreshold =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
      .unhappyStaffMoraleThreshold;
  for (const employee of state.employees.filter(
    (candidate) => candidate.morale <= lowMoraleThreshold,
  )) {
    const configuredCopy = configuredAlertCopy(
      "alert.staff.morale-low",
      {
        employee_name: employee.displayName,
        morale: String(employee.morale),
      },
    );
    messages.push({
      id: `persistent.staff.morale-low.${employee.id}`,
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      title: configuredCopy.title,
      message: configuredCopy.message,
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "employee",
      targetId: employee.id,
      actionLabel: "Show employee",
      sortKey: state.facilityTick + 0.57,
      persistent: true,
    });
  }

  if (state.cash <= 0) {
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
      sortKey: state.facilityTick + 0.61,
      persistent: true,
    });
  }

  if (
    state.facilityLevel === 1 &&
    state.advertisingLevel === 0 &&
    checkedInWaiting.length === 0 &&
    state.nextRoutineArrivalTick - state.facilityTick >= 45
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
      sortKey: state.facilityTick + 0.36,
      persistent: true,
    });
  }

  if (
    state.facilityLevel === 1 &&
    checkedInWaiting.length >= 3 &&
    state.rooms.some((room) => room.roomDefinitionId === "room.waiting")
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
      sortKey: state.facilityTick + 0.37,
      persistent: true,
    });
  }

  const progression = getFacilityProgressionStatus(state);
  if (progression.eligible) {
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
      sortKey: state.facilityTick + 0.6,
      persistent: true,
    });
  }
  return messages;
}

/**
 * Actionable arrival, patience, and result events are represented by a single
 * condition-backed persistent item above. Keeping the transient event as well
 * would stack progressively stronger copies of the same patient problem and
 * would leave stale critical warnings after the condition resolved.
 */
function isRepresentedByPersistentCondition(event: DomainEvent): boolean {
  return (
    event.type === "patient_arrived" ||
    event.type === "patience_warning" ||
    event.type === "result_ready" ||
    event.type === "water_cooler_low"
  );
}

export function createMessageBoardView(
  state: GameState,
): MessageBoardItemView[] {
  const recentEvents = state.events.slice(-80);
  const persistent = [
    ...persistentPatientMessages(state),
    ...persistentSystemMessages(state),
  ];
  const eventItems = recentEvents
    .filter((event) => !isRepresentedByPersistentCondition(event))
    .map((event) => eventToMessage(state, event));
  const criticalActive = [...persistent, ...eventItems].some(
    (item) =>
      item.priority === "critical" &&
      item.category === "action_required",
  );
  return [
    ...eventItems.filter(
      (item) =>
        !criticalActive || item.category !== "ambient_flavor",
    ),
    ...persistent,
  ];
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
