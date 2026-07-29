import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  setFastFacilitySpeed,
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

test("keeps tutorial guidance beside real controls at variable widths", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "phone-chrome",
    "Phone tutorial usability is covered through interactions rather than desktop callout geometry.",
  );

  await startClinic(
    page,
    "Tutorial Founder",
    `Tutorial Positioning ${testInfo.project.name}`,
  );
  await setFastFacilitySpeed(page);
  await waitForFirstPatientReady(page);

  const coach = page.locator(".tutorial-coach");
  const arrivalCoach = coach.getByRole("heading", {
    name: "Your first patient is walking to check-in",
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
  await expectCoachBesideTarget(
    page,
    answers,
    page.locator(".chart-panel"),
  );
  await expect(
    coach.getByRole("button", { name: /choose|answer|continue/i }),
  ).toHaveCount(0);
});
