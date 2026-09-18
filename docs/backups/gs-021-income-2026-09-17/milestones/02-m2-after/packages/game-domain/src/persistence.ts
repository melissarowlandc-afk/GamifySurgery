import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { alertCadencePolicy } from "./alert-cadence";
import {
  getServiceIncomeLine,
  PROTOTYPE_ALERT_SCHEDULING,
  PROTOTYPE_AMBIENT_ALERT_DEFINITIONS,
  PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS,
} from "@gamify-surgery/balance-config";
import {
  applyFsrsReview,
  createNewFsrsCard,
  schedulerPinsMatch,
} from "./fsrs-adapter";
import {
  createPatientPixelAppearance,
  createPixelAppearance,
  normalizePixelAppearance,
  normalizePatientAppearanceForSex,
  roleStyleForStaffDefinition,
} from "./appearance";
import {
  RANDOMNESS_CONTRACT_VERSION,
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import { createInitialGameState } from "./reducer";
import { completePatientDemographics } from "./patientDemographics";
import {
  getOperationalGlp1AutomationCapacity,
  getOperationalGlp1AutomationAssignments,
  getRoomDefinition,
  getStaffRoleDefinition,
} from "./selectors";
import { getEmployeeHomeLocation } from "./staff";
import { getDefaultDoorOffset } from "./doors";
import type {
  AnswerRecord,
  AlertHumorState,
  ConceptLearningHistory,
  DomainContext,
  DoorState,
  EmergencyGlp1State,
  EncounterState,
  EncounterStepState,
  EmployeeState,
  FacilityAlertConditionKey,
  FacilityConditionOccurrenceState,
  FacilityExperienceConditionKey,
  FounderIdentity,
  GameState,
  FrozenOffsitePatientTravel,
  FrozenPatientTravel,
  PendingResult,
  PatientMovementState,
  PatientDissatisfactionCause,
  PlacedRoom,
  ReviewRatingIntent,
  ServiceOperationState,
  TerminalFeedback,
} from "./types";

export function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const DISSATISFACTION_CAUSES = new Set<PatientDissatisfactionCause>([
  "excessive_waiting",
  "poor_cleanliness",
  "missing_amenities",
  "no_receptionist",
  "imaging_unavailable",
  "general",
]);

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

const FACILITY_ALERT_CONDITION_KEYS =
  new Set<FacilityAlertConditionKey>([
    ...FACILITY_EXPERIENCE_CONDITION_KEYS,
    "low_cash",
    "no_cash",
    "advertising_recommended",
    "waiting_room_crowded",
    "room_upgrade_requested",
    "progression_eligible",
  ]);

function normalizeStringHistory(
  value: unknown,
  allowedIds: ReadonlySet<string>,
  maximumLength: number,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique: string[] = [];
  for (const candidate of value) {
    if (
      typeof candidate === "string" &&
      allowedIds.has(candidate) &&
      !unique.includes(candidate)
    ) {
      unique.push(candidate);
    }
  }
  return unique.slice(-maximumLength);
}

function getMigratedAmbientDelay(
  campaignSeed: string,
  ambientSequence: number,
): number {
  const minimum =
    PROTOTYPE_ALERT_SCHEDULING.firstAmbientMinimumMinutes;
  const spread =
    PROTOTYPE_ALERT_SCHEDULING.firstAmbientMaximumMinutes -
    minimum +
    1;
  return (
    minimum +
    deterministicInteger(
      campaignSeed,
      RANDOM_STREAMS.flavorEvents,
      `ambient.first.delay.${ambientSequence}`,
      spread,
    )
  );
}

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

function validatePins(
  parsed: Record<string, unknown>,
  context: DomainContext,
): void {
  if (
    parsed.clinicalReleaseId !== context.clinicalRelease.id ||
    parsed.balanceReleaseId !== context.balanceRelease.id
  ) {
    throw new Error("The save uses incompatible pinned releases.");
  }
}

function scaleLegacyFacilityTicks(
  value: unknown,
  key = "",
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => scaleLegacyFacilityTicks(item));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        scaleLegacyFacilityTicks(childValue, childKey),
      ]),
    );
  }
  const isFacilityTickField =
    key === "facilityTick" ||
    key === "nextRoutineArrivalTick" ||
    key === "lastUsedAtFacilityTick" ||
    key.endsWith("AtTick") ||
    key.endsWith("DueTick") ||
    key.endsWith("DurationTicks") ||
    key.endsWith("StartTick") ||
    key.endsWith("ArrivalTick") ||
    key.endsWith("CompletionTick");
  return isFacilityTickField &&
    key !== "tilesPerTick" &&
    typeof value === "number" &&
    Number.isFinite(value)
    ? value * 60
    : value;
}

/**
 * One-time migration for the unpublished local Milestone 1 save.
 *
 * Version 1 stored review intents but had no campaign identity or FSRS card
 * snapshots. We deterministically rebuild those prototype histories using the
 * old facility tick as the review time and retain every old encounter.
 */
function migrateVersionOne(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  validatePins(parsed, context);
  if (!isRecord(parsed.encounters)) {
    throw new Error("The version 1 save has no valid encounter collection.");
  }
  const legacyEncounters = parsed.encounters;
  const baseline = createInitialGameState(context, {
    campaignId: "campaign.migrated.local-v1",
    campaignSeed: "migrated-local-v1-seed",
    createdAtRealMs: 0,
  });
  const oldReviewIntents = Array.isArray(parsed.reviewIntents)
    ? parsed.reviewIntents.filter(isRecord)
    : [];
  const learningHistories: Record<string, ConceptLearningHistory> = Object.fromEntries(
    context.clinicalRelease.concepts.map((concept) => [
      concept.id,
      {
        conceptId: concept.id,
        card: createNewFsrsCard(0),
        reviews: [],
      },
    ]),
  );
  const migratedReviewIntents = oldReviewIntents.flatMap((intent, index) => {
    const conceptId =
      typeof intent.primaryConceptId === "string"
        ? intent.primaryConceptId
        : null;
    const encounterId =
      typeof intent.encounterId === "string" ? intent.encounterId : null;
    const decisionNodeId =
      typeof intent.decisionNodeId === "string" ? intent.decisionNodeId : null;
    const rating =
      intent.rating === "Good" || intent.rating === "Again"
        ? (intent.rating as ReviewRatingIntent)
        : null;
    const facilityTick =
      typeof intent.facilityTick === "number" &&
      Number.isSafeInteger(intent.facilityTick)
        ? intent.facilityTick
        : 0;
    if (!conceptId || !encounterId || !decisionNodeId || !rating) {
      return [];
    }
    const encounter = legacyEncounters[encounterId];
    if (!isRecord(encounter) || !isRecord(encounter.frozenCase)) {
      return [];
    }
    const decisionNodes = Array.isArray(encounter.frozenCase.decisionNodes)
      ? encounter.frozenCase.decisionNodes.filter(isRecord)
      : [];
    const node = decisionNodes.find(
      (candidate) => candidate.id === decisionNodeId,
    );
    const answers = Array.isArray(encounter.answers)
      ? encounter.answers.filter(isRecord)
      : [];
    const answer = answers.find(
      (candidate) => candidate.decisionNodeId === decisionNodeId,
    );
    const history = learningHistories[conceptId];
    if (
      !node ||
      !answer ||
      !history ||
      typeof node.questionVariantId !== "string" ||
      typeof encounter.frozenCase.patientPresentationVariantId !== "string" ||
      typeof answer.answerChoiceId !== "string"
    ) {
      return [];
    }
    const reviewedAtMs = facilityTick * 60_000 + index;
    const scheduled = applyFsrsReview(
      history.card,
      rating,
      reviewedAtMs,
      context.balanceRelease.learning,
    );
    history.card = scheduled.card;
    history.reviews.push({
      id: `review.${encounterId}.${decisionNodeId}`,
      encounterId,
      decisionNodeId,
      questionVariantId: node.questionVariantId,
      patientPresentationVariantId:
        encounter.frozenCase.patientPresentationVariantId,
      primaryConceptId: conceptId,
      answerChoiceId: answer.answerChoiceId,
      correct: answer.correct === true,
      rating,
      reviewedAtMs,
      facilityTick,
      schedulerLog: scheduled.log,
    });
    return [
      {
        id:
          typeof intent.id === "string"
            ? intent.id
            : `review-intent.${encounterId}.${decisionNodeId}`,
        encounterId,
        decisionNodeId,
        primaryConceptId: conceptId,
        rating,
        facilityTick,
        reviewedAtMs,
      },
    ];
  });

  const versionTwoLike = {
    ...baseline,
    schemaVersion: 2,
    facilityTick:
      typeof parsed.facilityTick === "number" &&
      Number.isSafeInteger(parsed.facilityTick)
        ? parsed.facilityTick
        : 0,
    paused: parsed.paused === true,
    cash:
      typeof parsed.cash === "number" && Number.isFinite(parsed.cash)
        ? parsed.cash
        : baseline.cash,
    clinicalXp:
      typeof parsed.clinicalXp === "number" &&
      Number.isFinite(parsed.clinicalXp)
        ? parsed.clinicalXp
        : 0,
    openChartEncounterId:
      typeof parsed.openChartEncounterId === "string"
        ? parsed.openChartEncounterId
        : null,
    attendedEncounterId:
      typeof parsed.attendedEncounterId === "string"
        ? parsed.attendedEncounterId
        : null,
    rooms: Array.isArray(parsed.rooms)
      ? (parsed.rooms as GameState["rooms"])
      : baseline.rooms,
    encounters: {
      ...baseline.encounters,
      ...(legacyEncounters as GameState["encounters"]),
    },
    learningHistories,
    reviewIntents: migratedReviewIntents,
    settlements: Array.isArray(parsed.settlements)
      ? (parsed.settlements as GameState["settlements"])
      : [],
    operationReceipts: isRecord(parsed.operationReceipts)
      ? (parsed.operationReceipts as GameState["operationReceipts"])
      : {},
    events: Array.isArray(parsed.events)
      ? (parsed.events as GameState["events"])
      : [],
    criticalGuarantees: isRecord(parsed.criticalGuarantees)
      ? (parsed.criticalGuarantees as GameState["criticalGuarantees"])
      : {},
    nextRoutineArrivalTick:
      (typeof parsed.facilityTick === "number" ? parsed.facilityTick : 0) +
      context.balanceRelease.arrivals.levelZeroRecoveryIntervalTicks,
  };
  return migrateVersionTwo(
    scaleLegacyFacilityTicks(
      versionTwoLike,
    ) as Record<string, unknown>,
    context,
  );
}

function isGridPoint(value: unknown): value is { x: number; y: number } {
  return (
    isRecord(value) &&
    typeof value.x === "number" &&
    Number.isFinite(value.x) &&
    typeof value.y === "number" &&
    Number.isFinite(value.y)
  );
}

