import { expect, test, type Page } from "@playwright/test";
import type { GameState } from "@gamify-surgery/game-domain";
import { getActiveState, installRememberedLocalAccess } from "./helpers";

// This spec deliberately targets the existing cap-5, disposable QA entry.
// It never installs a fixture in the owner's 4173 profile or opens the live cap.
const QA = "http://127.0.0.1:5184";
const states = ["integration-l4", "integration-build", "integration-preparing", "integration-running",
  "integration-final", "integration-finish", "integration-repeat-final", "integration-repeat", "integration-lower-repeat"] as const;
test.use({ baseURL: QA });

async function openQa(page: Page, scenario: string, phone: boolean) {
  await installRememberedLocalAccess(page);
  await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1600, height: 1000 });
  // facility-gait-proof exposes the read-only Phaser handle the map assertions poll.
  await page.goto(`${QA}/level4-rooms-qa.html?level5=${scenario}&layout=${phone ? "phone" : "desktop"}&facility-gait-proof`);
  expect(await page.evaluate(() => location.origin)).toBe(QA);
  await page.getByRole("button", { name: `Resume Level 5 M9 integration (${scenario})`, exact: true }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")))).toBe(true);
}
const savedState = async (page: Page) => await getActiveState(page) as unknown as GameState;
async function closeOpenChart(page: Page, phone: boolean) {
  if (!(await savedState(page)).openChartEncounterId) return;
  // Phone sheets use their Close action / browser Back, not desktop Escape.
  // Both actions retain the session's guarded feedback acknowledgment.
  if (phone) {
    await page.getByRole("dialog", { name: "Patient chart", exact: true })
      .getByRole("button", { name: "Close Patient chart", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Patient chart", exact: true })).toHaveCount(0);
  } else await page.keyboard.press("Escape");
  await expect.poll(async () => (await savedState(page)).openChartEncounterId).toBeNull();
}
async function openGoals(page: Page, phone: boolean) {
  if (phone) { await page.getByRole("button", { name: "More clinic options" }).click(); await page.getByRole("button", { name: "Goals", exact: true }).click(); }
}

for (const phone of [false, true]) {
  for (const scenario of states) {
    test(`${scenario} renders without page errors in ${phone ? "phone" : "desktop"}`, async ({ page }, info) => {
      const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
      await openQa(page, scenario, phone);
      const state = await savedState(page);
      expect(state.facilityLevel).toBe(scenario === "integration-l4" ? 4 : 5);
      if (scenario === "integration-finish") {
        await expect(page.locator(".finished-game-dialog")).toBeVisible();
        await expect(page.getByRole("button", { name: "Keep playing", exact: true })).toBeVisible();
      } else {
        await expect(page.locator(".finished-game-dialog")).toHaveCount(0);
        if (scenario === "integration-running" || scenario === "integration-final" || scenario === "integration-repeat-final") {
          expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(10);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: info.outputPath(`${scenario}-${phone ? "phone" : "desktop"}.png`) });
      expect(errors).toEqual([]);
    });
  }

  test(`Build, Executive and goal controls are exposed in ${phone ? "phone" : "desktop"}`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await openQa(page, "integration-build", phone);
    // Advancement carries the real Level 4 chart forward. Close it through
    // the existing guarded UI before entering Build/Manage.
    await closeOpenChart(page, phone);
    await page.getByRole("button", { name: phone ? "Build" : "Enter Build Mode", exact: true }).click();
    if (!phone) {
      // This earned fixture already built the one-per-clinic rooms. Their
      // disabled New Rooms cards are intentionally in a closed disclosure.
      const maximum = page.locator(".build-maximum-rooms");
      await maximum.locator("summary").click();
      await expect(maximum).toHaveAttribute("open", "");
    }
    for (const id of ["room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym"]) {
      const button = page.locator(`[${phone ? "data-build-room-option" : "data-room-definition-id"}="${id}"]`);
      await expect(button).toHaveCount(1); await button.scrollIntoViewIfNeeded(); await expect(button).toBeVisible();
    }
    if (phone) await page.getByRole("button", { name: "Manage", exact: true }).click();
    else { await page.getByRole("button", { name: "Done / Save", exact: true }).click(); await page.getByRole("button", { name: "Enter Management Mode", exact: true }).click(); }
    const executive = page.locator(phone ? 'button[data-staff-role-id="staff.executive"]' : '[data-staff-role-id="staff.executive"] .staff-role-toggle');
    // Staffed desktop roles start expanded; toggling unconditionally hides
    // exactly the details this assertion is meant to exercise.
    if (phone || await executive.getAttribute("aria-expanded") !== "true") await executive.click();
    await expect(page.locator('[data-staff-role-id="staff.executive"]').last()).toContainText("45");
    if (phone) await page.getByRole("button", { name: "Clinic", exact: true }).click();
    await openGoals(page, phone);
    const inspection = page.getByRole("region", { name: "Inspection", exact: true });
    await expect(inspection.getByRole("status")).toHaveText("Inspection locked");
    await expect(inspection.getByRole("button", { name: "Book inspection · Locked", exact: true })).toBeDisabled();
    expect((await savedState(page)).clinicalXp).toBe(0);
    expect(errors).toEqual([]);
  });

  test(`final minute, finish dismissal and campaign confirmation in ${phone ? "phone" : "desktop"}`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await openQa(page, "integration-final", phone);
    await closeOpenChart(page, phone);
    const before = await savedState(page);
    await page.getByRole("button", { name: "Resume facility time", exact: true }).click();
    await expect(page.locator(".finished-game-dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Congratulations. Your reward is a report card and the opportunity to improve it." })).toBeVisible();
    const report = page.locator(".finished-game-dialog .inspection-report-card");
    await expect(report.locator(phone ? ".inspection-category-tile" : ".inspection-category-row")).toHaveCount(10);
    if (phone) {
      await report.locator(".inspection-category-tile").first().click();
      await expect(report).toContainText("How to improve");
      await report.getByRole("button", { name: "← Back to report card", exact: true }).click();
      await expect(report.locator(".inspection-category-tile")).toHaveCount(10);
    }
    await page.reload();
    await page.getByRole("button", { name: "Resume Level 5 M9 integration (integration-final)", exact: true }).click();
    await expect(page.locator(".finished-game-dialog")).toBeVisible();
    await page.getByRole("button", { name: "Start new campaign", exact: true }).click();
    await page.getByRole("button", { name: "Return to report", exact: true }).click();
    await page.getByRole("button", { name: "Keep playing", exact: true }).click();
    await expect(page.locator(".finished-game-dialog")).toHaveCount(0);
    const kept = await savedState(page);
    expect(kept.campaignId).toBe(before.campaignId);
    expect(kept.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).not.toBeNull();
    await page.reload();
    await page.getByRole("button", { name: "Resume Level 5 M9 integration (integration-final)", exact: true }).click();
    await expect(page.locator(".finished-game-dialog")).toHaveCount(0);
    await openGoals(page, phone);
    await page.getByRole("button", { name: "View finish report", exact: true }).click();
    await page.getByRole("button", { name: "Start new campaign", exact: true }).click();
    await page.getByRole("button", { name: "Confirm new campaign", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Open Your Clinic" })).toBeVisible();
    // Finish-page action reaches the normal founder flow; fresh identity/history
    // and preservation are also proven by the real session integration tests.
    expect(errors).toEqual([]);
  });

  test(`a real higher retry keeps the first finish dismissed in ${phone ? "phone" : "desktop"}`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await openQa(page, "integration-repeat-final", phone);
    const before = await savedState(page);
    await closeOpenChart(page, phone);
    await page.getByRole("button", { name: "Resume facility time", exact: true }).click();
    await openGoals(page, phone);
    await expect(page.getByRole("region", { name: "Inspection", exact: true }).getByRole("status"))
      .toHaveText("Inspection completed", { timeout: 15_000 });
    // Clock-only changes autosave every 15 facility minutes. Pause is a real
    // write-through player action; first observe completion, then check its save.
    const pause = page.getByRole("button", { name: "Pause facility time", exact: true });
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect.poll(async () => (await savedState(page)).levelFive!.inspection.status).toBe("completed");
    const after = await savedState(page);
    expect(after.levelFive!.inspection.latestCompletedReport!.rawTotalScore!).toBeGreaterThan(before.levelFive!.inspection.bestCompletedReport!.rawTotalScore!);
    expect(after.levelFive!.inspection.bestCompletedReport).toEqual(after.levelFive!.inspection.latestCompletedReport);
    expect(after.levelFive!.progress.gameFinished).toEqual(before.levelFive!.progress.gameFinished);
    await expect(page.locator(".finished-game-dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`ten inspectors expose information through the real map in ${phone ? "phone" : "desktop"}`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await openQa(page, "integration-running", phone);
    await closeOpenChart(page, phone);
    const keys = await page.evaluate(() => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      const actors = scene.bridge.viewModel.inspectors;
      if (actors.length !== 10) throw new Error("Expected ten real inspector actors");
      return actors.map((actor: any) => `character:inspector:${actor.instanceId}`) as string[];
    });
    expect(new Set(keys).size).toBe(10);
    await expect.poll(() => page.evaluate(keys => {
      const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
      return keys.every(key => {
        const container = scene.characterBitmapContainers.get(key), actor = container?.getByName("actor");
        return container?.visible && actor?.visible && actor.getData("gait-atlas-id")?.includes("inspector-v6f");
      });
    }, keys), { timeout: 15_000 }).toBe(true);
    const point = await page.evaluate(async ({ keys, phone }) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host.__facilityGame.scene.getScene("facility-scene");
      const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      for (const key of keys) {
        scene.applyCamera({ ...scene.cameraView, zoom: 1.5, panX: 0, panY: 0 });
        await frame(); scene.drawCharacters();
        const actor = scene.characterBitmapContainers.get(key).getByName("actor"), bounds = actor.getBounds();
        scene.applyCamera({ ...scene.cameraView,
          panX: scene.cameraView.panX + scene.scale.width / 2 - bounds.centerX,
          panY: scene.cameraView.panY + scene.scale.height / 2 - bounds.centerY });
        // refreshLayout redraws the room world, not character containers. Use
        // current rendered bounds after the React camera update / Phaser redraw.
        await frame(); scene.drawCharacters();
        const current = actor.getBounds(), canvas = host.querySelector("canvas"), rect = canvas.getBoundingClientRect();
        const id = key.slice("character:inspector:".length);
        for (const fy of [.5, .3, .7, .15, .85]) for (const fx of [.5, .35, .65]) {
          const local = { x: current.left + current.width * fx, y: current.top + current.height * fy };
          // Only probe inside a rendered character's hit envelope. These picks
          // describe characters without executing a floor movement or opening UI.
          const selected = phone ? scene.mobileSelectionAtPoint(local) : null;
          const picked = phone ? selected?.kind === "character" && selected.character.kind === "inspector" && selected.character.id === id
            : scene.characterAtPointer(local) === key;
          const x = rect.x + local.x * rect.width / scene.scale.width, y = rect.y + local.y * rect.height / scene.scale.height;
          if (picked && document.elementFromPoint(x, y) === canvas) return { x, y, key,
            activity: scene.bridge.viewModel.inspectors.find((actor: any) => actor.instanceId === id).activity as string };
        }
      }
      return null;
    }, { keys, phone });
    expect(point, "A rendered inspector must have an unobscured real map hit target").not.toBeNull();
    // Selection still happens exclusively through the real DOM pointer path.
    // Choose an unobscured inspector rather than an overlapped staff sprite.
    await page.mouse.click(point!.x, point!.y);
    if (phone) {
      const sheet = page.getByRole("dialog", { name: "Inspector", exact: true });
      await expect(sheet).toBeVisible(); await expect(sheet).toContainText(point!.activity);
      await expect(sheet.getByRole("button")).toHaveCount(1);
      await sheet.getByRole("button", { name: "Close Inspector", exact: true }).click();
    } else {
      await expect.poll(() => page.evaluate(key => {
        const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
        return scene.inspectTarget?.key === key && scene.inspectText?.visible ? String(scene.inspectText.text) : "";
      }, point!.key)).toMatch(/Inspector|Inspection agent/);
    }
    expect(errors).toEqual([]);
  });
}
