import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import {
  applyFsrsReview,
  createNewFsrsCard,
  schedulerPinsMatch,
} from "./fsrs-adapter";
import { createPixelAppearance } from "./appearance";
import { RANDOMNESS_CONTRACT_VERSION } from "./randomness";
import { createInitialGameState } from "./reducer";
import { getRoomDefinition, getStaffRoleDefinition } from "./selectors";
import { getEmployeeHomeLocation } from "./staff";
import type {
  AnswerRecord,
  ConceptLearningHistory,
  DomainContext,
  EmergencyGlp1State,
  EncounterState,
  EmployeeState,
  GameState,
  FrozenPatientTravel,
  PendingResult,
  PlacedRoom,
  ReviewRatingIntent,
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
    satisfaction:
      typeof parsed.satisfaction === "number" &&
      Number.isFinite(parsed.satisfaction)
        ? parsed.satisfaction
        : baseline.satisfaction,
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
    versionTwoLike as unknown as Record<string, unknown>,
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

function normalizeEmergencyGlp1State(
  candidate: unknown,
  state: GameState,
  context: DomainContext,
): EmergencyGlp1State {
  const raw = isRecord(candidate) ? candidate : {};
  const clock = context.balanceRelease.clock;
  const operatingTicksPerDay =
    (clock.dayEndHour - clock.dayStartHour) / clock.facilityHoursPerTick;
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
      ? Math.min(
          raw.usesToday,
          context.balanceRelease.emergencyGlp1.dailyUseCap,
        )
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
      },
    ];
  });
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
    patientTravel: normalizeFrozenPatientTravel(candidate.patientTravel),
  };
}

function normalizeEncounter(
  encounterId: string,
  candidate: Record<string, unknown>,
  campaignSeed: string,
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
  const lifecycle = candidate.lifecycle as EncounterState["lifecycle"];
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
    const status =
      existingStatus === "locked" ||
      existingStatus === "action_required" ||
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
      isRecord(candidate.patientAppearance) &&
      candidate.patientAppearance.version === "pixel-avatar.v1"
        ? (candidate.patientAppearance as unknown as EncounterState["patientAppearance"])
        : createPixelAppearance(campaignSeed, "patient", encounterId),
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
  const next: GameState = {
    ...baseline,
    ...(parsed as unknown as GameState),
    schemaVersion: 3 as const,
    randomGeneratorVersion: RANDOMNESS_CONTRACT_VERSION,
  };
  next.rooms = normalizeRooms(parsed, baseline, context);

  const rawEncounters = parsed.encounters as Record<string, unknown>;
  next.encounters = Object.fromEntries(
    Object.entries(rawEncounters).flatMap(([encounterId, encounter]) => {
      const normalized = isRecord(encounter)
        ? normalizeEncounter(encounterId, encounter, campaignSeed)
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
        isRecord(candidate.appearance) &&
        candidate.appearance.version === "pixel-avatar.v1"
          ? (candidate.appearance as unknown as EmployeeState["appearance"])
          : createPixelAppearance(campaignSeed, "staff", candidate.id),
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
    };
    return [employee];
  });
  next.emergencyGlp1 = normalizeEmergencyGlp1State(
    parsed.emergencyGlp1,
    next,
    context,
  );
  return next;
}

function validateVersionThree(
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
    return migrateVersionTwo(parsed, context);
  }
  if (parsed.schemaVersion === 3) {
    return validateVersionThree(parsed, context);
  }
  throw new Error("The saved game uses an unsupported schema version.");
}
