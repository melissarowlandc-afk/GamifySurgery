import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  GS028_20260928_CASES,
} from "../../packages/clinical-content/src/development-batch/2026-09-28-pre-endoscopy/pre-endoscopy-batch";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentQuestion,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  installRememberedLocalAccess,
  startClinic,
} from "./helpers";

const SHOTS = ".local-dev/gs028-20260928-baseline/browser";

test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));

function batchCase(fragment: string, predicate: (item: (typeof GS028_20260928_CASES)[number]) => boolean = () => true) {
  const authored = GS028_20260928_CASES.find((item) => item.id.includes(fragment) && predicate(item));
  const admitted = authored && PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) => item.id === authored.id);
  if (!authored || !admitted) {
    throw new Error(`GS-028 ${fragment} case is not available in the active player release; run this only after the additive registry integration.`);
  }
  return admitted;
}

async function installSeed(page: Page, state: GameState, campaignName: string, marker: string) {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("No active synthetic browser campaign exists.");
  campaign.name = campaignName;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, markerKey }) => {
    if (sessionStorage.getItem(markerKey)) return;
    sessionStorage.setItem(markerKey, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, markerKey: marker });
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function prepare(page: Page, label: string, clinicalCase: ReturnType<typeof batchCase>, nodeIndex = 0) {
  await installRememberedLocalAccess(page);
  await startClinic(page, `${label} Founder`, label);
  let state = (await getActiveState(page)) as unknown as GameState;
  state.facilityLevel = 2;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    ...state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk"),
    { id: "gs028.exam", roomDefinitionId: "room.examination", x: 29, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 10 }, (_, x) => ({ id: `gs028.hall.${x}`, roomDefinitionId: "room.hallway", x: 32 + x, y: 25, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    ...[24, 26, 27, 28].map((y) => ({ id: `gs028.vertical.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  ];
  state.doors = [
    { id: "gs028.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 2, exterior: true },
    { id: "gs028.front.hall", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "gs028.exam.door", roomId: "gs028.exam", side: "east", offset: 1, exterior: false },
  ];
  state = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: `${label}.admit`, encounterId: `${label}.encounter`,
    caseId: clinicalCase.id, arrivalClass: "routine",
  });
  const encounter = state.encounters[`${label}.encounter`];
  if (!encounter) throw new Error(`${label} could not admit ${clinicalCase.id}.`);
  const exam = state.rooms.find((room) => room.roomDefinitionId === "room.examination");
  if (!exam) throw new Error("Synthetic browser campaign lacks an examination room.");
  const definition = getRoomDefinition(exam.roomDefinitionId);
  if (!definition) throw new Error("Missing examination-room definition.");
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => { step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked"; });
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(exam, definition, "primary");
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  await installSeed(page, state, label, `${label}.seed`);
  if (encounter.patientDisplayName.includes("{patientName}")) {
    throw new Error(`${label} did not materialize a generated patient name.`);
  }
  return { id: encounter.id, patientName: encounter.patientDisplayName };
}

function escapeRegExp(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

async function openChart(page: Page, encounterId: string, patientName: string) {
  const state = (await getActiveState(page)) as unknown as GameState;
  if (state.openChartEncounterId !== encounterId) {
    await page.locator(".patient-folder .patient-tab").filter({ hasText: patientName }).click();
  }
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).openChartEncounterId).toBe(encounterId);
}

async function openAndChoose(page: Page, encounterId: string, patientName: string, correct: boolean) {
  await openChart(page, encounterId, patientName);
  const state = (await getActiveState(page)) as unknown as GameState;
  const question = getCurrentQuestion(state, encounterId);
  const choice = question?.node.answerChoices.find((item) => item.isCorrect === correct);
  if (!choice) throw new Error(`No ${correct ? "correct" : "wrong"} browser answer exists.`);
  await page.getByRole("button", { name: new RegExp(`^${escapeRegExp(choice.label)}`) }).click();
  return { question: question!, choice };
}

async function enact(page: Page, corrected = false) {
  await page.getByRole("button", { name: corrected ? "Enact Corrected Plan" : "Enact Plan", exact: true }).click();
  const close = page.getByRole("button", { name: "Return to clinic", exact: true });
  if (await close.isVisible()) await close.click();
}

async function resume(page: Page) {
  await page.getByRole("button", { name: "Set facility speed to 4x" }).click();
  await page.getByRole("button", { name: "Resume facility time" }).click();
}

async function pause(page: Page) {
  const button = page.getByRole("button", { name: "Pause facility time" });
  if (await button.isVisible()) await button.click();
}

test("varicose reflux gate keeps the result hidden across reload and releases the returned plan", async ({ page }, testInfo) => {
  testInfo.setTimeout(300_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop only");
  const clinicalCase = batchCase("varicose-veins", (item) => item.decisionNodes.length === 2 && item.decisionNodes[0]?.resultGateAfter !== null);
  const prepared = await prepare(page, "GS028 Varicose", clinicalCase);
  const { id: encounterId, patientName } = prepared;
  await openChart(page, encounterId, patientName);
  const varicoseChoices = page.locator(".chart-step-column.is-current .answer-choice");
  await expect(varicoseChoices).toHaveCount(4);
  await expect(varicoseChoices.locator(".answer-choice-eta")).toHaveCount(4);
  await expect(varicoseChoices.locator("small")).toHaveText(Array(4).fill("Estimated test wait (game time)"));
  await page.screenshot({ path: `${SHOTS}/varicose-initial.png`, animations: "disabled" });
  const { question } = await openAndChoose(page, encounterId, patientName, false);
  await expect(page.getByText(`Correct answer: ${question.node.answerChoices.find((item) => item.isCorrect)!.label}`, { exact: false })).toHaveCount(1);
  await enact(page, true);
  let state = (await getActiveState(page)) as unknown as GameState;
  const pending = state.encounters[encounterId]!.pendingResult!;
  expect(pending).toMatchObject({ resultTypeId: "service.venous_duplex", routeId: "route.venous_duplex.outsourced", deliveredAtTick: null });
  expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
  await page.screenshot({ path: `${SHOTS}/varicose-pending.png`, animations: "disabled" });
  await page.reload();
  const resumeCampaign = page.getByRole("button", { name: "Resume GS028 Varicose" });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]!.pendingResult).toMatchObject({ dueTick: pending.dueTick, resultTypeId: "service.venous_duplex", deliveredAtTick: null });
  await resume(page);
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).encounters[encounterId]?.currentNodeIndex, { timeout: 180_000 }).toBe(1);
  await pause(page);
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]!.deliveredResultNarratives).toContain(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative);
  expect(state.learningHistories[question.node.primaryConceptId]?.reviews[0]?.rating).toBe("Again");
  await openChart(page, encounterId, patientName);
  await expect(page.getByTestId("chart-current-update")).toContainText(clinicalCase.decisionNodes[1]!.currentUpdate!);
  await page.screenshot({ path: `${SHOTS}/varicose-returned.png`, animations: "disabled" });
  await openAndChoose(page, encounterId, patientName, true);
  await page.screenshot({ path: `${SHOTS}/varicose-terminal-feedback.png`, animations: "disabled" });
  await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  expect(((await getActiveState(page)) as unknown as GameState).encounters[encounterId]).toMatchObject({ lifecycle: "resolved", resolutionReason: "completed" });
});

test("GCS total is a standalone no-test encounter with no result narrative leak", async ({ page }) => {
  const clinicalCase = batchCase("glasgow-coma-scale", (item) => item.decisionNodes.length === 1);
  const prepared = await prepare(page, "GS028 GCS", clinicalCase);
  const { id: encounterId, patientName } = prepared;
  await openChart(page, encounterId, patientName);
  await page.screenshot({ path: `${SHOTS}/gcs-presentation.png`, animations: "disabled" });
  const { question } = await openAndChoose(page, encounterId, patientName, true);
  await expect(page.locator(".chart-step-column.is-current .answer-choice-eta")).toHaveCount(0);
  await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  const state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]).toMatchObject({ lifecycle: "resolved", pendingResult: null, deliveredResultNarratives: [] });
  expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
});

test("primary midline hernia is independently playable in another synthetic clinic", async ({ page }) => {
  const clinicalCase = batchCase("primary-midline-hernia");
  const prepared = await prepare(page, "GS028 Hernia", clinicalCase, 0);
  const { id: encounterId, patientName } = prepared;
  await openChart(page, encounterId, patientName);
  await page.screenshot({ path: `${SHOTS}/hernia-presentation.png`, animations: "disabled" });
  const { question } = await openAndChoose(page, encounterId, patientName, true);
  const isTerminal = clinicalCase.decisionNodes.length === 1;
  if (isTerminal) {
    await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  } else {
    await enact(page);
  }
  const state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]!.frozenCase.id).toBe(clinicalCase.id);
  expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
  expect(state.encounters[encounterId]!.patientDisplayName).toBe(patientName);
});
