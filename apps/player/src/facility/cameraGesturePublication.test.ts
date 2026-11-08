import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { deserializeGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import { CAMERA_ZOOM_SETTLE_MS } from "./retainedCamera";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Scenes: { Events: { SHUTDOWN: "shutdown" } },
  Display: { Color: { HexStringToColor: (s: string) => ({ color: parseInt(s.replace("#", ""), 16) }) } } } }));
afterEach(() => vi.restoreAllMocks());
const fixtures = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
function setup(level = 5) {
  const state = deserializeGameState(JSON.stringify(fixtures[level === 4 ? "integration-l4" : "integration-build"]));
  state.paused = true;
  const model = createPrototypePlayerView(state, null, false, null).facility;
  model.camera = { zoom: 1.2, panX: 0, panY: 0 };
  const f = headlessFacilityScene(model);
  f.scene.ensureLevelFiveAtlases = () => {}; f.scene.ensureCharacterStills = () => {}; f.scene.ensureCharacterStill = () => false;
  const changed = vi.fn(); f.bridge.onCameraChange = changed;
  return { ...f, changed, state };
}
it.each([4, 5])("keeps immediate Level %i drag/picking with no root publication or repeated frozen character work", level => {
  const f = setup(level), original = JSON.stringify(f.state);
  f.scene.update(0, 16); const characters = vi.spyOn(f.scene, "drawCharacters");
  const before = { ...f.stats };
  f.scene.dragStart = { pointerX: 100, pointerY: 200, panX: f.scene.cameraView.panX, panY: f.scene.cameraView.panY, dragged: false };
  for (let step = 1; step <= 60; step++) {
    f.scene.handlePointerMove({ x: 100 + step * 8, y: 200 - step * 2 }); f.scene.time.now += 100;
    f.scene.update(step * 100, 16);
    expect(f.scene.hasPendingCameraChange()).toBe(true); expect(f.changed).not.toHaveBeenCalled();
    const room = f.bridge.viewModel.rooms.find(r => r.isFounderRoom)!;
    const point = { x: f.scene.layout.originX + (room.tileX + .5) * f.scene.layout.tileSize,
      y: f.scene.layout.originY + (room.tileY + .5) * f.scene.layout.tileSize };
    expect(f.scene.roomAtPointer(point)?.instanceId).toBe(room.instanceId);
  }
  expect(characters).not.toHaveBeenCalled(); expect(f.stats.worldDraws).toBe(before.worldDraws);
  expect(f.stats.created).toBe(before.created);
  const latest = f.scene.getCameraPreference(); f.scene.handlePointerUp({ button: 0 });
  expect(f.changed).toHaveBeenCalledExactlyOnceWith(latest); expect(f.scene.hasPendingCameraChange()).toBe(false);
  f.scene.flushCameraChange(); expect(f.changed).toHaveBeenCalledOnce();
  expect(JSON.stringify(f.state)).toBe(original);
});
it("commits a wheel burst once after quiet settlement and redraws crisp actors once", () => {
  const f = setup(); f.scene.update(0, 16); const characters = vi.spyOn(f.scene, "drawCharacters");
  for (let i = 0; i < 12; i++) { f.scene.time.now += 20; f.scene.handleWheel(-30); f.scene.update(i * 20, 16); }
  expect(f.changed).not.toHaveBeenCalled(); expect(characters).not.toHaveBeenCalled();
  f.scene.time.now += CAMERA_ZOOM_SETTLE_MS + 1; f.scene.update(1000, 16);
  expect(f.changed).toHaveBeenCalledExactlyOnceWith(f.scene.getCameraPreference()); expect(characters).toHaveBeenCalledOnce();
  expect(f.camera.zoom).toBe(1); expect(f.camera.roundPixels).toBe(true);
});
it("cancels cleanly and fences a deferred camera from a different campaign or explicit camera", () => {
  const f = setup(); f.scene.applyCamera({ ...f.scene.cameraView, panX: 90 }, true);
  f.scene.cancelCameraGesture(); expect(f.changed).toHaveBeenCalledOnce(); f.changed.mockClear();
  f.scene.applyCamera({ ...f.scene.cameraView, panX: 140 }, true);
  f.bridge.viewModel = { ...f.bridge.viewModel, campaignId: "new-campaign", camera: { zoom: .7, panX: 0, panY: 0 } };
  f.scene.flushCameraChange(); expect(f.changed).not.toHaveBeenCalled();
  f.scene.refreshLayout(); expect(f.scene.cameraView.zoom).toBe(.7);
  f.scene.applyCamera({ ...f.scene.cameraView, panX: 90 }, true);
  f.bridge.viewModel = { ...f.bridge.viewModel, camera: { zoom: .5, panX: 0, panY: 0 } };
  f.scene.flushCameraChange(); expect(f.changed).not.toHaveBeenCalled();
});
it("refreshes paused actors for a new model while keeping inspect fade live on a retained frame", () => {
  const f = setup(); f.scene.update(0, 16);
  const characters = vi.spyOn(f.scene, "drawCharacters"), inspect = vi.spyOn(f.scene, "renderInspectBox");
  f.scene.update(16, 16); expect(characters).not.toHaveBeenCalled(); expect(inspect).toHaveBeenCalledOnce();
  f.bridge.viewModel = { ...f.bridge.viewModel }; f.scene.update(32, 16); expect(characters).toHaveBeenCalledOnce();
  f.bridge.viewModel = { ...f.bridge.viewModel, paused: false }; f.scene.update(48, 16); f.scene.update(64, 16);
  expect(characters).toHaveBeenCalledTimes(3);
});

