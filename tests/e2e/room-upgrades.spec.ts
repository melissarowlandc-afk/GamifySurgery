import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, getDiagnosticOrderPlans, getFacilityAccessValidation,
  getRadiologistReadingStation,
  getWorkloadSnapshot, serializeGameState, type GameState,
} from "@gamify-surgery/game-domain";
import { PROFILE_KEY, getProfile, startClinic } from "./helpers";
import {
  createRoomUpgradeScenario, getRoomUpgradeFrozenQuantities,
  roomUpgradeScenarioIds as ids,
} from "./fixtures/roomUpgradeScenario";

const evidenceDirectory = resolve(
  process.env.GAMIFY_E2E_SCREENSHOT_DIR ?? ".local-dev/gs038-room-upgrades/browser",
);
const pageErrors = new WeakMap<Page, string[]>();
const ladders = {
  [ids.waiting]: {
    name: "Waiting Room A", prices: [110, 170, 250, 360],
    benefit: "+2 satisfaction points for waiting patients",
    totals: ["Baseline", "+2 points", "+4 points", "+6 points", "+8 points"],
  },
  [ids.examination]: {
    name: "Examination Room", prices: [90, 140, 210, 300],
    benefit: "+2 satisfaction points after examination",
    totals: ["Baseline", "+2 points", "+4 points", "+6 points", "+8 points"],
  },
  [ids.reading]: {
    name: "Radiology Reading Room", prices: [450, 675, 990, 1350],
    benefit: "Scan reading takes 10% less time",
    totals: ["Baseline", "10% less time", "20% less time", "30% less time", "40% less time"],
  },
  [ids.training]: {
    name: "Training Room", prices: [165, 245, 360, 490],
    benefit: "Training sessions take 10% less time",
    totals: ["Baseline", "10% less time", "20% less time", "30% less time", "40% less time"],
  },
  [ids.revenue]: {
    name: "Ultrasound Room", prices: [240, 360, 525, 715],
    benefit: "+6% ultrasound service revenue",
    totals: ["Baseline", "+6%", "+12%", "+18%", "+24%"],
  },
} as const;
type UpgradeRoomId = keyof typeof ladders;

test.setTimeout(120_000);
test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));
test.beforeEach(({ page }, info) => {
  test.skip(!["desktop-chrome", "phone-chrome"].includes(info.project.name));
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(({ page }) => expect(pageErrors.get(page) ?? []).toEqual([]));

async function readState(page: Page): Promise<GameState> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((entry) => entry.campaignId === profile.activeCampaignId)!;
  return deserializeGameState(campaign.serializedState);
}

function readerAssignments(state: GameState) {
  return state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist")
    .map((employee) => ({
      employeeId: employee.id, roomInstanceId: employee.homeRoomInstanceId,
      stationId: employee.readingStationId,
    })).sort((a, b) => a.employeeId.localeCompare(b.employeeId));
}

async function resumeCampaign(page: Page, name: string): Promise<void> {
  const resume = page.getByRole("button", { name: `Resume ${name}`, exact: true });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect.poll(() => page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    return Boolean(host?.__facilityGame);
  }), {
    timeout: 10_000,
    message: "Canvas upgrade checks require the DEV facility-gait-proof hook. Use the Playwright Vite dev server; a production preview does not expose it.",
  }).toBe(true);
  await page.waitForFunction((roomId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    return scene?.bridge?.viewModel?.rooms?.some((room: { instanceId: string }) => room.instanceId === roomId);
  }, ids.reading, { timeout: 10_000 });
}

