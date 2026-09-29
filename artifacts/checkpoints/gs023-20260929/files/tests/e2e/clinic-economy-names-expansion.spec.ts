import { expect, test, type Page } from "@playwright/test";
import { gameReducer, getRoomDefinition, getRoomNavigationAnchor, type GameState } from "@gamify-surgery/game-domain";
import { mkdirSync } from "node:fs";
import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

const SHOTS = ".local-dev/clinic-expansion-browser/screenshots";
test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));
test.setTimeout(150_000);
type Kind = "exam" | "glp" | "ultrasound" | "xray";

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

function employee(state: GameState, id: string, role: string, home: string) {
  const room = state.rooms.find((item) => item.id === home)!;
  const location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "staff");
  state.employees.push({ id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 0, morale: 90, trainingLevel: 1,
    homeRoomInstanceId: home, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
}

function facility(state: GameState, kinds: Kind[]) {
  Object.assign(state, { facilityLevel: 2, cash: 50_000, cashCents: 5_000_000, paused: true, simulationSpeed: 4,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER, nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    serviceAppointmentsEnabled: false, encounters: {}, serviceOperations: [], serviceIncomeReceipts: [],
    openChartEncounterId: null, attendedEncounterId: null });
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    { id: "room.instance.founder_desk", roomDefinitionId: "room.front_desk", x: 33, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 5 }, (_, i) => ({ id: `clinic.hall.${i}`, roomDefinitionId: "room.hallway", x: 32, y: 24 + i, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "clinic.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "clinic.front.hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  ];
  const room = (kind: Kind, id: string, def: string, x: number, y: number, side: "east" | "west", offset: number) => {
    if (!kinds.includes(kind)) return;
    state.rooms.push({ id, roomDefinitionId: def, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: `door.${id}`, roomId: id, side, offset, exterior: false });
  };
  room("ultrasound", "clinic.ultrasound", "room.ultrasound", 29, 23, "east", 1);
  room("xray", "clinic.xray", "room.xray", 33, 23, "west", 1);
  room("exam", "clinic.exam", "room.examination", 29, 26, "east", 1);
  room("glp", "clinic.glp", "room.glp1_telehealth_suite", 29, 23, "east", 1);
  state.employees = [];
  if (kinds.includes("ultrasound")) employee(state, "employee.clinic.imaging", "staff.imaging_technician", "clinic.ultrasound");
  else if (kinds.includes("xray")) employee(state, "employee.clinic.imaging", "staff.imaging_technician", "clinic.xray");
}

async function fresh(page: Page, name: string, kinds: Kind[]) {
  await startClinic(page, `${name} Founder`, name);
  const state = (await getActiveState(page)) as unknown as GameState; facility(state, kinds); return state;
}

function withCase(state: GameState, caseId: string, encounterId: string, nodeId: string) {
  const next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `${encounterId}.admit`, encounterId, caseId,
    patientDisplayName: `${encounterId} Patient`, arrivalClass: "routine" });
  const encounter = next.encounters[encounterId]!;
  const index = encounter.frozenCase.decisionNodes.findIndex((node) => node.id === nodeId); expect(index).toBeGreaterThanOrEqual(0);
  const exam = next.rooms.find((room) => room.id === "clinic.exam")!;
  encounter.currentNodeIndex = index;
  encounter.steps.forEach((step, i) => { step.status = i < index ? "completed" : i === index ? "action_required" : "locked"; });
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "primary");
  Object.assign(encounter, { assignedRoomInstanceId: exam.id, queuedCareRoomInstanceId: null, waitingDestination: null,
    checkInStatus: "checked_in", lifecycle: "active_action_required" });
  next.openChartEncounterId = null; next.attendedEncounterId = null; return next;
}

async function answer(page: Page, id: string) {
  await page.getByText(`${id} Patient`, { exact: true }).click();
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).openChartEncounterId).toBe(id);
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[id]!;
  const correct = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", { name: new RegExp(`^${correct.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  const enact = page.getByRole("button", { name: "Enact Plan", exact: true });
  if (await enact.isVisible()) await enact.click(); else await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  const close = page.getByRole("button", { name: "Return to clinic", exact: true }); if (await close.isVisible()) await close.click();
}

