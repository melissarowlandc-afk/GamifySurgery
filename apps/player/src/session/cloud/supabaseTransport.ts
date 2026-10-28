import { cloudCodec } from "./codecWorker";
import { compressedHash } from "./codecWire";
export { cloudWireBlob, type CloudWireBlob } from "./codecWire";
import { assertCloudRevision } from "./codec";
import { compressCloudText, decompressCloudText, type CloudCompressedText } from "./codecCompression";
import { decompressCloudEvidencePages, type CloudEvidencePage } from "./codecEvidencePages";
import { logicalJsonText, parseCodecJson } from "./codecJson";
import {
  CLOUD_SYNC_PROTOCOL, CloudSyncError, type CloudCapabilities, type CloudCampaignHead, type CloudCampaignSummary,
  type CloudCommitRequest, type CloudCommitReceipt, type CloudConfirmed, type CloudFrozenOperation,
  type CloudLease, type CloudOperationOutcome, type CloudTransport, type CloudImportRequest,
} from "./transport";

/** Structural interface accepts SupabaseClient without generating/storing credentials. */
export interface CloudRpcClient {
  rpc(name: string, args: Record<string, unknown>): PromiseLike<{ data: unknown; error: unknown }>;
}
type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new CloudSyncError("corrupt");
  return value as ObjectValue;
}
function string(value: unknown): string { if (typeof value !== "string" || !value) throw new CloudSyncError("corrupt"); return value; }
function integer(value: unknown): number { if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new CloudSyncError("corrupt"); return value; }
function timestamp(value: unknown): number { const ms = Date.parse(string(value)); if (!Number.isFinite(ms)) throw new CloudSyncError("corrupt"); return ms; }
function revision(value: unknown): string { assertCloudRevision(value, true); return value; }
async function packed(value: unknown): Promise<CloudCompressedText> {
  const result = object(value);
  if (Object.keys(result).sort().join(",") !== ["encoding", "dataBase64", "compressedBytes", "compressedSha256", "uncompressedBytes", "uncompressedSha256"].sort().join(",")) throw new CloudSyncError("corrupt");
  if (result.encoding !== "gzip" || typeof result.dataBase64 !== "string" || result.dataBase64.length > 8_000_000 ||
    typeof result.uncompressedSha256 !== "string" || !/^[a-f0-9]{64}$/.test(result.uncompressedSha256)) throw new CloudSyncError("corrupt");
  if (integer(result.compressedBytes) < 1 || integer(result.uncompressedBytes) < 1 || Number(result.uncompressedBytes) > 6_000_000) throw new CloudSyncError("corrupt");
  if (typeof result.compressedSha256 !== "string" || !/^[a-f0-9]{64}$/.test(result.compressedSha256) ||
    await compressedHash(result as unknown as CloudCompressedText) !== result.compressedSha256) throw new CloudSyncError("corrupt");
  return result as unknown as CloudCompressedText;
}
function mappedError(error: unknown): CloudSyncError {
  if (error instanceof CloudSyncError) return error;
  const detail = (error ?? {}) as { code?: string; message?: string; status?: number; details?: string };
  const message = detail.message?.toLowerCase() ?? "";
  if (detail.status === 401 || ["PGRST301", "PGRST302", "bad_jwt"].includes(detail.code ?? "")) return new CloudSyncError("auth");
  if (detail.code === "40001") return new CloudSyncError("revision");
  if (detail.code === "54000") return new CloudSyncError("capacity");
  if (detail.code === "P0001" && message.includes("rate")) {
    let seconds = 60;
    try { seconds = Math.min(60, Math.max(1, Number(JSON.parse(detail.details ?? "{}").retryAfterSeconds) || 60)); } catch { /* bounded default */ }
    return new CloudSyncError("throttled", seconds * 1_000);
  }
  if (message.includes("deletion") || message.includes("deleted")) return new CloudSyncError("deleted");
  if (message.includes("notice")) return new CloudSyncError("notice");
  if (message.includes("update required") || message.includes("protocol")) return new CloudSyncError("protocol");
  if (message.includes("writing unavailable") || message.includes("enrollment unavailable")) return new CloudSyncError("disabled");
  if (message.includes("expired or future cloud operation")) return new CloudSyncError("operation-expired");
  if (detail.code === "55000") return new CloudSyncError("writer");
  if (detail.code === "42501") return new CloudSyncError("revoked");
  if (detail.code === "22023" || detail.code === "23505") return new CloudSyncError("corrupt");
  return new CloudSyncError("network");
}