function isPixelAppearance(
  value: unknown,
): value is FounderIdentity["appearance"] {
  if (!isRecord(value) || value.version !== "pixel-avatar.v1") {
    return false;
  }
  return (
    (value.bodyShape === "compact" ||
      value.bodyShape === "average" ||
      value.bodyShape === "broad" ||
      value.bodyShape === "tall") &&
    (value.hairStyle === "none" ||
      value.hairStyle === "short" ||
      value.hairStyle === "parted" ||
      value.hairStyle === "curly" ||
      value.hairStyle === "bun") &&
    (value.hairShade === 0 ||
      value.hairShade === 1 ||
      value.hairShade === 2 ||
      value.hairShade === 3) &&
    (value.faceStyle === "round" ||
      value.faceStyle === "square" ||
      value.faceStyle === "long") &&
    (value.outfitStyle === "plain" ||
      value.outfitStyle === "striped" ||
      value.outfitStyle === "checked" ||
      value.outfitStyle === "coat") &&
    (value.outfitShade === 0 ||
      value.outfitShade === 1 ||
      value.outfitShade === 2 ||
      value.outfitShade === 3) &&
    (value.accessory === "none" ||
      value.accessory === "glasses" ||
      value.accessory === "badge" ||
      value.accessory === "headband") &&
    (value.skinTone === undefined ||
      value.skinTone === 0 ||
      value.skinTone === 1 ||
      value.skinTone === 2 ||
      value.skinTone === 3) &&
    (value.headVariant === undefined ||
      (typeof value.headVariant === "number" &&
        Number.isSafeInteger(value.headVariant) &&
        value.headVariant >= 0 &&
        value.headVariant <= 29)) &&
    (value.bodyVariant === undefined ||
      (typeof value.bodyVariant === "number" &&
        Number.isSafeInteger(value.bodyVariant) &&
        value.bodyVariant >= 0 &&
        value.bodyVariant <= 29)) &&
    (value.roleStyle === undefined ||
      value.roleStyle === "founder" ||
      value.roleStyle === "patient" ||
      value.roleStyle === "receptionist" ||
      value.roleStyle === "imaging_technician" ||
      value.roleStyle === "periop_nurse" ||
      value.roleStyle === "endoscopy_nurse" ||
      value.roleStyle === "endoscopist" ||
      value.roleStyle === "phlebotomist" ||
      value.roleStyle === "evs_worker" ||
      value.roleStyle === "glp1_np")
  );
}

const SERVICE_OPERATION_STATUSES = new Set<ServiceOperationState["status"]>([
  "waiting_for_resources",
  "walking_to_service",
  "in_service",
  "walking_between_phases",
  "leaving",
  "completed",
  "cancelled",
]);

function normalizeServiceOperations(
  candidate: unknown,
): ServiceOperationState[] {
  if (!Array.isArray(candidate)) return [];
  return candidate.flatMap((raw) => {
    if (
      !isRecord(raw) ||
      typeof raw.id !== "string" ||
      typeof raw.incomeLineId !== "string" ||
      !getServiceIncomeLine(raw.incomeLineId)?.operation ||
      (raw.actorKind !== "visitor" && raw.actorKind !== "encounter" && raw.actorKind !== "remote") ||
      typeof raw.actorId !== "string" ||
      typeof raw.displayName !== "string" ||
      typeof raw.status !== "string" ||
      !SERVICE_OPERATION_STATUSES.has(raw.status as ServiceOperationState["status"]) ||
      typeof raw.createdAtFacilityTick !== "number" || !Number.isSafeInteger(raw.createdAtFacilityTick) ||
      typeof raw.waitDeadlineFacilityTick !== "number" || !Number.isSafeInteger(raw.waitDeadlineFacilityTick) ||
      typeof raw.quoteFee !== "number" || !Number.isFinite(raw.quoteFee) || raw.quoteFee < 0 ||
      typeof raw.phaseIndex !== "number" || !Number.isSafeInteger(raw.phaseIndex) || raw.phaseIndex < 0 ||
      !Array.isArray(raw.reservedRoomInstanceIds) ||
      !Array.isArray(raw.reservedEmployeeIds) ||
      !Array.isArray(raw.path) ||
      typeof raw.pathIndex !== "number" || !Number.isSafeInteger(raw.pathIndex) ||
      typeof raw.lastMovedAtFacilityTick !== "number" || !Number.isSafeInteger(raw.lastMovedAtFacilityTick)
    ) return [];
    const line = getServiceIncomeLine(raw.incomeLineId)!;
    if (
      raw.phaseIndex > line.operation!.phases.length ||
      (raw.phaseIndex === line.operation!.phases.length && raw.status !== "leaving" && raw.status !== "completed" && raw.status !== "cancelled")
    ) return [];
    const path = raw.path.filter(isGridPoint).map((point) => ({ ...point }));
    const providerReservation = isRecord(raw.providerReservation) && raw.providerReservation.kind === "founder"
      ? { kind: "founder" as const }
      : isRecord(raw.providerReservation) && raw.providerReservation.kind === "employee" && typeof raw.providerReservation.employeeId === "string"
        ? { kind: "employee" as const, employeeId: raw.providerReservation.employeeId }
        : null;
    const nullableTick = (value: unknown) =>
      typeof value === "number" && Number.isSafeInteger(value) ? value : null;
    return [{
      id: raw.id,
      incomeLineId: raw.incomeLineId,
      catalogVersion: 1 as const,
      actorKind: raw.actorKind,
      actorId: raw.actorId,
      displayName: raw.displayName,
      appearance: isPixelAppearance(raw.appearance) ? raw.appearance : null,
      status: raw.status as ServiceOperationState["status"],
      createdAtFacilityTick: raw.createdAtFacilityTick,
      waitDeadlineFacilityTick: raw.waitDeadlineFacilityTick,
      startedAtFacilityTick: nullableTick(raw.startedAtFacilityTick),
      completedAtFacilityTick: nullableTick(raw.completedAtFacilityTick),
      cancelledAtFacilityTick: nullableTick(raw.cancelledAtFacilityTick),
      quoteFee: raw.quoteFee,
      phaseIndex: raw.phaseIndex,
      phaseStartedAtFacilityTick: nullableTick(raw.phaseStartedAtFacilityTick),
      phaseEndsAtFacilityTick: nullableTick(raw.phaseEndsAtFacilityTick),
      reservedRoomInstanceIds: raw.reservedRoomInstanceIds.filter((id): id is string => typeof id === "string"),
      reservedEmployeeIds: raw.reservedEmployeeIds.filter((id): id is string => typeof id === "string"),
      providerReservation,
      location: isGridPoint(raw.location) ? { ...raw.location } : null,
      path,
      pathIndex: path.length > 0 ? Math.max(0, Math.min(path.length - 1, raw.pathIndex)) : 0,
      lastMovedAtFacilityTick: raw.lastMovedAtFacilityTick,
      cancellationReason: typeof raw.cancellationReason === "string" ? raw.cancellationReason : null,
    } satisfies ServiceOperationState];
  });
}

function normalizeFounder(
  candidate: unknown,
  campaignSeed: string,
): FounderIdentity {
  if (isRecord(candidate)) {
    const displayName =
      typeof candidate.displayName === "string"
        ? candidate.displayName.trim()
        : "";
    if (
      displayName.length > 0 &&
      displayName.length <= 60 &&
      isPixelAppearance(candidate.appearance)
    ) {
      return {
        displayName,
        headId:
          typeof candidate.headId === "string" &&
          candidate.headId.trim().length > 0
            ? candidate.headId
            : "head.legacy",
        bodyId:
          typeof candidate.bodyId === "string" &&
          candidate.bodyId.trim().length > 0
            ? candidate.bodyId
            : "body.legacy",
        appearance: normalizePixelAppearance(
          candidate.appearance,
          "founder",
        ),
      };
    }
  }
  return {
    displayName: "Founder",
    headId: "head.generated",
    bodyId: "body.generated",
    appearance: createPixelAppearance(
      campaignSeed,
      "staff",
      "founder",
      "founder",
    ),
  };
}

function normalizeEmergencyGlp1State(
  candidate: unknown,
  state: GameState,
  context: DomainContext,
): EmergencyGlp1State {
  const raw = isRecord(candidate) ? candidate : {};
  const clock = context.balanceRelease.clock;
  const operatingTicksPerDay =
    (clock.dayEndHour - clock.dayStartHour) * 60;
  const currentDayNumber =
    Math.floor(state.facilityTick / operatingTicksPerDay) + 1;
  const storedDayNumber =
    typeof raw.dayNumber === "number" &&
    Number.isSafeInteger(raw.dayNumber) &&
    raw.dayNumber > 0
      ? raw.dayNumber
      : currentDayNumber;
  const usesToday =
    storedDayNumber === currentDayNumber &&
    typeof raw.usesToday === "number" &&
    Number.isSafeInteger(raw.usesToday) &&
    raw.usesToday >= 0
      ? raw.usesToday
      : 0;
  const totalUses =
    typeof raw.totalUses === "number" &&
    Number.isSafeInteger(raw.totalUses) &&
    raw.totalUses >= usesToday
      ? raw.totalUses
      : usesToday;
  const lastUsedAtFacilityTick =
    typeof raw.lastUsedAtFacilityTick === "number" &&
    Number.isSafeInteger(raw.lastUsedAtFacilityTick) &&
    raw.lastUsedAtFacilityTick >= 0 &&
    raw.lastUsedAtFacilityTick <= state.facilityTick
      ? raw.lastUsedAtFacilityTick
      : null;
  const sarcasmMessagesShown =
    typeof raw.sarcasmMessagesShown === "number" &&
    Number.isSafeInteger(raw.sarcasmMessagesShown) &&
    raw.sarcasmMessagesShown >= 0
      ? raw.sarcasmMessagesShown
      : 0;
  return {
    dayNumber: currentDayNumber,
    usesToday,
    totalUses,
    lastUsedAtFacilityTick,
    sarcasmMessagesShown,
    lastFlavorMessage:
      storedDayNumber === currentDayNumber &&
      typeof raw.lastFlavorMessage === "string"
        ? raw.lastFlavorMessage
        : null,
  };
}

function normalizeRooms(
  parsed: Record<string, unknown>,
  baseline: GameState,
  context: DomainContext,
): PlacedRoom[] {
  if (!Array.isArray(parsed.rooms)) {
    return baseline.rooms;
  }
  return parsed.rooms.flatMap((candidate) => {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== "string" ||
      typeof candidate.roomDefinitionId !== "string" ||
      typeof candidate.x !== "number" ||
      typeof candidate.y !== "number"
    ) {
      return [];
    }
    const definition = getRoomDefinition(candidate.roomDefinitionId, context);
    if (!definition) {
      return [];
    }
    const orientation =
      candidate.orientation === 90 ||
      candidate.orientation === 180 ||
      candidate.orientation === 270
        ? candidate.orientation
        : 0;
    const doorSide =
      candidate.doorSide === "north" ||
      candidate.doorSide === "east" ||
      candidate.doorSide === "south" ||
      candidate.doorSide === "west" ||
      candidate.doorSide === null
        ? candidate.doorSide
        : definition.defaultDoorSide;
    const upgradeLevel =
      candidate.upgradeLevel === 2 ||
      candidate.upgradeLevel === 3 ||
      candidate.upgradeLevel === 4 ||
      candidate.upgradeLevel === 5
        ? candidate.upgradeLevel
        : 1;
    return [
      {
        id: candidate.id,
        roomDefinitionId: candidate.roomDefinitionId,
        x: candidate.x,
        y: candidate.y,
        orientation,
        doorSide,
        upgradeLevel,
        cleanliness:
          typeof candidate.cleanliness === "number" &&
          Number.isFinite(candidate.cleanliness)
            ? Math.max(0, Math.min(100, candidate.cleanliness))
            : 100,
      },
    ];
  });
}

