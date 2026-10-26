import { assertCloudRevision, CLOUD_CAPACITY_LIMITS } from "./codec";
import { utf8Bytes } from "./codecJson";
import { cloudCodec } from "./codecWorker";
import type { CloudCodecExecutor } from "./codecTasks";
import { type CloudCache, type CloudCacheEntry, type CloudCacheRead, type CloudRecovery } from "./cache";
import {
  CLOUD_CHECKPOINT_MS, CLOUD_GRACE_MS, CLOUD_LEASE_MS, CLOUD_RENEW_MS, CLOUD_SAVES_ENABLED_BY_DEFAULT,
  CLOUD_SYNC_PROTOCOL, CloudSyncError, type CloudCandidate, type CloudCapabilities, type CloudCommitReceipt,
  type CloudCommitRequest, type CloudConfirmed, type CloudFrozenOperation, type CloudLease, type CloudScope, type CloudTransport,
} from "./transport";

export interface CloudClock { wallNow(): number; monotonicNow(): number }
export type CloudSyncPhase = "off" | "checking" | "readonly" | "ready" | "saving" | "waiting" |
  "paused" | "conflict" | "auth" | "blocked" | "storage" | "capacity" | "closed";
export interface CloudSyncView {
  phase: CloudSyncPhase;
  canExecute: boolean;
  pending: boolean;
  localDurable: boolean;
  revision: string | null;
  confirmedAtMs: number | null;
  failure: string | null;
  priorRecovery?: { verifiedRevision: string; serverRevision: string };
  writerElsewhere?: boolean;
}
// Legacy explicit callers may label a checkpoint; these labels never schedule early uploads.
export type CloudCheckpointReason = "ordinary" | "hidden" | "pagehide" | "save-close" |
  "scored-answer" | "purchase" | "pause" | "mode-exit" | "campaign-switch";
interface TimePair { wall: number; mono: number }
interface LeaseWindow { lease: CloudLease; until: TimePair }
const clone = <T>(value: T): T => structuredClone(value);
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** One instance belongs to exactly one backend/account/campaign for its entire life. */
export class CloudSyncCoordinator {
  readonly scope: CloudScope;
  private readonly enabled: boolean;
  private readonly clock: CloudClock;
  private readonly newId: () => string;
  private readonly listeners = new Set<() => void>();
  private readonly receiptListeners = new Set<(receipt: CloudCommitReceipt) => void>();
  private record: CloudCacheRead | null = null;
  private attempted: CloudCacheEntry | null = null;
  private window: LeaseWindow | null = null;
  private phase: CloudSyncPhase;
  private failure: string | null = null;
  private epoch = 0;
  private stopped = false;
  private resumeAuthorized = false;
  private localDurable = true;
  private uploading: Promise<boolean> | null = null;
  private closing: Promise<boolean> | null = null;
  private closingRequested = false;
  private renewing = false;
  private checking = false;
  private localQueue: Promise<unknown> = Promise.resolve();
  private grace: TimePair | null = null;
  private lastSample: TimePair;
  private lastRenew: TimePair;
  private lastHead: TimePair;
  private dirtySince: TimePair | null = null;
  private coveredUsage = new Set<string>();
  private writerElsewhere = false;

