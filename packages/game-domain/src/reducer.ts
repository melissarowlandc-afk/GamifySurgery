import type {
  DecisionNode,
  ResultGate,
  SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  validateDomainContext,
} from "./context";
import {
  canAdmitPatient,
  getEligibleServiceRoute,
  getEmergencyGlp1Status,
  getFacilityProgressionStatus,
  getRoomDefinition,
  getStaffRoleDefinition,
} from "./selectors";
import {
  RANDOMNESS_CONTRACT_VERSION,
  RANDOM_STREAMS,
  deterministicShuffle,
} from "./randomness";
import {
  applyFsrsReview,
  createNewFsrsCard,
  createSchedulerPins,
  schedulerPinsMatch,
} from "./fsrs-adapter";
import {
  createPatientDisplayName,
  createPixelAppearance,
  createStaffDisplayName,
} from "./appearance";
import {
  getRotatedFootprint,
  isInsideFacility,
  isPlacementAttachedThroughOwnEntrance,
  roomsOverlap,
  rotateDirection,
  validateFacilityConnectivity,
} from "./spatial";
import {
  advanceEmployeeMovement,
  getEmployeeArrival,
  getEffectiveEmployeeMorale,
} from "./staff";
import type {
  AnswerRecord,
  DomainContext,
  DomainEvent,
  EmployeeState,
  EncounterSettlement,
  EncounterState,
  GameCommand,
  GameState,
  OperationReceipt,
  PendingResult,
  PlacedRoom,
  TerminalFeedback,
  CreateCampaignOptions,
} from "./types";

const MAX_TRANSIENT_OPERATION_RECEIPTS = 500;
const MAX_TRANSIENT_EVENTS = 500;

function clonePlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function findCase(context: DomainContext, caseId: string): SyntheticClinicalCase | null {
  return (
    context.clinicalRelease.cases.find((clinicalCase) => clinicalCase.id === caseId) ??
    null
  );
}

function assertPinnedContext(state: GameState, context: DomainContext): void {
  if (
    state.clinicalReleaseId !== context.clinicalRelease.id ||
    state.balanceReleaseId !== context.balanceRelease.id
  ) {
    throw new Error("Reducer context does not match the campaign's pinned releases.");
  }
  if (
    !schedulerPinsMatch(
      state.schedulerPins,
      context.balanceRelease.learning.parameterSetId,
    )
  ) {
    throw new Error("Reducer context does not match the campaign's scheduler pins.");
  }
  if (state.randomGeneratorVersion !== RANDOMNESS_CONTRACT_VERSION) {
    throw new Error(
      "Reducer context does not match the campaign's randomness contract.",
    );
  }
}

function createEncounter(
  state: GameState,
  context: DomainContext,
  input: {
    encounterId: string;
    clinicalCase: SyntheticClinicalCase;
    patientDisplayName: string;
    arrivalClass: EncounterState["arrivalClass"];
    protectedGuaranteeId: string | null;
    patienceExempt?: boolean;
  },
): EncounterState {
  const patienceExempt =
    input.arrivalClass === "tutorial" || input.patienceExempt === true;
  const frozenCase = clonePlain(input.clinicalCase);
  for (const node of frozenCase.decisionNodes) {
    if (node.shuffleAnswers) {
      node.answerChoices = deterministicShuffle(
        node.answerChoices,
        state.campaignSeed,
        RANDOM_STREAMS.answerOrder,
        `${input.encounterId}|${node.id}`,
      );
    }
  }
  return {
    id: input.encounterId,
    clinicalReleaseId: context.clinicalRelease.id,
    frozenCase,
    patientDisplayName: input.patientDisplayName,
    patientAppearance: createPixelAppearance(
      state.campaignSeed,
      "patient",
      input.encounterId,
    ),
    patientConfidence: 50,
    arrivalClass: input.arrivalClass,
    protectedGuaranteeId: input.protectedGuaranteeId,
    lifecycle: "waiting_unopened",
    resolutionReason: null,
    currentNodeIndex: 0,
    firstOpenedAtTick: null,
    waiting: {
      arrivedAtTick: state.facilityTick,
      departureDueTick: patienceExempt
        ? null
        : state.facilityTick +
          context.balanceRelease.patientPatience.routineDurationTicks,
      patienceExempt,
      warningThresholdsShown: [],
    },
    answers: [],
    steps: frozenCase.decisionNodes.map((node, nodeIndex) => ({
      nodeIndex,
      decisionNodeId: node.id,
      questionVariantId: node.questionVariantId,
      primaryConceptId: node.primaryConceptId,
      status: nodeIndex === 0 ? "action_required" : "locked",
      answer: null,
      result: null,
    })),
    pendingResult: null,
    deliveredResultNarratives: [],
    terminalFeedback: null,
    settlementId: null,
  };
}

function recordReceipt(
  state: GameState,
  command: GameCommand,
  status: OperationReceipt["status"],
  message: string,
): GameState {
  state.operationReceipts[command.operationId] = {
    operationId: command.operationId,
    commandType: command.type,
    status,
    message,
    facilityTick: state.facilityTick,
  };
  const receiptIds = Object.keys(state.operationReceipts);
  if (receiptIds.length > MAX_TRANSIENT_OPERATION_RECEIPTS) {
    for (const receiptId of receiptIds.slice(
      0,
      receiptIds.length - MAX_TRANSIENT_OPERATION_RECEIPTS,
    )) {
      delete state.operationReceipts[receiptId];
    }
  }
  return state;
}

function rejectCommand(
  state: GameState,
  command: GameCommand,
  message: string,
): GameState {
  return recordReceipt(clonePlain(state), command, "rejected", message);
}

function appendEvent(state: GameState, event: DomainEvent): void {
  if (!state.events.some((existing) => existing.id === event.id)) {
    state.events.push(event);
    if (state.events.length > MAX_TRANSIENT_EVENTS) {
      state.events.splice(0, state.events.length - MAX_TRANSIENT_EVENTS);
    }
  }
}

function getCurrentNode(encounter: EncounterState): DecisionNode | null {
  return encounter.frozenCase.decisionNodes[encounter.currentNodeIndex] ?? null;
}

