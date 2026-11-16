import { afterEach, expect, it, vi } from "vitest";
import { CloudCodecWorker, CLOUD_WORKER_TASK_TIMEOUT_MS } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { createCloudCodecDispatcher, type CloudCodecReply } from "./codecTasks";
import { createWorkerReceiptReceiver } from "./workerDelivery";

afterEach(() => { vi.useRealTimers(); });
it("acknowledges before dispatch and deduplicates received ids without dropping unseen gaps or out-of-order ids", () => {
  const receipts: number[] = [], ran: number[] = [];
  const receive = createWorkerReceiptReceiver(reply => receipts.push(reply.id), (message: { id: number }) => {
    expect(receipts.at(-1)).toBe(message.id); ran.push(message.id);
  });
  const ids = [5, 2, 3, 4, 1, 10, 8, 9, 7, 6];
  for (const id of [...ids, ...[...ids].reverse()]) receive({ id });
  expect(ran).toEqual(ids); expect(receipts).toHaveLength(20);
});
it("starts deadlines on execution, never on posting behind another legitimate long task", async () => {
  vi.useFakeTimers();
  const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
  const values: string[] = [];
  const first = codec.run({ kind: "hash", input: "one" }).then(value => { values.push(value); });
  const second = codec.run({ kind: "hash", input: "two" }).then(value => { values.push(value); });
  void first.catch(() => {}); void second.catch(() => {});
  try {
    worker.reply({ ready: true });
    worker.reply({ id: 1, started: true });
    expect(values).toEqual([]);
    await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS - 1_000);
    expect(values).toEqual([]);
    worker.reply({ id: 1, result: "one" }); await first;
    worker.reply({ id: 2, started: true });
    await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS - 1_000);
    expect(worker.terminated).toBe(false); expect(values).toEqual(["one"]);
    worker.reply({ id: 2, result: "two" }); await second;
    expect(values).toEqual(["one", "two"]); expect(codec.health.restarts).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  } finally { codec.dispose(); await Promise.allSettled([first, second]); }
});
it("bounds a started hung task even if heartbeats continue, and retries its exact payload once", async () => {
  vi.useFakeTimers();
  const first = new FakeCloudCodecWorker(), replacement = new FakeCloudCodecWorker();
  const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(replacement));
  const completion = codec.run({ kind: "hash", input: "immutable" });
  try {
    first.reply({ ready: true }); first.reply({ id: 1, started: true });
    await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS - 1);
    first.reply({ id: 1, heartbeat: true });
    await vi.advanceTimersByTimeAsync(1);
    expect(first.terminated).toBe(true); expect(replacement.messages).toEqual([]);
    replacement.reply({ ready: true }); expect(replacement.messages).toEqual(first.messages);
    replacement.reply({ id: 1, started: true }); replacement.reply({ id: 1, result: "same" });
    expect(await completion).toBe("same"); expect(codec.health.restarts).toBe(1); expect(vi.getTimerCount()).toBe(0);
  } finally { codec.dispose(); }
});
it("keeps the existing 60 s head budget when a start reply is lost but heartbeats continue", async () => {
  vi.useFakeTimers();
  const first = new FakeCloudCodecWorker(), replacement = new FakeCloudCodecWorker();
  const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(replacement));
  let completion: Promise<string> | undefined;
  try {
    const warm = codec.run({ kind: "hash", input: "warm" }); first.reply({ ready: true }); first.reply({ id: 1, result: "warm" }); await warm;
    completion = codec.run({ kind: "hash", input: "immutable" });
    await vi.advanceTimersByTimeAsync(5_000); first.reply({ id: 2, heartbeat: true });
    await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS - 5_001);
    first.reply({ id: 2, heartbeat: true }); expect(first.terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1); expect(first.terminated).toBe(true); expect(replacement.messages).toEqual([]);
    replacement.reply({ ready: true }); replacement.reply({ id: 2, started: true }); replacement.reply({ id: 2, result: "same" });
    expect(await completion).toBe("same"); expect(codec.health.restarts).toBe(1); expect(vi.getTimerCount()).toBe(0);
  } finally { codec.dispose(); }
});
it("excludes an earlier task's time when the queued task's start reply is also lost", async () => {
  vi.useFakeTimers();
  const first = new FakeCloudCodecWorker(), replacement = new FakeCloudCodecWorker();
  const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(replacement));
  const a = codec.run({ kind: "hash", input: "one" }), b = codec.run({ kind: "hash", input: "two" });
  try {
    first.reply({ ready: true }); await vi.advanceTimersByTimeAsync(59_000);
    first.reply({ id: 1, result: "one" }); expect(await a).toBe("one");
    await vi.advanceTimersByTimeAsync(5_000); first.reply({ id: 2, heartbeat: true });
    await vi.advanceTimersByTimeAsync(CLOUD_WORKER_TASK_TIMEOUT_MS - 5_001);
    expect(first.terminated).toBe(false); first.reply({ id: 2, heartbeat: true });
    await vi.advanceTimersByTimeAsync(1); expect(first.terminated).toBe(true); expect(replacement.messages).toEqual([]);
    replacement.reply({ ready: true }); replacement.reply({ id: 2, started: true }); replacement.reply({ id: 2, result: "two" });
    expect(await b).toBe("two"); expect(codec.health).toMatchObject({ restarts: 1, reposts: 0 });
    expect(vi.getTimerCount()).toBe(0);
  } finally { codec.dispose(); await Promise.allSettled([a, b]); }
});
it("the real dispatcher starts only the dequeued task, including across structured-clone replies", async () => {
  const replies: CloudCodecReply[] = [], release: (() => void)[] = [];
  const dispatch = createCloudCodecDispatcher(reply => replies.push(structuredClone(reply)), async (message, post) => {
    await new Promise<void>(resolve => release.push(resolve)); post({ id: message.id, result: message.task.kind });
  });
  const first = dispatch(structuredClone({ id: 1, task: { kind: "hash", input: "one" } }));
  const second = dispatch(structuredClone({ id: 2, task: { kind: "hash", input: "two" } }));
  expect(replies).toEqual([{ id: 1, received: true }, { id: 2, received: true }]);
  await Promise.resolve(); expect(replies).toEqual([{ id: 1, received: true }, { id: 2, received: true }, { id: 1, started: true }]);
  release[0]!(); await first; await Promise.resolve();
  expect(replies).toEqual([{ id: 1, received: true }, { id: 2, received: true }, { id: 1, started: true }, { id: 1, result: "hash" }, { id: 2, started: true }]);
  release[1]!(); await second;
  expect(replies.at(-1)).toEqual({ id: 2, result: "hash" });
});
