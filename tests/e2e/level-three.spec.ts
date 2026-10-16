import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import {
  deserializeGameState,
  evaluateFacilityExperienceConditions,
  gameReducer,
  getFacilityAccessValidation,
  getRoomDefinition,
  getRoomNavigationAnchor,
  PROTOTYPE_DOMAIN_CONTEXT,
  recordLevelThreeRoomUse,
  serializeGameState,
  type GameCommand,
  type GameState,
} from "@gamify-surgery/game-domain";

import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  setFastFacilitySpeed,
  startClinic,
} from "./helpers";

const EVIDENCE_ROOT = "artifacts/level3-implementation-20261004/e2e";
let persistFixtureSequence = 0;

const LEVEL_THREE_ROOMS = [
  { id: "room.e2e.ambulatory-or", definitionId: "room.ambulatory_or", label: "Ambulatory OR", x: 5, y: 11, doorSide: "north" as const },
  { id: "room.e2e.laboratory", definitionId: "room.laboratory", label: "In-house Laboratory", x: 10, y: 11, doorSide: "north" as const },
  { id: "room.e2e.pharmacy", definitionId: "room.pharmacy", label: "Pharmacy", x: 14, y: 11, doorSide: "north" as const },
  { id: "room.e2e.workshop", definitionId: "room.maintenance_workshop", label: "Maintenance Workshop", x: 18, y: 11, doorSide: "north" as const },
  { id: "room.e2e.break", definitionId: "room.staff_break", label: "Staff Break Room", x: 22, y: 11, doorSide: "north" as const },
  { id: "room.e2e.office", definitionId: "room.surgeon_office", label: "Surgeon's Office", x: 27, y: 11, doorSide: "north" as const },
  { id: "room.e2e.vending", definitionId: "room.vending", label: "Vending Machine", x: 30, y: 11, doorSide: "east" as const },
] as const;

const LEVEL_THREE_STAFF = [
  { id: "employee.e2e.surgeon", definitionId: "staff.surgeon", label: "Surgeon" },
  { id: "employee.e2e.or-nurse", definitionId: "staff.or_nurse", label: "OR Nurse" },
  { id: "employee.e2e.lab", definitionId: "staff.laboratory_technician", label: "Laboratory Technician" },
  { id: "employee.e2e.pharmacist", definitionId: "staff.pharmacist", label: "Pharmacist" },
  { id: "employee.e2e.repair", definitionId: "staff.repair_person", label: "Repair Person" },
] as const;

test.beforeAll(() => mkdirSync(EVIDENCE_ROOT, { recursive: true }));

function command<T extends Omit<GameCommand, "operationId">>(
  operationId: string,
  input: T,
): GameCommand {
  return { operationId, ...input } as GameCommand;
}

function apply(state: GameState, next: GameCommand): GameState {
  const updated = gameReducer(state, next);
  const receipt = updated.operationReceipts[next.operationId];
  if (receipt?.status !== "applied") {
    throw new Error(`${next.operationId}: ${receipt?.message ?? "missing operation receipt"}`);
  }
  return updated;
}

function applyFirstDoor(state: GameState, roomId: string, side: "north" | "east" | "west", offsets: readonly number[], suffix: string): GameState {
  for (const offset of offsets) {
    const operationId = `e2e.fixture-door.${roomId}.${suffix}.${offset}`;
    const updated = gameReducer(state, command(operationId, {
      type: "PLACE_DOOR", doorId: `door.${roomId}.${suffix}`, roomId, side, offset,
    }));
    if (updated.operationReceipts[operationId]?.status === "applied") return updated;
  }
  throw new Error(`No valid ${side} door slot for ${roomId}.`);
}

