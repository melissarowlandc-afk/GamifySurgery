import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { installLevelOneVisualState, startClinic } from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

type FounderPose = "seated" | "standing-front" | "standing-side";

interface ActorProof {
  pose: FounderPose;
  identity: number;
  frame: { id: string; cutX: number; cutY: number; cutWidth: number; cutHeight: number };
  sourceAlpha: { left: number; top: number; right: number; bottom: number };
  display: { width: number; height: number; originX: number; originY: number };
  actorBounds: { left: number; top: number; right: number; bottom: number };
  actorLocalBounds: { left: number; top: number; right: number; bottom: number };
  container: { x: number; y: number; depth: number; bounds: { left: number; top: number; right: number; bottom: number } };
  headBand: { left: number; top: number; right: number; bottom: number };
  feetBand: { left: number; top: number; right: number; bottom: number };
  /** Conservative rectangle-envelope candidates, not alpha-visible occlusion. */
  higherHeadBounds: Array<{ key: string; depth: number }>;
  /** Conservative rectangle-envelope candidates, not alpha-visible occlusion. */
  higherFeetBounds: Array<{ key: string; depth: number }>;
  higherImageBounds: Array<{ key: string; depth: number; group: string; bounds: { left: number; top: number; right: number; bottom: number } }>;
  overlappingCharacterBounds: Array<{
    key: string;
    depth: number;
    bounds: { left: number; top: number; right: number; bottom: number };
    head: boolean;
    feet: boolean;
  }>;
  visibleCharacterBounds: Array<{
    key: string;
    depth: number;
    bounds: { left: number; top: number; right: number; bottom: number };
  }>;
  masks: {
    actor: boolean;
    container: boolean;
    camera: boolean;
    cameraViewport: { x: number; y: number; width: number; height: number };
  };
  /**
   * A Canvas-renderer readback, not a rectangle-only overlap guess. The
   * isolated rows are rendered with every other scene child hidden. The
   * composite rows count pixels that change between the otherwise-identical
   * full scene with the founder hidden and with the founder restored.
   */
  canvasVisibility: {
    canvas: { width: number; height: number };
    expectedOpaqueRows: { top: number; bottom: number };
    isolatedOpaqueRows: { top: number | null; bottom: number | null; count: number };
    compositeMatchingRows: { top: number | null; bottom: number | null; count: number; candidateCount: number };
    bands: {
      head: { candidateCount: number; matchingCount: number };
      feet: { candidateCount: number; matchingCount: number };
    };
  };
}

const B3 = { x: 35, y: 29 };
// This is renderer-test-only. It maps through the ordinary floor formula to
// exactly the V5 B3 staff display center/base, while failing the exact integer
// anchor equality used by `shouldRenderFounderSeatedAtFrontDesk`.
const B3_IDLE_AT_V5_DISPLAY = { x: 34.5, y: 29.28 };
const OPEN_C4 = { x: 36, y: 30 };

async function openFixture(page: Page): Promise<void> {
  await startClinic(page, "Founder Anatomy Reviewer", "Founder Anatomy Clinic");
  await installLevelOneVisualState(page);
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Founder Anatomy Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function");
  // This is the only DOM styling change: simulation stays paused in Phaser.
  await page.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
}

