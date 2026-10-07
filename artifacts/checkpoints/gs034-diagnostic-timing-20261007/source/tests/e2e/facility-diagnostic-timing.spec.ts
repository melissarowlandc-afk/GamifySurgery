import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, gameReducer, getAnswerChoiceServicePreview,
  getDiagnosticOrderPlans, getRoomDefinition, getRoomNavigationAnchor, getRoomSharedStaffAnchor,
  serializeGameState, type GameState,
} from "@gamify-surgery/game-domain";
import { getRadiologistReadingStation } from "../../packages/game-domain/src/reading-stations";
import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

// Fresh browser contexts and an externally managed QA server; never owner storage.
const SHOTS = ".local-dev/facility-diagnostic-timing/browser";
const pageErrors = new WeakMap<Page, string[]>();
test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));
test.beforeEach(({ page }, info) => {
  test.skip(!["desktop-chrome", "phone-chrome"].includes(info.project.name));
  const errors: string[] = []; pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(({ page }) => expect(pageErrors.get(page) ?? []).toEqual([]));

async function prepared(page: Page, name: string): Promise<GameState> {
  await startClinic(page, "Timing Reviewer", name);
  const state = (await getActiveState(page)) as unknown as GameState;
  state.facilityLevel = 3; state.cash = 20_000; state.cashCents = 2_000_000; state.paused = true;
  state.encounters = {}; state.serviceOperations = []; state.employees = [];
  state.openChartEncounterId = null; state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER; state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false; state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER; state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    ...state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk"),
    ...[["exam", "room.examination", 29, 23], ["phleb", "room.phlebotomy", 33, 23],
      ["lab", "room.laboratory", 37, 22], ["reading", "room.reading", 46, 21]].map(([id, definition, x, y]) => ({
      id: `timing.${id}`, roomDefinitionId: definition as string, x: x as number, y: y as number,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
    })),
    ...Array.from({ length: 19 }, (_, index) => ({ id: `timing.hall.${index}`, roomDefinitionId: "room.hallway", x: 32 + index, y: 25, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    ...[24, 26, 27, 28].map((y) => ({ id: `timing.vertical.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "timing.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "timing.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "timing.exam", roomId: "timing.exam", side: "east", offset: 1, exterior: false },
    ...["phleb", "lab", "reading"].map((id) => ({ id: `timing.${id}`, roomId: `timing.${id}`, side: "south" as const, offset: 1, exterior: false })),
  ];
  addEmployee(state, "staff.phlebotomist", "timing.phleb");
  addEmployee(state, "staff.laboratory_technician", "timing.lab");
  return deserializeGameState(serializeGameState(state));
}
function addEmployee(state: GameState, role: string, home: string) {
  const room = state.rooms.find((room) => room.id === home)!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const location = room.roomDefinitionId === "room.periop_recovery" ? getRoomSharedStaffAnchor(room, definition) : getRoomNavigationAnchor(room, definition, "staff");
  state.employees.push({ id: role, staffRoleDefinitionId: role, displayName: role, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 90, trainingLevel: 1, homeRoomInstanceId: home,
    location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
}
function admit(state: GameState, id: string, caseId: string): GameState {
  const next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `${id}.admit`, encounterId: id, caseId, patientDisplayName: `${id} Patient`, arrivalClass: "routine" });
  expect(next.operationReceipts[`${id}.admit`]?.status).toBe("applied");
  const encounter = next.encounters[id]!; const room = next.rooms.find((room) => room.id === "timing.exam")!;
  encounter.currentNodeIndex = 0; encounter.steps.forEach((step, index) => { step.status = index === 0 ? "action_required" : "locked"; });
  encounter.patientLocation = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "primary");
  encounter.patientMovement = null; encounter.assignedRoomInstanceId = room.id; encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null; encounter.checkInStatus = "checked_in"; encounter.lifecycle = "active_action_required";
  return next;
}
function order(state: GameState, id: string): GameState {
  const node = state.encounters[id]!.frozenCase.decisionNodes[0]!;
  let next = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: `${id}.answer`, encounterId: id, decisionNodeId: node.id, answerChoiceId: node.answerChoices.find((choice) => choice.isCorrect)!.id });
  expect(next.operationReceipts[`${id}.answer`]?.status).toBe("applied");
  if (next.encounters[id]!.steps[0]!.status === "feedback_pending") {
    next = gameReducer(next, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: `${id}.ack`, encounterId: id, decisionNodeId: node.id });
  }
  next.openChartEncounterId = null; next.attendedEncounterId = null;
  return next;
}
function advance(state: GameState, predicate: (state: GameState) => boolean): GameState {
  const wasPaused = state.paused;
  state = { ...state, paused: false };
  for (let i = 0; !predicate(state) && i < 700; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `browser.timing.${state.facilityTick}` });
  state = { ...state, paused: wasPaused };
  expect(predicate(state)).toBe(true); return state;
}
async function install(page: Page, state: GameState, name: string, marker: string) {
  const profile = await getProfile(page); const campaign = profile.campaigns.find((entry) => entry.campaignId === profile.activeCampaignId)!;
  campaign.name = name; campaign.serializedState = serializeGameState(state); profile.tutorialsEnabled = false;
  await page.addInitScript(({ profile, marker, key }) => {
    if (sessionStorage.getItem(marker)) return; sessionStorage.setItem(marker, "1"); localStorage.setItem(key, JSON.stringify(profile));
  }, { profile, marker, key: PROFILE_KEY });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: `Resume ${name}`, exact: true }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  expect(await page.evaluate(() => location.origin)).toBe(process.env.GAMIFY_E2E_BASE_URL);
}
async function open(page: Page, id: string) { await page.getByText(`${id} Patient`, { exact: true }).click(); await expect(page.locator(".chart-panel")).toBeVisible(); }
async function reload(page: Page, name: string) {
  await page.reload(); const button = page.getByRole("button", { name: `Resume ${name}`, exact: true });
  if (await button.isVisible()) await button.click(); await expect(page.getByTestId("facility-canvas")).toBeVisible();
}
const format = (minutes: number) => minutes >= 60 && minutes % 60 === 0 ? `${minutes / 60} hour${minutes === 60 ? "" : "s"}` : `${minutes} min`;

test("choices show complete outside versus collected onsite laboratory time", async ({ page }, info) => {
  const name = "Timing quotes"; let state = admit(await prepared(page, name), "quote", "case.fhh.suggestive-results-confirmation");
  const choiceId = state.encounters.quote!.frozenCase.decisionNodes[0]!.answerChoices.find((choice) => choice.isCorrect)!.id;
  const local = getAnswerChoiceServicePreview(state, "quote", choiceId)!;
  expect(local.diagnosticTiming!.phases.filter((phase) => phase.durationMinutes).map((phase) => phase.durationMinutes)).toEqual([15, 15]);
  const outside = structuredClone(state); outside.employees = []; const external = getAnswerChoiceServicePreview(outside, "quote", choiceId)!;
  expect(external.diagnosticTiming!.phases.filter((phase) => phase.durationMinutes).map((phase) => phase.durationMinutes)).toEqual([120]);
  expect(local.durationTicks).toBeLessThan(external.durationTicks!);
  for (const [suffix, seeded, preview] of [["offsite", outside, external], ["onsite", state, local]] as const) {
    await install(page, seeded, name, `quote.${suffix}`); await open(page, "quote");
    const button = page.locator(".answer-choice").filter({ has: page.locator("strong", { hasText: state.encounters.quote!.frozenCase.decisionNodes[0]!.answerChoices.find((choice) => choice.id === choiceId)!.label }) });
    await expect(button.locator(".answer-choice-eta")).toHaveText(format(preview.durationTicks!));
    await expect(button).toContainText("includes queues and walking");
    await expect(button).toContainText(suffix === "onsite" ? "Laboratory processing 15 min onsite" : "Collection 2 hours offsite");
    await page.screenshot({ path: `${SHOTS}/quotes-${suffix}-${info.project.name}.png`, animations: "disabled" });
  }
});

test("queued collection and processing survive reload and charge each draw once", async ({ page }) => {
  const name = "Serial lab work"; let state = order(admit(await prepared(page, name), "lab-first", "case.fhh.suggestive-results-confirmation"), "lab-first");
  state = advance(state, (state) => state.serviceOperations.some((op) => op.diagnosticPhysicalWork && op.status === "in_service"));
  state = order(admit(state, "lab-second", "case.fhh.suggestive-results-confirmation"), "lab-second");
  expect(state.serviceOperations.find((op) => op.actorId === "lab-second")?.status).toBe("waiting_for_resources");
  const original = serializeGameState(state); await install(page, state, name, "labs.seed"); await reload(page, name);
  let actual = deserializeGameState(JSON.stringify(await getActiveState(page)));
  expect(actual.serviceOperations.map((op) => [op.id, op.phaseStartedAtFacilityTick, op.diagnosticPhysicalWork])).toEqual(state.serviceOperations.map((op) => [op.id, op.phaseStartedAtFacilityTick, op.diagnosticPhysicalWork]));
  // The hand-built checked-in fixture receives ordinary optional-field migration;
  // frozen diagnostic work itself must survive exactly, and normalized saves are stable.
  const restored = deserializeGameState(original);
  expect(getDiagnosticOrderPlans(restored)).toEqual(getDiagnosticOrderPlans(state));
  const normalized = serializeGameState(restored);
  expect(serializeGameState(deserializeGameState(normalized))).toBe(normalized);
  await page.getByRole("button", { name: "Set facility speed to 4x" }).click(); await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => { const s = (await getActiveState(page)) as unknown as GameState; return s.serviceOperations.filter((op) => op.diagnosticPhaseWork?.kind === "laboratory_processing" && op.completedAtFacilityTick !== null).length; }, { timeout: 45_000 }).toBe(2);
  await page.getByRole("button", { name: "Pause facility time" }).click(); actual = (await getActiveState(page)) as unknown as GameState;
  const draws = actual.serviceOperations.filter((op) => op.diagnosticPhysicalWork).sort((a, b) => a.startedAtFacilityTick! - b.startedAtFacilityTick!);
  expect(draws).toHaveLength(2); expect(draws[1]!.startedAtFacilityTick).toBeGreaterThanOrEqual(draws[0]!.completedAtFacilityTick!);
  const processing = actual.serviceOperations.filter((op) => op.diagnosticPhaseWork).sort((a, b) => a.startedAtFacilityTick! - b.startedAtFacilityTick!);
  expect(processing[1]!.startedAtFacilityTick).toBeGreaterThanOrEqual(processing[0]!.completedAtFacilityTick!);
  expect(processing.map((op) => op.diagnosticPhaseWork!.durationMinutes)).toEqual([15, 15]);
  expect(actual.serviceIncomeReceipts.filter((receipt) => ["lab-first", "lab-second"].includes(receipt.actorId))).toHaveLength(2);
  expect(actual.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.laboratory_processing")).toBe(false);
  await reload(page, name); expect(((await getActiveState(page)) as unknown as GameState).serviceIncomeReceipts.filter((receipt) => ["lab-first", "lab-second"].includes(receipt.actorId))).toHaveLength(2);
});

test("four hired readers occupy four desks and a fifth study queues across reload", async ({ page }, info) => {
  let state = await prepared(page, "Four reader queues");
  for (let i = 1; i <= 4; i++) state = gameReducer(state, { type: "HIRE_STAFF", operationId: `timing.hire.${i}`, employeeId: `reader.${i}`, staffRoleDefinitionId: "staff.radiologist" });
  const readers = state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist"); expect(readers).toHaveLength(4);
  for (const reader of readers) { const seat = getRadiologistReadingStation(state, reader, PROTOTYPE_DOMAIN_CONTEXT)!; reader.location = seat.location; reader.path = [seat.location]; reader.pathIndex = 0; }
  for (let i = 1; i <= 5; i++) state = order(admit(state, `image-${i}`, "case.breast-cyst.under-30-asymptomatic-simple"), `image-${i}`);
  state = advance(state, (state) => state.serviceOperations.filter((op) => op.diagnosticPhaseWork?.kind === "interpretation" && op.status === "in_service").length === 4);
  expect(state.serviceOperations.filter((op) => op.diagnosticPhaseWork?.kind === "interpretation" && op.status === "waiting_for_resources")).toHaveLength(1);
  await install(page, state, "Four reader queues", "readers.seed"); await reload(page, "Four reader queues");
  await expect.poll(() => page.evaluate(() => { const scene = (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene"); return scene?.bridge?.viewModel?.staff?.filter((staff: any) => staff.supportRole === "reading-radiologist").map((staff: any) => staff.supportId).sort(); })).toEqual(["northeast", "northwest", "southeast", "southwest"]);
  await page.evaluate(() => { const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene"); scene.applyCamera({ ...scene.cameraView, zoom: 1.5, panX: 0, panY: 0 }); const l = scene.layout; scene.applyCamera({ ...scene.cameraView, panX: scene.scale.width / 2 - (l.originX + 48 * l.tileSize), panY: scene.scale.height / 2 - (l.originY + 23 * l.tileSize) }); scene.refreshLayout(true); });
  // Keep simulation paused; hide only its banner so all four desks are visible.
  await page.getByTestId("facility-canvas").screenshot({ path: `${SHOTS}/four-active-readers-${info.project.name}.png`, animations: "disabled", style: ".facility-pause-indicator { visibility: hidden; }" });
  await page.getByRole("button", { name: "Set facility speed to 4x" }).click(); await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).serviceOperations.filter((op) => op.diagnosticPhaseWork?.kind === "interpretation" && op.completedAtFacilityTick !== null).length, { timeout: 20_000 }).toBe(5);
  const actual = (await getActiveState(page)) as unknown as GameState;
  const reads = actual.serviceOperations.filter((op) => op.diagnosticPhaseWork?.kind === "interpretation");
  expect(reads.map((op) => op.diagnosticPhaseWork!.durationMinutes)).toEqual([5, 5, 5, 5, 5]);
  for (const reader of readers) { const jobs = reads.filter((op) => op.diagnosticPhaseWork!.resource!.employeeIds.includes(reader.id)).sort((a, b) => a.startedAtFacilityTick! - b.startedAtFacilityTick!); for (let i = 1; i < jobs.length; i++) expect(jobs[i]!.startedAtFacilityTick).toBeGreaterThanOrEqual(jobs[i - 1]!.completedAtFacilityTick!); }
  expect(actual.serviceIncomeReceipts).toHaveLength(0);
});

test("a markerless prior-version order keeps its frozen outside contract after reload", async ({ page }) => {
  const name = "Frozen prior order";
  let state = admit(await prepared(page, name), "legacy", "case.recovered-diverticulitis.drained-abscess");
  // A previous-version alternative preserves the exact operational key, while
  // exercising the historical path used by saves without diagnostic-order.v1.
  const node = state.encounters.legacy!.frozenCase.decisionNodes[0]!;
  node.answerChoices.find((choice) => !choice.isCorrect)!.label += " [frozen prior wording]";
  state.employees = [];
  state = order(state, "legacy");
  const pending = state.encounters.legacy!.pendingResult!;
  expect(pending).toBeDefined(); expect(pending.diagnosticTiming).toBeUndefined();
  const frozen = structuredClone(pending);
  await install(page, state, name, "legacy.seed"); await open(page, "legacy");
  await expect(page.locator(".chart-pending-card")).toContainText(pending.pendingLabel);
  await reload(page, name);
  const restored = (await getActiveState(page)) as unknown as GameState;
  expect(restored.encounters.legacy!.pendingResult).toEqual(frozen);
  expect(getDiagnosticOrderPlans(restored)).toEqual([]);
  expect(restored.serviceIncomeReceipts).toEqual([]);
});

for (const [suffix, caseId, sampling] of [["visual", "case.recovered-diverticulitis.drained-abscess", false], ["pathology", "case.esophageal-dysphagia.bread-sticking", true]] as const) {
  test(`endoscopy ${suffix} milestones remain separate from protected recovery after reload`, async ({ page }, info) => {
    const name = `Endoscopy ${suffix}`; let state = await prepared(page, name);
    state.rooms = state.rooms.filter((room) => !["timing.phleb", "timing.lab", "timing.reading"].includes(room.id));
    const exam = state.rooms.find((room) => room.id === "timing.exam")!; exam.x = 33; exam.y = 25;
    state.doors = state.doors.filter((door) => !["timing.phleb", "timing.lab", "timing.reading", "timing.exam"].includes(door.id));
    state.rooms.push({ id: "timing.endo", roomDefinitionId: "room.endoscopy", x: 28, y: 21, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }, { id: "timing.periop", roomDefinitionId: "room.periop_recovery", x: 26, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }, ...[20, 21, 22, 23].map((y) => ({ id: `timing.scopehall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
    state.doors.push({ id: "timing.exam", roomId: "timing.exam", side: "west", offset: 1, exterior: false }, { id: "timing.endo", roomId: "timing.endo", side: "east", offset: 1, exterior: false }, { id: "timing.periop", roomId: "timing.periop", side: "east", offset: 1, exterior: false });
    state.employees = []; addEmployee(state, "staff.endoscopy_nurse", "timing.endo"); addEmployee(state, "staff.periop_nurse", "timing.periop");
    state = order(admit(state, "scope", caseId), "scope"); state = advance(state, (state) => getDiagnosticOrderPlans(state)[0]!.visualResultReady?.reachedAtTick !== null);
    const plan = getDiagnosticOrderPlans(state)[0]!; expect(plan.careComplete.reachedAtTick).toBeNull(); expect(plan.resultReady.reachedAtTick !== null).toBe(!sampling);
    expect(plan.phases.filter((phase) => phase.kind === "pathology").map((phase) => phase.durationMinutes)).toEqual(sampling ? [60] : []);
    const operation = state.serviceOperations.find((op) => op.diagnosticPhysicalWork)!; expect(operation.periopBedReservation).toBeDefined();
    const bed = structuredClone(operation.periopBedReservation); const narrative = state.encounters.scope!.pendingResult!.resultNarrative;
    await install(page, state, name, `scope.${suffix}`); await open(page, "scope");
    const card = page.locator(".chart-pending-card"); await expect(card).toContainText("next decision waits for care completion");
    if (sampling) { await expect(card).toContainText("Visual findings are available"); await expect(card).not.toContainText(narrative); await expect(card).toContainText("Pathology (offsite)"); }
    else {
      await expect(card).toContainText(narrative);
      await expect(page.locator(".chart-panel")).not.toContainText("external pathology");
    }
    // The answered question stays visible; no subsequent choice can be submitted.
    await expect(page.locator(".answer-choice")).toHaveCount(4);
    await expect(page.locator(".answer-choice:not([disabled])")).toHaveCount(0);
    await page.screenshot({ path: `${SHOTS}/endoscopy-${suffix}-${info.project.name}.png`, animations: "disabled" });
    await reload(page, name); const restored = (await getActiveState(page)) as unknown as GameState;
    expect(restored.serviceOperations.find((op) => op.id === operation.id)?.periopBedReservation).toEqual(bed);
    expect(restored.encounters.scope!.currentNodeIndex).toBe(0); expect(restored.encounters.scope!.pendingResult!.deliveredAtTick).toBeNull();
  });
}
