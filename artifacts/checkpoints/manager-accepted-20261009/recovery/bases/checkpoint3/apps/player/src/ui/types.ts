import type { PixelAppearanceVariant } from "@gamify-surgery/game-domain";
import type { CaseExhibit } from "@gamify-surgery/clinical-content";

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
  skinTone?: 0 | 1 | 2 | 3;
  hairShade: 0 | 1 | 2 | 3;
  faceStyle: PixelAvatarFaceStyle;
  outfitStyle: PixelAvatarOutfitStyle;
  outfitShade: 0 | 1 | 2 | 3;
  accessory: PixelAvatarAccessory;
  headVariant?: PixelAppearanceVariant;
  bodyVariant?: PixelAppearanceVariant;
  stillId?: string;
  patientIdentityId?: `patient.adult.${string}`;
  roleStyle?:
    | "founder"
    | "patient"
    | "receptionist"
    | "imaging_technician"
    | "periop_nurse"
    | "endoscopy_nurse"
    | "endoscopist"
    | "phlebotomist"
    | "evs_worker"
    | "glp1_np";
}

export interface PatientTabView {
  id: string;
  folder: PatientFolder;
  name: string;
  subtitle: string;
  statusLabel: string;
  actionRequired: boolean;
  selected: boolean;
  satisfactionPercent: number;
  patienceLabel?: string;
  avatar?: PixelAvatarView;
  /** Optional stable order key. Resolved charts use descending order. */
  sortKey?: number;
}

/** A real employee discussion is deliberately not modeled as a patient chart. */
export interface EmployeeDiscussionTabView {
  subjectKind: "employee-discussion";
  id: string;
  employeeId: string;
  folder: PatientFolder;
  name: string;
  roleLabel: string;
  statusLabel: string;
  actionRequired: boolean;
  selected: boolean;
  blockedReason?: string;
  avatar?: PixelAvatarView;
  sortKey?: number;
}
export interface EmployeeDiscussionView {
  id:string; employeeName:string; roleLabel:string; avatar?:PixelAvatarView;
  /** `traveling` still accepts answers; the founder is walking over. */
  status:"traveling"|"question"|"feedback"|"summary";
  /** Short authored topic shown in the chart's chief-complaint slot. */
  topicLabel?:string;
  presentation:string; reviewStatus:string; question?:string; choices?:AnswerChoiceView[];
  feedbackTitle?:"Correct"|"Incorrect"; feedback?:string; correctAnswerText?:string;
  exhibit?: CaseExhibit;
  teachingPoint?: string;
  /** True when acknowledging this step's feedback completes the discussion. */
  finalStep:boolean;
}

export interface AnswerChoiceView {
  id: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  /** Facility-time estimate shown before selection when this choice orders work. */
  etaLabel?: string;
  detailLabel?: string;
  /** Set only after the decision is answered, so the key is never revealed early. */
  revealedCorrect?: boolean;
  /** Teaching feedback, supplied only after this decision has been answered. */
  rationale?: string;
}

/** One stage of pending diagnostic work, shown as a list in the chart. */
export interface ChartPendingPhaseView {
  label: string;
  location: "onsite" | "offsite";
  progressLabel: string;
  delayLabel?: string;
  complete: boolean;
}

export interface ChartDecisionStepView {
  id: string;
  /** Stable authored identity used by the non-scoring developer review flag. */
  questionVariantId?: string;
  primaryConceptId?: string;
  flaggedForDeveloperReview?: boolean;
  heading: string;
  statusLabel?: string;
  questionPrompt?: string;
  answerChoices: AnswerChoiceView[];
  resultHeading?: string;
  resultBody?: string;
  /** Diagnostic result status without the per-stage clause, paired with `resultPhases`. */
  resultSummary?: string;
  resultPhases?: ChartPendingPhaseView[];
  etaLabel?: string;
  feedbackTitle?: string;
  feedbackBody?: string;
  teachingPoint?: string;
  exhibit?: CaseExhibit;
  rewardLabel?: string;
  nextActionLabel?: string;
  collapsedResultLabel?: string;
  /** Authored later-decision update; never derived from the presentation. */
  currentUpdate?: string;
  current: boolean;
  complete: boolean;
}

export interface ChartRewardView {
  heading?: string;
  moneyLabel?: string;
  xpLabel?: string;
  satisfactionLabel?: string;
}