async function run(page: Page, speed: "1x" | "4x" = "4x") {
  await page.getByRole("button", { name: `Set facility speed to ${speed}` }).click();
  await page.getByRole("button", { name: "Resume facility time" }).click();
}
async function pause(page: Page) { const button = page.getByRole("button", { name: "Pause facility time" }); if (await button.isVisible()) await button.click(); }

async function center(page: Page, roomId: string) {
  await page.evaluate((id) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene");
    const room = scene?.bridge?.viewModel?.rooms?.find((item: any) => item.instanceId === id);
    if (!scene || !room) throw new Error(`Missing rendered room ${id}`);
    scene.applyCamera({ ...scene.cameraView, panX: 0, panY: 0 }); const l = scene.layout;
    scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - (l.originX + (room.tileX + room.width / 2) * l.tileSize), panY: scene.scale.height / 2 - (l.originY + (room.tileY + room.height / 2) * l.tileSize) });
    scene.refreshLayout(true); scene.drawCharacters();
  }, roomId);
}

async function live(page: Page, id?: string) {
  return page.evaluate((encounterId) => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene");
    const graphic = (key: string) => { const item = scene?.characterBitmapContainers?.get(key); return item ? { visible: item.visible, x: item.x, y: item.y } : null; };
    return { patient: encounterId ? graphic(`character:patient:${encounterId}`) : null,
      staff: [...(scene?.characterBitmapContainers?.keys?.() ?? [])].filter((key: string) => key.startsWith("character:staff:")).map((key: string) => ({ key, ...graphic(key) })),
      rooms: scene?.bridge?.viewModel?.rooms, layout: scene?.layout };
  }, id);
}

function inRoom(actor: any, rooms: any[], layout: any, id: string) {
  const room = rooms.find((item: any) => item.instanceId === id)!; expect(actor).toMatchObject({ visible: true });
  expect(actor.x).toBeGreaterThan(layout.originX + room.tileX * layout.tileSize);
  expect(actor.x).toBeLessThan(layout.originX + (room.tileX + room.width) * layout.tileSize);
  expect(actor.y).toBeGreaterThan(layout.originY + room.tileY * layout.tileSize);
  expect(actor.y).toBeLessThan(layout.originY + (room.tileY + room.height + 1) * layout.tileSize);
}