async function install(page: Page, name: string) {
  await startClinic(page, "Upgrade Browser Founder", name);
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((entry) => entry.campaignId === profile.activeCampaignId)!;
  const original = deserializeGameState(campaign.serializedState);
  const state = createRoomUpgradeScenario(original);
  expect(state.campaignId).toBe(original.campaignId);
  expect(state.founder).toEqual(original.founder);
  campaign.serializedState = serializeGameState(state);
  profile.tutorialsEnabled = false;
  const marker = `gs038.upgrades.seed.${campaign.campaignId}`;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    localStorage.setItem(key, JSON.stringify(value));
    sessionStorage.setItem(marker, "1");
  }, { key: PROFILE_KEY, value: profile, marker });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await resumeCampaign(page, name);
  expect(await page.evaluate(() => location.origin)).toBe(
    new URL(process.env.GAMIFY_E2E_BASE_URL ?? "http://127.0.0.1:4173").origin,
  );
  const installed = await readState(page);
  expect(installed.campaignId).toBe(original.campaignId);
  expect(getFacilityAccessValidation(installed)).toMatchObject({ valid: true, issues: [] });
  const frozen = getRoomUpgradeFrozenQuantities(installed);
  expect(frozen.admittedIds).toEqual([ids.admittedPatient, ids.readingPatient].sort());
  expect(installed.operationReceipts[`fixture.admit.${ids.admittedPatient}`]?.status).toBe("applied");
  expect(frozen.fee).toMatchObject({ amount: 120, quote: { candidates: [{ upgradeLevel: 1 }] } });
  expect(frozen.reading).toMatchObject({ duration: 5, work: { boundUpgradeLevel: 1 } });
  expect(frozen.training).toMatchObject({ duration: 60, work: { boundUpgradeLevel: 1 } });
  const readers = readerAssignments(installed);
  expect(readers.map((reader) => reader.employeeId)).toEqual(
    [1, 2, 3, 4].map((number) => `employee.upgrades.reader.${number}`),
  );
  expect(readers.map((reader) => reader.stationId).sort()).toEqual([
    "northeast", "northwest", "southeast", "southwest",
  ]);
  expect(readers.every((reader) => reader.roomInstanceId === ids.reading)).toBe(true);
  return {
    name, marker, campaignId: installed.campaignId, frozen, readers,
    capacity: getWorkloadSnapshot(installed).routineLimit,
    patient: structuredClone(installed.encounters[ids.admittedPatient]!),
  };
}
type Installed = Awaited<ReturnType<typeof install>>;

async function expectPreserved(page: Page, baseline: Installed, patientUnchanged = true) {
  const state = await readState(page);
  expect(state.campaignId).toBe(baseline.campaignId);
  expect(state.paused).toBe(true);
  expect(getRoomUpgradeFrozenQuantities(state)).toEqual(baseline.frozen);
  expect(readerAssignments(state)).toEqual(baseline.readers);
  expect(getWorkloadSnapshot(state).routineLimit).toBe(baseline.capacity);
  if (patientUnchanged) expect(state.encounters[ids.admittedPatient]).toEqual(baseline.patient);
  expect(state.rooms.find((room) => room.id === ids.waitingCopy)?.upgradeLevel).toBe(1);
  return state;
}

function ownedRow(page: Page, roomId: string): Locator {
  return page.locator(`.build-owned-row[data-room-instance-id='${roomId}']`);
}

async function showMyRooms(page: Page) {
  await page.getByRole("tab", { name: /^My Rooms/ }).click();
  await expect(ownedRow(page, ids.waiting)).toBeVisible();
}

async function expectWaitingCopy(page: Page) {
  const row = ownedRow(page, ids.waitingCopy);
  await expect(row).toContainText("Now Baseline → Next +2 points");
  await expect(row.getByRole("button", { name: "Upgrade Waiting Room B for $110", exact: true })).toBeEnabled();
}

async function expectBenefit(container: Locator, roomId: UpgradeRoomId, purchases: number) {
  const ladder = ladders[roomId];
  await expect(container).toContainText(ladder.benefit);
  await expect(container).toContainText(`Now ${ladder.totals[purchases]}`);
  if (purchases < 4) await expect(container).toContainText(`→ Next ${ladder.totals[purchases + 1]}`);
  else {
    await expect(container).toContainText("MAX");
    await expect(container).not.toContainText("→ Next");
    await expect(container.getByRole("button", { name: /^Upgrade / })).toHaveCount(0);
  }
}

