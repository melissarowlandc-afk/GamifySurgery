import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import {
  applyFsrsReview,
  createNewFsrsCard,
  schedulerPinsMatch,
} from "./fsrs-adapter";
import {
  createPixelAppearance,
  normalizePixelAppearance,
  roleStyleForStaffDefinition,
} from "./appearance";
import {
  RANDOMNESS_CONTRACT_VERSION,
  RANDOM_STREAMS,
  deterministicInteger,
} from "./randomness";
import { createInitialGameState } from "./reducer";
import { getRoomDefinition, getStaffRoleDefinition } from "./selectors";
import { getEmployeeHomeLocation } from "./staff";
import { getDefaultDoorOffset } from "./doors";
import type {
  AnswerRecord,
  ConceptLearningHistory,
  DomainContext,
  DoorState,
  EmergencyGlp1State,
  EncounterState,
  EncounterStepState,
  EmployeeState,
  FounderIdentity,
  GameState,
  FrozenPatientTravel,
  PendingResult,
  PatientMovementState,
  PlacedRoom,
  ReviewRatingIntent,
  TerminalFeedback,
} from "./types";

export function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
        value.headVariant <= 9)) &&
    (value.bodyVariant === undefined ||
      (typeof value.bodyVariant === "number" &&
        Number.isSafeInteger(value.bodyVariant) &&
        value.bodyVariant >= 0 &&
        value.bodyVariant <= 9)) &&
    (value.roleStyle === undefined ||
      value.roleStyle === "founder" ||
      value.roleStyle === "patient" ||
      value.roleStyle === "receptionist" ||
      value.roleStyle === "imaging_technician")
  );
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

function normalizePendingResult(candidate: unknown): PendingResult | null {
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
    patientTravel: normalizeFrozenPatientTravel(candidate.patientTravel),
  };
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
  const pendingResult = normalizePendingResult(candidate.pendingResult);
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
        ? normalizePendingResult(existingStep.result)
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

  return {
    ...(candidate as unknown as EncounterState),
    frozenCase:
      frozenCase as unknown as EncounterState["frozenCase"],
    patientAppearance:
      isPixelAppearance(candidate.patientAppearance)
        ? normalizePixelAppearance(
            candidate.patientAppearance,
            "patient",
          )
        : createPixelAppearance(campaignSeed, "patient", encounterId),
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

function migrateVersionTwo(
  parsed: Record<string, unknown>,
  context: DomainContext,
): GameState {
  validatePins(parsed, context);
  if (
    typeof parsed.campaignId !== "string" ||
    typeof parsed.campaignSeed !== "string" ||
    (parsed.facilityLevel !== 0 && parsed.facilityLevel !== 1) ||
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
  const next: GameState = {
    ...baseline,
    ...(parsed as unknown as GameState),
    schemaVersion: 5 as const,
    randomGeneratorVersion: RANDOMNESS_CONTRACT_VERSION,
    founder: normalizeFounder(parsed.founder, campaignSeed),
    facilityTick: parsedFacilityTick,
    simulationSpeed:
      parsed.simulationSpeed === 2 || parsed.simulationSpeed === 4
        ? parsed.simulationSpeed
        : 1,
    cashCents: parsedCashCents,
    cash: parsedCashCents / 100,
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
      location: isGridPoint(candidate.location)
        ? { ...candidate.location }
        : home.location,
      path,
      pathIndex:
        typeof candidate.pathIndex === "number" &&
        Number.isSafeInteger(candidate.pathIndex)
          ? candidate.pathIndex
          : 0,
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
    };
    return [employee];
  });
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
  const rawFounderActivity = isRecord(
    rawEnvironment.founderActivity,
  )
    ? rawEnvironment.founderActivity
    : null;
  next.environment = {
    founderLocation: isGridPoint(rawEnvironment.founderLocation)
      ? { ...rawEnvironment.founderLocation }
      : { ...baseline.environment.founderLocation },
    founderActivity:
      rawFounderActivity &&
      (rawFounderActivity.kind === "collect_litter" ||
        rawFounderActivity.kind === "refill_water" ||
        rawFounderActivity.kind === "praise_employee") &&
      typeof rawFounderActivity.targetId === "string" &&
      Array.isArray(rawFounderActivity.path)
        ? {
            kind: rawFounderActivity.kind,
            targetId: rawFounderActivity.targetId,
            path: rawFounderActivity.path
              .filter(isGridPoint)
              .map((point) => ({ ...point })),
            pathIndex:
              typeof rawFounderActivity.pathIndex === "number" &&
              Number.isSafeInteger(rawFounderActivity.pathIndex)
                ? rawFounderActivity.pathIndex
                : 0,
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
    nextLitterSpawnTick:
      typeof rawEnvironment.nextLitterSpawnTick === "number" &&
      Number.isSafeInteger(rawEnvironment.nextLitterSpawnTick) &&
      rawEnvironment.nextLitterSpawnTick > next.facilityTick
        ? rawEnvironment.nextLitterSpawnTick
        : next.facilityTick +
          context.balanceRelease.environment
            .litterSpawnMinimumMinutes,
    waterCoolerFillPercent:
      typeof rawEnvironment.waterCoolerFillPercent === "number" &&
      Number.isFinite(rawEnvironment.waterCoolerFillPercent)
        ? Math.max(
            0,
            Math.min(100, rawEnvironment.waterCoolerFillPercent),
          )
        : 100,
    nextWaterCoolerDrainTick:
      typeof rawEnvironment.nextWaterCoolerDrainTick === "number" &&
      Number.isSafeInteger(rawEnvironment.nextWaterCoolerDrainTick) &&
      rawEnvironment.nextWaterCoolerDrainTick > next.facilityTick
        ? rawEnvironment.nextWaterCoolerDrainTick
        : next.facilityTick +
          context.balanceRelease.environment
            .waterCoolerDrainIntervalMinutes,
  };
  if (
    next.openChartEncounterId &&
    next.encounters[next.openChartEncounterId]
  ) {
    next.encounters[next.openChartEncounterId]!.idleWaitingSinceTick = null;
    next.encounters[next.openChartEncounterId]!.lastSatisfactionDecayAtTick =
      next.facilityTick;
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
  throw new Error("The saved game uses an unsupported schema version.");
}
