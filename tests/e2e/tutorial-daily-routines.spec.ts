import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  getCurrentQuestion,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  getActiveState,
  getProfile,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
const CLINIC_NAME = "GS-023 Daily Routines Clinic";

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function dismissCoach(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: "Got It" });
  if (await button.isVisible({ timeout: 500 }).catch(() => false)) {
    await button.click();
  }
}

async function answerTutorialCorrectly(page: Page): Promise<void> {
  await waitForDecisionChoices(page);
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[state.openChartEncounterId!]!;
  const question = getCurrentQuestion(state, encounter.id)!;
  const correct = question.node.answerChoices.find(
    (choice) => choice.isCorrect,
  )!;
  await page
    .getByRole("button", {
      name: new RegExp(`^${escapeRegex(correct.label)}(?:$|\\s)`),
    })
    .click();
}

async function finishTutorialChart(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await dismissCoach(page);
    const flip = page.getByRole("button", {
      name: /Flip for (?:M|m)ore Disease Information/,
    });
    if (await flip.isVisible({ timeout: 200 }).catch(() => false)) {
      await flip.click();
      continue;
    }
    const resolve = page.getByRole("button", {
      name: "Resolve Completed Chart",
    });
    if (await resolve.isVisible({ timeout: 200 }).catch(() => false)) {
      await resolve.click();
      return;
    }
  }
  throw new Error("Tutorial chart did not resolve.");
}

async function resumeCampaignAfterReload(page: Page): Promise<void> {
  await page.reload();
  await page
    .getByRole("button", { name: `Resume ${CLINIC_NAME}` })
    .click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function expectTip(page: Page, id: string): Promise<void> {
  await expect(
    page.locator(`.tutorial-coach[data-tutorial-step='${id}']`),
  ).toBeVisible({ timeout: 30_000 });
}

test("daily-routine tips survive first and later reloads and release their pause after Management closes", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await startClinic(page, "GS-023 Routine Founder", CLINIC_NAME);
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
  await dismissCoach(page);

  await expectTip(page, "sendout-management");
  const beforeFirstReload = (await getActiveState(page)) as unknown as GameState;
  expect(beforeFirstReload.paused).toBe(true);
  expect(
    beforeFirstReload.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!
      .patientLocation,
  ).toBeNull();
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-023-sendout-management-before-reload.png`,
    animations: "disabled",
  });

  await resumeCampaignAfterReload(page);
  await expectTip(page, "sendout-management");
  const afterFirstReload = (await getActiveState(page)) as unknown as GameState;
  expect(afterFirstReload.paused).toBe(true);
  expect(afterFirstReload.facilityTick).toBe(beforeFirstReload.facilityTick);

  await page.getByRole("button", { name: "Open Management" }).click();
  await expect(page.getByRole("tab", { name: "Employees" })).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Services & income" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  await expectTip(page, "sendout-management");
  expect(
    ((await getActiveState(page)) as unknown as GameState).paused,
  ).toBe(true);

  await page.getByRole("button", { name: "Got It" }).click();
  await expectTip(page, "sendout-trash");
  await expect
    .poll(async () => {
      const profile = await getProfile(page);
      const routineProgress = profile as typeof profile & {
        tutorialDailyRoutineTipAcknowledgments?: Record<string, string[]>;
      };
      return routineProgress.tutorialDailyRoutineTipAcknowledgments?.[
        profile.activeCampaignId!
      ];
    })
    .toContain("sendout-management");
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-023-sendout-trash-before-reload.png`,
    animations: "disabled",
  });

  await resumeCampaignAfterReload(page);
  await expectTip(page, "sendout-trash");
  expect(
    ((await getActiveState(page)) as unknown as GameState).paused,
  ).toBe(true);

  await page.getByRole("button", { name: "Got It" }).click();
  await expectTip(page, "sendout-water");
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-023-sendout-water.png`,
    animations: "disabled",
  });
  const beforeRelease = (await getActiveState(page)) as unknown as GameState;
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.locator(".tutorial-coach[data-tutorial-step^='sendout-']"),
  ).toHaveCount(0);
  await expect
    .poll(
      async () =>
        ((await getActiveState(page)) as unknown as GameState).paused,
    )
    .toBe(false);
  await expect
    .poll(
      async () =>
        ((await getActiveState(page)) as unknown as GameState).facilityTick,
    )
    .toBeGreaterThan(beforeRelease.facilityTick);
});
