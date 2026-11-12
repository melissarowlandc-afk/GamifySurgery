import { expect, it } from "vitest";
import { operationalStatePatch, applyOperationalStatePatch, type OperationalStatePatch } from "./operationalStatePatch";

it("transports shifted history as ranges and changed rows, with exact values/order and no base mutation", () => {
  const before = { events: Array.from({ length: 500 }, (_, i) => ({ id: `event.${i}`, message: "public example ".repeat(30), tick: i })) };
  const original = JSON.stringify(before);
  const after = { events: [...before.events.slice(1), { id: "new", message: "new", tick: 501 }] };
  const patch = operationalStatePatch(before, after)!;
  expect(JSON.stringify(patch).length).toBeLessThan(600);
  const actual = applyOperationalStatePatch(before, structuredClone(patch));
  expect(JSON.stringify(actual)).toBe(JSON.stringify(after)); expect(JSON.stringify(before)).toBe(original);
  expect(actual.events[0]).toBe(before.events[1]);
});

it("preserves raw property order, undefined presence, prototype-named keys, arrays and duplicate IDs", () => {
  const cases: [unknown, unknown][] = [
    [{ a: 1, b: 2 }, { b: 2, a: 1 }], [{ a: undefined }, {}], [{}, { a: undefined }],
    [JSON.parse('{"__proto__":{"x":1},"a":2}'), JSON.parse('{"a":3,"__proto__":{"x":4}}')],
    [[{ id: "same", n: 1 }, { id: "same", n: 2 }], [{ id: "same", n: 3 }]],
    [[0, 1, 2], [2, 1, 0, undefined]], [[{ x: 1, y: 2 }], [{ x: 4, y: 5 }, { x: 9, y: 1 }]],
    [{ zero: -0, n: NaN }, { zero: 0, n: Infinity }],
  ];
  for (const [before, after] of cases) {
    for (const adopt of [false,true]) {
      const actual = applyOperationalStatePatch(before, structuredClone(operationalStatePatch(before, after)),adopt);
      expect(actual).toEqual(after); expect(JSON.stringify(actual)).toBe(JSON.stringify(after));
      if (actual && typeof actual === "object" && after && typeof after === "object") {
        expect(Object.keys(actual)).toEqual(Object.keys(after));if(adopt)expect(Object.isFrozen(actual)).toBe(true);
      }
    }
  }
});

it("matches long array/order evolutions without retaining a command tail", () => {
  let current: unknown = { list: [], clock: 0 };
  for (let tick = 0; tick < 300; tick++) {
    const list = Array.from({ length: 15 }, (_, i) => ({ id: `row.${tick + i}`, nested: { x: tick + i, optional: i % 2 ? undefined : null } }));
    const next = tick % 2 ? { clock: tick, list } : { list: list.reverse(), clock: tick };
    const patch = operationalStatePatch(current, next);
    current = applyOperationalStatePatch(current, structuredClone(patch));
    expect(JSON.stringify(current)).toBe(JSON.stringify(next));
  }
});

it("adopts changed containers and new values while retaining deeply immutable shifted history",()=>{
  const old={rows:Array.from({length:500},(_,i)=>({id:`shared.${i}`,nested:{value:i}}))};
  applyOperationalStatePatch(old,undefined,true);
  const next={rows:[...old.rows.slice(1),{id:"new",nested:{value:501}}]};
  const result=applyOperationalStatePatch(old,structuredClone(operationalStatePatch(old,next)),true);
  expect(JSON.stringify(result)).toBe(JSON.stringify(next));expect(result.rows[0]).toBe(old.rows[1]);
  expect(Object.isFrozen(result)).toBe(true);expect(Object.isFrozen(result.rows)).toBe(true);
  expect(Object.isFrozen(result.rows.at(-1)!.nested)).toBe(true);
  expect(()=>{result.rows.at(-1)!.nested.value=99;}).toThrow();
});

it("rejects bad ranges, lengths, duplicate edits and missing object bases without partial writes", () => {
  const base = Object.freeze([Object.freeze({ id: "row", n: 1 })]);
  const bad: OperationalStatePatch[] = [
    { kind: "array", length: 1, segments: [{ from: 2, count: 1 }], changes: [] },
    { kind: "array", length: 300_001, segments: [], changes: [] },
    { kind: "array", length: 1, segments: [{ from: 0, count: 1 }], changes: [[0, { kind: "replace", value: 2 }], [0, { kind: "replace", value: 3 }]] },
    { kind: "object", changes: [["missing", { kind: "replace", value: 1 }]] },
  ];
  for (const patch of bad) expect(() => applyOperationalStatePatch(base, patch)).toThrow();
  expect(JSON.stringify(base)).toBe('[{"id":"row","n":1}]');
});
