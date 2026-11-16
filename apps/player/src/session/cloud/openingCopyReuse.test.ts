import { afterEach, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudSyncCoordinator } from "./coordinator";
import { FakeCloudServer } from "./fakeTransport";
import { TestCloudClock } from "./syncTestSupport";
import { codecTestCampaign } from "./codecTestSupport";
import { snapshotCopy } from "./snapshotCodec";
import { openAutomaticCloudCampaign } from "./automaticResolution";

afterEach(() => vi.restoreAllMocks());
async function fixture() {
  const state = createInitialGameState(), campaign = codecTestCampaign(JSON.stringify(state)), clock = new TestCloudClock();
  const copy = await snapshotCopy(state, campaign, "1", clock.wall, { branchId: "opening.reuse.public", sequence: 10, parents: [] });
  const scope = { backendId: "opening.reuse", accountId: crypto.randomUUID(), campaignId: state.campaignId };
  const server = new FakeCloudServer(clock.wallNow); server.setAccess(scope.accountId, { snapshotSaves: true }); server.seed(scope.accountId, copy);
  const transport = server.transport(scope.accountId), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore();
  const coordinator = new CloudSyncCoordinator({ scope, transport, cache, entryStore, clock, enabled: true });
  return { state, campaign, copy, scope, server, transport, cache, entryStore, coordinator, clock };
}

it("reuses fetched native bytes only after a fresh head check and retains read-only ownership", async () => {
  const f = await fixture(), load = vi.spyOn(f.transport, "load"), head = vi.spyOn(f.transport, "head");
  try {
    expect(await f.coordinator.open(false, f.copy)).toBe(true);
    expect(head).toHaveBeenCalledExactlyOnceWith(f.scope.campaignId); expect(load).not.toHaveBeenCalled();
    expect(f.coordinator.confirmed).toEqual(f.copy); expect(f.coordinator.view.canExecute).toBe(false);
    expect(f.server.calls.some(row => row.method === "acquire")).toBe(false);
  } finally { f.coordinator.dispose(); }
});

it.each(["revision", "scope", "forced"] as const)("does not reuse a fetched copy across a changed %s", async change => {
  const f = await fixture(), load = vi.spyOn(f.transport, "load");
  let supplied = f.copy;
  if (change === "revision") {
    const next = await snapshotCopy({ ...f.state, simulationSpeed: 4 }, f.campaign, "2", f.clock.wall,
      { ...f.copy.lineage!, sequence: 11 });
    f.server.seed(f.scope.accountId, next);
  } else if (change === "scope") supplied = { ...f.copy, campaignId: "different.campaign" };
  try {
    expect(await f.coordinator.open(change === "forced", supplied)).toBe(true);
    expect(load).toHaveBeenCalledTimes(1);
    expect(f.coordinator.confirmed!.revision).toBe(change === "revision" ? "2" : "1");
    expect(f.coordinator.view.canExecute).toBe(false);
  } finally { f.coordinator.dispose(); }
});

it("fully verifies supplied bytes instead of trusting matching claimed digests", async () => {
  const f = await fixture();
  try {
    const corrupted = { ...f.copy, snapshot: { ...f.copy.snapshot, dataBase64: "AAAA" } };
    expect(await f.coordinator.open(false, corrupted)).toBe(false);
    expect(f.coordinator.view.canExecute).toBe(false); expect(await f.cache.read(f.scope)).toBeNull();
    expect(f.server.operationCount(f.scope.accountId)).toBe(0);
  } finally { f.coordinator.dispose(); }
});

it("downloads an immutable account head once during automatic opening without dropping authority checks", async () => {
  const f = await fixture(), load = vi.spyOn(f.transport, "load");
  const coordinator = await openAutomaticCloudCampaign({ runtime: { ...f.scope, region: "public.test", transport: f.transport,
    cache: f.cache, entryStore: f.entryStore }, campaignId: f.scope.campaignId, clock: f.clock });
  try {
    expect(load).toHaveBeenCalledExactlyOnceWith(f.scope.campaignId, "1");
    expect(f.server.calls.filter(row => row.method === "head").length).toBeGreaterThanOrEqual(3);
    expect(f.server.calls.filter(row => row.method === "capabilities").length).toBeGreaterThanOrEqual(2);
    expect(coordinator.view.canExecute).toBe(true); expect(f.server.operationCount(f.scope.accountId)).toBe(0);
  } finally { coordinator.dispose(); f.coordinator.dispose(); }
});
