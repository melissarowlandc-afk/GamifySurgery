import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  setFastFacilitySpeed,
  getActiveState,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

async function expectCoachBesideTarget(
  page: Page,
  target: Locator,
  protectedRegion: Locator = target,
): Promise<void> {
  const coach = page.locator(".tutorial-coach");
  const beacon = page.locator(".tutorial-target-beacon");
  await expect(coach).toHaveAttribute("data-target-positioned", "true");
  await expect(beacon).toBeVisible();
  await expect(target).toHaveClass(/tutorial-target-highlight/);

  await expect
    .poll(
      async () => {
        const [coachBox, targetBox, protectedBox, beaconBox] =
          await Promise.all([
            coach.boundingBox(),
            target.boundingBox(),
            protectedRegion.boundingBox(),
            beacon.boundingBox(),
          ]);
        if (!coachBox || !targetBox || !protectedBox || !beaconBox) {
          return false;
        }
        if (
          targetBox.width <= 0 ||
          targetBox.height <= 0 ||
          coachBox.width <= 0 ||
          coachBox.height <= 0
        ) {
          return false;
        }
        const overlaps = !(
          coachBox.x + coachBox.width <= protectedBox.x ||
          coachBox.x >= protectedBox.x + protectedBox.width ||
          coachBox.y + coachBox.height <= protectedBox.y ||
          coachBox.y >= protectedBox.y + protectedBox.height
        );
        const beaconHorizontalGap = Math.max(
          targetBox.x - (beaconBox.x + beaconBox.width),
          beaconBox.x - (targetBox.x + targetBox.width),
          0,
        );
        const beaconVerticalGap = Math.max(
          targetBox.y - (beaconBox.y + beaconBox.height),
          beaconBox.y - (targetBox.y + targetBox.height),
          0,
        );
        const viewport = await page.evaluate(() => ({
          width: window.innerWidth,
          height: window.innerHeight,
        }));
        return (
          !overlaps &&
          Math.hypot(beaconHorizontalGap, beaconVerticalGap) <= 12 &&
          coachBox.x >= 0 &&
          coachBox.y >= 0 &&
          coachBox.x + coachBox.width <= viewport.width &&
          coachBox.y + coachBox.height <= viewport.height
        );
      },
      { timeout: 15_000 },
    )
    .toBe(true);
}

