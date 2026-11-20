import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { commandProgrammingFailure, encodeCommandFailure } from "./commandFailure";
import { GameEvidenceError } from "@gamify-surgery/game-domain";
import { assertCloudRevision, CLOUD_CAPACITY_LIMITS } from "./codec";
import { isStorageQuotaError, reclaimAuxiliaryStorage } from "../storagePressure";
import { isCloudCodecCapacityError, isCloudCodecProcessingError, utf8Bytes } from "./codecJson";
import { cloudCodec } from "./codecWorker";
import { cloudScopeData } from "./scopeData";
import { timeCloudEntry } from "./entryTimings";
import { isSnapshotCopy, SNAPSHOT_BASELINE, snapshotEvidence } from "./snapshotCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { cloudCheckDeadline, CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";
import type { CloudEntryStore } from "./entryStorage";
import { newWriterToken, readWriterIdentity, writeWriterIdentity, type WriterAcquisition } from "./writerIdentity";
import type { CloudConflictCopies } from "./progress";
import { importSeparateCloudCampaign, separateCloudCampaignId } from "./importCampaigns";
import { cloudCopyFamily, copyDescendsFrom } from "./copySelection";
import { snapshotConflictBackup } from "./retainedCopies";
import type { CloudCodecExecutor } from "./codecTasks";
import { CloudCacheError } from "./codecCache";
import { isTransientStorageError, storageDeadline } from "./storageRetry";
import { ACCOUNT_READ_REFRESH_MS, healthyLeaseRenewMs, MAX_HEALTHY_LEASE_MS, RequestBackoff, requestDocumentVisible, setAccountRequestsActive } from "../requestBudget";
import { networkRequestBudget } from "./networkRequestBudget";
import { prepareJournal } from "./journalCodec";
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
  /** Presentation only; authority continues to use allowed(). */
  checking?: boolean;
  pending: boolean;
  localDurable: boolean;
  storageQuota?: boolean;
  storageRetrying?: boolean;
  revision: string | null;
  confirmedAtMs: number | null;
  failure: string | null;
  priorRecovery?: { verifiedRevision: string; serverRevision: string };
  writerElsewhere?: boolean;
  conflictCopies?: CloudConflictCopies;
}
export type CloudCheckpointReason = "ordinary" | "hidden" | "pagehide" | "save-close" |
  "scored-answer" | "purchase" | "pause" | "mode-exit" | "campaign-switch" | "day-end";
/** Whole background job, including queued codec/cache work. Independent of
 * the unchanged 180 s opening / 150 s automatic-selection budgets. */
export const CLOUD_UPLOAD_TIMEOUT_MS = 180_000;
interface TimePair { wall: number; mono: number }
interface LeaseWindow { lease: CloudLease; until: TimePair }
interface ConfirmedSessionBase { campaignId: string; revision: string; snapshotSha256: string }
interface MountedJournalProof { owner: string; through: number; base: ConfirmedSessionBase; snapshotSha256: string }
const confirmedBase = (copy: CloudConfirmed): ConfirmedSessionBase => ({ campaignId: copy.campaignId,
  revision: copy.revision, snapshotSha256: copy.snapshot.uncompressedSha256 });
