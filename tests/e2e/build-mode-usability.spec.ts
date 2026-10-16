import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
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
  const screenshotDirectory = process.env.GAMIFY_E2E_SCREENSHOT_DIR ?? "artifacts/screenshots";
  mkdirSync(screenshotDirectory, { recursive: true });

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
  // Owner-approved Build Mode revamp: the message opens the room menu on the
  // map; upgrades are one click there and Undo refunds them.
  const roomMenu = page.locator(".room-action-menu");
  await expect(
    page.getByRole("navigation", { name: "Build Mode tools" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Build Hallway.*\$35/ }),
  ).toBeVisible();
  const doorsTool = page.getByRole("button", { name: "Doors", exact: true });
  await expect(doorsTool).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Done / Save" }),
  ).toBeVisible();
  await expect(roomMenu).toContainText("Examination Room");
  await expect(roomMenu).toContainText("Level 2 of 5");
  await expect(roomMenu).toContainText(
    "+2 satisfaction points after examination",
  );
  await expect(
    roomMenu.getByRole("button", { name: /Upgrade to ★3 · \$140/ }),
  ).toBeVisible();

  await page.screenshot({
    path: join(screenshotDirectory, "build-mode-condensed-desktop.png"),
    fullPage: false,
    animations: "disabled",
  });

  await doorsTool.click();
  await expect(doorsTool).toHaveAttribute("aria-pressed", "true");
  await expect(roomMenu).toBeHidden();
  await expect(page.locator(".build-tool-hint")).toContainText(
    "Click a door to remove it.",
  );
  await page.screenshot({
    path: join(screenshotDirectory, "build-mode-door-highlights.png"),
    fullPage: false,
    animations: "disabled",
  });
  await expect(page.locator(".build-mode-panel")).not.toContainText(
    /North wall|South wall|East wall|West wall/,
  );

  const hallwayTool = page.getByRole("button", {
    name: /Build Hallway.*\$35/,
  });
  await hallwayTool.click();
  await expect(hallwayTool).toHaveAttribute("aria-pressed", "true");
  await expect(doorsTool).toHaveAttribute("aria-pressed", "false");

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
  await expect(
    page.getByText("Facility time is stopped while you remodel.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);
});
