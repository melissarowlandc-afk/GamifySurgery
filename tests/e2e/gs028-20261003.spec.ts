import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  GS028_20261003_CASES,
  GS028_20261003_TIMING_ENTRIES,
} from "../../packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch";
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

const SHOTS = ".local-dev/gs028-20261003/browser";

test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));

const pageErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page) ?? []).toEqual([]);
});

type BatchCase = (typeof GS028_20261003_CASES)[number];
type BatchNode = BatchCase["decisionNodes"][number];

function timingFor(node: BatchNode) {
  const entry = GS028_20261003_TIMING_ENTRIES.find(
    (item) => item.questionVariantId === node.questionVariantId,
  );
  if (!entry) {
    throw new Error(`Missing GS-028D timing metadata for ${node.questionVariantId}.`);
  }
  return entry;
}

async function expectChoiceTimingPreviews(page: Page, node: BatchNode) {
  const timing = timingFor(node);
  const choices = page.locator(".cs-step.is-current .cs-answer");
  if (timing.classification.kind === "no_test") {
    await expect(choices.locator(".cs-wait-label")).toHaveCount(0);
    await expect(choices.locator("small")).toHaveCount(0);
    return;
  }
  for (const choice of node.answerChoices) {
    const timingChoice = timing.classification.choices.find(
      (item) => item.choiceId === choice.id,
    );
    if (!timingChoice) {
      throw new Error(
        `Missing timing choice for ${node.questionVariantId}/${choice.id}.`,
      );
    }
    const rendered = choices.filter({ hasText: choice.label });
    await expect(rendered).toHaveCount(1);
    const eta = rendered.locator(".cs-wait-label");
    await expect(eta).toHaveCount(1);
    if (timingChoice.timing.kind === "no_test") {
      await expect(eta).toHaveText("No test wait");
      await expect(rendered.locator("small")).toHaveCount(0);
    } else {
      await expect(eta).not.toHaveText("No test wait");
      await expect(rendered.locator("small")).toHaveText(
        "Estimated test wait (game time)",
      );
    }
  }
}

function batchCase(
  predicate: (item: (typeof GS028_20261003_CASES)[number]) => boolean,
) {
  const authored = GS028_20261003_CASES.find(predicate);
  const admitted =
    authored &&
    PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (item) => item.id === authored.id,
    );
  if (!authored || !admitted) {
    throw new Error(
      "The requested GS-028D case is not available in the active player release; run this proof only after additive registry integration.",
    );
  }
  return admitted;
}

async function installSeed(
  page: Page,
  state: GameState,
  campaignName: string,
  marker: string,
) {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find(
    (item) => item.campaignId === profile.activeCampaignId,
  );
  if (!campaign) throw new Error("No active synthetic browser campaign exists.");
  campaign.name = campaignName;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ key, value, markerKey }) => {
      if (sessionStorage.getItem(markerKey)) return;
      sessionStorage.setItem(markerKey, "1");
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: PROFILE_KEY, value: profile, markerKey: marker },
  );
  await page.goto("/?prototype-tools=0");
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:4321");
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

function putCaseInExam(
  state: GameState,
  label: string,
  clinicalCase: BatchCase,
  nodeIndex = 0,
) {
  const encounterId = `${label}.encounter`;
  let next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `${label}.admit`,
    encounterId,
    caseId: clinicalCase.id,
    arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId];
  if (!encounter) throw new Error(`${label} could not admit ${clinicalCase.id}.`);
  const exam = next.rooms.find(
    (room) => room.roomDefinitionId === "room.examination",
  );
  if (!exam) throw new Error("Synthetic browser campaign lacks an examination room.");
  const definition = getRoomDefinition(exam.roomDefinitionId);
  if (!definition) throw new Error("Missing examination-room definition.");
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status =
      index < nodeIndex
        ? "completed"
        : index === nodeIndex
          ? "action_required"
          : "locked";
  });
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(exam, definition, "primary");
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  return { state: next, encounterId, patientName: encounter.patientDisplayName };
}

