import { afterEach, describe, expect, it, vi } from "vitest";
const visual = vi.hoisted(() => ({ enabled: true }));
vi.mock("../src/inspection-presentation", async importOriginal => {
  const original = await importOriginal<typeof import("../src/inspection-presentation")>();
  return { ...original, advanceInspectionPresentation: (...args: Parameters<typeof original.advanceInspectionPresentation>) => {
    if (visual.enabled) original.advanceInspectionPresentation(...args);
  } };
});
import { advanceInspectionPresentation, createInitialGameState, createFacilityInspectionRun, deserializeGameState,
  gameReducer, INSPECTOR_CHARACTER_STILLS, isSafeInspectionObservationPoint, PATIENT_CHARACTER_STILLS,
  STAFF_CHARACTER_STILLS, serializeGameState, staffStillEligibleEntries, inspectionPresentationNavigationSummary, type GameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { APPROVED_LEVEL5_SUPPORT_NAVIGATION, APPROVED_ROOM_NAVIGATION_CONTRACTS } from "@gamify-surgery/balance-config";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const context = createLevelFiveStateQaContext();
const blankLane = () => ({ version: "inspection-presentation.v1" as const, runId: null, seed: null, actors: [] });
const tick = (state: GameState, id: string) => gameReducer(state, { type: "ADVANCE_TICK", operationId: id }, context);
const withoutPresentation = (state: GameState) => { const copy = structuredClone(state); if (copy.levelFive) copy.levelFive.inspectionPresentation = blankLane(); return copy; };
afterEach(() => { visual.enabled = true; });

describe("Level 5 M7b inspection actors", () => {
  it("keeps all ten inspector looks out of every employee and patient pool", () => {
    expect(INSPECTOR_CHARACTER_STILLS).toHaveLength(10);
    expect(new Set(INSPECTOR_CHARACTER_STILLS.map(row => row.stillId)).size).toBe(10);
    expect(PATIENT_CHARACTER_STILLS).toHaveLength(179); expect(STAFF_CHARACTER_STILLS).toHaveLength(99);
    for (const role of [...context.balanceRelease.facility.staffRoleDefinitions.map(role => role.id), "staff.inspector", "inspection-agent"])
      expect(staffStillEligibleEntries(role).some(row => row.stillId.startsWith("inspector-v6f"))).toBe(false);
  });

  it("is a no-op outside Level 5 and while locked, ready or preparing", () => {
    for (const state of [createInitialGameState(), createLevelFiveStateQaState("pre-goal", context),
      createLevelFiveStateQaState("inspection-ready", context), createLevelFiveStateQaState("preparing", context)]) {
      const before = serializeGameState(state); advanceInspectionPresentation(state, context);
      expect(serializeGameState(state)).toBe(before);
    }
    const old = createInitialGameState(); const loaded = deserializeGameState(serializeGameState(old));
    expect(loaded.levelFive).toBeUndefined(); expect(serializeGameState(loaded)).not.toContain('"levelFive"');
  });

  it("arrives, spreads through actual doors, observes for five minutes and visits new rooms", () => {
    let state = createLevelFiveStateQaState("inspectors-arriving", context);
    const actors = state.levelFive!.inspectionPresentation.actors;
    expect(actors.map(actor => actor.stillId)).toEqual(INSPECTOR_CHARACTER_STILLS.map(row => row.stillId));
    expect(new Set(actors.map(actor => `${actor.location.x},${actor.location.y}`)).size).toBe(10);
    const runId = state.levelFive!.inspection.run!.id;
    const targets = new Map<string, Set<string>>(), observed = new Set<string>();
    state.paused = false;
    for (let minute = 0; minute < 180; minute++) {
      state = tick(state, `m7b.travel.${minute}`);
      for (const actor of state.levelFive!.inspectionPresentation.actors) {
        expect(actor.path[actor.pathIndex]).toEqual(actor.location);
        expect(actor.path.every(point => Number.isFinite(point.x) && Number.isFinite(point.y))).toBe(true);
        if (actor.targetRoomInstanceId) { const set = targets.get(actor.id) ?? new Set(); set.add(actor.targetRoomInstanceId); targets.set(actor.id, set); }
        if (actor.phase === "observing") {
          expect(isSafeInspectionObservationPoint(state, actor.location, context)).toBe(true);
          observed.add(actor.id);
          expect(actor.observingUntilFacilityTick! - actor.lastMovedAtFacilityTick).toBe(5);
        }
      }
    }
    expect(observed.size).toBe(10);
    expect([...targets.values()].every(rooms => rooms.size > 1)).toBe(true);
    expect(new Set([...targets.values()].flatMap(rooms => [...rooms])).size).toBeGreaterThanOrEqual(9);
    expect(state.levelFive!.inspectionPresentation.runId).toBe(runId);
    expect(state.levelFive!.inspection.run!.accumulators.observedActiveMinutes).toBe(180);
    expect(state.employees).toHaveLength(1); expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(10);
  }, hostedTime(30_000));

  it("freezes with pause and preserves every identity, route cursor and observation clock on reload", () => {
    const state = createLevelFiveStateQaState("inspectors", context);
    const paused = tick(state, "m7b.pause.tick");
    expect(paused.facilityTick).toBe(state.facilityTick);
    expect(paused.levelFive!.inspectionPresentation).toEqual(state.levelFive!.inspectionPresentation);
    const loaded = deserializeGameState(serializeGameState(state), context);
    expect(loaded.levelFive!.inspectionPresentation).toEqual(state.levelFive!.inspectionPresentation);
    loaded.paused = false;
    const next = tick(loaded, "m7b.resume");
    expect(next.levelFive!.inspectionPresentation.actors.map(actor => actor.id)).toEqual(state.levelFive!.inspectionPresentation.actors.map(actor => actor.id));
  });

  it("keeps every location and continuous path clear of fixtures and necessary contacts for the full 3000-minute inspection", () => {
    let state = createLevelFiveStateQaState("inspectors-arriving", context); state.paused = false;
    const rooms = state.rooms.map(room => {
      const def = context.balanceRelease.facility.roomDefinitions.find(row => row.id === room.roomDefinitionId)!;
      expect(room.orientation).toBe(0);
      const solids = (APPROVED_ROOM_NAVIGATION_CONTRACTS[def.id]?.solidFixtures ?? []).filter(fixture =>
        !fixture.hiddenByDoorSlots?.some(slot => state.doors.some(door => door.roomId === room.id && door.side === slot.side && door.offset === slot.offset)))
        .flatMap(fixture => [fixture.footprint, ...(fixture.navigationFootprint ? [fixture.navigationFootprint] : [])]);
      const contacts = [def.navigation?.primaryAnchor, def.navigation?.staffAnchor, def.navigation?.patientCareAnchor,
        def.navigation?.clinicianCareAnchor, def.navigation?.sharedStaffAnchor, ...(def.navigation?.waitingAnchors ?? []),
        ...(def.navigation?.standingWaitingAnchors ?? []), ...(def.navigation?.endpointOnlyTiles ?? []),
        ...(def.navigation?.companionSeats ?? []).map(seat => seat.anchor), ...(def.navigation?.careStations ?? []).map(station => station.patientAnchor)]
        .filter(point => Boolean(point)).map(point => ({ x: point!.x + .5, y: point!.y + .5 }));
      contacts.push(...(APPROVED_LEVEL5_SUPPORT_NAVIGATION[def.id] ?? []).map(support => support.standingApproach));
      return { room, def, solids, contacts };
    });
    const violations: string[] = [], routes = new Map<string, string>(), observedRooms = new Set<string>();
    let locations = 0, pathSamples = 0, stops = 0;
    const check = (point: { x: number; y: number }, radius: number, contactRadius: number, note: string) => {
      for (const { room, def, solids, contacts } of rooms) {
        const x = point.x + .5 - room.x, y = point.y + .5 - room.y;
        if (x < 0 || y < 0 || x > def.width || y > def.height) continue;
        for (const box of solids) {
          const gap = Math.hypot(Math.max(box.left - x, 0, x - box.left - box.width), Math.max(box.top - y, 0, y - box.top - box.height));
          if (gap < radius - .000001 && violations.length < 10) violations.push(`${note}: ${def.id} fixture clearance ${gap} at ${x},${y}`);
        }
        for (const contact of contacts) if (Math.hypot(x - contact.x, y - contact.y) < contactRadius - .000001 && violations.length < 10)
          violations.push(`${note}: ${def.id} necessary contact at ${x},${y}`);
      }
    };
    for (let minute = 0; minute < 3000; minute++) {
      for (const actor of state.levelFive!.inspectionPresentation.actors) {
        check(actor.location, .18, .18, `minute ${minute}, ${actor.stillId}`); locations++;
        if (actor.phase === "observing") {
          check(actor.location, .30, .55, `stop ${minute}, ${actor.stillId}`); stops++;
          observedRooms.add(actor.targetRoomInstanceId!);
        }
        const stamp = JSON.stringify(actor.path);
        if (routes.get(actor.id) === stamp) continue;
        routes.set(actor.id, stamp);
        for (let i = 1; i < actor.path.length; i++) {
          const a = actor.path[i - 1]!, b = actor.path[i]!;
          expect(Math.abs(a.x - b.x) < .000001 || Math.abs(a.y - b.y) < .000001).toBe(true);
          const count = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / .025));
          for (let j = 0; j <= count; j++) {
            check({ x: a.x + (b.x - a.x) * j / count, y: a.y + (b.y - a.y) * j / count }, .18, .18, `path ${minute}, ${actor.stillId}`); pathSamples++;
          }
        }
      }
      if (violations.length) break;
      state = tick(state, `m7b.geometry.${minute}`);
      if (minute === 1500) state = deserializeGameState(serializeGameState(state), context);
    }
    expect(violations).toEqual([]);
    expect(locations).toBe(30000); expect(pathSamples).toBeGreaterThan(100000); expect(stops).toBeGreaterThan(1000);
    expect(observedRooms.size).toBeGreaterThanOrEqual(9);
    expect(state.levelFive!.inspection.lastReport!.observedActiveMinutes).toBe(3000);
    expect(state.levelFive!.inspection.status).toBe("incomplete"); expect(state.levelFive!.inspectionPresentation).toEqual(blankLane());
  }, hostedTime(60_000));

  it("loads a pre-fix inspector hold unchanged, then leaves the necessary Gift Shop contact using only clear floor", () => {
    const state = createLevelFiveStateQaState("inspectors", context), gift = state.rooms.find(room => room.roomDefinitionId === "room.gift_shop")!;
    const actor = state.levelFive!.inspectionPresentation.actors[0]!;
    actor.location = { x: gift.x + .65 - .5, y: gift.y + 1 - .5 }; actor.path = [{ ...actor.location }]; actor.pathIndex = 0;
    actor.phase = "observing"; actor.targetRoomInstanceId = gift.id; actor.observingUntilFacilityTick = state.facilityTick + 5;
    const loaded = deserializeGameState(serializeGameState(state), context);
    expect(loaded.levelFive!.inspectionPresentation).toEqual(state.levelFive!.inspectionPresentation);
    const protectedBefore = withoutPresentation(loaded); advanceInspectionPresentation(loaded, context);
    expect(withoutPresentation(loaded)).toEqual(protectedBefore);
    const fixed = loaded.levelFive!.inspectionPresentation.actors[0]!;
    expect(fixed.id).toBe(actor.id); expect(fixed.location).not.toEqual(actor.location);
    expect(fixed.phase).not.toBe("stationary"); expect(isSafeInspectionObservationPoint(loaded, fixed.path.at(-1)!, context)).toBe(true);
    for (const point of fixed.path) if (point.x + .5 >= gift.x && point.x + .5 <= gift.x + 3 && point.y + .5 >= gift.y && point.y + .5 <= gift.y + 3)
      expect(Math.hypot(point.x + .5 - gift.x - .625, point.y + .5 - gift.y - 1)).toBeGreaterThanOrEqual(.18 - .000001);
  });

  it("seeds clean presentation QA floors without disabling ordinary gameplay litter", () => {
    for (const scenario of ["inspectors", "inspectors-arriving"] as const) {
      let state = createLevelFiveStateQaState(scenario, context);
      expect(state.environment.litterItems).toEqual([]);
      expect(state.environment.nextLitterSpawnTick).toBeGreaterThan(state.levelFive!.inspection.run!.endsAtFacilityTick);
      state.environment.nextLitterSpawnTick = state.facilityTick + 1; state.paused = false;
      state = tick(state, `m7b.litter.${scenario}`);
      expect(state.environment.litterItems).toHaveLength(1);
    }
  });

  it("clears the team on cancel and on the real incomplete final-minute boundary", () => {
    let state = createLevelFiveStateQaState("inspectors", context);
    const cancelled = gameReducer(state, { type: "CANCEL_INSPECTION", operationId: "m7b.cancel" }, context);
    expect(cancelled.levelFive!.inspectionPresentation).toEqual(blankLane());
    expect(cancelled.levelFive!.inspection.status).toBe("cancelled"); expect(cancelled.levelFive!.progress.gameFinished).toBeNull();
    // Explicit clock/evidence boundary fixture; the final minute still uses the real observer.
    state = structuredClone(state); state.paused = false;
    const run = state.levelFive!.inspection.run!;
    state.facilityTick = run.endsAtFacilityTick - 1; run.lastObservedAtFacilityTick = state.facilityTick;
    run.accumulators.observedActiveMinutes = 2999;
    state = tick(state, "m7b.incomplete.last");
    expect(state.levelFive!.inspection.status).toBe("incomplete"); expect(state.levelFive!.inspectionPresentation).toEqual(blankLane());
    expect(state.levelFive!.progress.gameFinished).toBeNull();
  });

  it("isolates presentation from exact scored case selection, arrivals, reservations, costs, clock and report evidence", () => {
    let on = createLevelFiveStateQaState("inspectors-arriving", context);
    on.paused = false; on.nextRoutineArrivalTick = on.facilityTick + 1;
    let off = withoutPresentation(on);
    for (let minute = 0; minute < 150; minute++) {
      const id = `m7b.rng.${minute}`;
      visual.enabled = true; on = tick(on, id);
      visual.enabled = false; off = tick(off, id);
      expect(withoutPresentation(on)).toEqual(withoutPresentation(off));
      if (minute === 70) {
        on = deserializeGameState(serializeGameState(on), context);
        off = deserializeGameState(serializeGameState(off), context);
      }
    }
    expect(on.nextRoutineArrivalTick).toBe(off.nextRoutineArrivalTick);
    expect(Object.keys(on.encounters).length).toBeGreaterThan(0);
    expect(on.levelFive!.inspection.run!.accumulators).toEqual(off.levelFive!.inspection.run!.accumulators);
  }, hostedTime(30_000));

  it("holds truthfully when room access disappears and never reserves a door or care contact", () => {
    let state = createLevelFiveStateQaState("inspectors", context);
    const protectedBefore = withoutPresentation(state);
    advanceInspectionPresentation(state, context); expect(withoutPresentation(state)).toEqual(protectedBefore);
    const before = structuredClone(state.levelFive!.inspectionPresentation.actors);
    // Close every non-exterior door only in this explicit route-failure fixture.
    state.doors = state.doors.filter(door => door.exterior); state.paused = false;
    for (let minute = 0; minute < 7; minute++) state = tick(state, `m7b.blocked.${minute}`);
    for (const actor of state.levelFive!.inspectionPresentation.actors) {
      const old = before.find(row => row.id === actor.id)!;
      if (old.phase === "observing") {
        expect(actor.targetRoomInstanceId).toBe(old.targetRoomInstanceId);
        const room = state.rooms.find(room => room.id === old.targetRoomInstanceId)!;
        const def = context.balanceRelease.facility.roomDefinitions.find(def => def.id === room.roomDefinitionId)!;
        for (const point of actor.path) expect(point.x + .5 >= room.x && point.x + .5 <= room.x + def.width &&
          point.y + .5 >= room.y && point.y + .5 <= room.y + def.height).toBe(true);
      }
    }
    expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(10);
    expect(state.employees.some(employee => employee.id.startsWith("inspector."))).toBe(false);
    expect(state.levelFive!.inspection.run!.accumulators.observedActiveMinutes).toBe(87);
  });

  it("uses distinct aisle holds and keeps circulating safely when only the Front Desk exists", () => {
    let state = createLevelFiveStateQaState("inspectors-arriving", context);
    const front = state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
    state.rooms = [front]; state.doors = state.doors.filter(door => door.roomId === front.id);
    state.levelFive!.inspectionPresentation = blankLane(); state.paused = false;
    const circulated = new Set<string>();
    for (let minute = 0; minute < 40; minute++) {
      const previous = state.levelFive!.inspectionPresentation.actors;
      state = tick(state, `m7b.small.${minute}`);
      for (const actor of state.levelFive!.inspectionPresentation.actors) {
        const old = previous.find(row => row.id === actor.id);
        if (old && Math.hypot(old.location.x - actor.location.x, old.location.y - actor.location.y) > .000001) circulated.add(actor.id);
      }
    }
    const actors = state.levelFive!.inspectionPresentation.actors;
    expect(actors).toHaveLength(10); expect(actors.every(actor => actor.targetRoomInstanceId === front.id)).toBe(true);
    expect(new Set(actors.map(actor => JSON.stringify(actor.path.at(-1)))).size).toBe(10);
    expect(circulated.size).toBe(10);
    expect(actors.every(actor => actor.phase !== "stationary")).toBe(true);
  });

  it("retains safe standing circulation at all 66 prestige-room door segments, including Executive N2/S2", () => {
    const seed = createLevelFiveStateQaState("inspectors-arriving", context);
    const front = { ...seed.rooms.find(room => room.roomDefinitionId === "room.front_desk")!, x: 10, y: 10 };
    let checked = 0;
    for (const room of seed.rooms.filter(room => room.roomDefinitionId.startsWith("room.") &&
      ["room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym"].includes(room.roomDefinitionId))) {
      const def = context.balanceRelease.facility.roomDefinitions.find(row => row.id === room.roomDefinitionId)!;
      const placed = { ...room, x: 20, y: 10 }, hallways: GameState["rooms"] = [];
      const points = new Set<string>();
      const hall = (x: number, y: number) => { const key = `${x},${y}`; if (!points.has(key)) {
        points.add(key); hallways.push({ id: `hall.m7b.${key}`, roomDefinitionId: "room.hallway", x, y, orientation: 0, doorSide: null, upgradeLevel: 1 });
      } };
      for (let x = 10; x <= 20 + def.width; x++) hall(x, 9);
      for (let x = 19; x <= 20 + def.width; x++) hall(x, 10 + def.height);
      for (let y = 10; y < 10 + def.height; y++) { hall(19, y); hall(20 + def.width, y); }
      for (const side of ["north", "south", "east", "west"] as const) for (let offset = 0; offset < (side === "north" || side === "south" ? def.width : def.height); offset++) {
        const state = structuredClone(seed); state.rooms = [front, placed, ...hallways];
        state.doors = [{ id: "m7b.exterior", roomId: front.id, side: "south", offset: 2, exterior: true },
          { id: "m7b.front.hall", roomId: front.id, side: "north", offset: 0, exterior: false },
          { id: `m7b.test.${side}.${offset}`, roomId: placed.id, side, offset, exterior: false }];
        const navigation = inspectionPresentationNavigationSummary(state, context);
        expect(navigation.rooms.find(row => row.id === placed.id)!.reachableStops, `${def.id} ${side} ${offset}`).toBeGreaterThan(0);
        checked++;
      }
    }
    expect(checked).toBe(66);
  }, hostedTime(30_000));
});
