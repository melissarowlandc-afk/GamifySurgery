import { afterEach, expect, it, vi } from "vitest";
import { createCloudCodecDispatcher, type CloudCodecMessage, type CloudCodecReply } from "./codecTasks";
import { CloudCodecWorker } from "./codecWorker";
import { LossyWorkerPort, flushWorkerMessages } from "./workerDeliveryLossTestSupport";
import { WORKER_RECEIPT_TIMEOUT_MS } from "./workerDelivery";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { deferred } from "./syncTestSupport";

const clients: CloudCodecWorker[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.dispose(); vi.useRealTimers(); vi.restoreAllMocks(); });
function fixture(hold?: Promise<void>) {
  const calls: CloudCodecMessage[] = [];
  const port = new LossyWorkerPort<CloudCodecMessage, CloudCodecReply>(post => createCloudCodecDispatcher(post, async (message, reply) => {
    calls.push(message);
    if (message.id === 1) await hold;
    // Task bodies are controlled here; existing native tests exercise the real
    // codec. Sentinels isolate delivery/ordering from CPU time.
    reply({ id: message.id, result: message.task.kind === "hash" ? "public-hash" : null });
  }));
  const create = vi.fn(() => port), codec = new CloudCodecWorker(create); clients.push(codec);
  return { codec, port, calls, create };
}
const cacheRead = { kind: "unpackCache", input: { raw: {}, scope: { backendId: "public", accountId: "public", campaignId: "public" } } } as Parameters<CloudCodecWorker["run"]>[0];