async function prepare(
  page: Page,
  label: string,
  clinicalCase: BatchCase,
  nodeIndex = 0,
) {
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
    ...state.rooms.filter(
      (room) => room.roomDefinitionId === "room.front_desk",
    ),
    {
      id: "gs028d.exam",
      roomDefinitionId: "room.examination",
      x: 29,
      y: 23,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "gs028d.ultrasound",
      roomDefinitionId: "room.ultrasound",
      x: 33,
      y: 23,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    ...Array.from({ length: 10 }, (_, x) => ({
      id: `gs028d.hall.${x}`,
      roomDefinitionId: "room.hallway",
      x: 32 + x,
      y: 25,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
    ...[24, 26, 27, 28].map((y) => ({
      id: `gs028d.vertical.${y}`,
      roomDefinitionId: "room.hallway",
      x: 32,
      y,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
  ];
  state.doors = [
    {
      id: "gs028d.front.exterior",
      roomId: "room.instance.founder_desk",
      side: "south",
      offset: 2,
      exterior: true,
    },
    {
      id: "gs028d.front.hall",
      roomId: "room.instance.founder_desk",
      side: "west",
      offset: 0,
      exterior: false,
    },
    {
      id: "gs028d.exam.door",
      roomId: "gs028d.exam",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "gs028d.ultrasound.door",
      roomId: "gs028d.ultrasound",
      side: "south",
      offset: 2,
      exterior: false,
    },
  ];
  const ultrasound = state.rooms.find((room) => room.id === "gs028d.ultrasound");
  if (!ultrasound) throw new Error("Synthetic browser campaign lacks an ultrasound room.");
  const ultrasoundDefinition = getRoomDefinition(ultrasound.roomDefinitionId);
  if (!ultrasoundDefinition) throw new Error("Missing ultrasound-room definition.");
  const imagingLocation = getRoomNavigationAnchor(ultrasound, ultrasoundDefinition, "staff");
  state.employees = [{
    id: "employee.gs028d.imaging",
    staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "GS028D Imaging Technician",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 26,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId: ultrasound.id,
    location: imagingLocation,
    path: [imagingLocation],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  }];
  const prepared = putCaseInExam(state, label, clinicalCase, nodeIndex);
  await installSeed(page, prepared.state, label, `${label}.seed`);
  if (prepared.patientName.includes("{patientName}")) {
    throw new Error(`${label} did not materialize a generated patient name.`);
  }
  return prepared;
}

async function replaceWithCase(
  page: Page,
  label: string,
  clinicalCase: BatchCase,
) {
  const state = (await getActiveState(page)) as unknown as GameState;
  state.paused = true;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  const prepared = putCaseInExam(state, label, clinicalCase);
  await installSeed(page, prepared.state, label, `${label}.seed`);
  return prepared;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function openChart(
  page: Page,
  encounterId: string,
  patientName: string,
) {
  const state = (await getActiveState(page)) as unknown as GameState;
  if (state.openChartEncounterId !== encounterId) {
    await page
      .locator(".patient-folder .patient-tab")
      .filter({ hasText: patientName })
      .click();
  }
  await expect
    .poll(
      async () =>
        ((await getActiveState(page)) as unknown as GameState)
          .openChartEncounterId,
    )
    .toBe(encounterId);
}

async function currentQuestion(page: Page, encounterId: string) {
  const state = (await getActiveState(page)) as unknown as GameState;
  const question = getCurrentQuestion(state, encounterId);
  if (!question) throw new Error(`No current question exists for ${encounterId}.`);
  return question;
}

async function openAndChoose(
  page: Page,
  encounterId: string,
  patientName: string,
  correct: boolean,
) {
  await openChart(page, encounterId, patientName);
  const question = await currentQuestion(page, encounterId);
  const choice = question.node.answerChoices.find(
    (item) => item.isCorrect === correct,
  );
  if (!choice) {
    throw new Error(`No ${correct ? "correct" : "wrong"} browser answer exists.`);
  }
  await page
    .getByRole("button", {
      name: new RegExp(`^${escapeRegExp(choice.label)}`),
    })
    .click();
  return { question, choice };
}

async function showAllChoices(page: Page) {
  const choices = page.locator(".cs-step.is-current .cs-answer");
  await expect(choices).toHaveCount(4);
  const last = choices.last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
}

async function screenshot(page: Page, name: string) {
  await page.screenshot({
    path: `${SHOTS}/${name}`,
    animations: "disabled",
  });
}

async function enactCorrectedPlan(page: Page) {
  await page
    .getByRole("button", { name: "Enact Corrected Plan", exact: true })
    .click();
  const close = page.getByRole("button", {
    name: "Return to clinic",
    exact: true,
  });
  if (await close.isVisible()) await close.click();
}

function advanceThroughReturnedResult(
  state: GameState,
  encounterId: string,
) {
  let advanced: GameState = { ...state, paused: false };
  const pending = advanced.encounters[encounterId]?.pendingResult;
  if (!pending) throw new Error("The synthetic result advance lacks a pending result.");
  const maximumTick = pending.dueTick + 2_000;
  for (let sequence = 0; advanced.facilityTick <= maximumTick; sequence += 1) {
    if (advanced.encounters[encounterId]?.currentNodeIndex === 1) {
      advanced.paused = true;
      return advanced;
    }
    advanced = gameReducer(advanced, {
      type: "ADVANCE_TICK",
      operationId: `gs028d.synthetic-result-tick.${sequence}`,
      advancedAtRealMs: 1_900_000_000_000 + sequence * 1_000,
    });
  }
  throw new Error(
    `The outsourced result did not return by synthetic tick ${maximumTick}.`,
  );
}

function assertNamedAgeSex(state: GameState, encounterId: string) {
  const encounter = state.encounters[encounterId];
  if (!encounter) throw new Error(`Missing encounter ${encounterId}.`);
  const question = getCurrentQuestion(state, encounterId);
  if (!question) throw new Error(`Missing materialized question for ${encounterId}.`);
  expect(encounter.patientDisplayName).not.toContain("{");
  expect(question.presentation).toContain(encounter.patientDisplayName);
  expect(question.presentation).toMatch(
    /\b\d+-year-old (?:woman|man|female|male)\b/i,
  );
}

async function answerStandalone(
  page: Page,
  prepared: ReturnType<typeof putCaseInExam>,
  screenshotPrefix: string,
) {
  await openChart(page, prepared.encounterId, prepared.patientName);
  let state = (await getActiveState(page)) as unknown as GameState;
  assertNamedAgeSex(state, prepared.encounterId);
  await expect(page.getByText(prepared.patientName, { exact: false }).first()).toBeVisible();
  const question = await currentQuestion(page, prepared.encounterId);
  expect(question.node.shuffleAnswers).toBe(true);
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, question.node);
  await screenshot(page, `${screenshotPrefix}-all-choices.png`);
  await openAndChoose(page, prepared.encounterId, prepared.patientName, true);
  await expect(page.getByText("Correct", { exact: false }).first()).toBeVisible();
  await screenshot(page, `${screenshotPrefix}-feedback.png`);
  await page
    .getByRole("button", { name: "Resolve Completed Chart", exact: true })
    .click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
  expect(state.encounters[prepared.encounterId]).toMatchObject({
    lifecycle: "resolved",
    resolutionReason: "completed",
    pendingResult: null,
    deliveredResultNarratives: [],
  });
  return { state, question };
}

test("paired access ultrasound stays outsourced despite an onsite room and imaging technician", async ({ page }) => {
  const clinicalCase = batchCase((item) =>
    item.decisionNodes.length === 2 &&
    item.decisionNodes[0]?.primaryConceptId === "concept.dialysis-access.maturation-physical-assessment" &&
    item.decisionNodes[1]?.primaryConceptId === "concept.dialysis-access.clinical-dysfunction-referral" &&
    item.decisionNodes[0]?.resultGateAfter?.resultTypeId === "service.ultrasound",
  );
  const prepared = await prepare(page, "GS028D Access ultrasound", clinicalCase);
  const { encounterId, patientName } = prepared;
  await openChart(page, encounterId, patientName);
  const firstQuestion = await currentQuestion(page, encounterId);
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, firstQuestion.node);
  await screenshot(page, "access-ultrasound-initial.png");

  const firstTiming = timingFor(firstQuestion.node);
  if (firstTiming.classification.kind === "no_test") {
    throw new Error("GS-028D access case needs per-choice timing for browser proof.");
  }
  const timedWrong = firstQuestion.node.answerChoices.find((choice) =>
    choice.isCorrect === false &&
    firstTiming.classification.choices.find((item) => item.choiceId === choice.id)?.timing.kind === "test",
  );
  if (!timedWrong) throw new Error("GS-028D access case needs a timed wrong answer for browser proof.");
  await page.getByRole("button", { name: new RegExp(`^${escapeRegExp(timedWrong.label)}`) }).click();
  await expect(page.getByText(`Correct answer: ${firstQuestion.node.answerChoices.find((item) => item.isCorrect)!.label}`, { exact: false })).toHaveCount(1);
  await screenshot(page, "access-ultrasound-wrong-feedback.png");
  await enactCorrectedPlan(page);

  let state = (await getActiveState(page)) as unknown as GameState;
  const pending = state.encounters[encounterId]?.pendingResult;
  expect(state.rooms.some((room) => room.roomDefinitionId === "room.ultrasound")).toBe(true);
  expect(state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.imaging_technician")).toBe(true);
  expect(pending).toMatchObject({ resultTypeId: "service.ultrasound", routeId: "route.ultrasound.outsourced", deliveredAtTick: null });
  expect(state.encounters[encounterId]?.currentNodeIndex).toBe(0);
  expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
  await expect(
    page.locator(".patient-folder.is-active").getByLabel("Action required"),
  ).toHaveCount(0);
  await expect(page.getByText(clinicalCase.decisionNodes[1]!.currentUpdate!, { exact: true })).toHaveCount(0);
  await screenshot(page, "access-ultrasound-outside-pending.png");

  await page.reload();
  const resume = page.getByRole("button", { name: "Resume GS028D Access ultrasound" });
  if (await resume.isVisible()) await resume.click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]?.pendingResult).toMatchObject({ dueTick: pending!.dueTick, routeId: "route.ultrasound.outsourced", deliveredAtTick: null });
  await openChart(page, encounterId, patientName);
  await expect(page.getByText(clinicalCase.decisionNodes[1]!.currentUpdate!, { exact: true })).toHaveCount(0);

  const returned = advanceThroughReturnedResult(state, encounterId);
  await installSeed(page, returned, "GS028D Access ultrasound", "GS028D Access ultrasound.returned.seed");
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]?.currentNodeIndex).toBe(1);
  expect(state.encounters[encounterId]?.deliveredResultNarratives).toContain(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative);
  await expect(page.getByRole("heading", { name: /Existing Patients/ })).toBeVisible();
  await expect(
    page.locator(".patient-folder.is-active").getByLabel("Action required"),
  ).toHaveCount(1);
  await openChart(page, encounterId, patientName);
  await expect(page.getByTestId("chart-current-update")).toContainText(clinicalCase.decisionNodes[1]!.currentUpdate!);
  const secondQuestion = await currentQuestion(page, encounterId);
  expect(secondQuestion.node.answerChoices.find((item) => item.isCorrect)?.serviceRequest).toBeNull();
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, secondQuestion.node);
  await screenshot(page, "access-ultrasound-returned-second-question.png");

  await openAndChoose(page, encounterId, patientName, true);
  await screenshot(page, "access-ultrasound-referral-feedback.png");
  await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]).toMatchObject({ lifecycle: "resolved", resolutionReason: "completed" });
  expect(state.serviceOperations.filter((operation) => operation.actorId === encounterId)).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([]);
});

