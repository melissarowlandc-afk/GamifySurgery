import { expect, test } from "@playwright/test";
import { SECOND_TUTORIAL_ENCOUNTER_ID } from "@gamify-surgery/game-domain";
import { setFastFacilitySpeed, startClinic, waitForFirstPatientReady } from "./helpers";
import {
  chooseTutorialAnswer, enactTutorialPlan, expectNoMandatoryCoachClicks, fileTutorialChart,
  openReturnedTutorialChart, reloadTutorialCampaign, resumeFacility, tutorialState,
} from "./tutorial-helpers";

test("timed visits keep running; optional Management, Help and deliberate pause retain ownership across reload", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Full timed-visit recovery runs once at desktop width.");
  testInfo.setTimeout(240_000);
  const clinicName = "Timed Guidance Recovery Clinic";
  await startClinic(page, "Waiting Founder", clinicName);
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await (await waitForFirstPatientReady(page)).click();
  await chooseTutorialAnswer(page, true);
  await fileTutorialChart(page);
  const second = page.locator(".patient-folder.is-waiting .patient-tab").first();
  await expect(second).toBeVisible({timeout: 30_000});
  await second.click();
  await chooseTutorialAnswer(page, false);
  await enactTutorialPlan(page, false);
  await expect.poll(async () => {
    const encounter = (await tutorialState(page)).encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!;
    return encounter.patientLocation === null && encounter.patientMovement === null;
  }, {timeout: 30_000}).toBe(true);
  await expect(page.locator(".tutorial-coach")).toHaveAttribute("data-tutorial-step", "sendout-management");
  const pending = await tutorialState(page);
  expect(pending.paused).toBe(false);
  expect(pending.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.answers[0]!.correct).toBe(false);
  await expectNoMandatoryCoachClicks(page);
  await expect.poll(async () => (await tutorialState(page)).facilityTick).toBeGreaterThan(pending.facilityTick);

  await page.getByRole("button", {name: "Enter Management Mode", exact: true}).click();
  await expect(page.getByRole("tab", {name: "Employees"})).toBeVisible();
  expect((await tutorialState(page)).paused).toBe(true);
  await expect(page.locator(".tutorial-coach")).toHaveCount(0);
  await page.getByRole("button", {name: "Done", exact: true}).click();
  await expect.poll(async () => (await tutorialState(page)).paused).toBe(false);
  await expect.poll(async () => (await tutorialState(page)).alertHumor.guidanceTips?.topicActivity?.management?.exposedAtTick).not.toBeUndefined();
  await expect(page.locator(".tutorial-coach[data-tutorial-step='sendout-trash'], .tutorial-coach[data-tutorial-step='sendout-water']")).toHaveCount(0);

  await page.getByRole("button", {name: "Pause facility time"}).click();
  const paused = await tutorialState(page);
  await page.getByRole("button", {name: "Help", exact: true}).click();
  await expect(page.getByRole("navigation", {name: "Help topics"}).getByRole("button")).toHaveCount(6);
  await page.getByRole("button", {name: "Time & waiting", exact: true}).click();
  await expect(page.getByRole("dialog")).toContainText("Tips never pause the clinic");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", {name: "Help", exact: true})).toBeFocused();
  expect((await tutorialState(page)).paused).toBe(true);

  await reloadTutorialCampaign(page, clinicName);
  const restored = await tutorialState(page);
  expect(restored.paused).toBe(true);
  expect(restored.facilityTick).toBe(paused.facilityTick);
  expect(restored.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.frozenCase).toEqual(paused.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.frozenCase);
  expect(restored.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.pendingResult).toEqual(paused.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.pendingResult);
  expect(restored.learningHistories).toEqual(paused.learningHistories);
  await expect(page.locator(".tutorial-coach")).toContainText("Resume");
  await resumeFacility(page);
  await openReturnedTutorialChart(page);
  await chooseTutorialAnswer(page, true);
  await fileTutorialChart(page);
  expect((await tutorialState(page)).encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.answers.map((answer) => answer.correct)).toEqual([false, true]);
});

test("Help restores a running clinic without stealing its chart or answer shortcuts", async ({page}) => {
  await startClinic(page, "Help Founder", "Short Help Clinic");
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await (await waitForFirstPatientReady(page)).click();
  await expect(page.locator(".cs-step.is-current .cs-answer").first()).toBeVisible();
  const before = await tutorialState(page);
  await page.getByRole("button", {name: "Help", exact: true}).click();
  expect((await tutorialState(page)).paused).toBe(true);
  await page.keyboard.press("1");
  expect((await tutorialState(page)).encounters[before.openChartEncounterId!]!.answers).toEqual([]);
  await page.keyboard.press("Escape");
  await expect.poll(async () => (await tutorialState(page)).paused).toBe(false);
  await expect(page.locator(".chart-sheet")).toBeVisible();
  await page.keyboard.press("1");
  await expect.poll(async () => (await tutorialState(page)).encounters[before.openChartEncounterId!]!.answers.length).toBe(1);
});
