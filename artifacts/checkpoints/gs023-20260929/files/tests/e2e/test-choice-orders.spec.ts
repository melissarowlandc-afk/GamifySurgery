import { expect, test, type Page } from "@playwright/test";
import {
  gameReducer,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
} from "@gamify-surgery/game-domain";
import { mkdirSync } from "node:fs";
import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

const SHOTS = ".local-dev/test-choice-browser/screenshots";
test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));

async function installSeed(page: Page, state: GameState, name: string, marker: string) {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId)!;
  campaign.name = name; campaign.serializedState = JSON.stringify(state); profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1"); localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

function seedCase(state: GameState, caseId: string, encounterId: string, nodeIndex?: number) {
  const next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `${encounterId}.admit`, encounterId, caseId, patientDisplayName: `${encounterId} Patient`, arrivalClass: "routine" });
  const encounter = next.encounters[encounterId]!;
  const index = nodeIndex ?? encounter.frozenCase.decisionNodes.length - 1;
  const exam = next.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
  encounter.currentNodeIndex = index;
  encounter.steps.forEach((step, i) => { step.status = i < index ? "completed" : i === index ? "action_required" : "locked"; });
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "primary");
  encounter.assignedRoomInstanceId = exam.id; encounter.queuedCareRoomInstanceId = null; encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in"; encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = null; next.attendedEncounterId = null; return next;
}

