import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import {
  GS028_20261007_VARIETY2_CASES,
  GS028_20261007_VARIETY2_CASE_REVIEWS,
  GS028_20261007_VARIETY2_TIMING_ENTRIES,
} from "../../packages/clinical-content/src/development-batch/2026-10-07-variety-2/variety-batch";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState,
  gameReducer,
  getAnswerChoiceServicePreview,
  getCurrentCapabilities,
  getCurrentQuestion,
  getDiagnosticOrderPlans,
  getFacilityAccessValidation,
  getRadiologistReadingStation,
  getRoomCareAnchor,
  getRoomDefinition,
  getRoomNavigationAnchor,
  selectWaitingDestinationForTesting,
  serializeGameState,
  type DiagnosticOrderPlan,
  type GameCommand,
  type GameState,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../apps/player/src/session/viewModels";
import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

// The parent owns the build/server. Run with GAMIFY_E2E_EXTERNAL_SERVER=1 and
// GAMIFY_E2E_BASE_URL=http://127.0.0.1:4328 in fresh Playwright contexts only.
// These seeded test campaigns do not represent natural earnings or progression.
const ORIGIN = "http://127.0.0.1:4328";
const EVIDENCE = ".local-dev/gs028-20261007-variety2/browser";
const pageErrors = new WeakMap<Page, string[]>();
const observedShuffles: boolean[] = [];
type BatchCase = (typeof PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases)[number];
type Prepared = { state: GameState; encounterId: string; patientName: string; name: string };

test.setTimeout(240_000);
test.beforeAll(() => {
  expect(process.env.GAMIFY_E2E_EXTERNAL_SERVER).toBe("1");
  mkdirSync(EVIDENCE, { recursive: true });
});
test.beforeEach(async ({ page }, testInfo) => {
  expect(testInfo.project.use.baseURL).toBe(ORIGIN);
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(async ({ page }) => expect(pageErrors.get(page) ?? []).toEqual([]));
test.afterAll(() => {
  if (observedShuffles.length) expect(observedShuffles.some(Boolean)).toBe(true);
});

function batchCase(id: string): BatchCase {
  const authored = GS028_20261007_VARIETY2_CASES.find((item) => item.id === id);
  const admitted = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) => item.id === id);
  if (!authored || !admitted) {
    throw new Error(`Run only after independent acceptance and runtime admission of ${id}.`);
  }
  return admitted;
}

async function activeState(page: Page): Promise<GameState> {
  return (await getActiveState(page)) as unknown as GameState;
}

function room(id: string, definition: string, x: number, y: number): PlacedRoom {
  return { id, roomDefinitionId: definition, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 };
}

function seedPatient(state: GameState, name: string, clinicalCase: BatchCase, waiting = false): Prepared {
  const encounterId = `${name}.encounter`;
  // Omission lets the real runtime choose a name from its coherent adult profile.
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: `${name}.admit`, encounterId,
    caseId: clinicalCase.id, arrivalClass: "routine",
  } as GameCommand, PROTOTYPE_DOMAIN_CONTEXT);
  expect(next.operationReceipts[`${name}.admit`]?.status).toBe("applied");
  const encounter = next.encounters[encounterId]!;
  const destination = next.rooms.find((item) => waiting ? item.roomDefinitionId === "room.front_desk" : item.id === "gs028f.exam")!;
  const definition = getRoomDefinition(destination.roomDefinitionId)!;
  Object.assign(encounter, {
    patientLocation: waiting
      ? getRoomNavigationAnchor(destination, definition, "primary")
      : getRoomCareAnchor(destination, definition, "patient"),
    patientMovement: null, assignedRoomInstanceId: waiting ? null : destination.id,
    queuedCareRoomInstanceId: null, waitingDestination: null,
    checkInStatus: "checked_in", lifecycle: waiting ? "waiting_unopened" : "active_action_required",
  });
  if (waiting) {
    const naturalWaiting = selectWaitingDestinationForTesting(next, PROTOTYPE_DOMAIN_CONTEXT, encounterId);
    if (!naturalWaiting?.reservation) throw new Error("No ordinary reachable waiting reservation exists for the test patient.");
    expect(naturalWaiting.reservation.roomInstanceId).toBe("gs028f.waiting");
    expect(naturalWaiting.path.length).toBeGreaterThan(0);
    encounter.patientLocation = { ...naturalWaiting.reservation.location };
    encounter.assignedRoomInstanceId = naturalWaiting.roomId;
    encounter.waitingDestination = { ...naturalWaiting.reservation };
  }
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return { state: next, encounterId, patientName: encounter.patientDisplayName, name };
}

