import type { CloudCacheEntry } from "./cache";
import type { CloudCodecExecutor } from "./codecTasks";
import { prepareCloudEvidenceImport } from "./codecEvidence";
import { isCloudCodecProcessingError, logicalJsonText, sha256Utf8 } from "./codecJson";
import { cloudCopyFamily, compareVerifiedProgress, type VerifiedCopyInspection } from "./copySelection";
import type { CloudEntryStore } from "./entryStorage";
import { inspectLocalCloudSources, separateCloudCampaignId } from "./importCampaigns";
import { accountStorageKey } from "../accountStorageKey";
import { LEGACY_PROTOTYPE_SAVE_KEY, PROTOTYPE_PROFILE_KEY } from "../prototypeStorage";
import { CloudSyncError, type CloudCandidate, type CloudConfirmed, type CloudScope } from "./transport";

export interface VerifiedClinicCopy {
  copy: CloudConfirmed;
  inspection: VerifiedCopyInspection;
  usageQuestions: CloudCandidate["usageQuestions"];
  source: string;
}
export interface ProtectedClinicCopy {
  version: 1;
  family: string;
  copy: CloudConfirmed;
  usageQuestions: CloudCandidate["usageQuestions"];
  reason: string;
}
const canonical = (value: unknown) => logicalJsonText(JSON.parse(JSON.stringify(value)));

/** Readback is mandatory before replacing any cache or account branch. These
 * IDB records are recovery data, never auxiliary quota-eviction candidates. */
export async function protectClinicCopy(store: CloudEntryStore, family: string, value: VerifiedClinicCopy, reason: string) {
  const record: ProtectedClinicCopy = { version: 1, family, copy: value.copy, usageQuestions: value.usageQuestions, reason };
  const key = `older-copy:${family}:${await sha256Utf8(canonical({ copy: record.copy, usageQuestions: record.usageQuestions }))}`;
  const retained = await store.create(key, record);
  if (canonical(retained.copy) !== canonical(record.copy) || canonical(retained.usageQuestions) !== canonical(record.usageQuestions) ||
    canonical(await store.read(key)) !== canonical(retained)) throw new CloudSyncError("storage");
  return key;
}

export function cacheCopyCandidates(entry: CloudCacheEntry): { copy: CloudConfirmed; usageQuestions: CloudCandidate["usageQuestions"]; source: string }[] {
  if (!entry?.confirmed || !entry.scope) return [];
  const result = [{ copy: entry.confirmed, usageQuestions: [], source: "cache-confirmed" } as { copy: CloudConfirmed; usageQuestions: CloudCandidate["usageQuestions"]; source: string }];
  const pending = entry.recovery;
  const candidates: { candidate: CloudCandidate; source: string }[] = [];
  if (pending?.inFlight) {
    try { candidates.push({ candidate: JSON.parse(pending.inFlight.requestText), source: "in-flight" }); } catch { /* Original bytes remain exportable. */ }
  }
  if (pending?.following) candidates.push({ candidate: pending.following, source: "following" });
  for (const { candidate, source } of candidates) {
    const delta = candidate.evidence, base = entry.confirmed.evidence;
    if (!delta || !Array.isArray(delta.records) || !Array.isArray(base?.records) || !base.header ||
      delta.headerSha256 !== base.header.uncompressedSha256 || delta.fromRecord !== base.records.length ||
      delta.toRecord !== delta.fromRecord + delta.records.length || candidate.campaign?.campaignId !== entry.scope.campaignId) continue;
    result.push({ copy: { ...entry.confirmed, snapshot: candidate.snapshot, evidence: { header: base.header, records: [...base.records, ...delta.records] } },
      usageQuestions: Array.isArray(candidate.usageQuestions) ? candidate.usageQuestions : [], source });
  }
  return result;
}

/** Older releases used opaque branch IDs. Their retained original checkpoint
 * cryptographically proves the parent ID; names/timestamps never infer kinship. */
export async function retainedCopyParents(scope: Pick<CloudScope, "backendId" | "accountId">, store: CloudEntryStore,
  entries: readonly CloudCacheEntry[]): Promise<Record<string, string>> {
  const parents: Record<string, string> = {};
  const add = async (copy: CloudConfirmed) => {
    if (copy?.campaignId && /^[a-f0-9]{64}$/.test(copy.snapshot?.uncompressedSha256 ?? "") &&
      /^[a-f0-9]{64}$/.test(copy.evidence?.header?.uncompressedSha256 ?? "")) parents[await separateCloudCampaignId(copy)] = copy.campaignId;
  };
  const entry = async (value: CloudCacheEntry) => {
    if (value?.scope?.accountId !== scope.accountId || value.scope.backendId !== scope.backendId) return;
    for (const row of cacheCopyCandidates(value)) await add(row.copy);
  };
  for (const value of entries) await entry(value);
  for (const { key, value } of await store.entries()) {
    const record = value as any;
    if (key.startsWith("conflict:") && record?.scope?.accountId === scope.accountId && record.scope.backendId === scope.backendId) {
      if (record.device) await entry(record.device); if (record.account) await add(record.account);
    }
    if (key.startsWith("older-copy:") && record?.version === 1) await add(record.copy);
  }
  return parents;
}

/** Include old immutable raw profiles, not just the current localStorage value.
 * Enrolled/retired markers deliberately do not filter recovery discovery. */