async function prepare(page: Page, name: string, caseId: string, encounterId: string, nodeIndex?: number) {
  await startClinic(page, `${name} Founder`, name);
  const state = (await getActiveState(page)) as unknown as GameState;
  state.facilityLevel = 2; state.cash = 20_000; state.cashCents = 2_000_000; state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER; state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false; state.encounters = {}; state.serviceOperations = [];
  state.openChartEncounterId = null; state.attendedEncounterId = null;
  state.environment.founderActivity = null; state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    ...state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk"),
    { id: "order.exam", roomDefinitionId: "room.examination", x: 29, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "order.phleb", roomDefinitionId: "room.phlebotomy", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "order.ct", roomDefinitionId: "room.ct", x: 37, y: 21, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 10 }, (_, x) => ({ id: `order.hall.${x}`, roomDefinitionId: "room.hallway", x: 32 + x, y: 25, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    ...[24, 26, 27, 28].map((y) => ({ id: `order.vertical.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "order.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "order.front.hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "order.exam", roomId: "order.exam", side: "east", offset: 1, exterior: false },
    { id: "order.phleb", roomId: "order.phleb", side: "south", offset: 1, exterior: false },
    { id: "order.ct", roomId: "order.ct", side: "south", offset: 1, exterior: false },
  ];
  const employee = (id: string, role: string, home: string) => {
    const room = state.rooms.find((item) => item.id === home)!; const location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "primary");
    return { id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 90, trainingLevel: 1, homeRoomInstanceId: home, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null };
  };
  state.employees = [employee("employee.order.phleb", "staff.phlebotomist", "order.phleb"), employee("employee.order.imaging", "staff.imaging_technician", "order.ct")];
  const seeded = seedCase(state, caseId, encounterId, nodeIndex);
  await installSeed(page, seeded, name, `${encounterId}.seed`);
}

async function answer(page: Page, encounterId: string) {
  await page.getByText(`${encounterId} Patient`, { exact: true }).click();
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).openChartEncounterId, { timeout: 30_000 }).toBe(encounterId);
  const state = (await getActiveState(page)) as unknown as GameState;
  const node = state.encounters[encounterId]!.frozenCase.decisionNodes[state.encounters[encounterId]!.currentNodeIndex]!;
  const isFinalNode = state.encounters[encounterId]!.currentNodeIndex === state.encounters[encounterId]!.frozenCase.decisionNodes.length - 1;
  const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", { name: new RegExp(`^${correct.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  if (node.resultGateAfter || !isFinalNode) {
    await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
    const close = page.getByRole("button", { name: "Return to clinic", exact: true });
    if (await close.isVisible()) await close.click();
  } else await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
}

async function run(page: Page, speed: "1x" | "4x" = "4x") {
  await page.getByRole("button", { name: `Set facility speed to ${speed}` }).click();
  await page.getByRole("button", { name: "Resume facility time" }).click();
}
async function pause(page: Page) { const button = page.getByRole("button", { name: "Pause facility time" }); if (await button.isVisible()) await button.click(); }
async function centerRoom(page: Page, id: string) {
  await page.evaluate((roomId) => { const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene"); const room = scene?.bridge?.viewModel?.rooms?.find((item: any) => item.instanceId === roomId); if (!scene || !room) throw new Error(`Missing ${roomId}`); scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 }); const l = scene.layout; scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - (l.originX + (room.tileX + room.width / 2) * l.tileSize), panY: scene.scale.height / 2 - (l.originY + (room.tileY + room.height / 2) * l.tileSize) }); scene.refreshLayout(true); scene.drawCharacters(); }, id);
}

async function live(page: Page, encounterId: string) {
  return page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene");
    const graphic = (key: string) => { const item = scene?.characterBitmapContainers?.get(key); return item ? { visible: item.visible, x: item.x, y: item.y } : null; };
    return { patient: graphic(`character:patient:${id}`), staff: graphic("character:staff:employee.order.phleb"), tech: graphic("character:staff:employee.order.imaging"), rooms: scene?.bridge?.viewModel?.rooms, layout: scene?.layout };
  }, encounterId);
}
function inRoom(actor: any, rooms: any[], layout: any, id: string) {
  const room = rooms.find((item: any) => item.instanceId === id)!;
  expect(actor).toMatchObject({ visible: true });
  expect(actor.x).toBeGreaterThan(layout.originX + room.tileX * layout.tileSize);
  expect(actor.x).toBeLessThan(layout.originX + (room.tileX + room.width) * layout.tileSize);
  expect(actor.y).toBeGreaterThan(layout.originY + room.tileY * layout.tileSize);
  expect(actor.y).toBeLessThan(layout.originY + (room.tileY + room.height + 1) * layout.tileSize);
}

test("terminal FHH collection holds filing, occupies phlebotomy for 15 minutes, and earns $50 once", async ({ page }) => {
  const id = "fhh-terminal"; await prepare(page, "FHH terminal order", "case.fhh.suggestive-results-confirmation", id); await answer(page, id);
  let state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[id]!.terminalTestOrder).toMatchObject({ status: "onsite_service" });
  expect(state.encounters[id]!.patientMovement).toBeNull();
  await run(page, "1x");
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; const op = s.serviceOperations.find((o) => o.actorId === id); return Boolean(op?.status === "in_service" && s.facilityTick >= op.phaseStartedAtFacilityTick! + 2 && s.facilityTick < op.phaseEndsAtFacilityTick!); }, { timeout: 45_000 }).toBe(true);
  state = (await getActiveState(page)) as unknown as GameState; const op = state.serviceOperations.find((o) => o.actorId === id)!;
  expect(op.phaseEndsAtFacilityTick! - op.phaseStartedAtFacilityTick!).toBe(15);
  const rendered = await live(page, id); inRoom(rendered.patient, rendered.rooms, rendered.layout, "order.phleb"); inRoom(rendered.staff, rendered.rooms, rendered.layout, "order.phleb");
  await centerRoom(page, "order.phleb"); await page.screenshot({ path: `${SHOTS}/fhh-phlebotomy-unpaused.png`, animations: "disabled" });
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((r) => r.actorId === id).length, { timeout: 45_000 }).toBe(1);
  await pause(page); state = (await getActiveState(page)) as unknown as GameState;
  expect(state.serviceIncomeReceipts.filter((r) => r.actorId === id)[0]!.grossAmount).toBe(50);
});

test("terminal CT acquisition occupies CT with the technician and credits after completion", async ({ page }) => {
  const id = "ct-terminal"; await prepare(page, "CT terminal order", "case.cushing-classification.progressive-features", id); await answer(page, id); await run(page);
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; return s.serviceOperations.some((o) => o.actorId === id && o.status === "in_service"); }, { timeout: 45_000 }).toBe(true);
  const rendered = await live(page, id); inRoom(rendered.patient, rendered.rooms, rendered.layout, "order.ct"); inRoom(rendered.tech, rendered.rooms, rendered.layout, "order.ct");
  await centerRoom(page, "order.ct"); await page.screenshot({ path: `${SHOTS}/ct-acquisition-unpaused.png`, animations: "disabled" });
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.some((r) => r.actorId === id), { timeout: 60_000 }).toBe(true);
});

test("FAP gated genetic order returns through Front Desk before its next authored node", async ({ page }) => {
  const id = "fap-gated"; await prepare(page, "FAP genetic order", "case.fap.new-parent", id, 0); await answer(page, id); await run(page);
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; return s.encounters[id]!.pendingResult?.routeId ?? null; }, { timeout: 20_000 }).toBe("route.genetic_testing.phlebotomy_sendout");
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; return s.encounters[id]!.currentNodeIndex > 0 && s.encounters[id]!.lifecycle === "active_action_required"; }, { timeout: 60_000 }).toBe(true);
  await pause(page); const state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[id]!.waitingDestination?.roomInstanceId).toBe("room.instance.founder_desk");
  await page.screenshot({ path: `${SHOTS}/fap-front-desk-returned.png`, animations: "disabled" });
});

