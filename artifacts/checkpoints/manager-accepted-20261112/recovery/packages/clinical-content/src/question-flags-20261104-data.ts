import type { QuestionFlagRevision, QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Additive drafts from voluntary flags. No approval transfers to a changed version. */
export const QUESTION_FLAG_DEFINITIONS: QuestionFlagRevision[] = [
  {
    "id": "revision.qf20261104.f01",
    "auditId": "F01",
    "caseId": "case.gs028c.dcis.a-one-mm-individualize",
    "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
    "previousQuestionVariantId": "question.dcis.margin-bcs-wbrt.v3",
    "questionVariantId": "question.dcis.margin-bcs-wbrt.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which surgical-margin approach best addresses {patientName}'s 1-mm negative margin after breast-conserving surgery for pure DCIS?",
    "previousChoiceLabels": [
      "Review for selective re-excision",
      "Accept the margin without review",
      "Plan routine margin re-excision",
      "Plan mastectomy for margin width"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned.",
    "previousPresentation": "{patientName}, a 45-year-old woman, returns after lumpectomy for pure DCIS. The closest margin is negative but 1 mm; whole-breast irradiation is planned, and the report describes the involved extent and location.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.45",
        "presentation": "{patientName}, a 45-year-old woman, returns after lumpectomy for pure DCIS. The closest margin is negative but 1 mm; whole-breast irradiation is planned, and the report describes the involved extent and location."
      },
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.61",
        "presentation": "{patientName}, a 61-year-old woman, returns after lumpectomy for pure DCIS. The closest margin is negative but 1 mm; whole-breast irradiation is planned, and the report describes the involved extent and location."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 45,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "DCIS follow-up",
    "previousChiefComplaint": "Review a narrow margin",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.45"
      },
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.61"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish no DCIS on ink from an adequately assessed close margin; choose the information review that precedes an operation decision.",
    "reviewerNotes": "The existing margin claim directly supports the 2-mm boundary and extent/location/residual-imaging review. A reviewer must confirm the constructed record workflow; the item does not mandate re-excision for every 1-mm margin.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf20261104.f01.d1": "d1_3",
      "choice.qf20261104.f01.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf20261104.f01.d1": null,
      "choice.qf20261104.f01.d2": null
    },
    "question": {
      "id": "question.dcis.margin-bcs-wbrt.v3.r2",
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "stem": "Which next plan best addresses {patientName}'s surgical margin before irradiation?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Review oriented pathology and residual breast imaging",
          "isCorrect": true,
          "rationale": "The sub-2-mm negative margin requires assessment of extent, location and possible residual disease before choosing re-excision.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f01.d1",
          "label": "Schedule re-excision of the closest cavity margin",
          "isCorrect": false,
          "distractorRationale": "A close negative margin can warrant re-excision, but the distance does not settle that choice without the specimen and imaging assessment."
        },
        {
          "id": "choice.qf20261104.f01.d2",
          "label": "Proceed to irradiation using the margin-distance summary",
          "isCorrect": false,
          "distractorRationale": "A negative edge is not a complete assessment of a close DCIS margin; residual imaging and the extent/location of close disease matter."
        }
      ],
      "explanation": "A 1-mm negative DCIS margin does not automatically select re-excision or mastectomy. Review the oriented specimen and residual imaging before deciding whether further excision adds benefit in the setting of planned whole-breast irradiation.",
      "teachingPoint": "A 1-mm negative DCIS margin does not automatically select re-excision or mastectomy. Review the oriented specimen and residual imaging before deciding whether further excision adds benefit in the setting of planned whole-breast irradiation.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.dcis.margin-narrow-individualize"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dcis.margin-bcs-wbrt",
      "nextConceptId": "concept.dcis.margin-bcs-wbrt",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "4acc4724-8e4a-4de9-a08a-ecb539aad63c"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the confusing re-excision/evaluation near-pair. The key now names the records to review and the alternatives name actual next plans.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f02",
    "auditId": "F02",
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "previousQuestionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.1"
    ],
    "previousStem": "Which sensory pathway explains the diaphragm-to-shoulder referral discussed for this patient's benign symptom?",
    "previousChoiceLabels": [
      "Phrenic sensory pathway",
      "Median sensory pathway",
      "Ulnar sensory pathway",
      "Sciatic sensory pathway"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
    "previousPresentation": "{patientName}, a 42-year-old woman, returns after outside laparoscopic cholecystectomy with a nearly resolved mild shoulder ache. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, increasing abdominal pain, vomiting, jaundice or wound change.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "presentation": "{patientName}, a 42-year-old woman, returns after outside laparoscopic cholecystectomy with a nearly resolved mild shoulder ache. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, increasing abdominal pain, vomiting, jaundice or wound change."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "presentation": "{patientName}, a 42-year-old man, returns after outside laparoscopic cholecystectomy with a nearly resolved mild shoulder ache. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, increasing abdominal pain, vomiting, jaundice or wound change."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "presentation": "{patientName}, a 68-year-old woman, returns after outside laparoscopic cholecystectomy with a nearly resolved mild shoulder ache. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, increasing abdominal pain, vomiting, jaundice or wound change."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "presentation": "{patientName}, a 68-year-old man, returns after outside laparoscopic cholecystectomy with a nearly resolved mild shoulder ache. Vital signs and shoulder/abdominal examinations are reassuring, with normal shoulder motion and no chest pain, dyspnea, fever, increasing abdominal pain, vomiting, jaundice or wound change."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 42,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Shoulder ache",
    "previousChiefComplaint": "Shoulder pain follow-up",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the timing and local examination to distinguish a referred afferent source from nerves associated with the perceived shoulder site.",
    "reviewerNotes": "Phrenic referral and reassessment boundaries have existing claims. Clinician review must check the local-nerve contrasts; no new root-level localization or diagnostic certainty is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qf20261104.f02.d1": "d1_2",
      "choice.qf20261104.f02.d2": "d2_2",
      "choice.qf20261104.f02.d3": "d3_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qf20261104.f02.d1": null,
      "choice.qf20261104.f02.d2": null,
      "choice.qf20261104.f02.d3": null
    },
    "question": {
      "id": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r2",
      "conceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
      "stem": "Which nerve most likely carries the initiating afferent signal for {patientName}'s postoperative pain pattern?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Phrenic nerve",
          "isCorrect": true,
          "rationale": "The postoperative shoulder-tip pattern with preserved local function supports referred pain from diaphragmatic irritation through phrenic afferents.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f02.d1",
          "label": "Vagus nerve",
          "isCorrect": false,
          "distractorRationale": "A visceral pathway is a credible competing thought after abdominal surgery, but it does not explain this characteristic diaphragm-associated shoulder referral as well."
        },
        {
          "id": "choice.qf20261104.f02.d2",
          "label": "Suprascapular nerve",
          "isCorrect": false,
          "distractorRationale": "This is a local shoulder competitor, but the timing and preserved movement/power favor a referred source over a local shoulder-nerve injury."
        },
        {
          "id": "choice.qf20261104.f02.d3",
          "label": "Supraclavicular nerves",
          "isCorrect": false,
          "distractorRationale": "This is a credible alternative at the perceived pain site, but the question asks for the initiating afferent rather than the local sensory distribution."
        }
      ],
      "explanation": "Diaphragmatic irritation after laparoscopy can produce shoulder-tip pain through phrenic sensory afferents. The distribution and local examination support that explanation here; they do not prove that all postoperative shoulder pain is benign. New respiratory symptoms, fever or worsening abdominal symptoms require reassessment.",
      "teachingPoint": "Diaphragmatic irritation after laparoscopy can produce shoulder-tip pain through phrenic sensory afferents. The distribution and local examination support that explanation here; they do not prove that all postoperative shoulder pain is benign. New respiratory symptoms, fever or worsening abdominal symptoms require reassessment.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain",
        "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
      "nextConceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "a0a20925-6852-4fdf-bee4-997d10a89305"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced median/ulnar/sciatic distractors with vagal and shoulder-region competitors. Removed the supplied diaphragm-to-shoulder pathway and the benign label from the task.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f03",
    "auditId": "F03",
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "previousQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-28.pre-endoscopy.1"
    ],
    "previousStem": "What is the best planning approach?",
    "previousChoiceLabels": [
      "Individualized vascular consultation",
      "Proceed directly to intervention",
      "Continue compression as the sole plan",
      "Emergency hospitalization"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
    "previousPresentation": "{patientName} is a 43-year-old woman who presents with symptomatic reflux, substantial mobility limitations, and medical comorbidity that may change procedural benefit and feasibility. There is no ulcer or acute thrombosis.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.43",
        "presentation": "{patientName} is a 43-year-old woman who presents with symptomatic reflux, substantial mobility limitations, and medical comorbidity that may change procedural benefit and feasibility. There is no ulcer or acute thrombosis."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.43",
        "presentation": "{patientName} is a 43-year-old man who presents with symptomatic reflux, substantial mobility limitations, and medical comorbidity that may change procedural benefit and feasibility. There is no ulcer or acute thrombosis."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.68",
        "presentation": "{patientName} is a 68-year-old woman who presents with symptomatic reflux, substantial mobility limitations, and medical comorbidity that may change procedural benefit and feasibility. There is no ulcer or acute thrombosis."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.68",
        "presentation": "{patientName} is a 68-year-old man who presents with symptomatic reflux, substantial mobility limitations, and medical comorbidity that may change procedural benefit and feasibility. There is no ulcer or acute thrombosis."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Aching varicose veins",
    "previousChiefComplaint": "Vein treatment options",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.43"
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.43"
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.68"
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.68"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Locate the demonstrated reflux, then distinguish a trunk-directed referral from treatment of visible branches or a different venous compartment.",
    "reviewerNotes": "The existing SVS/AVF/AVLS claims support reflux assessment and specialist intervention review, not an automatic procedure. A clinician must verify the trunk/tributary/outflow distractor distinctions before approval.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f03.d1": "d1_4",
      "choice.qf20261104.f03.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f03.d1": null,
      "choice.qf20261104.f03.d2": null
    },
    "question": {
      "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r2",
      "conceptId": "concept.varicose-veins.axial-trunk-referral-target.v1",
      "stem": "Which proposed treatment should the vascular referral ask the team to assess for {patientName}'s demonstrated reflux?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Endovenous truncal ablation",
          "isCorrect": true,
          "rationale": "The demonstrated axial superficial reflux is the treatment target for specialist intervention assessment; candidacy and technique still require review.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f03.d1",
          "label": "Ambulatory tributary phlebectomy",
          "isCorrect": false,
          "distractorRationale": "Treating the visible branches is tempting, but that proposal does not address the demonstrated axial trunk reflux."
        },
        {
          "id": "choice.qf20261104.f03.d2",
          "label": "Iliac venous stent placement",
          "isCorrect": false,
          "distractorRationale": "Outflow treatment addresses a different venous problem; the supplied study identifies a superficial axial reflux target."
        }
      ],
      "explanation": "The referral should identify the demonstrated axial superficial reflux and ask about treatment of the refluxing saphenous trunk. This is an assessment request, not an automatic ablation order. Mobility, comorbidity, anatomy and patient goals still affect suitability and the eventual procedure.",
      "teachingPoint": "The referral should identify the demonstrated axial superficial reflux and ask about treatment of the refluxing saphenous trunk. This is an assessment request, not an automatic ablation order. Mobility, comorbidity, anatomy and patient goals still affect suitability and the eventual procedure.",
      "supportingEvidenceClaimIds": [
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary",
        "claim.varicose.reflux-duplex"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "nextConceptId": "concept.varicose-veins.axial-trunk-referral-target.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The old objective chooses intervention referral versus conservative care from candidacy and preference. The replacement instead identifies a specific venous treatment target from duplex anatomy, so it requires a new scored-construct version. Preserve the old concept and FSRS history rather than relabelling this change as wording only."
    },
    "flagReview": {
      "flagIds": [
        "bb8d30e3-0621-4faa-bc5b-5842aa2b1546"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced individualized vascular consultation and vague competing plans with three specific venous procedures. Removed mobility/comorbidity filler that did not determine this anatomical referral question, and created a new concept version for the changed scored objective. No patient preference selects the key.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f04",
    "auditId": "F04",
    "caseId": "case.gs028d.hyperkalaemia.a-renal-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-renal-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "What is the safest next disposition under the current UKKA adult pathway?",
    "previousChoiceLabels": [
      "Immediate hospital assessment",
      "Routine follow-up next week",
      "Repeat testing before any action",
      "Dietary advice alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
    "previousPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, returns to clinic when an outside laboratory calls with a potassium of 6.7 mmol/L. The sample is confirmed and the patient is available for immediate transfer.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
        "presentation": "{patientName}, a 52-year-old woman with advanced kidney disease, returns to clinic when an outside laboratory calls with a potassium of 6.7 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
        "presentation": "{patientName}, a 52-year-old man with advanced kidney disease, returns to clinic when an outside laboratory calls with a potassium of 6.7 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
        "presentation": "{patientName}, a 70-year-old woman with advanced kidney disease, returns to clinic when an outside laboratory calls with a potassium of 6.7 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
        "presentation": "{patientName}, a 70-year-old man with advanced kidney disease, returns to clinic when an outside laboratory calls with a potassium of 6.7 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 52,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Potassium result review",
    "previousChiefComplaint": "Critical potassium result",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.52"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.52"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.70"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.70"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Apply the sourced severe-result boundary rather than letting a reassuring appearance or ECG postpone assessment.",
    "reviewerNotes": "The exact UKKA boundary is already sourced. This remains jurisdiction-labelled; no universal threshold, normal-ECG guarantee or medication regimen is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qf20261104.f04.d1": "d2_1",
      "choice.qf20261104.f04.d2": "d3_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qf20261104.f04.d1": null,
      "choice.qf20261104.f04.d2": null
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v1.r2",
      "conceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "stem": "Under the UK Kidney Association adult pathway, what disposition should be arranged for {patientName} now?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Send for hospital assessment now",
          "isCorrect": true,
          "rationale": "The confirmed concentration is in the UKKA severe range; a reassuring symptom report or ECG does not justify outpatient delay.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f04.d1",
          "label": "Repeat potassium in the community later today",
          "isCorrect": false,
          "distractorRationale": "Rechecking can be appropriate for a questionable or less severe result, but the supplied severe result is already confirmed."
        },
        {
          "id": "choice.qf20261104.f04.d2",
          "label": "Begin an outpatient potassium-binder plan",
          "isCorrect": false,
          "distractorRationale": "An outpatient correction plan does not replace immediate hospital assessment for the confirmed severe concentration in this pathway."
        }
      ],
      "explanation": "UKKA guidance calls for immediate hospital assessment and treatment for confirmed community potassium of at least 6.5 mmol/L. The 6.7 mmol/L result crosses that boundary despite the reassuring presentation.",
      "teachingPoint": "UKKA guidance calls for immediate hospital assessment and treatment for confirmed community potassium of at least 6.5 mmol/L. The 6.7 mmol/L result crosses that boundary despite the reassuring presentation.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "0fe0cca7-0c4d-40e9-af26-db95733f95dd"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deleted available-for-immediate-transfer permission and safest wording. Replaced routine-weekly follow-up/diet-alone distractors with plausible same-day outpatient alternatives.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f05",
    "auditId": "F05",
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "previousQuestionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.2"
    ],
    "previousStem": "Which sampling approach describes this patient's completed thin-needle aspiration record?",
    "previousChoiceLabels": [
      "Fine-needle aspiration sampling",
      "Open incisional biopsy sampling",
      "Open excisional biopsy sampling",
      "Observation without tissue sampling"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
    "previousPresentation": "{patientName}, a 43-year-old woman, is well after an outside specialist sampled an assessed lateral cervical mass. The completed procedure record describes aspiration of cells through a thin needle, without an open incision or excision of the mass. The patient asks which initial diagnostic approach the record describes.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
        "presentation": "{patientName}, a 43-year-old woman, is well after an outside specialist sampled an assessed lateral cervical mass. The completed procedure record describes aspiration of cells through a thin needle, without an open incision or excision of the mass. The patient asks which initial diagnostic approach the record describes."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
        "presentation": "{patientName}, a 43-year-old man, is well after an outside specialist sampled an assessed lateral cervical mass. The completed procedure record describes aspiration of cells through a thin needle, without an open incision or excision of the mass. The patient asks which initial diagnostic approach the record describes."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
        "presentation": "{patientName}, a 58-year-old woman, is well after an outside specialist sampled an assessed lateral cervical mass. The completed procedure record describes aspiration of cells through a thin needle, without an open incision or excision of the mass. The patient asks which initial diagnostic approach the record describes."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
        "presentation": "{patientName}, a 58-year-old man, is well after an outside specialist sampled an assessed lateral cervical mass. The completed procedure record describes aspiration of cells through a thin needle, without an open incision or excision of the mass. The patient asks which initial diagnostic approach the record describes."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent neck lump",
    "previousChiefComplaint": "Was that open surgery?",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43"
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43"
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58"
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that the assessed adult neck mass still needs a specimen, then select an initial needle route rather than an open operation.",
    "reviewerNotes": "Single adequately recorded multidisciplinary guideline; FNA is best among the offered choices, not universally better than core. ABSITE scope remains unverified and is an explicit release-review hold.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f05.d1": "d1_4",
      "choice.qf20261104.f05.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f05.d1": null,
      "choice.qf20261104.f05.d2": null
    },
    "question": {
      "id": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
      "conceptId": "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
      "stem": "Which initial tissue-sampling referral is most appropriate for {patientName}'s assessed lateral neck lymph node?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Fine-needle aspiration of the neck node",
          "isCorrect": true,
          "rationale": "Needle sampling is an appropriate initial approach in this assessed adult neck-mass setting, before an open biopsy among the offered choices.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f05.d1",
          "label": "Open incisional biopsy of the neck node",
          "isCorrect": false,
          "distractorRationale": "An open incision is not the preferred initial sample among these offered approaches before needle assessment."
        },
        {
          "id": "choice.qf20261104.f05.d2",
          "label": "Open excisional biopsy of the neck node",
          "isCorrect": false,
          "distractorRationale": "Excision can be considered in selected pathways, but it should not replace initial needle sampling in this supplied setting."
        }
      ],
      "explanation": "For this assessed, undiagnosed adult neck lymph node, FNA is the appropriate offered initial needle approach rather than starting with open biopsy. Core biopsy can be appropriate in selected cases and is not presented as an incorrect alternative. This is a specialist sampling referral, not a new local clinic procedure.",
      "teachingPoint": "For this assessed, undiagnosed adult neck lymph node, FNA is the appropriate offered initial needle approach rather than starting with open biopsy. Core biopsy can be appropriate in selected cases and is not presented as an incorrect alternative. This is a specialist sampling referral, not a new local clinic procedure.",
      "supportingEvidenceClaimIds": [
        "claim.gs028f.neck.needle-before-open",
        "claim.gs028f.neck.adult-lateral-malignancy-evaluation",
        "claim.gs028f.neck.core-biopsy-alternative"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf20261104.f05.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf20261104.f05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
      "nextConceptId": "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "65a34315-920b-45c8-a101-2e85a1ffcf77"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed ambiguous cervical and the completed thin-needle record that named the answer. Reframed the same initial-FNA objective as a prospective sampling decision.",
      "scopeDecision": "The permitted local ledger supports clinical neck-mass evaluation but contains no verified public ABSITE content outline. General-surgery relevance is a clinical judgment, not confirmed exam scope. Propose retiring this item from the ABSITE-labelled track unless the manager supplies permitted public ABS scope verification; no SCORE or recalled items were read.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f06",
    "auditId": "F06",
    "caseId": "case.gs028e.immunology.c3-historical-kidney-event",
    "nodeId": "node.gs028e.immunology.c3-historical-kidney-event.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.1"
    ],
    "previousStem": "Which immune effector best explains this patient's established historical hyperacute antibody-mediated rejection?",
    "previousChoiceLabels": [
      "Preformed donor-specific antibodies",
      "Newly formed donor-specific antibodies",
      "Activated recipient T lymphocytes",
      "IgE-sensitized recipient mast cells"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
    "previousPresentation": "{patientName}, a 41-year-old woman, is stable in clinic and asks about a remote outside kidney-transplant event. The transplant team established the historical diagnosis as hyperacute antibody-mediated rejection. Current graft care is managed by that team.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
        "presentation": "{patientName}, a 41-year-old woman, is stable in clinic and asks about a remote outside kidney-transplant event. The transplant team established the historical diagnosis as hyperacute antibody-mediated rejection. Current graft care is managed by that team."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
        "presentation": "{patientName}, a 41-year-old man, is stable in clinic and asks about a remote outside kidney-transplant event. The transplant team established the historical diagnosis as hyperacute antibody-mediated rejection. Current graft care is managed by that team."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
        "presentation": "{patientName}, a 64-year-old woman, is stable in clinic and asks about a remote outside kidney-transplant event. The transplant team established the historical diagnosis as hyperacute antibody-mediated rejection. Current graft care is managed by that team."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
        "presentation": "{patientName}, a 64-year-old man, is stable in clinic and asks about a remote outside kidney-transplant event. The transplant team established the historical diagnosis as hyperacute antibody-mediated rejection. Current graft care is managed by that team."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 41,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Transplant record review",
    "previousChiefComplaint": "Transplant history question",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41"
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41"
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64"
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the antibody-mediated vascular rejection pattern, then use the archived serum chronology to distinguish preformed from newly generated antibodies.",
    "reviewerNotes": "The two existing transplant sources support preformed antibody/endothelial complement/thrombosis mechanisms. The synthetic record is not a new timing cutoff, Banff diagnostic algorithm or treatment claim; a transplant clinician must review its sufficiency.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qf20261104.f06.d1": "d1_1",
      "choice.qf20261104.f06.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qf20261104.f06.d1": null,
      "choice.qf20261104.f06.d2": null
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r2",
      "conceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
      "stem": "Which immune process best explains the combination of findings in {patientName}'s archived graft-failure record?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Pre-existing donor-reactive recipient antibodies",
          "isCorrect": true,
          "rationale": "The stored pre-transplant serum finding, endothelial immune deposits and vascular thrombosis together support a preformed-antibody mechanism of hyperacute rejection.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f06.d1",
          "label": "Newly generated donor-reactive recipient antibodies",
          "isCorrect": false,
          "distractorRationale": "Antibody-mediated injury is plausible, but antibodies newly formed after graft exposure do not account for donor-cell binding in the stored earlier serum."
        },
        {
          "id": "choice.qf20261104.f06.d2",
          "label": "Activated recipient T lymphocytes against graft tissue",
          "isCorrect": false,
          "distractorRationale": "T-cell injury is a credible transplant mechanism, but it does not best explain the pre-transplant serum reactivity with endothelial immune deposits and thrombosis."
        }
      ],
      "explanation": "The timing, endothelial immunoglobulin/complement deposits, vascular thrombi and donor-cell reactivity of stored pre-transplant serum support hyperacute antibody-mediated rejection driven by pre-existing antibodies. Early dysfunction by itself would be insufficient; the mechanism depends on the immune and vascular findings together.",
      "teachingPoint": "The timing, endothelial immunoglobulin/complement deposits, vascular thrombi and donor-cell reactivity of stored pre-transplant serum support hyperacute antibody-mediated rejection driven by pre-existing antibodies. Early dysfunction by itself would be insufficient; the mechanism depends on the immune and vascular findings together.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.gs028e.t_cell_graft_comparison",
        "claim.gs028e.type_i"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
      "nextConceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "0dfbbe4f-fbed-457b-bbcc-2053772b6d80"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the established hyperacute antibody-mediated rejection label from all pre-answer text. Added a coherent raw historical record and replaced the irrelevant IgE distractor with closer transplant mechanisms.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f07",
    "auditId": "F07",
    "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3",
    "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which feature must remain central to the assessment?",
    "previousChoiceLabels": [
      "Portal hypertension history",
      "A composite liver-risk score alone",
      "The planned procedure risk alone",
      "The cardiopulmonary assessment alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
    "previousPresentation": "{patientName}, a 43-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "presentation": "{patientName}, a 43-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "presentation": "{patientName}, a 43-year-old man, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "presentation": "{patientName}, a 68-year-old woman, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "presentation": "{patientName}, a 68-year-old man, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Cirrhosis preoperative review",
    "previousChiefComplaint": "Preoperative cirrhosis consult",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the history and examination-related findings as a risk domain not erased by current laboratory reassurance.",
    "reviewerNotes": "Uses the existing multifactor claim without a mortality percentage, scoring formula or surgical exclusion threshold.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf20261104.f07.d1": "d1_3",
      "choice.qf20261104.f07.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf20261104.f07.d1": null,
      "choice.qf20261104.f07.d2": null
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r2",
      "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "stem": "Which perioperative risk domain is most liable to be underestimated if {patientName}'s current biochemical profile drives the assessment?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Portal hypertension with decompensation",
          "isCorrect": true,
          "rationale": "The bleeding history, splenomegaly and thrombocytopenia remain consequential despite reassuring current biochemical results.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f07.d1",
          "label": "Hepatic synthetic and excretory function",
          "isCorrect": false,
          "distractorRationale": "The supplied albumin, INR and bilirubin directly inform this domain; it is not the important clinical history omitted by relying on these results."
        },
        {
          "id": "choice.qf20261104.f07.d2",
          "label": "Renal filtration and electrolyte function",
          "isCorrect": false,
          "distractorRationale": "Renal status matters in the overall assessment, but the supplied pattern chiefly identifies a portal-hypertension/decompensation history outside the reassuring blood-test snapshot."
        }
      ],
      "explanation": "A reassuring current blood-test profile does not erase prior variceal bleeding or clinical evidence of portal hypertension. Perioperative assessment still integrates these features with liver severity, operation, comorbidity and center experience; no one domain or score settles the full risk decision.",
      "teachingPoint": "A reassuring current blood-test profile does not erase prior variceal bleeding or clinical evidence of portal hypertension. Perioperative assessment still integrates these features with liver severity, operation, comorbidity and center experience; no one domain or score settles the full risk decision.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "nextConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "08837a69-f1de-4fe8-bb7e-4f1a2e481718"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed all three alone labels and the vague modest-score assertion. Replaced the options with parallel clinical domains and supplied the observed blood-test/history discrepancy.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f08",
    "auditId": "F08",
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "previousQuestionVariantId": "question.lymphangitis.heel-inguinal.v1",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r2",
    "previousContentVersions": [
      "clinical.owner-row-104.2026-08-21.1"
    ],
    "previousStem": "Which diagnosis best matches this pattern?",
    "previousChoiceLabels": [
      "Acute lymphangitis",
      "A heel crack alone",
      "An isolated groin-node problem"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has longstanding calf varicosities and a recently opened heel blister. Redness and tenderness have extended from the heel in a narrow line up the leg, while the groin nodes on that side have become tender. The heel has a small rim of surrounding redness.",
    "previousPresentation": "{patientName}, an adult, reports a cracked heel. Linear erythema extends proximally from the heel, and the groin nodes are tender.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "pprv3.case.lymphangitis.heel-inguinal",
        "patientPresentationVariantId": "presentation.lymphangitis.heel-inguinal",
        "contentVersion": "presentation-revision.patient-library.2026-09-13.v3",
        "revisedChiefComplaint": "Tender red streak",
        "revisedPresentation": "{patientName}, an adult, reports a cracked heel. Linear erythema extends proximally from the heel, and the groin nodes are tender.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "Clinic Patient"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "prototypeDemographics": {
      "ageYears": 38,
      "sexLabel": "Female"
    },
    "patientDisplayName": "{patientName}",
    "chiefComplaint": "Painful leg redness",
    "previousChiefComplaint": "Tender red streak",
    "previousProfileChiefComplaints": [],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Resist attributing linear pain to the coexisting varicosities or local wound redness; integrate the entry site, proximal pattern and draining basin.",
    "reviewerNotes": "Only the narrow recognition pattern has an approved existing source claim. No treatment or organism teaching is added; clinician review must assess the venous/local-cellulitis differential and predicted difficulty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "acute_lymphangitis": "acute_lymphangitis",
      "choice.qf20261104.f08.d1": "heel_crack_alone",
      "choice.qf20261104.f08.d2": "isolated_groin_node"
    },
    "choiceServiceOverrides": {
      "acute_lymphangitis": null,
      "choice.qf20261104.f08.d1": null,
      "choice.qf20261104.f08.d2": null
    },
    "question": {
      "id": "question.lymphangitis.heel-inguinal.v1.r2",
      "conceptId": "concept.lymphangitis.acute-clinical-recognition",
      "stem": "Which diagnosis best explains the linear extension above {patientName}'s heel wound together with the regional nodal tenderness?",
      "answerChoices": [
        {
          "id": "acute_lymphangitis",
          "label": "Acute lymphangitis",
          "isCorrect": true,
          "rationale": "The distal entry site, tender proximal linear extension and draining-node tenderness form the supported lymphangitis pattern.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f08.d1",
          "label": "Superficial thrombophlebitis",
          "isCorrect": false,
          "distractorRationale": "The varicosities make a painful superficial venous process a credible alternative, but it does not unite the entry wound and draining-node pattern as well."
        },
        {
          "id": "choice.qf20261104.f08.d2",
          "label": "Localized cellulitis",
          "isCorrect": false,
          "distractorRationale": "The local rim of redness makes this tempting, but a localized skin process does not best account for the separate proximal linear extension with regional nodes."
        }
      ],
      "explanation": "The wound, tender proximal streak and tender regional nodes favor acute lymphangitis as the explanation for the extension above the heel. Local surrounding skin inflammation can coexist. The proximal pattern does not establish an organism, severity or treatment plan.",
      "teachingPoint": "The wound, tender proximal streak and tender regional nodes favor acute lymphangitis as the explanation for the extension above the heel. Local surrounding skin inflammation can coexist. The proximal pattern does not establish an organism, severity or treatment plan.",
      "supportingEvidenceClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.lymphangitis.acute-clinical-recognition",
      "nextConceptId": "concept.lymphangitis.acute-clinical-recognition",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "0368a25c-1165-474d-b117-e729a0cd8fdd"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced heel crack alone and isolated node distractors. Added a competing venous finding and separated the local wound change from the proximal process. Added a consistent canonical age/sex and retained the old approved version unchanged.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f09",
    "auditId": "F09",
    "caseId": "case.gs028e.mis-principles.c2-different-phases",
    "nodeId": "node.gs028e.mis-principles.c2-different-phases.1",
    "previousQuestionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.1"
    ],
    "previousStem": "Which mechanistic sequence best reconciles the filling observations in this patient's completed operation?",
    "previousChoiceLabels": [
      "Early central mobilization; later caval compression",
      "Early caval compression; later central mobilization",
      "Early central mobilization; later head-down augmentation",
      "Early caval compression; later head-down augmentation"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
    "previousPresentation": "{patientName}, a 36-year-old woman, reviews outside laparoscopy notes showing increased filling early in insufflation and reduced filling later when pressure rose in a head-up position. The patient thinks one note must be wrong because gas should have a single universal circulatory effect.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.36",
        "presentation": "{patientName}, a 36-year-old woman, reviews outside laparoscopy notes showing increased filling early in insufflation and reduced filling later when pressure rose in a head-up position. The patient thinks one note must be wrong because gas should have a single universal circulatory effect."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.36",
        "presentation": "{patientName}, a 36-year-old man, reviews outside laparoscopy notes showing increased filling early in insufflation and reduced filling later when pressure rose in a head-up position. The patient thinks one note must be wrong because gas should have a single universal circulatory effect."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.61",
        "presentation": "{patientName}, a 61-year-old woman, reviews outside laparoscopy notes showing increased filling early in insufflation and reduced filling later when pressure rose in a head-up position. The patient thinks one note must be wrong because gas should have a single universal circulatory effect."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.61",
        "presentation": "{patientName}, a 61-year-old man, reviews outside laparoscopy notes showing increased filling early in insufflation and reduced filling later when pressure rose in a head-up position. The patient thinks one note must be wrong because gas should have a single universal circulatory effect."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 36,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Operation record review",
    "previousChiefComplaint": "Conflicting circulation notes",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.36"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.36"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.61"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.61"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret observed filling/flow direction in each phase, then reconcile the change with pressure-dependent venous effects rather than a universal increase/decrease rule.",
    "reviewerNotes": "Existing two-source physiology claims support context dependence, early central mobilization and later venous compression. No exact pressure, volume, timing or management threshold is introduced. If the owner prefers fewer physiology variants, this combined application is the stronger keeper.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f09.d1": "d1_4",
      "choice.qf20261104.f09.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f09.d1": null,
      "choice.qf20261104.f09.d2": null
    },
    "question": {
      "id": "question.pneumoperitoneum.context-dependent-venous-return.v4.r2",
      "conceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "stem": "Which sequence of venous effects best explains the two phases in {patientName}'s record?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Abdominal venous emptying, then restriction of caval inflow",
          "isCorrect": true,
          "rationale": "Initial displacement of blood centrally can augment filling, whereas greater pressure can impede venous return; the reversal with pressure reduction supports that context-dependent sequence.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f09.d1",
          "label": "Restriction of caval inflow, then abdominal venous emptying",
          "isCorrect": false,
          "distractorRationale": "This reverses the direction of venous effects needed to explain the observed rise and subsequent fall in filling."
        },
        {
          "id": "choice.qf20261104.f09.d2",
          "label": "Dependent venous pooling, then increased central venous return",
          "isCorrect": false,
          "distractorRationale": "This predicts the opposite filling sequence and would require a different positional/venous context."
        }
      ],
      "explanation": "Initial compression of abdominal venous reservoirs can move blood centrally, while greater abdominal pressure can impede caval return. The observed ventricular-volume and stroke-volume changes fit that sequence here. Pneumoperitoneum does not have one universal circulatory effect; pressure, circulating volume and position matter.",
      "teachingPoint": "Initial compression of abdominal venous reservoirs can move blood centrally, while greater abdominal pressure can impede caval return. The observed ventricular-volume and stroke-volume changes fit that sequence here. Pneumoperitoneum does not have one universal circulatory effect; pressure, circulating volume and position matter.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.caval-compression-venous-return",
        "claim.gs028e.laparoscopy.pressure-position-context"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "nextConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "58f8c9a8-ad40-479e-b06b-e8c0fd5a52ef"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced unspecified filling and patient-authored mechanism claims with the actual monitored variables and chronology. Removed a simultaneous head-up change that previously prevented attribution to pressure.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f10",
    "auditId": "F10",
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "previousQuestionVariantId": "question.dcis.sentinel-node-setting.v3",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which axillary-staging plan best fits {patientName}'s pure DCIS when oncoplastic surgery will compromise later mapping?",
    "previousChoiceLabels": [
      "Include SLNB at breast surgery",
      "Omit nodal surgery at breast surgery",
      "Include limited node sampling at surgery",
      "Include ALND at breast surgery"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes.",
    "previousPresentation": "{patientName}, a 43-year-old woman, has pure DCIS planned for a large oncoplastic resection that is expected to compromise later lymphatic mapping if occult invasion is found.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
        "presentation": "{patientName}, a 43-year-old woman, has pure DCIS planned for a large oncoplastic resection that is expected to compromise later lymphatic mapping if occult invasion is found."
      },
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
        "presentation": "{patientName}, a 59-year-old woman, has pure DCIS planned for a large oncoplastic resection that is expected to compromise later lymphatic mapping if occult invasion is found."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "DCIS surgical planning",
    "previousChiefComplaint": "Coordinate oncoplastic surgery",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43"
      },
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish sampled DCIS from the final specimen and recognize that the planned breast operation changes the timing of sentinel staging.",
    "reviewerNotes": "Single adequately recorded 2026 society source; no independent corroborating source is recorded. Melissa must approve the exact replacement and decide whether the rare exception should return in a later sourced specialist item.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf20261104.f10.d1": "d1_3",
      "choice.qf20261104.f10.d2": "d3_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf20261104.f10.d1": null,
      "choice.qf20261104.f10.d2": null
    },
    "question": {
      "id": "question.dcis.sentinel-node-setting.v3.r2",
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "stem": "Which axillary plan should accompany {patientName}'s mastectomy?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Sentinel-node biopsy with breast removal",
          "isCorrect": true,
          "rationale": "The standard mastectomy setting supports simultaneous SLNB because later sentinel mapping may be unreliable if invasion is found on final pathology.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f10.d1",
          "label": "Sentinel-node biopsy after invasive final pathology",
          "isCorrect": false,
          "distractorRationale": "Deferring the decision is tempting for sampled DCIS, but this plan relies on later mapping after mastectomy."
        },
        {
          "id": "choice.qf20261104.f10.d2",
          "label": "Axillary dissection during the planned resection",
          "isCorrect": false,
          "distractorRationale": "Dissection adds an extent of axillary surgery not supported by this clinically node-negative sampled-DCIS setting."
        }
      ],
      "explanation": "SLNB accompanies mastectomy for DCIS because subsequent sentinel mapping may be unreliable if final pathology identifies invasion. This is a different setting from uncomplicated breast conservation, where routine axillary surgery is generally omitted.",
      "teachingPoint": "SLNB accompanies mastectomy for DCIS because subsequent sentinel mapping may be unreliable if final pathology identifies invasion. This is a different setting from uncomplicated breast conservation, where routine axillary surgery is generally omitted.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-risk-setting",
        "claim.gs028c.dcis.axilla-mastectomy",
        "claim.gs028c.dcis.axilla-omit-bcs"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf20261104.f10.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf20261104.f10.d2": {
        "kind": "no_test"
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dcis.sentinel-node-setting",
      "nextConceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Replace the disputed oncoplastic future-mapping exception with the separately sourced standard mastectomy setting. The old broad setting concept and original question remain available for frozen encounters; history is not silently transferred to this narrower scored construct."
    },
    "flagReview": {
      "flagIds": [
        "e4354aee-08cf-4fce-beff-44c217f5f8b0"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Retired the oncoplastic exception as this variant’s scored scenario and replaced it with the supported mastectomy setting. Created a new concept version and removed the confusing mapping premise from pre-answer text.",
      "sourceDecision": "Local source.asbrs.axilla.2026 (checked 2026-10-02) supports both the standard mastectomy claim and a conditional threatened-mapping exception. It does not justify calling every oncoplastic resection a mapping failure. No fresh current-guideline verification was performed because network is prohibited. The replacement uses the narrower, explicit mastectomy claim; the rare oncoplastic scenario is proposed for retirement rather than asserted as routine practice.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f11",
    "auditId": "F11",
    "caseId": "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
    "nodeId": "node.gs028se.p2e.perioperative-dnr.v4.perianal-abscess.1",
    "previousQuestionVariantId": "question.statistics-ethics.perioperative-dnr.v4",
    "questionVariantId": "question.statistics-ethics.perioperative-dnr.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "How should the team interpret {patientName}'s DNR order when a staff member proposes omitting abscess treatment and comfort care?",
    "previousChoiceLabels": [
      "Resuscitation after cardiopulmonary arrest",
      "Resuscitation and anesthetic airway support",
      "Resuscitation and treatment of a new infection",
      "Resuscitation and diagnostic testing"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
    "previousPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
        "presentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
        "presentation": "{patientName}, a 58-year-old woman, has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
        "presentation": "{patientName}, a 77-year-old man, has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
        "presentation": "{patientName}, a 77-year-old woman, has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 58,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Abscess care planning",
    "previousChiefComplaint": "Abscess care preferences",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Identify the scope of the order before applying it to separate treatment and anaesthetic decisions.",
    "reviewerNotes": "The existing ASA and AMA claims support this scope boundary. The later abscess question, update and treatment choices remain byte-identical; feedback here does not state its keyed procedure.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "key-4": "key-4",
      "choice.qf20261104.f11.d1": "wrong-4-1",
      "choice.qf20261104.f11.d2": "wrong-4-2"
    },
    "choiceServiceOverrides": {
      "key-4": null,
      "choice.qf20261104.f11.d1": null,
      "choice.qf20261104.f11.d2": null
    },
    "question": {
      "id": "question.statistics-ethics.perioperative-dnr.v4.r2",
      "conceptId": "concept.statistics-ethics.perioperative-dnr",
      "stem": "Which instruction is established by {patientName}'s DNR order itself?",
      "answerChoices": [
        {
          "id": "key-4",
          "label": "Withhold cardiopulmonary resuscitation if arrest occurs",
          "isCorrect": true,
          "rationale": "The DNR order addresses attempted resuscitation after cardiopulmonary arrest; separate treatment choices require their own discussion.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f11.d1",
          "label": "Withhold airway instrumentation for the planned anaesthetic",
          "isCorrect": false,
          "distractorRationale": "An anaesthetic airway plan is not determined by the DNR label itself; perioperative wishes require explicit reconsideration and documentation."
        },
        {
          "id": "choice.qf20261104.f11.d2",
          "label": "Withhold treatment directed at the new infection",
          "isCorrect": false,
          "distractorRationale": "A DNR order does not itself decline treatment of an infection or symptom relief."
        }
      ],
      "explanation": "DNR concerns attempted resuscitation after cardiopulmonary arrest. It does not itself decide whether the patient accepts diagnostic, infection-directed, comfort or anaesthetic care. Review and document the perioperative plan with the patient rather than assuming either blanket suspension or blanket refusal of treatment.",
      "teachingPoint": "DNR concerns attempted resuscitation after cardiopulmonary arrest. It does not itself decide whether the patient accepts diagnostic, infection-directed, comfort or anaesthetic care. Review and document the perioperative plan with the patient rather than assuming either blanket suspension or blanket refusal of treatment.",
      "supportingEvidenceClaimIds": [
        "claim.gs028se.perioperative-dnr.4",
        "claim.bread-butter.perianal-abscess.prompt-drainage"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.statistics-ethics.perioperative-dnr",
      "nextConceptId": "concept.statistics-ethics.perioperative-dnr",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "48111297-73f2-4b4d-9309-9a8fc1e7a587"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the staff member’s obviously mistaken proposal and the mismatched noun-phrase options. The task now explicitly asks which instruction the order establishes; all options are parallel instructions.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f12",
    "auditId": "F12",
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which imaging test should the acute-care team select to evaluate suspected acute cholecystitis after an indeterminate ultrasound?",
    "previousChoiceLabels": [
      "Hepatobiliary scintigraphy",
      "Right-upper-quadrant ultrasound",
      "Contrast-enhanced abdominal CT",
      "Biliary magnetic resonance imaging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
    "previousPresentation": "{patientName}, a 45-year-old woman, presents to the clinic with fever, persistent right-upper-quadrant pain, and a positive clinical Murphy finding. Ultrasound detects sludge and stones but calls the examination indeterminate for acute cholecystitis. HIDA is available at the receiving hospital without delaying needed acute care.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.45",
        "presentation": "{patientName}, a 45-year-old woman, presents to the clinic with fever, persistent right-upper-quadrant pain, and a positive clinical Murphy finding. Ultrasound detects sludge and stones but calls the examination indeterminate for acute cholecystitis. HIDA is available at the receiving hospital without delaying needed acute care."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.45",
        "presentation": "{patientName}, a 45-year-old man, presents to the clinic with fever, persistent right-upper-quadrant pain, and a positive clinical Murphy finding. Ultrasound detects sludge and stones but calls the examination indeterminate for acute cholecystitis. HIDA is available at the receiving hospital without delaying needed acute care."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.73",
        "presentation": "{patientName}, a 73-year-old woman, presents to the clinic with fever, persistent right-upper-quadrant pain, and a positive clinical Murphy finding. Ultrasound detects sludge and stones but calls the examination indeterminate for acute cholecystitis. HIDA is available at the receiving hospital without delaying needed acute care."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.73",
        "presentation": "{patientName}, a 73-year-old man, presents to the clinic with fever, persistent right-upper-quadrant pain, and a positive clinical Murphy finding. Ultrasound detects sludge and stones but calls the examination indeterminate for acute cholecystitis. HIDA is available at the receiving hospital without delaying needed acute care."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 45,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Right upper abdominal pain",
    "previousChiefComplaint": "Fever and biliary pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.45"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.45"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.73"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.73"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize clinical/ultrasound discordance, then distinguish gallbladder functional clarification from duct-focused imaging or repeating the same acquisition.",
    "reviewerNotes": "Existing WSES claim supports selected HIDA after equivocal ultrasound, with time/resource limitations. It is not a universal mandate or a complete acute-care sequence; clinician review must confirm the one-best comparison for this profile.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f12.d1": "d3_4",
      "choice.qf20261104.f12.d2": "d1_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f12.d1": null,
      "choice.qf20261104.f12.d2": null
    },
    "question": {
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
      "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "stem": "Which next imaging study would best clarify the cause of {patientName}'s continuing gallbladder-region symptoms?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": true,
          "rationale": "Persistent clinical suspicion for acute gallbladder inflammation despite these ultrasound observations supports selected functional clarification with HIDA.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f12.d1",
          "label": "Magnetic resonance cholangiopancreatography",
          "isCorrect": false,
          "distractorRationale": "Ductal imaging is a credible biliary alternative, but it is less directed at the unresolved gallbladder inflammatory question in this offered set."
        },
        {
          "id": "choice.qf20261104.f12.d2",
          "label": "Repeat right-upper-quadrant ultrasonography",
          "isCorrect": false,
          "distractorRationale": "Repeating an already completed examination can be reasonable if acquisition was inadequate; no acquisition problem is supplied here to favor repetition over selected clarification."
        }
      ],
      "explanation": "The clinical pattern can continue to support acute cholecystitis even when ultrasound lacks secondary inflammatory signs. Hepatobiliary scintigraphy can clarify this gallbladder question. Acute assessment and treatment should not be delayed to obtain it; local resources still affect actual care.",
      "teachingPoint": "The clinical pattern can continue to support acute cholecystitis even when ultrasound lacks secondary inflammatory signs. Hepatobiliary scintigraphy can clarify this gallbladder question. Acute assessment and treatment should not be delayed to obtain it; local resources still affect actual care.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qq20261028.cholecystitis.comparative-imaging"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "nextConceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "e2e20e22-7640-4126-a0b8-93118a6101af"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed HIDA availability/no-delay permission, indeterminate label and diagnosis name from the task. Removed CT from the offered set because it can also be an appropriate next study, retaining three genuine biliary-imaging choices.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f13",
    "auditId": "F13",
    "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
    "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
    "previousQuestionVariantId": "question.preoperative-osa.validated-risk-screening.v4",
    "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which approach provides the most defensible preoperative risk classification?",
    "previousChoiceLabels": [
      "Use validated OSA screening",
      "Use age alone",
      "Use body weight alone",
      "Assign a diagnosis from appearance"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
    "previousPresentation": "{patientName}, a 46-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
        "presentation": "{patientName}, a 46-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
        "presentation": "{patientName}, a 46-year-old man, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
        "presentation": "{patientName}, a 68-year-old man, has several possible OSA features before major surgery, and the clinic note currently records only an informal impression."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative sleep history",
    "previousChiefComplaint": "Preop sleep concern",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish the question of perioperative OSA probability from daytime symptom burden and airway anatomy.",
    "reviewerNotes": "Existing SASM screening claim supports the screening/diagnosis boundary. The sleepiness/airway contrasts require clinician confirmation; no new scoring or diagnostic cutoff is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f13.d1": "d1_4",
      "choice.qf20261104.f13.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f13.d1": null,
      "choice.qf20261104.f13.d2": null
    },
    "question": {
      "id": "question.preoperative-osa.validated-risk-screening.v4.r2",
      "conceptId": "concept.preoperative-osa.validated-risk-screening",
      "stem": "Which assessment method should be used to classify {patientName}'s preoperative risk of obstructive sleep apnoea?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "A sleep-apnoea screening questionnaire",
          "isCorrect": true,
          "rationale": "A validated risk screen integrates the relevant preoperative risk features without pretending to establish a diagnosis.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f13.d1",
          "label": "A daytime-sleepiness symptom questionnaire",
          "isCorrect": false,
          "distractorRationale": "The reassuring daytime symptom report can tempt reliance on sleepiness, but a sleepiness measure is not a substitute for an OSA-focused validated risk screen."
        },
        {
          "id": "choice.qf20261104.f13.d2",
          "label": "An anatomic upper-airway examination",
          "isCorrect": false,
          "distractorRationale": "Airway assessment is relevant to anaesthetic planning, but does not replace the requested OSA risk classification."
        }
      ],
      "explanation": "Use a validated OSA risk screen to classify and communicate preoperative probability. Little reported daytime sleepiness does not turn a symptom measure or airway examination into that risk screen. Screening remains distinct from a diagnostic sleep study.",
      "teachingPoint": "Use a validated OSA risk screen to classify and communicate preoperative probability. Little reported daytime sleepiness does not turn a symptom measure or airway examination into that risk screen. Screening remains distinct from a diagnostic sleep study.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.osa.validated-screen"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.preoperative-osa.validated-risk-screening",
      "nextConceptId": "concept.preoperative-osa.validated-risk-screening",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "e1e6012e-485e-4225-8346-b02827868703"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed all alone options and the authored informal-impression criticism. The closer competitors assess real related domains, and a reassuring symptom report supplies a realistic near-miss.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f15",
    "auditId": "F15",
    "caseId": "case.gs028e.mis-principles.c2-early-central-filling",
    "nodeId": "node.gs028e.mis-principles.c2-early-central-filling.1",
    "previousQuestionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.1"
    ],
    "previousStem": "Which mechanism best explains the early increase in central filling documented for this patient?",
    "previousChoiceLabels": [
      "Mobilization of blood from splanchnic veins",
      "Obstruction of blood returning through the cava",
      "Loss of circulating blood through an incision",
      "Pooling of blood in the dependent lower body"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
    "previousPresentation": "{patientName}, a 44-year-old woman, is well after outside laparoscopic hernia repair. The early insufflation note describes modest pressure compressing splanchnic veins and temporarily increasing central filling before higher pressures were used. The patient asks how this differs from venous obstruction.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.44",
        "presentation": "{patientName}, a 44-year-old woman, is well after outside laparoscopic hernia repair. The early insufflation note describes modest pressure compressing splanchnic veins and temporarily increasing central filling before higher pressures were used. The patient asks how this differs from venous obstruction."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.44",
        "presentation": "{patientName}, a 44-year-old man, is well after outside laparoscopic hernia repair. The early insufflation note describes modest pressure compressing splanchnic veins and temporarily increasing central filling before higher pressures were used. The patient asks how this differs from venous obstruction."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.70",
        "presentation": "{patientName}, a 70-year-old woman, is well after outside laparoscopic hernia repair. The early insufflation note describes modest pressure compressing splanchnic veins and temporarily increasing central filling before higher pressures were used. The patient asks how this differs from venous obstruction."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.70",
        "presentation": "{patientName}, a 70-year-old man, is well after outside laparoscopic hernia repair. The early insufflation note describes modest pressure compressing splanchnic veins and temporarily increasing central filling before higher pressures were used. The patient asks how this differs from venous obstruction."
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
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Operation record review",
    "previousChiefComplaint": "Pneumoperitoneum physiology",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.44"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.44"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.70"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.70"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the direction of two observed variables to select a possible early venous effect rather than reciting a universal preload rule.",
    "reviewerNotes": "Existing physiology sources support the possible early central-mobilization effect, not proof from stroke volume alone or a universal operative rule. Clinician review must judge the monitoring interpretation and educational value.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qf20261104.f15.d1": "d1_2",
      "choice.qf20261104.f15.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qf20261104.f15.d1": null,
      "choice.qf20261104.f15.d2": null
    },
    "question": {
      "id": "question.pneumoperitoneum.context-dependent-venous-return.v2.r2",
      "conceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "stem": "Which venous mechanism best accounts for the initial observations in {patientName}'s operation record?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Displacement of blood from abdominal veins toward the chest",
          "isCorrect": true,
          "rationale": "Initial abdominal venous compression can mobilize blood centrally and temporarily augment filling in this context.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f15.d1",
          "label": "Restriction of blood flow through the abdominal vena cava",
          "isCorrect": false,
          "distractorRationale": "Caval restriction is a real insufflation-associated mechanism, but it tends to reduce rather than explain this observed increase in central filling."
        },
        {
          "id": "choice.qf20261104.f15.d2",
          "label": "Redistribution of blood from the chest into dependent leg veins",
          "isCorrect": false,
          "distractorRationale": "Peripheral pooling would not best explain the simultaneous increase in ventricular filling and stroke volume in the supplied unchanged-position context."
        }
      ],
      "explanation": "Early compression of abdominal venous reservoirs can move blood centrally and increase filling. This observed phase differs from venous obstruction at greater pressure or pooling with a positional change. The record does not establish a universal effect of insufflation or an exact pressure threshold.",
      "teachingPoint": "Early compression of abdominal venous reservoirs can move blood centrally and increase filling. This observed phase differs from venous obstruction at greater pressure or pooling with a positional change. The record does not establish a universal effect of insufflation or an exact pressure threshold.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.caval-compression-venous-return",
        "claim.gs028e.laparoscopy.pressure-position-context"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "nextConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "08932b5d-1368-4f60-8928-58561c8ddaa4"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deleted compressing splanchnic veins, increased central filling and the pre-interpreted obstruction discussion. Named the actual monitored observations and stable co-variables; replaced incision blood-loss filler with pressure/position-related venous competitors.",
      "retirementProposal": "This narrow early-phase application overlaps the combined F09 item and may remain easier than the resident target. If the owner wants fewer mechanism variants, retain F09 and retire this variant; do not manufacture difficulty by obscuring filling terminology.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f16",
    "auditId": "F16",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which statement best describes the value of this result?",
    "previousChoiceLabels": [
      "Cervical operative map",
      "It proves the thyroid cancer benign",
      "Ultrasound eliminates all recurrence risk",
      "Ultrasound replaces surgical consultation"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
    "previousPresentation": "{patientName}, a 43-year-old woman, reviews a completed preoperative neck ultrasound after malignant thyroid cytology. It documents no suspicious central or lateral nodes and no gross extrathyroidal extension.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
        "presentation": "{patientName}, a 43-year-old woman, reviews a completed preoperative neck ultrasound after malignant thyroid cytology. It documents no suspicious central or lateral nodes and no gross extrathyroidal extension."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
        "presentation": "{patientName}, a 43-year-old man, reviews a completed preoperative neck ultrasound after malignant thyroid cytology. It documents no suspicious central or lateral nodes and no gross extrathyroidal extension."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
        "presentation": "{patientName}, a 68-year-old woman, reviews a completed preoperative neck ultrasound after malignant thyroid cytology. It documents no suspicious central or lateral nodes and no gross extrathyroidal extension."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
        "presentation": "{patientName}, a 68-year-old man, reviews a completed preoperative neck ultrasound after malignant thyroid cytology. It documents no suspicious central or lateral nodes and no gross extrathyroidal extension."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Thyroid surgery planning",
    "previousChiefComplaint": "Review neck ultrasound",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Identify the anatomical information actually acquired rather than treating a clear nodal survey as a complete pathology or functional staging result.",
    "reviewerNotes": "Uses existing preoperative mapping and surgical-extent claims. Microscopic capsular/vascular invasion remains histological; the item does not prescribe a neck dissection or thyroid operation.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f16.d1": "d1_4",
      "choice.qf20261104.f16.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f16.d1": null,
      "choice.qf20261104.f16.d2": null
    },
    "question": {
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r2",
      "conceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "stem": "Which part of {patientName}'s operative assessment is provided by this ultrasound report?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Anatomical staging for operative planning",
          "isCorrect": true,
          "rationale": "The study contributes the neck nodal/local-extension map used in surgical planning; a clear survey does not exclude microscopic disease.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f16.d1",
          "label": "Histological grading for operative planning",
          "isCorrect": false,
          "distractorRationale": "Microscopic tumour features are not established by the supplied ultrasound survey."
        },
        {
          "id": "choice.qf20261104.f16.d2",
          "label": "Functional imaging for radioiodine planning",
          "isCorrect": false,
          "distractorRationale": "Functional uptake at distant sites is not the regional anatomical information provided by this neck ultrasound."
        }
      ],
      "explanation": "Preoperative neck ultrasound contributes central/lateral nodal and gross local-extension information to thyroid surgical planning. It is one part of the assessment, not proof that microscopic nodal disease is absent, a histological invasion assessment or a radioiodine uptake study.",
      "teachingPoint": "Preoperative neck ultrasound contributes central/lateral nodal and gross local-extension information to thyroid surgical planning. It is one part of the assessment, not proof that microscopic nodal disease is absent, a histological invasion assessment or a radioiodine uptake study.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.dtc.extent"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "nextConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "2029401b-c009-4286-8ce9-bb9b14ebd2c9",
        "93ea4af9-06cb-4faa-928b-3859d047f6c4"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced patient reviews an ultrasound with the clinician discusses the radiologist’s report. Defined the observed node/extension findings and replaced impossible benign-cancer/no-recurrence/no-consultation distractors with real assessment domains.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf20261104.f17",
    "auditId": "F17",
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "previousQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which next diagnostic step best resolves {patientName}'s suspicious palpable breast mass despite negative mammography and ultrasound?",
    "previousChoiceLabels": [
      "Breast-specialist biopsy referral",
      "Contrast-enhanced breast MRI",
      "Repeat targeted breast ultrasound",
      "Repeat diagnostic mammography"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review.",
    "previousPresentation": "{patientName}, a 50-year-old woman, is referred after a breast surgeon confirms a firm angular mass in the exact area of concern. Both diagnostic mammography and targeted ultrasound are negative.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
        "presentation": "{patientName}, a 50-year-old woman, is referred after a breast surgeon confirms a firm angular mass in the exact area of concern. Both diagnostic mammography and targeted ultrasound are negative."
      },
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
        "presentation": "{patientName}, a 64-year-old woman, is referred after a breast surgeon confirms a firm angular mass in the exact area of concern. Both diagnostic mammography and targeted ultrasound are negative."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 50,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf20261104.",
      "contentVersion": "presentation-revision.question-flags.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent breast lump",
    "previousChiefComplaint": "Suspicious breast examination",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50"
      },
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret what the imaging did not show, then recognize unresolved clinical/imaging discordance that still requires tissue.",
    "reviewerNotes": "The existing ACR-linked biopsy claim supports this decision. Single-source limitation remains; no sensitivity guarantee or mandatory biopsy technique is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf20261104.f17.d1": "d1_4",
      "choice.qf20261104.f17.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf20261104.f17.d1": "service.breast_mri",
      "choice.qf20261104.f17.d2": "service.ultrasound"
    },
    "question": {
      "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
      "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "stem": "Which next diagnostic plan should be arranged for {patientName}'s persistent palpable finding?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Arrange tissue sampling of the palpable area",
          "isCorrect": true,
          "rationale": "A persistently suspicious clinical finding needs tissue diagnosis despite the absence of an imaging correlate. The specialist selects an appropriate sampling technique.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf20261104.f17.d1",
          "label": "Arrange contrast-enhanced MRI of the palpable area",
          "isCorrect": false,
          "distractorRationale": "Further imaging is a tempting response to the discordance, but does not replace tissue diagnosis of the persistent clinically suspicious finding."
        },
        {
          "id": "choice.qf20261104.f17.d2",
          "label": "Arrange repeat ultrasound of the palpable area",
          "isCorrect": false,
          "distractorRationale": "Repetition would be reasonable for inadequate localization or acquisition; here the already targeted study does not explain away the persistent suspicious examination."
        }
      ],
      "explanation": "No mammographic or sonographic correlate is different from proof that a palpable mass is benign. The persistent firm irregular examination requires breast-specialist tissue diagnosis rather than an imaging-only loop. The sampling technique depends on the clinical target and specialist assessment.",
      "teachingPoint": "No mammographic or sonographic correlate is different from proof that a palpable mass is benign. The persistent firm irregular examination requires breast-specialist tissue diagnosis rather than an imaging-only loop. The sampling technique depends on the clinical target and specialist assessment.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "contentVersion": "question-authoring.2026-11-04.v11",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "nextConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same scored clinical objective; raw presentation, plausible options and task wording change."
    },
    "flagReview": {
      "flagIds": [
        "34e373b5-3d0a-45d5-af18-4bd472fee3d1"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Defined the imaging findings at the marked palpable site, removed the diagnosis-like complaint/task qualifiers and retained three concrete diagnostic plans. Kept biopsy technique conditional on specialist assessment.",
      "status": "awaiting_independent_and_clinician_review"
    }
  }
];