async function installSeed(page: Page, prepared: Prepared) {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("The fresh isolated campaign is missing.");
  campaign.name = prepared.name;
  campaign.serializedState = serializeGameState(prepared.state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker: `gs028f.${prepared.name}.seed` });
  await page.goto("/?prototype-tools=0");
  expect(await page.evaluate(() => location.origin)).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${prepared.name}`, exact: true });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(page.getByRole("note")).toContainText("not clinically approved");
}

function addDiagnosticStaff(state: GameState, id: string, role: string, homeId: string): GameState {
  const next = gameReducer(state, { type: "HIRE_STAFF", operationId: `${id}.hire`, employeeId: id, staffRoleDefinitionId: role });
  expect(next.operationReceipts[`${id}.hire`]?.status).toBe("applied");
  const employee = next.employees.find((item) => item.id === id)!;
  const home = next.rooms.find((item) => item.id === homeId)!;
  employee.homeRoomInstanceId = homeId;
  // This test fixture explicitly supplies skill; no training or money is earned here.
  employee.trainingLevel = 3;
  const station = getRadiologistReadingStation(next, employee, PROTOTYPE_DOMAIN_CONTEXT);
  employee.location = station?.location ?? getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
  employee.path = [{ ...employee.location }];
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = next.facilityTick;
  employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  return next;
}

async function prepare(page: Page, name: string, clinicalCase: BatchCase, localCt = false, waiting = false): Promise<Prepared> {
  await startClinic(page, `${name} Founder`, name);
  let state = await activeState(page);
  state.facilityLevel = localCt ? 3 : 1;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.simulationSpeed = 4;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.encounters = {};
  state.employees = [];
  state.serviceOperations = [];
  state.serviceIncomeReceipts = [];
  state.retailOperations = [];
  state.retailExternalActors = [];
  state.employeeDiscussions = {};
  state.openEmployeeDiscussionId = null;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  state.environment.suspendedFounderActivity = null;
  const front = state.rooms.find((item) => item.roomDefinitionId === "room.front_desk")!;
  const exterior = state.doors.filter((door) => door.roomId === front.id && door.exterior);
  state.rooms = [
    front,
    room("gs028f.exam", "room.examination", 33, 20),
    room("gs028f.waiting", "room.waiting", 28, 28),
    ...(localCt ? [room("gs028f.ct", "room.ct", 37, 21), room("gs028f.reading", "room.reading", 46, 21)] : []),
    ...Array.from({ length: localCt ? 19 : 10 }, (_, index) => room(`gs028f.hall.${index}`, "room.hallway", 32 + index, 25)),
    ...[20, 21, 22, 23, 24, 26, 27, 28, 29].map((y) => room(`gs028f.vertical.${y}`, "room.hallway", 32, y)),
  ];
  state.doors = [
    ...exterior,
    { id: "gs028f.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs028f.exam", roomId: "gs028f.exam", side: "west", offset: 1, exterior: false },
    { id: "gs028f.waiting", roomId: "gs028f.waiting", side: "east", offset: 1, exterior: false },
    ...(localCt ? [
      { id: "gs028f.ct", roomId: "gs028f.ct", side: "south" as const, offset: 1, exterior: false },
      { id: "gs028f.reading", roomId: "gs028f.reading", side: "south" as const, offset: 1, exterior: false },
    ] : []),
  ];
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, unreachableRoomIds: [] });
  if (localCt) {
    state = addDiagnosticStaff(state, "gs028f.imaging-technician", "staff.imaging_technician", "gs028f.ct");
    state = addDiagnosticStaff(state, "gs028f.radiologist", "staff.radiologist", "gs028f.reading");
  }
  const prepared = seedPatient(deserializeGameState(serializeGameState(state)), name, clinicalCase, waiting);
  await installSeed(page, prepared);
  return prepared;
}

async function replaceWithCase(page: Page, name: string, clinicalCase: BatchCase): Promise<Prepared> {
  const state = await activeState(page);
  state.paused = true;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  const prepared = seedPatient(state, name, clinicalCase);
  await installSeed(page, prepared);
  return prepared;
}

async function setClock(page: Page, running: boolean) {
  if ((await activeState(page)).paused === !running) return;
  await page.getByRole("button", { name: running ? "Resume facility time" : "Pause facility time", exact: true }).click();
  await expect.poll(async () => (await activeState(page)).paused).toBe(!running);
}

async function openChart(page: Page, prepared: Prepared) {
  if ((await activeState(page)).openChartEncounterId !== prepared.encounterId) {
    await page.locator(".patient-folder .patient-tab").filter({ hasText: prepared.patientName }).click();
  }
  await expect.poll(async () => (await activeState(page)).openChartEncounterId).toBe(prepared.encounterId);
  await expect(page.locator(".chart-sheet")).toBeVisible();
}

async function completeCareWalk(page: Page, prepared: Prepared) {
  const exam = (await activeState(page)).rooms.find((item) => item.id === "gs028f.exam")!;
  const anchor = getRoomCareAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "patient");
  await setClock(page, true);
  await expect.poll(async () => {
    const encounter = (await activeState(page)).encounters[prepared.encounterId]!;
    return encounter.patientMovement === null && encounter.patientLocation?.x === anchor.x && encounter.patientLocation?.y === anchor.y;
  }, { timeout: 45_000 }).toBe(true);
  await setClock(page, false);
}

function questionFor(state: GameState, id: string) {
  const question = getCurrentQuestion(state, id);
  if (!question) throw new Error(`No current actionable question for ${id}.`);
  return question;
}

function assertNamedAdult(state: GameState, id: string) {
  const encounter = state.encounters[id]!;
  const question = questionFor(state, id);
  expect(encounter.patientDisplayName).not.toContain("{");
  expect(question.presentation).toContain(encounter.patientDisplayName);
  expect(question.presentation).toMatch(/\b\d+-year-old (?:woman|man|female|male)\b/i);
  expect(question.node.shuffleAnswers).toBe(true);
  expect(GS028_20261007_VARIETY2_CASE_REVIEWS.find((item) => item.caseId === encounter.frozenCase.id)?.reviewStatus).toBe("needs_clinician_review");
}

function artifact(testInfo: TestInfo, name: string, value: unknown) {
  writeFileSync(join(EVIDENCE, `${testInfo.project.name}-${name}.json`), `${JSON.stringify(value, null, 2)}\n`);
}

async function screenshot(page: Page, testInfo: TestInfo, name: string) {
  await page.screenshot({ path: join(EVIDENCE, `${testInfo.project.name}-${name}.png`), animations: "disabled", fullPage: true });
}

async function expectChoices(page: Page, prepared: Prepared, testInfo: TestInfo, prefix: string) {
  const state = await activeState(page);
  const node = questionFor(state, prepared.encounterId).node;
  const entry = GS028_20261007_VARIETY2_TIMING_ENTRIES.find((item) => item.questionVariantId === node.questionVariantId);
  if (!entry) throw new Error(`Missing timing metadata for ${node.questionVariantId}.`);
  const choices = page.locator(".cs-step.is-current .cs-answer");
  await expect(choices).toHaveCount(4);
  await expect(choices.locator(".cs-answer-label")).toHaveText(node.answerChoices.map((choice) => choice.label));
  const chart = createPrototypePlayerView(state, prepared.encounterId, false, null).chart;
  const display = chart?.decisionSteps?.find((step) => step.current)?.answerChoices ?? chart?.answerChoices;
  const quotedChoices = [];
  for (const choice of node.answerChoices) {
    const preview = getAnswerChoiceServicePreview(state, prepared.encounterId, choice.id);
    const shown = display?.find((item) => item.id === choice.id);
    const rendered = choices.filter({ has: page.locator(".cs-answer-label", { hasText: choice.label }) });
    await expect(rendered).toHaveCount(1);
    await rendered.scrollIntoViewIfNeeded();
    await expect(rendered).toBeInViewport();
    if (entry.classification.kind === "no_test") {
      expect(preview).toBeNull();
      expect(shown?.etaLabel).toBeUndefined();
      expect(shown?.detailLabel).toBeUndefined();
      await expect(rendered.locator(".cs-wait-label")).toHaveCount(0);
    } else if (preview?.kind === "no_test") {
      expect(shown!.etaLabel).toBe("No test wait");
      expect(shown!.detailLabel).toBeUndefined();
      await expect(rendered.locator(".cs-wait-label")).toHaveText("No test wait");
    } else {
      expect(preview).not.toBeNull();
      expect(shown?.etaLabel).toBeTruthy();
      await expect(rendered.locator(".cs-wait-label")).toHaveText(shown!.etaLabel!);
      expect(shown!.detailLabel).toContain("game time");
      await expect(rendered.locator(".cs-wait")).toHaveAttribute("title", shown!.detailLabel!);
    }
    quotedChoices.push({ id: choice.id, label: choice.label, kind: preview?.kind ?? "no_test", eta: shown!.etaLabel, detail: shown!.detailLabel });
  }
  const authored = GS028_20261007_VARIETY2_CASES.find((item) => item.id === state.encounters[prepared.encounterId]!.frozenCase.id)!;
  const original = authored.decisionNodes.find((item) => item.id === node.id)!;
  const shuffled = node.answerChoices.map((choice) => choice.id).join("|") !== original.answerChoices.map((choice) => choice.id).join("|");
  observedShuffles.push(shuffled);
  artifact(testInfo, `${prefix}-choices`, {
    origin: await page.evaluate(() => location.origin),
    runtimeAsset: await page.locator("script[type='module'][src]").first().getAttribute("src"),
    fixtureCampaign: true, caseId: authored.id, nodeId: node.id, shuffled, quotedChoices,
  });
  return node;
}

async function choose(page: Page, prepared: Prepared, correct: boolean) {
  const node = questionFor(await activeState(page), prepared.encounterId).node;
  const choice = node.answerChoices.find((item) => item.isCorrect === correct)!;
  await page.locator(".cs-step.is-current .cs-answer").filter({ has: page.locator(".cs-answer-label", { hasText: choice.label }) }).click();
  return node;
}

async function closePending(page: Page) {
  const close = page.getByRole("button", { name: "Return to clinic", exact: true });
  if (await close.isVisible()) await close.click();
}

async function resolveAndDepart(page: Page, prepared: Prepared, testInfo: TestInfo, prefix: string) {
  await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  let state = await activeState(page);
  const resolved = state.encounters[prepared.encounterId]!;
  expect(resolved).toMatchObject({ lifecycle: "resolved", resolutionReason: "completed" });
  const terminalOrder = resolved.terminalTestOrder?.diagnosticTiming;
  expect(resolved.patientMovement?.kind).toBe(terminalOrder ? "departing_for_offsite_testing" : "leaving_after_resolution");
  expect(resolved.patientLocation).not.toBeNull();
  const departureTick = state.facilityTick;
  const receiptsBeforeDeparture = state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === prepared.encounterId);
  await screenshot(page, testInfo, `${prefix}-departing`);
  await setClock(page, true);
  await expect.poll(async () => {
    const current = await activeState(page);
    const encounter = current.encounters[prepared.encounterId]!;
    const reached = terminalOrder && getDiagnosticOrderPlans(current).find((plan) => plan.orderId === terminalOrder.orderId)?.careComplete.reachedAtTick;
    const careComplete = !terminalOrder || (reached !== null && reached !== undefined);
    return careComplete && encounter.patientLocation === null && encounter.patientMovement === null;
  }, { timeout: terminalOrder ? 130_000 : 45_000 }).toBe(true);
  await setClock(page, false);
  state = await activeState(page);
  expect(state.facilityTick).toBeGreaterThan(departureTick);
  expect(state.encounters[prepared.encounterId]).toMatchObject({ lifecycle: "resolved", resolutionReason: "completed", patientLocation: null, patientMovement: null });
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === prepared.encounterId)).toEqual(receiptsBeforeDeparture);
  await expect(page.locator(".patient-folder .patient-tab").filter({ hasText: prepared.patientName })).toHaveCount(0);
  await screenshot(page, testInfo, `${prefix}-departed`);
  artifact(testInfo, `${prefix}-terminal`, {
    origin: await page.evaluate(() => location.origin), freshContext: true, fixtureCampaign: true,
    caseId: resolved.frozenCase.id, departureTick, departedAtTick: state.facilityTick,
    encounter: state.encounters[prepared.encounterId],
    serviceOperations: state.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId),
    serviceIncomeReceipts: receiptsBeforeDeparture,
    clinicalXp: state.clinicalXp,
    settlement: state.settlements.find((item) => item.id === resolved.settlementId),
    reviewCounts: Object.fromEntries(resolved.frozenCase.decisionNodes.map((node) => [node.primaryConceptId, state.learningHistories[node.primaryConceptId]?.reviews.length ?? 0])),
  });
  return state;
}

async function answerNoTest(page: Page, prepared: Prepared, testInfo: TestInfo, prefix: string) {
  await openChart(page, prepared);
  assertNamedAdult(await activeState(page), prepared.encounterId);
  const node = await expectChoices(page, prepared, testInfo, prefix);
  for (const choice of node.answerChoices) expect(getAnswerChoiceServicePreview(await activeState(page), prepared.encounterId, choice.id)).toBeNull();
  await screenshot(page, testInfo, `${prefix}-presentation-choices`);
  await choose(page, prepared, true);
  await expect(page.locator(".cs-feedback.is-correct")).toHaveCount(1);
  const before = await activeState(page);
  expect(before.encounters[prepared.encounterId]!.pendingResult).toBeNull();
  expect(before.encounters[prepared.encounterId]!.terminalTestOrder).toBeUndefined();
  expect(before.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId)).toEqual([]);
  await screenshot(page, testInfo, `${prefix}-feedback`);
  const state = await resolveAndDepart(page, prepared, testInfo, prefix);
  expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  expect(state.encounters[prepared.encounterId]!.deliveredResultNarratives).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === prepared.encounterId)).toEqual([]);
}

test("a new pelvic-pain patient moves Waiting to Existing, quotes every lab option, and suspected ectopic care remains urgent", async ({ page }, testInfo) => {
  const prepared = await prepare(page, "GS028F Pregnancy", batchCase("case.gs028f.gynecology.c1-late-period"), false, true);
  const waiting = page.locator(".patient-folder.is-waiting .patient-tab").filter({ hasText: prepared.patientName });
  await expect(waiting).toBeVisible();
  await expect(waiting.getByLabel("Action required")).toHaveText("!");
  await screenshot(page, testInfo, "pregnancy-waiting");
  await openChart(page, prepared);
  const existing = page.locator(".patient-folder.is-active .patient-tab").filter({ hasText: prepared.patientName });
  await expect(existing).toBeVisible();
  await expect(existing.getByLabel("Action required")).toHaveText("!");
  await completeCareWalk(page, prepared);
  const state = await activeState(page);
  assertNamedAdult(state, prepared.encounterId);
  expect(questionFor(state, prepared.encounterId).presentation).toMatch(/\b\d+-year-old woman\b/);
  const node = await expectChoices(page, prepared, testInfo, "pregnancy");
  for (const choice of node.answerChoices) expect(getAnswerChoiceServicePreview(state, prepared.encounterId, choice.id)?.kind).not.toBe("no_test");
  await screenshot(page, testInfo, "pregnancy-all-lab-choices");
  await choose(page, prepared, true);
  await expect(page.locator(".cs-feedback.is-correct")).toHaveCount(1);
  const answered = await activeState(page);
  expect(answered.encounters[prepared.encounterId]!.terminalTestOrder).toMatchObject({ serviceId: "service.basic_labs", routeId: "route.basic_labs.outsourced", status: "external_arranged" });
  expect(answered.encounters[prepared.encounterId]!.pendingResult).toBeNull();
  expect(answered.encounters[prepared.encounterId]!.deliveredResultNarratives).toEqual([]);
  expect(answered.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId)).toEqual([]);
  const departed = await resolveAndDepart(page, prepared, testInfo, "pregnancy");
  expect(departed.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  expect(departed.serviceIncomeReceipts.filter((receipt) => receipt.actorId === prepared.encounterId)).toEqual([]);
  const ectopic = await replaceWithCase(page, "GS028F Ectopic", batchCase("case.gs028f.gynecology.c2-stable-unilateral"));
  await answerNoTest(page, ectopic, testInfo, "ectopic-urgent-referral");
});

function planFor(state: GameState, encounterId: string): DiagnosticOrderPlan {
  const plan = getDiagnosticOrderPlans(state).find((item) => item.encounterId === encounterId);
  if (!plan) throw new Error(`No accepted diagnostic plan for ${encounterId}.`);
  return plan;
}

for (const [caseId, prefix, localCt] of [
  ["case.gs028f.neck-mass.paired-persistent-solid", "neck-external-corrected", false],
  ["case.gs028f.neck-mass.paired-cystic-is-not-benign", "neck-local-trained", true],
] as const) {
  test(`${prefix} preserves the CT gate across reload and returns a distinct needle-referral decision`, async ({ page }, testInfo) => {
    const clinicalCase = batchCase(caseId);
    const prepared = await prepare(page, `GS028F ${prefix}`, clinicalCase, localCt);
    await openChart(page, prepared);
    let state = await activeState(page);
    assertNamedAdult(state, prepared.encounterId);
    const first = await expectChoices(page, prepared, testInfo, prefix);
    const key = first.answerChoices.find((choice) => choice.isCorrect)!;
    const quoted = getAnswerChoiceServicePreview(state, prepared.encounterId, key.id);
    expect(quoted?.kind).not.toBe("no_test");
    const quote = quoted && "diagnosticTiming" in quoted ? quoted.diagnosticTiming : undefined;
    if (!quote) throw new Error("The CT choice lacks its actual diagnostic-phase quote.");
    expect(quote.sources[0]?.routeId).toBe(localCt ? "route.ct.in_house" : "route.ct.outsourced");
    const acquisition = quote.phases.find((phase) => phase.kind === "acquisition")!;
    const interpretation = quote.phases.find((phase) => phase.kind === "interpretation")!;
    expect(acquisition.mode).toBe(localCt ? "local" : "external");
    expect(interpretation.mode).toBe(localCt ? "local" : "external");
    if (localCt) {
      for (const capability of ["capability.ct_scanner", "capability.staff.imaging_technician", "capability.radiology_reading", "capability.staff.radiologist"]) expect(getCurrentCapabilities(state).has(capability)).toBe(true);
      expect(interpretation.resource?.roomInstanceId).toBe("gs028f.reading");
      expect(interpretation.resource?.employeeIds).toEqual(["gs028f.radiologist"]);
      expect(interpretation.resource?.stationId).toBeTruthy();
      const untrained = structuredClone(state);
      untrained.employees.forEach((employee) => { employee.trainingLevel = 1; });
      const baseline = getAnswerChoiceServicePreview(untrained, prepared.encounterId, key.id);
      const baselinePlan = baseline && "diagnosticTiming" in baseline ? baseline.diagnosticTiming : undefined;
      expect(acquisition.durationMinutes).toBeLessThan(baselinePlan!.phases.find((phase) => phase.kind === "acquisition")!.durationMinutes);
      expect(interpretation.durationMinutes).toBeLessThan(baselinePlan!.phases.find((phase) => phase.kind === "interpretation")!.durationMinutes);
    } else {
      expect(getCurrentCapabilities(state).has("capability.ct_scanner")).toBe(false);
      expect(state.employees).toEqual([]);
    }
    const narrative = first.resultGateAfter!.resultNarrative;
    const future = clinicalCase.decisionNodes[1]!.stem;
    await expect(page.getByText(narrative, { exact: true })).toHaveCount(0);
    await expect(page.getByText(future, { exact: true })).toHaveCount(0);
    await screenshot(page, testInfo, `${prefix}-first-presentation-choices`);
    const frozenOrder = first.answerChoices.map((choice) => choice.id);
    await choose(page, prepared, localCt);
    if (!localCt) {
      await expect(page.getByText(`Correct answer: ${key.label}`, { exact: false })).toHaveCount(1);
      await screenshot(page, testInfo, `${prefix}-wrong-feedback`);
    }
    await page.getByRole("button", { name: localCt ? "Enact Plan" : "Enact Corrected Plan", exact: true }).click();
    await closePending(page);
    state = await activeState(page);
    const pending = state.encounters[prepared.encounterId]!.pendingResult!;
    expect(pending).toMatchObject({ resultTypeId: "service.ct", routeId: localCt ? "route.ct.in_house" : "route.ct.outsourced", deliveredAtTick: null });
    expect(state.encounters[prepared.encounterId]!.answers[0]!.correctedForward).toBe(!localCt);
    expect(state.encounters[prepared.encounterId]!.currentNodeIndex).toBe(0);
    expect(state.encounters[prepared.encounterId]!.deliveredResultNarratives).toEqual([]);
    expect(state.learningHistories[first.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.learningHistories[clinicalCase.decisionNodes[1]!.primaryConceptId]?.reviews ?? []).toHaveLength(0);
    await expect(page.locator(".patient-folder.is-active .patient-tab").filter({ hasText: prepared.patientName }).getByLabel("Action required")).toHaveCount(0);
    const pendingTick = state.facilityTick;
    const pendingXp = state.clinicalXp;
    const acceptedPlan = planFor(state, prepared.encounterId);
    artifact(testInfo, `${prefix}-pending-plan`, { origin: ORIGIN, fixtureCampaign: true, pendingTick, acceptedPlan, quotedPlan: quote });
    await screenshot(page, testInfo, `${prefix}-pending-folder`);
    await page.reload();
    const resume = page.getByRole("button", { name: `Resume ${prepared.name}`, exact: true });
    if (await resume.isVisible()) await resume.click();
    state = await activeState(page);
    expect(state.paused).toBe(true);
    expect(state.facilityTick).toBe(pendingTick);
    expect(state.clinicalXp).toBe(pendingXp);
    expect(planFor(state, prepared.encounterId)).toEqual(acceptedPlan);
    expect(state.encounters[prepared.encounterId]!.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id)).toEqual(frozenOrder);
    expect(state.encounters[prepared.encounterId]!.pendingResult!.dueTick).toBe(pending.dueTick);
    await openChart(page, prepared);
    await expect(page.getByText(narrative, { exact: true })).toHaveCount(0);
    await expect(page.getByText(future, { exact: true })).toHaveCount(0);
    await screenshot(page, testInfo, `${prefix}-reloaded-pending-chart`);
    await closePending(page);
    await setClock(page, true);
    if (localCt) {
      await expect.poll(async () => (await activeState(page)).serviceOperations.some((operation) =>
        operation.actorId === prepared.encounterId && operation.diagnosticPhysicalWork && operation.status === "in_service"), { timeout: 50_000 }).toBe(true);
      await screenshot(page, testInfo, `${prefix}-live-local-acquisition`);
    }
    await expect.poll(async () => (await activeState(page)).encounters[prepared.encounterId]!.currentNodeIndex, { timeout: 130_000 }).toBe(1);
    await setClock(page, false);
    state = await activeState(page);
    const delivered = state.encounters[prepared.encounterId]!;
    expect(state.facilityTick).toBeGreaterThan(pendingTick);
    expect(delivered.deliveredResultNarratives).toEqual([narrative]);
    expect(delivered.pendingResult!.deliveredAtTick).not.toBeNull();
    expect(planFor(state, prepared.encounterId).resultReady.reachedAtTick).not.toBeNull();
    expect(planFor(state, prepared.encounterId).careComplete.reachedAtTick).not.toBeNull();
    await expect(page.locator(".patient-folder.is-active .patient-tab").filter({ hasText: prepared.patientName }).getByLabel("Action required")).toHaveText("!");
    await screenshot(page, testInfo, `${prefix}-returned-action-folder`);
    await openChart(page, prepared);
    await expect(page.getByTestId("chart-current-update")).toContainText(narrative);
    await expect(page.getByTestId("chart-current-update")).not.toContainText(/\bneedle\b|\bFNA\b|\bopen (?:biopsy|operation)\b/i);
    await expect(page.getByText(future, { exact: true })).toBeVisible();
    const second = await expectChoices(page, prepared, testInfo, `${prefix}-needle-referral`);
    expect(second.primaryConceptId).toBe("concept.gs028f.head-neck.initial-fna-not-open-biopsy");
    await screenshot(page, testInfo, `${prefix}-returned-new-question`);
    const operationsBeforeReferral = state.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId).map((operation) => operation.id);
    await choose(page, prepared, true);
    const referred = await activeState(page);
    expect(referred.encounters[prepared.encounterId]!.terminalTestOrder).toBeUndefined();
    expect(referred.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId).map((operation) => operation.id)).toEqual(operationsBeforeReferral);
    await screenshot(page, testInfo, `${prefix}-needle-referral-feedback`);
    state = await resolveAndDepart(page, prepared, testInfo, prefix);
    expect(state.learningHistories[first.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.learningHistories[second.primaryConceptId]?.reviews).toHaveLength(1);
    const fees = state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === prepared.encounterId);
    if (localCt) {
      expect(fees).toHaveLength(1);
      expect(fees[0]!.incomeLineId).toBe("income.ct");
      expect(fees[0]!.grossAmount).toBe(quote.sources[0]!.quoteFee);
      const completePlan = planFor(state, prepared.encounterId);
      const read = completePlan.phases.find((phase) => phase.kind === "interpretation")!;
      expect(read).toMatchObject({ mode: "local", status: "completed" });
      expect(read.resource?.employeeIds).toEqual(["gs028f.radiologist"]);
      const readingOperation = state.serviceOperations.find((operation) => operation.id === read.serviceOperationId)!;
      expect(readingOperation.diagnosticPhaseWork).toMatchObject({ kind: "interpretation", billing: "none", encounterId: prepared.encounterId });
    } else {
      expect(fees).toEqual([]);
      expect(state.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId)).toEqual([]);
    }
    artifact(testInfo, `${prefix}-completed-plan`, { origin: ORIGIN, fixtureCampaign: true, plan: planFor(state, prepared.encounterId), fees });
  });
}

test("oxygen-content counseling and confirmed sharp-object referral complete without a fabricated diagnostic order", async ({ page }, testInfo) => {
  const oxygen = await prepare(page, "GS028F Oxygen", batchCase("case.gs028f.oxygen-content.c1-anemia-normal-clip"));
  await answerNoTest(page, oxygen, testInfo, "oxygen-content");
  const sharp = await replaceWithCase(page, "GS028F Sharp object", batchCase("case.gs028f.foreign-body.c2-confirmed-fishbone"));
  await answerNoTest(page, sharp, testInfo, "sharp-emergency-referral");
  const state = await activeState(page);
  expect(state.serviceOperations.some((operation) => operation.actorId === sharp.encounterId && operation.incomeLineId.includes("endoscop"))).toBe(false);
  expect(state.encounters[sharp.encounterId]!.pendingResult).toBeNull();
  expect(state.encounters[sharp.encounterId]!.deliveredResultNarratives).toEqual([]);
});
