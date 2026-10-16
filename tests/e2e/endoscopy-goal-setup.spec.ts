import { mkdirSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import type { GameState, ServiceOperationState } from "@gamify-surgery/game-domain";

import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

const SCREENSHOTS = ".local-dev/endoscopy-goal-browser";
const MISSING_SETUP_LABELS = [
  "Endoscopy Room",
  "Peri-op/Recovery Room",
  "Endoscopy Nurse",
  "Peri-op Nurse",
] as const;

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));
test.setTimeout(120_000);

async function installState(
  page: Page,
  state: GameState,
  campaignName: string,
  marker: string,
): Promise<void> {
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

async function levelTwoFixture(page: Page, campaignName: string, marker: string): Promise<GameState> {
  await startClinic(page, `${campaignName} Founder`, campaignName);
  const state = (await getActiveState(page)) as unknown as GameState;
  Object.assign(state, {
    facilityLevel: 2,
    clinicalXp: 125,
    cash: 12_345,
    cashCents: 1_234_500,
    paused: true,
    simulationSpeed: 1,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    serviceAppointmentsEnabled: false,
    encounters: {},
    serviceOperations: [],
    serviceIncomeReceipts: [],
    openChartEncounterId: null,
    attendedEncounterId: null,
  });
  state.rooms = state.rooms.filter((room) =>
    room.roomDefinitionId !== "room.endoscopy" && room.roomDefinitionId !== "room.periop_recovery");
  const retainedRoomIds = new Set(state.rooms.map((room) => room.id));
  state.doors = state.doors.filter((door) => retainedRoomIds.has(door.roomId));
  state.employees = state.employees.filter((employee) =>
    !["staff.endoscopy_nurse", "staff.periop_nurse", "staff.endoscopist"].includes(employee.staffRoleDefinitionId));
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  await installState(page, state, campaignName, marker);
  return state;
}

function setupList(page: Page): Locator {
  return page.getByRole("list", { name: "Endoscopy setup requirements" }).first();
}

function setupRow(page: Page, label: string): Locator {
  return setupList(page).getByRole("listitem").filter({ hasText: label });
}

async function expandSetup(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: "View setup requirements" });
  await expect(button).toBeVisible();
  await button.click();
  await expect(setupList(page)).toBeVisible();
}

function completedHistoricalEndoscopy(facilityTick: number): ServiceOperationState {
  return {
    id: "service-operation.historical-endoscopy",
    incomeLineId: "income.endoscopy",
    catalogVersion: 1,
    actorKind: "remote",
    actorId: "historical-endoscopy-patient",
    displayName: "Historical Endoscopy Patient",
    appearance: null,
    status: "completed",
    createdAtFacilityTick: facilityTick - 120,
    waitDeadlineFacilityTick: facilityTick - 60,
    startedAtFacilityTick: facilityTick - 120,
    completedAtFacilityTick: facilityTick,
    cancelledAtFacilityTick: null,
    quoteFee: 450,
    // Legacy operations without a frozen template intentionally resolve the
    // current catalog phases. The completion goal must accept that persisted
    // evidence across changes to the number of endoscopy phases.
    phaseIndex: 0,
    phaseStartedAtFacilityTick: facilityTick - 45,
    phaseEndsAtFacilityTick: facilityTick,
    reservedRoomInstanceIds: [],
    reservedEmployeeIds: [],
    providerReservation: null,
    location: null,
    path: [],
    pathIndex: 0,
    lastMovedAtFacilityTick: facilityTick,
    cancellationReason: null,
  };
}

