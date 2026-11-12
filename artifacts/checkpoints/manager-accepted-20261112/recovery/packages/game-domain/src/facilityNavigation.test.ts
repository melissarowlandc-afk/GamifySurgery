import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { deserializeGameState } from "./persistence";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { findDeterministicFacilityPath, getOccupiedTiles, getRoomCareStations, withFacilityNavigationScope } from "./spatial";
import { findDeterministicFacilityPath as reference, getRoomCareStations as referenceStations } from "./facilityNavigationReference.testSupport";
import { createFacilityNavigationCache } from "./facilityNavigation";
import type { DoorState, PlacedRoom } from "./types";
import type { RoomDefinition } from "@gamify-surgery/balance-config";
const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;

it("preserves exact routes, care-room restrictions, fixture endpoints and displaced origins across retained L3/4/5 geometry", () => {
  const files = ["level-four-legacy-pre-m3.json", "level-five-economy-checkpoint-20261012.json"];
  for (const file of files) {
    const state = deserializeGameState(readFileSync(new URL(`../../../tests/fixtures/${file}`, import.meta.url), "utf8"));
    const getDefinition = (id: string) => PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(d => d.id === id) ?? null;
    const points = state.rooms.flatMap(room => getOccupiedTiles(room, getDefinition(room.roomDefinitionId)!));
    const blocked = new Set(state.rooms.filter((_, i) => i % 3 === 0).map(room => room.id));
    const before = JSON.stringify([state.rooms, state.doors]);
    withFacilityNavigationScope(() => {
      for (let i = 0; i < 130; i++) {
        const start = points[(i * 17) % points.length]!, goal = points[(i * 47 + 3) % points.length]!;
        const options = i % 2 ? { blockedRoomInstanceIds: blocked } : {};
        const expected = reference(start, goal, state.rooms, state.doors, getDefinition, options);
        const result = findDeterministicFacilityPath(start, goal, state.rooms, state.doors, getDefinition, options);
        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
        if (result[0]) result[0].x = -999;
        result.length = 0;
        expect(findDeterministicFacilityPath(start, goal, state.rooms, state.doors, getDefinition, options)).toEqual(expected);
      }
      for (const room of state.rooms) expect(getRoomCareStations(room, getDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getDefinition))
        .toEqual(referenceStations(room, getDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getDefinition));
    });
    expect(JSON.stringify([state.rooms, state.doors])).toBe(before);
  }
}, hostedTime(20_000));

it("keys actual room/door/navigation data, mutable contexts and read scopes; never state identity or condition", () => {
  const rooms: PlacedRoom[] = [{ id: "route.room", roomDefinitionId: "route.definition", x: 1, y: 1, orientation: 0, doorSide: null, upgradeLevel: 1 }];
  const doors: DoorState[] = [];
  const definition = { id: "route.definition", kind: "hallway", width: 2, height: 2, navigation: { blockedTiles: [] } } as unknown as RoomDefinition;
  const reader = (_id: string, ...extra: unknown[]) => { expect(extra).toHaveLength(0); return definition; };
  const cache = createFacilityNavigationCache<object>();
  let builds = 0; const get = () => cache(rooms, doors, reader, () => ({ generation: ++builds }));
  const first = get(); rooms[0]!.cleanliness = 2; expect(get()).toBe(first);
  rooms[0]!.x++; expect(get()).not.toBe(first);
  const moved = get(); definition.navigation!.blockedTiles.push({ x: 0, y: 0 }); expect(get()).not.toBe(moved);
  const masked = get(); doors.push({ id: "route.door", roomId: rooms[0]!.id, side: "north", offset: 0, exterior: false }); expect(get()).not.toBe(masked);
  const door = get(); withFacilityNavigationScope(() => expect(get()).toBe(door));
  doors[0]!.offset++;
  withFacilityNavigationScope(() => expect(get()).not.toBe(door));
  const run = () => findDeterministicFacilityPath({ x: 2, y: 1 }, { x: 3, y: 2 }, rooms, doors, reader);
  expect(run()).toEqual(reference({ x: 2, y: 1 }, { x: 3, y: 2 }, rooms, doors, reader));
});

it("preserves the legacy origin overlay even in overlapping QA/legacy geometry", () => {
  const rooms: PlacedRoom[] = [
    { id: "overlap.hall", roomDefinitionId: "overlap.hall", x: 0, y: 0, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "overlap.blocked", roomDefinitionId: "overlap.room", x: 0, y: 0, orientation: 0, doorSide: null, upgradeLevel: 1 },
  ];
  const getDefinition = (id: string) => ({ id, kind: id.endsWith("hall") ? "hallway" : "room", width: id.endsWith("hall") ? 2 : 1, height: 1 } as RoomDefinition);
  const options = { blockedRoomInstanceIds: new Set(["overlap.blocked"]) };
  const start = { x: 0, y: 0 }, goal = { x: 1, y: 0 };
  const expected = reference(start, goal, rooms, [], getDefinition, options);
  expect(expected).toEqual([start, goal]);
  expect(findDeterministicFacilityPath(start, goal, rooms, [], getDefinition, options)).toEqual(expected);
  expect(findDeterministicFacilityPath(start, start, rooms, [], getDefinition, options)).toEqual([start]);
});
