import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  TWENTY_CONCEPT_BATCH_CASES,
  TWENTY_CONCEPT_BATCH_CONCEPTS,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  validateDomainContext,
  type EncounterState,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

interface StoredCampaign {
  campaignId: string;
  name: string;
  serializedState: string;
  [key: string]: unknown;
}

interface StoredProfile {
  activeCampaignId: string | null;
  tutorialsEnabled: boolean;
  campaigns: StoredCampaign[];
  [key: string]: unknown;
}

interface PreparedEncounter {
  id: string;
  patientName: string;
  caseId: string;
  demographics: unknown;
  appearance: unknown;
  answerOrders: string[][];
  nodes: EncounterState["frozenCase"]["decisionNodes"];
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function requiredCurrentUpdate(
  node: EncounterState["frozenCase"]["decisionNodes"][number],
): string {
  if (!node.currentUpdate) throw new Error(`Node ${node.id} has no current update.`);
  return node.currentUpdate;
}

function findTargetCase(caseId: string) {
  const clinicalCase = TWENTY_CONCEPT_BATCH_CASES.find(
    (candidate) => candidate.id === caseId,
  );
  if (!clinicalCase) throw new Error(`Missing active batch case ${caseId}.`);
  return clinicalCase;
}

function targetContext(caseId: string) {
  const clinicalCase = findTargetCase(caseId);
  const conceptIds = new Set(
    clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
  );
  return validateDomainContext({
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
      cases: [clinicalCase],
      concepts: TWENTY_CONCEPT_BATCH_CONCEPTS.filter((concept) =>
        conceptIds.has(concept.id),
      ),
    },
  });
}

function prepareAutomaticAdmission(
  serializedState: string,
  caseId: string,
  facilityLevel: 1 | 2,
): { serializedState: string; encounter: PreparedEncounter } {
  let state = deserializeGameState(serializedState);
  state.facilityLevel = facilityLevel;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  state = gameReducer(
    state,
    {
      type: "ADVANCE_TICK",
      operationId: `e2e.${caseId}.automatic-admission`,
      advancedAtRealMs: 1_800_000_000_000,
    },
    targetContext(caseId),
  );
  const encounter = Object.values(state.encounters)[0];
  if (!encounter || encounter.frozenCase.id !== caseId) {
    throw new Error(`Production admission did not select ${caseId}.`);
  }
  if (encounter.patientDisplayName.includes("{patientName}")) {
    throw new Error("Production admission did not materialize the patient name.");
  }
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return {
    serializedState: serializeGameState(state),
    encounter: {
      id: encounter.id,
      patientName: encounter.patientDisplayName,
      caseId: encounter.frozenCase.id,
      demographics: encounter.frozenCase.prototypeDemographics,
      appearance: encounter.patientAppearance,
      answerOrders: encounter.frozenCase.decisionNodes.map((node) =>
        node.answerChoices.map((choice) => choice.id),
      ),
      nodes: encounter.frozenCase.decisionNodes,
    },
  };
}

