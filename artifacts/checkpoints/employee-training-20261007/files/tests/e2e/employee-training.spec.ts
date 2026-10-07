import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  deserializeGameState, gameReducer, getEmployeeTrainingQuote,
  getFacilityAccessValidation, getRoomDefinition, getRoomNavigationAnchor, serializeGameState,
  type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { getActiveState, getProfile, PROFILE_KEY, setFastFacilitySpeed, startClinic } from "./helpers";

const EVIDENCE = ".local-dev/gs037-employee-training/browser";
const EMPLOYEES = ["employee.e2e.training.reception", "employee.e2e.training.evs", "employee.e2e.training.draw"];
const EMPLOYEE_NAMES = ["Avery", "Morgan", "Taylor"];
let fixtureSequence = 0;

function apply(state: GameState, command: GameCommand): GameState {
  const next = gameReducer(state, command);
  const receipt = next.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") throw new Error(`${command.operationId}: ${receipt?.message ?? "missing receipt"}`);
  return next;
}

function trainingFixture(state: GameState): GameState {
  const front = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
  const entrance = state.doors.find((door) => door.roomId === front.id && door.exterior)!;
  const room = (id: string, roomDefinitionId: string, x: number, y: number) => ({
    id, roomDefinitionId, x, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
  });
  state.facilityLevel = 2;
  state.cash = 10_000; state.cashCents = 1_000_000;
  state.paused = true; state.simulationSpeed = 4;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.rooms = [front,
    room("room.e2e.training", "room.training", 29, 24),
    room("room.e2e.training.evs", "room.evs_closet", 30, 21),
    room("room.e2e.training.draw", "room.phlebotomy", 33, 24),
    ...Array.from({ length: 10 }, (_, i) => room(`room.e2e.training.hall.${i}`, "room.hallway", 32, 21 + i)),
  ];
  state.doors = [entrance,
    { id: "door.e2e.training.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "door.e2e.training", roomId: "room.e2e.training", side: "east", offset: 2, exterior: false },
    { id: "door.e2e.training.evs", roomId: "room.e2e.training.evs", side: "east", offset: 0, exterior: false },
    { id: "door.e2e.training.draw", roomId: "room.e2e.training.draw", side: "west", offset: 1, exterior: false },
  ];
  state.encounters = {}; state.employees = []; state.departingEmployees = [];
  state.employeeDiscussions = {};
  state.serviceOperations = []; state.retailOperations = []; state.retailExternalActors = [];
  state.environment.ambientPedestrians = []; state.environment.litterItems = [];
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.waterCoolerFillPercent = 100;
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, issues: [] });
  for (const [index, role] of ["staff.receptionist", "staff.evs_worker", "staff.phlebotomist"].entries()) {
    state = apply(state, { type: "HIRE_STAFF", operationId: `training.fixture.hire.${index}`,
      employeeId: EMPLOYEES[index]!, staffRoleDefinitionId: role, displayName: EMPLOYEE_NAMES[index]! });
    const employee = state.employees.find((candidate) => candidate.id === EMPLOYEES[index])!;
    const home = state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId)!;
    employee.location = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  return state;
}

