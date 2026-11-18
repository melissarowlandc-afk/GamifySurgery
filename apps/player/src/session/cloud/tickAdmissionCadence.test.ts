import { afterEach, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { startFacilityClock } from "../facilityClock";
import { SessionActions } from "../sessionActions";
import { CloudCacheError } from "./codecCache";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { CadencePort, PULSES, TICK_MS, NUMERIC_EPSILON, cadenceState, nativeWorkIdle, observeCodecWork, replayWalking, scheduler } from "./tickAdmissionCadenceTestSupport";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

async function accountFixture() {
  const codecBusy = observeCodecWork(), ports: CadencePort[] = [];
  const f = await operationalSessionFixture({ createPort: () => { const port = new CadencePort(); ports.push(port); return port; } }, cadenceState());
  expect(await f.session.durable()).toBe(true); // Setup only; never between pulses.
  const busy = () => codecBusy() || ports.some(port => port.outstanding.size > 0);
  await nativeWorkIdle(busy);
  return { ...f, ports, busy };
}

it('B-012 "two steps and then stop": healthy account 1x clock supplies every tick and a continuous walking route', async () => {
  // Owner D-2026-11-18-02: "two steps and then stop. then two steps again then stop."
  // Assert player-visible cadence, not how/when progress is journaled to disk.
  const f = await accountFixture(), actions = new SessionActions(true);
  f.session.bindCommandActions(actions);
  const initial = f.session.state.facilityTick, ticks = [0];
  let pulses = 0;
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  vi.setSystemTime(f.clock.wall);
  const stop = startFacilityClock(scheduler, TICK_MS,
    () => ({ tick: f.session.state.facilityTick, paused: f.session.state.paused, speed: f.session.state.simulationSpeed, visible: true, allowed: f.session.canExecute }),
    () => { pulses++; actions.tick(() => f.session.advanceClock({ type: "ADVANCE_TICK", advancedAtRealMs: Date.now(), operationId: `cadence.pulse.${pulses}` }, PROTOTYPE_DOMAIN_CONTEXT)); });
  try {
    expect(TICK_MS).toBe(1_000);
    for (let second = 1; second <= PULSES; second++) {
      f.clock.advance(TICK_MS);
      await vi.advanceTimersByTimeAsync(TICK_MS);
      await nativeWorkIdle(f.busy);
      expect(f.session.syncView).toMatchObject({ canExecute: true, failure: null });
      expect(f.session.state).toMatchObject({ paused: false, simulationSpeed: 1 });
      ticks.push(f.session.state.facilityTick - initial);
    }
    const increments = ticks.slice(1).map((tick, index) => tick - ticks[index]!);
    const motion = replayWalking(ticks);
    console.info("B012_ACCOUNT", JSON.stringify({ pulses, admittedTicks: ticks.at(-1), increments, motion }));
    expect.soft(pulses).toBe(PULSES);
    expect.soft(ticks.at(-1), "Twenty healthy 1x seconds must admit twenty ticks; no warmup is present in startFacilityClock.").toBe(PULSES);
    expect.soft(increments, "No healthy pulse may be refused merely because background work is scheduled.").toEqual(Array(PULSES).fill(1));
    expect.soft(motion.movingFrames).toBeGreaterThan(0);
    expect.soft(motion.maxUnplannedPauseMs, "A continuing route must not walk for a second then wait for a second.").toBeLessThanOrEqual(motion.frameMs + NUMERIC_EPSILON);
  } finally { stop(); f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);

it('B-012 control: genuine failed checkpoint storage still fences clock admission', async () => {
  const f = await accountFixture();
  try {
    await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "cadence.quota.player" }, PROTOTYPE_DOMAIN_CONTEXT);
    vi.spyOn(f.cache, "write").mockRejectedValue(new CloudCacheError("quota"));
    // Explicit checkpoint, independent of any per-tick journaling mechanism.
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(f.session.syncView).toMatchObject({ canExecute: false, failure: "storage", storageQuota: true });
    const tick = f.session.state.facilityTick;
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "cadence.quota.refused" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(f.session.state.facilityTick).toBe(tick);
    expect(f.session.state.operationReceipts["cadence.quota.refused"]).toBeUndefined();
  } finally { f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);

it('B-012 control: clock pulses cannot overtake held player orders or invent their receipts', async () => {
  const f = await accountFixture(), actions = new SessionActions(true), port = f.ports[0]!;
  f.session.bindCommandActions(actions);
  port.inner.auto = false;
  const speed = actions.action(function* (value: 2 | 4, operationId: string) {
    return yield f.session.executeControllerCommand({ type: "SET_SIMULATION_SPEED", speed: value, operationId }, PROTOTYPE_DOMAIN_CONTEXT);
  });
  const first = speed(2, "cadence.player.first"), second = speed(4, "cadence.player.second");
  await Promise.resolve(); await Promise.resolve();
  const tick = f.session.state.facilityTick;
  let pulses = 0;
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  const stop = startFacilityClock(scheduler, TICK_MS,
    () => ({ tick: f.session.state.facilityTick, paused: false, speed: 1, visible: true, allowed: true }),
    () => { pulses++; actions.tick(() => f.session.advanceClock({ type: "ADVANCE_TICK", operationId: `cadence.held.${pulses}` }, PROTOTYPE_DOMAIN_CONTEXT)); });
  try {
    await vi.advanceTimersByTimeAsync(2 * TICK_MS);
    expect(pulses).toBe(2);
    expect(actions.skippedClockPulses).toBe(2);
    expect(f.session.commandPending).toBe(true);
    expect(f.session.syncView.localDurable).toBe(false);
    expect(f.session.state.facilityTick).toBe(tick);
    expect(f.session.state.operationReceipts["cadence.held.1"]).toBeUndefined();
    expect(f.session.state.operationReceipts["cadence.held.2"]).toBeUndefined();
    stop();
    port.inner.auto = true;
    port.inner.next();
    await Promise.all([first, second]);
    expect(f.session.state.simulationSpeed).toBe(4);
    const commands = port.inner.messages.filter(request => request.kind === "command").map(request => request.command.operationId);
    expect(commands).toEqual(["cadence.player.first", "cadence.player.second"]);
    expect(f.session.state.operationReceipts["cadence.player.first"]).toBeDefined();
    expect(f.session.state.operationReceipts["cadence.player.second"]).toBeDefined();
  } finally { stop(); port.inner.auto = true; f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);
