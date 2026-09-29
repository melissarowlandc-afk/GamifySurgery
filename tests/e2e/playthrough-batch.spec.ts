import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function installState(
  page: Page,
  mutate: (state: GameState) => void,
): Promise<GameState> {
  const profile = await getProfile(page);
  const index = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (index < 0) throw new Error("Active campaign is missing.");
  const campaign = profile.campaigns[index]!;
  const state = deserializeGameState(campaign.serializedState);
  mutate(state);
  profile.campaigns[index] = {
    ...campaign,
    serializedState: serializeGameState(state),
  };
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: PROFILE_KEY, value: profile },
  );
  await page.goto("/?prototype-tools=0");
  await page.getByRole("button", { name: `Resume ${campaign.name}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  return state;
}

function prepareEncounterForChart(state: GameState, encounterId: string): void {
  const encounter = state.encounters[encounterId]!;
  encounter.lifecycle = "waiting_unopened";
  encounter.resolutionReason = null;
  encounter.patientMovement = null;
  encounter.patientLocation = { ...state.environment.founderLocation };
  encounter.assignedRoomInstanceId = "room.instance.founder_desk";
  encounter.checkInStatus = "checked_in";
  encounter.checkInWaitingSinceTick = null;
  encounter.idleWaitingSinceTick = state.facilityTick;
  encounter.waiting.patienceExempt = true;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
}

async function answerCurrent(page: Page, correct: boolean): Promise<string> {
  await waitForDecisionChoices(page);
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[state.openChartEncounterId!]!;
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const choice = node.answerChoices.find((candidate) => candidate.isCorrect === correct)!;
  const correctChoice = node.answerChoices.find((candidate) => candidate.isCorrect)!;
  await page
    .getByRole("button", {
      name: new RegExp(`^${escapeRegex(choice.label)}(?:$|\\s)`),
    })
    .click();
  return correctChoice.label;
}

async function openOnlyPatient(page: Page): Promise<void> {
  const patient = page.locator(".patient-folder .patient-tab").first();
  await expect(patient).toBeVisible();
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible();
}

async function openResolvedPatient(page: Page, encounterId: string): Promise<void> {
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  const cabinet = page.getByRole("button", { name: /Resolved 1 filed charts/ });
  await expect(cabinet).toBeVisible();
  await cabinet.click();
  const patient = page.locator(".is-resolved-stack .patient-tab").first();
  await expect(patient).toBeVisible();
  const chart = page.locator(".paper-chart");
  await expect(async () => {
    await patient.click();
    await expect(chart).toBeVisible({ timeout: 750 });
  }).toPass({ timeout: 30_000, intervals: [500] });
  const pause = page.getByRole("button", { name: "Pause facility time" });
  if ((await pause.getAttribute("aria-pressed")) !== "true") await pause.click();
  const state = (await getActiveState(page)) as unknown as GameState;
  expect(state.openChartEncounterId).toBe(encounterId);
}

test("shows plain alert history while suppressing legacy status aliases", async ({
  page,
}) => {
  await startClinic(page, "GS-017 Alert Founder", "GS-017 Alert Clinic");
  await installState(page, (state) => {
    state.facilityTick = 360;
    state.paused = true;
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.environment.waterCoolerFillPercent = 0;
    state.events = [1, 2, 3].map((sequence) => ({
      id: `event.ambient.gs017.${sequence}`,
      type: "ambient_message" as const,
      facilityTick: sequence * 120,
      encounterId: null,
      message: `Routine clinic update ${sequence}.`,
      priority: "flavor" as const,
      definitionId: "alert.ambient.06",
      alertCategory: "ambient_flavor" as const,
      alertVariantId: "alert.ambient.06.default",
      target: { kind: "campaign" as const, id: state.campaignId },
    }));
    state.events.push(
      {
        id: "event.legacy.check-in",
        type: "patient_arrived",
        facilityTick: 50,
        encounterId: null,
        message: "Legacy check-in row should stay hidden.",
        priority: "action_required",
        definitionId: "alert.patient.arrived",
        target: null,
      },
      {
        id: "event.legacy.result",
        type: "result_ready",
        facilityTick: 60,
        encounterId: null,
        message: "Legacy returned-result row should stay hidden.",
        priority: "action_required",
        definitionId: "alert.patient.result-ready",
        target: null,
      },
      {
        id: "event.legacy.water",
        type: "water_cooler_low",
        facilityTick: 70,
        encounterId: null,
        message: "Legacy immediate water row should stay hidden.",
        priority: "action_required",
        definitionId: "alert.environment.water-low",
        target: null,
      },
    );
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.water.gs017.onset",
        conditionKey: "empty_water_cooler",
        kind: "onset",
        occurredAtFacilityTick: 61,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message: "The water cooler is empty.",
        priority: "action_required",
        target: { kind: "water_cooler", id: "water-cooler.front-desk" },
      },
    ];
    state.alertHumor.conditionActiveSinceTicks.empty_water_cooler = 0;
    state.alertHumor.conditionLastEmittedTicks["environment.water"] = 61;
    state.environment.nextWaterCoolerReminderTick = 661;
  });

  const board = page.locator(".event-message-board");
  await expect(board.locator("details")).toHaveCount(0);
  for (const sequence of [1, 2, 3]) {
    await expect(board).toContainText(`Routine clinic update ${sequence}.`);
  }
  await expect(board).toContainText("The water cooler is empty.");
  await expect(board).not.toContainText("Legacy check-in row should stay hidden.");
  await expect(board).not.toContainText("Legacy returned-result row should stay hidden.");
  await expect(board).not.toContainText("Legacy immediate water row should stay hidden.");
  await expect(board.locator(".has-attention-marker")).toHaveCount(1);
  const activeWarning = board.locator(".has-attention-marker button").filter({
    hasText: "water cooler",
  });
  await expect(activeWarning).toHaveAttribute("title", "Show water cooler");
  await activeWarning.click();
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-017-plain-alert-cadence.png`,
    animations: "disabled",
  });
});

