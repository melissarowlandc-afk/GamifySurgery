import { expect, test } from "@playwright/test";

import { getActiveState, getProfile, setFastFacilitySpeed, startClinic } from "./helpers";

test("an active outside coffee purchase credits once, follows its own sprite, and departs", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Facility canvas acceptance uses desktop Chromium.");
  testInfo.setTimeout(90_000);
  await startClinic(page, "Retail Founder", "Retail Income Clinic");
  const profile = await getProfile(page);
  profile.tutorialsEnabled = false;
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(campaign.serializedState) as any;
  state.facilityLevel = 2;
  state.cash = 500;
  state.cashCents = 50_000;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  for (let y = 20; y <= 31; y += 1) {
    state.rooms.push({ id: `room.retail.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  }
  state.rooms.push({ id: "room.retail.coffee", roomDefinitionId: "room.coffee_kiosk", x: 33, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.doors.push(
    { id: "door.retail.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.retail.coffee", roomId: "room.retail.coffee", side: "west", offset: 1, exterior: false },
  );
  const shopperId = "retail-visitor.browser.1";
  const operationId = "retail-operation.browser.1";
  state.retailExternalActors = [{
    id: shopperId, kind: "retail_visitor", displayName: "Maya Shopper", appearance: state.founder.appearance,
    linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "onsite", location: { x: 30, y: 30 },
    path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: operationId,
  }];
  state.retailOperations = [{
    id: operationId, incomeLineId: "income.coffee", catalogVersion: 1, actorKind: "retail_visitor", actorId: shopperId,
    displayName: "Maya Shopper", appearance: state.founder.appearance, linkedServiceOperationId: null, authorizedOrderId: null,
    status: "purchasing", createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + 10,
    startedAtFacilityTick: state.facilityTick, completedAtFacilityTick: null, quoteGross: 5, quoteStockCost: 1,
    outletRoomInstanceId: "room.retail.coffee", outletDurationMinutes: 2, staffRoleDefinitionId: null, servingEmployeeId: null,
    location: { x: 30, y: 30 }, returnLocation: null, path: [{ x: 30, y: 30 }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, purchaseEndsAtFacilityTick: state.facilityTick + 1, cancellationReason: null,
  }];
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ nextProfile }) => {
    if (!sessionStorage.getItem("retail-income-fixture-installed")) {
      window.localStorage.setItem("gamify-surgery.prototype.profile.v1", JSON.stringify(nextProfile));
      sessionStorage.setItem("retail-income-fixture-installed", "1");
    }
  }, { nextProfile: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Retail Income Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame));
  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, panX: scene.cameraView.panX + scene.layout.tileSize * 8, panY: scene.cameraView.panY + scene.layout.tileSize * 3 });
  });
  await expect.poll(async () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return scene.characterBitmapContainers.has("character:retail-retail_visitor:retail-visitor.browser.1");
  })).toBe(true);
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => (await getActiveState(page) as any).serviceIncomeReceipts?.find((receipt: any) => receipt.transactionKey === "income.retail.retail-operation.browser.1.income.coffee") ?? null, { timeout: 35_000 }).toMatchObject({ grossAmount: 5, stockCost: 1, netCashDelta: 4, actorKind: "retail_visitor", actorId: shopperId });
  await page.waitForFunction(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return [...scene.earningsPopupTexts.values()].some((label: any) => label.visible && label.text === "+$5");
  }, undefined, { timeout: 15_000 });
  await expect.poll(async () => (await getActiveState(page) as any).retailExternalActors?.find((actor: any) => actor.id === shopperId)?.lifecycle ?? null, { timeout: 45_000 }).toBe("departed");
  await expect.poll(async () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return scene.characterBitmapContainers.has("character:retail-retail_visitor:retail-visitor.browser.1");
  }), { timeout: 10_000 }).toBe(false);
});

test("autonomous employee and waiting-patient coffee purchases settle once without creating clinical work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Facility canvas acceptance uses desktop Chromium.");
  testInfo.setTimeout(120_000);
  await startClinic(page, "Retail Pair Founder", "Retail Pair Clinic");
  const profile = await getProfile(page);
  profile.tutorialsEnabled = false;
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(campaign.serializedState) as any;
  state.facilityLevel = 2;
  state.cash = 500;
  state.cashCents = 50_000;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "room.retail.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.retail.coffee", roomDefinitionId: "room.coffee_kiosk", x: 33, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[24, 25, 26, 27, 28].map((y) => ({ id: `room.retail.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.retail.ultrasound.south", roomId: "room.retail.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.retail.ultrasound", roomId: "room.retail.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.retail.coffee", roomId: "room.retail.coffee", side: "west", offset: 1, exterior: false },
    { id: "door.retail.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({ id: "employee.shopper", staffRoleDefinitionId: "staff.imaging_technician", displayName: "Employee Shopper", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 20, morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.retail.ultrasound", location: { x: 34, y: 24 }, path: [{ x: 34, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
  // Sol's addWaitingPatient setup: retain this real encounter identity, make
  // it wait for an external result, and do not inject any retail trip/receipt.
  const waiting = Object.values(state.encounters)[0] as any;
  waiting.id = "encounter.waiting";
  state.encounters = { "encounter.waiting": waiting };
  waiting.lifecycle = "active_pending_result";
  waiting.pendingResult = { operationId: "pending.encounter.waiting", gateId: "gate", originatingNodeIndex: 0, resultTypeId: "service.basic_labs", pendingLabel: "Waiting", resultNarrative: "Ready", routeId: "route.basic_labs.external", routeDisplayName: "External", scheduledAtTick: 0, serviceDurationTicks: 500, durationTicks: 500, dueTick: state.facilityTick + 500, deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true, timingPhases: [{ id: "external", durationTicks: 500, resourceBound: false, startsAtTick: 0, endsAtTick: 500 }] };
  waiting.steps[0].status = "result_pending";
  waiting.patientLocation = { x: 34, y: 24 };
  waiting.patientMovement = null;
  waiting.assignedRoomInstanceId = "room.retail.ultrasound";
  state.retailOperations = [];
  state.serviceIncomeReceipts = [];
  campaign.serializedState = JSON.stringify(state);
  await page.addInitScript(({ nextProfile }) => {
    if (!sessionStorage.getItem("retail-pair-fixture-installed")) {
      window.localStorage.setItem("gamify-surgery.prototype.profile.v1", JSON.stringify(nextProfile));
      sessionStorage.setItem("retail-pair-fixture-installed", "1");
    }
  }, { nextProfile: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: "Resume Retail Pair Clinic" });
  if (await resume.isVisible()) await resume.click();
  const before = await getActiveState(page) as any;
  const encounterIds = Object.keys(before.encounters);
  const xp = before.clinicalXp;
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  const retailEconomics: Record<string, readonly [number, number, number]> = {
    "income.coffee": [5, 1, 4], "income.kiosk_drink": [3, 1, 2], "income.kiosk_snack": [4, 2, 2],
  };
  await expect.poll(async () => (await getActiveState(page) as any).serviceIncomeReceipts?.filter((receipt: any) => ["employee.shopper", "encounter.waiting"].includes(receipt.actorId)), { timeout: 90_000 }).toHaveLength(2);
  const settled = await getActiveState(page) as any;
  for (const receipt of settled.serviceIncomeReceipts.filter((candidate: any) => ["employee.shopper", "encounter.waiting"].includes(candidate.actorId))) {
    const expected = retailEconomics[receipt.incomeLineId];
    expect(expected, `eligible product ${receipt.incomeLineId}`).toBeDefined();
    expect([receipt.grossAmount, receipt.stockCost, receipt.netCashDelta]).toEqual(expected);
  }
  expect(Object.keys(settled.encounters)).toEqual(encounterIds);
  expect(settled.clinicalXp).toBe(xp);
  const receiptKeys = settled.serviceIncomeReceipts.map((receipt: any) => receipt.transactionKey);
  const cash = settled.cash;
  await page.reload();
  const resumeAfterReload = page.getByRole("button", { name: "Resume Retail Pair Clinic" });
  if (await resumeAfterReload.isVisible()) await resumeAfterReload.click();
  await expect.poll(async () => (await getActiveState(page) as any).cash).toBe(cash);
  expect((await getActiveState(page) as any).serviceIncomeReceipts.map((receipt: any) => receipt.transactionKey)).toEqual(receiptKeys);
});