async function persistState(page: Page, state: GameState): Promise<void> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId);
  if (!active) throw new Error("Active campaign record is missing.");
  active.serializedState = serializeGameState(state);
  profile.tutorialsEnabled = false;
  await page.evaluate(({ profileKey, nextProfile }) => {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { profileKey: PROFILE_KEY, nextProfile: profile });
  const fixtureKey = `level-three-persist-${persistFixtureSequence++}`;
  await page.addInitScript(({ profileKey, nextProfile, oneShotKey }) => {
    if (window.sessionStorage.getItem(oneShotKey)) return;
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    window.sessionStorage.setItem(oneShotKey, "1");
  }, { profileKey: PROFILE_KEY, nextProfile: profile, oneShotKey: fixtureKey });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: new RegExp(`^Resume ${active.name}$`) });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function qualifyAndAdvanceToLevelThree(page: Page): Promise<GameState> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId);
  if (!active) throw new Error("Active campaign record is missing.");
  let state = deserializeGameState(active.serializedState) as any;
  state.facilityLevel = 2;
  state.clinicalXp = 300;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.environment.litterItems = [];
  state.environment.waterCoolerFillPercent = 100;
  const front = state.rooms.find((candidate: any) => candidate.roomDefinitionId === "room.front_desk");
  if (!front) throw new Error("Fresh campaign is missing its protected front desk.");
  const room = (id: string, roomDefinitionId: string, x: number, y: number) => ({
    id, roomDefinitionId, x, y, orientation: 0 as const, doorSide: null,
    upgradeLevel: 1 as const, cleanliness: 100,
  });
  state.rooms = [
    front,
    room("room.e2e.exam", "room.examination", 33, 25),
    room("room.e2e.waiting", "room.waiting", 28, 14),
    room("room.e2e.bathroom", "room.bathroom", 30, 17),
    room("room.e2e.control-xray", "room.imaging_control", 27, 19),
    room("room.e2e.xray", "room.xray", 29, 19),
    room("room.e2e.periop", "room.periop_recovery", 26, 24),
    ...Array.from({ length: 17 }, (_, index) => room(`room.e2e.hall.${14 + index}`, "room.hallway", 32, 14 + index)),
  ];
  state.doors = [
    ...state.doors.filter((door: any) => door.id === "door.instance.front_entrance"),
    { id: "door.e2e.front.hall", roomId: front.id, side: "west", offset: 0, exterior: false },
  ];
  state = applyFirstDoor(state, "room.e2e.exam", "west", [1, 0], "hall");
  state = applyFirstDoor(state, "room.e2e.waiting", "east", [1, 2, 0], "hall");
  state = applyFirstDoor(state, "room.e2e.bathroom", "east", [1, 0], "hall");
  state = applyFirstDoor(state, "room.e2e.xray", "east", [1, 2, 0], "hall");
  state = applyFirstDoor(state, "room.e2e.xray", "west", [1, 2, 0], "control");
  state = applyFirstDoor(state, "room.e2e.periop", "east", [1, 2, 0, 3], "hall");
  state.employees = [];
  state = apply(state, command("e2e.fixture.hire.imaging", {
    type: "HIRE_STAFF", employeeId: "employee.e2e.fixture-imaging",
    staffRoleDefinitionId: "staff.imaging_technician", displayName: "Imaging Technician",
  }));
  state = apply(state, command("e2e.fixture.hire.periop", {
    type: "HIRE_STAFF", employeeId: "employee.e2e.fixture-periop",
    staffRoleDefinitionId: "staff.periop_nurse", displayName: "Peri-op Nurse",
  }));
  const completed = Object.values(state.encounters)[0] as any;
  if (!completed) throw new Error("Level 2 fixture did not include an encounter for the progression gate.");
  completed.lifecycle = "ended";
  completed.resolutionReason = "completed";
  completed.finalPatientSatisfaction = 100;
  completed.resolvedAtFacilityTick = state.facilityTick;
  state.serviceIncomeReceipts = [
    ...(state.serviceIncomeReceipts ?? []),
    {
      id: "receipt.e2e.endoscopy",
      operationId: "service.e2e.endoscopy",
      transactionKey: "income.service.e2e.endoscopy.income.endoscopy",
      incomeLineId: "income.endoscopy",
      catalogVersion: 1,
      routeId: "route.upper_endoscopy_duodenal_biopsy.in_house",
      actorKind: "patient",
      actorId: completed.id,
      grossAmount: 450,
      stockCost: 0,
      netCashDelta: 450,
      completedAtFacilityTick: state.facilityTick,
    },
  ];
  active.serializedState = serializeGameState(state);
  const normalizedQualificationState = deserializeGameState(active.serializedState);
  expect(getFacilityAccessValidation(normalizedQualificationState)).toMatchObject({ valid: true, issues: [] });
  expect(evaluateFacilityExperienceConditions(normalizedQualificationState).conditions).toEqual([]);
  await page.evaluate(({ profileKey, nextProfile }) => {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { profileKey: PROFILE_KEY, nextProfile: profile });
  await page.addInitScript(({ profileKey, nextProfile }) => {
    const qualificationFixtureKey = "level-three-qualification-installed";
    if (window.sessionStorage.getItem(qualificationFixtureKey)) return;
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    window.sessionStorage.setItem(qualificationFixtureKey, "1");
  }, { profileKey: PROFILE_KEY, nextProfile: profile });
  await page.reload();
  const resume = page.getByRole("button", { name: new RegExp(`^Resume ${active.name}$`) });
  if (await resume.isVisible()) await resume.click();
  const advance = page.getByRole("button", { name: "Advance to Level 3" });
  await expect(advance).toBeVisible();
  await advance.click();
  await expect(page.getByText("Level 3 goals")).toBeVisible();
  const advanced = deserializeGameState(JSON.stringify(await getActiveState(page)));
  expect(advanced).toMatchObject({ facilityLevel: 3, clinicalXp: 0, cash: 19_250 });
  return advanced;
}

