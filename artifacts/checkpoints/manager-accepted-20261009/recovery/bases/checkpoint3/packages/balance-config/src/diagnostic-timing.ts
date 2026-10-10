/**
 * Owner-approved October 7, 2026 editorial game minutes. These values are not
 * clinical turnaround claims. Only newly accepted, versioned work may use this
 * contract; persisted routes and phases remain authoritative for older work.
 */
export const DIAGNOSTIC_TIMING_VERSION = "diagnostic-timing.v1" as const;
export type DiagnosticTimingVersion = typeof DIAGNOSTIC_TIMING_VERSION;

export const DIAGNOSTIC_TIMING_TABLE = {
  version: DIAGNOSTIC_TIMING_VERSION,
  bladderScan: {
    offsiteTotalMinutes: 30,
    onsiteAcquisitionMinutes: 5,
    requiresInterpretation: false,
  },
  imaging: {
    offsiteInterpretationMinutes: 30,
    onsiteInterpretationMinutes: 5,
    acquisitionDurationSource: "existing_route",
    // Existing external imaging totals already include the interpretation.
    // Split that component; never append a second interpretation to the total.
    offsiteTotalIncludesInterpretation: true,
  },
  collectedLab: {
    offsiteTotalMinutes: 120,
    onsiteCollectionMinutes: 15,
    offsiteProcessingMinutes: 60,
    onsiteProcessingMinutes: 15,
  },
  pathology: {
    offsiteProcessingMinutes: 60,
    onsiteProcessingMinutes: 30,
    acquisitionDurationSource: "existing_procedure",
  },
  endoscopy: {
    careDurationSource: "approved_operation",
    visualResultAt: "procedure_complete",
    pathologyRequired: "only_if_specimen_collected",
    recoveryIndependentOfResult: true,
  },
  // Fixed approved phases do not inherit the old, unapproved speed modifiers.
  roomUpgradeDurationScaling: "none",
} as const;

export const DIAGNOSTIC_READING_ROOM_DEFINITION_ID = "room.reading";
export const DIAGNOSTIC_RADIOLOGIST_ROLE_ID = "staff.radiologist";

/**
 * Stable operational posts paired with the approved proof's original contacts.
 * Integer anchors are coarse-grid approaches; proof coordinates remain the
 * display contract and are not rounded into new furniture geometry.
 */
export const DIAGNOSTIC_READING_WORKSTATIONS = [
  {
    id: "northwest",
    staffAnchor: { x: 1, y: 1 },
    facing: "south",
    seatContact: { x: 1.30, y: 1.575 },
    chairGround: { x: 1.30, y: 1.95 },
    transition: { x: 1.30, y: 1.22 },
  },
  {
    id: "northeast",
    staffAnchor: { x: 3, y: 1 },
    facing: "west",
    seatContact: { x: 3.18, y: 1.515 },
    chairGround: { x: 3.18, y: 1.89 },
    transition: { x: 3.76, y: 1.70 },
  },
  {
    id: "southeast",
    staffAnchor: { x: 2, y: 2 },
    facing: "north",
    seatContact: { x: 2.64, y: 2.535 },
    chairGround: { x: 2.64, y: 2.91 },
    transition: { x: 2.64, y: 3.20 },
  },
  {
    id: "southwest",
    staffAnchor: { x: 0, y: 2 },
    facing: "east",
    seatContact: { x: 0.90, y: 2.685 },
    chairGround: { x: 0.90, y: 3.06 },
    transition: { x: 0.36, y: 2.82 },
  },
] as const;

export type DiagnosticReadingWorkstation = typeof DIAGNOSTIC_READING_WORKSTATIONS[number];

