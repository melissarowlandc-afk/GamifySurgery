import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

type Round3Revision = QuestionBankBatch2aRevision & { sourceStructure: { kind: "standalone_replacement_candidate"; previousNodeIds:string[]; candidateNodeIds:string[]; requiresManagerCompositionReview:true; reason:string } };

/** Two supported final-round drafts, not manifest acceptances. */
export const QUESTION_FLAGS2_ROUND3_DEFINITIONS: Round3Revision[] = [
  {
    "id": "revision.flags2r3.20261105.g03",
    "auditId": "G03",
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "previousQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r4",
    "previousContentVersions": [
      "clinical.question-flags2-round2.2026-11-05.v1"
    ],
    "previousStem": "Which radiology request should be made at this visit for {patientName}'s persistent palpable finding?",
    "previousChoiceLabels": [
      "Request targeted breast ultrasound",
      "Request archived breast ultrasound images",
      "Request spot-compression breast mammography"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "table",
      "caption": "Recorded breast-imaging acquisitions",
      "columnHeaders": [
        "Acquisition record",
        "Reported observations"
      ],
      "rowHeaders": [
        "Diagnostic mammography",
        "Ultrasound accession: complete acquisition log"
      ],
      "cells": [
        [
          "Standard and spot-compression views include both skin markers",
          "Heterogeneously dense tissue; no mass or distortion beneath either marker"
        ],
        [
          "Left 2 o'clock: radial/antiradial sweeps and superficial-lump images; left axillary survey",
          "Circumscribed superficial lesion at the 2 o'clock marker; no additional focal finding in the recorded sweeps"
        ]
      ]
    },
    "currentUpdate": "On repeat examination, the current skin marker overlies a discrete hard focus with an irregular edge and little mobility. The mobile nodule at the earlier biopsy site can be felt separately.",
    "question": {
      "id": "question.palpable-breast.negative-mammogram-targeted-us.v1.r4",
      "conceptId": "concept.palpable-breast.completed-imaging-clinical-target.v1",
      "stem": "Which next step is best for the assessment of {patientName}'s current breast finding?",
      "answerChoices": [
        {
          "id": "choice.flags2r3.20261105.g03.key",
          "label": "Breast-team tissue sampling",
          "isCorrect": true,
          "rationale": "The persistent hard, irregular, poorly mobile clinical focus remains concerning despite completed site-correct imaging. The earlier concordant fibroadenoma is a separate finding, so its benign diagnosis does not settle this target. Tissue assessment is indicated; the breast team selects the sampling method when no imaging target exists.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r3.20261105.g03.d1",
          "label": "Contrast-enhanced breast MRI",
          "isCorrect": false,
          "distractorRationale": "Additional imaging is a plausible response to discordance between examination and conventional studies. Here it would not replace the tissue assessment required for this persistent concerning clinical target. This does not make MRI inappropriate for every other breast indication."
        },
        {
          "id": "choice.flags2r3.20261105.g03.d2",
          "label": "Breast examination with interval ultrasonography",
          "isCorrect": false,
          "distractorRationale": "Surveillance is credible for the unchanged, concordant, core-proven fibroadenoma in the record. It does not account for the separate hard, irregular clinical focus. Negative site-correct imaging does not make that examination finding concordantly benign."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Breast examination and investigation record",
        "columnHeaders": [
          "Record",
          "Reported observations"
        ],
        "rowHeaders": [
          "Earlier nodule",
          "Current mammography",
          "Current targeted ultrasonography"
        ],
        "cells": [
          [
            "Core pathology: fibroadenoma without atypia; imaging and pathology concordant",
            "The previously biopsied nodule is unchanged on serial studies"
          ],
          [
            "The current skin marker is included on the diagnostic views",
            "No corresponding mass, architectural distortion or suspicious calcifications"
          ],
          [
            "Images document sweeps through the entire current marked area",
            "No corresponding solid or cystic lesion; the earlier biopsied nodule is separately visible and unchanged"
          ]
        ]
      },
      "explanation": "The persistent hard, irregular, poorly mobile clinical focus remains concerning despite completed site-correct imaging. The earlier concordant fibroadenoma is a separate finding, so its benign diagnosis does not settle this target. Tissue assessment is indicated; the breast team selects the sampling method when no imaging target exists. Additional imaging is a plausible response to discordance between examination and conventional studies. Here it would not replace the tissue assessment required for this persistent concerning clinical target. This does not make MRI inappropriate for every other breast indication. Surveillance is credible for the unchanged, concordant, core-proven fibroadenoma in the record. It does not account for the separate hard, irregular clinical focus. Negative site-correct imaging does not make that examination finding concordantly benign.",
      "teachingPoint": "The persistent hard, irregular, poorly mobile clinical focus remains concerning despite completed site-correct imaging. The earlier concordant fibroadenoma is a separate finding, so its benign diagnosis does not settle this target. Tissue assessment is indicated; the breast team selects the sampling method when no imaging target exists.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.bread-butter.fibroadenoma.concordant-observation",
        "claim.flags2r3.20261105.clinical-target",
        "claim.flags2r3.20261105.benign-scope",
        "claim.flags2r3.20261105.sampling-scope"
      ],
      "contentVersion": "clinical.question-flags2-round3.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    "choiceSourceIds": {
      "choice.flags2r3.20261105.g03.key": "correct_1",
      "choice.flags2r3.20261105.g03.d1": "choice.flags2r2.20261105.g03.d1",
      "choice.flags2r3.20261105.g03.d2": "choice.flags2r2.20261105.g03.d2"
    },
    "choiceServiceOverrides": {
      "choice.flags2r3.20261105.g03.key": null,
      "choice.flags2r3.20261105.g03.d1": null,
      "choice.flags2r3.20261105.g03.d2": null
    },
    "choiceTimingOverrides": {
      "choice.flags2r3.20261105.g03.key": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.flags2r3.20261105.g03.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      },
      "choice.flags2r3.20261105.g03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Determine that the benign core/imaging concordance belongs to a different palpable nodule and does not explain the current examination. Then: Interpret the persistent clinical finding against complete site-correct imaging and choose tissue evaluation rather than extending benign surveillance or substituting further imaging.",
    "reviewerNotes": "Single ACR guideline for the clinical-target decision plus recorded ASBrS/SBI guidance for the separate concordant fibroadenoma. No MRI contraindication, surveillance interval, biopsy-device ranking or empirical false-negative rate is taught.",
    "contextCompanion": false,
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
      "nextConceptId": "concept.palpable-breast.completed-imaging-clinical-target.v1",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": null,
      "previousResultGate": {
        "id": "gate.gs028c.dense-focal",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted breast ultrasound pending",
        "resultNarrative": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.in_house",
          "route.ultrasound.outsourced"
        ]
      },
      "nextResultGate": null,
      "reason": "The old v1 and round-two objective selected a missing targeted acquisition. The new scored decision is management of a concerning clinical target after acquisition is complete; it must not inherit imaging-acquisition FSRS history."
    },
    "chiefComplaint": "Breast lump",
    "previousChiefComplaint": "Persistent breast thickening",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
        "chiefComplaint": "Persistent breast thickening"
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
        "chiefComplaint": "Persistent breast thickening"
      }
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old woman, returns because an area in the left breast remains palpable. A previously biopsied nodule in that breast has also been followed on imaging.",
    "previousPresentation": "{patientName}, a 44-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
        "presentation": "{patientName}, a 44-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock."
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
        "presentation": "{patientName}, a 58-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.flags2r2.20261105.case.gs028c.palpable-breast.paired-dense-focal",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-dense-focal",
        "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
        "revisedChiefComplaint": "Persistent breast thickening",
        "revisedPresentation": "{patientName}, a 44-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2r2.20261105.profile.gs028c.palpable-breast.paired-dense-focal.female.44",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
            "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 44-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2r2.20261105.profile.gs028c.palpable-breast.paired-dense-focal.female.58",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
            "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 58-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 44,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2r3.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round3.2026-11-05.v1"
    },
    "ownerProgramReview": {
      "ownerItemId": "G03",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Direct flagged v1 lineage, now a separately versioned management objective. Both studies are completed at the actual clinical site, with their negative findings specified. A separate concordant benign nodule creates a real interpretation trap. Tissue assessment, MRI and interval examination/ultrasonography replace gap-filling options. The retained draft encounter is one node; the old result gate/follow-up remain intact only in historical/live sources.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "sourceStructure": {
      "kind": "standalone_replacement_candidate",
      "previousNodeIds": [
        "node.gs028c.palpable-breast.paired-dense-focal.1",
        "node.gs028c.palpable-breast.paired-dense-focal.2"
      ],
      "candidateNodeIds": [
        "node.gs028c.palpable-breast.paired-dense-focal.1"
      ],
      "requiresManagerCompositionReview": true,
      "reason": "Completed imaging is supplied before the new management task. The old ultrasound gate and repetitive downstream biopsy task must not execute in this draft."
    }
  },
  {
    "id": "revision.flags2r3.20261105.g05",
    "auditId": "G05",
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "previousQuestionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r3",
    "previousContentVersions": [
      "clinical.question-flags2-round2.2026-11-05.v1"
    ],
    "previousStem": "Which investigation should guide {patientName}'s parathyroid planning next?",
    "previousChoiceLabels": [
      "Calcium-sensing receptor gene assay",
      "Parathyroid sestamibi scintigraphy",
      "PTH-related peptide assay"
    ],
    "previousCurrentUpdate": "The completed lumbar-spine, native-left-hip and one-third-radius density measurements are within age-appropriate reference ranges. A paired serum and complete 24-hour urine collection gives a calcium-to-creatinine clearance ratio below 0.01. Renal function and 25-hydroxyvitamin D are within reference ranges; there is no thiazide use. Earlier adult records show calcium in the same mildly elevated band, and the mother's records show a similar longstanding pattern.",
    "previousExhibit": null,
    "currentUpdate": "Calcium has remained in the same mildly elevated band in earlier adult records. There are no kidney stones or fragility fractures. The completed lumbar-spine, hip and distal one-third-radius density measurements are within age-appropriate reference ranges.",
    "question": {
      "id": "question.asymptomatic-phpt.age-based-surgery.v1.r3",
      "conceptId": "concept.phpt.inherited-calcium-before-localization.v2",
      "stem": "Which management should be recommended now for {patientName}'s calcium disorder?",
      "answerChoices": [
        {
          "id": "choice.flags2r3.20261105.g05.key",
          "label": "Biochemical surveillance",
          "isCorrect": true,
          "rationale": "The biochemical/longitudinal pattern and pathogenic CASR result support confirmed uncomplicated familial hypocalciuric hypercalcemia. Observation with follow-up calcium measurements is appropriate for that state. Age under 50 supports parathyroidectomy in confirmed primary hyperparathyroidism, not in every cause of high calcium. The localization focus does not establish a coexisting operative disease, and the normal DXA is not the reason to avoid surgery.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r3.20261105.g05.d1",
          "label": "Elective parathyroidectomy",
          "isCorrect": false,
          "distractorRationale": "Young age and a focal localization study make this a credible plan if the disorder is assumed to be primary hyperparathyroidism. Those findings do not override the recorded inherited disorder. Parathyroid surgery usually does not correct uncomplicated FHH; a new progressive pattern or a separately established coexisting disorder would require reassessment."
        },
        {
          "id": "choice.flags2r3.20261105.g05.d2",
          "label": "Cinacalcet therapy",
          "isCorrect": false,
          "distractorRationale": "Persistent hypercalcemia can tempt a medication choice when surgery is not selected. The described stable, asymptomatic inherited disorder is usually observed with calcium follow-up rather than treated simply to normalize the laboratory number."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Endocrine workup record",
        "columnHeaders": [
          "Investigation",
          "Reported observations"
        ],
        "rowHeaders": [
          "Paired serum and urine testing",
          "Clinical genetics report",
          "Earlier localization study"
        ],
        "cells": [
          [
            "Complete concurrent serum and 24-hour urine collection: calcium-to-creatinine clearance ratio below 0.01",
            "Renal function and 25-hydroxyvitamin D within reference ranges; no thiazide use"
          ],
          [
            "CASR variant classified as pathogenic",
            "The same variant was documented in relatives with longstanding hypercalcemia"
          ],
          [
            "Sestamibi study obtained before the genetic report returned",
            "Focal retained activity behind the lower left thyroid pole"
          ]
        ]
      },
      "explanation": "The biochemical/longitudinal pattern and pathogenic CASR result support confirmed uncomplicated familial hypocalciuric hypercalcemia. Observation with follow-up calcium measurements is appropriate for that state. Age under 50 supports parathyroidectomy in confirmed primary hyperparathyroidism, not in every cause of high calcium. The localization focus does not establish a coexisting operative disease, and the normal DXA is not the reason to avoid surgery. Young age and a focal localization study make this a credible plan if the disorder is assumed to be primary hyperparathyroidism. Those findings do not override the recorded inherited disorder. Parathyroid surgery usually does not correct uncomplicated FHH; a new progressive pattern or a separately established coexisting disorder would require reassessment. Persistent hypercalcemia can tempt a medication choice when surgery is not selected. The described stable, asymptomatic inherited disorder is usually observed with calcium follow-up rather than treated simply to normalize the laboratory number.",
      "teachingPoint": "The biochemical/longitudinal pattern and pathogenic CASR result support confirmed uncomplicated familial hypocalciuric hypercalcemia. Observation with follow-up calcium measurements is appropriate for that state. Age under 50 supports parathyroidectomy in confirmed primary hyperparathyroidism, not in every cause of high calcium. The localization focus does not establish a coexisting operative disease, and the normal DXA is not the reason to avoid surgery.",
      "supportingEvidenceClaimIds": [
        "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
        "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
        "claim.fhh.low-cccr-supports-but-does-not-confirm",
        "claim.fhh.genetic-and-family-confirmation",
        "claim.fhh.reassurance-observation-avoid-parathyroid-surgery",
        "claim.asymptomatic-phpt.age-under-50-surgery",
        "claim.asymptomatic-phpt.three-site-dxa",
        "claim.primary-hyperparathyroidism.biochemical-pattern",
        "claim.flags2r3.20261105.calcium-confirmation",
        "claim.flags2r3.20261105.calcium-management",
        "claim.flags2r3.20261105.age-scope",
        "claim.flags2r3.20261105.localization-scope"
      ],
      "contentVersion": "clinical.question-flags2-round3.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    "choiceSourceIds": {
      "choice.flags2r3.20261105.g05.key": "surgical_assessment_1",
      "choice.flags2r3.20261105.g05.d1": "choice.flags2r2.20261105.g05.d1",
      "choice.flags2r3.20261105.g05.d2": "choice.flags2r2.20261105.g05.d2"
    },
    "choiceServiceOverrides": {
      "choice.flags2r3.20261105.g05.key": null,
      "choice.flags2r3.20261105.g05.d1": null,
      "choice.flags2r3.20261105.g05.d2": null
    },
    "choiceTimingOverrides": {
      "choice.flags2r3.20261105.g05.key": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.flags2r3.20261105.g05.d1": {
        "kind": "no_test"
      },
      "choice.flags2r3.20261105.g05.d2": {
        "kind": "no_test"
      }
    },
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the low-clearance biochemical pattern plus a pathogenic CASR result as the confirmed inherited disorder, rather than treating a low ratio or family history as sufficient by itself. Then: Apply that diagnosis to management despite age below 50 and a focal localization study; the PHPT-specific operative criterion does not make this inherited disorder operative.",
    "reviewerNotes": "PARAT/Fifth Workshop support the confirmed uncomplicated FHH management boundary; NIDDK supports biochemical diagnosis before localization. Duplicate Fifth Workshop source records are one publication. No negative gene result, uncertain variant, progressive disease, coexisting PHPT, cinacalcet indication/dose or localization test-performance rule is taught.",
    "contextCompanion": false,
    "clinicalBinding": {
      "previousConceptId": "concept.phpt.inherited-calcium-before-localization.v1",
      "nextConceptId": "concept.phpt.inherited-calcium-before-localization.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The round-two v1 concept selected genetic clarification before localization. The new version makes that result available and scores management despite a competing age-based operative criterion and localization focus; the diagnostic-test FSRS card must remain distinct."
    },
    "chiefComplaint": "Calcium workup review",
    "previousChiefComplaint": "Calcium workup review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
        "chiefComplaint": "Calcium workup review"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
        "chiefComplaint": "Calcium workup review"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
        "chiefComplaint": "Calcium workup review"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
        "chiefComplaint": "Calcium workup review"
      }
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns during an endocrine-surgery workup for calcium repeatedly above the laboratory reference range with intact PTH within range. The referral and baseline skeletal assessment were requested at the first visit.",
    "previousPresentation": "{patientName}, a 47-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
    "previousProfilePresentations": [
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
        "presentation": "{patientName}, a 47-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
        "presentation": "{patientName}, a 47-year-old man, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
        "presentation": "{patientName}, a 46-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
        "presentation": "{patientName}, a 46-year-old man, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.flags2r2.20261105.case.asymptomatic-phpt.incidental-calcium",
        "patientPresentationVariantId": "presentation.asymptomatic-phpt.incidental-calcium",
        "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
        "revisedChiefComplaint": "Calcium workup review",
        "revisedPresentation": "{patientName}, a 47-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2r2.20261105.profile.asymptomatic-phpt.incidental-calcium.female.47",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.female.47",
            "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 47-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2r2.20261105.profile.asymptomatic-phpt.incidental-calcium.male.47",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.male.47",
            "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 47-year-old man, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2r2.20261105.profile.asymptomatic-phpt.incidental-calcium.female.46",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.female.46",
            "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2r2.20261105.profile.asymptomatic-phpt.incidental-calcium.male.46",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.male.46",
            "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2r3.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round3.2026-11-05.v1"
    },
    "ownerProgramReview": {
      "ownerItemId": "G05",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaced the family-to-gene-test task with management after a pathogenic result. Named choices are surveillance, parathyroidectomy and cinacalcet. Young age plus a prior localization focus create a consequential operative near-miss. Referral already happened; routine DXA is completed unscored context, not a permission gate or held hardware/radius key. New management concept version; old diagnostic and operative cards remain intact.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "sourceStructure": {
      "kind": "standalone_replacement_candidate",
      "previousNodeIds": [
        "node.asymptomatic-phpt.incidental-calcium.1",
        "node.asymptomatic-phpt.incidental-calcium.2"
      ],
      "candidateNodeIds": [
        "node.asymptomatic-phpt.incidental-calcium.2"
      ],
      "requiresManagerCompositionReview": true,
      "reason": "The held DXA acquisition key is not part of this candidate. Completed baseline assessment is unscored and cannot gate referral or operative eligibility."
    }
  }
];