function addCompleteLevelThreeLayout(initial: GameState): GameState {
  let state = initial;
  for (let x = 5; x <= 50; x += 1) {
    state = apply(state, command(`e2e.place.level-three-hall.${x}`, {
      type: "PLACE_ROOM", roomId: `room.e2e.level-three-hall.${x}`,
      roomDefinitionId: "room.hallway", x, y: 10, orientation: 0,
    }));
  }
  for (let y = 11; y <= 13; y += 1) {
    state = apply(state, command(`e2e.place.level-three-link.${y}`, {
      type: "PLACE_ROOM", roomId: `room.e2e.level-three-link.${y}`,
      roomDefinitionId: "room.hallway", x: 32, y, orientation: 0,
    }));
  }
  for (const room of LEVEL_THREE_ROOMS) {
    state = apply(state, command(`e2e.place.${room.id}`, {
      type: "PLACE_ROOM",
      roomId: room.id,
      roomDefinitionId: room.definitionId,
      x: room.x,
      y: room.y,
      orientation: 0,
    }));
    state = applyFirstDoor(state, room.id, room.doorSide, [1, 2, 0, 3], "hall");
  }
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, issues: [], unreachableRoomIds: [] });
  for (const employee of LEVEL_THREE_STAFF) {
    state = apply(state, command(`e2e.hire.${employee.id}`, {
      type: "HIRE_STAFF",
      employeeId: employee.id,
      staffRoleDefinitionId: employee.definitionId,
      displayName: employee.label,
    }));
  }
  return state;
}

function stationLevelThreeStaff(initial: GameState): GameState {
  const state = initial;
  const assignments = [
    ["employee.e2e.fixture-imaging", "room.e2e.control-xray"],
    ["employee.e2e.fixture-periop", "room.e2e.periop"],
    ["employee.e2e.surgeon", "room.e2e.office"],
    ["employee.e2e.or-nurse", "room.e2e.ambulatory-or"],
    ["employee.e2e.lab", "room.e2e.laboratory"],
    ["employee.e2e.pharmacist", "room.e2e.pharmacy"],
    ["employee.e2e.repair", "room.e2e.workshop"],
  ] as const;
  for (const [employeeId, roomId] of assignments) {
    const employee = state.employees.find((candidate) => candidate.id === employeeId);
    const room = state.rooms.find((candidate) => candidate.id === roomId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId) : null;
    if (!employee || !room || !definition) throw new Error(`Missing Level 3 station fixture for ${employeeId}.`);
    const anchor = getRoomNavigationAnchor(room, definition, "staff");
    employee.homeRoomInstanceId = room.id;
    employee.location = anchor;
    employee.path = [anchor];
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.lastBreakAtFacilityTick = state.facilityTick;
    employee.morale = 100;
    employee.facilityTask = null;
    employee.nextIdleActionAtFacilityTick = state.facilityTick + 1;
  }
  return state;
}

