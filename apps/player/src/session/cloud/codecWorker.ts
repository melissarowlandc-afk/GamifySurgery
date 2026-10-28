import { CloudCodecError } from "./codecJson";
import { runCloudCodecTask, unpackCodecFailure, type CloudCodecExecutor, type CloudCodecMessage, type CloudCodecReply, type CloudCodecResults, type CloudCodecTask } from "./codecTasks";

// Vite development loads the workspace graph as individual modules. Release
// builds load a bundled worker; neither startup nor processing waits forever.
export const CLOUD_WORKER_STARTUP_TIMEOUT_MS = import.meta.env.MODE === "development" ? 60_000 : 30_000;
export const CLOUD_WORKER_TASK_TIMEOUT_MS = 30_000;

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
  private readonly pending = new Map<number, { resolve(value: unknown): void; reject(error: unknown): void; timer: ReturnType<typeof setTimeout> | null }>();
  constructor(private readonly createWorker: (() => CloudCodecWorkerPort) | null = typeof Worker === "undefined" ?
    (typeof window === "undefined" ? null : () => { throw new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save."); }) :
    () => new Worker(new URL("./codec.worker.ts", import.meta.url), { type: "module" }),
    private readonly startupTimeoutMs = CLOUD_WORKER_STARTUP_TIMEOUT_MS) {}

  run<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]> {
    // Node/unit tests have no Worker. Browser startup/runtime failures must surface, never silently block gameplay with inline work.
    const createWorker = this.createWorker;
    if (!createWorker) return runCloudCodecTask(task);
    return new Promise((resolve, reject) => {
      try {
        if (!this.worker) {
          const worker = createWorker(); this.worker = worker;
          this.startupTimer = setTimeout(() => this.fail(), this.startupTimeoutMs);
          this.worker.onmessage = event => {
            if (this.worker !== worker) return;
            const reply = event.data;
            // A reply also proves readiness for older/fake worker ports.
            if (!this.ready) {
              this.ready = true;
              if (this.startupTimer !== null) clearTimeout(this.startupTimer);
              this.startupTimer = null;
              for (const waiting of this.pending.values()) waiting.timer = setTimeout(() => this.fail(), CLOUD_WORKER_TASK_TIMEOUT_MS);
            }
            if ("ready" in reply) return;
            const waiting = this.pending.get(reply.id);
            if (!waiting) return;
            this.pending.delete(reply.id); if (waiting.timer !== null) clearTimeout(waiting.timer);
            if ("error" in reply) waiting.reject(unpackCodecFailure(reply.error)); else waiting.resolve(reply.result);
          };
          this.worker.onerror = event => { event.preventDefault?.(); if (this.worker === worker) this.fail(); };
          this.worker.onmessageerror = () => { if (this.worker === worker) this.fail(); };
        }
        const id = ++this.sequence;
        const timer = this.ready ? setTimeout(() => this.fail(), CLOUD_WORKER_TASK_TIMEOUT_MS) : null;
        this.pending.set(id, { resolve: value => resolve(value as CloudCodecResults[T["kind"]]), reject, timer });
        // The immutable checkpoint is structured-cloned once. Serialization remains entirely in the worker.
        this.worker.postMessage({ id, task });
      } catch (error) { this.fail(error); reject(error); }
    });
  }
  private fail(error: unknown = new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save.")): void {
    if (this.worker) {
      this.worker.onmessage = null; this.worker.onerror = null; this.worker.onmessageerror = null; this.worker.terminate();
    }
    this.worker = null; this.ready = false;
    if (this.startupTimer !== null) clearTimeout(this.startupTimer);
    this.startupTimer = null;
    for (const waiting of this.pending.values()) { if (waiting.timer !== null) clearTimeout(waiting.timer); waiting.reject(error); }
    this.pending.clear();
  }
  dispose(): void { this.fail(); }
}

export const cloudCodec: CloudCodecExecutor = new CloudCodecWorker();