export const QUESTION_FLAGS2_ROUND3_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.palpable-breast.completed-imaging-clinical-target.v1",
    "displayName": "Persistent clinical breast target after completed imaging",
    "learningObjective": "Distinguish the target covered by a concordant benign diagnosis from a separate persistent concerning clinical finding, then choose tissue evaluation despite site-correct imaging without a correlate.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "previousConceptId": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
    "versioningReason": "The old v1 and round-two objective selected a missing targeted acquisition. The new scored decision is management of a concerning clinical target after acquisition is complete; it must not inherit imaging-acquisition FSRS history.",
    "revisedItemIds": [
      "G03"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.gs028c.palpable.biopsy",
      "claim.bread-butter.fibroadenoma.concordant-observation",
      "claim.flags2r3.20261105.clinical-target",
      "claim.flags2r3.20261105.benign-scope",
      "claim.flags2r3.20261105.sampling-scope"
    ],
    "contentVersion": "clinical.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.phpt.inherited-calcium-before-localization.v2",
    "displayName": "Inherited calcium disorder versus an apparent operative indication",
    "learningObjective": "Interpret a pathogenic calcium-sensing result in its biochemical context, then avoid applying a PHPT-specific age/localization pathway to uncomplicated FHH.",
    "earliestFacilityStage": 1,
    "conceptType": "management",
    "previousConceptId": "concept.phpt.inherited-calcium-before-localization.v1",
    "versioningReason": "The round-two v1 concept selected genetic clarification before localization. The new version makes that result available and scores management despite a competing age-based operative criterion and localization focus; the diagnostic-test FSRS card must remain distinct.",
    "revisedItemIds": [
      "G05"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
      "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
      "claim.fhh.low-cccr-supports-but-does-not-confirm",
      "claim.fhh.genetic-and-family-confirmation",
      "claim.fhh.reassurance-observation-avoid-parathyroid-surgery",
      "claim.asymptomatic-phpt.age-under-50-surgery",
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.flags2r3.20261105.calcium-confirmation",
      "claim.flags2r3.20261105.calcium-management",
      "claim.flags2r3.20261105.age-scope",
      "claim.flags2r3.20261105.localization-scope"
    ],
    "contentVersion": "clinical.question-flags2-round3.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  }
];

