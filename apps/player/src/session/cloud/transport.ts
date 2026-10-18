import type { QuestionUsageReceipt } from "../../playtime/usageTypes";
import type { CloudCampaignMetadata } from "./codec";
import type { CloudCompressedText } from "./codecCompression";
import type { CloudPackedEvidence } from "./codecEvidence";

/** B2.4 must explicitly opt in after notice, capability and enrollment checks. */
export const CLOUD_SAVES_ENABLED_BY_DEFAULT = false;
export const CLOUD_SYNC_PROTOCOL = 3;
export const CLOUD_LEASE_MS = 60_000;
export const CLOUD_RENEW_MS = 15_000;
export const CLOUD_CHECKPOINT_MS = 60_000;
export const CLOUD_GRACE_MS = 30_000;
export const CLOUD_RECOVERY_BYTES = 7_000_000;

export interface CloudScope { backendId: string; accountId: string; campaignId: string }
export type CloudFailureCode = "network" | "auth" | "revoked" | "deleted" | "disabled" | "notice" |
  "protocol" | "writer" | "revision" | "capacity" | "throttled" | "corrupt" | "storage" | "operation-expired";
export class CloudSyncError extends Error {
  constructor(readonly code: CloudFailureCode, readonly retryAfterMs = 0) {
    super(`Cloud save unavailable (${code}).`);
    this.name = "CloudSyncError";
  }
}
export interface CloudCapabilities {
  accountId: string;
  enabled: boolean;
  /** Separate project write switch; never use it as cohort admission. */
  writesEnabled?: boolean;
  admitted: boolean;
  noticeAccepted: boolean;
  deletionRequested: boolean;
  minProtocol: number;
  enrollmentsEnabled?: boolean;
  enrolled?: boolean;
  quotaWarning?: boolean;
}
export interface CloudCampaignHead {
  campaignId: string;
  revision: string;
  writerGeneration: string;
  writerActive: boolean;
  serverNowMs: number;
  priorRevision?: string | null;
  evidenceHighWater?: number;
  name?: string;
  status?: "resumable" | "archived";
}
export interface CloudCampaignSummary extends CloudCampaignHead {
  name: string;
  status: "resumable" | "archived";
  acceptedAtMs: number;
}
export interface CloudLease extends CloudCampaignHead {
  writerToken: string;
  expiresAtMs: number;
}
export interface CloudConfirmed {
  campaignId: string;
  revision: string;
  acceptedAtMs: number;
  snapshot: CloudCompressedText;
  evidence: CloudPackedEvidence;
  baselineId: string;
  /** A verified prior is view/export only; it never becomes the server write base. */
  priorRecovery?: { serverRevision: string; serverEvidenceHighWater: number };
}
export interface CloudImportRequest {
  operationId: string;
  campaignId: string;
  campaign: CloudCampaignMetadata;
  snapshot: CloudCompressedText;
  evidence: CloudPackedEvidence;
  baselineId: string;
  writerToken: string;
}
/** Evidence is a suffix of the confirmed archive; never a second history upload. */
export interface CloudCandidate {
  campaign: CloudCampaignMetadata;
  snapshot: CloudCompressedText;
  evidence: {
    headerSha256: string;
    fromRecord: number;
    toRecord: number;
    records: CloudPackedEvidence["records"];
  };
  usageQuestions: readonly QuestionUsageReceipt[];
}
export interface CloudCommitRequest extends CloudCandidate {
  protocolVersion: 2;
  operationId: string;
  campaignId: string;
  expectedRevision: string;
  writerToken: string;
  writerGeneration: string;
}
/** These exact bytes are frozen durably BEFORE sending; retries use them unchanged. */
export interface CloudFrozenOperation {
  operationId: string;
  createdAtMs: number;
  requestText: string;
  requestSha256: string;
  /** Exact protocol-3 sealed-page RPC body; generated once before the cache commit. */
  wireRequest?: { text: string; sha256: string };
}
export interface CloudCommitReceipt {
  operationId: string;
  requestSha256: string;
  campaignId: string;
  revision: string;
  snapshotSha256: string;
  snapshotBytes: number;
  acceptedAtMs: number;
  evidenceHighWater: number;
  usageReceiptIds: readonly string[];
}
export type CloudOperationOutcome = { status: "committed"; receipt: CloudCommitReceipt } |
  { status: "missing" } | { status: "expired" };

/** Auth is owned by the injected account-bound client, never serialized here. */
export interface CloudTransport {
  prepare?(request: CloudCommitRequest, issuedAtMs: number): Promise<{ text: string; sha256: string }>;
  capabilities(): Promise<CloudCapabilities>;
  list(): Promise<readonly CloudCampaignSummary[]>;
  head(campaignId: string): Promise<CloudCampaignHead>;
  load(campaignId: string, revision?: string): Promise<CloudConfirmed>;
  acquire(input: { campaignId: string; expectedRevision: string; operationId: string; takeover: boolean; expectedWriterGeneration?: string }): Promise<CloudLease>;
  renew(input: { campaignId: string; writerToken: string; writerGeneration: string }): Promise<CloudLease>;
  release(input: { campaignId: string; writerToken: string; writerGeneration: string }): Promise<void>;
  commit(operation: CloudFrozenOperation): Promise<CloudCommitReceipt>;
  operation(campaignId: string, operationId: string, operation?: CloudFrozenOperation): Promise<CloudOperationOutcome>;
  acceptNotice?(version: string): Promise<void>;
  prepareImport?(request: CloudImportRequest, issuedAtMs: number): Promise<{ text: string; sha256: string }>;
  importCampaign?(operation: CloudFrozenOperation): Promise<CloudCommitReceipt>;
  deleteMyData?(): Promise<void>;
}
