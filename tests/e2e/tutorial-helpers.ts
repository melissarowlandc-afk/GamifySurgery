import { expect, type Page } from "@playwright/test";
import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  getCurrentQuestion,
  getRoomDefinition,
  type GameState,
} from "@gamify-surgery/game-domain";
import { getActiveState, getProfile, waitForDecisionChoices, waitForFirstPatientReady } from "./helpers";

export const protectedVisitIds = [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID] as const;
export const tutorialState = async (page: Page): Promise<GameState> => await getActiveState(page) as unknown as GameState;

export async function expectNoMandatoryCoachClicks(page: Page): Promise<void> {
  await expect(page.locator(".tutorial-coach button:not(.tutorial-disable-button)")).toHaveCount(0);
  await expect(page.getByRole("button", {name: /^(Got It|Complete tutorial)$/})).toHaveCount(0);
}

export async function resumeFacility(page: Page): Promise<void> {
  if ((await tutorialState(page)).paused) await page.getByRole("button", {name: "Resume facility time"}).click();
}

export async function reloadTutorialCampaign(page: Page, clinicName: string): Promise<void> {
  await page.reload();
  await page.getByRole("button", {name: `Resume ${clinicName}`}).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

/** Select from the actual frozen variant. Never assume choice order or wording. */
export async function chooseTutorialAnswer(page: Page, correct: boolean): Promise<void> {
  await waitForDecisionChoices(page);
  const state = await tutorialState(page);
  const question = getCurrentQuestion(state, state.openChartEncounterId!)!;
  const choice = question.node.answerChoices.find((answer) => answer.isCorrect === correct)!;
  const escaped = choice.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  await page.locator(".cs-step.is-current .cs-answer").filter({hasText: new RegExp(`^\\s*(?:[1-9]\\s*)?${escaped}`)}).click();
  await expect.poll(async () => (await tutorialState(page)).encounters[state.openChartEncounterId!]!.answers.length).toBe(question.questionNumber);
  await expectNoMandatoryCoachClicks(page);
}

export async function fileTutorialChart(page: Page): Promise<void> {
  const state = await tutorialState(page);
  const encounterId = state.openChartEncounterId!;
  await page.getByRole("button", {name: /^(Resolve Completed Chart|Dismiss and close chart)$/}).click();
  await expect(page.locator(".chart-sheet")).toHaveCount(0);
  await expect.poll(async () => (await tutorialState(page)).encounters[encounterId]!.lifecycle).toBe("resolved");
}

export async function enactTutorialPlan(page: Page, correct: boolean): Promise<void> {
  await page.getByRole("button", {name: correct ? "Enact Plan" : "Enact Corrected Plan", exact: true}).click();
  await expect.poll(async () => (await tutorialState(page)).encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe("active_pending_result");
  // The normal close control is valid throughout movement and waiting.
  await page.getByRole("button", {name: "Close patient chart"}).click();
  await expect(page.locator(".chart-sheet")).toHaveCount(0);
}

export async function openReturnedTutorialChart(page: Page): Promise<void> {
  const patient = page.locator(".patient-folder.is-active .patient-tab").first();
  await expect(patient).toHaveAccessibleName(/Action required/, {timeout: 90_000});
  await patient.click();
  await waitForDecisionChoices(page);
}

export async function finishProtectedVisits(page: Page, correct: readonly boolean[]): Promise<GameState> {
  await resumeFacility(page);
  await (await waitForFirstPatientReady(page)).click();
  await chooseTutorialAnswer(page, correct[0]!);
  await fileTutorialChart(page);
  const second = page.locator(".patient-folder.is-waiting .patient-tab").first();
  await expect(second).toBeVisible({timeout: 30_000});
  await second.click();
  await chooseTutorialAnswer(page, correct[1]!);
  await enactTutorialPlan(page, correct[1]!);
  await openReturnedTutorialChart(page);
  await chooseTutorialAnswer(page, correct[2]!);
  await fileTutorialChart(page);
  const state = await tutorialState(page);
  expect(protectedVisitIds.flatMap((id) => state.encounters[id]!.answers.map((answer) => answer.correct))).toEqual(correct);
  expect(protectedVisitIds.map((id) => state.encounters[id]!.lifecycle)).toEqual(["resolved", "resolved"]);
  return state;
}

export async function facilityLayout(page: Page): Promise<{originX: number; originY: number; tileSize: number}> {
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {__facilityGame?: unknown} | null)?.__facilityGame));
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & {__facilityGame: {scene: {getScene(key: string): {layout: {originX: number; originY: number; tileSize: number}}}}};
    const {originX, originY, tileSize} = host.__facilityGame.scene.getScene("facility-scene").layout;
    return {originX, originY, tileSize};
  });
}

