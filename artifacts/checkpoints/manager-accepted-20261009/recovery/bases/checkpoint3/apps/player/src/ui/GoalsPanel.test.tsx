import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GoalsPanel } from "./GoalsPanel";
import type { ProgressionView } from "./types";

const view: ProgressionView = {
  facilityLevelLabel: "Level 3",
  nextLevelLabel: "Level 4 preview",
  goals: [{ id: "progression.ambulatory_operation_completion", label: "Complete your first ambulatory operation", complete: false, progressLabel: "0/1" }],
  secondaryGoals: [{ id: "secondary.level_three_first_qi_review", label: "Complete the first administrative quality review", complete: false, progressLabel: "0/1" }],
  canLevelUp: false,
  prototypeComplete: false,
};

const render = (overrides: Partial<ProgressionView> = {}) => renderToStaticMarkup(
  <GoalsPanel view={{ ...view, ...overrides }} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />,
);

describe("GoalsPanel secondary objectives", () => {
  it("keeps one main goal list and attaches a compact optional review to the advance area", () => {
    const markup = render();
    expect(markup.match(/class="goal-list"/g)).toHaveLength(1);
    expect(markup).not.toContain("Secondary objectives");
    expect(markup).toContain("Optional: Quality review");
    expect(markup).toContain("Complete the first administrative quality review");
    expect(markup.indexOf("goals-advance-area")).toBeGreaterThan(markup.indexOf("Complete your first ambulatory operation"));
    expect(markup).toMatch(/tabindex="0" aria-describedby="[^"]+"/);
    expect(markup).toContain('role="tooltip"');
    expect(markup).not.toContain("level-up-button");
  });

  it("leaves Advance available with an incomplete optional objective", () => {
    const markup = render({ canLevelUp: true });
    expect(markup).toContain("Advance to Level 4 preview");
    expect(markup).toMatch(/class="button button-primary level-up-button" type="button"/);
    expect(markup).not.toContain("disabled");
    expect(markup.indexOf("goal-secondary-chip")).toBeLessThan(markup.indexOf("level-up-button"));
  });

  it("keeps the compact review after completing the prototype milestone", () => {
    const markup = render({ prototypeComplete: true, secondaryGoals: [{ ...view.secondaryGoals![0]!, complete: true, progressLabel: "1/1" }] });
    expect(markup).toContain("goal-secondary-chip is-complete");
    expect(markup).toContain("1/1 ✓");
    expect(markup).toContain("Level 3 complete.");
    expect(markup.match(/class="goal-list"/g)).toHaveLength(1);
  });

  it("keeps earlier-level progression controls without an optional chip", () => {
    const markup = render({ facilityLevelLabel: "Level 1", nextLevelLabel: "Level 2", secondaryGoals: undefined, canLevelUp: true });
    expect(markup).toContain("Advance to Level 2");
    expect(markup).not.toContain("goal-secondary-chip");
  });
});
