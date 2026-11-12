import { afterEach, expect, it, vi } from "vitest";
import * as domain from "@gamify-surgery/game-domain";
import { OperationalEngineClient, type OperationalEnginePort } from "./operationalEngineClient";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineRequest } from "./operationalEngineProtocol";
import * as phone from "../../mobile/performance/phoneMemoryPolicy";
import { CloudCodecWorker } from "./codecWorker";
import { operationalSessionFixture } from "./operationalSessionTestSupport";

afterEach(() => vi.restoreAllMocks());
function seed() {
  const visibleState = domain.createInitialGameState(undefined, { campaignId: "public.memory.seed", campaignSeed: "memory", createdAtRealMs: 0 });
  return { visibleState, checkpoint: domain.createGameEvidenceCheckpoint(visibleState), context: domain.PROTOTYPE_DOMAIN_CONTEXT, atRealMs: 0 };
}
function port() {
  const processor = new OperationalEngineProcessor(), messages: OperationalEngineRequest[] = [];
  const value: OperationalEnginePort = { onmessage: null, onerror: null, onmessageerror: null, terminate() {}, postMessage(request) {
    const captured = structuredClone(request); messages.push(captured);
    queueMicrotask(() => value.onmessage?.({ data: processor.handle(captured) } as MessageEvent));
  } };
  return { value, messages };
}

it("shares only an explicitly owned immutable main-thread seed and binds bundled catalogues without copying them", async () => {
  const input = seed(), p = port();
  const client = await OperationalEngineClient.create({ ...input, adoptSharedSeed: true, useBundledContext: true,
    context: { ...input.context, guidanceAttentionBlocked: true, guidanceBlockedTopicIds: ["tip.public"] } }, () => p.value);
  try {
    expect(client.state).toBe(input.visibleState);
    expect(client.recoveryCheckpoint.evidence.baseline.source).toBe(input.checkpoint.evidence.baseline.source);
    expect(Object.isFrozen(input.visibleState.learningHistories)).toBe(true);
    expect(p.messages[0]).toMatchObject({ contextFlags: { guidanceAttentionBlocked: true, guidanceBlockedTopicIds: ["tip.public"] } });
    expect((p.messages[0] as Extract<OperationalEngineRequest, { kind: "initialize" }>).context).toBeUndefined();
    const command = { type: "DEV_ADD_MONEY", operationId: "memory.command" } as const;
    const actual = await client.execute(command);
    expect(JSON.stringify(actual.state)).toBe(JSON.stringify(domain.applyGameEvidenceCommand(input.checkpoint, command, input.context).state));
  } finally { client.dispose(); }
});

it("keeps generic seeds isolated and carries explicit/custom catalogues even when the bundled optimization is requested", async () => {
  const input = seed(), context = structuredClone(input.context); context.balanceRelease.development.addMoneyAmount = 123;
  const p = port(), client = await OperationalEngineClient.create({ ...input, context, useBundledContext: true }, () => p.value);
  try {
    expect(client.state).not.toBe(input.visibleState);
    expect(client.recoveryCheckpoint.evidence.baseline.source).not.toBe(input.checkpoint.evidence.baseline.source);
    input.visibleState.cashCents = 1;
    expect(client.state.cashCents).not.toBe(1);
    expect((p.messages[0] as Extract<OperationalEngineRequest, { kind: "initialize" }>).context!.balanceRelease.development.addMoneyAmount).toBe(123);
    const command = { type: "DEV_ADD_MONEY", operationId: "custom.memory.command" } as const;
    expect(JSON.stringify((await client.execute(command)).state)).toBe(JSON.stringify(domain.applyGameEvidenceCommand(input.checkpoint, command, context).state));
  } finally { client.dispose(); }
});

it("validates reordered visible JSON exactly and performs no discarded opening commands", () => {
  const input = seed(), apply = vi.spyOn(domain, "applyGameEvidenceCommand"), processor = new OperationalEngineProcessor();
  const reordered = Object.fromEntries(Object.entries(input.visibleState).reverse()) as typeof input.visibleState;
  expect(processor.handle({ ...input, visibleState: reordered, id: 1, kind: "initialize" }).kind).toBe("initialized");
  expect(apply).not.toHaveBeenCalled();
  const failed = new OperationalEngineProcessor().handle({ ...seed(), visibleState: { ...input.visibleState, cashCents: 1 }, id: 1, kind: "initialize" });
  expect(failed).toMatchObject({ kind: "failure", code: "engine-visible-state" });
  const exotic = seed();
  const visibleState = { ...exotic.visibleState, employeeDiscussions: new Date(0) as unknown as typeof exotic.visibleState.employeeDiscussions };
  expect(new OperationalEngineProcessor().handle({ ...exotic, visibleState, id: 1, kind: "initialize" }))
    .toMatchObject({ kind: "failure", code: "engine-visible-state" });
});

it("reduced-mode opening releases only derived codec caches and still saves the exact command and learning data", async () => {
  vi.spyOn(phone, "phoneMemoryProfile").mockReturnValue({ mode: "reduced", maxDpr: 1, textureBytes: 8 * 1024 * 1024, textureCount: 32, keepLiveFamilies: false });
  const release = vi.spyOn(CloudCodecWorker.prototype, "releaseIdle"), f = await operationalSessionFixture();
  try {
    expect(release).toHaveBeenCalledOnce();
    const learning = JSON.stringify(f.session.state.learningHistories), before = f.session.state.cashCents;
    await f.session.executeAsync({ type: "DEV_ADD_MONEY", operationId: "memory.release.exact" }, domain.PROTOTYPE_DOMAIN_CONTEXT);
    const expected = before + domain.PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.addMoneyAmount * 100;
    expect(f.session.state.cashCents).toBe(expected);
    expect(await f.session.durable()).toBe(true);
    expect(await f.session.saveAndClose(domain.PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    expect(f.session.state.cashCents).toBe(expected);
    expect(JSON.stringify(f.session.state.learningHistories)).toBe(learning);
  } finally { f.session.dispose(); }
});