async function purchase(
  page: Page, baseline: Installed, roomId: UpgradeRoomId,
  purchaseIndex: number, control: "row" | "menu",
) {
  const ladder = ladders[roomId];
  const container = control === "row" ? ownedRow(page, roomId) : page.locator(".room-action-menu");
  await expectBenefit(container, roomId, purchaseIndex);
  const price = ladder.prices[purchaseIndex]!;
  const priceLabel = `$${price.toLocaleString("en-US")}`;
  const button = container.getByRole("button", {
    name: control === "row"
      ? `Upgrade ${ladder.name} for ${priceLabel}`
      : `Upgrade to ★${purchaseIndex + 2} · ${priceLabel}`,
    exact: true,
  });
  const before = await readState(page);
  await expect(button).toBeEnabled();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect.poll(async () => {
    const state = await readState(page);
    return { level: state.rooms.find((room) => room.id === roomId)!.upgradeLevel, cash: state.cashCents };
  }).toEqual({ level: purchaseIndex + 2, cash: before.cashCents - price * 100 });
  await expectBenefit(container, roomId, purchaseIndex + 1);
  if (purchaseIndex < 3) {
    const next = `$${ladder.prices[purchaseIndex + 1]!.toLocaleString("en-US")}`;
    await expect(container.getByRole("button", {
      name: control === "row" ? `Upgrade ${ladder.name} for ${next}` : `Upgrade to ★${purchaseIndex + 3} · ${next}`,
      exact: true,
    })).toBeEnabled();
  }
  await expectPreserved(page, baseline);
  await expectWaitingCopy(page);
}

/** Read-only camera/geometry framing; selection itself is an ordinary canvas click. */
async function frameRoom(page: Page, roomId: string) {
  return page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    const room = scene?.bridge?.viewModel?.rooms?.find((entry: { instanceId: string }) => entry.instanceId === id);
    if (!scene || !room) throw new Error(`Missing live room ${id}`);
    scene.applyCamera({ ...scene.cameraView, zoom: 2, panX: 0, panY: 0 });
    const layout = scene.layout;
    scene.applyCamera({
      ...scene.cameraView,
      panX: scene.scale.width / 2 - (layout.originX + (room.tileX + room.width / 2) * layout.tileSize),
      panY: scene.scale.height * 0.7 - (layout.originY + (room.tileY + room.height / 2) * layout.tileSize),
    });
    scene.refreshLayout(true);
    return {
      x: scene.layout.originX + (room.tileX + room.width / 2) * scene.layout.tileSize,
      y: scene.layout.originY + (room.tileY + room.height / 2) * scene.layout.tileSize,
    };
  }, roomId);
}

async function openMapMenu(page: Page, roomId: string) {
  const point = await frameRoom(page, roomId);
  await page.getByTestId("facility-canvas").click({ position: point });
  await expect(page.locator(".room-action-menu")).toBeVisible();
}

