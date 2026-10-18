import { describe, expect, it } from "vitest";
import { applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState,
  gameReducer, importGameEvidence, serializeGameState, type GameCommand } from "../src";

function fixture() {
  const state = createInitialGameState(undefined, { campaignId: "undo.synthetic", campaignSeed: "undo", createdAtRealMs: 0 });
  state.paused = true; state.facilityLevel = 5; state.cash = 100_000; state.cashCents = 10_000_000;
  const command: GameCommand = { type: "PLACE_ROOM", roomId: "room.undo.hall", roomDefinitionId: "room.hallway", x: 34, y: 27, operationId: "build.hallway" };
  expect(gameReducer(state, command).operationReceipts[command.operationId]).toMatchObject({ status: "applied" });
  return { state, command: command as GameCommand, checkpoint: createGameEvidenceCheckpoint(state) };
}
describe("append-only Build Undo evidence", () => {
  it("restores exactly today's whole-state Undo while appending receipt reversions and a higher journal head", () => {
    const f = fixture(), built = applyGameEvidenceCommand(f.checkpoint, f.command);
    expect(built.state.cashCents).toBeLessThan(f.state.cashCents);
    const undo = applyGameEvidenceBuildUndo(built.checkpoint, f.state, "undo.1");
    expect(serializeGameState(undo.state)).toBe(serializeGameState(f.state));
    expect(serializeGameState(importGameEvidence(undo.checkpoint.snapshot, undo.checkpoint.evidence))).toBe(serializeGameState(f.state));
    expect(undo.checkpoint.snapshot.head.sequence).toBe(2);
    expect(undo.checkpoint.evidence.records.slice(0, built.checkpoint.evidence.records.length)).toEqual(built.checkpoint.evidence.records);
    expect(undo.appendedEvidence).toContainEqual(expect.objectContaining({ kind: "build-reversion", value: expect.objectContaining({
      revertedOperationId: f.command.operationId, status: "reverted", undoOperationId: "undo.1" }) }));
    expect(undo.checkpoint.evidence.records).toContainEqual(expect.objectContaining({ kind: "operation", value: expect.objectContaining({ operationId: f.command.operationId }) }));
    expect(undo.state.learningHistories).toEqual(f.state.learningHistories);
    const later = applyGameEvidenceCommand(undo.checkpoint, { ...f.command, operationId: "build.after-undo" });
    expect(later.state.cashCents).toBe(built.state.cashCents); expect(later.checkpoint.snapshot.head.sequence).toBe(3);
  });
  it("preserves already accepted evidence across multiple reverse build steps", () => {
    const f = fixture(), built = applyGameEvidenceCommand(f.checkpoint, f.command);
    const paused = applyGameEvidenceCommand(built.checkpoint, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "build.speed" });
    const undo = applyGameEvidenceBuildUndo(paused.checkpoint, built.state, "undo.latest");
    const twice = applyGameEvidenceBuildUndo(undo.checkpoint, f.state, "undo.earlier");
    expect(twice.checkpoint.snapshot.head.sequence).toBe(4);
    expect(twice.checkpoint.evidence.records.slice(0, paused.checkpoint.evidence.records.length)).toEqual(paused.checkpoint.evidence.records);
    expect(twice.state).toEqual(f.state);
  });
  it("marks every undone build receipt even after runtime trimming, without marking old reversions again", () => {
    const f = fixture(); let checkpoint = f.checkpoint, state = f.state;
    const ids: string[] = [];
    for (let index = 0; index < 101; index++) {
      const operationId = `long.build.${index}`;
      const command: GameCommand = index % 2 ? { type: "SELL_ROOM", roomId: "room.undo.hall", operationId } : { ...f.command, operationId };
      const result = applyGameEvidenceCommand(checkpoint, command);
      expect(result.state.operationReceipts[operationId]?.status).toBe("applied");
      ids.push(operationId); checkpoint = result.checkpoint; state = result.state;
    }
    expect(Object.keys(state.operationReceipts)).toHaveLength(96);
    const undo = applyGameEvidenceBuildUndo(checkpoint, f.state, "long.undo");
    expect(undo.appendedEvidence.filter(row => row.kind === "build-reversion").map(row => (row.value as { revertedOperationId: string }).revertedOperationId)).toEqual(ids);
    const built = applyGameEvidenceCommand(undo.checkpoint, { ...f.command, operationId: "build.after-long-undo" });
    const again = applyGameEvidenceBuildUndo(built.checkpoint, f.state, "undo.after-long-undo");
    expect(again.appendedEvidence.filter(row => row.kind === "build-reversion")).toHaveLength(1);
    expect(again.state).toEqual(f.state);
  }, 30_000);
  it("rejects unpaused, changed-clock, changed-learning and changed-identity replacements", () => {
    const f = fixture(), built = applyGameEvidenceCommand(f.checkpoint, f.command);
    for (const target of [{ ...f.state, paused: false }, { ...f.state, facilityTick: 1 }, { ...f.state, campaignId: "other" },
      { ...f.state, learningHistories: {} }]) expect(() => applyGameEvidenceBuildUndo(built.checkpoint, target, "unsafe")).toThrow();
  });
});
