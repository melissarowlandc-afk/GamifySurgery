import { expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { deferred } from "./syncTestSupport";
import { prepareJournal } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";

it("skips unadmitted clock intents behind a durable-write backlog while preserving player commands", async () => {
  const f = await operationalSessionFixture(), entered = deferred(), gate = deferred();
  try {
    await f.session.executeAsync({ type: "SET_PAUSED", paused: false, operationId: "clock.unpause" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    const store = f.cache.journal!, append = store.append.bind(store);
    const held = vi.spyOn(store, "append").mockImplementationOnce(async (...args) => { entered.resolve(); await gate.promise; return append(...args); });
    const first = await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "clock.first" }, PROTOTYPE_DOMAIN_CONTEXT);
    await entered.promise;
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "clock.skipped" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    const player = await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "clock.player" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(player!.facilityTick).toBe(first!.facilityTick); expect(player!.simulationSpeed).toBe(4);
    expect(Object.hasOwn(player!.operationReceipts, "clock.skipped")).toBe(false);
    let acknowledged = false;
    const durable = f.session.durable().then(ok => { acknowledged = ok; return ok; });
    await Promise.resolve(); expect(acknowledged).toBe(false); expect(f.session.syncView.localDurable).toBe(false);
    gate.resolve(); expect(await durable).toBe(true);
    const recovered = await prepareJournal(store, cloudCampaignStorageKey(f.scope), f.coordinator.codec, { local: true, encode: false });
    expect(JSON.stringify(recovered!.state)).toBe(JSON.stringify(player)); held.mockRestore();
  } finally { gate.resolve(); f.session.dispose(); vi.restoreAllMocks(); }
});
