/** Delivery time is separate from module startup and active task processing. */
export const WORKER_RECEIPT_DELAYS_MS = [1_500, 2_000, 3_000] as const;
export const WORKER_RECEIPT_TIMEOUT_MS = WORKER_RECEIPT_DELAYS_MS.reduce((sum, ms) => sum + ms, 0);
export interface WorkerReceipt { id: number; received: true }

/** Receipt-gated FIFO: never let a lost earlier post reorder later requests.
 * Retain only unreceived messages; task/result ownership stays with the client.
 */
export class WorkerDeliveryQueue<Message extends { id: number }> {
  private ready = false;
  private busy = false;
  private generation = 0;
  private flushQueued = false;
  private reposts = 0;
  private episodes = 0;
  private receiptTimeouts = 0;
  private readonly queued = new Map<number, { message: Message; sent: boolean; attempt: number; remaining: number; due: number;
    timer: ReturnType<typeof setTimeout> | null }>();
  constructor(private readonly send: (message: Message) => void,
    private readonly failed: () => void, private readonly reposted: () => void,
    private readonly postFailed: (id: number, error: unknown) => void) {}

  get health() { return { reposts: this.reposts, repostEpisodes: this.episodes, receiptTimeouts: this.receiptTimeouts, deliveryPaused: this.busy,
    unacked: [...this.queued.values()].filter(row => row.sent).length, buffered: [...this.queued.values()].filter(row => !row.sent).length }; }
  enqueue(message: Message): void {
    this.queued.set(message.id, { message, sent: false, attempt: 0, remaining: WORKER_RECEIPT_DELAYS_MS[0], due: 0, timer: null });
    this.flush();
  }
  start(): void { this.ready = true; this.flush(); }
  /** A synchronous task can prevent the worker from receiving its next post.
   * Its active-task cap remains responsible for a genuinely hung worker. */
  setBusy(busy: boolean): void {
    if (this.busy === busy) return;
    this.busy = busy;
    for (const row of this.queued.values()) {
      if (!row.sent) continue;
      if (busy && row.timer !== null) {
        clearTimeout(row.timer); row.timer = null; row.remaining = Math.max(0, row.due - performance.now());
      } else if (!busy) this.arm(row);
    }
  }
  /** Results/start messages also prove receipt if its control reply was lost. */
  acknowledge(id: number): void {
    const row = this.queued.get(id);
    if (!row) return;
    if (row.timer !== null) clearTimeout(row.timer);
    this.queued.delete(id); this.scheduleFlush();
  }
  reset(): void {
    this.generation++; this.ready = false; this.busy = false; this.flushQueued = false;
    for (const row of this.queued.values()) if (row.timer !== null) clearTimeout(row.timer);
    this.queued.clear();
  }
  private scheduleFlush(): void {
    if (this.flushQueued || !this.ready) return;
    this.flushQueued = true; const generation = this.generation;
    queueMicrotask(() => {
      if (generation !== this.generation) return;
      this.flushQueued = false; this.flush();
    });
  }
  private flush(): void {
    if (!this.ready) return;
    const row = this.queued.values().next().value;
    if (!row || row.sent) return;
    row.sent = true; this.post(row);
  }
  private post(row: { message: Message; sent: boolean; attempt: number; remaining: number; due: number; timer: ReturnType<typeof setTimeout> | null }): void {
    this.arm(row);
    try { this.send(row.message); }
    catch (error) { this.postFailed(row.message.id, error); }
  }
  private arm(row: { message: Message; sent: boolean; attempt: number; remaining: number; due: number; timer: ReturnType<typeof setTimeout> | null }): void {
    if (this.busy || row.timer !== null) return;
    const generation = this.generation;
    row.due = performance.now() + row.remaining;
    row.timer = setTimeout(() => {
      if (generation !== this.generation || this.queued.get(row.message.id) !== row) return;
      row.timer = null;
      if (row.attempt === WORKER_RECEIPT_DELAYS_MS.length - 1) {
        this.receiptTimeouts++; this.failed(); return;
      }
      if (row.attempt === 0) { this.episodes++; this.reposted(); }
      row.attempt++; this.reposts++; row.remaining = WORKER_RECEIPT_DELAYS_MS[row.attempt]!; this.post(row);
    }, row.remaining);
  }
}

/** Coalesce received ids instead of retaining a Set or result/payload history.
 * The increasing production stream occupies one range, including after restart.
 * Gaps/out-of-order test ports still acknowledge only actually received ids.
 */
export function createWorkerReceiptReceiver<Message extends { id: number }, Result>(
  post: (reply: WorkerReceipt) => void, run: (message: Message) => Result): (message: Message) => Result | undefined {
  const ranges: [number, number][] = [];
  return message => {
    const id = message.id, last = ranges.at(-1);
    let duplicate = false;
    if (!last || id > last[1]) {
      if (last && id === last[1] + 1) last[1] = id;
      else ranges.push([id, id]);
    } else {
      const index = ranges.findIndex(range => range[1] >= id), next = ranges[index]!, prior = ranges[index - 1];
      duplicate = next[0] <= id;
      if (!duplicate) {
        if (prior && prior[1] + 1 === id) {
          prior[1] = id;
          if (next[0] === id + 1) { prior[1] = next[1]; ranges.splice(index, 1); }
        } else if (next[0] === id + 1) next[0] = id;
        else ranges.splice(index, 0, [id, id]);
      }
    }
    post({ id: message.id, received: true });
    if (!duplicate) return run(message);
  };
}
