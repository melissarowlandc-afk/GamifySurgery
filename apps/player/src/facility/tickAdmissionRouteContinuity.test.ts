import { expect, it } from "vitest";
import { PHONE_ACTIVE_FPS } from "../mobile/performance/frameBudget";
import { advanceRouteMotion, routeMotionStepTiles, sampleRouteMotion, syncRouteMotion,
  ROUTE_CATCH_UP_START_TILES, ROUTE_CATCH_UP_GAIN_PER_TILE, ROUTE_CATCH_UP_MAX_MULTIPLIER } from "./routeMotion";
import { LONG_ROUTE, NUMERIC_EPSILON, PULSES, TILES_PER_TICK, TRAVEL_PER_SECOND, replayWalking } from "../session/cloud/tickAdmissionCadenceTestSupport";

it('B-012 route control: one admitted 1x tick per second has no two-steps/one-second-stop cycle', () => {
  // No seats, holds, repeated nodes, task boundaries or route end in this path.
  // Phone's production 30fps budget supplies the allowed one-frame tolerance.
  const motion = replayWalking(Array.from({ length: PULSES + 1 }, (_, second) => second));
  expect(motion.movingFrames).toBe(PULSES * PHONE_ACTIVE_FPS);
  expect(motion.maxUnplannedPauseMs).toBeLessThanOrEqual(motion.frameMs + NUMERIC_EPSILON);
});

it('B-012 route control: missed frames recover without a snap or exceeding the existing catch-up cap', () => {
  expect(ROUTE_CATCH_UP_MAX_MULTIPLIER).toBeLessThanOrEqual(2.5); // Existing released ceiling; a lower cap is permitted.
  let track = syncRouteMotion(undefined, { path: LONG_ROUTE, location: LONG_ROUTE[0], pathIndex: 0, lookaheadPathNodes: TILES_PER_TICK })!;
  const beforeGap = sampleRouteMotion(track).location;
  // Enough real logical ticks to activate the EXISTING cap, derived from its
  // start/gain constants; this is not a new speed or starvation threshold.
  const missedTicks = Math.ceil((ROUTE_CATCH_UP_START_TILES + (ROUTE_CATCH_UP_MAX_MULTIPLIER - 1) / ROUTE_CATCH_UP_GAIN_PER_TILE) / TILES_PER_TICK) + 1;
  let tick = missedTicks;
  track = syncRouteMotion(track, { path: LONG_ROUTE, pathIndex: tick * TILES_PER_TICK, lookaheadPathNodes: TILES_PER_TICK })!;
  expect(sampleRouteMotion(track).location).toEqual(beforeGap);
  const frameMs = 1_000 / PHONE_ACTIVE_FPS;
  const normalStep = TRAVEL_PER_SECOND * frameMs / 1_000;
  let peak = 0;
  for (let frame = 0; frame < PULSES * PHONE_ACTIVE_FPS; frame++) {
    if (frame > 0 && frame % PHONE_ACTIVE_FPS === 0) {
      tick++;
      track = syncRouteMotion(track, { path: LONG_ROUTE, pathIndex: tick * TILES_PER_TICK, lookaheadPathNodes: TILES_PER_TICK })!;
    }
    const step = routeMotionStepTiles(track, frameMs, TRAVEL_PER_SECOND);
    expect(step).toBeLessThanOrEqual(normalStep * ROUTE_CATCH_UP_MAX_MULTIPLIER + NUMERIC_EPSILON);
    const before = sampleRouteMotion(track).location;
    track = advanceRouteMotion(track, frameMs, TRAVEL_PER_SECOND);
    const after = sampleRouteMotion(track).location;
    const distance = Math.hypot(after.x - before.x, after.y - before.y);
    peak = Math.max(peak, distance / normalStep);
    expect(distance).toBeLessThanOrEqual(normalStep * ROUTE_CATCH_UP_MAX_MULTIPLIER + NUMERIC_EPSILON);
  }
  expect(peak).toBeCloseTo(ROUTE_CATCH_UP_MAX_MULTIPLIER, 10);
  expect(peak).toBeGreaterThan(1); // A stationary/never-catching-up sample cannot pass.
});
