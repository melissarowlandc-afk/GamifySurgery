import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import {
  GS028_20261007_CASES,
  GS028_20261007_TIMING_ENTRIES,
} from "../../packages/clinical-content/src/development-batch/2026-10-07-variety/variety-batch";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentCapabilities,
  getCurrentQuestion,
  getFacilityAccessValidation,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameCommand,
  type GameState,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../apps/player/src/session/viewModels";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  startClinic,
} from "./helpers";

// Deliberately isolated from the owner's canonical 4173 and private 4174 sessions.
// Use the externally managed server and fresh Playwright context; never an owner profile.
const ORIGIN = "http://127.0.0.1:4327";
const EVIDENCE = ".local-dev/gs028-20261007/browser";
const pageErrors = new WeakMap<Page, string[]>();
type BatchCase = (typeof PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases)[number];
type BatchNode = BatchCase["decisionNodes"][number];

test.setTimeout(180_000);
test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));
test.beforeEach(async ({ page }, testInfo) => {
  expect(testInfo.project.use.baseURL).toBe(ORIGIN);
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page) ?? []).toEqual([]);
});

function batchCase(predicate: (item: BatchCase) => boolean): BatchCase {
  const authored = GS028_20261007_CASES.find(predicate);
  const admitted = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (item) => item.id === authored?.id,
  );
  if (!authored || !admitted) {
    throw new Error("The requested GS028 October 7 case is not admitted to the player release. Run only after independent editorial acceptance and additive runtime integration.");
  }
  return admitted;
}

async function activeState(page: Page): Promise<GameState> {
  return (await getActiveState(page)) as unknown as GameState;
}

function room(id: string, roomDefinitionId: string, x: number, y: number): PlacedRoom {
  return { id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 };
}

function employee(state: GameState, id: string, role: string, home: PlacedRoom) {
  const definition = getRoomDefinition(home.roomDefinitionId);
  if (!definition) throw new Error(`Missing ${home.roomDefinitionId} definition.`);
  const location = getRoomNavigationAnchor(home, definition, "staff");
  return {
    id, staffRoleDefinitionId: role, displayName: id,
    appearance: state.founder.appearance, hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 1, morale: 100, trainingLevel: 1 as const,
    homeRoomInstanceId: home.id, location, path: [location], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  };
}

function putCaseInExam(state: GameState, label: string, clinicalCase: BatchCase) {
  const encounterId = `${label}.encounter`;
  // The existing runtime generates a name from the selected coherent profile when
  // displayName is omitted; the historical command type still requires that field.
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: `${label}.admit`, encounterId,
    caseId: clinicalCase.id, arrivalClass: "routine",
  } as GameCommand, PROTOTYPE_DOMAIN_CONTEXT);
  const encounter = next.encounters[encounterId];
  if (!encounter) throw new Error(`${label} could not admit ${clinicalCase.id}.`);
  const exam = next.rooms.find((item) => item.id === "gs028e.exam")!;
  const definition = getRoomDefinition(exam.roomDefinitionId)!;
  Object.assign(encounter, {
    patientMovement: null,
    patientLocation: getRoomNavigationAnchor(exam, definition, "primary"),
    assignedRoomInstanceId: exam.id, queuedCareRoomInstanceId: null,
    waitingDestination: null, checkInStatus: "checked_in",
    lifecycle: "active_action_required",
  });
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return { state: next, encounterId, patientName: encounter.patientDisplayName };
}

