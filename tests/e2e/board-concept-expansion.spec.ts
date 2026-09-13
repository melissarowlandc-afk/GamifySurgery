import { mkdirSync } from "node:fs";
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { BOARD_EXPANSION_CASES, BOARD_EXPANSION_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { deserializeGameState, gameReducer, getCurrentQuestion, serializeGameState, validateDomainContext, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { PROFILE_KEY, getActiveState, installRememberedLocalAccess, setFastFacilitySpeed, startClinic, waitForDecisionChoices } from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
const ORIGIN = "http://127.0.0.1:4173";
type StoredProfile = { activeCampaignId: string; campaigns: Array<{ campaignId: string; serializedState: string; name: string }>; tutorialsEnabled: boolean };
type Prepared = { id: string; name: string; caseId: string; campaignName: string; profile: StoredProfile; profileId: string | undefined; appearance: unknown; order: string[][]; nodes: ReturnType<typeof target>["decisionNodes"] };

function target(caseId: string) {
  const value = BOARD_EXPANSION_CASES.find((item) => item.id === caseId);
  if (!value) throw new Error(`Missing ${caseId}`);
  return value;
}
function domainContext(caseId: string) {
  const clinicalCase = target(caseId);
  const ids = new Set(clinicalCase.decisionNodes.map((node) => node.primaryConceptId));
  return validateDomainContext({ ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases: [clinicalCase], concepts: BOARD_EXPANSION_TESTED_CONCEPTS.filter((item) => ids.has(item.id)) } });
}
function escapeRegExp(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

async function prepareAutomaticAdmission(page: Page, caseId: string): Promise<Prepared> {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PROFILE_KEY);
  if (!raw) throw new Error("The fresh campaign profile was not persisted.");
  const profile = JSON.parse(raw) as StoredProfile;
  const index = profile.campaigns.findIndex((campaign) => campaign.campaignId === profile.activeCampaignId);
  if (index < 0) throw new Error("The fresh campaign is not active.");
  const active = profile.campaigns[index]!;
  let state = deserializeGameState(active.serializedState);
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.paused = false;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `e2e.${caseId}.automatic-admission`, advancedAtRealMs: 1_800_000_000_000 }, domainContext(caseId));
  const encounter = Object.values(state.encounters)[0]!;
  if (encounter.frozenCase.id !== caseId || encounter.patientDisplayName.includes("{patientName}")) throw new Error("Automatic admission did not materialize the requested patient.");
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  profile.campaigns[index] = { ...active, serializedState: serializeGameState(state) };
  profile.tutorialsEnabled = false;
  return { id: encounter.id, name: encounter.patientDisplayName, caseId, campaignName: active.name, profile, profileId: encounter.frozenCase.selectedInstantiationProfileId, appearance: encounter.patientAppearance, order: encounter.frozenCase.decisionNodes.map((node) => node.answerChoices.map((choice) => choice.id)), nodes: encounter.frozenCase.decisionNodes };
}