export interface ChartClinicalReviewView {
  diagnosisId: string;
  diagnosisName: string;
  sections: Array<{
    id: string;
    heading: string;
    body: string;
    evidenceClaimIds: string[];
  }>;
  claims: Array<{
    id: string;
    statement: string;
    reviewStatus: string;
  }>;
  sources: Array<{
    id: string;
    title: string;
    organizationOrJournal: string;
    year: number | null;
    href: string;
    supportedClaimIds: string[];
    reuseStatus: string;
    lastChecked: string;
  }>;
  contentVersion: string;
  reviewStatus: string;
  lastClinicianReview?: string;
}

export interface ChartView {
  id: string;
  /** Team discussions reuse the chart sheet; omitted means a patient chart. */
  subjectKind?: "patient" | "team_discussion";
  /** Header line used in place of age/sex, such as an employee's role. */
  subtitleLabel?: string;
  /** Stable clinical case ID for provenance and development inspection. */
  clinicalCaseId?: string;
  patientName: string;
  patientDetails: string;
  /** Optional approved demographics for the paper-chart header. */
  ageLabel?: string;
  sexLabel?: string;
  chiefComplaint?: string;
  patientSatisfactionLabel?: string;
  /** Optional approved vital signs. Omitted values are never invented by UI. */
  vitals?: Array<{
    id: string;
    label: string;
    value: string;
    icon?: "heart" | "pressure" | "temperature" | "oxygen";
  }>;
  statusLabel: string;
  presentation: string;
  /** Later-step findings shown with the presentation, never above answers. */
  presentationUpdate?: string;
  pendingLabel?: string;
  /** Diagnostic pending status without the per-stage clause, paired with `pendingPhases`. */
  pendingSummary?: string;
  pendingPhases?: ChartPendingPhaseView[];
  /** Whether the active pending service sends the patient away from clinic. */
  pendingPatientIsAway?: boolean;
  etaLabel?: string;
  questionPrompt?: string;
  answerChoices: AnswerChoiceView[];
  feedbackTitle?: string;
  feedbackBody?: string;
  teachingPoint?: string;
  exhibit?: CaseExhibit;
  terminalOutcomeTitle?: string;
  terminalOutcomeBody?: string;
  terminalOutcomeSeverity?: "minor" | "major";
  terminalFeedbackNeedsAcknowledgment: boolean;
  summaryAvailable: boolean;
  summaryVisible: boolean;
  summaryBody?: string;
  clinicalReview?: ChartClinicalReviewView;
  canFile: boolean;
  readOnly: boolean;
  avatar?: PixelAvatarView;
  /**
   * Ordered frozen encounter history. When omitted, ChartPanel builds one
   * compatible decision column from the legacy question fields above.
   */
  decisionSteps?: ChartDecisionStepView[];
  reward?: ChartRewardView;
  primaryActionLabel?: string;
  primaryActionClosesChart?: boolean;
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
  cooldownProgressPercent: number;
  flavorMessage?: string;
  automationCapacity: number;
  nextPayoutLabel?: string;
}

export interface ServiceIncomeCatalogLineView {
  id: string;
  displayName: string;
  kind: "clinical" | "retail" | "remote";
  feeLabel: string;
  stockCostLabel?: string;
  contributionLabel?: string;
  minimumFacilityLevel: number;
  requirementLabel: string;
  available: boolean;
  unavailableReason?: string;
  /** Management grouping: earning now, temporarily paused, missing setup, or a later level. */
  group?: "earning" | "paused" | "needs" | "future";
  /** How this income arrives, e.g. booked visitors, chart orders or walk-up sales. */
  arrivalLabel?: string;
  /** Booked visitors stop while scheduled appointments are switched off. */
  scheduled?: boolean;
  pausedReason?: string;
  /** Build/Hire shortcuts for the missing room or staff role. */
  setupActions?: ServiceSetupActionView[];
}

export interface ServiceSetupActionView {
  label: string;
  target: "room" | "staff";
  id: string;
}

export interface ServiceIncomeOperationView {
  id: string;
  displayName: string;
  actorLabel: string;
  statusLabel: string;
  quoteFeeLabel: string;
}

export interface ServiceIncomeReceiptView {
  id: string;
  displayName: string;
  actorLabel: string;
  grossLabel: string;
  stockCostLabel: string;
  netLabel: string;
  timeLabel?: string;
}

/** Since-opening operating picture for Management's Money tab. */
export interface ManagementFinanceView {
  cashLabel: string;
  earnedLabel: string;
  billedLabel: string;
  stockLabel: string;
  runningCostsLabel: string;
  profitLabel: string;
  profitPositive: boolean;
  hourlyCostLabel: string;
  hourlyCosts: { id: "staff" | "rooms" | "advertising"; label: string; amount: number; amountLabel: string }[];
  runwayLabel: string;
  recentEarnings: { displayName: string; net: number; netLabel: string; count: number }[];
  recentEarningsReceiptCount: number;
}

