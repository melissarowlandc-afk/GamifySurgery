# Exact current code slices for mixed shared files

These verbatim slices preserve implementation that cannot be copied as whole files.
Source-line comments are discovery aids; use named symbols/selectors as anchors.

## Domain exports

```ts
export * from "./alert-cadence";
export * from "./departure-risk-alerts";
```

## Domain type additions with insertion context

```ts
// Source lines 706-716
  patientSatisfaction: number;
  idleWaitingSinceTick: number | null;
  lastSatisfactionDecayAtTick: number;
  walkoutThreshold: number;
  /** First feed warning for this encounter's actual walkout-risk window. */
  departureRiskWarningAtTick: number | null;
  satisfactionWarningsShown: number[];
  /**
   * Persisted attribution for losses to the one patient-satisfaction score.
   * This drives cause-aware walkout copy without introducing another resource.
   */
// --- next exact context ---
// Source lines 1094-1104
    | "door_placed"
    | "door_removed"
    | "staff_hired"
    | "staff_fired"
    | "staff_quit"
    | "staff_departure_risk"
    | "staff_salary_changed"
    | "facility_level_advanced"
    | "day_rollover"
    | "operating_expense"
    | "patient_arrived"
```

## Persistence: durable alert recovery

```ts
import { employeeDepartureRiskCadenceGroup } from "./departure-risk-alerts";

function normalizeAlertHumorState(
  value: unknown,
  facilityTick: number,
  campaignSeed: string,
  root: Record<string, unknown>,
  context: DomainContext,
): AlertHumorState {
  const candidate = isRecord(value) ? value : {};
  const ambientDefinitionIds = new Set(
    PROTOTYPE_AMBIENT_ALERT_DEFINITIONS.map(
      (definition) => definition.id,
    ),
  );
  const reviewVariantIds = new Set(
    PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS.flatMap((definition) =>
      definition.variants.map((variant) => variant.id),
    ),
  );
  const alertsTutorialAcknowledgedAtTick =
    typeof candidate.alertsTutorialAcknowledgedAtTick === "number" &&
    Number.isSafeInteger(
      candidate.alertsTutorialAcknowledgedAtTick,
    ) &&
    candidate.alertsTutorialAcknowledgedAtTick >= 0 &&
    candidate.alertsTutorialAcknowledgedAtTick <= facilityTick
      ? candidate.alertsTutorialAcknowledgedAtTick
      : null;
  const ambientSequence =
    typeof candidate.ambientSequence === "number" &&
    Number.isSafeInteger(candidate.ambientSequence) &&
    candidate.ambientSequence >= 0
      ? candidate.ambientSequence
      : 0;
  const parsedNextTick =
    typeof candidate.nextAmbientAlertTick === "number" &&
    Number.isSafeInteger(candidate.nextAmbientAlertTick) &&
    candidate.nextAmbientAlertTick >= 0
      ? candidate.nextAmbientAlertTick
      : null;
  const ambientCadenceIsCurrent =
    candidate.ambientCadenceVersion === 1;
  const rawEvents = Array.isArray(root.events)
    ? root.events.filter(isRecord)
    : [];
  const lastAmbientEventTick = rawEvents.reduce<number | null>(
    (latest, event) =>
      event.type === "ambient_message" &&
      typeof event.facilityTick === "number" &&
      Number.isSafeInteger(event.facilityTick) &&
      event.facilityTick >= 0 &&
      event.facilityTick <= facilityTick
        ? Math.max(latest ?? 0, event.facilityTick)
        : latest,
    null,
  );
  const migratedAmbientMinimumTick =
    lastAmbientEventTick !== null
      ? lastAmbientEventTick +
        PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMinimumMinutes
      : ambientSequence > 0
        ? facilityTick +
          PROTOTYPE_ALERT_SCHEDULING.recurringAmbientMinimumMinutes
        : alertsTutorialAcknowledgedAtTick !== null
          ? alertsTutorialAcknowledgedAtTick +
            PROTOTYPE_ALERT_SCHEDULING.firstAmbientMinimumMinutes
          : facilityTick;
  const nextAmbientAlertTick =
    alertsTutorialAcknowledgedAtTick === null
      ? null
      : ambientCadenceIsCurrent
        ? (parsedNextTick ??
          facilityTick +
            getMigratedAmbientDelay(campaignSeed, ambientSequence))
        : Math.max(
            parsedNextTick ?? 0,
            migratedAmbientMinimumTick,
          );
  const normalizeTickRecord = (input: unknown): Record<string, number> =>
    isRecord(input)
      ? Object.fromEntries(
          Object.entries(input).filter(
            (entry): entry is [string, number] =>
              typeof entry[1] === "number" &&
              Number.isSafeInteger(entry[1]) &&
              entry[1] >= 0 &&
              entry[1] <= facilityTick,
          ),
        )
      : {};
  const persistedActiveTicks = normalizeTickRecord(
    candidate.conditionActiveSinceTicks,
  );
  const persistedEmissionTicks = normalizeTickRecord(
    candidate.conditionLastEmittedTicks,
  );
  const rawEnvironment = isRecord(root.environment) ? root.environment : {};
  const rawOccurrences = Array.isArray(rawEnvironment.facilityConditionOccurrences)
    ? rawEnvironment.facilityConditionOccurrences.filter(isRecord)
    : [];
  const migratedActiveTicks = { ...persistedActiveTicks };
  const migratedEmissionTicks = { ...persistedEmissionTicks };
  for (const event of rawEvents) {
    if (
      typeof event.facilityTick === "number" &&
      Number.isSafeInteger(event.facilityTick) &&
      event.facilityTick >= 0 &&
      event.facilityTick <= facilityTick &&
      event.type === "ambient_message" &&
      typeof event.definitionId === "string" &&
      typeof event.alertVariantId === "string"
    ) {
      const group = `ambient:${event.definitionId}:${event.alertVariantId}`;
      migratedEmissionTicks[group] = Math.max(
        migratedEmissionTicks[group] ?? 0,
        event.facilityTick,
      );
    }
    if (
      typeof event.facilityTick === "number" &&
      Number.isSafeInteger(event.facilityTick) &&
      event.facilityTick >= 0 &&
      event.facilityTick <= facilityTick &&
      event.definitionId === "alert.success.satisfaction-above-90"
    ) {
      const group = "success.satisfaction-above-90";
      migratedEmissionTicks[group] = Math.max(
        migratedEmissionTicks[group] ?? 0,
        event.facilityTick,
      );
    }
    const rawTarget = isRecord(event.target) ? event.target : null;
    if (
      event.definitionId !== "alert.staff.departure-risk" ||
      typeof event.facilityTick !== "number" ||
      !Number.isSafeInteger(event.facilityTick) ||
      event.facilityTick < 0 ||
      event.facilityTick > facilityTick ||
      rawTarget?.kind !== "employee" ||
      typeof rawTarget.id !== "string"
    ) {
      continue;
    }
    const group = employeeDepartureRiskCadenceGroup(rawTarget.id);
    migratedEmissionTicks[group] = Math.max(
      migratedEmissionTicks[group] ?? 0,
      event.facilityTick,
    );
  }
  let migratedComplaintTick: number | null = null;
  for (const occurrence of rawOccurrences) {
    if (
      typeof occurrence.conditionKey !== "string" ||
      typeof occurrence.occurredAtFacilityTick !== "number" ||
      !Number.isSafeInteger(occurrence.occurredAtFacilityTick) ||
      occurrence.occurredAtFacilityTick < 0 ||
      occurrence.occurredAtFacilityTick > facilityTick
    ) continue;
    const policy =
      occurrence.conditionKey === "missing_examination_room" &&
      root.facilityLevel === 0
        ? null
        : alertCadencePolicy(
            occurrence.conditionKey as FacilityAlertConditionKey,
            context,
          );
    if (!policy) continue;
    if (
      occurrence.resolvedAtFacilityTick === null &&
      migratedActiveTicks[occurrence.conditionKey] === undefined
    ) {
      migratedActiveTicks[occurrence.conditionKey] =
        occurrence.occurredAtFacilityTick;
    }
    if (persistedEmissionTicks[policy.group] === undefined) {
      migratedEmissionTicks[policy.group] = facilityTick;
    }
    if (policy.complaint) migratedComplaintTick = facilityTick;
  }
  return {
    alertsTutorialAcknowledgedAtTick,
    nextAmbientAlertTick,
    ambientCadenceVersion: 1,
    lastPatientArrivalTick:
      typeof candidate.lastPatientArrivalTick === "number" &&
      Number.isSafeInteger(candidate.lastPatientArrivalTick) &&
      candidate.lastPatientArrivalTick >= 0 &&
      candidate.lastPatientArrivalTick <= facilityTick
        ? candidate.lastPatientArrivalTick
        : Object.prototype.hasOwnProperty.call(
              candidate,
              "lastPatientArrivalTick",
            ) && candidate.lastPatientArrivalTick === null
          ? null
        : Object.keys(isRecord(root.encounters) ? root.encounters : {}).length > 0
          ? facilityTick
          : null,
    conditionActiveSinceTicks: migratedActiveTicks,
    conditionLastEmittedTicks: migratedEmissionTicks,
    lastComplaintAlertTick:
      typeof candidate.lastComplaintAlertTick === "number" &&
      Number.isSafeInteger(candidate.lastComplaintAlertTick) &&
      candidate.lastComplaintAlertTick >= 0 &&
      candidate.lastComplaintAlertTick <= facilityTick
        ? candidate.lastComplaintAlertTick
        : migratedComplaintTick,
    ambientSequence,
    ambientCycle:
      typeof candidate.ambientCycle === "number" &&
      Number.isSafeInteger(candidate.ambientCycle) &&
      candidate.ambientCycle >= 0
        ? candidate.ambientCycle
        : 0,
    ambientUsedDefinitionIds: normalizeStringHistory(
      candidate.ambientUsedDefinitionIds,
      ambientDefinitionIds,
      ambientDefinitionIds.size,
    ),
    recentAmbientDefinitionIds: normalizeStringHistory(
      candidate.recentAmbientDefinitionIds,
      ambientDefinitionIds,
      PROTOTYPE_ALERT_SCHEDULING.recentAmbientHistoryLimit,
    ),
    recentWalkoutReviewVariantIds: normalizeStringHistory(
      candidate.recentWalkoutReviewVariantIds,
      reviewVariantIds,
      PROTOTYPE_ALERT_SCHEDULING.recentReviewHistoryLimit,
    ),
  };
}

// Source lines 2433-2450
        : deterministicInteger(
            campaignSeed,
            RANDOM_STREAMS.patientWalkout,
            `${encounterId}:threshold.v1`,
            context.balanceRelease.patientSatisfaction
              .walkoutThresholdMaximum + 1,
          ),
    departureRiskWarningAtTick:
      typeof candidate.departureRiskWarningAtTick === "number" &&
      Number.isSafeInteger(candidate.departureRiskWarningAtTick) &&
      candidate.departureRiskWarningAtTick >= 0 &&
      candidate.departureRiskWarningAtTick <= facilityTick
        ? candidate.departureRiskWarningAtTick
        : null,
    satisfactionWarningsShown: Array.isArray(
      candidate.satisfactionWarningsShown,
    )
      ? candidate.satisfactionWarningsShown.filter(
          (threshold): threshold is number =>
            typeof threshold === "number" &&
            Number.isSafeInteger(threshold),
        )
      : [],
// --- next exact context ---
// Source lines 2879-2896
    }
    const returnPath = findDeterministicFacilityPath(actorLocation, trip.returnTarget, next.rooms, next.doors, (id) => getRoomDefinition(id, context));
    return returnPath.length > 0 || (actorLocation.x === trip.returnTarget.x && actorLocation.y === trip.returnTarget.y);
  });
  if (Array.isArray(parsed.events)) {
    for (const event of parsed.events.filter(isRecord)) {
      if (
        event.definitionId !== "alert.patient.departure-risk" ||
        typeof event.encounterId !== "string" ||
        typeof event.facilityTick !== "number" ||
        !Number.isSafeInteger(event.facilityTick) ||
        event.facilityTick < 0 ||
        event.facilityTick > next.facilityTick
      ) continue;
      const encounter = next.encounters[event.encounterId];
      if (
        encounter &&
        (encounter.departureRiskWarningAtTick === null ||
          event.facilityTick < encounter.departureRiskWarningAtTick)
      ) {
        encounter.departureRiskWarningAtTick = event.facilityTick;
      }
    }
  }

  const rawHistories = parsed.learningHistories as Record<string, unknown>;
  next.learningHistories = {
    ...Object.fromEntries(
      context.clinicalRelease.concepts.map((concept) => [
        concept.id,
        {
```

