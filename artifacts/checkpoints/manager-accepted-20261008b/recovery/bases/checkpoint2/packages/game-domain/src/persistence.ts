import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { syntheticClinicalCaseSchema } from "@gamify-surgery/clinical-content";
import { normalizeGuidanceTipsState } from "./guidance-tip-persistence";
import {
  EMPLOYEE_DISCUSSION_FIRST_DELAY_MINUTES,
  employeeDiscussionCaseIsRuntimeSafe,
} from "./employee-discussions";
import { alertCadencePolicy } from "./alert-cadence";
import { employeeDepartureRiskCadenceGroup } from "./departure-risk-alerts";
import {
  getServiceIncomeLine,
  DIAGNOSTIC_READING_WORKSTATIONS,
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
  dedupeStaffDisplayNames,
  normalizePixelAppearance,
  normalizePatientAppearanceForSex,
  roleStyleForStaffDefinition,
  selectStaffStillId,
} from "./appearance";
import { founderStillIdForPresetIds } from "./characterStillCatalog";
import {
  RANDOMNESS_CONTRACT_VERSION,
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import { createInitialGameState } from "./reducer";
import {
  migrateApprovedRoomGeometry,
  normalizeApprovedRoomOrientations,
} from "./approved-room-geometry-migration";
import { completePatientDemographics } from "./patientDemographics";
import {
  getOperationalGlp1AutomationCapacity,
  getOperationalGlp1AutomationAssignments,
  getRoomDefinition,
  getStaffRoleDefinition,
  isRoomOperationalForFacilityWork,
} from "./selectors";
import { getEmployeeHomeLocation } from "./staff";
import { reconcileEmployeeRoomSeats } from "./room-capacity";
import { isEmployeeAwayForTraining, normalizeEmployeeTraining, reconcileEmployeeTrainingReservations } from "./employee-training";
import { normalizeServiceOperationTraining } from "./employee-training-effects";
import { normalizeRoomUpgradeRevenueQuote } from "./room-upgrades";
import { normalizeRoomUpgradeExperience, normalizeRoomUpgradeRecoveryQuote } from "./room-upgrade-experience";
import { getUnboundRoomUpgradeSupportMinutes, isRoomUpgradeSupportRemaining, normalizeRoomUpgradeBreakBenefit, normalizeRoomUpgradeSupportWork } from "./room-upgrade-support";
import { normalizeRetiredEncounterSummary } from "./retired-encounters";
import { normalizeRetiredServiceHistory } from "./retired-service-history";
import { normalizeDiagnosticOrderPlan, normalizeDiagnosticPhaseWork, normalizeDiagnosticPhysicalWork } from "./diagnostic-timing";
import { isReadingWorkMinute, readingMinutesEqual } from "./room-upgrade-reading";
import { getDefaultDoorOffset } from "./doors";
import { findDeterministicFacilityPath, getRoomCareStations, getRoomNavigationAnchor } from "./spatial";
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
  EmployeeDiscussionState,
  FacilityAlertConditionKey,
  FacilityConditionOccurrenceState,
  FacilityExperienceConditionKey,
  FounderIdentity,
  GameState,
  FrozenOffsitePatientTravel,
  FrozenPatientTravel,
  PendingResult,
  PatientMovementState,
  PatientAmenityTripState,
  PatientDissatisfactionCause,
  PlacedRoom,
  ReviewRatingIntent,
  RetailActorKind,
  RetailActorLedgerState,
  RetailExternalActorState,
  RetailOperationState,
  RetailOrderState,
  ServiceOperationState,
  TerminalFeedback,
} from "./types";

export function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readDiagnosticTiming(value: unknown, encounterId?: string) {
  if (value === undefined) return undefined;
  const plan = normalizeDiagnosticOrderPlan(value);
  if (!plan || plan.execution !== "supported" || (encounterId !== undefined && plan.encounterId !== encounterId)) {
    throw new Error("The saved diagnostic order plan is invalid.");
  }
  return plan;
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
    // Match fresh-state key order: the campaign repository verifies raw bytes.
    guidanceTips: normalizeGuidanceTipsState(candidate.guidanceTips, facilityTick),
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

function normalizePatientAmenityTrips(
  value: unknown,
  rooms: readonly PlacedRoom[],
  serviceOperations: readonly ServiceOperationState[],
  encounters: unknown,
): PatientAmenityTripState[] {
  if (!Array.isArray(value)) return [];
  const bathroomIds = new Set(rooms.filter((room) => room.roomDefinitionId === "room.bathroom").map((room) => room.id));
  const encounterIds = new Set(isRecord(encounters) ? Object.keys(encounters) : []);
  const visitorIds = new Set(serviceOperations.filter((operation) => operation.actorKind === "visitor").map((operation) => operation.id));
  const actorClaims = new Set<string>();
  const bathroomClaims = new Set<string>();
  return value.flatMap((candidate): PatientAmenityTripState[] => {
    const startedAtFacilityTick = candidate && isRecord(candidate) && typeof candidate.startedAtFacilityTick === "number" ? candidate.startedAtFacilityTick : -1;
    const dwellEndsAtFacilityTick = candidate && isRecord(candidate) && (candidate.dwellEndsAtFacilityTick === null || typeof candidate.dwellEndsAtFacilityTick === "number") ? candidate.dwellEndsAtFacilityTick : undefined;
    const pathIndex = candidate && isRecord(candidate) && typeof candidate.pathIndex === "number" ? candidate.pathIndex : -1;
    const lastMovedAtFacilityTick = candidate && isRecord(candidate) && typeof candidate.lastMovedAtFacilityTick === "number" ? candidate.lastMovedAtFacilityTick : -1;
    if (!isRecord(candidate) || candidate.version !== "patient-amenity-trip.v1" ||
      typeof candidate.id !== "string" ||
      (candidate.actorKind !== "encounter" && candidate.actorKind !== "service_visitor") ||
      typeof candidate.actorId !== "string" || candidate.amenityKind !== "bathroom" ||
      typeof candidate.bathroomRoomInstanceId !== "string" ||
      (!bathroomIds.has(candidate.bathroomRoomInstanceId) && candidate.status !== "returning") ||
      (candidate.status !== "walking_to_amenity" && candidate.status !== "using_amenity" && candidate.status !== "returning") ||
      !Number.isSafeInteger(startedAtFacilityTick) || startedAtFacilityTick < 0 ||
      !(dwellEndsAtFacilityTick === null || (typeof dwellEndsAtFacilityTick === "number" && Number.isSafeInteger(dwellEndsAtFacilityTick) && dwellEndsAtFacilityTick >= 0)) ||
      typeof candidate.returnRequested !== "boolean" || !isGridPoint(candidate.returnTarget) ||
      !Array.isArray(candidate.path) || candidate.path.length === 0 || !candidate.path.every(isGridPoint) ||
      !Number.isSafeInteger(pathIndex) || pathIndex < 0 ||
      !Number.isSafeInteger(lastMovedAtFacilityTick) || lastMovedAtFacilityTick < 0 ||
      (candidate.status === "using_amenity" && dwellEndsAtFacilityTick === null)) return [];
    const actorExists = candidate.actorKind === "encounter" ? encounterIds.has(candidate.actorId) : visitorIds.has(candidate.actorId);
    const actorClaim = `${candidate.actorKind}:${candidate.actorId}`;
    if (!actorExists || actorClaims.has(actorClaim) || bathroomClaims.has(candidate.bathroomRoomInstanceId)) return [];
    actorClaims.add(actorClaim);
    bathroomClaims.add(candidate.bathroomRoomInstanceId);
    const path = candidate.path.map((point) => ({ x: point.x, y: point.y }));
    return [{
      version: "patient-amenity-trip.v1",
      id: candidate.id,
      actorKind: candidate.actorKind,
      actorId: candidate.actorId,
      amenityKind: "bathroom",
      bathroomRoomInstanceId: candidate.bathroomRoomInstanceId,
      status: candidate.status,
      startedAtFacilityTick,
      dwellEndsAtFacilityTick,
      returnRequested: candidate.returnRequested,
      returnTarget: { x: candidate.returnTarget.x, y: candidate.returnTarget.y },
      path,
      pathIndex: Math.min(pathIndex, Math.max(0, path.length - 1)),
      lastMovedAtFacilityTick,
      ...(candidate.purpose === "departure" && typeof candidate.linkedServiceOperationId === "string"
        ? { purpose: "departure" as const, linkedServiceOperationId: candidate.linkedServiceOperationId }
        : {}),
    }];
  });
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
  "arriving",
  "waiting_for_resources",
  "walking_to_service",
  "in_service",
  "walking_between_phases",
  "waiting_for_next_phase",
  "discharging",
  "leaving",
  "completed",
  "cancelled",
]);

