import { describe, expect, it } from "vitest";
import { clinicFeedForTutorial } from "./tutorialTipsIntegration";
import type { TutorialStepView } from "./tutorialViewModels";
import type { MessageBoardItemView } from "../ui/types";

describe("one guidance source per topic", () => {
  const step: TutorialStepView = {id: "enter-build-mode", eyebrow: "First room", title: "Build", body: "Place the room.", target: "build-mode", targetSelector: ".build-mode-trigger", topicIds: ["exam-placement"]};
  const items: MessageBoardItemView[] = [
    {id: "exam-condition", message: "Room needed", priority: "informational", persistent: true, guidanceTopicIds: ["exam-placement"]},
    {id: "exam-tip", message: "Build the room", rowKind: "tip", guidanceTopicIds: ["exam-placement"]},
    {id: "old-history", message: "Earlier condition", rowKind: "resolved", guidanceTopicIds: ["exam-placement"]},
    {id: "dire", message: "Urgent live problem", persistent: true, priority: "critical", guidanceTopicIds: ["exam-placement"]},
    {id: "water-tip", message: "Water low", rowKind: "tip", guidanceTopicIds: ["water"]},
  ];
  it("suppresses matching ordinary rows, preserves real urgent/history/other topics, and does not mutate receipts", () => {
    const saved = JSON.stringify(items);
    expect(clinicFeedForTutorial(items, step).map((item) => item.id)).toEqual(["old-history", "dire", "water-tip"]);
    expect(JSON.stringify(items)).toBe(saved);
    expect(clinicFeedForTutorial(items, null)).toEqual(items);
  });
});
