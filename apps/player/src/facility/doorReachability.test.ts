import { describe, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer, getRoomDefinition, type DoorState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { getDoorPresentationOpenings } from "./doorPresentation";
import { getFacilityWorldSignature } from "./facilityWorldSignature";
import { FacilityScene } from "./FacilityScene";
import { getApprovedRoomPresentation } from "./approvedRoomPresentation";
import type { FacilityRoomView } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {}, Scenes: { Events: { SHUTDOWN: "shutdown" } } } }));

function layout() {
  const state = createInitialGameState(); state.facilityLevel = 1; state.encounters = {};
  const front = state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
  const size = getRoomDefinition("room.waiting")!;
  state.rooms.push({ id: "waiting", roomDefinitionId: size.id, x: front.x - size.width - 1,
    y: front.y + 4 - size.height, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  for (let y = front.y - 1; y < front.y + 4; y += 1) state.rooms.push({ id: `hall.${y}`,
    roomDefinitionId: "room.hallway", x: front.x - 1, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  const door: DoorState = { id: "door.waiting", roomId: "waiting", side: "east", offset: 1, exterior: false };
  state.doors.push(door);
  return { state, front, door };
}

describe("rendered doors agree with access", () => {
  it.each([false, true])("closes both sides of a moved, disconnected saved door (Build Mode %s), and restores them on undo", buildMode => {
    const { state } = layout();
    const project = (source = state) => createPrototypePlayerView(source, null, false, null, buildMode).facility;
    const before = project();
    const moved = gameReducer(state, { type: "MOVE_ROOM", operationId: "move.waiting", roomId: "waiting", x: 2, y: 2 });
    expect(moved.operationReceipts["move.waiting"]?.status).toBe("applied");
    const after = project(moved);
    const waiting = (model: typeof before) => model.rooms.find(room => room.instanceId === "waiting")!;
    expect(getDoorPresentationOpenings(waiting(before), before.doors!, before.rooms)).toEqual([{ side: "east", offset: 1 }]);
    expect(getDoorPresentationOpenings(waiting(after), after.doors!, after.rooms)).toEqual([]);
    expect(after.doors!.find(door => door.instanceId === "door.waiting")).toMatchObject({ connectionValid: false });
    expect(after.doors!.map(door => door.instanceId)).toEqual(before.doors!.map(door => door.instanceId));
    expect(getFacilityWorldSignature(after)).not.toBe(getFacilityWorldSignature(before));
    expect(getFacilityWorldSignature(project())).toBe(getFacilityWorldSignature(before));
    expect(moved.doors).toEqual(state.doors);
  });

  it("invalidates both stationary room doors when the hallway tile between them moves", () => {
    const { state, front } = layout();
    const withDoor = gameReducer(state, { type: "PLACE_DOOR", operationId: "front-door", doorId: "front-door",
      roomId: front.id, side: "west", offset: 2 });
    expect(withDoor.operationReceipts["front-door"]?.status).toBe("applied");
    const hall = withDoor.rooms.find(room => room.roomDefinitionId === "room.hallway" && room.y === front.y + 2)!;
    const moved = gameReducer(withDoor, { type: "MOVE_ROOM", operationId: "move.hall", roomId: hall.id, x: 2, y: 2 });
    expect(moved.operationReceipts["move.hall"]?.status).toBe("applied");
    const model = createPrototypePlayerView(moved, null, false, null, true).facility;
    expect(model.doors!.filter(door => door.instanceId === "door.waiting" || door.instanceId === "front-door")
      .map(door => door.connectionValid)).toEqual([false, false]);
    for (const room of model.rooms) {
      const openings = getDoorPresentationOpenings(room, model.doors!, model.rooms);
      if (room.instanceId === front.id) expect(openings.some(opening => opening.side === "west")).toBe(false);
      if (room.instanceId === "waiting") expect(openings).toEqual([]);
    }
    expect(moved.doors).toEqual(withDoor.doors);
  });

  it.each(["hallway-owned", "duplicate", "outside", "offset"])("preserves and visibly rejects a %s saved door", scenario => {
    const { state, door, front } = layout();
    if (scenario === "hallway-owned") { door.roomId = `hall.${front.y + 2}`; door.side = "west"; door.offset = 0; }
    if (scenario === "duplicate") state.doors.push({ ...door, id: "duplicate-door" });
    if (scenario === "outside") door.exterior = true;
    if (scenario === "offset") door.offset = 99;
    const model = createPrototypePlayerView(state, null, false, null, true).facility;
    const projected = model.doors!.find(candidate => candidate.instanceId === door.id)!;
    expect(projected.connectionValid).toBe(false); expect(projected.blockedReason).toBeTruthy();
    const owner = model.rooms.find(room => room.instanceId === door.roomId)!;
    expect(getDoorPresentationOpenings(owner, [projected], model.rooms)).toEqual([]);
    expect(model.doors).toHaveLength(state.doors.length);
  });

  it.each([false, true])("paints a hallway's backed north partition only outside an actual door (door present %s)", hasDoor => {
    const { state } = layout();
    const model = createPrototypePlayerView(state, null, false, null, true).facility;
    const source: FacilityRoomView = { ...model.rooms.find(room => room.instanceId === "waiting")!, tileX: 4, tileY: 4 };
    const hall: FacilityRoomView = { ...model.rooms.find(room => room.kind === "hallway")!,
      instanceId: "south-hall", tileX: source.tileX, tileY: source.tileY + source.height };
    // Isolate the shared-edge painter, without canvas/browser raster dependencies.
    const fillRect = vi.fn();
    const scene = Object.create(FacilityScene.prototype) as {
      bridge: { viewModel: typeof model }; layout: { tileSize: number };
      drawApprovedHallwayExposedEdges: (...args: unknown[]) => void;
    };
    scene.bridge = { viewModel: { ...model, rooms: [source, hall], doors: hasDoor ? [{ instanceId: "south-door",
      roomInstanceId: source.instanceId, side: "south", offset: 0, exterior: false, connectionValid: true,
      adjacentRoomInstanceId: hall.instanceId }] : [] } };
    scene.layout = { tileSize: 120 };
    scene.drawApprovedHallwayExposedEdges({ fillRect, fillStyle: vi.fn() }, hall,
      { x: 0, y: 0, width: 120, height: 120 }, getApprovedRoomPresentation("room.hallway")!.shell);
    expect(fillRect.mock.calls.some(([x, y, width, height]) => x === 0 && y < 0 && width === 120 && height === 29)).toBe(!hasDoor);
  });

  it.each([false, true])("flags invalid doors on the rendered wall in play and Build (phone %s)", mobileInput => {
    const { state } = layout();
    const moved = gameReducer(state, { type: "MOVE_ROOM", operationId: "move.waiting", roomId: "waiting", x: 2, y: 2 });
    for (const buildMode of [false, true]) {
      const model = createPrototypePlayerView(moved, null, false, null, buildMode).facility;
      const scene = Object.create(FacilityScene.prototype) as {
        bridge: { viewModel: typeof model; mobileInput: boolean }; layout: { tileSize: number };
        getDoorGeometry: ReturnType<typeof vi.fn>; getSortableGraphics: ReturnType<typeof vi.fn>;
        drawInvalidDoorMarkers: () => void;
      };
      const graphics = { fillStyle: vi.fn(), fillRect: vi.fn(), lineStyle: vi.fn(), strokeRect: vi.fn(),
        lineBetween: vi.fn(), setDepth: vi.fn() };
      scene.bridge = { viewModel: model, mobileInput }; scene.layout = { tileSize: 32 };
      scene.getDoorGeometry = vi.fn(() => ({ center: { x: 50, y: 70 } }));
      scene.getSortableGraphics = vi.fn(() => graphics);
      scene.drawInvalidDoorMarkers();
      expect(graphics.lineStyle).toHaveBeenCalledWith(expect.any(Number), 0xb3382c, 1);
      expect(graphics.lineBetween).toHaveBeenCalledTimes(2);
      expect(scene.getDoorGeometry).toHaveBeenCalledWith(expect.objectContaining({ instanceId: "waiting" }), "east", 1);
    }
  });

  it("keeps the invalid rotated-door marker and removal target on the same clamped wall section", () => {
    const scene = Object.create(FacilityScene.prototype) as {
      bridge: { viewModel: { rooms: FacilityRoomView[] } }; layout: { tileSize: number; originX: number; originY: number };
      getDoorGeometry: (room: FacilityRoomView, side: "east" | "north", offset: number) => unknown;
    };
    const room: FacilityRoomView = { instanceId: "rotated", definitionId: "room.examination", displayName: "Exam",
      tileX: 1, tileY: 1, width: 3, height: 2, isFounderRoom: false };
    scene.bridge = { viewModel: { rooms: [room] } }; scene.layout = { tileSize: 32, originX: 0, originY: 0 };
    expect(scene.getDoorGeometry(room, "east", 4)).toEqual(scene.getDoorGeometry(room, "east", 1));
    scene.bridge.viewModel.rooms.push({ ...room, instanceId: "north-neighbor", tileY: 0, height: 1 });
    expect(scene.getDoorGeometry(room, "north", 4)).toEqual(scene.getDoorGeometry(room, "north", 2));
  });
});