function scheduleResult(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  node: DecisionNode,
  gate: ResultGate,
): PendingResult | null {
  const selected = getEligibleServiceRoute(
    state,
    gate.resultTypeId,
    gate.allowedServiceRouteIds,
    context,
  );
  if (!selected) {
    return null;
  }
  return {
    operationId: `result.${encounter.id}.${node.id}.${gate.id}`,
    gateId: gate.id,
    originatingNodeIndex: encounter.currentNodeIndex,
    resultTypeId: gate.resultTypeId,
    pendingLabel: gate.pendingLabel,
    resultNarrative: gate.resultNarrative,
    routeId: selected.route.id,
    routeDisplayName: selected.route.displayName,
    scheduledAtTick: state.facilityTick,
    serviceDurationTicks: selected.timing.serviceDurationTicks,
    durationTicks: selected.timing.durationTicks,
    dueTick: state.facilityTick + selected.timing.durationTicks,
    deliveredAtTick: null,
    patientTravel: clonePlain(selected.timing.patientTravel),
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function settleEncounter(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): void {
  if (encounter.settlementId !== null) {
    return;
  }
  const balance = context.balanceRelease.clinicalSettlement;
  const rewardTier = balance.patientRewardTiers.find(
    (tier) => tier.id === encounter.frozenCase.rewardTierId,
  );
  if (!rewardTier) {
    throw new Error(
      `Missing reward tier ${encounter.frozenCase.rewardTierId} for ${encounter.id}.`,
    );
  }
  const totalAnswers = encounter.answers.length;
  const correctAnswers = encounter.answers.filter((answer) => answer.correct).length;
  const incorrectAnswers = totalAnswers - correctAnswers;
  const qualityRevenueBonus =
    totalAnswers === 0
      ? 0
      : Math.round(
          balance.maximumQualityRevenueBonus * (correctAnswers / totalAnswers),
        );
  const incorrectFinancialConsequence =
    totalAnswers === 0
      ? 0
      : Math.round(
          balance.maximumIncorrectFinancialConsequence *
            (incorrectAnswers / totalAnswers),
        );
  const correctSatisfactionBonus =
    totalAnswers === 0
      ? 0
      : Math.round(
          balance.maximumCorrectSatisfactionBonus *
            (correctAnswers / totalAnswers),
        );
  const incorrectSatisfactionConsequence =
    totalAnswers === 0
      ? 0
      : Math.round(
          balance.maximumIncorrectSatisfactionConsequence *
            (incorrectAnswers / totalAnswers),
        );
  const satisfactionDelta = clamp(
    correctSatisfactionBonus - incorrectSatisfactionConsequence,
    balance.patientSatisfactionDeltaMinimum,
    balance.patientSatisfactionDeltaMaximum,
  );
  const clinicalXpAwarded =
    correctAnswers * balance.clinicalXpPerCorrectFirstAnswer;
  const netCashDelta =
    rewardTier.completionRevenue +
    qualityRevenueBonus -
    incorrectFinancialConsequence;
  const settlementId = `settlement.${encounter.id}.completion`;
  const settlement: EncounterSettlement = {
    id: settlementId,
    encounterId: encounter.id,
    completionRevenue: rewardTier.completionRevenue,
    qualityRevenueBonus,
    incorrectFinancialConsequence,
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
  state.cash += netCashDelta;
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
}

function resolveTerminalFeedback(
  node: DecisionNode,
  answerChoiceId: string,
  correct: boolean,
): TerminalFeedback {
  if (correct) {
    return {
      kind: "completion",
      outcome: null,
      correction: null,
      // Only incorrect final decisions need the explicit corrective/outcome
      // acknowledgement. A correct completion may be flipped or resolved
      // immediately.
      acknowledged: true,
    };
  }
  const disposition = node.terminalDispositions.find(
    (candidate) => candidate.answerChoiceId === answerChoiceId,
  );
  if (!disposition) {
    throw new Error("Validated content is missing a final wrong-answer disposition.");
  }
  if (disposition.kind === "no_terminal_outcome") {
    return {
      kind: "correction",
      outcome: null,
      correction: node.explanation,
      acknowledged: false,
    };
  }
  return {
    kind: "terminal_outcome",
    outcome: clonePlain(disposition.outcome),
    correction: node.explanation,
    acknowledged: false,
  };
}

function reduceOpenChart(
  state: GameState,
  command: Extract<GameCommand, { type: "OPEN_CHART" }>,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (!encounter) {
    return rejectCommand(state, command, "This chart does not exist.");
  }
  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;

  next.openChartEncounterId = nextEncounter.id;
  if (nextEncounter.lifecycle === "waiting_unopened") {
    nextEncounter.lifecycle = "active_action_required";
    nextEncounter.firstOpenedAtTick = next.facilityTick;
  }
  if (
    nextEncounter.lifecycle === "active_action_required" ||
    nextEncounter.lifecycle === "active_pending_result"
  ) {
    next.attendedEncounterId = nextEncounter.id;
  } else {
    next.attendedEncounterId = null;
  }
  return recordReceipt(next, command, "applied", "Chart opened.");
}

function reduceCloseChart(
  state: GameState,
  command: Extract<GameCommand, { type: "CLOSE_CHART" }>,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (!encounter || encounter.lifecycle === "waiting_unopened") {
    return rejectCommand(state, command, "This chart is not open.");
  }
  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;
  if (next.openChartEncounterId === command.encounterId) {
    next.openChartEncounterId = null;
  }
  if (next.attendedEncounterId === command.encounterId) {
    next.attendedEncounterId = null;
  }
  if (
    nextEncounter.lifecycle === "resolved_summary_available" &&
    nextEncounter.terminalFeedback?.acknowledged
  ) {
    nextEncounter.lifecycle = "resolved";
  }
  return recordReceipt(
    next,
    command,
    "applied",
    nextEncounter.lifecycle === "resolved"
      ? "Chart filed in Resolved."
      : "Chart closed; the patient remains Active.",
  );
}

function reduceSubmitAnswer(
  state: GameState,
  command: Extract<GameCommand, { type: "SUBMIT_ANSWER" }>,
  context: DomainContext,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (!encounter || encounter.lifecycle !== "active_action_required") {
    return rejectCommand(state, command, "No answer-ready question exists.");
  }
  const node = getCurrentNode(encounter);
  if (!node || node.id !== command.decisionNodeId) {
    return rejectCommand(state, command, "The question is stale or does not match.");
  }
  const choice = node.answerChoices.find(
    (candidate) => candidate.id === command.answerChoiceId,
  );
  if (!choice) {
    return rejectCommand(state, command, "The selected answer does not exist.");
  }
  const reviewedAtMs =
    command.reviewedAtMs ??
    state.createdAtRealMs +
      state.facilityTick * 60_000 +
      state.reviewIntents.length;
  if (!Number.isSafeInteger(reviewedAtMs) || reviewedAtMs < 0) {
    return rejectCommand(
      state,
      command,
      "The learning review needs a valid real-world timestamp.",
    );
  }
  const currentHistory =
    state.learningHistories[node.primaryConceptId] ?? {
      conceptId: node.primaryConceptId,
      card: createNewFsrsCard(state.createdAtRealMs),
      reviews: [],
    };
  if (
    currentHistory.card.lastReviewAtMs !== null &&
    reviewedAtMs < currentHistory.card.lastReviewAtMs
  ) {
    return rejectCommand(
      state,
      command,
      "The learning review timestamp is older than the previous review.",
    );
  }

  const isFinalNode =
    encounter.currentNodeIndex === encounter.frozenCase.decisionNodes.length - 1;
  let scheduledResult: PendingResult | null = null;
  if (!isFinalNode && node.resultGateAfter) {
    scheduledResult = scheduleResult(
      state,
      context,
      encounter,
      node,
      node.resultGateAfter,
    );
    if (!scheduledResult) {
      return rejectCommand(
        state,
        command,
        "No permitted result route is currently available.",
      );
    }
  }

  const next = clonePlain(state);
  const nextEncounter = next.encounters[command.encounterId]!;
  const rating = choice.isCorrect ? "Good" : "Again";
  const scheduledReview = applyFsrsReview(
    currentHistory.card,
    rating,
    reviewedAtMs,
    context.balanceRelease.learning,
  );
  const nextHistory = clonePlain(currentHistory);
  nextHistory.card = scheduledReview.card;
  nextHistory.reviews.push({
    id: `review.${nextEncounter.id}.${node.id}`,
    encounterId: nextEncounter.id,
    decisionNodeId: node.id,
    questionVariantId: node.questionVariantId,
    patientPresentationVariantId:
      nextEncounter.frozenCase.patientPresentationVariantId,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    rating,
    reviewedAtMs,
    facilityTick: next.facilityTick,
    schedulerLog: scheduledReview.log,
  });
  next.learningHistories[node.primaryConceptId] = nextHistory;
  const answerRecord: AnswerRecord = {
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    ratingIntent: rating,
    answeredAtFacilityTick: next.facilityTick,
    explanation: node.explanation,
    correctedForward: !choice.isCorrect && !isFinalNode,
  };
  nextEncounter.answers.push(answerRecord);
  const confidenceDelta = choice.isCorrect ? 10 : -10;
  nextEncounter.patientConfidence = clamp(
    nextEncounter.patientConfidence + confidenceDelta,
    0,
    100,
  );
  const dailyModifierDelta = choice.isCorrect ? 1 : -1;
  next.dailyConfidenceSatisfactionModifier = clamp(
    next.dailyConfidenceSatisfactionModifier + dailyModifierDelta,
    -3,
    3,
  );
  const learningXpAwarded = choice.isCorrect
    ? context.balanceRelease.clinicalSettlement
        .clinicalXpPerCorrectFirstAnswer
    : 0;
  next.clinicalXp += learningXpAwarded;
  const currentStep = nextEncounter.steps[nextEncounter.currentNodeIndex];
  if (!currentStep || currentStep.decisionNodeId !== node.id) {
    throw new Error("Encounter step history does not match the current node.");
  }
  currentStep.answer = clonePlain(answerRecord);
  next.reviewIntents.push({
    id: `review-intent.${nextEncounter.id}.${node.id}`,
    encounterId: nextEncounter.id,
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    rating,
    facilityTick: next.facilityTick,
    reviewedAtMs,
  });
  appendEvent(next, {
    id: `event.clinical-decision.${nextEncounter.id}.${node.id}`,
    type: "clinical_decision_recorded",
    facilityTick: next.facilityTick,
    encounterId: nextEncounter.id,
    message: choice.isCorrect
      ? `${nextEncounter.patientDisplayName}: correct decision recorded. +${learningXpAwarded} Learning XP.`
      : `${nextEncounter.patientDisplayName}: corrective teaching provided.`,
    priority: "informational",
    definitionId: choice.isCorrect
      ? "event.clinical.decision-correct"
      : "event.clinical.decision-corrective",
    target: {
      kind: "encounter",
      id: nextEncounter.id,
    },
    reward: {
      cashDelta: 0,
      learningXpDelta: learningXpAwarded,
      satisfactionDelta: 0,
    },
  });

  if (isFinalNode) {
    currentStep.status = "completed";
    nextEncounter.terminalFeedback = resolveTerminalFeedback(
      node,
      choice.id,
      choice.isCorrect,
    );
    nextEncounter.lifecycle = "resolved_summary_available";
    nextEncounter.resolutionReason = "completed";
    // The panel remains open for terminal feedback and the optional summary,
    // but completed charts no longer receive Active-patient attendance rules.
    next.openChartEncounterId = nextEncounter.id;
    if (next.attendedEncounterId === nextEncounter.id) {
      next.attendedEncounterId = null;
    }
    if (nextEncounter.protectedGuaranteeId) {
      next.criticalGuarantees[nextEncounter.protectedGuaranteeId] = "satisfied";
    }
    settleEncounter(next, context, nextEncounter);
  } else if (scheduledResult) {
    currentStep.status = "result_pending";
    currentStep.result = clonePlain(scheduledResult);
    nextEncounter.pendingResult = scheduledResult;
    nextEncounter.lifecycle = "active_pending_result";
    // A timed service sends the patient out of the open chart workflow. The
    // Active tab remains the durable return point until the result is ready.
    if (next.openChartEncounterId === nextEncounter.id) {
      next.openChartEncounterId = null;
    }
    if (next.attendedEncounterId === nextEncounter.id) {
      next.attendedEncounterId = null;
    }
  } else {
    currentStep.status = "completed";
    nextEncounter.currentNodeIndex += 1;
    nextEncounter.steps[nextEncounter.currentNodeIndex]!.status =
      "action_required";
    nextEncounter.lifecycle = "active_action_required";
  }

  return recordReceipt(
    next,
    command,
    "applied",
    choice.isCorrect
      ? "Answer recorded as Good."
      : "Answer recorded as Again; the case follows the corrected path.",
  );
}

function reduceAcknowledgeFeedback(
  state: GameState,
  command: Extract<GameCommand, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK" }>,
): GameState {
  const encounter = state.encounters[command.encounterId];
  if (
    !encounter ||
    encounter.lifecycle !== "resolved_summary_available" ||
    !encounter.terminalFeedback
  ) {
    return rejectCommand(state, command, "No terminal feedback is ready.");
  }
  const next = clonePlain(state);
  next.encounters[command.encounterId]!.terminalFeedback!.acknowledged = true;
  return recordReceipt(next, command, "applied", "Terminal feedback acknowledged.");
}

function stableSeedOffset(seed: string, modulus: number): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return modulus === 0 ? 0 : (hash >>> 0) % modulus;
}

function maybeAdmitAutomaticPatient(
  state: GameState,
  context: DomainContext,
): void {
  if (
    state.facilityLevel === 0 &&
    !state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] &&
    state.encounters[TUTORIAL_ENCOUNTER_ID]?.resolutionReason === "completed"
  ) {
    const secondTutorial = context.clinicalRelease.cases.filter(
      (clinicalCase) => clinicalCase.tutorialEligible,
    )[1];
    if (!secondTutorial) {
      throw new Error("The protected second tutorial case is missing.");
    }
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = createEncounter(
      state,
      context,
      {
        encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
        clinicalCase: secondTutorial,
        patientDisplayName: secondTutorial.patientDisplayName,
        arrivalClass: "tutorial",
        protectedGuaranteeId: "guarantee.level0.second-tutorial",
      },
    );
    state.criticalGuarantees["guarantee.level0.second-tutorial"] =
      "in_progress";
    appendEvent(state, {
      id: `event.patient-arrived.${SECOND_TUTORIAL_ENCOUNTER_ID}`,
      type: "patient_arrived",
      facilityTick: state.facilityTick,
      encounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      message: `${secondTutorial.patientDisplayName} arrived for the second tutorial.`,
      priority: "action_required",
      definitionId: "alert.patient.arrived",
      target: {
        kind: "encounter",
        id: SECOND_TUTORIAL_ENCOUNTER_ID,
      },
    });
    return;
  }
  if (state.facilityTick < state.nextRoutineArrivalTick) {
    return;
  }

  if (state.facilityLevel === 0) {
    const introIds = [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID];
    const introComplete = introIds.every(
      (id) => state.encounters[id]?.resolutionReason === "completed",
    );
    const stage = context.balanceRelease.facility.stageDefinitions.find(
      (candidate) => candidate.level === 0,
    );
    const completedCount = Object.values(state.encounters).filter(
      (encounter) => encounter.resolutionReason === "completed",
    ).length;
    if (
      !introComplete ||
      !stage ||
      (state.clinicalXp >= stage.minimumClinicalXp &&
        completedCount >= stage.minimumCompletedEncounters)
    ) {
      return;
    }
  }

  if (!canAdmitPatient(state, "routine", context)) {
    return;
  }

  const eligibleCases = context.clinicalRelease.cases
    .filter(
      (clinicalCase) =>
        clinicalCase.routineEligible &&
        clinicalCase.earliestFacilityStage <= state.facilityLevel,
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  if (eligibleCases.length === 0) {
    return;
  }
  const sequence = state.routineArrivalSequence;
  const caseIndex =
    (stableSeedOffset(state.campaignSeed, eligibleCases.length) + sequence) %
    eligibleCases.length;
  const clinicalCase = eligibleCases[caseIndex]!;
  const encounterId = `encounter.auto.${state.facilityLevel}.${sequence}`;
  state.encounters[encounterId] = createEncounter(state, context, {
    encounterId,
    clinicalCase,
    patientDisplayName: createPatientDisplayName(
      state.campaignSeed,
      encounterId,
    ),
    arrivalClass: "routine",
    protectedGuaranteeId: null,
    // Level 0 recovery patients exist specifically to prevent an incorrect
    // tutorial from blocking progression. They may wait indefinitely until
    // the player is ready; ordinary Level 1 patients retain normal patience.
    patienceExempt: state.facilityLevel === 0,
  });
  state.routineArrivalSequence += 1;
  state.nextRoutineArrivalTick =
    state.facilityTick +
    (state.facilityLevel === 0
      ? context.balanceRelease.arrivals.levelZeroRecoveryIntervalTicks
      : context.balanceRelease.arrivals.levelOneRoutineIntervalTicks);
  appendEvent(state, {
    id: `event.patient-arrived.${encounterId}`,
    type: "patient_arrived",
    facilityTick: state.facilityTick,
    encounterId,
    message: `${state.encounters[encounterId]!.patientDisplayName} arrived.`,
    priority: "action_required",
    definitionId: "alert.patient.arrived",
    target: {
      kind: "encounter",
      id: encounterId,
    },
  });
}

function applyOperatingExpenses(
  state: GameState,
  context: DomainContext,
): void {
  const interval = context.balanceRelease.economy.expenseIntervalTicks;
  if (state.facilityTick === 0 || state.facilityTick % interval !== 0) {
    return;
  }
  const roomExpense = state.rooms.reduce((total, room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    return (
      total +
      (definition?.upkeepPerExpenseInterval ?? 0) +
      (definition?.upkeepPerUpgradeLevel ?? 0) *
        Math.max(0, room.upgradeLevel - 1)
    );
  }, 0);
  const staffExpense = state.employees.reduce(
    (total, employee) => total + employee.salaryPerExpenseInterval,
    0,
  );
  const expense = roomExpense + staffExpense;
  if (expense === 0) {
    return;
  }
  state.cash -= expense;
  state.totalOperatingExpenses += expense;
  appendEvent(state, {
    id: `event.operating-expense.${state.facilityTick}`,
    type: "operating_expense",
    facilityTick: state.facilityTick,
    encounterId: null,
    message: `Operating expenses paid: $${expense}.`,
    priority: "informational",
    definitionId: "alert.finance.expense",
    target: {
      kind: "campaign",
      id: state.campaignId,
    },
  });
}

function reduceAdvanceTick(
  state: GameState,
  command: Extract<GameCommand, { type: "ADVANCE_TICK" }>,
  context: DomainContext,
): GameState {
  const next = clonePlain(state);
  if (next.paused) {
    return recordReceipt(
      next,
      command,
      "applied",
      "Facility time remains paused; no tick advanced.",
    );
  }
  next.facilityTick += 1;
  const operatingTicksPerDay =
    (context.balanceRelease.clock.dayEndHour -
      context.balanceRelease.clock.dayStartHour) /
    context.balanceRelease.clock.facilityHoursPerTick;
  if (next.facilityTick % operatingTicksPerDay === 0) {
    const dayNumber = Math.floor(next.facilityTick / operatingTicksPerDay) + 1;
    next.emergencyGlp1.dayNumber = dayNumber;
    next.emergencyGlp1.usesToday = 0;
    next.emergencyGlp1.lastFlavorMessage = null;
    next.dailyConfidenceSatisfactionModifier = 0;
    appendEvent(next, {
      id: `event.day-rollover.${dayNumber}`,
      type: "day_rollover",
      facilityTick: next.facilityTick,
      encounterId: null,
      message: `Day ${dayNumber} begins at 8 AM.`,
      priority: "informational",
      definitionId: "event.facility.day-rollover",
      target: {
        kind: "campaign",
        id: next.campaignId,
      },
    });
  }

  for (const encounter of Object.values(next.encounters)) {
    if (
      encounter.lifecycle === "active_pending_result" &&
      encounter.pendingResult &&
      encounter.pendingResult.deliveredAtTick === null &&
      encounter.pendingResult.dueTick <= next.facilityTick
    ) {
      encounter.pendingResult.deliveredAtTick = next.facilityTick;
      const completedStep =
        encounter.steps[encounter.pendingResult.originatingNodeIndex];
      if (
        !completedStep ||
        completedStep.decisionNodeId !==
          encounter.frozenCase.decisionNodes[
            encounter.pendingResult.originatingNodeIndex
          ]?.id
      ) {
        throw new Error("Pending result does not match encounter step history.");
      }
      completedStep.result = clonePlain(encounter.pendingResult);
      completedStep.status = "completed";
      encounter.deliveredResultNarratives.push(
        encounter.pendingResult.resultNarrative,
      );
      encounter.currentNodeIndex += 1;
      encounter.steps[encounter.currentNodeIndex]!.status = "action_required";
      encounter.lifecycle = "active_action_required";
      const completedRoute = context.balanceRelease.services
        .flatMap((service) => service.routes)
        .find((route) => route.id === encounter.pendingResult?.routeId);
      const configuredResultSatisfactionDelta =
        completedRoute?.satisfactionOnResult ?? 0;
      const satisfactionBeforeResult = next.satisfaction;
      if (configuredResultSatisfactionDelta !== 0) {
        next.satisfaction = clamp(
          next.satisfaction + configuredResultSatisfactionDelta,
          0,
          100,
        );
      }
      const resultSatisfactionDelta =
        next.satisfaction - satisfactionBeforeResult;
      appendEvent(next, {
        id: `event.${encounter.pendingResult.operationId}.ready`,
        type: "result_ready",
        facilityTick: next.facilityTick,
        encounterId: encounter.id,
        message: `${encounter.patientDisplayName}: ${encounter.pendingResult.pendingLabel} is ready.`,
        priority: "action_required",
        definitionId: "alert.patient.result-ready",
        target: {
          kind: "encounter",
          id: encounter.id,
        },
        ...(resultSatisfactionDelta === 0
          ? {}
          : {
              reward: {
                cashDelta: 0,
                learningXpDelta: 0,
                satisfactionDelta: resultSatisfactionDelta,
              },
            }),
      });
    }
  }

  const patience = context.balanceRelease.patientPatience;
  for (const encounter of Object.values(next.encounters)) {
    const dueTick = encounter.waiting.departureDueTick;
    if (
      encounter.lifecycle !== "waiting_unopened" ||
      encounter.waiting.patienceExempt ||
      dueTick === null
    ) {
      continue;
    }
    const remaining = Math.max(0, dueTick - next.facilityTick);
    for (const threshold of patience.warningAtRemainingTicks) {
      if (
        remaining <= threshold &&
        !encounter.waiting.warningThresholdsShown.includes(threshold)
      ) {
        encounter.waiting.warningThresholdsShown.push(threshold);
        const configuredWarningSatisfactionDelta =
          patience.satisfactionPenaltyAtWarningTicks.includes(threshold)
            ? -patience.satisfactionPenaltyPerWarning
            : 0;
        const satisfactionBeforeWarning = next.satisfaction;
        if (configuredWarningSatisfactionDelta !== 0) {
          next.satisfaction = clamp(
            next.satisfaction + configuredWarningSatisfactionDelta,
            0,
            100,
          );
        }
        const warningSatisfactionDelta =
          next.satisfaction - satisfactionBeforeWarning;
        appendEvent(next, {
          id: `event.patience-warning.${encounter.id}.${threshold}`,
          type: "patience_warning",
          facilityTick: next.facilityTick,
          encounterId: encounter.id,
          message:
            remaining === 0
              ? "Final waiting-patient warning."
              : `Waiting-patient warning: ${remaining} facility hours remain.`,
          priority: remaining === 0 ? "critical" : "action_required",
          definitionId: "alert.patient.patience",
          target: {
            kind: "encounter",
            id: encounter.id,
          },
          ...(warningSatisfactionDelta === 0
            ? {}
            : {
                reward: {
                  cashDelta: 0,
                  learningXpDelta: 0,
                  satisfactionDelta: warningSatisfactionDelta,
                },
              }),
        });
      }
    }

    // Departure occurs one logical tick after the zero-remaining warning. This
    // lets an Open command issued at the deadline win deterministically.
    if (next.facilityTick > dueTick) {
      encounter.lifecycle = "resolved";
      encounter.resolutionReason = "left_before_seen";
      encounter.terminalFeedback = null;
      encounter.settlementId = null;
      next.satisfaction = clamp(
        next.satisfaction -
          context.balanceRelease.patientPatience
            .leftBeforeSeenSatisfactionPenalty,
        0,
        100,
      );
      if (encounter.protectedGuaranteeId) {
        next.criticalGuarantees[encounter.protectedGuaranteeId] = "pending";
      }
      appendEvent(next, {
        id: `event.left-before-seen.${encounter.id}`,
        type: "left_before_seen",
        facilityTick: next.facilityTick,
        encounterId: encounter.id,
        message: "Patient left before being seen.",
        priority: "critical",
        definitionId: "alert.patient.left",
        target: {
          kind: "encounter",
          id: encounter.id,
        },
      });
    }
  }

  applyOperatingExpenses(next, context);
  advanceEmployeeMovement(next, context);
  maybeAdmitAutomaticPatient(next, context);

  return recordReceipt(next, command, "applied", "Facility time advanced once.");
}

function reducePlaceRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "PLACE_ROOM" }>,
  context: DomainContext,
): GameState {
  const definition = getRoomDefinition(command.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  if (definition.unlockFacilityLevel > state.facilityLevel) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} unlocks at Level ${definition.unlockFacilityLevel}.`,
    );
  }
  const existingInstanceCount = state.rooms.filter(
    (room) => room.roomDefinitionId === definition.id,
  ).length;
  if (
    definition.maximumInstances !== null &&
    existingInstanceCount >= definition.maximumInstances
  ) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} has reached its maximum of ${definition.maximumInstances}.`,
    );
  }
  const placedRoomTypes = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const missingDependency = definition.requiredRoomDefinitionIds.find(
    (requiredId) => !placedRoomTypes.has(requiredId),
  );
  if (missingDependency) {
    const required = getRoomDefinition(missingDependency, context);
    return rejectCommand(
      state,
      command,
      `Build ${required?.displayName ?? missingDependency} first.`,
    );
  }
  if (
    !Number.isInteger(command.x) ||
    !Number.isInteger(command.y) ||
    command.x < 0 ||
    command.y < 0
  ) {
    return rejectCommand(state, command, "Room coordinates must be grid cells.");
  }
  if (state.rooms.some((room) => room.id === command.roomId)) {
    return rejectCommand(state, command, "That room instance ID already exists.");
  }
  const orientation = command.orientation ?? 0;
  if (
    orientation !== 0 &&
    orientation !== 90 &&
    orientation !== 180 &&
    orientation !== 270
  ) {
    return rejectCommand(
      state,
      command,
      "Rooms may rotate only in 90-degree steps.",
    );
  }
  const facility = context.balanceRelease.facility;
  const placedRoom: PlacedRoom = {
    id: command.roomId,
    roomDefinitionId: command.roomDefinitionId,
    x: command.x,
    y: command.y,
    orientation,
    doorSide:
      definition.defaultDoorSide === null
        ? null
        : rotateDirection(definition.defaultDoorSide, orientation),
    upgradeLevel: 1,
  };
  if (
    !isInsideFacility(
      placedRoom,
      definition,
      facility.gridWidth,
      facility.gridHeight,
    )
  ) {
    return rejectCommand(state, command, "The room does not fit inside the facility.");
  }
  const overlaps = state.rooms.some((placedRoom) => {
    const placedDefinition = getRoomDefinition(
      placedRoom.roomDefinitionId,
      context,
    );
    return (
      placedDefinition !== null &&
      roomsOverlap(
        placedRoom,
        placedDefinition,
        {
          id: command.roomId,
          roomDefinitionId: command.roomDefinitionId,
          x: command.x,
          y: command.y,
          orientation,
          doorSide:
            definition.defaultDoorSide === null
              ? null
              : rotateDirection(definition.defaultDoorSide, orientation),
          upgradeLevel: 1,
        },
        definition,
      )
    );
  });
  if (overlaps) {
    return rejectCommand(state, command, "The room overlaps an existing room.");
  }
  if (state.cash < definition.constructionCost) {
    return rejectCommand(state, command, "There is not enough cash for this room.");
  }
  const getDefinition = (definitionId: string) =>
    getRoomDefinition(definitionId, context);
  if (
    !isPlacementAttachedThroughOwnEntrance(
      placedRoom,
      definition,
      state.rooms,
      getDefinition,
    )
  ) {
    return rejectCommand(
      state,
      command,
      definition.kind === "hallway"
        ? "Connect this hallway to the Front Desk, another room, or its hallway network."
        : "Rotate and place the room so its visible door opens into a connected room or hallway.",
    );
  }
  const connected = validateFacilityConnectivity(
    [...state.rooms, placedRoom],
    getDefinition,
    new Set(facility.protectedRoomDefinitionIds),
  );
  if (!connected.connected) {
    return rejectCommand(
      state,
      command,
      definition.kind === "hallway"
        ? "Connect this hallway to the Front Desk, another room, or its hallway network."
        : "The room must remain reachable from the Front Desk.",
    );
  }

  const next = clonePlain(state);
  next.rooms.push(placedRoom);
  next.cash -= definition.constructionCost;
  next.satisfaction = clamp(
    next.satisfaction + definition.satisfactionOnBuild,
    0,
    100,
  );
  appendEvent(next, {
    id: `event.room-placed.${command.roomId}`,
    type: "room_placed",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${definition.displayName} placed.`,
    priority: "informational",
    definitionId: "alert.facility.room-placed",
    target: {
      kind: "room",
      id: command.roomId,
    },
  });
  return recordReceipt(next, command, "applied", "Room placed and cash deducted once.");
}

function reduceSellRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "SELL_ROOM" }>,
  context: DomainContext,
): GameState {
  const room = state.rooms.find((candidate) => candidate.id === command.roomId);
  if (!room) {
    return rejectCommand(state, command, "That room does not exist.");
  }
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  const facility = context.balanceRelease.facility;
  if (facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId)) {
    return rejectCommand(state, command, "The Front Desk cannot be sold.");
  }
  if (
    state.employees.some(
      (employee) => employee.homeRoomInstanceId === room.id,
    )
  ) {
    return rejectCommand(
      state,
      command,
      "Reassign employees before selling their home room.",
    );
  }

  const remainingRooms = state.rooms.filter(
    (candidate) => candidate.id !== room.id,
  );
  const remainingDefinitionIds = new Set(
    remainingRooms.map((candidate) => candidate.roomDefinitionId),
  );
  for (const remainingRoom of remainingRooms) {
    const remainingDefinition = getRoomDefinition(
      remainingRoom.roomDefinitionId,
      context,
    );
    const missing = remainingDefinition?.requiredRoomDefinitionIds.find(
      (requiredId) => !remainingDefinitionIds.has(requiredId),
    );
    if (missing) {
      return rejectCommand(
        state,
        command,
        `${remainingDefinition?.displayName ?? "Another room"} still depends on this room type.`,
      );
    }
  }
  for (const employee of state.employees) {
    const role = getStaffRoleDefinition(employee.staffRoleDefinitionId, context);
    const missing = role?.requiredRoomDefinitionIds.find(
      (requiredId) => !remainingDefinitionIds.has(requiredId),
    );
    if (missing) {
      return rejectCommand(
        state,
        command,
        `${employee.displayName} still requires this room type.`,
      );
    }
  }
  const connectivity = validateFacilityConnectivity(
    remainingRooms,
    (definitionId) => getRoomDefinition(definitionId, context),
    new Set(facility.protectedRoomDefinitionIds),
  );
  if (!connectivity.connected) {
    return rejectCommand(
      state,
      command,
      "Selling this room would disconnect part of the clinic.",
    );
  }

  const upgradeInvestment = definition.upgradeCosts
    .slice(0, Math.max(0, room.upgradeLevel - 1))
    .reduce((total, cost) => total + cost, 0);
  const refund = Math.floor(
    ((definition.constructionCost + upgradeInvestment) *
      facility.roomResalePercent) /
      100,
  );
  const next = clonePlain(state);
  next.rooms = remainingRooms;
  next.cash += refund;
  next.satisfaction = clamp(
    next.satisfaction - definition.satisfactionOnBuild,
    0,
    100,
  );
  appendEvent(next, {
    id: `event.room-sold.${room.id}.${command.operationId}`,
    type: "room_sold",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${definition.displayName} sold for $${refund}.`,
  });
  return recordReceipt(
    next,
    command,
    "applied",
    `${definition.displayName} sold for 25% of invested construction costs.`,
  );
}