test("one-time seeded terminal order reload does not duplicate its fee", async ({ page }) => {
  const id = "fhh-reload"; await prepare(page, "FHH reload order", "case.fhh.suggestive-results-confirmation", id); await answer(page, id); await run(page);
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; const operation = s.serviceOperations.find((o) => o.actorId === id); return Boolean(operation?.status === "in_service" && s.facilityTick < operation.phaseEndsAtFacilityTick!); }, { timeout: 45_000 }).toBe(true);
  await pause(page); const before = (await getActiveState(page)) as unknown as GameState; const operationBefore = before.serviceOperations.find((o) => o.actorId === id)!; const receipts = before.serviceIncomeReceipts.filter((r) => r.actorId === id); expect(receipts).toEqual([]);
  await page.reload(); const resume = page.getByRole("button", { name: "Resume FHH reload order" }); if (await resume.isVisible()) await resume.click();
  const reloaded = (await getActiveState(page)) as unknown as GameState; const operationReloaded = reloaded.serviceOperations.find((o) => o.actorId === id)!;
  expect(operationReloaded).toMatchObject({ id: operationBefore.id, status: "in_service", quoteFee: operationBefore.quoteFee, phaseStartedAtFacilityTick: operationBefore.phaseStartedAtFacilityTick, phaseEndsAtFacilityTick: operationBefore.phaseEndsAtFacilityTick, testChoiceOrder: operationBefore.testChoiceOrder });
  await run(page); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((r) => r.actorId === id).length, { timeout: 60_000 }).toBe(1);
  await pause(page); const after = (await getActiveState(page)) as unknown as GameState; expect(after.serviceOperations.filter((o) => o.actorId === id)).toHaveLength(1); expect(after.serviceIncomeReceipts.filter((r) => r.actorId === id)[0]).toMatchObject({ grossAmount: operationBefore.quoteFee, transactionKey: `income.service-operation.${operationBefore.id}.${operationBefore.incomeLineId}` });
  await page.reload(); const resumeAgain = page.getByRole("button", { name: "Resume FHH reload order" }); if (await resumeAgain.isVisible()) await resumeAgain.click();
  const final = (await getActiveState(page)) as unknown as GameState; expect(final.serviceIncomeReceipts.filter((r) => r.actorId === id)).toHaveLength(1); expect(final.serviceOperations.filter((o) => o.actorId === id)).toHaveLength(1);
});

test("FHH paired-serum collection stays onsite, returns through Front Desk, and releases the authored follow-up", async ({ page }) => {
  const id = "fhh-continuation"; await prepare(page, "FHH paired serum", "case.fhh.evaluation-to-confirmed-management", id, 0); await answer(page, id);
  let state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[id]!.testOnlyContinuation).toMatchObject({ status: "waiting_for_service", routeId: "route.basic_labs.phlebotomy_sendout" });
  await page.getByText(`${id} Patient`, { exact: true }).click();
  await expect(page.getByText(/Onsite phlebotomy collection with send-out testing in progress/i)).toBeVisible();
  await expect(page.getByText(/24-hour urine and later family\/genetic follow-up remain outside this blood-collection visit/i)).toBeVisible();
  await expect(page.getByText(/Patient is in clinic/i)).toBeVisible();
  await page.getByRole("button", { name: "Return to clinic", exact: true }).click();
  await run(page, "1x");
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; const operation = s.serviceOperations.find((o) => o.actorId === id); return Boolean(operation?.status === "in_service" && s.facilityTick >= operation.phaseStartedAtFacilityTick! + 2 && s.facilityTick < operation.phaseEndsAtFacilityTick!); }, { timeout: 45_000 }).toBe(true);
  state = (await getActiveState(page)) as unknown as GameState; const operation = state.serviceOperations.find((o) => o.actorId === id)!; expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(15); expect(state.encounters[id]!.currentNodeIndex).toBe(0); expect(state.encounters[id]!.deliveredResultNarratives).toEqual([]);
  const rendered = await live(page, id); inRoom(rendered.patient, rendered.rooms, rendered.layout, "order.phleb"); inRoom(rendered.staff, rendered.rooms, rendered.layout, "order.phleb");
  await centerRoom(page, "order.phleb"); await page.screenshot({ path: `${SHOTS}/fhh-paired-serum-unpaused.png`, animations: "disabled" });
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; const encounter = s.encounters[id]!; return encounter.currentNodeIndex === 1 && encounter.lifecycle === "active_action_required"; }, { timeout: 60_000 }).toBe(true);
  await pause(page); state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[id]!.testOnlyContinuation).toMatchObject({ status: "completed" }); expect(state.encounters[id]!.pendingResult).toBeNull(); expect(state.encounters[id]!.steps[1]).toMatchObject({ status: "action_required" }); expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === id)).toHaveLength(1);
});
