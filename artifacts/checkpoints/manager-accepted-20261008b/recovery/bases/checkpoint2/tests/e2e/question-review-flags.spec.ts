import { expect, test } from "@playwright/test";
import {
  getActiveState,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

test("a player can flag the exact displayed question for developer review", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The persistence walkthrough runs once at the primary desktop size.",
  );

  await startClinic(page, "Review Founder", "Review Surgical Clinic");
  await setFastFacilitySpeed(page);
  const patient = await waitForFirstPatientReady(page);
  await page.getByRole("button", { name: "Got It" }).click();
  await patient.click();
  await waitForDecisionChoices(page);

  const beforeFlag = await getActiveState(page);
  const encounter =
    beforeFlag.encounters[beforeFlag.openChartEncounterId!];
  const question =
    encounter.frozenCase.decisionNodes[encounter.currentNodeIndex];

  await page
    .getByRole("button", {
      name: "Flag this question for developer review",
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Question flagged for developer review",
    }),
  ).toBeDisabled();

  const questionFlags = await page.evaluate(() => {
    const raw = window.localStorage.getItem(
      "gamify-surgery.question-review-flags.v1",
    );
    return raw
      ? (JSON.parse(raw) as {
          flags: Array<{
            questionVariantId: string;
            stem: string;
            status: string;
          }>;
        }).flags
      : [];
  });
  expect(questionFlags).toEqual([
    expect.objectContaining({
      questionVariantId: question.questionVariantId,
      stem: question.stem,
      status: "open",
    }),
  ]);

  await page.reload();
  const persistedFlags = await page.evaluate(() => {
    const raw = window.localStorage.getItem(
      "gamify-surgery.question-review-flags.v1",
    );
    return raw
      ? (JSON.parse(raw) as { flags: unknown[] }).flags.length
      : 0;
  });
  expect(persistedFlags).toBe(1);
});
