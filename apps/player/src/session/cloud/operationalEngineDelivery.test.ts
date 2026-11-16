import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { OperationalEngineClient } from "./operationalEngineClient";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineRequest, OperationalEngineWorkerReply } from "./operationalEngineProtocol";
import { createWorkerReceiptReceiver, WORKER_RECEIPT_TIMEOUT_MS } from "./workerDelivery";
import { LossyWorkerPort, flushWorkerMessages } from "./workerDeliveryLossTestSupport";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import { codecTestCampaign } from "./codecTestSupport";
import { journalRowText, type JournalRow } from "../localJournal";
import { sha256Utf8 } from "./codecJson";

const clients: OperationalEngineClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.dispose(); vi.useRealTimers(); vi.restoreAllMocks(); });
function fixture(timeoutMs = 60_000, startupMs = 10_000) {
  const state = createInitialGameState(undefined, { campaignId: "public.worker-delivery", campaignSeed: "public.worker-delivery", createdAtRealMs: 0 });
  state.paused = true;
  const checkpoint = createGameEvidenceCheckpoint(state), engine = new OperationalEngineProcessor();
  const calls: OperationalEngineRequest[] = [], waiting: OperationalEngineRequest[] = [], control = { held: false };
  const port = new LossyWorkerPort<OperationalEngineRequest, OperationalEngineWorkerReply>(post => createWorkerReceiptReceiver(post, request => {
    calls.push(request);
    if (control.held && request.kind !== "journalHashes") waiting.push(request);
    else queueMicrotask(() => dispatchOperationalEngineRequest(engine, request, post));
  }));
  const opening = OperationalEngineClient.create({ checkpoint, visibleState: state, atRealMs: 0,
    context: PROTOTYPE_DOMAIN_CONTEXT, adoptSharedSeed: true, useBundledContext: true }, () => port, timeoutMs, 128, startupMs);
  return { state, checkpoint, port, calls, control, opening, release() {
    control.held = false;
    for (const request of waiting.splice(0)) dispatchOperationalEngineRequest(engine, request, reply => port.reply(reply));
  } };
}
async function ready(f: ReturnType<typeof fixture>) {
  f.port.announceReady(); const client = await f.opening; clients.push(client); return client;
}
const exact = (left: unknown, right: unknown) => expect(JSON.stringify(left)).toBe(JSON.stringify(right));

it("never posts initialization to a port that drops every pre-ready message", async () => {
  vi.useFakeTimers(); const f = fixture();
  await vi.advanceTimersByTimeAsync(600); expect(f.port.messages).toEqual([]);
  const client = await ready(f);
  const a = client.execute({ type: "SET_PAUSED", paused: false, operationId: "delivery.unpause" });
  const b = client.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "delivery.speed" });
  await Promise.all([a, b]);
  expect(f.port.earlyPosts).toBe(0); expect(f.calls.map(request => request.kind)).toEqual(["initialize", "command", "command"]);
  expect(client.health).toMatchObject({ ready: true, reposts: 0, unacked: 0 }); expect(f.port.terminated).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});

it.each([1, 2])("recovers %s lost initialization posts inside the receipt window", async lost => {
  vi.useFakeTimers(); const f = fixture(); f.port.dropPosts = lost; f.port.announceReady();
  await vi.advanceTimersByTimeAsync(lost === 1 ? 1_500 : 3_500);
  const client = await f.opening; clients.push(client);
  expect(f.calls.map(request => request.kind)).toEqual(["initialize"]);
  expect(f.port.messages).toHaveLength(lost + 1); expect(f.port.messages.every(request => request.id === 1)).toBe(true);
  expect(client.health).toMatchObject({ reposts: lost, unacked: 0, receiptTimeouts: 0 });
  expect(f.port.terminated).toBe(false); expect(vi.getTimerCount()).toBe(0);
});

it.each([1, 2])("recovers %s lost player-command posts with exact state and operation ids", async lost => {
  vi.useFakeTimers(); const f = fixture(), client = await ready(f), events = vi.spyOn(problemDiagnostics, "event");
  f.port.dropPosts = lost;
  const first = { type: "SET_PAUSED" as const, paused: false, operationId: "delivery.first" };
  const second = { type: "SET_SIMULATION_SPEED" as const, speed: 4 as const, operationId: "delivery.second" };
  const a = client.execute(first), b = client.execute(second); await flushWorkerMessages();
  await vi.advanceTimersByTimeAsync(lost === 1 ? 1_500 : 3_500);
  const expectedA = applyGameEvidenceCommand(f.checkpoint, first), expectedB = applyGameEvidenceCommand(expectedA.checkpoint, second);
  exact((await a).state, expectedA.state); exact((await b).state, expectedB.state);
  expect(f.calls.map(request => request.id)).toEqual([1, 2, 3]);
  expect(f.port.messages.map(request => request.id)).toEqual([1, ...Array(lost + 1).fill(2), 3]);
  expect(client.health).toMatchObject({ reposts: lost, repostEpisodes: 1, unacked: 0 });
  expect(events.mock.calls.filter(([source, code]) => source === "worker-delivery" && code === "engine-repost")).toHaveLength(1);
  expect(f.port.terminated).toBe(false); expect(vi.getTimerCount()).toBe(0);
});

