import { setImmediate as nativeTurn } from "node:timers/promises";
import { vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState } from "@gamify-surgery/game-domain";
import { PHONE_ACTIVE_FPS } from "../../mobile/performance/frameBudget";
import { advanceRouteMotion, getRouteTilesPerSecond, sampleRouteMotion, syncRouteMotion } from "../../facility/routeMotion";
import { cloudCodec } from "./codecWorker";
import type { CloudCodecTask } from "./codecTasks";
import type { OperationalEnginePort } from "./operationalEngineClient";
import { ControllableOperationalPort } from "./operationalSessionTestSupport";
import type { OperationalEngineRequest } from "./operationalEngineProtocol";
import type { FacilityClockScheduler } from "../facilityClock";

export const PULSES = 20;
export const TICK_MS = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x;
export const TILES_PER_TICK = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick;
export const FRAME_MS = 1_000 / PHONE_ACTIVE_FPS;
export const TRAVEL_PER_SECOND = getRouteTilesPerSecond(TILES_PER_TICK, TICK_MS, 1);
export const NUMERIC_EPSILON = Number.EPSILON * 1_000_000;

export function cadenceState() {
  const state = createInitialGameState(undefined, { campaignId: "campaign.public.tick-cadence", campaignSeed: "public.tick-cadence", createdAtRealMs: 0 });
  state.paused = false;
  state.simulationSpeed = 1;
  state.facilityLevel = 1; // No guided Level-0 acceleration or tutorial pause.
  state.clinicalXp = 64;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  return state;
}

/** Existing real processor/dispatch/structured-clone port, with transport-only
 * in-flight observation. No engine result, codec, storage deadline or admission
 * is mocked. Holding a command is available only to the ordering control. */
export class CadencePort implements OperationalEnginePort {
  readonly inner = new ControllableOperationalPort();
  readonly outstanding = new Set<number>();
  private listener: OperationalEnginePort["onmessage"] = null;
  get onmessage() { return this.listener; }
  set onmessage(listener: OperationalEnginePort["onmessage"]) {
    this.listener = listener;
    this.inner.onmessage = event => {
      if ("kind" in event.data) this.outstanding.delete(event.data.id);
      this.listener?.(event);
    };
  }
  onerror: OperationalEnginePort["onerror"] = null;
  onmessageerror: OperationalEnginePort["onmessageerror"] = null;
  constructor() {
    this.inner.onerror = event => this.onerror?.(event);
    this.inner.onmessageerror = event => this.onmessageerror?.(event);
  }
  postMessage(request: OperationalEngineRequest): void {
    this.outstanding.add(request.id);
    this.inner.postMessage(request);
  }
  terminate() { this.inner.terminate(); }
}

/** Observe all already-started codec work, including the inline Node codec.
 * This neither requires nor forbids a per-tick disk/journal task. */
export function observeCodecWork(): () => boolean {
  const run = cloudCodec.run.bind(cloudCodec);
  let active = 0;
  vi.spyOn(cloudCodec, "run").mockImplementation(((task: CloudCodecTask) => {
    active++;
    return run(task).finally(() => { active--; });
  }) as typeof cloudCodec.run);
  return () => active > 0;
}

/** Fake milliseconds cannot accelerate native crypto/streams/IDB. Yield only
 * native event-loop turns until work that has ALREADY started completes. Never
 * advance virtual time, call durable/commandsSettled, or fire a future timer.
 * The real-time guard is a harness failure, not a gameplay/performance budget. */
export async function nativeWorkIdle(busy: () => boolean): Promise<void> {
  const limit = performance.now() + 10_000;
  let quietTurns = 0;
  while (quietTurns < 3) {
    await nativeTurn();
    quietTurns = busy() ? 0 : quietTurns + 1;
    if (performance.now() > limit) throw new Error("Already-started synthetic I/O did not settle; do not advance the clock over it.");
  }
}

export const scheduler: FacilityClockScheduler = {
  setInterval: (callback, ms) => setInterval(callback, ms) as unknown as number,
  clearInterval: id => clearInterval(id),
  setTimeout: (callback, ms) => setTimeout(callback, ms) as unknown as number,
  clearTimeout: id => clearTimeout(id),
};

/** A continuing, adjacent-node, synthetic walking route; no repeats, planned
 * holds, seats, task boundaries or route end within the measured 20 seconds. */
export const LONG_ROUTE = Array.from({ length: 129 }, (_, index) => index < 64
  ? { x: index + 2, y: 4 }
  : index < 128 ? { x: 65 - (index - 64), y: 5 } : { x: 2, y: 6 });

/** The session's admitted tick timeline supplies canonical logical movement to
 * the real renderer functions. No route target is supplied for a refused tick.
 * Its ordinary two-interval lookahead remains entirely production-owned. */
export function replayWalking(ticksAtSecond: readonly number[], framesPerSecond = PHONE_ACTIVE_FPS) {
  const frameMs = 1_000 / framesPerSecond;
  let track = syncRouteMotion(undefined, { path: LONG_ROUTE, pathIndex: 0, location: LONG_ROUTE[0], lookaheadPathNodes: TILES_PER_TICK })!;
  let previous = sampleRouteMotion(track).location, stationaryFrames = 0, longest = 0, movingFrames = 0;
  for (let frame = 0; frame < PULSES * framesPerSecond; frame++) {
    const tick = ticksAtSecond[Math.floor(frame / framesPerSecond)]!;
    const pathIndex = tick * TILES_PER_TICK;
    if (pathIndex + TILES_PER_TICK >= LONG_ROUTE.length) throw new Error("Fixture route ended; a planned stop cannot count as starvation.");
    track = syncRouteMotion(track, { path: LONG_ROUTE, pathIndex, location: LONG_ROUTE[pathIndex], lookaheadPathNodes: TILES_PER_TICK })!;
    track = advanceRouteMotion(track, frameMs, TRAVEL_PER_SECOND);
    const next = sampleRouteMotion(track).location;
    const distance = Math.hypot(next.x - previous.x, next.y - previous.y);
    if (distance > NUMERIC_EPSILON) { stationaryFrames = 0; movingFrames++; }
    else longest = Math.max(longest, ++stationaryFrames);
    previous = next;
  }
  return { maxUnplannedPauseMs: longest * frameMs, movingFrames, location: previous, frameMs };
}
