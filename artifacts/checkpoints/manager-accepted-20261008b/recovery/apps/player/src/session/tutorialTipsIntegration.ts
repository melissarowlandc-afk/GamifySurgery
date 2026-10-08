import type { MessageBoardItemView } from "../ui/types";
import type { TutorialStepView } from "./tutorialViewModels";

/** Quiet teaching yields to the active coach; genuine Needs-you cards are independent. */
export function clinicFeedForTutorial(items: readonly MessageBoardItemView[], step: TutorialStepView | null): MessageBoardItemView[] {
  const active = new Set(step?.topicIds ?? []);
  return items.filter((item) => !(item.guidanceTopicIds?.some((id) => active.has(id)) &&
    (item.rowKind === "tip" || item.persistent && item.priority !== "critical")));
}