async function captureRoom(page: Page, info: TestInfo, roomId: string, label: string) {
  await frameRoom(page, roomId);
  await expect.poll(() => page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    const room = scene?.bridge?.viewModel?.rooms?.find((entry: any) => entry.instanceId === id);
    if (!room || !scene.environmentAtlasReady || scene.environmentAtlasLoadRequested ||
      scene.characterStillLoadRequested || scene.pendingCharacterStills.size > 0) return false;
    const records = scene.getTouchupDrawRecords(room);
    const fixtures = [...scene.fixtureBitmapImages.entries()]
      .filter(([key]: [string, any]) => key.startsWith(`approved:${id}:`));
    const staff = scene.bridge.viewModel.staff.filter((employee: any) => employee.location &&
      employee.location.x >= room.tileX && employee.location.x < room.tileX + room.width &&
      employee.location.y >= room.tileY && employee.location.y < room.tileY + room.height);
    return records.length > 0 && records.every((record: any) =>
      scene.textures.exists(`stitchin-time-art:${record.assetId}`)) &&
      fixtures.some(([, image]: [string, any]) => image.visible) && staff.every((employee: any) => {
        const container = scene.characterBitmapContainers.get(`character:staff:${employee.instanceId}`);
        const actor = container?.getByName("actor");
        return container?.visible && actor?.visible && actor.getData("gait-still-id") &&
          scene.textures.exists(actor.texture.key);
      });
  }, roomId), { timeout: 30_000, message: `Wait for loaded room and character art before ${label}` }).toBe(true);
  const readyFrame = await page.evaluate(() => (document.querySelector("[data-testid='facility-canvas']") as any)
    .__facilityGame.loop.frame);
  await page.waitForFunction((frame) => (document.querySelector("[data-testid='facility-canvas']") as any)
    .__facilityGame.loop.frame > frame, readyFrame, { timeout: 5_000 });
  await page.getByTestId("facility-canvas").screenshot({
    path: join(evidenceDirectory, `${info.project.name}-${label}.png`), animations: "disabled",
  });
}

async function exitBuild(page: Page) {
  await page.getByRole("button", { name: "Done / Save", exact: true }).click();
  await expect(page.getByRole("button", { name: "Enter Build Mode", exact: true })).toBeVisible();
}

async function reloadAndCheck(page: Page, baseline: Installed, expectedCash: number) {
  await page.reload();
  await resumeCampaign(page, baseline.name);
  expect(await page.evaluate((marker) => sessionStorage.getItem(marker), baseline.marker)).toBe("1");
  const state = await expectPreserved(page, baseline);
  expect(state.cashCents).toBe(expectedCash);
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, issues: [] });
  return state;
}

async function expectFourReaderPosts(page: Page, baseline: Installed) {
  const state = await expectPreserved(page, baseline);
  const read = state.serviceOperations.find((operation) => operation.id === baseline.frozen.reading.id)!;
  expect(read).toMatchObject({ status: "in_service", reservedRoomInstanceIds: [ids.reading] });
  const resource = read.diagnosticPhaseWork!.resource!;
  expect(resource.employeeIds).toHaveLength(1);
  expect(resource.employeeIds).toEqual(read.reservedEmployeeIds);
  const reader = state.employees.find((employee) => employee.id === resource.employeeIds[0])!;
  const station = getRadiologistReadingStation(state, reader, PROTOTYPE_DOMAIN_CONTEXT)!;
  expect(resource.roomInstanceId).toBe(ids.reading);
  expect(station.roomInstanceId).toBe(ids.reading);
  expect(station.station.id).toBe(resource.stationId);
  expect(resource.stationId).toBe(reader.readingStationId);
  expect(resource.staffAnchor).toEqual(station.location);
  expect(reader.location).toEqual(resource.staffAnchor);
  expect(reader.path.at(-1)).toEqual(resource.staffAnchor);
  expect(reader.pathIndex).toBe(reader.path.length - 1);
  expect(reader.facilityTask).toMatchObject({ kind: "perform_service", targetId: read.id });
  // Idle staff can be between furniture contacts. Saved post assignments and
  // live identities stay fixed; the reader actually doing work must be seated.
  await expect.poll(() => page.evaluate((readerId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const staff = scene?.bridge?.viewModel?.staff ?? [];
    const active = staff.find((employee: any) => employee.instanceId === readerId);
    const actor = host?.__facilityGaitSnapshot?.()[`character:staff:${readerId}`];
    return {
      readers: staff.filter((employee: any) => employee.staffRoleDefinitionId === "staff.radiologist")
        .map((employee: any) => ({ employeeId: employee.instanceId, roomInstanceId: employee.homeRoomInstanceId }))
        .sort((a: any, b: any) => a.employeeId.localeCompare(b.employeeId)),
      active: active && { location: active.location, moving: active.moving,
        supportRole: active.supportRole, supportId: active.supportId, supportRoomInstanceId: active.supportRoomInstanceId },
      actor: actor && { visible: actor.visible, pose: actor.pose,
        supportRole: actor.supportRole, supportId: actor.supportId, supportRoomInstanceId: actor.supportRoomInstanceId },
    };
  }, reader.id)).toEqual({
    readers: baseline.readers.map(({ employeeId, roomInstanceId }) => ({ employeeId, roomInstanceId })),
    active: { location: resource.staffAnchor, moving: false, supportRole: "reading-radiologist",
      supportId: resource.stationId, supportRoomInstanceId: ids.reading },
    actor: { visible: true, pose: "seated", supportRole: "reading-radiologist",
      supportId: resource.stationId, supportRoomInstanceId: ids.reading },
  });
}

