import type { GameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView, type PrototypePlayerView } from "../viewModels";
import { createPatientAvailabilityGuidance } from "../patientAvailabilityViewModel";
import type { OperationalViewArguments } from "./operationalViewProjection";

const normalized = (args: OperationalViewArguments): OperationalViewArguments => [args[0], args[1], args[2], args[3] ?? false,
  args[4] ?? null, args[5] ?? 0, args[6] ?? { zoom: 1, panX: 0, panY: 0 }, args[7] ?? [], args[8] === undefined ? false : args[8]];

/** A view belongs to one immutable published state AND all render inputs.
 * A changed camera, selection, review flag or mode uses the existing projection
 * immediately and installs those small inputs for the next worker command.
 * Pure UI changes never enqueue game commands or change save/clock policy.
 */
export class OperationalSessionView {
  private readonly supplied = new WeakMap<GameState, { key: string; view: PrototypePlayerView }>();
  private desiredKey: string | null = null;
  constructor(private readonly install: (args: OperationalViewArguments) => void) {}
  publish(state: GameState, args: OperationalViewArguments | undefined, view: PrototypePlayerView | undefined): void {
    if (args && view) this.supplied.set(state, { key: JSON.stringify(normalized(args)), view });
  }
  read(state: GameState, args: OperationalViewArguments): PrototypePlayerView {
    const values = normalized(args), key = JSON.stringify(values);
    if (key !== this.desiredKey) { this.desiredKey = key; this.install(values); }
    const cached = this.supplied.get(state);
    if (cached?.key === key) return { ...cached.view, patientAvailabilityGuidance: createPatientAvailabilityGuidance(state, Date.now()) };
    return createPrototypePlayerView(state, ...args);
  }
}
