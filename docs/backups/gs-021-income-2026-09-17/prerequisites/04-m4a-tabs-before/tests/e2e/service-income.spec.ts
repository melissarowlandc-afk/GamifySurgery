import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  getActiveState,
  getProfile,
  setFastFacilitySpeed,
  startClinic,
} from "./helpers";

test.beforeAll(() => mkdirSync("artifacts/screenshots", { recursive: true }));

test("scheduled ultrasound creates a real visitor operation, receipt, popup, and exit while management shows income", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Facility canvas acceptance uses desktop Chromium.");
  testInfo.setTimeout(90_000);
  await startClinic(page, "Service Founder", "Service Income Clinic");
  const profile = await getProfile(page);
  profile.tutorialsEnabled = false;
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(campaign.serializedState) as any;
  state.facilityLevel = 1;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[24, 25, 26, 27, 28].map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({ id: "employee.test.imaging", staffRoleDefinitionId: "staff.imaging_technician", displayName: "Imaging Technician", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.test.ultrasound", location: { x: 34, y: 24 }, path: [{ x: 34, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
  state.serviceAppointmentsEnabled = true;
  state.lastServiceAppointmentArrivalTick = null;
  state.nextServiceAppointmentTicks = { ...state.nextServiceAppointmentTicks, "income.ultrasound": state.facilityTick + 1 };
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ nextProfile }) => window.localStorage.setItem("gamify-surgery.prototype.profile.v1", JSON.stringify(nextProfile)), { nextProfile: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resumeCampaign = page.getByRole("button", { name: "Resume Service Income Clinic" });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await expect(page.getByRole("heading", { name: "Services & income" })).toBeVisible();
  await expect(page.getByText("Routine endoscopy", { exact: true })).toBeVisible();
  await expect(page.getByText("Locked until Facility Level 2").first()).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/gs-021-m4a-management-services-income.png", animations: "disabled" });
  await page.getByLabel("Scheduled appointments").uncheck();
  await expect(page.getByLabel("Scheduled appointments")).not.toBeChecked();
  await page.getByRole("button", { name: "Done" }).click();
  const toggledProfile = await getProfile(page);
  const toggledCampaign = toggledProfile.campaigns.find((candidate) => candidate.campaignId === toggledProfile.activeCampaignId)!;
  const toggledState = JSON.parse(toggledCampaign.serializedState) as any;
  const encounterIdsBeforeService = Object.keys(toggledState.encounters);
  const xpBeforeService = toggledState.clinicalXp;
  toggledState.serviceAppointmentsEnabled = true;
  toggledState.lastServiceAppointmentArrivalTick = null;
  toggledState.nextServiceAppointmentTicks = { ...toggledState.nextServiceAppointmentTicks, "income.ultrasound": toggledState.facilityTick + 1 };
  toggledCampaign.serializedState = JSON.stringify(toggledState);
  await page.addInitScript(({ nextProfile }) => window.localStorage.setItem("gamify-surgery.prototype.profile.v1", JSON.stringify(nextProfile)), { nextProfile: toggledProfile });
  await page.reload();
  const resumeAfterToggle = page.getByRole("button", { name: "Resume Service Income Clinic" });
  if (await resumeAfterToggle.isVisible()) await resumeAfterToggle.click();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame));
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, panX: scene.cameraView.panX + scene.layout.tileSize * 8, panY: scene.cameraView.panY + scene.layout.tileSize * 3 });
  });
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => (await getActiveState(page) as any).serviceOperations?.find((operation: any) => operation.incomeLineId === "income.ultrasound")?.actorKind ?? null, { timeout: 20_000 }).toBe("visitor");
  await expect.poll(async () => (await getActiveState(page) as any).serviceIncomeReceipts?.find((receipt: any) => receipt.incomeLineId === "income.ultrasound") ?? null, { timeout: 45_000 }).toMatchObject({ actorKind: "visitor", grossAmount: 120, netCashDelta: 120 });
  const visitorEvidence = await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene.getScene("facility-scene");
    const popup = [...(scene?.earningsPopupTexts?.values?.() ?? [])].find((text: any) => text.visible && text.text === "+$120");
    const visitor = [...(scene?.characterBitmapContainers?.keys?.() ?? [])].find((key: string) => key.startsWith("character:service-visitor:"));
    return popup && visitor ? { popupBottom: popup.getBounds().bottom, visitor, headY: scene.getEarningsPopupPosition("visitor", visitor.replace("character:service-visitor:", ""))?.y } : null;
  }, undefined, { timeout: 45_000 });
  const evidence = await visitorEvidence.jsonValue() as { popupBottom: number; headY: number; visitor: string };
  expect(evidence.popupBottom).toBeLessThan(evidence.headY);
  await page.screenshot({ path: "artifacts/screenshots/gs-021-m4a-service-visitor.png" });
  await expect.poll(async () => (await getActiveState(page) as any).serviceOperations?.find((operation: any) => operation.incomeLineId === "income.ultrasound")?.status ?? null, { timeout: 60_000 }).toBe("completed");
  await expect.poll(async () => {
    const finalState = await getActiveState(page) as any;
    return { encounterIds: Object.keys(finalState.encounters), clinicalXp: finalState.clinicalXp };
  }).toEqual({ encounterIds: encounterIdsBeforeService, clinicalXp: xpBeforeService });
});