test("one close acknowledges wrong intermediate feedback and preserves the next decision", async ({
  page,
}) => {
  await startClinic(page, "GS-017 Chart Founder", "GS-017 Chart Clinic");
  let encounterId = "";
  let futureStem = "";
  await installState(page, (state) => {
    state.facilityLevel = 1;
    state.encounters = {};
    state.rooms.push({
      id: "room.gs017.exam",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.gs017.exam",
      roomId: "room.gs017.exam",
      side: "south",
      offset: 1,
      exterior: false,
    });
    const admitted = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "gs017.admit.multistep",
      encounterId: "encounter.gs017.multistep",
      caseId: "case.fhh.evaluation-to-confirmed-management",
      patientDisplayName: "Morgan Review",
      arrivalClass: "routine",
    }, PROTOTYPE_DOMAIN_CONTEXT);
    Object.assign(state, admitted);
    encounterId = "encounter.gs017.multistep";
    prepareEncounterForChart(state, encounterId);
    futureStem = state.encounters[encounterId]!.frozenCase.decisionNodes[1]!.stem;
  });
  await openOnlyPatient(page);
  const correctAnswer = await answerCurrent(page, false);
  const feedback = page.locator(".chart-step-column.is-current .chart-step-feedback");
  await expect(feedback).toContainText("Incorrect");
  await expect(feedback).toContainText(`Correct answer: ${correctAnswer}`);
  await expect(page.getByText(futureStem, { exact: true })).toHaveCount(0);
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-017-wrong-intermediate-feedback.png`,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Close patient chart" }).click();
  await expect(page.locator(".paper-chart")).toHaveCount(0);
  const closed = (await getActiveState(page)) as unknown as GameState;
  expect(closed.openChartEncounterId).toBeNull();
  expect(closed.encounters[encounterId]!.currentNodeIndex).toBe(1);
  expect(closed.encounters[encounterId]!.steps[0]!.answer?.correct).toBe(false);
  expect(closed.learningHistories[closed.encounters[encounterId]!.steps[0]!.primaryConceptId]!.reviews).toHaveLength(1);
  expect(closed.learningHistories[closed.encounters[encounterId]!.steps[1]!.primaryConceptId]?.reviews ?? []).toHaveLength(0);
  await openOnlyPatient(page);
  await expect(page.getByText("Decision 2 of 2", { exact: true })).toBeVisible();
  await expect(page.locator(".chart-step-feedback")).toContainText(
    `Correct answer: ${correctAnswer}`,
  );
});

for (const correct of [false, true] as const) {
  test(`terminal ${correct ? "correct" : "incorrect"} feedback dismisses and closes in one click`, async ({
    page,
  }) => {
    await startClinic(
      page,
      `GS-017 ${correct ? "Correct" : "Wrong"} Founder`,
      `GS-017 ${correct ? "Correct" : "Wrong"} Clinic`,
    );
    await installState(page, (state) =>
      prepareEncounterForChart(state, TUTORIAL_ENCOUNTER_ID),
    );
    await openOnlyPatient(page);
    const correctAnswer = await answerCurrent(page, correct);
    const feedback = page.locator(".chart-step-feedback");
    await expect(feedback).toContainText(correct ? "Correct" : "Incorrect");
    if (!correct) await expect(feedback).toContainText(`Correct answer: ${correctAnswer}`);
    await page.screenshot({
      path: `${SCREENSHOTS}/gs-017-terminal-${correct ? "correct" : "incorrect"}-feedback.png`,
      animations: "disabled",
    });
    if (correct) {
      await page.getByRole("button", { name: "Resolve Completed Chart" }).click();
    } else {
      await page.getByRole("button", { name: "Dismiss and close chart" }).click();
    }
    await expect(page.locator(".paper-chart")).toHaveCount(0);
    const completed = (await getActiveState(page)) as unknown as GameState;
    const encounter = completed.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(encounter.resolutionReason).toBe("completed");
    if (!correct) expect(encounter.terminalFeedback?.acknowledged).toBe(true);
    expect(completed.learningHistories[encounter.steps[0]!.primaryConceptId]!.reviews).toHaveLength(1);
    await openResolvedPatient(page, TUTORIAL_ENCOUNTER_ID);
    await expect(page.locator(".chart-step-feedback")).toContainText(
      correct ? "Correct" : `Correct answer: ${correctAnswer}`,
    );
    const reopened = (await getActiveState(page)) as unknown as GameState;
    const reopenedEncounter = reopened.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(reopened.clinicalXp).toBe(completed.clinicalXp);
    expect(
      reopened.learningHistories[reopenedEncounter.steps[0]!.primaryConceptId]!.reviews,
    ).toHaveLength(1);
  });
}

async function dismissCoach(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: "Got It" });
  if (await button.isVisible({ timeout: 500 }).catch(() => false)) await button.click();
}

async function answerTutorialCorrectly(page: Page): Promise<void> {
  await waitForDecisionChoices(page);
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[state.openChartEncounterId!]!;
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", {
    name: new RegExp(`^${escapeRegex(correct.label)}(?:$|\\s)`),
  }).click();
}

async function finishTutorialChart(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await dismissCoach(page);
    const flip = page.getByRole("button", { name: /Flip for (?:M|m)ore Disease Information/ });
    if (await flip.isVisible({ timeout: 200 }).catch(() => false)) {
      await flip.click();
      continue;
    }
    const resolve = page.getByRole("button", { name: "Resolve Completed Chart" });
    if (await resolve.isVisible({ timeout: 200 }).catch(() => false)) {
      await resolve.click();
      return;
    }
  }
  throw new Error("Tutorial chart did not resolve.");
}

async function facilityLayout(page: Page): Promise<{
  originX: number;
  originY: number;
  tileSize: number;
}> {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      HTMLDivElement & {
        __facilityGame: {
          scene: {
            getScene: (key: string) => {
              layout: { originX: number; originY: number; tileSize: number };
            };
          };
        };
      };
    return host.__facilityGame.scene.getScene("facility-scene").layout;
  });
}

test("fresh campaign builds a real Examination Room and door, then retains both", async ({
  page,
}) => {
  test.setTimeout(360_000);
  const clinicName = "GS-017 Fresh Build Clinic";
  await startClinic(page, "GS-017 Fresh Founder", clinicName);
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: `Resume ${clinicName}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const hasDevFacilityHook = await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']");
    return Boolean(host && "__facilityGame" in host);
  }, undefined, { timeout: 5_000 }).then(() => true).catch(() => false);
  test.skip(
    !hasDevFacilityHook,
    "Fresh canvas placement requires the DEV-only Phaser layout hook; production behavior is covered by the other batch cases.",
  );
  let state = (await getActiveState(page)) as unknown as GameState;
  expect(state.rooms.map((room) => room.roomDefinitionId)).toEqual(["room.front_desk"]);
  await page.screenshot({ path: `${SCREENSHOTS}/gs-017-fresh-no-examination-room.png`, animations: "disabled" });
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await dismissCoach(page);
  await (await waitForFirstPatientReady(page)).click();
  await dismissCoach(page);
  await answerTutorialCorrectly(page);
  await finishTutorialChart(page);
  await dismissCoach(page);
  const second = page.locator(".patient-folder.is-waiting .patient-tab").first();
  await expect(second).toBeVisible({ timeout: 25_000 });
  await second.click();
  await dismissCoach(page);
  await answerTutorialCorrectly(page);
  await dismissCoach(page);
  await page.getByRole("button", { name: "Enact Plan" }).click();
  const returnToClinic = page.getByRole("button", { name: "Return to clinic" });
  if (await returnToClinic.isVisible({ timeout: 2_000 }).catch(() => false)) await returnToClinic.click();
  await dismissCoach(page);
  const active = page.locator(".patient-folder.is-active .patient-tab").first();
  await expect(active).toHaveAccessibleName(/Action required/, { timeout: 70_000 });
  await active.click();
  await dismissCoach(page);
  await answerTutorialCorrectly(page);
  await finishTutorialChart(page);
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  const beforeBuild = (await getActiveState(page)) as unknown as GameState;
  expect(beforeBuild.paused).toBe(true);
  expect(beforeBuild.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason).toBe("completed");
  expect(beforeBuild.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.resolutionReason).toBe("completed");
  const retainedClinicalXp = beforeBuild.clinicalXp;
  await page.locator('[data-room-definition-id="room.examination"]').click();
  const canvas = page.locator(".facility-host canvas");
  const beforeRoomCount = ((await getActiveState(page)) as unknown as GameState).rooms.length;
  let layout = await facilityLayout(page);
  await canvas.click({ position: {
    x: layout.originX + 34.5 * layout.tileSize,
    y: layout.originY + 26.5 * layout.tileSize,
  } });
  await expect.poll(async () =>
    ((await getActiveState(page)) as unknown as GameState).rooms.length,
  ).toBe(beforeRoomCount + 1);
  state = (await getActiveState(page)) as unknown as GameState;
  const room = state.rooms.find((candidate) => candidate.roomDefinitionId === "room.examination")!;
  expect(state.cashCents).toBe(beforeBuild.cashCents - 16_000);
  await dismissCoach(page);
  await page.getByRole("button", { name: "Place Door" }).click();
  const beforeDoorCount = state.doors.length;
  layout = await facilityLayout(page);
  await canvas.click({ position: {
    x: layout.originX + 35.5 * layout.tileSize,
    y: layout.originY + 28 * layout.tileSize,
  } });
  await expect.poll(async () =>
    ((await getActiveState(page)) as unknown as GameState).doors.length,
  ).toBe(beforeDoorCount + 1);
  await page.getByRole("button", { name: "Done / Save" }).click();
  await expect(page.getByRole("button", { name: "Enter Build Mode" })).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/gs-017-player-built-examination-room.png`, animations: "disabled" });
  await page.reload();
  await page.getByRole("button", { name: `Resume ${clinicName}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const restored = (await getActiveState(page)) as unknown as GameState;
  expect(restored.rooms).toContainEqual(expect.objectContaining({ id: room.id }));
  expect(restored.doors).toContainEqual(expect.objectContaining({ roomId: room.id }));
  expect(restored.clinicalXp).toBe(retainedClinicalXp);
  expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason).toBe("completed");
  expect(restored.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.resolutionReason).toBe("completed");
});
