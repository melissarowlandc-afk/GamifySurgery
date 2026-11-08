import { expect, test, type Page } from "@playwright/test";
import { startClinic } from "./helpers";

// Existing opt-in dev proof supplies the real Phaser scene; no codec imports,
// gameplay mutation, copied player storage, network service or extra runtime API.
async function cameraSnapshot(page: Page) {
  return page.evaluate(() => {
    const host = document.querySelector<HTMLElement>("[data-testid='facility-canvas']") as (HTMLElement & { __facilityGame?: any }) | null;
    const game = host?.__facilityGame;
    const scene = game?.scene.getScene("facility-scene");
    if (!host || !scene?.layout || !scene.getCameraPreference()) return null;
    const room = scene.bridge.viewModel.rooms.find((value: any) => value.isFounderRoom);
    if (!room) return null;
    const rect = game.canvas.getBoundingClientRect();
    const { originX, originY, tileSize, worldBottom } = scene.layout;
    const x = originX + (room.tileX + room.width / 2) * tileSize;
    const y = originY + (room.tileY + room.height / 2) * tileSize;
    return { zoom: scene.cameraView.zoom as number, tileSize: tileSize as number, originX: originX as number,
      originY: originY as number, worldBottom: worldBottom as number,
      feature: { id: room.instanceId as string, x: rect.left + x * rect.width / game.scale.width,
        y: rect.top + y * rect.height / game.scale.height },
      rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
      width: game.scale.width as number, height: game.scale.height as number,
      drawnWidth: scene.lastWidth as number, drawnHeight: scene.lastHeight as number,
      hostWidth: host.getBoundingClientRect().width - parseFloat(getComputedStyle(host).borderLeftWidth) - parseFloat(getComputedStyle(host).borderRightWidth),
      hostHeight: host.getBoundingClientRect().height - parseFloat(getComputedStyle(host).borderTopWidth) - parseFloat(getComputedStyle(host).borderBottomWidth),
      bitmapWidth: game.canvas.width as number, bitmapHeight: game.canvas.height as number,
      picked: scene.roomAtPointer(game.input.activePointer)?.instanceId as string | undefined };
  });
}
type Snapshot = NonNullable<Awaited<ReturnType<typeof cameraSnapshot>>>;

async function ready(page: Page): Promise<Snapshot> {
  await expect.poll(async () => {
    const state = await cameraSnapshot(page);
    return Boolean(state && state.width === Math.floor(state.hostWidth) && state.height === Math.floor(state.hostHeight) &&
      state.drawnWidth === state.width && state.drawnHeight === state.height);
  }, { timeout: 20_000 }).toBe(true);
  const state = (await cameraSnapshot(page))!;
  // Desktop keeps its existing one-backing-pixel policy. No CSS stretch/blur.
  expect(state.bitmapWidth).toBe(state.width); expect(state.bitmapHeight).toBe(state.height);
  // The canvas must not stretch those integer dimensions to a fractional pane.
  expect(state.rect.width).toBe(state.width); expect(state.rect.height).toBe(state.height);
  return state;
}

async function dragSplitter(page: Page, delta: number) {
  const before = await ready(page);
  const control = page.getByRole("separator", { name: "Resize facility map and clinical desk" });
  const rect = (await control.boundingBox())!;
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2 + delta, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => {
    const view = await cameraSnapshot(page);
    return Boolean(view && (delta > 0 ? view.height > before.height : view.height < before.height));
  }).toBe(true);
  return ready(page);
}

async function panMap(page: Page, delta: number, toBottom = false) {
  const before = await ready(page);
  const x = before.rect.x + before.rect.width * 0.12;
  const y = before.rect.y + before.rect.height * (delta > 0 ? 0.25 : 0.75);
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x, y + delta, { steps: 6 }); await page.mouse.up();
  if (toBottom) {
    // The pan recognizer consumes its activation distance, and the camera clamps
    // at the world bottom. Test that real bound, not the requested pointer delta.
    await expect.poll(async () => {
      const view = await cameraSnapshot(page);
      return view ? view.worldBottom - view.height : null;
    }).toBe(0);
  } else await expect.poll(async () => (await cameraSnapshot(page))?.originY).toBeCloseTo(before.originY + delta, 0);
  const after = await ready(page);
  expect(after.zoom).toBe(before.zoom); expect(after.tileSize).toBe(before.tileSize);
  if (toBottom) expect(after.originY).toBeCloseTo(before.originY + before.height - before.worldBottom, 0);
  return after;
}

function stationary(before: Snapshot, after: Snapshot) {
  expect(after.zoom).toBe(before.zoom); expect(after.tileSize).toBe(before.tileSize);
  expect(after.originX).toBe(before.originX); expect(after.originY).toBe(before.originY);
  expect(after.feature.y).toBeCloseTo(before.feature.y, 0);
}