## Reducer: departure-risk helpers

```ts
import { operatingDayMinutes } from "./alert-cadence";
import {
  employeeDepartureRiskCadenceGroup,
  employeeDepartureRiskWarningIsDue,
  patientDepartureRiskIsActive,
} from "./departure-risk-alerts";

function maybeEmitPatientDepartureRiskWarning(
  state: GameState,
  encounter: EncounterState,
): void {
  if (
    encounter.departureRiskWarningAtTick != null ||
    !patientDepartureRiskIsActive(state, encounter)
  ) {
    return;
  }
  const definitionId = "alert.patient.departure-risk";
  const rendered = renderPrototypeAlert(definitionId, {
    patient_name: encounter.patientDisplayName,
    patient_id: encounter.id,
  });
  encounter.departureRiskWarningAtTick = state.facilityTick;
  appendEvent(state, {
    id: `event.patient-departure-risk.${encounter.id}`,
    type: "patience_warning",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: rendered.body,
    priority: "critical",
    definitionId,
    target: { kind: "encounter", id: encounter.id },
  });
}

function maybeEmitEmployeeDepartureRiskWarnings(
  state: GameState,
  context: DomainContext,
): void {
  for (const employee of state.employees) {
    if (!employeeDepartureRiskWarningIsDue(state, employee, context)) {
      continue;
    }
    const definitionId = "alert.staff.departure-risk";
    const rendered = renderPrototypeAlert(definitionId, {
      employee_name: employee.displayName,
      employee_id: employee.id,
      morale: String(employee.morale),
    });
    state.alertHumor.conditionLastEmittedTicks[
      employeeDepartureRiskCadenceGroup(employee.id)
    ] = state.facilityTick;
    appendEvent(state, {
      id: `event.staff-departure-risk.${employee.id}.${state.facilityTick}`,
      type: "staff_departure_risk",
      facilityTick: state.facilityTick,
      encounterId: null,
      message: rendered.body,
      priority: "action_required",
      definitionId,
      target: { kind: "employee", id: employee.id },
    });
  }
}
```