test("satisfaction upgrades use ordinary list/menu controls, refund Undo and preserve the admitted patient across reload", async ({ page }, info) => {
  const baseline = await install(page, "GS038 satisfaction upgrades");
  await captureRoom(page, info, ids.waiting, "waiting-before");
  await page.getByRole("button", { name: "Enter Build Mode", exact: true }).click();
  await showMyRooms(page);
  await expectWaitingCopy(page);
  const initialCash = (await readState(page)).cashCents;
  await purchase(page, baseline, ids.waiting, 0, "row");
  await page.getByRole("button", { name: /^Undo(?::|$)/ }).click();
  await expect.poll(async () => {
    const state = await readState(page);
    return { level: state.rooms.find((room) => room.id === ids.waiting)!.upgradeLevel, cash: state.cashCents };
  }).toEqual({ level: 1, cash: initialCash });
  await expectBenefit(ownedRow(page, ids.waiting), ids.waiting, 0);
  await expectPreserved(page, baseline);
  await openMapMenu(page, ids.waiting);
  const menu = page.locator(".room-action-menu");
  await expect(menu).toContainText("Level 1 of 5");
  await expect(menu.getByRole("button", { name: "Edit doors for Waiting Room A", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: "Move", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: /^Sell/ })).toBeVisible();
  for (let index = 0; index < 4; index++) await purchase(page, baseline, ids.waiting, index, "menu");
  await menu.getByRole("button", { name: "Close room menu", exact: true }).click();
  for (let index = 0; index < 4; index++) await purchase(page, baseline, ids.examination, index, "row");
  const finalCash = initialCash - (890 + 740) * 100;
  expect((await readState(page)).cashCents).toBe(finalCash);
  await exitBuild(page);
  await captureRoom(page, info, ids.waiting, "waiting-after");
  const restored = await reloadAndCheck(page, baseline, finalCash);
  expect(restored.rooms.find((room) => room.id === ids.examination)?.upgradeLevel).toBe(5);
  expect(restored.rooms.find((room) => room.id === ids.waiting)?.upgradeLevel).toBe(5);
  await page.getByRole("button", { name: "Enter Build Mode", exact: true }).click();
  await showMyRooms(page);
  await expectBenefit(ownedRow(page, ids.examination), ids.examination, 4);
  await expectWaitingCopy(page);
  await openMapMenu(page, ids.waiting);
  await expectBenefit(page.locator(".room-action-menu"), ids.waiting, 4);
  await page.screenshot({ path: join(evidenceDirectory, `${info.project.name}-satisfaction-max-reloaded.png`), animations: "disabled" });
});

