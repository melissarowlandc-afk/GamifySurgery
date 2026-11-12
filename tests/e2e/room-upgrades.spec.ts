import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, getDiagnosticOrderPlans, getFacilityAccessValidation,
  getRadiologistReadingStation, getRoomDefinition,
  getWorkloadSnapshot, serializeGameState, type GameState,
} from "@gamify-surgery/game-domain";
import { PROFILE_KEY, getProfile, resumeLocalCampaign, startClinic } from "./helpers";
import { readDurableLocalState } from "./ui-density-helpers";
import {
  createRoomUpgradeScenario, getRoomUpgradeFrozenQuantities,
  roomUpgradeScenarioIds as ids,
} from "./fixtures/roomUpgradeScenario";

const evidenceDirectory = resolve(
  process.env.GAMIFY_E2E_SCREENSHOT_DIR ?? ".local-dev/gs038-room-upgrades/browser",
);
const pageErrors = new WeakMap<Page, string[]>();
const phonePages = new WeakSet<Page>();
const ladders = {
  [ids.waiting]: {
    name: "Waiting Room A", prices: [110, 170, 300, 505],
    benefit: "+2 satisfaction points for waiting patients",
    totals: ["Baseline", "+2 points", "+4 points", "+6 points", "+8 points"],
  },
  [ids.examination]: {
    name: "Examination Room", prices: [90, 140, 250, 420],
    benefit: "+2 satisfaction points after examination",
    totals: ["Baseline", "+2 points", "+4 points", "+6 points", "+8 points"],
  },
  [ids.reading]: {
    name: "Radiology Reading Room", prices: [450, 675, 1190, 1890],
    benefit: "Scan reading takes 10% less time",
    totals: ["Baseline", "10% less time", "20% less time", "30% less time", "40% less time"],
  },
  [ids.training]: {
    name: "Training Room", prices: [165, 245, 430, 685],
    benefit: "Training sessions take 10% less time",
    totals: ["Baseline", "10% less time", "20% less time", "30% less time", "40% less time"],
  },
  [ids.revenue]: {
    name: "Ultrasound Room", prices: [240, 360, 630, 1000],
    benefit: "+6% ultrasound service revenue",
    totals: ["Baseline", "+6%", "+12%", "+18%", "+24%"],
  },
} as const;
type UpgradeRoomId = keyof typeof ladders;

