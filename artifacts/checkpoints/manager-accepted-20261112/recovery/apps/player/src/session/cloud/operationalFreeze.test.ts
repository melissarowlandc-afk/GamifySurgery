import { expect, it } from "vitest";
import { freezeOperationalValue } from "./operationalFreeze";

it("adopts changed transport branches without changing values, field order or shared identity", () => {
  const shared = Object.freeze({ kept: Object.freeze([1, 2]) });
  const value = { z: [undefined, { b: 2, a: 1 }], a: shared, absent: undefined };
  const before = JSON.stringify(value);
  expect(freezeOperationalValue(value)).toBe(value);
  expect(JSON.stringify(value)).toBe(before);
  expect(Object.keys(value)).toEqual(["z", "a", "absent"]);
  expect(value.a).toBe(shared);
  expect(Object.isFrozen(value.z[1])).toBe(true);
  expect(() => value.z.push(3 as never)).toThrow();
});

it("handles null-prototype and __proto__ data without visiting inherited values", () => {
  const inherited = { stillMutable: true }, child = { changed: true };
  const value = Object.create({ inherited }) as Record<string, unknown>;
  Object.defineProperty(value, "__proto__", { value: child, enumerable: true });
  value.other = Object.assign(Object.create(null), { nested: [1] });
  freezeOperationalValue(value);
  expect(Object.isFrozen(child)).toBe(true);
  expect(Object.isFrozen(value.other)).toBe(true);
  expect(Object.isFrozen(inherited)).toBe(false);
  expect(Object.keys(value)).toEqual(["__proto__", "other"]);
});
