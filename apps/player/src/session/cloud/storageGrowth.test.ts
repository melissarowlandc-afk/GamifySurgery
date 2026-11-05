import { afterEach, expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";
import { importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { cloudCodec } from "./codecWorker";
import { tickCommand, tickSession } from "./tickPerformanceTestSupport";
import { prepareJournal } from "./journalCodec";
import type { JournalRow, JournalSnapshot } from "../localJournal";
import { largeEntryFixture } from "./entryPerformanceTestSupport";
import { snapshotCopy } from "./snapshotCodec";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { CloudGameSession } from "./gameSession";
import { FakeCloudServer } from "./fakeTransport";
import { TestCloudClock } from "./syncTestSupport";
import { openAutomaticCloudCampaign } from "./automaticResolution";

afterEach(() => vi.restoreAllMocks());
const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;

it("bounds native durable storage through thousands of real ticks and acknowledged checkpoints", async () => {
  const f = await tickSession(true), key = cloudCampaignStorageKey(f.scope), journal = f.cache.journal;
  const counters = { warm: 0, fullReads: 0, readRows: 0 };
  const run = cloudCodec.run.bind(cloudCodec), read = journal.read.bind(journal);
  vi.spyOn(cloudCodec, "run").mockImplementation(task => { if (task.kind === "journalWarm") counters.warm++; return run(task); });
  vi.spyOn(journal, "read").mockImplementation(async selected => { const value = await read(selected); counters.fullReads++; counters.readRows += value?.rows.length ?? 0; return value; });
  const points: unknown[] = [], ackRows: number[] = [];
  const stored = () => {
    const value = (journal as unknown as { data: Map<string, { rows: Map<number, JournalRow>; snapshots: Map<number, JournalSnapshot> }> }).data.get(key)!;
    return { rows: value.rows.size, rowBytes: Buffer.byteLength(JSON.stringify([...value.rows.values()])), snapshots: value.snapshots.size,
      snapshotBytes: Buffer.byteLength(JSON.stringify([...value.snapshots.values()])) };
  };
  const idle = async () => { while ((f.session as unknown as { warming: Promise<unknown> | null }).warming) await (f.session as unknown as { warming: Promise<unknown> }).warming; };
  const started = performance.now();
  try {
    for (let i = 0; i < 2_048; i++) {
      expect(f.session.execute(tickCommand(i, f.state.createdAtRealMs), PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      if ((i + 1) % 32 === 0) { expect(await f.session.durable()).toBe(true); await idle(); }
      if ((i + 1) % 256 === 0) {
        const before = stored();
        expect(await f.session.checkpointNow("purchase")).toBe(true);
        await (f.session as unknown as { compacting: Promise<unknown> | null }).compacting;
        const after = stored(); ackRows.push(after.rows);
        points.push({ ticks: i + 1, before, after, tail: (f.session as unknown as { checkpoint: { snapshot: { head: { sequence: number } } } }).checkpoint.snapshot.head.sequence });
      }
    }
    const exact = structuredClone(f.session.state);
    const restored = await prepareJournal(journal, key, cloudCodec, { local: true, encode: false });
    expect(restored?.state).toStrictEqual(exact);
    const report = { elapsedMs: performance.now() - started, facilityTick: exact.facilityTick, ...counters, points };
    if (process.env.STORAGE_GROWTH_REPORT) writeFileSync(process.env.STORAGE_GROWTH_REPORT, JSON.stringify(report, null, 2));
    console.log("STORAGE_GROWTH", JSON.stringify(report));
    // A verified current-state snapshot makes the acknowledged native move
    // rows redundant; the complete prior snapshot remains a protected backup.
    expect(ackRows).toEqual(Array(8).fill(0));
  } finally { f.session.dispose(); }
}, hostedTime(120_000));

it("keeps a retained ~5 MB Level 5 source protected while repeated native checkpoints and reloads retain only bounded derived stores", async () => {
  const f = await largeEntryFixture(1_200, true), state = importGameEvidence(f.prepared.checkpoint.snapshot, f.prepared.checkpoint.evidence);
  const clock = new TestCloudClock(), cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore(), server = new FakeCloudServer(clock.wallNow);
  const scope = { backendId: "storage-level5", accountId: "level5", campaignId: state.campaignId };
  server.setAccess(scope.accountId, { snapshotSaves: true });
  server.seed(scope.accountId, await snapshotCopy(state, f.prepared.envelope.campaign, "57", clock.wall, { branchId: "storage.level5", sequence: 10_000, parents: [] }));
  // A genuine retained source is not a quota-eviction candidate.
  const protectedCopy = { original: f.copy };
  await entryStore.create("protected-fixture", protectedCopy);
  const runtime = { ...scope, region: "test", cache, entryStore, transport: server.transport(scope.accountId) };
  const open = async () => CloudGameSession.create(await openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, clock }));
  let session = await open(), nativeReadRows = 0, preparations = 0;
  const read = cache.journal.read.bind(cache.journal), codec = cloudCodec.run.bind(cloudCodec);
  vi.spyOn(cache.journal, "read").mockImplementation(async key => { const value = await read(key); nativeReadRows += value?.rows.length ?? 0; return value; });
  vi.spyOn(cloudCodec, "run").mockImplementation(task => { if (task.kind === "journalWarm") preparations++; return codec(task); });
  const rows: unknown[] = [], started = performance.now(), key = cloudCampaignStorageKey(scope);
  try {
    // More than one thousand ordinary commits, including many complete device
    // lifetimes. No synthetic clinical data or state padding is added.
    for (let batch = 0; batch < 8; batch++) {
      for (let index = 0; index < 128; index++) {
        expect(session.execute({ type: "SET_SIMULATION_SPEED", speed: index % 2 ? 2 : 4,
          operationId: `large-storage.${batch}.${index}` }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
        if ((index + 1) % 16 === 0) expect(await session.durable()).toBe(true);
      }
      const local = cache.journal.data.get(key)!, beforeBytes = Buffer.byteLength(JSON.stringify([...local.rows.values()]));
      expect(await session.checkpointNow("purchase")).toBe(true);
      await (session as unknown as { compacting: Promise<unknown> | null }).compacting;
      const exact = structuredClone(session.state); session.dispose(); session = await open();
      expect(session.state).toStrictEqual(exact); expect(session.canExecute).toBe(true);
      const entries = await entryStore.entries(), stored = cache.journal.data.get(key)!;
      rows.push({ batch, beforeBytes, rows: stored.rows.size, snapshots: stored.snapshots.size, cacheRecords: cache.records.size,
        entryRecords: entries.length, entryBytes: Buffer.byteLength(JSON.stringify(entries)) });
      expect(stored.rows.size).toBe(0); expect(stored.snapshots.size).toBe(2); expect(cache.records.size).toBe(1);
      expect(entries.filter(row => row.key.startsWith("conflict:") || row.key.startsWith("older-copy:"))).toHaveLength(0);
      expect(await entryStore.read("protected-fixture")).toStrictEqual(protectedCopy);
    }
    expect(server.operationCount(scope.accountId)).toBe(8);
    const report = { sourceBytes: Buffer.byteLength(JSON.stringify(f.copy)), stateBytes: Buffer.byteLength(JSON.stringify(state)),
      elapsedMs: performance.now() - started, preparations, nativeReadRows, rows };
    if (process.env.STORAGE_GROWTH_REPORT) writeFileSync(process.env.STORAGE_GROWTH_REPORT.replace(/\.json$/, "-level5.json"), JSON.stringify(report, null, 2));
    console.log("STORAGE_LEVEL5", JSON.stringify(report));
  } finally { session.dispose(); }
}, hostedTime(180_000));
