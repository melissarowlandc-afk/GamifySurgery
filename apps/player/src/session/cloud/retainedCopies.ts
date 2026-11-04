import type { CloudCacheEntry } from "./cache";
import type { CloudCodecExecutor } from "./codecTasks";
import { prepareCloudEvidenceImport } from "./codecEvidence";
import { isCloudCodecProcessingError, logicalJsonText, sha256Utf8 } from "./codecJson";
import { cloudCopyFamily, compareVerifiedProgress, copyDescendsFrom, type VerifiedCopyInspection } from "./copySelection";
import type { CloudEntryStore } from "./entryStorage";
import { inspectLocalCloudSources, prepareLocalCloudSource, separateCloudCampaignId } from "./importCampaigns";
import { accountStorageKey } from "../accountStorageKey";
import { LEGACY_PROTOTYPE_SAVE_KEY, PROTOTYPE_PROFILE_KEY } from "../prototypeStorage";
import { CloudSyncError, type CloudCandidate, type CloudConfirmed, type CloudScope } from "./transport";
import { isSnapshotCopy, SNAPSHOT_BASELINE } from "./snapshotCodec";

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
  parentAliases?: Record<string, string>;
}
const canonical = (value: unknown) => logicalJsonText(JSON.parse(JSON.stringify(value)));

/** A hidden conflict backup preserves resumable states. Uncertain request bytes
 * stay in the active cache until the coordinator reconciles/fences them. */
