import { afterEach, expect, it, vi } from "vitest";
import { CloudCodecWorker, CLOUD_WORKER_TASK_TIMEOUT_MS } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { createCloudCodecDispatcher, type CloudCodecReply } from "./codecTasks";

afterEach(() => { vi.useRealTimers(); });
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
    expect(first.terminated).toBe(true); expect(replacement.messages).toEqual(first.messages);
    replacement.reply({ ready: true }); replacement.reply({ id: 1, started: true }); replacement.reply({ id: 1, result: "same" });
    expect(await completion).toBe("same"); expect(codec.health.restarts).toBe(1); expect(vi.getTimerCount()).toBe(0);
  } finally { codec.dispose(); }
});
it("the real dispatcher starts only the dequeued task, including across structured-clone replies", async () => {
  const replies: CloudCodecReply[] = [], release: (() => void)[] = [];
  const dispatch = createCloudCodecDispatcher(reply => replies.push(structuredClone(reply)), async (message, post) => {
    await new Promise<void>(resolve => release.push(resolve)); post({ id: message.id, result: message.task.kind });
  });
  const first = dispatch(structuredClone({ id: 1, task: { kind: "hash", input: "one" } }));
  const second = dispatch(structuredClone({ id: 2, task: { kind: "hash", input: "two" } }));
  await Promise.resolve(); expect(replies).toEqual([{ id: 1, started: true }]);
  release[0]!(); await first; await Promise.resolve();
  expect(replies).toEqual([{ id: 1, started: true }, { id: 1, result: "hash" }, { id: 2, started: true }]);
  release[1]!(); await second;
  expect(replies.at(-1)).toEqual({ id: 2, result: "hash" });
});