function reduceUpgradeRoom(
  state: GameState,
  command: Extract<GameCommand, { type: "UPGRADE_ROOM" }>,
  context: DomainContext,
): GameState {
  const room = state.rooms.find((candidate) => candidate.id === command.roomId);
  if (!room) {
    return rejectCommand(state, command, "That room does not exist.");
  }
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!definition) {
    return rejectCommand(state, command, "The room definition does not exist.");
  }
  if (room.upgradeLevel >= definition.maximumUpgradeLevel) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} is already at Upgrade Level ${room.upgradeLevel}.`,
    );
  }
  const upgradeCost = definition.upgradeCosts[room.upgradeLevel - 1];
  if (upgradeCost === undefined) {
    return rejectCommand(
      state,
      command,
      "The next upgrade cost is not configured.",
    );
  }
  if (state.cash < upgradeCost) {
    return rejectCommand(state, command, "There is not enough cash for this upgrade.");
  }
  const next = clonePlain(state);
  const nextRoom = next.rooms.find((candidate) => candidate.id === room.id)!;
  nextRoom.upgradeLevel = (nextRoom.upgradeLevel + 1) as PlacedRoom["upgradeLevel"];
  next.cash -= upgradeCost;
  appendEvent(next, {
    id: `event.room-upgraded.${room.id}.${nextRoom.upgradeLevel}`,
    type: "room_upgraded",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${definition.displayName} upgraded to Level ${nextRoom.upgradeLevel}.`,
    priority: "informational",
    definitionId: "event.facility.room-upgraded",
    target: {
      kind: "room",
      id: room.id,
    },
  });
  return recordReceipt(
    next,
    command,
    "applied",
    `${definition.displayName} upgraded for $${upgradeCost}.`,
  );
}

