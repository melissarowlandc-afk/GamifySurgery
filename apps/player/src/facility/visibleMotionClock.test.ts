import { afterEach, describe, expect, it, vi } from "vitest";
import { findDeterministicFacilityPath, getDoorCells, getRoomCareAnchor, getRoomDefinition, getRoomNavigationAnchor, serializeGameState } from "@gamify-surgery/game-domain";
import { act } from "react";
import { CloudCacheError } from "../session/cloud/codecCache";
import { createPediatricChartsQaState } from "../../../../tests/fixtures/pediatric-charts";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPrototypePlayerView } from "../session/viewModels";
import { motionFixture, ACTIVE_SECONDS, EPSILON, MOTION_KEY, TICK_MS, TILES, pointOnSegments, type MotionFixture } from "./visibleMotionClock.fixture";
import { ROUTE_CATCH_UP_START_TILES, ROUTE_CATCH_UP_GAIN_PER_TILE, ROUTE_CATCH_UP_MAX_MULTIPLIER, sampleRouteMotion } from "./routeMotion";
import { CHARACTER_HOP, characterHopStrideTiles } from "./characterHopMotion";
import { FACILITY_CLOCK_STALL_MS } from "../session/facilityClock";

vi.mock("phaser", async () => ({ default: (await import("./visibleMotionPhaser.fixture")).motionPhaserNamespace() }));

let live: MotionFixture | undefined;
afterEach(async () => { if (live) await live.dispose(); live = undefined; vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });
const setup = async (options: Parameters<typeof motionFixture>[0] = {}) => live = await motionFixture(options);
const warm = async (f: MotionFixture) => f.frames(f.game.loop.panicMax + f.game.loop.deltaSmoothingMax);
const snapshot = (f: MotionFixture) => ({ track: structuredClone(f.track()), draw: structuredClone(f.drawn()),
  hop: structuredClone(f.scene.characterHopStates.get(MOTION_KEY)), seat: structuredClone(f.scene.characterSeatSettles.get(MOTION_KEY)) });
const pose = (f: MotionFixture) => {
  const { frozen: _frozen, ...draw } = f.drawn();
  const seat = structuredClone(f.scene.characterSeatSettles.get(MOTION_KEY));
  // Actual scene drawing registers its contact at Math.round pixels. Preserve
  // exact hop/settle phases; ignore only invisible IEEE -0/round-trip ULPs.
  if (seat) seat.drawn = { x: seat.drawn.x + 0, y: seat.drawn.y + 0 };
  return { ...draw, centerX: Math.round(draw.centerX), baseY: Math.round(draw.baseY),
    hop: structuredClone(f.scene.characterHopStates.get(MOTION_KEY)), seat };
};

