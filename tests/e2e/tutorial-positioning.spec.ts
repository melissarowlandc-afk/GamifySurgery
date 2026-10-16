import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";
import { chooseTutorialAnswer, enactTutorialPlan, expectNoMandatoryCoachClicks, fileTutorialChart, openReturnedTutorialChart, resumeFacility, tutorialState } from "./tutorial-helpers";

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

test("keeps a compact native-action coach usable at every viewport", async ({page}, testInfo) => {
  await startClinic(page, "Tutorial Founder", `Tutorial Positioning ${testInfo.project.name}`);
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  const firstPatient = await waitForFirstPatientReady(page);
  const coach = page.locator(".tutorial-coach");
  await expect(coach).toHaveAttribute("data-tutorial-step", "open-first-chart");
  await expectCoachBesideTarget(page, firstPatient);
  await expectCoachToRemainStable(page);
  await expectNoMandatoryCoachClicks(page);
  const width = await coach.evaluate((element) => element.getBoundingClientRect().width);
  expect(width).toBeLessThanOrEqual(340);

  await firstPatient.click();
  await waitForDecisionChoices(page);
  await expect(coach).toHaveAttribute("data-tutorial-step", "first-decision");
  const answers = page.locator("[data-tutorial-anchor='current-answer-choices']");
  await answers.scrollIntoViewIfNeeded();
  await expectCoachBesideTarget(page, answers, testInfo.project.name === "phone-chrome" ? answers : page.locator(".chart-sheet"));
  await expectCoachToRemainStable(page);
  await expectNoMandatoryCoachClicks(page);
  await page.keyboard.press("Escape");
  await expect(page.locator(".chart-sheet")).toHaveCount(0);
  await expect(coach).toHaveAttribute("data-tutorial-step", "reopen-first-chart");
  await page.locator(".patient-folder.is-active .patient-tab").first().click();
  await waitForDecisionChoices(page);
  await page.keyboard.press("1");
  await expect.poll(async () => {
    const state = await tutorialState(page);
    return state.encounters[state.openChartEncounterId!]!.answers.length;
  }).toBe(1);
  await expect(page.getByRole("button", {name: /^(Resolve Completed Chart|Dismiss and close chart)$/})).toBeVisible();
  await expectNoMandatoryCoachClicks(page);
});

test("anchors feedback to native filing and timed-plan controls without a tour", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Full semantic anchor walkthrough runs once at desktop width.");
  testInfo.setTimeout(180_000);
  await startClinic(page, "Anchor Founder", "Tutorial Anchor Clinic");
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await (await waitForFirstPatientReady(page)).click();
  await chooseTutorialAnswer(page, false);
  await expectCoachBesideTarget(page, page.locator("[data-tutorial-anchor='decision-feedback-action']"), page.locator(".chart-sheet"));
  await expectCoachToRemainStable(page);
  await fileTutorialChart(page);
  const second = page.locator(".patient-folder.is-waiting .patient-tab").first();
  await expect(second).toBeVisible({timeout: 30_000});
  await second.click();
  await chooseTutorialAnswer(page, true);
  const plan = page.getByRole("button", {name: "Enact Plan", exact: true});
  await expectCoachBesideTarget(page, plan, page.locator(".chart-sheet"));
  await expectCoachToRemainStable(page);
  await enactTutorialPlan(page, true);
  await openReturnedTutorialChart(page);
  await expect(page.locator(".cs-past")).toHaveCount(1);
  await chooseTutorialAnswer(page, true);
  const resolve = page.locator("[data-tutorial-anchor='resolve-chart']");
  await expectCoachBesideTarget(page, resolve, page.locator(".chart-sheet"));
  await expectCoachToRemainStable(page);
  await expect(page.locator(".cs-past .tutorial-target-highlight")).toHaveCount(0);
  await fileTutorialChart(page);
  await expectNoMandatoryCoachClicks(page);
  const coach = page.locator(".tutorial-coach");
  await expect(coach).toHaveAttribute("data-tutorial-step", /enter-build-mode|remaining-goals/);
});
