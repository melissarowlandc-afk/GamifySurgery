import { ChartPanel } from "./ChartPanel";
import type { ChartView, EmployeeDiscussionView } from "./types";

const STATUS_LABELS: Record<EmployeeDiscussionView["status"], string> = {
  traveling: "Founder walking over",
  question: "Action required",
  feedback: "Discussion feedback",
  summary: "Discussion complete",
};

/**
 * Maps a team discussion onto the patient-chart sheet so both share one
 * layout: identity header, story column, and a decision column whose
 * feedback appears beneath the answered choices rather than on a new page.
 */
export function employeeDiscussionChartView(discussion: EmployeeDiscussionView): ChartView {
  const answered = discussion.status === "feedback" || discussion.status === "summary";
  return {
    id: discussion.id,
    subjectKind: "team_discussion",
    patientName: discussion.employeeName,
    patientDetails: discussion.roleLabel,
    subtitleLabel: discussion.roleLabel,
    chiefComplaint: discussion.topicLabel,
    avatar: discussion.avatar,
    statusLabel: STATUS_LABELS[discussion.status],
    presentation: discussion.presentation,
    answerChoices: [],
    terminalFeedbackNeedsAcknowledgment: discussion.status === "feedback",
    summaryAvailable: false,
    summaryVisible: false,
    canFile: discussion.status === "summary",
    readOnly: false,
    primaryActionLabel:
      discussion.status === "feedback" && !discussion.finalStep ? "Continue" : "File discussion",
    decisionSteps: [
      {
        id: `${discussion.id}.current`,
        heading: "Team question",
        questionPrompt: discussion.question,
        exhibit: discussion.exhibit,
        teachingPoint: answered ? discussion.teachingPoint : undefined,
        answerChoices: discussion.choices ?? [],
        feedbackTitle: answered ? discussion.feedbackTitle : undefined,
        feedbackBody: answered ? discussion.feedback : undefined,
        current: true,
        complete: discussion.status === "summary",
      },
    ],
  };
}

export function EmployeeDiscussionPanel({ discussion, onAnswer, onAcknowledge, onFile, onClose }: { discussion: EmployeeDiscussionView; onAnswer: (id: string) => void; onAcknowledge: () => void; onFile: () => void; onClose: () => void }) {
  return (
    <ChartPanel
      chart={employeeDiscussionChartView(discussion)}
      onClose={onClose}
      onSubmitAnswer={onAnswer}
      onFlagQuestion={() => {}}
      onAcknowledgeTerminalFeedback={onAcknowledge}
      onToggleSummary={() => {}}
      onFileChart={onFile}
    />
  );
}
