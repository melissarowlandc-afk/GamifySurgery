import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { openFreshLocalCampaign } from "./fixtures/freshLocalCampaign";

const checkpoints = JSON.parse(readFileSync("tests/fixtures/level-five-integration-checkpoints-20261012.json", "utf8"));
async function settle(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const g = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame;
    const s = g?.scene.getScene("facility-scene");
    return Boolean(s?.renderedLayout && !s.crispZoomPending && !s.load.isLoading() && s.pendingCharacterStills.size === 0);
  }), { timeout: 30_000 }).toBe(true);
}
async function gesture(page: Page, index: number) {
  await page.evaluate(i => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const g = host.__facilityGame, s = g.scene.getScene("facility-scene"), rect = g.canvas.getBoundingClientRect();
    // Wake the real phone frame governor. Direct camera samples isolate renderer
    // retention from menus/occlusion; real touch/picking stays in the other specs.
    g.canvas.dispatchEvent(new PointerEvent("pointermove", { clientX: rect.x + rect.width / 2, clientY: rect.y + rect.height / 2 }));
    for (let step = 0; step < 12; step++) s.applyCamera({ zoom: s.cameraView.zoom, panX: step * 3, panY: -step * 2 }, true);
    s.applyCamera({ zoom: i % 2 ? .9 : 1.4, panX: 0, panY: 0 }, true);
  }, index);
  await page.waitForTimeout(220); await settle(page);
}
async function snapshot(page: Page) {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const g = host.__facilityGame, s = g.scene.getScene("facility-scene"), sources = new Set(), seen = new Set();
    let rgba = 0, ownedReadback = 0, objects = 0, numbers = 0, renderTextures = 0;
    const walk = (o: any) => { if (seen.has(o)) return; seen.add(o); objects++;
      if (Array.isArray(o.commandBuffer)) numbers += o.commandBuffer.length;
      if (o.type === "RenderTexture") renderTextures++;
      if (Array.isArray(o.list)) o.list.forEach(walk); };
    s.children.list.forEach(walk);
    for (const t of Object.values(g.textures.list) as any[]) {
      for (const source of t.source ?? []) if (source.image && !sources.has(source.image)) {
        sources.add(source.image); rgba += source.width * source.height * 4;
      }
      if (/tree-gaps-cleaned|^approved-chair:|^approved-stool:|^room-touchup-tint:|^character-contact-shadow$/.test(t.key))
        ownedReadback += t.data?.byteLength ?? 0;
    }
    return { mode: host.dataset.phoneMemoryMode, proofMode: host.__facilityProof.mode,
      observedHeapPeak: (window as any).__phoneMapMemoryProof?.peak ?? 0,
      objects, numbers, renderTextures, rgba, ownedReadback, textures: Object.keys(g.textures.list).length,
      canvases: host.querySelectorAll("canvas").length,
      canvasWidth: g.canvas.width, canvasHeight: g.canvas.height, rendererType: g.renderer.type,
      rooms: s.bridge.viewModel.rooms.length, viewModels: s.retainedViewModelCount() };
  });
}

for (const level of [4, 5]) for (const reduced of [false, true]) test(`phone L${level} ${reduced ? "reduced" : "normal"} retains bounded pan/zoom memory`, async ({ page, browserName }, info) => {
  test.skip(browserName !== "chromium" || !info.project.name.includes("phone"), "Chrome CDP heap proof; physical WebKit acceptance is separate");
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(reduced => {
    localStorage.setItem("gamify-surgery.phone-memory.v1", JSON.stringify({ version: 1, active: null,
      restarts: [], safeUntil: reduced ? Date.now() + 3_600_000 : 0 }));
    // Chrome-only, test-only peak sampling, including application opening.
    const proof = { peak: 0 }; (window as any).__phoneMapMemoryProof = proof;
    window.setInterval(() => { const bytes = (performance as any).memory?.usedJSHeapSize;
      if (typeof bytes === "number") proof.peak = Math.max(proof.peak, bytes); }, 50);
  }, reduced);
  await openFreshLocalCampaign(page, { ...checkpoints[level === 4 ? "integration-l4" : "integration-build"],
    paused: true, openChartEncounterId: null }, `Phone memory L${level}`);
  // Phone room images use shared DOM Image requests outside Phaser's loader.
  // Their initial decode/registration must finish before a retention baseline.
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await settle(page);
  for (let i = 1; i <= 10; i++) await gesture(page, i);
  const cdp = await page.context().newCDPSession(page);
  const collect = async () => { await cdp.send("HeapProfiler.collectGarbage"); await cdp.send("HeapProfiler.collectGarbage");
    return { ...(await snapshot(page)), heap: (await cdp.send("Runtime.getHeapUsage")).usedSize }; };
  const before = await collect();
  for (let i = 1; i <= 30; i++) await gesture(page, i);
  const after = await collect();
  await info.attach("phone-map-memory.json", { body: JSON.stringify({ origin: new URL(page.url()).origin,
    level, reduced, before, after, heapGrowthBytes: after.heap - before.heap }, null, 2), contentType: "application/json" });
  expect(after.proofMode).toBe("production"); expect(after.mode).toBe(reduced ? "reduced" : "normal");
  expect(after.heap).toBeLessThan(520 * 1024 * 1024); // Pre-change phone range, rounded up; production only.
  expect(after.rooms).toBe(level === 4 ? 42 : 87); expect(after.rendererType).toBe(1); // Phaser.CANVAS
  expect(after.renderTextures).toBe(0); expect(after.ownedReadback).toBe(0);
  expect(after.canvases).toBe(1);
  expect(after.objects).toBe(before.objects); expect(after.numbers).toBe(before.numbers);
  expect(after.textures).toBeLessThanOrEqual(before.textures + 2); expect(after.viewModels).toBeLessThanOrEqual(2);
  expect(after.heap - before.heap).toBeLessThan((process.env.CI ? 16 : 8) * 1024 * 1024);
  expect(after.rgba).toBeLessThan(level === 4 ? (reduced ? 185 : 200) * 1_000_000 : (reduced ? 340 : 370) * 1_000_000);
  expect(after.canvasWidth * after.canvasHeight * 4).toBeLessThanOrEqual(375 * 812 * (reduced ? 1 : 4) * 4);
  expect(after.canvasWidth).toBeLessThanOrEqual(375 * (reduced ? 1 : 2));
  expect(after.canvasHeight).toBeLessThanOrEqual(812 * (reduced ? 1 : 2));
});
