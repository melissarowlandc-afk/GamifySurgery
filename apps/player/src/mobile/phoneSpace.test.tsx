import { useState } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MobileChart } from "./MobileChart";
import MobileShell from "./MobileShell";
import { MobileManage } from "./manage/MobileManage";
import { createManageFixture, employeeFixture } from "./manage/testFixtures";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";
import type { ChartView } from "../ui/types";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));
afterEach(cleanupPhoneTests);

const chart = (overrides: Partial<ChartView> = {}): ChartView => ({
  id: "space.chart", patientName: "Fixture Person", patientDetails: "41 · Female", statusLabel: "Action required",
  presentation: "Fixture presentation.", questionPrompt: "Which fixture choice?", answerChoices: [],
  decisionSteps: [{ id: "space.decision", heading: "Decision 1 of 1", current: true, complete: false,
    questionVariantId: "fixture.variant", questionPrompt: "Which fixture choice?",
    answerChoices: [{ id: "fixture.choice", label: "Fixture choice", disabled: false, selected: false, etaLabel: "30 min" }] }],
  terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false,
  ...overrides,
});
const actions = () => ({ onClose: vi.fn(), onSubmitAnswer: vi.fn(), onFlagQuestion: vi.fn(),
  onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() });

describe("phone space and single-tap controls", () => {
  it("puts the sole compact flag beside sheet Close, keeps answers reachable, and submits the same decision", async () => {
    const env = phoneTestDom(), handlers = actions();
    await env.render(<MobileShell {...phoneFixture({ chart: chart(), onCloseChart: handlers.onClose,
      onSubmitAnswer: handlers.onSubmitAnswer, onFlagQuestion: handlers.onFlagQuestion })} />);
    const header = env.find(node => node.attributes.class === "mobile-sheet-heading-actions");
    expect(allElements(header, node => node.tagName === "BUTTON").map(node => node.attributes["aria-label"]))
      .toEqual(["Flag this question for developer review", "Close Patient chart"]);
    expect(allElements(env.element, node => node.attributes.class === "mobile-question-flag")).toHaveLength(0);
    expect(allElements(env.element, node => node.attributes.class === "mobile-chart-actions")).toHaveLength(0);
    await env.click("Flag this question for developer review");
    expect(env.find(node => node.tagName === "TEXTAREA")).toBeDefined();
    await env.click("Fixture choiceWait estimate: 30 min");
    expect(handlers.onSubmitAnswer).toHaveBeenCalledExactlyOnceWith("fixture.choice");
    await env.click("Submit flag"); expect(handlers.onFlagQuestion).toHaveBeenCalledExactlyOnceWith("space.decision");
    await env.click("Close Patient chart"); expect(handlers.onClose).toHaveBeenCalledOnce();
  });

  it.each([
    { view: { pendingLabel: "Fixture test pending", primaryActionLabel: "Return to clinic" }, label: "Return to clinic", callback: "onClose" },
    { view: { terminalFeedbackNeedsAcknowledgment: true, primaryActionLabel: "Enact Plan" }, label: "Enact Plan", callback: "onAcknowledgeTerminalFeedback" },
    { view: { canFile: true, primaryActionLabel: "Resolve Completed Chart" }, label: "Resolve Completed Chart", callback: "onFileChart" },
  ] as const)("retains the useful pinned $label action", async ({ view, label, callback }) => {
    const env = phoneTestDom(), handlers = actions();
    await env.render(<MobileChart chart={chart(view)} {...handlers} headerActionsProvided />);
    expect(env.button(label).parentNode?.tagName).toBe("FOOTER");
    await env.click(label); expect(handlers[callback]).toHaveBeenCalledOnce();
  });

  it("stacks the intact labels above values for a two-column exhibit", async () => {
    const env = phoneTestDom(), view = chart();
    view.decisionSteps![0]!.exhibit = { kind: "table", caption: "Fixture records", columnHeaders: ["Record"],
      rowHeaders: ["Original operative record", "Additional record"], cells: [["Fixture value one"], ["Fixture value two"]] };
    await env.render(<MobileChart chart={view} {...actions()} />);
    const list = env.find(node => node.attributes.class === "mobile-label-values");
    expect(allElements(list, node => node.tagName === "DT").map(node => node.textContent)).toEqual(["Original operative record", "Additional record"]);
    expect(allElements(list, node => node.tagName === "DD").map(node => node.textContent)).toEqual(["Fixture value one", "Fixture value two"]);
    expect(allElements(env.element, node => node.tagName === "TABLE")).toHaveLength(0);
    expect(env.element.textContent).toContain("Record");
  });

  it("keeps a wide table in a named, keyboard-scrollable region with row and column headers", async () => {
    const env = phoneTestDom(), view = chart();
    view.decisionSteps![0]!.exhibit = { kind: "table", caption: "Fixture comparison", columnHeaders: ["First", "Second", "Third"],
      rowHeaders: ["Original record"], cells: [["One", "Two", "Three"]] };
    await env.render(<MobileChart chart={view} {...actions()} />);
    const region = env.find(node => node.attributes.class === "mobile-table-scroll");
    expect(region.attributes).toMatchObject({ role: "region", "aria-label": "Fixture comparison", tabindex: "0" });
    expect(allElements(region, node => node.attributes.scope === "col").map(node => node.textContent)).toEqual(["First", "Second", "Third"]);
    expect(allElements(region, node => node.attributes.scope === "row")[0]!.textContent).toBe("Original record");
  });

  it("offers Back within Manage and one-tap Close from the deepest employee detail without a destructive action", async () => {
    const env = phoneTestDom(), close = vi.fn(), fire = vi.fn();
    await env.render(<MobileManage {...createManageFixture({ onClose: close, onFireEmployee: fire })} />);
    await env.click("Role details for Receptionist"); await env.click(`Employee details for ${employeeFixture.displayName}`);
    expect(env.button("Back to Receptionist")).toBeDefined();
    await env.click("Close Manage"); expect(close).toHaveBeenCalledOnce(); expect(fire).not.toHaveBeenCalled();
  });

  it("Close leaves the whole Manage sheet instead of taking another detail Back step", async () => {
    const env = phoneTestDom(), exit = vi.fn();
    function Host() {
      const [mode, setMode] = useState(false);
      return <MobileShell {...phoneFixture({ ...createManageFixture(), managementMode: mode,
        onEnterManagementMode: () => setMode(true), onExitManagementMode: () => { exit(); setMode(false); } })} />;
    }
    await env.render(<Host />); await env.click("Manage"); await env.click("Role details for Receptionist");
    await env.click(`Employee details for ${employeeFixture.displayName}`);
    const detail = env.find(node => node.attributes.class === "mobile-manage-detail");
    await env.clickElement(allElements(detail, node => node.attributes["aria-label"] === "Close Manage")[0]!);
    expect(exit).toHaveBeenCalledOnce();
    expect(allElements(env.element, node => node.attributes.class === "mobile-manage-detail")).toHaveLength(0);
    expect(env.button("Clinic").attributes["aria-current"]).toBe("page");
  });

  it("scopes all density rules to the phone and reserves normal word wrapping and touch targets", () => {
    const css = readFileSync(new URL("./mobileDensity.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const rule of css.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
      for (const selector of rule[1]!.split(",")) expect(selector.trim()).toMatch(/^\.mobile-shell\s/);
    }
    expect(css).toContain("overflow-wrap: normal; word-break: normal");
    expect(css).toContain("overflow-x: auto");
    expect(css).toMatch(/\.mobile-build-cards\.is-new\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/);
    expect(css).not.toMatch(/(?:height|min-height):\s*(?:[0-3]?\d|4[0-3])px\s*!important/);
    expect(css).toMatch(/\.mobile-menu\s*\{[^}]*repeat\(2,/);
  });
});
