import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { readDurableLocalState } from "./ui-density-helpers";
import {
  PROFILE_KEY,
  installLevelOneVisualState,
  resumeLocalCampaign,
  startClinic,
} from "./helpers";

test("Build Mode exposes clear tools, upgrade controls, and every exit issue", async ({
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
  await resumeLocalCampaign(page, "Build Test Surgical Clinic");

  // Retained historical guidance is readable history, not an active remedy.
  // Use the ordinary owned-room entry to inspect the same upgrade controls.
  await expect(page.locator('[data-message-id="event.test.show-exam-guidance"]')).toContainText(
    "A patient requested a more comfortable Examination Room. Upgrade Examination Room.",
  );
  await expect(page.locator('[data-message-id="event.test.show-exam-guidance"]').getByRole("button")).toHaveCount(0);
  await page.getByRole("button", { name: "Enter Build Mode", exact: true }).click();
  await page.getByRole("tab", { name: /^My Rooms/ }).click();
  await page.locator('.build-owned-row[data-room-instance-id="room.visual.examination"]')
    .getByRole("button", { name: "Examination Room", exact: true }).click();
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

  const hallwayCount = async () => (await readDurableLocalState(page)).rooms
    .filter(room => room.roomDefinitionId === "room.hallway").length;
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
      // The committed local journal drains asynchronously. The live catalog
      // count is the immediate UI signal; durable recovery is asserted below.
      const committedCount = await hallwayCount();
      if (committedCount > startingHallwayCount || await page.getByRole("button", { name: /^Undo(?::|$)/ }).isEnabled()) {
        placedHallway = true;
        break;
      }
    }
    if (placedHallway) {
      break;
    }
  }
  expect(placedHallway).toBe(true);
  await expect.poll(hallwayCount).toBe(startingHallwayCount + 1);
  await expect(hallwayTool).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Done / Save" }).click();
  const invalidDialog = page.getByRole("dialog", {
    name: "Fix these access problems",
  });
  await expect(invalidDialog).toContainText(
    "Examination Room needs a reachable door.",
  );
  // Imaging Control is inert legacy space; X-ray has no adjacency requirement.
  // The disconnected painted hallway is the fixture's other current violation.
  await expect(invalidDialog).toContainText("Hallway needs a reachable door.");
  await expect(invalidDialog).toContainText(
    "Add a door between Examination Room and Front Desk",
  );
  await expect(invalidDialog).toContainText(
    "Move this room or build a hallway beside it, then add doors along the route to the Front Desk.",
  );
  await expect(invalidDialog.locator("li")).toHaveCount(2);
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
    page.locator(".build-mode-title"),
  ).toBeVisible();
  await expect(
    page.getByText("Facility time is stopped while you remodel.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".facility-pause-indicator")).toHaveCount(0);
});
