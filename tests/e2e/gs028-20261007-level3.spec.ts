import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import {
  GS028_20261007_LEVEL3_CASES,
  GS028_20261007_LEVEL3_CASE_REVIEWS,
  GS028_20261007_LEVEL3_TIMING_ENTRIES,
} from "../../packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch";
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
// GAMIFY_E2E_BASE_URL=http://127.0.0.1:4329 in fresh Playwright contexts only.
// These seeded test campaigns do not represent natural earnings or progression.
const ORIGIN = "http://127.0.0.1:4329";
const EVIDENCE = ".local-dev/gs028-20261007-level3/browser";
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
  const authored = GS028_20261007_LEVEL3_CASES.find((item) => item.id === id);
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
  const destination = next.rooms.find((item) => waiting ? item.roomDefinitionId === "room.front_desk" : item.id === "gs028g.exam")!;
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
    expect(naturalWaiting.reservation.roomInstanceId).toBe("gs028g.waiting");
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
  }, { key: PROFILE_KEY, value: profile, marker: `gs028g.${prepared.name}.seed` });
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
  state.facilityLevel = 3;
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
    room("gs028g.exam", "room.examination", 33, 20),
    room("gs028g.waiting", "room.waiting", 28, 28),
    ...(localCt ? [room("gs028g.ct", "room.ct", 37, 21), room("gs028g.reading", "room.reading", 46, 21)] : []),
    ...Array.from({ length: localCt ? 19 : 10 }, (_, index) => room(`gs028g.hall.${index}`, "room.hallway", 32 + index, 25)),
    ...[20, 21, 22, 23, 24, 26, 27, 28, 29].map((y) => room(`gs028g.vertical.${y}`, "room.hallway", 32, y)),
  ];
  state.doors = [
    ...exterior,
    { id: "gs028g.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs028g.exam", roomId: "gs028g.exam", side: "west", offset: 1, exterior: false },
    { id: "gs028g.waiting", roomId: "gs028g.waiting", side: "east", offset: 1, exterior: false },
    ...(localCt ? [
      { id: "gs028g.ct", roomId: "gs028g.ct", side: "south" as const, offset: 1, exterior: false },
      { id: "gs028g.reading", roomId: "gs028g.reading", side: "south" as const, offset: 1, exterior: false },
    ] : []),
  ];
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, unreachableRoomIds: [] });
  if (localCt) {
    state = addDiagnosticStaff(state, "gs028g.imaging-technician", "staff.imaging_technician", "gs028g.ct");
    state = addDiagnosticStaff(state, "gs028g.radiologist", "staff.radiologist", "gs028g.reading");
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
  const exam = (await activeState(page)).rooms.find((item) => item.id === "gs028g.exam")!;
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
  expect(GS028_20261007_LEVEL3_CASE_REVIEWS.find((item) => item.caseId === encounter.frozenCase.id)?.reviewStatus).toBe("needs_clinician_review");
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
  const entry = GS028_20261007_LEVEL3_TIMING_ENTRIES.find((item) => item.questionVariantId === node.questionVariantId);
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
  const authored = GS028_20261007_LEVEL3_CASES.find((item) => item.id === state.encounters[prepared.encounterId]!.frozenCase.id)!;
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
  const dismiss=page.getByRole("button",{name:"Dismiss and close chart",exact:true});
  if(await dismiss.isVisible()){await dismiss.click();await openChart(page,prepared);}
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


test("level3 gallbladder report progresses after a wrong answer and survives a second-decision reload",async({page},info)=>{
 const prepared=await prepare(page,"GS028G Gallbladder",batchCase("case.gs028g.incidental-gallbladder.paired-lamina-only"));
 await openChart(page,prepared);assertNamedAdult(await activeState(page),prepared.encounterId);
 const first=await expectChoices(page,prepared,info,"gb-first");await screenshot(page,info,"gb-first");
 const before=await activeState(page);expect(before.facilityLevel).toBe(3);
 const second=before.encounters[prepared.encounterId]!.frozenCase.decisionNodes[1]!;
 await expect(page.locator(".chart-sheet")).not.toContainText(second.currentUpdate!);
 await choose(page,prepared,false);await expect(page.locator(".cs-feedback.is-incorrect")).toHaveCount(1);
 const feedback=await activeState(page);expect(feedback.learningHistories[first.primaryConceptId]?.reviews).toHaveLength(1);expect(feedback.learningHistories[second.primaryConceptId]?.reviews).toHaveLength(0);
 await page.getByRole("button",{name:"Enact Plan",exact:true}).click();
 await openChart(page,prepared);await expectChoices(page,prepared,info,"gb-second");
 expect(questionFor(await activeState(page),prepared.encounterId).node.currentUpdate).toBe(second.currentUpdate);
 const frozen=(await activeState(page)).encounters[prepared.encounterId]!.frozenCase;
  await page.reload();
  const resume=page.getByRole("button",{name:`Resume ${prepared.name}`,exact:true});
  if(await resume.isVisible())await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();await openChart(page,prepared);
 expect((await activeState(page)).encounters[prepared.encounterId]!.frozenCase).toEqual(frozen);
 await screenshot(page,info,"gb-second-reloaded");await choose(page,prepared,true);
 await expect(page.locator(".cs-feedback.is-correct")).toHaveCount(1);
 const final=await resolveAndDepart(page,prepared,info,"gb");
 for(const n of frozen.decisionNodes)expect(final.learningHistories[n.primaryConceptId]?.reviews).toHaveLength(1);
});

test("level3 Merkel pair displays the planned specialist estimate and creates no generic biopsy order",async({page},info)=>{
 const prepared=await prepare(page,"GS028G Merkel",batchCase("case.gs028g.merkel-cell.paired-skin-panel"));
 await openChart(page,prepared);await expectChoices(page,prepared,info,"merkel-first");await choose(page,prepared,true);
 await page.getByRole("button",{name:"Enact Plan",exact:true}).click();await openChart(page,prepared);
 const node=await expectChoices(page,prepared,info,"merkel-staging");const state=await activeState(page);const key=node.answerChoices.find(a=>a.isCorrect)!;
 expect(getAnswerChoiceServicePreview(state,prepared.encounterId,key.id)).toMatchObject({kind:"test",timingProfileId:"timing.test.biopsy",diagnosticTiming:{execution:"preview_only"}});
 await screenshot(page,info,"merkel-staging");await choose(page,prepared,true);
 const answered=await activeState(page);expect(answered.encounters[prepared.encounterId]!.terminalTestOrder).toBeUndefined();expect(answered.serviceOperations.filter(s=>s.actorId===prepared.encounterId)).toEqual([]);
 await resolveAndDepart(page,prepared,info,"merkel");
});

test("level3 stoma recognition leads to a coherent care update without a fabricated test wait",async({page},info)=>{
 const prepared=await prepare(page,"GS028G Stoma",batchCase("case.gs028g.mucocutaneous-separation.paired-small-gap"));
 await openChart(page,prepared);await expectChoices(page,prepared,info,"stoma-first");await choose(page,prepared,true);
 await page.getByRole("button",{name:"Enact Plan",exact:true}).click();await openChart(page,prepared);
 const node=await expectChoices(page,prepared,info,"stoma-care");const state=await activeState(page);
 expect(state.encounters[prepared.encounterId]!.pendingResult).toBeNull();expect(state.encounters[prepared.encounterId]!.deliveredResultNarratives).toEqual([]);
 for(const a of node.answerChoices)expect(getAnswerChoiceServicePreview(state,prepared.encounterId,a.id)).toBeNull();
 await screenshot(page,info,"stoma-care");await choose(page,prepared,true);await resolveAndDepart(page,prepared,info,"stoma");
});
