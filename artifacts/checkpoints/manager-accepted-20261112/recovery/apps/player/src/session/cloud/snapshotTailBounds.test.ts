import { afterEach, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { LOCAL_SNAPSHOT_TAIL_LIMIT } from "../localJournal";
import { cloudCodec } from "./codecWorker";
import { prepareJournal } from "./journalCodec";
import { tickSession } from "./tickPerformanceTestSupport";

const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;
afterEach(() => vi.restoreAllMocks());

it("bounds busy native account tails on pulse without changing state or uploading", async () => {
  // Stay before the five-minute boundary: this exercises the count bound.
  vi.spyOn(performance, "now").mockReturnValue(0);
  const f = await tickSession(false), key = cloudCampaignStorageKey(f.scope);
  vi.spyOn(f.coordinator, "pulse").mockResolvedValue();
  const codec = cloudCodec.run.bind(cloudCodec);
  vi.spyOn(cloudCodec, "run").mockImplementation(async task => task.kind === "journalWarm"
    ? { through: (await f.cache.journal!.head(key))!.highWater } as never : codec(task));
  const compact = vi.spyOn(f.cache.journal!, "compact");
  const uploads = f.server.operationCount(f.scope.accountId);
  try {
    for (let i = 0; i < LOCAL_SNAPSHOT_TAIL_LIMIT; i++) {
      expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: i % 2 ? 2 : 4,
        operationId: `tail-bound.${i}` }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      if (i % 32 === 0) expect(await f.session.durable()).toBe(true);
      if (i === LOCAL_SNAPSHOT_TAIL_LIMIT - 2) {
        await f.session.pulse(); expect(compact).not.toHaveBeenCalled();
      }
    }
    expect(await f.session.durable()).toBe(true);
    const exact = JSON.stringify(f.session.state);
    const before = (await f.cache.journal!.head(key))!;
    expect(before.highWater - before.snapshotThrough).toBe(LOCAL_SNAPSHOT_TAIL_LIMIT);
    await f.session.pulse();
    expect(compact).toHaveBeenCalledTimes(1);
    const after = (await f.cache.journal!.head(key))!;
    expect(after.highWater).toBe(before.highWater);
    expect(after.snapshotThrough).toBe(after.highWater);
    expect(JSON.stringify(f.session.state)).toBe(exact);
    const restored = await prepareJournal(f.cache.journal!, key, cloudCodec, { local: true, encode: false });
    expect(restored!.state).toStrictEqual(f.session.state);
    expect(f.server.operationCount(f.scope.accountId)).toBe(uploads);
  } finally { f.session.dispose(); }
}, hostedTime(120_000));