/** Required operational room/staff pairs, with queues scoped to employees. */
export const DIAGNOSTIC_TIMING_RESOURCES = {
  interpretation: {
    roomDefinitionId: DIAGNOSTIC_READING_ROOM_DEFINITION_ID,
    staffRoleDefinitionId: DIAGNOSTIC_RADIOLOGIST_ROLE_ID,
    roomCapabilityId: "capability.radiology_reading",
    staffCapabilityId: "capability.staff.radiologist",
    maximumConcurrentJobsPerEmployee: 1,
    maximumEmployeesPerRoom: 4,
    patientPresent: false,
  },
  collection: {
    roomDefinitionId: "room.phlebotomy",
    staffRoleDefinitionId: "staff.phlebotomist",
    roomCapabilityId: "capability.phlebotomy_collection",
    staffCapabilityId: "capability.staff.phlebotomist",
    maximumConcurrentJobsPerEmployee: 1,
    patientPresent: true,
  },
  processing: {
    roomDefinitionId: "room.laboratory",
    staffRoleDefinitionId: "staff.laboratory_technician",
    roomCapabilityId: "capability.in_house_laboratory",
    staffCapabilityId: "capability.staff.laboratory_technician",
    maximumConcurrentJobsPerEmployee: 1,
    patientPresent: false,
  },
} as const;

export type DiagnosticTimingResourceKind = keyof typeof DIAGNOSTIC_TIMING_RESOURCES;

export type DiagnosticTimingRule =
  | { readonly family: "bladder_scan" }
  | { readonly family: "imaging" }
  | { readonly family: "collected_lab"; readonly specimen: "blood" | "breath" }
  | { readonly family: "biopsy" }
  | { readonly family: "endoscopy"; readonly result: "visual" | "pathology" | "by_disposition" }
  | { readonly family: "component_workup" }
  | {
      readonly family: "retained";
      readonly reason: "specialist" | "planned_protocol" | "tissue_molecular" | "existing_procedure" | "tutorial";
    };

export type DiagnosticTimingFamily = DiagnosticTimingRule["family"];

const bladder = { family: "bladder_scan" } as const;
const imaging = { family: "imaging" } as const;
const bloodLab = { family: "collected_lab", specimen: "blood" } as const;
const breathLab = { family: "collected_lab", specimen: "breath" } as const;
const biopsy = { family: "biopsy" } as const;
const endoscopyByDisposition = { family: "endoscopy", result: "by_disposition" } as const;
const endoscopyWithPathology = { family: "endoscopy", result: "pathology" } as const;
const components = { family: "component_workup" } as const;
const specialist = { family: "retained", reason: "specialist" } as const;
const protocol = { family: "retained", reason: "planned_protocol" } as const;
const tissueMolecular = { family: "retained", reason: "tissue_molecular" } as const;
const existingProcedure = { family: "retained", reason: "existing_procedure" } as const;

/**
 * Exact IDs only. A family updates eligible timing phases, never clinical or
 * operational eligibility. Acquisition/procedure routes and exact-choice
 * dispositions still decide which work is supported. Mixed workups retain
 * their existing component dispositions and external/planned remainders.
 */
export const DIAGNOSTIC_SERVICE_TIMING_RULES = {
  "service.synthetic.analysis": { family: "retained", reason: "tutorial" },
  "service.xray": imaging,
  "service.ultrasound": imaging,
  "service.ct": imaging,
  "service.diagnostic_breast_imaging": components,
  "service.mammography": specialist,
  "service.breast_mri": specialist,
  "service.breast_core_needle_biopsy": biopsy,
  "service.breast_excisional_biopsy": biopsy,
  "service.basic_labs": bloodLab,
  "service.thyroid_fna": biopsy,
  "service.anoscopy": existingProcedure,
  "service.esophageal_manometry": specialist,
  "service.skin_excisional_biopsy": biopsy,
  "service.dxa": specialist,
  "service.mrcp": specialist,
  "service.hepatobiliary_contrast_mrcp": specialist,
  "service.ambulatory_reflux_monitoring": protocol,
  "service.tumor_mmr_ihc": tissueMolecular,
  "service.cutaneous_lesion_biopsy": biopsy,
  "service.laryngeal_examination": specialist,
  "service.contrast_swallow": imaging,
  "service.resting_abi": imaging,
  "service.rectal_response_assessment": components,
  "service.carotid_cta": imaging,
  "service.genetic_testing": bloodLab,
  "service.bidirectional_endoscopy": endoscopyByDisposition,
  "service.pelvic_mri": specialist,
  "service.anal_lesion_biopsy_staging": components,
  "service.venous_duplex": imaging,
  "service.hiv_hcv_serology": bloodLab,
  "service.gist_eus_core_molecular": tissueMolecular,
  "service.liver_mri": specialist,
  "service.mesenteric_cta": imaging,
  "service.primary_aldosteronism_screen": bloodLab,
  "service.colonoscopy": endoscopyByDisposition,
  "service.upper_endoscopy_duodenal_biopsy": endoscopyWithPathology,
  "service.extremity_mri": specialist,
  // Existing EUS sampling may be one component of a molecular workup; do not
  // replace that workup's whole external remainder with simple pathology.
  "service.endoscopy.eus-ercp-sampling": components,
  "service.interventional-radiology.percutaneous-transhepatic-biopsy": biopsy,
  "service.imaging.pet-ct": specialist,
  "service.imaging.repeat-mri-mrcp": specialist,
  "service.laboratory.repeat-ca19-9": specialist,
  "service.endoscopy": endoscopyByDisposition,
  "service.hs.heat-damaged-rbc-scintigraphy": specialist,
  "service.hs.sulfur-colloid-scintigraphy": specialist,
  "service.hs.noncontrast-abdominal-ct": imaging,
  "service.dynamic_defecography": specialist,
  "service.esophageal_multilevel_biopsy": endoscopyWithPathology,
  "service.h_pylori_urea_breath": breathLab,
  "service.ibc_biopsy_and_staging": components,
  "service.nipple_areolar_biopsy": biopsy,
  "service.endoanal_ultrasound": imaging,
  "service.bladder_scan": bladder,
} as const satisfies Readonly<Record<string, DiagnosticTimingRule>>;