/** Historical held drafts are excluded from the candidate source view. */
export const QUESTION_FLAGS2_ROUND3_PARKED = [
  {
    "id": "G01",
    "holdStatus": "parked",
    "previousDraftVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r2",
    "reason": "The existing diagnostic claim covers HIV/HCV evaluation in compatible isolated thrombocytopenia. It does not establish the new multilineage marrow-versus-flow-versus-sequencing ranking. The separate splenectomy calendar claim has an unresolved bibliographic identity. Neither can support the round-two key.",
    "ownerNoteResolution": "Open: the bank's eight isolated-ITP siblings contain viral evaluation followed by elective-surgery deferral, not a universal viral-negative-then-marrow rule. No identified earlier encounter has been recovered and no marrow ranking is verified. Preserve the live version and park this reassessment draft; do not claim the sequencing concern is closed."
  },
  {
    "id": "G02",
    "holdStatus": "parked",
    "previousDraftVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r2",
    "reason": "The ledger directly supports advance trigger-free planning in an MH-prepared facility for credibly documented susceptibility. It does not verify the named drug regimen, negative-panel/prior-exposure interpretation, exact capabilities, contracture-testing sequence or prophylactic dantrolene comparison that selects the round-two key.",
    "ownerNoteResolution": "The earlier draft resolved specificity and difficulty editorially, but its key remains unsupported. Park it and keep the exact current live version. A specific, close replacement needs permitted agent/testing/preparation evidence; no general trigger-free claim is stretched into that protocol."
  },
  {
    "id": "G04-R",
    "holdStatus": "parked",
    "previousDraftVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
    "reason": "The ledger supports pregnancy testing, the limited meaning of an early negative home test, and prompt specialist-capable assessment for symptomatic pregnancy. It does not verify the falling-hCG interpretation or exact transvaginal-versus-appendiceal-imaging-versus-aspiration priority used in round two.",
    "ownerNoteResolution": "Open. Keep the original pregnancy-testing live item until a consequential harder replacement is supported, independently passed and manager-accepted. Retirement/merge remains agreed in principle only; no replacement or deletion is performed."
  },
  {
    "id": "G05-staging",
    "holdStatus": "parked",
    "previousDraftVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
    "reason": "The recorded three-site baseline claim supports lumbar spine, hip and distal one-third radius in confirmed PHPT. It does not directly verify the hardware-side and radial-region comparative protocol used as the round-two key.",
    "ownerNoteResolution": "Referral/DXA logic is resolved in proposed G05, while this technical scored replacement is parked. It is not a mandatory study for confirmed FHH and is not a permission step before surgery. Original paired encounters and frozen saves remain untouched."
  },
  {
    "id": "G07",
    "holdStatus": "parked",
    "previousDraftVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r2",
    "reason": "The recorded PTLD claims require tissue pathology rather than EBV DNA/imaging to establish and classify disease. They do not choose excision over core or verify fresh/fixed allocation, whole-specimen formalin handling or a cause for failed flow viability.",
    "ownerNoteResolution": "Specificity was improved editorially but the exact method/processing key is not supportable from the ledger. Parked; keep current live PTLD version until a directly sourced specific comparison is accepted. No claim that EBV establishes PTLD or that a generic core is wrong is added."
  }
] as const;
