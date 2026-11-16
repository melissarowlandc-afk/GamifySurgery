import { beforeAll, afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { applyGameEvidenceCommand, compactGameState, createGameEvidenceCheckpoint, gameEvidenceDelta,
  importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createHistoryCompactionFixture } from "../../../../../tests/fixtures/history-compaction";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { journalRowText, MemoryJournalStorage, type JournalSeed, type JournalRow } from "../localJournal";
import { IndexedDbCloudCache } from "./cache";
import { codecTestCampaign } from "./codecTestSupport";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { logicalJsonText, sha256Utf8, type CodecJson } from "./codecJson";
import { snapshotEvidence, loadCloudSnapshot } from "./snapshotCodec";
import { bindJournal, prepareJournal, prepareJournalInWorker } from "./journalCodec";
import { cloudCodec } from "./codecWorker";
import { runCloudCodecTask } from "./codecTasks";
import { FakeCloudServer } from "./fakeTransport";
import { TestCloudClock } from "./syncTestSupport";
import { MemoryCloudEntryStore } from "./entryStorage";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudGameSession } from "./gameSession";
import { cloudStatusText } from "../../ui/CloudSaveControls";
import type { CloudConfirmed } from "./transport";
import { cloudCopyFamily } from "./copySelection";
import { protectClinicCopy } from "./retainedCopies";

const bytes = (v: unknown) => new TextEncoder().encode(JSON.stringify(v)).length;
const canonical = (v: unknown) => logicalJsonText(JSON.parse(JSON.stringify(v)) as CodecJson);
let base: GameState, latest: GameState, confirmed: CloudConfirmed, seed: JournalSeed, rows: JournalRow[];
beforeAll(async () => {
  // Public long-campaign history only. No private fixture or padding strings.
  base = createHistoryCompactionFixture(166, 12);
  for (let n = 0; bytes(base) < 2_999_600; n++) base.reviewIntents.push({ ...base.reviewIntents[0]!, id: `intent.public.pressure.${n}` });
  expect(bytes(base)).toBeLessThan(3_000_000);
  const campaign = codecTestCampaign(JSON.stringify(base)), lineage = { branchId: "public.over-cap", sequence: 19, parents: [] };
  const text = canonical({ cloudFormatVersion: 3, campaign, lineage, gameState: base });
  confirmed = { saveFormat: 3, campaignId: base.campaignId, revision: "19", acceptedAtMs: 1_800_000_000_000,
    snapshot: await compressCloudText(text), evidence: await snapshotEvidence(), baselineId: "snapshot.v1", lineage };
  const loaded = await loadCloudSnapshot({ ...confirmed, expectedRevision: "19", expectedCampaignId: base.campaignId });
  seed = { checkpoint: loaded.checkpoint, campaign, source: loaded.source, confirmed, usageQuestions: [],
    snapshotPolicy: { lineage }, writerGeneration: "0" };
  let checkpoint = loaded.checkpoint; rows = [];
  for (let n = 0; n < 27; n++) {
    const before = checkpoint;
    checkpoint = applyGameEvidenceCommand(checkpoint, { type: "SET_SIMULATION_SPEED", speed: n % 2 ? 4 : 2, operationId: `public.tail.${n}` }).checkpoint;
    rows.push({ version: n + 1, delta: gameEvidenceDelta(before, checkpoint), campaign, usageQuestions: [], writerGeneration: "0" });
  }
  latest = importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  expect(bytes(latest)).toBeGreaterThan(3_000_000);
  expect(bytes(compactGameState(latest))).toBeLessThan(2_000_000);
}, 90_000);
afterEach(() => vi.unstubAllGlobals());

async function durableFixture(inputSeed = seed, tail = rows) {
  const factory = new IDBFactory(); vi.stubGlobal("indexedDB", factory); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const cache = new IndexedDbCloudCache(factory, `public.over-cap.${crypto.randomUUID()}`);
  const scope = { backendId: "public.synthetic", accountId: "public.synthetic", campaignId: confirmed.campaignId };
  const key = cloudCampaignStorageKey(scope), clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow);
  server.setAccess(scope.accountId, { snapshotSaves: true }); server.seed(scope.accountId, confirmed);
  await cache.write({ schemaVersion: 1, scope, confirmed, recovery: null }, null);
  await bindJournal(cache.journal, key, "public.old-writer", inputSeed, cloudCodec);
  if (tail.length) await cache.journal.append(key, "public.old-writer", 0, tail);
  const runtime = { ...scope, cache, entryStore: new MemoryCloudEntryStore(), transport: server.transport(scope.accountId), region: "Synthetic" };
  return { cache, scope, key, clock, server, runtime };
}