async function pace(f: MotionFixture, fps: number, seconds = ACTIVE_SECONDS) {
  const start = f.progress(), tick = f.current().state.facilityTick, time = performance.now(), updates = f.game.updates;
  const drawnStart = f.scene.characterMotionSnapshots.get(MOTION_KEY).anchorXInTiles;
  let distance = 0, maxStep = 0, stationary = 0, maxStationaryMs = 0, compacted = false;
  for (let frame = 0; frame < fps * seconds; frame++) {
    const before = f.progress(); await f.advance(time + (frame + 1) * 1_000 / fps - performance.now());
    const track = f.track()!, step = f.progress() - before;
    expect(track, "A live route must actually pass through FacilityScene/Systems").toBeDefined();
    expect(track.lastObservedPathIndex).toBe(f.current().state.facilityTick * TILES);
    expect(track.progress).toBeLessThanOrEqual(track.targetIndex + EPSILON);
    // Released routeMotion permits two logical intervals of known lookahead.
    expect(track.targetIndex - track.sourceOffset).toBeLessThanOrEqual(f.current().state.facilityTick * TILES + 2 * TILES + EPSILON);
    const drawnContact = f.scene.characterMotionSnapshots.get(MOTION_KEY).anchorXInTiles - .5;
    expect(Math.abs(drawnContact - sampleRouteMotion(track).location.x), "Actual drawn floor contact remains on its route within the production hop stride")
      .toBeLessThanOrEqual(characterHopStrideTiles(f.speed) * CHARACTER_HOP.plant + EPSILON);
    expect(step).toBeGreaterThanOrEqual(-EPSILON);
    distance += step; maxStep = Math.max(maxStep, step);
    compacted ||= track.sourceOffset < 0;
    stationary = step <= EPSILON ? stationary + 1_000 / fps : 0;
    maxStationaryMs = Math.max(maxStationaryMs, stationary);
  }
  const elapsedSeconds = (performance.now() - time) / 1_000;
  const canonicalTiles = f.speed * elapsedSeconds;
  const result = { fps, speed: f.current().state.simulationSpeed, elapsedSeconds, ticks: f.current().state.facilityTick - tick,
    updates: f.game.updates - updates, distance, progressDelta: f.progress() - start, canonicalTiles,
    drawnTiles: f.scene.characterMotionSnapshots.get(MOTION_KEY).anchorXInTiles - drawnStart,
    ratio: distance / canonicalTiles, maxStep, maxStationaryMs, compacted };
  expect(result.updates).toBeGreaterThan(0);
  expect(result.compacted).toBe(true);
  expect(result.elapsedSeconds).toBeCloseTo(seconds, 6);
  expect(Math.abs(result.ticks - seconds * f.current().state.simulationSpeed * 1_000 / TICK_MS), JSON.stringify({
    ...result, paused: f.current().state.paused, sync: f.session.syncView,
  })).toBeLessThanOrEqual(1);
  return result;
}