async function expectPicking(page: Page, view: Snapshot) {
  expect(view.feature.y).toBeGreaterThan(view.rect.y);
  expect(view.feature.y).toBeLessThan(view.rect.y + view.rect.height);
  await page.mouse.move(view.feature.x, view.feature.y);
  await expect.poll(async () => (await cameraSnapshot(page))?.picked).toBe(view.feature.id);
}

test("desktop splitter is a map shade, follows only the revealed bottom and preserves zoom on reload", async ({ page }, info) => {
  test.skip(info.project.name === "phone-chrome", "Desktop-only change; phone camera retains its existing behavior.");
  await page.addInitScript(() => {
    localStorage.setItem("gamify-surgery.presentation-layout.v1", "desktop");
    // startClinic owns navigation; enable the existing read-only dev proof
    // before application modules run on each document, without a second open.
    const url = new URL(location.href);
    url.searchParams.set("facility-gait-proof", "1");
    history.replaceState(history.state, "", url);
  });
  await startClinic(page, "Shade Fixture", "Shade Clinic", false);
  await page.getByRole("button", { name: "Pause facility time", exact: true }).click();
  const initial = await ready(page);
  await page.getByRole("button", { name: "Zoom facility in", exact: true }).click();
  await expect.poll(async () => (await cameraSnapshot(page))?.zoom).toBe(Math.min(2.5, Math.round((initial.zoom + 0.1) * 10) / 10));
  const chosen = await ready(page);
  // Explicit pan creates reveal headroom; dragging the splitter is not a pan.
  const before = await panMap(page, 80);
  expect(before.zoom).toBe(chosen.zoom);
  const grown = await dragSplitter(page, 30);
  expect(grown.height).toBeGreaterThan(before.height + 5); stationary(before, grown);
  await expectPicking(page, grown);

  const splitter = page.getByRole("separator", { name: "Resize facility map and clinical desk" });
  await splitter.focus(); await page.keyboard.press("ArrowDown");
  await expect.poll(async () => (await cameraSnapshot(page))?.height ?? 0).toBeGreaterThan(grown.height);
  const keyboard = await ready(page);
  expect(keyboard.height).toBeGreaterThan(grown.height); stationary(grown, keyboard);
  const covered = await dragSplitter(page, -20);
  expect(covered.height).toBeLessThan(keyboard.height); stationary(keyboard, covered);
  await expectPicking(page, covered);

  // Explicitly pan back to the bottom, then cross that edge using the splitter.
  // Overshoot the edge to absorb drag activation; inspect the actual clamp.
  const bottom = await panMap(page, covered.height - covered.worldBottom - 24, true);
  expect(bottom.worldBottom).toBe(bottom.height);
  const follow = await dragSplitter(page, 30);
  expect(follow.height).toBeGreaterThan(bottom.height);
  expect(follow.worldBottom).toBe(follow.height);
  expect(follow.originY - bottom.originY).toBe(follow.height - bottom.height);
  expect(follow.feature.y - bottom.feature.y).toBeCloseTo(follow.height - bottom.height, 0);
  expect(follow.zoom).toBe(chosen.zoom); expect(follow.tileSize).toBe(chosen.tileSize);
  const noReverse = await dragSplitter(page, -30);
  expect(noReverse.height).toBeLessThan(follow.height); stationary(follow, noReverse);
  await expectPicking(page, noReverse);

  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width, height: viewport.height + 20 });
  await expect.poll(async () => (await cameraSnapshot(page))?.hostHeight ?? 0).toBeGreaterThan(noReverse.hostHeight);
  const windowResize = await ready(page); stationary(noReverse, windowResize);
  await expectPicking(page, windowResize);
  await page.screenshot({ path: info.outputPath("map-shade-after-resizes.png"), animations: "disabled" });

  // Reload immediately after a resize: lifecycle capture must flush even before
  // the resize settle/debounce deadline, with no actual visual-scale change.
  const reloadView = await dragSplitter(page, Math.max(15, windowResize.worldBottom - windowResize.height + 15));
  expect(reloadView.worldBottom).toBe(reloadView.height);
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Shade Clinic", exact: true });
  await expect.poll(async () => Boolean(await cameraSnapshot(page)) || await resume.isVisible(), { timeout: 20_000 }).toBe(true);
  if (await resume.isVisible()) await resume.click();
  const reopened = await ready(page);
  stationary(reloadView, reopened); await expectPicking(page, reopened);
  await info.attach("shade-camera-proof", { body: JSON.stringify({ before, grown, keyboard, covered, bottom, follow, noReverse, windowResize, reopened }), contentType: "application/json" });
});
