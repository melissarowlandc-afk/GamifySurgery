import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, deserializeGameState, importGameEvidence,
  PROTOTYPE_DOMAIN_CONTEXT, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { PHONE_ACTIVE_FPS } from "../../mobile/performance/frameBudget";
import { advanceRouteMotion, sampleRouteMotion, syncRouteMotion } from "../../facility/routeMotion";
import { startFacilityClock } from "../facilityClock";
import { SessionActions } from "../sessionActions";
import { LOCAL_JOURNAL_QUEUE_LIMIT, type JournalStorage } from "../localJournal";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { CloudCacheError } from "./codecCache";
import { CLOUD_WORKER_TASK_TIMEOUT_MS } from "./codecWorker";
import { prepareJournal } from "./journalCodec";
import { deferred } from "./syncTestSupport";
import { CadencePort, cadenceState, FRAME_MS, LONG_ROUTE, nativeWorkIdle, NUMERIC_EPSILON,
  observeCodecWork, replayWalking, scheduler, TICK_MS, TILES_PER_TICK, TRAVEL_PER_SECOND } from "./tickAdmissionCadenceTestSupport";

const SECONDS = 60;
const SLICE_MS = TICK_MS / 10;
const APPEND_BUDGET = 20;
const context = PROTOTYPE_DOMAIN_CONTEXT;
const modes = [true, false] as const;
const matrix = modes.flatMap(operational => [0, 600, 1_200, 2_500].map(latency => ({ operational, latency })));
// Codecs/replay may construct object keys in a different insertion order.
// Compare exact canonical UTF-8 bytes: retain EVERY value and array order,
// including FSRS cards/dates/reviews and all operation receipt payloads.
const canonicalText = (value: unknown): string => value === null || typeof value !== "object"
  ? JSON.stringify(value) : Array.isArray(value) ? `[${value.map(canonicalText).join(",")}]`
    : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalText((value as Record<string, unknown>)[key])}`).join(",")}}`;
const digest = (value: unknown) => createHash("sha256").update(canonicalText(value)).digest("hex");
const source = readFileSync(new URL("../../../../../tests/fixtures/level-five-economy-checkpoint-20261012.json", import.meta.url), "utf8");

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

function reviewedClinic(): GameState {
  const state = deserializeGameState(source);
  state.paused = false; state.simulationSpeed = 1;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  return state;
}

/** Delay only the append, then await the ORIGINAL native append. Scheduled
 * fake-time latency and running native work are deliberately separate: the
 * former must not deadlock the clock; the latter must not escape observation. */
function appendObserver(store: JournalStorage, latency: number, held?: Promise<void>) {
  const append = store.append.bind(store);
  const io = { waiting: 0, native: 0, batches: 0, rows: 0, completed: 0 };
  vi.spyOn(store, "append").mockImplementation(async (...args) => {
    io.batches++; io.rows += args[3].length;
    const sealed = digest(args[3]);
    if (held || latency > 0) {
      io.waiting++;
      try { await (held ?? new Promise<void>(resolve => setTimeout(resolve, latency))); }
      finally { io.waiting--; }
    }
    if (digest(args[3]) !== sealed) throw new Error("An in-flight append payload changed while storage was waiting.");
    io.native++;
    try { const result = await append(...args); io.completed++; return result; }
    finally { io.native--; }
  });
  return io;
}

async function fixture(operational: boolean, latency = 0, held?: Promise<void>, large = false) {
  const codecBusy = observeCodecWork(), ports: CadencePort[] = [];
  const f = await operationalSessionFixture({ createPort: () => { const port = new CadencePort(); ports.push(port); return port; } },
    large ? reviewedClinic() : cadenceState(), operational);
  expect(await f.session.durable()).toBe(true); // Setup only; never inside the pulse window.
  const io = appendObserver(f.coordinator.journal!, latency, held);
  const busy = () => codecBusy() || io.native > 0 || ports.some(port => port.outstanding.size > 0);
  await nativeWorkIdle(busy);
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  vi.setSystemTime(f.clock.wall);
  const step = async () => { f.clock.advance(SLICE_MS); await vi.advanceTimersByTimeAsync(SLICE_MS); await nativeWorkIdle(busy); };
  const finish = async <T,>(work: Promise<T>): Promise<T> => {
    let done = false, result!: T, failure: unknown;
    void work.then(value => { result = value; done = true; }, error => { failure = error; done = true; });
    const end = Date.now() + CLOUD_WORKER_TASK_TIMEOUT_MS;
    while (!done) {
      await nativeWorkIdle(busy);
      if (done) break;
      if (Date.now() >= end) throw new Error("Explicit completion barrier did not finish within the existing worker task bound.");
      await step();
    }
    if (failure) throw failure;
    await nativeWorkIdle(busy);
    return result;
  };
  return { ...f, ports, io, busy, step, finish };
}
type Fixture = Awaited<ReturnType<typeof fixture>>;

