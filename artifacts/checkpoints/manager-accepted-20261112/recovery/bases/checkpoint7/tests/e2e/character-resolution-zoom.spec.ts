import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  installLevelOneVisualState,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

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

test("live character atlases stay smooth, exact-aspect, and floor-anchored across facility zoom", async ({ page }, testInfo) => {
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
    ["character:founder", /^character:founders-.*-v4-r9-hires$/, 181 / 192],
    ["character:patient:encounter.visual.patient.2", /^character:patients-.*-v1-r7-hires$/, 181 / 192],
    ["character:staff:employee.visual.receptionist", /^character:actors-.*-v3$/, 220 / 240],
  ] as const;
  const screenshots = [
    [70, "character-resolution-zoom-70.png"],
    [100, "character-resolution-zoom-100.png"],
    [160, "character-resolution-zoom-160.png"],
  ] as const;
  const anchorsByActor = new Map<string, number>();
  const scaleModes = new Set<number>();

  for (const [percent, filename] of screenshots) {
    await setZoomPercent(page, percent);
    await page.waitForTimeout(150);
    const snapshots = await liveActorSnapshots(page);
    for (const [key, atlasPattern, expectedAnchor] of expectedActors) {
      const actor = snapshots[key];
      expect(actor, `missing ${key} at ${percent}%`).toBeDefined();
      expect(actor!.visible).toBe(true);
      expect(actor!.atlasId).toMatch(atlasPattern);
      expect(actor!.displayWidth).toBeGreaterThan(0);
      expect(actor!.displayHeight).toBeGreaterThan(0);
      expect(Number.isInteger(actor!.displayWidth)).toBe(true);
      expect(Number.isInteger(actor!.displayHeight)).toBe(true);
      expect(actor!.displayWidth! * 3).toBe(actor!.displayHeight! * 2);
      expect(actor!.originY).toBeCloseTo(expectedAnchor, 8);
      expect(actor!.textureUsesLinearFiltering).toBe(true);
      expect(typeof actor!.textureScaleMode).toBe("number");
      scaleModes.add(actor!.textureScaleMode!);
      const initialAnchor = anchorsByActor.get(key);
      if (initialAnchor === undefined) anchorsByActor.set(key, actor!.originY!);
      else expect(actor!.originY).toBeCloseTo(initialAnchor, 8);
    }
    await facility.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/${filename}`,
      animations: "disabled",
    });
  }
  expect(scaleModes.size).toBe(1);
});
