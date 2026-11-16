import type { GameState } from "./types";

type Branch = "root" | "encounters" | "discussions" | "encounter" | "operations" | "operation" | "steps" | "step" | "other";
const sharedRoots = new Set(["learningHistories", "reviewIntents", "schedulerPins"]);
const rowCollections = new Set(["events", "settlements", "serviceIncomeReceipts"]);

/** Tick ownership, with ordinary mutable objects/arrays rather than a Proxy.
 * Copy operational branches directly instead of serializing their strings.
 * Immutable answers, order provenance and receipt rows are only appended/replaced by
 * commands; tick controllers never edit their existing payloads in place.
 * Explicit non-tick commands keep their existing full ownership boundary.
 */
export function cloneIncrementalTickState(state: GameState): GameState {
  const copy = (value: unknown, branch: Branch = "other", arrayItem = false): unknown => {
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number") return Number.isFinite(value) ? value === 0 ? 0 : value : null;
    if (value === undefined || typeof value === "function" || typeof value === "symbol") return arrayItem ? null : undefined;
    if (typeof value === "bigint") throw new TypeError("Do not know how to serialize a BigInt");
    if (Array.isArray(value)) {
      const itemBranch = branch === "operations" ? "operation" : branch === "steps" ? "step" : "other";
      const result = new Array<unknown>(value.length);
      for (let i = 0; i < value.length; i++) result[i] = copy(value[i], itemBranch, true);
      return result;
    }
    const object = value as Record<string, unknown>;
    if (Object.getPrototypeOf(object) !== Object.prototype && Object.getPrototypeOf(object) !== null || "toJSON" in object)
      return JSON.parse(JSON.stringify(value));
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(object)) {
      let next: unknown;
      if (branch === "root" && sharedRoots.has(key) || branch === "encounter" && (key === "frozenCase" || key === "answers") ||
          branch === "step" && key === "answer" || branch === "operation" && key === "testChoiceOrder") next = object[key];
      else if (branch === "root" && rowCollections.has(key)) next = (object[key] as unknown[]).slice();
      else if (branch === "root" && key === "operationReceipts") next = { ...object[key] as object };
      else {
        const childBranch: Branch = branch === "root"
          ? key === "encounters" ? "encounters" : key === "employeeDiscussions" ? "discussions" : key === "serviceOperations" ? "operations" : "other"
          : branch === "encounters" || branch === "discussions" ? "encounter" : branch === "encounter" && key === "steps" ? "steps" : "other";
        next = copy(object[key], childBranch);
      }
      if (next === undefined || typeof next === "function" || typeof next === "symbol") continue;
      if (key === "__proto__") Object.defineProperty(result, key, { value: next, enumerable: true, configurable: true, writable: true });
      else result[key] = next;
    }
    return result;
  };
  return copy(state, "root") as GameState;
}
