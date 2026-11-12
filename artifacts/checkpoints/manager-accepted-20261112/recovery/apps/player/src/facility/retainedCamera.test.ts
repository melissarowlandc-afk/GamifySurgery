import { afterEach, describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deserializeGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import { CAMERA_ZOOM_SETTLE_MS, retainedCameraTransform, projectCameraPoint, unprojectCameraPoint } from "./retainedCamera";
import { getFacilityWorldSignature } from "./facilityWorldSignature";
import { assertPerformanceBudgets, ciTime, runPerformanceTest } from "../../../../tests/support/performanceBudget";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Display: { Color: { HexStringToColor: (s: string) => ({ color: parseInt(s.replace("#", ""), 16) }) } } } }));
afterEach(() => vi.restoreAllMocks());

const checkpoints = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
const model = (level = 4, build = false) => {
  const state = deserializeGameState(JSON.stringify(checkpoints[level === 4 ? "integration-l4" : "integration-build"]));
  const result = createPrototypePlayerView(state, null, false, null, build).facility;
  result.camera = { zoom: 1.4, panX: 0, panY: 0 }; return result;
};

it("matches the installed native Phaser camera matrix and inverse, including extreme zooms and negative origins", () => {
  // Only platform feature detection is stubbed. Camera/matrix/inverse math is
  // the installed Phaser implementation, not a reimplementation of the formula.
  const require = createRequire(import.meta.url), root = dirname(require.resolve("phaser/package.json"));
  const path = join(root, "src/device/index.js"), previous = require.cache[path];
  const before = new Set(Object.keys(require.cache));
  require.cache[path] = { id: path, filename: path, loaded: true, exports: { features: {}, os: {}, browser: {}, canvasFeatures: {}, input: {} } } as NodeJS.Module;
  try {
    const Camera = require(join(root, "src/cameras/2d/Camera.js"));
    const camera = new Camera(0, 0, 900, 500);
    let seed = 17;
    const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 2 ** 32);
    for (let i = 0; i < 300; i++) {
      const drawn = { originX: Math.floor(random() * 4000 - 2000), originY: Math.floor(random() * 4000 - 2000), tileSize: 1 + Math.floor(random() * 100) };
      const projected = { originX: Math.floor(random() * 4000 - 2000), originY: Math.floor(random() * 4000 - 2000), tileSize: 1 + Math.floor(random() * 100) };
      const world = { x: drawn.originX + random() * 500, y: drawn.originY + random() * 500 };
      const transform = retainedCameraTransform(drawn, projected), screen = projectCameraPoint(world, drawn, projected);
      camera.setOrigin(0, 0).setZoom(transform.zoom).setScroll(transform.scrollX, transform.scrollY).setRoundPixels(transform.zoom === 1); camera.preRender();
      const actual = camera.matrix.transformPoint(world.x, world.y), inverse = camera.getWorldPoint(screen.x, screen.y);
      // Phaser stores its render matrix in Float32Array. Sub-hundredth-pixel
      // error is below raster precision even at the tested extreme scales.
      expect(Math.abs(actual.x - screen.x)).toBeLessThan(0.01); expect(Math.abs(actual.y - screen.y)).toBeLessThan(0.01);
      expect(Math.abs(inverse.x - world.x)).toBeLessThan(0.01); expect(Math.abs(inverse.y - world.y)).toBeLessThan(0.01);
      expect(unprojectCameraPoint(screen, drawn, projected).x).toBeCloseTo(world.x, 7);
    }
  } finally {
    for (const key of Object.keys(require.cache)) if (!before.has(key) && key.replaceAll("\\", "/").includes("/node_modules/phaser/")) delete require.cache[key];
    if (previous) require.cache[path] = previous; else delete require.cache[path];
  }
});

