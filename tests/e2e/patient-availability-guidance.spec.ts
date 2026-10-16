import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  applyFsrsReview,
  createInitialGameState,
  createNewFsrsCard,
  serializeGameState,
  type GameState,
} from "@gamify-surgery/game-domain";
import { ACCESS_KEY, PROFILE_KEY } from "./helpers";

const EVIDENCE = ".local-dev/gs035/browser-evidence";
test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));

function emptyClinic(kind: "paused" | "operating" | "future-reviews"): GameState {
  const now = Date.now();
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.gs035.${kind}`,
    campaignSeed: `gs035.${kind}`,
    createdAtRealMs: now,
  });
  state.facilityLevel = 1;
  state.paused = kind === "paused";
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;

  if (kind === "future-reviews") {
    for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) {
      const reviewed = applyFsrsReview(
        createNewFsrsCard(now), "Good", now,
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.learning,
      );
      state.learningHistories[concept.id] = {
        conceptId: concept.id,
        card: { ...reviewed.card, dueAtMs: now + 86_400_000 },
        reviews: [{
          id: `review.gs035.${concept.id}`,
          encounterId: "encounter.gs035.synthetic-history",
          decisionNodeId: "decision.gs035.synthetic-history",
          questionVariantId: "question.gs035.synthetic-history",
          patientPresentationVariantId: "presentation.gs035.synthetic-history",
          primaryConceptId: concept.id,
          answerChoiceId: "answer.gs035.synthetic-history",
          correct: true,
          rating: "Good",
          reviewedAtMs: now,
          facilityTick: 0,
          schedulerLog: reviewed.log,
        }],
      };
    }
  }
  return state;
}

async function openSyntheticClinic(page: Page, state: GameState): Promise<void> {
  const now = Date.now();
  const profile = {
    schemaVersion: 2,
    activeCampaignId: state.campaignId,
    nextCampaignNumber: 2,
    tutorialsEnabled: false,
    tutorialIntroDismissedCampaignIds: [state.campaignId],
    tutorialDailyRoutineTipAcknowledgments: {},
    tutorialDailyRoutinePauseByCampaign: {},
    campaigns: [{
      campaignId: state.campaignId,
      name: "GS-035 Synthetic Clinic",
      createdAtRealMs: now,
      updatedAtRealMs: now,
      status: "resumable",
      serializedState: serializeGameState(state),
    }],
  };
  await page.addInitScript(({ profileKey, accessKey, seededProfile, issuedAt }) => {
    localStorage.setItem(profileKey, JSON.stringify(seededProfile));
    localStorage.setItem(accessKey, JSON.stringify({
      mode: "local_prototype", issuedAtRealMs: issuedAt,
      expiresAtRealMs: issuedAt + 3_600_000,
    }));
  }, { profileKey: PROFILE_KEY, accessKey: ACCESS_KEY, seededProfile: profile, issuedAt: now });
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: "Resume GS-035 Synthetic Clinic" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

for (const width of [1280, 390]) {
  test(`quiet availability guidance is readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openSyntheticClinic(page, emptyClinic("paused"));
    const message = page.locator(".patient-folder.is-waiting .empty-state");
    await expect(message).toBeVisible();
    await expect(message).toContainText(/paused/i);
    await expect(message).toContainText(/resume/i);
    const existingPlaceholder = page.locator(".patient-folder.is-active .empty-state");
    await expect(existingPlaceholder).toHaveText("No charts");
    if (width >= 1024) await expect(existingPlaceholder).toBeHidden();
    else await expect(existingPlaceholder).toBeVisible();
    await expect(message).not.toHaveAttribute("aria-live", /.+/);
    await page.screenshot({ path: `${EVIDENCE}/paused-${width}.png`, fullPage: true });
    const bounds = await message.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
    expect(errors).toEqual([]);
  });
}

test("an ordinary gap stays calm and a future review is labelled separately from arrivals", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 1280, height: 900 } });
  try {
    const ordinaryPage = await context.newPage();
    await openSyntheticClinic(ordinaryPage, emptyClinic("operating"));
    const ordinary = ordinaryPage.locator(".patient-folder.is-waiting .empty-state");
    await expect(ordinary).toBeVisible();
    await expect(ordinary).toContainText(/next eligible visit/i);
    await ordinaryPage.screenshot({ path: `${EVIDENCE}/ordinary-gap.png`, fullPage: true });
    await ordinaryPage.close();
  } finally {
    await context.close();
  }
  const reviewContext = await browser.newContext({ baseURL, viewport: { width: 390, height: 900 } });
  try {
    const reviewPage = await reviewContext.newPage();
    await openSyntheticClinic(reviewPage, emptyClinic("future-reviews"));
    const future = reviewPage.locator(".patient-folder.is-waiting .empty-state");
    await expect(future).toBeVisible();
    await expect(future).toContainText(/review/i);
    await expect(future).toContainText(/real.world/i);
    await expect(future).toContainText(/eligib/i);
    await expect(future).not.toContainText(/arrives? (at|in)|patient (at|in)/i);
    await reviewPage.screenshot({ path: `${EVIDENCE}/future-review-390.png`, fullPage: true });
  } finally {
    await reviewContext.close();
  }
});