function normalizeDoors(
  parsed: Record<string, unknown>,
  rooms: readonly PlacedRoom[],
  context: DomainContext,
): DoorState[] {
  if (Array.isArray(parsed.doors)) {
    return parsed.doors.flatMap((candidate) => {
      if (
        !isRecord(candidate) ||
        typeof candidate.id !== "string" ||
        typeof candidate.roomId !== "string" ||
        (candidate.side !== "north" &&
          candidate.side !== "east" &&
          candidate.side !== "south" &&
          candidate.side !== "west") ||
        typeof candidate.offset !== "number" ||
        !Number.isSafeInteger(candidate.offset)
      ) {
        return [];
      }
      return [
        {
          id: candidate.id,
          roomId: candidate.roomId,
          side: candidate.side,
          offset: candidate.offset,
          exterior: candidate.exterior === true,
        },
      ];
    });
  }

  const migrated: DoorState[] = rooms.flatMap((room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition || definition.kind === "hallway" || room.doorSide === null) {
      return [];
    }
    return [
      {
        id: `door.migrated.${room.id}.embedded`,
        roomId: room.id,
        side: room.doorSide,
        offset: getDefaultDoorOffset(room, definition, room.doorSide),
        exterior: false,
      } satisfies DoorState,
    ];
  });
  const frontRoom = rooms.find((room) =>
    context.balanceRelease.facility.protectedRoomDefinitionIds.includes(
      room.roomDefinitionId,
    ),
  );
  const frontDefinition = frontRoom
    ? getRoomDefinition(frontRoom.roomDefinitionId, context)
    : null;
  if (frontRoom && frontDefinition) {
    migrated.push({
      id: "door.instance.front_entrance",
      roomId: frontRoom.id,
      side: "south",
      offset: getDefaultDoorOffset(
        frontRoom,
        frontDefinition,
        "south",
      ),
      exterior: true,
    });
  }
  return migrated;
}

function normalizeAnswers(
  encounter: Record<string, unknown>,
  nodeCount: number,
): AnswerRecord[] {
  const answers = Array.isArray(encounter.answers)
    ? encounter.answers.filter(isRecord)
    : [];
  return answers.flatMap((answer) => {
    if (
      typeof answer.decisionNodeId !== "string" ||
      typeof answer.primaryConceptId !== "string" ||
      typeof answer.answerChoiceId !== "string" ||
      typeof answer.answeredAtFacilityTick !== "number" ||
      typeof answer.explanation !== "string" ||
      (answer.ratingIntent !== "Good" && answer.ratingIntent !== "Again")
    ) {
      return [];
    }
    const frozenCase = isRecord(encounter.frozenCase)
      ? encounter.frozenCase
      : null;
    const nodes = frozenCase && Array.isArray(frozenCase.decisionNodes)
      ? frozenCase.decisionNodes.filter(isRecord)
      : [];
    const nodeIndex = nodes.findIndex(
      (node) => node.id === answer.decisionNodeId,
    );
    return [
      {
        decisionNodeId: answer.decisionNodeId,
        primaryConceptId: answer.primaryConceptId,
        answerChoiceId: answer.answerChoiceId,
        correct: answer.correct === true,
        ratingIntent: answer.ratingIntent,
        answeredAtFacilityTick: answer.answeredAtFacilityTick,
        explanation: answer.explanation,
        correctedForward:
          typeof answer.correctedForward === "boolean"
            ? answer.correctedForward
            : answer.correct !== true &&
              nodeIndex >= 0 &&
              nodeIndex < nodeCount - 1,
      },
    ];
  });
}

function normalizeFrozenPatientTravel(
  candidate: unknown,
  currentTilesPerTick: number,
): FrozenPatientTravel | null {
  if (
    !isRecord(candidate) ||
    candidate.version !== "patient-travel.v1" ||
    typeof candidate.originRoomInstanceId !== "string" ||
    typeof candidate.destinationRoomInstanceId !== "string" ||
    !Array.isArray(candidate.outboundPath) ||
    !Array.isArray(candidate.returnPath)
  ) {
    return null;
  }
  const outboundPath = candidate.outboundPath
    .filter(isGridPoint)
    .map((point) => ({ ...point }));
  const returnPath = candidate.returnPath
    .filter(isGridPoint)
    .map((point) => ({ ...point }));
  const numericKeys = [
    "tilesPerTick",
    "outboundStartTick",
    "outboundArrivalTick",
    "serviceCompletionTick",
    "returnArrivalTick",
  ] as const;
  if (
    outboundPath.length !== candidate.outboundPath.length ||
    returnPath.length !== candidate.returnPath.length ||
    outboundPath.length === 0 ||
    returnPath.length === 0 ||
    numericKeys.some(
      (key) =>
        typeof candidate[key] !== "number" ||
        !Number.isSafeInteger(candidate[key]) ||
        candidate[key] < 0,
    ) ||
    candidate.tilesPerTick === 0
  ) {
    return null;
  }
  return {
    version: "patient-travel.v1",
    originRoomInstanceId: candidate.originRoomInstanceId,
    destinationRoomInstanceId: candidate.destinationRoomInstanceId,
    outboundPath,
    returnPath,
    tilesPerTick: currentTilesPerTick,
    outboundStartTick: candidate.outboundStartTick as number,
    outboundArrivalTick: candidate.outboundArrivalTick as number,
    serviceCompletionTick: candidate.serviceCompletionTick as number,
    returnArrivalTick: candidate.returnArrivalTick as number,
  };
}

function normalizeFrozenOffsitePatientTravel(
  candidate: unknown,
  currentTilesPerTick: number,
): FrozenOffsitePatientTravel | null {
  if (
    !isRecord(candidate) ||
    candidate.version !== "offsite-patient-travel.v1" ||
    (candidate.direction !== -1 && candidate.direction !== 1) ||
    !Array.isArray(candidate.outboundPath) ||
    !Array.isArray(candidate.returnPath)
  ) {
    return null;
  }
  const outboundPath = candidate.outboundPath
    .filter(isGridPoint)
    .map((point) => ({ ...point }));
  const returnPath = candidate.returnPath
    .filter(isGridPoint)
    .map((point) => ({ ...point }));
  const numericKeys = [
    "tilesPerTick",
    "outboundStartTick",
    "outboundArrivalTick",
    "returnStartTick",
    "returnArrivalTick",
  ] as const;
  if (
    outboundPath.length !== candidate.outboundPath.length ||
    returnPath.length !== candidate.returnPath.length ||
    outboundPath.length === 0 ||
    returnPath.length === 0 ||
    numericKeys.some(
      (key) =>
        typeof candidate[key] !== "number" ||
        !Number.isSafeInteger(candidate[key]) ||
        candidate[key] < 0,
    ) ||
    candidate.tilesPerTick === 0 ||
    Number(candidate.outboundArrivalTick) <
      Number(candidate.outboundStartTick) ||
    Number(candidate.returnStartTick) <
      Number(candidate.outboundArrivalTick) ||
    Number(candidate.returnArrivalTick) <
      Number(candidate.returnStartTick)
  ) {
    return null;
  }
  return {
    version: "offsite-patient-travel.v1",
    direction: candidate.direction,
    outboundPath,
    returnPath,
    tilesPerTick: currentTilesPerTick,
    outboundStartTick: candidate.outboundStartTick as number,
    outboundArrivalTick: candidate.outboundArrivalTick as number,
    returnStartTick: candidate.returnStartTick as number,
    returnArrivalTick: candidate.returnArrivalTick as number,
  };
}

function normalizePendingResult(
  candidate: unknown,
  context: DomainContext,
): PendingResult | null {
  if (!isRecord(candidate)) {
    return null;
  }
  const durationTicks =
    typeof candidate.durationTicks === "number" &&
    Number.isSafeInteger(candidate.durationTicks) &&
    candidate.durationTicks > 0
      ? candidate.durationTicks
      : 1;
  const serviceDurationTicks =
    typeof candidate.serviceDurationTicks === "number" &&
    Number.isSafeInteger(candidate.serviceDurationTicks) &&
    candidate.serviceDurationTicks > 0
      ? candidate.serviceDurationTicks
      : durationTicks;
  return {
    ...(JSON.parse(JSON.stringify(candidate)) as PendingResult),
    serviceDurationTicks,
    durationTicks,
    offsiteReturnStartedAtTick:
      typeof candidate.offsiteReturnStartedAtTick === "number" &&
      Number.isSafeInteger(candidate.offsiteReturnStartedAtTick) &&
      candidate.offsiteReturnStartedAtTick >= 0
        ? candidate.offsiteReturnStartedAtTick
        : null,
    offsiteTravel: normalizeFrozenOffsitePatientTravel(
      candidate.offsiteTravel,
      context.balanceRelease.facility.characterTravelTilesPerTick,
    ),
    patientTravel: normalizeFrozenPatientTravel(
      candidate.patientTravel,
      context.balanceRelease.facility.characterTravelTilesPerTick,
    ),
    patientRemainsOnsite:
      candidate.patientRemainsOnsite === true ? true : undefined,
    serviceIncomeEligible:
      candidate.serviceIncomeEligible === true &&
      typeof candidate.serviceIncomeLineId === "string" &&
      typeof candidate.serviceIncomeFee === "number" &&
      Number.isFinite(candidate.serviceIncomeFee) && candidate.serviceIncomeFee >= 0
        ? true
        : undefined,
    serviceIncomeLineId:
      candidate.serviceIncomeEligible === true && typeof candidate.serviceIncomeLineId === "string"
        ? candidate.serviceIncomeLineId
        : undefined,
    serviceIncomeFee:
      candidate.serviceIncomeEligible === true && typeof candidate.serviceIncomeFee === "number" && Number.isFinite(candidate.serviceIncomeFee) && candidate.serviceIncomeFee >= 0
        ? candidate.serviceIncomeFee
        : undefined,
    timingPhases: Array.isArray(candidate.timingPhases)
      ? candidate.timingPhases.filter(isRecord).map((phase) => ({ id: typeof phase.id === "string" ? phase.id : "phase.legacy", durationTicks: typeof phase.durationTicks === "number" ? phase.durationTicks : 1, resourceBound: phase.resourceBound === true, startsAtTick: typeof phase.startsAtTick === "number" ? phase.startsAtTick : 0, endsAtTick: typeof phase.endsAtTick === "number" ? phase.endsAtTick : 1 }))
      : [],
    resourceReservations: Array.isArray(candidate.resourceReservations)
      ? candidate.resourceReservations.filter(isRecord).flatMap((resource) =>
          typeof resource.roomDefinitionId === "string" &&
          (typeof resource.staffRoleDefinitionId === "string" || resource.staffRoleDefinitionId === null)
            ? [{ roomDefinitionId: resource.roomDefinitionId, staffRoleDefinitionId: resource.staffRoleDefinitionId }]
            : [],
        )
      : [],
    imagingTechnicianId:
      typeof candidate.imagingTechnicianId === "string"
        ? candidate.imagingTechnicianId
        : null,
    providerReservation: isRecord(candidate.providerReservation)
      ? candidate.providerReservation.kind === "founder"
        ? { kind: "founder" }
        : candidate.providerReservation.kind === "employee" &&
            typeof candidate.providerReservation.employeeId === "string" &&
            typeof candidate.providerReservation.staffRoleDefinitionId ===
              "string"
          ? {
              kind: "employee",
              employeeId: candidate.providerReservation.employeeId,
              staffRoleDefinitionId:
                candidate.providerReservation.staffRoleDefinitionId,
            }
          : null
      : null,
  };
}

