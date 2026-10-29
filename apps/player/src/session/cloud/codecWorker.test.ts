import { afterEach, describe, expect, it, vi } from "vitest";
import { CloudCodecWorker, CLOUD_WORKER_TASK_TIMEOUT_MS } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { syncFixture } from "./syncTestSupport";
import { runCloudCodecTask } from "./codecTasks";
import { sha256Utf8 } from "./codecJson";
import { CloudCacheError } from "./cache";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("cloud codec module worker boundary", () => {
  it.each(["callback", "proxy"] as const)("rejects a non-cloneable %s even in the inline test executor", async kind => {
    const codec = new CloudCodecWorker(null);
    const task = { kind: "hash" as const, input: "checkpoint", accidentalRuntime: kind === "callback" ?
      { onOpeningDiagnostic() {} } : new Proxy({ accountId: "account-a" }, {}) };
    await expect(codec.run(task)).rejects.toMatchObject({ name: "CloudCodecError", code: "worker_data_clone" });
    expect(await codec.run({ kind: "hash", input: "retry" })).toBe(await sha256Utf8("retry"));
  });
  it("rejects only the non-cloneable task, leaving another worker request usable", async () => {
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
    try {
      const first = codec.run({ kind: "hash", input: "accepted checkpoint" }).then(value => ({ value }), error => ({ error }));
      const invalid = { kind: "hash" as const, input: "invalid", callback() {} };
      await expect(codec.run(invalid)).rejects.toMatchObject({ code: "worker_data_clone" });
      expect(worker.terminated).toBe(false); expect(worker.messages).toHaveLength(1);
      worker.release(); expect(await first).toEqual({ value: await sha256Utf8("accepted checkpoint") });
    } finally { codec.dispose(); }
  });
  it("classifies a native postMessage DataCloneError without terminating unrelated work", async () => {
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
    try {
      const first = codec.run({ kind: "hash", input: "accepted checkpoint" }).then(value => ({ value }), error => ({ error }));
      vi.spyOn(worker, "postMessage").mockImplementationOnce(() => { throw new DOMException("private bytes", "DataCloneError"); });
      await expect(codec.run({ kind: "hash", input: "native rejection" })).rejects.toMatchObject({ code: "worker_data_clone" });
      expect(worker.terminated).toBe(false);
      worker.release(); expect(await first).toEqual({ value: await sha256Utf8("accepted checkpoint") });
      expect(await codec.run({ kind: "hash", input: "retry" })).toBe(await sha256Utf8("retry"));
    } finally { codec.dispose(); }
  });
  it("ignores queued readiness/error events from a terminated worker during automatic retry", async () => {
    vi.useFakeTimers();
    const old = new FakeCloudCodecWorker(), next = new FakeCloudCodecWorker();
    const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(old).mockReturnValueOnce(next));
    try {
      const request = codec.run({ kind: "hash", input: "first" });
      const lateReply = old.onmessage!, lateError = old.onerror!;
      old.reply({ ready: true }); await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS);
      lateReply({ data: { ready: true } } as MessageEvent); lateError({ preventDefault() {} } as ErrorEvent);
      expect(old.terminated).toBe(true); expect(next.terminated).toBe(false);
      expect(next.messages).toEqual(old.messages);
      next.reply({ ready: true }); next.reply({ id: next.messages[0]!.id, result: "checked digest" });
      expect(await request).toBe("checked digest"); expect(vi.getTimerCount()).toBe(0);
    } finally { codec.dispose(); vi.useRealTimers(); }
  });
  it("does not spend the processing deadline loading a cold development module worker", async () => {
    vi.useFakeTimers();
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker, 60_000);
    try {
      let result = "pending";
      const completion = codec.run({ kind: "hash", input: "cold startup" }).then(value => { result = value; }, () => { result = "failed"; });
      await vi.advanceTimersByTimeAsync(30_000);
      expect(result).toBe("pending"); expect(worker.terminated).toBe(false);
      worker.reply({ ready: true });
      await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS - 1); expect(result).toBe("pending");
      worker.reply({ id: worker.messages[0]!.id, result: "checked digest" }); await completion;
      expect(result).toBe("checked digest"); expect(vi.getTimerCount()).toBe(0);
    } finally { codec.dispose(); vi.useRealTimers(); }
  });
  it("bounds two failed worker attempts and leaves no timer or silently pending promise", async () => {
    vi.useFakeTimers();
    const workers = [new FakeCloudCodecWorker(), new FakeCloudCodecWorker()];
    const create = vi.fn().mockReturnValueOnce(workers[0]).mockReturnValueOnce(workers[1]), codec = new CloudCodecWorker(create, 100);
    try {
      const rejected = expect(codec.run({ kind: "hash", input: "held task" })).rejects.toMatchObject({ code: "worker_unavailable" });
      await vi.advanceTimersByTimeAsync(200); await rejected;
      expect(create).toHaveBeenCalledTimes(2); expect(workers.every(worker => worker.terminated)).toBe(true);
      expect(codec.health).toMatchObject({ alive: false, restarts: 1, inFlight: [], lastError: "CloudCodecError:worker_unavailable" });
      expect(vi.getTimerCount()).toBe(0);
    } finally { codec.dispose(); vi.useRealTimers(); }
  });
  it("replaces a hung ready worker and completes its exact original task without a caller retry", async () => {
    vi.useFakeTimers();
    const suspended = new FakeCloudCodecWorker(), next = new FakeCloudCodecWorker();
    const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(suspended).mockReturnValueOnce(next));
    try {
      const request = codec.run({ kind: "hash", input: "suspended" }); suspended.reply({ ready: true });
      await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS);
      expect(suspended.terminated).toBe(true); expect(next.messages).toEqual(suspended.messages);
      next.reply({ ready: true }); next.reply({ id: next.messages[0]!.id, result: "same digest" });
      expect(await request).toBe("same digest"); expect(vi.getTimerCount()).toBe(0);
    } finally { codec.dispose(); vi.useRealTimers(); }
  });
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
  it.each(["error", "messageerror"] as const)("retries every outstanding pure task after worker %s", async failure => {
    const worker = new FakeCloudCodecWorker(), next = new FakeCloudCodecWorker();
    const create = vi.fn().mockReturnValueOnce(worker).mockReturnValueOnce(next), codec = new CloudCodecWorker(create);
    try {
      const first = codec.run({ kind: "hash", input: "first" }), second = codec.run({ kind: "hash", input: "second" });
      if (failure === "error") worker.onerror?.({ preventDefault() {} } as ErrorEvent);
      else worker.onmessageerror?.({} as MessageEvent);
      expect(worker.terminated).toBe(true); expect(next.messages).toEqual(worker.messages);
      next.release();
      expect(await first).toBe(await sha256Utf8("first")); expect(await second).toBe(await sha256Utf8("second"));
      expect(create).toHaveBeenCalledTimes(2);
    } finally { codec.dispose(); }
  });
  it("classifies repeated native worker factory/postMessage throws as processing failures rather than corrupt campaign data", async () => {
    const codec = new CloudCodecWorker(() => { throw new TypeError("Worker could not be created with private URL"); });
    await expect(codec.run({ kind: "hash", input: "protected checkpoint" })).rejects.toMatchObject({ code: "worker_unavailable" });
    expect(codec.health).toMatchObject({ alive: false, restarts: 1, inFlight: [] }); codec.dispose();
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
