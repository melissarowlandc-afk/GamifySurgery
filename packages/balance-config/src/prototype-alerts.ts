export type PrototypeAlertPriority =
  | "critical"
  | "action_required"
  | "informational"
  | "flavor";

export type PrototypeAlertCategory =
  | "action_required"
  | "guidance"
  | "success"
  | "ambient_flavor"
  | "walkout_review";

export type PrototypeAlertTargetKind =
  | "patient"
  | "room"
  | "employee"
  | "staff_role"
  | "advertising"
  | "water_cooler"
  | "litter"
  | "build_mode"
  | "task"
  | "system"
  | "none";

export type PrototypeAlertEligibility =
  | { kind: "always" }
  | { kind: "facility_level"; levels: readonly (0 | 1)[] }
  | { kind: "room_exists"; roomDefinitionId: string }
  | { kind: "object_exists"; objectId: "water_cooler" }
  | { kind: "checked_in_patient_exists" };

export interface PrototypeAlertTextVariant {
  /** Stable within the parent definition and safe to persist in save data. */
  id: string;
  titleTemplate?: string;
  bodyTemplate: string;
  selectionWeight: number;
}

export interface PrototypeAlertDefinition {
  id: string;
  trigger: string;
  category: PrototypeAlertCategory;
  priority: PrototypeAlertPriority;
  titleTemplate: string;
  bodyTemplate: string;
  variants: readonly PrototypeAlertTextVariant[];
  eligibility: readonly PrototypeAlertEligibility[];
  selectionWeight: number;
  cooldownMinutes: number;
  oncePerEvent: boolean;
  placeholderFallbacks: Readonly<Record<string, string>>;
  targetKind: PrototypeAlertTargetKind;
  clickAction:
    | "open_patient"
    | "open_room"
    | "open_employee"
    | "open_staff_role"
    | "open_advertising"
    | "open_water_cooler"
    | "open_litter"
    | "open_build_mode"
    | "open_task"
    | "open_system"
    | "none";
  showAttentionMarker: boolean;
  /** Walkout-review definitions may be selected only for these causes. */
  dissatisfactionCauses?: readonly PrototypeDissatisfactionCause[];
  /** Reviews deliberately use only one or two stars. */
  reviewRatings?: readonly (1 | 2)[];
  persistent: boolean;
  tickerEligible: boolean;
  eligibleFacilityLevels: readonly (0 | 1)[];
  consolidationKeyTemplate: string;
}

export type PrototypeDissatisfactionCause =
  | "excessive_waiting"
  | "poor_cleanliness"
  | "missing_amenities"
  | "no_receptionist"
  | "imaging_unavailable"
  | "general";

type BasePrototypeAlertDefinition = Omit<
  PrototypeAlertDefinition,
  | "category"
  | "variants"
  | "eligibility"
  | "selectionWeight"
  | "cooldownMinutes"
  | "oncePerEvent"
  | "placeholderFallbacks"
  | "showAttentionMarker"
>;

/**
 * Level 0-1 definitions only. Future mechanics and their message bank remain
 * documented in docs/features/alert-notification-flavor-system.md.
 */
