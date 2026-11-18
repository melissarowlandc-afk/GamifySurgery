import { afterEach, expect, it, vi } from "vitest";
import * as domain from "@gamify-surgery/game-domain";
import * as patch from "./operationalStatePatch";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { decodeCommandFailure } from "./commandFailure";
import { OperationalSessionEngine } from "./operationalSessionEngine";
import { ControllableOperationalPort, operationalSessionFixture } from "./operationalSessionTestSupport";
import { OperationalViewReuse } from "./operationalViewReuse";

afterEach(() => vi.restoreAllMocks());
const context = domain.PROTOTYPE_DOMAIN_CONTEXT;
const input = { type: "SET_SIMULATION_SPEED" as const, speed: 4 as const, operationId: "public.fault" };
const setup = () => {
  const state = domain.createInitialGameState(), checkpoint = domain.createGameEvidenceCheckpoint(state), processor = new OperationalEngineProcessor();
  expect(processor.handle({ id: 1, kind: "initialize", checkpoint, visibleState: state, context, atRealMs: 0, snapshotOnly: true }).kind).toBe("initialized");
  return { state, checkpoint, processor };
};

it.each(["execute", "diff", "projection", "publication"] as const)("keeps the worker's old prefix/version after a %s programming failure, with a data-free diagnostic", stage => {
  const f = setup();
  if (stage === "execute") vi.spyOn(domain, "applyGameEvidenceCommand").mockImplementationOnce(() => { throw new TypeError("PRIVATE"); });
  if (stage === "diff") vi.spyOn(patch, "operationalStatePatch").mockImplementationOnce(() => { throw new ReferenceError("PRIVATE"); });
  if (stage === "projection") vi.spyOn(OperationalViewReuse.prototype, "project").mockImplementationOnce(() => { throw new TypeError("PRIVATE"); });
  const reply = f.processor.handle({ id: 2, kind: "command", expectedVersion: 0, command: input,
    projection: { revision: 0, args: [null, false, null] } }, progress => { if (stage === "publication" && progress === "publish") throw new TypeError("PRIVATE"); });
  expect(reply.kind).toBe("failure"); if (reply.kind !== "failure") throw Error("Expected failure");
  expect(decodeCommandFailure(reply.code)?.info.stage).toBe(stage); expect(reply.code).not.toContain("PRIVATE");
  const current = f.processor.handle({ id: 3, kind: "checkpoint", expectedVersion: 0 });
  expect(current).toMatchObject({ kind: "checkpoint", version: 0, checkpoint: f.checkpoint });
  expect(f.processor.handle({ id: 4, kind: "command", expectedVersion: 0, command: { ...input, operationId: "public.next" } }).kind).toBe("applied");
});

it("never wraps a real evidence/proof error as a harmless command failure", () => {
  const f = setup(); vi.spyOn(domain, "applyGameEvidenceCommand").mockImplementationOnce(() => { throw new domain.GameEvidenceError("immutable-pins"); });
  expect(f.processor.handle({ id: 2, kind: "command", expectedVersion: 0, command: input })).toEqual({ id: 2, kind: "failure", code: "immutable-pins" });
});

it("does not replay a declared worker programming fault synchronously, and restarts for the next healthy intent", async () => {
  const state = domain.createInitialGameState(), checkpoint = domain.createGameEvidenceCheckpoint(state), ports: ControllableOperationalPort[] = [];
  const engine = await OperationalSessionEngine.create(checkpoint, state, context, true,
    { createPort: () => { const port = new ControllableOperationalPort(); ports.push(port); return port; } });
  const apply = vi.spyOn(domain, "applyGameEvidenceCommand").mockImplementationOnce(() => { throw new TypeError("PRIVATE"); });
  try {
    await expect(engine.execute(engine.capture(input, context))).rejects.toMatchObject({ name: "CommandExecutionFailure", info: { stage: "execute", errorClass: "TypeError" } });
    expect(apply).toHaveBeenCalledTimes(1); expect(engine.mode).toBe("synchronous");
    expect(JSON.stringify(engine.state)).toBe(JSON.stringify(state)); expect(engine.head.sequence).toBe(0);
    await engine.execute(engine.capture({ ...input, operationId: "public.healthy" }, context));
    expect(engine.mode).toBe("worker"); expect(ports).toHaveLength(2); expect(engine.head.sequence).toBe(1);
    expect(engine.state.operationReceipts["public.fault"]).toBeUndefined();
    expect(engine.state.operationReceipts["public.healthy"]?.status).toBe("applied");
  } finally { engine.dispose(); }
});

it("suppresses repeated identical intents without sacrificing a different player action or storming worker starts", async () => {
  const f = await operationalSessionFixture(), internal = f.session as any;
  const apply = vi.spyOn(domain, "applyGameEvidenceCommand").mockImplementationOnce(() => { throw new TypeError("PRIVATE"); });
  try {
    expect(await f.session.executeAsync(input, context)).toBeNull();
    for (let i = 0; i < 100; i++) expect(await f.session.executeAsync({ ...input, operationId: `public.repeat.${i}` }, context)).toBeNull();
    expect(apply).toHaveBeenCalledTimes(1); expect(f.ports).toHaveLength(1);
    expect(await f.session.executeAsync({ type: "SET_PAUSED", paused: true, operationId: "public.other.action" }, context)).not.toBeNull();
    expect(internal.engine.mode).toBe("worker"); expect(f.ports).toHaveLength(2);
  } finally { f.session.dispose(); }
});
