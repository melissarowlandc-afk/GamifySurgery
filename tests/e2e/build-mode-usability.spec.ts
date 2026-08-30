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
      id: "event.test.show-exam-guidance",
      type: "success_message",
      facilityTick: state.facilityTick,
      encounterId: null,
      message:
        "A patient requested a more comfortable Examination Room. Upgrade Examination Room.",
      priority: "informational",
      definitionId: "alert.patient.room-upgrade-requested",
      alertCategory: "guidance",
      alertVariantId: "fixture.room-upgrade-guidance",
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
      name:
        "A patient requested a more comfortable Examination Room. Upgrade Examination Room.",
    })
    .click();
  const inspector = page.locator(".selected-room-inspector");
  await expect(
    page.getByRole("navigation", { name: "Build Mode tools" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Rotate" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Rotate" })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: /Build Hallway.*\$35/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Place Door" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove Door" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Undo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Done / Save" }),
  ).toBeVisible();
  await expect(inspector).toContainText("Examination Room");

  await page
    .getByRole("button", { name: /Upgrade - \$140/ })
    .click();
  const upgradeDialog = page.getByRole("dialog", {
    name: "Examination Room",
  });
  await expect(upgradeDialog).toContainText(/Level 2.*Level 3/);
  await expect(upgradeDialog).toContainText("Exact cost: $140");
  await expect(upgradeDialog).toContainText("Room service time 5% faster.");
  await upgradeDialog.getByRole("button", { name: "Cancel" }).click();

  await page.screenshot({
    path: "artifacts/screenshots/build-mode-condensed-desktop.png",
    fullPage: false,
    animations: "disabled",
  });

  const placeDoor = page.getByRole("button", { name: "Place Door" });
  const removeDoor = page.getByRole("button", { name: "Remove Door" });
  await placeDoor.click();
  await expect(placeDoor).toHaveAttribute("aria-pressed", "true");
  await expect(removeDoor).toHaveAttribute("aria-pressed", "false");
  await page.screenshot({
    path: "artifacts/screenshots/build-mode-door-highlights.png",
    fullPage: false,
    animations: "disabled",
  });
  await removeDoor.click();
  await expect(removeDoor).toHaveAttribute("aria-pressed", "true");
  await expect(placeDoor).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".build-mode-panel")).not.toContainText(
    /North wall|South wall|East wall|West wall/,
  );

  const hallwayTool = page.getByRole("button", {
    name: /Build Hallway.*\$35/,
  });
  await hallwayTool.click();
  await expect(hallwayTool).toHaveAttribute("aria-pressed", "true");
  await expect(placeDoor).toHaveAttribute("aria-pressed", "false");
  await expect(removeDoor).toHaveAttribute("aria-pressed", "false");

  const hallwayCount = () =>
    page.evaluate((profileKey) => {
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
        return 0;
      }
      const state = JSON.parse(campaign.serializedState) as {
        rooms: Array<{ roomDefinitionId: string }>;
      };
      return state.rooms.filter(
        (room) => room.roomDefinitionId === "room.hallway",
      ).length;
    }, PROFILE_KEY);
  const startingHallwayCount = await hallwayCount();
  const placementCanvas = page.locator(".facility-host canvas");
  const placementCanvasBox = await placementCanvas.boundingBox();
  expect(placementCanvasBox).not.toBeNull();
  let placedHallway = false;
  // Scan a few ordinary map points. Existing rooms reject placement without
  // turning off the paint tool; the first empty square should accept it.
  for (const yRatio of [0.2, 0.35, 0.5, 0.65]) {
    for (const xRatio of [0.15, 0.3, 0.5, 0.7, 0.85]) {
      await page.mouse.click(
        placementCanvasBox!.x + placementCanvasBox!.width * xRatio,
        placementCanvasBox!.y + placementCanvasBox!.height * yRatio,
      );
      if ((await hallwayCount()) > startingHallwayCount) {
        placedHallway = true;
        break;
      }
    }
    if (placedHallway) {
      break;
    }
  }
  expect(placedHallway).toBe(true);
  await expect(hallwayTool).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Done / Save" }).click();
  const invalidDialog = page.getByRole("dialog", {
    name: "Fix these access problems",
  });
  await expect(invalidDialog).toContainText(
    "Examination Room needs a reachable door.",
  );
  await expect(invalidDialog).toContainText(
    "X-ray Room must share a wall and internal door with an Imaging Control Room.",
  );
  expect(
    await invalidDialog.evaluate((dialog) => {
      const bounds = dialog.getBoundingClientRect();
      const topmostElement = document.elementFromPoint(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2,
      );
      return {
        portaledToBody:
          dialog.parentElement?.parentElement === document.body,
        dialogIsTopmost:
          topmostElement !== null && dialog.contains(topmostElement),
      };
    }),
  ).toEqual({
    portaledToBody: true,
    dialogIsTopmost: true,
  });
  await invalidDialog
    .getByRole("button", { name: "Continue Renovating" })
    .click();
  await expect(invalidDialog).toBeHidden();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(
    page.getByText("BUILD MODE", { exact: true }),
  ).toBeVisible();
});
