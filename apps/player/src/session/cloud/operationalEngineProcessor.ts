import { RuntimeCatalogueRequired } from "../../mobile/performance/runtimeCatalogue";
import { applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, gameEvidenceDelta, GameEvidenceError,
  importGameEvidence, prepareGameEvidenceCheckpoint, PROTOTYPE_DOMAIN_CONTEXT, type DomainContext, type GameEvidenceCheckpoint, type GameEvidenceDelta, type GameState } from "@gamify-surgery/game-domain";
import { equalParsedJson } from "./codecWorkerJsonEqual";
import type { CodecJson } from "./codecJson";
import { operationalStatePatch } from "./operationalStatePatch";
import type { OperationalEngineReply, OperationalEngineRequest, OperationalViewReply, OperationalViewRequest } from "./operationalEngineProtocol";
import { createOperationalPlayerView } from "./operationalViewProjection";
import type { PrototypePlayerView } from "../viewModels";
import { freezeOperationalValue } from "./operationalFreeze";

export const freezeOperationalSnapshot = freezeOperationalValue;

/** Dedicated engine worker. All grading, immutable evidence, retirement,
 * operation-ID checks and recovery invariants use the existing domain boundary.
 * Only completed, ordered results can advance the visible version.
 */
export class OperationalEngineProcessor {
  private checkpoint: GameEvidenceCheckpoint | null = null;
  private visible: GameState | null = null;
  private context: DomainContext | undefined;
  private version = 0;
  private snapshotOnly = false;
  private view: PrototypePlayerView | null = null;
  private readonly journalDeltas = new Map<number, GameEvidenceDelta>();
  journalDelta(version: number): GameEvidenceDelta | undefined { return this.journalDeltas.get(version); }
  releaseJournalDeltas(versions: readonly number[]): void { for (const version of versions) this.journalDeltas.delete(version); }

  private project(state: GameState, request: OperationalViewRequest): { view: PrototypePlayerView; reply: OperationalViewReply } {
    if (!Number.isSafeInteger(request.revision) || request.revision < 0 || !Array.isArray(request.args) || request.args.length < 3 || request.args.length > 9 ||
        request.asOfRealMs !== undefined && !Number.isFinite(request.asOfRealMs)) throw new GameEvidenceError("engine-projection");
    const at = performance.now(), asOfRealMs = request.asOfRealMs ?? Date.now();
    const args = request.followOpenChart ? [state.openChartEncounterId, ...request.args.slice(1)] as typeof request.args : request.args;
    const view = createOperationalPlayerView(state, args, asOfRealMs), computeMs = performance.now() - at, diffStarted = performance.now();
    const patch = operationalStatePatch(this.view, view), diffMs = performance.now() - diffStarted;
    return { view, reply: { revision: request.revision, asOfRealMs, ...(patch ? { patch } : {}), computeMs, diffMs } };
  }

