import { applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, gameEvidenceDelta,
  type DomainContext, type GameCommand, type GameEvidenceCheckpoint, type GameState } from "@gamify-surgery/game-domain";
import { OperationalEngineClient, OperationalEngineFailure, type OperationalEnginePort } from "./operationalEngineClient";
import type { OperationalContextFlags, OperationalEngineResult } from "./operationalEngineProtocol";
import type { OperationalViewArguments } from "./operationalViewProjection";
import type { JournalRow } from "../localJournal";
import { CLOUD_WORKER_STARTUP_TIMEOUT_MS } from "./codecWorker";

type CommandEntry = { command: GameCommand; context: DomainContext };
type Entry = CommandEntry | { target: GameState; operationId: string };
export interface OperationalSessionOptions {
  /** Only private app-session hydration may adopt/freeze the shared seed. */
  adoptSharedSeed?: boolean;
  /** App and worker load the same released catalogues; explicit contexts still travel. */
  useBundledContext?: boolean;
  createPort?: () => OperationalEnginePort;
  timeoutMs?: number;
  startupTimeoutMs?: number;
  retryMs?: number;
  now?: () => number;
  diagnose?: (code: string) => void;
}

/** Used only inside the session's ordered command/checkpoint boundary.
 * The client mirrors the exact recovery checkpoint without flattening a tail.
 * A failed worker has no published authority: resume that published prefix and
 * retry its uncertain command once. No promise acknowledges a private result.
 */
