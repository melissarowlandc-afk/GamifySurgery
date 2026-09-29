import { mkdirSync } from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { gameReducer, type GameState } from "@gamify-surgery/game-domain";

import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

const EVIDENCE = ".local-dev/answered-chart-recovery/browser";
const CASE_ID = "case.desmoid.surveillance-to-progressing-abdominal-wall";
const EXAM_ROOM_ID = "room.recovery-proof.examination";

test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function activeEncounter(state: GameState, encounterId: string) {
  const encounter = state.encounters[encounterId];
  if (!encounter) throw new Error(`Missing ${encounterId}.`);
  return encounter;
}

async function snapshot(page: Page): Promise<GameState> {
  return (await getActiveState(page)) as unknown as GameState;
}

async function installFinalQuestionFixture(
  page: Page,
  clinicName: string,
  encounterId: string,
): Promise<void> {
  await startClinic(page, `${clinicName} Founder`, clinicName);
  const profile = await getProfile(page);
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) throw new Error("Missing active campaign.");

  const state = JSON.parse(
    profile.campaigns[activeIndex]!.serializedState,
  ) as GameState;
  state.facilityLevel = 2;
  state.paused = true;
  state.simulationSpeed = 1;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.encounters = {};
  state.serviceOperations = [];
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
      id: EXAM_ROOM_ID,
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
      cleanliness: 100,
    },
  ];
  state.doors = [
    {
      id: "door.recovery-proof.front-exterior",
      roomId: "room.instance.founder_desk",
      side: "south",
      offset: 2,
      exterior: true,
    },
    {
      id: "door.recovery-proof.examination",
      roomId: EXAM_ROOM_ID,
      side: "south",
      offset: 1,
      exterior: false,
    },
  ];

  let seeded = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `${encounterId}.admit`,
    encounterId,
    caseId: CASE_ID,
    patientDisplayName: `${encounterId} Patient`,
    arrivalClass: "routine",
  });
  const encounter = activeEncounter(seeded, encounterId);
  const finalIndex = encounter.frozenCase.decisionNodes.length - 1;
  if (finalIndex < 1) throw new Error("Recovery proof needs an authored multi-node case.");
  encounter.currentNodeIndex = finalIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < finalIndex ? "completed" : "action_required";
  });
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "waiting_unopened";
  encounter.patientLocation = { x: 35, y: 29 };
  encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = "room.instance.founder_desk";
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  seeded = { ...seeded, paused: true };

  const active = profile.campaigns[activeIndex]!;
  profile.campaigns[activeIndex] = {
    ...active,
    name: clinicName,
    serializedState: JSON.stringify(seeded),
  };
  profile.tutorialsEnabled = false;
  const marker = `${encounterId}.installed`;
  await page.addInitScript(
    ({ key, value, sessionMarker }) => {
      if (window.sessionStorage.getItem(sessionMarker)) return;
      window.sessionStorage.setItem(sessionMarker, "1");
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: PROFILE_KEY, value: profile, sessionMarker: marker },
  );
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${clinicName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function openWhileWalkingToCare(page: Page, encounterId: string) {
  await page.getByText(`${encounterId} Patient`, { exact: true }).click();
  await expect(page.locator(".chart-panel")).toBeVisible();
  await expect.poll(async () => {
    const state = await snapshot(page);
    const encounter = activeEncounter(state, encounterId);
    return {
      open: state.openChartEncounterId,
      movement: encounter.patientMovement?.kind ?? null,
      destination: encounter.patientMovement?.destinationRoomInstanceId ?? null,
    };
  }).toEqual({
    open: encounterId,
    movement: "walking_to_care",
    destination: EXAM_ROOM_ID,
  });
  return activeEncounter(await snapshot(page), encounterId);
}

async function submitFinalAnswer(
  page: Page,
  encounterId: string,
  correctness: "correct" | "wrong",
): Promise<void> {
  const encounter = activeEncounter(await snapshot(page), encounterId);
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const choice = node.answerChoices.find((candidate) =>
    correctness === "correct" ? candidate.isCorrect : !candidate.isCorrect,
  );
  if (!choice) throw new Error(`Missing ${correctness} answer choice.`);
  await page.getByRole("button", {
    name: new RegExp(`^${escapeRegex(choice.label)}`),
  }).click();
}

async function finishCareApproach(page: Page, encounterId: string): Promise<void> {
  const before = (await snapshot(page)).facilityTick;
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => {
    const state = await snapshot(page);
    const encounter = activeEncounter(state, encounterId);
    return state.facilityTick > before &&
      encounter.patientMovement?.kind !== "walking_to_care";
  }, { timeout: 30_000 }).toBe(true);
  const pause = page.getByRole("button", { name: "Pause facility time" });
  if (await pause.isVisible()) await pause.click();
}