function reduceAdmitPatient(
  state: GameState,
  command: Extract<GameCommand, { type: "ADMIT_PATIENT" }>,
  context: DomainContext,
): GameState {
  if (state.encounters[command.encounterId]) {
    return rejectCommand(state, command, "That encounter ID already exists.");
  }
  const clinicalCase = findCase(context, command.caseId);
  if (!clinicalCase) {
    return rejectCommand(state, command, "The clinical case does not exist.");
  }
  if (clinicalCase.earliestFacilityStage > state.facilityLevel) {
    return rejectCommand(
      state,
      command,
      `This patient becomes eligible at Level ${clinicalCase.earliestFacilityStage}.`,
    );
  }
  if (command.arrivalClass === "tutorial" && !clinicalCase.tutorialEligible) {
    return rejectCommand(state, command, "This case is not tutorial eligible.");
  }
  if (
    command.arrivalClass === "progression_critical" &&
    !command.protectedGuaranteeId
  ) {
    return rejectCommand(
      state,
      command,
      "A progression-critical admission needs a guarantee ID.",
    );
  }
  if (!canAdmitPatient(state, command.arrivalClass, context)) {
    return rejectCommand(
      state,
      command,
      command.arrivalClass === "routine"
        ? "At capacity - new routine patients are paused."
        : "All routine and reserved workload slots are occupied.",
    );
  }

  const next = clonePlain(state);
  const guaranteeId = command.protectedGuaranteeId ?? null;
  next.encounters[command.encounterId] = createEncounter(next, context, {
    encounterId: command.encounterId,
    clinicalCase,
    patientDisplayName: command.patientDisplayName,
    arrivalClass: command.arrivalClass,
    protectedGuaranteeId: guaranteeId,
  });
  if (guaranteeId) {
    next.criticalGuarantees[guaranteeId] = "in_progress";
  }
  appendEvent(next, {
    id: `event.patient-arrived.${command.encounterId}`,
    type: "patient_arrived",
    facilityTick: next.facilityTick,
    encounterId: command.encounterId,
    message: `${command.patientDisplayName} arrived.`,
    priority: "action_required",
    definitionId: "alert.patient.arrived",
    target: {
      kind: "encounter",
      id: command.encounterId,
    },
  });
  return recordReceipt(next, command, "applied", "Patient admitted to Waiting.");
}

