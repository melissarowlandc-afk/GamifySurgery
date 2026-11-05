import type { GameState } from "./types";

/** Tick-owned simulation data is mutable. Learning/review records and frozen
 * cases are written only by explicit commands; existing event/financial rows
 * are immutable and ticks append/prune their privately owned arrays instead.
 *
 * Keep these large immutable values outside the JSON clone. Null placeholders
 * retain every original property position, so restoring references preserves
 * the exact old JSON bytes. No marker strings, schema fields, state migration,
 * validation, domain decisions or persistence behavior are introduced here.
 */
export function cloneTickState(state: GameState): GameState {
  const encounters = Object.fromEntries(Object.entries(state.encounters)
    .map(([id, encounter]) => [id, { ...encounter, frozenCase: null }]));
  const discussions = state.employeeDiscussions && Object.fromEntries(Object.entries(state.employeeDiscussions)
    .map(([id, discussion]) => [id, { ...discussion, frozenCase: null }]));
  const mutable = { ...state, learningHistories: null, reviewIntents: null, schedulerPins: null,
    events: null, settlements: null, serviceIncomeReceipts: null, encounters,
    ...(discussions ? { employeeDiscussions: discussions } : {}) };
  const next = JSON.parse(JSON.stringify(mutable)) as GameState;
  next.learningHistories = state.learningHistories;
  next.reviewIntents = state.reviewIntents;
  next.schedulerPins = state.schedulerPins;
  next.events = state.events.slice();
  next.settlements = state.settlements.slice();
  next.serviceIncomeReceipts = state.serviceIncomeReceipts.slice();
  for (const [id, encounter] of Object.entries(state.encounters)) next.encounters[id]!.frozenCase = encounter.frozenCase;
  for (const [id, discussion] of Object.entries(state.employeeDiscussions ?? {})) next.employeeDiscussions![id]!.frozenCase = discussion.frozenCase;
  return next;
}
