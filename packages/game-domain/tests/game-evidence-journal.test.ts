import { describe, expect, it } from "vitest";
import { applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState,
  applyGameEvidenceJournalPatches, gameEvidenceDelta, gameEvidenceOperationalSnapshot, gameEvidenceProjection, importGameEvidence, restoreGameEvidenceJournal } from "../src/index";

describe("pure recorded-result journal helpers", () => {
  it("applies local array entry/append/shrink patches without mutating source bytes, while retaining atomic-array compatibility", () => {
    const base = { rows: [{ id: "one", position: { x: 1 } }, { id: "two", position: { x: 2 } }] };
    const before = JSON.stringify(base), appended = { id: "three", position: { x: 3 } };
    const result = applyGameEvidenceJournalPatches(base, [
      { path: ["rows", "0", "position", "x"], present: true, value: 4 },
      { path: ["rows", "2"], present: true, value: appended },
      { path: ["rows", "length"], present: true, value: 1 },
    ]);
    expect(result).toEqual({ rows: [{ id: "one", position: { x: 4 } }] });
    expect(JSON.stringify(base)).toBe(before); expect(appended.position.x).toBe(3);
    expect(applyGameEvidenceJournalPatches(base, [{ path: ["rows"], present: true, value: [] }])).toEqual({ rows: [] });
    for (const path of [["rows", "5"], ["rows", "-1"], ["rows", "0", "missing", "x"]])
      expect(() => applyGameEvidenceJournalPatches(base, [{ path, present: true, value: 0 }])).toThrow(/journal-patch/);
    expect(() => applyGameEvidenceJournalPatches(base, [{ path: ["rows", "length"], present: true, value: 9 }])).toThrow(/journal-patch/);
  });
  it("preserves native JSON checkpoint shape, evidence IDs and exact state across multiple recorded changes", () => {
    const base = createGameEvidenceCheckpoint(createInitialGameState(undefined, { campaignId: "domain.journal", campaignSeed: "journal", createdAtRealMs: 0 }));
    const first = applyGameEvidenceCommand(base, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "first" });
    const second = applyGameEvidenceCommand(first.checkpoint, { type: "SET_PAUSED", paused: false, operationId: "second" });
    const restored = restoreGameEvidenceJournal(structuredClone(base), structuredClone([
      gameEvidenceDelta(base, first.checkpoint), gameEvidenceDelta(first.checkpoint, second.checkpoint),
    ]));
    expect(restored).toEqual(second.checkpoint);
    expect(importGameEvidence(restored.snapshot, restored.evidence)).toEqual(second.state);
    expect(Object.keys(restored).sort()).toEqual(["evidence", "snapshot"]);
    expect(restored.evidence.records.map(r => r.id)).toEqual(second.checkpoint.evidence.records.map(r => r.id));
    const projection = gameEvidenceProjection(second.checkpoint);
    expect(gameEvidenceOperationalSnapshot(base, projection, second.checkpoint.snapshot.head)).toEqual(second.checkpoint.snapshot);
    expect(importGameEvidence(gameEvidenceOperationalSnapshot(base, projection, second.checkpoint.snapshot.head), restored.evidence)).toEqual(second.state);
  });
  it("rejects a sibling branch and missing/reordered journal rows", () => {
    const base = createGameEvidenceCheckpoint(createInitialGameState());
    const first = applyGameEvidenceCommand(base, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "branch.a" });
    const second = applyGameEvidenceCommand(base, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "branch.b" });
    expect(() => gameEvidenceDelta(first.checkpoint, second.checkpoint)).toThrow(/journal-branch/);
    const delta = gameEvidenceDelta(base, first.checkpoint);
    expect(() => restoreGameEvidenceJournal(base, [{ ...delta, fromRecord: delta.fromRecord + 1 }])).toThrow(/journal-sequence/);
    expect(() => restoreGameEvidenceJournal(base, [{ ...delta, records: [...delta.records].reverse() }])).toThrow(/journal-sequence/);
  });
  it("retains a compensating build undo as new immutable evidence", () => {
    const state = createInitialGameState(); state.paused = true;
    const base = createGameEvidenceCheckpoint(state);
    const change = applyGameEvidenceCommand(base, { type: "PLACE_ROOM", roomId: "journal.hall", roomDefinitionId: "room.hallway", x: 34, y: 27, operationId: "build.hall" });
    expect(change.state.cashCents).toBeLessThan(state.cashCents);
    const undone = applyGameEvidenceBuildUndo(change.checkpoint, state, "undo.journal.build");
    const restored = restoreGameEvidenceJournal(base, [gameEvidenceDelta(base, undone.checkpoint)]);
    expect(restored.evidence.records).toEqual(undone.checkpoint.evidence.records);
    expect(importGameEvidence(restored.snapshot, restored.evidence)).toEqual(undone.state);
    expect(restored.evidence.records.some(row => row.kind === "build-reversion")).toBe(true);
  });
});
