import type { GameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView, type PrototypePlayerView } from "../viewModels";
import { createPatientAvailabilityGuidance } from "../patientAvailabilityViewModel";
import type { OperationalViewArguments } from "./operationalViewProjection";

const normalized = (args: OperationalViewArguments): OperationalViewArguments => [args[0], args[1], args[2], args[3] ?? false,
  args[4] ?? null, args[5] ?? 0, undefined, args[7] ?? [], args[8] === undefined ? false : args[8]];

/** Cache the broad view by published state and projection inputs. An explicit
 * camera request only decorates that view for callers using the older API. */
export class OperationalSessionView {
  private readonly supplied = new WeakMap<GameState, { key: string; view: PrototypePlayerView }>();
  private fallback?: { state: GameState; key: string; view: PrototypePlayerView };
  private desiredKey: string | null = null;
  constructor(private readonly install: (args: OperationalViewArguments) => void) {}
  publish(state: GameState, args: OperationalViewArguments | undefined, view: PrototypePlayerView | undefined): void {
    if (args && view) this.supplied.set(state, { key: JSON.stringify(normalized(args)),
      view: args[6] ? { ...view, facility: { ...view.facility, camera: { zoom: 1, panX: 0, panY: 0 } } } : view });
  }
  read(state: GameState, args: OperationalViewArguments): PrototypePlayerView {
    const values = normalized(args), key = JSON.stringify(values);
    if (key !== this.desiredKey) { this.desiredKey = key; this.install(values); }
    const cached = this.supplied.get(state);
    let view: PrototypePlayerView;
    if (cached?.key === key) {
      this.fallback = undefined;
      view = { ...cached.view, patientAvailabilityGuidance: createPatientAvailabilityGuidance(state, Date.now()) };
    } else if (this.fallback?.state === state && this.fallback.key === key) {
      view = { ...this.fallback.view, patientAvailabilityGuidance: createPatientAvailabilityGuidance(state, Date.now()) };
    } else {
      view = createPrototypePlayerView(state, ...values);
      this.fallback = { state, key, view };
    }
    return args[6] ? { ...view, facility: { ...view.facility, camera: args[6] } } : view;
  }
}