function reduceHireStaff(
  state: GameState,
  command: Extract<GameCommand, { type: "HIRE_STAFF" }>,
  context: DomainContext,
): GameState {
  const definition = getStaffRoleDefinition(
    command.staffRoleDefinitionId,
    context,
  );
  if (!definition) {
    return rejectCommand(state, command, "The staff role does not exist.");
  }
  if (definition.unlockFacilityLevel > state.facilityLevel) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} unlocks at Level ${definition.unlockFacilityLevel}.`,
    );
  }
  if (state.employees.some((employee) => employee.id === command.employeeId)) {
    return rejectCommand(state, command, "That employee ID already exists.");
  }
  const employeesInRole = state.employees.filter(
    (employee) => employee.staffRoleDefinitionId === definition.id,
  );
  if (employeesInRole.length >= definition.maximumEmployees) {
    return rejectCommand(
      state,
      command,
      `${definition.displayName} staffing is at its ${definition.maximumEmployees}/${definition.maximumEmployees} prototype maximum.`,
    );
  }
  const placedRoomTypes = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const missingRoom = definition.requiredRoomDefinitionIds.find(
    (roomDefinitionId) => !placedRoomTypes.has(roomDefinitionId),
  );
  if (missingRoom) {
    const room = getRoomDefinition(missingRoom, context);
    return rejectCommand(
      state,
      command,
      `Build ${room?.displayName ?? missingRoom} before hiring this role.`,
    );
  }
  if (state.cash < definition.hiringCost) {
    return rejectCommand(state, command, "There is not enough cash for this hire.");
  }

  const next = clonePlain(state);
  const generatedName = createStaffDisplayName(
    next.campaignSeed,
    command.employeeId,
  );
  const requestedName = command.displayName?.trim();
  const baseName = requestedName || generatedName;
  const duplicateNameCount = next.employees.filter(
    (candidate) => candidate.displayName === baseName,
  ).length;
  const displayName =
    duplicateNameCount === 0
      ? baseName
      : `${baseName} ${duplicateNameCount + 1}`;
  const arrival = getEmployeeArrival(next, definition.id, context);
  if (!arrival) {
    return rejectCommand(
      state,
      command,
      "The employee has no connected path from the Front Desk to the required room.",
    );
  }
  const employee: EmployeeState = {
    id: command.employeeId,
    staffRoleDefinitionId: definition.id,
    displayName,
    appearance: createPixelAppearance(
      next.campaignSeed,
      "staff",
      command.employeeId,
    ),
    hiredAtFacilityTick: next.facilityTick,
    salaryPerExpenseInterval: definition.salaryPerExpenseInterval,
    morale: definition.baseMorale,
    trainingLevel: 1,
    homeRoomInstanceId: arrival.homeRoomInstanceId,
    location: arrival.location,
    path: arrival.path,
    pathIndex: 0,
    lastMovedAtFacilityTick: next.facilityTick,
  };
  next.employees.push(employee);
  next.cash -= definition.hiringCost;
  appendEvent(next, {
    id: `event.staff-hired.${employee.id}`,
    type: "staff_hired",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${employee.displayName} hired as ${definition.displayName}.`,
    priority: "informational",
    definitionId: "alert.staff.hired",
    target: {
      kind: "employee",
      id: employee.id,
    },
  });
  return recordReceipt(next, command, "applied", "Employee hired.");
}

