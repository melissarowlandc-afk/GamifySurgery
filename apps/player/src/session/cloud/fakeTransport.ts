import { sha256Utf8 } from "./codecJson";
import { decompressCloudText } from "./codecCompression";
import {
  CLOUD_LEASE_MS, CloudSyncError, type CloudCapabilities, type CloudCommitReceipt, type CloudCommitRequest,
  type CloudConfirmed, type CloudFrozenOperation, type CloudLease, type CloudTransport, type CloudImportRequest,
} from "./transport";

interface FakeCampaign { confirmed: CloudConfirmed; prior: CloudConfirmed | null; summary: { name: string; status: "resumable" | "archived" } | null; generation: bigint; token: string | null; expiry: number }
interface FakeAccount {
  access: CloudCapabilities;
  campaigns: Map<string, FakeCampaign>;
  operations: Map<string, { digest: string; receipt: CloudCommitReceipt }>;
  usage: Set<string>;
}
type Method = keyof CloudTransport;
export interface CloudTransportFault {
  method: Method;
  at: "before" | "after";
  error?: CloudSyncError;
  wait?: Promise<void>;
}

/** Deterministic protocol simulator, NOT SQL/RLS or hosted acceptance evidence. */
export class FakeCloudServer {
  private readonly accounts = new Map<string, FakeAccount>();
  readonly calls: { accountId: string; method: Method; operationId?: string; requestSha256?: string }[] = [];
  readonly faults: CloudTransportFault[] = [];
  constructor(readonly now: () => number = () => Date.now()) {}
  account(accountId: string): FakeAccount {
    let account = this.accounts.get(accountId);
    if (!account) {
      account = { access: { accountId, enabled: true, admitted: true, noticeAccepted: true, deletionRequested: false, minProtocol: 2 },
        campaigns: new Map(), operations: new Map(), usage: new Set() };
      this.accounts.set(accountId, account);
    }
    return account;
  }
  seed(accountId: string, confirmed: CloudConfirmed): void {
    this.account(accountId).campaigns.set(confirmed.campaignId, { confirmed: structuredClone(confirmed), prior: null, summary: null, generation: 0n, token: null, expiry: 0 });
  }
  setAccess(accountId: string, access: Partial<CloudCapabilities>): void { Object.assign(this.account(accountId).access, access); }
  usageCount(accountId: string): number { return this.account(accountId).usage.size; }
  operationCount(accountId: string): number { return this.account(accountId).operations.size; }
  expireOperation(accountId: string, operationId: string): void { this.account(accountId).operations.delete(operationId); this.expired.add(`${accountId}:${operationId}`); }
  private readonly expired = new Set<string>();
  private guard(account: FakeAccount, writing = true): void {
    const access = account.access;
    if (access.deletionRequested) throw new CloudSyncError("deleted");
    if (!access.admitted) throw new CloudSyncError("revoked");
    if (writing && !access.enabled) throw new CloudSyncError("disabled");
    if (!access.noticeAccepted) throw new CloudSyncError("notice");
    if (access.minProtocol > 2) throw new CloudSyncError("protocol");
  }
  private async fault(method: Method, at: CloudTransportFault["at"]): Promise<void> {
    const index = this.faults.findIndex(fault => fault.method === method && fault.at === at);
    if (index < 0) return;
    const [fault] = this.faults.splice(index, 1);
    await fault!.wait;
    if (fault!.error) throw fault!.error;
  }
  transport(accountId: string): CloudTransport {
    const account = this.account(accountId);
    const run = async <T>(method: Method, action: () => T | Promise<T>, metadata: { operationId?: string; requestSha256?: string } = {}): Promise<T> => {
      this.calls.push({ accountId, method, ...metadata });
      await this.fault(method, "before");
      if (!["capabilities", "acceptNotice", "deleteMyData"].includes(method)) this.guard(account, !["list", "head", "load", "operation"].includes(method));
      const value = await action();
      await this.fault(method, "after");
      return structuredClone(value);
    };
    const campaign = (id: string): FakeCampaign => {
      const result = account.campaigns.get(id);
      if (!result) throw new CloudSyncError("corrupt");
      return result;
    };
    const head = (row: FakeCampaign) => ({ campaignId: row.confirmed.campaignId, revision: row.confirmed.revision,
      writerGeneration: String(row.generation), writerActive: row.token !== null && row.expiry > this.now(), serverNowMs: this.now(),
      priorRevision: row.prior?.revision ?? null, evidenceHighWater: row.confirmed.evidence.records.length,
      ...(row.summary ? row.summary : {}) });
    const lease = (row: FakeCampaign): CloudLease => ({ ...head(row), writerToken: row.token!, expiresAtMs: row.expiry });
    const writer = (row: FakeCampaign, input: { writerToken: string; writerGeneration: string }) => {
      if (row.token !== input.writerToken || String(row.generation) !== input.writerGeneration || row.expiry <= this.now()) throw new CloudSyncError("writer");
    };
    const grants = new Map<string, { input: string; lease: CloudLease }>();
    return {
      capabilities: () => run("capabilities", () => account.access),
      list: () => run("list", async () => Promise.all([...account.campaigns.values()].map(async row => {
        const campaign = row.summary ?? JSON.parse(await decompressCloudText(row.confirmed.snapshot)).campaign;
        row.summary = { name: campaign.name, status: campaign.status };
        return { ...head(row), name: campaign.name, status: campaign.status, acceptedAtMs: row.confirmed.acceptedAtMs };
      }))),
      head: id => run("head", () => head(campaign(id))),
      load: (id, revision) => run("load", () => {
        const row = campaign(id), value = revision && revision === row.prior?.revision ? row.prior : row.confirmed;
        if (revision && value.revision !== revision) throw new CloudSyncError("revision");
        return value;
      }),
      acquire: input => run("acquire", () => {
        const prior = grants.get(input.operationId);
        if (prior) { if (prior.input !== JSON.stringify(input)) throw new CloudSyncError("corrupt"); return prior.lease; }
        const row = campaign(input.campaignId);
        if (row.confirmed.revision !== input.expectedRevision) throw new CloudSyncError("revision");
        // Match the deployed RPC's idempotent token proof across transport instances.
        if (input.writerToken && row.token === input.writerToken && row.expiry > this.now() &&
          (input.expectedWriterGeneration === String(row.generation) || BigInt(input.expectedWriterGeneration ?? "-2") + 1n === row.generation)) return lease(row);
        if (input.expectedWriterGeneration !== undefined && input.expectedWriterGeneration !== String(row.generation)) throw new CloudSyncError("writer");
        if (row.token && row.expiry > this.now() && !input.takeover) throw new CloudSyncError("writer");
        row.generation++; row.token = input.writerToken ?? `writer.${accountId}.${row.generation}`; row.expiry = this.now() + CLOUD_LEASE_MS;
        const granted = lease(row); grants.set(input.operationId, { input: JSON.stringify(input), lease: granted }); return granted;
      }, { operationId: input.operationId }),
      renew: input => run("renew", () => { const row = campaign(input.campaignId); writer(row, input); row.expiry = this.now() + CLOUD_LEASE_MS; return lease(row); }),
      release: input => run("release", () => { const row = campaign(input.campaignId); writer(row, input); row.token = null; row.expiry = 0; }),
      commit: operation => run("commit", async () => {
        if (await sha256Utf8(operation.requestText) !== operation.requestSha256) throw new CloudSyncError("corrupt");
        const input = JSON.parse(operation.requestText) as CloudCommitRequest;
        if (input.operationId !== operation.operationId || input.protocolVersion !== 2) throw new CloudSyncError("protocol");
        const previous = account.operations.get(input.operationId);
        if (previous) { if (previous.digest !== operation.requestSha256) throw new CloudSyncError("corrupt"); return previous.receipt; }
        if (this.expired.has(`${accountId}:${input.operationId}`)) throw new CloudSyncError("operation-expired");
        // Mirror the deployed unique normalized campaign name. Decode seeded
        // metadata before the final synchronous authority/commit boundary.
        for (const [id, other] of account.campaigns) if (id !== input.campaignId && !other.summary) {
          const metadata = JSON.parse(await decompressCloudText(other.confirmed.snapshot)).campaign;
          if (!other.summary) other.summary = { name: metadata.name, status: metadata.status };
        }
        if ([...account.campaigns].some(([id, other]) => id !== input.campaignId &&
          other.summary?.name.toLowerCase() === input.campaign.name.toLowerCase())) throw new CloudSyncError("corrupt");
        const row = campaign(input.campaignId);
        writer(row, input);
        if (row.confirmed.revision !== input.expectedRevision) throw new CloudSyncError("revision");
        if (input.evidence.headerSha256 !== row.confirmed.evidence.header.uncompressedSha256 ||
          input.evidence.fromRecord !== row.confirmed.evidence.records.length ||
          input.evidence.toRecord !== input.evidence.fromRecord + input.evidence.records.length) throw new CloudSyncError("corrupt");
        const revision = String(BigInt(row.confirmed.revision) + 1n), acceptedAtMs = this.now();
        const receipt: CloudCommitReceipt = { operationId: input.operationId, requestSha256: operation.requestSha256,
          campaignId: input.campaignId, revision, snapshotSha256: input.snapshot.uncompressedSha256,
          snapshotBytes: input.snapshot.uncompressedBytes, acceptedAtMs, evidenceHighWater: input.evidence.toRecord,
          usageReceiptIds: input.usageQuestions.map(r => r.receipt_id) };
        // No await between the authority checks and the atomic fake commit.
        row.prior = row.confirmed;
        row.summary = { name: input.campaign.name, status: input.campaign.status };
        row.confirmed = { ...row.confirmed, snapshot: input.snapshot, revision, acceptedAtMs,
          evidence: { header: row.confirmed.evidence.header, records: [...row.confirmed.evidence.records, ...input.evidence.records] } };
        for (const r of input.usageQuestions) account.usage.add(r.receipt_id);
        account.operations.set(input.operationId, { digest: operation.requestSha256, receipt });
        return receipt;
      }, { operationId: operation.operationId, requestSha256: operation.requestSha256 }),
      operation: (_campaignId, operationId) => run("operation", () => {
        const result = account.operations.get(operationId);
        if (result && result.receipt.campaignId !== _campaignId) throw new CloudSyncError("corrupt");
        return result ? { status: "committed" as const, receipt: result.receipt } :
          this.expired.has(`${accountId}:${operationId}`) ? { status: "expired" as const } : { status: "missing" as const };
      }, { operationId }),
      acceptNotice: version => run("acceptNotice", () => {
        if (version !== "beta2.cloud.v1" || account.access.deletionRequested || !account.access.admitted) throw new CloudSyncError("notice");
        account.access.noticeAccepted = true;
      }),
      importCampaign: operation => run("importCampaign", async () => {
        if (await sha256Utf8(operation.requestText) !== operation.requestSha256) throw new CloudSyncError("corrupt");
        const input = JSON.parse(operation.requestText) as CloudImportRequest;
        const previous = account.operations.get(input.operationId);
        if (previous) { if (previous.digest !== operation.requestSha256) throw new CloudSyncError("corrupt"); return previous.receipt; }
        if (account.access.enrollmentsEnabled === false || account.campaigns.size >= 2) throw new CloudSyncError("capacity");
        if (account.campaigns.has(input.campaignId)) throw new CloudSyncError("revision");
        const names = await Promise.all([...account.campaigns.values()].map(async row => JSON.parse(await decompressCloudText(row.confirmed.snapshot)).campaign.name.toLowerCase()));
        if (names.includes(input.campaign.name.toLowerCase())) throw new CloudSyncError("corrupt");
        const acceptedAtMs = this.now();
        const confirmed: CloudConfirmed = { campaignId: input.campaignId, revision: "1", acceptedAtMs, snapshot: input.snapshot, evidence: input.evidence, baselineId: input.baselineId };
        const receipt: CloudCommitReceipt = { operationId: input.operationId, campaignId: input.campaignId, revision: "1", requestSha256: operation.requestSha256,
          snapshotSha256: input.snapshot.uncompressedSha256, snapshotBytes: input.snapshot.uncompressedBytes, acceptedAtMs, evidenceHighWater: input.evidence.records.length, usageReceiptIds: [] };
        account.campaigns.set(input.campaignId, { confirmed, prior: null, summary: { name: input.campaign.name, status: input.campaign.status }, generation: 1n, token: input.writerToken, expiry: this.now() + CLOUD_LEASE_MS });
        account.operations.set(input.operationId, { digest: operation.requestSha256, receipt }); account.access.enrolled = true;
        return receipt;
      }),
      deleteMyData: () => run("deleteMyData", () => {
        account.access.deletionRequested = true; account.access.admitted = false;
        account.campaigns.clear(); account.operations.clear(); account.usage.clear();
      }),
      deleteCampaign: input => run("deleteCampaign", () => {
        if (account.access.writesEnabled === false) throw new CloudSyncError("disabled");
        if (!input.campaignId || !/^[1-9][0-9]*$/.test(input.expectedRevision)) throw new CloudSyncError("corrupt");
        const row = account.campaigns.get(input.campaignId);
        if (!row) return; // Repeating an acknowledged or lost-ack delete is harmless.
        if (row.confirmed.revision !== input.expectedRevision) throw new CloudSyncError("revision");
        if (row.token && row.expiry > this.now()) throw new CloudSyncError("writer");
        account.campaigns.delete(input.campaignId);
        for (const [key, operation] of account.operations) if (operation.receipt.campaignId === input.campaignId) account.operations.delete(key);
      }),
    };
  }
}
