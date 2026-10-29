import { describe, expect, it, vi } from "vitest";
import { selectCampaignToReopen, rememberCampaignToReopen } from "./reopenSelection";
import { MemoryCloudEntryStore } from "./entryStorage";
import { deferred, syncFixture, syncHarness } from "./syncTestSupport";
import { CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";

async function fixture(retain = true) {
  const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
  if (retain) await h.cache.write({ schemaVersion: 1, scope: h.scope, confirmed: h.confirmed, recovery: null }, null);
  const runtime = { ...h.scope, region: "Synthetic", cache: h.cache, entryStore, transport: h.server.transport(h.scope.accountId) };
  return { ...h, entryStore, runtime };
}
describe("fresh asynchronous last-campaign selection", () => {
  it("a retained selection does not depend on a possibly empty context list or claim a writer", async () => {
    const f = await fixture(); await f.entryStore.write("last-active-campaign", { campaignId: f.scope.campaignId });
    expect(await selectCampaignToReopen(f.runtime, false)).toEqual({ kind: "open", campaignId: f.scope.campaignId });
    expect(f.server.calls).toHaveLength(0);
  });
  it("uses fresh account metadata to upgrade one retained family without replaying or writing", async () => {
    const f = await fixture();
    expect(await selectCampaignToReopen(f.runtime, false)).toEqual({ kind: "open", campaignId: f.scope.campaignId });
    expect(f.server.calls.map(call => call.method)).toEqual(["list"]);
    expect(f.server.operationCount(f.scope.accountId)).toBe(0);
  });
  it("keeps an explicit campaign-screen selection even when one cached campaign can reopen", async () => {
    const f = await fixture(); await rememberCampaignToReopen(f.runtime, null);
    expect(await selectCampaignToReopen(f.runtime, false)).toEqual({ kind: "list" });
    expect(f.server.calls).toHaveLength(0);
  });
  it("does not guess between two retained campaign families", async () => {
    const f = await fixture(), second = await syncFixture("another.clinic");
    f.server.seed(f.scope.accountId, second.confirmed);
    await f.cache.write({ schemaVersion: 1, scope: { ...f.scope, campaignId: second.confirmed.campaignId }, confirmed: second.confirmed, recovery: null }, null);
    expect(await selectCampaignToReopen(f.runtime, false)).toEqual({ kind: "list" });
    expect(f.server.calls.map(call => call.method)).toEqual(["list"]);
  });
  it("an empty early inventory remains retryable", async () => {
    const f = await fixture(false);
    expect(await selectCampaignToReopen(f.runtime, false)).toEqual({ kind: "wait" });
    await f.cache.write({ schemaVersion: 1, scope: f.scope, confirmed: f.confirmed, recovery: null }, null);
    expect(await selectCampaignToReopen(f.runtime, false)).toEqual({ kind: "open", campaignId: f.scope.campaignId });
  });
  it("does not treat a valid IndexedDB selection taking more than 1.5 seconds as absent", async () => {
    const f = await fixture(), held = deferred(), read = f.entryStore.read.bind(f.entryStore);
    await rememberCampaignToReopen(f.runtime, f.scope.campaignId);
    vi.spyOn(f.entryStore, "read").mockImplementation(async key => { await held.promise; return read(key); });
    vi.useFakeTimers();
    try {
      const selection = selectCampaignToReopen(f.runtime, false); let settled = false; void selection.then(() => { settled = true; });
      await vi.advanceTimersByTimeAsync(2_000); expect(settled).toBe(false);
      held.resolve(); expect(await selection).toEqual({ kind: "open", campaignId: f.scope.campaignId });
    } finally { held.resolve(); vi.useRealTimers(); vi.restoreAllMocks(); }
  });
  it("bounds an unavailable preference write without failing or removing a saved campaign", async () => {
    const f = await fixture(), held = deferred(), before = await f.cache.read(f.scope);
    vi.spyOn(f.entryStore, "write").mockImplementation(async () => { await held.promise; throw new Error("storage unavailable"); });
    vi.useFakeTimers();
    try {
      const remembered = rememberCampaignToReopen(f.runtime, f.scope.campaignId);
      await vi.advanceTimersByTimeAsync(CLOUD_READ_TIMEOUT_MS); await remembered;
      vi.useRealTimers();
      expect(await f.cache.read(f.scope)).toEqual(before); expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    } finally { held.resolve(); vi.useRealTimers(); vi.restoreAllMocks(); }
  });
});
