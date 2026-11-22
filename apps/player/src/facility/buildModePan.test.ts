import { EventEmitter } from "node:events";
import { deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { describe, expect, it, vi } from "vitest";
import { apronHall, examRoom, hallwaySaleClinic } from "../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { createPrototypePlayerView } from "../session/viewModels";
import type { FacilitySceneBridge } from "./FacilityScene";
import { headlessFacilityScene } from "./retainedCameraTestSupport";

vi.mock("phaser", () => ({ default: {
  Scene: class {},
  BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Scenes: { Events: { SHUTDOWN: "shutdown" } },
  Display: { Color: { HexStringToColor: (value: string) => ({ color: parseInt(value.slice(1), 16) }) } },
} }));

type Point = { x: number; y: number };
const DRAG = { x: 53, y: -37 };
const offset = (point: Point, delta: Point): Point => ({ x: point.x + delta.x, y: point.y + delta.y });

function clinic(phone: boolean, buildMode = true) {
  const state = deserializeGameState(serializeGameState(hallwaySaleClinic()));
  const model = createPrototypePlayerView(state, null, false, null, buildMode, null, 0, { zoom: 1.2, panX: 0, panY: 0 }).facility;
  const { scene, bridge: headlessBridge } = headlessFacilityScene(model, phone);
  const bridge: FacilitySceneBridge = headlessBridge;
  const selected = vi.fn((id: string) => {
    bridge.viewModel = { ...bridge.viewModel, selectedRoomInstanceId: id };
  });
  const anchor = vi.fn();
  const moveFounder = vi.fn(() => true);
  const inspect = vi.fn();
  bridge.onSelectRoom = selected;
  bridge.onSelectedRoomRectChange = anchor;
  bridge.onMoveFounder = moveFounder;
  bridge.onMobileSelection = inspect;
  bridge.mobileBuild = phone && buildMode ? {
    ghost: null, initialGhost: null, hallway: null, doors: [], selectedDoorId: null, onIntent: vi.fn(),
  } : null;

  // Reuse the renderer harness and deliver the same input events as Phaser.
  // Hit testing, gesture recognition, and the camera projection all run here.
  const input = Object.assign(new EventEmitter(), { addPointer() {} });
  scene.input = input;
  scene.events = new EventEmitter();
  scene.ensureCharacterStills = () => {};
  scene.ensureCharacterStill = () => false;
  Object.assign(scene.game.canvas, { addEventListener() {}, removeEventListener() {} });
  scene.bindInput();

  const send = (type: "pointerdown" | "pointermove" | "pointerup", point: Point) => {
    scene.time.now += 16;
    if (!input.emit(type, { ...point, id: phone ? 1 : 0, button: 0, wasTouch: phone })) {
      throw new Error(`FacilityScene bound no ${type} listener`);
    }
  };
  const view = () => ({ x: Number(scene.layout.originX), y: Number(scene.layout.originY), zoom: Number(scene.cameraView.zoom) });
  const focus = (tile: Point) => {
    const { layout, scale, cameraView } = scene;
    scene.applyCamera({ ...cameraView,
      panX: cameraView.panX + scale.width / 2 - (layout.originX + tile.x * layout.tileSize),
      panY: cameraView.panY + scale.height / 2 - (layout.originY + tile.y * layout.tileSize),
    });
    return { x: scene.layout.originX + tile.x * scene.layout.tileSize, y: scene.layout.originY + tile.y * scene.layout.tileSize };
  };
  const room = (id: string) => {
    const target = bridge.viewModel.rooms.find((candidate) => candidate.instanceId === id);
    if (!target) throw new Error(`Missing fixture room ${id}`);
    return target;
  };
  const focusRoom = (id: string) => {
    const { tileX, tileY, width, height } = room(id);
    return focus({ x: tileX + width / 2, y: tileY + height / 2 });
  };
  const drag = (start: Point) => {
    const end = offset(start, DRAG);
    send("pointerdown", start);
    send("pointermove", end);
    send("pointerup", end);
  };
  return { scene, bridge, selected, anchor, moveFounder, inspect, send, view, focus, room, focusRoom, drag };
}

describe.each([{ input: "desktop", phone: false, threshold: 6 }, { input: "phone", phone: true, threshold: 8 }])(
  "$input map input", ({ phone, threshold }) => {
    it.each([{ surface: "room interior", id: examRoom }, { surface: "hallway tile", id: apronHall }])(
      "pans from a $surface in idle Build without selecting it", ({ id }) => {
        const f = clinic(phone);
        const start = f.focusRoom(id);
        const before = f.view();
        f.send("pointerdown", start);
        f.send("pointermove", offset(start, { x: threshold, y: 0 }));
        expect.soft(f.view(), "pan starts at the blank-ground drag threshold").toEqual({ ...before, x: before.x + threshold });
        const end = offset(start, DRAG);
        f.send("pointermove", end);
        f.send("pointerup", end);
        expect.soft(f.view(), "map translation after the drag").toEqual({ ...before, ...offset(before, DRAG) });
        expect(f.selected, "a map drag must not make any room selection").not.toHaveBeenCalled();
      },
    );

    it("pans a drag from blank ground in Build", () => {
      const f = clinic(phone);
      const start = f.focus({ x: 30.5, y: 24.5 });
      const before = f.view();
      f.send("pointerdown", start);
      f.send("pointermove", offset(start, { x: threshold - 1, y: 0 }));
      expect(f.view()).toEqual(before);
      f.send("pointermove", offset(start, { x: threshold, y: 0 }));
      expect(f.view()).toEqual({ ...before, x: before.x + threshold });
      const end = offset(start, DRAG);
      f.send("pointermove", end);
      f.send("pointerup", end);
      expect(f.view()).toEqual({ ...before, ...offset(before, DRAG) });
      expect(f.selected).not.toHaveBeenCalled();
    });

    it("selects the clicked Build room and keeps its desktop menu anchor", () => {
      const f = clinic(phone);
      const start = f.focusRoom(examRoom);
      const before = f.view();
      f.send("pointerdown", start);
      f.send("pointerup", start);
      expect(f.selected).toHaveBeenCalledExactlyOnceWith(examRoom);
      expect(f.view()).toEqual(before);
      if (!phone) {
        f.scene.update(32, 16);
        const { tileX, tileY, width, height } = f.room(examRoom);
        const { originX, originY, tileSize } = f.scene.layout;
        expect(f.anchor).toHaveBeenLastCalledWith({
          x: originX + tileX * tileSize, y: originY + tileY * tileSize,
          width: width * tileSize, height: height * tileSize,
        });
      }
    });

    it("waits for release after sub-threshold movement on a Build room", () => {
      const f = clinic(phone);
      const start = f.focusRoom(examRoom);
      const end = offset(start, { x: threshold - 1, y: 0 });
      const before = f.view();
      f.send("pointerdown", start);
      expect.soft(f.selected, "no selection while the pointer is held down").not.toHaveBeenCalled();
      f.send("pointermove", end);
      expect(f.view()).toEqual(before);
      f.send("pointerup", end);
      expect(f.selected).toHaveBeenCalledExactlyOnceWith(examRoom);
    });

    it("pans from the selected Build room without selecting it again", () => {
      const f = clinic(phone);
      const start = f.focusRoom(examRoom);
      f.send("pointerdown", start);
      f.send("pointerup", start);
      expect(f.bridge.viewModel.selectedRoomInstanceId).toBe(examRoom);
      f.selected.mockClear();
      const before = f.view();
      f.drag(start);
      expect.soft(f.view()).toEqual({ ...before, ...offset(before, DRAG) });
      expect.soft(f.selected, "the drag must not reopen the room menu").not.toHaveBeenCalled();
      expect(f.bridge.viewModel.selectedRoomInstanceId).toBe(examRoom);
    });

    it("pans a room drag in Play without a walk, inspect, or Build selection", () => {
      const f = clinic(phone, false);
      const start = f.focusRoom(examRoom);
      const before = f.view();
      f.drag(start);
      expect(f.view()).toEqual({ ...before, ...offset(before, DRAG) });
      expect(f.moveFounder).not.toHaveBeenCalled();
      expect(f.inspect).not.toHaveBeenCalled();
      expect(f.selected).not.toHaveBeenCalled();
    });
  },
);

it.each([{ surface: "room", id: examRoom }, { surface: "adjacent hallway", id: apronHall }])(
  "phone Build treats a swipe back near its start on the $surface as a drag through release", ({ id }) => {
    const f = clinic(true);
    const start = f.focusRoom(id);
    const before = f.view();
    const returnOffset = { x: 2, y: 0 };
    const end = offset(start, returnOffset);
    f.send("pointerdown", start);
    f.send("pointermove", offset(start, DRAG));
    expect(f.view()).toEqual({ ...before, ...offset(before, DRAG) });
    f.send("pointermove", end);
    f.send("pointerup", end);
    expect(f.view()).toEqual({ ...before, ...offset(before, returnOffset) });
    expect(f.selected, "returning near touch-down must not open a room menu").not.toHaveBeenCalled();
  },
);
