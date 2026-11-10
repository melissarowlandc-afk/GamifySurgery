import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createLevelOneVisualFixture } from "./helpers";
import { openFreshLocalCampaign } from "./fixtures/freshLocalCampaign";

const SCREENSHOT_DIRECTORY = process.env.GAMIFY_CHARACTER_ZOOM_SCREENSHOT_ROOT ??
  "artifacts/screenshots/gs026-runtime/compatibility";

interface LiveActorSnapshot {
  atlasId?: string;
  visible: boolean;
  displayWidth?: number;
  displayHeight?: number;
  originY?: number;
  expectedOriginY: number;
  actorLocalY?: number;
  groundX: number;
  groundY: number;
  textureScaleMode?: number;
  textureUsesLinearFiltering: boolean;
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

async function openCharacterZoomFixture(page: Page): Promise<void> {
  // Prepare entirely in Node, then seed before the first page opens. No old
  // controller/journal or pagehide flush can race the fixture import.
  const state = createLevelOneVisualFixture(JSON.parse(JSON.stringify(createInitialGameState())));
  state.campaignId = "campaign.character-zoom-round2";
  state.founder.displayName = "Character Zoom Founder";
  state.environment.founderLocation = { x: 32, y: 30 };
  state.environment.founderActivity = null;
  const patient = state.encounters["encounter.visual.patient.2"]!;
  patient.patientLocation = { x: 33, y: 30 };
  patient.patientMovement = null;
  patient.waitingDestination = null;
  const staff = (state.employees as Array<Record<string, unknown>>).find(member => member.id === "employee.visual.receptionist")!;
  Object.assign(staff, { location: { x: 34, y: 30 }, path: [], pathIndex: 0 });
  await openFreshLocalCampaign(page, state, "Character Zoom Clinic");
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      | (HTMLDivElement & { __facilityGaitSnapshot?: () => unknown })
      | null;
    return typeof host?.__facilityGaitSnapshot === "function";
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
  return page.evaluate(async () => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {
      __facilityGame?: { scene: { getScene: (key: string) => unknown } };
      __facilityGaitSnapshot?: () => unknown;
    };
    const scene = host.__facilityGame!.scene.getScene("facility-scene") as any;
    scene.update(0, 0);
    const snapshots = host.__facilityGaitSnapshot!() as Record<string, LiveActorSnapshot>;
    const modulePath = "/src/art/characterBitmapArt.ts";
    const { characterBitmapLayers, characterBitmapRegistration } = await import(/* @vite-ignore */ modulePath);
    for (const [key, snapshot] of Object.entries(snapshots)) {
      const actor = scene.characterBitmapContainers.get(key).getByName("actor");
      const [, kind, id] = /^character:([^:]+):?(.*)$/.exec(key)!;
      const person = kind === "founder" ? scene.bridge.viewModel.founder : kind === "staff"
        ? scene.bridge.viewModel.staff.find((member: any) => member.instanceId === id)
        : scene.bridge.viewModel.patients.find((patient: any) => patient.instanceId === id);
      if (person) snapshot.expectedOriginY = characterBitmapRegistration(characterBitmapLayers(
        person.appearance, actor.getData("gait-direction"), actor.getData("gait-pose"), false,
      )).floorAnchorY;
    }
    return snapshots;
  });
}

test("live GS-026 stills stay smooth, identity-scaled, and floor-anchored across facility zoom", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The three comparable character captures use one controlled desktop viewport.");
  await page.setViewportSize({ width: 1374, height: 1000 });
  await openCharacterZoomFixture(page);
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
    await expect.poll(() => page.evaluate(() => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      return !scene.crispZoomPending && scene.cameras.main.zoom === 1 && !scene.load.isLoading() && scene.pendingCharacterStills.size === 0;
    }), { timeout: 30_000 }).toBe(true);
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
      expect(actor!.originY).toBeCloseTo(actor!.expectedOriginY, 8);
      expect(Math.abs(actor!.actorLocalY!)).toBe(0);
      expect(Number.isInteger(actor!.groundX)).toBe(true);
      expect(Number.isInteger(actor!.groundY)).toBe(true);
      expect(actor!.textureUsesLinearFiltering).toBe(true); // Preserve the released character filtering policy; nearest-filter art changes are outside port 24.
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
