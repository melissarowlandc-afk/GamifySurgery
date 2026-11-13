import { RuntimeCatalogueUnavailable, withRuntimeCatalogue } from "../../mobile/performance/runtimeCatalogue";
import { CLOUD_CAPACITY_LIMITS } from "./codec";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { CloudCodecError, logicalJsonText, sha256Utf8, utf8Bytes } from "./codecJson";
import { CloudCacheError, packCloudCache, unpackCloudCache, type StoredCache } from "./codecCache";
import { prepareCloudImportWire, prepareCloudWire } from "./codecWire";
import type { CloudCacheEntry, CloudCacheRead } from "./cache";
import { CloudSyncError, type CloudCandidate, type CloudCommitRequest, type CloudConfirmed, type CloudImportRequest, type CloudScope } from "./transport";
import type { CloudProgressSummary } from "./progress";
import { copyDescendsFrom, type VerifiedCopyInspection } from "./copySelection";
import { verifiedCopies, type VerifiedSessionSnapshot } from "./verifiedCopyCache";
import { bindJournalInWorker, prepareJournalInWorker, rebaseJournalInWorker } from "./journalCodec";
import { warmJournalInWorker } from "./journalWarm";
import { encodeCloudSnapshot, isSnapshotCopy, SNAPSHOT_BASELINE, snapshotCopy, snapshotEvidence, prepareSnapshotImport } from "./snapshotCodec";
import { importGameEvidence } from "@gamify-surgery/game-domain";
import type { SnapshotLineage } from "./transport";

export type CloudCodecTask =
  | { kind: "journalWarm"; input: Parameters<typeof warmJournalInWorker>[0] }
  | { kind: "journalBind"; input: Parameters<typeof bindJournalInWorker>[0] }
  | { kind: "journalRebase"; input: Parameters<typeof rebaseJournalInWorker>[0] }
  | { kind: "journalPrepare"; input: Parameters<typeof prepareJournalInWorker>[0] }
  | { kind: "encode"; input: Parameters<typeof encodeCloudEvidenceCheckpoint>[0] }
  | { kind: "snapshotEncode"; input: ({ checkpoint: Parameters<typeof encodeCloudEvidenceCheckpoint>[0]["checkpoint"]; state?: never } | { state: import("@gamify-surgery/game-domain").GameState; checkpoint?: never }) & { campaign: CloudCandidate["campaign"]; lineage: SnapshotLineage } }
  | { kind: "snapshotUpgrade"; input: { confirmed: CloudConfirmed; candidate: CloudCandidate | null } }
  | { kind: "snapshotConvert"; input: { copy: CloudConfirmed; base?: CloudConfirmed; convertedBase?: CloudConfirmed; ancestorHashes?: readonly string[] } }
  | { kind: "snapshotImport"; input: Parameters<typeof prepareSnapshotImport>[0] }
  | { kind: "verify"; input: Parameters<typeof loadCloudEvidenceCheckpoint>[0] }
  | { kind: "hydrate"; input: Parameters<typeof loadCloudEvidenceCheckpoint>[0] }
  | { kind: "inspectCopy"; input: CloudConfirmed }
  | { kind: "candidate"; input: { candidate: CloudCandidate; confirmed: CloudConfirmed; scope: CloudScope } }
  | { kind: "freeze"; input: CloudCommitRequest }
  | { kind: "hash"; input: string }
  | { kind: "wire"; input: { request: CloudCommitRequest; issuedAtMs: number } }
  | { kind: "importWire"; input: { request: CloudImportRequest; issuedAtMs: number } }
  | { kind: "packCache"; input: { entry: CloudCacheEntry; expected: number | null } }
  | { kind: "unpackCache"; input: { raw: StoredCache; scope: CloudScope } };
export interface CloudCodecResults {
  journalWarm: Awaited<ReturnType<typeof warmJournalInWorker>>;
  journalBind: Awaited<ReturnType<typeof bindJournalInWorker>>;
  journalRebase: void;
  journalPrepare: Awaited<ReturnType<typeof prepareJournalInWorker>>;
  encode: { snapshot: CloudCandidate["snapshot"]; evidence: CloudCandidate["evidence"]; decodedGameBytes: number };
  snapshotEncode: CloudCandidate;
  snapshotUpgrade: CloudCandidate;
  snapshotConvert: CloudConfirmed;
  snapshotImport: Awaited<ReturnType<typeof prepareSnapshotImport>>;
  verify: { campaign: Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>["campaign"]; evidenceRecords: number; progress: CloudProgressSummary };
  hydrate: VerifiedSessionSnapshot;
  inspectCopy: VerifiedCopyInspection;
  candidate: void;
  freeze: { requestText: string; requestSha256: string };
  hash: string;
  wire: { text: string; sha256: string };
  importWire: { text: string; sha256: string };
  packCache: StoredCache;
  unpackCache: CloudCacheRead;
}
export interface CloudCodecExecutor {
  run<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]>;
  /** Optional native-worker cache release; must refuse while any task is pending. */
  releaseIdle?(): boolean;
}
// Reply-only technical metadata. Never add diagnostics to a candidate, its
// immutable request hash or account save bytes.
const numberRepairReports = new WeakMap<object, readonly string[]>();

