import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  INTRO_TAGLINES,
  LAST_INTRO_TAGLINE_SESSION_KEY,
} from "../../apps/player/src/content/introTaglines";
import { openCampaignScreen } from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("intro tagline is stable within an entry and changes on refresh and re-entry", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "One desktop run exercises both requested responsive widths.",
  );

  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCampaignScreen(page);

  const tagline = page.getByTestId("intro-tagline");
  await expect(tagline).toBeVisible();
  const initial = (await tagline.innerText()).trim();
  expect(INTRO_TAGLINES).toContain(
    initial as (typeof INTRO_TAGLINES)[number],
  );

  await page.setViewportSize({ width: 1180, height: 820 });
  await page.evaluate(() => {
    window.dispatchEvent(new Event("resize"));
  });
  await expect(tagline).toHaveText(initial);

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Clinic Campaigns" }),
  ).toBeVisible();
  const afterRefresh = (await tagline.innerText()).trim();
  expect(afterRefresh).not.toBe(initial);

  await page.getByRole("button", { name: "New Campaign" }).click();
  await page.getByLabel("Founder name").fill("Tagline Founder");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Be Rich and Happy" }).click();
  await page
    .getByRole("button", { name: "Return to Campaigns" })
    .click();

  const afterReentry = (await tagline.innerText()).trim();
  expect(afterReentry).not.toBe(afterRefresh);
  await expect
    .poll(() =>
      page.evaluate(
        (key) => window.sessionStorage.getItem(key),
        LAST_INTRO_TAGLINE_SESSION_KEY,
      ),
    )
    .toBe(afterReentry);

  const slot = page.locator(".opening-tagline-slot");
  const newCampaignButton = page.getByRole("button", {
    name: "New Campaign",
  });
  const measureLayout = async (text: string) =>
    tagline.evaluate((element, replacement) => {
      element.textContent = replacement;
      const slotElement = element.parentElement;
      const button = document.querySelector<HTMLButtonElement>(
        ".opening-choice-primary",
      );
      if (!slotElement || !button) {
        throw new Error("Intro layout targets are missing.");
      }
      return {
        slotHeight: slotElement.getBoundingClientRect().height,
        buttonTop: button.getBoundingClientRect().top,
      };
    }, text);

  const shortestLayout = await measureLayout("Saves $400.");
  const longestLayout = await measureLayout(
    "Saves the operating room schedule, in theory.",
  );
  expect(longestLayout.slotHeight).toBe(shortestLayout.slotHeight);
  expect(longestLayout.buttonTop).toBe(shortestLayout.buttonTop);
  await tagline.evaluate((element, text) => {
    element.textContent = text;
  }, afterReentry);

  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktopMetrics = await tagline.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      lineHeight: Number.parseFloat(style.lineHeight),
      textHeight: element.getBoundingClientRect().height,
      textAlign: style.textAlign,
    };
  });
  expect(desktopMetrics.textHeight).toBeLessThanOrEqual(
    desktopMetrics.lineHeight + 1,
  );
  expect(desktopMetrics.textAlign).toBe("center");
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/title-tagline-desktop.png`,
    animations: "disabled",
    fullPage: false,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(tagline).toHaveText(afterReentry);
  const phoneMetrics = await tagline.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      lineHeight: Number.parseFloat(style.lineHeight),
      textHeight: element.getBoundingClientRect().height,
      fontSize: Number.parseFloat(style.fontSize),
      textAlign: style.textAlign,
      documentOverflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    };
  });
  expect(phoneMetrics.textHeight).toBeLessThanOrEqual(
    phoneMetrics.lineHeight * 2 + 1,
  );
  expect(phoneMetrics.fontSize).toBeGreaterThanOrEqual(11);
  expect(phoneMetrics.textAlign).toBe("center");
  expect(phoneMetrics.documentOverflow).toBeLessThanOrEqual(0);
  await expect(slot).toBeVisible();
  await expect(newCampaignButton).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/title-tagline-phone.png`,
    animations: "disabled",
    fullPage: false,
  });
});
