import type { GameState } from "@gamify-surgery/game-domain";

type History = GameState["learningHistories"][string];
type FormatStatus = (history: History | undefined) => string;
const counts = new WeakMap<GameState["learningHistories"], { reviewed: number; total: number }>();
const labels = new WeakMap<FormatStatus, WeakMap<History, string>>();

/** Account evidence histories are deeply immutable and are shared by ticks.
 * Count reviews and format historical dates once per changed history. Mutable
 * owner/QA fixtures remain live; catalog labels/order are always read afresh.
 */
export function createLearningDevelopmentView(state: GameState,
  concepts: readonly { id: string; displayName: string }[], formatStatus: FormatStatus) {
  const histories = state.learningHistories;
  let count = counts.get(histories);
  if (!count) {
    const entries = Object.values(histories);
    count = { reviewed: entries.filter(history => history.reviews.length > 0).length, total: entries.length };
    if (Object.isFrozen(histories) && entries.every(history => Object.isFrozen(history) && Object.isFrozen(history.reviews)))
      counts.set(histories, count);
  }
  let formatted = labels.get(formatStatus);
  if (!formatted) { formatted = new WeakMap(); labels.set(formatStatus, formatted); }
  return {
    learningHistoryLabel: `${count.reviewed} reviewed / ${count.total} available`,
    learningCards: concepts.map(concept => {
      const history = histories[concept.id];
      let statusLabel = history ? formatted!.get(history) : undefined;
      if (statusLabel === undefined) {
        statusLabel = formatStatus(history);
        if (history && Object.isFrozen(history) && Object.isFrozen(history.card) && Object.isFrozen(history.reviews) &&
          Object.isFrozen(history.reviews.at(-1))) formatted!.set(history, statusLabel);
      }
      return { conceptId: concept.id, conceptLabel: concept.displayName, statusLabel };
    }),
  };
}
