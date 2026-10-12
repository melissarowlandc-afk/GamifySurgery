import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createFacilityInspectionView, inspectionReportView } from "../session/inspectionViewModels";
import { InspectionReportCard } from "../ui/InspectionReportCard";
import { MobileInspection } from "./MobileInspection";
import { MobileEmployees } from "./manage/MobileEmployees";
import { createPrototypePlayerView } from "../session/viewModels";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";
import { testElementProps } from "./testDom";

const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease; });
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; });
const example = () => createFacilityInspectionView(createLevelFiveStateQaState("report")).lastReport!;

describe("M7c report cards and phone category tiles", () => {
  it("shows all ten desktop bars, frozen fractions/weights/contributions/hints and the reproducible 85-point sum", () => {
    const report = example();
    const markup = renderToStaticMarkup(<InspectionReportCard report={report} bestLabel="85.00" latestLabel="85.00" />);
    expect(markup.match(/role="meter"/g)).toHaveLength(10);
    for (const category of report.categories) {
      expect(markup).toContain(category.label.replaceAll("&", "&amp;"));
      expect(markup).toContain(`${category.pointsLabel} points · ${category.weightPercent}% weight`);
      expect(markup).toContain(category.formula.replaceAll("&", "&amp;"));
      expect(markup).toContain(category.improvementHint);
    }
    expect(markup).toContain("9 + 8 + 7.5 + 8.5 + 7 + 9 + 9.5 + 4 + 4.5 + 18 = 85 raw → 85.00/100 displayed");
    expect(markup).toContain("Best prestige"); expect(markup).toContain("Valid full-window sample");
    expect(markup).toContain("3000/3000 active min"); expect(markup).toContain("20/20 qualifying scored completions");
  });

  it("opens each phone tile in one tap with only its arithmetic, missing items and hint; Back restores the compact grid", async () => {
    const env = phoneTestDom(), report = example(), back = vi.fn();
    report.categories[0]!.missingItems.push({ id: "room.test.blocked", reason: "Examination Room needs a reachable door." });
    await env.render(<InspectionReportCard report={report} compact onDetailBackChange={back} />);
    const tiles = () => allElements(env.element, node => node.attributes.class === "inspection-category-tile");
    expect(tiles()).toHaveLength(10);
    expect(env.element.textContent).not.toContain("How to improve");
    for (const category of report.categories) {
      await env.clickElement(tiles().find(node => node.textContent.startsWith(category.label))!);
      expect(tiles()).toHaveLength(0);
      expect(env.element.textContent).toContain(category.formula);
      expect(env.element.textContent).toContain(`${category.score} × ${category.weightPercent}% = ${category.weightedPoints} points`);
      expect(env.element.textContent).toContain(category.improvementHint);
      if (category.id === "cleanliness") expect(env.element.textContent).toContain("Examination Room needs a reachable door.");
      expect(typeof back.mock.lastCall?.[0]).toBe("function");
      await env.click("← Back to report card"); expect(tiles()).toHaveLength(10);
      expect(back.mock.lastCall?.[0]).toBeNull();
    }
  });

  it("retains no-score/insufficient-sample status and never draws a full bar for a missing sample", async () => {
    const report = createFacilityInspectionView(createLevelFiveStateQaState("incomplete")).lastReport!;
    report.categories[0]!.score = null; report.categories[0]!.scoreLabel = "No sample yet";
    const env = phoneTestDom(); await env.render(<InspectionReportCard report={report} compact />);
    expect(env.element.textContent).toContain("Incomplete · not enough qualifying patients");
    expect(env.element.textContent).toContain("No prestige score"); expect(env.element.textContent).toContain("19/20 qualifying scored completions");
    const meter = allElements(env.element, node => node.attributes.role === "meter")[0]!;
    expect(meter.attributes["aria-valuenow"]).toBeUndefined(); expect(meter.attributes["aria-valuetext"]).toBe("No sample yet");
    expect(meter.style["--inspection-score"]).toBe("0%");
  });

  it("floors the stored total instead of promoting a 99.995 result to Perfect, without changing the report", () => {
    const state = createLevelFiveStateQaState("report"), raw = state.levelFive!.inspection.lastReport!;
    raw.rawTotalScore = 99.995; raw.recognition = "distinguished";
    const before = structuredClone(raw), view = inspectionReportView(raw);
    expect(view.scoreLabel).toBe("99.99"); expect(view.recognitionLabel).toBe("Distinguished");
    expect(view.rawTotalScore).toBe(99.995); expect(raw).toEqual(before);
  });

  it("keeps the original finish report when a later lower report becomes latest, while retaining the best prestige", () => {
    const state = createLevelFiveStateQaState("report");
    const lower = structuredClone(createLevelFiveStateQaState("finish").levelFive!.inspection.lastReport!);
    lower.runId = "inspection.test.lower-repeat";
    state.levelFive!.inspection.lastReport = lower; state.levelFive!.inspection.latestCompletedReport = lower;
    const view = createFacilityInspectionView(state);
    expect(view.lastReport!.scoreLabel).toBe("12.00"); expect(view.latestLabel).toBe("12.00"); expect(view.bestLabel).toBe("85.00");
    expect(view.finish!.report.scoreLabel).toBe("85.00"); expect(view.finish!.acknowledged).toBe(true);
  });

  it("uses the same locked booking and running-cancel confirmation on the dedicated phone Inspection screen", async () => {
    const env = phoneTestDom(), book = vi.fn(), cancel = vi.fn();
    await env.render(<MobileInspection view={createFacilityInspectionView(createLevelFiveStateQaState("pre-goal"))} onBook={book} onCancel={cancel} />);
    expect(env.button("Book inspection · Locked").attributes.disabled).toBeDefined();
    await env.render(<MobileInspection view={createFacilityInspectionView(createLevelFiveStateQaState("running"))} onBook={book} onCancel={cancel} />);
    await env.click("Cancel inspection"); expect(cancel).not.toHaveBeenCalled();
    await env.click("Keep inspection"); expect(cancel).not.toHaveBeenCalled();
    await env.click("Cancel inspection");
    const confirm = testElementProps(env.button("Confirm cancel")).onClick as () => void;
    confirm(); confirm(); expect(cancel).toHaveBeenCalledOnce(); expect(book).not.toHaveBeenCalled();
  });

  it("keeps the phone Executive role copy short with full pay/home/funding details still available on expand", async () => {
    const env = phoneTestDom(), state = createLevelFiveStateQaState("executive"), view = createPrototypePlayerView(state, null, false, null);
    const props = phoneFixture({ ...view });
    await env.render(<MobileEmployees {...props} />);
    await env.click("Role details for Executive");
    expect(env.element.textContent).toContain("One Executive · $45/hr. Daily morale, comfort, inspection preparation and 1–2% off stock/upkeep.");
    const details = allElements(env.element, node => node.attributes.class === "mobile-executive-role-details")[0]!;
    expect(details.attributes.open).toBeUndefined(); expect(details.textContent).toContain("current clinic net");
    expect(details.textContent).toContain("$35–$65"); expect(details.textContent).toContain("Executive Office desk");
  });

  it("retains 44px targets, two-column compact tiles, local report scrolling, persistent actions and safe-area layout", () => {
    const card = readFileSync(new URL("../ui/inspectionReportCard.css", import.meta.url), "utf8");
    const page = readFileSync(new URL("../ui/finishedGamePage.css", import.meta.url), "utf8");
    expect(card).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(card).toContain("min-height: 44px"); expect(card).toContain("min-height: 65px");
    expect(page).toContain("grid-template-rows: auto minmax(0, 1fr) auto"); expect(page).toContain("overscroll-behavior: contain");
    expect(page).toContain("safe-area-inset-bottom"); expect(page).toContain("safe-area-inset-left");
  });
});