export async function snapshotConflictBackup(value: { scope: CloudScope; device: CloudCacheEntry; account: CloudConfirmed },
  codec: CloudCodecExecutor, digest: string) {
  try {
  const rows = [...cacheCopyCandidates(value.device), { copy: value.account, usageQuestions: [], source: "account" }];
  const snapshots: { copy: CloudConfirmed; usageQuestions: CloudCandidate["usageQuestions"] }[] = [], parentAliases: Record<string, string> = {};
  const convertedBase = await codec.run({ kind: "snapshotConvert", input: { copy: value.account, ancestorHashes: copyDescendsFrom(value.account, value.device.confirmed) ? [value.device.confirmed.snapshot.uncompressedSha256] : [] } });
  for (const row of rows) {
    const copy = await codec.run({ kind: "snapshotConvert", input: { copy: row.copy, base: value.account, convertedBase } });
    snapshots.push({ copy, usageQuestions: row.usageQuestions });
    parentAliases[await separateCloudCampaignId(row.copy)] = row.copy.campaignId;
  }
  return { scope: value.scope, compactedFrom: digest, parentAliases, snapshots };
  } catch (error) {
    if (isCloudCodecProcessingError(error)) throw error;
    return value; // Individually unreadable original bytes remain exportable.
  }
}

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
    if (candidate.saveFormat === 3 && candidate.campaign?.campaignId === entry.scope.campaignId) {
      result.push({ copy: { ...entry.confirmed, saveFormat: 3, lineage: candidate.lineage, baselineId: SNAPSHOT_BASELINE,
        snapshot: candidate.snapshot, evidence: { header: entry.confirmed.evidence.header, records: [] } },
        usageQuestions: candidate.usageQuestions ?? [], source });
      continue;
    }
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
    if (record?.parentAliases) Object.assign(parents, record.parentAliases);
    if (key.startsWith("conflict:") && record?.scope?.accountId === scope.accountId && record.scope.backendId === scope.backendId) {
      if (record.device) await entry(record.device); if (record.account) await add(record.account);
      for (const row of record.snapshots ?? []) await add(row.copy);
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
  parents?: Readonly<Record<string, string>>; snapshots?: boolean;
}): Promise<VerifiedClinicCopy[]> {
  const { scope, family, codec, store } = options;
  const copies: VerifiedClinicCopy[] = [];
  const rawSources = new Set<string>(), enrolledSources = new Set<string>(), convertedHeads = new Map<string, CloudConfirmed>();
  const parents = options.parents ?? await retainedCopyParents(scope, store, options.entries);
  const belongs = async (id: string) => typeof id === "string" && await cloudCopyFamily(id, parents) === family;
  const add = async (copy: CloudConfirmed, source: string, usageQuestions: CloudCandidate["usageQuestions"] = []) => {
    if (!copy || !await belongs(copy.campaignId)) return;
    try {
      // The shared worker keys verified summaries by actual packed bytes. Do
      // not canonicalize/hash multi-MB copies again on the UI thread here.
      let inspection = await codec.run({ kind: "inspectCopy", input: copy });
      if (options.snapshots && !isSnapshotCopy(copy)) {
        const converted = await codec.run({ kind: "snapshotConvert", input: { copy, base: options.account.find(row => row.campaignId === copy.campaignId), convertedBase: convertedHeads.get(copy.campaignId),
          ancestorHashes: options.entries.filter(entry => copyDescendsFrom(copy, entry.confirmed)).map(entry => entry.confirmed.snapshot.uncompressedSha256) } });
        const checked = await codec.run({ kind: "inspectCopy", input: converted });
        if (checked.stateDigest !== inspection.stateDigest || canonical(checked.campaign) !== canonical(inspection.campaign)) throw new CloudSyncError("corrupt");
        copy = converted; inspection = checked;
      }
      const value = { copy: inspection.lineage ? { ...copy, saveFormat: 3 as const, lineage: inspection.lineage, baselineId: SNAPSHOT_BASELINE } : copy,
        inspection, source, usageQuestions };
      copies.push(value); return value;
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
  for (const copy of options.account) { const value = await add(copy, "account"); if (value) convertedHeads.set(copy.campaignId, value.copy); }
  for (const entry of options.entries) await addEntry(entry, "current");
  // Capture current account-owned strings before enumerating retained strings.
  if (options.storage) {
    const inspected = await inspectLocalCloudSources(scope.accountId, options.storage, store);
    if (inspected.problems.some(problem => problem.startsWith("Browser recovery storage is unavailable"))) throw new CloudSyncError("storage");
  }
  // Inspect frozen enrollment copies before their raw source profiles. Native
  // snapshots include lineage in their checksum: re-importing the same raw
  // state with a new branch ID would invent a divergent older campaign.
  const retained = (await store.entries()).sort((a, b) => Number(a.key.startsWith("raw:")) - Number(b.key.startsWith("raw:")));
  for (const { key, value } of retained) {
    const record = value as any;
    if (key.startsWith("older-copy:") && record?.version === 1) {
      const next = await add(record.copy, key, record.usageQuestions ?? []);
      if (options.snapshots && next && !isSnapshotCopy(record.copy)) {
        const compact = { ...record, copy: next.copy, parentAliases: { ...record.parentAliases,
          [await separateCloudCampaignId(record.copy)]: record.copy.campaignId } };
        const retained = await store.compareAndSet(key, record, compact);
        if (canonical(retained) === canonical(compact) && canonical(await store.read(key)) !== canonical(compact)) throw new CloudSyncError("storage");
      }
    }
    if (key.startsWith("conflict:") && record?.scope?.accountId === scope.accountId && record.scope.backendId === scope.backendId) {
      const start = copies.length;
      for (const row of record.snapshots ?? []) await add(row.copy, key, row.usageQuestions ?? []);
      if (record.device) await addEntry(record.device, key);
      if (record.account) await add(record.account, key);
      if (options.snapshots && !record.compactedFrom && copies.length > start) {
        const originals = [...(record.device ? cacheCopyCandidates(record.device).map(row => row.copy) : []), ...(record.account ? [record.account] : [])];
        if (copies.length - start !== originals.length) continue; // Keep unreadable/unrelated original bytes for support.
        const aliases: Record<string, string> = {};
        for (const copy of originals) aliases[await separateCloudCampaignId(copy)] = copy.campaignId;
        // Immutable active operations remain in the cache until reconciled.
        // This hidden backup only needs each exact verified resumable state.
        const compact = { scope: record.scope, compactedFrom: key.slice(key.lastIndexOf(":") + 1), parentAliases: aliases,
          snapshots: copies.slice(start).map(row => ({ copy: row.copy, usageQuestions: row.usageQuestions })) };
        await store.compareAndSet(key, record, compact);
      }
    }
    if (key.startsWith("import:") && record?.compactedCopy) {
      const imported = await add(record.compactedCopy, key);
      if (imported && record.verified && record.sourceDigest === key.slice("import:".length)) enrolledSources.add(record.sourceDigest);
      continue;
    }
    if (key.startsWith("import:") && record?.operation?.requestText) {
      try {
        if (await sha256Utf8(record.operation.requestText) !== record.operation.requestSha256) continue;
        const request = JSON.parse(record.operation.requestText);
        const imported = await add({ campaignId: request.campaignId, revision: "1", acceptedAtMs: 0, baselineId: request.baselineId,
          snapshot: request.snapshot, evidence: request.evidence, ...(request.saveFormat === 3 ? { saveFormat: 3, lineage: request.lineage } : {}) }, key);
        if (imported && record.verified && record.sourceDigest === key.slice("import:".length)) enrolledSources.add(record.sourceDigest);
        if (options.snapshots && record.verified && imported && request.saveFormat !== 3)
          await store.compareAndSet(key, record, { sourceDigest: record.sourceDigest, verified: true, compactedCopy: imported.copy });
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
        // This exact state+metadata was already verified by enrollment and is
        // present above with its original ancestry. Keep the raw bytes, but
        // don't manufacture a second snapshot identity for them. Changed,
        // unverified or unreadable sources still follow normal discovery.
        const enrolledDigest = await sha256Utf8(JSON.stringify({ serializedState: source.serializedState, campaign: source.campaign }));
        if (enrolledSources.has(enrolledDigest)) continue;
        const sourceHash = await sha256Utf8(canonical({ state: source.serializedState, campaign: source.campaign }));
        if (rawSources.has(sourceHash)) continue;
        rawSources.add(sourceHash);
        const prepared = options.snapshots ? await codec.run({ kind: "snapshotImport", input: { serializedState: source.serializedState, campaign: source.campaign, branchId: `raw.${sourceHash}` } }) : await prepareLocalCloudSource(source, source.campaign, "retained-source");
        await add({ campaignId: source.campaign.campaignId, revision: "1", acceptedAtMs: 0, baselineId: prepared.envelope.baselineId,
          snapshot: prepared.snapshot, evidence: prepared.packedEvidence, ...("saveFormat" in prepared ? { saveFormat: 3, lineage: prepared.lineage } : {}) }, key);
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
