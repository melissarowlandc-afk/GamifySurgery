import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import {
  getFacilityAccessValidation,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
} from "@gamify-surgery/game-domain";
import { mkdirSync } from "node:fs";
import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

const EVIDENCE = ".local-dev/room-capacity-sales/browser";
const GRID_WIDTH = 72;
const GRID_HEIGHT = 32;
test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));
test.setTimeout(120_000);

function addRoom(state: GameState, id: string, roomDefinitionId: string, x: number, y: number, side: "east" | "west", offset: number) {
  state.rooms.push({ id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: `door.${id}`, roomId: id, side, offset, exterior: false });
}

/** A compact, fully connected Level-2 fixture. It deliberately uses production
 * persistence, selectors, Build Mode, and Phaser rather than a test UI mock. */
function seedFacility(state: GameState) {
  Object.assign(state, {
    facilityLevel: 2, cash: 50_000, cashCents: 5_000_000, paused: true,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    serviceAppointmentsEnabled: false, encounters: {}, serviceOperations: [],
    serviceIncomeReceipts: [], employees: [], departingEmployees: [],
  });
  state.rooms = [{ id: "room.instance.founder_desk", roomDefinitionId: "room.front_desk", x: 33, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }];
  state.doors = [
    { id: "door.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "door.front.hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  ];
  for (let y = 20; y <= 28; y += 1) {
    state.rooms.push({ id: `hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  }
  addRoom(state, "room.capacity.ultrasound", "room.ultrasound", 29, 23, "east", 1);
  addRoom(state, "room.capacity.xray", "room.xray", 33, 23, "west", 1);
  addRoom(state, "room.capacity.glp", "room.glp1_telehealth_suite", 29, 20, "east", 1);
  const glp = state.rooms.find((room) => room.id === "room.capacity.glp")!;
  const glpLocation = getRoomNavigationAnchor(glp, getRoomDefinition(glp.roomDefinitionId)!, "staff");
  state.employees.push({ id: "employee.capacity.np", staffRoleDefinitionId: "staff.glp1_np", displayName: "Named NP", appearance: state.founder.appearance, hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 40, morale: 75, trainingLevel: 1, homeRoomInstanceId: glp.id, location: glpLocation, path: [glpLocation], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
  // Peri-op is intentionally omitted from this geometry until its six-tile
  // footprint can be independently preflighted with the current bed layout.
  const access = getFacilityAccessValidation(state);
  if (!access.valid) throw new Error(`Capacity fixture access invalid: ${access.issues.join("; ")}`);
}

async function install(page: Page, name: string) {
  await startClinic(page, `${name} Founder`, name);
  const profile = await getProfile(page);
  const active = profile.campaigns.find((campaign) => campaign.campaignId === profile.activeCampaignId)!;
  const state = JSON.parse(active.serializedState) as GameState;
  seedFacility(state);
  active.name = name;
  active.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker: `room-capacity.${name}` });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => Boolean(
    (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene"),
  ));
  await page.waitForFunction((roomId) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    return scene?.bridge?.viewModel?.rooms?.some(
      (room: { instanceId: string }) => room.instanceId === roomId,
    );
  }, "room.capacity.glp");
}

async function selectRoom(page: Page, roomId: string) {
  const point = await page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene");
    const room = scene?.bridge?.viewModel?.rooms?.find(
      (candidate: { instanceId: string }) => candidate.instanceId === id,
    );
    if (!scene || !room) throw new Error(`Missing live room ${id}.`);
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    let layout = scene.layout;
    const worldX = layout.originX + (room.tileX + room.width / 2) * layout.tileSize;
    const worldY = layout.originY + (room.tileY + room.height / 2) * layout.tileSize;
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - worldX,
      panY: scene.scale.height / 2 - worldY,
    });
    scene.refreshLayout(true);
    layout = scene.layout;
    return {
      x: layout.originX + (room.tileX + room.width / 2) * layout.tileSize,
      y: layout.originY + (room.tileY + room.height / 2) * layout.tileSize,
    };
  }, roomId);
  await page.getByTestId("facility-canvas").click({ position: point });
  await expect(page.locator(".selected-room-inspector")).toBeVisible();
}

function shot(testInfo: TestInfo, name: string): string {
  return `${EVIDENCE}/${testInfo.project.name}-${name}.png`;
}

async function expectFullyVisible(page: Page, locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) throw new Error("Missing dialog bounds or viewport.");
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
}

async function clickGridPoint(page: Page, x: number, y: number) {
  const point = await page.evaluate(({ x, y }) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene");
    return {
      x: scene.layout.originX + x * scene.layout.tileSize,
      y: scene.layout.originY + y * scene.layout.tileSize,
    };
  }, { x, y });
  await page.getByTestId("facility-canvas").click({ position: point });
}

async function frameGridPointBelowPauseOverlay(
  page: Page,
  point: { x: number; y: number },
) {
  await page.evaluate((location) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const layout = scene.layout;
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 -
        (layout.originX + (location.x + 0.5) * layout.tileSize),
      panY: scene.scale.height * 0.78 - scene.actorBaseY(location.y),
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, point);
}

test("Build Mode shows separate finite room caps and Management uses shared imaging and two-NP GLP capacity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop capacity and hire proof.");
  await install(page, "Room capacity browser");
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await expect(page.locator("[data-room-definition-id='room.ultrasound']")).toContainText("1 / 1 built");
  await expect(page.locator("[data-room-definition-id='room.glp1_telehealth_suite']")).toContainText("1 / 5 built");
  await page.screenshot({ path: shot(testInfo, "build-caps"), animations: "disabled" });
  await page.getByRole("button", { name: "Done / Save" }).click();
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await expect(page.locator("[data-staff-role-id='staff.imaging_technician']")).toContainText("0/2");
  const glpRole = page.locator("[data-staff-role-id='staff.glp1_np']");
  await expect(glpRole).toContainText("1/2");
  await glpRole.getByRole("button", { name: /Hire/ }).click();
  await expect(glpRole).toContainText("2/2");
});

test("sale confirmation names dismissals, cancel is inert, and confirm carries the exact preview through undo", async ({ page }, testInfo) => {
  await install(page, "Room sale browser");
  const state = (await getActiveState(page)) as unknown as GameState;
  const room = state.rooms.find((candidate) => candidate.id === "room.capacity.glp")!;
  const roomDoor = state.doors.find((candidate) => candidate.roomId === room.id)!;
  const cashBefore = state.cashCents;
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await selectRoom(page, room.id);
  await page.getByRole("button", { name: /Sell/ }).click();
  const dialog = page.getByRole("dialog", { name: "Sell GLP-1 Telehealth Suite?" });
  await expectFullyVisible(page, dialog);
  await expect(dialog).toContainText("Resale value: $300");
  await expect(dialog).toContainText("Selling this room will result in firing:");
  await expect(dialog).toContainText("Named NP");
  await expect(dialog).toContainText("you will not earn the fee for unfinished testing");
  await page.screenshot({ path: shot(testInfo, "named-dismissal-sale-dialog"), animations: "disabled" });
  await dialog.getByRole("button", { name: "Cancel" }).click();
  const cancelled = (await getActiveState(page)) as unknown as GameState;
  expect(cancelled.cashCents).toBe(cashBefore);
  expect(cancelled.rooms).toContainEqual(expect.objectContaining({ id: room.id }));
  expect(cancelled.doors).toContainEqual(expect.objectContaining({ id: roomDoor.id }));
  expect(cancelled.employees).toContainEqual(expect.objectContaining({ id: "employee.capacity.np" }));
  expect(cancelled.departingEmployees).toEqual([]);
  await page.getByRole("button", { name: /Sell/ }).click();
  await dialog.getByRole("button", { name: "Confirm Sale" }).click();
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).rooms.some((candidate) => candidate.id === room.id)).toBe(false);
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).departingEmployees?.map((employee) => employee.id)).toEqual(["employee.capacity.np"]);
  await expect.poll(async () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene");
    const actor = scene?.characterBitmapContainers?.get("character:staff:employee.capacity.np");
    if (!actor?.visible) return false;
    const bounds = actor.getBounds();
    return bounds.right > 0 && bounds.left < scene.scale.width && bounds.bottom > 0 && bounds.top < scene.scale.height;
  })).toBe(true);
  await page.screenshot({ path: shot(testInfo, "dismissed-np-still-visible-in-build-mode"), animations: "disabled" });
  await page.getByRole("button", { name: "Undo" }).click();
  await expect.poll(async () => {
    const restored = (await getActiveState(page)) as unknown as GameState;
    return {
      cash: restored.cashCents,
      room: restored.rooms.some((candidate) => candidate.id === room.id),
      door: restored.doors.some((candidate) => candidate.id === roomDoor.id),
      employee: restored.employees.some((candidate) => candidate.id === "employee.capacity.np"),
      departures: restored.departingEmployees?.length ?? 0,
    };
  }).toEqual({ cash: cashBefore, room: true, door: true, employee: true, departures: 0 });
});

test("a sold staffed room can be rebuilt with a real door while the dismissed employee departs across reload", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop rebuild and departure proof.");
  const clinicName = "Room rebuild browser";
  await install(page, clinicName);
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await selectRoom(page, "room.capacity.glp");
  await page.getByRole("button", { name: /Sell/ }).click();
  await page.getByRole("dialog", { name: "Sell GLP-1 Telehealth Suite?" })
    .getByRole("button", { name: "Confirm Sale" }).click();
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState)
    .rooms.some((room) => room.id === "room.capacity.glp")).toBe(false);

  await page.locator("[data-room-definition-id='room.glp1_telehealth_suite']").click();
  await clickGridPoint(page, 29.5, 20.5);
  let rebuilt = (await getActiveState(page)) as unknown as GameState;
  const rebuiltRoom = rebuilt.rooms.find((room) =>
    room.roomDefinitionId === "room.glp1_telehealth_suite",
  );
  expect(rebuiltRoom).toBeTruthy();
  expect(rebuiltRoom!.id).not.toBe("room.capacity.glp");
  await page.getByRole("button", { name: "Place Door" }).click();
  await clickGridPoint(page, 32, 21.5);
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState)
    .doors.some((door) => door.roomId === rebuiltRoom!.id)).toBe(true);
  await page.getByRole("button", { name: "Done / Save" }).click();
  await page.getByRole("button", { name: "Resume facility time" }).click();

  await expect.poll(async () => page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const gait = host?.__facilityGaitSnapshot?.()["character:staff:employee.capacity.np"];
    return Boolean(gait?.visible && gait.pose !== "seated");
  }), { timeout: 20_000 }).toBe(true);
  await expect.poll(async () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    const actor = scene?.characterBitmapContainers?.get("character:staff:employee.capacity.np");
    if (!actor?.visible) return false;
    const bounds = actor.getBounds();
    return bounds.right > 0 && bounds.left < scene.scale.width &&
      bounds.bottom > 0 && bounds.top < scene.scale.height;
  })).toBe(true);
  await page.screenshot({
    path: shot(testInfo, "rebuilt-room-dismissed-np-standing-departure"),
    animations: "disabled",
  });
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    return current.departingEmployees?.find(
      (employee) => employee.id === "employee.capacity.np",
    )?.path.length ?? 0;
  }, { timeout: 20_000 }).toBeGreaterThan(1);
  const planned = (await getActiveState(page)) as unknown as GameState;
  const plannedDeparture = planned.departingEmployees!.find(
    (employee) => employee.id === "employee.capacity.np",
  )!;
  const doorStepIndex = plannedDeparture.path.findIndex(
    (point) => point.x === 32 && point.y === 21,
  );
  expect(
    doorStepIndex,
    `Expected rebuilt east door step in ${JSON.stringify(plannedDeparture.path)}`,
  ).toBeGreaterThan(0);
  expect(plannedDeparture.path.slice(0, -1).some((point, index) =>
    point.x === 31 && point.y === 21 &&
    plannedDeparture.path[index + 1]?.x === 32 &&
    plannedDeparture.path[index + 1]?.y === 21,
  )).toBe(true);
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const departing = current.departingEmployees?.find((employee) => employee.id === "employee.capacity.np");
    return departing && departing.pathIndex > doorStepIndex ? departing.pathIndex : 0;
  }, { timeout: 20_000 }).toBeGreaterThan(doorStepIndex);
  const beforeReload = (await getActiveState(page)) as unknown as GameState;
  const departureBefore = beforeReload.departingEmployees!.find((employee) => employee.id === "employee.capacity.np")!;

  await page.reload();
  const resume = page.getByRole("button", { name: `Resume ${clinicName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  rebuilt = (await getActiveState(page)) as unknown as GameState;
  expect(rebuilt.rooms).toContainEqual(expect.objectContaining({ id: rebuiltRoom!.id }));
  expect(rebuilt.doors).toContainEqual(expect.objectContaining({ roomId: rebuiltRoom!.id }));
  expect(rebuilt.departingEmployees).toContainEqual(expect.objectContaining({
    id: "employee.capacity.np",
    pathIndex: departureBefore.pathIndex,
    location: departureBefore.location,
  }));
  expect(departureBefore.pathIndex).toBeGreaterThan(doorStepIndex);
  await frameGridPointBelowPauseOverlay(page, departureBefore.location);
  await expect.poll(async () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    const actor = scene?.characterBitmapContainers?.get("character:staff:employee.capacity.np");
    if (!actor?.visible) return false;
    const bounds = actor.getBounds();
    return bounds.right > 0 && bounds.left < scene.scale.width &&
      bounds.bottom > 0 && bounds.top < scene.scale.height;
  })).toBe(true);
  await page.screenshot({
    path: shot(testInfo, "rebuilt-room-reloaded-departure"),
    animations: "disabled",
  });

  await page.getByRole("button", { name: "Set facility speed to 4x" }).click();
  const resumeAfterReload = page.getByRole("button", { name: "Resume facility time" });
  if (await resumeAfterReload.isVisible()) await resumeAfterReload.click();
  await expect.poll(async () => {
    const current = (await getActiveState(page)) as unknown as GameState;
    const departing = current.departingEmployees?.find(
      (employee) => employee.id === "employee.capacity.np",
    );
    return Boolean(departing?.location && departing.location.y === GRID_HEIGHT &&
      departing.location.x >= 2 && departing.location.x <= GRID_WIDTH - 3);
  }, { timeout: 30_000, intervals: [100, 250, 500] }).toBe(true);
  const pause = page.getByRole("button", { name: "Pause facility time" });
  if (await pause.isVisible()) await pause.click();
  const sidewalkState = (await getActiveState(page)) as unknown as GameState;
  const sidewalkDeparture = sidewalkState.departingEmployees!.find(
    (employee) => employee.id === "employee.capacity.np",
  )!;
  await frameGridPointBelowPauseOverlay(page, sidewalkDeparture.location);
  await page.screenshot({
    path: shot(testInfo, "rebuilt-room-reloaded-sidewalk-departure"),
    animations: "disabled",
  });

  if (await page.getByRole("button", { name: "Resume facility time" }).isVisible()) {
    await page.getByRole("button", { name: "Resume facility time" }).click();
  }
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState)
    .departingEmployees?.some((employee) => employee.id === "employee.capacity.np") ?? false,
  { timeout: 30_000 }).toBe(false);
  await expect.poll(async () => page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    return scene?.characterBitmapContainers?.has(
      "character:staff:employee.capacity.np",
    ) ?? false;
  })).toBe(false);
});
