import { applyGameEvidenceCommand, applyGameEvidenceBuildUndo, importGameEvidence, type DomainContext, type GameCommand, type GameEvidenceCheckpoint, type GameState } from "@gamify-surgery/game-domain";
import { isFirstScoredAnswer } from "../../playtime/scoredQuestionUsage";
import type { QuestionUsageReceipt } from "../../playtime/usageTypes";
import type { LocalPrototypeProfile } from "../prototypeStorage";
import { type CloudCampaignMetadata } from "./codec";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint, type CloudSourceProvenance } from "./codecEvidence";
import { CloudSyncCoordinator, type CloudCheckpointReason, type CloudSyncView } from "./coordinator";
import type { CloudCandidate } from "./transport";
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

/** Shared command boundary for desktop/phone. Construction requires a verified online open. */
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
  private reason: CloudCheckpointReason = "ordinary";
  private stopped = false;
  private readonly unsubscribe: () => void;
  private readonly unsubscribeReceipts: () => void;
  private boundRevision: string;
  private reloadRequired = false;
  private constructor(readonly coordinator: CloudSyncCoordinator, loaded: Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>,
    private readonly switchTo?: (campaignId: string) => Promise<void>) {
    this.checkpoint = loaded.checkpoint; this.current = loaded.state; this.campaign = loaded.campaign; this.source = loaded.source;
    this.boundRevision = coordinator.confirmed!.revision;
    for (const receipt of coordinator.pendingCandidate?.usageQuestions ?? []) this.questions.set(receipt.receipt_id, receipt);
    this.unsubscribe = coordinator.subscribe(() => {
      if (!this.reloadRequired && coordinator.confirmed?.revision !== this.boundRevision) {
        this.reloadRequired = true; coordinator.requireSessionReload();
      }
      this.emit();
    });
    this.unsubscribeReceipts = coordinator.onAcknowledged(receipt => { this.boundRevision = receipt.revision; for (const id of receipt.usageReceiptIds) this.questions.delete(id); });
  }
  static async create(coordinator: CloudSyncCoordinator, switchTo?: (campaignId: string) => Promise<void>): Promise<CloudGameSession> {
    const confirmed = coordinator.confirmed;
    if (!confirmed || ["off", "checking", "blocked", "auth", "storage"].includes(coordinator.view.phase)) throw new Error("Open and verify the account campaign first.");
    const pending = coordinator.pendingCandidate;
    const loaded = await loadCloudEvidenceCheckpoint({ snapshot: pending?.snapshot ?? confirmed.snapshot,
      evidence: pending ? { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...pending.evidence.records] } : confirmed.evidence,
      revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: coordinator.scope.campaignId,
      expectedBaselineId: confirmed.baselineId });
    return new CloudGameSession(coordinator, loaded, switchTo);
  }
  private emit(): void { for (const listener of this.listeners) listener(); }
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  get needsReload(): boolean { return this.reloadRequired; }
  get syncView(): CloudSyncView {
    const view = this.coordinator.view, preparing = this.dirty || this.encoding;
    return { ...view, canExecute: this.canExecute, pending: view.pending || preparing, localDurable: view.localDurable && !preparing };
  }
  get canExecute(): boolean { return !this.stopped && !this.reloadRequired && !this.encoding && this.coordinator.view.canExecute; }
  get state(): GameState { return !this.reloadRequired && this.coordinator.view.canExecute ? this.current : { ...this.current, paused: true }; }
  get metadata(): CloudCampaignMetadata { return structuredClone(this.campaign); }

  execute(command: GameCommand, context: DomainContext, createQuestionReceipt?: () => QuestionUsageReceipt | null): GameState | null {
    if (!this.canExecute) return null;
    const before = this.current;
    let result: ReturnType<typeof applyGameEvidenceCommand>;
    try { result = applyGameEvidenceCommand(this.checkpoint, command, context); }
    catch (error) { this.coordinator.reportLocalFailure(error); return null; }
    if (result.replayed) return this.state;
    this.checkpoint = result.checkpoint; this.current = result.state;
    if (isFirstScoredAnswer(before, result.state, command)) {
      const receipt = createQuestionReceipt?.();
      if (receipt) this.questions.set(receipt.receipt_id, receipt);
      this.reason = "scored-answer";
    } else if (command.type === "SET_PAUSED" && command.paused) this.reason = "pause";
    else if (["PLACE_ROOM", "UPGRADE_ROOM", "HIRE_STAFF", "TRAIN_EMPLOYEE", "BOOK_INSPECTION", "PLACE_DOOR", "INCREASE_EMPLOYEE_SALARY"].includes(command.type)) this.reason = "purchase";
    this.dirty = true; this.scheduleFlush(); this.emit(); return this.current;
  }
  updateMetadata(campaign: CloudCampaignMetadata): void {
    if (this.stopped || campaign.campaignId !== this.coordinator.scope.campaignId || !this.coordinator.view.canExecute ||
      JSON.stringify(campaign) === JSON.stringify(this.campaign)) return;
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
        const checkpoint = this.checkpoint, campaign = this.campaign, reason = this.reason;
        this.reason = "ordinary";
        // An acknowledgment can land while compression is running. Re-encode
        // its suffix against the NEW confirmed prefix; never upload it twice.
        let candidate: CloudCandidate;
        for (;;) {
          const confirmed = this.coordinator.confirmed;
          if (!confirmed) return false;
          const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign, source: this.source,
            operationId: "local-candidate", expectedRevision: confirmed.revision,
            acknowledgedEvidence: { headerSha256: confirmed.evidence.header.uncompressedSha256, records: confirmed.evidence.records.length } });
          if (encoded.sizes.decodedGameBytes > 3_000_000) throw new CloudSyncError("capacity");
          if (this.coordinator.confirmed?.revision !== confirmed.revision) continue;
          const delta = encoded.request.evidence;
          if (!("headerSha256" in delta)) return false;
          candidate = { campaign, snapshot: encoded.snapshot, evidence: { ...delta, headerSha256: delta.headerSha256! }, usageQuestions: [...this.questions.values()] };
          break;
        }
        success = await this.coordinator.stage(candidate, reason);
        if (!success) return false;
      }
      return success;
    }).catch(error => { this.coordinator.reportLocalFailure(error); return false; }).finally(() => { this.encoding = false; this.flushing = null; this.emit(); });
  }
  async durable(): Promise<boolean> { return this.flushing ? this.flushing : this.coordinator.view.localDurable; }
  async checkpointNow(reason: CloudCheckpointReason): Promise<boolean> {
    if (!await this.durable()) return false;
    if (reason === "mode-exit") { this.coordinator.requestEarlyCheckpoint(); return true; }
    return this.coordinator.checkpoint(reason);
  }
  async saveAndClose(context: DomainContext): Promise<boolean> {
    if (!await this.durable()) return false;
    if (!this.current.paused && !this.execute({ type: "SET_PAUSED", paused: true, operationId: crypto.randomUUID() }, context)) return false;
    if (!await this.durable()) return false;
    return this.coordinator.saveAndClose();
  }
  async switchCampaign(campaignId: string, context: DomainContext): Promise<boolean> {
    if (!this.switchTo || !await this.saveAndClose(context)) return false;
    await this.switchTo(campaignId); return true;
  }
  undoBuild(state: GameState): GameState | null {
    if (!this.canExecute) return null;
    try {
      const result = applyGameEvidenceBuildUndo(this.checkpoint, state, crypto.randomUUID());
      this.checkpoint = result.checkpoint; this.current = result.state;
      this.dirty = true; this.reason = "purchase"; this.scheduleFlush(); this.emit();
      // Undo is a new account revision, including when the build was already saved.
      void this.durable().then(async ok => {
        if (!ok) return;
        while (!this.stopped && this.coordinator.view.pending) if (!await this.coordinator.checkpoint("purchase")) break;
      });
      return this.current;
    } catch (error) { this.coordinator.reportLocalFailure(error); return null; }
  }
  canReplaceState(state: GameState): boolean { return state === this.current; }
  exportRecovery(): string {
    return this.coordinator.exportRecovery() ?? JSON.stringify({ schemaVersion: 1, scope: this.coordinator.scope,
      checkpoint: this.checkpoint, campaign: this.campaign, usageQuestions: [...this.questions.values()], priorRecovery: this.coordinator.confirmed?.priorRecovery ?? null });
  }
  dispose(): void { this.stopped = true; this.unsubscribe(); this.unsubscribeReceipts(); this.coordinator.dispose(); }
}