it("deduplicates initialization and commands, including receipt-loss retries and late duplicate receipts", async () => {
  vi.useFakeTimers(); const f = fixture(); f.port.duplicates = 2;
  const client = await ready(f); f.control.held = true; f.port.dropReceipts.set(2, 3);
  const command = { type: "SET_SIMULATION_SPEED" as const, speed: 4 as const, operationId: "delivery.once" };
  const completion = client.execute(command); await flushWorkerMessages();
  expect(f.calls.map(request => request.id)).toEqual([1, 2]);
  await vi.advanceTimersByTimeAsync(1_500); expect(client.health).toMatchObject({ reposts: 1, unacked: 0 });
  f.release(); exact((await completion).state, applyGameEvidenceCommand(f.checkpoint, command).state);
  f.port.reply({ id: 2, received: true });
  const old = f.port.messages.find(request => request.id === 2)!;
  f.port.postMessage(old); await flushWorkerMessages();
  expect(f.calls.map(request => request.id)).toEqual([1, 2]); expect(client.canAccept).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it("uses delivery recovery at 6.5 s instead of spending the 5 s execution cap on missing receipts", async () => {
  vi.useFakeTimers(); const f = fixture(5_000), client = await ready(f); f.port.dropPosts = Infinity;
  const result = expect(client.execute({ type: "SET_PAUSED", paused: false, operationId: "delivery.lost" })).rejects.toMatchObject({ code: "engine-receipt" });
  await flushWorkerMessages(); await vi.advanceTimersByTimeAsync(5_001); expect(f.port.terminated).toBe(false);
  await vi.advanceTimersByTimeAsync(WORKER_RECEIPT_TIMEOUT_MS - 5_001); await result;
  expect(f.calls.map(request => request.kind)).toEqual(["initialize"]);
  expect(client.health).toMatchObject({ alive: false, reposts: 2, receiptTimeouts: 1, unacked: 0 });
  expect(vi.getTimerCount()).toBe(0);
});

it("does not restart a busy engine for an unreceived independent journal-hash post", async () => {
  vi.useFakeTimers(); const f = fixture(), client = await ready(f); f.control.held = true;
  const command = client.execute({ type: "SET_PAUSED", paused: false, operationId: "delivery.busy" }); await flushWorkerMessages();
  f.port.dropPosts = 1; const hash = client.hashJournalRows([]);
  await vi.advanceTimersByTimeAsync(10_000);
  expect(client.health).toMatchObject({ unacked: 1, reposts: 0, deliveryPaused: true }); expect(f.port.terminated).toBe(false);
  f.release(); await command; await vi.advanceTimersByTimeAsync(1_500); expect(await hash).toEqual([]);
  expect(client.health).toMatchObject({ unacked: 0, reposts: 1, receiptTimeouts: 0 });
  expect(vi.getTimerCount()).toBe(0);
});

it("captures independent journal rows before a lost post can be retried", async () => {
  vi.useFakeTimers(); const f = fixture(), client = await ready(f);
  const campaign = { ...codecTestCampaign(JSON.stringify(f.state)) };
  const row: JournalRow = { version: 1, campaign, delta: null, usageQuestions: [], sha256: "0".repeat(64) };
  const expected = await sha256Utf8(journalRowText(row)); f.port.dropPosts = 1;
  const result = client.hashJournalRows([row]); campaign.name = "Edited after capture";
  await vi.advanceTimersByTimeAsync(1_500); expect(await result).toEqual([expected]);
  expect(f.port.messages.slice(-2)).toEqual([f.port.messages.at(-2), f.port.messages.at(-2)]);
  expect(client.health).toMatchObject({ reposts: 1, unacked: 0 }); expect(vi.getTimerCount()).toBe(0);
});

it("preserves the configured active execution cap once receipt is acknowledged", async () => {
  vi.useFakeTimers(); const f = fixture(5_000), client = await ready(f); f.control.held = true;
  const result = expect(client.execute({ type: "SET_PAUSED", paused: false, operationId: "delivery.active" })).rejects.toMatchObject({ code: "engine-timeout" });
  await flushWorkerMessages(); await vi.advanceTimersByTimeAsync(4_999); expect(f.port.terminated).toBe(false);
  await vi.advanceTimersByTimeAsync(1); await result;
  expect(client.health.reposts).toBe(0); expect(f.calls).toHaveLength(2); expect(vi.getTimerCount()).toBe(0);
});

it("keeps the existing initialization deadline when the module never becomes ready", async () => {
  vi.useFakeTimers(); const f = fixture(60_000, 100);
  const result = expect(f.opening).rejects.toMatchObject({ code: "engine-timeout" });
  await vi.advanceTimersByTimeAsync(99); expect(f.port.messages).toEqual([]); expect(f.port.terminated).toBe(false);
  await vi.advanceTimersByTimeAsync(1); await result;
  expect(f.port.terminated).toBe(true); expect(f.port.messages).toEqual([]); expect(vi.getTimerCount()).toBe(0);
});