function normalizeServiceOperations(
  candidate: unknown,
): ServiceOperationState[] {
  if (!Array.isArray(candidate)) return [];
  const activePeriopBeds = new Set<string>();
  return candidate.flatMap((raw) => {
    if (isRecord(raw) && raw.roomUpgradeRevenue !== undefined) normalizeRoomUpgradeRevenueQuote(raw.roomUpgradeRevenue, raw.quoteFee);
    if (isRecord(raw) && raw.roomUpgradeRecovery !== undefined) normalizeRoomUpgradeRecoveryQuote(raw.roomUpgradeRecovery);
    const diagnosticPhaseWork = isRecord(raw) && raw.diagnosticPhaseWork !== undefined
      ? normalizeDiagnosticPhaseWork(raw.diagnosticPhaseWork)
      : undefined;
    const diagnosticPhysicalWork = isRecord(raw) && raw.diagnosticPhysicalWork !== undefined ? normalizeDiagnosticPhysicalWork(raw.diagnosticPhysicalWork) : undefined;
    const markedDiagnostic = Boolean(diagnosticPhaseWork || diagnosticPhysicalWork);
    const markedReading = Boolean(diagnosticPhaseWork?.readingUpgradeWork);
    if (isRecord(raw) && raw.diagnosticPhysicalWork !== undefined && (!diagnosticPhysicalWork || diagnosticPhaseWork || raw.actorKind !== "encounter" ||
      raw.actorId !== diagnosticPhysicalWork.encounterId || diagnosticPhysicalWork.billing === "none" && raw.quoteFee !== 0)) {
      throw new Error("The saved diagnostic physical work marker is invalid.");
    }
    if (isRecord(raw) && raw.diagnosticPhaseWork !== undefined && (!diagnosticPhaseWork ||
      raw.actorKind !== "remote" || raw.actorId !== diagnosticPhaseWork.encounterId || raw.quoteFee !== 0 ||
      raw.incomeLineId !== (diagnosticPhaseWork.kind === "interpretation" ? "income.image_read" : "income.laboratory_processing"))) {
      throw new Error("The saved nonbillable diagnostic work marker is invalid.");
    }
    if (
      !isRecord(raw) ||
      typeof raw.id !== "string" ||
      typeof raw.incomeLineId !== "string" ||
      !(diagnosticPhysicalWork ? getServiceIncomeLine(raw.incomeLineId) && getServiceIncomeLine(raw.incomeLineId)?.kind !== "retail" : getServiceIncomeLine(raw.incomeLineId)?.operation) ||
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
    ) {
      if (markedDiagnostic) throw new Error("The saved diagnostic service operation is invalid.");
      return [];
    }
    const line = getServiceIncomeLine(raw.incomeLineId)!;
    if (markedDiagnostic && (
      raw.catalogVersion !== 1 ||
      !raw.reservedRoomInstanceIds.every((id) => typeof id === "string") || !raw.reservedEmployeeIds.every((id) => typeof id === "string") || !raw.path.every(isGridPoint) ||
      raw.createdAtFacilityTick < 0 || raw.waitDeadlineFacilityTick < 0 || raw.lastMovedAtFacilityTick < 0 || raw.pathIndex < 0 ||
      (raw.status === "completed" && diagnosticPhaseWork && diagnosticPhaseWork.remainingMinutes !== 0) ||
      [raw.startedAtFacilityTick, raw.completedAtFacilityTick, raw.phaseStartedAtFacilityTick, raw.phaseEndsAtFacilityTick].some((tick) =>
        tick !== null && (markedReading ? !isReadingWorkMinute(tick) : typeof tick !== "number" || !Number.isSafeInteger(tick) || tick < 0)) ||
      raw.cancelledAtFacilityTick !== null && (typeof raw.cancelledAtFacilityTick !== "number" || !Number.isSafeInteger(raw.cancelledAtFacilityTick) || raw.cancelledAtFacilityTick < 0))) {
      throw new Error("The saved diagnostic service operation is invalid.");
    }
    const path = raw.path.filter(isGridPoint).map((point) => ({ ...point }));
    const providerReservation = isRecord(raw.providerReservation) && raw.providerReservation.kind === "founder"
      ? { kind: "founder" as const }
      : isRecord(raw.providerReservation) && raw.providerReservation.kind === "employee" && typeof raw.providerReservation.employeeId === "string"
        ? { kind: "employee" as const, employeeId: raw.providerReservation.employeeId }
        : null;
    const completedCareProvenance =
      isRecord(raw.completedCareProvenance) &&
      raw.completedCareProvenance.version === "completed-care-provenance.v1" &&
      typeof raw.completedCareProvenance.roomInstanceId === "string" &&
      (raw.completedCareProvenance.provider === null ||
        (isRecord(raw.completedCareProvenance.provider) &&
          (raw.completedCareProvenance.provider.kind === "founder" ||
            (raw.completedCareProvenance.provider.kind === "employee" &&
              typeof raw.completedCareProvenance.provider.employeeId === "string"))))
        ? {
            version: "completed-care-provenance.v1" as const,
            roomInstanceId: raw.completedCareProvenance.roomInstanceId,
            provider: raw.completedCareProvenance.provider === null
              ? null
              : raw.completedCareProvenance.provider.kind === "founder"
                ? { kind: "founder" as const }
                : {
                    kind: "employee" as const,
                    employeeId: raw.completedCareProvenance.provider.employeeId as string,
                  },
          }
        : undefined;
    const nullableTick = (value: unknown) =>
      typeof value === "number" && Number.isSafeInteger(value) ? value : null;
    const nullableWorkTick = (value: unknown) => markedReading && isReadingWorkMinute(value) ? value : nullableTick(value);
    const testChoiceOrder =
      isRecord(raw.testChoiceOrder) &&
      raw.testChoiceOrder.version === "test-choice-order.v1" &&
      (raw.testChoiceOrder.purpose === "terminal" || raw.testChoiceOrder.purpose === "continuation" || raw.testChoiceOrder.purpose === "staged_result_component" || raw.testChoiceOrder.purpose === "result_gate") &&
      typeof raw.testChoiceOrder.caseId === "string" &&
      typeof raw.testChoiceOrder.nodeId === "string" &&
      typeof raw.testChoiceOrder.questionVariantId === "string" &&
      typeof raw.testChoiceOrder.choiceId === "string" &&
      typeof raw.testChoiceOrder.choiceLabel === "string" &&
      typeof raw.testChoiceOrder.serviceId === "string" &&
      typeof raw.testChoiceOrder.routeId === "string" &&
      typeof raw.testChoiceOrder.routeDisplayName === "string" &&
      (raw.testChoiceOrder.externalRemainder === null || typeof raw.testChoiceOrder.externalRemainder === "string")
        ? {
            version: "test-choice-order.v1" as const,
            purpose: raw.testChoiceOrder.purpose as "terminal" | "continuation" | "staged_result_component" | "result_gate",
            caseId: raw.testChoiceOrder.caseId,
            nodeId: raw.testChoiceOrder.nodeId,
            questionVariantId: raw.testChoiceOrder.questionVariantId,
            choiceId: raw.testChoiceOrder.choiceId,
            choiceLabel: raw.testChoiceOrder.choiceLabel,
            serviceId: raw.testChoiceOrder.serviceId,
            routeId: raw.testChoiceOrder.routeId,
            routeDisplayName: raw.testChoiceOrder.routeDisplayName,
            externalRemainder: raw.testChoiceOrder.externalRemainder,
            ...(typeof raw.testChoiceOrder.componentId === "string" ? { componentId: raw.testChoiceOrder.componentId } : {}),
          }
        : undefined;
    const rawFrozenPhases = Array.isArray(raw.frozenOperationPhases) ? raw.frozenOperationPhases : [];
    const frozenOperationPhases = rawFrozenPhases.filter(isRecord).flatMap((phase) =>
      typeof phase.id === "string" &&
      (phase.roomDefinitionId === null || typeof phase.roomDefinitionId === "string") &&
      typeof phase.durationMinutes === "number" && (markedReading ? isReadingWorkMinute(phase.durationMinutes) : Number.isSafeInteger(phase.durationMinutes)) && phase.durationMinutes > 0 &&
      Array.isArray(phase.staffRoleDefinitionIds) && phase.staffRoleDefinitionIds.every((id) => typeof id === "string") &&
      (phase.providerRoleDefinitionIds === undefined || (Array.isArray(phase.providerRoleDefinitionIds) && phase.providerRoleDefinitionIds.every((id) => typeof id === "string"))) &&
      (phase.founderEligible === undefined || phase.founderEligible === true)
      && (phase.roomStationId === undefined || phase.roomStationId === "periop_preparation" || phase.roomStationId === "periop_recovery")
        ? [{
            id: phase.id,
            roomDefinitionId: phase.roomDefinitionId as string | null,
            durationMinutes: phase.durationMinutes,
            staffRoleDefinitionIds: phase.staffRoleDefinitionIds as string[],
            ...(Array.isArray(phase.providerRoleDefinitionIds) ? { providerRoleDefinitionIds: phase.providerRoleDefinitionIds as string[] } : {}),
            ...(phase.founderEligible === true ? { founderEligible: true as const } : {}),
            ...(phase.roomStationId === "periop_preparation" || phase.roomStationId === "periop_recovery"
              ? { roomStationId: phase.roomStationId as "periop_preparation" | "periop_recovery" }
              : {}),
          }]
        : [],
    );
    const phaseCount = rawFrozenPhases.length > 0
      ? frozenOperationPhases.length === rawFrozenPhases.length
        ? frozenOperationPhases.length
        : -1
      : line.operation?.phases.length ?? 0;
    if (diagnosticPhaseWork && (frozenOperationPhases.length !== 1 || rawFrozenPhases.length !== 1 ||
      frozenOperationPhases[0]!.durationMinutes !== diagnosticPhaseWork.durationMinutes ||
      frozenOperationPhases[0]!.roomDefinitionId !== (diagnosticPhaseWork.kind === "interpretation" ? "room.reading" : "room.laboratory") ||
      frozenOperationPhases[0]!.staffRoleDefinitionIds.length !== 1 ||
      frozenOperationPhases[0]!.staffRoleDefinitionIds[0] !== (diagnosticPhaseWork.kind === "interpretation" ? "staff.radiologist" : "staff.laboratory_technician") ||
      (frozenOperationPhases[0]!.providerRoleDefinitionIds?.length ?? 0) > 0 || frozenOperationPhases[0]!.founderEligible ||
      frozenOperationPhases[0]!.roomStationId !== undefined)) {
      throw new Error("The saved diagnostic work phase is invalid.");
    }
    if (markedReading) {
      const work = diagnosticPhaseWork!, reading = work.readingUpgradeWork!;
      const started = raw.phaseStartedAtFacilityTick as number | null, ends = raw.phaseEndsAtFacilityTick as number | null;
      if (!["waiting_for_resources", "walking_to_service", "in_service", "completed", "cancelled"].includes(raw.status) ||
        raw.providerReservation !== null || raw.location !== null || raw.path.length !== 0 || raw.phaseIndex !== (raw.status === "completed" ? 1 : 0) ||
        frozenOperationPhases[0]!.id !== work.phaseId ||
        raw.createdAtFacilityTick < reading.acceptedAtTick ||
        (raw.status === "in_service" ? reading.durationMinutes === null || started === null || ends === null || !work.resource ||
          started < reading.readyAtTick! || !readingMinutesEqual(ends - started, work.remainingMinutes, ends)
          : raw.status === "completed" ? reading.durationMinutes === null || started === null || ends === null || raw.completedAtFacilityTick !== ends ||
            started < reading.readyAtTick! || ends < started || ends - started > work.durationMinutes + 1e-9
            : started !== null || ends !== null) ||
        (raw.startedAtFacilityTick !== null && (reading.durationMinutes === null || (raw.startedAtFacilityTick as number) < reading.readyAtTick!)) ||
        (raw.status === "in_service" || raw.status === "walking_to_service") && (!work.resource ||
          raw.reservedRoomInstanceIds.length !== 1 || raw.reservedRoomInstanceIds[0] !== work.resource.roomInstanceId ||
          raw.reservedEmployeeIds.length !== 1 || raw.reservedEmployeeIds[0] !== work.resource.employeeIds[0]) ||
        !["in_service", "walking_to_service"].includes(raw.status) && (raw.reservedRoomInstanceIds.length !== 0 || raw.reservedEmployeeIds.length !== 0)) {
        throw new Error("The saved Reading work segment is invalid.");
      }
    }
    if (diagnosticPhysicalWork && (rawFrozenPhases.length !== frozenOperationPhases.length || frozenOperationPhases.length !== diagnosticPhysicalWork.phaseBindings.length ||
      raw.phaseFlowVersion !== 1 ||
      frozenOperationPhases.some((phase, index) => phase.id !== diagnosticPhysicalWork.phaseBindings[index]!.operationPhaseId ||
        phase.roomDefinitionId === null || diagnosticPhysicalWork.phaseBindings[index]!.resource !== null && diagnosticPhysicalWork.phaseBindings[index]!.resource!.roomDefinitionId !== phase.roomDefinitionId) ||
      diagnosticPhysicalWork.remainingPhaseMinutes !== null && diagnosticPhysicalWork.remainingPhaseMinutes > (frozenOperationPhases[raw.phaseIndex]?.durationMinutes ?? 0))) {
      throw new Error("The saved diagnostic physical phase is invalid.");
    }
    const diagnosticPhaseIndex = raw.phaseIndex;
    if (diagnosticPhysicalWork && (diagnosticPhysicalWork.phaseWitnesses.some((witness, index) =>
      index < diagnosticPhaseIndex && witness.completedAtFacilityTick === null || index > diagnosticPhaseIndex && witness.startedAtFacilityTick !== null ||
      index === diagnosticPhaseIndex && witness.completedAtFacilityTick !== null && raw.status !== "waiting_for_next_phase" && raw.status !== "discharging" && raw.status !== "completed" && raw.status !== "cancelled") ||
      raw.status === "in_service" && diagnosticPhysicalWork.phaseWitnesses[raw.phaseIndex]?.startedAtFacilityTick === null ||
      raw.status === "waiting_for_next_phase" && diagnosticPhysicalWork.phaseWitnesses[raw.phaseIndex]?.completedAtFacilityTick === null)) {
      throw new Error("The saved diagnostic physical phase witness is invalid.");
    }
    const trainingTiming = normalizeServiceOperationTraining(raw.trainingTiming, frozenOperationPhases);
    const roomUpgradeRevenue = normalizeRoomUpgradeRevenueQuote(raw.roomUpgradeRevenue, raw.quoteFee,
      frozenOperationPhases.map((phase) => phase.roomDefinitionId));
    const roomUpgradeRecovery = normalizeRoomUpgradeRecoveryQuote(raw.roomUpgradeRecovery, frozenOperationPhases);
    if (roomUpgradeRecovery) {
      const recoveryIndex = frozenOperationPhases.findIndex((phase) => phase.id === roomUpgradeRecovery.phaseId);
      if (diagnosticPhaseWork || raw.actorKind !== "encounter" ||
        roomUpgradeRecovery.boundRoom !== null && raw.phaseIndex < recoveryIndex ||
        roomUpgradeRecovery.boundRoom === null && (raw.phaseIndex > recoveryIndex || raw.phaseIndex === recoveryIndex && raw.phaseStartedAtFacilityTick !== null)) {
        throw new Error("The saved recovery quote does not match actual Recovery work.");
      }
    }
    if (roomUpgradeRevenue && (diagnosticPhaseWork || diagnosticPhysicalWork?.billing === "none")) {
      throw new Error("Nonbillable diagnostic work must not carry an upgraded payment.");
    }
    if (trainingTiming && (diagnosticPhaseWork || diagnosticPhysicalWork)) throw new Error("Diagnostic work must use its accepted effective timing.");
    const phaseFlowVersion = raw.phaseFlowVersion === 1 &&
      (diagnosticPhysicalWork || frozenOperationPhases[0]?.roomStationId === "periop_preparation" &&
      (frozenOperationPhases[0]?.durationMinutes === 30 || trainingTiming?.phases[0]?.baselineMinutes === 30) &&
      frozenOperationPhases.some((phase) => phase.roomStationId === "periop_recovery"))
        ? 1 as const
        : undefined;
    const periopBedFlowVersion = raw.periopBedFlowVersion === 1 &&
      phaseFlowVersion === 1 &&
      frozenOperationPhases.some((phase) =>
        phase.roomStationId === "periop_recovery" && phase.durationMinutes === 60,
      )
        ? 1 as const
        : undefined;
    const validPeriopBedIds = new Set(["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"]);
    const periopBedReservation = isRecord(raw.periopBedReservation) &&
      raw.periopBedReservation.version === "periop-bed-reservation.v1" &&
      typeof raw.periopBedReservation.roomInstanceId === "string" &&
      typeof raw.periopBedReservation.bedId === "string" &&
      validPeriopBedIds.has(raw.periopBedReservation.bedId) &&
      isGridPoint(raw.periopBedReservation.endpoint)
        ? {
            version: "periop-bed-reservation.v1" as const,
            roomInstanceId: raw.periopBedReservation.roomInstanceId,
            bedId: raw.periopBedReservation.bedId,
            endpoint: { ...raw.periopBedReservation.endpoint },
          }
        : undefined;
    const bedKey = periopBedReservation
      ? `${periopBedReservation.roomInstanceId}:${periopBedReservation.bedId}`
      : null;
    const terminalStatus = raw.status === "completed" || raw.status === "cancelled";
    const rawDepartureItinerary = isRecord(raw.departureItinerary) && raw.departureItinerary.version === "service-departure-itinerary.v1"
      ? raw.departureItinerary
      : null;
    const validRawDepartureItinerary = Boolean(rawDepartureItinerary &&
      ["pending", "bathroom", "retail", "completed", "skipped"].includes(String(rawDepartureItinerary.status)) &&
      (rawDepartureItinerary.choiceKind === null || rawDepartureItinerary.choiceKind === "bathroom" || rawDepartureItinerary.choiceKind === "retail" || rawDepartureItinerary.choiceKind === "none") &&
      (rawDepartureItinerary.selectedAtFacilityTick === null || (typeof rawDepartureItinerary.selectedAtFacilityTick === "number" && Number.isSafeInteger(rawDepartureItinerary.selectedAtFacilityTick))) &&
      (rawDepartureItinerary.completedAtFacilityTick === null || (typeof rawDepartureItinerary.completedAtFacilityTick === "number" && Number.isSafeInteger(rawDepartureItinerary.completedAtFacilityTick))) &&
      (rawDepartureItinerary.linkedTripId === null || typeof rawDepartureItinerary.linkedTripId === "string") &&
      (rawDepartureItinerary.retailIncomeLineId === null || typeof rawDepartureItinerary.retailIncomeLineId === "string"));
    if (
      phaseCount < 0 ||
      (raw.phaseFlowVersion === 1 && phaseFlowVersion !== 1) ||
      (raw.periopBedFlowVersion === 1 && periopBedFlowVersion !== 1) ||
      (raw.periopBedReservation !== undefined && (!periopBedFlowVersion || !periopBedReservation)) ||
      (raw.status === "discharging" && (!periopBedFlowVersion || (!periopBedReservation && !rawDepartureItinerary))) ||
      (!terminalStatus && bedKey !== null && activePeriopBeds.has(bedKey)) ||
      (raw.status === "waiting_for_next_phase" && phaseFlowVersion !== 1) ||
      raw.phaseIndex > phaseCount ||
      (raw.phaseIndex === phaseCount && raw.status !== "discharging" && raw.status !== "leaving" && raw.status !== "completed" && raw.status !== "cancelled")
    ) {
      if (markedDiagnostic) throw new Error("The saved diagnostic service operation phase is invalid.");
      return [];
    }
    if (!terminalStatus && bedKey !== null) activePeriopBeds.add(bedKey);
    const visitorTravel = isRecord(raw.visitorTravel) &&
      raw.visitorTravel.version === "service-visitor-travel.v1" &&
      isGridPoint(raw.visitorTravel.offscreenEndpoint) &&
      (raw.visitorTravel.arrivedAtFacilityTick === null ||
        (typeof raw.visitorTravel.arrivedAtFacilityTick === "number" && Number.isSafeInteger(raw.visitorTravel.arrivedAtFacilityTick)))
      ? {
          version: "service-visitor-travel.v1" as const,
          offscreenEndpoint: { ...raw.visitorTravel.offscreenEndpoint },
          arrivedAtFacilityTick: raw.visitorTravel.arrivedAtFacilityTick as number | null,
        }
      : undefined;
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
      startedAtFacilityTick: nullableWorkTick(raw.startedAtFacilityTick),
      completedAtFacilityTick: nullableWorkTick(raw.completedAtFacilityTick),
      cancelledAtFacilityTick: nullableTick(raw.cancelledAtFacilityTick),
      quoteFee: raw.quoteFee,
      ...(roomUpgradeRevenue ? { roomUpgradeRevenue } : {}),
      ...(roomUpgradeRecovery ? { roomUpgradeRecovery } : {}),
      phaseIndex: raw.phaseIndex,
      phaseStartedAtFacilityTick: nullableWorkTick(raw.phaseStartedAtFacilityTick),
      phaseEndsAtFacilityTick: nullableWorkTick(raw.phaseEndsAtFacilityTick),
      reservedRoomInstanceIds: raw.reservedRoomInstanceIds.filter((id): id is string => typeof id === "string"),
      reservedEmployeeIds: raw.reservedEmployeeIds.filter((id): id is string => typeof id === "string"),
      providerReservation,
      location: isGridPoint(raw.location) ? { ...raw.location } : null,
      path,
      pathIndex: path.length > 0 ? Math.max(0, Math.min(path.length - 1, raw.pathIndex)) : 0,
      lastMovedAtFacilityTick: raw.lastMovedAtFacilityTick,
      cancellationReason: typeof raw.cancellationReason === "string" ? raw.cancellationReason : null,
      resourceWaitReason: typeof raw.resourceWaitReason === "string" ? raw.resourceWaitReason : null,
      ...(visitorTravel ? { visitorTravel } : {}),
      resourceQueueVersion: raw.resourceQueueVersion === 1 ? 1 : undefined,
      phaseFlowVersion,
      ...(trainingTiming ? { trainingTiming } : {}),
      periopBedFlowVersion,
      ...(isRecord(raw.saleTransfer) &&
        raw.saleTransfer.version === "room-sale-transfer.v1" &&
        typeof raw.saleTransfer.interruptedAtFacilityTick === "number" &&
        Number.isSafeInteger(raw.saleTransfer.interruptedAtFacilityTick) &&
        typeof raw.saleTransfer.remainingPhaseMinutes === "number" &&
        Number.isSafeInteger(raw.saleTransfer.remainingPhaseMinutes) &&
        raw.saleTransfer.remainingPhaseMinutes > 0
        ? { saleTransfer: {
            version: "room-sale-transfer.v1" as const,
            interruptedAtFacilityTick: raw.saleTransfer.interruptedAtFacilityTick,
            remainingPhaseMinutes: raw.saleTransfer.remainingPhaseMinutes,
          } }
        : {}),
      ...(periopBedReservation ? { periopBedReservation } : {}),
      ...(periopBedFlowVersion ? {
        nextPhaseReadyAtFacilityTick:
          typeof raw.nextPhaseReadyAtFacilityTick === "number" && Number.isSafeInteger(raw.nextPhaseReadyAtFacilityTick)
            ? raw.nextPhaseReadyAtFacilityTick
            : null,
        transitionHeldRoomInstanceIds: Array.isArray(raw.transitionHeldRoomInstanceIds)
          ? raw.transitionHeldRoomInstanceIds.filter((id): id is string => typeof id === "string")
          : [],
        ...(rawDepartureItinerary
          ? { departureItinerary: {
              version: "service-departure-itinerary.v1" as const,
              status: validRawDepartureItinerary ? rawDepartureItinerary.status as NonNullable<ServiceOperationState["departureItinerary"]>["status"] : "skipped",
              choiceKind: validRawDepartureItinerary ? rawDepartureItinerary.choiceKind as NonNullable<ServiceOperationState["departureItinerary"]>["choiceKind"] : "none",
              selectedAtFacilityTick: validRawDepartureItinerary ? nullableTick(rawDepartureItinerary.selectedAtFacilityTick) : null,
              completedAtFacilityTick: validRawDepartureItinerary ? nullableTick(rawDepartureItinerary.completedAtFacilityTick) : 0,
              linkedTripId: validRawDepartureItinerary && typeof rawDepartureItinerary.linkedTripId === "string" ? rawDepartureItinerary.linkedTripId : null,
              retailIncomeLineId: validRawDepartureItinerary && typeof rawDepartureItinerary.retailIncomeLineId === "string" ? rawDepartureItinerary.retailIncomeLineId : null,
            } }
          : {}),
      } : {}),
      ...(rawFrozenPhases.length > 0 && frozenOperationPhases.length === rawFrozenPhases.length ? { frozenOperationPhases } : {}),
      testChoiceOrder,
      ...(diagnosticPhaseWork ? { diagnosticPhaseWork } : {}),
      ...(diagnosticPhysicalWork ? { diagnosticPhysicalWork } : {}),
      ...(completedCareProvenance ? { completedCareProvenance } : {}),
    } satisfies ServiceOperationState];
  });
}