const BASE_PROTOTYPE_ALERT_DEFINITIONS = [
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
    titleTemplate: "Patient approaching walkout",
    bodyTemplate:
      "{{patient_name}} has started reviewing the clinic instead of the magazine. Open the chart before they leave.",
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
    id: "alert.staff.fired",
    trigger: "staff_fired",
    priority: "informational",
    titleTemplate: "Employee fired",
    bodyTemplate: "{{employee_name}} was fired.",
    targetKind: "employee",
    clickAction: "open_employee",
    persistent: false,
    tickerEligible: true,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "employee:{{employee_id}}:fired",
  },
  {
    id: "alert.staff.receptionist-recommended",
    trigger: "receptionist_recommended",
    priority: "informational",
    titleTemplate: "Receptionist recommended",
    bodyTemplate:
      "Patients are checking themselves in with the confidence of people who did not read the form. Hire a receptionist to speed up check-in.",
    targetKind: "staff_role",
    clickAction: "open_staff_role",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "staff:receptionist-recommended",
  },
  {
    id: "alert.facility.onsite-imaging-requested",
    trigger: "onsite_imaging_requested",
    priority: "informational",
    titleTemplate: "Onsite X-ray requested",
    bodyTemplate:
      "I have to leave and come back for an X-ray? The patient has a point. Build an X-ray room to offer imaging onsite.",
    targetKind: "build_mode",
    clickAction: "open_build_mode",
    persistent: true,
    tickerEligible: true,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "facility:onsite-imaging-requested",
  },
  {
    id: "alert.staff.imaging-technician-needed",
    trigger: "imaging_staff_needed",
    priority: "informational",
    titleTemplate: "Imaging technician recommended",
    bodyTemplate:
      "The X-ray room looks excellent. It would look even better with someone who can operate it. Hire an imaging technician.",
    targetKind: "staff_role",
    clickAction: "open_staff_role",
    persistent: true,
    tickerEligible: false,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "staff:imaging-technician-needed",
  },
  {
    id: "alert.facility.waiting-room-needed",
    trigger: "waiting_room_needed",
    priority: "informational",
    titleTemplate: "Waiting Room recommended",
    bodyTemplate:
      "A patient is waiting beside the Front Desk and now knows everyone's business. Build a Waiting Room.",
    targetKind: "build_mode",
    clickAction: "open_build_mode",
    persistent: true,
    tickerEligible: true,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "facility:waiting-room-needed",
  },
  {
    id: "alert.facility.bathroom-needed",
    trigger: "bathroom_needed",
    priority: "informational",
    titleTemplate: "Bathroom recommended",
    bodyTemplate:
      "\"Is there a restroom?\" is now the clinic's most frequently asked question. Build a bathroom.",
    targetKind: "build_mode",
    clickAction: "open_build_mode",
    persistent: true,
    tickerEligible: true,
    eligibleFacilityLevels: [1],
    consolidationKeyTemplate: "facility:bathroom-needed",
  },
  {
    id: "alert.facility.cleanliness-low",
    trigger: "cleanliness_low",
    priority: "informational",
    titleTemplate: "Cleanliness needs attention",
    bodyTemplate:
      "Clinic cleanliness is {{cleanliness}}%. Even the dust looks concerned. Clean visible trash or improve maintenance.",
    targetKind: "litter",
    clickAction: "open_litter",
    persistent: true,
    tickerEligible: true,
    eligibleFacilityLevels: [0, 1],
    consolidationKeyTemplate: "facility:cleanliness-low",
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
] as const satisfies readonly BasePrototypeAlertDefinition[];

const GUIDANCE_ALERT_IDS = new Set<string>([
  "alert.staff.receptionist-recommended",
  "alert.facility.onsite-imaging-requested",
  "alert.staff.imaging-technician-needed",
  "alert.facility.waiting-room-needed",
  "alert.facility.bathroom-needed",
  "alert.facility.cleanliness-low",
]);

const SUCCESS_ALERT_IDS = new Set<string>([
  "alert.finance.patient-payment",
  "alert.learning.review-scheduled",
  "alert.facility.room-placed",
  "alert.staff.hired",
  "alert.staff.fired",
  "alert.finance.expense",
  "alert.finance.emergency-glp1-completed",
  "alert.progress.objective",
  "alert.system.saved",
  "alert.system.campaign-created",
  "alert.system.campaign-restored",
  "alert.system.campaign-restarted",
  "alert.system.testing-mode",
]);

const DEFAULT_PLACEHOLDER_FALLBACKS = {
  patient_name: "The patient",
  patient_id: "the patient",
  employee_name: "The employee",
  employee_id: "the employee",
  room_name: "The room",
  room_id: "the room",
  result_name: "New information",
  amount: "0",
  threshold: "the configured threshold",
  cleanliness: "the current value",
  morale: "the current value",
  objective: "Clinic objective",
  objective_id: "clinic-objective",
  level: "current",
  facility_day: "today",
  use_number: "this use",
} as const;

function categoryForBaseDefinition(
  definition: BasePrototypeAlertDefinition,
): PrototypeAlertCategory {
  if (definition.id === "alert.patient.left") {
    return "success";
  }
  if (GUIDANCE_ALERT_IDS.has(definition.id)) {
    return "guidance";
  }
  if (SUCCESS_ALERT_IDS.has(definition.id)) {
    return "success";
  }
  return definition.priority === "action_required" ||
    definition.priority === "critical"
    ? "action_required"
    : "success";
}

