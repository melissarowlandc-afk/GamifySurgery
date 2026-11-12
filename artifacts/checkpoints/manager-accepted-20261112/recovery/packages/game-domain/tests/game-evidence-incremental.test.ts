import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, importGameEvidence, type GameCommand, type GameEvidenceRecord } from "../src";
import { EvidenceIndex, normalizeEvidence } from "../src/game-evidence-index";
import { evidencePatches, jsonEqual, type EvidenceJson } from "../src/game-evidence-json";
import * as oldJson from "./fixtures/game-evidence-json-legacy";
import { EvidenceDifferential, runEvidenceFuzz, runFullEvidenceDifferential } from "./fixtures/evidence-differential";

describe("incremental evidence with the unchanged pre-refactor oracle", () => {
  it("pins the actual pre-refactor oracle source bytes", () => {
    for (const [name, hash] of [
      ["game-evidence", "82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0"],
      ["game-evidence-json", "c123e617124936a4b846369dc68592c810503b0779ae33a3ef5c4bd82a8a1650"],
    ]) {
      const source = readFileSync(new URL(`./fixtures/${name}-legacy.ts`, import.meta.url), "utf8")
        .replace("// Frozen pre-Milestone-A oracle; only import paths differ. Do not optimize.\n", "")
        .replaceAll('"../../src/reducer"', '"./reducer"').replaceAll('"../../src/game-evidence-capture"', '"./game-evidence-capture"')
        .replaceAll('"./game-evidence-json-legacy"', '"./game-evidence-json"').replaceAll('"../../src/types"', '"./types"');
      expect(createHash("sha256").update(source).digest("hex")).toBe(hash);
    }
  });
  it.each([1, 0x12345678, 0xdeadbeef, 0xffffffff])("matches every field and byte in seeded command fuzz %i", seed => {
    runEvidenceFuzz(seed, 160);
  }, 60_000);
  it.each(["integration-preparing", "integration-final", "integration-finish"])("matches seeded late-game fuzz at %s", name => {
    const fixtures = JSON.parse(readFileSync(new URL("../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
    runEvidenceFuzz(12345, 80, fixtures[name]);
  }, 120_000);
  it.skipIf(process.env.EVIDENCE_FULL_REPLAY !== "1")("matches all 26,710 Level 5 commands and byte-identical earned checkpoints", () => {
    runFullEvidenceDifferential();
  }, 12 * 60 * 60 * 1000);
  it("keeps old checkpoints/branches immutable, cloneable and independently retryable", () => {
    const state = createInitialGameState(), pair = new EvidenceDifferential(state);
    const root = pair.current, rootBytes = JSON.stringify(root);
    const command: GameCommand = { type: "SET_PAUSED", paused: true, operationId: "branch.pause" };
    const first = pair.apply(command), firstBytes = JSON.stringify(first.checkpoint);
    const sibling = applyGameEvidenceCommand(root, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "branch.pause" });
    expect(sibling.replayed).toBe(false);
    pair.apply({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "branch.speed" });
    expect(JSON.stringify(root)).toBe(rootBytes);
    expect(JSON.stringify(first.checkpoint)).toBe(firstBytes);
    expect(applyGameEvidenceCommand(first.checkpoint, command).replayed).toBe(true);
    expect(() => applyGameEvidenceCommand(pair.current, { ...command, paused: false })).toThrow(/operation-id-reuse/);
    expect(JSON.stringify(structuredClone(pair.current))).toBe(JSON.stringify(pair.current));
    expect(Object.isFrozen(pair.current.evidence.records)).toBe(true);
    expect(Object.isFrozen(pair.current.snapshot.patches)).toBe(true);
    // Mutating a returned public state cannot alter the private hydrated tip.
    first.state.environment.litterItems.length = 0;
    first.state.learningHistories = {};
    pair.apply({ type: "ADVANCE_TICK", operationId: "branch.tick" });
    pair.verify();
  });
  it("revalidates mutable external checkpoints and rejects tampering at import boundaries", () => {
    const root = createGameEvidenceCheckpoint(createInitialGameState());
    const mutable = structuredClone(root);
    applyGameEvidenceCommand(mutable, { type: "SET_PAUSED", paused: true, operationId: "external.first" });
    (mutable.snapshot as { head: { sequence: number; transitionId: string | null } }).head = { sequence: 1, transitionId: "ezzzz" };
    expect(() => applyGameEvidenceCommand(mutable, { type: "SET_PAUSED", paused: true, operationId: "external.second" })).toThrow();
    const current = applyGameEvidenceCommand(root, { type: "ADVANCE_TICK", operationId: "external.tick" }).checkpoint;
    const changed = structuredClone(current);
    const transition = changed.evidence.records.find(record => record.kind === "transition")!;
    (transition.value as Record<string, EvidenceJson>).cashDeltaCents = "999";
    expect(() => importGameEvidence(changed.snapshot, changed.evidence)).toThrow(/money-reconciliation/);
  });
  it("matches compensating undo byte-for-byte after receipt trimming", () => {
    const state = createInitialGameState(); state.paused = true;
    const pair = new EvidenceDifferential(state);
    for (let index = 0; index < 110; index++) pair.apply({ type: "SET_SIMULATION_SPEED", speed: index % 2 ? 1 : 2, operationId: `undo.trim.${index}` });
    pair.undo(state, "undo.trim.restore"); pair.verify();
  }, 30_000);
  it("preserves first-match retry and undo semantics for imported orphan transitions", () => {
    const state = createInitialGameState(); state.paused = true;
    const pair = new EvidenceDifferential(state);
    const command: GameCommand = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "orphan.original" };
    pair.apply(command);
    const source = structuredClone(pair.old), transition = source.evidence.records.find(record => record.kind === "transition")!;
    const orphan = { ...transition, id: `e${(source.evidence.records.length + 1).toString(36)}`,
      value: { ...(transition.value as object), sequence: 42, command: { ...command, speed: 4 } } } as GameEvidenceRecord;
    const external = { ...source, evidence: { ...source.evidence, records: [...source.evidence.records, orphan] } };
    pair.old = structuredClone(external); pair.current = structuredClone(external);
    pair.apply(command);
    pair.apply({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "orphan.after" });
    pair.undo(state, "orphan.undo"); pair.verify();
  });
  it("preserves retries before malformed orphans and ignores unused undo payloads during ordinary play", () => {
    const state = createInitialGameState(), pair = new EvidenceDifferential(state);
    const command: GameCommand = { type: "SET_PAUSED", paused: true, operationId: "short-circuit.retry" };
    pair.apply(command);
    const source = structuredClone(pair.old), records: GameEvidenceRecord[] = [...source.evidence.records];
    for (const kind of ["operation", "build-reversion"] as const) records.push({ id: `e${(records.length + 1).toString(36)}`,
      kind, origin: "observed-transition", value: null });
    const unused = { ...source, evidence: { ...source.evidence, records } };
    pair.old = structuredClone(unused); pair.current = structuredClone(unused);
    pair.apply({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "short-circuit.ordinary" });
    const prior = structuredClone(pair.old);
    const malformed = { ...prior, evidence: { ...prior.evidence, records: [...prior.evidence.records,
      { id: `e${(prior.evidence.records.length + 1).toString(36)}`, kind: "transition", origin: "observed-transition", value: null } as GameEvidenceRecord] } };
    pair.old = structuredClone(malformed); pair.current = structuredClone(malformed);
    pair.apply(command); pair.verify();
    const next: GameCommand = { type: "SET_PAUSED", paused: false, operationId: "short-circuit.new" };
    expect(() => applyGameEvidenceCommand(pair.current, next)).toThrow(/object-shape/);
  });
});

describe("persistent indexes and exact JSON projection semantics", () => {
  it("shares independent index branches and handles overwrites and adversarial keys", () => {
    const root = EvidenceIndex.empty<number>(); let index = root;
    for (let i = 0; i < 10_000; i++) index = index.with(`op.${i}`, i);
    const sibling = index.with("__proto__", 42), overwritten = index.with("op.50", 123);
    for (let i = 0; i < 10_000; i++) assert.equal(index.get(`op.${i}`), i);
    expect(root.get("op.0")).toBeUndefined(); expect(index.get("__proto__")).toBeUndefined();
    expect(sibling.get("__proto__")).toBe(42); expect(overwritten.get("op.50")).toBe(123);
    expect(index.get("op.50")).toBe(50);
  });
  it("normalizes JSON values with sharing while preserving order, omissions and array nulls", () => {
    const values = [{ a: undefined, b: [undefined, , NaN, Infinity, -0], nested: { text: "unchanged" } },
      { b: null, a: 1 }, JSON.parse('{"__proto__":{"a":1},"constructor":2}'), new Date(0)];
    for (const value of values) expect(JSON.stringify(normalizeEvidence(value))).toBe(JSON.stringify(JSON.parse(JSON.stringify(value))));
    const before = { nested: { x: [1, 2] }, a: 1 };
    expect(normalizeEvidence(structuredClone(before), before)).toBe(before);
    const next = normalizeEvidence({ ...structuredClone(before), a: 2 }, before);
    expect(next.nested).toBe(before.nested); expect(next.a).toBe(2);
    expect(Object.keys(normalizeEvidence({ a: 1, nested: before.nested }, before))).toEqual(["a", "nested"]);
  });
  it("matches original canonical equality and ordered patches for nested JSON, reordered keys and arrays", () => {
    const values: EvidenceJson[] = [null, false, 0, "x", [], [null, 1], { a: { x: 1, y: 2 }, b: [3] },
      { b: [3], a: { y: 2, x: 1 } }, JSON.parse('{"__proto__":1}'), { a: { y: 2 }, c: true }];
    for (const a of values) for (const b of values) {
      expect(jsonEqual(a, b)).toBe(oldJson.jsonEqual(a, b));
      expect(JSON.stringify(evidencePatches(a, b))).toBe(JSON.stringify(oldJson.evidencePatches(a, b)));
    }
  });
});
