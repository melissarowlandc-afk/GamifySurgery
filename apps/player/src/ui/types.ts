export type PatientFolder = "waiting" | "active" | "resolved";

export type PixelAvatarHairStyle =
  | "none"
  | "short"
  | "parted"
  | "curly"
  | "bun";

export type PixelAvatarAccessory =
  | "none"
  | "glasses"
  | "badge"
  | "headband";

export type PixelAvatarBodyShape =
  | "compact"
  | "average"
  | "broad"
  | "tall";

export type PixelAvatarFaceStyle = "round" | "square" | "long";

export type PixelAvatarOutfitStyle =
  | "plain"
  | "striped"
  | "checked"
  | "coat";

/**
 * A renderer-neutral, clinically meaningless appearance descriptor.
 *
 * The domain may generate and persist these values from the campaign's
 * appearance random stream. None of these fields should be inferred from, or
 * used as a proxy for, a patient's clinical demographics.
 */
export interface PixelAvatarView {
  version: "pixel-avatar.v1";
  bodyShape: PixelAvatarBodyShape;
  hairStyle: PixelAvatarHairStyle;
  hairShade: 0 | 1 | 2 | 3;
  faceStyle: PixelAvatarFaceStyle;
  outfitStyle: PixelAvatarOutfitStyle;
  outfitShade: 0 | 1 | 2 | 3;
  accessory: PixelAvatarAccessory;
}

export interface PatientTabView {
  id: string;
  folder: PatientFolder;
  name: string;
  subtitle: string;
  statusLabel: string;
  actionRequired: boolean;
  selected: boolean;
  patienceLabel?: string;
  avatar?: PixelAvatarView;
  /** Optional stable order key. Resolved charts use descending order. */
  sortKey?: number;
}

export interface AnswerChoiceView {
  id: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  /** Facility-time estimate shown before selection when this choice orders work. */
  etaLabel?: string;
  detailLabel?: string;
}

export interface ChartDecisionStepView {
  id: string;
  heading: string;
  statusLabel?: string;
  questionPrompt?: string;
  answerChoices: AnswerChoiceView[];
  resultHeading?: string;
  resultBody?: string;
  etaLabel?: string;
  feedbackTitle?: string;
  feedbackBody?: string;
  rewardLabel?: string;
  current: boolean;
  complete: boolean;
}

export interface ChartRewardView {
  heading?: string;
  moneyLabel?: string;
  xpLabel?: string;
  satisfactionLabel?: string;
}

export interface ChartView {
  id: string;
  patientName: string;
  patientDetails: string;
  /** Optional approved demographics for the paper-chart header. */
  ageLabel?: string;
  sexLabel?: string;
  chiefComplaint?: string;
  patientConfidenceLabel?: string;
  /** Optional approved vital signs. Omitted values are never invented by UI. */
  vitals?: Array<{
    id: string;
    label: string;
    value: string;
    icon?: "heart" | "pressure" | "temperature" | "oxygen";
  }>;
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
  avatar?: PixelAvatarView;
  presentationHeading?: string;
  /**
   * Ordered frozen encounter history. When omitted, ChartPanel builds one
   * compatible decision column from the legacy question fields above.
   */
  decisionSteps?: ChartDecisionStepView[];
  reward?: ChartRewardView;
  primaryActionLabel?: string;
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
  levelLabel?: string;
  xpProgressLabel?: string;
  xpProgressPercent?: number;
  moneyHourlyDeltaLabel?: string;
  dayTimeLabel?: string;
  goals?: ProgressionGoalView[];
  contentNoticeLabel?: string;
}

export interface EmergencyGlp1View {
  visible: boolean;
  enabled: boolean;
  paymentLabel: string;
  statusLabel: string;
  useCountLabel: string;
  flavorMessage?: string;
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

export interface SelectedRoomBuildView {
  id: string;
  displayName: string;
  upgradeLevel: number;
  upgradeCostLabel?: string;
  resaleValueLabel?: string;
  canUpgrade: boolean;
  canSell: boolean;
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

export interface StaffMemberView {
  id: string;
  displayName: string;
  roleDisplayName: string;
  salaryLabel: string;
  moraleLabel: string;
  moralePercent: number;
  avatar?: PixelAvatarView;
  canDecreaseSalary: boolean;
  canIncreaseSalary: boolean;
}

export interface StaffRoleGroupView {
  id: string;
  displayName: string;
  currentCount: number;
  maximumCount: number;
  hiringCostLabel: string;
  employees: StaffMemberView[];
  canHire: boolean;
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
  addMoneyLabel: string;
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

export type MessageBoardItemKind =
  | "alert"
  | "event"
  | "positive"
  | "joke";

export type MessageBoardPriority =
  | "critical"
  | "action_required"
  | "informational"
  | "flavor";

export type MessageBoardTargetType =
  | "patient"
  | "employee"
  | "room"
  | "build_mode"
  | "goal"
  | "emergency_glp1";

export interface MessageBoardItemView {
  id: string;
  /** Legacy display kind; priority takes precedence when both are supplied. */
  kind?: MessageBoardItemKind;
  priority?: MessageBoardPriority;
  message: string;
  title?: string;
  timeLabel?: string;
  actionLabel?: string;
  sortKey?: number;
  persistent?: boolean;
  targetType?: MessageBoardTargetType;
  targetId?: string;
}