test("Reading, training and revenue purchases preserve old work and new chart orders use the upgraded rooms", async ({ page }, info) => {
  const baseline = await install(page, "GS038 work upgrades");
  await captureRoom(page, info, ids.reading, "reading-before");
  await expectFourReaderPosts(page, baseline);
  await page.getByRole("button", { name: "Enter Management Mode", exact: true }).click();
  const readerRole = page.locator("[data-staff-role-id='staff.radiologist']");
  await expect(readerRole).toContainText("4/4");
  await expect(readerRole.locator("[data-staff-role-hire]")).toBeDisabled();
  const originalCash = (await readState(page)).cashCents;
  await page.locator(".management-panel").getByRole("button", { name: "Done", exact: true }).click();
  expect((await readState(page)).cashCents).toBe(originalCash);
  await page.getByRole("button", { name: "Enter Build Mode", exact: true }).click();
  const construction = page.locator("[data-room-definition-id='room.reading']");
  await expect(construction).toContainText("$1,800");
  await expect(construction).toContainText("$24 upkeep / hr");
  await expect(construction).toContainText("4 × 4 tiles · 4 reading positions");
  await showMyRooms(page);
  await openMapMenu(page, ids.reading);
  for (let index = 0; index < 4; index++) await purchase(page, baseline, ids.reading, index, "menu");
  await page.locator(".room-action-menu").getByRole("button", { name: "Close room menu", exact: true }).click();
  for (const roomId of [ids.training, ids.revenue] as const) {
    for (let index = 0; index < 4; index++) await purchase(page, baseline, roomId, index, "row");
  }
  const finalCash = originalCash - (3465 + 1260 + 1840) * 100;
  expect((await readState(page)).cashCents).toBe(finalCash);
  await exitBuild(page);
  await expectFourReaderPosts(page, baseline);
  await captureRoom(page, info, ids.reading, "reading-after");
  const restored = await reloadAndCheck(page, baseline, finalCash);
  for (const roomId of [ids.reading, ids.training, ids.revenue]) {
    expect(restored.rooms.find((room) => room.id === roomId)?.upgradeLevel).toBe(5);
  }
  await expectFourReaderPosts(page, baseline);
  await page.getByRole("button", { name: "Enter Management Mode", exact: true }).click();
  const reception = page.locator("[data-staff-role-id='staff.receptionist']");
  const toggle = reception.locator(".staff-role-toggle");
  if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
  await expect(page.locator(`[data-employee-id='${ids.trainingEmployee}'] .staff-training-status`))
    .toContainText("Walking to training");
  await expect(page.locator(`[data-employee-id='${ids.trainingEmployee}'] .staff-training-status`))
    .toContainText("1 hour session");
  await page.locator(".management-panel").getByRole("button", { name: "Done", exact: true }).click();
  await page.locator(".patient-tab").filter({ hasText: "Upgrade Admitted Patient" }).click();
  const chart = page.locator(".chart-sheet");
  await expect(chart).toBeVisible();
  await chart.getByRole("button", { name: /Order targeted breast ultrasound/ }).click();
  const enact = chart.getByRole("button", { name: "Enact Plan", exact: true });
  if (await enact.isVisible()) await enact.click();
  await expect.poll(async () => getDiagnosticOrderPlans(await readState(page))
    .some((plan) => plan.encounterId === ids.admittedPatient)).toBe(true);
  const accepted = await expectPreserved(page, baseline, false);
  const plan = getDiagnosticOrderPlans(accepted).find((entry) => entry.encounterId === ids.admittedPatient)!;
  const interpretation = plan.phases.find((phase) => phase.kind === "interpretation")!;
  expect(interpretation.readingUpgradeWork?.acceptedRooms).toEqual([{ roomInstanceId: ids.reading, upgradeLevel: 5 }]);
  expect(interpretation.durationMinutes).toBe(3);
  expect(plan.sources[0]!.roomUpgradeRevenue).toMatchObject({
    baseFee: 120, candidates: [{ roomInstanceId: ids.revenue, upgradeLevel: 5, multiplier: 1.24 }],
  });
  expect(accepted.cashCents).toBe(finalCash);
  await page.locator(".patient-tab").filter({ hasText: "Upgrade Admitted Patient" }).click();
  await expect(chart).toBeVisible();
  const pendingInterpretation = chart.locator(".cs-phases li").filter({ hasText: "Interpretation" }).first();
  await expect(pendingInterpretation).toContainText("(onsite)");
  await expect(pendingInterpretation.locator(".cs-phase-progress")).toContainText("min remaining");
  await pendingInterpretation.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(evidenceDirectory, `${info.project.name}-new-upgraded-order.png`), animations: "disabled" });
});