function normalizeDissatisfactionByCause(
  value: unknown,
  patientSatisfaction: number,
  facilityTick: number,
  context: DomainContext,
): EncounterState["dissatisfactionByCause"] {
  const normalized: EncounterState["dissatisfactionByCause"] = {};
  if (isRecord(value)) {
    for (const [rawCause, rawState] of Object.entries(value)) {
      if (
        !DISSATISFACTION_CAUSES.has(
          rawCause as PatientDissatisfactionCause,
        ) ||
        !isRecord(rawState) ||
        typeof rawState.pointsLost !== "number" ||
        !Number.isFinite(rawState.pointsLost) ||
        rawState.pointsLost <= 0
      ) {
        continue;
      }
      const cause = rawCause as PatientDissatisfactionCause;
      normalized[cause] = {
        pointsLost: rawState.pointsLost,
        lastAppliedAtFacilityTick:
          typeof rawState.lastAppliedAtFacilityTick === "number" &&
          Number.isSafeInteger(
            rawState.lastAppliedAtFacilityTick,
          ) &&
          rawState.lastAppliedAtFacilityTick >= 0
            ? rawState.lastAppliedAtFacilityTick
            : facilityTick,
      };
    }
  }
  if (
    Object.keys(normalized).length === 0 &&
    patientSatisfaction <
      context.balanceRelease.patientSatisfaction.startingValue
  ) {
    normalized.general = {
      pointsLost:
        context.balanceRelease.patientSatisfaction.startingValue -
        patientSatisfaction,
      lastAppliedAtFacilityTick: facilityTick,
    };
  }
  return normalized;
}

function normalizeFacilityExperienceAtCheckIn(
  value: unknown,
  fallbackAppliedAtFacilityTick: number,
  patientHasCheckedIn: boolean,
): EncounterState["facilityExperienceAtCheckIn"] {
  if (isRecord(value)) {
    const rawConditions = Array.isArray(value.conditions)
      ? value.conditions
      : [];
    const conditions = rawConditions.flatMap((candidate) => {
      if (
        !isRecord(candidate) ||
        typeof candidate.conditionKey !== "string" ||
        !FACILITY_EXPERIENCE_CONDITION_KEYS.has(
          candidate.conditionKey as FacilityExperienceConditionKey,
        ) ||
        typeof candidate.penalty !== "number" ||
        !Number.isFinite(candidate.penalty) ||
        candidate.penalty < 0 ||
        typeof candidate.cause !== "string" ||
        !DISSATISFACTION_CAUSES.has(
          candidate.cause as PatientDissatisfactionCause,
        )
      ) {
        return [];
      }
      return [
        {
          conditionKey:
            candidate.conditionKey as FacilityExperienceConditionKey,
          penalty: candidate.penalty,
          cause: candidate.cause as PatientDissatisfactionCause,
        },
      ];
    });
    const totalPenalty = conditions.reduce(
      (sum, condition) => sum + condition.penalty,
      0,
    );
    return {
      appliedAtFacilityTick:
        typeof value.appliedAtFacilityTick === "number" &&
        Number.isSafeInteger(value.appliedAtFacilityTick) &&
        value.appliedAtFacilityTick >= 0
          ? value.appliedAtFacilityTick
          : fallbackAppliedAtFacilityTick,
      totalPenalty,
      conditions,
    };
  }
  // Existing checked-in saves are grandfathered at their persisted score.
  // This prevents a reload from applying the new one-time penalty mid-visit.
  return patientHasCheckedIn
    ? {
        appliedAtFacilityTick: fallbackAppliedAtFacilityTick,
        totalPenalty: 0,
        conditions: [],
      }
    : null;
}

