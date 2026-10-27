import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createInitialGameState, getFacilityProgressionStatus, serializeGameState } from "@gamify-surgery/game-domain";
import { GoalList } from "../ui/GoalList";
import { withGoalDisplayLabel } from "./goalDisplayLabels";
import { createPrototypePlayerView } from "./viewModels";

const labelsByLevel = [
  ["Clinical XP", "Satisfaction above 90%", "Build Examination Room"],
  ["Clinical XP", "Satisfaction above 90%", "Build Ultrasound Room", "Build Minor-Procedure Room", "Hire Imaging Technician"],
  ["Clinical XP", "Satisfaction above 90%", "First endoscopy"],
  ["Clinical XP", "Satisfaction above 90%", "Hire Pharmacist", "First ambulatory operation"],
  ["Clinical XP", "Satisfaction above 90%", "APP in an operating room", "Pediatric visit with parent", "Wound/ostomy visit"],
  ["Current-level Clinical XP", "Satisfaction above 90%", "Average staff morale ≥85"],
];

describe("player-only goal display labels", () => {
  it.each([0, 1, 2, 3, 4, 5] as const)("reviews every Level %s goal, preserves full requirements and leaves the serialized game unchanged", level => {
    const state = createInitialGameState(); state.facilityLevel = level;
    const before = serializeGameState(state);
    const requirements = getFacilityProgressionStatus(state).requirements;
    const view = createPrototypePlayerView(state, null, false, null).progression;
    expect(view.goals.map(goal => goal.displayLabel)).toEqual(labelsByLevel[level]);
    for (const [index, goal] of view.goals.entries()) {
      expect(goal.displayLabel!.length).toBeLessThanOrEqual(28);
      expect(goal.id).toBe(requirements[index]!.id);
      expect(goal.complete).toBe(requirements[index]!.met);
      expect(goal.label).toBe(level === 5 && index === 0 ? "Current-level Clinical XP" : requirements[index]!.label);
      const markup = renderToStaticMarkup(<GoalList goals={[goal]} renderSetup={() => null} />);
      expect(markup).toContain(`title="${goal.label}" aria-describedby=`);
      expect(markup).toContain(`>${goal.label}${goal.displayProgressLabel ? ". " : "<"}`);
    }
    if (level >= 3) expect(view.secondaryGoals?.[0]).toMatchObject({
      label: "Complete the first administrative quality review", displayLabel: "Quality review",
    });
    expect(serializeGameState(state)).toBe(before);
  });

  it("retains the alternate tutorial completion goal and falls back to a future full name without guessing", () => {
    expect(withGoalDisplayLabel({ id: "tutorial", label: "Complete both tutorial patients", complete: true, progressLabel: "2/2" }).displayLabel).toBe("Both tutorial patients");
    expect(withGoalDisplayLabel({ id: "future", label: "A future requirement", complete: false, progressLabel: "0/1" }).displayLabel).toBe("A future requirement");
  });

  it("keeps Level 5 progress compact while retaining the full current-level and workforce context", () => {
    const state = createInitialGameState(); state.facilityLevel = 5;
    const view = createPrototypePlayerView(state, null, false, null).progression;
    expect(view.goals[0]).toMatchObject({ displayProgressLabel: "0/2,000", progressLabel: "0/2,000 XP" });
    expect(view.goals[1]!.displayProgressLabel).toMatch(/^\d+(?:\.\d+)?%$/);
    expect(view.goals[2]).toMatchObject({ displayProgressLabel: "No staff", progressLabel: "No employees · hire staff to establish an average" });
    const markup = renderToStaticMarkup(<GoalList goals={view.goals} renderSetup={() => null} />);
    expect(markup).toContain("No employees · hire staff to establish an average");
  });
});
