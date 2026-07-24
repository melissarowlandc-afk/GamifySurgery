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
  getCurrentCapabilities,
  getFacilityProgressionStatus,
  getRoomDefinition,
  getStaffRoleDefinition,
} from "./selectors";
import {
  applyFsrsReview,
  createNewFsrsCard,
  createSchedulerPins,
  schedulerPinsMatch,
} from "./fsrs-adapter";
import type {
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
  },
): EncounterState {
  const patienceExempt = input.arrivalClass === "tutorial";
  return {
    id: input.encounterId,
    clinicalReleaseId: context.clinicalRelease.id,
    frozenCase: clonePlain(input.clinicalCase),
    patientDisplayName: input.patientDisplayName,
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

function getEligibleResultRoute(
  state: GameState,
  context: DomainContext,
  gate: ResultGate,
) {
  const service = context.balanceRelease.services.find(
    (candidate) => candidate.id === gate.resultTypeId,
  );
  if (!service) {
    return null;
  }
  const capabilities = getCurrentCapabilities(state, context);
  const allowedRouteIds = new Set(gate.allowedServiceRouteIds);
  const eligibleRoutes = service.routes
    .filter(
      (route) =>
        allowedRouteIds.has(route.id) &&
        (route.requiredCapabilityId === null ||
          capabilities.has(route.requiredCapabilityId)) &&
        route.requiredCapabilityIds.every((capabilityId) =>
          capabilities.has(capabilityId),
        ),
    )
    .sort(
      (left, right) =>
        left.preference - right.preference ||
        left.durationTicks - right.durationTicks ||
        left.id.localeCompare(right.id),
    );
  const route = eligibleRoutes[0];
  return route ? { service, route } : null;
}

function scheduleResult(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  node: DecisionNode,
  gate: ResultGate,
): PendingResult | null {
  const selected = getEligibleResultRoute(state, context, gate);
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
    durationTicks: selected.route.durationTicks,
    dueTick: state.facilityTick + selected.route.durationTicks,
    deliveredAtTick: null,
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
  state.satisfaction = clamp(state.satisfaction + satisfactionDelta, 0, 100);
  state.clinicalXp += clinicalXpAwarded;
  appendEvent(state, {
    id: `event.${settlementId}`,
    type: "encounter_settled",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: "Patient settlement applied once.",
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
      acknowledged: false,
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

function roomsOverlap(
  left: { x: number; y: number; width: number; height: number },
  right: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
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
  nextEncounter.answers.push({
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    ratingIntent: rating,
    answeredAtFacilityTick: next.facilityTick,
    explanation: node.explanation,
  });
  next.reviewIntents.push({
    id: `review-intent.${nextEncounter.id}.${node.id}`,
    encounterId: nextEncounter.id,
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    rating,
    facilityTick: next.facilityTick,
    reviewedAtMs,
  });

  if (isFinalNode) {
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
    nextEncounter.pendingResult = scheduledResult;
    nextEncounter.lifecycle = "active_pending_result";
  } else {
    nextEncounter.currentNodeIndex += 1;
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
    patientDisplayName: `${clinicalCase.patientDisplayName} ${sequence + 1}`,
    arrivalClass: "routine",
    protectedGuaranteeId: null,
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
    message: `${clinicalCase.patientDisplayName} arrived.`,
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
    return total + (definition?.upkeepPerExpenseInterval ?? 0);
  }, 0);
  const staffExpense = state.employees.reduce((total, employee) => {
    const definition = getStaffRoleDefinition(
      employee.staffRoleDefinitionId,
      context,
    );
    return total + (definition?.salaryPerExpenseInterval ?? 0);
  }, 0);
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

  for (const encounter of Object.values(next.encounters)) {
    if (
      encounter.lifecycle === "active_pending_result" &&
      encounter.pendingResult &&
      encounter.pendingResult.deliveredAtTick === null &&
      encounter.pendingResult.dueTick <= next.facilityTick
    ) {
      encounter.pendingResult.deliveredAtTick = next.facilityTick;
      encounter.deliveredResultNarratives.push(
        encounter.pendingResult.resultNarrative,
      );
      encounter.currentNodeIndex += 1;
      encounter.lifecycle = "active_action_required";
      appendEvent(next, {
        id: `event.${encounter.pendingResult.operationId}.ready`,
        type: "result_ready",
        facilityTick: next.facilityTick,
        encounterId: encounter.id,
        message: `${encounter.pendingResult.pendingLabel} is ready.`,
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
        appendEvent(next, {
          id: `event.patience-warning.${encounter.id}.${threshold}`,
          type: "patience_warning",
          facilityTick: next.facilityTick,
          encounterId: encounter.id,
          message:
            remaining === 0
              ? "Final waiting-patient warning."
              : `Waiting-patient warning: ${remaining} ticks remain.`,
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
      });
    }
  }

  applyOperatingExpenses(next, context);
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
  const facility = context.balanceRelease.facility;
  if (
    command.x + definition.width > facility.gridWidth ||
    command.y + definition.height > facility.gridHeight
  ) {
    return rejectCommand(state, command, "The room does not fit inside the facility.");
  }
  const proposed = {
    x: command.x,
    y: command.y,
    width: definition.width,
    height: definition.height,
  };
  const overlaps = state.rooms.some((placedRoom) => {
    const placedDefinition = getRoomDefinition(placedRoom.roomDefinitionId, context);
    return (
      placedDefinition !== null &&
      roomsOverlap(proposed, {
        x: placedRoom.x,
        y: placedRoom.y,
        width: placedDefinition.width,
        height: placedDefinition.height,
      })
    );
  });
  if (overlaps) {
    return rejectCommand(state, command, "The room overlaps an existing room.");
  }
  if (state.cash < definition.constructionCost) {
    return rejectCommand(state, command, "There is not enough cash for this room.");
  }

  const next = clonePlain(state);
  const placedRoom: PlacedRoom = {
    id: command.roomId,
    roomDefinitionId: command.roomDefinitionId,
    x: command.x,
    y: command.y,
  };
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
  });
  return recordReceipt(next, command, "applied", "Room placed and cash deducted once.");
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
  if (!command.displayName.trim()) {
    return rejectCommand(state, command, "An employee needs a display name.");
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
  const employee: EmployeeState = {
    id: command.employeeId,
    staffRoleDefinitionId: definition.id,
    displayName: command.displayName.trim(),
    hiredAtFacilityTick: next.facilityTick,
  };
  next.employees.push(employee);
  next.cash -= definition.hiringCost;
  appendEvent(next, {
    id: `event.staff-hired.${employee.id}`,
    type: "staff_hired",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: `${employee.displayName} hired as ${definition.displayName}.`,
  });
  return recordReceipt(next, command, "applied", "Employee hired.");
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
  });
  return recordReceipt(next, command, "applied", "Facility level advanced.");
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
  const state: GameState = {
    schemaVersion: 2,
    campaignId: options.campaignId ?? "campaign.local.prototype",
    campaignSeed: options.campaignSeed ?? "prototype-seed-0001",
    createdAtRealMs,
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
    clinicalXp: 0,
    openChartEncounterId: null,
    attendedEncounterId: null,
    rooms: context.balanceRelease.facility.initialRooms.map((room) => ({
      id: room.id,
      roomDefinitionId: room.roomDefinitionId,
      x: room.x,
      y: room.y,
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
    case "HIRE_STAFF":
      return reduceHireStaff(state, command, context);
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
    case "ADMIT_PATIENT":
      return reduceAdmitPatient(state, command, context);
  }
}
