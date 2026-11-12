import { expect, test, type Page } from "@playwright/test";
import { expectPhoneTargets, measureRows, openDensityFixture } from "./ui-density-helpers";

async function expectSeparateThumbnails(page: Page) {
  const cards = await page.locator(".build-room-catalog .build-card").evaluateAll(nodes => nodes.map(node => {
    const thumbnail = node.querySelector<HTMLElement>(":scope > .room-thumbnail")!;
    const text = node.querySelector<HTMLElement>(":scope > span:not(.room-thumbnail)")!;
    const artBox = thumbnail.getBoundingClientRect(), textBox = text.getBoundingClientRect();
    return { width: node.getBoundingClientRect().width, artRight: artBox.right, textLeft: textBox.left,
      font: parseFloat(getComputedStyle(text.querySelector("strong")!).fontSize) };
  }).filter(row => row.width > 0));
  expect(cards.length).toBeGreaterThan(0);
  expect(cards.every(row => row.artRight + 1 <= row.textLeft)).toBe(true);
  expect(cards.every(row => row.font >= 13)).toBe(true);
}

for (const viewport of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`workspace density records complete Build and Management rows at ${viewport.width}x${viewport.height}`, async ({ page }, info) => {
    test.skip(info.project.name !== (viewport.width === 390 ? "phone-chrome" : "desktop-chrome"), "One real browser measurement per requested viewport.");
    await page.setViewportSize(viewport);
    const phone = viewport.width === 390;
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await openDensityFixture(page, phone);
    const clinic = await page.evaluate(() => ({
      header: document.querySelector(".mobile-top-bar, .resource-bar")!.getBoundingClientRect().height,
      emptyHeadline: document.querySelector(".clinic-headline:not(.is-showing)")?.getBoundingClientRect().height ?? 0,
      footer: document.querySelector(".mobile-navigation, .footer-bar")!.getBoundingClientRect().height,
      pageOverflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
    }));
    expect(clinic.pageOverflow).toBe(false); expect(clinic.emptyHeadline).toBe(0);
    if (phone) expect(clinic.header).toBeLessThanOrEqual(132);
    await page.getByRole("button", { name: phone ? "Build" : "Enter Build Mode", exact: true }).click();
    const build = page.locator(phone ? ".mobile-build-catalog" : ".build-mode-panel"); await expect(build).toBeVisible();
    await expect(page.getByRole("button", { name: phone ? "Resume facility time" : "Resume facility time", exact: true })).toBeDisabled();
    const rooms = await measureRows(page, phone ? ".mobile-sheet-body" : ".build-room-catalog", phone ? "[data-build-room-option]" : ".build-card:not(.is-locked)");
    expect(rooms.completeRows).toBeGreaterThanOrEqual(8);
    expect(rooms.rows.every(row => row.font >= (phone ? 14 : 13))).toBe(true);
    if (phone) await expectPhoneTargets(page);
    else {
      await expectSeparateThumbnails(page);
      await expect(page.getByRole("button", { name: "Show clinic panels", exact: true })).toHaveAttribute("aria-expanded", "false");
      await page.getByRole("button", { name: "Show clinic panels", exact: true }).click();
      await expect(page.locator(".operations-column")).toBeVisible(); await expect(page.locator(".patient-rail-column")).toBeVisible();
      await expectSeparateThumbnails(page);
      await page.getByRole("button", { name: "Hide clinic panels", exact: true }).click();
    }
    await page.screenshot({ path: info.outputPath("build-density.png"), animations: "disabled" });
    if (phone) {
      await page.getByRole("button", { name: "Close Build", exact: true }).click();
      await page.getByRole("button", { name: "Done", exact: true }).click();
    } else await page.getByRole("button", { name: "Done / Save", exact: true }).click();
    await expect(build).toHaveCount(0);
    await page.getByRole("button", { name: phone ? "Manage" : "Enter Management Mode", exact: true }).click();
    await expect(page.locator(phone ? ".mobile-manage" : ".management-panel")).toBeVisible();
    const staff = await measureRows(page, phone ? ".mobile-sheet-body" : ".staff-role-list", phone ? "[data-staff-role-id]" : ".staff-member-card");
    expect(staff.completeRows).toBeGreaterThanOrEqual(phone ? 5 : 3);
    expect(staff.rows.every(row => row.font >= (phone ? 14 : 13))).toBe(true);
    if (phone) await expectPhoneTargets(page);
    await page.screenshot({ path: info.outputPath("employees-density.png"), animations: "disabled" });
    await page.getByRole("tab", { name: "Services", exact: true }).click();
    const services = await measureRows(page, phone ? ".mobile-sheet-body" : ".service-income-scroll", phone ? "[data-service-line-id]" : ".service-row");
    expect(services.completeRows).toBeGreaterThanOrEqual(phone ? 6 : 5);
    expect(services.rows.every(row => row.font >= (phone ? 14 : 13))).toBe(true);
    await page.screenshot({ path: info.outputPath("services-density.png"), animations: "disabled" });
    await page.getByRole("tab", { name: "Money", exact: true }).click();
    await page.screenshot({ path: info.outputPath("money-density.png"), animations: "disabled" });
    await page.getByRole("tab", { name: "Clinic Competition", exact: true }).click();
    await expect(page.locator(".clinic-competition")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath("competition-density.png"), animations: "disabled" });
    await info.attach("visible-row-measurements", { body: JSON.stringify({ clinic, build: rooms, staff, services }, null, 2), contentType: "application/json" });
    expect(errors).toEqual([]);
  });
}

