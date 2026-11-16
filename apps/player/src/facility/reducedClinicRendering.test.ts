import { expect, it, vi } from "vitest";
import { createPrototypePlayerView } from "../session/viewModels";
import { publicCloudOpeningWorkload } from "../session/cloud/openingPerformanceTestSupport";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import { nativePhaserMemoryClass } from "./nativePhaserMemoryTestSupport";
import { graphicsOutsideCamera, measureGraphicsBounds } from "./graphicsViewportCulling";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Display: { Color: { HexStringToColor: (s: string) => ({ color: parseInt(s.replace("#", ""), 16) }) } } } }));
vi.mock("../mobile/performance/phoneMemoryPolicy", async original => ({ ...await original<Record<string, unknown>>(),
  phoneMemoryProfile: () => ({ mode: "reduced", textureBytes: 8 * 1024 * 1024, textureCount: 32, keepLiveFamilies: false, maxDpr: 1 }) }));

it("culls native offscreen room streams without raster caches or full-world rebuilds while panning a large public clinic", () => {
  const state = publicCloudOpeningWorkload(), before = JSON.stringify(state);
  const model = createPrototypePlayerView(state, null, false, null).facility;
  model.camera = { zoom: 2.2, panX: 0, panY: 0 };
  const Graphics = nativePhaserMemoryClass("gameobjects/graphics/Graphics.js");
  const f = headlessFacilityScene(model, true, false, { graphics: scene => new Graphics(scene), liveObjectsOnly: true });
  f.scene.ensureCharacterStill = () => false; f.scene.ensureCharacterStills = () => {};
  f.scene.update(0, 16);
  const top = f.scene.screenToWorld({ x: 0, y: 0 }), bottom = f.scene.screenToWorld({ x: f.scene.scale.width, y: f.scene.scale.height });
  const camera = { worldView: { x: top.x, y: top.y, width: bottom.x - top.x, height: bottom.y - top.y } };
  const rooms = [...f.scene.phoneRoomFloors.values()] as any[];
  expect(rooms).toHaveLength(model.rooms.length);
  const retained = rooms.reduce((sum, graphics) => sum + graphics.commandBuffer.length, 0);
  const replayed = rooms.filter(graphics => !graphicsOutsideCamera(measureGraphicsBounds(graphics.commandBuffer), graphics, camera))
    .reduce((sum, graphics) => sum + graphics.commandBuffer.length, 0);
  expect(retained).toBeGreaterThan(10_000); expect(replayed).toBeLessThan(retained * .8);
  const draws = f.stats.worldDraws;
  for (let n = 0; n < 60; n++) {
    f.scene.time.now += 16;
    f.scene.applyCamera({ zoom: 2.2, panX: n * 3, panY: -n * 2 }, true); f.scene.update(0, 16);
  }
  expect(f.stats.worldDraws).toBe(draws); expect(f.scene.phoneRoomFloors.size).toBe(model.rooms.length);
  expect(f.objects.filter(object => object.type === "RenderTexture")).toHaveLength(0);
  expect(f.scene.retainedViewModelCount()).toBe(1); expect(JSON.stringify(state)).toBe(before);
});

it("routes the reduced-mode build grid to the architecture layer while authored art is still loading", () => {
  const model = createPrototypePlayerView(publicCloudOpeningWorkload(), null, false, null).facility;
  model.buildMode = true;
  const f = headlessFacilityScene(model, true, false);
  f.scene.ensureCharacterStill = () => false; f.scene.ensureCharacterStills = () => {};
  f.scene.canRenderAuthoredEnvironment = () => false;
  const grid = vi.spyOn(f.scene, "drawBuildGridOverlay"); f.scene.drawWorld();
  expect(grid).toHaveBeenCalledWith(f.scene.architectureGraphics, model.gridColumns, model.gridRows);
  expect(f.scene.phoneRoomFloors.size).toBe(model.rooms.length);
});