function advanceUntil(
  initial: GameState,
  predicate: (state: GameState) => boolean,
  label: string,
  maximumMinutes = 900,
): GameState {
  let state = initial;
  for (let minute = 0; minute < maximumMinutes; minute += 1) {
    state.paused = false;
    state = apply(state, command(`e2e.tick.${label}.${minute}`, { type: "ADVANCE_TICK" }));
    if (predicate(state)) return state;
  }
  if (label === "ambulatory-or") {
    writeFileSync(join(EVIDENCE_ROOT, "or-timeout-state.json"), serializeGameState(state));
  }
  throw new Error(`Timed out advancing the Level 3 fixture to ${label}: ${JSON.stringify({
    facilityTick: state.facilityTick,
    paused: state.paused,
    operations: state.serviceOperations.map((operation) => ({
      id: operation.id, line: operation.incomeLineId, status: operation.status, phaseIndex: operation.phaseIndex,
    })),
    staff: state.employees.filter((employee) => employee.id.startsWith("employee.e2e.")).map((employee) => ({
      id: employee.id, home: employee.homeRoomInstanceId, location: employee.location,
      pathIndex: employee.pathIndex, pathLength: employee.path.length, task: employee.facilityTask?.kind ?? null,
    })),
  })}`);
}

function watchRuntimeFailures(page: Page): string[] {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    const sourceUrl = message.location().url;
    if (message.type() === "error" && !sourceUrl.endsWith("/favicon.ico")) {
      failures.push(`console: ${message.text()} (${sourceUrl || "unknown URL"})`);
    }
  });
  page.on("response", (response) => {
    if (response.url().includes("/art/") && response.status() >= 400) {
      failures.push(`asset ${response.status()}: ${response.url()}`);
    }
  });
  return failures;
}

async function focusApprovedRooms(page: Page, roomIds: readonly string[]): Promise<void> {
  await page.waitForFunction(() => Boolean(
    (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene"),
  ));
  await page.evaluate((targetRoomIds) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const rooms = targetRoomIds.map((roomId) => scene.bridge.viewModel.rooms.find((candidate: any) => candidate.instanceId === roomId));
    if (rooms.some((room) => !room)) throw new Error(`Missing approved room while focusing ${targetRoomIds.join(", ")}.`);
    const left = Math.min(...rooms.map((room: any) => room.tileX));
    const right = Math.max(...rooms.map((room: any) => room.tileX + room.width));
    const top = Math.min(...rooms.map((room: any) => room.tileY));
    const bottom = Math.max(...rooms.map((room: any) => room.tileY + room.height));
    const centerX = scene.layout.originX + ((left + right) / 2) * scene.layout.tileSize;
    const centerY = scene.layout.originY + ((top + bottom) / 2) * scene.layout.tileSize;
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - centerX,
      panY: scene.scale.height / 2 - centerY,
    });
    scene.refreshLayout(true);
  }, [...roomIds]);
  await expect.poll(() => page.evaluate((targetRoomIds) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    return targetRoomIds.every((roomId) => [...scene.fixtureBitmapImages.keys()].some((key: string) => key.startsWith(`approved:${roomId}:`)));
  }, [...roomIds])).toBe(true);
}