describe.each([4, 5])("actual Level %i retained world", level => {
  it.each([false, true])("pans with zero world rebuilds/display-object churn and exact picking (phone=%s)", mobile => runPerformanceTest(() => {
    const f = headlessFacilityScene(model(level), mobile), start = { ...f.stats };
    const timings: number[] = [];
    for (let i = 0; i < 100; i++) {
      f.scene.time.now += 16;
      const at = performance.now();
      f.scene.applyCamera({ ...f.scene.cameraView, panX: f.scene.cameraView.panX + (i < 50 ? 2 : -2), panY: f.scene.cameraView.panY + (i < 50 ? 2 : -2) });
      f.scene.refreshLayout();
      timings.push(performance.now() - at);
      const room = f.bridge.viewModel.rooms.find(r => r.isFounderRoom)!;
      const point = { x: f.scene.layout.originX + (room.tileX + 1.5) * f.scene.layout.tileSize,
        y: f.scene.layout.originY + (room.tileY + 1.5) * f.scene.layout.tileSize };
      expect(f.scene.gridPointAtPointer(point)).toEqual({ x: room.tileX + 1, y: room.tileY + 1 });
      expect(f.scene.roomAtPointer(point)?.instanceId).toBe(room.instanceId);
    }
    f.scene.time.now += CAMERA_ZOOM_SETTLE_MS + 1; f.scene.refreshLayout();
    expect(f.stats.worldDraws).toBe(start.worldDraws); expect(f.stats.created).toBe(start.created); expect(f.stats.destroyed).toBe(start.destroyed);
    expect(f.camera.zoom).toBe(1);
    // Count assertions are the deterministic guard. Leave CPU headroom for
    // hosted CI contention while detecting reintroduced gesture geometry work.
    assertPerformanceBudgets([{ label: "retained camera pan median", actualMs: timings.sort((a, b) => a - b)[50]!, limitMs: ciTime(4, 3) }]);
  }));

  it.each([false, true])("zooms immediately, paints once after settling, and matches fresh resting geometry (phone=%s)", mobile => {
    const f = headlessFacilityScene(model(level), mobile, true), start = { ...f.stats };
    for (let i = 0; i < 20; i++) {
      f.scene.time.now += 20; f.scene.applyCamera({ ...f.scene.cameraView, zoom: i % 2 ? 1.7 : 1.5 }); f.scene.refreshLayout();
      expect(f.stats.worldDraws).toBe(start.worldDraws); expect(f.stats.created).toBe(start.created);
      const drawn = f.scene.renderedLayout, screen = f.scene.layout;
      expect(f.camera.zoom).toBe(screen.tileSize / drawn.tileSize);
    }
    f.scene.dragStart = { dragged: true }; f.scene.time.now += 1000; f.scene.refreshLayout();
    expect(f.stats.worldDraws).toBe(start.worldDraws); // Holding still cannot trigger a mid-gesture redraw.
    f.scene.dragStart = null; f.scene.refreshLayout();
    expect(f.stats.worldDraws).toBe(start.worldDraws + 1); expect(f.camera.zoom).toBe(1); expect(f.camera.scrollX).toBe(0); expect(f.camera.scrollY).toBe(0);
    f.scene.refreshLayout(); expect(f.stats.worldDraws).toBe(start.worldDraws + 1);
    const control = headlessFacilityScene({ ...f.bridge.viewModel, camera: { ...f.scene.cameraView } }, mobile, true);
    for (const field of ["terrainGraphics", "worldGraphics", "architectureGraphics", "landscapeGraphics"])
      expect(f.scene[field].commandBuffer, field).toEqual(control.scene[field].commandBuffer);
    for (const field of ["fixtureGraphics", "roomFixtureGraphics", "wallDecorGraphics"])
      for (const [key, g] of control.scene[field])
        expect(f.scene[field].get(key)?.commandBuffer, `${field}:${key}`).toEqual(g.commandBuffer);
    expect(f.scene.roomTexts.map((t: any) => [t.x, t.y, t.text, t.visible]))
      .toEqual(control.scene.roomTexts.map((t: any) => [t.x, t.y, t.text, t.visible]));
    expect(f.scene.layout).toEqual(control.scene.layout);
  });
});

