import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../../ui/testDomHarness";
import { CloudCampaignEntry } from "../../ui/CloudCampaignEntry";
import { CloudAccountContext, type CloudAccountValue } from "./CloudAccount";
import { IndexedDbCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { AUTOMATIC_ENROLLMENT_KEY } from "./importCampaigns";
import { FakeCloudServer } from "./fakeTransport";
import { cloudCodec, CloudCodecWorker } from "./codecWorker";
import { MessageChannelCloudCodecWorker } from "./codecWorkerMessageTestSupport";
import { largeEntryFixture } from "./entryPerformanceTestSupport";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudGameSession } from "./gameSession";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import * as copySelection from "./copySelection";
import { mkdirSync, writeFileSync } from "node:fs";
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

vi.mock("../../feedback/TesterFeedback", () => ({ ProblemReportButton: () => null }));
afterEach(async () => { vi.useRealTimers(); await cleanupPhoneTests(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("enables a ~5 MB cached Level 5 row without a codec task, then verifies/opens through real queued clone boundaries", async () => {
  const f = await largeEntryFixture();
  vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const native = new MessageChannelCloudCodecWorker(), codec = new CloudCodecWorker(() => native);
  vi.spyOn(cloudCodec, "run").mockImplementation(task => codec.run(task));
  const scope = { backendId: "large-entry", accountId: "large-entry", campaignId: f.copy.campaignId };
  const cache = new IndexedDbCloudCache(), entryStore = new MemoryCloudEntryStore(), server = new FakeCloudServer();
  server.seed(scope.accountId, f.copy);
  const entry = { schemaVersion: 1 as const, scope, confirmed: f.copy, recovery: { baseRevision: "1", writerGeneration: "1", inFlight: null,
    following: { campaign: f.prepared.envelope.campaign, snapshot: f.copy.snapshot,
      evidence: { headerSha256: f.copy.evidence.header.uncompressedSha256, fromRecord: f.copy.evidence.records.length, toRecord: f.copy.evidence.records.length, records: [] }, usageQuestions: [] } } };
  expect(new TextEncoder().encode(JSON.stringify(entry)).length).toBeGreaterThan(4_900_000);
  await cache.write(entry, null);
  await entryStore.write(AUTOMATIC_ENROLLMENT_KEY, { version: 1, phase: "complete", candidates: [], selectedIds: [], freeSlots: 1 });
  await entryStore.write("older-copy:large", { version: 1, family: "test", copy: f.copy, usageQuestions: [], reason: "test" });
  const runtime = { ...scope, region: "Synthetic", cache, entryStore, transport: server.transport(scope.accountId) };
  let session: CloudGameSession | null = null;
  const onOpen = vi.fn(async (campaignId: string) => { session = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime, campaignId, codec })); });
  const cloud: CloudAccountValue = { runtime, access: await runtime.transport.capabilities(), summaries: await runtime.transport.list(), phase: "available", error: null, active: null,
    refresh: async () => {}, acceptNotice: async () => {}, attach: () => {}, stop: async () => {}, requestDeletion: async () => {}, exportDeviceRecovery: async () => "",
    clearDevice: async () => {}, showCampaigns: () => {}, setCampaignNavigation: () => {} };
  const env = phoneTestDom(), tasks = vi.spyOn(codec, "run"), read = vi.spyOn(cache, "read"), copies = vi.spyOn(cache, "accountEntries");
  const inspections = vi.spyOn(copySelection, "inspectLoadedCopy"), entered = performance.now();
  try {
    await env.render(<AuthAccountContext.Provider value={scope.accountId}><CloudAccountContext.Provider value={cloud}>
      <CloudCampaignEntry onOpen={onOpen} onCreate={() => {}} />
    </CloudAccountContext.Provider></AuthAccountContext.Provider>);
    await vi.waitFor(async () => { await act(async () => {}); expect(env.button(`Resume ${f.prepared.envelope.campaign.name}`).attributes.disabled).toBeUndefined(); });
    expect(tasks).not.toHaveBeenCalled(); expect(read).not.toHaveBeenCalled(); expect(copies).not.toHaveBeenCalled();
    const resumeReadyMs = performance.now() - entered;
    expect(allElements(env.doc.body, row => row.attributes.role === "dialog")).toHaveLength(0);
    const opening = performance.now(); await env.click(`Resume ${f.prepared.envelope.campaign.name}`);
    await vi.waitFor(async () => { await act(async () => {}); expect(session?.canExecute).toBe(true); }, { timeout: hostedTime(20_000) });
    expect(session!.state.simulationSpeed).toBe(2); expect(session!.state.paused).toBe(true);
    expect(codec.health).toMatchObject({ restarts: 0, lastError: null });
    expect(inspections).toHaveBeenCalledTimes(1);
    if (process.env.GAMIFY_ENTRY_MEASURE === "1") {
      const folder = new URL("../../../../../.local-dev/entry-performance-20261102/", import.meta.url); mkdirSync(folder, { recursive: true });
      writeFileSync(new URL("entry-measurements.json", folder), JSON.stringify({ cacheBytes: new TextEncoder().encode(JSON.stringify(entry)).length,
        resumeReadyMs, openMs: performance.now() - opening, fullInspections: inspections.mock.calls.length,
        tasks: tasks.mock.calls.reduce((counts, [task]) => ({ ...counts, [task.kind]: (counts[task.kind] ?? 0) + 1 }), {} as Record<string, number>) }, null, 2));
    }
    const completed = problemDiagnostics.report().current.health.entry!;
    expect(completed.stage).toBe("complete"); const elapsed = completed.elapsedMs;
    vi.useFakeTimers(); await act(async () => { await vi.advanceTimersByTimeAsync(49_401); }); vi.useRealTimers();
    expect(problemDiagnostics.report().current.health.entry!.elapsedMs).toBe(elapsed);
  } finally { (session as CloudGameSession | null)?.dispose(); codec.dispose(); await cache.close(); }
}, hostedTime(60_000));
