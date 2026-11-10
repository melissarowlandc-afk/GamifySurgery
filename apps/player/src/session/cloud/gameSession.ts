import { problemDiagnostics, showCommandProblem } from "../../diagnostics/problemDiagnostics";
import { observePhoneClinic, phoneMemoryProfile } from "../../mobile/performance/phoneMemoryPolicy";
import { PROTOTYPE_DOMAIN_CONTEXT, createGameEvidenceCheckpoint, prepareGameEvidenceCheckpoint, prepareFacilityPathfinding, getRoomDefinition, applyGameEvidenceCommand, applyGameEvidenceBuildUndo, gameEvidenceDelta, type DomainContext, type GameCommand, type GameEvidenceCheckpoint, type GameEvidenceDelta, type GameState } from "@gamify-surgery/game-domain";
import { isFirstScoredAnswer } from "../../playtime/scoredQuestionUsage";
import type { QuestionUsageReceipt } from "../../playtime/usageTypes";
import type { LocalPrototypeProfile } from "../prototypeStorage";
import { type CloudCampaignMetadata } from "./codec";
import type { CloudSourceProvenance } from "./codecEvidence";
import type { VerifiedSessionSnapshot } from "./verifiedCopyCache";
import { CloudSyncCoordinator, type CloudCheckpointReason, type CloudSyncView } from "./coordinator";
import { logicalJsonText } from "./codecJson";
import { cloudCheckDeadline } from "./checkDeadline";
import { CloudSyncError, type SnapshotLineage } from "./transport";
import { SNAPSHOT_BASELINE, isSnapshotCopy } from "./snapshotCodec";
import type { CloudCompressedText } from "./codecCompression";
import { LocalJournalDrain, LOCAL_COMPACTION_MS, LOCAL_NATIVE_PREPARE_MS, LOCAL_SNAPSHOT_TAIL_LIMIT, freezeJournalCheckpoint, journalWorkerAddress } from "../localJournal";
import { CloudCacheError } from "./codecCache";
import { bindJournal, prepareJournal } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { completeSnapshotLearning } from "./snapshotLearning";
import { prepareSnapshotTick } from "./prepareSnapshotTick";
import { OperationalSessionEngine, type OperationalSessionOptions } from "./operationalSessionEngine";
import { OrderedSessionWork } from "./orderedSessionWork";
import { OperationalSessionView } from "./operationalSessionView";
import type { OperationalViewArguments } from "./operationalViewProjection";
import type { SessionActions } from "../sessionActions";

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
  private engine: OperationalSessionEngine | null = null;
  private readonly projectedView = new OperationalSessionView(args => this.engine?.setProjection(args));
  private readonly ordered = new OrderedSessionWork();
  private skippedClockPulses = 0;
  private lastWorkerWallMs: number | null = null;
  private lastCommandStages: Record<string, number> | null = null;
  private detached: Promise<void> | null = null;
  private detaching = false;
  private commandActions: SessionActions | null = null;
  private readonly unbindDiagnostics: () => void;
  private lastCommandMs: number | null = null;
  private lastCommandAt: number | null = null;
  private checkpoint: GameEvidenceCheckpoint;
  private current: GameState;
  private campaign: CloudCampaignMetadata;
  private pendingCampaign: CloudCampaignMetadata | null = null;
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
  private lastNativePreparation = -Infinity;
  private backgrounded = false;
  private lifecycleVersion = 0;
  private snapshotLineage: SnapshotLineage | null = null;
  private legacyBaseSnapshot: CloudCompressedText | undefined;
  private readonly unsubscribeCheckpoint: () => void;
  private constructor(readonly coordinator: CloudSyncCoordinator, loaded: VerifiedSessionSnapshot, parentSnapshotHashes: readonly string[],
    private readonly switchTo?: (campaignId: string) => Promise<void>, private readonly automaticReconnect?: (checked: boolean) => Promise<boolean>, prepareSynchronous = true) {
    this.checkpoint = freezeJournalCheckpoint(loaded.checkpoint); this.current = loaded.state; this.campaign = loaded.campaign; this.source = loaded.source;
    if (loaded.snapshotLineage && prepareSynchronous) {
      prepareGameEvidenceCheckpoint(this.checkpoint);
      prepareFacilityPathfinding(this.current.rooms, this.current.doors, id => getRoomDefinition(id));
    }
    if (loaded.snapshotLineage) {
      this.snapshotLineage = { ...loaded.snapshotLineage, branchId: crypto.randomUUID(),
        // The opened pending copy can become the account head after hydration.
        // Keep its exact hash as well as the previously confirmed ancestor.
        parents: [...new Set([...parentSnapshotHashes, ...loaded.snapshotLineage.parents])].slice(0, 4) };
      this.legacyBaseSnapshot = coordinator.pendingCandidate?.legacyBaseSnapshot;
    }
    showCommandProblem(null);
    this.boundRevision = coordinator.confirmedRevision!;
    this.unbindDiagnostics = problemDiagnostics.source("gameSession", () => ({ reloadRequired: this.reloadRequired,
      snapshotOnly: Boolean(this.snapshotLineage), journalTailCommands: this.engine?.head.sequence ?? this.checkpoint.snapshot.head.sequence, journalQueued: this.journalDrain?.queued ?? 0,
      operationalEngine: this.engine?.mode ?? "synchronous", commandPending: this.ordered.pending, skippedClockPulses: this.skippedClockPulses + (this.commandActions?.skippedClockPulses ?? 0), lastWorkerWallMs: this.lastWorkerWallMs,
      lastCommandStages: this.lastCommandStages ? Object.entries(this.lastCommandStages) : null,
      journalHighWater: this.journalDrain?.highWater ?? null, journalCommitted: this.journalDrain?.committed ?? null, journalRebasePending: this.journalDrain?.rebasePending ?? false,
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
    this.unsubscribeReceipts = coordinator.onAcknowledged(receipt => { this.boundRevision = receipt.revision; for (const id of receipt.usageReceiptIds) this.questions.delete(id); if (this.snapshotLineage) queueMicrotask(() => { if (!this.stopped) void this.rebaseTail(); }); });
    this.unsubscribeRecovery = coordinator.beforeReconnect(async () => await this.durable() || !this.dirty);
    this.unsubscribeCheckpoint = coordinator.beforeCheckpoint(reason => this.prepareCheckpoint(reason));
    this.unsubscribeAutomatic = automaticReconnect ? coordinator.onAutomaticSelection(() => this.reconnect()) : () => {};
  }
  static async create(coordinator: CloudSyncCoordinator, switchTo?: (campaignId: string) => Promise<void>, automaticReconnect?: (checked: boolean) => Promise<boolean>,
    options: { journal?: boolean; operational?: false | OperationalSessionOptions } = {}): Promise<CloudGameSession> {
    const confirmed = coordinator.confirmed;
    if (!confirmed || ["off", "checking", "blocked", "auth", "storage"].includes(coordinator.view.phase)) throw new Error("Open and verify the account campaign first.");
    if (coordinator.view.canExecute && !await coordinator.upgradeSnapshots()) throw new CloudSyncError("processing");
    const pending = coordinator.pendingCandidate;
    const openedSnapshot = pending?.snapshot ?? confirmed.snapshot;
    const loaded = await coordinator.codec.run({ kind: "hydrate", input: { snapshot: openedSnapshot,
      evidence: pending ? { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } : confirmed.evidence,
      revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: coordinator.scope.campaignId,
      expectedBaselineId: pending?.saveFormat === 3 ? SNAPSHOT_BASELINE : confirmed.baselineId,
      lineage: pending ? pending.lineage : confirmed.lineage } });
    // Hydrate the selected snapshot + committed journal first. Apply the same
    // additive concept defaults as local loading only at this playable boundary;
    // raw copies, checksums, lineage and every supplied review stay exact.
    const playable = loaded.snapshotLineage && coordinator.view.canExecute && !coordinator.hasPriorRecovery
      ? completeSnapshotLearning(loaded.state) : loaded.state;
    const adapted = playable !== loaded.state || Boolean(loaded.numberRepairs?.length);
    observePhoneClinic(playable.facilityLevel, playable.rooms.length);
    const useEngine = options.operational !== false && (typeof Worker !== "undefined" || Boolean(options.operational?.createPort));
    const session = new CloudGameSession(coordinator, adapted ? { ...loaded, state: playable,
      checkpoint: playable !== loaded.state ? createGameEvidenceCheckpoint(playable) : loaded.checkpoint } : loaded,
      [openedSnapshot.uncompressedSha256, confirmed.snapshot.uncompressedSha256], switchTo, automaticReconnect, !useEngine);
    const journal = coordinator.journal;
    if (journal && options.journal !== false && !coordinator.hasPriorRecovery && coordinator.view.canExecute) {
      try {
        const key = cloudCampaignStorageKey(coordinator.scope), owner = crypto.randomUUID();
        const head = await bindJournal(journal, key, owner, { checkpoint: session.checkpoint, campaign: loaded.campaign,
          ...(session.snapshotLineage ? { snapshotPolicy: { lineage: session.snapshotLineage, legacyBaseSnapshot: session.legacyBaseSnapshot } } : {}),
          source: loaded.source, confirmed, usageQuestions: [...session.questions.values()], writerGeneration: coordinator.journalWriterGeneration }, coordinator.codec);
        session.journalStart = head.highWater;
        session.compactedThrough = head.highWater;
        session.journalDrain = new LocalJournalDrain(journal, key, owner, head.highWater, error => coordinator.reportStorageRetry(error),
          rows => session.engine?.hashJournalRows(rows) ?? Promise.resolve(null));
        coordinator.bindJournalOwner(owner);
        session.journalDrain.onRecovered = () => { coordinator.confirmJournalDurability(); session.emit(); };
        session.journalDrain.onCommit = () => { coordinator.confirmJournalDurability(); session.emit();
          if (!session.backgrounded && (typeof document === "undefined" || document.visibilityState !== "hidden")) void session.warmPrepared();
        };
      } catch (error) { session.detach(); coordinator.reportLocalFailure(error); throw error; }
    }
    if (adapted) {
      // A small marker makes the durable adapted baseline eligible for the next
      // normal backup, without inventing a game command or a learning review.
      session.changeVersion++; session.dirty = true; session.queueLocal(); coordinator.noteLocalChange();
      if (playable !== loaded.state) problemDiagnostics.event("gameSession", "learning-catalog-adapted");
      for (const code of loaded.numberRepairs ?? []) problemDiagnostics.event("codec-repair", code);
      if (loaded.numberRepairs?.length) coordinator.requireFreshUploadHead();
    }
    if (useEngine) {
      // In recovery mode do not overlap the just-used codec realm and engine
      // startup heaps. IndexedDB and the verified returned seed remain intact.
      if (phoneMemoryProfile().mode === "reduced") coordinator.codec.releaseIdle?.();
      session.engine = await OperationalSessionEngine.create(session.checkpoint, session.current, PROTOTYPE_DOMAIN_CONTEXT, Boolean(session.snapshotLineage),
        { ...options.operational, adoptSharedSeed: true, useBundledContext: true,
          diagnose: code => { problemDiagnostics.event("operational-engine", code); options.operational && options.operational.diagnose?.(code); } });
    } else if (session.snapshotLineage) prepareSnapshotTick(session.checkpoint, session.current.paused, Date.now());
    return session;
  }
  private emit(): void { for (const listener of this.listeners) { try { listener(); } catch (error) { problemDiagnostics.error("session-observer", error); } } }
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  get needsReload(): boolean { return this.reloadRequired; }
  get syncView(): CloudSyncView {
    const view = this.coordinator.view, preparing = this.dirty || this.encoding || this.ordered.pending > 0 || Boolean(this.commandActions?.pending);
    return { ...view, checking: Boolean(view.checking || this.foregrounding || this.reconnecting), canExecute: this.canExecute, pending: view.pending || preparing,
      localDurable: view.localDurable && !this.commandActions?.pending && this.ordered.pending === 0 && (this.journalDrain ? !this.journalDrain.dirty : !preparing) };
  }
  private canAdmit(closing = false): boolean { return !this.stopped && !this.reloadRequired && (closing || !this.closing && !this.detaching) && this.ordered.pending + (this.journalDrain?.queued ?? 0) < 128 && (!this.journalDrain || this.journalDrain.canAccept) && this.coordinator.view.canExecute; }
  get canExecute(): boolean { return this.canAdmit(); }
  get canExecuteAction(): boolean { return this.canAdmit(this.commandActions?.activeAccepted === true); }
  bindCommandActions(actions: SessionActions): void { this.commandActions = actions; }
  executeControllerCommand(command: GameCommand, context: DomainContext, receipt?: () => QuestionUsageReceipt | null): GameState | null | Promise<GameState | null> {
    return this.engine ? this.executeAsync(command, context, receipt, this.commandActions?.activeAccepted === true) : this.execute(command, context, receipt);
  }
  /** Real clock pulses only. Explicit ADVANCE_TICK commands keep normal order. */
  advanceClock(command: Extract<GameCommand, { type: "ADVANCE_TICK" }>, context: DomainContext): Promise<GameState | null> {
    if (this.ordered.pending) { this.skippedClockPulses++; return Promise.resolve(null); }
    return this.executeAsync(command, context);
  }
  get commandPending(): boolean { return this.ordered.pending > 0; }
  get usesOperationalEngine(): boolean { return this.engine !== null; }
  get state(): GameState { return !this.reloadRequired && this.coordinator.view.canExecute ? this.current : { ...this.current, paused: true }; }
  get metadata(): CloudCampaignMetadata { return structuredClone(this.campaign); }
  playerView(state: GameState, ...args: OperationalViewArguments) { return this.projectedView.read(state, args); }

  execute(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null): GameState | null {
    if (this.engine) { problemDiagnostics.event("command", "async-boundary-required"); return null; }
    if (!this.canExecute) { problemDiagnostics.event("command", "refused"); this.emit(); return null; }
    if (this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(this.journalDrain.error ?? new CloudCacheError("transaction")); return null; }
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
  /** Clock pulses are intents until admitted: busy pulses never become commands.
   * Player commands reserve journal capacity and retain their admission order.
   */
  executeAsync(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null, admittedBeforeClose = false): Promise<GameState | null> {
    if (!this.engine) return Promise.resolve(this.execute(command, context, createQuestionReceipt));
    if (!this.canAdmit(admittedBeforeClose)) { problemDiagnostics.event("command", "refused"); this.emit(); return Promise.resolve(null); }
    const engine = this.engine, entry = engine.capture(command, context), writerGeneration = this.coordinator.journalWriterGeneration;
    const work = this.ordered.run(async () => {
      const before = this.current;
      try {
        const result = await engine.execute(entry), at = performance.now();
        if (result.replayed) return this.state;
        this.campaign = { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) };
        if (isFirstScoredAnswer(before, result.state, entry.command)) {
          try { const receipt = createQuestionReceipt?.(); if (receipt) this.questions.set(receipt.receipt_id, receipt); }
          catch (error) { problemDiagnostics.error("usage-receipt", error); }
        }
        this.queueLocalDelta(result.delta, entry.command.type === "ADVANCE_TICK", writerGeneration);
        this.projectedView.publish(result.state, result.viewArguments, result.view);
        this.current = result.state; this.changeVersion++; this.dirty = true;
        this.coordinator.noteLocalChange(); this.emit();
        this.lastCommandMs = result.timing.captureMs + result.timing.postMs + result.timing.publishMs + performance.now() - at;
        this.lastCommandStages = { ...result.timing, commitMs: performance.now() - at };
        this.lastWorkerWallMs = result.timing.elapsedMs; this.lastCommandAt = Date.now();
        const minutes = (entry.context.balanceRelease.clock.dayEndHour - entry.context.balanceRelease.clock.dayStartHour) * 60;
        if (Math.floor(before.facilityTick / minutes) < Math.floor(this.current.facilityTick / minutes)) void this.checkpointNow("day-end");
        else if (entry.command.type === "SET_PAUSED" && entry.command.paused) void this.durable();
        return this.state;
      } catch (error) {
        problemDiagnostics.error("command", error); showCommandProblem("That action could not be completed. Try again or send a problem report.");
        this.coordinator.reportLocalFailure(error); return null;
      }
    });
    this.emit(); void work.finally(() => this.emit()); return work;
  }
  private queueLocalDelta(delta: GameEvidenceDelta | null, tick: boolean, writerGeneration: string): void {
    if (!this.journalDrain) { this.scheduleFlush(); return; }
    this.journalDrain.acceptAdmitted({ delta, campaign: this.campaign, usageQuestions: [...this.questions.values()], writerGeneration }, tick);
  }
  updateMetadata(campaign: CloudCampaignMetadata): void {
    if (this.stopped || this.detaching && !this.commandActions?.activeAccepted || campaign.campaignId !== this.coordinator.scope.campaignId || !this.coordinator.view.canExecute ||
      logicalJsonText(JSON.parse(JSON.stringify({ ...campaign, updatedAtRealMs: 0 }))) ===
      logicalJsonText(JSON.parse(JSON.stringify({ ...(this.pendingCampaign ?? this.campaign), updatedAtRealMs: 0 })))) return;
    if (this.ordered.pending + (this.journalDrain?.queued ?? 0) >= 128 || this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(this.journalDrain?.error ?? new CloudCacheError("transaction")); return; }
    const captured = structuredClone(campaign), writerGeneration = this.coordinator.journalWriterGeneration;
    const apply = () => { this.campaign = captured; this.changeVersion++; this.dirty = true;
      if (this.pendingCampaign === captured) this.pendingCampaign = null;
      if (this.engine) this.queueLocalDelta(null, false, writerGeneration); else this.queueLocal(); this.coordinator.noteLocalChange(); };
    if (this.engine) { this.pendingCampaign = captured; void this.ordered.run(apply).catch(error => this.coordinator.reportLocalFailure(error)); } else apply();
  }
  private queueLocal(before?: GameEvidenceCheckpoint, tick = false): void {
    if (!this.journalDrain) { this.scheduleFlush(); return; }
    try { this.journalDrain.accept({ delta: before ? gameEvidenceDelta(before, this.checkpoint) : null,
      campaign: this.campaign, usageQuestions: [...this.questions.values()], writerGeneration: this.coordinator.journalWriterGeneration }, tick); }
    catch (error) { problemDiagnostics.error("journal", error); this.coordinator.reportStorageRetry(error); }
  }
  private warmPrepared(target = this.journalDrain?.committed ?? -1, force = false): Promise<boolean> {
    const drain = this.journalDrain;
    if (!drain || this.stopped) return Promise.resolve(false);
    if (this.warmThrough >= target) return Promise.resolve(true);
    if (this.snapshotLineage && !force && performance.now() - this.lastNativePreparation < LOCAL_NATIVE_PREPARE_MS) return Promise.resolve(false);
    if (this.warming) return this.warming.then(ok => ok && (this.warmThrough >= target || this.warmPrepared(target, force)));
    if (!force && performance.now() - this.lastWarmFailure < 60_000) return Promise.resolve(false);
    if (this.snapshotLineage) this.lastNativePreparation = performance.now();
    this.warming = this.coordinator.codec.run({ kind: "journalWarm", input: { address: journalWorkerAddress(drain.store, drain.key), owner: drain.owner } }).then(result => {
      this.warmThrough = result.through; this.lastWarmFailure = -Infinity; this.coordinator.preparationRecovered(); return true;
    }).catch(error => { this.lastWarmFailure = performance.now(); this.coordinator.reportPreparationFailure(error); return false; }).finally(() => {
      this.warming = null;
      if (!this.stopped && !this.backgrounded && drain.committed > this.warmThrough && performance.now() - this.lastWarmFailure >= 60_000) void this.warmPrepared();
    });
    return this.warming;
  }
  private async prepareCheckpoint(reason: CloudCheckpointReason, target?: number): Promise<boolean> {
    if (reason === "hidden" || reason === "pagehide") this.backgrounded = true;
    if (!this.journalDrain) return this.durable();
    // Capture the publication prefix before draining it. Commands arriving
    // during that drain retain their own rows; they cannot move this target
    // beyond the journal prefix whose durability we are actually awaiting.
    if (this.commandActions?.pending || this.ordered.pending) {
      try { await cloudCheckDeadline(this.commandsSettled()); }
      catch { this.coordinator.reportLocalFailure(new CloudSyncError("processing")); return false; }
    }
    target ??= this.changeVersion;
    if (!await this.durable()) return false;
    // Exit callbacks only drain small rows and use an already staged candidate.
    // The next open can rebuild the latest one from the committed journal.
    const leaving = reason === "hidden" || reason === "pagehide";
    if (leaving) {
      const ready = await this.journalDrain.store.prepared(this.journalDrain.key);
      if (!ready || ready.owner !== this.journalDrain.owner || ready.through < this.journalDrain.committed || ready.through - this.journalStart <= this.preparedVersion) return true;
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
      if (compact) {
        if (this.snapshotLineage) { if (!await this.rebaseTail()) return false; }
        else await prepareJournal(this.journalDrain!.store, this.journalDrain!.key, this.coordinator.codec, { compact: true, encode: false });
      }
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
        const captured = this.engine ? await this.ordered.run(async () => ({ checkpoint: await this.engine!.checkpoint(),
          state: this.current, version: this.changeVersion, campaign: this.campaign, usageQuestions: [...this.questions.values()], lineage: this.snapshotLineage })) : null;
        this.dirty = false;
        const version = captured?.version ?? this.changeVersion, checkpoint = captured?.checkpoint ?? this.checkpoint,
          campaign = captured?.campaign ?? this.campaign, usageQuestions = captured?.usageQuestions ?? [...this.questions.values()];
        // stage() checks and trims an exact newly acknowledged prefix if a
        // receipt lands during compression. The snapshot is revision-neutral;
        // do not restart a full encode whenever the account head advances.
        const confirmed = this.coordinator.encodingBase;
        if (!confirmed) return false;
        const baseLineage = captured ? captured.lineage : this.snapshotLineage;
        const lineage = baseLineage ? { ...baseLineage, sequence: baseLineage.sequence + checkpoint.snapshot.head.sequence } : null;
        const encoded = lineage ? await this.coordinator.codec.run({ kind: "snapshotEncode", input: { state: captured?.state ?? this.current, campaign,
          lineage } }) :
          await this.coordinator.codec.run({ kind: "encode", input: { checkpoint, campaign, source: this.source,
            operationId: "local-candidate", expectedRevision: confirmed.revision,
            acknowledgedEvidence: { headerSha256: confirmed.headerSha256, records: confirmed.records } } });
        if (this.stopped) return false;
        success = await this.coordinator.stage({ campaign, snapshot: encoded.snapshot, evidence: encoded.evidence,
          ...(lineage ? { saveFormat: 3, lineage,
            ...(!isSnapshotCopy(this.coordinator.confirmed!) ? { legacyBaseSnapshot: this.legacyBaseSnapshot } : {}) } : {}),
          usageQuestions: usageQuestions.filter(receipt => this.questions.has(receipt.receipt_id)) }, "ordinary", true);
        if (!success) { this.dirty = true; this.finishDurability(false); return false; }
        this.durableVersion = version; this.dirty = this.changeVersion > version; this.finishDurability(true);
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
  /** Ordered publication only. Ordinary clock/render observers must not turn
   * the250/1000ms journal policy into an immediate commit after every tick. */
  async commandsSettled(): Promise<void> {
    await this.commandActions?.settled(); await this.ordered.settled();
  }
  async durable(): Promise<boolean> {
    if (this.stopped) return false;
    // Capture the accepted prefix now. Later clock intents cannot extend it.
    if (this.commandActions?.pending || this.ordered.pending) {
      const actions = this.commandActions?.settled();
      try { if (actions) await cloudCheckDeadline(actions); await cloudCheckDeadline(this.ordered.settled()); }
      catch { this.coordinator.reportLocalFailure(new CloudSyncError("processing")); return false; }
    }
    if (this.journalDrain) {
      try { const ok = await cloudCheckDeadline(this.journalDrain.drain()); if (ok) this.coordinator.confirmJournalDurability(); return ok; }
      catch (error) { this.coordinator.reportStorageRetry(error instanceof CloudCacheError ? error : new CloudCacheError("timeout")); return false; }
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
    const notify = !this.canExecute;
    const version = this.lifecycleVersion;
    this.foregrounding = (async () => {
      const checked = await this.coordinator.foreground(online);
      if (this.stopped || this.closing || version !== this.lifecycleVersion) return false;
      return checked === null || this.needsReload ? this.reconnect() : checked;
    })().finally(() => { this.foregrounding = null; if (notify || !this.canExecute) this.emit(); });
    if (notify) this.emit();
    return this.foregrounding;
  }
  reconnect(): Promise<boolean> {
    // Foregrounding an account clinic, including after Save & Close, goes
    // through the router's full automatic selection and fencing. Recovery
    // export stays stable; a bare coordinator has no authority to reopen itself.
    if (this.stopped || this.closing || this.coordinator.view.phase === "closed" && !this.automaticReconnect ||
      this.coordinator.hasPriorRecovery) return Promise.resolve(false);
    if (this.reconnecting) return this.reconnecting;
    const notify = !this.canExecute;
    this.reconnecting = this.reconnectChecked().finally(() => { this.reconnecting = null; if (notify || !this.canExecute) this.emit(); });
    if (notify) this.emit();
    return this.reconnecting;
  }
  private async reconnectChecked(): Promise<boolean> {
    const version = this.lifecycleVersion;
    const current = () => !this.stopped && !this.closing && version === this.lifecycleVersion;
    // Finish persisting commands already accepted before changing lease/base.
    // A failed write remains in coordinator.attempted for its quota retry.
    try { if (!await cloudCheckDeadline(this.durable()) && (this.journalDrain || this.coordinator.view.failure === "processing")) return false; }
    catch {
      if (current()) this.coordinator.reportLocalFailure(new CloudSyncError("processing"));
      return false;
    }
    if (!current()) return false;
    const checked = await this.coordinator.focus();
    if (!current()) return false;
    if (checked && !this.needsReload && this.dirty) {
      if (!await this.prepareCheckpoint("ordinary") || !await this.coordinator.checkpoint("purchase")) return false;
    }
    if (!current()) return false;
    return this.automaticReconnect ? this.automaticReconnect(checked && !this.needsReload) : checked;
  }
  async checkpointNow(reason: CloudCheckpointReason): Promise<boolean> {
    if (reason === "hidden" || reason === "pagehide") this.backgrounded = true;
    if (!await this.durable()) return false;
    return this.coordinator.checkpoint(reason);
  }
  /** Explicit support/import boundary: materialize local recovery without RPC. */
  prepareRecoveryCopy(): Promise<boolean> { return this.prepareCheckpoint("campaign-switch"); }
  /** Move records are only a crash-recovery tail. A full current-state baseline
   * replaces them at bounded boundaries; FSRS/clinical/world state is retained. */
  private rebaseTail(): Promise<boolean> {
    if (!this.snapshotLineage || this.stopped) return Promise.resolve(true);
    if (this.compacting) return this.compacting.then(() => !this.journalDrain?.error);
    const drain = this.journalDrain;
    if (drain?.rebasePending) return drain.drain();
    if (this.engine) {
      const engine = this.engine;
      const work = this.ordered.run(async () => {
        const lineage = { ...this.snapshotLineage!, sequence: this.snapshotLineage!.sequence + engine.head.sequence };
        const checkpoint = await engine.compact();
        this.snapshotLineage = lineage; this.checkpoint = checkpoint;
        if (!drain) { this.lastCompaction = performance.now(); return true; }
        const target = drain.highWater;
        const seed = { checkpoint, campaign: this.campaign, source: this.source, confirmed: this.coordinator.confirmed,
          usageQuestions: [...this.questions.values()], writerGeneration: this.coordinator.journalWriterGeneration,
          snapshotPolicy: { lineage, ...(!isSnapshotCopy(this.coordinator.confirmed!) ? { legacyBaseSnapshot: this.legacyBaseSnapshot } : {}) } };
        const ok = await drain.rebase(through => this.coordinator.codec.run({ kind: "journalRebase", input: {
          address: journalWorkerAddress(drain.store, drain.key), owner: drain.owner, through, seed } }));
        if (ok) { this.compactedThrough = target; this.lastCompaction = performance.now(); }
        return ok;
      }).catch(error => { this.coordinator.reportPreparationFailure(error); return false; });
      this.compacting = work.then(() => {});
      void this.compacting.finally(() => { this.compacting = null; }).catch(() => {});
      return work;
    }
    const lineage = { ...this.snapshotLineage, sequence: this.snapshotLineage.sequence + this.checkpoint.snapshot.head.sequence };
    const checkpoint = freezeJournalCheckpoint(createGameEvidenceCheckpoint(this.current));
    prepareGameEvidenceCheckpoint(checkpoint);
    this.snapshotLineage = lineage; this.checkpoint = checkpoint;
    if (!drain) { this.lastCompaction = performance.now(); return Promise.resolve(true); }
    const seed = { checkpoint, campaign: this.campaign, source: this.source, confirmed: this.coordinator.confirmed,
      usageQuestions: [...this.questions.values()], writerGeneration: this.coordinator.journalWriterGeneration,
      snapshotPolicy: { lineage, ...(!isSnapshotCopy(this.coordinator.confirmed!) ? { legacyBaseSnapshot: this.legacyBaseSnapshot } : {}) } };
    const target = drain.highWater;
    const work = drain.rebase(through => this.coordinator.codec.run({ kind: "journalRebase", input: {
      address: journalWorkerAddress(drain.store, drain.key), owner: drain.owner, through, seed } }));
    this.compacting = work.then(ok => { if (ok) { this.compactedThrough = target; this.lastCompaction = performance.now(); } });
    void this.compacting.finally(() => { this.compacting = null; }).catch(() => {});
    return work;
  }
  async pulse(): Promise<void> {
    await this.coordinator.pulse();
    if (typeof document !== "undefined" && document.visibilityState === "visible") this.backgrounded = false;
    const drain = this.journalDrain;
    if (drain && !this.stopped && !this.backgrounded && drain.committed > this.warmThrough && performance.now() - this.lastWarmFailure >= 60_000) void this.warmPrepared();
    const tailAtLimit = this.snapshotLineage && (this.engine?.head.sequence ?? this.checkpoint.snapshot.head.sequence) >= LOCAL_SNAPSHOT_TAIL_LIMIT;
    if (!drain || this.stopped || this.flushing || this.compacting || drain.highWater <= this.compactedThrough ||
      (!tailAtLimit && performance.now() - this.lastCompaction < LOCAL_COMPACTION_MS) || performance.now() - this.lastCompactionAttempt < 60_000) return;
    this.lastCompactionAttempt = performance.now();
    if (this.snapshotLineage) { await this.rebaseTail(); return; }
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
    if (this.engine) {
      this.commandActions?.pauseAdmissions(); this.lifecycleVersion++;
      const acceptedActions = this.commandActions?.settled();
      this.closing = (async () => {
        await acceptedActions; await this.ordered.settled();
        if (!this.current.paused && !await this.executeAsync({ type: "SET_PAUSED", paused: true, operationId: crypto.randomUUID() }, context, undefined, true)) return false;
        if (!await this.durable() || !await this.prepareCheckpoint("save-close")) return false;
        return this.coordinator.saveAndClose();
      })().finally(() => { this.closing = null; this.commandActions?.resumeAdmissions(); this.emit(); });
      this.emit(); return this.closing;
    }
    // Stop live ticks before awaiting encoding; routine recovery work never pauses play.
    const paused = this.engine ? this.executeAsync({ type: "SET_PAUSED", paused: true, operationId: crypto.randomUUID() }, context)
      : Promise.resolve(this.current.paused ? this.current : this.execute({ type: "SET_PAUSED", paused: true, operationId: crypto.randomUUID() }, context));
    // A completed close also cancels older foreground/router continuations;
    // checking only `closing` misses them after the close promise settles.
    this.lifecycleVersion++;
    this.closing = (async () => {
      if (!await paused) return false;
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
    if (this.engine) { problemDiagnostics.event("command", "async-boundary-required"); return null; }
    if (!this.canExecute) { problemDiagnostics.event("command", "refused"); this.emit(); return null; }
    if (this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(this.journalDrain.error ?? new CloudCacheError("transaction")); return null; }
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
  undoBuildAsync(state: GameState): Promise<GameState | null> {
    if (!this.engine) return Promise.resolve(this.undoBuild(state));
    if (!this.canExecuteAction) return Promise.resolve(null);
    const target = structuredClone(state), engine = this.engine, operationId = crypto.randomUUID(), writerGeneration = this.coordinator.journalWriterGeneration;
    return this.ordered.run(async () => {
      try {
        const result = await engine.undo(target, operationId);
        if (result.replayed) return this.state;
        this.campaign = { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) };
        this.queueLocalDelta(result.delta, false, writerGeneration);
        this.projectedView.publish(result.state, result.viewArguments, result.view);
        this.current = result.state; this.changeVersion++; this.dirty = true; this.coordinator.noteLocalChange(); this.emit();
        return this.state;
      } catch (error) { this.coordinator.reportLocalFailure(error); return null; }
    }).finally(() => this.emit());
  }
  async exportRecoveryAsync(): Promise<string> {
    await this.commandActions?.settled();
    return this.ordered.run(async () => {
      if (this.engine) this.checkpoint = await this.engine.checkpoint();
      return this.exportRecovery();
    });
  }
  exportRecovery(): string {
    const pendingRecovery = this.coordinator.exportRecovery();
    return !this.dirty && !this.encoding && pendingRecovery ? pendingRecovery : JSON.stringify({ schemaVersion: 1, scope: this.coordinator.scope,
      checkpoint: this.checkpoint, campaign: this.campaign, usageQuestions: [...this.questions.values()], pendingRecovery,
      priorRecovery: this.coordinator.confirmed?.priorRecovery ?? null });
  }
  detach(): void {
    if (this.stopped || this.detaching) return;
    this.detaching = true; this.commandActions?.pauseAdmissions(); this.lifecycleVersion++;
    this.unbindDiagnostics(); this.unsubscribe(); this.unsubscribeReceipts(); this.unsubscribeRecovery(); this.unsubscribeAutomatic(); this.unsubscribeCheckpoint();
    const cleanup = () => { this.stopped = true; if (this.journalDrain) this.coordinator.releaseJournalOwner(this.journalDrain.owner);
      this.journalDrain?.stop(); this.engine?.dispose(); this.finishDurability(false); };
    if (!this.engine && !this.ordered.pending) { cleanup(); return; }
    this.detached = (this.commandActions?.settled() ?? Promise.resolve()).then(() => this.ordered.settled()).then(async () => {
      // Router replacement/unmount cannot terminate an admitted in-flight
      // command before its original journal owner has persisted the result.
      if (this.journalDrain && !await this.journalDrain.drain()) return;
      cleanup();
    }).catch(error => { this.coordinator.reportStorageRetry(error); });
  }
  dispose(): void { this.detach(); if (this.detached) void this.detached.then(() => this.coordinator.dispose()); else this.coordinator.dispose(); }
}
