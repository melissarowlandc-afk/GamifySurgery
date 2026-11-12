import { useState } from "react";
import type { AnswerChoiceView, ChartDecisionStepView } from "./types";

type WaitEstimate = Pick<AnswerChoiceView, "etaLabel" | "detailLabel">;
type QuestionEstimates = Map<string, WaitEstimate>;
interface WaitSnapshots {
  chartId: string | null;
  questions: Map<string, QuestionEstimates>;
}

/**
 * Compare all choices against the runtime forecast at the same moment: when
 * their question opens. Busy-resource queues otherwise make only some labels
 * count down. Keep this transient UI state out of orders and saves; accepted
 * orders still use the current planner and pending results still count down.
 */
export function useQuestionWaitSnapshots(
  chartId: string | null,
  steps: ChartDecisionStepView[],
): ChartDecisionStepView[] {
  const [saved, setSaved] = useState<WaitSnapshots>(() => ({ chartId, questions: new Map() }));
  const previous = saved.chartId === chartId ? saved.questions : undefined;
  const questions = new Map<string, QuestionEstimates>();
  const displayed = steps.map((step) => {
    // Account-mode preparation can initially hide the choices. Capture only
    // when they exist. Legacy/team questions also need the prompt as identity.
    if (!step.questionPrompt || !step.answerChoices.length) return step;
    const key = JSON.stringify([step.id, step.questionVariantId, step.questionPrompt,
      step.answerChoices.map((choice) => choice.id).sort()]);
    let estimates = previous?.get(key);
    if (!estimates && step.current) {
      estimates = new Map(step.answerChoices.map((choice) => [choice.id,
        { etaLabel: choice.etaLabel, detailLabel: choice.detailLabel }]));
    }
    if (!estimates) return step;
    questions.set(key, estimates);
    return { ...step, answerChoices: step.answerChoices.map((choice) => ({ ...choice, ...estimates.get(choice.id) })) };
  });

  // Adjust during render so a changed question never paints with the previous
  // question's waits. Retain only questions still in this chart, and reset on
  // close/chart change. Answer order, gates, feedback and callbacks stay live.
  if (saved.chartId !== chartId || questions.size !== saved.questions.size ||
    [...questions].some(([key, estimates]) => saved.questions.get(key) !== estimates)) {
    setSaved({ chartId, questions });
  }
  return displayed;
}
