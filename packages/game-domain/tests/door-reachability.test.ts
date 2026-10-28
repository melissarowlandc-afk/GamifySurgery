import { describe, expect, it } from "vitest";
import {
  createInitialGameState, deserializeGameState, gameReducer, getFacilityAccessValidation,
  getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, validateDoorPlacement,
  type DoorState, type GameState, type PlacedRoom,
} from "../src";

function ownerLayout(): GameState {
  const state = createInitialGameState();
  state.facilityLevel = 1;
  state.encounters = {};
  const front = state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
  state.rooms = [front];
  state.doors = state.doors.filter(door => door.exterior);
  const definition = getRoomDefinition("room.waiting")!;
  state.rooms.push({ id: "waiting", roomDefinitionId: definition.id,
    x: front.x - definition.width - 1, y: front.y + 4 - definition.height,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  for (let y = front.y - 1; y < front.y + 4; y += 1) {
    state.rooms.push({ id: `hall.${y}`, roomDefinitionId: "room.hallway", x: front.x - 1, y,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  }
  return state;
}

function connect(state: GameState, roomId: string, side: DoorState["side"], offset: number): GameState {
  const id = `door.${roomId}.${side}.${offset}`;
  const next = gameReducer(state, { type: "PLACE_DOOR", operationId: id, doorId: id, roomId, side, offset });
  expect(next.operationReceipts[id]?.status).toBe("applied");
  return next;
}

describe("owner phone door reachability report", () => {
  it("counts actual Waiting Room–Hallway–Front Desk doors across a multi-piece hallway", () => {
    let state = ownerLayout();
    state = connect(state, state.rooms[0]!.id, "west", 2);
    state = connect(state, "waiting", "east", 1);
    expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, issues: [], unreachableRoomIds: [] });
  });

  it("names the upstream Front Desk wall when the Waiting Room door only reaches disconnected hallway", () => {
    const state = connect(ownerLayout(), "waiting", "east", 1);
    const access = getFacilityAccessValidation(state);
    expect(access.unreachableRoomIds).toEqual(state.rooms.slice(1).map(room => room.id));
    expect(access.issues).toHaveLength(2); // One Hallway issue despite five pieces, plus Waiting Room.
    expect(access.issues.every(issue => issue.includes("Add a door between Hallway and Front Desk"))).toBe(true);
    expect(access.issues.every(issue => issue.includes("Front Desk west wall"))).toBe(true);
  });

  it("does not join hallway pieces that meet only at a corner", () => {
    let state = ownerLayout();
    state = connect(state, state.rooms[0]!.id, "west", 2);
    state = connect(state, "waiting", "east", 1);
    state.rooms.push({ id: "diagonal.hall", roomDefinitionId: "room.hallway",
      x: state.rooms[0]!.x - 2, y: state.rooms[0]!.y - 2,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    expect(getFacilityAccessValidation(state).unreachableRoomIds).toEqual(["diagonal.hall"]);
  });

  it("identifies the Waiting Room east wall when its side of the route lacks a door", () => {
    let state = ownerLayout();
    state = connect(state, state.rooms[0]!.id, "west", 2);
    const access = getFacilityAccessValidation(state);
    expect(access.unreachableRoomIds).toEqual(["waiting"]);
    expect(access.reason).toContain("Waiting Room east wall");
    expect(access.reason).toContain("section");
  });

  it("keeps moved invalid doors on reload and locates their wall in the error", () => {
    const state = connect(ownerLayout(), "waiting", "east", 1);
    const moved = gameReducer(state, { type: "MOVE_ROOM", operationId: "move.waiting", roomId: "waiting", x: 2, y: 2 });
    expect(moved.operationReceipts["move.waiting"]?.status).toBe("applied");
    const restored = deserializeGameState(serializeGameState(moved));
    expect(restored.doors).toEqual(moved.doors);
    expect(getFacilityAccessValidation(restored).reason).toContain("Waiting Room east wall");
    expect(getFacilityAccessValidation(restored).reason).toContain("section 2 from the north");
    expect(getFacilityAccessValidation(state).issues.join(" ")).toContain("Front Desk west wall");
  });

  it("never resolves an interior door as valid without a specific adjacent room", () => {
    const state = ownerLayout();
    const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
    const rooms: PlacedRoom[] = [...state.rooms, { ...state.rooms[1]!, id: "isolated", x: 2, y: 2 }];
    for (const room of rooms) {
      const definition = getRoomDefinition(room.roomDefinitionId)!;
      for (const side of ["north", "east", "south", "west"] as const) {
        const length = side === "north" || side === "south" ? definition.width : definition.height;
        for (let offset = 0; offset < length; offset += 1) {
          const result = validateDoorPlacement({ id: "preview", roomId: room.id, side, offset, exterior: false },
            rooms, state.doors, getRoomDefinition, facility.gridWidth, facility.gridHeight,
            new Set(facility.protectedRoomDefinitionIds));
          if (result.valid) expect(result.adjacentRoomId).not.toBeNull();
        }
      }
    }
  });
});
