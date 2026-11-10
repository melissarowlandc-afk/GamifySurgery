// BEGIN N2 ROUND3 exact-order import
import { QUESTION_NEW_N2_ROUND3_TEST_ORDER_RECORDS } from "./question-new-n2-round3-test-orders";
// END N2 ROUND3 exact-order import
// BEGIN BATCH2B ROUND2 exact orders
import { QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS } from "./question-bank-batch2b-round2-test-orders";
// END BATCH2B ROUND2 exact orders
// BEGIN N1 ROUND3 exact-order import
import { QUESTION_NEW_N1_ROUND3_TEST_ORDER_RECORDS } from "./question-new-n1-round3-test-orders";
// END N1 ROUND3 exact-order import
// BEGIN BATCH2A ROUND3 exact orders
import { QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS } from "./question-bank-batch2a-round3-test-orders";
// END BATCH2A ROUND3 exact orders
// BEGIN N2 ROUND2 append — separate external-only exact records.
import { QUESTION_NEW_N2_ROUND2_TEST_ORDER_RECORDS } from "./question-new-n2-round2-test-orders";
// END N2 ROUND2 append.
// BEGIN BATCH2B exact orders
import { QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS } from "./question-bank-batch2b-test-orders";
// END BATCH2B exact orders
import { ANSWER_CHOICE_TIMING_REGISTRY, GS028_20261007_LEVEL3_TIMING_ENTRIES, VARIETY3_TIMING_ENTRIES, type DecisionNode } from "@gamify-surgery/clinical-content";
import type { EncounterState } from "./types";
import { QUESTION_NEW_N1_TEST_ORDER_RECORDS } from "./question-new-n1-test-orders";
// BEGIN N2 append — standalone helper owns new exact external-only records.
import { QUESTION_NEW_N2_TEST_ORDER_RECORDS } from "./question-new-n2-test-orders";
// END N2 append.

// BEGIN N1 ROUND2 append — separate exact external-only version records.
import { QUESTION_NEW_N1_ROUND2_TEST_ORDER_RECORDS } from "./question-new-n1-round2-test-orders";
// END N1 ROUND2 append.

