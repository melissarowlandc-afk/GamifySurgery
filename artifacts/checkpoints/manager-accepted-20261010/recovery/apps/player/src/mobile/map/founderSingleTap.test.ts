import { describe, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer, PROTOTYPE_DOMAIN_CONTEXT, type GameState, type GridPoint } from "@gamify-surgery/game-domain";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import { createPrototypePlayerView } from "../../session/viewModels";
import { MapTouchGestures, type MapGesture } from "./gestures";
import type { MobileMapSelection } from "./selection";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

function harness(initial: GameState, mobile: boolean) {
  let state = initial;
  const model = createPrototypePlayerView(state, null, false, null).facility;
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: FacilitySceneBridge; layout: { originX: number; originY: number; tileSize: number; sidewalkTop: number; sidewalkHeight: number };
    characterBitmapContainers: Map<string, unknown>; characterGraphics: Map<string, unknown>; characterMotionSnapshots: Map<string, unknown>;
    founderSeatScreenPoint: () => null; frontDeskSeatInteractionAtPointer: () => boolean; ordinaryChairAtPointer: () => null;
    setInteractionHint: ReturnType<typeof vi.fn>; dragStart: { dragged: boolean } | null; pointerDownCharacterKey: null;
    endHallwayPaint: ReturnType<typeof vi.fn>; applyCamera: ReturnType<typeof vi.fn>;
    applyMobileGestures: (gestures: readonly MapGesture[]) => void;
    handlePointerUp: (point: { x: number; y: number }) => void;
  };
  const move = vi.fn((destination: GridPoint) => {
    state = gameReducer(state, { type: "MOVE_FOUNDER", destination, operationId: "mb9.move" }, PROTOTYPE_DOMAIN_CONTEXT);
    return state.operationReceipts["mb9.move"]!.status === "applied";
  });
  scene.bridge = { viewModel: { ...model, founderChairs: [], doors: [], litterItems: [], waterCooler: undefined },
    mobileInput: mobile, onPlaceRoom: vi.fn(), onMoveFounder: move, onMobileSelection: vi.fn() };
  scene.layout = { originX: 0, originY: 0, tileSize: 20, sidewalkTop: model.gridRows! * 20, sidewalkHeight: 20 };
  scene.characterBitmapContainers = new Map(); scene.characterGraphics = new Map(); scene.characterMotionSnapshots = new Map();
  scene.founderSeatScreenPoint = () => null; scene.frontDeskSeatInteractionAtPointer = () => false; scene.ordinaryChairAtPointer = () => null;
  scene.setInteractionHint = vi.fn(); scene.endHallwayPaint = vi.fn(); scene.applyCamera = vi.fn(); scene.pointerDownCharacterKey = null;
  const tap = (destination: GridPoint) => {
    const point = { x: (destination.x + 0.5) * 20, y: (destination.y + 0.5) * 20 };
    if (mobile) {
      const gestures = new MapTouchGestures(); scene.applyMobileGestures(gestures.down(1, point, 0));
      expect(move).not.toHaveBeenCalled(); scene.applyMobileGestures(gestures.up(1, point, 80));
    } else {
      // The unchanged desktop pointer-up path following a short click.
      scene.dragStart = { dragged: false }; scene.handlePointerUp(point);
    }
  };
  return { scene, tap, move, get state() { return state; } };
}

describe("MB9 founder single-tap legality parity with the original desktop input", () => {
  it("uses identical movement destinations, reducer guards, receipts and state for every starter-room tile and sidewalk", () => {
    const initial = createInitialGameState(); initial.paused = true; initial.encounters = {};
    const room = createPrototypePlayerView(initial, null, false, null).facility.rooms[0]!;
    const points: GridPoint[] = [];
    for (let y = room.tileY; y < room.tileY + room.height; y++) for (let x = room.tileX; x < room.tileX + room.width; x++) points.push({ x, y });
    points.push({ x: room.tileX, y: PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight });
    const statuses = new Set<string>();
    for (const point of points) {
      const phone = harness(initial, true); const desktop = harness(initial, false);
      phone.tap(point); desktop.tap(point);
      expect(phone.move.mock.calls).toEqual(desktop.move.mock.calls); expect(phone.move).toHaveBeenCalledExactlyOnceWith(point);
      expect(phone.state).toEqual(desktop.state);
      statuses.add(phone.state.operationReceipts["mb9.move"]!.status);
      const selection = vi.mocked(phone.scene.bridge.onMobileSelection!).mock.calls[0]![0]!;
      expect(selection).toMatchObject({ kind: "room", destination: point });
      expect(phone.scene.applyCamera).not.toHaveBeenCalled();
    }
    expect(statuses.has("applied")).toBe(true); // Preserve the desktop's actual destination normalization too.
  });

  it("preserves rejection of a disconnected floor and a founder already doing required work", () => {
    const initial = createInitialGameState(); initial.encounters = {};
    initial.rooms.push({ id: "mb9.isolated", roomDefinitionId: "room.hallway", x: 0, y: 0,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const busy = structuredClone(initial);
    busy.environment.founderActivity = { kind: "collect_litter", targetId: "fixture.litter", path: [], pathIndex: 0,
      lastMovedAtFacilityTick: busy.facilityTick, workMinutesRemaining: 1 };
    const room = createPrototypePlayerView(initial, null, false, null).facility.rooms[0]!;
    for (const [state, point] of [[initial, { x: 0, y: 0 }], [busy, { x: room.tileX, y: room.tileY }]] as const) {
      const phone = harness(state, true); const desktop = harness(state, false);
      phone.tap(point); desktop.tap(point);
      expect(phone.move).toHaveBeenCalledOnce(); expect(phone.state).toEqual(desktop.state);
      expect(phone.state.operationReceipts["mb9.move"]!.status).toBe("rejected");
      expect(phone.state.environment.founderActivity).toEqual(state.environment.founderActivity);
    }
  });

  it("makes lawn taps inert like desktop and reports the rejected destination for a brief phone hint", () => {
    const initial = createInitialGameState(); const point = { x: 3, y: 3 };
    const phone = harness(initial, true); const desktop = harness(initial, false);
    phone.tap(point); desktop.tap(point); expect(phone.move).not.toHaveBeenCalled(); expect(desktop.move).not.toHaveBeenCalled();
    expect(phone.state).toBe(initial); expect(desktop.state).toBe(initial);
    expect(phone.scene.bridge.onMobileSelection).toHaveBeenCalledExactlyOnceWith({ kind: "floor", destination: point, accepted: false } satisfies MobileMapSelection);
  });
});
