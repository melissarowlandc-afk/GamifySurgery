import { describe, expect, it } from "vitest";
import { FakeCloudServer } from "./fakeTransport";
import { syncFixture } from "./syncTestSupport";
import { importLocalCloudCampaign, inspectLocalCloudSources } from "./importCampaigns";
import { MemoryCloudEntryStore } from "./entryStorage";

describe("fake campaign deletion authority", () => {
  it("removes its operations once, frees a slot, retains the other account and does not delete usage", async () => {
    const fixture = await syncFixture(), server = new FakeCloudServer(), store = new MemoryCloudEntryStore(), transport = server.transport("a");
    const raw = JSON.stringify({ schemaVersion: 2, campaigns: [{ ...fixture.prepared.envelope.campaign, serializedState: fixture.prepared.sourceRecovery.text }] });
    const inspection = await inspectLocalCloudSources("a", { getItem: key => key.endsWith(".account.a") ? raw : null }, store);
    await importLocalCloudCampaign(inspection.sources[0]!, "First", transport, store);
    server.seed("b", fixture.confirmed); server.account("a").usage.add("previous-question");
    const input = { campaignId: fixture.confirmed.campaignId, expectedRevision: "1" };
    await transport.deleteCampaign!(input); await transport.deleteCampaign!(input);
    expect(server.account("a").campaigns.size).toBe(0); expect(server.operationCount("a")).toBe(0);
    expect(server.account("b").campaigns.size).toBe(1); expect(server.usageCount("a")).toBe(1);
    const replacement = await syncFixture("replacement"); server.seed("a", replacement.confirmed); expect((await transport.list()).length).toBe(1);
  });
  it("refuses an active lease or stale revision and succeeds only after lease expiry", async () => {
    let now = 1_800_000_000_000; const server = new FakeCloudServer(() => now), f = await syncFixture(), transport = server.transport("a"); server.seed("a", f.confirmed);
    await transport.acquire({ campaignId: f.confirmed.campaignId, expectedRevision: "1", operationId: "phone", takeover: false });
    await expect(transport.deleteCampaign!({ campaignId: f.confirmed.campaignId, expectedRevision: "1" })).rejects.toMatchObject({ code: "writer" });
    now += 61_000;
    await expect(transport.deleteCampaign!({ campaignId: f.confirmed.campaignId, expectedRevision: "2" })).rejects.toMatchObject({ code: "revision" });
    await transport.deleteCampaign!({ campaignId: f.confirmed.campaignId, expectedRevision: "1" }); expect(server.account("a").campaigns.size).toBe(0);
  });
  it.each(["notice", "revoked", "disabled", "writes-off"])("keeps deletion behind the %s gate", async gate => {
    const server = new FakeCloudServer(), f = await syncFixture(), transport = server.transport("a"); server.seed("a", f.confirmed);
    server.setAccess("a", gate === "notice" ? { noticeAccepted: false } : gate === "revoked" ? { admitted: false } : gate === "disabled" ? { enabled: false } : { writesEnabled: false });
    await expect(transport.deleteCampaign!({ campaignId: f.confirmed.campaignId, expectedRevision: "1" })).rejects.toMatchObject({ code: gate === "writes-off" ? "disabled" : gate });
    expect(server.account("a").campaigns.size).toBe(1);
  });
});