const matchesBase = (copy: CloudConfirmed, base: ConfirmedSessionBase | null): boolean => Boolean(base &&
  copy.campaignId === base.campaignId && copy.revision === base.revision && copy.snapshot.uncompressedSha256 === base.snapshotSha256);
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
  private readonly connectionListeners = new Set<() => void>();
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
  private foregrounding: Promise<boolean | null> | null = null;
  private foregroundVersion = 0;
  private backgroundedAt: TimePair | null = null;
  private lastForeground: TimePair | null = null;
  private wasOffline = false;
  private autoReconnect = false;
  private lastReconnect: TimePair;
  private retryAfterMs = 0;
  private readonly networkBackoff: RequestBackoff;
  private prepareLocalRecovery: (() => Promise<boolean>) | null = null;
  private phase: CloudSyncPhase;
  private failure: string | null = null;
  private epoch = 0;
  private stopped = false;
  private resumeAuthorized = false;
  private localDurable = true;
  private localCacheConflict = false;
  private storageQuota = false;
  private storageRetrying = false;
  private uploading: Promise<boolean> | null = null;
  private closing: Promise<boolean> | null = null;
  private closingRequested = false;
  private renewing = false;
  private checking = false;
  private localQueue: Promise<unknown> = Promise.resolve();
  private grace: TimePair | null = null;
  private lastSample: TimePair;
  private lastRenew: TimePair;
  private readonly unbindDiagnostics: () => void;
  private lastHead: TimePair;
  private dirtySince: TimePair | null = null;
  private coveredUsage = new Set<string>();
  private writerElsewhere = false;
  private conflictCopies: CloudConflictCopies | undefined;
  private offlineLocal = false;
  private selectionProbe: Promise<boolean> | null = null;
  private probedAccount: CloudConfirmed | null = null;
  private offlineReconnect: Promise<boolean | null> | null = null;
  private mountedOffline: Promise<boolean> | null = null;
  private unsubmittedLocalOperation = false;
  private selectingVerifiedAccount = false;
  private offlineBase = false;
  private automaticSelection: (() => Promise<boolean>) | null = null;
  private prepareCheckpoint: ((reason: CloudCheckpointReason) => Promise<boolean>) | null = null;
  private preparingCheckpoint: Promise<boolean> | null = null;
  private journalDirty = false;
  private lastAutomaticCheckpoint: TimePair | null = null;
  private openedJournalHighWater: number | null = null;
  private overCapacityJournal = false;
  private backupRetryAfter: TimePair | null = null;
  private journalOwner: string | null = null;
  // In-memory admission proof only; never infer mounted provenance from the
  // general compatibility predicate or add it to persisted snapshots.
  private mountedBase: ConfirmedSessionBase | null = null;
  private offlineOpeningBase: ConfirmedSessionBase | null = null;
  private snapshotSaves = false;
  private checkUploadHead = false;
  private preparationCapacity = false;
  private commandRepairs = 0;
  private connectionVersion = 0;
  get supportsSnapshots(): boolean { return this.snapshotSaves; }
  /** Presentation witness only. Local journal writes cannot advance it. */
  get verifiedConnectionVersion(): number { return this.connectionVersion; }

  constructor(private readonly options: {
    scope: CloudScope; transport: CloudTransport; cache: CloudCache; enabled?: boolean;
    clock?: CloudClock; newOperationId?: () => string; codec?: CloudCodecExecutor; entryStore?: CloudEntryStore;
  }) {
    this.scope = Object.freeze(cloudScopeData(options.scope, options.scope.campaignId));
    this.enabled = options.enabled ?? CLOUD_SAVES_ENABLED_BY_DEFAULT;
    this.phase = this.enabled ? "checking" : "off";
    this.clock = options.clock ?? { wallNow: () => Date.now(), monotonicNow: () => performance.now() };
    this.networkBackoff = networkRequestBudget(options.entryStore ?? options.transport, JSON.stringify([this.scope.backendId, this.scope.accountId]), this.clock.monotonicNow.bind(this.clock));
    this.retryAfterMs = this.networkBackoff.remaining();
    this.newId = options.newOperationId ?? (() => crypto.randomUUID());
    this.lastSample = this.now(); this.lastRenew = this.now(); this.lastHead = this.now();
    this.lastReconnect = this.now();
    this.unbindDiagnostics = problemDiagnostics.source("coordinator", () => {
      const view = this.view;
      return { saveFormat: this.record?.entry.confirmed.saveFormat ?? 2, snapshotBytes: this.record?.entry.confirmed.snapshot.compressedBytes ?? null,
        phase: view.phase, failure: view.failure, canExecute: view.canExecute, localDurable: view.localDurable, pending: view.pending,
        leaseExpiresAt: this.window?.until.wall ?? null, leaseRemainingMs: this.window ? this.remaining(this.window.until) : null,
        resumeAuthorized: this.resumeAuthorized, stopped: this.stopped, closing: this.closingRequested, checking: this.checking,
        uploading: Boolean(this.uploading), renewing: this.renewing, offlineLocal: this.offlineLocal,
        storageQuota: this.storageQuota, storageRetrying: this.storageRetrying };
    });
  }
  get codec(): CloudCodecExecutor { return this.options.codec ?? cloudCodec; }
  get journal() { return this.options.cache.journal; }
  get hasOverCapacityJournal(): boolean { return this.overCapacityJournal; }
  get playingVerifiedLocal(): boolean { return this.offlineLocal; }
  /** Only a verified replacement or an authority/integrity fence may ask the
   * mounted session's router to select again. Transient failures are not one. */
  get automaticReplacementKey(): string | null {
    const account = this.probedAccount, confirmed = this.record?.entry.confirmed;
    if (account && !matchesBase(account, this.mountedBase))
      return `head:${account.revision}:${account.snapshot.uncompressedSha256}`;
    return ["revision", "account-save-changed", "writer", "writer-elsewhere", "auth", "revoked", "deleted", "disabled", "protocol", "notice", "corrupt", "divergent-history"].includes(this.failure ?? "") ?
      `fence:${this.failure}:${confirmed?.revision}:${this.conflictCopies?.accountRevision ?? ""}` : null;
  }
  /** Admission alone cannot restore account saving. Verify the actual head
   * while local play stays mounted; its descendant recovers in place. Focus/
   * pageshow and the periodic retry share this single read-only probe. */
  probeAutomaticSelection(): Promise<boolean> {
    // pulse has already performed this read-only probe before reserving its
    // retry budget. Its session handoff must not probe a second time or be
    // refused by the very budget that handoff just reserved. No lease granted.
    if (this.selectingVerifiedAccount && !this.stopped && !this.closingRequested) return Promise.resolve(true);
    if (this.selectionProbe) return this.selectionProbe;
    if (!this.offlineLocal) return Promise.resolve(true);
    if (!this.networkBackoff.ready() || this.stopped || this.closingRequested) return Promise.resolve(false);
    const epoch = this.epoch;
    this.probedAccount = null;
    this.selectionProbe = (async () => {
      try {
        await cloudCheckDeadline(this.admitted(), CLOUD_READ_TIMEOUT_MS);
        const head = await cloudCheckDeadline(this.options.transport.head(this.scope.campaignId), CLOUD_READ_TIMEOUT_MS);
        const copy = await cloudCheckDeadline(this.options.transport.load(this.scope.campaignId, head.revision), CLOUD_READ_TIMEOUT_MS);
        if (copy.revision !== head.revision || copy.priorRecovery) throw new CloudSyncError("revision");
        await this.verify(copy, head);
        if (this.live(epoch) && !this.closingRequested) this.probedAccount = copy;
        return this.live(epoch) && !this.closingRequested;
      } catch (error) {
        if (this.live(epoch)) {
          if (error instanceof CloudSyncError && ["network", "throttled", "revision"].includes(error.code))
            this.retryAfterMs = this.networkBackoff.fail(error.retryAfterMs);
          else this.fail(error);
        }
        return false;
      }
    })().finally(() => { this.selectionProbe = null; });
    return this.selectionProbe;
  }
  /** A verified local descendant on the same account revision needs a lease,
   * not a new session. Different account heads still need ranked selection. */
  reconnectVerifiedLocal(): Promise<boolean | null> {
    if (this.offlineReconnect) return this.offlineReconnect;
    // Install the barrier before work/emission begins. Explicit exit/save
    // preparation must not stage a newer candidate that adoption then replaces.
    this.offlineReconnect = Promise.resolve().then(() => this.reconnectVerifiedLocalChecked())
      .finally(() => { this.offlineReconnect = null; });
    return this.offlineReconnect;
  }
  /** Restore only local admission after a failed mounted-session retry. The
   * verified journal/cache and any immutable request keep their exact bytes. */
  resumeMountedOffline(): Promise<boolean> {
    if (this.offlineLocal) return Promise.resolve(this.allowed());
    if (this.mountedOffline) return this.mountedOffline;
    const epoch = this.epoch, version = this.foregroundVersion, owner = this.journalOwner;
    const current = () => this.live(epoch) && version === this.foregroundVersion && !this.closingRequested;
    const eligible = () => current() && this.localDurable && !this.localCacheConflict &&
      ["network", "throttled"].includes(this.failure ?? "") && !this.hasPriorRecovery;
    if (!eligible() || !owner || !this.journal || !this.options.entryStore || !this.prepareLocalRecovery) return Promise.resolve(false);
    this.mountedOffline = this.boundedCheck(async () => {
      try {
        await this.localQueue;
        if (!await this.prepareLocalRecovery!() || !eligible()) return false;
        const store = this.options.entryStore!, journal = this.journal!;
        const gates = await Promise.all([store.read<{ failure: string | null }>(`command-block:${this.scope.campaignId}`),
          store.read("deletion-requested"), store.read("account-command-block")]);
        if (gates[0]?.failure || gates[1] || gates[2] || !eligible() || !this.record) return false;
        await this.verify(this.record.entry.confirmed);
        const local = await prepareJournal(journal, cloudCampaignStorageKey(this.scope), this.codec, { local: true, encode: false });
        const head = await journal.head(cloudCampaignStorageKey(this.scope));
        if (!local?.state || local.seed?.campaign.campaignId !== this.scope.campaignId || head?.owner !== owner || head.highWater !== local.through)
          throw new CloudCacheError("conflict");
        if (!eligible()) return false;
        await store.write(`offline-base:${this.scope.campaignId}`, { snapshotSha256: this.record.entry.confirmed.snapshot.uncompressedSha256 });
        if (!eligible() || this.journalOwner !== owner) return false;
        this.foregroundVersion++; // Fence late online checks, not local journal publication.
        this.window = null; this.suspendedLease = null; this.offlineBase = true; this.offlineLocal = true;
        this.unsubmittedLocalOperation = true;
        this.grace = null; this.phase = "waiting"; this.resumeAuthorized = true; this.emit();
        return true;
      } catch (error) {
        if (current()) this.reportLocalFailure(error instanceof CloudCacheError ? new CloudSyncError(
          ["checksum", "version"].includes(error.reason) ? "corrupt" : "storage") : error);
        return false;
      }
    }, current).finally(() => { this.mountedOffline = null; });
    return this.mountedOffline;
  }
  private async reconnectVerifiedLocalChecked(): Promise<boolean | null> {
    const account = this.probedAccount, confirmed = this.record?.entry.confirmed;
    if (!this.offlineLocal || !account || !confirmed || !matchesBase(account, this.mountedBase) ||
      this.recovery()?.inFlight && !this.unsubmittedLocalOperation || !this.journalOwner || !this.prepareLocalRecovery) return null;
    if (this.stopped || this.closingRequested || !this.localDurable) return false;
    const epoch = this.epoch, playable = this.allowed();
    try {
      // The journal, engine and local admission stay live. stage() waits behind
      // offlineReconnect; commands accepted while the lease is in flight retain
      // their own durable rows and the session prepares that newer prefix next.
      if (!await cloudCheckDeadline(this.prepareLocalRecovery()) || !this.live(epoch)) return false;
      await this.localQueue;
      const owner = this.journalOwner!, journal = this.journal;
      if (!journal) return null;
      // The existing codec verifies seed/row checksums, continuity and replay.
      // Use this owner's actual journal on the exact confirmed account base,
      // never an independently valid copy matched only by branch metadata.
      const local = await prepareJournal(journal, cloudCampaignStorageKey(this.scope), this.codec, { base: account });
      const localHead = await journal.head(cloudCampaignStorageKey(this.scope));
      if (!local?.base || !matchesBase(local.base, this.mountedBase)) return null;
      // Later commands may extend this same durable prefix during codec work.
      // They remain in the journal and get prepared after the lease handoff.
      if (localHead?.owner !== owner || localHead.highWater < local.through || this.journalOwner !== owner) throw new CloudCacheError("conflict");
      if (!this.live(epoch) || this.closingRequested || !matchesBase(account, this.mountedBase)) return false;
      const flight = this.recovery()?.inFlight;
      if (flight) {
        const outcome = await cloudCheckDeadline(this.options.transport.operation(this.scope.campaignId, flight.operationId, flight), CLOUD_READ_TIMEOUT_MS);
        if (!this.live(epoch) || this.closingRequested) return false;
        if (outcome.status === "expired") throw new CloudSyncError("operation-expired");
        if (outcome.status === "committed") {
          await this.acknowledge(flight, outcome.receipt);
          this.unsubmittedLocalOperation = false;
          return false; // The next bounded probe reads this newly acknowledged head.
        }
        if (this.recovery()?.baseRevision !== account.revision) throw new CloudSyncError("revision");
      }
      const pending = local.candidate;
      const chosen: CloudConfirmed = pending ? { ...account, snapshot: pending.snapshot,
        ...(pending.saveFormat === 3 ? { saveFormat: 3, baselineId: SNAPSHOT_BASELINE, lineage: pending.lineage,
          evidence: await snapshotEvidence() } : { evidence: { header: account.evidence.header,
          records: [...account.evidence.records, ...pending.evidence.records] } }) } : account;
      const checked = await this.adoptVerifiedCopy(account, chosen, pending?.usageQuestions ?? [], true, flight ?? undefined,
        { owner, through: local.through, base: confirmedBase(account), snapshotSha256: chosen.snapshot.uncompressedSha256 });
      if (checked) this.unsubmittedLocalOperation = false;
      if (!checked && this.live(epoch) && playable && this.offlineLocal && this.offlineBase && this.localDurable && !this.attempted &&
        ["network", "throttled"].includes(this.failure ?? "")) {
        // No base/cache publication occurred. Preserve verified local play;
        // an unavailable writer endpoint must not remount/hydrate it again.
        this.grace = null; this.phase = "waiting"; this.resumeAuthorized = true; this.emit();
      }
      return checked;
    } catch (error) {
      if (this.live(epoch)) this.reportLocalFailure(error instanceof CloudCacheError ? new CloudSyncError(
        ["checksum", "version"].includes(error.reason) ? "corrupt" : "storage") : error);
      return false;
    }
    finally { this.probedAccount = null; }
  }
  get journalWriterGeneration(): string { return (this.window?.lease ?? this.suspendedLease ?? this.retainedWriter)?.writerGeneration ?? this.recovery()?.writerGeneration ?? "0"; }
  bindJournalOwner(owner: string): void {
    this.journalOwner = owner;
    const seedBase = this.record ? confirmedBase(this.record.entry.confirmed) : null;
    this.mountedBase = this.offlineLocal ? this.offlineOpeningBase ?? seedBase : seedBase;
  }
  releaseJournalOwner(owner: string): void { if (this.journalOwner === owner) { this.journalOwner = null; this.mountedBase = null; } }
  usageAcknowledged(id: string): boolean { return this.coveredUsage.has(id); }
  /** Local command reconciliation owns no new lease authority. A later auth,
   * writer/revision, storage or clock failure is never undone by releasing it. */
  beginCommandRecovery(): () => void {
    this.commandRepairs++; this.emit();
    let released = false;
    return () => { if (!released) { released = true; this.commandRepairs--; this.emit(); } };
  }
  async journalChangedSinceOpen(): Promise<boolean> {
    return ((await this.journal?.head(cloudCampaignStorageKey(this.scope)))?.highWater ?? null) !== this.openedJournalHighWater;
  }
  noteLocalChange(dirty = true): void { this.journalDirty = dirty; if (dirty) this.dirtySince ??= this.now(); else if (!this.recovery()) this.dirtySince = null; }
  /** Hydration repairs may have been prepared against a head that changed during opening. */
  requireFreshUploadHead(): void { this.checkUploadHead = true; }
  confirmJournalDurability(): void {
    if (this.storageRetrying && !this.attempted && this.failure === "processing" && this.allowed()) { this.storageRetrying = false; this.failure = null; this.backupRetryAfter = null; this.emit(); }
    if (!this.localDurable && !this.attempted && !this.localCacheConflict) {
      this.localDurable = true; this.emit(); // Phase/lease/resume gates still require their checked recovery.
    }
  }
  reportPreparationFailure(error: unknown): void {
    this.checkTime();
    if ((isCloudCodecCapacityError(error) || error instanceof CloudSyncError && error.code === "capacity") &&
      this.journalOwner && this.allowed() && this.localDurable) {
      // Only the derived cloud checkpoint is too large. The real journal is
      // still durable; keep every existing lease/admission/storage fence.
      problemDiagnostics.error("checkpoint-capacity", error);
      this.preparationCapacity = true; this.backupRetryAfter = this.now(); this.emit(); return;
    }
    if ((!isCloudCodecProcessingError(error) && !isTransientStorageError(error)) || !this.allowed() || !this.localDurable) { this.reportLocalFailure(error); return; }
    problemDiagnostics.error("checkpoint-preparation", error);
    this.failure = "processing"; this.backupRetryAfter = this.now(); this.emit();
    // The committed journal remains recoverable. No lease/phase/permission is
    // extended; the tiny renewal and all existing authority gates still apply.
  }
  preparationRecovered(): void {
    if (this.attempted) return; // A prepared snapshot does not confirm a delayed immutable cache write.
    const capacity = this.preparationCapacity; this.preparationCapacity = false;
    this.backupRetryAfter = null;
    if (this.failure === "processing" && this.localDurable && this.allowed()) { this.failure = null; this.emit(); }
    else if (capacity) this.emit();
  }
  reportStorageRetry(error: unknown): void {
    this.storageRetrying = isTransientStorageError(error);
    if (this.storageRetrying) this.reportPreparationFailure(error);
    else this.reportLocalFailure(error);
  }
  beforeCheckpoint(prepare: (reason: CloudCheckpointReason) => Promise<boolean>): () => void {
    this.prepareCheckpoint = prepare;
    return () => { if (this.prepareCheckpoint === prepare) this.prepareCheckpoint = null; };
  }
  get confirmedRevision(): string | null { return this.record?.entry.confirmed.revision ?? null; }
  get hasPriorRecovery(): boolean { return Boolean(this.record?.entry.confirmed.priorRecovery); }
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
  private lastPublishedStatus: string | null = null;
  private statusSignature(): string { return `${this.phase}:${this.failure}:${this.allowed()}`; }
  private emit(): void {
    this.lastPublishedStatus = this.statusSignature();
    for (const listener of this.listeners) { try { listener(); } catch (error) { problemDiagnostics.error("cloud-observer", error); } }
  }
  private emitConnection(): void {
    this.connectionVersion++;
    for (const listener of this.connectionListeners) { try { listener(); } catch (error) { problemDiagnostics.error("cloud-connection-observer", error); } }
  }
  onConnectionVerified(listener: () => void): () => void {
    this.connectionListeners.add(listener); return () => { this.connectionListeners.delete(listener); };
  }
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
    const repair = this.commandRepairs > 0 && ["ready", "saving", "waiting"].includes(this.phase);
    // A genuine foreground authority fence gets its one bounded check cover.
    // Subsequent transient/outage retries stay inside the durable shell.
    const foregroundFence = this.foregrounding && ["clock", "lease-expired"].includes(this.failure ?? "");
    return { phase: repair ? "paused" : this.phase, canExecute: this.allowed(), checking: repair || Boolean(foregroundFence) || !this.mountedDurable && (Boolean(this.foregrounding || this.reconnecting) || this.phase === "checking"), pending: this.offlineBase || this.recovery() !== null || Boolean(this.record?.entry.recovery),
      localDurable: this.localDurable, revision: this.record?.entry.confirmed.revision ?? null,
      ...(this.storageQuota && this.failure === "storage" ? { storageQuota: true } : {}), ...(this.storageRetrying && this.failure === "processing" ? { storageRetrying: true } : {}),
      confirmedAtMs: this.record?.entry.confirmed.acceptedAtMs ?? null, failure: repair ? "processing" : this.failure ?? (this.preparationCapacity ? "capacity" : null),
      ...(this.record?.entry.confirmed.priorRecovery ? { priorRecovery: { verifiedRevision: this.record.entry.confirmed.revision,
        serverRevision: this.record.entry.confirmed.priorRecovery.serverRevision } } : {}), writerElsewhere: this.writerElsewhere,
      ...(this.conflictCopies ? { conflictCopies: clone(this.conflictCopies) } : {}) };
  }
  private allowed(): boolean {
    return this.enabled && !this.stopped && !this.closingRequested && !this.commandRepairs && this.resumeAuthorized && this.localDurable &&
      (this.offlineLocal || this.window !== null && this.remaining(this.window.until) > 0) &&
      ["ready", "saving", "waiting"].includes(this.phase) && (!this.grace || this.remaining(this.grace) > 0);
  }
  private get mountedDurable(): boolean { return Boolean(this.journalOwner && this.localDurable && this.prepareLocalRecovery); }
  private checkTime(): void {
    const now = this.now(), wall = now.wall - this.lastSample.wall, mono = now.mono - this.lastSample.mono;
    this.lastSample = now;
    // iOS may stop performance.now while suspended. Forward-only wall time
    // consumes the EARLIER deadline (remaining uses min), never extends it.
    // Revoke on rollback/unexplained monotonic leaps, not ordinary suspension.
    if (this.window && (wall < 0 || mono < 0 || mono - wall > 5_000)) {
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
    this.snapshotSaves = access.snapshotSaves === true;
    return access;
  }
  private fail(error: unknown, preserveLocalDurability = false): void {
    problemDiagnostics.error("coordinator", error);
    if (this.stopped) return;
    const code = error instanceof CloudSyncError ? error.code : isCloudCodecCapacityError(error) ? "capacity" : "network";
    this.storageQuota = isStorageQuotaError(error);
    if (code === "capacity" && this.journalOwner && this.allowed() && this.localDurable) {
      // Capacity can also be reported while freezing/uploading an already
      // journaled checkpoint. It does not invalidate those durable local rows
      // or grant authority beyond the current lease/admission fences.
      this.preparationCapacity = true; this.backupRetryAfter = this.now(); this.emit(); return;
    }
    if (isTransientStorageError(error) && this.allowed() && this.localDurable) {
      this.storageRetrying = true; this.failure = "processing"; this.backupRetryAfter = this.now(); this.emit(); return;
    }
    // Logical conflicts and storage/processing failures must not bypass the
    // automatic request budget simply because they are not network errors.
    this.retryAfterMs = this.networkBackoff.fail(error instanceof CloudSyncError ? error.retryAfterMs : 0);
    this.failure = code;
    if (code === "network" || code === "throttled") {
      const remaining = this.window ? Math.max(0, this.remaining(this.window.until)) : 0;
      // Verified offline play has no server lease/grace to extend. A failed
      // background write endpoint must not momentarily revoke local admission.
      if (this.offlineLocal && this.localDurable) this.grace = null;
      else if (!this.grace) { const now = this.now(), duration = Math.min(CLOUD_GRACE_MS, remaining);
        this.grace = { wall: now.wall + duration, mono: now.mono + duration }; }
      this.phase = "waiting";
      this.checkTime();
    } else {
      this.offlineLocal = false;
      this.resumeAuthorized = false;
      this.phase = code === "auth" ? "auth" : code === "writer" || code === "revision" ? "conflict" :
        code === "capacity" ? "capacity" : code === "storage" ? "storage" : "blocked";
      if (code === "storage" || code === "processing" && !preserveLocalDurability) this.localDurable = false;
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
  private async boundedCheck(work: (epoch: number) => Promise<boolean>, current: () => boolean = () => true): Promise<boolean> {
    const epoch = this.epoch;
    try {
      return await cloudCheckDeadline(work(epoch), undefined, () => {
        if (!this.live(epoch) || !current()) return;
        // A late read, codec reply or lease response cannot revive this check.
        // Retained operation/token proofs still resolve uncertain server writes.
        this.epoch++; this.checking = false; this.resumeAuthorized = false;
        this.fail(new CloudSyncError("network"));
      });
    } catch (error) { if (this.live(epoch) && current()) this.fail(error); return false; }
  }
  private async persist(entry: CloudCacheEntry): Promise<void> {
    const epoch = this.epoch;
    this.localCacheConflict = false;
    this.attempted = clone(entry);
    try {
      try {
        const stored = await storageDeadline(this.options.cache.write(entry, this.record?.cacheRevision ?? null));
        if (!this.live(epoch)) throw new CloudSyncError("auth");
        this.record = stored;
      }
      catch (error) {
        if (!this.live(epoch)) throw error;
        if (!isStorageQuotaError(error) && !isTransientStorageError(error)) throw error;
        if (isStorageQuotaError(error)) { this.localDurable = false; this.emit(); await reclaimAuxiliaryStorage(); }
        // Never overwrite another writer or repeat a successful lost response.
        const stored = await storageDeadline(this.options.cache.read(this.scope));
        if (!this.live(epoch)) throw new CloudSyncError("auth");
        if (stored && same(stored.entry, entry)) this.record = stored;
        else {
          if ((stored?.cacheRevision ?? null) !== (this.record?.cacheRevision ?? null)) throw error;
          const retried = await storageDeadline(this.options.cache.write(entry, this.record?.cacheRevision ?? null));
          if (!this.live(epoch)) throw new CloudSyncError("auth");
          this.record = retried;
        }
      }
      this.attempted = null; this.localDurable = true; this.storageQuota = false;
      if (this.storageRetrying && this.failure === "processing" && this.allowed()) {
        this.storageRetrying = false; this.failure = null; this.backupRetryAfter = null;
        // Do not emit here: an ACK must publish its bound revision to receipt
        // listeners before the ordinary session observer sees that revision.
      }
    } catch (error) {
      if (this.live(epoch)) {
        this.localDurable = isTransientStorageError(error) && this.journalOwner !== null;
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
      catch (error) { throw new CloudSyncError(isCloudCodecCapacityError(error) ? "capacity" : isCloudCodecProcessingError(error) ? "processing" : "corrupt"); }
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
    const duration = Math.min(MAX_HEALTHY_LEASE_MS, lease.expiresAtMs - lease.serverNowMs);
    if (!Number.isFinite(duration) || duration <= this.elapsed(sent) || lease.campaignId !== this.scope.campaignId || !lease.writerToken) {
      throw new CloudSyncError("writer");
    }
    this.window = { lease, until: { wall: sent.wall + duration, mono: sent.mono + duration } };
    this.retainedWriter = lease;
    this.suspendedLease = null;
    this.lastRenew = sent;
    this.networkBackoff.success(); this.retryAfterMs = 0;
    setAccountRequestsActive(this.scope.accountId, true);
  }
  private renewalCadence(): number {
    return healthyLeaseRenewMs(this.window ? this.window.until.mono - this.lastRenew.mono : CLOUD_LEASE_MS);
  }
  private isOwnRenewalRevision(revision: string, writerGeneration: string): boolean {
    if (revision === this.confirmedRevision) return true;
    const recovery = this.uploading ? this.recovery() : null;
    return Boolean(recovery?.inFlight && recovery.writerGeneration === writerGeneration &&
      BigInt(revision) === BigInt(recovery.baseRevision) + 1n);
  }
  /** Refresh the CAS base and prove the same token after an overlapping save. */
  private async renewAfterOwnSave(previous: CloudLease, current: () => boolean): Promise<{ lease: CloudLease; sent: TimePair } | null> {
    for (let attempt = 0; attempt < 2; attempt++) {
      const beforeRead = this.confirmedRevision;
      const head = await cloudCheckDeadline(this.options.transport.head(this.scope.campaignId));
      if (!current()) return null;
      if (head.writerGeneration !== previous.writerGeneration) throw new CloudSyncError("writer");
      const confirmed = this.confirmedRevision;
      // A verified receipt can overtake the metadata read while it is in flight.
      if (confirmed !== beforeRead && confirmed && BigInt(head.revision) < BigInt(confirmed)) continue;
      if (!this.isOwnRenewalRevision(head.revision, previous.writerGeneration)) throw new CloudSyncError("revision");
      const sent = this.now();
      let lease: CloudLease;
      try {
        lease = await cloudCheckDeadline(this.options.transport.renew(previous));
      } catch (error) {
        if (!current()) return null;
        if (!(error instanceof CloudSyncError && error.code === "revision" &&
            (this.uploading || confirmed !== this.confirmedRevision))) throw error;
        continue;
      }
      if (!current()) return null;
      if (lease.writerGeneration !== previous.writerGeneration) throw new CloudSyncError("writer");
      if (lease.revision !== head.revision && !this.isOwnRenewalRevision(lease.revision, lease.writerGeneration))
        throw new CloudSyncError("revision");
      return { lease, sent };
    }
    return null;
  }
  private async acquire(head: { revision: string; writerGeneration: string }, takeover: boolean, epoch: number,
    current: () => boolean = () => this.live(epoch)): Promise<CloudLease> {
    const acquisition: WriterAcquisition = { campaignId: this.scope.campaignId, expectedRevision: head.revision,
      expectedWriterGeneration: head.writerGeneration, operationId: this.newId(), writerToken: newWriterToken(), takeover };
    this.acquisition = acquisition;
    await writeWriterIdentity(this.options.entryStore, this.scope, this.retainedWriter, acquisition);
    if (!current()) throw new CloudSyncError("auth");
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
    return confirmed && pending ? { ...confirmed, ...(pending.saveFormat === 3 ? { saveFormat: 3 as const, lineage: pending.lineage, baselineId: SNAPSHOT_BASELINE } : {}), snapshot: pending.snapshot,
      evidence: pending.saveFormat === 3 ? { header: confirmed.evidence.header, records: [] } : { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } } : confirmed;
  }
  private follows(device: CloudConfirmed, account: CloudConfirmed): boolean {
    if (isSnapshotCopy(device)) return copyDescendsFrom(device, account);
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
  private async failChecked(error: unknown, epoch: number, previouslyPlayable = this.allowed()): Promise<void> {
    if (!this.live(epoch)) return;
    this.fail(error); // Fence immediately; preview work must never extend authority.
    if (error instanceof CloudSyncError && error.code === "revision" && previouslyPlayable && this.localDurable &&
      this.journalOwner && this.automaticSelection && this.options.entryStore && !this.hasPriorRecovery && !this.closingRequested) {
      // Preserve the live durable projection while all server writes are
      // disabled. Full automatic selection, not replay/rebase of the rejected
      // operation, owns recovery. A proven different writer still pauses here.
      try {
        if (this.prepareLocalRecovery && !await cloudCheckDeadline(this.prepareLocalRecovery())) return;
        let head;
        try { head = await cloudCheckDeadline(this.options.transport.head(this.scope.campaignId), Math.min(3_000, CLOUD_READ_TIMEOUT_MS)); }
        catch (failure) { if (!(failure instanceof CloudSyncError) || !["network", "throttled"].includes(failure.code)) throw failure; }
        if (!this.live(epoch)) return;
        const writer = this.window?.lease ?? this.retainedWriter;
        if (!writer || head && head.writerGeneration !== writer.writerGeneration) { this.fail(new CloudSyncError("writer")); return; }
        await this.options.entryStore.write(`offline-base:${this.scope.campaignId}`, { snapshotSha256: this.record!.entry.confirmed.snapshot.uncompressedSha256 });
        if (!this.live(epoch) || this.closingRequested) return;
        this.foregroundVersion++; // Cancel already-sent checks/renewals without cancelling accepted journal writes.
        this.window = null; this.suspendedLease = null; this.offlineLocal = true; this.offlineBase = true;
        // Retain the immutable request until exact operation lookup and fencing
        // prove that its raw bytes can be kept and superseded safely.
        this.unsubmittedLocalOperation = true;
        this.grace = null; this.phase = "waiting"; this.failure = head && head.revision !== this.confirmedRevision ? "revision" : "network"; this.resumeAuthorized = true;
        this.emit(); return;
      } catch (failure) {
        problemDiagnostics.error("conflict-local-recovery", failure);
        // No fresh ownership/durability proof: keep the fence and the original
        // conflict bytes. The bounded automatic resolver retries later.
        if (this.live(epoch) && failure instanceof CloudSyncError && ["auth", "revoked", "deleted", "writer"].includes(failure.code)) this.fail(failure);
      }
    }
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
  open(verifyRemoteHead = false, openingCopy?: CloudConfirmed): Promise<boolean> {
    return this.boundedCheck(epoch => this.openChecked(epoch, verifyRemoteHead, openingCopy));
  }
  private async openChecked(epoch: number, verifyRemoteHead: boolean, openingCopy?: CloudConfirmed): Promise<boolean> {
    if (!this.enabled || this.stopped) return false;
    this.phase = "checking"; this.resumeAuthorized = false; this.emit();
    try {
      await reclaimAuxiliaryStorage(undefined, true);
      await this.admitted(); if (!this.live(epoch)) return false;
      this.openedJournalHighWater = (await this.journal?.head(cloudCampaignStorageKey(this.scope)))?.highWater ?? null;
      const stored = await this.options.cache.read(this.scope); if (!this.live(epoch)) return false;
      this.overCapacityJournal = stored?.journalCapacity === true;
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
      // Reuse fetched bytes only behind the same fresh-head and full proof
      // checks as a cached copy. Prior-recovery/forced remote reads stay fresh.
      const fetched = openingCopy?.campaignId === this.scope.campaignId && !openingCopy.priorRecovery ? openingCopy : undefined;
      const cached = stored?.entry.confirmed;
      // Selection already downloaded the new head. An older cache must not
      // hide it and force a second download. verifiedHead still checks the
      // fresh revision and the complete proof/metadata before reusing bytes.
      const confirmed = await this.verifiedHead(head, verifyRemoteHead ? undefined : cached?.revision === head.revision ? cached : fetched ?? cached); if (!this.live(epoch)) return false;
      if (stored?.journalCapacity && await this.preserveCapacityJournal(confirmed)) this.overCapacityJournal = false;
      if (!this.live(epoch)) return false;
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
      this.writerElsewhere = false; this.grace = null; this.phase = "ready"; this.failure = null; this.emit(); this.emitConnection(); return true;
    } catch (error) { await this.failChecked(error, epoch); return false; }
    finally { if (this.live(epoch)) this.checking = false; }
  }
  /** Grant commands after a successful check; the gameplay pause setting is independent. */
  resume(): boolean {
    this.checkTime();
    if (this.closingRequested || this.phase !== "ready" || !this.window || !this.localDurable || this.remaining(this.window.until) <= 0) return false;
    this.resumeAuthorized = true; this.emit(); return true;
  }
  pause(): void { this.foregroundVersion++; this.resumeAuthorized = false; this.emit(); }
  /** Verified device play during a network outage has no server lease, cannot
   * freeze/commit an operation, and must pass full selection/CAS on reconnect. */
  async restoreVerifiedOffline(copy: CloudConfirmed, usageQuestions: CloudCandidate["usageQuestions"] = []): Promise<boolean> {
    try {
      if (this.stopped || copy.priorRecovery || !this.options.entryStore) return false;
      if ((await this.options.entryStore.read<{ failure: string | null }>(`command-block:${this.scope.campaignId}`))?.failure ||
        await this.options.entryStore.read("deletion-requested") || await this.options.entryStore.read("account-command-block")) return false;
      this.record = await this.options.cache.read(this.scope);
      await this.verify(copy);
      this.offlineOpeningBase = null;
      // An exact existing base needs no new provenance data or journal pass.
      // A later probe must still match this same revision AND content hash.
      if (this.record && matchesBase(copy, confirmedBase(this.record.entry.confirmed))) this.offlineOpeningBase = confirmedBase(copy);
      else if (this.journal) {
        // Remember the old journal's base only when its verified projection
        // actually produced this selected offline copy. Retained unrelated
        // snapshots must use full selection, not in-place adoption.
        const local = await prepareJournal(this.journal, cloudCampaignStorageKey(this.scope), this.codec, { allowCapacity: true });
        if (local?.base && !local.base.priorRecovery && local.base.campaignId === copy.campaignId && local.base.revision === copy.revision &&
          (local.candidate?.snapshot ?? local.base.snapshot).uncompressedSha256 === copy.snapshot.uncompressedSha256)
          this.offlineOpeningBase = confirmedBase(local.base);
      }
      if (this.record) await this.preserveCopies(copy);
      const loaded = await this.codec.run({ kind: "verify", input: { ...copy, expectedRevision: copy.revision,
        expectedCampaignId: this.scope.campaignId, expectedBaselineId: copy.baselineId } });
      await this.options.entryStore.write(`offline-base:${this.scope.campaignId}`, { snapshotSha256: copy.snapshot.uncompressedSha256 });
      await this.persist({ schemaVersion: 1, scope: this.scope, confirmed: copy, recovery: usageQuestions.length ? {
        baseRevision: copy.revision, writerGeneration: "0", inFlight: null, following: { ...(isSnapshotCopy(copy) ? { saveFormat: 3 as const, lineage: copy.lineage } : {}), campaign: loaded.campaign, snapshot: copy.snapshot,
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
    if (this.journalOwner) return Promise.resolve(false); // Cold selection cannot bypass a mounted owner's proof.
    return this.adoptVerifiedCopy(account, chosen, usageQuestions, false);
  }
  private adoptVerifiedCopy(account: CloudConfirmed, chosen: CloudConfirmed, usageQuestions: CloudCandidate["usageQuestions"], keepLocalPlaying: boolean,
    unsubmitted?: CloudFrozenOperation, proof?: MountedJournalProof): Promise<boolean> {
    return this.boundedCheck(async epoch => {
      if (!keepLocalPlaying) this.pause();
      const version = this.foregroundVersion;
      const mountedCurrent = () => !keepLocalPlaying || this.offlineLocal && version === this.foregroundVersion &&
        proof?.owner === this.journalOwner && matchesBase(account, this.mountedBase) &&
        (!this.failure || ["network", "throttled"].includes(this.failure));
      try {
        await this.localQueue; await this.admitted();
        if (!this.live(epoch) || !this.record) throw new CloudSyncError("revision");
        if (keepLocalPlaying) {
          if (!proof || !matchesBase(account, this.mountedBase) || !matchesBase(account, proof.base) ||
            proof.owner !== this.journalOwner || proof.snapshotSha256 !== chosen.snapshot.uncompressedSha256) throw new CloudSyncError("revision");
          const head = await this.journal?.head(cloudCampaignStorageKey(this.scope));
          if (head?.owner !== proof.owner || head.highWater < proof.through) throw new CloudSyncError("storage");
        } else if (!copyDescendsFrom(chosen, account)) throw new CloudSyncError("revision");
        await this.verify(account); await this.verify(chosen);
        const head = await this.options.transport.head(this.scope.campaignId);
        if (!this.live(epoch) || head.revision !== account.revision) throw new CloudSyncError("revision");
        // A normal clean account open replaces no local branch or uncertain
        // operation. Preserve whole recovery bytes only when replacing them.
        if (unsubmitted) {
          if (this.recovery()?.inFlight?.operationId !== unsubmitted.operationId) throw new CloudSyncError("storage");
          await this.preserveEntry(this.attempted ?? this.record.entry, account, true);
        } else if (this.recovery()) await this.preserveCopies(account);
        const displacedCapacityJournal = this.overCapacityJournal && chosen.snapshot.uncompressedSha256 === account.snapshot.uncompressedSha256 &&
          await this.preserveCapacityJournal(account);
        const loaded = await this.codec.run({ kind: "verify", input: { ...chosen, expectedRevision: chosen.revision,
          expectedCampaignId: this.scope.campaignId, expectedBaselineId: chosen.baselineId } });
        let candidate: CloudCandidate = { ...(isSnapshotCopy(chosen) ? { saveFormat: 3 as const, lineage: chosen.lineage } : {}), campaign: loaded.campaign, snapshot: chosen.snapshot,
          evidence: isSnapshotCopy(chosen) ? { headerSha256: chosen.evidence.header.uncompressedSha256, fromRecord: 0, toRecord: 0, records: [] } : { headerSha256: account.evidence.header.uncompressedSha256, fromRecord: account.evidence.records.length,
            toRecord: chosen.evidence.records.length, records: chosen.evidence.records.slice(account.evidence.records.length) }, usageQuestions };
        const replacesHead = chosen.snapshot.uncompressedSha256 !== account.snapshot.uncompressedSha256 || candidate.evidence.records.length > 0;
        // An unchanged, fully verified stored head is not a new upload. When
        // adopting different stored bytes, compact the owned native copy before
        // asking the unchanged wire-size gate to admit its new candidate.
        if (replacesHead || usageQuestions.length) {
          if (isSnapshotCopy(chosen) && (chosen.snapshot.uncompressedBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes ||
            chosen.snapshot.compressedBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes)) {
            candidate = { ...await this.codec.run({ kind: "snapshotUpgrade", input: { confirmed: chosen, candidate: null } }), usageQuestions };
          }
          if (!keepLocalPlaying) await this.codec.run({ kind: "candidate", input: { candidate, confirmed: account, scope: this.scope } });
        }
        const sent = this.now();
        let lease: CloudLease;
        if (keepLocalPlaying && head.writerActive) {
          // A mounted offline document must prove its OWN still-live token.
          // Never turn a background retry into a takeover of another device.
          const identity = await readWriterIdentity(this.options.entryStore, this.scope);
          const owned = this.retainedWriter ?? identity?.lease;
          const intent = this.acquisition ?? identity?.acquisition;
          if (intent && intent.expectedRevision === head.revision && intent.expectedWriterGeneration !== undefined &&
            (intent.expectedWriterGeneration === head.writerGeneration || BigInt(intent.expectedWriterGeneration) + 1n === BigInt(head.writerGeneration))) {
            // The preceding grant may have succeeded with its response lost.
            // Reuse the EXACT durable intent, then renew its token for a fresh
            // server-time lease proof (never re-date a cached grant receipt).
            const granted = await cloudCheckDeadline(this.options.transport.acquire(intent));
            if (granted.writerGeneration !== head.writerGeneration || granted.revision !== head.revision) throw new CloudSyncError("writer");
            lease = await cloudCheckDeadline(this.options.transport.renew(granted));
          } else {
            if (!owned || owned.writerGeneration !== head.writerGeneration) throw new CloudSyncError("writer");
            lease = await cloudCheckDeadline(this.options.transport.renew(owned));
          }
          if (lease.writerGeneration !== head.writerGeneration) throw new CloudSyncError("writer");
          if (lease.revision !== account.revision) throw new CloudSyncError("revision");
          if (unsubmitted && this.request(unsubmitted).writerGeneration === lease.writerGeneration) {
            // Rotate only OUR proved token so a late missing-request delivery
            // cannot race the newer projection. Revision/generation CAS remains.
            lease = await this.acquire(head, true, epoch);
          }
        } else lease = await this.acquire(head, !keepLocalPlaying && head.writerActive, epoch);
        if (!this.live(epoch)) return false;
        // Full copy integrity/domain verification already passed above. Finish
        // candidate-specific checks after the mounted lease barrier, before
        // installing authority or publishing any cache/base change.
        if (keepLocalPlaying && (replacesHead || usageQuestions.length))
          await this.codec.run({ kind: "candidate", input: { candidate, confirmed: account, scope: this.scope } });
        if (keepLocalPlaying) {
          const latest = await this.journal?.head(cloudCampaignStorageKey(this.scope));
          if (latest?.owner !== proof!.owner || latest.highWater < proof!.through) throw new CloudSyncError("storage");
        }
        if (!this.live(epoch) || this.closingRequested || !mountedCurrent()) return false;
        // A valid own-token reply can simply arrive too late. It grants no
        // authority, but is not proof of another writer. Keep local play and
        // reconcile the durable acquisition intent on the next bounded probe.
        if (keepLocalPlaying && lease.campaignId === this.scope.campaignId && lease.writerToken &&
          Math.min(MAX_HEALTHY_LEASE_MS, lease.expiresAtMs - lease.serverNowMs) <= this.elapsed(sent)) throw new CloudSyncError("network");
        this.installLease(lease, sent); await this.rememberWriter(epoch);
        if (!this.live(epoch) || this.closingRequested || !mountedCurrent()) return false;
        this.offlineLocal = false;
        const changed = candidate.snapshot.uncompressedSha256 !== account.snapshot.uncompressedSha256 || candidate.evidence.records.length > 0 || usageQuestions.length > 0;
        await this.persist({ schemaVersion: 1, scope: this.scope, confirmed: account, recovery: changed ? {
          baseRevision: account.revision, writerGeneration: lease.writerGeneration, inFlight: null, following: candidate } : null });
        if (this.offlineBase) await this.options.entryStore?.write(`offline-base:${this.scope.campaignId}`, null);
        this.offlineBase = false;
        // Capacity describes the old device journal, not the selected account
        // head. Its verified bytes were retained before any replacement.
        if (displacedCapacityJournal) this.overCapacityJournal = false;
        if (!this.live(epoch)) return false;
        this.writerElsewhere = false; this.conflictCopies = undefined; this.grace = null;
        this.autoReconnect = true; this.phase = "ready"; this.failure = null; this.resumeAuthorized = true;
        if (changed) this.dirtySince = this.now();
        this.emit(); this.emitConnection(); return true;
      } catch (error) { await this.failChecked(error, epoch); return false; }
    });
  }
  requireSessionReload(): void {
    this.resumeAuthorized = false; this.window = null; this.suspendedLease = null; this.phase = "paused"; this.failure = "account-save-changed"; this.emit();
  }

  /** A legacy immutable operation is reconciled before replacing its bytes.
   * The first native snapshot also carries a faithful prior-head snapshot for
   * the server's atomic evidence-to-snapshot conversion. */
  private upgradingSnapshots: Promise<boolean> | null = null;
  upgradeSnapshots(): Promise<boolean> {
    if (this.upgradingSnapshots) return this.upgradingSnapshots;
    const epoch = this.epoch;
    this.upgradingSnapshots = cloudCheckDeadline(this.upgradeSnapshotsChecked(), 150_000, () => {
      if (this.live(epoch)) { this.epoch++; this.fail(new CloudSyncError("processing")); }
    }).catch(() => false).finally(() => { this.upgradingSnapshots = null; });
    return this.upgradingSnapshots;
  }
  private async upgradeSnapshotsChecked(): Promise<boolean> {
    if (!this.snapshotSaves || this.hasPriorRecovery || !this.record) return true;
    if (!this.allowed()) return false;
    if (isSnapshotCopy(this.record.entry.confirmed) && (!this.pendingCandidate || this.pendingCandidate.saveFormat === 3)) return true;
    if (this.pendingCandidate?.saveFormat === 3 && this.pendingCandidate.legacyBaseSnapshot) return true;
    const epoch = this.epoch;
    try {
      await this.localQueue;
      const pending = this.recovery();
      if (pending?.inFlight) {
        const outcome = await this.options.transport.operation(this.scope.campaignId, pending.inFlight.operationId, pending.inFlight);
        if (!this.live(epoch)) return false;
        if (outcome.status === "committed") await this.acknowledge(pending.inFlight, outcome.receipt);
        else if (outcome.status === "expired") throw new CloudSyncError("operation-expired");
        else await this.preserveEntry(this.record.entry, this.record.entry.confirmed);
      }
      const candidate = await this.codec.run({ kind: "snapshotUpgrade", input: { confirmed: this.record.entry.confirmed, candidate: this.pendingCandidate } });
      if (!this.live(epoch)) return false;
      await this.codec.run({ kind: "candidate", input: { candidate, confirmed: this.record.entry.confirmed, scope: this.scope } });
      await this.queue(() => this.persist({ ...this.record!.entry, recovery: { baseRevision: this.record!.entry.confirmed.revision,
        writerGeneration: this.window!.lease.writerGeneration, inFlight: null, following: candidate } }));
      this.emit(); return true;
    } catch (error) { await this.failChecked(error, epoch); return false; }
  }

  /** retainAccepted only finishes commands already accepted by CloudGameSession.
   * It preserves bytes across suspension; it never grants new commands or lease time. */
  stage(candidate: CloudCandidate, _reason: CloudCheckpointReason = "ordinary", retainAccepted = false): Promise<boolean> {
    if (this.offlineReconnect) return this.offlineReconnect.then(() => this.stage(candidate, _reason, retainAccepted));
    this.checkTime();
    const retainedGeneration = this.recovery()?.writerGeneration;
    const writer = this.window?.lease ?? this.suspendedLease ?? this.retainedWriter ??
      (this.offlineLocal || retainAccepted && retainedGeneration !== undefined ? { writerGeneration: retainedGeneration ?? "0" } : null);
    if (this.stopped || !this.record || !writer || !this.allowed() && !retainAccepted) return Promise.resolve(false);
    const epoch = this.epoch;
    let frozen = clone(candidate);
    this.emit();
    return this.queue(async () => {
      // A bounded reconnect can invalidate checks while an already accepted
      // command waits behind an upload. Finish its recovery write; this grants
      // no commands or lease, and disposal still fences every queued writer.
      if (this.stopped || !this.record || !this.live(epoch) && !retainAccepted) return false;
      // A slow cache may leave an exact durable-write attempt while the small
      // journal remains playable. Finish it before replacing following bytes.
      if (this.attempted) await this.persist(clone(this.attempted));
      const prior = this.recovery();
      const accepted = this.record.entry.confirmed.evidence.records.length;
      if (frozen.saveFormat === 3 && isSnapshotCopy(this.record.entry.confirmed)) {
        const { legacyBaseSnapshot: _migration, ...current } = frozen;
        frozen = { ...current, usageQuestions: frozen.usageQuestions.filter(r => !this.coveredUsage.has(r.receipt_id)) };
        const base = this.record.entry.confirmed;
        if (!frozen.usageQuestions.length && frozen.snapshot.uncompressedSha256 === base.snapshot.uncompressedSha256 && !prior?.inFlight) {
          if (prior) await this.persist({ ...this.record.entry, recovery: null });
          return true;
        }
        if (!frozen.usageQuestions.length && frozen.lineage?.branchId === base.lineage?.branchId && frozen.lineage!.sequence < base.lineage!.sequence) return true;
      }
      if (frozen.saveFormat !== 3 && frozen.evidence.fromRecord < accepted) {
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
      // `frozen` is already private, and confirmed bytes are immutable. persist
      // takes the one durable-attempt copy; don't clone the full prefix twice.
      this.attempted = { ...this.record.entry, recovery };
      await this.codec.run({ kind: "candidate", input: { candidate: frozen, confirmed: this.record.entry.confirmed, scope: this.scope } });
      await this.persist({ ...this.record.entry, recovery });
      this.dirtySince ??= this.now();
      return true;
    }).catch(error => {
      if (this.live(epoch)) {
        if (commandProgrammingFailure(error, "journal", "coordinator")) this.reportLocalFailure(error);
        else this.fail(error);
      }
      return false;
    }).finally(() => { if (this.live(epoch)) this.emit(); });
  }
  private async freeze(): Promise<CloudFrozenOperation | null> {
    const epoch = this.epoch;
    return this.queue(async () => {
      if (!this.live(epoch) || !this.record || !this.window) return null;
      // Never send an immutable operation that only survived in memory after a
      // lost/slow local reply. Its exact cache bytes must be committed first.
      if (this.attempted) await this.persist(clone(this.attempted));
      const recovery = this.recovery();
      if (!this.live(epoch) || !this.record || !recovery || !this.window) return null;
      if (recovery.inFlight) return clone(recovery.inFlight);
      if (!recovery.following) return null;
      const request: CloudCommitRequest = { ...recovery.following, protocolVersion: 2, operationId: this.newId(),
        campaignId: this.scope.campaignId, expectedRevision: recovery.baseRevision,
        writerGeneration: recovery.writerGeneration, writerToken: this.window.lease.writerToken };
      const frozen = await this.codec.run({ kind: "freeze", input: request });
      if (!this.live(epoch)) return null;
      const operation: CloudFrozenOperation = { operationId: request.operationId, createdAtMs: this.clock.wallNow(),
        ...frozen };
      if (this.options.transport.prepare) operation.wireRequest = await timeCloudEntry("upload-wire", () => cloudCheckDeadline(this.options.transport.prepare!(request, operation.createdAtMs)));
      if (!this.live(epoch)) return null;
      if (operation.wireRequest && utf8Bytes(operation.wireRequest.text) > CLOUD_CAPACITY_LIMITS.transportBodyBytes) throw new CloudSyncError("capacity");
      await this.persist({ ...this.record.entry, recovery: { ...recovery, inFlight: operation, following: null } });
      return operation;
    });
  }
  private async acknowledge(operation: CloudFrozenOperation, receipt: CloudCommitReceipt): Promise<void> {
    const epoch = this.epoch;
    await this.queue(async () => {
      if (!this.live(epoch)) throw new CloudSyncError("auth");
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
      if (request.saveFormat === 3) Object.assign(confirmed, { saveFormat: 3, lineage: request.lineage, baselineId: SNAPSHOT_BASELINE, evidence: await snapshotEvidence() });
      await timeCloudEntry("upload-verify", () => this.verify(confirmed));
      if (!this.live(epoch)) throw new CloudSyncError("auth");
      let following = recovery.following;
      if (following?.saveFormat === 3) {
        const { legacyBaseSnapshot: _migration, ...latest } = following;
        following = { ...latest, usageQuestions: following.usageQuestions.filter(r => !receipt.usageReceiptIds.includes(r.receipt_id)) };
        if (following.snapshot.uncompressedSha256 === confirmed.snapshot.uncompressedSha256 && !following.usageQuestions.length) following = null;
      } else if (following) {
        const covered = receipt.evidenceHighWater - following.evidence.fromRecord;
        if (covered < 0 || covered > following.evidence.records.length ||
          following.evidence.records.slice(0, covered).some((row, index) => row.id !== request.evidence.records[index]?.id ||
            row.content.uncompressedSha256 !== request.evidence.records[index]?.content.uncompressedSha256 ||
            row.content.uncompressedBytes !== request.evidence.records[index]?.content.uncompressedBytes)) throw new CloudSyncError("corrupt");
        const coveredUsage = new Set(receipt.usageReceiptIds);
        following = { ...following, evidence: { ...following.evidence, fromRecord: receipt.evidenceHighWater,
          records: following.evidence.records.slice(covered) }, usageQuestions: following.usageQuestions.filter(r => !coveredUsage.has(r.receipt_id)) };
      }
      // Record validated usage acknowledgement before removing its immutable
      // in-flight request. A crash in either direction remains retry-safe.
      await this.options.cache.journal?.acknowledge(cloudCampaignStorageKey(this.scope), receipt.usageReceiptIds,
        this.journalOwner ? { owner: this.journalOwner, count: receipt.evidenceHighWater } : undefined);
      if (!this.live(epoch)) throw new CloudSyncError("auth");
      await this.persist({ ...this.record.entry, confirmed, recovery: following ? { baseRevision: receipt.revision,
        writerGeneration: recovery.writerGeneration, inFlight: null, following } : null });
      if (this.journalOwner) this.mountedBase = confirmedBase(confirmed); // Verified own ACK; memory only.
      this.coveredUsage = new Set(receipt.usageReceiptIds);
      this.checkUploadHead = false;
      for (const listener of this.receiptListeners) listener(receipt);
      // New commands can arrive throughout encoding/upload. Give that following
      // state its own quiet interval instead of uploading it on every pulse.
      this.dirtySince = following || this.journalDirty ? this.now() : null;
    });
  }
  checkpoint(reason: CloudCheckpointReason = "ordinary"): Promise<boolean> {
    if (this.preparingCheckpoint) return this.preparingCheckpoint;
    const automatic = ["ordinary", "hidden", "pagehide", "day-end"].includes(reason);
    if (automatic && (!this.networkBackoff.ready() || !["ready", "saving"].includes(this.phase))) return Promise.resolve(false);
    if (automatic && this.backupRetryAfter && this.elapsed(this.backupRetryAfter) < 60_000) return Promise.resolve(false);
    if (automatic && this.lastAutomaticCheckpoint && this.elapsed(this.lastAutomaticCheckpoint) < 60_000 &&
      this.localDurable && ["ready", "saving"].includes(this.phase) && !this.failure) return Promise.resolve(true);
    const prepare = this.prepareCheckpoint;
    if (!prepare) return this.uploadCheckpoint(automatic);
    this.preparingCheckpoint = (async () => {
      if (!await prepare(reason)) return false;
      return this.uploadCheckpoint(automatic);
    })().finally(() => { this.preparingCheckpoint = null; });
    return this.preparingCheckpoint;
  }
  private uploadCheckpoint(automatic: boolean): Promise<boolean> {
    if (this.uploading) return this.uploading;
    this.checkTime();
    if (!this.enabled || this.stopped || this.offlineBase || !this.localDurable || !this.window || this.remaining(this.window.until) <= 0 ||
      !["ready", "saving"].includes(this.phase)) return Promise.resolve(false);
    if (!this.recovery()) return Promise.resolve(true);
    const epoch = this.epoch;
    this.phase = "saving"; this.emit();
    const work = (async () => {
      try {
        if (this.checkUploadHead && !this.recovery()?.inFlight) {
          const head = await cloudCheckDeadline(this.options.transport.head(this.scope.campaignId));
          if (!this.live(epoch)) return false;
          if (head.revision !== this.confirmedRevision) throw new CloudSyncError("revision");
          if (head.writerGeneration !== this.window?.lease.writerGeneration) throw new CloudSyncError("writer");
        }
        const operation = await timeCloudEntry("upload-freeze", () => this.freeze());
        if (!operation || !this.live(epoch)) return false;
        const receipt = await timeCloudEntry("upload-commit", () => cloudCheckDeadline(this.options.transport.commit(operation)));
        if (!this.live(epoch)) return false;
        await timeCloudEntry("upload-ack", () => this.acknowledge(operation, receipt));
        if (automatic) this.lastAutomaticCheckpoint = this.now();
        if (!this.live(epoch)) return false;
        // A late acknowledgment never grants a new lease or resumes a paused game.
        if (this.phase === "saving") this.phase = "ready";
        if (this.phase === "ready" && ["network", "throttled"].includes(this.failure ?? "")) { this.failure = null; this.grace = null; }
        this.checkTime(); this.emit(); this.emitConnection(); return true;
      } catch (error) { await this.failChecked(error, epoch); return false; }
    })();
    this.uploading = cloudCheckDeadline(work, CLOUD_UPLOAD_TIMEOUT_MS, () => {
      if (!this.live(epoch)) return;
      // Cancel late continuations; never mint/replay a replacement operation.
      // Frozen/pending bytes remain for receipt reconciliation on Retry/reopen.
      this.epoch++; this.checking = false;
      this.fail(new CloudSyncError("processing"), this.localDurable && !this.attempted);
    }).catch(() => false).finally(() => { this.uploading = null; this.emit(); });
    return this.uploading;
  }

  /** Fresh admission/head plus identical-operation lookup precede ANY retry/reacquire. */
  retry(resumeWhenChecked = false): Promise<boolean> {
    const version = this.foregroundVersion;
    return this.boundedCheck(epoch => this.retryChecked(resumeWhenChecked, epoch),
      () => version === this.foregroundVersion && !this.closingRequested && this.phase !== "closed");
  }
  /** Opening needs authority and a verified durable projection, not a completed
   * backup. Reconcile an uncertain operation first; send pending work only after
   * the playing session has subscribed to its acknowledgement. */
  resumePendingForOpen(): Promise<boolean> { return this.boundedCheck(epoch => this.retryChecked(true, epoch, false)); }
  private async retryChecked(resumeWhenChecked: boolean, epoch: number, uploadPending = true): Promise<boolean> {
    if (!this.enabled || this.stopped || this.closingRequested || this.phase === "closed" || this.checking || this.uploading || this.offlineBase) return false;
    const version = this.foregroundVersion;
    const current = () => this.live(epoch) && version === this.foregroundVersion && !this.closingRequested && this.phase !== "closed";
    this.checking = true; this.resumeAuthorized = false;
    this.phase = this.mountedDurable ? "waiting" : "checking"; this.emit();
    try {
      await this.localQueue; if (!current()) return false;
      await this.admitted(); if (!current()) return false;
      if (this.attempted) {
        const retained = clone(this.attempted), stored = await this.options.cache.read(this.scope);
        if (!current()) return false;
        if (stored && same(stored.entry, retained)) { this.record = stored; this.attempted = null; this.localDurable = true; }
        else { if ((stored?.cacheRevision ?? null) !== (this.record?.cacheRevision ?? null)) throw new CloudSyncError("storage");
          await this.persist(retained); }
      }
      if (!this.record || this.record.entry.confirmed.priorRecovery) return await this.open();
      let pending = this.recovery();
      const recoveredWriter = pending?.inFlight ? this.request(pending.inFlight) : this.suspendedLease ?? this.retainedWriter;
      const head = await this.options.transport.head(this.scope.campaignId); if (!current()) return false;
      this.lastHead = this.now();
      if (pending?.inFlight) {
        const operation = pending.inFlight, outcome = await this.options.transport.operation(this.scope.campaignId, operation.operationId, operation);
        if (!current()) return false;
        if (outcome.status === "expired") throw new CloudSyncError("operation-expired");
        if (outcome.status === "committed") await this.acknowledge(operation, outcome.receipt);
        else if (head.revision !== pending.baseRevision) throw new CloudSyncError("revision");
        if (!current()) return false;
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
        if (!current()) return false;
        this.installLease(lease, sent); recoveredAcquisition = true;
      } else if (this.acquisition && head.writerActive &&
        (BigInt(this.acquisition.expectedWriterGeneration!) === BigInt(head.writerGeneration) ||
          BigInt(this.acquisition.expectedWriterGeneration!) + 1n === BigInt(head.writerGeneration))) {
        // The lease receipt journal may have failed while this same token later
        // confirmed a checkpoint. Renew proves the token against the fresh head;
        // never mutate/replay the original immutable acquisition request.
        const sent = this.now(), lease = await this.options.transport.renew({ campaignId: this.scope.campaignId,
          writerToken: this.acquisition.writerToken, writerGeneration: head.writerGeneration });
        if (!current()) return false;
        this.installLease(lease, sent); recoveredAcquisition = true;
      }
      if (pending && head.writerGeneration !== pending.writerGeneration && !recoveredAcquisition) throw new CloudSyncError("writer");
      if (!pending && recoveredWriter && head.writerGeneration !== recoveredWriter.writerGeneration && !recoveredAcquisition) throw new CloudSyncError("writer");
      const currentWindow = this.window;
      let rebind = recoveredAcquisition;
      if (currentWindow && this.remaining(currentWindow.until) > 0 && head.writerGeneration === currentWindow.lease.writerGeneration) {
        const sent = this.now(), renewed = await this.options.transport.renew(currentWindow.lease);
        if (!current()) return false;
        this.installLease(renewed, sent);
        // A missing in-flight outcome uses the SAME immutable request while this lease is valid.
      } else if (recoveredWriter && head.writerActive && head.writerGeneration === recoveredWriter.writerGeneration) {
        const sent = this.now(), renewed = await this.options.transport.renew(recoveredWriter);
        if (!current()) return false;
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
        const sent = this.now(), lease = await this.acquire(head, false, epoch, current);
        if (!current()) return false;
        this.installLease(lease, sent); rebind = true;
      }
      if (this.writerFromStorage && head.writerActive) {
        // Even a retained acquisition intent can belong to an old document
        // whose receipt write failed. Rotate every proven live prior lease.
        const owned = this.window!.lease, sent = this.now();
        const lease = await this.acquire({ revision: head.revision, writerGeneration: owned.writerGeneration }, true, epoch, current);
        if (!current()) return false;
        this.installLease(lease, sent); rebind = true;
      }
      if (rebind) await this.queue(async () => {
        if (!current()) return;
        const latest = this.recovery();
        if (latest && this.record) {
          const flight = latest.inFlight ? this.request(latest.inFlight) : null;
          await this.persist({ ...this.record.entry, recovery: { baseRevision: head.revision, writerGeneration: this.window!.lease.writerGeneration,
            inFlight: null, following: latest.following ?? flight } });
        }
      });
      if (!current()) return false;
      const candidate = this.pendingCandidate;
      if (candidate) await this.codec.run({ kind: "candidate", input: { candidate, confirmed: this.record.entry.confirmed, scope: this.scope } });
      if (!current()) return false;
      await this.rememberWriter(epoch); if (!current()) return false;
      this.writerElsewhere = false; this.conflictCopies = undefined; this.grace = null; this.phase = "ready"; this.failure = null; this.emit();
      if (resumeWhenChecked && !this.resume()) return false;
      this.emitConnection();
      if (uploadPending && this.recovery() && !await this.checkpoint()) return false;
      return true;
    } catch (error) { if (current()) await this.failChecked(error, epoch); return false; }
    finally { if (this.live(epoch)) this.checking = false; }
  }
  markBackground(): void { this.backgroundedAt ??= this.now(); }
  markOffline(): void { this.wasOffline = true; }
  /** Frequent standalone focus/pageshow events are not opens. A fresh lease is
   * enough; after a real suspension check only admission/head/our small token.
   * null requests the existing full recovery path for changed/uncertain data. */
  foreground(online = false): Promise<boolean | null> {
    if (!requestDocumentVisible()) return Promise.resolve(false);
    if (this.foregrounding) return this.foregrounding;
    const reconnectedNetwork = online && this.wasOffline;
    if (online) this.wasOffline = false;
    const returnedFromBackground = this.backgroundedAt !== null;
    const hiddenFor = this.backgroundedAt ? this.elapsed(this.backgroundedAt) : 0;
    this.backgroundedAt = null;
    this.checkTime();
    if (this.lastPublishedStatus !== this.statusSignature()) this.emit();
    if (this.stopped || !this.enabled || this.closingRequested || this.hasPriorRecovery) return Promise.resolve(false);
    if (this.reconnecting || this.checking || this.renewing || this.uploading) return Promise.resolve(this.allowed());
    // Mere focus/online pulses must not reopen Save & Close. A genuine app
    // return remains an approved automatic open, including iOS bfcache resumes.
    if (this.phase === "closed") return Promise.resolve(returnedFromBackground ? null : false);
    if (this.failure && !["clock", "lease-expired", "lease-check", "network", "throttled", "storage", "processing"].includes(this.failure)) return Promise.resolve(false);
    const transient = this.failure === "network" || this.failure === "throttled";
    if (transient && this.allowed() && !reconnectedNetwork) return Promise.resolve(true);
    if (this.offlineBase || !this.localDurable || this.grace && !this.allowed() ||
      this.failure && !["clock", "lease-expired"].includes(this.failure) && !(transient && this.allowed())) {
      return Promise.resolve(reconnectedNetwork || this.elapsed(this.lastReconnect) >= Math.max(CLOUD_RENEW_MS, this.retryAfterMs) ? null : false);
    }
    const lease = this.window?.lease ?? this.suspendedLease ?? this.retainedWriter;
    if (!lease || !this.record) return Promise.resolve(null);
    const meaningfulReturn = hiddenFor >= 5_000 && (!this.lastForeground || this.elapsed(this.lastForeground) >= this.renewalCadence());
    if (!reconnectedNetwork && !meaningfulReturn && this.allowed() && this.window && this.remaining(this.window.until) > CLOUD_RENEW_MS) return Promise.resolve(true);
    this.lastForeground = this.now();
    const epoch = this.epoch, version = this.foregroundVersion;
    let cancelled = false, timedOut = false;
    const current = () => !cancelled && this.live(epoch) && version === this.foregroundVersion;
    const check = async () => {
      // No snapshot/cache/codec work and no temporary command gate for a healthy
      // lease. The server CAS still fences revocation, changed heads and tokens.
      await this.admitted(); if (!current()) return false;
      const revision = this.confirmedRevision;
      const head = await this.options.transport.head(this.scope.campaignId); if (!current()) return false;
      // Our own hide/periodic upload may acknowledge while this small read is
      // in flight. Its receipt is authoritative; do not call it another writer.
      if (this.uploading || revision !== this.confirmedRevision) return this.allowed();
      if (head.revision !== revision || head.writerGeneration !== lease.writerGeneration) {
        this.fail(new CloudSyncError(head.revision !== revision ? "revision" : "writer")); return false;
      }
      if (!head.writerActive) { this.resumeAuthorized = false; this.phase = "paused"; this.failure = "lease-expired"; this.emit(); return false; }
      const sent = this.now();
      const refreshed = await this.options.transport.renew(lease).then(renewed => {
        if (!current()) return null;
        if (renewed.writerGeneration !== lease.writerGeneration) throw new CloudSyncError("writer");
        // A verified own save can overtake the reply to this successful renewal.
        if (renewed.revision !== head.revision && !this.isOwnRenewalRevision(renewed.revision, lease.writerGeneration))
          throw new CloudSyncError("revision");
        return { lease: renewed, sent };
      }, error => {
        if (!current()) return null;
        if (!(error instanceof CloudSyncError && error.code === "revision" &&
            (this.uploading || revision !== this.confirmedRevision))) throw error;
        return this.renewAfterOwnSave(lease, current);
      });
      if (!current() || this.closingRequested || !this.localDurable) return false;
      if (!refreshed) return this.allowed();
      this.installLease(refreshed.lease, refreshed.sent);
      const changed = !this.allowed() || this.phase !== "ready" || this.failure !== null;
      this.resumeAuthorized = true; this.grace = null; this.phase = "ready"; this.failure = null;
      if (changed) this.emit();
      this.emitConnection();
      return true;
    };
    this.foregrounding = cloudCheckDeadline(check(), undefined, () => {
      if (!current()) return;
      // A missing light RPC is not proof of takeover. Keep the original valid
      // window/grace and cancel only THIS check, not accepted local/save work.
      timedOut = true; cancelled = true; this.fail(new CloudSyncError("network"));
    }).then(checked => !current() ? false : checked ? true : null).catch(error => {
      if (!this.live(epoch) || version !== this.foregroundVersion || !timedOut && !current()) return false;
      if (!timedOut) { cancelled = true; this.fail(error); }
      if (this.allowed()) return true;
      return ["auth", "revoked", "deleted", "disabled", "protocol", "notice"].includes(this.failure ?? "") ? false : null;
    }).finally(() => { this.foregrounding = null; this.emit(); });
    this.emit();
    return this.foregrounding;
  }
  focus(): Promise<boolean> {
    if (this.reconnecting) return this.reconnecting;
    if (!this.enabled || this.stopped || this.closingRequested || this.phase === "closed") return Promise.resolve(false);
    this.foregroundVersion++; // A late small check cannot bypass full recovery.
    if (this.offlineBase && (!this.localDurable || !this.offlineLocal)) {
      this.reconnecting = (async () => {
        // Repair an accepted offline checkpoint before asking the resolver to
        // rebase it. offlineBase must continue to deny all server writes.
        const copy = this.deviceCopy(), usage = this.pendingCandidate?.usageQuestions ?? [];
        if (copy) await this.restoreVerifiedOffline(copy, usage);
        return false;
      })().finally(() => { this.reconnecting = null; this.emit(); });
      this.emit();
      return this.reconnecting;
    }
    if (this.offlineLocal) return Promise.resolve(false);
    this.autoReconnect = true; this.lastReconnect = this.now();
    const version = this.foregroundVersion;
    this.reconnecting = this.boundedCheck(async epoch => {
      const current = () => this.live(epoch) && version === this.foregroundVersion && !this.closingRequested && this.phase !== "closed";
      this.resumeAuthorized = false; this.emit();
      if (this.prepareLocalRecovery && !await this.prepareLocalRecovery()) return false;
      if (!current()) return false;
      if (this.uploading) await this.uploading;
      if (!current()) return false;
      // retry checks admission, the account head, immutable operation outcomes
      // and lease ownership before it permits any new commands.
      if (!this.record && !await this.open()) return false;
      if (!current()) return false;
      return await this.retry(true) && current() && this.resume();
    }, () => version === this.foregroundVersion && !this.closingRequested && this.phase !== "closed")
      .finally(() => { this.reconnecting = null; this.emit(); });
    this.emit();
    return this.reconnecting;
  }
  reportLocalFailure(error: unknown): void {
    const programming = commandProgrammingFailure(error, "recovery", "coordinator");
    if (programming) {
      problemDiagnostics.event("processing-error", encodeCommandFailure(programming));
      // A command repair already owns the admission gate and verifies its
      // durable prefix. Other programming failures pause for checked recovery;
      // neither case is evidence of corrupt bytes or permission to undo fences.
      if (!this.commandRepairs && ["ready", "saving", "waiting", "paused"].includes(this.phase)) {
        this.resumeAuthorized = false;
        if (!this.failure || this.failure === "processing") { this.phase = "paused"; this.failure = "processing"; }
      }
      this.emit(); return;
    }
    // Catalog drift is a recoverable session-baseline mismatch, not evidence of
    // damaged saved bytes. Do not weaken any other evidence/integrity check.
    const catalogChanged = error instanceof GameEvidenceError && error.code === "concept-set-change";
    this.fail(error instanceof CloudSyncError ? error : new CloudSyncError(isCloudCodecCapacityError(error) ? "capacity" : isCloudCodecProcessingError(error) || catalogChanged ? "processing" : "corrupt"));
  }
  async pulse(): Promise<void> {
    if (!this.enabled || this.stopped || this.closingRequested || this.phase === "closed" || !requestDocumentVisible()) return;
    if (this.offlineLocal) {
      if (!this.automaticSelection || this.checking || !this.networkBackoff.ready() || this.elapsed(this.lastReconnect) < Math.max(CLOUD_RENEW_MS, this.retryAfterMs)) return;
      this.lastReconnect = this.now(); this.checking = true;
      const epoch = this.epoch;
      try {
        // Probe without pausing local play. Recovery uses the verified ACCOUNT
        // head as its server write base; a local descendant stays in place.
        if (!await this.probeAutomaticSelection()) return;
        // A local-only reopen can replace this coordinator without restoring
        // server authority. Reserve the next interval before that handoff; only
        // a checked server lease clears the shared retry schedule.
        this.retryAfterMs = this.networkBackoff.fail();
        if (this.live(epoch)) {
          this.selectingVerifiedAccount = true;
          try { await this.automaticSelection?.(); }
          finally { this.selectingVerifiedAccount = false; }
        }
      } catch (error) {
        if (!this.live(epoch)) return;
        if (error instanceof CloudSyncError && ["network", "throttled"].includes(error.code)) this.retryAfterMs = this.networkBackoff.fail(error.retryAfterMs);
        else this.fail(error);
      } finally { if (this.live(epoch)) this.checking = false; }
      return;
    }
    this.checkTime();
    if (this.lastPublishedStatus !== this.statusSignature()) this.emit();
    if (this.failure === "revision" && this.automaticSelection && !this.checking && !this.reconnecting && !this.renewing && !this.uploading &&
      this.networkBackoff.ready() && this.elapsed(this.lastReconnect) >= Math.max(CLOUD_RENEW_MS, this.retryAfterMs)) {
      this.lastReconnect = this.now(); this.checking = true;
      this.retryAfterMs = this.networkBackoff.fail(); // Reserve across a coordinator replacement, including a failed selection.
      try { await this.automaticSelection(); }
      catch (error) { if (!this.stopped) this.fail(error); }
      finally { this.checking = false; }
      return;
    }
    if ((this.autoReconnect || this.automaticSelection) && !this.closingRequested && !this.allowed() && this.networkBackoff.ready() &&
      ["clock", "lease-expired", "lease-check", "network", "throttled", "storage", "processing"].includes(this.failure ?? "") &&
      this.elapsed(this.lastReconnect) >= Math.max(CLOUD_RENEW_MS, this.retryAfterMs)) {
      // The mounted session owns command draining and verified local fallback.
      if (this.automaticSelection && this.mountedDurable) { await this.automaticSelection(); return; }
      if (["clock", "lease-expired"].includes(this.failure ?? "")) {
        const checked = await this.foreground();
        if (checked !== null) return;
      }
      await this.focus(); return;
    }
    if (this.checking || this.reconnecting || this.renewing || this.grace || !this.localDurable || !this.networkBackoff.ready()) return;
    const epoch = this.epoch, version = this.foregroundVersion;
    // A fresh authority check or close supersedes an already-sent renewal. Its
    // late response must neither fence the checked owner nor reopen a closed one.
    const current = () => this.live(epoch) && version === this.foregroundVersion && !this.closingRequested && this.phase !== "closed";
    if (this.window && ["ready", "saving"].includes(this.phase) && this.elapsed(this.lastRenew) >= this.renewalCadence()) {
      this.renewing = true;
      const previous = this.window, sent = this.now(), previouslyPlayable = this.allowed();
      const revision = this.confirmedRevision;
      this.lastRenew = sent; // A refused/short-circuited check is still an attempt, never a 1 Hz renewal schedule.
      try {
        const lease = await cloudCheckDeadline(this.options.transport.renew(previous.lease));
        if (!current()) return;
        if (lease.writerGeneration !== previous.lease.writerGeneration) throw new CloudSyncError("writer");
        this.checkTime();
        if (this.phase === "paused" || this.phase === "conflict") return;
        this.installLease(lease, sent);
        this.emitConnection();
      } catch (error) {
        if (!current()) return;
        if (error instanceof CloudSyncError && error.code === "revision" && this.live(epoch)) {
          // The RPC may still have our pre-upload revision cached while an
          // accepted upload's receipt is being verified/stored. Refresh only
          // the head and prove the SAME writer token, without waiting for bulk
          // acknowledgement work or temporarily fencing a valid lease.
          try {
            if (!this.uploading && revision === this.confirmedRevision) {
              // focus owns its gate. Do not set a new checking phase before
              // joining a check that may already have successfully resumed.
              if (this.live(epoch) && !await (this.automaticSelection && this.mountedDurable ? this.automaticSelection() : this.focus()) && this.phase === "ready") await this.failChecked(error, epoch, previouslyPlayable);
            } else {
              const refreshed = await this.renewAfterOwnSave(previous.lease, current);
              if (refreshed && current()) {
                this.checkTime();
                if (this.phase === "paused" || this.phase === "conflict") return;
                this.installLease(refreshed.lease, refreshed.sent);
                this.emitConnection();
              }
            }
          } catch (failure) { if (current()) await this.failChecked(failure, epoch); }
        } else await this.failChecked(error, epoch);
      }
      finally { this.renewing = false; }
    } else if (!this.window && this.phase === "readonly" && this.elapsed(this.lastHead) >= ACCOUNT_READ_REFRESH_MS) {
      this.lastHead = this.now();
      try { await this.admitted(); if (!this.live(epoch)) return;
        const head = await this.options.transport.head(this.scope.campaignId);
        if (this.live(epoch) && head.revision !== this.record?.entry.confirmed.revision) { this.phase = "paused"; this.failure = "account-save-changed"; this.emit(); } }
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
      // Closing denies new commands; at most an in-flight copy and its one
      // following candidate can remain. A broken preparation callback cannot
      // keep this dialog in an unlimited successful-but-no-progress loop.
      for (let attempt = 0; this.recovery(); attempt++) {
        if (attempt >= 3 || this.stopped) { this.fail(new CloudSyncError("processing"), this.localDurable && !this.attempted); return false; }
        if (!await this.checkpoint("save-close")) return false;
      }
      if (!this.window || !this.localDurable || this.stopped) return false;
      const epoch = this.epoch, lease = this.window.lease;
      try {
        await cloudCheckDeadline(this.options.transport.release(lease)); if (!this.live(epoch)) return false;
        this.window = null; this.phase = "closed"; setAccountRequestsActive(this.scope.accountId, false); this.emit(); return true;
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
  private async preserveCapacityJournal(account: CloudConfirmed): Promise<boolean> {
    if (!this.options.entryStore || !this.journal) throw new CloudSyncError("storage");
    const journal = await this.journal.read(cloudCampaignStorageKey(this.scope));
    if (!journal) throw new CloudCacheError("conflict");
    // Use the journal's own base, not the cache's current head. A previous open
    // may have committed that newer cache head just before the page was killed.
    if (journal.snapshot.seed.confirmed?.snapshot.uncompressedSha256 === account.snapshot.uncompressedSha256) return false;
    // A capacity result has no encodable following candidate. Keep the entire
    // original seed AND suffix as a hidden conflict backup, after proof/replay
    // validation and before acquiring/replacing anything. No cloud size bypass.
    await this.codec.run({ kind: "journalPrepare", input: { data: journal, encode: false } });
    if (await this.journalChangedSinceOpen()) throw new CloudCacheError("conflict");
    const value = { scope: this.scope, device: this.record!.entry, account, journal };
    const key = `conflict:${this.scope.campaignId}:journal:${await this.codec.run({ kind: "hash", input: JSON.stringify(value) })}`;
    const retained = await this.options.entryStore.create(key, value);
    if (!same(retained, value) || !same(await this.options.entryStore.read(key), value)) throw new CloudSyncError("storage");
    return true;
  }
  private async preserveEntry(device: CloudCacheEntry, account: CloudConfirmed, retainImmutable = false): Promise<void> {
    if (!this.options.entryStore) throw new CloudSyncError("storage");
    const value = { scope: this.scope, device, account };
    // A pre-existing compacted preview cannot stand in for immutable request
    // bytes when the active request is about to be fenced/replaced.
    const key = `conflict:${this.scope.campaignId}:${retainImmutable ? "immutable:" : ""}${await this.codec.run({ kind: "hash", input: JSON.stringify(value) })}`;
    const backup = this.snapshotSaves && !retainImmutable ? await snapshotConflictBackup(value, this.codec, key.slice(key.lastIndexOf(":") + 1)) : value;
    await this.options.entryStore.create(key, backup);
    const retained = await this.options.entryStore.read<{ compactedFrom?: string }>(key);
    if (!same(retained, value) && (retainImmutable || retained?.compactedFrom !== key.slice(key.lastIndexOf(":") + 1))) throw new CloudSyncError("storage");
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
    if (reason !== "switch") setAccountRequestsActive(this.scope.accountId, false);
    this.stopped = true; this.epoch++; this.resumeAuthorized = false; this.window = null; this.suspendedLease = null;
    this.phase = reason === "revoked" || reason === "deleted" ? "blocked" : "closed"; this.failure = reason; this.emit();
  }
}