function reduceSetEmployeeSalary(
  state: GameState,
  command: Extract<GameCommand, { type: "SET_EMPLOYEE_SALARY" }>,
  context: DomainContext,
): GameState {
  const employee = state.employees.find(
    (candidate) => candidate.id === command.employeeId,
  );
  if (!employee) {
    return rejectCommand(state, command, "That employee does not exist.");
  }
  const role = getStaffRoleDefinition(employee.staffRoleDefinitionId, context);
  if (!role) {
    return rejectCommand(state, command, "The staff role does not exist.");
  }
  const salary = command.salaryPerExpenseInterval;
  if (
    !Number.isInteger(salary) ||
    salary < role.minimumSalaryPerExpenseInterval ||
    salary > role.maximumSalaryPerExpenseInterval ||
    (salary - role.minimumSalaryPerExpenseInterval) %
      role.salaryAdjustmentStep !==
      0
  ) {
    return rejectCommand(
      state,
      command,
      `Salary must be $${role.minimumSalaryPerExpenseInterval}-$${role.maximumSalaryPerExpenseInterval} in $${role.salaryAdjustmentStep} steps.`,
    );
  }
  const next = clonePlain(state);
  const nextEmployee = next.employees.find(
    (candidate) => candidate.id === employee.id,
  )!;
  nextEmployee.salaryPerExpenseInterval = salary;
  nextEmployee.morale = getEffectiveEmployeeMorale(nextEmployee, context);
  appendEvent(next, {
    id: `event.staff-salary.${employee.id}.${command.operationId}`,
    type: "staff_salary_changed",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${employee.displayName}'s salary is now $${salary} per expense cycle; morale is ${nextEmployee.morale}%.`,
    priority: "informational",
    definitionId: "event.staff.salary-changed",
    target: {
      kind: "employee",
      id: employee.id,
    },
  });
  return recordReceipt(
    next,
    command,
    "applied",
    "Employee salary and morale updated.",
  );
}

