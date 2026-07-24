export type PatientFolder = "waiting" | "active" | "resolved";

export interface PatientTabView {
  id: string;
  folder: PatientFolder;
  name: string;
  subtitle: string;
  statusLabel: string;
  actionRequired: boolean;
  selected: boolean;
  patienceLabel?: string;
}

export interface AnswerChoiceView {
  id: string;
  label: string;
  selected: boolean;
  disabled: boolean;
}

export interface ChartView {
  id: string;
  patientName: string;
  patientDetails: string;
  statusLabel: string;
  presentation: string;
  pendingLabel?: string;
  etaLabel?: string;
  questionPrompt?: string;
  answerChoices: AnswerChoiceView[];
  feedbackTitle?: string;
  feedbackBody?: string;
  terminalOutcomeTitle?: string;
  terminalOutcomeBody?: string;
  terminalOutcomeSeverity?: "minor" | "major";
  terminalFeedbackNeedsAcknowledgment: boolean;
  summaryAvailable: boolean;
  summaryVisible: boolean;
  summaryBody?: string;
  canFile: boolean;
  readOnly: boolean;
}

export interface ResourceBarView {
  moneyLabel: string;
  moneyDeltaLabel: string;
  xpLabel: string;
  satisfactionLabel: string;
  facilityTimeLabel: string;
  workloadLabel: string;
  workloadStatusLabel: string;
  facilityLevelLabel: string;
}

export interface RoomBuildOptionView {
  id: string;
  displayName: string;
  footprintLabel: string;
  costLabel: string;
  upkeepLabel: string;
  owned: boolean;
  selected: boolean;
  enabled: boolean;
  blockedReason?: string;
}

export interface StaffHireOptionView {
  id: string;
  displayName: string;
  costLabel: string;
  salaryLabel: string;
  hired: boolean;
  enabled: boolean;
  blockedReason?: string;
}

export interface ProgressionGoalView {
  id: string;
  label: string;
  complete: boolean;
  progressLabel: string;
}

export interface ProgressionView {
  facilityLevelLabel: string;
  nextLevelLabel: string | null;
  goals: ProgressionGoalView[];
  canLevelUp: boolean;
  prototypeComplete: boolean;
}

export interface DevelopmentView {
  campaignIdLabel: string;
  learningHistoryLabel: string;
  reviewCountLabel: string;
  fastForwardLabel: string;
  learningCards: Array<{
    conceptId: string;
    conceptLabel: string;
    statusLabel: string;
  }>;
}

export interface CampaignListItemView {
  campaignId: string;
  name: string;
  createdAtRealMs: number;
  facilityLevel: number;
  fsrsReviewCount: number;
  active: boolean;
}