async function installSeed(page: Page, state: GameState, name: string) {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("No active isolated browser campaign exists.");
  campaign.name = name;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker: `gs028e.${name}.seed` });
  await page.goto("/?prototype-tools=0");
  expect(new URL(page.url()).origin).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${name}`, exact: true });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function prepare(page: Page, name: string, clinicalCase: BatchCase, withLaboratory = false) {
  await startClinic(page, `${name} Founder`, name);
  const state = await activeState(page);
  state.facilityLevel = withLaboratory ? 3 : 1;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.simulationSpeed = 4;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  state.environment.suspendedFounderActivity = null;
  state.encounters = {};
  state.employees = [];
  state.serviceOperations = [];
  state.retailOperations = [];
  state.retailExternalActors = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.employeeDiscussions = {};
  state.openEmployeeDiscussionId = null;
  const front = state.rooms.find((item) => item.roomDefinitionId === "room.front_desk")!;
  const exterior = state.doors.filter((door) => door.roomId === front.id && door.exterior);
  const phlebotomy = room("gs028e.phlebotomy", "room.phlebotomy", 33, 23);
  const laboratory = room("gs028e.laboratory", "room.laboratory", 37, 22);
  state.rooms = [
    front,
    room("gs028e.exam", "room.examination", 33, 20),
    room("gs028e.waiting", "room.waiting", 28, 28),
    ...(withLaboratory ? [phlebotomy, laboratory] : []),
    ...Array.from({ length: 10 }, (_, offset) => room(`gs028e.hall.${offset}`, "room.hallway", 32 + offset, 25)),
    ...[20, 21, 22, 23, 24, 26, 27, 28].map((y) => room(`gs028e.vertical.${y}`, "room.hallway", 32, y)),
  ];
  state.doors = [
    ...exterior,
    { id: "gs028e.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs028e.exam", roomId: "gs028e.exam", side: "west", offset: 1, exterior: false },
    { id: "gs028e.waiting", roomId: "gs028e.waiting", side: "east", offset: 0, exterior: false },
    ...(withLaboratory ? [
      { id: "gs028e.phlebotomy", roomId: phlebotomy.id, side: "south" as const, offset: 1, exterior: false },
      { id: "gs028e.laboratory", roomId: laboratory.id, side: "south" as const, offset: 1, exterior: false },
    ] : []),
  ];
  if (withLaboratory) {
    state.employees = [
      employee(state, "gs028e.phlebotomist", "staff.phlebotomist", phlebotomy),
      employee(state, "gs028e.lab-technician", "staff.laboratory_technician", laboratory),
    ];
  }
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, unreachableRoomIds: [] });
  const prepared = putCaseInExam(state, name, clinicalCase);
  await installSeed(page, prepared.state, name);
  return prepared;
}

async function replaceWithCase(page: Page, name: string, clinicalCase: BatchCase) {
  const state = await activeState(page);
  state.paused = true;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  const prepared = putCaseInExam(state, name, clinicalCase);
  await installSeed(page, prepared.state, name);
  return prepared;
}

async function openChart(page: Page, encounterId: string, patientName: string) {
  if ((await activeState(page)).openChartEncounterId !== encounterId) {
    await page.locator(".patient-folder .patient-tab").filter({ hasText: patientName }).click();
  }
  await expect.poll(async () => (await activeState(page)).openChartEncounterId).toBe(encounterId);
}

function questionFor(state: GameState, encounterId: string) {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) throw new Error(`No current question exists for ${encounterId}.`);
  return question;
}

function assertNamedAgeSex(state: GameState, encounterId: string) {
  const encounter = state.encounters[encounterId]!;
  const question = questionFor(state, encounterId);
  expect(encounter.patientDisplayName).not.toContain("{");
  expect(question.presentation).toContain(encounter.patientDisplayName);
  expect(question.presentation).toMatch(/\b\d+-year-old (?:woman|man|female|male)\b/i);
  expect(question.node.shuffleAnswers).toBe(true);
}

async function expectChoiceTiming(page: Page, encounterId: string, node: BatchNode) {
  const timing = GS028_20261007_TIMING_ENTRIES.find((item) => item.questionVariantId === node.questionVariantId);
  if (!timing) throw new Error(`Missing central timing metadata for ${node.questionVariantId}.`);
  const choices = page.locator(".chart-step-column.is-current .answer-choice");
  await expect(choices).toHaveCount(4);
  await expect(choices.locator("strong")).toHaveText(node.answerChoices.map((choice) => choice.label));
  if (timing.classification.kind === "no_test") {
    await expect(choices.locator(".answer-choice-eta")).toHaveCount(0);
    await expect(choices.locator("small")).toHaveCount(0);
  } else {
    const state = await activeState(page);
    const chart = createPrototypePlayerView(state, encounterId, false, null).chart;
    const displayed = chart?.decisionSteps?.find((step) => step.current)?.answerChoices ?? chart?.answerChoices;
    for (const choice of node.answerChoices) {
      const expectedChoice = displayed?.find((item) => item.id === choice.id);
      if (!expectedChoice?.etaLabel) throw new Error(`No central ETA exists for ${choice.id}.`);
      const rendered = choices.filter({ hasText: choice.label });
      await expect(rendered).toHaveCount(1);
      await expect(rendered.locator(".answer-choice-eta")).toHaveText(expectedChoice.etaLabel);
      await expect(rendered.locator("small")).toHaveText("Estimated test wait (game time)");
    }
  }
  await choices.last().scrollIntoViewIfNeeded();
  await expect(choices.last()).toBeInViewport();
}

async function screenshot(page: Page, testInfo: TestInfo, name: string) {
  await page.screenshot({ path: join(EVIDENCE, `${testInfo.project.name}-${name}.png`), animations: "disabled", fullPage: true });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function choose(page: Page, encounterId: string, correct: boolean) {
  const question = questionFor(await activeState(page), encounterId);
  const choice = question.node.answerChoices.find((item) => item.isCorrect === correct);
  if (!choice) throw new Error("Requested answer is unavailable.");
  await page.getByRole("button", { name: new RegExp(`^${escapeRegExp(choice.label)}`) }).click();
  return question;
}

async function resolveAndDepart(page: Page, encounterId: string, testInfo: TestInfo, prefix: string) {
  await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  let state = await activeState(page);
  const resolved = state.encounters[encounterId]!;
  expect(resolved).toMatchObject({ lifecycle: "resolved", resolutionReason: "completed" });
  expect(resolved.patientMovement?.kind).toBe("leaving_after_resolution");
  expect(resolved.patientLocation).not.toBeNull();
  const departureTick = state.facilityTick;
  await screenshot(page, testInfo, `${prefix}-departing`);
  await page.getByRole("button", { name: "Resume facility time", exact: true }).click();
  await expect.poll(async () => {
    const encounter = (await activeState(page)).encounters[encounterId];
    return encounter?.patientLocation === null && encounter.patientMovement === null;
  }, { timeout: 45_000 }).toBe(true);
  await page.getByRole("button", { name: "Pause facility time", exact: true }).click();
  state = await activeState(page);
  expect(state.facilityTick).toBeGreaterThan(departureTick);
  expect(state.encounters[encounterId]).toMatchObject({ lifecycle: "resolved", resolutionReason: "completed", patientLocation: null, patientMovement: null });
  expect(state.serviceOperations.filter((operation) => operation.actorId === encounterId)).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([]);
  await expect(page.locator(".patient-folder .patient-tab").filter({ hasText: resolved.patientDisplayName })).toHaveCount(0);
  await screenshot(page, testInfo, `${prefix}-departed`);
  writeFileSync(join(EVIDENCE, `${testInfo.project.name}-${prefix}-terminal.json`), `${JSON.stringify({
    origin: ORIGIN, isolatedProfile: true, caseId: resolved.frozenCase.id,
    departureTick, departedAtTick: state.facilityTick, lifecycle: state.encounters[encounterId]!.lifecycle,
    patientLocation: state.encounters[encounterId]!.patientLocation,
    patientMovement: state.encounters[encounterId]!.patientMovement,
    reviewCounts: Object.fromEntries(resolved.frozenCase.decisionNodes.map((node) => [node.primaryConceptId, state.learningHistories[node.primaryConceptId]?.reviews.length ?? 0])),
  }, null, 2)}\n`);
  return state;
}

async function answerStandalone(page: Page, prepared: ReturnType<typeof putCaseInExam>, testInfo: TestInfo, prefix: string) {
  await openChart(page, prepared.encounterId, prepared.patientName);
  let state = await activeState(page);
  assertNamedAgeSex(state, prepared.encounterId);
  const question = questionFor(state, prepared.encounterId);
  await screenshot(page, testInfo, `${prefix}-presentation`);
  await expectChoiceTiming(page, prepared.encounterId, question.node);
  await screenshot(page, testInfo, `${prefix}-choices`);
  await choose(page, prepared.encounterId, true);
  await expect(page.locator(".chart-step-feedback.is-correct")).toHaveCount(1);
  await screenshot(page, testInfo, `${prefix}-feedback`);
  state = await resolveAndDepart(page, prepared.encounterId, testInfo, prefix);
  expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
  expect(state.encounters[prepared.encounterId]).toMatchObject({ pendingResult: null, deliveredResultNarratives: [] });
}

test("MRI device counseling is readable from Level 1 and completes without ordering a new test", async ({ page }, testInfo) => {
  const clinicalCase = batchCase((item) => item.id === "case.gs028e.radiology.c2-unidentified-implant");
  const prepared = await prepare(page, "GS028E Radiology", clinicalCase);
  await answerStandalone(page, prepared, testInfo, "radiology");
});

test("immune mechanism and reassuring shoulder discussions remain readable and finish at Level 1", async ({ page }, testInfo) => {
  const immuneCase = batchCase((item) => item.id === "case.gs028e.immunology.c1-mediator-release");
  const contactCase = batchCase((item) => item.id === "case.gs028e.immunology.c2-nickel-cellular");
  const shoulderCase = batchCase((item) => item.id === "case.gs028e.mis-principles.c3-normal-joint-question");
  const immune = await prepare(page, "GS028E Immunology", immuneCase);
  await answerStandalone(page, immune, testInfo, "immune");
  const contact = await replaceWithCase(page, "GS028E Contact", contactCase);
  await answerStandalone(page, contact, testInfo, "contact");
  const shoulder = await replaceWithCase(page, "GS028E Shoulder", shoulderCase);
  await answerStandalone(page, shoulder, testInfo, "shoulder");
});

for (const [caseId, prefix] of [
  ["case.gs028e.coagulation.paired-elective-record-workup", "mixing-correction"],
  ["case.gs028e.coagulation.paired-specialist-bruising-review", "mixing-noncorrection"],
] as const) {
  test(`${prefix} uses external analysis despite staffed Level 3 collection and lab rooms, persists pending and returns a new question`, async ({ page }, testInfo) => {
    const clinicalCase = batchCase((item) => item.id === caseId);
    const name = `GS028E ${prefix}`;
    const prepared = await prepare(page, name, clinicalCase, true);
    const { encounterId, patientName } = prepared;
    await openChart(page, encounterId, patientName);
    let state = await activeState(page);
    assertNamedAgeSex(state, encounterId);
    const capabilities = getCurrentCapabilities(state);
    expect(capabilities.has("capability.phlebotomy_collection")).toBe(true);
    expect(capabilities.has("capability.in_house_laboratory")).toBe(true);
    expect(capabilities.has("capability.staff.phlebotomist")).toBe(true);
    expect(capabilities.has("capability.staff.laboratory_technician")).toBe(true);
    const first = questionFor(state, encounterId);
    const frozenOrder = first.node.answerChoices.map((choice) => choice.id);
    const resultNarrative = clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative;
    const futurePrompt = clinicalCase.decisionNodes[1]!.stem;
    await expect(page.getByText(resultNarrative, { exact: true })).toHaveCount(0);
    await expect(page.getByText(futurePrompt, { exact: true })).toHaveCount(0);
    await screenshot(page, testInfo, `${prefix}-presentation`);
    await expectChoiceTiming(page, encounterId, first.node);
    await screenshot(page, testInfo, `${prefix}-all-timed-choices`);
    await choose(page, encounterId, false);
    await expect(page.getByText(`Correct answer: ${first.node.answerChoices.find((choice) => choice.isCorrect)!.label}`, { exact: false })).toHaveCount(1);
    await screenshot(page, testInfo, `${prefix}-wrong-feedback`);
    await page.getByRole("button", { name: "Enact Corrected Plan", exact: true }).click();
    const close = page.getByRole("button", { name: "Return to clinic", exact: true });
    if (await close.isVisible()) await close.click();
    state = await activeState(page);
    const pending = state.encounters[encounterId]!.pendingResult;
    expect(pending).toMatchObject({ resultTypeId: "service.basic_labs", routeId: "route.basic_labs.outsourced", deliveredAtTick: null });
    expect(state.encounters[encounterId]!.currentNodeIndex).toBe(0);
    expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
    expect(state.learningHistories[first.node.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.learningHistories[clinicalCase.decisionNodes[1]!.primaryConceptId]?.reviews ?? []).toHaveLength(0);
    await expect(page.locator(".patient-folder.is-active").filter({ hasText: patientName }).getByLabel("Action required")).toHaveCount(0);
    await expect(page.getByText(resultNarrative, { exact: true })).toHaveCount(0);
    await screenshot(page, testInfo, `${prefix}-external-pending`);
    const pendingTick = state.facilityTick;
    await page.reload();
    const resumeCampaign = page.getByRole("button", { name: `Resume ${name}`, exact: true });
    if (await resumeCampaign.isVisible()) await resumeCampaign.click();
    state = await activeState(page);
    expect(state.facilityTick).toBe(pendingTick);
    expect(state.encounters[encounterId]!.pendingResult).toMatchObject({ dueTick: pending!.dueTick, routeId: "route.basic_labs.outsourced", deliveredAtTick: null });
    expect(state.encounters[encounterId]!.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id)).toEqual(frozenOrder);
    await openChart(page, encounterId, patientName);
    await expect(page.getByText(resultNarrative, { exact: true })).toHaveCount(0);
    await expect(page.getByText(futurePrompt, { exact: true })).toHaveCount(0);
    const closePending = page.getByRole("button", { name: "Return to clinic", exact: true });
    if (await closePending.isVisible()) await closePending.click();
    // This advances the actual running game. No reducer fast-forward or result injection.
    await page.getByRole("button", { name: "Resume facility time", exact: true }).click();
    await expect.poll(async () => (await activeState(page)).encounters[encounterId]?.currentNodeIndex, { timeout: 100_000 }).toBe(1);
    await page.getByRole("button", { name: "Pause facility time", exact: true }).click();
    state = await activeState(page);
    expect(state.facilityTick).toBeGreaterThan(pendingTick);
    expect(state.encounters[encounterId]!.deliveredResultNarratives).toContain(resultNarrative);
    expect(state.learningHistories[clinicalCase.decisionNodes[1]!.primaryConceptId]?.reviews ?? []).toHaveLength(0);
    await expect(page.getByRole("heading", { name: /Existing Patients/ })).toBeVisible();
    await expect(page.locator(".patient-folder.is-active").filter({ hasText: patientName }).getByLabel("Action required")).toHaveCount(1);
    await openChart(page, encounterId, patientName);
    await expect(page.getByTestId("chart-current-update")).toContainText(resultNarrative);
    const second = questionFor(await activeState(page), encounterId);
    expect(second.node.primaryConceptId).toBe("concept.coagulation.mixing-study-initial-interpretation");
    expect(second.node.answerChoices.find((choice) => choice.isCorrect)!.serviceRequest).toBeNull();
    await screenshot(page, testInfo, `${prefix}-returned-update`);
    await expectChoiceTiming(page, encounterId, second.node);
    await screenshot(page, testInfo, `${prefix}-second-choices`);
    await choose(page, encounterId, true);
    await screenshot(page, testInfo, `${prefix}-second-feedback`);
    state = await resolveAndDepart(page, encounterId, testInfo, prefix);
    expect(state.learningHistories[first.node.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.learningHistories[second.node.primaryConceptId]?.reviews).toHaveLength(1);
  });
}
