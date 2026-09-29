import { ANSWER_CHOICE_TIMING_REGISTRY, type DecisionNode } from "@gamify-surgery/clinical-content";
import type { EncounterState } from "./types";

export type TestChoiceOrderDisposition =
  | {
      kind: "result_gate_route_override" | "terminal_service";
      serviceId: string;
      allowedRouteIds: readonly string[];
      externalRemainder?: string;
    }
  | {
      kind: "test_only_continuation";
      serviceId: string;
      allowedRouteIds: readonly string[];
      externalRemainder: string;
    }
  | {
      kind: "staged_result_gate";
      remainderMode: "external_patient_visit" | "external_processing";
      components: readonly {
        componentId: string;
        serviceId: string;
        allowedRouteIds: readonly string[];
        externalRemainder: string;
      }[];
    }
  | {
      kind: "existing_terminal_procedure";
    }
  | {
      kind: "not_executed";
      reason:
        | "future_planned"
        | "specialist_or_unsupported_service"
        | "combined_nonblood_protocol"
        | "external_only";
    };

export interface ExactTestChoiceOrderRecord {
  caseId: string;
  nodeId: string;
  questionVariantId: string;
  choiceId: string;
  choiceLabel: string;
  timingProfileId: string;
  disposition: TestChoiceOrderDisposition;
}

function record(
  caseId: string,
  nodeId: string,
  questionVariantId: string,
  choiceId: string,
  choiceLabel: string,
  timingProfileId: string,
  disposition: TestChoiceOrderDisposition,
): ExactTestChoiceOrderRecord {
  return { caseId, nodeId, questionVariantId, choiceId, choiceLabel, timingProfileId, disposition };
}

const terminalService = (
  caseId: string,
  nodeId: string,
  questionVariantId: string,
  choiceId: string,
  choiceLabel: string,
  timingProfileId: string,
  serviceId: string,
  allowedRouteIds: readonly string[],
  externalRemainder?: string,
) => record(caseId, nodeId, questionVariantId, choiceId, choiceLabel, timingProfileId, {
  kind: "terminal_service",
  serviceId,
  allowedRouteIds,
  ...(externalRemainder ? { externalRemainder } : {}),
});

const gateOverride = (
  caseId: string,
  nodeId: string,
  questionVariantId: string,
  choiceId: string,
  choiceLabel: string,
  timingProfileId: string,
  serviceId: string,
  allowedRouteIds: readonly string[],
) => record(caseId, nodeId, questionVariantId, choiceId, choiceLabel, timingProfileId, {
  kind: "result_gate_route_override",
  serviceId,
  allowedRouteIds,
});

const stagedGate = (
  caseId: string,
  nodeId: string,
  questionVariantId: string,
  choiceId: string,
  choiceLabel: string,
  timingProfileId: string,
  remainderMode: Extract<TestChoiceOrderDisposition, { kind: "staged_result_gate" }>["remainderMode"],
  components: Extract<TestChoiceOrderDisposition, { kind: "staged_result_gate" }>["components"],
) => record(caseId, nodeId, questionVariantId, choiceId, choiceLabel, timingProfileId, {
  kind: "staged_result_gate",
  remainderMode,
  components,
});

