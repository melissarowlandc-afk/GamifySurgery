import type { GameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView, type PrototypePlayerView } from "../viewModels";
import { createPatientAvailabilityGuidance } from "../patientAvailabilityViewModel";

export type OperationalViewArguments = Parameters<typeof createPrototypePlayerView> extends [GameState, ...infer Rest] ? Rest : never;

/** Reuse the current projection without changing presentation or clinical
 * rules. Its sole wall-clock field is explicitly sampled so a delayed worker
 * result can be compared and refreshed with the same clock input.
 */
export function createOperationalPlayerView(state: GameState, args: OperationalViewArguments, asOfRealMs: number): PrototypePlayerView {
  const view = createPrototypePlayerView(state, ...args);
  view.patientAvailabilityGuidance = createPatientAvailabilityGuidance(state, asOfRealMs);
  return view;
}
