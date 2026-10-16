import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  GS028_STATS_ETHICS_20260929_CASES,
} from "../../packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/statistics-ethics-batch";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentQuestion,
  getFacilityAccessValidation,
  isEmployeeAssignedToOperationalRoom,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  installLevelTwoVisualState,
  installRememberedLocalAccess,
  startClinic,
} from "./helpers";

const SHOTS =
  ".local-dev/gs028-stats-ethics-20260929/browser-results/screenshots";
const NP_ROLE = "staff.glp1_np";

test.beforeAll(() => mkdirSync(SHOTS, { recursive: true }));

function admittedCaseForConcept(conceptId: string) {
  const authored = GS028_STATS_ETHICS_20260929_CASES.find((clinicalCase) =>
    clinicalCase.decisionNodes.some((node) => node.primaryConceptId === conceptId),
  );
  const admitted = authored && PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) => clinicalCase.id === authored.id);
  if (!authored || !admitted) {
    throw new Error(`GS028 statistics/ethics case for ${conceptId} is not admitted in the active runtime.`);
  }
  return admitted;
}

async function replacePersistedState(
  page: Page,
  label: string,
  state: GameState,
): Promise<Page> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("No synthetic campaign was created.");
  campaign.name = label;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  const context = page.context();
  // The live player periodically persists its in-memory state. Close it before
  // replacing storage so an autosave cannot overwrite the synthetic fixture.
  // Use a same-origin static resource to gain localStorage access without
  // mounting a second player instance.
  await page.close();
  const cleanPage = await context.newPage();
  await cleanPage.goto("/gamify-surgery-launcher-health.json");
  await cleanPage.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_KEY, value: profile },
  );
  // `installLevelTwoVisualState` installs its fixture on this Page's future
  // navigations. Use a clean page so reload checks observe the state saved by
  // the player, rather than reapplying the fixture.
  await cleanPage.goto("/?prototype-tools=0");
  const resume = cleanPage.getByRole("button", { name: `Resume ${label}` });
  if (await resume.isVisible()) await resume.click();
  await expect(cleanPage.getByTestId("facility-canvas")).toBeVisible();
  return cleanPage;
}

async function seedEmployeeDiscussion(page: Page, label: string) {
  await installRememberedLocalAccess(page);
  await startClinic(page, `${label} Founder`, label);
  await installLevelTwoVisualState(page);
  let state = (await getActiveState(page)) as unknown as GameState;
  const employee = state.employees.find((candidate) => candidate.staffRoleDefinitionId === NP_ROLE);
  if (!employee) throw new Error("The owned Level 2 fixture must contain an assigned GLP-1 NP.");
  const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk");
  const publicEntrance = state.doors.find((door) => door.exterior);
  if (!frontDesk || !publicEntrance) throw new Error("The visual fixture must retain its public entrance.");
  const homeRoom = {
    id: "room.gs028.employee.glp",
    roomDefinitionId: "room.glp1_telehealth_suite",
    x: 29,
    y: 29,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  const hallway = (y: number) => ({
    id: `room.gs028.employee.hall.${y}`,
    roomDefinitionId: "room.hallway",
    x: 32,
    y,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  });
  // Keep the real NP identity but give this browser fixture the same compact,
  // valid facility graph exercised by the domain scheduler tests. The broad
  // Level 2 visual fixture contains overlapping showcase rooms and therefore
  // intentionally reports them as non-operational.
  state.rooms = [frontDesk, homeRoom, ...[24, 25, 26, 27, 28, 29, 30].map(hallway)];
  state.doors = [
    { ...publicEntrance, roomId: frontDesk.id, side: "south", offset: 2, exterior: true },
    { id: "door.gs028.employee.front", roomId: frontDesk.id, side: "west", offset: 0, exterior: false },
    { id: "door.gs028.employee.glp", roomId: homeRoom.id, side: "east", offset: 1, exterior: false },
  ];
  state.employees = [employee];
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = state.facilityTick;
  state.paused = false;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.environment.founderActivity = null;
  state.environment.glp1AutomationSlots = [];
  state.environment.glp1AutomationNextPayoutTicks = [];
  state.environment.glp1AutomationNextPayoutTick = null;
  employee.homeRoomInstanceId = homeRoom.id;
  employee.facilityTask = null;
  employee.location = { x: 31, y: 30 };
  employee.path = [];
  employee.pathIndex = 0;
  state.retailOperations = state.retailOperations.filter(
    (operation) =>
      operation.actorKind !== "employee" || operation.actorId !== employee.id,
  );
  state = gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: "gs028se.employee-discussion.schedule",
  });
  const scheduled = Object.values(state.employeeDiscussions ?? {})[0];
  if (!scheduled) {
    throw new Error(`The real cadence reducer did not schedule an eligible NP discussion: ${JSON.stringify({
      operational: isEmployeeAssignedToOperationalRoom(state, employee.id, PROTOTYPE_DOMAIN_CONTEXT),
      access: getFacilityAccessValidation(state, PROTOTYPE_DOMAIN_CONTEXT),
      nextEmployeeDiscussionTick: state.nextEmployeeDiscussionTick,
      facilityTick: state.facilityTick,
    })}`);
  }
  state.paused = true;
  const cleanPage = await replacePersistedState(page, label, state);
  return { employee, page: cleanPage, discussionId: scheduled.id };
}

