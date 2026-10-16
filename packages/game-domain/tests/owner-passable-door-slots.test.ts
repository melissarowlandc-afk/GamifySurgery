import { describe, expect, it } from "vitest";

import { PROTOTYPE_DOMAIN_CONTEXT } from "../src/context";
import { validateDoorPlacement } from "../src/doors";
import { createInitialGameState } from "../src/reducer";
import { findDeterministicFacilityPath, getRoomNavigationAnchor } from "../src/spatial";
import type { DoorState, PlacedRoom } from "../src/types";

// Owner rule (2026-10-07): every wall segment is a legal door, and furniture
// standing in a doorway is passable instead of blocking the door.
const PASSABLE_SLOTS: ReadonlyArray<readonly [string, DoorState["side"], number]> = [
  ["room.examination", "east", 0], ["room.examination", "east", 1],
  ["room.waiting", "north", 1], ["room.waiting", "north", 2], ["room.waiting", "west", 1], ["room.waiting", "east", 1],
  ["room.bathroom", "north", 0], ["room.bathroom", "north", 1], ["room.bathroom", "west", 0], ["room.bathroom", "east", 0],
  ["room.ct", "west", 1], ["room.ct", "west", 2],
  ["room.phlebotomy", "north", 1],
  ["room.endoscopy", "north", 1],
  ["room.glp1_telehealth_suite", "north", 1],
  ["room.pharmacy", "west", 1],
  ["room.staff_break", "south", 2],
  ["room.vending", "north", 0], ["room.vending", "north", 1], ["room.vending", "west", 0], ["room.vending", "east", 0],
];

const context = PROTOTYPE_DOMAIN_CONTEXT;
const facility = context.balanceRelease.facility;
const definitionFor = (id: string) => facility.roomDefinitions.find((definition) => definition.id === id) ?? null;

const placed = (id: string, roomDefinitionId: string, x: number, y: number): PlacedRoom => ({
  id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
});

describe("owner-approved passable door slots", () => {
  it.each(PASSABLE_SLOTS)("%s accepts a %s door at offset %i and routes through it", (definitionId, side, offset) => {
    const definition = definitionFor(definitionId)!;
    expect(definition).not.toBeNull();
    const x = 20, y = 12;
    const outside = side === "north" ? { x: x + offset, y: y - 1 }
      : side === "south" ? { x: x + offset, y: y + definition.height }
        : side === "west" ? { x: x - 1, y: y + offset }
          : { x: x + definition.width, y: y + offset };
    const state = createInitialGameState();
    const room = placed("room.test.passable", definitionId, x, y);
    const hallway = placed("room.test.hallway", "room.hallway", outside.x, outside.y);
    const rooms = [...state.rooms, room, hallway];
    const door: DoorState = { id: "door.test.passable", roomId: room.id, side, offset, exterior: false };
    const doors = [...state.doors, door];

    const placement = validateDoorPlacement(
      door, rooms, doors, definitionFor, facility.gridWidth, facility.gridHeight,
      new Set(facility.protectedRoomDefinitionIds),
    );
    expect(placement.valid, placement.reason ?? "").toBe(true);

    const anchor = getRoomNavigationAnchor(room, definition);
    expect(anchor).not.toBeNull();
    const path = findDeterministicFacilityPath(outside, anchor!, rooms, doors, definitionFor);
    expect(path.length).toBeGreaterThan(0);
  });

  it("keeps the Front Desk sidewalk wall restricted", () => {
    const definition = definitionFor("room.front_desk")!;
    expect(definition.navigation?.allowedDoorSlots?.length ?? 0).toBeGreaterThan(0);
  });
});