function reduceLevelUp(
  state: GameState,
  command: Extract<GameCommand, { type: "LEVEL_UP" }>,
  context: DomainContext,
): GameState {
  const progression = getFacilityProgressionStatus(state, context);
  if (progression.nextFacilityLevel === null) {
    return rejectCommand(
      state,
      command,
      "Level 2 is outside this prototype and remains locked.",
    );
  }
  if (!progression.eligible) {
    return rejectCommand(
      state,
      command,
      "The current level requirements are not complete.",
    );
  }
  const next = clonePlain(state);
  next.facilityLevel = progression.nextFacilityLevel;
  next.nextRoutineArrivalTick =
    next.facilityTick +
    context.balanceRelease.arrivals.levelOneRoutineIntervalTicks;
  appendEvent(next, {
    id: `event.facility-level.${next.facilityLevel}`,
    type: "facility_level_advanced",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `Facility advanced to Level ${next.facilityLevel}.`,
    priority: "action_required",
    definitionId: "alert.progress.level-complete",
    target: {
      kind: "campaign",
      id: next.campaignId,
    },
  });
  return recordReceipt(next, command, "applied", "Facility level advanced.");
}

function reduceEmergencyGlp1Consultation(
  state: GameState,
  command: Extract<
    GameCommand,
    { type: "RUN_EMERGENCY_GLP1_CONSULTATION" }
  >,
  context: DomainContext,
): GameState {
  const status = getEmergencyGlp1Status(state, context);
  if (!status.eligible) {
    return rejectCommand(
      state,
      command,
      status.blockedReason ?? "Emergency consultation is unavailable.",
    );
  }

  const config = context.balanceRelease.emergencyGlp1;
  const next = clonePlain(state);
  if (next.emergencyGlp1.dayNumber !== status.dayNumber) {
    next.emergencyGlp1.dayNumber = status.dayNumber;
    next.emergencyGlp1.usesToday = 0;
    next.emergencyGlp1.lastFlavorMessage = null;
  }

  const useNumber = next.emergencyGlp1.usesToday + 1;
  next.emergencyGlp1.usesToday = useNumber;
  next.emergencyGlp1.totalUses += 1;
  next.emergencyGlp1.lastUsedAtFacilityTick = next.facilityTick;
  next.cash += status.payment;

  let flavorMessage: string | null = null;
  if (useNumber >= config.sarcasmStartsAtUse) {
    const messageIndex =
      next.emergencyGlp1.sarcasmMessagesShown % config.sarcasmLines.length;
    flavorMessage = config.sarcasmLines[messageIndex]!;
    next.emergencyGlp1.sarcasmMessagesShown += 1;
  }
  next.emergencyGlp1.lastFlavorMessage = flavorMessage;

  const usefulMessage =
    `Emergency GLP-1 consultation completed: +$${status.payment}.` +
    (flavorMessage ? ` ${flavorMessage}` : "");
  appendEvent(next, {
    id: `event.emergency-glp1.${command.operationId}`,
    type: "emergency_glp1_consultation",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: usefulMessage,
    priority: "informational",
    definitionId: "alert.finance.emergency-glp1-completed",
    target: {
      kind: "campaign",
      id: next.campaignId,
    },
    reward: {
      cashDelta: status.payment,
      learningXpDelta: 0,
      satisfactionDelta: 0,
    },
  });
  return recordReceipt(next, command, "applied", usefulMessage);
}