  constructor(private readonly options: {
    scope: CloudScope; transport: CloudTransport; cache: CloudCache; enabled?: boolean;
    clock?: CloudClock; newOperationId?: () => string; codec?: CloudCodecExecutor;
  }) {
    this.scope = Object.freeze({ ...options.scope });
    this.enabled = options.enabled ?? CLOUD_SAVES_ENABLED_BY_DEFAULT;
    this.phase = this.enabled ? "checking" : "off";
    this.clock = options.clock ?? { wallNow: () => Date.now(), monotonicNow: () => performance.now() };
    this.newId = options.newOperationId ?? (() => crypto.randomUUID());
    this.lastSample = this.now(); this.lastRenew = this.now(); this.lastHead = this.now();
  }
  get codec(): CloudCodecExecutor { return this.options.codec ?? cloudCodec; }
  get confirmedRevision(): string | null { return this.record?.entry.confirmed.revision ?? null; }
  get encodingBase(): { revision: string; headerSha256: string; records: number } | null {
    const confirmed = this.record?.entry.confirmed;
    return confirmed ? { revision: confirmed.revision, headerSha256: confirmed.evidence.header.uncompressedSha256, records: confirmed.evidence.records.length } : null;
  }
  private now(): TimePair { return { wall: this.clock.wallNow(), mono: this.clock.monotonicNow() }; }
  private elapsed(start: TimePair): number { const now = this.now(); return Math.max(0, now.wall - start.wall, now.mono - start.mono); }
  private remaining(end: TimePair): number { const now = this.now(); return Math.min(end.wall - now.wall, end.mono - now.mono); }
  private live(epoch: number): boolean { return !this.stopped && epoch === this.epoch; }
  private emit(): void { for (const listener of this.listeners) listener(); }
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  onAcknowledged(listener: (receipt: CloudCommitReceipt) => void): () => void {
    this.receiptListeners.add(listener); return () => { this.receiptListeners.delete(listener); };
  }
  private recovery(): CloudRecovery | null { return (this.attempted ?? this.record?.entry)?.recovery ?? null; }
  get confirmed(): CloudConfirmed | null { return this.record ? clone(this.record.entry.confirmed) : null; }
  get pendingCandidate(): CloudCandidate | null {
    const pending = this.recovery();
    if (pending?.following) return clone(pending.following);
    return pending?.inFlight ? this.request(pending.inFlight) : null;
  }
  get view(): CloudSyncView {
    this.checkTime();
    return { phase: this.phase, canExecute: this.allowed(), pending: this.recovery() !== null,
      localDurable: this.localDurable, revision: this.record?.entry.confirmed.revision ?? null,
      confirmedAtMs: this.record?.entry.confirmed.acceptedAtMs ?? null, failure: this.failure,
      ...(this.record?.entry.confirmed.priorRecovery ? { priorRecovery: { verifiedRevision: this.record.entry.confirmed.revision,
        serverRevision: this.record.entry.confirmed.priorRecovery.serverRevision } } : {}), writerElsewhere: this.writerElsewhere };
  }
  private allowed(): boolean {
    return this.enabled && !this.stopped && !this.closingRequested && this.resumeAuthorized && this.localDurable &&
      this.window !== null && this.remaining(this.window.until) > 0 &&
      ["ready", "saving", "waiting"].includes(this.phase) && (!this.grace || this.remaining(this.grace) > 0);
  }
  private checkTime(): void {
    const now = this.now(), wall = now.wall - this.lastSample.wall, mono = now.mono - this.lastSample.mono;
    this.lastSample = now;
    if (this.window && (wall < 0 || mono < 0 || Math.abs(wall - mono) > 5_000)) {
      this.window = null; this.resumeAuthorized = false; this.phase = "paused"; this.failure = "clock";
    }
    if (this.window && (this.remaining(this.window.until) <= 0 || this.grace && this.remaining(this.grace) <= 0)) {
      this.resumeAuthorized = false;
      if (["ready", "saving", "waiting"].includes(this.phase)) this.phase = "paused";
      this.failure ??= "lease-expired";
    }
  }
  private async admitted(): Promise<CloudCapabilities> {
    const access = await this.options.transport.capabilities();
    if (access.accountId !== this.scope.accountId) throw new CloudSyncError("auth");
    if (access.deletionRequested) throw new CloudSyncError("deleted");
    if (!access.admitted) throw new CloudSyncError("revoked");
    if (!access.enabled || access.writesEnabled === false) throw new CloudSyncError("disabled");
    if (!access.noticeAccepted) throw new CloudSyncError("notice");
    if (access.minProtocol > CLOUD_SYNC_PROTOCOL) throw new CloudSyncError("protocol");
    return access;
  }
  private fail(error: unknown): void {
    if (this.stopped) return;
    const code = error instanceof CloudSyncError ? error.code : "network";
    this.failure = code;
    if (code === "network" || code === "throttled") {
      const remaining = this.window ? Math.max(0, this.remaining(this.window.until)) : 0;
      if (!this.grace) { const now = this.now(), duration = Math.min(CLOUD_GRACE_MS, remaining);
        this.grace = { wall: now.wall + duration, mono: now.mono + duration }; }
      this.phase = "waiting";
      this.checkTime();
    } else {
      this.resumeAuthorized = false;
      this.phase = code === "auth" ? "auth" : code === "writer" || code === "revision" ? "conflict" :
        code === "capacity" ? "capacity" : code === "storage" ? "storage" : "blocked";
      if (code === "storage") this.localDurable = false;
      if (["auth", "deleted", "revoked", "disabled", "protocol", "notice", "writer"].includes(code)) this.window = null;
    }
    this.emit();
  }
  private queue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.localQueue.then(operation);
    this.localQueue = result.catch(() => undefined);
    return result;
  }
  private async persist(entry: CloudCacheEntry): Promise<void> {
    this.attempted = clone(entry);
    try {
      this.record = await this.options.cache.write(entry, this.record?.cacheRevision ?? null);
      this.attempted = null; this.localDurable = true;
    } catch (error) { this.localDurable = false; throw error; }
  }
  private async verify(confirmed: CloudConfirmed, summary?: { name?: string; status?: "resumable" | "archived" }): Promise<void> {
    if (confirmed.campaignId !== this.scope.campaignId) throw new CloudSyncError("corrupt");
    try { const loaded = await this.codec.run({ kind: "verify", input: { ...confirmed, expectedRevision: confirmed.revision,
      expectedCampaignId: this.scope.campaignId, expectedBaselineId: confirmed.baselineId } });
      if (summary?.name !== undefined && loaded.campaign.name !== summary.name || summary?.status !== undefined && loaded.campaign.status !== summary.status) throw new CloudSyncError("corrupt"); }
    catch { throw new CloudSyncError("corrupt"); }
  }
  private async verifiedHead(head: Awaited<ReturnType<CloudTransport["head"]>>, cached?: CloudConfirmed): Promise<CloudConfirmed> {
    try {
      const confirmed = cached?.revision === head.revision && !cached.priorRecovery ? cached : await this.options.transport.load(this.scope.campaignId, head.revision);
      await this.verify(confirmed, head);
      return confirmed;
    } catch (error) {
      if (!(error instanceof CloudSyncError) || error.code !== "corrupt" || !head.priorRevision || head.priorRevision === head.revision) throw error;
      const prior = await this.options.transport.load(this.scope.campaignId, head.priorRevision);
      await this.verify(prior);
      return { ...prior, priorRecovery: { serverRevision: head.revision, serverEvidenceHighWater: head.evidenceHighWater ?? prior.evidence.records.length } };
    }
  }
  private request(operation: CloudFrozenOperation): CloudCommitRequest { return JSON.parse(operation.requestText) as CloudCommitRequest; }
  private installLease(lease: CloudLease, sent: TimePair): void {
    assertCloudRevision(lease.writerGeneration, true);
    const duration = Math.min(CLOUD_LEASE_MS, lease.expiresAtMs - lease.serverNowMs);
    if (!Number.isFinite(duration) || duration <= this.elapsed(sent) || lease.campaignId !== this.scope.campaignId || !lease.writerToken) {
      throw new CloudSyncError("writer");
    }
    this.window = { lease, until: { wall: sent.wall + duration, mono: sent.mono + duration } };
    this.lastRenew = sent;
  }

  /** Opening/metadata polling never acquires a writer and never falls back to a local game. */
  async open(): Promise<boolean> {
    if (!this.enabled || this.stopped) return false;
    const epoch = this.epoch;
    this.phase = "checking"; this.resumeAuthorized = false; this.emit();
    try {
      await this.admitted(); if (!this.live(epoch)) return false;
      const stored = await this.options.cache.read(this.scope); if (!this.live(epoch)) return false;
      this.record = stored;
      const head = await this.options.transport.head(this.scope.campaignId); if (!this.live(epoch)) return false;
      this.writerElsewhere = head.writerActive;
      this.lastHead = this.now();
      if (stored?.entry.recovery) {
        await this.verify(stored.entry.confirmed); if (!this.live(epoch)) return false;
        this.phase = "paused"; this.failure = "recovery-pending"; this.emit(); return true;
      }
      const confirmed = await this.verifiedHead(head, stored?.entry.confirmed); if (!this.live(epoch)) return false;
      await this.queue(() => this.persist({ schemaVersion: 1, scope: this.scope, confirmed, recovery: null }));
      if (!this.live(epoch)) return false;
      this.phase = "readonly"; this.failure = confirmed.priorRecovery ? "prior-recovery" : null; this.emit(); return true;
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
  }
  async startWriter(takeover = false): Promise<boolean> {
    if (!this.enabled || this.stopped || !this.record || this.record.entry.confirmed.priorRecovery || this.recovery() || this.checking) return false;
    this.checkTime();
    if (this.window && this.remaining(this.window.until) > 0 && this.phase === "ready") return true;
    this.checking = true; this.resumeAuthorized = false;
    const epoch = this.epoch;
    try {
      await this.admitted(); if (!this.live(epoch)) return false;
      const head = await this.options.transport.head(this.scope.campaignId); if (!this.live(epoch)) return false;
      if (head.revision !== this.record.entry.confirmed.revision) throw new CloudSyncError("revision");
      // The confirmed state was verified by open; acquire compares that exact revision.
      const sent = this.now(), lease = await this.options.transport.acquire({ campaignId: this.scope.campaignId,
        expectedRevision: this.record.entry.confirmed.revision, operationId: this.newId(), takeover,
        expectedWriterGeneration: head.writerGeneration });
      if (!this.live(epoch)) return false;
      if (lease.revision !== this.record.entry.confirmed.revision) throw new CloudSyncError("revision");
      this.installLease(lease, sent); this.writerElsewhere = false; this.grace = null; this.phase = "ready"; this.failure = null; this.emit(); return true;
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
    finally { this.checking = false; }
  }
  /** Explicit player Resume after checking/recovery; it never changes gameplay itself. */
  resume(): boolean {
    this.checkTime();
    if (this.closingRequested || this.phase !== "ready" || !this.window || !this.localDurable || this.remaining(this.window.until) <= 0) return false;
    this.resumeAuthorized = true; this.emit(); return true;
  }
  pause(): void { this.resumeAuthorized = false; this.emit(); }
  requireSessionReload(): void {
    this.resumeAuthorized = false; this.window = null; this.phase = "paused"; this.failure = "account-save-changed"; this.emit();
  }

  /** Local persistence starts immediately; only an actual failure closes the command gate. */
  stage(candidate: CloudCandidate, _reason: CloudCheckpointReason = "ordinary"): Promise<boolean> {
    this.checkTime();
    if (!this.allowed() || !this.record || !this.window) return Promise.resolve(false);
    const epoch = this.epoch;
    let frozen = clone(candidate);
    this.emit();
    return this.queue(async () => {
      if (!this.live(epoch) || !this.record || !this.window) return false;
      const prior = this.recovery();
      const accepted = this.record.entry.confirmed.evidence.records.length;
      if (frozen.evidence.fromRecord < accepted) {
        const covered = accepted - frozen.evidence.fromRecord;
        const prefix = this.record.entry.confirmed.evidence.records.slice(frozen.evidence.fromRecord);
        if (covered > frozen.evidence.records.length || prefix.some((row, index) => row.id !== frozen.evidence.records[index]?.id ||
          row.content.uncompressedSha256 !== frozen.evidence.records[index]?.content.uncompressedSha256)) throw new CloudSyncError("corrupt");
        frozen = { ...frozen, evidence: { ...frozen.evidence, fromRecord: accepted, records: frozen.evidence.records.slice(covered) },
          usageQuestions: frozen.usageQuestions.filter(r => !this.coveredUsage.has(r.receipt_id)) };
      }
      const recovery: CloudRecovery = { baseRevision: prior?.baseRevision ?? this.record.entry.confirmed.revision,
        writerGeneration: prior?.writerGeneration ?? this.window.lease.writerGeneration,
        inFlight: prior?.inFlight ?? null, following: frozen };
      this.attempted = clone({ ...this.record.entry, recovery });
      await this.codec.run({ kind: "candidate", input: { candidate: frozen, confirmed: this.record.entry.confirmed, scope: this.scope } });
      await this.persist({ ...this.record.entry, recovery });
      this.dirtySince ??= this.now();
      return true;
    }).catch(error => { if (this.live(epoch)) this.fail(error); return false; }).finally(() => {
      if (this.live(epoch)) this.emit();
    });
  }
  private async freeze(): Promise<CloudFrozenOperation | null> {
    return this.queue(async () => {
      const recovery = this.recovery();
      if (!this.record || !recovery || !this.window) return null;
      if (recovery.inFlight) return clone(recovery.inFlight);
      if (!recovery.following) return null;
      const request: CloudCommitRequest = { ...recovery.following, protocolVersion: 2, operationId: this.newId(),
        campaignId: this.scope.campaignId, expectedRevision: recovery.baseRevision,
        writerGeneration: recovery.writerGeneration, writerToken: this.window.lease.writerToken };
      const frozen = await this.codec.run({ kind: "freeze", input: request });
      const operation: CloudFrozenOperation = { operationId: request.operationId, createdAtMs: this.clock.wallNow(),
        ...frozen };
      if (this.options.transport.prepare) operation.wireRequest = await this.options.transport.prepare(request, operation.createdAtMs);
      if (operation.wireRequest && utf8Bytes(operation.wireRequest.text) > CLOUD_CAPACITY_LIMITS.transportBodyBytes) throw new CloudSyncError("capacity");
      await this.persist({ ...this.record.entry, recovery: { ...recovery, inFlight: operation, following: null } });
      return operation;
    });
  }
  private async acknowledge(operation: CloudFrozenOperation, receipt: CloudCommitReceipt): Promise<void> {
    await this.queue(async () => {
      const recovery = this.recovery(), request = this.request(operation);
      if (!this.record || recovery?.inFlight?.operationId !== operation.operationId || receipt.operationId !== operation.operationId ||
        receipt.requestSha256 !== (operation.wireRequest?.sha256 ?? operation.requestSha256) || receipt.campaignId !== this.scope.campaignId ||
        receipt.snapshotSha256 !== request.snapshot.uncompressedSha256 || receipt.snapshotBytes !== request.snapshot.uncompressedBytes ||
        receipt.evidenceHighWater !== request.evidence.toRecord ||
        !Number.isSafeInteger(receipt.acceptedAtMs) || receipt.acceptedAtMs < 0 ||
        !same([...receipt.usageReceiptIds].sort(), request.usageQuestions.map(r => r.receipt_id).sort())) throw new CloudSyncError("corrupt");
      assertCloudRevision(receipt.revision);
      if (BigInt(receipt.revision) !== BigInt(request.expectedRevision) + 1n) throw new CloudSyncError("corrupt");
      const confirmed: CloudConfirmed = { ...this.record.entry.confirmed, revision: receipt.revision,
        acceptedAtMs: receipt.acceptedAtMs, snapshot: request.snapshot,
        evidence: { header: this.record.entry.confirmed.evidence.header,
          records: [...this.record.entry.confirmed.evidence.records, ...request.evidence.records] } };
      await this.verify(confirmed);
      let following = recovery.following;
      if (following) {
        const covered = receipt.evidenceHighWater - following.evidence.fromRecord;
        if (covered < 0 || covered > following.evidence.records.length ||
          following.evidence.records.slice(0, covered).some((row, index) => row.id !== request.evidence.records[index]?.id ||
            row.content.uncompressedSha256 !== request.evidence.records[index]?.content.uncompressedSha256 ||
            row.content.uncompressedBytes !== request.evidence.records[index]?.content.uncompressedBytes)) throw new CloudSyncError("corrupt");
        const coveredUsage = new Set(receipt.usageReceiptIds);
        following = { ...following, evidence: { ...following.evidence, fromRecord: receipt.evidenceHighWater,
          records: following.evidence.records.slice(covered) }, usageQuestions: following.usageQuestions.filter(r => !coveredUsage.has(r.receipt_id)) };
      }
      await this.persist({ ...this.record.entry, confirmed, recovery: following ? { baseRevision: receipt.revision,
        writerGeneration: recovery.writerGeneration, inFlight: null, following } : null });
      this.coveredUsage = new Set(receipt.usageReceiptIds);
      for (const listener of this.receiptListeners) listener(receipt);
      // New commands can arrive throughout encoding/upload. Give that following
      // state its own quiet interval instead of uploading it on every pulse.
      this.dirtySince = following ? this.now() : null;
    });
  }
  checkpoint(_reason: CloudCheckpointReason = "ordinary"): Promise<boolean> {
    if (this.uploading) return this.uploading;
    this.checkTime();
    if (!this.enabled || this.stopped || !this.localDurable || !this.window || this.remaining(this.window.until) <= 0 ||
      !["ready", "saving"].includes(this.phase)) return Promise.resolve(false);
    if (!this.recovery()) return Promise.resolve(true);
    const epoch = this.epoch;
    this.phase = "saving"; this.emit();
    this.uploading = (async () => {
      try {
        const operation = await this.freeze();
        if (!operation || !this.live(epoch)) return false;
        const receipt = await this.options.transport.commit(operation);
        if (!this.live(epoch)) return false;
        await this.acknowledge(operation, receipt);
        if (!this.live(epoch)) return false;
        // A late acknowledgment never grants a new lease or resumes a paused game.
        if (this.phase === "saving") this.phase = "ready";
        this.checkTime(); this.emit(); return true;
      } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
      finally { this.uploading = null; }
    })();
    return this.uploading;
  }

  /** Fresh admission/head plus identical-operation lookup precede ANY retry/reacquire. */
  async retry(): Promise<boolean> {
    if (!this.enabled || this.stopped || this.checking || this.uploading) return false;
    this.checking = true; this.resumeAuthorized = false; const epoch = this.epoch;
    this.phase = "checking"; this.emit();
    try {
      await this.localQueue; await this.admitted(); if (!this.live(epoch)) return false;
      if (this.attempted) {
        const retained = clone(this.attempted), stored = await this.options.cache.read(this.scope);
        if (!this.live(epoch)) return false;
        if (stored && same(stored.entry, retained)) { this.record = stored; this.attempted = null; this.localDurable = true; }
        else { if ((stored?.cacheRevision ?? null) !== (this.record?.cacheRevision ?? null)) throw new CloudSyncError("storage");
          await this.persist(retained); }
      }
      if (!this.record || this.record.entry.confirmed.priorRecovery) return await this.open();
      let pending = this.recovery();
      const recoveredWriter = pending?.inFlight ? this.request(pending.inFlight) : null;
      const head = await this.options.transport.head(this.scope.campaignId); if (!this.live(epoch)) return false;
      this.lastHead = this.now();
      if (pending?.inFlight) {
        const operation = pending.inFlight, outcome = await this.options.transport.operation(this.scope.campaignId, operation.operationId, operation);
        if (!this.live(epoch)) return false;
        if (outcome.status === "expired") throw new CloudSyncError("operation-expired");
        if (outcome.status === "committed") await this.acknowledge(operation, outcome.receipt);
        else if (head.writerGeneration !== pending.writerGeneration) throw new CloudSyncError("writer");
        else if (head.revision !== pending.baseRevision) throw new CloudSyncError("revision");
        pending = this.recovery();
      }
      if (pending && head.writerGeneration !== pending.writerGeneration) throw new CloudSyncError("writer");
      if (head.revision !== this.record.entry.confirmed.revision) {
        throw new CloudSyncError("revision");
      }
      const currentWindow = this.window;
      if (currentWindow && this.remaining(currentWindow.until) > 0 && head.writerGeneration === currentWindow.lease.writerGeneration) {
        const sent = this.now(), renewed = await this.options.transport.renew(currentWindow.lease);
        if (!this.live(epoch)) return false;
        this.installLease(renewed, sent);
        // A missing in-flight outcome uses the SAME immutable request while this lease is valid.
      } else if (!currentWindow && recoveredWriter && head.writerActive && head.writerGeneration === recoveredWriter.writerGeneration) {
        const sent = this.now(), renewed = await this.options.transport.renew(recoveredWriter);
        if (!this.live(epoch)) return false;
        this.installLease(renewed, sent);
      } else {
        // Only a proven missing operation and an unchanged revision/generation may be rebound.
        // A revoked/taken-over writer is never silently reacquired.
        if (head.writerActive || currentWindow && head.writerGeneration !== currentWindow.lease.writerGeneration) throw new CloudSyncError("writer");
        const sent = this.now(), lease = await this.options.transport.acquire({ campaignId: this.scope.campaignId,
          expectedRevision: head.revision, operationId: this.newId(), takeover: false, expectedWriterGeneration: head.writerGeneration });
        if (!this.live(epoch)) return false;
        this.installLease(lease, sent);
        if (pending) {
          const flight = pending.inFlight ? this.request(pending.inFlight) : null;
          await this.persist({ ...this.record.entry, recovery: { baseRevision: head.revision, writerGeneration: lease.writerGeneration,
            inFlight: null, following: pending.following ?? flight } });
        }
      }
      this.grace = null; this.phase = "ready"; this.failure = null; this.emit();
      if (this.recovery() && !await this.checkpoint()) return false;
      return true;
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
    finally { this.checking = false; }
  }
  async focus(): Promise<boolean> {
    if (!this.enabled || this.stopped) return false;
    this.resumeAuthorized = false; this.emit();
    if (this.uploading) await this.uploading;
    if (this.stopped) return false;
    return this.window || this.recovery() ? this.retry() : this.open();
  }
  reportLocalFailure(error: unknown): void { this.fail(error instanceof CloudSyncError ? error : new CloudSyncError("corrupt")); }
  async pulse(): Promise<void> {
    if (!this.enabled || this.stopped) return;
    this.checkTime(); this.emit();
    if (this.checking || this.renewing || this.grace || !this.localDurable) return;
    const epoch = this.epoch;
    if (this.window && ["ready", "saving"].includes(this.phase) && this.elapsed(this.lastRenew) >= CLOUD_RENEW_MS) {
      this.renewing = true;
      const previous = this.window, sent = this.now();
      try {
        const lease = await this.options.transport.renew(previous.lease);
        if (!this.live(epoch)) return;
        if (lease.writerGeneration !== previous.lease.writerGeneration) throw new CloudSyncError("writer");
        this.checkTime();
        if (this.phase === "paused" || this.phase === "conflict") return;
        this.installLease(lease, sent);
      } catch (error) { if (this.live(epoch)) this.fail(error); }
      finally { this.renewing = false; }
    } else if (!this.window && this.phase === "readonly" && this.elapsed(this.lastHead) >= CLOUD_RENEW_MS) {
      this.lastHead = this.now();
      try { await this.admitted(); if (!this.live(epoch)) return;
        const head = await this.options.transport.head(this.scope.campaignId);
        if (this.live(epoch) && head.revision !== this.record?.entry.confirmed.revision) { this.phase = "paused"; this.failure = "account-save-changed"; } }
      catch (error) { if (this.live(epoch)) this.fail(error); }
    }
    if (this.dirtySince && this.elapsed(this.dirtySince) >= CLOUD_CHECKPOINT_MS) await this.checkpoint();
  }
  saveAndClose(): Promise<boolean> {
    if (this.closing) return this.closing;
    this.closingRequested = true;
    this.pause();
    this.closing = (async () => {
      await this.localQueue;
      while (this.recovery()) { if (!await this.checkpoint("save-close")) return false; }
      if (!this.window || !this.localDurable || this.stopped) return false;
      const epoch = this.epoch, lease = this.window.lease;
      try {
        await this.options.transport.release(lease); if (!this.live(epoch)) return false;
        this.window = null; this.phase = "closed"; this.emit(); return true;
      } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
    })().finally(() => { this.closing = null; this.closingRequested = false; if (!this.stopped) this.emit(); });
    return this.closing;
  }
  exportRecovery(): string | null {
    const entry = this.attempted ?? this.record?.entry;
    return entry?.recovery ? JSON.stringify(entry) : null;
  }
  async useAccountSave(keepRecoveryCopy: (bytes: string) => Promise<void>): Promise<boolean> {
    this.pause(); await this.localQueue;
    const bytes = this.exportRecovery();
    if (bytes) { try { await keepRecoveryCopy(bytes); } catch { return false; } }
    if (this.stopped || this.uploading) return false;
    const epoch = this.epoch;
    try {
      await this.admitted(); const confirmed = await this.verifiedHead(await this.options.transport.head(this.scope.campaignId));
      if (!this.live(epoch)) return false;
      await this.persist({ schemaVersion: 1, scope: this.scope, confirmed, recovery: null });
      this.window = null; this.grace = null; this.phase = "readonly"; this.failure = confirmed.priorRecovery ? "prior-recovery" : null; this.emit(); return true;
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
  }
  /** Sign-out, account/campaign switch and deletion revoke all later callbacks. No cache deletion. */
  dispose(reason: "switch" | "sign-out" | "revoked" | "deleted" = "switch"): void {
    this.stopped = true; this.epoch++; this.resumeAuthorized = false; this.window = null;
    this.phase = reason === "revoked" || reason === "deleted" ? "blocked" : "closed"; this.failure = reason; this.emit();
  }
}
