import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  GS028_20261002_CASES,
  GS028_20261002_TIMING_ENTRIES,
} from "../../packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch";
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

const SHOTS = ".local-dev/gs028-20261002/browser";

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

type BatchCase = (typeof GS028_20261002_CASES)[number];
type BatchNode = BatchCase["decisionNodes"][number];

function timingFor(node: BatchNode) {
  const entry = GS028_20261002_TIMING_ENTRIES.find(
    (item) => item.questionVariantId === node.questionVariantId,
  );
  if (!entry) {
    throw new Error(`Missing GS-028C timing metadata for ${node.questionVariantId}.`);
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
  predicate: (item: (typeof GS028_20261002_CASES)[number]) => boolean,
) {
  const authored = GS028_20261002_CASES.find(predicate);
  const admitted =
    authored &&
    PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (item) => item.id === authored.id,
    );
  if (!authored || !admitted) {
    throw new Error(
      "The requested GS-028C case is not available in the active player release; run this proof only after additive registry integration.",
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
      id: "gs028c.exam",
      roomDefinitionId: "room.examination",
      x: 29,
      y: 23,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    ...Array.from({ length: 10 }, (_, x) => ({
      id: `gs028c.hall.${x}`,
      roomDefinitionId: "room.hallway",
      x: 32 + x,
      y: 25,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
    ...[24, 26, 27, 28].map((y) => ({
      id: `gs028c.vertical.${y}`,
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
      id: "gs028c.front.exterior",
      roomId: "room.instance.founder_desk",
      side: "south",
      offset: 2,
      exterior: true,
    },
    {
      id: "gs028c.front.hall",
      roomId: "room.instance.founder_desk",
      side: "west",
      offset: 0,
      exterior: false,
    },
    {
      id: "gs028c.exam.door",
      roomId: "gs028c.exam",
      side: "east",
      offset: 1,
      exterior: false,
    },
  ];
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
      operationId: `gs028c.synthetic-result-tick.${sequence}`,
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

test("targeted ultrasound survives reload, reveals its result only when returned, and ends in referral", async ({
  page,
}) => {
  const clinicalCase = batchCase(
    (item) =>
      item.decisionNodes.length === 2 &&
      item.decisionNodes[0]?.primaryConceptId ===
        "concept.palpable-breast.negative-mammogram-targeted-us" &&
      item.decisionNodes[0]?.resultGateAfter?.resultTypeId ===
        "service.ultrasound",
  );
  const prepared = await prepare(page, "GS028C Ultrasound", clinicalCase);
  const { encounterId, patientName } = prepared;
  await openChart(page, encounterId, patientName);
  const firstQuestion = await currentQuestion(page, encounterId);
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, firstQuestion.node);
  await screenshot(page, "paired-ultrasound-initial.png");

  await openAndChoose(page, encounterId, patientName, false);
  await expect(
    page.getByText(
      `Correct answer: ${firstQuestion.node.answerChoices.find((item) => item.isCorrect)!.label}`,
      { exact: false },
    ),
  ).toHaveCount(1);
  await screenshot(page, "paired-ultrasound-wrong-feedback.png");
  await enactCorrectedPlan(page);

  let state = (await getActiveState(page)) as unknown as GameState;
  const pending = state.encounters[encounterId]?.pendingResult;
  expect(pending).toMatchObject({
    resultTypeId: "service.ultrasound",
    routeId: "route.ultrasound.outsourced",
    deliveredAtTick: null,
  });
  expect(state.encounters[encounterId]?.currentNodeIndex).toBe(0);
  expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
  expect(state.learningHistories[firstQuestion.node.primaryConceptId]?.reviews[0]?.rating).toBe(
    "Again",
  );
  await expect(
    page.getByText(clinicalCase.decisionNodes[1]!.currentUpdate!, { exact: true }),
  ).toHaveCount(0);
  await screenshot(page, "paired-ultrasound-pending.png");

  await page.reload();
  const resume = page.getByRole("button", {
    name: "Resume GS028C Ultrasound",
  });
  if (await resume.isVisible()) await resume.click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
    dueTick: pending!.dueTick,
    resultTypeId: "service.ultrasound",
    deliveredAtTick: null,
  });
  expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
  await openChart(page, encounterId, patientName);
  await expect(
    page.getByText(clinicalCase.decisionNodes[1]!.currentUpdate!, { exact: true }),
  ).toHaveCount(0);
  await screenshot(page, "paired-ultrasound-pending-after-reload.png");

  const returned = advanceThroughReturnedResult(state, encounterId);
  await installSeed(
    page,
    returned,
    "GS028C Ultrasound",
    "GS028C Ultrasound.returned.seed",
  );
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]?.currentNodeIndex).toBe(1);
  expect(state.encounters[encounterId]?.deliveredResultNarratives).toContain(
    clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative,
  );
  await openChart(page, encounterId, patientName);
  await expect(page.getByTestId("chart-current-update")).toContainText(
    clinicalCase.decisionNodes[1]!.currentUpdate!,
  );
  const secondQuestion = await currentQuestion(page, encounterId);
  expect(
    secondQuestion.node.answerChoices.find((item) => item.isCorrect)?.label,
  ).toBe("Breast-specialist biopsy referral");
  expect(
    secondQuestion.node.answerChoices.find((item) => item.isCorrect)?.serviceRequest,
  ).toBeNull();
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, secondQuestion.node);
  await screenshot(page, "paired-ultrasound-returned-all-choices.png");

  const receiptsBefore = state.serviceIncomeReceipts.filter(
    (receipt) => receipt.actorId === encounterId,
  );
  const operationsBefore = state.serviceOperations.filter(
    (operation) => operation.actorId === encounterId,
  );
  await openAndChoose(page, encounterId, patientName, true);
  await screenshot(page, "paired-ultrasound-referral-feedback.png");
  await page
    .getByRole("button", { name: "Resolve Completed Chart", exact: true })
    .click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[encounterId]).toMatchObject({
    lifecycle: "resolved",
    resolutionReason: "completed",
    pendingResult: {
      resultTypeId: "service.ultrasound",
      deliveredAtTick: expect.any(Number),
    },
  });
  expect(
    state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId),
  ).toEqual(receiptsBefore);
  expect(
    state.serviceOperations.filter((operation) => operation.actorId === encounterId),
  ).toEqual(operationsBefore);
});

