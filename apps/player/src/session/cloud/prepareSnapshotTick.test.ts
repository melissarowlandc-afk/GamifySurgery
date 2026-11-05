import { expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState } from "@gamify-surgery/game-domain";
import { prepareSnapshotTick } from "./prepareSnapshotTick";

it.each([false, true])("leaves the live checkpoint/state exact while preparing a paused=%s preview", paused => {
  const state = createInitialGameState(); state.paused = paused;
  let actual = createGameEvidenceCheckpoint(state), reference = createGameEvidenceCheckpoint(state);
  const stateBytes = JSON.stringify(state), checkpointBytes = JSON.stringify(actual);
  expect(prepareSnapshotTick(actual, paused, state.createdAtRealMs)).toBe(true);
  expect(JSON.stringify(state)).toBe(stateBytes);
  expect(JSON.stringify(actual)).toBe(checkpointBytes);
  expect(actual.snapshot.head.sequence).toBe(0);
  for (let i = 0; i < 12; i++) {
    const command = { type: "ADVANCE_TICK" as const, operationId: `actual.${i}`, advancedAtRealMs: state.createdAtRealMs + i * 60_000 };
    const left = applyGameEvidenceCommand(actual, command), right = applyGameEvidenceCommand(reference, command);
    expect(JSON.stringify(left)).toBe(JSON.stringify(right));
    actual = left.checkpoint; reference = right.checkpoint;
  }
});

it("keeps preview failure separate from the real command boundary", () => {
  const state = createInitialGameState(); state.paused = false;
  const checkpoint = structuredClone(createGameEvidenceCheckpoint(state));
  Object.assign(checkpoint.snapshot.head, { sequence: -1 });
  const exact = JSON.stringify(checkpoint);
  expect(prepareSnapshotTick(checkpoint, false, state.createdAtRealMs)).toBe(false);
  expect(JSON.stringify(checkpoint)).toBe(exact);
});