async function persistAndOpen(page: Page, state: GameState): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  campaign.serializedState = serializeGameState(state); profile.tutorialsEnabled = false;
  const oneShotKey = `employee-training-fixture-${fixtureSequence++}`;
  await page.addInitScript(({ key, profileKey, value }) => {
    if (sessionStorage.getItem(key)) return;
    localStorage.setItem(profileKey, JSON.stringify(value)); sessionStorage.setItem(key, "1");
  }, { key: oneShotKey, profileKey: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${campaign.name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

test("two employees train on separate stools while the paid third request survives reload and completes once", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Training furniture acceptance uses desktop Chrome.");
  testInfo.setTimeout(120_000);
  mkdirSync(EVIDENCE, { recursive: true });
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await page.setViewportSize({ width: 1920, height: 1200 });
  await startClinic(page, "Training Founder", "Employee Training Test");
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  let state = trainingFixture(deserializeGameState(campaign.serializedState));
  const beforePayment = state.cash;
  const totalCost = EMPLOYEES.reduce((sum, id) => sum + getEmployeeTrainingQuote(state, id).cost!, 0);
  for (const id of EMPLOYEES) state = apply(state, { type: "TRAIN_EMPLOYEE", employeeId: id, operationId: `training.fixture.pay.${id}` });
  const paidCash = beforePayment - totalCost;
  expect(state.cash).toBe(paidCash);
  for (let minute = 0; minute < 30; minute++) {
    state.paused = false;
    state = apply(state, { type: "ADVANCE_TICK", operationId: `training.fixture.tick.${minute}` });
    if (state.employees.filter((employee) => employee.training?.stage === "training").length === 2) break;
  }
  expect(state.employees.filter((employee) => employee.training?.stage === "training")).toHaveLength(2);
  expect(state.employees.find((employee) => employee.id === EMPLOYEES[2])?.training?.stage).toBe("queued");
  state.paused = true;
  await persistAndOpen(page, state);
  await expect.poll(() => page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const snapshot = host?.__facilityGaitSnapshot?.() ?? {};
    return Object.entries(snapshot).filter(([, actor]: [string, any]) => actor.supportRole === "training-employee")
      .map(([key, actor]: [string, any]) => ({ key, pose: actor.pose, direction: actor.direction,
        supportId: actor.supportId, visible: actor.visible }));
  })).toEqual([
    { key: `character:staff:${EMPLOYEES[0]}`, pose: "seated", direction: "back", supportId: "stool1", visible: true },
    { key: `character:staff:${EMPLOYEES[1]}`, pose: "seated", direction: "back", supportId: "stool2", visible: true },
  ]);
  await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    scene.bridge.onCameraChange?.({ ...scene.bridge.viewModel.camera, panY: 200 });
  });
  await expect.poll(() => page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    return host.__facilityGame.scene.getScene("facility-scene").bridge.viewModel.camera.panY;
  })).toBe(200);
  await page.screenshot({ path: join(EVIDENCE, "two-active-training-stools.png"), animations: "disabled" });
  const savedBefore = await getActiveState(page) as unknown as GameState;
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume Employee Training Test" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const savedAfter = await getActiveState(page) as unknown as GameState;
  expect(savedAfter.cash).toBe(paidCash);
  expect(savedAfter.employees.map((employee) => employee.training)).toEqual(savedBefore.employees.map((employee) => employee.training));
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => {
    const current = await getActiveState(page) as unknown as GameState;
    return current.employees.filter((employee) => EMPLOYEES.includes(employee.id))
      .map((employee) => ({ level: employee.trainingLevel, training: employee.training ?? null }));
  }, { timeout: 80_000 }).toEqual(EMPLOYEES.map(() => ({ level: 2, training: null })));
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const completed = await getActiveState(page) as unknown as GameState;
  expect(completed.cash).toBe(paidCash);
  expect(failures).toEqual([]);
  writeFileSync(join(EVIDENCE, "training-browser-summary.json"), JSON.stringify({
    origin: new URL(page.url()).origin, beforePayment, totalCost, paidCash,
    facilityTick: completed.facilityTick, employees: completed.employees.map(({ id, trainingLevel, training }) => ({ id, trainingLevel, training })), failures,
  }, null, 2));
});

test("Management consumes the brief explanations and approves individual paid requests", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Management integration acceptance uses desktop Chrome.");
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await startClinic(page, "Management Training Founder", "Management Training Test");
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId)!;
  const state = trainingFixture(deserializeGameState(campaign.serializedState));
  await persistAndOpen(page, state);
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  for (const [role, index, description, cost] of [
    ["staff.receptionist", 0, "Reduces wait penalties 10%", "$75"],
    ["staff.evs_worker", 1, "Improves cleaning 10%", "$75"],
    ["staff.phlebotomist", 2, "Reduces draw time 10%", "$100"],
  ] as const) {
    const group = page.locator(`[data-staff-role-id='${role}']`);
    const toggle = group.locator(".staff-role-toggle");
    if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
    await group.getByRole("button", { name: "Train", exact: true }).click();
    const popover = group.getByRole("dialog", { name: `Train ${EMPLOYEE_NAMES[index]}` });
    await expect(popover.getByText(`Lv 2 for ${cost}: ${description}.`, { exact: true })).toBeVisible();
    await popover.getByRole("button", { name: `Train ${cost}`, exact: true }).click();
    await expect(group.getByText("Queued · working", { exact: true })).toBeVisible();
  }
  const queued = await getActiveState(page) as unknown as GameState;
  expect(queued.cash).toBe(state.cash - 250);
  expect(queued.employees.map((employee) => employee.training?.stage)).toEqual(["queued", "queued", "queued"]);
  expect(queued.facilityTick).toBe(state.facilityTick);
  expect(failures).toEqual([]);
});
