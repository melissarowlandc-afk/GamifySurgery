import { CLOUD_CAPACITY_LIMITS } from "./codec";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { CloudCodecError, sha256Utf8, utf8Bytes } from "./codecJson";
import { CloudCacheError, packCloudCache, unpackCloudCache, type StoredCache } from "./codecCache";
import { prepareCloudImportWire, prepareCloudWire } from "./codecWire";
import type { CloudCacheEntry, CloudCacheRead } from "./cache";
import { CloudSyncError, type CloudCandidate, type CloudCommitRequest, type CloudConfirmed, type CloudImportRequest, type CloudScope } from "./transport";
import { cloudProgress, type CloudProgressSummary } from "./progress";
import { inspectVerifiedCopy, type VerifiedCopyInspection } from "./copySelection";
import { bindJournalInWorker, prepareJournalInWorker } from "./journalCodec";
import { warmJournalInWorker } from "./journalWarm";
import { serializeGameState } from "@gamify-surgery/game-domain";

export type CloudCodecTask =
  | { kind: "journalWarm"; input: Parameters<typeof warmJournalInWorker>[0] }
  | { kind: "journalBind"; input: Parameters<typeof bindJournalInWorker>[0] }
  | { kind: "journalPrepare"; input: Parameters<typeof prepareJournalInWorker>[0] }
  | { kind: "encode"; input: Parameters<typeof encodeCloudEvidenceCheckpoint>[0] }
  | { kind: "verify"; input: Parameters<typeof loadCloudEvidenceCheckpoint>[0] }
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
  journalPrepare: Awaited<ReturnType<typeof prepareJournalInWorker>>;
  encode: { snapshot: CloudCandidate["snapshot"]; evidence: CloudCandidate["evidence"]; decodedGameBytes: number };
  verify: { campaign: Awaited<ReturnType<typeof loadCloudEvidenceCheckpoint>>["campaign"]; evidenceRecords: number; progress: CloudProgressSummary };
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
}

async function verify(input: Parameters<typeof loadCloudEvidenceCheckpoint>[0]): Promise<CloudCodecResults["verify"]> {
  const loaded = await loadCloudEvidenceCheckpoint(input);
  if (utf8Bytes(serializeGameState(loaded.state)) > CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes) throw new CloudSyncError("capacity");
  if (loaded.checkpoint.evidence.records.length !== input.evidence.records.length) throw new CloudSyncError("corrupt");
  return { campaign: loaded.campaign, evidenceRecords: loaded.checkpoint.evidence.records.length, progress: cloudProgress(loaded.state) };
}

/** Codec and idempotent journal work shared by the worker/test boundary. No RPCs. */
export async function runCloudCodecTask<T extends CloudCodecTask>(task: T): Promise<CloudCodecResults[T["kind"]]> {
  let result: unknown;
  switch (task.kind) {
    case "journalWarm": result = await warmJournalInWorker(task.input); break;
    case "journalBind": result = await bindJournalInWorker(task.input); break;
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
    case "verify": result = await verify(task.input); break;
    case "inspectCopy": result = await inspectVerifiedCopy(task.input); break;
    case "candidate": {
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
  return result as CloudCodecResults[T["kind"]];
}

export interface CloudCodecFailure { kind: "sync" | "cache" | "codec"; code: string; message: string; retryAfterMs?: number }
export function packCodecFailure(error: unknown): CloudCodecFailure {
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
export type CloudCodecReply = { ready: true } | { id: number; result: unknown } | { id: number; error: CloudCodecFailure };

export async function handleCloudCodecMessage(message: CloudCodecMessage): Promise<CloudCodecReply> {
  try {
    const reply = { id: message.id, result: await runCloudCodecTask(message.task) };
    // The inline executor must exercise the return boundary too. Production's
    // postMessage performs this clone itself, without a second full copy here.
    return import.meta.env.DEV || import.meta.env.MODE === "test" ? structuredClone(reply) : reply;
  }
  catch (error) { return { id: message.id, error: packCodecFailure(error) }; }
}

/** A non-cloneable result must produce a classified reply, never an orphaned task. */
export async function dispatchCloudCodecMessage(message: CloudCodecMessage, post: (reply: CloudCodecReply) => void): Promise<void> {
  const reply = await handleCloudCodecMessage(message);
  try { post(reply); }
  catch (error) { post({ id: message.id, error: packCodecFailure(error) }); }
}
