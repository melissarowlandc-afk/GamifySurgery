import { applyGameEvidenceCommand, applyGameEvidenceBuildUndo, type DomainContext, type GameCommand, type GameEvidenceCheckpoint, type GameState } from "@gamify-surgery/game-domain";
import { isFirstScoredAnswer } from "../../playtime/scoredQuestionUsage";
import type { QuestionUsageReceipt } from "../../playtime/usageTypes";
import type { LocalPrototypeProfile } from "../prototypeStorage";
import { type CloudCampaignMetadata } from "./codec";
import { loadCloudEvidenceCheckpoint, type CloudSourceProvenance } from "./codecEvidence";
import { CloudSyncCoordinator, type CloudCheckpointReason, type CloudSyncView } from "./coordinator";
import { logicalJsonText } from "./codecJson";
import { cloudCheckDeadline } from "./checkDeadline";
import { CloudSyncError } from "./transport";

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
  private checkpoint: GameEvidenceCheckpoint;
  private current: GameState;
  private campaign: CloudCampaignMetadata;
  private readonly source: CloudSourceProvenance;
  private readonly questions = new Map<string, QuestionUsageReceipt>();
  private readonly listeners = new Set<() => void>();
  private flushing: Promise<boolean> | null = null;
  private encoding = false;
  private dirty = false;
  private stopped = false;
  private closing: Promise<boolean> | null = null;
  private readonly unsubscribe: () => void;
  private readonly unsubscribeReceipts: () => void;
  private readonly unsubscribeRecovery: () => void;
  private readonly unsubscribeAutomatic: () => void;
  private boundRevision: string;
  private reloadRequired = false;
  private reconnecting: Promise<boolean> | null = null;
  private constructor(readonly coordinator: CloudSyncCoordinator, loaded: Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>,
    private readonly switchTo?: (campaignId: string) => Promise<void>, private readonly automaticReconnect?: (checked: boolean) => Promise<boolean>) {
    this.checkpoint = loaded.checkpoint; this.current = loaded.state; this.campaign = loaded.campaign; this.source = loaded.source;
    this.boundRevision = coordinator.confirmedRevision!;
    for (const receipt of coordinator.pendingCandidate?.usageQuestions ?? []) this.questions.set(receipt.receipt_id, receipt);
    this.unsubscribe = coordinator.subscribe(() => {
      if (!this.reloadRequired && coordinator.confirmedRevision !== this.boundRevision) {
        this.reloadRequired = true; coordinator.requireSessionReload();
      }
      this.emit();
    });
    this.unsubscribeReceipts = coordinator.onAcknowledged(receipt => { this.boundRevision = receipt.revision; for (const id of receipt.usageReceiptIds) this.questions.delete(id); });
    this.unsubscribeRecovery = coordinator.beforeReconnect(async () => await this.durable() || !this.dirty);
    this.unsubscribeAutomatic = automaticReconnect ? coordinator.onAutomaticSelection(() => this.reconnect()) : () => {};
  }
  static async create(coordinator: CloudSyncCoordinator, switchTo?: (campaignId: string) => Promise<void>, automaticReconnect?: (checked: boolean) => Promise<boolean>): Promise<CloudGameSession> {
    const confirmed = coordinator.confirmed;
    if (!confirmed || ["off", "checking", "blocked", "auth", "storage"].includes(coordinator.view.phase)) throw new Error("Open and verify the account campaign first.");
    const pending = coordinator.pendingCandidate;
    const loaded = await loadCloudEvidenceCheckpoint({ snapshot: pending?.snapshot ?? confirmed.snapshot,
      evidence: pending ? { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } : confirmed.evidence,
      revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: coordinator.scope.campaignId,
      expectedBaselineId: confirmed.baselineId });
    return new CloudGameSession(coordinator, loaded, switchTo, automaticReconnect);
  }
  private emit(): void { for (const listener of this.listeners) listener(); }
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  get needsReload(): boolean { return this.reloadRequired; }
  get syncView(): CloudSyncView {
    const view = this.coordinator.view, preparing = this.dirty || this.encoding;
    return { ...view, canExecute: this.canExecute, pending: view.pending || preparing, localDurable: view.localDurable && !preparing };
  }
  get canExecute(): boolean { return !this.stopped && !this.reloadRequired && !this.closing && this.coordinator.view.canExecute; }
  get state(): GameState { return !this.reloadRequired && this.coordinator.view.canExecute ? this.current : { ...this.current, paused: true }; }
  get metadata(): CloudCampaignMetadata { return structuredClone(this.campaign); }

  execute(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null): GameState | null {
    if (!this.canExecute) { this.emit(); return null; }
    const before = this.current;
    let result: ReturnType<typeof applyGameEvidenceCommand>;
    try { result = applyGameEvidenceCommand(this.checkpoint, command, context); }
    catch (error) { this.coordinator.reportLocalFailure(error); return null; }
    if (result.replayed) return this.state;
    this.checkpoint = result.checkpoint; this.current = result.state;
    this.campaign = { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) };
    if (isFirstScoredAnswer(before, result.state, command)) {
      const receipt = createQuestionReceipt?.();
      if (receipt) this.questions.set(receipt.receipt_id, receipt);
    }
    this.dirty = true; this.scheduleFlush(); this.emit(); return this.current;
  }
  updateMetadata(campaign: CloudCampaignMetadata): void {
    if (this.stopped || campaign.campaignId !== this.coordinator.scope.campaignId || !this.coordinator.view.canExecute ||
      logicalJsonText(JSON.parse(JSON.stringify({ ...campaign, updatedAtRealMs: 0 }))) ===
      logicalJsonText(JSON.parse(JSON.stringify({ ...this.campaign, updatedAtRealMs: 0 })))) return;
    this.campaign = structuredClone(campaign); this.dirty = true; this.scheduleFlush();
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
        const checkpoint = this.checkpoint, campaign = this.campaign, usageQuestions = [...this.questions.values()];
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
        if (!success) return false;
      }
      return success;
    }).catch(error => { this.dirty = !this.stopped; this.coordinator.reportLocalFailure(error); return false; }).finally(() => { this.encoding = false; this.flushing = null; this.emit(); });
  }
  async durable(): Promise<boolean> {
    if (this.dirty && !this.flushing && !this.stopped) this.scheduleFlush();
    return this.flushing ? this.flushing : this.coordinator.view.localDurable;
  }
  reconnect(): Promise<boolean> {
    // Foregrounding an account clinic, including after Save & Close, goes
    // through the router's full automatic selection and fencing. Recovery
    // export stays stable; a bare coordinator has no authority to reopen itself.
    if (this.stopped || this.closing || this.coordinator.view.phase === "closed" && !this.automaticReconnect ||
      this.coordinator.confirmed?.priorRecovery) return Promise.resolve(false);
    if (this.reconnecting) return this.reconnecting;
    this.reconnecting = this.reconnectChecked().finally(() => { this.reconnecting = null; });
    return this.reconnecting;
  }
  private async reconnectChecked(): Promise<boolean> {
    // Finish persisting commands already accepted before changing lease/base.
    // A failed write remains in coordinator.attempted for its quota retry.
    try { await cloudCheckDeadline(this.durable()); }
    catch {
      if (!this.stopped) this.coordinator.reportLocalFailure(new CloudSyncError("processing"));
      return false;
    }
    if (this.stopped) return false;
    const checked = await this.coordinator.focus();
    if (this.stopped) return false;
    return this.automaticReconnect ? this.automaticReconnect(checked && !this.needsReload) : checked;
  }
  async checkpointNow(reason: CloudCheckpointReason): Promise<boolean> {
    if (!await this.durable()) return false;
    return this.coordinator.checkpoint(reason);
  }
  saveAndClose(context: DomainContext): Promise<boolean> {
    if (this.closing) return this.closing;
    // Stop live ticks before awaiting encoding; routine recovery work never pauses play.
    if (!this.current.paused && !this.execute({ type: "SET_PAUSED", paused: true, operationId: crypto.randomUUID() }, context)) return Promise.resolve(false);
    this.closing = (async () => {
      if (!await this.durable()) return false;
      return this.coordinator.saveAndClose();
    })().finally(() => { this.closing = null; this.emit(); });
    this.emit(); return this.closing;
  }
  async switchCampaign(campaignId: string, context: DomainContext): Promise<boolean> {
    if (!this.switchTo || !await this.saveAndClose(context)) return false;
    await this.switchTo(campaignId); return true;
  }
  undoBuild(state: GameState): GameState | null {
    if (!this.canExecute) { this.emit(); return null; }
    try {
      const result = applyGameEvidenceBuildUndo(this.checkpoint, state, crypto.randomUUID());
      this.checkpoint = result.checkpoint; this.current = result.state;
      this.campaign = { ...this.campaign, updatedAtRealMs: Math.max(this.campaign.updatedAtRealMs, Date.now()) };
      this.dirty = true; this.scheduleFlush(); this.emit();
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
  detach(): void { this.stopped = true; this.unsubscribe(); this.unsubscribeReceipts(); this.unsubscribeRecovery(); this.unsubscribeAutomatic(); }
  dispose(): void { this.detach(); this.coordinator.dispose(); }
}
