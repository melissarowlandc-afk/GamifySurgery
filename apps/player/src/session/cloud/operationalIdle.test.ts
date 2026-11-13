import { afterEach, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import * as phone from "../../mobile/performance/phoneMemoryPolicy";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { deferred } from "./syncTestSupport";

afterEach(() => vi.restoreAllMocks());
const reduced: phone.PhoneMemoryProfile = { mode: "reduced", maxDpr: 1, textureBytes: 8 * 1024 * 1024, textureCount: 32, keepLiveFamilies: false };

it("parks only after a durable prefix and restarts before a following player command without replaying IDs", async () => {
  vi.spyOn(phone, "phoneMemoryProfile").mockReturnValue(reduced);
  const f = await operationalSessionFixture(), journal = f.cache.journal!, append = journal.append.bind(journal), held = deferred();
  let entered = false;
  vi.spyOn(journal, "append").mockImplementationOnce(async (...args) => { entered = true; await held.promise; return append(...args); });
  try {
    await f.session.executeAsync({ type: "SET_PAUSED", paused: true, operationId: "idle.pause" }, PROTOTYPE_DOMAIN_CONTEXT);
    const parked = (f.session as any).releaseIdleEngine();
    const following = f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "idle.following" }, PROTOTYPE_DOMAIN_CONTEXT);
    await vi.waitFor(() => expect(entered).toBe(true)); expect(f.ports[0]!.stopped).toBe(false); held.resolve();
    expect(await parked).toBe(true); expect(f.ports[0]!.stopped).toBe(true); expect(await following).not.toBeNull(); expect(f.ports).toHaveLength(2);
    expect(await f.session.durable()).toBe(true); const state = JSON.stringify(f.session.state);
    await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "idle.following" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(JSON.stringify(f.session.state)).toBe(state); expect(f.session.state.simulationSpeed).toBe(2);
  } finally { held.resolve(); f.session.dispose(); }
});

it("refuses idle release while a journal commit fails and keeps the original live worker", async () => {
  vi.spyOn(phone, "phoneMemoryProfile").mockReturnValue(reduced);
  const f = await operationalSessionFixture();
  try {
    await f.session.executeAsync({ type: "SET_PAUSED", paused: true, operationId: "idle.failed" }, PROTOTYPE_DOMAIN_CONTEXT);
    vi.spyOn(f.cache.journal!, "append").mockRejectedValue(Error("fixture disk failure"));
    expect(await (f.session as any).releaseIdleEngine()).toBe(false); expect(f.ports[0]!.stopped).toBe(false);
  } finally { vi.restoreAllMocks(); f.session.dispose(); }
});
