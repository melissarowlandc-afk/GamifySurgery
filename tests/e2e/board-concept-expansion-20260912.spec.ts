import { mkdirSync } from "node:fs";
import {
  expect,
  test,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";
import {
  BOARD_EXPANSION_20260912_CASES,
  BOARD_EXPANSION_20260912_TESTED_CONCEPTS,
} from "@gamify-surgery/clinical-content";
import {
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  serializeGameState,
  validateDomainContext,
  PROTOTYPE_DOMAIN_CONTEXT,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  installRememberedLocalAccess,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
const ORIGIN = "http://127.0.0.1:4173";

type StoredProfile = {
  activeCampaignId: string;
  campaigns: Array<{
    campaignId: string;
    serializedState: string;
    name: string;
  }>;
  tutorialsEnabled: boolean;
};

type Prepared = {
  id: string;
  name: string;
  caseId: string;
  campaignName: string;
  profile: StoredProfile;
  profileId: string | undefined;
  appearance: unknown;
  order: string[][];
  nodes: ReturnType<typeof target>["decisionNodes"];
};

function target(caseId: string) {
  const admitted = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (clinicalCase) => clinicalCase.id === caseId,
  );
  const authored = BOARD_EXPANSION_20260912_CASES.find(
    (clinicalCase) => clinicalCase.id === caseId,
  );
  if (!admitted || !authored || admitted.id !== authored.id) {
    throw new Error(`Missing admitted September 12 case ${caseId}`);
  }
  return admitted;
}

function domainContext(caseId: string) {
  const clinicalCase = target(caseId);
  const conceptIds = new Set(
    clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
  );
  return validateDomainContext({
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
      cases: [clinicalCase],
      concepts: BOARD_EXPANSION_20260912_TESTED_CONCEPTS.filter((concept) =>
        conceptIds.has(concept.id),
      ),
    },
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function prepareAutomaticAdmission(
  page: Page,
  caseId: string,
): Promise<Prepared> {
  const raw = await page.evaluate(
    (profileKey) => localStorage.getItem(profileKey),
    PROFILE_KEY,
  );
  if (!raw) throw new Error("The fresh campaign profile was not persisted.");
  const profile = JSON.parse(raw) as StoredProfile;
  const index = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (index < 0) throw new Error("The fresh campaign is not active.");

  const active = profile.campaigns[index]!;
  let state = deserializeGameState(active.serializedState);
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.paused = false;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  state = gameReducer(
    state,
    {
      type: "ADVANCE_TICK",
      operationId: `e2e.${caseId}.automatic-admission`,
      advancedAtRealMs: 1_800_000_000_000,
    },
    domainContext(caseId),
  );

  const encounter = Object.values(state.encounters)[0]!;
  if (
    encounter.frozenCase.id !== caseId ||
    encounter.patientDisplayName.includes("{patientName}")
  ) {
    throw new Error("Automatic admission did not materialize the requested patient.");
  }
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  profile.campaigns[index] = {
    ...active,
    serializedState: serializeGameState(state),
  };
  profile.tutorialsEnabled = false;
  return {
    id: encounter.id,
    name: encounter.patientDisplayName,
    caseId,
    campaignName: active.name,
    profile,
    profileId: encounter.frozenCase.selectedInstantiationProfileId,
    appearance: encounter.patientAppearance,
    order: encounter.frozenCase.decisionNodes.map((node) =>
      node.answerChoices.map((choice) => choice.id),
    ),
    nodes: encounter.frozenCase.decisionNodes,
  };
}

async function launchPreparedCampaign(
  browser: Browser,
  prepared: Prepared,
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const marker = `board-expansion-20260912:${prepared.profile.activeCampaignId}:${prepared.caseId}`;
  await installRememberedLocalAccess(page);
  await page.addInitScript(
    ({ markerKey, profileKey, nextProfile }) => {
      if (sessionStorage.getItem(markerKey) !== null) return;
      sessionStorage.setItem(markerKey, "installed");
      localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    },
    {
      markerKey: marker,
      profileKey: PROFILE_KEY,
      nextProfile: prepared.profile,
    },
  );
  await page.goto("/?prototype-tools=0");
  expect(new URL(page.url()).origin).toBe(ORIGIN);
  const resume = page.getByRole("button", {
    name: `Resume ${prepared.campaignName}`,
  });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  return { context, page };
}

async function createIsolatedPreparedCampaign(
  browser: Browser,
  founder: string,
  clinic: string,
  caseId: string,
) {
  const setupContext = await browser.newContext();
  try {
    const setupPage = await setupContext.newPage();
    await startClinic(setupPage, founder, clinic);
    const prepared = await prepareAutomaticAdmission(setupPage, caseId);
    await setupContext.close();
    const launched = await launchPreparedCampaign(browser, prepared);
    return { ...launched, prepared };
  } catch (error) {
    await setupContext.close();
    throw error;
  }
}

async function openChart(page: Page, prepared: Prepared) {
  const patient = page
    .locator(".patient-folder .patient-tab")
    .filter({ hasText: prepared.name });
  await expect(patient).toBeVisible({ timeout: 25_000 });
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible({ timeout: 5_000 });
}

async function open(page: Page, prepared: Prepared) {
  await openChart(page, prepared);
  await waitForDecisionChoices(page);
}

async function resumeFacilityTime(page: Page) {
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
}

async function pauseFacilityTime(page: Page) {
  const pause = page.getByRole("button", { name: "Pause facility time" });
  await expect(pause).toBeVisible({ timeout: 5_000 });
  await pause.click();
}

async function choose(page: Page, label: string) {
  const choice = page.getByRole("button", {
    name: new RegExp(`^${escapeRegExp(label)}`),
  });
  await expect(choice).toBeVisible({ timeout: 5_000 });
  await choice.click();
}

async function enact(page: Page, corrected = false) {
  const button = page.getByRole("button", {
    name: corrected ? "Enact Corrected Plan" : "Enact Plan",
    exact: true,
  });
  await expect(button).toBeVisible({ timeout: 5_000 });
  await button.click();
}

async function chooseCorrect(page: Page, prepared: Prepared) {
  const state = (await getActiveState(page)) as unknown as GameState;
  const node = getCurrentQuestion(state, prepared.id)!.node;
  await choose(page, node.answerChoices.find((choice) => choice.isCorrect)!.label);
}

async function waitForReturn(page: Page, prepared: Prepared) {
  await expect
    .poll(
      async () =>
        ((await getActiveState(page)) as unknown as GameState).encounters[
          prepared.id
        ]?.currentNodeIndex,
      { timeout: 180_000 },
    )
    .toBe(1);
  await open(page, prepared);
}

async function expectResolved(page: Page, prepared: Prepared) {
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[prepared.id]!;
  expect(encounter.lifecycle).toBe("resolved_summary_available");
  expect(encounter.resolutionReason).toBe("completed");
  expect(encounter.pendingResult).toMatchObject({
    deliveredAtTick: expect.any(Number),
  });
  expect(getCurrentQuestion(state, prepared.id)).toBeNull();
  for (const node of prepared.nodes) {
    expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(
      1,
    );
  }
}

async function expectFourTestTimes(page: Page) {
  const choices = page.locator(".chart-step-column.is-current .answer-choice");
  await expect(choices).toHaveCount(4);
  await expect(choices.locator(".answer-choice-eta")).toHaveCount(4);
  await expect(choices.locator("small")).toHaveText(
    Array(4).fill("Estimated test wait (game time)"),
  );
}

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

test("postoperative DVT gate preserves its frozen pending encounter through reload", async ({
  browser,
}, testInfo) => {
  testInfo.setTimeout(300_000);
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "controlled desktop only",
  );
  const { context, page, prepared } = await createIsolatedPreparedCampaign(
    browser,
    "Board DVT Founder",
    "Board DVT Clinic",
    "case.postoperative-dvt.colectomy",
  );
  try {
    await setFastFacilitySpeed(page);
    await resumeFacilityTime(page);
    await open(page, prepared);
    await expect(page.getByText(prepared.name, { exact: true }).first()).toBeVisible();
    await expect(page.getByText("CURRENT UPDATE")).toHaveCount(0);
    await expectFourTestTimes(page);
    await page.screenshot({
      path: `${SCREENSHOTS}/board-expansion-20260912-dvt-initial.png`,
      animations: "disabled",
    });

    await chooseCorrect(page, prepared);
    await enact(page);
    await openChart(page, prepared);
    await expect(page.locator(".chart-pending-card")).toContainText(
      "venous duplex",
    );
    const beforeReload = (await getActiveState(page)) as unknown as GameState;
    const pending = beforeReload.encounters[prepared.id]!.pendingResult!;
    expect(pending.resultTypeId).toBe("service.venous_duplex");
    expect(pending.dueTick).toBeGreaterThan(beforeReload.facilityTick);
    await pauseFacilityTime(page);
    await page.screenshot({
      path: `${SCREENSHOTS}/board-expansion-20260912-dvt-pending.png`,
      animations: "disabled",
    });
    await page.reload();
    expect(new URL(page.url()).origin).toBe(ORIGIN);
    const resumeCampaign = page.getByRole("button", {
      name: `Resume ${prepared.campaignName}`,
    });
    if (await resumeCampaign.isVisible()) await resumeCampaign.click();
    const restoredState = (await getActiveState(page)) as unknown as GameState;
    const restored = restoredState.encounters[prepared.id]!;
    expect(restored.pendingResult?.dueTick).toBe(pending.dueTick);
    expect(restored.pendingResult?.resultTypeId).toBe("service.venous_duplex");
    expect(restored.frozenCase.selectedInstantiationProfileId).toBe(
      prepared.profileId,
    );
    expect(restored.patientDisplayName).toBe(prepared.name);
    expect(restored.patientAppearance).toEqual(prepared.appearance);
    expect(
      restored.frozenCase.decisionNodes.map((node) =>
        node.answerChoices.map((choice) => choice.id),
      ),
    ).toEqual(prepared.order);

    await resumeFacilityTime(page);
    await waitForReturn(page, prepared);
    await expect(page.getByTestId("chart-current-update")).toContainText(
      prepared.nodes[1]!.currentUpdate!,
    );
    const choices = page.locator(
      ".chart-step-column.is-current .answer-choice",
    );
    await expect(choices).toHaveCount(4);
    await expect(choices.locator(".answer-choice-eta")).toHaveCount(4);
    await expect(choices.getByText("No test wait", { exact: true })).toHaveCount(
      3,
    );
    await expect(choices.locator("small")).toHaveText([
      "Estimated test wait (game time)",
    ]);
    await page.screenshot({
      path: `${SCREENSHOTS}/board-expansion-20260912-dvt-returned.png`,
      animations: "disabled",
    });
    await chooseCorrect(page, prepared);
    await expectResolved(page, prepared);
  } finally {
    await context.close();
  }
});

test("anal lesion wrong answer follows the corrected combined biopsy and staging path", async ({
  browser,
}, testInfo) => {
  testInfo.setTimeout(300_000);
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "controlled desktop only",
  );
  const { context, page, prepared } = await createIsolatedPreparedCampaign(
    browser,
    "Board Anal Founder",
    "Board Anal Clinic",
    "case.anal-squamous-cell-cancer.bleeding-lesion",
  );
  try {
    await setFastFacilitySpeed(page);
    await resumeFacilityTime(page);
    await open(page, prepared);
    await expectFourTestTimes(page);
    await expect(page.getByText("CURRENT UPDATE")).toHaveCount(0);
    await page.screenshot({
      path: `${SCREENSHOTS}/board-expansion-20260912-anal-initial.png`,
      animations: "disabled",
    });

    const initialState = (await getActiveState(page)) as unknown as GameState;
    const first = getCurrentQuestion(initialState, prepared.id)!.node;
    const key = first.answerChoices.find((choice) => choice.isCorrect)!;
    const wrong = first.answerChoices.find((choice) => !choice.isCorrect)!;
    await expect(
      page.getByText(`Correct answer: ${key.label}`, { exact: false }),
    ).toHaveCount(0);
    await choose(page, wrong.label);
    await expect(
      page.locator(".chart-step-column.is-current .chart-step-feedback"),
    ).toContainText(`Correct answer: ${key.label}`);
    await enact(page, true);
    await openChart(page, prepared);
    await expect(page.locator(".chart-pending-card")).toContainText(
      "lesion biopsy and staging",
    );
    await expect(page.getByTestId("chart-current-update")).toHaveCount(0);
    const pendingState = (await getActiveState(page)) as unknown as GameState;
    expect(pendingState.encounters[prepared.id]!.pendingResult).toMatchObject({
      resultTypeId: "service.anal_lesion_biopsy_staging",
      routeId: "route.anal_lesion_biopsy_staging.outsourced",
    });
    await page.screenshot({
      path: `${SCREENSHOTS}/board-expansion-20260912-anal-pending.png`,
      animations: "disabled",
    });

    await waitForReturn(page, prepared);
    const update = prepared.nodes[1]!.currentUpdate!;
    await expect(page.getByTestId("chart-current-update")).toHaveCount(1);
    await expect(page.getByTestId("chart-current-update")).toContainText(update);
    const history = page.locator(".chart-completed-decision");
    await expect(history).toHaveCount(1);
    await expect(history).not.toContainText(update);
    await history.locator("summary").click();
    await expect(history.locator(".chart-step-feedback")).toContainText(
      `Correct answer: ${key.label}`,
    );
    const returnedState = (await getActiveState(page)) as unknown as GameState;
    expect(
      returnedState.learningHistories[first.primaryConceptId]?.reviews[0]
        ?.rating,
    ).toBe("Again");
    await page.screenshot({
      path: `${SCREENSHOTS}/board-expansion-20260912-anal-returned.png`,
      animations: "disabled",
    });
    await chooseCorrect(page, prepared);
    await expectResolved(page, prepared);
  } finally {
    await context.close();
  }
});
