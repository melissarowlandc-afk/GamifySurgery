import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState,
  gameEvidenceDelta, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand } from "@gamify-surgery/game-domain";
import { OperationalEngineClient, type OperationalEnginePort } from "./operationalEngineClient";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";
import { createPrototypePlayerView } from "../viewModels";

class Port implements OperationalEnginePort {
  onmessage: OperationalEnginePort["onmessage"] = null;
  onerror: OperationalEnginePort["onerror"] = null;
  onmessageerror: OperationalEnginePort["onmessageerror"] = null;
  auto = true; stopped = false;
  readonly messages: OperationalEngineRequest[] = [];
  readonly waiting: OperationalEngineRequest[] = [];
  private readonly processor = new OperationalEngineProcessor();
  postMessage(request: OperationalEngineRequest): void {
    const captured = structuredClone(request); this.messages.push(captured);
    if (this.auto) queueMicrotask(() => this.deliver(this.processor.handle(captured)));
    else this.waiting.push(captured);
  }
  deliver(reply: OperationalEngineReply): void { this.onmessage?.({ data: structuredClone(reply) } as MessageEvent<OperationalEngineReply>); }
  next(mutate?: (reply: OperationalEngineReply) => void): void {
    const request = this.waiting.shift(); if (!request) throw Error("No queued worker request");
    const reply = this.processor.handle(request); mutate?.(reply); this.deliver(reply);
  }
  terminate(): void { this.stopped = true; }
}
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const setup = async (queueLimit = 128, projection = false, snapshotOnly = true) => {
  const state = createInitialGameState(undefined, { campaignId: "engine.synthetic", campaignSeed: "engine", createdAtRealMs: 0 });
  state.paused = true;
  const checkpoint = createGameEvidenceCheckpoint(state), port = new Port();
  const client = await OperationalEngineClient.create({ checkpoint, visibleState: state, atRealMs: 1_800_000_000_000, snapshotOnly,
    ...(projection ? { projection: { revision: 0, args: [null, false, null] as [null, boolean, null], asOfRealMs: 1_800_000_000_000 } } : {}) }, () => port, 60_000, queueLimit);
  return { state, checkpoint, port, client };
};
const clients: OperationalEngineClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.dispose(); vi.useRealTimers(); vi.restoreAllMocks(); });
const exact = (actual: unknown, expected: unknown) => expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));

it("serializes accepted commands, captures input at invocation and exports only after every earlier result", async () => {
  const { client, port, checkpoint } = await setup(); clients.push(client); port.auto = false;
  const first: GameCommand = { type: "SET_PAUSED", paused: false, operationId: "engine.unpause" };
  const second: GameCommand = { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "engine.speed" };
  const a = client.execute(first), b = client.execute(second), exported = client.checkpoint();
  second.speed = 2;
  await flush(); expect(port.waiting).toHaveLength(1); expect(client.state.paused).toBe(true);
  port.next(); const resultA = await a; await flush(); expect(port.waiting).toHaveLength(1);
  expect(port.waiting[0]).toMatchObject({ kind: "command", expectedVersion: 1, command: { speed: 4 } });
  port.next(); const resultB = await b; await flush(); expect(port.waiting[0]).toMatchObject({ kind: "checkpoint", expectedVersion: 2 });
  port.next(); const archive = await exported;
  const expectedA = applyGameEvidenceCommand(checkpoint, first), expectedB = applyGameEvidenceCommand(expectedA.checkpoint, { ...second, speed: 4 });
  exact(resultA.state, expectedA.state); exact(resultB.state, expectedB.state); exact(archive, expectedB.checkpoint);
  expect(Object.isFrozen(resultB.state)).toBe(true); expect(Object.isFrozen(resultB.state.rooms)).toBe(true);
  await client.idle(); expect(client.queuedCommands).toBe(0);
});

