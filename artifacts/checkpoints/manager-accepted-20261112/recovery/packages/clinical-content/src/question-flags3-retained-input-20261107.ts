import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";

/** Exact live synthetic source at intake. Not an acceptance or revised source. */
export const QUESTION_FLAGS3_RETAINED_INPUT:SyntheticClinicalRelease={
  "id": "clinical.flags3-retained-input.20261107.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
    {
      "id": "concept.statistics-ethics.predictive-value-prevalence",
      "displayName": "Relate positive predictive value to prevalence",
      "learningObjective": "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.achalasia.high-resolution-manometry.v2",
      "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
      "learningObjective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "displayName": "Resolve occult-groin imaging and symptom discordance",
      "learningObjective": "Choose an adequate targeted repeat study or dynamic cross-sectional assessment by interpreting prior scan localization, provocation, symptom reproduction and competing musculoskeletal findings.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.achalasia.secondary-junction-lesion-assessment.v1",
      "displayName": "Investigate a secondary junction lesion despite achalasia-pattern physiology",
      "learningObjective": "Integrate positional motor findings with a discordant wall abnormality and select etiologic assessment before attributing the pattern to primary achalasia.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "displayName": "Recognize the femoral exception to inguinal watchful waiting",
      "learningObjective": "Use current vascular/ligament landmarks to reclassify a groin sac and apply the repair boundary despite improved function.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    }
  ],
  "cases": [
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 54,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Positive-test question",
      "presentation": "{patientName}, a 54-year-old man, is being evaluated for primary aldosteronism and asks about a new urinary assay. Its report compares two hypothetical testing populations. The representative promises one simple answer, then offers three subscription levels for accessing it. The patient notices different positive-result predictions despite identical sensitivity and specificity and asks what could explain that difference.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.male.54",
          "prototypeDemographics": {
            "ageYears": 54,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 54-year-old man, is being evaluated for primary aldosteronism and asks about a new urinary assay. Its report compares two hypothetical testing populations. The representative promises one simple answer, then offers three subscription levels for accessing it. The patient notices different positive-result predictions despite identical sensitivity and specificity and asks what could explain that difference."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.female.54",
          "prototypeDemographics": {
            "ageYears": 54,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 54-year-old woman, is being evaluated for primary aldosteronism and asks about a new urinary assay. Its report compares two hypothetical testing populations. The representative promises one simple answer, then offers three subscription levels for accessing it. The patient notices different positive-result predictions despite identical sensitivity and specificity and asks what could explain that difference."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.male.25",
          "prototypeDemographics": {
            "ageYears": 25,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 25-year-old man, is being evaluated for primary aldosteronism and asks about a new urinary assay. Its report compares two hypothetical testing populations. The representative promises one simple answer, then offers three subscription levels for accessing it. The patient notices different positive-result predictions despite identical sensitivity and specificity and asks what could explain that difference."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.female.25",
          "prototypeDemographics": {
            "ageYears": 25,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 25-year-old woman, is being evaluated for primary aldosteronism and asks about a new urinary assay. Its report compares two hypothetical testing populations. The representative promises one simple answer, then offers three subscription levels for accessing it. The patient notices different positive-result predictions despite identical sensitivity and specificity and asks what could explain that difference."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Primary Aldosteronism: An Endocrine Society Clinical Practice Guideline"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4",
          "primaryConceptId": "concept.statistics-ethics.predictive-value-prevalence",
          "stem": "Which difference can explain the new investigational breast-cancer blood test's different positive predictive values when testing definitions, sensitivity and specificity remain the same?",
          "answerChoices": [
            {
              "id": "correct_characteristics-fixed",
              "label": "Different prevalence in the tested populations",
              "isCorrect": true,
              "rationale": "Prevalence can change the true-positive share among positive results even with identical testing processes, sensitivity, and specificity. It is a possible explanation, not an exact value.",
              "serviceRequest": null
            },
            {
              "id": "d1_characteristics-fixed",
              "label": "Different sensitivity in the tested populations",
              "isCorrect": false,
              "rationale": "The exhibit explicitly keeps sensitivity the same. A sensitivity difference cannot explain this exercise without contradicting that condition.",
              "serviceRequest": null
            },
            {
              "id": "d2_characteristics-fixed",
              "label": "Different specificity in the tested populations",
              "isCorrect": false,
              "rationale": "The exhibit explicitly keeps specificity the same. This proposed explanation changes an assumption that was held fixed.",
              "serviceRequest": null
            },
            {
              "id": "d3_characteristics-fixed",
              "label": "Different definitions of a positive test result",
              "isCorrect": false,
              "rationale": "The exhibit keeps the testing process and definition of positive the same. Reclassifying results contradicts that supplied comparison.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.",
          "teachingPoint": "Sensitivity and specificity describe results within condition-status groups; positive predictive value starts with positive results. Changing prevalence can change the mix of true and false positives even when those test characteristics stay fixed. Here prevalence is a possible explanation. The information does not supply its exact value or prove a personal diagnosis.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Unnamed investigational primary-aldosteronism urinary assay: invented testing-population assumptions for practice. These comparisons supply no real test performance or personal disease probability.",
            "items": [
              {
                "label": "Testing process and result definitions",
                "value": "Same at both hypothetical populations"
              },
              {
                "label": "Sensitivity and specificity",
                "value": "Same at both hypothetical populations"
              },
              {
                "label": "Positive predictive value",
                "value": "Different at the two hypothetical populations"
              }
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Primary Aldosteronism: An Endocrine Society Clinical Practice Guideline"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_characteristics-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d2_characteristics-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_characteristics-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.achalasia.night-regurgitation",
      "displayName": "Esophageal motility evaluation",
      "patientPresentationVariantId": "presentation.achalasia.night-regurgitation",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Difficulty swallowing",
      "patientPresentationRevision": {
        "id": "ppr.qbp2a.20261104.case.achalasia.night-regurgitation",
        "patientPresentationVariantId": "presentation.achalasia.night-regurgitation",
        "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2a.20261104.profile.achalasia.night-regurgitation.female.57",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.female.57",
            "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2a.20261104.profile.achalasia.night-regurgitation.male.57",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.male.57",
            "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 57-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2a.20261104.profile.achalasia.night-regurgitation.female.63",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.female.63",
            "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2a.20261104.profile.achalasia.night-regurgitation.male.63",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.male.63",
            "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
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
      "presentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.achalasia.night-regurgitation.female.57",
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
          "presentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass."
        },
        {
          "id": "profile.achalasia.night-regurgitation.male.57",
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
          "presentation": "{patientName}, a 57-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass."
        },
        {
          "id": "profile.achalasia.night-regurgitation.female.63",
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
          "presentation": "{patientName}, a 63-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass."
        },
        {
          "id": "profile.achalasia.night-regurgitation.male.63",
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
          "presentation": "{patientName}, a 63-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass."
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
          "id": "node.achalasia.night-regurgitation.1",
          "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r6",
          "primaryConceptId": "concept.achalasia.high-resolution-manometry.v2",
          "currentUpdate": "The catheter spans the junction. The outside tracing has three water swallows in quick succession: a second swallow begins before the pressure response to the first has ended, followed by the third. Distal contraction appears after the last swallow. Other attempts were stopped during retching.",
          "stem": "Which acquisition should determine {patientName}'s esophageal-body classification?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "manometry_2",
              "label": "Single wet swallows after baseline recovery",
              "isCorrect": true,
              "rationale": "Separated swallows assess ordinary swallow-induced peristalsis; overlapping swallows can inhibit a developing contraction.",
              "serviceRequest": {
                "serviceId": "service.esophageal_manometry"
              }
            },
            {
              "id": "choice.qq20261102d.b02-context.d1",
              "label": "Multiple rapid swallows followed by a recovery swallow",
              "isCorrect": false,
              "rationale": "This probes inhibition and contractile reserve rather than replacing the baseline series needed to classify the body pattern.",
              "serviceRequest": {
                "serviceId": "service.esophageal_manometry"
              }
            },
            {
              "id": "choice.qq20261102d.b02-context.d2",
              "label": "Upright rapid drinking followed by clearance swallows",
              "isCorrect": false,
              "rationale": "This is an outflow challenge and does not replace separated baseline swallows for the disputed peristaltic classification.",
              "serviceRequest": {
                "serviceId": "service.esophageal_manometry"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The acquisition sequence changes how absence of contraction is interpreted. A swallow delivered during the preceding response can inhibit that response; a rapid-swallow maneuver is not an ordinary separated-swallow series. Use baseline wet swallows separated by recovery before assigning the body classification. Provocative sequences have additional roles.",
          "teachingPoint": "The acquisition sequence changes how absence of contraction is interpreted. A swallow delivered during the preceding response can inhibit that response; a rapid-swallow maneuver is not an ordinary separated-swallow series. Use baseline wet swallows separated by recovery before assigning the body classification. Provocative sequences have additional roles.",
          "sourceLabels": [
            "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v8)"
          ],
          "resultGateAfter": {
            "id": "gate.achalasia.manometry.2",
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
          "id": "node.achalasia.night-regurgitation.2",
          "questionVariantId": "question.achalasia.manometric-recognition.v2.r6",
          "primaryConceptId": "concept.achalasia.secondary-junction-lesion-assessment.v1",
          "currentUpdate": "At return, {patientName} reports continuing unintentional weight loss. The endoscopy record describes resistance as the instrument crossed the junction; mucosal samples contain no malignancy. An interval CT shows eccentric thickening of the gastric cardia extending across the junction.",
          "stem": "Which procedure should be requested next for {patientName}?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "achalasia_2",
              "label": "Endoscopic ultrasound with wall sampling",
              "isCorrect": true,
              "rationale": "The motor pattern does not exclude a secondary junction process. Eccentric wall thickening and resistance despite unrevealing mucosal samples make deeper wall assessment the priority among these procedures.",
              "serviceRequest": null
            },
            {
              "id": "choice.qbp2ar2.20261104.b2a02.d1",
              "label": "Functional lumen imaging probe distensibility study",
              "isCorrect": false,
              "rationale": "This can complement equivocal motor assessment, but another distensibility measurement does not establish the cause of the focal wall abnormality.",
              "serviceRequest": null
            },
            {
              "id": "choice.qbp2ar2.20261104.b2a02.d2",
              "label": "Timed barium esophagram with a tablet",
              "isCorrect": false,
              "rationale": "This can characterize bolus emptying, but the new wall finding requires etiologic tissue assessment rather than another measure of impaired passage.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Separate recognition of the motor pattern from attribution to primary disease. The primary-position study can support an achalasia pattern despite the upright value, but the wall abnormality and weight trajectory require evaluation for a secondary junction lesion. Endoscopic ultrasonography can assess and sample tissue beyond the mucosa. Neither another emptying study nor a distensibility study resolves the new wall finding.",
          "teachingPoint": "Separate recognition of the motor pattern from attribution to primary disease. The primary-position study can support an achalasia pattern despite the upright value, but the wall abnormality and weight trajectory require evaluation for a secondary junction lesion. Endoscopic ultrasonography can assess and sample tissue beyond the mucosa. Neither another emptying study nor a distensibility study resolves the new wall finding.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed pressure-study observations; reference intervals belong to this laboratory.",
            "items": [
              {
                "label": "Primary supine acquisition",
                "value": "Separated water swallows with the catheter spanning the junction; relaxation pressure above the laboratory upper reference limit"
              },
              {
                "label": "Secondary upright acquisition",
                "value": "Relaxation pressure within the laboratory reference interval"
              },
              {
                "label": "Body channels",
                "value": "No propagated distal contraction in either position"
              }
            ]
          },
          "sourceLabels": [
            "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-04.v13)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-04.batch2a-r2)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qbp2ar2.20261104.b2a02.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Functional lumen imaging probe distensibility study”.",
              "clinicalRationale": "This can complement equivocal motor assessment, but another distensibility measurement does not establish the cause of the focal wall abnormality.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
              ]
            },
            {
              "answerChoiceId": "choice.qbp2ar2.20261104.b2a02.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Timed barium esophagram with a tablet”.",
              "clinicalRationale": "This can characterize bolus emptying, but the new wall finding requires etiologic tissue assessment rather than another measure of impaired passage.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The acquisition sequence changes how absence of contraction is interpreted. A swallow delivered during the preceding response can inhibit that response; a rapid-swallow maneuver is not an ordinary separated-swallow series. Use baseline wet swallows separated by recovery before assigning the body classification. Provocative sequences have additional roles. Separate recognition of the motor pattern from attribution to primary disease. The primary-position study can support an achalasia pattern despite the upright value, but the wall abnormality and weight trajectory require evaluation for a secondary junction lesion. Endoscopic ultrasonography can assess and sample tissue beyond the mucosa. Neither another emptying study nor a distensibility study resolves the new wall finding."
    },
    {
      "id": "case.inguinal-hernia.caregiving-strain",
      "displayName": "Equivocal symptomatic groin presentation",
      "patientPresentationVariantId": "presentation.inguinal-hernia.caregiving-strain",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Intermittent groin bulge",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102c.case.inguinal-hernia.caregiving-strain",
        "patientPresentationVariantId": "presentation.inguinal-hernia.caregiving-strain",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102c.profile.inguinal-hernia.caregiving-strain.male.59",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
            "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102c.profile.inguinal-hernia.caregiving-strain.male.62",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.62",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
            "revisedPresentation": "{patientName}, a 62-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102c.profile.inguinal-hernia.caregiving-strain.male.65",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.65",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
            "revisedPresentation": "{patientName}, a 65-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102c.profile.inguinal-hernia.caregiving-strain.male.68",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
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
      "presentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.inguinal-hernia.caregiving-strain.male.59",
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
          "presentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle."
        },
        {
          "id": "profile.inguinal-hernia.caregiving-strain.male.62",
          "prototypeDemographics": {
            "ageYears": 62,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 62-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle."
        },
        {
          "id": "profile.inguinal-hernia.caregiving-strain.male.65",
          "prototypeDemographics": {
            "ageYears": 65,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 65-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle."
        },
        {
          "id": "profile.inguinal-hernia.caregiving-strain.male.68",
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
          "presentation": "{patientName}, a 68-year-old man, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "HerniaSurge international groin-hernia guideline (2018), CC BY-NC 4.0",
        "NIDDK inguinal hernia guidance (reviewed September 2019)"
      ],
      "decisionNodes": [
        {
          "id": "node.inguinal-hernia.caregiving-strain.1",
          "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r7",
          "primaryConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
          "currentUpdate": "The outside ultrasound's skin marker lies at the adductor attachment to the pubis. The phone photograph places the swelling above the inguinal ligament. Ultrasound was recorded after that swelling had subsided.",
          "stem": "Which investigation should be arranged next for {patientName}'s intermittent groin swelling?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "dynamic_ultrasound_3",
              "label": "Groin ultrasound with standing strain and cine loops",
              "isCorrect": true,
              "rationale": "The outside acquisition documents a different target after the event. A targeted dynamic groin assessment addresses the untested anatomical question before treating that report as a negative inguinal study.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "choice.qq20261102e.b07.d1",
              "label": "Pelvic MRI with strain and pubic-attachment sequences",
              "isCorrect": false,
              "rationale": "This is a credible next assessment after an adequate unresolved groin ultrasound, as in B05, but the current record has not yet characterized the clinical inguinal site under provocation.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102e.b07.d2",
              "label": "Hip MR arthrography with labral and cartilage sequences",
              "isCorrect": false,
              "rationale": "A hip-joint investigation is useful for an intra-articular question. It does not correct the documented mismatch between the clinical swelling and the sampled pubic attachment.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The marker, photo and timing establish that the outside report is not a completed negative dynamic inguinal assessment. Targeted groin sonography with provocation is a selected next step. Dynamic pelvic MRI remains reasonable for an adequate but unresolved study; B05 presents that different sequence. This ranking does not assert a universal ultrasound advantage over MRI or diagnose a hernia solely from the photograph.",
          "teachingPoint": "The marker, photo and timing establish that the outside report is not a completed negative dynamic inguinal assessment. Targeted groin sonography with provocation is a selected next step. Dynamic pelvic MRI remains reasonable for an adequate but unresolved study; B05 presents that different sequence. This ranking does not assert a universal ultrasound advantage over MRI or diagnose a hernia solely from the photograph.",
          "sourceLabels": [
            "HerniaSurge international groin-hernia guideline (2018), CC BY-NC 4.0",
            "NIDDK inguinal hernia guidance (reviewed September 2019)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v8)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v9)"
          ],
          "resultGateAfter": {
            "id": "gate.inguinal-hernia.ultrasound.3",
            "resultTypeId": "service.ultrasound",
            "pendingLabel": "Targeted dynamic groin ultrasound pending",
            "resultNarrative": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced. The attachment exercise program continues.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.ultrasound.outsourced",
              "route.ultrasound.in_house"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.inguinal-hernia.caregiving-strain.2",
          "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r10",
          "primaryConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
          "currentUpdate": "At interval review, {patientName} can complete the usual lifting task, although a groin contour still appears. The abdomen is soft and not distended. The earlier report called the contour inguinal.",
          "stem": "Which plan should be offered for {patientName}’s groin finding?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "elective_discussion_3",
              "label": "Arrange planned groin hernia repair",
              "isCorrect": true,
              "rationale": "The current landmarks identify a femoral pathway. Mild or absent current limitation does not put that finding into the usual male inguinal watchful-waiting group.",
              "serviceRequest": null
            },
            {
              "id": "choice.qbp2ar2.20261104.b2a08.d1",
              "label": "Arrange outpatient groin hernia surveillance",
              "isCorrect": false,
              "rationale": "Observation is credible for selected minimally symptomatic inguinal hernias in men, but the new anatomical evidence changes which rule applies.",
              "serviceRequest": null
            },
            {
              "id": "choice.qbp2ar2.20261104.b2a08.d2",
              "label": "Arrange urgent groin hernia exploration",
              "isCorrect": false,
              "rationale": "Femoral anatomy changes the elective repair indication, but the current reducing sac and nonacute abdominal findings do not establish an emergency exploration indication.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Reconcile the current landmarks with the old report label before using a watchful-waiting rule. A sac below the inguinal ligament and medial to the femoral vein follows the femoral canal. A stable reducible femoral hernia calls for timely elective repair planning even with mild symptoms. The attachment complaint remains separate; no emergency deadline or operative technique is specified.",
          "teachingPoint": "Reconcile the current landmarks with the old report label before using a watchful-waiting rule. A sac below the inguinal ligament and medial to the femoral vein follows the femoral canal. A stable reducible femoral hernia calls for timely elective repair planning even with mild symptoms. The attachment complaint remains separate; no emergency deadline or operative technique is specified.",
          "exhibit": {
            "kind": "table",
            "caption": "Current targeted groin ultrasound observations.",
            "columnHeaders": [
              "Observation",
              "Recorded finding"
            ],
            "rowHeaders": [
              "Ligament landmark",
              "Vascular landmark",
              "Strain and rest"
            ],
            "cells": [
              [
                "Position of the sac neck",
                "Below the inguinal ligament"
              ],
              [
                "Position relative to the common femoral vein",
                "Medial to the vein"
              ],
              [
                "Behavior",
                "A peritoneal sac enters during strain and withdraws at rest"
              ]
            ]
          },
          "sourceLabels": [
            "HerniaSurge international groin-hernia guideline (2018), CC BY-NC 4.0",
            "NIDDK inguinal hernia guidance (reviewed September 2019)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v8)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v9)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v10)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-04.v13)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-04.batch2a-r2)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qbp2ar2.20261104.b2a08.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Arrange outpatient groin hernia surveillance”.",
              "clinicalRationale": "Observation is credible for selected minimally symptomatic inguinal hernias in men, but the new anatomical evidence changes which rule applies.",
              "sourceLabels": [
                "HerniaSurge international groin-hernia guideline (2018), CC BY-NC 4.0",
                "NIDDK inguinal hernia guidance (reviewed September 2019)"
              ]
            },
            {
              "answerChoiceId": "choice.qbp2ar2.20261104.b2a08.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Arrange urgent groin hernia exploration”.",
              "clinicalRationale": "Femoral anatomy changes the elective repair indication, but the current reducing sac and nonacute abdominal findings do not establish an emergency exploration indication.",
              "sourceLabels": [
                "HerniaSurge international groin-hernia guideline (2018), CC BY-NC 4.0",
                "NIDDK inguinal hernia guidance (reviewed September 2019)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The marker, photo and timing establish that the outside report is not a completed negative dynamic inguinal assessment. Targeted groin sonography with provocation is a selected next step. Dynamic pelvic MRI remains reasonable for an adequate but unresolved study; B05 presents that different sequence. This ranking does not assert a universal ultrasound advantage over MRI or diagnose a hernia solely from the photograph. Reconcile the current landmarks with the old report label before using a watchful-waiting rule. A sac below the inguinal ligament and medial to the femoral vein follows the femoral canal. A stable reducible femoral hernia calls for timely elective repair planning even with mild symptoms. The attachment complaint remains separate; no emergency deadline or operative technique is specified."
    }
  ]
};
export const QUESTION_FLAGS3_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]=[
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r6",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "manometry_2",
          "choiceLabel": "Single wet swallows after baseline recovery",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.esophageal_manometry"
          }
        },
        {
          "choiceId": "choice.qq20261102d.b02-context.d1",
          "choiceLabel": "Multiple rapid swallows followed by a recovery swallow",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.esophageal_manometry"
          }
        },
        {
          "choiceId": "choice.qq20261102d.b02-context.d2",
          "choiceLabel": "Upright rapid drinking followed by clearance swallows",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.esophageal_manometry"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r6",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "achalasia_2",
          "choiceLabel": "Endoscopic ultrasound with wall sampling",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "choice.qbp2ar2.20261104.b2a02.d1",
          "choiceLabel": "Functional lumen imaging probe distensibility study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.upper_endoscopy"
          }
        },
        {
          "choiceId": "choice.qbp2ar2.20261104.b2a02.d2",
          "choiceLabel": "Timed barium esophagram with a tablet",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.contrast_swallow"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r7",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "dynamic_ultrasound_3",
          "choiceLabel": "Groin ultrasound with standing strain and cine loops",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        },
        {
          "choiceId": "choice.qq20261102e.b07.d1",
          "choiceLabel": "Pelvic MRI with strain and pubic-attachment sequences",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        },
        {
          "choiceId": "choice.qq20261102e.b07.d2",
          "choiceLabel": "Hip MR arthrography with labral and cartilage sequences",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r10",
    "classification": {
      "kind": "no_test"
    }
  }
];