async function expectCoachToRemainStable(
  page: Page,
  durationMs = 1_100,
): Promise<void> {
  const coach = page.locator(".tutorial-coach");
  await expect(coach).toHaveAttribute("data-target-positioned", "true");

  // Wait through the initial width measurement before starting the stability
  // window. Facility ticks continue at 4x while these frames are sampled.
  await page.waitForTimeout(100);
  const result = await page.evaluate(async (duration) => {
    const samples: Array<{
      positioned: boolean;
      placement: string | null;
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const started = performance.now();
    await new Promise<void>((resolve) => {
      const sample = () => {
        const current = document.querySelector<HTMLElement>(
          ".tutorial-coach",
        );
        if (current) {
          const box = current.getBoundingClientRect();
          samples.push({
            positioned:
              current.dataset.targetPositioned === "true",
            placement: current.dataset.placement ?? null,
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
          });
        }
        if (performance.now() - started >= duration) {
          resolve();
        } else {
          requestAnimationFrame(sample);
        }
      };
      requestAnimationFrame(sample);
    });

    const positionedSamples = samples.filter(
      (sample) => sample.positioned,
    );
    const first = positionedSamples[0] ?? null;
    return {
      sampleCount: samples.length,
      allPositioned:
        samples.length > 0 &&
        samples.every((sample) => sample.positioned),
      placements: Array.from(
        new Set(samples.map((sample) => sample.placement)),
      ),
      maximumDrift:
        first === null
          ? Number.POSITIVE_INFINITY
          : positionedSamples.reduce(
              (maximum, sample) =>
                Math.max(
                  maximum,
                  Math.abs(sample.x - first.x),
                  Math.abs(sample.y - first.y),
                  Math.abs(sample.width - first.width),
                  Math.abs(sample.height - first.height),
                ),
              0,
            ),
    };
  }, durationMs);

  expect(result.sampleCount).toBeGreaterThan(10);
  expect(result.allPositioned).toBe(true);
  expect(result.placements).toHaveLength(1);
  expect(result.maximumDrift).toBeLessThanOrEqual(1);
}

test("keeps tutorial guidance beside real controls at variable widths", async ({
  page,
}, testInfo) => {
  await startClinic(
    page,
    "Tutorial Founder",
    `Tutorial Positioning ${testInfo.project.name}`,
  );
  await setFastFacilitySpeed(page);
  await waitForFirstPatientReady(page);

  const coach = page.locator(".tutorial-coach");
  const arrivalCoach = coach.getByRole("heading", {
    name: "Your first patient is entering the clinic",
  });
  if (await arrivalCoach.isVisible()) {
    await coach.getByRole("button", { name: "Got It" }).click();
  }
  await expect(
    coach.getByRole("heading", {
      name: "Open your first patient chart",
    }),
  ).toBeVisible();

  const firstPatient = page
    .locator(".patient-folder.is-waiting .patient-tab")
    .first();
  await expectCoachBesideTarget(page, firstPatient);
  await expectCoachToRemainStable(page);
  await expect(
    coach.getByRole("button", { name: /open first chart/i }),
  ).toHaveCount(0);

  // The tutorial advances only when the player uses the highlighted control.
  await firstPatient.click();
  await waitForDecisionChoices(page);
  await expect(
    coach.getByRole("heading", {
      name: "Read across the chart, then choose",
    }),
  ).toBeVisible();

  const answers = page.locator(
    ".chart-step-column.is-current .answer-list",
  );
  await expectCoachBesideTarget(page, answers);
  await expectCoachToRemainStable(page);
  await expect(
    coach.getByRole("button", { name: /choose|answer|continue/i }),
  ).toHaveCount(0);
});

test("keeps multistep feedback and semantic action anchors precise", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(90_000);
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The complete tutorial target walkthrough runs once at desktop width.",
  );

  await startClinic(
    page,
    "Tutorial Anchor Founder",
    "Tutorial Anchor Surgical Clinic",
  );
  await setFastFacilitySpeed(page);
  const firstPatient = await waitForFirstPatientReady(page);
  await page.getByRole("button", { name: "Got It" }).click();
  await firstPatient.click();
  await waitForDecisionChoices(page);
  await page.getByRole("button", { name: "Got It" }).click();
  // This is a tutorial-geometry test, not a clinical-content wording test.
  // The campaign seed may select any approved question variant, so exercise
  // the real current answer control without coupling the walkthrough to one
  // particular stem or option label.
  const serviceState = await getActiveState(page);
  const serviceEncounter = serviceState.encounters[
    serviceState.openChartEncounterId!
  ]!;
  const serviceChoice = serviceEncounter.frozenCase.decisionNodes[
    serviceEncounter.currentNodeIndex
  ]!.answerChoices.find((choice) => choice.isCorrect)!;
  await page.getByRole("button", { name: serviceChoice.label, exact: true }).click();

  const currentFeedback = page.locator(
    ".chart-step-column.is-current .chart-step-feedback",
  );
  await expect(
    page.getByRole("heading", { name: "Review the decision result" }),
  ).toBeVisible();
  await expectCoachBesideTarget(page, currentFeedback);
  await expectCoachToRemainStable(page);

  await page.getByRole("button", { name: "Got It" }).click();
  const dismissFirstCoach = page.getByRole("heading", {
    name: "Dismiss the completed decision",
  });
  if (await dismissFirstCoach.isVisible({ timeout: 2_000 })) {
    const firstDismiss = page.locator(
      '[data-tutorial-anchor="decision-feedback-action"]',
    );
    await expectCoachBesideTarget(page, firstDismiss);
    await page.getByRole("button", { name: "Got It" }).click();
    await firstDismiss.click();
  }
  await expect(
    page.getByRole("heading", { name: "Review the encounter summary" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Flip for More Disease Information",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await page
    .getByRole("button", { name: "Flip for More Disease Information" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Resolve Completed Chart" }),
  ).toBeVisible();
  const firstResolve = page.locator(
    '[data-tutorial-anchor="resolve-chart"]',
  );
  await expectCoachBesideTarget(page, firstResolve);
  await page.getByRole("button", { name: "Got It" }).click();
  await firstResolve.click();

  const quietMomentCoach = page.getByRole("heading", {
    name: "Use quiet moments around the clinic",
  });
  if (await quietMomentCoach.isVisible({ timeout: 2_000 })) {
    await page.getByRole("button", { name: "Got It" }).click();
  }
  const secondArrivalCoach = page.getByRole("heading", {
    name: /is entering the clinic$/,
  });
  if (await secondArrivalCoach.isVisible({ timeout: 8_000 })) {
    await page.getByRole("button", { name: "Got It" }).click();
  }

  const secondPatient = page
    .locator(".patient-folder.is-waiting .patient-tab")
    .first();
  await expect(secondPatient).toBeVisible({ timeout: 15_000 });
  await secondPatient.click();
  await waitForDecisionChoices(page);
  await expect(
    page.getByRole("heading", { name: "Choose the first plan" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  const finalState = await getActiveState(page);
  const finalEncounter = finalState.encounters[
    finalState.openChartEncounterId!
  ]!;
  const finalChoice = finalEncounter.frozenCase.decisionNodes[
    finalEncounter.currentNodeIndex
  ]!.answerChoices.find((choice) => choice.isCorrect)!;
  await page
    .getByRole("button", {
      name: new RegExp(
        `^${finalChoice.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Review the answer before care begins",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Send the patient for the timed service",
    }),
  ).toBeVisible();
  const enactPlan = page.locator(
    '[data-tutorial-anchor="decision-feedback-action"]',
  );
  await expectCoachBesideTarget(page, enactPlan);
  await page.getByRole("button", { name: "Got It" }).click();
  await enactPlan.click();

  const returnToClinic = page.getByRole("button", {
    name: "Return to clinic",
  });
  if (await returnToClinic.isVisible({ timeout: 2_000 })) {
    await returnToClinic.click();
  } else {
    // Physical travel may still be finishing before the pending-result
    // action appears. Close the chart through its ordinary control so this
    // positioning test deterministically exercises the returning-patient
    // tab anchor rather than racing the service route.
    const closeChart = page.getByRole("button", {
      name: "Close patient chart",
    });
    if (await closeChart.isVisible({ timeout: 2_000 })) {
      await closeChart.click();
    }
  }
  const awayCoach = page.getByRole("heading", {
    name: "The patient is away for the timed service",
  });
  if (await awayCoach.isVisible({ timeout: 5_000 })) {
    await page.getByRole("button", { name: "Got It" }).click();
  }

  const returningPatient = page
    .locator(".patient-folder.is-active .patient-tab")
    .first();
  await expect(returningPatient).toHaveAccessibleName(/Action required/, {
    timeout: 60_000,
  });
  await expect(
    page.getByRole("heading", {
      name: "The returning patient is ready",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await returningPatient.click();
  await expect(
    page.getByRole("heading", {
      name: "The result unlocked the next decision",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await page
    .locator(".chart-step-column.is-current .answer-choice")
    .first()
    .click();

  await expect(
    page.getByRole("heading", { name: "Review the final decision" }),
  ).toBeVisible();
  const finalFeedback = page.locator(
    ".chart-step-column.is-current .chart-step-feedback",
  );
  await expectCoachBesideTarget(page, finalFeedback);
  await expectCoachToRemainStable(page);
  await expect(
    page.locator(
      ".chart-completed-decision .chart-step-feedback.tutorial-target-highlight",
    ),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Got It" }).click();
  const dismissFinalCoach = page.getByRole("heading", {
    name: "Dismiss the final decision",
  });
  if (await dismissFinalCoach.isVisible({ timeout: 2_000 })) {
    const finalDismiss = page.locator(
      '[data-tutorial-anchor="decision-feedback-action"]',
    );
    await expectCoachBesideTarget(page, finalDismiss);
    await page.getByRole("button", { name: "Got It" }).click();
    await finalDismiss.click();
  }
  await expect(
    page.getByRole("heading", { name: "Resolve the second chart" }),
  ).toBeVisible();
  const secondResolve = page.locator(
    '[data-tutorial-anchor="resolve-chart"]',
  );
  await expectCoachBesideTarget(page, secondResolve);
  await page.getByRole("button", { name: "Got It" }).click();
  await secondResolve.click();

  await expect(
    page.getByRole("heading", {
      name: "Alerts explain what the clinic needs",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Got It" }).click();
  await expect(
    page.getByRole("heading", { name: "Enter Build Mode" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Enter Build Mode" }).click();

  await expect(
    page.locator('[data-tutorial-anchor="place-door"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-tutorial-anchor="build-done"]'),
  ).toBeVisible();
});