test("Level 2 advances through the UI and a reducer-built Level 3 reloads with all approved rooms and capped staff", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The integrated Level 3 fixture uses desktop Chromium.");
  testInfo.setTimeout(90_000);
  const failures = watchRuntimeFailures(page);
  await page.setViewportSize({ width: 2880, height: 1400 });
  await startClinic(page, "Level Three Founder", "Level Three Integrated Clinic");
  const advanced = await qualifyAndAdvanceToLevelThree(page);

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  for (const room of LEVEL_THREE_ROOMS) {
    await expect(page.locator(`[data-room-definition-id="${room.definitionId}"]`)).toBeVisible();
    await expect(page.getByText(room.label, { exact: true }).first()).toBeVisible();
  }
  await page.getByRole("button", { name: "Done / Save" }).click();
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  for (const employee of LEVEL_THREE_STAFF) {
    await expect(page.getByRole("heading", { name: employee.label, exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Done" }).click();

  const complete = stationLevelThreeStaff(addCompleteLevelThreeLayout(advanced));
  expect(getFacilityAccessValidation(complete)).toMatchObject({
    valid: true,
    issues: [],
    unreachableRoomIds: [],
  });
  expect(complete.rooms.filter((room) => LEVEL_THREE_ROOMS.some((expected) => expected.id === room.id))).toHaveLength(7);
  const hired = complete.employees.filter((employee) => LEVEL_THREE_STAFF.some((expected) => expected.id === employee.id));
  expect(hired).toHaveLength(5);
  expect(new Set(hired.map((employee) => employee.appearance.stillId)).size).toBe(5);
  for (const employee of hired) expect(employee.appearance.stillId).toMatch(/^level3-roster-v2\./);

  await persistState(page, complete);
  const restored = deserializeGameState(JSON.stringify(await getActiveState(page)));
  expect(restored.schemaVersion).toBe(9);
  expect(restored.rooms.filter((room) => LEVEL_THREE_ROOMS.some((expected) => expected.id === room.id)).map((room) => room.id)).toEqual(LEVEL_THREE_ROOMS.map((room) => room.id));
  expect(restored.employees.filter((employee) => LEVEL_THREE_STAFF.some((expected) => expected.id === employee.id)).map((employee) => employee.id)).toEqual(LEVEL_THREE_STAFF.map((employee) => employee.id));
  expect(getFacilityAccessValidation(restored).valid).toBe(true);
  await expect(page.getByText("Level 3 goals")).toBeVisible();
  await expect(page.getByText("Level 4 preview", { exact: true })).toBeVisible();
  await expect(page.getByText("Radiologist", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Pediatric", { exact: false })).toHaveCount(0);
  await focusApprovedRooms(page, LEVEL_THREE_ROOMS.map((room) => room.id));
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-all-seven-rooms-capped-staff-desktop.png"), animations: "disabled" });
  await page.getByTestId("facility-canvas").screenshot({ path: join(EVIDENCE_ROOT, "level-three-game-preview.png"), animations: "disabled" });
  expect(failures).toEqual([]);
});

test("laboratory work is queued from the real management control and pays only after unpaused completion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The timed Level 3 service flow uses desktop Chromium.");
  testInfo.setTimeout(120_000);
  const failures = watchRuntimeFailures(page);
  await startClinic(page, "Laboratory Founder", "Level Three Laboratory Clinic");
  const complete = stationLevelThreeStaff(addCompleteLevelThreeLayout(await qualifyAndAdvanceToLevelThree(page)));
  complete.serviceAppointmentsEnabled = false;
  complete.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  complete.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  await persistState(page, complete);
  const cashBefore = (await getActiveState(page) as any).cash;

  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await page.getByRole("tab", { name: "Services & income" }).click();
  const queue = page.getByRole("button", { name: "Queue laboratory work" });
  await expect(queue).toBeEnabled();
  await queue.click();
  const queued = await getActiveState(page) as any;
  expect(queued.cash).toBe(cashBefore);
  expect(queued.serviceOperations.some((operation: any) =>
    operation.incomeLineId === "income.laboratory_processing" && operation.status !== "completed" && operation.status !== "cancelled",
  )).toBe(true);
  await expect(page.getByText("Onsite laboratory processing", { exact: true }).last()).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => (await getActiveState(page) as any).serviceIncomeReceipts
    .find((receipt: any) => receipt.incomeLineId === "income.laboratory_processing") ?? null,
  { timeout: 50_000 }).toMatchObject({ grossAmount: 80, netCashDelta: 80 });
  const completed = await getActiveState(page) as any;
  expect(completed.cash).toBeGreaterThanOrEqual(cashBefore + 80);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await page.getByRole("tab", { name: "Services & income" }).click();
  await expect(page.getByRole("heading", { name: "Recent receipts" })).toBeVisible();
  const settledReceipt = page.getByText("$80.00 gross · $0.00 stock · $80.00 net", { exact: true });
  await expect(settledReceipt).toBeVisible();
  await settledReceipt.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-laboratory-settled-receipt.png"), animations: "disabled" });
  expect(failures).toEqual([]);
});

test("a scheduled ambulatory visitor occupies the covered OR table, recovers, and settles once", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The staged ambulatory presentation uses desktop Chromium.");
  testInfo.setTimeout(120_000);
  const failures = watchRuntimeFailures(page);
  await page.setViewportSize({ width: 1920, height: 1200 });
  await startClinic(page, "Ambulatory Founder", "Level Three Ambulatory Clinic");
  let state = stationLevelThreeStaff(addCompleteLevelThreeLayout(await qualifyAndAdvanceToLevelThree(page)));
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = true;
  state.nextServiceAppointmentTicks = { "income.ambulatory_operation": state.facilityTick };
  state = advanceUntil(state, (candidate) => candidate.serviceOperations.some((operation) =>
    operation.incomeLineId === "income.ambulatory_operation" && operation.actorKind === "visitor" &&
    operation.status === "in_service" && operation.phaseIndex === 1), "ambulatory-or");
  const operation = state.serviceOperations.find((candidate) =>
    candidate.incomeLineId === "income.ambulatory_operation" && candidate.actorKind === "visitor")!;
  expect(operation.frozenOperationPhases?.map((phase) => phase.durationMinutes)).toEqual([30, 120, 60]);
  state.paused = true;
  await persistState(page, state);
  await focusApprovedRooms(page, ["room.e2e.ambulatory-or"]);
  const occupied = await page.evaluate((operationId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    return {
      occupancy: scene.bridge.viewModel.endoscopyOccupancy,
      visitorRendered: scene.characterBitmapContainers.has(`character:service-visitor:${operationId}`),
    };
  }, operation.id);
  expect(occupied.occupancy).toMatchObject({
    roomInstanceIds: ["room.e2e.ambulatory-or"],
    serviceVisitorInstanceIds: [operation.id],
  });
  expect(occupied.visitorRendered).toBe(false);
  await expect.poll(() => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    return [...scene.fixtureBitmapImages.entries()].some(([key, image]: [string, any]) =>
      key.startsWith("approved:room.e2e.ambulatory-or:") && image.visible && image.getData("approved-draw-id") === "table");
  })).toBe(true);
  await page.addStyleTag({ content: ".facility-pause-indicator { display: none !important; }" });
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-ambulatory-or-covered-table.png"), animations: "disabled" });

  state = advanceUntil(state, (candidate) => candidate.serviceOperations.some((item) =>
    item.id === operation.id && item.status === "in_service" && item.phaseIndex === 2), "ambulatory-recovery", 300);
  state.paused = true;
  await persistState(page, state);
  const recoveryOccupancy = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    return host.__facilityGame.scene.getScene("facility-scene").bridge.viewModel.endoscopyOccupancy;
  });
  expect(recoveryOccupancy.roomInstanceIds).not.toContain("room.e2e.ambulatory-or");

  state = advanceUntil(state, (candidate) => candidate.serviceIncomeReceipts.some((receipt) =>
    receipt.incomeLineId === "income.ambulatory_operation" && receipt.actorId === operation.actorId), "ambulatory-settled", 300);
  state = advanceUntil(state, (candidate) =>
    candidate.levelThreeQiReviews.some((review) => review.receiptId === candidate.serviceIncomeReceipts.find((receipt) =>
      receipt.incomeLineId === "income.ambulatory_operation" && receipt.actorId === operation.actorId)?.id),
  "ambulatory-qi", 300);
  const receipts = state.serviceIncomeReceipts.filter((receipt) =>
    receipt.incomeLineId === "income.ambulatory_operation" && receipt.actorId === operation.actorId);
  expect(receipts).toHaveLength(1);
  expect(receipts[0]).toMatchObject({ grossAmount: 900, netCashDelta: 900 });
  state.paused = true;
  await persistState(page, state);
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await page.getByRole("tab", { name: "Services & income" }).click();
  const ambulatoryReceipt = page.getByText("$900.00 gross · $0.00 stock · $900.00 net", { exact: true });
  await expect(ambulatoryReceipt).toBeVisible();
  await expect(page.getByText(/Quality reviews: (?!0 queued · 0 in progress · 0 completed)/)).toBeVisible();
  await ambulatoryReceipt.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-ambulatory-receipt-and-qi.png"), animations: "disabled" });
  expect(failures).toEqual([]);
});