function enrichBaseDefinition(
  definition: BasePrototypeAlertDefinition,
): PrototypeAlertDefinition {
  const category = categoryForBaseDefinition(definition);
  return {
    ...definition,
    category,
    variants: [
      {
        id: `${definition.id}.default`,
        titleTemplate: definition.titleTemplate,
        bodyTemplate: definition.bodyTemplate,
        selectionWeight: 1,
      },
    ],
    eligibility: [
      {
        kind: "facility_level",
        levels: definition.eligibleFacilityLevels,
      },
    ],
    selectionWeight: 1,
    cooldownMinutes: definition.persistent ? 30 : 0,
    oncePerEvent: true,
    placeholderFallbacks: DEFAULT_PLACEHOLDER_FALLBACKS,
    showAttentionMarker: category === "action_required",
  };
}

interface AdditionalAlertInput {
  id: string;
  trigger: string;
  category: PrototypeAlertCategory;
  priority?: PrototypeAlertPriority;
  title: string;
  body: string;
  variants?: readonly PrototypeAlertTextVariant[];
  eligibility?: readonly PrototypeAlertEligibility[];
  targetKind?: PrototypeAlertTargetKind;
  clickAction?: PrototypeAlertDefinition["clickAction"];
  cooldownMinutes?: number;
  oncePerEvent?: boolean;
  persistent?: boolean;
  tickerEligible?: boolean;
  consolidationKey?: string;
  dissatisfactionCauses?: readonly PrototypeDissatisfactionCause[];
  reviewRatings?: readonly (1 | 2)[];
}

function additionalAlert(
  input: AdditionalAlertInput,
): PrototypeAlertDefinition {
  const levels = [0, 1] as const;
  return {
    id: input.id,
    trigger: input.trigger,
    category: input.category,
    priority:
      input.priority ??
      (input.category === "action_required"
        ? "action_required"
        : input.category === "ambient_flavor"
          ? "flavor"
          : "informational"),
    titleTemplate: input.title,
    bodyTemplate: input.body,
    variants:
      input.variants ??
      [
        {
          id: `${input.id}.default`,
          titleTemplate: input.title,
          bodyTemplate: input.body,
          selectionWeight: 1,
        },
      ],
    eligibility:
      input.eligibility ??
      [{ kind: "facility_level", levels }],
    selectionWeight: 1,
    cooldownMinutes: input.cooldownMinutes ?? 0,
    oncePerEvent: input.oncePerEvent ?? true,
    placeholderFallbacks: DEFAULT_PLACEHOLDER_FALLBACKS,
    targetKind: input.targetKind ?? "none",
    clickAction: input.clickAction ?? "none",
    showAttentionMarker: input.category === "action_required",
    dissatisfactionCauses: input.dissatisfactionCauses,
    reviewRatings: input.reviewRatings,
    persistent: input.persistent ?? false,
    tickerEligible: input.tickerEligible ?? true,
    eligibleFacilityLevels: levels,
    consolidationKeyTemplate:
      input.consolidationKey ?? input.id,
  };
}