export type TestChoiceOrderDisposition =
  | {
      kind: "result_gate_route_override" | "terminal_service";
      serviceId: string;
      allowedRouteIds: readonly string[];
      /** Preserve exact external-only routing when an onsite equivalent exists. */
      allowOnsiteEquivalents?: boolean;
      externalRemainder?: string;
      externalRemainderMode?: "external_patient_visit" | "external_processing" | "retained_protocol";
    }
  | {
      kind: "test_only_continuation";
      serviceId: string;
      allowedRouteIds: readonly string[];
      externalRemainder: string;
      externalRemainderMode?: "external_patient_visit" | "external_processing" | "retained_protocol";
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
  externalRemainderMode: "external_patient_visit" | "external_processing" | "retained_protocol" = "retained_protocol",
) => record(caseId, nodeId, questionVariantId, choiceId, choiceLabel, timingProfileId, {
  kind: "terminal_service",
  serviceId,
  allowedRouteIds,
  ...(externalRemainder ? { externalRemainder, externalRemainderMode } : {}),
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
  allowOnsiteEquivalents = true,
) => record(caseId, nodeId, questionVariantId, choiceId, choiceLabel, timingProfileId, {
  kind: "result_gate_route_override",
  serviceId,
  allowedRouteIds,
  ...(allowOnsiteEquivalents ? {} : { allowOnsiteEquivalents: false }),
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
  terminalService("case.gs028b.differentiated-thyroid-cancer.a-molecular-malignancy", "node.gs028b.differentiated-thyroid-cancer.a-molecular-malignancy.1", "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2", "correct_2", "Cervical-node ultrasound", "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"]),
  terminalService("case.gs028b.differentiated-thyroid-cancer.a-palpable-node", "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1", "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3", "correct_3", "Complete neck ultrasound", "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"]),
  terminalService("case.gs028b.nipple-discharge.paired-bloody-single-duct", "node.gs028b.nipple-discharge.paired-bloody-single-duct.2", "question.pathologic-nipple-discharge.diagnostic-imaging.v1", "correct_1", "Diagnostic mammography and ultrasound", "timing.test.breast_imaging_bundle", "service.diagnostic_breast_imaging", ["route.diagnostic_breast_imaging.outsourced"]),
  terminalService("case.gs028b.nipple-discharge.b-male-pathologic", "node.gs028b.nipple-discharge.b-male-pathologic.1", "question.pathologic-nipple-discharge.diagnostic-imaging.v3", "correct_3", "Diagnostic mammography and ultrasound", "timing.test.breast_imaging_bundle", "service.diagnostic_breast_imaging", ["route.diagnostic_breast_imaging.outsourced"]),
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
    terminalService(`case.primary-aldosteronism.${slug}`, `node.primary-aldosteronism.${slug}.2`, `question.primary-aldosteronism.ct-avs-lateralization.v${index + 1}`, `ct_avs_${index + 1}`, "Adrenal CT with venous sampling", "timing.test.adrenal_ct_avs", "service.ct", ["route.ct.in_house", "route.ct.outsourced"], "Adrenal venous sampling remains an external specialty component.", "external_patient_visit"),
  ),
  ...["crusted-nipple", "nipple-erosion", "areolar-rash", "scaly-nipple"].map((slug, index) =>
    terminalService(`case.mammary-paget.${slug}`, `node.mammary-paget.${slug}.2`, `question.mammary-paget.underlying-breast-evaluation.v${index + 1}`, `mammo_us_${index + 1}`, "Mammography with ultrasound", "timing.test.breast_imaging_bundle", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"], "Mammography remains an external component.", "external_patient_visit"),
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

const gs028October2Records: ExactTestChoiceOrderRecord[] = [
  ...["mastectomy", "oncoplastic-mapping", "invasion-concern"].map((slug, index) => record(`case.gs028c.dcis.b-${slug}`, `node.gs028c.dcis.b-${slug}.1`, `question.dcis.sentinel-node-setting.v${[1, 3, 4][index]}`, `correct_${[1, 3, 4][index]}`, "Include SLNB at breast surgery", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  gateOverride("case.gs028c.palpable-breast.paired-dense-focal", "node.gs028c.palpable-breast.paired-dense-focal.1", "question.palpable-breast.negative-mammogram-targeted-us.v1", "correct_1", "Targeted breast ultrasound", "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"]),
  gateOverride("case.gs028c.palpable-breast.paired-scar-edge", "node.gs028c.palpable-breast.paired-scar-edge.1", "question.palpable-breast.negative-mammogram-targeted-us.v2", "correct_2", "Targeted scar-edge ultrasound", "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"]),
  ...[
    ["paired-dense-focal", "2", "1"], ["paired-scar-edge", "2", "2"], ["b-enlarging-negative-imaging", "1", "3"], ["b-surgeon-discordance", "1", "4"],
  ].map(([slug, node, version]) => record(`case.gs028c.palpable-breast.${slug}`, `node.gs028c.palpable-breast.${slug}.${node}`, `question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v${version}`, `correct_${version}`, "Breast-specialist biopsy referral", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" })),
  ...[
    ["a-recent-negative", "3", "Targeted breast ultrasound"], ["a-discordant-exam", "4", "Targeted breast ultrasound"],
  ].map(([slug, version, label]) => terminalService(`case.gs028c.palpable-breast.${slug}`, `node.gs028c.palpable-breast.${slug}.1`, `question.palpable-breast.negative-mammogram-targeted-us.v${version}`, `correct_${version}`, label!, "timing.test.ultrasound", "service.ultrasound", ["route.ultrasound.in_house", "route.ultrasound.outsourced"])),
  ...["pedunculated-enbloc", "sessile-superficial", "outside-slide-review", "clear-cautery-line"].map((slug, index) => record(`case.gs028c.malignant-polyp.a-${slug}`, `node.gs028c.malignant-polyp.a-${slug}.1`, `question.malignant-polyp.low-risk-endoscopic-excision.v${index + 1}`, `correct_${index + 1}`, "Colonoscopic surveillance", "timing.test.lower_endoscopy", { kind: "not_executed", reason: "future_planned" })),
  ...["nondiagnostic-ultrasound", "atypical-older-adult", "equivocal-exam", "competing-diagnoses"].map((slug, index) => record(`case.gs028c.appendicitis.a-${slug}`, `node.gs028c.appendicitis.a-${slug}.1`, `question.appendicitis.stable-adult-ct.v${index + 1}`, `correct_${index + 1}`, "Abdominopelvic CT", "timing.test.ct", { kind: "not_executed", reason: "external_only" })),
  ...["equivocal-wall-thickening", "stones-without-secondary-signs", "limited-ultrasound", "persistent-suspicion"].map((slug, index) => record(`case.gs028c.acute-cholecystitis.a-${slug}`, `node.gs028c.acute-cholecystitis.a-${slug}.1`, `question.cholecystitis.hida-after-equivocal-ultrasound.v${index + 1}`, `correct_${index + 1}`, "Hepatobiliary scintigraphy", "timing.test.nuclear_imaging", { kind: "not_executed", reason: "external_only" })),
  ...["atrial-fibrillation", "acute-on-chronic-pattern", "kidney-injury", "possible-arterial-thrombosis"].map((slug, index) => record(`case.gs028c.acute-mesenteric-ischemia.a-${slug}`, `node.gs028c.acute-mesenteric-ischemia.a-${slug}.1`, `question.acute-mesenteric-ischemia.prompt-cta.v${index + 1}`, `correct_${index + 1}`, "Mesenteric CT angiography", "timing.test.ct_angiography", { kind: "not_executed", reason: "external_only" })),
];

const gs028October3Records: ExactTestChoiceOrderRecord[] = [
  ...[
    ["steering-wheel-impact", "1", "ECG plus cardiac troponin"],
    ["sports-chest-impact", "2", "ECG and cardiac troponin"],
    ["fall-anterior-chest", "3", "ECG with cardiac troponin"],
    ["bicycle-handlebar-impact", "4", "ECG with cardiac troponin"],
  ].map(([slug, version, label]) =>
    record(
      `case.gs028d.blunt-cardiac-injury.a-${slug}`,
      `node.gs028d.blunt-cardiac-injury.a-${slug}.1`,
      `question.blunt-cardiac-injury.ecg-troponin-evaluation.v${version}`,
      `correct_${version}`,
      label!,
      "timing.test.combined_diagnostic",
      { kind: "not_executed", reason: "external_only" },
    ),
  ),
  ...[
    ["warfarin-fall", "1"],
    ["apixaban-doorframe", "2"],
    ["rivaroxaban-cabinet", "3"],
    ["dabigatran-low-speed-crash", "4"],
  ].map(([slug, version]) =>
    record(
      `case.gs028d.head-pelvis-trauma.a-${slug}`,
      `node.gs028d.head-pelvis-trauma.a-${slug}.1`,
      `question.head-injury.anticoagulant-ed-ct-evaluation.v${version}`,
      `correct_${version}`,
      "Emergency evaluation for head CT",
      "timing.test.ct",
      { kind: "not_executed", reason: "external_only" },
    ),
  ),
  ...[
    ["diarrhea-low-bicarb", "1", "External blood gas"],
    ["renal-low-bicarb", "2", "External blood-gas result"],
    ["tachypnea-low-bicarb", "3", "External blood gas"],
  ].map(([slug, version, label]) =>
    record(
      `case.gs028d.acid-base.a-${slug}`,
      `node.gs028d.acid-base.a-${slug}.1`,
      `question.metabolic-acidosis.confirm-with-blood-gas.v${version}`,
      `correct_${version}`,
      label!,
      "timing.test.basic_labs",
      { kind: "not_executed", reason: "external_only" },
    ),
  ),
  gateOverride(
    "case.gs028d.dialysis-access.paired-indeterminate-thrill",
    "node.gs028d.dialysis-access.paired-indeterminate-thrill.1",
    "question.dialysis-access.maturation-physical-assessment.v1",
    "correct_1",
    "Arrange specialist Doppler ultrasound",
    "timing.test.ultrasound",
    "service.ultrasound",
    ["route.ultrasound.outsourced"],
    false,
  ),
  gateOverride(
    "case.gs028d.dialysis-access.paired-deep-access",
    "node.gs028d.dialysis-access.paired-deep-access.1",
    "question.dialysis-access.maturation-physical-assessment.v2",
    "correct_2",
    "Arrange specialist Doppler ultrasound",
    "timing.test.ultrasound",
    "service.ultrasound",
    ["route.ultrasound.outsourced"],
    false,
  ),
  ...[
    ["current-smoker-eligible", "1"],
    ["recent-quitter-eligible", "2"],
  ].map(([slug, version]) =>
    record(
      `case.gs028d.thoracic-screening.a-${slug}`,
      `node.gs028d.thoracic-screening.a-${slug}.1`,
      `question.lung-cancer-screening.annual-ldct-eligibility.v${version}`,
      `correct_${version}`,
      "Refer for annual LDCT",
      "timing.test.advanced_diagnostic",
      { kind: "not_executed", reason: "external_only" },
    ),
  ),
  ...[
    ["new-unilateral", "1", "External image-guided thoracentesis"],
    ["small-effusion", "2", "Image-guided thoracentesis"],
    ["loculated-effusion", "3", "Image-guided pleural sampling"],
    ["postoperative-effusion", "4", "Request image guidance"],
  ].map(([slug, version, label]) =>
    record(
      `case.gs028d.thoracic-pleural.b-${slug}`,
      `node.gs028d.thoracic-pleural.b-${slug}.1`,
      `question.pleural-effusion.image-guided-thoracentesis-referral.v${version}`,
      `correct_${version}`,
      label!,
      "timing.test.clinical_procedure",
      { kind: "not_executed", reason: "specialist_or_unsupported_service" },
    ),
  ),
];

// These are outside-specialist workup choices. Incorrect selections retain the
// corrected-forward policy: only the correct mixing assessment is ordered.
// Explicit non-execution records keep their estimates independent of local labs.
const gs028October7Records: ExactTestChoiceOrderRecord[] = [
  ...([
    ["elective-record-workup", "1", "Platelet-function testing"],
    ["specialist-bruising-review", "2", "Platelet-count measurement"],
  ] as const).flatMap(([slug, version, plateletLabel]) => {
    const caseId = `case.gs028e.coagulation.paired-${slug}`;
    const nodeId = `node.gs028e.coagulation.paired-${slug}.1`;
    const questionId = `question.coagulation.isolated-aptt-mixing-workup.v${version}`;
    return [
      record(caseId, nodeId, questionId, `correct_${version}`, "aPTT mixing study", "timing.test.basic_labs", {
        kind: "result_gate_route_override",
        serviceId: "service.basic_labs",
        allowedRouteIds: ["route.basic_labs.outsourced"],
        allowOnsiteEquivalents: false,
        externalRemainder: "The outside specialist coagulation laboratory performs immediate and incubated mixing analysis and the parallel factor workup; this clinic does not perform that specialized analysis.",
      }),
      record(caseId, nodeId, questionId, `d1_${version}`, plateletLabel, "timing.test.basic_labs", {
        kind: "not_executed", reason: "external_only",
      }),
      record(caseId, nodeId, questionId, `d2_${version}`, "Fibrinogen activity measurement", "timing.test.basic_labs", {
        kind: "not_executed", reason: "external_only",
      }),
      record(caseId, nodeId, questionId, `d3_${version}`, "Prothrombin-time measurement", "timing.test.basic_labs", {
        kind: "not_executed", reason: "external_only",
      }),
    ];
  }),
];

// The second variety batch uses ordinary blood/CT services where implemented.
// Alternate wrong workups receive feedback without execution; specialist neck
// sampling remains a referral because a generic neck-FNA service is not present.
const gs028October7Variety2Records: ExactTestChoiceOrderRecord[] = [
  ...([
    ["late-period", "1", "Complete blood count", "Serum lipase testing", "Serum creatinine testing"],
    ["contraception-spotting", "2", "Complete blood count", "Serum electrolyte testing", "Serum creatinine testing"],
    ["early-home-negative", "3", "Complete blood count", "Serum lipase testing", "Serum electrolyte testing"],
  ] as const).flatMap(([slug, version, ...labels]) => {
    const caseId = `case.gs028f.gynecology.c1-${slug}`;
    const nodeId = `node.gs028f.gynecology.c1-${slug}.1`;
    const questionId = `question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v${version}`;
    return [
      terminalService(caseId, nodeId, questionId, `correct_${version}`, "Serum hCG measurement", "timing.test.basic_labs", "service.basic_labs", ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]),
      ...labels.map((label, index) => record(caseId, nodeId, questionId, `d${index + 1}_${version}`, label, "timing.test.basic_labs", {
        kind: "not_executed", reason: "specialist_or_unsupported_service",
      })),
    ];
  }),
  ...([
    ["persistent-solid", "1"], ["cystic-is-not-benign", "2"],
  ] as const).flatMap(([slug, version]) => {
    const caseId = `case.gs028f.neck-mass.paired-${slug}`;
    const imagingNodeId = `node.gs028f.neck-mass.paired-${slug}.1`;
    const imagingQuestionId = `question.gs028f.head-neck.persistent-mass-malignancy-ct.v${version}`;
    const tissueNodeId = `node.gs028f.neck-mass.paired-${slug}.2`;
    const tissueQuestionId = `question.gs028f.head-neck.initial-fna-not-open-biopsy.v${version}`;
    return [
      gateOverride(caseId, imagingNodeId, imagingQuestionId, `correct_${version}`, "Contrast-enhanced neck CT", "timing.test.ct", "service.ct", ["route.ct.in_house", "route.ct.outsourced"]),
      record(caseId, imagingNodeId, imagingQuestionId, `d1_${version}`, "Plain cervical spine radiographs", "timing.test.radiography", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
      record(caseId, imagingNodeId, imagingQuestionId, `d2_${version}`, "Thyroid radionuclide scintigraphy", "timing.test.nuclear_imaging", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
      record(caseId, imagingNodeId, imagingQuestionId, `d3_${version}`, "Barium swallow fluoroscopy", "timing.test.contrast_swallow", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
      record(caseId, tissueNodeId, tissueQuestionId, `correct_${version}`, "Fine-needle aspiration referral", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
      record(caseId, tissueNodeId, tissueQuestionId, `d1_${version}`, "Open incisional biopsy referral", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
      record(caseId, tissueNodeId, tissueQuestionId, `d2_${version}`, "Open excisional biopsy referral", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
    ];
  }),
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

// Explicit wording revisions retain the original keyed test's operational
// contract. Old exact records remain below for already frozen encounters.
const questionQualityPilotRecords: ExactTestChoiceOrderRecord[] = [
  record("case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs", "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1", "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r2", "correct_2", "Hepatobiliary scintigraphy", "timing.test.nuclear_imaging", { kind: "not_executed", reason: "external_only" }),
  terminalService("case.gs028b.nipple-discharge.paired-bloody-single-duct", "node.gs028b.nipple-discharge.paired-bloody-single-duct.2", "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r2", "correct_1", "Diagnostic mammography and ultrasound", "timing.test.breast_imaging_bundle", "service.diagnostic_breast_imaging", ["route.diagnostic_breast_imaging.outsourced"]),
  terminalService("case.adrenal-incidentaloma.renal-cancer-mass", "node.adrenal-incidentaloma.renal-cancer-mass.1", "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r2", "metanephrines_3", "Plasma free metanephrines", "timing.test.basic_labs", "service.basic_labs", ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]),
  record("case.gs028g.merkel-cell.paired-skin-panel", "node.gs028g.merkel-cell.paired-skin-panel.2", "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r2", "correct_1", "Specialist sentinel lymph node staging", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
];

// Manager-reviewed wording advances identity only; keep both earlier contracts
// above and every pre-pilot record below for frozen encounters.
const questionQualityReviewRecords: ExactTestChoiceOrderRecord[] = [
  record("case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs", "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1", "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r3", "correct_2", "Hepatobiliary scintigraphy", "timing.test.nuclear_imaging", { kind: "not_executed", reason: "external_only" }),
  terminalService("case.gs028b.nipple-discharge.paired-bloody-single-duct", "node.gs028b.nipple-discharge.paired-bloody-single-duct.2", "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r3", "correct_1", "Diagnostic mammography and ultrasound", "timing.test.breast_imaging_bundle", "service.diagnostic_breast_imaging", ["route.diagnostic_breast_imaging.outsourced"]),
  terminalService("case.adrenal-incidentaloma.renal-cancer-mass", "node.adrenal-incidentaloma.renal-cancer-mass.1", "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3", "metanephrines_3", "Plasma free metanephrines", "timing.test.basic_labs", "service.basic_labs", ["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]),
  record("case.gs028g.merkel-cell.paired-skin-panel", "node.gs028g.merkel-cell.paired-skin-panel.2", "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3", "correct_1", "Sentinel lymph node staging", "timing.test.biopsy", { kind: "not_executed", reason: "specialist_or_unsupported_service" }),
];

// Owner round two: exact new identities; preserve every prior draft contract.
const questionQualityOwnerRound2Records: ExactTestChoiceOrderRecord[] = [
  record("case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs", "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1", "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r4", "correct_2", "Hepatobiliary scintigraphy", "timing.test.nuclear_imaging", { kind: "not_executed", reason: "external_only" }),
  terminalService("case.gs028b.nipple-discharge.paired-bloody-single-duct", "node.gs028b.nipple-discharge.paired-bloody-single-duct.2", "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r4", "correct_1", "Diagnostic mammography and ultrasound", "timing.test.breast_imaging_bundle", "service.diagnostic_breast_imaging", ["route.diagnostic_breast_imaging.outsourced"]),
];

// BEGIN QUESTION QUALITY 20261102 EXACT RECORDS
const questionQuality20261102Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs",
    "nodeId": "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r5",
    "choiceId": "correct_2",
    "choiceLabel": "Hepatobiliary scintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r5",
    "choiceId": "correct_1",
    "choiceLabel": "Diagnostic mammography and ultrasound",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.diagnostic_breast_imaging",
      "allowedRouteIds": [
        "route.diagnostic_breast_imaging.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r2",
    "choiceId": "correct_3",
    "choiceLabel": "Neck ultrasonography",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.in_house",
        "route.ultrasound.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2.r2",
    "choiceId": "sentinel_node_2",
    "choiceLabel": "Sentinel lymph-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r2",
    "choiceId": "sentinel_node_4",
    "choiceLabel": "Sentinel lymph-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1.r2",
    "choiceId": "sentinel_node_1",
    "choiceLabel": "Sentinel lymph-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r2",
    "choiceId": "sentinel_node_3",
    "choiceLabel": "Sentinel lymph-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r2",
    "choiceId": "sarcoma_core_1",
    "choiceLabel": "Image-guided core biopsy through a sarcoma service",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r2",
    "choiceId": "sarcoma_core_2",
    "choiceLabel": "Image-guided core biopsy through a sarcoma service",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r2",
    "choiceId": "drain_0",
    "choiceLabel": "Endoscopic transmural drainage",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r2",
    "choiceId": "drain_1",
    "choiceLabel": "Endoscopic transmural drainage",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r2",
    "choiceId": "drain_2",
    "choiceLabel": "Endoscopic transmural drainage",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r2",
    "choiceId": "drain_3",
    "choiceLabel": "Endoscopic transmural drainage",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  }
];
// END QUESTION QUALITY 20261102 EXACT RECORDS

// BEGIN QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS
const questionQualityAdversarial20261102Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs",
    "nodeId": "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r6",
    "choiceId": "correct_2",
    "choiceLabel": "Hepatobiliary scintigraphy assessing gallbladder filling",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r6",
    "choiceId": "correct_1",
    "choiceLabel": "Mammography and targeted ultrasound",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.diagnostic_breast_imaging",
      "allowedRouteIds": [
        "route.diagnostic_breast_imaging.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r3",
    "choiceId": "correct_3",
    "choiceLabel": "Neck ultrasound surveying central and lateral nodal compartments",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.in_house",
        "route.ultrasound.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2.r3",
    "choiceId": "sentinel_node_2",
    "choiceLabel": "Sentinel lymph node mapping and biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r3",
    "choiceId": "sentinel_node_4",
    "choiceLabel": "Sentinel lymph node mapping and biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1.r3",
    "choiceId": "sentinel_node_1",
    "choiceLabel": "Sentinel lymph node mapping and biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r3",
    "choiceId": "sentinel_node_3",
    "choiceLabel": "Sentinel lymph node mapping and biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r3",
    "choiceId": "sarcoma_core_1",
    "choiceLabel": "Region A within the mass",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r3",
    "choiceId": "sarcoma_core_2",
    "choiceLabel": "Region A within the mass",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r3",
    "choiceId": "lineage_not_diagnosis",
    "choiceLabel": "Endoscopic resampling for histology and immunophenotyping",
    "timingProfileId": "timing.test.endoscopy_with_sampling",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r3",
    "choiceId": "drain_0",
    "choiceLabel": "Referral for endoscopic transmural drainage assessment",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r3",
    "choiceId": "drain_1",
    "choiceLabel": "Referral for endoscopic transmural drainage assessment",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r3",
    "choiceId": "drain_2",
    "choiceLabel": "Referral for endoscopic transmural drainage assessment",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r3",
    "choiceId": "drain_3",
    "choiceLabel": "Referral for endoscopic transmural drainage assessment",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  }
];
// END QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS

// BEGIN QUESTION QUALITY ADVERSARIAL R3 20261102 EXACT RECORDS
const questionQualityAdversarialR320261102Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r7",
    "choiceId": "correct_1",
    "choiceLabel": "Diagnostic mammography and targeted retroareolar ultrasound",
    "timingProfileId": "timing.test.breast_imaging_bundle",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.diagnostic_breast_imaging",
      "allowedRouteIds": [
        "route.diagnostic_breast_imaging.outsourced"
      ]
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r4",
    "choiceId": "correct_3",
    "choiceLabel": "Neck ultrasound of central and lateral nodal compartments",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.in_house",
        "route.ultrasound.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2.r4",
    "choiceId": "sentinel_node_2",
    "choiceLabel": "Sentinel-node biopsy with wide excision, before reconstructive closure",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r4",
    "choiceId": "sentinel_node_4",
    "choiceLabel": "Sentinel lymph node mapping and biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1.r4",
    "choiceId": "sentinel_node_1",
    "choiceLabel": "Sentinel-node biopsy with wide excision, before reconstructive closure",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r4",
    "choiceId": "sentinel_node_3",
    "choiceLabel": "Sentinel lymph node mapping and biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r4",
    "choiceId": "sarcoma_core_1",
    "choiceLabel": "Image-guided core biopsy of region A along path A",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r4",
    "choiceId": "sarcoma_core_2",
    "choiceLabel": "Image-guided core biopsy of region B along path B",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r4",
    "choiceId": "lineage_not_diagnosis",
    "choiceLabel": "Repeat endoscopy with documented-site biopsies for histologic comparison",
    "timingProfileId": "timing.test.upper_endoscopy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
// END QUESTION QUALITY ADVERSARIAL R3 20261102 EXACT RECORDS

// BEGIN QUESTION QUALITY ADVERSARIAL R4 20261102 EXACT RECORDS
const questionQualityAdversarialR420261102Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r5",
    "choiceId": "correct_3",
    "choiceLabel": "Repeat node FNA with cytology and thyroglobulin washout",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.thyroid_fna",
      "allowedRouteIds": [
        "route.thyroid_fna.in_house",
        "route.thyroid_fna.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r5",
    "choiceId": "sentinel_node_3",
    "choiceLabel": "Targeted core biopsy of the regional node",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r4",
    "choiceId": "drain_0",
    "choiceLabel": "Arterial embolization, then collection drainage if required",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r4",
    "choiceId": "drain_1",
    "choiceLabel": "Transmural drainage with reassessment; add necrosectomy if required",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r4",
    "choiceId": "drain_2",
    "choiceLabel": "Transpapillary pancreatic duct stenting",
    "timingProfileId": "timing.test.ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r4",
    "choiceId": "drain_3",
    "choiceLabel": "Transmural drainage with planned long-term plastic-stent drainage",
    "timingProfileId": "timing.test.pseudocyst_drainage",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  }
];
// END QUESTION QUALITY ADVERSARIAL R4 20261102 EXACT RECORDS

// BEGIN QUESTION QUALITY ADVERSARIAL R5 20261102 EXACT RECORDS
const questionQualityAdversarialR520261102Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r6",
    "choiceId": "correct_3",
    "choiceLabel": "Solid-rim FNA for cytology; thyroglobulin in needle washout",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "terminal_service",
      "serviceId": "service.thyroid_fna",
      "allowedRouteIds": [
        "route.thyroid_fna.in_house",
        "route.thyroid_fna.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r5",
    "choiceId": "drain_0",
    "choiceLabel": "Arterial embolization, followed by reassessment for collection drainage",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  }
];
// END QUESTION QUALITY ADVERSARIAL R5 20261102 EXACT RECORDS

// BEGIN QUESTION FLAGS 20261104 EXACT RECORDS
/** New identities preserve planned/outside-only non-execution; no new service route. */
const questionFlag20261104Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028d.hyperkalaemia.a-renal-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-renal-result.1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r2",
    "choiceId": "choice.qf20261104.f04.d1",
    "choiceLabel": "Repeat potassium in the community later today",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
    "choiceId": "correct_4",
    "choiceLabel": "Fine-needle aspiration of the neck node",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
    "choiceId": "choice.qf20261104.f05.d1",
    "choiceLabel": "Open incisional biopsy of the neck node",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
    "choiceId": "choice.qf20261104.f05.d2",
    "choiceLabel": "Open excisional biopsy of the neck node",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r2",
    "choiceId": "correct_3",
    "choiceLabel": "Sentinel-node biopsy with breast removal",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r2",
    "choiceId": "choice.qf20261104.f10.d1",
    "choiceLabel": "Sentinel-node biopsy after invasive final pathology",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
    "choiceId": "correct_4",
    "choiceLabel": "Hepatobiliary scintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
    "choiceId": "choice.qf20261104.f12.d1",
    "choiceLabel": "Magnetic resonance cholangiopancreatography",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
    "choiceId": "choice.qf20261104.f12.d2",
    "choiceLabel": "Repeat right-upper-quadrant ultrasonography",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
    "choiceId": "correct_4",
    "choiceLabel": "Arrange tissue sampling of the palpable area",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
    "choiceId": "choice.qf20261104.f17.d1",
    "choiceLabel": "Arrange contrast-enhanced MRI of the palpable area",
    "timingProfileId": "timing.test.breast_mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
    "choiceId": "choice.qf20261104.f17.d2",
    "choiceLabel": "Arrange repeat ultrasound of the palpable area",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
// END QUESTION FLAGS 20261104 EXACT RECORDS

// BEGIN QUESTION FLAGS ROUND2 20261104 EXACT RECORDS
/** Explicit outside/planned studies; no new local service or routing policy. */
const questionFlagRound2Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
    "choiceId": "correct_2",
    "choiceLabel": "MR cholangiography with a hepatobiliary contrast agent",
    "timingProfileId": "timing.test.hepatobiliary_contrast_mrcp",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
    "choiceId": "choice.qf2.20261104.f02.d1",
    "choiceLabel": "Hepatobiliary scintigraphy with dynamic delayed imaging",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
    "choiceId": "choice.qf2.20261104.f02.d2",
    "choiceLabel": "MR cholangiography without a hepatobiliary contrast agent",
    "timingProfileId": "timing.test.mrcp",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
    "choiceId": "correct_4",
    "choiceLabel": "Request a venous reflux duplex study",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
    "choiceId": "choice.qf2.20261104.f03.d1",
    "choiceLabel": "Request a deep-venous compression duplex study",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
    "choiceId": "choice.qf2.20261104.f03.d2",
    "choiceLabel": "Request a pelvic contrast CT venogram",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
    "choiceId": "correct_4",
    "choiceLabel": "Repeat image-guided needle assessment of the lesion",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
    "choiceId": "choice.qf2.20261104.f05.d1",
    "choiceLabel": "Arrange open diagnostic excision of the lesion",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
    "choiceId": "choice.qf2.20261104.f05.d2",
    "choiceLabel": "Arrange interval ultrasound surveillance of the lesion",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r3",
    "choiceId": "acute_lymphangitis",
    "choiceLabel": "Targeted soft-tissue ultrasound at the heel",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r3",
    "choiceId": "choice.qf2.20261104.f08.d1",
    "choiceLabel": "Compression venous ultrasound along the calf",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r3",
    "choiceId": "choice.qf2.20261104.f08.d2",
    "choiceLabel": "Targeted soft-tissue ultrasound at the groin",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r3",
    "choiceId": "correct_3",
    "choiceLabel": "Schedule sentinel-node biopsy at the forthcoming operation",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r3",
    "choiceId": "choice.qf2.20261104.f10.d1",
    "choiceLabel": "Schedule sentinel-node biopsy if final pathology reveals invasion",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3",
    "choiceId": "correct_4",
    "choiceLabel": "Magnetic resonance cholangiopancreatography",
    "timingProfileId": "timing.test.mrcp",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3",
    "choiceId": "choice.qf2.20261104.f12.d1",
    "choiceLabel": "Hepatobiliary scintigraphy",
    "timingProfileId": "timing.test.nuclear_imaging",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3",
    "choiceId": "choice.qf2.20261104.f12.d2",
    "choiceLabel": "Endoscopic retrograde cholangiopancreatography",
    "timingProfileId": "timing.test.ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
    "choiceId": "correct_4",
    "choiceLabel": "Node aspiration for cytology and thyroglobulin measurement",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
    "choiceId": "choice.qf2.20261104.f16.d1",
    "choiceLabel": "Node aspiration for cytology and flow-cytometric assessment",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
    "choiceId": "choice.qf2.20261104.f16.d2",
    "choiceLabel": "Node aspiration for cytology and microbiological culture",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3",
    "choiceId": "correct_4",
    "choiceLabel": "Arrange examination-guided tissue sampling",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3",
    "choiceId": "choice.qf2.20261104.f17.d1",
    "choiceLabel": "Arrange contrast-enhanced breast MRI",
    "timingProfileId": "timing.test.breast_mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
// END QUESTION FLAGS ROUND2 20261104 EXACT RECORDS

// BEGIN QUESTION BANK BATCH2A 20261104 EXACT RECORDS
/** Version-specific existing-service gates and non-execution previews; no routing policy change. */
const questionBankBatch2aRecords: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r7",
    "choiceId": "manometry_2",
    "choiceLabel": "Repeat standard high-resolution esophageal manometry",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.esophageal_manometry",
      "allowedRouteIds": [
        "route.esophageal_manometry.outsourced"
      ]
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r7",
    "choiceId": "choice.qbp2a.20261104.b2a03.d1",
    "choiceLabel": "Obtain a timed barium esophagram with a tablet",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r7",
    "choiceId": "choice.qbp2a.20261104.b2a03.d2",
    "choiceLabel": "Obtain ambulatory esophageal pH-impedance monitoring",
    "timingProfileId": "timing.test.ambulatory_reflux_monitoring",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r9",
    "choiceId": "choice.qbp2a.20261104.b2a05.d2",
    "choiceLabel": "Repeat targeted dynamic groin ultrasonography",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7",
    "choiceId": "dynamic_ultrasound_2",
    "choiceLabel": "Repeat dynamic groin ultrasound",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.outsourced",
        "route.ultrasound.in_house"
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7",
    "choiceId": "choice.qbp2a.20261104.b2a06.d1",
    "choiceLabel": "Obtain dynamic groin MRI",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7",
    "choiceId": "choice.qbp2a.20261104.b2a06.d2",
    "choiceLabel": "Obtain contrast-enhanced pelvic CT",
    "timingProfileId": "timing.test.ct",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r9",
    "choiceId": "choice.qbp2a.20261104.b2a08.d2",
    "choiceLabel": "Repeat targeted dynamic groin ultrasonography",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9",
    "choiceId": "excisional_4",
    "choiceLabel": "Perform a narrow-margin excisional biopsy",
    "timingProfileId": "timing.test.excisional_biopsy",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.skin_excisional_biopsy",
      "allowedRouteIds": [
        "route.skin_excisional_biopsy.in_house",
        "route.skin_excisional_biopsy.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9",
    "choiceId": "choice.qbp2a.20261104.b2a09.d1",
    "choiceLabel": "Perform a punch biopsy of the darker portion",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9",
    "choiceId": "choice.qbp2a.20261104.b2a09.d2",
    "choiceLabel": "Request deeper histological sections from the block",
    "timingProfileId": "timing.test.pathology_review",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r2",
    "choiceId": "dst_4",
    "choiceLabel": "1-mg overnight dexamethasone test",
    "timingProfileId": "timing.test.dexamethasone_suppression",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r2",
    "choiceId": "choice.qbp2a.20261104.b2a11.d1",
    "choiceLabel": "Late-night salivary cortisol measurement",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r2",
    "choiceId": "choice.qbp2a.20261104.b2a11.d2",
    "choiceLabel": "Urinary free cortisol measurement",
    "timingProfileId": "timing.test.twenty_four_hour_protocol",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
// END QUESTION BANK BATCH2A 20261104 EXACT RECORDS

// BEGIN QUESTION FLAGS ROUND3 20261104 EXACT RECORDS
/** Retrospective/outside or planned studies; retained old tuples remain exact. */
const questionFlagRound3Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
    "choiceId": "correct_2",
    "choiceLabel": "Endoscopic transpapillary plastic-stent placement",
    "timingProfileId": "timing.test.ercp",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
    "choiceId": "choice.qf3.20261104.f02.d1",
    "choiceLabel": "Percutaneous exchange for a larger drainage catheter",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
    "choiceId": "correct_4",
    "choiceLabel": "Reflux mapping of the superficial and deep leg veins",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
    "choiceId": "choice.qf3.20261104.f03.d1",
    "choiceLabel": "Obstruction mapping of the superficial and deep leg veins",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
    "choiceId": "choice.qf3.20261104.f03.d2",
    "choiceLabel": "Reflux mapping of the visible calf tributaries",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
    "choiceId": "choice.qf3.20261104.f03.d3",
    "choiceLabel": "Obstruction mapping of the visible calf tributaries",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "external_only"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4",
    "choiceId": "correct_4",
    "choiceLabel": "Ultrasound-guided core biopsy of mural tissue",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4",
    "choiceId": "choice.qf3.20261104.f05.d1",
    "choiceLabel": "Open excisional biopsy of the entire neck mass",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4",
    "choiceId": "choice.qf3.20261104.f05.d2",
    "choiceLabel": "Interval ultrasound surveillance of the neck mass",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "specialist_or_unsupported_service"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r4",
    "choiceId": "correct_3",
    "choiceLabel": "Left sentinel-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r4",
    "choiceId": "choice.qf3.20261104.f10.d1",
    "choiceLabel": "Right sentinel-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r4",
    "choiceId": "choice.qf3.20261104.f10.d2",
    "choiceLabel": "Left and right sentinel-node biopsy",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
    "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
    "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r4",
    "choiceId": "choice.qf3.20261104.f13.d2",
    "choiceLabel": "Obtain diagnostic polysomnography before planning precautions",
    "timingProfileId": "timing.test.overnight_protocol",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r4",
    "choiceId": "correct_4",
    "choiceLabel": "Resample the neck node by an extrathyroidal route",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r4",
    "choiceId": "choice.qf3.20261104.f16.d2",
    "choiceLabel": "Book thyroidectomy and nodal ultrasound surveillance",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4",
    "choiceId": "correct_4",
    "choiceLabel": "Repeat tissue sampling under palpation guidance",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4",
    "choiceId": "choice.qf3.20261104.f17.d1",
    "choiceLabel": "Repeat tissue sampling under ultrasound guidance",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4",
    "choiceId": "choice.qf3.20261104.f17.d2",
    "choiceLabel": "Obtain breast MRI before repeat tissue sampling",
    "timingProfileId": "timing.test.mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
// END QUESTION FLAGS ROUND3 20261104 EXACT RECORDS

// BEGIN QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS
/** Version-specific existing-service gates and advisory nonexecution previews. */
const questionBankBatch2aRound2Records: ExactTestChoiceOrderRecord[] = [
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r6",
    "choiceId": "achalasia_2",
    "choiceLabel": "Endoscopic ultrasound with wall sampling",
    "timingProfileId": "timing.test.endoscopy_with_sampling",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r6",
    "choiceId": "choice.qbp2ar2.20261104.b2a02.d1",
    "choiceLabel": "Functional lumen imaging probe distensibility study",
    "timingProfileId": "timing.test.upper_endoscopy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r6",
    "choiceId": "choice.qbp2ar2.20261104.b2a02.d2",
    "choiceLabel": "Timed barium esophagram with a tablet",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r8",
    "choiceId": "manometry_2",
    "choiceLabel": "Separated single-water-swallow pressure series",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.esophageal_manometry",
      "allowedRouteIds": [
        "route.esophageal_manometry.outsourced"
      ]
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r8",
    "choiceId": "choice.qbp2ar2.20261104.b2a03.d1",
    "choiceLabel": "Repeated multiple-rapid-swallow pressure series",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r8",
    "choiceId": "choice.qbp2ar2.20261104.b2a03.d2",
    "choiceLabel": "Continuous rapid-water-drinking pressure series",
    "timingProfileId": "timing.test.esophageal_manometry",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r10",
    "choiceId": "manometry_3",
    "choiceLabel": "Reduced contraction reserve; obtain a timed barium esophagram",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.contrast_swallow",
      "allowedRouteIds": [
        "route.contrast_swallow.outsourced"
      ]
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r10",
    "choiceId": "choice.qbp2ar2.20261104.b2a04.d2",
    "choiceLabel": "Preserved contraction reserve; obtain a timed barium esophagram",
    "timingProfileId": "timing.test.contrast_swallow",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
    "choiceId": "dynamic_ultrasound_2",
    "choiceLabel": "Standing strain; cine ultrasound of groin canals",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.ultrasound",
      "allowedRouteIds": [
        "route.ultrasound.outsourced",
        "route.ultrasound.in_house"
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
    "choiceId": "choice.qbp2ar2.20261104.b2a06.d1",
    "choiceLabel": "Supine strain; cine ultrasound of groin canals",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
    "choiceId": "choice.qbp2ar2.20261104.b2a06.d2",
    "choiceLabel": "Standing compression; Doppler ultrasound of groin veins",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
    "choiceId": "choice.qbp2ar2.20261104.b2a06.d3",
    "choiceLabel": "Supine compression; Doppler ultrasound of groin veins",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10",
    "choiceId": "excisional_4",
    "choiceLabel": "Narrow-margin excision of the residual patch",
    "timingProfileId": "timing.test.excisional_biopsy",
    "disposition": {
      "kind": "result_gate_route_override",
      "serviceId": "service.skin_excisional_biopsy",
      "allowedRouteIds": [
        "route.skin_excisional_biopsy.in_house",
        "route.skin_excisional_biopsy.outsourced"
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10",
    "choiceId": "choice.qbp2ar2.20261104.b2a09.d1",
    "choiceLabel": "Deep punch biopsy through the medial focus",
    "timingProfileId": "timing.test.cutaneous_lesion_biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r3",
    "choiceId": "dst_4",
    "choiceLabel": "Basal plasma corticotropin measurement",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r3",
    "choiceId": "choice.qbp2ar2.20261104.b2a11.d1",
    "choiceLabel": "High-dose dexamethasone suppression study",
    "timingProfileId": "timing.test.dexamethasone_suppression",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r3",
    "choiceId": "choice.qbp2ar2.20261104.b2a11.d2",
    "choiceLabel": "Corticotropin-releasing hormone stimulation study",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
];
// END QUESTION BANK BATCH2A ROUND2 20261104 EXACT RECORDS

export const EXACT_TEST_CHOICE_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = [
  ...questionQualityAdversarialR520261102Records,
  ...questionQualityAdversarialR420261102Records,
  ...questionQualityAdversarialR320261102Records,
  ...questionQualityAdversarial20261102Records,
  ...questionQuality20261102Records,
  ...questionQualityOwnerRound2Records,
  ...questionQualityReviewRecords,
  ...questionQualityPilotRecords,
  ...terminalServices,
  ...gateRouteOverrides,
  ...stagedResultGates,
  ...testOnlyContinuations,
  ...gs028October2Records,
  ...gs028October3Records,
  ...gs028October7Records,
  ...gs028October7Variety2Records,
  // Planned specialist sentinel-node staging; no generic clinic biopsy alias.
  ...GS028_20261007_LEVEL3_TIMING_ENTRIES.flatMap((entry): ExactTestChoiceOrderRecord[] => entry.classification.kind === "test_choices" ? entry.classification.choices.flatMap((choice): ExactTestChoiceOrderRecord[] => choice.timing.kind === "test" ? [{ caseId: entry.caseId, nodeId: entry.nodeId, questionVariantId: entry.questionVariantId, choiceId: choice.choiceId, choiceLabel: choice.choiceLabel, timingProfileId: choice.timing.timingProfileId, disposition: { kind: "not_executed", reason: "specialist_or_unsupported_service" } }] : []) : []),
  ...explicitNonExecutionRecords,
  ...existingTerminalProcedureRecords,
  // Exact outside-plan discussions, including distractors. Timing is a preview;
  // these clinic questions never submit a procedure or external service order.
  ...VARIETY3_TIMING_ENTRIES.flatMap((entry): ExactTestChoiceOrderRecord[] =>
    entry.classification.kind === "test_choices" ? entry.classification.choices.flatMap((choice): ExactTestChoiceOrderRecord[] =>
      choice.timing.kind === "test" ? [record(entry.caseId, entry.nodeId, entry.questionVariantId,
        choice.choiceId, choice.choiceLabel, choice.timing.timingProfileId,
        { kind: "not_executed", reason: "external_only" })] : []) : []),
  ...questionFlag20261104Records,
  ...questionFlagRound2Records,
  ...questionBankBatch2aRecords,
  // BEGIN N1 append — presentation-only clinic/outside-plan choices.
  ...QUESTION_NEW_N1_TEST_ORDER_RECORDS,
  // END N1 append.
  ...questionFlagRound3Records,
  // BEGIN N2 append — no new executed service or result gate.
  ...QUESTION_NEW_N2_TEST_ORDER_RECORDS,
  // END N2 append.
  ...questionBankBatch2aRound2Records,
  // BEGIN N1 ROUND2 append — keep original N1 and N2 records for frozen charts.
  ...QUESTION_NEW_N1_ROUND2_TEST_ORDER_RECORDS,
  // END N1 ROUND2 append.
  ...QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS,
  // BEGIN N2 ROUND2 append — retain original/frozen order records.
  ...QUESTION_NEW_N2_ROUND2_TEST_ORDER_RECORDS,
  // END N2 ROUND2 append.
  ...QUESTION_BANK_BATCH2A_ROUND3_TEST_ORDER_RECORDS,
  // BEGIN N1 ROUND3 exact-order append
  ...QUESTION_NEW_N1_ROUND3_TEST_ORDER_RECORDS,
  // END N1 ROUND3 exact-order append
  // BEGIN N2 ROUND3 exact-order append
  ...QUESTION_NEW_N2_ROUND3_TEST_ORDER_RECORDS,
  // END N2 ROUND3 exact-order append
  ...QUESTION_BANK_BATCH2B_ROUND2_TEST_ORDER_RECORDS,
  // BEGIN N3 exact-order append - external-only records, old identities retained.
  ...QUESTION_NEW_N3_TEST_ORDER_RECORDS,
  // END N3 exact-order append.
  // BEGIN N3 ROUND2 exact-order append - retained versions remain available.
  ...QUESTION_NEW_N3_ROUND2_TEST_ORDER_RECORDS,
  // END N3 ROUND2 exact-order append.
  // BEGIN N3 ROUND3 explicit candidate exact-order append.
  ...QUESTION_NEW_N3_ROUND3_TEST_ORDER_RECORDS,
  ...QUESTION_HARDEN1_N3R4_TEST_ORDER_RECORDS,
  // END N3 ROUND3 explicit candidate exact-order append.
  // BEGIN FLAGS2 accepted whole-case preview bindings 20261105
  ...QUESTION_FLAGS2_WHOLE_CASE_TEST_ORDER_RECORDS,
  // BEGIN FLAGS3 exact accepted preview bindings 20261107
  ...QUESTION_FLAGS3_ACCEPTED_TEST_ORDER_RECORDS,
  // END FLAGS3 exact accepted preview bindings 20261107
  // END FLAGS2 accepted whole-case preview bindings 20261105
];

// BEGIN N3 exact-order append - external-only records, old identities retained.
import { QUESTION_NEW_N3_TEST_ORDER_RECORDS } from "./question-new-n3-test-orders";
// END N3 exact-order append.
// BEGIN N3 ROUND2 exact-order append.
import { QUESTION_NEW_N3_ROUND2_TEST_ORDER_RECORDS } from "./question-new-n3-round2-test-orders";
// END N3 ROUND2 exact-order append.

// BEGIN N3 ROUND3 explicit candidate exact-order append.
import { QUESTION_NEW_N3_ROUND3_TEST_ORDER_RECORDS } from "./question-new-n3-round3-test-orders";
// END N3 ROUND3 explicit candidate exact-order append.

// BEGIN FLAGS2 accepted whole-case preview bindings 20261105
import { QUESTION_FLAGS2_WHOLE_CASE_TEST_ORDER_RECORDS } from "@gamify-surgery/clinical-content";
// END FLAGS2 accepted whole-case preview bindings 20261105

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

// BEGIN FLAGS3 exact accepted preview bindings 20261107
import { QUESTION_FLAGS3_ACCEPTED_TEST_ORDER_RECORDS } from "@gamify-surgery/clinical-content";
// END FLAGS3 exact accepted preview bindings 20261107

// Exact accepted N3R4 external-only identities; no service execution or acceptance check.
import {QUESTION_HARDEN1_N3R4_TEST_ORDER_RECORDS} from "./question-harden1-n3r4-test-orders";
