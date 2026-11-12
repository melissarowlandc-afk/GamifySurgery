import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { resumeLocalCampaign } from "./helpers";
import { openFreshLocalCampaign } from "./fixtures/freshLocalCampaign";

// Public checkpoints only. Each Playwright test owns a fresh disposable browser
// context; this never opens or modifies an owner's persistent browser profile.
const checkpoints = JSON.parse(readFileSync("tests/fixtures/level-five-integration-checkpoints-20261012.json", "utf8"));
// The opt-in development allowance is diagnostic only. The production desktop
// ceiling stays 25ms, including CI; phone keeps its existing hosted allowance.
const hostedTime = (ms: number, mode: string, phone: boolean) => mode === "production" && !phone ? ms :
  ms * (process.env.CI ? 2 : 1) * (!phone && mode === "development" && process.env.GAMIFY_MAP_DEV_ALLOWANCE === "1" ? 2 : 1);

async function openFixture(page: Page, level: number) {
  const state = { ...checkpoints[level === 4 ? "integration-l4" : "integration-build"], paused: true, openChartEncounterId: null };
  const name = `Map performance Level ${level}`;
  await openFreshLocalCampaign(page, state, name);
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await expect.poll(() => page.evaluate(() => {
    const game = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame;
    return Boolean(game?.scene.getScene("facility-scene")?.renderedLayout);
  })).toBe(true);
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, zoom: 1.2, panX: 0, panY: 0 });
  });
  await expect.poll(() => page.evaluate(() => {
    const game = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame;
    const scene = game.scene.getScene("facility-scene");
    const art = scene.bridge.mobileInput ? scene.phoneArtLoadingStatus() : null;
    return !scene.load.isLoading() && scene.pendingCharacterStills.size === 0 && !scene.crispZoomPending &&
      (!art || art.pendingRooms === 0 && !art.painting);
  }), { timeout: 30_000 }).toBe(true);
  return page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return scene.bridge.mobileInput ? scene.phoneArtLoadingStatus() : null;
  });
}

async function unobscuredPoint(page: Page) {
  const find = () => page.evaluate(() => {
    const canvas = document.querySelector("[data-testid='facility-canvas'] canvas")!;
    const game = (canvas.parentElement as any).__facilityGame;
    const scene = game.scene.getScene("facility-scene"), model = scene.bridge.viewModel;
    const rect = canvas.getBoundingClientRect();
    const dx = Math.min(100, rect.width * .16), dy = Math.min(70, rect.height * .12);
    const failures: Record<string, number> = {};
    for (let fy = .25; fy <= .85; fy += .05) for (let fx = .15; fx <= .75; fx += .05) {
      const x = rect.x + rect.width * fx, y = rect.y + rect.height * fy;
      // Check the complete scripted path, not just its start. Real UI must
      // remain usable; do not hide dialogs or put an input layer above them.
      const pathClear = Array.from({ length: 49 }, (_, i) => ({
        x: x + dx * Math.sin(i / 48 * Math.PI), y: y - dy * i / 48,
      })).every(p => {
        const element = document.elementFromPoint(p.x, p.y);
        if (element === canvas) return true;
        const reason = element ? `${element.tagName}.${element.className}` : "outside viewport";
        failures[reason] = (failures[reason] ?? 0) + 1; return false;
      });
      if (!pathClear) continue;
      const local = { x: (x - rect.x) * game.scale.width / rect.width, y: (y - rect.y) * game.scale.height / rect.height };
      const tile = scene.gridPointAtPointer(local);
      const interactiveTile = tile && ((model.litterItems ?? []).some((item: any) => item.location.x === tile.x && item.location.y === tile.y) ||
        model.waterCooler?.location.x === tile.x && model.waterCooler?.location.y === tile.y);
      // A performance drag must not issue cleaning/refill/seating commands.
      if (!interactiveTile && !scene.frontDeskSeatInteractionAtPointer(local))
        return { point: { x, y, width: rect.width, height: rect.height }, failures };
      failures["immediate gameplay action"] = (failures["immediate gameplay action"] ?? 0) + 1;
    }
    return { point: null, failures };
  });
  let result = await find();
  await expect.poll(async () => {
    result = await find(); return result.point !== null;
  }, { timeout: 30_000, message: `Map input must be clear of opening UI: ${JSON.stringify(result.failures)}` }).toBe(true);
  return result.point!;
}