const CONTEXTUAL_AND_SUCCESS_ALERTS = [
  additionalAlert({
    id: "alert.patient.leaving",
    trigger: "patient_leaving",
    category: "action_required",
    priority: "critical",
    title: "Patient leaving",
    body: "{{patient_name}} is leaving the clinic.",
    targetKind: "none",
    clickAction: "none",
    cooldownMinutes: 0,
    persistent: false,
  }),
  additionalAlert({
    id: "alert.environment.water-low",
    trigger: "water_cooler_low",
    category: "action_required",
    title: "Water cooler empty",
    body:
      "The water cooler is empty. It is now a large blue vase. Refill it.",
    targetKind: "water_cooler",
    clickAction: "open_water_cooler",
    cooldownMinutes: 30,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.staff.praised",
    trigger: "employee_praised",
    category: "success",
    title: "Employee praised",
    body:
      "{{employee_name}} was praised. Morale has acknowledged the gesture.",
    targetKind: "employee",
    clickAction: "open_employee",
    cooldownMinutes: 60,
  }),
  additionalAlert({
    id: "alert.staff.quit-insolvency",
    trigger: "staff_quit",
    category: "action_required",
    title: "Employee quit",
    body:
      "{{employee_name}} quit after another unpaid expense cycle.",
    targetKind: "employee",
    clickAction: "open_employee",
    cooldownMinutes: 0,
  }),
  additionalAlert({
    id: "alert.environment.water-empty",
    trigger: "water_cooler_low",
    category: "action_required",
    title: "Water cooler empty",
    body: "The water cooler is empty. It is now a large blue vase. Refill it.",
    targetKind: "water_cooler",
    clickAction: "open_water_cooler",
    cooldownMinutes: 30,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.environment.trash-visible",
    trigger: "litter_appeared",
    category: "guidance",
    title: "Visible trash",
    body:
      "The floor has acquired a backstory. Select the trash to send the founder to clean it.",
    targetKind: "litter",
    clickAction: "open_litter",
    cooldownMinutes: 30,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.patient.cleanliness-complaint",
    trigger: "dirty_clinic_patient_complaint",
    category: "guidance",
    title: "Patient noticed the clinic",
    body:
      "{{patient_name}} has started reviewing the visible trash instead of the magazine. Select it to send the founder to clean it.",
    targetKind: "litter",
    clickAction: "open_litter",
    cooldownMinutes: 45,
    persistent: true,
    consolidationKey: "environment:trash-accumulated",
  }),
  additionalAlert({
    id: "alert.patient.room-upgrade-requested",
    trigger: "patient_room_upgrade_request",
    category: "guidance",
    title: "Patient noticed the room",
    body:
      "{{patient_name}} has begun reviewing the fixtures. Upgrade {{room_name}} to improve comfort and care efficiency.",
    targetKind: "room",
    clickAction: "open_room",
    cooldownMinutes: 60,
    persistent: true,
    consolidationKey: "room-upgrade:{{room_id}}",
  }),
  additionalAlert({
    id: "alert.staff.morale-low",
    trigger: "staff_morale_low",
    category: "action_required",
    title: "Employee morale low",
    body:
      "{{employee_name}} is at {{morale}}% morale and has started admiring the exit. Improve working conditions before they quit.",
    targetKind: "employee",
    clickAction: "open_employee",
    cooldownMinutes: 60,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.finance.no-cash",
    trigger: "cash_empty",
    category: "action_required",
    title: "No available cash",
    body:
      "Payroll has entered its experimental phase. Restore cash before employee morale falls further.",
    targetKind: "system",
    clickAction: "open_system",
    cooldownMinutes: 30,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.advertising.recommended",
    trigger: "advertising_recommended",
    category: "guidance",
    title: "Advertising available",
    body:
      "The clinic phone has achieved inner peace. Increase Advertising if you want more patient arrivals.",
    targetKind: "advertising",
    clickAction: "open_advertising",
    cooldownMinutes: 90,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.facility.waiting-room-crowded",
    trigger: "waiting_room_crowded",
    category: "guidance",
    title: "Waiting Room crowded",
    body:
      "The Waiting Room has become a small convention. Add capacity or move patients through the clinic faster.",
    targetKind: "build_mode",
    clickAction: "open_build_mode",
    cooldownMinutes: 45,
    persistent: true,
  }),
  additionalAlert({
    id: "alert.success.receptionist-hired",
    trigger: "staff_hired",
    category: "success",
    title: "Receptionist hired",
    body:
      "Receptionist hired. The clipboard has recognized a new authority.",
    targetKind: "employee",
    clickAction: "open_employee",
  }),
  additionalAlert({
    id: "alert.success.waiting-room-constructed",
    trigger: "room_placed",
    category: "success",
    title: "Waiting Room opened",
    body: "Waiting Room opened. Patients may now wait professionally.",
    targetKind: "room",
    clickAction: "open_room",
  }),
  additionalAlert({
    id: "alert.success.xray-constructed",
    trigger: "room_placed",
    category: "success",
    title: "X-ray installed",
    body:
      "X-ray installed. The clinic can now see right through people, professionally.",
    targetKind: "room",
    clickAction: "open_room",
  }),
  additionalAlert({
    id: "alert.success.imaging-technician-hired",
    trigger: "staff_hired",
    category: "success",
    title: "Imaging technician hired",
    body:
      "Imaging technician hired. The expensive room is now more than décor.",
    targetKind: "employee",
    clickAction: "open_employee",
  }),
  additionalAlert({
    id: "alert.success.water-refilled",
    trigger: "water_cooler_refilled",
    category: "success",
    title: "Water cooler refilled",
    body:
      "Water cooler refilled. Hydration has resumed normal operations.",
    targetKind: "water_cooler",
    clickAction: "open_water_cooler",
  }),
  additionalAlert({
    id: "alert.success.trash-cleaned",
    trigger: "litter_collected",
    category: "success",
    title: "Trash cleaned",
    body: "Trash removed. The floor has been returned to the floor.",
    targetKind: "litter",
    clickAction: "open_litter",
  }),
  additionalAlert({
    id: "alert.success.room-upgraded",
    trigger: "room_upgraded",
    category: "success",
    title: "Room upgraded",
    body:
      "{{room_name}} upgraded. It has begun referring to itself as a suite.",
    targetKind: "room",
    clickAction: "open_room",
  }),
  additionalAlert({
    id: "alert.success.first-ordinary-patient-resolved",
    trigger: "encounter_complete",
    category: "success",
    title: "First ordinary patient resolved",
    body:
      "First patient resolved. The clinic remains structurally optimistic.",
    targetKind: "patient",
    clickAction: "open_patient",
  }),
  additionalAlert({
    id: "alert.success.satisfaction-above-90",
    trigger: "satisfaction_threshold_crossed",
    category: "success",
    title: "Patient satisfaction above 90%",
    body: "Patient satisfaction is above 90%. Please act natural.",
    targetKind: "system",
    clickAction: "none",
  }),
] as const;