/** Thin adapter to 20261018000100_beta2_cloud_saves.sql's named protocol-3 RPCs. */
export class SupabaseCloudTransport implements CloudTransport {
  private readonly heads = new Map<string, CloudCampaignHead>();
  private readonly tokens = new Map<string, string>();
  constructor(private readonly client: CloudRpcClient, private readonly accountId: string,
    private readonly currentAccountId: () => Promise<string | null>, private readonly now: () => number = () => Date.now()) {}
  private async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([(async () => {
        if (await this.currentAccountId() !== this.accountId) throw new CloudSyncError("auth");
        const { data, error } = await this.client.rpc(name, args);
        if (await this.currentAccountId() !== this.accountId) throw new CloudSyncError("auth");
        if (error) throw error;
        return data;
      })(), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new CloudSyncError("network")), 30_000); })]);
    } catch (error) { throw mappedError(error); }
    finally { clearTimeout(timer); }
  }
  async capabilities(): Promise<CloudCapabilities> {
    const data = object(await this.call("beta2_cloud_access", { p_protocol: CLOUD_SYNC_PROTOCOL }));
    return { accountId: this.accountId, enabled: data.enabled === true, writesEnabled: data.writesEnabled === true,
      admitted: true, noticeAccepted: data.noticeAccepted === true, deletionRequested: false, minProtocol: integer(data.protocolVersion),
      enrollmentsEnabled: data.enrollmentsEnabled === true, enrolled: data.enrolled === true,
      quotaWarning: data.quota != null && object(data.quota).warning === true };
  }
  async list(): Promise<readonly CloudCampaignSummary[]> {
    const data = object(await this.call("beta2_cloud_list", { p_protocol: CLOUD_SYNC_PROTOCOL }));
    if (!Array.isArray(data.campaigns) || data.campaigns.length > 2) throw new CloudSyncError("corrupt");
    const serverNowMs = timestamp(data.serverTime);
    return data.campaigns.map(value => {
      const row = object(value);
      if (row.status !== "resumable" && row.status !== "archived" || typeof row.writerActive !== "boolean") throw new CloudSyncError("corrupt");
      const result: CloudCampaignSummary = { campaignId: string(row.campaignId), name: string(row.name), status: row.status,
        revision: revision(row.revision), writerGeneration: revision(row.writerGeneration), writerActive: row.writerActive,
        priorRevision: row.priorRevision == null ? null : revision(row.priorRevision), evidenceHighWater: integer(row.evidenceHighWater),
        serverNowMs, acceptedAtMs: timestamp(row.updatedAt) };
      if (result.priorRevision != null && BigInt(result.priorRevision) >= BigInt(result.revision) || result.evidenceHighWater! > 50_000) throw new CloudSyncError("corrupt");
      this.heads.set(result.campaignId, result); return result;
    });
  }
  async head(campaignId: string): Promise<CloudCampaignHead> {
    const found = (await this.list()).find(row => row.campaignId === campaignId);
    if (!found) throw new CloudSyncError("corrupt");
    return found;
  }
  async load(campaignId: string, expectedRevision?: string): Promise<CloudConfirmed> {
    const data = object(await this.call("beta2_cloud_load", { p_protocol: CLOUD_SYNC_PROTOCOL, p_campaign_id: campaignId, p_revision: expectedRevision ?? null }));
    const snapshot = await packed(data.snapshot), evidence = object(data.evidence);
    if (snapshot.compressedBytes > 3_000_000 || snapshot.uncompressedBytes > 3_000_000) throw new CloudSyncError("corrupt");
    if (!Array.isArray(evidence.pages) || evidence.pages.length > 512) throw new CloudSyncError("corrupt");
    const pages: CloudEvidencePage[] = [];
    for (const value of evidence.pages) {
      const row = object(value); pages.push({ firstRecord: integer(row.firstRecord), recordCount: integer(row.recordCount), content: await packed(row.content) });
    }
    const header = await packed(evidence.header);
    if (header.compressedBytes > 1_000_000 || pages.some(page => page.content.compressedBytes > 1_000_000)) throw new CloudSyncError("corrupt");
    if (snapshot.uncompressedBytes + header.uncompressedBytes + pages.reduce((sum, page) => sum + page.content.uncompressedBytes, 0) > 6_000_000) throw new CloudSyncError("corrupt");
    try {
    const rows = await decompressCloudEvidencePages(pages), records: { id: string; content: CloudCompressedText }[] = [];
    // The existing format-2 hydrator consumes rows. This conversion is local;
    // accepted server pages stay sealed and are never re-uploaded/repacked.
    for (let index = 0; index < rows.length; index += 16) records.push(...await Promise.all(rows.slice(index, index + 16).map(async row => ({
      id: string(row.id), content: await compressCloudText(logicalJsonText(row), "gzip"),
    }))));
    const envelope = object(parseCodecJson(await decompressCloudText(snapshot)));
    if (integer(envelope.evidenceHighWater) !== records.length) throw new CloudSyncError("corrupt");
    const loadedRevision = revision(data.revision);
    if (expectedRevision && expectedRevision !== loadedRevision) throw new CloudSyncError("revision");
    const confirmed: CloudConfirmed = { campaignId, revision: loadedRevision, acceptedAtMs: timestamp(data.acceptedAt),
      snapshot, evidence: { header, records }, baselineId: string(envelope.baselineId) };
    return confirmed;
    } catch (error) { throw error instanceof CloudSyncError ? error : new CloudSyncError("corrupt"); }
  }
  async acquire(input: Parameters<CloudTransport["acquire"]>[0]): Promise<CloudLease> {
    const head = input.expectedWriterGeneration === undefined ? await this.head(input.campaignId) :
      { ...this.heads.get(input.campaignId), revision: input.expectedRevision, writerGeneration: input.expectedWriterGeneration };
    if (head.revision !== input.expectedRevision) throw new CloudSyncError("revision");
    let token = input.writerToken ?? this.tokens.get(input.operationId);
    if (!token) { token = Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join(""); this.tokens.set(input.operationId, token); }
    return this.leaseCall(input.campaignId, input.takeover ? "takeover" : "acquire", input.expectedRevision, head.writerGeneration!, token);
  }
  private async leaseCall(campaignId: string, action: string, expectedRevision: string, writerGeneration: string, writerToken: string): Promise<CloudLease> {
    const data = object(await this.call("beta2_cloud_lease", { p_protocol: CLOUD_SYNC_PROTOCOL, p_campaign_id: campaignId, p_action: action,
      p_expected_revision: expectedRevision, p_writer_generation: writerGeneration, p_writer_token: writerToken }));
    const result: CloudLease = { campaignId, revision: revision(data.revision), writerGeneration: revision(data.writerGeneration),
      writerToken, expiresAtMs: action === "release" ? timestamp(data.serverTime) : timestamp(data.expiresAt),
      serverNowMs: timestamp(data.serverTime), writerActive: action !== "release" };
    this.heads.set(campaignId, result); return result;
  }
  async renew(input: Parameters<CloudTransport["renew"]>[0]): Promise<CloudLease> {
    const head = this.heads.get(input.campaignId);
    if (!head) throw new CloudSyncError("writer");
    return this.leaseCall(input.campaignId, "renew", head.revision, input.writerGeneration, input.writerToken);
  }
  async release(input: Parameters<CloudTransport["release"]>[0]): Promise<void> {
    const head = this.heads.get(input.campaignId);
    if (!head) throw new CloudSyncError("writer");
    await this.leaseCall(input.campaignId, "release", head.revision, input.writerGeneration, input.writerToken);
  }
  async prepare(request: CloudCommitRequest, issuedAtMs: number): Promise<{ text: string; sha256: string }> {
    return cloudCodec.run({ kind: "wire", input: { request, issuedAtMs } });
  }
  async prepareImport(request: CloudImportRequest, issuedAtMs: number): Promise<{ text: string; sha256: string }> {
    return cloudCodec.run({ kind: "importWire", input: { request, issuedAtMs } });
  }
  async acceptNotice(version: string): Promise<void> {
    await this.call("beta2_accept_cloud_notice", { p_protocol: CLOUD_SYNC_PROTOCOL, p_version: version });
  }
  async deleteMyData(): Promise<void> {
    await this.call("beta2_delete_my_data", { p_scope: "all-account-data.v1", p_notice_version: "beta2.cloud.v1" });
  }
  async deleteCampaign(input: { campaignId: string; expectedRevision: string }): Promise<void> {
    assertCloudRevision(input.expectedRevision);
    const data = object(await this.call("beta2_cloud_delete_campaign", { p_protocol: CLOUD_SYNC_PROTOCOL,
      p_campaign_id: input.campaignId, p_expected_revision: input.expectedRevision }));
    if (data.campaignId !== input.campaignId || data.deleted !== true) throw new CloudSyncError("corrupt");
    this.heads.delete(input.campaignId);
  }
  private receipt(value: unknown, campaignId: string, operation: CloudFrozenOperation): CloudCommitReceipt {
    const data = object(value), request = JSON.parse(operation.requestText) as CloudCommitRequest;
    if (revision(data.writerGeneration) !== (request.writerGeneration ?? "1")) throw new CloudSyncError("corrupt");
    const head = this.heads.get(campaignId);
    const result: CloudCommitReceipt = { operationId: string(data.operationId), requestSha256: string(data.requestSha256), campaignId,
      revision: revision(data.revision), snapshotSha256: string(data.snapshotSha256), snapshotBytes: integer(data.snapshotBytes),
      acceptedAtMs: timestamp(data.acceptedAt), evidenceHighWater: integer(data.evidenceHighWater), usageReceiptIds: (request.usageQuestions ?? []).map(r => r.receipt_id) };
    if (head && BigInt(result.revision) >= BigInt(head.revision)) this.heads.set(campaignId, { ...head, revision: result.revision });
    return result;
  }
  async commit(operation: CloudFrozenOperation): Promise<CloudCommitReceipt> {
    const wire = operation.wireRequest;
    if (!wire || await cloudCodec.run({ kind: "hash", input: wire.text }) !== wire.sha256) throw new CloudSyncError("corrupt");
    const request = JSON.parse(operation.requestText) as CloudCommitRequest;
    return this.receipt(await this.call("beta2_cloud_write", { p_request_text: wire.text, p_request_sha256: wire.sha256 }), request.campaignId, operation);
  }
  async importCampaign(operation: CloudFrozenOperation): Promise<CloudCommitReceipt> {
    const receipt = await this.commit(operation), request = JSON.parse(operation.requestText) as CloudImportRequest;
    if (!this.heads.has(request.campaignId)) this.heads.set(request.campaignId, { campaignId: request.campaignId, revision: receipt.revision,
      writerGeneration: "1", writerActive: true, serverNowMs: receipt.acceptedAtMs, priorRevision: null, evidenceHighWater: receipt.evidenceHighWater });
    return receipt;
  }
  async operation(campaignId: string, operationId: string, operation?: CloudFrozenOperation): Promise<CloudOperationOutcome> {
    const data = object(await this.call("beta2_cloud_operation", { p_protocol: CLOUD_SYNC_PROTOCOL, p_operation_id: operationId }));
    if (!operation || operation.operationId !== operationId) throw new CloudSyncError("corrupt");
    if (data.status === "accepted") return { status: "committed", receipt: this.receipt(data.receipt, campaignId, operation) };
    if (data.status !== "unknown") throw new CloudSyncError("corrupt");
    return this.now() - operation.createdAtMs >= 7 * 86_400_000 ? { status: "expired" } : { status: "missing" };
  }
}
