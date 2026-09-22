import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentQuestion,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  startClinic,
} from "./helpers";

const SHOTS = "artifacts/screenshots";

async function installState(page: Page, state: GameState): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find(
    (candidate) => candidate.campaignId === profile.activeCampaignId,
  );
  if (!campaign) throw new Error("Active campaign is missing.");
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_KEY, value: profile },
  );
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: new RegExp(`^Resume ${campaign.name}$`) });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function facilityLayout(page: Page) {
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      (HTMLDivElement & { __facilityGame?: unknown }) | null;
    return Boolean(host?.__facilityGame);
  });
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      HTMLDivElement & { __facilityGame: { scene: { getScene: (key: string) => {
        layout: { originX: number; originY: number; tileSize: number };
      } } } };
    return host.__facilityGame.scene.getScene("facility-scene").layout;
  });
}

function prepareLevelOne(state: GameState): GameState {
  state.facilityLevel = 1;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.clinicalXp = 150;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    ...state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk"),
    { id: "room.gs020.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.gs020.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.gs020.minor", roomDefinitionId: "room.minor_procedure", x: 29, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.gs020.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "door.gs020.front", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "door.gs020.front-hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.gs020.exam", roomId: "room.gs020.exam", side: "south", offset: 1, exterior: false },
    { id: "door.gs020.ultrasound.patient", roomId: "room.gs020.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.gs020.ultrasound.staff", roomId: "room.gs020.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.gs020.minor", roomId: "room.gs020.minor", side: "east", offset: 1, exterior: false },
  ];
  state.employees = [{
    id: "employee.gs020.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Avery Chen", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 90,
    trainingLevel: 1, homeRoomInstanceId: "room.gs020.ultrasound",
    location: { x: 32, y: 24 }, path: [{ x: 32, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 999, facilityTask: null,
  }];
  const completed = Object.values(state.encounters)[0];
  if (completed) {
    completed.resolutionReason = "completed";
    completed.resolvedAtFacilityTick = 0;
    completed.patientSatisfaction = 100;
    completed.finalPatientSatisfaction = 100;
  }
  return state;
}

test("Level 1 presents ultrasound construction and ordinary doors without control-room or X-ray requirements", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop browser acceptance only.");
  await startClinic(page, "GS020 Builder", "GS020 Build Clinic");
  const state = (await getActiveState(page)) as unknown as GameState;
  expect(state.rooms.map((room) => room.roomDefinitionId)).toEqual(["room.front_desk"]);
  state.facilityLevel = 1;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  await installState(page, state);
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resumeCampaign = page.getByRole("button", { name: "Resume GS020 Build Clinic" });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  await expect(page.locator(".goal-list")).toContainText("Build Ultrasound Room");
  await expect(page.locator(".goal-list")).not.toContainText("X-ray");
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  const ultrasound = page.getByRole("button", { name: /Ultrasound Room/ });
  await expect(ultrasound).toBeVisible();
  await expect(page.getByRole("button", { name: /X-ray Room/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Imaging Control Room/ })).toHaveCount(0);
  await ultrasound.click();

  const canvas = page.locator(".facility-host canvas");
  let layout = await facilityLayout(page);
  await canvas.click({ position: {
    x: layout.originX + 34.5 * layout.tileSize,
    y: layout.originY + 25.5 * layout.tileSize,
  } });
  const placedId = await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    return current.rooms.find((room) => room.roomDefinitionId === "room.ultrasound")?.id ?? null;
  }).not.toBeNull().then(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    return current.rooms.find((room) => room.roomDefinitionId === "room.ultrasound")!.id;
  });
  const placeDoor = page.getByRole("button", { name: "Place Door" });
  await placeDoor.click();
  layout = await facilityLayout(page);
  for (const [tileX, tileY] of [
    [34.5, 28], [35.5, 28], [36.5, 28],
    [34, 25.5], [34, 26.5], [34, 27.5],
    [37, 25.5], [37, 26.5], [37, 27.5],
    [34.5, 25], [35.5, 25], [36.5, 25],
  ]) {
    await canvas.click({ position: {
      x: layout.originX + tileX * layout.tileSize,
      y: layout.originY + tileY * layout.tileSize,
    } });
  }
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    return current.doors.filter((door) => door.roomId === placedId).length;
  }).toBe(1);
  await page.getByRole("button", { name: "Done / Save" }).click();
  await expect(page.getByRole("button", { name: "Enter Build Mode" })).toBeVisible();

  const prepared = prepareLevelOne((await getActiveState(page)) as unknown as GameState);
  await installState(page, prepared);
  const preparedState = (await getActiveState(page)) as unknown as GameState;
  expect(preparedState.doors.filter((door) => door.roomId === "room.gs020.ultrasound"))
    .toHaveLength(2);
  await expect(page.locator(".goal-list")).toContainText("Build Ultrasound Room1/1");
  await page.screenshot({ path: `${SHOTS}/gs-020-ultrasound-build-goals.png`, animations: "disabled" });
  await expect(page.getByRole("button", { name: "Advance to Level 2" })).toBeVisible();
  await page.getByRole("button", { name: "Advance to Level 2" }).click();
  await expect(page.getByText("Level 2 goals")).toBeVisible();
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.getByRole("button", { name: /X-ray Room/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Imaging Control Room/ })).toHaveCount(0);
});

