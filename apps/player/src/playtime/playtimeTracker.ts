import {
  USAGE_HEARTBEAT_MS, USAGE_IDLE_MS, USAGE_INTERVAL_MS, USAGE_MAX_OBSERVATION_GAP_MS,
  type PlaytimeUsageReceipt, type UsageStatus, type UsageTransport, type QuestionUsageReceipt,
} from "./usageTypes";
import { UsageOutbox } from "./usageOutbox";

export interface UsageClock { monotonic(): number; wall(): number; }
export interface TrackedGame { campaignId: string | null; paused: boolean; finishReportOpen: boolean; }

/** Pure accounting/controller; browser lifecycle and React each bind it once. */
export class PlaytimeTracker {
  private game: TrackedGame = { campaignId: null, paused: true, finishReportOpen: false };
  private visible = false;
  private lease = false;
  private lastInput = -Infinity;
  private lastMono: number;
  private lastWall: number;
  private heartbeatAt: number;
  private sessionId: string | null = null;
  private interval: { start: number; end: number; active: number } | null = null;
  private timelineEnd: number | null = null;
  private fractionalActive = 0;
  private access = { admitted: false, notice_accepted: false, deletion_requested: false };
  private state: UsageStatus["state"] = "requires-notice";
  private stopped = false;
  private inFlight: Promise<void> | null = null;
  private listeners = new Set<() => void>();

  constructor(readonly outbox: UsageOutbox, private transport: UsageTransport,
    private clock: UsageClock, private uuid: () => string) {
    this.lastMono = clock.monotonic(); this.lastWall = clock.wall(); this.heartbeatAt = this.lastMono;
  }

  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  private publish() { for (const listener of this.listeners) listener(); }
  status(): UsageStatus { return { state: this.state, ...this.outbox.status(), countingHere: this.lease && this.canRecordQuestions() }; }

  async refreshAccess(): Promise<void> {
    if (this.stopped) return;
    try {
      const access = await this.transport.access();
      if (this.stopped) return;
      this.sample(); this.seal(); this.access = { ...access, deletion_requested: access.deletion_requested || this.outbox.deletionRequested() };
      this.state = access.deletion_requested ? "deleted" : this.outbox.deletionRequested() || !access.admitted ? "blocked" :
        !access.notice_accepted ? "requires-notice" : this.outbox.status().pendingReceipts ? "pending" : "ready";
      if (access.deletion_requested) this.outbox.clear();
    } catch { if (!this.stopped) this.state = "unavailable"; }
    this.publish();
  }

  /** Step 3 must call this only after the owner-reviewed full notice is accepted. */
  async acceptNotice(version: string): Promise<void> {
    if (this.stopped) return;
    await this.transport.acceptNotice(version);
    await this.refreshAccess();
  }

  canRecordQuestions(): boolean {
    return !this.stopped && !this.outbox.deletionRequested() && this.access.admitted && this.access.notice_accepted && !this.access.deletion_requested;
  }

  createQuestionReceipt(): QuestionUsageReceipt | null {
    return this.canRecordQuestions() ? { receipt_id: this.uuid(), kind: "question", occurred_at: new Date(this.clock.wall()).toISOString() } : null;
  }

  /** Called only AFTER the single local write of scored state + staging receipts. */
  commitQuestions(receipts: readonly QuestionUsageReceipt[]): boolean {
    if (!this.canRecordQuestions()) return false;
    const durable = this.outbox.append(receipts);
    if (receipts.length) this.state = "pending";
    this.publish();
    return durable;
  }

  activity(): void { this.sample(); this.lastInput = this.clock.monotonic(); }
  setVisible(visible: boolean): void {
    this.sample(); if (!visible) this.cut(); this.visible = visible;
    if (!visible) void this.flush();
  }
  setLease(lease: boolean): void { this.sample(); if (!lease) this.cut(); this.lease = lease; this.publish(); }
  setGame(game: TrackedGame): void {
    this.sample();
    const ended = game.campaignId !== this.game.campaignId || (game.finishReportOpen && !this.game.finishReportOpen);
    const pauseBoundary = game.paused && !this.game.paused;
    if (ended || pauseBoundary) this.cut();
    if (ended) this.sessionId = null;
    this.game = game;
    if (ended || pauseBoundary) void this.flush();
  }