export interface DiagnosticTimingProfileMapping {
  readonly rule: DiagnosticTimingRule;
  /**
   * A representative existing service for preview only. It never authorizes
   * execution or substitutes for a choice's explicit service/disposition.
   */
  readonly previewServiceId: string | null;
}

function profile(rule: DiagnosticTimingRule, previewServiceId: string | null = null): DiagnosticTimingProfileMapping {
  return { rule, previewServiceId };
}

/** Includes distractor profiles; no label/keyword inference is permitted. */
export const DIAGNOSTIC_PROFILE_TIMING_MAPPINGS = {
  "timing.test.basic_labs": profile(bloodLab, "service.basic_labs"),
  "timing.test.ultrasound": profile(imaging, "service.ultrasound"),
  "timing.test.ct": profile(imaging, "service.ct"),
  "timing.test.mri": profile(specialist),
  "timing.test.radiography": profile(imaging, "service.xray"),
  "timing.test.mammography": profile(specialist, "service.mammography"),
  "timing.test.biopsy": profile(biopsy),
  "timing.test.upper_endoscopy": profile(endoscopyByDisposition, "service.endoscopy"),
  "timing.test.lower_endoscopy": profile(endoscopyByDisposition, "service.colonoscopy"),
  "timing.test.endoscopy_with_sampling": profile(endoscopyWithPathology),
  "timing.test.advanced_diagnostic": profile(specialist),
  "timing.test.physiology": profile(specialist),
  "timing.test.nuclear_imaging": profile(specialist),
  "timing.test.genetic": profile(bloodLab, "service.genetic_testing"),
  "timing.test.metabolic_workup": profile(components),
  "timing.test.pathology_review": profile(tissueMolecular),
  "timing.test.clinical_procedure": profile(existingProcedure, "service.anoscopy"),
  "timing.test.general_diagnostic": profile(specialist),
  "timing.test.combined_diagnostic": profile(components),
  "timing.test.excisional_biopsy": profile(biopsy, "service.breast_excisional_biopsy"),
  "timing.test.breast_mri": profile(specialist, "service.breast_mri"),
  "timing.test.breast_core_biopsy": profile(biopsy, "service.breast_core_needle_biopsy"),
  "timing.test.four_hour_protocol": profile(protocol),
  "timing.test.twenty_four_hour_protocol": profile(protocol),
  "timing.test.dxa": profile(specialist, "service.dxa"),
  "timing.test.mrcp": profile(specialist, "service.mrcp"),
  "timing.test.laryngeal_examination": profile(specialist, "service.laryngeal_examination"),
  "timing.test.contrast_swallow": profile(imaging, "service.contrast_swallow"),
  "timing.test.vascular_physiology": profile(imaging, "service.resting_abi"),
  "timing.test.rectal_response_assessment": profile(components, "service.rectal_response_assessment"),
  "timing.test.ct_angiography": profile(imaging, "service.carotid_cta"),
  "timing.test.overnight_protocol": profile(protocol),
  "timing.test.pet_ct": profile(specialist, "service.imaging.pet-ct"),
  "timing.test.esophageal_manometry": profile(specialist, "service.esophageal_manometry"),
  "timing.test.image_guided_aspiration_culture": profile(components),
  "timing.test.gist_eus_core_molecular": profile(tissueMolecular, "service.gist_eus_core_molecular"),
  "timing.test.biopsy_staging": profile(components, "service.anal_lesion_biopsy_staging"),
  "timing.test.venous_duplex": profile(imaging, "service.venous_duplex"),
  "timing.test.viral_serology": profile(bloodLab, "service.hiv_hcv_serology"),
  "timing.test.bone_marrow": profile(specialist),
  "timing.test.mesenteric_cta": profile(imaging, "service.mesenteric_cta"),
  "timing.test.primary_aldosteronism_screen": profile(bloodLab, "service.primary_aldosteronism_screen"),
  "timing.test.adrenal_ct_avs": profile(components),
  "timing.test.hepatobiliary_contrast_mrcp": profile(specialist, "service.hepatobiliary_contrast_mrcp"),
  "timing.test.ambulatory_reflux_monitoring": profile(protocol, "service.ambulatory_reflux_monitoring"),
  "timing.test.tumor_mmr_ihc": profile(tissueMolecular, "service.tumor_mmr_ihc"),
  "timing.test.cutaneous_lesion_biopsy": profile(biopsy, "service.cutaneous_lesion_biopsy"),
  "timing.test.microbiology": profile(specialist),
  "timing.test.skin_surgery_histology": profile(biopsy),
  "timing.test.ercp": profile(specialist),
  "timing.test.therapeutic_ercp": profile(specialist),
  "timing.test.bile_leak_ercp": profile(specialist),
  "timing.test.pseudocyst_drainage": profile(specialist),
  "timing.test.adrenal_biopsy": profile(biopsy),
  "timing.test.anorectal_manometry": profile(specialist),
  "timing.test.breast_imaging_bundle": profile(components, "service.diagnostic_breast_imaging"),
  "timing.test.dexamethasone_suppression": profile(protocol),
  "timing.test.dynamic_defecography": profile(specialist, "service.dynamic_defecography"),
  "timing.test.echocardiography": profile(specialist),
  "timing.test.endoanal_ultrasound": profile(imaging, "service.endoanal_ultrasound"),
  "timing.test.esophageal_multilevel_biopsy": profile(endoscopyWithPathology, "service.esophageal_multilevel_biopsy"),
  "timing.test.h_pylori_breath": profile(breathLab, "service.h_pylori_urea_breath"),
  "timing.test.ibc_biopsy_and_staging": profile(components, "service.ibc_biopsy_and_staging"),
  "timing.test.nipple_areolar_biopsy": profile(biopsy, "service.nipple_areolar_biopsy"),
  "timing.test.ultrasound_guided_aspiration": profile(components),
  "timing.test.bladder_scan": profile(bladder, "service.bladder_scan"),
} as const satisfies Readonly<Record<string, DiagnosticTimingProfileMapping>>;

export function getDiagnosticTimingRuleForService(serviceId: string): DiagnosticTimingRule | undefined {
  return Object.hasOwn(DIAGNOSTIC_SERVICE_TIMING_RULES, serviceId)
    ? (DIAGNOSTIC_SERVICE_TIMING_RULES as Readonly<Record<string, DiagnosticTimingRule>>)[serviceId]
    : undefined;
}

export function getDiagnosticTimingProfileMapping(timingProfileId: string): DiagnosticTimingProfileMapping | undefined {
  return Object.hasOwn(DIAGNOSTIC_PROFILE_TIMING_MAPPINGS, timingProfileId)
    ? (DIAGNOSTIC_PROFILE_TIMING_MAPPINGS as Readonly<Record<string, DiagnosticTimingProfileMapping>>)[timingProfileId]
    : undefined;
}

export function getDiagnosticTimingRuleForProfile(timingProfileId: string): DiagnosticTimingRule | undefined {
  return getDiagnosticTimingProfileMapping(timingProfileId)?.rule;
}