## Reducer: encounter initialization and emission call sites

```ts
// Source lines 1408-1414
      context.balanceRelease.patientSatisfaction
        .walkoutThresholdMaximum + 1,
    ),
    departureRiskWarningAtTick: null,
    satisfactionWarningsShown: [],
    dissatisfactionByCause: {},
    facilityExperienceAtCheckIn: null,

// Source lines 7627-7631
      continue;
    }
    maybeEmitPatientDepartureRiskWarning(next, encounter);
    const graceEndsAt =
      encounter.idleWaitingSinceTick + satisfaction.idleGraceMinutes;
// --- next exact context ---
// Source lines 7672-7676
      intervals * satisfaction.decayIntervalMinutes;

    maybeEmitPatientDepartureRiskWarning(next, encounter);

    if (
```

## Reducer: complete ambient cadence owner

```ts
function maybeEmitAmbientMessage(
  state: GameState,
  context: DomainContext,
): void {
  const humor = state.alertHumor;
  if (
    humor.alertsTutorialAcknowledgedAtTick === null ||
    humor.nextAmbientAlertTick === null ||
    state.facilityTick < humor.nextAmbientAlertTick ||
    !bothTutorialEncountersResolved(state)
  ) {
    return;
  }

  const day = operatingDayMinutes(context);
  const eligible = getEligibleAmbientDefinitions(state).filter((definition) =>
    definition.variants.some((variant) => {
      const lastEmitted =
        humor.conditionLastEmittedTicks[
          `ambient:${definition.id}:${variant.id}`
        ];
      return lastEmitted === undefined || state.facilityTick - lastEmitted >= day;
    }),
  );
  if (eligible.length === 0) {
    humor.nextAmbientAlertTick =
      state.facilityTick +
      PROTOTYPE_ALERT_SCHEDULING.minimumAmbientSeparationMinutes;
    return;
  }

  let cycleCandidates = eligible.filter(
    (definition) =>
      !humor.ambientUsedDefinitionIds.includes(definition.id),
  );
  if (cycleCandidates.length === 0) {
    humor.ambientCycle += 1;
    humor.ambientUsedDefinitionIds = [];
    cycleCandidates = eligible;
  }
  const nonRecentCandidates = cycleCandidates.filter(
    (definition) =>
      !humor.recentAmbientDefinitionIds.includes(definition.id),
  );
  const definition = pickWeighted(
    nonRecentCandidates.length > 0
      ? nonRecentCandidates
      : cycleCandidates,
    state,
    `ambient.definition.${humor.ambientCycle}.${humor.ambientSequence}`,
  );
  const availableVariants = definition.variants.filter((candidate) => {
    const lastEmitted =
      humor.conditionLastEmittedTicks[
        `ambient:${definition.id}:${candidate.id}`
      ];
    return lastEmitted === undefined || state.facilityTick - lastEmitted >= day;
  });
  const variant = pickWeighted(
    availableVariants,
    state,
    `ambient.variant.${definition.id}.${humor.ambientSequence}`,
  );
  const rendered = renderPrototypeAlert(definition, {}, variant.id);
  appendEvent(state, {
    id: `event.ambient.${humor.ambientSequence}.${state.facilityTick}`,
    type: "ambient_message",
    facilityTick: state.facilityTick,
    encounterId: null,
    message: rendered.body,
    priority: "flavor",
    definitionId: rendered.definitionId,
    alertCategory: definition.category,
    alertVariantId: rendered.variantId,
    target: {
      kind: "campaign",
      id: state.campaignId,
    },
  });
  humor.conditionLastEmittedTicks[
    `ambient:${definition.id}:${variant.id}`
  ] = state.facilityTick;
  humor.ambientUsedDefinitionIds.push(definition.id);
  humor.recentAmbientDefinitionIds = appendBoundedHistory(
    humor.recentAmbientDefinitionIds,
    definition.id,
    PROTOTYPE_ALERT_SCHEDULING.recentAmbientHistoryLimit,
  );
  humor.ambientSequence += 1;
  humor.nextAmbientAlertTick =
    state.facilityTick + getAmbientDelay(state, "recurring");
}
```

