import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { APPROVED_LEVEL5_ROOM_NAVIGATION_CONTRACTS, APPROVED_LEVEL5_SUPPORT_NAVIGATION, PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { findDeterministicFacilityPath, isRoomDoorThresholdProofNavigable } from "../src/spatial";
import type { DoorState, PlacedRoom } from "../src/types";
const slugs = { "room.founder_office": "founders-office", "room.executive_office": "executive-office", "room.gift_shop": "gift-shop", "room.indoor_garden": "indoor-garden", "room.staff_gym": "staff-gym" };
const sides = ["north", "east", "south", "west"] as const;
type Footprint = { left: number; top: number; width: number; height: number };
type Record = { id: string; footprint?: Footprint; doorOwners: string[] };
type Route = { openDoorSegments: string[]; doorSegment: string; targetId: string; supportId?: string; actorRadius: number; logicalPath: number[][]; walkingPath: number[][] };
type Tier = { records: Record[]; supports: Array<{ id: string; ground: { x: number; y: number } }>; routeClearances: Array<{ footprint: Footprint; doorOwners: string[] }>; approachRoutes: Route[] };

for (const contract of Object.values(APPROVED_LEVEL5_ROOM_NAVIGATION_CONTRACTS)) describe(`${contract.roomDefinitionId} approved M2 access`, () => {
  const definition = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(r => r.id === contract.roomDefinitionId)!;
  const hallway = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(r => r.id === "room.hallway")!;
  const room: PlacedRoom = { id: "nav-room", roomDefinitionId: definition.id, x: 5, y: 5, orientation: 0, doorSide: null, upgradeLevel: 1 };
  const getDefinition = (id: string) => id === definition.id ? definition : id === hallway.id ? hallway : null;
  const data = JSON.parse(readFileSync(resolve(import.meta.dirname, `../../../apps/player/src/facility/level5/${slugs[contract.roomDefinitionId as keyof typeof slugs]}.json`), "utf8")) as { tiers: Tier[] };
  it("reaches every permanent contact from every real one-tile door without deleting chairs", () => {
    for (const side of sides) for (let offset = 0; offset < (side === "north" || side === "south" ? contract.width : contract.height); offset++) {
      const inside = side === "north" ? { x: offset, y: 0 } : side === "south" ? { x: offset, y: contract.height - 1 } : side === "west" ? { x: 0, y: offset } : { x: contract.width - 1, y: offset };
      const step = side === "north" ? { x: 0, y: -1 } : side === "south" ? { x: 0, y: 1 } : side === "west" ? { x: -1, y: 0 } : { x: 1, y: 0 };
      const outside = { x: room.x + inside.x + step.x, y: room.y + inside.y + step.y };
      const hall = { ...room, ...outside, id: "nav-hall", roomDefinitionId: hallway.id };
      const door: DoorState = { id: "nav-door", roomId: room.id, side, offset, exterior: false };
      expect(isRoomDoorThresholdProofNavigable(door, room, definition, [door], [room, hall], getDefinition), `${side}/${offset}`).toBe(true);
      for (const support of APPROVED_LEVEL5_SUPPORT_NAVIGATION[definition.id]!) {
        const goal = { x: room.x + support.anchor.x, y: room.y + support.anchor.y };
        expect(findDeterministicFacilityPath(outside, goal, [room, hall], [door], getDefinition).at(-1), `${side}/${offset} -> ${support.id}`).toEqual(goal);
      }
    }
  });
  it("keeps occupied fine knots radius-clear against retained physical furniture and measured bases", () => {
    const violations: string[] = [];
    for (const tier of data.tiers) for (const route of tier.approachRoutes) {
      expect(route.actorRadius).toBe(.18); expect(route.walkingPath.length).toBeGreaterThan(0);
      expect(route.walkingPath.length).toBe(route.logicalPath.length);
      for (let i = 0; i < route.logicalPath.length; i++) expect(route.walkingPath[i]).toEqual(route.logicalPath[i]!.map(value => value + .5));
      const visible = (owners: string[]) => !owners.some(s => route.openDoorSegments.includes(s));
      const solids = [...tier.records.filter(r => r.footprint && visible(r.doorOwners)).map(r => r.footprint!),
        ...tier.routeClearances.filter(r => visible(r.doorOwners)).map(r => r.footprint)];
      // The approved office proofs use retained physical chair footprints and
      // painter sorting, rather than extra standing-body disks for sitters.
      const occupied = definition.id === "room.founder_office" || definition.id === "room.executive_office" ? [] : tier.supports.filter(s => s.id !== route.supportId);
      for (let i = 1; i < route.walkingPath.length; i++) {
        const a = route.walkingPath[i - 1]!, b = route.walkingPath[i]!;
        const count = Math.max(1, Math.ceil(Math.hypot(b[0]! - a[0]!, b[1]! - a[1]!) / .0125));
        for (let j = 0; j <= count; j++) {
          const x = a[0]! + (b[0]! - a[0]!) * j / count, y = a[1]! + (b[1]! - a[1]!) * j / count;
          if (solids.some(f => x > f.left - .18 + 1e-9 && x < f.left + f.width + .18 - 1e-9 && y > f.top - .18 + 1e-9 && y < f.top + f.height + .18 - 1e-9) ||
              occupied.some(s => Math.hypot(x - s.ground.x, y - s.ground.y) < .36 - 1e-9)) {
            violations.push(`${route.doorSegment}->${route.targetId} at ${x},${y}`); break;
          }
        }
      }
    }
    expect(violations.slice(0, 5)).toEqual([]);
  });
});
