/** Small persistent hash trie. Branches share prefixes; appending a command
 * never copies a campaign-sized Map and never mutates a sibling checkpoint. */
interface Node<T> {
  readonly children?: readonly (Node<T> | undefined)[];
  readonly digest?: number;
  readonly entries?: readonly (readonly [string, T])[];
}
function hash(key: string): number {
  let value = 2166136261;
  for (let i = 0; i < key.length; i++) value = Math.imul(value ^ key.charCodeAt(i), 16777619);
  return value >>> 0;
}
export class EvidenceIndex<T> {
  private constructor(private readonly root: Node<T>) {}
  static empty<T>(): EvidenceIndex<T> { return new EvidenceIndex<T>({}); }
  get(key: string): T | undefined {
    let node: Node<T> | undefined = this.root;
    const digest = hash(key); let depth = 0;
    while (node?.children) node = node.children[(digest >>> (depth++ * 4)) & 15];
    return node?.entries?.find(entry => entry[0] === key)?.[1];
  }
  has(key: string): boolean { return this.get(key) !== undefined; }
  with(key: string, value: T): EvidenceIndex<T> {
    const digest = hash(key);
    const insert = (node: Node<T> | undefined, depth: number): Node<T> => {
      if (!node || !node.children && !node.entries) return { digest, entries: [[key, value]] };
      if (node.entries && node.digest === digest) return { digest, entries: [...node.entries.filter(entry => entry[0] !== key), [key, value]] };
      const slot = (digest >>> (depth * 4)) & 15, children = node.children?.slice() ?? [];
      if (node.entries) {
        const previousSlot = (node.digest! >>> (depth * 4)) & 15;
        children[previousSlot] = node;
      }
      children[slot] = insert(children[slot], depth + 1);
      return { children };
    };
    return new EvidenceIndex(insert(this.root, 0));
  }
}

/** Normalize the domain's plain JSON trees with structural sharing. This has
 * JSON round-trip semantics for domain values (undefined object fields are
 * omitted, missing/undefined array items become null, nonfinite numbers null).
 * Unlike stringify/parse it allocates only changed subtrees. */
export function normalizeEvidence<T>(input: T, previous?: T): T {
  const normalize = (value: unknown, old: unknown, arrayItem = false): unknown => {
    if (value === old && value !== undefined) return old;
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number") return Number.isFinite(value) ? (value === 0 ? 0 : value) : null;
    if (typeof value === "bigint") throw new TypeError("Do not know how to serialize a BigInt");
    if (value === undefined || typeof value === "function" || typeof value === "symbol") return arrayItem ? null : undefined;
    if (typeof (value as { toJSON?: unknown }).toJSON === "function") {
      return normalize((value as { toJSON(): unknown }).toJSON(), old, arrayItem);
    }
    if (Array.isArray(value)) {
      const prior = Array.isArray(old) ? old : undefined;
      let result: unknown[] | undefined;
      for (let i = 0; i < value.length; i++) {
        const next = normalize(value[i], prior?.[i], true);
        if (!result && (!prior || i >= prior.length || next !== prior[i])) result = prior ? prior.slice(0, i) : [];
        if (result) result.push(next);
      }
      return result ?? (prior?.length === value.length ? prior : prior?.slice(0, value.length) ?? []);
    }
    const source = value as Record<string, unknown>;
    const prior = old !== null && typeof old === "object" && !Array.isArray(old) ? old as Record<string, unknown> : undefined;
    const keys = Object.keys(source).filter(key => source[key] !== undefined && typeof source[key] !== "function" && typeof source[key] !== "symbol");
    const oldKeys = prior ? Object.keys(prior) : [];
    // Property order is observable in saved JSON, even when canonical equality
    // considers reordered object keys equal.
    let same = Boolean(prior) && keys.length === oldKeys.length && keys.every((key, index) => key === oldKeys[index]);
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