  handle(request: OperationalEngineRequest): OperationalEngineReply {
    try {
      if (!Number.isSafeInteger(request.id) || request.id < 1) throw new GameEvidenceError("engine-message");
      if (request.kind === "initialize") {
        if (this.checkpoint) throw new GameEvidenceError("engine-initialized");
        const checkpoint = freezeOperationalSnapshot(request.checkpoint);
        const hydrated = importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
        if (!equalParsedJson(hydrated as unknown as CodecJson, request.visibleState as unknown as CodecJson)) {
          // Keep the original JSON serialization semantics for generic callers
          // with dates/undefined, without allocating text for normal JSON seeds.
          const expected = JSON.stringify(hydrated), supplied = JSON.stringify(request.visibleState);
          if (expected !== supplied && !equalParsedJson(JSON.parse(expected), JSON.parse(supplied))) throw new GameEvidenceError("engine-visible-state");
        }
        prepareGameEvidenceCheckpoint(checkpoint);
        // The first real tick runs off-main-thread. Do not allocate a discarded
        // clinic/evidence branch while opening is already at its memory peak.
        const projection = request.projection ? this.project(request.visibleState, request.projection) : undefined;
        this.checkpoint = checkpoint; this.visible = freezeOperationalSnapshot(request.visibleState);
        this.context = { ...(request.context ?? PROTOTYPE_DOMAIN_CONTEXT), ...request.contextFlags };
        this.snapshotOnly = request.snapshotOnly === true;
        if (projection) this.view = projection.view;
        return { id: request.id, kind: "initialized", version: this.version, head: checkpoint.snapshot.head,
          ...(projection ? { projection: projection.reply } : {}) };
      }
      if (!this.checkpoint || !this.visible) throw new GameEvidenceError("engine-uninitialized");
      if (request.kind === "journalHashes") throw new GameEvidenceError("engine-message");
      if (request.expectedVersion !== this.version) throw new GameEvidenceError("engine-version");
      if (request.kind === "checkpoint") return { id: request.id, kind: "checkpoint", version: this.version, checkpoint: this.checkpoint };
      if (request.kind === "compact") {
        if (!this.snapshotOnly) throw new GameEvidenceError("engine-compaction-policy");
        // A caller invokes this ordered barrier only at the existing acknowledged
        // checkpoint / bounded-tail boundary. It never invents a save timer.
        const checkpoint = freezeOperationalSnapshot(createGameEvidenceCheckpoint(this.visible));
        prepareGameEvidenceCheckpoint(checkpoint);
        const baseVersion = this.version; this.checkpoint = checkpoint; this.version++;
        return { id: request.id, kind: "compacted", baseVersion, version: this.version, checkpoint };
      }
      if (request.kind === "project") {
        const projected = this.project(this.visible, request.projection); this.view = projected.view;
        return { id: request.id, kind: "projected", version: this.version, projection: projected.reply };
      }
      if (request.kind !== "command" && request.kind !== "undo") throw new GameEvidenceError("engine-message");
      const before = this.checkpoint, started = performance.now();
      const result = request.kind === "command"
        ? applyGameEvidenceCommand(before, request.command, request.contextFlags ? { ...(request.context ?? this.context!), ...request.contextFlags } : request.context ?? this.context)
        : applyGameEvidenceBuildUndo(before, request.target, request.operationId);
      const computeMs = performance.now() - started, diffStarted = performance.now();
      const patch = result.replayed ? undefined : operationalStatePatch(this.visible, result.state);
      const delta = result.replayed ? null : gameEvidenceDelta(before, result.checkpoint);
      const snapshotPatch = result.replayed ? undefined : operationalStatePatch(before.snapshot, result.checkpoint.snapshot);
      const diffMs = performance.now() - diffStarted, baseVersion = this.version;
      const projection = request.projection ? this.project(result.replayed ? this.visible : result.state, request.projection) : undefined;
      // Build transport before committing, so a failed diff cannot advance the
      // private head while the caller still owns the old visible state.
      this.checkpoint = result.checkpoint;
      if (!result.replayed) this.visible = freezeOperationalSnapshot(result.state);
      if (projection) this.view = projection.view;
      this.version++;
      if (delta) {
        this.journalDeltas.set(this.version, delta);
        // Larger than the session's128 combined reservations. Standalone
        // clients without a journal still have a fixed memory bound.
        if (this.journalDeltas.size > 256) this.journalDeltas.delete(this.journalDeltas.keys().next().value!);
      }
      return { id: request.id, kind: "applied", baseVersion, version: this.version, head: result.checkpoint.snapshot.head,
        replayed: result.replayed, ...(patch ? { patch } : {}), ...(snapshotPatch ? { snapshotPatch } : {}), delta, computeMs, diffMs,
        ...(projection ? { projection: projection.reply } : {}) };
    } catch (error) {
      if (error instanceof RuntimeCatalogueRequired) throw error;
      return { id: request.id, kind: "failure", code: error instanceof GameEvidenceError ? error.code : "engine-command" };
    }
  }
}
