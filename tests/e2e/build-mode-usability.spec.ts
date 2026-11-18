import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { getRoomInstanceFootprint } from "@gamify-surgery/game-domain";
import { readDurableLocalState } from "./ui-density-helpers";
import {
  clickFacilityTileCenter,
  expectLocalFixtureContent,
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
  // Compose the whole synthetic clinic before its fresh identity first mounts.
  // The installer checks recovered journal content on this original opening.
  const fixture = await installLevelOneVisualState(page, state => {
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
  });

  // Keep the ordinary fixture reopen, with the observation-only scene hook
  // needed to map the later hallway tile's center to native canvas input.
  const proofUrl = new URL(page.url());
  proofUrl.searchParams.set("facility-gait-proof", "1");
  await page.goto(proofUrl.href);
  await resumeLocalCampaign(page, "Build Test Surgical Clinic");
  await expectLocalFixtureContent(page, fixture);

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
  // The synthetic prototype grid is 72x32. Tile (41,26) lies east of the
  // Examination Room/Bathroom and two rows north of Minor-Procedure Room.
  // It is isolated, so its access issue must exercise the generic fallback.
  // The old 20%-height scan sampled a tile boundary; a harmless 1px camera
  // centering difference could instead place a hall against Examination Room.
  const hallwayTile = { x: 41, y: 26 };
  const fixtureGrid = { width: 72, height: 32 };
  const beforePlacement = await readDurableLocalState(page);
  expect(hallwayTile.x).toBeGreaterThanOrEqual(0);
  expect(hallwayTile.x).toBeLessThan(fixtureGrid.width);
  expect(hallwayTile.y).toBeGreaterThanOrEqual(0);
  expect(hallwayTile.y).toBeLessThan(fixtureGrid.height);
  const roomBounds = beforePlacement.rooms.map(room => {
    const footprint = getRoomInstanceFootprint(beforePlacement, room.id);
    if (!footprint) throw new Error(`Missing durable footprint for ${room.id}.`);
    return { id: room.id, left: room.x, top: room.y,
      right: room.x + footprint.width, bottom: room.y + footprint.height };
  });
  const coversTile = (room: typeof roomBounds[number], padding: number) =>
    hallwayTile.x >= room.left - padding && hallwayTile.x < room.right + padding
    && hallwayTile.y >= room.top - padding && hallwayTile.y < room.bottom + padding;
  expect(roomBounds.filter(room => coversTile(room, 0)), "The hallway fixture tile must be empty.").toEqual([]);
  // A full one-tile clearance also rejects diagonal neighbors, making a
  // changed fixture fail before input instead of selecting another hint.
  expect(roomBounds.filter(room => coversTile(room, 1)), "The hallway fixture tile must not touch any room.").toEqual([]);
  await clickFacilityTileCenter(page, hallwayTile);
  // The committed local journal drains asynchronously. Retain the immediate
  // durable-count/Undo signal and the original durable count poll below.
  const committedCount = await hallwayCount();
  const placedHallway = committedCount > startingHallwayCount || await page.getByRole("button", { name: /^Undo(?::|$)/ }).isEnabled();
  expect(placedHallway).toBe(true);
  await expect.poll(hallwayCount).toBe(startingHallwayCount + 1);
  const previousRoomIds = new Set(beforePlacement.rooms.map(room => room.id));
  const addedRooms = (await readDurableLocalState(page)).rooms.filter(room => !previousRoomIds.has(room.id));
  expect(addedRooms).toMatchObject([{ roomDefinitionId: "room.hallway", x: hallwayTile.x, y: hallwayTile.y }]);
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