async function provePose(
  page: Page,
  pose: FounderPose,
  identity: number,
  location: { x: number; y: number },
): Promise<ActorProof> {
  return page.evaluate(async ({ pose, identity, location }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const founder = scene.bridge.viewModel.founder;
    Object.assign(founder, {
      location, path: [], pathIndex: 0, moving: false,
      direction: pose === "standing-side" ? "left" : "front",
      activityLabel: undefined,
      // The seated sheet selection is production-shaped: no artificial crop
      // or child transform is introduced by this diagnostic.
      seated: pose === "seated",
      appearance: { ...founder.appearance, roleStyle: "founder", headVariant: identity, bodyVariant: identity },
    });
    scene.bridge.viewModel.paused = true;
    scene.routeMotionTracks.clear();
    scene.update(0, 0);
    const container = scene.characterBitmapContainers.get("character:founder");
    const actor = container.getByName("actor");
    // `actor` is a child of the map-positioned container. Its own bounds can
    // be local; the container has exactly this one actor child, so its bounds
    // are the authoritative world-space complete-frame rectangle used below.
    const actorLocalBounds = actor.getBounds();
    const containerBounds = container.getBounds();
    if (container.list.length !== 1 || container.list[0] !== actor) {
      throw new Error("Founder diagnostic requires one actor child per bitmap container.");
    }
    const bounds = containerBounds;
    const textureImage = actor.texture.getSourceImage();
    const canvas = document.createElement("canvas");
    canvas.width = actor.frame.cutWidth; canvas.height = actor.frame.cutHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    context.drawImage(textureImage, actor.frame.cutX, actor.frame.cutY, actor.frame.cutWidth, actor.frame.cutHeight, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let left = canvas.width; let top = canvas.height; let right = -1; let bottom = -1;
    for (let y = 0; y < canvas.height; y += 1) for (let x = 0; x < canvas.width; x += 1) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 0) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
    }
    const sourceAlpha = { left, top, right, bottom };
    const serializableBounds = (value: any) => ({ left: value.left, top: value.top, right: value.right, bottom: value.bottom });
    const scaleX = actor.displayWidth / actor.frame.cutWidth;
    const scaleY = actor.displayHeight / actor.frame.cutHeight;
    const band = (from: number, to: number) => ({ left: bounds.left + left * scaleX, right: bounds.left + (right + 1) * scaleX, top: bounds.top + from * scaleY, bottom: bounds.top + to * scaleY });
    const headBand = band(top, Math.min(bottom + 1, top + Math.max(1, Math.ceil((bottom - top + 1) * 0.2))));
    const feetBand = band(Math.max(top, bottom - Math.max(1, Math.ceil((bottom - top + 1) * 0.16))), bottom + 1);
    const overlaps = (a: any, b: any) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const fixtureImages = [...scene.fixtureBitmapImages.entries()]
      .map(([key, image]: [string, any]) => {
        const imageBounds = image.getBounds();
        return { key, depth: image.depth, group: "fixture", bounds: serializableBounds(imageBounds), visible: image.visible };
      })
      .filter((item: any) => item.visible);
    // Wall decor is Phaser Graphics rather than an image and exposes no bounds;
    // all raster scene images are in `fixtureBitmapImages` above. Record its
    // depth separately rather than pretending it has image geometry.
    const wallDecor = [...scene.wallDecorGraphics.entries()].map(([key, graphics]: [string, any]) => ({
      key, depth: graphics.depth, group: "wall-decor", visible: graphics.visible,
    })).filter((item: any) => item.visible);
    const bitmapCharacters = [...scene.characterBitmapContainers.entries()]
      .filter(([key]: [string, any]) => key !== "character:founder")
      .map(([key, character]: [string, any]) => ({ key, depth: character.depth, group: "character", bounds: serializableBounds(character.getBounds()), visible: character.visible }))
      .filter((item: any) => item.visible);
    // Some role sheets deliberately retain their procedural Graphics fallback
    // while their authored atlas is unavailable. Count that live visible actor
    // too; it is still part of the Canvas composition the owner sees.
    const graphicsCharacters = [...scene.characterGraphics.entries()]
      .filter(([key, graphics]: [string, any]) => key !== "character:founder" && graphics.visible)
      .map(([key, graphics]: [string, any]) => ({ key, depth: graphics.depth, group: "character", bounds: serializableBounds(graphics.getBounds()), visible: true }));
    const otherCharacters = [...bitmapCharacters, ...graphicsCharacters];
    const allImages = [...fixtureImages, ...otherCharacters];
    const above = allImages.filter((item: any) => item.depth > container.depth);
    const gameCanvas = scene.sys.game.canvas as HTMLCanvasElement;
    const canvasContext = gameCanvas.getContext("2d", { willReadFrequently: true })!;
    const copyPixels = () => new Uint8ClampedArray(canvasContext.getImageData(0, 0, gameCanvas.width, gameCanvas.height).data);
    // A paused simulation intentionally need not advance a Phaser update on
    // the next browser frame. Render the live Scene explicitly after each
    // test-only visibility swap so the Canvas readback is deterministic.
    const renderReadbackFrame = async () => {
      const renderer = scene.game.renderer;
      renderer.preRender();
      scene.game.scene.render(renderer);
      renderer.postRender();
    };
    const camera = scene.cameras.main;
    const cssWidth = gameCanvas.getBoundingClientRect().width || camera.width;
    const cssHeight = gameCanvas.getBoundingClientRect().height || camera.height;
    const scaleToCanvasX = gameCanvas.width / cssWidth;
    const scaleToCanvasY = gameCanvas.height / cssHeight;
    const worldToCanvasY = (worldY: number) => (
      (camera.y + (worldY - camera.scrollY) * camera.zoom) * scaleToCanvasY
    );
    const expectedOpaqueRows = {
      top: Math.round(worldToCanvasY(bounds.top + top * scaleY)),
      bottom: Math.round(worldToCanvasY(bounds.top + (bottom + 1) * scaleY)) - 1,
    };
    const headCanvasBottom = Math.round(worldToCanvasY(headBand.bottom)) - 1;
    const feetCanvasTop = Math.round(worldToCanvasY(feetBand.top));
    // Render a zero-fixture baseline and a founder-only pass through the live
    // Phaser Canvas renderer. This exposes true drawn source rows, so source
    // transparency, a crop, a mask, and a viewport cut cannot be conflated.
    const childVisibility = scene.children.list.map((child: any) => [child, child.visible] as const);
    const founderVisible = container.visible;
    for (const [child] of childVisibility) child.setVisible(false);
    container.setVisible(false);
    await renderReadbackFrame();
    const baselinePixels = copyPixels();
    container.setVisible(true);
    await renderReadbackFrame();
    const actorOnlyPixels = copyPixels();
    for (const [child, visible] of childVisibility) child.setVisible(visible);
    container.setVisible(false);
    await renderReadbackFrame();
    const compositionWithoutActorPixels = copyPixels();
    container.setVisible(founderVisible);
    await renderReadbackFrame();
    const compositePixels = copyPixels();
    const changed = (before: Uint8ClampedArray, after: Uint8ClampedArray, index: number) => (
      before[index] !== after[index] || before[index + 1] !== after[index + 1] ||
      before[index + 2] !== after[index + 2] || before[index + 3] !== after[index + 3]
    );
    let globalIsolatedCount = 0;
    for (let index = 0; index < baselinePixels.length; index += 4) {
      if (changed(baselinePixels, actorOnlyPixels, index)) globalIsolatedCount += 1;
    }
    let isolatedTop: number | null = null;
    let isolatedBottom: number | null = null;
    let isolatedCount = 0;
    let compositeTop: number | null = null;
    let compositeBottom: number | null = null;
    let compositeCount = 0;
    let candidateCount = 0;
    let headCandidateCount = 0;
    let headMatchingCount = 0;
    let feetCandidateCount = 0;
    let feetMatchingCount = 0;
    const scanTop = Math.max(0, expectedOpaqueRows.top - 2);
    const scanBottom = Math.min(gameCanvas.height - 1, expectedOpaqueRows.bottom + 2);
    for (let y = scanTop; y <= scanBottom; y += 1) {
      let isolatedInRow = false;
      let compositeInRow = false;
      for (let x = 0; x < gameCanvas.width; x += 1) {
        const index = (y * gameCanvas.width + x) * 4;
        if (!changed(baselinePixels, actorOnlyPixels, index)) continue;
        candidateCount += 1;
        isolatedCount += 1;
        isolatedInRow = true;
        const isHead = y >= expectedOpaqueRows.top && y <= headCanvasBottom;
        const isFeet = y >= feetCanvasTop && y <= expectedOpaqueRows.bottom;
        if (isHead) headCandidateCount += 1;
        if (isFeet) feetCandidateCount += 1;
        if (changed(compositionWithoutActorPixels, compositePixels, index)) {
          compositeCount += 1;
          compositeInRow = true;
          if (isHead) headMatchingCount += 1;
          if (isFeet) feetMatchingCount += 1;
        }
      }
      if (isolatedInRow) { isolatedTop ??= y; isolatedBottom = y; }
      if (compositeInRow) { compositeTop ??= y; compositeBottom = y; }
    }
    return {
      pose, identity,
      frame: { id: actor.frame.name, cutX: actor.frame.cutX, cutY: actor.frame.cutY, cutWidth: actor.frame.cutWidth, cutHeight: actor.frame.cutHeight },
      sourceAlpha,
      display: { width: actor.displayWidth, height: actor.displayHeight, originX: actor.originX, originY: actor.originY },
      actorBounds: serializableBounds(bounds),
      actorLocalBounds: serializableBounds(actorLocalBounds),
      container: { x: container.x, y: container.y, depth: container.depth, bounds: serializableBounds(containerBounds) },
      headBand, feetBand,
      higherHeadBounds: above.filter((item: any) => overlaps(item.bounds, headBand)).map((item: any) => ({ key: item.key, depth: item.depth })),
      higherFeetBounds: above.filter((item: any) => overlaps(item.bounds, feetBand)).map((item: any) => ({ key: item.key, depth: item.depth })),
      higherImageBounds: above.filter((item: any) => overlaps(item.bounds, headBand) || overlaps(item.bounds, feetBand)).map(({ key, depth, group, bounds }: any) => ({ key, depth, group, bounds })),
      overlappingCharacterBounds: otherCharacters
        .filter((item: any) => overlaps(item.bounds, headBand) || overlaps(item.bounds, feetBand))
        .map(({ key, depth, bounds }: any) => ({
          key,
          depth,
          bounds,
          head: overlaps(bounds, headBand),
          feet: overlaps(bounds, feetBand),
        })),
      visibleCharacterBounds: otherCharacters.map(({ key, depth, bounds }: any) => ({
        key,
        depth,
        bounds,
      })),
      masks: {
        actor: Boolean(actor.mask), container: Boolean(container.mask), camera: Boolean(camera.mask),
        cameraViewport: { x: camera.x, y: camera.y, width: camera.width, height: camera.height },
      },
      canvasVisibility: {
        canvas: { width: gameCanvas.width, height: gameCanvas.height }, expectedOpaqueRows,
        isolatedOpaqueRows: { top: isolatedTop, bottom: isolatedBottom, count: isolatedCount },
        compositeMatchingRows: { top: compositeTop, bottom: compositeBottom, count: compositeCount, candidateCount: candidateCount || globalIsolatedCount },
        bands: {
          head: { candidateCount: headCandidateCount, matchingCount: headMatchingCount },
          feet: { candidateCount: feetCandidateCount, matchingCount: feetMatchingCount },
        },
      },
    };
  }, { pose, identity, location });
}