test("educational-tier-1 DCIS and dialysis decisions render complete shuffled standalone questions with one review", async ({
  page,
}) => {
  const dcisCase = batchCase(
    (item) =>
      item.decisionNodes.length === 1 &&
      item.decisionNodes[0]?.primaryConceptId ===
        "concept.dcis.sentinel-node-setting",
  );
  const dialysisCase = batchCase(
    (item) =>
      item.decisionNodes.length === 1 &&
      item.decisionNodes[0]?.primaryConceptId ===
        "concept.dialysis-nutrition.hospital-protein-target",
  );

  const dcis = await prepare(page, "GS028C DCIS", dcisCase);
  await answerStandalone(page, dcis, "standalone-dcis");

  const dialysis = await replaceWithCase(
    page,
    "GS028C Dialysis",
    dialysisCase,
  );
  const dialysisResult = await answerStandalone(
    page,
    dialysis,
    "standalone-dialysis",
  );
  expect(
    dialysisResult.state.learningHistories[
      "concept.dcis.sentinel-node-setting"
    ]?.reviews,
  ).toHaveLength(1);
});

test("urgent ALI and mesenteric ischemia plans resolve without clinic services or invented fees", async ({
  page,
}) => {
  const aliCase = batchCase(
    (item) =>
      item.decisionNodes.length === 1 &&
      item.decisionNodes[0]?.primaryConceptId ===
        "concept.acute-limb-ischemia.heparin-emergency-transfer",
  );
  const amiCase = batchCase(
    (item) =>
      item.decisionNodes.length === 1 &&
      item.decisionNodes[0]?.primaryConceptId ===
        "concept.acute-mesenteric-ischemia.prompt-cta",
  );

  const ali = await prepare(page, "GS028C ALI", aliCase);
  await openChart(page, ali.encounterId, ali.patientName);
  let state = (await getActiveState(page)) as unknown as GameState;
  assertNamedAgeSex(state, ali.encounterId);
  let question = await currentQuestion(page, ali.encounterId);
  expect(
    question.node.answerChoices.find((item) => item.isCorrect)?.serviceRequest,
  ).toBeNull();
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, question.node);
  await screenshot(page, "urgent-ali-all-choices.png");
  await openAndChoose(page, ali.encounterId, ali.patientName, true);
  await screenshot(page, "urgent-ali-feedback.png");
  await page
    .getByRole("button", { name: "Resolve Completed Chart", exact: true })
    .click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[ali.encounterId]).toMatchObject({
    lifecycle: "resolved",
    pendingResult: null,
    deliveredResultNarratives: [],
  });
  expect(
    state.serviceOperations.filter((operation) => operation.actorId === ali.encounterId),
  ).toEqual([]);
  expect(
    state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === ali.encounterId),
  ).toEqual([]);

  const ami = await replaceWithCase(page, "GS028C AMI", amiCase);
  await openChart(page, ami.encounterId, ami.patientName);
  state = (await getActiveState(page)) as unknown as GameState;
  assertNamedAgeSex(state, ami.encounterId);
  question = await currentQuestion(page, ami.encounterId);
  expect(
    question.node.answerChoices.find((item) => item.isCorrect)?.serviceRequest,
  ).toBeNull();
  await showAllChoices(page);
  await expectChoiceTimingPreviews(page, question.node);
  await screenshot(page, "urgent-ami-all-choices.png");
  await openAndChoose(page, ami.encounterId, ami.patientName, true);
  await screenshot(page, "urgent-ami-feedback.png");
  await page
    .getByRole("button", { name: "Resolve Completed Chart", exact: true })
    .click();
  state = (await getActiveState(page)) as unknown as GameState;
  expect(state.encounters[ami.encounterId]).toMatchObject({
    lifecycle: "resolved",
    pendingResult: null,
    deliveredResultNarratives: [],
  });
  expect(
    state.serviceOperations.filter((operation) => operation.actorId === ami.encounterId),
  ).toEqual([]);
  expect(
    state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === ami.encounterId),
  ).toEqual([]);
});
