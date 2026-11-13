// Frozen manager acceptance for the reviewed source versions.
import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";
import type {QuestionShipAcceptance} from "./question-ship-manifest";
export const PROGRAM_BATCH11_ROWS:QuestionShipAcceptance[] = [
  {
    "acceptanceId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "caseId": "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1",
    "nodeId": "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "questionVariantId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "conceptId": "concept.intraop.anorectal-eua.crohn-rectal-activity.v1",
    "sourceView": "intraop-batch11-anorectal-eua-and-fistula",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.parathyroid.sample-integrity.v1",
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "conceptId": "concept.intraop.parathyroid.sample-integrity.v1",
    "sourceView": "intraop-batch11-parathyroid-localization-and-preservation",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.parathyroid.selective-salvage.v1",
    "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
    "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
    "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
    "conceptId": "concept.intraop.parathyroid.selective-salvage.v1",
    "sourceView": "intraop-batch11-parathyroid-localization-and-preservation",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  },
  {
    "acceptanceId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "caseId": "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
    "nodeId": "node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "questionVariantId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "conceptId": "concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "sourceView": "intraop-batch11-polypectomy-technique-and-bleeding",
    "decision": "docs/research/question-intraop-acceptance-batch11-20261113.md"
  }
];
export const PROGRAM_BATCH11_VIEWS:Record<string,SyntheticClinicalRelease> = {
  "intraop-batch11-anorectal-eua-and-fistula": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.anorectal-eua.crohn-rectal-activity.v1",
        "displayName": "Use the current rectal inflammatory findings to reconsider closure of an otherwise favorable low Crohn fistula.",
        "learningObjective": "Use the current rectal inflammatory findings to reconsider closure of an otherwise favorable low Crohn fistula.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1",
        "displayName": "Crohn fistula EUA checkpoints",
        "patientPresentationVariantId": "presentation.intraop.anorectal-eua.crohn-checkpoints.20261112.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Mara Ellison",
        "prototypeDemographics": {
          "ageYears": 48,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Fistula procedure",
        "presentation": "{patientName}, a 48-year-old woman with Crohn disease and a longstanding seton-drained fistula, is undergoing EUA with possible tract treatment in the clinic’s ambulatory OR. Her outpatient bowel symptoms had been considered controlled.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.anorectal-eua.crohn-checkpoints.20261112.v1",
            "prototypeDemographics": {
              "ageYears": 48,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Fistula procedure",
            "presentation": "{patientName}, a 48-year-old woman with Crohn disease and a longstanding seton-drained fistula, is undergoing EUA with possible tract treatment in the clinic’s ambulatory OR. Her outpatient bowel symptoms had been considered controlled."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ECCO Crohn surgical-treatment guideline (2024)",
          "ASCRS anorectal abscess and fistula guideline (2022)"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
            "questionVariantId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
            "primaryConceptId": "concept.intraop.anorectal-eua.crohn-rectal-activity.v1",
            "currentUpdate": "EUA shows a single posterior tract beneath a thin distal sphincter bridge. The loose seton drains freely; palpation finds no fluid cavity. Her preoperative continence record documents control of gas, liquid and solid stool.",
            "stem": "Which tract-treatment plan should be used at this checkpoint in {patientName}’s current anorectal EUA?",
            "answerChoices": [
              {
                "id": "retain-seton",
                "label": "Keep the seton and defer tract closure",
                "isCorrect": true,
                "rationale": "The mucosal findings indicate current rectal inflammatory activity. Favorable tract geometry and function do not remove that concern; drainage can continue while medical control is reassessed.",
                "serviceRequest": null
              },
              {
                "id": "fistulotomy",
                "label": "Remove the seton and lay open the tract",
                "isCorrect": false,
                "rationale": "Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.",
                "serviceRequest": null
              },
              {
                "id": "rectal-flap",
                "label": "Remove the seton and advance a rectal flap",
                "isCorrect": false,
                "rationale": "A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed observations during the current EUA",
              "items": [
                {
                  "label": "Internal opening",
                  "value": "One opening; no branch is found on gentle examination."
                },
                {
                  "label": "Lower rectal mucosa",
                  "value": "Several irregular ulcers with friable edges bleed on light contact."
                }
              ]
            },
            "sourceLabels": [
              "ECCO Crohn surgical-treatment guideline (2024)",
              "ASCRS anorectal abscess and fistula guideline (2022)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "fistulotomy",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.",
                "sourceLabels": [
                  "ECCO Crohn surgical-treatment guideline (2024)",
                  "ASCRS anorectal abscess and fistula guideline (2022)"
                ]
              },
              {
                "answerChoiceId": "rectal-flap",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review this decision; no patient outcome or new service is simulated.",
                "clinicalRationale": "A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.",
                "sourceLabels": [
                  "ECCO Crohn surgical-treatment guideline (2024)",
                  "ASCRS anorectal abscess and fistula guideline (2022)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "kind": "operation",
          "phase": "procedure",
          "familyId": "procedure.anorectal_eua",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery"
          ]
        }
      }
    ]
  },
  "intraop-batch11-parathyroid-localization-and-preservation": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.parathyroid.sample-integrity.v1",
        "displayName": "PTH collection provenance before operative completion",
        "learningObjective": "Distinguish a reassuring PTH number from an adequately collected systemic sample before deciding operative completion.",
        "earliestFacilityStage": 3,
        "conceptType": "workup"
      },
      {
        "id": "concept.intraop.parathyroid.selective-salvage.v1",
        "displayName": "Choose distinct pre-closure dispositions for attached and removed glands",
        "learningObjective": "Use observed perfusion and specimen provenance to choose selective preservation and salvage at the final thyroidectomy checkpoint.",
        "earliestFacilityStage": 3,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.parathyroid.missing-gland-salvage.v1",
        "displayName": "Live parathyroidectomy: {patientName}",
        "patientPresentationVariantId": "presentation.intraop.parathyroid.missing-gland-salvage.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Simon Reed",
        "prototypeDemographics": {
          "ageYears": 62,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Parathyroid surgery",
        "presentation": "{patientName}, a 62-year-old man with established sporadic primary hyperparathyroidism, is undergoing parathyroidectomy in the clinic's ambulatory OR.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.parathyroid.simon-reed-male62-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 62,
              "sexLabel": "Male"
            },
            "chiefComplaint": "Parathyroid surgery",
            "presentation": "{patientName}, a 62-year-old man with established sporadic primary hyperparathyroidism, is undergoing parathyroidectomy in the clinic's ambulatory OR."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism",
          "The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.parathyroid.sample-integrity.v1",
            "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
            "primaryConceptId": "concept.intraop.parathyroid.sample-integrity.v1",
            "currentUpdate": "An enlarged nodule has now been removed from the left thymic tongue in the neck. The operation remains open while the team reviews the sampling record. The team uses conventional Miami interpretation: a fall greater than 50% from the higher preincision or preexcision value at 10 minutes.",
            "stem": "Which next test should guide completion of {patientName}'s parathyroid exploration after the supplied sampling record?",
            "answerChoices": [
              {
                "id": "choice.intraop.parathyroid.sample-integrity.1",
                "label": "PTH assay using newly collected venous blood.",
                "isCorrect": true,
                "rationale": "Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.parathyroid.sample-integrity.2",
                "label": "PTH assay using retained postexcision venous blood.",
                "isCorrect": false,
                "rationale": "Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.parathyroid.sample-integrity.3",
                "label": "PTH assay using aspirate from the removed nodule.",
                "isCorrect": false,
                "rationale": "A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed operative sampling record",
              "columnHeaders": [
                "PTH (pg/mL)",
                "Collection record"
              ],
              "rowHeaders": [
                "Before incision",
                "Before nodule excision",
                "10 minutes after excision"
              ],
              "cells": [
                [
                  "150",
                  "Fresh peripheral venipuncture"
                ],
                [
                  "200",
                  "Fresh peripheral venipuncture"
                ],
                [
                  "30",
                  "Peripheral cannula flushed with saline; the initial aspirate from its extension entered the assay tube"
                ]
              ]
            },
            "sourceLabels": [
              "Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism",
              "The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.parathyroid.sample-integrity.2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The proposed plan differs from the observed tissue or specimen findings; review the explanation.",
                "clinicalRationale": "Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.",
                "sourceLabels": [
                  "Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism",
                  "The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.parathyroid.sample-integrity.3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The proposed plan differs from the observed tissue or specimen findings; review the explanation.",
                "clinicalRationale": "A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.",
                "sourceLabels": [
                  "Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism",
                  "The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "kind": "operation",
          "phase": "procedure",
          "familyId": "procedure.parathyroidectomy",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation",
            "income.ambulatory_operation_extended"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery",
            "capability.endocrine_surgery",
            "capability.intraoperative_pth",
            "capability.intraoperative_ultrasound"
          ]
        }
      },
      {
        "id": "case.intraop.parathyroid.gland-preservation-salvage.v1",
        "displayName": "Live thyroidectomy: {patientName}",
        "patientPresentationVariantId": "presentation.intraop.parathyroid.gland-preservation.v1",
        "releasePointId": "release.l3.ambulatory",
        "patientDisplayName": "Lydia Hayes",
        "prototypeDemographics": {
          "ageYears": 57,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Thyroid surgery",
        "presentation": "{patientName}, a 57-year-old woman, is undergoing total thyroidectomy for bilateral symptomatic nodular thyroid disease in the clinic's ambulatory OR.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.parathyroid.lydia-hayes-female57.v1",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Thyroid surgery",
            "presentation": "{patientName}, a 57-year-old woman, is undergoing total thyroidectomy for bilateral symptomatic nodular thyroid disease in the clinic's ambulatory OR."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 3,
        "requiredClinicalSetting": "ambulatory_surgery",
        "requiredCapabilityIds": [
          "capability.ambulatory_or",
          "capability.staff.or_nurse",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism",
          "Preservation of parathyroid glands during thyroid and neck surgery",
          "The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.parathyroid.selective-salvage.v1",
            "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
            "primaryConceptId": "concept.intraop.parathyroid.selective-salvage.v1",
            "currentUpdate": "At the pre-closure check after thyroid removal, the team examines the upper gland in the field and the lower-gland tissue on the fresh specimen. The portion used for frozen section is separate from the remaining lower-gland tissue.",
            "stem": "Which plan should be used for the two left parathyroid glands at the pre-closure checkpoint of {patientName}'s thyroidectomy?",
            "answerChoices": [
              {
                "id": "choice.intraop.parathyroid.selective-salvage.1",
                "label": "Retain the upper gland in situ and autotransplant the remaining lower-gland tissue into neck muscle.",
                "isCorrect": true,
                "rationale": "The upper gland retains its pedicle and shows inflow after decompression, supporting in-situ retention. The remaining lower tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting muscle autotransplantation of the remaining tissue.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.parathyroid.selective-salvage.2",
                "label": "Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.",
                "isCorrect": false,
                "rationale": "Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.parathyroid.selective-salvage.3",
                "label": "Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.",
                "isCorrect": false,
                "rationale": "Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.parathyroid.selective-salvage.4",
                "label": "Autotransplant the upper gland into neck muscle and autotransplant the remaining lower-gland tissue into neck muscle.",
                "isCorrect": false,
                "rationale": "Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed current field and specimen observations",
              "columnHeaders": [
                "Attachment and response",
                "Tissue identity"
              ],
              "rowHeaders": [
                "Left upper gland",
                "Remaining left lower-gland tissue"
              ],
              "cells": [
                [
                  "Still attached by its vascular pedicle; initially dusky. After a small capsular incision, fresh blood oozes and the gland becomes pink.",
                  "Recognized during dissection as normal parathyroid"
                ],
                [
                  "Found detached on the fresh sterile thyroid specimen; the retained tissue is on the sterile field.",
                  "Completed frozen section of a separate portion reports benign parathyroid tissue."
                ]
              ]
            },
            "sourceLabels": [
              "Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism",
              "Preservation of parathyroid glands during thyroid and neck surgery",
              "The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.parathyroid.selective-salvage.2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The proposed plan differs from the observed tissue or specimen findings; review the explanation.",
                "clinicalRationale": "Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.",
                "sourceLabels": [
                  "Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism",
                  "Preservation of parathyroid glands during thyroid and neck surgery",
                  "The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.parathyroid.selective-salvage.3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The proposed plan differs from the observed tissue or specimen findings; review the explanation.",
                "clinicalRationale": "Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.",
                "sourceLabels": [
                  "Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism",
                  "Preservation of parathyroid glands during thyroid and neck surgery",
                  "The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.parathyroid.selective-salvage.4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "The proposed plan differs from the observed tissue or specimen findings; review the explanation.",
                "clinicalRationale": "Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.",
                "sourceLabels": [
                  "Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism",
                  "Preservation of parathyroid glands during thyroid and neck surgery",
                  "The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "kind": "operation",
          "phase": "procedure",
          "familyId": "procedure.thyroidectomy",
          "allowedIncomeLineIds": [
            "income.ambulatory_operation",
            "income.ambulatory_operation_extended"
          ],
          "requiredCapabilityIds": [
            "capability.ambulatory_or",
            "capability.staff.or_nurse",
            "capability.periop_recovery",
            "capability.endocrine_surgery",
            "capability.intraoperative_frozen_pathology"
          ]
        }
      }
    ]
  },
  "intraop-batch11-polypectomy-technique-and-bleeding": {
    "id": "clinical.synthetic.prototype.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
        "displayName": "Right-colon defect completion",
        "learningObjective": "Use the completed-resection findings and large right-colon defect to choose prophylactic closure rather than vessel-only treatment.",
        "earliestFacilityStage": 2,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
        "displayName": "Colonoscopy",
        "patientPresentationVariantId": "presentation.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
        "releasePointId": "release.l2.endoscopy",
        "patientDisplayName": "Maya Dalton",
        "prototypeDemographics": {
          "ageYears": 60,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Colonoscopy",
        "presentation": "{patientName}, a 60-year-old woman, is undergoing piecemeal hot-snare EMR of a 28-mm ascending-colon adenoma in the clinic's endoscopy room. Before snare retrieval, a raised residual mucosal tongue at the resection edge showed tubular surface openings on image-enhanced inspection.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
            "prototypeDemographics": {
              "ageYears": 60,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Colonoscopy",
            "presentation": "{patientName}, a 60-year-old woman, is undergoing piecemeal hot-snare EMR of a 28-mm ascending-colon adenoma in the clinic's endoscopy room. Before snare retrieval, a raised residual mucosal tongue at the resection edge showed tubular surface openings on image-enhanced inspection."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 2,
        "requiredClinicalSetting": "endoscopy",
        "requiredCapabilityIds": [
          "capability.endoscopy",
          "capability.periop_recovery"
        ],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "USMSTF endoscopic removal of colorectal lesions (2020)",
          "Academy of Medicine Singapore colonic-polyp guidance (2022)"
        ],
        "decisionNodes": [
          {
            "id": "node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
            "questionVariantId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
            "primaryConceptId": "concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
            "currentUpdate": "The raised tongue has been retrieved by snare. Reinspection shows no matching tubular surface remaining; adjuvant treatment of the clear mucosal edge has been completed. The scope remains at the ascending-colon site.",
            "stem": "Before ending {patientName}'s ascending-colon EMR, which completion plan should be used for the resection bed?",
            "answerChoices": [
              {
                "id": "choice.intraop.polypectomy.right-colon-defect-after-clearance.close.20261112.v1",
                "label": "Close the mucosal defect with endoscopic clips",
                "isCorrect": true,
                "rationale": "This is the large proximal EMR setting in which prophylactic defect closure is supported. Cessation of bleeding does not remove the separate purpose of reducing later hemorrhage.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1",
                "label": "Treat the exposed vessels with coagulation forceps",
                "isCorrect": false,
                "rationale": "Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.",
                "serviceRequest": null
              },
              {
                "id": "choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1",
                "label": "Leave the mucosal defect open following inspection",
                "isCorrect": false,
                "rationale": "Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.",
            "exhibit": {
              "kind": "table",
              "caption": "Constructed endoscopy observations",
              "columnHeaders": [
                "Observed finding"
              ],
              "rowHeaders": [
                "Defect",
                "Base"
              ],
              "cells": [
                [
                  "The mucosal defect spans 30 mm. Its edges come together as insufflation is reduced."
                ],
                [
                  "Blue-stained fibers extend across the bed. Two small vessels are visible, with no bleeding after irrigation."
                ]
              ]
            },
            "sourceLabels": [
              "USMSTF endoscopic removal of colorectal lesions (2020)",
              "Academy of Medicine Singapore colonic-polyp guidance (2022)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the observed findings and treatment choice before continuing; no complication outcome is simulated.",
                "clinicalRationale": "Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.",
                "sourceLabels": [
                  "USMSTF endoscopic removal of colorectal lesions (2020)",
                  "Academy of Medicine Singapore colonic-polyp guidance (2022)"
                ]
              },
              {
                "answerChoiceId": "choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the observed findings and treatment choice before continuing; no complication outcome is simulated.",
                "clinicalRationale": "Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.",
                "sourceLabels": [
                  "USMSTF endoscopic removal of colorectal lesions (2020)",
                  "Academy of Medicine Singapore colonic-polyp guidance (2022)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.",
        "procedureContext": {
          "version": "procedure-context.v1",
          "mode": "live",
          "kind": "endoscopy",
          "phase": "procedure",
          "familyId": "procedure.colonoscopy_polypectomy",
          "allowedIncomeLineIds": [
            "income.endoscopy"
          ],
          "requiredCapabilityIds": [
            "capability.endoscopy",
            "capability.periop_recovery",
            "capability.endoscopic_closure",
            "capability.endoscopic_rescue",
            "capability.chromoendoscopy"
          ]
        }
      }
    ]
  }
};
export const PROGRAM_BATCH11_QUESTIONS:Array<QuestionVariant & Record<string,unknown>> = [
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "conceptId": "concept.intraop.anorectal-eua.crohn-rectal-activity.v1",
    "stem": "Which tract-treatment plan should be used at this checkpoint in {patientName}’s current anorectal EUA?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed observations during the current EUA",
      "items": [
        {
          "label": "Internal opening",
          "value": "One opening; no branch is found on gentle examination."
        },
        {
          "label": "Lower rectal mucosa",
          "value": "Several irregular ulcers with friable edges bleed on light contact."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "retain-seton",
        "label": "Keep the seton and defer tract closure",
        "isCorrect": true,
        "rationale": "The mucosal findings indicate current rectal inflammatory activity. Favorable tract geometry and function do not remove that concern; drainage can continue while medical control is reassessed.",
        "distractorRationale": null
      },
      {
        "id": "fistulotomy",
        "label": "Remove the seton and lay open the tract",
        "isCorrect": false,
        "rationale": "Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.",
        "distractorRationale": "Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity."
      },
      {
        "id": "rectal-flap",
        "label": "Remove the seton and advance a rectal flap",
        "isCorrect": false,
        "rationale": "A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.",
        "distractorRationale": "A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem."
      }
    ],
    "explanation": "Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.anorectal-eua.low-tract-function",
      "claim.intraop.anorectal-eua.crohn-rectal-activity",
      "claim.intraop.anorectal-eua.crohn-flap",
      "claim.intraop.anorectal-eua.crohn-staging"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.parathyroid.sample-integrity.v1",
    "conceptId": "concept.intraop.parathyroid.sample-integrity.v1",
    "stem": "Which next test should guide completion of {patientName}'s parathyroid exploration after the supplied sampling record?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed operative sampling record",
      "columnHeaders": [
        "PTH (pg/mL)",
        "Collection record"
      ],
      "rowHeaders": [
        "Before incision",
        "Before nodule excision",
        "10 minutes after excision"
      ],
      "cells": [
        [
          "150",
          "Fresh peripheral venipuncture"
        ],
        [
          "200",
          "Fresh peripheral venipuncture"
        ],
        [
          "30",
          "Peripheral cannula flushed with saline; the first aspirate from its extension entered the assay tube"
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.parathyroid.sample-integrity.1",
        "label": "PTH assay using newly collected venous blood.",
        "isCorrect": true,
        "rationale": "Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.parathyroid.sample-integrity.2",
        "label": "PTH assay using retained postexcision venous blood.",
        "isCorrect": false,
        "rationale": "Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.",
        "distractorRationale": "Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty."
      },
      {
        "id": "choice.intraop.parathyroid.sample-integrity.3",
        "label": "PTH assay using aspirate from the removed nodule.",
        "isCorrect": false,
        "rationale": "A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.",
        "distractorRationale": "A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains."
      }
    ],
    "shuffleAnswers": true,
    "explanation": "Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.parathyroid.miami-protocol",
      "claim.intraop.parathyroid.saline-contamination",
      "claim.intraop.parathyroid.recollect-before-extent",
      "claim.intraop.parathyroid.washout-identity"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.parathyroid.selective-salvage.v1",
    "conceptId": "concept.intraop.parathyroid.selective-salvage.v1",
    "stem": "Which plan should be used for the two left parathyroid glands at the pre-closure checkpoint of {patientName}'s thyroidectomy?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed current field and specimen observations",
      "columnHeaders": [
        "Attachment and response",
        "Tissue identity"
      ],
      "rowHeaders": [
        "Left upper gland",
        "Remaining left lower-gland tissue"
      ],
      "cells": [
        [
          "Still attached by its vascular pedicle; initially dusky. After a small capsular incision, fresh blood oozes and the gland becomes pink.",
          "Recognized during dissection as normal parathyroid"
        ],
        [
          "Found detached on the fresh sterile thyroid specimen; the remaining tissue is on the sterile field.",
          "Completed frozen section of a separate portion reports benign parathyroid tissue."
        ]
      ]
    },
    "answerChoices": [
      {
        "id": "choice.intraop.parathyroid.selective-salvage.1",
        "label": "Retain the upper gland in situ and autotransplant the remaining lower-gland tissue into neck muscle.",
        "isCorrect": true,
        "rationale": "The upper gland retains its pedicle and shows inflow after decompression, supporting in-situ retention. The remaining lower tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting muscle autotransplantation of the remaining tissue.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.parathyroid.selective-salvage.2",
        "label": "Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.",
        "isCorrect": false,
        "rationale": "Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.",
        "distractorRationale": "Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report."
      },
      {
        "id": "choice.intraop.parathyroid.selective-salvage.3",
        "label": "Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.",
        "isCorrect": false,
        "rationale": "Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.",
        "distractorRationale": "Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage."
      },
      {
        "id": "choice.intraop.parathyroid.selective-salvage.4",
        "label": "Autotransplant the upper gland into neck muscle and autotransplant the remaining lower-gland tissue into neck muscle.",
        "isCorrect": false,
        "rationale": "Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.",
        "distractorRationale": "Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response."
      }
    ],
    "shuffleAnswers": true,
    "explanation": "The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.parathyroid.in-situ-function",
      "claim.intraop.parathyroid.color-limitation",
      "claim.intraop.parathyroid.reperfusion-observation",
      "claim.intraop.parathyroid.removed-gland-graft",
      "claim.intraop.parathyroid.muscle-graft-technique",
      "claim.intraop.parathyroid.tissue-confirmation"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "conceptId": "concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "stem": "Before ending {patientName}'s ascending-colon EMR, which completion plan should be used for the resection bed?",
    "exhibit": {
      "kind": "table",
      "caption": "Constructed endoscopy observations",
      "columnHeaders": [
        "Observed finding"
      ],
      "rowHeaders": [
        "Defect",
        "Base"
      ],
      "cells": [
        [
          "The mucosal defect spans 30 mm. Its edges come together as insufflation is reduced."
        ],
        [
          "Blue-stained fibers extend across the bed. Two small vessels are visible, with no bleeding after irrigation."
        ]
      ]
    },
    "explanation": "The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.",
    "supportingEvidenceClaimIds": [
      "claim.intraop.polypectomy.right-colon-defect-closure",
      "claim.intraop.polypectomy.vessel-coagulation-boundary",
      "claim.intraop.polypectomy.intraprocedural-bleeding-tools"
    ],
    "answerChoices": [
      {
        "id": "choice.intraop.polypectomy.right-colon-defect-after-clearance.close.20261112.v1",
        "label": "Close the mucosal defect with endoscopic clips",
        "isCorrect": true,
        "rationale": "This is the large proximal EMR setting in which prophylactic defect closure is supported. Cessation of bleeding does not remove the separate purpose of reducing later hemorrhage.",
        "distractorRationale": null
      },
      {
        "id": "choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1",
        "label": "Treat the exposed vessels with coagulation forceps",
        "isCorrect": false,
        "rationale": "Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.",
        "distractorRationale": "Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding."
      },
      {
        "id": "choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1",
        "label": "Leave the mucosal defect open following inspection",
        "isCorrect": false,
        "rationale": "Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.",
        "distractorRationale": "Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here."
      }
    ]
  }
];
export const PROGRAM_BATCH11_AUTHORED_CONCEPTS = [
  {
    "id": "concept.intraop.anorectal-eua.crohn-rectal-activity.v1",
    "displayName": "Use the current rectal inflammatory findings to reconsider closure of an otherwise favorable low Crohn fistula.",
    "learningObjective": "Use the current rectal inflammatory findings to reconsider closure of an otherwise favorable low Crohn fistula.",
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "relatedExistingConceptIds": [
      "concept.anorectal-fistula.function-before-low-tract-division.v1",
      "concept.complex-perianal-fistula.loose-seton-staged-planning"
    ],
    "educationalTier": 4,
    "evidenceClaimIds": [
      "claim.intraop.anorectal-eua.low-tract-function",
      "claim.intraop.anorectal-eua.crohn-rectal-activity",
      "claim.intraop.anorectal-eua.crohn-flap",
      "claim.intraop.anorectal-eua.crohn-staging"
    ]
  },
  {
    "id": "concept.intraop.parathyroid.sample-integrity.v1",
    "displayName": "PTH collection provenance before operative completion",
    "learningObjective": "Distinguish a reassuring PTH number from an adequately collected systemic sample before deciding operative completion.",
    "earliestFacilityStage": 3,
    "conceptType": "workup",
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": null,
    "conceptRelation": "new_meaning",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.miami-protocol",
      "claim.intraop.parathyroid.saline-contamination",
      "claim.intraop.parathyroid.recollect-before-extent",
      "claim.intraop.parathyroid.washout-identity"
    ]
  },
  {
    "id": "concept.intraop.parathyroid.selective-salvage.v1",
    "displayName": "Choose distinct pre-closure dispositions for attached and removed glands",
    "learningObjective": "Use observed perfusion and specimen provenance to choose selective preservation and salvage at the final thyroidectomy checkpoint.",
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.intraop.parathyroid.selective-salvage.v1",
    "conceptRelation": "existing_meaning_variant",
    "educationalTier": 2,
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.in-situ-function",
      "claim.intraop.parathyroid.color-limitation",
      "claim.intraop.parathyroid.reperfusion-observation",
      "claim.intraop.parathyroid.removed-gland-graft",
      "claim.intraop.parathyroid.muscle-graft-technique",
      "claim.intraop.parathyroid.tissue-confirmation"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "displayName": "Right-colon defect completion",
    "learningObjective": "Use the completed-resection findings and large right-colon defect to choose prophylactic closure rather than vessel-only treatment.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "conceptRelation": "new_identity",
    "previousConceptId": null,
    "identityReason": "New large-EMR completion or bleeding-device-fit decision; neither the cold-snare size rule nor retained pre-transection stalk prophylaxis.",
    "evidenceClaimIds": [
      "claim.intraop.polypectomy.right-colon-defect-closure",
      "claim.intraop.polypectomy.vessel-coagulation-boundary",
      "claim.intraop.polypectomy.intraprocedural-bleeding-tools"
    ],
    "historyMigration": "None. No existing concept, question, frozen encounter, save or FSRS identity is replaced."
  }
];
export const PROGRAM_BATCH11_TIMINGS:AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1",
    "nodeId": "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "questionVariantId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.parathyroid.sample-integrity.1",
          "choiceLabel": "PTH assay using newly collected venous blood.",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "choice.intraop.parathyroid.sample-integrity.2",
          "choiceLabel": "PTH assay using retained postexcision venous blood.",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        },
        {
          "choiceId": "choice.intraop.parathyroid.sample-integrity.3",
          "choiceLabel": "PTH assay using aspirate from the removed nodule.",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.basic_labs"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
    "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
    "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.intraop.parathyroid.selective-salvage.1",
          "choiceLabel": "Retain the upper gland in situ and autotransplant the remaining lower-gland tissue into neck muscle.",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.intraop.parathyroid.selective-salvage.2",
          "choiceLabel": "Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        },
        {
          "choiceId": "choice.intraop.parathyroid.selective-salvage.3",
          "choiceLabel": "Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        },
        {
          "choiceId": "choice.intraop.parathyroid.selective-salvage.4",
          "choiceLabel": "Autotransplant the upper gland into neck muscle and autotransplant the remaining lower-gland tissue into neck muscle.",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
    "nodeId": "node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "questionVariantId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "classification": {
      "kind": "no_test"
    }
  }
];
export const PROGRAM_BATCH11_ORDERS = [
  {
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "choiceId": "choice.intraop.parathyroid.sample-integrity.1",
    "choiceLabel": "PTH assay using newly collected venous blood.",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "choiceId": "choice.intraop.parathyroid.sample-integrity.2",
    "choiceLabel": "PTH assay using retained postexcision venous blood.",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "choiceId": "choice.intraop.parathyroid.sample-integrity.3",
    "choiceLabel": "PTH assay using aspirate from the removed nodule.",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
    "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
    "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
    "choiceId": "choice.intraop.parathyroid.selective-salvage.2",
    "choiceLabel": "Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.",
    "timingProfileId": "timing.test.pathology_review",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
    "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
    "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
    "choiceId": "choice.intraop.parathyroid.selective-salvage.3",
    "choiceLabel": "Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.",
    "timingProfileId": "timing.test.pathology_review",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const PROGRAM_BATCH11_FAMILIES = [] as const;
export const PROGRAM_BATCH11_FROZEN = [
  {
    "group": "salvage",
    "slug": "anorectal-eua-and-fistula",
    "caseId": "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1",
    "nodeId": "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "questionVariantId": "question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"question-intraop.anorectal-eua-and-fistula.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1\",\"conceptId\":\"concept.intraop.anorectal-eua.crohn-rectal-activity.v1\",\"stem\":\"Which tract-treatment plan should be used at this checkpoint in {patientName}’s current anorectal EUA?\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed observations during the current EUA\",\"items\":[{\"label\":\"Internal opening\",\"value\":\"One opening; no branch is found on gentle examination.\"},{\"label\":\"Lower rectal mucosa\",\"value\":\"Several irregular ulcers with friable edges bleed on light contact.\"}]},\"answerChoices\":[{\"id\":\"retain-seton\",\"label\":\"Keep the seton and defer tract closure\",\"isCorrect\":true,\"rationale\":\"The mucosal findings indicate current rectal inflammatory activity. Favorable tract geometry and function do not remove that concern; drainage can continue while medical control is reassessed.\",\"distractorRationale\":null},{\"id\":\"fistulotomy\",\"label\":\"Remove the seton and lay open the tract\",\"isCorrect\":false,\"rationale\":\"Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.\",\"distractorRationale\":\"Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.\"},{\"id\":\"rectal-flap\",\"label\":\"Remove the seton and advance a rectal flap\",\"isCorrect\":false,\"rationale\":\"A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.\",\"distractorRationale\":\"A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.\"}],\"explanation\":\"Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.anorectal-eua.low-tract-function\",\"claim.intraop.anorectal-eua.crohn-rectal-activity\",\"claim.intraop.anorectal-eua.crohn-flap\",\"claim.intraop.anorectal-eua.crohn-staging\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1\",\"questionVariantId\":\"question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1\",\"primaryConceptId\":\"concept.intraop.anorectal-eua.crohn-rectal-activity.v1\",\"currentUpdate\":\"EUA shows a single posterior tract beneath a thin distal sphincter bridge. The loose seton drains freely; palpation finds no fluid cavity. Her preoperative continence record documents control of gas, liquid and solid stool.\",\"stem\":\"Which tract-treatment plan should be used at this checkpoint in {patientName}’s current anorectal EUA?\",\"answerChoices\":[{\"id\":\"retain-seton\",\"label\":\"Keep the seton and defer tract closure\",\"isCorrect\":true,\"rationale\":\"The mucosal findings indicate current rectal inflammatory activity. Favorable tract geometry and function do not remove that concern; drainage can continue while medical control is reassessed.\",\"serviceRequest\":null},{\"id\":\"fistulotomy\",\"label\":\"Remove the seton and lay open the tract\",\"isCorrect\":false,\"rationale\":\"Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.\",\"serviceRequest\":null},{\"id\":\"rectal-flap\",\"label\":\"Remove the seton and advance a rectal flap\",\"isCorrect\":false,\"rationale\":\"A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed observations during the current EUA\",\"items\":[{\"label\":\"Internal opening\",\"value\":\"One opening; no branch is found on gentle examination.\"},{\"label\":\"Lower rectal mucosa\",\"value\":\"Several irregular ulcers with friable edges bleed on light contact.\"}]},\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"fistulotomy\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.\",\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"]},{\"answerChoiceId\":\"rectal-flap\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.\",\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1\",\"displayName\":\"Crohn fistula EUA checkpoints\",\"patientPresentationVariantId\":\"presentation.intraop.anorectal-eua.crohn-checkpoints.20261112.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Mara Ellison\",\"prototypeDemographics\":{\"ageYears\":48,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Fistula procedure\",\"presentation\":\"{patientName}, a 48-year-old woman with Crohn disease and a longstanding seton-drained fistula, is undergoing EUA with possible tract treatment in the clinic’s ambulatory OR. Her outpatient bowel symptoms had been considered controlled.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.anorectal-eua.crohn-checkpoints.20261112.v1\",\"prototypeDemographics\":{\"ageYears\":48,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Fistula procedure\",\"presentation\":\"{patientName}, a 48-year-old woman with Crohn disease and a longstanding seton-drained fistula, is undergoing EUA with possible tract treatment in the clinic’s ambulatory OR. Her outpatient bowel symptoms had been considered controlled.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"],\"decisionNodes\":[{\"id\":\"node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1\",\"questionVariantId\":\"question.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1\",\"primaryConceptId\":\"concept.intraop.anorectal-eua.crohn-rectal-activity.v1\",\"currentUpdate\":\"EUA shows a single posterior tract beneath a thin distal sphincter bridge. The loose seton drains freely; palpation finds no fluid cavity. Her preoperative continence record documents control of gas, liquid and solid stool.\",\"stem\":\"Which tract-treatment plan should be used at this checkpoint in {patientName}’s current anorectal EUA?\",\"answerChoices\":[{\"id\":\"retain-seton\",\"label\":\"Keep the seton and defer tract closure\",\"isCorrect\":true,\"rationale\":\"The mucosal findings indicate current rectal inflammatory activity. Favorable tract geometry and function do not remove that concern; drainage can continue while medical control is reassessed.\",\"serviceRequest\":null},{\"id\":\"fistulotomy\",\"label\":\"Remove the seton and lay open the tract\",\"isCorrect\":false,\"rationale\":\"Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.\",\"serviceRequest\":null},{\"id\":\"rectal-flap\",\"label\":\"Remove the seton and advance a rectal flap\",\"isCorrect\":false,\"rationale\":\"A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.\",\"exhibit\":{\"kind\":\"keyValue\",\"caption\":\"Constructed observations during the current EUA\",\"items\":[{\"label\":\"Internal opening\",\"value\":\"One opening; no branch is found on gentle examination.\"},{\"label\":\"Lower rectal mucosa\",\"value\":\"Several irregular ulcers with friable edges bleed on light contact.\"}]},\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"fistulotomy\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"Limited muscle crossing and intact continence favor this option in a selected low fistula, but Crohn-specific selection also requires attention to rectal activity.\",\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"]},{\"answerChoiceId\":\"rectal-flap\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review this decision; no patient outcome or new service is simulated.\",\"clinicalRationale\":\"A flap can avoid laying open the tract, but using inflamed rectal tissue does not solve the current closure problem.\",\"sourceLabels\":[\"ECCO Crohn surgical-treatment guideline (2024)\",\"ASCRS anorectal abscess and fistula guideline (2022)\"]}]}],\"learningSummary\":\"Apply the rectal findings as well as the tract map and continence record. Current ulceration argues for continued drainage and reassessment of medical control before closure. This is a staging decision, not a recommendation for indefinite seton treatment.\"}",
    "sourceQuestionSha256": "5d13c7af944efd5d739fa2482b4890885991399ca84350956d66c864fd74952a",
    "sourceNodeSha256": "2dbe16d9fa0627c3630a2c2b41d9cc83819e7c1da7d318cbe5dc870e687e87ca",
    "sourceCaseSha256": "148220997770fcc91535b8aa68f6ababc008b32350d2ca16eeee7229e3671957",
    "acceptedQuestionSha256": "5d13c7af944efd5d739fa2482b4890885991399ca84350956d66c864fd74952a",
    "acceptedNodeSha256": "2dbe16d9fa0627c3630a2c2b41d9cc83819e7c1da7d318cbe5dc870e687e87ca",
    "acceptedCaseSha256": "962af58a2588246ba0a84c276f8073024b85b846eefd39f36915a227d677167c",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1",
        "nodeId": "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "Known Crohn disease, a freely draining seton, no fluid cavity, favorable tract anatomy, preserved continence and the ulcerated/friable rectal mucosa are all visible in this standalone checkpoint. The removed later sampling decision contributes no fact needed for the current tract-treatment choice.",
          "The presentation does not label the current mucosa as active proctitis or recommend deferral. The contrast between previously controlled outpatient symptoms and current observed mucosal findings preserves the interpretation task.",
          "The adult ambulatory EUA with possible tract treatment is consistent with the presentation and current observations.",
          "Compared with the hash-matched source node, only terminal no-outcome metadata changes. The review2 PASS is verified; the stem, observations, choices and key remain unchanged: Keep the seton and defer tract closure."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "parathyroid-localization-and-preservation",
    "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
    "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
    "questionVariantId": "question.intraop.parathyroid.sample-integrity.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.parathyroid.sample-integrity.v1\",\"conceptId\":\"concept.intraop.parathyroid.sample-integrity.v1\",\"stem\":\"Which next test should guide completion of {patientName}'s parathyroid exploration after the supplied sampling record?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed operative sampling record\",\"columnHeaders\":[\"PTH (pg/mL)\",\"Collection record\"],\"rowHeaders\":[\"Before incision\",\"Before nodule excision\",\"10 minutes after excision\"],\"cells\":[[\"150\",\"Fresh peripheral venipuncture\"],[\"200\",\"Fresh peripheral venipuncture\"],[\"30\",\"Peripheral cannula flushed with saline; the first aspirate from its extension entered the assay tube\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.parathyroid.sample-integrity.1\",\"label\":\"PTH assay using newly collected venous blood.\",\"isCorrect\":true,\"rationale\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.parathyroid.sample-integrity.2\",\"label\":\"PTH assay using retained postexcision venous blood.\",\"isCorrect\":false,\"rationale\":\"Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.\",\"distractorRationale\":\"Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.\"},{\"id\":\"choice.intraop.parathyroid.sample-integrity.3\",\"label\":\"PTH assay using aspirate from the removed nodule.\",\"isCorrect\":false,\"rationale\":\"A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"distractorRationale\":\"A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\"}],\"shuffleAnswers\":true,\"explanation\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.parathyroid.miami-protocol\",\"claim.intraop.parathyroid.saline-contamination\",\"claim.intraop.parathyroid.recollect-before-extent\",\"claim.intraop.parathyroid.washout-identity\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.parathyroid.sample-integrity.v1\",\"questionVariantId\":\"question.intraop.parathyroid.sample-integrity.v1\",\"primaryConceptId\":\"concept.intraop.parathyroid.sample-integrity.v1\",\"currentUpdate\":\"An enlarged nodule has now been removed from the left thymic tongue in the neck. The operation remains open while the team reviews the sampling record. The team uses conventional Miami interpretation: a fall greater than 50% from the higher preincision or preexcision value at 10 minutes.\",\"stem\":\"Which next test should guide completion of {patientName}'s parathyroid exploration after the supplied sampling record?\",\"answerChoices\":[{\"id\":\"choice.intraop.parathyroid.sample-integrity.1\",\"label\":\"PTH assay using newly collected venous blood.\",\"isCorrect\":true,\"rationale\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.sample-integrity.2\",\"label\":\"PTH assay using retained postexcision venous blood.\",\"isCorrect\":false,\"rationale\":\"Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.sample-integrity.3\",\"label\":\"PTH assay using aspirate from the removed nodule.\",\"isCorrect\":false,\"rationale\":\"A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed operative sampling record\",\"columnHeaders\":[\"PTH (pg/mL)\",\"Collection record\"],\"rowHeaders\":[\"Before incision\",\"Before nodule excision\",\"10 minutes after excision\"],\"cells\":[[\"150\",\"Fresh peripheral venipuncture\"],[\"200\",\"Fresh peripheral venipuncture\"],[\"30\",\"Peripheral cannula flushed with saline; the initial aspirate from its extension entered the assay tube\"]]},\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.parathyroid.sample-integrity.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.\",\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"]},{\"answerChoiceId\":\"choice.intraop.parathyroid.sample-integrity.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.parathyroid.missing-gland-salvage.v1\",\"displayName\":\"Live parathyroidectomy: Simon Reed\",\"patientPresentationVariantId\":\"presentation.intraop.parathyroid.missing-gland-salvage.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Simon Reed\",\"prototypeDemographics\":{\"ageYears\":62,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Parathyroid surgery\",\"presentation\":\"{patientName}, a 62-year-old man with established sporadic primary hyperparathyroidism, is undergoing parathyroidectomy in the clinic's ambulatory OR.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.parathyroid.simon-reed-male62-salvage.v1\",\"prototypeDemographics\":{\"ageYears\":62,\"sexLabel\":\"Male\"},\"chiefComplaint\":\"Parathyroid surgery\",\"presentation\":\"{patientName}, a 62-year-old man with established sporadic primary hyperparathyroidism, is undergoing parathyroidectomy in the clinic's ambulatory OR.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"],\"decisionNodes\":[{\"id\":\"node.intraop.parathyroid.sample-integrity.v1\",\"questionVariantId\":\"question.intraop.parathyroid.sample-integrity.v1\",\"primaryConceptId\":\"concept.intraop.parathyroid.sample-integrity.v1\",\"currentUpdate\":\"An enlarged nodule has now been removed from the left thymic tongue in the neck. The operation remains open while the team reviews the sampling record. The team uses conventional Miami interpretation: a fall greater than 50% from the higher preincision or preexcision value at 10 minutes.\",\"stem\":\"Which next test should guide completion of {patientName}'s parathyroid exploration after the supplied sampling record?\",\"answerChoices\":[{\"id\":\"choice.intraop.parathyroid.sample-integrity.1\",\"label\":\"PTH assay using newly collected venous blood.\",\"isCorrect\":true,\"rationale\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.sample-integrity.2\",\"label\":\"PTH assay using retained postexcision venous blood.\",\"isCorrect\":false,\"rationale\":\"Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.sample-integrity.3\",\"label\":\"PTH assay using aspirate from the removed nodule.\",\"isCorrect\":false,\"rationale\":\"A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed operative sampling record\",\"columnHeaders\":[\"PTH (pg/mL)\",\"Collection record\"],\"rowHeaders\":[\"Before incision\",\"Before nodule excision\",\"10 minutes after excision\"],\"cells\":[[\"150\",\"Fresh peripheral venipuncture\"],[\"200\",\"Fresh peripheral venipuncture\"],[\"30\",\"Peripheral cannula flushed with saline; the initial aspirate from its extension entered the assay tube\"]]},\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.parathyroid.sample-integrity.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty.\",\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"]},{\"answerChoiceId\":\"choice.intraop.parathyroid.sample-integrity.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\",\"sourceLabels\":[\"Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism\",\"The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism\"]}]}],\"learningSummary\":\"Saline carried into the first aspirate can create a falsely low PTH. A new properly collected circulating sample, with its actual collection time recorded, is needed before interpreting the apparent decline as an operative endpoint. Rerunning the stored tube addresses an analytical error, but retains any saline dilution introduced during collection. Reproducibility of that value would not resolve the operative uncertainty. A nodule washout can establish parathyroid tissue identity. It cannot replace a valid circulating PTH trajectory when deciding whether further hyperfunctioning tissue remains.\"}",
    "sourceQuestionSha256": "8ba2b124795aa6f4cb74daa723a0b3c8ff499cb881efb6825818150970d294d4",
    "sourceNodeSha256": "810b6144fab1f52c24a344d4c0b7c57967548d6fcdb57cfaf0e3eec89a9bf7bf",
    "sourceCaseSha256": "b664590810ec73c8ffbf7c604123610e73cd9ff67825abe0beb8b1165e236e74",
    "acceptedQuestionSha256": "8ba2b124795aa6f4cb74daa723a0b3c8ff499cb881efb6825818150970d294d4",
    "acceptedNodeSha256": "810b6144fab1f52c24a344d4c0b7c57967548d6fcdb57cfaf0e3eec89a9bf7bf",
    "acceptedCaseSha256": "fb3c87bdae6738508d6cf22be659f0cf12e2538c7046a5403dac5ac766279d74",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.parathyroid.missing-gland-salvage.v1",
        "nodeId": "node.intraop.parathyroid.sample-integrity.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The presentation establishes sporadic primary hyperparathyroidism and ongoing parathyroidectomy. The update states that the cervical thymic-tongue nodule has been removed, and supplies the team's interpretation rule. The exhibit supplies both baseline values, the postexcision value and the collection circumstances. The earlier localization decision is unnecessary.",
          "Changing first aspirate to initial aspirate preserves the collection observation without calling the sample diluted or telling the learner to recollect. The added disease/procedure context does not disclose the key.",
          "A 62-year-old man at an open-operation sampling checkpoint during ambulatory parathyroidectomy is internally coherent; the removed nodule is explicitly in the neck.",
          "The original review PASS and receipt hash are verified. Comparison with the hash-matched source node finds only the declared exhibit synonym. The same sample-integrity decision remains keyed to PTH assay using newly collected venous blood."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "parathyroid-localization-and-preservation",
    "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
    "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
    "questionVariantId": "question.intraop.parathyroid.selective-salvage.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.parathyroid.selective-salvage.v1\",\"conceptId\":\"concept.intraop.parathyroid.selective-salvage.v1\",\"stem\":\"Which plan should be used for the two left parathyroid glands at the pre-closure checkpoint of {patientName}'s thyroidectomy?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed current field and specimen observations\",\"columnHeaders\":[\"Attachment and response\",\"Tissue identity\"],\"rowHeaders\":[\"Left upper gland\",\"Remaining left lower-gland tissue\"],\"cells\":[[\"Still attached by its vascular pedicle; initially dusky. After a small capsular incision, fresh blood oozes and the gland becomes pink.\",\"Recognized during dissection as normal parathyroid\"],[\"Found detached on the fresh sterile thyroid specimen; the remaining tissue is on the sterile field.\",\"Completed frozen section of a separate portion reports benign parathyroid tissue.\"]]},\"answerChoices\":[{\"id\":\"choice.intraop.parathyroid.selective-salvage.1\",\"label\":\"Retain the upper gland in situ and autotransplant the remaining lower-gland tissue into neck muscle.\",\"isCorrect\":true,\"rationale\":\"The upper gland retains its pedicle and shows inflow after decompression, supporting in-situ retention. The remaining lower tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting muscle autotransplantation of the remaining tissue.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.2\",\"label\":\"Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.\",\"isCorrect\":false,\"rationale\":\"Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.\",\"distractorRationale\":\"Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.\"},{\"id\":\"choice.intraop.parathyroid.selective-salvage.3\",\"label\":\"Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.\",\"isCorrect\":false,\"rationale\":\"Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.\",\"distractorRationale\":\"Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.\"},{\"id\":\"choice.intraop.parathyroid.selective-salvage.4\",\"label\":\"Autotransplant the upper gland into neck muscle and autotransplant the remaining lower-gland tissue into neck muscle.\",\"isCorrect\":false,\"rationale\":\"Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.\",\"distractorRationale\":\"Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.\"}],\"shuffleAnswers\":true,\"explanation\":\"The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.parathyroid.in-situ-function\",\"claim.intraop.parathyroid.color-limitation\",\"claim.intraop.parathyroid.reperfusion-observation\",\"claim.intraop.parathyroid.removed-gland-graft\",\"claim.intraop.parathyroid.muscle-graft-technique\",\"claim.intraop.parathyroid.tissue-confirmation\"]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.parathyroid.selective-salvage.v1\",\"questionVariantId\":\"question.intraop.parathyroid.selective-salvage.v1\",\"primaryConceptId\":\"concept.intraop.parathyroid.selective-salvage.v1\",\"currentUpdate\":\"At the pre-closure check after thyroid removal, the team examines the upper gland in the field and the lower-gland tissue on the fresh specimen. The portion used for frozen section is separate from the remaining lower-gland tissue.\",\"stem\":\"Which plan should be used for the two left parathyroid glands at the pre-closure checkpoint of {patientName}'s thyroidectomy?\",\"answerChoices\":[{\"id\":\"choice.intraop.parathyroid.selective-salvage.1\",\"label\":\"Retain the upper gland in situ and autotransplant the remaining lower-gland tissue into neck muscle.\",\"isCorrect\":true,\"rationale\":\"The upper gland retains its pedicle and shows inflow after decompression, supporting in-situ retention. The remaining lower tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting muscle autotransplantation of the remaining tissue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.2\",\"label\":\"Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.\",\"isCorrect\":false,\"rationale\":\"Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.3\",\"label\":\"Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.\",\"isCorrect\":false,\"rationale\":\"Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.4\",\"label\":\"Autotransplant the upper gland into neck muscle and autotransplant the remaining lower-gland tissue into neck muscle.\",\"isCorrect\":false,\"rationale\":\"Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed current field and specimen observations\",\"columnHeaders\":[\"Attachment and response\",\"Tissue identity\"],\"rowHeaders\":[\"Left upper gland\",\"Remaining left lower-gland tissue\"],\"cells\":[[\"Still attached by its vascular pedicle; initially dusky. After a small capsular incision, fresh blood oozes and the gland becomes pink.\",\"Recognized during dissection as normal parathyroid\"],[\"Found detached on the fresh sterile thyroid specimen; the retained tissue is on the sterile field.\",\"Completed frozen section of a separate portion reports benign parathyroid tissue.\"]]},\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.parathyroid.selective-salvage.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"]},{\"answerChoiceId\":\"choice.intraop.parathyroid.selective-salvage.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"]},{\"answerChoiceId\":\"choice.intraop.parathyroid.selective-salvage.4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.parathyroid.gland-preservation-salvage.v1\",\"displayName\":\"Live thyroidectomy: Lydia Hayes\",\"patientPresentationVariantId\":\"presentation.intraop.parathyroid.gland-preservation.v1\",\"releasePointId\":\"release.l3.ambulatory\",\"patientDisplayName\":\"Lydia Hayes\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Thyroid surgery\",\"presentation\":\"{patientName}, a 57-year-old woman, is undergoing total thyroidectomy for bilateral symptomatic nodular thyroid disease in the clinic's ambulatory OR.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.parathyroid.lydia-hayes-female57.v1\",\"prototypeDemographics\":{\"ageYears\":57,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Thyroid surgery\",\"presentation\":\"{patientName}, a 57-year-old woman, is undergoing total thyroidectomy for bilateral symptomatic nodular thyroid disease in the clinic's ambulatory OR.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":3,\"requiredClinicalSetting\":\"ambulatory_surgery\",\"requiredCapabilityIds\":[\"capability.ambulatory_or\",\"capability.staff.or_nurse\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"],\"decisionNodes\":[{\"id\":\"node.intraop.parathyroid.selective-salvage.v1\",\"questionVariantId\":\"question.intraop.parathyroid.selective-salvage.v1\",\"primaryConceptId\":\"concept.intraop.parathyroid.selective-salvage.v1\",\"currentUpdate\":\"At the pre-closure check after thyroid removal, the team examines the upper gland in the field and the lower-gland tissue on the fresh specimen. The portion used for frozen section is separate from the remaining lower-gland tissue.\",\"stem\":\"Which plan should be used for the two left parathyroid glands at the pre-closure checkpoint of {patientName}'s thyroidectomy?\",\"answerChoices\":[{\"id\":\"choice.intraop.parathyroid.selective-salvage.1\",\"label\":\"Retain the upper gland in situ and autotransplant the remaining lower-gland tissue into neck muscle.\",\"isCorrect\":true,\"rationale\":\"The upper gland retains its pedicle and shows inflow after decompression, supporting in-situ retention. The remaining lower tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting muscle autotransplantation of the remaining tissue.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.2\",\"label\":\"Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology.\",\"isCorrect\":false,\"rationale\":\"Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.3\",\"label\":\"Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology.\",\"isCorrect\":false,\"rationale\":\"Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.parathyroid.selective-salvage.4\",\"label\":\"Autotransplant the upper gland into neck muscle and autotransplant the remaining lower-gland tissue into neck muscle.\",\"isCorrect\":false,\"rationale\":\"Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed current field and specimen observations\",\"columnHeaders\":[\"Attachment and response\",\"Tissue identity\"],\"rowHeaders\":[\"Left upper gland\",\"Remaining left lower-gland tissue\"],\"cells\":[[\"Still attached by its vascular pedicle; initially dusky. After a small capsular incision, fresh blood oozes and the gland becomes pink.\",\"Recognized during dissection as normal parathyroid\"],[\"Found detached on the fresh sterile thyroid specimen; the retained tissue is on the sterile field.\",\"Completed frozen section of a separate portion reports benign parathyroid tissue.\"]]},\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.parathyroid.selective-salvage.2\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Transplanting the upper gland would disregard its current attached perfusion response. Submitting all remaining lower tissue for permanent histology would also forfeit the salvage opportunity after the supplied benign parathyroid report.\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"]},{\"answerChoiceId\":\"choice.intraop.parathyroid.selective-salvage.3\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Retaining the upper gland follows its current findings. Complete submission of the remaining lower tissue, rather than partial sampling followed by grafting, would remove the tissue available for salvage.\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"]},{\"answerChoiceId\":\"choice.intraop.parathyroid.selective-salvage.4\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"The proposed plan differs from the observed tissue or specimen findings; review the explanation.\",\"clinicalRationale\":\"Autotransplantation addresses the detached lower tissue. Removing the upper gland responds to its earlier discoloration rather than its retained pedicle and subsequent inflow response.\",\"sourceLabels\":[\"Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism\",\"Preservation of parathyroid glands during thyroid and neck surgery\",\"The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery\"]}]}],\"learningSummary\":\"The attached upper gland shows fresh inflow after decompression, supporting retention in situ. The remaining lower-gland tissue is detached and sterile, with benign parathyroid reported in the sampled portion, supporting salvage by muscle autotransplantation. Transplanting the upper gland would disregard its current response. Submitting all remaining lower tissue for permanent histology would forfeit that salvage option. These observations do not guarantee long-term gland or graft function.\"}",
    "sourceQuestionSha256": "e645d30b121896514ba365ed06deb5c36cde666e3a3d860eec8243addad45814",
    "sourceNodeSha256": "41410757bdc392961f9896f3fe509275f72df75da0cf6ca03a021e146b8063c6",
    "sourceCaseSha256": "f01ac26a5133aa4692c9437bc5df5f46169dddad1badaa9c82709402436d3da1",
    "acceptedQuestionSha256": "e645d30b121896514ba365ed06deb5c36cde666e3a3d860eec8243addad45814",
    "acceptedNodeSha256": "41410757bdc392961f9896f3fe509275f72df75da0cf6ca03a021e146b8063c6",
    "acceptedCaseSha256": "1c3091fd4b0b877fc618b21d08b243fbaef901822d2bc258d4f6163f548f99d6",
    "review": {
      "path": "docs/research/question-intraop-salvage-review-20261113.json",
      "record": {
        "caseId": "case.intraop.parathyroid.gland-preservation-salvage.v1",
        "nodeId": "node.intraop.parathyroid.selective-salvage.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The standalone thyroidectomy presentation, pre-closure update and exhibit specify both glands' current states: an attached upper gland with fresh bleeding and recovered color, and detached lower-gland tissue retained sterile after a separate portion confirmed benign parathyroid tissue. The earlier branch-control decision is not needed.",
          "Retained tissue describes tissue still available on the sterile field; it does not instruct the learner to retain either gland in situ or disclose autotransplantation. The observation-only substitution for remaining tissue preserves meaning.",
          "The 57-year-old woman's total thyroidectomy for bilateral symptomatic nodular disease and subsequent field/specimen check form a coherent ambulatory operative scene.",
          "The review2 PASS and receipt hash are verified. Only the declared exhibit synonym differs from the hash-matched source node. The key remains retaining the upper gland in situ and autotransplanting the remaining lower-gland tissue into neck muscle."
        ],
        "suggestions": []
      }
    }
  },
  {
    "group": "salvage",
    "slug": "polypectomy-technique-and-bleeding",
    "caseId": "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
    "nodeId": "node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "questionVariantId": "question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
    "sourceQuestionJson": "{\"contentVersion\":\"clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1\",\"reviewStatus\":\"needs_clinician_review\",\"aiAssistedDrafting\":true,\"lastClinicianReview\":null,\"id\":\"question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"conceptId\":\"concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"stem\":\"Before ending {patientName}'s ascending-colon EMR, which completion plan should be used for the resection bed?\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed endoscopy observations\",\"columnHeaders\":[\"Observed finding\"],\"rowHeaders\":[\"Defect\",\"Base\"],\"cells\":[[\"The mucosal defect spans 30 mm. Its edges come together as insufflation is reduced.\"],[\"Blue-stained fibers extend across the bed. Two small vessels are visible, with no bleeding after irrigation.\"]]},\"explanation\":\"The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.\",\"supportingEvidenceClaimIds\":[\"claim.intraop.polypectomy.right-colon-defect-closure\",\"claim.intraop.polypectomy.vessel-coagulation-boundary\",\"claim.intraop.polypectomy.intraprocedural-bleeding-tools\"],\"answerChoices\":[{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.close.20261112.v1\",\"label\":\"Close the mucosal defect with endoscopic clips\",\"isCorrect\":true,\"rationale\":\"This is the large proximal EMR setting in which prophylactic defect closure is supported. Cessation of bleeding does not remove the separate purpose of reducing later hemorrhage.\",\"distractorRationale\":null},{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1\",\"label\":\"Treat the exposed vessels with coagulation forceps\",\"isCorrect\":false,\"rationale\":\"Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.\",\"distractorRationale\":\"Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.\"},{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1\",\"label\":\"Leave the mucosal defect open following inspection\",\"isCorrect\":false,\"rationale\":\"Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.\",\"distractorRationale\":\"Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.\"}]}",
    "sourceNodeJson": "{\"id\":\"node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"questionVariantId\":\"question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"primaryConceptId\":\"concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"currentUpdate\":\"The raised tongue has been retrieved by snare. Reinspection shows no matching tubular surface remaining; adjuvant treatment of the clear mucosal edge has been completed. The scope remains at the ascending-colon site.\",\"stem\":\"Before ending {patientName}'s ascending-colon EMR, which completion plan should be used for the resection bed?\",\"answerChoices\":[{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.close.20261112.v1\",\"label\":\"Close the mucosal defect with endoscopic clips\",\"isCorrect\":true,\"rationale\":\"This is the large proximal EMR setting in which prophylactic defect closure is supported. Cessation of bleeding does not remove the separate purpose of reducing later hemorrhage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1\",\"label\":\"Treat the exposed vessels with coagulation forceps\",\"isCorrect\":false,\"rationale\":\"Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1\",\"label\":\"Leave the mucosal defect open following inspection\",\"isCorrect\":false,\"rationale\":\"Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed endoscopy observations\",\"columnHeaders\":[\"Observed finding\"],\"rowHeaders\":[\"Defect\",\"Base\"],\"cells\":[[\"The mucosal defect spans 30 mm. Its edges come together as insufflation is reduced.\"],[\"Blue-stained fibers extend across the bed. Two small vessels are visible, with no bleeding after irrigation.\"]]},\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the observed findings and treatment choice before continuing; no complication outcome is simulated.\",\"clinicalRationale\":\"Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.\",\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"]},{\"answerChoiceId\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the observed findings and treatment choice before continuing; no complication outcome is simulated.\",\"clinicalRationale\":\"Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.\",\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"]}]}",
    "sourceCaseJson": "{\"id\":\"case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1\",\"displayName\":\"Colonoscopy\",\"patientPresentationVariantId\":\"presentation.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1\",\"releasePointId\":\"release.l2.endoscopy\",\"patientDisplayName\":\"Maya Dalton\",\"prototypeDemographics\":{\"ageYears\":60,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 60-year-old woman, is undergoing piecemeal hot-snare EMR of a 28-mm ascending-colon adenoma in the clinic's endoscopy room. Before snare retrieval, a raised residual mucosal tongue at the resection edge showed tubular surface openings on image-enhanced inspection.\",\"approvedInstantiationProfiles\":[{\"id\":\"profile.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1\",\"prototypeDemographics\":{\"ageYears\":60,\"sexLabel\":\"Female\"},\"chiefComplaint\":\"Colonoscopy\",\"presentation\":\"{patientName}, a 60-year-old woman, is undergoing piecemeal hot-snare EMR of a 28-mm ascending-colon adenoma in the clinic's endoscopy room. Before snare retrieval, a raised residual mucosal tongue at the resection edge showed tubular surface openings on image-enhanced inspection.\"}],\"tutorialEligible\":false,\"routineEligible\":false,\"earliestFacilityStage\":2,\"requiredClinicalSetting\":\"endoscopy\",\"requiredCapabilityIds\":[\"capability.endoscopy\",\"capability.periop_recovery\"],\"rewardTierId\":\"reward.clinic_basic\",\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"],\"decisionNodes\":[{\"id\":\"node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"questionVariantId\":\"question.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"primaryConceptId\":\"concept.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1\",\"currentUpdate\":\"The raised tongue has been retrieved by snare. Reinspection shows no matching tubular surface remaining; adjuvant treatment of the clear mucosal edge has been completed. The scope remains at the ascending-colon site.\",\"stem\":\"Before ending {patientName}'s ascending-colon EMR, which completion plan should be used for the resection bed?\",\"answerChoices\":[{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.close.20261112.v1\",\"label\":\"Close the mucosal defect with endoscopic clips\",\"isCorrect\":true,\"rationale\":\"This is the large proximal EMR setting in which prophylactic defect closure is supported. Cessation of bleeding does not remove the separate purpose of reducing later hemorrhage.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1\",\"label\":\"Treat the exposed vessels with coagulation forceps\",\"isCorrect\":false,\"rationale\":\"Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.\",\"serviceRequest\":null},{\"id\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1\",\"label\":\"Leave the mucosal defect open following inspection\",\"isCorrect\":false,\"rationale\":\"Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.\",\"serviceRequest\":null}],\"shuffleAnswers\":true,\"explanation\":\"The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.\",\"exhibit\":{\"kind\":\"table\",\"caption\":\"Constructed endoscopy observations\",\"columnHeaders\":[\"Observed finding\"],\"rowHeaders\":[\"Defect\",\"Base\"],\"cells\":[[\"The mucosal defect spans 30 mm. Its edges come together as insufflation is reduced.\"],[\"Blue-stained fibers extend across the bed. Two small vessels are visible, with no bleeding after irrigation.\"]]},\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"],\"resultGateAfter\":null,\"terminalDispositions\":[{\"answerChoiceId\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.vessels.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the observed findings and treatment choice before continuing; no complication outcome is simulated.\",\"clinicalRationale\":\"Preventive vessel coagulation has not established the benefit sought from closing a large proximal defect. The vessels described are not currently bleeding.\",\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"]},{\"answerChoiceId\":\"choice.intraop.polypectomy.right-colon-defect-after-clearance.observe.20261112.v1\",\"kind\":\"no_terminal_outcome\",\"consequenceNarrative\":\"Review the observed findings and treatment choice before continuing; no complication outcome is simulated.\",\"clinicalRationale\":\"Selective omission of clips can be reasonable after other resections, but a clear, dry bed does not erase the large right-colon EMR indication offered here.\",\"sourceLabels\":[\"USMSTF endoscopic removal of colorectal lesions (2020)\",\"Academy of Medicine Singapore colonic-polyp guidance (2022)\"]}]}],\"learningSummary\":\"The visible lesion and margin have been addressed, so this is now a defect-management decision. For a right-colon EMR defect at least 20 mm in size, closure is supported when approximation is possible. A dry base is not the same as absence of delayed-bleeding risk. Preventive coagulation of nonbleeding vessels has not established the same benefit.\"}",
    "sourceQuestionSha256": "4abe1b3aeca837de5fa2c400959c415ab4dc439c2290552d38ebba0fcc97dee3",
    "sourceNodeSha256": "32c4b69e378927d3677f9fbc09793921346e3874f01bf47f37556bee6a5d0b4d",
    "sourceCaseSha256": "41825207ab24b8be824eb112658c9d09930049cf718bf70088254f93c9d6307b",
    "acceptedQuestionSha256": "4abe1b3aeca837de5fa2c400959c415ab4dc439c2290552d38ebba0fcc97dee3",
    "acceptedNodeSha256": "32c4b69e378927d3677f9fbc09793921346e3874f01bf47f37556bee6a5d0b4d",
    "acceptedCaseSha256": "02fa2324bccf5f81f5aff80b0c891906917ee6db0961c9e2bea98aeea6441096",
    "review": {
      "path": "docs/research/question-intraop-salvage-review2-20261113.json",
      "record": {
        "caseId": "case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1",
        "nodeId": "node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1",
        "verdict": "PASS",
        "clarityIssues": [],
        "cues": [],
        "fairness": [
          "The added sentence identifies a raised residual mucosal tongue at the resection edge and its tubular surface openings before snare retrieval. Both antecedents in the retained update now have explicit referents. The update then states retrieval, absence of the matching surface on reinspection and completed clear-margin treatment. No removed question, exhibit or answer feedback is needed to understand the completion checkpoint.",
          "The standalone presentation supplies piecemeal hot-snare EMR of a 28-mm ascending-colon adenoma. The retained exhibit supplies the 30-mm defect, approximating edges and nonbleeding vessels after irrigation. Together with completed lesion and margin treatment, these state the facts needed for the previously reviewed defect-management decision. The canonical presentation and finite profile contain identical repaired context, and the Markdown records the same added sentence.",
          "The added observation does not mention clips, recommend closure, explain delayed-bleeding prevention or echo a completion-plan answer. It identifies what was removed and what reinspection compares against. Calling the earlier tongue residual does not disclose the current defect-management key. The retained apposition and nonbleeding findings remain relevant decision evidence rather than new wrapper cues.",
          "Maya Dalton remains a 60-year-old woman undergoing therapeutic colonoscopy with EMR in the clinic endoscopy room, with endoscopy and perioperative recovery capabilities specified. The sequence from residual-tissue retrieval through reinspection and margin treatment to defect management is internally coherent. This is an adult case; pediatric age and parent-presence requirements do not apply.",
          "Direct comparison confirms that the entire retained node and question equal both the archived pre-fix salvage versions and the original exportsSnapshot versions. The original independent review contains PASS for this node, and its file SHA-256 matches the recorded receipt. The decision, choices, correctness flags, update, exhibit and explanation are unchanged. The key remains Close the mucosal defect with endoscopic clips.",
          "This verdict addresses only the repaired standalone context and preservation of the previously reviewed decision using local artifacts. It does not revalidate medical sources or grant clinical approval; needs_clinician_review remains applicable."
        ],
        "suggestions": []
      }
    }
  }
];
export const PROGRAM_BATCH11_CORRECTIONS = [
  {
    "path": "case.intraop.parathyroid.missing-gland-salvage.v1.displayName",
    "before": "Live parathyroidectomy: Simon Reed",
    "after": "Live parathyroidectomy: {patientName}",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "case.intraop.parathyroid.gland-preservation-salvage.v1.displayName",
    "before": "Live thyroidectomy: Lydia Hayes",
    "after": "Live thyroidectomy: {patientName}",
    "kind": "patient_name_placeholder"
  },
  {
    "path": "node.intraop.parathyroid.selective-salvage.v1.timing.choice.intraop.parathyroid.selective-salvage.2",
    "kind": "runtime_timing_profile_mapping",
    "before": "timing.test.biopsy_pathology",
    "after": "timing.test.pathology_review"
  },
  {
    "path": "node.intraop.parathyroid.selective-salvage.v1.timing.choice.intraop.parathyroid.selective-salvage.3",
    "kind": "runtime_timing_profile_mapping",
    "before": "timing.test.biopsy_pathology",
    "after": "timing.test.pathology_review"
  }
];
export const PROGRAM_BATCH11_CLAIMS:Array<EvidenceClaim & Record<string,unknown>> = [
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.ambulatory-drainage",
    "statement": "A stable adult with a localized perianal abscess may undergo ambulatory drainage.",
    "sourceIds": [
      "source.intraop.anorectal-eua.wses-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Individual suitability, staffing and anesthesia assessment are still required; no size or vital-sign cutoff is proposed.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "WSES section 1.C"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.unconfirmed-tract",
    "statement": "During acute abscess drainage, a suspected fistula that cannot be demonstrated is not an indication for deliberate probing through unestablished tissue planes.",
    "sourceIds": [
      "source.intraop.anorectal-eua.wses-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "One adequate guideline directly supports this exact exploration boundary; independent procedural corroboration was not obtained.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "WSES section 1.E"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.acute-distortion",
    "statement": "Inflammatory distortion around an acute abscess can make exploratory probing create an unintended passage.",
    "sourceIds": [
      "source.intraop.anorectal-eua.wses-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "This describes a potential harm, not a measured risk or an inevitable outcome.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "WSES section 1.E"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.low-tract-function",
    "statement": "An established simple low fistula with preserved continence can be suitable for lay-open treatment in selected patients.",
    "sourceIds": [
      "source.anorectal-benign-pelvic-floor.ascrs-abscess-2022",
      "source.intraop.anorectal-eua.ecco-surgery-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The reused ASCRS source was accessed 2026-11-11; mapping was checked locally 2026-11-12. In Crohn disease the rectal inflammatory state adds a separate eligibility condition.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "Prior local claim: claim.anorectal-benign-pelvic-floor.fistulotomy-boundary",
      "ECCO surgical Statement 3.10"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.crohn-rectal-activity",
    "statement": "In Crohn fistula care, current rectal inflammation changes the suitability and timing of tract closure even when the tract is low and continence is preserved.",
    "sourceIds": [
      "source.intraop.anorectal-eua.ecco-surgery-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified disease-specific guideline; comparative studies are limited. The draft uses marked current ulceration rather than asserting a universal endoscopic threshold.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "ECCO surgical Statement 3.10 and section 3.4"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.crohn-flap",
    "statement": "A rectal advancement flap is a selected closure option in Crohn fistula care when proctitis is absent.",
    "sourceIds": [
      "source.intraop.anorectal-eua.ecco-surgery-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly verified disease-specific guideline; the statement does not establish the best flap technique or a healing probability.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "ECCO surgical Statement 3.11"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.crohn-staging",
    "statement": "A loose draining seton can preserve fistula drainage while medical and surgical care for Crohn disease is coordinated.",
    "sourceIds": [
      "source.intraop.anorectal-eua.ecco-surgery-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Staging is not a claim that an indefinite seton by itself cures Crohn fistulizing disease. No drug choice or seton-removal interval is authored.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "ECCO surgical Statement 3.17 and section 3.4"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.changed-symptoms",
    "statement": "Changed anal symptoms in chronic perianal Crohn disease warrant renewed evaluation for a possible fistula-associated malignancy.",
    "sourceIds": [
      "source.intraop.anorectal-eua.ecco-malignancy-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "The relevant recommendation relies on expert opinion and rare-disease data; symptoms are not diagnostic of cancer. No surveillance interval or risk percentage is proposed.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "ECCO malignancy Statement 4"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.suspicious-tissue",
    "statement": "A suspicious lesion found during reassessment of chronic perianal Crohn disease should be sampled, including tract sampling under anesthesia when required.",
    "sourceIds": [
      "source.intraop.anorectal-eua.ecco-malignancy-2023",
      "source.intraop.anorectal-eua.kaneshiro-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "The independent source is an illustrative case report, not comparative evidence for a particular biopsy depth, number or technique.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "ECCO malignancy section 2.2",
      "Kaneshiro case presentation"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.sampling-provenance",
    "statement": "A benign result from one sampled anorectal site does not determine the histology of a separate abnormal tract focus.",
    "sourceIds": [
      "source.intraop.anorectal-eua.kaneshiro-2023",
      "source.intraop.anorectal-eua.ecco-malignancy-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "This is a specimen-provenance inference supported by the distinct specimen diagnoses in one case report and the guideline requirement to sample suspicious lesions. It is not a claimed false-negative rate.",
    "applicablePopulation": "Adults undergoing anorectal EUA; Crohn-specific claims apply only to the explicitly described Crohn case.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "Kaneshiro separate rectal and tract specimens",
      "ECCO malignancy section 2.2"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.known-tract-seton",
    "statement": "When an obvious fistula encountered at abscess drainage involves sphincter muscle, a loose draining seton is an option for staged care.",
    "sourceIds": [
      "source.intraop.anorectal-eua.wses-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "WSES recommendation is weak and based on low-quality evidence. This does not justify searching for an unconfirmed passage.",
    "applicablePopulation": "Adults with an obvious muscle-involving fistula at anorectal abscess drainage.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "WSES section 1.E"
    ]
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.anorectal-eua.open-drainage",
    "statement": "The incision used for anorectal abscess drainage must continue to provide drainage as the wound heals.",
    "sourceIds": [
      "source.intraop.anorectal-eua.wses-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One guideline supplies the targeted open-drainage principle; no packing, catheter, closure interval or healing timetable is selected.",
    "applicablePopulation": "Adults after operative drainage of a localized anorectal abscess.",
    "lastCheckedOn": "2026-11-12",
    "verificationLocators": [
      "WSES sections 1.C and 1.D: maintaining drainage and preventing premature skin closure; section 1.E: unconfirmed fistula boundary"
    ]
  },
  {
    "contentVersion": "question-topic.anorectal-benign-pelvic-floor.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.anorectal-benign-pelvic-floor.complex-fistula-imaging-comparison",
    "statement": "MRI can offer an advantage for secondary extensions in complex fistulas; expert three-dimensional endoanal ultrasound also evaluates fistulas and should not be characterized as limited to old sphincter defects.",
    "sourceIds": [
      "source.anorectal-benign-pelvic-floor.ascrs-abscess-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Exact patient-specific comparison remains needs_clinician_review. One guideline may supply the deciding comparative atom; source plurality is not represented as trial-level corroboration.",
    "applicablePopulation": "Adults in the represented diagnostic or treatment phase.",
    "lastCheckedOn": "2026-11-11",
    "localMappingCheckedOn": "2026-11-11",
    "verificationLocator": "Initial evaluation, imaging discussion; comparative secondary-extension evidence; targeted current public read",
    "questionVariantIds": [
      "question.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri.v2"
    ],
    "currentQuestionVariantIds": [
      "question.topic.anorectal-benign-pelvic-floor.recurrent-fistula-mri.v2"
    ],
    "offlineReuse": {
      "originalLedger": "docs/research/sources-question-topic-anorectal-benign-pelvic-floor-20261111.json",
      "originalLastCheckedOn": "2026-11-11",
      "currentMappingCheckedOn": "2026-11-12",
      "scope": "Use the ASCRS MRI secondary-extension comparison to justify the credible MRI-first alternative and its counterfactual; no fresh ASCRS retrieval or biopsy-yield claim."
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.inferior-thymic-route",
    "statement": "The developmental route shared by inferior parathyroid tissue and thymus makes the thyrothymic tract and thymus relevant sites for a missing inferior gland.",
    "sourceIds": [
      "source.intraop.parathyroid.tay-2021",
      "source.intraop.parathyroid.uludag-2019"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Location is variable; this does not prove a particular patient has an intrathymic adenoma.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.inferior-search-sequence",
    "statement": "After an inferior gland is absent from the exposed lower-pole region, cervical thyrothymic exploration is a supported next search before more remote ectopic dissections.",
    "sourceIds": [
      "source.intraop.parathyroid.uludag-2019",
      "source.intraop.parathyroid.tay-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Search-order recommendation rests on one technical review, with anatomical corroboration rather than an independent comparative guideline.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.superior-search-region",
    "statement": "Paraesophageal and retroesophageal regions are recognized ectopic search sites for superior parathyroid tissue.",
    "sourceIds": [
      "source.intraop.parathyroid.uludag-2019",
      "source.intraop.parathyroid.tay-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "No nerve-relation classification or absolute superior/inferior identity is taught.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.intrathyroid-evidence",
    "statement": "Failure to find an expected gland is insufficient evidence for an intrathyroidal target; less destructive ectopic search and directed confirmation precede empirical thyroid resection.",
    "sourceIds": [
      "source.intraop.parathyroid.uludag-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate technical review. It describes reported empirical resection but cautions against blind procedures; no universal prohibition on thyroid surgery.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.miami-protocol",
    "statement": "Conventional Miami interpretation compares the PTH result obtained 10 minutes after excision with the higher preincision or preexcision value and uses a decline greater than 50 percent.",
    "sourceIds": [
      "source.intraop.parathyroid.khan-lew-2019",
      "source.intraop.parathyroid.barczynski-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Applies to the stated protocol and an adequately collected sample in sporadic PHPT; meeting it predicts an endpoint, not guaranteed durable cure.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.saline-contamination",
    "statement": "Saline carried from an intravenous line into a PTH specimen can dilute the sample and produce a falsely low measured PTH.",
    "sourceIds": [
      "source.intraop.parathyroid.khan-lew-2019",
      "source.intraop.parathyroid.barczynski-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The size of the error is not inferable from a flush history; no correction factor or sample-discard volume is authored.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.recollect-before-extent",
    "statement": "When collection details raise a substantive dilution concern, a properly collected repeat PTH is needed before using the apparent fall to decide operative completion or further gland exploration.",
    "sourceIds": [
      "source.intraop.parathyroid.khan-lew-2019",
      "source.intraop.parathyroid.barczynski-2015"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Clinical synthesis of sample-integrity requirements, not a directly tested universal resampling algorithm; exact collection protocol and follow-up interval require the endocrine/anesthesia team.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.capsular-vessel-division",
    "statement": "Dividing thyroid-bound terminal vessels close to the thyroid capsule can retain parathyroid perfusion that proximal common-vessel ligation would interrupt.",
    "sourceIds": [
      "source.intraop.parathyroid.rao-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate direct technical review for this exact branch comparison; applies to the observed branching anatomy, not an assertion of identical arterial supply in all patients.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.in-situ-function",
    "statement": "A parathyroid gland with a retained functioning blood supply is preferentially preserved in situ during thyroid surgery.",
    "sourceIds": [
      "source.intraop.parathyroid.jaes-2025",
      "source.intraop.parathyroid.rao-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Macroscopic viability assessment is imperfect; preservation does not guarantee normal postoperative function.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.color-limitation",
    "statement": "Discoloration of a parathyroid gland does not by itself establish irreversible loss of viability.",
    "sourceIds": [
      "source.intraop.parathyroid.rao-2023",
      "source.intraop.parathyroid.uludag-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No color threshold or duration predicts permanent function; assess the pedicle and observed perfusion response.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.reperfusion-observation",
    "statement": "Capsular decompression followed by fresh oozing and improvement in gland color supports persisting arterial inflow and relief of congestion.",
    "sourceIds": [
      "source.intraop.parathyroid.uludag-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single direct technical review; these observations do not certify future function. No mandatory diagnostic incision is prescribed for every gland.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.removed-gland-graft",
    "statement": "A benign parathyroid gland inadvertently removed with a thyroid specimen is a candidate for intraoperative autotransplantation rather than disposal with the thyroid.",
    "sourceIds": [
      "source.intraop.parathyroid.jaes-2025",
      "source.intraop.parathyroid.rao-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "JAES strong recommendation is based on low-certainty evidence. Histological identity, suitability and specimen sterility must be checked; graft success is not guaranteed.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.muscle-graft-technique",
    "statement": "Confirmed parathyroid tissue can be divided into small fragments and placed in a well-perfused muscle pocket, including sternocleidomastoid, for autotransplantation.",
    "sourceIds": [
      "source.intraop.parathyroid.jaes-2025",
      "source.intraop.parathyroid.rao-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exact fragment size, number of pockets or universal preference over forearm grafting is authored.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.tissue-confirmation",
    "statement": "Histological confirmation of suspected parathyroid tissue can support selection of tissue for autotransplantation.",
    "sourceIds": [
      "source.intraop.parathyroid.rao-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Single reviewed technical description. The case supplies a completed frozen-section report of benign parathyroid; no claim that morphology or PTH establishes absence of malignancy.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroid surgery, as specified by the claim; no pediatric inference.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.washout-identity",
    "statement": "PTH measured in a nodule needle washout can identify parathyroid tissue; it does not establish that all hyperfunctioning tissue has been removed.",
    "sourceIds": [
      "source.intraop.parathyroid.khan-lew-2019",
      "source.intraop.parathyroid.barczynski-2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Tissue identity and the postoperative biochemical prediction from circulating PTH dynamics are different uses of the assay.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.r1.sonographic-parathyroid-pattern",
    "statement": "A hypoechoic candidate with a polar feeding vessel and peripheral vascularity has a recognized parathyroid localization pattern.",
    "sourceIds": [
      "source.intraop.parathyroid.tay-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This pattern supports localization but does not prove histology or functional completeness; not every parathyroid gland has this appearance.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroidectomy as specified.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.r1.sonographic-node-pattern",
    "statement": "An echogenic fatty hilum with centrally entering hilar vessels is a recognized sonographic lymph-node pattern that can help distinguish a nodule from a parathyroid candidate.",
    "sourceIds": [
      "source.intraop.parathyroid.tay-2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single clinical review; the pattern is not an absolute exclusion rule and a node-like focus is not declared histologically benign.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroidectomy as specified.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.r1.high-inferior-search",
    "statement": "An inferior parathyroid gland not found in the expected lower-neck sites can be undescended near the carotid bifurcation or adjacent high neck.",
    "sourceIds": [
      "source.intraop.parathyroid.uludag-2019",
      "source.intraop.parathyroid.tay-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomical possibility, not a universal next-site priority; the revised case additionally supplies an imaging candidate.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroidectomy as specified.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.r1.directed-search-ranking",
    "statement": "When operative exposure and imaging disagree, the remaining neck search should be correlated with the current localization observations rather than fixed to the initial projected site.",
    "sourceIds": [
      "source.intraop.parathyroid.tay-2021",
      "source.intraop.parathyroid.uludag-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Clinical synthesis applied to the constructed observations, not a comparative trial of a universal search sequence. Histology and biochemical completeness remain separate.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroidectomy as specified.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.parathyroid.r1.shared-bridge-division",
    "statement": "For the described arterial bifurcation, dividing the thyroid-bound limb after it separates from the parathyroid limb retains the latter inflow; dividing the common stem or entire bridge interrupts it.",
    "sourceIds": [
      "source.intraop.parathyroid.rao-2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Conditional application of the supplied vessel connections, not a measured probability or a claim that all parathyroid blood supply follows this pattern.",
    "applicablePopulation": "Adults undergoing cervical parathyroidectomy for sporadic PHPT or thyroidectomy as specified.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.visible-remnant-resection",
    "statement": "During EMR, remaining macroscopic adenomatous tissue that is amenable to snare capture should be removed by snare before the resection is considered complete.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly checked multisociety publication; its snare-completion recommendation has low-quality supporting evidence. This does not rank bailout methods for a non-ensnarable remnant.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.visible-remnant-not-ablation",
    "statement": "Surface thermal ablation is not a substitute for excision of visible adenoma that remains after snare resection.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly checked guideline for the exact visible-remnant boundary. The offered remnant lifts and has not failed snare capture. No APC-versus-avulsion claim is made.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.clear-margin-adjuvant",
    "statement": "After removal of all visible adenoma, adjunctive thermal treatment of the post-EMR mucosal margin can reduce local recurrence.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020",
      "source.intraop.polypectomy.ams-polyp-guidance-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Adjuvant treatment of a clear edge is a different task from destruction of visible residual tissue. No specific modality, generator setting, width or superiority comparison is taught.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.right-colon-defect-closure",
    "statement": "After EMR of a large nonpedunculated lesion in the right colon, prophylactic closure of a defect at least 20 mm across is supported when the edges can be approximated.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020",
      "source.intraop.polypectomy.ams-polyp-guidance-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "USMSTF conditional recommendation with moderate-quality evidence; Singapore guidance supports selective high-risk/proximal closure. Not routine clipping of every polypectomy, and no benefit is guaranteed for an individual.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.vessel-coagulation-boundary",
    "statement": "Prophylactic coagulation of nonbleeding visible vessels in a large EMR bed has not established the delayed-bleeding benefit of defect closure.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One directly checked guideline reports a randomized trial without a significant reduction. This is not proof that coagulation never helps; it does not limit treatment of an actively bleeding vessel.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.intraprocedural-bleeding-tools",
    "statement": "Mechanical clips and targeted endoscopic coagulation are accepted tools for intraprocedural polypectomy bleeding.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One guideline; conditional recommendation with low-quality evidence. There is no universal clip-versus-coagulation ranking for an uncomplicated bleeding point.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.advanced-emr-expertise",
    "statement": "Large nonpedunculated colorectal lesions should be managed by an endoscopist experienced in advanced polypectomy.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One directly checked guideline; capability.endoscopy by itself does not establish advanced EMR expertise or complication rescue support.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.short-stalk-loop-slippage",
    "statement": "A short stalk can fail to retain a detachable loop after polyp removal; observed loss of purchase can change the choice of mechanical hemostasis.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly checked guideline summarizes device slippage with short stalks. The observed failed attempts, not a newly invented stalk-length threshold, select the alternative here. Exact clip capture requires clinician review.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.stalk-mechanical-hemostasis",
    "statement": "Clips and detachable loops can compress pedunculated-polyp stalk vessels, and the achieved tissue capture matters when choosing between them.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020",
      "source.intraop.polypectomy.ams-polyp-guidance-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The Singapore detailed device comparison concerns prophylaxis; USMSTF also supports mechanical therapy for actual intraprocedural bleeding. The scored use after observed slippage is a scenario-specific application, not proof of general clip superiority.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.injection-as-adjunct",
    "statement": "USMSTF describes dilute epinephrine as an optional adjunct to mechanical or coagulation treatment for intraprocedural bleeding.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One conditional guideline recommendation with low-quality evidence. No dose, concentration, duration, independent injection-monotherapy comparison or universal tool ranking is taught.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.adenomatous-optical-pattern",
    "statement": "An adenomatous epithelial surface can show a brown vascular network enclosing pale oval, tubular or branching structures and a browner appearance than surrounding mucosa.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly checked guideline for the documented optical findings. Optical appearance is not histologic confirmation and this constructed written record does not measure image-reading skill.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.submucosal-fiber-plane",
    "statement": "Submucosal injection dye highlights exposed submucosal fibers during colorectal EMR; a fibrous bed contour is distinct from a remaining epithelial surface.",
    "sourceIds": [
      "source.intraop.polypectomy.usmstf-removal-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One directly checked guideline describes differential staining and the submucosal plane. The combination of documented fibers and absence of epithelial openings is used here; blue color or elevation alone does not diagnose a remnant or injury.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.stalk-clip-capture",
    "statement": "For a bleeding pedunculated-polyp stalk, expert technical guidance favors transverse clip capture at the stalk base to compress the feeder vessels.",
    "sourceIds": [
      "source.intraop.polypectomy.gutta-gromski-bleeding-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One expert technical review for the exact placement rule, not a comparative efficacy trial. This supports a focused preferred-technique question, not a universal claim that another clip placement cannot work.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.intraop.polypectomy.sessile-bleeding-clip-target",
    "statement": "For bleeding after sessile polyp removal, clip treatment aims to tamponade the underlying vessel, with opposing mucosal capture when feasible.",
    "sourceIds": [
      "source.intraop.polypectomy.gutta-gromski-bleeding-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One directly read expert technical review. This is the counterfactual for a flat resection bed, not the target geometry of the offered projecting stalk.",
    "applicablePopulation": "Adults in the explicitly scoped therapeutic-colonoscopy scenarios; not an autonomous clinical-care protocol.",
    "lastCheckedOn": "2026-11-12"
  }
];
export const PROGRAM_BATCH11_SOURCES:Array<ClinicalSource & Record<string,unknown>> = [
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.anorectal-eua.wses-2021",
    "title": "Anorectal emergencies: WSES-AAST guidelines (2021)",
    "completeCitation": "Tarasconi A, Perrone G, Davies J, et al. Anorectal emergencies: WSES-AAST guidelines. World J Emerg Surg. 2021;16:48. doi:10.1186/s13017-021-00384-x.",
    "organizationOrJournal": "World Journal of Emergency Surgery / WSES-AAST",
    "authors": [
      "Antonio Tarasconi",
      "Gennaro Perrone",
      "Justin Davies",
      "WSES-AAST guideline collaborators"
    ],
    "publicationYear": 2021,
    "doi": "10.1186/s13017-021-00384-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-021-00384-x",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Underlying facts independently synthesized and credited to the named authors. CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. Original fictional teaching cases and atomic statements; no source prose, figures, patient details, tables or algorithms reproduced.",
    "authorityAssessment": "Multidisciplinary society guideline. The occult-tract recommendation is weak with low-quality evidence; it supplies a safety boundary, not a precise risk estimate.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.anorectal-eua.ambulatory-drainage",
      "claim.intraop.anorectal-eua.unconfirmed-tract",
      "claim.intraop.anorectal-eua.acute-distortion",
      "claim.intraop.anorectal-eua.known-tract-seton",
      "claim.intraop.anorectal-eua.open-drainage"
    ],
    "verification": {
      "method": "Targeted public reading",
      "checkedOn": "2026-11-12",
      "locators": [
        "Sections 1.C and 1.E: ambulatory drainage, acute anatomical distortion and unconfirmed fistula exploration",
        "Rights and permissions"
      ],
      "sourceTextStored": false,
      "round1Check": {
        "checkedOn": "2026-11-12",
        "url": "https://link.springer.com/article/10.1186/s13017-021-00384-x",
        "locators": [
          "Sections 1.C, 1.D and 1.E",
          "Rights and permissions: CC BY 4.0"
        ],
        "sourceTextStored": false
      }
    },
    "rightsCheck": {
      "checkedOn": "2026-11-12",
      "sourceTextStored": false,
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "scope": "Targeted facts for the listed claim IDs; no corpus construction, bulk download, model training or protected-expression reuse.",
      "accessTermsLimitation": "Explicit article CC BY 4.0 notice checked in Rights and permissions."
    }
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.anorectal-eua.ecco-surgery-2024",
    "title": "ECCO Crohn surgical-treatment guideline (2024)",
    "completeCitation": "Adamina M, Minozzi S, Warusavitarne J, et al. ECCO Guidelines on Therapeutics in Crohn’s Disease: Surgical Treatment. J Crohns Colitis. 2024;18(10):1556-1582. doi:10.1093/ecco-jcc/jjae089.",
    "organizationOrJournal": "Journal of Crohn’s and Colitis / European Crohn’s and Colitis Organisation",
    "authors": [
      "Michel Adamina",
      "Silvia Minozzi",
      "Janindra Warusavitarne",
      "ECCO guideline collaborators"
    ],
    "publicationYear": 2024,
    "doi": "10.1093/ecco-jcc/jjae089",
    "pmid": null,
    "officialUrl": "https://doi.org/10.1093/ecco-jcc/jjae089",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright reserved; targeted professional-society verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of professional-society recommendations and citations only, as permitted by repository instructions. Copyright remains reserved. No article text, excerpts, tables, figures or algorithms stored or adapted.",
    "authorityAssessment": "Contemporary disease-specific society guidance. Perianal procedure selection is based substantially on observational evidence and expert interpretation; exact timing and comparative procedural superiority are not generalized.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.anorectal-eua.low-tract-function",
      "claim.intraop.anorectal-eua.crohn-rectal-activity",
      "claim.intraop.anorectal-eua.crohn-flap",
      "claim.intraop.anorectal-eua.crohn-staging"
    ],
    "verification": {
      "method": "Targeted public reading",
      "checkedOn": "2026-11-12",
      "locators": [
        "Statements 3.10, 3.11, 3.17 and practice points section 3.4"
      ],
      "sourceTextStored": false,
      "readableUrl": "https://dscrs.nl/wp-content/uploads/2026/02/Ecco-guidelines-surgical-treatment.pdf"
    },
    "rightsCheck": {
      "checkedOn": "2026-11-12",
      "sourceTextStored": false,
      "licenseUrl": null,
      "scope": "Targeted facts for the listed claim IDs; no corpus construction, bulk download, model training or protected-expression reuse.",
      "accessTermsLimitation": "The accessible society-hosted guideline PDF states all rights reserved. Public hosting is not treated as an ingestion license. Reading is confined to the repository-authorized targeted verification of society guidance; no blanket AI license is inferred. No automated/AI prohibition appeared on the inspected society landing page or PDF; the DSCRS general-terms endpoint was unavailable."
    }
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.anorectal-eua.ecco-malignancy-2023",
    "title": "ECCO IBD and malignancy guideline (2023)",
    "completeCitation": "Gordon H, Biancone L, Fiorino G, et al. ECCO Guidelines on Inflammatory Bowel Disease and Malignancies. J Crohns Colitis. 2023;17(6):827-854. doi:10.1093/ecco-jcc/jjac187.",
    "organizationOrJournal": "Journal of Crohn’s and Colitis / European Crohn’s and Colitis Organisation",
    "authors": [
      "Hannah Gordon",
      "Livia Biancone",
      "Gionata Fiorino",
      "ECCO guideline collaborators"
    ],
    "publicationYear": 2023,
    "doi": "10.1093/ecco-jcc/jjac187",
    "pmid": null,
    "officialUrl": "https://doi.org/10.1093/ecco-jcc/jjac187",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright reserved; targeted professional-society verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of professional-society recommendations and citations only, as permitted by repository instructions. Copyright remains reserved. No article text, excerpts, tables, figures or algorithms stored or adapted.",
    "authorityAssessment": "Disease-specific consensus guideline. Re-evaluation after changed anal symptoms has expert-opinion-level support; rarity and nonspecific presentation limit certainty.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.anorectal-eua.changed-symptoms",
      "claim.intraop.anorectal-eua.suspicious-tissue",
      "claim.intraop.anorectal-eua.sampling-provenance"
    ],
    "verification": {
      "method": "Targeted public reading",
      "checkedOn": "2026-11-12",
      "locators": [
        "Section 2.2, Statement 4 and supporting discussion of suspicious-lesion and tract sampling"
      ],
      "sourceTextStored": false,
      "readableUrl": "https://eomifne.gr/images/pdf/kateuthidiries_ecco/2023.pdf"
    },
    "rightsCheck": {
      "checkedOn": "2026-11-12",
      "sourceTextStored": false,
      "licenseUrl": null,
      "scope": "Targeted facts for the listed claim IDs; no corpus construction, bulk download, model training or protected-expression reuse.",
      "accessTermsLimitation": "The accessible society-hosted guideline PDF states all rights reserved. Public hosting is not treated as an ingestion license. Reading is confined to the repository-authorized targeted verification of society guidance; no blanket AI license is inferred. No automated/AI prohibition appeared on the inspected society landing page or PDF; the DSCRS general-terms endpoint was unavailable."
    }
  },
  {
    "contentVersion": "question-intraop.anorectal-eua-and-fistula.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.anorectal-eua.kaneshiro-2023",
    "title": "Fistula cancer diagnosed at EUA: primary case report (2023)",
    "completeCitation": "Kaneshiro D, Sanechika Y, Kishi K, Sakai D, Iwamoto K, Takeda M, Nakahara Y, Ohashi T, Naito A, Furukawa K, Moon J, Imasato M, Asaoka T, Mizushima T. Crohn’s disease-related anal fistula cancer diagnosed by examination under anesthesia: a case report. Surg Case Rep. 2023;9:149. doi:10.1186/s40792-023-01722-8.",
    "organizationOrJournal": "Surgical Case Reports",
    "authors": [
      "Daisuke Kaneshiro",
      "Yuusuke Sanechika",
      "Kazuki Kishi",
      "Daichi Sakai",
      "Kazuya Iwamoto",
      "Mitsunobu Takeda",
      "Yujiro Nakahara",
      "Tomofumi Ohashi",
      "Atsushi Naito",
      "Kenta Furukawa",
      "Jeongho Moon",
      "Mitsunobu Imasato",
      "Tadafumi Asaoka",
      "Tsunekazu Mizushima"
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s40792-023-01722-8",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s40792-023-01722-8",
    "accessedOn": "2026-11-12",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Underlying facts independently synthesized and credited to the named authors. CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. Original fictional teaching cases and atomic statements; no source prose, figures, patient details, tables or algorithms reproduced.",
    "authorityAssessment": "Single primary case report, used only to cross-check that rectal and fistula specimens can yield different diagnoses. It does not establish incidence, a screening interval or the comparative yield of biopsy techniques.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.anorectal-eua.suspicious-tissue",
      "claim.intraop.anorectal-eua.sampling-provenance"
    ],
    "verification": {
      "method": "Targeted public reading",
      "checkedOn": "2026-11-12",
      "locators": [
        "Case presentation: separate rectal and fistula pathology specimens",
        "Rights and permissions"
      ],
      "sourceTextStored": false
    },
    "rightsCheck": {
      "checkedOn": "2026-11-12",
      "sourceTextStored": false,
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "scope": "Targeted facts for the listed claim IDs; no corpus construction, bulk download, model training or protected-expression reuse.",
      "accessTermsLimitation": "Explicit article CC BY 4.0 notice checked in Rights and permissions."
    }
  },
  {
    "contentVersion": "question-topic.anorectal-benign-pelvic-floor.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.anorectal-benign-pelvic-floor.ascrs-abscess-2022",
    "title": "ASCRS anorectal abscess and fistula guideline (2022)",
    "completeCitation": "Gaertner WB, Burgess PL, Davids JS, Lightner AL, Shogan BD, Sun MY, Steele SR, Paquette IM, Feingold DL; ASCRS Clinical Practice Guidelines Committee. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula. Dis Colon Rectum. 2022;65(8):964-985. doi:10.1097/DCR.0000000000002473.",
    "organizationOrJournal": "Diseases of the Colon & Rectum / ASCRS",
    "authors": [
      "Wolfgang B Gaertner",
      "Pamela L Burgess",
      "Jennifer S Davids",
      "Amy L Lightner",
      "Benjamin D Shogan",
      "Mark Y Sun",
      "Scott R Steele",
      "Ian M Paquette",
      "Daniel L Feingold"
    ],
    "publicationYear": 2022,
    "doi": "10.1097/DCR.0000000000002473",
    "pmid": null,
    "officialUrl": "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982014/all/Management_of_Anorectal_Abscess__Fistula_in_Ano__and_Rectovaginal_Fistula__2022_",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright reserved; targeted professional-society factual verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted underlying facts independently synthesized. No source prose, figures, tables, algorithm or full text is stored. No implication of endorsement. Medical authority is assessed independently of reuse permission.",
    "authorityAssessment": "Evidence-based professional-society guideline; recommendation strength varies by question.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.intraop.anorectal-eua.low-tract-function",
      "claim.anorectal-benign-pelvic-floor.complex-fistula-imaging-comparison"
    ],
    "rightsCheck": {
      "checkedOn": "2026-11-11",
      "sourceTextStored": false,
      "scope": "Individual publicly readable guideline sections; no proprietary ASCRS textbook or members library used.",
      "aiRestrictionFound": false,
      "limitation": "No blanket AI/corpus license inferred. ASCRS volunteer Works policy checked; publisher/Unbound general terms endpoints were unavailable. Use is limited to repository-authorized targeted guideline factual verification."
    },
    "localReuse": {
      "mappingCheckedOn": "2026-11-12",
      "originalAccessedOn": "2026-11-11",
      "sourceLedger": "docs/research/sources-question-topic-anorectal-benign-pelvic-floor-20261111.json",
      "claimScope": "Reuse the previously verified simple-low-tract/normal-function fistulotomy boundary; no fresh ASCRS content retrieval or new proctitis/occult-probing claim is asserted. The current free Toolkit endpoint returned a moved-document page.",
      "round1AdditionalScope": {
        "claimId": "claim.anorectal-benign-pelvic-floor.complex-fistula-imaging-comparison",
        "mappingCheckedOn": "2026-11-12",
        "originalLastCheckedOn": "2026-11-11",
        "freshRetrieval": false
      }
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.parathyroid.tay-2021",
    "title": "Preoperative Localization for Primary Hyperparathyroidism: A Clinical Review",
    "completeCitation": "Tay D, Das JP, Yeh R. Preoperative Localization for Primary Hyperparathyroidism: A Clinical Review. Biomedicines. 2021;9(4):390. doi:10.3390/biomedicines9040390.",
    "organizationOrJournal": "Biomedicines",
    "authors": [
      "Donovan Tay",
      "Jeeban P Das",
      "Randy Yeh"
    ],
    "publicationYear": 2021,
    "doi": "10.3390/biomedicines9040390",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8067482/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Targeted factual verification and bibliographic/atomic fact records only. No source prose, excerpts, tables, figures or algorithms stored or adapted. Credit authors, original publication, DOI and CC BY 4.0; these independently composed educational facts are not an adaptation of protected expression.",
    "authorityAssessment": "Peer-reviewed clinical review; useful anatomy cross-check, not an operative search-comparison trial.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.inferior-thymic-route",
      "claim.intraop.parathyroid.inferior-search-sequence",
      "claim.intraop.parathyroid.superior-search-region",
      "claim.intraop.parathyroid.r1.sonographic-parathyroid-pattern",
      "claim.intraop.parathyroid.r1.sonographic-node-pattern",
      "claim.intraop.parathyroid.r1.high-inferior-search",
      "claim.intraop.parathyroid.r1.directed-search-ranking"
    ],
    "verifiedSections": "Section 1.2; article license notice",
    "rightsAssessment": {
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "automatedAccess": "Targeted public retrieval through web tool; explicit article/publisher open-access license inspected. No authentication, access-control bypass or prohibited corpus ingestion.",
      "medicalAuthoritySeparateFromLicense": true,
      "commercialSourceReuseAuthorized": false,
      "sourceTextRetained": false
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.parathyroid.uludag-2019",
    "title": "Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism",
    "completeCitation": "Uludağ M, Aygün N, İşgör A. Main Surgical Principles and Methods in Surgical Treatment of Primary Hyperparathyroidism. Med Bull Sisli Etfal Hosp. 2019;53(4):337-352. doi:10.14744/SEMB.2019.67944.",
    "organizationOrJournal": "The Medical Bulletin of Sisli Etfal Hospital",
    "authors": [
      "Mehmet Uludağ",
      "Nurcihan Aygün",
      "Adnan İşgör"
    ],
    "publicationYear": 2019,
    "doi": "10.14744/SEMB.2019.67944",
    "pmid": null,
    "officialUrl": "https://jag.journalagent.com/sislietfaltip/pdfs/SETB_53_4_337_352%5BA%5D.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Targeted factual verification and bibliographic/atomic fact records only. No source prose, excerpts, tables, figures or algorithms stored or adapted. Noncommercial/no-derivatives conditions do not grant commercial or derivative reuse; no such reuse is claimed. Facts are independently restated; do not redistribute source material.",
    "authorityAssessment": "Peer-reviewed technical review; targeted search and observed perfusion maneuvers. Internally conflicting nerve-relation sentence is excluded.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.inferior-thymic-route",
      "claim.intraop.parathyroid.inferior-search-sequence",
      "claim.intraop.parathyroid.superior-search-region",
      "claim.intraop.parathyroid.intrathyroid-evidence",
      "claim.intraop.parathyroid.color-limitation",
      "claim.intraop.parathyroid.reperfusion-observation",
      "claim.intraop.parathyroid.r1.high-inferior-search",
      "claim.intraop.parathyroid.r1.directed-search-ranking"
    ],
    "verifiedSections": "Pages 343,348-349; first-page license notice",
    "rightsAssessment": {
      "licenseUrl": "https://creativecommons.org/licenses/by-nc/4.0/",
      "automatedAccess": "Targeted public retrieval through web tool; explicit article/publisher open-access license inspected. No authentication, access-control bypass or prohibited corpus ingestion.",
      "medicalAuthoritySeparateFromLicense": true,
      "commercialSourceReuseAuthorized": false,
      "sourceTextRetained": false
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.parathyroid.khan-lew-2019",
    "title": "Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism",
    "completeCitation": "Khan ZF, Lew JI. Intraoperative Parathyroid Hormone Monitoring in the Surgical Management of Sporadic Primary Hyperparathyroidism. Endocrinol Metab (Seoul). 2019;34(4):327-339. doi:10.3803/EnM.2019.34.4.327.",
    "organizationOrJournal": "Endocrinology and Metabolism (Seoul) / Korean Endocrine Society",
    "authors": [
      "Zahra F Khan",
      "John I Lew"
    ],
    "publicationYear": 2019,
    "doi": "10.3803/EnM.2019.34.4.327",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6935782/",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Targeted factual verification and bibliographic/atomic fact records only. No source prose, excerpts, tables, figures or algorithms stored or adapted. Noncommercial/no-derivatives conditions do not grant commercial or derivative reuse; no such reuse is claimed. Facts are independently restated; do not redistribute source material.",
    "authorityAssessment": "Peer-reviewed focused review from endocrine surgeons; source for sampling integrity and conventional Miami protocol, not a guarantee of surgical cure.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.miami-protocol",
      "claim.intraop.parathyroid.saline-contamination",
      "claim.intraop.parathyroid.recollect-before-extent",
      "claim.intraop.parathyroid.washout-identity"
    ],
    "verifiedSections": "Miami Criterion and Intraoperative PTH Dynamics; article-specific license notice",
    "rightsAssessment": {
      "licenseUrl": "https://creativecommons.org/licenses/by-nc/4.0/",
      "automatedAccess": "Targeted public retrieval through web tool; explicit article/publisher open-access license inspected. No authentication, access-control bypass or prohibited corpus ingestion.",
      "medicalAuthoritySeparateFromLicense": true,
      "commercialSourceReuseAuthorized": false,
      "sourceTextRetained": false
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.parathyroid.barczynski-2015",
    "title": "The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism",
    "completeCitation": "Barczyński M, Gołkowski F, Nawrot I. The current status of intraoperative iPTH assay in surgery for primary hyperparathyroidism. Gland Surg. 2015;4(1):36-43. doi:10.3978/j.issn.2227-684X.2015.01.01.",
    "organizationOrJournal": "Gland Surgery",
    "authors": [
      "Marcin Barczyński",
      "Filip Gołkowski",
      "Ireneusz Nawrot"
    ],
    "publicationYear": 2015,
    "doi": "10.3978/j.issn.2227-684X.2015.01.01",
    "pmid": null,
    "officialUrl": "https://gs.amegroups.org/article/view/5441/html",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Publisher open-access policy: CC BY-NC-ND 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Targeted factual verification and bibliographic/atomic fact records only. No source prose, excerpts, tables, figures or algorithms stored or adapted. Noncommercial/no-derivatives conditions do not grant commercial or derivative reuse; no such reuse is claimed. Facts are independently restated; do not redistribute source material.",
    "authorityAssessment": "Independent author group and older narrative review; corroborates saline contamination and protocol facts. Shared primary studies may underlie both reviews; not two independent outcome trials.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.miami-protocol",
      "claim.intraop.parathyroid.saline-contamination",
      "claim.intraop.parathyroid.recollect-before-extent",
      "claim.intraop.parathyroid.washout-identity"
    ],
    "verifiedSections": "Protocol of intraoperative iPTH assay; publisher Content Licensing and Open Access Statement",
    "rightsAssessment": {
      "licenseUrl": "https://gs.amegroups.org/page/about/content-licensing",
      "automatedAccess": "Targeted public retrieval through web tool; explicit article/publisher open-access license inspected. No authentication, access-control bypass or prohibited corpus ingestion.",
      "medicalAuthoritySeparateFromLicense": true,
      "commercialSourceReuseAuthorized": false,
      "sourceTextRetained": false
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.parathyroid.rao-2023",
    "title": "Preservation of parathyroid glands during thyroid and neck surgery",
    "completeCitation": "Rao SS, Rao H, Moinuddin Z, Rozario AP, Augustine T. Preservation of parathyroid glands during thyroid and neck surgery. Front Endocrinol (Lausanne). 2023;14:1173950. doi:10.3389/fendo.2023.1173950.",
    "organizationOrJournal": "Frontiers in Endocrinology",
    "authors": [
      "Smitha S. Rao",
      "Himagirish Rao",
      "Zia Moinuddin",
      "Anthony P. Rozario",
      "Titus Augustine"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/fendo.2023.1173950",
    "pmid": null,
    "officialUrl": "https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2023.1173950/full",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Targeted factual verification and bibliographic/atomic fact records only. No source prose, excerpts, tables, figures or algorithms stored or adapted. Credit authors, original publication, DOI and CC BY 4.0; these independently composed educational facts are not an adaptation of protected expression.",
    "authorityAssessment": "Peer-reviewed narrative review; capsular dissection, color-assessment limitations and selective transplantation. Technique is supported, exact efficacy is not claimed.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.capsular-vessel-division",
      "claim.intraop.parathyroid.in-situ-function",
      "claim.intraop.parathyroid.color-limitation",
      "claim.intraop.parathyroid.removed-gland-graft",
      "claim.intraop.parathyroid.muscle-graft-technique",
      "claim.intraop.parathyroid.tissue-confirmation",
      "claim.intraop.parathyroid.r1.shared-bridge-division"
    ],
    "verifiedSections": "Capsular dissection; Routine vs selective autotransplantation; Site and Method of transplantation; Copyright notice",
    "rightsAssessment": {
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "automatedAccess": "Targeted public retrieval through web tool; explicit article/publisher open-access license inspected. No authentication, access-control bypass or prohibited corpus ingestion.",
      "medicalAuthoritySeparateFromLicense": true,
      "commercialSourceReuseAuthorized": false,
      "sourceTextRetained": false
    }
  },
  {
    "contentVersion": "clinical.question-intraop.parathyroid-localization-and-preservation.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.parathyroid.jaes-2025",
    "title": "The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery",
    "completeCitation": "Sugitani I, Kiyota N, Ito Y, Onoda N, Hiromasa T, Horiuchi K, Kinuya S, Kondo T, Moritani S, Sugino K, Hara H. The 2024 revised clinical guidelines on the management of thyroid tumors by the Japan Association of Endocrine Surgery. Endocr J. 2025;72(5):545-635. doi:10.1507/endocrj.EJ24-0644.",
    "organizationOrJournal": "Endocrine Journal / Japan Association of Endocrine Surgery",
    "authors": [
      "Iwao Sugitani",
      "Naomi Kiyota",
      "Yasuhiro Ito",
      "Naoyoshi Onoda",
      "Tomo Hiromasa",
      "Kiyomi Horiuchi",
      "Seigo Kinuya",
      "Tetsuo Kondo",
      "Sueyoshi Moritani",
      "Kiminori Sugino",
      "Hisato Hara"
    ],
    "publicationYear": 2025,
    "doi": "10.1507/endocrj.EJ24-0644",
    "pmid": null,
    "officialUrl": "https://www.jstage.jst.go.jp/article/endocrj/72/5/72_EJ24-0644/_html/-char/en",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC-ND 4.0; society guidance targeted verification",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and bibliographic/atomic fact records only. No source prose, excerpts, tables, figures or algorithms stored or adapted. Noncommercial/no-derivatives conditions do not grant commercial or derivative reuse; no such reuse is claimed. Facts are independently restated; do not redistribute source material.",
    "authorityAssessment": "Current professional-society guideline, adult thyroid tumors; CQ10-3 is a strong recommendation with low-certainty evidence. Does not establish universal ambulatory eligibility.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.parathyroid.in-situ-function",
      "claim.intraop.parathyroid.removed-gland-graft",
      "claim.intraop.parathyroid.muscle-graft-technique"
    ],
    "verifiedSections": "CQ10-3 and discussion; article-specific bottom license notice",
    "rightsAssessment": {
      "licenseUrl": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      "automatedAccess": "Targeted public retrieval through web tool; explicit article/publisher open-access license inspected. No authentication, access-control bypass or prohibited corpus ingestion.",
      "medicalAuthoritySeparateFromLicense": true,
      "commercialSourceReuseAuthorized": false,
      "sourceTextRetained": false
    }
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.polypectomy.usmstf-removal-2020",
    "title": "USMSTF endoscopic removal of colorectal lesions (2020)",
    "completeCitation": "Kaltenbach T, Anderson JC, Burke CA, et al. Endoscopic Removal of Colorectal Lesions: Recommendations by the US Multi-Society Task Force on Colorectal Cancer. Gastrointest Endosc. 2020;91(3):486-519. doi:10.1016/j.gie.2020.01.029.",
    "organizationOrJournal": "US Multi-Society Task Force on Colorectal Cancer / Gastrointestinal Endoscopy",
    "authors": [
      "Tonya Kaltenbach",
      "Joseph C. Anderson",
      "Carol A. Burke",
      "et al."
    ],
    "publicationYear": 2020,
    "doi": "10.1016/j.gie.2020.01.029",
    "pmid": null,
    "officialUrl": "https://www.asge.org/docs/default-source/guidelines/endoscopic-removal-of-colorectal-lesions-recommendations-by-the-us-multi-society-task-force-on-colorectal-cancer-2020-march-gie.pdf",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted multisociety guidance; no open reuse licence asserted",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts, with original synthesis and bibliographic links. No source prose, tables, figures, algorithms or source file retained. The full society-hosted PDF was readable through its indexed query URL. The local November 11 source ledger records its earlier terms assessment; current terms-page requests failed. No affirmative automation prohibition was identified for this host; this is not a blanket rights clearance.",
    "authorityAssessment": "Primary multisociety recommendations. Directly checked sections on EMR completion, bleeding prevention, intraprocedural bleeding and deep mural injury. Recommendations and their evidence strength differ by question. This is one publication, including any other local source IDs for it.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.polypectomy.visible-remnant-resection",
      "claim.intraop.polypectomy.visible-remnant-not-ablation",
      "claim.intraop.polypectomy.clear-margin-adjuvant",
      "claim.intraop.polypectomy.right-colon-defect-closure",
      "claim.intraop.polypectomy.vessel-coagulation-boundary",
      "claim.intraop.polypectomy.intraprocedural-bleeding-tools",
      "claim.intraop.polypectomy.advanced-emr-expertise",
      "claim.intraop.polypectomy.short-stalk-loop-slippage",
      "claim.intraop.polypectomy.stalk-mechanical-hemostasis",
      "claim.intraop.polypectomy.injection-as-adjunct",
      "claim.intraop.polypectomy.adenomatous-optical-pattern",
      "claim.intraop.polypectomy.submucosal-fiber-plane"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.polypectomy.ams-polyp-guidance-2022",
    "title": "Academy of Medicine Singapore colonic-polyp guidance (2022)",
    "completeCitation": "Ang TL, Lim JF, Chua TS, Tan KY, Li JW, Chong CH, Gwee KA, Namasivayam V, Vu CKF, Khor CJL, Wang LM, Yeoh KG. Clinical guidance on endoscopic management of colonic polyps in Singapore. Singapore Med J. 2022;63(4):173-186. doi:10.11622/smedj.2020108.",
    "organizationOrJournal": "Academy of Medicine, Singapore, multidisciplinary workgroup / Singapore Medical Journal",
    "authors": [
      "Tiing Leong Ang",
      "Jit Fong Lim",
      "Tju Siang Chua",
      "Kok Yang Tan",
      "James Weiquan Li",
      "Chern Hao Chong",
      "Kok Ann Gwee",
      "Vikneswaran Namasivayam",
      "Charles Kien Fong Vu",
      "Christopher Jen Lock Khor",
      "Lai Mun Wang",
      "Khay Guan Yeoh"
    ],
    "publicationYear": 2022,
    "publicationDateNote": "April 2022 issue; literature search reported through April 2020.",
    "doi": "10.11622/smedj.2020108",
    "pmid": "32668839",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9251267/",
    "accessedOn": "2026-11-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Singapore Medical Association; PMC availability supplies no general reuse licence",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of professional-society guidance under the repository's society-guidance rule. The accessible article names the copyright holder without an explicit Creative Commons grant. Original statements only; no protected expression, figure, flowchart or table copied. No automated/AI restriction was identified in the accessed PMC article; publisher-host rights are not inferred.",
    "authorityAssessment": "Multidisciplinary consensus from Singapore gastroenterology and surgical organizations. Recommendations 5, 7 and 10 independently cross-check selective large proximal EMR closure, injury closure and adjuvant margin treatment. It shares some underlying trials with USMSTF and is not independent randomized replication.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.polypectomy.clear-margin-adjuvant",
      "claim.intraop.polypectomy.right-colon-defect-closure",
      "claim.intraop.polypectomy.stalk-mechanical-hemostasis"
    ]
  },
  {
    "contentVersion": "clinical.question-intraop-polypectomy-technique-and-bleeding.2026-11-12.r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.intraop.polypectomy.gutta-gromski-bleeding-2020",
    "title": "Gutta and Gromski: endoscopic post-polypectomy bleeding management (2020)",
    "completeCitation": "Gutta A, Gromski MA. Endoscopic Management of Post-Polypectomy Bleeding. Clin Endosc. 2020;53(3):302-310. doi:10.5946/ce.2019.062.",
    "organizationOrJournal": "Clinical Endoscopy / Korean Society of Gastrointestinal Endoscopy",
    "authors": [
      "Aditya Gutta",
      "Mark A. Gromski"
    ],
    "publicationYear": 2020,
    "publicationDateNote": "2020 issue; online publication and copyright 2019.",
    "doi": "10.5946/ce.2019.062",
    "pmid": "31525836",
    "officialUrl": "https://doi.org/10.5946/ce.2019.062",
    "accessedOn": "2026-11-12",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution Non-Commercial 3.0; copyright Korean Society of Gastrointestinal Endoscopy",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Directly read the openly licensed journal PDF at KoreaMed Synapse after journal/PMC requests failed. Only underlying facts independently synthesized; no source prose, figure, table or PDF retained. Full citation and licence attribution supplied. The schema has no CC BY-NC 3.0 enum: the selected status describes this narrower factual-verification use and does not assert a 4.0 grant. Protected expression/assets are not cleared for commercial reuse.",
    "authorityAssessment": "Peer-reviewed expert technical review, not a comparative trial or a new guideline. The specific stalk-base clipping rule and contrasting sessile-resection target are directly described. A single technical source supports the exact placement boundary; it does not prove all alternative orientations fail. USMSTF independently supports mechanical treatment generally, not this precise orientation comparison.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.intraop.polypectomy.stalk-clip-capture",
      "claim.intraop.polypectomy.sessile-bleeding-clip-target"
    ]
  }
];
