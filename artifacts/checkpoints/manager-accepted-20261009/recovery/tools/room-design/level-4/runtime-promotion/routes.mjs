import assert from "node:assert/strict";
import { APPROVED_LEVEL4_ROOM_NAVIGATION_CONTRACTS, APPROVED_LEVEL4_SUPPORT_NAVIGATION } from "../../../../packages/balance-config/src/approved-level4-room-layouts.ts";

// Export small world-coordinate routes beside the integer navigation contract.
// These are data for future actor binding, never a gameplay pathfinder change.
export function approvedApproachRoutes(room, routeClearances) {
  const nav = APPROVED_LEVEL4_ROOM_NAVIGATION_CONTRACTS[room.definitionId];
  assert(nav, `Write/review the navigation contract before promoting ${room.definitionId}`);
  const step = .05, radius = .18, width = nav.width, height = nav.height;
  const routes = [];
  for (const side of ["north", "east", "south", "west"]) for (let offset = 0; offset < width; offset++) {
    const segment = side === "north" ? `N${offset + 1}` : side === "south" ? `S${offset + 1}` : `${side === "west" ? "W" : "E"}${String.fromCharCode(65 + offset)}`;
    const x = side === "west" ? .2 : side === "east" ? width - .2 : offset + .5;
    const y = side === "north" ? .2 : side === "south" ? height - .2 : offset + .5;
    const threshold = { x: Math.floor(x), y: Math.floor(y) };
    const exception = nav.doorThresholdExceptions?.some((slot) => slot.side === side && slot.offset === offset);
    const blockers = nav.solidFixtures.filter((fixture) => !fixture.hiddenByDoorSlots?.some((slot) => slot.side === side && slot.offset === offset)
      && !(exception && fixture.blockedTiles.some((p) => p.x === threshold.x && p.y === threshold.y)))
      .map((fixture) => fixture.navigationFootprint ?? fixture.footprint);
    blockers.push(...routeClearances.filter((band) => !band.doorOwners.includes(segment)).map((band) => band.footprint));
    const clear = ([px, py]) => px >= radius && py >= radius && px <= width - radius && py <= height - radius && blockers.every((f) =>
      px <= f.left - radius + 1e-9 || px >= f.left + f.width + radius - 1e-9 || py <= f.top - radius + 1e-9 || py >= f.top + f.height + radius - 1e-9);
    const start = [Math.round(x / step), Math.round(y / step)], key = ([gx, gy]) => `${gx},${gy}`;
    const queue = [start], previous = new Map([[key(start), null]]);
    assert(clear([x, y]), `${room.definitionId} ${segment} threshold has no approved clearance`);
    for (let i = 0; i < queue.length; i++) {
      const [gx, gy] = queue[i];
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const next = [gx + dx, gy + dy], k = key(next);
        if (previous.has(k) || !clear(next.map((n) => n * step))) continue;
        previous.set(k, [gx, gy]); queue.push(next);
      }
    }
    for (const support of APPROVED_LEVEL4_SUPPORT_NAVIGATION[room.definitionId]) {
      if (support.hiddenByDoorSlots?.some((slot) => slot.side === side && slot.offset === offset)) continue;
      const end = [support.standingApproach.x, support.standingApproach.y], goal = end.map((n) => Math.round(n / step));
      assert(clear(end) && previous.has(key(goal)), `${room.definitionId} ${segment} -> ${support.id} has no approved fine route`);
      const dense = [];
      for (let p = goal; p; p = previous.get(key(p))) dense.unshift(p.map((n) => Number((n * step).toFixed(10))));
      const walkingPath = dense.filter((p, i) => i === 0 || i === dense.length - 1 || !(
        (dense[i - 1][0] === p[0] && p[0] === dense[i + 1][0]) || (dense[i - 1][1] === p[1] && p[1] === dense[i + 1][1])));
      if (walkingPath.at(-1).some((n, i) => Math.abs(n - end[i]) > 1e-9)) walkingPath.push(end);
      routes.push({ doorSegment: segment, supportId: support.id, standingApproach: support.standingApproach,
        walkingPath, actorRadius: radius, step, seatingTransition: "static-contact-after-walking" });
    }
  }
  return routes;
}
