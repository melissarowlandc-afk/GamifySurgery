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
    expect(codec.health).toMatchObject({ ready: true, restarts: 0, inFlight: [], lastError: null });
  } finally { codec.dispose(); await native.close(); }
}, 60_000);
