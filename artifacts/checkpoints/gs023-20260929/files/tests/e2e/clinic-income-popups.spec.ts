import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getActiveState,
  getProfile,
  installLevelTwoVisualState,
  moneyValue,
  readMoney,
  setFastFacilitySpeed,
  startClinic,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";

interface PopupReadback {
  text: string;
  popupBottom: number;
  actorTop: number;
  actorKey: string;
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOTS, { recursive: true });
});

async function openGaitProof(page: Page, campaignName: string): Promise<void> {
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", {
    name: new RegExp(`^Resume ${campaignName}$`),
  });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      | (HTMLDivElement & { __facilityGame?: unknown })
      | null;
    return Boolean(host?.__facilityGame);
  });
}

async function clearIsolatedTestStorage(page: Page): Promise<void> {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.removeItem("gamify-surgery.prototype.profile.v1");
    window.localStorage.removeItem("gamify-surgery.prototype.access.v1");
  });
}

async function waitForPopupReadback(
  page: Page,
  expectedActorKey: string,
  actorKind: "patient" | "employee" | "founder" | "remote",
  actorId: string,
): Promise<PopupReadback> {
  const handle = await page.waitForFunction(({ actorKey, actorKind, actorId }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {
      __facilityGame: { scene: { getScene: (key: string) => any } };
    };
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const popup = [...scene.earningsPopupTexts.values()]
      .find((candidate: any) => candidate.visible && candidate.text === "+$50");
    if (!popup) return null;
    const actor = scene.characterBitmapContainers
      .get(actorKey)
      ?.getByName("actor");
    const actorTop = actor?.getBounds?.().top ??
      scene.getEarningsPopupPosition(actorKind, actorId)?.y;
    if (actorTop === undefined) return null;
    return {
      text: popup.text,
      popupBottom: popup.getBounds().bottom,
      actorTop,
      actorKey,
    };
  }, { actorKey: expectedActorKey, actorKind, actorId }, { timeout: 35_000 });
  return handle.jsonValue() as Promise<PopupReadback>;
}

async function placeGlpNpInsideItsExistingSuite(page: Page): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find(
    (candidate) => candidate.campaignId === profile.activeCampaignId,
  );
  if (!campaign) throw new Error("Active Level 2 fixture campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as {
    employees: Array<{ id: string; location: { x: number; y: number }; path: Array<{ x: number; y: number }>; pathIndex: number }>;
  };
  const np = state.employees.find((employee) => employee.id === "employee.l2.glp");
  if (!np) throw new Error("Level 2 fixture GLP-1 NP is missing.");
  // The helper's review grid deliberately clusters staff near the map center.
  // Operational automation additionally requires this existing NP to occupy
  // the already-built suite, so pin only this test fixture to its room tile.
  np.location = { x: 45, y: 26 };
  np.path = [{ x: 45, y: 26 }];
  np.pathIndex = 0;
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ key, nextProfile }) => {
    window.localStorage.setItem(key, JSON.stringify(nextProfile));
  }, { key: "gamify-surgery.prototype.profile.v1", nextProfile: profile });
}

async function centerNpForEvidence(page: Page): Promise<void> {
  await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {
      __facilityGame: { scene: { getScene: (key: string) => any } };
    };
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    // The Level 2 review grid places the GLP suite well east of the founder
    // desk. Pan only this isolated visual fixture so its live NP popup is
    // readable in the evidence screenshot.
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.cameraView.panX - scene.layout.tileSize * 11,
      panY: scene.cameraView.panY + scene.layout.tileSize * 2,
    });
  });
}

async function waitForNoPopup(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {
      __facilityGame?: { scene: { getScene: (key: string) => any } };
    };
    const scene = host.__facilityGame?.scene.getScene("facility-scene");
    return scene && scene.earningsPopupTexts.size === 0;
  });
}

function capturePageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.location().url.endsWith("/favicon.ico")
    ) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("manual GLP-1 credit renders one founder popup above the sprite, expires, and does not replay after reload", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Phaser popup bounds are checked on desktop Chromium.");
  const errors = capturePageErrors(page);
  await clearIsolatedTestStorage(page);
  await startClinic(page, "Popup Founder", "Popup Founder Clinic");
  await openGaitProof(page, "Popup Founder Clinic");

  const panel = page.locator(".emergency-glp1-panel");
  await expect(panel).toBeVisible();
  const before = await readMoney(page);
  await panel.getByRole("button", { name: /Complete consult \(\+\$50\)/ }).click();
  await expect(moneyValue(page)).toContainText(`$${before + 50}`);
  const popup = await waitForPopupReadback(
    page,
    "character:founder",
    "founder",
    "founder",
  );
  expect(popup).toMatchObject({ text: "+$50", actorKey: "character:founder" });
  expect(popup.popupBottom).toBeLessThan(popup.actorTop);
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-021-manual-founder-popup.png`,
    animations: "disabled",
  });

  await page.waitForTimeout(1_650);
  await waitForNoPopup(page);
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Popup Founder Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForTimeout(300);
  await waitForNoPopup(page);
  expect(errors).toEqual([]);
});

test("an operational GLP-1 NP hides both panels and receives the actual automated $50 Phaser popup", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Automation and Phaser bounds are checked on desktop Chromium.");
  testInfo.setTimeout(90_000);
  const errors = capturePageErrors(page);
  await clearIsolatedTestStorage(page);
  await startClinic(page, "NP Popup Founder", "NP Popup Clinic");
  await installLevelTwoVisualState(page);
  await placeGlpNpInsideItsExistingSuite(page);
  await openGaitProof(page, "NP Popup Clinic");

  await expect(page.getByRole("heading", { name: "Cash-Only GLP-1 Consult" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "GLP-1 Consult Automation" })).toHaveCount(0);
  await expect(page.locator(".patient-rail-column .emergency-glp1-panel")).toHaveCount(0);
  await centerNpForEvidence(page);

  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => {
    const state = await getActiveState(page) as any;
    return state.serviceIncomeReceipts?.find(
      (receipt: any) => receipt.incomeLineId === "income.glp1_telehealth" && receipt.actorId === "employee.l2.glp",
    ) ?? null;
  }, { timeout: 35_000 }).toMatchObject({
    actorKind: "employee",
    actorId: "employee.l2.glp",
    grossAmount: 50,
    netCashDelta: 50,
  });
  const popup = await waitForPopupReadback(
    page,
    "character:staff:employee.l2.glp",
    "employee",
    "employee.l2.glp",
  );
  expect(popup).toMatchObject({ text: "+$50", actorKey: "character:staff:employee.l2.glp" });
  expect(popup.popupBottom).toBeLessThan(popup.actorTop);
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-021-automation-np-popup.png`,
    animations: "disabled",
  });
  await page.waitForTimeout(1_650);
  await waitForNoPopup(page);
  expect(errors).toEqual([]);
});
