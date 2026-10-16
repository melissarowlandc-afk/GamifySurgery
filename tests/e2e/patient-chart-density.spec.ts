import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { installLevelOneVisualState, setFastFacilitySpeed, startClinic, waitForDecisionChoices } from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

async function openFirstChart(page: Page, projectName: string) {
  await startClinic(page, `Chart Density ${projectName}`, `Chart Density ${projectName} Clinic`);
  // The fixture disables tutorials while retaining the normal persisted-game UI.
  await installLevelOneVisualState(page);
  // The fixture patient must finish checking in before the chart opens.
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
  await setFastFacilitySpeed(page);
  await expect(async () => {
    await page.locator(".patient-tab").first().click();
    await expect(page.locator(".chart-sheet")).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 30_000 });
  await waitForDecisionChoices(page);
}

function screenshotPath(projectName: string) {
  const names: Record<string, string> = {
    "desktop-chrome": "patient-chart-compact-desktop.png",
    "laptop-chrome": "patient-chart-compact-laptop.png",
    "compact-desktop-chrome": "patient-chart-compact-compact-desktop.png",
    "phone-chrome": "patient-chart-compact-phone.png",
  };
  return `${SCREENSHOT_DIRECTORY}/${names[projectName]!}`;
}

test("patient chart floats at its content size with one scroll and a one-line header", async ({
  page,
}, testInfo) => {
  await openFirstChart(page, testInfo.project.name);
  const phone = testInfo.project.name === "phone-chrome";

  const chart = page.locator(".chart-sheet");
  const prompt = chart.locator(".cs-step.is-current .cs-prompt");
  const answers = chart.locator(".cs-step.is-current .cs-answers");
  const concern = chart.locator(".cs-head .cs-complaint");

  await expect(chart).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter Management Mode" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enter Build Mode" })).toHaveCount(0);
  await expect(page.locator(".footer-content-notice")).toContainText(
    /demonstration content only/i,
  );
  await expect(chart.getByText("Chief complaint", { exact: true })).toHaveCount(0);
  await expect(chart.getByText("History of present illness", { exact: true })).toHaveCount(0);
  await expect(chart.getByText("HPI & presentation", { exact: true })).toHaveCount(0);
  await expect(concern).toHaveCount(1);
  const presentationCopy = (await chart.locator(".cs-story").innerText()).trim();
  expect(presentationCopy).toContain("COPD");
  expect(presentationCopy).not.toContain(
    "They ask what needs to happen before an operation can be scheduled.",
  );
  expect(presentationCopy).not.toMatch(/\?\s*$/);
  await expect(prompt).toHaveCount(1);
  await expect(answers).toHaveCount(1);
  await expect(chart.getByRole("button", { name: "Close patient chart" })).toBeVisible();
  await expect(chart.getByRole("button", { name: /Flag .*question|Question flagged/ })).toBeVisible();

  const geometry = await page.evaluate(() => {
    const get = <T extends HTMLElement>(selector: string) =>
      document.querySelector<T>(selector);
    const chart = get<HTMLElement>(".chart-sheet");
    const head = get<HTMLElement>(".chart-sheet .cs-head");
    const scroll = get<HTMLElement>(".chart-sheet .cs-scroll");
    const story = get<HTMLElement>(".chart-sheet .cs-story");
    const prompt = get<HTMLElement>(".cs-step.is-current .cs-prompt");
    const answers = get<HTMLElement>(".cs-step.is-current .cs-answers");
    const desk = get<HTMLElement>(".desk-workspace");
    const main = desk?.closest<HTMLElement>("main") ?? null;
    const footer = get<HTMLElement>(".footer-bar");
    if (!chart || !head || !scroll || !story || !prompt || !answers || !desk || !main || !footer) return null;
    const chartBox = chart.getBoundingClientRect();
    const deskBox = desk.getBoundingClientRect();
    const mainBox = main.getBoundingClientRect();
    const promptBox = prompt.getBoundingClientRect();
    const answerBox = answers.getBoundingClientRect();
    const enabledAnswers = [...answers.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
    // Elements that scroll on their own inside the chart (the design allows one).
    const scrollers = [...chart.querySelectorAll<HTMLElement>("*")].filter((element) => {
      const style = getComputedStyle(element);
      return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
    });
    return {
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      chart: { left: chartBox.left, top: chartBox.top, right: chartBox.right, bottom: chartBox.bottom },
      desk: { left: deskBox.left, right: deskBox.right, bottom: deskBox.bottom },
      main: { left: mainBox.left, top: mainBox.top, right: mainBox.right },
      footerTop: footer.getBoundingClientRect().top,
      promptImmediatelyBeforeAnswers: prompt.compareDocumentPosition(answers) & Node.DOCUMENT_POSITION_FOLLOWING ? promptBox.bottom <= answerBox.top + 2 : false,
      promptOutsideStory: !story.contains(prompt),
      answerHeights: enabledAnswers.map((answer) => answer.getBoundingClientRect().height),
      answerLabelsFit: enabledAnswers.every((answer) => {
        const label = answer.querySelector<HTMLElement>(".cs-answer-label");
        return Boolean(label && label.scrollWidth <= label.clientWidth && label.scrollHeight <= label.clientHeight);
      }),
      headHeight: head.getBoundingClientRect().height,
      innerScrollers: scrollers.map((element) => element.className),
      oneScrollFits: scroll.scrollHeight <= scroll.clientHeight + 1,
    };
  });
  expect(geometry).not.toBeNull();
  await page.screenshot({
    path: screenshotPath(testInfo.project.name),
    fullPage: false,
    animations: "disabled",
  });
  expect(geometry!.pageOverflow).toBeLessThanOrEqual(0);
  expect(geometry!.promptImmediatelyBeforeAnswers).toBe(true);
  expect(geometry!.promptOutsideStory).toBe(true);
  expect(geometry!.answerHeights).not.toHaveLength(0);
  expect(geometry!.answerHeights.every((height) => height >= 44)).toBe(true);
  expect(geometry!.answerLabelsFit).toBe(true);
  // The header is one line on desktop; on phones a long name or complaint wraps it.
  expect(geometry!.headHeight).toBeLessThanOrEqual(phone ? 140 : 60);
  // Only the single chart scroll region may scroll.
  expect(geometry!.innerScrollers.every((name) => name.includes("cs-scroll"))).toBe(true);

  if (!phone) {
    const { chart: box, desk, main, footerTop } = geometry!;
    // A first question fits without scrolling, so the chart is content-sized.
    expect(geometry!.oneScrollFits).toBe(true);
    // It floats inside the play area, anchored to the desk bottom, and never
    // covers the HUD or the demonstration-content footer.
    expect(box.top).toBeGreaterThanOrEqual(main.top - 1);
    expect(box.bottom).toBeLessThanOrEqual(desk.bottom + 1);
    expect(box.bottom).toBeLessThanOrEqual(footerTop);
    expect(box.left).toBeGreaterThanOrEqual(main.left - 1);
    expect(box.right).toBeLessThanOrEqual(main.right + 1);
    // With room to the right, the patient list beside the desk stays visible.
    if (main.right - desk.left >= 1040 + 8) {
      expect(box.left).toBeGreaterThanOrEqual(desk.left - 1);
    }
  }
});
