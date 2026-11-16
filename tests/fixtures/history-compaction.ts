import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, applyFsrsReview, type EmployeeDiscussionState,
  type GameState, type ServiceIncomeReceipt } from "../../packages/game-domain/src";

/** Public synthetic accounting/retention fixture; no private campaign data. */
export function createHistoryCompactionFixture(reviewsPerConcept = 30, concepts = 12): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.compaction.synthetic", campaignSeed: "compaction.synthetic", createdAtRealMs: 0 });
  state.facilityTick = 60_000;
  for (const history of Object.values(state.learningHistories).slice(0, concepts)) {
    for (let n = 0; n < reviewsPerConcept; n++) {
      const reviewedAtMs = (n + 1) * 86_400_000;
      const next = applyFsrsReview(history.card, n % 4 ? "Good" : "Again", reviewedAtMs, PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.learning);
      history.card = next.card;
      history.reviews.push({ id: `review.synthetic.${history.conceptId}.${n}`, encounterId: `encounter.retired.${n}`, decisionNodeId: `node.synthetic.${n}`,
        primaryConceptId: history.conceptId, questionVariantId: "question.synthetic", patientPresentationVariantId: "presentation.synthetic",
        answerChoiceId: "choice.synthetic", correct: n % 4 !== 0, rating: n % 4 ? "Good" : "Again", reviewedAtMs, facilityTick: n,
        schedulerLog: next.log });
    }
  }
  const frozen = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c => c.participant?.kind === "employee_discussion")!;
  for (let n = 0; n < 80; n++) {
    const id = `discussion.synthetic.${n}`;
    state.employeeDiscussions ??= {};
    const answers = frozen.decisionNodes.map(node => ({ decisionNodeId: node.id, primaryConceptId: node.primaryConceptId,
      answerChoiceId: node.answerChoices.find(c => c.isCorrect)!.id, correct: true, ratingIntent: "Good" as const,
      answeredAtFacilityTick: n, explanation: node.explanation, correctedForward: false }));
    state.employeeDiscussions[id] = { id, employeeId: "employee.synthetic", employeeDisplayName: "Test colleague",
      employeeAppearance: state.founder.appearance, clinicalReleaseId: state.clinicalReleaseId, frozenCase: structuredClone(frozen),
      lifecycle: "resolved", createdAtFacilityTick: n, resolvedAtFacilityTick: n, firstOpenedAtTick: n, cancellationReason: null,
      currentNodeIndex: frozen.decisionNodes.length - 1, answers, steps: frozen.decisionNodes.map((node, index) => ({
        nodeIndex: index, decisionNodeId: node.id, questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
        status: "completed", answer: answers[index]!, result: null })) } satisfies EmployeeDiscussionState;
  }
  state.reviewIntents = Array.from({ length: 1000 }, (_, n) => ({ id: `intent.synthetic.${n}`, encounterId: `retired.synthetic.${n}`,
    decisionNodeId: "node.synthetic", primaryConceptId: "concept.synthetic", rating: "Good", facilityTick: n, reviewedAtMs: n }));
  state.settlements = Array.from({ length: 1000 }, (_, n) => ({ id: `settlement.synthetic.${n}`, encounterId: `retired.synthetic.${n}`,
    completionRevenue: 20, qualityRevenueBonus: 1.25, incorrectFinancialConsequence: 0, netCashDelta: 21.25, satisfactionDelta: 0,
    clinicalXpAwarded: 0, correctAnswers: 1, incorrectAnswers: 0, terminalOutcomeSeverity: null, settledAtFacilityTick: n }));
  state.serviceIncomeReceipts = Array.from({ length: 1200 }, (_, n) => outsideReadReceipt(n, state.facilityTick - 599 + Math.floor(n / 2)));
  return state;
}

export function outsideReadReceipt(n: number, tick: number): ServiceIncomeReceipt {
  return { id: `receipt.synthetic.${n}`, transactionKey: `income.outside-read.${n}`, incomeLineId: "income.radiologist_outside_read",
    actorKind: "remote", actorId: "employee.synthetic.radiologist", catalogVersion: 1, routeId: null,
    grossAmount: 12.5 + n % 3, netCashDelta: 12.5 + n % 3, stockCost: 0, completedAtFacilityTick: tick };
}
