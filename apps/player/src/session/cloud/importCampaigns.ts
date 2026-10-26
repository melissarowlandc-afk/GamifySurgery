import { deserializeGameState } from "@gamify-surgery/game-domain";
import { accountStorageKey } from "../accountStorageKey";
import { LEGACY_PROTOTYPE_SAVE_KEY, PROTOTYPE_PROFILE_KEY, createFreshProfile, type LocalPrototypeProfile } from "../prototypeStorage";
import { normalizeTutorialGuidanceRecords } from "../tutorialGuidance";
import { readCloudCampaignMetadata, type CloudCampaignMetadata } from "./codec";
import { loadCloudEvidenceCheckpoint, prepareCloudEvidenceImport } from "./codecEvidence";
import { logicalJsonText, sha256Utf8, utf8Bytes } from "./codecJson";
import type { CloudEntryStore } from "./entryStorage";
import { CloudSyncError, type CloudCampaignSummary, type CloudFrozenOperation, type CloudImportRequest, type CloudTransport } from "./transport";
import { parseQuestionUsageReceipts, type QuestionUsageReceipt } from "../../playtime/usageTypes";

export interface LocalCloudSource {
  id: string;
  sourceKey: string;
  unowned: boolean;
  serializedState: string;
  campaign: CloudCampaignMetadata;
  bytes: number;
  facilityLevel: number;
  error: string | null;
}
export interface LocalCloudInspection { sources: LocalCloudSource[]; problems: string[]; pendingUsageQuestions: QuestionUsageReceipt[] }
function metadata(raw: Record<string, any>, campaign: Record<string, any>, facilityLevel = 0): CloudCampaignMetadata {
  const id = campaign.campaignId;
  return readCloudCampaignMetadata(JSON.parse(JSON.stringify({ campaignId: id, name: campaign.name, status: campaign.status,
    createdAtRealMs: campaign.createdAtRealMs, updatedAtRealMs: campaign.updatedAtRealMs,
    tutorial: { guidance: normalizeTutorialGuidanceRecords(raw.tutorialGuidanceByCampaign, [{ campaignId: id, state: { facilityLevel } }],
      raw.tutorialsEnabled !== false, raw.tutorialDailyRoutineTipAcknowledgments ?? {})[id] ?? null,
      introDismissed: Array.isArray(raw.tutorialIntroDismissedCampaignIds) && raw.tutorialIntroDismissedCampaignIds.includes(id),
      dailyRoutineTipAcknowledgments: raw.tutorialDailyRoutineTipAcknowledgments?.[id] ?? [],
      dailyRoutinePause: raw.tutorialDailyRoutinePauseByCampaign?.[id] ?? null } })));
}
/** Retain the EXACT storage string before parsing. Never use fresh-profile fallback for imports. */
export async function inspectLocalCloudSources(accountId: string, storage: Pick<Storage, "getItem">, store: CloudEntryStore,
  includeUnowned = false): Promise<LocalCloudInspection> {
  const result: LocalCloudInspection = { sources: [], problems: [], pendingUsageQuestions: [] };
  const scopes = includeUnowned ? [accountId, null] : [accountId];
  for (const owner of scopes) for (const base of [PROTOTYPE_PROFILE_KEY, LEGACY_PROTOTYPE_SAVE_KEY]) {
    const sourceKey = accountStorageKey(base, owner);
    try {
      const raw = storage.getItem(sourceKey); if (raw === null) continue;
      const digest = await sha256Utf8(raw);
      const retained = await store.create(`raw:${sourceKey}:${digest}`, { sourceKey, text: raw, sha256: digest });
      if (retained.text !== raw || retained.sha256 !== digest) throw new CloudSyncError("storage");
      const parsed = JSON.parse(raw);
      const profile = base === PROTOTYPE_PROFILE_KEY ? parsed : { campaigns: [{ campaignId: parsed.campaignId,
        name: "Legacy clinic", status: "resumable", createdAtRealMs: parsed.createdAtRealMs ?? 0,
        updatedAtRealMs: parsed.createdAtRealMs ?? 0, serializedState: raw }] };
      if (!profile || !Array.isArray(profile.campaigns) || base === PROTOTYPE_PROFILE_KEY && profile.schemaVersion !== 2) throw new Error("unsupported profile");
      if (owner === accountId && base === PROTOTYPE_PROFILE_KEY) result.pendingUsageQuestions = parseQuestionUsageReceipts(profile.pendingUsageQuestions);
      for (const record of profile.campaigns) {
        try {
          if (typeof record.serializedState !== "string") throw new Error("missing source");
          let campaign = metadata(profile, record); const bytes = utf8Bytes(record.serializedState);
          let facilityLevel = 0, error: string | null = null;
          try {
            if (bytes > 3_000_000) error = "This local campaign is too large to copy. Keep it here or contact the owner.";
            else { const state = deserializeGameState(record.serializedState); facilityLevel = state.facilityLevel; campaign = metadata(profile, record, facilityLevel);
              if (state.campaignId !== campaign.campaignId) throw new Error("identity"); }
          } catch { error = "This campaign could not be validated. Its original bytes are retained; update the game or contact the owner."; }
          result.sources.push({ id: `${sourceKey}:${campaign.campaignId}`, sourceKey, unowned: owner === null,
            serializedState: record.serializedState, campaign, bytes, facilityLevel, error });
        } catch { result.problems.push("A local campaign has invalid metadata. Its original profile is retained; contact the owner."); }
      }
    } catch (error) {
      result.problems.push(error instanceof CloudSyncError ? "Browser recovery storage is unavailable. No campaign can be copied until storage works." :
        "A local profile could not be read or is unsupported. It has not been replaced; contact the owner.");
    }
  }
  return result;
}
/** Only already-minted, account-owned Beta 1 staging IDs; never derive receipts from history or an unowned source. */
export async function promoteExistingLocalQuestions(receipts: readonly QuestionUsageReceipt[], usage: {
  canRecordQuestions(): boolean; commitQuestions(receipts: readonly QuestionUsageReceipt[]): boolean; flush(): Promise<void>;
}, store: CloudEntryStore): Promise<void> {
  if (!receipts.length || !usage.canRecordQuestions()) return;
  const promoted = parseQuestionUsageReceipts(await store.read("usage-promoted")), ids = new Set(promoted.map(row => row.receipt_id));
  const pending = parseQuestionUsageReceipts(receipts).filter(row => !ids.has(row.receipt_id));
  if (!pending.length || !usage.canRecordQuestions() || !usage.commitQuestions(pending)) return;
  await store.write("usage-promoted", parseQuestionUsageReceipts([...promoted, ...pending]));
  await usage.flush();
}
interface ImportJournal { sourceDigest: string; operation: CloudFrozenOperation; verified: boolean }
export interface CloudEnrollmentMarker { sourceDigest: string; operationId: string; campaignId: string; revision: string; facilityLevel?: number }
export async function importLocalCloudCampaign(source: LocalCloudSource, name: string, transport: CloudTransport, store: CloudEntryStore) {
  if (source.error || !transport.importCampaign) throw new CloudSyncError("corrupt");
  const campaign = readCloudCampaignMetadata(JSON.parse(JSON.stringify({ ...source.campaign, name: name.trim() })));
  const sourceDigest = await sha256Utf8(JSON.stringify({ serializedState: source.serializedState, campaign }));
  const journalKey = `import:${sourceDigest}`;
  let journal = await store.read<ImportJournal>(journalKey);
  const access = await transport.capabilities();
  if (!access.admitted || access.deletionRequested) throw new CloudSyncError("deleted");
  if (!access.noticeAccepted) throw new CloudSyncError("notice");
  if (!access.enabled || access.writesEnabled === false || access.enrollmentsEnabled === false) throw new CloudSyncError("disabled");
  if (!journal) {
    const summaries = await transport.list();
    if (summaries.some(row => row.campaignId === campaign.campaignId)) throw new CloudSyncError("revision");
    if (summaries.some(row => row.name.toLowerCase() === campaign.name.toLowerCase())) throw new CloudSyncError("corrupt");
    if (summaries.length >= 2) throw new CloudSyncError("capacity");
    const operationId = `import.${sourceDigest}`;
    const prepared = await prepareCloudEvidenceImport({ serializedState: source.serializedState, campaign, operationId });
    if (prepared.sizes.decodedGameBytes > 3_000_000) throw new CloudSyncError("capacity");
    const request: CloudImportRequest = { operationId, campaignId: campaign.campaignId, campaign, snapshot: prepared.snapshot,
      evidence: prepared.packedEvidence, baselineId: prepared.envelope.baselineId,
      writerToken: Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("") };
    const requestText = JSON.stringify(request), createdAtMs = Date.now();
    const operation: CloudFrozenOperation = { operationId, requestText, requestSha256: await sha256Utf8(requestText), createdAtMs };
    if (transport.prepareImport) operation.wireRequest = await transport.prepareImport(request, createdAtMs);
    if (utf8Bytes(JSON.stringify(operation)) > 7_000_000) throw new CloudSyncError("capacity");
    journal = await store.create(journalKey, { sourceDigest, operation, verified: false });
  }
  const operation = journal.operation, request = JSON.parse(operation.requestText) as CloudImportRequest;
  if (journal.sourceDigest !== sourceDigest || await sha256Utf8(operation.requestText) !== operation.requestSha256) throw new CloudSyncError("storage");
  const outcome = await transport.operation(campaign.campaignId, operation.operationId, operation);
  if (outcome.status === "expired") throw new CloudSyncError("operation-expired");
  const receipt = outcome.status === "committed" ? outcome.receipt : await transport.importCampaign(operation);
  if (receipt.operationId !== operation.operationId || receipt.campaignId !== campaign.campaignId || receipt.revision !== "1" ||
    receipt.requestSha256 !== (operation.wireRequest?.sha256 ?? operation.requestSha256) || receipt.snapshotSha256 !== request.snapshot.uncompressedSha256 ||
    receipt.snapshotBytes !== request.snapshot.uncompressedBytes || receipt.evidenceHighWater !== request.evidence.records.length || receipt.usageReceiptIds.length) throw new CloudSyncError("corrupt");
  const loaded = await transport.load(campaign.campaignId);
  const verified = await loadCloudEvidenceCheckpoint({ ...loaded, expectedCampaignId: campaign.campaignId, expectedRevision: loaded.revision, expectedBaselineId: request.baselineId });
  if (loaded.evidence.header.uncompressedSha256 !== request.evidence.header.uncompressedSha256 ||
    request.evidence.records.some((row, index) => row.id !== loaded.evidence.records[index]?.id || row.content.uncompressedSha256 !== loaded.evidence.records[index]?.content.uncompressedSha256)) throw new CloudSyncError("corrupt");
  if (loaded.revision === receipt.revision) {
    const expected = await loadCloudEvidenceCheckpoint({ snapshot: request.snapshot, evidence: request.evidence, revision: "1", expectedRevision: "1",
      expectedCampaignId: campaign.campaignId, expectedBaselineId: request.baselineId });
    if (logicalJsonText(JSON.parse(JSON.stringify(expected.checkpoint))) !== logicalJsonText(JSON.parse(JSON.stringify(verified.checkpoint))) ||
      logicalJsonText(JSON.parse(JSON.stringify(campaign))) !== logicalJsonText(JSON.parse(JSON.stringify(verified.campaign)))) throw new CloudSyncError("corrupt");
  }
  const marker: CloudEnrollmentMarker = { sourceDigest, operationId: operation.operationId, campaignId: campaign.campaignId, revision: loaded.revision, facilityLevel: verified.state.facilityLevel };
  await store.write(`enrolled:${campaign.campaignId}`, marker);
  await store.write(journalKey, { ...journal, verified: true });
  // An import's writer is used only for enrollment. A later open makes an explicit continuation choice.
  try { await transport.head(campaign.campaignId); await transport.release({ campaignId: campaign.campaignId, writerGeneration: "1", writerToken: request.writerToken }); } catch { /* A newer fenced writer remains untouched. */ }
  return { marker, loaded, verified };
}