function reference(initial: GameState, commands: readonly GameCommand[]): GameState {
  let checkpoint = createGameEvidenceCheckpoint(initial);
  for (const command of commands) checkpoint = applyGameEvidenceCommand(checkpoint, command, context).checkpoint;
  return importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
}

async function recovered(f: Fixture): Promise<GameState> {
  const restored = await prepareJournal(f.coordinator.journal!, cloudCampaignStorageKey(f.scope), f.coordinator.codec, { local: true, encode: false });
  expect(restored?.state).toBeDefined();
  return restored!.state!;
}

function assertNativeComplete(f: Fixture) {
  expect(f.io.waiting).toBe(0);
  expect(f.io.native).toBe(0);
  expect(f.io.completed).toBe(f.io.batches);
  expect(f.session.syncView.localDurable).toBe(true);
}

async function pauseCloseAndRecover(f: Fixture, initial: GameState, commands: readonly GameCommand[], id: string) {
  // An explicit player pause/close is outside the 60-second ordinary-write
  // budget. Its known operation ID keeps the whole reference independent.
  const pause = { type: "SET_PAUSED", paused: true, operationId: `${id}.pause` } as const;
  expect(await f.session.executeAsync(pause, context)).not.toBeNull();
  expect(await f.finish(f.session.saveAndClose(context))).toBe(true);
  assertNativeComplete(f);
  const restored = await recovered(f), expected = reference(initial, [...commands, pause]);
  expect(restored.paused).toBe(true);
  expect(digest(restored)).toBe(digest(expected));
  expect(digest(restored.learningHistories)).toBe(digest(initial.learningHistories));
  expect(digest(restored.operationReceipts)).toBe(digest(expected.operationReceipts));
  return { restored, pause };
}

/** The frozen frame helper covers 20 seconds. Reuse it, and additionally sample
 * all 60 seconds through the same real motion functions without resetting the
 * production lookahead at segment boundaries. The 129-node path never ends. */
function routeContinuity(ticks: readonly number[]) {
  const firstWindow = replayWalking(ticks);
  let track = syncRouteMotion(undefined, { path: LONG_ROUTE, pathIndex: 0, location: LONG_ROUTE[0], lookaheadPathNodes: TILES_PER_TICK })!;
  let previous = sampleRouteMotion(track).location, stationary = 0, maximum = 0;
  for (let frame = 0; frame < SECONDS * PHONE_ACTIVE_FPS; frame++) {
    const index = ticks[Math.floor(frame / PHONE_ACTIVE_FPS)]! * TILES_PER_TICK;
    if (index + TILES_PER_TICK >= LONG_ROUTE.length) throw new Error("A planned route endpoint cannot count as starvation.");
    track = syncRouteMotion(track, { path: LONG_ROUTE, pathIndex: index, location: LONG_ROUTE[index], lookaheadPathNodes: TILES_PER_TICK })!;
    track = advanceRouteMotion(track, FRAME_MS, TRAVEL_PER_SECOND);
    const next = sampleRouteMotion(track).location;
    if (Math.hypot(next.x - previous.x, next.y - previous.y) > NUMERIC_EPSILON) stationary = 0;
    else maximum = Math.max(maximum, ++stationary);
    previous = next;
  }
  return { firstWindowPauseMs: firstWindow.maxUnplannedPauseMs, fullWindowPauseMs: maximum * FRAME_MS };
}

