import { freezeOperationalValue } from "./operationalFreeze";

/** Private worker transport, not a save/journal format. Preserve raw field
 * presence and order (including undefined fields) through structuredClone.
 * ID-aligned array ranges retain old rows when bounded histories are pruned.
 */
export type OperationalStatePatch =
  | { kind: "replace"; value: unknown }
  | { kind: "object"; keys?: string[]; changes: [string, OperationalStatePatch][] }
  | { kind: "array"; length: number; segments: ({ from: number; count: number } | { values: unknown[] })[]; changes: [number, OperationalStatePatch][] };

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const id = (value: unknown): string | undefined => {
  if (!record(value)) return undefined;
  const descriptor = Object.getOwnPropertyDescriptor(value, "id");
  return descriptor && "value" in descriptor && typeof descriptor.value === "string" ? descriptor.value : undefined;
};

export function operationalStatePatch(before: unknown, after: unknown): OperationalStatePatch | undefined {
  if (Object.is(before, after)) return undefined;
  if (Array.isArray(before) && Array.isArray(after)) {
    const changes: [number, OperationalStatePatch][] = [];
    const segments: ({ from: number; count: number } | { values: unknown[] })[] = [];
    let byId: Map<string, number> | undefined;
    if (before.length && after.length && before.every(row => id(row) !== undefined) && after.every(row => id(row) !== undefined)) {
      const oldIds = before.map(row => id(row)!), newIds = after.map(row => id(row)!);
      if (new Set(oldIds).size === oldIds.length && new Set(newIds).size === newIds.length)
        byId = new Map(oldIds.map((key, index) => [key, index]));
    }
    let changedOrder = before.length !== after.length;
    for (let i = 0; i < after.length; i++) {
      const prior = byId ? byId.get(id(after[i])!) : i < before.length ? i : undefined;
      const last = segments.at(-1);
      if (prior === undefined) {
        if (last && "values" in last) last.values.push(after[i]);
        else segments.push({ values: [after[i]] });
        changedOrder = true;
      } else {
        if (last && "from" in last && last.from + last.count === prior) last.count++;
        else segments.push({ from: prior, count: 1 });
        if (prior !== i) changedOrder = true;
        const patch = operationalStatePatch(before[prior], after[i]);
        if (patch) changes.push([i, patch]);
      }
    }
    return changedOrder || changes.length ? { kind: "array", length: after.length, segments, changes } : undefined;
  }
  if (record(before) && record(after)) {
    const oldKeys = Object.keys(before), keys = Object.keys(after), changes: [string, OperationalStatePatch][] = [];
    const sameKeys = oldKeys.length === keys.length && keys.every((key, i) => key === oldKeys[i]);
    for (const key of keys) {
      const patch = Object.hasOwn(before, key) ? operationalStatePatch(before[key], after[key]) : { kind: "replace" as const, value: after[key] };
      if (patch) changes.push([key, patch]);
    }
    if (sameKeys && !changes.length) return undefined;
    return { kind: "object", ...(sameKeys ? {} : { keys }), changes };
  }
  return { kind: "replace", value: after };
}

const corrupt = (): never => { throw new Error("Operational state patch does not match its base."); };
const integer = (value: number) => Number.isSafeInteger(value) && value >= 0;
const put = (object: Record<string, unknown>, key: string, value: unknown) => {
  // The sole inherited setter on an ordinary JSON object needs a data property.
  if (key === "__proto__") Object.defineProperty(object, key, { value, enumerable: true, configurable: true, writable: true });
  else object[key] = value;
};

/** Pure copy-on-write application. The caller owns an immutable private base;
 * failure cannot partially mutate it. Frozen subtrees need no repeated copies.
 */
export function applyOperationalStatePatch<T>(base: T, patch: OperationalStatePatch | undefined, adopt = false): T {
  // Owned client bases are already deeply frozen. Adopt new values and freeze
  // assembled parents once, without re-walking unchanged array/history rows.
  if (adopt) freezeOperationalValue(base);
  if (!patch) return base;
  if (patch.kind === "replace") return (adopt ? freezeOperationalValue(patch.value) : patch.value) as T;
  if (patch.kind === "object") {
    if (!record(base)) return corrupt();
    if (!patch.keys) {
      // Most transported objects retain their keys. Native spread preserves
      // their string-key order and copies __proto__ as data; touch only edits.
      const result: Record<string, unknown> = { ...base }, changed = new Set<string>();
      for (const [key, child] of patch.changes) {
        if (typeof key !== "string" || !Object.hasOwn(base, key) || changed.has(key)) return corrupt();
        changed.add(key); put(result, key, applyOperationalStatePatch(base[key], child, adopt));
      }
      return (adopt ? Object.freeze(result) : result) as T;
    }
    const edits = new Map(patch.changes);
    if (edits.size !== patch.changes.length || patch.changes.some(([key]) => typeof key !== "string")) return corrupt();
    const result: Record<string, unknown> = {};
    if (patch.keys) {
      if (new Set(patch.keys).size !== patch.keys.length || patch.keys.some(key => typeof key !== "string") ||
          [...edits.keys()].some(key => !patch.keys!.includes(key))) return corrupt();
      for (const key of patch.keys) {
        if (!Object.hasOwn(base, key) && !edits.has(key)) return corrupt();
        put(result, key, edits.has(key) ? applyOperationalStatePatch(base[key], edits.get(key), adopt) : base[key]);
      }
    }
    return (adopt ? Object.freeze(result) : result) as T;
  }
  if (patch.kind !== "array" || !Array.isArray(base) || !integer(patch.length) || patch.length > 300_000) return corrupt();
  const only = patch.segments.length === 1 ? patch.segments[0] : undefined;
  const entire = only && !("values" in only) && "from" in only && only.from === 0 && only.count === base.length && patch.length === base.length;
  const result: unknown[] = entire ? [...base] : [];
  for (const segment of entire ? [] : patch.segments) {
    if ("values" in segment) {
      if (!Array.isArray(segment.values) || result.length + segment.values.length > patch.length) return corrupt();
      for (const value of segment.values) result.push(adopt ? freezeOperationalValue(value) : value);
    } else {
      if (!integer(segment.from) || !integer(segment.count) || segment.from + segment.count > base.length || result.length + segment.count > patch.length) return corrupt();
      for (let i = 0; i < segment.count; i++) result.push(base[segment.from + i]);
    }
  }
  if (result.length !== patch.length) return corrupt();
  const changed = new Set<number>();
  for (const [index, child] of patch.changes) {
    if (!integer(index) || index >= result.length || changed.has(index)) return corrupt();
    changed.add(index); result[index] = applyOperationalStatePatch(result[index], child, adopt);
  }
  return (adopt ? Object.freeze(result) : result) as T;
}