export const AUTOMATIC_ENROLLMENT_KEY = "automatic-account-campaigns.v1";
export interface AutomaticCampaignEnrollment {
  version: 1;
  phase: "choose" | "saving" | "complete";
  candidates: { source: LocalCloudSource; name: string }[];
  selectedIds: string[];
  freeSlots: number;
}
const enrollmentJobs = new WeakMap<CloudEntryStore, Promise<unknown>>();
function enrollmentJob<T>(store: CloudEntryStore, run: () => Promise<T>): Promise<T> {
  const result = (enrollmentJobs.get(store) ?? Promise.resolve()).catch(() => {}).then(run);
  enrollmentJobs.set(store, result); return result;
}
function availableName(name: string, taken: Set<string>): string {
  let result = name, suffix = 1;
  while (taken.has(result.toLowerCase())) {
    const ending = ` (${++suffix})`, letters = Array.from(name);
    while (utf8Bytes(letters.join("") + ending) > 160) letters.pop();
    result = letters.join("") + ending;
  }
  taken.add(result.toLowerCase()); return result;
}
/** Freeze this device's first account migration before any upload. Originals
 * are never edited; omitted campaigns remain retained and hidden after choice.
 * EntryStore is already scoped to the signed-in account and backend. */
export function prepareAutomaticCampaignEnrollment(sources: readonly LocalCloudSource[], summaries: readonly CloudCampaignSummary[], store: CloudEntryStore) {
  return enrollmentJob(store, async (): Promise<AutomaticCampaignEnrollment> => {
    const prior = await store.read<AutomaticCampaignEnrollment>(AUTOMATIC_ENROLLMENT_KEY), entries = await store.entries();
    if (prior && prior.version !== 1) throw new CloudSyncError("storage");
    const known = new Set(summaries.map(row => row.campaignId)), seen = new Set<string>();
    const pending = [...sources, ...entries.filter(row => row.key.startsWith("created:")).map(row => row.value as LocalCloudSource)]
      .filter(source => {
        const campaignId = source.campaign.campaignId;
        if (source.unowned || source.error || seen.has(campaignId) || entries.some(row => row.key === `enrolled:${campaignId}` || row.key === `retired:${campaignId}`)) return false;
        seen.add(campaignId);
        return source.sourceKey.startsWith("created:") || !known.has(campaignId);
      });
    // A deliberately created account campaign may have failed before receipt.
    // Retry that frozen creation even after the first-sign-in migration ended.
    const candidates = prior?.phase === "complete" ? pending.filter(source => source.sourceKey.startsWith("created:")) : pending;
    if (prior && (prior.phase !== "complete" || !candidates.length)) return prior;
    const taken = new Set(summaries.map(row => row.name.toLowerCase()));
    const freeSlots = Math.max(0, 2 - summaries.length), choose = !prior && candidates.length > freeSlots;
    const next: AutomaticCampaignEnrollment = { version: 1, phase: choose ? "choose" : candidates.length ? "saving" : "complete",
      candidates: candidates.map(source => ({ source, name: summaries.find(row => row.campaignId === source.campaign.campaignId)?.name ?? availableName(source.campaign.name, taken) })),
      selectedIds: choose ? [] : candidates.map(source => source.id), freeSlots };
    return prior ? store.compareAndSet(AUTOMATIC_ENROLLMENT_KEY, prior, next) : store.create(AUTOMATIC_ENROLLMENT_KEY, next);
  });
}
/** The first confirmed chooser wins across tabs. Never replace a prior choice. */
export function chooseAutomaticCampaignEnrollment(ids: readonly string[], freeSlots: number, store: CloudEntryStore) {
  return enrollmentJob(store, async () => {
    const current = await store.read<AutomaticCampaignEnrollment>(AUTOMATIC_ENROLLMENT_KEY);
    if (!current || current.version !== 1) throw new CloudSyncError("storage");
    if (current.phase !== "choose") return current;
    const selectedIds = [...new Set(ids)];
    if (selectedIds.length > Math.max(0, Math.min(current.freeSlots, freeSlots)) || selectedIds.some(id => !current.candidates.some(row => row.source.id === id))) throw new CloudSyncError("capacity");
    return store.compareAndSet(AUTOMATIC_ENROLLMENT_KEY, current, { ...current, selectedIds, phase: "saving" as const });
  });
}
/** Uses the existing durable immutable import path; a retry never mints history
 * counts, overwrites a campaign, deletes an original, or enrolls an unowned save. */
