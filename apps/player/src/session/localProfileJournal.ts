import { applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, type DomainContext, type GameCommand, type GameEvidenceCheckpoint, type GameState, gameEvidenceDelta } from "@gamify-surgery/game-domain";
import { cloudCodec } from "./cloud/codecWorker";
import { bindJournal, prepareJournal } from "./cloud/journalCodec";
import { IndexedDbJournalStorage, LocalJournalDrain, LOCAL_COMPACTION_MS, freezeJournalCheckpoint, type JournalStorage } from "./localJournal";
import type { LocalPrototypeProfile } from "./prototypeStorage";
import { cloudCampaignMetadata } from "./cloud/gameSession";
import { problemDiagnostics } from "../diagnostics/problemDiagnostics";
import type { QuestionUsageReceipt } from "../playtime/usageTypes";

const prefix = (accountId: string | null) => `local|${encodeURIComponent(accountId ?? "guest")}|`;
const keyFor = (accountId: string | null, id: string) => prefix(accountId) + encodeURIComponent(id);
const recovered = new WeakMap<GameState, GameEvidenceCheckpoint>();
const profileMetadata = (profile: LocalPrototypeProfile) => ({ ...profile,
  campaigns: profile.campaigns.map(({ state: _state, ...metadata }) => metadata) });

/** Legacy profiles remain an untouched migration/recovery source. The journal
 * restores recorded results, including frozen cases and review/card coupling. */
export async function recoverLocalProfile(profile: LocalPrototypeProfile, accountId: string | null,
  store: JournalStorage = new IndexedDbJournalStorage()): Promise<LocalPrototypeProfile> {
  let result = profile;
  let latestGlobals: { order: number; metadata: Partial<LocalPrototypeProfile>; questions: QuestionUsageReceipt[] } | null = null;
  for (const key of await store.keys(prefix(accountId))) {
    const loaded = await prepareJournal(store, key, cloudCodec, { local: true });
    if (!loaded?.state || !loaded.seed) continue;
    const state = loaded.state, existing = result.campaigns.find(row => row.campaignId === state.campaignId);
    if (!existing) continue; // An explicitly removed campaign is never resurrected.
    // A synchronous legacy Save & Close may be ahead of an interrupted batch.
    // Keep its exact durable state; the older journal bytes stay protected.
    if (existing.state.facilityTick > state.facilityTick || existing.state.facilityTick === state.facilityTick &&
      Object.keys(existing.state.operationReceipts).length > Object.keys(state.operationReceipts).length) continue;
    recovered.set(state, freezeJournalCheckpoint(loaded.seed.checkpoint));
    result = { ...result, campaigns: result.campaigns.map(row => row.campaignId === state.campaignId ? { ...row,
      name: loaded.seed!.campaign.name, status: loaded.seed!.campaign.status, updatedAtRealMs: loaded.seed!.campaign.updatedAtRealMs, state } : row) };
    const metadata = loaded.seed.profile as Partial<LocalPrototypeProfile> | undefined;
    const id = state.campaignId, tutorial = loaded.seed.campaign.tutorial;
    const guidance = { ...result.tutorialGuidanceByCampaign }, pauses = { ...result.tutorialDailyRoutinePauseByCampaign };
    if (tutorial.guidance) guidance[id] = tutorial.guidance; else delete guidance[id];
    if (tutorial.dailyRoutinePause === null) delete pauses[id]; else pauses[id] = tutorial.dailyRoutinePause;
    result = { ...result, tutorialGuidanceByCampaign: guidance, tutorialDailyRoutinePauseByCampaign: pauses,
      tutorialIntroDismissedCampaignIds: [...result.tutorialIntroDismissedCampaignIds.filter(key => key !== id), ...(tutorial.introDismissed ? [id] : [])],
      tutorialDailyRoutineTipAcknowledgments: { ...result.tutorialDailyRoutineTipAcknowledgments, [id]: tutorial.dailyRoutineTipAcknowledgments } };
    if (metadata && (!latestGlobals || (loaded.profileOrder ?? 0) > latestGlobals.order))
      latestGlobals = { order: loaded.profileOrder ?? 0, metadata, questions: loaded.seed.usageQuestions };
  }
  if (!latestGlobals) return result;
  const { metadata, questions } = latestGlobals;
  return { ...result, pendingUsageQuestions: questions,
    ...(typeof metadata.tutorialsEnabled === "boolean" ? { tutorialsEnabled: metadata.tutorialsEnabled } : {}),
    ...(result.activeCampaignId !== null && result.campaigns.some(row => row.campaignId === metadata.activeCampaignId) ? { activeCampaignId: metadata.activeCampaignId! } : {}) };
}

