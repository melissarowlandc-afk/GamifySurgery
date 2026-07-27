export type PrototypeAlertPriority =
  | "critical"
  | "action_required"
  | "informational"
  | "flavor";

export type PrototypeAlertTargetKind =
  | "patient"
  | "room"
  | "employee"
  | "task"
  | "system";

export interface PrototypeAlertDefinition {
  id: string;
  trigger:
    | "patient_arrived"
    | "patience_warning"
    | "patient_left"
    | "result_ready"
    | "clinical_decision_required"
    | "encounter_complete"
    | "patient_payment"
    | "learning_review_scheduled"
    | "room_placed"
    | "room_unreachable"
    | "private_exam_needed"
    | "staff_hired"
    | "staff_unreachable"
    | "operating_expense"
    | "low_cash"
    | "emergency_glp1_consultation"
    | "objective_complete"
    | "level_complete"
    | "campaign_saved"
    | "save_failed"
    | "page_hidden_pause"
    | "campaign_created"
    | "campaign_restored"
    | "campaign_restarted"
    | "testing_mode";
  priority: Exclude<PrototypeAlertPriority, "flavor">;
  titleTemplate: string;
  bodyTemplate: string;
  targetKind: PrototypeAlertTargetKind;
  clickAction:
    | "open_patient"
    | "open_room"
    | "open_employee"
    | "open_task"
    | "open_system"
    | "none";
  persistent: boolean;
  tickerEligible: boolean;
  eligibleFacilityLevels: readonly (0 | 1)[];
  consolidationKeyTemplate: string;
}

/**
 * Level 0-1 definitions only. Future mechanics and their message bank remain
 * documented in docs/features/alert-notification-flavor-system.md.
 */
