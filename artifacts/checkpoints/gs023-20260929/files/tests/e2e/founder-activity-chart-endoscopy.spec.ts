import { mkdirSync } from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  advancePatientAmenityTrips,
  getRoomCareAnchor,
  getRoomDefinition,
  getRoomNavigationAnchor,
  requestPatientAmenityReturn,
  tryStartPatientBathroomTrip,
  type GameState,
} from "@gamify-surgery/game-domain";

import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  setFastFacilitySpeed,
  startClinic,
} from "./helpers";

const EVIDENCE = ".local-dev/founder-activity-chart-endoscopy/browser";
const EXAM_ID = "room.activity.examination";
const WAITING_ID = "room.activity.waiting";
const BATHROOM_ID = "room.activity.bathroom";

test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));
test.setTimeout(150_000);

function shot(testInfo: TestInfo, name: string): string {
  return `${EVIDENCE}/${testInfo.project.name}-${name}.png`;
}

function addRoom(
  state: GameState,
  id: string,
  roomDefinitionId: string,
  x: number,
  y: number,
  doorSide: "east" | "west",
  doorOffset: number,
) {
  state.rooms.push({
    id,
    roomDefinitionId,
    x,
    y,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: `door.${id}`,
    roomId: id,
    side: doorSide,
    offset: doorOffset,
    exterior: false,
  });
}

function prepareReturningAmenityPatient(state: GameState) {
  state.facilityLevel = 2;
  state.paused = true;
  state.simulationSpeed = 1;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.serviceOperations = [];
  state.retailOperations = [];
  state.patientAmenityTrips = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [{
    id: "room.instance.founder_desk",
    roomDefinitionId: "room.front_desk",
    x: 33,
    y: 28,
    orientation: 0,
    doorSide: null,
    upgradeLevel: 1,
    cleanliness: 100,
  }];
  state.doors = [
    {
      id: "door.activity.front-exterior",
      roomId: "room.instance.founder_desk",
      side: "south",
      offset: 2,
      exterior: true,
    },
    {
      id: "door.activity.front-hall",
      roomId: "room.instance.founder_desk",
      side: "west",
      offset: 0,
      exterior: false,
    },
  ];
  for (let y = 20; y <= 28; y += 1) {
    state.rooms.push({
      id: `hall.activity.${y}`,
      roomDefinitionId: "room.hallway",
      x: 32,
      y,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
  }
  addRoom(state, WAITING_ID, "room.waiting", 28, 26, "east", 1);
  addRoom(state, BATHROOM_ID, "room.bathroom", 30, 23, "east", 1);
  addRoom(state, EXAM_ID, "room.examination", 33, 24, "west", 1);

  const encounter = Object.values(state.encounters)[0]!;
  state.encounters = { [encounter.id]: encounter };
  encounter.patientDisplayName = "Amenity Return Patient";
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "waiting_unopened";
  encounter.patientMovement = null;
  const waiting = state.rooms.find((room) => room.id === WAITING_ID)!;
  const waitingLocation = getRoomNavigationAnchor(
    waiting,
    getRoomDefinition(waiting.roomDefinitionId)!,
  );
  encounter.patientLocation = { ...waitingLocation };
  encounter.assignedRoomInstanceId = WAITING_ID;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = {
    roomInstanceId: WAITING_ID,
    location: { ...waitingLocation },
    kind: "standing",
  };
  expect(tryStartPatientBathroomTrip(
    state,
    "encounter",
    encounter.id,
    PROTOTYPE_DOMAIN_CONTEXT,
  )).toBe(true);
  for (let minute = 0; minute < 2; minute += 1) {
    state.facilityTick += 1;
    advancePatientAmenityTrips(state, PROTOTYPE_DOMAIN_CONTEXT);
  }
  expect(requestPatientAmenityReturn(
    state,
    "encounter",
    encounter.id,
    PROTOTYPE_DOMAIN_CONTEXT,
  )).toBe(true);
  expect(state.patientAmenityTrips?.[0]?.status).toBe("returning");
  expect(encounter.patientLocation).not.toEqual(waitingLocation);
  return { encounterId: encounter.id, currentLocation: { ...encounter.patientLocation! } };
}

async function installReturningAmenityFixture(page: Page, name: string) {
  await startClinic(page, `${name} Founder`, name);
  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  )!;
  const state = JSON.parse(active.serializedState) as GameState;
  const fixture = prepareReturningAmenityPatient(state);
  active.name = name;
  active.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker: `founder-chart.${name}` });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => Boolean(
    (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene"),
  ));
  return fixture;
}

