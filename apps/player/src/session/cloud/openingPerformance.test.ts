import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { createGameEvidenceCheckpoint, createInitialGameState } from "@gamify-surgery/game-domain";
import * as views from "../viewModels";
import * as snapshots from "./snapshotCodec";
import { cloudCodec } from "./codecWorker";
import { codecTestCampaign } from "./codecTestSupport";
import { IndexedDbJournalStorage, MemoryJournalStorage } from "../localJournal";
import { prepareJournal } from "./journalCodec";
import { sha256Utf8, utf8Bytes } from "./codecJson";
import { operationalSessionFixture, ControllableOperationalPort } from "./operationalSessionTestSupport";
import { publicCloudOpeningWorkload } from "./openingPerformanceTestSupport";
import { assertPerformanceBudgets, ciTime as hostedTime } from "../../../../../tests/support/performanceBudget";
import type { OperationalViewArguments } from "./operationalViewProjection";
import { deferred } from "./syncTestSupport";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("reuses the initial worker projection on a public large clinic, including restored UI inputs", async () => {
  const state = publicCloudOpeningWorkload();
  expect(state.rooms).toHaveLength(180); expect(state.employees).toHaveLength(50);
  expect(Object.keys(state.employeeDiscussions!)).toHaveLength(64); expect(state.serviceIncomeReceipts).toHaveLength(1_500);
  expect(utf8Bytes(JSON.stringify(state))).toBeGreaterThan(2_000_000);
  expect(utf8Bytes(JSON.stringify(state))).toBeLessThan(3_000_000);
  const now = 1_800_000_000_000; vi.spyOn(Date, "now").mockReturnValue(now);
  const args: OperationalViewArguments = [state.openChartEncounterId, false, null, false, null, 0,
    { zoom: 1.25, panX: 23, panY: -14 }, [], null];
  const f = await operationalSessionFixture({ initialProjection: args }, state);
  const original = views.createPrototypePlayerView, derive = vi.spyOn(views, "createPrototypePlayerView");
  try {
    const before = JSON.stringify(f.session.state), at = performance.now();
    const actual = f.session.playerView(f.session.state, ...args), readMs = performance.now() - at;
    expect(derive).not.toHaveBeenCalled(); // A wall-time allowance cannot hide a second full projection.
    expect(JSON.stringify(actual)).toBe(JSON.stringify(original(f.session.state, ...args)));
    expect(JSON.stringify(f.session.state)).toBe(before);
    assertPerformanceBudgets([{ label: "published initial view", actualMs: readMs, limitMs: hostedTime(16) }]);
    f.session.playerView(f.session.state, ...[args[0], true, ...args.slice(2)] as OperationalViewArguments);
    expect(derive).toHaveBeenCalledTimes(1); // Changed inputs still get the exact ordinary projection.
  } finally { f.session.dispose(); }
}, hostedTime(15_000));

it("keeps optional journal warming outside unpublished engine initialization", async () => {
  const state = createInitialGameState();
  const missing = Object.entries(state.learningHistories).find(([, history]) => history.reviews.length === 0)![0];
  delete state.learningHistories[missing];
  const port = new ControllableOperationalPort(); port.auto = false;
  const committed = deferred(), append = MemoryJournalStorage.prototype.append;
  vi.spyOn(MemoryJournalStorage.prototype, "append").mockImplementation(async function (this: MemoryJournalStorage, ...args) {
    const result = await append.apply(this, args); committed.resolve(); return result;
  });
  const tasks = vi.spyOn(cloudCodec, "run"), opening = operationalSessionFixture({ createPort: () => port }, state);
  let f: Awaited<typeof opening> | undefined;
  try {
    await vi.waitFor(() => expect(port.waiting[0]?.kind).toBe("initialize"), { timeout: hostedTime(5_000) });
    await committed.promise;
    for (let i = 0; i < 30; i++) await Promise.resolve(); // Run the commit observer while initialization is still held.
    expect(tasks.mock.calls.filter(([task]) => task.kind === "journalWarm")).toHaveLength(0);
    port.next(); f = await opening;
    expect(f.session.canExecute).toBe(true); expect(f.session.state.learningHistories[missing]).toBeDefined();
    expect(await f.session.durable()).toBe(true);
    expect((await f.cache.journal!.read((await f.cache.journal!.keys(""))[0]!))!.rows.length).toBeGreaterThan(0);
  } finally {
    if (port.waiting.length) port.next();
    (f ?? await opening).session.dispose();
  }
}, hostedTime(5_000));

it("reads compressed native seeds without encoding unchanged snapshots, retaining byte-exact candidates", async () => {
  const factory = new IDBFactory(); vi.stubGlobal("indexedDB", factory); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const source = publicCloudOpeningWorkload(), campaign = codecTestCampaign(JSON.stringify(source));
  const base = await snapshots.snapshotCopy(source, campaign, "1", 1_800_000_000_000,
    { branchId: "public.cloud-opening", sequence: 600, parents: [] });
  const loaded = await snapshots.loadCloudSnapshot({ ...base, expectedRevision: "1", expectedCampaignId: source.campaignId });
  const store = new IndexedDbJournalStorage("public.cloud-opening.perf", factory), key = "public.cloud-opening.perf";
  const seed = { checkpoint: createGameEvidenceCheckpoint(loaded.state), campaign: loaded.campaign, source: loaded.source,
    confirmed: base, usageQuestions: [], writerGeneration: "1", snapshotPolicy: { lineage: base.lineage! } };
  await store.bind(key, "public.owner", null, seed, await sha256Utf8(JSON.stringify(seed)));
  const encode = vi.spyOn(snapshots, "encodeCloudSnapshot"), hydrate = vi.spyOn(snapshots, "loadCloudSnapshot");
  try {
    for (let i = 0; i < 2; i++) {
      const prepared = await prepareJournal(store, key, cloudCodec, { base });
      expect(prepared!.candidate!.snapshot).toEqual(base.snapshot);
      expect(prepared!.candidate!.lineage).toEqual(base.lineage);
      expect(prepared!.candidate!.campaign).toEqual(campaign);
    }
    expect(encode).not.toHaveBeenCalled();
    expect(hydrate).toHaveBeenCalledTimes(1); // Actual-byte proof survives repeated recovery comparisons.
  } finally {
    const deletion = factory.deleteDatabase("public.cloud-opening.perf");
    await new Promise<void>((resolve, reject) => { deletion.onsuccess = () => resolve(); deletion.onerror = () => reject(deletion.error); });
  }
}, hostedTime(15_000));