export const PROTOTYPE_ALERT_DEFINITIONS = [
  {
    id: "alert.patient.arrived",
    trigger: "patient_arrived",
    priority: "action_required",
    titleTemplate: "New patient",
    bodyTemplate: "{{patient_name}} has checked in.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:arrival",
  },
  {
    id: "alert.patient.patience",
    trigger: "patience_warning",
    priority: "action_required",
    titleTemplate: "Patient waiting",
    bodyTemplate: "{{patient_name}} may leave soon.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:patience",
  },
  {
    id: "alert.patient.left",
    trigger: "patient_left",
    priority: "informational",
    titleTemplate: "Patient left",
    bodyTemplate: "{{patient_name}} left without being seen.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:left",
  },
  {
    id: "alert.patient.result-ready",
    trigger: "result_ready",
    priority: "action_required",
    titleTemplate: "Results ready",
    bodyTemplate: "{{result_name}} for {{patient_name}}.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:result",
  },
  {
    id: "alert.patient.decision-required",
    trigger: "clinical_decision_required",
    priority: "action_required",
    titleTemplate: "Clinical decision",
    bodyTemplate: "A clinical decision is required for {{patient_name}}.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:decision",
  },
  {
    id: "alert.patient.complete",
    trigger: "encounter_complete",
    priority: "action_required",
    titleTemplate: "Encounter complete",
    bodyTemplate: "{{patient_name}} is ready to close.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:complete",
  },
  {
    id: "alert.finance.patient-payment",
    trigger: "patient_payment",
    priority: "informational",
    titleTemplate: "Payment received",
    bodyTemplate: "Patient payment received: ${{amount}}.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:payment",
  },
  {
    id: "alert.learning.review-scheduled",
    trigger: "learning_review_scheduled",
    priority: "informational",
    titleTemplate: "Future review",
    bodyTemplate: "This concept has been scheduled for future review.",
    targetKind: "patient",
    clickAction: "open_patient",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "patient:{{patient_id}}:learning",
  },
  {
    id: "alert.facility.room-placed",
    trigger: "room_placed",
    priority: "informational",
    titleTemplate: "Construction complete",
    bodyTemplate: "{{room_name}} is ready.",
    targetKind: "room",
    clickAction: "open_room",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "room:{{room_id}}:placed",
  },
  {
    id: "alert.facility.room-unreachable",
    trigger: "room_unreachable",
    priority: "action_required",
    titleTemplate: "Room cannot operate",
    bodyTemplate: "{{room_name}} has no connected path to the Front Desk.",
    targetKind: "room",
    clickAction: "open_room",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "room:{{room_id}}:unreachable",
  },
  {
    id: "alert.facility.private-exam-needed",
    trigger: "private_exam_needed",
    priority: "action_required",
    titleTemplate: "Private exam space needed",
    bodyTemplate:
      "{{patient_name}} would prefer not to discuss protected health information at the Front Desk. Build an Examination Room.",
    targetKind: "task",
    clickAction: "open_task",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0],
    consolidationKeyTemplate: "facility:private-exam-needed",
  },
  {
    id: "alert.staff.hired",
    trigger: "staff_hired",
    priority: "informational",
    titleTemplate: "Employee hired",
    bodyTemplate: "{{employee_name}} has been hired.",
    targetKind: "employee",
    clickAction: "open_employee",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "employee:{{employee_id}}:hired",
  },
  {
    id: "alert.staff.unreachable",
    trigger: "staff_unreachable",
    priority: "action_required",
    titleTemplate: "Assignment unreachable",
    bodyTemplate: "{{employee_name}} cannot reach the assigned room.",
    targetKind: "employee",
    clickAction: "open_employee",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "employee:{{employee_id}}:unreachable",
  },
  {
    id: "alert.finance.expense",
    trigger: "operating_expense",
    priority: "informational",
    titleTemplate: "Clinic expenses",
    bodyTemplate: "Upkeep and payroll charged: ${{amount}}.",
    targetKind: "system",
    clickAction: "open_system",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "finance:expense:{{facility_day}}",
  },
  {
    id: "alert.finance.low-cash",
    trigger: "low_cash",
    priority: "action_required",
    titleTemplate: "Low cash",
    bodyTemplate: "Less than ${{threshold}} remains.",
    targetKind: "system",
    clickAction: "open_system",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "finance:low-cash",
  },
  {
    id: "alert.finance.emergency-glp1-completed",
    trigger: "emergency_glp1_consultation",
    priority: "informational",
    titleTemplate: "Emergency consultation complete",
    bodyTemplate: "Emergency consultation payment received: ${{amount}}.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "finance:emergency-glp1:{{facility_day}}:{{use_number}}",
  },
  {
    id: "alert.progress.objective",
    trigger: "objective_complete",
    priority: "informational",
    titleTemplate: "Objective complete",
    bodyTemplate: "{{objective}}",
    targetKind: "system",
    clickAction: "open_system",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "objective:{{objective_id}}",
  },
  {
    id: "alert.progress.level-complete",
    trigger: "level_complete",
    priority: "action_required",
    titleTemplate: "Level {{level}} complete",
    bodyTemplate: "All progression requirements are complete.",
    targetKind: "system",
    clickAction: "open_system",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "progress:level:{{level}}",
  },
  {
    id: "alert.system.saved",
    trigger: "campaign_saved",
    priority: "informational",
    titleTemplate: "Campaign saved",
    bodyTemplate: "Your latest clinic state is durable in this browser.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:saved",
  },
  {
    id: "alert.system.save-failed",
    trigger: "save_failed",
    priority: "action_required",
    titleTemplate: "Save failed",
    bodyTemplate: "Keep the game open and try again.",
    targetKind: "system",
    clickAction: "none",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:save-failed",
  },
  {
    id: "alert.system.hidden-pause",
    trigger: "page_hidden_pause",
    priority: "informational",
    titleTemplate: "Game paused",
    bodyTemplate: "Game paused while the page was hidden. Resume when ready.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:hidden-pause",
  },
  {
    id: "alert.system.campaign-created",
    trigger: "campaign_created",
    priority: "informational",
    titleTemplate: "New campaign",
    bodyTemplate: "New campaign created with fresh learning histories.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:campaign-created",
  },
  {
    id: "alert.system.campaign-restored",
    trigger: "campaign_restored",
    priority: "informational",
    titleTemplate: "Campaign restored",
    bodyTemplate: "Campaign restored from the most recent local save.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:campaign-restored",
  },
  {
    id: "alert.system.campaign-restarted",
    trigger: "campaign_restarted",
    priority: "informational",
    titleTemplate: "Campaign reset complete",
    bodyTemplate:
      "A fresh same-seed campaign is active with blank learning histories.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:campaign-restarted",
  },
  {
    id: "alert.system.testing-mode",
    trigger: "testing_mode",
    priority: "informational",
    titleTemplate: "Accelerated testing mode",
    bodyTemplate: "Prototype time was advanced for balance testing.",
    targetKind: "system",
    clickAction: "none",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "system:testing-mode",
  },
] as const satisfies readonly PrototypeAlertDefinition[];

export type PrototypeFlavorPoolId =
  | "patient_arrival"
  | "waiting"
  | "result"
  | "staff"
  | "construction"
  | "finance"
  | "progression"
  | "saving_testing";

export interface PrototypeFlavorPool {
  id: PrototypeFlavorPoolId;
  cooldownTicks: number;
  permittedDuringCritical: false;
  eligibleFacilityLevels: readonly (0 | 1)[];
  messages: readonly string[];
}

