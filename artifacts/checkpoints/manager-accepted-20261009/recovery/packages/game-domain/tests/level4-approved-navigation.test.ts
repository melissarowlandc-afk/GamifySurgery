import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  APPROVED_LEVEL4_ROOM_NAVIGATION_CONTRACTS, APPROVED_LEVEL4_SUPPORT_NAVIGATION,
  getApprovedRoomNavigation, isApprovedLevel4SupportEligible, PROTOTYPE_BALANCE_RELEASE,
  type ApprovedFloorFootprint, type ApprovedFloorPoint, type RoomDefinition,
} from "@gamify-surgery/balance-config";
import { findDeterministicFacilityPath, isRoomDoorThresholdProofNavigable } from "../src/spatial";
import type { DoorState, PlacedRoom } from "../src/types";

const slugs: Record<string, string> = {
  "room.mri": "mri", "room.pediatric_waiting": "pediatric-waiting",
  "room.pediatric_examination": "pediatric-exam", "room.wound_ostomy": "wound-ostomy",
};
const sides = ["north", "east", "south", "west"] as const;
const segment = (side: typeof sides[number], offset: number) =>
  side === "north" ? `N${offset + 1}` : side === "south" ? `S${offset + 1}` : `${side === "west" ? "W" : "E"}${String.fromCharCode(65 + offset)}`;
const clear = (p: ApprovedFloorPoint, r: ApprovedFloorFootprint, radius = .18) => {
  const dx = Math.max(r.left - p.x, 0, p.x - r.left - r.width);
  const dy = Math.max(r.top - p.y, 0, p.y - r.top - r.height);
  return Math.hypot(dx, dy) >= radius - 1e-9;
};
// Independent fine-grid reachability checks; production routing still uses
// its existing integer graph and the declared approaches before attaching.
function fineReachable(start: ApprovedFloorPoint, goal: ApprovedFloorPoint, size: number, solids: ApprovedFloorFootprint[]) {
  const scale = 20, limit = size * scale;
  const xy = (p: ApprovedFloorPoint) => [Math.round(p.x * scale), Math.round(p.y * scale)];
  const [sx, sy] = xy(start), [gx, gy] = xy(goal);
  const queue = [[sx!, sy!]], seen = new Set([`${sx},${sy}`]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const [x, y] = queue[cursor]!;
    if (x === gx && y === gy) return true;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x! + dx!, ny = y! + dy!, key = `${nx},${ny}`;
      if (nx < 4 || ny < 4 || nx > limit - 4 || ny > limit - 4 || seen.has(key)) continue;
      if (!solids.every((rect) => clear({ x: nx / scale, y: ny / scale }, rect))) continue;
      seen.add(key); queue.push([nx, ny]);
    }
  }
  return false;
}