test.setTimeout(120_000);
test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));
test.beforeEach(({ page }, info) => {
  if (info.project.name === "phone-chrome") phonePages.add(page);
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(({ page }) => expect(pageErrors.get(page) ?? []).toEqual([]));

async function readState(page: Page): Promise<GameState> {
  return readDurableLocalState(page);
}

async function enterBuild(page: Page) {
  await page.getByRole("button", { name: phonePages.has(page) ? "Build" : "Enter Build Mode", exact: true }).click();
  await expect(page.locator(phonePages.has(page) ? ".mobile-build-catalog" : ".build-mode-panel")).toBeVisible();
}

async function enterManagement(page: Page) {
  await page.getByRole("button", { name: phonePages.has(page) ? "Manage" : "Enter Management Mode", exact: true }).click();
  await expect(page.locator(phonePages.has(page) ? ".mobile-manage" : ".management-panel")).toBeVisible();
}

async function exitManagement(page: Page) {
  await page.locator(phonePages.has(page) ? ".mobile-manage" : ".management-panel")
    .getByRole("button", { name: phonePages.has(page) ? "Close Manage" : "Done", exact: true }).click();
}

const menuFor = (page: Page) => page.locator(phonePages.has(page) ? ".mobile-build-room" : ".room-action-menu");

async function closeRoomMenu(page: Page) {
  if (phonePages.has(page)) {
    await page.locator(".mobile-sheet:has(.mobile-build-room)").getByRole("button", { name: /^Close / }).click();
    await page.getByRole("button", { name: "Room catalog", exact: true }).click();
    await showMyRooms(page);
    await expectWaitingCopy(page);
  } else await menuFor(page).getByRole("button", { name: "Close room menu", exact: true }).click();
}

async function openAdmittedChart(page: Page) {
  if (phonePages.has(page)) {
    if (!await page.getByRole("dialog", { name: "Patients", exact: true }).isVisible()) {
      await page.locator(".mobile-tab-bar").getByRole("button", { name: /^Patients(,|$)/ }).click();
    }
    await page.locator(`.mobile-patient-card[data-patient-id='${ids.admittedPatient}']`).click();
  } else await page.locator(".patient-tab").filter({ hasText: "Upgrade Admitted Patient" }).click();
  const chart = page.locator(phonePages.has(page) ? '.mobile-sheet[aria-label="Patient chart"]' : ".chart-sheet");
  await expect(chart).toBeVisible(); return chart;
}

function readerAssignments(state: GameState) {
  return state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist")
    .map((employee) => ({
      employeeId: employee.id, roomInstanceId: employee.homeRoomInstanceId,
      stationId: employee.readingStationId,
    })).sort((a, b) => a.employeeId.localeCompare(b.employeeId));
}

async function resumeCampaign(page: Page, name: string): Promise<void> {
  await resumeLocalCampaign(page, name);
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
  return page.locator(phonePages.has(page)
    ? `.mobile-owned-build-card:has([data-build-owned-room='${roomId}'])`
    : `.build-owned-row[data-room-instance-id='${roomId}']`);
}

async function showMyRooms(page: Page) {
  await page.getByRole("tab", { name: /^My Rooms/ }).click();
  await expect(ownedRow(page, ids.waiting)).toBeVisible();
}

async function expectWaitingCopy(page: Page) {
  const row = ownedRow(page, ids.waitingCopy);
  await expect(row).toContainText(phonePages.has(page) ? "Tier 1/5" : "Now Baseline → Next +2 points");
  const upgrade = row.getByRole("button", { name: phonePages.has(page) ? "Upgrade Waiting Room B" : "Upgrade Waiting Room B for $110", exact: true });
  await expect(upgrade).toBeEnabled(); await expect(upgrade).toContainText("$110");
}

async function expectBenefit(container: Locator, roomId: UpgradeRoomId, purchases: number) {
  const ladder = ladders[roomId];
  if (await container.evaluate(node => node.classList.contains("mobile-owned-build-card"))) {
    // The native compact row exposes the current tier/benefit and next price;
    // the room detail below separately checks the full per-upgrade/next copy.
    await expect(container).toContainText(`Tier ${purchases + 1}/5`);
    await expect(container).toContainText(ladder.totals[purchases]!);
    if (purchases === 4) await expect(container.getByRole("button", { name: /^Upgrade / })).toHaveCount(0);
    return;
  }
  await expect(container).toContainText(ladder.benefit);
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  await expect(container).toContainText(new RegExp(`Now:?\\s*${escape(ladder.totals[purchases]!)}`));
  if (purchases < 4) await expect(container).toContainText(new RegExp(`→ Next:?\\s*${escape(ladder.totals[purchases + 1]!)}`));
  else {
    await expect(container).toContainText("MAX");
    await expect(container).not.toContainText("→ Next");
    await expect(container.getByRole("button", { name: /^Upgrade to ★/ })).toHaveCount(0);
  }
}

async function purchase(
  page: Page, baseline: Installed, roomId: UpgradeRoomId,
  purchaseIndex: number, control: "row" | "menu",
) {
  const ladder = ladders[roomId];
  const container = control === "row" ? ownedRow(page, roomId) : menuFor(page);
  await expectBenefit(container, roomId, purchaseIndex);
  const price = ladder.prices[purchaseIndex]!;
  const priceLabel = `$${price.toLocaleString("en-US")}`;
  const button = container.getByRole("button", {
    name: control === "row"
      ? phonePages.has(page) ? `Upgrade ${ladder.name}` : `Upgrade ${ladder.name} for ${priceLabel}`
      : `Upgrade to ★${purchaseIndex + 2} · ${priceLabel}`,
    exact: true,
  });
  const before = await readState(page);
  await expect(button).toBeEnabled();
  await expect(button).toContainText(priceLabel);
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect.poll(async () => {
    const state = await readState(page);
    return { level: state.rooms.find((room) => room.id === roomId)!.upgradeLevel, cash: state.cashCents };
  }).toEqual({ level: purchaseIndex + 2, cash: before.cashCents - price * 100 });
  await expectBenefit(container, roomId, purchaseIndex + 1);
  if (purchaseIndex < 3) {
    const next = `$${ladder.prices[purchaseIndex + 1]!.toLocaleString("en-US")}`;
    const nextButton = container.getByRole("button", {
      name: control === "row" ? phonePages.has(page) ? `Upgrade ${ladder.name}` : `Upgrade ${ladder.name} for ${next}` : `Upgrade to ★${purchaseIndex + 3} · ${next}`,
      exact: true,
    });
    await expect(nextButton).toBeEnabled();
    await expect(nextButton).toContainText(next);
  }
  await expectPreserved(page, baseline);
  // The native room sheet replaces the catalog rather than keeping two menus
  // mounted. expectPreserved checks the untouched second room on every purchase;
  // closeRoomMenu checks its complete visible summary again on returning.
  if (!phonePages.has(page) || control === "row") await expectWaitingCopy(page);
}

/** Read-only camera/geometry framing; selection itself is an ordinary canvas click. */
async function frameRoom(page: Page, roomId: string) {
  await expect.poll(() => page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)
      ?.__facilityGame?.scene?.getScene("facility-scene");
    return Boolean(scene?.layout && scene.bridge?.viewModel?.rooms?.some((room: any) => room.instanceId === id));
  }, roomId)).toBe(true);
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
  if (phonePages.has(page)) {
    const catalog = page.locator('.mobile-sheet[aria-label="Build"]');
    if (await catalog.isVisible()) await catalog.getByRole("button", { name: "Close Build", exact: true }).click();
  }
  const point = await frameRoom(page, roomId);
  await page.getByTestId("facility-canvas").click({ position: point });
  await expect(menuFor(page)).toBeVisible();
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
  if (phonePages.has(page)) {
    const sheet = page.locator(".mobile-sheet:has(.mobile-build-catalog), .mobile-sheet:has(.mobile-build-room)");
    if (await sheet.isVisible()) await sheet.getByRole("button", { name: /^Close / }).click();
  }
  await page.getByRole("button", { name: phonePages.has(page) ? "Done" : "Done / Save", exact: true }).click();
  await expect(page.getByRole("button", { name: phonePages.has(page) ? "Resume facility time" : "Enter Build Mode", exact: true })).toBeEnabled();
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
  await enterBuild(page);
  await showMyRooms(page);
  await expectWaitingCopy(page);
  const initialCash = (await readState(page)).cashCents;
  await purchase(page, baseline, ids.waiting, 0, "row");
  await page.getByRole("button", { name: phonePages.has(page) ? /^Undo \(\d+\)$/ : /^Undo(?::|$)/ }).click();
  await expect.poll(async () => {
    const state = await readState(page);
    return { level: state.rooms.find((room) => room.id === ids.waiting)!.upgradeLevel, cash: state.cashCents };
  }).toEqual({ level: 1, cash: initialCash });
  await expectBenefit(ownedRow(page, ids.waiting), ids.waiting, 0);
  await expectPreserved(page, baseline);
  await openMapMenu(page, ids.waiting);
  const menu = menuFor(page);
  await expect(menu).toContainText(phonePages.has(page) ? "Tier 1/5" : "Level 1 of 5");
  await expect(menu.getByRole("button", { name: phonePages.has(page) ? "Doors" : "Edit doors for Waiting Room A", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: "Move", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: /^Sell/ })).toBeVisible();
  for (let index = 0; index < 4; index++) await purchase(page, baseline, ids.waiting, index, "menu");
  await closeRoomMenu(page);
  for (let index = 0; index < 4; index++) await purchase(page, baseline, ids.examination, index, "row");
  const finalCash = initialCash - (1085 + 900) * 100;
  expect((await readState(page)).cashCents).toBe(finalCash);
  await exitBuild(page);
  await captureRoom(page, info, ids.waiting, "waiting-after");
  const restored = await reloadAndCheck(page, baseline, finalCash);
  expect(restored.rooms.find((room) => room.id === ids.examination)?.upgradeLevel).toBe(5);
  expect(restored.rooms.find((room) => room.id === ids.waiting)?.upgradeLevel).toBe(5);
  await enterBuild(page);
  await showMyRooms(page);
  await expectBenefit(ownedRow(page, ids.examination), ids.examination, 4);
  await expectWaitingCopy(page);
  await openMapMenu(page, ids.waiting);
  await expectBenefit(menuFor(page), ids.waiting, 4);
  await page.screenshot({ path: join(evidenceDirectory, `${info.project.name}-satisfaction-max-reloaded.png`), animations: "disabled" });
});

