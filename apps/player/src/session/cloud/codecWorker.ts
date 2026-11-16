import { problemDiagnostics, technicalError } from "../../diagnostics/problemDiagnostics";
import { beginPhoneCloudOpening, phoneMemoryProfile } from "../../mobile/performance/phoneMemoryPolicy";
import { CloudCodecError } from "./codecJson";
import { handleCloudCodecMessage, unpackCodecFailure, type CloudCodecExecutor, type CloudCodecMessage, type CloudCodecReply, type CloudCodecResults, type CloudCodecTask } from "./codecTasks";
import { WorkerDeliveryQueue } from "./workerDelivery";

// Vite development loads the workspace graph as individual modules. Release
// builds load a bundled worker; neither startup nor processing waits forever.
export const CLOUD_WORKER_STARTUP_TIMEOUT_MS = import.meta.env?.MODE === "development" ? 60_000 : 10_000;
// Active processing only, measured from the worker's dequeue/start message.
// Keep the released generous cap; queued work never spends another task's budget.
export const CLOUD_WORKER_TASK_TIMEOUT_MS = 60_000;
export const PHONE_CODEC_IDLE_RELEASE_MS = 5_000;

export interface CloudCodecWorkerPort {
  onmessage: ((event: MessageEvent<CloudCodecReply>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage(message: CloudCodecMessage): void;
  terminate(): void;
}

/** One lazily started worker shared by save encoding, verification, cache bytes and wire pages. */
export class CloudCodecWorker implements CloudCodecExecutor {
  private worker: CloudCodecWorkerPort | null = null;
  private ready = false;
  private startupTimer: ReturnType<typeof setTimeout> | null = null;
  private dequeueTimer: ReturnType<typeof setTimeout> | null = null;
  private dequeueStarted: number | null = null;
  private dequeueHead: number | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private sequence = 0;
  private lastResponse: number | null = null;
  private lastError: string | null = null;
  private restarts = 0;
  private idleReleases = 0;
  private unregister: (() => void) | null = null;
  private readonly pending = new Map<number, { task: CloudCodecTask; posted: number; started: number | null; received: boolean; retries: number;
    resolve(value: unknown): void; reject(error: unknown): void; timer: ReturnType<typeof setTimeout> | null }>();
  private readonly delivery = new WorkerDeliveryQueue<CloudCodecMessage>(message => this.worker!.postMessage(message),
    () => this.fail(), () => problemDiagnostics.event("worker-delivery", "codec-repost"),
    (id, error) => this.postFailed(id, error));
  constructor(private readonly createWorker: (() => CloudCodecWorkerPort) | null = typeof Worker === "undefined" ?
    (typeof window === "undefined" ? null : () => { throw new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save."); }) :
    () => new Worker(new URL("./codec.worker.ts", import.meta.url), { type: "module" }),
    private readonly startupTimeoutMs = CLOUD_WORKER_STARTUP_TIMEOUT_MS,
    private readonly taskTimeoutMs = CLOUD_WORKER_TASK_TIMEOUT_MS) {}

  get health() { return { alive: this.worker !== null, ready: this.ready, restarts: this.restarts, idleReleases: this.idleReleases, lastError: this.lastError,
    ...this.delivery.health,
    responseAge: this.lastResponse === null ? null : Date.now() - this.lastResponse,
    inFlight: [...this.pending.values()].slice(0, 12).map(p => [p.started === null ? `queued:${p.task.kind}` : p.task.kind,
      Date.now() - (p.started ?? p.posted), p.retries]) }; }
  run<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]> {
    this.clearIdleTimer();
    if (["verify", "hydrate", "inspectCopy", "journalBind", "snapshotImport", "snapshotConvert"].includes(task.kind)) beginPhoneCloudOpening();
    const createWorker = this.createWorker;
    // Retain one captured payload for ready buffering, receipt re-posts and the
    // existing restart retry. Later caller edits must never change that task.
    try { task = structuredClone(task); }
    catch (error) { return Promise.reject(this.payloadFailure(error)); }
    if (!createWorker) return handleCloudCodecMessage({ id: 0, task }).then(reply => {
      if ("error" in reply) throw unpackCodecFailure(reply.error);
      if (!("result" in reply)) throw new CloudCodecError("worker_payload", "Save processing returned no checkpoint.");
      for (const code of reply.diagnosticCodes ?? []) problemDiagnostics.event("codec-repair", code);
      return reply.result as CloudCodecResults[T["kind"]];
    });
    this.unregister ??= problemDiagnostics.source("codec", () => this.health);
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      this.pending.set(id, { task, posted: Date.now(), started: null, received: false, retries: 0, resolve: value => resolve(value as CloudCodecResults[T["kind"]]), reject, timer: null });
      try { this.delivery.enqueue({ id, task }); this.ensureWorker(); this.watchDequeue(); }
      catch (error) { this.fail(error); }
    });
  }
  private ensureWorker(): void {
    if (this.worker || !this.createWorker) return;
    const worker = this.createWorker(); this.worker = worker;
    this.startupTimer = setTimeout(() => this.fail(), this.startupTimeoutMs);
    worker.onmessage = event => {
      if (this.worker !== worker) return;
      this.lastResponse = Date.now();
      const reply = event.data;
      if ("ready" in reply) {
        if (!this.ready) {
          this.ready = true;
          if (this.startupTimer !== null) clearTimeout(this.startupTimer);
          this.startupTimer = null; this.watchDequeue(); this.delivery.start();
        }
        return;
      }
      const waiting = this.pending.get(reply.id);
      if (!waiting) return;
      this.delivery.acknowledge(reply.id);
      waiting.received = true;
      this.delivery.setBusy(true);
      if ("received" in reply) { this.watchDequeue(); return; }
      if ("started" in reply) {
        if (waiting.started === null) {
          waiting.started = Date.now();
          waiting.timer = setTimeout(() => this.fail(), this.taskTimeoutMs);
        }
        this.delivery.setBusy(true);
        this.watchDequeue();
        return;
      }
      // Heartbeats show health without extending the active hung-task cap.
      if ("heartbeat" in reply) {
        if (waiting.started === null) {
          // A lost start reply must not turn heartbeats into an unlimited task.
          // Keep the quiet head's existing budget; time behind another active
          // task was excluded by watchDequeue, rather than charged here.
          waiting.started = this.dequeueStarted ?? Date.now();
          waiting.timer = setTimeout(() => this.fail(), Math.max(0, this.taskTimeoutMs - (Date.now() - waiting.started)));
          this.delivery.setBusy(true); this.watchDequeue();
        }
        return;
      }
      if ("error" in reply && reply.error.kind === "codec" && ["worker", "worker_unavailable"].includes(reply.error.code)) {
        this.fail(new CloudCodecError("worker_unavailable", "Save processing restarted.")); return;
      }
      this.pending.delete(reply.id); if (waiting.timer !== null) clearTimeout(waiting.timer);
      this.delivery.setBusy([...this.pending.values()].some(row => row.received));
      this.watchDequeue();
      if ("error" in reply) {
        const error = unpackCodecFailure(reply.error); this.lastError = technicalError(error);
        problemDiagnostics.error("codec-task", error); waiting.reject(error);
      } else {
        this.lastError = null;
        for (const code of reply.diagnosticCodes ?? []) problemDiagnostics.event("codec-repair", code);
        waiting.resolve(reply.result);
      }
      if (!this.pending.size && phoneMemoryProfile().mode === "reduced") {
        this.idleTimer = setTimeout(() => { this.idleTimer = null; this.releaseIdle(); }, PHONE_CODEC_IDLE_RELEASE_MS);
      }
    };
    worker.onerror = event => { event.preventDefault?.(); if (this.worker === worker) this.fail(); };
    worker.onmessageerror = () => { if (this.worker === worker) this.fail(); };
  }
  private postFailed(id: number, error: unknown): void {
    const waiting = this.pending.get(id);
    if (!waiting) return;
    if (!(error instanceof Error) || error.name !== "DataCloneError") { this.fail(error); return; }
    this.pending.delete(id); this.delivery.acknowledge(id);
    if (waiting.timer !== null) clearTimeout(waiting.timer);
    this.delivery.setBusy([...this.pending.values()].some(row => row.received));
    this.watchDequeue();
    waiting.reject(this.payloadFailure(error));
  }
  private watchDequeue(): void {
    // Last-resort liveness for a ready worker that never makes any progress.
    // Received work behind a known active task spends none of that task's time.
    const quiet = this.ready && this.pending.size > 0 && ![...this.pending.values()].some(row => row.started !== null);
    const head = this.pending.keys().next().value;
    if (quiet && (this.dequeueTimer === null || this.dequeueHead !== head)) {
      this.clearDequeue(); this.dequeueHead = head!;
      this.dequeueStarted = Date.now(); this.dequeueTimer = setTimeout(() => this.fail(), this.taskTimeoutMs);
    } else if (!quiet) this.clearDequeue();
  }
  private clearDequeue(): void {
    if (this.dequeueTimer !== null) clearTimeout(this.dequeueTimer);
    this.dequeueTimer = null; this.dequeueStarted = null; this.dequeueHead = null;
  }
  private payloadFailure(error: unknown): CloudCodecError {
    return new CloudCodecError(error instanceof Error && error.name === "DataCloneError" ? "worker_data_clone" : "worker_payload",
      "Save processing could not read the checkpoint. Retry the account save.");
  }
  private fail(error: unknown = new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save."), retry = true): void {
    this.clearIdleTimer();
    this.lastError = technicalError(error); problemDiagnostics.error("codec-worker", error);
    const failure = error instanceof CloudCodecError ? error : new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save.");
    if (this.worker) {
      this.worker.onmessage = null; this.worker.onerror = null; this.worker.onmessageerror = null; this.worker.terminate();
    }
    this.worker = null; this.ready = false;
    if (this.startupTimer !== null) clearTimeout(this.startupTimer);
    this.startupTimer = null;
    this.clearDequeue();
    this.delivery.reset();
    for (const [id, waiting] of this.pending) {
      if (waiting.timer !== null) clearTimeout(waiting.timer); waiting.timer = null;
      waiting.started = null; waiting.received = false; waiting.posted = Date.now();
      // Codec tasks are pure or idempotent journal CAS/derived-cache writes.
      // No RPC runs here. Retry the SAME payload once, never mint operation IDs.
      if (retry && waiting.retries < 1) { waiting.retries++; }
      else { this.pending.delete(id); waiting.reject(failure); }
    }
    if (this.pending.size) {
      this.restarts++; problemDiagnostics.event("watchdog", "codec-worker-restart");
      try { for (const [id, waiting] of this.pending) this.delivery.enqueue({ id, task: waiting.task }); this.ensureWorker(); }
      catch (nextError) { this.fail(nextError, false); }
    }
  }
  /** Drop only derived caches after every posted task has replied. Durable IDB
   * and returned snapshots belong to the caller; no accepted work is cancelled. */
  releaseIdle(): boolean {
    if (this.pending.size) return false;
    this.clearIdleTimer();
    if (!this.worker) return true;
    const worker = this.worker; this.worker = null; this.ready = false;
    worker.onmessage = null; worker.onerror = null; worker.onmessageerror = null; worker.terminate();
    if (this.startupTimer !== null) clearTimeout(this.startupTimer);
    this.clearDequeue();
    this.delivery.reset();
    this.startupTimer = null; this.idleReleases++;
    problemDiagnostics.event("phone-memory", "codec-idle-release");
    return true;
  }
  private clearIdleTimer(): void {
    if (this.idleTimer !== null) clearTimeout(this.idleTimer);
    this.idleTimer = null;
  }
  dispose(): void { this.fail(undefined, false); this.unregister?.(); this.unregister = null; }
}

export const cloudCodec: CloudCodecExecutor = new CloudCodecWorker();
