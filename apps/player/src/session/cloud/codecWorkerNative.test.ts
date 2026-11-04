import { expect, it } from "vitest";
import { nativeDevCodecFactory } from "./codecWorkerNativeTestSupport";
import { CloudCodecWorker } from "./codecWorker";
import { syncFixture } from "./syncTestSupport";

it("reproduces the pre-fix JSX dependency failing before worker readiness", async () => {
  const native = await nativeDevCodecFactory(true), codec = new CloudCodecWorker(native.create, 10_000, 5_000);
  try {
    await expect(codec.run({ kind: "hash", input: "" })).rejects.toMatchObject({ code: "worker_unavailable" });
    expect(native.errors).toEqual(["window is not defined", "window is not defined"]);
  } finally { codec.dispose(); await native.close(); }
}, 60_000);

it("starts the real development worker without window/React Refresh and settles every new journal task across native cloning", async () => {
  const native = await nativeDevCodecFactory(), codec = new CloudCodecWorker(native.create, 10_000, 5_000);
  try {
    // Before the fix, journal -> diagnostics -> appVersion.tsx pulled in
    // /@react-refresh, which threw `window is not defined` before ready/hash.
    expect(await codec.run({ kind: "hash", input: "" })).toHaveLength(64);
    const fixture = await syncFixture("native.worker"), address = { database: "native-journal", key: "native.worker" };
    const seed = { checkpoint: fixture.prepared.checkpoint, campaign: fixture.prepared.envelope.campaign,
      source: { sha256: fixture.prepared.sourceRecovery.sha256, utf8Bytes: fixture.prepared.sourceRecovery.utf8Bytes, schemaVersion: 9 },
      confirmed: fixture.confirmed, usageQuestions: [] };
    // Use the worker's own IDB connection; no same-realm store/WeakMap leaks.
    const head = await codec.run({ kind: "journalBind", input: { address, owner: "native.owner", expected: null, seed } });
    expect(head.highWater).toBe(0);
    const local = await codec.run({ kind: "journalPrepare", input: { address, local: true, encode: false } });
    expect(local?.state?.campaignId).toBe("native.worker"); expect(local?.seed?.checkpoint).toEqual(seed.checkpoint);
    expect(await codec.run({ kind: "journalWarm", input: { address, owner: "native.owner" } })).toEqual({ through: 0 });
    expect(await codec.run({ kind: "journalPrepare", input: { address, compact: true } })).toMatchObject({ through: 0, candidate: null });
    const upgraded = await codec.run({ kind: "snapshotUpgrade", input: { confirmed: fixture.confirmed, candidate: null } });
    expect(upgraded).toMatchObject({ saveFormat: 3, evidence: { records: [], fromRecord: 0, toRecord: 0 } });
    expect(upgraded.legacyBaseSnapshot).toBeDefined();
    expect(await codec.run({ kind: "snapshotConvert", input: { copy: fixture.confirmed } })).toMatchObject({ saveFormat: 3, evidence: { records: [] } });
    const imported = await codec.run({ kind: "snapshotImport", input: { serializedState: fixture.prepared.sourceRecovery.text,
      campaign: seed.campaign, branchId: "native.import" } });
    const nativeAddress = { database: "native-snapshot-journal", key: "native.worker" };
    const nativeCopy = { ...fixture.confirmed, saveFormat: 3 as const, snapshot: imported.snapshot, evidence: imported.packedEvidence,
      baselineId: imported.baselineId, lineage: imported.lineage };
    const nativeSeed = { ...seed, confirmed: nativeCopy, snapshotPolicy: { lineage: imported.lineage } };
    const bound = await codec.run({ kind: "journalBind", input: { address: nativeAddress, owner: "native.snapshot.owner", expected: null, seed: nativeSeed } });
    expect(bound.snapshotFormat).toBe(3);
    await codec.run({ kind: "journalRebase", input: { address: nativeAddress, owner: "native.snapshot.owner", through: 0, seed: nativeSeed } });
    expect(await codec.run({ kind: "journalWarm", input: { address: nativeAddress, owner: "native.snapshot.owner" } })).toEqual({ through: 0 });
    expect((await codec.run({ kind: "journalPrepare", input: { address: nativeAddress } }))?.candidate).toMatchObject({ saveFormat: 3, snapshot: nativeCopy.snapshot, evidence: { records: [] } });
    const scope = { backendId: "native", accountId: "synthetic", campaignId: nativeCopy.campaignId };
    await codec.run({ kind: "candidate", input: { candidate: upgraded, confirmed: fixture.confirmed, scope } });
    const wire = await codec.run({ kind: "importWire", input: { issuedAtMs: 1_800_000_000_000, request: {
      operationId: "native.import", campaignId: nativeCopy.campaignId, campaign: seed.campaign, snapshot: imported.snapshot,
      evidence: imported.packedEvidence, baselineId: imported.baselineId, writerToken: "a".repeat(64), saveFormat: 3, lineage: imported.lineage } } });
    expect(JSON.parse(wire.text)).not.toHaveProperty("evidence");
    const packed = await codec.run({ kind: "packCache", input: { entry: { schemaVersion: 1, scope, confirmed: nativeCopy, recovery: null }, expected: null } });
    expect((await codec.run({ kind: "unpackCache", input: { raw: packed, scope } })).entry.confirmed).toEqual(nativeCopy);
    expect(codec.health).toMatchObject({ ready: true, restarts: 0, inFlight: [], lastError: null });
  } finally { codec.dispose(); await native.close(); }
}, 60_000);