function prepareScheduledEndoscopy(state: GameState) {
  const front = state.rooms.find(
    (room) => room.id === "room.instance.founder_desk",
  );
  if (!front) throw new Error("Fresh campaign Front Desk is missing.");
  const exteriorDoors = state.doors.filter(
    (door) => door.roomId === front.id && door.exterior,
  );
  const endoscopy = {
    id: "room.activity.endoscopy",
    roomDefinitionId: "room.endoscopy",
    x: 28,
    y: 2,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  const periop = {
    id: "room.activity.periop",
    roomDefinitionId: "room.periop_recovery",
    x: 26,
    y: 8,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 5 as const,
    cleanliness: 100,
  };
  state.facilityLevel = 2;
  state.cash = 5_000;
  state.cashCents = 500_000;
  state.paused = true;
  state.simulationSpeed = 4;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.environment.founderActivity = null;
  state.encounters = {};
  state.serviceOperations = [];
  state.serviceOperationSequence = 0;
  state.serviceIncomeReceipts = [];
  state.operationReceipts = {};
  state.retailOperations = [];
  state.retailExternalActors = [];
  state.patientAmenityTrips = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.rooms = [
    { ...front },
    endoscopy,
    periop,
    ...Array.from({ length: 29 }, (_, index) => ({
      id: `room.activity.hall.${index}`,
      roomDefinitionId: "room.hallway",
      x: 32,
      y: 3 + index,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
  ];
  state.doors = [
    ...exteriorDoors,
    {
      id: "door.activity.front",
      roomId: front.id,
      side: "west",
      offset: 0,
      exterior: false,
    },
    {
      id: "door.activity.endoscopy",
      roomId: endoscopy.id,
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.activity.periop",
      roomId: periop.id,
      side: "east",
      offset: 1,
      exterior: false,
    },
  ];
  const employee = (
    id: string,
    role: string,
    home: typeof endoscopy | typeof periop,
  ) => {
    const location = getRoomNavigationAnchor(
      home,
      getRoomDefinition(home.roomDefinitionId)!,
      "staff",
    );
    return {
      id,
      staffRoleDefinitionId: role,
      displayName: id,
      appearance: state.founder.appearance,
      hiredAtFacilityTick: state.facilityTick,
      salaryPerExpenseInterval: 1,
      morale: 100,
      trainingLevel: 1 as const,
      homeRoomInstanceId: home.id,
      location: { ...location },
      path: [{ ...location }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
      facilityTask: null,
    };
  };
  state.employees = [
    employee(
      "employee.activity.endoscopy-nurse",
      "staff.endoscopy_nurse",
      endoscopy,
    ),
    employee(
      "employee.activity.periop-nurse",
      "staff.periop_nurse",
      periop,
    ),
  ];
  state.environment.founderLocation = getRoomNavigationAnchor(
    front,
    getRoomDefinition(front.roomDefinitionId)!,
    "staff",
  );
  state.serviceAppointmentsEnabled = true;
  state.lastServiceAppointmentArrivalTick = null;
  state.lastServiceAppointmentLineId = null;
  state.lastServiceAppointmentTicks = {};
  state.nextServiceAppointmentTicks = {
    "income.endoscopy": state.facilityTick + 1,
  };
  return { initialCash: state.cash };
}

async function installScheduledEndoscopyFixture(page: Page, name: string) {
  await startClinic(page, `${name} Founder`, name);
  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  )!;
  const state = JSON.parse(active.serializedState) as GameState;
  const fixture = prepareScheduledEndoscopy(state);
  active.name = name;
  active.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker: `founder-endoscopy.${name}` });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => Boolean(
    (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene"),
  ));
  return fixture;
}

async function founderActivityVisual(page: Page) {
  return page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    const actor = scene.characterBitmapContainers.get("character:founder");
    const image = actor?.getByName("actor");
    const text = scene.founderActivityText;
    const box = scene.founderActivityBox;
    const camera = scene.cameras.main;
    const bounds = (candidate: any) => {
      const value = candidate?.getBounds?.();
      return value ? {
        left: camera.x + (value.left - camera.scrollX) * camera.zoom,
        right: camera.x + (value.right - camera.scrollX) * camera.zoom,
        top: camera.y + (value.top - camera.scrollY) * camera.zoom,
        bottom: camera.y + (value.bottom - camera.scrollY) * camera.zoom,
      } : null;
    };
    const textBounds = bounds(text);
    return {
      label: text?.text ?? "",
      textVisible: text?.visible ?? false,
      boxVisible: box?.visible ?? false,
      boxCommandCount: box?.commandBuffer?.length ?? 0,
      textBounds,
      expectedBoxBounds: textBounds ? {
        left: textBounds.left - 3 * camera.zoom,
        right: textBounds.right + 3 * camera.zoom,
        top: textBounds.top - 2 * camera.zoom,
        bottom: textBounds.bottom + 2 * camera.zoom,
      } : null,
      actorBounds: bounds(image),
      viewport: { width: scene.scale.width, height: scene.scale.height },
    };
  });
}