it.each(["tail", "release-39-local-snapshot"])("opens and commits a verified over-cap %s through normal cache/entry", async mode => {
  const f = await durableFixture(); let session: CloudGameSession | undefined;
  try {
    if (mode === "release-39-local-snapshot") {
      // Exactly the old local writer: coalesce rows, without a cloud encode or
      // history adaptation. The original full seed still exceeds the cloud cap.
      const saved = await prepareJournal(f.cache.journal, f.key, cloudCodec, { local: true, encode: false, compact: true });
      expect(saved!.state).toEqual(latest);
      expect((await f.cache.journal.read(f.key))!.rows).toHaveLength(0);
    }
    const original = await f.cache.journal.read(f.key), before = canonical(original);
    const checked = await f.cache.read(f.scope);
    expect(checked!.entry.recovery!.following!.snapshot.uncompressedBytes).toBeLessThan(2_000_000);
    expect(canonical(await f.cache.journal.read(f.key))).toBe(before);
    expect(await f.cache.accountEntries(f.scope)).toHaveLength(1);
    const coordinator = await openAutomaticCloudCampaign({ runtime: f.runtime, campaignId: f.scope.campaignId, clock: f.clock });
    session = await CloudGameSession.create(coordinator, undefined, undefined, { operational: false });
    expect(session.canExecute).toBe(true); expect(coordinator.view.failure).toBeNull();
    expect(session.state).toEqual(compactGameState(latest));
    expect(compactGameState(session.state)).toEqual(session.state);
    expect(bytes(session.state)).toBeLessThan(2_000_000);
    for (const [id, history] of Object.entries(latest.learningHistories)) expect(session.state.learningHistories[id]!.card).toEqual(history.card);
    expect(await session.checkpointNow("purchase")).toBe(true);
    expect(Number(coordinator.confirmedRevision)).toBeGreaterThan(19);
    const committed = await f.runtime.transport.load(f.scope.campaignId, coordinator.confirmedRevision!);
    const loaded = await loadCloudSnapshot({ ...committed, expectedRevision: committed.revision, expectedCampaignId: f.scope.campaignId });
    expect(loaded.state).toEqual(session.state); expect(committed.snapshot.uncompressedBytes).toBeLessThan(2_000_000);
    expect(await decompressCloudText(confirmed.snapshot)).toBe(canonical({ cloudFormatVersion: 3, campaign: seed.campaign, lineage: confirmed.lineage, gameState: base }));
  } finally { session?.dispose(); await f.cache.close(); }
}, 90_000);

it("measures an original snapshot's owned compacted size without mutating its inspection/proof", async () => {
  const lineage = { ...confirmed.lineage!, sequence: 46 }, snapshot = await compressCloudText(canonical({ cloudFormatVersion: 3,
    campaign: seed.campaign, lineage, gameState: latest })), copy = { ...confirmed, snapshot, lineage };
  const input = { ...copy, expectedRevision: "19", expectedCampaignId: copy.campaignId, expectedBaselineId: "snapshot.v1" };
  const original = await decompressCloudText(snapshot);
  await expect(runCloudCodecTask({ kind: "verify", input })).resolves.toHaveProperty("evidenceRecords", 0);
  await expect(runCloudCodecTask({ kind: "inspectCopy", input: copy })).resolves.toHaveProperty("rank");
  const prepared = await runCloudCodecTask({ kind: "hydrate", input: { ...input, preparePlayable: true } });
  expect(prepared.state).toEqual(compactGameState(latest)); expect(await decompressCloudText(snapshot)).toBe(original);
  await expect(runCloudCodecTask({ kind: "inspectCopy", input: { ...copy, snapshot: { ...snapshot, uncompressedSha256: "0".repeat(64) } } })).rejects.toThrow();
}, 90_000);

it.each(["stored-head", "retained-copy"])("opens original %s bytes through inspection and copy selection before re-encoding", async source => {
  const lineage = { ...confirmed.lineage!, sequence: 46 }, copy = { ...confirmed, lineage,
    snapshot: await compressCloudText(canonical({ cloudFormatVersion: 3, campaign: seed.campaign, lineage, gameState: latest })) };
  expect(copy.snapshot.uncompressedBytes).toBeGreaterThan(3_000_000);
  const original = await decompressCloudText(copy.snapshot), clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow);
  const factory = new IDBFactory(); vi.stubGlobal("indexedDB", factory); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const cache = new IndexedDbCloudCache(factory, `public.stored.${crypto.randomUUID()}`), entryStore = new MemoryCloudEntryStore();
  const scope = { backendId: "public.stored", accountId: "public.stored", campaignId: confirmed.campaignId };
  server.setAccess(scope.accountId, { snapshotSaves: true }); server.seed(scope.accountId, source === "stored-head" ? copy : confirmed);
  if (source === "retained-copy") await protectClinicCopy(entryStore, await cloudCopyFamily(scope.campaignId), {
    copy, inspection: await runCloudCodecTask({ kind: "inspectCopy", input: copy }), source: "public.synthetic", usageQuestions: [],
  }, "Public synthetic old local artifact");
  const runtime = { ...scope, cache, entryStore, transport: server.transport(scope.accountId), region: "Synthetic" };
  let session: CloudGameSession | undefined;
  try {
    const coordinator = await openAutomaticCloudCampaign({ runtime, campaignId: scope.campaignId, clock });
    session = await CloudGameSession.create(coordinator, undefined, undefined, { operational: false });
    expect(session.canExecute).toBe(true); expect(session.state).toEqual(compactGameState(latest));
    expect(await session.checkpointNow("purchase")).toBe(true);
    const committed = await runtime.transport.load(scope.campaignId, coordinator.confirmedRevision!);
    expect(committed.snapshot.uncompressedBytes).toBeLessThan(2_000_000);
    expect((await loadCloudSnapshot({ ...committed, expectedRevision: committed.revision, expectedCampaignId: scope.campaignId })).state).toEqual(session.state);
    expect(await decompressCloudText(copy.snapshot)).toBe(original);
  } finally { session?.dispose(); await cache.close(); }
}, 90_000);