async function instrument(page: Page) {
  await page.evaluate(() => {
    const game = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame;
    const scene = game.scene.getScene("facility-scene");
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const stats = { draws: 0, objects: 0, frames: [] as number[], longTasks: [] as number[],
      stages: {} as Record<string, number[]>, textureAdds: 0, loadStarts: 0,
      active: false, start: 0, counts: host.__facilityProof.readCounts() };
    const wrap = (target: any, key: string, stage: string) => {
      const original = target[key];
      target[key] = function (...args: any[]) {
        if (!stats.active) return original.apply(this, args);
        const at = performance.now(); try { return original.apply(this, args); }
        finally { (stats.stages[stage] ??= []).push(performance.now() - at); }
      };
    };
    for (const key of ["update", "handlePointerMove", "refreshLayout", "drawCharacters", "reportAlertPinPositions", "reportSelectedRoomRect", "drawEarningsPopups"])
      wrap(scene, key, key);
    // Actual Canvas dispatch/raster submission plus the poststep shade check.
    wrap(game.renderer, "render", "canvasRender");
    wrap(scene, "getCameraPreference", "cameraReconcileRead");
    game.textures.on("addtexture", () => { if (stats.active) stats.textureAdds++; });
    scene.load.on("start", () => { if (stats.active) stats.loadStarts++; });
    const draw = scene.drawWorld;
    scene.drawWorld = function (...args: unknown[]) { if (stats.active) stats.draws++; return draw.apply(this, args); };
    for (const key of ["image", "sprite", "text", "graphics", "container", "tileSprite"]) {
      const original = scene.add[key];
      scene.add[key] = function (...args: unknown[]) { if (stats.active) stats.objects++; return original.apply(this, args); };
    }
    game.events.on("postrender", () => { if (stats.active) stats.frames.push(performance.now()); });
    const observer = typeof PerformanceObserver === "function" ? new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (stats.active && entry.startTime >= stats.start) stats.longTasks.push(entry.duration);
    }) : null;
    if (typeof PerformanceObserver === "function" && PerformanceObserver.supportedEntryTypes.includes("longtask")) observer?.observe({ type: "longtask" });
    scene.__mapPerformance = stats;
  });
}
async function startMeasurement(page: Page) {
  await page.evaluate(() => {
    const s = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene").__mapPerformance;
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    Object.assign(s, { draws: 0, objects: 0, frames: [], longTasks: [], stages: {}, textureAdds: 0, loadStarts: 0, active: true,
      start: performance.now(), counts: host.__facilityProof.readCounts() });
  });
}
async function readMeasurement(page: Page) {
  return page.evaluate(() => {
    const game = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame;
    const scene = game.scene.getScene("facility-scene"), s = scene.__mapPerformance;
    const frames: number[] = s.frames.slice(1).map((at: number, i: number) => at - s.frames[i]);
    const ordered = [...frames].sort((a, b) => a - b);
    const room = scene.bridge.viewModel.rooms.find((r: any) => r.isFounderRoom);
    const logical = { x: room.tileX + .5, y: room.tileY + .5 };
    const screen = { x: scene.layout.originX + logical.x * scene.layout.tileSize,
      y: scene.layout.originY + logical.y * scene.layout.tileSize };
    const world = scene.toPixels({ tileX: logical.x, tileY: logical.y, width: 0, height: 0 });
    const native = scene.cameras.main.matrix.transformPoint(world.x, world.y);
    const host = document.querySelector("[data-testid='facility-canvas']") as any, counts = host.__facilityProof.readCounts();
    const stages = Object.fromEntries(Object.entries(s.stages as Record<string, number[]>).map(([key, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return [key, { calls: values.length, meanMs: values.reduce((a, b) => a + b, 0) / values.length,
        p95Ms: sorted[Math.floor((sorted.length - 1) * .95)] ?? 0, maxMs: Math.max(0, ...values) }];
    }));
    return { draws: s.draws as number, objects: s.objects as number, frames, stages,
      textureAdds: s.textureAdds as number, loadStarts: s.loadStarts as number,
      proofMode: host.__facilityProof.mode as string,
      canvasRenders: counts.canvasRenders - s.counts.canvasRenders as number,
      viewModelChanges: counts.viewModelChanges - s.counts.viewModelChanges as number,
      p95Ms: ordered[Math.floor((ordered.length - 1) * .95)] ?? 0, maxMs: Math.max(0, ...frames),
      longTasks: [...s.longTasks] as number[], nativeProjectionError: Math.hypot(native.x - screen.x, native.y - screen.y),
      picked: scene.roomAtPointer(screen)?.instanceId as string, expectedPick: room.instanceId as string,
      tileSize: scene.layout.tileSize as number, tick: scene.bridge.viewModel.facilityTick as number,
      rooms: scene.bridge.viewModel.rooms.length as number, camera: { ...scene.cameraView },
      backing: { width: game.canvas.width as number, height: game.canvas.height as number } };
  });
}
const frame = (page: Page) => page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
async function renderedFrame(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve => {
    (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.events.once("postrender", () => resolve());
  }));
}
async function stopMeasurement(page: Page) {
  await page.evaluate(() => {
    (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene").__mapPerformance.active = false;
  });
}

for (const level of [4, 5]) test(`Level ${level} map drag and wheel retain the world and meet the frame budget`, async ({ page }, info) => {
  test.skip(!["desktop-chrome", "phone-chrome"].includes(info.project.name), "One desktop and one phone frame-time proof per fixture");
  const phone = info.project.name === "phone-chrome";
  await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1600, height: 1000 });
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  const art = await openFixture(page, level);
  const mode = await page.evaluate(() => (document.querySelector("[data-testid='facility-canvas']") as any).__facilityProof?.mode as string);
  expect(["development", "production"]).toContain(mode);
  if (process.env.GAMIFY_MAP_PERFORMANCE_BUILD === "production") expect(mode).toBe("production");
  if (phone) {
    await info.attach("phone-opening-art.json", { body: JSON.stringify({ level, mode, art }), contentType: "application/json" });
    expect(art.firstRoomMs).not.toBeNull();
    expect(art.firstRoomMs).toBeLessThan(hostedTime(2_500, mode, true));
    expect(art.settledMs).not.toBeNull();
    expect(art.settledMs).toBeLessThan(hostedTime(8_000, mode, true));
    expect(art.missingRoomSources).toBe(0); expect(art.failedCharacters).toBe(0); expect(art.cache.decodeTimeouts).toBe(0);
  }
  const point = await unobscuredPoint(page);
  await page.mouse.move(point.x, point.y); // Wake the phone's paused-map input burst.
  await renderedFrame(page); await renderedFrame(page);
  await instrument(page); await startMeasurement(page);
  await page.mouse.down();
  for (let step = 1; step <= 48; step++) {
    await page.mouse.move(point.x + Math.min(100, point.width * .16) * Math.sin(step / 48 * Math.PI),
      point.y - Math.min(70, point.height * .12) * step / 48);
    await frame(page);
  }
  // Sample before release: the one final preference publication is expected
  // on pointer-up and must not be mistaken for continuous React camera churn.
  await renderedFrame(page);
  const pan = await readMeasurement(page); await stopMeasurement(page);
  await page.mouse.up(); await renderedFrame(page);
  await info.attach("map-pan-metrics.json", { body: JSON.stringify({ origin: new URL(page.url()).origin, level, phone, mode,
    effectiveP95BudgetMs: hostedTime(phone ? 50 : 25, mode, phone), pan }, null, 2), contentType: "application/json" });
  expect(pan.rooms).toBe(level === 4 ? 42 : 87);
  expect(pan.draws).toBe(0); expect(pan.objects).toBe(0);
  expect(pan.frames.length).toBeGreaterThan(10);
  expect(pan.viewModelChanges).toBe(0);
  expect(pan.p95Ms).toBeLessThan(hostedTime(phone ? 50 : 25, mode, phone));
  expect(pan.picked).toBe(pan.expectedPick); expect(pan.nativeProjectionError).toBeLessThan(.01);

  const zoomPoint = await unobscuredPoint(page);
  await page.mouse.move(zoomPoint.x, zoomPoint.y); await renderedFrame(page); await startMeasurement(page);
  for (let step = 0; step < 24; step++) {
    await page.mouse.wheel(0, step < 8 || step >= 16 ? -60 : 60);
    await frame(page);
  }
  await renderedFrame(page);
  const zoom = await readMeasurement(page);
  expect(zoom.draws).toBe(0); expect(zoom.objects).toBe(0);
  expect(zoom.frames.length).toBeGreaterThan(6);
  expect(zoom.p95Ms).toBeLessThan(hostedTime(phone ? 50 : 25, mode, phone));
  expect(zoom.picked).toBe(zoom.expectedPick); expect(zoom.nativeProjectionError).toBeLessThan(.01);
  await expect.poll(() => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return !scene.crispZoomPending && scene.cameras.main.zoom === 1;
  })).toBe(true);
  const settled = await readMeasurement(page); await stopMeasurement(page);
  expect(settled.draws).toBe(1); expect(settled.tick).toBe(pan.tick);
  expect(settled.nativeProjectionError).toBeLessThan(.01);
  await info.attach("map-pan-zoom-metrics.json", { body: JSON.stringify({ origin: new URL(page.url()).origin, level, phone,
    targets: { desktopFps: 60, phoneFps: 30, localP95Ms: phone ? 50 : 25,
      effectiveP95BudgetMs: hostedTime(phone ? 50 : 25, mode, phone) },
    mode, developmentAllowance: process.env.GAMIFY_MAP_DEV_ALLOWANCE === "1" && mode === "development", pan, zoom, settled }, null, 2), contentType: "application/json" });
  await page.getByTestId("facility-canvas").screenshot({ path: info.outputPath("map-at-rest.png") });
  // Persistence uses the ordinary preference/pagehide path. The init script
  // seeds only once, so reload cannot reinstall the fixture over the journal.
  await page.reload(); await resumeLocalCampaign(page, `Map performance Level ${level}`);
  await expect.poll(() => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene.getScene("facility-scene");
    return scene?.getCameraPreference();
  })).toEqual(settled.camera);
  expect(errors).toEqual([]);
});