## Reducer: complete satisfaction-celebration owner

```ts
function settleEncounter(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): void {
  if (encounter.settlementId !== null) {
    return;
  }
  const balance = context.balanceRelease.clinicalSettlement;
  const totalAnswers = encounter.answers.length;
  const correctAnswers = encounter.answers.filter((answer) => answer.correct).length;
  const incorrectAnswers = totalAnswers - correctAnswers;
  const completionRevenue =
    state.facilityLevel === 0
      ? balance.levelZeroBasePayment +
        balance.levelZeroPerQuestionPayment * totalAnswers +
        balance.levelZeroPerCorrectPayment * correctAnswers
      : balance.levelOneBasePayment +
        balance.levelOnePerQuestionPayment * totalAnswers +
        balance.levelOnePerCorrectPayment * correctAnswers;
  const satisfactionDelta = encounter.patientSatisfaction - 100;
  const clinicalXpAwarded = encounter.answers.reduce(
    (total, answer) =>
      total + getDecisionXpAward(encounter, answer.correct, context),
    0,
  );
  const netCashDelta = completionRevenue;
  const settlementId = `settlement.${encounter.id}.completion`;
  const settlement: EncounterSettlement = {
    id: settlementId,
    encounterId: encounter.id,
    completionRevenue,
    qualityRevenueBonus: 0,
    incorrectFinancialConsequence: 0,
    netCashDelta,
    satisfactionDelta,
    clinicalXpAwarded,
    correctAnswers,
    incorrectAnswers,
    terminalOutcomeSeverity: encounter.terminalFeedback?.outcome?.severity ?? null,
    settledAtFacilityTick: state.facilityTick,
  };

  encounter.settlementId = settlementId;
  state.settlements.push(settlement);
  adjustCash(state, netCashDelta);
  appendEvent(state, {
    id: `event.${settlementId}`,
    type: "encounter_settled",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: `Encounter complete: +$${netCashDelta}.`,
    priority: "informational",
    definitionId: "alert.patient.complete",
    target: {
      kind: "encounter",
      id: encounter.id,
    },
    reward: {
      cashDelta: netCashDelta,
      learningXpDelta: 0,
      satisfactionDelta,
    },
  });
  if (encounter.arrivalClass !== "tutorial") {
    const firstOrdinaryDefinitionId =
      "alert.success.first-ordinary-patient-resolved";
    const priorOrdinaryCompleted = Object.values(
      state.encounters,
    ).some(
      (candidate) =>
        candidate.id !== encounter.id &&
        candidate.arrivalClass !== "tutorial" &&
        candidate.resolutionReason === "completed",
    );
    if (!priorOrdinaryCompleted) {
      appendSuccessMessage(
        state,
        firstOrdinaryDefinitionId,
        `event.success.first-ordinary.${encounter.id}`,
        encounter,
      );
    }

    const previousSatisfaction = getEndedEncounterSatisfaction(
      state,
      context,
      encounter.id,
    );
    const currentSatisfaction = getEndedEncounterSatisfaction(
      state,
      context,
    );
    if (
      currentSatisfaction !== null &&
      currentSatisfaction > 90 &&
      previousSatisfaction !== null &&
      previousSatisfaction <= 90 &&
      (() => {
        const group = "success.satisfaction-above-90";
        const lastEmitted =
          state.alertHumor.conditionLastEmittedTicks[group];
        if (
          lastEmitted !== undefined &&
          state.facilityTick - lastEmitted < operatingDayMinutes(context)
        ) return false;
        state.alertHumor.conditionLastEmittedTicks[group] =
          state.facilityTick;
        return true;
      })()
    ) {
      appendSuccessMessage(
        state,
        "alert.success.satisfaction-above-90",
        `event.success.satisfaction-above-90.${encounter.id}`,
        encounter,
      );
    }
  }
}
```

