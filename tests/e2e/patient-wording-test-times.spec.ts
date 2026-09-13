import { mkdirSync } from "node:fs";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  serializeGameState,
  validateDomainContext,
  type GameState,
} from "@gamify-surgery/game-domain";
import { PROFILE_KEY, startClinic, waitForDecisionChoices } from "./helpers";

const ORIGIN = "http://127.0.0.1:4173";
const SCREENSHOTS = "artifacts/screenshots";

interface StoredCampaign {
  campaignId: string;
  name: string;
  serializedState: string;
}

interface StoredProfile {
  activeCampaignId: string | null;
  tutorialsEnabled?: boolean;
  campaigns: StoredCampaign[];
}

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

function contextFor(caseId: string) {
  const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (candidate) => candidate.id === caseId,
  );
  if (!clinicalCase) throw new Error(`Missing admitted case ${caseId}`);
  const conceptIds = new Set(
    clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
  );
  return validateDomainContext({
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
      cases: [clinicalCase],
      concepts: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter(
        (concept) => conceptIds.has(concept.id),
      ),
    },
  });
}

async function prepareCase(
  context: BrowserContext,
  caseId: string,
  marker: string,
  mutate?: (state: GameState, encounterId: string) => void,
): Promise<{ page: Page; patientName: string }> {
  const setupPage = await context.newPage();
  await startClinic(setupPage, `Founder ${marker}`, `Clinic ${marker}`);
  const raw = await setupPage.evaluate((key) => localStorage.getItem(key), PROFILE_KEY);
  if (!raw) throw new Error("Fresh isolated profile was not saved.");
  const profile = JSON.parse(raw) as StoredProfile;
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) throw new Error("Active isolated campaign was not found.");
  const active = profile.campaigns[activeIndex]!;
  let state = deserializeGameState(active.serializedState);
  state.facilityLevel = 2;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.paused = false;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  const domainContext = contextFor(caseId);
  state = gameReducer(
    state,
    {
      type: "ADVANCE_TICK",
      operationId: `${marker}.automatic-admission`,
      advancedAtRealMs: 1_800_000_000_000,
    },
    domainContext,
  );
  const encounter = Object.values(state.encounters).find(
    (candidate) => candidate.frozenCase.id === caseId,
  );
  if (!encounter) throw new Error(`Automatic admission did not select ${caseId}`);
  for (let tick = 0; tick < 500 && !getCurrentQuestion(state, encounter.id, domainContext); tick += 1) {
    const current = state.encounters[encounter.id]!;
    state = current.lifecycle === "waiting_unopened" && current.patientMovement === null
      ? gameReducer(state, {
          type: "OPEN_CHART",
          operationId: `${marker}.open.${tick}`,
          encounterId: encounter.id,
        }, domainContext)
      : gameReducer(state, {
          type: "ADVANCE_TICK",
          operationId: `${marker}.ready.${tick}`,
          advancedAtRealMs: 1_800_000_000_000 + tick,
        }, domainContext);
  }
  if (!getCurrentQuestion(state, encounter.id, domainContext)) {
    throw new Error(`Encounter ${encounter.id} did not become actionable.`);
  }
  mutate?.(state, encounter.id);
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  profile.campaigns[activeIndex] = {
    ...active,
    serializedState: serializeGameState(state),
  };
  profile.tutorialsEnabled = false;
  const patientName = state.encounters[encounter.id]!.patientDisplayName;
  await setupPage.close();

  const page = await context.newPage();
  await page.addInitScript(
    ({ key, nextProfile, markerKey }) => {
      if (sessionStorage.getItem(markerKey)) return;
      sessionStorage.setItem(markerKey, "installed");
      localStorage.setItem(key, JSON.stringify(nextProfile));
    },
    { key: PROFILE_KEY, nextProfile: profile, markerKey: marker },
  );
  await page.goto("/?prototype-tools=0");
  expect(new URL(page.url()).origin).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${active.name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const patient = page.locator(".patient-folder .patient-tab").filter({ hasText: patientName });
  await expect(patient).toBeVisible();
  await patient.click();
  await waitForDecisionChoices(page);
  return { page, patientName };
}

