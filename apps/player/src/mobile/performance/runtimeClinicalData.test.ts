import { expect, it } from "vitest";
import { decodeRuntimeClinicalGraph, encodeRuntimeClinicalGraph, runtimeClinicalModule } from "../../../../../scripts/vite/runtime-clinical-graph";
import { runtimeClinicalImports } from "../../../../../scripts/vite/runtime-clinical-data";
import * as clinical from "@gamify-surgery/clinical-content";
import { resolve } from "node:path";

it("keeps every consumed runtime value byte exact, including historical timing bindings", async () => {
  const names = await runtimeClinicalImports(resolve(import.meta.dirname, "../../../../.."));
  const original = Object.fromEntries(names.map(name => [name, clinical[name as keyof typeof clinical]]));
  const graph = encodeRuntimeClinicalGraph(original), decoded = decodeRuntimeClinicalGraph(JSON.parse(JSON.stringify(graph)));
  expect(decoded).toStrictEqual(original);
  expect(JSON.stringify(decoded)).toBe(JSON.stringify(original));
  expect(names).toContain("SYNTHETIC_CLINICAL_RELEASE");
  expect(names).toContain("ANSWER_CHOICE_TIMING_REGISTRY");
});

it("preserves sharing, cycles, key order, sparse entries, undefined and safe own __proto__ properties", () => {
  const shared = { text: "same string", absent: undefined }, array = new Array(3); array[2] = shared;
  const root = { a: shared, b: shared, array, negativeZero: -0 } as Record<string, unknown>;
  root.cycle = root; Object.defineProperty(root, "__proto__", { value: "own data", enumerable: true, configurable: true, writable: true });
  const decoded = decodeRuntimeClinicalGraph(JSON.parse(JSON.stringify(encodeRuntimeClinicalGraph({ root })))).root as typeof root;
  expect(decoded).toStrictEqual(root); expect(decoded.a).toBe(decoded.b); expect(decoded.cycle).toBe(decoded);
  expect(Object.keys(decoded)).toEqual(Object.keys(root)); expect(Object.getPrototypeOf(decoded)).toBe(Object.prototype);
  expect(0 in (decoded.array as unknown[])).toBe(false);
  const module = runtimeClinicalModule(encodeRuntimeClinicalGraph({ shared }), "schema");
  expect(module).not.toContain("validateSyntheticClinicalRelease");
  const initializer = module.replace(/export \* from[^\n]+/g, "").replace(/export const /g, "const ");
  expect(new Function(`${initializer}\nreturn shared;`)()).toStrictEqual(shared);
});

it("fails closed on runtime functions, accessors and exotic objects", () => {
  for (const value of [() => {}, new Map(), new Date(), Infinity, { get value() { return 1; } }])
    expect(() => encodeRuntimeClinicalGraph({ value })).toThrow();
});