test("Reading, training and revenue purchases preserve old work and new chart orders use the upgraded rooms", async ({ page }, info) => {
  const baseline = await install(page, "GS038 work upgrades");
  await captureRoom(page, info, ids.reading, "reading-before");
  await expectFourReaderPosts(page, baseline);
  await enterManagement(page);
  if (phonePages.has(page)) await page.locator(".mobile-manage-grid [data-staff-role-id='staff.radiologist']").click();
  const readerRole = page.locator(phonePages.has(page) ? ".mobile-manage-card[data-staff-role-id='staff.radiologist']" : "[data-staff-role-id='staff.radiologist']");
  await expect(readerRole).toContainText("4/4");
  await expect(readerRole.locator(phonePages.has(page) ? "[data-phone-anchor='hire']" : "[data-staff-role-hire]")).toBeDisabled();
  const originalCash = (await readState(page)).cashCents;
  await exitManagement(page);
  expect((await readState(page)).cashCents).toBe(originalCash);
  await enterBuild(page);
  const construction = phonePages.has(page)
    ? page.locator(".mobile-build-card:has([data-build-room-option='room.reading'])")
    : page.locator("[data-room-definition-id='room.reading']");
  await expect(construction).toContainText("$1,800");
  const readingUpkeep = getRoomDefinition("room.reading")!.upkeepPerExpenseInterval;
  // Old copy hardcoded $24 before the balance change to $6. Check the exact
  // shipped rule, retaining every upgrade price below.
  if (phonePages.has(page)) {
    await construction.locator("summary[aria-label='Details about Radiology Reading Room']").click();
  }
  await expect(construction).toContainText(`$${readingUpkeep} upkeep / hr`);
  await expect(construction).toContainText("4 × 4 tiles · 4 reading positions");
  await showMyRooms(page);
  await openMapMenu(page, ids.reading);
  for (let index = 0; index < 4; index++) await purchase(page, baseline, ids.reading, index, "menu");
  await closeRoomMenu(page);
  for (const roomId of [ids.training, ids.revenue] as const) {
    for (let index = 0; index < 4; index++) await purchase(page, baseline, roomId, index, "row");
  }
  const finalCash = originalCash - (4205 + 1525 + 2230) * 100;
  expect((await readState(page)).cashCents).toBe(finalCash);
  await exitBuild(page);
  await expectFourReaderPosts(page, baseline);
  await captureRoom(page, info, ids.reading, "reading-after");
  const restored = await reloadAndCheck(page, baseline, finalCash);
  for (const roomId of [ids.reading, ids.training, ids.revenue]) {
    expect(restored.rooms.find((room) => room.id === roomId)?.upgradeLevel).toBe(5);
  }
  await expectFourReaderPosts(page, baseline);
  await enterManagement(page);
  if (phonePages.has(page)) {
    await page.locator(".mobile-manage-grid [data-staff-role-id='staff.receptionist']").click();
    await page.locator(`.mobile-manage-portraits [data-employee-id='${ids.trainingEmployee}']`).click();
  } else {
    const toggle = page.locator("[data-staff-role-id='staff.receptionist'] .staff-role-toggle");
    if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
  }
  const trainingStatus = page.locator(`[data-employee-id='${ids.trainingEmployee}'] ${phonePages.has(page) ? ".mobile-manage-training" : ".staff-training-status"}`);
  await expect(trainingStatus)
    .toContainText("Walking to training");
  await expect(trainingStatus)
    .toContainText("1 hour session");
  await exitManagement(page);
  const chart = await openAdmittedChart(page);
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
  if (phonePages.has(page)) {
    // Enact Plan returns the phone to Patients automatically. There is no chart
    // left to close; assert that transition before reopening its pending order.
    await expect(chart).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Patients", exact: true })).toBeVisible();
  }
  await openAdmittedChart(page);
  await expect(chart).toBeVisible();
  const pendingInterpretation = chart.locator(phonePages.has(page) ? ".mobile-chart-phases li" : ".cs-phases li").filter({ hasText: "Interpretation" }).first();
  await expect(pendingInterpretation).toContainText("(onsite)");
  await expect(pendingInterpretation.locator(phonePages.has(page) ? "span" : ".cs-phase-progress")).toContainText("min remaining");
  await pendingInterpretation.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(evidenceDirectory, `${info.project.name}-new-upgraded-order.png`), animations: "disabled" });
});