test("onsite authored ultrasound stays pending through reload and reveals its result only when due", async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop timed acceptance only.");
  await startClinic(page, "GS020 Service", "GS020 Service Clinic");
  let state = prepareLevelOne((await getActiveState(page)) as unknown as GameState);
  const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (candidate) => candidate.decisionNodes[0]?.resultGateAfter?.resultTypeId === "service.ultrasound",
  )!;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: "gs020.admit", encounterId: "encounter.gs020.ultrasound",
    caseId: clinicalCase.id, patientDisplayName: "Ultrasound Review Patient", arrivalClass: "routine",
  });
  const encounter = state.encounters["encounter.gs020.ultrasound"]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 35, y: 27 };
  encounter.assignedRoomInstanceId = "room.gs020.exam";
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.steps[0]!.status = "action_required";
  state.openChartEncounterId = null;
  await installState(page, state);

  await page.getByText("Ultrasound Review Patient", { exact: true }).click();
  const question = getCurrentQuestion(state, encounter.id)!;
  const correct = question.node.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", { name: new RegExp(correct.label) }).click();
  await expect(page.getByText(question.node.resultGateAfter!.resultNarrative, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
  await page.getByText("Ultrasound Review Patient", { exact: true }).click();
  await expect(page.locator(".chart-pending-card")).toContainText("Onsite ultrasound");
  await page.screenshot({ path: `${SHOTS}/gs-020-onsite-ultrasound-pending.png`, animations: "disabled" });
  const pending = ((await getActiveState(page)) as unknown as GameState).encounters[encounter.id]!.pendingResult!;
  expect(pending.imagingTechnicianId).toBe("employee.gs020.imaging");
  await page.getByRole("button", { name: "Return to clinic" }).click();
  const latestProfile = await getProfile(page);
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_KEY, value: latestProfile },
  );
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume GS020 Service Clinic" });
  if (await resume.isVisible()) await resume.click();
  const restored = ((await getActiveState(page)) as unknown as GameState).encounters[encounter.id]!.pendingResult!;
  expect(restored.operationId).toBe(pending.operationId);
  expect(restored.dueTick).toBe(pending.dueTick);
  expect(restored.imagingTechnicianId).toBe(pending.imagingTechnicianId);
  await expect(page.getByText(question.node.resultGateAfter!.resultNarrative, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Set facility speed to 4x" }).click();
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    return current.encounters[encounter.id]!.pendingResult?.deliveredAtTick;
  }, { timeout: 35_000 }).not.toBeNull();
  await page.getByRole("button", { name: "Pause facility time" }).click();
  await page.getByText("Ultrasound Review Patient", { exact: true }).click();
  await expect(page.getByText(question.node.resultGateAfter!.resultNarrative, { exact: true })).toBeVisible();
});