test("accepted support state renders a specific break seat and the surgeon's QI office chair", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The support-pose evidence uses desktop Chromium.");
  testInfo.setTimeout(90_000);
  const failures = watchRuntimeFailures(page);
  await page.setViewportSize({ width: 1920, height: 1200 });
  await startClinic(page, "Support Pose Founder", "Level Three Support Pose Clinic");
  const state = stationLevelThreeStaff(addCompleteLevelThreeLayout(await qualifyAndAdvanceToLevelThree(page)));
  const breakRoom = state.rooms.find((room) => room.id === "room.e2e.break")!;
  const office = state.rooms.find((room) => room.id === "room.e2e.office")!;
  const breakAnchor = getRoomNavigationAnchor(breakRoom, getRoomDefinition(breakRoom.roomDefinitionId)!, "staff");
  const officeAnchor = getRoomNavigationAnchor(office, getRoomDefinition(office.roomDefinitionId)!, "staff");
  const nurse = state.employees.find((employee) => employee.id === "employee.e2e.or-nurse")!;
  nurse.location = breakAnchor;
  nurse.path = [breakAnchor];
  nurse.pathIndex = 0;
  nurse.facilityTask = { kind: "take_break", targetId: breakRoom.id, seatId: "largeNorth", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 10 };
  const surgeon = state.employees.find((employee) => employee.id === "employee.e2e.surgeon")!;
  surgeon.location = officeAnchor;
  surgeon.path = [officeAnchor];
  surgeon.pathIndex = 0;
  surgeon.facilityTask = { kind: "review_ambulatory_qi", targetId: "qi.e2e.pose", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 10 };
  state.levelThreeQiReviews = [{
    id: "qi.e2e.pose", receiptId: "receipt.e2e.pose", status: "in_progress",
    enqueuedAtFacilityTick: state.facilityTick, surgeonEmployeeId: surgeon.id,
    startedAtFacilityTick: state.facilityTick, completedAtFacilityTick: null,
  }];
  state.paused = true;
  await persistState(page, state);
  await focusApprovedRooms(page, ["room.e2e.break", "room.e2e.office"]);
  const rendered = await expect.poll(async () => page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene.getScene("facility-scene") as any;
    const snapshot = (employeeId: string) => {
      const container = scene?.characterBitmapContainers.get(`character:staff:${employeeId}`);
      const actor = container?.getByName("actor");
      return container && actor ? {
        role: container.getData("actor-support-role"),
        supportId: container.getData("actor-support-id"),
        roomId: container.getData("actor-support-room-instance-id"),
        pose: actor.getData("gait-pose"),
        stillId: actor.getData("gait-still-id"),
      } : null;
    };
    return { nurse: snapshot("employee.e2e.or-nurse"), surgeon: snapshot("employee.e2e.surgeon") };
  }), { timeout: 15_000 }).toMatchObject({
    nurse: { role: "staff-break-seat", supportId: "largeNorth", roomId: "room.e2e.break", pose: "seated" },
    surgeon: { role: "surgeon-office", supportId: "surgeon", roomId: "room.e2e.office", pose: "seated" },
  });
  void rendered;
  const stills = await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene") as any;
    return ["employee.e2e.or-nurse", "employee.e2e.surgeon"].map((id) =>
      scene.characterBitmapContainers.get(`character:staff:${id}`)?.getByName("actor")?.getData("gait-still-id"));
  });
  expect(stills.every((stillId) => typeof stillId === "string" && stillId.startsWith("level3-roster-v2."))).toBe(true);
  await page.addStyleTag({ content: ".facility-pause-indicator { display: none !important; }" });
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-break-and-office-seated-supports.png"), animations: "disabled" });
  expect(failures).toEqual([]);
});

