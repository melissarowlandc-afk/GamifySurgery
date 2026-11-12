import { IDBFactory } from "fake-indexeddb";
import { expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, gameEvidenceDelta } from "@gamify-surgery/game-domain";
import { syncFixture } from "./syncTestSupport";

it("reconstructs a snapshot journal and exact saved command after all codec module caches are discarded", async () => {
  // A browser worker's IDB data survives termination. Keep the factory while
  // replacing the complete codec module graph, including its derived caches.
  vi.stubGlobal("indexedDB", new IDBFactory());
  try {
    const fixture = await syncFixture("public.memory.recovery");
    const before = await import("./codecTasks"), { IndexedDbJournalStorage } = await import("../localJournal");
    const imported = await before.runCloudCodecTask({ kind: "snapshotImport", input: {
      serializedState: fixture.prepared.sourceRecovery.text, campaign: fixture.prepared.envelope.campaign, branchId: "public.memory.branch",
    } });
    const confirmed = { ...fixture.confirmed, saveFormat: 3 as const, snapshot: imported.snapshot,
      evidence: imported.packedEvidence, baselineId: imported.baselineId, lineage: imported.lineage };
    const seed = { checkpoint: fixture.prepared.checkpoint, campaign: fixture.prepared.envelope.campaign, source: null,
      confirmed, usageQuestions: [], snapshotPolicy: { lineage: imported.lineage } };
    const address = { database: "public.memory.recovery", key: "public.memory.journal" }, owner = "public.memory.owner";
    await before.runCloudCodecTask({ kind: "journalBind", input: { address, owner, expected: null, seed } });
    const command = { type: "DEV_ADD_MONEY", operationId: "public.memory.exactly-once" } as const;
    const expected = applyGameEvidenceCommand(seed.checkpoint, command);
    const store = new IndexedDbJournalStorage(address.database);
    await store.append(address.key, owner, 0, [{ version: 1, campaign: seed.campaign, usageQuestions: [],
      delta: gameEvidenceDelta(seed.checkpoint, expected.checkpoint) }]);
    const control = await before.runCloudCodecTask({ kind: "journalPrepare", input: { address, local: true } });
    expect(control?.state).toEqual(expected.state);
    expect(control?.through).toBe(1);

    vi.resetModules();
    const restarted = await import("./codecTasks");
    expect(restarted.runCloudCodecTask).not.toBe(before.runCloudCodecTask);
    const recovered = await restarted.runCloudCodecTask({ kind: "journalPrepare", input: { address, local: true } });
    expect(JSON.stringify(recovered)).toBe(JSON.stringify(control));
    expect(await restarted.runCloudCodecTask({ kind: "journalWarm", input: { address, owner } })).toEqual({ through: 1 });
    const hydrated = await restarted.runCloudCodecTask({ kind: "hydrate", input: { ...confirmed,
      snapshot: recovered!.candidate!.snapshot, lineage: recovered!.candidate!.lineage,
      expectedRevision: confirmed.revision, expectedCampaignId: confirmed.campaignId, expectedBaselineId: confirmed.baselineId } });
    expect(hydrated.state).toEqual(expected.state);
    expect(hydrated.state.learningHistories).toEqual(expected.state.learningHistories);
    expect((await store.head(address.key))?.highWater).toBe(1);
  } finally { vi.unstubAllGlobals(); }
}, 60_000);