test("phone Build and Manage keep one-line time and four unclipped controls at 360–430px", async ({ page }, info) => {
  test.skip(info.project.name !== "phone-chrome", "Native phone header measurement.");
  await page.setViewportSize({ width: 390, height: 844 });
  await openDensityFixture(page, true);
  const measurements = [];
  for (const mode of ["Build", "Manage"]) {
    await page.getByRole("button", { name: mode, exact: true }).click();
    await expect(page.getByRole("button", { name: "Resume facility time", exact: true })).toBeDisabled();
    for (const width of [360, 375, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await expect.poll(() => page.evaluate(() => innerWidth)).toBe(width);
      const header = await page.locator(".mobile-top-bar").evaluate(root => {
        const controls = [...root.querySelectorAll<HTMLElement>(".mobile-clock-row button")].map(button => {
          const rect = button.getBoundingClientRect(), range = document.createRange();
          range.selectNodeContents(button); const label = range.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
            labelLeft: label.left, labelRight: label.right, labelTop: label.top, labelBottom: label.bottom,
            width: rect.width, height: rect.height };
        });
        return { height: root.getBoundingClientRect().height, controls,
          timeHeight: root.querySelector(".mobile-clock-label")!.getBoundingClientRect().height,
          disclaimerHeight: root.querySelector(".beta-clinical-notice")!.getBoundingClientRect().height,
          overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(header.height).toBeLessThanOrEqual(170);
      expect(header.controls).toHaveLength(4);
      expect(header.controls.every(control => control.width >= 44 && control.height >= 44 &&
        control.labelLeft >= control.left && control.labelRight <= control.right &&
        control.labelTop >= control.top && control.labelBottom <= control.bottom)).toBe(true);
      expect(header.controls.slice(1).every((control, index) => control.left >= header.controls[index]!.right &&
        Math.abs(control.top - header.controls[0]!.top) < 1)).toBe(true);
      expect(header.timeHeight).toBeLessThanOrEqual(20);
      expect(header.disclaimerHeight).toBeLessThanOrEqual(16);
      expect(header.overflow).toBe(false);
      await expect(page.getByText(`Exit ${mode === "Build" ? "Build" : "Management"} Mode to resume.`, { exact: true })).toBeVisible();
      await expectPhoneTargets(page);
      measurements.push({ mode, width, ...header });
    }
    await page.getByRole("button", { name: `Close ${mode}`, exact: true }).click();
    if (mode === "Build") await page.getByRole("button", { name: "Done", exact: true }).click();
  }
  await info.attach("phone-header-geometry", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
});