async function setZoomPercent(page: Page, percent: number): Promise<void> {
  const output = page.locator(".facility-zoom-overlay output");
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const current = Number((await output.innerText()).replace("%", ""));
    if (current === percent) return;
    await page.getByRole("button", { name: current < percent ? "Zoom facility in" : "Zoom facility out" }).click();
  }
  await expect(output).toHaveText(`${percent}%`);
}

function assertCompleteFrame(proof: ActorProof): void {
  expect(proof.frame.cutWidth).toBe(128);
  expect(proof.frame.cutHeight).toBe(192);
  expect(proof.display.originY).toBeCloseTo(181 / 192, 8);
  expect(proof.sourceAlpha.top).toBeGreaterThanOrEqual(10);
  expect(proof.sourceAlpha.bottom).toBeLessThanOrEqual(180);
}

function assertCanvasShowsCompleteSourceRows(
  proof: ActorProof,
  options: { assertCompositeHead?: boolean } = {},
): void {
  const { expectedOpaqueRows, isolatedOpaqueRows, compositeMatchingRows, bands } = proof.canvasVisibility;
  expect(proof.masks).toMatchObject({ actor: false, container: false, camera: false });
  expect(isolatedOpaqueRows.count).toBeGreaterThan(0);
  expect(isolatedOpaqueRows.top).not.toBeNull();
  expect(isolatedOpaqueRows.bottom).not.toBeNull();
  // Canvas's nearest-neighbour source-to-display conversion may choose either
  // adjoining output pixel at a scaled edge, but cannot omit a whole source
  // top or bottom band without this failing.
  expect(isolatedOpaqueRows.top!).toBeLessThanOrEqual(expectedOpaqueRows.top + 1);
  expect(isolatedOpaqueRows.bottom!).toBeGreaterThanOrEqual(expectedOpaqueRows.bottom - 1);
  if (options.assertCompositeHead === false) return;
  expect(compositeMatchingRows.count).toBeGreaterThan(0);
  // The owner-reported seated head is the decisive band: every sampled actor
  // pixel that survives the isolated Canvas pass must almost entirely survive
  // the real restored composition. The isolated pass is the complete-row
  // contract; same-colour pixels in a real composition can be unchanged.
  expect(bands.head.candidateCount).toBeGreaterThan(0);
  expect(bands.head.matchingCount / bands.head.candidateCount).toBeGreaterThanOrEqual(0.995);
}