export class LocalProfileJournal {
  private checkpoint: GameEvidenceCheckpoint;
  private recorded: GameEvidenceCheckpoint;
  private drain!: LocalJournalDrain;
  private lastCompaction = performance.now();
  private lastCompactionAttempt = -Infinity;
  private compacting: Promise<boolean> | null = null;
  private lastCompactedVersion = 0;
  private metadataText = "";
  private constructor(readonly store: JournalStorage, private profile: LocalPrototypeProfile) {
    const state = profile.campaigns.find(row => row.campaignId === profile.activeCampaignId)!.state;
    this.checkpoint = this.recorded = recovered.get(state) ?? createGameEvidenceCheckpoint(state);
    this.metadataText = JSON.stringify(profileMetadata(profile));
  }
  static async create(profile: LocalPrototypeProfile, accountId: string | null, onFailure: (error: unknown) => void,
    onCommit: (questions: QuestionUsageReceipt[]) => void, store: JournalStorage = new IndexedDbJournalStorage()): Promise<LocalProfileJournal> {
    const session = new LocalProfileJournal(store, profile), key = keyFor(accountId, profile.activeCampaignId!), owner = crypto.randomUUID();
    const head = await bindJournal(store, key, owner, { checkpoint: session.checkpoint, campaign: cloudCampaignMetadata(profile),
      source: null, confirmed: null, profile: profileMetadata(profile), usageQuestions: profile.pendingUsageQuestions ?? [] }, cloudCodec);
    session.drain = new LocalJournalDrain(store, key, owner, head.highWater, onFailure);
    session.drain.onCommit = row => onCommit(row.usageQuestions); session.lastCompactedVersion = head.highWater; return session;
  }
  get canAccept() { return this.drain.canAccept; }
  get campaignId() { return this.checkpoint.snapshot.campaignId; }
  get recoveryCheckpoint() { return this.checkpoint; }
  get dirty() { return this.drain.dirty; }
  execute(command: GameCommand, context: DomainContext): GameState {
    const result = applyGameEvidenceCommand(this.checkpoint, command, context); this.checkpoint = result.checkpoint;
    recovered.set(result.state, this.checkpoint); return result.state;
  }
  undo(state: GameState): void { this.checkpoint = applyGameEvidenceBuildUndo(this.checkpoint, state, crypto.randomUUID()).checkpoint; recovered.set(state, this.checkpoint); }
  record(profile: LocalPrototypeProfile, tick = false): void {
    this.profile = profile;
    const metadata = profileMetadata(profile), text = JSON.stringify(metadata);
    if (this.recorded === this.checkpoint && text === this.metadataText) return;
    this.drain.accept({ delta: this.recorded === this.checkpoint ? null : gameEvidenceDelta(this.recorded, this.checkpoint),
      campaign: cloudCampaignMetadata(profile), usageQuestions: profile.pendingUsageQuestions ?? [], profile: metadata }, tick);
    this.metadataText = text;
    this.recorded = this.checkpoint;
  }
  durable() { return this.drain.drain(); }
  compact(boundary = false): Promise<boolean> {
    if (this.compacting) return this.compacting;
    if (!boundary && performance.now() - this.lastCompaction < LOCAL_COMPACTION_MS || this.lastCompactedVersion === this.drain.highWater) return Promise.resolve(true);
    if (performance.now() - this.lastCompactionAttempt < 60_000) return Promise.resolve(false);
    this.lastCompactionAttempt = performance.now();
    this.compacting = (async () => {
      if (!await this.durable()) return false;
      const result = await prepareJournal(this.store, this.drain.key, cloudCodec, { compact: true });
      if (!result) return false;
      this.lastCompactedVersion = result.through; this.lastCompaction = performance.now(); return true;
    })().catch(error => { problemDiagnostics.error("local-compaction", error); return false; }).finally(() => { this.compacting = null; });
    return this.compacting;
  }
  stop() { this.drain.stop(); }
}