const RETAIL_ACTOR_KINDS = new Set<RetailActorKind>(["employee", "founder", "encounter", "service_visitor", "retail_visitor", "companion"]);
const RETAIL_OPERATION_STATUSES = new Set<RetailOperationState["status"]>(["walking_to_outlet", "queued", "purchasing", "returning", "leaving", "completed", "abandoned", "cancelled"]);

function normalizeRetailOperations(candidate: unknown): RetailOperationState[] {
  if (!Array.isArray(candidate)) return [];
  return candidate.flatMap((raw) => {
    if (isRecord(raw) && raw.roomUpgradeRevenue !== undefined) normalizeRoomUpgradeRevenueQuote(raw.roomUpgradeRevenue, raw.quoteGross);
    if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.incomeLineId !== "string" || !getServiceIncomeLine(raw.incomeLineId)?.retail ||
      typeof raw.actorKind !== "string" || !RETAIL_ACTOR_KINDS.has(raw.actorKind as RetailActorKind) || typeof raw.actorId !== "string" ||
      typeof raw.displayName !== "string" || !isPixelAppearance(raw.appearance) || typeof raw.status !== "string" || !RETAIL_OPERATION_STATUSES.has(raw.status as RetailOperationState["status"]) ||
      typeof raw.createdAtFacilityTick !== "number" || !Number.isSafeInteger(raw.createdAtFacilityTick) || typeof raw.waitDeadlineFacilityTick !== "number" || !Number.isSafeInteger(raw.waitDeadlineFacilityTick) ||
      typeof raw.quoteGross !== "number" || !Number.isFinite(raw.quoteGross) || raw.quoteGross < 0 || typeof raw.quoteStockCost !== "number" || !Number.isFinite(raw.quoteStockCost) || raw.quoteStockCost < 0 ||
      typeof raw.outletRoomInstanceId !== "string" || (raw.outletDurationMinutes !== 1 && raw.outletDurationMinutes !== 2) || !isGridPoint(raw.location) || !Array.isArray(raw.path) ||
      typeof raw.pathIndex !== "number" || !Number.isSafeInteger(raw.pathIndex) || typeof raw.lastMovedAtFacilityTick !== "number" || !Number.isSafeInteger(raw.lastMovedAtFacilityTick)) return [];
    const path = raw.path.filter(isGridPoint).map((point) => ({ ...point }));
    const roomUpgradeRevenue = normalizeRoomUpgradeRevenueQuote(raw.roomUpgradeRevenue, raw.quoteGross,
      getServiceIncomeLine(raw.incomeLineId)!.retail!.outlets.map((outlet) => outlet.roomDefinitionId));
    if (roomUpgradeRevenue && roomUpgradeRevenue.boundRoom?.roomInstanceId !== raw.outletRoomInstanceId) {
      throw new Error("The saved upgraded sale does not match its outlet.");
    }
    const tick = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) ? value : null;
    return [{ id: raw.id, incomeLineId: raw.incomeLineId, catalogVersion: 1 as const, actorKind: raw.actorKind as RetailActorKind, actorId: raw.actorId, displayName: raw.displayName, appearance: raw.appearance,
      linkedServiceOperationId: typeof raw.linkedServiceOperationId === "string" ? raw.linkedServiceOperationId : null, authorizedOrderId: typeof raw.authorizedOrderId === "string" ? raw.authorizedOrderId : null,
      status: raw.status as RetailOperationState["status"], createdAtFacilityTick: raw.createdAtFacilityTick, waitDeadlineFacilityTick: raw.waitDeadlineFacilityTick,
      startedAtFacilityTick: tick(raw.startedAtFacilityTick), completedAtFacilityTick: tick(raw.completedAtFacilityTick), quoteGross: raw.quoteGross, quoteStockCost: raw.quoteStockCost,
      ...(roomUpgradeRevenue ? { roomUpgradeRevenue } : {}),
      outletRoomInstanceId: raw.outletRoomInstanceId, outletDurationMinutes: raw.outletDurationMinutes, staffRoleDefinitionId: typeof raw.staffRoleDefinitionId === "string" ? raw.staffRoleDefinitionId : null, servingEmployeeId: typeof raw.servingEmployeeId === "string" ? raw.servingEmployeeId : null,
      location: { ...raw.location }, returnLocation: isGridPoint(raw.returnLocation) ? { ...raw.returnLocation } : null, path, pathIndex: path.length ? Math.min(path.length - 1, Math.max(0, raw.pathIndex)) : 0,
      lastMovedAtFacilityTick: raw.lastMovedAtFacilityTick, purchaseEndsAtFacilityTick: tick(raw.purchaseEndsAtFacilityTick), cancellationReason: typeof raw.cancellationReason === "string" ? raw.cancellationReason : null, resourceWaitReason: typeof raw.resourceWaitReason === "string" ? raw.resourceWaitReason : null,
      ...(typeof raw.departureServiceOperationId === "string" ? { departureServiceOperationId: raw.departureServiceOperationId } : {}) } satisfies RetailOperationState];
  });
}

function normalizeRetailExternalActors(candidate: unknown): RetailExternalActorState[] {
  if (!Array.isArray(candidate)) return [];
  return candidate.flatMap((raw) => {
    if (!isRecord(raw) || typeof raw.id !== "string" || (raw.kind !== "retail_visitor" && raw.kind !== "companion") || typeof raw.displayName !== "string" || !isPixelAppearance(raw.appearance) ||
      (raw.lifecycle !== "arriving" && raw.lifecycle !== "onsite" && raw.lifecycle !== "departing" && raw.lifecycle !== "departed") || !Array.isArray(raw.path) ||
      typeof raw.pathIndex !== "number" || !Number.isSafeInteger(raw.pathIndex) || typeof raw.lastMovedAtFacilityTick !== "number" || !Number.isSafeInteger(raw.lastMovedAtFacilityTick)) return [];
    const path = raw.path.filter(isGridPoint).map((point) => ({ ...point }));
    return [{ id: raw.id, kind: raw.kind, displayName: raw.displayName, appearance: raw.appearance, linkedServiceOperationId: typeof raw.linkedServiceOperationId === "string" ? raw.linkedServiceOperationId : null,
      linkedEncounterId: typeof raw.linkedEncounterId === "string" ? raw.linkedEncounterId : null, lifecycle: raw.lifecycle, location: isGridPoint(raw.location) ? { ...raw.location } : null,
      path, pathIndex: path.length ? Math.min(path.length - 1, Math.max(0, raw.pathIndex)) : 0, lastMovedAtFacilityTick: raw.lastMovedAtFacilityTick,
      activeRetailOperationId: typeof raw.activeRetailOperationId === "string" ? raw.activeRetailOperationId : null } satisfies RetailExternalActorState];
  });
}

function normalizeRetailOrders(candidate: unknown): RetailOrderState[] {
  if (!Array.isArray(candidate)) return [];
  return candidate.flatMap((raw) => isRecord(raw) && typeof raw.id === "string" && typeof raw.actorKind === "string" && RETAIL_ACTOR_KINDS.has(raw.actorKind as RetailActorKind) && typeof raw.actorId === "string" &&
    typeof raw.incomeLineId === "string" && getServiceIncomeLine(raw.incomeLineId)?.retail?.category === "authorized_order" && typeof raw.allowance === "number" && Number.isSafeInteger(raw.allowance) && raw.allowance > 0 &&
    typeof raw.fulfilledQuantity === "number" && Number.isSafeInteger(raw.fulfilledQuantity) && raw.fulfilledQuantity >= 0 && raw.fulfilledQuantity <= raw.allowance && typeof raw.createdAtFacilityTick === "number" && Number.isSafeInteger(raw.createdAtFacilityTick)
    ? [{ id: raw.id, actorKind: raw.actorKind as RetailActorKind, actorId: raw.actorId, incomeLineId: raw.incomeLineId, allowance: raw.allowance, fulfilledQuantity: raw.fulfilledQuantity, createdAtFacilityTick: raw.createdAtFacilityTick }]
    : []);
}

function normalizeRetailActorLedgers(candidate: unknown): Record<string, RetailActorLedgerState> {
  if (!isRecord(candidate)) return {};
  return Object.fromEntries(Object.entries(candidate).flatMap(([key, raw]) => isRecord(raw) && typeof raw.dayNumber === "number" && Number.isSafeInteger(raw.dayNumber) && raw.dayNumber >= 0 &&
    typeof raw.discretionarySpent === "number" && Number.isFinite(raw.discretionarySpent) && raw.discretionarySpent >= 0 && typeof raw.foodDrinkPurchases === "number" && Number.isSafeInteger(raw.foodDrinkPurchases) && raw.foodDrinkPurchases >= 0 &&
    typeof raw.giftSupplyPurchases === "number" && Number.isSafeInteger(raw.giftSupplyPurchases) && raw.giftSupplyPurchases >= 0 && (raw.lastTripAtFacilityTick === null || typeof raw.lastTripAtFacilityTick === "number" && Number.isSafeInteger(raw.lastTripAtFacilityTick))
    ? [[key, { dayNumber: raw.dayNumber, foodDayNumber: typeof raw.foodDayNumber === "number" && Number.isSafeInteger(raw.foodDayNumber) ? raw.foodDayNumber : raw.dayNumber, discretionarySpent: raw.discretionarySpent, foodDrinkPurchases: raw.foodDrinkPurchases, giftSupplyPurchases: raw.giftSupplyPurchases, lastTripAtFacilityTick: raw.lastTripAtFacilityTick } satisfies RetailActorLedgerState]] : []));
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
      const headId =
        typeof candidate.headId === "string" && candidate.headId.trim().length > 0
          ? candidate.headId
          : "head.legacy";
      const bodyId =
        typeof candidate.bodyId === "string" && candidate.bodyId.trim().length > 0
          ? candidate.bodyId
          : "body.legacy";
      const appearance = normalizePixelAppearance(candidate.appearance, "founder");
      const stillId = appearance.stillId ?? founderStillIdForPresetIds(headId, bodyId);
      return {
        displayName,
        headId,
        bodyId,
        appearance: { ...appearance, ...(stillId ? { stillId } : {}) },
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
    const rawMaintenance = isRecord(candidate.maintenance) ? candidate.maintenance : null;
    const maintenance = rawMaintenance &&
      (rawMaintenance.status === "operational" || rawMaintenance.status === "due" || rawMaintenance.status === "out_of_service")
      ? {
          status: rawMaintenance.status as "operational" | "due" | "out_of_service",
          completedUses: typeof rawMaintenance.completedUses === "number" && Number.isSafeInteger(rawMaintenance.completedUses) && rawMaintenance.completedUses >= 0 ? rawMaintenance.completedUses : 0,
          dueAtFacilityTick: typeof rawMaintenance.dueAtFacilityTick === "number" && Number.isSafeInteger(rawMaintenance.dueAtFacilityTick) ? rawMaintenance.dueAtFacilityTick : null,
          outOfServiceAtFacilityTick: typeof rawMaintenance.outOfServiceAtFacilityTick === "number" && Number.isSafeInteger(rawMaintenance.outOfServiceAtFacilityTick) ? rawMaintenance.outOfServiceAtFacilityTick : null,
          appliedUseKeys: Array.isArray(rawMaintenance.appliedUseKeys)
            ? [...new Set(rawMaintenance.appliedUseKeys.filter((key): key is string => typeof key === "string"))]
            : [],
        }
      : undefined;
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
        ...(maintenance ? { maintenance } : {}),
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

function normalizeEmployeeDiscussion(
  discussionId: string,
  candidate: Record<string, unknown>,
  employees: readonly EmployeeState[],
  facilityTick: number,
): EmployeeDiscussionState | null {
  const parsedCase = syntheticClinicalCaseSchema.safeParse(
    candidate.frozenCase,
  );
  if (
    !parsedCase.success ||
    !employeeDiscussionCaseIsRuntimeSafe(parsedCase.data) ||
    typeof candidate.employeeId !== "string" ||
    typeof candidate.employeeDisplayName !== "string"
  ) {
    return null;
  }
  const frozenCase = parsedCase.data;
  const employee = employees.find(
    (item) => item.id === candidate.employeeId,
  );
  const answers = normalizeAnswers(
    candidate,
    frozenCase.decisionNodes.length,
  );
  const rawLifecycle = candidate.lifecycle;
  const lifecycle =
    rawLifecycle === "waiting_unopened" ||
    rawLifecycle === "active_traveling" ||
    rawLifecycle === "active_action_required" ||
    rawLifecycle === "feedback_pending" ||
    rawLifecycle === "resolved_summary_available" ||
    rawLifecycle === "resolved" ||
    rawLifecycle === "cancelled"
      ? rawLifecycle
      : "cancelled";
  const currentNodeIndex =
    typeof candidate.currentNodeIndex === "number" &&
    Number.isSafeInteger(candidate.currentNodeIndex)
      ? Math.max(
          0,
          Math.min(
            frozenCase.decisionNodes.length - 1,
            candidate.currentNodeIndex,
          ),
        )
      : 0;
  const steps = frozenCase.decisionNodes.map((node, nodeIndex) => {
    const answer =
      answers.find((item) => item.decisionNodeId === node.id) ?? null;
    const status: EncounterStepState["status"] =
      nodeIndex < currentNodeIndex
        ? "completed"
        : nodeIndex > currentNodeIndex
          ? "locked"
          : lifecycle === "feedback_pending"
            ? "feedback_pending"
            : lifecycle === "resolved_summary_available" ||
                lifecycle === "resolved"
              ? "completed"
              : "action_required";
    return {
      nodeIndex,
      decisionNodeId: node.id,
      questionVariantId: node.questionVariantId,
      primaryConceptId: node.primaryConceptId,
      status,
      answer,
      result: null,
    };
  });
  const requiredRoles = frozenCase.participant!.requiredStaffRoleDefinitionIds;
  const employeeValid = Boolean(
    employee && requiredRoles.includes(employee.staffRoleDefinitionId),
  );
  const answerNodeIds = answers.map((answer) => answer.decisionNodeId);
  const uniqueAnswerNodeIds = new Set(answerNodeIds);
  const historyCoherent =
    uniqueAnswerNodeIds.size === answerNodeIds.length &&
    frozenCase.decisionNodes.every((node, nodeIndex) => {
      const answered = uniqueAnswerNodeIds.has(node.id);
      if (nodeIndex < currentNodeIndex) return answered;
      if (nodeIndex > currentNodeIndex) return !answered;
      if (
        lifecycle === "feedback_pending" ||
        lifecycle === "resolved_summary_available" ||
        lifecycle === "resolved"
      ) {
        return answered;
      }
      return !answered;
    });
  const historicalLifecycle =
    lifecycle === "resolved" || lifecycle === "cancelled";
  const normalizedLifecycle =
    !historyCoherent ||
    (!historicalLifecycle && !employeeValid)
      ? "cancelled"
      : lifecycle;
  return {
    id: discussionId,
    clinicalReleaseId:
      typeof candidate.clinicalReleaseId === "string"
        ? candidate.clinicalReleaseId
        : "unknown",
    frozenCase,
    employeeId: candidate.employeeId,
    employeeDisplayName: candidate.employeeDisplayName,
    employeeAppearance: isPixelAppearance(candidate.employeeAppearance)
      ? candidate.employeeAppearance
      : employee?.appearance ??
        createPixelAppearance("employee-discussion", "staff", discussionId),
    lifecycle: normalizedLifecycle,
    createdAtFacilityTick:
      typeof candidate.createdAtFacilityTick === "number" &&
      Number.isSafeInteger(candidate.createdAtFacilityTick) &&
      candidate.createdAtFacilityTick >= 0
        ? Math.min(candidate.createdAtFacilityTick, facilityTick)
        : facilityTick,
    firstOpenedAtTick:
      typeof candidate.firstOpenedAtTick === "number" &&
      Number.isSafeInteger(candidate.firstOpenedAtTick) &&
      candidate.firstOpenedAtTick >= 0
        ? Math.min(candidate.firstOpenedAtTick, facilityTick)
        : null,
    resolvedAtFacilityTick:
      normalizedLifecycle === "resolved" || normalizedLifecycle === "cancelled"
        ? typeof candidate.resolvedAtFacilityTick === "number" &&
          Number.isSafeInteger(candidate.resolvedAtFacilityTick) &&
          candidate.resolvedAtFacilityTick >= 0
          ? Math.min(candidate.resolvedAtFacilityTick, facilityTick)
          : facilityTick
        : null,
    cancellationReason:
      normalizedLifecycle === "cancelled"
        ? !historyCoherent || candidate.cancellationReason === "content_invalid"
          ? "content_invalid"
          : "employee_unavailable"
        : null,
    currentNodeIndex,
    answers,
    steps,
  };
}

function normalizeFrozenPatientTravel(
  candidate: unknown,
  _currentTilesPerTick: number,
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
    tilesPerTick: candidate.tilesPerTick as number,
    outboundStartTick: candidate.outboundStartTick as number,
    outboundArrivalTick: candidate.outboundArrivalTick as number,
    serviceCompletionTick: candidate.serviceCompletionTick as number,
    returnArrivalTick: candidate.returnArrivalTick as number,
  };
}

function normalizeFrozenOffsitePatientTravel(
  candidate: unknown,
  _currentTilesPerTick: number,
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
    tilesPerTick: candidate.tilesPerTick as number,
    outboundStartTick: candidate.outboundStartTick as number,
    outboundArrivalTick: candidate.outboundArrivalTick as number,
    returnStartTick: candidate.returnStartTick as number,
    returnArrivalTick: candidate.returnArrivalTick as number,
  };
}

