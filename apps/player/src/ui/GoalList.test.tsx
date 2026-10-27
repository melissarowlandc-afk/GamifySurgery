import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import type { TestElement } from "../mobile/testDom";
import { MobileGoals } from "../mobile/MobileGoals";
import { withGoalDisplayLabel } from "../session/goalDisplayLabels";
import { GoalsPanel } from "./GoalsPanel";
import type { ProgressionView } from "./types";

afterEach(cleanupPhoneTests);

const goals = [
  { id: "xp", label: "Clinical XP", complete: true, progressLabel: "750/750" },
  { id: "satisfaction", label: "Satisfaction above 90%", complete: true, progressLabel: "91/91" },
  { id: "app", label: "Keep an APP assigned to an operational room", complete: true, progressLabel: "1/1" },
  { id: "parent", label: "Complete a pediatric visit with its parent", complete: false, progressLabel: "0/1" },
  { id: "wound", label: "Complete a wound/ostomy care visit", complete: false, progressLabel: "0/1" },
].map(withGoalDisplayLabel);
const view: ProgressionView = {
  facilityLevelLabel: "Level 4", nextLevelLabel: "Level 5", canLevelUp: false, prototypeComplete: false, goals,
  secondaryGoals: [withGoalDisplayLabel({ id: "optional", label: "Complete the first administrative quality review", complete: false, progressLabel: "0/1" })],
};
const hasClass = (node: TestElement, name: string) => node.attributes.class?.split(" ").includes(name) ?? false;
const findClass = (root: TestElement, name: string) => allElements(root, node => hasClass(node, name));
const hidden = (node: TestElement): boolean => node.attributes.hidden !== undefined || Boolean(node.parentNode && hidden(node.parentNode));
const rowLabels = (root: TestElement) => findClass(root, "goal-row").filter(row => !hidden(row)).map(row => findClass(row, "goal-label")[0]!.textContent);

