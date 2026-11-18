import type { GameState } from "./types";
import { cloneIncrementalTickState } from "./incrementalTickClone";
import { isImmutableEvidenceJson } from "./incrementalEvidenceValues";

/** Commands own the same operational branches as ticks, plus appendable
 * answers/intents and the concept dictionary. Share only deeply proven JSON
 * evidence; ordinary mutable/legacy callers retain their exact JSON boundary.
 * Card/review writes replace one separately cloned history in the reducer.
 */
export function cloneCommandState(state: GameState): GameState {
  if (!Object.isFrozen(state) || !isImmutableEvidenceJson(state)) return JSON.parse(JSON.stringify(state)) as GameState;
  const next = cloneIncrementalTickState(state);
  if (state.learningHistories) next.learningHistories = { ...state.learningHistories };
  if (Array.isArray(state.reviewIntents)) next.reviewIntents = state.reviewIntents.slice();
  for (const [id, encounter] of Object.entries(state.encounters))
    if (Array.isArray(encounter.answers)) next.encounters[id]!.answers = encounter.answers.slice();
  for (const [id, discussion] of Object.entries(state.employeeDiscussions ?? {}))
    if (Array.isArray(discussion.answers)) next.employeeDiscussions![id]!.answers = discussion.answers.slice();
  return next;
}
