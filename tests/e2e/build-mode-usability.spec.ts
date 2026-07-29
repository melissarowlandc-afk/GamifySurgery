import { expect, test } from "@playwright/test";
import {
  PROFILE_KEY,
  installLevelOneVisualState,
  startClinic,
} from "./helpers";

test("Build Mode exposes clear tools, upgrade confirmation, and every exit issue", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The construction interaction is exercised once in desktop Chromium.",
  );

  await startClinic(
    page,
    "Build Test Founder",
    "Build Test Surgical Clinic",
  );
  await installLevelOneVisualState(page);

  const mutatedProfile = await page.evaluate((profileKey) => {
    const profile = JSON.parse(
      window.localStorage.getItem(profileKey) ?? "{}",
    ) as {
      activeCampaignId: string;
      campaigns: Array<{
        campaignId: string;
        serializedState: string;
      }>;
    };
    const campaign = profile.campaigns.find(
      (candidate) =>
        candidate.campaignId === profile.activeCampaignId,
    );
    if (!campaign) {
      throw new Error("Active test campaign is missing.");
    }
    const state = JSON.parse(campaign.serializedState) as {
      facilityTick: number;
      doors: Array<{ id: string }>;
      events: unknown[];
    };
    state.doors = state.doors.filter(
      (door) =>
        door.id !== "door.visual.exam.front" &&
        door.id !== "door.visual.xray.control",
    );
    state.events.push({
      id: "event.test.show-exam",
      type: "room_upgraded",
      facilityTick: state.facilityTick + 100,
      encounterId: null,
      message: "Examination Room selected for renovation review.",
      priority: "informational",
      definitionId: "event.facility.room-upgraded",
      target: {
        kind: "room",
        id: "room.visual.examination",
      },
    });
    campaign.serializedState = JSON.stringify(state);
    window.localStorage.setItem(profileKey, JSON.stringify(profile));
    return profile;
  }, PROFILE_KEY);
  // `installLevelOneVisualState` deliberately installs a reload fixture.
  // Register this later override so the invalid renovation state wins on the
  // next navigation as well.
  await page.addInitScript(
    ({ profileKey, profile }) => {
      window.localStorage.setItem(profileKey, JSON.stringify(profile));
    },
    { profileKey: PROFILE_KEY, profile: mutatedProfile },
  );

  await page.reload();
  const resume = page.getByRole("button", {
    name: "Resume Build Test Surgical Clinic",
  });
  if (await resume.isVisible()) {
    await resume.click();
  }
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  await page
    .getByRole("button", {
      name: "Examination Room selected for renovation review.",
    })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Build Mode tools" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Rotate" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Build Hallway.*\$35/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Place Door.*\$0/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove Door" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Undo \(/ }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: /Upgrade.*\$140/ })
    .click();
  const upgradeDialog = page.getByRole("dialog", {
    name: "Examination Room",
  });
  await expect(upgradeDialog).toContainText(/Level 2.*Level 3/);
  await expect(upgradeDialog).toContainText("Exact cost: $140");
  await expect(upgradeDialog).toContainText("Room service time 5% faster.");
  await upgradeDialog.getByRole("button", { name: "Cancel" }).click();

  await page.getByRole("button", { name: /Place Door.*\$0/ }).click();
  await expect(page.locator(".door-slot-grid")).not.toContainText(
    /West \d+\/\d+/,
  );

  await page.getByRole("button", { name: "Exit Build Mode" }).click();
  const invalidDialog = page.getByRole("dialog", {
    name: "Fix these access problems",
  });
  await expect(invalidDialog).toContainText(
    "Examination Room needs a reachable door.",
  );
  await expect(invalidDialog).toContainText(
    "X-ray Room must share a wall and internal door with an Imaging Control Room.",
  );
  await expect(
    page.getByText("BUILD MODE", { exact: true }),
  ).toBeVisible();
});