export function createInitialGameState(
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
  options: CreateCampaignOptions = {},
): GameState {
  validateDomainContext(context);
  const createdAtRealMs = options.createdAtRealMs ?? 0;
  if (!Number.isSafeInteger(createdAtRealMs) || createdAtRealMs < 0) {
    throw new Error("Campaign creation needs a valid real-world timestamp.");
  }
  const campaignSeed = options.campaignSeed ?? "prototype-seed-0001";
  const founderName = options.founder?.displayName.trim() ?? "Founder";
  if (founderName.length === 0 || founderName.length > 60) {
    throw new Error("The founder name must contain between 1 and 60 characters.");
  }
  const state: GameState = {
    schemaVersion: 4,
    campaignId: options.campaignId ?? "campaign.local.prototype",
    campaignSeed,
    randomGeneratorVersion: RANDOMNESS_CONTRACT_VERSION,
    createdAtRealMs,
    founder: {
      displayName: founderName,
      appearance:
        options.founder?.appearance ??
        createPixelAppearance(campaignSeed, "staff", "founder"),
    },
    clinicalReleaseId: context.clinicalRelease.id,
    balanceReleaseId: context.balanceRelease.id,
    schedulerPins: createSchedulerPins(
      context.balanceRelease.learning.parameterSetId,
    ),
    facilityLevel: 0,
    facilityTick: 0,
    paused: false,
    cash: context.balanceRelease.facility.startingCash,
    satisfaction: context.balanceRelease.facility.startingSatisfaction,
    dailyConfidenceSatisfactionModifier: 0,
    clinicalXp: 0,
    openChartEncounterId: null,
    attendedEncounterId: null,
    rooms: context.balanceRelease.facility.initialRooms.map((room) => ({
      id: room.id,
      roomDefinitionId: room.roomDefinitionId,
      x: room.x,
      y: room.y,
      orientation: room.orientation,
      doorSide: room.doorSide,
      upgradeLevel: room.upgradeLevel as PlacedRoom["upgradeLevel"],
    })),
    employees: [],
    encounters: {},
    learningHistories: Object.fromEntries(
      context.clinicalRelease.concepts.map((concept) => [
        concept.id,
        {
          conceptId: concept.id,
          card: createNewFsrsCard(createdAtRealMs),
          reviews: [],
        },
      ]),
    ),
    reviewIntents: [],
    settlements: [],
    operationReceipts: {},
    events: [],
    criticalGuarantees: {},
    nextRoutineArrivalTick:
      context.balanceRelease.arrivals.levelZeroRecoveryIntervalTicks,
    routineArrivalSequence: 0,
    totalOperatingExpenses: 0,
    emergencyGlp1: {
      dayNumber: 1,
      usesToday: 0,
      totalUses: 0,
      lastUsedAtFacilityTick: null,
      sarcasmMessagesShown: 0,
      lastFlavorMessage: null,
    },
  };
  const tutorialCases = context.clinicalRelease.cases.filter(
    (clinicalCase) => clinicalCase.tutorialEligible,
  );
  if (tutorialCases.length < 2) {
    throw new Error("The Level 0 prototype needs two tutorial-eligible cases.");
  }
  const firstTutorial = tutorialCases[0]!;
  state.encounters[TUTORIAL_ENCOUNTER_ID] = createEncounter(state, context, {
    encounterId: TUTORIAL_ENCOUNTER_ID,
    clinicalCase: firstTutorial,
    patientDisplayName: firstTutorial.patientDisplayName,
    arrivalClass: "tutorial",
    protectedGuaranteeId: null,
  });
  return state;
}

export function gameReducer(
  state: GameState,
  command: GameCommand,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  assertPinnedContext(state, context);
  if (!command.operationId.trim()) {
    throw new Error("Every command needs a stable, nonempty operation ID.");
  }
  if (state.operationReceipts[command.operationId]) {
    return state;
  }

  switch (command.type) {
    case "OPEN_CHART":
      return reduceOpenChart(state, command);
    case "CLOSE_CHART":
      return reduceCloseChart(state, command);
    case "SUBMIT_ANSWER":
      return reduceSubmitAnswer(state, command, context);
    case "ACKNOWLEDGE_TERMINAL_FEEDBACK":
      return reduceAcknowledgeFeedback(state, command);
    case "SET_PAUSED": {
      const next = clonePlain(state);
      next.paused = command.paused;
      return recordReceipt(
        next,
        command,
        "applied",
        command.paused ? "Facility paused." : "Facility resumed.",
      );
    }
    case "ADVANCE_TICK":
      return reduceAdvanceTick(state, command, context);
    case "PLACE_ROOM":
      return reducePlaceRoom(state, command, context);
    case "SELL_ROOM":
      return reduceSellRoom(state, command, context);
    case "UPGRADE_ROOM":
      return reduceUpgradeRoom(state, command, context);
    case "HIRE_STAFF":
      return reduceHireStaff(state, command, context);
    case "SET_EMPLOYEE_SALARY":
      return reduceSetEmployeeSalary(state, command, context);
    case "LEVEL_UP":
      return reduceLevelUp(state, command, context);
    case "DEV_FAST_FORWARD": {
      const requested =
        command.tickCount ??
        context.balanceRelease.development.fastForwardTickCount;
      if (!Number.isInteger(requested) || requested <= 0 || requested > 500) {
        return rejectCommand(
          state,
          command,
          "Development fast-forward must be between 1 and 500 ticks.",
        );
      }
      let next = state;
      for (let tick = 1; tick <= requested; tick += 1) {
        next = reduceAdvanceTick(
          next,
          {
            type: "ADVANCE_TICK",
            operationId: `${command.operationId}.tick.${tick}`,
          },
          context,
        );
      }
      return recordReceipt(
        next,
        command,
        "applied",
        `Development fast-forward advanced ${requested} ticks.`,
      );
    }
    case "DEV_ADD_MONEY": {
      const amount = context.balanceRelease.development.addMoneyAmount;
      const next = clonePlain(state);
      next.cash += amount;
      appendEvent(next, {
        id: `event.development-money-added.${command.operationId}`,
        type: "development_money_added",
        facilityTick: next.facilityTick,
        encounterId: null,
        message: `Development tool added $${amount}.`,
      });
      return recordReceipt(
        next,
        command,
        "applied",
        `Development tool added $${amount}.`,
      );
    }
    case "RUN_EMERGENCY_GLP1_CONSULTATION":
      return reduceEmergencyGlp1Consultation(state, command, context);
    case "ADMIT_PATIENT":
      return reduceAdmitPatient(state, command, context);
  }
}
