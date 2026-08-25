import { expect, test } from "@playwright/test";
import {
  getProfile,
  PROFILE_KEY,
  startClinic,
} from "./helpers";

test("the first Level 1 arrival prompt completes and persists the tutorial", async ({
  context,
  page,
}) => {
  const clinicName = "Tutorial Completion Clinic";
  await startClinic(page, "Tutorial Finisher", clinicName);

  const profile = await getProfile(page);
  const campaign = profile.campaigns.find(
    (candidate) =>
      candidate.campaignId === profile.activeCampaignId,
  );
  if (!campaign) {
    throw new Error("Active campaign is missing.");
  }
  const state = JSON.parse(campaign.serializedState) as {
    facilityLevel: number;
    facilityTick: number;
    nextRoutineArrivalTick: number;
    paused: boolean;
    encounters: Record<string, unknown>;
  };
  state.facilityLevel = 1;
  state.paused = false;
  state.encounters = {};
  state.nextRoutineArrivalTick = state.facilityTick + 10_000;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = true;

  // Install the fixture on the next document before the active React session
  // can autosave its older in-memory Level 0 state over it.
  await page.addInitScript(
    ({ profileKey, nextProfile }) => {
      window.localStorage.setItem(
        profileKey,
        JSON.stringify(nextProfile),
      );
    },
    { profileKey: PROFILE_KEY, nextProfile: profile },
  );
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", {
    name: `Resume ${clinicName}`,
  });
  if (await resume.isVisible()) {
    await resume.click();
  }

  const coach = page.locator(".tutorial-coach");
  await expect(
    coach.getByRole("heading", {
      name: "Your first Level 1 patient is on the way",
    }),
  ).toBeVisible();
  await expect(coach.getByRole("button")).toHaveCount(1);
  await expect(
    coach.getByRole("button", { name: "Complete tutorial" }),
  ).toBeVisible();
  await expect(
    coach.getByRole("button", { name: "Turn off tutorials" }),
  ).toHaveCount(0);

  await coach
    .getByRole("button", { name: "Complete tutorial" })
    .click();
  await expect(coach).toHaveCount(0);
  await expect
    .poll(async () => (await getProfile(page)).tutorialsEnabled)
    .toBe(false);

  await page.close();
  const reopenedPage = await context.newPage();
  await reopenedPage.goto("/?prototype-tools=0");
  const resumeAfterReload = reopenedPage.getByRole("button", {
    name: `Resume ${clinicName}`,
  });
  if (await resumeAfterReload.isVisible()) {
    await resumeAfterReload.click();
  }
  await expect(
    reopenedPage.getByTestId("facility-canvas"),
  ).toBeVisible();
  await expect(
    reopenedPage.locator(".tutorial-coach"),
  ).toHaveCount(0);
});