test("pharmacy and vending purchases settle and maintenance reports due, repair, and restored service", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The integrated Level 3 support flow uses desktop Chromium.");
  testInfo.setTimeout(120_000);
  const failures = watchRuntimeFailures(page);
  await startClinic(page, "Support Founder", "Level Three Support Clinic");
  let state = stationLevelThreeStaff(addCompleteLevelThreeLayout(await qualifyAndAdvanceToLevelThree(page)));
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  for (const employee of state.employees) {
    employee.facilityTask = null;
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  state = apply(state, command("e2e.retail.pharmacy", {
    type: "START_RETAIL_PURCHASE", incomeLineId: "income.otc_supply",
    actorKind: "employee", actorId: "employee.e2e.or-nurse",
  }));
  state = apply(state, command("e2e.retail.vending", {
    type: "START_RETAIL_PURCHASE", incomeLineId: "income.vending_snack",
    actorKind: "employee", actorId: "employee.e2e.surgeon",
  }));
  state = advanceUntil(state, (candidate) =>
    candidate.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.otc_supply") &&
    candidate.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.vending_snack"),
  "retail-settled", 240);
  expect(state.serviceIncomeReceipts.find((receipt) => receipt.incomeLineId === "income.otc_supply")).toMatchObject({
    grossAmount: 12, stockCost: 6, netCashDelta: 6,
  });
  expect(state.serviceIncomeReceipts.find((receipt) => receipt.incomeLineId === "income.vending_snack")).toMatchObject({
    grossAmount: 4, stockCost: 2, netCashDelta: 2,
  });

  for (let use = 0; use < 8; use += 1) {
    recordLevelThreeRoomUse(state, "room.e2e.laboratory", `e2e.maintenance.use.${use}`, PROTOTYPE_DOMAIN_CONTEXT);
  }
  expect(state.rooms.find((room) => room.id === "room.e2e.laboratory")?.maintenance?.status).toBe("due");
  state.paused = true;
  await persistState(page, state);
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await page.getByRole("tab", { name: "Services & income" }).click();
  await expect(page.getByText("Maintenance due: In-house Laboratory", { exact: true })).toBeVisible();
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-retail-and-maintenance-due.png"), animations: "disabled" });

  const dueAt = state.rooms.find((room) => room.id === "room.e2e.laboratory")!.maintenance!.outOfServiceAtFacilityTick!;
  state.facilityTick = dueAt;
  state = advanceUntil(state, (candidate) =>
    candidate.rooms.find((room) => room.id === "room.e2e.laboratory")?.maintenance?.status === "out_of_service",
  "maintenance-out-of-service", 5);
  state = advanceUntil(state, (candidate) => {
    const maintenance = candidate.rooms.find((room) => room.id === "room.e2e.laboratory")?.maintenance;
    return maintenance?.status === "operational" && maintenance.completedUses === 0;
  }, "maintenance-repaired", 300);
  state.paused = true;
  await persistState(page, state);
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await page.getByRole("tab", { name: "Services & income" }).click();
  await expect(page.getByText("Equipment operational", { exact: true })).toBeVisible();
  await expect(page.getByText("OTC supply basket", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Vending snack", { exact: true }).last()).toBeVisible();
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-maintenance-repaired.png"), animations: "disabled" });
  expect(failures).toEqual([]);
});

test("compact Level 3 keeps the facility canvas and management controls usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The desktop project supplies the deterministic compact fixture.");
  testInfo.setTimeout(90_000);
  const failures = watchRuntimeFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await startClinic(page, "Compact Level Three", "Compact Level Three Clinic");
  const complete = stationLevelThreeStaff(addCompleteLevelThreeLayout(await qualifyAndAdvanceToLevelThree(page)));
  await persistState(page, complete);
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await expect(page.getByRole("heading", { name: "Surgeon", exact: true, level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repair Person", exact: true, level: 3 })).toBeVisible();
  await page.getByRole("tab", { name: "Services & income" }).click();
  const queue = page.getByRole("button", { name: "Queue laboratory work" });
  await queue.scrollIntoViewIfNeeded();
  await expect(queue).toBeInViewport();
  await expect(page.getByRole("region", { name: "Level 3 support status" })).toBeVisible();
  await page.screenshot({ path: join(EVIDENCE_ROOT, "level-three-management-compact.png"), animations: "disabled" });
  expect(failures).toEqual([]);
});