it.each(["same-branch", "child-branch", "unrelated-branch"])("keeps genuine capacity honest and preserves the %s authority fence", async branch => {
  const state = compactGameState(createHistoryCompactionFixture()), template = Object.values(base.employeeDiscussions!)[0]!;
  state.employeeDiscussions = {};
  for (let n = 0; bytes(state) < 3_020_000; n++) {
    const id = `discussion.public.live.${n}`;
    state.employeeDiscussions[id] = { ...structuredClone(template), id, lifecycle: "waiting_unopened", firstOpenedAtTick: null,
      resolvedAtFacilityTick: null, currentNodeIndex: 0, answers: [], steps: template.steps.map(step => ({ ...step, status: "locked", answer: null })) };
  }
  const expected = compactGameState(state); expect(bytes(expected)).toBeGreaterThan(3_000_000);
  const localSeed: JournalSeed = { ...seed, checkpoint: createGameEvidenceCheckpoint(state), snapshotPolicy: { lineage: { ...confirmed.lineage!, sequence: 20,
    ...(branch === "same-branch" ? {} : { branchId: "public.local-child", parents: [branch === "child-branch" ? confirmed.snapshot.uncompressedSha256 : "0".repeat(64)] }) } } };
  const f = await durableFixture(localSeed, []); let session: CloudGameSession | undefined;
  try {
    const checked = await f.cache.read(f.scope); expect(checked!.journalCapacity).toBe(true); expect(checked!.entry.recovery).toBeNull();
    await expect(prepareJournal(f.cache.journal, f.key, cloudCodec)).rejects.toMatchObject({ code: "capacity" });
    const coordinator = await openAutomaticCloudCampaign({ runtime: f.runtime, campaignId: f.scope.campaignId, clock: f.clock });
    if (branch === "unrelated-branch") {
      try {
        await expect(CloudGameSession.create(coordinator, undefined, undefined, { operational: false })).rejects.toMatchObject({ reason: "conflict" });
        expect((await prepareJournal(f.cache.journal, f.key, cloudCodec, { local: true, encode: false }))!.state).toEqual(state);
        expect(f.server.operationCount(f.scope.accountId)).toBe(0);
      } finally { coordinator.dispose(); }
      return;
    }
    session = await CloudGameSession.create(coordinator, undefined, undefined, { operational: false });
    expect(session.state).toEqual(expected); expect(session.canExecute).toBe(true);
    expect(await session.durable()).toBe(true);
    expect(coordinator.view).toMatchObject({ failure: "capacity", localDurable: true, canExecute: true });
    expect(cloudStatusText(session.syncView)).toBe("This clinic has reached the cloud save size limit. Progress is saving on this device.");
    expect(await session.checkpointNow("purchase")).toBe(false); expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    expect(await session.executeAsync({ type: "SET_PAUSED", paused: false, operationId: "public.capacity.continue" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.durable()).toBe(true);
    const recovered = await prepareJournal(f.cache.journal, f.key, cloudCodec, { local: true, encode: false });
    expect(recovered!.state).toEqual(session.state);
  } finally { session?.dispose(); await f.cache.close(); }
}, 90_000);

it.each(["seed-checksum", "row-checksum", "continuity", "replay", "base-proof"])("rejects original %s corruption before opening compaction", async kind => {
  const store = new MemoryJournalStorage(); await bindJournal(store, "public.corrupt", "public.old", seed, cloudCodec);
  await store.append("public.corrupt", "public.old", 0, rows);
  const data = (await store.read("public.corrupt"))!;
  if (kind === "seed-checksum") data.snapshot.sha256 = "0".repeat(64);
  if (kind === "row-checksum") data.rows[0]!.sha256 = "0".repeat(64);
  if (kind === "continuity") { data.rows[0]!.version++; data.rows[0]!.sha256 = await sha256Utf8(journalRowText(data.rows[0]!)); }
  if (kind === "replay") { data.rows[0]!.delta = { ...data.rows[0]!.delta!, fromSequence: data.rows[0]!.delta!.fromSequence + 1 }; data.rows[0]!.sha256 = await sha256Utf8(journalRowText(data.rows[0]!)); }
  const head = kind === "base-proof" ? { ...confirmed, snapshot: { ...confirmed.snapshot, uncompressedSha256: "0".repeat(64) } } : confirmed;
  await expect(prepareJournalInWorker({ data, base: head, allowCapacity: true })).rejects.toThrow();
}, 90_000);