export const QUESTION_FLAG_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.varicose-veins.axial-trunk-referral-target.v1",
    "displayName": "Target an axial superficial-reflux referral",
    "learningObjective": "Use duplex anatomy to identify the axial superficial-vein target for specialist intervention assessment.",
    "conceptType": "management",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
    "versioningReason": "The old objective chooses intervention referral versus conservative care from candidacy and preference. The replacement instead identifies a specific venous treatment target from duplex anatomy, so it requires a new scored-construct version. Preserve the old concept and FSRS history rather than relabelling this change as wording only.",
    "revisedItemIds": [
      "F03"
    ],
    "evidenceClaimIds": [
      "claim.varicose.reflux-duplex"
    ],
    "contentVersion": "concept.question-flags.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.dcis.sentinel-node-mastectomy.v1",
    "displayName": "DCIS axillary staging at mastectomy",
    "learningObjective": "Apply the planned mastectomy setting to choose the timing and extent of axillary staging for sampled DCIS.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.dcis.sentinel-node-setting",
    "versioningReason": "Replace the disputed oncoplastic future-mapping exception with the separately sourced standard mastectomy setting. The old broad setting concept and original question remain available for frozen encounters; history is not silently transferred to this narrower scored construct.",
    "revisedItemIds": [
      "F10"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.dcis.axilla-mastectomy",
      "claim.gs028c.dcis.axilla-omit-bcs"
    ],
    "contentVersion": "concept.question-flags.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  }
];
