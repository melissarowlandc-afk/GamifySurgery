import { CLOUD_CAPACITY_LIMITS } from "./codec";
import { decompressCloudText, type CloudCompressedText } from "./codecCompression";
import { compressCloudEvidencePages } from "./codecEvidencePages";
import { sha256Utf8, utf8Bytes } from "./codecJson";
import { CLOUD_SYNC_PROTOCOL, CloudSyncError, type CloudCommitRequest, type CloudImportRequest } from "./transport";

export interface CloudWireBlob extends CloudCompressedText { compressedSha256: string }
export async function compressedHash(value: CloudCompressedText): Promise<string> {
  if (value.encoding !== "gzip" || !Number.isSafeInteger(value.compressedBytes) || value.compressedBytes < 1 || value.compressedBytes > 6_000_000 ||
  value.dataBase64.length > Math.ceil(value.compressedBytes / 3) * 4 || value.dataBase64.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value.dataBase64)) throw new CloudSyncError("corrupt");
  let bytes: Uint8Array<ArrayBuffer>;
  try { bytes = Uint8Array.from(atob(value.dataBase64), character => character.charCodeAt(0)); } catch { throw new CloudSyncError("corrupt"); }
  if (bytes.byteLength !== value.compressedBytes) throw new CloudSyncError("corrupt");
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), byte => byte.toString(16).padStart(2, "0")).join("");
}
export async function cloudWireBlob(value: CloudCompressedText): Promise<CloudWireBlob> {
  return { encoding: value.encoding, dataBase64: value.dataBase64, compressedBytes: value.compressedBytes,
  uncompressedBytes: value.uncompressedBytes, uncompressedSha256: value.uncompressedSha256, compressedSha256: await compressedHash(value) };
}
export async function prepareCloudWire(request: CloudCommitRequest, issuedAtMs: number): Promise<{ text: string; sha256: string }> {
  const recordTexts: string[] = [];
  for (const row of request.evidence.records) recordTexts.push(await decompressCloudText(row.content));
  const pages = await compressCloudEvidencePages(recordTexts, request.evidence.fromRecord);
  return freezeCloudWire({ protocolVersion: CLOUD_SYNC_PROTOCOL, cloudFormatVersion: 2, evidenceContractVersion: 1,
    campaign: { campaignId: request.campaign.campaignId, name: request.campaign.name, status: request.campaign.status }, action: "save", operationId: request.operationId,
    issuedAt: new Date(issuedAtMs).toISOString(), expectedRevision: request.expectedRevision, writerGeneration: request.writerGeneration,
    writerToken: request.writerToken, campaignId: request.campaignId, snapshot: await cloudWireBlob(request.snapshot),
    evidence: { headerSha256: request.evidence.headerSha256, fromRecord: request.evidence.fromRecord, toRecord: request.evidence.toRecord,
      pages: await Promise.all(pages.map(async page => ({ ...page, content: await cloudWireBlob(page.content) }))) },
    usageReceipts: request.usageQuestions });
}

async function freezeCloudWire(request: Record<string, unknown>): Promise<{ text: string; sha256: string }> {
  const text = JSON.stringify(request);
  const sha256 = await sha256Utf8(text);
  if (utf8Bytes(JSON.stringify({ p_request_text: text, p_request_sha256: sha256 })) + 8 > CLOUD_CAPACITY_LIMITS.transportBodyBytes) throw new CloudSyncError("capacity");
  return { text, sha256 };
}

export async function prepareCloudImportWire(request: CloudImportRequest, issuedAtMs: number): Promise<{ text: string; sha256: string }> {
  const texts: string[] = [];
  for (const record of request.evidence.records) texts.push(await decompressCloudText(record.content));
  const pages = await compressCloudEvidencePages(texts);
  return freezeCloudWire({ protocolVersion: CLOUD_SYNC_PROTOCOL, cloudFormatVersion: 2, evidenceContractVersion: 1,
    campaign: { campaignId: request.campaign.campaignId, name: request.campaign.name, status: request.campaign.status },
    action: "import", operationId: request.operationId, issuedAt: new Date(issuedAtMs).toISOString(), expectedRevision: "0", writerGeneration: "0",
    writerToken: request.writerToken, campaignId: request.campaignId, snapshot: await cloudWireBlob(request.snapshot),
    evidence: { header: await cloudWireBlob(request.evidence.header), fromRecord: 0, toRecord: request.evidence.records.length,
      pages: await Promise.all(pages.map(async page => ({ ...page, content: await cloudWireBlob(page.content) }))) }, usageReceipts: [] });
}