const terminalServices: ExactTestChoiceOrderRecord[] = [
  terminalService("case.gs028.primary-midline-hernia.a-uncertain-deep-bulge", "node.gs028.primary-midline-hernia.a-uncertain-deep-bulge.1", "question.umbilical-epigastric-hernia.clinical-recognition.v3", "correct_3", "Targeted abdominal-wall ultrasound", "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"]),
  terminalService("case.gs028.varicose-veins.a-recurrent-after-prior-care", "node.gs028.varicose-veins.a-recurrent-after-prior-care.1", "question.varicose-veins.reflux-duplex-evaluation.v3", "correct_3", "Comprehensive venous reflux duplex", "timing.test.venous_duplex", "service.venous_duplex", ["route.venous_duplex.in_house", "route.venous_duplex.outsourced"]),
  terminalService("case.gs028.varicose-veins.a-asymmetric-branches", "node.gs028.varicose-veins.a-asymmetric-branches.1", "question.varicose-veins.reflux-duplex-evaluation.v4", "correct_4", "Venous duplex with reflux assessment", "timing.test.venous_duplex", "service.venous_duplex", ["route.venous_duplex.in_house", "route.venous_duplex.outsourced"]),
  terminalService("case.mondor-disease.uncertain-targeted-ultrasound", "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1", "question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1", "targeted_doppler_ultrasound", "Targeted Doppler ultrasound", "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"]),
  terminalService("case.fhh.suggestive-results-confirmation", "node.fhh.suggestive-results-confirmation.v1", "question.fhh.suggestive-results-confirmation.v1", "suspect_fhh_genetic_testing", "Suspect FHH and arrange genetic testing", "timing.test.genetic", "service.genetic_testing", ["route.genetic_testing.phlebotomy_sendout", "route.genetic_testing.outsourced"]),
  terminalService("case.graves-trab-diagnostic-support.v1", "node.graves-trab-diagnostic-support.v1", "question.graves-trab-diagnostic-support.v1", "answer.graves-trab-diagnostic-support.v1.4", "TRAb measurement", "timing.test.basic_labs", "service.basic_labs", ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]),
  ...["progressive-features", "hypertension-review", "bone-health-referral", "diabetes-review"].map((slug, index) =>
    terminalService(`case.cushing-classification.${slug}`, `node.cushing-classification.${slug}.2`, `question.cushing.suppressed-acth-adrenal-imaging.v${index + 1}`, `adrenal_ct_next_${index + 1}`, "Adrenal CT", "timing.test.ct", "service.ct", ["route.ct.in_house", "route.ct.outsourced"]),
  ),
  ...["lung-cancer-mass", "melanoma-mass", "renal-cancer-mass", "colon-cancer-mass"].map((slug, index) =>
    terminalService(`case.adrenal-incidentaloma.${slug}`, `node.adrenal-incidentaloma.${slug}.1`, `question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v${index + 1}`, `metanephrines_${index + 1}`, "Plasma-free metanephrines", "timing.test.basic_labs", "service.basic_labs", ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]),
  ),
  ...[
    ["recurrent-flank-pain", "1"],
    ["uncertain-ureteral-stone", "2"],
    ["prior-stone-new-pain", "3"],
    ["hematuria-colic", "4"],
  ].map(([slug, number]) =>
    terminalService(`case.nephrolithiasis.${slug}`, `node.nephrolithiasis.${slug}.2`, `question.nephrolithiasis.recurrent-metabolic-evaluation.v${number}`, `stone_metabolic_${number}`, "Stone analysis with serum studies and 24-hour urine testing", "timing.test.twenty_four_hour_protocol", "service.basic_labs", ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"], "Stone analysis and 24-hour urine testing remain external or take-home components."),
  ),
  ...["resistant-three-drugs", "early-stroke-risk", "headache-free", "family-pressure"].map((slug, index) =>
    terminalService(`case.primary-aldosteronism.${slug}`, `node.primary-aldosteronism.${slug}.2`, `question.primary-aldosteronism.ct-avs-lateralization.v${index + 1}`, `ct_avs_${index + 1}`, "Adrenal CT with venous sampling", "timing.test.adrenal_ct_avs", "service.ct", ["route.ct.in_house", "route.ct.outsourced"], "Adrenal venous sampling remains an external specialty component."),
  ),
  ...["crusted-nipple", "nipple-erosion", "areolar-rash", "scaly-nipple"].map((slug, index) =>
    terminalService(`case.mammary-paget.${slug}`, `node.mammary-paget.${slug}.2`, `question.mammary-paget.underlying-breast-evaluation.v${index + 1}`, `mammo_us_${index + 1}`, "Mammography with ultrasound", "timing.test.breast_imaging_bundle", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"], "Mammography remains an external component."),
  ),
  ...["obstetric-injury", "prior-anorectal-injury", "sphincter-concern", "repair-consult"].map((slug, index) =>
    terminalService(`case.fecal-incontinence.${slug}`, `node.fecal-incontinence.${slug}.1`, `question.fecal-incontinence.endoanal-ultrasound-repair-planning.v${index + 1}`, `eaus_${index + 1}`, "Endoanal ultrasound", "timing.test.endoanal_ultrasound", "service.endoanal_ultrasound", ["route.endoanal_ultrasound.in_house", "route.endoanal_ultrasound.outsourced"]),
  ),
  ...[
    ["adult-man-fatigue", "1"],
    ["postmenopausal-dyspnea", "2"],
    ["adult-man-donation", "3"],
    ["postmenopausal-checkup", "4"],
  ].map(([slug, number]) =>
    terminalService(`case.iron-deficiency.${slug}`, `node.iron-deficiency.${slug}.2`, `question.iron-deficiency.gi-evaluation.v${number}`, `bidirectional_${number}`, "Bidirectional endoscopy", "timing.test.upper_endoscopy", "service.bidirectional_endoscopy", ["route.bidirectional_endoscopy.in_house", "route.bidirectional_endoscopy.outsourced"]),
  ),
];

const gateRouteOverrides: ExactTestChoiceOrderRecord[] = [
  ...["new-parent", "sibling-history", "screening-call", "rectal-burden"].map((slug, index) =>
    gateOverride(`case.fap.${slug}`, `node.fap.${slug}.1`, `question.fap.germline-testing-after-diffuse-adenomas.v${index + 1}`, `panel_${index + 1}`, "Germline polyposis panel", "timing.test.genetic", "service.genetic_testing", ["route.genetic_testing.phlebotomy_sendout", "route.genetic_testing.outsourced"]),
  ),
  ...["retinal-event", "hand-weakness", "speech-event", "curtain-vision"].map((slug, index) =>
    gateOverride(`case.carotid-stenosis.${slug}`, `node.carotid-stenosis.${slug}.1`, `question.carotid-stenosis.confirmatory-vascular-imaging.v${index + 1}`, `carotid_cta_${index + 1}`, "CT angiography of the neck", "timing.test.ct_angiography", "service.carotid_cta", ["route.carotid_cta.in_house", "route.carotid_cta.outsourced"]),
  ),
  ...["colectomy", "hernia-repair", "bowel-surgery", "postop-visit"].map((slug, index) =>
    gateOverride(`case.postoperative-dvt.${slug}`, `node.postoperative-dvt.${slug}.1`, `question.postoperative-dvt.venous-duplex.v${index + 1}`, `duplex_${index + 1}`, "Venous duplex ultrasound", "timing.test.venous_duplex", "service.venous_duplex", ["route.venous_duplex.in_house", "route.venous_duplex.outsourced"]),
  ),
  ...["four-month", "six-month", "hematology-followup", "stable-count"].map((slug, index) =>
    gateOverride(`case.persistent-itp.${slug}`, `node.persistent-itp.${slug}.1`, `question.persistent-itp.hiv-hcv-secondary-evaluation.v${index + 1}`, `viral_serology_${index + 1}`, "HIV and HCV serology", "timing.test.viral_serology", "service.hiv_hcv_serology", ["route.hiv_hcv_serology.phlebotomy_sendout", "route.hiv_hcv_serology.outsourced"]),
  ),
  ...["meal-pain", "small-meals", "restaurant-pain", "food-fear"].map((slug, index) =>
    gateOverride(`case.chronic-mesenteric-ischemia.${slug}`, `node.chronic-mesenteric-ischemia.${slug}.1`, `question.chronic-mesenteric-ischemia.cta-diagnosis.v${index + 1}`, `cta_${index + 1}`, "Mesenteric CT angiography", "timing.test.mesenteric_cta", "service.mesenteric_cta", ["route.mesenteric_cta.in_house", "route.mesenteric_cta.outsourced"]),
  ),
  ...["resistant-three-drugs", "early-stroke-risk", "headache-free", "family-pressure"].map((slug, index) =>
    gateOverride(`case.primary-aldosteronism.${slug}`, `node.primary-aldosteronism.${slug}.1`, `question.primary-aldosteronism.prepared-arr-screening.v${index + 1}`, `arr_${index + 1}`, "Aldosterone-renin ratio screening", "timing.test.primary_aldosteronism_screen", "service.primary_aldosteronism_screen", ["route.primary_aldosteronism_screen.phlebotomy_sendout", "route.primary_aldosteronism_screen.outsourced"]),
  ),
  ...["chronic-diarrhea", "iron-deficiency-symptoms", "weight-loss-discomfort", "family-history"].map((slug, index) =>
    gateOverride(`case.celiac.${slug}`, `node.celiac.${slug}.2`, `question.celiac.duodenal-biopsy-confirmation.v${index + 1}`, `endoscopy_biopsy_${index + 1}`, "Arrange upper endoscopy with duodenal biopsies", "timing.test.endoscopy_with_sampling", "service.upper_endoscopy_duodenal_biopsy", ["route.upper_endoscopy_duodenal_biopsy.in_house", "route.upper_endoscopy_duodenal_biopsy.outsourced"]),
  ),
  ...["routine-screen", "mailed-fit", "preventive-visit", "repeat-screening"].map((slug, index) =>
    gateOverride(`case.colorectal.${slug}`, `node.colorectal.${slug}.1`, `question.colorectal.positive-fit-colonoscopy.v${index + 1}`, `colonoscopy_${index + 1}`, "Diagnostic colonoscopy", "timing.test.lower_endoscopy", "service.colonoscopy", ["route.colonoscopy.in_house", "route.colonoscopy.outsourced"]),
  ),
  ...["drained-abscess", "hospital-followup", "ct-resolved", "recovery-visit"].map((slug, index) =>
    gateOverride(`case.recovered-diverticulitis.${slug}`, `node.recovered-diverticulitis.${slug}.1`, `question.recovered-diverticulitis.interval-colonoscopy.v${index + 1}`, `colonoscopy_${index + 1}`, "Colonoscopy", "timing.test.lower_endoscopy", "service.colonoscopy", ["route.colonoscopy.in_house", "route.colonoscopy.outsourced"]),
  ),
  ...["meat-sticks", "slow-eating", "bread-sticks", "chews-carefully"].map((slug, index) =>
    gateOverride(`case.eoe.${slug}`, `node.eoe.${slug}.1`, `question.eoe.multilevel-esophageal-biopsies.v${index + 1}`, `egd_biopsy_${index + 1}`, "Endoscopy with biopsies", "timing.test.esophageal_multilevel_biopsy", "service.esophageal_multilevel_biopsy", ["route.esophageal_multilevel_biopsy.in_house", "route.esophageal_multilevel_biopsy.outsourced"]),
  ),
  ...["regurgitated-food", "neck-gurgle", "night-regurgitation", "meal-cough"].map((slug, index) =>
    gateOverride(`case.zenker-diverticulum.${slug}`, `node.zenker-diverticulum.${slug}.1`, `question.zenker-diverticulum.contrast-swallow.v${index + 1}`, `contrast_swallow_${index + 1}`, "Barium swallow", "timing.test.contrast_swallow", "service.contrast_swallow", ["route.contrast_swallow.in_house", "route.contrast_swallow.outsourced"]),
  ),
  ...["mail-route", "warehouse-walk", "grocery-trip", "park-walking"].map((slug, index) =>
    gateOverride(`case.peripheral-arterial-disease.${slug}`, `node.peripheral-arterial-disease.${slug}.1`, `question.peripheral-arterial-disease.resting-abi.v${index + 1}`, `resting_abi_${index + 1}`, "Resting ankle-brachial index", "timing.test.vascular_physiology", "service.resting_abi", ["route.resting_abi.in_house", "route.resting_abi.outsourced"]),
  ),
  ...[["medial-gaiter", "0"], ["recurrent-ulcer", "1"], ["varicose-changes", "2"], ["healed-edge", "3"]].map(([slug, choice], index) =>
    gateOverride(`case.venous-leg-ulcer.${slug}`, `node.venous-leg-ulcer.${slug}.1`, `question.venous-leg-ulcer.arterial-assessment-before-compression.v${index + 1}`, `abi_${choice}`, "Ankle-brachial index", "timing.test.vascular_physiology", "service.resting_abi", ["route.resting_abi.in_house", "route.resting_abi.outsourced"]),
  ),
  ...["crusted-nipple", "nipple-erosion", "areolar-rash", "scaly-nipple"].map((slug, index) =>
    gateOverride(`case.mammary-paget.${slug}`, `node.mammary-paget.${slug}.1`, `question.mammary-paget.full-thickness-biopsy.v${index + 1}`, `full_thickness_${index + 1}`, "Full-thickness punch biopsy", "timing.test.nipple_areolar_biopsy", "service.nipple_areolar_biopsy", ["route.nipple_areolar_biopsy.in_house", "route.nipple_areolar_biopsy.outsourced"]),
  ),
  ...["duodenal-ulcer", "night-pain", "healed-ulcer", "epigastric-pain"].map((slug, index) =>
    gateOverride(`case.h-pylori-ulcer.${slug}`, `node.h-pylori-ulcer.${slug}.1`, `question.h-pylori-ulcer.active-infection-testing.v${index + 1}`, `breath_${index + 1}`, "Urea breath test", "timing.test.h_pylori_breath", "service.h_pylori_urea_breath", ["route.h_pylori_urea_breath.in_house", "route.h_pylori_urea_breath.outsourced"]),
  ),
];

const stagedResultGates: ExactTestChoiceOrderRecord[] = [
  ...["bleeding-lesion", "new-mass", "clinic-exam", "persistent-ulcer"].map((slug, index) =>
    stagedGate(`case.anal-squamous-cell-cancer.${slug}`, `node.anal-squamous-cell-cancer.${slug}.1`, `question.anal-scc.biopsy-and-staging.v${index + 1}`, `biopsy_staging_${index + 1}`, "Biopsy with ordered staging", "timing.test.biopsy_staging", "external_patient_visit", [{ componentId: "ct_acquisition", serviceId: "service.ct", allowedRouteIds: ["route.ct.in_house"], externalRemainder: "Biopsy, pathology, and pelvic MRI remain outside this CT acquisition." }]),
  ),
  ...[
    ["case.mondor-disease.full-pathway", "node.mondor-disease.evaluation.diagnostic-breast-imaging.full-pathway"],
    ["case.mondor-disease.evaluation-and-management", "node.mondor-disease.evaluation.diagnostic-breast-imaging.evaluation-and-management"],
  ].map(([caseId, nodeId]) =>
    stagedGate(caseId!, nodeId!, "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1", "diagnostic_mammography_or_dbt_and_targeted_ultrasound", "Diagnostic mammography and targeted Doppler ultrasound", "timing.test.mammography", "external_patient_visit", [{ componentId: "targeted_ultrasound", serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.in_house"], externalRemainder: "Diagnostic mammography or tomosynthesis remains an outside component." }]),
  ),
  ...["posterior-fundus-mass", "cardia-mass", "greater-curve-mass", "lesser-curve-mass"].map((slug, index) =>
    stagedGate(`case.gastric-gist.${slug}`, `node.gastric-gist.${slug}.1`, `question.gastric-gist.eus-core-molecular-diagnosis.v${index + 1}`, `eus_core_${index + 1}`, "EUS core biopsy with molecular testing", "timing.test.gist_eus_core_molecular", "external_processing", [{ componentId: "eus_sampling", serviceId: "service.endoscopy.eus-ercp-sampling", allowedRouteIds: ["route.endoscopy.eus-ercp-sampling.in_house"], externalRemainder: "Pathology and molecular testing remain external after local EUS-guided sampling." }]),
  ),
  ...["teacher-followup", "caregiver-followup", "cyclist-followup", "accountant-followup"].map((slug, index) =>
    stagedGate(`case.rectal-cancer.${slug}`, `node.rectal-cancer.${slug}.1`, `question.rectal-cancer.multimodal-response-assessment.v${index + 1}`, `multimodal_response_${index + 1}`, "DRE, endoscopy, and rectal MRI", "timing.test.rectal_response_assessment", "external_patient_visit", [{ componentId: "endoscopic_assessment", serviceId: "service.endoscopy", allowedRouteIds: ["route.endoscopy.in_house"], externalRemainder: "Rectal MRI and the remaining multimodal assessment stay outside the local endoscopy episode." }]),
  ),
];

const testOnlyContinuations: ExactTestChoiceOrderRecord[] = [
  record(
    "case.fhh.evaluation-to-confirmed-management",
    "node.fhh.initial-biochemical-evaluation.v1",
    "question.fhh.initial-biochemical-evaluation.v1",
    "paired_24h_urine_serum_values",
    "24-hour urine calcium and creatinine with paired serum values",
    "timing.test.twenty_four_hour_protocol",
    {
      kind: "test_only_continuation",
      serviceId: "service.basic_labs",
      allowedRouteIds: ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"],
      externalRemainder: "The 24-hour urine and later family/genetic follow-up remain outside this blood-collection visit.",
    },
  ),
];

const explicitNonExecutionRecords: ExactTestChoiceOrderRecord[] = [
  record("case.l2.gastroparesis.general-confirmatory-testing.v1", "node.gastroparesis.general-confirmatory-testing.v1", "question.gastroparesis.general-confirmatory-testing.v1", "four_hour_solid_meal_scintigraphy", "Four-hour solid-meal gastric emptying scintigraphy", "timing.test.four_hour_protocol", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.l2.gastroparesis.diabetes-confirmatory-testing.v1", "node.gastroparesis.diabetes-confirmatory-testing.v1", "question.gastroparesis.diabetes-confirmatory-testing.v1", "four_hour_standardized_meal_scintigraphy", "Four-hour scintigraphy after a standardized solid meal", "timing.test.four_hour_protocol", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.l2.gastroparesis.postsurgical-confirmatory-testing.v1", "node.gastroparesis.postsurgical-confirmatory-testing.v1", "question.gastroparesis.postsurgical-confirmatory-testing.v1", "four_hour_solid_meal_scintigraphy", "Four-hour solid-meal gastric emptying scintigraphy", "timing.test.four_hour_protocol", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.soft-tissue-mass.deep-thigh", "node.soft-tissue-mass.deep-thigh.2", "question.soft-tissue-mass.specialist-planned-biopsy.v1", "sarcoma_core_1", "Sarcoma-team-planned image-guided core biopsy", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.soft-tissue-mass.upper-arm", "node.soft-tissue-mass.upper-arm.2", "question.soft-tissue-mass.specialist-planned-biopsy.v2", "sarcoma_core_2", "Sarcoma-team-planned image-guided core biopsy", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.soft-tissue-mass.calf-indeterminate", "node.soft-tissue-mass.calf-indeterminate.2", "question.soft-tissue-mass.specialist-planned-biopsy.v3", "sarcoma_core_3", "Sarcoma-team-planned image-guided core biopsy", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.soft-tissue-mass.forearm-progressive", "node.soft-tissue-mass.forearm-progressive.2", "question.soft-tissue-mass.specialist-planned-biopsy.v4", "sarcoma_core_4", "Sarcoma-team-planned image-guided core biopsy", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  ...[
    ["changing-back-lesion", "1"], ["shoulder-border", "2"], ["calf-growth", "3"], ["forearm-change", "4"],
  ].map(([slug, number]) => record(`case.pigmented-skin-lesion.${slug}`, `node.pigmented-skin-lesion.${slug}.2`, `question.melanoma.sentinel-node-staging.v${number}`, `sentinel_node_${number}`, "Sentinel lymph-node biopsy with definitive excision", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  ...[
    ["episodic-pain", "0", "1"], ["abnormal-labs", "1", "2"], ["dilated-duct", "2", "3"], ["resolved-colic", "3", "4"],
  ].map(([slug, choiceNumber, version]) => record(`case.choledocholithiasis.${slug}`, `node.choledocholithiasis.${slug}.2`, `question.choledocholithiasis.confirmed-stone-therapy.v${version}`, `therapeutic_ercp_${choiceNumber}`, "Refer for therapeutic ERCP", "timing.test.therapeutic_ercp", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  ...[
    ["drain-output", "0", "1"], ["painful-recovery", "1", "2"], ["delayed-recovery", "2", "3"], ["outside-followup", "3", "4"],
  ].map(([slug, choiceNumber, version]) => record(`case.post-cholecystectomy-bile-leak.${slug}`, `node.post-cholecystectomy-bile-leak.${slug}.2`, `question.bile-leak.minor-leak-ercp-stent.v${version}`, `ercp_stent_${choiceNumber}`, "Refer for ERCP with stent", "timing.test.bile_leak_ercp", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  ...[
    ["early-satiety", "0", "1"], ["postmeal-vomiting", "1", "2"], ["persistent-pain", "2", "3"], ["reduced-intake", "3", "4"],
  ].map(([slug, choiceNumber, version]) => record(`case.pancreatic-pseudocyst.${slug}`, `node.pancreatic-pseudocyst.${slug}.2`, `question.pseudocyst.symptomatic-endoscopic-drainage.v${version}`, `drain_${choiceNumber}`, "Refer for EUS-guided drainage", "timing.test.pseudocyst_drainage", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  ...[
    ["persistent-heartburn", "0", "1"], ["night-reflux", "1", "2"], ["medication-concerns", "2", "3"], ["reflux-referral", "3", "4"],
  ].map(([slug, choiceNumber, version]) => record(`case.preoperative-gerd.${slug}`, `node.preoperative-gerd.${slug}.2`, `question.gerd.hrm-before-operative-planning.v${version}`, `hrm_final_${choiceNumber}`, "High-resolution manometry", "timing.test.esophageal_manometry", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  record("case.cutaneous-scc.forearm-low", "node.cutaneous-scc.forearm-low.2", "question.cutaneous-scc.risk-directed-surgery.v1", "excision_0", "Standard excision", "timing.test.skin_surgery_histology", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.cutaneous-scc.trunk-low", "node.cutaneous-scc.trunk-low.2", "question.cutaneous-scc.risk-directed-surgery.v2", "excision_1", "Standard excision", "timing.test.skin_surgery_histology", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.cutaneous-scc.ear-high", "node.cutaneous-scc.ear-high.2", "question.cutaneous-scc.risk-directed-surgery.v3", "mohs_2", "Refer for Mohs surgery", "timing.test.skin_surgery_histology", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  record("case.cutaneous-scc.recurrent-high", "node.cutaneous-scc.recurrent-high.2", "question.cutaneous-scc.risk-directed-surgery.v4", "mohs_3", "Refer for Mohs surgery", "timing.test.skin_surgery_histology", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
  ...[
    ["incidental-left-nodule", "1"], ["incidental-right-nodule", "2"], ["lipid-rich-mass", "3"], ["small-adrenal-adenoma", "4"],
  ].map(([slug, number]) => record(`case.adrenal-incidentaloma.${slug}`, `node.adrenal-incidentaloma.${slug}.1`, `question.adrenal-incidentaloma.one-mg-dst.v${number}`, `dst_${number}`, "Overnight dexamethasone test", "timing.test.dexamethasone_suppression", { kind: "not_executed", reason: "future_planned" })),
  record("case.gallbladder-polyp.8mm-thick-stalk", "node.gallbladder-polyp.8mm-thick-stalk.v1", "question.gallbladder-polyp.8mm-thick-stalk.v1", "ultrasound_surveillance", "Ultrasound surveillance for this patient", "timing.test.ultrasound", { kind: "not_executed", reason: "future_planned" }),
  ...[
    ["duodenal-ulcer", "1"], ["night-pain", "2"], ["healed-ulcer", "3"], ["epigastric-pain", "4"],
  ].map(([slug, number]) => record(`case.h-pylori-ulcer.${slug}`, `node.h-pylori-ulcer.${slug}.2`, `question.h-pylori-ulcer.test-of-cure-plan.v${number}`, `delayed_active_${number}`, "Breath test ≥4 weeks after antibiotics", "timing.test.h_pylori_breath", { kind: "not_executed", reason: "future_planned" })),
];

const existingTerminalProcedureRecords: ExactTestChoiceOrderRecord[] = [
  ...[
    ["tender-upper-breast", "1"], ["persistent-mass", "2"], ["focal-redness", "3"], ["nursing-pain", "4"],
  ].map(([slug, number]) => record(`case.lactational-breast-abscess.${slug}`, `node.lactational-breast-abscess.${slug}.2`, `question.lactational-breast-abscess.selected-drainage.v${number}`, `guided_aspiration_${number}`, "Image-guided aspiration with fluid culture", "timing.test.image_guided_aspiration_culture", { kind: "existing_terminal_procedure" })),
];

export const EXACT_TEST_CHOICE_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = [
  ...terminalServices,
  ...gateRouteOverrides,
  ...stagedResultGates,
  ...testOnlyContinuations,
  ...explicitNonExecutionRecords,
  ...existingTerminalProcedureRecords,
];

const recordByExactKey = new Map(
  EXACT_TEST_CHOICE_ORDER_RECORDS.map((entry) => [
    `${entry.caseId}|${entry.nodeId}|${entry.questionVariantId}|${entry.choiceId}`,
    entry,
  ]),
);

export function getExactTestChoiceOrderRecord(
  encounter: EncounterState,
  node: DecisionNode,
  choiceId: string,
): ExactTestChoiceOrderRecord | null {
  const choice = node.answerChoices.find((candidate) => candidate.id === choiceId);
  if (!choice) return null;
  const entry = recordByExactKey.get(
    `${encounter.frozenCase.id}|${node.id}|${node.questionVariantId}|${choice.id}`,
  );
  if (!entry || entry.choiceLabel !== choice.label) return null;
  const timingEntry = ANSWER_CHOICE_TIMING_REGISTRY.find(
    (candidate) =>
      candidate.caseId === encounter.frozenCase.id &&
      candidate.nodeId === node.id &&
      candidate.questionVariantId === node.questionVariantId,
  );
  if (timingEntry?.classification.kind !== "test_choices") return null;
  const timing = timingEntry.classification.choices.find(
    (candidate) => candidate.choiceId === choice.id && candidate.choiceLabel === choice.label,
  )?.timing;
  return timing?.kind === "test" && timing.timingProfileId === entry.timingProfileId
    ? entry
    : null;
}