function normalizeEncounter(
  encounterId: string,
  candidate: Record<string, unknown>,
  campaignSeed: string,
  facilityTick: number,
  context: DomainContext,
): EncounterState | null {
  if (!isRecord(candidate.frozenCase)) {
    return null;
  }
  const frozenCase = JSON.parse(
    JSON.stringify(candidate.frozenCase),
  ) as Record<string, unknown>;
  frozenCase.prototypeDemographics = completePatientDemographics({
    caseId: typeof frozenCase.id === "string" ? frozenCase.id : encounterId,
    campaignSeed,
    encounterId,
    demographics: isRecord(frozenCase.prototypeDemographics)
      ? frozenCase.prototypeDemographics
      : undefined,
    savedPatientIdentityId: isPixelAppearance(candidate.patientAppearance)
      ? candidate.patientAppearance.patientIdentityId
      : undefined,
  });
  const frozenDemographics = isRecord(
    frozenCase.prototypeDemographics,
  )
    ? frozenCase.prototypeDemographics
    : null;
  const patientSexLabel =
    frozenDemographics?.sexLabel === "Female" ||
    frozenDemographics?.sexLabel === "Male" ||
    frozenDemographics?.sexLabel === "Not specified"
      ? frozenDemographics.sexLabel
      : undefined;
  const patientAgeYears =
    typeof frozenDemographics?.ageYears === "number" &&
    Number.isInteger(frozenDemographics.ageYears)
      ? frozenDemographics.ageYears
      : undefined;
  const rawNodes = Array.isArray(frozenCase.decisionNodes)
    ? frozenCase.decisionNodes.filter(isRecord)
    : [];
  frozenCase.decisionNodes = rawNodes.map((node) => {
    const gate = isRecord(node.resultGateAfter)
      ? node.resultGateAfter
      : null;
    const answerChoices = Array.isArray(node.answerChoices)
      ? node.answerChoices.filter(isRecord)
      : [];
    return {
      ...node,
      answerChoices: answerChoices.map((choice) => ({
        ...choice,
        serviceRequest:
          isRecord(choice.serviceRequest) &&
          typeof choice.serviceRequest.serviceId === "string"
            ? choice.serviceRequest
            : choice.isCorrect === true &&
                gate &&
                typeof gate.resultTypeId === "string"
              ? { serviceId: gate.resultTypeId }
              : null,
      })),
    };
  });

  const answers = normalizeAnswers(candidate, rawNodes.length);
  const currentNodeIndex =
    typeof candidate.currentNodeIndex === "number" &&
    Number.isSafeInteger(candidate.currentNodeIndex)
      ? candidate.currentNodeIndex
      : 0;
  const pendingResult = normalizePendingResult(
    candidate.pendingResult,
    context,
  );
  const patientLocation = isGridPoint(candidate.patientLocation)
    ? { ...candidate.patientLocation }
    : null;
  const rawMovement = isRecord(candidate.patientMovement)
    ? candidate.patientMovement
    : null;
  const movementPath =
    rawMovement && Array.isArray(rawMovement.path)
      ? rawMovement.path
          .filter(isGridPoint)
          .map((point) => ({ ...point }))
      : [];
  const movementKinds = new Set<PatientMovementState["kind"]>([
    "arriving_for_check_in",
    "walking_to_waiting",
    "walking_to_care",
    "departing_for_offsite_testing",
    "returning_from_offsite_testing",
    "idle_within_room",
    "leaving_after_resolution",
    "leaving_after_walkout",
  ]);
  const patientMovement: PatientMovementState | null =
    rawMovement &&
    typeof rawMovement.kind === "string" &&
    movementKinds.has(rawMovement.kind as PatientMovementState["kind"]) &&
    movementPath.length > 0
      ? {
          kind: rawMovement.kind as PatientMovementState["kind"],
          path: movementPath,
          pathIndex:
            typeof rawMovement.pathIndex === "number" &&
            Number.isSafeInteger(rawMovement.pathIndex)
              ? Math.max(
                  0,
                  Math.min(
                    movementPath.length - 1,
                    rawMovement.pathIndex,
                  ),
                )
              : 0,
          lastMovedAtFacilityTick:
            typeof rawMovement.lastMovedAtFacilityTick === "number" &&
            Number.isSafeInteger(
              rawMovement.lastMovedAtFacilityTick,
            )
              ? rawMovement.lastMovedAtFacilityTick
              : facilityTick,
          destinationRoomInstanceId:
            typeof rawMovement.destinationRoomInstanceId === "string"
              ? rawMovement.destinationRoomInstanceId
              : null,
        }
      : null;
  const lifecycle = candidate.lifecycle as EncounterState["lifecycle"];
  const checkInStatus: EncounterState["checkInStatus"] =
    candidate.checkInStatus === "approaching" ||
    candidate.checkInStatus === "awaiting_staff" ||
    candidate.checkInStatus === "checked_in"
      ? candidate.checkInStatus
      : patientMovement?.kind === "arriving_for_check_in"
        ? "approaching"
        : "checked_in";
  const checkInWaitingSinceTick =
    checkInStatus === "awaiting_staff" &&
    typeof candidate.checkInWaitingSinceTick === "number" &&
    Number.isSafeInteger(candidate.checkInWaitingSinceTick) &&
    candidate.checkInWaitingSinceTick >= 0 &&
    candidate.checkInWaitingSinceTick <= facilityTick
      ? candidate.checkInWaitingSinceTick
      : checkInStatus === "awaiting_staff"
        ? facilityTick
        : null;
  const waitingDestination =
    isRecord(candidate.waitingDestination) &&
    isGridPoint(candidate.waitingDestination.location) &&
    (candidate.waitingDestination.kind === "chair" ||
      candidate.waitingDestination.kind === "standing" ||
      candidate.waitingDestination.kind === "public_wander")
      ? {
          roomInstanceId:
            typeof candidate.waitingDestination.roomInstanceId === "string"
              ? candidate.waitingDestination.roomInstanceId
              : null,
          location: { ...candidate.waitingDestination.location },
          kind: candidate.waitingDestination.kind as
            | "chair"
            | "standing"
            | "public_wander",
        }
      : null;
  const legacyResolutionReason = candidate.resolutionReason;
  const resolutionReason =
    legacyResolutionReason === "completed"
      ? ("completed" as const)
      : legacyResolutionReason === "walkout" ||
          legacyResolutionReason === "left_before_seen"
        ? ("walkout" as const)
        : null;
  const patientSatisfactionSource =
    typeof candidate.patientSatisfaction === "number" &&
    Number.isFinite(candidate.patientSatisfaction)
      ? candidate.patientSatisfaction
      : typeof candidate.patientConfidence === "number" &&
          Number.isFinite(candidate.patientConfidence)
        ? candidate.patientConfidence
        : context.balanceRelease.patientSatisfaction.startingValue;
  const patientSatisfaction = Math.max(
    0,
    Math.min(100, patientSatisfactionSource),
  );
  const waiting = isRecord(candidate.waiting) ? candidate.waiting : {};
  const arrivedAtTick =
    typeof waiting.arrivedAtTick === "number" &&
    Number.isSafeInteger(waiting.arrivedAtTick)
      ? waiting.arrivedAtTick
      : 0;
  const defaultIdleWaitingSinceTick =
    lifecycle === "waiting_unopened" || lifecycle === "active_action_required"
      ? arrivedAtTick
      : null;
  const idleWaitingSinceTick =
    candidate.idleWaitingSinceTick === null
      ? null
      : typeof candidate.idleWaitingSinceTick === "number" &&
          Number.isSafeInteger(candidate.idleWaitingSinceTick)
        ? candidate.idleWaitingSinceTick
        : defaultIdleWaitingSinceTick;
  const existingSteps = Array.isArray(candidate.steps)
    ? candidate.steps.filter(isRecord)
    : [];
  const steps = rawNodes.map((node, nodeIndex) => {
    const existingStep = existingSteps.find(
      (step) => step.decisionNodeId === node.id,
    );
    const answer =
      answers.find((item) => item.decisionNodeId === node.id) ?? null;
    const result =
      existingStep && isRecord(existingStep.result)
        ? normalizePendingResult(existingStep.result, context)
        : pendingResult?.originatingNodeIndex === nodeIndex
        ? JSON.parse(JSON.stringify(pendingResult))
        : null;
    const existingStatus = existingStep?.status;
    const status: EncounterStepState["status"] =
      existingStatus === "locked" ||
      existingStatus === "action_required" ||
      existingStatus === "feedback_pending" ||
      existingStatus === "result_pending" ||
      existingStatus === "completed"
        ? existingStatus
        : lifecycle === "active_pending_result" && nodeIndex === currentNodeIndex
        ? ("result_pending" as const)
        : answer !== null &&
            (nodeIndex < currentNodeIndex ||
              lifecycle === "resolved_summary_available" ||
              lifecycle === "resolved" ||
              result?.deliveredAtTick !== null)
          ? ("completed" as const)
          : nodeIndex === currentNodeIndex &&
              (lifecycle === "active_action_required" ||
                lifecycle === "waiting_unopened")
            ? ("action_required" as const)
            : ("locked" as const);
    return {
      nodeIndex,
      decisionNodeId:
        typeof node.id === "string" ? node.id : `migrated.node.${nodeIndex}`,
      questionVariantId:
        typeof node.questionVariantId === "string"
          ? node.questionVariantId
          : `migrated.question.${nodeIndex}`,
      primaryConceptId:
        typeof node.primaryConceptId === "string"
          ? node.primaryConceptId
          : `migrated.concept.${nodeIndex}`,
      status,
      answer,
      result,
    };
  });
  const persistedFeedAttentionKind =
    candidate.feedAttentionKind === "checked_in" ||
    candidate.feedAttentionKind === "clinical_decision" ||
    candidate.feedAttentionKind === "result_ready"
      ? candidate.feedAttentionKind
      : null;
  const persistedFeedAttentionStartedAtTick =
    typeof candidate.feedAttentionStartedAtTick === "number" &&
    Number.isSafeInteger(candidate.feedAttentionStartedAtTick) &&
    candidate.feedAttentionStartedAtTick >= 0 &&
    candidate.feedAttentionStartedAtTick <= facilityTick
      ? candidate.feedAttentionStartedAtTick
      : null;
  const legacyFeedAttentionKind: EncounterState["feedAttentionKind"] =
    lifecycle === "waiting_unopened" &&
    checkInStatus === "checked_in"
      ? "checked_in"
      : lifecycle === "active_action_required" &&
          idleWaitingSinceTick !== null
        ? pendingResult?.deliveredAtTick !== null &&
          pendingResult?.deliveredAtTick !== undefined &&
          currentNodeIndex > pendingResult.originatingNodeIndex
          ? "result_ready"
          : "clinical_decision"
        : null;
  const feedAttentionKind =
    checkInStatus !== "checked_in" &&
    persistedFeedAttentionKind === "checked_in"
      ? null
      : (persistedFeedAttentionKind ??
        (persistedFeedAttentionStartedAtTick === null
          ? legacyFeedAttentionKind
          : null));
  const feedAttentionStartedAtTick =
    feedAttentionKind === null
      ? null
      : (persistedFeedAttentionStartedAtTick ??
        idleWaitingSinceTick ??
        arrivedAtTick);

  return {
    ...(candidate as unknown as EncounterState),
    frozenCase:
      frozenCase as unknown as EncounterState["frozenCase"],
    feedAttentionKind,
    feedAttentionStartedAtTick,
    patientAppearance:
      isPixelAppearance(candidate.patientAppearance)
        ? normalizePatientAppearanceForSex(
            candidate.patientAppearance,
            patientSexLabel,
            patientAgeYears,
            `${campaignSeed}:${encounterId}:legacy-patient-roster.v1`,
          )
        : createPatientPixelAppearance(
            campaignSeed,
            encounterId,
            { sexLabel: patientSexLabel, ageYears: patientAgeYears },
          ),
    patientSatisfaction,
    idleWaitingSinceTick,
    lastSatisfactionDecayAtTick:
      typeof candidate.lastSatisfactionDecayAtTick === "number" &&
      Number.isSafeInteger(candidate.lastSatisfactionDecayAtTick)
        ? candidate.lastSatisfactionDecayAtTick
        : (idleWaitingSinceTick ?? facilityTick),
    walkoutThreshold:
      typeof candidate.walkoutThreshold === "number" &&
      Number.isSafeInteger(candidate.walkoutThreshold) &&
      candidate.walkoutThreshold >= 0 &&
      candidate.walkoutThreshold <= 59
        ? candidate.walkoutThreshold
        : deterministicInteger(
            campaignSeed,
            RANDOM_STREAMS.patientWalkout,
            `${encounterId}:threshold.v1`,
            context.balanceRelease.patientSatisfaction
              .walkoutThresholdMaximum + 1,
          ),
    satisfactionWarningsShown: Array.isArray(
      candidate.satisfactionWarningsShown,
    )
      ? candidate.satisfactionWarningsShown.filter(
          (threshold): threshold is number =>
            typeof threshold === "number" &&
            Number.isSafeInteger(threshold),
        )
      : [],
    dissatisfactionByCause: normalizeDissatisfactionByCause(
      candidate.dissatisfactionByCause,
      patientSatisfaction,
      facilityTick,
      context,
    ),
    facilityExperienceAtCheckIn:
      normalizeFacilityExperienceAtCheckIn(
        candidate.facilityExperienceAtCheckIn,
        arrivedAtTick,
        checkInStatus === "checked_in",
      ),
    checkInStatus,
    checkInWaitingSinceTick,
    unstaffedCheckInOverdueApplied:
      candidate.unstaffedCheckInOverdueApplied === true,
    waitingDestination,
    finalPatientSatisfaction:
      typeof candidate.finalPatientSatisfaction === "number" &&
      Number.isFinite(candidate.finalPatientSatisfaction)
        ? Math.max(
            0,
            Math.min(100, candidate.finalPatientSatisfaction),
          )
        : resolutionReason === null
          ? null
          : patientSatisfaction,
    resolvedAtFacilityTick:
      typeof candidate.resolvedAtFacilityTick === "number" &&
      Number.isSafeInteger(candidate.resolvedAtFacilityTick)
        ? candidate.resolvedAtFacilityTick
        : resolutionReason === null
          ? null
          : facilityTick,
    resolutionReason,
    patientLocation:
      patientMovement?.path[patientMovement.pathIndex] ??
      patientLocation,
    patientMovement,
    terminalFeedback: isRecord(candidate.terminalFeedback)
      ? ({
          ...candidate.terminalFeedback,
          consequence:
            typeof candidate.terminalFeedback.consequence === "string"
              ? candidate.terminalFeedback.consequence
              : isRecord(candidate.terminalFeedback.outcome) &&
                  typeof candidate.terminalFeedback.outcome.narrative ===
                    "string"
                ? candidate.terminalFeedback.outcome.narrative
                : null,
        } as unknown as TerminalFeedback)
      : null,
    assignedRoomInstanceId:
      typeof candidate.assignedRoomInstanceId === "string"
        ? candidate.assignedRoomInstanceId
        : null,
    queuedCareRoomInstanceId:
      typeof candidate.queuedCareRoomInstanceId === "string"
        ? candidate.queuedCareRoomInstanceId
        : null,
    nextIdleActionAtFacilityTick:
      typeof candidate.nextIdleActionAtFacilityTick === "number" &&
      Number.isSafeInteger(candidate.nextIdleActionAtFacilityTick) &&
      candidate.nextIdleActionAtFacilityTick >= facilityTick
        ? candidate.nextIdleActionAtFacilityTick
        : facilityTick +
          context.balanceRelease.environment.idleActionMinimumMinutes,
    answers,
    steps,
    pendingResult,
  };
}

function normalizeFacilityConditionOccurrences(
  value: unknown,
): FacilityConditionOccurrenceState[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const allowedTargetKinds = new Set([
    "litter",
    "water_cooler",
    "build_mode",
    "room",
    "staff_role",
    "employee",
    "emergency_glp1",
    "advertising",
    "goal",
  ]);
  return value
    .flatMap((candidate) => {
      if (
        !isRecord(candidate) ||
        typeof candidate.id !== "string" ||
        typeof candidate.conditionKey !== "string" ||
        !FACILITY_ALERT_CONDITION_KEYS.has(
          candidate.conditionKey as FacilityAlertConditionKey,
        ) ||
        (candidate.kind !== "onset" &&
          candidate.kind !== "reminder") ||
        typeof candidate.occurredAtFacilityTick !== "number" ||
        !Number.isSafeInteger(candidate.occurredAtFacilityTick) ||
        candidate.occurredAtFacilityTick < 0 ||
        typeof candidate.definitionId !== "string" ||
        typeof candidate.message !== "string" ||
        (candidate.priority !== "action_required" &&
          candidate.priority !== "informational")
      ) {
        return [];
      }
      const rawTarget = isRecord(candidate.target)
        ? candidate.target
        : null;
      const target =
        rawTarget &&
        typeof rawTarget.kind === "string" &&
        allowedTargetKinds.has(rawTarget.kind) &&
        typeof rawTarget.id === "string"
          ? {
              kind: rawTarget.kind as FacilityConditionOccurrenceState["target"] extends infer Target
                ? Target extends { kind: infer Kind }
                  ? Kind
                  : never
                : never,
              id: rawTarget.id,
            }
          : null;
      return [
        {
          id: candidate.id,
          conditionKey:
            candidate.conditionKey as FacilityAlertConditionKey,
          kind: candidate.kind,
          occurredAtFacilityTick:
            candidate.occurredAtFacilityTick,
          resolvedAtFacilityTick:
            typeof candidate.resolvedAtFacilityTick === "number" &&
            Number.isSafeInteger(
              candidate.resolvedAtFacilityTick,
            ) &&
            candidate.resolvedAtFacilityTick >=
              candidate.occurredAtFacilityTick
              ? candidate.resolvedAtFacilityTick
              : null,
          definitionId: candidate.definitionId,
          message: candidate.message,
          priority: candidate.priority,
          target,
        } satisfies FacilityConditionOccurrenceState,
      ];
    })
    .slice(-500);
}