export async function clickFacilityTile(page: Page, x: number, y: number): Promise<void> {
  const layout = await facilityLayout(page);
  await page.locator(".facility-host canvas").click({position: {x: layout.originX + x * layout.tileSize, y: layout.originY + y * layout.tileSize}});
}

/** Real clinic earnings only. Prototype Add $100 is deliberately absent. */
export async function earnExamCash(page: Page): Promise<void> {
  const cost = getRoomDefinition("room.examination")!.constructionCost;
  for (let attempt = 0; (await tutorialState(page)).cash < cost && attempt < 8; attempt += 1) {
    await resumeFacility(page);
    const consult = page.locator(".emergency-glp1-panel").getByRole("button", {name: /Complete consult/});
    await expect(consult).toBeEnabled({timeout: 90_000});
    const prior = (await tutorialState(page)).emergencyGlp1.lastUsedAtFacilityTick;
    await consult.click();
    await expect.poll(async () => (await tutorialState(page)).emergencyGlp1.lastUsedAtFacilityTick, {timeout: 30_000}).not.toBe(prior);
    await expect.poll(async () => (await tutorialState(page)).environment.pendingFounderConsult, {timeout: 30_000}).toBeNull();
  }
  expect((await tutorialState(page)).cash).toBeGreaterThanOrEqual(cost);
}

export async function buildTutorialExam(page: Page, proveFailedActions = false): Promise<string> {
  await earnExamCash(page);
  const cost = getRoomDefinition("room.examination")!.constructionCost;
  await page.getByRole("button", {name: "Enter Build Mode"}).click();
  await page.locator('[data-room-definition-id="room.examination"]').click();
  const cashBefore = (await tutorialState(page)).cash;
  if (proveFailedActions) {
    await clickFacilityTile(page, 34.5, 29.5); // Existing Front Desk: rejected overlap.
    expect((await tutorialState(page)).cash).toBe(cashBefore);
    expect((await tutorialState(page)).rooms.some((room) => room.roomDefinitionId === "room.examination")).toBe(false);
    await expect(page.locator(".tutorial-coach")).toHaveAttribute("data-tutorial-step", "place-exam-room");
  }
  await clickFacilityTile(page, 34.5, 26.5);
  await expect.poll(async () => (await tutorialState(page)).rooms.filter((room) => room.roomDefinitionId === "room.examination").length).toBe(1);
  const placed = await tutorialState(page);
  expect(placed.cash).toBe(cashBefore - cost);
  const exam = placed.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
  if (proveFailedActions) {
    await page.getByRole("button", {name: "Done / Save"}).click();
    await expect(page.getByRole("heading", {name: "Fix these access problems"})).toBeVisible();
    await page.getByRole("button", {name: "Continue Renovating"}).click();
    await expect(page.locator(".tutorial-coach")).toHaveAttribute("data-tutorial-step", "place-exam-room-door");
  }
  await expect(page.getByRole("button", {name: "Doors", exact: true})).toHaveAttribute("aria-pressed", "true");
  await clickFacilityTile(page, 35.5, 28);
  await expect.poll(async () => (await tutorialState(page)).doors.some((door) => door.roomId === exam.id && !door.exterior)).toBe(true);
  await page.getByRole("button", {name: "Done / Save"}).click();
  await expect(page.getByRole("button", {name: "Enter Build Mode"})).toBeVisible();
  return exam.id;
}

export async function expectCampaignGuidance(page: Page, mode: "guided" | "off" | "complete"): Promise<void> {
  await expect.poll(async () => {const profile = await getProfile(page); return profile.tutorialGuidanceByCampaign?.[profile.activeCampaignId!]?.mode;}).toBe(mode);
}
