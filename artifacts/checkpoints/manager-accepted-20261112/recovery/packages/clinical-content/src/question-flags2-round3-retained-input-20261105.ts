import type { SyntheticClinicalRelease, AnswerChoiceTimingRegistryEntry } from "./schema";

/** Exact historical round-two input, not a candidate release or acceptance. Held adjacent keys exist here only as preserved history. */
export const QUESTION_FLAGS2_ROUND3_RETAINED_INPUT: SyntheticClinicalRelease = {
  "id": "clinical.flags2-round3-retained-input.20261105.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
    {
      "id": "concept.persistent-itp.hiv-hcv-secondary-evaluation",
      "displayName": "HIV and hepatitis-C evaluation in presumed ITP",
      "learningObjective": "Select HIV and hepatitis-C testing before concluding primary ITP in compatible isolated thrombocytopenia.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.persistent-itp.defer-elective-splenectomy",
      "displayName": "Deferring elective splenectomy in persistent ITP",
      "learningObjective": "Defer elective splenectomy when feasible in stable persistent ITP of only several months.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.mh.family-history-and-regimen-components.v1",
      "displayName": "Integrate familial MH risk with all components of a proposed anaesthetic",
      "learningObjective": "Interpret a documented first-degree susceptibility result despite prior uneventful exposure, then distinguish triggering drugs across anaesthetic components.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.palpable-breast.negative-mammogram-targeted-us",
      "displayName": "Targeted ultrasound after negative mammography",
      "learningObjective": "Order targeted ultrasound for an adult at least 40 with a persistent palpable finding after negative diagnostic mammography.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "displayName": "Biopsy suspicious palpable mass despite negative imaging",
      "learningObjective": "Obtain tissue diagnosis for a persistently suspicious palpable mass despite negative mammography and targeted ultrasound.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
      "displayName": "Check pregnancy in pelvic-pain assessment",
      "learningObjective": "Select pregnancy hCG testing during assessment of reproductive-age pelvic or abdominal pain when pregnancy is possible.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.asymptomatic-phpt.three-site-dxa",
      "displayName": "Three-site skeletal assessment in asymptomatic primary hyperparathyroidism",
      "learningObjective": "Select lumbar-spine, hip, and distal forearm DXA for skeletal assessment after primary hyperparathyroidism is confirmed.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.asymptomatic-phpt.age-based-surgery",
      "displayName": "Age-based surgical assessment in asymptomatic primary hyperparathyroidism",
      "learningObjective": "Recognize age under 50 years as an independent reason to discuss parathyroid surgery after confirmed asymptomatic disease.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.predictive-value.collection-population-denominator.v1",
      "displayName": "Match a positive result to its collection population and denominator",
      "learningObjective": "Identify the relevant tested cohort from collection chronology, then calculate positive predictive value rather than sensitivity or pretest prevalence.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
      "displayName": "Choose target and tissue method after a limited transplant-recipient node aspirate",
      "learningObjective": "Interpret the specimen and node compartments, then select representative tissue for classification rather than equating plasma EBV DNA or a sampling label with adequate pathology.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.itp.changed-lineage-pattern-before-treatment.v1",
      "displayName": "Reassess changed cytopenias before another ITP treatment",
      "learningObjective": "Interpret a transition from isolated thrombocytopenia to multilineage and morphologic abnormalities, then select diagnostic reassessment before another ITP treatment.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "displayName": "Choose the surgical testing sequence under unresolved familial MH risk",
      "learningObjective": "Interpret family history and an uninformative genetic result, then distinguish nontriggering perioperative planning from prophylactic dantrolene or obligatory preoperative contracture testing.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
      "displayName": "Distinguish wrong-site acquisition from missing breast images",
      "learningObjective": "Correlate a persistent examination finding with the complete imaging acquisition record, then choose a new targeted study rather than archive retrieval or repetition of an adequate mammographic acquisition.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.early-pregnancy.location-before-disposition.v1",
      "displayName": "Establish the early-pregnancy assessment pathway from discordant reassurance",
      "learningObjective": "Interpret early negative urine testing, persistent hCG, changing symptoms and limited pelvic acquisition, then prioritize the pregnancy-localization assessment before assigning a miscarriage or appendiceal disposition.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.phpt.native-hip-and-radial-acquisition.v1",
      "displayName": "Select valid hip and radial DXA acquisition regions in PHPT",
      "learningObjective": "Interpret the acquired lumbar series and hip hardware record, then combine a valid native-hip site with the PHPT forearm region.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.phpt.inherited-calcium-before-localization.v1",
      "displayName": "Clarify inherited hypercalcemia before operative localization",
      "learningObjective": "Interpret calcium/PTH, relative hypocalciuria and family/longitudinal findings, then pursue genetic clarification instead of assuming that young age establishes PHPT or that localization can establish its diagnosis.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "displayName": "Plan representative nodal tissue and ancillary handling after limited sampling",
      "learningObjective": "Interpret the prior same-target specimen and failed ancillary result, then combine a representative tissue method with processing that can answer the unresolved classification questions.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    }
  ],
  "cases": [
    {
      "id": "case.gs028c.palpable-breast.paired-dense-focal",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-dense-focal",
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
      "chiefComplaint": "Persistent breast thickening",
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
      "presentation": "{patientName}, a 44-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
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
          "chiefComplaint": "Persistent breast thickening",
          "presentation": "{patientName}, a 44-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock."
        },
        {
          "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Persistent breast thickening",
          "presentation": "{patientName}, a 58-year-old woman, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.paired-dense-focal.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
          "primaryConceptId": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
          "stem": "Which radiology request should be made at this visit for {patientName}'s persistent palpable finding?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Request targeted breast ultrasound",
              "isCorrect": true,
              "rationale": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "choice.flags2r2.20261105.g03.d1",
              "label": "Request archived breast ultrasound images",
              "isCorrect": false,
              "rationale": "Retrieval is a credible near-miss when an acquisition exists but transferred images are missing. The complete recorded acquisition here addresses the other marker, so retrieving that accession would not supply the required clinical-site correlation.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2r2.20261105.g03.d2",
              "label": "Request spot-compression breast mammography",
              "isCorrect": false,
              "rationale": "This would be reasonable if the mammographic acquisition did not cover the current marker. The supplied views already include it; the unresolved issue is targeted sonographic correlation with the actual clinical finding, not another mammographic view.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study. Retrieval is a credible near-miss when an acquisition exists but transferred images are missing. The complete recorded acquisition here addresses the other marker, so retrieving that accession would not supply the required clinical-site correlation. This would be reasonable if the mammographic acquisition did not cover the current marker. The supplied views already include it; the unresolved issue is targeted sonographic correlation with the actual clinical finding, not another mammographic view.",
          "teachingPoint": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study.",
          "exhibit": {
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
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2-round2.2026-11-05.v1)"
          ],
          "resultGateAfter": {
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
          "terminalDispositions": []
        },
        {
          "id": "node.gs028c.palpable-breast.paired-dense-focal.2",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "currentUpdate": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
          "stem": "Which next diagnostic step should evaluate {patientName}'s clinically suspicious palpable breast mass despite negative mammography and ultrasound?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Breast-specialist biopsy referral",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_1",
              "label": "Repeat targeted breast ultrasound",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d3_1",
              "label": "Repeat diagnostic mammography",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Contrast-enhanced breast MRI.”",
              "clinicalRationale": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat targeted breast ultrasound.”",
              "clinicalRationale": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat diagnostic mammography.”",
              "clinicalRationale": "Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study. Retrieval is a credible near-miss when an acquisition exists but transferred images are missing. The complete recorded acquisition here addresses the other marker, so retrieving that accession would not supply the required clinical-site correlation. This would be reasonable if the mammographic acquisition did not cover the current marker. The supplied views already include it; the unresolved issue is targeted sonographic correlation with the actual clinical finding, not another mammographic view. Persistent clinical suspicion overrides reassurance from negative imaging and requires core or surgical tissue diagnosis."
    },
    {
      "id": "case.asymptomatic-phpt.incidental-calcium",
      "displayName": "Asymptomatic primary-hyperparathyroidism assessment",
      "patientPresentationVariantId": "presentation.asymptomatic-phpt.incidental-calcium",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Calcium workup review",
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
      "presentation": "{patientName}, a 47-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
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
          "chiefComplaint": "Calcium workup review",
          "presentation": "{patientName}, a 47-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
        },
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
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
          "chiefComplaint": "Calcium workup review",
          "presentation": "{patientName}, a 47-year-old man, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
        },
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
          "prototypeDemographics": {
            "ageYears": 46,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Calcium workup review",
          "presentation": "{patientName}, a 46-year-old woman, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
        },
        {
          "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
          "prototypeDemographics": {
            "ageYears": 46,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Calcium workup review",
          "presentation": "{patientName}, a 46-year-old man, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fifth International Workshop PHPT guideline (2022)"
      ],
      "decisionNodes": [
        {
          "id": "node.asymptomatic-phpt.incidental-calcium.1",
          "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
          "primaryConceptId": "concept.phpt.native-hip-and-radial-acquisition.v1",
          "stem": "Which additional DXA acquisition should be requested for {patientName}'s skeletal assessment?",
          "answerChoices": [
            {
              "id": "three_site_dxa_1",
              "label": "Left hip and distal one-third radius",
              "isCorrect": true,
              "rationale": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral.",
              "serviceRequest": {
                "serviceId": "service.dxa"
              }
            },
            {
              "id": "choice.flags2r2.20261105.g05-staging.d1",
              "label": "Right hip and distal one-third radius",
              "isCorrect": false,
              "rationale": "The radial site is appropriate, but the proposed hip region contains the arthroplasty. It does not supply the intended native-hip assessment in this constructed record.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2r2.20261105.g05-staging.d2",
              "label": "Left hip and ultradistal radius",
              "isCorrect": false,
              "rationale": "The hip is suitable, but the forearm region is not the guideline-specified distal one-third radius. Selecting a native hip does not make different radial acquisition regions interchangeable.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2r2.20261105.g05-staging.d3",
              "label": "Right hip and ultradistal radius",
              "isCorrect": false,
              "rationale": "This combines the prosthetic hip region with a different radial region. Both components must be checked rather than choosing a familiar hip/forearm label.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral. The radial site is appropriate, but the proposed hip region contains the arthroplasty. It does not supply the intended native-hip assessment in this constructed record. The hip is suitable, but the forearm region is not the guideline-specified distal one-third radius. Selecting a native hip does not make different radial acquisition regions interchangeable. This combines the prosthetic hip region with a different radial region. Both components must be checked rather than choosing a familiar hip/forearm label.",
          "teachingPoint": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral.",
          "exhibit": {
            "kind": "table",
            "caption": "Existing skeletal acquisition record",
            "columnHeaders": [
              "Record",
              "Observation"
            ],
            "rowHeaders": [
              "Lumbar DXA series",
              "Pelvic radiograph"
            ],
            "cells": [
              [
                "L1–L4 acquired",
                "Within the age-appropriate reference range"
              ],
              [
                "Right femoral and acetabular prosthetic components; native left proximal femur",
                "No left hip implant"
              ]
            ]
          },
          "sourceLabels": [
            "Fifth International Workshop PHPT guideline (2022)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2-round2.2026-11-05.v1)"
          ],
          "resultGateAfter": {
            "id": "gate.asymptomatic-phpt.dxa.1",
            "resultTypeId": "service.dxa",
            "pendingLabel": "External DXA assessment pending",
            "resultNarrative": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.dxa.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.asymptomatic-phpt.incidental-calcium.2",
          "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
          "primaryConceptId": "concept.phpt.inherited-calcium-before-localization.v1",
          "currentUpdate": "The completed lumbar-spine, native-left-hip and one-third-radius density measurements are within age-appropriate reference ranges. A paired serum and complete 24-hour urine collection gives a calcium-to-creatinine clearance ratio below 0.01. Renal function and 25-hydroxyvitamin D are within reference ranges; there is no thiazide use. Earlier adult records show calcium in the same mildly elevated band, and the mother's records show a similar longstanding pattern.",
          "stem": "Which investigation should guide {patientName}'s parathyroid planning next?",
          "answerChoices": [
            {
              "id": "surgical_assessment_1",
              "label": "Calcium-sensing receptor gene assay",
              "isCorrect": true,
              "rationale": "The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2r2.20261105.g05.d1",
              "label": "Parathyroid sestamibi scintigraphy",
              "isCorrect": false,
              "rationale": "This is a credible next step if the clinician assumes that the biochemical pattern and young age have already settled PHPT and the need for localization. It would not resolve the inherited mimic raised by the urine/family record; localization is not a substitute for clarifying that diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2r2.20261105.g05.d2",
              "label": "PTH-related peptide assay",
              "isCorrect": false,
              "rationale": "A numerically reference-range intact PTH can tempt a different hypercalcemia workup. It does not exclude the recorded inherited calcium/PTH pattern, and this marker would not answer the family/genetic question supplied by the low urine ratio and longstanding familial findings.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case. This is a credible next step if the clinician assumes that the biochemical pattern and young age have already settled PHPT and the need for localization. It would not resolve the inherited mimic raised by the urine/family record; localization is not a substitute for clarifying that diagnosis. A numerically reference-range intact PTH can tempt a different hypercalcemia workup. It does not exclude the recorded inherited calcium/PTH pattern, and this marker would not answer the family/genetic question supplied by the low urine ratio and longstanding familial findings.",
          "teachingPoint": "The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case.",
          "sourceLabels": [
            "Fifth International Workshop PHPT guideline (2022)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2-round2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2r2.20261105.g05.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Parathyroid sestamibi scintigraphy”.",
              "clinicalRationale": "This is a credible next step if the clinician assumes that the biochemical pattern and young age have already settled PHPT and the need for localization. It would not resolve the inherited mimic raised by the urine/family record; localization is not a substitute for clarifying that diagnosis.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            },
            {
              "answerChoiceId": "choice.flags2r2.20261105.g05.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “PTH-related peptide assay”.",
              "clinicalRationale": "A numerically reference-range intact PTH can tempt a different hypercalcemia workup. It does not exclude the recorded inherited calcium/PTH pattern, and this marker would not answer the family/genetic question supplied by the low urine ratio and longstanding familial findings.",
              "sourceLabels": [
                "Fifth International Workshop PHPT guideline (2022)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral. The radial site is appropriate, but the proposed hip region contains the arthroplasty. It does not supply the intended native-hip assessment in this constructed record. The hip is suitable, but the forearm region is not the guideline-specified distal one-third radius. Selecting a native hip does not make different radial acquisition regions interchangeable. This combines the prosthetic hip region with a different radial region. Both components must be checked rather than choosing a familiar hip/forearm label. The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case. This is a credible next step if the clinician assumes that the biochemical pattern and young age have already settled PHPT and the need for localization. It would not resolve the inherited mimic raised by the urine/family record; localization is not a substitute for clarifying that diagnosis. A numerically reference-range intact PTH can tempt a different hypercalcemia workup. It does not exclude the recorded inherited calcium/PTH pattern, and this marker would not answer the family/genetic question supplied by the low urine ratio and longstanding familial findings."
    }
  ]
};

export const QUESTION_FLAGS2_ROUND3_RETAINED_TIMINGS: AnswerChoiceTimingRegistryEntry[] = [
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "correct_1",
          "choiceLabel": "Request targeted breast ultrasound",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.flags2r2.20261105.g03.d1",
          "choiceLabel": "Request archived breast ultrasound images",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.flags2r2.20261105.g03.d2",
          "choiceLabel": "Request spot-compression breast mammography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "surgical_assessment_1",
          "choiceLabel": "Calcium-sensing receptor gene assay",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.genetic"
          }
        },
        {
          "choiceId": "choice.flags2r2.20261105.g05.d1",
          "choiceLabel": "Parathyroid sestamibi scintigraphy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        },
        {
          "choiceId": "choice.flags2r2.20261105.g05.d2",
          "choiceLabel": "PTH-related peptide assay",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.metabolic_workup"
          }
        }
      ]
    }
  }
];

/** Exact planned waits; no diagnostic service executes in this retained standalone view. */
export const QUESTION_FLAGS2_ROUND3_CANDIDATE_TEST_ORDER_RECORDS = [
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r4",
    "choiceId": "choice.flags2r3.20261105.g03.key",
    "choiceLabel": "Breast-team tissue sampling",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r4",
    "choiceId": "choice.flags2r3.20261105.g03.d1",
    "choiceLabel": "Contrast-enhanced breast MRI",
    "timingProfileId": "timing.test.breast_mri",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r4",
    "choiceId": "choice.flags2r3.20261105.g03.d2",
    "choiceLabel": "Breast examination with interval ultrasonography",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r3",
    "choiceId": "choice.flags2r3.20261105.g05.key",
    "choiceLabel": "Biochemical surveillance",
    "timingProfileId": "timing.test.basic_labs",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