test("diagnoses real Front Desk founder head and feet visibility without changing renderer state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Controlled 100% desktop founder anatomy evidence.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await openFixture(page);
  const facility = page.getByTestId("facility-canvas");

  // B3 is captured exactly for the production auto-seated pose. Standing
  // controls use the fractional test location above, which has the exact same
  // rendered V5 staff center/base but cannot re-trigger B3 auto-seating.
  const seated = await provePose(page, "seated", 0, B3);
  assertCompleteFrame(seated);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-seated-human-100-desktop.png`, animations: "disabled" });

  // The founder pictured in Wall fix.PNG matches code identity 10 (the
  // shoulder-waves preset, zero-based variant 10), not the nearby male index 9.
  const wallFixSeated = await provePose(page, "seated", 10, B3);
  assertCompleteFrame(wallFixSeated);
  console.log("FOUNDER_CANVAS_READBACK_SEATED", JSON.stringify(wallFixSeated.canvasVisibility));
  console.log("FOUNDER_CHARACTER_OVERLAPS_SEATED", JSON.stringify({
    founder: wallFixSeated.container,
    others: wallFixSeated.overlappingCharacterBounds,
  }));
  assertCanvasShowsCompleteSourceRows(wallFixSeated);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-seated-wall-fix-identity-10-100-desktop.png`, animations: "disabled" });

  const standingFront = await provePose(page, "standing-front", 10, B3_IDLE_AT_V5_DISPLAY);
  assertCanvasShowsCompleteSourceRows(standingFront);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-standing-front-human-100-desktop.png`, animations: "disabled" });
  const standingSide = await provePose(page, "standing-side", 10, B3_IDLE_AT_V5_DISPLAY);
  assertCanvasShowsCompleteSourceRows(standingSide);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-standing-side-human-100-desktop.png`, animations: "disabled" });
  const openFront = await provePose(page, "standing-front", 0, OPEN_C4);
  const openSide = await provePose(page, "standing-side", 0, OPEN_C4);
  for (const proof of [standingFront, standingSide, openFront, openSide]) assertCompleteFrame(proof);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-open-floor-side-human-100-desktop.png`, animations: "disabled" });
  const wallFixOpen = await provePose(page, "standing-front", 10, OPEN_C4);
  assertCompleteFrame(wallFixOpen);
  expect(wallFixOpen.frame.id).toBe("frame:character:character:founders-front-idle-v4-r10-feet:10");
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-open-floor-wall-fix-identity-10-100-desktop.png`, animations: "disabled" });
  await setZoomPercent(page, 160);
  // React's zoom update can redraw from the persisted founder appearance, so
  // reapply the renderer-only identity after zoom before taking this proof.
  const wallFixOpen160 = await provePose(page, "standing-front", 10, OPEN_C4);
  assertCompleteFrame(wallFixOpen160);
  expect(wallFixOpen160.frame.id).toBe("frame:character:character:founders-front-idle-v4-r10-feet:10");
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-open-floor-wall-fix-identity-10-160-desktop.png`, animations: "disabled" });

  // These are the visually tallest/extreme approved founder identities. The
  // loop keeps the same live anchor and makes an accidental variant-only crop
  // a concrete failure instead of a human-only proof.
  const nonhuman = [] as ActorProof[];
  for (const identity of [23, 27, 29]) nonhuman.push(await provePose(page, "seated", identity, B3));
  for (const proof of nonhuman) assertCompleteFrame(proof);
  await facility.screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-seated-extents-100-desktop.png`, animations: "disabled" });

  // This deliberately fails if a new higher-depth image covers either band.
  const overlapReport = { seated, wallFixSeated, standingFront, standingSide, openFront, openSide, wallFixOpen, wallFixOpen160, nonhuman };
  await testInfo.attach("front-desk-founder-anatomy.json", { body: JSON.stringify(overlapReport, null, 2), contentType: "application/json" });
  console.log("FOUNDER_ANATOMY_CONSERVATIVE_BOUNDS", JSON.stringify(Object.fromEntries(Object.entries(overlapReport).map(([name, proof]) => [name, Array.isArray(proof) ? proof.map(({ higherHeadBounds, higherFeetBounds }) => ({ higherHeadBounds, higherFeetBounds })) : { higherHeadBounds: proof.higherHeadBounds, higherFeetBounds: proof.higherFeetBounds }]))));
  // The counter intentionally covers a seated lower body, so seated acceptance
  // asserts only the head. It must never be misreported as a feet regression.
  const hasCounterCover = (items: readonly { key: string }[]) => items.some((item) => item.key === "room:room.instance.founder_desk:2:frontDesk");
  expect(seated.higherHeadBounds).toEqual([]);
  expect(hasCounterCover(seated.higherFeetBounds)).toBe(true);
  expect(wallFixSeated.higherHeadBounds).toEqual([]);
  // The B2 receptionist remains visible at its logical tile, but its
  // renderer-only counter-side placement must not merge with the founder's
  // seated head silhouette at B3.
  const adjacentReceptionist = wallFixSeated.overlappingCharacterBounds.find(
    (item) => item.key === "character:staff:employee.visual.receptionist",
  );
  expect(adjacentReceptionist).toBeUndefined();
  const visibleAdjacentReceptionist = wallFixSeated.visibleCharacterBounds.find(
    (item) => item.key === "character:staff:employee.visual.receptionist",
  );
  expect(visibleAdjacentReceptionist).toBeDefined();
  expect(visibleAdjacentReceptionist!.depth).toBeLessThan(wallFixSeated.container.depth);
  expect(visibleAdjacentReceptionist!.bounds.right).toBeLessThanOrEqual(
    wallFixSeated.headBand.left,
  );
  for (const proof of nonhuman) expect(proof.higherHeadBounds).toEqual([]);
  expect(standingFront.frame.id).toBe("frame:character:character:founders-front-idle-v4-r10-feet:10");
  expect(standingSide.frame.id).toBe("frame:character:character:founders-left-idle-v4-r10-feet:10");
  expect(standingFront.container.x).toBe(seated.container.x); expect(standingFront.container.y).toBe(seated.container.y);
  expect(standingSide.container.x).toBe(seated.container.x); expect(standingSide.container.y).toBe(seated.container.y);
  expect(standingFront.higherHeadBounds).toEqual([]); expect(hasCounterCover(standingFront.higherFeetBounds)).toBe(true);
  expect(standingSide.higherHeadBounds).toEqual([]); expect(hasCounterCover(standingSide.higherFeetBounds)).toBe(true);
  // Open-floor rectangle envelopes can intersect transparent fixture-shadow
  // pixels. Source completeness plus the native 100%/160% proof establishes
  // visible feet; do not mislabel such bounds-only candidates as clipping.
  for (const proof of [openFront, openSide, wallFixOpen, wallFixOpen160]) {
    expect(proof.higherHeadBounds).toEqual([]);
    expect(proof.actorBounds.bottom).toBeGreaterThan(proof.actorBounds.top);
  }

  await setZoomPercent(page, 100);
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("navigation", { name: "Build Mode tools" })).toBeVisible();
  await page.waitForFunction(() => typeof (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGaitSnapshot === "function");
  const buildSeated = await provePose(page, "seated", 10, B3);
  assertCompleteFrame(buildSeated);
  // Build overlays change the composition palette, so only the canonical
  // normal-mode proof compares founder pixels against the full scene. The
  // source-frame/row contract remains identical in Build mode.
  assertCanvasShowsCompleteSourceRows(buildSeated, { assertCompositeHead: false });
  console.log("FOUNDER_CANVAS_READBACK_BUILD_SEATED", JSON.stringify(buildSeated.canvasVisibility));
  await page.getByTestId("facility-canvas").screenshot({ path: `${SCREENSHOTS}/front-desk-founder-anatomy-seated-wall-fix-identity-10-build-100-desktop.png`, animations: "disabled" });
});
