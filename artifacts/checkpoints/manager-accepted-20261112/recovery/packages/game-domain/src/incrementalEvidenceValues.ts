/** A proof cache, not an Object.isFrozen shortcut: shallow-frozen objects,
 * accessors, sparse arrays, toJSON and non-JSON values are never admitted.
 * Frozen normalized rows remain valid when pruning moves their array index.
 */
class FrozenJsonValues {
  private readonly known = new WeakSet<object>();

  remember(value: unknown, active?: Set<object>): boolean {
    if (value === null || typeof value === "string" || typeof value === "boolean") return true;
    if (typeof value === "number") return Number.isFinite(value) && !Object.is(value, -0);
    if (typeof value !== "object") return false;
    if (this.known.has(value)) return true;
    if (!Object.isFrozen(value) || active?.has(value) || "toJSON" in value || Object.getOwnPropertySymbols(value).length) return false;
    const array = Array.isArray(value), prototype = Object.getPrototypeOf(value);
    if (prototype !== (array ? Array.prototype : Object.prototype)) return false;
    const descriptors = Object.getOwnPropertyDescriptors(value), keys = Object.keys(value);
    if (Object.keys(descriptors).length !== keys.length + (array ? 1 : 0) || array && keys.length !== value.length) return false;
    active ??= new Set(); active.add(value);
    try {
      for (const key of keys) {
        const descriptor = descriptors[key]!;
        if (!("value" in descriptor) || !this.remember(descriptor.value, active)) return false;
      }
    } finally { active.delete(value); }
    this.known.add(value);
    return true;
  }
}

const frozenJson = new FrozenJsonValues();
export const isImmutableEvidenceJson = (value: object): boolean => frozenJson.remember(value);

/** Exact plain-JSON normalization with positional sharing plus immutable-value
 * sharing. A retained event/income row needs no recursive comparison against a
 * different row merely because append/pruning shifted its array position.
 */
export function normalizeEvidenceShared<T>(input: T, previous?: T): T {
  if (previous !== undefined) frozenJson.remember(previous);
  const normalize = (value: unknown, old: unknown, arrayItem = false): unknown => {
    if (value === old && value !== undefined) return old;
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number") return Number.isFinite(value) ? (value === 0 ? 0 : value) : null;
    if (typeof value === "bigint") throw new TypeError("Do not know how to serialize a BigInt");
    if (value === undefined || typeof value === "function" || typeof value === "symbol") return arrayItem ? null : undefined;
    if (frozenJson.remember(value)) return value;
    if (typeof (value as { toJSON?: unknown }).toJSON === "function") return normalize((value as { toJSON(): unknown }).toJSON(), old, arrayItem);
    if (Array.isArray(value)) {
      const prior = Array.isArray(old) ? old : undefined;
      const identity = (item: unknown): string | undefined => {
        if (item === null || typeof item !== "object" || Array.isArray(item)) return undefined;
        const descriptor = Object.getOwnPropertyDescriptor(item, "id");
        return descriptor && "value" in descriptor && typeof descriptor.value === "string" ? descriptor.value : undefined;
      };
      const alignedRows = prior && identity(prior[0]) !== undefined;
      let byId: Map<string, unknown> | undefined;
      let result: unknown[] | undefined;
      for (let i = 0; i < value.length; i++) {
        let previousItem = prior?.[i];
        if (alignedRows && value[i] !== null && typeof value[i] === "object" && !Object.isFrozen(value[i])) {
          const id = identity(value[i]);
          if (id !== undefined && id !== identity(previousItem)) {
            if (!byId) {
              byId = new Map();
              for (const entry of prior!) { const oldId = identity(entry); if (oldId !== undefined) byId.set(oldId, entry); }
            }
            previousItem = byId.get(id) ?? previousItem;
          }
        }
        const next = normalize(value[i], previousItem, true);
        if (!result && (!prior || i >= prior.length || next !== prior[i])) result = prior ? prior.slice(0, i) : [];
        if (result) result.push(next);
      }
      return result ?? (prior?.length === value.length ? prior : prior?.slice(0, value.length) ?? []);
    }
    const source = value as Record<string, unknown>;
    const prior = old !== null && typeof old === "object" && !Array.isArray(old) ? old as Record<string, unknown> : undefined;
    const keys = Object.keys(source).filter(key => source[key] !== undefined && typeof source[key] !== "function" && typeof source[key] !== "symbol");
    const oldKeys = prior ? Object.keys(prior) : [];
    const same = Boolean(prior) && keys.length === oldKeys.length && keys.every((key, index) => key === oldKeys[index]);
    let result: Record<string, unknown> | undefined = same ? undefined : {};
    for (const key of keys) {
      const child = normalize(source[key], prior?.[key]);
      if (!result && child !== prior?.[key]) result = { ...prior };
      if (result) Object.defineProperty(result, key, { value: child, enumerable: true, writable: true, configurable: true });
    }
    return result ?? prior;
  };
  return normalize(input, previous) as T;
}