  sample(): void {
    const mono = this.clock.monotonic(), wall = this.clock.wall();
    const delta = mono - this.lastMono;
    const eligible = this.canRecordQuestions() && this.visible && this.lease && this.game.campaignId !== null &&
      !this.game.paused && !this.game.finishReportOpen;
    if (eligible && delta > 0 && delta <= USAGE_MAX_OBSERVATION_GAP_MS &&
      Math.abs(wall - this.lastWall - delta) <= USAGE_MAX_OBSERVATION_GAP_MS) {
      const elapsed = Math.max(0, Math.min(delta, this.lastInput + USAGE_IDLE_MS - this.lastMono));
      const active = Math.floor(elapsed + this.fractionalActive);
      this.fractionalActive += elapsed - active;
      if (active > 0) this.add(this.lastWall, active);
      if (elapsed < delta) this.cut();
    } else if (delta > 0) this.cut();
    this.lastMono = mono; this.lastWall = wall;
  }

  tick(): void {
    if (this.stopped) return;
    this.sample();
    if (this.clock.monotonic() - this.heartbeatAt >= USAGE_HEARTBEAT_MS) {
      this.heartbeatAt = this.clock.monotonic(); this.seal(); void this.flush();
    }
  }

  private add(start: number, active: number): void {
    this.sessionId ??= this.uuid();
    // Date.now is integral and performance.now is fractional. Keep a contiguous
    // monotonic timeline instead of fragmenting on their ordinary 1ms jitter.
    start = this.timelineEnd ?? start;
    while (active > 0) {
      this.interval ??= { start, end: start, active: 0 };
      const midnight = (Math.floor(start / 86_400_000) + 1) * 86_400_000;
      const part = Math.min(active, USAGE_INTERVAL_MS - this.interval.active, midnight - start);
      this.interval.end += part; this.interval.active += part; start += part; active -= part;
      if (this.interval.active === USAGE_INTERVAL_MS || start === midnight) this.seal();
    }
    this.timelineEnd = start;
  }

  private cut(): void { this.seal(); this.timelineEnd = null; this.fractionalActive = 0; }

  private seal(): void {
    if (!this.interval) return;
    const receipt: PlaytimeUsageReceipt = { receipt_id: this.uuid(), kind: "playtime", session_id: this.sessionId!,
      started_at: new Date(this.interval.start).toISOString(), ended_at: new Date(this.interval.end).toISOString(), active_ms: this.interval.active };
    this.interval = null;
    this.outbox.append([receipt]); this.state = "pending"; this.publish();
  }

  flush(keepalive = false): Promise<void> {
    this.sample(); this.seal();
    if (this.stopped || !this.canRecordQuestions()) return Promise.resolve();
    if (this.inFlight) return this.inFlight;
    // One batch per heartbeat; reconnect backlogs drain in bounded requests.
    const batch = this.outbox.batch();
    if (!batch.length) return Promise.resolve();
    const request = (async () => {
      await Promise.resolve();
      try {
        const acknowledged = await this.transport.ingest(batch, keepalive);
        if (this.stopped || this.access.deletion_requested) return;
        const sent = new Set(batch.map((r) => r.receipt_id));
        this.outbox.acknowledge(acknowledged.filter((id) => sent.has(id)));
        this.state = this.outbox.status().pendingReceipts ? "pending" : "ready";
      } catch { if (!this.stopped) this.state = "unavailable"; }
      finally { this.inFlight = null; this.publish(); }
    })();
    this.inFlight = request;
    return request;
  }

  pagehide(): void {
    this.sample(); this.cut(); void this.flush(true);
    this.visible = false; this.sessionId = null;
  }

  endSession(): void { this.sample(); this.cut(); this.sessionId = null; void this.flush(); }

  async requestDeletion(fullAccountDeletion?: () => Promise<void>): Promise<void> {
    // Freeze immediately, including retries, even if delivery fails. The UI may retry.
    this.sample(); this.interval = null; this.access.deletion_requested = true; this.state = "blocked"; this.publish();
    this.outbox.markDeletionRequested();
    this.outbox.clear();
    await (fullAccountDeletion ? fullAccountDeletion() : this.transport.requestDeletion());
    this.outbox.clear(); this.state = "deleted"; this.publish();
  }

  stop(): void {
    this.sample(); this.seal(); this.stopped = true; this.lease = false; this.publish();
  }
}
