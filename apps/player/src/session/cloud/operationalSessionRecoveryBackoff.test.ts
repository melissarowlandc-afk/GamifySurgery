import { expect, it } from "vitest";
import { createGameEvidenceCheckpoint, createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { OperationalSessionEngine } from "./operationalSessionEngine";
import { ControllableOperationalPort } from "./operationalSessionTestSupport";
import type { OperationalEngineRequest } from "./operationalEngineProtocol";

class HoldCommands extends ControllableOperationalPort {
  override postMessage(request: OperationalEngineRequest) {
    if (request.kind === "command") this.auto = false;
    super.postMessage(request);
  }
}
it("backs off repeated hydrate-then-crash cycles while applying each uncertain player command once", async () => {
  const state = createInitialGameState(undefined, { campaignId: "retry.public", campaignSeed: "retry", createdAtRealMs: 0 });
  const ports: ControllableOperationalPort[] = [];
  let now = 0;
  const engine = await OperationalSessionEngine.create(createGameEvidenceCheckpoint(state), state, PROTOTYPE_DOMAIN_CONTEXT, true,
    { now: () => now, createPort: () => { const port = new HoldCommands(); ports.push(port); return port; } });
  let commands = 0;
  const execute = async (crash: boolean) => {
    const work = engine.execute(engine.capture({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: `retry.player.${commands++}` }, PROTOTYPE_DOMAIN_CONTEXT));
    for (let i = 0; i < 30; i++) await Promise.resolve();
    if (crash) {
      expect(ports.at(-1)!.waiting.some(request => request.kind === "command")).toBe(true);
      ports.at(-1)!.onerror?.({ preventDefault() {} } as ErrorEvent);
    }
    return work;
  };
  try {
    await execute(true); expect(engine.mode).toBe("synchronous");
    now = 4_999; await execute(false); expect(ports).toHaveLength(1);
    // A ready worker alone is not evidence that slow/crashing play recovered.
    now = 5_000; await execute(true);
    now = 14_999; await execute(false); expect(ports).toHaveLength(2);
    expect(Object.keys(engine.state.operationReceipts)).toHaveLength(commands);
  } finally { engine.dispose(); }
});