export class OperationalSessionEngine {
  private client: OperationalEngineClient | null = null;
  private baseline: GameEvidenceCheckpoint;
  private fallback: GameEvidenceCheckpoint | null = null;
  private visible: GameState;
  private nextRetry = 0;
  private stopped = false;
  private args: OperationalViewArguments;
  private currentHead: GameEvidenceCheckpoint["snapshot"]["head"];
  private constructor(checkpoint: GameEvidenceCheckpoint, state: GameState, private readonly context: DomainContext,
    private readonly snapshotOnly: boolean, private readonly options: OperationalSessionOptions) {
    this.baseline = checkpoint; this.visible = state; this.currentHead = checkpoint.snapshot.head;
    this.args = [state.openChartEncounterId, false, null];
  }
  static async create(checkpoint: GameEvidenceCheckpoint, state: GameState, context: DomainContext, snapshotOnly: boolean,
    options: OperationalSessionOptions = {}): Promise<OperationalSessionEngine> {
    const engine = new OperationalSessionEngine(checkpoint, state, context, snapshotOnly, options);
    await engine.start(); return engine;
  }
  get state(): GameState { return this.visible; }
  get head(): GameEvidenceCheckpoint["snapshot"]["head"] {
    return this.currentHead;
  }
  get mode(): "worker" | "synchronous" { return this.client ? "worker" : "synchronous"; }
  async hashJournalRows(rows: readonly JournalRow[]): Promise<string[] | null> {
    if (!this.client) return null;
    try { return await this.client.hashJournalRows(rows); }
    catch { this.diagnose("engine-journal-hash-fallback"); return null; }
  }
  setProjection(args: OperationalViewArguments): void { this.args = structuredClone(args); this.client?.setProjection(this.args, true); }
  private now(): number { return this.options.now?.() ?? Date.now(); }
  private diagnose(code: string): void { this.options.diagnose?.(code); }
  private async start(): Promise<void> {
    if (this.stopped) return;
    const checkpoint = this.fallback ?? this.baseline;
    try {
      const client = await OperationalEngineClient.create({ checkpoint, visibleState: this.visible, context: this.context,
        adoptSharedSeed: this.options.adoptSharedSeed, useBundledContext: this.options.useBundledContext,
        atRealMs: this.now(), snapshotOnly: this.snapshotOnly,
        projection: { revision: 0, args: this.args, followOpenChart: true } }, this.options.createPort, this.options.timeoutMs ?? 5_000, 128,
        this.options.startupTimeoutMs ?? CLOUD_WORKER_STARTUP_TIMEOUT_MS);
      if (this.stopped) { client.dispose(); return; }
      client.setProjection(this.args, true);
      this.client = client; this.baseline = checkpoint; this.fallback = null;
      this.diagnose("worker-ready");
    } catch (error) {
      this.client = null; this.fallback = checkpoint; this.nextRetry = this.now() + (this.options.retryMs ?? 5_000);
      this.diagnose(error instanceof OperationalEngineFailure ? error.code : "engine-start");
    }
  }
  private recover(): GameEvidenceCheckpoint {
    const checkpoint = this.client?.recoveryCheckpoint ?? this.fallback ?? this.baseline;
    this.client?.dispose(); this.client = null;
    this.fallback = checkpoint;
    this.nextRetry = this.now() + (this.options.retryMs ?? 5_000);
    return checkpoint;
  }
  private async ready(): Promise<void> {
    if (this.stopped) throw new OperationalEngineFailure("engine-stopped");
    if (!this.client && this.now() >= this.nextRetry) await this.start();
  }
  /** Capture only command/session flags. Catalogs were bound at session open. */
  capture(command: GameCommand, context: DomainContext): CommandEntry {
    const flags: OperationalContextFlags = { guidanceTipsDeliveryBlocked: context.guidanceTipsDeliveryBlocked,
      guidanceAttentionBlocked: context.guidanceAttentionBlocked, guidanceBlockedTopicIds: context.guidanceBlockedTopicIds };
    const catalog = context.balanceRelease !== this.context.balanceRelease || context.clinicalRelease !== this.context.clinicalRelease
      ? structuredClone(context) : context;
    return { command: structuredClone(command), context: { ...catalog, ...structuredClone(flags) } };
  }
  async execute(entry: CommandEntry): Promise<OperationalEngineResult> {
    await this.ready();
    if (this.client) {
      try {
        const context = entry.context, flags: OperationalContextFlags = { guidanceTipsDeliveryBlocked: context.guidanceTipsDeliveryBlocked,
          guidanceAttentionBlocked: context.guidanceAttentionBlocked, guidanceBlockedTopicIds: context.guidanceBlockedTopicIds };
        const catalogChanged = context.balanceRelease !== this.context.balanceRelease || context.clinicalRelease !== this.context.clinicalRelease;
        const result = await this.client.execute(entry.command, catalogChanged ? context : undefined, flags);
        if (!result.replayed) { this.visible = result.state; this.currentHead = result.head; }
        return result;
      } catch (error) { this.diagnose(error instanceof OperationalEngineFailure ? error.code : "engine-command"); this.recover(); }
    }
    return this.synchronous(entry);
  }
  async undo(target: GameState, operationId: string): Promise<OperationalEngineResult> {
    await this.ready();
    const entry = { target: structuredClone(target), operationId };
    if (this.client) {
      try {
        const result = await this.client.undo(entry.target, operationId);
        if (!result.replayed) { this.visible = result.state; this.currentHead = result.head; }
        return result;
      } catch (error) { this.diagnose(error instanceof OperationalEngineFailure ? error.code : "engine-command"); this.recover(); }
    }
    return this.synchronous(entry);
  }
  private synchronous(entry: Entry): OperationalEngineResult {
    const before = this.fallback ?? this.baseline, at = performance.now();
    const result = "command" in entry ? applyGameEvidenceCommand(before, entry.command, entry.context)
      : applyGameEvidenceBuildUndo(before, entry.target, entry.operationId);
    const delta = result.replayed ? null : gameEvidenceDelta(before, result.checkpoint), elapsedMs = performance.now() - at;
    this.fallback = result.checkpoint; this.currentHead = result.checkpoint.snapshot.head;
    if (!result.replayed) this.visible = result.state;
    return { state: this.visible, replayed: result.replayed, delta, head: result.checkpoint.snapshot.head,
      timing: { captureMs: 0, postMs: 0, publishMs: elapsedMs, workerComputeMs: 0, workerDiffMs: 0, elapsedMs } };
  }
  async checkpoint(): Promise<GameEvidenceCheckpoint> {
    if (this.client) {
      try { const checkpoint = await this.client.checkpoint(); this.baseline = checkpoint; return checkpoint; }
      catch (error) { this.diagnose(error instanceof OperationalEngineFailure ? error.code : "engine-checkpoint"); }
    }
    return this.recover();
  }
  async compact(): Promise<GameEvidenceCheckpoint> {
    if (!this.snapshotOnly) throw new OperationalEngineFailure("engine-compaction-policy");
    if (this.client) {
      try { const checkpoint = await this.client.compact(); this.baseline = checkpoint; this.currentHead = checkpoint.snapshot.head; return checkpoint; }
      catch (error) { this.diagnose(error instanceof OperationalEngineFailure ? error.code : "engine-compaction"); this.recover(); }
    }
    const checkpoint = createGameEvidenceCheckpoint(this.visible);
    this.baseline = checkpoint; this.currentHead = checkpoint.snapshot.head; this.fallback = checkpoint; return checkpoint;
  }
  dispose(): void { this.stopped = true; this.client?.dispose(); this.client = null; }
}