export const PROTOTYPE_FLAVOR_POOLS = [
  {
    id: "patient_arrival",
    cooldownTicks: 30,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "A patient has arrived with symptoms and expectations.",
      "The waiting room has acquired a patient.",
      "Good news: a patient found the clinic. They would now like care.",
      "The front desk has produced another chart.",
      "The clipboard hungers.",
      "A patient is early. This feels suspicious.",
      "A patient is late, but their symptoms arrived on time.",
    ],
  },
  {
    id: "waiting",
    cooldownTicks: 20,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "The queue is now clinically significant.",
      "Your waiting room is beginning to develop a differential.",
      "The chairs are now practicing population medicine.",
      "The waiting-room clock has joined the care team.",
      "The patient has now read the same poster three times.",
      "The magazine formulary has been exhausted.",
      "The clinic is popular. Unfortunately, this has created a queue.",
    ],
  },
  {
    id: "result",
    cooldownTicks: 20,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "Radiology has spoken. Please correlate clinically.",
      "The lab has converted blood into decisions.",
      "The CBC has opinions.",
      "A result has returned from its spiritual journey through the EHR.",
      "Good news: the result is back. Different news: it requires action.",
      "The specimen was labeled correctly. A small victory.",
      "The chart would like a plan.",
      "Assessment complete. Management remains aspirational.",
      "The workup is complete. The answer remains stubbornly answer-shaped.",
    ],
  },
  {
    id: "staff",
    cooldownTicks: 45,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "The founder is covering the front desk again. Leadership.",
      "A staff member is idle. Payroll is not.",
      "You hired a person. They now expect a place to work.",
      "The imaging technician cannot operate a room that exists only in your imagination.",
      "Staff morale has entered the differential.",
      "Your staff would like functioning equipment. Bold.",
      "Someone has asked when lunch is. There is no correct answer.",
      "The break room remains theoretical.",
      "The printer has sensed urgency and gone offline.",
      "An administrator has asked whether throughput could simply be higher.",
    ],
  },
  {
    id: "construction",
    cooldownTicks: 20,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "Construction complete. The dust is now somebody else's problem.",
      "You built a room. Healthcare expands.",
      "This room contains four walls and a billing opportunity.",
      "The exam room is ready for awkward paper-gown conversations.",
      "The X-ray room is ready. Please add photons and staff.",
      "The imaging control room is operational. Buttons now have consequences.",
      "The minor-procedure room is open for business and consent forms.",
      "The bathroom is complete. Patient satisfaction has discovered plumbing.",
      "The waiting room now has more chairs than answers.",
      "A room is empty. Its upkeep is not.",
      "That placement blocks a door. Even healthcare has fire codes.",
      "Your clinic has become a hallway with aspirations.",
    ],
  },
  {
    id: "finance",
    cooldownTicks: 30,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "Cash is low. Your vision remains expensive.",
      "The clinic has entered the check every invoice twice phase.",
      "You cannot afford this. The purchase button remains optimistic.",
      "Payroll is due. Employees continue to favor money.",
      "Upkeep paid. The building has agreed to remain a building.",
      "A patient payment has arrived. Revenue cycle celebrates.",
      "Income increased. Please resist buying another hallway.",
      "The budget is stable, a temporary and suspicious condition.",
      "Your cash reserve has achieved the structural integrity of wet tissue paper.",
      "The balance sheet is asking for a consult.",
    ],
  },
  {
    id: "progression",
    cooldownTicks: 20,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "XP gained. Expertise remains nonrefundable.",
      "You have leveled up. The patients did not become simpler.",
      "A new room is unlocked. Your floor plan has developed needs.",
      "Satisfaction is above 90%. Do not make sudden movements.",
      "All objectives are complete. The bureaucracy accepts your progress.",
      "One requirement remains. It knows what it did.",
      "Core mastery increased. Forgetting has been rescheduled.",
      "The scheduler has decided you should see this again. It is probably right.",
      "Review complete. The algorithm will be in touch.",
      "A difficult concept has returned for follow-up.",
    ],
  },
  {
    id: "saving_testing",
    cooldownTicks: 30,
    permittedDuringCritical: false,
    eligibleFacilityLevels: [0, 1],
    messages: [
      "Campaign saved. Your questionable decisions are now durable.",
      "Game paused. The clinic has entered an unprecedented state of calm.",
      "Welcome back. The waiting room remembered you.",
      "Time acceleration enabled. Mistakes will now happen more efficiently.",
      "Developer balance mode enabled. Economic reality has been suspended.",
      "Reset complete. The patients have agreed to forget.",
      "Autosave complete. Accountability preserved.",
    ],
  },
] as const satisfies readonly PrototypeFlavorPool[];