async function centerOnGridPoint(page: Page, point: { x: number; y: number }) {
  await page.evaluate((location) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      .__facilityGame.scene.getScene("facility-scene") as any;
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 });
    const centerX = scene.layout.originX + (location.x + 0.5) * scene.layout.tileSize;
    const baseY = scene.actorBaseY(location.y);
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - centerX,
      // Keep the actor and label below the centered pause banner so the
      // screenshot proves both the frozen game state and the live overlay.
      panY: scene.scale.height * 0.78 - baseY,
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, point);
}

function expectBoxAboveVisibleFounder(snapshot: Awaited<ReturnType<typeof founderActivityVisual>>, label: string) {
  expect(snapshot).toMatchObject({ label, textVisible: true, boxVisible: true });
  expect(snapshot.boxCommandCount).toBeGreaterThan(0);
  expect(snapshot.textBounds).not.toBeNull();
  expect(snapshot.expectedBoxBounds).not.toBeNull();
  expect(snapshot.actorBounds).not.toBeNull();
  expect(snapshot.textBounds!.bottom).toBeLessThan(snapshot.actorBounds!.top);
  expect(snapshot.expectedBoxBounds!.left).toBeLessThanOrEqual(snapshot.textBounds!.left);
  expect(snapshot.expectedBoxBounds!.right).toBeGreaterThanOrEqual(snapshot.textBounds!.right);
  expect(snapshot.expectedBoxBounds!.top).toBeGreaterThanOrEqual(0);
  expect(snapshot.expectedBoxBounds!.bottom).toBeLessThan(snapshot.viewport.height);
}