it.each(matrix)('B-012 "two steps and then stop": 60 healthy 1x pulses stay continuous with $latency ms append latency (worker=$operational)', async ({ operational, latency }) => {
  // D-2026-11-18-02: "For the most part they take two steps and then stop. then
  // two steps again then stop." Healthy slow storage is not a failure fence.
  const f = await fixture(operational, latency, undefined, true), actions = new SessionActions(operational);
  f.session.bindCommandActions(actions);
  const initial = structuredClone(f.session.state), startTick = initial.facilityTick;
  const commands: GameCommand[] = [], accepted: GameCommand[] = [], ticks = [0];
  expect(Object.values(initial.learningHistories).some(history => history.reviews.length > 0)).toBe(true);
  let pulses = 0;
  const stop = startFacilityClock(scheduler, TICK_MS,
    () => ({ tick: f.session.state.facilityTick, paused: f.session.state.paused, speed: f.session.state.simulationSpeed, visible: true, allowed: f.session.canExecute }),
    () => {
      const command = { type: "ADVANCE_TICK", operationId: `slow.${operational}.${latency}.${++pulses}`, advancedAtRealMs: Date.now() } as const;
      commands.push(command);
      actions.tick(() => f.session.advanceClock(command, context).then(state => { if (state) accepted.push(command); return state; }));
    });
  try {
    expect(TICK_MS).toBe(1_000);
    for (let second = 1; second <= SECONDS; second++) {
      for (let slice = 0; slice < TICK_MS / SLICE_MS; slice++) await f.step();
      await f.session.pulse(); await nativeWorkIdle(f.busy); // Ordinary lease maintenance, never durable().
      expect(f.session.syncView).toMatchObject({ canExecute: true, failure: null });
      expect(f.session.state).toMatchObject({ paused: false, simulationSpeed: 1 });
      ticks.push(f.session.state.facilityTick - startTick);
    }
    stop();
    const increments = ticks.slice(1).map((tick, index) => tick - ticks[index]!);
    const motion = routeContinuity(ticks);
    expect.soft(pulses).toBe(SECONDS);
    expect.soft(accepted.length, "Every healthy pulse must be admitted, even while a below-bound append waits.").toBe(SECONDS);
    expect.soft(increments, "Healthy slow storage must not create refused clock pulses.").toEqual(Array(SECONDS).fill(1));
    expect.soft(motion.firstWindowPauseMs).toBeLessThanOrEqual(FRAME_MS + NUMERIC_EPSILON);
    expect.soft(motion.fullWindowPauseMs).toBeLessThanOrEqual(FRAME_MS + NUMERIC_EPSILON);

    expect(await f.finish(f.session.durable())).toBe(true); // Explicit barrier AFTER measurement.
    assertNativeComplete(f);
    const ordinary = { batches: f.io.batches, rows: f.io.rows, completed: f.io.completed };
    expect(ordinary.batches).toBeLessThanOrEqual(APPEND_BUDGET);
    expect(ordinary.rows).toBeLessThanOrEqual(APPEND_BUDGET);
    const prefix = reference(initial, accepted), saved = await recovered(f);
    expect(digest(saved)).toBe(digest(prefix)); // All ACTUALLY accepted work survived, even on the failing base.
    expect(digest(saved.learningHistories)).toBe(digest(initial.learningHistories));
    expect(digest(saved.operationReceipts)).toBe(digest(prefix.operationReceipts));
    const { restored, pause } = await pauseCloseAndRecover(f, initial, accepted, `slow.${operational}.${latency}.close`);
    const allSixty = reference(initial, [...commands, pause]);
    expect.soft(digest(restored), "Paused recovery must equal the independent sixty-pulse reference, including FSRS and receipts.").toBe(digest(allSixty));
    console.info("B012_SLOW_STORAGE", JSON.stringify({ operational, latency, pulses, admitted: accepted.length,
      increments, motion, ordinary, afterCloseBatches: f.io.batches, afterCloseRows: f.io.rows,
      nativeCompleted: f.io.completed, referenceBytes: Buffer.byteLength(JSON.stringify(allSixty)), restoredBytes: Buffer.byteLength(JSON.stringify(restored)) }));
  } finally { stop(); f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);

it.each(modes)('B-012 control: quota failure fences ticks and retains every accepted command (worker=%s)', async operational => {
  const f = await fixture(operational), initial = structuredClone(f.session.state);
  const commands: GameCommand[] = [
    { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "slow.quota.speed" },
    { type: "SET_PAUSED", paused: true, operationId: "slow.quota.pause" },
  ];
  try {
    for (const command of commands) expect(await f.session.executeAsync(command, context)).not.toBeNull();
    expect(await f.finish(f.session.durable())).toBe(true); assertNativeComplete(f);
    vi.spyOn(f.cache, "write").mockRejectedValue(new CloudCacheError("quota"));
    expect(await f.finish(f.session.checkpointNow("purchase"))).toBe(false);
    expect(f.session.syncView).toMatchObject({ canExecute: false, failure: "storage", storageQuota: true });
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "slow.quota.refused" }, context)).toBeNull();
    const restored = await recovered(f), expected = reference(initial, commands);
    expect(digest(restored)).toBe(digest(expected));
    expect(restored.operationReceipts["slow.quota.refused"]).toBeUndefined();
  } finally { f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);

it.each(modes)('B-012 control: a held 128-logical-command queue refuses the next intent and recovers exactly (worker=%s)', async operational => {
  const gate = deferred(), f = await fixture(operational, 0, gate.promise), initial = structuredClone(f.session.state);
  const commands: GameCommand[] = [];
  try {
    for (let index = 0; index < LOCAL_JOURNAL_QUEUE_LIMIT; index++) {
      // Cumulative tick effects mean a dropped accepted command cannot be
      // hidden by a later speed change. The remaining explicit commands do
      // not prescribe ordinary per-clock write policy.
      const command = { type: "ADVANCE_TICK", operationId: `slow.capacity.${index}`,
        advancedAtRealMs: f.clock.wall + index * TICK_MS } as const;
      // Include several ordinary clock intents before capturing the held
      // write. They may share a row; capacity must still count logical work.
      const next = index < 3 ? await f.session.advanceClock(command, context) : await f.session.executeAsync(command, context);
      expect(next).not.toBeNull();
      expect(next!.facilityTick).toBe(initial.facilityTick + index + 1);
      expect(next!.operationReceipts[command.operationId]?.status).toBe("applied");
      commands.push(command);
      if (index === 2) {
        // Start the captured-prefix write, then deliberately hold the append.
        // No assumption about ordinary tick journaling/coalescing is involved.
        void f.session.durable(); await nativeWorkIdle(f.busy);
        expect(f.io.waiting).toBe(1);
        expect(f.session.canExecute).toBe(true);
      }
    }
    expect(LOCAL_JOURNAL_QUEUE_LIMIT).toBe(128); // Released logical bound, not row count.
    expect(commands).toHaveLength(LOCAL_JOURNAL_QUEUE_LIMIT);
    expect(f.session.syncView).toMatchObject({ canExecute: false, localDurable: false, failure: null });
    expect(await f.session.advanceClock({ type: "ADVANCE_TICK", operationId: "slow.capacity.clock-overflow" }, context)).toBeNull();
    expect(await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 1, operationId: "slow.capacity.player-overflow" }, context)).toBeNull();
    expect(f.session.state.operationReceipts["slow.capacity.clock-overflow"]).toBeUndefined();
    expect(f.session.state.operationReceipts["slow.capacity.player-overflow"]).toBeUndefined();
    gate.resolve();
    expect(await f.finish(f.session.durable())).toBe(true); assertNativeComplete(f);
    expect(f.session.canExecute).toBe(true);
    const restored = await recovered(f);
    const expected = reference(initial, commands);
    expect(digest(restored)).toBe(digest(expected));
    expect(restored.facilityTick).toBe(initial.facilityTick + LOCAL_JOURNAL_QUEUE_LIMIT);
    // Receipts intentionally have bounded retention. Compare the complete
    // released receipt map, not an invented unbounded 128-receipt history.
    expect(canonicalText(restored.operationReceipts)).toBe(canonicalText(expected.operationReceipts));
    const tick = { type: "ADVANCE_TICK", operationId: "slow.capacity.resumed", advancedAtRealMs: Date.now() } as const;
    expect(await f.session.advanceClock(tick, context)).not.toBeNull(); commands.push(tick);
    await pauseCloseAndRecover(f, initial, commands, "slow.capacity.close");
  } finally { gate.resolve(); f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);

it('B-012 control: held worker player orders are never overtaken by clock pulses', async () => {
  const f = await fixture(true), actions = new SessionActions(true), initial = structuredClone(f.session.state), port = f.ports[0]!;
  f.session.bindCommandActions(actions); port.inner.auto = false;
  const commands: GameCommand[] = [
    { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "slow.order.first" },
    { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "slow.order.second" },
  ];
  const run = actions.action(function* (command: GameCommand) { return yield f.session.executeControllerCommand(command, context); });
  const first = run(commands[0]!), second = run(commands[1]!);
  let pulses = 0;
  const stop = startFacilityClock(scheduler, TICK_MS,
    () => ({ tick: f.session.state.facilityTick, paused: false, speed: 1, visible: true, allowed: true }),
    () => { pulses++; actions.tick(() => f.session.advanceClock({ type: "ADVANCE_TICK", operationId: `slow.order.clock.${pulses}` }, context)); });
  try {
    await vi.advanceTimersByTimeAsync(2 * TICK_MS); // The engine is INTENTIONALLY held, not healthy native I/O.
    expect(pulses).toBe(2); expect(actions.skippedClockPulses).toBe(2);
    expect(f.session.commandPending).toBe(true); expect(f.session.syncView.localDurable).toBe(false);
    expect(f.session.state.facilityTick).toBe(initial.facilityTick);
    expect(f.session.state.operationReceipts["slow.order.clock.1"]).toBeUndefined();
    expect(f.session.state.operationReceipts["slow.order.clock.2"]).toBeUndefined();
    stop(); port.inner.auto = true; port.inner.next();
    const results = await f.finish(Promise.all([first, second]));
    expect(results.every(result => result !== null)).toBe(true);
    expect(port.inner.messages.filter(message => message.kind === "command").map(message => message.command.operationId))
      .toEqual(commands.map(command => command.operationId));
    await pauseCloseAndRecover(f, initial, commands, "slow.order.close");
  } finally { stop(); port.inner.auto = true; f.session.dispose(); f.coordinator.dispose(); }
}, 120_000);