export async function discoverClinicCopies(options: {
  scope: CloudScope; family: string; codec: CloudCodecExecutor; store: CloudEntryStore;
  entries: readonly CloudCacheEntry[]; account: readonly CloudConfirmed[]; storage?: Pick<Storage, "getItem">;
  parents?: Readonly<Record<string, string>>;
}): Promise<VerifiedClinicCopy[]> {
  const { scope, family, codec, store } = options;
  const copies: VerifiedClinicCopy[] = [];
  const verified = new Map<string, VerifiedCopyInspection>();
  const rawSources = new Set<string>();
  const parents = options.parents ?? await retainedCopyParents(scope, store, options.entries);
  const belongs = async (id: string) => typeof id === "string" && await cloudCopyFamily(id, parents) === family;
  const add = async (copy: CloudConfirmed, source: string, usageQuestions: CloudCandidate["usageQuestions"] = []) => {
    if (!copy || !await belongs(copy.campaignId)) return;
    try {
      const key = await sha256Utf8(canonical({ campaignId: copy.campaignId, snapshot: copy.snapshot, evidence: copy.evidence,
        revision: copy.revision, baselineId: copy.baselineId, priorRecovery: copy.priorRecovery ?? null }));
      let inspection = verified.get(key);
      if (!inspection) { inspection = await codec.run({ kind: "inspectCopy", input: copy }); verified.set(key, inspection); }
      copies.push({ copy, inspection, source, usageQuestions });
    } catch (error) {
      // An unavailable worker/storage is a real failure, not permission to use an
      // older copy. Only individually corrupt historical copies may be skipped.
      if (isCloudCodecProcessingError(error)) throw error;
      if (error instanceof CloudSyncError && error.code !== "corrupt") throw error;
    }
  };
  const addEntry = async (entry: CloudCacheEntry, prefix: string) => {
    if (entry?.scope?.accountId !== scope.accountId || entry.scope.backendId !== scope.backendId) return;
    for (const row of cacheCopyCandidates(entry)) await add(row.copy, `${prefix}:${row.source}`, row.usageQuestions);
  };
  for (const copy of options.account) await add(copy, "account");
  for (const entry of options.entries) await addEntry(entry, "current");
  // Capture current account-owned strings before enumerating retained strings.
  if (options.storage) {
    const inspected = await inspectLocalCloudSources(scope.accountId, options.storage, store);
    if (inspected.problems.some(problem => problem.startsWith("Browser recovery storage is unavailable"))) throw new CloudSyncError("storage");
  }
  const retained = await store.entries();
  for (const { key, value } of retained) {
    const record = value as any;
    if (key.startsWith("older-copy:") && record?.version === 1) await add(record.copy, key, record.usageQuestions ?? []);
    if (key.startsWith("conflict:") && record?.scope?.accountId === scope.accountId && record.scope.backendId === scope.backendId) {
      if (record.device) await addEntry(record.device, key);
      if (record.account) await add(record.account, key);
    }
    if (key.startsWith("import:") && record?.operation?.requestText) {
      try {
        if (await sha256Utf8(record.operation.requestText) !== record.operation.requestSha256) continue;
        const request = JSON.parse(record.operation.requestText);
        await add({ campaignId: request.campaignId, revision: "1", acceptedAtMs: 0, baselineId: request.baselineId,
          snapshot: request.snapshot, evidence: request.evidence }, key);
      } catch (error) {
        if (isCloudCodecProcessingError(error)) throw error;
        // Keep unreadable bytes for support/export.
      }
    }
    if (!key.startsWith("raw:") || typeof record?.text !== "string" || await sha256Utf8(record.text) !== record.sha256) continue;
    const keys = [PROTOTYPE_PROFILE_KEY, LEGACY_PROTOTYPE_SAVE_KEY].map(base => accountStorageKey(base, scope.accountId));
    if (!keys.includes(record.sourceKey)) continue;
    const inspected = await inspectLocalCloudSources(scope.accountId, { getItem: name => name === record.sourceKey ? record.text : null }, store);
    for (const source of inspected.sources) {
      if (source.error || source.unowned || !await belongs(source.campaign.campaignId)) continue;
      try {
        const sourceHash = await sha256Utf8(canonical({ state: source.serializedState, campaign: source.campaign }));
        if (rawSources.has(sourceHash)) continue;
        rawSources.add(sourceHash);
        const prepared = await prepareCloudEvidenceImport({ serializedState: source.serializedState, campaign: source.campaign, operationId: "retained-source" });
        await add({ campaignId: source.campaign.campaignId, revision: "1", acceptedAtMs: 0, baselineId: prepared.envelope.baselineId,
          snapshot: prepared.snapshot, evidence: prepared.packedEvidence }, key);
      } catch (error) {
        if (isCloudCodecProcessingError(error)) throw error;
        // Invalid legacy source remains protected, never becomes a fresh game.
      }
    }
  }
  return copies.sort((left, right) => compareVerifiedProgress(right.inspection, left.inspection) ||
    // Identical gameplay: the accepted following metadata is the latest local
    // intention. Otherwise prefer a verified head, avoiding needless imports.
    sourcePriority(right.source) - sourcePriority(left.source) || (left.source < right.source ? -1 : left.source > right.source ? 1 : 0));
}
function sourcePriority(source: string): number {
  return source === "current:following" ? 4 : source === "current:in-flight" ? 3 : source === "account" ? 2 : 1;
}

export async function retainedProgressIsNewer(options: Parameters<typeof discoverClinicCopies>[0], current: CloudConfirmed): Promise<boolean> {
  const [copies, inspected] = await Promise.all([discoverClinicCopies(options), options.codec.run({ kind: "inspectCopy", input: current })]);
  return Boolean(copies[0] && compareVerifiedProgress(copies[0].inspection, inspected) > 0);
}
