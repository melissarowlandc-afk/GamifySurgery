import { problemDiagnostics, showCommandProblem } from "../../diagnostics/problemDiagnostics";
import { applyGameEvidenceCommand, applyGameEvidenceBuildUndo, gameEvidenceDelta, type DomainContext, type GameCommand, type GameEvidenceCheckpoint, type GameState } from "@gamify-surgery/game-domain";
import { isFirstScoredAnswer } from "../../playtime/scoredQuestionUsage";
import type { QuestionUsageReceipt } from "../../playtime/usageTypes";
import type { LocalPrototypeProfile } from "../prototypeStorage";
import { type CloudCampaignMetadata } from "./codec";
import { loadCloudEvidenceCheckpoint, type CloudSourceProvenance } from "./codecEvidence";
import { CloudSyncCoordinator, type CloudCheckpointReason, type CloudSyncView } from "./coordinator";
import { logicalJsonText } from "./codecJson";
import { cloudCheckDeadline } from "./checkDeadline";
import { CloudSyncError } from "./transport";
import { LocalJournalDrain, LOCAL_COMPACTION_MS, freezeJournalCheckpoint, journalWorkerAddress } from "../localJournal";
import { bindJournal, prepareJournal } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";

export function cloudCampaignMetadata(profile: LocalPrototypeProfile): CloudCampaignMetadata {
  const campaign = profile.campaigns.find(row => row.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("A selected campaign is required.");
  const id = campaign.campaignId;
  return { campaignId: id, name: campaign.name, status: campaign.status, createdAtRealMs: campaign.createdAtRealMs,
    updatedAtRealMs: campaign.updatedAtRealMs, tutorial: { guidance: profile.tutorialGuidanceByCampaign?.[id] ?? null,
      introDismissed: profile.tutorialIntroDismissedCampaignIds.includes(id),
      dailyRoutineTipAcknowledgments: profile.tutorialDailyRoutineTipAcknowledgments[id] ?? [],
      dailyRoutinePause: profile.tutorialDailyRoutinePauseByCampaign[id] ?? null } };
}

/** Shared desktop/phone command boundary. A verified checkpoint and either a
 * checked server lease or explicitly durable offline authority are required. */
export class CloudGameSession {
  private readonly unbindDiagnostics: () => void;
  private lastCommandMs: number | null = null;
  private lastCommandAt: number | null = null;
  private checkpoint: GameEvidenceCheckpoint;
  private current: GameState;
  private campaign: CloudCampaignMetadata;
  private readonly source: CloudSourceProvenance;
  private readonly questions = new Map<string, QuestionUsageReceipt>();
  private readonly listeners = new Set<() => void>();
  private flushing: Promise<boolean> | null = null;
  private encoding = false;
  private dirty = false;
  private changeVersion = 0;
  private durableVersion = 0;
  private readonly durabilityWaiters = new Set<{ version: number; resolve(ok: boolean): void }>();
  private stopped = false;
  private closing: Promise<boolean> | null = null;
  private readonly unsubscribe: () => void;
  private readonly unsubscribeReceipts: () => void;
  private readonly unsubscribeRecovery: () => void;
  private readonly unsubscribeAutomatic: () => void;
  private boundRevision: string;
  private reloadRequired = false;
  private reconnecting: Promise<boolean> | null = null;
  private foregrounding: Promise<boolean> | null = null;
  private journalDrain: LocalJournalDrain | null = null;
  private journalStart = 0;
  private preparedVersion = 0;
  private lastCompaction = performance.now();
  private compacting: Promise<void> | null = null;
  private compactedThrough = 0;
  private lastCompactionAttempt = -Infinity;
  private warming: Promise<boolean> | null = null;
  private warmThrough = -1;
  private lastWarmFailure = -Infinity;
  private backgrounded = false;
  private readonly unsubscribeCheckpoint: () => void;
  private constructor(readonly coordinator: CloudSyncCoordinator, loaded: Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>,
    private readonly switchTo?: (campaignId: string) => Promise<void>, private readonly automaticReconnect?: (checked: boolean) => Promise<boolean>) {
    this.checkpoint = freezeJournalCheckpoint(loaded.checkpoint); this.current = loaded.state; this.campaign = loaded.campaign; this.source = loaded.source;
    showCommandProblem(null);
    this.boundRevision = coordinator.confirmedRevision!;
    this.unbindDiagnostics = problemDiagnostics.source("gameSession", () => ({ reloadRequired: this.reloadRequired,
      closing: Boolean(this.closing), stopped: this.stopped, dirty: this.dirty, encoding: this.encoding, canExecute: this.canExecute,
      reconnecting: Boolean(this.reconnecting), preparing: Boolean(this.warming), lastCommandMs: this.lastCommandMs,
      commandAge: this.lastCommandAt === null ? null : Date.now() - this.lastCommandAt }));
    for (const receipt of coordinator.pendingCandidate?.usageQuestions ?? []) this.questions.set(receipt.receipt_id, receipt);
    this.unsubscribe = coordinator.subscribe(() => {
      if (!this.reloadRequired && coordinator.confirmedRevision !== this.boundRevision) {
        this.reloadRequired = true; coordinator.requireSessionReload();
      }
      this.emit();
    });
    this.unsubscribeReceipts = coordinator.onAcknowledged(receipt => { this.boundRevision = receipt.revision; for (const id of receipt.usageReceiptIds) this.questions.delete(id); });
    this.unsubscribeRecovery = coordinator.beforeReconnect(async () => await this.durable() || !this.dirty);
    this.unsubscribeCheckpoint = coordinator.beforeCheckpoint(reason => this.prepareCheckpoint(reason));
    this.unsubscribeAutomatic = automaticReconnect ? coordinator.onAutomaticSelection(() => this.reconnect()) : () => {};
  }
  static async create(coordinator: CloudSyncCoordinator, switchTo?: (campaignId: string) => Promise<void>, automaticReconnect?: (checked: boolean) => Promise<boolean>,
    options: { journal?: boolean } = {}): Promise<CloudGameSession> {
    const confirmed = coordinator.confirmed;
    if (!confirmed || ["off", "checking", "blocked", "auth", "storage"].includes(coordinator.view.phase)) throw new Error("Open and verify the account campaign first.");
    const pending = coordinator.pendingCandidate;
    const loaded = await loadCloudEvidenceCheckpoint({ snapshot: pending?.snapshot ?? confirmed.snapshot,
      evidence: pending ? { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } : confirmed.evidence,
      revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: coordinator.scope.campaignId,
      expectedBaselineId: confirmed.baselineId });
    const session = new CloudGameSession(coordinator, loaded, switchTo, automaticReconnect);
    const journal = coordinator.journal;
    if (journal && options.journal !== false && !coordinator.hasPriorRecovery && coordinator.view.canExecute) {
      try {
        const key = cloudCampaignStorageKey(coordinator.scope), owner = crypto.randomUUID();
        const head = await bindJournal(journal, key, owner, { checkpoint: loaded.checkpoint, campaign: loaded.campaign,
          source: loaded.source, confirmed, usageQuestions: [...session.questions.values()], writerGeneration: coordinator.journalWriterGeneration }, coordinator.codec);
        session.journalStart = head.highWater;
        session.compactedThrough = head.highWater;
        session.journalDrain = new LocalJournalDrain(journal, key, owner, head.highWater, error => coordinator.reportLocalFailure(new CloudSyncError("storage")));
        coordinator.bindJournalOwner(owner);
        session.journalDrain.onCommit = () => { session.emit();
          if (!session.backgrounded && (typeof document === "undefined" || document.visibilityState !== "hidden")) void session.warmPrepared();
        };
      } catch (error) { session.detach(); coordinator.reportLocalFailure(new CloudSyncError("storage")); throw error; }
    }
    return session;
  }
  private emit(): void { for (const listener of this.listeners) { try { listener(); } catch (error) { problemDiagnostics.error("session-observer", error); } } }
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  get needsReload(): boolean { return this.reloadRequired; }
  get syncView(): CloudSyncView {
    const view = this.coordinator.view, preparing = this.dirty || this.encoding;
    return { ...view, canExecute: this.canExecute, pending: view.pending || preparing,
      localDurable: view.localDurable && (this.journalDrain ? !this.journalDrain.dirty : !preparing) };
  }
  get canExecute(): boolean { return !this.stopped && !this.reloadRequired && !this.closing && this.coordinator.view.canExecute; }
  get state(): GameState { return !this.reloadRequired && this.coordinator.view.canExecute ? this.current : { ...this.current, paused: true }; }
  get metadata(): CloudCampaignMetadata { return structuredClone(this.campaign); }

  execute(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null): GameState | null {
    if (!this.canExecute) { problemDiagnostics.event("command", "refused"); this.emit(); return null; }
    if (this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(new CloudSyncError("storage")); return null; }
    const before = this.current;
    const priorCheckpoint = this.checkpoint;
    let result: ReturnType<typeof applyGameEvidenceCommand>;
    const started = performance.now();
    try { result = applyGameEvidenceCommand(this.checkpoint, command, context); }
    catch (error) { problemDiagnostics.error("command", error); showCommandProblem("That action could not be completed. Try again or send a problem report."); this.coordinator.reportLocalFailure(error); return null; }
    finally { this.lastCommandMs = Math.round(performance.now() - started); this.lastCommandAt = Date.now(); }
    if (result.replayed) return this.state;
    this.checkpoint = result.checkpoint; this.current = result.state;
    this.campaign = { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) };
    if (isFirstScoredAnswer(before, result.state, command)) {
      // Optional usage cannot interrupt a command already applied to the clinic.
      try { const receipt = createQuestionReceipt?.(); if (receipt) this.questions.set(receipt.receipt_id, receipt); }
      catch (error) { problemDiagnostics.error("usage-receipt", error); }
    }
    this.changeVersion++; this.dirty = true;
    this.queueLocal(priorCheckpoint, command.type === "ADVANCE_TICK");
    this.coordinator.noteLocalChange(); this.emit();
    const minutes = (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
    if (Math.floor(before.facilityTick / minutes) < Math.floor(this.current.facilityTick / minutes)) void this.checkpointNow("day-end");
    else if (command.type === "SET_PAUSED" && command.paused) void this.durable();
    return this.current;
  }
  updateMetadata(campaign: CloudCampaignMetadata): void {
    if (this.stopped || campaign.campaignId !== this.coordinator.scope.campaignId || !this.coordinator.view.canExecute ||
      logicalJsonText(JSON.parse(JSON.stringify({ ...campaign, updatedAtRealMs: 0 }))) ===
      logicalJsonText(JSON.parse(JSON.stringify({ ...this.campaign, updatedAtRealMs: 0 })))) return;
    if (this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(new CloudSyncError("storage")); return; }
    this.campaign = structuredClone(campaign); this.changeVersion++; this.dirty = true; this.queueLocal(); this.coordinator.noteLocalChange();
  }
  private queueLocal(before?: GameEvidenceCheckpoint, tick = false): void {
    if (!this.journalDrain) { this.scheduleFlush(); return; }
    try { this.journalDrain.accept({ delta: before ? gameEvidenceDelta(before, this.checkpoint) : null,
      campaign: this.campaign, usageQuestions: [...this.questions.values()], writerGeneration: this.coordinator.journalWriterGeneration }, tick); }
    catch (error) { problemDiagnostics.error("journal", error); this.coordinator.reportLocalFailure(new CloudSyncError("storage")); }
  }
  private warmPrepared(target = this.journalDrain?.committed ?? -1, force = false): Promise<boolean> {
    const drain = this.journalDrain;
    if (!drain || this.stopped) return Promise.resolve(false);
    if (this.warmThrough >= target) return Promise.resolve(true);
    if (this.warming) return this.warming.then(ok => ok && (this.warmThrough >= target || this.warmPrepared(target, force)));
    if (!force && performance.now() - this.lastWarmFailure < 60_000) return Promise.resolve(false);
    this.warming = this.coordinator.codec.run({ kind: "journalWarm", input: { address: journalWorkerAddress(drain.store, drain.key), owner: drain.owner } }).then(result => {
      this.warmThrough = result.through; this.lastWarmFailure = -Infinity; this.coordinator.preparationRecovered(); return true;
    }).catch(error => { this.lastWarmFailure = performance.now(); this.coordinator.reportPreparationFailure(error); return false; }).finally(() => {
      this.warming = null;
      if (!this.stopped && !this.backgrounded && drain.committed > this.warmThrough && performance.now() - this.lastWarmFailure >= 60_000) void this.warmPrepared();
    });
    return this.warming;
  }
  private async prepareCheckpoint(reason: CloudCheckpointReason, target = this.changeVersion): Promise<boolean> {
    if (reason === "hidden" || reason === "pagehide") this.backgrounded = true;
    if (!this.journalDrain) return this.durable();
    if (!await this.durable()) return false;
    // Exit callbacks only drain small rows and use an already staged candidate.
    // The next open can rebuild the latest one from the committed journal.
    const leaving = reason === "hidden" || reason === "pagehide";
    if (leaving) {
      const ready = await this.journalDrain.store.prepared(this.journalDrain.key);
      if (!ready || ready.owner !== this.journalDrain.owner || ready.through - this.journalStart <= this.preparedVersion) return true;
      ready.candidate.usageQuestions = ready.candidate.usageQuestions.filter(r => this.questions.has(r.receipt_id));
      if (!await this.coordinator.stage(ready.candidate, reason, true)) return false;
      this.preparedVersion = ready.through - this.journalStart; this.dirty = this.changeVersion > this.preparedVersion;
      this.coordinator.noteLocalChange(this.dirty); return true;
    }
    if (this.preparedVersion >= target) return true;
    if (this.flushing) {
      if (!await this.flushing) return false;
      return this.preparedVersion >= target || this.prepareCheckpoint(reason, target);
    }
    this.encoding = true; this.emit();
    this.flushing = (async () => {
      const compact = performance.now() - this.lastCompaction >= LOCAL_COMPACTION_MS || reason === "day-end" || reason === "save-close";
      if (this.journalStart + target > this.journalDrain!.committed) throw new CloudSyncError("storage");
      if (!await this.warmPrepared(this.journalStart + target, true)) return false;
      const prepared = await this.journalDrain!.store.prepared(this.journalDrain!.key);
      if (this.stopped || !prepared || prepared.owner !== this.journalDrain!.owner) return false;
      prepared.candidate.usageQuestions = prepared.candidate.usageQuestions.filter(r => this.questions.has(r.receipt_id));
      if (!await this.coordinator.stage(prepared.candidate, reason, true)) return false;
      if (compact) await prepareJournal(this.journalDrain!.store, this.journalDrain!.key, this.coordinator.codec, { compact: true, encode: false });
      this.preparedVersion = prepared.through - this.journalStart;
      this.dirty = this.changeVersion > this.preparedVersion;
      this.coordinator.noteLocalChange(this.dirty);
      this.coordinator.preparationRecovered();
      if (compact) { this.lastCompaction = performance.now(); this.compactedThrough = prepared.through; }
      return true;
    })().catch(error => { this.coordinator.reportPreparationFailure(error); return false; }).finally(() => {
      this.encoding = false; this.flushing = null; this.emit();
    });
    return this.flushing;
  }
  private scheduleFlush(): void {
    if (this.flushing) return;
    // Synchronous command sequences (close chart, enter mode, etc.) share ONE
    // following candidate, with every command observed by the evidence wrapper.
    this.flushing = Promise.resolve().then(async () => {
      this.encoding = true; this.emit();
      let success = true;
      while (this.dirty && !this.stopped) {
        this.dirty = false;
        const version = this.changeVersion, checkpoint = this.checkpoint, campaign = this.campaign, usageQuestions = [...this.questions.values()];
        // An acknowledgment can land while compression is running. Re-encode
        // its suffix against the NEW confirmed prefix; never upload it twice.
        let encoded;
        for (;;) {
          const confirmed = this.coordinator.encodingBase;
          if (!confirmed) return false;
          encoded = await this.coordinator.codec.run({ kind: "encode", input: { checkpoint, campaign, source: this.source,
            operationId: "local-candidate", expectedRevision: confirmed.revision,
            acknowledgedEvidence: { headerSha256: confirmed.headerSha256, records: confirmed.records } } });
          if (this.coordinator.confirmedRevision !== confirmed.revision) continue;
          break;
        }
        if (this.stopped) return false;
        success = await this.coordinator.stage({ campaign, snapshot: encoded.snapshot, evidence: encoded.evidence,
          usageQuestions: usageQuestions.filter(receipt => this.questions.has(receipt.receipt_id)) }, "ordinary", true);
        if (!success) { this.dirty = true; this.finishDurability(false); return false; }
        this.durableVersion = version; this.finishDurability(true);
      }
      return success;
    }).catch(error => { this.dirty = !this.stopped; this.coordinator.reportLocalFailure(error); this.finishDurability(false); return false; }).finally(() => {
      this.encoding = false; this.flushing = null; this.emit();
      // An immediate Retry can register after failure settled its old waiters
      // but before this cleanup. Give that new barrier a fresh attempt; never
      // spin-retry a persistent failure when no caller is waiting.
      if (this.dirty && this.durabilityWaiters.size && !this.stopped) this.scheduleFlush();
    });
  }
  private finishDurability(ok: boolean): void {
    for (const waiter of this.durabilityWaiters) if (!ok || waiter.version <= this.durableVersion) {
      this.durabilityWaiters.delete(waiter); waiter.resolve(ok);
    }
  }
  async durable(): Promise<boolean> {
    if (this.stopped) return false;
    if (this.journalDrain) {
      try { const ok = await cloudCheckDeadline(this.journalDrain.drain()); if (ok) this.coordinator.confirmJournalDurability(); return ok; }
      catch { this.coordinator.reportLocalFailure(new CloudSyncError("storage")); return false; }
    }
    if (!this.dirty && !this.flushing || this.durableVersion >= this.changeVersion) return this.coordinator.view.localDurable;
    const version = this.changeVersion;
    let resolve!: (ok: boolean) => void;
    const work = new Promise<boolean>(done => { resolve = done; });
    const waiter = { version, resolve }; this.durabilityWaiters.add(waiter);
    if (this.dirty && !this.flushing) this.scheduleFlush();
    // Wait for commands accepted AT THIS CALL, not an endless stream of future
    // facility ticks. Every later command retains its own evidence/version.
    try { return await cloudCheckDeadline(work); }
    catch (error) { problemDiagnostics.error("durability", error); this.coordinator.reportLocalFailure(new CloudSyncError("processing")); return false; }
    finally { this.durabilityWaiters.delete(waiter); }
  }
  foreground(online = false): Promise<boolean> {
    this.backgrounded = false;
    if (this.journalDrain?.dirty === false) void this.warmPrepared();
    if (this.foregrounding) return this.foregrounding;
    if (this.stopped || this.closing || this.coordinator.hasPriorRecovery) return Promise.resolve(false);
    this.foregrounding = (async () => {
      const checked = await this.coordinator.foreground(online);
      if (this.stopped) return false;
      return checked === null || this.needsReload ? this.reconnect() : checked;
    })().finally(() => { this.foregrounding = null; });
    return this.foregrounding;
  }
  reconnect(): Promise<boolean> {
    // Foregrounding an account clinic, including after Save & Close, goes
    // through the router's full automatic selection and fencing. Recovery
    // export stays stable; a bare coordinator has no authority to reopen itself.
    if (this.stopped || this.closing || this.coordinator.view.phase === "closed" && !this.automaticReconnect ||
      this.coordinator.hasPriorRecovery) return Promise.resolve(false);
    if (this.reconnecting) return this.reconnecting;
    this.reconnecting = this.reconnectChecked().finally(() => { this.reconnecting = null; });
    return this.reconnecting;
  }
  private async reconnectChecked(): Promise<boolean> {
    // Finish persisting commands already accepted before changing lease/base.
    // A failed write remains in coordinator.attempted for its quota retry.
    try { if (!await cloudCheckDeadline(this.durable()) && (this.journalDrain || this.coordinator.view.failure === "processing")) return false; }
    catch {
      if (!this.stopped) this.coordinator.reportLocalFailure(new CloudSyncError("processing"));
      return false;
    }
    if (this.stopped) return false;
    const checked = await this.coordinator.focus();
    if (this.stopped) return false;
    if (checked && !this.needsReload && this.dirty) {
      if (!await this.prepareCheckpoint("ordinary") || !await this.coordinator.checkpoint("purchase")) return false;
    }
    return this.automaticReconnect ? this.automaticReconnect(checked && !this.needsReload) : checked;
  }
  async checkpointNow(reason: CloudCheckpointReason): Promise<boolean> {
    if (reason === "hidden" || reason === "pagehide") this.backgrounded = true;
    if (!await this.durable()) return false;
    return this.coordinator.checkpoint(reason);
  }
  /** Explicit support/import boundary: materialize local recovery without RPC. */
  prepareRecoveryCopy(): Promise<boolean> { return this.prepareCheckpoint("campaign-switch"); }
  async pulse(): Promise<void> {
    await this.coordinator.pulse();
    if (typeof document !== "undefined" && document.visibilityState === "visible") this.backgrounded = false;
    const drain = this.journalDrain;
    if (drain && !this.stopped && !this.backgrounded && drain.committed > this.warmThrough && performance.now() - this.lastWarmFailure >= 60_000) void this.warmPrepared();
    if (!drain || this.stopped || this.flushing || this.compacting || drain.highWater <= this.compactedThrough ||
      performance.now() - this.lastCompaction < LOCAL_COMPACTION_MS || performance.now() - this.lastCompactionAttempt < 60_000) return;
    this.lastCompactionAttempt = performance.now();
    // Operational compaction is independent of connectivity/lease authority.
    // It does not need to prepare a cloud body or change command permission.
    this.compacting = (async () => {
      if (!await this.durable() || this.stopped) return;
      const result = await prepareJournal(drain.store, drain.key, this.coordinator.codec, { compact: true, encode: false });
      if (result) { this.compactedThrough = result.through; this.lastCompaction = performance.now(); }
    })().catch(error => { problemDiagnostics.error("journal-compaction", error); }).finally(() => { this.compacting = null; });
    await this.compacting;
  }
  saveAndClose(context: DomainContext): Promise<boolean> {
    if (this.closing) return this.closing;
    // Stop live ticks before awaiting encoding; routine recovery work never pauses play.
    if (!this.current.paused && !this.execute({ type: "SET_PAUSED", paused: true, operationId: crypto.randomUUID() }, context)) return Promise.resolve(false);
    this.closing = (async () => {
      if (!await this.durable()) return false;
      if (!await this.prepareCheckpoint("save-close")) return false;
      return this.coordinator.saveAndClose();
    })().finally(() => { this.closing = null; this.emit(); });
    this.emit(); return this.closing;
  }
  async switchCampaign(campaignId: string, context: DomainContext): Promise<boolean> {
    if (!this.switchTo || !await this.saveAndClose(context)) return false;
    await this.switchTo(campaignId); return true;
  }
  undoBuild(state: GameState): GameState | null {
    if (!this.canExecute) { problemDiagnostics.event("command", "refused"); this.emit(); return null; }
    if (this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(new CloudSyncError("storage")); return null; }
    try {
      const before = this.checkpoint;
      const result = applyGameEvidenceBuildUndo(this.checkpoint, state, crypto.randomUUID());
      this.checkpoint = result.checkpoint; this.current = result.state;
      this.campaign = { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) };
      this.changeVersion++; this.dirty = true; this.queueLocal(before); this.coordinator.noteLocalChange(); this.emit();
      return this.current;
    } catch (error) { this.coordinator.reportLocalFailure(error); return null; }
  }
  canReplaceState(state: GameState): boolean { return state === this.current; }
  exportRecovery(): string {
    const pendingRecovery = this.coordinator.exportRecovery();
    return !this.dirty && !this.encoding && pendingRecovery ? pendingRecovery : JSON.stringify({ schemaVersion: 1, scope: this.coordinator.scope,
      checkpoint: this.checkpoint, campaign: this.campaign, usageQuestions: [...this.questions.values()], pendingRecovery,
      priorRecovery: this.coordinator.confirmed?.priorRecovery ?? null });
  }
  detach(): void { this.stopped = true; if (this.journalDrain) this.coordinator.releaseJournalOwner(this.journalDrain.owner); this.journalDrain?.stop(); this.finishDurability(false); this.unbindDiagnostics(); this.unsubscribe(); this.unsubscribeReceipts(); this.unsubscribeRecovery(); this.unsubscribeAutomatic(); this.unsubscribeCheckpoint(); }
  dispose(): void { this.detach(); this.coordinator.dispose(); }
}