const AMBIENT_ALERT_INPUTS = [
  ["01", "A fax arrived. Historians have been notified.", []],
  [
    "02",
    "The printer is out of cyan. It prints in black. This remains somehow relevant.",
    [],
  ],
  ["03", "The good pen has been sighted near the Front Desk.", []],
  [
    "04",
    "Someone adjusted the thermostat. Negotiations have collapsed.",
    [],
  ],
  [
    "05",
    "The waiting-room plant has been promoted. Its duties remain unclear.",
    [{ kind: "room_exists", roomDefinitionId: "room.waiting" }],
  ],
  ["06", "The coffee is technically warm.", []],
  ["07", "A clipboard is missing. A committee has been formed.", []],
  ["08", "A mysterious charger has appeared. It fits nothing.", []],
  [
    "09",
    "The break-room fridge contains a yogurt with tenure.",
    [{ kind: "room_exists", roomDefinitionId: "room.break_room" }],
  ],
  [
    "10",
    "The water cooler made a bubble. Three people looked.",
    [{ kind: "object_exists", objectId: "water_cooler" }],
  ],
  ["11", "One ceiling tile has developed seniority.", []],
  [
    "12",
    "The supply closet contains 47 extra-small gloves and one medium. Procurement calls this balanced.",
    [{ kind: "room_exists", roomDefinitionId: "room.supply_closet" }],
  ],
  [
    "13",
    "The waiting-room magazines are now primary historical sources.",
    [{ kind: "room_exists", roomDefinitionId: "room.waiting" }],
  ],
  ["14", "The hand-sanitizer dispenser sighed.", []],
  [
    "15",
    "Someone labeled their leftovers DO NOT EAT. Interest has increased.",
    [{ kind: "room_exists", roomDefinitionId: "room.break_room" }],
  ],
  [
    "16",
    "The stapler has relocated without leaving a forwarding address.",
    [],
  ],
  [
    "17",
    "Someone printed an email asking everyone not to print emails.",
    [],
  ],
  [
    "18",
    "The clinic Wi-Fi has been restarted. It is now slow with confidence.",
    [],
  ],
  [
    "19",
    "A paper gown has escaped its drawer.",
    [{ kind: "room_exists", roomDefinitionId: "room.examination" }],
  ],
  [
    "20",
    "The break-room microwave finished heating something no one remembers starting.",
    [{ kind: "room_exists", roomDefinitionId: "room.break_room" }],
  ],
  [
    "21",
    "A patient completed every form without missing a box. Compliance is investigating.",
    [{ kind: "checked_in_patient_exists" }],
  ],
  [
    "22",
    "Someone found a clean mug. Spirits are high.",
    [{ kind: "room_exists", roomDefinitionId: "room.break_room" }],
  ],
  [
    "23",
    "The Front Desk phone rang once and stopped. The mystery remains open.",
    [],
  ],
  [
    "24",
    "The automatic soap dispenser activated by itself. It knows what it did.",
    [{ kind: "room_exists", roomDefinitionId: "room.bathroom" }],
  ],
  [
    "25",
    "A box marked Miscellaneous has achieved its final form.",
    [],
  ],
] as const satisfies readonly [
  string,
  string,
  readonly PrototypeAlertEligibility[],
][];

