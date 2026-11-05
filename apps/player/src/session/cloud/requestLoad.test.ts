import { expect, it, vi } from "vitest";
import { syncHarness, TestCloudClock } from "./syncTestSupport";
import { FakeCloudServer } from "./fakeTransport";
import { CloudSyncCoordinator } from "./coordinator";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { cloudCodec } from "./codecWorker";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { accountRequestsActive, MAX_HEALTHY_LEASE_MS, setAccountRequestsActive } from "../requestBudget";

it.each([60_000, MAX_HEALTHY_LEASE_MS])("keeps exact server-granted fencing with %s ms leases and no requests after close", async duration => {
  const clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow, duration);
  const h = await syncHarness({ clock, server, accountId: `cadence.${duration}` });
  try {
    expect(await h.coordinator.open()).toBe(true); expect(await h.coordinator.startWriter()).toBe(true); expect(h.coordinator.resume()).toBe(true);
    const read = vi.spyOn(h.cache, "read"), write = vi.spyOn(h.cache, "write"), codec = vi.spyOn(cloudCodec, "run");
    const initial = server.calls.length;
    for (let second = 1; second <= 3_600; second++) { clock.advance(1_000); await h.coordinator.pulse(); expect(h.coordinator.view.canExecute).toBe(true); }
    const calls = server.calls.slice(initial);
    expect(calls.every(row => row.method === "renew")).toBe(true);
    expect(calls).toHaveLength(duration === 60_000 ? 240 : 12);
    expect(read).not.toHaveBeenCalled(); expect(write).not.toHaveBeenCalled(); expect(codec).not.toHaveBeenCalled();
    read.mockRestore(); write.mockRestore(); codec.mockRestore();
    expect(await h.coordinator.saveAndClose()).toBe(true);
    expect(accountRequestsActive(h.scope.accountId)).toBe(false);
    const closedCount = server.calls.length;
    for (let i = 0; i < 30; i++) { clock.advance(60_000); await h.coordinator.pulse(); await h.coordinator.foreground(true); }
    expect(server.calls).toHaveLength(closedCount); expect(h.coordinator.view.canExecute).toBe(false);
  } finally { h.coordinator.dispose(); setAccountRequestsActive(h.scope.accountId, true); }
});
it("a ten-minute lease cannot renew, release or upload after a fenced takeover", async () => {
  const clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow, MAX_HEALTHY_LEASE_MS);
  const h = await syncHarness({ clock, server });
  try {
    await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
    const transport = server.transport(h.scope.accountId), head = await transport.head(h.scope.campaignId);
    await transport.acquire({ campaignId: head.campaignId, expectedRevision: head.revision, expectedWriterGeneration: head.writerGeneration,
      writerToken: "other-token", operationId: "other-open", takeover: true });
    clock.advance(300_000); await h.coordinator.pulse(); expect(h.coordinator.view.canExecute).toBe(false);
    expect(await h.coordinator.saveAndClose()).toBe(false);
    expect(server.operationCount(h.scope.accountId)).toBe(0);
  } finally { h.coordinator.dispose(); }
});
it("polls read-only metadata at most twice per five minutes and never polls hidden", async () => {
  const h = await syncHarness();
  try {
    expect(await h.coordinator.open()).toBe(true); const first = h.server.calls.length;
    for (let i = 0; i < 3_600; i++) { h.clock.advance(1_000); await h.coordinator.pulse(); }
    expect(h.server.calls.length - first).toBe(24); expect(h.coordinator.view.canExecute).toBe(false);
    const visibleCount = h.server.calls.length; vi.stubGlobal("document", { visibilityState: "hidden" });
    for (let i = 0; i < 60; i++) { h.clock.advance(60_000); await h.coordinator.pulse(); await h.coordinator.foreground(true); }
    expect(h.server.calls).toHaveLength(visibleCount);
  } finally { vi.unstubAllGlobals(); h.coordinator.dispose(); }
});
it("preserves exponential recovery backoff across replacement offline coordinators", async () => {
  const h = await syncHarness(), entryStore = new MemoryCloudEntryStore();
  let current = h.coordinator, replacements = 0;
  const replaceOffline = async () => {
    const next = new CloudSyncCoordinator({ scope: h.scope, cache: h.cache, transport: h.server.transport(h.scope.accountId), entryStore, clock: h.clock, enabled: true });
    expect(await next.restoreVerifiedOffline(h.confirmed)).toBe(true);
    next.onAutomaticSelection(async () => { const old = current; await replaceOffline(); old.dispose(); replacements++; return true; });
    current = next;
  };
  await replaceOffline(); const before = h.server.calls.length;
  try {
    for (let second = 0; second < 1_800; second++) { h.clock.advance(1_000); await current.pulse(); expect(current.view.canExecute).toBe(true); }
    expect(replacements).toBeGreaterThan(5); expect(replacements).toBeLessThanOrEqual(14);
    expect(h.server.calls.length - before).toBe(replacements);
    expect(h.server.calls.slice(before).every(row => row.method === "capabilities")).toBe(true);
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
  } finally { current.dispose(); h.coordinator.dispose(); }
});
it("does not let a closed game session's focus/pageshow wrapper reopen the account in the background", async () => {
  const h = await syncHarness(); await h.coordinator.open(); await h.coordinator.startWriter(); h.coordinator.resume();
  const reopen = vi.fn(async () => { await h.server.transport(h.scope.accountId).capabilities(); return true; });
  const session = await CloudGameSession.create(h.coordinator, undefined, reopen, { journal: false });
  try {
    expect(await session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const count = h.server.calls.length;
    for (let i = 0; i < 20; i++) { h.clock.advance(60_000); await session.foreground(true); await session.pulse(); }
    expect(reopen).not.toHaveBeenCalled(); expect(h.server.calls).toHaveLength(count); expect(session.canExecute).toBe(false);
  } finally { session.dispose(); setAccountRequestsActive(h.scope.accountId, true); }
});
