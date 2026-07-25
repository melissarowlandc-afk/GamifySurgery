import {
  PROTOTYPE_ALERT_DEFINITIONS,
  PROTOTYPE_FLAVOR_POOLS,
} from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deterministicInteger,
  getFacilityProgressionStatus,
  type DomainEvent,
  type GameState,
} from "@gamify-surgery/game-domain";
import type {
  MessageBoardItemView,
  MessageBoardTargetType,
} from "../ui";

function facilityTimeLabel(tick: number): string {
  const clock = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock;
  const hoursPerDay = clock.dayEndHour - clock.dayStartHour;
  const elapsedHours = tick * clock.facilityHoursPerTick;
  const day = Math.floor(elapsedHours / hoursPerDay) + 1;
  const hour24 = clock.dayStartHour + (elapsedHours % hoursPerDay);
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `Day ${day}, ${hour12} ${hour24 >= 12 ? "PM" : "AM"}`;
}

function configuredAlertCopy(
  definitionId: string,
  values: Readonly<Record<string, string>>,
  fallbackTitle: string,
  fallbackMessage: string,
): { title: string; message: string } {
  const definition = PROTOTYPE_ALERT_DEFINITIONS.find(
    (candidate) => candidate.id === definitionId,
  );
  const render = (template: string) =>
    Object.entries(values).reduce(
      (text, [key, value]) =>
        text.split(`{{${key}}}`).join(value),
      template,
    );
  return {
    title: definition
      ? render(definition.titleTemplate)
      : fallbackTitle,
    message: definition
      ? render(definition.bodyTemplate)
      : fallbackMessage,
  };
}

