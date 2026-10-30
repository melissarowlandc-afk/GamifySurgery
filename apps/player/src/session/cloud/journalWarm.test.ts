import { afterEach, describe, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { createLevelFiveIntegrationQaState } from "../../../../../tests/fixtures/level-five-integration-qa";
import { CloudGameSession } from "./gameSession";
import { CloudSyncCoordinator } from "./coordinator";
import { IndexedDbCloudCache, MemoryCloudCache } from "./cache";
import { FakeCloudServer } from "./fakeTransport";
import { prepareCloudEvidenceImport, encodeCloudEvidenceCheckpoint } from "./codecEvidence";
import { codecTestCampaign } from "./codecTestSupport";
import { cloudCodec } from "./codecWorker";
import { prepareJournal } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { journalWorkerAddress, journalWorkerStore } from "../localJournal";
import { sha256Utf8 } from "./codecJson";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("worker-owned incremental prepared candidates", () => {
  it.each([
    { level: "level1", native: false }, { level: "level5", native: false },
    { level: "level1", native: true }, { level: "level5", native: true },
  ])("matches the full v2 encoder byte for byte after recorded changes, compaction and retries ($level, IDB=$native)", async ({ level, native }) => {
    if (native) { vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange); }
    const state = level === "level1" ? createInitialGameState() : createLevelFiveIntegrationQaState("integration-running", PROTOTYPE_DOMAIN_CONTEXT);
    const serializedState = serializeGameState(state), imported = await prepareCloudEvidenceImport({ serializedState, campaign: codecTestCampaign(serializedState), operationId: "warm.import" });
    const confirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: Date.now(), baselineId: imported.envelope.baselineId, snapshot: imported.snapshot, evidence: imported.packedEvidence };
    const server = new FakeCloudServer(), cache = native ? new IndexedDbCloudCache() : new MemoryCloudCache(), scope = { backendId: "warm", accountId: "warm", campaignId: state.campaignId };
    server.seed(scope.accountId, confirmed);
    const coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport(scope.accountId), enabled: true });
    await coordinator.open(); await coordinator.startWriter(); coordinator.resume(); const session = await CloudGameSession.create(coordinator);
    try {
      const calls = vi.spyOn(cloudCodec, "run");
      for (let i = 0; i < 4; i++) session.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 4 : 2, operationId: `warm.${i}` }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await session.durable()).toBe(true); expect(await session.prepareRecoveryCopy()).toBe(true);
      const key = cloudCampaignStorageKey(scope), ready = (await cache.journal.prepared(key))!;
      const restored = (await prepareJournal(cache.journal, key, cloudCodec, { local: true, encode: false, compact: true }))!;
      const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint: restored.seed!.checkpoint, campaign: ready.candidate.campaign,
        source: restored.seed!.source!, operationId: "expected", expectedRevision: "1",
        acknowledgedEvidence: { headerSha256: confirmed.evidence.header.uncompressedSha256, records: confirmed.evidence.records.length } });
      expect(ready.candidate.snapshot).toEqual(encoded.snapshot);
      expect(ready.candidate.evidence).toEqual(encoded.request.evidence);
      const head = (await cache.journal.head(key))!;
      const address = journalWorkerAddress(cache.journal, key);
      await cloudCodec.run({ kind: "journalWarm", input: { address, owner: head.owner } });
      expect((await cache.journal.prepared(key))!.candidate).toEqual(ready.candidate);
      expect((await cache.journal.head(key))!.highWater).toBe(head.highWater);
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 1, operationId: "after.compaction" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await session.prepareRecoveryCopy()).toBe(true);
      const current = coordinator.pendingCandidate!;
      expect(current.evidence.records.length).toBeGreaterThan(ready.candidate.evidence.records.length);
      for (const command of [
        { type: "SET_PAUSED" as const, paused: false, operationId: "warm.running" },
        { type: "ADVANCE_TICK" as const, operationId: "warm.tick.one" },
        { type: "ADVANCE_TICK" as const, operationId: "warm.tick.two" },
      ]) { expect(session.execute(command, PROTOTYPE_DOMAIN_CONTEXT)).toBeTruthy(); expect(await session.prepareRecoveryCopy()).toBe(true); }
      const latest = (await prepareJournal(cache.journal, key, cloudCodec, { local: true, encode: false }))!;
      const full = await encodeCloudEvidenceCheckpoint({ checkpoint: latest.seed!.checkpoint, campaign: session.metadata,
        source: latest.seed!.source!, operationId: "expected.ticks", expectedRevision: "1",
        acknowledgedEvidence: { headerSha256: confirmed.evidence.header.uncompressedSha256, records: confirmed.evidence.records.length } });
      expect(coordinator.pendingCandidate!.snapshot).toEqual(full.snapshot);
      expect(coordinator.pendingCandidate!.evidence).toEqual(full.request.evidence);
      // An acknowledgement only moves the small cursor. Later batches append
      // their suffix, never reintroducing the accepted immutable records.
      expect(await session.checkpointNow("purchase")).toBe(true);
      const accepted = coordinator.confirmed!.evidence.records.length;
      session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "after.ack" }, PROTOTYPE_DOMAIN_CONTEXT);
      expect(await session.prepareRecoveryCopy()).toBe(true);
      expect(coordinator.pendingCandidate!.evidence.fromRecord).toBe(accepted);
      expect(coordinator.pendingCandidate!.evidence.records.every(row => Number.parseInt(row.id.slice(1), 36) > accepted)).toBe(true);
      const warmCalls = calls.mock.calls.filter(([task]) => task.kind === "journalWarm");
      expect(warmCalls.length).toBeGreaterThan(0);
      expect(warmCalls.every(([task]) => JSON.stringify(task).length < 350)).toBe(true);
      expect(server.operationCount(scope.accountId)).toBe(1);
      // The task's owner is checked again after asynchronous reads. A previous
      // document cannot adopt a replacement owner's mirror during a bind race.
      const workerStore = journalWorkerStore(address), readHead = workerStore.head.bind(workerStore);
      vi.spyOn(workerStore, "head").mockImplementationOnce(async target => {
        const prior = (await readHead(target))!;
        const replacement = (await prepareJournal(cache.journal, key, cloudCodec, { local: true, encode: false }))!.seed!;
        const seed = { ...replacement, confirmed: coordinator.confirmed! };
        await cache.journal.bind(key, "replacement-owner", prior, seed, await sha256Utf8(JSON.stringify(seed)));
        return prior;
      });
      await expect(cloudCodec.run({ kind: "journalWarm", input: { address, owner: head.owner } })).rejects.toMatchObject({ reason: "conflict" });
    } finally { session.dispose(); }
  }, 30_000);
});
