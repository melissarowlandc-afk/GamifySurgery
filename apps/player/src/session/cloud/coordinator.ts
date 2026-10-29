import { assertCloudRevision, CLOUD_CAPACITY_LIMITS } from "./codec";
import { isStorageQuotaError, reclaimAuxiliaryStorage } from "../storagePressure";
import { isCloudCodecProcessingError, utf8Bytes } from "./codecJson";
import { cloudCodec } from "./codecWorker";
import { cloudScopeData } from "./scopeData";
import { cloudCheckDeadline, CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";
import type { CloudEntryStore } from "./entryStorage";
import { newWriterToken, readWriterIdentity, writeWriterIdentity, type WriterAcquisition } from "./writerIdentity";
import type { CloudConflictCopies } from "./progress";
import { importSeparateCloudCampaign, separateCloudCampaignId } from "./importCampaigns";
import { cloudCopyFamily, copyDescendsFrom } from "./copySelection";
import type { CloudCodecExecutor } from "./codecTasks";
import { CloudCacheError } from "./codecCache";
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
  conflictCopies?: CloudConflictCopies;
}
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
  // A clock discontinuity revokes local authority, but the server may still
  // recognize this token. Retain it only for a fresh, fenced recheck.
  private suspendedLease: CloudLease | null = null;
  private retainedWriter: CloudLease | null = null;
  private acquisition: WriterAcquisition | null = null;
  private writerFromStorage = false;
  private reconnecting: Promise<boolean> | null = null;
  private autoReconnect = false;
  private lastReconnect: TimePair;
  private retryAfterMs = 0;
  private prepareLocalRecovery: (() => Promise<boolean>) | null = null;
  private phase: CloudSyncPhase;
  private failure: string | null = null;
  private epoch = 0;
  private stopped = false;
  private resumeAuthorized = false;
  private localDurable = true;
  private localCacheConflict = false;
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
  private conflictCopies: CloudConflictCopies | undefined;
  private offlineLocal = false;
  private offlineBase = false;
  private automaticSelection: (() => Promise<boolean>) | null = null;

  constructor(private readonly options: {
    scope: CloudScope; transport: CloudTransport; cache: CloudCache; enabled?: boolean;
    clock?: CloudClock; newOperationId?: () => string; codec?: CloudCodecExecutor; entryStore?: CloudEntryStore;
  }) {
    this.scope = Object.freeze(cloudScopeData(options.scope, options.scope.campaignId));
    this.enabled = options.enabled ?? CLOUD_SAVES_ENABLED_BY_DEFAULT;
    this.phase = this.enabled ? "checking" : "off";
    this.clock = options.clock ?? { wallNow: () => Date.now(), monotonicNow: () => performance.now() };
    this.newId = options.newOperationId ?? (() => crypto.randomUUID());
    this.lastSample = this.now(); this.lastRenew = this.now(); this.lastHead = this.now();
    this.lastReconnect = this.now();
  }
  get codec(): CloudCodecExecutor { return this.options.codec ?? cloudCodec; }
  get confirmedRevision(): string | null { return this.record?.entry.confirmed.revision ?? null; }
  get hasLocalCacheConflict(): boolean { return this.localCacheConflict; }
  get reconnectsAutomatically(): boolean { return this.autoReconnect; }
  beforeReconnect(prepare: () => Promise<boolean>): () => void {
    this.prepareLocalRecovery = prepare;
    return () => { if (this.prepareLocalRecovery === prepare) this.prepareLocalRecovery = null; };
  }
  onAutomaticSelection(select: () => Promise<boolean>): () => void {
    this.automaticSelection = select;
    return () => { if (this.automaticSelection === select) this.automaticSelection = null; };
  }
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
  get recoveryEntry(): CloudCacheEntry | null { return clone(this.attempted ?? this.record?.entry ?? null); }
  get pendingCandidate(): CloudCandidate | null {
    const pending = this.recovery();
    if (pending?.following) return clone(pending.following);
    return pending?.inFlight ? this.request(pending.inFlight) : null;
  }
  get view(): CloudSyncView {
    this.checkTime();
    return { phase: this.phase, canExecute: this.allowed(), pending: this.offlineBase || this.recovery() !== null || Boolean(this.record?.entry.recovery),
      localDurable: this.localDurable, revision: this.record?.entry.confirmed.revision ?? null,
      confirmedAtMs: this.record?.entry.confirmed.acceptedAtMs ?? null, failure: this.failure,
      ...(this.record?.entry.confirmed.priorRecovery ? { priorRecovery: { verifiedRevision: this.record.entry.confirmed.revision,
        serverRevision: this.record.entry.confirmed.priorRecovery.serverRevision } } : {}), writerElsewhere: this.writerElsewhere,
      ...(this.conflictCopies ? { conflictCopies: clone(this.conflictCopies) } : {}) };
  }
  private allowed(): boolean {
    return this.enabled && !this.stopped && !this.closingRequested && this.resumeAuthorized && this.localDurable &&
      (this.offlineLocal || this.window !== null && this.remaining(this.window.until) > 0) &&
      ["ready", "saving", "waiting"].includes(this.phase) && (!this.grace || this.remaining(this.grace) > 0);
  }
  private checkTime(): void {
    const now = this.now(), wall = now.wall - this.lastSample.wall, mono = now.mono - this.lastSample.mono;
    this.lastSample = now;
    if (this.window && (wall < 0 || mono < 0 || Math.abs(wall - mono) > 5_000)) {
      this.suspendedLease = this.window.lease;
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
    this.retryAfterMs = error instanceof CloudSyncError ? error.retryAfterMs : 0;
    this.failure = code;
    if (code === "network" || code === "throttled") {
      const remaining = this.window ? Math.max(0, this.remaining(this.window.until)) : 0;
      if (!this.grace) { const now = this.now(), duration = Math.min(CLOUD_GRACE_MS, remaining);
        this.grace = { wall: now.wall + duration, mono: now.mono + duration }; }
      this.phase = "waiting";
      this.checkTime();
    } else {
      this.offlineLocal = false;
      this.resumeAuthorized = false;
      this.phase = code === "auth" ? "auth" : code === "writer" || code === "revision" ? "conflict" :
        code === "capacity" ? "capacity" : code === "storage" ? "storage" : "blocked";
      if (code === "storage" || code === "processing") this.localDurable = false;
      if (["auth", "deleted", "revoked", "disabled", "protocol", "notice", "writer"].includes(code)) { this.window = null; this.suspendedLease = null; }
      if (["auth", "deleted", "revoked", "disabled", "protocol", "writer"].includes(code))
        void this.options.entryStore?.write(`command-block:${this.scope.campaignId}`, { failure: code }).catch(() => {});
    }
    this.emit();
  }
  private queue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.localQueue.then(operation);
    this.localQueue = result.catch(() => undefined);
    return result;
  }
  private async boundedCheck(work: (epoch: number) => Promise<boolean>): Promise<boolean> {
    const epoch = this.epoch;
    try {
      return await cloudCheckDeadline(work(epoch), undefined, () => {
        if (!this.live(epoch)) return;
        // A late read, codec reply or lease response cannot revive this check.
        // Retained operation/token proofs still resolve uncertain server writes.
        this.epoch++; this.checking = false; this.resumeAuthorized = false;
        this.fail(new CloudSyncError("network"));
      });
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
  }
  private async persist(entry: CloudCacheEntry): Promise<void> {
    const epoch = this.epoch;
    this.localCacheConflict = false;
    this.attempted = clone(entry);
    try {
      try {
        const stored = await cloudCheckDeadline(this.options.cache.write(entry, this.record?.cacheRevision ?? null));
        if (!this.live(epoch)) throw new CloudSyncError("auth");
        this.record = stored;
      }
      catch (error) {
        if (!this.live(epoch)) throw error;
        if (!isStorageQuotaError(error)) throw error;
        this.localDurable = false; this.emit();
        await reclaimAuxiliaryStorage();
        // Never overwrite another writer or repeat a successful lost response.
        const stored = await cloudCheckDeadline(this.options.cache.read(this.scope));
        if (!this.live(epoch)) throw new CloudSyncError("auth");
        if (stored && same(stored.entry, entry)) this.record = stored;
        else {
          if ((stored?.cacheRevision ?? null) !== (this.record?.cacheRevision ?? null)) throw error;
          const retried = await cloudCheckDeadline(this.options.cache.write(entry, this.record?.cacheRevision ?? null));
          if (!this.live(epoch)) throw new CloudSyncError("auth");
          this.record = retried;
        }
      }
      this.attempted = null; this.localDurable = true;
    } catch (error) {
      if (this.live(epoch)) {
        this.localDurable = false;
        if (error instanceof CloudCacheError && error.reason === "conflict") {
          // A previous document can finish its last local commit after our read.
          // Keep both the original immutable request and accepted following bytes
          // before asking the automatic opener to read/rank the new cache again.
          if (this.options.entryStore) {
            for (const device of [this.record?.entry, this.attempted]) if (device?.recovery)
              await this.preserveEntry(device, device.confirmed);
          }
          this.localCacheConflict = true;
        }
      }
      throw error;
    }
  }
  private async verify(confirmed: CloudConfirmed, summary?: { name?: string; status?: "resumable" | "archived" }): Promise<void> {
    if (confirmed.campaignId !== this.scope.campaignId) throw new CloudSyncError("corrupt");
    try { const loaded = await this.codec.run({ kind: "verify", input: { ...confirmed, expectedRevision: confirmed.revision,
      expectedCampaignId: this.scope.campaignId, expectedBaselineId: confirmed.baselineId } });
      if (summary?.name !== undefined && loaded.campaign.name !== summary.name || summary?.status !== undefined && loaded.campaign.status !== summary.status) throw new CloudSyncError("corrupt"); }
    catch (error) { throw new CloudSyncError(isCloudCodecProcessingError(error) ? "processing" : "corrupt"); }
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
    this.retainedWriter = lease;
    this.suspendedLease = null;
    this.lastRenew = sent;
  }
  private async acquire(head: { revision: string; writerGeneration: string }, takeover: boolean, epoch: number): Promise<CloudLease> {
    const acquisition: WriterAcquisition = { campaignId: this.scope.campaignId, expectedRevision: head.revision,
      expectedWriterGeneration: head.writerGeneration, operationId: this.newId(), writerToken: newWriterToken(), takeover };
    this.acquisition = acquisition;
    await writeWriterIdentity(this.options.entryStore, this.scope, this.retainedWriter, acquisition);
    if (!this.live(epoch)) throw new CloudSyncError("auth");
    return cloudCheckDeadline(this.options.transport.acquire(acquisition));
  }
  private async rememberWriter(epoch: number): Promise<void> {
    if (!this.live(epoch)) return;
    try { if (await writeWriterIdentity(this.options.entryStore, this.scope, this.retainedWriter)) this.acquisition = null; }
    catch { /* The durable acquisition intent remains valid proof if the receipt write stalls. */ }
    this.writerFromStorage = false;
    try {
      if ((await this.options.entryStore?.read<{ failure: string | null }>(`command-block:${this.scope.campaignId}`))?.failure)
        await this.options.entryStore?.write(`command-block:${this.scope.campaignId}`, { failure: null });
    } catch { /* A fresh server lease is authoritative; stale gates only deny offline reopen. */ }
  }
  private deviceCopy(): CloudConfirmed | null {
    const confirmed = this.confirmed, pending = this.pendingCandidate;
    return confirmed && pending ? { ...confirmed, snapshot: pending.snapshot,
      evidence: { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } } : confirmed;
  }
  private follows(device: CloudConfirmed, account: CloudConfirmed): boolean {
    return !account.priorRecovery && device.baselineId === account.baselineId &&
      device.evidence.header.uncompressedSha256 === account.evidence.header.uncompressedSha256 &&
      device.evidence.records.length >= account.evidence.records.length && account.evidence.records.every((row, index) => {
        const local = device.evidence.records[index];
        return local?.id === row.id && local.content.uncompressedSha256 === row.content.uncompressedSha256 && local.content.uncompressedBytes === row.content.uncompressedBytes;
      });
  }
  private async compareCopies(epoch: number): Promise<void> {
    try {
      const device = this.deviceCopy(); if (!device) return;
      const account = await this.verifiedHead(await this.options.transport.head(this.scope.campaignId));
      const summary = (copy: CloudConfirmed) => this.codec.run({ kind: "verify", input: { ...copy, expectedRevision: copy.revision,
        expectedCampaignId: this.scope.campaignId, expectedBaselineId: copy.baselineId } });
      const [local, remote, campaigns, separateId] = await Promise.all([summary(device), summary(account),
        this.options.transport.list().catch(() => null), separateCloudCampaignId(device)]);
      if (this.live(epoch)) this.conflictCopies = { device: local.progress, account: remote.progress, accountRevision: account.revision,
        newer: local.progress.facilityTick > remote.progress.facilityTick ? "device" : local.progress.facilityTick < remote.progress.facilityTick ? "account" : "same-time",
        canKeepDevice: this.follows(device, account),
        ...(campaigns ? { separateCampaignSlots: Math.max(0, 2 - campaigns.length),
          canSaveSeparate: campaigns.length < 2 || campaigns.some(row => row.campaignId === separateId) } : {}) };
    } catch { /* A failed preview must never replace a retained save or grant play. */ }
  }
  private async failChecked(error: unknown, epoch: number): Promise<void> {
    if (!this.live(epoch)) return;
    this.fail(error); // Fence immediately; preview work must never extend authority.
    if (error instanceof CloudSyncError && ["deleted", "corrupt"].includes(error.code)) {
      try {
        const access = await cloudCheckDeadline(this.options.transport.capabilities(), 3_000);
        if (access.admitted && !access.deletionRequested && access.accountId === this.scope.accountId) {
          const family = await cloudCopyFamily(this.scope.campaignId), summaries = await cloudCheckDeadline(this.options.transport.list(), 3_000);
          for (const row of summaries) if (!summaries.some(row => row.campaignId === this.scope.campaignId) &&
            row.campaignId !== this.scope.campaignId && await cloudCopyFamily(row.campaignId) === family) {
            if (this.live(epoch)) this.fail(new CloudSyncError("writer"));
            return;
          }
        }
      } catch { /* Revocation/deletion remains fenced if classification is unavailable. */ }
    }
    if (error instanceof CloudSyncError && ["writer", "revision"].includes(error.code)) {
      await this.compareCopies(epoch); if (this.live(epoch)) this.emit();
    }
  }

  /** Opening/metadata polling never acquires a writer and never falls back to a local game. */
  open(verifyRemoteHead = false): Promise<boolean> { return this.boundedCheck(epoch => this.openChecked(epoch, verifyRemoteHead)); }
  private async openChecked(epoch: number, verifyRemoteHead: boolean): Promise<boolean> {
    if (!this.enabled || this.stopped) return false;
    this.phase = "checking"; this.resumeAuthorized = false; this.emit();
    try {
      await reclaimAuxiliaryStorage(undefined, true);
      await this.admitted(); if (!this.live(epoch)) return false;
      const stored = await this.options.cache.read(this.scope); if (!this.live(epoch)) return false;
      this.record = stored;
      this.offlineBase = Boolean(await this.options.entryStore?.read(`offline-base:${this.scope.campaignId}`));
      const identity = await readWriterIdentity(this.options.entryStore, this.scope); if (!this.live(epoch)) return false;
      if (identity) { this.retainedWriter = identity.lease; this.acquisition = identity.acquisition; this.writerFromStorage = true; }
      const head = await this.options.transport.head(this.scope.campaignId); if (!this.live(epoch)) return false;
      this.writerElsewhere = head.writerActive;
      this.lastHead = this.now();
      if (stored && (stored.entry.recovery || this.offlineBase)) {
        await this.verify(stored.entry.confirmed); if (!this.live(epoch)) return false;
        if (!verifyRemoteHead) {
          this.phase = "paused"; this.failure = "recovery-pending"; this.emit(); return true;
        }
        // A corrupt remote head still needs its genuine read-only recovery UI.
        // Keep the entire pending entry (including frozen requests and usage)
        // before installing a verified prior projection in the current cache.
        await this.preserveCopies(stored.entry.confirmed); if (!this.live(epoch)) return false;
      }
      const confirmed = await this.verifiedHead(head, verifyRemoteHead ? undefined : stored?.entry.confirmed); if (!this.live(epoch)) return false;
      if (stored && this.options.entryStore && stored.entry.confirmed.snapshot.uncompressedSha256 !== confirmed.snapshot.uncompressedSha256 &&
        !copyDescendsFrom(confirmed, stored.entry.confirmed)) {
        // A foreground check must not make an older/divergent clean cached
        // projection unreachable before the automatic resolver can rank it.
        await this.preserveCopies(confirmed); if (!this.live(epoch)) return false;
      }
      if (this.retainedWriter && !this.acquisition && this.retainedWriter.writerGeneration !== head.writerGeneration) {
        // With no pending branch, a cold open has just verified the latest
        // account copy. An old released/fenced token is not a local conflict.
        this.retainedWriter = null; this.writerFromStorage = false;
      }
      await this.queue(async () => { if (this.live(epoch)) await this.persist({ schemaVersion: 1, scope: this.scope, confirmed, recovery: null }); });
      if (!this.live(epoch)) return false;
      this.phase = "readonly"; this.failure = confirmed.priorRecovery ? "prior-recovery" : null; this.emit(); return true;
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
  }
  startWriter(takeover = false): Promise<boolean> { return this.boundedCheck(epoch => this.startWriterChecked(takeover, epoch)); }
  private async startWriterChecked(takeover: boolean, epoch: number): Promise<boolean> {
    if (!this.enabled || this.stopped || !this.record || this.offlineBase || this.record.entry.confirmed.priorRecovery || this.recovery() || this.checking) return false;
    this.checkTime();
    if (this.window && this.remaining(this.window.until) > 0 && this.phase === "ready") return true;
    this.checking = true; this.resumeAuthorized = false;
    try {
      await this.admitted(); if (!this.live(epoch)) return false;
      const head = await this.options.transport.head(this.scope.campaignId); if (!this.live(epoch)) return false;
      if (head.revision !== this.record.entry.confirmed.revision) throw new CloudSyncError("revision");
      // The confirmed state was verified by open; acquire compares that exact revision.
      const sent = this.now(), lease = await this.acquire(head, takeover, epoch);
      if (!this.live(epoch)) return false;
      if (lease.revision !== this.record.entry.confirmed.revision) throw new CloudSyncError("revision");
      this.installLease(lease, sent); await this.rememberWriter(epoch); if (!this.live(epoch)) return false;
      this.writerElsewhere = false; this.grace = null; this.phase = "ready"; this.failure = null; this.emit(); return true;
    } catch (error) { await this.failChecked(error, epoch); return false; }
    finally { if (this.live(epoch)) this.checking = false; }
  }
  /** Grant commands after a successful check; the gameplay pause setting is independent. */
  resume(): boolean {
    this.checkTime();
    if (this.closingRequested || this.phase !== "ready" || !this.window || !this.localDurable || this.remaining(this.window.until) <= 0) return false;
    this.resumeAuthorized = true; this.emit(); return true;
  }
  pause(): void { this.resumeAuthorized = false; this.emit(); }
  /** Verified device play during a network outage has no server lease, cannot
   * freeze/commit an operation, and must pass full selection/CAS on reconnect. */
  async restoreVerifiedOffline(copy: CloudConfirmed, usageQuestions: CloudCandidate["usageQuestions"] = []): Promise<boolean> {
    try {
      if (this.stopped || copy.priorRecovery || !this.options.entryStore) return false;
      if ((await this.options.entryStore.read<{ failure: string | null }>(`command-block:${this.scope.campaignId}`))?.failure ||
        await this.options.entryStore.read("deletion-requested") || await this.options.entryStore.read("account-command-block")) return false;
      this.record = await this.options.cache.read(this.scope);
      await this.verify(copy);
      if (this.record) await this.preserveCopies(copy);
      const loaded = await this.codec.run({ kind: "verify", input: { ...copy, expectedRevision: copy.revision,
        expectedCampaignId: this.scope.campaignId, expectedBaselineId: copy.baselineId } });
      await this.options.entryStore.write(`offline-base:${this.scope.campaignId}`, { snapshotSha256: copy.snapshot.uncompressedSha256 });
      await this.persist({ schemaVersion: 1, scope: this.scope, confirmed: copy, recovery: usageQuestions.length ? {
        baseRevision: copy.revision, writerGeneration: "0", inFlight: null, following: { campaign: loaded.campaign, snapshot: copy.snapshot,
          evidence: { headerSha256: copy.evidence.header.uncompressedSha256, fromRecord: copy.evidence.records.length,
            toRecord: copy.evidence.records.length, records: [] }, usageQuestions } } : null });
      this.window = null; this.suspendedLease = null; this.offlineLocal = true;
      this.offlineBase = true;
      this.autoReconnect = false; this.grace = null; this.phase = "waiting"; this.failure = "network"; this.resumeAuthorized = true;
      this.emit(); return true;
    } catch (error) { this.fail(error); return false; }
  }
  /** Called before a gameplay projection is mounted. The automatic resolver has
   * verified/ranked every copy and protected the originals. Acquire is still a
   * revision+generation CAS; no automatic decision can overwrite a racing head. */
  adoptAutomaticCopy(account: CloudConfirmed, chosen: CloudConfirmed, usageQuestions: CloudCandidate["usageQuestions"] = []): Promise<boolean> {
    return this.boundedCheck(async epoch => {
      this.pause();
      try {
        await this.localQueue; await this.admitted();
        if (!this.live(epoch) || !this.record || !copyDescendsFrom(chosen, account)) throw new CloudSyncError("revision");
        await this.verify(account); await this.verify(chosen);
        const head = await this.options.transport.head(this.scope.campaignId);
        if (!this.live(epoch) || head.revision !== account.revision) throw new CloudSyncError("revision");
        // A normal clean account open replaces no local branch or uncertain
        // operation. Preserve whole recovery bytes only when replacing them.
        if (this.recovery()) await this.preserveCopies(account);
        const loaded = await this.codec.run({ kind: "verify", input: { ...chosen, expectedRevision: chosen.revision,
          expectedCampaignId: this.scope.campaignId, expectedBaselineId: chosen.baselineId } });
        const candidate: CloudCandidate = { campaign: loaded.campaign, snapshot: chosen.snapshot,
          evidence: { headerSha256: account.evidence.header.uncompressedSha256, fromRecord: account.evidence.records.length,
            toRecord: chosen.evidence.records.length, records: chosen.evidence.records.slice(account.evidence.records.length) }, usageQuestions };
        await this.codec.run({ kind: "candidate", input: { candidate, confirmed: account, scope: this.scope } });
        const sent = this.now(), lease = await this.acquire(head, head.writerActive, epoch);
        if (!this.live(epoch)) return false;
        this.installLease(lease, sent); await this.rememberWriter(epoch);
        this.offlineLocal = false;
        const changed = chosen.snapshot.uncompressedSha256 !== account.snapshot.uncompressedSha256 || candidate.evidence.records.length > 0;
        await this.persist({ schemaVersion: 1, scope: this.scope, confirmed: account, recovery: changed ? {
          baseRevision: account.revision, writerGeneration: lease.writerGeneration, inFlight: null, following: candidate } : null });
        if (this.offlineBase) await this.options.entryStore?.write(`offline-base:${this.scope.campaignId}`, null);
        this.offlineBase = false;
        if (!this.live(epoch)) return false;
        this.writerElsewhere = false; this.conflictCopies = undefined; this.grace = null;
        this.autoReconnect = true; this.phase = "ready"; this.failure = null; this.resumeAuthorized = true;
        if (changed) this.dirtySince = this.now();
        this.emit(); return true;
      } catch (error) { await this.failChecked(error, epoch); return false; }
    });
  }
  requireSessionReload(): void {
    this.resumeAuthorized = false; this.window = null; this.suspendedLease = null; this.phase = "paused"; this.failure = "account-save-changed"; this.emit();
  }

  /** retainAccepted only finishes commands already accepted by CloudGameSession.
   * It preserves bytes across suspension; it never grants new commands or lease time. */
  stage(candidate: CloudCandidate, _reason: CloudCheckpointReason = "ordinary", retainAccepted = false): Promise<boolean> {
    this.checkTime();
    const writer = this.window?.lease ?? this.suspendedLease ?? this.retainedWriter ?? (this.offlineLocal ? { writerGeneration: this.recovery()?.writerGeneration ?? "0" } : null);
    if (this.stopped || !this.record || !writer || !this.allowed() && !retainAccepted) return Promise.resolve(false);
    const epoch = this.epoch;
    let frozen = clone(candidate);
    this.emit();
    return this.queue(async () => {
      // A bounded reconnect can invalidate checks while an already accepted
      // command waits behind an upload. Finish its recovery write; this grants
      // no commands or lease, and disposal still fences every queued writer.
      if (this.stopped || !this.record || !this.live(epoch) && !retainAccepted) return false;
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
        writerGeneration: prior?.writerGeneration ?? writer.writerGeneration,
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
        const receipt = await cloudCheckDeadline(this.options.transport.commit(operation));
        if (!this.live(epoch)) return false;
        await this.acknowledge(operation, receipt);
        if (!this.live(epoch)) return false;
        // A late acknowledgment never grants a new lease or resumes a paused game.
        if (this.phase === "saving") this.phase = "ready";
        this.checkTime(); this.emit(); return true;
      } catch (error) { await this.failChecked(error, epoch); return false; }
      finally { this.uploading = null; }
    })();
    return this.uploading;
  }

  /** Fresh admission/head plus identical-operation lookup precede ANY retry/reacquire. */
  retry(resumeWhenChecked = false): Promise<boolean> { return this.boundedCheck(epoch => this.retryChecked(resumeWhenChecked, epoch)); }
  private async retryChecked(resumeWhenChecked: boolean, epoch: number): Promise<boolean> {
    if (!this.enabled || this.stopped || this.checking || this.uploading || this.offlineBase) return false;
    this.checking = true; this.resumeAuthorized = false;
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
      const recoveredWriter = pending?.inFlight ? this.request(pending.inFlight) : this.suspendedLease ?? this.retainedWriter;
      const head = await this.options.transport.head(this.scope.campaignId); if (!this.live(epoch)) return false;
      this.lastHead = this.now();
      if (pending?.inFlight) {
        const operation = pending.inFlight, outcome = await this.options.transport.operation(this.scope.campaignId, operation.operationId, operation);
        if (!this.live(epoch)) return false;
        if (outcome.status === "expired") throw new CloudSyncError("operation-expired");
        if (outcome.status === "committed") await this.acknowledge(operation, outcome.receipt);
        else if (head.revision !== pending.baseRevision) throw new CloudSyncError("revision");
        pending = this.recovery();
      }
      if (head.revision !== this.record.entry.confirmed.revision) {
        throw new CloudSyncError("revision");
      }
      // A killed acquisition can have succeeded before its response was stored.
      // The existing RPC accepts its exact token idempotently; a different
      // generation is fenced. Never generate a takeover token for this lookup.
      let recoveredAcquisition = false;
      if (this.acquisition && head.writerActive &&
        this.acquisition.expectedRevision === head.revision) {
        const sent = this.now(), lease = await this.options.transport.acquire(this.acquisition);
        if (!this.live(epoch)) return false;
        this.installLease(lease, sent); recoveredAcquisition = true;
      } else if (this.acquisition && head.writerActive &&
        (BigInt(this.acquisition.expectedWriterGeneration!) === BigInt(head.writerGeneration) ||
          BigInt(this.acquisition.expectedWriterGeneration!) + 1n === BigInt(head.writerGeneration))) {
        // The lease receipt journal may have failed while this same token later
        // confirmed a checkpoint. Renew proves the token against the fresh head;
        // never mutate/replay the original immutable acquisition request.
        const sent = this.now(), lease = await this.options.transport.renew({ campaignId: this.scope.campaignId,
          writerToken: this.acquisition.writerToken, writerGeneration: head.writerGeneration });
        if (!this.live(epoch)) return false;
        this.installLease(lease, sent); recoveredAcquisition = true;
      }
      if (pending && head.writerGeneration !== pending.writerGeneration && !recoveredAcquisition) throw new CloudSyncError("writer");
      if (!pending && recoveredWriter && head.writerGeneration !== recoveredWriter.writerGeneration && !recoveredAcquisition) throw new CloudSyncError("writer");
      const currentWindow = this.window;
      let rebind = recoveredAcquisition;
      if (currentWindow && this.remaining(currentWindow.until) > 0 && head.writerGeneration === currentWindow.lease.writerGeneration) {
        const sent = this.now(), renewed = await this.options.transport.renew(currentWindow.lease);
        if (!this.live(epoch)) return false;
        this.installLease(renewed, sent);
        // A missing in-flight outcome uses the SAME immutable request while this lease is valid.
      } else if (recoveredWriter && head.writerActive && head.writerGeneration === recoveredWriter.writerGeneration) {
        const sent = this.now(), renewed = await this.options.transport.renew(recoveredWriter);
        if (!this.live(epoch)) return false;
        this.installLease(renewed, sent);
      } else {
        // Only a proven missing operation and an unchanged revision/generation may be rebound.
        // A revoked/taken-over writer is never silently reacquired.
        if (currentWindow && head.writerGeneration !== currentWindow.lease.writerGeneration) throw new CloudSyncError("writer");
        if (head.writerActive) {
          this.writerElsewhere = true;
          // A cached account projection is not ownership proof. With no local
          // branch to recover, ask immediately instead of waiting out a lease.
          this.phase = pending ? "waiting" : "readonly";
          this.failure = pending ? "lease-check" : "writer-elsewhere";
          this.emit(); return false;
        }
        const sent = this.now(), lease = await this.acquire(head, false, epoch);
        if (!this.live(epoch)) return false;
        this.installLease(lease, sent); rebind = true;
      }
      if (this.writerFromStorage && head.writerActive) {
        // Even a retained acquisition intent can belong to an old document
        // whose receipt write failed. Rotate every proven live prior lease.
        const owned = this.window!.lease, sent = this.now();
        const lease = await this.acquire({ revision: head.revision, writerGeneration: owned.writerGeneration }, true, epoch);
        if (!this.live(epoch)) return false;
        this.installLease(lease, sent); rebind = true;
      }
      if (rebind) await this.queue(async () => {
        const latest = this.recovery();
        if (latest && this.record) {
          const flight = latest.inFlight ? this.request(latest.inFlight) : null;
          await this.persist({ ...this.record.entry, recovery: { baseRevision: head.revision, writerGeneration: this.window!.lease.writerGeneration,
            inFlight: null, following: latest.following ?? flight } });
        }
      });
      const candidate = this.pendingCandidate;
      if (candidate) await this.codec.run({ kind: "candidate", input: { candidate, confirmed: this.record.entry.confirmed, scope: this.scope } });
      await this.rememberWriter(epoch); if (!this.live(epoch)) return false;
      this.writerElsewhere = false; this.conflictCopies = undefined; this.grace = null; this.phase = "ready"; this.failure = null; this.emit();
      if (resumeWhenChecked && !this.resume()) return false;
      if (this.recovery() && !await this.checkpoint()) return false;
      return true;
    } catch (error) { await this.failChecked(error, epoch); return false; }
    finally { if (this.live(epoch)) this.checking = false; }
  }
  focus(): Promise<boolean> {
    if (this.reconnecting) return this.reconnecting;
    if (!this.enabled || this.stopped || this.closingRequested || this.phase === "closed") return Promise.resolve(false);
    if (this.offlineBase && !this.localDurable) {
      this.reconnecting = (async () => {
        // Repair an accepted offline checkpoint before asking the resolver to
        // rebase it. offlineBase must continue to deny all server writes.
        const copy = this.deviceCopy(), usage = this.pendingCandidate?.usageQuestions ?? [];
        if (copy) await this.restoreVerifiedOffline(copy, usage);
        return false;
      })().finally(() => { this.reconnecting = null; });
      return this.reconnecting;
    }
    if (this.offlineLocal) return Promise.resolve(false);
    this.autoReconnect = true; this.lastReconnect = this.now();
    this.reconnecting = this.boundedCheck(async epoch => {
      this.resumeAuthorized = false; this.emit();
      if (this.prepareLocalRecovery && !await this.prepareLocalRecovery()) return false;
      if (!this.live(epoch)) return false;
      if (this.uploading) await this.uploading;
      if (!this.live(epoch)) return false;
      // retry checks admission, the account head, immutable operation outcomes
      // and lease ownership before it permits any new commands.
      if (!this.record && !await this.open()) return false;
      return await this.retry(true) && this.resume();
    }).finally(() => { this.reconnecting = null; });
    return this.reconnecting;
  }
  reportLocalFailure(error: unknown): void {
    this.fail(error instanceof CloudSyncError ? error : new CloudSyncError(isCloudCodecProcessingError(error) ? "processing" : "corrupt"));
  }
  async pulse(): Promise<void> {
    if (!this.enabled || this.stopped) return;
    if (this.offlineLocal) {
      if (!this.automaticSelection || this.checking || this.elapsed(this.lastReconnect) < Math.max(CLOUD_RENEW_MS, this.retryAfterMs)) return;
      this.lastReconnect = this.now(); this.checking = true;
      const epoch = this.epoch;
      try {
        // Probe without pausing verified local play. A restored connection must
        // use full selection, never the local checkpoint as a server write base.
        await cloudCheckDeadline(this.admitted(), CLOUD_READ_TIMEOUT_MS);
        if (this.live(epoch)) await this.automaticSelection?.();
      } catch (error) {
        if (!this.live(epoch)) return;
        if (error instanceof CloudSyncError && ["network", "throttled"].includes(error.code)) this.retryAfterMs = error.retryAfterMs;
        else this.fail(error);
      } finally { if (this.live(epoch)) this.checking = false; }
      return;
    }
    this.checkTime(); this.emit();
    if (this.autoReconnect && !this.closingRequested && !this.allowed() &&
      ["clock", "lease-expired", "lease-check", "network", "throttled", "storage", "processing"].includes(this.failure ?? "") &&
      this.elapsed(this.lastReconnect) >= Math.max(CLOUD_RENEW_MS, this.retryAfterMs)) { await this.focus(); return; }
    if (this.checking || this.renewing || this.grace || !this.localDurable) return;
    const epoch = this.epoch;
    if (this.window && ["ready", "saving"].includes(this.phase) && this.elapsed(this.lastRenew) >= CLOUD_RENEW_MS) {
      this.renewing = true;
      const previous = this.window, sent = this.now();
      try {
        const lease = await cloudCheckDeadline(this.options.transport.renew(previous.lease));
        if (!this.live(epoch)) return;
        if (lease.writerGeneration !== previous.lease.writerGeneration) throw new CloudSyncError("writer");
        this.checkTime();
        if (this.phase === "paused" || this.phase === "conflict") return;
        this.installLease(lease, sent);
      } catch (error) {
        if (error instanceof CloudSyncError && error.code === "revision" && this.live(epoch)) {
          // A hide checkpoint can advance the head while a renewal is queued.
          // Resolve our upload before treating that revision as another device.
          this.resumeAuthorized = false; this.phase = "checking"; this.emit();
          try {
            if (this.uploading) await cloudCheckDeadline(this.uploading);
            if (this.live(epoch)) await this.focus();
          } catch (failure) { if (this.live(epoch)) this.fail(failure); }
        } else await this.failChecked(error, epoch);
      }
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
        await cloudCheckDeadline(this.options.transport.release(lease)); if (!this.live(epoch)) return false;
        this.window = null; this.phase = "closed"; this.emit(); return true;
      } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
    })().finally(() => { this.closing = null; this.closingRequested = false; if (!this.stopped) this.emit(); });
    return this.closing;
  }
  exportRecovery(): string | null {
    const entry = this.attempted ?? this.record?.entry;
    return entry?.recovery ? JSON.stringify(entry) : null;
  }
  private async preserveCopies(account: CloudConfirmed): Promise<void> {
    return this.preserveEntry(this.attempted ?? this.record!.entry, account);
  }
  private async preserveEntry(device: CloudCacheEntry, account: CloudConfirmed): Promise<void> {
    if (!this.options.entryStore) throw new CloudSyncError("storage");
    const value = { scope: this.scope, device, account };
    const key = `conflict:${this.scope.campaignId}:${await this.codec.run({ kind: "hash", input: JSON.stringify(value) })}`;
    await this.options.entryStore.create(key, value);
    if (!same(await this.options.entryStore.read(key), value)) throw new CloudSyncError("storage");
  }
  /** Explicit choice only. No evidence is renumbered, merged, dropped or replayed. */
  async keepDeviceProgress(): Promise<boolean> {
    this.pause();
    if (this.stopped || this.uploading || this.checking) return false;
    this.checking = true; const epoch = this.epoch;
    try {
      if (this.prepareLocalRecovery && !await this.prepareLocalRecovery()) return false;
      await this.localQueue;
      await this.admitted();
      const head = await this.options.transport.head(this.scope.campaignId), device = this.deviceCopy();
      const reviewedRevision = this.conflictCopies?.accountRevision ?? this.record?.entry.confirmed.revision;
      if (head.revision !== reviewedRevision) throw new CloudSyncError("revision");
      const account = await this.verifiedHead(head);
      if (!this.live(epoch) || !device || !this.record) return false;
      if (!this.follows(device, account)) { await this.compareCopies(epoch); this.phase = "conflict"; this.failure = "divergent-history"; this.emit(); return false; }
      const verified = await this.codec.run({ kind: "verify", input: { ...device, expectedRevision: device.revision,
        expectedCampaignId: this.scope.campaignId, expectedBaselineId: device.baselineId } });
      const candidate: CloudCandidate = { campaign: verified.campaign, snapshot: device.snapshot,
        evidence: { headerSha256: account.evidence.header.uncompressedSha256, fromRecord: account.evidence.records.length,
          toRecord: device.evidence.records.length, records: device.evidence.records.slice(account.evidence.records.length) },
        usageQuestions: this.pendingCandidate?.usageQuestions ?? [] };
      await this.codec.run({ kind: "candidate", input: { candidate, confirmed: account, scope: this.scope } });
      await this.preserveCopies(account); if (!this.live(epoch)) return false;
      const sent = this.now(), lease = await this.acquire(head, head.writerActive, epoch);
      if (!this.live(epoch)) return false;
      this.installLease(lease, sent); await this.rememberWriter(epoch); if (!this.live(epoch)) return false;
      await this.persist({ schemaVersion: 1, scope: this.scope, confirmed: account,
        recovery: { baseRevision: account.revision, writerGeneration: lease.writerGeneration, inFlight: null, following: candidate } });
      // A newly hydrated projection must own the chosen candidate and its base.
      // Opening it automatically reconnects and uploads; the old projection is fenced.
      this.requireSessionReload(); return true;
    } catch (error) { await this.failChecked(error, epoch); return false; }
    finally { this.checking = false; }
  }
  /** Explicitly enroll a divergent branch in a free account slot. The existing
   * account campaign and its active writer are never mutated by this import. */
  async keepBothProgress(): Promise<string | null> {
    this.pause();
    if (this.stopped || this.uploading || this.checking || !this.options.entryStore) return null;
    this.checking = true; const epoch = this.epoch;
    try {
      if (this.prepareLocalRecovery && !await this.prepareLocalRecovery()) return null;
      await this.localQueue; await this.admitted();
      const head = await this.options.transport.head(this.scope.campaignId), device = this.deviceCopy();
      if (head.revision !== this.conflictCopies?.accountRevision) throw new CloudSyncError("revision");
      const account = await this.verifiedHead(head);
      if (!this.live(epoch) || !device || !this.record) return null;
      await this.preserveCopies(account); if (!this.live(epoch)) return null;
      const imported = await importSeparateCloudCampaign(device, this.options.transport, this.options.entryStore);
      if (!this.live(epoch)) return null;
      // Only after the separate campaign is read back and verified may the old
      // cache stop reopening its pending branch. The protected originals stay.
      await this.persist({ schemaVersion: 1, scope: this.scope, confirmed: account, recovery: null });
      this.window = null; this.grace = null; this.conflictCopies = undefined;
      this.requireSessionReload(); return imported.marker.campaignId;
    } catch (error) {
      if (this.live(epoch) && error instanceof CloudSyncError && error.code === "capacity") {
        await this.compareCopies(epoch);
        if (this.conflictCopies?.canSaveSeparate === false) { this.phase = "conflict"; this.failure = "campaign-slots"; this.emit(); }
        else this.fail(error);
      } else await this.failChecked(error, epoch);
      return null;
    } finally { this.checking = false; }
  }
  async useAccountSave(keepRecoveryCopy: (bytes: string) => Promise<void>): Promise<boolean> {
    this.pause();
    if (this.stopped || this.uploading || this.checking) return false;
    this.checking = true; const epoch = this.epoch;
    try {
      if (this.prepareLocalRecovery && !await this.prepareLocalRecovery()) return false;
      await this.localQueue;
      const bytes = this.exportRecovery();
      if (bytes) { try { await keepRecoveryCopy(bytes); } catch { return false; } }
      if (!this.live(epoch)) return false;
      await this.admitted(); const confirmed = await this.verifiedHead(await this.options.transport.head(this.scope.campaignId));
      if (!this.live(epoch)) return false;
      const device = this.deviceCopy();
      if (device && bytes && this.options.entryStore) await this.preserveCopies(confirmed);
      if (!this.live(epoch)) return false;
      await this.persist({ schemaVersion: 1, scope: this.scope, confirmed, recovery: null });
      this.window = null; this.grace = null; this.conflictCopies = undefined;
      this.phase = "readonly"; this.failure = confirmed.priorRecovery ? "prior-recovery" : null; this.emit(); return true;
    } catch (error) { if (this.live(epoch)) this.fail(error); return false; }
    finally { this.checking = false; }
  }
  /** Sign-out, account/campaign switch and deletion revoke all later callbacks. No cache deletion. */
  dispose(reason: "switch" | "sign-out" | "revoked" | "deleted" = "switch"): void {
    this.stopped = true; this.epoch++; this.resumeAuthorized = false; this.window = null; this.suspendedLease = null;
    this.phase = reason === "revoked" || reason === "deleted" ? "blocked" : "closed"; this.failure = reason; this.emit();
  }
}
