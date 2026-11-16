import type { ConceptLearningHistory, GameState } from "./types";

export const getConceptReviewCount = (history: ConceptLearningHistory | undefined): number =>
  history ? (history.retiredReviewCount ?? 0) + history.reviews.length : 0;
export const getReviewIntentCount = (state: Pick<GameState, "reviewIntents" | "historyCompaction">): number =>
  (state.historyCompaction?.retiredReviewIntentCount ?? 0) + state.reviewIntents.length;
export const getSettlementCount = (state: Pick<GameState, "settlements" | "historyCompaction">): number =>
  (state.historyCompaction?.settlements?.count ?? 0) + state.settlements.length;
export const getCompactedOutsideReadReceipts = (state: Pick<GameState, "historyCompaction">) =>
  state.historyCompaction?.outsideReadReceipts ?? [];
