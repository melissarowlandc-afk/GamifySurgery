import { answerChoiceTimingRegistryEntrySchema, type AnswerChoiceTimingRegistryEntry } from "./schema";
import { BOARD_EXPANSION_TIMING_ENTRIES } from "./development-batch/2026-09-11/board-expansion-batch";
import { BOARD_EXPANSION_20260912_TIMING_ENTRIES } from "./development-batch/2026-09-12/board-expansion-batch";
import { EARLY_LEVELS_20260913_TIMING_ENTRIES } from "./development-batch/2026-09-13/early-levels-batch";
import { BRIEF_EARLY_LEVELS_20260917_TIMING_ENTRIES } from "./development-batch/2026-09-17/brief-early-levels-batch";
import { BREAD_BUTTER_20260917_TIMING_ENTRIES } from "./development-batch/2026-09-17-bread-and-butter/bread-butter-batch";

/**
 * Explicit presentation-only timing classifications for every node in the admitted bank.
 * Durations live in balance config; exact labels prevent stale frozen content from receiving
 * a partial or guessed preview. This metadata never schedules clinical results.
 */
const existingEntries: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.ventral-hernia.pulmonary-optimization.a",
    "nodeId": "node.ventral-hernia.pulmonary-optimization.v1",
    "questionVariantId": "question.ventral-hernia.pulmonary-optimization.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ventral-hernia.pulmonary-optimization.b",
    "nodeId": "node.ventral-hernia.pulmonary-optimization.v2",
    "questionVariantId": "question.ventral-hernia.pulmonary-optimization.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.breast-cyst.under-30-asymptomatic-simple",
    "nodeId": "node.breast-mass.under-30-initial-ultrasound.v1",
    "questionVariantId": "question.breast-mass.under-30-initial-ultrasound.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "targeted_ultrasound",
          "choiceLabel": "Order targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "diagnostic_mammography",
          "choiceLabel": "Order diagnostic mammography as the initial study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "breast_mri",
          "choiceLabel": "Order contrast-enhanced breast MRI as the initial study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "core_biopsy",
          "choiceLabel": "Proceed directly to core-needle biopsy before imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_core_biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.breast-cyst.under-30-asymptomatic-simple",
    "nodeId": "node.breast-cyst.asymptomatic-simple-observation.v1",
    "questionVariantId": "question.breast-cyst.asymptomatic-simple-observation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "routine_care",
          "choiceLabel": "Reassure; no cyst-directed procedure is needed",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "aspirate_asymptomatic",
          "choiceLabel": "Aspirate the cyst despite the absence of symptoms",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "core_biopsy_simple",
          "choiceLabel": "Perform core-needle biopsy of the concordant simple cyst",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_core_biopsy"
          }
        },
        {
          "choiceId": "excise_simple",
          "choiceLabel": "Refer for surgical excision of the simple cyst",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.breast-cyst.under-30-painful-simple",
    "nodeId": "node.breast-mass.under-30-initial-ultrasound.v2",
    "questionVariantId": "question.breast-mass.under-30-initial-ultrasound.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "targeted_ultrasound",
          "choiceLabel": "Order targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "diagnostic_mammography",
          "choiceLabel": "Order diagnostic mammography as the initial study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "breast_mri",
          "choiceLabel": "Order contrast-enhanced breast MRI as the initial study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "core_biopsy",
          "choiceLabel": "Proceed directly to core-needle biopsy before imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_core_biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.breast-cyst.under-30-painful-simple",
    "nodeId": "node.breast-cyst.symptomatic-simple-aspiration.v1",
    "questionVariantId": "question.breast-cyst.symptomatic-simple-aspiration.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "needle_aspiration",
          "choiceLabel": "Offer needle aspiration of the cyst for symptom relief",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "surgical_excision",
          "choiceLabel": "Refer directly for surgical excision solely because the cyst is painful",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "core_biopsy_painful",
          "choiceLabel": "Perform core-needle biopsy despite concordant simple-cyst imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_core_biopsy"
          }
        },
        {
          "choiceId": "empiric_antibiotics",
          "choiceLabel": "Treat with empiric antibiotics despite no infection findings",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.ebv-associated-malignancy.burkitt",
    "nodeId": "node.ebv-associated-malignancy.burkitt.v1",
    "questionVariantId": "question.ebv-associated-malignancy.burkitt.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ebv-associated-malignancy.gastric",
    "nodeId": "node.ebv-associated-malignancy.gastric.v1",
    "questionVariantId": "question.ebv-associated-malignancy.gastric.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ebv-associated-malignancy.nasopharyngeal",
    "nodeId": "node.ebv-associated-malignancy.nasopharyngeal.v1",
    "questionVariantId": "question.ebv-associated-malignancy.nasopharyngeal.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.solitary-within",
    "nodeId": "node.hcc.milan.solitary-within.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.solitary-within.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.multifocal-within",
    "nodeId": "node.hcc.milan.multifocal-within.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.multifocal-within.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.solitary-above-size",
    "nodeId": "node.hcc.milan.solitary-above-size.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.solitary-above-size.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.too-many-lesions",
    "nodeId": "node.hcc.milan.too-many-lesions.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.too-many-lesions.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.macrovascular-invasion",
    "nodeId": "node.hcc.milan.macrovascular-invasion.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.macrovascular-invasion.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.extrahepatic-spread",
    "nodeId": "node.hcc.milan.extrahepatic-spread.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.extrahepatic-spread.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.choose-boundary-profile",
    "nodeId": "node.hcc.milan.choose-boundary-profile.v1",
    "questionVariantId": "question.hcc.milan.criteria-to-patient.boundary-profile.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.choose-invasion-spread-profile",
    "nodeId": "node.hcc.milan.choose-invasion-spread-profile.v1",
    "questionVariantId": "question.hcc.milan.criteria-to-patient.invasion-spread-profile.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.choose-multifocal-boundary",
    "nodeId": "node.hcc.milan.choose-multifocal-boundary.v1",
    "questionVariantId": "question.hcc.milan.criteria-to-patient.multifocal-boundary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.milan.choose-combined-profile",
    "nodeId": "node.hcc.milan.choose-combined-profile.v1",
    "questionVariantId": "question.hcc.milan.criteria-to-patient.combined-profile.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.full-pathway",
    "nodeId": "node.mondor-disease.recognition.patient-to-diagnosis.full-pathway",
    "questionVariantId": "question.mondor-disease.recognition.patient-to-diagnosis.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.full-pathway",
    "nodeId": "node.mondor-disease.evaluation.diagnostic-breast-imaging.full-pathway",
    "questionVariantId": "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "diagnostic_mammography_or_dbt_and_targeted_ultrasound",
          "choiceLabel": "Diagnostic mammography and targeted Doppler ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "screening_mammography",
          "choiceLabel": "Routine screening mammography alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "breast_mri",
          "choiceLabel": "Contrast-enhanced breast MRI as the sole initial study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "immediate_excisional_biopsy",
          "choiceLabel": "Immediate excisional biopsy without diagnostic imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.excisional_biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.mondor-disease.full-pathway",
    "nodeId": "node.mondor-disease.management.supportive-care.full-pathway",
    "questionVariantId": "question.mondor-disease.management.supportive-care.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.evaluation-and-management",
    "nodeId": "node.mondor-disease.evaluation.diagnostic-breast-imaging.evaluation-and-management",
    "questionVariantId": "question.mondor-disease.evaluation.diagnostic-breast-imaging.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "diagnostic_mammography_or_dbt_and_targeted_ultrasound",
          "choiceLabel": "Diagnostic mammography and targeted Doppler ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "screening_mammography",
          "choiceLabel": "Routine screening mammography alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "breast_mri",
          "choiceLabel": "Contrast-enhanced breast MRI as the sole initial study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "immediate_excisional_biopsy",
          "choiceLabel": "Immediate excisional biopsy without diagnostic imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.excisional_biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.mondor-disease.evaluation-and-management",
    "nodeId": "node.mondor-disease.management.supportive-care.evaluation-and-management",
    "questionVariantId": "question.mondor-disease.management.supportive-care.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.select-matching-patient",
    "nodeId": "node.mondor-disease.recognition.select-patient.v1",
    "questionVariantId": "question.mondor-disease.recognition.select-patient.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.underlying-process",
    "nodeId": "node.mondor-disease.recognition.underlying-process.v1",
    "questionVariantId": "question.mondor-disease.recognition.underlying-process.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.uncertain-targeted-ultrasound",
    "nodeId": "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
    "questionVariantId": "question.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "targeted_doppler_ultrasound",
          "choiceLabel": "Targeted Doppler ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "screening_mammography",
          "choiceLabel": "Routine screening mammography alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "breast_mri",
          "choiceLabel": "Contrast-enhanced breast MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "core_biopsy",
          "choiceLabel": "Core-needle biopsy before imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_core_biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.mondor-disease.ultrasound-finding",
    "nodeId": "node.mondor-disease.evaluation.ultrasound-finding.v1",
    "questionVariantId": "question.mondor-disease.evaluation.ultrasound-finding.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.safety-boundary",
    "nodeId": "node.mondor-disease.management.safety-boundary.v1",
    "questionVariantId": "question.mondor-disease.management.safety-boundary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.mondor-disease.select-supportive-patient",
    "nodeId": "node.mondor-disease.management.select-supportive-patient.v1",
    "questionVariantId": "question.mondor-disease.management.select-supportive-patient.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.aaa.female-perioperative-mortality.direct",
    "nodeId": "node.aaa.female-perioperative-mortality.direct.v1",
    "questionVariantId": "question.aaa.female-perioperative-mortality.direct.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.aaa.female-perioperative-mortality.repair-approaches",
    "nodeId": "node.aaa.female-perioperative-mortality.repair-approaches.v1",
    "questionVariantId": "question.aaa.female-perioperative-mortality.repair-approaches.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.aaa.female-perioperative-mortality.interpretation",
    "nodeId": "node.aaa.female-perioperative-mortality.interpretation.v1",
    "questionVariantId": "question.aaa.female-perioperative-mortality.interpretation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.aaa.female-perioperative-mortality.mixed-boundaries",
    "nodeId": "node.aaa.female-perioperative-mortality.mixed-boundaries.v1",
    "questionVariantId": "question.aaa.female-perioperative-mortality.mixed-boundaries.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.surveillance-to-progressing-abdominal-wall",
    "nodeId": "node.desmoid.initial-surveillance.new-diagnosis.v1",
    "questionVariantId": "question.desmoid.initial-surveillance.new-diagnosis.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.surveillance-to-progressing-abdominal-wall",
    "nodeId": "node.desmoid.abdominal-wall-surgery.progressing-painful.v1",
    "questionVariantId": "question.desmoid.abdominal-wall-surgery.progressing-painful.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.select-surveillance-patient",
    "nodeId": "node.desmoid.initial-surveillance.select-patient.v1",
    "questionVariantId": "question.desmoid.initial-surveillance.select-patient.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.initial-management-principle",
    "nodeId": "node.desmoid.initial-surveillance.general-principle.v1",
    "questionVariantId": "question.desmoid.initial-surveillance.general-principle.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.stable-follow-up",
    "nodeId": "node.desmoid.initial-surveillance.stable-follow-up.v1",
    "questionVariantId": "question.desmoid.initial-surveillance.stable-follow-up.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.select-abdominal-wall-surgical-candidate",
    "nodeId": "node.desmoid.abdominal-wall-surgery.select-candidate.v1",
    "questionVariantId": "question.desmoid.abdominal-wall-surgery.select-candidate.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.function-preserving-margin",
    "nodeId": "node.desmoid.abdominal-wall-surgery.margin-principle.v1",
    "questionVariantId": "question.desmoid.abdominal-wall-surgery.margin-principle.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.desmoid.location-specific-surgery",
    "nodeId": "node.desmoid.abdominal-wall-surgery.location-specific.v1",
    "questionVariantId": "question.desmoid.abdominal-wall-surgery.location-specific.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pancreatic-tail-adenocarcinoma.clinic-counseling",
    "nodeId": "node.pancreatic-tail-adenocarcinoma.clinic-counseling.v1",
    "questionVariantId": "question.pancreatic-tail-adenocarcinoma.clinic-counseling.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pancreatic-tail-adenocarcinoma.spleen-counseling",
    "nodeId": "node.pancreatic-tail-adenocarcinoma.spleen-counseling.v1",
    "questionVariantId": "question.pancreatic-tail-adenocarcinoma.spleen-counseling.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pancreatic-tail-adenocarcinoma.operative-candidate",
    "nodeId": "node.pancreatic-tail-adenocarcinoma.operative-candidate.v1",
    "questionVariantId": "question.pancreatic-tail-adenocarcinoma.operative-candidate.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pancreatic-tail-adenocarcinoma.referral-plan",
    "nodeId": "node.pancreatic-tail-adenocarcinoma.referral-plan.v1",
    "questionVariantId": "question.pancreatic-tail-adenocarcinoma.referral-plan.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.felty-syndrome.recognition-to-refractory-splenectomy",
    "nodeId": "node.felty-syndrome.classic-recognition.v1",
    "questionVariantId": "question.felty-syndrome.classic-recognition.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.felty-syndrome.recognition-to-refractory-splenectomy",
    "nodeId": "node.felty-syndrome.initial-treatment.v1",
    "questionVariantId": "question.felty-syndrome.initial-treatment.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.felty-syndrome.recognition-to-refractory-splenectomy",
    "nodeId": "node.felty-syndrome.refractory-disease.v1",
    "questionVariantId": "question.felty-syndrome.refractory-disease.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.felty-syndrome.no-splenomegaly-boundary",
    "nodeId": "node.felty-syndrome.no-splenomegaly-boundary.v1",
    "questionVariantId": "question.felty-syndrome.no-splenomegaly-boundary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.felty-syndrome.reverse-pattern",
    "nodeId": "node.felty-syndrome.reverse-pattern.v1",
    "questionVariantId": "question.felty-syndrome.reverse-pattern.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.felty-syndrome.treatment-principle",
    "nodeId": "node.felty-syndrome.treatment-principle.v1",
    "questionVariantId": "question.felty-syndrome.treatment-principle.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.fhh.evaluation-to-confirmed-management",
    "nodeId": "node.fhh.initial-biochemical-evaluation.v1",
    "questionVariantId": "question.fhh.initial-biochemical-evaluation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "paired_24h_urine_serum_values",
          "choiceLabel": "24-hour urine calcium and creatinine with paired serum values",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "localization_before_differentiation",
          "choiceLabel": "Neck ultrasound and sestamibi before biochemical differentiation",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "parathyroid_biopsy",
          "choiceLabel": "Parathyroid biopsy to distinguish inherited from sporadic disease",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "magnesium_alone",
          "choiceLabel": "Serum magnesium alone as the definitive discriminator",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.fhh.evaluation-to-confirmed-management",
    "nodeId": "node.fhh.confirmed-return-management.v1",
    "questionVariantId": "question.fhh.confirmed-return-management.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.fhh.suggestive-results-confirmation",
    "nodeId": "node.fhh.suggestive-results-confirmation.v1",
    "questionVariantId": "question.fhh.suggestive-results-confirmation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "suspect_fhh_genetic_testing",
          "choiceLabel": "Suspect FHH and arrange genetic testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.genetic"
          }
        },
        {
          "choiceId": "diagnose_phpt_schedule_surgery",
          "choiceLabel": "Diagnose primary hyperparathyroidism and schedule surgery",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "ratio_alone_confirms_fhh",
          "choiceLabel": "Diagnose FHH from the clearance ratio alone",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "malignancy_hypercalcemia",
          "choiceLabel": "Diagnose malignancy-associated hypercalcemia from this pattern",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.fhh.confirmed-asymptomatic-management",
    "nodeId": "node.fhh.confirmed-asymptomatic-management.v1",
    "questionVariantId": "question.fhh.confirmed-asymptomatic-management.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.fhh.parathyroid-surgery-counseling",
    "nodeId": "node.fhh.parathyroid-surgery-counseling.v1",
    "questionVariantId": "question.fhh.parathyroid-surgery-counseling.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.lymphangitis.toe-inguinal",
    "nodeId": "node.lymphangitis.toe-inguinal.v1",
    "questionVariantId": "question.lymphangitis.toe-inguinal.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.lymphangitis.palm-axillary",
    "nodeId": "node.lymphangitis.palm-axillary.v1",
    "questionVariantId": "question.lymphangitis.palm-axillary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.lymphangitis.reverse-axillary",
    "nodeId": "node.lymphangitis.reverse-axillary.v1",
    "questionVariantId": "question.lymphangitis.reverse-axillary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.lymphangitis.finger-axillary",
    "nodeId": "node.lymphangitis.finger-axillary.v1",
    "questionVariantId": "question.lymphangitis.finger-axillary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallbladder-polyp.16mm",
    "nodeId": "node.gallbladder-polyp.16mm.v1",
    "questionVariantId": "question.gallbladder-polyp.16mm.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "refer_cholecystectomy",
          "choiceLabel": "Refer for cholecystectomy evaluation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "ultrasound_surveillance",
          "choiceLabel": "Ultrasound surveillance for this patient",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "no_follow_up",
          "choiceLabel": "No further follow-up is needed after this completed ultrasound report",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallbladder-polyp.12mm-wall-thickening",
    "nodeId": "node.gallbladder-polyp.12mm-wall-thickening.v1",
    "questionVariantId": "question.gallbladder-polyp.12mm-wall-thickening.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "refer_cholecystectomy",
          "choiceLabel": "Refer for cholecystectomy evaluation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "ultrasound_surveillance",
          "choiceLabel": "Ultrasound surveillance for this patient",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "no_follow_up",
          "choiceLabel": "No further follow-up after this report",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallbladder-polyp.8mm-thick-stalk",
    "nodeId": "node.gallbladder-polyp.8mm-thick-stalk.v1",
    "questionVariantId": "question.gallbladder-polyp.8mm-thick-stalk.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ultrasound_surveillance",
          "choiceLabel": "Ultrasound surveillance for this patient",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "refer_cholecystectomy",
          "choiceLabel": "Refer for cholecystectomy evaluation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "no_follow_up",
          "choiceLabel": "No further follow-up is needed after this completed ultrasound report",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallbladder-polyp.4mm-thin-stalk",
    "nodeId": "node.gallbladder-polyp.4mm-thin-stalk.v1",
    "questionVariantId": "question.gallbladder-polyp.4mm-thin-stalk.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "no_follow_up",
          "choiceLabel": "No further follow-up after this report",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "refer_cholecystectomy",
          "choiceLabel": "Refer for cholecystectomy evaluation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "ultrasound_surveillance",
          "choiceLabel": "Ultrasound surveillance for this patient",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallbladder-polyp.select-surgical-profile",
    "nodeId": "node.gallbladder-polyp.select-surgical-profile.v1",
    "questionVariantId": "question.gallbladder-polyp.select-surgical-profile.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallbladder-polyp.select-surveillance-profile",
    "nodeId": "node.gallbladder-polyp.select-surveillance-profile.v1",
    "questionVariantId": "question.gallbladder-polyp.select-surveillance-profile.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.distal-cholangiocarcinoma.active-treatment",
    "nodeId": "node.distal-cholangiocarcinoma.management-b.v1",
    "questionVariantId": "question.distal-cholangiocarcinoma.management-b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.distal-cholangiocarcinoma.active-location",
    "nodeId": "node.distal-cholangiocarcinoma.management-c.v1",
    "questionVariantId": "question.distal-cholangiocarcinoma.management-c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.obstructive-jaundice.vitamin-k.bleeding",
    "nodeId": "node.obstructive-jaundice.vitamin-k.bleeding.v1",
    "questionVariantId": "question.obstructive-jaundice.vitamin-k.bleeding.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.obstructive-jaundice.vitamin-k.mechanism",
    "nodeId": "node.obstructive-jaundice.vitamin-k.mechanism.v1",
    "questionVariantId": "question.obstructive-jaundice.vitamin-k.mechanism.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.obstructive-jaundice.vitamin-k.lab",
    "nodeId": "node.obstructive-jaundice.vitamin-k.lab.v1",
    "questionVariantId": "question.obstructive-jaundice.vitamin-k.lab.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.obstructive-jaundice.vitamin-k.reverse",
    "nodeId": "node.obstructive-jaundice.vitamin-k.reverse.v1",
    "questionVariantId": "question.obstructive-jaundice.vitamin-k.reverse.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.resection.direct-selection",
    "nodeId": "node.hcc.resection.direct-selection",
    "questionVariantId": "question.hcc.resection.direct-selection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.resection.milan-trap",
    "nodeId": "node.hcc.resection.milan-trap",
    "questionVariantId": "question.hcc.resection.milan-trap.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.resection.candidate-profile",
    "nodeId": "node.hcc.resection.candidate-profile",
    "questionVariantId": "question.hcc.resection.candidate-profile.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.resection.future-liver-remnant",
    "nodeId": "node.hcc.resection.future-liver-remnant",
    "questionVariantId": "question.hcc.resection.future-liver-remnant.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.resection.combined-milan-to-resection",
    "nodeId": "node.hcc.resection.combined.milan.v1",
    "questionVariantId": "question.hcc.milan.patient-to-criteria.solitary-within.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hcc.resection.combined-milan-to-resection",
    "nodeId": "node.hcc.resection.combined.direct-selection.v1",
    "questionVariantId": "question.hcc.resection.direct-selection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.accessory-spleen.preoperative-counseling",
    "nodeId": "node.accessory-spleen.preoperative-counseling.v1",
    "questionVariantId": "question.accessory-spleen.preoperative-counseling.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.accessory-spleen.imaging-review",
    "nodeId": "node.accessory-spleen.imaging-review.v1",
    "questionVariantId": "question.accessory-spleen.imaging-review.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.accessory-spleen.hospital-planning",
    "nodeId": "node.accessory-spleen.hospital-planning.v1",
    "questionVariantId": "question.accessory-spleen.hospital-planning.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.accessory-spleen.reverse-location",
    "nodeId": "node.accessory-spleen.reverse-location.v1",
    "questionVariantId": "question.accessory-spleen.reverse-location.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.postsplenectomy.reassess",
    "nodeId": "node.hs.postsplenectomy.reassess.v1",
    "questionVariantId": "question.hs.postsplenectomy.reassess.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.postsplenectomy.howell-jolly",
    "nodeId": "node.hs.postsplenectomy.howell-jolly.v1",
    "questionVariantId": "question.hs.postsplenectomy.howell-jolly.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.postsplenectomy.reverse",
    "nodeId": "node.hs.postsplenectomy.reverse.v1",
    "questionVariantId": "question.hs.postsplenectomy.reverse.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.accessory-spleen.hospital-referral",
    "nodeId": "node.hs.accessory-spleen.hospital-referral.v1",
    "questionVariantId": "question.hs.accessory-spleen.hospital-referral.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.accessory-spleen.incidental",
    "nodeId": "node.hs.accessory-spleen.incidental.v1",
    "questionVariantId": "question.hs.accessory-spleen.incidental.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.accessory-spleen.threshold",
    "nodeId": "node.hs.accessory-spleen.threshold.v1",
    "questionVariantId": "question.hs.accessory-spleen.threshold.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.hs.postsplenectomy.combined-evaluation-to-referral",
    "nodeId": "node.hs.postsplenectomy.scintigraphy.v1",
    "questionVariantId": "question.hs.postsplenectomy.scintigraphy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "heat_damaged_rbc",
          "choiceLabel": "Order Tc-99m heat-damaged RBC scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "sulfur_colloid",
          "choiceLabel": "Order Tc-99m sulfur-colloid scintigraphy to identify splenic tissue",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "noncontrast_ct",
          "choiceLabel": "Order noncontrast abdominal CT to identify splenic tissue",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.hs.postsplenectomy.combined-evaluation-to-referral",
    "nodeId": "node.hs.accessory-spleen.hospital-referral.v1",
    "questionVariantId": "question.hs.accessory-spleen.hospital-referral.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ipaa.pouchitis.1a",
    "nodeId": "node.ipaa.pouchitis.1a",
    "questionVariantId": "question.ipaa.pouchitis.1a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ipaa.pouchitis.1b",
    "nodeId": "node.ipaa.pouchitis.1b",
    "questionVariantId": "question.ipaa.pouchitis.1b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ipaa.pouchitis.1c",
    "nodeId": "node.ipaa.pouchitis.1c",
    "questionVariantId": "question.ipaa.pouchitis.1c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.ipaa.pouchitis.1d",
    "nodeId": "node.ipaa.pouchitis.1d",
    "questionVariantId": "question.ipaa.pouchitis.1d.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.choledochal-cyst.type-iva.2a",
    "nodeId": "node.choledochal-cyst.type-iva.2a",
    "questionVariantId": "question.choledochal-cyst.type-iva.2a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.choledochal-cyst.type-iva.2b",
    "nodeId": "node.choledochal-cyst.type-iva.2b",
    "questionVariantId": "question.choledochal-cyst.type-iva.2b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.choledochal-cyst.type-iva.2c",
    "nodeId": "node.choledochal-cyst.type-iva.2c",
    "questionVariantId": "question.choledochal-cyst.type-iva.2c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.choledochal-cyst.type-iva.2d",
    "nodeId": "node.choledochal-cyst.type-iva.2d",
    "questionVariantId": "question.choledochal-cyst.type-iva.2d.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-hsil.hpv.3a",
    "nodeId": "node.anal-hsil.hpv.3a",
    "questionVariantId": "question.anal-hsil.hpv.3a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-hsil.hpv.3b",
    "nodeId": "node.anal-hsil.hpv.3b",
    "questionVariantId": "question.anal-hsil.hpv.3b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-hsil.hpv.3c",
    "nodeId": "node.anal-hsil.hpv.3c",
    "questionVariantId": "question.anal-hsil.hpv.3c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-hsil.hpv.3d",
    "nodeId": "node.anal-hsil.hpv.3d",
    "questionVariantId": "question.anal-hsil.hpv.3d.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.1a",
    "nodeId": "node.men2a.1a",
    "questionVariantId": "question.men2a.1a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.1b",
    "nodeId": "node.men2a.1b",
    "questionVariantId": "question.men2a.1b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.1c",
    "nodeId": "node.men2a.1c",
    "questionVariantId": "question.men2a.1c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.1d",
    "nodeId": "node.men2a.1d",
    "questionVariantId": "question.men2a.1d.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.2a",
    "nodeId": "node.men2a.2a",
    "questionVariantId": "question.men2a.2a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.2b",
    "nodeId": "node.men2a.2b",
    "questionVariantId": "question.men2a.2b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.2c",
    "nodeId": "node.men2a.2c",
    "questionVariantId": "question.men2a.2c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.2d",
    "nodeId": "node.men2a.2d",
    "questionVariantId": "question.men2a.2d.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.3a",
    "nodeId": "node.men2a.3a",
    "questionVariantId": "question.men2a.3a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.3b",
    "nodeId": "node.men2a.3b",
    "questionVariantId": "question.men2a.3b.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.3c",
    "nodeId": "node.men2a.3c",
    "questionVariantId": "question.men2a.3c.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.men2a.3d",
    "nodeId": "node.men2a.3d",
    "questionVariantId": "question.men2a.3d.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.management.patient-to-plan.v1",
    "questionVariantId": "question.colonic-lipoma.management.patient-to-plan.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "no_directed_treatment_or_surveillance",
          "choiceLabel": "No lipoma-directed removal or dedicated surveillance; continue ordinary follow-up based on the rest of the colonoscopy and the patient's usual indications",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "immediate_endoscopic_resection",
          "choiceLabel": "Immediate endoscopic resection solely because the lesion was found",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "annual_colonoscopy_for_lipoma",
          "choiceLabel": "Annual colonoscopy solely to monitor the lipoma",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "segmental_colectomy",
          "choiceLabel": "Segmental colectomy",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.management.patient-to-plan.v2",
    "questionVariantId": "question.colonic-lipoma.management.patient-to-plan.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "no_lesion_specific_follow_up",
          "choiceLabel": "No lesion-specific treatment or surveillance",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "eus_with_tissue_acquisition",
          "choiceLabel": "Endoscopic ultrasound with tissue acquisition despite the characteristic appearance",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "remove_solely_because_found",
          "choiceLabel": "Endoscopic removal solely because the lesion was found",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "elective_segmental_colectomy",
          "choiceLabel": "Elective segmental colectomy",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.vitamin-identification.v1",
    "nodeId": "node.wound-healing.vitamin-c.vitamin-identification.v1",
    "questionVariantId": "question.wound-healing.vitamin-c.vitamin-identification.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.biochemical-step.v1",
    "nodeId": "node.wound-healing.vitamin-c.biochemical-step.v1",
    "questionVariantId": "question.wound-healing.vitamin-c.biochemical-step.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.mechanism-explanation.v1",
    "nodeId": "node.wound-healing.vitamin-c.mechanism-explanation.v1",
    "questionVariantId": "question.wound-healing.vitamin-c.mechanism-explanation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.wound-healing.vitamin-c.mechanism-consequence.v1",
    "nodeId": "node.wound-healing.vitamin-c.mechanism-consequence.v1",
    "questionVariantId": "question.wound-healing.vitamin-c.mechanism-consequence.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.integrated-pathology-diagnosis.v1",
    "questionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "questionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.pathology-profile-selection.v1",
    "questionVariantId": "question.gastric-malt.pathology-profile-selection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.eradication-response-reassessment.v1",
    "questionVariantId": "question.gastric-malt.eradication-response-reassessment.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-malt.eradication-patient-selection.v1",
    "nodeId": "node.gastric-malt.eradication-patient-selection.v1",
    "questionVariantId": "question.gastric-malt.eradication-patient-selection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastroparesis.general-confirmatory-testing.v1",
    "nodeId": "node.gastroparesis.general-confirmatory-testing.v1",
    "questionVariantId": "question.gastroparesis.general-confirmatory-testing.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "esophageal_manometry_impedance",
          "choiceLabel": "High-resolution esophageal manometry with impedance",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "four_hour_solid_meal_scintigraphy",
          "choiceLabel": "Four-hour solid-meal gastric emptying scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.four_hour_protocol"
          }
        },
        {
          "choiceId": "repeat_endoscopy_biopsies",
          "choiceLabel": "Repeat upper endoscopy with systematic gastric biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "ambulatory_esophageal_ph",
          "choiceLabel": "Twenty-four-hour ambulatory esophageal pH monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.four_hour_protocol"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.gastroparesis.diabetes-confirmatory-testing.v1",
    "nodeId": "node.gastroparesis.diabetes-confirmatory-testing.v1",
    "questionVariantId": "question.gastroparesis.diabetes-confirmatory-testing.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "upper_gi_small_bowel_follow_through",
          "choiceLabel": "Upper gastrointestinal contrast study with small-bowel follow-through",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "ambulatory_reflux_monitoring",
          "choiceLabel": "Prolonged ambulatory reflux monitoring off acid suppression",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "four_hour_standardized_meal_scintigraphy",
          "choiceLabel": "Four-hour scintigraphy after a standardized solid meal",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.four_hour_protocol"
          }
        },
        {
          "choiceId": "esophageal_manometry_impedance_monitoring",
          "choiceLabel": "High-resolution esophageal manometry with impedance monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.gastroparesis.postsurgical-confirmatory-testing.v1",
    "nodeId": "node.gastroparesis.postsurgical-confirmatory-testing.v1",
    "questionVariantId": "question.gastroparesis.postsurgical-confirmatory-testing.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "repeat_endoscopy_after_fast",
          "choiceLabel": "Repeat endoscopy after an overnight fast with gastric biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "four_hour_solid_meal_scintigraphy",
          "choiceLabel": "Four-hour solid-meal gastric emptying scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.four_hour_protocol"
          }
        },
        {
          "choiceId": "esophageal_manometry_impedance",
          "choiceLabel": "High-resolution esophageal manometry with impedance",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "ambulatory_ph_off_therapy",
          "choiceLabel": "Twenty-four-hour ambulatory pH monitoring off therapy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.four_hour_protocol"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.gastroparesis.objective-result-selection.v1",
    "nodeId": "node.gastroparesis.objective-result-selection.v1",
    "questionVariantId": "question.gastroparesis.objective-result-selection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "nodeId": "node.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "questionVariantId": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "nodeId": "node.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "questionVariantId": "question.gastric-adenocarcinoma.spleen-preservation-counseling.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "perform_endoscopic_hemostasis",
          "choiceLabel": "Perform endoscopic hemostasis",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "oral_ppi_without_hemostasis",
          "choiceLabel": "Give oral PPI without endoscopic treatment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "biopsy_vessel",
          "choiceLabel": "Biopsy the visible vessel before treatment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "repeat_egd_without_treatment",
          "choiceLabel": "Schedule repeat EGD without treating the vessel",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "nodeId": "node.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "nodeId": "node.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
    "nodeId": "node.distal-cholangiocarcinoma.workup-a.v1",
    "questionVariantId": "question.distal-cholangiocarcinoma.workup-a.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "eus_ercp_sampling",
          "choiceLabel": "EUS-guided sampling with ERCP brushings",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "percutaneous_biopsy",
          "choiceLabel": "Percutaneous transhepatic biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "pet_without_tissue",
          "choiceLabel": "PET-CT without tissue sampling",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
    "nodeId": "node.distal-cholangiocarcinoma.management-a.v1",
    "questionVariantId": "question.distal-cholangiocarcinoma.management-a.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-pattern-recognition.v1",
    "nodeId": "node.graves-pattern-recognition.v1",
    "questionVariantId": "question.graves-pattern-recognition.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-pattern-recognition.v2",
    "nodeId": "node.graves-pattern-recognition.v2",
    "questionVariantId": "question.graves-pattern-recognition.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-pattern-recognition.v3",
    "nodeId": "node.graves-pattern-recognition.v3",
    "questionVariantId": "question.graves-pattern-recognition.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-pattern-recognition.v4",
    "nodeId": "node.graves-pattern-recognition.v4",
    "questionVariantId": "question.graves-pattern-recognition.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-trab-diagnostic-support.v1",
    "nodeId": "node.graves-trab-diagnostic-support.v1",
    "questionVariantId": "question.graves-trab-diagnostic-support.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "answer.graves-trab-diagnostic-support.v1.1",
          "choiceLabel": "Total T3 measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "answer.graves-trab-diagnostic-support.v1.2",
          "choiceLabel": "Free T4 measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "answer.graves-trab-diagnostic-support.v1.3",
          "choiceLabel": "TSH measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "answer.graves-trab-diagnostic-support.v1.4",
          "choiceLabel": "TRAb measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.graves-trab-diagnostic-support.v2",
    "nodeId": "node.graves-trab-diagnostic-support.v2",
    "questionVariantId": "question.graves-trab-diagnostic-support.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-trab-diagnostic-support.v3",
    "nodeId": "node.graves-trab-diagnostic-support.v3",
    "questionVariantId": "question.graves-trab-diagnostic-support.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-trab-diagnostic-support.v4",
    "nodeId": "node.graves-trab-diagnostic-support.v4",
    "questionVariantId": "question.graves-trab-diagnostic-support.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-appropriate-candidate.v1",
    "nodeId": "node.graves-rai-appropriate-candidate.v1",
    "questionVariantId": "question.graves-rai-appropriate-candidate.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-appropriate-candidate.v2",
    "nodeId": "node.graves-rai-appropriate-candidate.v2",
    "questionVariantId": "question.graves-rai-appropriate-candidate.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-appropriate-candidate.v3",
    "nodeId": "node.graves-rai-appropriate-candidate.v3",
    "questionVariantId": "question.graves-rai-appropriate-candidate.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-appropriate-candidate.v4",
    "nodeId": "node.graves-rai-appropriate-candidate.v4",
    "questionVariantId": "question.graves-rai-appropriate-candidate.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-pregnancy-contraindication.v1",
    "nodeId": "node.graves-rai-pregnancy-contraindication.v1",
    "questionVariantId": "question.graves-rai-pregnancy-contraindication.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-pregnancy-contraindication.v2",
    "nodeId": "node.graves-rai-pregnancy-contraindication.v2",
    "questionVariantId": "question.graves-rai-pregnancy-contraindication.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-pregnancy-contraindication.v3",
    "nodeId": "node.graves-rai-pregnancy-contraindication.v3",
    "questionVariantId": "question.graves-rai-pregnancy-contraindication.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-pregnancy-contraindication.v4",
    "nodeId": "node.graves-rai-pregnancy-contraindication.v4",
    "questionVariantId": "question.graves-rai-pregnancy-contraindication.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-lactation-contraindication.v1",
    "nodeId": "node.graves-rai-lactation-contraindication.v1",
    "questionVariantId": "question.graves-rai-lactation-contraindication.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-lactation-contraindication.v2",
    "nodeId": "node.graves-rai-lactation-contraindication.v2",
    "questionVariantId": "question.graves-rai-lactation-contraindication.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-lactation-contraindication.v3",
    "nodeId": "node.graves-rai-lactation-contraindication.v3",
    "questionVariantId": "question.graves-rai-lactation-contraindication.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-lactation-contraindication.v4",
    "nodeId": "node.graves-rai-lactation-contraindication.v4",
    "questionVariantId": "question.graves-rai-lactation-contraindication.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-active-ted-avoidance.v1",
    "nodeId": "node.graves-rai-active-ted-avoidance.v1",
    "questionVariantId": "question.graves-rai-active-ted-avoidance.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-active-ted-avoidance.v2",
    "nodeId": "node.graves-rai-active-ted-avoidance.v2",
    "questionVariantId": "question.graves-rai-active-ted-avoidance.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-active-ted-avoidance.v3",
    "nodeId": "node.graves-rai-active-ted-avoidance.v3",
    "questionVariantId": "question.graves-rai-active-ted-avoidance.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.graves-rai-active-ted-avoidance.v4",
    "nodeId": "node.graves-rai-active-ted-avoidance.v4",
    "questionVariantId": "question.graves-rai-active-ted-avoidance.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-postmeal-episodes",
    "nodeId": "node.gallstones.symptomatic-postmeal-episodes.1",
    "questionVariantId": "question.gallstones.initial-ultrasound.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "abdominal_ultrasound_1",
          "choiceLabel": "Abdominal ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "abdominal_ct_1",
          "choiceLabel": "Contrast-enhanced abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mrcp_1",
          "choiceLabel": "Magnetic resonance cholangiopancreatography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "hida_1",
          "choiceLabel": "Hepatobiliary scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-postmeal-episodes",
    "nodeId": "node.gallstones.symptomatic-postmeal-episodes.2",
    "questionVariantId": "question.gallstones.symptomatic-surgical-referral.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-episodic-night-pain",
    "nodeId": "node.gallstones.symptomatic-episodic-night-pain.1",
    "questionVariantId": "question.gallstones.initial-ultrasound.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "abdominal_ultrasound_2",
          "choiceLabel": "Abdominal ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "abdominal_ct_2",
          "choiceLabel": "Contrast-enhanced abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mrcp_2",
          "choiceLabel": "Magnetic resonance cholangiopancreatography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "hida_2",
          "choiceLabel": "Hepatobiliary scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-episodic-night-pain",
    "nodeId": "node.gallstones.symptomatic-episodic-night-pain.2",
    "questionVariantId": "question.gallstones.symptomatic-surgical-referral.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-recurrent-epigastric-pain",
    "nodeId": "node.gallstones.symptomatic-recurrent-epigastric-pain.1",
    "questionVariantId": "question.gallstones.initial-ultrasound.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "abdominal_ultrasound_3",
          "choiceLabel": "Abdominal ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "abdominal_ct_3",
          "choiceLabel": "Contrast-enhanced abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mrcp_3",
          "choiceLabel": "Magnetic resonance cholangiopancreatography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "hida_3",
          "choiceLabel": "Hepatobiliary scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-recurrent-epigastric-pain",
    "nodeId": "node.gallstones.symptomatic-recurrent-epigastric-pain.2",
    "questionVariantId": "question.gallstones.symptomatic-surgical-referral.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-fatty-food-pain",
    "nodeId": "node.gallstones.symptomatic-fatty-food-pain.1",
    "questionVariantId": "question.gallstones.initial-ultrasound.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "abdominal_ultrasound_4",
          "choiceLabel": "Abdominal ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "abdominal_ct_4",
          "choiceLabel": "Contrast-enhanced abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mrcp_4",
          "choiceLabel": "Magnetic resonance cholangiopancreatography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "hida_4",
          "choiceLabel": "Hepatobiliary scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gallstones.symptomatic-fatty-food-pain",
    "nodeId": "node.gallstones.symptomatic-fatty-food-pain.2",
    "questionVariantId": "question.gallstones.symptomatic-surgical-referral.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.incidental-checkup",
    "nodeId": "node.gallstones.incidental-checkup.1",
    "questionVariantId": "question.gallstones.incidental-observation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.incidental-liver-study",
    "nodeId": "node.gallstones.incidental-liver-study.1",
    "questionVariantId": "question.gallstones.incidental-observation.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.incidental-vascular-ct",
    "nodeId": "node.gallstones.incidental-vascular-ct.1",
    "questionVariantId": "question.gallstones.incidental-observation.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gallstones.incidental-training-ultrasound",
    "nodeId": "node.gallstones.incidental-training-ultrasound.1",
    "questionVariantId": "question.gallstones.incidental-observation.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.nephrolithiasis.recurrent-flank-pain",
    "nodeId": "node.nephrolithiasis.recurrent-flank-pain.1",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "noncontrast_ct_1",
          "choiceLabel": "Obtain noncontrast CT of the abdomen and pelvis",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "repeat_plain_film_1",
          "choiceLabel": "Obtain a plain abdominal radiograph",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "contrast_ct_1",
          "choiceLabel": "Obtain multiphase contrast-enhanced CT urography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mri_1",
          "choiceLabel": "Obtain contrast-enhanced abdominal MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.recurrent-flank-pain",
    "nodeId": "node.nephrolithiasis.recurrent-flank-pain.2",
    "questionVariantId": "question.nephrolithiasis.recurrent-metabolic-evaluation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "stone_metabolic_1",
          "choiceLabel": "Stone analysis with serum studies and 24-hour urine testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "ultrasound_urine_1",
          "choiceLabel": "Repeat renal ultrasound with spot urinalysis and urine culture",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "serum_radiograph_1",
          "choiceLabel": "Serum electrolytes and creatinine with repeat abdominal radiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "interval_ct_urine_1",
          "choiceLabel": "Interval CT imaging with urinalysis at the next painful episode",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.uncertain-ureteral-stone",
    "nodeId": "node.nephrolithiasis.uncertain-ureteral-stone.1",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "noncontrast_ct_2",
          "choiceLabel": "Obtain noncontrast CT of the abdomen and pelvis",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "repeat_plain_film_2",
          "choiceLabel": "Obtain a plain abdominal radiograph",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "contrast_ct_2",
          "choiceLabel": "Obtain multiphase contrast-enhanced CT urography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mri_2",
          "choiceLabel": "Obtain contrast-enhanced abdominal MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.uncertain-ureteral-stone",
    "nodeId": "node.nephrolithiasis.uncertain-ureteral-stone.2",
    "questionVariantId": "question.nephrolithiasis.recurrent-metabolic-evaluation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "stone_metabolic_2",
          "choiceLabel": "Stone analysis with serum studies and 24-hour urine testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "ultrasound_urine_2",
          "choiceLabel": "Repeat renal ultrasound with spot urinalysis and urine culture",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "serum_radiograph_2",
          "choiceLabel": "Serum electrolytes and creatinine with repeat abdominal radiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "interval_ct_urine_2",
          "choiceLabel": "Interval CT imaging with urinalysis at the next painful episode",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.prior-stone-new-pain",
    "nodeId": "node.nephrolithiasis.prior-stone-new-pain.1",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "noncontrast_ct_3",
          "choiceLabel": "Obtain noncontrast CT of the abdomen and pelvis",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "repeat_plain_film_3",
          "choiceLabel": "Obtain a plain abdominal radiograph",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "contrast_ct_3",
          "choiceLabel": "Obtain multiphase contrast-enhanced CT urography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mri_3",
          "choiceLabel": "Obtain contrast-enhanced abdominal MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.prior-stone-new-pain",
    "nodeId": "node.nephrolithiasis.prior-stone-new-pain.2",
    "questionVariantId": "question.nephrolithiasis.recurrent-metabolic-evaluation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "stone_metabolic_3",
          "choiceLabel": "Stone analysis with serum studies and 24-hour urine testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "ultrasound_urine_3",
          "choiceLabel": "Repeat renal ultrasound with spot urinalysis and urine culture",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "serum_radiograph_3",
          "choiceLabel": "Serum electrolytes and creatinine with repeat abdominal radiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "interval_ct_urine_3",
          "choiceLabel": "Interval CT imaging with urinalysis at the next painful episode",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.hematuria-colic",
    "nodeId": "node.nephrolithiasis.hematuria-colic.1",
    "questionVariantId": "question.nephrolithiasis.noncontrast-ct-evaluation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "noncontrast_ct_4",
          "choiceLabel": "Obtain noncontrast CT of the abdomen and pelvis",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "repeat_plain_film_4",
          "choiceLabel": "Obtain a plain abdominal radiograph",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "contrast_ct_4",
          "choiceLabel": "Obtain multiphase contrast-enhanced CT urography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "mri_4",
          "choiceLabel": "Obtain contrast-enhanced abdominal MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.nephrolithiasis.hematuria-colic",
    "nodeId": "node.nephrolithiasis.hematuria-colic.2",
    "questionVariantId": "question.nephrolithiasis.recurrent-metabolic-evaluation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "stone_metabolic_4",
          "choiceLabel": "Stone analysis with serum studies and 24-hour urine testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.twenty_four_hour_protocol"
          }
        },
        {
          "choiceId": "ultrasound_urine_4",
          "choiceLabel": "Repeat renal ultrasound with spot urinalysis and urine culture",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "serum_radiograph_4",
          "choiceLabel": "Serum electrolytes and creatinine with repeat abdominal radiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "interval_ct_urine_4",
          "choiceLabel": "Interval CT imaging with urinalysis at the next painful episode",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.chronic-diarrhea",
    "nodeId": "node.celiac.chronic-diarrhea.1",
    "questionVariantId": "question.celiac.initial-serology.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ttg_total_iga_1",
          "choiceLabel": "Order tTG-IgA with a total IgA measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "igg_celiac_1",
          "choiceLabel": "Order tTG-IgG with deamidated gliadin peptide IgG",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hla_1",
          "choiceLabel": "Order HLA-DQ2 and HLA-DQ8 typing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.genetic"
          }
        },
        {
          "choiceId": "wheat_ige_1",
          "choiceLabel": "Order wheat-specific IgE with total IgE",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.chronic-diarrhea",
    "nodeId": "node.celiac.chronic-diarrhea.2",
    "questionVariantId": "question.celiac.duodenal-biopsy-confirmation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "endoscopy_biopsy_1",
          "choiceLabel": "Arrange upper endoscopy with duodenal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "repeat_panel_1",
          "choiceLabel": "Repeat the same celiac serology",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "colonoscopy_1",
          "choiceLabel": "Arrange colonoscopy with random colonic biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "diagnose_serology_1",
          "choiceLabel": "Record celiac disease from the serology result",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.chronic-diarrhea",
    "nodeId": "node.celiac.chronic-diarrhea.3",
    "questionVariantId": "question.celiac.gluten-free-treatment.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.celiac.iron-deficiency-symptoms",
    "nodeId": "node.celiac.iron-deficiency-symptoms.1",
    "questionVariantId": "question.celiac.initial-serology.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ttg_total_iga_2",
          "choiceLabel": "Order tTG-IgA with a total IgA measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "igg_celiac_2",
          "choiceLabel": "Order tTG-IgG with deamidated gliadin peptide IgG",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hla_2",
          "choiceLabel": "Order HLA-DQ2 and HLA-DQ8 typing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.genetic"
          }
        },
        {
          "choiceId": "wheat_ige_2",
          "choiceLabel": "Order wheat-specific IgE with total IgE",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.iron-deficiency-symptoms",
    "nodeId": "node.celiac.iron-deficiency-symptoms.2",
    "questionVariantId": "question.celiac.duodenal-biopsy-confirmation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "endoscopy_biopsy_2",
          "choiceLabel": "Arrange upper endoscopy with duodenal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "repeat_panel_2",
          "choiceLabel": "Repeat the same celiac serology",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "colonoscopy_2",
          "choiceLabel": "Arrange colonoscopy with random colonic biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "diagnose_serology_2",
          "choiceLabel": "Record celiac disease from the serology result",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.iron-deficiency-symptoms",
    "nodeId": "node.celiac.iron-deficiency-symptoms.3",
    "questionVariantId": "question.celiac.gluten-free-treatment.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.celiac.weight-loss-discomfort",
    "nodeId": "node.celiac.weight-loss-discomfort.1",
    "questionVariantId": "question.celiac.initial-serology.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ttg_total_iga_3",
          "choiceLabel": "Order tTG-IgA with a total IgA measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "igg_celiac_3",
          "choiceLabel": "Order tTG-IgG with deamidated gliadin peptide IgG",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hla_3",
          "choiceLabel": "Order HLA-DQ2 and HLA-DQ8 typing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.genetic"
          }
        },
        {
          "choiceId": "wheat_ige_3",
          "choiceLabel": "Order wheat-specific IgE with total IgE",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.weight-loss-discomfort",
    "nodeId": "node.celiac.weight-loss-discomfort.2",
    "questionVariantId": "question.celiac.duodenal-biopsy-confirmation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "endoscopy_biopsy_3",
          "choiceLabel": "Arrange upper endoscopy with duodenal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "repeat_panel_3",
          "choiceLabel": "Repeat the same celiac serology",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "colonoscopy_3",
          "choiceLabel": "Arrange colonoscopy with random colonic biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "diagnose_serology_3",
          "choiceLabel": "Record celiac disease from the serology result",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.weight-loss-discomfort",
    "nodeId": "node.celiac.weight-loss-discomfort.3",
    "questionVariantId": "question.celiac.gluten-free-treatment.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.celiac.family-history",
    "nodeId": "node.celiac.family-history.1",
    "questionVariantId": "question.celiac.initial-serology.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ttg_total_iga_4",
          "choiceLabel": "Order tTG-IgA with a total IgA measurement",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "igg_celiac_4",
          "choiceLabel": "Order tTG-IgG with deamidated gliadin peptide IgG",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hla_4",
          "choiceLabel": "Order HLA-DQ2 and HLA-DQ8 typing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.genetic"
          }
        },
        {
          "choiceId": "wheat_ige_4",
          "choiceLabel": "Order wheat-specific IgE with total IgE",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.family-history",
    "nodeId": "node.celiac.family-history.2",
    "questionVariantId": "question.celiac.duodenal-biopsy-confirmation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "endoscopy_biopsy_4",
          "choiceLabel": "Arrange upper endoscopy with duodenal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "repeat_panel_4",
          "choiceLabel": "Repeat the same celiac serology",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "colonoscopy_4",
          "choiceLabel": "Arrange colonoscopy with random colonic biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "diagnose_serology_4",
          "choiceLabel": "Record celiac disease from the serology result",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.celiac.family-history",
    "nodeId": "node.celiac.family-history.3",
    "questionVariantId": "question.celiac.gluten-free-treatment.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.colorectal.routine-screen",
    "nodeId": "node.colorectal.routine-screen.1",
    "questionVariantId": "question.colorectal.positive-fit-colonoscopy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "colonoscopy_1",
          "choiceLabel": "Diagnostic colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "repeat_fit_1",
          "choiceLabel": "Repeat fecal immunochemical testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "ct_colonography_1",
          "choiceLabel": "CT colonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "flex_sig_1",
          "choiceLabel": "Flexible sigmoidoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.colorectal.routine-screen",
    "nodeId": "node.colorectal.routine-screen.2",
    "questionVariantId": "question.colorectal.histologic-confirmation.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.colorectal.mailed-fit",
    "nodeId": "node.colorectal.mailed-fit.1",
    "questionVariantId": "question.colorectal.positive-fit-colonoscopy.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "colonoscopy_2",
          "choiceLabel": "Diagnostic colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "repeat_fit_2",
          "choiceLabel": "Repeat fecal immunochemical testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "ct_colonography_2",
          "choiceLabel": "CT colonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "flex_sig_2",
          "choiceLabel": "Flexible sigmoidoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.colorectal.mailed-fit",
    "nodeId": "node.colorectal.mailed-fit.2",
    "questionVariantId": "question.colorectal.histologic-confirmation.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.colorectal.preventive-visit",
    "nodeId": "node.colorectal.preventive-visit.1",
    "questionVariantId": "question.colorectal.positive-fit-colonoscopy.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "colonoscopy_3",
          "choiceLabel": "Diagnostic colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "repeat_fit_3",
          "choiceLabel": "Repeat fecal immunochemical testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "ct_colonography_3",
          "choiceLabel": "CT colonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "flex_sig_3",
          "choiceLabel": "Flexible sigmoidoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.colorectal.preventive-visit",
    "nodeId": "node.colorectal.preventive-visit.2",
    "questionVariantId": "question.colorectal.histologic-confirmation.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.colorectal.repeat-screening",
    "nodeId": "node.colorectal.repeat-screening.1",
    "questionVariantId": "question.colorectal.positive-fit-colonoscopy.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "colonoscopy_4",
          "choiceLabel": "Diagnostic colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "repeat_fit_4",
          "choiceLabel": "Repeat fecal immunochemical testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "ct_colonography_4",
          "choiceLabel": "CT colonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "flex_sig_4",
          "choiceLabel": "Flexible sigmoidoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.colorectal.repeat-screening",
    "nodeId": "node.colorectal.repeat-screening.2",
    "questionVariantId": "question.colorectal.histologic-confirmation.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.iron-deficiency.adult-man-fatigue",
    "nodeId": "node.iron-deficiency.adult-man-fatigue.1",
    "questionVariantId": "question.iron-deficiency.iron-studies.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "iron_studies_1",
          "choiceLabel": "Ferritin and complementary iron studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "b12_folate_1",
          "choiceLabel": "Vitamin B12 and folate measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hemolysis_panel_1",
          "choiceLabel": "Reticulocyte count, bilirubin, haptoglobin, and LDH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "coagulation_panel_1",
          "choiceLabel": "Prothrombin time and activated partial thromboplastin time",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.adult-man-fatigue",
    "nodeId": "node.iron-deficiency.adult-man-fatigue.2",
    "questionVariantId": "question.iron-deficiency.gi-evaluation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "bidirectional_1",
          "choiceLabel": "Bidirectional endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "upper_only_1",
          "choiceLabel": "Upper GI endoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "colon_only_1",
          "choiceLabel": "Colonoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "capsule_first_1",
          "choiceLabel": "Small-bowel capsule endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.postmenopausal-dyspnea",
    "nodeId": "node.iron-deficiency.postmenopausal-dyspnea.1",
    "questionVariantId": "question.iron-deficiency.iron-studies.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "iron_studies_2",
          "choiceLabel": "Ferritin and complementary iron studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "b12_folate_2",
          "choiceLabel": "Vitamin B12 and folate measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hemolysis_panel_2",
          "choiceLabel": "Reticulocyte count, bilirubin, haptoglobin, and LDH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "coagulation_panel_2",
          "choiceLabel": "Prothrombin time and activated partial thromboplastin time",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.postmenopausal-dyspnea",
    "nodeId": "node.iron-deficiency.postmenopausal-dyspnea.2",
    "questionVariantId": "question.iron-deficiency.gi-evaluation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "bidirectional_2",
          "choiceLabel": "Bidirectional endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "upper_only_2",
          "choiceLabel": "Upper GI endoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "colon_only_2",
          "choiceLabel": "Colonoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "capsule_first_2",
          "choiceLabel": "Small-bowel capsule endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.adult-man-donation",
    "nodeId": "node.iron-deficiency.adult-man-donation.1",
    "questionVariantId": "question.iron-deficiency.iron-studies.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "iron_studies_3",
          "choiceLabel": "Ferritin and complementary iron studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "b12_folate_3",
          "choiceLabel": "Vitamin B12 and folate measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hemolysis_panel_3",
          "choiceLabel": "Reticulocyte count, bilirubin, haptoglobin, and LDH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "coagulation_panel_3",
          "choiceLabel": "Prothrombin time and activated partial thromboplastin time",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.adult-man-donation",
    "nodeId": "node.iron-deficiency.adult-man-donation.2",
    "questionVariantId": "question.iron-deficiency.gi-evaluation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "bidirectional_3",
          "choiceLabel": "Bidirectional endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "upper_only_3",
          "choiceLabel": "Upper GI endoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "colon_only_3",
          "choiceLabel": "Colonoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "capsule_first_3",
          "choiceLabel": "Small-bowel capsule endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.postmenopausal-checkup",
    "nodeId": "node.iron-deficiency.postmenopausal-checkup.1",
    "questionVariantId": "question.iron-deficiency.iron-studies.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "iron_studies_4",
          "choiceLabel": "Ferritin and complementary iron studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "b12_folate_4",
          "choiceLabel": "Vitamin B12 and folate measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "hemolysis_panel_4",
          "choiceLabel": "Reticulocyte count, bilirubin, haptoglobin, and LDH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "coagulation_panel_4",
          "choiceLabel": "Prothrombin time and activated partial thromboplastin time",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.iron-deficiency.postmenopausal-checkup",
    "nodeId": "node.iron-deficiency.postmenopausal-checkup.2",
    "questionVariantId": "question.iron-deficiency.gi-evaluation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "bidirectional_4",
          "choiceLabel": "Bidirectional endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "upper_only_4",
          "choiceLabel": "Upper GI endoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "colon_only_4",
          "choiceLabel": "Colonoscopy alone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "capsule_first_4",
          "choiceLabel": "Small-bowel capsule endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "extremity_mri_1",
          "choiceLabel": "Dedicated MRI of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "repeat_ultrasound_1",
          "choiceLabel": "Focused ultrasound of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "plain_radiograph_1",
          "choiceLabel": "Plain radiographs of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "noncontrast_ct_1",
          "choiceLabel": "Noncontrast CT of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sarcoma_core_1",
          "choiceLabel": "Sarcoma-team-planned image-guided core biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "office_excision_1",
          "choiceLabel": "Office excision of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "random_fna_1",
          "choiceLabel": "Fine-needle aspiration before specialist referral",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "open_biopsy_1",
          "choiceLabel": "Incisional biopsy before sarcoma-center review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.1",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "extremity_mri_2",
          "choiceLabel": "Dedicated MRI of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "repeat_ultrasound_2",
          "choiceLabel": "Focused ultrasound of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "plain_radiograph_2",
          "choiceLabel": "Plain radiographs of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "noncontrast_ct_2",
          "choiceLabel": "Noncontrast CT of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sarcoma_core_2",
          "choiceLabel": "Sarcoma-team-planned image-guided core biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "office_excision_2",
          "choiceLabel": "Office excision of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "random_fna_2",
          "choiceLabel": "Fine-needle aspiration before specialist referral",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "open_biopsy_2",
          "choiceLabel": "Incisional biopsy before sarcoma-center review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.calf-indeterminate",
    "nodeId": "node.soft-tissue-mass.calf-indeterminate.1",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "extremity_mri_3",
          "choiceLabel": "Dedicated MRI of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "repeat_ultrasound_3",
          "choiceLabel": "Focused ultrasound of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "plain_radiograph_3",
          "choiceLabel": "Plain radiographs of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "noncontrast_ct_3",
          "choiceLabel": "Noncontrast CT of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.calf-indeterminate",
    "nodeId": "node.soft-tissue-mass.calf-indeterminate.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sarcoma_core_3",
          "choiceLabel": "Sarcoma-team-planned image-guided core biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "office_excision_3",
          "choiceLabel": "Office excision of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "random_fna_3",
          "choiceLabel": "Fine-needle aspiration before specialist referral",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "open_biopsy_3",
          "choiceLabel": "Incisional biopsy before sarcoma-center review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.forearm-progressive",
    "nodeId": "node.soft-tissue-mass.forearm-progressive.1",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "extremity_mri_4",
          "choiceLabel": "Dedicated MRI of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "repeat_ultrasound_4",
          "choiceLabel": "Focused ultrasound of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "plain_radiograph_4",
          "choiceLabel": "Plain radiographs of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "noncontrast_ct_4",
          "choiceLabel": "Noncontrast CT of the involved extremity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.soft-tissue-mass.forearm-progressive",
    "nodeId": "node.soft-tissue-mass.forearm-progressive.2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sarcoma_core_4",
          "choiceLabel": "Sarcoma-team-planned image-guided core biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "office_excision_4",
          "choiceLabel": "Office excision of the mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "random_fna_4",
          "choiceLabel": "Fine-needle aspiration before specialist referral",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "open_biopsy_4",
          "choiceLabel": "Incisional biopsy before sarcoma-center review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.thyroid-nodule.palpable-referral",
    "nodeId": "node.thyroid-nodule.palpable-referral.1",
    "questionVariantId": "question.thyroid-nodule.fna-selection.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "thyroid_fna_1",
          "choiceLabel": "Ultrasound-guided thyroid FNA",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "repeat_tsh_1",
          "choiceLabel": "Serum thyroid-stimulating hormone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "radionuclide_scan_1",
          "choiceLabel": "Radionuclide thyroid uptake scan",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "repeat_ultrasound_1",
          "choiceLabel": "Repeat thyroid ultrasonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.thyroid-nodule.palpable-referral",
    "nodeId": "node.thyroid-nodule.palpable-referral.2",
    "questionVariantId": "question.thyroid-nodule.follicular-invasion-histology.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.thyroid-nodule.incidental-imaging",
    "nodeId": "node.thyroid-nodule.incidental-imaging.1",
    "questionVariantId": "question.thyroid-nodule.fna-selection.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "thyroid_fna_2",
          "choiceLabel": "Ultrasound-guided thyroid FNA",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "repeat_tsh_2",
          "choiceLabel": "Serum thyroid-stimulating hormone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "radionuclide_scan_2",
          "choiceLabel": "Radionuclide thyroid uptake scan",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "repeat_ultrasound_2",
          "choiceLabel": "Repeat thyroid ultrasonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.thyroid-nodule.incidental-imaging",
    "nodeId": "node.thyroid-nodule.incidental-imaging.2",
    "questionVariantId": "question.thyroid-nodule.follicular-invasion-histology.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.thyroid-nodule.family-clinic",
    "nodeId": "node.thyroid-nodule.family-clinic.1",
    "questionVariantId": "question.thyroid-nodule.fna-selection.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "thyroid_fna_3",
          "choiceLabel": "Ultrasound-guided thyroid FNA",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "repeat_tsh_3",
          "choiceLabel": "Serum thyroid-stimulating hormone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "radionuclide_scan_3",
          "choiceLabel": "Radionuclide thyroid uptake scan",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "repeat_ultrasound_3",
          "choiceLabel": "Repeat thyroid ultrasonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.thyroid-nodule.family-clinic",
    "nodeId": "node.thyroid-nodule.family-clinic.2",
    "questionVariantId": "question.thyroid-nodule.follicular-invasion-histology.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.thyroid-nodule.surveillance-change",
    "nodeId": "node.thyroid-nodule.surveillance-change.1",
    "questionVariantId": "question.thyroid-nodule.fna-selection.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "thyroid_fna_4",
          "choiceLabel": "Ultrasound-guided thyroid FNA",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "repeat_tsh_4",
          "choiceLabel": "Serum thyroid-stimulating hormone",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "radionuclide_scan_4",
          "choiceLabel": "Radionuclide thyroid uptake scan",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "repeat_ultrasound_4",
          "choiceLabel": "Repeat thyroid ultrasonography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.thyroid-nodule.surveillance-change",
    "nodeId": "node.thyroid-nodule.surveillance-change.2",
    "questionVariantId": "question.thyroid-nodule.follicular-invasion-histology.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.stone-history",
    "nodeId": "node.primary-hyperparathyroidism.stone-history.1",
    "questionVariantId": "question.primary-hyperparathyroidism.biochemical-confirmation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "calcium_pth_1",
          "choiceLabel": "Repeat calcium and intact PTH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "sestamibi_1",
          "choiceLabel": "Sestamibi parathyroid localization imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "neck_ct_1",
          "choiceLabel": "Contrast-enhanced neck computed tomography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "parathyroid_fna_1",
          "choiceLabel": "Ultrasound-guided parathyroid aspiration",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.stone-history",
    "nodeId": "node.primary-hyperparathyroidism.stone-history.2",
    "questionVariantId": "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "surgical_assessment_1",
          "choiceLabel": "Parathyroid surgical consultation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "localization_as_diagnosis_1",
          "choiceLabel": "Observation with periodic calcium measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "reassure_fhh_1",
          "choiceLabel": "Reassurance with routine primary care follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "emergency_treatment_1",
          "choiceLabel": "Emergency admission for calcium-lowering treatment",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.fragility-fracture",
    "nodeId": "node.primary-hyperparathyroidism.fragility-fracture.1",
    "questionVariantId": "question.primary-hyperparathyroidism.biochemical-confirmation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "calcium_pth_2",
          "choiceLabel": "Repeat calcium and intact PTH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "sestamibi_2",
          "choiceLabel": "Sestamibi parathyroid localization imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "neck_ct_2",
          "choiceLabel": "Contrast-enhanced neck computed tomography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "parathyroid_fna_2",
          "choiceLabel": "Ultrasound-guided parathyroid aspiration",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.fragility-fracture",
    "nodeId": "node.primary-hyperparathyroidism.fragility-fracture.2",
    "questionVariantId": "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "surgical_assessment_2",
          "choiceLabel": "Parathyroid surgical consultation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "localization_as_diagnosis_2",
          "choiceLabel": "Observation with periodic calcium measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "reassure_fhh_2",
          "choiceLabel": "Reassurance with routine primary care follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "emergency_treatment_2",
          "choiceLabel": "Emergency admission for calcium-lowering treatment",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.recurrent-stone-review",
    "nodeId": "node.primary-hyperparathyroidism.recurrent-stone-review.1",
    "questionVariantId": "question.primary-hyperparathyroidism.biochemical-confirmation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "calcium_pth_3",
          "choiceLabel": "Repeat calcium and intact PTH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "sestamibi_3",
          "choiceLabel": "Sestamibi parathyroid localization imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "neck_ct_3",
          "choiceLabel": "Contrast-enhanced neck computed tomography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "parathyroid_fna_3",
          "choiceLabel": "Ultrasound-guided parathyroid aspiration",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.recurrent-stone-review",
    "nodeId": "node.primary-hyperparathyroidism.recurrent-stone-review.2",
    "questionVariantId": "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "surgical_assessment_3",
          "choiceLabel": "Parathyroid surgical consultation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "localization_as_diagnosis_3",
          "choiceLabel": "Observation with periodic calcium measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "reassure_fhh_3",
          "choiceLabel": "Reassurance with routine primary care follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "emergency_treatment_3",
          "choiceLabel": "Emergency admission for calcium-lowering treatment",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.bone-density-referral",
    "nodeId": "node.primary-hyperparathyroidism.bone-density-referral.1",
    "questionVariantId": "question.primary-hyperparathyroidism.biochemical-confirmation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "calcium_pth_4",
          "choiceLabel": "Repeat calcium and intact PTH",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "sestamibi_4",
          "choiceLabel": "Sestamibi parathyroid localization imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "neck_ct_4",
          "choiceLabel": "Contrast-enhanced neck computed tomography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "parathyroid_fna_4",
          "choiceLabel": "Ultrasound-guided parathyroid aspiration",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.primary-hyperparathyroidism.bone-density-referral",
    "nodeId": "node.primary-hyperparathyroidism.bone-density-referral.2",
    "questionVariantId": "question.primary-hyperparathyroidism.symptomatic-surgery-assessment.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "surgical_assessment_4",
          "choiceLabel": "Parathyroid surgical consultation",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "localization_as_diagnosis_4",
          "choiceLabel": "Observation with periodic calcium measurements",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "reassure_fhh_4",
          "choiceLabel": "Reassurance with routine primary care follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "emergency_treatment_4",
          "choiceLabel": "Emergency admission for calcium-lowering treatment",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "dynamic_ultrasound_1",
          "choiceLabel": "Dynamic groin ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "immediate_repair_1",
          "choiceLabel": "Pelvic magnetic resonance imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "routine_xray_1",
          "choiceLabel": "Lower-extremity venous duplex",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "observe_only_1",
          "choiceLabel": "Plain abdominal and pelvic radiographs",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "dynamic_ultrasound_2",
          "choiceLabel": "Dynamic groin ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "immediate_repair_2",
          "choiceLabel": "Pelvic magnetic resonance imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "routine_xray_2",
          "choiceLabel": "Lower-extremity venous duplex",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "observe_only_2",
          "choiceLabel": "Plain abdominal and pelvic radiographs",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "dynamic_ultrasound_3",
          "choiceLabel": "Dynamic groin ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "immediate_repair_3",
          "choiceLabel": "Pelvic magnetic resonance imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "routine_xray_3",
          "choiceLabel": "Lower-extremity venous duplex",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "observe_only_3",
          "choiceLabel": "Plain abdominal and pelvic radiographs",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "dynamic_ultrasound_4",
          "choiceLabel": "Dynamic groin ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "immediate_repair_4",
          "choiceLabel": "Pelvic magnetic resonance imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "routine_xray_4",
          "choiceLabel": "Lower-extremity venous duplex",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "observe_only_4",
          "choiceLabel": "Plain abdominal and pelvic radiographs",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.constipation",
    "nodeId": "node.anal-fissure.constipation.1",
    "questionVariantId": "question.anal-fissure.acute-recognition.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.constipation",
    "nodeId": "node.anal-fissure.constipation.2",
    "questionVariantId": "question.anal-fissure.initial-conservative-care.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.post-travel",
    "nodeId": "node.anal-fissure.post-travel.1",
    "questionVariantId": "question.anal-fissure.acute-recognition.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.post-travel",
    "nodeId": "node.anal-fissure.post-travel.2",
    "questionVariantId": "question.anal-fissure.initial-conservative-care.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.postpartum",
    "nodeId": "node.anal-fissure.postpartum.1",
    "questionVariantId": "question.anal-fissure.acute-recognition.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.postpartum",
    "nodeId": "node.anal-fissure.postpartum.2",
    "questionVariantId": "question.anal-fissure.initial-conservative-care.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.diarrhea",
    "nodeId": "node.anal-fissure.diarrhea.1",
    "questionVariantId": "question.anal-fissure.acute-recognition.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.anal-fissure.diarrhea",
    "nodeId": "node.anal-fissure.diarrhea.2",
    "questionVariantId": "question.anal-fissure.initial-conservative-care.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.commute",
    "nodeId": "node.internal-hemorrhoids.commute.1",
    "questionVariantId": "question.internal-hemorrhoids.anoscopy-evaluation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "anoscopy_1",
          "choiceLabel": "Anal canal anoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "repeat_colonoscopy_1",
          "choiceLabel": "Repeat colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "pelvic_mri_1",
          "choiceLabel": "Pelvic MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "occult_blood_1",
          "choiceLabel": "Fecal occult-blood testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.commute",
    "nodeId": "node.internal-hemorrhoids.commute.2",
    "questionVariantId": "question.internal-hemorrhoids.office-banding-selection.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.exercise",
    "nodeId": "node.internal-hemorrhoids.exercise.1",
    "questionVariantId": "question.internal-hemorrhoids.anoscopy-evaluation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "anoscopy_2",
          "choiceLabel": "Anal canal anoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "repeat_colonoscopy_2",
          "choiceLabel": "Repeat colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "pelvic_mri_2",
          "choiceLabel": "Pelvic MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "occult_blood_2",
          "choiceLabel": "Fecal occult-blood testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.exercise",
    "nodeId": "node.internal-hemorrhoids.exercise.2",
    "questionVariantId": "question.internal-hemorrhoids.office-banding-selection.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.workday",
    "nodeId": "node.internal-hemorrhoids.workday.1",
    "questionVariantId": "question.internal-hemorrhoids.anoscopy-evaluation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "anoscopy_3",
          "choiceLabel": "Anal canal anoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "repeat_colonoscopy_3",
          "choiceLabel": "Repeat colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "pelvic_mri_3",
          "choiceLabel": "Pelvic MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "occult_blood_3",
          "choiceLabel": "Fecal occult-blood testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.workday",
    "nodeId": "node.internal-hemorrhoids.workday.2",
    "questionVariantId": "question.internal-hemorrhoids.office-banding-selection.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.followup",
    "nodeId": "node.internal-hemorrhoids.followup.1",
    "questionVariantId": "question.internal-hemorrhoids.anoscopy-evaluation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "anoscopy_4",
          "choiceLabel": "Anal canal anoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "repeat_colonoscopy_4",
          "choiceLabel": "Repeat colonoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "pelvic_mri_4",
          "choiceLabel": "Pelvic MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "occult_blood_4",
          "choiceLabel": "Fecal occult-blood testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.internal-hemorrhoids.followup",
    "nodeId": "node.internal-hemorrhoids.followup.2",
    "questionVariantId": "question.internal-hemorrhoids.office-banding-selection.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.bread-sticking",
    "nodeId": "node.esophageal-dysphagia.bread-sticking.1",
    "questionVariantId": "question.esophageal-dysphagia.upper-endoscopy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "egd_1",
          "choiceLabel": "EGD with esophageal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "manometry_1",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "ph_monitoring_1",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_1",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.bread-sticking",
    "nodeId": "node.esophageal-dysphagia.bread-sticking.2",
    "questionVariantId": "question.barrett-esophagus.intestinal-metaplasia.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.meal-pauses",
    "nodeId": "node.esophageal-dysphagia.meal-pauses.1",
    "questionVariantId": "question.esophageal-dysphagia.upper-endoscopy.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "egd_2",
          "choiceLabel": "EGD with esophageal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "manometry_2",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "ph_monitoring_2",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_2",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.meal-pauses",
    "nodeId": "node.esophageal-dysphagia.meal-pauses.2",
    "questionVariantId": "question.barrett-esophagus.intestinal-metaplasia.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.progressive-solids",
    "nodeId": "node.esophageal-dysphagia.progressive-solids.1",
    "questionVariantId": "question.esophageal-dysphagia.upper-endoscopy.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "egd_3",
          "choiceLabel": "EGD with esophageal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "manometry_3",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "ph_monitoring_3",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_3",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.progressive-solids",
    "nodeId": "node.esophageal-dysphagia.progressive-solids.2",
    "questionVariantId": "question.barrett-esophagus.intestinal-metaplasia.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.restaurant-meals",
    "nodeId": "node.esophageal-dysphagia.restaurant-meals.1",
    "questionVariantId": "question.esophageal-dysphagia.upper-endoscopy.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "egd_4",
          "choiceLabel": "EGD with esophageal biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "manometry_4",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "ph_monitoring_4",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_4",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.esophageal-dysphagia.restaurant-meals",
    "nodeId": "node.esophageal-dysphagia.restaurant-meals.2",
    "questionVariantId": "question.barrett-esophagus.intestinal-metaplasia.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "manometry_1",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "repeat_egd_1",
          "choiceLabel": "Repeat upper-GI endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "ph_monitoring_1",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_1",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "manometry_2",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "repeat_egd_2",
          "choiceLabel": "Repeat upper-GI endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "ph_monitoring_2",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_2",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "manometry_3",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "repeat_egd_3",
          "choiceLabel": "Repeat upper-GI endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "ph_monitoring_3",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_3",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "manometry_4",
          "choiceLabel": "High-resolution esophageal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "repeat_egd_4",
          "choiceLabel": "Repeat upper-GI endoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "ph_monitoring_4",
          "choiceLabel": "Ambulatory esophageal reflux monitoring",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "chest_ct_4",
          "choiceLabel": "Contrast-enhanced chest CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "excisional_1",
          "choiceLabel": "Complete excisional biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "superficial_shave_1",
          "choiceLabel": "Superficial shave biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "partial_punch_1",
          "choiceLabel": "Partial punch biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "wide_excision_1",
          "choiceLabel": "Definitive wide local excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sentinel_node_1",
          "choiceLabel": "Sentinel lymph-node biopsy with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "complete_dissection_1",
          "choiceLabel": "Complete regional lymph-node dissection with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "imaging_only_1",
          "choiceLabel": "Regional nodal ultrasound surveillance with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "no_staging_1",
          "choiceLabel": "Clinical nodal follow-up with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "excisional_2",
          "choiceLabel": "Complete excisional biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "superficial_shave_2",
          "choiceLabel": "Superficial shave biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "partial_punch_2",
          "choiceLabel": "Partial punch biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "wide_excision_2",
          "choiceLabel": "Definitive wide local excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sentinel_node_2",
          "choiceLabel": "Sentinel lymph-node biopsy with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "complete_dissection_2",
          "choiceLabel": "Complete regional lymph-node dissection with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "imaging_only_2",
          "choiceLabel": "Regional nodal ultrasound surveillance with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "no_staging_2",
          "choiceLabel": "Clinical nodal follow-up with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "excisional_3",
          "choiceLabel": "Complete excisional biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "superficial_shave_3",
          "choiceLabel": "Superficial shave biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "partial_punch_3",
          "choiceLabel": "Partial punch biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "wide_excision_3",
          "choiceLabel": "Definitive wide local excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sentinel_node_3",
          "choiceLabel": "Sentinel lymph-node biopsy with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "complete_dissection_3",
          "choiceLabel": "Complete regional lymph-node dissection with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "imaging_only_3",
          "choiceLabel": "Regional nodal ultrasound surveillance with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "no_staging_3",
          "choiceLabel": "Clinical nodal follow-up with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "excisional_4",
          "choiceLabel": "Complete excisional biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "superficial_shave_4",
          "choiceLabel": "Superficial shave biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "partial_punch_4",
          "choiceLabel": "Partial punch biopsy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "wide_excision_4",
          "choiceLabel": "Definitive wide local excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "sentinel_node_4",
          "choiceLabel": "Sentinel lymph-node biopsy with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "complete_dissection_4",
          "choiceLabel": "Complete regional lymph-node dissection with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "imaging_only_4",
          "choiceLabel": "Regional nodal ultrasound surveillance with definitive excision",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "no_staging_4",
          "choiceLabel": "Clinical nodal follow-up with definitive excision",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.lumpectomy-fullness",
    "nodeId": "node.postoperative-seroma.lumpectomy-fullness.1",
    "questionVariantId": "question.postoperative-seroma.ultrasound-characterization.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ultrasound_1",
          "choiceLabel": "Targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "breast_mri_1",
          "choiceLabel": "Contrast-enhanced breast MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "chest_ct_1",
          "choiceLabel": "Chest CT of the breast region",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "pathology_review_1",
          "choiceLabel": "Surgical pathology review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.lumpectomy-fullness",
    "nodeId": "node.postoperative-seroma.lumpectomy-fullness.2",
    "questionVariantId": "question.postoperative-seroma.uncomplicated-observation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "observe_1",
          "choiceLabel": "Observation with clinical follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "aspirate_1",
          "choiceLabel": "Ultrasound-guided aspiration of the collection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "antibiotics_1",
          "choiceLabel": "Antibiotic treatment with clinical reassessment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "operative_drainage_1",
          "choiceLabel": "Operative evacuation of the collection",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.excisional-biopsy",
    "nodeId": "node.postoperative-seroma.excisional-biopsy.1",
    "questionVariantId": "question.postoperative-seroma.ultrasound-characterization.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ultrasound_2",
          "choiceLabel": "Targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "breast_mri_2",
          "choiceLabel": "Contrast-enhanced breast MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "chest_ct_2",
          "choiceLabel": "Chest CT of the breast region",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "pathology_review_2",
          "choiceLabel": "Surgical pathology review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.excisional-biopsy",
    "nodeId": "node.postoperative-seroma.excisional-biopsy.2",
    "questionVariantId": "question.postoperative-seroma.uncomplicated-observation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "observe_2",
          "choiceLabel": "Observation with clinical follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "aspirate_2",
          "choiceLabel": "Ultrasound-guided aspiration of the collection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "antibiotics_2",
          "choiceLabel": "Antibiotic treatment with clinical reassessment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "operative_drainage_2",
          "choiceLabel": "Operative evacuation of the collection",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.upper-outer-site",
    "nodeId": "node.postoperative-seroma.upper-outer-site.1",
    "questionVariantId": "question.postoperative-seroma.ultrasound-characterization.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ultrasound_3",
          "choiceLabel": "Targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "breast_mri_3",
          "choiceLabel": "Contrast-enhanced breast MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "chest_ct_3",
          "choiceLabel": "Chest CT of the breast region",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "pathology_review_3",
          "choiceLabel": "Surgical pathology review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.upper-outer-site",
    "nodeId": "node.postoperative-seroma.upper-outer-site.2",
    "questionVariantId": "question.postoperative-seroma.uncomplicated-observation.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "observe_3",
          "choiceLabel": "Observation with clinical follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "aspirate_3",
          "choiceLabel": "Ultrasound-guided aspiration of the collection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "antibiotics_3",
          "choiceLabel": "Antibiotic treatment with clinical reassessment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "operative_drainage_3",
          "choiceLabel": "Operative evacuation of the collection",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.return-visit",
    "nodeId": "node.postoperative-seroma.return-visit.1",
    "questionVariantId": "question.postoperative-seroma.ultrasound-characterization.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "ultrasound_4",
          "choiceLabel": "Targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "breast_mri_4",
          "choiceLabel": "Contrast-enhanced breast MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_mri"
          }
        },
        {
          "choiceId": "chest_ct_4",
          "choiceLabel": "Chest CT of the breast region",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "pathology_review_4",
          "choiceLabel": "Surgical pathology review",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.postoperative-seroma.return-visit",
    "nodeId": "node.postoperative-seroma.return-visit.2",
    "questionVariantId": "question.postoperative-seroma.uncomplicated-observation.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "observe_4",
          "choiceLabel": "Observation with clinical follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "aspirate_4",
          "choiceLabel": "Ultrasound-guided aspiration of the collection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "antibiotics_4",
          "choiceLabel": "Antibiotic treatment with clinical reassessment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "operative_drainage_4",
          "choiceLabel": "Operative evacuation of the collection",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pilonidal-disease.recurrent-drainage",
    "nodeId": "node.pilonidal-disease.recurrent-drainage.1",
    "questionVariantId": "question.pilonidal-disease.chronic-sinus-recognition.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.recurrent-drainage",
    "nodeId": "node.pilonidal-disease.recurrent-drainage.2",
    "questionVariantId": "question.pilonidal-disease.off-midline-closure-planning.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.work-clothing",
    "nodeId": "node.pilonidal-disease.work-clothing.1",
    "questionVariantId": "question.pilonidal-disease.chronic-sinus-recognition.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.work-clothing",
    "nodeId": "node.pilonidal-disease.work-clothing.2",
    "questionVariantId": "question.pilonidal-disease.off-midline-closure-planning.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.cycling",
    "nodeId": "node.pilonidal-disease.cycling.1",
    "questionVariantId": "question.pilonidal-disease.chronic-sinus-recognition.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.cycling",
    "nodeId": "node.pilonidal-disease.cycling.2",
    "questionVariantId": "question.pilonidal-disease.off-midline-closure-planning.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.quiet-sinus",
    "nodeId": "node.pilonidal-disease.quiet-sinus.1",
    "questionVariantId": "question.pilonidal-disease.chronic-sinus-recognition.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pilonidal-disease.quiet-sinus",
    "nodeId": "node.pilonidal-disease.quiet-sinus.2",
    "questionVariantId": "question.pilonidal-disease.off-midline-closure-planning.v4",
    "classification": {
      "kind": "no_test"
    }
  }
];

const entries: AnswerChoiceTimingRegistryEntry[] = [
  ...existingEntries,
  ...BOARD_EXPANSION_TIMING_ENTRIES,
  ...BOARD_EXPANSION_20260912_TIMING_ENTRIES,
  ...EARLY_LEVELS_20260913_TIMING_ENTRIES,
  ...BRIEF_EARLY_LEVELS_20260917_TIMING_ENTRIES,
  ...BREAD_BUTTER_20260917_TIMING_ENTRIES,
];

export const ANSWER_CHOICE_TIMING_REGISTRY = entries.map((entry) =>
  answerChoiceTimingRegistryEntrySchema.parse(entry),
);
