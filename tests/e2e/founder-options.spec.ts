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
  await expect(page.getByText("Head 1 of 30")).toBeVisible();
  await expect(page.getByText("Body 1 of 30")).toBeVisible();
  await expect(page.getByText("Close Crop", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Clinic Basics", { exact: true }),
  ).toBeVisible();

  const nextHead = page.getByRole("button", { name: "Next head" });
  const nextBody = page.getByRole("button", { name: "Next body" });
  const preview = page.locator(".founder-preview-avatar");

  await clickTimes(nextHead, 10);
  await clickTimes(nextBody, 10);
  await expect(page.getByText("Shoulder Waves")).toBeVisible();
  await expect(page.getByText("Fitted Blazer")).toBeVisible();
  await expect(page.getByText("Head 11 of 30")).toBeVisible();
  await expect(page.getByText("Body 11 of 30")).toBeVisible();
  await expect(preview).toHaveAttribute("data-appearance", "0-10-10");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-female.png`,
    animations: "disabled",
    fullPage: false,
  });

  await clickTimes(nextHead, 10);
  await clickTimes(nextBody, 10);
  await expect(page.getByText("Cat", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Head 21 of 30")).toBeVisible();
  await expect(page.getByText("Body 21 of 30")).toBeVisible();
  await expect(preview).toHaveAttribute("data-appearance", "1-20-20");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/founder-options-cat.png`,
    animations: "disabled",
    fullPage: false,
  });

  await nextHead.click();
  await nextBody.click();
  await expect(page.getByText("Penguin", { exact: true })).toHaveCount(
    2,
  );
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
  await page.getByRole("button", { name: "Previous head" }).click();
  await page.getByRole("button", { name: "Previous body" }).click();
  await expect(page.getByText("Axolotl", { exact: true })).toHaveCount(
    2,
  );
  await expect(page.getByText("Head 30 of 30")).toBeVisible();
  await expect(page.getByText("Body 30 of 30")).toBeVisible();

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