export const PROTOTYPE_AMBIENT_ALERT_DEFINITIONS =
  AMBIENT_ALERT_INPUTS.map(([suffix, body, contextualEligibility]) =>
    additionalAlert({
      id: `alert.ambient.${suffix}`,
      trigger: "ambient_timer",
      category: "ambient_flavor",
      title: "Around the clinic",
      body,
      eligibility: [
        { kind: "facility_level", levels: [0, 1] },
        ...contextualEligibility,
      ],
      cooldownMinutes: 30,
      oncePerEvent: true,
    }),
  );

function reviewDefinition(
  id: string,
  causes: readonly PrototypeDissatisfactionCause[],
  lines: readonly string[],
): PrototypeAlertDefinition {
  return additionalAlert({
    id,
    trigger: "patient_walkout",
    category: "walkout_review",
    title: "New patient review",
    body: lines[0] ?? "The visit did not go as planned.",
    variants: lines.map((body, index) => ({
      id: `${id}.${String(index + 1).padStart(2, "0")}`,
      bodyTemplate: body,
      selectionWeight: 1,
    })),
    dissatisfactionCauses: causes,
    reviewRatings: [1, 2],
  });
}

export const PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS = [
  reviewDefinition("alert.review.excessive-waiting", ["excessive_waiting"], [
    "I was seen by three magazines and zero clinicians.",
    "Great place to finish a novel. Less ideal for medical care.",
    "They said someone would be right with me. Someone was not.",
    "I left before being seen, which was the fastest part.",
    "The chair was comfortable. I know because I lived there.",
    "Bring snacks, a charger, and a forwarding address.",
  ]),
  reviewDefinition("alert.review.poor-cleanliness", ["poor_cleanliness"], [
    "The dust bunny was seen before I was.",
    "The floor had a texture.",
    "Cleanliness appeared to be working remotely.",
    "The trash had been there long enough to establish residency.",
    "The hand sanitizer was the only reliable witness.",
  ]),
  reviewDefinition("alert.review.missing-amenities", ["missing_amenities"], [
    "The water cooler and I were both empty.",
    "The restroom was easy to find because it did not exist.",
    "The waiting room had everything except the things a waiting room has.",
  ]),
  reviewDefinition("alert.review.no-receptionist", ["no_receptionist"], [
    "The receptionist was imaginary, but very polite.",
    "I checked myself in. I assume I also owe myself a copay.",
    "No one knew I was there, including eventually me.",
  ]),
  reviewDefinition(
    "alert.review.imaging-unavailable",
    ["imaging_unavailable"],
    [
      "The X-ray room was beautiful. Shame it was decorative.",
      "I came for an X-ray and received directions to somewhere else.",
      "The imaging equipment and the imaging staff have apparently never met.",
    ],
  ),
  reviewDefinition("alert.review.general", ["general"], [
    "I expected care. I received character development.",
    "The plant was attentive.",
    "The parking experience was the clinical highlight.",
    "One star submitted successfully. Unlike my appointment.",
    "There was a clinic. I can confirm that much.",
    "Fast Wi-Fi. Slow everything else.",
  ]),
] as const;

export const PROTOTYPE_ALERT_SCHEDULING = {
  /**
   * Routine patient-attention rows stay quiet during brief waits. The
   * underlying condition must remain unresolved for strictly longer than this
   * many facility minutes before the feed records it.
   */
  patientAttentionDelayMinutes: 5,
  firstAmbientMinimumMinutes: 10,
  firstAmbientMaximumMinutes: 20,
  recurringAmbientMinimumMinutes: 45,
  recurringAmbientMaximumMinutes: 90,
  minimumAmbientSeparationMinutes: 30,
  // Keeps a newly emitted flavor line near the live portion of the mixed
  // feed long enough to be read without pinning it above later clinic events.
  ambientFeedRecencyBoostMinutes: 30,
  recentAmbientHistoryLimit: 10,
  recentReviewHistoryLimit: 10,
  dirtyClinicComplaintMinimumLitterItems: 2,
} as const;

/**
 * Domain events remain part of the campaign audit trail even when their
 * information is already clearer elsewhere in the interface. This policy
 * controls only the compact player-facing Alerts and Events feed.
 */