it("does not let a delayed React echo replace a newer in-progress gesture", () => {
  const f = setup();
  f.scene.applyCamera({ ...f.scene.cameraView, zoom: 1.4 });
  const published = f.changed.mock.calls[0]![0]; f.changed.mockClear();
  f.scene.applyCamera({ ...f.scene.cameraView, zoom: 1.6 }, true);
  f.bridge.viewModel = { ...f.bridge.viewModel, camera: published };
  f.scene.refreshLayout(); expect(f.scene.cameraView.zoom).toBe(1.6); expect(f.changed).not.toHaveBeenCalled();
  f.scene.cancelCameraGesture(); expect(f.changed.mock.calls[0]![0].zoom).toBe(1.6);
});

it.each([.5, 1.6])("drags the phone Build ghost in screen coordinates at zoom %s, including after settlement", zoom => {
  const state = deserializeGameState(JSON.stringify(fixtures["integration-build"])); state.paused = true;
  const model = createPrototypePlayerView(state, null, false, null, true).facility;
  model.placement = { definitionId: "room.waiting", displayName: "Waiting Room", width: 1, height: 1, orientation: 0 };
  const f = headlessFacilityScene(model, true), intent = vi.fn(), handlers = new Map<string, (...args: any[]) => void>();
  Object.assign(f.bridge, { mobileBuild: { ghost: { x: 2, y: 2, valid: true, reason: null, cost: 0 },
    initialGhost: { x: 2, y: 2 }, hallway: null, doors: [], selectedDoorId: null, onIntent: intent } });
  f.scene.input = { addPointer: vi.fn(), on: (event: string, callback: (...args: any[]) => void) => handlers.set(event, callback) };
  f.scene.events = { once: vi.fn() }; Object.assign(f.scene.game.canvas, { addEventListener: vi.fn(), removeEventListener: vi.fn() });
  f.scene.bindMobileInput(); f.scene.applyCamera({ zoom, panX: 91, panY: -83 });
  // Keep the finger and whole drag away from the phone's edge-pan region.
  f.scene.applyCamera({ zoom, panX: f.scene.cameraView.panX + 195 - (f.scene.layout.originX + 2.5 * f.scene.layout.tileSize),
    panY: f.scene.cameraView.panY + 300 - (f.scene.layout.originY + 2.5 * f.scene.layout.tileSize) });
  for (const settled of [false, true]) {
    if (settled) { f.scene.time.now += CAMERA_ZOOM_SETTLE_MS + 1; f.scene.refreshLayout(); }
    const { originX, originY, tileSize } = f.scene.layout;
    const start = { id: 1, button: 0, x: originX + 2.5 * tileSize, y: originY + 2.5 * tileSize };
    const end = { ...start, x: start.x + 3 * tileSize, y: start.y + 2 * tileSize };
    handlers.get("pointerdown")!(start); expect(f.scene.phoneBuildInput.ownsDrag).toBe(true);
    handlers.get("pointermove")!(end);
    expect(intent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 5, y: 4 } });
    handlers.get("pointerup")!(end);
    expect(intent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 5, y: 4 } });
  }
});
