import { expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, prepareGameEvidenceCheckpoint } from "./game-evidence";
import { createInitialGameState } from "./reducer";

it("does not enumerate the unchanged private learning projection during ticks", () => {
  const state = createInitialGameState(); state.paused = false;
  let checkpoint = createGameEvidenceCheckpoint(state);
  prepareGameEvidenceCheckpoint(checkpoint);
  const conceptId = Object.keys(state.learningHistories)[0]!;
  const entries = Object.entries;
  let projectionScans = 0;
  const spy = vi.spyOn(Object, "entries").mockImplementation(value => {
    const row = (value as Record<string, { card?: unknown }>)[conceptId];
    if (row && typeof row.card === "string") projectionScans++;
    return entries(value);
  });
  try {
    for (let i = 0; i < 12; i++) checkpoint = applyGameEvidenceCommand(checkpoint,
      { type: "ADVANCE_TICK", operationId: `learning-reuse.${i}`, advancedAtRealMs: state.createdAtRealMs + i * 60_000 }).checkpoint;
    expect(checkpoint.snapshot.head.sequence).toBe(12);
    expect(projectionScans).toBe(0);
  } finally { spy.mockRestore(); }
});
