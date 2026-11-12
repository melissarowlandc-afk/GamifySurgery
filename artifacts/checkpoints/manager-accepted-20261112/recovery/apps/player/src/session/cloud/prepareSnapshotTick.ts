import { applyGameEvidenceCommand, type GameEvidenceCheckpoint } from "@gamify-surgery/game-domain";

/** Initialize the main-thread engine/projection caches while the opening
 * screen still owns the clock. A private preview branch is discarded: no
 * command, receipt, learning update, lineage or state is accepted by a session.
 * Keep this best-effort so it cannot change real-command error handling. */
export function prepareSnapshotTick(checkpoint: GameEvidenceCheckpoint, paused: boolean, atRealMs: number): boolean {
  try {
    let preview = checkpoint;
    if (paused) preview = applyGameEvidenceCommand(preview,
      { type: "SET_PAUSED", paused: false, operationId: crypto.randomUUID() }).checkpoint;
    applyGameEvidenceCommand(preview,
      { type: "ADVANCE_TICK", operationId: crypto.randomUUID(), advancedAtRealMs: atRealMs });
    return true;
  } catch { return false; }
}