test("one GLP-1 suite hires two NPs at distinct stations, runs full-hour clocks, and blocks a third", async ({ page }) => {
  await installSeed(page, await fresh(page, "Economy expansion", ["glp"]), "Economy expansion", "clinic-expansion.glp.seed");
  await page.getByRole("button", { name: "Enter Management Mode" }).click();
  const role = page.locator("[data-staff-role-id='staff.glp1_np']"); await expect(role).toContainText("0/10");
  await role.getByRole("button", { name: /Hire \$/ }).click(); await expect(role).toContainText("1/10");
  await page.getByRole("button", { name: "Done", exact: true }).click(); await run(page);
  const tick = ((await getActiveState(page)) as unknown as GameState).facilityTick;
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).facilityTick, { timeout: 20_000 }).toBeGreaterThanOrEqual(tick + 10);
  await pause(page); await page.getByRole("button", { name: "Enter Management Mode" }).click();
  await role.getByRole("button", { name: /Hire \$/ }).click(); await expect(role).toContainText("2/10");
  await expect(role.getByRole("button", { name: /Hire \$/ })).toBeDisabled();
  await page.getByRole("button", { name: "Done", exact: true }).click(); await run(page);
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; const n = s.employees.filter((e) => e.staffRoleDefinitionId === "staff.glp1_np"); return n.length === 2 && n.every((e) => e.pathIndex >= e.path.length - 1); }, { timeout: 45_000 }).toBe(true);
  let state = (await getActiveState(page)) as unknown as GameState;
  const nurses = state.employees.filter((e) => e.staffRoleDefinitionId === "staff.glp1_np");
  expect(nurses.map((e) => e.homeRoomInstanceId)).toEqual(["clinic.glp", "clinic.glp"]); expect(nurses[0]!.location).not.toEqual(nurses[1]!.location);
  const actors = await live(page); for (const actor of actors.staff) inRoom(actor, actors.rooms, actors.layout, "clinic.glp");
  await center(page, "clinic.glp"); await page.screenshot({ path: `${SHOTS}/glp-two-np-distinct-stations.png`, animations: "disabled" });
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((r) => r.incomeLineId === "income.glp1_telehealth").length, { timeout: 45_000 }).toBe(1);
  await pause(page); const before = (await getActiveState(page)) as unknown as GameState; expect(before.environment.glp1AutomationSlots).toHaveLength(2);
  await page.reload(); let resume = page.getByRole("button", { name: "Resume Economy expansion" }); if (await resume.isVisible()) await resume.click();
  let restored = (await getActiveState(page)) as unknown as GameState; expect(restored.environment.glp1AutomationSlots).toEqual(before.environment.glp1AutomationSlots);
  expect(restored.serviceIncomeReceipts.filter((r) => r.incomeLineId === "income.glp1_telehealth")).toEqual(before.serviceIncomeReceipts.filter((r) => r.incomeLineId === "income.glp1_telehealth"));
  await run(page); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((r) => r.incomeLineId === "income.glp1_telehealth").length, { timeout: 45_000 }).toBe(2);
  await pause(page); state = (await getActiveState(page)) as unknown as GameState; const receipts = state.serviceIncomeReceipts.filter((r) => r.incomeLineId === "income.glp1_telehealth");
  expect(receipts.map((r) => r.grossAmount)).toEqual([50, 50]); expect(new Set(receipts.map((r) => r.actorId))).toEqual(new Set(nurses.map((e) => e.id)));
  await page.reload(); resume = page.getByRole("button", { name: "Resume Economy expansion" }); if (await resume.isVisible()) await resume.click();
  restored = (await getActiveState(page)) as unknown as GameState; expect(restored.serviceIncomeReceipts.filter((r) => r.incomeLineId === "income.glp1_telehealth")).toHaveLength(2);
});