for (const contract of Object.values(APPROVED_LEVEL4_ROOM_NAVIGATION_CONTRACTS)) describe(`${contract.roomDefinitionId} M2 navigation`, () => {
  const supports = APPROVED_LEVEL4_SUPPORT_NAVIGATION[contract.roomDefinitionId]!;
  const data = JSON.parse(readFileSync(resolve(import.meta.dirname, `../../../apps/player/src/facility/level4/${slugs[contract.roomDefinitionId]}.json`), "utf8"));
  // Test-only definitions: M2 never registers these rooms in Build Mode.
  const hallway = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === "room.hallway")!;
  const definition: RoomDefinition = { ...hallway, id: contract.roomDefinitionId, kind: "room", width: contract.width, height: contract.height,
    navigation: getApprovedRoomNavigation(contract.roomDefinitionId), defaultDoorSide: null, buildable: false };
  const room: PlacedRoom = { id: "qa.room", roomDefinitionId: definition.id, x: 5, y: 5, orientation: 0, doorSide: null, upgradeLevel: 1 };
  const getDefinition = (id: string) => id === definition.id ? definition : id === hallway.id ? hallway : null;

  it("keeps every one-tile door legal and reaches every visible support through the existing domain graph", () => {
    for (const side of sides) for (let offset = 0; offset < contract.width; offset++) {
      const inside = side === "north" ? { x: offset, y: 0 } : side === "south" ? { x: offset, y: contract.height - 1 }
        : side === "west" ? { x: 0, y: offset } : { x: contract.width - 1, y: offset };
      const step = side === "north" ? { x: 0, y: -1 } : side === "south" ? { x: 0, y: 1 } : side === "west" ? { x: -1, y: 0 } : { x: 1, y: 0 };
      const outside = { x: room.x + inside.x + step.x, y: room.y + inside.y + step.y };
      const hall: PlacedRoom = { ...room, id: "qa.hall", roomDefinitionId: hallway.id, ...outside };
      const rooms = [room, hall];
      const door: DoorState = { id: `qa.${side}.${offset}`, roomId: room.id, side, offset, exterior: false };
      expect(isRoomDoorThresholdProofNavigable(door, room, definition, [door], rooms, getDefinition), `${side}/${offset}`).toBe(true);
      for (const support of supports.filter((support) => !support.hiddenByDoorSlots?.some((slot) => slot.side === side && slot.offset === offset))) {
        const goal = { x: room.x + support.anchor.x, y: room.y + support.anchor.y };
        const path = findDeterministicFacilityPath(outside, goal, rooms, [door], getDefinition);
        expect(path.length, `${side}/${offset} -> ${support.id}`).toBeGreaterThan(0);
        expect(path.at(-1)).toEqual(goal);
      }
    }
  });
  it("preserves active proof solids and radius-clear walking approaches, distinct from seated contacts", () => {
    for (const solid of data.solids) {
      expect(contract.solidFixtures.find((fixture) => fixture.id === solid.id)?.footprint, solid.id).toEqual(solid.footprint);
    }
    for (const support of supports) {
      expect(data.supports.some((item: { id: string }) => item.id === support.id), support.id).toBe(true);
      expect(support.approachPath.at(-1)).toEqual(support.standingApproach);
      for (let i = 1; i < support.approachPath.length; i++) {
        const a = support.approachPath[i - 1]!, b = support.approachPath[i]!;
        for (let t = 0; t <= 1; t += .025) {
          const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
          expect(contract.solidFixtures.every((fixture) => clear(p, fixture.navigationFootprint ?? fixture.footprint)), `${support.id} approach ${i} at ${t}`).toBe(true);
        }
      }
    }
  });
  it("has a radius-clear fine route from every door to each visible standing approach", () => {
    for (const side of sides) for (let offset = 0; offset < contract.width; offset++) {
      const start = side === "north" ? { x: offset + .5, y: .2 } : side === "south" ? { x: offset + .5, y: contract.height - .2 }
        : side === "west" ? { x: .2, y: offset + .5 } : { x: contract.width - .2, y: offset + .5 };
      const owners = segment(side, offset);
      const exceptions = contract.doorThresholdExceptions?.some((slot) => slot.side === side && slot.offset === offset);
      const threshold = { x: Math.floor(start.x), y: Math.floor(start.y) };
      // Only an explicitly approved threshold-owning fixture is passable;
      // unrelated fixtures (including MRI glass/table) remain solid.
      const solids = contract.solidFixtures.filter((fixture) => !fixture.hiddenByDoorSlots?.some((slot) => slot.side === side && slot.offset === offset)
        && !(exceptions && fixture.blockedTiles.some((point) => point.x === threshold.x && point.y === threshold.y)))
        .map((fixture) => fixture.navigationFootprint ?? fixture.footprint);
      solids.push(...(data.routeClearances ?? []).filter((item: { doorOwners: string[] }) => !item.doorOwners.includes(owners)).map((item: { footprint: ApprovedFloorFootprint }) => item.footprint));
      for (const support of supports.filter((support) => !data.supports.find((item: { id: string }) => item.id === support.id)?.doorOwners?.includes(owners))) {
        expect(fineReachable(start, support.standingApproach, contract.width, solids), `${owners} -> ${support.id}`).toBe(true);
        const exported = data.approachRoutes.find((route: { doorSegment: string; supportId: string }) => route.doorSegment === owners && route.supportId === support.id);
        expect(exported?.standingApproach).toEqual(support.standingApproach);
        expect(exported?.walkingPath.at(-1)).toEqual([support.standingApproach.x, support.standingApproach.y]);
        for (let i = 1; i < exported.walkingPath.length; i++) {
          const a = exported.walkingPath[i - 1], b = exported.walkingPath[i];
          for (let t = 0; t <= 1; t += .025) expect(solids.every((rect) => clear({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t }, rect)), `${owners} -> ${support.id} exported segment ${i}`).toBe(true);
        }
      }
    }
  });
  it("exposes physical actor seats separately from gameplay capacity and enforces child-only under-ten stools", () => {
    expect(definition.navigation?.waitingAnchors).toEqual([]);
    for (const support of supports.filter((support) => support.maxAgeExclusive !== undefined)) {
      expect(support.maxAgeExclusive).toBe(10);
      expect(isApprovedLevel4SupportEligible(support, "child", 9)).toBe(true);
      expect(isApprovedLevel4SupportEligible(support, "child", 10)).toBe(false);
      expect(isApprovedLevel4SupportEligible(support, "parent", 9)).toBe(false);
      expect(isApprovedLevel4SupportEligible(support, "child")).toBe(false);
    }
  });
});