it("bounds accepted backlog without discarding or coalescing accepted commands", async () => {
  const { client, port } = await setup(2); clients.push(client); port.auto = false;
  const a = client.execute({ type: "SET_PAUSED", paused: false, operationId: "bounded.1" });
  const b = client.execute({ type: "SET_PAUSED", paused: true, operationId: "bounded.2" });
  expect(client.canAccept).toBe(false);
  await expect(client.execute({ type: "SET_PAUSED", paused: false, operationId: "bounded.rejected" })).rejects.toMatchObject({ code: "engine-backlog" });
  await flush(); port.next(); await a; await flush(); port.next(); await b; await client.idle();
  expect(client.canAccept).toBe(true); expect(client.state.paused).toBe(true);
  expect(port.messages.filter(message => message.kind === "command")).toHaveLength(2);
});

it("fails closed before publication on a broken evidence chain and rejects queued work and barriers", async () => {
  const { client, port } = await setup(); clients.push(client); port.auto = false;
  const previous = client.state;
  const a = client.execute({ type: "SET_PAUSED", paused: false, operationId: "chain.1" });
  const b = client.execute({ type: "SET_PAUSED", paused: true, operationId: "chain.2" });
  const settled = Promise.allSettled([a, b]); await flush();
  port.next(reply => { if (reply.kind === "applied" && reply.delta) (reply.delta as { fromRecord: number }).fromRecord++; });
  const results = await settled;
  expect(results.map(result => result.status)).toEqual(["rejected", "rejected"]);
  for (const result of results) if (result.status === "rejected") expect(result.reason).toMatchObject({ code: "engine-chain" });
  expect(client.state).toBe(previous); expect(client.canAccept).toBe(false); expect(port.stopped).toBe(true);
  await expect(client.idle()).rejects.toMatchObject({ code: "engine-chain" });
  port.deliver({ id: 999, kind: "failure", code: "late-message" }); expect(client.state).toBe(previous);
});

it("times out the posted command, rejects waiting commands and never automatically replays them", async () => {
  const { client, port } = await setup(); clients.push(client); port.auto = false; vi.useFakeTimers();
  const a = client.execute({ type: "SET_PAUSED", paused: false, operationId: "timeout.1" });
  const b = client.execute({ type: "SET_PAUSED", paused: true, operationId: "timeout.2" });
  const settled = Promise.allSettled([a, b]); await flush(); await vi.advanceTimersByTimeAsync(60_001);
  const results = await settled;
  for (const result of results) { expect(result.status).toBe("rejected"); if (result.status === "rejected") expect(result.reason).toMatchObject({ code: "engine-timeout" }); }
  expect(port.messages.filter(message => message.kind === "command")).toHaveLength(1);
  await expect(client.idle()).rejects.toMatchObject({ code: "engine-timeout" });
});

it("keeps Build Undo state, delta and archive byte-exact and captures the requested target", async () => {
  const { client, checkpoint, state } = await setup(); clients.push(client);
  const command: GameCommand = { type: "PLACE_ROOM", roomId: "engine.synthetic.hall", roomDefinitionId: "room.hallway", x: 34, y: 27, operationId: "engine.build" };
  const built = await client.execute(command), expectedBuilt = applyGameEvidenceCommand(checkpoint, command);
  exact(built.state, expectedBuilt.state);
  const target = structuredClone(state), undone = client.undo(target, "engine.undo"); target.cashCents = 0;
  const result = await undone, expected = applyGameEvidenceBuildUndo(expectedBuilt.checkpoint, state, "engine.undo");
  exact(result.state, expected.state); exact(result.delta, gameEvidenceDelta(expectedBuilt.checkpoint, expected.checkpoint)); exact(await client.checkpoint(), expected.checkpoint);
});

