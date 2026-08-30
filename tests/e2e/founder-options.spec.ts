import { mkdirSync } from "node:fs";
import { expect, test, type Locator } from "@playwright/test";
import {
  getActiveState,
  openCampaignScreen,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

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
  await expect(page.getByText("Founder 1 of 30")).toBeVisible();
  const nextFounder = page.getByRole("button", { name: "Next founder" });
  const preview = page.locator(".founder-preview-avatar");
  await expect(page.getByText("The Attending", { exact: true })).toBeVisible();
  // The complete selected actor is one clean v4 frame, never separate head
  // and body crops that could retain a neighbouring contact-sheet fragment.
  const defaultActor = preview.locator(".pixel-avatar-authored-actor");
  await expect(defaultActor).toBeVisible();
  await expect(defaultActor).toHaveCSS("left", "0px");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-head-body-registration.png`,
    animations: "disabled",
    fullPage: false,
  });

  await clickTimes(nextFounder, 10);
  await expect(page.getByText("The Lead Clinician")).toBeVisible();
  await expect(page.getByText("Founder 11 of 30")).toBeVisible();
  await expect(preview).toHaveAttribute("data-appearance", "0-10-10");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-female.png`,
    animations: "disabled",
    fullPage: false,
  });

  await clickTimes(nextFounder, 10);
  await expect(page.getByText("Cat Clinician", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Founder 21 of 30")).toBeVisible();
  await expect(preview).toHaveAttribute("data-appearance", "1-20-20");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-cat.png`,
    animations: "disabled",
    fullPage: false,
  });

  await nextFounder.click();
  await expect(page.getByText("Penguin Resident", { exact: true })).toHaveCount(1);
  await expect(preview).toHaveAttribute("data-appearance", "0-21-21");
  const creatorAppearance = await preview.getAttribute(
    "data-appearance",
  );
  await page.getByLabel("Founder name").fill("Penguin Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Be Rich and Happy" }).click();
  await expect(
    page.getByLabel("Penguin Founder, rich and happy"),
  ).toHaveAttribute("data-appearance", creatorAppearance!);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-penguin-happy.png`,
    animations: "disabled",
    fullPage: false,
  });
});

test("option 30 wraps from the first choice and survives clinic save and reload", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The persistence path only needs one browser project.",
  );

  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
  await page.getByRole("button", { name: "Previous founder" }).click();
  await expect(page.getByText("Axolotl Clinician", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Founder 30 of 30")).toBeVisible();

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
  });

  await page.reload();
  await page
    .getByRole("button", { name: "Resume Axolotl Surgery" })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const restored = await getActiveState(page);
  expect(restored.founder).toEqual(created.founder);
});