async function verify(input: Parameters<typeof loadCloudEvidenceCheckpoint>[0]): Promise<CloudCodecResults["verify"]> {
  const loaded = await verifiedCopies.read(input);
  if (loaded.decodedGameBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) throw new CloudSyncError("capacity");
  if (loaded.evidenceRecords !== input.evidence.records.length) throw new CloudSyncError("corrupt");
  return { campaign: loaded.inspection.campaign, evidenceRecords: loaded.evidenceRecords, progress: loaded.inspection.progress };
}

/** Codec and idempotent journal work shared by the worker/test boundary. No RPCs. */
export async function runCloudCodecTask<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]> {
  let result: unknown;
  let numberRepairs: readonly string[] | undefined;
  switch (task.kind) {
    case "journalWarm": result = await warmJournalInWorker(task.input); break;
    case "journalBind": result = await bindJournalInWorker(task.input); break;
    case "journalRebase": result = await rebaseJournalInWorker(task.input); break;
    case "journalPrepare": result = await prepareJournalInWorker(task.input); break;
    case "encode": {
      const encoded = await encodeCloudEvidenceCheckpoint(task.input);
      if (encoded.sizes.decodedGameBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) throw new CloudSyncError("capacity");
      const evidence = encoded.request.evidence;
      if (!("headerSha256" in evidence)) throw new CloudSyncError("corrupt");
      // Return only the suffix and compressed snapshot, never a second copy of the game or full evidence archive.
      result = { snapshot: encoded.snapshot, evidence, decodedGameBytes: encoded.sizes.decodedGameBytes };
      break;
    }
    case "snapshotEncode": {
      const encoded = await encodeCloudSnapshot({ state: task.input.state ?? importGameEvidence(task.input.checkpoint!.snapshot, task.input.checkpoint!.evidence),
        campaign: task.input.campaign, lineage: task.input.lineage });
      numberRepairs = encoded.numberRepairs;
      result = { saveFormat: 3, lineage: encoded.lineage, campaign: task.input.campaign, snapshot: encoded.snapshot,
        evidence: { headerSha256: encoded.evidence.header.uncompressedSha256, fromRecord: 0, toRecord: 0, records: [] }, usageQuestions: [] }; break;
    }
    case "snapshotImport": result = await prepareSnapshotImport(task.input); break;
    case "snapshotConvert": {
      const { copy, base, convertedBase, ancestorHashes = [] } = task.input;
      if (isSnapshotCopy(copy)) { result = copy; break; }
      const loaded = await verifiedCopies.projection({ ...copy, expectedRevision: copy.revision,
        expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
      const descendant = base && copyDescendsFrom(copy, base);
      if (descendant && convertedBase && copy.snapshot.uncompressedSha256 === base.snapshot.uncompressedSha256) {
        result = { ...convertedBase, ...(copy.priorRecovery ? { priorRecovery: copy.priorRecovery } : {}) }; break;
      }
      const converted = await snapshotCopy(loaded.state, loaded.campaign, copy.revision, copy.acceptedAtMs,
        { branchId: `migration.${copy.snapshot.uncompressedSha256}`, sequence: loaded.sequence,
          parents: [...new Set([copy.snapshot.uncompressedSha256, ...(descendant ? [base!.snapshot.uncompressedSha256, ...(convertedBase ? [convertedBase.snapshot.uncompressedSha256] : [])] : []), ...ancestorHashes])].slice(0, 4) });
      result = { ...converted, ...(copy.priorRecovery ? { priorRecovery: copy.priorRecovery } : {}) }; break;
    }
    case "snapshotUpgrade": {
      const { confirmed, candidate } = task.input;
      const base = await verifiedCopies.projection({ ...confirmed, expectedRevision: confirmed.revision, expectedCampaignId: confirmed.campaignId, expectedBaselineId: confirmed.baselineId });
      const selected = candidate ? await verifiedCopies.projection({ snapshot: candidate.snapshot,
        evidence: candidate.saveFormat === 3 ? await snapshotEvidence() : { header: confirmed.evidence.header, records: [...confirmed.evidence.records, ...candidate.evidence.records] },
        revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: confirmed.campaignId,
        ...(candidate.saveFormat === 3 ? { lineage: candidate.lineage } : {}), expectedBaselineId: candidate.saveFormat === 3 ? SNAPSHOT_BASELINE : confirmed.baselineId }) : base;
      const prior = isSnapshotCopy(confirmed) ? confirmed : await snapshotCopy(base.state, base.campaign, confirmed.revision, confirmed.acceptedAtMs,
        { branchId: `migration.${confirmed.snapshot.uncompressedSha256}`, sequence: base.sequence, parents: [confirmed.snapshot.uncompressedSha256] });
      const lineage = selected.snapshotLineage ?? { branchId: crypto.randomUUID(), sequence: selected.sequence,
        parents: [...new Set([confirmed.snapshot.uncompressedSha256, prior.snapshot.uncompressedSha256])] };
      const encoded = await encodeCloudSnapshot({ state: selected.state, campaign: selected.campaign, lineage });
      result = { saveFormat: 3, lineage, snapshot: encoded.snapshot, campaign: selected.campaign,
        evidence: { headerSha256: encoded.evidence.header.uncompressedSha256, fromRecord: 0, toRecord: 0, records: [] },
        usageQuestions: candidate?.usageQuestions ?? [], ...(!isSnapshotCopy(confirmed) ? { legacyBaseSnapshot: prior.snapshot } : {}) }; break;
    }
    case "verify": result = await verify(task.input); break;
    case "hydrate": result = await verifiedCopies.hydrate(task.input); break;
    case "inspectCopy": result = (await verifiedCopies.read({ ...task.input, expectedRevision: task.input.revision,
      expectedCampaignId: task.input.campaignId, expectedBaselineId: task.input.baselineId })).inspection; break;
    case "candidate": {
      if (task.input.candidate.saveFormat === 3) {
        const { candidate, scope } = task.input;
        if (candidate.snapshot.uncompressedBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes || candidate.snapshot.compressedBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) throw new CloudSyncError("capacity");
        if (candidate.campaign.campaignId !== scope.campaignId || candidate.evidence.records.length || candidate.evidence.fromRecord !== 0 || candidate.evidence.toRecord !== 0)
          throw new CloudSyncError("corrupt");
        const loaded = await verifiedCopies.read({ snapshot: candidate.snapshot, evidence: await snapshotEvidence(), revision: task.input.confirmed.revision,
          expectedRevision: task.input.confirmed.revision, expectedCampaignId: scope.campaignId, expectedBaselineId: SNAPSHOT_BASELINE, lineage: candidate.lineage });
        if (logicalJsonText(JSON.parse(JSON.stringify(loaded.inspection.campaign))) !== logicalJsonText(JSON.parse(JSON.stringify(candidate.campaign)))) throw new CloudSyncError("corrupt");
        if (logicalJsonText(JSON.parse(JSON.stringify(loaded.inspection.lineage))) !== logicalJsonText(JSON.parse(JSON.stringify(candidate.lineage)))) throw new CloudSyncError("corrupt");
        if (candidate.usageQuestions.length > 100 || new Set(candidate.usageQuestions.map(row => row.receipt_id)).size !== candidate.usageQuestions.length) throw new CloudSyncError("corrupt");
        break;
      }
      const { candidate, confirmed, scope } = task.input, delta = candidate.evidence, accepted = confirmed.evidence;
      if (candidate.campaign.campaignId !== scope.campaignId || delta.headerSha256 !== accepted.header.uncompressedSha256 ||
        delta.fromRecord !== accepted.records.length || delta.toRecord !== delta.fromRecord + delta.records.length ||
        delta.records.some((row, i) => row.id !== `e${(delta.fromRecord + i + 1).toString(36)}`)) throw new CloudSyncError("corrupt");
      if (candidate.snapshot.uncompressedBytes > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes ||
        delta.records.reduce((sum, row) => sum + row.content.uncompressedBytes, 0) > 1_000_000 || candidate.usageQuestions.length > 100 ||
        utf8Bytes(JSON.stringify(delta)) + utf8Bytes(JSON.stringify(candidate.usageQuestions)) > 1_000_000) throw new CloudSyncError("capacity");
      const ids = new Set<string>();
      for (const receipt of candidate.usageQuestions) {
        if (ids.has(receipt.receipt_id)) throw new CloudSyncError("corrupt");
        ids.add(receipt.receipt_id);
      }
      try {
        await verify({ snapshot: candidate.snapshot, evidence: { header: accepted.header, records: [...accepted.records, ...delta.records] },
          revision: confirmed.revision, expectedRevision: confirmed.revision, expectedCampaignId: scope.campaignId, expectedBaselineId: confirmed.baselineId });
      } catch (error) { if (error instanceof CloudSyncError && error.code === "capacity") throw error; throw new CloudSyncError("corrupt"); }
      break;
    }
    case "freeze": {
      const requestText = JSON.stringify(task.input);
      if (utf8Bytes(requestText) > CLOUD_CAPACITY_LIMITS.transportBodyBytes) throw new CloudSyncError("capacity");
      result = { requestText, requestSha256: await sha256Utf8(requestText) }; break;
    }
    case "hash": result = await sha256Utf8(task.input); break;
    case "wire": result = await prepareCloudWire(task.input.request, task.input.issuedAtMs); break;
    case "importWire": result = await prepareCloudImportWire(task.input.request, task.input.issuedAtMs); break;
    case "packCache": result = await packCloudCache(task.input.entry, task.input.expected); break;
    case "unpackCache": result = await unpackCloudCache(task.input.raw, task.input.scope); break;
    default: throw new CloudCodecError("worker_payload", "Save processing received an unsupported task. Reload the app and retry.");
  }
  if (result && typeof result === "object") {
    if ("numberRepairs" in result) numberRepairs = (result as { numberRepairs?: readonly string[] }).numberRepairs;
    if (numberRepairs?.length) numberRepairReports.set(result, numberRepairs);
  }
  return result as CloudCodecResults[T["kind"]];
}

export interface CloudCodecFailure { kind: "sync" | "cache" | "codec"; code: string; message: string; retryAfterMs?: number }
export function packCodecFailure(error: unknown): CloudCodecFailure {
  if (error instanceof RuntimeCatalogueUnavailable) return { kind: "codec", code: "worker_unavailable", message: error.message };
  if (error instanceof CloudCacheError) return { kind: "cache", code: error.reason, message: error.message };
  if (error instanceof CloudSyncError) return { kind: "sync", code: error.code, retryAfterMs: error.retryAfterMs, message: error.message };
  if (error instanceof Error && error.name === "DataCloneError") return { kind: "codec", code: "worker_data_clone", message: "Save processing could not transfer the checkpoint. Retry the account save." };
  return { kind: "codec", code: error instanceof CloudCodecError ? error.code : "worker", message: error instanceof Error ? error.message : "Save processing failed." };
}
export function unpackCodecFailure(error: CloudCodecFailure): Error {
  if (error.kind === "cache") return new CloudCacheError(error.code as CloudCacheError["reason"]);
  if (error.kind === "sync") return new CloudSyncError(error.code as CloudSyncError["code"], error.retryAfterMs);
  return new CloudCodecError(error.code, error.message);
}
export interface CloudCodecMessage { id: number; task: CloudCodecTask }
export type CloudCodecReply = { ready: true } | { id: number; started: true } | { id: number; heartbeat: true } |
  { id: number; result: unknown; diagnosticCodes?: readonly string[] } | { id: number; error: CloudCodecFailure };

export async function handleCloudCodecMessage(message: CloudCodecMessage): Promise<CloudCodecReply> {
  try {
    const result = await withRuntimeCatalogue(() => runCloudCodecTask(message.task));
    const diagnosticCodes = result && typeof result === "object" ? numberRepairReports.get(result) : undefined;
    const reply = { id: message.id, result, ...(diagnosticCodes?.length ? { diagnosticCodes } : {}) };
    // The inline executor must exercise the return boundary too. Production's
    // postMessage performs this clone itself, without a second full copy here.
    return import.meta.env?.DEV || import.meta.env?.MODE === "test" ? structuredClone(reply) : reply;
  }
  catch (error) { return { id: message.id, error: packCodecFailure(error) }; }
}

/** A non-cloneable result must produce a classified reply, never an orphaned task. */
export async function dispatchCloudCodecMessage(message: CloudCodecMessage, post: (reply: CloudCodecReply) => void): Promise<void> {
  const reply = await handleCloudCodecMessage(message);
  try { post(reply); }
  catch (error) { post({ id: message.id, error: packCodecFailure(error) }); }
}

/** Serialize expensive tasks inside the worker. The active deadline begins only
 * after this dequeue/start acknowledgement, never during another task's work. */
export function createCloudCodecDispatcher(post: (reply: CloudCodecReply) => void,
  run = dispatchCloudCodecMessage): (message: CloudCodecMessage) => Promise<void> {
  let queue = Promise.resolve();
  return message => {
    const next = queue.then(async () => {
      post({ id: message.id, started: true });
      const heartbeat = setInterval(() => post({ id: message.id, heartbeat: true }), 5_000);
      try { await run(message, post); }
      finally { clearInterval(heartbeat); }
    });
    queue = next.catch(() => {});
    return next;
  };
}