export interface ServiceIncomeView {
  periopNurseQueueLength?: number;
  appointmentsEnabled: boolean;
  catalogLines: ServiceIncomeCatalogLineView[];
  activeOperations: ServiceIncomeOperationView[];
  recentReceipts: ServiceIncomeReceiptView[];
  grossTotalLabel: string;
  stockCostTotalLabel: string;
  netTotalLabel: string;
  radiologistReads?: {
    today: { inHouseReads: number; outsideReads: number; inHouseIncomeLabel: string; outsideIncomeLabel: string };
    thisLevel: { inHouseReads: number; outsideReads: number; inHouseIncomeLabel: string; outsideIncomeLabel: string };
  };
  laboratoryWorkQueue?: {
    enabled: boolean;
    statusLabel: string;
    disabledReason?: string;
  };
  levelThreeSupport?: {
    maintenanceDueRoomNames: string[];
    maintenanceOutOfServiceRoomNames: string[];
    maintenanceRepairingRoomNames: string[];
    queuedQiReviewCount: number;
    inProgressQiReviewCount: number;
    completedQiReviewCount: number;
    staffOnBreakCount: number;
  };
  finances?: ManagementFinanceView;
}

export interface AdvertisingView {
  currentLevel: number;
  currentDisplayName: string;
  hourlyCostLabel: string;
  arrivalFrequencyLabel: string;
  canDecrease: boolean;
  canIncrease: boolean;
}

/** Build Mode groups shared by the New Rooms and My Rooms tabs. */
export type RoomBuildCategoryId =
  | "patient"
  | "diagnostics"
  | "procedures"
  | "support"
  | "services";

/**
 * What one more upgrade does, in player words. Codex owns the upgrade rules
 * (GS-038); Build Mode only describes the effect the game really applies.
 */
export interface RoomUpgradeBenefitView {
  perUpgradeLabel: string;
  /** Words before this room's running total; defaults to "Now". */
  totalCaption?: string;
  currentLabel: string;
  nextLabel?: string;
  note?: string;
  upkeepLabel?: string;
}

/** One built room in the My Rooms tab. */
export interface OwnedRoomBuildView {
  id: string;
  roomDefinitionId: string;
  /** Lettered ("Waiting Room A") only while 2+ rooms of the type exist. */
  displayName: string;
  category: RoomBuildCategoryId;
  upgradeLevel: number;
  maxUpgradeLevel: number;
  upgradeable: boolean;
  nextUpgradeCostLabel?: string;
  canUpgrade: boolean;
  benefitSummary?: string;
  benefit?: RoomUpgradeBenefitView;
  accessProblem: boolean;
}

/** A room that unlocks at the next facility level. */
export interface LockedRoomBuildView {
  id: string;
  displayName: string;
  category: RoomBuildCategoryId;
  purpose: string;
  costLabel: string;
  unlockLabel: string;
}

export interface RoomBuildOptionView {
  id: string;
  displayName: string;
  category?: RoomBuildCategoryId;
  /** One line saying what the room is for. */
  purpose?: string;
  footprintLabel: string;
  costLabel: string;
  upkeepLabel: string;
  /** Kept separate from upkeep so construction capacity stays readable. */
  builtCountLabel: string;
  /** Built up to its instance limit; listed under the collapsed maximum section. */
  atMaximum?: boolean;
  owned: boolean;
  selected: boolean;
  enabled: boolean;
  blockedReason?: string;
}