test("one patient-rail click redirects a returning amenity patient from the visible current tile to Examination", async ({ page }, testInfo) => {
  const clinic = `Chart redirect ${testInfo.project.name}`;
  const fixture = await installReturningAmenityFixture(page, clinic);
  expect(await founderActivityVisual(page)).toMatchObject({
    textVisible: false,
    boxVisible: false,
  });

  await page.getByText("Amenity Return Patient", { exact: true }).click();
  await expect(page.locator(".chart-panel")).toBeVisible();
  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    const encounter = state.encounters[fixture.encounterId]!;
    const trip = state.patientAmenityTrips?.find(
      (candidate) => candidate.actorId === fixture.encounterId,
    );
    const exam = state.rooms.find((room) => room.id === EXAM_ID)!;
    const examTarget = getRoomCareAnchor(
      exam,
      getRoomDefinition(exam.roomDefinitionId)!,
      "patient",
    );
    return {
      open: state.openChartEncounterId,
      amenityTrips: state.patientAmenityTrips?.length ?? 0,
      amenityStatus: trip?.status ?? null,
      amenityPathStart: trip?.path[0] ?? null,
      amenityReturnTarget: trip?.returnTarget ?? null,
      queuedCareRoom: encounter.queuedCareRoomInstanceId,
      movement: encounter.patientMovement?.kind ?? null,
      founder: state.environment.founderActivity?.kind ?? null,
      examTarget,
    };
  }).toEqual({
    open: fixture.encounterId,
    amenityTrips: 1,
    amenityStatus: "returning",
    amenityPathStart: fixture.currentLocation,
    amenityReturnTarget: expect.any(Object),
    queuedCareRoom: EXAM_ID,
    movement: null,
    founder: "attend_encounter",
    examTarget: expect.any(Object),
  });
  const redirected = (await getActiveState(page)) as unknown as GameState;
  const redirectTrip = redirected.patientAmenityTrips!.find(
    (candidate) => candidate.actorId === fixture.encounterId,
  )!;
  const redirectExam = redirected.rooms.find((room) => room.id === EXAM_ID)!;
  expect(redirectTrip.returnTarget).toEqual(getRoomCareAnchor(
    redirectExam,
    getRoomDefinition(redirectExam.roomDefinitionId)!,
    "patient",
  ));
  expectBoxAboveVisibleFounder(
    await founderActivityVisual(page),
    "Walking to patient",
  );
  await page.getByRole("button", { name: "Zoom facility in" }).click();
  await centerOnGridPoint(page, redirected.environment.founderLocation);
  expectBoxAboveVisibleFounder(
    await founderActivityVisual(page),
    "Walking to patient",
  );
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect(page.getByText("GAME PAUSED", { exact: true })).toBeHidden();
  expectBoxAboveVisibleFounder(
    await founderActivityVisual(page),
    "Walking to patient",
  );
  await page.screenshot({
    path: shot(testInfo, "live-zoom-chart-redirect-walking-label"),
    animations: "disabled",
  });

  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    const encounter = state.encounters[fixture.encounterId]!;
    const exam = state.rooms.find((room) => room.id === EXAM_ID)!;
    return {
      amenityTrips: state.patientAmenityTrips?.filter(
        (candidate) => candidate.actorId === fixture.encounterId,
      ).length ?? 0,
      movement: encounter.patientMovement,
      queuedCareRoom: encounter.queuedCareRoomInstanceId,
      location: encounter.patientLocation,
      examTarget: getRoomCareAnchor(
        exam,
        getRoomDefinition(exam.roomDefinitionId)!,
        "patient",
      ),
    };
  }, { timeout: 30_000 }).toEqual({
    amenityTrips: 0,
    movement: null,
    queuedCareRoom: null,
    location: expect.any(Object),
    examTarget: expect.any(Object),
  });
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[fixture.encounterId]!;
  const exam = state.rooms.find((room) => room.id === EXAM_ID)!;
  expect(encounter.patientLocation).toEqual(getRoomCareAnchor(
    exam,
    getRoomDefinition(exam.roomDefinitionId)!,
    "patient",
  ));
  await expect.poll(async () => (await founderActivityVisual(page)).label, {
    timeout: 20_000,
  }).toBe("Talking to patient");
  await centerOnGridPoint(page, state.environment.founderLocation);
  expectBoxAboveVisibleFounder(
    await founderActivityVisual(page),
    "Talking to patient",
  );
  await expect(page.getByText("GAME PAUSED", { exact: true })).toBeHidden();
  await page.screenshot({
    path: shot(testInfo, "live-zoom-chart-arrival-talking-label"),
    animations: "disabled",
  });
});