function normalizePendingResult(
  candidate: unknown,
  context: DomainContext,
  encounterId?: string,
): PendingResult | null {
  if (!isRecord(candidate)) {
    return null;
  }
  const diagnosticTiming = readDiagnosticTiming(candidate.diagnosticTiming, encounterId);
  const completedCareProvenance =
    isRecord(candidate.completedCareProvenance) &&
    candidate.completedCareProvenance.version === "completed-care-provenance.v1" &&
    typeof candidate.completedCareProvenance.serviceOperationId === "string" &&
    typeof candidate.completedCareProvenance.roomInstanceId === "string" &&
    (candidate.completedCareProvenance.provider === null ||
      (isRecord(candidate.completedCareProvenance.provider) &&
        (candidate.completedCareProvenance.provider.kind === "founder" ||
          (candidate.completedCareProvenance.provider.kind === "employee" &&
            typeof candidate.completedCareProvenance.provider.employeeId === "string"))))
      ? {
          version: "completed-care-provenance.v1" as const,
          serviceOperationId: candidate.completedCareProvenance.serviceOperationId,
          roomInstanceId: candidate.completedCareProvenance.roomInstanceId,
          provider: candidate.completedCareProvenance.provider === null
            ? null
            : candidate.completedCareProvenance.provider.kind === "founder"
              ? { kind: "founder" as const }
              : {
                  kind: "employee" as const,
                  employeeId: candidate.completedCareProvenance.provider.employeeId as string,
                },
        }
      : undefined;
  const localServiceOperation =
    isRecord(candidate.localServiceOperation) &&
    candidate.localServiceOperation.version === "pending-result-service-operation.v1" &&
    (candidate.localServiceOperation.status === "feedback_pending" ||
      candidate.localServiceOperation.status === "waiting_for_service" ||
      candidate.localServiceOperation.status === "external_processing") &&
    typeof candidate.localServiceOperation.incomeLineId === "string" &&
    (candidate.localServiceOperation.serviceOperationId === null ||
      typeof candidate.localServiceOperation.serviceOperationId === "string") &&
    typeof candidate.localServiceOperation.externalDurationTicks === "number" &&
    Number.isSafeInteger(candidate.localServiceOperation.externalDurationTicks) &&
    candidate.localServiceOperation.externalDurationTicks >= 0
      ? {
          version: "pending-result-service-operation.v1" as const,
          status: candidate.localServiceOperation.status as
            | "feedback_pending"
            | "waiting_for_service"
            | "external_processing",
          incomeLineId: candidate.localServiceOperation.incomeLineId,
          serviceOperationId: candidate.localServiceOperation.serviceOperationId as string | null,
          externalDurationTicks: candidate.localServiceOperation.externalDurationTicks,
        }
      : undefined;
  if (
    candidate.localServiceOperation !== undefined &&
    (localServiceOperation === undefined ||
      (localServiceOperation.status === "feedback_pending" &&
        localServiceOperation.serviceOperationId !== null) ||
      ((localServiceOperation.status === "waiting_for_service" ||
        localServiceOperation.status === "external_processing") &&
        localServiceOperation.serviceOperationId === null))
  ) {
    return null;
  }
  const resourceQueue =
    isRecord(candidate.resourceQueue) &&
    candidate.resourceQueue.version === "onsite-resource-queue.v1" &&
    candidate.resourceQueue.status === "waiting_for_resources" &&
    typeof candidate.resourceQueue.serviceId === "string" &&
    typeof candidate.resourceQueue.routeId === "string" &&
    (candidate.resourceQueue.allowedRouteIds === null ||
      (Array.isArray(candidate.resourceQueue.allowedRouteIds) &&
        candidate.resourceQueue.allowedRouteIds.every(
          (routeId) => typeof routeId === "string",
        ))) &&
    typeof candidate.resourceQueue.queuedAtTick === "number" &&
    Number.isSafeInteger(candidate.resourceQueue.queuedAtTick) &&
    candidate.resourceQueue.queuedAtTick >= 0
      ? {
          version: "onsite-resource-queue.v1" as const,
          status: "waiting_for_resources" as const,
          serviceId: candidate.resourceQueue.serviceId,
          routeId: candidate.resourceQueue.routeId,
          allowedRouteIds: candidate.resourceQueue.allowedRouteIds as string[] | null,
          queuedAtTick: candidate.resourceQueue.queuedAtTick,
        }
      : undefined;
  const durationTicks =
    typeof candidate.durationTicks === "number" &&
    Number.isSafeInteger(candidate.durationTicks) &&
    (candidate.durationTicks > 0 ||
      (candidate.durationTicks === 0 &&
        (resourceQueue !== undefined || localServiceOperation !== undefined)))
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
    ...(diagnosticTiming ? { diagnosticTiming } : {}),
    ...(candidate.approvedProcedureTimingVersion === 1
      ? { approvedProcedureTimingVersion: 1 as const }
      : { approvedProcedureTimingVersion: undefined }),
    ...(candidate.phlebotomyArrivalGatedVersion === 1
      ? { phlebotomyArrivalGatedVersion: 1 as const }
      : { phlebotomyArrivalGatedVersion: undefined }),
    localServiceOperation,
    completedCareProvenance,
    resourceQueue,
    onsiteReturn:
      isRecord(candidate.onsiteReturn) &&
      candidate.onsiteReturn.version === "onsite-front-desk-return.v1" &&
      (candidate.onsiteReturn.status === "awaiting_service_completion" ||
        candidate.onsiteReturn.status === "walking_to_front_desk" ||
        candidate.onsiteReturn.status === "front_desk_arrived") &&
      (candidate.onsiteReturn.serviceCompletedAtTick === null ||
        (typeof candidate.onsiteReturn.serviceCompletedAtTick === "number" &&
          Number.isSafeInteger(candidate.onsiteReturn.serviceCompletedAtTick) &&
          candidate.onsiteReturn.serviceCompletedAtTick >= 0)) &&
      (candidate.onsiteReturn.frontDeskArrivalTick === null ||
        (typeof candidate.onsiteReturn.frontDeskArrivalTick === "number" &&
          Number.isSafeInteger(candidate.onsiteReturn.frontDeskArrivalTick) &&
          candidate.onsiteReturn.frontDeskArrivalTick >= 0))
        ? {
            version: "onsite-front-desk-return.v1" as const,
            status: candidate.onsiteReturn.status,
            serviceCompletedAtTick: candidate.onsiteReturn.serviceCompletedAtTick as number | null,
            frontDeskArrivalTick: candidate.onsiteReturn.frontDeskArrivalTick as number | null,
          }
        : undefined,
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
    externalProcessingOnly:
      candidate.externalProcessingOnly === true ? true : undefined,
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
    roomUpgradeRevenue: normalizeRoomUpgradeRevenueQuote(candidate.roomUpgradeRevenue, candidate.serviceIncomeFee,
      typeof candidate.serviceIncomeLineId === "string"
        ? getServiceIncomeLine(candidate.serviceIncomeLineId)?.operation?.phases.map((phase) => phase.roomDefinitionId) : []),
    roomUpgradeRecovery: normalizeRoomUpgradeRecoveryQuote(candidate.roomUpgradeRecovery,
      typeof candidate.serviceIncomeLineId === "string" ? getServiceIncomeLine(candidate.serviceIncomeLineId)?.operation?.phases ?? [] : []),
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
    phlebotomistId:
      candidate.phlebotomyArrivalGatedVersion === 1 &&
      typeof candidate.phlebotomistId === "string"
        ? candidate.phlebotomistId
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
    String(candidate.id),
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
    "returning_from_onsite_service",
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
        ? normalizePendingResult(existingStep.result, context, String(candidate.id))
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
  const rawContinuation = isRecord(candidate.testOnlyContinuation)
    ? candidate.testOnlyContinuation
    : null;
  const continuationDiagnosticTiming = readDiagnosticTiming(rawContinuation?.diagnosticTiming, String(candidate.id));
  const rawContinuationOffsite = rawContinuation && isRecord(rawContinuation.saleInterruptedOffsite)
    ? rawContinuation.saleInterruptedOffsite
    : null;
  const continuationOffsite = rawContinuationOffsite?.version === "sale-interrupted-continuation.v1" &&
    (rawContinuationOffsite.readyAtFacilityTick === null ||
      typeof rawContinuationOffsite.readyAtFacilityTick === "number" &&
      Number.isSafeInteger(rawContinuationOffsite.readyAtFacilityTick)) &&
    (rawContinuationOffsite.offscreenEndpoint === null ||
      isRecord(rawContinuationOffsite.offscreenEndpoint) &&
      typeof rawContinuationOffsite.offscreenEndpoint.x === "number" &&
      typeof rawContinuationOffsite.offscreenEndpoint.y === "number") &&
    Array.isArray(rawContinuationOffsite.returnPath)
      ? {
          version: "sale-interrupted-continuation.v1" as const,
          readyAtFacilityTick: rawContinuationOffsite.readyAtFacilityTick as number | null,
          offscreenEndpoint: rawContinuationOffsite.offscreenEndpoint === null
            ? null
            : { x: rawContinuationOffsite.offscreenEndpoint.x as number, y: rawContinuationOffsite.offscreenEndpoint.y as number },
          returnPath: rawContinuationOffsite.returnPath.flatMap((point) =>
            isRecord(point) && typeof point.x === "number" && typeof point.y === "number"
              ? [{ x: point.x, y: point.y }]
              : []),
        }
      : undefined;
  const testOnlyContinuation =
    rawContinuation?.version === "test-only-continuation.v1" &&
    typeof rawContinuation.originatingNodeIndex === "number" &&
    Number.isSafeInteger(rawContinuation.originatingNodeIndex) &&
    rawContinuation.originatingNodeIndex >= 0 &&
    typeof rawContinuation.serviceId === "string" &&
    typeof rawContinuation.routeId === "string" &&
    typeof rawContinuation.routeDisplayName === "string" &&
    (rawContinuation.incomeLineId === null || typeof rawContinuation.incomeLineId === "string") &&
    typeof rawContinuation.externalRemainder === "string" &&
    (rawContinuation.status === "feedback_pending" ||
      rawContinuation.status === "waiting_for_service" ||
      rawContinuation.status === "returning_to_front_desk" ||
      rawContinuation.status === "completed" ||
      rawContinuation.status === "external_arranged") &&
    (rawContinuation.serviceOperationId === null || typeof rawContinuation.serviceOperationId === "string") &&
    typeof rawContinuation.scheduledAtFacilityTick === "number" &&
    Number.isSafeInteger(rawContinuation.scheduledAtFacilityTick) &&
    rawContinuation.scheduledAtFacilityTick >= 0 &&
    (rawContinuation.completedAtFacilityTick === null ||
      (typeof rawContinuation.completedAtFacilityTick === "number" &&
        Number.isSafeInteger(rawContinuation.completedAtFacilityTick) &&
        rawContinuation.completedAtFacilityTick >= 0))
      ? {
          version: "test-only-continuation.v1" as const,
          originatingNodeIndex: rawContinuation.originatingNodeIndex,
          serviceId: rawContinuation.serviceId,
          routeId: rawContinuation.routeId,
          routeDisplayName: rawContinuation.routeDisplayName,
          incomeLineId: rawContinuation.incomeLineId,
          ...(typeof rawContinuation.quoteFee === "number" && Number.isFinite(rawContinuation.quoteFee) && rawContinuation.quoteFee >= 0
            ? { quoteFee: rawContinuation.quoteFee } : {}),
          roomUpgradeRevenue: normalizeRoomUpgradeRevenueQuote(rawContinuation.roomUpgradeRevenue, rawContinuation.quoteFee,
            typeof rawContinuation.incomeLineId === "string"
              ? getServiceIncomeLine(rawContinuation.incomeLineId)?.operation?.phases.map((phase) => phase.roomDefinitionId) : undefined),
          roomUpgradeRecovery: normalizeRoomUpgradeRecoveryQuote(rawContinuation.roomUpgradeRecovery,
            typeof rawContinuation.incomeLineId === "string" ? getServiceIncomeLine(rawContinuation.incomeLineId)?.operation?.phases ?? [] : []),
          externalRemainder: rawContinuation.externalRemainder,
          status: rawContinuation.status as NonNullable<EncounterState["testOnlyContinuation"]>["status"],
          serviceOperationId: rawContinuation.serviceOperationId,
          scheduledAtFacilityTick: rawContinuation.scheduledAtFacilityTick,
          completedAtFacilityTick: rawContinuation.completedAtFacilityTick,
          ...(continuationDiagnosticTiming ? { diagnosticTiming: continuationDiagnosticTiming } : {}),
          ...(continuationOffsite ? { saleInterruptedOffsite: continuationOffsite } : {}),
        }
      : undefined;
  const rawTerminalTestOrder = isRecord(candidate.terminalTestOrder)
    ? candidate.terminalTestOrder
    : null;
  const terminalDiagnosticTiming = readDiagnosticTiming(rawTerminalTestOrder?.diagnosticTiming, String(candidate.id));
  const terminalTestOrder =
    rawTerminalTestOrder?.version === "terminal-test-order.v1" &&
    typeof rawTerminalTestOrder.caseId === "string" &&
    typeof rawTerminalTestOrder.nodeId === "string" &&
    typeof rawTerminalTestOrder.questionVariantId === "string" &&
    typeof rawTerminalTestOrder.choiceId === "string" &&
    typeof rawTerminalTestOrder.choiceLabel === "string" &&
    typeof rawTerminalTestOrder.serviceId === "string" &&
    typeof rawTerminalTestOrder.routeId === "string" &&
    typeof rawTerminalTestOrder.routeDisplayName === "string" &&
    (rawTerminalTestOrder.externalRemainder === null || typeof rawTerminalTestOrder.externalRemainder === "string") &&
    (rawTerminalTestOrder.status === "onsite_service" || rawTerminalTestOrder.status === "external_arranged") &&
    (rawTerminalTestOrder.serviceOperationId === null || typeof rawTerminalTestOrder.serviceOperationId === "string") &&
    typeof rawTerminalTestOrder.scheduledAtFacilityTick === "number" &&
    Number.isSafeInteger(rawTerminalTestOrder.scheduledAtFacilityTick) &&
    rawTerminalTestOrder.scheduledAtFacilityTick >= 0
      ? {
          version: "terminal-test-order.v1" as const,
          caseId: rawTerminalTestOrder.caseId,
          nodeId: rawTerminalTestOrder.nodeId,
          questionVariantId: rawTerminalTestOrder.questionVariantId,
          choiceId: rawTerminalTestOrder.choiceId,
          choiceLabel: rawTerminalTestOrder.choiceLabel,
          serviceId: rawTerminalTestOrder.serviceId,
          routeId: rawTerminalTestOrder.routeId,
          routeDisplayName: rawTerminalTestOrder.routeDisplayName,
          externalRemainder: rawTerminalTestOrder.externalRemainder,
          status: rawTerminalTestOrder.status as NonNullable<EncounterState["terminalTestOrder"]>["status"],
          serviceOperationId: rawTerminalTestOrder.serviceOperationId,
          scheduledAtFacilityTick: rawTerminalTestOrder.scheduledAtFacilityTick,
          ...(terminalDiagnosticTiming ? { diagnosticTiming: terminalDiagnosticTiming } : {}),
        }
      : undefined;
  const rawStaged = isRecord(candidate.stagedResultOrder) ? candidate.stagedResultOrder : null;
  const stagedDiagnosticTiming = readDiagnosticTiming(rawStaged?.diagnosticTiming, String(candidate.id));
  const stagedStatuses = new Set(["feedback_pending", "waiting_for_component", "returning_to_front_desk", "remainder_pending", "completed"]);
  const componentStatuses = new Set(["pending", "waiting_for_service", "returning_to_front_desk", "completed", "cancelled"]);
  const rawStagedComponents = Array.isArray(rawStaged?.components) ? rawStaged.components : [];
  const stagedComponents = rawStagedComponents
    .filter(isRecord).flatMap((component) => {
      const diagnosticTiming = readDiagnosticTiming(component.diagnosticTiming, String(candidate.id));
      const rawPhases = Array.isArray(component.operationPhases) ? component.operationPhases : [];
      const operationPhases = rawPhases.filter(isRecord).flatMap((phase) =>
        typeof phase.id === "string" &&
        (phase.roomDefinitionId === null || typeof phase.roomDefinitionId === "string") &&
        typeof phase.durationMinutes === "number" && Number.isSafeInteger(phase.durationMinutes) && phase.durationMinutes > 0 &&
        Array.isArray(phase.staffRoleDefinitionIds) && phase.staffRoleDefinitionIds.every((id) => typeof id === "string")
          ? [{
              id: phase.id,
              roomDefinitionId: phase.roomDefinitionId as string | null,
              durationMinutes: phase.durationMinutes,
              staffRoleDefinitionIds: phase.staffRoleDefinitionIds as string[],
              ...(Array.isArray(phase.providerRoleDefinitionIds) ? { providerRoleDefinitionIds: phase.providerRoleDefinitionIds.filter((id): id is string => typeof id === "string") } : {}),
              ...(phase.founderEligible === true ? { founderEligible: true as const } : {}),
              ...(phase.roomStationId === "periop_preparation" || phase.roomStationId === "periop_recovery"
                ? { roomStationId: phase.roomStationId as "periop_preparation" | "periop_recovery" } : {}),
            }]
          : [],
      );
      const roomUpgradeRecovery = normalizeRoomUpgradeRecoveryQuote(component.roomUpgradeRecovery, operationPhases);
      return (
        typeof component.componentId === "string" &&
        typeof component.serviceId === "string" &&
        typeof component.routeId === "string" &&
        typeof component.routeDisplayName === "string" &&
        typeof component.incomeLineId === "string" &&
        typeof component.quoteFee === "number" && Number.isFinite(component.quoteFee) && component.quoteFee >= 0 &&
        typeof component.externalRemainder === "string" &&
        operationPhases.length > 0 && operationPhases.length === rawPhases.length &&
        typeof component.status === "string" && componentStatuses.has(component.status) &&
        (component.serviceOperationId === null || typeof component.serviceOperationId === "string")
          ? [{
              componentId: component.componentId,
              serviceId: component.serviceId,
              routeId: component.routeId,
              routeDisplayName: component.routeDisplayName,
              incomeLineId: component.incomeLineId,
              quoteFee: component.quoteFee,
              roomUpgradeRevenue: normalizeRoomUpgradeRevenueQuote(component.roomUpgradeRevenue, component.quoteFee,
                operationPhases.map((phase) => phase.roomDefinitionId)),
              roomUpgradeRecovery,
              operationPhases,
              externalRemainder: component.externalRemainder,
              status: component.status as NonNullable<EncounterState["stagedResultOrder"]>["components"][number]["status"],
              serviceOperationId: component.serviceOperationId,
              ...(diagnosticTiming ? { diagnosticTiming } : {}),
            }]
          : []
      );
    })
    ;
  const stagedRemainder = isRecord(rawStaged?.remainder)
    ? normalizePendingResult(rawStaged.remainder, context, String(candidate.id))
    : null;
  const stagedResultOrder =
    rawStaged?.version === "staged-result-order.v1" &&
    typeof rawStaged.originatingNodeIndex === "number" && Number.isSafeInteger(rawStaged.originatingNodeIndex) && rawStaged.originatingNodeIndex >= 0 &&
    typeof rawStaged.caseId === "string" && typeof rawStaged.nodeId === "string" &&
    typeof rawStaged.questionVariantId === "string" && typeof rawStaged.choiceId === "string" && typeof rawStaged.choiceLabel === "string" &&
    typeof rawStaged.status === "string" && stagedStatuses.has(rawStaged.status) &&
    (rawStaged.remainderMode === "external_patient_visit" || rawStaged.remainderMode === "external_processing") &&
    typeof rawStaged.currentComponentIndex === "number" && Number.isSafeInteger(rawStaged.currentComponentIndex) && rawStaged.currentComponentIndex >= 0 &&
    stagedComponents.length > 0 && stagedComponents.length === rawStagedComponents.length &&
    rawStaged.currentComponentIndex < stagedComponents.length && stagedRemainder
      ? {
          version: "staged-result-order.v1" as const,
          originatingNodeIndex: rawStaged.originatingNodeIndex,
          caseId: rawStaged.caseId,
          nodeId: rawStaged.nodeId,
          questionVariantId: rawStaged.questionVariantId,
          choiceId: rawStaged.choiceId,
          choiceLabel: rawStaged.choiceLabel,
          status: rawStaged.status as NonNullable<EncounterState["stagedResultOrder"]>["status"],
          remainderMode: rawStaged.remainderMode as NonNullable<EncounterState["stagedResultOrder"]>["remainderMode"],
          currentComponentIndex: rawStaged.currentComponentIndex,
          components: stagedComponents,
          remainder: stagedRemainder,
          ...(stagedDiagnosticTiming ? { diagnosticTiming: stagedDiagnosticTiming } : {}),
        }
      : undefined;

  if ((continuationDiagnosticTiming && !testOnlyContinuation) || (terminalDiagnosticTiming && !terminalTestOrder) ||
    (stagedDiagnosticTiming && !stagedResultOrder) ||
    (rawStagedComponents.some((component) => isRecord(component) && component.diagnosticTiming !== undefined) && !stagedResultOrder)) {
    throw new Error("The saved diagnostic order carrier is invalid.");
  }

  const terminalFeedback = isRecord(candidate.terminalFeedback)
    ? ({
        ...candidate.terminalFeedback,
        consequence:
          typeof candidate.terminalFeedback.consequence === "string"
            ? candidate.terminalFeedback.consequence
            : isRecord(candidate.terminalFeedback.outcome) &&
                typeof candidate.terminalFeedback.outcome.narrative === "string"
              ? candidate.terminalFeedback.outcome.narrative
              : null,
      } as unknown as TerminalFeedback)
    : null;
  const restoresCompletedTerminalLifecycle =
    lifecycle === "active_action_required" &&
    resolutionReason === "completed" &&
    currentNodeIndex === rawNodes.length - 1 &&
    steps[currentNodeIndex]?.status === "completed" &&
    Boolean(steps[currentNodeIndex]?.answer) &&
    terminalFeedback !== null &&
    typeof candidate.settlementId === "string";
  const normalizedLifecycle = restoresCompletedTerminalLifecycle
    ? ("resolved_summary_available" as const)
    : lifecycle;

  return {
    ...(candidate as unknown as EncounterState),
    frozenCase:
      frozenCase as unknown as EncounterState["frozenCase"],
    lifecycle: normalizedLifecycle,
    feedAttentionKind: restoresCompletedTerminalLifecycle
      ? null
      : feedAttentionKind,
    feedAttentionStartedAtTick: restoresCompletedTerminalLifecycle
      ? null
      : feedAttentionStartedAtTick,
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
    roomUpgradeExperience: normalizeRoomUpgradeExperience(candidate.roomUpgradeExperience, facilityTick),
    idleWaitingSinceTick: restoresCompletedTerminalLifecycle
      ? null
      : idleWaitingSinceTick,
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
    terminalFeedback,
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
    ...(testOnlyContinuation ? { testOnlyContinuation } : {}),
    ...(stagedResultOrder ? { stagedResultOrder } : {}),
    ...(terminalTestOrder ? { terminalTestOrder } : {}),
    ...(typeof candidate.retailFoodDrinkAllowed === "boolean"
      ? { retailFoodDrinkAllowed: candidate.retailFoodDrinkAllowed }
      : {}),
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
      parsed.facilityLevel !== 2 &&
      parsed.facilityLevel !== 3) ||
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
        (candidate.actorKind === "patient" || candidate.actorKind === "visitor" || candidate.actorKind === "employee" || candidate.actorKind === "founder" || candidate.actorKind === "remote" || candidate.actorKind === "retail_visitor" || candidate.actorKind === "companion") &&
        typeof candidate.actorId === "string" &&
        typeof candidate.grossAmount === "number" && Number.isFinite(candidate.grossAmount) &&
        typeof candidate.stockCost === "number" && Number.isFinite(candidate.stockCost) &&
        typeof candidate.netCashDelta === "number" && Number.isFinite(candidate.netCashDelta) &&
        typeof candidate.completedAtFacilityTick === "number" && Number.isSafeInteger(candidate.completedAtFacilityTick)
          ? [{ id: candidate.id, transactionKey: candidate.transactionKey, incomeLineId: candidate.incomeLineId, catalogVersion: 1 as const, routeId: candidate.routeId, actorKind: candidate.actorKind as "patient" | "visitor" | "employee" | "founder" | "remote" | "retail_visitor" | "companion", actorId: candidate.actorId, ...(isRecord(candidate.displayAnchor) && ((candidate.displayAnchor.actorKind === "employee" && typeof candidate.displayAnchor.actorId === "string") || (candidate.displayAnchor.actorKind === "founder" && candidate.displayAnchor.actorId === "founder")) ? { displayAnchor: candidate.displayAnchor as { actorKind: "employee"; actorId: string } | { actorKind: "founder"; actorId: "founder" } } : {}), grossAmount: candidate.grossAmount, stockCost: candidate.stockCost, netCashDelta: candidate.netCashDelta, completedAtFacilityTick: candidate.completedAtFacilityTick }]
          : [],
      )
    : [];
  const serviceOperations = normalizeServiceOperations(parsed.serviceOperations);
  const patientAmenityTrips: PatientAmenityTripState[] = [];
  const retailOperations = normalizeRetailOperations(parsed.retailOperations);
  const retailExternalActors = normalizeRetailExternalActors(parsed.retailExternalActors);
  const retailOrders = normalizeRetailOrders(parsed.retailOrders);
  const next: GameState = {
    ...baseline,
    ...(parsed as unknown as GameState),
    schemaVersion: 9 as const,
    approvedRoomNavigationMigration:
      isRecord(parsed.approvedRoomNavigationMigration) &&
      parsed.approvedRoomNavigationMigration.version ===
        "approved-room-navigation.v1"
        ? { version: "approved-room-navigation.v1" as const }
        : undefined,
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
          typeof tick === "number" && Number.isSafeInteger(tick) && tick >= 0,
        )) as Record<string, number>
      : {},
    lastServiceAppointmentArrivalTick:
      typeof parsed.lastServiceAppointmentArrivalTick === "number" &&
      Number.isSafeInteger(parsed.lastServiceAppointmentArrivalTick) &&
      parsed.lastServiceAppointmentArrivalTick <= parsedFacilityTick
        ? parsed.lastServiceAppointmentArrivalTick
        : null,
    lastServiceAppointmentLineId:
      typeof parsed.lastServiceAppointmentLineId === "string" ? parsed.lastServiceAppointmentLineId : null,
    lastServiceAppointmentTicks: isRecord(parsed.lastServiceAppointmentTicks)
      ? Object.fromEntries(Object.entries(parsed.lastServiceAppointmentTicks).filter(([, tick]) => typeof tick === "number" && Number.isSafeInteger(tick) && tick <= parsedFacilityTick)) as Record<string, number>
      : {},
    serviceOperationSequence: Math.max(
      serviceOperations.length,
      typeof parsed.serviceOperationSequence === "number" &&
        Number.isSafeInteger(parsed.serviceOperationSequence) &&
        parsed.serviceOperationSequence >= 0
        ? parsed.serviceOperationSequence
        : 0,
    ),
    serviceOperations,
    patientAmenityTrips,
    patientAmenityNextOpportunityTicks: isRecord(parsed.patientAmenityNextOpportunityTicks)
      ? Object.fromEntries(Object.entries(parsed.patientAmenityNextOpportunityTicks).filter(([, tick]) =>
          typeof tick === "number" && Number.isSafeInteger(tick) && tick >= 0,
        )) as Record<string, number>
      : {},
    patientAmenityTripSequence: Math.max(
      patientAmenityTrips.length,
      typeof parsed.patientAmenityTripSequence === "number" && Number.isSafeInteger(parsed.patientAmenityTripSequence) && parsed.patientAmenityTripSequence >= 0
        ? parsed.patientAmenityTripSequence
        : 0,
    ),
    retiredEncounterSummary: normalizeRetiredEncounterSummary(
      parsed.retiredEncounterSummary,
    ),
    retiredServiceHistory: normalizeRetiredServiceHistory(
      parsed.retiredServiceHistory,
    ),
    retailOperationSequence: Math.max(retailOperations.length, typeof parsed.retailOperationSequence === "number" && Number.isSafeInteger(parsed.retailOperationSequence) && parsed.retailOperationSequence >= 0 ? parsed.retailOperationSequence : 0),
    retailOperations,
    retailExternalActors,
    retailOrders,
    retailActorLedgers: normalizeRetailActorLedgers(parsed.retailActorLedgers),
    retailNextOpportunityTicks: isRecord(parsed.retailNextOpportunityTicks)
      ? Object.fromEntries(Object.entries(parsed.retailNextOpportunityTicks).filter(([, tick]) => typeof tick === "number" && Number.isSafeInteger(tick) && tick >= parsedFacilityTick)) as Record<string, number>
      : {},
    nextExternalRetailOpportunityTick: typeof parsed.nextExternalRetailOpportunityTick === "number" && Number.isSafeInteger(parsed.nextExternalRetailOpportunityTick) && parsed.nextExternalRetailOpportunityTick > parsedFacilityTick ? parsed.nextExternalRetailOpportunityTick : parsedFacilityTick + 120,
    externalRetailSequence: typeof parsed.externalRetailSequence === "number" && Number.isSafeInteger(parsed.externalRetailSequence) && parsed.externalRetailSequence >= 0 ? parsed.externalRetailSequence : 0,
    companionSequence: typeof parsed.companionSequence === "number" && Number.isSafeInteger(parsed.companionSequence) && parsed.companionSequence >= 0 ? parsed.companionSequence : 0,
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
  next.patientAmenityTrips = normalizePatientAmenityTrips(
    parsed.patientAmenityTrips,
    next.rooms,
    next.serviceOperations,
    next.encounters,
  );
  next.patientAmenityTripSequence = Math.max(
    next.patientAmenityTrips.length,
    next.patientAmenityTripSequence ?? 0,
  );
  next.doors = normalizeDoors(parsed, next.rooms, context);
  next.serviceOperations = next.serviceOperations.filter((operation) => {
    const reservation = operation.periopBedReservation;
    if (!reservation) return true;
    const room = next.rooms.find((candidate) => candidate.id === reservation.roomInstanceId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    if (!room || !definition) return false;
    const station = getRoomCareStations(
      room,
      definition,
      next.doors,
      next.rooms,
      (id) => getRoomDefinition(id, context),
    ).find((candidate) => candidate.id === reservation.bedId);
    return Boolean(station && station.patientAnchor.x === reservation.endpoint.x && station.patientAnchor.y === reservation.endpoint.y);
  });

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
  for (const encounter of Object.values(next.encounters)) {
    const carriers = [encounter.pendingResult, encounter.testOnlyContinuation, encounter.terminalTestOrder, encounter.stagedResultOrder,
      encounter.stagedResultOrder?.remainder, ...(encounter.stagedResultOrder?.components ?? []), ...encounter.steps.map((step) => step.result)];
    for (const carrier of carriers) {
      const plan = carrier?.diagnosticTiming;
      if (!plan?.phases.some((phase) => phase.readingUpgradeWork)) continue;
      const feedbackPending = encounter.steps.some((step) => step.status === "feedback_pending" && step.result?.diagnosticTiming?.orderId === plan.orderId) ||
        encounter.testOnlyContinuation?.diagnosticTiming?.orderId === plan.orderId && encounter.testOnlyContinuation.status === "feedback_pending" ||
        encounter.stagedResultOrder?.diagnosticTiming?.orderId === plan.orderId && encounter.stagedResultOrder.status === "feedback_pending";
      for (const phase of plan.phases) {
        const reading = phase.readingUpgradeWork;
        if (!reading) continue;
        if (reading.acceptedAtTick > next.facilityTick || reading.executionEnabledAtTick !== null && (feedbackPending || reading.executionEnabledAtTick > next.facilityTick) ||
          reading.readyAtTick !== null && reading.readyAtTick > next.facilityTick ||
          phase.startedAtTick !== null && phase.startedAtTick > next.facilityTick || phase.completedAtTick !== null && phase.completedAtTick > next.facilityTick) {
          throw new Error("The saved Reading readiness witness is invalid.");
        }
        const operation = next.serviceOperations.find((entry) => entry.id === phase.serviceOperationId);
        if (!operation) continue;
        const work = operation.diagnosticPhaseWork;
        if (!work?.readingUpgradeWork || work.orderId !== plan.orderId || work.encounterId !== plan.encounterId || work.phaseId !== phase.id ||
          JSON.stringify(work.readingUpgradeWork) !== JSON.stringify(reading) || work.durationMinutes !== phase.durationMinutes ||
          work.remainingMinutes !== phase.remainingMinutes || JSON.stringify(work.resource) !== JSON.stringify(phase.resource) || operation.phaseStartedAtFacilityTick !== phase.startedAtTick ||
          operation.status === "completed" && operation.completedAtFacilityTick !== phase.completedAtTick) {
          throw new Error("The saved Reading phase and operation disagree.");
        }
      }
    }
  }
  for (const operation of next.serviceOperations) if (operation.diagnosticPhaseWork?.readingUpgradeWork) {
    const reading = operation.diagnosticPhaseWork.readingUpgradeWork;
    if (reading.executionEnabledAtTick! > next.facilityTick || reading.readyAtTick! > next.facilityTick ||
      operation.startedAtFacilityTick !== null && operation.startedAtFacilityTick > next.facilityTick ||
      operation.completedAtFacilityTick !== null && operation.completedAtFacilityTick > next.facilityTick) throw new Error("The saved Reading work clock is invalid.");
  }
  next.patientAmenityTrips = next.patientAmenityTrips.filter((trip) => {
    const operation = next.serviceOperations.find((candidate) =>
      trip.actorKind === "encounter"
        ? candidate.actorKind === "encounter" && candidate.actorId === trip.actorId && candidate.status !== "completed" && candidate.status !== "cancelled"
        : candidate.actorKind === "visitor" && candidate.id === trip.actorId && candidate.status !== "completed" && candidate.status !== "cancelled",
    );
    const actorLocation = trip.actorKind === "encounter"
      ? next.encounters[trip.actorId]?.patientLocation ?? null
      : operation?.location ?? null;
    const actorValid = trip.actorKind === "encounter"
      ? Boolean(next.encounters[trip.actorId] && (operation || ["waiting_unopened", "active_action_required", "active_pending_result"].includes(next.encounters[trip.actorId]!.lifecycle)))
      : Boolean(operation);
    if (!actorLocation || !actorValid) return false;
    if (operation) {
      const phase = operation.frozenOperationPhases?.[operation.phaseIndex];
      if (!(trip.purpose === "departure" && trip.linkedServiceOperationId === operation.id && operation.periopBedFlowVersion === 1 &&
        !operation.periopBedReservation && operation.status === "discharging" && operation.departureItinerary?.status === "bathroom") &&
        !(operation.status === "waiting_for_resources" ||
        (operation.periopBedFlowVersion === 1 && operation.phaseIndex === 0 &&
          ((operation.status === "in_service" && phase?.roomStationId === "periop_preparation") || operation.status === "waiting_for_next_phase")))) return false;
    }
    const cardinal = trip.path.every((point, index) => index === 0 ||
      Math.abs(point.x - trip.path[index - 1]!.x) + Math.abs(point.y - trip.path[index - 1]!.y) === 1);
    if (!cardinal) return false;
    const cursorPoint = trip.path[Math.floor(trip.pathIndex)];
    if (!cursorPoint || cursorPoint.x !== actorLocation.x || cursorPoint.y !== actorLocation.y) return false;
    const bathroom = next.rooms.find((room) => room.id === trip.bathroomRoomInstanceId);
    const bathroomDefinition = bathroom ? getRoomDefinition(bathroom.roomDefinitionId, context) : null;
    if ((!bathroom || !bathroomDefinition) && trip.status !== "returning") return false;
    const bathroomTarget = bathroom && bathroomDefinition ? getRoomNavigationAnchor(bathroom, bathroomDefinition) : null;
    const expectedTarget = trip.status === "returning" ? trip.returnTarget : bathroomTarget;
    if (!expectedTarget) return false;
    const savedTarget = trip.path.at(-1);
    if (!savedTarget || savedTarget.x !== expectedTarget.x || savedTarget.y !== expectedTarget.y) return false;
    const remainingPath = findDeterministicFacilityPath(actorLocation, expectedTarget, next.rooms, next.doors, (id) => getRoomDefinition(id, context));
    if (remainingPath.length === 0 && (actorLocation.x !== expectedTarget.x || actorLocation.y !== expectedTarget.y)) return false;
    const savedRemaining = trip.path.slice(Math.floor(trip.pathIndex));
    const routeMatches = remainingPath.length === savedRemaining.length && remainingPath.every((point, index) =>
      point.x === savedRemaining[index]?.x && point.y === savedRemaining[index]?.y,
    );
    if (trip.status !== "using_amenity" && remainingPath.length > 0 && !routeMatches) {
      trip.path = remainingPath.map((point) => ({ ...point }));
      trip.pathIndex = 0;
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
    if (candidate.readingStationId !== undefined && (candidate.staffRoleDefinitionId !== "staff.radiologist" ||
      !DIAGNOSTIC_READING_WORKSTATIONS.some((station) => station.id === candidate.readingStationId))) {
      throw new Error("The saved reading workstation is invalid.");
    }
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
    const supportEffectKind = rawFacilityTask?.kind === "clean_room" || rawFacilityTask?.kind === "collect_litter"
      ? "cleaning_duration_reduction_percent" as const : rawFacilityTask?.kind === "repair_room"
        ? "repair_duration_reduction_percent" as const : rawFacilityTask?.kind === "review_ambulatory_qi"
          ? "quality_review_duration_reduction_percent" as const : null;
    if (rawFacilityTask?.roomUpgradeWork !== undefined && !supportEffectKind) throw new Error("The saved room upgrade support task is invalid.");
    const roomUpgradeWork = supportEffectKind ? normalizeRoomUpgradeSupportWork(rawFacilityTask?.roomUpgradeWork, supportEffectKind) : undefined;
    if (rawFacilityTask?.roomUpgradeBreakBenefit !== undefined && rawFacilityTask.kind !== "take_break") throw new Error("The saved room upgrade break benefit is invalid.");
    const roomUpgradeBreakBenefit = normalizeRoomUpgradeBreakBenefit(rawFacilityTask?.roomUpgradeBreakBenefit, rawFacilityTask?.targetId);
    if ((roomUpgradeWork || roomUpgradeBreakBenefit) && (!rawFacilityTask ||
      typeof rawFacilityTask.startedAtFacilityTick !== "number" || !Number.isSafeInteger(rawFacilityTask.startedAtFacilityTick) ||
      rawFacilityTask.startedAtFacilityTick < 0 || rawFacilityTask.startedAtFacilityTick > next.facilityTick ||
      typeof rawFacilityTask.targetId !== "string" ||
      (roomUpgradeWork ? roomUpgradeWork.durationMinutes === null || !isRoomUpgradeSupportRemaining(roomUpgradeWork, rawFacilityTask.workMinutesRemaining) :
        typeof rawFacilityTask.workMinutesRemaining !== "number" || !Number.isSafeInteger(rawFacilityTask.workMinutesRemaining) || rawFacilityTask.workMinutesRemaining <= 0) ||
      (roomUpgradeWork?.effectKind === "cleaning_duration_reduction_percent" && candidate.staffRoleDefinitionId !== "staff.evs_worker") ||
      (roomUpgradeWork?.effectKind === "repair_duration_reduction_percent" && candidate.staffRoleDefinitionId !== "staff.repair_person") ||
      (roomUpgradeWork?.effectKind === "quality_review_duration_reduction_percent" && candidate.staffRoleDefinitionId !== "staff.surgeon") ||
      (roomUpgradeWork && rawFacilityTask.kind === "clean_room" &&
        (typeof rawFacilityTask.cleanlinessRestore !== "number" || !Number.isFinite(rawFacilityTask.cleanlinessRestore) || rawFacilityTask.cleanlinessRestore < 0)))) {
      throw new Error("The saved room upgrade support task is invalid.");
    }
    const facilityTask =
      (rawFacilityTask?.kind === "refill_water" ||
        rawFacilityTask?.kind === "collect_litter" ||
        rawFacilityTask?.kind === "clean_room" ||
        rawFacilityTask?.kind === "perform_imaging" ||
        rawFacilityTask?.kind === "perform_service" ||
        rawFacilityTask?.kind === "cover_periop" ||
        rawFacilityTask?.kind === "participate_qi_discussion" ||
        rawFacilityTask?.kind === "take_break" ||
        rawFacilityTask?.kind === "repair_room" ||
        rawFacilityTask?.kind === "review_ambulatory_qi") &&
      typeof rawFacilityTask.startedAtFacilityTick === "number" &&
      Number.isSafeInteger(rawFacilityTask.startedAtFacilityTick) &&
      rawFacilityTask.startedAtFacilityTick >= 0 &&
      typeof rawFacilityTask.workMinutesRemaining === "number" &&
      (roomUpgradeWork ? isRoomUpgradeSupportRemaining(roomUpgradeWork, rawFacilityTask.workMinutesRemaining) : Number.isSafeInteger(rawFacilityTask.workMinutesRemaining)) &&
      rawFacilityTask.workMinutesRemaining > 0
        ? {
            kind: rawFacilityTask.kind as NonNullable<EmployeeState["facilityTask"]>["kind"],
            startedAtFacilityTick:
              rawFacilityTask.startedAtFacilityTick,
            workMinutesRemaining:
              rawFacilityTask.workMinutesRemaining,
            ...(roomUpgradeWork ? { roomUpgradeWork } : {}),
            ...(roomUpgradeBreakBenefit ? { roomUpgradeBreakBenefit } : {}),
            ...(rawFacilityTask.kind === "clean_room" && typeof rawFacilityTask.cleanlinessRestore === "number" &&
              Number.isFinite(rawFacilityTask.cleanlinessRestore) && rawFacilityTask.cleanlinessRestore >= 0
              ? { cleanlinessRestore: rawFacilityTask.cleanlinessRestore } : {}),
            ...(typeof rawFacilityTask.targetId === "string" ? { targetId: rawFacilityTask.targetId } : {}),
            ...((rawFacilityTask.seatId === "massage" || rawFacilityTask.seatId === "largeNorth" || rawFacilityTask.seatId === "largeSouth" || rawFacilityTask.seatId === "largeWest" || rawFacilityTask.seatId === "largeEast" || rawFacilityTask.seatId === "smallNorth" || rawFacilityTask.seatId === "smallSouth") ? { seatId: rawFacilityTask.seatId as NonNullable<EmployeeState["facilityTask"]>["seatId"] } : {}),
          }
        : null;
    const normalizedAppearance = isPixelAppearance(candidate.appearance)
      ? normalizePixelAppearance(candidate.appearance, roleStyleForStaffDefinition(candidate.staffRoleDefinitionId))
      : createPixelAppearance(campaignSeed, "staff", candidate.id, roleStyleForStaffDefinition(candidate.staffRoleDefinitionId));
    const employeeStillId = selectStaffStillId(campaignSeed, candidate.id, candidate.staffRoleDefinitionId, normalizedAppearance.stillId);
    const employee: EmployeeState = {
      id: candidate.id,
      staffRoleDefinitionId: candidate.staffRoleDefinitionId,
      displayName:
        typeof candidate.displayName === "string"
          ? candidate.displayName
          : `Clinic employee ${index + 1}`,
      appearance: { ...normalizedAppearance, ...(employeeStillId ? { stillId: employeeStillId } : {}) },
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
      ...(typeof candidate.readingStationId === "string" ? { readingStationId: candidate.readingStationId } : {}),
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
      lastBreakAtFacilityTick:
        typeof candidate.lastBreakAtFacilityTick === "number" &&
        Number.isSafeInteger(candidate.lastBreakAtFacilityTick)
          ? candidate.lastBreakAtFacilityTick
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
    if (candidate.training !== undefined) employee.training = normalizeEmployeeTraining(candidate.training, employee, next.facilityTick);
    return [employee];
  });
  if (parsed.employeeTrainingSequence !== undefined || next.employees.some((employee) => employee.training)) {
    next.employeeTrainingSequence = Math.max(
      typeof parsed.employeeTrainingSequence === "number" && Number.isSafeInteger(parsed.employeeTrainingSequence) && parsed.employeeTrainingSequence >= 0
        ? parsed.employeeTrainingSequence : 0,
      ...next.employees.map((employee) => (employee.training?.requestSequence ?? -1) + 1),
    );
  } else {
    delete next.employeeTrainingSequence;
  }
  next.levelThreeQiReviews = Array.isArray(parsed.levelThreeQiReviews)
    ? parsed.levelThreeQiReviews.flatMap((candidate) => {
        if (!isRecord(candidate) || typeof candidate.id !== "string" || typeof candidate.receiptId !== "string" ||
            (candidate.status !== "queued" && candidate.status !== "in_progress" && candidate.status !== "completed")) {
          if (isRecord(candidate) && candidate.roomUpgradeWork !== undefined) throw new Error("The saved room upgrade QI work is invalid.");
          return [];
        }
        const surgeonEmployeeId = typeof candidate.surgeonEmployeeId === "string" &&
          next.employees.some((employee) => employee.id === candidate.surgeonEmployeeId && employee.staffRoleDefinitionId === "staff.surgeon")
          ? candidate.surgeonEmployeeId : null;
        const status = candidate.status === "in_progress" && surgeonEmployeeId === null ? "queued" : candidate.status;
        const work = isRecord(candidate.trainingWork) ? candidate.trainingWork : null;
        const roomUpgradeWork = normalizeRoomUpgradeSupportWork(candidate.roomUpgradeWork, "quality_review_duration_reduction_percent");
        if (roomUpgradeWork && (!work ||
          work.durationMinutes !== (roomUpgradeWork.durationMinutes ?? getUnboundRoomUpgradeSupportMinutes(roomUpgradeWork)) ||
          !isRoomUpgradeSupportRemaining(roomUpgradeWork, work.remainingMinutes, true) ||
          (roomUpgradeWork.durationMinutes === null && (candidate.status !== "queued" || work.remainingMinutes !== work.durationMinutes)))) {
          throw new Error("The saved room upgrade QI work is invalid.");
        }
        if (candidate.trainingWork !== undefined && (!work || work.version !== "employee-training-work.v1" ||
          typeof work.durationMinutes !== "number" || !(roomUpgradeWork ? Number.isFinite(work.durationMinutes) : Number.isSafeInteger(work.durationMinutes)) || work.durationMinutes < 1 ||
          typeof work.remainingMinutes !== "number" || !(roomUpgradeWork ? Number.isFinite(work.remainingMinutes) : Number.isSafeInteger(work.remainingMinutes)) || work.remainingMinutes < 0 || work.remainingMinutes > work.durationMinutes ||
          (candidate.status === "completed" ? work.remainingMinutes !== 0 : work.remainingMinutes === 0))) throw new Error("The saved QI training work is invalid.");
        return [{
          id: candidate.id,
          receiptId: candidate.receiptId,
          status,
          surgeonEmployeeId: status === "queued" ? null : surgeonEmployeeId,
          enqueuedAtFacilityTick: typeof candidate.enqueuedAtFacilityTick === "number" && Number.isSafeInteger(candidate.enqueuedAtFacilityTick) ? candidate.enqueuedAtFacilityTick : next.facilityTick,
          startedAtFacilityTick: status !== "queued" && typeof candidate.startedAtFacilityTick === "number" && Number.isSafeInteger(candidate.startedAtFacilityTick) ? candidate.startedAtFacilityTick : null,
          completedAtFacilityTick: status === "completed" && typeof candidate.completedAtFacilityTick === "number" && Number.isSafeInteger(candidate.completedAtFacilityTick) ? candidate.completedAtFacilityTick : null,
          ...(work ? { trainingWork: { version: "employee-training-work.v1" as const, durationMinutes: work.durationMinutes as number, remainingMinutes: work.remainingMinutes as number } } : {}),
          ...(roomUpgradeWork ? { roomUpgradeWork } : {}),
        }];
      })
    : [];
  next.levelThreeMaintenanceAppliedUseKeys = Array.isArray(parsed.levelThreeMaintenanceAppliedUseKeys)
    ? [...new Set(parsed.levelThreeMaintenanceAppliedUseKeys.filter((key): key is string => typeof key === "string"))]
    : [...new Set(next.rooms.flatMap((room) => room.maintenance?.appliedUseKeys ?? []))];
  const highestLevelThreeQiReviewSequence = next.levelThreeQiReviews.reduce((highest, review) => {
    const match = /^level-three-qi\.(\d+)$/.exec(review.id);
    return match ? Math.max(highest, Number.parseInt(match[1]!, 10) + 1) : highest;
  }, 0);
  next.levelThreeQiReviewSequence = Math.max(
    highestLevelThreeQiReviewSequence,
    typeof parsed.levelThreeQiReviewSequence === "number" && Number.isSafeInteger(parsed.levelThreeQiReviewSequence) && parsed.levelThreeQiReviewSequence >= 0
      ? parsed.levelThreeQiReviewSequence : 0,
  );
  for (const employee of next.employees) {
    const task = employee.facilityTask;
    if (!task) continue;
    if (task.kind === "take_break" && (!task.targetId || !task.seatId ||
        next.rooms.find((room) => room.id === task.targetId)?.roomDefinitionId !== "room.staff_break")) {
      employee.facilityTask = null;
    } else if (task.kind === "repair_room" && (!task.targetId || employee.staffRoleDefinitionId !== "staff.repair_person" ||
        !next.rooms.find((room) => room.id === task.targetId)?.maintenance ||
        next.rooms.find((room) => room.id === task.targetId)?.maintenance?.status === "operational")) {
      employee.facilityTask = null;
    } else if (task.kind === "review_ambulatory_qi") {
      const review = task.targetId ? next.levelThreeQiReviews.find((candidate) => candidate.id === task.targetId) : null;
      if (review && (task.roomUpgradeWork || review.roomUpgradeWork) &&
        (!task.roomUpgradeWork || !review.roomUpgradeWork ||
          JSON.stringify(task.roomUpgradeWork) !== JSON.stringify(review.roomUpgradeWork) ||
          task.workMinutesRemaining !== review.trainingWork?.remainingMinutes)) throw new Error("The saved room upgrade QI assignment is invalid.");
      if (!review || review.status !== "in_progress" || review.surgeonEmployeeId !== employee.id) employee.facilityTask = null;
    }
  }
  const claimedBreakSeats = new Set<string>();
  for (const employee of [...next.employees].sort((left, right) => left.id.localeCompare(right.id))) {
    const task = employee.facilityTask;
    if (task?.kind !== "take_break" || !task.targetId || !task.seatId) continue;
    const claim = `${task.targetId}:${task.seatId}`;
    if (claimedBreakSeats.has(claim)) employee.facilityTask = null;
    else claimedBreakSeats.add(claim);
  }
  for (const review of next.levelThreeQiReviews) {
    if (review.status !== "in_progress") continue;
    const surgeon = review.surgeonEmployeeId ? next.employees.find((employee) => employee.id === review.surgeonEmployeeId) : null;
    const office = surgeon?.homeRoomInstanceId ? next.rooms.find((room) => room.id === surgeon.homeRoomInstanceId) : null;
    const matchingTask = surgeon?.facilityTask?.kind === "review_ambulatory_qi" && surgeon.facilityTask.targetId === review.id;
    if (surgeon?.staffRoleDefinitionId === "staff.surgeon" && office?.roomDefinitionId === "room.surgeon_office" &&
        matchingTask && isRoomOperationalForFacilityWork(next, office.id, context)) continue;
    if (surgeon?.facilityTask?.kind === "review_ambulatory_qi" && surgeon.facilityTask.targetId === review.id) surgeon.facilityTask = null;
    review.status = "queued";
    review.surgeonEmployeeId = null;
    review.startedAtFacilityTick = null;
  }
  const rawEmployeeDiscussions = isRecord(parsed.employeeDiscussions)
    ? parsed.employeeDiscussions
    : {};
  next.employeeDiscussions = Object.fromEntries(
    Object.entries(rawEmployeeDiscussions).flatMap(
      ([discussionId, candidate]) => {
        const normalized = isRecord(candidate)
          ? normalizeEmployeeDiscussion(
              discussionId,
              candidate,
              next.employees,
              next.facilityTick,
            )
          : null;
        return normalized ? [[discussionId, normalized]] : [];
      },
    ),
  );
  const highestEmployeeDiscussionSequence = Object.keys(
    next.employeeDiscussions,
  ).reduce((highest, discussionId) => {
    const match = /^discussion\.employee\.(\d+)$/.exec(discussionId);
    return match
      ? Math.max(highest, Number.parseInt(match[1]!, 10) + 1)
      : highest;
  }, 0);
  next.employeeDiscussionSequence = Math.max(
    highestEmployeeDiscussionSequence,
    typeof parsed.employeeDiscussionSequence === "number" &&
      Number.isSafeInteger(parsed.employeeDiscussionSequence) &&
      parsed.employeeDiscussionSequence >= 0
      ? parsed.employeeDiscussionSequence
      : 0,
  );
  next.nextEmployeeDiscussionTick =
    typeof parsed.nextEmployeeDiscussionTick === "number" &&
    Number.isSafeInteger(parsed.nextEmployeeDiscussionTick) &&
    parsed.nextEmployeeDiscussionTick >= 0
      ? parsed.nextEmployeeDiscussionTick
      : next.facilityTick + EMPLOYEE_DISCUSSION_FIRST_DELAY_MINUTES;
  next.openEmployeeDiscussionId =
    typeof parsed.openEmployeeDiscussionId === "string" &&
    next.employeeDiscussions[parsed.openEmployeeDiscussionId] &&
    next.employeeDiscussions[parsed.openEmployeeDiscussionId]!.lifecycle !==
      "cancelled" &&
    next.employeeDiscussions[parsed.openEmployeeDiscussionId]!.lifecycle !==
      "resolved"
      ? parsed.openEmployeeDiscussionId
      : null;
  for (const employee of next.employees) {
    if (
      employee.facilityTask?.kind === "participate_qi_discussion" &&
      (!employee.facilityTask.targetId ||
        !next.employeeDiscussions[employee.facilityTask.targetId] ||
        next.employeeDiscussions[employee.facilityTask.targetId]!.lifecycle ===
          "cancelled" ||
        next.employeeDiscussions[employee.facilityTask.targetId]!.lifecycle ===
          "resolved")
    ) {
      employee.facilityTask = null;
    }
  }
  const rawDepartingEmployees = Array.isArray(parsed.departingEmployees)
    ? parsed.departingEmployees
    : [];
  next.departingEmployees = rawDepartingEmployees.flatMap((candidate, index) => {
    if (!isRecord(candidate) || typeof candidate.id !== "string" ||
      typeof candidate.staffRoleDefinitionId !== "string" ||
      !isGridPoint(candidate.location) || !Array.isArray(candidate.path)) return [];
    const path = candidate.path.filter(isGridPoint).map((point) => ({ ...point }));
    if (path.length === 0) return [];
    const pathIndex = typeof candidate.pathIndex === "number" && Number.isSafeInteger(candidate.pathIndex)
      ? Math.max(0, Math.min(path.length - 1, candidate.pathIndex))
      : 0;
    const role = getStaffRoleDefinition(candidate.staffRoleDefinitionId, context);
    const normalizedAppearance = isPixelAppearance(candidate.appearance)
      ? normalizePixelAppearance(candidate.appearance, roleStyleForStaffDefinition(candidate.staffRoleDefinitionId))
      : createPixelAppearance(campaignSeed, "staff", candidate.id, roleStyleForStaffDefinition(candidate.staffRoleDefinitionId));
    return [{
      id: candidate.id,
      staffRoleDefinitionId: candidate.staffRoleDefinitionId,
      displayName: typeof candidate.displayName === "string" ? candidate.displayName : `Departing employee ${index + 1}`,
      appearance: normalizedAppearance,
      hiredAtFacilityTick: typeof candidate.hiredAtFacilityTick === "number" && Number.isSafeInteger(candidate.hiredAtFacilityTick)
        ? candidate.hiredAtFacilityTick : 0,
      salaryPerExpenseInterval: 0,
      morale: typeof candidate.morale === "number" ? candidate.morale : role?.baseMorale ?? 50,
      trainingLevel: candidate.trainingLevel === 2 || candidate.trainingLevel === 3 || candidate.trainingLevel === 4 || candidate.trainingLevel === 5
        ? candidate.trainingLevel : 1,
      homeRoomInstanceId: null,
      location: { ...path[pathIndex]! },
      path,
      pathIndex,
      lastMovedAtFacilityTick: typeof candidate.lastMovedAtFacilityTick === "number" && Number.isSafeInteger(candidate.lastMovedAtFacilityTick)
        ? candidate.lastMovedAtFacilityTick : next.facilityTick,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
      facilityTask: null,
      dismissedAtFacilityTick: typeof candidate.dismissedAtFacilityTick === "number" && Number.isSafeInteger(candidate.dismissedAtFacilityTick)
        ? candidate.dismissedAtFacilityTick : next.facilityTick,
    }];
  });
  // Reserve the deterministic keeper for every saved identity before trying
  // to repair any collision. This prevents an early repair from taking the
  // still belonging to a later employee that was already unique, and retains
  // the earliest saved member of each duplicate group.
  const employeesByStableOrder = [...next.employees].sort((left, right) =>
    left.hiredAtFacilityTick - right.hiredAtFacilityTick || left.id.localeCompare(right.id),
  );
  const occupiedStillIds = new Set<string>();
  const retainedStillIds = new Set<string>();
  for (const employee of employeesByStableOrder) {
    const stillId = employee.appearance.stillId;
    if (stillId && !retainedStillIds.has(stillId)) {
      retainedStillIds.add(stillId);
      occupiedStillIds.add(stillId);
    }
  }
  const seenStillIds = new Set<string>();
  for (const employee of employeesByStableOrder) {
    const stillId = employee.appearance.stillId;
    if (stillId && !seenStillIds.has(stillId)) {
      seenStillIds.add(stillId);
      continue;
    }
    const repaired = selectStaffStillId(
      campaignSeed,
      employee.id,
      employee.staffRoleDefinitionId,
      undefined,
      occupiedStillIds,
    );
    if (repaired) {
      employee.appearance = { ...employee.appearance, stillId: repaired };
      occupiedStillIds.add(repaired);
    }
  }
  reconcileEmployeeRoomSeats(next);
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
  const activeIdentifiedPhlebotomyResults = Object.values(next.encounters)
    .flatMap((encounter) => {
      const pending = encounter.pendingResult;
      const resourceActive = Boolean(
        pending && pending.phlebotomyArrivalGatedVersion === 1 && pending.deliveredAtTick === null &&
        (encounter.steps[pending.originatingNodeIndex]?.status === "feedback_pending" ||
          !(pending.timingPhases?.length) ||
          pending.timingPhases.some((phase) => phase.resourceBound && next.facilityTick < phase.endsAtTick)),
      );
      return resourceActive && pending ? [pending] : [];
    });
  const activePhlebotomyByOperationId = new Map(
    activeIdentifiedPhlebotomyResults.map((pending) => [pending.operationId, pending]),
  );
  for (const employee of next.employees) {
    if (employee.facilityTask?.kind !== "perform_service") continue;
    const targetId = employee.facilityTask.targetId;
    if (!targetId || next.serviceOperations.some((operation) =>
      operation.id === targetId && operation.status !== "completed" && operation.status !== "cancelled")) continue;
    const pending = activePhlebotomyByOperationId.get(targetId);
    const providerStillOwnsTask = Object.values(next.encounters).some((encounter) =>
      encounter.pendingResult?.operationId === targetId &&
      encounter.pendingResult.providerReservation?.kind === "employee" &&
      encounter.pendingResult.providerReservation.employeeId === employee.id,
    );
    if (!providerStillOwnsTask && pending?.phlebotomistId !== employee.id) employee.facilityTask = null;
  }
  for (const pending of activeIdentifiedPhlebotomyResults) {
    const employee = pending.phlebotomistId
      ? next.employees.find((candidate) => candidate.id === pending.phlebotomistId)
      : undefined;
    if (!employee || employee.staffRoleDefinitionId !== "staff.phlebotomist") {
      pending.phlebotomistId = null;
      continue;
    }
    if (!employee.facilityTask) {
      employee.facilityTask = {
        kind: "perform_service",
        startedAtFacilityTick: pending.scheduledAtTick,
        workMinutesRemaining: Number.MAX_SAFE_INTEGER,
        targetId: pending.operationId,
      };
    } else if (employee.facilityTask.kind !== "perform_service" || employee.facilityTask.targetId !== pending.operationId) {
      pending.phlebotomistId = null;
    }
  }
  const activePeriopCoverageRooms = new Set(next.serviceOperations.flatMap((operation) =>
    operation.status !== "completed" && operation.status !== "cancelled" && operation.periopBedReservation
      ? [operation.periopBedReservation.roomInstanceId]
      : [],
  ));
  const retainedPeriopCoverageRooms = new Set<string>();
  for (const employee of next.employees) {
    if (employee.facilityTask?.kind !== "cover_periop") continue;
    const roomId = employee.facilityTask.targetId;
    if (
      employee.staffRoleDefinitionId !== "staff.periop_nurse" ||
      !roomId ||
      !activePeriopCoverageRooms.has(roomId) ||
      retainedPeriopCoverageRooms.has(roomId)
    ) {
      employee.facilityTask = null;
      continue;
    }
    retainedPeriopCoverageRooms.add(roomId);
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
        rawFounderActivity.kind === "perform_service" ||
        rawFounderActivity.kind === "attend_employee_discussion") &&
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
            ...(rawFounderActivity.explicitSeat === true
              ? { explicitSeat: true }
              : {}),
          }
        : null,
    suspendedFounderActivity: (() => {
      const raw = rawEnvironment.suspendedFounderActivity;
      if (!isRecord(raw) ||
          (raw.kind !== "walk_to_point" && raw.kind !== "sit_in_chair") ||
          typeof raw.targetId !== "string" || !Array.isArray(raw.path)) return null;
      const path = raw.path.filter(isGridPoint).map((point) => ({ ...point }));
      if (path.length === 0 || (raw.kind === "sit_in_chair" && raw.explicitSeat !== true)) return null;
      return {
        kind: raw.kind,
        targetId: raw.targetId,
        path,
        pathIndex: Math.min(
          path.length - 1,
          typeof raw.pathIndex === "number" && Number.isSafeInteger(raw.pathIndex)
            ? Math.max(0, raw.pathIndex)
            : 0,
        ),
        lastMovedAtFacilityTick:
          typeof raw.lastMovedAtFacilityTick === "number" && Number.isSafeInteger(raw.lastMovedAtFacilityTick)
            ? raw.lastMovedAtFacilityTick
            : next.facilityTick,
        workMinutesRemaining:
          typeof raw.workMinutesRemaining === "number" && Number.isSafeInteger(raw.workMinutesRemaining)
            ? raw.workMinutesRemaining
            : context.balanceRelease.environment.founderInteractionMinutes,
        ...(raw.explicitSeat === true ? { explicitSeat: true } : {}),
      };
    })(),
    pendingFounderConsult: (() => {
      const raw = rawEnvironment.pendingFounderConsult;
      if (!isRecord(raw) ||
          (raw.kind !== "encounter" && raw.kind !== "employee_discussion") ||
          typeof raw.targetId !== "string" || typeof raw.nodeId !== "string") return null;
      if (raw.kind === "encounter") {
        const encounter = next.encounters[raw.targetId];
        return next.openChartEncounterId === raw.targetId &&
          encounter?.lifecycle === "active_action_required" &&
          encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]?.id === raw.nodeId
          ? { kind: raw.kind, targetId: raw.targetId, nodeId: raw.nodeId }
          : null;
      }
      const discussion = next.employeeDiscussions?.[raw.targetId];
      return next.openEmployeeDiscussionId === raw.targetId &&
        (discussion?.lifecycle === "active_action_required" || discussion?.lifecycle === "active_traveling") &&
        discussion.frozenCase.decisionNodes[discussion.currentNodeIndex]?.id === raw.nodeId
        ? { kind: raw.kind, targetId: raw.targetId, nodeId: raw.nodeId }
        : null;
    })(),
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
  const hydratedSuspendedFounderActivity =
    next.environment.suspendedFounderActivity;
  const hydratedPendingFounderConsult =
    next.environment.pendingFounderConsult;
  delete next.environment.suspendedFounderActivity;
  delete next.environment.pendingFounderConsult;
  if (Object.prototype.hasOwnProperty.call(rawEnvironment, "suspendedFounderActivity")) {
    next.environment.suspendedFounderActivity =
      hydratedSuspendedFounderActivity ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(rawEnvironment, "pendingFounderConsult")) {
    next.environment.pendingFounderConsult =
      hydratedPendingFounderConsult ?? null;
  }
  const founderDiscussionId =
    next.environment.founderActivity?.kind ===
    "attend_employee_discussion"
      ? next.environment.founderActivity.targetId
      : null;
  for (const discussion of Object.values(next.employeeDiscussions ?? {})) {
    const active =
      discussion.lifecycle === "active_traveling" ||
      discussion.lifecycle === "active_action_required" ||
      discussion.lifecycle === "feedback_pending" ||
      discussion.lifecycle === "resolved_summary_available";
    const employeeAvailable = next.employees.some(
      (candidate) => candidate.id === discussion.employeeId,
    );
    if (!active || employeeAvailable || founderDiscussionId === discussion.id) continue;
    discussion.lifecycle = "cancelled";
    discussion.cancellationReason = "employee_unavailable";
    discussion.resolvedAtFacilityTick = next.facilityTick;
    if (next.openEmployeeDiscussionId === discussion.id) {
      next.openEmployeeDiscussionId = null;
    }
    const employee = next.employees.find(
      (candidate) => candidate.id === discussion.employeeId,
    );
    if (
      employee?.facilityTask?.kind === "participate_qi_discussion" &&
      employee.facilityTask.targetId === discussion.id
    ) {
      employee.facilityTask = null;
    }
  }
  if (next.environment.suspendedFounderActivity &&
      next.environment.founderActivity?.kind !== "attend_encounter" &&
      next.environment.founderActivity?.kind !== "attend_employee_discussion") {
    next.environment.suspendedFounderActivity = null;
  }
  normalizeGlp1AutomationState(next, rawEnvironment, context);
  if (next.environment.founderActivity?.kind === "visit_bathroom") {
    const endpoint = next.environment.founderActivity.path.at(-1);
    const occupiedRoomId = endpoint ? next.rooms.find((room) => {
      if (room.roomDefinitionId !== "room.bathroom") return false;
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      const target = definition ? getRoomNavigationAnchor(room, definition) : null;
      return target?.x === endpoint.x && target.y === endpoint.y;
    })?.id : undefined;
    if (occupiedRoomId) {
      next.patientAmenityTrips = next.patientAmenityTrips?.filter((trip) => trip.bathroomRoomInstanceId !== occupiedRoomId);
    }
  }
  for (const operation of next.serviceOperations) {
    const itinerary = operation.departureItinerary;
    if (!itinerary) continue;
    const actorMatches = operation.actorKind === "visitor" ||
      (operation.actorKind === "encounter" && next.encounters[operation.actorId]?.lifecycle === "resolved");
    const terminalItinerary = itinerary.status === "completed" || itinerary.status === "skipped";
    const baseValid = operation.periopBedFlowVersion === 1 &&
      (operation.status === "discharging" || (terminalItinerary && (operation.status === "leaving" || operation.status === "completed"))) &&
      !operation.periopBedReservation && actorMatches;
    const linkedValid = itinerary.status === "bathroom"
      ? next.patientAmenityTrips?.some((trip) => trip.id === itinerary.linkedTripId && trip.purpose === "departure" &&
          trip.linkedServiceOperationId === operation.id &&
          (operation.actorKind === "encounter" ? trip.actorKind === "encounter" && trip.actorId === operation.actorId : trip.actorKind === "service_visitor" && trip.actorId === operation.id)) === true
      : itinerary.status === "retail"
        ? next.retailOperations.some((trip) => trip.id === itinerary.linkedTripId && trip.departureServiceOperationId === operation.id &&
            (operation.actorKind === "encounter" ? trip.actorKind === "encounter" && trip.actorId === operation.actorId : trip.actorKind === "service_visitor" && trip.actorId === operation.id))
        : true;
    if (!baseValid || !linkedValid) {
      operation.departureItinerary = {
        version: "service-departure-itinerary.v1", status: "skipped", choiceKind: "none",
        selectedAtFacilityTick: itinerary.selectedAtFacilityTick ?? next.facilityTick,
        completedAtFacilityTick: next.facilityTick, linkedTripId: null, retailIncomeLineId: null,
      };
    }
  }
  next.patientAmenityTrips = next.patientAmenityTrips?.filter((trip) => !trip.linkedServiceOperationId ||
    next.serviceOperations.some((operation) => operation.id === trip.linkedServiceOperationId && operation.departureItinerary?.status === "bathroom" && operation.departureItinerary.linkedTripId === trip.id));
  next.retailOperations = next.retailOperations.filter((trip) => !trip.departureServiceOperationId ||
    next.serviceOperations.some((operation) => operation.id === trip.departureServiceOperationId && operation.departureItinerary?.status === "retail" && operation.departureItinerary.linkedTripId === trip.id));
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

function normalizeGlp1NursePractitionerHomes(
  next: GameState,
  context: DomainContext,
): void {
  const suites = next.rooms
    .filter((room) => room.roomDefinitionId === "room.glp1_telehealth_suite")
    .sort((left, right) => left.id.localeCompare(right.id));
  if (suites.length === 0) return;
  const assignments = new Map(suites.map((suite) => [suite.id, 0]));
  const overflow: EmployeeState[] = [];
  for (const employee of next.employees
    .filter((candidate) => candidate.staffRoleDefinitionId === "staff.glp1_np")
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const currentCount = assignments.get(employee.homeRoomInstanceId ?? "") ?? 0;
    if (assignments.has(employee.homeRoomInstanceId ?? "") && currentCount < 2) {
      assignments.set(employee.homeRoomInstanceId!, currentCount + 1);
      continue;
    }
    overflow.push(employee);
  }
  for (const employee of overflow) {
    const availableSuite = suites.find(
      (suite) =>
        (assignments.get(suite.id) ?? 0) < 2 &&
        isRoomOperationalForFacilityWork(next, suite.id, context),
    );
    if (!availableSuite) continue;
    employee.homeRoomInstanceId = availableSuite.id;
    assignments.set(availableSuite.id, (assignments.get(availableSuite.id) ?? 0) + 1);
  }
}

function normalizeGlp1AutomationState(
  next: GameState,
  rawEnvironment: Record<string, unknown>,
  context: DomainContext,
): void {
  const operationalGlp1Assignments = getOperationalGlp1AutomationAssignments(next, context);
  const rawSlots = Array.isArray(rawEnvironment.glp1AutomationSlots)
    ? rawEnvironment.glp1AutomationSlots.filter(isRecord)
    : [];
  const normalizedSlotKeys = new Set<string>();
  next.environment.glp1AutomationSlots = rawSlots.flatMap((slot) => {
    const suspendedEmployee =
      typeof slot.employeeId === "string"
        ? next.employees.find(
            (employee) =>
              employee.id === slot.employeeId &&
              employee.staffRoleDefinitionId === "staff.glp1_np" &&
              employee.facilityTask?.kind ===
                "participate_qi_discussion" &&
              employee.homeRoomInstanceId === slot.suiteRoomInstanceId,
          )
        : undefined;
    if (
      typeof slot.suiteRoomInstanceId !== "string" ||
      typeof slot.employeeId !== "string" ||
      typeof slot.nextPayoutTick !== "number" ||
      !Number.isSafeInteger(slot.nextPayoutTick) ||
      slot.nextPayoutTick < 0 ||
      (!suspendedEmployee && !operationalGlp1Assignments.some(
        (assignment) =>
          assignment.suiteRoomInstanceId === slot.suiteRoomInstanceId &&
          assignment.employeeId === slot.employeeId,
      ))
    ) {
      return [];
    }
    const key = `${slot.suiteRoomInstanceId}:${slot.employeeId}`;
    if (normalizedSlotKeys.has(key)) return [];
    normalizedSlotKeys.add(key);
    if (slot.quotePayment !== undefined && (typeof slot.quotePayment !== "number" || !Number.isFinite(slot.quotePayment) || slot.quotePayment < 0)) {
      throw new Error("The saved GLP-1 interval payment is invalid.");
    }
    const roomUpgradeRevenue = normalizeRoomUpgradeRevenueQuote(slot.roomUpgradeRevenue, slot.quotePayment, ["room.glp1_telehealth_suite"]);
    if (roomUpgradeRevenue && roomUpgradeRevenue.boundRoom?.roomInstanceId !== slot.suiteRoomInstanceId) {
      throw new Error("The saved upgraded GLP-1 payment does not match its suite.");
    }
    return [{
      suiteRoomInstanceId: slot.suiteRoomInstanceId,
      employeeId: slot.employeeId,
      nextPayoutTick: slot.nextPayoutTick,
      ...(typeof slot.quotePayment === "number" ? { quotePayment: slot.quotePayment } : {}),
      ...(roomUpgradeRevenue ? { roomUpgradeRevenue } : {}),
    }];
  });
  const rawPayoutTicks = Array.isArray(rawEnvironment.glp1AutomationNextPayoutTicks)
    ? rawEnvironment.glp1AutomationNextPayoutTicks.filter(
        (tick): tick is number =>
          typeof tick === "number" && Number.isSafeInteger(tick) && tick > 0,
      )
    : [];
  const legacyPayoutTick =
    typeof rawEnvironment.glp1AutomationNextPayoutTick === "number" &&
    Number.isSafeInteger(rawEnvironment.glp1AutomationNextPayoutTick) &&
    rawEnvironment.glp1AutomationNextPayoutTick > next.facilityTick
      ? rawEnvironment.glp1AutomationNextPayoutTick
      : null;
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

function validateVersionEight(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(parsed, context);
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

function validateVersionNine(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  const state = migrateVersionTwo(parsed, context);
  if (parsed.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error("The saved campaign uses an incompatible randomness contract.");
  }
  return state;
}

function finishApprovedRoomMigration(
  parsed: Record<string, unknown>,
  state: GameState,
  context: DomainContext,
): GameState {
  const migrated = normalizeApprovedRoomOrientations(state, context);
  if (migrated.employees.some((employee) => isEmployeeAwayForTraining(employee) && employee.facilityTask)) {
    throw new Error("The saved employee has conflicting training and work assignments.");
  }
  reconcileEmployeeTrainingReservations(migrated);
  dedupeStaffDisplayNames(
    migrated.campaignSeed,
    migrated.employees,
    (migrated.departingEmployees ?? []).map((employee) => employee.displayName),
  );
  normalizeGlp1AutomationState(
    migrated,
    isRecord(parsed.environment) ? parsed.environment : {},
    context,
  );
  migrated.schemaVersion = 9;
  return migrated;
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
    return finishApprovedRoomMigration(parsed,
      migrateApprovedRoomGeometry(migrateVersionOne(parsed, context), context),
      context,
    );
  }
  if (parsed.schemaVersion === 2) {
    const scaled = scaleLegacyFacilityTicks(parsed) as Record<string, unknown>;
    return finishApprovedRoomMigration(scaled,
      migrateApprovedRoomGeometry(
        migrateVersionTwo(scaled, context),
        context,
      ),
      context,
    );
  }
  if (parsed.schemaVersion === 3) {
    return finishApprovedRoomMigration(parsed, migrateApprovedRoomGeometry(validateVersionThree(parsed, context), context), context);
  }
  if (parsed.schemaVersion === 4) {
    return finishApprovedRoomMigration(parsed, migrateApprovedRoomGeometry(validateVersionFour(parsed, context), context), context);
  }
  if (parsed.schemaVersion === 5) {
    return finishApprovedRoomMigration(parsed, migrateApprovedRoomGeometry(validateVersionFive(parsed, context), context), context);
  }
  if (parsed.schemaVersion === 6) {
    return finishApprovedRoomMigration(parsed, migrateApprovedRoomGeometry(validateVersionSix(parsed, context), context), context);
  }
  if (parsed.schemaVersion === 7) {
    return finishApprovedRoomMigration(parsed, migrateApprovedRoomGeometry(validateVersionSeven(parsed, context), context), context);
  }
  if (parsed.schemaVersion === 8) {
    return finishApprovedRoomMigration(parsed, validateVersionEight(parsed, context), context);
  }
  if (parsed.schemaVersion === 9) {
    return finishApprovedRoomMigration(parsed, validateVersionNine(parsed, context), context);
  }
  throw new Error("The saved game uses an unsupported schema version.");
}