describe.each(["desktop", "phone"] as const)("compact %s goals", surface => {
  const render = (projection = view) => surface === "desktop"
    ? <GoalsPanel view={projection} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />
    : <MobileGoals view={projection} onLevelUp={vi.fn()} onSetupAction={vi.fn()} />;

  it("collapses completed required goals into a named, keyboard-native disclosure and keeps incomplete/optional goals", async () => {
    const env = phoneTestDom(); await env.render(render());
    const toggle = env.button("✓ 3 of 5 done▾");
    expect(toggle.attributes.type).toBe("button");
    expect(toggle.attributes["aria-expanded"]).toBe("false");
    const completed = env.find(node => node.attributes.id === toggle.attributes["aria-controls"]);
    expect(completed.attributes["aria-label"]).toBe("Completed goals");
    expect(completed.attributes.hidden).toBe("");
    expect(rowLabels(env.element)).toEqual(["Pediatric visit with parent", "Wound/ostomy visit"]);
    expect(findClass(env.element, "goal-secondary-label")[0]!.textContent).toBe("Optional: Quality review");
    await env.clickElement(toggle);
    expect(toggle.attributes["aria-expanded"]).toBe("true");
    expect(completed.attributes.hidden).toBeUndefined();
    expect(rowLabels(env.element)).toHaveLength(5);
    await env.clickElement(toggle);
    expect(rowLabels(env.element)).toHaveLength(2);
    expect(env.browser.localStorage.setItem).not.toHaveBeenCalled();
  });

  it("remembers the disclosure across unmounts and shell changes in this session", async () => {
    const env = phoneTestDom();
    const sessionStorage = { getItem: vi.fn(() => null), setItem: vi.fn() };
    Object.assign(env.browser, { sessionStorage });
    await env.render(render()); await env.click("✓ 3 of 5 done▾");
    expect(sessionStorage.setItem).toHaveBeenCalledWith("gamify-surgery.goals.completed-expanded", "true");
    await env.render(<div />); await env.render(render());
    expect(env.button("✓ 3 of 5 done▴").attributes["aria-expanded"]).toBe("true");
    await env.render(surface === "desktop"
      ? <MobileGoals view={view} onLevelUp={vi.fn()} onSetupAction={vi.fn()} />
      : <GoalsPanel view={view} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />);
    expect(env.button("✓ 3 of 5 done▴").attributes["aria-expanded"]).toBe("true");
    await env.click("✓ 3 of 5 done▴");
    expect(sessionStorage.setItem).toHaveBeenLastCalledWith("gamify-surgery.goals.completed-expanded", "false");
  });

  it("uses a stored tab-session choice and tolerates unavailable storage", async () => {
    const env = phoneTestDom();
    Object.defineProperty(env.browser, "sessionStorage", { configurable: true, get() { throw new Error("Storage blocked"); } });
    await env.render(render()); await env.click("✓ 3 of 5 done▾");
    await env.render(<div />); await env.render(render());
    expect(rowLabels(env.element)).toHaveLength(5);
    const next = phoneTestDom();
    Object.assign(next.browser, { sessionStorage: { getItem: () => "true", setItem: vi.fn() } });
    await next.render(render()); expect(rowLabels(next.element)).toHaveLength(5);
  });

  it("shows only the summary and existing Advance control for all completed required goals", async () => {
    const env = phoneTestDom();
    await env.render(render({ ...view, goals: goals.map(goal => ({ ...goal, complete: true })), canLevelUp: true }));
    expect(rowLabels(env.element)).toEqual([]);
    expect(env.button("✓ 5 of 5 done▾").attributes["aria-expanded"]).toBe("false");
    expect(env.button("Advance to Level 5").attributes.disabled).toBeUndefined();
    expect(findClass(env.element, "goal-secondary-progress")[0]!.textContent).toBe("0/1");
  });

  it("updates the summary as live goals complete or decline and has no disclosure when none are complete", async () => {
    const env = phoneTestDom(); await env.render(render());
    await env.render(render({ ...view, goals: goals.map(goal => ({ ...goal, complete: false })) }));
    expect(findClass(env.element, "goal-completion-toggle")).toHaveLength(0);
    expect(rowLabels(env.element)).toHaveLength(5);
    await env.render(render({ ...view, goals: goals.map(goal => ({ ...goal, complete: goal.id === "wound" })) }));
    expect(env.button("✓ 1 of 5 done▾").attributes["aria-expanded"]).toBe("false");
    expect(rowLabels(env.element)).toHaveLength(4);
  });

  it("renders label and progress as siblings on one row, retaining each full name as its accessible description", async () => {
    const env = phoneTestDom(); await env.render(render());
    for (const goal of goals) {
      const row = env.find(node => node.attributes["data-goal-id"] === goal.id);
      const label = findClass(row, "goal-label")[0]!;
      const progress = findClass(row, "goal-progress")[0]!;
      expect(label.parentNode).toBe(progress.parentNode);
      expect(label.textContent).toBe(goal.displayLabel);
      expect(label.attributes.title).toBe(goal.label);
      expect(env.find(node => node.attributes.id === label.attributes["aria-describedby"]).textContent).toBe(goal.label);
      expect(progress.textContent).toBe(goal.progressLabel);
      expect(findClass(row, "goal-line")).toHaveLength(1);
    }
    const markup = renderToStaticMarkup(render());
    expect(markup).not.toMatch(/class="goal-label"[^>]*>[\s\S]*?<small>/);
  });
});

it("keeps the row on one grid line with a nonwrapping, right-aligned tabular progress column and wrapping labels", () => {
  const css = readFileSync(new URL("./goalList.css", import.meta.url), "utf8");
  expect(css).toMatch(/\.goal-line\s*\{[^}]*display: grid;[^}]*grid-template-columns: auto minmax\(0, 1fr\) auto;/);
  expect(css).toMatch(/\.goal-line \.goal-label\s*\{[^}]*white-space: normal;[^}]*overflow-wrap: anywhere;/);
  expect(css).toMatch(/\.goal-secondary-progress\s*\{[^}]*white-space: nowrap;[^}]*font-variant-numeric: tabular-nums;[^}]*text-align: right;/);
  expect(css).toMatch(/\.goal-list\[hidden\]\s*\{\s*display: none;/);
  expect(css).toMatch(/\.goal-row > \[hidden\]\s*\{\s*display: none;/);
});
