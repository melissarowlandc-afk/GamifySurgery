import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { readRuntimeCaseBankSlice } from "./runtimeCaseBank";
import { expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, gameEvidenceDelta, getCurrentCapabilities,
  PROTOTYPE_DOMAIN_CONTEXT, type GameCommand } from "@gamify-surgery/game-domain";
import { decodeRuntimeClinicalGraph, encodeRuntimeClinicalGraph } from "../../../../../scripts/vite/runtime-clinical-graph";
import { runtimeClinicalIndex } from "../../../../../scripts/vite/runtime-clinical-data";
import { OperationalEngineProcessor } from "../../session/cloud/operationalEngineProcessor";
import { applyOperationalStatePatch } from "../../session/cloud/operationalStatePatch";
import { defineRuntimeCatalogueField, ensureRuntimeCatalogue, installRuntimeCatalogueIndex, prepareRuntimeCaseCatalogue, releaseRuntimeCatalogue,
  RUNTIME_CASE_CACHE_LIMIT, RuntimeCatalogueRequired, withRuntimeCaseSlices } from "./runtimeCatalogue";

it("retries an unpublished admission against the identical prefix and preserves operation-ID replay, state and evidence bytes", async () => {
  const projection = runtimeClinicalIndex(encodeRuntimeClinicalGraph({ SYNTHETIC_CLINICAL_RELEASE: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease }));
  const data = decodeRuntimeClinicalGraph(projection.index, defineRuntimeCatalogueField) as unknown as Parameters<typeof installRuntimeCatalogueIndex>[0];
  const full = decodeRuntimeClinicalGraph(projection.full).cases as Record<string, unknown>[];
  let loads = 0;
  installRuntimeCatalogueIndex(data, async () => full, { prepare: async () => {}, read: async index => { loads++; return full[index]!; } });
  const state = createInitialGameState(undefined, { campaignId: "public.case-slice", campaignSeed: "public.case-slice", createdAtRealMs: 0 });
  state.facilityLevel = 5; state.paused = false;
  const capabilities = getCurrentCapabilities(state);
  const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c => c.routineEligible && !c.tutorialEligible && !c.participant &&
    !c.pediatricProfile && c.requiredCapabilityIds.every(id => capabilities.has(id)))!;
  expect(clinicalCase).toBeDefined();
  const checkpoint = createGameEvidenceCheckpoint(state), context = { ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: data.SYNTHETIC_CLINICAL_RELEASE as unknown as typeof PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease };
  const engine = new OperationalEngineProcessor();
  expect(engine.handle({ id: 1, kind: "initialize", context, checkpoint: structuredClone(checkpoint), visibleState: structuredClone(state), atRealMs: 0 }).kind).toBe("initialized");
  const command: GameCommand = { type: "ADMIT_PATIENT", operationId: "slice.admit", encounterId: "slice.patient", caseId: clinicalCase.id,
    patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" };
  const expected = applyGameEvidenceCommand(checkpoint, command);
  expect(expected.state.encounters["slice.patient"]).toBeDefined();
  const reply = await withRuntimeCaseSlices(() => engine.handle({ id: 2, kind: "command", expectedVersion: 0, command }));
  expect(reply.kind).toBe("applied"); if (reply.kind !== "applied") throw Error("admission failed");
  expect(loads).toBe(1);
  expect(JSON.stringify(applyOperationalStatePatch(state, reply.patch))).toBe(JSON.stringify(expected.state));
  expect(JSON.stringify(reply.delta)).toBe(JSON.stringify(gameEvidenceDelta(checkpoint, expected.checkpoint)));
  expect(engine.handle({ id: 3, kind: "checkpoint", expectedVersion: 1 })).toMatchObject({ checkpoint: expected.checkpoint });
  const replay = await withRuntimeCaseSlices(() => engine.handle({ id: 4, kind: "command", expectedVersion: 1, command }));
  expect(replay).toMatchObject({ kind: "applied", replayed: true, delta: null }); expect(loads).toBe(1);
});

it("bounds templates after wide requests, restores exact indexed fields on eviction/recovery and never installs a failed slice", async () => {
  const full = Array.from({ length: 40 }, (_, i) => ({ id: `public.${i}`, text: `case ${i}`, metadata: i }));
  const cases = full.map(c => ({ id: c.id, text: undefined, metadata: c.metadata } as Record<string, unknown>));
  const data = { SYNTHETIC_CLINICAL_RELEASE: { cases }, __runtimeDeferred: cases.flatMap((c, i) => [c, ["text"], i]) };
  let reads = 0, prepares = 0, fail = true;
  installRuntimeCatalogueIndex(data, async () => full, { prepare: async () => { prepares++; }, read: async index => {
    reads++; if (fail) throw Error("offline"); return full[index]!;
  } });
  await prepareRuntimeCaseCatalogue(); expect(prepares).toBe(1);
  await expect(withRuntimeCaseSlices(() => cases[0]!.text)).rejects.toThrow("offline");
  expect(() => cases[0]!.text).toThrow(RuntimeCatalogueRequired);
  fail = false;
  expect(await withRuntimeCaseSlices(() => JSON.stringify(cases))).toBe(JSON.stringify(full));
  expect(reads).toBe(41);
  const loaded = () => cases.filter(c => !Object.getOwnPropertyDescriptor(c, "text")!.get).length;
  expect(loaded()).toBe(RUNTIME_CASE_CACHE_LIMIT);
  expect(await withRuntimeCaseSlices(() => JSON.stringify(cases[0]))).toBe(JSON.stringify(full[0]));
  expect(loaded()).toBe(RUNTIME_CASE_CACHE_LIMIT);
  await ensureRuntimeCatalogue(); expect(JSON.stringify(cases)).toBe(JSON.stringify(full));
  releaseRuntimeCatalogue(); expect(loaded()).toBe(0);
  expect(await withRuntimeCaseSlices(() => JSON.stringify(cases[39]))).toBe(JSON.stringify(full[39]));
});

it("decodes binary case slices byte exactly with bounded sizes and verified hashes", async () => {
  const text = JSON.stringify({ id: "public.case", text: "Unicode \u2764\ud83d\ude00", nested: { z: 0, a: 1 } });
  const input = Buffer.from(text), header = Buffer.alloc(68);
  header.write(createHash("sha256").update(input).digest("hex"), 0, "ascii"); header.writeUInt32LE(input.byteLength, 64);
  const bytes = Buffer.concat([header, gzipSync(input)]), bank = new Blob([Buffer.from("prefix"), bytes]);
  expect(await readRuntimeCaseBankSlice(bank, 6, bytes.length)).toBe(text);
  await expect(readRuntimeCaseBankSlice(bank, 6, bytes.length + 1)).rejects.toThrow("slice");
  await expect(readRuntimeCaseBankSlice(bank, -1, bytes.length)).rejects.toThrow("slice");
  const corrupt = Buffer.from(bytes); corrupt[0] = corrupt[0] === 48 ? 49 : 48;
  await expect(readRuntimeCaseBankSlice(new Blob([corrupt]), 0, corrupt.length)).rejects.toMatchObject({ code: "checksum" });
  const bomb = Buffer.from(bytes); bomb.writeUInt32LE(1, 64);
  await expect(readRuntimeCaseBankSlice(new Blob([bomb]), 0, bomb.length)).rejects.toBeDefined();
});
