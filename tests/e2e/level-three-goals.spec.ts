import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import type { GameState } from "@gamify-surgery/game-domain";
import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

const EVIDENCE = ".local-dev/gs036-level-three-goals/browser";
test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));

async function installState(page: Page, state: GameState, campaignName: string, marker: string): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId)!;
  campaign.name = campaignName;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, seedMarker }) => {
    if (sessionStorage.getItem(seedMarker)) return;
    sessionStorage.setItem(seedMarker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, seedMarker: marker });
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function fixture(page: Page, level: 2 | 3): Promise<GameState> {
  const campaignName = `Level ${level} Goal Review`;
  await startClinic(page, "Goal Review Founder", campaignName);
  const state = (await getActiveState(page)) as unknown as GameState;
  Object.assign(state, {
    facilityLevel: level, clinicalXp: 125, paused: true, simulationSpeed: 1,
    cash: 12_345, cashCents: 1_234_500, encounters: {}, employees: [],
    serviceOperations: [], serviceIncomeReceipts: [], serviceAppointmentsEnabled: false,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER, nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    openChartEncounterId: null, attendedEncounterId: null,
  });
  state.environment.founderActivity = null;
  await installState(page, state, campaignName, `level-${level}.initial`);
  return state;
}

test("condensed Level 3 goals expand to the real setup and navigate without purchases", async ({ page }, testInfo) => {
  const state = await fixture(page, 3);
  const panel = page.locator(".goals-panel");
  const goals = panel.locator(":scope > .goal-list > li");
  await expect(goals).toHaveCount(4);
  await expect(goals.nth(0)).toContainText("Clinical XP125/500");
  await expect(goals.nth(1)).toContainText("Satisfaction above 90%");
  await expect(goals.nth(2)).toContainText("Hire Pharmacist");
  await expect(goals.nth(3)).toContainText("Complete your first ambulatory operation");
  for (const removed of ["Build Ambulatory OR", "Hire OR Nurse", "Build In-house Laboratory", "Hire Laboratory Technician", "Build Pharmacy"]) {
    await expect(goals.filter({ hasText: removed })).toHaveCount(0);
  }
  await panel.screenshot({ path: `${EVIDENCE}/${testInfo.project.name}-condensed.png` });
  await panel.getByRole("button", { name: "View setup requirements" }).click();
  const setup = panel.getByRole("list", { name: "Ambulatory operation setup requirements" });
  await expect(setup.getByRole("listitem")).toHaveCount(5);
  for (const label of ["Ambulatory OR", "Peri-op/Recovery Room", "OR Nurse", "Peri-op Nurse"]) {
    await expect(setup.getByRole("listitem").filter({ hasText: label })).toContainText("Missing");
  }
  const provider = setup.getByRole("listitem").filter({ hasText: "Surgeon or founder" });
  await expect(provider).toContainText("Ready");
  await expect(provider).toContainText("Founder can perform ambulatory operations.");
  await expect(provider.getByRole("button", { name: "Hire" })).toHaveCount(0);
  await expect(panel).toContainText("Finish preparation, the operation, and recovery");
  for (const row of await setup.getByRole("listitem").all()) {
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeInViewport();
  }
  expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: `${EVIDENCE}/${testInfo.project.name}-expanded.png` });

  await setup.getByRole("listitem").filter({ hasText: "Ambulatory OR" }).getByRole("button", { name: "Build" }).click();
  await expect(page.locator('[data-room-definition-id="room.ambulatory_or"]')).toHaveAttribute("aria-pressed", "true");
  expect(((await getActiveState(page)) as unknown as GameState).cash).toBe(state.cash);
  expect(((await getActiveState(page)) as unknown as GameState).rooms.length).toBe(state.rooms.length);

  await setup.getByRole("listitem").filter({ hasText: "OR Nurse" }).getByRole("button", { name: "Hire" }).click();
  await expect(page.getByRole("tab", { name: "Employees" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-staff-role-id="staff.or_nurse"]')).toHaveClass(/is-alert-highlighted/);
  expect(((await getActiveState(page)) as unknown as GameState).employees).toHaveLength(0);
  expect(((await getActiveState(page)) as unknown as GameState).cash).toBe(state.cash);
});

test("retired first-operation credit survives reload while missing setup remains readable", async ({ page }, testInfo) => {
  const state = await fixture(page, 3);
  state.retiredServiceHistory = {
    version: "retired-service-history.v1", retiredReceiptCount: 1, retiredOperationCount: 1,
    grossCents: 90_000, stockCostCents: 0, netCashDeltaCents: 90_000,
    endoscopyReceipt: false, endoscopyOperationCompleted: false,
    ambulatoryOperationReceipt: true, ambulatoryOperationCompleted: true,
  };
  await installState(page, state, "Level 3 Goal Review", "level-3.completed");
  const panel = page.locator(".goals-panel");
  const goal = panel.locator(":scope > .goal-list > li").filter({ hasText: "Complete your first ambulatory operation" });
  await expect(goal).toContainText("1/1");
  await expect(goal).toHaveClass(/is-complete/);
  await panel.getByRole("button", { name: "View setup requirements" }).click();
  const setup = panel.getByRole("list", { name: "Ambulatory operation setup requirements" });
  const missing = setup.getByRole("listitem").filter({ hasText: "Ambulatory OR" });
  await expect(missing).toContainText("Missing");
  expect(await missing.locator("span").nth(1).evaluate((element) => getComputedStyle(element).textDecorationLine)).toBe("none");
  await page.screenshot({ path: `${EVIDENCE}/${testInfo.project.name}-completed.png` });
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Level 3 Goal Review" });
  if (await resume.isVisible()) await resume.click();
  await expect(goal).toContainText("1/1");
  expect(((await getActiveState(page)) as unknown as GameState).clinicalXp).toBe(125);
});

test("Level 2 keeps its endoscopy goal and expandable setup navigation", async ({ page }) => {
  const state = await fixture(page, 2);
  const panel = page.locator(".goals-panel");
  await expect(panel.locator(":scope > .goal-list > li")).toHaveCount(3);
  await expect(panel).toContainText("Complete your first endoscopy");
  await expect(panel).not.toContainText("Complete your first ambulatory operation");
  await panel.getByRole("button", { name: "View setup requirements" }).click();
  const setup = panel.getByRole("list", { name: "Endoscopy setup requirements" });
  await expect(setup.getByRole("listitem")).toHaveCount(5);
  await expect(setup).toContainText("Endoscopist or founder");
  await setup.getByRole("listitem").filter({ hasText: "Endoscopy Room" }).getByRole("button", { name: "Build" }).click();
  await expect(page.locator('[data-room-definition-id="room.endoscopy"]')).toHaveAttribute("aria-pressed", "true");
  expect(((await getActiveState(page)) as unknown as GameState).cash).toBe(state.cash);
});