it("separates camera echoes from static changes, defers actual edits during gestures, then rebuilds once", () => {
  const f = headlessFacilityScene(model()), before = f.stats.worldDraws;
  const original = getFacilityWorldSignature(f.bridge.viewModel, false);
  f.scene.applyCamera({ ...f.scene.cameraView, panX: 50 });
  f.bridge.viewModel = { ...f.bridge.viewModel, camera: { ...f.scene.cameraView }, facilityTick: f.bridge.viewModel.facilityTick + 1 };
  expect(getFacilityWorldSignature(f.bridge.viewModel, false)).toBe(original);
  f.scene.refreshLayout(); expect(f.stats.worldDraws).toBe(before);
  f.bridge.viewModel = { ...f.bridge.viewModel, rooms: f.bridge.viewModel.rooms.map((r, i) => i ? r : { ...r, upgradeLevel: 3 }) };
  f.scene.refreshLayout(); expect(f.stats.worldDraws).toBe(before);
  f.scene.time.now += CAMERA_ZOOM_SETTLE_MS + 1; f.scene.refreshLayout();
  expect(f.stats.worldDraws).toBe(before + 1);
});

it("keeps room-menu/pin DOM anchors and mobile room picks in screen pixels during a zoom", () => {
  const m = model(4, true), target = m.rooms.find(r => r.isFounderRoom)!;
  m.rooms = [target]; m.selectedRoomInstanceId = target.instanceId;
  m.alertPins = [{ id: "retained.pin", target: { kind: "room", id: target.instanceId } } as NonNullable<typeof m.alertPins>[number]];
  const f = headlessFacilityScene(m, true), menu = vi.fn(), pins = vi.fn(), selected = vi.fn();
  Object.assign(f.bridge, { onSelectedRoomRectChange: menu, onAlertPinPositionsChange: pins, onSelectRoom: selected });
  f.scene.applyCamera({ ...f.scene.cameraView, zoom: 2, panY: 0 });
  f.scene.reportSelectedRoomRect(); f.scene.reportAlertPinPositions();
  const rect = { x: f.scene.layout.originX + target.tileX * f.scene.layout.tileSize,
    y: f.scene.layout.originY + target.tileY * f.scene.layout.tileSize,
    width: target.width * f.scene.layout.tileSize, height: target.height * f.scene.layout.tileSize };
  expect(menu).toHaveBeenLastCalledWith(rect);
  expect(pins).toHaveBeenLastCalledWith([{ id: "retained.pin", x: Math.round(rect.x + rect.width / 2),
    y: Math.round(rect.y + Math.min(rect.height / 2, f.scene.layout.tileSize)) }]);
  f.scene.selectMobileBuildTarget({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  expect(selected).toHaveBeenCalledWith(target.instanceId);
  const point = f.scene.worldToScreen(f.scene.toPixels({ tileX: target.tileX, tileY: target.tileY, width: 1, height: 1 }));
  expect(point.x).toBe(rect.x); expect(point.y).toBe(rect.y);
});

it("picks retained character bitmaps, seat contacts and build doors after pan/zoom without repainting", () => {
  const m = model(4, true); m.buildDoorTool = "place";
  const f = headlessFacilityScene(m, true), key = "character:founder";
  const actor = f.scene.add.image(50, 80).setName("actor");
  f.scene.characterBitmapContainers.set(key, f.scene.add.container(0, 0).add(actor));
  const start = f.stats.worldDraws;
  f.scene.applyCamera({ ...f.scene.cameraView, zoom: 2.1, panX: 80, panY: 250 });
  const characterPoint = f.scene.worldToScreen({ x: 66, y: 96 });
  expect(f.scene.characterAtPointer(characterPoint)).toBe(key);
  expect(f.scene.mobileSelectionAtPoint(characterPoint)?.kind).toBe("character");
  const chair = f.bridge.viewModel.founderChairs!.find(c => c.kind === "front_desk_public")!;
  expect(chair).toBeDefined();
  const seat = f.scene.worldToScreen(f.scene.founderSeatScreenPoint(chair));
  expect(f.scene.ordinaryChairAtPointer(seat)).toEqual(chair);
  const door = f.scene.getBuildDoorInteractionTargets()[0]; expect(door).toBeDefined();
  const bounds = door.geometry.hitRegion;
  const doorPoint = f.scene.worldToScreen({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 });
  expect(f.scene.doorInteractionAtPointer(doorPoint)).toEqual(door);
  expect(f.stats.worldDraws).toBe(start);
});

it("keeps a Build placement footprint at the picked tile and preserves seat glide progress through a crisp rebase", () => {
  const m = model(4, true);
  m.placement = { definitionId: "room.waiting", displayName: "Waiting Room", width: 4, height: 3, orientation: 0 };
  const f = headlessFacilityScene(m, false, true);
  const seat = { drawn: { x: 50, y: 80 }, pose: "test", glide: { from: { x: 40, y: 60 }, elapsedMs: 70 } };
  f.scene.characterSeatSettles.set("test", seat);
  const drawn = { ...f.scene.worldLayout }, before = f.stats.worldDraws;
  f.scene.applyCamera({ ...f.scene.cameraView, zoom: 2 });
  const tile = { x: 4, y: 5 };
  const pointer = { x: f.scene.layout.originX + (tile.x + 0.5) * f.scene.layout.tileSize,
    y: f.scene.layout.originY + (tile.y + 0.5) * f.scene.layout.tileSize };
  f.scene.handlePointerMove(pointer);
  expect(f.scene.placementGhost).toMatchObject({ tileX: tile.x, tileY: tile.y });
  const footprint = f.scene.ghostGraphics.commandBuffer.find((c: any[]) => c[0] === "fillRect");
  expect(footprint.slice(1)).toEqual([drawn.originX + tile.x * drawn.tileSize, drawn.originY + tile.y * drawn.tileSize,
    m.placement.width * drawn.tileSize, m.placement.height * drawn.tileSize]);
  const shownBefore = f.scene.worldToScreen(seat.drawn), fromBefore = f.scene.worldToScreen(seat.glide.from);
  expect(f.stats.worldDraws).toBe(before);
  f.scene.time.now += CAMERA_ZOOM_SETTLE_MS + 1; f.scene.refreshLayout();
  expect(f.scene.characterSeatSettles.get("test")).toEqual({ ...seat, drawn: shownBefore, glide: { ...seat.glide, from: fromBefore } });
});

it("restores camera preferences and zoom limits, replacing a campaign even while the previous drag is held", () => {
  const f = headlessFacilityScene(model()), before = f.stats.worldDraws;
  f.scene.applyCamera({ ...f.scene.cameraView, zoom: 2, panX: 230, panY: 20 });
  const preference = f.scene.getCameraPreference(); expect(preference).toEqual(f.scene.cameraView);
  const restored = headlessFacilityScene({ ...f.bridge.viewModel, camera: preference });
  expect(restored.scene.layout).toEqual(f.scene.layout);
  f.scene.dragStart = { dragged: true };
  f.bridge.viewModel = { ...f.bridge.viewModel, campaignId: "campaign.next", camera: { zoom: 100, panX: 0, panY: 0 } };
  f.scene.refreshLayout(); expect(f.stats.worldDraws).toBe(before + 1); expect(f.scene.cameraView.zoom).toBe(2.5);
  f.bridge.viewModel = { ...f.bridge.viewModel, camera: { zoom: -100, panX: 0, panY: 0 } };
  f.scene.refreshLayout(); expect(f.scene.cameraView.zoom).toBe(0.1);
});

it("does not let the previous React camera echo swallow rapid input between Phaser frames", () => {
  const f = headlessFacilityScene(model(), true);
  for (let step = 1; step <= 12; step++) {
    f.bridge.viewModel = { ...f.bridge.viewModel, camera: { ...f.scene.cameraView } };
    f.scene.applyCamera({ ...f.scene.cameraView, zoom: 1.4 + step * .05, panX: step * 2 });
    expect(f.scene.cameraView.zoom).toBeCloseTo(1.4 + step * .05, 8);
    expect(f.scene.cameraView.panX).toBe(step * 2);
  }
  expect(f.stats.worldDraws).toBe(1);
});