export interface SelectedRoomBuildView {
  id: string;
  roomDefinitionId: string;
  displayName: string;
  upgradeLevel: number;
  maxUpgradeLevel?: number;
  /** False for rooms with a single level (no stars, no upgrade button). */
  upgradeable?: boolean;
  benefit?: RoomUpgradeBenefitView;
  canMove?: boolean;
  accessProblem?: boolean;
  nextUpgradeLevel?: number;
  upgradeCostLabel?: string;
  upgradeImprovements: string[];
  resaleValueLabel?: string;
  canUpgrade: boolean;
  canSell: boolean;
  blockedReason?: string;
  salePreview?: {
    roomId: string;
    roomDefinitionId: string;
    dismissedEmployees: Array<{
      id: string;
      displayName: string;
      staffRoleDefinitionId: string;
    }>;
    confirmationToken: string;
  };
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

/** Training data for Management's employee card; the domain owns eligibility. */
export interface EmployeeTrainingView {
  level: number;
  nextLevel: number | null;
  cost: number | null;
  costLabel: string | null;
  canTrain: boolean;
  blockedReason: string | null;
  status: "idle" | "queued" | "walking" | "training" | "returning" | "max_level";
  statusLabel: string;
  minutesRemaining: number | null;
  /** Null until a room is bound; an active session keeps its saved duration. */
  sessionDurationMinutes: number | null;
  currentBenefitLabel: string;
  nextBenefitLabel: string | null;
  /** Additional benefit earned by this purchase, separate from target total. */
  incrementBenefitLabel: string | null;
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
  /** Optional only for older UI fixtures; live employee cards supply this. */
  training?: EmployeeTrainingView;
  /** Numeric hourly salary for Management payroll totals. */
  salaryPerHour?: number;
  /** Role-average benefit if this employee completes their next level. */
  trainingTeamAverageAfterLabel?: string;
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
  staffingGuidance?: string;
  /** Present once a Training Room is built and the role has employees. */
  trainingSummary?: StaffRoleTrainingSummaryView;
}

export interface StaffRoleTrainingSummaryView {
  averageLevelLabel: string;
  averageBenefitLabel: string;
}

/** Training Room status for Management; absent until a Training Room is built. */
export interface StaffTrainingOverviewView {
  inTrainingCount: number;
  queuedCount: number;
  capacity: number;
  summaryLabel: string;
}

export interface ProgressionGoalView {
  id: string;
  label: string;
  complete: boolean;
  progressLabel: string;
}

export interface ProcedureSetupRequirementView {
  id: string;
  label: string;
  detail: string;
  met: boolean;
  action?: {
    label: "Build" | "Hire";
    target: "room" | "staff";
    id: string;
  };
}

export type EndoscopySetupRequirementView = ProcedureSetupRequirementView;

export interface ProgressionView {
  facilityLevelLabel: string;
  nextLevelLabel: string | null;
  goals: ProgressionGoalView[];
  secondaryGoals?: ProgressionGoalView[];
  canLevelUp: boolean;
  prototypeComplete: boolean;
  endoscopySetupRequirements?: EndoscopySetupRequirementView[];
  ambulatoryOperationSetupRequirements?: ProcedureSetupRequirementView[];
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
  status: "resumable" | "archived";
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

export type MessageBoardCategory =
  | "action_required"
  | "guidance"
  | "success"
  | "ambient_flavor"
  | "walkout_review";

export type MessageBoardTargetType =
  | "patient"
  | "employee"
  | "staff_role"
  | "room"
  | "water_cooler"
  | "advertising"
  | "litter"
  | "build_mode"
  | "goal"
  | "emergency_glp1"
  | "money"
  | "save";

/** Intent only; the session revalidates and dispatches the guarded command. */
export type ClinicAlertAction = (import("@gamify-surgery/game-domain").GuidanceTipAction |
  { kind: "save_and_pause" }) & {
    tip?: { id: import("@gamify-surgery/balance-config").GuidanceTipId; targetKey: string };
  };

export interface ClinicAlertActionResult {
  ok: boolean;
  reason?: string;
}

export interface NeedsYouItemView {
  id: string;
  kind: "save" | "patient" | "payroll" | "resource";
  title: string;
  why: string;
  sortKey: number;
  timeLabel?: string;
  actionLabel: string;
  action: ClinicAlertAction;
  targetType?: MessageBoardTargetType;
  targetId?: string;
  /** Only a modeled deadline; patient satisfaction is not a countdown. */
  deadline?: { minutesLeft: number; windowMinutes: number; label: string };
  pin?: { kind: "patient" | "service_visitor" | "room"; id: string };
}

export interface MessageBoardItemView {
  id: string;
  /** Legacy display kind; priority takes precedence when both are supplied. */
  kind?: MessageBoardItemKind;
  priority?: MessageBoardPriority;
  /**
   * Semantic presentation category. Kept optional while older saved and
   * development-only notices are migrated through the view-model layer.
   */
  category?: MessageBoardCategory;
  /**
   * The exclamation treatment is intentionally independent of priority: only
   * messages that require the player's attention should receive it.
   */
  showAttentionMarker?: boolean;
  message: string;
  title?: string;
  timeLabel?: string;
  actionLabel?: string;
  sortKey?: number;
  persistent?: boolean;
  targetType?: MessageBoardTargetType;
  targetId?: string;
  /** M3 can add tip rows without changing the board or gameplay history. */
  rowKind?: "event" | "humor" | "milestone" | "resolved" | "day_summary" | "tip";
  guidanceTopicIds?: readonly string[];
  speaker?: string;
  action?: ClinicAlertAction;
  daySummary?: {
    dayNumber: number;
    patientsSeen: number;
    moneyEarnedLabel: string;
    satisfactionLabel: string;
    reviewLine?: string;
    partial?: boolean;
  };
}
