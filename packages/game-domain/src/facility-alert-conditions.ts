import {
  getPrototypeAlertDefinition,
  renderPrototypeAlert,
} from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { appendFacilityConditionOccurrence } from "./facility-experience";
import {
  getFacilityProgressionStatus,
  getRoomDefinition,
} from "./selectors";
import { getRoomNavigableTiles } from "./spatial";
import type {
  DomainContext,
  FacilityConditionAlertTarget,
  FacilityOperationalAlertConditionKey,
  GameState,
} from "./types";

interface OperationalAlertCondition {
  conditionKey: FacilityOperationalAlertConditionKey;
  definitionId: string;
  message: string;
  priority: "action_required" | "informational";
  target: FacilityConditionAlertTarget | null;
}

const OPERATIONAL_ALERT_CONDITION_KEYS =
  new Set<FacilityOperationalAlertConditionKey>([
    "low_cash",
    "no_cash",
    "advertising_recommended",
    "waiting_room_crowded",
    "room_upgrade_requested",
    "progression_eligible",
  ]);

function renderedCondition(
  conditionKey: FacilityOperationalAlertConditionKey,
  definitionId: string,
  values: Readonly<
    Record<string, string | number | null | undefined>
  >,
  priority: OperationalAlertCondition["priority"],
  target: FacilityConditionAlertTarget | null,
): OperationalAlertCondition {
  const rendered = renderPrototypeAlert(definitionId, values);
  return {
    conditionKey,
    definitionId: rendered.definitionId,
    message: rendered.body,
    priority,
    target,
  };
}

function checkedInWaitingPatients(state: GameState) {
  return Object.values(state.encounters).filter(
    (encounter) =>
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement?.kind !== "arriving_for_check_in" &&
      encounter.patientMovement?.kind !== "leaving_after_walkout",
  );
}

function roomUpgradeCondition(
  state: GameState,
  context: DomainContext,
): OperationalAlertCondition | null {
  if (state.facilityLevel !== 1) {
    return null;
  }
  const definition = getPrototypeAlertDefinition(
    "alert.patient.room-upgrade-requested",
  );
  const complaint = Object.values(state.encounters)
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
      const roomDefinition = room
        ? getRoomDefinition(room.roomDefinitionId, context)
        : null;
      if (!room || !roomDefinition || !encounter.patientLocation) {
        return false;
      }
      const patientOccupiesRoom = getRoomNavigableTiles(
        room,
        roomDefinition,
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
        roomDefinition.maximumUpgradeLevel > 1 &&
        encounter.patientSatisfaction < 90 &&
        state.facilityTick - encounter.waiting.arrivedAtTick >=
          (definition?.cooldownMinutes ?? 60)
      );
    });
  if (!complaint?.room) {
    return null;
  }
  const roomName =
    getRoomDefinition(
      complaint.room.roomDefinitionId,
      context,
    )?.displayName ?? "the room";
  return renderedCondition(
    "room_upgrade_requested",
    "alert.patient.room-upgrade-requested",
    {
      patient_name: complaint.encounter.patientDisplayName,
      patient_id: complaint.encounter.id,
      room_name: roomName,
      room_id: complaint.room.id,
    },
    "informational",
    {
      kind: "room",
      id: complaint.room.id,
    },
  );
}

/**
 * Alert-only operational conditions. These deliberately do not participate in
 * the patient-satisfaction evaluator.
 */
export function evaluateFacilityOperationalAlertConditions(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): OperationalAlertCondition[] {
  const conditions: OperationalAlertCondition[] = [];
  const lowCashThreshold =
    context.balanceRelease.emergencyGlp1.lowCashAlertThreshold;
  if (state.cash <= 0) {
    conditions.push(
      renderedCondition(
        "no_cash",
        "alert.finance.no-cash",
        {},
        "action_required",
        {
          kind: "emergency_glp1",
          id: "emergency-glp1",
        },
      ),
    );
  } else if (state.cash < lowCashThreshold) {
    conditions.push(
      renderedCondition(
        "low_cash",
        "alert.finance.low-cash",
        { threshold: lowCashThreshold },
        "action_required",
        {
          kind: "emergency_glp1",
          id: "emergency-glp1",
        },
      ),
    );
  }

  const waitingPatients = checkedInWaitingPatients(state);
  if (
    state.facilityLevel === 1 &&
    state.advertisingLevel === 0 &&
    waitingPatients.length === 0 &&
    state.nextRoutineArrivalTick - state.facilityTick >= 45
  ) {
    conditions.push(
      renderedCondition(
        "advertising_recommended",
        "alert.advertising.recommended",
        {},
        "informational",
        {
          kind: "advertising",
          id: "advertising",
        },
      ),
    );
  }

  if (
    state.facilityLevel === 1 &&
    waitingPatients.length >= 3 &&
    state.rooms.some(
      (room) => room.roomDefinitionId === "room.waiting",
    )
  ) {
    conditions.push(
      renderedCondition(
        "waiting_room_crowded",
        "alert.facility.waiting-room-crowded",
        {},
        "informational",
        {
          kind: "build_mode",
          id: "room.waiting",
        },
      ),
    );
  }

  const upgradeCondition = roomUpgradeCondition(state, context);
  if (upgradeCondition) {
    conditions.push(upgradeCondition);
  }

  const progression = getFacilityProgressionStatus(state, context);
  if (progression.eligible) {
    conditions.push(
      renderedCondition(
        "progression_eligible",
        "alert.progress.level-complete",
        { level: state.facilityLevel },
        "action_required",
        {
          kind: "goal",
          id: `level.${state.facilityLevel}`,
        },
      ),
    );
  }
  return conditions;
}

/**
 * Retains each onset as chronological history. Resolution only clears its
 * attention/click state; a later recurrence gets a fresh stable occurrence.
 */
export function synchronizeFacilityOperationalAlertOccurrences(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): void {
  const active = evaluateFacilityOperationalAlertConditions(
    state,
    context,
  );
  const activeByKey = new Map(
    active.map((condition) => [condition.conditionKey, condition]),
  );

  for (const occurrence of state.environment
    .facilityConditionOccurrences) {
    if (
      occurrence.resolvedAtFacilityTick !== null ||
      !OPERATIONAL_ALERT_CONDITION_KEYS.has(
        occurrence.conditionKey as FacilityOperationalAlertConditionKey,
      )
    ) {
      continue;
    }
    const condition = activeByKey.get(
      occurrence.conditionKey as FacilityOperationalAlertConditionKey,
    );
    const targetMatches =
      occurrence.target?.kind === condition?.target?.kind &&
      occurrence.target?.id === condition?.target?.id;
    if (
      !condition ||
      condition.definitionId !== occurrence.definitionId ||
      !targetMatches
    ) {
      occurrence.resolvedAtFacilityTick = state.facilityTick;
    }
  }

  for (const condition of active) {
    const existing = state.environment.facilityConditionOccurrences.find(
      (occurrence) =>
        occurrence.conditionKey === condition.conditionKey &&
        occurrence.resolvedAtFacilityTick === null,
    );
    if (existing) {
      continue;
    }
    appendFacilityConditionOccurrence(state, {
      ...condition,
      kind: "onset",
      occurredAtFacilityTick: state.facilityTick,
      resolvedAtFacilityTick: null,
    });
  }
}
