import { mkdirSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

async function fastForward(page: Page): Promise<void> {
  const tools = page.locator("details.development-panel");
  if ((await tools.getAttribute("open")) === null) {
    await tools.locator(":scope > summary").click();
  }
  await tools.getByRole("button", { name: /Fast-forward/ }).click();
}

async function placeRoomAt(
  facility: Locator,
  tileX: number,
  tileY: number,
): Promise<void> {
  const box = await facility.boundingBox();
  if (!box) {
    throw new Error("Facility canvas is not visible.");
  }

  const headerHeight = Math.max(42, Math.min(58, Math.floor(box.height * 0.13)));
  const footerHeight = Math.max(32, Math.min(44, Math.floor(box.height * 0.1)));
  const usableWidth = Math.max(1, box.width - 24);
  const usableHeight = Math.max(1, box.height - headerHeight - footerHeight);
  const tileSize = Math.max(
    10,
    Math.floor(Math.min(usableWidth / 16, usableHeight / 10)),
  );
  const originX = Math.floor((box.width - tileSize * 16) / 2);
  const originY = Math.floor(
    headerHeight + (usableHeight - tileSize * 10) / 2,
  );

  await facility.click({
    position: {
      x: originX + (tileX + 0.5) * tileSize,
      y: originY + (tileY + 0.5) * tileSize,
    },
  });
}

async function acknowledgeAndFile(page: Page): Promise<void> {
  await page
    .getByRole("button", { name: /I understand/ })
    .click();
  await page.getByRole("button", { name: "File in Resolved" }).click();
}

async function getActiveCampaignSeed(page: Page): Promise<string> {
  return page.evaluate(() => {
    const rawProfile = window.localStorage.getItem(
      "gamify-surgery.prototype.profile.v1",
    );
    if (!rawProfile) {
      throw new Error("Local campaign profile is missing.");
    }
    const profile = JSON.parse(rawProfile) as {
      activeCampaignId: string;
      campaigns: Array<{
        campaignId: string;
        serializedState: string;
      }>;
    };
    const active = profile.campaigns.find(
      (campaign) => campaign.campaignId === profile.activeCampaignId,
    );
    if (!active) {
      throw new Error("Active campaign record is missing.");
    }
    return (JSON.parse(active.serializedState) as { campaignSeed: string })
      .campaignSeed;
  });
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("plays Level 0, enters Level 1, saves, and isolates campaign FSRS", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The full progression walkthrough runs once on desktop.",
  );

  await page.goto("/");
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pixel Patient/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: /Pixel Patient/ }).click();
  await page.getByRole("button", { name: "SIGNAL ALPHA" }).click();
  await expect(
    page.locator(".chart-panel").getByText(/Synthetic analysis pending/),
  ).toBeVisible();

  await fastForward(page);
  await page.getByRole("button", { name: "ACTION CIRCLE" }).click();
  await acknowledgeAndFile(page);

  await fastForward(page);
  await page.getByRole("button", { name: /Morgan Thread/ }).click();
  await page
    .getByRole("button", {
      name: /Assess wound type and vaccine history/,
    })
    .click();
  await acknowledgeAndFile(page);

  await page.getByRole("button", { name: /Examination Room/ }).click();
  await placeRoomAt(page.getByTestId("facility-canvas"), 7, 2);
  await expect(
    page.getByRole("button", { name: /Advance to Level 1/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Advance to Level 1/ }).click();
  await expect(page.getByText("Level 1", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Bathroom/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Receptionist/ }),
  ).toBeVisible();

  await fastForward(page);
  const waitingFolder = page
    .locator(".patient-folder")
    .filter({ has: page.getByRole("heading", { name: /Waiting/ }) });
  const levelOnePatient = waitingFolder.locator(".patient-tab").first();
  await expect(levelOnePatient).toBeVisible();
  await levelOnePatient.click();
  await page
    .getByRole("button", {
      name:
        /Assess wound type|Incision and drainage|Contact the surgical team|Refer for surgical evaluation/,
    })
    .click();
  await expect(page.getByText(/Correct|Corrective feedback/).first()).toBeVisible();

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-desktop.png`,
    fullPage: true,
  });

  await acknowledgeAndFile(page);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/level-1-facility-desktop.png`,
    fullPage: false,
  });
  await page.reload();
  await expect(page.getByText("Level 1", { exact: true }).first()).toBeVisible();
  const originalCampaignSeed = await getActiveCampaignSeed(page);

  await page.getByRole("button", { name: /Campaigns \(1\)/ }).click();
  await page.getByRole("button", { name: "Create fresh campaign" }).click();
  await expect(page.getByText("Level 0", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pixel Patient/ }),
  ).toBeVisible();

  const tools = page.locator("details.development-panel");
  await tools.locator(":scope > summary").click();
  await expect(tools.getByText(/0 reviewed \/ 6 available/)).toBeVisible();
  await expect(tools.getByText(/0 scored/)).toBeVisible();
  await tools.getByText("Inspect FSRS cards").click();
  await expect(
    tools.getByText("New · no campaign review"),
  ).toHaveCount(6);
  expect(await getActiveCampaignSeed(page)).not.toBe(originalCampaignSeed);

  await page.getByRole("button", { name: /Campaigns \(2\)/ }).click();
  await page.getByRole("button", { name: "Open Clinic 1" }).click();
  await expect(page.getByText("Level 1", { exact: true }).first()).toBeVisible();

  const resumeButton = page.getByRole("button", { name: "Resume" });
  if (await resumeButton.isVisible()) {
    await resumeButton.click();
  }
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(
    page.getByRole("heading", { name: /Restart this local prototype/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await page.getByRole("button", { name: "Keep playing" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm fresh start" }).click();
  await expect(page.getByText("Level 0", { exact: true }).first()).toBeVisible();
  expect(await getActiveCampaignSeed(page)).toBe(originalCampaignSeed);
  await expect(
    page.getByRole("button", { name: /Campaigns \(3\)/ }),
  ).toBeVisible();
});

test("keeps the chart and facility usable at the configured viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const facility = page.locator(".facility-frame");
  await expect(facility).toBeVisible();
  await page.getByRole("button", { name: /Pixel Patient/ }).click();

  const chart = page.locator(".chart-panel");
  await expect(chart).toBeVisible();
  const [facilityBox, chartBox] = await Promise.all([
    facility.boundingBox(),
    chart.boundingBox(),
  ]);
  expect(facilityBox).not.toBeNull();
  expect(chartBox).not.toBeNull();
  expect(chartBox!.x).toBeGreaterThanOrEqual(facilityBox!.x);
  expect(chartBox!.x + chartBox!.width).toBeLessThanOrEqual(
    facilityBox!.x + facilityBox!.width + 1,
  );

  const noHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  expect(noHorizontalOverflow).toBe(true);

  if (testInfo.project.name === "phone-chrome") {
    await page.screenshot({
      path: `${SCREENSHOT_DIRECTORY}/level-0-phone.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "SIGNAL ALPHA" }).click();
    await expect(
      chart.getByText(/Synthetic analysis pending/),
    ).toBeVisible();
  }
});