function migrateVersionTwo(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  validatePins(parsed, context);
  if (
    typeof parsed.campaignId !== "string" ||
    typeof parsed.campaignSeed !== "string" ||
    (parsed.facilityLevel !== 0 &&
      parsed.facilityLevel !== 1 &&
      parsed.facilityLevel !== 2) ||
    !isRecord(parsed.encounters) ||
    !isRecord(parsed.learningHistories) ||
    !Array.isArray(parsed.employees) ||
    !isRecord(parsed.schedulerPins)
  ) {
    throw new Error("The version 2 saved campaign is incomplete or invalid.");
  }
  if (
    !schedulerPinsMatch(
      parsed.schedulerPins as unknown as GameState["schedulerPins"],
      context.balanceRelease.learning.parameterSetId,
    )
  ) {
    throw new Error("The saved campaign uses incompatible scheduler pins.");
  }

  const campaignId = parsed.campaignId;
  const campaignSeed = parsed.campaignSeed;
  const createdAtRealMs =
    typeof parsed.createdAtRealMs === "number" &&
    Number.isSafeInteger(parsed.createdAtRealMs)
      ? parsed.createdAtRealMs
      : 0;
  const baseline = createInitialGameState(context, {
    campaignId,
    campaignSeed,
    createdAtRealMs,
  });
  const parsedFacilityTick =
    typeof parsed.facilityTick === "number" &&
    Number.isSafeInteger(parsed.facilityTick) &&
    parsed.facilityTick >= 0
      ? parsed.facilityTick
      : 0;
  const parsedCash =
    typeof parsed.cash === "number" && Number.isFinite(parsed.cash)
      ? parsed.cash
      : baseline.cash;
  const parsedCashCents =
    typeof parsed.cashCents === "number" &&
    Number.isSafeInteger(parsed.cashCents)
      ? Math.max(0, parsed.cashCents)
      : Math.max(0, Math.round(parsedCash * 100));
  const postingInterval =
    context.balanceRelease.economy.postingIntervalMinutes;
  const serviceIncomeReceipts = Array.isArray(parsed.serviceIncomeReceipts)
    ? parsed.serviceIncomeReceipts.flatMap((candidate) =>
        isRecord(candidate) &&
        typeof candidate.id === "string" &&
        typeof candidate.transactionKey === "string" &&
        typeof candidate.incomeLineId === "string" &&
        (candidate.routeId === null || typeof candidate.routeId === "string") &&
        (candidate.actorKind === "patient" || candidate.actorKind === "visitor" || candidate.actorKind === "employee" || candidate.actorKind === "founder" || candidate.actorKind === "remote") &&
        typeof candidate.actorId === "string" &&
        typeof candidate.grossAmount === "number" && Number.isFinite(candidate.grossAmount) &&
        typeof candidate.stockCost === "number" && Number.isFinite(candidate.stockCost) &&
        typeof candidate.netCashDelta === "number" && Number.isFinite(candidate.netCashDelta) &&
        typeof candidate.completedAtFacilityTick === "number" && Number.isSafeInteger(candidate.completedAtFacilityTick)
          ? [{ id: candidate.id, transactionKey: candidate.transactionKey, incomeLineId: candidate.incomeLineId, catalogVersion: 1 as const, routeId: candidate.routeId, actorKind: candidate.actorKind as "patient" | "visitor" | "employee" | "founder" | "remote", actorId: candidate.actorId, ...(isRecord(candidate.displayAnchor) && ((candidate.displayAnchor.actorKind === "employee" && typeof candidate.displayAnchor.actorId === "string") || (candidate.displayAnchor.actorKind === "founder" && candidate.displayAnchor.actorId === "founder")) ? { displayAnchor: candidate.displayAnchor as { actorKind: "employee"; actorId: string } | { actorKind: "founder"; actorId: "founder" } } : {}), grossAmount: candidate.grossAmount, stockCost: candidate.stockCost, netCashDelta: candidate.netCashDelta, completedAtFacilityTick: candidate.completedAtFacilityTick }]
          : [],
      )
    : [];
  const serviceOperations = normalizeServiceOperations(parsed.serviceOperations);
  const next: GameState = {
    ...baseline,
    ...(parsed as unknown as GameState),
    schemaVersion: 7 as const,
    randomGeneratorVersion: RANDOMNESS_CONTRACT_VERSION,
    founder: normalizeFounder(parsed.founder, campaignSeed),
    facilityTick: parsedFacilityTick,
    simulationSpeed:
      parsed.simulationSpeed === 2 || parsed.simulationSpeed === 4
        ? parsed.simulationSpeed
        : 1,
    cashCents: parsedCashCents,
    cash: parsedCashCents / 100,
    serviceIncomeReceipts,
    serviceAppointmentsEnabled:
      typeof parsed.serviceAppointmentsEnabled === "boolean"
        ? parsed.serviceAppointmentsEnabled
        : baseline.serviceAppointmentsEnabled,
    nextServiceAppointmentTicks: isRecord(parsed.nextServiceAppointmentTicks)
      ? Object.fromEntries(Object.entries(parsed.nextServiceAppointmentTicks).filter(([, tick]) =>
          typeof tick === "number" && Number.isSafeInteger(tick) && tick > parsedFacilityTick,
        )) as Record<string, number>
      : {},
    lastServiceAppointmentArrivalTick:
      typeof parsed.lastServiceAppointmentArrivalTick === "number" &&
      Number.isSafeInteger(parsed.lastServiceAppointmentArrivalTick) &&
      parsed.lastServiceAppointmentArrivalTick <= parsedFacilityTick
        ? parsed.lastServiceAppointmentArrivalTick
        : null,
    serviceOperationSequence: Math.max(
      serviceOperations.length,
      typeof parsed.serviceOperationSequence === "number" &&
        Number.isSafeInteger(parsed.serviceOperationSequence) &&
        parsed.serviceOperationSequence >= 0
        ? parsed.serviceOperationSequence
        : 0,
    ),
    serviceOperations,
    nextServiceIncomeReceiptSequence: Math.max(
      serviceIncomeReceipts.length,
      typeof parsed.nextServiceIncomeReceiptSequence === "number" && Number.isSafeInteger(parsed.nextServiceIncomeReceiptSequence) && parsed.nextServiceIncomeReceiptSequence >= 0
        ? parsed.nextServiceIncomeReceiptSequence
        : 0,
    ),
    operatingAccrualSixtiethCents:
      typeof parsed.operatingAccrualSixtiethCents === "number" &&
      Number.isSafeInteger(parsed.operatingAccrualSixtiethCents) &&
      parsed.operatingAccrualSixtiethCents >= 0
        ? parsed.operatingAccrualSixtiethCents
        : 0,
    nextFinancialPostingTick:
      typeof parsed.nextFinancialPostingTick === "number" &&
      Number.isSafeInteger(parsed.nextFinancialPostingTick) &&
      parsed.nextFinancialPostingTick > parsedFacilityTick
        ? parsed.nextFinancialPostingTick
        : Math.floor(parsedFacilityTick / postingInterval + 1) *
          postingInterval,
    advertisingLevel:
      typeof parsed.advertisingLevel === "number" &&
      Number.isSafeInteger(parsed.advertisingLevel) &&
      context.balanceRelease.advertising.levels.some(
        (level) => level.level === parsed.advertisingLevel,
      )
        ? parsed.advertisingLevel
        : 0,
    alertHumor: normalizeAlertHumorState(
      parsed.alertHumor,
      parsedFacilityTick,
      campaignSeed,
      parsed,
      context,
    ),
  };
  delete (next as unknown as Record<string, unknown>).satisfaction;
  delete (next as unknown as Record<string, unknown>)
    .dailyConfidenceSatisfactionModifier;
  next.rooms = normalizeRooms(parsed, baseline, context);
  next.doors = normalizeDoors(parsed, next.rooms, context);

  const rawEncounters = parsed.encounters as Record<string, unknown>;
  next.encounters = Object.fromEntries(
    Object.entries(rawEncounters).flatMap(([encounterId, encounter]) => {
      const normalized = isRecord(encounter)
        ? normalizeEncounter(
            encounterId,
            encounter,
            campaignSeed,
            next.facilityTick,
            context,
          )
        : null;
      return normalized ? [[encounterId, normalized]] : [];
    }),
  );

  const rawHistories = parsed.learningHistories as Record<string, unknown>;
  next.learningHistories = {
    ...Object.fromEntries(
      context.clinicalRelease.concepts.map((concept) => [
        concept.id,
        {
          conceptId: concept.id,
          card: createNewFsrsCard(createdAtRealMs),
          reviews: [],
        },
      ]),
    ),
    ...(rawHistories as GameState["learningHistories"]),
  };

  const rawEmployees = parsed.employees as unknown[];
  next.employees = [];
  next.employees = rawEmployees.flatMap((candidate, index) => {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== "string" ||
      typeof candidate.staffRoleDefinitionId !== "string"
    ) {
      return [];
    }
    const role = getStaffRoleDefinition(
      candidate.staffRoleDefinitionId,
      context,
    );
    const home = getEmployeeHomeLocation(
      next,
      candidate.staffRoleDefinitionId,
      context,
    );
    const path = Array.isArray(candidate.path)
      ? candidate.path.filter(isGridPoint).map((point) => ({ ...point }))
      : [];
    const pathIndex =
      path.length > 0 &&
      typeof candidate.pathIndex === "number" &&
      Number.isSafeInteger(candidate.pathIndex)
        ? Math.max(0, Math.min(path.length - 1, candidate.pathIndex))
        : 0;
    const persistedLocation = isGridPoint(candidate.location)
      ? { ...candidate.location }
      : home.location;
    const rawFacilityTask = isRecord(candidate.facilityTask)
      ? candidate.facilityTask
      : null;
    const facilityTask =
      (rawFacilityTask?.kind === "refill_water" ||
        rawFacilityTask?.kind === "collect_litter" ||
        rawFacilityTask?.kind === "clean_room" ||
        rawFacilityTask?.kind === "perform_imaging" ||
        rawFacilityTask?.kind === "perform_service") &&
      typeof rawFacilityTask.startedAtFacilityTick === "number" &&
      Number.isSafeInteger(rawFacilityTask.startedAtFacilityTick) &&
      rawFacilityTask.startedAtFacilityTick >= 0 &&
      typeof rawFacilityTask.workMinutesRemaining === "number" &&
      Number.isSafeInteger(rawFacilityTask.workMinutesRemaining) &&
      rawFacilityTask.workMinutesRemaining > 0
        ? {
            kind: rawFacilityTask.kind as "refill_water" | "collect_litter" | "clean_room" | "perform_imaging" | "perform_service",
            startedAtFacilityTick:
              rawFacilityTask.startedAtFacilityTick,
            workMinutesRemaining:
              rawFacilityTask.workMinutesRemaining,
            ...(typeof rawFacilityTask.targetId === "string" ? { targetId: rawFacilityTask.targetId } : {}),
          }
        : null;
    const employee: EmployeeState = {
      id: candidate.id,
      staffRoleDefinitionId: candidate.staffRoleDefinitionId,
      displayName:
        typeof candidate.displayName === "string"
          ? candidate.displayName
          : `Clinic employee ${index + 1}`,
      appearance:
        isPixelAppearance(candidate.appearance)
          ? normalizePixelAppearance(
              candidate.appearance,
              roleStyleForStaffDefinition(
                candidate.staffRoleDefinitionId,
              ),
            )
          : createPixelAppearance(
              campaignSeed,
              "staff",
              candidate.id,
              roleStyleForStaffDefinition(
                candidate.staffRoleDefinitionId,
              ),
            ),
      hiredAtFacilityTick:
        typeof candidate.hiredAtFacilityTick === "number"
          ? candidate.hiredAtFacilityTick
          : 0,
      salaryPerExpenseInterval:
        typeof candidate.salaryPerExpenseInterval === "number"
          ? candidate.salaryPerExpenseInterval
          : (role?.salaryPerExpenseInterval ?? 0),
      morale:
        typeof candidate.morale === "number"
          ? candidate.morale
          : (role?.baseMorale ?? 50),
      trainingLevel:
        candidate.trainingLevel === 2 ||
        candidate.trainingLevel === 3 ||
        candidate.trainingLevel === 4 ||
        candidate.trainingLevel === 5
          ? candidate.trainingLevel
          : 1,
      homeRoomInstanceId:
        typeof candidate.homeRoomInstanceId === "string"
          ? candidate.homeRoomInstanceId
          : home.homeRoomInstanceId,
      location: path[pathIndex]
        ? { ...path[pathIndex]! }
        : persistedLocation,
      path,
      pathIndex,
      lastMovedAtFacilityTick:
        typeof candidate.lastMovedAtFacilityTick === "number"
          ? candidate.lastMovedAtFacilityTick
          : 0,
      lastPraisedAtFacilityTick:
        typeof candidate.lastPraisedAtFacilityTick === "number" &&
        Number.isSafeInteger(candidate.lastPraisedAtFacilityTick)
          ? candidate.lastPraisedAtFacilityTick
          : null,
      nextIdleActionAtFacilityTick:
        typeof candidate.nextIdleActionAtFacilityTick === "number" &&
        Number.isSafeInteger(candidate.nextIdleActionAtFacilityTick) &&
        candidate.nextIdleActionAtFacilityTick >= next.facilityTick
          ? candidate.nextIdleActionAtFacilityTick
          : next.facilityTick +
            context.balanceRelease.environment.idleActionMinimumMinutes,
      facilityTask,
    };
    return [employee];
  });
  const activeIdentifiedImagingResults = Object.values(next.encounters)
    .flatMap((encounter) => {
      const pending = encounter.pendingResult;
      const resourceActive = Boolean(
        pending &&
          pending.deliveredAtTick === null &&
          (encounter.steps[pending.originatingNodeIndex]?.status ===
            "feedback_pending" ||
            !(pending.timingPhases?.length) ||
            pending.timingPhases.some(
              (phase) =>
                phase.resourceBound && next.facilityTick < phase.endsAtTick,
            )),
      );
      return resourceActive && pending ? [pending] : [];
    })
    .filter(
      (pending): pending is PendingResult =>
        Boolean(
          pending &&
            typeof pending.imagingTechnicianId === "string",
        ),
    );
  const activeImagingByOperationId = new Map(
    activeIdentifiedImagingResults.map((pending) => [
      pending.operationId,
      pending,
    ]),
  );
  for (const employee of next.employees) {
    if (
      employee.facilityTask?.kind === "perform_imaging" &&
      (!employee.facilityTask.targetId ||
        activeImagingByOperationId.get(employee.facilityTask.targetId)
          ?.imagingTechnicianId !== employee.id)
    ) {
      employee.facilityTask = null;
    }
  }
  for (const pending of activeIdentifiedImagingResults) {
    const imagingTechnicianId = pending.imagingTechnicianId;
    if (!imagingTechnicianId) continue;
    const technician = next.employees.find(
      (employee) => employee.id === imagingTechnicianId,
    );
    if (!technician || technician.staffRoleDefinitionId !== "staff.imaging_technician") {
      // Retain the frozen service and its aggregate reservation. Legacy and
      // damaged saves may lack the once-concrete actor, but must not lose the
      // pending result or gain duplicate capacity/rewards.
      pending.imagingTechnicianId = null;
      continue;
    }
    if (!technician.facilityTask) {
      technician.facilityTask = {
        kind: "perform_imaging",
        startedAtFacilityTick: pending.scheduledAtTick,
        workMinutesRemaining: 1,
        targetId: pending.operationId,
      };
    } else if (
      technician.facilityTask.kind !== "perform_imaging" ||
      technician.facilityTask.targetId !== pending.operationId
    ) {
      pending.imagingTechnicianId = null;
    }
  }
  next.emergencyGlp1 = normalizeEmergencyGlp1State(
    parsed.emergencyGlp1,
    next,
    context,
  );
  const rawEnvironment = isRecord(parsed.environment)
    ? parsed.environment
    : {};
  const rawLitter = Array.isArray(rawEnvironment.litterItems)
    ? rawEnvironment.litterItems
    : [];
  const rawAmbientPedestrians = Array.isArray(
    rawEnvironment.ambientPedestrians,
  )
    ? rawEnvironment.ambientPedestrians
    : [];
  const rawFounderActivity = isRecord(
    rawEnvironment.founderActivity,
  )
    ? rawEnvironment.founderActivity
    : null;
  const founderActivityPath =
    rawFounderActivity && Array.isArray(rawFounderActivity.path)
      ? rawFounderActivity.path
          .filter(isGridPoint)
          .map((point) => ({ ...point }))
      : [];
  const founderActivityPathIndex =
    founderActivityPath.length > 0 &&
    typeof rawFounderActivity?.pathIndex === "number" &&
    Number.isSafeInteger(rawFounderActivity.pathIndex)
      ? Math.max(
          0,
          Math.min(
            founderActivityPath.length - 1,
            rawFounderActivity.pathIndex,
          ),
        )
      : 0;
  const persistedFounderLocation = isGridPoint(
    rawEnvironment.founderLocation,
  )
    ? { ...rawEnvironment.founderLocation }
    : { ...baseline.environment.founderLocation };
  const waterCoolerFillPercent =
    typeof rawEnvironment.waterCoolerFillPercent === "number" &&
    Number.isFinite(rawEnvironment.waterCoolerFillPercent)
      ? Math.max(
          0,
          Math.min(100, rawEnvironment.waterCoolerFillPercent),
        )
      : 100;
  const facilityConditionOccurrences =
    normalizeFacilityConditionOccurrences(
      rawEnvironment.facilityConditionOccurrences,
    );
  const activeEmptyWaterOccurrence =
    facilityConditionOccurrences.find(
      (occurrence) =>
        occurrence.conditionKey === "empty_water_cooler" &&
        occurrence.resolvedAtFacilityTick === null,
    );
  const waterCoolerEmptySinceTick =
    waterCoolerFillPercent <= 0
      ? typeof rawEnvironment.waterCoolerEmptySinceTick ===
          "number" &&
        Number.isSafeInteger(
          rawEnvironment.waterCoolerEmptySinceTick,
        ) &&
        rawEnvironment.waterCoolerEmptySinceTick >= 0
        ? rawEnvironment.waterCoolerEmptySinceTick
        : (activeEmptyWaterOccurrence?.occurredAtFacilityTick ??
          null)
      : null;
  const nextWaterCoolerReminderTick =
    waterCoolerEmptySinceTick === null
      ? null
      : typeof rawEnvironment.nextWaterCoolerReminderTick ===
            "number" &&
          Number.isSafeInteger(
            rawEnvironment.nextWaterCoolerReminderTick,
          ) &&
          rawEnvironment.nextWaterCoolerReminderTick >
            next.facilityTick
        ? rawEnvironment.nextWaterCoolerReminderTick
        : waterCoolerEmptySinceTick +
          context.balanceRelease.environment
            .waterCoolerEmptyReminderMinutes;
  const sidewalkY = context.balanceRelease.facility.gridHeight;
  const maximumSidewalkX =
    context.balanceRelease.facility.gridWidth + 1;
  const ambientPedestrians = rawAmbientPedestrians.flatMap(
    (candidate) => {
      if (
        !isRecord(candidate) ||
        typeof candidate.id !== "string" ||
        !isPixelAppearance(candidate.appearance) ||
        !Array.isArray(candidate.path)
      ) {
        return [];
      }
      const path = candidate.path
        .filter(isGridPoint)
        .map((point) => ({ ...point }));
      if (
        path.length < 2 ||
        !(
          (path[0]!.x === -2 &&
            path.at(-1)!.x === maximumSidewalkX) ||
          (path[0]!.x === maximumSidewalkX &&
            path.at(-1)!.x === -2)
        ) ||
        path.some(
          (point) =>
            point.y !== sidewalkY ||
            point.x < -2 ||
            point.x > maximumSidewalkX,
        ) ||
        path.slice(1).some(
          (point, index) =>
            Math.abs(point.x - path[index]!.x) !== 1,
        )
      ) {
        return [];
      }
      const pathIndex =
        typeof candidate.pathIndex === "number" &&
        Number.isSafeInteger(candidate.pathIndex)
          ? Math.max(0, Math.min(path.length - 1, candidate.pathIndex))
          : 0;
      if (pathIndex >= path.length - 1) {
        return [];
      }
      return [
        {
          id: candidate.id,
          appearance: normalizePatientAppearanceForSex(
            candidate.appearance,
            undefined,
            undefined,
            `${next.campaignSeed}:${candidate.id}:legacy-ambient-patient-roster.v1`,
          ),
          path,
          pathIndex,
          lastMovedAtFacilityTick:
            typeof candidate.lastMovedAtFacilityTick === "number" &&
            Number.isSafeInteger(candidate.lastMovedAtFacilityTick) &&
            candidate.lastMovedAtFacilityTick >= 0
              ? Math.min(
                  next.facilityTick,
                  candidate.lastMovedAtFacilityTick,
                )
              : next.facilityTick,
        },
      ];
    },
  ).slice(
    0,
    context.balanceRelease.environment.maximumSidewalkPedestrians,
  );
  const highestAmbientPedestrianSequence = ambientPedestrians.reduce(
    (highest, pedestrian) => {
      const match = /^ambient-pedestrian\.(\d+)$/.exec(pedestrian.id);
      return match
        ? Math.max(highest, Number.parseInt(match[1]!, 10) + 1)
        : highest;
    },
    0,
  );
  const ambientPedestrianSequence =
    typeof rawEnvironment.ambientPedestrianSequence === "number" &&
    Number.isSafeInteger(rawEnvironment.ambientPedestrianSequence) &&
    rawEnvironment.ambientPedestrianSequence >= 0
      ? Math.max(
          rawEnvironment.ambientPedestrianSequence,
          highestAmbientPedestrianSequence,
        )
      : highestAmbientPedestrianSequence;
  const pedestrianInterval = context.balanceRelease.environment;
  const fallbackAmbientPedestrianTick =
    next.facilityTick +
    pedestrianInterval.sidewalkPedestrianMinimumMinutes +
    deterministicInteger(
      next.campaignSeed,
      RANDOM_STREAMS.sidewalkPedestrians,
      `next.${ambientPedestrianSequence}.${next.facilityTick}`,
      pedestrianInterval.sidewalkPedestrianMaximumMinutes -
        pedestrianInterval.sidewalkPedestrianMinimumMinutes +
        1,
    );
  next.environment = {
    founderLocation: founderActivityPath[founderActivityPathIndex]
      ? { ...founderActivityPath[founderActivityPathIndex]! }
      : persistedFounderLocation,
    founderActivity:
      rawFounderActivity &&
      (rawFounderActivity.kind === "walk_to_point" ||
        rawFounderActivity.kind === "collect_litter" ||
        rawFounderActivity.kind === "refill_water" ||
        rawFounderActivity.kind === "praise_employee" ||
        rawFounderActivity.kind === "attend_encounter" ||
        rawFounderActivity.kind === "return_to_front_desk" ||
        rawFounderActivity.kind === "wander_facility" ||
        rawFounderActivity.kind === "sit_in_chair" ||
        rawFounderActivity.kind === "visit_bathroom" ||
        rawFounderActivity.kind === "perform_service") &&
      typeof rawFounderActivity.targetId === "string" &&
      founderActivityPath.length > 0
        ? {
            kind: rawFounderActivity.kind,
            targetId: rawFounderActivity.targetId,
            path: founderActivityPath,
            pathIndex: founderActivityPathIndex,
            lastMovedAtFacilityTick:
              typeof rawFounderActivity.lastMovedAtFacilityTick ===
                "number" &&
              Number.isSafeInteger(
                rawFounderActivity.lastMovedAtFacilityTick,
              )
                ? rawFounderActivity.lastMovedAtFacilityTick
                : next.facilityTick,
            workMinutesRemaining:
              typeof rawFounderActivity.workMinutesRemaining ===
                "number" &&
              Number.isSafeInteger(
                rawFounderActivity.workMinutesRemaining,
              )
                ? rawFounderActivity.workMinutesRemaining
                : context.balanceRelease.environment
                    .founderInteractionMinutes,
          }
        : null,
    ambientPedestrians,
    ambientPedestrianSequence,
    nextAmbientPedestrianTick:
      typeof rawEnvironment.nextAmbientPedestrianTick === "number" &&
      Number.isSafeInteger(rawEnvironment.nextAmbientPedestrianTick) &&
      rawEnvironment.nextAmbientPedestrianTick > next.facilityTick
        ? rawEnvironment.nextAmbientPedestrianTick
        : fallbackAmbientPedestrianTick,
    litterItems: rawLitter.flatMap((candidate) =>
      isRecord(candidate) &&
      typeof candidate.id === "string" &&
      typeof candidate.roomId === "string" &&
      isGridPoint(candidate.location) &&
      typeof candidate.spawnedAtFacilityTick === "number"
        ? [
            {
              id: candidate.id,
              roomId: candidate.roomId,
              location: { ...candidate.location },
              spawnedAtFacilityTick:
                candidate.spawnedAtFacilityTick,
            },
          ]
        : [],
    ),
    litterSequence:
      typeof rawEnvironment.litterSequence === "number" &&
      Number.isSafeInteger(rawEnvironment.litterSequence)
        ? rawEnvironment.litterSequence
        : 0,
    trashTeachingAcknowledgedAtTick:
      typeof rawEnvironment.trashTeachingAcknowledgedAtTick ===
        "number" &&
      Number.isSafeInteger(
        rawEnvironment.trashTeachingAcknowledgedAtTick,
      ) &&
      rawEnvironment.trashTeachingAcknowledgedAtTick >= 0
        ? rawEnvironment.trashTeachingAcknowledgedAtTick
        : rawFounderActivity?.kind === "collect_litter" ||
            next.events.some(
              (event) => event.type === "litter_collected",
            )
          ? next.events
              .find((event) => event.type === "litter_collected")
              ?.facilityTick ?? next.facilityTick
          : null,
    founderLitterCleanups:
      typeof rawEnvironment.founderLitterCleanups === "number" &&
      Number.isSafeInteger(rawEnvironment.founderLitterCleanups) &&
      rawEnvironment.founderLitterCleanups >= 0
        ? rawEnvironment.founderLitterCleanups
        : next.events.some((event) => event.type === "litter_collected")
          ? 1
          : 0,
    lastLitterCleanupAtTick:
      typeof rawEnvironment.lastLitterCleanupAtTick === "number" &&
      Number.isSafeInteger(rawEnvironment.lastLitterCleanupAtTick) &&
      rawEnvironment.lastLitterCleanupAtTick >= 0
        ? rawEnvironment.lastLitterCleanupAtTick
        : [...next.events]
            .reverse()
            .find((event) => event.type === "litter_collected")
            ?.facilityTick ?? null,
    nextLitterSpawnTick:
      typeof rawEnvironment.nextLitterSpawnTick === "number" &&
      Number.isSafeInteger(rawEnvironment.nextLitterSpawnTick) &&
      rawEnvironment.nextLitterSpawnTick > next.facilityTick
        ? rawEnvironment.nextLitterSpawnTick
        : next.facilityTick +
          context.balanceRelease.environment
            .litterSpawnMinimumMinutes,
    glp1AutomationConsultationsCompleted:
      typeof rawEnvironment.glp1AutomationConsultationsCompleted === "number" &&
      Number.isSafeInteger(rawEnvironment.glp1AutomationConsultationsCompleted) &&
      rawEnvironment.glp1AutomationConsultationsCompleted >= 0
        ? rawEnvironment.glp1AutomationConsultationsCompleted
        : 0,
    glp1AutomationSlots: [],
    glp1AutomationNextPayoutTicks: [],
    glp1AutomationNextPayoutTick:
      typeof rawEnvironment.glp1AutomationNextPayoutTick === "number" &&
      Number.isSafeInteger(rawEnvironment.glp1AutomationNextPayoutTick) &&
      rawEnvironment.glp1AutomationNextPayoutTick > next.facilityTick
        ? rawEnvironment.glp1AutomationNextPayoutTick
        : null,
    coffeeMoraleAppliedDayNumber:
      typeof rawEnvironment.coffeeMoraleAppliedDayNumber === "number" &&
      Number.isSafeInteger(rawEnvironment.coffeeMoraleAppliedDayNumber) &&
      rawEnvironment.coffeeMoraleAppliedDayNumber >= 0
        ? rawEnvironment.coffeeMoraleAppliedDayNumber
        : Math.floor(next.facilityTick / ((context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60)) + 1,
    lastEvsRoomCleanupAtTick:
      typeof rawEnvironment.lastEvsRoomCleanupAtTick === "number" &&
      Number.isSafeInteger(rawEnvironment.lastEvsRoomCleanupAtTick) &&
      rawEnvironment.lastEvsRoomCleanupAtTick >= 0
        ? rawEnvironment.lastEvsRoomCleanupAtTick
        : null,
    waterCoolerFillPercent,
    nextWaterCoolerDrainTick:
      typeof rawEnvironment.nextWaterCoolerDrainTick === "number" &&
      Number.isSafeInteger(rawEnvironment.nextWaterCoolerDrainTick) &&
      rawEnvironment.nextWaterCoolerDrainTick > next.facilityTick
        ? rawEnvironment.nextWaterCoolerDrainTick
        : next.facilityTick +
          context.balanceRelease.environment
            .waterCoolerDrainIntervalMinutes,
    waterCoolerEmptySinceTick,
    nextWaterCoolerReminderTick,
    facilityConditionOccurrenceSequence:
      typeof rawEnvironment.facilityConditionOccurrenceSequence ===
        "number" &&
      Number.isSafeInteger(
        rawEnvironment.facilityConditionOccurrenceSequence,
      ) &&
      rawEnvironment.facilityConditionOccurrenceSequence >= 0
        ? Math.max(
            rawEnvironment.facilityConditionOccurrenceSequence,
            facilityConditionOccurrences.length,
          )
        : facilityConditionOccurrences.length,
    facilityConditionOccurrences,
  };
  const operationalGlp1Assignments =
    getOperationalGlp1AutomationAssignments(next, context);
  const rawSlots = Array.isArray(rawEnvironment.glp1AutomationSlots)
    ? rawEnvironment.glp1AutomationSlots.filter(isRecord)
    : [];
  next.environment.glp1AutomationSlots = rawSlots.flatMap((slot) => {
    if (
      typeof slot.suiteRoomInstanceId !== "string" ||
      typeof slot.employeeId !== "string" ||
      typeof slot.nextPayoutTick !== "number" ||
      !Number.isSafeInteger(slot.nextPayoutTick) ||
      slot.nextPayoutTick <= next.facilityTick ||
      !operationalGlp1Assignments.some(
        (assignment) =>
          assignment.suiteRoomInstanceId === slot.suiteRoomInstanceId &&
          assignment.employeeId === slot.employeeId,
      )
    ) {
      return [];
    }
    return [{
      suiteRoomInstanceId: slot.suiteRoomInstanceId,
      employeeId: slot.employeeId,
      nextPayoutTick: slot.nextPayoutTick,
    }];
  });
  const rawPayoutTicks = Array.isArray(rawEnvironment.glp1AutomationNextPayoutTicks)
    ? rawEnvironment.glp1AutomationNextPayoutTicks.filter(
        (tick): tick is number =>
          typeof tick === "number" && Number.isSafeInteger(tick) && tick > 0,
      )
    : [];
  const legacyPayoutTick = next.environment.glp1AutomationNextPayoutTick;
  const normalizedPayoutTicks = rawPayoutTicks.length > 0
    ? rawPayoutTicks
    : legacyPayoutTick === null
      ? []
      : Array.from(
          { length: getOperationalGlp1AutomationCapacity(next, context) },
          () => legacyPayoutTick,
        );
  if (next.environment.glp1AutomationSlots.length === 0) {
    next.environment.glp1AutomationSlots = operationalGlp1Assignments.flatMap(
      (assignment, index) => {
        const nextPayoutTick = normalizedPayoutTicks[index];
        return nextPayoutTick && nextPayoutTick > next.facilityTick
          ? [{ ...assignment, nextPayoutTick }]
          : [];
      },
    );
  }
  next.environment.glp1AutomationNextPayoutTicks = normalizedPayoutTicks
    .filter((tick) => tick > next.facilityTick)
    .sort((left, right) => left - right)
    .slice(0, getOperationalGlp1AutomationCapacity(next, context));
  if (next.environment.glp1AutomationSlots.length > 0) {
    next.environment.glp1AutomationNextPayoutTicks =
      next.environment.glp1AutomationSlots
        .map((slot) => slot.nextPayoutTick)
        .sort((left, right) => left - right);
  }
  next.environment.glp1AutomationNextPayoutTick =
    next.environment.glp1AutomationNextPayoutTicks[0] ?? null;
  if (
    next.openChartEncounterId &&
    next.encounters[next.openChartEncounterId]
  ) {
    next.encounters[next.openChartEncounterId]!.idleWaitingSinceTick = null;
    next.encounters[next.openChartEncounterId]!.lastSatisfactionDecayAtTick =
      next.facilityTick;
    next.encounters[next.openChartEncounterId]!.feedAttentionKind = null;
    next.encounters[
      next.openChartEncounterId
    ]!.feedAttentionStartedAtTick = null;
  }
  return next;
}

