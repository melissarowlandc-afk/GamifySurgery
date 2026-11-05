import { expect, it, vi } from "vitest";
import { cachedFacilityAdjacency } from "./facilityPathCache";
import type { RoomDefinition } from "@gamify-surgery/balance-config";
import type { DoorState, PlacedRoom } from "./types";

it("reuses unchanged geometry while returning independent neighbor sets", () => {
  const room: PlacedRoom = { id: "cache.room", roomDefinitionId: "cache.definition", x: 1, y: 1, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 50 };
  const definition = { kind: "hallway", width: 2, height: 2 } as RoomDefinition;
  const build = vi.fn(() => new Map([["1,1", new Set(["2,1"])], ["2,1", new Set(["1,1"])]]));
  const first = cachedFacilityAdjacency([room], [], () => definition, new Set(), build);
  first.get("1,1")!.clear(); first.delete("2,1");
  const second = cachedFacilityAdjacency([{ ...room, cleanliness: 1 }], [], () => definition, new Set(), build);
  expect(build).toHaveBeenCalledTimes(1);
  expect([...second.get("1,1")!]).toEqual(["2,1"]); expect(second.has("2,1")).toBe(true);
});

it("invalidates doors, room geometry, mutable navigation definitions and endpoint variants", () => {
  const room: PlacedRoom = { id: "cache.changed", roomDefinitionId: "cache.changed.definition", x: 3, y: 3, orientation: 0, doorSide: null, upgradeLevel: 1 };
  const definition = { kind: "room", width: 2, height: 2, navigation: { blockedTiles: [] } } as unknown as RoomDefinition;
  const doors: DoorState[] = [{ id: "door", roomId: room.id, side: "north", offset: 0, exterior: false }];
  const build = vi.fn(() => new Map<string, Set<string>>());
  const run = (placed = room, endpoints = new Set<string>()) => cachedFacilityAdjacency([placed], doors, () => definition, endpoints, build);
  run(); run(); expect(build).toHaveBeenCalledTimes(1);
  doors[0]!.offset = 1; run();
  run({ ...room, orientation: 90 }); run(room, new Set(["3,3"]));
  (definition.navigation!.blockedTiles as { x: number; y: number }[]).push({ x: 1, y: 1 }); run();
  expect(build).toHaveBeenCalledTimes(5);
});