test("Level 2 shows one endoscopy completion goal and setup actions navigate without spending or hiring", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop navigation acceptance.");
  const seeded = await levelTwoFixture(page, "Endoscopy Goal Clinic", "endoscopy-goal.desktop.seed");

  const goals = page.locator(".goal-list > li");
  await expect(goals.filter({ hasText: "Clinical XP" })).toContainText("125/300");
  await expect(goals.filter({ hasText: "Satisfaction above 90%" })).toContainText("0/91");
  await expect(goals.filter({ hasText: "Complete your first endoscopy" })).toContainText("0/1");
  for (const oldGoal of [
    "Build Endoscopy Room",
    "Build Peri-op/Recovery Room",
    "Hire Endoscopy Nurse",
    "Hire Peri-op Nurse",
    "Hire Endoscopist",
  ]) await expect(goals.filter({ hasText: oldGoal })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Advance to Level 3" })).toHaveCount(0);
  await expect(page.getByText("Level 3 preview progress only. Level 3 is locked and not implemented.")).toBeVisible();

  await expandSetup(page);
  await expect(setupList(page).getByRole("listitem")).toHaveCount(5);
  for (const label of MISSING_SETUP_LABELS) {
    await expect(setupRow(page, label)).toContainText("Missing");
  }
  const provider = setupRow(page, "Endoscopist or founder");
  await expect(provider).toContainText("Ready");
  await expect(provider).toContainText("Hire an endoscopist to keep yourself available for clinic patients.");
  await expect(provider.getByRole("button", { name: "Hire" })).toHaveCount(0);
  await page.screenshot({ path: `${SCREENSHOTS}/desktop-level-two-endoscopy-setup.png`, animations: "disabled" });

  const cashBefore = ((await getActiveState(page)) as unknown as GameState).cash;
  await setupRow(page, "Endoscopy Room").getByRole("button", { name: "Build" }).click();
  await expect(page.getByText("Build Mode", { exact: true }).first()).toBeVisible();
  const endoscopyCard = page.locator('[data-room-definition-id="room.endoscopy"]');
  await expect(endoscopyCard).toHaveAttribute("aria-pressed", "true");
  expect(((await getActiveState(page)) as unknown as GameState).cash).toBe(cashBefore);
  expect(((await getActiveState(page)) as unknown as GameState).rooms.length).toBe(seeded.rooms.length);
  await expect(endoscopyCard).toContainText("Full setup guidance appears when selected.");
  const prepurchaseGuide = page.locator("section.endoscopy-setup-guide");
  await expect(prepurchaseGuide).toBeVisible();
  for (const label of [...MISSING_SETUP_LABELS, "Endoscopist or founder"] as const) await expect(prepurchaseGuide).toContainText(label);
  await expect(prepurchaseGuide).toContainText("Hire an endoscopist to keep yourself available for clinic patients.");
  const [cardBox, guideBox] = await Promise.all([endoscopyCard.boundingBox(), prepurchaseGuide.boundingBox()]);
  expect(cardBox).not.toBeNull();
  expect(guideBox).not.toBeNull();
  expect(guideBox!.width).toBeGreaterThan(cardBox!.width * 2);
  await prepurchaseGuide.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/desktop-endoscopy-prepurchase-guidance.png`, animations: "disabled" });

  const employeesBefore = ((await getActiveState(page)) as unknown as GameState).employees.length;
  await setupRow(page, "Endoscopy Nurse").getByRole("button", { name: "Hire" }).click();
  await expect(page.getByText("Management Mode", { exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Employees" })).toHaveAttribute("aria-selected", "true");
  const endoscopyNurseRole = page.locator('[data-staff-role-id="staff.endoscopy_nurse"]');
  await expect(endoscopyNurseRole).toHaveClass(/is-alert-highlighted/);
  expect(((await getActiveState(page)) as unknown as GameState).employees.length).toBe(employeesBefore);
  expect(((await getActiveState(page)) as unknown as GameState).cash).toBe(cashBefore);

  await page.getByRole("tab", { name: "Services & income" }).click();
  await expect(page.getByRole("tab", { name: "Services & income" })).toHaveAttribute("aria-selected", "true");
  await setupRow(page, "Peri-op Nurse").getByRole("button", { name: "Hire" }).click();
  await expect(page.getByRole("tab", { name: "Employees" })).toHaveAttribute("aria-selected", "true");
  const periopNurseRole = page.locator('[data-staff-role-id="staff.periop_nurse"]');
  await expect(periopNurseRole).toHaveClass(/is-alert-highlighted/);
  expect(((await getActiveState(page)) as unknown as GameState).employees.length).toBe(employeesBefore);

  await setupRow(page, "Peri-op/Recovery Room").getByRole("button", { name: "Build" }).click();
  await expect(page.getByText("Build Mode", { exact: true }).first()).toBeVisible();
  await expect(page.locator('[data-room-definition-id="room.periop_recovery"]')).toHaveAttribute("aria-pressed", "true");
  expect(((await getActiveState(page)) as unknown as GameState).cash).toBe(cashBefore);
  expect(((await getActiveState(page)) as unknown as GameState).rooms.length).toBe(seeded.rooms.length);
});

test("historical completed endoscopy evidence remains 1/1 after reload without striking setup guidance", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop persistence acceptance.");
  const state = await levelTwoFixture(page, "Historical Endoscopy Clinic", "endoscopy-goal.history.seed");
  state.serviceOperations = [completedHistoricalEndoscopy(state.facilityTick)];
  await installState(page, state, "Historical Endoscopy Clinic", "endoscopy-goal.history.completed.seed");

  const completionGoal = page.locator(".goal-list > li").filter({ hasText: "Complete your first endoscopy" });
  await expect(completionGoal).toContainText("1/1");
  await expect(completionGoal).toHaveClass(/is-complete/);
  await expect(page.getByRole("button", { name: "Advance to Level 3" })).toHaveCount(0);
  await expandSetup(page);
  for (const label of [...MISSING_SETUP_LABELS, "Endoscopist or founder"] as const) {
    const text = setupRow(page, label).locator("span").nth(1);
    await expect(text).toBeVisible();
    await expect(text).toContainText(label);
    expect(await text.evaluate((element) => getComputedStyle(element).textDecorationLine)).toBe("none");
  }
  await page.screenshot({ path: `${SCREENSHOTS}/desktop-completed-endoscopy-goal.png`, animations: "disabled" });

  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Historical Endoscopy Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.locator(".goal-list > li").filter({ hasText: "Complete your first endoscopy" })).toContainText("1/1");
});

test("compact layout keeps the five setup requirements and pre-purchase guidance readable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "compact-desktop-chrome", "Compact desktop layout acceptance.");
  await levelTwoFixture(page, "Compact Endoscopy Clinic", "endoscopy-goal.compact.seed");
  await expandSetup(page);
  await expect(setupList(page).getByRole("listitem")).toHaveCount(5);
  for (const label of [...MISSING_SETUP_LABELS, "Endoscopist or founder"] as const) {
    const row = setupRow(page, label);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeInViewport();
  }
  await page.screenshot({ path: `${SCREENSHOTS}/compact-level-two-endoscopy-setup.png`, animations: "disabled" });

  await setupRow(page, "Endoscopy Room").getByRole("button", { name: "Build" }).click();
  const card = page.locator('[data-room-definition-id="room.endoscopy"]');
  await expect(card).toContainText("Full setup guidance appears when selected.");
  const guidance = page.locator("section.endoscopy-setup-guide");
  await guidance.scrollIntoViewIfNeeded();
  await expect(guidance).toBeVisible();
  await expect(guidance).toContainText("Endoscopist or founder");
  await expect(guidance).toContainText("Hire an endoscopist to keep yourself available for clinic patients.");
  const [cardBox, guideBox] = await Promise.all([card.boundingBox(), guidance.boundingBox()]);
  expect(cardBox).not.toBeNull();
  expect(guideBox).not.toBeNull();
  expect(guideBox!.width).toBeGreaterThan(cardBox!.width * 2);
  await page.screenshot({ path: `${SCREENSHOTS}/compact-endoscopy-prepurchase-guidance.png`, animations: "disabled" });
});