it("completes the two-task opening scenario without ever posting before the 0.6 s ready handshake", async () => {
  vi.useFakeTimers(); const f = fixture();
  const hash = f.codec.run({ kind: "hash", input: "" });
  await vi.advanceTimersByTimeAsync(225); const cache = f.codec.run(cacheRead);
  await vi.advanceTimersByTimeAsync(375);
  expect(f.port.messages).toEqual([]); expect(f.codec.health).toMatchObject({ ready: false, buffered: 2, unacked: 0 });
  f.port.announceReady(); await expect(Promise.all([hash, cache])).resolves.toEqual(["public-hash", null]);
  expect(f.calls.map(message => message.task.kind)).toEqual(["hash", "unpackCache"]);
  expect(f.port.earlyPosts).toBe(0); expect(f.create).toHaveBeenCalledTimes(1);
  expect(f.codec.health).toMatchObject({ ready: true, reposts: 0, unacked: 0, restarts: 0 });
  await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it.each([1, 2])("recovers the first %s lost post(s) after ready, in order and without a restart", async lost => {
  vi.useFakeTimers(); const f = fixture(), events = vi.spyOn(problemDiagnostics, "event"); f.port.dropPosts = lost;
  const a = f.codec.run({ kind: "hash", input: "" }), b = f.codec.run(cacheRead); f.port.announceReady();
  await vi.advanceTimersByTimeAsync(lost === 1 ? 1_500 : 3_500);
  await expect(Promise.all([a, b])).resolves.toEqual(["public-hash", null]);
  expect(f.port.messages.map(message => message.id)).toEqual([...Array(lost + 1).fill(1), 2]);
  expect(f.calls.map(message => message.id)).toEqual([1, 2]);
  expect(f.codec.health).toMatchObject({ reposts: lost, repostEpisodes: 1, unacked: 0, receiptTimeouts: 0, restarts: 0 });
  expect(events.mock.calls.filter(([source, code]) => source === "worker-delivery" && code === "codec-repost")).toHaveLength(1);
  expect(f.create).toHaveBeenCalledTimes(1); await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it("re-posts the captured payload even if its caller edits the original after posting", async () => {
  vi.useFakeTimers(); const f = fixture();
  // A prior completed task leaves an already-ready worker, covering the hot
  // path as well as the pre-ready capture in the opening scenario.
  const warm = f.codec.run({ kind: "hash", input: "warm" }); f.port.announceReady(); await warm; await flushWorkerMessages();
  f.port.dropPosts = 1;
  const task = { kind: "hash" as const, input: "original" }, result = f.codec.run(task); task.input = "edited";
  await vi.advanceTimersByTimeAsync(1_500); expect(await result).toBe("public-hash");
  expect(f.port.messages.slice(-2).map(message => message.task)).toEqual([{ kind: "hash", input: "original" }, { kind: "hash", input: "original" }]);
  await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it("deduplicates incoming posts, including a retry after the original receipt/start replies were lost", async () => {
  vi.useFakeTimers(); const gate = deferred(), f = fixture(gate.promise); f.port.duplicates = 2;
  f.port.dropReceipts.set(1, 3); f.port.dropStarts.set(1, 1);
  const a = f.codec.run({ kind: "hash", input: "one" }), b = f.codec.run(cacheRead);
  f.port.announceReady(); await flushWorkerMessages();
  expect(f.calls.map(message => message.id)).toEqual([1]);
  await vi.advanceTimersByTimeAsync(1_500);
  expect(f.codec.health).toMatchObject({ reposts: 1, unacked: 0, restarts: 0 });
  gate.resolve(); await expect(Promise.all([a, b])).resolves.toEqual(["public-hash", null]);
  expect(f.calls.map(message => message.id)).toEqual([1, 2]);
  await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it("pauses missing-receipt recovery while another acknowledged task legitimately occupies the worker", async () => {
  vi.useFakeTimers(); const gate = deferred(), f = fixture(gate.promise); f.port.dropStarts.set(1, 1);
  const a = f.codec.run({ kind: "hash", input: "one" }); f.port.announceReady();
  f.port.dropPosts = 1; const b = f.codec.run(cacheRead); await flushWorkerMessages();
  await vi.advanceTimersByTimeAsync(3_500);
  expect(f.codec.health).toMatchObject({ reposts: 0, deliveryPaused: true });
  await vi.advanceTimersByTimeAsync(6_500);
  expect(f.codec.health).toMatchObject({ unacked: 1, reposts: 0, restarts: 0, deliveryPaused: true });
  gate.resolve(); await a; await flushWorkerMessages();
  await vi.advanceTimersByTimeAsync(1_500); expect(await b).toBeNull();
  expect(f.calls.map(message => message.id)).toEqual([1, 2]);
  expect(f.codec.health).toMatchObject({ reposts: 1, restarts: 0, unacked: 0 });
  await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it("does not confuse an acknowledged task waiting to dequeue with missing delivery", async () => {
  vi.useFakeTimers(); const port = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => port); clients.push(codec);
  const task = codec.run({ kind: "hash", input: "public queued" }); port.reply({ ready: true });
  await vi.advanceTimersByTimeAsync(WORKER_RECEIPT_TIMEOUT_MS + 1);
  expect(port.terminated).toBe(false); expect(codec.health).toMatchObject({ unacked: 0, restarts: 0 });
  port.reply({ id: 1, started: true }); port.reply({ id: 1, result: "done" });
  expect(await task).toBe("done"); await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it("falls back after 6.5 s of total delivery loss and waits for replacement ready before the same-payload retry", async () => {
  vi.useFakeTimers(); const first = fixture(), next = fixture(); first.port.dropPosts = Infinity;
  const create = vi.fn().mockReturnValueOnce(first.port).mockReturnValueOnce(next.port), codec = new CloudCodecWorker(create); clients.push(codec);
  const task = codec.run({ kind: "hash", input: "immutable" }); first.port.announceReady();
  await vi.advanceTimersByTimeAsync(WORKER_RECEIPT_TIMEOUT_MS - 1); expect(first.port.terminated).toBe(false);
  await vi.advanceTimersByTimeAsync(1); expect(first.port.terminated).toBe(true); expect(next.port.messages).toEqual([]);
  next.port.announceReady(); expect(await task).toBe("public-hash");
  expect(next.port.messages).toEqual([first.port.messages[0]]);
  expect(codec.health).toMatchObject({ restarts: 1, reposts: 2, receiptTimeouts: 1, unacked: 0 });
  expect(create).toHaveBeenCalledTimes(2); await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});

it("settles once after two failed delivery attempts and disposes every receipt timer", async () => {
  vi.useFakeTimers(); const a = fixture(), b = fixture(); a.port.dropPosts = b.port.dropPosts = Infinity;
  const create = vi.fn().mockReturnValueOnce(a.port).mockReturnValueOnce(b.port), codec = new CloudCodecWorker(create); clients.push(codec);
  const rejected = expect(codec.run({ kind: "hash", input: "public" })).rejects.toMatchObject({ code: "worker_unavailable" });
  a.port.announceReady(); await vi.advanceTimersByTimeAsync(WORKER_RECEIPT_TIMEOUT_MS);
  b.port.announceReady(); await vi.advanceTimersByTimeAsync(WORKER_RECEIPT_TIMEOUT_MS); await rejected;
  expect(create).toHaveBeenCalledTimes(2); expect(codec.health).toMatchObject({ alive: false, unacked: 0, restarts: 1 });
  await flushWorkerMessages(); expect(vi.getTimerCount()).toBe(0);
});
