import type { DomainContext, GameState } from "./types";
import { withFacilityNavigationScope } from "./facilityNavigation";

type Queries = WeakMap<GameState, WeakMap<DomainContext, Map<symbol, Map<unknown, unknown>>>>;
let queries: Queries | null = null;
let settledState: GameState | null = null;

export function hasSettledStateQueries(): boolean { return queries !== null; }

/** Cache only during a synchronous, read-only projection. Reducer-owned mutable
 * states never keep results across simulation phases or commands. */
export function withSettledStateQueries<T>(state: GameState, read: () => T): T {
  if (queries && settledState === state) return read();
  const previous = queries, previousState = settledState;
  queries = new WeakMap(); settledState = state;
  try { return withFacilityNavigationScope(read); } finally { queries = previous; settledState = previousState; }
}

export function settledStateQuery<T>(state: GameState, context: DomainContext, namespace: symbol, key: unknown, read: () => T): T {
  if (!queries || state !== settledState) return read();
  let contexts = queries.get(state);
  if (!contexts) { contexts = new WeakMap(); queries.set(state, contexts); }
  let namespaces = contexts.get(context);
  if (!namespaces) { namespaces = new Map(); contexts.set(context, namespaces); }
  let entries = namespaces.get(namespace);
  if (!entries) { entries = new Map(); namespaces.set(namespace, entries); }
  if (!entries.has(key)) entries.set(key, read());
  return entries.get(key) as T;
}