test("automatic admissions render different active surnames and preserve exact names on reload", async ({ page }) => {
  let state = await fresh(page, "Name expansion", ["exam"]);
  for (const id of ["name.arrival.one", "name.arrival.two", "name.arrival.three"]) state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `${id}.admit`, encounterId: id, caseId: "case.breast-cyst.under-30-asymptomatic-simple", patientDisplayName: undefined as never, arrivalClass: "routine" });
  const names = Object.values(state.encounters).map((e) => e.patientDisplayName); expect(new Set(names.map((n) => n.split(" ").at(-1))).size).toBe(3);
  const exam = state.rooms.find((room) => room.id === "clinic.exam")!;
  const location = getRoomNavigationAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "primary");
  for (const encounter of Object.values(state.encounters)) {
    encounter.patientMovement = null; encounter.patientLocation = location; encounter.assignedRoomInstanceId = exam.id;
    encounter.queuedCareRoomInstanceId = null; encounter.waitingDestination = null; encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "active_action_required";
  }
  await installSeed(page, state, "Name expansion", "clinic-expansion.names.seed"); for (const name of names) await expect(page.getByText(name, { exact: true })).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/generated-active-name-variety.png`, animations: "disabled" }); await page.reload();
  const resume = page.getByRole("button", { name: "Resume Name expansion" }); if (await resume.isVisible()) await resume.click();
  expect(Object.values((await getActiveState(page) as unknown as GameState).encounters).map((e) => e.patientDisplayName)).toEqual(names);
});

test("terminal endoanal ultrasound works 45 minutes for $120, holds departure, and reloads exactly once", async ({ page }) => {
  let state = withCase(await fresh(page, "EAUS expansion", ["exam", "ultrasound"]), "case.fecal-incontinence.obstetric-injury", "eaus-terminal", "node.fecal-incontinence.obstetric-injury.1");
  await installSeed(page, state, "EAUS expansion", "clinic-expansion.eaus.seed"); await answer(page, "eaus-terminal");
  state = (await getActiveState(page)) as unknown as GameState; expect(state.encounters["eaus-terminal"]!.terminalTestOrder).toMatchObject({ routeId: "route.endoanal_ultrasound.in_house", status: "onsite_service" });
  expect(state.encounters["eaus-terminal"]!.patientMovement?.kind).not.toBe("leaving_after_resolution"); await run(page, "1x");
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceOperations.find((o) => o.actorId === "eaus-terminal")?.status, { timeout: 45_000 }).toBe("in_service"); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState; const op = state.serviceOperations.find((o) => o.actorId === "eaus-terminal")!;
  expect(op).toMatchObject({ incomeLineId: "income.ultrasound", quoteFee: 120, testChoiceOrder: { purpose: "terminal", serviceId: "service.endoanal_ultrasound" } }); expect(op.phaseEndsAtFacilityTick! - op.phaseStartedAtFacilityTick!).toBe(45);
  const actors = await live(page, "eaus-terminal"); inRoom(actors.patient, actors.rooms, actors.layout, "clinic.ultrasound"); inRoom(actors.staff[0], actors.rooms, actors.layout, "clinic.ultrasound");
  await center(page, "clinic.ultrasound"); await page.screenshot({ path: `${SHOTS}/endoanal-ultrasound-in-service.png`, animations: "disabled" }); await page.reload();
  let resume = page.getByRole("button", { name: "Resume EAUS expansion" }); if (await resume.isVisible()) await resume.click();
  expect(((await getActiveState(page)) as unknown as GameState).serviceOperations.find((o) => o.actorId === "eaus-terminal")).toMatchObject({ id: op.id, phaseStartedAtFacilityTick: op.phaseStartedAtFacilityTick, phaseEndsAtFacilityTick: op.phaseEndsAtFacilityTick });
  await run(page); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((r) => r.actorId === "eaus-terminal").length, { timeout: 60_000 }).toBe(1); await pause(page); await page.reload();
  resume = page.getByRole("button", { name: "Resume EAUS expansion" }); if (await resume.isVisible()) await resume.click(); state = (await getActiveState(page)) as unknown as GameState;
  expect(state.serviceIncomeReceipts.filter((r) => r.actorId === "eaus-terminal")).toEqual([expect.objectContaining({ grossAmount: 120 })]); expect(state.serviceOperations.filter((o) => o.actorId === "eaus-terminal")).toHaveLength(1);
});

test("Zenker contrast swallow uses X-ray for 60 minutes, earns $90, and only then releases the next node", async ({ page }) => {
  let state = withCase(await fresh(page, "Swallow expansion", ["exam", "xray"]), "case.zenker-diverticulum.regurgitated-food", "zenker-swallow", "node.zenker-diverticulum.regurgitated-food.1");
  await installSeed(page, state, "Swallow expansion", "clinic-expansion.swallow.seed"); await answer(page, "zenker-swallow");
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters["zenker-swallow"]!.pendingResult).toMatchObject({ routeId: "route.contrast_swallow.in_house", serviceIncomeLineId: "income.xray", serviceIncomeFee: 90, deliveredAtTick: null });
  const phase = state.encounters["zenker-swallow"]!.pendingResult!.timingPhases!.find((item) => item.id === "phase.contrast_swallow.acquisition")!;
  expect(phase.durationTicks).toBe(60); expect(state.encounters["zenker-swallow"]!.currentNodeIndex).toBe(0); await run(page, "1x");
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).facilityTick, { timeout: 45_000 }).toBeGreaterThanOrEqual(phase.startsAtTick! + 2); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState; expect(state.facilityTick).toBeLessThan(phase.endsAtTick!); expect(state.encounters["zenker-swallow"]!.currentNodeIndex).toBe(0);
  const actors = await live(page, "zenker-swallow"); inRoom(actors.patient, actors.rooms, actors.layout, "clinic.xray"); inRoom(actors.staff[0], actors.rooms, actors.layout, "clinic.xray"); await center(page, "clinic.xray"); await page.screenshot({ path: `${SHOTS}/contrast-swallow-xray-in-service.png`, animations: "disabled" });
  await run(page); await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; return s.encounters["zenker-swallow"]!.currentNodeIndex > 0 && s.encounters["zenker-swallow"]!.lifecycle === "active_action_required"; }, { timeout: 75_000 }).toBe(true); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState; expect(state.serviceIncomeReceipts.filter((r) => r.actorId === "zenker-swallow")).toEqual([expect.objectContaining({ grossAmount: 90 })]); expect(state.encounters["zenker-swallow"]!.waitingDestination?.roomInstanceId).toBe("room.instance.founder_desk");
});

test("compound breast imaging finishes local ultrasound before one external mammography remainder and charges only $120 locally", async ({ page }) => {
  let state = withCase(await fresh(page, "Breast expansion", ["exam", "ultrasound"]), "case.mondor-disease.full-pathway", "breast-compound", "node.mondor-disease.evaluation.diagnostic-breast-imaging.full-pathway");
  await installSeed(page, state, "Breast expansion", "clinic-expansion.breast.seed"); await answer(page, "breast-compound");
  state = (await getActiveState(page)) as unknown as GameState; expect(state.encounters["breast-compound"]!.stagedResultOrder).toMatchObject({ version: "staged-result-order.v1", status: "waiting_for_component", components: [{ componentId: "targeted_ultrasound", routeId: "route.ultrasound.in_house", quoteFee: 120 }], remainder: { routeId: "route.diagnostic_breast_imaging.outsourced" } });
  await run(page, "1x"); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceOperations.find((o) => o.actorId === "breast-compound")?.status, { timeout: 45_000 }).toBe("in_service"); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState; const op = state.serviceOperations.find((o) => o.actorId === "breast-compound")!;
  expect(op).toMatchObject({ quoteFee: 120, testChoiceOrder: { purpose: "staged_result_component", externalRemainder: expect.stringContaining("mammography") } }); expect(op.phaseEndsAtFacilityTick! - op.phaseStartedAtFacilityTick!).toBe(45); expect(state.encounters["breast-compound"]!.currentNodeIndex).toBe(1);
  const actors = await live(page, "breast-compound"); inRoom(actors.patient, actors.rooms, actors.layout, "clinic.ultrasound"); inRoom(actors.staff[0], actors.rooms, actors.layout, "clinic.ultrasound"); await center(page, "clinic.ultrasound"); await page.screenshot({ path: `${SHOTS}/compound-breast-ultrasound-in-service.png`, animations: "disabled" });
  await run(page); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).encounters["breast-compound"]!.stagedResultOrder?.status, { timeout: 75_000 }).toBe("remainder_pending"); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState; expect(state.encounters["breast-compound"]!.pendingResult).toMatchObject({ routeId: "route.diagnostic_breast_imaging.outsourced", deliveredAtTick: null }); expect(state.encounters["breast-compound"]!.currentNodeIndex).toBe(1); expect(state.serviceIncomeReceipts.filter((r) => r.actorId === "breast-compound")).toEqual([expect.objectContaining({ grossAmount: 120 })]);
  await page.reload(); const resume = page.getByRole("button", { name: "Resume Breast expansion" }); if (await resume.isVisible()) await resume.click();
  state = (await getActiveState(page)) as unknown as GameState; expect(state.encounters["breast-compound"]!.stagedResultOrder?.components[0]?.serviceOperationId).toBe(op.id); expect(state.serviceIncomeReceipts.filter((r) => r.actorId === "breast-compound")).toHaveLength(1);
  await run(page); await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).encounters["breast-compound"]!.currentNodeIndex, { timeout: 90_000 }).toBe(2); await pause(page);
  state = (await getActiveState(page)) as unknown as GameState; expect(state.serviceIncomeReceipts.filter((r) => r.actorId === "breast-compound")).toEqual([expect.objectContaining({ grossAmount: 120 })]);
});
