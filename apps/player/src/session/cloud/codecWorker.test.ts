import { afterEach, describe, expect, it, vi } from "vitest";
import { CloudCodecWorker } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { syncFixture } from "./syncTestSupport";
import { runCloudCodecTask } from "./codecTasks";
import { sha256Utf8 } from "./codecJson";
import { CloudCacheError } from "./cache";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("cloud codec module worker boundary", () => {
  it("uses the Vite module-worker URL and keeps serialization out of the caller", async () => {
    const worker = new FakeCloudCodecWorker(), create = vi.fn(function (_url: URL, _options: WorkerOptions) { return worker; });
    vi.stubGlobal("Worker", create);
    const codec = new CloudCodecWorker();
    const stringify = vi.spyOn(JSON, "stringify");
    let settled = false;
    const request = codec.run({ kind: "hash", input: "save bytes" }).then(value => { settled = true; return value; });
    expect(create).toHaveBeenCalledExactlyOnceWith(expect.any(URL), { type: "module" });
    expect(String(create.mock.calls[0]?.[0])).toContain("codec.worker.ts");
    expect(stringify).not.toHaveBeenCalled(); stringify.mockRestore();
    await Promise.resolve(); expect(settled).toBe(false);
    worker.release(); expect(await request).toBe(await sha256Utf8("save bytes"));
    codec.dispose(); expect(worker.terminated).toBe(true);
  });
  it("offloads checkpoint serialization/compression/hashing and returns only the compressed delta", async () => {
    const fixture = await syncFixture(), worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
    const checkpoint = fixture.command(fixture.prepared.checkpoint, { type: "SET_PAUSED", paused: false, operationId: "worker.play" });
    const input = { checkpoint, campaign: fixture.prepared.envelope.campaign,
      source: { sha256: fixture.prepared.sourceRecovery.sha256, utf8Bytes: fixture.prepared.sourceRecovery.utf8Bytes, schemaVersion: 9 },
      operationId: "local-candidate", expectedRevision: "1", acknowledgedEvidence: {
        headerSha256: fixture.confirmed.evidence.header.uncompressedSha256, records: fixture.confirmed.evidence.records.length } };
    const stringify = vi.spyOn(JSON, "stringify");
    const result = codec.run({ kind: "encode", input });
    expect(stringify).not.toHaveBeenCalled(); stringify.mockRestore();
    expect(worker.messages[0]?.task).toEqual({ kind: "encode", input });
    expect(worker.messages[0]?.task.input).not.toBe(input);
    worker.release(); const encoded = await result;
    expect(encoded).toEqual(await runCloudCodecTask({ kind: "encode", input }));
    expect(Object.keys(encoded).sort()).toEqual(["decodedGameBytes", "evidence", "snapshot"]);
    expect(encoded.evidence.records).toHaveLength(checkpoint.evidence.records.length - fixture.confirmed.evidence.records.length);
    codec.dispose();
  });
  it("matches replies by id and preserves typed local-storage failures", async () => {
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
    const first = codec.run({ kind: "hash", input: "first" }), second = codec.run({ kind: "hash", input: "second" });
    worker.reply({ id: 2, result: "second digest" }); expect(await second).toBe("second digest");
    const rejected = expect(first).rejects.toMatchObject({ reason: "checksum", code: "storage" });
    worker.reply({ id: 1, error: { kind: "cache", code: "checksum", message: "bad bytes" } }); await rejected;
    codec.dispose();
  });
  it("rejects every outstanding task on a worker crash and can retry with a fresh worker", async () => {
    const worker = new FakeCloudCodecWorker(), next = new FakeCloudCodecWorker();
    const create = vi.fn().mockReturnValueOnce(worker).mockReturnValueOnce(next), codec = new CloudCodecWorker(create);
    const first = codec.run({ kind: "hash", input: "first" }), second = codec.run({ kind: "hash", input: "second" });
    const rejected = Promise.all([expect(first).rejects.toMatchObject({ code: "worker_unavailable" }), expect(second).rejects.toMatchObject({ code: "worker_unavailable" })]);
    worker.onerror?.({ preventDefault() {} } as ErrorEvent); await rejected;
    expect(worker.terminated).toBe(true);
    const retry = codec.run({ kind: "hash", input: "retry" }); next.release();
    expect(await retry).toBe(await sha256Utf8("retry")); expect(create).toHaveBeenCalledTimes(2); codec.dispose();
  });
  it("provides the same checked codec when a non-browser test has no Worker", async () => {
    const codec = new CloudCodecWorker(null);
    expect(await codec.run({ kind: "hash", input: "test fallback" })).toBe(await sha256Utf8("test fallback"));
    await expect(codec.run({ kind: "unpackCache", input: { raw: { key: "bad", cacheRevision: 0, text: "", sha256: "", utf8Bytes: 0 },
      scope: { backendId: "test", accountId: "a", campaignId: "c" } } })).rejects.toBeInstanceOf(CloudCacheError);
  });
  it("reports a browser without workers instead of falling back to main-thread save processing", async () => {
    vi.stubGlobal("window", {}); vi.stubGlobal("Worker", undefined);
    const codec = new CloudCodecWorker();
    await expect(codec.run({ kind: "hash", input: "browser bytes" })).rejects.toMatchObject({ code: "worker_unavailable" });
  });
});
