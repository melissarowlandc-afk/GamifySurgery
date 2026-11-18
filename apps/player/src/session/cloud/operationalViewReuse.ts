import { isImmutableEvidenceJson, type GameState } from "@gamify-surgery/game-domain";
import type { PrototypePlayerView } from "../viewModels";
import { createPatientAvailabilityGuidance } from "../patientAvailabilityViewModel";
import { createOperationalPlayerView, type OperationalViewArguments } from "./operationalViewProjection";

// Ordered, data-only comparison. Non-plain values/accessors take the normal
// projection path. Keep undefined/null, omitted arguments and key order distinct.
function sameInput(a: unknown, b: unknown, seen = new WeakMap<object, object>()): boolean {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const prototype = Object.getPrototypeOf(a);
  if (prototype !== Object.getPrototypeOf(b) || prototype !== Object.prototype && prototype !== Array.prototype) return false;
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);
  const keys = Object.keys(a), other = Object.keys(b);
  const arrayLengthKey = Array.isArray(a) ? 1 : 0;
  if (Reflect.ownKeys(a).length !== keys.length + arrayLengthKey ||
      Reflect.ownKeys(b).length !== other.length + arrayLengthKey) return false;
  return keys.length === other.length && (!Array.isArray(a) || a.length === (b as unknown[]).length) && keys.every((key, i) => {
    const left = Object.getOwnPropertyDescriptor(a, key), right = Object.getOwnPropertyDescriptor(b, key);
    return key === other[i] && left && right && "value" in left && "value" in right && sameInput(left.value, right.value, seen);
  });
}

/** One engine-owned projection, invalidated by any new state or presentation
 * input. Camera requests cannot change simulation-derived fields; only the
 * availability guidance has a wall-clock input and must always be resampled.
 */
export class OperationalViewReuse {
  private previous?: { state: GameState; args: OperationalViewArguments; view: PrototypePlayerView };

  project(state: GameState, args: OperationalViewArguments, asOfRealMs: number): PrototypePlayerView {
    const old = this.previous;
    const reuse = old && state === old.state && Object.isFrozen(state) && isImmutableEvidenceJson(state) && args.length === old.args.length &&
      args.every((value, index) => index === 6 || sameInput(value, old.args[index]));
    const view = reuse ? { ...old.view,
      facility: { ...old.view.facility, camera: args[6] === undefined ? { zoom: 1, panX: 0, panY: 0 } : args[6] },
      patientAvailabilityGuidance: createPatientAvailabilityGuidance(state, asOfRealMs),
    } : createOperationalPlayerView(state, args, asOfRealMs);
    // Copy the small argument tuple: callers may reuse/mutate their camera or
    // flag array after sending a request. Exotic generic inputs simply opt out.
    try { this.previous = { state, args: structuredClone(args), view }; }
    catch { this.previous = undefined; }
    return view;
  }
}
