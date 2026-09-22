import { expect, test, type Page } from "@playwright/test";
import {
  getActiveState,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

const CLINIC_NAME = "GS-023 Graduation Clinic";

type ClinicalState = Awaited<ReturnType<typeof getActiveState>> & {
  facilityLevel: number;
  clinicalXp: number;
  openChartEncounterId: string | null;
  encounters: Record<string, {
    resolutionReason: "completed" | "walkout" | null;
    answers: Array<{ correct: boolean }>;
    frozenCase: { decisionNodes: Array<{ answerChoices: Array<{ label: string; isCorrect: boolean }> }> };
  }>;
  rooms: Array<{ id: string; roomDefinitionId: string }>;
  doors: Array<{ roomId: string }>;
};

async function state(page: Page): Promise<ClinicalState> {
  return await getActiveState(page) as ClinicalState;
}

async function dismissCoach(page: Page): Promise<boolean> {
  const button = page.getByRole("button", { name: "Got It" });
  if (!await button.isVisible({ timeout: 300 }).catch(() => false)) return false;
  await button.click();
  return true;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function chooseWrong(page: Page): Promise<void> {
  await waitForDecisionChoices(page);
  const current = await state(page);
  const encounter = current.encounters[current.openChartEncounterId!];
  if (!encounter) throw new Error("Expected an open chart.");
  const wrong = encounter.frozenCase.decisionNodes[
    encounter.answers.length
  ]!.answerChoices.find((choice) => !choice.isCorrect);
  if (!wrong) throw new Error("Expected a wrong answer.");
  await page.getByRole("button", {
    name: new RegExp(`^${escapeRegex(wrong.label)}`),
  }).click();
}

async function dismissWrongTerminalFeedback(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Dismiss and close chart" }).click();
  await expect(page.locator(".paper-chart")).toHaveCount(0);
}

async function dismissWrongIntermediateFeedback(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Close patient chart" }).click();
  await expect(page.locator(".paper-chart")).toHaveCount(0);
}

async function facilityLayout(page: Page): Promise<{ originX: number; originY: number; tileSize: number }> {
  await page.waitForFunction(
    () => Boolean((document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & { __facilityGame?: unknown } | null)?.__facilityGame),
    undefined,
    { timeout: 10_000 },
  );
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as HTMLDivElement & { __facilityGame: { scene: { getScene: (key: string) => { layout: { originX: number; originY: number; tileSize: number } } } } };
    return host.__facilityGame.scene.getScene("facility-scene").layout;
  });
}

test("a fresh all-wrong tutorial graduates after the ordinary examination-room build", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop canvas proof only.");
  testInfo.setTimeout(240_000);

  await startClinic(page, "GS-023 Graduation Founder", CLINIC_NAME);
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: `Resume ${CLINIC_NAME}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await dismissCoach(page);

  await (await waitForFirstPatientReady(page)).click();
  await dismissCoach(page);
  await chooseWrong(page);
  await dismissWrongTerminalFeedback(page);
  await dismissCoach(page);

  const secondPatient = page.locator(".patient-folder.is-waiting .patient-tab").first();
  await expect(secondPatient).toBeVisible({ timeout: 25_000 });
  await secondPatient.click();
  await dismissCoach(page);
  await chooseWrong(page);
  await dismissWrongIntermediateFeedback(page);
  await expect(
    page.locator(".tutorial-coach[data-tutorial-step='second-sendout-wait']"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();

  for (const tip of ["sendout-management", "sendout-trash", "sendout-water"]) {
    await expect(page.locator(`.tutorial-coach[data-tutorial-step='${tip}']`)).toBeVisible({ timeout: 30_000 });
    await page.getByRole("button", { name: "Got It" }).click();
  }
  const returnToClinic = page.getByRole("button", { name: "Return to clinic" });
  if (await returnToClinic.isVisible({ timeout: 2_000 }).catch(() => false)) await returnToClinic.click();
  const activeSecond = page.locator(".patient-folder.is-active .patient-tab").first();
  await expect(activeSecond).toHaveAccessibleName(/Action required/, { timeout: 70_000 });
  await activeSecond.click();
  await dismissCoach(page);
  await chooseWrong(page);
  await dismissWrongTerminalFeedback(page);

  let current = await state(page);
  expect(current.clinicalXp).toBe(6);
  expect(Object.values(current.encounters).filter((encounter) => encounter.resolutionReason === "completed")).toHaveLength(2);
  const answersBeforeBuild = Object.values(current.encounters).flatMap(
    (encounter) => encounter.answers,
  );
  expect(answersBeforeBuild).toHaveLength(3);
  expect(answersBeforeBuild.every((answer) => answer.correct === false)).toBe(true);
  if (current.cash < 160) {
    await page.getByRole("button", { name: /Complete consult \(\+\$50\)/ }).click();
  }
  await expect.poll(async () => (await state(page)).cash).toBeGreaterThanOrEqual(160);
  await expect(
    page.locator(".tutorial-coach[data-tutorial-step='alerts-tour']"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();

  const cashBeforeBuild = (await state(page)).cash;
  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  await page.locator('[data-room-definition-id="room.examination"]').click();
  const canvas = page.locator(".facility-host canvas");
  let layout = await facilityLayout(page);
  await canvas.click({ position: { x: layout.originX + 34.5 * layout.tileSize, y: layout.originY + 26.5 * layout.tileSize } });
  await expect.poll(async () => (await state(page)).rooms.filter((room) => room.roomDefinitionId === "room.examination").length).toBe(1);
  const afterRoom = await state(page);
  expect(afterRoom.cash).toBe(cashBeforeBuild - 160);
  const examRoom = afterRoom.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
  await page.getByRole("button", { name: "Place Door" }).click();
  layout = await facilityLayout(page);
  await canvas.click({ position: { x: layout.originX + 35.5 * layout.tileSize, y: layout.originY + 28 * layout.tileSize } });
  await expect.poll(async () => (await state(page)).doors.some((door) => door.roomId === examRoom.id)).toBe(true);
  await page.getByRole("button", { name: "Done / Save" }).click();
  await expect(
    page.locator(".tutorial-coach[data-tutorial-step='advance-level']"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(page.locator(".tutorial-coach")).toHaveCount(0);

  await expect(page.getByText("Complete both tutorial patients")).toBeVisible();
  await expect(page.getByText("Satisfaction above", { exact: false })).toHaveCount(0);
  await expect(page.getByText("6/10 XP")).toBeVisible();
  await page.screenshot({
    path: "artifacts/screenshots/gs-023-tutorial-graduation-ready.png",
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Advance to Level 1" }).click();
  await expect.poll(async () => (await state(page)).facilityLevel).toBe(1);
  await page.reload();
  await page.getByRole("button", { name: `Resume ${CLINIC_NAME}` }).click();
  current = await state(page);
  expect(current.facilityLevel).toBe(1);
  expect(Object.values(current.encounters).filter((encounter) => encounter.resolutionReason === "completed")).toHaveLength(2);
  const restoredAnswers = Object.values(current.encounters).flatMap(
    (encounter) => encounter.answers,
  );
  expect(restoredAnswers).toHaveLength(3);
  expect(restoredAnswers.every((answer) => answer.correct === false)).toBe(true);
});