async function launchPreparedCampaign(browser: Browser, prepared: Prepared): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const marker = `board-expansion:${prepared.profile.activeCampaignId}:${prepared.caseId}`;
  await installRememberedLocalAccess(page);
  await page.addInitScript(({ markerKey, profileKey, nextProfile }) => {
    if (sessionStorage.getItem(markerKey) !== null) return;
    sessionStorage.setItem(markerKey, "installed");
    localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { markerKey: marker, profileKey: PROFILE_KEY, nextProfile: prepared.profile });
  await page.goto("/?prototype-tools=0");
  expect(new URL(page.url()).origin).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${prepared.campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  return { context, page };
}

async function createIsolatedPreparedCampaign(browser: Browser, founder: string, clinic: string, caseId: string) {
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
  const patient = page.locator(".patient-folder .patient-tab").filter({ hasText: prepared.name });
  await expect(patient).toBeVisible({ timeout: 25_000 });
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible();
}
async function open(page: Page, prepared: Prepared) {
  await openChart(page, prepared);
  await waitForDecisionChoices(page);
}
async function enact(page: Page) { await page.getByRole("button", { name: "Enact Plan", exact: true }).click(); }
async function resumeFacility(page: Page) {
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
}
async function choose(page: Page, label: string) { await page.getByRole("button", { name: new RegExp(`^${escapeRegExp(label)}`) }).click(); }
async function correct(page: Page, prepared: Prepared) {
  const state = (await getActiveState(page)) as unknown as GameState;
  const node = getCurrentQuestion(state, prepared.id)!.node;
  await choose(page, node.answerChoices.find((choice) => choice.isCorrect)!.label);
}
async function waitReturn(page: Page, prepared: Prepared) {
  await expect.poll(async () => ((await getActiveState(page)) as unknown as GameState).encounters[prepared.id]?.currentNodeIndex, { timeout: 100_000 }).toBe(1);
  await page.locator(".patient-folder.is-active .patient-tab").filter({ hasText: prepared.name }).click();
  await waitForDecisionChoices(page);
}
async function expectResolved(page: Page, prepared: Prepared) {
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[prepared.id]!;
  expect(encounter.lifecycle).toBe("resolved_summary_available");
  expect(encounter.resolutionReason).toBe("completed");
  expect(getCurrentQuestion(state, prepared.id)).toBeNull();
}
async function expectAllTestTimes(page: Page) {
  const choices = page.locator(".chart-step-column.is-current .answer-choice");
  await expect(choices).toHaveCount(4);
  await expect(choices.locator(".answer-choice-eta")).toHaveCount(4);
  await expect(choices.locator("small")).toHaveText(Array(4).fill("Estimated test wait (game time)"));
}
test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

test("PAD automatic ABI gate preserves frozen pending encounter through reload", async ({ browser }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop only");
  const { context, page, prepared } = await createIsolatedPreparedCampaign(browser, "Board PAD Founder", "Board PAD Clinic", "case.peripheral-arterial-disease.mail-route");
  try {
    await setFastFacilitySpeed(page); await resumeFacility(page); await open(page, prepared);
    await expect(page.getByText("CURRENT UPDATE")).toHaveCount(0);
    await expectAllTestTimes(page);
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-pad-initial.png`, animations: "disabled" });
    await correct(page, prepared); await enact(page); await openChart(page, prepared);
    await expect(page.locator(".chart-pending-card")).toContainText("ankle-brachial");
    const before = (await getActiveState(page)) as unknown as GameState;
    const pending = before.encounters[prepared.id]!.pendingResult!;
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-pad-pending.png`, animations: "disabled" });
    await page.getByRole("button", { name: "Pause facility time" }).click();
    await page.reload();
    const resumeCampaign = page.getByRole("button", { name: `Resume ${prepared.campaignName}` });
    if (await resumeCampaign.isVisible()) await resumeCampaign.click();
    const restored = ((await getActiveState(page)) as unknown as GameState).encounters[prepared.id]!;
    expect(restored.pendingResult?.dueTick).toBe(pending.dueTick);
    expect(restored.frozenCase.selectedInstantiationProfileId).toBe(prepared.profileId);
    expect(restored.patientDisplayName).toBe(prepared.name);
    expect(restored.patientAppearance).toEqual(prepared.appearance);
    expect(restored.frozenCase.decisionNodes.map((node) => node.answerChoices.map((choice) => choice.id))).toEqual(prepared.order);
    await resumeFacility(page);
    await waitReturn(page, prepared);
    await expect(page.getByTestId("chart-current-update")).toContainText(prepared.nodes[1]!.currentUpdate!);
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-pad-returned.png`, animations: "disabled" });
    await correct(page, prepared); await expectResolved(page, prepared);
  } finally { await context.close(); }
});

test("breast feedback exposes the key only after an incorrect answer and renders the returned finding once", async ({ browser }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop only");
  const { context, page, prepared } = await createIsolatedPreparedCampaign(browser, "Board Breast Founder", "Board Breast Clinic", "case.lactational-breast-abscess.tender-upper-breast");
  try {
    await setFastFacilitySpeed(page); await resumeFacility(page); await open(page, prepared);
    const state = (await getActiveState(page)) as unknown as GameState;
    const node = getCurrentQuestion(state, prepared.id)!.node;
    const key = node.answerChoices.find((choice) => choice.isCorrect)!;
    await expect(page.getByText(`Correct answer: ${key.label}`, { exact: false })).toHaveCount(0);
    await choose(page, node.answerChoices.find((choice) => !choice.isCorrect)!.label);
    await expect(page.locator(".chart-step-column.is-current .chart-step-feedback")).toContainText(`Correct answer: ${key.label}`);
    const enactCorrected = page.getByRole("button", { name: "Enact Corrected Plan", exact: true });
    await expect(enactCorrected).toBeVisible({ timeout: 5_000 });
    await enactCorrected.click(); await openChart(page, prepared); await expect(page.locator(".chart-pending-card")).toContainText("ultrasound");
    await waitReturn(page, prepared);
    const update = prepared.nodes[1]!.currentUpdate!;
    await expect(page.getByTestId("chart-current-update")).toContainText(update);
    await page.locator(".chart-completed-decision summary").click();
    await expect(page.locator(".chart-completed-decision")).not.toContainText(update);
    await expect(page.locator(".chart-completed-decision .chart-step-feedback")).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-breast-feedback.png`, animations: "disabled" });
    await page.locator(".chart-completed-decision summary").click();
    const finalChoices = page.locator(".chart-step-column.is-current .answer-choice");
    await expect(finalChoices.getByText("No test wait", { exact: true })).toHaveCount(3);
    await expect(finalChoices.locator(".answer-choice-eta")).toHaveCount(4);
    await expect(finalChoices.locator("small")).toHaveText(["Estimated test wait (game time)"]);
    await finalChoices.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-breast-returned.png`, animations: "disabled" });
    await correct(page, prepared); await expectResolved(page, prepared);
  } finally { await context.close(); }
});

test("rectal response assessment keeps results pending until delivery and completes watch-and-wait planning", async ({ browser }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop only");
  const { context, page, prepared } = await createIsolatedPreparedCampaign(browser, "Board Rectal Founder", "Board Rectal Clinic", "case.rectal-cancer.teacher-followup");
  try {
    await setFastFacilitySpeed(page); await resumeFacility(page); await open(page, prepared);
    await expectAllTestTimes(page);
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-rectal-initial.png`, animations: "disabled" });
    await correct(page, prepared); await enact(page); await openChart(page, prepared);
    await expect(page.locator(".chart-pending-card")).toContainText("rectal response assessment");
    await expect(page.getByTestId("chart-current-update")).toHaveCount(0);
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-rectal-pending.png`, animations: "disabled" });
    await waitReturn(page, prepared);
    const update = prepared.nodes[1]!.currentUpdate!;
    await expect(page.getByTestId("chart-current-update")).toContainText(update);
    await expect(page.locator(".chart-completed-decision")).not.toContainText(update);
    await page.screenshot({ path: `${SCREENSHOTS}/board-expansion-rectal-returned.png`, animations: "disabled" });
    await correct(page, prepared); await expectResolved(page, prepared);
  } finally { await context.close(); }
});
