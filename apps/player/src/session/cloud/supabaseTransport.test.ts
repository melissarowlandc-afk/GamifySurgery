import { describe, expect, it, vi } from "vitest";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudCache } from "./cache";
import { compressCloudEvidencePages, decompressCloudEvidencePages } from "./codecEvidencePages";
import { loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { logicalJsonText, sha256Utf8 } from "./codecJson";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { SupabaseCloudTransport, cloudWireBlob, type CloudRpcClient } from "./supabaseTransport";
import { syncFixture, TestCloudClock } from "./syncTestSupport";
import type { CloudCommitRequest, CloudFrozenOperation } from "./transport";

async function rpcFixture() {
  const fixture = await syncFixture(), clock = new TestCloudClock();
  let revision = "1", generation = "1", active = false, lostAck = false, account = "account-a";
  const pages = await compressCloudEvidencePages(fixture.prepared.checkpoint.evidence.records.map(row => logicalJsonText(JSON.parse(JSON.stringify(row)))));
  const wireSnapshot = await cloudWireBlob(fixture.confirmed.snapshot), wireHeader = await cloudWireBlob(fixture.confirmed.evidence.header);
  const wirePages = await Promise.all(pages.map(async page => ({ ...page, content: await cloudWireBlob(page.content) })));
  const receipts = new Map<string, Record<string, unknown>>();
  const rpc = vi.fn(async (name: string, args: Record<string, unknown>): Promise<{ data: unknown; error: unknown }> => {
    const time = new Date(clock.wall).toISOString();
    if (name === "beta2_cloud_access") return { data: { protocolVersion: 3, cloudFormatVersion: 2, enabled: true, writesEnabled: true, noticeAccepted: true }, error: null };
    if (name === "beta2_cloud_list") return { data: { serverTime: time, campaigns: [{ campaignId: fixture.confirmed.campaignId,
      name: fixture.prepared.envelope.campaign.name, status: "resumable", revision, priorRevision: null, evidenceHighWater: fixture.confirmed.evidence.records.length, writerGeneration: generation, writerActive: active, updatedAt: time }] }, error: null };
    if (name === "beta2_cloud_load") return { data: { revision: "1", writerGeneration: generation, acceptedAt: time, serverTime: time,
      snapshot: wireSnapshot, evidence: { header: wireHeader, pages: wirePages } }, error: null };
    if (name === "beta2_cloud_lease") {
      if (args.p_action === "acquire" || args.p_action === "takeover") generation = String(BigInt(generation) + 1n);
      active = args.p_action !== "release";
      return { data: { revision, writerGeneration: generation, expiresAt: new Date(clock.wall + 60_000).toISOString(), serverTime: time, released: !active }, error: null };
    }
    if (name === "beta2_cloud_write") {
      const req = JSON.parse(args.p_request_text as string), known = receipts.get(req.operationId);
      if (known) return { data: known, error: null };
      revision = String(BigInt(revision) + 1n);
      const receipt = { operationId: req.operationId, requestSha256: args.p_request_sha256, revision, writerGeneration: generation,
        snapshotSha256: req.snapshot.uncompressedSha256, snapshotBytes: req.snapshot.uncompressedBytes,
        evidenceHighWater: req.evidence.toRecord, acceptedAt: time };
      receipts.set(req.operationId, receipt);
      if (lostAck) { lostAck = false; return { data: null, error: new TypeError("simulated lost reply") }; }
      return { data: receipt, error: null };
    }
    if (name === "beta2_cloud_operation") {
      const receipt = receipts.get(args.p_operation_id as string);
      return { data: receipt ? { status: "accepted", receipt } : { status: "unknown" }, error: null };
    }
    throw new Error("Unexpected RPC");
  });
  const transport = new SupabaseCloudTransport({ rpc }, "account-a", async () => account, () => clock.wall);
  return { ...fixture, transport, rpc, clock, wireSnapshot, wireHeader, wirePages, loseAck: () => { lostAck = true; }, switchAccount: () => { account = "account-b"; } };
}
describe("Supabase protocol-3 sealed-page adapter (offline RPC contract tests)", () => {
  it("uses a durably supplied writer token instead of generating a new identity on relaunch", async () => {
    const f = await rpcFixture(), writerToken = "a".repeat(64);
    await f.transport.acquire({ campaignId: f.confirmed.campaignId, expectedRevision: "1", expectedWriterGeneration: "1",
      operationId: "retained.identity", takeover: false, writerToken });
    expect(f.rpc.mock.calls.at(-1)?.[1]).toMatchObject({ p_writer_token: writerToken, p_writer_generation: "1", p_action: "acquire" });
  });
  it("bounds a suspended/hung RPC so a fresh retry can recover without waiting forever", async () => {
    vi.useFakeTimers();
    try {
      const wait = new Promise<{ data: unknown; error: unknown }>(() => {});
      const rpc = vi.fn().mockReturnValueOnce(wait).mockResolvedValue({ data: { protocolVersion: 3, enabled: true, writesEnabled: true, noticeAccepted: true }, error: null });
      const transport = new SupabaseCloudTransport({ rpc }, "a", async () => "a");
      const first = expect(transport.capabilities()).rejects.toMatchObject({ code: "network" });
      await vi.advanceTimersByTimeAsync(30_000); await first;
      expect(await transport.capabilities()).toMatchObject({ enabled: true });
      expect(vi.getTimerCount()).toBe(0);
    } finally { vi.useRealTimers(); }
  });
  it.each([false, true])("keeps account admission separate from the project writes switch (%s)", async enabled => {
    const rpc = vi.fn(async (_name: string, _args: Record<string, unknown>) => ({ data: { protocolVersion: 3, enabled, writesEnabled: false, noticeAccepted: true }, error: null }));
    const transport = new SupabaseCloudTransport({ rpc }, "account-a", async () => "account-a");
    expect(await transport.capabilities()).toMatchObject({ enabled, writesEnabled: false });
    expect(rpc).toHaveBeenCalledExactlyOnceWith("beta2_cloud_access", { p_protocol: 3 });
    if (enabled) {
      const coordinator = new CloudSyncCoordinator({ scope: { backendId: "synthetic", accountId: "account-a", campaignId: "synthetic" },
        transport, cache: new MemoryCloudCache(), enabled: true });
      expect(await coordinator.open()).toBe(false);
      expect(coordinator.view.failure).toBe("disabled");
      expect(rpc.mock.calls.every(call => call[0] === "beta2_cloud_access")).toBe(true);
    }
  });
  it("rejects an opaque snapshot that does not reference its entire accepted evidence prefix", async () => {
    const f = await rpcFixture(), envelope = JSON.parse(await decompressCloudText(f.confirmed.snapshot));
    envelope.evidenceHighWater--;
    const snapshot = await cloudWireBlob(await compressCloudText(logicalJsonText(envelope)));
    const implementation = f.rpc.getMockImplementation()!;
    f.rpc.mockImplementation(async (name, args) => {
      const result = await implementation(name, args);
      if (name === "beta2_cloud_load") (result.data as any).snapshot = snapshot;
      return result;
    });
    await expect(f.transport.load(f.confirmed.campaignId)).rejects.toMatchObject({ code: "corrupt" });
  });
  it("checks the decoded campaign summary against the declared server head before playing", async () => {
    const f = await rpcFixture(), implementation = f.rpc.getMockImplementation()!;
    f.rpc.mockImplementation(async (name, args) => {
      const result = await implementation(name, args);
      if (name === "beta2_cloud_list") (result.data as any).campaigns[0].name = "Different declared name";
      return result;
    });
    const coordinator = new CloudSyncCoordinator({ scope: { backendId: "synthetic", accountId: "account-a", campaignId: f.confirmed.campaignId },
      transport: f.transport, cache: new MemoryCloudCache(), clock: f.clock, enabled: true });
    expect(await coordinator.open()).toBe(false); expect(coordinator.view.failure).toBe("corrupt");
    expect(f.rpc.mock.calls.some(([name]) => name === "beta2_cloud_lease")).toBe(false);
  });
  it.each(["snapshot", "header", "page"] as const)("checks the compressed hash BEFORE decoding the loaded %s", async part => {
    const f = await rpcFixture(), implementation = f.rpc.getMockImplementation()!;
    f.rpc.mockImplementation(async (name, args) => {
      const result = await implementation(name, args);
      if (name === "beta2_cloud_load") {
        const data = structuredClone(result.data) as any;
        const blob = part === "snapshot" ? data.snapshot : part === "header" ? data.evidence.header : data.evidence.pages[0].content;
        blob.compressedSha256 = "0".repeat(64);
        return { data, error: null };
      }
      return result;
    });
    await expect(f.transport.load(f.confirmed.campaignId)).rejects.toMatchObject({ code: "corrupt" });
  });
  it("uses the exact opaque import envelope including header/page compressed hashes", async () => {
    const f = await rpcFixture();
    const wire = await f.transport.prepareImport({ operationId: "import.test", campaignId: f.confirmed.campaignId,
      campaign: f.prepared.envelope.campaign, snapshot: f.confirmed.snapshot, evidence: f.confirmed.evidence,
      baselineId: f.confirmed.baselineId, writerToken: "a".repeat(64) }, f.clock.wall);
    expect(await sha256Utf8(wire.text)).toBe(wire.sha256);
    const request = JSON.parse(wire.text);
    expect(request).toMatchObject({ action: "import", protocolVersion: 3, cloudFormatVersion: 2, evidenceContractVersion: 1, expectedRevision: "0", writerGeneration: "0", usageReceipts: [] });
    expect(Object.keys(request.campaign).sort()).toEqual(["campaignId", "name", "status"]);
    expect(request.evidence.header.compressedSha256).toBe(f.wireHeader.compressedSha256);
    expect(Object.keys(request.evidence).sort()).toEqual(["header", "fromRecord", "toRecord", "pages"].sort());
    for (const blob of [request.snapshot, request.evidence.header, ...request.evidence.pages.map((page: any) => page.content)]) {
      expect(Object.keys(blob).sort()).toEqual(["encoding", "dataBase64", "compressedBytes", "compressedSha256", "uncompressedBytes", "uncompressedSha256"].sort());
    }
  });
  it("uses the migration RPCs, loads sealed pages and verifies the complete logical game", async () => {
    const f = await rpcFixture(); expect((await f.transport.capabilities()).minProtocol).toBe(3);
    const head = await f.transport.head(f.confirmed.campaignId), loaded = await f.transport.load(head.campaignId, head.revision);
    const hydrated = await loadCloudEvidenceCheckpoint({ ...loaded, expectedRevision: "1", expectedCampaignId: loaded.campaignId, expectedBaselineId: loaded.baselineId });
    expect(hydrated.checkpoint).toEqual(f.prepared.checkpoint);
    expect(f.rpc.mock.calls.map(call => call[0])).toEqual(["beta2_cloud_access", "beta2_cloud_list", "beta2_cloud_load"]);
    expect(f.rpc.mock.calls.at(-1)?.[1]).toEqual({ p_protocol: 3, p_campaign_id: loaded.campaignId, p_revision: "1" });
  });
  it("freezes the COMPLETE wire request durably and recovers a lost receipt without repacking or resending", async () => {
    const f = await rpcFixture(), cache = new MemoryCloudCache();
    const scope = { backendId: "synthetic", accountId: "account-a", campaignId: f.confirmed.campaignId };
    const coordinator = new CloudSyncCoordinator({ scope, cache, transport: f.transport, clock: f.clock, enabled: true });
    expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); coordinator.resume();
    const first = f.command(f.prepared.checkpoint, { type: "SET_PAUSED", paused: false, operationId: "resume" });
    await coordinator.stage(await f.candidate(first)); f.loseAck(); expect(await coordinator.checkpoint()).toBe(false);
    const operation = (await cache.read(scope))!.entry.recovery!.inFlight!, wire = operation.wireRequest!;
    expect(await sha256Utf8(wire.text)).toBe(wire.sha256);
    const request = JSON.parse(wire.text);
    expect(Object.keys(request).sort()).toEqual(["protocolVersion", "cloudFormatVersion", "evidenceContractVersion", "campaign", "action", "operationId", "issuedAt", "expectedRevision", "writerGeneration", "writerToken", "campaignId", "snapshot", "evidence", "usageReceipts"].sort());
    expect(request.cloudFormatVersion).toBe(2); expect(request.evidenceContractVersion).toBe(1);
    expect(request.campaign).toEqual({ campaignId: f.confirmed.campaignId, name: f.prepared.envelope.campaign.name, status: "resumable" });
    expect(request.snapshot.compressedSha256).toMatch(/^[a-f0-9]{64}$/);
    for (const page of request.evidence.pages) expect(page.content.compressedSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(request.protocolVersion).toBe(3); expect(request.writerToken).toMatch(/^[0-9a-f]{64}$/);
    expect(request.evidence).not.toHaveProperty("records"); expect(request.evidence).not.toHaveProperty("header");
    expect(await decompressCloudEvidencePages(request.evidence.pages, request.evidence.fromRecord)).toEqual(first.evidence.records.slice(f.prepared.checkpoint.evidence.records.length));
    const sent = f.rpc.mock.calls.find(call => call[0] === "beta2_cloud_write")!;
    expect(sent[1]).toEqual({ p_request_text: wire.text, p_request_sha256: wire.sha256 });
    expect(await coordinator.retry()).toBe(true); expect(coordinator.confirmed?.revision).toBe("2");
    expect(f.rpc.mock.calls.filter(call => call[0] === "beta2_cloud_write")).toHaveLength(1);
    expect(coordinator.view.canExecute).toBe(false);
    expect(await coordinator.saveAndClose()).toBe(true);
    expect(f.rpc.mock.calls.at(-1)?.[1]).toMatchObject({ p_action: "release", p_expected_revision: "2", p_writer_generation: "2" });
  });
  it("binds admission and every callback to its original account", async () => {
    const f = await rpcFixture(); f.switchAccount();
    await expect(f.transport.capabilities()).rejects.toMatchObject({ code: "auth" }); expect(f.rpc).not.toHaveBeenCalled();
    const rpc = vi.fn(async () => { f.switchAccount(); return { data: {}, error: null }; });
    let account = "account-a";
    const late = new SupabaseCloudTransport({ rpc: async () => { account = "account-b"; return { data: {}, error: null }; } }, "account-a", async () => account);
    await expect(late.capabilities()).rejects.toMatchObject({ code: "auth" });
  });
  it.each([
    ["40001", "Cloud revision conflict", "revision"], ["55000", "Cloud lease expired or fenced", "writer"],
    ["55000", "Cloud writing unavailable", "disabled"], ["42501", "Player access denied", "revoked"],
    ["42501", "Cloud notice acceptance required", "notice"], ["22023", "Cloud client update required", "protocol"],
    ["22023", "Expired or future cloud operation", "operation-expired"], ["54000", "Cloud account capacity reached", "capacity"],
    ["PGRST301", "JWT invalid", "auth"], ["P0001", "Cloud request rate limit", "throttled"],
  ])("maps %s / %s to a redacted %s state", async (code, message, expected) => {
    const client: CloudRpcClient = { rpc: async () => ({ data: null, error: { code, message, details: '{"retryAfterSeconds":12}' } }) };
    const transport = new SupabaseCloudTransport(client, "a", async () => "a");
    await expect(transport.capabilities()).rejects.toMatchObject({ code: expected });
  });
  it("distinguishes an expired unknown operation from a safe current retry", async () => {
    const f = await rpcFixture(), request = { campaignId: f.confirmed.campaignId, usageQuestions: [] } as unknown as CloudCommitRequest;
    const operation: CloudFrozenOperation = { operationId: "unknown", requestText: JSON.stringify(request), requestSha256: "0".repeat(64), createdAtMs: f.clock.wall };
    expect(await f.transport.operation(f.confirmed.campaignId, operation.operationId, operation)).toEqual({ status: "missing" });
    f.clock.advance(7 * 86_400_000);
    expect(await f.transport.operation(f.confirmed.campaignId, operation.operationId, operation)).toEqual({ status: "expired" });
  });
});