function eventTarget(
  event: DomainEvent,
): Pick<MessageBoardItemView, "targetType" | "targetId" | "actionLabel"> {
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

function eventTitle(event: DomainEvent): string {
  switch (event.type) {
    case "patient_arrived":
      return "New patient";
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
    case "room_sold":
      return "Room sold";
    case "room_upgraded":
      return "Upgrade complete";
    case "staff_hired":
      return "Employee hired";
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
  }
}

function eventToMessage(event: DomainEvent): MessageBoardItemView {
  const priority =
    event.type === "left_before_seen"
      ? "informational"
      : (event.priority ??
        (event.type === "patient_arrived" ||
        event.type === "result_ready" ||
        event.type === "patience_warning"
          ? "action_required"
          : "informational"));
  return {
    id: event.id,
    priority,
    message: event.message,
    title: eventTitle(event),
    timeLabel: facilityTimeLabel(event.facilityTick),
    sortKey: event.facilityTick,
    persistent: false,
    ...eventTarget(event),
  };
}

function poolForEvent(
  event: DomainEvent,
): (typeof PROTOTYPE_FLAVOR_POOLS)[number] | null {
  const poolId =
    event.type === "patient_arrived"
      ? "patient_arrival"
      : event.type === "patience_warning"
        ? "waiting"
        : event.type === "result_ready" ||
            event.type === "clinical_decision_recorded" ||
            event.type === "encounter_settled"
          ? "result"
          : event.type === "staff_hired" ||
              event.type === "staff_salary_changed"
            ? "staff"
            : event.type === "room_placed" ||
                event.type === "room_sold" ||
                event.type === "room_upgraded"
              ? "construction"
              : event.type === "operating_expense" ||
                  event.type === "development_money_added" ||
                  event.type === "emergency_glp1_consultation"
                ? "finance"
                : event.type === "facility_level_advanced"
                  ? "progression"
                  : null;
  return (
    PROTOTYPE_FLAVOR_POOLS.find((pool) => pool.id === poolId) ?? null
  );
}

function createFlavorMessages(
  state: GameState,
  events: readonly DomainEvent[],
): MessageBoardItemView[] {
  const latestTickByPool = new Map<string, number>();
  const latestMessageByPool = new Map<string, string>();
  const items: MessageBoardItemView[] = [];

  for (const event of events) {
    const pool = poolForEvent(event);
    if (!pool || !pool.eligibleFacilityLevels.includes(state.facilityLevel)) {
      continue;
    }
    const latestTick = latestTickByPool.get(pool.id);
    if (
      latestTick !== undefined &&
      event.facilityTick - latestTick < pool.cooldownTicks
    ) {
      continue;
    }
    latestTickByPool.set(pool.id, event.facilityTick);
    let messageIndex = deterministicInteger(
      state.campaignSeed,
      "flavor_text",
      `${event.id}:${pool.id}`,
      pool.messages.length,
    );
    const previousMessage = latestMessageByPool.get(pool.id);
    if (
      pool.messages.length > 1 &&
      pool.messages[messageIndex] === previousMessage
    ) {
      messageIndex = (messageIndex + 1) % pool.messages.length;
    }
    const message = pool.messages[messageIndex]!;
    latestMessageByPool.set(pool.id, message);
    items.push({
      id: `flavor.${event.id}.${pool.id}`,
      priority: "flavor",
      title: "Around the clinic",
      message,
      timeLabel: facilityTimeLabel(event.facilityTick),
      sortKey: event.facilityTick - 0.1,
      persistent: false,
    });
  }
  return items;
}

function persistentPatientMessages(state: GameState): MessageBoardItemView[] {
  return Object.values(state.encounters).flatMap((encounter) => {
    if (encounter.lifecycle === "waiting_unopened") {
      const warned = encounter.waiting.warningThresholdsShown.length > 0;
      const departureImminent =
        encounter.waiting.departureDueTick !== null &&
        state.facilityTick >= encounter.waiting.departureDueTick;
      const configuredCopy = configuredAlertCopy(
        warned
          ? "alert.patient.patience"
          : "alert.patient.arrived",
        {
          patient_name: encounter.patientDisplayName,
        },
        warned ? "Patient may leave soon" : "New patient",
        warned
          ? `${encounter.patientDisplayName} may leave soon.`
          : `${encounter.patientDisplayName} has checked in.`,
      );
      return [
        {
          id: `persistent.patient.${encounter.id}.waiting`,
          priority: departureImminent ? "critical" : "action_required",
          title: departureImminent
            ? "Patient may leave now"
            : configuredCopy.title,
          message: departureImminent
            ? `${encounter.patientDisplayName} may leave without being seen unless the chart is opened now.`
            : warned
              ? `${encounter.patientDisplayName} has waited long enough that satisfaction may fall.`
              : configuredCopy.message,
          timeLabel: facilityTimeLabel(encounter.waiting.arrivedAtTick),
          actionLabel: "Open chart",
          targetType: "patient",
          targetId: encounter.id,
          sortKey: state.facilityTick + (warned ? 0.9 : 0.5),
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
        hasResults ? "Results ready" : "Decision required",
        hasResults
          ? `New information is available for ${encounter.patientDisplayName}.`
          : `A clinical decision is required for ${encounter.patientDisplayName}.`,
      );
      return [
        {
          id: `persistent.patient.${encounter.id}.decision`,
          priority: "action_required",
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
        "Encounter complete",
        `${encounter.patientDisplayName}'s chart is ready to resolve.`,
      );
      return [
        {
          id: `persistent.patient.${encounter.id}.complete`,
          priority: "action_required",
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
  if (state.cash < 100) {
    const definition = PROTOTYPE_ALERT_DEFINITIONS.find(
      (candidate) => candidate.id === "alert.finance.low-cash",
    );
    messages.push({
      id: "persistent.finance.low-cash",
      priority: "action_required",
      title: definition?.titleTemplate ?? "Low cash",
      message: definition?.bodyTemplate ?? "Less than $100 remains.",
      timeLabel: facilityTimeLabel(state.facilityTick),
      targetType: "emergency_glp1",
      actionLabel: "Open emergency cash option",
      sortKey: state.facilityTick + 0.6,
      persistent: true,
    });
  }
  const progression = getFacilityProgressionStatus(state);
  if (progression.eligible) {
    const configuredCopy = configuredAlertCopy(
      "alert.progress.level-complete",
      { level: String(state.facilityLevel) },
      `Level ${state.facilityLevel} complete`,
      "All progression requirements are complete.",
    );
    messages.push({
      id: `persistent.progress.level.${state.facilityLevel}`,
      priority: "action_required",
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
    event.type === "result_ready"
  );
}

export function createMessageBoardView(
  state: GameState,
): MessageBoardItemView[] {
  const recentEvents = state.events.slice(-24);
  const persistent = [
    ...persistentPatientMessages(state),
    ...persistentSystemMessages(state),
  ];
  const eventItems = recentEvents
    .filter((event) => !isRepresentedByPersistentCondition(event))
    .map(eventToMessage);
  const criticalActive = persistent.some(
    (item) => item.priority === "critical",
  );
  const flavorItems = criticalActive
    ? []
    : createFlavorMessages(state, recentEvents);
  return [...eventItems, ...flavorItems, ...persistent];
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
