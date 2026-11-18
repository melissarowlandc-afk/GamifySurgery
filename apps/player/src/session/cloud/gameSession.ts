import { ensureRuntimeCatalogue } from "../../mobile/performance/runtimeCatalogue";
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
import { CloudCodecError, logicalJsonText, type CodecJson } from "./codecJson";
import { equalParsedJson } from "./codecWorkerJsonEqual";
import { cloudCheckDeadline } from "./checkDeadline";
import { CloudSyncError, type SnapshotLineage } from "./transport";
import { SNAPSHOT_BASELINE, isSnapshotCopy, readSnapshotLineage } from "./snapshotCodec";
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
import { IdleWorkerRelease } from "../../mobile/performance/idleWorkerRelease";
import { CommandFailureBackoff, commandProgrammingFailure, commandSource, encodeCommandFailure, safeCommandType,
  type CommandExecutionFailure, type CommandStage, type FailureIntent } from "./commandFailure";
import type { OperationalEngineResult } from "./operationalEngineProtocol";

type CommandResult = Pick<OperationalEngineResult, "state" | "replayed" | "view" | "viewArguments"> & {
  checkpoint?: GameEvidenceCheckpoint; delta?: GameEvidenceDelta | null;
};
type CommandPublication = { result: CommandResult; campaign: CloudCampaignMetadata; questions: readonly QuestionUsageReceipt[]; followup: "day-end" | "durable" | null };

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
  private readonly idleWorker = new IdleWorkerRelease(() => this.releaseIdleEngine());
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
  private requestedReplacement: string | null = null;
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
  // The adapted baseline is durable before play. Optional candidate warming
  // must not restart the codec beside an unpublished engine initialization.
  private opening = true;
  private lifecycleVersion = 0;
  private readonly commandBackoff = new CommandFailureBackoff();
  private lastCommandFailure: { type: string; stage: CommandStage; errorClass: string; source: string } | null = null;
  private repairingCommand: Promise<boolean> | null = null;
  private commandRepair: { publication: CommandPublication; finish(): void; nextRetry: number; attempts: number } | null = null;
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
      commandAge: this.lastCommandAt === null ? null : Date.now() - this.lastCommandAt,
      commandFailure: this.lastCommandFailure ? Object.entries(this.lastCommandFailure) : null, commandFailureSkips: this.commandBackoff.skipped, commandRecovering: this.commandRepair !== null }));
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
    options: { journal?: boolean; operational?: false | OperationalSessionOptions;
      initialProjection?: (state: GameState) => OperationalViewArguments } = {}): Promise<CloudGameSession> {
    const confirmed = coordinator.confirmed;
    if (!confirmed || ["off", "checking", "blocked", "auth", "storage"].includes(coordinator.view.phase)) throw new Error("Open and verify the account campaign first.");
    if (coordinator.view.canExecute && !await coordinator.upgradeSnapshots()) throw new CloudSyncError("processing");
    const pending = coordinator.pendingCandidate;
    const openedSnapshot = pending?.snapshot ?? confirmed.snapshot;
    const hydrateInput = { snapshot: openedSnapshot,
      evidence: pending ? { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } : confirmed.evidence,
      revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: coordinator.scope.campaignId,
      expectedBaselineId: pending?.saveFormat === 3 ? SNAPSHOT_BASELINE : confirmed.baselineId,
      lineage: pending ? pending.lineage : confirmed.lineage };
    let loaded = await coordinator.codec.run({ kind: "hydrate", input: { ...hydrateInput,
      preparePlayable: coordinator.view.canExecute && !coordinator.hasPriorRecovery } });
    // Authority may change while the worker runs. A now-read-only opening must
    // still show the raw selected copy rather than an adapted playable seed.
    if (loaded.learningAdapted && (!coordinator.view.canExecute || coordinator.hasPriorRecovery))
      loaded = await coordinator.codec.run({ kind: "hydrate", input: hydrateInput });
    let localCapacity = false, recoveredUsage: readonly QuestionUsageReceipt[] = [];
    if (coordinator.hasOverCapacityJournal && coordinator.view.canExecute && !coordinator.hasPriorRecovery && coordinator.journal) {
      // No cloud candidate could represent this verified durable journal. Re-read
      // and validate it before binding a compacted session-owned baseline. Never
      // restore it over another account head, newer selected copy or local writer.
      const local = await prepareJournal(coordinator.journal, cloudCampaignStorageKey(coordinator.scope), coordinator.codec, { local: true, encode: false });
      const seed = local?.seed, policy = seed?.snapshotPolicy;
      if (!seed || !policy || !local.state || !loaded.snapshotLineage ||
        seed.confirmed?.revision !== confirmed.revision || seed.confirmed.snapshot.uncompressedSha256 !== confirmed.snapshot.uncompressedSha256 ||
        seed.campaign.campaignId !== coordinator.scope.campaignId || await coordinator.journalChangedSinceOpen()) throw new CloudCacheError("conflict");
      const lineage = readSnapshotLineage({ ...policy.lineage, sequence: policy.lineage.sequence + seed.checkpoint.snapshot.head.sequence });
      if (lineage.sequence < loaded.snapshotLineage.sequence ||
        lineage.branchId !== loaded.snapshotLineage.branchId && !lineage.parents.includes(confirmed.snapshot.uncompressedSha256)) throw new CloudCacheError("conflict");
      const state = completeSnapshotLearning(local.state);
      localCapacity = true; // The worker deferred only a verified post-compaction size failure.
      loaded = { ...loaded, state, campaign: seed.campaign, snapshotLineage: lineage,
        checkpoint: createGameEvidenceCheckpoint(state), learningAdapted: true };
      recoveredUsage = seed.usageQuestions;
    }
    // Hydrate the selected snapshot + committed journal first. Apply the same
    // additive concept defaults as local loading only at this playable boundary;
    // raw copies, checksums, lineage and every supplied review stay exact.
    const playable = loaded.snapshotLineage && coordinator.view.canExecute && !coordinator.hasPriorRecovery
      ? completeSnapshotLearning(loaded.state) : loaded.state;
    const learningAdapted = Boolean(loaded.learningAdapted) || playable !== loaded.state;
    const adapted = learningAdapted || Boolean(loaded.numberRepairs?.length);
    observePhoneClinic(playable.facilityLevel, playable.rooms.length);
    const useEngine = options.operational !== false && (typeof Worker !== "undefined" || Boolean(options.operational?.createPort));
    if (!useEngine) await ensureRuntimeCatalogue();
    const session = new CloudGameSession(coordinator, adapted ? { ...loaded, state: playable,
      checkpoint: playable !== loaded.state ? createGameEvidenceCheckpoint(playable) : loaded.checkpoint } : loaded,
      [openedSnapshot.uncompressedSha256, confirmed.snapshot.uncompressedSha256], switchTo, automaticReconnect, !useEngine);
    for (const receipt of recoveredUsage) session.questions.set(receipt.receipt_id, receipt);
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
          if (!session.commandRepair && !session.opening && !session.backgrounded && (typeof document === "undefined" || document.visibilityState !== "hidden")) void session.warmPrepared();
        };
      } catch (error) { session.detach(); coordinator.reportLocalFailure(error); throw error; }
    }
    if (adapted) {
      // A small marker makes the durable adapted baseline eligible for the next
      // normal backup, without inventing a game command or a learning review.
      session.changeVersion++; session.dirty = true; session.queueLocal(); coordinator.noteLocalChange();
      if (learningAdapted) problemDiagnostics.event("gameSession", "learning-catalog-adapted");
      for (const code of loaded.numberRepairs ?? []) problemDiagnostics.event("codec-repair", code);
      if (loaded.numberRepairs?.length) coordinator.requireFreshUploadHead();
    }
    if (localCapacity) coordinator.reportPreparationFailure(new CloudCodecError("capacity", "Current clinic exceeds the snapshot limit."));
    if (useEngine) {
      // In recovery mode do not overlap the just-used codec realm and engine
      // startup heaps. IndexedDB and the verified returned seed remain intact.
      if (phoneMemoryProfile().mode === "reduced") coordinator.codec.releaseIdle?.();
      session.engine = await OperationalSessionEngine.create(session.checkpoint, session.current, PROTOTYPE_DOMAIN_CONTEXT, Boolean(session.snapshotLineage),
        { ...options.operational, ...(options.initialProjection ? { initialProjection: options.initialProjection(session.current) } : {}),
          adoptSharedSeed: true, useBundledContext: true,
          diagnose: code => { problemDiagnostics.event("operational-engine", code); options.operational && options.operational.diagnose?.(code); } });
      const projection = session.engine.initialProjection;
      if (projection) session.projectedView.publish(session.current, projection.args, projection.view);
    } else if (session.snapshotLineage) prepareSnapshotTick(session.checkpoint, session.current.paused, Date.now());
    session.opening = false;
    session.updateIdleWorker();
    return session;
  }
  private updateIdleWorker(): void {
    this.idleWorker.update(!this.stopped && !this.detaching && this.engine?.mode === "worker" && this.journalDrain &&
      phoneMemoryProfile().mode === "reduced" && (this.current.paused || this.backgrounded) ? this.changeVersion : null);
  }
  private releaseIdleEngine(): Promise<boolean> {
    return this.ordered.run(async () => {
      const engine = this.engine, drain = this.journalDrain;
      if (this.stopped || this.detaching || !engine || engine.mode !== "worker") return true;
      if (!drain || phoneMemoryProfile().mode !== "reduced" || !this.current.paused && !this.backgrounded) return true;
      if (this.flushing || this.compacting || !await drain.drain()) return false;
      // Hash/commit work is complete before termination. No RPC, new operation
      // ID, pause command or save-policy boundary is invented here.
      const released = await engine.park();
      if (released) this.coordinator.codec.releaseIdle?.();
      return released;
    });
  }
  private emit(): void { this.updateIdleWorker(); for (const listener of this.listeners) { try { listener(); } catch (error) { problemDiagnostics.error("session-observer", error); } } }
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  get needsReload(): boolean { return this.reloadRequired; }
  get syncView(): CloudSyncView {
    const view = this.coordinator.view, preparing = this.dirty || this.encoding || this.ordered.pending > 0 || Boolean(this.commandActions?.pending);
    const localDurable = view.localDurable && !this.commandActions?.pending && this.ordered.pending === 0 && (this.journalDrain ? !this.journalDrain.dirty : !preparing);
    return { ...view, checking: Boolean(view.checking || (!this.journalDrain || !localDurable) && (this.foregrounding || this.reconnecting)), canExecute: this.canExecute, pending: view.pending || preparing,
      localDurable };
  }
  private canAdmit(closing = false): boolean { return !this.stopped && !this.reloadRequired && (closing || !this.closing && !this.detaching) && this.ordered.pending + (this.journalDrain?.queued ?? 0) < 128 && (!this.journalDrain || this.journalDrain.canAccept) && this.coordinator.view.canExecute; }
  get canExecute(): boolean { return this.canAdmit(); }
  get canExecuteAction(): boolean { return this.canAdmit(this.commandActions?.activeAccepted === true); }
  bindCommandActions(actions: SessionActions): void { this.commandActions = actions; }
  executeControllerCommand(command: GameCommand, context: DomainContext, receipt?: () => QuestionUsageReceipt | null): GameState | null | Promise<GameState | null> {
    if (this.engine) return this.executeAsync(command, context, receipt, this.commandActions?.activeAccepted === true);
    const priorRepair = this.repairingCommand, result = this.execute(command, context, receipt);
    return !priorRepair && this.repairingCommand ? this.repairingCommand.then(ok => ok ? this.state : null) : result;
  }
  /** Real clock pulses only. Explicit ADVANCE_TICK commands keep normal order. */
  advanceClock(command: Extract<GameCommand, { type: "ADVANCE_TICK" }>, context: DomainContext): Promise<GameState | null> {
    if (this.ordered.pending || this.journalDrain?.committing) { this.skippedClockPulses++; return Promise.resolve(null); }
    return this.executeAsync(command, context, undefined, false, true);
  }
  get commandPending(): boolean { return this.ordered.pending > 0; }
  get usesOperationalEngine(): boolean { return this.engine !== null; }
  get state(): GameState { return !this.reloadRequired && this.coordinator.view.canExecute ? this.current : { ...this.current, paused: true }; }
  get metadata(): CloudCampaignMetadata { return structuredClone(this.campaign); }
  playerView(state: GameState, ...args: OperationalViewArguments) { return this.projectedView.read(state, args); }

  execute(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null, clock = false): GameState | null {
    if (this.engine) { problemDiagnostics.event("command", "async-boundary-required"); return null; }
    if (!this.canExecute) { problemDiagnostics.event("command", "refused"); this.emit(); return null; }
    if (this.commandBackoff.blocked(command, this.changeVersion)) return null;
    if (this.journalDrain && !this.journalDrain.canAccept) { this.coordinator.reportLocalFailure(this.journalDrain.error ?? new CloudCacheError("transaction")); return null; }
    const before = this.current;
    const priorCheckpoint = this.checkpoint;
    let stage: CommandStage = "execute", publication: CommandPublication | null = null;
    const highWater = this.journalDrain?.admissionSerial;
    const started = performance.now();
    try {
      const result = applyGameEvidenceCommand(priorCheckpoint, command, context);
      if (result.replayed) return this.state;
      stage = "diff";
      publication = this.prepareCommandPublication({ ...result, delta: gameEvidenceDelta(priorCheckpoint, result.checkpoint) }, before, command, context, createQuestionReceipt);
      stage = "journal";
      this.admitCommandPublication(publication, command.type === "ADVANCE_TICK", this.coordinator.journalWriterGeneration, clock);
      stage = "publication";
      this.publishCommand(publication);
      stage = "followup";
      this.finishCommand(publication);
      this.commandBackoff.success(); return this.current;
    } catch (error) {
      const admitted = publication !== null && (this.current !== before || Boolean(this.journalDrain && this.journalDrain.admissionSerial !== highWater));
      if (!this.recordCommandFailure(error, command, stage, !admitted)) return null;
      if (admitted && publication) { void this.repairCommand(publication); return null; }
      this.checkpoint = priorCheckpoint; this.current = before; return null;
    }
    finally { this.lastCommandMs = Math.round(performance.now() - started); this.lastCommandAt = Date.now(); }
  }
  /** Clock pulses are intents until admitted: busy pulses never become commands.
   * Player commands reserve journal capacity and retain their admission order.
   */
  executeAsync(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null, admittedBeforeClose = false, clock = false): Promise<GameState | null> {
    if (!this.engine) {
      if (!clock) return Promise.resolve(this.executeControllerCommand(command, context, createQuestionReceipt));
      const priorRepair = this.repairingCommand, result = this.execute(command, context, createQuestionReceipt, true);
      return !priorRepair && this.repairingCommand ? this.repairingCommand.then(ok => ok ? this.state : null) : Promise.resolve(result);
    }
    if (!this.canAdmit(admittedBeforeClose)) { problemDiagnostics.event("command", "refused"); this.emit(); return Promise.resolve(null); }
    if (this.commandBackoff.blocked(command, this.changeVersion)) return Promise.resolve(null);
    const engine = this.engine, writerGeneration = this.coordinator.journalWriterGeneration;
    let entry: ReturnType<OperationalSessionEngine["capture"]>;
    try { entry = engine.capture(command, context); }
    catch (error) { this.recordCommandFailure(error, command, "capture"); return Promise.resolve(null); }
    const work = this.ordered.run(async () => {
      if (this.commandRepair && !await this.repairCommand()) return null;
      if (this.commandBackoff.blocked(entry.command, this.changeVersion)) return null;
      const before = this.current;
      const prior = engine.recoveryPoint(), highWater = this.journalDrain?.admissionSerial;
      let stage: CommandStage = "execute", publication: CommandPublication | null = null;
      try {
        const result = await engine.execute(entry), at = performance.now();
        if (result.replayed) return this.state;
        stage = "projection";
        this.projectedView.publish(result.state, result.viewArguments, result.view);
        publication = this.prepareCommandPublication(result, before, entry.command, entry.context, createQuestionReceipt);
        stage = "journal";
        this.admitCommandPublication(publication, entry.command.type === "ADVANCE_TICK", writerGeneration, clock);
        stage = "publication";
        this.publishCommand(publication);
        this.lastCommandMs = result.timing.captureMs + result.timing.postMs + result.timing.publishMs + performance.now() - at;
        this.lastCommandStages = { ...result.timing, commitMs: performance.now() - at };
        this.lastWorkerWallMs = result.timing.elapsedMs; this.lastCommandAt = Date.now();
        stage = "followup";
        this.finishCommand(publication);
        this.commandBackoff.success();
        return this.state;
      } catch (error) {
        const admitted = publication !== null && (this.current !== before || Boolean(this.journalDrain && this.journalDrain.admissionSerial !== highWater));
        if (!this.recordCommandFailure(error, entry.command, stage, !admitted)) return null;
        if (admitted && publication) return await this.repairCommand(publication) ? this.state : null;
        engine.restore(prior); return null;
      }
    });
    this.emit(); void work.finally(() => this.emit()); return work;
  }
  private recordCommandFailure(error: unknown, command: FailureIntent, stage: CommandStage, refused = true): CommandExecutionFailure | null {
    const failure = commandProgrammingFailure(error, stage, "session");
    if (!failure) {
      problemDiagnostics.error("command", error); this.coordinator.reportLocalFailure(error); return null;
    }
    const type = safeCommandType(command.type), info = failure.info;
    this.lastCommandFailure = { type, stage: info.stage, errorClass: info.errorClass, source: commandSource(info) };
    if (this.commandBackoff.failed(command, this.changeVersion)) {
      problemDiagnostics.event("command-failure", `${type}-${encodeCommandFailure(failure)}`);
      // An admitted action may already have taken effect. Do not invite the
      // player to repeat it while its durable result is being reconciled.
      if (refused) showCommandProblem("That action did not finish. Please try it again.", "warning");
    }
    return failure;
  }
  private prepareCommandPublication(result: CommandResult, before: GameState, command: GameCommand, context: DomainContext, receipt?: () => QuestionUsageReceipt | null): CommandPublication {
    const minutes = (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
    const followup = Math.floor(before.facilityTick / minutes) < Math.floor(result.state.facilityTick / minutes) ? "day-end"
      : command.type === "SET_PAUSED" && command.paused ? "durable" : null;
    const questions = [...this.questions.values()];
    if (isFirstScoredAnswer(before, result.state, command)) {
      try { const value = receipt?.(); if (value && !questions.some(row => row.receipt_id === value.receipt_id)) questions.push(value); }
      catch (error) { problemDiagnostics.error("usage-receipt", error); }
    }
    return { result, campaign: { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) }, questions, followup };
  }
  private admitCommandPublication(publication: CommandPublication, tick: boolean, writerGeneration: string, clock = false): void {
    if (!this.journalDrain) return; // Full-snapshot fallback stages after publication.
    this.journalDrain.acceptAdmitted({ delta: publication.result.delta ?? null, campaign: publication.campaign,
      usageQuestions: [...publication.questions], writerGeneration }, tick, clock);
  }
  private publishCommand(publication: CommandPublication): void {
    const { result, campaign, questions } = publication;
    if (result.checkpoint) this.checkpoint = result.checkpoint;
    this.current = result.state; this.campaign = campaign;
    for (const receipt of questions) this.questions.set(receipt.receipt_id, receipt);
    this.changeVersion = this.journalDrain ? this.journalDrain.highWater - this.journalStart : this.changeVersion + 1; this.dirty = true;
    if (!this.journalDrain) this.scheduleFlush();
    this.coordinator.noteLocalChange(); this.emit();
  }
  private finishCommand(publication: CommandPublication): void {
    const action = publication.followup; publication.followup = null;
    if (action === "day-end") void this.checkpointNow("day-end");
    else if (action === "durable") void this.durable();
  }
  /** Called inside the command barrier (or the synchronous controller's repair
   * promise). Never wait on durable()/ordered.settled() from this boundary. */
  private repairCommand(publication?: CommandPublication): Promise<boolean> {
    if (publication && !this.commandRepair) this.commandRepair = { publication, finish: this.coordinator.beginCommandRecovery(), nextRetry: 0, attempts: 0 };
    if (this.repairingCommand) return this.repairingCommand;
    const job = this.commandRepair;
    if (!job) return Promise.resolve(true);
    if (Date.now() < job.nextRetry) return Promise.resolve(false);
    this.repairingCommand = (async () => {
      // A transient programming fault in a recovery adapter gets one bounded
      // immediate retry. Persistent faults wait for pulse/explicit recovery.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (this.stopped) return false;
          const drain = this.journalDrain;
          if (drain) {
            if (!await drain.drain()) return false; // Storage failures already own their real fence.
            const head = await drain.store.head(drain.key);
            if (!head || head.owner !== drain.owner || head.highWater !== drain.committed) throw new CloudCacheError("conflict");
            const prepared = await prepareJournal(drain.store, drain.key, this.coordinator.codec, { local: true, encode: false });
            if (!prepared?.seed || !prepared.state || prepared.through !== head.highWater) throw new CloudCacheError("checksum");
            if (this.stopped || this.commandRepair !== job) return false;
            this.installCommandPrefix(prepared.seed.checkpoint, prepared.state, prepared.seed.campaign, prepared.seed.usageQuestions);
            if (prepared.seed.snapshotPolicy) this.snapshotLineage = prepared.seed.snapshotPolicy.lineage;
            this.changeVersion = Math.max(this.changeVersion, prepared.through - this.journalStart);
            this.durableVersion = this.changeVersion;
          } else {
            await this.repairSnapshotCommand(job.publication);
            if (this.stopped || this.commandRepair !== job) return false;
          }
          this.dirty = this.changeVersion > this.preparedVersion;
          this.coordinator.confirmJournalDurability(); this.coordinator.noteLocalChange(this.dirty);
          this.finishCommand(job.publication);
          this.commandBackoff.success(); this.commandRepair = null; job.finish(); this.emit(); return true;
        } catch (error) {
          const failure = commandProgrammingFailure(error, "recovery", "session");
          if (!failure) { this.coordinator.reportLocalFailure(error); return false; }
          this.lastCommandFailure = { type: this.lastCommandFailure?.type ?? "UNKNOWN", stage: "recovery", errorClass: failure.info.errorClass, source: commandSource(failure.info) };
          if (attempt === 0) continue;
        }
      }
      return false;
    })().then(ok => {
      if (!ok && this.commandRepair === job) job.nextRetry = Date.now() + Math.min(60_000, 5000 * 2 ** Math.min(job.attempts++, 4));
      return ok;
    }).finally(() => { this.repairingCommand = null; this.emit(); });
    return this.repairingCommand;
  }
  private installCommandPrefix(checkpoint: GameEvidenceCheckpoint, state: GameState, campaign: CloudCampaignMetadata, questions: readonly QuestionUsageReceipt[]): void {
    this.checkpoint = freezeJournalCheckpoint(checkpoint); this.current = state; this.campaign = campaign;
    this.engine?.restore({ checkpoint: this.checkpoint, state });
    this.questions.clear(); for (const receipt of questions) if (!this.coordinator.usageAcknowledged(receipt.receipt_id)) this.questions.set(receipt.receipt_id, receipt);
  }
  private async repairSnapshotCommand(publication: CommandPublication): Promise<void> {
    const { result, campaign, questions } = publication;
    const checkpoint = result.checkpoint ?? this.engine?.recoveryPoint().checkpoint;
    const confirmed = this.coordinator.confirmed, base = this.coordinator.encodingBase;
    if (!checkpoint || !confirmed || !base) throw new CloudSyncError("corrupt");
    const lineage = this.snapshotLineage ? { ...this.snapshotLineage, sequence: this.snapshotLineage.sequence + checkpoint.snapshot.head.sequence } : null;
    const encoded = lineage ? await this.coordinator.codec.run({ kind: "snapshotEncode", input: { state: result.state, campaign, lineage } })
      : await this.coordinator.codec.run({ kind: "encode", input: { checkpoint, campaign, source: this.source, operationId: "local-candidate",
        expectedRevision: base.revision, acknowledgedEvidence: { headerSha256: base.headerSha256, records: base.records } } });
    const saved = await this.coordinator.stage({ campaign, snapshot: encoded.snapshot, evidence: encoded.evidence, usageQuestions: [...questions],
      ...(lineage ? { saveFormat: 3, lineage, ...(!isSnapshotCopy(confirmed) ? { legacyBaseSnapshot: this.legacyBaseSnapshot } : {}) } : {}) }, "ordinary", true);
    if (!saved) throw new TypeError("Command snapshot preparation did not finish.");
    const pending = this.coordinator.pendingCandidate, current = this.coordinator.confirmed!;
    const verified = await this.coordinator.codec.run({ kind: "hydrate", input: { snapshot: pending?.snapshot ?? current.snapshot,
      evidence: pending ? { header: current.evidence.header, records: [...current.evidence.records, ...pending.evidence.records] } : current.evidence,
      revision: current.revision, expectedRevision: current.revision, expectedCampaignId: this.coordinator.scope.campaignId,
      expectedBaselineId: pending?.saveFormat === 3 ? SNAPSHOT_BASELINE : current.baselineId, lineage: pending?.lineage ?? current.lineage } });
    if (this.stopped || this.commandRepair?.publication !== publication) return;
    // Canonical snapshot JSON orders object fields differently from live state.
    // Once the durable copy proves the same prefix, keep its original immutable
    // checkpoint (including operation IDs) and exact live-state byte ordering.
    // A genuinely different verified prefix remains authoritative.
    if (equalParsedJson(result.state as unknown as CodecJson, verified.state as unknown as CodecJson)) {
      this.installCommandPrefix(checkpoint, result.state, campaign, questions);
    } else {
      this.installCommandPrefix(verified.checkpoint, verified.state, verified.campaign, questions);
      if (verified.snapshotLineage) this.snapshotLineage = verified.snapshotLineage;
    }
    this.changeVersion = Math.max(this.changeVersion, this.durableVersion + 1); this.durableVersion = this.changeVersion; this.preparedVersion = this.changeVersion;
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
    if (!drain || this.stopped || this.commandRepair) return Promise.resolve(false);
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
      let prepared = await this.journalDrain!.store.prepared(this.journalDrain!.key);
      if (this.stopped || !prepared || prepared.owner !== this.journalDrain!.owner) return false;
      const base = this.coordinator.encodingBase;
      if (prepared.candidate.saveFormat !== 3 && base && prepared.candidate.evidence.fromRecord > base.records) {
        // Offline opening may have selected a legacy descendant as its local
        // base. In-place recovery restores the older actual account prefix;
        // rebuild this derived delta against that verified base, never splice,
        // renumber or waive the missing immutable evidence rows.
        const drain = this.journalDrain!;
        const rebuilt = await prepareJournal(drain.store, drain.key, this.coordinator.codec, { base: this.coordinator.confirmed! });
        if (!rebuilt?.candidate || rebuilt.through < this.journalStart + target || (await drain.store.head(drain.key))?.owner !== drain.owner)
          throw new CloudCacheError("conflict");
        prepared = { owner: drain.owner, through: rebuilt.through, candidate: rebuilt.candidate };
      }
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
    if (this.commandRepair && !await this.repairCommand()) return false;
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
      // foreground consumes the real hidden/return marker before returning null
      // for Save & Close. A closed owner has released its lease; reopening here
      // is intentional, unlike focus/online polling of a still-playing clinic.
      if (checked === null && this.coordinator.view.phase === "closed")
        return this.automaticReconnect && await this.durable() ? this.automaticReconnect(false) : false;
      return checked === null || this.needsReload ? this.reconnect() : checked;
    })().finally(() => { this.foregrounding = null; if (notify || !this.canExecute) this.emit(); });
    if (notify) this.emit();
    return this.foregrounding;
  }
  reconnect(): Promise<boolean> {
    // A mounted durable clinic recovers the same account base in place. Only a
    // verified replacement/fence may ask the router to select again. Explicit
    // Save & Close/clinic navigation remain owned by the router.
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
    // An admission endpoint can be online while campaign reads still fail.
    // Keep the verified local game mounted; a failed probe is not a request to
    // route through loading and hydrate the same offline copy again.
    if (this.coordinator.playingVerifiedLocal && !await this.coordinator.probeAutomaticSelection()) return this.coordinator.view.canExecute;
    if (!current()) return false;
    const local = this.coordinator.playingVerifiedLocal ? await this.coordinator.reconnectVerifiedLocal() : null;
    if (!current()) return false;
    if (local === false) return this.coordinator.view.canExecute;
    const checked = local ?? await this.coordinator.focus();
    if (!current()) return false;
    if (!checked && !this.needsReload && !this.coordinator.playingVerifiedLocal && await this.coordinator.resumeMountedOffline()) return this.coordinator.view.canExecute;
    if (!current()) return false;
    // Restoring the actual account base can expose an already-durable pending
    // copy even when no NEW command was issued since this offline opening.
    if (checked && !this.needsReload && (this.dirty || local === true && this.coordinator.view.pending)) {
      if (!await this.prepareCheckpoint("ordinary") || !await this.coordinator.checkpoint("purchase")) return false;
    }
    if (!current()) return false;
    if (checked && !this.needsReload) { this.requestedReplacement = null; return true; }
    const replacement = this.coordinator.automaticReplacementKey ?? (this.needsReload ? `reload:${this.coordinator.confirmedRevision}` : null);
    if (!replacement) return false;
    // A failed automatic replacement is a fence, not permission to repeatedly
    // cover/remount the clinic. A different verified head gets its own attempt;
    // the explicit Reload/Retry action remains owned by the router.
    if (this.requestedReplacement === replacement || !this.automaticReconnect) return false;
    this.requestedReplacement = replacement;
    const replaced = await this.automaticReconnect(false);
    // Background selection can lose a read and leave this document intact.
    // Keep the shared backoff, but permit the same verified head to recover on
    // its next bounded probe. A successful replacement disposes this owner.
    if (!replaced) this.requestedReplacement = null;
    return replaced;
  }
  async checkpointNow(reason: CloudCheckpointReason): Promise<boolean> {
    if (reason === "hidden" || reason === "pagehide") this.backgrounded = true;
    if (!await this.durable()) return false;
    const result = await this.coordinator.checkpoint(reason);
    if (this.backgrounded) await this.releaseIdleEngine();
    return result;
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
    if (this.commandRepair && !await this.repairCommand()) return;
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
    const command: FailureIntent = { type: "BUILD_UNDO", operationId: crypto.randomUUID() };
    if (this.commandBackoff.blocked(command, this.changeVersion)) return null;
    const before = this.checkpoint, priorState = this.current, highWater = this.journalDrain?.highWater;
    let stage: CommandStage = "execute", publication: CommandPublication | null = null;
    try {
      const result = applyGameEvidenceBuildUndo(before, state, command.operationId); stage = "diff";
      publication = { result: { ...result, replayed: false, delta: gameEvidenceDelta(before, result.checkpoint) },
        campaign: { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) }, questions: [...this.questions.values()], followup: null };
      stage = "journal"; this.admitCommandPublication(publication, false, this.coordinator.journalWriterGeneration);
      stage = "publication"; this.publishCommand(publication); this.commandBackoff.success(); return this.current;
    } catch (error) {
      const admitted = publication !== null && (this.current !== priorState || Boolean(this.journalDrain && this.journalDrain.highWater !== highWater));
      if (!this.recordCommandFailure(error, command, stage, !admitted)) return null;
      if (admitted && publication) void this.repairCommand(publication);
      else { this.checkpoint = before; this.current = priorState; }
      return null;
    }
  }
  canReplaceState(state: GameState): boolean { return state === this.current; }
  undoBuildAsync(state: GameState): Promise<GameState | null> {
    if (!this.engine) {
      const prior = this.repairingCommand, result = this.undoBuild(state);
      return !prior && this.repairingCommand ? this.repairingCommand.then(ok => ok ? this.state : null) : Promise.resolve(result);
    }
    if (!this.canExecuteAction) return Promise.resolve(null);
    const engine = this.engine, operationId = crypto.randomUUID(), writerGeneration = this.coordinator.journalWriterGeneration;
    const command: FailureIntent = { type: "BUILD_UNDO", operationId };
    if (this.commandBackoff.blocked(command, this.changeVersion)) return Promise.resolve(null);
    let target: GameState;
    try { target = structuredClone(state); }
    catch (error) { this.recordCommandFailure(error, command, "capture"); return Promise.resolve(null); }
    return this.ordered.run(async () => {
      if (this.commandRepair && !await this.repairCommand()) return null;
      if (this.commandBackoff.blocked(command, this.changeVersion)) return null;
      const prior = engine.recoveryPoint(), before = this.current, highWater = this.journalDrain?.highWater;
      let stage: CommandStage = "execute", publication: CommandPublication | null = null;
      try {
        const result = await engine.undo(target, operationId);
        if (result.replayed) return this.state;
        stage = "projection";
        this.projectedView.publish(result.state, result.viewArguments, result.view);
        publication = { result, campaign: { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) }, questions: [...this.questions.values()], followup: null };
        stage = "journal"; this.admitCommandPublication(publication, false, writerGeneration);
        stage = "publication"; this.publishCommand(publication); this.commandBackoff.success();
        return this.state;
      } catch (error) {
        const admitted = publication !== null && (this.current !== before || Boolean(this.journalDrain && this.journalDrain.highWater !== highWater));
        if (!this.recordCommandFailure(error, command, stage, !admitted)) return null;
        if (admitted && publication) return await this.repairCommand(publication) ? this.state : null;
        engine.restore(prior); return null;
      }
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
    this.idleWorker.dispose();
    this.unbindDiagnostics(); this.unsubscribe(); this.unsubscribeReceipts(); this.unsubscribeRecovery(); this.unsubscribeAutomatic(); this.unsubscribeCheckpoint();
    const cleanup = () => { this.stopped = true; this.commandRepair?.finish(); this.commandRepair = null;
      if (this.journalDrain) this.coordinator.releaseJournalOwner(this.journalDrain.owner);
      this.journalDrain?.stop(); this.engine?.dispose(); this.finishDurability(false); };
    if (!this.engine && !this.ordered.pending && !this.repairingCommand && !this.commandRepair) { cleanup(); return; }
    this.detached = (this.commandActions?.settled() ?? Promise.resolve()).then(() => this.ordered.settled()).then(async () => {
      // Router replacement/unmount cannot terminate an admitted in-flight
      // command before its original journal owner has persisted the result.
      if (this.repairingCommand) await this.repairingCommand;
      if (this.journalDrain && !await this.journalDrain.drain() || !this.journalDrain && this.commandRepair) return;
      cleanup();
    }).catch(error => { this.coordinator.reportStorageRetry(error); });
  }
  dispose(): void { this.detach(); if (this.detached) void this.detached.then(() => this.coordinator.dispose()); else this.coordinator.dispose(); }
}