function answerChoice(page: Page, label: string) {
  return page.locator(".chart-step-column.is-current .answer-choice").filter({ hasText: label });
}

test("thyroid testing alternatives show complete neutral game-time estimates", async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const { page } = await prepareCase(
      context,
      "case.thyroid-nodule.palpable-referral",
      "timing-thyroid",
    );
    const expected = new Map([
      ["Ultrasound-guided thyroid FNA", "3 hours"],
      ["Serum thyroid-stimulating hormone", "1 hour"],
      ["Radionuclide thyroid uptake scan", "3 hours"],
      ["Repeat thyroid ultrasonography", "150 min"],
    ]);
    for (const [label, eta] of expected) {
      const choice = answerChoice(page, label);
      await expect(choice).toContainText("Estimated test wait (game time)");
      await expect(choice).toContainText(eta);
      await expect(choice).not.toContainText(/Off-site|Onsite|unavailable/i);
    }
    await expect(page.locator(".chart-step-column.is-current .answer-choice")).toHaveCount(4);
    await page.locator(".paper-chart").screenshot({
      path: `${SCREENSHOTS}/patient-wording-test-times-thyroid.png`,
    });
  } finally {
    await context.close();
  }
});

test("mixed FHH alternatives distinguish one test from no-test actions", async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const { page } = await prepareCase(
      context,
      "case.fhh.suggestive-results-confirmation",
      "timing-fhh",
    );
    const genetic = answerChoice(page, "Suspect FHH and arrange genetic testing");
    await expect(genetic).toContainText("Estimated test wait (game time)");
    await expect(genetic).toContainText("3 hours");
    for (const label of [
      "Diagnose primary hyperparathyroidism and schedule surgery",
      "Diagnose FHH from the clearance ratio alone",
      "Diagnose malignancy-associated hypercalcemia from this pattern",
    ]) {
      const choice = answerChoice(page, label);
      await expect(choice).toContainText("No test wait");
      await expect(choice).not.toContainText("Estimated test wait");
    }
    await page.locator(".paper-chart").screenshot({
      path: `${SCREENSHOTS}/patient-wording-test-times-fhh.png`,
    });
  } finally {
    await context.close();
  }
});

test("current and frozen legacy pilonidal charts use descriptive anatomy", async ({ browser }) => {
  const currentContext = await browser.newContext();
  try {
    const { page } = await prepareCase(
      currentContext,
      "case.pilonidal-disease.recurrent-drainage",
      "wording-pilonidal-current",
    );
    const chart = page.locator(".paper-chart");
    await expect(chart).toContainText("upper groove between the buttocks near the tailbone");
    await expect(chart).not.toContainText(/natal[- ]cleft/i);
    await chart.screenshot({
      path: `${SCREENSHOTS}/patient-wording-test-times-pilonidal-current.png`,
    });
  } finally {
    await currentContext.close();
  }

  const legacyContext = await browser.newContext();
  try {
    const { page } = await prepareCase(
      legacyContext,
      "case.pilonidal-disease.work-clothing",
      "wording-pilonidal-legacy",
      (state, encounterId) => {
        const frozen = state.encounters[encounterId]!.frozenCase;
        frozen.presentation =
          `${state.encounters[encounterId]!.patientDisplayName} has intermittent natal-cleft drainage and tenderness between episodes.`;
        frozen.chiefComplaint = "My natal cleft keeps draining.";
        frozen.decisionNodes[0]!.stem =
          `Which diagnosis best explains ${state.encounters[encounterId]!.patientDisplayName}'s recurrent natal-cleft finding?`;
      },
    );
    const chart = page.locator(".paper-chart");
    await expect(chart).toContainText(
      "intermittent drainage and tenderness in the upper groove between the buttocks near the tailbone",
    );
    await expect(chart).toContainText("recurrent drainage near the tailbone");
    await expect(chart).not.toContainText(/natal[- ]cleft/i);
    await chart.screenshot({
      path: `${SCREENSHOTS}/patient-wording-test-times-pilonidal-legacy.png`,
    });
  } finally {
    await legacyContext.close();
  }
});
