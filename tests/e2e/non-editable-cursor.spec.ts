import { expect, test, type Locator } from "@playwright/test";

import { openCampaignScreen } from "./helpers";

interface CursorStyles {
  cursor: string;
  userSelect: string;
  caretColor: string;
  color: string;
}

async function cursorStyles(locator: Locator): Promise<CursorStyles> {
  return locator.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      cursor: styles.cursor,
      userSelect: styles.userSelect,
      caretColor: styles.caretColor,
      color: styles.color,
    };
  });
}

function expectTransparentCaret(styles: CursorStyles): void {
  expect(styles.caretColor).toMatch(/transparent|rgba\(0, 0, 0, 0\)/);
}

async function expectPassiveText(locator: Locator): Promise<void> {
  const styles = await cursorStyles(locator);
  expect(styles.cursor).toBe("default");
  expect(styles.userSelect).toBe("none");
  expectTransparentCaret(styles);
}

async function expectTextInput(locator: Locator): Promise<void> {
  const styles = await cursorStyles(locator);
  expect(styles.cursor).toBe("text");
  expect(styles.userSelect).toBe("text");
  expect(styles.caretColor).toBe(styles.color);
}

test("keeps passive UI non-editable while preserving naming and map control cursors", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Canonical desktop Chrome cursor regression only.");

  await openCampaignScreen(page);
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:4173");

  await expectPassiveText(page.getByTestId("intro-tagline"));
  expect((await cursorStyles(page.getByRole("button", { name: "New Campaign" }))).cursor).toBe("pointer");

  await page.getByRole("button", { name: "New Campaign" }).click();
  const founderName = page.getByLabel("Founder name");
  await expectTextInput(founderName);
  await founderName.fill("Cursor Proof Founder");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Build a Surgery Clinic" }).click();
  const clinicName = page.getByLabel("Clinic name");
  await expectTextInput(clinicName);
  await clinicName.fill("Cursor Proof Clinic");
  await page.getByRole("button", { name: "Open the Clinic" }).click();

  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expectPassiveText(page.locator(".facility-zoom-overlay output"));
  expect((await cursorStyles(page.getByRole("button", { name: "Zoom facility out" }))).cursor).toBe("pointer");
  expect((await cursorStyles(page.getByRole("separator", {
    name: "Resize facility map and clinical desk",
  }))).cursor).toBe("row-resize");

  await page.goto("/?prototype-tools=1");
  await page.getByRole("button", { name: "Resume Cursor Proof Clinic" }).click();
  await page.locator(".development-panel > summary").click();
  expect((await cursorStyles(page.locator(".prototype-toggle input"))).cursor).toBe("pointer");
});
