import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import { installLevelOneVisualState, startClinic, waitForDecisionChoices } from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

async function openFirstChart(page: Page, projectName: string) {
  await startClinic(page, `Chart Density ${projectName}`, `Chart Density ${projectName} Clinic`);
  // The fixture disables tutorials while retaining the normal persisted-game UI.
  await installLevelOneVisualState(page);
  await page.locator(".patient-tab").first().click();
  await expect(page.locator(".paper-chart")).toBeVisible();
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

test("patient chart is compact, single-prompt, and paper-contained across responsive layouts", async ({
  page,
}, testInfo) => {
  await openFirstChart(page, testInfo.project.name);

  const chart = page.locator(".paper-chart");
  const workspace = chart.locator(".chart-workspace");
  const prompt = chart.locator(".chart-step-column.is-current .question-prompt");
  const answers = chart.locator(".chart-step-column.is-current .answer-list");
  const concern = chart.locator(".chart-presentation-column .chart-clinical-section");

  await expect(page.locator(".desk-workspace .chart-drawer")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter Management Mode" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enter Build Mode" })).toHaveCount(0);
  await expect(page.locator(".footer-content-notice")).toContainText(
    /demonstration content only/i,
  );
  await expect(chart.getByText("Chief complaint", { exact: true })).toHaveCount(0);
  await expect(chart.getByText("History of present illness", { exact: true })).toHaveCount(0);
  await expect(chart.getByText("HPI & presentation", { exact: true })).toHaveCount(0);
  await expect(concern).toHaveCount(1);
  await expect(concern).toContainText(/^(I|My)\b/);
  const presentationCopy = (await chart
    .locator(".chart-presentation-column")
    .innerText()).trim();
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
    const rect = (element: Element | null) => element?.getBoundingClientRect();
    const chart = get<HTMLElement>(".paper-chart");
    const desk = get<HTMLElement>(".desk-workspace");
    const stage = get<HTMLElement>(".chart-flip-stage");
    const face = get<HTMLElement>(".chart-card-face.is-front");
    const workspace = get<HTMLElement>(".chart-workspace");
    const identity = get<HTMLElement>(".chart-identity-column");
    const presentation = get<HTMLElement>(".chart-presentation-column");
    const decision = get<HTMLElement>(".chart-decision-region");
    const current = get<HTMLElement>(".chart-step-column.is-current");
    const prompt = get<HTMLElement>(".chart-step-column.is-current .question-prompt");
    const answers = get<HTMLElement>(".chart-step-column.is-current .answer-list");
    const title = get<HTMLElement>(".chart-drawer-titlebar");
    const portrait = get<HTMLElement>(".chart-identity-column .pixel-avatar-large");
    const stack = get<HTMLElement>(".paper-chart-stack");
    const clip = get<HTMLElement>(".paper-chart-clip");
    if (!chart || !desk || !stage || !face || !workspace || !identity || !presentation || !decision || !current || !prompt || !answers || !title || !portrait || !stack || !clip) return null;
    const chartBox = rect(chart)!;
    const deskBox = rect(desk)!;
    const stageBox = rect(stage)!;
    const faceBox = rect(face)!;
    const workspaceBox = rect(workspace)!;
    const identityBox = rect(identity)!;
    const presentationBox = rect(presentation)!;
    const decisionBox = rect(decision)!;
    const currentBox = rect(current)!;
    const promptBox = rect(prompt)!;
    const answerBox = rect(answers)!;
    const enabledAnswers = [...answers.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
    return {
      viewportWidth: window.innerWidth,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      chartDeskEdges: [
        Math.abs(chartBox.left - deskBox.left), Math.abs(chartBox.top - deskBox.top),
        Math.abs(chartBox.right - deskBox.right), Math.abs(chartBox.bottom - deskBox.bottom),
      ],
      promptImmediatelyBeforeAnswers: prompt.compareDocumentPosition(answers) & Node.DOCUMENT_POSITION_FOLLOWING ? promptBox.bottom <= answerBox.top + 2 : false,
      promptOutsidePresentation: !presentation.contains(prompt),
      promptInCurrentUpdate: Boolean(get<HTMLElement>(".chart-current-update")?.contains(prompt)),
      presentationHasQuestionTail: /\?\s*$/.test(presentation.innerText.trim()),
      presentationHasCopdContext: /\bCOPD\b/.test(presentation.innerText),
      presentationHasExactDuplicate: presentation.innerText.includes(
        "They ask what needs to happen before an operation can be scheduled.",
      ),
      answerHeights: enabledAnswers.map((answer) => answer.getBoundingClientRect().height),
      answerCopyFits: enabledAnswers.every((answer) => {
        const copy = answer.querySelector<HTMLElement>(".answer-choice-copy");
        return Boolean(copy && copy.scrollWidth <= copy.clientWidth && copy.scrollHeight <= copy.clientHeight);
      }),
      titleHeight: rect(title)!.height,
      portrait: { width: rect(portrait)!.width, height: rect(portrait)!.height },
      chartBodyBottom: stageBox.bottom,
      faceBottom: faceBox.bottom,
      workspaceBottom: workspaceBox.bottom,
      identityBottom: identityBox.bottom,
      presentationBottom: presentationBox.bottom,
      decisionBottom: decisionBox.bottom,
      currentBottom: currentBox.bottom,
      stageScroll: { clientHeight: stage.clientHeight, scrollHeight: stage.scrollHeight },
      workspaceScroll: { clientHeight: workspace.clientHeight, scrollHeight: workspace.scrollHeight },
      paperDecoration: {
        stackPosition: getComputedStyle(stack).position,
        stackPointerEvents: getComputedStyle(stack).pointerEvents,
        clipPosition: getComputedStyle(clip).position,
        clipPointerEvents: getComputedStyle(clip).pointerEvents,
        stackDisplay: getComputedStyle(stack).display,
        clipDisplay: getComputedStyle(clip).display,
      },
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
  expect(geometry!.promptOutsidePresentation).toBe(true);
  expect(geometry!.promptInCurrentUpdate).toBe(false);
  expect(geometry!.presentationHasQuestionTail).toBe(false);
  expect(geometry!.presentationHasCopdContext).toBe(true);
  expect(geometry!.presentationHasExactDuplicate).toBe(false);
  expect(geometry!.answerHeights).not.toHaveLength(0);
  expect(geometry!.answerHeights.every((height) => height >= 44)).toBe(true);
  expect(geometry!.answerCopyFits).toBe(true);
  // Current compact titlebar stays below the former 4.15rem physical-paper
  // treatment while retaining room for the Close control at laptop widths.
  expect(geometry!.titleHeight).toBeLessThanOrEqual(testInfo.project.name === "phone-chrome" ? 80 : 60);
  expect(geometry!.portrait.width).toBeLessThanOrEqual(testInfo.project.name === "phone-chrome" ? 104 : 78);
  expect(geometry!.portrait.height).toBeLessThanOrEqual(testInfo.project.name === "phone-chrome" ? 128 : 104);

  if (testInfo.project.name === "phone-chrome") {
    expect(geometry!.paperDecoration.stackDisplay).toBe("none");
    expect(geometry!.paperDecoration.clipDisplay).toBe("none");
    expect(geometry!.workspaceScroll.scrollHeight).toBeGreaterThanOrEqual(
      geometry!.workspaceScroll.clientHeight,
    );
  } else {
    expect(geometry!.chartDeskEdges.every((edge) => edge <= 4)).toBe(true);
    expect(geometry!.paperDecoration).toMatchObject({
      stackPosition: "absolute",
      stackPointerEvents: "none",
      clipPosition: "absolute",
      clipPointerEvents: "none",
    });
    expect(Math.abs(geometry!.faceBottom - geometry!.chartBodyBottom)).toBeLessThanOrEqual(4);
    expect(Math.abs(geometry!.workspaceBottom - geometry!.chartBodyBottom)).toBeLessThanOrEqual(4);

    if (testInfo.project.name === "compact-desktop-chrome") {
      // At the two-row breakpoint, identity/presentation own their first row;
      // the current decision owns the lower full-width paper surface.
      expect(geometry!.identityBottom).toBeLessThanOrEqual(geometry!.decisionBottom + 4);
      expect(geometry!.presentationBottom).toBeLessThanOrEqual(geometry!.decisionBottom + 4);
      expect(Math.abs(geometry!.decisionBottom - geometry!.chartBodyBottom)).toBeLessThanOrEqual(4);
      expect(Math.abs(geometry!.currentBottom - geometry!.chartBodyBottom)).toBeLessThanOrEqual(4);
    } else {
      for (const [surface, bottom] of Object.entries({
        identity: geometry!.identityBottom,
        presentation: geometry!.presentationBottom,
        decision: geometry!.decisionBottom,
        current: geometry!.currentBottom,
      })) {
        expect(
          Math.abs(bottom - geometry!.chartBodyBottom),
          `${surface} bottom=${bottom}, chartBodyBottom=${geometry!.chartBodyBottom}`,
        ).toBeLessThanOrEqual(4);
      }
    }
  }
});
