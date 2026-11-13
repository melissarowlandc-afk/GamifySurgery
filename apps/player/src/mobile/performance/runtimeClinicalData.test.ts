import { packCodecFailure } from "../../session/cloud/codecTasks";
import { expect, it, vi } from "vitest";
import { decodeRuntimeClinicalGraph, decodeRuntimeClinicalGraphCooperatively, encodeRuntimeClinicalGraph, runtimeClinicalModule } from "../../../../../scripts/vite/runtime-clinical-graph";
import { runtimeClinicalImports, runtimeClinicalIndex } from "../../../../../scripts/vite/runtime-clinical-data";
import { defineRuntimeCatalogueField, ensureRuntimeCatalogue, installRuntimeCatalogueIndex, RuntimeCatalogueRequired, RuntimeCatalogueUnavailable, registerRuntimeCatalogue, withRuntimeCatalogue } from "./runtimeCatalogue";
import { createInitialGameState, getRoutinePatientAvailability, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import * as clinical from "@gamify-surgery/clinical-content";
import { resolve } from "node:path";

it("keeps every consumed runtime value byte exact, including historical timing bindings", async () => {
  const names = await runtimeClinicalImports(resolve(import.meta.dirname, "../../../../.."));
  const original = Object.fromEntries(names.map(name => [name, clinical[name as keyof typeof clinical]]));
  const graph = encodeRuntimeClinicalGraph(original), decoded = decodeRuntimeClinicalGraph(JSON.parse(JSON.stringify(graph)));
  expect(decoded).toStrictEqual(original);
  expect(JSON.stringify(decoded)).toBe(JSON.stringify(original));
  const cooperative = await decodeRuntimeClinicalGraphCooperatively(JSON.parse(JSON.stringify(graph)), undefined, async () => {});
  expect(JSON.stringify(cooperative)).toBe(JSON.stringify(original));
  expect(names).toContain("SYNTHETIC_CLINICAL_RELEASE");
  expect(names).toContain("ANSWER_CHOICE_TIMING_REGISTRY");
});

it("yields graph assembly before publication without changing sharing, holes, key order or descriptors", async () => {
  const shared = Object.assign(Object.create(null), { value: "shared", absent: undefined });
  const rows = Array.from({ length: 800 }, (_, id) => ({ id, shared })), sparse = new Array(3);
  sparse[2] = shared;
  const root: Record<string, unknown> = { rows, sparse, negativeZero: -0 }; root.cycle = root;
  Object.defineProperty(root, "__proto__", { value: "own", enumerable: true, configurable: true, writable: true });
  const graph = encodeRuntimeClinicalGraph({ root }), yieldTask = vi.fn(async () => {});
  let clock = 0; const timing = vi.spyOn(performance, "now").mockImplementation(() => clock += 5);
  try {
    const decoded = (await decodeRuntimeClinicalGraphCooperatively(graph, undefined, yieldTask)).root as typeof root;
    expect(yieldTask).toHaveBeenCalled(); expect(decoded).toStrictEqual(decodeRuntimeClinicalGraph(graph).root);
    expect(decoded.cycle).toBe(decoded); expect(0 in (decoded.sparse as unknown[])).toBe(false);
    const children = decoded.rows as typeof rows;
    expect(children[0]!.shared).toBe(children[799]!.shared);
    expect(Object.getOwnPropertyDescriptor(decoded, "__proto__")).toEqual(Object.getOwnPropertyDescriptor(root, "__proto__"));
  } finally { timing.mockRestore(); }
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

it("keeps selection, bootstrap, every case byte and FSRS exact while the main index defers full text", async () => {
  const names = await runtimeClinicalImports(resolve(import.meta.dirname, "../../../../.."));
  const original = Object.fromEntries(names.map(name => [name, clinical[name as keyof typeof clinical]]));
  const projection = runtimeClinicalIndex(encodeRuntimeClinicalGraph(original));
  const data = decodeRuntimeClinicalGraph(projection.index, defineRuntimeCatalogueField) as unknown as Parameters<typeof installRuntimeCatalogueIndex>[0];
  const cases = data.SYNTHETIC_CLINICAL_RELEASE.cases, selected = cases.find(c => c.routineEligible && !c.tutorialEligible)!;
  const fullText = JSON.stringify(clinical.SYNTHETIC_CLINICAL_RELEASE);
  let loads = 0;
  installRuntimeCatalogueIndex(data, async () => { loads++; return decodeRuntimeClinicalGraph(projection.full).cases as typeof cases; });
  expect(() => selected.presentation).toThrow(RuntimeCatalogueRequired);
  const adult = cases.find(c => c.routineEligible && !c.tutorialEligible && !c.pediatricProfile)!;
  const choices = (adult.decisionNodes as { answerChoices: Record<string, unknown>[] }[])[0]!.answerChoices;
  expect(() => choices[0]!.label).toThrow(RuntimeCatalogueRequired);
  if (choices.length > 1 && choices[0]!.serviceRequest === null && choices[1]!.serviceRequest === null)
    expect(choices[0]).toBe(choices[1]);
  const context = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: data.SYNTHETIC_CLINICAL_RELEASE as unknown as typeof clinical.SYNTHETIC_CLINICAL_RELEASE };
  const initial = createInitialGameState(undefined, { campaignId: "public.catalogue", campaignSeed: "public.catalogue", createdAtRealMs: 0 });
  expect(serializeGameState(createInitialGameState(context, { campaignId: "public.catalogue", campaignSeed: "public.catalogue", createdAtRealMs: 0 }))).toBe(serializeGameState(initial));
  for (const level of [4, 5] as const) {
    const state = { ...initial, facilityLevel: level, paused: false };
    expect(getRoutinePatientAvailability(state, 1000, context)).toStrictEqual(getRoutinePatientAvailability(state, 1000));
  }
  expect(loads).toBe(0);
  expect(JSON.stringify(projection.index).length).toBeLessThan(JSON.stringify(encodeRuntimeClinicalGraph(original)).length * .75);
  const identities = [...cases];
  await Promise.all([ensureRuntimeCatalogue(), ensureRuntimeCatalogue()]); expect(loads).toBe(1);
  expect(cases.every((c, i) => c === identities[i])).toBe(true);
  expect(JSON.stringify(data.SYNTHETIC_CLINICAL_RELEASE)).toBe(fullText);
  expect(serializeGameState(initial)).toBe(serializeGameState(createInitialGameState(context, { campaignId: "public.catalogue", campaignSeed: "public.catalogue", createdAtRealMs: 0 })));
  expect(await withRuntimeCatalogue(async () => selected.presentation)).toBe(selected.presentation);
});

it("retries a failed asset without partial installation, coalesces concurrent loads and retries only unpublished reads", async () => {
  const c = { id: "case.public", metadata: true } as Record<string, unknown>;
  const data = { SYNTHETIC_CLINICAL_RELEASE: { cases: [c] }, __runtimeDeferred: [c, ["presentation"], 0] };
  let loads = 0, reads = 0;
  installRuntimeCatalogueIndex(data, async () => { if (++loads === 1) throw Error("offline"); return [{ id: "case.public", metadata: true, presentation: "immutable public text" }]; });
  await expect(ensureRuntimeCatalogue()).rejects.toThrow("offline");
  expect(() => c.presentation).toThrow(RuntimeCatalogueRequired);
  expect(await withRuntimeCatalogue(async () => { reads++; return c.presentation; })).toBe("immutable public text");
  expect(loads).toBe(2); expect(reads).toBe(2);
  const before = JSON.stringify(c);
  installRuntimeCatalogueIndex(data, async () => [{ id: "wrong", metadata: false }]);
  await expect(ensureRuntimeCatalogue()).rejects.toThrow("identity mismatch"); expect(JSON.stringify(c)).toBe(before);
  registerRuntimeCatalogue(async () => { throw Error("offline"); });
  const unavailable = await withRuntimeCatalogue(async () => { throw new RuntimeCatalogueRequired(); }).catch(error => error);
  expect(unavailable).toBeInstanceOf(RuntimeCatalogueUnavailable);
  expect(packCodecFailure(unavailable)).toMatchObject({ kind: "codec", code: "worker_unavailable" });
});