describe("B-012 part 2 / M1 visible motion clock", () => {
  for (const speed of [1, 2] as const) for (const fps of [60, 18, 10, 1]) for (const blurred of [false, true]) {
    it(`B-012 walks at canonical ${speed}x wall pace at ${fps} fps, visible ${blurred ? "blurred" : "focused"}, without changing facility minutes`, async () => {
      const f = await setup({ speed }); await warm(f);
      if (blurred) await f.event("blur");
      expect(document.visibilityState).toBe("visible"); expect(document.hidden).toBe(false);
      expect(f.game.loop.inFocus).toBe(!blurred); // Installed VisibilityHandler -> native Game -> TimeStep.
      const result = await pace(f, fps);
      console.info("B012_M1_PACE", JSON.stringify({ ...result, blurred }));
      // The design permits +/-5%; expected tiles/second comes from the actual
      // fixture balance, speed and eligible monotonic elapsed time.
      expect.soft(Math.abs(result.distance - result.canonicalTiles), JSON.stringify(result)).toBeLessThanOrEqual(result.canonicalTiles * .05 + EPSILON);
      expect.soft(Math.abs(result.drawnTiles - result.canonicalTiles), "The real scene's drawn world-tile contact must keep wall-clock pace, including the hop presentation")
        .toBeLessThanOrEqual(result.canonicalTiles * .05 + EPSILON);
      expect.soft(result.maxStationaryMs, "No continuing-route target starvation >=100ms").toBeLessThan(100);
      expect.soft(result.maxStep).toBeLessThanOrEqual(f.speed / fps * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
      await f.event("focus");
      for (let frame = 0; frame < f.game.loop.panicMax; frame++) {
        const before = f.progress(); await f.advance(1_000 / 60);
        expect(f.progress() - before, "Regaining focus cannot burst beyond the released catch-up cap").toBeLessThanOrEqual(f.speed / 60 * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
      }
      expect(ROUTE_CATCH_UP_MAX_MULTIPLIER).toBeLessThanOrEqual(2.5);
    }, 120_000);
  }

  it("B-012 clock diagnostic: 1.5-second timer delivery loses facility minutes independently of drawing", async () => {
    const f = await setup({ timerSlowdown: 1.5 }); await warm(f);
    const tick = f.current().state.facilityTick;
    await f.frames(ACTIVE_SECONDS, 1);
    expect(Math.abs(f.current().state.facilityTick - tick - ACTIVE_SECONDS / 1.5)).toBeLessThanOrEqual(1);
  });

  it("B-012 authority control: an in-flight player command keeps clock pulses behind the real admission fence", async () => {
    const f = await setup(); await warm(f);
    const port = f.ports[0]!.inner, tick = f.current().state.facilityTick;
    port.auto = false;
    await act(async () => { f.current().setSimulationSpeed(2); await Promise.resolve(); });
    const commands = port.messages.filter(message => message.kind === "command").length;
    await f.advance(2 * TICK_MS, false, false); // Deliberately held transport, not a slow/failed disk.
    expect(f.current().state.facilityTick).toBe(tick);
    expect(port.messages.filter(message => message.kind === "command")).toHaveLength(commands);
    port.auto = true; while (port.waiting.length) port.next(); await act(async () => { await f.idle(); });
    expect(f.current().state.simulationSpeed).toBe(2);
    expect(f.current().state.facilityTick).toBe(tick);
  });

  it("B-012 authority control: a genuinely refused checkpoint cannot be bypassed by presentation or clock", async () => {
    const f = await setup(); await warm(f);
    vi.spyOn(f.cache, "write").mockRejectedValue(new CloudCacheError("quota"));
    await act(async () => { expect(await f.session.checkpointNow("purchase")).toBe(false); });
    expect(f.session.canExecute).toBe(false);
    const tick = f.current().state.facilityTick;
    await f.advance(2 * TICK_MS);
    expect(f.current().state.facilityTick).toBe(tick);
    expect(f.session.syncView.failure).toBe("storage");
  });

  for (const mode of ["paused", "Build Mode"] as const) {
    it(`B-012 lifecycle control freezes the exact mid-hop pose and seat phase in ${mode}, then resumes normally`, async () => {
      const f = await setup(); await warm(f);
      for (let frame = 0; frame < 60 && !(f.drawn().motion.lift > 0); frame++) await f.advance(1_000 / 60);
      expect(f.drawn().motion.lift).toBeGreaterThan(0);
      await f.action(session => mode === "paused" ? session.togglePause() : session.enterBuildMode());
      await f.advance(1_000 / 60);
      const frozen = pose(f), state = f.serialized();
      for (let hold = 0; hold < 3; hold++) { await f.advance(FACILITY_CLOCK_STALL_MS); expect(pose(f)).toEqual(frozen); }
      expect(f.serialized()).toBe(state);
      await f.action(session => mode === "paused" ? session.togglePause() : session.exitBuildMode());
      await f.advance(FACILITY_CLOCK_STALL_MS);
      expect(pose(f)).toEqual(frozen); // Released first observed resume frame discards stale delta.
      await warm(f); const result = await pace(f, 60);
      expect(Math.abs(result.distance - result.canonicalTiles)).toBeLessThanOrEqual(result.canonicalTiles * .05 + EPSILON);
    }, 120_000);
  }

  it("B-012 lifecycle control fences rapid pause/unpause with no intervening drawn frame", async () => {
    const f = await setup(); await warm(f);
    await f.action(session => session.togglePause());
    const before = f.progress(), tick = f.current().state.facilityTick;
    await f.advance(FACILITY_CLOCK_STALL_MS, false);
    expect(f.current().state.facilityTick).toBe(tick);
    await f.action(session => session.togglePause()); await f.advance(1_000 / 60);
    expect(f.progress() - before).toBeLessThanOrEqual(f.speed / 60 * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
  });

  for (const event of ["visibilitychange", "pagehide", "freeze"]) for (const omittedForeground of [false, true]) {
    it(`B-012 lifecycle control spends no hidden time after ${event}, foreground event ${omittedForeground ? "omitted" : "delivered"}`, async () => {
      const f = await setup(); await warm(f);
      const before = f.progress(), tick = f.current().state.facilityTick;
      await f.event(event, true);
      await f.advance(ACTIVE_SECONDS * 1_000, false);
      expect(f.current().state.facilityTick).toBe(tick); expect(f.progress()).toBe(before);
      if (omittedForeground) Object.assign(f.env.doc, { visibilityState: "visible" });
      else await f.event("visibilitychange", false);
      await f.advance(1_000 / 60);
      expect(f.progress() - before).toBeLessThanOrEqual(f.speed / 60 * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
      if (!f.session.canExecute) {
        // Missing foreground events may correctly leave the account's writer
        // lease expired. M1 must not bypass that fence to manufacture pace.
        expect(f.session.syncView.canExecute).toBe(false);
        await f.event("focus");
        if (f.current().state.paused) await f.action(session => session.togglePause());
      }
      expect(f.session.canExecute).toBe(true);
      await warm(f);
      const result = await pace(f, 60);
      expect(Math.abs(result.distance - result.canonicalTiles)).toBeLessThanOrEqual(result.canonicalTiles * .05 + EPSILON);
    }, 120_000);
  }

  it("B-012 phone control sleeps a covered map while visible simulation continues; reveal starts at current authority", async () => {
    const f = await setup({ mobile: true }); await warm(f);
    f.presentation.covered = true; await f.render();
    expect(document.visibilityState).toBe("visible"); expect(f.game.loop.running).toBe(false);
    const tick = f.current().state.facilityTick, updates = f.game.updates;
    for (let second = 0; second < ACTIVE_SECONDS; second++) await f.advance(1_000, false);
    expect(f.current().state.facilityTick - tick).toBe(ACTIVE_SECONDS);
    expect(f.game.updates).toBe(updates);
    f.presentation.covered = false; await f.render(); await f.advance(1_000 / 60);
    // Cover is a presentation sleep, so the documented phone resync uses the
    // current authoritative sample instead of replaying its covered tail.
    if (f.game.updates === updates) await f.advance(1_000 / 60);
    expect(f.progress()).toBe(f.current().state.facilityTick * TILES);
    expect(f.game.loop.running).toBe(true);
    const visibleTick = f.current().state.facilityTick;
    await f.event("visibilitychange", true);
    expect(f.game.loop.running).toBe(false);
    await f.advance(ACTIVE_SECONDS * 1_000, false);
    expect(f.current().state.facilityTick).toBe(visibleTick);
    await f.event("visibilitychange", false); await f.advance(1_000 / 30);
    expect(f.progress()).toBe(f.current().state.facilityTick * TILES);
  }, 120_000);

  it("B-012 local hidden-tab control remains paused until the player's explicit Resume", async () => {
    const f = await setup({ local: true }); await warm(f);
    await f.event("visibilitychange", true);
    expect(f.current().state.paused).toBe(true);
    const tick = f.current().state.facilityTick, before = f.progress();
    await f.advance(ACTIVE_SECONDS * 1_000, false);
    expect(f.current().state.facilityTick).toBe(tick);
    await f.event("visibilitychange", false); await f.advance(FACILITY_CLOCK_STALL_MS);
    expect(f.current().state.paused).toBe(true); expect(f.progress()).toBe(before);
    await f.action(session => session.togglePause()); await f.advance(1_000 / 60);
    expect(f.progress() - before).toBeLessThanOrEqual(f.speed / 60 * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
    await warm(f); const result = await pace(f, 60);
    expect(Math.abs(result.distance - result.canonicalTiles)).toBeLessThanOrEqual(result.canonicalTiles * .05 + EPSILON);
  }, 120_000);

  it("B-012 scene frames cannot create ticks, commands, save writes or mutate the durable route", async () => {
    const f = await setup(); await warm(f);
    const state = f.serialized(), commands = f.ports.flatMap(port => port.inner.messages).filter(row => row.kind === "command").length;
    const append = vi.spyOn(f.cache.journal!, "append"), writes = vi.spyOn(f.cache, "write");
    // Redraw repeatedly at the SAME monotonic instant: no timer callbacks.
    for (let frame = 0; frame < 60; frame++) await f.advance(0);
    expect(f.serialized()).toBe(state);
    expect(f.ports.flatMap(port => port.inner.messages).filter(row => row.kind === "command")).toHaveLength(commands);
    expect(append).not.toHaveBeenCalled(); expect(writes).not.toHaveBeenCalled();
    expect(serializeGameState(f.session.state)).toBe(state);
  });

  it("B-012 route control preserves corners, replacement/reversal, known targets and finished endpoints", async () => {
    const f = await setup();
    const context = createLevelFourRoomsQaContext(), state = createPediatricChartsQaState(context);
    const room = state.rooms.find(room => room.id === "room.peds.exam")!;
    const definition = getRoomDefinition(room.roomDefinitionId, context)!, door = state.doors.find(door => door.roomId === room.id)!;
    const cells = getDoorCells(door, room, definition)!;
    const paths = state.rooms.filter(room => room.roomDefinitionId === "room.hallway").map(hall =>
      findDeterministicFacilityPath({ x: hall.x, y: hall.y }, getRoomCareAnchor(room, definition, "patient"), state.rooms, state.doors, id => getRoomDefinition(id, context)));
    const turns = (path: typeof paths[number]) => path.some((point, index) => index > 0 && index < path.length - 1 &&
      (point.x - path[index - 1]!.x) * (path[index + 1]!.y - point.y) !==
      (point.y - path[index - 1]!.y) * (path[index + 1]!.x - point.x));
    const corner = paths.filter(path => path.length > 3 && turns(path)).sort((a, b) => a.length - b.length)[0]!;
    const view = createPrototypePlayerView(state, null, false, null).facility;
    f.presentation.rooms = view.rooms; f.presentation.doors = view.doors;
    expect(corner.length).toBeGreaterThan(3);
    expect(corner).toContainEqual(cells.outside); expect(corner).toContainEqual(cells.inside);
    expect(turns(corner)).toBe(true);
    f.presentation.path = corner; f.presentation.index = 0; await f.render(); await f.advance(1_000 / 60);
    for (let frame = 0; frame < 60; frame++) {
      await f.advance(1_000 / 60);
      expect(pointOnSegments(sampleRouteMotion(f.track()!).location, corner)).toBe(true);
      expect(f.track()!.progress).toBeLessThanOrEqual(f.track()!.targetIndex + EPSILON);
    }
    const before = sampleRouteMotion(f.track()!).location;
    const reverse = corner.slice(0, 4).reverse();
    f.presentation.path = reverse; f.presentation.index = 0; await f.render(); await f.advance(0);
    const handed = sampleRouteMotion(f.track()!).location;
    expect(Math.hypot(handed.x - before.x, handed.y - before.y)).toBeLessThanOrEqual(f.speed / 60 * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
    f.presentation.index = reverse.length - 1; f.presentation.moving = false; await f.render();
    for (let frame = 0; frame < 240; frame++) {
      await f.advance(1_000 / 60);
      expect(pointOnSegments(sampleRouteMotion(f.track()!).location, corner)).toBe(true);
    }
    const stopped = snapshot(f); await f.frames(60);
    expect(sampleRouteMotion(f.track()!).location).toEqual(reverse.at(-1));
    expect(f.progress()).toBe(stopped.track!.progress - stopped.track!.sourceOffset);
  });

  it("B-012 family-wait control retains repeated route nodes rather than deleting planned waiting time", async () => {
    const f = await setup();
    const hold = { x: 3, y: 4 };
    f.presentation.path = [{ x: 2, y: 4 }, hold, hold, hold, hold, { x: 4, y: 4 }, { x: 5, y: 4 }];
    f.presentation.index = 0; await f.render(); await f.advance(1_000 / 60);
    expect(f.track()!.path.filter(point => point.x === hold.x && point.y === hold.y).length).toBeGreaterThan(1);
    const seen: number[] = [];
    for (let frame = 0; frame < 60; frame++) { await f.advance(1_000 / 60); seen.push(sampleRouteMotion(f.track()!).location.x); }
    expect(seen.filter(x => Math.abs(x - hold.x) < EPSILON).length).toBeGreaterThan(0);
    expect(Math.max(...seen)).toBeLessThanOrEqual(hold.x + EPSILON);
    expect(characterHopStrideTiles(f.speed)).toBeGreaterThan(0);
    expect(f.drawn().motion.lift).toBeLessThanOrEqual(CHARACTER_HOP.liftHeight + EPSILON);
  });

  it("B-012 delayed-projection control retains genuine catch-up and the existing 2.5x/target ceilings", async () => {
    const f = await setup(); await warm(f);
    const startTick = f.current().state.facilityTick;
    f.presentation.index = startTick * TILES; await f.render();
    const missedTicks = Math.ceil((2 * TILES + ROUTE_CATCH_UP_START_TILES + (ROUTE_CATCH_UP_MAX_MULTIPLIER - 1) / ROUTE_CATCH_UP_GAIN_PER_TILE) / TILES) + 1;
    // Frames stay healthy while the authoritative route projection is late.
    await f.frames(missedTicks * 60);
    const before = f.progress(); f.presentation.index = undefined; await f.render();
    expect(f.progress()).toBe(before);
    let peak = 0;
    for (let frame = 0; frame < missedTicks * 60; frame++) {
      const previous = f.progress(); await f.advance(1_000 / 60);
      const ratio = (f.progress() - previous) / (f.speed / 60);
      peak = Math.max(peak, ratio);
      // Subtracting two world samples contributes two coordinate epsilons;
      // normalize that same allowance when comparing dimensionless rates.
      expect(ratio).toBeLessThanOrEqual(ROUTE_CATCH_UP_MAX_MULTIPLIER + 2 * EPSILON / (f.speed / 60));
      expect(f.track()!.progress).toBeLessThanOrEqual(f.track()!.targetIndex + EPSILON);
    }
    expect(peak).toBeGreaterThan(1);
    expect(Math.abs(peak - ROUTE_CATCH_UP_MAX_MULTIPLIER)).toBeLessThanOrEqual(2 * EPSILON / (f.speed / 60));
    expect(ROUTE_CATCH_UP_MAX_MULTIPLIER).toBeLessThanOrEqual(2.5);
  });

  it("B-012 campaign replacement never replays the old campaign's route or elapsed credit", async () => {
    const f = await setup(); await warm(f);
    f.presentation.campaignId = "campaign.public.motion-replacement";
    f.presentation.path = [{ x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }]; f.presentation.index = 0;
    const commands = f.ports.flatMap(port => port.inner.messages).length;
    await f.render(); await f.advance(0);
    const sample = sampleRouteMotion(f.track()!);
    expect(Math.hypot(sample.location.x - f.presentation.path[0]!.x, sample.location.y - f.presentation.path[0]!.y))
      .toBeLessThanOrEqual(f.speed / 60 * ROUTE_CATCH_UP_MAX_MULTIPLIER + EPSILON);
    expect(f.track()!.path.every(point => point.y === 7)).toBe(true);
    expect(f.ports.flatMap(port => port.inner.messages)).toHaveLength(commands);
  });

  it("B-012 seat control freezes a real furniture drop and resumes its remaining phase", async () => {
    const f = await setup();
    const front = f.current().state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
    const anchor = getRoomNavigationAnchor(front, getRoomDefinition(front.roomDefinitionId)!, "staff");
    f.presentation.path = [{ x: anchor.x + 1, y: anchor.y }, anchor]; f.presentation.index = 0;
    f.presentation.actor = { homeRoomInstanceId: front.id, staffRoleDefinitionId: "staff.receptionist", supportRole: "front-desk-staff" };
    await f.render(); await f.frames(10);
    f.presentation.index = 1; f.presentation.moving = false; await f.render();
    for (let i = 0; i < 60 && f.drawn()?.pose !== "seated"; i++) await f.advance(1_000 / 60);
    expect(f.drawn().pose).toBe("seated");
    expect(f.scene.characterSeatSettles.get(MOTION_KEY)?.pose).toBe("seated");
    expect(f.scene.characterHopStates.get(MOTION_KEY)?.walked).toBe(true);
    expect(f.drawn().motion.lift, "Exercise the real scene's post-walk furniture drop").toBeGreaterThan(0);
    await f.action(session => session.togglePause()); await f.advance(1_000 / 60);
    const frozen = pose(f); await f.advance(FACILITY_CLOCK_STALL_MS); expect(pose(f)).toEqual(frozen);
    await f.action(session => session.togglePause()); await f.advance(FACILITY_CLOCK_STALL_MS);
    expect(pose(f)).toEqual(frozen);
    await f.frames(60);
    expect(f.drawn().pose).toBe("seated");
    expect(f.scene.characterSeatSettles.get(MOTION_KEY).glide).toBeUndefined();
  });
});
