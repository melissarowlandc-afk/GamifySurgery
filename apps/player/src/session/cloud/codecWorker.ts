import { problemDiagnostics, technicalError } from "../../diagnostics/problemDiagnostics";
import { CloudCodecError } from "./codecJson";
import { handleCloudCodecMessage, unpackCodecFailure, type CloudCodecExecutor, type CloudCodecMessage, type CloudCodecReply, type CloudCodecResults, type CloudCodecTask } from "./codecTasks";

// Vite development loads the workspace graph as individual modules. Release
// builds load a bundled worker; neither startup nor processing waits forever.
export const CLOUD_WORKER_STARTUP_TIMEOUT_MS = import.meta.env.MODE === "development" ? 60_000 : 10_000;
export const CLOUD_WORKER_TASK_TIMEOUT_MS = 5_000;

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
  private sequence = 0;
  private lastResponse: number | null = null;
  private lastError: string | null = null;
  private restarts = 0;
  private unregister: (() => void) | null = null;
  private readonly pending = new Map<number, { task: CloudCodecTask; started: number; retries: number;
    resolve(value: unknown): void; reject(error: unknown): void; timer: ReturnType<typeof setTimeout> | null }>();
  constructor(private readonly createWorker: (() => CloudCodecWorkerPort) | null = typeof Worker === "undefined" ?
    (typeof window === "undefined" ? null : () => { throw new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save."); }) :
    () => new Worker(new URL("./codec.worker.ts", import.meta.url), { type: "module" }),
    private readonly startupTimeoutMs = CLOUD_WORKER_STARTUP_TIMEOUT_MS,
    private readonly taskTimeoutMs = CLOUD_WORKER_TASK_TIMEOUT_MS) {}

  get health() { return { alive: this.worker !== null, ready: this.ready, restarts: this.restarts, lastError: this.lastError,
    responseAge: this.lastResponse === null ? null : Date.now() - this.lastResponse,
    inFlight: [...this.pending.values()].slice(0, 12).map(p => [p.task.kind, Date.now() - p.started, p.retries]) }; }
  run<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]> {
    const createWorker = this.createWorker;
    if (import.meta.env.DEV || import.meta.env.MODE === "test" || !createWorker) {
      try { task = structuredClone(task); }
      catch (error) { return Promise.reject(this.payloadFailure(error)); }
    }
    if (!createWorker) return handleCloudCodecMessage({ id: 0, task }).then(reply => {
      if ("error" in reply) throw unpackCodecFailure(reply.error);
      if (!("result" in reply)) throw new CloudCodecError("worker_payload", "Save processing returned no checkpoint.");
      return reply.result as CloudCodecResults[T["kind"]];
    });
    this.unregister ??= problemDiagnostics.source("codec", () => this.health);
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      this.pending.set(id, { task, started: Date.now(), retries: 0, resolve: value => resolve(value as CloudCodecResults[T["kind"]]), reject, timer: null });
      try { this.ensureWorker(); this.post(id); }
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
      if (!this.ready) {
        this.ready = true;
        if (this.startupTimer !== null) clearTimeout(this.startupTimer);
        this.startupTimer = null;
        for (const [id, waiting] of this.pending) {
          if (waiting.timer !== null) clearTimeout(waiting.timer);
          waiting.timer = setTimeout(() => this.fail(), this.taskTimeoutMs);
        }
      }
      const reply = event.data;
      if ("ready" in reply) return;
      const waiting = this.pending.get(reply.id);
      if (!waiting) return;
      if ("error" in reply && reply.error.kind === "codec" && ["worker", "worker_unavailable"].includes(reply.error.code)) {
        this.fail(new CloudCodecError("worker_unavailable", "Save processing restarted.")); return;
      }
      this.pending.delete(reply.id); if (waiting.timer !== null) clearTimeout(waiting.timer);
      if ("error" in reply) {
        const error = unpackCodecFailure(reply.error); this.lastError = technicalError(error);
        problemDiagnostics.error("codec-task", error); waiting.reject(error);
      } else { this.lastError = null; waiting.resolve(reply.result); }
    };
    worker.onerror = event => { event.preventDefault?.(); if (this.worker === worker) this.fail(); };
    worker.onmessageerror = () => { if (this.worker === worker) this.fail(); };
  }
  private post(id: number): void {
    const waiting = this.pending.get(id);
    if (!waiting || !this.worker) return;
    waiting.timer = this.ready ? setTimeout(() => this.fail(), this.taskTimeoutMs) : null;
    try { this.worker.postMessage({ id, task: waiting.task }); }
    catch (error) {
      if (!(error instanceof Error) || error.name !== "DataCloneError") throw error;
      this.pending.delete(id); if (waiting.timer !== null) clearTimeout(waiting.timer);
      waiting.reject(this.payloadFailure(error));
    }
  }
  private payloadFailure(error: unknown): CloudCodecError {
    return new CloudCodecError(error instanceof Error && error.name === "DataCloneError" ? "worker_data_clone" : "worker_payload",
      "Save processing could not read the checkpoint. Retry the account save.");
  }
  private fail(error: unknown = new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save."), retry = true): void {
    this.lastError = technicalError(error); problemDiagnostics.error("codec-worker", error);
    const failure = error instanceof CloudCodecError ? error : new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save.");
    if (this.worker) {
      this.worker.onmessage = null; this.worker.onerror = null; this.worker.onmessageerror = null; this.worker.terminate();
    }
    this.worker = null; this.ready = false;
    if (this.startupTimer !== null) clearTimeout(this.startupTimer);
    this.startupTimer = null;
    for (const [id, waiting] of this.pending) {
      if (waiting.timer !== null) clearTimeout(waiting.timer); waiting.timer = null;
      // Codec tasks are pure or idempotent journal CAS/derived-cache writes.
      // No RPC runs here. Retry the SAME payload once, never mint operation IDs.
      if (retry && waiting.retries < 1) { waiting.retries++; }
      else { this.pending.delete(id); waiting.reject(failure); }
    }
    if (this.pending.size) {
      this.restarts++; problemDiagnostics.event("watchdog", "codec-worker-restart");
      try { this.ensureWorker(); for (const id of this.pending.keys()) this.post(id); }
      catch (nextError) { this.fail(nextError, false); }
    }
  }
  dispose(): void { this.fail(undefined, false); this.unregister?.(); this.unregister = null; }
}

export const cloudCodec: CloudCodecExecutor = new CloudCodecWorker();