async function installPreparedCampaignOnce(
  page: Page,
  caseId: string,
  facilityLevel: 1 | 2,
): Promise<PreparedEncounter> {
  const rawProfile = await page.evaluate((key) => localStorage.getItem(key), PROFILE_KEY);
  if (!rawProfile) throw new Error("The fresh campaign profile was not persisted.");
  const profile = JSON.parse(rawProfile) as StoredProfile;
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) throw new Error("The fresh campaign is not active.");
  const active = profile.campaigns[activeIndex]!;
  const prepared = prepareAutomaticAdmission(
    active.serializedState,
    caseId,
    facilityLevel,
  );
  profile.campaigns[activeIndex] = {
    ...active,
    serializedState: prepared.serializedState,
  };
  profile.tutorialsEnabled = false;
  const marker = `autonomous-clinical-batch:${active.campaignId}:${caseId}`;
  await page.addInitScript(
    ({ markerKey, profileKey, nextProfile }) => {
      if (sessionStorage.getItem(markerKey) !== null) return;
      sessionStorage.setItem(markerKey, "installed");
      localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    },
    { markerKey: marker, profileKey: PROFILE_KEY, nextProfile: profile },
  );

  // The guarded script runs in the new document, after the old page has had
  // its normal pagehide/autosave opportunity. Reloads then retain real play.
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: `Resume ${active.name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  return prepared.encounter;
}

async function openPreparedEncounter(
  page: Page,
  encounter: PreparedEncounter,
): Promise<void> {
  const patient = page
    .locator(".patient-folder .patient-tab")
    .filter({ hasText: encounter.patientName });
  await expect(patient).toBeVisible({ timeout: 20_000 });
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible();
  await expect(
    page.locator(".paper-chart").getByText(encounter.patientName, { exact: true }),
  ).toBeVisible();
}

async function clickCorrectAnswer(
  page: Page,
  encounterId: string,
): Promise<void> {
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[encounterId]!;
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
  await page
    .getByRole("button", {
      name: new RegExp(`^${escapeRegex(correct.label)}(?:$|\\s)`),
    })
    .click();
  await expect(
    page.locator(".chart-step-column.is-current .chart-step-feedback"),
  ).toContainText("Correct");
}

async function enactPlan(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
}

async function openPendingEncounter(
  page: Page,
  encounter: PreparedEncounter,
): Promise<void> {
  const patient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: encounter.patientName });
  await expect(patient).toBeVisible();
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible();
}

async function finishEncounter(page: Page, encounterId: string): Promise<void> {
  const enact = page.getByRole("button", { name: "Enact Plan", exact: true });
  if (await enact.isVisible()) await enact.click();
  const dismiss = page.getByRole("button", { name: "Dismiss", exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
  await page.getByRole("button", { name: "Resolve Completed Chart" }).click();
  await expect
    .poll(async () => {
      const state = (await getActiveState(page)) as unknown as GameState;
      return state.encounters[encounterId]?.lifecycle;
    })
    .toBe("resolved");
}

async function reopenWhenReady(
  page: Page,
  encounter: PreparedEncounter,
  timeout: number,
): Promise<void> {
  const patient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: encounter.patientName });
  await expect(patient).toHaveAccessibleName(/Action required/, { timeout });
  await patient.click();
  await waitForDecisionChoices(page);
}

function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const isKnownMissingFavicon =
      message.location().url === "http://127.0.0.1:4173/favicon.ico" &&
      message.text().includes("404");
    if (!isKnownMissingFavicon) errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  return errors;
}

test("celiac pathway preserves a generated patient through two real service waits and reload", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(240_000);
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The timed clinical walkthrough runs once at the controlled desktop viewport.",
  );
  const browserErrors = collectBrowserErrors(page);
  await startClinic(page, "Celiac E2E Founder", "Celiac E2E Clinic");
  const prepared = await installPreparedCampaignOnce(
    page,
    "case.celiac.chronic-diarrhea",
    2,
  );
  await setFastFacilitySpeed(page);
  await openPreparedEncounter(page, prepared);

  const initialState = (await getActiveState(page)) as unknown as GameState;
  const initial = initialState.encounters[prepared.id]!;
  expect(initial.frozenCase.id).toBe(prepared.caseId);
  expect(initial.frozenCase.prototypeDemographics).toEqual(prepared.demographics);
  expect(initial.patientAppearance).toEqual(prepared.appearance);
  expect(
    initial.frozenCase.decisionNodes.map((node) =>
      node.answerChoices.map((choice) => choice.id),
    ),
  ).toEqual(prepared.answerOrders);
  await expect(page.getByText("Decision 1 of 3", { exact: true })).toBeVisible();
  await expect(page.getByText(requiredCurrentUpdate(prepared.nodes[1]!), { exact: true })).toHaveCount(0);
  await expect(page.getByText(requiredCurrentUpdate(prepared.nodes[2]!), { exact: true })).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[1]!.stem, { exact: true })).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[2]!.stem, { exact: true })).toHaveCount(0);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/autonomous-clinical-batch-celiac-initial.png`,
    animations: "disabled",
  });

  await clickCorrectAnswer(page, prepared.id);
  await enactPlan(page);
  await openPendingEncounter(page, prepared);
  await expect(page.locator(".chart-pending-card")).toContainText(
    "Off-site basic laboratory testing",
  );
  await expect(
    page.getByText("Service route unavailable", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(requiredCurrentUpdate(prepared.nodes[1]!), { exact: true })).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[1]!.stem, { exact: true })).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[2]!.stem, { exact: true })).toHaveCount(0);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/autonomous-clinical-batch-celiac-labs-pending.png`,
    animations: "disabled",
  });

  const scheduled = (await getActiveState(page) as unknown as GameState)
    .encounters[prepared.id]!.pendingResult!.scheduledAtTick;
  await expect
    .poll(async () => (await getActiveState(page) as unknown as GameState).facilityTick, {
      timeout: 20_000,
    })
    .toBeGreaterThanOrEqual(scheduled + 15);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const beforeReload = (await getActiveState(page)) as unknown as GameState;
  const pendingBeforeReload = beforeReload.encounters[prepared.id]!.pendingResult!;
  expect(pendingBeforeReload.deliveredAtTick).toBeNull();
  expect(beforeReload.paused).toBe(true);
  await page.reload();
  const resumeCampaign = page.getByRole("button", { name: /^Resume Celiac E2E Clinic$/ });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const afterReload = (await getActiveState(page)) as unknown as GameState;
  const reloaded = afterReload.encounters[prepared.id]!;
  expect(afterReload.facilityTick).toBeGreaterThanOrEqual(beforeReload.facilityTick);
  expect(reloaded.pendingResult?.dueTick).toBe(pendingBeforeReload.dueTick);
  expect(reloaded.patientDisplayName).toBe(prepared.patientName);
  expect(reloaded.frozenCase.prototypeDemographics).toEqual(prepared.demographics);
  expect(reloaded.patientAppearance).toEqual(prepared.appearance);
  expect(
    reloaded.frozenCase.decisionNodes.map((node) =>
      node.answerChoices.map((choice) => choice.id),
    ),
  ).toEqual(prepared.answerOrders);
  expect(afterReload.paused).toBe(true);
  await page.getByRole("button", { name: "Resume facility time" }).click();

  await reopenWhenReady(page, prepared, 30_000);
  await expect(page.getByText("Decision 2 of 3", { exact: true })).toBeVisible();
  await expect(page.getByTestId("chart-current-update")).toContainText(
    requiredCurrentUpdate(prepared.nodes[1]!),
  );
  await expect(page.getByText(requiredCurrentUpdate(prepared.nodes[2]!), { exact: true })).toHaveCount(0);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/autonomous-clinical-batch-celiac-labs-result.png`,
    animations: "disabled",
  });

  await clickCorrectAnswer(page, prepared.id);
  await enactPlan(page);
  await openPendingEncounter(page, prepared);
  await expect(page.locator(".chart-pending-card")).toContainText(
    "Off-site upper endoscopy with duodenal biopsy",
  );
  await expect(
    page.getByText("Service route unavailable", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(requiredCurrentUpdate(prepared.nodes[2]!), { exact: true })).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[2]!.stem, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Return to clinic" }).click();

  await reopenWhenReady(page, prepared, 100_000);
  await expect(page.getByText("Decision 3 of 3", { exact: true })).toBeVisible();
  await expect(page.getByTestId("chart-current-update")).toContainText(
    requiredCurrentUpdate(prepared.nodes[2]!),
  );
  await clickCorrectAnswer(page, prepared.id);
  const completedState = (await getActiveState(page)) as unknown as GameState;
  expect(completedState.encounters[prepared.id]!.deliveredResultNarratives).toHaveLength(2);
  for (const conceptId of [
    "concept.celiac.initial-serology",
    "concept.celiac.duodenal-biopsy-confirmation",
    "concept.celiac.gluten-free-treatment",
  ]) {
    expect(completedState.learningHistories[conceptId]!.reviews).toHaveLength(1);
  }
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/autonomous-clinical-batch-celiac-final.png`,
    animations: "disabled",
  });
  await finishEncounter(page, prepared.id);
  expect(browserErrors).toEqual([]);
});

test("soft-tissue mass pathway completes the real external MRI route before biopsy planning", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(150_000);
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The timed clinical walkthrough runs once at the controlled desktop viewport.",
  );
  const browserErrors = collectBrowserErrors(page);
  await startClinic(page, "MRI E2E Founder", "MRI E2E Clinic");
  const prepared = await installPreparedCampaignOnce(
    page,
    "case.soft-tissue-mass.deep-thigh",
    1,
  );
  await setFastFacilitySpeed(page);
  await openPreparedEncounter(page, prepared);
  await expect(page.getByText("Decision 1 of 2", { exact: true })).toBeVisible();
  await expect(page.getByText(requiredCurrentUpdate(prepared.nodes[1]!), { exact: true })).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[1]!.stem, { exact: true })).toHaveCount(0);
  await clickCorrectAnswer(page, prepared.id);
  await enactPlan(page);
  await openPendingEncounter(page, prepared);
  await expect(page.locator(".chart-pending-card")).toContainText(
    "Off-site extremity MRI",
  );
  await expect(
    page.getByText("Service route unavailable", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[1]!.stem, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Return to clinic" }).click();

  await reopenWhenReady(page, prepared, 65_000);
  await expect(page.getByText("Decision 2 of 2", { exact: true })).toBeVisible();
  await expect(page.getByTestId("chart-current-update")).toContainText(
    requiredCurrentUpdate(prepared.nodes[1]!),
  );
  await clickCorrectAnswer(page, prepared.id);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/autonomous-clinical-batch-mri-final.png`,
    animations: "disabled",
  });
  await finishEncounter(page, prepared.id);
  expect(browserErrors).toEqual([]);
});