export const PROTOTYPE_PLAYER_FEED_POLICY = {
  suppressedEventTypes: [
    "operating_expense",
    "clinical_decision_recorded",
    "encounter_settled",
    "emergency_glp1_consultation",
    "development_money_added",
    "room_placed",
    "room_sold",
    "room_upgraded",
    "room_moved",
    "room_rotated",
    "door_placed",
    "door_removed",
    "litter_appeared",
    "litter_collected",
    "water_cooler_refilled",
  ],
  suppressedDefinitionIds: [
    "event.clinical.decision-correct",
    "alert.success.trash-cleaned",
    "alert.success.water-refilled",
  ],
} as const;

export function isPrototypeEventSuppressedFromPlayerFeed(
  eventType: string,
  definitionId?: string,
): boolean {
  return (
    PROTOTYPE_PLAYER_FEED_POLICY.suppressedEventTypes.some(
      (candidate) => candidate === eventType,
    ) ||
    (definitionId !== undefined &&
      PROTOTYPE_PLAYER_FEED_POLICY.suppressedDefinitionIds.some(
        (candidate) => candidate === definitionId,
      ))
  );
}

export const PROTOTYPE_ALERT_CONTENT: readonly PrototypeAlertDefinition[] = [
  ...BASE_PROTOTYPE_ALERT_DEFINITIONS.map(enrichBaseDefinition),
  ...CONTEXTUAL_AND_SUCCESS_ALERTS,
  ...PROTOTYPE_AMBIENT_ALERT_DEFINITIONS,
  ...PROTOTYPE_WALKOUT_REVIEW_DEFINITIONS,
];

/** Backward-compatible name for callers that consume the whole registry. */
export const PROTOTYPE_ALERT_DEFINITIONS = PROTOTYPE_ALERT_CONTENT;

export function getPrototypeAlertDefinition(
  definitionId: string,
): PrototypeAlertDefinition | undefined {
  return PROTOTYPE_ALERT_CONTENT.find(
    (definition) => definition.id === definitionId,
  );
}

export interface RenderedPrototypeAlert {
  definitionId: string;
  variantId: string;
  title: string;
  body: string;
}

function renderTemplate(
  template: string,
  values: Readonly<Record<string, string | number | null | undefined>>,
  fallbacks: Readonly<Record<string, string>>,
): string {
  return template.replace(
    /{{([a-z0-9_]+)}}/gi,
    (_match, key: string) => {
      const value = values[key];
      if (value !== null && value !== undefined && String(value).trim()) {
        return String(value);
      }
      return fallbacks[key] ?? "the clinic";
    },
  );
}

export function renderPrototypeAlert(
  definitionOrId: PrototypeAlertDefinition | string,
  values: Readonly<Record<string, string | number | null | undefined>> = {},
  variantId?: string,
): RenderedPrototypeAlert {
  const definition =
    typeof definitionOrId === "string"
      ? getPrototypeAlertDefinition(definitionOrId)
      : definitionOrId;
  if (!definition) {
    return {
      definitionId:
        typeof definitionOrId === "string"
          ? definitionOrId
          : "alert.unknown",
      variantId: "alert.unknown.fallback",
      title: "Clinic update",
      body: "The clinic has an update.",
    };
  }
  const variant =
    definition.variants.find((candidate) => candidate.id === variantId) ??
    definition.variants[0]!;
  return {
    definitionId: definition.id,
    variantId: variant.id,
    title: renderTemplate(
      variant.titleTemplate ?? definition.titleTemplate,
      values,
      definition.placeholderFallbacks,
    ),
    body: renderTemplate(
      variant.bodyTemplate,
      values,
      definition.placeholderFallbacks,
    ),
  };
}

export interface PrototypeAlertEligibilityContext {
  facilityLevel: 0 | 1;
  roomDefinitionIds: ReadonlySet<string>;
  objectIds: ReadonlySet<string>;
  hasCheckedInPatient: boolean;
}

export function isPrototypeAlertEligible(
  definition: PrototypeAlertDefinition,
  context: PrototypeAlertEligibilityContext,
): boolean {
  return definition.eligibility.every((condition) => {
    switch (condition.kind) {
      case "always":
        return true;
      case "facility_level":
        return condition.levels.includes(context.facilityLevel);
      case "room_exists":
        return context.roomDefinitionIds.has(condition.roomDefinitionId);
      case "object_exists":
        return context.objectIds.has(condition.objectId);
      case "checked_in_patient_exists":
        return context.hasCheckedInPatient;
    }
  });
}