test("a naturally scheduled endoscopy uses the founder and credits the advertised $600 exactly once", async ({ page }, testInfo) => {
  const clinic = `Scheduled Endoscopy ${testInfo.project.name}`;
  const fixture = await installScheduledEndoscopyFixture(page, clinic);

  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await page.getByRole("tab", { name: "Services & income" }).click();
  const catalogItem = page.locator("li").filter({
    has: page.getByText("Routine endoscopy", { exact: true }),
  });
  await expect(catalogItem).toBeVisible();
  await expect(catalogItem).toContainText(
    "$600.00 per scheduled visitor · $450.00 question-ordered",
  );
  await page.screenshot({
    path: shot(testInfo, "management-routine-endoscopy-600"),
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Done" }).click();

  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  const operationId = await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    const operation = state.serviceOperations.find(
      (candidate) => candidate.incomeLineId === "income.endoscopy",
    );
    return operation && operation.actorKind === "visitor" && operation.quoteFee === 600
      ? operation.id
      : null;
  }, { timeout: 30_000 }).not.toBeNull().then(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    return state.serviceOperations.find(
      (candidate) => candidate.incomeLineId === "income.endoscopy",
    )!.id;
  });

  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    const operation = state.serviceOperations.find(
      (candidate) => candidate.id === operationId,
    );
    return {
      status: operation?.status ?? null,
      provider: operation?.providerReservation?.kind ?? null,
      activity: state.environment.founderActivity?.kind ?? null,
      label: (await founderActivityVisual(page)).label,
    };
  }, { timeout: 90_000 }).toEqual({
    status: "in_service",
    provider: "founder",
    activity: "perform_service",
    label: "Performing endoscopy",
  });
  const inService = (await getActiveState(page)) as unknown as GameState;
  await centerOnGridPoint(page, inService.environment.founderLocation);
  expectBoxAboveVisibleFounder(
    await founderActivityVisual(page),
    "Performing endoscopy",
  );
  await expect(page.getByText("GAME PAUSED", { exact: true })).toBeHidden();
  await page.screenshot({
    path: shot(testInfo, "live-zoom-performing-endoscopy-label"),
    animations: "disabled",
  });

  await expect.poll(async () => {
    const state = (await getActiveState(page)) as unknown as GameState;
    const receipts = state.serviceIncomeReceipts.filter(
      (receipt) => receipt.incomeLineId === "income.endoscopy" &&
        receipt.actorId === operationId,
    );
    const operation = state.serviceOperations.find(
      (candidate) => candidate.id === operationId,
    );
    return {
      status: operation?.status ?? null,
      location: operation?.location ?? null,
      cash: state.cash,
      receipts: receipts.map((receipt) => ({
        actorKind: receipt.actorKind,
        grossAmount: receipt.grossAmount,
        netCashDelta: receipt.netCashDelta,
      })),
    };
  }, { timeout: 120_000 }).toEqual({
    status: "completed",
    location: null,
    cash: fixture.initialCash + 600,
    receipts: [{
      actorKind: "visitor",
      grossAmount: 600,
      netCashDelta: 600,
    }],
  });

  await page.reload();
  const resume = page.getByRole("button", { name: `Resume ${clinic}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const reloaded = (await getActiveState(page)) as unknown as GameState;
  expect(reloaded.cash).toBe(fixture.initialCash + 600);
  expect(reloaded.serviceIncomeReceipts.filter(
    (receipt) => receipt.incomeLineId === "income.endoscopy" &&
      receipt.actorId === operationId,
  )).toHaveLength(1);
});
