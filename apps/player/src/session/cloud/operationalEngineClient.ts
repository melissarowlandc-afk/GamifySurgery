import type { DomainContext, GameCommand, GameEvidenceCheckpoint, GameEvidenceDelta, GameState } from "@gamify-surgery/game-domain";
import { applyOperationalStatePatch } from "./operationalStatePatch";
import type { OperationalContextFlags, OperationalEngineReply, OperationalEngineRequest, OperationalEngineResult, OperationalViewReply, OperationalViewRequest } from "./operationalEngineProtocol";
import type { PrototypePlayerView } from "../viewModels";
import type { OperationalViewArguments } from "./operationalViewProjection";
import type { JournalRow } from "../localJournal";
import { OperationalEvidenceMirror } from "./operationalEvidenceMirror";
import { freezeOperationalValue as freeze } from "./operationalFreeze";

export interface OperationalEnginePort {
  onmessage: ((event: MessageEvent<OperationalEngineReply>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage(request: OperationalEngineRequest): void;
  terminate(): void;
}
type Request = OperationalEngineRequest extends infer T ? T extends { id: number } ? Omit<T, "id"> : never : never;
type Waiting = { resolve(value: OperationalEngineReply | OperationalEngineResult): void; reject(error: unknown): void;
  timer: ReturnType<typeof setTimeout>; posted: number; postMs: number; request: Request };
type Head = GameEvidenceCheckpoint["snapshot"]["head"];
const sameHead = (left: Head, right: Head) => left.sequence === right.sequence && left.transitionId === right.transitionId;
const headShape = (value: Head): boolean => value !== null && typeof value === "object" && Number.isSafeInteger(value.sequence) && value.sequence >= 0 &&
  (value.transitionId === null || typeof value.transitionId === "string");
const finiteTime = (value: number) => Number.isFinite(value) && value >= 0;

export class OperationalEngineFailure extends Error {
  constructor(readonly code: string) { super(`Operational engine failed: ${code}.`); this.name = "OperationalEngineFailure"; }
}

/** Explicit async boundary; callers must await completed commands before
 * capturing undo/build targets and drain idle() before leave/checkpoint work.
 * It does not silently replace CloudGameSession.execute's synchronous contract.
 */
export class OperationalEngineClient {
  private mirror: OperationalEvidenceMirror;
  private readonly deltaVersions = new WeakMap<GameEvidenceDelta, number>();
  private current: GameState;
  private version = 0;
  private sequence = 0;
  private closed = false;
  private failure = "engine-stopped";
  private queued = 0;
  private head: Head;
  private records: number;
  private currentView: PrototypePlayerView | null = null;
  private projection: OperationalViewRequest | undefined;
  private projectionRevision = 0;
  private snapshotOnly = false;
  private serial: Promise<void> = Promise.resolve();
  private readonly pending = new Map<number, Waiting>();
  private constructor(private readonly port: OperationalEnginePort, state: GameState, checkpoint: GameEvidenceCheckpoint,
    private readonly timeoutMs: number, private readonly queueLimit: number) {
    this.current = freeze(structuredClone(state));
    this.mirror = OperationalEvidenceMirror.create(checkpoint);
    this.head = { ...checkpoint.snapshot.head }; this.records = checkpoint.evidence.records.length;
    port.onmessage = event => this.receive(event.data);
    port.onerror = event => { event.preventDefault?.(); this.fail("engine-worker"); };
    port.onmessageerror = () => this.fail("engine-payload");
  }
  static async create(seed: { checkpoint: GameEvidenceCheckpoint; visibleState: GameState; context?: DomainContext; atRealMs: number; projection?: OperationalViewRequest; snapshotOnly?: boolean },
    createPort: () => OperationalEnginePort = () => new Worker(new URL("./operationalEngine.worker.ts", import.meta.url), { type: "module" }),
    timeoutMs = 60_000, queueLimit = 128, startupTimeoutMs = timeoutMs): Promise<OperationalEngineClient> {
    if (!finiteTime(timeoutMs) || timeoutMs === 0 || !finiteTime(startupTimeoutMs) || startupTimeoutMs === 0 || !Number.isSafeInteger(queueLimit) || queueLimit < 1) throw new OperationalEngineFailure("engine-options");
    const port = createPort(); let client: OperationalEngineClient;
    try { client = new OperationalEngineClient(port, seed.visibleState, seed.checkpoint, timeoutMs, queueLimit); }
    catch (error) { port.terminate(); throw error; }
    client.snapshotOnly = seed.snapshotOnly === true;
    if (seed.projection) { client.projection = structuredClone(seed.projection); client.projectionRevision = seed.projection.revision; }
    let reply: OperationalEngineReply | OperationalEngineResult;
    try { reply = await client.request({ kind: "initialize", ...seed }, startupTimeoutMs); }
    catch (error) { client.dispose(); throw error; }
    if (!("kind" in reply) || reply.kind !== "initialized" || reply.version !== 0 || !headShape(reply.head) || !sameHead(reply.head, client.head)) {
      client.fail("engine-initialize"); throw new OperationalEngineFailure("engine-initialize");
    }
    return client;
  }
  get state(): GameState { return this.current; }
  get recoveryCheckpoint(): GameEvidenceCheckpoint { return this.mirror.checkpoint; }
  get view(): PrototypePlayerView | null { return this.currentView; }
  get canAccept(): boolean { return !this.closed && this.queued < this.queueLimit; }
  get queuedCommands(): number { return this.queued; }
  async hashJournalRows(rows: readonly JournalRow[], full = false): Promise<string[]> {
    if (this.closed || this.pending.size >= this.queueLimit) throw new OperationalEngineFailure(this.closed ? this.failure : "engine-backlog");
    // Independent of the stateful queue/version; WebCrypto cannot build a tick backlog.
    const inputs = rows.map(row => {
      const deltaVersion = !full && row.delta ? this.deltaVersions.get(row.delta) : undefined;
      return deltaVersion === undefined ? { row } : { row: { ...row, delta: null }, deltaVersion };
    });
    const reply = await this.request({ kind: "journalHashes", rows: inputs });
    if (!("kind" in reply) || reply.kind !== "journalHashes") throw new OperationalEngineFailure("engine-journal-hash");
    if (reply.missing) { if (full) throw new OperationalEngineFailure("engine-journal-hash"); return this.hashJournalRows(rows, true); }
    return reply.hashes;
  }
  execute(command: GameCommand, context?: DomainContext, contextFlags?: OperationalContextFlags): Promise<OperationalEngineResult> {
    if (!this.canAccept) return Promise.reject(new OperationalEngineFailure(this.closed ? this.failure : "engine-backlog"));
    const at = performance.now(), captured = structuredClone({ command, ...(context ? { context } : {}), ...(contextFlags ? { contextFlags } : {}),
      ...(this.projection ? { projection: this.projection } : {}) }), captureMs = performance.now() - at;
    return this.enqueue(async () => {
      const result = await this.request({ kind: "command", expectedVersion: this.version, ...captured }) as OperationalEngineResult;
      result.timing.captureMs = captureMs; return result;
    });
  }
  /** Small immutable render inputs; installing them does not queue a projection. */
  setProjection(args: OperationalViewArguments, followOpenChart = false): void {
    this.projection = structuredClone({ revision: ++this.projectionRevision, args, followOpenChart });
  }
  undo(target: GameState, operationId: string): Promise<OperationalEngineResult> {
    if (!this.canAccept) return Promise.reject(new OperationalEngineFailure(this.closed ? this.failure : "engine-backlog"));
    const at = performance.now(), captured = structuredClone({ target, ...(this.projection ? { projection: this.projection } : {}) }), captureMs = performance.now() - at;
    return this.enqueue(async () => {
      const result = await this.request({ kind: "undo", expectedVersion: this.version, ...captured, operationId }) as OperationalEngineResult;
      result.timing.captureMs = captureMs; return result;
    });
  }
  project(args: OperationalViewArguments, asOfRealMs?: number): Promise<PrototypePlayerView> {
    if (!this.canAccept) return Promise.reject(new OperationalEngineFailure(this.closed ? this.failure : "engine-backlog"));
    const projection = structuredClone({ revision: ++this.projectionRevision, args, ...(asOfRealMs !== undefined ? { asOfRealMs } : {}) });
    this.projection = projection;
    return this.enqueue(async () => {
      const reply = await this.request({ kind: "project", expectedVersion: this.version, projection });
      if (!("kind" in reply) || reply.kind !== "projected" || !this.currentView) throw new OperationalEngineFailure("engine-projection");
      return this.currentView;
    });
  }
  checkpoint(): Promise<GameEvidenceCheckpoint> {
    return this.enqueue(async () => {
      const reply = await this.request({ kind: "checkpoint", expectedVersion: this.version });
      if (!("kind" in reply) || reply.kind !== "checkpoint" || reply.version !== this.version) throw new OperationalEngineFailure("engine-checkpoint");
      this.mirror = OperationalEvidenceMirror.create(reply.checkpoint, true);
      return reply.checkpoint;
    });
  }
  /** Ordered, explicit compaction for the existing acknowledgement/tail policy.
   * This API has no timer and never schedules a cloud upload by itself.
   */
  compact(): Promise<GameEvidenceCheckpoint> {
    if (!this.snapshotOnly) return Promise.reject(new OperationalEngineFailure("engine-compaction-policy"));
    return this.enqueue(async () => {
      const reply = await this.request({ kind: "compact", expectedVersion: this.version });
      if (!("kind" in reply) || reply.kind !== "compacted") throw new OperationalEngineFailure("engine-compaction");
      this.mirror = OperationalEvidenceMirror.create(reply.checkpoint, true);
      return reply.checkpoint;
    });
  }
  idle(): Promise<void> { return this.serial.then(() => { if (this.closed) throw new OperationalEngineFailure(this.failure); }); }
  dispose(): void { this.fail("engine-stopped"); }
  private enqueue<T>(read: () => Promise<T>): Promise<T> {
    if (!this.canAccept) return Promise.reject(new OperationalEngineFailure(this.closed ? this.failure : "engine-backlog"));
    this.queued++;
    const result = this.serial.then(() => { if (this.closed) throw new OperationalEngineFailure(this.failure); return read(); }).finally(() => { this.queued--; });
    this.serial = result.then(() => {}, () => {});
    return result;
  }
  private request(request: Request, timeoutMs = this.timeoutMs): Promise<OperationalEngineReply | OperationalEngineResult> {
    if (this.closed) return Promise.reject(new OperationalEngineFailure(this.failure));
    return new Promise((resolve, reject) => {
      const id = ++this.sequence, posted = performance.now();
      const waiting: Waiting = { resolve, reject, posted, postMs: 0, request,
        timer: setTimeout(() => this.fail("engine-timeout"), timeoutMs) };
      this.pending.set(id, waiting);
      try { const at = performance.now(); this.port.postMessage({ ...request, id } as OperationalEngineRequest); waiting.postMs = performance.now() - at; }
      catch { this.fail("engine-payload"); }
    });
  }
  private receive(reply: OperationalEngineReply): void {
    if (this.closed) return;
    if (!reply || typeof reply !== "object" || !Number.isSafeInteger(reply.id)) { this.fail("engine-message"); return; }
    const waiting = this.pending.get(reply.id);
    if (!waiting) { this.fail("engine-message"); return; }
    this.pending.delete(reply.id); clearTimeout(waiting.timer);
    if (reply.kind === "failure") {
      const code = typeof reply.code === "string" && /^[a-z0-9-]{1,80}$/.test(reply.code) ? reply.code : "engine-command";
      waiting.reject(new OperationalEngineFailure(code)); this.fail(code); return;
    }
    try {
      if (waiting.request.kind === "journalHashes") {
        if (reply.kind === "journalHashes" && reply.missing === true && reply.hashes === undefined && waiting.request.rows.some(row => row.deltaVersion !== undefined)) {
          waiting.resolve(reply); return;
        }
        if (reply.kind !== "journalHashes" || !Array.isArray(reply.hashes) || reply.hashes.length !== waiting.request.rows.length ||
          reply.hashes.some(hash => typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash))) throw new OperationalEngineFailure("engine-journal-hash");
        waiting.resolve(reply); return;
      }
      if (waiting.request.kind === "initialize") {
        if (reply.kind !== "initialized" || reply.version !== 0 || !headShape(reply.head) || !sameHead(reply.head, this.head)) throw new OperationalEngineFailure("engine-initialize");
        this.currentView = this.readProjection(reply.projection, waiting.request.projection);
        waiting.resolve(reply); return;
      }
      if (waiting.request.kind === "project") {
        if (reply.kind !== "projected" || reply.version !== this.version) throw new OperationalEngineFailure("engine-version");
        this.currentView = this.readProjection(reply.projection, waiting.request.projection);
        waiting.resolve(reply); return;
      }
      if (waiting.request.kind === "checkpoint") {
        if (reply.kind !== "checkpoint" || reply.version !== this.version || !reply.checkpoint ||
            reply.checkpoint.snapshot?.campaignId !== this.current.campaignId || !headShape(reply.checkpoint.snapshot?.head) ||
            !sameHead(reply.checkpoint.snapshot.head, this.head) || reply.checkpoint.evidence?.records?.length !== this.records)
          throw new OperationalEngineFailure("engine-checkpoint");
        waiting.resolve(reply); return;
      }
      if (waiting.request.kind === "compact") {
        if (reply.kind !== "compacted" || reply.baseVersion !== this.version || reply.version !== this.version + 1 ||
            reply.checkpoint?.snapshot?.campaignId !== this.current.campaignId || !headShape(reply.checkpoint.snapshot.head) ||
            reply.checkpoint.snapshot.head.sequence !== 0 || reply.checkpoint.snapshot.head.transitionId !== null || !Array.isArray(reply.checkpoint.evidence?.records))
          throw new OperationalEngineFailure("engine-compaction");
        this.version = reply.version; this.head = freeze({ ...reply.checkpoint.snapshot.head }); this.records = reply.checkpoint.evidence.records.length;
        waiting.resolve(reply); return;
      }
      if (reply.kind !== "applied") throw new OperationalEngineFailure("engine-message");
      if (reply.baseVersion !== this.version || reply.version !== this.version + 1) throw new OperationalEngineFailure("engine-version");
      if (!headShape(reply.head) || typeof reply.replayed !== "boolean" || !finiteTime(reply.computeMs) || !finiteTime(reply.diffMs)) throw new OperationalEngineFailure("engine-message");
      let added = 0;
      if (reply.replayed) {
        if (reply.delta !== null || reply.patch !== undefined || reply.snapshotPatch !== undefined || !sameHead(reply.head, this.head)) throw new OperationalEngineFailure("engine-chain");
      } else {
        const delta = reply.delta;
        if (!delta || delta.fromSequence !== this.head.sequence || delta.fromRecord !== this.records ||
            !headShape(delta.head) || !sameHead(delta.head, reply.head) || reply.head.sequence !== this.head.sequence + 1 ||
            !Array.isArray(delta.records) || !Array.isArray(delta.patches) ||
            delta.records.some((row, i) => row?.id !== `e${(this.records + i + 1).toString(36)}`)) throw new OperationalEngineFailure("engine-chain");
        added = delta.records.length;
      }
      const at = performance.now(), state = applyOperationalStatePatch(this.current, reply.patch, true);
      const statePatchMs = performance.now() - at, viewStarted = performance.now();
      if (!state || state.campaignId !== this.current.campaignId || state.schemaVersion !== this.current.schemaVersion) throw new OperationalEngineFailure("engine-state");
      const view = this.readProjection(reply.projection, waiting.request.projection);
      const viewPatchMs = performance.now() - viewStarted, freezeStarted = performance.now();
      const mirror = reply.replayed ? this.mirror : this.mirror.advance(reply.snapshotPatch, freeze(reply.delta!));
      const recoveryMs = performance.now() - freezeStarted, stateFreezeStarted = performance.now();
      this.current = freeze(state); this.version = reply.version; this.head = freeze({ ...reply.head }); this.records += added;
      this.currentView = view;
      const freezeMs = performance.now() - stateFreezeStarted;
      this.mirror = mirror;
      if (reply.delta) this.deltaVersions.set(reply.delta, reply.version);
      const publishMs = performance.now() - at;
      waiting.resolve({ state: this.current, replayed: reply.replayed, delta: reply.delta, head: reply.head,
        ...(reply.projection && view ? { view, viewArguments: waiting.request.projection?.followOpenChart
          ? [state.openChartEncounterId, ...waiting.request.projection.args.slice(1)] as OperationalViewArguments : waiting.request.projection?.args,
          projection: { revision: reply.projection.revision, asOfRealMs: reply.projection.asOfRealMs,
          computeMs: reply.projection.computeMs, diffMs: reply.projection.diffMs } } : {}),
        timing: { captureMs: 0, postMs: waiting.postMs, publishMs, statePatchMs, viewPatchMs, freezeMs, recoveryMs,
          workerComputeMs: reply.computeMs, workerDiffMs: reply.diffMs, elapsedMs: performance.now() - waiting.posted } });
    } catch (error) {
      const code = error instanceof OperationalEngineFailure ? error.code : "engine-patch";
      waiting.reject(new OperationalEngineFailure(code)); this.fail(code);
    }
  }
  private readProjection(reply: OperationalViewReply | undefined, expected: OperationalViewRequest | undefined): PrototypePlayerView | null {
    if (!expected) { if (reply) throw new OperationalEngineFailure("engine-projection"); return this.currentView; }
    if (!reply || reply.revision !== expected.revision || !Number.isFinite(reply.asOfRealMs) ||
        expected.asOfRealMs !== undefined && reply.asOfRealMs !== expected.asOfRealMs || !finiteTime(reply.computeMs) || !finiteTime(reply.diffMs))
      throw new OperationalEngineFailure("engine-projection");
    const view = applyOperationalStatePatch(this.currentView, reply.patch, true);
    if (!view || typeof view !== "object" || !Array.isArray(view.patients) || !view.facility || !view.serviceIncome)
      throw new OperationalEngineFailure("engine-projection");
    return freeze(view);
  }
  private fail(code: string): void {
    if (this.closed) return;
    this.closed = true; this.failure = code;
    for (const waiting of this.pending.values()) { clearTimeout(waiting.timer); waiting.reject(new OperationalEngineFailure(code)); }
    this.pending.clear(); this.port.terminate();
  }
}
