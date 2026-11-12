import type { GameState } from "@gamify-surgery/game-domain";
const counts = new WeakMap<GameState["learningHistories"], number>();
/** Worker-published histories are deeply immutable and shared until a review
 * changes them. Mutable local/QA callers always read their current values. */
export function learningReviewCount(histories: GameState["learningHistories"], immutable = false): number {
  const cached = immutable ? counts.get(histories) : undefined;
  if (cached !== undefined) return cached;
  const total = Object.values(histories).reduce((sum, history) => sum + history.reviews.length, 0);
  if (immutable) counts.set(histories, total);
  return total;
}
