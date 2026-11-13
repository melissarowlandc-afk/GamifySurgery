// Exact frozen manager acceptance. Source files remain untouched; all new questions are drafts.
import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
import type {QuestionShipAcceptance,QuestionShipCaseRetirement} from "./question-ship-manifest";
export const PROGRAM_BATCH8_ROWS:QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "caseId": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "nodeId": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "conceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "caseId": "case.owner-decisions.20261112.mh-medication",
    "nodeId": "node.owner-decisions.20261112.mh-medication",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "conceptId": "concept.mh.dantrolene-readiness.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "conceptId": "concept.rectal-cancer.selected-watch-and-wait",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "conceptId": "concept.early-pregnancy.location-before-disposition.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "conceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  },
  {
    "acceptanceId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "conceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
    "sourceView": "owner-decisions-batch8",
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md"
  }
];
export const PROGRAM_BATCH8_VIEWS:Record<string,SyntheticClinicalRelease> = {
  "owner-decisions-batch8": {
    "id": "clinical.owner-decisions.20261112.v2",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Synthetic owner-review content, not clinically approved.",
    "concepts": [
      {
        "id": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
        "displayName": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
        "learningObjective": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
        "earliestFacilityStage": 0,
        "conceptType": "applied_science"
      },
      {
        "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
        "displayName": "Plan anesthesia under unresolved familial MH susceptibility.",
        "learningObjective": "Plan anesthesia under unresolved familial MH susceptibility.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.mh.dantrolene-readiness.v1",
        "displayName": "Identify the medication required for MH crisis readiness.",
        "learningObjective": "Identify the medication required for MH crisis readiness.",
        "earliestFacilityStage": 0,
        "conceptType": "applied_science"
      },
      {
        "id": "concept.rectal-cancer.selected-watch-and-wait",
        "displayName": "Select resection for progressive residual low rectal disease.",
        "learningObjective": "Select resection for progressive residual low rectal disease.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
        "displayName": "Complete postoperative mucosal assessment after ileocolic Crohn resection.",
        "learningObjective": "Complete postoperative mucosal assessment after ileocolic Crohn resection.",
        "earliestFacilityStage": 2,
        "conceptType": "workup"
      },
      {
        "id": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
        "displayName": "Plan reflux control during symptomatic paraesophageal hernia repair.",
        "learningObjective": "Plan reflux control during symptomatic paraesophageal hernia repair.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.early-pregnancy.location-before-disposition.v1",
        "displayName": "Localize a symptomatic early pregnancy despite falling hCG.",
        "learningObjective": "Localize a symptomatic early pregnancy despite falling hCG.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.preoperative-osa.awake-ventilation-assessment.v1",
        "displayName": "Assess awake ventilation when obesity and sleep-disordered breathing raise concern.",
        "learningObjective": "Assess awake ventilation when obesity and sleep-disordered breathing raise concern.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
        "displayName": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
        "learningObjective": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
        "earliestFacilityStage": 1,
        "conceptType": "workup"
      }
    ],
    "cases": [
      {
        "id": "case.gs028d.acid-base.b-cirrhosis-gap",
        "displayName": "Owner review for Jamie Taylor",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.plain-gap-single.v2",
        "patientDisplayName": "Jamie Taylor",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Acidosis panel review",
        "presentation": "{patientName}, a 49-year-old woman with cirrhosis, attends clinic to review an outside admission for loose stools while taking lactulose. Metabolic acidosis was documented during that admission.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.plain-gap-single.v2",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Acidosis panel review",
            "presentation": "{patientName}, a 49-year-old woman with cirrhosis, attends clinic to review an outside admission for loose stools while taking lactulose. Metabolic acidosis was documented during that admission."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028d.acid-base.b-cirrhosis-gap.1",
            "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
            "primaryConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
            "stem": "Using the potassium-excluding convention, which anion-gap value and effect of hypoalbuminemia on the baseline gap best fit {patientName}'s admission panel?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.plain-gap-single.lower-decrease.r4",
                "label": "12 mmol/L with an albumin-related decrease",
                "isCorrect": true,
                "rationale": "The potassium-excluding calculation gives 12. Low albumin decreases the baseline gap and can mask an additional unmeasured-acid component.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4",
                "label": "28 mmol/L with an albumin-related decrease",
                "isCorrect": false,
                "rationale": "The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4",
                "label": "12 mmol/L with an albumin-related increase",
                "isCorrect": false,
                "rationale": "The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4",
                "label": "28 mmol/L with an albumin-related increase",
                "isCorrect": false,
                "rationale": "The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.",
            "teachingPoint": "The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed admission specimen. Laboratory uncorrected-gap interval 8-16 mmol/L.",
              "columnHeaders": [
                "Value"
              ],
              "rowHeaders": [
                "Sodium (mmol/L)",
                "Chloride (mmol/L)",
                "Bicarbonate (mmol/L)",
                "Albumin"
              ],
              "cells": [
                [
                  "140"
                ],
                [
                  "112"
                ],
                [
                  "16"
                ],
                [
                  "Below the laboratory reference interval"
                ]
              ]
            },
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.",
                "sourceLabels": [
                  "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.",
                "sourceLabels": [
                  "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.",
                "sourceLabels": [
                  "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis."
      },
      {
        "id": "case.gs028d.acid-base.b-sepsis-recovery-gap",
        "displayName": "Owner review for Morgan Ellis",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.plain-gap-trend.v2",
        "patientDisplayName": "Morgan Ellis",
        "prototypeDemographics": {
          "ageYears": 45,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hospital panel review",
        "presentation": "{patientName}, a 45-year-old woman, attends clinic after a hospital admission for sepsis. You review two chemistry panels collected during that admission.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.plain-gap-trend.v2",
            "prototypeDemographics": {
              "ageYears": 45,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Hospital panel review",
            "presentation": "{patientName}, a 45-year-old woman, attends clinic after a hospital admission for sepsis. You review two chemistry panels collected during that admission."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
            "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
            "primaryConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
            "stem": "Using the potassium-excluding convention, which paired gaps and albumin effect should guide assessment for additional unmeasured acids in {patientName}'s two specimens?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.plain-gap-trend.lower-decrease.r4",
                "label": "14 → 12 mmol/L with an albumin-related decrease",
                "isCorrect": true,
                "rationale": "The two calculated gaps are 14 and 12. Falling albumin lowers the baseline gap, so these raw results cannot settle whether an additional unmeasured-acid process is present.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4",
                "label": "32 → 30 mmol/L with an albumin-related decrease",
                "isCorrect": false,
                "rationale": "The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4",
                "label": "14 → 12 mmol/L with an albumin-related increase",
                "isCorrect": false,
                "rationale": "The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4",
                "label": "32 → 30 mmol/L with an albumin-related increase",
                "isCorrect": false,
                "rationale": "Both calculations omit bicarbonate, and the stated albumin effect is reversed.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.",
            "teachingPoint": "The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed serial specimens. Laboratory uncorrected-gap interval 8-16 mmol/L.",
              "columnHeaders": [
                "Admission",
                "Later specimen"
              ],
              "rowHeaders": [
                "Sodium (mmol/L)",
                "Chloride (mmol/L)",
                "Bicarbonate (mmol/L)",
                "Albumin"
              ],
              "cells": [
                [
                  "140",
                  "140"
                ],
                [
                  "108",
                  "110"
                ],
                [
                  "18",
                  "18"
                ],
                [
                  "Within the laboratory interval",
                  "Markedly below the laboratory interval"
                ]
              ]
            },
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.",
                "sourceLabels": [
                  "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.",
                "sourceLabels": [
                  "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Both calculations omit bicarbonate, and the stated albumin effect is reversed.",
                "sourceLabels": [
                  "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process."
      },
      {
        "id": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
        "displayName": "Owner review for Maya Chen",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.mh-plan.v1",
        "patientDisplayName": "Maya Chen",
        "prototypeDemographics": {
          "ageYears": 35,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Anesthetic planning",
        "presentation": "{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her previous sevoflurane anesthetic was uneventful. Her gene panel found no pathogenic variant, and no familial causative variant has been identified. She has not undergone contracture testing.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.mh-plan.v1",
            "prototypeDemographics": {
              "ageYears": 35,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Anesthetic planning",
            "presentation": "{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her previous sevoflurane anesthetic was uneventful. Her gene panel found no pathogenic variant, and no familial causative variant has been identified. She has not undergone contracture testing."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Perioperative management of MH suspected or susceptible patients",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
            "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
            "primaryConceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
            "stem": "Which perioperative plan should {patientName}'s team arrange before her colectomy?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.mh-plan.ready",
                "label": "Trigger-free general anesthesia with dantrolene plus an MH response team ready",
                "isCorrect": true,
                "rationale": "Unresolved familial susceptibility calls for nontriggering anesthesia and crisis preparedness. Specialist assessment can proceed separately from the planned operation.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.mh-plan.volatile-ready",
                "label": "Sevoflurane inhalational anesthesia with dantrolene plus an MH response team ready",
                "isCorrect": false,
                "rationale": "Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.mh-plan.prophylaxis",
                "label": "Trigger-free general anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution",
                "isCorrect": false,
                "rationale": "Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis",
                "label": "Sevoflurane inhalational anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution",
                "isCorrect": false,
                "rationale": "Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.",
            "teachingPoint": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.",
            "sourceLabels": [
              "Perioperative management of MH suspected or susceptible patients",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.mh-plan.volatile-ready",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.",
                "sourceLabels": [
                  "Perioperative management of MH suspected or susceptible patients",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.mh-plan.prophylaxis",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.",
                "sourceLabels": [
                  "Perioperative management of MH suspected or susceptible patients",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.",
                "sourceLabels": [
                  "Perioperative management of MH suspected or susceptible patients",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged."
      },
      {
        "id": "case.owner-decisions.20261112.mh-medication",
        "displayName": "Owner review for Daniel Brooks",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.mh-medication.v1",
        "patientDisplayName": "Daniel Brooks",
        "prototypeDemographics": {
          "ageYears": 41,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Anesthesia medication check",
        "presentation": "{patientName}, a 41-year-old man with malignant-hyperthermia susceptibility confirmed by contracture testing, attends clinic before elective hernia repair. The anesthetist is reviewing the facility's emergency medication supply.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.mh-medication.v1",
            "prototypeDemographics": {
              "ageYears": 41,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Anesthesia medication check",
            "presentation": "{patientName}, a 41-year-old man with malignant-hyperthermia susceptibility confirmed by contracture testing, attends clinic before elective hernia repair. The anesthetist is reviewing the facility's emergency medication supply."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Recognising and managing a malignant hyperthermia crisis (v2024)",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
        ],
        "decisionNodes": [
          {
            "id": "node.owner-decisions.20261112.mh-medication",
            "questionVariantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
            "primaryConceptId": "concept.mh.dantrolene-readiness.v1",
            "stem": "Which medication must the team have ready for immediate administration if {patientName} develops an MH crisis?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.mh-medication.dantrolene",
                "label": "Dantrolene",
                "isCorrect": true,
                "rationale": "Dantrolene is the crisis-specific medication required by MH preparedness guidance.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.mh-medication.naloxone",
                "label": "Naloxone",
                "isCorrect": false,
                "rationale": "Naloxone does not satisfy the MH-specific emergency medication requirement.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.mh-medication.flumazenil",
                "label": "Flumazenil",
                "isCorrect": false,
                "rationale": "Flumazenil does not satisfy the MH-specific emergency medication requirement.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.mh-medication.sugammadex",
                "label": "Sugammadex",
                "isCorrect": false,
                "rationale": "Sugammadex does not satisfy the MH-specific emergency medication requirement.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.",
            "teachingPoint": "Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.",
            "sourceLabels": [
              "Recognising and managing a malignant hyperthermia crisis (v2024)",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.mh-medication.naloxone",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Naloxone does not satisfy the MH-specific emergency medication requirement.",
                "sourceLabels": [
                  "Recognising and managing a malignant hyperthermia crisis (v2024)",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.mh-medication.flumazenil",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Flumazenil does not satisfy the MH-specific emergency medication requirement.",
                "sourceLabels": [
                  "Recognising and managing a malignant hyperthermia crisis (v2024)",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.mh-medication.sugammadex",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Sugammadex does not satisfy the MH-specific emergency medication requirement.",
                "sourceLabels": [
                  "Recognising and managing a malignant hyperthermia crisis (v2024)",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia."
      },
      {
        "id": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
        "displayName": "Owner review for Rachel Hayes",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.rectal-resection.v1",
        "patientDisplayName": "Rachel Hayes",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Rectal treatment review",
        "presentation": "{patientName}, a 57-year-old woman, attends clinic after neoadjuvant therapy for a previously node-positive low rectal adenocarcinoma. On successive reassessments, a firm mural nodule beneath intact mucosa has enlarged. MRI shows a corresponding intermediate-T2 focus with diffusion restriction. Superficial biopsies contain scar and inflammation. Distant restaging is negative, and she is fit for surgery.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.rectal-resection.v1",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Rectal treatment review",
            "presentation": "{patientName}, a 57-year-old woman, attends clinic after neoadjuvant therapy for a previously node-positive low rectal adenocarcinoma. On successive reassessments, a firm mural nodule beneath intact mucosa has enlarged. MRI shows a corresponding intermediate-T2 focus with diffusion restriction. Superficial biopsies contain scar and inflammation. Distant restaging is negative, and she is fit for surgery."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ASCRS Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
            "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
            "primaryConceptId": "concept.rectal-cancer.selected-watch-and-wait",
            "stem": "Which treatment plan best fits {patientName}'s progressive post-treatment rectal findings?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.rectal-resection.resection",
                "label": "Oncologic rectal resection with total mesorectal excision",
                "isCorrect": true,
                "rationale": "Progressive concordant mural findings support the residual-disease pathway. Low anterior and abdominoperineal approaches both incorporate mesorectal clearance.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.rectal-resection.local",
                "label": "Full-thickness local rectal excision through a transanal approach",
                "isCorrect": false,
                "rationale": "The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.rectal-resection.observe",
                "label": "Protocolized watch-and-wait follow-up within a specialist surveillance program",
                "isCorrect": false,
                "rationale": "The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.",
            "teachingPoint": "Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.",
            "sourceLabels": [
              "ASCRS Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.rectal-resection.local",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.",
                "sourceLabels": [
                  "ASCRS Management of Rectal Cancer 2023 Supplement",
                  "Rectal Cancer Treatment (PDQ), Health Professional Version"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.rectal-resection.observe",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.",
                "sourceLabels": [
                  "ASCRS Management of Rectal Cancer 2023 Supplement",
                  "Rectal Cancer Treatment (PDQ), Health Professional Version"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation."
      },
      {
        "id": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
        "displayName": "Owner review for Lena Morgan",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.crohn-surveillance.v1",
        "patientDisplayName": "Lena Morgan",
        "prototypeDemographics": {
          "ageYears": 36,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Crohn follow-up",
        "presentation": "{patientName}, a 36-year-old woman, attends clinic eight months after ileocolic resection for Crohn disease. She feels well on maintenance infliximab, with usual oral intake and bowel function. CRP is within the laboratory interval, but fecal calprotectin remains elevated on repeated samples. Stool testing found no enteric pathogen. An outside colonoscopy was summarized as normal. The procedure reached the splenic flexure, where poor preparation prevented further passage. Biopsies from the descending colon, sigmoid colon and rectum showed no active inflammation.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.crohn-surveillance.v1",
            "prototypeDemographics": {
              "ageYears": 36,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Crohn follow-up",
            "presentation": "{patientName}, a 36-year-old woman, attends clinic eight months after ileocolic resection for Crohn disease. She feels well on maintenance infliximab, with usual oral intake and bowel function. CRP is within the laboratory interval, but fecal calprotectin remains elevated on repeated samples. Stool testing found no enteric pathogen. An outside colonoscopy was summarized as normal. The procedure reached the splenic flexure, where poor preparation prevented further passage. Biopsies from the descending colon, sigmoid colon and rectum showed no active inflammation."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ECCO therapeutics in Crohn disease: surgical treatment, 2024",
          "AGA guideline on biomarkers in Crohn disease"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
            "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
            "primaryConceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
            "stem": "Which next plan best fits {patientName}'s Crohn follow-up after this limited examination?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.crohn-surveillance.scope",
                "label": "Obtain ileocolonoscopy to reassess postoperative disease activity",
                "isCorrect": true,
                "rationale": "The prior procedure did not examine the anastomosis or neoterminal ileum. Persistent stool-marker elevation warrants clarification of those postoperative sites.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.crohn-surveillance.escalate",
                "label": "Intensify infliximab maintenance therapy based on current biomarkers",
                "isCorrect": false,
                "rationale": "Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.crohn-surveillance.markers",
                "label": "Continue maintenance therapy with biomarker-based monitoring at follow-up",
                "isCorrect": false,
                "rationale": "The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.",
            "teachingPoint": "The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.",
            "sourceLabels": [
              "ECCO therapeutics in Crohn disease: surgical treatment, 2024",
              "AGA guideline on biomarkers in Crohn disease"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.crohn-surveillance.escalate",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.",
                "sourceLabels": [
                  "ECCO therapeutics in Crohn disease: surgical treatment, 2024",
                  "AGA guideline on biomarkers in Crohn disease"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.crohn-surveillance.markers",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.",
                "sourceLabels": [
                  "ECCO therapeutics in Crohn disease: surgical treatment, 2024",
                  "AGA guideline on biomarkers in Crohn disease"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality."
      },
      {
        "id": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
        "displayName": "Owner review for Helen Carter",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.hiatal-repair.v1",
        "patientDisplayName": "Helen Carter",
        "prototypeDemographics": {
          "ageYears": 69,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Recurrent anemia",
        "presentation": "{patientName}, a 69-year-old woman, attends clinic to review outside foregut testing. Iron deficiency recurred despite acid suppression and iron replacement. Early satiety limits meals. Imaging confirms a type III hiatal (paraesophageal) hernia. Off-treatment monitoring documents pathologic acid exposure. Manometry shows normal junction relaxation, propagating contractions and augmentation with multiple rapid swallows. She reports comfortable swallowing, remains independent and has been assessed as fit for reconstruction.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.hiatal-repair.v1",
            "prototypeDemographics": {
              "ageYears": 69,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Recurrent anemia",
            "presentation": "{patientName}, a 69-year-old woman, attends clinic to review outside foregut testing. Iron deficiency recurred despite acid suppression and iron replacement. Early satiety limits meals. Imaging confirms a type III hiatal (paraesophageal) hernia. Off-treatment monitoring documents pathologic acid exposure. Manometry shows normal junction relaxation, propagating contractions and augmentation with multiple rapid swallows. She reports comfortable swallowing, remains independent and has been assessed as fit for reconstruction."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SAGES hiatal-hernia surgical guideline (2024)",
          "WSES complicated diaphragmatic hernia position paper (2023)"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
            "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
            "primaryConceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
            "stem": "Which repair plan best fits {patientName}'s symptomatic type III hiatal hernia and completed reflux assessment?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.hiatal-repair.wrap",
                "label": "Reduce hernia, close hiatus and add fundoplication",
                "isCorrect": true,
                "rationale": "The defined hiatal anatomy, reflux findings and operative fitness support adding an antireflux component to reconstruction.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.hiatal-repair.no-wrap",
                "label": "Reduce hernia and close hiatus without a wrap",
                "isCorrect": false,
                "rationale": "This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.hiatal-repair.fix",
                "label": "Reduce hernia and perform isolated gastric fixation",
                "isCorrect": false,
                "rationale": "A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.",
            "teachingPoint": "For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.",
            "sourceLabels": [
              "SAGES hiatal-hernia surgical guideline (2024)",
              "WSES complicated diaphragmatic hernia position paper (2023)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.hiatal-repair.no-wrap",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.",
                "sourceLabels": [
                  "SAGES hiatal-hernia surgical guideline (2024)",
                  "WSES complicated diaphragmatic hernia position paper (2023)"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.hiatal-repair.fix",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.",
                "sourceLabels": [
                  "SAGES hiatal-hernia surgical guideline (2024)",
                  "WSES complicated diaphragmatic hernia position paper (2023)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized."
      },
      {
        "id": "case.gs028f.gynecology.c1-late-period",
        "displayName": "Owner review for Ava Bennett",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.pregnancy-location.v1",
        "patientDisplayName": "Ava Bennett",
        "prototypeDemographics": {
          "ageYears": 24,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Pelvic pain and spotting",
        "presentation": "{patientName}, a 24-year-old woman, returns to clinic with persistent right lower abdominal pain and vaginal spotting. Serum hCG is detectable and has fallen between two measurements. Her blood pressure and pulse are within the clinic's normal ranges. Examination shows focal right lower-quadrant tenderness without generalized rigidity. A limited transabdominal study shows an empty uterine cavity, does not resolve the adnexa separately and does not visualize the appendix. No earlier scan has confirmed an intrauterine pregnancy.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.pregnancy-location.v1",
            "prototypeDemographics": {
              "ageYears": 24,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Pelvic pain and spotting",
            "presentation": "{patientName}, a 24-year-old woman, returns to clinic with persistent right lower abdominal pain and vaginal spotting. Serum hCG is detectable and has fallen between two measurements. Her blood pressure and pulse are within the clinic's normal ranges. Examination shows focal right lower-quadrant tenderness without generalized rigidity. A limited transabdominal study shows an empty uterine cavity, does not resolve the adnexa separately and does not visualize the appendix. No earlier scan has confirmed an intrauterine pregnancy."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Early pregnancy loss",
          "Ectopic pregnancy - Diagnosis"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028f.gynecology.c1-late-period.1",
            "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
            "primaryConceptId": "concept.early-pregnancy.location-before-disposition.v1",
            "stem": "Which same-day diagnostic plan should be prioritized for {patientName}'s focal pain and bleeding despite the falling serum hCG?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.pregnancy-location.localize",
                "label": "Transvaginal ultrasound with gynecologic assessment",
                "isCorrect": true,
                "rationale": "A hormonal decline does not identify the implantation site. Prompt focused pelvic imaging and specialty review address the unresolved pregnancy complication.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.pregnancy-location.appendix",
                "label": "Appendiceal magnetic resonance imaging with general-surgical assessment",
                "isCorrect": false,
                "rationale": "The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.pregnancy-location.aspirate",
                "label": "Diagnostic uterine aspiration with histopathologic assessment",
                "isCorrect": false,
                "rationale": "The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.",
            "teachingPoint": "Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.",
            "sourceLabels": [
              "Early pregnancy loss",
              "Ectopic pregnancy - Diagnosis"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.pregnancy-location.appendix",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.",
                "sourceLabels": [
                  "Early pregnancy loss",
                  "Ectopic pregnancy - Diagnosis"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.pregnancy-location.aspirate",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.",
                "sourceLabels": [
                  "Early pregnancy loss",
                  "Ectopic pregnancy - Diagnosis"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain."
      },
      {
        "id": "case.topic.perioperative-risk-recovery.awake-gas.v3",
        "displayName": "Owner review for Aaron Patel",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.awake-gas.v2",
        "patientDisplayName": "Aaron Patel",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Preoperative breathing review",
        "presentation": "{patientName}, a 49-year-old man with obesity, attends clinic before major abdominal surgery. His partner reports loud snoring and repeated pauses in breathing during sleep. Serum bicarbonate is raised on repeated measurements. He reports no vomiting, takes no diuretic and has no known chronic lung or neuromuscular disease. He is comfortable and alert at the visit.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.awake-gas.v2",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Preoperative breathing review",
            "presentation": "{patientName}, a 49-year-old man with obesity, attends clinic before major abdominal surgery. His partner reports loud snoring and repeated pauses in breathing during sleep. Serum bicarbonate is raised on repeated measurements. He reports no vomiting, takes no diuretic and has no known chronic lung or neuromuscular disease. He is comfortable and alert at the visit."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ATS obesity hypoventilation syndrome guideline"
        ],
        "decisionNodes": [
          {
            "id": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
            "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
            "primaryConceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
            "stem": "Which investigation should clarify the significance of {patientName}'s persistently raised serum bicarbonate before major surgery?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.awake-gas.gas",
                "label": "Arterial blood gas analysis",
                "isCorrect": true,
                "rationale": "A daytime arterial sample directly measures carbon dioxide and can establish whether awake hypercapnia is present.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.awake-gas.polysomnography",
                "label": "Attended laboratory polysomnography",
                "isCorrect": false,
                "rationale": "This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.awake-gas.oximetry",
                "label": "Overnight pulse oximetry",
                "isCorrect": false,
                "rationale": "Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.",
            "teachingPoint": "Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.",
            "sourceLabels": [
              "ATS obesity hypoventilation syndrome guideline"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.awake-gas.polysomnography",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.",
                "sourceLabels": [
                  "ATS obesity hypoventilation syndrome guideline"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.awake-gas.oximetry",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.",
                "sourceLabels": [
                  "ATS obesity hypoventilation syndrome guideline"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation."
      },
      {
        "id": "case.gs028b.ptld.b-pathology-returned",
        "displayName": "Owner review for Nora Reed",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.ptld-biopsy.v2",
        "patientDisplayName": "Nora Reed",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Enlarging neck node",
        "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk. The team can discuss specimen allocation with the receiving hematopathology service before the procedure.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.ptld-biopsy.v2",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Enlarging neck node",
            "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk. The team can discuss specimen allocation with the receiving hematopathology service before the procedure."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Comprehensive review of PTLD after solid organ transplantation",
          "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028b.ptld.b-pathology-returned.1",
            "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
            "primaryConceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
            "stem": "Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
                "label": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
                "isCorrect": true,
                "rationale": "Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
                "label": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
                "isCorrect": false,
                "rationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
                "label": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
                "isCorrect": false,
                "rationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
                "label": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
                "isCorrect": false,
                "rationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
            "teachingPoint": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
            "sourceLabels": [
              "Comprehensive review of PTLD after solid organ transplantation",
              "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
                "sourceLabels": [
                  "Comprehensive review of PTLD after solid organ transplantation",
                  "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
                "sourceLabels": [
                  "Comprehensive review of PTLD after solid organ transplantation",
                  "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
                "sourceLabels": [
                  "Comprehensive review of PTLD after solid organ transplantation",
                  "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy."
      }
    ]
  }
};
export const PROGRAM_BATCH8_QUESTIONS:QuestionVariant[] = [
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "stem": "Using the potassium-excluding convention, which anion-gap value and effect of hypoalbuminemia on the baseline gap best fit {patientName}'s admission panel?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.plain-gap-single.lower-decrease.r4",
        "label": "12 mmol/L with an albumin-related decrease",
        "isCorrect": true,
        "rationale": "The potassium-excluding calculation gives 12. Low albumin decreases the baseline gap and can mask an additional unmeasured-acid component.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4",
        "label": "28 mmol/L with an albumin-related decrease",
        "isCorrect": false,
        "rationale": "The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.",
        "distractorRationale": "The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate."
      },
      {
        "id": "choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4",
        "label": "12 mmol/L with an albumin-related increase",
        "isCorrect": false,
        "rationale": "The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.",
        "distractorRationale": "The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed."
      },
      {
        "id": "choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4",
        "label": "28 mmol/L with an albumin-related increase",
        "isCorrect": false,
        "rationale": "The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.",
        "distractorRationale": "The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline."
      }
    ],
    "explanation": "The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed admission specimen. Laboratory uncorrected-gap interval 8-16 mmol/L.",
      "columnHeaders": [
        "Value"
      ],
      "rowHeaders": [
        "Sodium (mmol/L)",
        "Chloride (mmol/L)",
        "Bicarbonate (mmol/L)",
        "Albumin"
      ],
      "cells": [
        [
          "140"
        ],
        [
          "112"
        ],
        [
          "16"
        ],
        [
          "Below the laboratory reference interval"
        ]
      ]
    },
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.plain-gap",
      "claim.owner-decisions.20261112.albumin-lowers-gap"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "stem": "Using the potassium-excluding convention, which paired gaps and albumin effect should guide assessment for additional unmeasured acids in {patientName}'s two specimens?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.plain-gap-trend.lower-decrease.r4",
        "label": "14 → 12 mmol/L with an albumin-related decrease",
        "isCorrect": true,
        "rationale": "The two calculated gaps are 14 and 12. Falling albumin lowers the baseline gap, so these raw results cannot settle whether an additional unmeasured-acid process is present.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4",
        "label": "32 → 30 mmol/L with an albumin-related decrease",
        "isCorrect": false,
        "rationale": "The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.",
        "distractorRationale": "The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations."
      },
      {
        "id": "choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4",
        "label": "14 → 12 mmol/L with an albumin-related increase",
        "isCorrect": false,
        "rationale": "The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.",
        "distractorRationale": "The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed."
      },
      {
        "id": "choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4",
        "label": "32 → 30 mmol/L with an albumin-related increase",
        "isCorrect": false,
        "rationale": "Both calculations omit bicarbonate, and the stated albumin effect is reversed.",
        "distractorRationale": "Both calculations omit bicarbonate, and the stated albumin effect is reversed."
      }
    ],
    "explanation": "The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed serial specimens. Laboratory uncorrected-gap interval 8-16 mmol/L.",
      "columnHeaders": [
        "Admission",
        "Later specimen"
      ],
      "rowHeaders": [
        "Sodium (mmol/L)",
        "Chloride (mmol/L)",
        "Bicarbonate (mmol/L)",
        "Albumin"
      ],
      "cells": [
        [
          "140",
          "140"
        ],
        [
          "108",
          "110"
        ],
        [
          "18",
          "18"
        ],
        [
          "Within the laboratory interval",
          "Markedly below the laboratory interval"
        ]
      ]
    },
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.plain-gap",
      "claim.owner-decisions.20261112.albumin-lowers-gap",
      "claim.owner-decisions.20261112.gap-trend-limit"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "conceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "stem": "Which perioperative plan should {patientName}'s team arrange before her colectomy?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.mh-plan.ready",
        "label": "Trigger-free general anesthesia with dantrolene plus an MH response team ready",
        "isCorrect": true,
        "rationale": "Unresolved familial susceptibility calls for nontriggering anesthesia and crisis preparedness. Specialist assessment can proceed separately from the planned operation.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.mh-plan.volatile-ready",
        "label": "Sevoflurane inhalational anesthesia with dantrolene plus an MH response team ready",
        "isCorrect": false,
        "rationale": "Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.",
        "distractorRationale": "Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible."
      },
      {
        "id": "choice.owner-decisions.20261112.mh-plan.prophylaxis",
        "label": "Trigger-free general anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution",
        "isCorrect": false,
        "rationale": "Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.",
        "distractorRationale": "Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness."
      },
      {
        "id": "choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis",
        "label": "Sevoflurane inhalational anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution",
        "isCorrect": false,
        "rationale": "Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.",
        "distractorRationale": "Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan."
      }
    ],
    "explanation": "The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.mh-family-risk",
      "claim.owner-decisions.20261112.mh-trigger-free",
      "claim.owner-decisions.20261112.mh-readiness",
      "claim.owner-decisions.20261112.mh-testing-sequence",
      "claim.owner-decisions.20261112.mh-prophylaxis"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "conceptId": "concept.mh.dantrolene-readiness.v1",
    "stem": "Which medication must the team have ready for immediate administration if {patientName} develops an MH crisis?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.mh-medication.dantrolene",
        "label": "Dantrolene",
        "isCorrect": true,
        "rationale": "Dantrolene is the crisis-specific medication required by MH preparedness guidance.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.mh-medication.naloxone",
        "label": "Naloxone",
        "isCorrect": false,
        "rationale": "Naloxone does not satisfy the MH-specific emergency medication requirement.",
        "distractorRationale": "Naloxone does not satisfy the MH-specific emergency medication requirement."
      },
      {
        "id": "choice.owner-decisions.20261112.mh-medication.flumazenil",
        "label": "Flumazenil",
        "isCorrect": false,
        "rationale": "Flumazenil does not satisfy the MH-specific emergency medication requirement.",
        "distractorRationale": "Flumazenil does not satisfy the MH-specific emergency medication requirement."
      },
      {
        "id": "choice.owner-decisions.20261112.mh-medication.sugammadex",
        "label": "Sugammadex",
        "isCorrect": false,
        "rationale": "Sugammadex does not satisfy the MH-specific emergency medication requirement.",
        "distractorRationale": "Sugammadex does not satisfy the MH-specific emergency medication requirement."
      }
    ],
    "explanation": "Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.mh-dantrolene",
      "claim.owner-decisions.20261112.mh-readiness"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "conceptId": "concept.rectal-cancer.selected-watch-and-wait",
    "stem": "Which treatment plan best fits {patientName}'s progressive post-treatment rectal findings?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.rectal-resection.resection",
        "label": "Oncologic rectal resection with total mesorectal excision",
        "isCorrect": true,
        "rationale": "Progressive concordant mural findings support the residual-disease pathway. Low anterior and abdominoperineal approaches both incorporate mesorectal clearance.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.rectal-resection.local",
        "label": "Full-thickness local rectal excision through a transanal approach",
        "isCorrect": false,
        "rationale": "The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.",
        "distractorRationale": "The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment."
      },
      {
        "id": "choice.owner-decisions.20261112.rectal-resection.observe",
        "label": "Protocolized watch-and-wait follow-up within a specialist surveillance program",
        "isCorrect": false,
        "rationale": "The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.",
        "distractorRationale": "The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach."
      }
    ],
    "explanation": "Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.rectal-negative-biopsy",
      "claim.owner-decisions.20261112.rectal-residual-surgery",
      "claim.owner-decisions.20261112.rectal-watch-selection",
      "claim.owner-decisions.20261112.rectal-operations"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
    "stem": "Which next plan best fits {patientName}'s Crohn follow-up after this limited examination?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.crohn-surveillance.scope",
        "label": "Obtain ileocolonoscopy to reassess postoperative disease activity",
        "isCorrect": true,
        "rationale": "The prior procedure did not examine the anastomosis or neoterminal ileum. Persistent stool-marker elevation warrants clarification of those postoperative sites.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.crohn-surveillance.escalate",
        "label": "Intensify infliximab maintenance therapy based on current biomarkers",
        "isCorrect": false,
        "rationale": "Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.",
        "distractorRationale": "Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation."
      },
      {
        "id": "choice.owner-decisions.20261112.crohn-surveillance.markers",
        "label": "Continue maintenance therapy with biomarker-based monitoring at follow-up",
        "isCorrect": false,
        "rationale": "The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.",
        "distractorRationale": "The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control."
      }
    ],
    "explanation": "The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.crohn-postoperative-scope",
      "claim.owner-decisions.20261112.crohn-marker-discordance",
      "claim.owner-decisions.20261112.crohn-incomplete-exam"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "stem": "Which repair plan best fits {patientName}'s symptomatic type III hiatal hernia and completed reflux assessment?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.hiatal-repair.wrap",
        "label": "Reduce hernia, close hiatus and add fundoplication",
        "isCorrect": true,
        "rationale": "The defined hiatal anatomy, reflux findings and operative fitness support adding an antireflux component to reconstruction.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.hiatal-repair.no-wrap",
        "label": "Reduce hernia and close hiatus without a wrap",
        "isCorrect": false,
        "rationale": "This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.",
        "distractorRationale": "This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation."
      },
      {
        "id": "choice.owner-decisions.20261112.hiatal-repair.fix",
        "label": "Reduce hernia and perform isolated gastric fixation",
        "isCorrect": false,
        "rationale": "A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.",
        "distractorRationale": "A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair."
      }
    ],
    "explanation": "For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.hiatal-fundoplication",
      "claim.owner-decisions.20261112.hiatal-fixation"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "conceptId": "concept.early-pregnancy.location-before-disposition.v1",
    "stem": "Which same-day diagnostic plan should be prioritized for {patientName}'s focal pain and bleeding despite the falling serum hCG?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.pregnancy-location.localize",
        "label": "Transvaginal ultrasound with gynecologic assessment",
        "isCorrect": true,
        "rationale": "A hormonal decline does not identify the implantation site. Prompt focused pelvic imaging and specialty review address the unresolved pregnancy complication.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.pregnancy-location.appendix",
        "label": "Appendiceal magnetic resonance imaging with general-surgical assessment",
        "isCorrect": false,
        "rationale": "The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.",
        "distractorRationale": "The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved."
      },
      {
        "id": "choice.owner-decisions.20261112.pregnancy-location.aspirate",
        "label": "Diagnostic uterine aspiration with histopathologic assessment",
        "isCorrect": false,
        "rationale": "The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.",
        "distractorRationale": "The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step."
      }
    ],
    "explanation": "Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.pregnancy-hcg-location",
      "claim.owner-decisions.20261112.pregnancy-symptomatic-localization",
      "claim.owner-decisions.20261112.pregnancy-aspiration-limit"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "conceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
    "stem": "Which investigation should clarify the significance of {patientName}'s persistently raised serum bicarbonate before major surgery?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.awake-gas.gas",
        "label": "Arterial blood gas analysis",
        "isCorrect": true,
        "rationale": "A daytime arterial sample directly measures carbon dioxide and can establish whether awake hypercapnia is present.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.awake-gas.polysomnography",
        "label": "Attended laboratory polysomnography",
        "isCorrect": false,
        "rationale": "This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.",
        "distractorRationale": "This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide."
      },
      {
        "id": "choice.owner-decisions.20261112.awake-gas.oximetry",
        "label": "Overnight pulse oximetry",
        "isCorrect": false,
        "rationale": "Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.",
        "distractorRationale": "Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present."
      }
    ],
    "explanation": "Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.ohs-awake-gas",
      "claim.owner-decisions.20261112.ohs-sleep-study-role"
    ]
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "conceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
    "stem": "Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?",
    "answerChoices": [
      {
        "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
        "label": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
        "isCorrect": true,
        "rationale": "Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.",
        "distractorRationale": null
      },
      {
        "id": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
        "label": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
        "isCorrect": false,
        "rationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
        "distractorRationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node."
      },
      {
        "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
        "label": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
        "isCorrect": false,
        "rationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
        "distractorRationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis."
      },
      {
        "id": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
        "label": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
        "isCorrect": false,
        "rationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
        "distractorRationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved."
      }
    ],
    "explanation": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
    "supportingEvidenceClaimIds": [
      "claim.owner-decisions.20261112.ptld-architecture",
      "claim.owner-decisions.20261112.ptld-fresh-flow",
      "claim.owner-decisions.20261112.ptld-fixed-histology"
    ]
  }
];
export const PROGRAM_BATCH8_AUTHORED_CONCEPTS = [
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "displayName": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
    "learningObjective": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "meaningChange": true,
    "versioningReason": "Preserve the harder draft stable concept ID and issue a new concept content version for the owner-directed plain-gap calculation and qualitative albumin interpretation. The prior correction-dependent laboratory-ranking objective is narrowed."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "displayName": "Plan anesthesia under unresolved familial MH susceptibility.",
    "learningObjective": "Plan anesthesia under unresolved familial MH susceptibility.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "meaningChange": false,
    "versioningReason": "Same scored clinical meaning with a new exact wording version."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.mh.dantrolene-readiness.v1",
    "displayName": "Identify the medication required for MH crisis readiness.",
    "learningObjective": "Identify the medication required for MH crisis readiness.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "meaningChange": true,
    "versioningReason": "New separately scored medication-readiness concept requested by Melissa Rowland."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.rectal-cancer.selected-watch-and-wait",
    "displayName": "Select resection for progressive residual low rectal disease.",
    "learningObjective": "Select resection for progressive residual low rectal disease.",
    "conceptType": "management",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "meaningChange": false,
    "versioningReason": "Same scored clinical meaning with a new exact wording version."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
    "displayName": "Complete postoperative mucosal assessment after ileocolic Crohn resection.",
    "learningObjective": "Complete postoperative mucosal assessment after ileocolic Crohn resection.",
    "conceptType": "workup",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "meaningChange": false,
    "versioningReason": "Same scored clinical meaning with a new exact wording version."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "displayName": "Plan reflux control during symptomatic paraesophageal hernia repair.",
    "learningObjective": "Plan reflux control during symptomatic paraesophageal hernia repair.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "meaningChange": false,
    "versioningReason": "Same scored clinical meaning with a new exact wording version."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.early-pregnancy.location-before-disposition.v1",
    "displayName": "Localize a symptomatic early pregnancy despite falling hCG.",
    "learningObjective": "Localize a symptomatic early pregnancy despite falling hCG.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "meaningChange": true,
    "versioningReason": "Retain the existing harder location-before-disposition concept ID. The distinct easy pregnancy-screening concept and frozen history remain archived."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.preoperative-osa.awake-ventilation-assessment.v1",
    "displayName": "Assess awake ventilation when obesity and sleep-disordered breathing raise concern.",
    "learningObjective": "Assess awake ventilation when obesity and sleep-disordered breathing raise concern.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "meaningChange": false,
    "versioningReason": "Retain the existing harder awake-ventilation concept. The distinct easy validated-screening item may remain in fresh play."
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
    "displayName": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
    "learningObjective": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "meaningChange": true,
    "versioningReason": "Retain the harder draft node-specimen-and-ancillary-handling concept ID. The legacy coordination-only question has a distinct historical concept."
  }
];
export const PROGRAM_BATCH8_TIMINGS:AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "nodeId": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.owner-decisions.20261112.mh-medication",
    "nodeId": "node.owner-decisions.20261112.mh-medication",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.owner-decisions.20261112.crohn-surveillance.scope",
          "choiceLabel": "Obtain ileocolonoscopy to reassess postoperative disease activity",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.crohn-surveillance.escalate",
          "choiceLabel": "Intensify infliximab maintenance therapy based on current biomarkers",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.crohn-surveillance.markers",
          "choiceLabel": "Continue maintenance therapy with biomarker-based monitoring at follow-up",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.owner-decisions.20261112.pregnancy-location.localize",
          "choiceLabel": "Transvaginal ultrasound with gynecologic assessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.pregnancy-location.appendix",
          "choiceLabel": "Appendiceal magnetic resonance imaging with general-surgical assessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri_routine"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.pregnancy-location.aspirate",
          "choiceLabel": "Diagnostic uterine aspiration with histopathologic assessment",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.owner-decisions.20261112.awake-gas.gas",
          "choiceLabel": "Arterial blood gas analysis",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.awake-gas.polysomnography",
          "choiceLabel": "Attended laboratory polysomnography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.overnight_protocol"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.awake-gas.oximetry",
          "choiceLabel": "Overnight pulse oximetry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.overnight_protocol"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
          "choiceLabel": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
          "choiceLabel": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
          "choiceLabel": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
          "choiceLabel": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  }
];
export const PROGRAM_BATCH8_ORDERS = [
  {
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "choiceId": "choice.owner-decisions.20261112.crohn-surveillance.scope",
    "choiceLabel": "Obtain ileocolonoscopy to reassess postoperative disease activity",
    "timingProfileId": "timing.test.lower_endoscopy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "choiceId": "choice.owner-decisions.20261112.crohn-surveillance.markers",
    "choiceLabel": "Continue maintenance therapy with biomarker-based monitoring at follow-up",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "choiceId": "choice.owner-decisions.20261112.pregnancy-location.localize",
    "choiceLabel": "Transvaginal ultrasound with gynecologic assessment",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "choiceId": "choice.owner-decisions.20261112.pregnancy-location.appendix",
    "choiceLabel": "Appendiceal magnetic resonance imaging with general-surgical assessment",
    "timingProfileId": "timing.test.mri_routine",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "choiceId": "choice.owner-decisions.20261112.pregnancy-location.aspirate",
    "choiceLabel": "Diagnostic uterine aspiration with histopathologic assessment",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "choiceId": "choice.owner-decisions.20261112.awake-gas.gas",
    "choiceLabel": "Arterial blood gas analysis",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "choiceId": "choice.owner-decisions.20261112.awake-gas.polysomnography",
    "choiceLabel": "Attended laboratory polysomnography",
    "timingProfileId": "timing.test.overnight_protocol",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "choiceId": "choice.owner-decisions.20261112.awake-gas.oximetry",
    "choiceLabel": "Overnight pulse oximetry",
    "timingProfileId": "timing.test.overnight_protocol",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
    "choiceLabel": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
    "choiceLabel": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
    "choiceLabel": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
    "choiceLabel": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH8_RETAINED_TIMINGS:Array<{index:number;entry:AnswerChoiceTimingRegistryEntry}> = [
  {
    "index": 2350,
    "entry": {
      "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
      "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
      "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.egh.symptomatic-hernia-anemia.repair",
            "choiceLabel": "Elective anatomical hiatal hernia repair",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          },
          {
            "choiceId": "choice.topic.egh.symptomatic-hernia-anemia.medical",
            "choiceLabel": "Continued PPI and iron with observation",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.egh.symptomatic-hernia-anemia.fix",
            "choiceLabel": "Limited reduction and gastric fixation",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          }
        ]
      }
    }
  },
  {
    "index": 2351,
    "entry": {
      "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
      "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
      "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.egh.repair-with-reflux-control.wrap",
            "choiceLabel": "Reduce hernia, close hiatus and add fundoplication",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          },
          {
            "choiceId": "choice.topic.egh.repair-with-reflux-control.none",
            "choiceLabel": "Reduce hernia and close hiatus without a wrap",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          },
          {
            "choiceId": "choice.topic.egh.repair-with-reflux-control.fix",
            "choiceLabel": "Reduce hernia and perform gastric fixation",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          }
        ]
      }
    }
  },
  {
    "index": 2416,
    "entry": {
      "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
      "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
      "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.ileocolonoscopy.v2",
            "choiceLabel": "Obtain ileocolonoscopy to reassess disease activity",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.endoscopy_with_sampling"
            }
          },
          {
            "choiceId": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.escalate.v2",
            "choiceLabel": "Intensify infliximab maintenance treatment",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.monitor.v2",
            "choiceLabel": "Continue treatment with biomarker-only monitoring",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    }
  },
  {
    "index": 2582,
    "entry": {
      "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
      "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
      "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.cpc.residual-despite-negative-biopsy.tme.v1",
            "choiceLabel": "Oncologic rectal resection with total mesorectal excision",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.cpc.residual-despite-negative-biopsy.local.v1",
            "choiceLabel": "Full-thickness transanal excision of the treated site",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          },
          {
            "choiceId": "choice.cpc.residual-despite-negative-biopsy.watch.v1",
            "choiceLabel": "Protocolized watch-and-wait surveillance",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.rectal_response_assessment"
            }
          }
        ]
      }
    }
  },
  {
    "index": 2765,
    "entry": {
      "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
      "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
      "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.proceed.v1",
            "choiceLabel": "Proceed with the proposed anesthetic; arrange MH specialist assessment",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.test-first.v1",
            "choiceLabel": "Complete muscle-contracture testing before using the proposed anesthetic",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.pretreat.v1",
            "choiceLabel": "Give prophylactic dantrolene before using the proposed anesthetic",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    }
  }
];
export const PROGRAM_BATCH8_RETAINED_ORDERS = [
  {
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "choiceId": "choice.topic.egh.symptomatic-hernia-anemia.repair",
    "choiceLabel": "Elective anatomical hiatal hernia repair",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "choiceId": "choice.topic.egh.symptomatic-hernia-anemia.fix",
    "choiceLabel": "Limited reduction and gastric fixation",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "choiceId": "choice.topic.egh.repair-with-reflux-control.wrap",
    "choiceLabel": "Reduce hernia, close hiatus and add fundoplication",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "choiceId": "choice.topic.egh.repair-with-reflux-control.none",
    "choiceLabel": "Reduce hernia and close hiatus without a wrap",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "choiceId": "choice.topic.egh.repair-with-reflux-control.fix",
    "choiceLabel": "Reduce hernia and perform gastric fixation",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "choiceId": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.ileocolonoscopy.v2",
    "choiceLabel": "Obtain ileocolonoscopy to reassess disease activity",
    "timingProfileId": "timing.test.endoscopy_with_sampling",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "choiceId": "choice.cpc.residual-despite-negative-biopsy.local.v1",
    "choiceLabel": "Full-thickness transanal excision of the treated site",
    "timingProfileId": "timing.test.clinical_procedure",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "choiceId": "choice.cpc.residual-despite-negative-biopsy.watch.v1",
    "choiceLabel": "Protocolized watch-and-wait surveillance",
    "timingProfileId": "timing.test.rectal_response_assessment",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "choiceId": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.test-first.v1",
    "choiceLabel": "Complete muscle-contracture testing before using the proposed anesthetic",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH8_RETAINED_CONCEPTS:Array<{index:number;entry:SyntheticClinicalRelease["concepts"][number]}> = [
  {
    "index": 100,
    "entry": {
      "id": "concept.rectal-cancer.selected-watch-and-wait",
      "displayName": "Selected watch-and-wait after clinical complete response",
      "learningObjective": "Recognize intensive-surveillance watch-and-wait as an acceptable nonsurgical option for a fully informed adherent patient with a clinical complete response in an experienced program.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    }
  },
  {
    "index": 660,
    "entry": {
      "id": "concept.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
      "displayName": "Recognize anemia and meal symptoms as consequential paraesophageal-hernia manifestations.",
      "learningObjective": "Recognize anemia and meal symptoms as consequential paraesophageal-hernia manifestations.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    }
  },
  {
    "index": 661,
    "entry": {
      "id": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
      "displayName": "Plan reflux control as part of a symptomatic type III hernia repair.",
      "learningObjective": "Plan reflux control as part of a symptomatic type III hernia repair.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    }
  },
  {
    "index": 709,
    "entry": {
      "id": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
      "displayName": "crohn surveillance",
      "learningObjective": "Choose postoperative mucosal assessment despite symptom control after ileocolic Crohn resection.",
      "earliestFacilityStage": 2,
      "conceptType": "workup"
    }
  },
  {
    "index": 982,
    "entry": {
      "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "displayName": "Choose the surgical testing sequence under unresolved familial MH risk",
      "learningObjective": "Interpret family history and an uninformative genetic result, then distinguish nontriggering perioperative planning from prophylactic dantrolene or obligatory preoperative contracture testing.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    }
  }
];
export const PROGRAM_BATCH8_REPLACED_ROWS:QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "sourceView": "topic-batch3-esophagus-gerd-barrett-hiatal",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
    "sourceView": "topic-batch3-bowel-ibd-malabsorption-short-bowel",
    "decision": "docs/research/question-topic-acceptance-batch3-20261111.md"
  },
  {
    "acceptanceId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "conceptId": "concept.rectal-cancer.selected-watch-and-wait",
    "sourceView": "topic-batch4-colorectal-polyps-cancer",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  },
  {
    "acceptanceId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "conceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "sourceView": "topic-batch4-anesthesia-analgesia-pharmacology",
    "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
  }
];
export const PROGRAM_BATCH8_RETAINED_CASES:SyntheticClinicalCase[] = [
  {
    "id": "case.gs028d.acid-base.b-cirrhosis-gap",
    "displayName": "Acid-base interpretation",
    "patientPresentationVariantId": "presentation.gs028d.acid-base.b-cirrhosis-gap",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Acidosis panel review",
    "presentation": "{patientName}, a 49-year-old woman with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 49-year-old woman with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 49-year-old man with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.67",
        "prototypeDemographics": {
          "ageYears": 67,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 67-year-old woman with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.67",
        "prototypeDemographics": {
          "ageYears": 67,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 67-year-old man with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.acid-base.b-cirrhosis-gap.1",
        "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1",
        "primaryConceptId": "concept.metabolic-acidosis.albumin-corrected-anion-gap",
        "stem": "Which calculation best assesses whether unmeasured anions are accumulating in this patient?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Albumin-corrected anion gap",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_1",
            "label": "Uncorrected anion gap alone",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_1",
            "label": "Bicarbonate concentration alone",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_1",
            "label": "Uncorrected osmolar gap alone",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Hypoalbuminaemia lowers the expected anion gap, so the corrected gap is the appropriate classification tool.",
        "sourceLabels": [
          "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Uncorrected anion gap alone.”",
            "clinicalRationale": "Hypoalbuminaemia lowers the expected anion gap, so the corrected gap is the appropriate classification tool.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          },
          {
            "answerChoiceId": "d2_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Bicarbonate concentration alone.”",
            "clinicalRationale": "Hypoalbuminaemia lowers the expected anion gap, so the corrected gap is the appropriate classification tool.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          },
          {
            "answerChoiceId": "d3_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Uncorrected osmolar gap alone.”",
            "clinicalRationale": "Hypoalbuminaemia lowers the expected anion gap, so the corrected gap is the appropriate classification tool.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Hypoalbuminaemia lowers the expected anion gap, so the corrected gap is the appropriate classification tool."
  },
  {
    "id": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "displayName": "Acid-base interpretation",
    "patientPresentationVariantId": "presentation.gs028d.acid-base.b-sepsis-recovery-gap",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 45,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Hospital panel question",
    "presentation": "{patientName}, a 45-year-old woman is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45",
        "prototypeDemographics": {
          "ageYears": 45,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 45-year-old woman is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45",
        "prototypeDemographics": {
          "ageYears": 45,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 45-year-old man is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72",
        "prototypeDemographics": {
          "ageYears": 72,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 72-year-old woman is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72",
        "prototypeDemographics": {
          "ageYears": 72,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 72-year-old man is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
        "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3",
        "primaryConceptId": "concept.metabolic-acidosis.albumin-corrected-anion-gap",
        "stem": "Which interpretation avoids underestimating unmeasured anion accumulation in the admission record?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Albumin-corrected anion gap",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_3",
            "label": "Uncorrected anion gap alone",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_3",
            "label": "Uncorrected osmolar gap alone",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_3",
            "label": "Serum lactate level alone",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The corrected gap is needed to interpret unmeasured anions in a hypoalbuminaemic patient.",
        "sourceLabels": [
          "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Uncorrected anion gap alone.”",
            "clinicalRationale": "The corrected gap is needed to interpret unmeasured anions in a hypoalbuminaemic patient.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          },
          {
            "answerChoiceId": "d2_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Uncorrected osmolar gap alone.”",
            "clinicalRationale": "The corrected gap is needed to interpret unmeasured anions in a hypoalbuminaemic patient.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          },
          {
            "answerChoiceId": "d3_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Serum lactate level alone.”",
            "clinicalRationale": "The corrected gap is needed to interpret unmeasured anions in a hypoalbuminaemic patient.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The corrected gap is needed to interpret unmeasured anions in a hypoalbuminaemic patient."
  },
  {
    "id": "case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2",
    "displayName": "Nora Ellis: Hospital laboratory review",
    "patientPresentationVariantId": "presentation.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "Nora Ellis",
    "prototypeDemographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Hospital laboratory review",
    "presentation": "{patientName}, a 58-year-old woman, attends clinic to review the evolving laboratory results from her outside admission.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hospital laboratory review",
        "presentation": "{patientName}, a 58-year-old woman, attends clinic to review the evolving laboratory results from her outside admission."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
    ],
    "decisionNodes": [
      {
        "id": "node.topic.fluids-electrolytes-acid-base.current-corrected-gap.v2",
        "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2",
        "primaryConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
        "currentUpdate": "During the outside admission for diarrhoea while taking lactulose, peripheral chemistry and arterial specimens were collected together. Cirrhosis and persistently low albumin were already documented in the preceding clinic records.",
        "stem": "Which initial cause-directed laboratory panel should the hospital team have requested for {patientName} at that sampling time?",
        "answerChoices": [
          {
            "id": "choice.topic.fea.r2.current-corrected-gap.1",
            "label": "Plasma lactate and beta-hydroxybutyrate",
            "isCorrect": true,
            "rationale": "The raw gap is 140 - 112 - 16 = 12 mmol/L. Albumin adjustment adds 6, giving 18 mmol/L, above this laboratory interval. Diarrhoeal bicarbonate loss may coexist, but an additional unmeasured-acid component warrants the offered current lactate and blood-ketone panel.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.fea.r2.current-corrected-gap.2",
            "label": "Urine electrolytes and urine pH",
            "isCorrect": false,
            "rationale": "These can evaluate selected unexplained normal-gap acidification problems. They should not replace investigating the additional adjusted-gap component demonstrated here.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.fea.r2.current-corrected-gap.3",
            "label": "Stool electrolytes and stool osmotic gap",
            "isCorrect": false,
            "rationale": "Stool characterization may clarify a diarrhoeal mechanism but does not investigate the additional unmeasured-acid signal in the same specimen.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The raw gap is 140 - 112 - 16 = 12 mmol/L. Albumin adjustment adds 6, giving 18 mmol/L, above this laboratory interval. Diarrhoeal bicarbonate loss may coexist, but an additional unmeasured-acid component warrants the offered current lactate and blood-ketone panel.",
        "exhibit": {
          "kind": "table",
          "caption": "Constructed current panel; laboratory AG reference 8-16 mmol/L; adjustment = AG + 0.25 * (40 - albumin in g/L)",
          "columnHeaders": [
            "Observation"
          ],
          "rowHeaders": [
            "Sodium / chloride (mmol/L)",
            "Bicarbonate (mmol/L)",
            "Albumin (g/L)",
            "Arterial pH / PCO2 (mmHg)",
            "Creatinine (mg/dL)"
          ],
          "cells": [
            [
              "140 / 112"
            ],
            [
              "16"
            ],
            [
              "16"
            ],
            [
              "7.32 / 32"
            ],
            [
              "0.9"
            ]
          ]
        },
        "sourceLabels": [
          "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.topic.fea.r2.current-corrected-gap.2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the recorded observations and the decision before continuing.",
            "clinicalRationale": "These can evaluate selected unexplained normal-gap acidification problems. They should not replace investigating the additional adjusted-gap component demonstrated here.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          },
          {
            "answerChoiceId": "choice.topic.fea.r2.current-corrected-gap.3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the recorded observations and the decision before continuing.",
            "clinicalRationale": "Stool characterization may clarify a diarrhoeal mechanism but does not investigate the additional unmeasured-acid signal in the same specimen.",
            "sourceLabels": [
              "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The raw gap is 140 - 112 - 16 = 12 mmol/L. Albumin adjustment adds 6, giving 18 mmol/L, above this laboratory interval. Diarrhoeal bicarbonate loss may coexist, but an additional unmeasured-acid component warrants the offered current lactate and blood-ketone panel."
  },
  {
    "id": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "displayName": "Clinic chart: Nora Bennett",
    "patientPresentationVariantId": "presentation.topic.anesthesia-analgesia-pharmacology.mh-family-plan.v1",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "Nora Bennett",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Anesthetic planning",
    "presentation": "{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her prior sevoflurane anesthetic was uncomplicated. Her blood panel found no pathogenic variant; the family has no identified causative variant. The anesthetist proposes propofol-remifentanil anesthesia with rocuronium. The center records completed workstation preparation, a trained MH response team with dantrolene stocked, and a formal hospital-transfer agreement.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.topic.anesthesia-analgesia-pharmacology.mh-family-plan.v1",
        "prototypeDemographics": {
          "ageYears": 35,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Anesthetic planning",
        "presentation": "{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her prior sevoflurane anesthetic was uncomplicated. Her blood panel found no pathogenic variant; the family has no identified causative variant. The anesthetist proposes propofol-remifentanil anesthesia with rocuronium. The center records completed workstation preparation, a trained MH response team with dantrolene stocked, and a formal hospital-transfer agreement."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Perioperative management of MH suspected or susceptible patients",
      "Recognising and managing a malignant hyperthermia crisis (v2024)",
      "JSA guideline for management of malignant hyperthermia in 2025"
    ],
    "decisionNodes": [
      {
        "id": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
        "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
        "primaryConceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
        "stem": "Which recommendation should be sent to {patientName}'s anesthetist for the planned colectomy?",
        "answerChoices": [
          {
            "id": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.proceed.v1",
            "label": "Proceed with the proposed anesthetic; arrange MH specialist assessment",
            "isCorrect": true,
            "rationale": "Family risk remains, but prepared nontriggering surgery need not wait for definitive testing.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.test-first.v1",
            "label": "Complete muscle-contracture testing before using the proposed anesthetic",
            "isCorrect": false,
            "rationale": "Testing clarifies susceptibility but is not automatically a prerequisite to prepared trigger-free anesthesia.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.pretreat.v1",
            "label": "Give prophylactic dantrolene before using the proposed anesthetic",
            "isCorrect": false,
            "rationale": "Rescue readiness differs from prophylactic exposure in an asymptomatic patient.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The uneventful exposure and uninformative negative panel do not clear {patientName}'s family risk. The proposed pathway avoids triggers and documents actual preparedness. Proceed with that pathway while arranging specialist assessment rather than require testing completion or routine dantrolene prophylaxis.",
        "sourceLabels": [
          "Perioperative management of MH suspected or susceptible patients",
          "Recognising and managing a malignant hyperthermia crisis (v2024)",
          "JSA guideline for management of malignant hyperthermia in 2025"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.test-first.v1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the outside-care decision; no patient outcome is simulated.",
            "clinicalRationale": "Testing clarifies susceptibility but is not automatically a prerequisite to prepared trigger-free anesthesia.",
            "sourceLabels": [
              "Perioperative management of MH suspected or susceptible patients",
              "Recognising and managing a malignant hyperthermia crisis (v2024)",
              "JSA guideline for management of malignant hyperthermia in 2025"
            ]
          },
          {
            "answerChoiceId": "choice.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.pretreat.v1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the outside-care decision; no patient outcome is simulated.",
            "clinicalRationale": "Rescue readiness differs from prophylactic exposure in an asymptomatic patient.",
            "sourceLabels": [
              "Perioperative management of MH suspected or susceptible patients",
              "Recognising and managing a malignant hyperthermia crisis (v2024)",
              "JSA guideline for management of malignant hyperthermia in 2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The uneventful exposure and uninformative negative panel do not clear {patientName}'s family risk. The proposed pathway avoids triggers and documents actual preparedness. Proceed with that pathway while arranging specialist assessment rather than require testing completion or routine dantrolene prophylaxis."
  },
  {
    "id": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "displayName": "Amelia Grant: Rectal response consultation",
    "patientPresentationVariantId": "presentation.cpc.persistent-rectal-wall-focus.v1",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "Amelia Grant",
    "prototypeDemographics": {
      "ageYears": 57,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Rectal response consultation",
    "presentation": "{patientName}, a 57-year-old woman, attends clinic after outside neoadjuvant treatment for a previously node-positive low rectal adenocarcinoma.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.cpc.persistent-rectal-wall-focus.v1",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Rectal response consultation",
        "presentation": "{patientName}, a 57-year-old woman, attends clinic after outside neoadjuvant treatment for a previously node-positive low rectal adenocarcinoma."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ASCRS Management of Rectal Cancer (2020)",
      "Rectal Cancer Treatment (PDQ), Health Professional Version",
      "ASCRS Management of Rectal Cancer 2023 Supplement"
    ],
    "decisionNodes": [
      {
        "id": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
        "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
        "primaryConceptId": "concept.rectal-cancer.selected-watch-and-wait",
        "currentUpdate": "Treatment ended in July. In September, a firm mural nodule was palpable beneath intact mucosa; on a later October assessment it was larger. MRI shows a corresponding intermediate-T2 focus with diffusion restriction. Superficial biopsies contain scar and inflammation. Distant restaging is negative. She is fit for resection and remains interested in organ preservation.",
        "stem": "Which treatment plan best fits {patientName}'s current rectal findings?",
        "answerChoices": [
          {
            "id": "choice.cpc.residual-despite-negative-biopsy.tme.v1",
            "label": "Oncologic rectal resection with total mesorectal excision",
            "isCorrect": true,
            "rationale": "Progressive concordant mural abnormalities are not a complete response; regional oncologic resection assessment is supported.",
            "serviceRequest": null
          },
          {
            "id": "choice.cpc.residual-despite-negative-biopsy.local.v1",
            "label": "Full-thickness transanal excision of the treated site",
            "isCorrect": false,
            "rationale": "The prior regional disease and persistent mural findings do not establish a favorable local-only treatment group.",
            "serviceRequest": null
          },
          {
            "id": "choice.cpc.residual-despite-negative-biopsy.watch.v1",
            "label": "Protocolized watch-and-wait surveillance",
            "isCorrect": false,
            "rationale": "Interest in organ preservation does not convert progressive palpable/MRI disease into a complete clinical response.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The biopsy describes the surface specimen. Progressive concordant mural findings defeat a complete-response conclusion despite that negative sample and her organ-preservation goal.",
        "sourceLabels": [
          "ASCRS Management of Rectal Cancer (2020)",
          "Rectal Cancer Treatment (PDQ), Health Professional Version",
          "ASCRS Management of Rectal Cancer 2023 Supplement"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.cpc.residual-despite-negative-biopsy.local.v1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The clinic review records the proposed plan and its clinical reasoning.",
            "clinicalRationale": "The prior regional disease and persistent mural findings do not establish a favorable local-only treatment group.",
            "sourceLabels": [
              "ASCRS Management of Rectal Cancer (2020)",
              "Rectal Cancer Treatment (PDQ), Health Professional Version",
              "ASCRS Management of Rectal Cancer 2023 Supplement"
            ]
          },
          {
            "answerChoiceId": "choice.cpc.residual-despite-negative-biopsy.watch.v1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The clinic review records the proposed plan and its clinical reasoning.",
            "clinicalRationale": "Interest in organ preservation does not convert progressive palpable/MRI disease into a complete clinical response.",
            "sourceLabels": [
              "ASCRS Management of Rectal Cancer (2020)",
              "Rectal Cancer Treatment (PDQ), Health Professional Version",
              "ASCRS Management of Rectal Cancer 2023 Supplement"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The biopsy describes the surface specimen. Progressive concordant mural findings defeat a complete-response conclusion despite that negative sample and her organ-preservation goal."
  },
  {
    "id": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "displayName": "Hospital course review",
    "patientPresentationVariantId": "presentation.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v1",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "Maya Bennett",
    "prototypeDemographics": {
      "ageYears": 36,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Hospital course review",
    "presentation": "{patientName}, a 36-year-old woman with ileal Crohn disease, attends clinic after an outside hospitalization. The founder reviews the hospital decisions and subsequent records with her.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v1",
        "prototypeDemographics": {
          "ageYears": 36,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Hospital course review",
        "presentation": "{patientName}, a 36-year-old woman with ileal Crohn disease, attends clinic after an outside hospitalization. The founder reviews the hospital decisions and subsequent records with her."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 2,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Original constructed clinical teaching case",
      "Unapproved topic sidecar; Melissa Rowland is clinical sign-off"
    ],
    "decisionNodes": [
      {
        "id": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
        "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
        "primaryConceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
        "currentUpdate": "Eight months after ileocolic resection for Crohn disease, she feels well on maintenance infliximab. CRP is within range, but fecal calprotectin is 420 and 460 micrograms/g on two samples. Stool testing found no enteric pathogen. An outside colonoscopy was reported as normal. Its procedure record is shown below.",
        "stem": "Which next plan best fits {patientName}'s postoperative Crohn record?",
        "answerChoices": [
          {
            "id": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.ileocolonoscopy.v2",
            "label": "Obtain ileocolonoscopy to reassess disease activity",
            "isCorrect": true,
            "rationale": "The apparently normal procedure assessed distal colon. The raised stool marker remains discordant with clinical remission and needs endoscopic clarification before empiric treatment change.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.escalate.v2",
            "label": "Intensify infliximab maintenance treatment",
            "isCorrect": false,
            "rationale": "The stool findings raise concern, but do not establish the site or severity of recurrence. In symptomatic remission, the AGA favors endoscopic confirmation over empiric treatment adjustment.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.monitor.v2",
            "label": "Continue treatment with biomarker-only monitoring",
            "isCorrect": false,
            "rationale": "Normal CRP and absent symptoms do not resolve repeated stool-marker elevation or the limited procedural coverage. Biomarker-only strategies have conditional roles, rather than being interchangeable with this incomplete assessment.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The normal summary describes distal colon, not the ileocolic postoperative sites. Repeated fecal-calprotectin elevation remains unexplained by that examination despite symptom control and normal CRP. Complete endoscopic assessment should clarify activity before changing infliximab. Biomarker-only postoperative monitoring is supported in selected low-calprotectin settings, so a universal endoscopy-for-every-normal-marker rule is withheld.",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record. observations are fictional",
          "items": [
            {
              "label": "Extent reached",
              "value": "Splenic flexure. proximal examination stopped because preparation obscured the lumen"
            },
            {
              "label": "Biopsy containers",
              "value": "Descending colon, sigmoid colon and rectum. no active inflammation"
            },
            {
              "label": "Current symptoms",
              "value": "Usual oral intake and bowel function. no postprandial distension or vomiting"
            }
          ]
        },
        "sourceLabels": [
          "Original constructed clinical teaching case",
          "Unapproved topic sidecar; Melissa Rowland is clinical sign-off"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.escalate.v2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review this clinical decision and feedback; no patient outcome is simulated.",
            "clinicalRationale": "The stool findings raise concern, but do not establish the site or severity of recurrence. In symptomatic remission, the AGA favors endoscopic confirmation over empiric treatment adjustment.",
            "sourceLabels": [
              "Original constructed clinical teaching case",
              "Unapproved topic sidecar; Melissa Rowland is clinical sign-off"
            ]
          },
          {
            "answerChoiceId": "choice.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.monitor.v2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review this clinical decision and feedback; no patient outcome is simulated.",
            "clinicalRationale": "Normal CRP and absent symptoms do not resolve repeated stool-marker elevation or the limited procedural coverage. Biomarker-only strategies have conditional roles, rather than being interchangeable with this incomplete assessment.",
            "sourceLabels": [
              "Original constructed clinical teaching case",
              "Unapproved topic sidecar; Melissa Rowland is clinical sign-off"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The normal summary describes distal colon, not the ileocolic postoperative sites. Repeated fecal-calprotectin elevation remains unexplained by that examination despite symptom control and normal CRP. Complete endoscopic assessment should clarify activity before changing infliximab. Biomarker-only postoperative monitoring is supported in selected low-calprotectin settings, so a universal endoscopy-for-every-normal-marker rule is withheld."
  },
  {
    "id": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "displayName": "Hernia anemia",
    "patientPresentationVariantId": "presentation.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "Helen Carter",
    "prototypeDemographics": {
      "ageYears": 69,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Recurrent anemia",
    "presentation": "{patientName}, a 69-year-old woman, visits the clinic. She reviews outside foregut records after iron deficiency recurred despite PPI treatment and iron replacement. Early satiety limits meals. She remains independent, and the outside preoperative review found no prohibitive cardiopulmonary condition.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
        "prototypeDemographics": {
          "ageYears": 69,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Recurrent anemia",
        "presentation": "{patientName}, a 69-year-old woman, visits the clinic. She reviews outside foregut records after iron deficiency recurred despite PPI treatment and iron replacement. Early satiety limits meals. She remains independent, and the outside preoperative review found no prohibitive cardiopulmonary condition."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.referral",
    "sourceLabels": [
      "SAGES hiatal-hernia surgical guideline (2024)",
      "WSES complicated diaphragmatic hernia position paper (2023)",
      "Paraesophageal hernia and iron deficiency anemia (2021 opinion review)",
      "ACG GERD guideline (2022)",
      "Multi-society GERD treatment guideline (2023)"
    ],
    "decisionNodes": [
      {
        "id": "node.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
        "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
        "primaryConceptId": "concept.topic.esophagus-gerd-barrett-hiatal.symptomatic-hernia-anemia.v1",
        "stem": "Which plan is most appropriate to offer {patientName} for the findings and treatment course?",
        "answerChoices": [
          {
            "id": "choice.topic.egh.symptomatic-hernia-anemia.repair",
            "label": "Elective anatomical hiatal hernia repair",
            "isCorrect": true,
            "rationale": "Her anatomy, contact-site erosions, recurrent iron deficiency and meal limitation make the hernia plausibly symptomatic despite medical treatment. Offering repair is reasonable in a patient without prohibitive risk; it is not a mandate for every incidental hernia.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.egh.symptomatic-hernia-anemia.medical",
            "label": "Continued PPI and iron with observation",
            "isCorrect": false,
            "rationale": "Medical treatment is a reasonable initial approach, but recurrent deficiency and meal limitation despite that course support offering a mechanical repair rather than calling the hernia incidental.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.egh.symptomatic-hernia-anemia.fix",
            "label": "Limited reduction and gastric fixation",
            "isCorrect": false,
            "rationale": "A limited strategy may suit patients unable to tolerate definitive reconstruction, but that risk constraint is not present in the completed assessment.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Her anatomy, contact-site erosions, recurrent iron deficiency and meal limitation make the hernia plausibly symptomatic despite medical treatment. Offering repair is reasonable in a patient without prohibitive risk; it is not a mandate for every incidental hernia.",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional observations",
          "items": [
            {
              "label": "Anatomy",
              "value": "Both the gastroesophageal junction and gastric fundus lie above the diaphragm."
            },
            {
              "label": "Endoscopic and anemia review",
              "value": "Linear gastric erosions occur at the diaphragmatic impression; the completed alternative-source workup found no other bleeding source."
            },
            {
              "label": "Course",
              "value": "Iron stores improve with replacement, then fall again during the documented medical-treatment course; meal limitation persists."
            }
          ]
        },
        "sourceLabels": [
          "SAGES hiatal-hernia surgical guideline (2024)",
          "WSES complicated diaphragmatic hernia position paper (2023)",
          "Paraesophageal hernia and iron deficiency anemia (2021 opinion review)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": []
      },
      {
        "id": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
        "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
        "primaryConceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
        "currentUpdate": "{patientName} returns after the outside team completes its physiological assessment.",
        "stem": "Which repair plan best fits {patientName}'s completed preoperative assessment?",
        "answerChoices": [
          {
            "id": "choice.topic.egh.repair-with-reflux-control.wrap",
            "label": "Reduce hernia, close hiatus and add fundoplication",
            "isCorrect": true,
            "rationale": "Objective reflux and intact motor function support including a fundoplication with type III hernia reconstruction. The benefit is conditional and balanced against dysphagia risk; no particular wrap or mesh policy is selected.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.egh.repair-with-reflux-control.none",
            "label": "Reduce hernia and close hiatus without a wrap",
            "isCorrect": false,
            "rationale": "Anatomical repair addresses displacement, but omitting an antireflux component leaves the documented reflux concern unaddressed in this fit patient.",
            "serviceRequest": null
          },
          {
            "id": "choice.topic.egh.repair-with-reflux-control.fix",
            "label": "Reduce hernia and perform gastric fixation",
            "isCorrect": false,
            "rationale": "Limited fixation can reduce operative burden but does not provide the same anatomical and antireflux reconstruction for this patient.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Objective reflux and intact motor function support including a fundoplication with type III hernia reconstruction. The benefit is conditional and balanced against dysphagia risk; no particular wrap or mesh policy is selected.",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed teaching record; fictional observations",
          "items": [
            {
              "label": "Reflux study",
              "value": "Off-PPI monitoring reports acid exposure above the laboratory pathological range."
            },
            {
              "label": "Motor study",
              "value": "Normal lower-sphincter relaxation, propagating contractions and contraction augmentation with multiple rapid swallows."
            },
            {
              "label": "Operative review",
              "value": "Definitive hernia reconstruction is planned; no swallowing limitation or prohibitive operative condition is identified."
            }
          ]
        },
        "sourceLabels": [
          "ACG GERD guideline (2022)",
          "SAGES hiatal-hernia surgical guideline (2024)",
          "Multi-society GERD treatment guideline (2023)",
          "WSES complicated diaphragmatic hernia position paper (2023)"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.topic.egh.repair-with-reflux-control.none",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the recorded findings and the proposed care plan.",
            "clinicalRationale": "Anatomical repair addresses displacement, but omitting an antireflux component leaves the documented reflux concern unaddressed in this fit patient.",
            "sourceLabels": [
              "ACG GERD guideline (2022)",
              "SAGES hiatal-hernia surgical guideline (2024)",
              "Multi-society GERD treatment guideline (2023)",
              "WSES complicated diaphragmatic hernia position paper (2023)"
            ]
          },
          {
            "answerChoiceId": "choice.topic.egh.repair-with-reflux-control.fix",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the recorded findings and the proposed care plan.",
            "clinicalRationale": "Limited fixation can reduce operative burden but does not provide the same anatomical and antireflux reconstruction for this patient.",
            "sourceLabels": [
              "ACG GERD guideline (2022)",
              "SAGES hiatal-hernia surgical guideline (2024)",
              "Multi-society GERD treatment guideline (2023)",
              "WSES complicated diaphragmatic hernia position paper (2023)"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Her anatomy, contact-site erosions, recurrent iron deficiency and meal limitation make the hernia plausibly symptomatic despite medical treatment. Offering repair is reasonable in a patient without prohibitive risk; it is not a mandate for every incidental hernia. Objective reflux and intact motor function support including a fundoplication with type III hernia reconstruction. The benefit is conditional and balanced against dysphagia risk; no particular wrap or mesh policy is selected."
  },
  {
    "id": "case.gs028f.gynecology.c1-late-period",
    "displayName": "A possible pregnancy changes the question",
    "patientPresentationVariantId": "presentation.gs028f.gynecology.c1-late-period",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 24,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Pelvic ache",
    "presentation": "{patientName}, a 24-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028f.gynecology.c1-late-period.female.24",
        "prototypeDemographics": {
          "ageYears": 24,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 24-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway."
      },
      {
        "id": "profile.gs028f.gynecology.c1-late-period.female.32",
        "prototypeDemographics": {
          "ageYears": 32,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 32-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Pregnancy Test",
      "Early pregnancy loss",
      "Ectopic pregnancy",
      "Ectopic Pregnancy"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028f.gynecology.c1-late-period.1",
        "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1",
        "primaryConceptId": "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
        "stem": "Which laboratory test should assess possible pregnancy during this patient's pelvic-pain evaluation?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Serum hCG measurement",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.basic_labs"
            }
          },
          {
            "id": "d1_1",
            "label": "Complete blood count",
            "isCorrect": false,
            "serviceRequest": {
              "serviceId": "service.basic_labs"
            }
          },
          {
            "id": "d2_1",
            "label": "Serum lipase testing",
            "isCorrect": false,
            "serviceRequest": {
              "serviceId": "service.basic_labs"
            }
          },
          {
            "id": "d3_1",
            "label": "Serum creatinine testing",
            "isCorrect": false,
            "serviceRequest": {
              "serviceId": "service.basic_labs"
            }
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
        "sourceLabels": [
          "Pregnancy Test",
          "Early pregnancy loss",
          "Ectopic pregnancy",
          "Ectopic Pregnancy"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Complete blood count.”",
            "clinicalRationale": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
            "sourceLabels": [
              "Pregnancy Test",
              "Early pregnancy loss",
              "Ectopic pregnancy",
              "Ectopic Pregnancy"
            ]
          },
          {
            "answerChoiceId": "d2_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Serum lipase testing.”",
            "clinicalRationale": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
            "sourceLabels": [
              "Pregnancy Test",
              "Early pregnancy loss",
              "Ectopic pregnancy",
              "Ectopic Pregnancy"
            ]
          },
          {
            "answerChoiceId": "d3_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Serum creatinine testing.”",
            "clinicalRationale": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings.",
            "sourceLabels": [
              "Pregnancy Test",
              "Early pregnancy loss",
              "Ectopic pregnancy",
              "Ectopic Pregnancy"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The correct answer is “Serum hCG measurement.” Pregnancy status belongs in this evaluation because pregnancy is possible; the result must be interpreted with the clinical findings."
  },
  {
    "id": "case.gs028b.ptld.b-pathology-returned",
    "displayName": "Post-transplant lymphoproliferative disorder",
    "patientPresentationVariantId": "presentation.gs028b.ptld.b-pathology-returned",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Review biopsy report",
    "presentation": "{patientName}, a 43-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 43-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.43",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 43-year-old man with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.68",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 68-year-old woman with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.68",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 68-year-old man with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "AST PTLD and EBV guideline",
      "Comprehensive review of PTLD after solid organ transplantation"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028b.ptld.b-pathology-returned.1",
        "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4",
        "primaryConceptId": "concept.ptld.tissue-diagnosis-coordination",
        "stem": "Which care structure is most appropriate?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Transplant-hematology planning",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_4",
            "label": "Independent medication changes in clinic",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_4",
            "label": "Repeat biopsy before reading pathology",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_4",
            "label": "Routine annual surveillance only",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
        "sourceLabels": [
          "AST PTLD and EBV guideline",
          "Comprehensive review of PTLD after solid organ transplantation"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Independent medication changes in clinic.”",
            "clinicalRationale": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
            "sourceLabels": [
              "AST PTLD and EBV guideline",
              "Comprehensive review of PTLD after solid organ transplantation"
            ]
          },
          {
            "answerChoiceId": "d2_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Repeat biopsy before reading pathology.”",
            "clinicalRationale": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
            "sourceLabels": [
              "AST PTLD and EBV guideline",
              "Comprehensive review of PTLD after solid organ transplantation"
            ]
          },
          {
            "answerChoiceId": "d3_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Routine annual surveillance only.”",
            "clinicalRationale": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
            "sourceLabels": [
              "AST PTLD and EBV guideline",
              "Comprehensive review of PTLD after solid organ transplantation"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen."
  },
  {
    "id": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Neonatal course review",
    "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "patientDisplayName": "Ethan Brooks",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Neonatal course review",
    "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 3-week-old infant; all questions concern that recorded neonatal care.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Neonatal course review",
        "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 3-week-old infant; all questions concern that recorded neonatal care."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "primaryConceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "currentUpdate": "{patientName} was born preterm and is receiving neonatal medical treatment for NEC in an outside hospital.",
        "stem": "Which next plan is best supported by {patientName}'s current course?",
        "answerChoices": [
          {
            "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
            "label": "Continue nonoperative NEC treatment",
            "isCorrect": true,
            "rationale": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
            "serviceRequest": null
          },
          {
            "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
            "label": "Perform exploratory laparotomy",
            "isCorrect": false,
            "rationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
            "serviceRequest": null
          },
          {
            "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
            "label": "Insert a peritoneal drain",
            "isCorrect": false,
            "rationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed outside-record observations; fictional patient",
          "items": [
            {
              "label": "Serial radiology reports",
              "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
            },
            {
              "label": "Concurrent clinical trend",
              "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
            }
          ]
        },
        "sourceLabels": [
          "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
            "clinicalRationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
            ]
          },
          {
            "answerChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
            "clinicalRationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment."
  },
  {
    "id": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Obstruction record review",
    "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "patientDisplayName": "Isla Reed",
    "prototypeDemographics": {
      "ageYears": 6,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Obstruction record review",
    "presentation": "In clinic, {patientName}, a 6-year-old girl, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 2-day-old infant; all questions concern that recorded neonatal care.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 6,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Obstruction record review",
        "presentation": "In clinic, {patientName}, a 6-year-old girl, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 2-day-old infant; all questions concern that recorded neonatal care."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
        "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
        "primaryConceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
        "currentUpdate": "{patientName}'s outside neonatal team has treated bilious drainage and distension with gastric decompression and IV fluids. She has completed a first image-guided therapeutic water-soluble contrast enema.",
        "stem": "Which next decompression plan best fits {patientName}'s treatment response?",
        "answerChoices": [
          {
            "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
            "label": "Repeat image-guided therapeutic contrast decompression",
            "isCorrect": true,
            "rationale": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
            "serviceRequest": null
          },
          {
            "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
            "label": "Proceed to operative bowel decompression",
            "isCorrect": false,
            "rationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
            "serviceRequest": null
          },
          {
            "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
            "label": "Continue gastric drainage with observation",
            "isCorrect": false,
            "rationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed outside-record observations; fictional patient",
          "items": [
            {
              "label": "Therapeutic procedure record",
              "value": "Contrast traversed a small-caliber colon and entered the distal ileum around intraluminal pellets. During the procedure the contrast advanced farther proximally, pellet burden decreased and meconium passed; further ileal pellets remained."
            },
            {
              "label": "After the procedure",
              "value": "Distension decreased but persists with bilious gastric drainage. Perfusion and urine output are maintained. The abdomen is soft without erythema or guarding; imaging shows no free gas, volvulus or obstructing pseudocyst."
            }
          ]
        },
        "sourceLabels": [
          "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
            "clinicalRationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
            ]
          },
          {
            "answerChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
            "clinicalRationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
            "sourceLabels": [
              "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
            ]
          }
        ]
      }
    ],
    "learningSummary": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied."
  },
  {
    "id": "case.rectal-cancer.accountant-followup",
    "displayName": "Rectal cancer response assessment",
    "patientPresentationVariantId": "presentation.rectal-cancer.accountant-followup",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Rectal cancer response review",
    "patientPresentationRevision": {
      "id": "pprv3.case.rectal-cancer.accountant-followup",
      "patientPresentationVariantId": "presentation.rectal-cancer.accountant-followup",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Rectal cancer response review",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with negative systemic staging. An accountant, {patientName} prefers organ preservation after informed counseling and can attend an experienced multidisciplinary surveillance program.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.rectal-cancer.accountant-followup.female.61",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with negative systemic staging. An accountant, {patientName} prefers organ preservation after informed counseling and can attend an experienced multidisciplinary surveillance program."
      },
      {
        "id": "profile.rectal-cancer.accountant-followup.male.61",
        "prototypeDemographics": {
          "ageYears": 61,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with negative systemic staging. An accountant, {patientName} prefers organ preservation after informed counseling and can attend an experienced multidisciplinary surveillance program."
      },
      {
        "id": "profile.rectal-cancer.accountant-followup.female.64",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with negative systemic staging. An accountant, {patientName} prefers organ preservation after informed counseling and can attend an experienced multidisciplinary surveillance program."
      },
      {
        "id": "profile.rectal-cancer.accountant-followup.male.64",
        "prototypeDemographics": {
          "ageYears": 64,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with negative systemic staging. An accountant, {patientName} prefers organ preservation after informed counseling and can attend an experienced multidisciplinary surveillance program."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
      "Rectal Cancer Treatment (PDQ), Health Professional Version"
    ],
    "decisionNodes": [
      {
        "id": "node.rectal-cancer.accountant-followup.1",
        "questionVariantId": "question.rectal-cancer.multimodal-response-assessment.v4",
        "primaryConceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "stem": "Which local response assessment should be arranged now for {patientName}?",
        "answerChoices": [
          {
            "id": "multimodal_response_4",
            "label": "DRE, endoscopy, and rectal MRI",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.rectal_response_assessment"
            }
          },
          {
            "id": "mri_only_4",
            "label": "Rectal-protocol MRI",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "endoscopy_biopsy_4",
            "label": "Endoscopy with biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "pet_ct_4",
            "label": "Whole-body PET-CT response assessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": {
          "id": "gate.rectal-cancer.4",
          "resultTypeId": "service.rectal_response_assessment",
          "pendingLabel": "External multimodal rectal response assessment pending",
          "resultNarrative": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.rectal_response_assessment.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.rectal-cancer.accountant-followup.2",
        "questionVariantId": "question.rectal-cancer.selected-watch-and-wait.v4",
        "primaryConceptId": "concept.rectal-cancer.selected-watch-and-wait",
        "currentUpdate": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
        "stem": "Which nonsurgical option may be offered to {patientName} after informed multidisciplinary counseling?",
        "answerChoices": [
          {
            "id": "watch_wait_4",
            "label": "Watch-and-wait with intensive surveillance",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "routine_followup_4",
            "label": "Routine annual follow-up without intensive surveillance",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "discharge_cured_4",
            "label": "Discharge from cancer follow-up as cured",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "chemotherapy_indefinitely_4",
            "label": "Continue indefinite systemic chemotherapy without reassessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "routine_followup_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Routine annual follow-up without intensive surveillance.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "discharge_cured_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Discharge from cancer follow-up as cured.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "chemotherapy_indefinitely_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Continue indefinite systemic chemotherapy without reassessment.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI. A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid."
  },
  {
    "id": "case.rectal-cancer.caregiver-followup",
    "displayName": "Rectal cancer response assessment",
    "patientPresentationVariantId": "presentation.rectal-cancer.caregiver-followup",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Rectal cancer response review",
    "patientPresentationRevision": {
      "id": "pprv3.case.rectal-cancer.caregiver-followup",
      "patientPresentationVariantId": "presentation.rectal-cancer.caregiver-followup",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Rectal cancer response review",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with no distant disease on systemic imaging. A family caregiver, {patientName} prefers organ preservation after informed counseling, understands surgery remains an option, and can adhere to intensive surveillance in an experienced program.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.rectal-cancer.caregiver-followup.female.56",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with no distant disease on systemic imaging. A family caregiver, {patientName} prefers organ preservation after informed counseling, understands surgery remains an option, and can adhere to intensive surveillance in an experienced program."
      },
      {
        "id": "profile.rectal-cancer.caregiver-followup.male.56",
        "prototypeDemographics": {
          "ageYears": 56,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with no distant disease on systemic imaging. A family caregiver, {patientName} prefers organ preservation after informed counseling, understands surgery remains an option, and can adhere to intensive surveillance in an experienced program."
      },
      {
        "id": "profile.rectal-cancer.caregiver-followup.female.59",
        "prototypeDemographics": {
          "ageYears": 59,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with no distant disease on systemic imaging. A family caregiver, {patientName} prefers organ preservation after informed counseling, understands surgery remains an option, and can adhere to intensive surveillance in an experienced program."
      },
      {
        "id": "profile.rectal-cancer.caregiver-followup.male.59",
        "prototypeDemographics": {
          "ageYears": 59,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a mid-rectal adenocarcinoma with no distant disease on systemic imaging. A family caregiver, {patientName} prefers organ preservation after informed counseling, understands surgery remains an option, and can adhere to intensive surveillance in an experienced program."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
      "Rectal Cancer Treatment (PDQ), Health Professional Version"
    ],
    "decisionNodes": [
      {
        "id": "node.rectal-cancer.caregiver-followup.1",
        "questionVariantId": "question.rectal-cancer.multimodal-response-assessment.v2",
        "primaryConceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "stem": "Which local response assessment should be arranged now for {patientName}?",
        "answerChoices": [
          {
            "id": "multimodal_response_2",
            "label": "DRE, endoscopy, and rectal MRI",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.rectal_response_assessment"
            }
          },
          {
            "id": "mri_only_2",
            "label": "Rectal-protocol MRI",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "endoscopy_biopsy_2",
            "label": "Endoscopy with biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "pet_ct_2",
            "label": "Whole-body PET-CT response assessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": {
          "id": "gate.rectal-cancer.2",
          "resultTypeId": "service.rectal_response_assessment",
          "pendingLabel": "External multimodal rectal response assessment pending",
          "resultNarrative": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.rectal_response_assessment.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.rectal-cancer.caregiver-followup.2",
        "questionVariantId": "question.rectal-cancer.selected-watch-and-wait.v2",
        "primaryConceptId": "concept.rectal-cancer.selected-watch-and-wait",
        "currentUpdate": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
        "stem": "Which nonsurgical option may be offered to {patientName} after informed multidisciplinary counseling?",
        "answerChoices": [
          {
            "id": "watch_wait_2",
            "label": "Watch-and-wait with intensive surveillance",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "routine_followup_2",
            "label": "Routine annual follow-up without intensive surveillance",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "discharge_cured_2",
            "label": "Discharge from cancer follow-up as cured",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "chemotherapy_indefinitely_2",
            "label": "Continue indefinite systemic chemotherapy without reassessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "routine_followup_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Routine annual follow-up without intensive surveillance.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "discharge_cured_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Discharge from cancer follow-up as cured.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "chemotherapy_indefinitely_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Continue indefinite systemic chemotherapy without reassessment.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI. A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid."
  },
  {
    "id": "case.rectal-cancer.cyclist-followup",
    "displayName": "Rectal cancer response assessment",
    "patientPresentationVariantId": "presentation.rectal-cancer.cyclist-followup",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 44,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Rectal cancer response review",
    "patientPresentationRevision": {
      "id": "pprv3.case.rectal-cancer.cyclist-followup",
      "patientPresentationVariantId": "presentation.rectal-cancer.cyclist-followup",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Rectal cancer response review",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. An avid cyclist, {patientName} prefers organ preservation after informed counseling, has reliable follow-up access, and can enroll in an experienced multidisciplinary program.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.rectal-cancer.cyclist-followup.female.44",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. An avid cyclist, {patientName} prefers organ preservation after informed counseling, has reliable follow-up access, and can enroll in an experienced multidisciplinary program."
      },
      {
        "id": "profile.rectal-cancer.cyclist-followup.male.44",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. An avid cyclist, {patientName} prefers organ preservation after informed counseling, has reliable follow-up access, and can enroll in an experienced multidisciplinary program."
      },
      {
        "id": "profile.rectal-cancer.cyclist-followup.female.47",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. An avid cyclist, {patientName} prefers organ preservation after informed counseling, has reliable follow-up access, and can enroll in an experienced multidisciplinary program."
      },
      {
        "id": "profile.rectal-cancer.cyclist-followup.male.47",
        "prototypeDemographics": {
          "ageYears": 47,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. An avid cyclist, {patientName} prefers organ preservation after informed counseling, has reliable follow-up access, and can enroll in an experienced multidisciplinary program."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
      "Rectal Cancer Treatment (PDQ), Health Professional Version"
    ],
    "decisionNodes": [
      {
        "id": "node.rectal-cancer.cyclist-followup.1",
        "questionVariantId": "question.rectal-cancer.multimodal-response-assessment.v3",
        "primaryConceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "stem": "Which local response assessment should be arranged now for {patientName}?",
        "answerChoices": [
          {
            "id": "multimodal_response_3",
            "label": "DRE, endoscopy, and rectal MRI",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.rectal_response_assessment"
            }
          },
          {
            "id": "mri_only_3",
            "label": "Rectal-protocol MRI",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "endoscopy_biopsy_3",
            "label": "Endoscopy with biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "pet_ct_3",
            "label": "Whole-body PET-CT response assessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": {
          "id": "gate.rectal-cancer.3",
          "resultTypeId": "service.rectal_response_assessment",
          "pendingLabel": "External multimodal rectal response assessment pending",
          "resultNarrative": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.rectal_response_assessment.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.rectal-cancer.cyclist-followup.2",
        "questionVariantId": "question.rectal-cancer.selected-watch-and-wait.v3",
        "primaryConceptId": "concept.rectal-cancer.selected-watch-and-wait",
        "currentUpdate": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
        "stem": "Which nonsurgical option may be offered to {patientName} after informed multidisciplinary counseling?",
        "answerChoices": [
          {
            "id": "watch_wait_3",
            "label": "Watch-and-wait with intensive surveillance",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "routine_followup_3",
            "label": "Routine annual follow-up without intensive surveillance",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "discharge_cured_3",
            "label": "Discharge from cancer follow-up as cured",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "chemotherapy_indefinitely_3",
            "label": "Continue indefinite systemic chemotherapy without reassessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "routine_followup_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Routine annual follow-up without intensive surveillance.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "discharge_cured_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Discharge from cancer follow-up as cured.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "chemotherapy_indefinitely_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Continue indefinite systemic chemotherapy without reassessment.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI. A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid."
  },
  {
    "id": "case.rectal-cancer.teacher-followup",
    "displayName": "Rectal cancer response assessment",
    "patientPresentationVariantId": "presentation.rectal-cancer.teacher-followup",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Rectal cancer response review",
    "patientPresentationRevision": {
      "id": "pprv3.case.rectal-cancer.teacher-followup",
      "patientPresentationVariantId": "presentation.rectal-cancer.teacher-followup",
      "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
      "revisedChiefComplaint": "Rectal cancer response review",
      "revisedFields": [
        "chiefComplaint"
      ],
      "aiAssistedDrafting": true,
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. A teacher, {patientName} prefers organ preservation after informed counseling, can attend frequent follow-up, and has access to an experienced multidisciplinary program.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.rectal-cancer.teacher-followup.female.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. A teacher, {patientName} prefers organ preservation after informed counseling, can attend frequent follow-up, and has access to an experienced multidisciplinary program."
      },
      {
        "id": "profile.rectal-cancer.teacher-followup.male.49",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. A teacher, {patientName} prefers organ preservation after informed counseling, can attend frequent follow-up, and has access to an experienced multidisciplinary program."
      },
      {
        "id": "profile.rectal-cancer.teacher-followup.female.52",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. A teacher, {patientName} prefers organ preservation after informed counseling, can attend frequent follow-up, and has access to an experienced multidisciplinary program."
      },
      {
        "id": "profile.rectal-cancer.teacher-followup.male.52",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName} completed neoadjuvant treatment for a low rectal adenocarcinoma and has no metastases on systemic imaging. A teacher, {patientName} prefers organ preservation after informed counseling, can attend frequent follow-up, and has access to an experienced multidisciplinary program."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 1,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
      "Rectal Cancer Treatment (PDQ), Health Professional Version"
    ],
    "decisionNodes": [
      {
        "id": "node.rectal-cancer.teacher-followup.1",
        "questionVariantId": "question.rectal-cancer.multimodal-response-assessment.v1",
        "primaryConceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "stem": "Which local response assessment should be arranged now for {patientName}?",
        "answerChoices": [
          {
            "id": "multimodal_response_1",
            "label": "DRE, endoscopy, and rectal MRI",
            "isCorrect": true,
            "serviceRequest": {
              "serviceId": "service.rectal_response_assessment"
            }
          },
          {
            "id": "mri_only_1",
            "label": "Rectal-protocol MRI",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "endoscopy_biopsy_1",
            "label": "Endoscopy with biopsy",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "pet_ct_1",
            "label": "Whole-body PET-CT response assessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": {
          "id": "gate.rectal-cancer.1",
          "resultTypeId": "service.rectal_response_assessment",
          "pendingLabel": "External multimodal rectal response assessment pending",
          "resultNarrative": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
          "readiness": "all",
          "allowedServiceRouteIds": [
            "route.rectal_response_assessment.outsourced"
          ]
        },
        "terminalDispositions": []
      },
      {
        "id": "node.rectal-cancer.teacher-followup.2",
        "questionVariantId": "question.rectal-cancer.selected-watch-and-wait.v1",
        "primaryConceptId": "concept.rectal-cancer.selected-watch-and-wait",
        "currentUpdate": "Digital rectal examination finds no palpable tumor; endoscopy shows a flat pale scar without ulcer or nodule; rectal-protocol MRI shows no residual tumor signal or suspicious nodes.",
        "stem": "Which nonsurgical option may be offered to {patientName} after informed multidisciplinary counseling?",
        "answerChoices": [
          {
            "id": "watch_wait_1",
            "label": "Watch-and-wait with intensive surveillance",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "routine_followup_1",
            "label": "Routine annual follow-up without intensive surveillance",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "discharge_cured_1",
            "label": "Discharge from cancer follow-up as cured",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "chemotherapy_indefinitely_1",
            "label": "Continue indefinite systemic chemotherapy without reassessment",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
        "sourceLabels": [
          "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
          "Rectal Cancer Treatment (PDQ), Health Professional Version"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "routine_followup_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Routine annual follow-up without intensive surveillance.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "discharge_cured_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Discharge from cancer follow-up as cured.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          },
          {
            "answerChoiceId": "chemotherapy_indefinitely_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The teaching encounter recorded “Continue indefinite systemic chemotherapy without reassessment.”",
            "clinicalRationale": "A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid.",
            "sourceLabels": [
              "ASCRS Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement",
              "Rectal Cancer Treatment (PDQ), Health Professional Version"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Assessment after neoadjuvant rectal cancer treatment combines digital rectal examination, endoscopy, and rectal-protocol MRI. A fully informed patient with a clinical complete response who prefers nonsurgical care and can adhere to intensive follow-up may choose watch-and-wait in an experienced multidisciplinary program; surgery remains valid."
  },
  {
    "id": "case.gs028d.anesthesia.b-documented-susceptibility",
    "displayName": "Preanesthetic planning",
    "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-documented-susceptibility",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 29,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Malignant hyperthermia record",
    "presentation": "{patientName}, a 29-year-old woman, has specialist documentation of malignant-hyperthermia susceptibility and is considering elective gallbladder surgery.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.anesthesia.b-documented-susceptibility.female.29",
        "prototypeDemographics": {
          "ageYears": 29,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 29-year-old woman, has specialist documentation of malignant-hyperthermia susceptibility and is considering elective gallbladder surgery."
      },
      {
        "id": "profile.gs028d.anesthesia.b-documented-susceptibility.male.29",
        "prototypeDemographics": {
          "ageYears": 29,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 29-year-old man, has specialist documentation of malignant-hyperthermia susceptibility and is considering elective gallbladder surgery."
      },
      {
        "id": "profile.gs028d.anesthesia.b-documented-susceptibility.female.52",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 52-year-old woman, has specialist documentation of malignant-hyperthermia susceptibility and is considering elective gallbladder surgery."
      },
      {
        "id": "profile.gs028d.anesthesia.b-documented-susceptibility.male.52",
        "prototypeDemographics": {
          "ageYears": 52,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 52-year-old man, has specialist documentation of malignant-hyperthermia susceptibility and is considering elective gallbladder surgery."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
      "JSA guideline for management of malignant hyperthermia in 2025",
      "Perioperative Management of MH Suspected or Susceptible Patients"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.anesthesia.b-documented-susceptibility.1",
        "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v1",
        "primaryConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
        "stem": "What is the appropriate preoperative plan?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Plan trigger-free anesthesia",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_1",
            "label": "Use routine anesthetic without disclosure",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_1",
            "label": "Administer a test anesthetic in clinic",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_1",
            "label": "Cancel all future surgery permanently",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Coordinate a trigger-free anaesthetic in an appropriately prepared hospital setting.",
        "sourceLabels": [
          "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Perioperative Management of MH Suspected or Susceptible Patients"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Use routine anesthetic without disclosure.”",
            "clinicalRationale": "Coordinate a trigger-free anaesthetic in an appropriately prepared hospital setting.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d2_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Administer a test anesthetic in clinic.”",
            "clinicalRationale": "Coordinate a trigger-free anaesthetic in an appropriately prepared hospital setting.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d3_1",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Cancel all future surgery permanently.”",
            "clinicalRationale": "Coordinate a trigger-free anaesthetic in an appropriately prepared hospital setting.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Coordinate a trigger-free anaesthetic in an appropriately prepared hospital setting."
  },
  {
    "id": "case.gs028d.anesthesia.b-family-testing-record",
    "displayName": "Preanesthetic planning",
    "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-family-testing-record",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Family MH history",
    "presentation": "{patientName}, a 35-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
        "prototypeDemographics": {
          "ageYears": 35,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 35-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
        "prototypeDemographics": {
          "ageYears": 35,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 35-year-old man, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 60-year-old woman, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 60-year-old man, has a credible family malignant-hyperthermia history and a genetics service record identifying susceptibility before planned colectomy."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
      "JSA guideline for management of malignant hyperthermia in 2025",
      "Perioperative Management of MH Suspected or Susceptible Patients"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.anesthesia.b-family-testing-record.1",
        "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2",
        "primaryConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
        "stem": "Which action best incorporates this information into surgical planning?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Request trigger-free planning",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_2",
            "label": "Ignore family-linked documentation",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_2",
            "label": "Select a trigger-containing anesthetic",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_2",
            "label": "Give crisis medication in clinic now",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
        "sourceLabels": [
          "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Perioperative Management of MH Suspected or Susceptible Patients"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Ignore family-linked documentation.”",
            "clinicalRationale": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d2_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Select a trigger-containing anesthetic.”",
            "clinicalRationale": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d3_2",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Give crisis medication in clinic now.”",
            "clinicalRationale": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          }
        ]
      }
    ],
    "learningSummary": "The clinic's role is to communicate and arrange an appropriate anesthetic setting, not administer anesthesia."
  },
  {
    "id": "case.gs028d.anesthesia.b-mh-alert-bracelet",
    "displayName": "Preanesthetic planning",
    "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-mh-alert-bracelet",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 32,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Anesthesia alert review",
    "presentation": "{patientName}, a 32-year-old woman, wears an MH alert bracelet and provides the confirming specialist record while discussing elective surgery.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.anesthesia.b-mh-alert-bracelet.female.32",
        "prototypeDemographics": {
          "ageYears": 32,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 32-year-old woman, wears an MH alert bracelet and provides the confirming specialist record while discussing elective surgery."
      },
      {
        "id": "profile.gs028d.anesthesia.b-mh-alert-bracelet.male.32",
        "prototypeDemographics": {
          "ageYears": 32,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 32-year-old man, wears an MH alert bracelet and provides the confirming specialist record while discussing elective surgery."
      },
      {
        "id": "profile.gs028d.anesthesia.b-mh-alert-bracelet.female.57",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 57-year-old woman, wears an MH alert bracelet and provides the confirming specialist record while discussing elective surgery."
      },
      {
        "id": "profile.gs028d.anesthesia.b-mh-alert-bracelet.male.57",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 57-year-old man, wears an MH alert bracelet and provides the confirming specialist record while discussing elective surgery."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
      "JSA guideline for management of malignant hyperthermia in 2025",
      "Perioperative Management of MH Suspected or Susceptible Patients"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.anesthesia.b-mh-alert-bracelet.1",
        "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v4",
        "primaryConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
        "stem": "Which referral message is most important?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "MH requires trigger-free planning",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_4",
            "label": "Bracelet alone determines drug dose",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_4",
            "label": "Routine anesthesia needs no change",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_4",
            "label": "Clinic can manage an MH crisis",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Transmit the verified susceptibility and request trigger-free, prepared-facility planning.",
        "sourceLabels": [
          "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Perioperative Management of MH Suspected or Susceptible Patients"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Bracelet alone determines drug dose.”",
            "clinicalRationale": "Transmit the verified susceptibility and request trigger-free, prepared-facility planning.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d2_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Routine anesthesia needs no change.”",
            "clinicalRationale": "Transmit the verified susceptibility and request trigger-free, prepared-facility planning.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d3_4",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “Clinic can manage an MH crisis.”",
            "clinicalRationale": "Transmit the verified susceptibility and request trigger-free, prepared-facility planning.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Transmit the verified susceptibility and request trigger-free, prepared-facility planning."
  },
  {
    "id": "case.gs028d.anesthesia.b-prior-mh-event",
    "displayName": "Preanesthetic planning",
    "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-prior-mh-event",
    "releasePointId": "release.l0.clinic_evaluation",
    "patientDisplayName": "{patientName}",
    "prototypeDemographics": {
      "ageYears": 41,
      "sexLabel": "Female"
    },
    "prototypeVitalSigns": {
      "heartRateBpm": 76,
      "systolicBloodPressureMmHg": 118,
      "diastolicBloodPressureMmHg": 74,
      "temperatureF": 98.4,
      "oxygenSaturationPercent": 99
    },
    "chiefComplaint": "Prior anesthesia reaction",
    "presentation": "{patientName}, a 41-year-old woman, has a prior specialist-reviewed anesthetic record confirming malignant-hyperthermia susceptibility and now needs another operation.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.anesthesia.b-prior-mh-event.female.41",
        "prototypeDemographics": {
          "ageYears": 41,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 41-year-old woman, has a prior specialist-reviewed anesthetic record confirming malignant-hyperthermia susceptibility and now needs another operation."
      },
      {
        "id": "profile.gs028d.anesthesia.b-prior-mh-event.male.41",
        "prototypeDemographics": {
          "ageYears": 41,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 41-year-old man, has a prior specialist-reviewed anesthetic record confirming malignant-hyperthermia susceptibility and now needs another operation."
      },
      {
        "id": "profile.gs028d.anesthesia.b-prior-mh-event.female.66",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 66-year-old woman, has a prior specialist-reviewed anesthetic record confirming malignant-hyperthermia susceptibility and now needs another operation."
      },
      {
        "id": "profile.gs028d.anesthesia.b-prior-mh-event.male.66",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 66-year-old man, has a prior specialist-reviewed anesthetic record confirming malignant-hyperthermia susceptibility and now needs another operation."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 0,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
      "JSA guideline for management of malignant hyperthermia in 2025",
      "Perioperative Management of MH Suspected or Susceptible Patients"
    ],
    "decisionNodes": [
      {
        "id": "node.gs028d.anesthesia.b-prior-mh-event.1",
        "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v3",
        "primaryConceptId": "concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan",
        "stem": "What should be established before scheduling the new procedure?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "A trigger-free plan",
            "isCorrect": true,
            "serviceRequest": null
          },
          {
            "id": "d1_3",
            "label": "A routine outpatient anesthetic plan",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d2_3",
            "label": "A clinic challenge with anesthetic gas",
            "isCorrect": false,
            "serviceRequest": null
          },
          {
            "id": "d3_3",
            "label": "No anesthesiology review",
            "isCorrect": false,
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Known susceptibility should be visible to the anesthesiology and facility teams before the procedure.",
        "sourceLabels": [
          "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Perioperative Management of MH Suspected or Susceptible Patients"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "d1_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “A routine outpatient anesthetic plan.”",
            "clinicalRationale": "Known susceptibility should be visible to the anesthesiology and facility teams before the procedure.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d2_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “A clinic challenge with anesthetic gas.”",
            "clinicalRationale": "Known susceptibility should be visible to the anesthesiology and facility teams before the procedure.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          },
          {
            "answerChoiceId": "d3_3",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "The encounter recorded “No anesthesiology review.”",
            "clinicalRationale": "Known susceptibility should be visible to the anesthesiology and facility teams before the procedure.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Known susceptibility should be visible to the anesthesiology and facility teams before the procedure."
  }
];
export const PROGRAM_BATCH8_RETIREMENTS:QuestionShipCaseRetirement[] = [
  {
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
    "questionVariantIds": [
      "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1"
    ],
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md",
    "reason": "Owner-directed retirement 2026-11-12: neonatal clinical framing is outside the accepted patient/art setting."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
    "questionVariantIds": [
      "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2"
    ],
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md",
    "reason": "Owner-directed retirement 2026-11-12: neonatal clinical framing is outside the accepted patient/art setting."
  },
  {
    "caseId": "case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2",
    "questionVariantIds": [
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2"
    ],
    "decision": "docs/research/question-topic-acceptance-batch8-20261112.md",
    "reason": "Owner-directed anion-gap successor replaces this additional live correction-dependent predecessor.",
    "replacementQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4"
  }
];
export const PROGRAM_BATCH8_RETARGETED_CONSOLIDATIONS = [
  {
    "before": {
      "id": "topic-program.batch4.case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
      "program": "topic-program",
      "replaces": [
        "case.rectal-cancer.accountant-followup",
        "case.rectal-cancer.caregiver-followup",
        "case.rectal-cancer.cyclist-followup",
        "case.rectal-cancer.teacher-followup"
      ],
      "with": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
      "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
    },
    "after": {
      "id": "topic-program.batch4.case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
      "program": "topic-program",
      "replaces": [
        "case.rectal-cancer.accountant-followup",
        "case.rectal-cancer.caregiver-followup",
        "case.rectal-cancer.cyclist-followup",
        "case.rectal-cancer.teacher-followup"
      ],
      "with": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
      "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
    }
  },
  {
    "before": {
      "id": "topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
      "program": "topic-program",
      "replaces": [
        "case.gs028d.anesthesia.b-documented-susceptibility",
        "case.gs028d.anesthesia.b-family-testing-record",
        "case.gs028d.anesthesia.b-mh-alert-bracelet",
        "case.gs028d.anesthesia.b-prior-mh-event"
      ],
      "with": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
      "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
    },
    "after": {
      "id": "topic-program.batch4.case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
      "program": "topic-program",
      "replaces": [
        "case.gs028d.anesthesia.b-documented-susceptibility",
        "case.gs028d.anesthesia.b-family-testing-record",
        "case.gs028d.anesthesia.b-mh-alert-bracelet",
        "case.gs028d.anesthesia.b-prior-mh-event"
      ],
      "with": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
      "decision": "docs/research/question-topic-acceptance-batch4-20261111.md"
    }
  }
];
export const PROGRAM_BATCH8_DIRECTIONS = [
  {
    "ownerId": "B2B32",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "questionSha256": "cd05578e18095567690dc25f4534fe78dae0a60d71b378a57fe6e42107e54e16",
    "nodeSha256": "4b001674dbb2236ddda1a87e6a1ef104f64a79967914f1047ec83318c84926c0",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "displayName": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
      "learningObjective": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
      "conceptType": "applied_science",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": true,
      "versioningReason": "Preserve the harder draft stable concept ID and issue a new concept content version for the owner-directed plain-gap calculation and qualitative albumin interpretation. The prior correction-dependent laboratory-ranking objective is narrowed."
    },
    "previousQuestionVariantIds": [
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r3",
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r2",
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v1"
    ]
  },
  {
    "ownerId": "B2B34",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "questionSha256": "ca1e3eaa04f45943356cf19b45108b62dfd7688943c57f24bd83847765fdd3f2",
    "nodeSha256": "854bced35ef0cf7a15fe7ff7f8a3a8644e1cf0bf71715b6d640fd0a40411e840",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "displayName": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
      "learningObjective": "Calculate the uncorrected gap and interpret its limits when albumin is low.",
      "conceptType": "applied_science",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": true,
      "versioningReason": "Preserve the harder draft stable concept ID and issue a new concept content version for the owner-directed plain-gap calculation and qualitative albumin interpretation. The prior correction-dependent laboratory-ranking objective is narrowed."
    },
    "previousQuestionVariantIds": [
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r3",
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2",
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v3",
      "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2.topic20261111.v2"
    ]
  },
  {
    "ownerId": "G02",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "conceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "questionSha256": "81c420bf121c05a989d89071b2a3456fa52181470318202a8a15525f2f66f79a",
    "nodeSha256": "5a492da27188fbca0ce91538bcef3e8fa4d475b5261c3fb841ea814f028af0a3",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "displayName": "Plan anesthesia under unresolved familial MH susceptibility.",
      "learningObjective": "Plan anesthesia under unresolved familial MH susceptibility.",
      "conceptType": "management",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": false,
      "versioningReason": "Same scored clinical meaning with a new exact wording version."
    },
    "previousQuestionVariantIds": [
      "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1"
    ]
  },
  {
    "ownerId": "G02-NEW",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "conceptId": "concept.mh.dantrolene-readiness.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "questionSha256": "24badd604c8d54334c1313d54998d54112bb86217ac55465f2df1d8f7fad2e99",
    "nodeSha256": "d8d96a7bbc7b72c440ba8c702f15aa26a0c88c7237a6fa05bfa5a54ab823fd37",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.mh.dantrolene-readiness.v1",
      "displayName": "Identify the medication required for MH crisis readiness.",
      "learningObjective": "Identify the medication required for MH crisis readiness.",
      "conceptType": "applied_science",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": true,
      "versioningReason": "New separately scored medication-readiness concept requested by Melissa Rowland."
    },
    "previousQuestionVariantIds": []
  },
  {
    "ownerId": "TOPIC-060",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "conceptId": "concept.rectal-cancer.selected-watch-and-wait",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "questionSha256": "057159062f2eb3cd5752fcbb72546822370b390e56e5b0e5603621aa90f26762",
    "nodeSha256": "03118fb1805daf747961587e6f103903f679267784e7035011fe72866c6c29b5",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.rectal-cancer.selected-watch-and-wait",
      "displayName": "Select resection for progressive residual low rectal disease.",
      "learningObjective": "Select resection for progressive residual low rectal disease.",
      "conceptType": "management",
      "earliestFacilityStage": 1,
      "educationalTier": 1,
      "meaningChange": false,
      "versioningReason": "Same scored clinical meaning with a new exact wording version."
    },
    "previousQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1"
    ]
  },
  {
    "ownerId": "TOPIC-034",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "conceptId": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "questionSha256": "ad76b808566c62ef38608ece183dbad81c6e10cdb146edf7f367f31cc50faa3e",
    "nodeSha256": "f359c0015fd48b4ead2ad2520c1b4ba4453c4098dbfc289001b4f4af8f5a5d25",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1",
      "displayName": "Complete postoperative mucosal assessment after ileocolic Crohn resection.",
      "learningObjective": "Complete postoperative mucosal assessment after ileocolic Crohn resection.",
      "conceptType": "workup",
      "earliestFacilityStage": 2,
      "educationalTier": 1,
      "meaningChange": false,
      "versioningReason": "Same scored clinical meaning with a new exact wording version."
    },
    "previousQuestionVariantIds": [
      "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2"
    ]
  },
  {
    "ownerId": "TOPIC-069",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "conceptId": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "questionSha256": "3008fc42c5e986ecdabeb22e5f277f25282b3422dc4e9dd84cf0d0537fededd1",
    "nodeSha256": "fb21cc7b0cf972ca5b35bbacea9cf0e5f5e435c1f33b9b3222c4cc15f73b4d29",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
      "displayName": "Plan reflux control during symptomatic paraesophageal hernia repair.",
      "learningObjective": "Plan reflux control during symptomatic paraesophageal hernia repair.",
      "conceptType": "management",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": false,
      "versioningReason": "Same scored clinical meaning with a new exact wording version."
    },
    "previousQuestionVariantIds": [
      "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1"
    ]
  },
  {
    "ownerId": "G04-R",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "conceptId": "concept.early-pregnancy.location-before-disposition.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "questionSha256": "1f737397845c0bc58913df0f3f332b977f77048469bf5bffb47b46871bafb64b",
    "nodeSha256": "f61a6f7013ec786595b7db03caf9d803d745fd5b37aa72af2fdf3b107f6c2306",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.early-pregnancy.location-before-disposition.v1",
      "displayName": "Localize a symptomatic early pregnancy despite falling hCG.",
      "learningObjective": "Localize a symptomatic early pregnancy despite falling hCG.",
      "conceptType": "workup",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": true,
      "versioningReason": "Retain the existing harder location-before-disposition concept ID. The distinct easy pregnancy-screening concept and frozen history remain archived."
    },
    "previousQuestionVariantIds": [
      "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
      "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1"
    ]
  },
  {
    "ownerId": "F13",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "conceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "questionSha256": "ef1192c2b4e2487391ac1c76abda31a6933fceb8081f3938d95de03a5b81a443",
    "nodeSha256": "7d1ecc10f2261cace730259eb0549b97a6e620c346a1b0a722cb55578693fe7a",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.preoperative-osa.awake-ventilation-assessment.v1",
      "displayName": "Assess awake ventilation when obesity and sleep-disordered breathing raise concern.",
      "learningObjective": "Assess awake ventilation when obesity and sleep-disordered breathing raise concern.",
      "conceptType": "workup",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "meaningChange": false,
      "versioningReason": "Retain the existing harder awake-ventilation concept. The distinct easy validated-screening item may remain in fresh play."
    },
    "previousQuestionVariantIds": [
      "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
      "question.preoperative-osa.validated-risk-screening.v4.r5",
      "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v2"
    ]
  },
  {
    "ownerId": "G07",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "conceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
    "contentVersion": "clinical.owner-decisions.2026-11-12.v2",
    "questionSha256": "31c25ad22a7d4029e479d0c142a7a49af5aa8ea56a60adf5b155b09a116bfd0b",
    "nodeSha256": "5dbbebfa48f98988cd0dee5ccea495fce73446682148faea0462be42417a3434",
    "directedBy": "Melissa Rowland (clinical sign-off)",
    "directedOn": "2026-11-12",
    "authority": {
      "path": "docs/research/owner-decision-answers-20261112.md",
      "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
    },
    "scope": "Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.",
    "reviewStatus": "needs_clinician_review",
    "clinicalApprovalGranted": false,
    "lastClinicianReview": null,
    "conceptVersion": {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "displayName": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
      "learningObjective": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
      "conceptType": "workup",
      "earliestFacilityStage": 1,
      "educationalTier": 1,
      "meaningChange": true,
      "versioningReason": "Retain the harder draft node-specimen-and-ancillary-handling concept ID. The legacy coordination-only question has a distinct historical concept."
    },
    "previousQuestionVariantIds": [
      "question.ptld.tissue-diagnosis-coordination.v4.r3",
      "question.ptld.tissue-diagnosis-coordination.v4.r2",
      "question.ptld.tissue-diagnosis-coordination.v4"
    ]
  }
];
export const PROGRAM_BATCH8_FROZEN = [
  {
    "ownerId": "B2B32",
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4\",\"conceptId\":\"concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1\",\"stem\":\"Using the potassium-excluding convention, which anion-gap value and effect of hypoalbuminemia on the baseline gap best fit {patientName}'s admission panel?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.lower-decrease.r4\",\"label\":\"12 mmol/L with an albumin-related decrease\",\"isCorrect\":true,\"rationale\":\"The potassium-excluding calculation gives 12. Low albumin decreases the baseline gap and can mask an additional unmeasured-acid component.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4\",\"label\":\"28 mmol/L with an albumin-related decrease\",\"isCorrect\":false,\"rationale\":\"The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.\",\"distractorRationale\":\"The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.\"},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4\",\"label\":\"12 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.\",\"distractorRationale\":\"The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.\"},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4\",\"label\":\"28 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.\",\"distractorRationale\":\"The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.\"}],\"explanation\":\"The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed admission specimen. Laboratory uncorrected-gap interval 8-16 mmol/L.\",\"columnHeaders\":[\"Value\"],\"rowHeaders\":[\"Sodium (mmol/L)\",\"Chloride (mmol/L)\",\"Bicarbonate (mmol/L)\",\"Albumin\"],\"cells\":[[\"140\"],[\"112\"],[\"16\"],[\"Below the laboratory reference interval\"]]},\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.plain-gap\",\"claim.owner-decisions.20261112.albumin-lowers-gap\"]}",
    "sourceNodeJson": "{\"id\":\"node.gs028d.acid-base.b-cirrhosis-gap.1\",\"questionVariantId\":\"question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4\",\"primaryConceptId\":\"concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1\",\"stem\":\"Using the potassium-excluding convention, which anion-gap value and effect of hypoalbuminemia on the baseline gap best fit {patientName}'s admission panel?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.lower-decrease.r4\",\"label\":\"12 mmol/L with an albumin-related decrease\",\"isCorrect\":true,\"rationale\":\"The potassium-excluding calculation gives 12. Low albumin decreases the baseline gap and can mask an additional unmeasured-acid component.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4\",\"label\":\"28 mmol/L with an albumin-related decrease\",\"isCorrect\":false,\"rationale\":\"The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4\",\"label\":\"12 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4\",\"label\":\"28 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.\",\"teachingPoint\":\"The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed admission specimen. Laboratory uncorrected-gap interval 8-16 mmol/L.\",\"columnHeaders\":[\"Value\"],\"rowHeaders\":[\"Sodium (mmol/L)\",\"Chloride (mmol/L)\",\"Bicarbonate (mmol/L)\",\"Albumin\"],\"cells\":[[\"140\"],[\"112\"],[\"16\"],[\"Below the laboratory reference interval\"]]},\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.gs028d.acid-base.b-cirrhosis-gap\",\"displayName\":\"Owner review for Jamie Taylor\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.plain-gap-single.v2\",\"patientDisplayName\":\"Jamie Taylor\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Acidosis panel review\",\"presentation\":\"{patientName}, a 49-year-old woman with cirrhosis, attends clinic to review an outside admission for loose stools while taking lactulose. Metabolic acidosis was documented during that admission.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.plain-gap-single.v2\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Acidosis panel review\",\"presentation\":\"{patientName}, a 49-year-old woman with cirrhosis, attends clinic to review an outside admission for loose stools while taking lactulose. Metabolic acidosis was documented during that admission.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"],\"decisionNodes\":[{\"id\":\"node.gs028d.acid-base.b-cirrhosis-gap.1\",\"questionVariantId\":\"question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4\",\"primaryConceptId\":\"concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1\",\"stem\":\"Using the potassium-excluding convention, which anion-gap value and effect of hypoalbuminemia on the baseline gap best fit {patientName}'s admission panel?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.lower-decrease.r4\",\"label\":\"12 mmol/L with an albumin-related decrease\",\"isCorrect\":true,\"rationale\":\"The potassium-excluding calculation gives 12. Low albumin decreases the baseline gap and can mask an additional unmeasured-acid component.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4\",\"label\":\"28 mmol/L with an albumin-related decrease\",\"isCorrect\":false,\"rationale\":\"The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4\",\"label\":\"12 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4\",\"label\":\"28 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.\",\"teachingPoint\":\"The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed admission specimen. Laboratory uncorrected-gap interval 8-16 mmol/L.\",\"columnHeaders\":[\"Value\"],\"rowHeaders\":[\"Sodium (mmol/L)\",\"Chloride (mmol/L)\",\"Bicarbonate (mmol/L)\",\"Albumin\"],\"cells\":[[\"140\"],[\"112\"],[\"16\"],[\"Below the laboratory reference interval\"]]},\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-single.higher-decrease.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The albumin direction is correct. The value 28 subtracts chloride from sodium but omits bicarbonate.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-single.lower-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The value 12 is correct. Low albumin decreases the baseline gap, so the stated direction is reversed.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-single.higher-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The value omits bicarbonate and the stated albumin effect is reversed. The gap is 12, and low albumin lowers its baseline.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]}]}],\"learningSummary\":\"The potassium-excluding gap is 140 - (112 + 16) = 12 mmol/L, within the supplied laboratory interval. Hypoalbuminemia decreases the baseline gap. An additional unmeasured-acid component can therefore be masked by a raw value in that interval. This calculation does not establish the cause of the acidosis.\"}",
    "questionSha256": "cd05578e18095567690dc25f4534fe78dae0a60d71b378a57fe6e42107e54e16",
    "nodeSha256": "4b001674dbb2236ddda1a87e6a1ef104f64a79967914f1047ec83318c84926c0",
    "caseSha256": "b31ce7ba35daa3d818cec00703a917a4342b6cfa64c54126a45b694641b2a5b1",
    "review": {
      "path": "docs/research/question-owner-decisions-review2-20261112.json",
      "record": {
        "id": "B2B32",
        "variantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4",
        "verdict": "PASS",
        "difficulty": {
          "level": "Easy foundational application",
          "highYield": true,
          "rationale": "Requires the ordinary anion-gap calculation and the direction of albumin's contribution. Removing the earlier cues improves validity, but one calculation and a binary physiology judgment do not make this a hard question."
        },
        "clarityIssues": [],
        "cues": [
          {
            "severity": "Low residual",
            "exactPhrases": [
              "Below the laboratory reference interval",
              "12 mmol/L with an albumin-related decrease",
              "28 mmol/L with an albumin-related decrease",
              "12 mmol/L with an albumin-related increase",
              "28 mmol/L with an albumin-related increase"
            ],
            "attack": "A nonmedical reader might match low albumin to 'decrease', but that leaves two choices. Both values and both directions occur equally often, with identical grammar and certainty. The former cautious-key and lone-number shortcuts are gone. The normal interval alone does not prove that this patient's gap must be normal."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful to Melissa Rowland's B2B32/B2B34 direction: tests plain Na-(Cl+HCO3) arithmetic and qualitative hypoalbuminemia only. No albumin-correction formula, corrected value or correction arithmetic appears in the reviewed content.",
          "ownerStyle": "Pass: Jamie Taylor is a named 49-year-old woman attending clinic; 'Acidosis panel review' has three words; the task independently identifies the patient, potassium-excluding convention and requested value plus baseline albumin effect.",
          "oneDefensibleBestAnswer": true,
          "assessment": "140 - (112 + 16) = 12 mmol/L. Hypoalbuminemia lowers the baseline gap. Only the keyed combination gets both components right. The explanation correctly identifies the supplied interval as laboratory-specific, permits a masked additional unmeasured-acid component, and does not claim that lactulose or gastrointestinal loss establishes the cause. JSON and Markdown present the same reviewed content.",
          "priorReviewResolution": [
            "Both prior clarity findings addressed: the gastrointestinal-cause option and sole-cause rebuttal are removed; the potassium-excluding convention is stated in the task.",
            "Both prior cue findings and the first two suggestions addressed: a complete two-by-two matrix replaces the qualified-key versus definitive-distractor contrast and the unbalanced numeric choices.",
            "Remaining suggestions addressed: feedback now evaluates the actual calculation and albumin direction, and retains only plain-gap arithmetic plus qualitative albumin teaching."
          ],
          "evidenceSourceIds": [
            "source.french-panel.metabolic-acidosis.2019"
          ],
          "evidenceClaimIds": [
            "claim.owner-decisions.20261112.plain-gap",
            "claim.owner-decisions.20261112.albumin-lowers-gap"
          ],
          "evidenceLimitations": "Offline review of the supplied claim mappings and source record, which identifies a CC BY 4.0 French expert-panel guideline. Single-source physiology support is disclosed. No network retrieval or independent authentication of the cited publication was performed. PASS is an editorial/evidence-alignment verdict, not clinical approval of this exact successor; its recorded needs_clinician_review status remains appropriate."
        },
        "suggestions": [
          "No blocking revision. Classify this as foundational rather than hard; do not restore correction arithmetic to increase difficulty.",
          "Retain the balanced option matrix and runtime randomization. The packet explicitly identifies first-position keys as a review-only convention; runtime behavior was not tested in this review."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "B2B34",
    "caseId": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "nodeId": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4\",\"conceptId\":\"concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1\",\"stem\":\"Using the potassium-excluding convention, which paired gaps and albumin effect should guide assessment for additional unmeasured acids in {patientName}'s two specimens?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-decrease.r4\",\"label\":\"14 → 12 mmol/L with an albumin-related decrease\",\"isCorrect\":true,\"rationale\":\"The two calculated gaps are 14 and 12. Falling albumin lowers the baseline gap, so these raw results cannot settle whether an additional unmeasured-acid process is present.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4\",\"label\":\"32 → 30 mmol/L with an albumin-related decrease\",\"isCorrect\":false,\"rationale\":\"The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.\",\"distractorRationale\":\"The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.\"},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4\",\"label\":\"14 → 12 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.\",\"distractorRationale\":\"The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.\"},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4\",\"label\":\"32 → 30 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"Both calculations omit bicarbonate, and the stated albumin effect is reversed.\",\"distractorRationale\":\"Both calculations omit bicarbonate, and the stated albumin effect is reversed.\"}],\"explanation\":\"The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed serial specimens. Laboratory uncorrected-gap interval 8-16 mmol/L.\",\"columnHeaders\":[\"Admission\",\"Later specimen\"],\"rowHeaders\":[\"Sodium (mmol/L)\",\"Chloride (mmol/L)\",\"Bicarbonate (mmol/L)\",\"Albumin\"],\"cells\":[[\"140\",\"140\"],[\"108\",\"110\"],[\"18\",\"18\"],[\"Within the laboratory interval\",\"Markedly below the laboratory interval\"]]},\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.plain-gap\",\"claim.owner-decisions.20261112.albumin-lowers-gap\",\"claim.owner-decisions.20261112.gap-trend-limit\"]}",
    "sourceNodeJson": "{\"id\":\"node.gs028d.acid-base.b-sepsis-recovery-gap.1\",\"questionVariantId\":\"question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4\",\"primaryConceptId\":\"concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1\",\"stem\":\"Using the potassium-excluding convention, which paired gaps and albumin effect should guide assessment for additional unmeasured acids in {patientName}'s two specimens?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-decrease.r4\",\"label\":\"14 → 12 mmol/L with an albumin-related decrease\",\"isCorrect\":true,\"rationale\":\"The two calculated gaps are 14 and 12. Falling albumin lowers the baseline gap, so these raw results cannot settle whether an additional unmeasured-acid process is present.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4\",\"label\":\"32 → 30 mmol/L with an albumin-related decrease\",\"isCorrect\":false,\"rationale\":\"The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4\",\"label\":\"14 → 12 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4\",\"label\":\"32 → 30 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"Both calculations omit bicarbonate, and the stated albumin effect is reversed.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.\",\"teachingPoint\":\"The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed serial specimens. Laboratory uncorrected-gap interval 8-16 mmol/L.\",\"columnHeaders\":[\"Admission\",\"Later specimen\"],\"rowHeaders\":[\"Sodium (mmol/L)\",\"Chloride (mmol/L)\",\"Bicarbonate (mmol/L)\",\"Albumin\"],\"cells\":[[\"140\",\"140\"],[\"108\",\"110\"],[\"18\",\"18\"],[\"Within the laboratory interval\",\"Markedly below the laboratory interval\"]]},\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Both calculations omit bicarbonate, and the stated albumin effect is reversed.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.gs028d.acid-base.b-sepsis-recovery-gap\",\"displayName\":\"Owner review for Morgan Ellis\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.plain-gap-trend.v2\",\"patientDisplayName\":\"Morgan Ellis\",\"prototypeDemographics\":{\"ageYears\":45,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Hospital panel review\",\"presentation\":\"{patientName}, a 45-year-old woman, attends clinic after a hospital admission for sepsis. You review two chemistry panels collected during that admission.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.plain-gap-trend.v2\",\"prototypeDemographics\":{\"ageYears\":45,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Hospital panel review\",\"presentation\":\"{patientName}, a 45-year-old woman, attends clinic after a hospital admission for sepsis. You review two chemistry panels collected during that admission.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"],\"decisionNodes\":[{\"id\":\"node.gs028d.acid-base.b-sepsis-recovery-gap.1\",\"questionVariantId\":\"question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4\",\"primaryConceptId\":\"concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1\",\"stem\":\"Using the potassium-excluding convention, which paired gaps and albumin effect should guide assessment for additional unmeasured acids in {patientName}'s two specimens?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-decrease.r4\",\"label\":\"14 → 12 mmol/L with an albumin-related decrease\",\"isCorrect\":true,\"rationale\":\"The two calculated gaps are 14 and 12. Falling albumin lowers the baseline gap, so these raw results cannot settle whether an additional unmeasured-acid process is present.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4\",\"label\":\"32 → 30 mmol/L with an albumin-related decrease\",\"isCorrect\":false,\"rationale\":\"The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4\",\"label\":\"14 → 12 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4\",\"label\":\"32 → 30 mmol/L with an albumin-related increase\",\"isCorrect\":false,\"rationale\":\"Both calculations omit bicarbonate, and the stated albumin effect is reversed.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.\",\"teachingPoint\":\"The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed serial specimens. Laboratory uncorrected-gap interval 8-16 mmol/L.\",\"columnHeaders\":[\"Admission\",\"Later specimen\"],\"rowHeaders\":[\"Sodium (mmol/L)\",\"Chloride (mmol/L)\",\"Bicarbonate (mmol/L)\",\"Albumin\"],\"cells\":[[\"140\",\"140\"],[\"108\",\"110\"],[\"18\",\"18\"],[\"Within the laboratory interval\",\"Markedly below the laboratory interval\"]]},\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-decrease.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The albumin direction is correct. Values of 32 and 30 omit bicarbonate from both calculations.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-trend.lower-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The paired calculations are correct. Falling albumin decreases the baseline gap, so the stated direction is reversed.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.plain-gap-trend.higher-increase.r4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Both calculations omit bicarbonate, and the stated albumin effect is reversed.\",\"sourceLabels\":[\"Diagnosis and management of metabolic acidosis: guidelines from a French expert panel\"]}]}],\"learningSummary\":\"The potassium-excluding gaps are 140 - (108 + 18) = 14 mmol/L and 140 - (110 + 18) = 12 mmol/L. Both are within the supplied laboratory interval. Falling albumin decreases the baseline gap, so this comparison cannot determine whether an additional unmeasured-acid process is present. The initial panel did not establish an increased-gap process.\"}",
    "questionSha256": "ca1e3eaa04f45943356cf19b45108b62dfd7688943c57f24bd83847765fdd3f2",
    "nodeSha256": "854bced35ef0cf7a15fe7ff7f8a3a8644e1cf0bf71715b6d640fd0a40411e840",
    "caseSha256": "de62d610ca78fb6c627dcab57e77d718ec25ef183ea1a1a2c6aae3949067f4e9",
    "review": {
      "path": "docs/research/question-owner-decisions-review2-20261112.json",
      "record": {
        "id": "B2B34",
        "variantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4",
        "verdict": "PASS",
        "difficulty": {
          "level": "Easy to moderate; closer to foundational than advanced",
          "highYield": true,
          "rationale": "Adds a second calculation and a changing-albumin context. The scored choice still primarily tests calculation plus direction; the more valuable limit on inferring an unmeasured-acid process is taught mainly in feedback."
        },
        "clarityIssues": [
          "Minor: 'with an albumin-related decrease' can be read as attributing the entire displayed numerical fall to albumin. The task asks for an albumin effect and the explanation describes the baseline gap, so the intended qualitative interpretation is recoverable; no quantitative attribution is established."
        ],
        "cues": [
          {
            "severity": "Low to moderate residual; not a unique-answer shortcut",
            "exactPhrases": [
              "Within the laboratory interval",
              "Markedly below the laboratory interval",
              "14 → 12 mmol/L with an albumin-related decrease",
              "32 → 30 mmol/L with an albumin-related decrease",
              "14 → 12 mmol/L with an albumin-related increase",
              "32 → 30 mmol/L with an albumin-related increase"
            ],
            "attack": "A reader may match falling albumin, descending arrows and 'decrease' without physiology. Both numeric pairs descend, however, and both directions are offered with each pair; this heuristic cannot choose the correct arithmetic pair. The prior unique uncertainty wording and isolated copied bicarbonate values are absent."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: both gaps are uncorrected, and albumin is interpreted qualitatively. No correction formula or corrected-gap arithmetic is required or disclosed.",
          "ownerStyle": "Pass: Morgan Ellis is a named 45-year-old woman attending clinic; 'Hospital panel review' has three words; the complete task requests paired gaps and an albumin effect in assessing additional unmeasured acids.",
          "oneDefensibleBestAnswer": true,
          "assessment": "140 - (108 + 18) = 14 and 140 - (110 + 18) = 12 mmol/L. The alternative 32 and 30 omit bicarbonate. Falling albumin lowers the baseline gap rather than raising it. Both calculated gaps lie within the supplied interval, and neither proves absence of additional unmeasured acids. The explanation explicitly avoids asserting an initially established increased-gap process. JSON and Markdown agree.",
          "priorReviewResolution": [
            "All three prior clarity findings addressed: vague 'acid burden' wording is replaced with additional unmeasured acids; feedback states that the initial panel did not establish an increased-gap process; the task states the potassium-excluding convention.",
            "Both cue findings addressed: equally definite choices form a complete matrix; the lone 18-to-18 copied-value option and the narrative sentence highlighting the albumin/bicarbonate contrast are removed.",
            "All four prior suggestions addressed in substance: specific inference, balanced certainty, explicit normal-range feedback and no correction math. The packet retains the stable concept ID and the previously issued concept-content version for the narrowed objective; no runtime history migration was evaluated."
          ],
          "evidenceSourceIds": [
            "source.french-panel.metabolic-acidosis.2019"
          ],
          "evidenceClaimIds": [
            "claim.owner-decisions.20261112.plain-gap",
            "claim.owner-decisions.20261112.albumin-lowers-gap",
            "claim.owner-decisions.20261112.gap-trend-limit"
          ],
          "evidenceLimitations": "The packet records one CC BY guideline and identifies the serial interpretation as a qualitative application to constructed specimens. It cannot quantify the contribution of albumin to the observed change or establish a precise acid burden. Offline source-record and claim-mapping review only; PASS does not independently authenticate the publication or approve the exact successor clinically."
        },
        "suggestions": [
          "Optional clarity polish: make all four labels explicitly describe albumin's effect on the baseline gap, preserving their identical structure. Do not imply that albumin accounts for the entire two-point fall.",
          "No blocking revision. Keep the normal-range qualification and avoid advertising this as a difficult acid-base interpretation item."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "G02",
    "caseId": "case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1",
    "nodeId": "node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1",
    "questionVariantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2\",\"conceptId\":\"concept.mh.nontriggering-plan-and-testing-sequence.v1\",\"stem\":\"Which perioperative plan should {patientName}'s team arrange before her colectomy?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.mh-plan.ready\",\"label\":\"Trigger-free general anesthesia with dantrolene plus an MH response team ready\",\"isCorrect\":true,\"rationale\":\"Unresolved familial susceptibility calls for nontriggering anesthesia and crisis preparedness. Specialist assessment can proceed separately from the planned operation.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.volatile-ready\",\"label\":\"Sevoflurane inhalational anesthesia with dantrolene plus an MH response team ready\",\"isCorrect\":false,\"rationale\":\"Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.\",\"distractorRationale\":\"Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.\"},{\"id\":\"choice.owner-decisions.20261112.mh-plan.prophylaxis\",\"label\":\"Trigger-free general anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution\",\"isCorrect\":false,\"rationale\":\"Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.\",\"distractorRationale\":\"Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.\"},{\"id\":\"choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis\",\"label\":\"Sevoflurane inhalational anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution\",\"isCorrect\":false,\"rationale\":\"Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.\",\"distractorRationale\":\"Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.\"}],\"explanation\":\"The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.mh-family-risk\",\"claim.owner-decisions.20261112.mh-trigger-free\",\"claim.owner-decisions.20261112.mh-readiness\",\"claim.owner-decisions.20261112.mh-testing-sequence\",\"claim.owner-decisions.20261112.mh-prophylaxis\"]}",
    "sourceNodeJson": "{\"id\":\"node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1\",\"questionVariantId\":\"question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2\",\"primaryConceptId\":\"concept.mh.nontriggering-plan-and-testing-sequence.v1\",\"stem\":\"Which perioperative plan should {patientName}'s team arrange before her colectomy?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.mh-plan.ready\",\"label\":\"Trigger-free general anesthesia with dantrolene plus an MH response team ready\",\"isCorrect\":true,\"rationale\":\"Unresolved familial susceptibility calls for nontriggering anesthesia and crisis preparedness. Specialist assessment can proceed separately from the planned operation.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.volatile-ready\",\"label\":\"Sevoflurane inhalational anesthesia with dantrolene plus an MH response team ready\",\"isCorrect\":false,\"rationale\":\"Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.prophylaxis\",\"label\":\"Trigger-free general anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution\",\"isCorrect\":false,\"rationale\":\"Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis\",\"label\":\"Sevoflurane inhalational anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution\",\"isCorrect\":false,\"rationale\":\"Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.\",\"teachingPoint\":\"The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-plan.volatile-ready\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-plan.prophylaxis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1\",\"displayName\":\"Owner review for Maya Chen\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.mh-plan.v1\",\"patientDisplayName\":\"Maya Chen\",\"prototypeDemographics\":{\"ageYears\":35,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Anesthetic planning\",\"presentation\":\"{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her previous sevoflurane anesthetic was uneventful. Her gene panel found no pathogenic variant, and no familial causative variant has been identified. She has not undergone contracture testing.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.mh-plan.v1\",\"prototypeDemographics\":{\"ageYears\":35,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Anesthetic planning\",\"presentation\":\"{patientName}, a 35-year-old woman, attends clinic before elective colectomy. Her brother has a positive caffeine-halothane muscle-contracture test. Her previous sevoflurane anesthetic was uneventful. Her gene panel found no pathogenic variant, and no familial causative variant has been identified. She has not undergone contracture testing.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"],\"decisionNodes\":[{\"id\":\"node.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v1\",\"questionVariantId\":\"question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2\",\"primaryConceptId\":\"concept.mh.nontriggering-plan-and-testing-sequence.v1\",\"stem\":\"Which perioperative plan should {patientName}'s team arrange before her colectomy?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.mh-plan.ready\",\"label\":\"Trigger-free general anesthesia with dantrolene plus an MH response team ready\",\"isCorrect\":true,\"rationale\":\"Unresolved familial susceptibility calls for nontriggering anesthesia and crisis preparedness. Specialist assessment can proceed separately from the planned operation.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.volatile-ready\",\"label\":\"Sevoflurane inhalational anesthesia with dantrolene plus an MH response team ready\",\"isCorrect\":false,\"rationale\":\"Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.prophylaxis\",\"label\":\"Trigger-free general anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution\",\"isCorrect\":false,\"rationale\":\"Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis\",\"label\":\"Sevoflurane inhalational anesthesia with prophylactic dantrolene dosing as a routine preoperative precaution\",\"isCorrect\":false,\"rationale\":\"Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.\",\"teachingPoint\":\"The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-plan.volatile-ready\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Preparedness does not remove the need to avoid volatile triggering agents in a person treated as susceptible.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-plan.prophylaxis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Routine pretreatment adds no recommended protection to an appropriately planned nontriggering anesthetic and can cause weakness.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-plan.volatile-prophylaxis\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Pretreatment does not justify using a triggering volatile agent. Both agent selection and routine prophylaxis conflict with the recommended plan.\",\"sourceLabels\":[\"Perioperative management of MH suspected or susceptible patients\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]}]}],\"learningSummary\":\"The family history keeps MH susceptibility in consideration despite an uninformative gene panel and an earlier uneventful exposure. Arrange trigger-free anesthesia, a prepared workstation, dantrolene availability and a trained MH response team. Include the appropriate transfer pathway for an ambulatory setting. MH specialist assessment and testing can be arranged separately. Routine prophylactic dantrolene is discouraged.\"}",
    "questionSha256": "81c420bf121c05a989d89071b2a3456fa52181470318202a8a15525f2f66f79a",
    "nodeSha256": "5a492da27188fbca0ce91538bcef3e8fa4d475b5261c3fb841ea814f028af0a3",
    "caseSha256": "4475753753e824523546d4677e0fd7be3f6b19145121d7ed51e366660871738c",
    "review": {
      "path": "docs/research/question-owner-decisions-review-20261112.json",
      "record": {
        "id": "G02",
        "variantId": "question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2",
        "verdict": "PASS",
        "difficulty": {
          "level": "Moderate",
          "highYield": true,
          "rationale": "Combines unresolved familial susceptibility, an uninformative genetic result, prior uneventful exposure, trigger avoidance and the distinction between preparedness and prophylactic dosing."
        },
        "clarityIssues": [
          "Minor: 'MH' first appears in the options without expansion in this question's presentation or task. Spell out malignant hyperthermia at first use.",
          "The version tests the perioperative plan well, but it does not directly discriminate proceeding now from postponing for testing because no option proposes waiting for testing. Its legacy testing-sequence identifier overstates that part of the current assessment."
        ],
        "cues": [
          {
            "severity": "Low",
            "exactPhrases": [
              "Trigger-free general anesthesia",
              "Sevoflurane inhalational anesthesia",
              "an MH response team ready",
              "as a routine preoperative precaution"
            ],
            "attack": "'Trigger-free' sounds reassuring, and 'routine' can attract suspicion, but each factor appears in two options. The balanced two-by-two design prevents either phrase alone from revealing the key. Knowing why readiness is preferable to prophylaxis is still required."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: the preparation sentence is absent from the stem. Trigger-free anesthesia with dantrolene and an MH response team is now the key, matching the owner's example. Workstation preparation and the ambulatory transfer pathway are supplied in the explanation.",
          "ownerStyle": "Pass: Maya Chen is a named 35-year-old woman; 'Anesthetic planning' is two words; the task clearly asks her team to choose a perioperative plan for colectomy.",
          "oneDefensibleBestAnswer": true,
          "assessment": "The family history remains relevant despite an uninformative gene panel and previous uneventful exposure. The other options introduce a triggering volatile agent, routine prophylactic dantrolene, or both. The key is the unique best plan among those offered.",
          "evidenceSourceIds": [
            "source.anesthesia-analgesia-pharmacology.jsa-mh-2026",
            "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
            "source.owner-decisions.20261112.mhaus-pretesting-2018"
          ],
          "evidenceLimitations": "Packet records support susceptibility, trigger avoidance, readiness and avoiding routine prophylaxis. These are rare-event guidance and consensus recommendations; this review did not retrieve the external documents."
        },
        "suggestions": [
          "Optional editorial polish: expand malignant hyperthermia on first use without restoring the preparation instructions to the stem.",
          "Retain the parallel two-by-two options and the full preparation details in the explanation.",
          "If testing sequence remains a separately scored objective, assess that decision explicitly in a separately reviewed item; do not claim this option set independently measures it."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "G02-NEW",
    "caseId": "case.owner-decisions.20261112.mh-medication",
    "nodeId": "node.owner-decisions.20261112.mh-medication",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1\",\"conceptId\":\"concept.mh.dantrolene-readiness.v1\",\"stem\":\"Which medication must the team have ready for immediate administration if {patientName} develops an MH crisis?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.mh-medication.dantrolene\",\"label\":\"Dantrolene\",\"isCorrect\":true,\"rationale\":\"Dantrolene is the crisis-specific medication required by MH preparedness guidance.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.naloxone\",\"label\":\"Naloxone\",\"isCorrect\":false,\"rationale\":\"Naloxone does not satisfy the MH-specific emergency medication requirement.\",\"distractorRationale\":\"Naloxone does not satisfy the MH-specific emergency medication requirement.\"},{\"id\":\"choice.owner-decisions.20261112.mh-medication.flumazenil\",\"label\":\"Flumazenil\",\"isCorrect\":false,\"rationale\":\"Flumazenil does not satisfy the MH-specific emergency medication requirement.\",\"distractorRationale\":\"Flumazenil does not satisfy the MH-specific emergency medication requirement.\"},{\"id\":\"choice.owner-decisions.20261112.mh-medication.sugammadex\",\"label\":\"Sugammadex\",\"isCorrect\":false,\"rationale\":\"Sugammadex does not satisfy the MH-specific emergency medication requirement.\",\"distractorRationale\":\"Sugammadex does not satisfy the MH-specific emergency medication requirement.\"}],\"explanation\":\"Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.mh-dantrolene\",\"claim.owner-decisions.20261112.mh-readiness\"]}",
    "sourceNodeJson": "{\"id\":\"node.owner-decisions.20261112.mh-medication\",\"questionVariantId\":\"question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1\",\"primaryConceptId\":\"concept.mh.dantrolene-readiness.v1\",\"stem\":\"Which medication must the team have ready for immediate administration if {patientName} develops an MH crisis?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.mh-medication.dantrolene\",\"label\":\"Dantrolene\",\"isCorrect\":true,\"rationale\":\"Dantrolene is the crisis-specific medication required by MH preparedness guidance.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.naloxone\",\"label\":\"Naloxone\",\"isCorrect\":false,\"rationale\":\"Naloxone does not satisfy the MH-specific emergency medication requirement.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.flumazenil\",\"label\":\"Flumazenil\",\"isCorrect\":false,\"rationale\":\"Flumazenil does not satisfy the MH-specific emergency medication requirement.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.sugammadex\",\"label\":\"Sugammadex\",\"isCorrect\":false,\"rationale\":\"Sugammadex does not satisfy the MH-specific emergency medication requirement.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.\",\"teachingPoint\":\"Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-medication.naloxone\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Naloxone does not satisfy the MH-specific emergency medication requirement.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-medication.flumazenil\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Flumazenil does not satisfy the MH-specific emergency medication requirement.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-medication.sugammadex\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Sugammadex does not satisfy the MH-specific emergency medication requirement.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.owner-decisions.20261112.mh-medication\",\"displayName\":\"Owner review for Daniel Brooks\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.mh-medication.v1\",\"patientDisplayName\":\"Daniel Brooks\",\"prototypeDemographics\":{\"ageYears\":41,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Anesthesia medication check\",\"presentation\":\"{patientName}, a 41-year-old man with malignant-hyperthermia susceptibility confirmed by contracture testing, attends clinic before elective hernia repair. The anesthetist is reviewing the facility's emergency medication supply.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.mh-medication.v1\",\"prototypeDemographics\":{\"ageYears\":41,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Anesthesia medication check\",\"presentation\":\"{patientName}, a 41-year-old man with malignant-hyperthermia susceptibility confirmed by contracture testing, attends clinic before elective hernia repair. The anesthetist is reviewing the facility's emergency medication supply.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"],\"decisionNodes\":[{\"id\":\"node.owner-decisions.20261112.mh-medication\",\"questionVariantId\":\"question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1\",\"primaryConceptId\":\"concept.mh.dantrolene-readiness.v1\",\"stem\":\"Which medication must the team have ready for immediate administration if {patientName} develops an MH crisis?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.mh-medication.dantrolene\",\"label\":\"Dantrolene\",\"isCorrect\":true,\"rationale\":\"Dantrolene is the crisis-specific medication required by MH preparedness guidance.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.naloxone\",\"label\":\"Naloxone\",\"isCorrect\":false,\"rationale\":\"Naloxone does not satisfy the MH-specific emergency medication requirement.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.flumazenil\",\"label\":\"Flumazenil\",\"isCorrect\":false,\"rationale\":\"Flumazenil does not satisfy the MH-specific emergency medication requirement.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.mh-medication.sugammadex\",\"label\":\"Sugammadex\",\"isCorrect\":false,\"rationale\":\"Sugammadex does not satisfy the MH-specific emergency medication requirement.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.\",\"teachingPoint\":\"Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-medication.naloxone\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Naloxone does not satisfy the MH-specific emergency medication requirement.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-medication.flumazenil\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Flumazenil does not satisfy the MH-specific emergency medication requirement.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.mh-medication.sugammadex\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Sugammadex does not satisfy the MH-specific emergency medication requirement.\",\"sourceLabels\":[\"Recognising and managing a malignant hyperthermia crisis (v2024)\",\"JSA guideline for management of malignant hyperthermia in 2025\",\"Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?\"]}]}],\"learningSummary\":\"Dantrolene must be available for rapid treatment of an MH crisis. Verify its availability alongside the facility's MH response preparations before anesthesia.\"}",
    "questionSha256": "24badd604c8d54334c1313d54998d54112bb86217ac55465f2df1d8f7fad2e99",
    "nodeSha256": "d8d96a7bbc7b72c440ba8c702f15aa26a0c88c7237a6fa05bfa5a54ab823fd37",
    "caseSha256": "a794246eba565b45a41f23c5719705fb790cfd13f7819532611434e3fbfef938",
    "review": {
      "path": "docs/research/question-owner-decisions-review-20261112.json",
      "record": {
        "id": "G02-NEW",
        "variantId": "question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1",
        "verdict": "PASS",
        "difficulty": {
          "level": "Easy recall",
          "highYield": true,
          "rationale": "Identifying dantrolene for an MH crisis is foundational emergency knowledge. Easy difficulty is appropriate for the owner's explicitly requested medication item."
        },
        "clarityIssues": [],
        "cues": [
          {
            "severity": "None material",
            "exactPhrases": [
              "Dantrolene",
              "Naloxone",
              "Flumazenil",
              "Sugammadex",
              "if Daniel Brooks develops an MH crisis"
            ],
            "attack": "All choices are unqualified single medication names. The task names the emergency but does not repeat or describe the keyed drug. Selecting dantrolene requires the intended medical association."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: adds a distinct medication-readiness question keyed to dantrolene, as requested.",
          "ownerStyle": "Pass: Daniel Brooks is a named 41-year-old man; 'Anesthesia medication check' is three words; the task completely specifies medication readiness for an MH crisis.",
          "oneDefensibleBestAnswer": true,
          "assessment": "Dantrolene is uniquely appropriate for the specified crisis. The other medication names are plausible anesthetic emergency distractors but do not meet the MH-specific requirement. The item tests identification, not a stock quantity, dose or precise retrieval-time rule.",
          "evidenceSourceIds": [
            "source.anesthesia-analgesia-pharmacology.emhg-crisis-2024",
            "source.owner-decisions.20261112.mhaus-pretesting-2018",
            "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
          ],
          "evidenceLimitations": "Conclusion is aligned with the packet's recorded crisis-medication and readiness claims; no fresh external verification was performed."
        },
        "suggestions": [
          "Accept as a foundational high-yield item rather than labeling it difficult.",
          "Keep it separately scored from the MH planning concept and retain randomized runtime answer ordering."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "TOPIC-060",
    "caseId": "case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1",
    "nodeId": "node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "questionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2\",\"conceptId\":\"concept.rectal-cancer.selected-watch-and-wait\",\"stem\":\"Which treatment plan best fits {patientName}'s progressive post-treatment rectal findings?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.rectal-resection.resection\",\"label\":\"Oncologic rectal resection with total mesorectal excision\",\"isCorrect\":true,\"rationale\":\"Progressive concordant mural findings support the residual-disease pathway. Low anterior and abdominoperineal approaches both incorporate mesorectal clearance.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.rectal-resection.local\",\"label\":\"Full-thickness local rectal excision through a transanal approach\",\"isCorrect\":false,\"rationale\":\"The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.\",\"distractorRationale\":\"The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.\"},{\"id\":\"choice.owner-decisions.20261112.rectal-resection.observe\",\"label\":\"Protocolized watch-and-wait follow-up within a specialist surveillance program\",\"isCorrect\":false,\"rationale\":\"The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.\",\"distractorRationale\":\"The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.\"}],\"explanation\":\"Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.rectal-negative-biopsy\",\"claim.owner-decisions.20261112.rectal-residual-surgery\",\"claim.owner-decisions.20261112.rectal-watch-selection\",\"claim.owner-decisions.20261112.rectal-operations\"]}",
    "sourceNodeJson": "{\"id\":\"node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1\",\"questionVariantId\":\"question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2\",\"primaryConceptId\":\"concept.rectal-cancer.selected-watch-and-wait\",\"stem\":\"Which treatment plan best fits {patientName}'s progressive post-treatment rectal findings?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.rectal-resection.resection\",\"label\":\"Oncologic rectal resection with total mesorectal excision\",\"isCorrect\":true,\"rationale\":\"Progressive concordant mural findings support the residual-disease pathway. Low anterior and abdominoperineal approaches both incorporate mesorectal clearance.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.rectal-resection.local\",\"label\":\"Full-thickness local rectal excision through a transanal approach\",\"isCorrect\":false,\"rationale\":\"The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.rectal-resection.observe\",\"label\":\"Protocolized watch-and-wait follow-up within a specialist surveillance program\",\"isCorrect\":false,\"rationale\":\"The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.\",\"teachingPoint\":\"Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.rectal-resection.local\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.rectal-resection.observe\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1\",\"displayName\":\"Owner review for Rachel Hayes\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.rectal-resection.v1\",\"patientDisplayName\":\"Rachel Hayes\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Rectal treatment review\",\"presentation\":\"{patientName}, a 57-year-old woman, attends clinic after neoadjuvant therapy for a previously node-positive low rectal adenocarcinoma. On successive reassessments, a firm mural nodule beneath intact mucosa has enlarged. MRI shows a corresponding intermediate-T2 focus with diffusion restriction. Superficial biopsies contain scar and inflammation. Distant restaging is negative, and she is fit for surgery.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.rectal-resection.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Rectal treatment review\",\"presentation\":\"{patientName}, a 57-year-old woman, attends clinic after neoadjuvant therapy for a previously node-positive low rectal adenocarcinoma. On successive reassessments, a firm mural nodule beneath intact mucosa has enlarged. MRI shows a corresponding intermediate-T2 focus with diffusion restriction. Superficial biopsies contain scar and inflammation. Distant restaging is negative, and she is fit for surgery.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":1,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"],\"decisionNodes\":[{\"id\":\"node.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1\",\"questionVariantId\":\"question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2\",\"primaryConceptId\":\"concept.rectal-cancer.selected-watch-and-wait\",\"stem\":\"Which treatment plan best fits {patientName}'s progressive post-treatment rectal findings?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.rectal-resection.resection\",\"label\":\"Oncologic rectal resection with total mesorectal excision\",\"isCorrect\":true,\"rationale\":\"Progressive concordant mural findings support the residual-disease pathway. Low anterior and abdominoperineal approaches both incorporate mesorectal clearance.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.rectal-resection.local\",\"label\":\"Full-thickness local rectal excision through a transanal approach\",\"isCorrect\":false,\"rationale\":\"The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.rectal-resection.observe\",\"label\":\"Protocolized watch-and-wait follow-up within a specialist surveillance program\",\"isCorrect\":false,\"rationale\":\"The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.\",\"teachingPoint\":\"Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.rectal-resection.local\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The prior node-positive disease and progressive mural abnormality require an oncologic plan addressing the mesorectal compartment.\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.rectal-resection.observe\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The enlarging palpable and imaging abnormality is incompatible with the complete-response state used to select this approach.\",\"sourceLabels\":[\"ASCRS Management of Rectal Cancer 2023 Supplement\",\"Rectal Cancer Treatment (PDQ), Health Professional Version\"]}]}],\"learningSummary\":\"Progressive palpable and MRI findings support oncologic rectal resection despite a superficial negative biopsy. Low anterior resection (LAR) and abdominoperineal resection (APR) are both total mesorectal excision operations. Tumor extent, sphincter involvement and margin feasibility determine the operation.\"}",
    "questionSha256": "057159062f2eb3cd5752fcbb72546822370b390e56e5b0e5603621aa90f26762",
    "nodeSha256": "03118fb1805daf747961587e6f103903f679267784e7035011fe72866c6c29b5",
    "caseSha256": "b53e20b6b4e399f83eb7a01f6b3c457c4536977cc85ecc5e757a7bb9f4052211",
    "review": {
      "path": "docs/research/question-owner-decisions-review-20261112.json",
      "record": {
        "id": "TOPIC-060",
        "variantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2",
        "verdict": "PASS",
        "difficulty": {
          "level": "Moderate",
          "highYield": true,
          "rationale": "Tests why a superficial negative biopsy does not override progressive concordant examination and MRI findings after rectal cancer treatment, and distinguishes oncologic resection from local excision or surveillance."
        },
        "clarityIssues": [
          "Minor generalization risk: the explanation says LAR and APR 'are both total mesorectal excision operations' without repeating the low-rectal-cancer context. The corresponding atomic claim is explicitly scoped to low rectal cancer; retain that qualifier if this explanation is reused independently."
        ],
        "cues": [
          {
            "severity": "Low",
            "exactPhrases": [
              "has enlarged",
              "progressive post-treatment rectal findings",
              "Protocolized watch-and-wait follow-up within a specialist surveillance program",
              "Oncologic rectal resection with total mesorectal excision"
            ],
            "attack": "Progression makes 'watch-and-wait' unattractive even to a lay reader, but it does not distinguish the two excision choices. Prior nodal disease and mesorectal oncologic coverage remain necessary discriminators. The word 'Oncologic' slightly favors the cancer-directed choice but does not alone establish its superiority to local excision."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: retains the resection key, spells out 'total mesorectal excision', and explicitly explains that low anterior resection (LAR) and abdominoperineal resection (APR) are both such operations. The owner's explanatory requirement is fulfilled in the explanation, without overloading the option label.",
          "ownerStyle": "Pass: Rachel Hayes is a named 57-year-old woman; 'Rectal treatment review' is three words; the task explicitly asks for the treatment plan for her progressive findings.",
          "oneDefensibleBestAnswer": true,
          "assessment": "In the stated fit patient with previously node-positive low rectal cancer and progressive concordant mural findings, oncologic resection is the best listed option. Local excision does not address the same mesorectal oncologic concern; progressive disease does not satisfy a clinical complete-response selection for watch-and-wait. No choice between LAR and APR is demanded without the necessary anatomical details.",
          "evidenceSourceIds": [
            "source.colorectal-polyps-cancer.ascrs-rectal-supplement-2023",
            "source.colorectal-polyps-cancer.nci-rectal-pdq"
          ],
          "evidenceLimitations": "The packet explicitly reports that current ASCRS full-text access returned HTTP 403; its negative-biopsy claim uses inherited atomic alignment. NCI is recorded as directly checked for the operation descriptions. This PASS accepts that disclosed evidence boundary and the owner's direction; it does not certify newly authenticated full-text support for the negative-biopsy claim."
        },
        "suggestions": [
          "Optional precision edit: qualify the LAR/APR sentence with 'For this low rectal cancer' to match the atomic claim and avoid universalizing the extent of mesorectal excision.",
          "Preserve the inherited-ASCRS verification limitation in acceptance records; do not describe it as a new full-text verification.",
          "Retain the distinction between progressive residual disease and an equivocal or improving response."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "TOPIC-034",
    "caseId": "case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2",
    "nodeId": "node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2",
    "questionVariantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3\",\"conceptId\":\"concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1\",\"stem\":\"Which next plan best fits {patientName}'s Crohn follow-up after this limited examination?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.scope\",\"label\":\"Obtain ileocolonoscopy to reassess postoperative disease activity\",\"isCorrect\":true,\"rationale\":\"The prior procedure did not examine the anastomosis or neoterminal ileum. Persistent stool-marker elevation warrants clarification of those postoperative sites.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.escalate\",\"label\":\"Intensify infliximab maintenance therapy based on current biomarkers\",\"isCorrect\":false,\"rationale\":\"Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.\",\"distractorRationale\":\"Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.\"},{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.markers\",\"label\":\"Continue maintenance therapy with biomarker-based monitoring at follow-up\",\"isCorrect\":false,\"rationale\":\"The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.\",\"distractorRationale\":\"The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.\"}],\"explanation\":\"The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.crohn-postoperative-scope\",\"claim.owner-decisions.20261112.crohn-marker-discordance\",\"claim.owner-decisions.20261112.crohn-incomplete-exam\"]}",
    "sourceNodeJson": "{\"id\":\"node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2\",\"questionVariantId\":\"question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3\",\"primaryConceptId\":\"concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1\",\"stem\":\"Which next plan best fits {patientName}'s Crohn follow-up after this limited examination?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.scope\",\"label\":\"Obtain ileocolonoscopy to reassess postoperative disease activity\",\"isCorrect\":true,\"rationale\":\"The prior procedure did not examine the anastomosis or neoterminal ileum. Persistent stool-marker elevation warrants clarification of those postoperative sites.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.escalate\",\"label\":\"Intensify infliximab maintenance therapy based on current biomarkers\",\"isCorrect\":false,\"rationale\":\"Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.markers\",\"label\":\"Continue maintenance therapy with biomarker-based monitoring at follow-up\",\"isCorrect\":false,\"rationale\":\"The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.\",\"teachingPoint\":\"The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.crohn-surveillance.escalate\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.crohn-surveillance.markers\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2\",\"displayName\":\"Owner review for Lena Morgan\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.crohn-surveillance.v1\",\"patientDisplayName\":\"Lena Morgan\",\"prototypeDemographics\":{\"ageYears\":36,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Crohn follow-up\",\"presentation\":\"{patientName}, a 36-year-old woman, attends clinic eight months after ileocolic resection for Crohn disease. She feels well on maintenance infliximab, with usual oral intake and bowel function. CRP is within the laboratory interval, but fecal calprotectin remains elevated on repeated samples. Stool testing found no enteric pathogen. An outside colonoscopy was summarized as normal. The procedure reached the splenic flexure, where poor preparation prevented further passage. Biopsies from the descending colon, sigmoid colon and rectum showed no active inflammation.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.crohn-surveillance.v1\",\"prototypeDemographics\":{\"ageYears\":36,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Crohn follow-up\",\"presentation\":\"{patientName}, a 36-year-old woman, attends clinic eight months after ileocolic resection for Crohn disease. She feels well on maintenance infliximab, with usual oral intake and bowel function. CRP is within the laboratory interval, but fecal calprotectin remains elevated on repeated samples. Stool testing found no enteric pathogen. An outside colonoscopy was summarized as normal. The procedure reached the splenic flexure, where poor preparation prevented further passage. Biopsies from the descending colon, sigmoid colon and rectum showed no active inflammation.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"],\"decisionNodes\":[{\"id\":\"node.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2\",\"questionVariantId\":\"question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3\",\"primaryConceptId\":\"concept.bowel-ibd-malabsorption-short-bowel.crohn-postresection-endoscopy.v1\",\"stem\":\"Which next plan best fits {patientName}'s Crohn follow-up after this limited examination?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.scope\",\"label\":\"Obtain ileocolonoscopy to reassess postoperative disease activity\",\"isCorrect\":true,\"rationale\":\"The prior procedure did not examine the anastomosis or neoterminal ileum. Persistent stool-marker elevation warrants clarification of those postoperative sites.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.escalate\",\"label\":\"Intensify infliximab maintenance therapy based on current biomarkers\",\"isCorrect\":false,\"rationale\":\"Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.crohn-surveillance.markers\",\"label\":\"Continue maintenance therapy with biomarker-based monitoring at follow-up\",\"isCorrect\":false,\"rationale\":\"The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.\",\"teachingPoint\":\"The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.crohn-surveillance.escalate\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Raised biomarkers warrant evaluation, while this incomplete examination has not established the site or severity needed to support empiric escalation.\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.crohn-surveillance.markers\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The repeatedly abnormal stool result and unexamined postoperative sites leave mucosal activity unresolved despite symptom control.\",\"sourceLabels\":[\"ECCO therapeutics in Crohn disease: surgical treatment, 2024\",\"AGA guideline on biomarkers in Crohn disease\"]}]}],\"learningSummary\":\"The limited distal examination leaves the ileocolic anastomosis and neoterminal ileum unassessed. Ileocolonoscopy can clarify postoperative activity before a treatment change. Symptom control and a normal CRP do not settle the repeated stool-marker abnormality.\"}",
    "questionSha256": "ad76b808566c62ef38608ece183dbad81c6e10cdb146edf7f367f31cc50faa3e",
    "nodeSha256": "f359c0015fd48b4ead2ad2520c1b4ba4453c4098dbfc289001b4f4af8f5a5d25",
    "caseSha256": "6815357b688d41a0fb7ef36129cae8015c72876180f5ce68f03c4305369203aa",
    "review": {
      "path": "docs/research/question-owner-decisions-review-20261112.json",
      "record": {
        "id": "TOPIC-034",
        "variantId": "question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3",
        "verdict": "PASS",
        "difficulty": {
          "level": "Easy to moderate",
          "highYield": true,
          "rationale": "Requires interpreting an incomplete postoperative examination alongside discordant biomarkers and clinical remission. The explicit description of the incomplete scope makes it easier, but the surveillance principle remains useful."
        },
        "clarityIssues": [
          "Minor: 'An outside colonoscopy was summarized as normal' followed by the procedural limitation is understandable but could more explicitly distinguish the outside summary from the actual incomplete report."
        ],
        "cues": [
          {
            "severity": "Moderate but not disqualifying",
            "exactPhrases": [
              "poor preparation prevented further passage",
              "after this limited examination",
              "Obtain ileocolonoscopy to reassess postoperative disease activity"
            ],
            "attack": "A reader can reason that an unfinished examination should be completed; the task repeats 'limited' and the key is the only option to obtain a scope. This reduces difficulty, but the limitation is a legitimate clinical fact needed to reject the reassuring outside report. Its anatomical significance and relationship to postoperative surveillance still require knowledge."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: retains ileocolonoscopy and replaces record-style fragments with complete sentences in a connected presentation.",
          "ownerStyle": "Pass: Lena Morgan is a named 36-year-old woman; 'Crohn follow-up' is two words; the task completely asks for her next follow-up plan.",
          "oneDefensibleBestAnswer": true,
          "assessment": "The examination stopped before the ileocolic anastomosis and neoterminal ileum, and the patient has repeatedly elevated fecal calprotectin at eight months after resection. Completing endoscopic assessment is better supported than empirically escalating infliximab or continuing biomarker-only monitoring. Distal negative biopsies and normal CRP do not resolve the unexamined postoperative sites.",
          "evidenceSourceIds": [
            "source.bowel-ibd-malabsorption-short-bowel.ecco-crohn-2024",
            "source.bowel-ibd-malabsorption-short-bowel.aga-crohn-biomarkers-2023"
          ],
          "evidenceLimitations": "The packet records ECCO's 6-12-month surveillance interval and conditional AGA biomarker guidance. The eight-month visit fits that recorded interval. Source-alignment review only; no external retrieval."
        },
        "suggestions": [
          "Optional cue reduction: remove 'after this limited examination' from the task while preserving the actual procedural reach and preparation limitation in the presentation.",
          "Keep the repeated biomarker elevation, the unassessed postoperative anatomy and the lack of enteric pathogen; do not add unsupported calprotectin thresholds.",
          "Retain runtime wait treatment for both ileocolonoscopy and the biomarker-monitoring testing choice during integration."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "TOPIC-069",
    "caseId": "case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1",
    "nodeId": "node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1",
    "questionVariantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2\",\"conceptId\":\"concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1\",\"stem\":\"Which repair plan best fits {patientName}'s symptomatic type III hiatal hernia and completed reflux assessment?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.wrap\",\"label\":\"Reduce hernia, close hiatus and add fundoplication\",\"isCorrect\":true,\"rationale\":\"The defined hiatal anatomy, reflux findings and operative fitness support adding an antireflux component to reconstruction.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.no-wrap\",\"label\":\"Reduce hernia and close hiatus without a wrap\",\"isCorrect\":false,\"rationale\":\"This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.\",\"distractorRationale\":\"This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.\"},{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.fix\",\"label\":\"Reduce hernia and perform isolated gastric fixation\",\"isCorrect\":false,\"rationale\":\"A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.\",\"distractorRationale\":\"A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.\"}],\"explanation\":\"For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.hiatal-fundoplication\",\"claim.owner-decisions.20261112.hiatal-fixation\"]}",
    "sourceNodeJson": "{\"id\":\"node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1\",\"questionVariantId\":\"question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2\",\"primaryConceptId\":\"concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1\",\"stem\":\"Which repair plan best fits {patientName}'s symptomatic type III hiatal hernia and completed reflux assessment?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.wrap\",\"label\":\"Reduce hernia, close hiatus and add fundoplication\",\"isCorrect\":true,\"rationale\":\"The defined hiatal anatomy, reflux findings and operative fitness support adding an antireflux component to reconstruction.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.no-wrap\",\"label\":\"Reduce hernia and close hiatus without a wrap\",\"isCorrect\":false,\"rationale\":\"This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.fix\",\"label\":\"Reduce hernia and perform isolated gastric fixation\",\"isCorrect\":false,\"rationale\":\"A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.\",\"teachingPoint\":\"For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.hiatal-repair.no-wrap\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.hiatal-repair.fix\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1\",\"displayName\":\"Owner review for Helen Carter\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.hiatal-repair.v1\",\"patientDisplayName\":\"Helen Carter\",\"prototypeDemographics\":{\"ageYears\":69,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Recurrent anemia\",\"presentation\":\"{patientName}, a 69-year-old woman, attends clinic to review outside foregut testing. Iron deficiency recurred despite acid suppression and iron replacement. Early satiety limits meals. Imaging confirms a type III hiatal (paraesophageal) hernia. Off-treatment monitoring documents pathologic acid exposure. Manometry shows normal junction relaxation, propagating contractions and augmentation with multiple rapid swallows. She reports comfortable swallowing, remains independent and has been assessed as fit for reconstruction.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.hiatal-repair.v1\",\"prototypeDemographics\":{\"ageYears\":69,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Recurrent anemia\",\"presentation\":\"{patientName}, a 69-year-old woman, attends clinic to review outside foregut testing. Iron deficiency recurred despite acid suppression and iron replacement. Early satiety limits meals. Imaging confirms a type III hiatal (paraesophageal) hernia. Off-treatment monitoring documents pathologic acid exposure. Manometry shows normal junction relaxation, propagating contractions and augmentation with multiple rapid swallows. She reports comfortable swallowing, remains independent and has been assessed as fit for reconstruction.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"],\"decisionNodes\":[{\"id\":\"node.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1\",\"questionVariantId\":\"question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2\",\"primaryConceptId\":\"concept.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1\",\"stem\":\"Which repair plan best fits {patientName}'s symptomatic type III hiatal hernia and completed reflux assessment?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.wrap\",\"label\":\"Reduce hernia, close hiatus and add fundoplication\",\"isCorrect\":true,\"rationale\":\"The defined hiatal anatomy, reflux findings and operative fitness support adding an antireflux component to reconstruction.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.no-wrap\",\"label\":\"Reduce hernia and close hiatus without a wrap\",\"isCorrect\":false,\"rationale\":\"This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.hiatal-repair.fix\",\"label\":\"Reduce hernia and perform isolated gastric fixation\",\"isCorrect\":false,\"rationale\":\"A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.\",\"teachingPoint\":\"For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.hiatal-repair.no-wrap\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"This leaves the documented reflux without the antireflux component supported by the conditional SAGES recommendation.\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.hiatal-repair.fix\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"A limited fixation strategy may suit a patient with prohibitive operative risk. Her current assessment supports a fuller repair.\",\"sourceLabels\":[\"SAGES hiatal-hernia surgical guideline (2024)\",\"WSES complicated diaphragmatic hernia position paper (2023)\"]}]}],\"learningSummary\":\"For this symptomatic type III hiatal hernia with documented reflux and acceptable operative fitness, the supported plan includes reduction, hiatal closure and fundoplication. SAGES bases its recommendation on low-certainty evidence, so the operative plan remains individualized.\"}",
    "questionSha256": "3008fc42c5e986ecdabeb22e5f277f25282b3422dc4e9dd84cf0d0537fededd1",
    "nodeSha256": "fb21cc7b0cf972ca5b35bbacea9cf0e5f5e435c1f33b9b3222c4cc15f73b4d29",
    "caseSha256": "bbb4568ba6c439470e38a7fe75db738ba9f2b8f7ea8376ee497a35078b64dd16",
    "review": {
      "path": "docs/research/question-owner-decisions-review-20261112.json",
      "record": {
        "id": "TOPIC-069",
        "variantId": "question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2",
        "verdict": "PASS",
        "difficulty": {
          "level": "Easy to moderate",
          "highYield": true,
          "rationale": "Tests adding reflux control to repair in a fit symptomatic patient with objective reflux and reassuring swallowing/motility findings. It does not test selection of a specific wrap or complex motility interpretation."
        },
        "clarityIssues": [
          "Minor: 'normal junction relaxation, propagating contractions and augmentation with multiple rapid swallows' is fairly technical for an item whose options only require deciding whether to add a wrap. It is clinically coherent but contributes reading burden."
        ],
        "cues": [
          {
            "severity": "Moderate but not disqualifying",
            "exactPhrases": [
              "fit for reconstruction",
              "Reduce hernia, close hiatus and add fundoplication",
              "without a wrap",
              "isolated gastric fixation"
            ],
            "attack": "The key sounds most comprehensive, while 'without' and 'isolated' label the alternatives as limited. A more-is-better heuristic favors it. However, a reader still needs the connection between fundoplication and the documented reflux; the choices represent real competing operative strategies."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: keeps fundoplication and explicitly names a 'type III hiatal (paraesophageal) hernia' in the presentation and hiatal hernia in the task.",
          "ownerStyle": "Pass: Helen Carter is a named 69-year-old woman; 'Recurrent anemia' is two words; the task completely asks for a repair plan in the stated reflux context.",
          "oneDefensibleBestAnswer": true,
          "assessment": "The documented reflux, acceptable operative fitness and absence of a stated swallowing/motility contraindication make repair with fundoplication the best listed plan. The conditional recommendation does not make every individualized alternative equally best for this constructed patient. The explanation correctly acknowledges low certainty and individualized planning.",
          "evidenceSourceIds": [
            "source.esophagus-gerd-barrett-hiatal.sages-hiatal-2024",
            "source.esophagus-gerd-barrett-hiatal.wses-diaphragmatic-2023"
          ],
          "evidenceLimitations": "SAGES is the principal elective-repair support and is recorded as conditional/low certainty. WSES concerns the acute setting and offers a limited cross-check, not an independent high-certainty elective mandate. No external source authentication was performed."
        },
        "suggestions": [
          "Optional cue polish: express alternatives as neutrally named procedures instead of emphasizing 'without' and 'isolated', while keeping their operative content unambiguous.",
          "Retain the conditional-evidence qualification; do not turn the feedback into a universal rule that every hiatal repair requires fundoplication.",
          "Do not infer a proven source of anemia or a mandatory specific wrap from the supplied data."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "G04-R",
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "questionVariantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2\",\"conceptId\":\"concept.early-pregnancy.location-before-disposition.v1\",\"stem\":\"Which same-day diagnostic plan should be prioritized for {patientName}'s focal pain and bleeding despite the falling serum hCG?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.localize\",\"label\":\"Transvaginal ultrasound with gynecologic assessment\",\"isCorrect\":true,\"rationale\":\"A hormonal decline does not identify the implantation site. Prompt focused pelvic imaging and specialty review address the unresolved pregnancy complication.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.appendix\",\"label\":\"Appendiceal magnetic resonance imaging with general-surgical assessment\",\"isCorrect\":false,\"rationale\":\"The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.\",\"distractorRationale\":\"The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.\"},{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.aspirate\",\"label\":\"Diagnostic uterine aspiration with histopathologic assessment\",\"isCorrect\":false,\"rationale\":\"The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.\",\"distractorRationale\":\"The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.\"}],\"explanation\":\"Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.pregnancy-hcg-location\",\"claim.owner-decisions.20261112.pregnancy-symptomatic-localization\",\"claim.owner-decisions.20261112.pregnancy-aspiration-limit\"]}",
    "sourceNodeJson": "{\"id\":\"node.gs028f.gynecology.c1-late-period.1\",\"questionVariantId\":\"question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2\",\"primaryConceptId\":\"concept.early-pregnancy.location-before-disposition.v1\",\"stem\":\"Which same-day diagnostic plan should be prioritized for {patientName}'s focal pain and bleeding despite the falling serum hCG?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.localize\",\"label\":\"Transvaginal ultrasound with gynecologic assessment\",\"isCorrect\":true,\"rationale\":\"A hormonal decline does not identify the implantation site. Prompt focused pelvic imaging and specialty review address the unresolved pregnancy complication.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.appendix\",\"label\":\"Appendiceal magnetic resonance imaging with general-surgical assessment\",\"isCorrect\":false,\"rationale\":\"The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.aspirate\",\"label\":\"Diagnostic uterine aspiration with histopathologic assessment\",\"isCorrect\":false,\"rationale\":\"The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.\",\"teachingPoint\":\"Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.pregnancy-location.appendix\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.pregnancy-location.aspirate\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.gs028f.gynecology.c1-late-period\",\"displayName\":\"Owner review for Ava Bennett\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.pregnancy-location.v1\",\"patientDisplayName\":\"Ava Bennett\",\"prototypeDemographics\":{\"ageYears\":24,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Pelvic pain and spotting\",\"presentation\":\"{patientName}, a 24-year-old woman, returns to clinic with persistent right lower abdominal pain and vaginal spotting. Serum hCG is detectable and has fallen between two measurements. Her blood pressure and pulse are within the clinic's normal ranges. Examination shows focal right lower-quadrant tenderness without generalized rigidity. A limited transabdominal study shows an empty uterine cavity, does not resolve the adnexa separately and does not visualize the appendix. No earlier scan has confirmed an intrauterine pregnancy.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.pregnancy-location.v1\",\"prototypeDemographics\":{\"ageYears\":24,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Pelvic pain and spotting\",\"presentation\":\"{patientName}, a 24-year-old woman, returns to clinic with persistent right lower abdominal pain and vaginal spotting. Serum hCG is detectable and has fallen between two measurements. Her blood pressure and pulse are within the clinic's normal ranges. Examination shows focal right lower-quadrant tenderness without generalized rigidity. A limited transabdominal study shows an empty uterine cavity, does not resolve the adnexa separately and does not visualize the appendix. No earlier scan has confirmed an intrauterine pregnancy.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"],\"decisionNodes\":[{\"id\":\"node.gs028f.gynecology.c1-late-period.1\",\"questionVariantId\":\"question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2\",\"primaryConceptId\":\"concept.early-pregnancy.location-before-disposition.v1\",\"stem\":\"Which same-day diagnostic plan should be prioritized for {patientName}'s focal pain and bleeding despite the falling serum hCG?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.localize\",\"label\":\"Transvaginal ultrasound with gynecologic assessment\",\"isCorrect\":true,\"rationale\":\"A hormonal decline does not identify the implantation site. Prompt focused pelvic imaging and specialty review address the unresolved pregnancy complication.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.appendix\",\"label\":\"Appendiceal magnetic resonance imaging with general-surgical assessment\",\"isCorrect\":false,\"rationale\":\"The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.pregnancy-location.aspirate\",\"label\":\"Diagnostic uterine aspiration with histopathologic assessment\",\"isCorrect\":false,\"rationale\":\"The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.\",\"teachingPoint\":\"Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.pregnancy-location.appendix\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The appendix may still require evaluation, but this route leaves the simultaneously unlocated symptomatic pregnancy unresolved.\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.pregnancy-location.aspirate\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"The record has not established an intrauterine loss. Focused imaging and gynecologic review should guide the next diagnostic step.\",\"sourceLabels\":[\"Early pregnancy loss\",\"Ectopic pregnancy - Diagnosis\"]}]}],\"learningSummary\":\"Falling hCG does not locate a pregnancy or exclude an ectopic pregnancy. Persistent focal pain and spotting warrant same-day transvaginal ultrasound and gynecologic assessment. The specialist team must arrange follow-up if the location remains uncertain.\"}",
    "questionSha256": "1f737397845c0bc58913df0f3f332b977f77048469bf5bffb47b46871bafb64b",
    "nodeSha256": "f61a6f7013ec786595b7db03caf9d803d745fd5b37aa72af2fdf3b107f6c2306",
    "caseSha256": "3d6891806556346ce87edefe731c215b173c2c575a7aa5af60c49d19da0f69ae",
    "review": {
      "path": "docs/research/question-owner-decisions-review-20261112.json",
      "record": {
        "id": "G04-R",
        "variantId": "question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2",
        "verdict": "PASS",
        "difficulty": {
          "level": "Moderate",
          "highYield": true,
          "rationale": "Tests persistent ectopic-pregnancy concern despite falling hCG and apparent stability, while presenting a plausible competing appendiceal workup and a premature invasive uterine procedure."
        },
        "clarityIssues": [
          "Minor: 'does not resolve the adnexa separately' is less direct than saying the adnexa were not adequately visualized. The intended limitation is nevertheless understandable."
        ],
        "cues": [
          {
            "severity": "Low",
            "exactPhrases": [
              "despite the falling serum hCG",
              "No earlier scan has confirmed an intrauterine pregnancy",
              "Transvaginal ultrasound with gynecologic assessment",
              "Diagnostic uterine aspiration with histopathologic assessment"
            ],
            "attack": "'Despite' signals that the falling hormone is not reassuring, and vaginal symptoms favor a gynecologic route. Neither clue alone distinguishes focused imaging from uterine aspiration. All options pair a diagnostic procedure with an assessment, without an explanatory qualifier attached only to the key."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: implements the harder symptomatic falling-hCG replacement keyed to transvaginal ultrasound plus gynecologic assessment. The easy serum-hCG item's retirement is assigned to integration and is not proven by this content packet.",
          "ownerStyle": "Pass: Ava Bennett is a named 24-year-old woman; 'Pelvic pain and spotting' is four words; the task fully specifies a same-day diagnostic priority for her pain, bleeding and falling hCG.",
          "oneDefensibleBestAnswer": true,
          "assessment": "The symptomatic pregnancy remains unlocated after limited transabdominal imaging. TVUS with gynecologic assessment is the best first listed plan. Appendiceal disease remains possible but does not resolve the pregnancy risk; uterine aspiration is premature as the first localization step in this record. The explanation appropriately preserves follow-up if imaging remains inconclusive rather than promising a definitive scan.",
          "evidenceSourceIds": [
            "source.gs028f.qld.early-pregnancy-loss.2025",
            "source.gs028f.nhs.ectopic-pregnancy.2022"
          ],
          "evidenceLimitations": "Queensland supplies the principal recorded support; NHS is a modality cross-check whose overdue review date is disclosed. No exact hCG discriminatory threshold, decline rate or scan-result guarantee is introduced. Offline packet review only."
        },
        "suggestions": [
          "Optional wording edit: state directly that the adnexa were not adequately visualized.",
          "Preserve the need for specialist follow-up after an inconclusive TVUS and the distinction between a diagnostic priority and exclusion of appendicitis.",
          "Manager acceptance should separately confirm retirement of the easy pregnancy-screening version and runtime wait estimates for all three diagnostic choices."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "F13",
    "caseId": "case.topic.perioperative-risk-recovery.awake-gas.v3",
    "nodeId": "node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3",
    "questionVariantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4\",\"conceptId\":\"concept.preoperative-osa.awake-ventilation-assessment.v1\",\"stem\":\"Which investigation should clarify the significance of {patientName}'s persistently raised serum bicarbonate before major surgery?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.awake-gas.gas\",\"label\":\"Arterial blood gas analysis\",\"isCorrect\":true,\"rationale\":\"A daytime arterial sample directly measures carbon dioxide and can establish whether awake hypercapnia is present.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.awake-gas.polysomnography\",\"label\":\"Attended laboratory polysomnography\",\"isCorrect\":false,\"rationale\":\"This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.\",\"distractorRationale\":\"This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.\"},{\"id\":\"choice.owner-decisions.20261112.awake-gas.oximetry\",\"label\":\"Overnight pulse oximetry\",\"isCorrect\":false,\"rationale\":\"Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.\",\"distractorRationale\":\"Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.\"}],\"explanation\":\"Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.ohs-awake-gas\",\"claim.owner-decisions.20261112.ohs-sleep-study-role\"]}",
    "sourceNodeJson": "{\"id\":\"node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3\",\"questionVariantId\":\"question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4\",\"primaryConceptId\":\"concept.preoperative-osa.awake-ventilation-assessment.v1\",\"stem\":\"Which investigation should clarify the significance of {patientName}'s persistently raised serum bicarbonate before major surgery?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.awake-gas.gas\",\"label\":\"Arterial blood gas analysis\",\"isCorrect\":true,\"rationale\":\"A daytime arterial sample directly measures carbon dioxide and can establish whether awake hypercapnia is present.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.awake-gas.polysomnography\",\"label\":\"Attended laboratory polysomnography\",\"isCorrect\":false,\"rationale\":\"This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.awake-gas.oximetry\",\"label\":\"Overnight pulse oximetry\",\"isCorrect\":false,\"rationale\":\"Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.\",\"teachingPoint\":\"Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.awake-gas.polysomnography\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.awake-gas.oximetry\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.topic.perioperative-risk-recovery.awake-gas.v3\",\"displayName\":\"Owner review for Aaron Patel\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.awake-gas.v2\",\"patientDisplayName\":\"Aaron Patel\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Preoperative breathing review\",\"presentation\":\"{patientName}, a 49-year-old man with obesity, attends clinic before major abdominal surgery. His partner reports loud snoring and repeated pauses in breathing during sleep. Serum bicarbonate is raised on repeated measurements. He reports no vomiting, takes no diuretic and has no known chronic lung or neuromuscular disease. He is comfortable and alert at the visit.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.awake-gas.v2\",\"prototypeDemographics\":{\"ageYears\":49,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Preoperative breathing review\",\"presentation\":\"{patientName}, a 49-year-old man with obesity, attends clinic before major abdominal surgery. His partner reports loud snoring and repeated pauses in breathing during sleep. Serum bicarbonate is raised on repeated measurements. He reports no vomiting, takes no diuretic and has no known chronic lung or neuromuscular disease. He is comfortable and alert at the visit.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":0,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"],\"decisionNodes\":[{\"id\":\"node.topic.perioperative-risk-recovery.awake-ventilation-assessment.v3\",\"questionVariantId\":\"question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4\",\"primaryConceptId\":\"concept.preoperative-osa.awake-ventilation-assessment.v1\",\"stem\":\"Which investigation should clarify the significance of {patientName}'s persistently raised serum bicarbonate before major surgery?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.awake-gas.gas\",\"label\":\"Arterial blood gas analysis\",\"isCorrect\":true,\"rationale\":\"A daytime arterial sample directly measures carbon dioxide and can establish whether awake hypercapnia is present.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.awake-gas.polysomnography\",\"label\":\"Attended laboratory polysomnography\",\"isCorrect\":false,\"rationale\":\"This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.awake-gas.oximetry\",\"label\":\"Overnight pulse oximetry\",\"isCorrect\":false,\"rationale\":\"Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.\",\"teachingPoint\":\"Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.awake-gas.polysomnography\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"This evaluates sleep-disordered breathing but does not settle the immediate question of awake arterial carbon dioxide.\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.awake-gas.oximetry\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Nocturnal saturation can describe desaturation but cannot determine whether daytime arterial hypercapnia is present.\",\"sourceLabels\":[\"ATS obesity hypoventilation syndrome guideline\"]}]}],\"learningSummary\":\"Obesity, sleep-disordered breathing and persistently raised bicarbonate raise concern for obesity hypoventilation syndrome. Obtain an awake arterial blood gas to measure carbon dioxide. Sleep testing remains part of the wider assessment. Bicarbonate alone does not confirm awake hypoventilation.\"}",
    "questionSha256": "ef1192c2b4e2487391ac1c76abda31a6933fceb8081f3938d95de03a5b81a443",
    "nodeSha256": "7d1ecc10f2261cace730259eb0549b97a6e620c346a1b0a722cb55578693fe7a",
    "caseSha256": "30fddff92e1672c236a040a3829adae4d5a7b7750e0c1473e5f45dbbaf3477d7",
    "review": {
      "path": "docs/research/question-owner-decisions-review2-20261112.json",
      "record": {
        "id": "F13",
        "variantId": "question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4",
        "verdict": "PASS",
        "difficulty": {
          "level": "Moderate clinical application",
          "highYield": true,
          "rationale": "Requires connecting obesity, sleep-disordered breathing and unexplained persistent bicarbonate elevation to possible chronic hypoventilation, then distinguishing carbon-dioxide measurement from sleep and oxygen-saturation testing."
        },
        "clarityIssues": [],
        "cues": [
          {
            "severity": "Low residual",
            "exactPhrases": [
              "persistently raised serum bicarbonate",
              "Arterial blood gas analysis",
              "Attended laboratory polysomnography",
              "Overnight pulse oximetry",
              "He is comfortable and alert at the visit."
            ],
            "attack": "A reader might associate a serum abnormality with the only option explicitly saying 'blood', or choose that option as the odd modality. Neither is the former deterministic awake-versus-overnight exclusion. There is no awake/daytime target in the pre-answer text, and comfort and alertness do not logically rule out sleep studies. Recognizing why the bicarbonate pattern calls for carbon-dioxide assessment still supplies the clinical discrimination."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: retains explicit obesity, witnessed sleep-disordered breathing and repeatedly raised bicarbonate; keys arterial blood gas; retains polysomnography and overnight oximetry as the owner-requested distractors. Suspected awake hypoventilation is explained after selection rather than handed to the learner in the task.",
          "ownerStyle": "Pass: Aaron Patel is a named 49-year-old man at a preoperative clinic visit; 'Preoperative breathing review' has three words; the task completely asks which investigation clarifies his persistent bicarbonate elevation before major surgery.",
          "oneDefensibleBestAnswer": true,
          "assessment": "Within the stated pattern, ABG is the best listed investigation to determine whether arterial hypercapnia explains the biochemical finding. Polysomnography remains useful for the wider sleep-disordered-breathing assessment, while overnight oximetry cannot answer the arterial carbon-dioxide question. Feedback correctly avoids diagnosing OHS from bicarbonate alone. No unsupported numeric cutoff is introduced. JSON and Markdown agree.",
          "priorReviewResolution": [
            "The prior clarity/cue problem is addressed: the task asks about the significance of persistent bicarbonate elevation, not possible awake hypoventilation.",
            "Both prior cue findings addressed: repeated awake wording is absent before the answer, and redundant overnight wording is removed from polysomnography without changing either requested distractor modality.",
            "All four prior suggestions addressed: the clinical pattern and ABG key remain; the task is reframed; awake carbon-dioxide physiology and the continuing role of sleep testing appear in feedback; a fresh wording-only attack no longer yields the former temporal-elimination solution."
          ],
          "evidenceSourceIds": [
            "source.perioperative-risk-recovery.ats-ohs-2019"
          ],
          "evidenceClaimIds": [
            "claim.owner-decisions.20261112.ohs-awake-gas",
            "claim.owner-decisions.20261112.ohs-sleep-study-role"
          ],
          "evidenceLimitations": "The packet records a single ATS guideline with conditional recommendations and very low-certainty evidence, used for targeted factual verification under retained copyright. This review inspected its recorded support and limitations without network access; it did not authenticate or update the guideline. The conclusion is limited to the supplied clinical context and listed alternatives, not any isolated bicarbonate elevation. PASS is not exact-version clinician approval."
        },
        "suggestions": [
          "No blocking revision. Preserve the distinction between suspicion, measurement of awake hypercapnia and the broader OHS assessment.",
          "All three choices have test timing-profile references in the JSON. Actual display of runtime wait estimates was outside this document-only review."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  },
  {
    "ownerId": "G07",
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.owner-decisions.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.ptld.tissue-diagnosis-coordination.v4.r4\",\"conceptId\":\"concept.ptld.node-specimen-and-ancillary-handling.v1\",\"stem\":\"Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-split\",\"label\":\"Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue\",\"isCorrect\":true,\"rationale\":\"Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.\",\"distractorRationale\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.core-split\",\"label\":\"Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue\",\"isCorrect\":false,\"rationale\":\"Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.\",\"distractorRationale\":\"Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.\"},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-fixed\",\"label\":\"Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies\",\"isCorrect\":false,\"rationale\":\"Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.\",\"distractorRationale\":\"Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.\"},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.core-fixed\",\"label\":\"Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies\",\"isCorrect\":false,\"rationale\":\"This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.\",\"distractorRationale\":\"This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.\"}],\"explanation\":\"Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.\",\"supportingEvidenceClaimIds\":[\"claim.owner-decisions.20261112.ptld-architecture\",\"claim.owner-decisions.20261112.ptld-fresh-flow\",\"claim.owner-decisions.20261112.ptld-fixed-histology\"]}",
    "sourceNodeJson": "{\"id\":\"node.gs028b.ptld.b-pathology-returned.1\",\"questionVariantId\":\"question.ptld.tissue-diagnosis-coordination.v4.r4\",\"primaryConceptId\":\"concept.ptld.node-specimen-and-ancillary-handling.v1\",\"stem\":\"Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-split\",\"label\":\"Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue\",\"isCorrect\":true,\"rationale\":\"Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.core-split\",\"label\":\"Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue\",\"isCorrect\":false,\"rationale\":\"Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-fixed\",\"label\":\"Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies\",\"isCorrect\":false,\"rationale\":\"Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.core-fixed\",\"label\":\"Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies\",\"isCorrect\":false,\"rationale\":\"This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.\",\"teachingPoint\":\"Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.ptld-biopsy.core-split\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-fixed\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.ptld-biopsy.core-fixed\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.gs028b.ptld.b-pathology-returned\",\"displayName\":\"Owner review for Nora Reed\",\"patientPresentationVariantId\":\"presentation.owner-decisions.20261112.ptld-biopsy.v2\",\"patientDisplayName\":\"Nora Reed\",\"prototypeDemographics\":{\"ageYears\":43,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Enlarging neck node\",\"presentation\":\"{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk. The team can discuss specimen allocation with the receiving hematopathology service before the procedure.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.owner-decisions.20261112.ptld-biopsy.v2\",\"prototypeDemographics\":{\"ageYears\":43,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Enlarging neck node\",\"presentation\":\"{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk. The team can discuss specimen allocation with the receiving hematopathology service before the procedure.\"}],\"tutorialEligible\":false,\"routineEligible\":true,\"earliestFacilityStage\":1,\"requiredClinicalSetting\":\"clinic\",\"requiredCapabilityIds\":[],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"],\"decisionNodes\":[{\"id\":\"node.gs028b.ptld.b-pathology-returned.1\",\"questionVariantId\":\"question.ptld.tissue-diagnosis-coordination.v4.r4\",\"primaryConceptId\":\"concept.ptld.node-specimen-and-ancillary-handling.v1\",\"stem\":\"Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?\",\"answerChoices\":[{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-split\",\"label\":\"Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue\",\"isCorrect\":true,\"rationale\":\"Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.core-split\",\"label\":\"Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue\",\"isCorrect\":false,\"rationale\":\"Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-fixed\",\"label\":\"Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies\",\"isCorrect\":false,\"rationale\":\"Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.\",\"serviceRequest\":null},{\"id\":\"choice.owner-decisions.20261112.ptld-biopsy.core-fixed\",\"label\":\"Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies\",\"isCorrect\":false,\"rationale\":\"This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.\",\"teachingPoint\":\"Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.owner-decisions.20261112.ptld-biopsy.core-split\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.ptld-biopsy.excision-fixed\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"]},{\"answerChoiceId\":\"choice.owner-decisions.20261112.ptld-biopsy.core-fixed\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the decision and its clinical explanation.\",\"clinicalRationale\":\"This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.\",\"sourceLabels\":[\"Comprehensive review of PTLD after solid organ transplantation\",\"Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas\"]}]}],\"learningSummary\":\"Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.\"}",
    "questionSha256": "31c25ad22a7d4029e479d0c142a7a49af5aa8ea56a60adf5b155b09a116bfd0b",
    "nodeSha256": "5dbbebfa48f98988cd0dee5ccea495fce73446682148faea0462be42417a3434",
    "caseSha256": "9eccdfd118cee1c19d6ae521c4249034d143415f2e458ef9710b3773eff55667",
    "review": {
      "path": "docs/research/question-owner-decisions-review2-20261112.json",
      "record": {
        "id": "G07",
        "variantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
        "verdict": "PASS",
        "difficulty": {
          "level": "Easy to moderate procedural application",
          "highYield": true,
          "rationale": "The failed core and accessible node make excision relatively straightforward. Selecting fresh and fixed material still tests useful specimen-handling knowledge after removal of the explicit unfixed instruction and failed-flow detail."
        },
        "clarityIssues": [
          "Minor stale feedback: 'the requested flow analysis' and 'both represented adequacy concerns' sound as though a flow request or second documented sampling failure was supplied before selection. The revised stem documents only inadequate architecture. The preferred plan remains clear, but these phrases should describe preservation of ancillary-testing capability rather than a previously stated failed or requested test."
        ],
        "cues": [
          {
            "severity": "Moderate residual; reduced from the prior blocking combination",
            "exactPhrases": [
              "An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification.",
              "The team can discuss specimen allocation with the receiving hematopathology service before the procedure.",
              "fresh flow-cytometry tissue plus fixed histology tissue",
              "whole-specimen formalin fixation for paraffin-based studies"
            ],
            "attack": "A nonmedical reader can reject repeating a named failed core and may then prefer the plan offering two tissue uses, especially after 'specimen allocation'. That is a residual comprehensiveness heuristic, not direct matching to an instruction to send unfixed tissue. Neither fresh transport nor a failed flow test is disclosed in the stem. The complete two-by-two structure gives both biopsy methods both handling strategies; choosing between the remaining excision options requires knowing the value of fresh material, unless guessed."
          }
        ],
        "fairness": {
          "ownerDirection": "Faithful: keys excisional lymph-node biopsy with fresh tissue for flow cytometry and fixed tissue for histology. Feedback places allocation with the receiving hematopathology service under its agreed protocol, implementing the owner's split-specimen direction without implying arbitrary surgical division.",
          "ownerStyle": "Pass: Nora Reed is a named 43-year-old woman attending clinic; 'Enlarging neck node' has three words; the task completely requests both the next biopsy and specimen-handling plan and spells out post-transplant lymphoproliferative disorder.",
          "oneDefensibleBestAnswer": true,
          "assessment": "After inadequate core architecture, an accessible superficial node and acceptable operative risk favor excision. Coordinated fresh/fixed allocation retains both architecture and the opportunity for fresh-cell ancillary testing. A repeat core may be reasonable when excision is unsuitable, but those circumstances are not stated here. Whole-node fixation can still yield diagnostic histology; it is less suitable than planned allocation, not universally incapable of diagnosing PTLD. The explanation correctly leaves viability and diagnostic adequacy to laboratory assessment. JSON and Markdown agree.",
          "priorReviewResolution": [
            "Both prior clarity findings addressed: the laboratory explicitly allocates tissue under its agreed protocol, and the disease name is expanded in the task.",
            "The prior high combined cue is addressed: inadequate architecture and safe accessibility are retained for fairness, while the pre-answer unfixed-specimen instruction is removed and appears only in feedback.",
            "The prior failed-flow phrase-matching cue is addressed by removing the failed-flow/nonviable-suspension detail from the presentation.",
            "All four prior suggestions addressed: fair excision context, neutral coordination availability, explicit laboratory allocation in feedback and retention of the two-by-two options. The new cue attack finds residual heuristic assistance but no direct textual solution to both dimensions."
          ],
          "evidenceSourceIds": [
            "source.ptld.frontiers-review-2026",
            "source.owner-decisions.20261112.rcpath-lymphoma-2015"
          ],
          "evidenceClaimIds": [
            "claim.owner-decisions.20261112.ptld-architecture",
            "claim.owner-decisions.20261112.ptld-fresh-flow",
            "claim.owner-decisions.20261112.ptld-fixed-histology"
          ],
          "evidenceLimitations": "The packet records a CC BY narrative PTLD review and an RCPath technical guideline used for targeted verification. Fresh-flow handling has a single 2015 technical source listed as under review; the local laboratory protocol remains an essential qualification. No network authentication or fresh currency check was performed. PASS does not promote this successor from needs_clinician_review or constitute named-clinician approval."
        },
        "suggestions": [
          "Optional feedback cleanup: replace 'needed for the requested flow analysis' with 'needed if flow cytometry is performed', and describe the core/fixed option as repeating limited sampling while forfeiting fresh ancillary material. Do not imply a second documented failure that the revised stem no longer contains.",
          "No blocking revision. Retain the local-protocol and viability qualifications; do not claim fresh allocation guarantees a diagnostic result or that fixation makes all PTLD assessment impossible.",
          "All four choices reference the biopsy timing profile. Runtime timing display and answer randomization were not exercised in this review."
        ]
      }
    },
    "sourceFiles": [
      {
        "path": "packages/clinical-content/src/question-owner-decisions-20261112.ts",
        "sha256": "09e54a34e45fa0cbb249d154686f784e8cb7bb9c97314e620224c0271da512b6"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.json",
        "sha256": "422841b6d09899c294bd7344829ab112264fa36c7d4054db37cc8369ba49907d"
      },
      {
        "path": "docs/research/question-owner-decisions-20261112.md",
        "sha256": "40b74ab6996de5cc836b6a48758fbcb6c33650e2e63e7307bdc7d1794cb53be2"
      },
      {
        "path": "docs/research/owner-decision-answers-20261112.md",
        "sha256": "6d58e11e4049b5bfa41e1d7dce73804bc2c40b6694ace2d78280a41bea3a473a"
      },
      {
        "path": "docs/research/question-owner-decisions-review-20261112.json",
        "sha256": "e22f31d75fe17ae618569c927ea164154e1e30226b3a54dad904ec76ef6ecb65"
      },
      {
        "path": "docs/research/question-owner-decisions-review2-20261112.json",
        "sha256": "376f367038e325ac4919395f7601d12c0600b5242eb83ca0eeb7f075ab694c97"
      }
    ]
  }
];
export const PROGRAM_BATCH8_LENGTH_RESIDUALS = [];
export const PROGRAM_BATCH8_CLAIMS:EvidenceClaim[] = [
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.plain-gap",
    "statement": "The potassium-excluding serum anion gap is sodium minus the sum of chloride and bicarbonate.",
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "Single adequate source for this claim. The laboratory comparison and potassium convention must be stated. Constructed specimen values are arithmetic exercises.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.albumin-lowers-gap",
    "statement": "Hypoalbuminemia lowers the measured anion gap and can conceal an additional unmeasured-acid component.",
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. One expert-panel guideline supports the qualitative interpretation. This packet teaches no albumin-adjustment equation or adjusted value.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.gap-trend-limit",
    "statement": "A fall in the uncorrected gap during a fall in albumin cannot establish that an unmeasured-acid process has resolved.",
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. Qualitative application to constructed serial specimens. A precise acid burden or etiology cannot be inferred from this comparison.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.mh-family-risk",
    "statement": "An uninformative negative gene panel in a person with a confirmed affected first-degree relative leaves malignant-hyperthermia susceptibility unresolved.",
    "sourceIds": [
      "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. An earlier uneventful anesthetic also does not establish absence of susceptibility. Specialist assessment and testing remain appropriate.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.mh-trigger-free",
    "statement": "Suspected or confirmed malignant-hyperthermia susceptibility calls for a trigger-free anesthetic plan.",
    "sourceIds": [
      "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
      "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Volatile anesthetics and succinylcholine are triggering agents. Drug doses and universal facility admission criteria are outside this item.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.mh-readiness",
    "statement": "An anesthetizing facility caring for an MH-susceptible patient needs a prepared workstation, dantrolene access and staff equipped to recognize and treat an MH crisis.",
    "sourceIds": [
      "source.owner-decisions.20261112.mhaus-pretesting-2018",
      "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Formal transfer arrangements also form part of MHAUS ambulatory preparedness. No exact stock quantity or retrieval time is taught.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.mh-testing-sequence",
    "statement": "A properly prepared team can provide nontriggering anesthesia before definitive MH susceptibility testing is completed.",
    "sourceIds": [
      "source.owner-decisions.20261112.mhaus-pretesting-2018",
      "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Clinical and facility suitability require anesthesia assessment.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.mh-prophylaxis",
    "statement": "Routine prophylactic dantrolene is discouraged when an MH-susceptible patient receives nontriggering anesthesia.",
    "sourceIds": [
      "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
      "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Crisis treatment and prophylactic administration are separate decisions.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.mh-dantrolene",
    "statement": "Dantrolene is the MH-specific crisis medication that must be available in the anesthetizing setting prepared to care for an MH-susceptible patient.",
    "sourceIds": [
      "source.anesthesia-analgesia-pharmacology.emhg-crisis-2024",
      "source.owner-decisions.20261112.mhaus-pretesting-2018",
      "source.anesthesia-analgesia-pharmacology.jsa-mh-2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Medication readiness. No dose, administration schedule or facility inventory quantity is taught.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.crohn-postoperative-scope",
    "statement": "After Crohn resection, postoperative endoscopic assessment evaluates mucosal recurrence even when symptoms are controlled.",
    "sourceIds": [
      "source.bowel-ibd-malabsorption-short-bowel.ecco-crohn-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. ECCO recommends surveillance within 6-12 months. The constructed eight-month visit falls within that sourced interval.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.crohn-marker-discordance",
    "statement": "Persistently elevated inflammatory biomarkers during symptomatic Crohn remission can warrant endoscopic clarification before empiric treatment escalation.",
    "sourceIds": [
      "source.bowel-ibd-malabsorption-short-bowel.aga-crohn-biomarkers-2023",
      "source.bowel-ibd-malabsorption-short-bowel.ecco-crohn-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "AGA recommendations are conditional. The prior examination failed to reach the postoperative ileal and anastomotic sites.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.crohn-incomplete-exam",
    "statement": "An examination ending at the splenic flexure leaves the ileocolic anastomosis and neoterminal ileum unassessed.",
    "sourceIds": [
      "source.bowel-ibd-malabsorption-short-bowel.ecco-crohn-2024",
      "source.bowel-ibd-malabsorption-short-bowel.aga-crohn-biomarkers-2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "high",
    "limitation": "Anatomic application to the constructed procedure. Normal distal biopsies cannot report unexamined sites.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.rectal-negative-biopsy",
    "statement": "A superficial negative biopsy after rectal neoadjuvant treatment can coexist with residual tumor in the rectal wall.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-rectal-supplement-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. Existing repository atomic alignment retained. The official introduction and citation were retrieved, while the full-text endpoint returned HTTP 403. The earlier full-text claim was reused without a new full-text verification.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.rectal-residual-surgery",
    "statement": "Progressive concordant palpable and MRI evidence of residual rectal cancer in a fit patient supports oncologic resection.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-rectal-supplement-2023",
      "source.colorectal-polyps-cancer.nci-rectal-pdq"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This constructed residual-disease scenario differs from an equivocal shrinking response. Exact response classification requires clinician review.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.rectal-watch-selection",
    "statement": "Watch-and-wait management is an option for selected patients with a clinical complete response under an experienced surveillance program.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-rectal-supplement-2023",
      "source.colorectal-polyps-cancer.nci-rectal-pdq"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Progressive mural disease does not meet that response description.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.rectal-operations",
    "statement": "For low rectal cancer, low anterior resection and abdominoperineal resection are both operations that incorporate total mesorectal excision.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.nci-rectal-pdq"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "high",
    "limitation": "Single adequate source for this claim. Operation selection depends on tumor extent, sphincter involvement and margin feasibility. Upper rectal operations can use a different extent of mesorectal excision.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.hiatal-fundoplication",
    "statement": "Fundoplication can be added during type II-IV hiatal hernia repair to improve reflux control.",
    "sourceIds": [
      "source.esophagus-gerd-barrett-hiatal.sages-hiatal-2024",
      "source.esophagus-gerd-barrett-hiatal.wses-diaphragmatic-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "SAGES gives a conditional recommendation with low-certainty evidence. WSES is an acute-setting cross-check whose applicability to elective repair is limited.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.hiatal-fixation",
    "statement": "Gastric fixation is a limited alternative in selected patients whose condition makes a more extensive paraesophageal hernia repair unsuitable.",
    "sourceIds": [
      "source.esophagus-gerd-barrett-hiatal.wses-diaphragmatic-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Single adequate source for this claim. This constructed patient is fit for planned reconstruction and has documented pathologic reflux.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.pregnancy-hcg-location",
    "statement": "A falling serum hCG concentration cannot establish the location of an early pregnancy.",
    "sourceIds": [
      "source.gs028f.qld.early-pregnancy-loss.2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Single adequate source for this claim. Falling values can occur in an ectopic pregnancy. No discriminatory hCG value or rate-of-fall rule is used.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.pregnancy-symptomatic-localization",
    "statement": "Persistent focal pain and bleeding with an unlocated early pregnancy require prompt gynecologic assessment and transvaginal ultrasound.",
    "sourceIds": [
      "source.gs028f.qld.early-pregnancy-loss.2025",
      "source.gs028f.nhs.ectopic-pregnancy.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "The patient is hemodynamically stable. Instability requires emergency care. An inconclusive scan requires specialist follow-up.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.pregnancy-aspiration-limit",
    "statement": "An empty uterine cavity on a limited transabdominal study does not establish a completed intrauterine miscarriage.",
    "sourceIds": [
      "source.gs028f.qld.early-pregnancy-loss.2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. Uterine aspiration is not the first localization step in this constructed stable presentation.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.ohs-awake-gas",
    "statement": "Obesity with sleep-disordered breathing and unexplained elevated bicarbonate warrants direct assessment of awake arterial carbon dioxide when hypoventilation is suspected.",
    "sourceIds": [
      "source.perioperative-risk-recovery.ats-ohs-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Single adequate source for this claim. Single adequate guideline. ATS recommendation is conditional with very low-certainty evidence. Elevated bicarbonate raises suspicion without confirming the diagnosis. No new numeric cutoff is used.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.ohs-sleep-study-role",
    "statement": "Sleep studies characterize sleep-disordered breathing, while daytime arterial gas measurement determines whether awake hypercapnia is present.",
    "sourceIds": [
      "source.perioperative-risk-recovery.ats-ohs-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. A sleep study may still be needed. Overnight oxygen saturation alone cannot measure daytime arterial carbon dioxide.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.ptld-architecture",
    "statement": "Excisional biopsy of a surgically accessible lymph node provides architecture useful for classifying suspected PTLD.",
    "sourceIds": [
      "source.ptld.frontiers-review-2026",
      "source.owner-decisions.20261112.rcpath-lymphoma-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Excision is favored when operative risk is acceptable. A planned core biopsy remains an alternative when excision poses excess risk.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.ptld-fresh-flow",
    "statement": "A planned fresh tissue portion preserves material for flow cytometry during lymphoid tissue assessment.",
    "sourceIds": [
      "source.owner-decisions.20261112.rcpath-lymphoma-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate source for this claim. One technical guideline published in 2015 and listed as under review. Follow an agreed hematopathology protocol. Fresh allocation does not guarantee cell viability or conclusive flow results.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.owner-decisions.20261112.ptld-fixed-histology",
    "statement": "A formalin-fixed tissue portion permits histologic assessment of lymphoid architecture.",
    "sourceIds": [
      "source.owner-decisions.20261112.rcpath-lymphoma-2015",
      "source.ptld.frontiers-review-2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Retain adequate material for histology and ancillary testing. Fixing the entire specimen forfeits the planned fresh portion.",
    "applicablePopulation": "Adults in the stated surgical teaching context",
    "lastCheckedOn": "2026-11-12"
  }
];
export const PROGRAM_BATCH8_SOURCES:Array<ClinicalSource & {verification?:unknown}> = [
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.french-panel.metabolic-acidosis.2019",
    "title": "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel",
    "completeCitation": "Jung B, Martinez M, Claessens YE, Darmon M, Klouche K, Lautrette A, Levraut J, Maury E, Oberlin M, Terzi N, Viglino D, Yordanov Y, Claret PG, Bigé N; SRLF; SFMU. Diagnosis and management of metabolic acidosis: guidelines from a French expert panel. Ann Intensive Care. 2019;9:92. doi:10.1186/s13613-019-0563-2.",
    "organizationOrJournal": "Annals of Intensive Care / SRLF / SFMU",
    "authors": [
      "Boris Jung",
      "Mikaël Martinez",
      "Yann-Erick Claessens",
      "Michaël Darmon",
      "Kada Klouche",
      "Alexandre Lautrette",
      "Jacques Levraut",
      "Eric Maury",
      "Mathieu Oberlin",
      "Nicolas Terzi",
      "Damien Viglino",
      "Youri Yordanov",
      "Pierre-Géraud Claret",
      "Naïke Bigé",
      "Société de Réanimation de Langue Française",
      "Société Française de Médecine d'Urgence"
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13613-019-0563-2",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13613-019-0563-2",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International; https://creativecommons.org/licenses/by/4.0/; attribution, source and license links, and change indication required; third-party material may have separate terms",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
    "authorityAssessment": "Formal multidisciplinary guideline; R1.1 is expert opinion and R1.3 is Grade 2+. Diagnostic physiology only; management currency is not inferred.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.plain-gap",
      "claim.owner-decisions.20261112.albumin-lowers-gap",
      "claim.owner-decisions.20261112.gap-trend-limit"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Diagnostic strategy R1.3-R1.4 and the potassium-excluding gap definition."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.anesthesia-analgesia-pharmacology.emhg-perioperative-2018",
    "title": "Perioperative management of MH suspected or susceptible patients",
    "completeCitation": "European Malignant Hyperthermia Group; Girard T. Perioperative Management of MH Suspected or Susceptible Patients. February 27, 2018.",
    "organizationOrJournal": "European Malignant Hyperthermia Group",
    "authors": [
      "European Malignant Hyperthermia Group",
      "Thierry Girard"
    ],
    "publicationYear": 2018,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.emhg.org/recommendations-1/2018/2/27/perioperative-management-of-mh-suspected-or-susceptible-patients",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Targeted factual verification only; no right to copy protected expression is asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Bibliographic metadata and independently written atomic facts only. No source excerpts, prose, tables, figures or algorithms retained or reproduced. ",
    "authorityAssessment": "Primary professional-group recommendations still listed in the current recommendations index; low evidence levels for several perioperative points. General readiness is not a numerical facility accreditation rule.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.mh-trigger-free",
      "claim.owner-decisions.20261112.mh-testing-sequence",
      "claim.owner-decisions.20261112.mh-prophylaxis"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Premedication, choice of anesthetics and outpatient surgery sections."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.anesthesia-analgesia-pharmacology.emhg-crisis-2024",
    "title": "Recognising and managing a malignant hyperthermia crisis (v2024)",
    "completeCitation": "Glahn K, Girard T, Hellblom A, Hopkins P, Johannsen S, Rueffert H, Snoeck M, Urwyler A; EMHG collaborators. Recognising and managing a malignant hyperthermia crisis (v2024). EMHG. November 4, 2024.",
    "organizationOrJournal": "European Malignant Hyperthermia Group",
    "authors": [
      "Klaus Glahn",
      "Thierry Girard",
      "Anna Hellblom",
      "Philip Hopkins",
      "Stephan Johannsen",
      "Henrik Rueffert",
      "Marc Snoeck",
      "Albert Urwyler",
      "EMHG collaborators"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.emhg.org/recommendations-1/2024/11/4/recognising-and-managing-a-malignant-hyperthermia-crisis-v2024",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Targeted factual verification only; no right to copy protected expression is asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Bibliographic metadata and independently written atomic facts only. No source excerpts, prose, tables, figures or algorithms retained or reproduced. ",
    "authorityAssessment": "Primary international consensus updated 2024; rare-event evidence and consensus limitations retained.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.mh-dantrolene"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Crisis management and dantrolene availability passages."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.anesthesia-analgesia-pharmacology.jsa-mh-2026",
    "title": "JSA guideline for management of malignant hyperthermia in 2025",
    "completeCitation": "Tsutsumi YM, Nagasaka H, Mukaida K, Ichihara Y, Yasuda T, Miyoshi H; JSA MH Management Guideline Working Group. JSA guideline for management of malignant hyperthermia in 2025. J Anesth. 2026;40:4-12. doi:10.1007/s00540-025-03647-y.",
    "organizationOrJournal": "Japanese Society of Anesthesiologists / Journal of Anesthesia",
    "authors": [
      "Yasuo M. Tsutsumi",
      "Hiroshi Nagasaka",
      "Keiko Mukaida",
      "Yasuko Ichihara",
      "Toshimichi Yasuda",
      "Hirotsugu Miyoshi",
      "JSA MH Management Guideline Working Group"
    ],
    "publicationYear": 2026,
    "doi": "10.1007/s00540-025-03647-y",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12860801/",
    "accessedOn": "2026-11-12",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); original fact synthesis with attribution",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
    "authorityAssessment": "Current 2026 English primary guideline. Expert opinion/case reports prominent; regional dantrolene-dose differences are not averaged or tested.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.mh-family-risk",
      "claim.owner-decisions.20261112.mh-trigger-free",
      "claim.owner-decisions.20261112.mh-readiness",
      "claim.owner-decisions.20261112.mh-prophylaxis",
      "claim.owner-decisions.20261112.mh-dantrolene"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Counseling and future anesthesia sections."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bowel-ibd-malabsorption-short-bowel.ecco-crohn-2024",
    "title": "ECCO therapeutics in Crohn disease: surgical treatment, 2024",
    "completeCitation": "Adamina M, Minozzi S, Warusavitarne J, Buskens CJ, Chaparro M, Verstockt B, et al. ECCO Guidelines on Therapeutics in Crohn's Disease: Surgical Treatment. J Crohns Colitis. 2024;18(10):1556-1582. doi:10.1093/ecco-jcc/jjae089.",
    "organizationOrJournal": "European Crohn's and Colitis Organisation / Journal of Crohn's and Colitis",
    "authors": [
      "Michel Adamina",
      "Silvia Minozzi",
      "Janindra Warusavitarne",
      "Christianne Johanna Buskens",
      "Maria Chaparro",
      "Bram Verstockt",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1093/ecco-jcc/jjae089",
    "pmid": null,
    "officialUrl": "https://nisg.no/wp-content/uploads/ECCO-Guidelines-on-Therapeutics-in-Crohns-Disease-Surgical-Treatment.-2024.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright authors2024 / OUP on behalf of ECCO; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original atomic synthesis only. No source prose, tables, figures, algorithms, excerpts or full text retained. Medical authority and license permissiveness are separate. No commercial source-expression derivative is authorized.",
    "authorityAssessment": "International surgical guideline. Exact public Norwegian IBD society-hosted publication checked after journal redirect failed.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.crohn-postoperative-scope",
      "claim.owner-decisions.20261112.crohn-marker-discordance",
      "claim.owner-decisions.20261112.crohn-incomplete-exam"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Statement 4.22 and postoperative follow-up discussion, printed page 1573."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bowel-ibd-malabsorption-short-bowel.aga-crohn-biomarkers-2023",
    "title": "AGA guideline on biomarkers in Crohn disease",
    "completeCitation": "Ananthakrishnan AN, Adler J, Chachu KA, Nguyen NH, Siddique SM, Weiss JM, Sultan S, Velayos FS, Cohen BL, Singh S, on behalf of the AGA Clinical Guidelines Committee. AGA Clinical Practice Guideline on the Role of Biomarkers for the Management of Crohn’s Disease. Gastroenterology. 2023;165:1367-1399. doi:10.1053/j.gastro.2023.09.029.",
    "organizationOrJournal": "American Gastroenterological Association / Gastroenterology",
    "authors": [
      "Ashwin N Ananthakrishnan",
      "Jeremy Adler",
      "Karen A Chachu",
      "Nghia H Nguyen",
      "Shazia M Siddique",
      "Jennifer M Weiss",
      "Shahnaz Sultan",
      "Fernando S Velayos",
      "Benjamin L Cohen",
      "Siddharth Singh"
    ],
    "publicationYear": 2023,
    "doi": "10.1053/j.gastro.2023.09.029",
    "pmid": null,
    "officialUrl": "https://bspghan.org.uk/wp-content/uploads/2023/12/aga-clinical-practice-guideline-on-the-role-of-biomarkers-for-the-management-of-crohns-disease.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright AGA Institute 2023. Targeted factual verification only.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying-fact verification and independent synthesis. Bibliographic attribution and link retained. Source prose, tables, figures and full text are excluded.",
    "authorityAssessment": "Current professional-society guidance. Direct targeted verification of recommendations 3, 4, 10 and 11 with their implementation qualifications. Medical authority is separate from reuse permission.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.crohn-marker-discordance",
      "claim.owner-decisions.20261112.crohn-incomplete-exam"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Recommendations 3-4 and postoperative biomarker discussion."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.colorectal-polyps-cancer.ascrs-rectal-supplement-2023",
    "title": "ASCRS Management of Rectal Cancer 2023 Supplement",
    "completeCitation": "Langenfeld SJ, Davis BR, Vogel JD, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement. Dis Colon Rectum. 2024;67:18-31. doi:10.1097/DCR.0000000000003057.",
    "organizationOrJournal": "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
    "authors": [
      "Sean J. Langenfeld",
      "Bradley R. Davis",
      "Jon D. Vogel",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1097/DCR.0000000000003057",
    "pmid": null,
    "officialUrl": "https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851104/3/Management_of_Rectal_Cancer_2023_Supplement__2023_",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyright retained; targeted verification of underlying facts and bibliographic attribution only. No source prose, excerpts, tables, figures or algorithms retained. Public access is not a reuse licence or endorsement. Medical authority is assessed separately.",
    "authorityAssessment": "Updated graded guidance: upper rectum, total neoadjuvant therapy, response evaluation and selected watch-and-wait. Guideline title uses 2023; journal issue is 2024. Exact near-complete-response timing remains held.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.rectal-negative-biopsy",
      "claim.owner-decisions.20261112.rectal-residual-surgery",
      "claim.owner-decisions.20261112.rectal-watch-selection"
    ],
    "verification": {
      "mode": "inherited_claim_alignment_with_current_bibliographic_check",
      "checkedOn": "2026-11-12",
      "limitation": "Official introduction and citation retrieved. Full article and PDF endpoints returned HTTP 403. Earlier atomic claim alignment reused from the owner queue.",
      "claimLocations": "Prior claim mappings in owner-decision-queue-20261112.json for TOPIC-060. Current official citation and introductory text checked."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.colorectal-polyps-cancer.nci-rectal-pdq",
    "title": "Rectal Cancer Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Rectal Cancer Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated February 12, 2025. Accessed November 12, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389402",
    "officialUrl": "https://www.cancer.gov/types/colorectal/hp/rectal-treatment-pdq",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government information; source-specific copyright conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Independently synthesized facts with agency attribution and an external link. NCI policy permits its text unless otherwise credited; third-party staging tables and graphics remain excluded. USPSTF copyright conditions do not establish a blanket public-domain licence. No endorsement implied.",
    "authorityAssessment": "Government-hosted expert evidence summary, with surgical descriptions explicitly covering total mesorectal excision via low anterior or abdominoperineal resection. PDQ is an evidence summary and does not set formal clinical guidelines.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.rectal-residual-surgery",
      "claim.owner-decisions.20261112.rectal-watch-selection",
      "claim.owner-decisions.20261112.rectal-operations"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Primary Surgical Therapy and complete-response/watch-and-wait sections."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-gerd-barrett-hiatal.sages-hiatal-2024",
    "title": "SAGES hiatal-hernia surgical guideline (2024)",
    "completeCitation": "Daly S, Kumar SS, Collings AT, et al. SAGES guidelines for the surgical treatment of hiatal hernias. Surg Endosc. 2024;38(9):4765-4775. doi:10.1007/s00464-024-11092-3.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons / Surgical Endoscopy",
    "authors": [
      "Daly S",
      "Kumar SS",
      "Collings AT",
      "Hanna NM",
      "Pandya YK",
      "Kurtz J",
      "Kooragayala K",
      "Barber MW",
      "Paranyak M",
      "Kurian M",
      "Chiu J",
      "Ansari MT",
      "Slater BJ",
      "Kohn GP"
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00464-024-11092-3",
    "pmid": null,
    "officialUrl": "https://www.sages.org/publications/guidelines/guidelines-for-the-surgical-treatment-of-hiatal-hernias/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guideline / author manuscript; factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted facts from public society guideline only. SAGES copyright policy https://www.sages.org/about/legal/ located; direct policy open returned 403 but public policy text was inspectable. Copyright prohibits reproduction; no protected material copied. No express automated/AI prohibition found in that policy. Guidelines are not SAGES proprietary manuals.",
    "authorityAssessment": "Current type II-IV guideline. Symptom attribution and observation are expert opinion; fundoplication recommendation is conditional with low certainty; routine mesh evidence is equivocal.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.hiatal-fundoplication"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Key Question 3, conditional fundoplication recommendation."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esophagus-gerd-barrett-hiatal.wses-diaphragmatic-2023",
    "title": "WSES complicated diaphragmatic hernia position paper (2023)",
    "completeCitation": "Giuffrida M, Perrone G, Abu-Zidan F, et al. Management of complicated diaphragmatic hernia in the acute setting: a WSES position paper. World J Emerg Surg. 2023;18:43. doi:10.1186/s13017-023-00510-x.",
    "organizationOrJournal": "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    "authors": [
      "Giuffrida M",
      "Perrone G",
      "Abu-Zidan F",
      "Agnoletti V",
      "Ansaloni L",
      "Baiocchi GL",
      "et al."
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s13017-023-00510-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-023-00510-x",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
    "authorityAssessment": "Position paper includes complicated nontraumatic hernias. Surgical approach and gastropexy guidance have low/very-low certainty and do not establish a universal elective-hiatal mesh policy.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.hiatal-fundoplication",
      "claim.owner-decisions.20261112.hiatal-fixation"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Complicated nontraumatic hernia discussion of reflux procedures and limited fixation for high-risk patients."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.qld.early-pregnancy-loss.2025",
    "title": "Early pregnancy loss",
    "completeCitation": "Queensland Clinical Guidelines. Early pregnancy loss. Guideline No. MN22.29-V8-R27. Queensland Health. October 2022, amended August 2025. Recommended citation year 2025. Accessed November 12, 2026.",
    "organizationOrJournal": "Queensland Health / Queensland Clinical Guidelines",
    "authors": [
      "Queensland Clinical Guidelines"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.health.qld.gov.au/__data/assets/pdf_file/0033/139947/g-epl.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International. Targeted factual verification only.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Queensland Health credited in the complete citation. https://creativecommons.org/licenses/by-nc-nd/4.0/. Original factual synthesis. No source prose, flowchart, table or figure reproduced or adapted.",
    "authorityAssessment": "Current state clinical guideline supports pregnancy testing in reproductive-age suspected early-pregnancy loss, clinical assessment irrespective of initial hemodynamic stability, and assessment of pregnancy location. Used only for these narrow facts, independently corroborated with NLM/NHS; no treatment threshold, regimen or copied algorithm.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.pregnancy-hcg-location",
      "claim.owner-decisions.20261112.pregnancy-symptomatic-localization",
      "claim.owner-decisions.20261112.pregnancy-aspiration-limit"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Assessment section and pregnancy of unknown location, printed pages 14-18."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.nhs.ectopic-pregnancy.2022",
    "title": "Ectopic pregnancy - Diagnosis",
    "completeCitation": "NHS. Ectopic pregnancy - Diagnosis. NHS conditions guidance. Page last reviewed August 23, 2022. Accessed November 12, 2026.",
    "organizationOrJournal": "NHS",
    "authors": [
      "NHS"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.nhs.uk/conditions/ectopic-pregnancy/diagnosis/",
    "accessedOn": "2026-11-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "NHS website content under Open Government Licence v3.0, subject to stated exclusions. Contains public sector information licensed under the Open Government Licence v3.0. https://www.nhs.uk/our-policies/terms-and-conditions/ checked; no NHS endorsement implied.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "National health-service patient guidance verifies prompt assessment of compatible symptoms when pregnancy is possible, pregnancy testing and early-pregnancy referral. Displayed review is overdue; cross-checked with independent U.S. government information. No current guideline status is claimed.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.pregnancy-symptomatic-localization"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "limitation": "Page displays a review due date in 2025. Used as an independent modality cross-check alongside the Queensland guideline amended in 2025.",
      "claimLocations": "Vaginal ultrasound section."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.perioperative-risk-recovery.ats-ohs-2019",
    "title": "ATS obesity hypoventilation syndrome guideline",
    "completeCitation": "Mokhlesi B, Masa JF, Brozek JL, et al. Evaluation and Management of Obesity Hypoventilation Syndrome. An Official American Thoracic Society Clinical Practice Guideline. American Journal of Respiratory and Critical Care Medicine. 2019;200:e6–e24. doi:10.1164/rccm.201905-1071ST. Accessed 2026-11-11.",
    "organizationOrJournal": "American Thoracic Society / AJRCCM",
    "authors": [
      "Babak Mokhlesi",
      "Juan Fernando Masa",
      "Jan L Brozek",
      "ATS guideline panel"
    ],
    "publicationYear": 2019,
    "doi": "10.1164/rccm.201905-1071ST",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6680300/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright retained; targeted facts only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted society-guideline factual verification and citation only. No source prose, table, algorithm or figure copied; public access is not a reusable license. ATS copyright retained; no PMC reuse grant assumed.",
    "authorityAssessment": "Primary conditional guideline with very low certainty; applies to obesity with sleep-disordered breathing, not any isolated chemistry result.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.ohs-awake-gas",
      "claim.owner-decisions.20261112.ohs-sleep-study-role"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Recommendations 1A-1C and OHS definition. Awake carbon-dioxide confirmation and sleep-study roles."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.ptld.frontiers-review-2026",
    "title": "Comprehensive review of PTLD after solid organ transplantation",
    "completeCitation": "Vargas-Nieto LP, Santoyo-Sarmiento ND, Ballesteros-Garcia M, Calderon-Vasquez AT, Pinto-Rodriguez AD, Robayo-Romero MG, Cormane-Alfaro V, Daza-Buitrago J. Post-transplant lymphoproliferative disorder after solid organ transplantation: a comprehensive review. Front Transplant. 2026;5:1869288. doi:10.3389/frtra.2026.1869288.",
    "organizationOrJournal": "Frontiers in Transplantation",
    "authors": [
      "Lina Patricia Vargas-Nieto",
      "Nicolas David Santoyo-Sarmiento",
      "Maria Ballesteros-Garcia",
      "Angie Tatiana Calderon-Vasquez",
      "Alvaro Daniel Pinto-Rodriguez",
      "Maria Gabriela Robayo-Romero",
      "Valeria Cormane-Alfaro",
      "Jorge Daza-Buitrago"
    ],
    "publicationYear": 2026,
    "doi": "10.3389/frtra.2026.1869288",
    "pmid": null,
    "officialUrl": "https://www.frontiersin.org/journals/transplantation/articles/10.3389/frtra.2026.1869288/full",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
    "authorityAssessment": "Licensed current narrative synthesis supporting PTLD tissue architecture and the excision preference for an accessible node. Its comparative biopsy statements are expert synthesis, with core accepted when excision is unsuitable.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.ptld-architecture",
      "claim.owner-decisions.20261112.ptld-fixed-histology"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Diagnostic approach, tissue biopsy and histopathology section."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.owner-decisions.20261112.mhaus-pretesting-2018",
    "title": "Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility?",
    "completeCitation": "Malignant Hyperthermia Association of the United States. Can Patients with a Suspected Personal or Family History of MH be Safely Anesthetized Prior to Diagnostic Testing for MH Susceptibility? MHAUS Recommendations. 2018.",
    "organizationOrJournal": "Malignant Hyperthermia Association of the United States",
    "authors": [
      "Malignant Hyperthermia Association of the United States"
    ],
    "publicationYear": 2018,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.mhaus.org/healthcare-professionals/mhaus-recommendations/can-patients-with-a-suspected-personal-or-family-history-of-mh-be-safely-anesthetized-prior-to-diagnostic-testing-for-mh-susceptibility/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "MHAUS copyrighted professional recommendations. Targeted factual verification and citation.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Underlying facts independently synthesized. No source prose, figures, algorithms or full text retained.",
    "authorityAssessment": "Specialist organization recommendations for pretesting anesthesia, prepared staff, dantrolene access, workstation preparation and transfer arrangements. MHAUS labels these recommendations rather than standards.",
    "usageRole": "evidence",
    "accessedOn": "2026-11-12",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.mh-readiness",
      "claim.owner-decisions.20261112.mh-testing-sequence",
      "claim.owner-decisions.20261112.mh-dantrolene"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Conclusions and facility-preparedness criteria."
    }
  },
  {
    "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.owner-decisions.20261112.rcpath-lymphoma-2015",
    "title": "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas",
    "completeCitation": "Dojcinov S, Wilkins B, Calaminici M. Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas. Royal College of Pathologists. G142, version 2. October 2015.",
    "organizationOrJournal": "Royal College of Pathologists",
    "authors": [
      "Stefan Dojcinov",
      "Bridget Wilkins",
      "Maria Calaminici"
    ],
    "publicationYear": 2015,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.rcpath.org/asset/DE0B5B4A-7F77-4FE2-AB56FD618EE69098/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Royal College of Pathologists 2015. Personal noncommercial reproduction conditions.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification only. Independently synthesized facts and bibliographic metadata. No source prose, tables, proformas or full text retained.",
    "authorityAssessment": "Specialist technical guidance on lymphoid histology and fresh-tissue ancillary testing. The 2015 document is listed as under review, so local hematopathology procedures need confirmation.",
    "usageRole": "evidence",
    "accessedOn": "2026-11-12",
    "evidenceClaimIds": [
      "claim.owner-decisions.20261112.ptld-architecture",
      "claim.owner-decisions.20261112.ptld-fresh-flow",
      "claim.owner-decisions.20261112.ptld-fixed-histology"
    ],
    "verification": {
      "mode": "targeted_factual_verification",
      "checkedOn": "2026-11-12",
      "inheritedMetadataReviewed": true,
      "claimLocations": "Preparation before dissection, printed page 10, and immunophenotyping discussion, printed page 13."
    }
  }
];
