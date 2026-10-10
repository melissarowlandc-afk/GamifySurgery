import { expect, test } from "@playwright/test";
import { SECOND_TUTORIAL_ENCOUNTER_ID, getRoomDefinition, getRoomNavigableTiles, getRoomNavigationAnchor } from "@gamify-surgery/game-domain";
import { setFastFacilitySpeed, startClinic, waitForFirstPatientReady } from "./helpers";
import {
  chooseTutorialAnswer, clickFacilityTile, enactTutorialPlan, fileTutorialChart,
  openReturnedTutorialChart, reloadTutorialCampaign, resumeFacility, tutorialState,
} from "./tutorial-helpers";

test("arrival overlays absorb clicks and a moved founder returns to check in the second patient", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "The natural check-in recovery runs once; positioning covers all viewport projects.");
  testInfo.setTimeout(100_000);
  await startClinic(page, "Arrival Founder", "Arrival Recovery Clinic");
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await (await waitForFirstPatientReady(page)).click();
  await chooseTutorialAnswer(page, true);
  await page.getByRole("button", {name: "Pause facility time"}).click();
  await fileTutorialChart(page);
  await page.getByRole("button", {name: "Set facility speed to 1x"}).click();

  const coach = page.locator(".tutorial-coach");
  const beacon = page.locator(".tutorial-target-beacon");
  await expect(coach).toBeVisible();
  await expect(beacon).toBeVisible();
  await expect(coach).toHaveCSS("pointer-events", "auto");
  await expect(beacon).toHaveCSS("pointer-events", "auto");
  const before = await tutorialState(page);
  const moves = (state: typeof before) => Object.values(state.operationReceipts).filter((r) => r.commandType === "MOVE_FOUNDER");
  await beacon.click();
  await coach.locator("h2").click();
  const after = await tutorialState(page);
  expect(moves(after)).toEqual(moves(before));
  expect(after.environment.founderLocation).toEqual(before.environment.founderLocation);
  expect(after.environment.founderActivity).toEqual(before.environment.founderActivity);

  const deskRoom = after.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
  const definition = getRoomDefinition(deskRoom.roomDefinitionId)!;
  const desk = getRoomNavigationAnchor(deskRoom, definition, "staff");
  const destination = getRoomNavigableTiles(deskRoom, definition, after.doors)
    .filter((point) => point.x !== desk.x || point.y !== desk.y)
    .sort((a, b) => Math.abs(b.x - desk.x) + Math.abs(b.y - desk.y) - Math.abs(a.x - desk.x) - Math.abs(a.y - desk.y))[0]!;
  await clickFacilityTile(page, destination.x + 0.5, destination.y + 0.5);
  expect((await tutorialState(page)).environment.founderActivity?.kind).toBe("walk_to_point");
  await resumeFacility(page);
  await expect(coach).toHaveAttribute("data-tutorial-step", "second-patient-arriving", {timeout: 30_000});
  await expect(coach).toContainText("Front Desk");
  await expect(page.locator(".patient-folder.is-waiting")).toHaveClass(/tutorial-target-highlight/);
  await expect(page.locator("[data-tutorial-anchor='facility-entrance'].tutorial-target-highlight")).toHaveCount(0);
  await expect.poll(async () => (await tutorialState(page)).encounters[SECOND_TUTORIAL_ENCOUNTER_ID]?.checkInStatus,
    {timeout: 30_000}).toBe("checked_in");
  const checkedIn = await tutorialState(page);
  expect(checkedIn.environment.founderLocation).toEqual(desk);
  expect(checkedIn.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.unstaffedCheckInOverdueApplied).toBe(false);
  await page.locator(".patient-folder.is-waiting .patient-tab").first().click();
  await expect(page.locator(".cs-step.is-current .cs-answer").first()).toBeVisible();
});

test("selected 1x guided testing takes 1–2 running minutes and resumes the same saved plan", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Measure the real guided clock once, without Prototype fast-forward.");
  testInfo.setTimeout(220_000);
  const clinicName = "Brisk Guided Wait Clinic";
  await startClinic(page, "Timing Founder", clinicName);
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await (await waitForFirstPatientReady(page)).click();
  await chooseTutorialAnswer(page, true);
  await fileTutorialChart(page);
  const second = page.locator(".patient-folder.is-waiting .patient-tab").first();
  await expect(second).toBeVisible({timeout: 30_000});
  await second.click();
  await page.getByRole("button", {name: "Pause facility time"}).click();
  await page.getByRole("button", {name: "Set facility speed to 1x"}).click();
  await expect(page.locator(".tutorial-coach")).toContainText("game-time estimates");
  await chooseTutorialAnswer(page, false);
  await enactTutorialPlan(page, false);
  await expect(page.locator(".tutorial-coach")).toContainText("First-shift fast-forward");
  await expect(page.locator(".tutorial-coach")).toContainText("2×");
  const start = await tutorialState(page);
  const startedAt = Date.now();
  await resumeFacility(page);
  await expect.poll(async () => (await tutorialState(page)).facilityTick, {timeout: 30_000, intervals: [250]})
    .toBeGreaterThanOrEqual(start.facilityTick + 40);
  await page.getByRole("button", {name: "Pause facility time"}).click();
  const firstRunningMs = Date.now() - startedAt;
  const paused = await tutorialState(page);
  expect(paused.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe("active_pending_result");
  await reloadTutorialCampaign(page, clinicName);
  const restored = await tutorialState(page);
  expect(restored.paused).toBe(true);
  expect(restored.simulationSpeed).toBe(1);
  expect(restored.facilityTick).toBe(paused.facilityTick);
  expect(restored.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.pendingResult).toEqual(paused.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.pendingResult);
  expect(restored.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.frozenCase).toEqual(paused.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.frozenCase);
  expect(restored.reviewIntents).toEqual(paused.reviewIntents);
  await expect(page.locator(".tutorial-coach")).toContainText("Resume");
  await expect(page.locator(".tutorial-coach")).toContainText("2×");
  const resumedAt = Date.now();
  await resumeFacility(page);
  await openReturnedTutorialChart(page);
  const runningMs = firstRunningMs + Date.now() - resumedAt;
  expect(runningMs).toBeGreaterThanOrEqual(60_000);
  expect(runningMs).toBeLessThanOrEqual(120_000);
  expect((await tutorialState(page)).simulationSpeed).toBe(1);
  await expect(page.locator(".tutorial-coach")).not.toContainText("fast-forward");
  await chooseTutorialAnswer(page, true);
  await fileTutorialChart(page);
  expect((await tutorialState(page)).encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.answers.map((a) => a.correct)).toEqual([false, true]);
});
