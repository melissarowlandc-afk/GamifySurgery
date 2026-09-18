import { expect, test } from "@playwright/test";
import {
  deserializeGameState,
  getFacilityAccessValidation,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  installLevelOneVisualState,
  installLevelTwoVisualState,
  startClinic,
} from "./helpers";

const levelTwoRooms = [
  "Ultrasound Room", "CT Suite", "Phlebotomy Station",
  "Environmental-Services Closet", "Endoscopy Room", "Peri-op/Recovery Room",
  "Training Room", "Coffee Kiosk", "GLP-1 Telehealth Suite",
];
const levelTwoRoles = [
  "Peri-op Nurse", "Endoscopy Nurse", "Endoscopist", "Phlebotomist", "EVS Worker", "GLP-1 NP",
];

test("a persisted Level 1 campaign advances once, then exposes the Level 2 build and staffing surfaces", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Level transition is covered in desktop Chromium.");
  await startClinic(page, "Level Two Founder", "Level Two Surgical Clinic");
  await installLevelOneVisualState(page);

  const qualifyingProfile = await page.evaluate((profileKey) => {
    const profile = JSON.parse(window.localStorage.getItem(profileKey) ?? "{}");
    const campaign = profile.campaigns.find((item: { campaignId: string }) => item.campaignId === profile.activeCampaignId);
    const state = JSON.parse(campaign.serializedState);
    state.clinicalXp = 150;
    state.cash = 7_777;
    state.cashCents = 777_700;
    state.paused = true;
    state.nextRoutineArrivalTick = 999_999;
    const completed = Object.values(state.encounters)[0] as Record<string, unknown> | undefined;
    if (completed) {
      completed.lifecycle = "ended";
      completed.resolutionReason = "completed";
      completed.finalPatientSatisfaction = 95;
      completed.resolvedAtFacilityTick = state.facilityTick;
    }
    campaign.serializedState = JSON.stringify(state);
    return profile;
  }, PROFILE_KEY);
  await page.addInitScript(({ key, profile }) => window.localStorage.setItem(key, JSON.stringify(profile)), { key: PROFILE_KEY, profile: qualifyingProfile });
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Level Two Surgical Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByRole("button", { name: "Advance to Level 2" })).toBeVisible();
  const before = await getActiveState(page);
  await page.getByRole("button", { name: "Advance to Level 2" }).click();
  await expect(page.getByText("Level 2 goals")).toBeVisible();
  const advanced = await getActiveState(page);
  expect(advanced.facilityLevel).toBe(2);
  expect(advanced.clinicalXp).toBe(0);
  expect(advanced.cash).toBe(7_777);
  expect(advanced.rooms.map((room: any) => room.id)).toEqual(before.rooms.map((room: any) => room.id));
  expect((advanced as any).employees.map((employee: any) => employee.id)).toEqual((before as any).employees.map((employee: any) => employee.id));
  expect((advanced as any).facilityTick).toBe((before as any).facilityTick);
  expect((advanced as any).nextRoutineArrivalTick).toBe((before as any).nextRoutineArrivalTick);
  expect((advanced as any).learningHistories).toEqual((before as any).learningHistories);
  expect((advanced as any).encounters).toEqual((before as any).encounters);
  const advancedProfile = await page.evaluate((profileKey) =>
    JSON.parse(window.localStorage.getItem(profileKey) ?? "{}"), PROFILE_KEY);
  // The qualifying fixture was registered as an init script for its reload;
  // register the just-saved campaign afterwards so it wins on this reload.
  await page.addInitScript(({ key, profile }) => window.localStorage.setItem(key, JSON.stringify(profile)), { key: PROFILE_KEY, profile: advancedProfile });
  await page.reload();
  if (await resume.isVisible()) await resume.click();
  const restored = await getActiveState(page);
  expect([restored.facilityLevel, restored.clinicalXp, restored.cash]).toEqual([2, 0, 7_777]);
  await expect(page.getByRole("button", { name: "Advance to Level 2" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Cash-Only GLP-1 Consult" })).toBeVisible();

  await installLevelTwoVisualState(page);
  const fixture = await getActiveState(page);
  const access = getFacilityAccessValidation(
    deserializeGameState(JSON.stringify(fixture)),
  );
  expect(access).toMatchObject({ valid: true, issues: [], unreachableRoomIds: [] });
  await expect(page.getByText("Level 2 goals")).toBeVisible();
  await expect(page.getByText("300 XP")).toBeVisible();
  await expect(page.getByText("Level 3 is locked and not implemented.")).toBeVisible();
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  for (const room of levelTwoRooms) await expect(page.getByRole("button", { name: new RegExp(room) })).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/level-two-build-mode-desktop.png", animations: "disabled" });
  await page.reload();
  if (await resume.isVisible()) await resume.click();
  for (const role of levelTwoRoles) await expect(page.getByRole("heading", { name: role })).toBeVisible();
  await expect(page.getByRole("heading", { name: "GLP-1 Consult Automation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cash-Only GLP-1 Consult" })).toHaveCount(0);
  await expect(page.locator(".goal-list li").filter({ hasText: "Build Endoscopy Room" })).toContainText("1/1");
  await expect(page.locator(".goal-list li").filter({ hasText: "Build Peri-op/Recovery Room" })).toContainText("1/1");
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await page.screenshot({ path: "artifacts/screenshots/level-two-facility-desktop.png", animations: "disabled" });
});

test("phone Level 2 fixture renders the persisted room set", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The desktop project supplies the deterministic fixture.");
  await page.setViewportSize({ width: 390, height: 844 });
  await startClinic(page, "Phone Level Two", "Phone Level Two Clinic");
  await installLevelTwoVisualState(page);
  const state = await getActiveState(page);
  for (const definition of ["room.ultrasound", "room.ct", "room.phlebotomy", "room.evs_closet", "room.endoscopy", "room.periop_recovery", "room.training", "room.coffee_kiosk", "room.glp1_telehealth_suite"]) {
    expect((state.rooms as any[]).some((room) => room.roomDefinitionId === definition)).toBe(true);
  }
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await page.screenshot({ path: "artifacts/screenshots/level-two-phone.png", animations: "disabled" });
});
