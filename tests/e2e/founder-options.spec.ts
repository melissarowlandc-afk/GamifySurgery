import { mkdirSync } from "node:fs";
import { expect, test, type Locator } from "@playwright/test";
import {
  getActiveState,
  openCampaignScreen,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots/gs026-runtime/compatibility";

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

async function clickTimes(
  target: Locator,
  count: number,
): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    await target.click();
  }
}

test("creator exposes female and non-human founder options from one canonical appearance", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The visual founder-option walkthrough is captured once at desktop width.",
  );

  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
  await expect(page.getByText("Founder 1 of 36")).toBeVisible();
  const nextFounder = page.getByRole("button", { name: "Next founder" });
  const preview = page.locator(".founder-preview-avatar");
  await expect(page.getByText("The Attending", { exact: true })).toBeVisible();
  const defaultActor = preview.locator("img.pixel-avatar-still");
  await expect(defaultActor).toBeVisible();
  await expect(defaultActor).toHaveAttribute("src", /gs026-stills-v1\/founder\.01\/stand-south\.png$/);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-head-body-registration.png`,
    animations: "disabled",
    fullPage: false,
  });

  await clickTimes(nextFounder, 10);
  await expect(page.getByText("The Lead Clinician")).toBeVisible();
  await expect(page.getByText("Founder 11 of 36")).toBeVisible();
  await expect(preview).toHaveAttribute("data-still-id", "founder.11");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-female.png`,
    animations: "disabled",
    fullPage: false,
  });

  await clickTimes(nextFounder, 10);
  await expect(page.getByText("Cat Clinician", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Founder 21 of 36")).toBeVisible();
  await expect(preview).toHaveAttribute("data-still-id", "founder.21");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-cat.png`,
    animations: "disabled",
    fullPage: false,
  });

  await nextFounder.click();
  await expect(page.getByText("Penguin Resident", { exact: true })).toHaveCount(1);
  await expect(preview).toHaveAttribute("data-still-id", "founder.22");
  const creatorStillId = await preview.getAttribute("data-still-id");
  await page.getByLabel("Founder name").fill("Penguin Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Be Rich and Happy" }).click();
  await expect(
    page.getByLabel("Penguin Founder, rich and happy"),
  ).toHaveAttribute("data-still-id", creatorStillId!);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-penguin-happy.png`,
    animations: "disabled",
    fullPage: false,
  });
});

test("original option 30 survives the expanded picker, clinic save, and reload", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The persistence path only needs one browser project.",
  );

  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
  await clickTimes(page.getByRole("button", { name: "Next founder" }), 29);
  await expect(page.getByText("Axolotl Clinician", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Founder 30 of 36")).toBeVisible();
  await expect(page.locator(".founder-preview-avatar")).toHaveAttribute("data-still-id", "founder.30");

  await page.getByLabel("Founder name").fill("Axolotl Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("button", { name: "Build a Surgery Clinic" })
    .click();
  await page.getByLabel("Clinic name").fill("Axolotl Surgery");
  await page.getByRole("button", { name: "Open the Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const created = await getActiveState(page);
  expect(created.founder.headId).toBe("head.30");
  expect(created.founder.bodyId).toBe("body.30");
  expect(created.founder.appearance).toMatchObject({
    headVariant: 29,
    bodyVariant: 29,
    roleStyle: "founder",
    stillId: "founder.30",
  });

  await page.reload();
  await page
    .getByRole("button", { name: "Resume Axolotl Surgery" })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const restored = await getActiveState(page);
  expect(restored.founder).toEqual(created.founder);
});
