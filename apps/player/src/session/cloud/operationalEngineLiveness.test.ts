import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState } from "@gamify-surgery/game-domain";
import { OperationalEngineClient, type OperationalEnginePort } from "./operationalEngineClient";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineRequest, OperationalEngineWorkerReply } from "./operationalEngineProtocol";
import { createWorkerReceiptReceiver } from "./workerDelivery";

class Port implements OperationalEnginePort {
  onmessage: OperationalEnginePort["onmessage"] = null;
  onerror: OperationalEnginePort["onerror"] = null;
  onmessageerror: OperationalEnginePort["onmessageerror"] = null;
  held = new Set<string>(); stopped = false;
  readonly messages: OperationalEngineRequest[] = [];
  readonly processor = new OperationalEngineProcessor();
  private receive = createWorkerReceiptReceiver(reply => this.send(reply), (request: OperationalEngineRequest) => {
    if (!this.held.has(request.kind)) queueMicrotask(() => this.finish(request));
  });
  constructor() { queueMicrotask(() => this.send({ ready: true })); }
  postMessage(request: OperationalEngineRequest) { this.messages.push(request); this.receive(request); }
  send(reply: OperationalEngineWorkerReply) { this.onmessage?.({ data: reply } as MessageEvent<OperationalEngineWorkerReply>); }
  finish(request: OperationalEngineRequest) { this.send(this.processor.handle(request)); }
  terminate() { this.stopped = true; }
}
const clients: OperationalEngineClient[] = [];
afterEach(() => { clients.splice(0).forEach(client => client.dispose()); vi.useRealTimers(); });
async function fixture() {
  const state = createInitialGameState(undefined, { campaignId: "liveness.public", campaignSeed: "liveness", createdAtRealMs: 0 });
  const checkpoint = createGameEvidenceCheckpoint(state), port = new Port();
  const client = await OperationalEngineClient.create({ checkpoint, visibleState: state, atRealMs: 0 }, () => port, 1_000);
  clients.push(client); return { state, checkpoint, port, client };
}
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

it("renews a play inactivity budget on real phase progress without publishing a partial command", async () => {
  vi.useFakeTimers(); const f = await fixture(); f.port.held.add("command");
  const command = { type: "SET_SIMULATION_SPEED" as const, speed: 4 as const, operationId: "progress.command" };
  const result = f.client.execute(command); await flush();
  const before = f.client.state;
  const request = f.port.messages.at(-1)!;
  for (const progress of ["simulation", "diff", "projection", "publish"] as const) {
    await vi.advanceTimersByTimeAsync(900); f.port.send({ id: request.id, progress });
    expect(f.client.state).toBe(before); expect(f.port.stopped).toBe(false);
    expect(f.client.state.simulationSpeed).toBe(f.state.simulationSpeed);
  }
  f.port.finish(request);
  expect(JSON.stringify((await result).state)).toBe(JSON.stringify(applyGameEvidenceCommand(f.checkpoint, command).state));
  expect(f.client.health.pending).toBe(0); expect(vi.getTimerCount()).toBe(0);
});

it("duplicate receipts cannot extend a hung command's execution deadline", async () => {
  vi.useFakeTimers(); const f = await fixture(); f.port.held.add("command");
  const result = expect(f.client.execute({ type: "SET_PAUSED", paused: false, operationId: "hung.command" })).rejects.toMatchObject({ code: "engine-timeout" });
  await flush(); const id = f.port.messages.at(-1)!.id;
  await vi.advanceTimersByTimeAsync(900); f.port.send({ id, received: true });
  await vi.advanceTimersByTimeAsync(100); await result;
  expect(f.port.stopped).toBe(true); expect(f.client.health.timeoutRequest).toBe("command:SET_PAUSED");
});

it("a stuck journal hash fails only that derived task and never restarts a healthy state engine", async () => {
  vi.useFakeTimers(); const f = await fixture(); f.port.held.add("journalHashes");
  const hash = expect(f.client.hashJournalRows([])).rejects.toMatchObject({ code: "engine-journal-hash-timeout" });
  await flush(); const id = f.port.messages.at(-1)!.id;
  const first = await f.client.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "during.hash" });
  await vi.advanceTimersByTimeAsync(1_000); await hash;
  expect(f.port.stopped).toBe(false); expect(f.client.state).toBe(first.state);
  expect(f.client.canHashJournalRows).toBe(false);
  await expect(f.client.hashJournalRows([])).rejects.toMatchObject({ code: "engine-journal-hash-timeout" });
  f.port.send({ id, kind: "journalHashes", hashes: [] });
  expect(f.client.canHashJournalRows).toBe(true);
  const second = await f.client.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "after.hash" });
  expect(second.state.simulationSpeed).toBe(4); expect(f.client.canAccept).toBe(true);
  const restored = f.client.hashJournalRows([]); await flush();
  f.port.send({ id: f.port.messages.at(-1)!.id, kind: "journalHashes", hashes: [] });
  expect(await restored).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

it("independent expired hashes and explicit hash failures cannot discard the authoritative state", async () => {
  vi.useFakeTimers(); const f = await fixture(); f.port.held.add("journalHashes");
  const one = expect(f.client.hashJournalRows([])).rejects.toMatchObject({ code: "engine-journal-hash-timeout" });
  const two = expect(f.client.hashJournalRows([])).rejects.toMatchObject({ code: "engine-journal-hash-timeout" });
  await flush(); const ids = f.port.messages.filter(request => request.kind === "journalHashes").map(request => request.id);
  await vi.advanceTimersByTimeAsync(1_000); await Promise.all([one, two]);
  for (const id of ids) f.port.send({ id, kind: "journalHashes", hashes: [] });
  expect((await f.client.execute({ type: "SET_PAUSED", paused: false, operationId: "multiple.hashes" })).state.paused).toBe(false);
  expect(f.port.stopped).toBe(false); expect(vi.getTimerCount()).toBe(0);

  const next = await fixture(); next.port.held.add("journalHashes");
  const failed = expect(next.client.hashJournalRows([])).rejects.toMatchObject({ code: "engine-journal-hash" });
  await flush(); next.port.send({ id: next.port.messages.at(-1)!.id, kind: "failure", code: "engine-journal-hash" }); await failed;
  expect(next.port.stopped).toBe(false);
  expect((await next.client.execute({ type: "SET_PAUSED", paused: false, operationId: "failed.hash" })).state.paused).toBe(false);
});