function validateVersionThree(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(
    scaleLegacyFacilityTicks(parsed) as Record<string, unknown>,
    context,
  );
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

function validateVersionFour(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(
    scaleLegacyFacilityTicks(parsed) as Record<string, unknown>,
    context,
  );
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

function validateVersionFive(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(parsed, context);
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

function validateVersionSix(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(parsed, context);
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

function validateVersionSeven(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(parsed, context);
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

export function deserializeGameState(
  serialized: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  const parsed: unknown = JSON.parse(serialized);
  if (!isRecord(parsed)) {
    throw new Error("The saved game is invalid.");
  }
  if (parsed.schemaVersion === 1) {
    return migrateVersionOne(parsed, context);
  }
  if (parsed.schemaVersion === 2) {
    return migrateVersionTwo(
      scaleLegacyFacilityTicks(parsed) as Record<string, unknown>,
      context,
    );
  }
  if (parsed.schemaVersion === 3) {
    return validateVersionThree(parsed, context);
  }
  if (parsed.schemaVersion === 4) {
    return validateVersionFour(parsed, context);
  }
  if (parsed.schemaVersion === 5) {
    return validateVersionFive(parsed, context);
  }
  if (parsed.schemaVersion === 6) {
    return validateVersionSix(parsed, context);
  }
  if (parsed.schemaVersion === 7) {
    return validateVersionSeven(parsed, context);
  }
  throw new Error("The saved game uses an unsupported schema version.");
}
