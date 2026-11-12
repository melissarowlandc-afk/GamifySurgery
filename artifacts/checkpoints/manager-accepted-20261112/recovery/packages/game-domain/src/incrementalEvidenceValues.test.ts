import { expect, it } from "vitest";
import { normalizeEvidence } from "./game-evidence-index";
import { freezeEvidence } from "./game-evidence-json";
import { isImmutableEvidenceJson, normalizeEvidenceShared } from "./incrementalEvidenceValues";

it("keeps retained frozen rows by identity when pruning shifts their index", () => {
  const rows = freezeEvidence(Array.from({ length: 500 }, (_, id) => ({ id, value: { text: `row.${id}`, amount: id * 3 } })));
  const previous = freezeEvidence({ rows });
  const input = { rows: [...rows.slice(1), { id: 501, value: { text: "new", amount: 3 } }] };
  const expected = normalizeEvidence(input, previous), actual = normalizeEvidenceShared(input, previous);
  expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  expect(actual.rows[0]).toBe(rows[1]); expect(actual.rows[498]).toBe(rows[499]);
  expect(JSON.stringify(previous)).toBe(JSON.stringify({ rows }));
});

it("matches normalization, key order and omissions without trusting shallow freezes or accessors", () => {
  const nested = { x: 2 }, shallow = Object.freeze({ nested });
  const getters = Object.freeze({ get count() { return 4; } });
  const toJSON = Object.freeze({ toJSON: () => ({ converted: true }) });
  const sparse = Object.freeze(Array(2));
  for (const value of [shallow, getters, toJSON, sparse, Object.freeze({ undefined, n: Infinity }),
    { reordered: { z: 1, a: 2 }, absent: undefined, array: [undefined, NaN, -0] },
    JSON.parse('{"__proto__":{"preserved":true},"x":2}')]) {
    const previous = { reordered: { a: 2, z: 1 }, array: [0] };
    expect(JSON.stringify(normalizeEvidenceShared(value, previous as typeof value)))
      .toBe(JSON.stringify(normalizeEvidence(value, previous as typeof value)));
  }
  expect(isImmutableEvidenceJson(shallow)).toBe(false); nested.x = 9;
  expect(normalizeEvidenceShared(shallow)).toEqual({ nested: { x: 9 } });
  expect(isImmutableEvidenceJson(getters)).toBe(false); expect(isImmutableEvidenceJson(sparse)).toBe(false);
  expect(isImmutableEvidenceJson(toJSON)).toBe(false);
});

it("shares unchanged operational records by actual ID after pruning without changing row or property order", () => {
  const previous = freezeEvidence([{ id: "old", n: 1 }, { id: "kept", nested: { a: 2, z: 3 } }]);
  const input = [JSON.parse(JSON.stringify(previous[1])), { id: "new", n: 4 }];
  const actual = normalizeEvidenceShared(input, previous);
  expect(JSON.stringify(actual)).toBe(JSON.stringify(normalizeEvidence(input, previous)));
  expect(actual[0]).toBe(previous[1]);
  const reordered: typeof previous = [{ id: "kept", nested: { z: 3, a: 2 } }];
  expect(JSON.stringify(normalizeEvidenceShared(reordered, previous)))
    .toBe(JSON.stringify(normalizeEvidence(reordered, previous)));
});

it("matches long evolving JSON normalization across additions, removal, reorder and nonfinite values", () => {
  let previous: Record<string, unknown> = freezeEvidence({ rows: [] });
  for (let step = 0; step < 200; step++) {
    const rows = (previous.rows as unknown[]).slice(-25);
    rows.push({ id: step, payload: { n: step % 3 ? step : NaN, optional: step % 2 ? undefined : null } });
    const next = { ...(step % 2 ? { clock: step, rows } : { rows, clock: step }), extra: step % 5 ? undefined : [null, 2] };
    const expected = normalizeEvidence(next, previous as typeof next), actual = normalizeEvidenceShared(next, previous as typeof next);
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
    previous = freezeEvidence(actual);
  }
});
