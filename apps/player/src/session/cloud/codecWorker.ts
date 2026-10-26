import { CloudCodecError } from "./codecJson";
import { runCloudCodecTask, unpackCodecFailure, type CloudCodecExecutor, type CloudCodecMessage, type CloudCodecReply, type CloudCodecResults, type CloudCodecTask } from "./codecTasks";

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
  private sequence = 0;
  private readonly pending = new Map<number, { resolve(value: unknown): void; reject(error: unknown): void }>();
  constructor(private readonly createWorker: (() => CloudCodecWorkerPort) | null = typeof Worker === "undefined" ?
    (typeof window === "undefined" ? null : () => { throw new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save."); }) :
    () => new Worker(new URL("./codec.worker.ts", import.meta.url), { type: "module" })) {}

  run<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]> {
    // Node/unit tests have no Worker. Browser startup/runtime failures must surface, never silently block gameplay with inline work.
    const createWorker = this.createWorker;
    if (!createWorker) return runCloudCodecTask(task);
    return new Promise((resolve, reject) => {
      try {
        if (!this.worker) {
          this.worker = createWorker();
          this.worker.onmessage = event => {
            const reply = event.data, waiting = this.pending.get(reply.id);
            if (!waiting) return;
            this.pending.delete(reply.id);
            if ("error" in reply) waiting.reject(unpackCodecFailure(reply.error)); else waiting.resolve(reply.result);
          };
          this.worker.onerror = event => { event.preventDefault?.(); this.fail(); };
          this.worker.onmessageerror = () => this.fail();
        }
        const id = ++this.sequence;
        this.pending.set(id, { resolve: value => resolve(value as CloudCodecResults[T["kind"]]), reject });
        // The immutable checkpoint is structured-cloned once. Serialization remains entirely in the worker.
        this.worker.postMessage({ id, task });
      } catch (error) { this.fail(error); reject(error); }
    });
  }
  private fail(error: unknown = new CloudCodecError("worker_unavailable", "Save processing is unavailable. Retry the account save.")): void {
    this.worker?.terminate(); this.worker = null;
    for (const waiting of this.pending.values()) waiting.reject(error);
    this.pending.clear();
  }
  dispose(): void { this.fail(); }
}

export const cloudCodec: CloudCodecExecutor = new CloudCodecWorker();
