import type { ProgressionGoalView } from "../ui/types";

// Presentation only. Keep domain names, requirement IDs and evidence unchanged.
const SHORT_GOAL_LABELS: Readonly<Record<string, string>> = {
  "Complete both tutorial patients": "Both tutorial patients",
  "Complete your first endoscopy": "First endoscopy",
  "Complete your first ambulatory operation": "First ambulatory operation",
  "Keep an APP assigned to an operational room": "APP in an operating room",
  "Complete a pediatric visit with its parent": "Pediatric visit with parent",
  "Complete a wound/ostomy care visit": "Wound/ostomy visit",
  "Average staff morale at least 85": "Average staff morale ≥85",
  "Complete the first administrative quality review": "Quality review",
};

export function withGoalDisplayLabel(goal: ProgressionGoalView): ProgressionGoalView {
  return { ...goal, displayLabel: SHORT_GOAL_LABELS[goal.label] ?? goal.label };
}
