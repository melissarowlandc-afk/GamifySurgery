/** Exact current input at intake. Frozen-save identities are never rewritten. */
export const QUESTION_FLAGS5_RETAINED_INPUT = {
  "id": "clinical.flags5-retained.20261116.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
    {
      "id": "concept.achalasia.manometric-recognition",
      "displayName": "Manometric recognition of achalasia",
      "learningObjective": "Recognize achalasia from absent peristalsis and impaired esophagogastric-junction relaxation without relying on an unsupported numeric threshold.",
      "earliestFacilityStage": 1,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.varicose-veins.reflux-duplex-evaluation",
      "displayName": "Venous reflux duplex evaluation",
      "learningObjective": "Select disease-specific reflux duplex for symptomatic varicose veins.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "displayName": "Referral after documented axial reflux",
      "learningObjective": "Use findings, candidacy, and preference to choose intervention referral or conservative care.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "displayName": "Assess perioperative cirrhosis risk",
      "learningObjective": "Use multidimensional liver, patient, procedure, and facility factors in perioperative cirrhosis assessment.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "displayName": "Optimize active cirrhosis decompensation",
      "learningObjective": "Pause a nonurgent elective plan for case-specific multidisciplinary optimization when active decompensation is present.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.statistics-ethics.capacity-refusal",
      "displayName": "Respect capable refusal",
      "learningObjective": "Distinguish an unwelcome choice from impaired decision-making capacity.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
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
      "id": "concept.preoperative-osa.validated-risk-screening",
      "displayName": "Screen preoperatively for OSA risk",
      "learningObjective": "Use a validated risk screen and communicate increased OSA probability without treating the screen as a diagnosis.",
      "earliestFacilityStage": 0,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.achalasia.high-resolution-manometry.v2",
      "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
      "learningObjective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
      "earliestFacilityStage": 1,
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
      "id": "case.achalasia.clinic-referral",
      "displayName": "Esophageal motility evaluation",
      "patientPresentationVariantId": "presentation.achalasia.clinic-referral",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Difficulty swallowing",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.achalasia.clinic-referral",
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.achalasia.clinic-referral.female.66",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.female.66",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.achalasia.clinic-referral.male.66",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.male.66",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 66-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.achalasia.clinic-referral.female.72",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.female.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 72-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.achalasia.clinic-referral.male.72",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.male.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 72-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
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
      "presentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.achalasia.clinic-referral.female.66",
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
          "presentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction."
        },
        {
          "id": "profile.achalasia.clinic-referral.male.66",
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
          "presentation": "{patientName}, a 66-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction."
        },
        {
          "id": "profile.achalasia.clinic-referral.female.72",
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
          "presentation": "{patientName}, a 72-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction."
        },
        {
          "id": "profile.achalasia.clinic-referral.male.72",
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
          "presentation": "{patientName}, a 72-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
      ],
      "decisionNodes": [
        {
          "id": "node.achalasia.clinic-referral.1",
          "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r5",
          "primaryConceptId": "concept.achalasia.high-resolution-manometry.v2",
          "currentUpdate": "The exported outside manometry plots have no gastric baseline channel. During the test the entire catheter moves upward with retching; the report nevertheless gives a junction relaxation value and recommends dilation.",
          "stem": "How should {patientName}'s next physiologic assessment be arranged?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "manometry_4",
              "label": "Manometry with endoscopic catheter placement",
              "isCorrect": true,
              "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible.",
              "serviceRequest": {
                "serviceId": "service.esophageal_manometry"
              }
            },
            {
              "id": "choice.qq20261102c.b04-context.d1",
              "label": "Obtain junction distensibility measurements with endoscopic FLIP",
              "isCorrect": false,
              "rationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102c.b04-context.d2",
              "label": "Obtain a timed barium esophagram with a tablet",
              "isCorrect": false,
              "rationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
          "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
          "sourceLabels": [
            "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)"
          ],
          "resultGateAfter": {
            "id": "gate.achalasia.manometry.4",
            "resultTypeId": "service.esophageal_manometry",
            "pendingLabel": "Esophageal manometry pending",
            "resultNarrative": "The esophageal pressure-study report is available for review.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.esophageal_manometry.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.achalasia.clinic-referral.2",
          "questionVariantId": "question.achalasia.manometric-recognition.v4.r4",
          "primaryConceptId": "concept.achalasia.manometric-recognition",
          "currentUpdate": "The endoscopy report also records marked resistance as the instrument crossed the distal junction. {patientName}'s clothes have become loose during the recent progression of symptoms; prior weights document a substantial decline.",
          "stem": "Which interpretation and next plan should guide {patientName}'s care?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "achalasia_4",
              "label": "Achalasia-pattern physiology; investigate a secondary junction lesion before treatment planning",
              "isCorrect": true,
              "rationale": "Recognizes failed contractions and impaired relaxation while responding to the older patient's progressive weight loss and endoscopic resistance.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d1",
              "label": "Achalasia-pattern physiology; proceed to treatment planning after the mucosal endoscopy",
              "isCorrect": false,
              "rationale": "Correctly reads the pressure pattern but overstates what a mucosal examination without an intraluminal mass excludes.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d2",
              "label": "Ineffective-motility physiology; investigate a secondary junction lesion before treatment planning",
              "isCorrect": false,
              "rationale": "Notices the alarm observations but counts subthreshold pressure deflections as retained effective contractions despite impaired relaxation.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d3",
              "label": "Ineffective-motility physiology; proceed to treatment planning after the mucosal endoscopy",
              "isCorrect": false,
              "rationale": "Combines a mistaken interpretation of the contractile measurements with premature closure of the secondary-cause assessment.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
          "teachingPoint": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
            "items": [
              {
                "label": "Junction measurement",
                "value": "Median relaxation pressure above the laboratory reference range"
              },
              {
                "label": "Distal contractile integral",
                "value": "Readouts of 30–80 mmHg·s·cm across the test swallows"
              },
              {
                "label": "Trace appearance",
                "value": "Small pressure deflections, without a moving distal contraction peak"
              }
            ]
          },
          "sourceLabels": [
            "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102b.b04.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Achalasia-pattern physiology; proceed to treatment planning after the mucosal endoscopy”.",
              "clinicalRationale": "Correctly reads the pressure pattern but overstates what a mucosal examination without an intraluminal mass excludes.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b04.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Ineffective-motility physiology; proceed to treatment planning after the mucosal endoscopy”.",
              "clinicalRationale": "Combines a mistaken interpretation of the contractile measurements with premature closure of the secondary-cause assessment.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b04.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Ineffective-motility physiology; investigate a secondary junction lesion before treatment planning”.",
              "clinicalRationale": "Notices the alarm observations but counts subthreshold pressure deflections as retained effective contractions despite impaired relaxation.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question. The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion."
    },
    {
      "id": "case.gs028.varicose-veins.paired-aching-standing",
      "displayName": "Symptomatic varicose veins",
      "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing",
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
      "chiefComplaint": "Aching leg veins",
      "presentation": "{patientName} is a 43-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43",
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
          "presentation": "{patientName} is a 43-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43",
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
          "presentation": "{patientName} is a 43-year-old man who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68",
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
          "presentation": "{patientName} is a 68-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68",
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
          "presentation": "{patientName} is a 68-year-old man who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SVS/AVF/AVLS varicose veins guideline Part I",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028.varicose-veins.paired-aching-standing.1",
          "questionVariantId": "question.varicose-veins.reflux-duplex-evaluation.v1",
          "primaryConceptId": "concept.varicose-veins.reflux-duplex-evaluation",
          "stem": "Which study should map the venous problem before treatment planning?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Venous reflux duplex",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.venous_duplex"
              }
            },
            {
              "id": "d1_1",
              "label": "Resting ankle-brachial index",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Lower-extremity CT",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "D-dimer assay",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": {
            "id": "gate.gs028.aching-standing",
            "resultTypeId": "service.venous_duplex",
            "pendingLabel": "Venous reflux duplex pending",
            "resultNarrative": "Duplex documents superficial axial reflux and no acute deep venous thrombosis.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.venous_duplex.in_house",
              "route.venous_duplex.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.gs028.varicose-veins.paired-aching-standing.2",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "currentUpdate": "Reflux duplex documents axial superficial reflux without acute DVT; specialist screening finds the patient medically eligible and still interested in treatment.",
          "stem": "Which next step best respects the findings and preference?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Refer for venous intervention",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Continue compression-first management",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Continue current self-care alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Start anticoagulation",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Continue compression-first management.”",
              "clinicalRationale": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Continue current self-care alone.”",
              "clinicalRationale": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Start anticoagulation.”",
              "clinicalRationale": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment. Refer for intervention assessment while leaving the exact procedure to specialist evaluation."
    },
    {
      "id": "case.gs028.varicose-veins.b-prefers-conservative",
      "displayName": "Symptomatic varicose veins",
      "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative",
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
      "chiefComplaint": "Prefer nonsurgical care",
      "presentation": "{patientName} is a 43-year-old woman who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43",
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
          "presentation": "{patientName} is a 43-year-old woman who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43",
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
          "presentation": "{patientName} is a 43-year-old man who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68",
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
          "presentation": "{patientName} is a 68-year-old woman who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68",
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
          "presentation": "{patientName} is a 68-year-old man who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SVS/AVF/AVLS varicose veins guideline Part I",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028.varicose-veins.b-prefers-conservative.1",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "stem": "Which plan best reflects shared decision-making?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Individualized conservative care",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Schedule procedural treatment now",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Prescribe anticoagulation",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_3",
              "label": "Discharge without education",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Patient preference can support conservative care; intervention is not mandatory for every reflux finding.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Schedule procedural treatment now.”",
              "clinicalRationale": "Patient preference can support conservative care; intervention is not mandatory for every reflux finding.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Prescribe anticoagulation.”",
              "clinicalRationale": "Patient preference can support conservative care; intervention is not mandatory for every reflux finding.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d3_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Discharge without education.”",
              "clinicalRationale": "Patient preference can support conservative care; intervention is not mandatory for every reflux finding.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Patient preference can support conservative care; intervention is not mandatory for every reflux finding."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin",
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
      "chiefComplaint": "Surgery risk review",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43",
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
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43",
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
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68",
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
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which assessment approach is most appropriate?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Perioperative risk review",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Use albumin as the sole decision",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Use patient age as the sole decision",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Use hernia size as the sole decision",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Perioperative cirrhosis assessment combines liver, patient, procedure, and center factors rather than one marker.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": []
        },
        {
          "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
          "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
          "currentUpdate": "The multidimensional review identifies uncontrolled ascites in this nonurgent case without an acute surgical emergency.",
          "stem": "Which plan is most appropriate now?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Optimize before elective surgery",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Proceed based on the clinic date",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Cancel surgery permanently",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Use albumin alone to decide",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Proceed based on the clinic date.”",
              "clinicalRationale": "For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Cancel surgery permanently.”",
              "clinicalRationale": "For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Use albumin alone to decide.”",
              "clinicalRationale": "For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Perioperative cirrhosis assessment combines liver, patient, procedure, and center factors rather than one marker. For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-compensated",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-compensated",
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
      "chiefComplaint": "Elective surgery planning",
      "presentation": "{patientName}, a 43-year-old woman with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.43",
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
          "presentation": "{patientName}, a 43-year-old woman with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.43",
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
          "presentation": "{patientName}, a 43-year-old man with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.68",
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
          "presentation": "{patientName}, a 68-year-old man with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-compensated.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which next step best frames risk assessment?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Joint liver-procedure risk assessment",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Clear surgery from compensation alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_2",
              "label": "Cancel every elective operation",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_2",
              "label": "Estimate risk from platelet count alone",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Clear surgery from compensation alone.”",
              "clinicalRationale": "A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Cancel every elective operation.”",
              "clinicalRationale": "A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Estimate risk from platelet count alone.”",
              "clinicalRationale": "A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension",
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
      "chiefComplaint": "Preoperative cirrhosis consult",
      "presentation": "{patientName}, a 43-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
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
          "presentation": "{patientName}, a 43-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
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
          "presentation": "{patientName}, a 43-year-old man, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
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
          "presentation": "{patientName}, a 68-year-old man, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which feature must remain central to the assessment?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Portal hypertension history",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "A composite liver-risk score alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "The planned procedure risk alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_3",
              "label": "The cardiopulmonary assessment alone",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “A composite liver-risk score alone.”",
              "clinicalRationale": "Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “The planned procedure risk alone.”",
              "clinicalRationale": "Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “The cardiopulmonary assessment alone.”",
              "clinicalRationale": "Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-center-expertise",
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
      "chiefComplaint": "Where to have surgery",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.43",
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
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.43",
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
          "presentation": "{patientName}, a 43-year-old man with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.68",
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
          "presentation": "{patientName}, a 68-year-old man with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which additional factor should influence planning?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Experienced multidisciplinary care",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Procedure complexity without facility review",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Liver severity without facility review",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_4",
              "label": "Comorbidity burden without facility review",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Procedure complexity without facility review.”",
              "clinicalRationale": "Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Liver severity without facility review.”",
              "clinicalRationale": "Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Comorbidity burden without facility review.”",
              "clinicalRationale": "Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis."
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
    },
    {
      "id": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "displayName": "Ethics and communication",
      "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Supported treatment decision",
      "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
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
          "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
          "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Informed Consent",
        "Decisions for Adult Patients Who Lack Capacity",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.1",
          "questionVariantId": "question.statistics-ethics.capacity-refusal.v4",
          "primaryConceptId": "concept.statistics-ethics.capacity-refusal",
          "stem": "How should the team approach {patientName}'s decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?",
          "answerChoices": [
            {
              "id": "key-4",
              "label": "Support and assess the patient's own decision",
              "isCorrect": true,
              "rationale": "Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-1",
              "label": "Obtain a surrogate's decision because of the diagnosis",
              "isCorrect": false,
              "rationale": "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-2",
              "label": "Require a family countersignature for this consent",
              "isCorrect": false,
              "rationale": "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-3",
              "label": "Require formal testing before discussing the choice",
              "isCorrect": false,
              "rationale": "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.",
          "teachingPoint": "Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.",
          "sourceLabels": [
            "Informed Consent",
            "Decisions for Adult Patients Who Lack Capacity",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": []
        },
        {
          "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "currentUpdate": "The team supports {patientName}'s own informed choice rather than replacing it because of the cognitive diagnosis. The same symptomatic varicose veins have documented axial superficial reflux without acute DVT. Specialist screening finds the patient medically eligible, and the patient remains interested in treatment after plain-language discussion. The next decision concerns the clinical referral plan.",
          "stem": "Which referral plan best fits {patientName}'s symptomatic varicose veins with axial reflux, medical eligibility and an informed preference for intervention?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Refer for venous intervention",
              "isCorrect": true,
              "rationale": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Continue compression-first management",
              "isCorrect": false,
              "rationale": "Long-term compression is not a mandatory prerequisite for every eligible patient.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Continue current self-care alone",
              "isCorrect": false,
              "rationale": "Persistent symptoms and treatment preference merit referral.",
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Start anticoagulation",
              "isCorrect": false,
              "rationale": "Reflux without thrombosis is not an indication for anticoagulation.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.",
          "teachingPoint": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part II",
            "Informed Consent",
            "Decisions for Adult Patients Who Lack Capacity"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028c.palpable-breast.paired-scar-edge",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge",
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
      "chiefComplaint": "Lump near an old scar",
      "presentation": "{patientName}, a 49-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49",
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
          "presentation": "{patientName}, a 49-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus."
        },
        {
          "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus."
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
          "id": "node.gs028c.palpable-breast.paired-scar-edge.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which imaging test should evaluate {patientName}'s new palpable breast finding after negative diagnostic mammography?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Targeted scar-edge ultrasound",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_2",
              "label": "Repeat the same mammographic views",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_2",
              "label": "Whole-breast MRI",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d3_2",
              "label": "Noncontrast chest CT",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ct"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A new reproducible focus near a scar still receives targeted ultrasound when mammography is negative.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": {
            "id": "gate.gs028c.scar-edge",
            "resultTypeId": "service.ultrasound",
            "pendingLabel": "Focused scar-edge ultrasound pending",
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
          "id": "node.gs028c.palpable-breast.paired-scar-edge.2",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "currentUpdate": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
          "stem": "Which next diagnostic step best addresses {patientName}'s clinically suspicious palpable breast mass despite negative mammography and ultrasound?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Breast-specialist biopsy referral",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_2",
              "label": "Repeat targeted breast ultrasound",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d3_2",
              "label": "Repeat diagnostic mammography",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A clinically suspicious, imaging-occult mass requires palpation-guided core or surgical biopsy.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Contrast-enhanced breast MRI.”",
              "clinicalRationale": "A clinically suspicious, imaging-occult mass requires palpation-guided core or surgical biopsy.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat targeted breast ultrasound.”",
              "clinicalRationale": "A clinically suspicious, imaging-occult mass requires palpation-guided core or surgical biopsy.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d3_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat diagnostic mammography.”",
              "clinicalRationale": "A clinically suspicious, imaging-occult mass requires palpation-guided core or surgical biopsy.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "A new reproducible focus near a scar still receives targeted ultrasound when mammography is negative. A clinically suspicious, imaging-occult mass requires palpation-guided core or surgical biopsy."
    },
    {
      "id": "case.gs028c.palpable-breast.a-recent-negative",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 42,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Lump after normal imaging",
      "presentation": "{patientName}, a 42-year-old woman, noticed a localized breast lump shortly after negative diagnostic mammography. The clinician can reproduce the same mobile focal abnormality, and no ultrasound has been performed.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 42-year-old woman, noticed a localized breast lump shortly after negative diagnostic mammography. The clinician can reproduce the same mobile focal abnormality, and no ultrasound has been performed."
        },
        {
          "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55",
          "prototypeDemographics": {
            "ageYears": 55,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 55-year-old woman, noticed a localized breast lump shortly after negative diagnostic mammography. The clinician can reproduce the same mobile focal abnormality, and no ultrasound has been performed."
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
          "id": "node.gs028c.palpable-breast.a-recent-negative.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "What is the most appropriate next imaging study for {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Targeted breast ultrasound",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_3",
              "label": "Repeat diagnostic mammography immediately",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_3",
              "label": "Breast MRI before ultrasound",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d3_3",
              "label": "Contrast chest CT",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ct"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use targeted ultrasound to evaluate the persistent clinical target despite a recent negative mammogram.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat diagnostic mammography immediately.”",
              "clinicalRationale": "Use targeted ultrasound to evaluate the persistent clinical target despite a recent negative mammogram.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Breast MRI before ultrasound.”",
              "clinicalRationale": "Use targeted ultrasound to evaluate the persistent clinical target despite a recent negative mammogram.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d3_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Contrast chest CT.”",
              "clinicalRationale": "Use targeted ultrasound to evaluate the persistent clinical target despite a recent negative mammogram.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Use targeted ultrasound to evaluate the persistent clinical target despite a recent negative mammogram."
    },
    {
      "id": "case.gs028c.palpable-breast.a-discordant-exam",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam",
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
      "chiefComplaint": "Imaging does not explain lump",
      "presentation": "{patientName}, a 47-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47",
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
          "presentation": "{patientName}, a 47-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done."
        },
        {
          "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61",
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
          "presentation": "{patientName}, a 61-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done."
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
          "id": "node.gs028c.palpable-breast.a-discordant-exam.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which imaging study should address {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Targeted breast ultrasound",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_4",
              "label": "Screening mammography next year",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_4",
              "label": "Breast MRI as first follow-up",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d3_4",
              "label": "Contrast chest CT",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ct"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Clinical-mammographic discordance is evaluated with targeted ultrasound rather than return to screening.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Screening mammography next year.”",
              "clinicalRationale": "Clinical-mammographic discordance is evaluated with targeted ultrasound rather than return to screening.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Breast MRI as first follow-up.”",
              "clinicalRationale": "Clinical-mammographic discordance is evaluated with targeted ultrasound rather than return to screening.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Contrast chest CT.”",
              "clinicalRationale": "Clinical-mammographic discordance is evaluated with targeted ultrasound rather than return to screening.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Clinical-mammographic discordance is evaluated with targeted ultrasound rather than return to screening."
    },
    {
      "id": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging",
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
      "chiefComplaint": "Enlarging breast mass",
      "presentation": "{patientName}, a 43-year-old woman, reports that a discrete palpable mass has enlarged over two visits. Diagnostic mammography and targeted ultrasound remain negative, and there are no inflammatory symptoms.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43",
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
          "presentation": "{patientName}, a 43-year-old woman, reports that a discrete palpable mass has enlarged over two visits. Diagnostic mammography and targeted ultrasound remain negative, and there are no inflammatory symptoms."
        },
        {
          "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57",
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
          "presentation": "{patientName}, a 57-year-old woman, reports that a discrete palpable mass has enlarged over two visits. Diagnostic mammography and targeted ultrasound remain negative, and there are no inflammatory symptoms."
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
          "id": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "stem": "How should {patientName}'s enlarging palpable breast mass be diagnosed after negative mammography and ultrasound?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Breast-specialist biopsy referral",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_3",
              "label": "Repeat targeted breast ultrasound",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d3_3",
              "label": "Repeat diagnostic mammography",
              "isCorrect": false,
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "An enlarging persistent mass requires tissue diagnosis even when mammography and ultrasound are negative.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Contrast-enhanced breast MRI.”",
              "clinicalRationale": "An enlarging persistent mass requires tissue diagnosis even when mammography and ultrasound are negative.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat targeted breast ultrasound.”",
              "clinicalRationale": "An enlarging persistent mass requires tissue diagnosis even when mammography and ultrasound are negative.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d3_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Repeat diagnostic mammography.”",
              "clinicalRationale": "An enlarging persistent mass requires tissue diagnosis even when mammography and ultrasound are negative.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ]
        }
      ],
      "learningSummary": "An enlarging persistent mass requires tissue diagnosis even when mammography and ultrasound are negative."
    },
    {
      "id": "case.gs028d.anesthesia.a-snoring-surgery",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-snoring-surgery",
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
      "chiefComplaint": "Surgery sleep screening",
      "presentation": "{patientName}, a 44-year-old woman, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.44",
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
          "presentation": "{patientName}, a 44-year-old woman, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.44",
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
          "presentation": "{patientName}, a 44-year-old man, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.63",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old woman, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.63",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old man, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
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
          "id": "node.gs028d.anesthesia.a-snoring-surgery.1",
          "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1",
          "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
          "stem": "What is the appropriate next preoperative step?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Use validated OSA screening",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Diagnose OSA from snoring alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Cancel surgery automatically",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Ignore sleep symptoms",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a validated screen, communicate the risk category, and keep screening distinct from diagnosis.",
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
              "consequenceNarrative": "The encounter recorded “Diagnose OSA from snoring alone.”",
              "clinicalRationale": "Use a validated screen, communicate the risk category, and keep screening distinct from diagnosis.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Cancel surgery automatically.”",
              "clinicalRationale": "Use a validated screen, communicate the risk category, and keep screening distinct from diagnosis.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Ignore sleep symptoms.”",
              "clinicalRationale": "Use a validated screen, communicate the risk category, and keep screening distinct from diagnosis.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Use a validated screen, communicate the risk category, and keep screening distinct from diagnosis."
    },
    {
      "id": "case.gs028d.anesthesia.a-validated-not-impression",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Preop sleep concern",
      "presentation": "{patientName}, a 46-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
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
          "presentation": "{patientName}, a 46-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
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
          "presentation": "{patientName}, a 46-year-old man, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
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
          "presentation": "{patientName}, a 68-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
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
          "presentation": "{patientName}, a 68-year-old man, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
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
          "id": "node.gs028d.anesthesia.a-validated-not-impression.1",
          "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4",
          "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
          "stem": "Which approach provides the most defensible preoperative risk classification?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Use validated OSA screening",
              "isCorrect": true,
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Use age alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Use body weight alone",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_4",
              "label": "Assign a diagnosis from appearance",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A validated screen provides a consistent risk classification while remaining distinct from a diagnostic study.",
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
              "consequenceNarrative": "The encounter recorded “Use age alone.”",
              "clinicalRationale": "A validated screen provides a consistent risk classification while remaining distinct from a diagnostic study.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Use body weight alone.”",
              "clinicalRationale": "A validated screen provides a consistent risk classification while remaining distinct from a diagnostic study.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Assign a diagnosis from appearance.”",
              "clinicalRationale": "A validated screen provides a consistent risk classification while remaining distinct from a diagnostic study.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            }
          ]
        }
      ],
      "learningSummary": "A validated screen provides a consistent risk classification while remaining distinct from a diagnostic study."
    }
  ]
} as const;
export const QUESTION_FLAGS5_RETAINED_QUESTIONS = [
  {
    "contentVersion": "question-authoring.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.achalasia.high-resolution-manometry.v4.r5",
    "conceptId": "concept.achalasia.high-resolution-manometry.v2",
    "stem": "How should {patientName}'s next physiologic assessment be arranged?",
    "answerChoices": [
      {
        "id": "manometry_4",
        "label": "Manometry with endoscopic catheter placement",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible."
      },
      {
        "id": "choice.qq20261102c.b04-context.d1",
        "label": "Obtain junction distensibility measurements with endoscopic FLIP",
        "isCorrect": false,
        "distractorRationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
      },
      {
        "id": "choice.qq20261102c.b04-context.d2",
        "label": "Obtain a timed barium esophagram with a tablet",
        "isCorrect": false,
        "distractorRationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
      }
    ],
    "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
    "supportingEvidenceClaimIds": [
      "claim.achalasia.high-resolution-manometry",
      "claim.qq20261102a.esophageal-physiology-sequence",
      "claim.qq20261102c.hrm-incomplete-placement"
    ],
    "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question."
  },
  {
    "contentVersion": "question-authoring.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.achalasia.manometric-recognition.v4.r4",
    "conceptId": "concept.achalasia.manometric-recognition",
    "stem": "Which interpretation and next plan should guide {patientName}'s care?",
    "answerChoices": [
      {
        "id": "achalasia_4",
        "label": "Achalasia-pattern physiology; investigate a secondary junction lesion before treatment planning",
        "isCorrect": true,
        "distractorRationale": null,
        "rationale": "Recognizes failed contractions and impaired relaxation while responding to the older patient's progressive weight loss and endoscopic resistance."
      },
      {
        "id": "choice.qq20261102b.b04.d1",
        "label": "Achalasia-pattern physiology; proceed to treatment planning after the mucosal endoscopy",
        "isCorrect": false,
        "distractorRationale": "Correctly reads the pressure pattern but overstates what a mucosal examination without an intraluminal mass excludes."
      },
      {
        "id": "choice.qq20261102b.b04.d2",
        "label": "Ineffective-motility physiology; investigate a secondary junction lesion before treatment planning",
        "isCorrect": false,
        "distractorRationale": "Notices the alarm observations but counts subthreshold pressure deflections as retained effective contractions despite impaired relaxation."
      },
      {
        "id": "choice.qq20261102b.b04.d3",
        "label": "Ineffective-motility physiology; proceed to treatment planning after the mucosal endoscopy",
        "isCorrect": false,
        "distractorRationale": "Combines a mistaken interpretation of the contractile measurements with premature closure of the secondary-cause assessment."
      }
    ],
    "explanation": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
    "supportingEvidenceClaimIds": [
      "claim.achalasia.manometric-recognition",
      "claim.achalasia.high-resolution-manometry",
      "claim.qq20261102.motility-egjoo",
      "claim.qq20261102.motility-absent-contractility",
      "claim.qq20261102a.failed-contraction-threshold",
      "claim.qq20261102b.secondary-achalasia-assessment"
    ],
    "teachingPoint": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
      "items": [
        {
          "label": "Junction measurement",
          "value": "Median relaxation pressure above the laboratory reference range"
        },
        {
          "label": "Distal contractile integral",
          "value": "Readouts of 30–80 mmHg·s·cm across the test swallows"
        },
        {
          "label": "Trace appearance",
          "value": "Small pressure deflections, without a moving distal contraction peak"
        }
      ]
    }
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.varicose-veins.reflux-duplex-evaluation.v1",
    "conceptId": "concept.varicose-veins.reflux-duplex-evaluation",
    "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing",
    "patientPresentation": "{patientName} is a 43-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43",
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
        "presentation": "{patientName} is a 43-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      },
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43",
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
        "presentation": "{patientName} is a 43-year-old man who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      },
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68",
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
        "presentation": "{patientName} is a 68-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      },
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68",
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
        "presentation": "{patientName} is a 68-year-old man who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      }
    ],
    "stem": "Which study should map the venous problem before treatment planning?",
    "answerChoices": [
      {
        "id": "correct_1",
        "label": "Venous reflux duplex",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_1",
        "label": "Resting ankle-brachial index",
        "isCorrect": false,
        "distractorRationale": "Arterial physiology answers a perfusion question rather than mapping venous reflux."
      },
      {
        "id": "d2_1",
        "label": "Lower-extremity CT",
        "isCorrect": false,
        "distractorRationale": "CT does not replace dynamic reflux mapping."
      },
      {
        "id": "d3_1",
        "label": "D-dimer assay",
        "isCorrect": false,
        "distractorRationale": "The presentation is chronic reflux rather than an acute DVT rule-out scenario."
      }
    ],
    "explanation": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment.",
    "supportingEvidenceClaimIds": [
      "claim.varicose.reflux-duplex"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-28",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v1",
    "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
    "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing",
    "patientPresentation": "{patientName} is a 43-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43",
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
        "presentation": "{patientName} is a 43-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      },
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43",
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
        "presentation": "{patientName} is a 43-year-old man who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      },
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68",
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
        "presentation": "{patientName} is a 68-year-old woman who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      },
      {
        "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68",
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
        "presentation": "{patientName} is a 68-year-old man who presents with visible calf varicosities, aching and heaviness after standing, and interest in treatment. There is no acute swelling, erythema, ulcer, or cardiopulmonary symptom."
      }
    ],
    "reachedCurrentUpdate": "Reflux duplex documents axial superficial reflux without acute DVT; specialist screening finds the patient medically eligible and still interested in treatment.",
    "stem": "Which next step best respects the findings and preference?",
    "answerChoices": [
      {
        "id": "correct_1",
        "label": "Refer for venous intervention",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_1",
        "label": "Continue compression-first management",
        "isCorrect": false,
        "distractorRationale": "Long-term compression is not a mandatory prerequisite for every eligible patient."
      },
      {
        "id": "d2_1",
        "label": "Continue current self-care alone",
        "isCorrect": false,
        "distractorRationale": "Persistent symptoms and treatment preference merit referral."
      },
      {
        "id": "d3_1",
        "label": "Start anticoagulation",
        "isCorrect": false,
        "distractorRationale": "Reflux without thrombosis is not an indication for anticoagulation."
      }
    ],
    "explanation": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
    "supportingEvidenceClaimIds": [
      "claim.varicose.intervention-referral",
      "claim.varicose.conservative-boundary"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-28",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v3",
    "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
    "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative",
    "patientPresentation": "{patientName} is a 43-year-old woman who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43",
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
        "presentation": "{patientName} is a 43-year-old woman who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
      },
      {
        "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43",
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
        "presentation": "{patientName} is a 43-year-old man who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
      },
      {
        "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68",
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
        "presentation": "{patientName} is a 68-year-old woman who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
      },
      {
        "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68",
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
        "presentation": "{patientName} is a 68-year-old man who presents with symptomatic axial reflux on completed duplex but mild functional effect and a preference to avoid a procedure after informed discussion."
      }
    ],
    "stem": "Which plan best reflects shared decision-making?",
    "answerChoices": [
      {
        "id": "correct_3",
        "label": "Individualized conservative care",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_3",
        "label": "Schedule procedural treatment now",
        "isCorrect": false,
        "distractorRationale": "Treatment preference must be respected."
      },
      {
        "id": "d2_3",
        "label": "Prescribe anticoagulation",
        "isCorrect": false,
        "distractorRationale": "Reflux alone does not require anticoagulation."
      },
      {
        "id": "d3_3",
        "label": "Discharge without education",
        "isCorrect": false,
        "distractorRationale": "Conservative care still includes symptom guidance and safety-netting."
      }
    ],
    "explanation": "Patient preference can support conservative care; intervention is not mandatory for every reflux finding.",
    "supportingEvidenceClaimIds": [
      "claim.varicose.conservative-boundary"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-28",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1",
    "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
    "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin",
    "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43",
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
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43",
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
        "presentation": "{patientName}, a 43-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68",
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
        "presentation": "{patientName}, a 68-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      }
    ],
    "stem": "Which assessment approach is most appropriate?",
    "answerChoices": [
      {
        "id": "correct_1",
        "label": "Perioperative risk review",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_1",
        "label": "Use albumin as the sole decision",
        "isCorrect": false,
        "distractorRationale": "One laboratory value cannot capture perioperative cirrhosis risk."
      },
      {
        "id": "d2_1",
        "label": "Use patient age as the sole decision",
        "isCorrect": false,
        "distractorRationale": "Age alone omits liver and procedure-specific factors."
      },
      {
        "id": "d3_1",
        "label": "Use hernia size as the sole decision",
        "isCorrect": false,
        "distractorRationale": "Procedure anatomy alone omits liver severity and comorbidity."
      }
    ],
    "explanation": "Perioperative cirrhosis assessment combines liver, patient, procedure, and center factors rather than one marker.",
    "supportingEvidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-29",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1",
    "conceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
    "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin",
    "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43",
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
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43",
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
        "presentation": "{patientName}, a 43-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68",
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
        "presentation": "{patientName}, a 68-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      }
    ],
    "reachedCurrentUpdate": "The multidimensional review identifies uncontrolled ascites in this nonurgent case without an acute surgical emergency.",
    "stem": "Which plan is most appropriate now?",
    "answerChoices": [
      {
        "id": "correct_1",
        "label": "Optimize before elective surgery",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_1",
        "label": "Proceed based on the clinic date",
        "isCorrect": false,
        "distractorRationale": "Scheduling does not override active decompensation."
      },
      {
        "id": "d2_1",
        "label": "Cancel surgery permanently",
        "isCorrect": false,
        "distractorRationale": "The current issue is optimization and reassessment, not a universal prohibition."
      },
      {
        "id": "d3_1",
        "label": "Use albumin alone to decide",
        "isCorrect": false,
        "distractorRationale": "One laboratory value cannot settle the timing decision."
      }
    ],
    "explanation": "For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding.",
    "supportingEvidenceClaimIds": [
      "claim.cirrhosis.optimize-decompensation"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-29",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2",
    "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
    "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-compensated",
    "patientPresentation": "{patientName}, a 43-year-old woman with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.43",
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
        "presentation": "{patientName}, a 43-year-old woman with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.43",
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
        "presentation": "{patientName}, a 43-year-old man with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.68",
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
        "presentation": "{patientName}, a 68-year-old man with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review."
      }
    ],
    "stem": "Which next step best frames risk assessment?",
    "answerChoices": [
      {
        "id": "correct_2",
        "label": "Joint liver-procedure risk assessment",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_2",
        "label": "Clear surgery from compensation alone",
        "isCorrect": false,
        "distractorRationale": "Compensated status does not by itself define total operative risk."
      },
      {
        "id": "d2_2",
        "label": "Cancel every elective operation",
        "isCorrect": false,
        "distractorRationale": "Cirrhosis does not create a universal prohibition."
      },
      {
        "id": "d3_2",
        "label": "Estimate risk from platelet count alone",
        "isCorrect": false,
        "distractorRationale": "One laboratory measure cannot replace a complete assessment."
      }
    ],
    "explanation": "A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise.",
    "supportingEvidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-29",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3",
    "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
    "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "patientPresentation": "{patientName}, a 43-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
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
        "presentation": "{patientName}, a 43-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
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
        "presentation": "{patientName}, a 43-year-old man, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
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
        "presentation": "{patientName}, a 68-year-old man, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      }
    ],
    "stem": "Which feature must remain central to the assessment?",
    "answerChoices": [
      {
        "id": "correct_3",
        "label": "Portal hypertension history",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_3",
        "label": "A composite liver-risk score alone",
        "isCorrect": false,
        "distractorRationale": "A score should not replace clinically important portal-hypertension findings."
      },
      {
        "id": "d2_3",
        "label": "The planned procedure risk alone",
        "isCorrect": false,
        "distractorRationale": "Procedure risk matters but does not replace liver and patient assessment."
      },
      {
        "id": "d3_3",
        "label": "The cardiopulmonary assessment alone",
        "isCorrect": false,
        "distractorRationale": "Comorbidity assessment matters but does not erase portal-hypertension risk."
      }
    ],
    "explanation": "Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available.",
    "supportingEvidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-29",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4",
    "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
    "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-center-expertise",
    "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.43",
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
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.43",
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
        "presentation": "{patientName}, a 43-year-old man with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.68",
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
        "presentation": "{patientName}, a 68-year-old man with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed."
      }
    ],
    "stem": "Which additional factor should influence planning?",
    "answerChoices": [
      {
        "id": "correct_4",
        "label": "Experienced multidisciplinary care",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_4",
        "label": "Procedure complexity without facility review",
        "isCorrect": false,
        "distractorRationale": "Procedure complexity matters but does not establish available rescue capability."
      },
      {
        "id": "d2_4",
        "label": "Liver severity without facility review",
        "isCorrect": false,
        "distractorRationale": "Liver severity matters but does not establish local multidisciplinary capability."
      },
      {
        "id": "d3_4",
        "label": "Comorbidity burden without facility review",
        "isCorrect": false,
        "distractorRationale": "Comorbidity matters but does not determine whether the center has needed expertise."
      }
    ],
    "explanation": "Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis.",
    "supportingEvidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-09-29",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
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
  },
  {
    "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.statistics-ethics.capacity-refusal.v4",
    "conceptId": "concept.statistics-ethics.capacity-refusal",
    "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
    "patientPresentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
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
        "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
        "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      }
    ],
    "stem": "How should the team approach {patientName}'s decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?",
    "answerChoices": [
      {
        "id": "key-4",
        "label": "Support and assess the patient's own decision",
        "isCorrect": true,
        "rationale": "Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.",
        "distractorRationale": null
      },
      {
        "id": "wrong-4-1",
        "label": "Obtain a surrogate's decision because of the diagnosis",
        "isCorrect": false,
        "rationale": "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.",
        "distractorRationale": "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support."
      },
      {
        "id": "wrong-4-2",
        "label": "Require a family countersignature for this consent",
        "isCorrect": false,
        "rationale": "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.",
        "distractorRationale": "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent."
      },
      {
        "id": "wrong-4-3",
        "label": "Require formal testing before discussing the choice",
        "isCorrect": false,
        "rationale": "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.",
        "distractorRationale": "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities."
      }
    ],
    "explanation": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.",
    "teachingPoint": "Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.",
    "supportingEvidenceClaimIds": [
      "claim.gs028se.capacity-refusal.4",
      "claim.gs028se.capacity-refusal.3",
      "claim.varicose.intervention-referral"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-09-29.statistics-ethics.p2e.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4",
    "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
    "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
    "patientPresentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
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
        "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
        "prototypeDemographics": {
          "ageYears": 58,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
        "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
      }
    ],
    "reachedCurrentUpdate": "The team supports {patientName}'s own informed choice rather than replacing it because of the cognitive diagnosis. The same symptomatic varicose veins have documented axial superficial reflux without acute DVT. Specialist screening finds the patient medically eligible, and the patient remains interested in treatment after plain-language discussion. The next decision concerns the clinical referral plan.",
    "stem": "Which referral plan best fits {patientName}'s symptomatic varicose veins with axial reflux, medical eligibility and an informed preference for intervention?",
    "answerChoices": [
      {
        "id": "correct_1",
        "label": "Refer for venous intervention",
        "isCorrect": true,
        "rationale": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
        "distractorRationale": null
      },
      {
        "id": "d1_1",
        "label": "Continue compression-first management",
        "isCorrect": false,
        "rationale": "Long-term compression is not a mandatory prerequisite for every eligible patient.",
        "distractorRationale": "Long-term compression is not a mandatory prerequisite for every eligible patient."
      },
      {
        "id": "d2_1",
        "label": "Continue current self-care alone",
        "isCorrect": false,
        "rationale": "Persistent symptoms and treatment preference merit referral.",
        "distractorRationale": "Persistent symptoms and treatment preference merit referral."
      },
      {
        "id": "d3_1",
        "label": "Start anticoagulation",
        "isCorrect": false,
        "rationale": "Reflux without thrombosis is not an indication for anticoagulation.",
        "distractorRationale": "Reflux without thrombosis is not an indication for anticoagulation."
      }
    ],
    "explanation": "Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.",
    "teachingPoint": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
    "supportingEvidenceClaimIds": [
      "claim.varicose.intervention-referral",
      "claim.varicose.conservative-boundary",
      "claim.gs028se.capacity-refusal.4",
      "claim.gs028se.capacity-refusal.3"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-17",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.palpable-breast.negative-mammogram-targeted-us.v2",
    "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
    "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge",
    "patientPresentation": "{patientName}, a 49-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49",
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
        "presentation": "{patientName}, a 49-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus."
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 63-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus."
      }
    ],
    "stem": "Which imaging test should evaluate {patientName}'s new palpable breast finding after negative diagnostic mammography?",
    "answerChoices": [
      {
        "id": "correct_2",
        "label": "Targeted scar-edge ultrasound",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_2",
        "label": "Repeat the same mammographic views",
        "isCorrect": false,
        "distractorRationale": "The completed diagnostic views already show stable scar without explaining the new palpable focus."
      },
      {
        "id": "d2_2",
        "label": "Whole-breast MRI",
        "isCorrect": false,
        "distractorRationale": "MRI is not the usual next step before focused ultrasound of this discrete clinical target."
      },
      {
        "id": "d3_2",
        "label": "Noncontrast chest CT",
        "isCorrect": false,
        "distractorRationale": "Chest CT lacks the focused breast characterization needed here."
      }
    ],
    "explanation": "A new reproducible focus near a scar still receives targeted ultrasound when mammography is negative.",
    "supportingEvidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-02",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2",
    "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
    "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge",
    "patientPresentation": "{patientName}, a 49-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49",
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
        "presentation": "{patientName}, a 49-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus."
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 63-year-old woman, reports a new discrete lump at the edge of a remote benign breast-surgery scar. Diagnostic mammographic views show only stable scar and do not explain the palpable focus."
      }
    ],
    "reachedCurrentUpdate": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
    "stem": "Which next diagnostic step best addresses {patientName}'s clinically suspicious palpable breast mass despite negative mammography and ultrasound?",
    "answerChoices": [
      {
        "id": "correct_2",
        "label": "Breast-specialist biopsy referral",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_2",
        "label": "Contrast-enhanced breast MRI",
        "isCorrect": false,
        "distractorRationale": "MRI does not replace tissue diagnosis of a reproducible tethered mass."
      },
      {
        "id": "d2_2",
        "label": "Repeat targeted breast ultrasound",
        "isCorrect": false,
        "distractorRationale": "A second negative ultrasound would not resolve the suspicious examination."
      },
      {
        "id": "d3_2",
        "label": "Repeat diagnostic mammography",
        "isCorrect": false,
        "distractorRationale": "Repeated negative mammography should not postpone histologic diagnosis."
      }
    ],
    "explanation": "A clinically suspicious, imaging-occult mass requires palpation-guided core or surgical biopsy.",
    "supportingEvidenceClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-02",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.palpable-breast.negative-mammogram-targeted-us.v3",
    "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
    "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative",
    "patientPresentation": "{patientName}, a 42-year-old woman, noticed a localized breast lump shortly after negative diagnostic mammography. The clinician can reproduce the same mobile focal abnormality, and no ultrasound has been performed.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42",
        "prototypeDemographics": {
          "ageYears": 42,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 42-year-old woman, noticed a localized breast lump shortly after negative diagnostic mammography. The clinician can reproduce the same mobile focal abnormality, and no ultrasound has been performed."
      },
      {
        "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55",
        "prototypeDemographics": {
          "ageYears": 55,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 55-year-old woman, noticed a localized breast lump shortly after negative diagnostic mammography. The clinician can reproduce the same mobile focal abnormality, and no ultrasound has been performed."
      }
    ],
    "stem": "What is the most appropriate next imaging study for {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
    "answerChoices": [
      {
        "id": "correct_3",
        "label": "Targeted breast ultrasound",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_3",
        "label": "Repeat diagnostic mammography immediately",
        "isCorrect": false,
        "distractorRationale": "Immediate repetition of the completed study does not answer the focal sonographic question."
      },
      {
        "id": "d2_3",
        "label": "Breast MRI before ultrasound",
        "isCorrect": false,
        "distractorRationale": "MRI is not the standard next test before targeted ultrasound in this ordinary presentation."
      },
      {
        "id": "d3_3",
        "label": "Contrast chest CT",
        "isCorrect": false,
        "distractorRationale": "CT is not a dedicated test for a small palpable breast focus."
      }
    ],
    "explanation": "Use targeted ultrasound to evaluate the persistent clinical target despite a recent negative mammogram.",
    "supportingEvidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-02",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.palpable-breast.negative-mammogram-targeted-us.v4",
    "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
    "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam",
    "patientPresentation": "{patientName}, a 47-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47",
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
        "presentation": "{patientName}, a 47-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done."
      },
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61",
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
        "presentation": "{patientName}, a 61-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done."
      }
    ],
    "stem": "Which imaging study should address {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
    "answerChoices": [
      {
        "id": "correct_4",
        "label": "Targeted breast ultrasound",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_4",
        "label": "Screening mammography next year",
        "isCorrect": false,
        "distractorRationale": "Routine screening does not resolve a current persistent focal symptom."
      },
      {
        "id": "d2_4",
        "label": "Breast MRI as first follow-up",
        "isCorrect": false,
        "distractorRationale": "MRI is not the routine next step before targeted ultrasound for this focal discordance."
      },
      {
        "id": "d3_4",
        "label": "Contrast chest CT",
        "isCorrect": false,
        "distractorRationale": "CT is not the appropriate dedicated breast test for focal thickening."
      }
    ],
    "explanation": "Clinical-mammographic discordance is evaluated with targeted ultrasound rather than return to screening.",
    "supportingEvidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-02",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3",
    "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
    "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging",
    "patientPresentation": "{patientName}, a 43-year-old woman, reports that a discrete palpable mass has enlarged over two visits. Diagnostic mammography and targeted ultrasound remain negative, and there are no inflammatory symptoms.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43",
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
        "presentation": "{patientName}, a 43-year-old woman, reports that a discrete palpable mass has enlarged over two visits. Diagnostic mammography and targeted ultrasound remain negative, and there are no inflammatory symptoms."
      },
      {
        "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57",
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
        "presentation": "{patientName}, a 57-year-old woman, reports that a discrete palpable mass has enlarged over two visits. Diagnostic mammography and targeted ultrasound remain negative, and there are no inflammatory symptoms."
      }
    ],
    "stem": "How should {patientName}'s enlarging palpable breast mass be diagnosed after negative mammography and ultrasound?",
    "answerChoices": [
      {
        "id": "correct_3",
        "label": "Breast-specialist biopsy referral",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_3",
        "label": "Contrast-enhanced breast MRI",
        "isCorrect": false,
        "distractorRationale": "More imaging must not substitute for histology of an enlarging suspicious mass."
      },
      {
        "id": "d2_3",
        "label": "Repeat targeted breast ultrasound",
        "isCorrect": false,
        "distractorRationale": "Repeating the negative study does not answer the histologic question created by growth."
      },
      {
        "id": "d3_3",
        "label": "Repeat diagnostic mammography",
        "isCorrect": false,
        "distractorRationale": "Another negative mammogram would not resolve an enlarging palpable abnormality."
      }
    ],
    "explanation": "An enlarging persistent mass requires tissue diagnosis even when mammography and ultrasound are negative.",
    "supportingEvidenceClaimIds": [
      "claim.gs028c.palpable.biopsy"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-02",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-03.coverage-gaps.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.preoperative-osa.validated-risk-screening.v1",
    "conceptId": "concept.preoperative-osa.validated-risk-screening",
    "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-snoring-surgery",
    "patientPresentation": "{patientName}, a 44-year-old woman, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.44",
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
        "presentation": "{patientName}, a 44-year-old woman, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
      },
      {
        "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.44",
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
        "presentation": "{patientName}, a 44-year-old man, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
      },
      {
        "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.63",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 63-year-old woman, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
      },
      {
        "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.63",
        "prototypeDemographics": {
          "ageYears": 63,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "presentation": "{patientName}, a 63-year-old man, is preparing for elective abdominal surgery and reports loud snoring and witnessed breathing pauses without a prior sleep-study diagnosis."
      }
    ],
    "stem": "What is the appropriate next preoperative step?",
    "answerChoices": [
      {
        "id": "correct_1",
        "label": "Use validated OSA screening",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_1",
        "label": "Diagnose OSA from snoring alone",
        "isCorrect": false,
        "distractorRationale": "Symptoms alone do not establish the diagnosis."
      },
      {
        "id": "d2_1",
        "label": "Cancel surgery automatically",
        "isCorrect": false,
        "distractorRationale": "A risk screen informs planning rather than mandating cancellation."
      },
      {
        "id": "d3_1",
        "label": "Ignore sleep symptoms",
        "isCorrect": false,
        "distractorRationale": "Potential OSA should be communicated during preanesthetic assessment."
      }
    ],
    "explanation": "Use a validated screen, communicate the risk category, and keep screening distinct from diagnosis.",
    "supportingEvidenceClaimIds": [
      "claim.gs028d.osa.validated-screen"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-03",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  },
  {
    "contentVersion": "development-batch.2026-10-03.coverage-gaps.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.preoperative-osa.validated-risk-screening.v4",
    "conceptId": "concept.preoperative-osa.validated-risk-screening",
    "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression",
    "patientPresentation": "{patientName}, a 46-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
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
        "presentation": "{patientName}, a 46-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
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
        "presentation": "{patientName}, a 46-year-old man, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
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
        "presentation": "{patientName}, a 68-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
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
        "presentation": "{patientName}, a 68-year-old man, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      }
    ],
    "stem": "Which approach provides the most defensible preoperative risk classification?",
    "answerChoices": [
      {
        "id": "correct_4",
        "label": "Use validated OSA screening",
        "isCorrect": true,
        "distractorRationale": null
      },
      {
        "id": "d1_4",
        "label": "Use age alone",
        "isCorrect": false,
        "distractorRationale": "One demographic feature is not a validated multivariable screen."
      },
      {
        "id": "d2_4",
        "label": "Use body weight alone",
        "isCorrect": false,
        "distractorRationale": "Body size alone does not replace validated assessment."
      },
      {
        "id": "d3_4",
        "label": "Assign a diagnosis from appearance",
        "isCorrect": false,
        "distractorRationale": "Visual impression cannot diagnose OSA."
      }
    ],
    "explanation": "A validated screen provides a consistent risk classification while remaining distinct from a diagnostic study.",
    "supportingEvidenceClaimIds": [
      "claim.gs028d.osa.validated-screen"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-03",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    }
  }
] as const;
export const QUESTION_FLAGS5_BASIS_CLAIMS = [
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.varicose.intervention-referral",
    "statement": "For symptomatic axial superficial reflux in an intervention candidate who wants treatment, specialist superficial venous intervention assessment is preferred to mandatory long-term compression.",
    "sourceIds": [
      "source.varicose.svs-avf-avls-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The exact procedure depends on specialist anatomy and assessment.",
    "applicablePopulation": "Adults with symptomatic axial superficial reflux who are intervention candidates.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.varicose.conservative-boundary",
    "statement": "Conservative care remains reasonable when preference, comorbidity, mobility, anatomy, or resources weigh against intervention.",
    "sourceIds": [
      "source.varicose.svs-avf-avls-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No universal garment or duration is prescribed.",
    "applicablePopulation": "Adults with stable symptomatic varicose veins.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.cirrhosis.multifactor-risk",
    "statement": "Perioperative risk in cirrhosis depends on liver severity, portal hypertension and decompensation, procedure type, comorbidity, and center experience; no one score or laboratory value captures the whole decision.",
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single expert-review source; no fixed mortality estimate is taught.",
    "applicablePopulation": "Adults with cirrhosis being considered for nonhepatic surgery.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.cirrhosis.optimize-decompensation",
    "statement": "Active decompensation supports multidisciplinary optimization before proceeding with a nonurgent elective plan; deferral is an inferred case-specific boundary rather than an automatic prohibition.",
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Urgent surgical emergencies require immediate assessment despite elevated risk.",
    "applicablePopulation": "Adults with cirrhosis and a proposed nonurgent elective operation.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028c.palpable.targeted-us",
    "statement": "A persistent palpable breast finding in an adult at least 40 years old warrants targeted ultrasonography of the exact clinical area when diagnostic mammography is negative.",
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single current specialty guideline; this does not endorse blanket supplemental screening ultrasound for breast density alone.",
    "applicablePopulation": "Adults age 40 or older with a persistent palpable breast finding and negative diagnostic mammography.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028c.palpable.biopsy",
    "statement": "A clinically suspicious persistent palpable breast mass requires tissue diagnosis even when diagnostic mammography and targeted ultrasonography are negative.",
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current specialty guideline; biopsy technique depends on whether an imaging target exists and local specialist assessment.",
    "applicablePopulation": "Adults with a persistently suspicious palpable breast mass despite negative mammography and targeted ultrasound.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "development-batch.2026-10-03.coverage-gaps.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028d.osa.validated-screen",
    "statement": "Validated preoperative screening can identify adults at increased probability of obstructive sleep apnoea for perioperative communication, but screening does not establish the diagnosis.",
    "sourceIds": [
      "source.sasm.osa-screening.2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No proprietary questionnaire, item wording, score cutoff, or guaranteed outcome benefit is reproduced.",
    "applicablePopulation": "Adults undergoing preoperative assessment.",
    "lastCheckedOn": "2026-10-03"
  },
  {
    "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028se.capacity-refusal.3",
    "statement": "A diagnosis alone does not establish incapacity; assessment concerns abilities for the specific decision. The described abilities support respecting refusal.",
    "sourceIds": [
      "source.gs028se.ama-consent-2-1-1",
      "source.gs028se.ama-capacity-2-1-2"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Ethical guidance does not replace jurisdiction-specific law or institutional policy.",
    "applicablePopulation": "People in the stated fictional clinical situation.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "development-batch.2026-09-29.statistics-ethics.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028se.capacity-refusal.4",
    "statement": "Cognitive impairment does not eliminate capacity for every decision. Support understanding and assess actual abilities before seeking a substitute decision-maker.",
    "sourceIds": [
      "source.gs028se.ama-consent-2-1-1",
      "source.gs028se.ama-capacity-2-1-2"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Ethical guidance does not replace jurisdiction-specific law or institutional policy.",
    "applicablePopulation": "People in the stated fictional clinical situation.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.secondary-achalasia-assessment",
    "statement": "Older patients with achalasia-pattern physiology and substantial recent weight loss can require targeted assessment for a secondary junction lesion.",
    "sourceIds": [
      "source.qq20261102b.acg-achalasia"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate directly retrieved primary guideline for the added alarm-based application. EUS/cross-sectional choice is individualized; no exact weight/time threshold or probability is invented.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "development-batch.2026-09-10.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.achalasia.high-resolution-manometry",
    "statement": "High-resolution esophageal manometry is the confirmatory physiologic test when achalasia is suspected after structural obstruction and concerning pseudoachalasia have been appropriately excluded.",
    "sourceIds": [
      "source.sc.seoul-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The accepted guideline rates diagnostic evidence as low despite strong consensus. This claim does not prescribe subtype thresholds or a treatment algorithm.",
    "applicablePopulation": "Stable adults with persistent solids-and-liquids dysphagia and regurgitation after an adequate EGD excludes mechanical obstruction and concerning pseudoachalasia.",
    "lastCheckedOn": "2026-09-10"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.esophageal-physiology-sequence",
    "statement": "High-resolution manometry supplies esophageal motor classification when persistent obstructive swallowing symptoms remain after structural evaluation.",
    "sourceIds": [
      "source.qq20261102a.chicago",
      "source.qq20261102a.seoul"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "FLIP can complement inconclusive studies or be used in selected circumstances; it is not declared useless. No later pressure result is used to justify the earlier task.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "question-flags-round2.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf2.sleep-questionnaire-domain-interpretation",
    "statement": "A STOP-Bang OSA-probability report and an Epworth daytime-sleepiness report address different targets; a reassuring sleepiness report does not establish absence of OSA or turn a probability screen into a confirmed diagnosis.",
    "sourceIds": [
      "source.sasm.osa-screening.2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The explicitly controlled or reported adult retrospective profiles in the round-two question-flag drafts.",
    "limitation": "Uses names and reported outputs only, without questionnaire items, scoring implementation, numeric cutoffs or diagnostic-study thresholds. The domain application requires anaesthesia/source-alignment review; no fresh verification is claimed.",
    "basisClaimIds": [
      "claim.gs028d.osa.validated-screen"
    ],
    "verificationScope": "Offline application/physical inference from previously recorded claims. No source was newly retrieved; source access dates and reuse restrictions remain unchanged. Clinician/source-alignment review is pending."
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.cirrhosis-urgent-hernia-boundary",
    "statement": "New pain, irreducibility, vomiting and bowel dilatation proximal to a hernia with distal collapse require urgent surgical assessment despite a prior elective cirrhosis-optimization plan.",
    "basisClaimIds": [
      "claim.cirrhosis.optimize-decompensation",
      "claim.cirrhosis.multifactor-risk"
    ],
    "sourceIds": [
      "source.cirrhosis.aga-2019"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Application of the explicit urgent-emergency exception. The pattern does not establish bowel necrosis or a specific operation; no laboratory correction target is proposed.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
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
  },
  {
    "contentVersion": "question-authoring.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102.motility-egjoo",
    "statement": "The Chicago v4.0 manometric category of esophagogastric junction outflow obstruction retains evidence of peristalsis; elevated relaxation pressure alone is insufficient for a clinically conclusive diagnosis.",
    "sourceIds": [
      "source.qq20261102.chicago-v4"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Only the neighboring-category distinction is used. Protocol positions, supportive testing and technical factors matter; no diagnostic numeric cutoff, subtype or treatment algorithm is reproduced.",
    "applicablePopulation": "Adults undergoing high-resolution esophageal manometry.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "question-authoring.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102.motility-absent-contractility",
    "statement": "Absent contractility in Chicago v4.0 requires failed esophageal contractions together with normal median integrated relaxation pressure; borderline relaxation values require further consideration.",
    "sourceIds": [
      "source.qq20261102.chicago-v4"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The items use clearly laboratory-abnormal relaxation measurements, not borderline values. This category is not a specific systemic-disease diagnosis; no device-dependent numerical threshold is invented.",
    "applicablePopulation": "Adults undergoing high-resolution esophageal manometry.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.failed-contraction-threshold",
    "statement": "Chicago v4.0 classifies DCI below 100 mmHg.s.cm as failed contraction.",
    "sourceIds": [
      "source.qq20261102a.chicago"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "The exact cutoff is explicitly supported by the consensus. B04's 30-80 readings are synthetic examples inside that range, not an invented normal threshold or measured patient dataset.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.hrm-incomplete-placement",
    "statement": "An esophageal pressure study without adequate junction-crossing acquisition cannot establish reliable junction relaxation classification.",
    "sourceIds": [
      "source.qq20261102c.acg-physiology2020",
      "source.qq20261102c.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Assisted completion is a case-specific application. Persistent failure despite assisted placement may justify complementary FLIP; the cases do not assert manometry must always be repeated.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "development-batch.2026-09-10.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.achalasia.manometric-recognition",
    "statement": "Absent esophageal peristalsis together with impaired esophagogastric-junction relaxation on high-resolution manometry supports achalasia.",
    "sourceIds": [
      "source.sc.seoul-achalasia-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No exact pressure cutoff, subtype assignment, or universal requirement for raised basal lower-esophageal-sphincter pressure is asserted; the accepted precise source is a single society guideline.",
    "applicablePopulation": "Adults with an adequate structural evaluation and the authored manometric pattern.",
    "lastCheckedOn": "2026-09-10"
  }
] as const;