async function reloadAndReopen(page: Page, clinicName: string, encounterId: string) {
  await page.reload();
  const resume = page.getByRole("button", { name: `Resume ${clinicName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  if (!(await page.locator(".chart-panel").isVisible())) {
    await page.getByText(`${encounterId} Patient`, { exact: true }).click();
  }
  await expect(page.locator(".chart-panel")).toBeVisible();
}

async function expectActionInViewport(page: Page, name: string) {
  const footer = page.locator(".chart-action-bar");
  const action = page.getByRole("button", { name, exact: true });
  await expect(footer).toBeVisible();
  await expect(action).toBeVisible();
  await expect(action).toBeInViewport();
  return action;
}

async function expectVisibleDeparture(page: Page, encounterId: string) {
  await expect.poll(async () =>
    activeEncounter(await snapshot(page), encounterId).patientMovement?.kind ?? null,
  ).toBe("leaving_after_resolution");
  await expect.poll(async () => page.evaluate((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      | (HTMLDivElement & { __facilityGame?: { scene: { getScene: (key: string) => {
        characterBitmapContainers?: Map<string, { visible: boolean }>;
      } } } })
      | null;
    const scene = host?.__facilityGame?.scene.getScene("facility-scene");
    return scene?.characterBitmapContainers?.get(`character:patient:${id}`)?.visible ?? false;
  }, encounterId)).toBe(true);
}

function screenshotName(testInfo: TestInfo, suffix: string): string {
  return `${EVIDENCE}/${testInfo.project.name}-${suffix}.png`;
}

test("correct final answer remains fileable after the patient finishes walking to care and reloads", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop race proof.");
  const clinic = "Correct Final Recovery";
  const id = "correct-final";
  await installFinalQuestionFixture(page, clinic, id);
  await openWhileWalkingToCare(page, id);
  await submitFinalAnswer(page, id, "correct");
  await expectActionInViewport(page, "Resolve Completed Chart");
  expect(activeEncounter(await snapshot(page), id).lifecycle).toBe(
    "resolved_summary_available",
  );

  await finishCareApproach(page, id);
  expect(activeEncounter(await snapshot(page), id).lifecycle).toBe(
    "resolved_summary_available",
  );
  await expectActionInViewport(page, "Resolve Completed Chart");
  await reloadAndReopen(page, clinic, id);
  await expectActionInViewport(page, "Resolve Completed Chart");
  await page.screenshot({
    path: screenshotName(testInfo, "correct-final-after-arrival-reload"),
    animations: "disabled",
  });
  await page.getByRole("button", {
    name: "Resolve Completed Chart",
    exact: true,
  }).click();
  await expect(page.locator(".chart-panel")).toBeHidden();
  await expectVisibleDeparture(page, id);
});

test("wrong final feedback remains dismissible after the patient finishes walking to care and reloads", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop race proof.");
  const clinic = "Wrong Final Recovery";
  const id = "wrong-final";
  await installFinalQuestionFixture(page, clinic, id);
  await openWhileWalkingToCare(page, id);
  await submitFinalAnswer(page, id, "wrong");
  await expectActionInViewport(page, "Dismiss and close chart");

  await finishCareApproach(page, id);
  const afterArrival = activeEncounter(await snapshot(page), id);
  expect(afterArrival.lifecycle).toBe("resolved_summary_available");
  expect(afterArrival.terminalFeedback?.acknowledged).toBe(false);
  await expectActionInViewport(page, "Dismiss and close chart");
  await reloadAndReopen(page, clinic, id);
  const dismiss = await expectActionInViewport(page, "Dismiss and close chart");
  await page.screenshot({
    path: screenshotName(testInfo, "wrong-final-feedback-after-arrival-reload"),
    animations: "disabled",
  });
  await dismiss.click();
  await expect(page.locator(".chart-panel")).toBeHidden();
  expect(activeEncounter(await snapshot(page), id).terminalFeedback?.acknowledged).toBe(
    true,
  );
  await expectVisibleDeparture(page, id);
});

test("compact chart keeps long wrong-answer feedback and its dismissal action together", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "compact-desktop-chrome",
    "Compact layout proof.",
  );
  const clinic = "Compact Final Recovery";
  const id = "compact-wrong-final";
  await installFinalQuestionFixture(page, clinic, id);
  await openWhileWalkingToCare(page, id);
  await submitFinalAnswer(page, id, "wrong");
  await finishCareApproach(page, id);
  await reloadAndReopen(page, clinic, id);
  const feedback = page.locator(".chart-step-feedback");
  await expect(feedback).toBeVisible();
  await feedback.scrollIntoViewIfNeeded();
  await expect(feedback).toBeInViewport();
  await expectActionInViewport(page, "Dismiss and close chart");
  await page.screenshot({
    path: screenshotName(testInfo, "compact-wrong-final-action-visible"),
    animations: "disabled",
  });
});
