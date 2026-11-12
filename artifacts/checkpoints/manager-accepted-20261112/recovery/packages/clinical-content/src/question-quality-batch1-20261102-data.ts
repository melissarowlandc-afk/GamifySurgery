import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";

/** LOCAL DRAFTS ONLY; key shown first for review only. Runtime choices randomize. */
export const QUESTION_QUALITY_BATCH1_DEFINITIONS: QuestionQualityRevision[] = [
  {
    "id": "revision.qq20261102.b01",
    "auditId": "B01",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v1",
    "questionVariantId": "question.achalasia.manometric-recognition.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which diagnosis best explains {patientName}'s manometric pattern?",
    "previousChoiceLabels": [
      "Achalasia",
      "Distal esophageal spasm",
      "Reflux-related dysmotility",
      "Rumination syndrome"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousPresentation": "{patientName} reports persistent dysphagia to solids and liquids with passive regurgitation. A recent adequate EGD excluded a fixed obstruction and concerning pseudoachalasia; the patient is stable and maintaining oral hydration.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.water-and-solids.female.42",
        "presentation": "{patientName} reports persistent dysphagia to solids and liquids with passive regurgitation. A recent adequate EGD excluded a fixed obstruction and concerning pseudoachalasia; the patient is stable and maintaining oral hydration."
      },
      {
        "id": "profile.achalasia.water-and-solids.male.42",
        "presentation": "{patientName} reports persistent dysphagia to solids and liquids with passive regurgitation. A recent adequate EGD excluded a fixed obstruction and concerning pseudoachalasia; the patient is stable and maintaining oral hydration."
      },
      {
        "id": "profile.achalasia.water-and-solids.female.48",
        "presentation": "{patientName} reports persistent dysphagia to solids and liquids with passive regurgitation. A recent adequate EGD excluded a fixed obstruction and concerning pseudoachalasia; the patient is stable and maintaining oral hydration."
      },
      {
        "id": "profile.achalasia.water-and-solids.male.48",
        "presentation": "{patientName} reports persistent dysphagia to solids and liquids with passive regurgitation. A recent adequate EGD excluded a fixed obstruction and concerning pseudoachalasia; the patient is stable and maintaining oral hydration."
      }
    ],
    "currentUpdate": "During each test swallow, no contraction travels down the distal esophagus. The median integrated relaxation pressure is above the laboratory reference range.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate the relaxation measurement and propagated-contraction observations to distinguish neighboring manometric categories.",
    "reviewerNotes": "Check protocol adequacy and laboratory-relative pressure interpretation; no unsupported numeric cutoff or subtype is taught. The longer anatomical name is a standard term, not an explanatory qualifier.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_1": "achalasia_1",
      "choice.qq20261102.b01.d1": "distal_spasm_1",
      "choice.qq20261102.b01.d2": "reflux_dysmotility_1"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the interpreted pattern with tracing observations and three competing motility diagnoses. Remove the key from preceding feedback through a versioned context companion."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v1.r2",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
      "answerChoices": [
        {
          "id": "achalasia_1",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates failed propagation with the abnormal junction-relaxation measurement rather than relying on either finding alone."
        },
        {
          "id": "choice.qq20261102.b01.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Overweights the elevated relaxation pressure; this competing category retains evidence of peristalsis rather than the supplied universally failed propagation."
        },
        {
          "id": "choice.qq20261102.b01.d2",
          "label": "Absent contractility",
          "isCorrect": false,
          "distractorRationale": "Overweights the failed contractions; this category requires a normal relaxation-pressure measurement rather than the supplied elevated value."
        }
      ],
      "explanation": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility"
      ],
      "teachingPoint": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.achalasia.water-and-solids",
        "patientPresentationVariantId": "presentation.achalasia.water-and-solids",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 42,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b01-context",
    "auditId": "B01-context",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v1",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which test should confirm the suspected motility disorder in {patientName}?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "resultNarrative": "During each test swallow, no contraction travels down the distal esophagus. The median integrated relaxation pressure is above the laboratory reference range.",
    "previousResultNarrative": "High-resolution manometry shows absent organized esophageal peristalsis together with impaired relaxation of the esophagogastric junction.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the diagnosis name from feedback seen before the recognition task; retain the manometry service, gate and clinical objective."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v1.r2",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
      "answerChoices": [
        {
          "id": "manometry_1",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "After an adequate endoscopic structural assessment excludes obstruction and concerning pseudoachalasia, high-resolution manometry supplies the esophageal physiology needed to evaluate suspected achalasia."
        },
        {
          "id": "repeat_egd_1",
          "label": "Repeat upper-GI endoscopy",
          "isCorrect": false,
          "distractorRationale": "An adequate recent EGD has already excluded a mechanical explanation and concerning pseudoachalasia."
        },
        {
          "id": "ph_monitoring_1",
          "label": "Ambulatory esophageal reflux monitoring",
          "isCorrect": false,
          "distractorRationale": "Reflux monitoring does not define the suspected motility disorder."
        },
        {
          "id": "chest_ct_1",
          "label": "Contrast-enhanced chest CT",
          "isCorrect": false,
          "distractorRationale": "Cross-sectional imaging does not provide the required esophageal physiology after the completed structural evaluation."
        }
      ],
      "explanation": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry"
      ],
      "teachingPoint": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings."
    }
  },
  {
    "id": "revision.qq20261102.b02",
    "auditId": "B02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which diagnosis best explains {patientName}'s manometric pattern?",
    "previousChoiceLabels": [
      "Achalasia",
      "Distal esophageal spasm",
      "Reflux-related dysmotility",
      "Rumination syndrome"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousPresentation": "{patientName} has progressive solids-and-liquids dysphagia with nocturnal regurgitation. Prior EGD adequately assessed the esophagus without a mechanical lesion or concerning pseudoachalasia, and there is no acute impaction.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.night-regurgitation.female.57",
        "presentation": "{patientName} has progressive solids-and-liquids dysphagia with nocturnal regurgitation. Prior EGD adequately assessed the esophagus without a mechanical lesion or concerning pseudoachalasia, and there is no acute impaction."
      },
      {
        "id": "profile.achalasia.night-regurgitation.male.57",
        "presentation": "{patientName} has progressive solids-and-liquids dysphagia with nocturnal regurgitation. Prior EGD adequately assessed the esophagus without a mechanical lesion or concerning pseudoachalasia, and there is no acute impaction."
      },
      {
        "id": "profile.achalasia.night-regurgitation.female.63",
        "presentation": "{patientName} has progressive solids-and-liquids dysphagia with nocturnal regurgitation. Prior EGD adequately assessed the esophagus without a mechanical lesion or concerning pseudoachalasia, and there is no acute impaction."
      },
      {
        "id": "profile.achalasia.night-regurgitation.male.63",
        "presentation": "{patientName} has progressive solids-and-liquids dysphagia with nocturnal regurgitation. Prior EGD adequately assessed the esophagus without a mechanical lesion or concerning pseudoachalasia, and there is no acute impaction."
      }
    ],
    "currentUpdate": "The tracing contains no propagated distal contraction during any test swallow. Median integrated relaxation pressure exceeds the laboratory's upper reference limit.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate the relaxation measurement and propagated-contraction observations to distinguish neighboring manometric categories.",
    "reviewerNotes": "Check protocol adequacy and laboratory-relative pressure interpretation; no unsupported numeric cutoff or subtype is taught. The longer anatomical name is a standard term, not an explanatory qualifier.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_2": "achalasia_2",
      "choice.qq20261102.b02.d1": "distal_spasm_2",
      "choice.qq20261102.b02.d2": "reflux_dysmotility_2"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the interpreted pattern with tracing observations and three competing motility diagnoses. Remove the key from preceding feedback through a versioned context companion."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v2.r2",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
      "answerChoices": [
        {
          "id": "achalasia_2",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates failed propagation with the abnormal junction-relaxation measurement rather than relying on either finding alone."
        },
        {
          "id": "choice.qq20261102.b02.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Overweights the elevated relaxation pressure; this competing category retains evidence of peristalsis rather than the supplied universally failed propagation."
        },
        {
          "id": "choice.qq20261102.b02.d2",
          "label": "Absent contractility",
          "isCorrect": false,
          "distractorRationale": "Overweights the failed contractions; this category requires a normal relaxation-pressure measurement rather than the supplied elevated value."
        }
      ],
      "explanation": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility"
      ],
      "teachingPoint": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.achalasia.night-regurgitation",
        "patientPresentationVariantId": "presentation.achalasia.night-regurgitation",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b02-context",
    "auditId": "B02-context",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which test should confirm the suspected motility disorder in {patientName}?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "resultNarrative": "The tracing contains no propagated distal contraction during any test swallow. Median integrated relaxation pressure exceeds the laboratory's upper reference limit.",
    "previousResultNarrative": "High-resolution manometry shows absent organized esophageal peristalsis together with impaired relaxation of the esophagogastric junction.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the diagnosis name from feedback seen before the recognition task; retain the manometry service, gate and clinical objective."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v2.r2",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "After an adequate endoscopic structural assessment excludes obstruction and concerning pseudoachalasia, high-resolution manometry supplies the esophageal physiology needed to evaluate suspected achalasia."
        },
        {
          "id": "repeat_egd_2",
          "label": "Repeat upper-GI endoscopy",
          "isCorrect": false,
          "distractorRationale": "An adequate recent EGD has already excluded a mechanical explanation and concerning pseudoachalasia."
        },
        {
          "id": "ph_monitoring_2",
          "label": "Ambulatory esophageal reflux monitoring",
          "isCorrect": false,
          "distractorRationale": "Reflux monitoring does not define the suspected motility disorder."
        },
        {
          "id": "chest_ct_2",
          "label": "Contrast-enhanced chest CT",
          "isCorrect": false,
          "distractorRationale": "Cross-sectional imaging does not provide the required esophageal physiology after the completed structural evaluation."
        }
      ],
      "explanation": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry"
      ],
      "teachingPoint": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings."
    }
  },
  {
    "id": "revision.qq20261102.b03",
    "auditId": "B03",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v3",
    "questionVariantId": "question.achalasia.manometric-recognition.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which diagnosis best explains {patientName}'s manometric pattern?",
    "previousChoiceLabels": [
      "Achalasia",
      "Distal esophageal spasm",
      "Reflux-related dysmotility",
      "Rumination syndrome"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousPresentation": "{patientName} describes persistent difficulty passing both food and drinks with intermittent regurgitation. Structural evaluation by EGD is complete and excludes obstruction and concerning pseudoachalasia.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.slow-meals.female.34",
        "presentation": "{patientName} describes persistent difficulty passing both food and drinks with intermittent regurgitation. Structural evaluation by EGD is complete and excludes obstruction and concerning pseudoachalasia."
      },
      {
        "id": "profile.achalasia.slow-meals.male.34",
        "presentation": "{patientName} describes persistent difficulty passing both food and drinks with intermittent regurgitation. Structural evaluation by EGD is complete and excludes obstruction and concerning pseudoachalasia."
      },
      {
        "id": "profile.achalasia.slow-meals.female.40",
        "presentation": "{patientName} describes persistent difficulty passing both food and drinks with intermittent regurgitation. Structural evaluation by EGD is complete and excludes obstruction and concerning pseudoachalasia."
      },
      {
        "id": "profile.achalasia.slow-meals.male.40",
        "presentation": "{patientName} describes persistent difficulty passing both food and drinks with intermittent regurgitation. Structural evaluation by EGD is complete and excludes obstruction and concerning pseudoachalasia."
      }
    ],
    "currentUpdate": "None of the test swallows generates a propagated distal contraction. The reported median integrated relaxation pressure is above the laboratory reference range.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate the relaxation measurement and propagated-contraction observations to distinguish neighboring manometric categories.",
    "reviewerNotes": "Check protocol adequacy and laboratory-relative pressure interpretation; no unsupported numeric cutoff or subtype is taught. The longer anatomical name is a standard term, not an explanatory qualifier.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_3": "achalasia_3",
      "choice.qq20261102.b03.d1": "distal_spasm_3",
      "choice.qq20261102.b03.d2": "reflux_dysmotility_3"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the interpreted pattern with tracing observations and three competing motility diagnoses. Remove the key from preceding feedback through a versioned context companion."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v3.r2",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
      "answerChoices": [
        {
          "id": "achalasia_3",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates failed propagation with the abnormal junction-relaxation measurement rather than relying on either finding alone."
        },
        {
          "id": "choice.qq20261102.b03.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Overweights the elevated relaxation pressure; this competing category retains evidence of peristalsis rather than the supplied universally failed propagation."
        },
        {
          "id": "choice.qq20261102.b03.d2",
          "label": "Absent contractility",
          "isCorrect": false,
          "distractorRationale": "Overweights the failed contractions; this category requires a normal relaxation-pressure measurement rather than the supplied elevated value."
        }
      ],
      "explanation": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility"
      ],
      "teachingPoint": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.achalasia.slow-meals",
        "patientPresentationVariantId": "presentation.achalasia.slow-meals",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 34,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b03-context",
    "auditId": "B03-context",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which test should confirm the suspected motility disorder in {patientName}?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "resultNarrative": "None of the test swallows generates a propagated distal contraction. The reported median integrated relaxation pressure is above the laboratory reference range.",
    "previousResultNarrative": "High-resolution manometry shows absent organized esophageal peristalsis together with impaired relaxation of the esophagogastric junction.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the diagnosis name from feedback seen before the recognition task; retain the manometry service, gate and clinical objective."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v3.r2",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "After an adequate endoscopic structural assessment excludes obstruction and concerning pseudoachalasia, high-resolution manometry supplies the esophageal physiology needed to evaluate suspected achalasia."
        },
        {
          "id": "repeat_egd_3",
          "label": "Repeat upper-GI endoscopy",
          "isCorrect": false,
          "distractorRationale": "An adequate recent EGD has already excluded a mechanical explanation and concerning pseudoachalasia."
        },
        {
          "id": "ph_monitoring_3",
          "label": "Ambulatory esophageal reflux monitoring",
          "isCorrect": false,
          "distractorRationale": "Reflux monitoring does not define the suspected motility disorder."
        },
        {
          "id": "chest_ct_3",
          "label": "Contrast-enhanced chest CT",
          "isCorrect": false,
          "distractorRationale": "Cross-sectional imaging does not provide the required esophageal physiology after the completed structural evaluation."
        }
      ],
      "explanation": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry"
      ],
      "teachingPoint": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings."
    }
  },
  {
    "id": "revision.qq20261102.b04",
    "auditId": "B04",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v4",
    "questionVariantId": "question.achalasia.manometric-recognition.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which diagnosis best explains {patientName}'s manometric pattern?",
    "previousChoiceLabels": [
      "Achalasia",
      "Distal esophageal spasm",
      "Reflux-related dysmotility",
      "Rumination syndrome"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousPresentation": "{patientName} is referred after an adequate EGD found no mechanical cause or concerning pseudoachalasia. Dysphagia affects solids and liquids, regurgitation continues, and the patient has no emergency feature.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.clinic-referral.female.66",
        "presentation": "{patientName} is referred after an adequate EGD found no mechanical cause or concerning pseudoachalasia. Dysphagia affects solids and liquids, regurgitation continues, and the patient has no emergency feature."
      },
      {
        "id": "profile.achalasia.clinic-referral.male.66",
        "presentation": "{patientName} is referred after an adequate EGD found no mechanical cause or concerning pseudoachalasia. Dysphagia affects solids and liquids, regurgitation continues, and the patient has no emergency feature."
      },
      {
        "id": "profile.achalasia.clinic-referral.female.72",
        "presentation": "{patientName} is referred after an adequate EGD found no mechanical cause or concerning pseudoachalasia. Dysphagia affects solids and liquids, regurgitation continues, and the patient has no emergency feature."
      },
      {
        "id": "profile.achalasia.clinic-referral.male.72",
        "presentation": "{patientName} is referred after an adequate EGD found no mechanical cause or concerning pseudoachalasia. Dysphagia affects solids and liquids, regurgitation continues, and the patient has no emergency feature."
      }
    ],
    "currentUpdate": "The laboratory reports an elevated median integrated relaxation pressure relative to its reference range; all test swallows lack a propagated distal contraction.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate the relaxation measurement and propagated-contraction observations to distinguish neighboring manometric categories.",
    "reviewerNotes": "Check protocol adequacy and laboratory-relative pressure interpretation; no unsupported numeric cutoff or subtype is taught. The longer anatomical name is a standard term, not an explanatory qualifier.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_4": "achalasia_4",
      "choice.qq20261102.b04.d1": "distal_spasm_4",
      "choice.qq20261102.b04.d2": "reflux_dysmotility_4"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the interpreted pattern with tracing observations and three competing motility diagnoses. Remove the key from preceding feedback through a versioned context companion."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v4.r2",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
      "answerChoices": [
        {
          "id": "achalasia_4",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates failed propagation with the abnormal junction-relaxation measurement rather than relying on either finding alone."
        },
        {
          "id": "choice.qq20261102.b04.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Overweights the elevated relaxation pressure; this competing category retains evidence of peristalsis rather than the supplied universally failed propagation."
        },
        {
          "id": "choice.qq20261102.b04.d2",
          "label": "Absent contractility",
          "isCorrect": false,
          "distractorRationale": "Overweights the failed contractions; this category requires a normal relaxation-pressure measurement rather than the supplied elevated value."
        }
      ],
      "explanation": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility"
      ],
      "teachingPoint": "The combination supports achalasia. The other motility categories separate preserved peristalsis with outflow resistance from absent contractions with normal junction relaxation; borderline or technically uncertain studies require further assessment."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.achalasia.clinic-referral",
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 66,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b04-context",
    "auditId": "B04-context",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v4",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which test should confirm the suspected motility disorder in {patientName}?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "resultNarrative": "The laboratory reports an elevated median integrated relaxation pressure relative to its reference range; all test swallows lack a propagated distal contraction.",
    "previousResultNarrative": "High-resolution manometry shows absent organized esophageal peristalsis together with impaired relaxation of the esophagogastric junction.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the diagnosis name from feedback seen before the recognition task; retain the manometry service, gate and clinical objective."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v4.r2",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
      "answerChoices": [
        {
          "id": "manometry_4",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "After an adequate endoscopic structural assessment excludes obstruction and concerning pseudoachalasia, high-resolution manometry supplies the esophageal physiology needed to evaluate suspected achalasia."
        },
        {
          "id": "repeat_egd_4",
          "label": "Repeat upper-GI endoscopy",
          "isCorrect": false,
          "distractorRationale": "An adequate recent EGD has already excluded a mechanical explanation and concerning pseudoachalasia."
        },
        {
          "id": "ph_monitoring_4",
          "label": "Ambulatory esophageal reflux monitoring",
          "isCorrect": false,
          "distractorRationale": "Reflux monitoring does not define the suspected motility disorder."
        },
        {
          "id": "chest_ct_4",
          "label": "Contrast-enhanced chest CT",
          "isCorrect": false,
          "distractorRationale": "Cross-sectional imaging does not provide the required esophageal physiology after the completed structural evaluation."
        }
      ],
      "explanation": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry"
      ],
      "teachingPoint": "The selected study records pressure changes during swallowing. Interpret the returned measurements alongside the endoscopic findings."
    }
  },
  {
    "id": "revision.qq20261102.b05",
    "auditId": "B05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "What is the most useful initial study for {patientName}'s symptoms?",
    "previousChoiceLabels": [
      "Dynamic groin ultrasound",
      "Pelvic magnetic resonance imaging",
      "Lower-extremity venous duplex",
      "Plain abdominal and pelvic radiographs"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousPresentation": "{patientName} has activity-related groin discomfort and a bulge late in long work shifts, but no visible mass is present at the visit. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies vomiting, abdominal distension, severe constant pain, or an irreducible bulge.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.standing-shift.male.51",
        "presentation": "{patientName} has activity-related groin discomfort and a bulge late in long work shifts, but no visible mass is present at the visit. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies vomiting, abdominal distension, severe constant pain, or an irreducible bulge."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.54",
        "presentation": "{patientName} has activity-related groin discomfort and a bulge late in long work shifts, but no visible mass is present at the visit. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies vomiting, abdominal distension, severe constant pain, or an irreducible bulge."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.57",
        "presentation": "{patientName} has activity-related groin discomfort and a bulge late in long work shifts, but no visible mass is present at the visit. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies vomiting, abdominal distension, severe constant pain, or an irreducible bulge."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.60",
        "presentation": "{patientName} has activity-related groin discomfort and a bulge late in long work shifts, but no visible mass is present at the visit. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies vomiting, abdominal distension, severe constant pain, or an irreducible bulge."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the need to evaluate an intermittent, unobserved groin lump and select an initial imaging approach.",
    "reviewerNotes": "Check the initial-imaging ranking against local practice. Necessary positional history stays; no named-test availability permission or emergency-negative checklist remains.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_4": "dynamic_ultrasound_4",
      "choice.qq20261102.b05.d1": "immediate_repair_4",
      "choice.qq20261102.b05.d2": "routine_xray_4"
    },
    "timingProfileOverrides": {
      "choice.qq20261102.b05.d2": "timing.test.ct"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Delete the named ultrasound availability sentence and interpreted equivocal label. Present what the patient and examiner observed; replace weak radiographic/vascular fillers with cross-sectional competitors."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r2",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_4",
          "label": "Ultrasound of the groin",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Can examine the symptomatic region during positional change and straining when the lump is absent at the office examination."
        },
        {
          "id": "choice.qq20261102.b05.d1",
          "label": "Magnetic resonance imaging of the groin",
          "isCorrect": false,
          "distractorRationale": "Is a plausible study for an occult cause, but is not the usual initial imaging examination in this presentation."
        },
        {
          "id": "choice.qq20261102.b05.d2",
          "label": "Computed tomography of the groin",
          "isCorrect": false,
          "distractorRationale": "Provides a broader cross-sectional survey rather than the usual initial targeted assessment of an intermittent groin lump."
        }
      ],
      "explanation": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound"
      ],
      "teachingPoint": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.inguinal-hernia.standing-shift",
        "patientPresentationVariantId": "presentation.inguinal-hernia.standing-shift",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 51,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b05-context",
    "auditId": "B05-context",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "After {patientName}'s ultrasound confirms a reducible hernia limiting usual activities, what is the appropriate next plan?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r2",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
        },
        {
          "id": "routine_observation_4",
          "label": "Observation with activity modification",
          "isCorrect": false,
          "distractorRationale": "This patient has meaningful activity limitation rather than minimal symptoms."
        },
        {
          "id": "emergency_operation_4",
          "label": "Emergency exploration of the groin",
          "isCorrect": false,
          "distractorRationale": "The patient is stable and the returned study identifies a reducible hernia without emergency features."
        },
        {
          "id": "activity_only_4",
          "label": "Physical therapy for presumed groin strain",
          "isCorrect": false,
          "distractorRationale": "The confirmed hernia is limiting usual work or exercise and merits an elective discussion."
        }
      ],
      "explanation": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair"
      ],
      "teachingPoint": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
    }
  },
  {
    "id": "revision.qq20261102.b06",
    "auditId": "B06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "What is the appropriate initial study for {patientName}'s groin symptoms?",
    "previousChoiceLabels": [
      "Dynamic groin ultrasound",
      "Pelvic magnetic resonance imaging",
      "Lower-extremity venous duplex",
      "Plain abdominal and pelvic radiographs"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousPresentation": "{patientName} describes recurring groin pressure during running and a fleeting bulge that cannot be reproduced in clinic. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies obstruction symptoms, escalating pain, or an irreducible lump.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.35",
        "presentation": "{patientName} describes recurring groin pressure during running and a fleeting bulge that cannot be reproduced in clinic. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies obstruction symptoms, escalating pain, or an irreducible lump."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.38",
        "presentation": "{patientName} describes recurring groin pressure during running and a fleeting bulge that cannot be reproduced in clinic. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies obstruction symptoms, escalating pain, or an irreducible lump."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.41",
        "presentation": "{patientName} describes recurring groin pressure during running and a fleeting bulge that cannot be reproduced in clinic. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies obstruction symptoms, escalating pain, or an irreducible lump."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.44",
        "presentation": "{patientName} describes recurring groin pressure during running and a fleeting bulge that cannot be reproduced in clinic. Groin and femoral assessment is equivocal, and experienced dynamic groin ultrasound is available; the patient denies obstruction symptoms, escalating pain, or an irreducible lump."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the need to evaluate an intermittent, unobserved groin lump and select an initial imaging approach.",
    "reviewerNotes": "Check the initial-imaging ranking against local practice. Necessary positional history stays; no named-test availability permission or emergency-negative checklist remains.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qq20261102.b06.d1": "immediate_repair_2",
      "choice.qq20261102.b06.d2": "routine_xray_2"
    },
    "timingProfileOverrides": {
      "choice.qq20261102.b06.d2": "timing.test.ct"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Delete the named ultrasound availability sentence and interpreted equivocal label. Present what the patient and examiner observed; replace weak radiographic/vascular fillers with cross-sectional competitors."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r2",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Ultrasound of the groin",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Can examine the symptomatic region during positional change and straining when the lump is absent at the office examination."
        },
        {
          "id": "choice.qq20261102.b06.d1",
          "label": "Magnetic resonance imaging of the groin",
          "isCorrect": false,
          "distractorRationale": "Is a plausible study for an occult cause, but is not the usual initial imaging examination in this presentation."
        },
        {
          "id": "choice.qq20261102.b06.d2",
          "label": "Computed tomography of the groin",
          "isCorrect": false,
          "distractorRationale": "Provides a broader cross-sectional survey rather than the usual initial targeted assessment of an intermittent groin lump."
        }
      ],
      "explanation": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound"
      ],
      "teachingPoint": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.inguinal-hernia.running-discomfort",
        "patientPresentationVariantId": "presentation.inguinal-hernia.running-discomfort",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b06-context",
    "auditId": "B06-context",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "After {patientName}'s ultrasound confirms a reducible hernia limiting usual activities, what is the appropriate next plan?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r2",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
        },
        {
          "id": "routine_observation_2",
          "label": "Observation with activity modification",
          "isCorrect": false,
          "distractorRationale": "This patient has meaningful activity limitation rather than minimal symptoms."
        },
        {
          "id": "emergency_operation_2",
          "label": "Emergency exploration of the groin",
          "isCorrect": false,
          "distractorRationale": "The patient is stable and the returned study identifies a reducible hernia without emergency features."
        },
        {
          "id": "activity_only_2",
          "label": "Physical therapy for presumed groin strain",
          "isCorrect": false,
          "distractorRationale": "The confirmed hernia is limiting usual work or exercise and merits an elective discussion."
        }
      ],
      "explanation": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair"
      ],
      "teachingPoint": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
    }
  },
  {
    "id": "revision.qq20261102.b07",
    "auditId": "B07",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which initial diagnostic study should be selected for {patientName} now?",
    "previousChoiceLabels": [
      "Dynamic groin ultrasound",
      "Pelvic magnetic resonance imaging",
      "Lower-extremity venous duplex",
      "Plain abdominal and pelvic radiographs"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousPresentation": "{patientName} notes an intermittent groin bulge while assisting a family member, although today’s groin and femoral-region examination is equivocal. Experienced dynamic groin ultrasound is available, and there are no features of incarceration or bowel obstruction.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.59",
        "presentation": "{patientName} notes an intermittent groin bulge while assisting a family member, although today’s groin and femoral-region examination is equivocal. Experienced dynamic groin ultrasound is available, and there are no features of incarceration or bowel obstruction."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.62",
        "presentation": "{patientName} notes an intermittent groin bulge while assisting a family member, although today’s groin and femoral-region examination is equivocal. Experienced dynamic groin ultrasound is available, and there are no features of incarceration or bowel obstruction."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.65",
        "presentation": "{patientName} notes an intermittent groin bulge while assisting a family member, although today’s groin and femoral-region examination is equivocal. Experienced dynamic groin ultrasound is available, and there are no features of incarceration or bowel obstruction."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.68",
        "presentation": "{patientName} notes an intermittent groin bulge while assisting a family member, although today’s groin and femoral-region examination is equivocal. Experienced dynamic groin ultrasound is available, and there are no features of incarceration or bowel obstruction."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the need to evaluate an intermittent, unobserved groin lump and select an initial imaging approach.",
    "reviewerNotes": "Check the initial-imaging ranking against local practice. Necessary positional history stays; no named-test availability permission or emergency-negative checklist remains.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_3": "dynamic_ultrasound_3",
      "choice.qq20261102.b07.d1": "immediate_repair_3",
      "choice.qq20261102.b07.d2": "routine_xray_3"
    },
    "timingProfileOverrides": {
      "choice.qq20261102.b07.d2": "timing.test.ct"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Delete the named ultrasound availability sentence and interpreted equivocal label. Present what the patient and examiner observed; replace weak radiographic/vascular fillers with cross-sectional competitors."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r2",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_3",
          "label": "Ultrasound of the groin",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Can examine the symptomatic region during positional change and straining when the lump is absent at the office examination."
        },
        {
          "id": "choice.qq20261102.b07.d1",
          "label": "Magnetic resonance imaging of the groin",
          "isCorrect": false,
          "distractorRationale": "Is a plausible study for an occult cause, but is not the usual initial imaging examination in this presentation."
        },
        {
          "id": "choice.qq20261102.b07.d2",
          "label": "Computed tomography of the groin",
          "isCorrect": false,
          "distractorRationale": "Provides a broader cross-sectional survey rather than the usual initial targeted assessment of an intermittent groin lump."
        }
      ],
      "explanation": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound"
      ],
      "teachingPoint": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.inguinal-hernia.caregiving-strain",
        "patientPresentationVariantId": "presentation.inguinal-hernia.caregiving-strain",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 59,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b07-context",
    "auditId": "B07-context",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "After {patientName}'s ultrasound confirms a reducible hernia limiting usual activities, what is the appropriate next plan?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r2",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
        },
        {
          "id": "routine_observation_3",
          "label": "Observation with activity modification",
          "isCorrect": false,
          "distractorRationale": "This patient has meaningful activity limitation rather than minimal symptoms."
        },
        {
          "id": "emergency_operation_3",
          "label": "Emergency exploration of the groin",
          "isCorrect": false,
          "distractorRationale": "The patient is stable and the returned study identifies a reducible hernia without emergency features."
        },
        {
          "id": "activity_only_3",
          "label": "Physical therapy for presumed groin strain",
          "isCorrect": false,
          "distractorRationale": "The confirmed hernia is limiting usual work or exercise and merits an elective discussion."
        }
      ],
      "explanation": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair"
      ],
      "teachingPoint": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
    }
  },
  {
    "id": "revision.qq20261102.b08",
    "auditId": "B08",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which initial study best fits {patientName}'s equivocal examination?",
    "previousChoiceLabels": [
      "Dynamic groin ultrasound",
      "Pelvic magnetic resonance imaging",
      "Lower-extremity venous duplex",
      "Plain abdominal and pelvic radiographs"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousPresentation": "{patientName} reports an intermittent groin bulge and discomfort with lifting, but the bulge is absent during today’s examination. The groin and femoral regions are assessed, and experienced dynamic groin ultrasound is available; there is no vomiting, obstipation, persistent severe pain, or nonreducible mass.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.44",
        "presentation": "{patientName} reports an intermittent groin bulge and discomfort with lifting, but the bulge is absent during today’s examination. The groin and femoral regions are assessed, and experienced dynamic groin ultrasound is available; there is no vomiting, obstipation, persistent severe pain, or nonreducible mass."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.47",
        "presentation": "{patientName} reports an intermittent groin bulge and discomfort with lifting, but the bulge is absent during today’s examination. The groin and femoral regions are assessed, and experienced dynamic groin ultrasound is available; there is no vomiting, obstipation, persistent severe pain, or nonreducible mass."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.50",
        "presentation": "{patientName} reports an intermittent groin bulge and discomfort with lifting, but the bulge is absent during today’s examination. The groin and femoral regions are assessed, and experienced dynamic groin ultrasound is available; there is no vomiting, obstipation, persistent severe pain, or nonreducible mass."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.53",
        "presentation": "{patientName} reports an intermittent groin bulge and discomfort with lifting, but the bulge is absent during today’s examination. The groin and femoral regions are assessed, and experienced dynamic groin ultrasound is available; there is no vomiting, obstipation, persistent severe pain, or nonreducible mass."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the need to evaluate an intermittent, unobserved groin lump and select an initial imaging approach.",
    "reviewerNotes": "Check the initial-imaging ranking against local practice. Necessary positional history stays; no named-test availability permission or emergency-negative checklist remains.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_1": "dynamic_ultrasound_1",
      "choice.qq20261102.b08.d1": "immediate_repair_1",
      "choice.qq20261102.b08.d2": "routine_xray_1"
    },
    "timingProfileOverrides": {
      "choice.qq20261102.b08.d2": "timing.test.ct"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Delete the named ultrasound availability sentence and interpreted equivocal label. Present what the patient and examiner observed; replace weak radiographic/vascular fillers with cross-sectional competitors."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r2",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_1",
          "label": "Ultrasound of the groin",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Can examine the symptomatic region during positional change and straining when the lump is absent at the office examination."
        },
        {
          "id": "choice.qq20261102.b08.d1",
          "label": "Magnetic resonance imaging of the groin",
          "isCorrect": false,
          "distractorRationale": "Is a plausible study for an occult cause, but is not the usual initial imaging examination in this presentation."
        },
        {
          "id": "choice.qq20261102.b08.d2",
          "label": "Computed tomography of the groin",
          "isCorrect": false,
          "distractorRationale": "Provides a broader cross-sectional survey rather than the usual initial targeted assessment of an intermittent groin lump."
        }
      ],
      "explanation": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound"
      ],
      "teachingPoint": "Targeted groin ultrasound can assess an intermittent suspected hernia when examination does not establish the diagnosis. MRI can be useful after an unresolved assessment; the item does not claim ultrasound is infallible."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.inguinal-hernia.lifting-bulge",
        "patientPresentationVariantId": "presentation.inguinal-hernia.lifting-bulge",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 44,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b08-context",
    "auditId": "B08-context",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "After {patientName}'s ultrasound confirms a reducible hernia limiting usual activities, what is the appropriate next plan?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v1.r2",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
      "answerChoices": [
        {
          "id": "elective_discussion_1",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
        },
        {
          "id": "routine_observation_1",
          "label": "Observation with activity modification",
          "isCorrect": false,
          "distractorRationale": "This patient has meaningful activity limitation rather than minimal symptoms."
        },
        {
          "id": "emergency_operation_1",
          "label": "Emergency exploration of the groin",
          "isCorrect": false,
          "distractorRationale": "The patient is stable and the returned study identifies a reducible hernia without emergency features."
        },
        {
          "id": "activity_only_1",
          "label": "Physical therapy for presumed groin strain",
          "isCorrect": false,
          "distractorRationale": "The confirmed hernia is limiting usual work or exercise and merits an elective discussion."
        }
      ],
      "explanation": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair"
      ],
      "teachingPoint": "A reducible inguinal hernia causing meaningful activity limitation supports elective repair discussion and planning. The stable presentation does not require emergency treatment or a specific technique selection."
    }
  },
  {
    "id": "revision.qq20261102.b09",
    "auditId": "B09",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which initial mapping study best addresses the surgical question?",
    "previousChoiceLabels": [
      "Complete neck ultrasound",
      "Thyroid uptake scan alone",
      "Repeat thyroid function testing",
      "Noncontrast head CT"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
    "previousPresentation": "{patientName}, a 43-year-old woman, presents with confirmed differentiated thyroid cancer and a palpable lateral neck node. No dedicated compartment ultrasound has been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
        "presentation": "{patientName}, a 43-year-old woman, presents with confirmed differentiated thyroid cancer and a palpable lateral neck node. No dedicated compartment ultrasound has been performed."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
        "presentation": "{patientName}, a 43-year-old man, presents with confirmed differentiated thyroid cancer and a palpable lateral neck node. No dedicated compartment ultrasound has been performed."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
        "presentation": "{patientName}, a 68-year-old woman, presents with confirmed differentiated thyroid cancer and a palpable lateral neck node. No dedicated compartment ultrasound has been performed."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
        "presentation": "{patientName}, a 68-year-old man, presents with confirmed differentiated thyroid cancer and a palpable lateral neck node. No dedicated compartment ultrasound has been performed."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose the preoperative assessment from the cancer and palpable-node findings without being told which modality is missing.",
    "reviewerNotes": "Clinician confirms the ultrasound-versus-CT ranking for a mobile node without supplied bulky or invasive disease; avoid inventing node-size thresholds.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qq20261102.b09.d1": "d3_3",
      "choice.qq20261102.b09.d2": "d1_3"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the sentence naming the unperformed modality, the mapping lead-in and unrelated test fillers. Compare three neck/thyroid imaging modalities."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r2",
      "conceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "stem": "Which imaging study should be obtained before surgery for {patientName}'s papillary thyroid carcinoma?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Neck ultrasonography",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Assesses cervical nodal compartments and local thyroid findings before operative planning."
        },
        {
          "id": "choice.qq20261102.b09.d1",
          "label": "Contrast-enhanced neck CT",
          "isCorrect": false,
          "distractorRationale": "Can add information for selected extensive disease, but does not replace the initial ultrasound assessment in this stated presentation."
        },
        {
          "id": "choice.qq20261102.b09.d2",
          "label": "Thyroid scintigraphy",
          "isCorrect": false,
          "distractorRationale": "Assesses thyroid tracer uptake rather than the cervical nodal anatomy needed for operative planning."
        }
      ],
      "explanation": "Preoperative neck ultrasound is recommended for cervical nodal and local assessment after malignant thyroid cytology. Cross-sectional imaging is an adjunct when the clinical findings warrant it.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound"
      ],
      "teachingPoint": "Preoperative neck ultrasound is recommended for cervical nodal and local assessment after malignant thyroid cytology. Cross-sectional imaging is an adjunct when the clinical findings warrant it."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b10",
    "auditId": "B10",
    "caseId": "case.gs028.stoma-prolapse.b-obstructed-prolapse",
    "nodeId": "node.gs028.stoma-prolapse.b-obstructed-prolapse.1",
    "previousQuestionVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4",
    "questionVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-28.pre-endoscopy.1"
    ],
    "previousStem": "What is the safest disposition?",
    "previousChoiceLabels": [
      "Emergency surgery review",
      "Routine specialist appointment",
      "Diet modification at home",
      "Appliance adjustment only"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with cramping, vomiting and much less stoma output. The prolapsed bowel remains outside when lying down and cannot be gently returned. It is red and markedly swollen.",
    "previousPresentation": "{patientName} is a 43-year-old woman who presents with an irreducible prolapsed stoma, cramping, vomiting, abdominal distention, and sharply reduced output. The bowel remains red but very edematous.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028.stoma-prolapse.b-obstructed-prolapse.female.43",
        "presentation": "{patientName} is a 43-year-old woman who presents with an irreducible prolapsed stoma, cramping, vomiting, abdominal distention, and sharply reduced output. The bowel remains red but very edematous."
      },
      {
        "id": "profile.gs028.stoma-prolapse.b-obstructed-prolapse.male.43",
        "presentation": "{patientName} is a 43-year-old man who presents with an irreducible prolapsed stoma, cramping, vomiting, abdominal distention, and sharply reduced output. The bowel remains red but very edematous."
      },
      {
        "id": "profile.gs028.stoma-prolapse.b-obstructed-prolapse.female.68",
        "presentation": "{patientName} is a 68-year-old woman who presents with an irreducible prolapsed stoma, cramping, vomiting, abdominal distention, and sharply reduced output. The bowel remains red but very edematous."
      },
      {
        "id": "profile.gs028.stoma-prolapse.b-obstructed-prolapse.male.68",
        "presentation": "{patientName} is a 68-year-old man who presents with an irreducible prolapsed stoma, cramping, vomiting, abdominal distention, and sharply reduced output. The bowel remains red but very edematous."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use symptoms, output and reducibility together rather than assuming red bowel permits outpatient management.",
    "reviewerNotes": "This remains an acute-care recognition item; do not hide the decision-critical warning signs merely to force difficulty. Confirm urgency and disposition wording.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qq20261102.b10.d1": "d1_4",
      "choice.qq20261102.b10.d2": "d2_4"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the safest lead-in and mixed home-treatment options with a neutral disposition task and three parallel assessment destinations. Preserve the competing reassuring observation of red bowel."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.stoma-prolapse.urgent-surgical-escalation.v4.r2",
      "conceptId": "concept.stoma-prolapse.urgent-surgical-escalation",
      "stem": "Which disposition should be arranged for {patientName}'s stoma problem?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Emergency surgical assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treats the obstructive symptoms and nonreducible prolapse as requiring acute assessment even though the bowel is still red."
        },
        {
          "id": "choice.qq20261102.b10.d1",
          "label": "Expedited outpatient colorectal assessment",
          "isCorrect": false,
          "distractorRationale": "Acknowledges a surgical problem but underestimates the current obstructive presentation."
        },
        {
          "id": "choice.qq20261102.b10.d2",
          "label": "Routine outpatient ostomy assessment",
          "isCorrect": false,
          "distractorRationale": "Fits appliance or uncomplicated follow-up concerns rather than this combination of vomiting, reduced output and nonreduction."
        }
      ],
      "explanation": "Obstructive symptoms with a nonreducible prolapse warrant urgent surgical assessment. A red appearance does not remove the concern.",
      "supportingEvidenceClaimIds": [
        "claim.stoma-prolapse.urgent-escalation"
      ],
      "teachingPoint": "Obstructive symptoms with a nonreducible prolapse warrant urgent surgical assessment. A red appearance does not remove the concern."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b11",
    "auditId": "B11",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "With clinically negative regional nodes, which staging discussion should accompany {patientName}'s definitive wide-excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy with definitive excision",
      "Complete regional lymph-node dissection with definitive excision",
      "Regional nodal ultrasound surveillance with definitive excision",
      "Clinical nodal follow-up with definitive excision"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousPresentation": "{patientName} presents with a small accessible superficial shoulder lesion with new border asymmetry and color variation. There is no prior biopsy and no palpable regional adenopathy.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.female.58",
        "presentation": "{patientName} presents with a small accessible superficial shoulder lesion with new border asymmetry and color variation. There is no prior biopsy and no palpable regional adenopathy."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.male.58",
        "presentation": "{patientName} presents with a small accessible superficial shoulder lesion with new border asymmetry and color variation. There is no prior biopsy and no palpable regional adenopathy."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.female.63",
        "presentation": "{patientName} presents with a small accessible superficial shoulder lesion with new border asymmetry and color variation. There is no prior biopsy and no palpable regional adenopathy."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.male.63",
        "presentation": "{patientName} presents with a small accessible superficial shoulder lesion with new border asymmetry and color variation. There is no prior biopsy and no palpable regional adenopathy."
      }
    ],
    "currentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.6 mm. No enlarged nodes are felt in the draining basin.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Apply the measured invasion depth and nodal examination to the regional-node strategy.",
    "reviewerNotes": "Existing Breslow measurements are retained. Confirm the staging indication and consent discussion; diagnosis is appropriately supplied because this is a management task.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_2": "sentinel_node_2",
      "choice.qq20261102.b11.d1": "complete_dissection_2",
      "choice.qq20261102.b11.d2": "imaging_only_2"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove definitive and clinically-negative principle wording from the task, shorten all options to parallel node strategies, and retain the decision-critical biopsy measurement and examination."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v2.r2",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
      "answerChoices": [
        {
          "id": "sentinel_node_2",
          "label": "Sentinel lymph-node biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains regional pathologic staging for the supplied invasive melanoma thickness and nonpalpable nodes."
        },
        {
          "id": "choice.qq20261102.b11.d1",
          "label": "Lymph-node ultrasound surveillance",
          "isCorrect": false,
          "distractorRationale": "Can evaluate or follow nodes in selected settings, but does not provide the same pathologic sentinel-node staging here."
        },
        {
          "id": "choice.qq20261102.b11.d2",
          "label": "Complete lymph-node dissection",
          "isCorrect": false,
          "distractorRationale": "Extends nodal surgery beyond the initial staging step for clinically uninvolved nodes."
        }
      ],
      "explanation": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.pigmented-skin-lesion.shoulder-border",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.shoulder-border",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 58,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b11-context",
    "auditId": "B11-context",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which initial tissue-diagnosis approach best fits {patientName}'s lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "resultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.6 mm. No enlarged nodes are felt in the draining basin.",
    "previousResultNarrative": "Complete biopsy shows invasive melanoma with a measured thickness of 1.6 mm with adequate histologic microstaging.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation and returned histology; keep the diagnostic-biopsy choices, key and service contract. Replace repetitive procedural wording in feedback with a neutral specimen-to-result transition."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r2",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_2",
          "label": "Complete excisional biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A small accessible lesion concerning for melanoma is usually removed completely with narrow clinical margins and enough depth for histologic microstaging. Selected large or difficult lesions can require a different biopsy approach."
        },
        {
          "id": "superficial_shave_2",
          "label": "Superficial shave biopsy",
          "isCorrect": false,
          "distractorRationale": "A superficial sample can truncate the lesion and compromise microstaging."
        },
        {
          "id": "partial_punch_2",
          "label": "Partial punch biopsy",
          "isCorrect": false,
          "distractorRationale": "The small accessible lesion can be completely sampled rather than selecting one potentially unrepresentative edge."
        },
        {
          "id": "wide_excision_2",
          "label": "Definitive wide local excision",
          "isCorrect": false,
          "distractorRationale": "Diagnostic microstaging should guide definitive planning rather than beginning with an unselected wide excision."
        }
      ],
      "explanation": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care."
    }
  },
  {
    "id": "revision.qq20261102.b12",
    "auditId": "B12",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v4",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "With clinically negative regional nodes, which staging discussion should accompany {patientName}'s definitive wide-excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy with definitive excision",
      "Complete regional lymph-node dissection with definitive excision",
      "Regional nodal ultrasound surveillance with definitive excision",
      "Clinical nodal follow-up with definitive excision"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousPresentation": "{patientName} has a small superficial forearm lesion with documented change in border and pigmentation. It is accessible for complete local biopsy, with no tissue diagnosis or palpable regional nodes yet.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.67",
        "presentation": "{patientName} has a small superficial forearm lesion with documented change in border and pigmentation. It is accessible for complete local biopsy, with no tissue diagnosis or palpable regional nodes yet."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.67",
        "presentation": "{patientName} has a small superficial forearm lesion with documented change in border and pigmentation. It is accessible for complete local biopsy, with no tissue diagnosis or palpable regional nodes yet."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.72",
        "presentation": "{patientName} has a small superficial forearm lesion with documented change in border and pigmentation. It is accessible for complete local biopsy, with no tissue diagnosis or palpable regional nodes yet."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.72",
        "presentation": "{patientName} has a small superficial forearm lesion with documented change in border and pigmentation. It is accessible for complete local biopsy, with no tissue diagnosis or palpable regional nodes yet."
      }
    ],
    "currentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.5 mm. No enlarged nodes are felt in the draining basin.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Apply the measured invasion depth and nodal examination to the regional-node strategy.",
    "reviewerNotes": "Existing Breslow measurements are retained. Confirm the staging indication and consent discussion; diagnosis is appropriately supplied because this is a management task.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_4": "sentinel_node_4",
      "choice.qq20261102.b12.d1": "complete_dissection_4",
      "choice.qq20261102.b12.d2": "imaging_only_4"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove definitive and clinically-negative principle wording from the task, shorten all options to parallel node strategies, and retain the decision-critical biopsy measurement and examination."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v4.r2",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
      "answerChoices": [
        {
          "id": "sentinel_node_4",
          "label": "Sentinel lymph-node biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains regional pathologic staging for the supplied invasive melanoma thickness and nonpalpable nodes."
        },
        {
          "id": "choice.qq20261102.b12.d1",
          "label": "Lymph-node ultrasound surveillance",
          "isCorrect": false,
          "distractorRationale": "Can evaluate or follow nodes in selected settings, but does not provide the same pathologic sentinel-node staging here."
        },
        {
          "id": "choice.qq20261102.b12.d2",
          "label": "Complete lymph-node dissection",
          "isCorrect": false,
          "distractorRationale": "Extends nodal surgery beyond the initial staging step for clinically uninvolved nodes."
        }
      ],
      "explanation": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.pigmented-skin-lesion.forearm-change",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.forearm-change",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 67,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b12-context",
    "auditId": "B12-context",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which initial tissue-diagnosis approach best fits {patientName}'s lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "resultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.5 mm. No enlarged nodes are felt in the draining basin.",
    "previousResultNarrative": "Complete biopsy shows invasive melanoma with a measured thickness of 1.5 mm with adequate histologic microstaging.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation and returned histology; keep the diagnostic-biopsy choices, key and service contract. Replace repetitive procedural wording in feedback with a neutral specimen-to-result transition."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r2",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Complete excisional biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A small accessible lesion concerning for melanoma is usually removed completely with narrow clinical margins and enough depth for histologic microstaging. Selected large or difficult lesions can require a different biopsy approach."
        },
        {
          "id": "superficial_shave_4",
          "label": "Superficial shave biopsy",
          "isCorrect": false,
          "distractorRationale": "A superficial sample can truncate the lesion and compromise microstaging."
        },
        {
          "id": "partial_punch_4",
          "label": "Partial punch biopsy",
          "isCorrect": false,
          "distractorRationale": "The small accessible lesion can be completely sampled rather than selecting one potentially unrepresentative edge."
        },
        {
          "id": "wide_excision_4",
          "label": "Definitive wide local excision",
          "isCorrect": false,
          "distractorRationale": "Diagnostic microstaging should guide definitive planning rather than beginning with an unselected wide excision."
        }
      ],
      "explanation": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care."
    }
  },
  {
    "id": "revision.qq20261102.b13",
    "auditId": "B13",
    "caseId": "case.colon-cancer.right-colon-referral",
    "nodeId": "node.colon-cancer.right-colon-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v1",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which definitive treatment approach should guide hospital referral planning for {patientName}'s localized resectable cancer?",
    "previousChoiceLabels": [
      "Resect the involved colon and regional lymph nodes",
      "Enucleate the primary tumor without regional bowel resection",
      "Perform total abdominal colectomy",
      "Treat the localized primary with systemic chemotherapy alone"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousPresentation": "{patientName} has a nonendoscopically resectable ascending-colon mass with biopsy-confirmed invasive adenocarcinoma, without obstruction or perforation. Initial records do not include complete cross-sectional staging.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.right-colon-referral.female.57",
        "presentation": "{patientName} has a nonendoscopically resectable ascending-colon mass with biopsy-confirmed invasive adenocarcinoma, without obstruction or perforation. Initial records do not include complete cross-sectional staging."
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.male.57",
        "presentation": "{patientName} has a nonendoscopically resectable ascending-colon mass with biopsy-confirmed invasive adenocarcinoma, without obstruction or perforation. Initial records do not include complete cross-sectional staging."
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.female.61",
        "presentation": "{patientName} has a nonendoscopically resectable ascending-colon mass with biopsy-confirmed invasive adenocarcinoma, without obstruction or perforation. Initial records do not include complete cross-sectional staging."
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.male.61",
        "presentation": "{patientName} has a nonendoscopically resectable ascending-colon mass with biopsy-confirmed invasive adenocarcinoma, without obstruction or perforation. Initial records do not include complete cross-sectional staging."
      }
    ],
    "currentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose the oncologic extent despite the lack of enlarged nodes, avoiding either local undertreatment or unsupported total colectomy.",
    "reviewerNotes": "Confirm the source supports the CT-versus-pathologic-node distinction. No specific segmental technique or claim that all colon cancers have one extent is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_1": "regional_resection_1",
      "choice.qq20261102.b13.d1": "local_enucleation_1",
      "choice.qq20261102.b13.d2": "total_colectomy_1"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the definitive/localized-resectable conclusion in the lead-in and the chemotherapy outlier. Compare three operations of similar length and add the node-size observation that must be interpreted."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v1.r2",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "regional_resection_1",
          "label": "Segmental colectomy with lymphadenectomy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Removes the tumor-bearing segment with its lymphatic drainage; normal node size on CT does not establish pathologic node negativity."
        },
        {
          "id": "choice.qq20261102.b13.d1",
          "label": "Local full-thickness excision of the tumour",
          "isCorrect": false,
          "distractorRationale": "Underweights the need for regional oncologic resection and nodal assessment of an invasive tumor not suitable for endoscopic removal."
        },
        {
          "id": "choice.qq20261102.b13.d2",
          "label": "Total abdominal colectomy with lymphadenectomy",
          "isCorrect": false,
          "distractorRationale": "Extends bowel removal beyond the supplied single tumor without an additional indication for total colectomy."
        }
      ],
      "explanation": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection"
      ],
      "teachingPoint": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.colon-cancer.right-colon-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.right-colon-referral",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b13-context",
    "auditId": "B13-context",
    "caseId": "case.colon-cancer.right-colon-referral",
    "nodeId": "node.colon-cancer.right-colon-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "resultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousResultNarrative": "CT of the chest, abdomen, and pelvis shows no distant metastasis or adjacent-organ invasion.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r2",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "ct_cap_1",
          "label": "Contrast CT: chest, abdomen, pelvis",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
        },
        {
          "id": "pet_ct_1",
          "label": "Whole-body PET-CT for systemic staging",
          "isCorrect": false,
          "distractorRationale": "PET-CT is not routine initial staging for newly diagnosed colon cancer."
        },
        {
          "id": "abdominal_us_1",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the complete thoracic, abdominal, and pelvic staging assessment needed."
        },
        {
          "id": "pelvic_mri_1",
          "label": "Pelvic MRI alone",
          "isCorrect": false,
          "distractorRationale": "Pelvic MRI alone omits chest and abdominal staging and is not the standard complete study for colon cancer."
        }
      ],
      "explanation": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging"
      ],
      "teachingPoint": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
    }
  },
  {
    "id": "revision.qq20261102.b14",
    "auditId": "B14",
    "caseId": "case.colon-cancer.sigmoid-referral",
    "nodeId": "node.colon-cancer.sigmoid-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v2",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which definitive treatment approach should guide hospital referral planning for {patientName}'s localized resectable cancer?",
    "previousChoiceLabels": [
      "Resect the involved colon and regional lymph nodes",
      "Enucleate the primary tumor without regional bowel resection",
      "Perform total abdominal colectomy",
      "Treat the localized primary with systemic chemotherapy alone"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousPresentation": "{patientName} has a nonendoscopically resectable sigmoid mass with biopsy-confirmed invasive adenocarcinoma and remains stable without obstruction, perforation, or acute bleeding. Treatment planning awaits staging.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.sigmoid-referral.female.63",
        "presentation": "{patientName} has a nonendoscopically resectable sigmoid mass with biopsy-confirmed invasive adenocarcinoma and remains stable without obstruction, perforation, or acute bleeding. Treatment planning awaits staging."
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.male.63",
        "presentation": "{patientName} has a nonendoscopically resectable sigmoid mass with biopsy-confirmed invasive adenocarcinoma and remains stable without obstruction, perforation, or acute bleeding. Treatment planning awaits staging."
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.female.66",
        "presentation": "{patientName} has a nonendoscopically resectable sigmoid mass with biopsy-confirmed invasive adenocarcinoma and remains stable without obstruction, perforation, or acute bleeding. Treatment planning awaits staging."
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.male.66",
        "presentation": "{patientName} has a nonendoscopically resectable sigmoid mass with biopsy-confirmed invasive adenocarcinoma and remains stable without obstruction, perforation, or acute bleeding. Treatment planning awaits staging."
      }
    ],
    "currentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose the oncologic extent despite the lack of enlarged nodes, avoiding either local undertreatment or unsupported total colectomy.",
    "reviewerNotes": "Confirm the source supports the CT-versus-pathologic-node distinction. No specific segmental technique or claim that all colon cancers have one extent is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_2": "regional_resection_2",
      "choice.qq20261102.b14.d1": "local_enucleation_2",
      "choice.qq20261102.b14.d2": "total_colectomy_2"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the definitive/localized-resectable conclusion in the lead-in and the chemotherapy outlier. Compare three operations of similar length and add the node-size observation that must be interpreted."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v2.r2",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "regional_resection_2",
          "label": "Segmental colectomy with lymphadenectomy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Removes the tumor-bearing segment with its lymphatic drainage; normal node size on CT does not establish pathologic node negativity."
        },
        {
          "id": "choice.qq20261102.b14.d1",
          "label": "Local full-thickness excision of the tumour",
          "isCorrect": false,
          "distractorRationale": "Underweights the need for regional oncologic resection and nodal assessment of an invasive tumor not suitable for endoscopic removal."
        },
        {
          "id": "choice.qq20261102.b14.d2",
          "label": "Total abdominal colectomy with lymphadenectomy",
          "isCorrect": false,
          "distractorRationale": "Extends bowel removal beyond the supplied single tumor without an additional indication for total colectomy."
        }
      ],
      "explanation": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection"
      ],
      "teachingPoint": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.colon-cancer.sigmoid-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.sigmoid-referral",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 63,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b14-context",
    "auditId": "B14-context",
    "caseId": "case.colon-cancer.sigmoid-referral",
    "nodeId": "node.colon-cancer.sigmoid-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "resultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousResultNarrative": "CT of the chest, abdomen, and pelvis shows no distant metastasis or adjacent-organ invasion.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r2",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "ct_cap_2",
          "label": "Contrast CT: chest, abdomen, pelvis",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
        },
        {
          "id": "pet_ct_2",
          "label": "Whole-body PET-CT for systemic staging",
          "isCorrect": false,
          "distractorRationale": "PET-CT is not routine initial staging for newly diagnosed colon cancer."
        },
        {
          "id": "abdominal_us_2",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the complete thoracic, abdominal, and pelvic staging assessment needed."
        },
        {
          "id": "pelvic_mri_2",
          "label": "Pelvic MRI alone",
          "isCorrect": false,
          "distractorRationale": "Pelvic MRI alone omits chest and abdominal staging and is not the standard complete study for colon cancer."
        }
      ],
      "explanation": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging"
      ],
      "teachingPoint": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
    }
  },
  {
    "id": "revision.qq20261102.b15",
    "auditId": "B15",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v3",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which definitive treatment approach should guide hospital referral planning for {patientName}'s localized resectable cancer?",
    "previousChoiceLabels": [
      "Resect the involved colon and regional lymph nodes",
      "Enucleate the primary tumor without regional bowel resection",
      "Perform total abdominal colectomy",
      "Treat the localized primary with systemic chemotherapy alone"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousPresentation": "{patientName} has a nonendoscopically resectable transverse-colon mass with biopsy-confirmed invasive adenocarcinoma and no acute complication. No distant staging result has yet returned.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.transverse-referral.female.54",
        "presentation": "{patientName} has a nonendoscopically resectable transverse-colon mass with biopsy-confirmed invasive adenocarcinoma and no acute complication. No distant staging result has yet returned."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.54",
        "presentation": "{patientName} has a nonendoscopically resectable transverse-colon mass with biopsy-confirmed invasive adenocarcinoma and no acute complication. No distant staging result has yet returned."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.female.59",
        "presentation": "{patientName} has a nonendoscopically resectable transverse-colon mass with biopsy-confirmed invasive adenocarcinoma and no acute complication. No distant staging result has yet returned."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.59",
        "presentation": "{patientName} has a nonendoscopically resectable transverse-colon mass with biopsy-confirmed invasive adenocarcinoma and no acute complication. No distant staging result has yet returned."
      }
    ],
    "currentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose the oncologic extent despite the lack of enlarged nodes, avoiding either local undertreatment or unsupported total colectomy.",
    "reviewerNotes": "Confirm the source supports the CT-versus-pathologic-node distinction. No specific segmental technique or claim that all colon cancers have one extent is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_3": "regional_resection_3",
      "choice.qq20261102.b15.d1": "local_enucleation_3",
      "choice.qq20261102.b15.d2": "total_colectomy_3"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the definitive/localized-resectable conclusion in the lead-in and the chemotherapy outlier. Compare three operations of similar length and add the node-size observation that must be interpreted."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v3.r2",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "regional_resection_3",
          "label": "Segmental colectomy with lymphadenectomy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Removes the tumor-bearing segment with its lymphatic drainage; normal node size on CT does not establish pathologic node negativity."
        },
        {
          "id": "choice.qq20261102.b15.d1",
          "label": "Local full-thickness excision of the tumour",
          "isCorrect": false,
          "distractorRationale": "Underweights the need for regional oncologic resection and nodal assessment of an invasive tumor not suitable for endoscopic removal."
        },
        {
          "id": "choice.qq20261102.b15.d2",
          "label": "Total abdominal colectomy with lymphadenectomy",
          "isCorrect": false,
          "distractorRationale": "Extends bowel removal beyond the supplied single tumor without an additional indication for total colectomy."
        }
      ],
      "explanation": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection"
      ],
      "teachingPoint": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.colon-cancer.transverse-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.transverse-referral",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 54,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b15-context",
    "auditId": "B15-context",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "resultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousResultNarrative": "CT of the chest, abdomen, and pelvis shows no distant metastasis or adjacent-organ invasion.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r2",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "ct_cap_3",
          "label": "Contrast CT: chest, abdomen, pelvis",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
        },
        {
          "id": "pet_ct_3",
          "label": "Whole-body PET-CT for systemic staging",
          "isCorrect": false,
          "distractorRationale": "PET-CT is not routine initial staging for newly diagnosed colon cancer."
        },
        {
          "id": "abdominal_us_3",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the complete thoracic, abdominal, and pelvic staging assessment needed."
        },
        {
          "id": "pelvic_mri_3",
          "label": "Pelvic MRI alone",
          "isCorrect": false,
          "distractorRationale": "Pelvic MRI alone omits chest and abdominal staging and is not the standard complete study for colon cancer."
        }
      ],
      "explanation": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging"
      ],
      "teachingPoint": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
    }
  },
  {
    "id": "revision.qq20261102.b16",
    "auditId": "B16",
    "caseId": "case.colon-cancer.descending-referral",
    "nodeId": "node.colon-cancer.descending-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v4",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which definitive treatment approach should guide hospital referral planning for {patientName}'s localized resectable cancer?",
    "previousChoiceLabels": [
      "Resect the involved colon and regional lymph nodes",
      "Enucleate the primary tumor without regional bowel resection",
      "Perform total abdominal colectomy",
      "Treat the localized primary with systemic chemotherapy alone"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousPresentation": "{patientName} has a nonendoscopically resectable descending-colon mass with biopsy-confirmed invasive adenocarcinoma, stable intake, and no obstruction or perforation. Complete preoperative staging is pending.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.descending-referral.female.68",
        "presentation": "{patientName} has a nonendoscopically resectable descending-colon mass with biopsy-confirmed invasive adenocarcinoma, stable intake, and no obstruction or perforation. Complete preoperative staging is pending."
      },
      {
        "id": "profile.colon-cancer.descending-referral.male.68",
        "presentation": "{patientName} has a nonendoscopically resectable descending-colon mass with biopsy-confirmed invasive adenocarcinoma, stable intake, and no obstruction or perforation. Complete preoperative staging is pending."
      },
      {
        "id": "profile.colon-cancer.descending-referral.female.71",
        "presentation": "{patientName} has a nonendoscopically resectable descending-colon mass with biopsy-confirmed invasive adenocarcinoma, stable intake, and no obstruction or perforation. Complete preoperative staging is pending."
      },
      {
        "id": "profile.colon-cancer.descending-referral.male.71",
        "presentation": "{patientName} has a nonendoscopically resectable descending-colon mass with biopsy-confirmed invasive adenocarcinoma, stable intake, and no obstruction or perforation. Complete preoperative staging is pending."
      }
    ],
    "currentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose the oncologic extent despite the lack of enlarged nodes, avoiding either local undertreatment or unsupported total colectomy.",
    "reviewerNotes": "Confirm the source supports the CT-versus-pathologic-node distinction. No specific segmental technique or claim that all colon cancers have one extent is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_4": "regional_resection_4",
      "choice.qq20261102.b16.d1": "local_enucleation_4",
      "choice.qq20261102.b16.d2": "total_colectomy_4"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the definitive/localized-resectable conclusion in the lead-in and the chemotherapy outlier. Compare three operations of similar length and add the node-size observation that must be interpreted."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v4.r2",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "regional_resection_4",
          "label": "Segmental colectomy with lymphadenectomy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Removes the tumor-bearing segment with its lymphatic drainage; normal node size on CT does not establish pathologic node negativity."
        },
        {
          "id": "choice.qq20261102.b16.d1",
          "label": "Local full-thickness excision of the tumour",
          "isCorrect": false,
          "distractorRationale": "Underweights the need for regional oncologic resection and nodal assessment of an invasive tumor not suitable for endoscopic removal."
        },
        {
          "id": "choice.qq20261102.b16.d2",
          "label": "Total abdominal colectomy with lymphadenectomy",
          "isCorrect": false,
          "distractorRationale": "Extends bowel removal beyond the supplied single tumor without an additional indication for total colectomy."
        }
      ],
      "explanation": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection"
      ],
      "teachingPoint": "Resection of the involved colon and its regional lymphatic drainage is the operative framework for this resectable invasive primary. CT node size does not replace pathologic assessment; additional disease or inherited risk can alter extent."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.colon-cancer.descending-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.descending-referral",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 68,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b16-context",
    "auditId": "B16-context",
    "caseId": "case.colon-cancer.descending-referral",
    "nodeId": "node.colon-cancer.descending-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-11.1"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "resultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousResultNarrative": "CT of the chest, abdomen, and pelvis shows no distant metastasis or adjacent-organ invasion.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r2",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
      "answerChoices": [
        {
          "id": "ct_cap_4",
          "label": "Contrast CT: chest, abdomen, pelvis",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
        },
        {
          "id": "pet_ct_4",
          "label": "Whole-body PET-CT for systemic staging",
          "isCorrect": false,
          "distractorRationale": "PET-CT is not routine initial staging for newly diagnosed colon cancer."
        },
        {
          "id": "abdominal_us_4",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the complete thoracic, abdominal, and pelvic staging assessment needed."
        },
        {
          "id": "pelvic_mri_4",
          "label": "Pelvic MRI alone",
          "isCorrect": false,
          "distractorRationale": "Pelvic MRI alone omits chest and abdominal staging and is not the standard complete study for colon cancer."
        }
      ],
      "explanation": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging"
      ],
      "teachingPoint": "Contrast-enhanced CT of the chest, abdomen, and pelvis provides standard preoperative cross-sectional staging for confirmed colon cancer."
    }
  },
  {
    "id": "revision.qq20261102.b17",
    "auditId": "B17",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v1",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "With clinically negative regional nodes, which staging discussion should accompany {patientName}'s definitive wide-excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy with definitive excision",
      "Complete regional lymph-node dissection with definitive excision",
      "Regional nodal ultrasound surveillance with definitive excision",
      "Clinical nodal follow-up with definitive excision"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousPresentation": "{patientName} has a small accessible pigmented lesion on the upper back that has evolved in color and border. It is superficial and can be removed completely; regional nodes are not palpable, and no diagnosis has been made.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.female.46",
        "presentation": "{patientName} has a small accessible pigmented lesion on the upper back that has evolved in color and border. It is superficial and can be removed completely; regional nodes are not palpable, and no diagnosis has been made."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.male.46",
        "presentation": "{patientName} has a small accessible pigmented lesion on the upper back that has evolved in color and border. It is superficial and can be removed completely; regional nodes are not palpable, and no diagnosis has been made."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.female.51",
        "presentation": "{patientName} has a small accessible pigmented lesion on the upper back that has evolved in color and border. It is superficial and can be removed completely; regional nodes are not palpable, and no diagnosis has been made."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.male.51",
        "presentation": "{patientName} has a small accessible pigmented lesion on the upper back that has evolved in color and border. It is superficial and can be removed completely; regional nodes are not palpable, and no diagnosis has been made."
      }
    ],
    "currentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.4 mm. No enlarged nodes are felt in the draining basin.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Apply the measured invasion depth and nodal examination to the regional-node strategy.",
    "reviewerNotes": "Existing Breslow measurements are retained. Confirm the staging indication and consent discussion; diagnosis is appropriately supplied because this is a management task.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_1": "sentinel_node_1",
      "choice.qq20261102.b17.d1": "complete_dissection_1",
      "choice.qq20261102.b17.d2": "imaging_only_1"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove definitive and clinically-negative principle wording from the task, shorten all options to parallel node strategies, and retain the decision-critical biopsy measurement and examination."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v1.r2",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
      "answerChoices": [
        {
          "id": "sentinel_node_1",
          "label": "Sentinel lymph-node biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains regional pathologic staging for the supplied invasive melanoma thickness and nonpalpable nodes."
        },
        {
          "id": "choice.qq20261102.b17.d1",
          "label": "Lymph-node ultrasound surveillance",
          "isCorrect": false,
          "distractorRationale": "Can evaluate or follow nodes in selected settings, but does not provide the same pathologic sentinel-node staging here."
        },
        {
          "id": "choice.qq20261102.b17.d2",
          "label": "Complete lymph-node dissection",
          "isCorrect": false,
          "distractorRationale": "Extends nodal surgery beyond the initial staging step for clinically uninvolved nodes."
        }
      ],
      "explanation": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.pigmented-skin-lesion.changing-back-lesion",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.changing-back-lesion",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b17-context",
    "auditId": "B17-context",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which initial tissue-diagnosis approach best fits {patientName}'s lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "resultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.4 mm. No enlarged nodes are felt in the draining basin.",
    "previousResultNarrative": "Complete biopsy shows invasive melanoma with a measured thickness of 1.4 mm with adequate histologic microstaging.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation and returned histology; keep the diagnostic-biopsy choices, key and service contract. Replace repetitive procedural wording in feedback with a neutral specimen-to-result transition."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r2",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_1",
          "label": "Complete excisional biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A small accessible lesion concerning for melanoma is usually removed completely with narrow clinical margins and enough depth for histologic microstaging. Selected large or difficult lesions can require a different biopsy approach."
        },
        {
          "id": "superficial_shave_1",
          "label": "Superficial shave biopsy",
          "isCorrect": false,
          "distractorRationale": "A superficial sample can truncate the lesion and compromise microstaging."
        },
        {
          "id": "partial_punch_1",
          "label": "Partial punch biopsy",
          "isCorrect": false,
          "distractorRationale": "The small accessible lesion can be completely sampled rather than selecting one potentially unrepresentative edge."
        },
        {
          "id": "wide_excision_1",
          "label": "Definitive wide local excision",
          "isCorrect": false,
          "distractorRationale": "Diagnostic microstaging should guide definitive planning rather than beginning with an unselected wide excision."
        }
      ],
      "explanation": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care."
    }
  },
  {
    "id": "revision.qq20261102.b18",
    "auditId": "B18",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v3",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "With clinically negative regional nodes, which staging discussion should accompany {patientName}'s definitive wide-excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy with definitive excision",
      "Complete regional lymph-node dissection with definitive excision",
      "Regional nodal ultrasound surveillance with definitive excision",
      "Clinical nodal follow-up with definitive excision"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousPresentation": "{patientName} reports evolution of a small accessible pigmented calf lesion with asymmetric color. The entire lesion can be sampled locally, and regional nodal examination is clinically negative.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.female.39",
        "presentation": "{patientName} reports evolution of a small accessible pigmented calf lesion with asymmetric color. The entire lesion can be sampled locally, and regional nodal examination is clinically negative."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.male.39",
        "presentation": "{patientName} reports evolution of a small accessible pigmented calf lesion with asymmetric color. The entire lesion can be sampled locally, and regional nodal examination is clinically negative."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.female.44",
        "presentation": "{patientName} reports evolution of a small accessible pigmented calf lesion with asymmetric color. The entire lesion can be sampled locally, and regional nodal examination is clinically negative."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.male.44",
        "presentation": "{patientName} reports evolution of a small accessible pigmented calf lesion with asymmetric color. The entire lesion can be sampled locally, and regional nodal examination is clinically negative."
      }
    ],
    "currentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.8 mm. No enlarged nodes are felt in the draining basin.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Apply the measured invasion depth and nodal examination to the regional-node strategy.",
    "reviewerNotes": "Existing Breslow measurements are retained. Confirm the staging indication and consent discussion; diagnosis is appropriately supplied because this is a management task.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_3": "sentinel_node_3",
      "choice.qq20261102.b18.d1": "complete_dissection_3",
      "choice.qq20261102.b18.d2": "imaging_only_3"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove definitive and clinically-negative principle wording from the task, shorten all options to parallel node strategies, and retain the decision-critical biopsy measurement and examination."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v3.r2",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
      "answerChoices": [
        {
          "id": "sentinel_node_3",
          "label": "Sentinel lymph-node biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains regional pathologic staging for the supplied invasive melanoma thickness and nonpalpable nodes."
        },
        {
          "id": "choice.qq20261102.b18.d1",
          "label": "Lymph-node ultrasound surveillance",
          "isCorrect": false,
          "distractorRationale": "Can evaluate or follow nodes in selected settings, but does not provide the same pathologic sentinel-node staging here."
        },
        {
          "id": "choice.qq20261102.b18.d2",
          "label": "Complete lymph-node dissection",
          "isCorrect": false,
          "distractorRationale": "Extends nodal surgery beyond the initial staging step for clinically uninvolved nodes."
        }
      ],
      "explanation": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The supplied melanoma thickness and nodal examination support discussion of sentinel-node biopsy with excision planning. This does not imply automatic completion dissection or a guaranteed survival benefit."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.pigmented-skin-lesion.calf-growth",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.calf-growth",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 39,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b18-context",
    "auditId": "B18-context",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-10.1"
    ],
    "previousStem": "Which initial tissue-diagnosis approach best fits {patientName}'s lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "resultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.8 mm. No enlarged nodes are felt in the draining basin.",
    "previousResultNarrative": "Complete biopsy shows invasive melanoma with a measured thickness of 1.8 mm with adequate histologic microstaging.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation and returned histology; keep the diagnostic-biopsy choices, key and service contract. Replace repetitive procedural wording in feedback with a neutral specimen-to-result transition."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r2",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_3",
          "label": "Complete excisional biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A small accessible lesion concerning for melanoma is usually removed completely with narrow clinical margins and enough depth for histologic microstaging. Selected large or difficult lesions can require a different biopsy approach."
        },
        {
          "id": "superficial_shave_3",
          "label": "Superficial shave biopsy",
          "isCorrect": false,
          "distractorRationale": "A superficial sample can truncate the lesion and compromise microstaging."
        },
        {
          "id": "partial_punch_3",
          "label": "Partial punch biopsy",
          "isCorrect": false,
          "distractorRationale": "The small accessible lesion can be completely sampled rather than selecting one potentially unrepresentative edge."
        },
        {
          "id": "wide_excision_3",
          "label": "Definitive wide local excision",
          "isCorrect": false,
          "distractorRationale": "Diagnostic microstaging should guide definitive planning rather than beginning with an unselected wide excision."
        }
      ],
      "explanation": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
      ],
      "teachingPoint": "The tissue specimen permits measurement of tumour depth and review of the excision. Use the returned histology when planning subsequent care."
    }
  },
  {
    "id": "revision.qq20261102.b19",
    "auditId": "B19",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "previousQuestionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-09.1"
    ],
    "previousStem": "Which tissue-diagnosis plan best protects the patient's later definitive treatment options?",
    "previousChoiceLabels": [
      "Sarcoma-team-planned image-guided core biopsy",
      "Office excision of the mass",
      "Fine-needle aspiration before specialist referral",
      "Incisional biopsy before sarcoma-center review"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
    "previousPresentation": "{patientName} has noticed a deep thigh mass enlarging over several months. Examination confirms a firm deep lesion; they have no acute neurovascular symptoms.",
    "previousProfilePresentations": [
      {
        "id": "profile.soft-tissue-mass.deep-thigh.female.39",
        "presentation": "{patientName} has noticed a deep thigh mass enlarging over several months. Examination confirms a firm deep lesion; they have no acute neurovascular symptoms."
      },
      {
        "id": "profile.soft-tissue-mass.deep-thigh.male.39",
        "presentation": "{patientName} has noticed a deep thigh mass enlarging over several months. Examination confirms a firm deep lesion; they have no acute neurovascular symptoms."
      },
      {
        "id": "profile.soft-tissue-mass.deep-thigh.female.43",
        "presentation": "{patientName} has noticed a deep thigh mass enlarging over several months. Examination confirms a firm deep lesion; they have no acute neurovascular symptoms."
      },
      {
        "id": "profile.soft-tissue-mass.deep-thigh.male.43",
        "presentation": "{patientName} has noticed a deep thigh mass enlarging over several months. Examination confirms a firm deep lesion; they have no acute neurovascular symptoms."
      }
    ],
    "currentUpdate": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate depth, growth and the MRI appearance when selecting both a sampling method and the service that plans it.",
    "reviewerNotes": "Confirm the raw MRI description and biopsy alternatives are credible. The task no longer names the need to protect later treatment as a decision principle.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sarcoma_core_1": "sarcoma_core_1",
      "choice.qq20261102.b19.d1": "random_fna_1",
      "choice.qq20261102.b19.d2": "office_excision_1"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the pre-answer aggressive-tumor interpretation and treatment-protection task with observations and a neutral task. Make all three options comparable biopsy/service plans."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r2",
      "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
      "stem": "Which tissue-diagnosis plan should be arranged for {patientName}'s limb mass?",
      "answerChoices": [
        {
          "id": "sarcoma_core_1",
          "label": "Image-guided core biopsy through a sarcoma service",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Combines adequate tissue sampling with specialist planning of the biopsy route before a potentially malignant mass is disrupted."
        },
        {
          "id": "choice.qq20261102.b19.d1",
          "label": "Needle aspiration through a general radiology service",
          "isCorrect": false,
          "distractorRationale": "Offers sampling but does not provide the planned core-tissue approach expected for the supplied suspicious deep mass."
        },
        {
          "id": "choice.qq20261102.b19.d2",
          "label": "Excisional biopsy through an outpatient surgery service",
          "isCorrect": false,
          "distractorRationale": "Risks an unplanned removal before the mass and future operative approach have been coordinated."
        }
      ],
      "explanation": "A suspicious deep mass should reach an experienced sarcoma service before biopsy. A planned image-guided core biopsy supports tissue diagnosis and an appropriate tract; MRI alone is not histologic proof.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.planned-biopsy",
        "claim.soft-tissue-mass.mri"
      ],
      "teachingPoint": "A suspicious deep mass should reach an experienced sarcoma service before biopsy. A planned image-guided core biopsy supports tissue diagnosis and an appropriate tract; MRI alone is not histologic proof."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.soft-tissue-mass.deep-thigh",
        "patientPresentationVariantId": "presentation.soft-tissue-mass.deep-thigh",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Enlarging limb mass",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 39,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b19-context",
    "auditId": "B19-context",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v1",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-09.1"
    ],
    "previousStem": "Which imaging study best characterizes this mass locally before tissue sampling?",
    "previousChoiceLabels": [
      "Dedicated MRI of the involved extremity",
      "Focused ultrasound of the mass",
      "Plain radiographs of the involved extremity",
      "Noncontrast CT of the involved extremity"
    ],
    "resultNarrative": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "previousResultNarrative": "Extremity MRI defines the lesion's local extent and shows features concerning for an aggressive soft-tissue tumor. Imaging is suspicious but does not establish a histologic diagnosis.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v1.r2",
      "conceptId": "concept.soft-tissue-mass.extremity-mri",
      "stem": "Which imaging study should characterize {patientName}'s limb mass before tissue sampling?",
      "answerChoices": [
        {
          "id": "extremity_mri_1",
          "label": "Dedicated MRI of the involved extremity",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis."
        },
        {
          "id": "repeat_ultrasound_1",
          "label": "Focused ultrasound of the mass",
          "isCorrect": false,
          "distractorRationale": "Ultrasound has already been indeterminate or the lesion is deep and enlarging."
        },
        {
          "id": "plain_radiograph_1",
          "label": "Plain radiographs of the involved extremity",
          "isCorrect": false,
          "distractorRationale": "Radiographs can show bone or mineralization but do not provide the needed soft-tissue characterization."
        },
        {
          "id": "noncontrast_ct_1",
          "label": "Noncontrast CT of the involved extremity",
          "isCorrect": false,
          "distractorRationale": "CT is not the preferred local soft-tissue characterization study in this scenario."
        }
      ],
      "explanation": "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri"
      ],
      "teachingPoint": "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis."
    }
  },
  {
    "id": "revision.qq20261102.b20",
    "auditId": "B20",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "previousQuestionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-09.1"
    ],
    "previousStem": "Which tissue-diagnosis plan best protects the patient's later definitive treatment options?",
    "previousChoiceLabels": [
      "Sarcoma-team-planned image-guided core biopsy",
      "Office excision of the mass",
      "Fine-needle aspiration before specialist referral",
      "Incisional biopsy before sarcoma-center review"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
    "previousPresentation": "{patientName} reports an upper-arm mass that has enlarged. Ultrasound could not confidently characterize its full extent, and they remain clinically stable.",
    "previousProfilePresentations": [
      {
        "id": "profile.soft-tissue-mass.upper-arm.female.52",
        "presentation": "{patientName} reports an upper-arm mass that has enlarged. Ultrasound could not confidently characterize its full extent, and they remain clinically stable."
      },
      {
        "id": "profile.soft-tissue-mass.upper-arm.male.52",
        "presentation": "{patientName} reports an upper-arm mass that has enlarged. Ultrasound could not confidently characterize its full extent, and they remain clinically stable."
      },
      {
        "id": "profile.soft-tissue-mass.upper-arm.female.56",
        "presentation": "{patientName} reports an upper-arm mass that has enlarged. Ultrasound could not confidently characterize its full extent, and they remain clinically stable."
      },
      {
        "id": "profile.soft-tissue-mass.upper-arm.male.56",
        "presentation": "{patientName} reports an upper-arm mass that has enlarged. Ultrasound could not confidently characterize its full extent, and they remain clinically stable."
      }
    ],
    "currentUpdate": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate depth, growth and the MRI appearance when selecting both a sampling method and the service that plans it.",
    "reviewerNotes": "Confirm the raw MRI description and biopsy alternatives are credible. The task no longer names the need to protect later treatment as a decision principle.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sarcoma_core_2": "sarcoma_core_2",
      "choice.qq20261102.b20.d1": "random_fna_2",
      "choice.qq20261102.b20.d2": "office_excision_2"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the pre-answer aggressive-tumor interpretation and treatment-protection task with observations and a neutral task. Make all three options comparable biopsy/service plans."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r2",
      "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
      "stem": "Which tissue-diagnosis plan should be arranged for {patientName}'s limb mass?",
      "answerChoices": [
        {
          "id": "sarcoma_core_2",
          "label": "Image-guided core biopsy through a sarcoma service",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Combines adequate tissue sampling with specialist planning of the biopsy route before a potentially malignant mass is disrupted."
        },
        {
          "id": "choice.qq20261102.b20.d1",
          "label": "Needle aspiration through a general radiology service",
          "isCorrect": false,
          "distractorRationale": "Offers sampling but does not provide the planned core-tissue approach expected for the supplied suspicious deep mass."
        },
        {
          "id": "choice.qq20261102.b20.d2",
          "label": "Excisional biopsy through an outpatient surgery service",
          "isCorrect": false,
          "distractorRationale": "Risks an unplanned removal before the mass and future operative approach have been coordinated."
        }
      ],
      "explanation": "A suspicious deep mass should reach an experienced sarcoma service before biopsy. A planned image-guided core biopsy supports tissue diagnosis and an appropriate tract; MRI alone is not histologic proof.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.planned-biopsy",
        "claim.soft-tissue-mass.mri"
      ],
      "teachingPoint": "A suspicious deep mass should reach an experienced sarcoma service before biopsy. A planned image-guided core biopsy supports tissue diagnosis and an appropriate tract; MRI alone is not histologic proof."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.soft-tissue-mass.upper-arm",
        "patientPresentationVariantId": "presentation.soft-tissue-mass.upper-arm",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Enlarging limb mass",
        "revisedFields": [
          "chiefComplaint"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 52,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b20-context",
    "auditId": "B20-context",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v2",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-09.1"
    ],
    "previousStem": "Which imaging study best characterizes this mass locally before tissue sampling?",
    "previousChoiceLabels": [
      "Dedicated MRI of the involved extremity",
      "Focused ultrasound of the mass",
      "Plain radiographs of the involved extremity",
      "Noncontrast CT of the involved extremity"
    ],
    "resultNarrative": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "previousResultNarrative": "Extremity MRI defines the lesion's local extent and shows features concerning for an aggressive soft-tissue tumor. Imaging is suspicious but does not establish a histologic diagnosis.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v2.r2",
      "conceptId": "concept.soft-tissue-mass.extremity-mri",
      "stem": "Which imaging study should characterize {patientName}'s limb mass before tissue sampling?",
      "answerChoices": [
        {
          "id": "extremity_mri_2",
          "label": "Dedicated MRI of the involved extremity",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis."
        },
        {
          "id": "repeat_ultrasound_2",
          "label": "Focused ultrasound of the mass",
          "isCorrect": false,
          "distractorRationale": "Ultrasound has already been indeterminate or the lesion is deep and enlarging."
        },
        {
          "id": "plain_radiograph_2",
          "label": "Plain radiographs of the involved extremity",
          "isCorrect": false,
          "distractorRationale": "Radiographs can show bone or mineralization but do not provide the needed soft-tissue characterization."
        },
        {
          "id": "noncontrast_ct_2",
          "label": "Noncontrast CT of the involved extremity",
          "isCorrect": false,
          "distractorRationale": "CT is not the preferred local soft-tissue characterization study in this scenario."
        }
      ],
      "explanation": "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri"
      ],
      "teachingPoint": "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis."
    }
  },
  {
    "id": "revision.qq20261102.b21",
    "auditId": "B21",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.management.patient-to-plan.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.management.patient-to-plan.v1",
    "questionVariantId": "question.colonic-lipoma.management.patient-to-plan.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-034.2026-08-06.1"
    ],
    "previousStem": "What is the most appropriate lipoma-directed plan?",
    "previousChoiceLabels": [
      "No lipoma-directed removal or dedicated surveillance; continue ordinary follow-up based on the rest of the colonoscopy and the patient's usual indications",
      "Immediate endoscopic resection solely because the lesion was found",
      "Annual colonoscopy solely to monitor the lipoma",
      "Segmental colectomy"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.",
    "previousPresentation": "During {patientName}'s routine colonoscopy, the endoscopist finds a smooth subepithelial lesion with normal overlying mucosa and a faint yellow hue. It feels soft, indents with gentle pressure from closed biopsy forceps, and then regains its shape.",
    "previousProfilePresentations": [],
    "currentUpdate": "{patientName} reports unchanged bowel habits and has not noticed pain or rectal bleeding.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the observed lesion phenotype and incidental history to separate ordinary screening from lesion-directed treatment or surveillance.",
    "reviewerNotes": "Confirm the phenotype is sufficient to characterize the lesion. Symptom history is needed for management; avoid deleting it as a generic negative.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "no_directed_treatment_or_surveillance": "no_directed_treatment_or_surveillance",
      "choice.qq20261102.b21.d1": "annual_colonoscopy_for_lipoma",
      "choice.qq20261102.b21.d2": "immediate_endoscopic_resection"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the diagnostic-certainty summary, explanatory option qualifiers and operation filler. Three concise, parallel follow-up strategies replace the long unique key."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.management.patient-to-plan.v1.r2",
      "conceptId": "concept.colonic-lipoma.asymptomatic-management",
      "stem": "Which lesion-directed follow-up plan should be recommended for {patientName}?",
      "answerChoices": [
        {
          "id": "no_directed_treatment_or_surveillance",
          "label": "Continue ordinary screening",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Keeps ordinary screening and other indications separate from unnecessary dedicated follow-up for a clearly characterized asymptomatic lipoma."
        },
        {
          "id": "choice.qq20261102.b21.d1",
          "label": "Schedule lesion surveillance",
          "isCorrect": false,
          "distractorRationale": "Adds dedicated follow-up to a characteristic asymptomatic lesion without a supplied feature that changes that pathway."
        },
        {
          "id": "choice.qq20261102.b21.d2",
          "label": "Arrange endoscopic removal",
          "isCorrect": false,
          "distractorRationale": "Treats discovery alone as an indication for removal rather than using symptoms or diagnostic uncertainty."
        }
      ],
      "explanation": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
        "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway"
      ],
      "teachingPoint": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.colonic-lipoma.direct.typical-a",
        "patientPresentationVariantId": "presentation.colonic-lipoma.direct.typical-a",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Colonic lesion",
        "revisedPresentation": "During {patientName}'s routine colonoscopy, the endoscopist finds a smooth subepithelial lesion with normal overlying mucosa and a faint yellow hue. It feels soft, indents with gentle pressure from closed biopsy forceps, and then regains its shape.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b21-context",
    "auditId": "B21-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-034.2026-08-06.1"
    ],
    "previousStem": "What is the most likely diagnosis?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Adenomatous polyp",
      "Colonic neuroendocrine tumor",
      "Gastrointestinal stromal tumor"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r2",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "stem": "Which diagnosis best explains {patientName}'s colonic lesion at endoscopy?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Colonic lipoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A soft, yellowish subepithelial lesion that indents and rebounds demonstrates a characteristic cushion or pillow-sign phenotype that strongly supports colonic lipoma."
        },
        {
          "id": "adenomatous_polyp",
          "label": "Adenomatous polyp",
          "isCorrect": false,
          "distractorRationale": "This does not match the approved soft subepithelial cushion-sign phenotype."
        },
        {
          "id": "colonic_neuroendocrine_tumor",
          "label": "Colonic neuroendocrine tumor",
          "isCorrect": false,
          "distractorRationale": "A neuroendocrine tumor is not identified by the approved combination of a soft yellowish lesion and positive cushion sign."
        },
        {
          "id": "gastrointestinal_stromal_tumor",
          "label": "Gastrointestinal stromal tumor",
          "isCorrect": false,
          "distractorRationale": "This does not match the approved soft deformable lipoma phenotype."
        }
      ],
      "explanation": "A soft, yellowish subepithelial lesion that indents and rebounds demonstrates a characteristic cushion or pillow-sign phenotype that strongly supports colonic lipoma.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype"
      ],
      "teachingPoint": "A soft, yellowish subepithelial lesion that indents and rebounds demonstrates a characteristic cushion or pillow-sign phenotype that strongly supports colonic lipoma."
    }
  },
  {
    "id": "revision.qq20261102.b22",
    "auditId": "B22",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.management.patient-to-plan.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.management.patient-to-plan.v2",
    "questionVariantId": "question.colonic-lipoma.management.patient-to-plan.v2.r2",
    "previousContentVersions": [
      "clinical.owner-row-034.2026-08-06.1"
    ],
    "previousStem": "What should you recommend for this lesion?",
    "previousChoiceLabels": [
      "No lesion-specific treatment or surveillance",
      "Endoscopic ultrasound with tissue acquisition despite the characteristic appearance",
      "Endoscopic removal solely because the lesion was found",
      "Elective segmental colectomy"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.",
    "previousPresentation": "{patientName}, an asymptomatic patient, has a rounded colonic lesion beneath normal-appearing mucosa. Gentle probing produces a temporary indentation, and the lesion returns to its original contour when pressure is released.",
    "previousProfilePresentations": [],
    "currentUpdate": "{patientName} reports unchanged bowel habits and has not noticed pain or rectal bleeding.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the observed lesion phenotype and incidental history to separate ordinary screening from lesion-directed treatment or surveillance.",
    "reviewerNotes": "Confirm the phenotype is sufficient to characterize the lesion. Symptom history is needed for management; avoid deleting it as a generic negative.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "no_lesion_specific_follow_up": "no_lesion_specific_follow_up",
      "choice.qq20261102.b22.d1": "eus_with_tissue_acquisition",
      "choice.qq20261102.b22.d2": "remove_solely_because_found"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the diagnostic-certainty summary, explanatory option qualifiers and operation filler. Three concise, parallel follow-up strategies replace the long unique key."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.management.patient-to-plan.v2.r2",
      "conceptId": "concept.colonic-lipoma.asymptomatic-management",
      "stem": "Which lesion-directed follow-up plan should be recommended for {patientName}?",
      "answerChoices": [
        {
          "id": "no_lesion_specific_follow_up",
          "label": "Continue ordinary screening",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Keeps ordinary screening and other indications separate from unnecessary dedicated follow-up for a clearly characterized asymptomatic lipoma."
        },
        {
          "id": "choice.qq20261102.b22.d1",
          "label": "Arrange endoscopic ultrasound",
          "isCorrect": false,
          "distractorRationale": "Adds characterization of an already characteristic lesion; it is a credible investigation when the diagnosis is uncertain, rather than routine care for the supplied appearance."
        },
        {
          "id": "choice.qq20261102.b22.d2",
          "label": "Arrange endoscopic removal",
          "isCorrect": false,
          "distractorRationale": "Treats discovery alone as an indication for removal rather than using symptoms or diagnostic uncertainty."
        }
      ],
      "explanation": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
        "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway"
      ],
      "teachingPoint": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.colonic-lipoma.direct.typical-b",
        "patientPresentationVariantId": "presentation.colonic-lipoma.direct.typical-b",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Colonic lesion",
        "revisedPresentation": "{patientName}, an asymptomatic patient, has a rounded colonic lesion beneath normal-appearing mucosa. Gentle probing produces a temporary indentation, and the lesion returns to its original contour when pressure is released.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b22-context",
    "auditId": "B22-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r2",
    "previousContentVersions": [
      "clinical.owner-row-034.2026-08-06.1"
    ],
    "previousStem": "Which diagnosis best fits this endoscopic appearance?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Colonic adenocarcinoma",
      "Inflammatory polyp",
      "Colonic neuroendocrine tumor"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r2",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "stem": "Which diagnosis best explains {patientName}'s colonic lesion at endoscopy?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Colonic lipoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The soft, deformable subepithelial appearance with shape recovery is most consistent with a lipoma."
        },
        {
          "id": "colonic_adenocarcinoma",
          "label": "Colonic adenocarcinoma",
          "isCorrect": false,
          "distractorRationale": "This does not match the approved smooth, soft subepithelial phenotype."
        },
        {
          "id": "inflammatory_polyp",
          "label": "Inflammatory polyp",
          "isCorrect": false,
          "distractorRationale": "This does not match the approved deformable subepithelial phenotype."
        },
        {
          "id": "colonic_neuroendocrine_tumor",
          "label": "Colonic neuroendocrine tumor",
          "isCorrect": false,
          "distractorRationale": "This is not the best match for the approved soft lesion with shape recovery after pressure."
        }
      ],
      "explanation": "The soft, deformable subepithelial appearance with shape recovery is most consistent with a lipoma.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype"
      ],
      "teachingPoint": "The soft, deformable subepithelial appearance with shape recovery is most consistent with a lipoma."
    }
  },
  {
    "id": "revision.qq20261102.b23",
    "auditId": "B23",
    "caseId": "case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "nodeId": "node.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "previousQuestionVariantId": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "questionVariantId": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-042.2026-08-06.1"
    ],
    "previousStem": "What should the operative referral recommend regarding the spleen?",
    "previousChoiceLabels": [
      "Add splenectomy to every total gastrectomy",
      "Avoid routine prophylactic splenectomy",
      "Add splenectomy for proximal location alone",
      "Add splenectomy solely to increase node yield"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic before planned gastrectomy for proximal gastric adenocarcinoma. Endoscopy places the tumor on the lesser-curvature side. CT shows maintained tissue planes between the tumor, pancreas and spleen, with no enlarged splenic-hilar nodes.",
    "previousPresentation": "{patientName} has resectable proximal gastric adenocarcinoma. Staging shows no greater-curvature extension, splenic invasion, or suspicious splenic-hilar nodes. Curative gastrectomy is planned.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Translate tumor location and maintained tissue planes into an operative extent rather than choosing an option labelled prophylactic or routine.",
    "reviewerNotes": "Confirm these operative competitors are plausible. The contradictory 2025 English hilar-node recommendation is recorded separately and is not taught or tested.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "avoid_routine_prophylactic_splenectomy": "avoid_routine_prophylactic_splenectomy",
      "choice.qq20261102.b23.d1": "splenectomy_every_total_gastrectomy",
      "choice.qq20261102.b23.d2": "splenectomy_for_proximal_location"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace three one-sided rationalizations for splenectomy with equal-length operative plans. Use concrete location/tissue-plane findings. Do not introduce a disputed hilar-node teaching point."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r2",
      "conceptId": "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance",
      "stem": "Which operative plan should be recommended for {patientName}'s gastric cancer?",
      "answerChoices": [
        {
          "id": "avoid_routine_prophylactic_splenectomy",
          "label": "Gastrectomy preserving pancreas and spleen",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Avoids routine removal of uninvolved adjacent organs for the supplied tumor location and tissue planes."
        },
        {
          "id": "choice.qq20261102.b23.d1",
          "label": "Gastrectomy preserving pancreas, removing spleen",
          "isCorrect": false,
          "distractorRationale": "Applies prophylactic splenectomy despite the absence of a supplied invasion-related indication."
        },
        {
          "id": "choice.qq20261102.b23.d2",
          "label": "Gastrectomy removing pancreas and spleen",
          "isCorrect": false,
          "distractorRationale": "Extends adjacent-organ removal even further without the stated findings justifying it."
        }
      ],
      "explanation": "The supplied findings support spleen preservation during the planned gastrectomy. Routine prophylactic splenectomy adds morbidity without a survival benefit in the relevant population. Adjacent-organ invasion or other disease can change planning.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit",
        "claim.gastric-adenocarcinoma.prophylactic-splenectomy-increased-morbidity",
        "claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary",
        "claim.qq20261102.gastric-adjacent-organ-scope"
      ],
      "teachingPoint": "The supplied findings support spleen preservation during the planned gastrectomy. Routine prophylactic splenectomy adds morbidity without a survival benefit in the relevant population. Adjacent-organ invasion or other disease can change planning."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
        "patientPresentationVariantId": "presentation.gastric-adenocarcinoma.post-endoscopy-splenic-referral",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Gastric cancer surgery",
        "revisedPresentation": "{patientName} has resectable proximal gastric adenocarcinoma. Staging shows no greater-curvature extension, splenic invasion, or suspicious splenic-hilar nodes. Curative gastrectomy is planned.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b24",
    "auditId": "B24",
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "previousQuestionVariantId": "question.gastric-malt.cd20-alone-boundary.v1",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-039.2026-08-06.1"
    ],
    "previousStem": "How should the CD20 result be interpreted?",
    "previousChoiceLabels": [
      "CD20 confirms B-cell lineage, not MALT lymphoma by itself",
      "CD20 alone confirms gastric MALT lymphoma even without diagnostic morphology",
      "CD20 positivity proves diffuse large B-cell lymphoma regardless of cell size",
      "CD20 positivity proves the infiltrate is reactive and excludes lymphoma"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia. The fragments contain crushed lymphoid cells, many of which stain for CD20; gland architecture cannot be assessed in the fragments.",
    "previousPresentation": "{patientName}'s limited gastric biopsy, obtained during evaluation for dyspepsia, contains many CD20-positive lymphocytes, but the specimen lacks convincing lymphoepithelial lesions and other diagnostic morphology.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish a lineage finding from a supported lymphoma diagnosis in a limited specimen.",
    "reviewerNotes": "Confirm that the sample is genuinely insufficient and that the three pathology interpretations are natural alternatives; no diagnosis is being withheld that the supplied data could establish.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "lineage_not_diagnosis": "lineage_not_diagnosis",
      "choice.qq20261102.b24.d1": "cd20_confirms_malt",
      "choice.qq20261102.b24.d2": "cd20_confirms_dlbcl"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace explanations and absolutes in options with short pathology interpretations. Show the specimen limitation rather than an author statement that diagnostic morphology is unconvincing."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.cd20-alone-boundary.v1.r2",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which pathology interpretation is supported by {patientName}'s gastric specimen?",
      "answerChoices": [
        {
          "id": "lineage_not_diagnosis",
          "label": "B-cell infiltrate of undetermined significance",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Recognizes lineage while withholding a lymphoma subtype that the limited morphology cannot establish."
        },
        {
          "id": "choice.qq20261102.b24.d1",
          "label": "Extranodal marginal-zone B-cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "Treats a B-cell marker as sufficient for the specific gastric lymphoma diagnosis."
        },
        {
          "id": "choice.qq20261102.b24.d2",
          "label": "Diffuse large B-cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "Infers a specific large-cell malignancy without diagnostic cell morphology or an adequate integrated assessment."
        }
      ],
      "explanation": "CD20 supports B-cell lineage. A lymphoma diagnosis and subtype require integration with interpretable morphology and the relevant additional evaluation; this limited sample does not establish a particular lymphoma.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition"
      ],
      "teachingPoint": "CD20 supports B-cell lineage. A lymphoma diagnosis and subtype require integration with interpretable morphology and the relevant additional evaluation; this limited sample does not establish a particular lymphoma."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.gastric-malt.cd20-boundary.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.cd20-alone-boundary",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}'s limited gastric biopsy, obtained during evaluation for dyspepsia, contains many CD20-positive lymphocytes, but the specimen lacks convincing lymphoepithelial lesions and other diagnostic morphology.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b25",
    "auditId": "B25",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.eradication-response-reassessment.v1",
    "previousQuestionVariantId": "question.gastric-malt.eradication-response-reassessment.v1",
    "questionVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-039.2026-08-06.1"
    ],
    "previousStem": "Which explanation best describes the treatment pathway?",
    "previousChoiceLabels": [
      "Eradicate H. pylori first, then reassess the lymphoma response",
      "Because CD20 is positive, begin rituximab before addressing H. pylori",
      "Any CD20-positive gastric lymphoma can be treated with eradication alone",
      "Gastrectomy is required before response can be assessed endoscopically"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after EGD for epigastric discomfort. Gastric biopsy morphology and immunostains have been reviewed together.",
    "previousPresentation": "{patientName}, an adult with epigastric discomfort, has an abnormal gastric biopsy after EGD. The pathologist is comparing the morphology and immunophenotype with common gastric malignancies.",
    "previousProfilePresentations": [],
    "currentUpdate": "The pathology review identifies low-grade gastric MALT lymphoma. H. pylori testing is positive, and staging confines the disease to the stomach.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose a coherent initial treatment and response-assessment plan rather than inferring treatment from CD20 or relying only on symptoms.",
    "reviewerNotes": "This is a future care-plan discussion, retaining the existing no-order contract. Clinician confirms eradication and reassessment scope; no exact antibiotic regimen or follow-up interval is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "eradicate_and_reassess": "eradicate_and_reassess",
      "choice.qq20261102.b25.d1": "rituximab_due_cd20",
      "choice.qq20261102.b25.d2": "all_cd20_eradication_only"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace because/any/required option teaching with three parallel care plans; supply the diagnosed stage and infection because management, rather than diagnosis, is the target."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.eradication-response-reassessment.v1.r2",
      "conceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      "stem": "Which treatment-and-review plan is appropriate for {patientName}'s localized gastric lymphoma?",
      "answerChoices": [
        {
          "id": "eradicate_and_reassess",
          "label": "Eradication with planned histologic response assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treats the infection-linked localized lymphoma and retains assessment of the lymphoma response rather than equating the medication course with completed care."
        },
        {
          "id": "choice.qq20261102.b25.d1",
          "label": "Rituximab with planned radiological response assessment",
          "isCorrect": false,
          "distractorRationale": "Overweights the B-cell marker and replaces the indicated initial infection-directed approach and gastric tissue reassessment."
        },
        {
          "id": "choice.qq20261102.b25.d2",
          "label": "Antibiotics with symptom-triggered clinical follow-up",
          "isCorrect": false,
          "distractorRationale": "Treats clinical improvement or completion of medication as an adequate substitute for assessing the lymphoma response."
        }
      ],
      "explanation": "For the supplied localized H. pylori-positive gastric MALT lymphoma, eradication is initial treatment and must be followed by confirmation of infection clearance and endoscopic/histologic response assessment. Regression can be delayed; progression or transformation changes the pathway.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.hpylori-eradication-initial-localized",
        "claim.gastric-malt.eradication-confirmation-and-response-reassessment",
        "claim.gastric-malt.progression-and-transformation-boundary"
      ],
      "teachingPoint": "For the supplied localized H. pylori-positive gastric MALT lymphoma, eradication is initial treatment and must be followed by confirmation of infection clearance and endoscopic/histologic response assessment. Regression can be delayed; progression or transformation changes the pathway."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.gastric-malt.profile-to-followup-boundary.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.pathology-profile-selection",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, an adult with epigastric discomfort, has an abnormal gastric biopsy after EGD. The pathologist is comparing the morphology and immunophenotype with common gastric malignancies.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b25-context",
    "auditId": "B25-context",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.pathology-profile-selection.v1",
    "previousQuestionVariantId": "question.gastric-malt.pathology-profile-selection.v1",
    "questionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-039.2026-08-06.1"
    ],
    "previousStem": "Which pathologic profile most strongly supports gastric MALT lymphoma?",
    "previousChoiceLabels": [
      "Small CD20-positive B cells forming lymphoepithelial lesions; CD5, CD10, and cyclin D1 absent",
      "Sheets of large CD20-positive cells with brisk proliferation, destructive growth, and no dominant small-cell infiltrate",
      "Cytokeratin-positive signet-ring cells infiltrating the gastric wall with a prominent desmoplastic stromal response",
      "Small CD5- and cyclin D1-positive B cells expanding the mucosa in a pattern compatible with mantle cell lymphoma"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.pathology-profile-selection.v1.r2",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which gastric biopsy profile supports MALT lymphoma in {patientName}'s pathology review?",
      "answerChoices": [
        {
          "id": "small_b_cells_lel",
          "label": "Small CD20-positive B cells forming lymphoepithelial lesions; CD5, CD10, and cyclin D1 absent",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The combination of small B-cell morphology, lymphoepithelial lesions, and a CD20-positive, CD5-negative, CD10-negative, cyclin D1-negative phenotype supports gastric MALT lymphoma."
        },
        {
          "id": "large_b_cell_sheets",
          "label": "Sheets of large CD20-positive cells with brisk proliferation, destructive growth, and no dominant small-cell infiltrate",
          "isCorrect": false,
          "distractorRationale": "This profile supports an aggressive large B-cell lymphoma rather than classic low-grade gastric MALT lymphoma."
        },
        {
          "id": "signet_ring_carcinoma",
          "label": "Cytokeratin-positive signet-ring cells infiltrating the gastric wall with a prominent desmoplastic stromal response",
          "isCorrect": false,
          "distractorRationale": "This is an epithelial gastric malignancy rather than a small B-cell lymphoma."
        },
        {
          "id": "mantle_cell_profile",
          "label": "Small CD5- and cyclin D1-positive B cells expanding the mucosa in a pattern compatible with mantle cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "CD5 and cyclin D1 positivity favors mantle cell lymphoma, not the usual gastric MALT phenotype."
        }
      ],
      "explanation": "The combination of small B-cell morphology, lymphoepithelial lesions, and a CD20-positive, CD5-negative, CD10-negative, cyclin D1-negative phenotype supports gastric MALT lymphoma.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition"
      ],
      "teachingPoint": "The combination of small B-cell morphology, lymphoepithelial lesions, and a CD20-positive, CD5-negative, CD10-negative, cyclin D1-negative phenotype supports gastric MALT lymphoma."
    }
  },
  {
    "id": "revision.qq20261102.b26",
    "auditId": "B26",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v2",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which interpretation is justified by the reported p-value for two-year recurrence in the constructed trial?",
    "previousChoiceLabels": [
      "A 40% chance of results this extreme or more under the null model",
      "A 40% probability that the null hypothesis is true after observing these results",
      "A 60% probability that no group difference exists after observing these results",
      "An estimated difference of 0.40 outcome units between the two groups being compared"
    ],
    "presentationTemplate": "{patientName}, the journal-club lead, reviews an investigational rectal-prolapse fixation study. It compares an intervention with a control and reports recurrence within two years.",
    "previousPresentation": "{patientName}, the colorectal research lead, reviews a new fixation technique for rectal prolapse and recurrence within two years. The press officer wants a headline saying the study settled the issue; the statistician has been offered a footnote in exchange for missing the press conference. The report includes its preplanned null model and the p-value from that analysis.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Translate the reported p-value into its null-conditional meaning while distinguishing posterior belief and effect size.",
    "reviewerNotes": "The supplied numerical values are retained from the fictional trial, not clinical probabilities. Check statistical assumptions and parallel option meanings; no personal benefit claim is made.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-040": "correct_p-040",
      "choice.qq20261102.b26.d1": "d1_p-040",
      "choice.qq20261102.b26.d2": "d2_p-040"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove sponsor jokes, interpreted significance, effect-size teaching and the definition from the exhibit caption. Use equal-form numerical interpretations and three common competing meanings."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v2.r2",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which interpretation of the reported p-value should {patientName} use?",
      "answerChoices": [
        {
          "id": "correct_p-040",
          "label": "A 40% probability of data at least this extreme if the null model holds",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Conditions on the stated null model and its assumptions when interpreting the tail probability."
        },
        {
          "id": "choice.qq20261102.b26.d1",
          "label": "A 40% probability that the null model holds after these data are observed",
          "isCorrect": false,
          "distractorRationale": "Reverses the conditional relationship and treats the p-value as a posterior probability of the hypothesis."
        },
        {
          "id": "choice.qq20261102.b26.d2",
          "label": "A 40% reduction in outcome probability for the intervention compared with the control",
          "isCorrect": false,
          "distractorRationale": "Mistakes the p-value for a treatment effect on the outcome probability."
        }
      ],
      "explanation": "A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
      "teachingPoint": "A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Null hypothesis: equal outcome probabilities in the two groups.",
        "items": [
          {
            "label": "Analysis",
            "value": "Prespecified comparison of intervention and control"
          },
          {
            "label": "p-value",
            "value": "0.40"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b27",
    "auditId": "B27",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-003",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v1",
    "questionVariantId": "question.statistics-ethics.p-value.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which interpretation is justified by the reported p-value for thirty-day SSI in the constructed trial?",
    "previousChoiceLabels": [
      "A 3% chance of results this extreme or more under the null model",
      "A 3% probability that the null hypothesis is true after observing these results",
      "A 97% probability that the intervention truly changed the outcome after observing these results",
      "An estimated difference of 0.03 outcome units between the two groups being compared"
    ],
    "presentationTemplate": "{patientName}, the journal-club lead, reviews an investigational gallbladder dissection study. It compares an intervention with a control and reports surgical-site infection within thirty days.",
    "previousPresentation": "{patientName}, the biliary journal-club lead, reviews a new dissection instrument used in acute cholecystitis operations. The trial compares thirty-day surgical-site infection and reports its preplanned analysis. Investigators specified the null model before collecting outcomes. The team has the p-value but is reviewing what that value says about the infection results before drafting the study's written conclusion.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Translate the reported p-value into its null-conditional meaning while distinguishing posterior belief and effect size.",
    "reviewerNotes": "The supplied numerical values are retained from the fictional trial, not clinical probabilities. Check statistical assumptions and parallel option meanings; no personal benefit claim is made.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-003": "correct_p-003",
      "choice.qq20261102.b27.d1": "d1_p-003",
      "choice.qq20261102.b27.d2": "d2_p-003"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove sponsor jokes, interpreted significance, effect-size teaching and the definition from the exhibit caption. Use equal-form numerical interpretations and three common competing meanings."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v1.r2",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which interpretation of the reported p-value should {patientName} use?",
      "answerChoices": [
        {
          "id": "correct_p-003",
          "label": "A 3% probability of data at least this extreme if the null model holds",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Conditions on the stated null model and its assumptions when interpreting the tail probability."
        },
        {
          "id": "choice.qq20261102.b27.d1",
          "label": "A 3% probability that the null model holds after these data are observed",
          "isCorrect": false,
          "distractorRationale": "Reverses the conditional relationship and treats the p-value as a posterior probability of the hypothesis."
        },
        {
          "id": "choice.qq20261102.b27.d2",
          "label": "A 3% reduction in outcome probability for the intervention compared with the control",
          "isCorrect": false,
          "distractorRationale": "Mistakes the p-value for a treatment effect on the outcome probability."
        }
      ],
      "explanation": "A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
      "teachingPoint": "A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Null hypothesis: equal outcome probabilities in the two groups.",
        "items": [
          {
            "label": "Analysis",
            "value": "Prespecified comparison of intervention and control"
          },
          {
            "label": "p-value",
            "value": "0.03"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b28",
    "auditId": "B28",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
    "previousQuestionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "How should the adjusted odds ratio of 0.60 for two-year recurrence be described when group risks are unavailable?",
    "previousChoiceLabels": [
      "Adjusted odds are 0.60 times as high",
      "Adjusted risk is exactly 0.60 times as high",
      "Absolute risk falls by 40 percentage points",
      "Adjusted event probability is 40% lower"
    ],
    "presentationTemplate": "{patientName}, the journal-club lead, reviews an investigational Merkel-cell carcinoma treatment study. A regression model compares recurrence between treatment groups over two years.",
    "previousPresentation": "{patientName}, the skin-oncology discussion lead, reviews a new biologic for Merkel cell carcinoma. An adjusted model reports recurrence odds over two years. The representative offers to simplify the statistics by removing the parts customers ask about. The report supplies an adjusted odds ratio, but no underlying group risks; the team is reviewing the wording of its result.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Convert a relative odds estimate to ordinary language without silently changing it into a risk measure.",
    "reviewerNotes": "Retain the fictional 0.60 estimate. Measure-name overlap is necessary data, not permission to teach the conversion in the case.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_adjusted-odds": "correct_adjusted-odds",
      "choice.qq20261102.b28.d1": "d1_adjusted-odds",
      "choice.qq20261102.b28.d2": "d2_adjusted-odds"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Delete the unavailable-group-risk hint and promotional story. Remove the redundant risk distractor and keep three parallel relative/absolute interpretations."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r2",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "How should {patientName} describe the reported association estimate?",
      "answerChoices": [
        {
          "id": "correct_adjusted-odds",
          "label": "40% lower adjusted odds",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Expresses the multiplicative association on the reported odds scale."
        },
        {
          "id": "choice.qq20261102.b28.d1",
          "label": "40% lower adjusted risk",
          "isCorrect": false,
          "distractorRationale": "Treats an odds ratio as the same numerical risk ratio without the information needed for that conversion."
        },
        {
          "id": "choice.qq20261102.b28.d2",
          "label": "40 percentage points lower adjusted risk",
          "isCorrect": false,
          "distractorRationale": "Converts a relative odds association into an absolute risk reduction unsupported by the reported measure."
        }
      ],
      "explanation": "The reported odds ratio corresponds to lower adjusted odds on the stated scale. It does not establish the same reduction in risk or an absolute percentage-point difference, nor does an adjusted association alone establish causation.",
      "teachingPoint": "The reported odds ratio corresponds to lower adjusted odds on the stated scale. It does not establish the same reduction in risk or an absolute percentage-point difference, nor does an adjusted association alone establish causation.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Recurrence model; intervention versus control.",
        "items": [
          {
            "label": "Measure",
            "value": "Adjusted odds ratio"
          },
          {
            "label": "Estimate",
            "value": "0.60"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.risk-ratio-odds-ratio"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b29",
    "auditId": "B29",
    "caseId": "case.variety3.sedation-discharge-ride",
    "nodeId": "node.variety3.sedation-discharge-ride.1",
    "previousQuestionVariantId": "question.variety3.sedation-discharge-ride.v1",
    "questionVariantId": "question.variety3.sedation-discharge-ride.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-10.variety-3.1"
    ],
    "previousStem": "Which transport and home-support arrangement should George Harris plan after gastroscopy with sedation?",
    "previousChoiceLabels": [
      "Responsible adult collection and support",
      "Independent taxi travel and home recovery",
      "Independent bus travel and home recovery",
      "Independent self-driving and home recovery"
    ],
    "presentationTemplate": "George Harris, a 67-year-old man, visits the clinic to arrange an outside gastroscopy with sedation. He asks about travel home and recovery at home.",
    "previousPresentation": "George Harris, a 67-year-old man, visits the clinic. George is preparing for an outside gastroscopy with sedation. He planned to drive himself home because he expects to feel awake after the procedure. A responsible adult is available to collect him and stay with him for the recovery period required by the endoscopy team. He asks which arrangement to book.",
    "previousProfilePresentations": [
      {
        "id": "profile.variety3.sedation-discharge-ride.man67",
        "presentation": "George Harris, a 67-year-old man, visits the clinic. George is preparing for an outside gastroscopy with sedation. He planned to drive himself home because he expects to feel awake after the procedure. A responsible adult is available to collect him and stay with him for the recovery period required by the endoscopy team. He asks which arrangement to book."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Plan both the journey and home support after sedation rather than using transport alone as a substitute for an escort.",
    "reviewerNotes": "Confirm local discharge arrangements and the role of an adult escort. This remains a practical safety item; no requirement is concealed to force difficulty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "choice.sedation-discharge-ride.adult": "choice.sedation-discharge-ride.adult",
      "choice.qq20261102.b29.d1": "choice.sedation-discharge-ride.taxi",
      "choice.qq20261102.b29.d2": "choice.sedation-discharge-ride.drive"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the sentence making the complete keyed arrangement available. Compare three arrangements with the same transport/support structure, dropping the redundant independent-bus option."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.variety3.sedation-discharge-ride.v1.r2",
      "conceptId": "concept.variety3.endoscopic-sedation-escort-planning",
      "stem": "Which transport and home-support arrangement should George Harris plan after gastroscopy with sedation?",
      "answerChoices": [
        {
          "id": "choice.sedation-discharge-ride.adult",
          "label": "Adult escort and adult home support",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Addresses both collection and support during the endoscopy team's specified recovery period."
        },
        {
          "id": "choice.qq20261102.b29.d1",
          "label": "Taxi transfer and unaccompanied home recovery",
          "isCorrect": false,
          "distractorRationale": "Provides transport but omits the responsible adult collection and support required after sedation."
        },
        {
          "id": "choice.qq20261102.b29.d2",
          "label": "Self-drive transfer and adult home support",
          "isCorrect": false,
          "distractorRationale": "Adds home support but retains driving during the immediate recovery period when sedation can impair responses."
        }
      ],
      "explanation": "Arrange a responsible adult to collect and support the patient as directed by the endoscopy team. Subjective wakefulness does not establish recovery of reactions or judgment after sedation; no fixed recovery duration is authored here.",
      "teachingPoint": "Arrange a responsible adult to collect and support the patient as directed by the endoscopy team. Subjective wakefulness does not establish recovery of reactions or judgment after sedation; no fixed recovery duration is authored here.",
      "supportingEvidenceClaimIds": [
        "claim.variety3.sedation.no-self-driving",
        "claim.variety3.sedation.adult-collection-support",
        "claim.variety3.sedation.residual-effects"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 67,
        "sexLabel": "Male"
      },
      "patientDisplayName": "George Harris"
    }
  },
  {
    "id": "revision.qq20261102.b30",
    "auditId": "B30",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.integrated-pathology-diagnosis.v1",
    "previousQuestionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1",
    "questionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-039.2026-08-06.1"
    ],
    "previousStem": "Which diagnosis best fits the integrated biopsy findings?",
    "previousChoiceLabels": [
      "Gastric MALT lymphoma",
      "Diffuse large B-cell lymphoma involving the stomach",
      "Gastric adenocarcinoma with reactive lymphoid inflammation",
      "Mantle cell lymphoma involving the gastric mucosa"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia. Small lymphocytes expand the lamina propria and enter gastric glands. The cells stain for CD20 and CD79a; CD5 and cyclin D1 staining is not detected.",
    "previousPresentation": "{patientName}, an adult with persistent dyspepsia, undergoes EGD. Gastric biopsies show a dense infiltrate of small lymphocytes expanding the lamina propria and infiltrating glands. The cells are CD20 and CD79a positive, with CD5, CD10, and cyclin D1 absent; no sheets of large cells are present.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Combine morphology and immunostains among three B-cell lymphoma diagnoses.",
    "reviewerNotes": "Confirm the abridged panel is sufficient and that rare immunophenotypic exceptions do not change the best answer. The negative stains remain decision-critical pattern data.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "gastric_malt": "gastric_malt",
      "choice.qq20261102.b30.d1": "gastric_dlbcl",
      "choice.qq20261102.b30.d2": "gastric_mantle_cell"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the epithelial outlier and the additional negative checklist. Use three comparable lymphoma names, with the task requiring integrated interpretation rather than marker recall."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.integrated-pathology-diagnosis.v1.r2",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which lymphoma diagnosis best fits {patientName}'s gastric biopsy?",
      "answerChoices": [
        {
          "id": "gastric_malt",
          "label": "Gastric extranodal marginal-zone lymphoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the small B-cell morphology, gland infiltration and immunophenotype."
        },
        {
          "id": "choice.qq20261102.b30.d1",
          "label": "Gastric diffuse large B-cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "Overweights B-cell lineage while disregarding the supplied small-cell morphology."
        },
        {
          "id": "choice.qq20261102.b30.d2",
          "label": "Gastric mantle cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "Recognizes a small B-cell alternative but does not fit the supplied integrated gland and immunostain findings."
        }
      ],
      "explanation": "The integrated small B-cell, gland-infiltrating pattern supports gastric MALT lymphoma. A lineage marker alone would not suffice; cell morphology and the remainder of the panel matter.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition"
      ],
      "teachingPoint": "The integrated small B-cell, gland-infiltrating pattern supports gastric MALT lymphoma. A lineage marker alone would not suffice; cell morphology and the remainder of the panel matter."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.integrated-pathology-diagnosis",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, an adult with persistent dyspepsia, undergoes EGD. Gastric biopsies show a dense infiltrate of small lymphocytes expanding the lamina propria and infiltrating glands. The cells are CD20 and CD79a positive, with CD5, CD10, and cyclin D1 absent; no sheets of large cells are present.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b30-context",
    "auditId": "B30-context",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "previousQuestionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "questionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-039.2026-08-06.1"
    ],
    "previousStem": "What is the most appropriate initial lymphoma-directed plan?",
    "previousChoiceLabels": [
      "H. pylori eradication therapy, then response reassessment",
      "Immediate gastrectomy followed by routine postoperative surveillance",
      "Immediate R-CHOP before attempting H. pylori eradication therapy",
      "Definitive gastric radiotherapy without an initial eradication attempt"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r2",
      "conceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      "stem": "Which initial treatment plan should be recommended for {patientName}'s localized H. pylori-positive gastric MALT lymphoma?",
      "answerChoices": [
        {
          "id": "eradicate_then_reassess",
          "label": "H. pylori eradication therapy, then response reassessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "H. pylori eradication is initial lymphoma-directed treatment for this classic localized low-grade presentation. Eradication must be confirmed and lymphoma response reassessed; this is not permission to omit follow-up."
        },
        {
          "id": "immediate_gastrectomy",
          "label": "Immediate gastrectomy followed by routine postoperative surveillance",
          "isCorrect": false,
          "distractorRationale": "Gastrectomy is not the preferred initial treatment for this classic localized low-grade eradication-responsive presentation."
        },
        {
          "id": "immediate_rchop",
          "label": "Immediate R-CHOP before attempting H. pylori eradication therapy",
          "isCorrect": false,
          "distractorRationale": "Aggressive systemic lymphoma treatment is not the initial approach for this low-grade nontransformed presentation."
        },
        {
          "id": "immediate_radiotherapy",
          "label": "Definitive gastric radiotherapy without an initial eradication attempt",
          "isCorrect": false,
          "distractorRationale": "The approved classic H. pylori-positive localized presentation should first receive eradication therapy."
        }
      ],
      "explanation": "H. pylori eradication is initial lymphoma-directed treatment for this classic localized low-grade presentation. Eradication must be confirmed and lymphoma response reassessed; this is not permission to omit follow-up.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.hpylori-eradication-initial-localized",
        "claim.gastric-malt.eradication-confirmation-and-response-reassessment"
      ],
      "teachingPoint": "H. pylori eradication is initial lymphoma-directed treatment for this classic localized low-grade presentation. Eradication must be confirmed and lymphoma response reassessed; this is not permission to omit follow-up."
    }
  },
  {
    "id": "revision.qq20261102.b31",
    "auditId": "B31",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-008",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-008.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v4",
    "questionVariantId": "question.statistics-ethics.p-value.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which interpretation is justified by the reported p-value for thirty-day leak in the constructed trial?",
    "previousChoiceLabels": [
      "The result does not prove exact equality",
      "The result favors equal group effects",
      "The result indicates a small clinical difference",
      "The result gives an 8% probability of no effect"
    ],
    "presentationTemplate": "{patientName}, the journal-club lead, reviews a report comparing two investigational anastomosis instruments after ileal resection. The constructed trial records leak within thirty days.",
    "previousPresentation": "{patientName}, the emergency-surgery journal-club lead, reviews a new anastomosis instrument after ileal resection for symptomatic Meckel diverticulum. The trial records leak within thirty days. Its analysis does not reject the prespecified null model, and a draft conclusion says the instruments have exactly equal effects. The report gives the p-value and that proposed conclusion for the team's discussion.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Choose a defensible report conclusion without turning a p-value into equivalence or an effect-size bound.",
    "reviewerNotes": "The fictional 0.08 is unchanged. No unreported significance threshold or equivalence margin is assumed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-008": "correct_p-008",
      "choice.qq20261102.b31.d1": "d1_p-008",
      "choice.qq20261102.b31.d2": "d2_p-008"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the pre-answer non-rejection interpretation, exact-equality draft and effect-size teaching. Compare three natural report conclusions of similar length."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v4.r2",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which conclusion should {patientName} include in the trial report?",
      "answerChoices": [
        {
          "id": "correct_p-008",
          "label": "The data leave clinical importance unresolved",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Does not infer equivalence or clinical effect size from the reported p-value."
        },
        {
          "id": "choice.qq20261102.b31.d1",
          "label": "The data favor clinically equivalent outcomes",
          "isCorrect": false,
          "distractorRationale": "Treats failure to establish a difference as evidence favoring equivalence."
        },
        {
          "id": "choice.qq20261102.b31.d2",
          "label": "The data favor a clinically small treatment effect",
          "isCorrect": false,
          "distractorRationale": "Treats the p-value as evidence favoring a small effect rather than recognizing that effect size and uncertainty were not supplied."
        }
      ],
      "explanation": "The p-value does not prove equivalence or bound a clinically important effect. Effect estimates, uncertainty and an appropriate design are needed for those conclusions.",
      "teachingPoint": "The p-value does not prove equivalence or bound a clinically important effect. Effect estimates, uncertainty and an appropriate design are needed for those conclusions.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Comparison of leak outcomes; null hypothesis: equal event probabilities.",
        "items": [
          {
            "label": "p-value",
            "value": "0.08"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b32",
    "auditId": "B32",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Given the returned imaging and persistent symptoms, which referral is appropriate for {patientName}?",
    "previousChoiceLabels": [
      "Refer for EUS-guided drainage",
      "Continue observation",
      "Arrange percutaneous aspiration",
      "Schedule pancreatic resection"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousPresentation": "{patientName} is a 49-year-old woman who has persistent early satiety after recovery from interstitial edematous acute pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.female.49",
        "presentation": "{patientName} is a 49-year-old woman who has persistent early satiety after recovery from interstitial edematous acute pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.male.49",
        "presentation": "{patientName} is a 49-year-old man who has persistent early satiety after recovery from interstitial edematous acute pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.female.51",
        "presentation": "{patientName} is a 51-year-old woman who has persistent early satiety after recovery from interstitial edematous acute pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.male.51",
        "presentation": "{patientName} is a 51-year-old man who has persistent early satiety after recovery from interstitial edematous acute pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      }
    ],
    "currentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Classify the collection from raw content/wall findings and choose a management route from symptoms and anatomical access.",
    "reviewerNotes": "Clinician confirms symptom attribution, wall adequacy and drainage-route ranking. The old no-extra-order contracts remain; current wait estimates remain runtime metadata.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_0": "drain_0",
      "choice.qq20261102.b32.d1": "aspirate_0",
      "choice.qq20261102.b32.d2": "resect_0",
      "choice.qq20261102.b32.d3": "observe_0"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the emergency-negative checklist, diagnostic label, mature summary and resection/one-time-aspiration distractors. Compare real drainage routes and observation using observed anatomy."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r2",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_0",
          "label": "Endoscopic transmural drainage",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the symptomatic collection's defined wall and gastric apposition to favor EUS-guided endoscopic drainage when expertise and access are suitable."
        },
        {
          "id": "choice.qq20261102.b32.d1",
          "label": "Percutaneous catheter drainage",
          "isCorrect": false,
          "distractorRationale": "Is a real drainage route, but is less favored than internal endoscopic drainage for this suitably apposed collection when feasible."
        },
        {
          "id": "choice.qq20261102.b32.d2",
          "label": "Operative internal drainage",
          "isCorrect": false,
          "distractorRationale": "Can drain a collection but is not the preferred initial route over a feasible endoscopic approach in this supplied anatomy."
        },
        {
          "id": "choice.qq20261102.b32.d3",
          "label": "Observation with repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Fits selected asymptomatic collections but underweights the persistent symptom burden in this case."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 49,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b32-context",
    "auditId": "B32-context",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v1",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Which next test should be ordered to characterize {patientName}'s suspected post-pancreatitis fluid collection before drainage planning?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousResultNarrative": "External contrast-enhanced CT shows a mature encapsulated homogeneous fluid collection without solid debris after interstitial edematous pancreatitis, compatible with a pancreatic pseudocyst. It is apposed to the stomach or duodenum, with no pseudoaneurysm or suspicious neoplastic feature.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v1.r2",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
      "answerChoices": [
        {
          "id": "ct_0",
          "label": "Contrast-enhanced CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
        },
        {
          "id": "us_0",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the needed comprehensive pre-drainage characterization."
        },
        {
          "id": "ercp_0",
          "label": "Diagnostic ERCP",
          "isCorrect": false,
          "distractorRationale": "ERCP is invasive and does not answer the initial collection-characterization task."
        },
        {
          "id": "hida_0",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": false,
          "distractorRationale": "This test evaluates bile transit or leakage rather than pancreatic collection morphology."
        }
      ],
      "explanation": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization"
      ],
      "teachingPoint": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
    }
  },
  {
    "id": "revision.qq20261102.b33",
    "auditId": "B33",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Given the returned imaging and persistent symptoms, which referral is appropriate for {patientName}?",
    "previousChoiceLabels": [
      "Refer for EUS-guided drainage",
      "Continue observation",
      "Arrange percutaneous aspiration",
      "Schedule pancreatic resection"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousPresentation": "{patientName} is a 63-year-old woman who has postmeal vomiting from suspected gastric compression after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.female.63",
        "presentation": "{patientName} is a 63-year-old woman who has postmeal vomiting from suspected gastric compression after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.male.63",
        "presentation": "{patientName} is a 63-year-old man who has postmeal vomiting from suspected gastric compression after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.female.61",
        "presentation": "{patientName} is a 61-year-old woman who has postmeal vomiting from suspected gastric compression after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.male.61",
        "presentation": "{patientName} is a 61-year-old man who has postmeal vomiting from suspected gastric compression after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      }
    ],
    "currentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Classify the collection from raw content/wall findings and choose a management route from symptoms and anatomical access.",
    "reviewerNotes": "Clinician confirms symptom attribution, wall adequacy and drainage-route ranking. The old no-extra-order contracts remain; current wait estimates remain runtime metadata.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_1": "drain_1",
      "choice.qq20261102.b33.d1": "aspirate_1",
      "choice.qq20261102.b33.d2": "resect_1",
      "choice.qq20261102.b33.d3": "observe_1"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the emergency-negative checklist, diagnostic label, mature summary and resection/one-time-aspiration distractors. Compare real drainage routes and observation using observed anatomy."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r2",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_1",
          "label": "Endoscopic transmural drainage",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the symptomatic collection's defined wall and gastric apposition to favor EUS-guided endoscopic drainage when expertise and access are suitable."
        },
        {
          "id": "choice.qq20261102.b33.d1",
          "label": "Percutaneous catheter drainage",
          "isCorrect": false,
          "distractorRationale": "Is a real drainage route, but is less favored than internal endoscopic drainage for this suitably apposed collection when feasible."
        },
        {
          "id": "choice.qq20261102.b33.d2",
          "label": "Operative internal drainage",
          "isCorrect": false,
          "distractorRationale": "Can drain a collection but is not the preferred initial route over a feasible endoscopic approach in this supplied anatomy."
        },
        {
          "id": "choice.qq20261102.b33.d3",
          "label": "Observation with repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Fits selected asymptomatic collections but underweights the persistent symptom burden in this case."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 63,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b33-context",
    "auditId": "B33-context",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v2",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Which next test should be ordered to characterize {patientName}'s suspected post-pancreatitis fluid collection before drainage planning?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousResultNarrative": "External contrast-enhanced CT shows a mature encapsulated homogeneous fluid collection without solid debris after interstitial edematous pancreatitis, compatible with a pancreatic pseudocyst. It is apposed to the stomach or duodenum, with no pseudoaneurysm or suspicious neoplastic feature.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v2.r2",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
      "answerChoices": [
        {
          "id": "ct_1",
          "label": "Contrast-enhanced CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
        },
        {
          "id": "us_1",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the needed comprehensive pre-drainage characterization."
        },
        {
          "id": "ercp_1",
          "label": "Diagnostic ERCP",
          "isCorrect": false,
          "distractorRationale": "ERCP is invasive and does not answer the initial collection-characterization task."
        },
        {
          "id": "hida_1",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": false,
          "distractorRationale": "This test evaluates bile transit or leakage rather than pancreatic collection morphology."
        }
      ],
      "explanation": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization"
      ],
      "teachingPoint": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
    }
  },
  {
    "id": "revision.qq20261102.b34",
    "auditId": "B34",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Given the returned imaging and persistent symptoms, which referral is appropriate for {patientName}?",
    "previousChoiceLabels": [
      "Refer for EUS-guided drainage",
      "Continue observation",
      "Arrange percutaneous aspiration",
      "Schedule pancreatic resection"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousPresentation": "{patientName} is a 44-year-old woman who has persistent upper-abdominal pain after recovery from interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.female.44",
        "presentation": "{patientName} is a 44-year-old woman who has persistent upper-abdominal pain after recovery from interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.male.44",
        "presentation": "{patientName} is a 44-year-old man who has persistent upper-abdominal pain after recovery from interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.female.46",
        "presentation": "{patientName} is a 46-year-old woman who has persistent upper-abdominal pain after recovery from interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.male.46",
        "presentation": "{patientName} is a 46-year-old man who has persistent upper-abdominal pain after recovery from interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      }
    ],
    "currentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Classify the collection from raw content/wall findings and choose a management route from symptoms and anatomical access.",
    "reviewerNotes": "Clinician confirms symptom attribution, wall adequacy and drainage-route ranking. The old no-extra-order contracts remain; current wait estimates remain runtime metadata.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_2": "drain_2",
      "choice.qq20261102.b34.d1": "aspirate_2",
      "choice.qq20261102.b34.d2": "resect_2",
      "choice.qq20261102.b34.d3": "observe_2"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the emergency-negative checklist, diagnostic label, mature summary and resection/one-time-aspiration distractors. Compare real drainage routes and observation using observed anatomy."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r2",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_2",
          "label": "Endoscopic transmural drainage",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the symptomatic collection's defined wall and gastric apposition to favor EUS-guided endoscopic drainage when expertise and access are suitable."
        },
        {
          "id": "choice.qq20261102.b34.d1",
          "label": "Percutaneous catheter drainage",
          "isCorrect": false,
          "distractorRationale": "Is a real drainage route, but is less favored than internal endoscopic drainage for this suitably apposed collection when feasible."
        },
        {
          "id": "choice.qq20261102.b34.d2",
          "label": "Operative internal drainage",
          "isCorrect": false,
          "distractorRationale": "Can drain a collection but is not the preferred initial route over a feasible endoscopic approach in this supplied anatomy."
        },
        {
          "id": "choice.qq20261102.b34.d3",
          "label": "Observation with repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Fits selected asymptomatic collections but underweights the persistent symptom burden in this case."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 44,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b34-context",
    "auditId": "B34-context",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v3",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Which next test should be ordered to characterize {patientName}'s suspected post-pancreatitis fluid collection before drainage planning?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousResultNarrative": "External contrast-enhanced CT shows a mature encapsulated homogeneous fluid collection without solid debris after interstitial edematous pancreatitis, compatible with a pancreatic pseudocyst. It is apposed to the stomach or duodenum, with no pseudoaneurysm or suspicious neoplastic feature.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v3.r2",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
      "answerChoices": [
        {
          "id": "ct_2",
          "label": "Contrast-enhanced CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
        },
        {
          "id": "us_2",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the needed comprehensive pre-drainage characterization."
        },
        {
          "id": "ercp_2",
          "label": "Diagnostic ERCP",
          "isCorrect": false,
          "distractorRationale": "ERCP is invasive and does not answer the initial collection-characterization task."
        },
        {
          "id": "hida_2",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": false,
          "distractorRationale": "This test evaluates bile transit or leakage rather than pancreatic collection morphology."
        }
      ],
      "explanation": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization"
      ],
      "teachingPoint": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
    }
  },
  {
    "id": "revision.qq20261102.b35",
    "auditId": "B35",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Given the returned imaging and persistent symptoms, which referral is appropriate for {patientName}?",
    "previousChoiceLabels": [
      "Refer for EUS-guided drainage",
      "Continue observation",
      "Arrange percutaneous aspiration",
      "Schedule pancreatic resection"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousPresentation": "{patientName} is a 56-year-old woman who has reduced oral intake and early fullness after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.female.56",
        "presentation": "{patientName} is a 56-year-old woman who has reduced oral intake and early fullness after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.male.56",
        "presentation": "{patientName} is a 56-year-old man who has reduced oral intake and early fullness after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.female.58",
        "presentation": "{patientName} is a 58-year-old woman who has reduced oral intake and early fullness after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      },
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.male.58",
        "presentation": "{patientName} is a 58-year-old man who has reduced oral intake and early fullness after resolved interstitial edematous pancreatitis. There is no fever, bleeding, sepsis, organ failure, or history of necrotizing pancreatitis."
      }
    ],
    "currentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Classify the collection from raw content/wall findings and choose a management route from symptoms and anatomical access.",
    "reviewerNotes": "Clinician confirms symptom attribution, wall adequacy and drainage-route ranking. The old no-extra-order contracts remain; current wait estimates remain runtime metadata.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_3": "drain_3",
      "choice.qq20261102.b35.d1": "aspirate_3",
      "choice.qq20261102.b35.d2": "resect_3",
      "choice.qq20261102.b35.d3": "observe_3"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove the emergency-negative checklist, diagnostic label, mature summary and resection/one-time-aspiration distractors. Compare real drainage routes and observation using observed anatomy."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r2",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_3",
          "label": "Endoscopic transmural drainage",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the symptomatic collection's defined wall and gastric apposition to favor EUS-guided endoscopic drainage when expertise and access are suitable."
        },
        {
          "id": "choice.qq20261102.b35.d1",
          "label": "Percutaneous catheter drainage",
          "isCorrect": false,
          "distractorRationale": "Is a real drainage route, but is less favored than internal endoscopic drainage for this suitably apposed collection when feasible."
        },
        {
          "id": "choice.qq20261102.b35.d2",
          "label": "Operative internal drainage",
          "isCorrect": false,
          "distractorRationale": "Can drain a collection but is not the preferred initial route over a feasible endoscopic approach in this supplied anatomy."
        },
        {
          "id": "choice.qq20261102.b35.d3",
          "label": "Observation with repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Fits selected asymptomatic collections but underweights the persistent symptom burden in this case."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 56,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b35-context",
    "auditId": "B35-context",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v4",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-13.1"
    ],
    "previousStem": "Which next test should be ordered to characterize {patientName}'s suspected post-pancreatitis fluid collection before drainage planning?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousResultNarrative": "External contrast-enhanced CT shows a mature encapsulated homogeneous fluid collection without solid debris after interstitial edematous pancreatitis, compatible with a pancreatic pseudocyst. It is apposed to the stomach or duodenum, with no pseudoaneurysm or suspicious neoplastic feature.",
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v4.r2",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
      "answerChoices": [
        {
          "id": "ct_3",
          "label": "Contrast-enhanced CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
        },
        {
          "id": "us_3",
          "label": "Abdominal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Ultrasound does not provide the needed comprehensive pre-drainage characterization."
        },
        {
          "id": "ercp_3",
          "label": "Diagnostic ERCP",
          "isCorrect": false,
          "distractorRationale": "ERCP is invasive and does not answer the initial collection-characterization task."
        },
        {
          "id": "hida_3",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": false,
          "distractorRationale": "This test evaluates bile transit or leakage rather than pancreatic collection morphology."
        }
      ],
      "explanation": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization"
      ],
      "teachingPoint": "Order contrast-enhanced CT before classification or drainage planning of the post-pancreatitis collection."
    }
  },
  {
    "id": "revision.qq20261102.b36",
    "auditId": "B36",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which Act-step decision fits the authorized gastroparesis pathway pilot when its symptom aim is not met and care planning takes longer, with no specific correctable defect identified?",
    "previousChoiceLabels": [
      "Abandon this version and test another idea",
      "Adapt the pathway labels and repeat this version",
      "Adopt the pathway and monitor the next cycle",
      "Repeat the same test to confirm the findings"
    ],
    "presentationTemplate": "{patientName}, the quality-improvement lead, reviews an authorized local gastroparesis-pathway pilot. Successive tests miss the symptom target and take longer to plan care. An audit finds staff followed the tested workflow.",
    "previousPresentation": "{patientName}, the foregut improvement lead, reviews an authorized new nutrition-pathway pilot for gastroparesis after obstruction was excluded. Its symptom aim is not met and planning takes longer. The vendor insists the pathway saves time after staff complete extra training on saving time. No specific correctable defect has emerged from review, and the next cycle has not been planned.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use repeated process and outcome findings to select a next-cycle action without an explicit adopt/adapt/abandon label in the case.",
    "reviewerNotes": "QI reviewer must confirm the keyed ranking. Removing the cosmetic-adaptation distractor avoids pretending that data alone resolve every possible redesign; a different future test may itself adapt an idea.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qq20261102.b36.d1": "d1_abandon-harm",
      "choice.qq20261102.b36.d2": "d2_abandon-harm"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Delete the vendor joke, the no-correctable-defect permission and the keyed Act-step framing. Use concrete repeated findings, implementation audit and three parallel next-cycle decisions."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r2",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which next-cycle decision should {patientName}'s team make from the reported findings?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Stop this version and test another approach",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Links repeated lack of benefit and added burden to a different next test rather than rollout or unchanged repetition."
        },
        {
          "id": "choice.qq20261102.b36.d1",
          "label": "Roll out this version and monitor outcomes",
          "isCorrect": false,
          "distractorRationale": "Adopts a version despite the supplied failure to meet its aim and added process burden."
        },
        {
          "id": "choice.qq20261102.b36.d2",
          "label": "Repeat this version without changing the workflow",
          "isCorrect": false,
          "distractorRationale": "Repeats the unsuccessful design without a stated reason that would address the repeated findings."
        }
      ],
      "explanation": "The findings support stopping this unsuccessful version and planning a different test. They do not establish that every future nutrition-pathway idea will fail or that improvement testing replaces clinical/research oversight.",
      "teachingPoint": "The findings support stopping this unsuccessful version and planning a different test. They do not establish that every future nutrition-pathway idea will fail or that improvement testing replaces clinical/research oversight.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Authorized local process test, not treatment efficacy.",
        "items": [
          {
            "label": "Symptom-relief target",
            "value": "Not met"
          },
          {
            "label": "Care-planning time",
            "value": "Longer across successive tests"
          },
          {
            "label": "Implementation audit",
            "value": "Tested workflow followed"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.pdsa-act"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b37",
    "auditId": "B37",
    "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
    "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
    "previousQuestionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4",
    "questionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-17.1"
    ],
    "previousStem": "Which diagnostic pathway should be arranged now?",
    "previousChoiceLabels": [
      "Core biopsy with staging",
      "Skin punch biopsy alone",
      "Screening mammography alone",
      "Ultrasound-guided fluid aspiration"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
    "previousPresentation": "{patientName} is a 50-year-old woman who has ten weeks of expanding unilateral erythema, edema, and warmth involving about half the breast. She is nonlactating and clinically stable, and ultrasound shows no drainable fluid collection.",
    "previousProfilePresentations": [
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.50",
        "presentation": "{patientName} is a 50-year-old woman who has ten weeks of expanding unilateral erythema, edema, and warmth involving about half the breast. She is nonlactating and clinically stable, and ultrasound shows no drainable fluid collection."
      },
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.54",
        "presentation": "{patientName} is a 54-year-old woman who has ten weeks of expanding unilateral erythema, edema, and warmth involving about half the breast. She is nonlactating and clinically stable, and ultrasound shows no drainable fluid collection."
      },
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.58",
        "presentation": "{patientName} is a 58-year-old woman who has ten weeks of expanding unilateral erythema, edema, and warmth involving about half the breast. She is nonlactating and clinically stable, and ultrasound shows no drainable fluid collection."
      },
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.62",
        "presentation": "{patientName} is a 62-year-old woman who has ten weeks of expanding unilateral erythema, edema, and warmth involving about half the breast. She is nonlactating and clinically stable, and ultrasound shows no drainable fluid collection."
      }
    ],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize the inflammatory clinical pattern and choose a tissue-confirmation pathway among plausible sampling approaches.",
    "reviewerNotes": "The original ten-week and half-breast observations remain; the new ultrasound focus is a fictional target observation, not a probability. Confirm the combined biopsy/staging scope and sampling alternatives.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "core_staging_4": "core_staging_4",
      "choice.qq20261102.b37.d1": "skin_only_4",
      "choice.qq20261102.b37.d2": "aspiration_4"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace screening/aspiration-for-fluid outliers with comparable sampling-and-staging plans. Preserve the key's operational biopsy/staging bundle and present a positive tissue target instead of only an exclusion."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2",
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "stem": "Which diagnostic plan should be arranged for {patientName}'s breast changes?",
      "answerChoices": [
        {
          "id": "core_staging_4",
          "label": "Breast core biopsy and staging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains tissue architecture for invasive carcinoma confirmation and retains the existing external staging pathway."
        },
        {
          "id": "choice.qq20261102.b37.d1",
          "label": "Breast skin punch biopsy and staging",
          "isCorrect": false,
          "distractorRationale": "Focuses on dermal lymphatic findings, which may support the assessment but do not substitute for confirming the invasive breast carcinoma."
        },
        {
          "id": "choice.qq20261102.b37.d2",
          "label": "Breast fine-needle aspiration and staging",
          "isCorrect": false,
          "distractorRationale": "Samples cells without the core-tissue approach needed for the intended invasive-carcinoma assessment."
        }
      ],
      "explanation": "Arrange breast core biopsy to establish invasive carcinoma and complete the indicated external staging assessment. Skin punch biopsy may contribute, but dermal lymphatic involvement is not required; the clinical appearance alone is not histologic confirmation.",
      "supportingEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation"
      ],
      "teachingPoint": "Arrange breast core biopsy to establish invasive carcinoma and complete the indicated external staging assessment. Skin punch biopsy may contribute, but dermal lymphatic involvement is not required; the clinical appearance alone is not histologic confirmation."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 50,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b37-context",
    "auditId": "B37-context",
    "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
    "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.2",
    "previousQuestionVariantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4",
    "questionVariantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-17.1"
    ],
    "previousStem": "Which treatment sequence should be planned?",
    "previousChoiceLabels": [
      "Neoadjuvant therapy, surgery, then radiation",
      "Mastectomy, adjuvant therapy, then observation",
      "Lumpectomy, radiation, then systemic therapy",
      "Radiation, lumpectomy, then systemic therapy"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2",
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "stem": "Which treatment sequence should be planned for {patientName}'s confirmed inflammatory breast cancer?",
      "answerChoices": [
        {
          "id": "neoadjuvant_4",
          "label": "Neoadjuvant therapy, surgery, then radiation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Refer for multidisciplinary neoadjuvant systemic therapy, followed by modified radical mastectomy and postmastectomy radiation if the patient remains an operative candidate."
        },
        {
          "id": "surgery_first_4",
          "label": "Mastectomy, adjuvant therapy, then observation",
          "isCorrect": false,
          "distractorRationale": "Immediate surgery omits the required neoadjuvant systemic phase and postmastectomy radiation."
        },
        {
          "id": "lumpectomy_4",
          "label": "Lumpectomy, radiation, then systemic therapy",
          "isCorrect": false,
          "distractorRationale": "Breast-conserving surgery is not the definitive surgical approach for this diffuse skin-involving disease."
        },
        {
          "id": "radiation_first_4",
          "label": "Radiation, lumpectomy, then systemic therapy",
          "isCorrect": false,
          "distractorRationale": "This reverses the accepted sequence and substitutes breast conservation for modified radical mastectomy."
        }
      ],
      "explanation": "Refer for multidisciplinary neoadjuvant systemic therapy, followed by modified radical mastectomy and postmastectomy radiation if the patient remains an operative candidate.",
      "supportingEvidenceClaimIds": [
        "claim.brief.ibc.trimodality-sequence"
      ],
      "teachingPoint": "Refer for multidisciplinary neoadjuvant systemic therapy, followed by modified radical mastectomy and postmastectomy radiation if the patient remains an operative candidate."
    }
  },
  {
    "id": "revision.qq20261102.b38",
    "auditId": "B38",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
    "previousQuestionVariantId": "question.statistics-ethics.confidence-interval.v1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "How does the constructed two-year recurrence risk-ratio interval relate to its null value, and what interpretation is justified?",
    "previousChoiceLabels": [
      "The interval includes the null value 1",
      "The interval excludes the null value 1",
      "The interval gives 95% probability of a real association",
      "The interval supports an exactly absent association"
    ],
    "presentationTemplate": "{patientName}, the study discussion lead, reviews an investigational femoral-hernia reinforcement study. The constructed trial compares recurrence over two years.",
    "previousPresentation": "{patientName}, the groin-surgery research lead, reviews a new reinforcement material for femoral hernia repair. The trial reports recurrence within two years as a risk ratio with an interval. The sponsor welcomes uncertainty in principle, but asks whether it can be moved to the appendix. The team is reviewing how the reported range relates to the no-difference value.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Translate both ratio endpoints into relative differences and recognize that the interval spans lower and higher recurrence.",
    "reviewerNotes": "The original 0.70 estimate and 0.40 to 1.20 interval remain. The new percentages are derived arithmetic, not invented clinical probabilities. Confirm the frequentist compatibility language; no clinical-importance threshold is supplied.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_ratio-crosses": "correct_ratio-crosses",
      "choice.qq20261102.b38.d1": "d1_ratio-crosses",
      "choice.qq20261102.b38.d2": "d2_ratio-crosses"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove sponsor prose, null-value teaching and the uniquely hedged key. All three options now use the same could-be form and numerical scale; the resident must interpret both existing interval endpoints."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v1.r2",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "Which summary should {patientName} use for the recurrence estimate?",
      "answerChoices": [
        {
          "id": "correct_ratio-crosses",
          "label": "Recurrence could be 60% lower or 20% higher",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Converts the existing ratio bounds: 0.40 corresponds to 60% lower relative risk, and 1.20 to 20% higher relative risk, while retaining uncertainty."
        },
        {
          "id": "choice.qq20261102.b38.d1",
          "label": "Recurrence could be 40% lower or 120% higher",
          "isCorrect": false,
          "distractorRationale": "Mistakes the ratio endpoints for percentage decreases and increases instead of comparing each endpoint with one."
        },
        {
          "id": "choice.qq20261102.b38.d2",
          "label": "Recurrence could be 30% lower or 70% higher",
          "isCorrect": false,
          "distractorRationale": "Mixes the point estimate's relative reduction with the point estimate itself rather than interpreting the interval endpoints."
        }
      ],
      "explanation": "The ratio interval corresponds to relative recurrence ranging from 60% lower to 20% higher, so both directions remain compatible. These percentages are arithmetic translations of the fictional 0.40 and 1.20 endpoints, not new observed clinical effects or probabilities assigned to particular true values.",
      "teachingPoint": "The ratio interval corresponds to relative recurrence ranging from 60% lower to 20% higher, so both directions remain compatible. These percentages are arithmetic translations of the fictional 0.40 and 1.20 endpoints, not new observed clinical effects or probabilities assigned to particular true values.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Intervention versus control recurrence.",
        "items": [
          {
            "label": "Risk ratio",
            "value": "0.70"
          },
          {
            "label": "95% confidence interval",
            "value": "0.40 to 1.20"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.confidence-interval",
        "claim.gs028se.statistics.risk-ratio-odds-ratio"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b39",
    "auditId": "B39",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v3",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which interpretation is justified by the reported p-value for two-year lymphoma recurrence in the constructed trial?",
    "previousChoiceLabels": [
      "A 0.1% chance of results this extreme or more under the null model",
      "A 0.1% probability that the null hypothesis is true after observing these results",
      "A 99.9% probability that the intervention truly changed the outcome after observing these results",
      "An estimated difference of 0.001 outcome units between the two groups being compared"
    ],
    "presentationTemplate": "{patientName}, the journal-club lead, reviews an investigational gastric-MALT recurrence prevention study. It compares an intervention with a control and reports recurrence within two years.",
    "previousPresentation": "{patientName}, the gastric-oncology discussion lead, reviews a new agent for gastric MALT lymphoma in an invented recurrence-prevention trial after remission. Follow-up lasts two years. The sponsor requests 'life-changing' on every slide, including the Wi-Fi password. The trial reports a very small p-value, with its effect estimate supplied separately; the team is reviewing the interpretation for its report.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Translate the reported p-value into its null-conditional meaning while distinguishing posterior belief and effect size.",
    "reviewerNotes": "The supplied numerical values are retained from the fictional trial, not clinical probabilities. Check statistical assumptions and parallel option meanings; no personal benefit claim is made.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-0001": "correct_p-0001",
      "choice.qq20261102.b39.d1": "d1_p-0001",
      "choice.qq20261102.b39.d2": "d2_p-0001"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Remove sponsor jokes, interpreted significance, effect-size teaching and the definition from the exhibit caption. Use equal-form numerical interpretations and three common competing meanings."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v3.r2",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which interpretation of the reported p-value should {patientName} use?",
      "answerChoices": [
        {
          "id": "correct_p-0001",
          "label": "A 0.1% probability of data at least this extreme if the null model holds",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Conditions on the stated null model and its assumptions when interpreting the tail probability."
        },
        {
          "id": "choice.qq20261102.b39.d1",
          "label": "A 0.1% probability that the null model holds after these data are observed",
          "isCorrect": false,
          "distractorRationale": "Reverses the conditional relationship and treats the p-value as a posterior probability of the hypothesis."
        },
        {
          "id": "choice.qq20261102.b39.d2",
          "label": "A 0.1% reduction in outcome probability for the intervention compared with the control",
          "isCorrect": false,
          "distractorRationale": "Mistakes the p-value for a treatment effect on the outcome probability."
        }
      ],
      "explanation": "A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
      "teachingPoint": "A p-value describes how unusual the observed data or more extreme results would be under the specified null model and analysis assumptions. It is not the probability the hypothesis is true and does not supply an effect size.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Fictional teaching dataset; intervention effects are simulated. Null hypothesis: equal outcome probabilities in the two groups.",
        "items": [
          {
            "label": "Analysis",
            "value": "Prespecified comparison of intervention and control"
          },
          {
            "label": "p-value",
            "value": "0.001"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value"
      ]
    },
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    }
  },
  {
    "id": "revision.qq20261102.b40",
    "auditId": "B40",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-049.2026-08-10.1"
    ],
    "previousStem": "What should be done for this endoscopic finding?",
    "previousChoiceLabels": [
      "Perform endoscopic hemostasis",
      "Give oral PPI without endoscopic treatment",
      "Biopsy the visible vessel before treatment",
      "Schedule repeat EGD without treating the vessel"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after melena and is referred for EGD. Endoscopy shows a duodenal ulcer with a protruding vessel in its base; the field stays dry during observation.",
    "previousPresentation": "{patientName}, a hemodynamically stable adult, undergoes EGD after recent melena. A duodenal ulcer is no longer actively bleeding but contains a clearly visible vessel.",
    "previousProfilePresentations": [],
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the nonbleeding vessel stigma from the observable ulcer base and choose an initial management strategy.",
    "reviewerNotes": "Confirm clinical stability, the vessel description and the escalation boundary. No exact vital threshold, PPI dose or treatment deadline is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "perform_endoscopic_hemostasis": "perform_endoscopic_hemostasis",
      "choice.qq20261102.b40.d1": "oral_ppi_without_hemostasis",
      "choice.qq20261102.b40.d2": "biopsy_vessel"
    },
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the named visible-vessel summary and biopsy/repeat-only fillers with an observation and three plausible treatment strategies of similar scope."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r2",
      "conceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
      "stem": "Which treatment plan should be arranged for {patientName}'s ulcer finding?",
      "answerChoices": [
        {
          "id": "perform_endoscopic_hemostasis",
          "label": "Endoscopic hemostasis and acid suppression",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treats the nonbleeding protruding vessel as a lesion requiring endoscopic hemostasis rather than reassurance from the dry field."
        },
        {
          "id": "choice.qq20261102.b40.d1",
          "label": "Acid suppression and planned endoscopic reassessment",
          "isCorrect": false,
          "distractorRationale": "Defers hemostasis despite the supplied high-risk ulcer stigma."
        },
        {
          "id": "choice.qq20261102.b40.d2",
          "label": "Angiographic embolization and acid suppression",
          "isCorrect": false,
          "distractorRationale": "Escalates to an alternative intervention before an indicated initial endoscopic hemostasis attempt."
        }
      ],
      "explanation": "A nonbleeding visible vessel warrants endoscopic hemostasis with appropriate acid suppression. A dry field does not make it a clean-base ulcer. Angiographic embolization generally follows failed endoscopic control or rebleeding management rather than replacing the initial indicated endoscopic approach.",
      "supportingEvidenceClaimIds": [
        "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
        "claim.qq20261102.ulcer-initial-treatment",
        "claim.qq20261102.ulcer-rescue-embolization"
      ],
      "teachingPoint": "A nonbleeding visible vessel warrants endoscopic hemostasis with appropriate acid suppression. A dry field does not make it a clean-base ulcer. Angiographic embolization generally follows failed endoscopic control or rebleeding management rather than replacing the initial indicated endoscopic approach."
    },
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
        "patientPresentationVariantId": "presentation.peptic-ulcer-bleeding.visible-vessel-treat",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Recent upper-GI bleeding",
        "revisedPresentation": "{patientName}, a hemodynamically stable adult, undergoes EGD after recent melena. A duodenal ulcer is no longer actively bleeding but contains a clearly visible vessel.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Outpatient Patient"
    },
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}"
  },
  {
    "id": "revision.qq20261102.b40-context",
    "auditId": "B40-context",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-049.2026-08-10.1"
    ],
    "previousStem": "Which option is inappropriate as sole endoscopic treatment?",
    "previousChoiceLabels": [
      "Epinephrine plus bipolar coagulation",
      "Epinephrine injection alone",
      "Bipolar coagulation alone",
      "Endoscopic clip alone"
    ],
    "educationalIntent": "context_companion",
    "intendedInference": "Interpret the preserved context task without a surface cue supplied to the later task.",
    "reviewerNotes": "Context-only identity: shared presentation or returned result changed. Preserve the original objective, key and operational contract; clinical review still required.",
    "contextCompanion": true,
    "choiceSourceIds": {},
    "batchReview": {
      "reviewedOn": "2026-11-02",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared presentation/returned result and make the task patient-specific. Retain this companion's original choices, key, objective and operational service/gate contracts; it is not counted among the forty full option-set rewrites."
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r2",
      "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
      "stem": "Which endoscopic option should be avoided as sole treatment for {patientName}'s nonbleeding ulcer vessel?",
      "answerChoices": [
        {
          "id": "epinephrine_plus_bipolar",
          "label": "Epinephrine plus bipolar coagulation",
          "isCorrect": false,
          "distractorRationale": "This pairs epinephrine with a definitive contact-thermal modality and is an acceptable combination pathway."
        },
        {
          "id": "epinephrine_alone",
          "label": "Epinephrine injection alone",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "For a nonbleeding visible vessel, accepted thermal or mechanical therapy may be used alone or with epinephrine. Epinephrine alone is not definitive hemostasis, while two definitive modalities are not automatically required."
        },
        {
          "id": "bipolar_alone",
          "label": "Bipolar coagulation alone",
          "isCorrect": false,
          "distractorRationale": "Contact thermal therapy is an accepted monotherapy for a nonbleeding visible vessel."
        },
        {
          "id": "clip_alone",
          "label": "Endoscopic clip alone",
          "isCorrect": false,
          "distractorRationale": "Mechanical clip therapy is an accepted monotherapy for a nonbleeding visible vessel."
        }
      ],
      "explanation": "For a nonbleeding visible vessel, accepted thermal or mechanical therapy may be used alone or with epinephrine. Epinephrine alone is not definitive hemostasis, while two definitive modalities are not automatically required.",
      "supportingEvidenceClaimIds": [
        "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities",
        "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy"
      ],
      "teachingPoint": "For a nonbleeding visible vessel, accepted thermal or mechanical therapy may be used alone or with epinephrine. Epinephrine alone is not definitive hemostasis, while two definitive modalities are not automatically required."
    }
  }
];
