import { expect, test, type Locator, type Page } from "@playwright/test";

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

  const [coachBox, targetBox, protectedBox, beaconBox] = await Promise.all([
    coach.boundingBox(),
    target.boundingBox(),
    protectedRegion.boundingBox(),
    beacon.boundingBox(),
  ]);
  expect(coachBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  expect(protectedBox).not.toBeNull();
  expect(beaconBox).not.toBeNull();
  if (!coachBox || !targetBox || !protectedBox || !beaconBox) {
    return;
  }

  const overlaps = !(
    coachBox.x + coachBox.width <= protectedBox.x ||
    coachBox.x >= protectedBox.x + protectedBox.width ||
    coachBox.y + coachBox.height <= protectedBox.y ||
    coachBox.y >= protectedBox.y + protectedBox.height
  );
  expect(overlaps).toBe(false);

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
  expect(
    Math.hypot(beaconHorizontalGap, beaconVerticalGap),
  ).toBeLessThanOrEqual(12);

  expect(coachBox.x).toBeGreaterThanOrEqual(0);
  expect(coachBox.y).toBeGreaterThanOrEqual(0);
  expect(coachBox.x + coachBox.width).toBeLessThanOrEqual(
    await page.evaluate(() => window.innerWidth),
  );
  expect(coachBox.y + coachBox.height).toBeLessThanOrEqual(
    await page.evaluate(() => window.innerHeight),
  );
}

test("keeps tutorial guidance beside real controls at variable widths", async ({
  page,
}) => {
  await page.goto("/");

  const coach = page.locator(".tutorial-coach");
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