test("urgent severe hyperkalaemia transfers without a clinic queue or service timing", async ({ page }) => {
  const clinicalCase = batchCase((item) =>
    item.decisionNodes.length === 1 &&
    item.decisionNodes[0]?.primaryConceptId === "concept.hyperkalaemia.severe-community-result-transfer",
  );
  const prepared = await prepare(page, "GS028D Severe hyperkalaemia", clinicalCase);
  await openChart(page, prepared.encounterId, prepared.patientName);
  let state = (await getActiveState(page)) as unknown as GameState;
  assertNamedAgeSex(state, prepared.encounterId);
  const question = await currentQuestion(page, prepared.encounterId);
  expect(question.node.answerChoices.find((item) => item.isCorrect)?.serviceRequest).toBeNull();
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, question.node);
  await screenshot(page, "urgent-hyperkalaemia-all-choices.png");
  await openAndChoose(page, prepared.encounterId, prepared.patientName, true);
  await screenshot(page, "urgent-hyperkalaemia-transfer-feedback.png");
  await page.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[prepared.encounterId]).toMatchObject({ lifecycle: "resolved", pendingResult: null, deliveredResultNarratives: [] });
  expect(state.serviceOperations.filter((operation) => operation.actorId === prepared.encounterId)).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === prepared.encounterId)).toEqual([]);
});

test("frailty, anaesthesia, and thoracic questions remain readable with named patients and timing previews", async ({ page }) => {
  const frailtyCase = batchCase((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]?.primaryConceptId === "concept.preoperative-frailty.validated-assessment");
  const anesthesiaCase = batchCase((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]?.primaryConceptId === "concept.preoperative-osa.validated-risk-screening");
  const thoracicCase = batchCase((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]?.primaryConceptId === "concept.lung-cancer-screening.annual-ldct-eligibility");

  const frailty = await prepare(page, "GS028D Frailty", frailtyCase);
  await answerStandalone(page, frailty, "frailty-readable");
  const anesthesia = await replaceWithCase(page, "GS028D Anaesthesia", anesthesiaCase);
  await answerStandalone(page, anesthesia, "anesthesia-readable");
  const thoracic = await replaceWithCase(page, "GS028D Thoracic", thoracicCase);
  await answerStandalone(page, thoracic, "thoracic-readable");
});