## Player session: filtered system notices

```ts
import {
  PROTOTYPE_ALERT_DEFINITIONS,
  isPrototypeEventSuppressedFromPlayerFeed,
  type PrototypeAlertCategory,
  type PrototypeAlertPriority,
} from "@gamify-surgery/balance-config";

export function shouldStoreSystemNotice(definitionId: string): boolean {
  return !isPrototypeEventSuppressedFromPlayerFeed(
    "system_notice",
    definitionId,
  );
}

  const [systemNotices, setSystemNotices] = useState<
    PrototypeSystemNotice[]
  >(() => {
    const initialState = requireActiveCampaign(
      loadedRef.current!.profile,
    ).state;
    const isNewCampaign = loadedRef.current!.notice.startsWith("New clinic");
    const definitionId = isNewCampaign
      ? "alert.system.campaign-created"
      : "alert.system.campaign-restored";
    const definition = alertDefinition(definitionId);
    const initialNotice: PrototypeSystemNotice = {
      id: `system.initial.${initialState.campaignId}`,
      definitionId,
      priority: definition?.priority ?? "informational",
      category: definition?.category ?? "success",
      showAttentionMarker:
        definition?.showAttentionMarker ?? false,
      title:
        definition?.titleTemplate ??
        (isNewCampaign ? "New campaign" : "Campaign restored"),
      message: loadedRef.current!.notice,
      timeLabel: facilityTimeLabel(initialState.facilityTick),
      sortKey: initialState.facilityTick + 0.01,
      persistent: false,
    };
    return shouldStoreSystemNotice(definitionId)
      ? [initialNotice]
      : [];
  });

  const publishSystemNotice = useCallback(
    (
      definitionId: string,
      messageOverride?: string,
      titleOverride?: string,
    ) => {
      const definition = alertDefinition(definitionId);
      const facilityTick = stateRef.current.facilityTick;
      const message =
        messageOverride ??
        definition?.bodyTemplate ??
        "The clinic state changed.";
      const notice: PrototypeSystemNotice = {
        id: `system.notice.${++systemNoticeSequenceRef.current}`,
        definitionId,
        priority: definition?.priority ?? "informational",
        category: definition?.category ?? "success",
        showAttentionMarker:
          definition?.showAttentionMarker ?? false,
        title:
          titleOverride ??
          definition?.titleTemplate ??
          "Clinic update",
        message,
        timeLabel: facilityTimeLabel(facilityTick),
        sortKey:
          facilityTick + systemNoticeSequenceRef.current / 10_000,
        persistent: definition?.persistent ?? false,
      };
      setSystemNotices((current) => {
        const withoutResolvedSaveFailure =
          definitionId === "alert.system.saved"
            ? current.filter(
                (item) =>
                  item.definitionId !== "alert.system.save-failed",
              )
            : current;
        const consolidated = notice.persistent
          ? withoutResolvedSaveFailure.filter(
              (item) => item.definitionId !== definitionId,
            )
          : withoutResolvedSaveFailure;
        return shouldStoreSystemNotice(definitionId)
          ? [...consolidated.slice(-19), notice]
          : consolidated;
      });
      setAnnouncement(message);
    },
    [],
  );


// Source lines 1925-1927
    systemNotices: systemNotices.filter((notice) =>
      shouldStoreSystemNotice(notice.definitionId),
    ),
```

