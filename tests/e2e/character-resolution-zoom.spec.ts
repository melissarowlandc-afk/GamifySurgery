import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  installLevelOneVisualState,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = process.env.GAMIFY_CHARACTER_ZOOM_SCREENSHOT_ROOT ??
  "artifacts/screenshots/gs026-runtime/compatibility";

interface LiveActorSnapshot {
  atlasId?: string;
  visible: boolean;
  displayWidth?: number;
  displayHeight?: number;
  originY?: number;
  textureScaleMode?: number;
  textureUsesLinearFiltering: boolean;
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

async function openCharacterZoomFixture(page: Page): Promise<void> {
  await startClinic(page, "Character Zoom Founder", "Character Zoom Clinic");
  await installLevelOneVisualState(page);
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: /Resume Character Zoom Clinic/ });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      | (HTMLDivElement & { __facilityGaitSnapshot?: () => unknown })
      | null;
    return typeof host?.__facilityGaitSnapshot === "function";
  });
}

async function configureStableCharacterCluster(page: Page): Promise<void> {
  await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {
      __facilityGame?: { scene: { getScene: (key: string) => unknown } };
    };
    const scene = host.__facilityGame!.scene.getScene("facility-scene") as {
      bridge: { viewModel: Record<string, unknown> };
      routeMotionTracks: Map<string, unknown>;
      characterPhase: number;
      update: (time: number, delta: number) => void;
    };
    const model = scene.bridge.viewModel as {
      paused: boolean;
      founder: Record<string, unknown>;
      patients: Array<Record<string, unknown>>;
      staff: Array<Record<string, unknown>>;
    };
    // This is an opt-in renderer-only composition. It pins existing people in
    // one nearby live-map cluster without dispatching, saving, or changing a
    // game route.
    model.paused = true;
    Object.assign(model.founder, {
      location: { x: 32, y: 30 }, path: [], pathIndex: 0,
      moving: false, direction: "front", activityLabel: undefined,
    });
    const patient = model.patients.find(
      (candidate) => candidate.instanceId === "encounter.visual.patient.2",
    )!;
    Object.assign(patient, {
      location: { x: 33, y: 30 }, path: [], pathIndex: 0,
      moving: false, direction: "front",
    });
    const staff = model.staff.find(
      (candidate) => candidate.instanceId === "employee.visual.receptionist",
    )!;
    Object.assign(staff, {
      location: { x: 34, y: 30 }, path: [], pathIndex: 0,
      moving: false, direction: "front",
    });
    scene.routeMotionTracks.clear();
    scene.characterPhase = 0;
    scene.update(0, 0);
  });
}

async function setZoomPercent(page: Page, targetPercent: number): Promise<void> {
  const output = page.locator(".facility-zoom-overlay output");
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const currentPercent = Number((await output.innerText()).replace("%", ""));
    if (currentPercent === targetPercent) return;
    await page.getByRole("button", {
      name: currentPercent < targetPercent ? "Zoom facility in" : "Zoom facility out",
    }).click();
  }
  await expect(output).toHaveText(`${targetPercent}%`);
}

async function liveActorSnapshots(page: Page): Promise<Record<string, LiveActorSnapshot>> {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {
      __facilityGame?: { scene: { getScene: (key: string) => unknown } };
      __facilityGaitSnapshot?: () => unknown;
    };
    const scene = host.__facilityGame!.scene.getScene("facility-scene") as {
      update: (time: number, delta: number) => void;
    };
    scene.update(0, 0);
    return host.__facilityGaitSnapshot!() as Record<string, LiveActorSnapshot>;
  });
}

test("live GS-026 stills stay smooth, identity-scaled, and floor-anchored across facility zoom", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The three comparable character captures use one controlled desktop viewport.");
  await page.setViewportSize({ width: 1374, height: 1000 });
  await openCharacterZoomFixture(page);
  await configureStableCharacterCluster(page);
  // Keep the capture focused on the rendered actor cluster; paused-state
  // behavior is covered elsewhere and its banner would obscure the founder
  // only at the enlarged proof zoom.
  await page.addStyleTag({
    content: ".facility-pause-indicator { visibility: hidden !important; }",
  });

  const facility = page.getByTestId("facility-canvas");
  const expectedActors = [
    "character:founder",
    "character:patient:encounter.visual.patient.2",
    "character:staff:employee.visual.receptionist",
  ] as const;
  const screenshots = [
    [70, "character-resolution-zoom-70.png"],
    [100, "character-resolution-zoom-100.png"],
    [160, "character-resolution-zoom-160.png"],
  ] as const;
  const anchorsByActor = new Map<string, number>();
  const widthRatiosByActor = new Map<string, number>();
  const priorWidthByActor = new Map<string, number>();
  const scaleModes = new Set<number>();

  for (const [percent, filename] of screenshots) {
    await setZoomPercent(page, percent);
    await page.waitForTimeout(150);
    const snapshots = await liveActorSnapshots(page);
    const referenceWidth = snapshots[expectedActors[0]]!.displayWidth!;
    for (const key of expectedActors) {
      const actor = snapshots[key];
      expect(actor, `missing ${key} at ${percent}%`).toBeDefined();
      expect(actor!.visible).toBe(true);
      expect(actor!.atlasId).toMatch(/^character-still:[^:]+:[0-9a-f]{12}$/);
      expect(actor!.displayWidth).toBeGreaterThan(0);
      expect(actor!.displayHeight).toBeGreaterThan(0);
      expect(Number.isInteger(actor!.displayWidth)).toBe(true);
      expect(Number.isInteger(actor!.displayHeight)).toBe(true);
      expect(actor!.displayWidth! * 2).toBe(actor!.displayHeight);
      expect(actor!.originY).toBeCloseTo(287 / 320, 8);
      expect(actor!.textureUsesLinearFiltering).toBe(true);
      expect(typeof actor!.textureScaleMode).toBe("number");
      scaleModes.add(actor!.textureScaleMode!);
      const initialAnchor = anchorsByActor.get(key);
      if (initialAnchor === undefined) anchorsByActor.set(key, actor!.originY!);
      else expect(actor!.originY).toBeCloseTo(initialAnchor, 8);
      const widthRatio = actor!.displayWidth! / referenceWidth;
      const initialRatio = widthRatiosByActor.get(key);
      if (initialRatio === undefined) widthRatiosByActor.set(key, widthRatio);
      else expect(widthRatio).toBeCloseTo(initialRatio, 1);
      const priorWidth = priorWidthByActor.get(key);
      if (priorWidth !== undefined) expect(actor!.displayWidth!).toBeGreaterThan(priorWidth);
      priorWidthByActor.set(key, actor!.displayWidth!);
    }
    await facility.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/${filename}`,
      animations: "disabled",
    });
  }
  expect(scaleModes.size).toBe(1);
});