async function setFacilityRunning(page: Page) {
  const fourX = page.getByRole("button", { name: "Set facility speed to 4x" });
  await fourX.click();
  await page.getByRole("button", { name: "Resume facility time" }).click();
}

async function pauseFacility(page: Page) {
  const pause = page.getByRole("button", { name: "Pause facility time" });
  if (await pause.isVisible()) await pause.click();
}

function employeeDiscussionTab(
  page: Page,
  folder: "waiting" | "active",
  employeeName: string,
) {
  return page
    .locator(`.patient-folder.is-${folder} .employee-discussion-tab`)
    .filter({ hasText: employeeName });
}

async function openEmployeeDiscussion(page: Page, employeeName: string) {
  const tab = employeeDiscussionTab(page, "waiting", employeeName);
  await expect(tab).toHaveCount(1);
  await expect(tab.locator('[aria-label="Action required"]')).toHaveCount(1);
  await tab.click();
  await expect(page.locator('[aria-label="Team discussion"]')).toBeVisible();
}

async function chooseDiscussionAnswer(page: Page, discussionId: string, correct: boolean) {
  const state = (await getActiveState(page)) as unknown as GameState;
  const discussion = state.employeeDiscussions?.[discussionId];
  if (!discussion) throw new Error("Employee discussion was not created by the runtime.");
  const node = discussion.frozenCase.decisionNodes[discussion.currentNodeIndex];
  const choice = node?.answerChoices.find((item) => item.isCorrect === correct);
  if (!node || !choice) throw new Error("Expected a scored employee-discussion answer.");
  await page.getByRole("button", { name: new RegExp(`^${choice.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  return { node, choice };
}

test("a real NP discussion travels from Waiting to Existing and scores once without patient fees", async ({ page }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop only");
  admittedCaseForConcept("concept.statistics-ethics.independent-t");
  const seeded = await seedEmployeeDiscussion(page, "GS028 Statistics Employee");
  const activePage = seeded.page;
  const { employee } = seeded;
  await expect(employeeDiscussionTab(activePage, "waiting", employee.displayName)).toHaveCount(1, { timeout: 30_000 });
  let state = (await getActiveState(activePage)) as unknown as GameState;
  const discussion = state.employeeDiscussions?.[seeded.discussionId];
  if (!discussion) throw new Error("No employee discussion arrived after the real cadence tick.");
  expect(discussion.employeeId).toBe(employee.id);
  expect(discussion.frozenCase.participant).toMatchObject({ kind: "employee_discussion", requiredStaffRoleDefinitionIds: [NP_ROLE] });
  const cashBefore = state.cash;
  const cashCentsBefore = state.cashCents;
  const settlementsBefore = state.settlements.length;
  const incomeBefore = state.serviceIncomeReceipts.length;
  const encountersBefore = Object.keys(state.encounters).length;
  expect(state.employees.filter((candidate) => candidate.staffRoleDefinitionId === NP_ROLE)).toHaveLength(1);
  const xpBefore = state.clinicalXp;
  await openEmployeeDiscussion(activePage, employee.displayName);
  await setFacilityRunning(activePage);
  state = (await getActiveState(activePage)) as unknown as GameState;
  expect(state.environment.founderActivity).toMatchObject({ kind: "attend_employee_discussion", targetId: discussion.id });
  expect(state.employeeDiscussions?.[discussion.id]?.lifecycle).toBe("active_traveling");
  await activePage.screenshot({ path: `${SHOTS}/employee-founder-walking.png`, animations: "disabled" });
  await activePage.reload();
  const resumeCampaign = activePage.getByRole("button", { name: "Resume GS028 Statistics Employee" });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  // Reload restoration intentionally pauses facility time. Resume the ordinary
  // simulation clock so the saved founder path can finish through real ticks.
  await setFacilityRunning(activePage);
  await expect.poll(async () => ((await getActiveState(activePage)) as unknown as GameState).employeeDiscussions?.[discussion.id]?.lifecycle, { timeout: 90_000 }).toBe("active_action_required");
  await pauseFacility(activePage);
  const activeTab = employeeDiscussionTab(activePage, "active", employee.displayName);
  await expect(activeTab).toHaveCount(1);
  await expect(activeTab.locator('[aria-label="Action required"]')).toHaveCount(1);
  const discussionPanel = activePage.locator('[aria-label="Team discussion"]');
  await expect(discussionPanel).toContainText(employee.displayName);
  const closeButton = discussionPanel.getByRole("button", { name: "Close", exact: true });
  await expect(closeButton).toBeVisible();
  const closeGeometry = await closeButton.evaluate((button) => {
    const buttonBounds = button.getBoundingClientRect();
    const panelBounds = button.closest('[aria-label="Team discussion"]')!.getBoundingClientRect();
    return {
      textFits: button.scrollWidth <= button.clientWidth,
      rightInsidePanel: buttonBounds.right <= panelBounds.right,
    };
  });
  expect(closeGeometry).toEqual({ textFits: true, rightInsidePanel: true });
  await activePage.screenshot({ path: `${SHOTS}/employee-chart-open.png`, animations: "disabled" });
  const wrong = await chooseDiscussionAnswer(activePage, discussion.id, false);
  const correctLabel = wrong.node.answerChoices.find((choice) => choice.isCorrect)!.label;
  await expect(discussionPanel.getByText(`Correct answer: ${correctLabel}`, { exact: false }).first()).toBeVisible();
  await activePage.screenshot({ path: `${SHOTS}/employee-feedback.png`, animations: "disabled" });
  await activePage.reload();
  const resumeAfterFeedbackReload = activePage.getByRole("button", { name: "Resume GS028 Statistics Employee" });
  if (await resumeAfterFeedbackReload.isVisible()) await resumeAfterFeedbackReload.click();
  await expect.poll(async () => ((await getActiveState(activePage)) as unknown as GameState).employeeDiscussions?.[discussion.id]?.lifecycle).toBe("feedback_pending");
  await expect(discussionPanel.getByText(`Correct answer: ${correctLabel}`, { exact: false }).first()).toBeVisible();
  await activePage.getByRole("button", { name: "Continue", exact: true }).click();
  await activePage.getByRole("button", { name: "File discussion", exact: true }).click();
  state = (await getActiveState(activePage)) as unknown as GameState;
  expect(state.employeeDiscussions?.[discussion.id]).toMatchObject({ lifecycle: "resolved" });
  expect(state.learningHistories[wrong.node.primaryConceptId]?.reviews).toHaveLength(1);
  expect(state.learningHistories[wrong.node.primaryConceptId]?.reviews[0]?.rating).toBe("Again");
  expect(state.cash).toBe(cashBefore);
  expect(state.cashCents).toBe(cashCentsBefore);
  expect(state.settlements).toHaveLength(settlementsBefore);
  expect(state.serviceIncomeReceipts).toHaveLength(incomeBefore);
  expect(state.clinicalXp).toBeGreaterThan(xpBefore);
  expect(state.encounters[discussion.id]).toBeUndefined();
  expect(Object.keys(state.encounters)).toHaveLength(encountersBefore);
  expect(Object.values(state.encounters).some((encounter) => encounter.patientDisplayName === employee.displayName)).toBe(false);
  expect(state.employees.filter((candidate) => candidate.staffRoleDefinitionId === NP_ROLE)).toHaveLength(1);
});

test("a Spanish interpreter encounter is an ordinary patient chart with readable Spanish presentation and no procedure", async ({ page }) => {
  const clinicalCase = admittedCaseForConcept("concept.statistics-ethics.qualified-interpreter");
  await installRememberedLocalAccess(page);
  await startClinic(page, "GS028 Interpreter Founder", "GS028 Interpreter");
  let state = (await getActiveState(page)) as unknown as GameState;
  state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "gs028se.interpreter.admit", encounterId: "gs028se.interpreter", caseId: clinicalCase.id, arrivalClass: "routine" });
  const encounter = state.encounters["gs028se.interpreter"]!;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  state.paused = true;
  state.openChartEncounterId = encounter.id;
  state.attendedEncounterId = encounter.id;
  const activePage = await replacePersistedState(page, "GS028 Interpreter", state);
  await expect.poll(async () => ((await getActiveState(activePage)) as unknown as GameState).openChartEncounterId).toBe(encounter.id);
  await expect(activePage.getByText(/No entiendo el formulario en inglés/i)).toBeVisible();
  await expect(activePage.getByText(/Before an interpreter|A patient with/, { exact: false })).toHaveCount(0);
  await activePage.screenshot({ path: `${SHOTS}/spanish-interpreter-presentation.png`, animations: "disabled" });
  const question = getCurrentQuestion((await getActiveState(activePage)) as unknown as GameState, encounter.id)!;
  const interpreter = question.node.answerChoices.find((choice) => choice.isCorrect)!;
  await activePage.getByRole("button", { name: new RegExp(`^${interpreter.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  await expect(activePage.getByText(`Correct answer: ${interpreter.label}`, { exact: false }).first()).toBeVisible();
  await activePage.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  state = (await getActiveState(activePage)) as unknown as GameState;
  expect(state.encounters[encounter.id]).toMatchObject({ lifecycle: "resolved", pendingResult: null, deliveredResultNarratives: [] });
});

test("without an NP, an ordinary statistics/ethics patient remains playable and no phantom employee discussion appears", async ({ page }) => {
  const clinicalCase = admittedCaseForConcept("concept.statistics-ethics.arr-nnt");
  await installRememberedLocalAccess(page);
  await startClinic(page, "GS028 No NP Founder", "GS028 No NP");
  let state = (await getActiveState(page)) as unknown as GameState;
  state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== NP_ROLE);
  state.nextEmployeeDiscussionTick = state.facilityTick;
  state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "gs028se.arr.admit", encounterId: "gs028se.arr", caseId: clinicalCase.id, arrivalClass: "routine" });
  const encounter = state.encounters["gs028se.arr"]!;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.openChartEncounterId = encounter.id;
  state.attendedEncounterId = encounter.id;
  const activePage = await replacePersistedState(page, "GS028 No NP", state);
  await expect.poll(async () => ((await getActiveState(activePage)) as unknown as GameState).openChartEncounterId).toBe(encounter.id);
  const question = getCurrentQuestion((await getActiveState(activePage)) as unknown as GameState, encounter.id)!;
  await activePage.getByRole("button", { name: new RegExp(`^${question.node.answerChoices.find((choice) => choice.isCorrect)!.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
  await activePage.getByRole("button", { name: "Resolve Completed Chart", exact: true }).click();
  state = (await getActiveState(activePage)) as unknown as GameState;
  expect(state.encounters[encounter.id]?.lifecycle).toBe("resolved");
  expect(Object.values(state.employeeDiscussions ?? {})).toHaveLength(0);
});