it("publishes exact overview/chart selections in queue order, with an explicit projection clock", async () => {
  const at = 1_800_000_000_000; vi.spyOn(Date, "now").mockReturnValue(at);
  const { client, port, state } = await setup(128, true); clients.push(client);
  exact(client.view, createPrototypePlayerView(state, null, false, null));
  const selected = Object.keys(state.encounters)[0]!;
  const chart = await client.project([selected, false, null], at); exact(chart, createPrototypePlayerView(client.state, selected, false, null));
  const result = await client.execute({ type: "SET_PAUSED", paused: false, operationId: "view.unpause" });
  exact(result.view, createPrototypePlayerView(result.state, selected, false, null));
  expect(result.view).toBe(client.view); expect(result.projection?.revision).toBe(1);
  port.auto = false;
  const pending = client.execute({ type: "ADVANCE_TICK", operationId: "view.tick", advancedAtRealMs: at });
  const nextView = client.project([null, false, null], at); await flush(); port.next(); const tick = await pending;
  expect(tick.projection?.revision).toBe(1); await flush(); port.next();
  exact(await nextView, createPrototypePlayerView(client.state, null, false, null));
});

it("compacts only at an explicit ordered barrier and continues exact evidence from the new baseline", async () => {
  const { client, checkpoint, state } = await setup(); clients.push(client);
  const first: GameCommand = { type: "SET_PAUSED", paused: false, operationId: "compact.before" };
  const last: GameCommand = { type: "ADVANCE_TICK", operationId: "compact.after", advancedAtRealMs: 1_800_000_000_000 };
  const before = client.execute(first), compacted = client.compact(), after = client.execute(last);
  const expectedBefore = applyGameEvidenceCommand(checkpoint, first), expectedBase = createGameEvidenceCheckpoint(expectedBefore.state);
  exact((await before).state, expectedBefore.state); exact(await compacted, expectedBase);
  const expectedAfter = applyGameEvidenceCommand(expectedBase, last), result = await after;
  exact(result.state, expectedAfter.state); exact(result.delta, gameEvidenceDelta(expectedBase, expectedAfter.checkpoint));
  exact(await client.checkpoint(), expectedAfter.checkpoint); expect(result.delta?.fromSequence).toBe(0);
  exact(state.learningHistories, expectedBefore.state.learningHistories);
});

it("honors each explicit context override and captures it before waiting behind another command", async () => {
  const { client, port, checkpoint } = await setup(); clients.push(client); port.auto = false;
  const context = structuredClone(PROTOTYPE_DOMAIN_CONTEXT); context.balanceRelease.development.addMoneyAmount = 123;
  const expectedContext = structuredClone(context), command: GameCommand = { type: "DEV_ADD_MONEY", operationId: "context.override" };
  const pending = client.execute(command, context); context.balanceRelease.development.addMoneyAmount = 999;
  await flush(); port.next(); const result = await pending;
  const expected = applyGameEvidenceCommand(checkpoint, command, expectedContext);
  exact(result.state, expected.state); exact(result.delta, gameEvidenceDelta(checkpoint, expected.checkpoint));
});

it("rejects a corrupt projection revision without publishing either its view or game state", async () => {
  const { client, port } = await setup(128, true); clients.push(client); port.auto = false;
  const state = client.state, view = client.view;
  const pending = client.execute({ type: "SET_PAUSED", paused: false, operationId: "bad.projection" });
  const rejected = expect(pending).rejects.toMatchObject({ code: "engine-projection" }); await flush();
  port.next(reply => { if (reply.kind === "applied" && reply.projection) reply.projection.revision++; });
  await rejected; expect(client.state).toBe(state); expect(client.view).toBe(view);
});

it("does not discard the immutable archive for an evidence-backed session", async () => {
  const { client, port, checkpoint } = await setup(128, false, false); clients.push(client);
  await expect(client.compact()).rejects.toMatchObject({ code: "engine-compaction-policy" });
  expect(port.messages.some(message => message.kind === "compact")).toBe(false);
  exact(await client.checkpoint(), checkpoint); expect(client.canAccept).toBe(true);
  const processor = new OperationalEngineProcessor();
  expect(processor.handle({ id: 1, kind: "initialize", checkpoint: structuredClone(checkpoint), visibleState: structuredClone(client.state), atRealMs: 1_800_000_000_000 }).kind).toBe("initialized");
  expect(processor.handle({ id: 2, kind: "compact", expectedVersion: 0 })).toEqual({ id: 2, kind: "failure", code: "engine-compaction-policy" });
});
