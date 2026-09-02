import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getProfile,
  installLevelOneVisualState,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

async function openSideCapProof(source: Page, includeSideDoors: boolean): Promise<Page> {
  const profile = await getProfile(source);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active campaign is missing.");
  const state = JSON.parse(campaign.serializedState) as {
    paused?: boolean;
    doors?: Array<{ id: string; roomId: string; side: string; offset: number; exterior: boolean }>;
  };
  // The persisted east/west apertures prove the cap generator subtracts only
  // the real floor slots; all other review rooms remain in their production
  // Level 1 visual arrangement for a scale/corner check.
  state.doors = (state.doors ?? []).filter((door) =>
    door.roomId !== "room.visual.examination" && door.roomId !== "room.visual.waiting",
  );
  if (includeSideDoors) {
    state.doors.push(
      { id: "door.visual.exam.east-cap-gap", roomId: "room.visual.examination", side: "east", offset: 0, exterior: false },
      { id: "door.visual.waiting.west-cap-gap", roomId: "room.visual.waiting", side: "west", offset: 1, exterior: false },
    );
  }
  state.paused = true;
  campaign.serializedState = JSON.stringify(state);
  await source.evaluate(({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)), {
    key: PROFILE_KEY,
    value: profile,
  });

  const capture = await source.context().newPage();
  await capture.setViewportSize({ width: 1600, height: 1100 });
  await capture.goto("/?prototype-tools=0");
  const resume = capture.getByRole("button", { name: "Resume Vale Surgical Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(capture.getByTestId("facility-canvas")).toBeVisible();
  await capture.addStyleTag({ content: ".facility-pause-indicator { visibility: hidden !important; }" });
  await capture.waitForTimeout(180);
  return capture;
}

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

test("renders canonical top-down side caps and exact live side-door gaps at 100%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Capture controlled native desktop side-wall evidence.");
  await page.setViewportSize({ width: 1600, height: 1100 });
  await startClinic(page, "Dr. Rowan Vale", "Vale Surgical Clinic");
  await installLevelOneVisualState(page);

  const normal = await openSideCapProof(page, false);
  await normal.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/top-down-side-caps-100-normal-desktop.png`,
    animations: "disabled",
  });
  const doors = await openSideCapProof(page, true);
  await doors.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/top-down-side-caps-100-east-west-door-gaps-desktop.png`,
    animations: "disabled",
  });
  await normal.close();
  await doors.close();
});
