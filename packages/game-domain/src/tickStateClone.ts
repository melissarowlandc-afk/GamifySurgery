import type { GameState } from "./types";
import { cloneIncrementalTickState } from "./incrementalTickClone";

/** Tick-owned mutable branches use the existing direct JSON-semantic clone.
 * Immutable learning, frozen cases, answers and append-only receipt payloads
 * retain their references. No JSON string or serialized full-state scratch copy
 * is allocated on a clock pulse. Non-tick ownership boundaries are unchanged.
 */
export function cloneTickState(state: GameState): GameState {
  return cloneIncrementalTickState(state);
}
