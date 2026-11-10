import { afterEach, expect, it, vi } from 'vitest';
import { applyOperationalStatePatch, operationalStatePatch, type OperationalStatePatch } from './operationalStatePatch';

afterEach(() => vi.unstubAllGlobals());

it('allocates no full ID maps for settled-order histories and sends only changed fields', () => {
  const before = Array.from({ length: 5000 }, (_, n) => Object.freeze({ id: `row.${n}`, n, text: 'public fixture '.repeat(20) }));
  const after = [...before]; after[23] = { ...after[23]!, n: 9999 };
  let maps = 0; const NativeMap = Map;
  vi.stubGlobal('Map', class extends NativeMap { constructor(...args: any[]) { super(...args as []); maps++; } });
  const patch = operationalStatePatch(before, after);
  expect(maps).toBe(0); // Deterministic allocation budget; independent of CI/GC timing.
  vi.unstubAllGlobals();
  expect(JSON.stringify(patch).length).toBeLessThan(250);
  expect(JSON.stringify(applyOperationalStatePatch(before, structuredClone(patch), true))).toBe(JSON.stringify(after));
});

it('keeps exact values and ordering through long mixed histories, duplicates, missing IDs and index shifts', () => {
  let before: unknown[] = [];
  for (let n = 0; n < 500; n++) {
    const after = Array.from({ length: 40 + n % 5 }, (_, i) => i % 7 === 0 ? { n, i } : { id: `row.${n % 3 ? n + i : i % 5}`, n, value: { i } });
    if (n % 2) after.reverse();
    const patch = operationalStatePatch(before, after);
    expect(patch).toStrictEqual(referencePatch(before, after));
    const actual = applyOperationalStatePatch(before, structuredClone(patch), true);
    expect(JSON.stringify(actual)).toBe(JSON.stringify(after));
    before = actual;
  }
});

// Frozen pre-pass transport generator: verify byte/field/order equivalence,
// including duplicate IDs. Keep independent of the optimized implementation.
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const id = (value: unknown): string | undefined => {
  if (!record(value)) return undefined;
  const descriptor = Object.getOwnPropertyDescriptor(value, "id");
  return descriptor && "value" in descriptor && typeof descriptor.value === "string" ? descriptor.value : undefined;
};

export function referencePatch(before: unknown, after: unknown): OperationalStatePatch | undefined {
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
        const patch = referencePatch(before[prior], after[i]);
        if (patch) changes.push([i, patch]);
      }
    }
    return changedOrder || changes.length ? { kind: "array", length: after.length, segments, changes } : undefined;
  }
  if (record(before) && record(after)) {
    const oldKeys = Object.keys(before), keys = Object.keys(after), changes: [string, OperationalStatePatch][] = [];
    const sameKeys = oldKeys.length === keys.length && keys.every((key, i) => key === oldKeys[i]);
    for (const key of keys) {
      const patch = Object.hasOwn(before, key) ? referencePatch(before[key], after[key]) : { kind: "replace" as const, value: after[key] };
      if (patch) changes.push([key, patch]);
    }
    if (sameKeys && !changes.length) return undefined;
    return { kind: "object", ...(sameKeys ? {} : { keys }), changes };
  }
  return { kind: "replace", value: after };
}

