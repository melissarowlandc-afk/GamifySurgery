import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** New drafts; every prior definition and reviewed identity remains retained. */
export const QUESTION_BANK_BATCH2A_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.qbp2a.20261104.b2a01",
    "auditId": "B2A01",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v1.r4",
    "questionVariantId": "question.achalasia.manometric-recognition.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which motility diagnosis fits {patientName}'s pressure tracing?",
    "previousChoiceLabels": [
      "Achalasia",
      "Esophagogastric junction outflow obstruction",
      "Distal esophageal spasm"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
      "items": [
        {
          "label": "Junction measurement",
          "value": "Median relaxation pressure above the laboratory reference range"
        },
        {
          "label": "Body tracing",
          "value": "Pressure rises along the whole body simultaneously; no contractile peak travels distally"
        },
        {
          "label": "Distribution",
          "value": "The same body pattern occurs throughout the test swallows"
        }
      ]
    },
    "educationalIntent": "accepted_basic_image_representation_new_version_pending_review",
    "intendedInference": "Distinguish simultaneous body pressurization from a propagated contraction. Then: Combine the displayed pattern with the junction measurement to classify the motor finding.",
    "reviewerNotes": "Same scored manometric-recognition objective; only its evidence presentation changes. The old owner-reviewed version is retained.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_1": "achalasia_1",
      "choice.qq20261102b.b01.d1": "choice.qq20261102b.b01.d1",
      "choice.qq20261102b.b01.d2": "choice.qq20261102b.b01.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_1": null,
      "choice.qq20261102b.b01.d1": null,
      "choice.qq20261102b.b01.d2": null
    },
    "choiceTimingOverrides": {
      "achalasia_1": {
        "kind": "no_test"
      },
      "choice.qq20261102b.b01.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102b.b01.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.achalasia.manometric-recognition.v1.r5",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis fits {patientName}'s pressure tracing?",
      "answerChoices": [
        {
          "id": "achalasia_1",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis."
        },
        {
          "id": "choice.qq20261102b.b01.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        },
        {
          "id": "choice.qq20261102b.b01.d2",
          "label": "Distal esophageal spasm",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        }
      ],
      "explanation": "Simultaneous pressurization does not establish a propagated contraction. Integrating absent true peristalsis with impaired junction relaxation supports achalasia rather than preserved-peristalsis outflow obstruction or spasm.",
      "teachingPoint": "Simultaneous pressurization does not establish a propagated contraction. Integrating absent true peristalsis with impaired junction relaxation supports achalasia rather than preserved-peristalsis outflow obstruction or spasm.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102a.pressure-not-peristalsis"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "image",
        "caption": "Constructed pressure-study schematic; qualitative teaching observations, not a patient recording.",
        "assetPath": "clinical-exhibits/batch2a-b01-pressure.png",
        "description": "The junction relaxation measurement is above this laboratory’s reference range. In each illustrated swallow the upper, middle and lower esophageal-body channels rise together and fall together; no peak travels from the upper to the lower channel. The report states that this pattern occurs throughout the standard swallow series.",
        "width": 1200,
        "height": 720
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.manometric-recognition",
      "nextConceptId": "concept.achalasia.manometric-recognition",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored manometric-recognition objective; only its evidence presentation changes. The old owner-reviewed version is retained."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B01",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Supply an actual local schematic image in place of the prose-only exhibit. Keep the owner-reviewed task, options, explanation, shared presentation and passed companion exact; give the image version a new draft identity.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a02",
    "auditId": "B2A02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v2.r4",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which interpretation and planning decision should follow {patientName}'s study?",
    "previousChoiceLabels": [
      "Conclusive achalasia pattern; arrange junction-directed treatment assessment",
      "Inconclusive outflow-obstruction pattern; obtain corroboration before treatment assessment",
      "Absent-contractility pattern; arrange reflux-directed management assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed technically adequate pressure study; references are specific to this laboratory.",
      "items": [
        {
          "label": "Primary supine series",
          "value": "Ten wet swallows; median relaxation pressure above the laboratory upper reference limit"
        },
        {
          "label": "Secondary upright series",
          "value": "Median relaxation pressure within the reference range"
        },
        {
          "label": "Esophageal body in both positions",
          "value": "Every swallow has DCI below 100 mmHg.s.cm; no premature or propagated distal contraction"
        }
      ]
    },
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Apply the primary-position finding despite the different upright measurement. Then: Choose the offered treatment addressing the established physiology, rather than a diagnostic-label-matched medical shortcut.",
    "reviewerNotes": "New qualitative treatment claims reuse two real recorded guidelines offline. Their prior access/authority records concern narrower checks; treatment alignment and candidate suitability require foregut clinician/source review. No new retrieval, dose, treatment threshold or superiority over other definitive procedures is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_2": "achalasia_2",
      "choice.qbp2a.20261104.b2a02.d1": "choice.qq20261102b.b02.d1",
      "choice.qbp2a.20261104.b2a02.d2": "choice.qq20261102b.b02.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_2": null,
      "choice.qbp2a.20261104.b2a02.d1": null,
      "choice.qbp2a.20261104.b2a02.d2": null
    },
    "choiceTimingOverrides": {
      "achalasia_2": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a02.d1": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a02.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.achalasia.manometric-recognition.v2.r5",
      "conceptId": "concept.achalasia.physiology-directed-treatment.v1",
      "stem": "Which treatment should be offered to {patientName} on the basis of this workup?",
      "answerChoices": [
        {
          "id": "achalasia_2",
          "label": "Laparoscopic Heller myotomy",
          "isCorrect": true,
          "rationale": "The adequate primary-position study establishes absent peristalsis with impaired junction relaxation. Myotomy is an established junction-directed treatment.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a02.d1",
          "label": "Oral omeprazole therapy",
          "isCorrect": false,
          "distractorRationale": "Reflux-directed acid suppression does not treat the demonstrated junction-relaxation and body-motility problem. A normal upright pressure does not erase the adequate primary-series findings."
        },
        {
          "id": "choice.qbp2a.20261104.b2a02.d2",
          "label": "Oral isosorbide dinitrate therapy",
          "isCorrect": false,
          "distractorRationale": "Pharmacological junction relaxation is a less effective palliative approach, rather than the preferred durable treatment for a routine procedural candidate. It can have a role when definitive options are unsuitable."
        }
      ],
      "explanation": "The primary series has abnormal junction relaxation and failed contractions throughout; the upright measurement does not impose the both-position rule for EGJOO on this pattern. Offer a junction-directed definitive treatment. Heller myotomy is the appropriate offered procedure; pneumatic dilation and POEM are also legitimate options in suitable patients but are not compared here. Omeprazole does not correct this physiology, and nitrate therapy is generally a palliative option when definitive therapy is unsuitable.",
      "teachingPoint": "The primary series has abnormal junction relaxation and failed contractions throughout; the upright measurement does not impose the both-position rule for EGJOO on this pattern. Offer a junction-directed definitive treatment. Heller myotomy is the appropriate offered procedure; pneumatic dilation and POEM are also legitimate options in suitable patients but are not compared here. Omeprazole does not correct this physiology, and nitrate therapy is generally a palliative option when definitive therapy is unsuitable.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102a.primary-position-achalasia",
        "claim.qq20261102.motility-egjoo",
        "claim.achalasia.manometric-recognition",
        "claim.qbp2a.achalasia-heller",
        "claim.qbp2a.achalasia-ppi",
        "claim.qbp2a.achalasia-nitrates"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed technically adequate pressure study; references are specific to this laboratory.",
        "items": [
          {
            "label": "Primary supine series",
            "value": "Ten wet swallows; median relaxation pressure above the laboratory upper reference limit"
          },
          {
            "label": "Secondary upright series",
            "value": "Median relaxation pressure within the reference range"
          },
          {
            "label": "Esophageal body in both positions",
            "value": "Every swallow has DCI below 100 mmHg.s.cm; no premature or propagated distal contraction"
          }
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.manometric-recognition",
      "nextConceptId": "concept.achalasia.physiology-directed-treatment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The score changes from a manometric classification/assessment label to a specific treatment choice. Retain the diagnostic concept and its FSRS history."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B02",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replace generic treatment assessment with three named treatments. Remove the failed-reflux-therapy sentence so omeprazole is not pre-excluded independently of the study. Preserve the actual manometry observations.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousPresentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.night-regurgitation.female.57",
        "presentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux."
      },
      {
        "id": "profile.achalasia.night-regurgitation.male.57",
        "presentation": "{patientName}, a 57-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux."
      },
      {
        "id": "profile.achalasia.night-regurgitation.female.63",
        "presentation": "{patientName}, a 63-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux."
      },
      {
        "id": "profile.achalasia.night-regurgitation.male.63",
        "presentation": "{patientName}, a 63-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.achalasia.night-regurgitation",
        "patientPresentationVariantId": "presentation.achalasia.night-regurgitation",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.achalasia.night-regurgitation.female.57",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.female.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.achalasia.night-regurgitation.male.57",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.male.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 57-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.achalasia.night-regurgitation.female.63",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.female.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.achalasia.night-regurgitation.male.63",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.male.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
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
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2a.20261104.",
      "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a03",
    "auditId": "B2A03",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2.r6",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which acquisition should determine {patientName}'s esophageal-body classification?",
    "previousChoiceLabels": [
      "Single wet swallows after baseline recovery",
      "Multiple rapid swallows followed by a recovery swallow",
      "Upright rapid drinking followed by clearance swallows"
    ],
    "previousCurrentUpdate": "The catheter spans the junction. The outside tracing has three water swallows in quick succession: a second swallow begins before the pressure response to the first has ended, followed by the third. Distal contraction appears after the last swallow. Other attempts were stopped during retching.",
    "previousExhibit": null,
    "currentUpdate": "The catheter spans the junction. The outside recording contains three water swallows in quick succession, each beginning before the preceding pressure response has ended. A distal contraction appears after the final swallow. The remaining attempts stopped during retching.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize why the recorded rapid sequence does not establish the baseline motor phenotype. Then: Choose the clinical investigation needed to complete treatment-relevant physiology.",
    "reviewerNotes": "Same v2 objective: judge whether the existing pressure study answers the clinical question and select completion before treatment. No concept change.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_2": "manometry_2",
      "choice.qbp2a.20261104.b2a03.d1": "choice.qq20261102d.b02-context.d1",
      "choice.qbp2a.20261104.b2a03.d2": "choice.qq20261102d.b02-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_2": "service.esophageal_manometry",
      "choice.qbp2a.20261104.b2a03.d1": null,
      "choice.qbp2a.20261104.b2a03.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qbp2a.20261104.b2a03.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      },
      "choice.qbp2a.20261104.b2a03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
      }
    },
    "question": {
      "id": "question.achalasia.high-resolution-manometry.v2.r7",
      "conceptId": "concept.achalasia.high-resolution-manometry.v2",
      "stem": "Which investigation should be arranged next for {patientName}’s dysphagia?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "Repeat standard high-resolution esophageal manometry",
          "isCorrect": true,
          "rationale": "The rapid sequence cannot substitute for an adequate baseline series. Completing the physiologic assessment prevents treatment planning from an unclassifiable acquisition.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a03.d1",
          "label": "Obtain a timed barium esophagram with a tablet",
          "isCorrect": false,
          "distractorRationale": "This can assess emptying and corroborate obstruction, but does not supply the missing separated-swallow body classification."
        },
        {
          "id": "choice.qbp2a.20261104.b2a03.d2",
          "label": "Obtain ambulatory esophageal pH-impedance monitoring",
          "isCorrect": false,
          "distractorRationale": "Reflux monitoring answers a different remaining question and does not replace the missing baseline motility acquisition."
        }
      ],
      "explanation": "A rapid-swallow sequence can inhibit contractions and show a recovery response. It is not the baseline series needed to classify this patient’s body motility. Repeat HRM with an adequate separated-swallow protocol before acting on an apparent absent-contraction pattern; contrast emptying and reflux monitoring answer related but different questions.",
      "teachingPoint": "A rapid-swallow sequence can inhibit contractions and show a recovery response. It is not the baseline series needed to classify this patient’s body motility. Repeat HRM with an adequate separated-swallow protocol before acting on an apparent absent-contraction pattern; contrast emptying and reflux monitoring answer related but different questions.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.2",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.manometry.2",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "Same v2 objective: judge whether the existing pressure study answers the clinical question and select completion before treatment. No concept change."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B02-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replace the swallow-maneuver quiz with a concrete next-investigation decision. All choices are actual investigations, the key repeats an incomplete study, and the post-answer feedback stops before teaching the later treatment answer.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a04",
    "auditId": "B2A04",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r8",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v10"
    ],
    "previousStem": "Which change should be requested in {patientName}'s draft report?",
    "previousChoiceLabels": [
      "Revise the reserve conclusion; retain the outflow conclusion",
      "Retain the reserve conclusion; revise the outflow conclusion",
      "Revise the reserve conclusion; revise the outflow conclusion",
      "Retain the reserve conclusion; retain the outflow conclusion"
    ],
    "previousCurrentUpdate": "An earlier technically adequate pressure study includes separated swallows and two repeat rapid-swallow sequences. The draft report describes both provocative responses as normal. The recorded observations are shown below.",
    "previousExhibit": {
      "kind": "table",
      "caption": "Constructed observations from an earlier study; laboratory comparisons are qualitative.",
      "columnHeaders": [
        "Separated swallows",
        "Rapid-swallow sequences",
        "Upright rapid drinking"
      ],
      "rowHeaders": [
        "Esophageal-body response",
        "Junction and symptoms"
      ],
      "cells": [
        [
          "Propagated contractions between swallows",
          "Pressure falls during the sequence; neither repeat is followed by a contraction exceeding the baseline response",
          "No pressure column develops across the esophageal body"
        ],
        [
          "Relaxation within the laboratory range",
          "Relaxation during the sequence within the laboratory range",
          "Relaxation within the laboratory range; the familiar chest discomfort occurs"
        ]
      ]
    },
    "currentUpdate": "An outside pressure study includes the baseline swallow and repeat challenge recordings shown in the exhibit.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Compare the post-sequence contraction with the baseline rather than the inhibition phase. Then: Interpret the pressure response during symptomatic drinking without equating symptoms with obstruction.",
    "reviewerNotes": "Same v3 reserve-versus-outflow interpretation objective; report editing is removed without changing the scored clinical meaning.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qbp2a.20261104.b2a04.d1": "choice.qq20261102f.b03-context.d1",
      "choice.qbp2a.20261104.b2a04.d2": "choice.qq20261102f.b03-context.d2",
      "choice.qbp2a.20261104.b2a04.d3": "choice.qq20261102f.b03-context.d3"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.esophageal_manometry",
      "choice.qbp2a.20261104.b2a04.d1": null,
      "choice.qbp2a.20261104.b2a04.d2": null,
      "choice.qbp2a.20261104.b2a04.d3": null
    },
    "choiceTimingOverrides": {
      "manometry_3": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a04.d1": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a04.d2": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a04.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.achalasia.high-resolution-manometry.v3.r9",
      "conceptId": "concept.achalasia.high-resolution-manometry.v3",
      "stem": "Which paired interpretation best fits {patientName}’s displayed recordings?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "Reduced contraction reserve with preserved liquid-load outflow",
          "isCorrect": true,
          "rationale": "Lack of post-sequence augmentation on both repeats indicates reduced reserve; symptoms during drinking do not by themselves establish outflow obstruction when the pressure observations remain reassuring.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a04.d1",
          "label": "Preserved contraction reserve with impaired liquid-load outflow",
          "isCorrect": false,
          "distractorRationale": "This treats inhibition during swallowing as evidence of post-swallow reserve and treats symptom reproduction as proof of outflow obstruction."
        },
        {
          "id": "choice.qbp2a.20261104.b2a04.d2",
          "label": "Reduced contraction reserve with impaired liquid-load outflow",
          "isCorrect": false,
          "distractorRationale": "This recognizes the reserve finding but overinterprets the familiar symptom despite the actual liquid-load pressure response."
        },
        {
          "id": "choice.qbp2a.20261104.b2a04.d3",
          "label": "Preserved contraction reserve with preserved liquid-load outflow",
          "isCorrect": false,
          "distractorRationale": "This correctly limits the outflow conclusion but confuses inhibition during the sequence with augmentation afterwards."
        }
      ],
      "explanation": "Assess the recovery contraction separately from inhibition during rapid swallowing. Both repeats lack augmentation relative to baseline, supporting reduced reserve. Junction relaxation and the absence of a body pressure column during drinking do not support impaired liquid-load outflow merely because discomfort occurs. These challenge observations do not assign the final motor diagnosis or explain every symptom.",
      "teachingPoint": "Assess the recovery contraction separately from inhibition during rapid swallowing. Both repeats lack augmentation relative to baseline, supporting reduced reserve. Junction relaxation and the absence of a body pressure column during drinking do not support impaired liquid-load outflow merely because discomfort occurs. These challenge observations do not assign the final motor diagnosis or explain every symptom.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qq20261102e.hrm-reserve-versus-outflow"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "image",
        "caption": "Constructed pressure-study schematic; qualitative teaching observations, not a patient recording.",
        "assetPath": "clinical-exhibits/batch2a-b03-pressure.png",
        "description": "Panel A shows a propagated baseline esophageal-body contraction. In both rapid-swallow repeats, body pressure falls during the sequence and the contraction afterwards is smaller than the baseline contraction. During the rapid-drink panel the junction relaxes within the laboratory range and no body-wide pressure column develops. The familiar discomfort occurs during that drink.",
        "width": 1200,
        "height": 720
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v3",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v3",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.3",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.manometry.3",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "Same v3 reserve-versus-outflow interpretation objective; report editing is removed without changing the scored clinical meaning."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B03-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Show an actual schematic instead of the table and normal-draft-report premise. Ask directly for the exhibit interpretation; use a balanced four-option matrix and retain the approved later opioid/physiology question byte for byte.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a05",
    "auditId": "B2A05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r8",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v10"
    ],
    "previousStem": "Which assessment should lead the plan for the activity that still limits {patientName}'s work?",
    "previousChoiceLabels": [
      "Hip-focused musculoskeletal assessment",
      "Hernia-focused surgical assessment",
      "Pubic-attachment rehabilitation assessment"
    ],
    "previousCurrentUpdate": "At a later review, the inguinal contour still appears with standing strain and withdraws on lying down. The work diary and examination now record the following. The existing exercise program continues.",
    "previousExhibit": {
      "kind": "table",
      "caption": "Current recorded activities and examination; this is later than the MRI-result visit.",
      "columnHeaders": [
        "Standing and coughing",
        "Deep squat to a low shelf",
        "Resisted adduction"
      ],
      "rowHeaders": [
        "Contour and discomfort",
        "Task performance"
      ],
      "cells": [
        [
          "Groin contour appears; no discomfort is reported",
          "Deep groin ache; contour remains withdrawn",
          "Brief pubic discomfort; contour remains withdrawn"
        ],
        [
          "Continues standing work",
          "Cannot reach the low shelf; hip rotation reproduces this ache",
          "Completes the resisted task"
        ]
      ]
    },
    "currentUpdate": "At review the deep ache on hip rotation has subsided. During stock lifting, a superficial groin lump still makes {patientName} stop; the episode settles when the lump is pressed back. Standing cough reproduces the lump on examination. Lying supine makes it withdraw.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate improved hip symptoms from the remaining reduction-responsive groin episodes. Then: Select treatment planning for the demonstrated activity-limiting hernia rather than more diagnosis or the prior rehabilitation target.",
    "reviewerNotes": "Same v3 care-priority objective with competing groin sources; the data and keyed priority now agree. No concept change.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qbp2a.20261104.b2a05.d1": "choice.qq20261102f.b05-context.d1",
      "choice.qbp2a.20261104.b2a05.d2": "choice.qq20261102f.b05-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qbp2a.20261104.b2a05.d1": null,
      "choice.qbp2a.20261104.b2a05.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_4": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a05.d1": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r9",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which next plan should be offered for {patientName}’s remaining work limitation?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Offer elective inguinal hernia repair",
          "isCorrect": true,
          "rationale": "The demonstrated reducible protrusion now tracks the task-limiting episodes while the separate hip ache has improved. Elective repair planning addresses the remaining limitation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a05.d1",
          "label": "Repeat a course of hip rehabilitation",
          "isCorrect": false,
          "distractorRationale": "This would be reasonable for continuing hip-limited function, but the recorded residual limitation now follows the protrusion rather than the improved rotation ache."
        },
        {
          "id": "choice.qbp2a.20261104.b2a05.d2",
          "label": "Repeat targeted dynamic groin ultrasonography",
          "isCorrect": false,
          "distractorRationale": "Another diagnostic study is not the needed step when the protrusion has already been demonstrated and is reproduced clinically during the limiting activity."
        }
      ],
      "explanation": "Use the interval response to separate the two complaints. The hip-related ache has improved, but the reducible groin protrusion still interrupts lifting and is reproduced on examination. Offer elective hernia repair planning. This does not guarantee that repair will treat unrelated musculoskeletal pain.",
      "teachingPoint": "Use the interval response to separate the two complaints. The hip-related ache has improved, but the reducible groin protrusion still interrupts lifting and is reproduced on examination. Offer elective hernia repair planning. This does not guarantee that repair will treat unrelated musculoskeletal pain.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same v3 care-priority objective with competing groin sources; the data and keyed priority now agree. No concept change."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B05-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Delete the diary/exercise framing and the contrived later dissociation of a known symptomatic hernia. Give coherent current examination/function observations and make elective hernia repair the key.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a06",
    "auditId": "B2A06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r6",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which imaging protocol should be requested for {patientName}?",
    "previousChoiceLabels": [
      "Pelvic MRI with strain views",
      "Pelvic MRI with hip-joint acquisitions",
      "Pelvic CT with intravenous contrast"
    ],
    "previousCurrentUpdate": "Groin ultrasound was obtained supine and standing during coughing and straining. The contour change and focal symptoms occurred during recording, with no protrusion through the inguinal canal seen. The adductor attachment is tender. The treating team has requested cross-sectional imaging before a repair decision.",
    "previousExhibit": null,
    "currentUpdate": "The outside ultrasound report contains two saved supine views at the tender adductor attachment. The phone photograph places the intermittent swelling higher, in the inguinal region.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Match the prior acquisition to the actual intermittent swelling rather than treating any ultrasound as a completed evaluation. Then: Request the missing targeted dynamic assessment rather than routine cross-sectional escalation.",
    "reviewerNotes": "Same v2 clinical imaging-adequacy objective; no concept change. A new gate binding is explicit, never patched into old frozen encounters.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qbp2a.20261104.b2a06.d1": "choice.qq20261102d.b06.d1",
      "choice.qbp2a.20261104.b2a06.d2": "choice.qq20261102d.b06.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_2": "service.ultrasound",
      "choice.qbp2a.20261104.b2a06.d1": null,
      "choice.qbp2a.20261104.b2a06.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2a.20261104.b2a06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qbp2a.20261104.b2a06.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which investigation should be arranged next for {patientName}’s intermittent groin swelling?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Repeat dynamic groin ultrasound",
          "isCorrect": true,
          "rationale": "The prior acquisition did not test the photographed site or provoking conditions. Targeted dynamic sonography addresses that actual gap before escalating imaging.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a06.d1",
          "label": "Obtain dynamic groin MRI",
          "isCorrect": false,
          "distractorRationale": "Dynamic MRI can help after a genuinely adequate but unresolved assessment; this record does not establish that such an assessment has been completed."
        },
        {
          "id": "choice.qbp2a.20261104.b2a06.d2",
          "label": "Obtain contrast-enhanced pelvic CT",
          "isCorrect": false,
          "distractorRationale": "Cross-sectional imaging is not a substitute for recognizing that the prior local examination sampled a different site and did not reproduce the event."
        }
      ],
      "explanation": "The outside study examined the adductor attachment without the site and provocation associated with the intermittent lump. Arrange a targeted dynamic groin ultrasound. MRI remains a selected option for persistent uncertainty after an adequate assessment; it is not stipulated as the routine hernia pathway.",
      "teachingPoint": "The outside study examined the adductor attachment without the site and provocation associated with the intermittent lump. Arrange a targeted dynamic groin ultrasound. MRI remains a selected option for persistent uncertainty after an adequate assessment; it is not stipulated as the routine hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-inadequate-study-certainty",
        "claim.qq20261102c.groin-imaging-after-negative-study"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.mri",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.2",
        "resultTypeId": "service.mri",
        "pendingLabel": "Dynamic groin MRI pending",
        "resultNarrative": "Dynamic MRI shows a small reducible inguinal protrusion and signal change at the adductor attachment. Coughing causes a brief groin twinge, but the patient completes lifting at work. Running stops because of medial-thigh pain reproduced by resisted adduction. Passive hip rotation does not reproduce that pain.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mri.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.2",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "Targeted dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. Resisted adduction reproduces the separate medial-thigh pain. Coughing causes a brief groin twinge, but the patient completes lifting at work. Running stops because of medial-thigh pain reproduced by resisted adduction. Passive hip rotation does not reproduce that pain.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "reason": "Same v2 clinical imaging-adequacy objective; no concept change. A new gate binding is explicit, never patched into old frozen encounters."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B06",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Remove the stipulation that cross-sectional imaging has already been requested and the MRI-only protocol set. Use an incomplete outside examination, targeted ultrasound as key, and a correspondingly versioned ultrasound result gate. Preserve old MRI identities for frozen encounters.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a07",
    "auditId": "B2A07",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r8",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v10"
    ],
    "previousStem": "Which care priority best fits {patientName}'s current functional record?",
    "previousChoiceLabels": [
      "Hernia assessment with continued graded activity",
      "Hernia observation with continued graded activity",
      "Attachment reassessment with continued graded activity"
    ],
    "previousCurrentUpdate": "Following the MRI, {patientName} continues the graded exercise program with hernia observation. At review, jogging lasts longer. The rota lists completed work shifts, but the accompanying duty log records that a colleague now handles the stock crates. During an observed attempt to resume crate handling, the patient sets the crate down with pressure at the photographed groin contour; the contour withdraws on lying down. Resisted adduction still causes medial-thigh discomfort, but ordinary walking and the exercises are completed.",
    "previousExhibit": null,
    "currentUpdate": "After the targeted ultrasound, {patientName} continues the graded exercise program with hernia observation. At review, jogging lasts longer. The rota lists completed work shifts, but the accompanying duty log records that a colleague now handles the stock crates. During an observed attempt to resume crate handling, the patient sets the crate down with pressure at the photographed groin contour; the contour withdraws on lying down. Resisted adduction still causes medial-thigh discomfort, but ordinary walking and the exercises are completed.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Retain the existing interpretation of work actually attempted versus modified duties. Then: Keep the existing care-priority decision unchanged.",
    "reviewerNotes": "No clinical meaning change; chronology-only version. This is not a new owner approval or pipeline PASS.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qq20261102f.b06-context.d1": "choice.qq20261102f.b06-context.d1",
      "choice.qq20261102f.b06-context.d2": "choice.qq20261102f.b06-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qq20261102f.b06-context.d1": null,
      "choice.qq20261102f.b06-context.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_2": {
        "kind": "no_test"
      },
      "choice.qq20261102f.b06-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102f.b06-context.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r9",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which care priority best fits {patientName}'s current functional record?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Hernia assessment with continued graded activity",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Completed shifts on modified duties do not demonstrate recovery of the avoided lifting task. The current pressure/contour event supplies a hernia-related functional concern despite improved running and a coexisting attachment symptom."
        },
        {
          "id": "choice.qq20261102f.b06-context.d1",
          "label": "Hernia observation with continued graded activity",
          "isCorrect": false,
          "distractorRationale": "This mistakes attendance on modified duties and longer jogging for unrestricted work function. It overlooks the task that remains unperformed and the observed groin event on attempting it."
        },
        {
          "id": "choice.qq20261102f.b06-context.d2",
          "label": "Attachment reassessment with continued graded activity",
          "isCorrect": false,
          "distractorRationale": "The persistent adduction symptom is a credible reason for musculoskeletal review, but the actual remaining crate-handling interruption occurs with the separate groin pressure/contour event."
        }
      ],
      "explanation": "Functional recovery must be read against the work actually attempted. Longer jogging and completed modified shifts do not settle the avoided lifting task. The current groin event supports elective hernia assessment while graded activity and the coexisting attachment symptoms continue to be addressed. This does not require immediate repair.",
      "teachingPoint": "Functional recovery must be read against the work actually attempted. Longer jogging and completed modified shifts do not settle the avoided lifting task. The current groin event supports elective hernia assessment while graded activity and the coexisting attachment symptoms continue to be addressed. This does not require immediate repair.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "No clinical meaning change; chronology-only version. This is not a new owner approval or pipeline PASS."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B06-context-continuity",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Necessary companion wording only: replace the opening MRI reference with targeted ultrasound after B06’s corrected gate. All other observations, task, choices, feedback and concept remain exact.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a08",
    "auditId": "B2A08",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r8",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v10"
    ],
    "previousStem": "Which assessment should lead the next plan for {patientName}'s remaining caregiving difficulty?",
    "previousChoiceLabels": [
      "Attachment assessment alongside the current exercise program",
      "Inguinal-hernia assessment alongside the current exercise program",
      "Hip-joint assessment alongside the current exercise program"
    ],
    "previousCurrentUpdate": "At a later reassessment, the patient continues a maintenance exercise program after the initial supervised phase. The groin contour withdraws when supine. During coughing it appears without pain. The caregiving log describes medial pubic pain during transfers from a low chair, including transfers when no contour is visible. A transfer from a raised chair is completed while the contour is visible. Resisted adduction reproduces the low-chair pain; hip rotation produces a different deep ache.",
    "previousExhibit": null,
    "currentUpdate": "After the exercise course, resisted adduction produces less pubic discomfort. Lifting the relative still brings out the inguinal lump and makes {patientName} put the relative down. Pressing the lump back relieves that episode. The same lump appears during standing strain and withdraws when supine.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Read the exercise response against the symptom that still interrupts lifting. Then: Choose care for the demonstrated reducible symptomatic hernia without promising to treat every groin pain source.",
    "reviewerNotes": "Same v3 care-priority objective; no concept change.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qbp2a.20261104.b2a08.d1": "choice.qq20261102f.b07-context.d1",
      "choice.qbp2a.20261104.b2a08.d2": "choice.qq20261102f.b07-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qbp2a.20261104.b2a08.d1": null,
      "choice.qbp2a.20261104.b2a08.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_3": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a08.d1": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a08.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r9",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which next plan should be offered for {patientName}’s continuing lifting limitation?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Offer elective inguinal hernia repair",
          "isCorrect": true,
          "rationale": "The limitation continues to track the reducible protrusion despite improvement of the separate attachment discomfort. Elective repair planning addresses the demonstrated symptomatic hernia.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a08.d1",
          "label": "Repeat supervised adductor rehabilitation",
          "isCorrect": false,
          "distractorRationale": "The original attachment complaint has improved; another course directed there does not address the recorded reduction-responsive lifting episodes."
        },
        {
          "id": "choice.qbp2a.20261104.b2a08.d2",
          "label": "Repeat targeted dynamic groin ultrasonography",
          "isCorrect": false,
          "distractorRationale": "The diagnosis is already demonstrated by imaging and current provoked examination. The remaining decision concerns care for symptoms rather than obtaining the same confirmation again."
        }
      ],
      "explanation": "The course and current provocation now support an activity-limiting hernia, rather than assigning its lifting episodes to the separately improving attachment complaint. Offer elective inguinal hernia repair planning. Continue to distinguish other pain from the symptom the repair is intended to address.",
      "teachingPoint": "The course and current provocation now support an activity-limiting hernia, rather than assigning its lifting episodes to the separately improving attachment complaint. Offer elective inguinal hernia repair planning. Continue to distinguish other pain from the symptom the repair is intended to address.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same v3 care-priority objective; no concept change."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B07-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Remove the artificial late symptom/contour dissociation that contradicted the established history. Keep coexisting symptoms but make the ongoing functional episode and key clinically consistent.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a09",
    "auditId": "B2A09",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r8",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v10"
    ],
    "previousStem": "Which issue should {patientName}'s completion-sampling request ask the pathology review to resolve first?",
    "previousChoiceLabels": [
      "Correlate the submitted site with the procedure photograph",
      "Reassess the existing fragment with additional tissue levels",
      "Reassess the existing fragment with additional immunostains"
    ],
    "previousCurrentUpdate": "The outside request labels the punch as central. The procedure photograph shows the punch opening touching the pale lateral border, with an intact darker focus medial to it. The report diagnoses a nevus in the submitted fragment. Serial photographs show enlargement of the medial focus while the pale lateral border has the same outline. Completion sampling is being arranged with the existing slides available for review.",
    "previousExhibit": null,
    "currentUpdate": "A punch from the pale lateral edge contains a nevus. The darker medial portion remains in place and has enlarged on serial photographs.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Limit the benign result to the sampled pale sector. Then: Choose the diagnostic specimen that can settle the accessible residual lesion rather than refining an unrepresentative fragment.",
    "reviewerNotes": "The score changes from adjudicating specimen provenance before a preselected completion procedure to choosing the clinically needed diagnostic action. Preserve the v3 partial-evidence construct and its histories; v4 already exists for a distinct locally in-situ specimen application and is not overwritten.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qbp2a.20261104.b2a09.d1": "choice.qq20261102f.b12-context.d1",
      "choice.qbp2a.20261104.b2a09.d2": "choice.qq20261102f.b12-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qbp2a.20261104.b2a09.d1": null,
      "choice.qbp2a.20261104.b2a09.d2": null
    },
    "choiceTimingOverrides": {
      "excisional_4": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.qbp2a.20261104.b2a09.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qbp2a.20261104.b2a09.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pathology_review"
      }
    },
    "question": {
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      "stem": "Which next diagnostic step should be arranged for {patientName}’s remaining lesion?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Perform a narrow-margin excisional biopsy",
          "isCorrect": true,
          "rationale": "Complete narrow-margin diagnostic sampling can evaluate the residual changing lesion’s architecture and invasion when the small accessible site permits it.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a09.d1",
          "label": "Perform a punch biopsy of the darker portion",
          "isCorrect": false,
          "distractorRationale": "This targets the unrepresented focus but may still leave lesion architecture or maximum depth unresolved when complete diagnostic excision is feasible."
        },
        {
          "id": "choice.qbp2a.20261104.b2a09.d2",
          "label": "Request deeper histological sections from the block",
          "isCorrect": false,
          "distractorRationale": "Further sections of the pale-edge fragment cannot represent the still-unsampled changing medial tissue."
        }
      ],
      "explanation": "A benign result in one sector does not settle the residual changing lesion. Complete full-thickness diagnostic excision with narrow clinical margins is appropriate at this small accessible site. Another limited punch or more levels from the original fragment can leave the key tissue unrepresented; definitive wide margins await diagnosis and microstaging.",
      "teachingPoint": "A benign result in one sector does not settle the residual changing lesion. Complete full-thickness diagnostic excision with narrow clinical margins is appropriate at this small accessible site. Another limited punch or more levels from the original fragment can leave the key tissue unrepresented; definitive wide margins await diagnosis and microstaging.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.mapped-partial-skin-evidence"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.4",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The completed primary specimen measures 1.5 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. Ultrasound-guided sampling of its solid cortex contains malignant melanocytes matching the skin primary. Distant staging has not yet been completed.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.4",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The completed primary specimen measures 1.5 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. Ultrasound-guided sampling of its solid cortex contains malignant melanocytes matching the skin primary. Distant staging has not yet been completed.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "reason": "The score changes from adjudicating specimen provenance before a preselected completion procedure to choosing the clinically needed diagnostic action. Preserve the v3 partial-evidence construct and its histories; v4 already exists for a distinct locally in-situ specimen application and is not overwritten."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B12-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replace the low-value request-label/procedure-photo dispute with an actual diagnostic action. Keep the important benign-fragment trap, remove the already-arranged-completion sentence, and use three specific sampling strategies.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a10",
    "auditId": "B2A10",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r8",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v10"
    ],
    "previousStem": "Which comparison should {patientName}'s team prioritize for its next PDSA test?",
    "previousChoiceLabels": [
      "Source L manual entry versus source L prefill",
      "Source N manual entry versus source N prefill",
      "Source N manual entry versus source L prefill"
    ],
    "previousCurrentUpdate": "The next cycle will test an entry adaptation with the same interview, final clinical review and record-agreement checks. Source L is the signed visit narrative list; source M is the prior-visit list; source N is a structured list reconciled for that visit. The team aims to reduce entry work while retaining agreement with the reconciled medication record.",
    "previousExhibit": {
      "kind": "table",
      "caption": "Constructed pilot data: the same ten visit records are processed under each workflow. Time is total form-entry staff-minutes; agreement counts forms matching the reconciled record; contacts are recorded for those ten simulated visits.",
      "columnHeaders": [
        "Source L, manual entry",
        "Source M, manual entry",
        "Source M, prefilled entry",
        "Source N, manual entry"
      ],
      "rowHeaders": [
        "Form-entry staff-minutes",
        "Forms agreeing with reconciled record",
        "Unplanned medication-clarification contacts"
      ],
      "cells": [
        [
          "50",
          "50",
          "15",
          "15"
        ],
        [
          "10 of 10",
          "6 of 10",
          "6 of 10",
          "10 of 10"
        ],
        [
          "8",
          "12",
          "12",
          "8"
        ]
      ]
    },
    "currentUpdate": "Automatic transfer takes less staff time. Before expanding the pilot, the team checks the following example against the reconciled record.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the shared schedule of the missing entries from the actual record comparison. Then: Adapt and retest the affected transfer component while retaining the useful time improvement.",
    "reviewerNotes": "Same PDSA Act/adapt-and-retest objective, now applied to a practical surgical-clinic workflow. No concept change or gameplay analytics.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qbp2a.20261104.b2a10.d1": "choice.qq20261102f.b36.d1",
      "choice.qbp2a.20261104.b2a10.d2": "choice.qq20261102f.b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qbp2a.20261104.b2a10.d1": null,
      "choice.qbp2a.20261104.b2a10.d2": null
    },
    "choiceTimingOverrides": {
      "correct_abandon-harm": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a10.d1": {
        "kind": "no_test"
      },
      "choice.qbp2a.20261104.b2a10.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r9",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which change should {patientName}’s team test next?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Test importing as-needed medication entries",
          "isCorrect": true,
          "rationale": "The omitted entries share the as-needed schedule. Adapt that transfer component and test it against the same verified record while reassessing accuracy and staff work.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a10.d1",
          "label": "Test filtering duplicate entries during transfer",
          "isCorrect": false,
          "distractorRationale": "The example shows missing entries rather than duplicates. A duplicate filter targets a different observed failure."
        },
        {
          "id": "choice.qbp2a.20261104.b2a10.d2",
          "label": "Test manual medication-list re-entry",
          "isCorrect": false,
          "distractorRationale": "This may restore a complete list but discards the time-saving component before testing a targeted repair of the demonstrated omission pattern."
        }
      ],
      "explanation": "The two missing entries share an as-needed schedule; the listed regular entries transferred. Use the small pilot to adapt that component and retest completeness and staff time. The data do not show duplicate entries, and faster transfer does not justify expanding an incomplete process.",
      "teachingPoint": "The two missing entries share an as-needed schedule; the listed regular entries transferred. Use the small pilot to adapt that component and retest completeness and staff time. The data do not show duplicate entries, and faster transfer does not justify expanding an incomplete process.",
      "supportingEvidenceClaimIds": [
        "claim.quality-improvement.pdsa-linked-iterative-tests",
        "claim.quality-improvement.act-adopt-adapt-abandon",
        "claim.quality-improvement.next-step-follows-results",
        "claim.qq20261102b.pdsa-hypothesis-not-proof"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed preoperative list-transfer check; illustrative entries, not prescribing instructions.",
        "columnHeaders": [
          "Medication in reconciled record",
          "Recorded schedule",
          "Automatically transferred entry"
        ],
        "rowHeaders": [
          "Entry A",
          "Entry B",
          "Entry C",
          "Entry D"
        ],
        "cells": [
          [
            "Amlodipine",
            "Daily",
            "Amlodipine"
          ],
          [
            "Metformin",
            "With meals",
            "Metformin"
          ],
          [
            "Paracetamol",
            "When needed for pain",
            "No entry"
          ],
          [
            "Ondansetron",
            "When needed for nausea",
            "No entry"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "nextConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same PDSA Act/adapt-and-retest objective, now applied to a practical surgical-clinic workflow. No concept change or gameplay analytics."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B36",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replace source-letter abstractions and the priority-of-comparisons puzzle with a concrete preoperative medication-list omission. Remove redundant contact rows; compare three specific next pilot actions.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName} leads a preoperative-clinic medication-list pilot. An automatic transfer is compared with manual entry from the same reconciled record.",
    "previousPresentation": "{patientName} leads an employee quality meeting about a structured visit form. Each workflow includes medication reconciliation, transfer of the list into the form, and final clinician review. The team is studying medication-clarification contacts and staff time; record agreement is checked against the list reconciled for that visit.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102e.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v8",
        "revisedChiefComplaint": "Pathway improvement review",
        "revisedPresentation": "{patientName} leads an employee quality meeting about a structured visit form. Each workflow includes medication reconciliation, transfer of the list into the form, and final clinician review. The team is studying medication-clarification contacts and staff time; record agreement is checked against the list reconciled for that visit.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2a.20261104.",
      "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1"
    }
  },
  {
    "id": "revision.qbp2a.20261104.b2a11",
    "auditId": "B2A11",
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "previousQuestionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-17.1"
    ],
    "previousStem": "Which hormonal screen should {patientName} receive?",
    "previousChoiceLabels": [
      "Overnight dexamethasone test",
      "Plasma-free metanephrines",
      "Aldosterone-renin ratio",
      "Late-night salivary cortisol"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the stated cortisol component from the rest of adrenal hormonal evaluation. Then: Choose the recommended incidentaloma screen among actual cortisol studies rather than treating several hormonal axes as mutually exclusive.",
    "reviewerNotes": "The key and exact 1-mg dose use the existing directly checked ESE/AAES claim. Offered alternative-test ranking needs endocrine review; no new numeric diagnostic threshold or claim about a complete hormonal algorithm.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dst_4": "dst_4",
      "choice.qbp2a.20261104.b2a11.d1": "metanephrines_4",
      "choice.qbp2a.20261104.b2a11.d2": "aldosterone_4"
    },
    "choiceServiceOverrides": {
      "dst_4": null,
      "choice.qbp2a.20261104.b2a11.d1": null,
      "choice.qbp2a.20261104.b2a11.d2": null
    },
    "choiceTimingOverrides": {
      "dst_4": {
        "kind": "test",
        "timingProfileId": "timing.test.dexamethasone_suppression"
      },
      "choice.qbp2a.20261104.b2a11.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2a.20261104.b2a11.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.twenty_four_hour_protocol"
      }
    },
    "question": {
      "id": "question.adrenal-incidentaloma.one-mg-dst.v4.r2",
      "conceptId": "concept.adrenal-incidentaloma.one-mg-dst",
      "stem": "Which study should be used to assess cortisol secretion in {patientName}’s adrenal evaluation?",
      "answerChoices": [
        {
          "id": "dst_4",
          "label": "1-mg overnight dexamethasone test",
          "isCorrect": true,
          "rationale": "The incidentaloma guideline recommends this test for autonomous cortisol secretion in the routine adult setting. It is one component of assessment, not the entire adrenal workup.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2a.20261104.b2a11.d1",
          "label": "Late-night salivary cortisol measurement",
          "isCorrect": false,
          "distractorRationale": "This is a cortisol test used in other hypercortisolism evaluations, but it is not the preferred offered screen for the incidentaloma scenario."
        },
        {
          "id": "choice.qbp2a.20261104.b2a11.d2",
          "label": "Urinary free cortisol measurement",
          "isCorrect": false,
          "distractorRationale": "Urinary cortisol evaluation can address other hypercortisolism questions; the offered incidentaloma-specific screen is the overnight dexamethasone test."
        }
      ],
      "explanation": "The task asks specifically about cortisol assessment. Use the 1-mg overnight dexamethasone suppression test as the guideline-recommended incidentaloma screen; the answer does not imply that every other hormonal question has already been addressed. Interpret any abnormal result in clinical context rather than treating it as an automatic indication for adrenalectomy.",
      "teachingPoint": "The task asks specifically about cortisol assessment. Use the 1-mg overnight dexamethasone suppression test as the guideline-recommended incidentaloma screen; the answer does not imply that every other hormonal question has already been addressed. Interpret any abnormal result in clinical context rather than treating it as an automatic indication for adrenalectomy.",
      "supportingEvidenceClaimIds": [
        "claim.brief.adrenal-incidentaloma.one-mg-dst"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.adrenal-incidentaloma.one-mg-dst",
      "nextConceptId": "concept.adrenal-incidentaloma.one-mg-dst",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same cortisol-screen selection objective; no concept change. The original broad-task variant remains retained for frozen encounters."
    },
    "ownerProgramReview": {
      "ownerItemId": "new-adrenal-question-flag",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Narrow the complete task to cortisol assessment and make all options cortisol tests. Remove the normal potassium/blood-pressure, benign-density and limited-life-expectancy exclusions that previously selected the lone offered axis.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends the clinic after CT performed for an unrelated complaint shows a 2.3-cm adrenal nodule.",
    "previousPresentation": "{patientName} is a 44-year-old woman who has a 2.3-cm homogeneous adrenal nodule measuring 7 HU on noncontrast CT. The patient has normal potassium and blood pressure and no frailty or limited-life-expectancy concern.",
    "previousProfilePresentations": [
      {
        "id": "profile.adrenal-incidentaloma.small-adrenal-adenoma.female.44",
        "presentation": "{patientName} is a 44-year-old woman who has a 2.3-cm homogeneous adrenal nodule measuring 7 HU on noncontrast CT. The patient has normal potassium and blood pressure and no frailty or limited-life-expectancy concern."
      },
      {
        "id": "profile.adrenal-incidentaloma.small-adrenal-adenoma.male.44",
        "presentation": "{patientName} is a 44-year-old man who has a 2.3-cm homogeneous adrenal nodule measuring 7 HU on noncontrast CT. The patient has normal potassium and blood pressure and no frailty or limited-life-expectancy concern."
      },
      {
        "id": "profile.adrenal-incidentaloma.small-adrenal-adenoma.female.60",
        "presentation": "{patientName} is a 60-year-old woman who has a 2.3-cm homogeneous adrenal nodule measuring 7 HU on noncontrast CT. The patient has normal potassium and blood pressure and no frailty or limited-life-expectancy concern."
      },
      {
        "id": "profile.adrenal-incidentaloma.small-adrenal-adenoma.male.60",
        "presentation": "{patientName} is a 60-year-old man who has a 2.3-cm homogeneous adrenal nodule measuring 7 HU on noncontrast CT. The patient has normal potassium and blood pressure and no frailty or limited-life-expectancy concern."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 44,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2a.20261104.",
      "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1"
    }
  }
];

export const QUESTION_BANK_BATCH2A_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.achalasia.physiology-directed-treatment.v1",
    "displayName": "Select an offered treatment from the esophageal physiology",
    "learningObjective": "Interpret adequate positional manometry and choose a specific offered treatment for achalasia rather than reflux therapy or palliative pharmacological relaxation.",
    "conceptType": "management",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.achalasia.manometric-recognition",
    "versioningReason": "The score changes from a manometric classification/assessment label to a specific treatment choice. Retain the diagnostic concept and its FSRS history.",
    "revisedItemIds": [
      "B2A02"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102a.primary-position-achalasia",
      "claim.qq20261102.motility-egjoo",
      "claim.achalasia.manometric-recognition",
      "claim.qbp2a.achalasia-heller",
      "claim.qbp2a.achalasia-ppi",
      "claim.qbp2a.achalasia-nitrates"
    ],
    "contentVersion": "concept.question-bank-program.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
    "displayName": "Complete sampling of a changing residual pigmented lesion",
    "learningObjective": "Choose complete diagnostic sampling after a benign limited sector fails to represent a changing residual lesion at a site suitable for excision.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
    "versioningReason": "The score changes from adjudicating specimen provenance before a preselected completion procedure to choosing the clinically needed diagnostic action. Preserve the v3 partial-evidence construct and its histories; v4 already exists for a distinct locally in-situ specimen application and is not overwritten.",
    "revisedItemIds": [
      "B2A09"
    ],
    "evidenceClaimIds": [
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102a.melanoma-diagnostic-sampling",
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
      "claim.qq20261102e.mapped-partial-skin-evidence"
    ],
    "contentVersion": "concept.question-bank-program.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  }
];