export function finishAutomaticCampaignEnrollment(transport: CloudTransport, store: CloudEntryStore) {
  return enrollmentJob(store, async () => {
    const current = await store.read<AutomaticCampaignEnrollment>(AUTOMATIC_ENROLLMENT_KEY);
    if (!current || current.version !== 1) throw new CloudSyncError("storage");
    if (current.phase !== "saving") return current;
    for (const id of current.selectedIds) {
      const candidate = current.candidates.find(row => row.source.id === id);
      if (!candidate || candidate.source.unowned) throw new CloudSyncError("storage");
      const campaignId = candidate.source.campaign.campaignId;
      if (await store.read(`enrolled:${campaignId}`) || await store.read(`retired:${campaignId}`)) continue;
      await importLocalCloudCampaign(candidate.source, candidate.name, transport, store);
    }
    return store.compareAndSet(AUTOMATIC_ENROLLMENT_KEY, current, { ...current, phase: "complete" as const });
  });
}

export function profileForCloudCampaign(state: ReturnType<typeof deserializeGameState>, campaign: CloudCampaignMetadata): LocalPrototypeProfile {
  const id = campaign.campaignId;
  return { ...createFreshProfile(), activeCampaignId: id, tutorialsEnabled: campaign.tutorial.guidance?.mode !== "off",
    campaigns: [{ campaignId: id, name: campaign.name, status: campaign.status, createdAtRealMs: campaign.createdAtRealMs, updatedAtRealMs: campaign.updatedAtRealMs, state }],
    tutorialGuidanceByCampaign: campaign.tutorial.guidance ? { [id]: campaign.tutorial.guidance } : {},
    tutorialIntroDismissedCampaignIds: campaign.tutorial.introDismissed ? [id] : [],
    tutorialDailyRoutineTipAcknowledgments: { [id]: campaign.tutorial.dailyRoutineTipAcknowledgments },
    tutorialDailyRoutinePauseByCampaign: campaign.tutorial.dailyRoutinePause === null ? {} : { [id]: campaign.tutorial.dailyRoutinePause } };
}
