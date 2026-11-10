import { readFileSync } from "node:fs";
import { expect, it, vi } from "vitest";
import { deserializeGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { selectFacilityAssets } from "../mobile/performance/roomAssets";
import { mobileCanvasSize } from "../mobile/performance/presentationPolicy";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import { nativePhaserMemoryClass } from "./nativePhaserMemoryTestSupport";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Display: { Color: { HexStringToColor: (s: string) => ({ color: parseInt(s.replace("#", ""), 16) }) } } } }));
const checkpoints = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
it.each([4, 5])("retains bounded phone L%i native Graphics/objects across repeated pan and settled zoom", level => {
  const state = deserializeGameState(JSON.stringify(checkpoints[level === 4 ? "integration-l4" : "integration-build"]));
  state.paused = true; const before = JSON.stringify(state);
  const model = createPrototypePlayerView(state, null, false, null).facility;
  model.camera = { zoom: 1.4, panX: 0, panY: 0 };
  const Graphics = nativePhaserMemoryClass("gameobjects/graphics/Graphics.js");
  const f = headlessFacilityScene(model, true, false, { graphics: scene => new Graphics(scene), liveObjectsOnly: true });
  f.scene.ensureCharacterStills = () => {}; f.scene.ensureCharacterStill = () => false;
  f.scene.ensureLevelFiveAtlases = () => {}; f.scene.update(0, 16);
  const retained = () => ({ objects: f.objects.length,
    numbers: f.objects.reduce((n, object) => n + (object.kind === "graphics" ? object.commandBuffer.length : 0), 0) });
  const original = retained();
  // Deterministic retained numeric-buffer budgets, independent of GC/JIT/CI load.
  expect(original.numbers * 8).toBeLessThan(level === 4 ? 4_000_000 : 4_500_000);
  expect(original.objects).toBeLessThan(600);
  for (let gesture = 0; gesture < 20; gesture++) {
    const draws = f.stats.worldDraws;
    for (let step = 0; step < 24; step++) {
      f.scene.time.now += 16;
      f.scene.applyCamera({ zoom: 1.4, panX: step * 4, panY: -step * 3 }, true); f.scene.update(0, 16);
    }
    expect(f.stats.worldDraws).toBe(draws);
    for (const zoom of [.9, 1.4]) {
      f.scene.applyCamera({ zoom, panX: 0, panY: 0 }, true);
      f.scene.time.now += 200; f.scene.update(0, 16);
    }
    expect(retained()).toEqual(original); expect(f.scene.retainedViewModelCount()).toBe(1);
  }
  const assets = selectFacilityAssets({ mobile: true, facilityLevel: level, builtRoomIds: model.rooms.map(room => room.definitionId) });
  expect(assets.reduce((n, asset) => n + asset.nativeWidth * asset.nativeHeight * 4, 0))
    .toBeLessThan(level === 4 ? 151_000_000 : 293_000_000);
  expect(mobileCanvasSize(375, 812, 3, 2)).toMatchObject({ backingWidth: 750, backingHeight: 1624 });
  expect(mobileCanvasSize(375, 812, 3, 1)).toMatchObject({ backingWidth: 375, backingHeight: 812 });
  expect(JSON.stringify(state)).toBe(before);
});
