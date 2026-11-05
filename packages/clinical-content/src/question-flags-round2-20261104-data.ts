import type { QuestionFlagRevision, QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Round-two additive drafts. Prior versions retain their exact identities and approvals. */
export const QUESTION_FLAG_ROUND2_DEFINITIONS: QuestionFlagRevision[] = [
  {
    "id": "revision.qf2.20261104.f01",
    "auditId": "F01",
    "caseId": "case.gs028c.dcis.a-one-mm-individualize",
    "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
    "previousQuestionVariantId": "question.dcis.margin-bcs-wbrt.v3.r2",
    "questionVariantId": "question.dcis.margin-bcs-wbrt.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which next plan best addresses {patientName}'s surgical margin before irradiation?",
    "previousChoiceLabels": [
      "Review oriented pathology and residual breast imaging",
      "Schedule re-excision of the closest cavity margin",
      "Proceed to irradiation using the margin-distance summary"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after breast-conserving surgery for high-grade pure DCIS. Whole-breast irradiation is planned. The surgeon and radiologist have reconciled the oriented specimens and postoperative mammogram.",
    "previousPresentation": "{patientName}, a 45-year-old woman, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.45",
        "presentation": "{patientName}, a 45-year-old woman, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned."
      },
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.61",
        "presentation": "{patientName}, a 61-year-old woman, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028c.dcis.a-one-mm-individualize",
        "patientPresentationVariantId": "presentation.gs028c.dcis.a-one-mm-individualize",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "DCIS follow-up",
        "revisedPresentation": "{patientName}, a 45-year-old woman, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028c.dcis.a-one-mm-individualize.female.45",
            "approvedInstantiationProfileId": "profile.gs028c.dcis.a-one-mm-individualize.female.45",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old woman, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028c.dcis.a-one-mm-individualize.female.61",
            "approvedInstantiationProfileId": "profile.gs028c.dcis.a-one-mm-individualize.female.61",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 61-year-old woman, returns after lumpectomy for pure DCIS. No DCIS touches ink, but the closest radial margin is 1 mm. Whole-breast irradiation is planned.",
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
        "ageYears": 45,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "DCIS margin review",
    "previousChiefComplaint": "DCIS follow-up",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.45",
        "chiefComplaint": "DCIS follow-up"
      },
      {
        "id": "profile.gs028c.dcis.a-one-mm-individualize.female.61",
        "chiefComplaint": "DCIS follow-up"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify which inked surface is the final posterior boundary. Then: Apply the sourced 2-mm pure-DCIS/irradiation rule to that final boundary.",
    "reviewerNotes": "Two recorded society sources support the exact 2-mm rule. Specimen orientation is a fictional observation, not a new rule about adding margin widths. Melissa must confirm the constructed pathology workflow.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf2.20261104.f01.d1": "choice.qf20261104.f01.d1",
      "choice.qf2.20261104.f01.d2": "choice.qf20261104.f01.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf2.20261104.f01.d1": null,
      "choice.qf2.20261104.f01.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f01.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f01.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.dcis.margin-bcs-wbrt.v3.r3",
      "conceptId": "concept.dcis.final-cavity-shave-plan.v1",
      "stem": "Which breast treatment plan is most appropriate for {patientName} now?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Proceed with whole-breast irradiation",
          "isCorrect": true,
          "rationale": "The additional oriented shave supplies the final posterior boundary. Its 2-mm negative edge meets the pure-DCIS/whole-breast-irradiation adequacy rule; the 1-mm main-specimen edge is not the final cavity edge.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f01.d1",
          "label": "Re-excise posteriorly, then use whole-breast irradiation",
          "isCorrect": false,
          "distractorRationale": "This is the near miss if the original 1-mm edge is carried forward without reconciling the separately oriented final margin."
        },
        {
          "id": "choice.qf2.20261104.f01.d2",
          "label": "Convert to completion mastectomy",
          "isCorrect": false,
          "distractorRationale": "High grade and DCIS within an additional specimen do not by themselves negate the documented adequate final margins or mandate mastectomy."
        }
      ],
      "explanation": "The separately oriented external cavity-shave edge is the final posterior margin. Do not add specimen distances or carry forward the main-specimen measurement. The final negative margins are at least 2 mm and no residual calcifications are identified. For pure DCIS with planned whole-breast irradiation, this supports proceeding without routine wider re-excision. High grade does not create a different margin threshold here.",
      "teachingPoint": "The separately oriented external cavity-shave edge is the final posterior margin. Do not add specimen distances or carry forward the main-specimen measurement. The final negative margins are at least 2 mm and no residual calcifications are identified. For pure DCIS with planned whole-breast irradiation, this supports proceeding without routine wider re-excision. High grade does not create a different margin threshold here.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Final specimen and imaging observations",
        "items": [
          {
            "label": "Main lumpectomy specimen",
            "value": "DCIS is 1 mm from the posterior inked edge."
          },
          {
            "label": "Separately oriented posterior cavity shave",
            "value": "DCIS is 2 mm from its new external inked edge."
          },
          {
            "label": "Remaining final margins",
            "value": "At least 2 mm clear of DCIS."
          },
          {
            "label": "Postexcision mammogram",
            "value": "No residual calcifications at the excision site."
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028c.dcis.margin-two-mm",
        "claim.gs028c.dcis.margin-no-routine-wider",
        "claim.gs028c.dcis.margin-narrow-individualize"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dcis.margin-bcs-wbrt",
      "nextConceptId": "concept.dcis.final-cavity-shave-plan.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior question requests more record review for a close edge. This decision uses completed, reconciled final margins to choose treatment; preserve the earlier scored construct and histories."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.dcis.margin-bcs-wbrt.v3.r2",
      "whatChanged": "Replaced the sequential review/re-excision pair with three treatment plans at the same stage. Supplied completed review, separate specimen orientation and actual final distances; removed the restricted-information qualifier.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "4acc4724-8e4a-4de9-a08a-ecb539aad63c"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced the sequential review/re-excision pair with three treatment plans at the same stage. Supplied completed review, separate specimen orientation and actual final distances; removed the restricted-information qualifier.",
      "sourceDecision": "Two recorded society sources support the exact 2-mm rule. Specimen orientation is a fictional observation, not a new rule about adding margin widths. Melissa must confirm the constructed pathology workflow.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f02",
    "auditId": "F02",
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "previousQuestionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r2",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which nerve most likely carries the initiating afferent signal for {patientName}'s postoperative pain pattern?",
    "previousChoiceLabels": [
      "Phrenic nerve",
      "Vagus nerve",
      "Suprascapular nerve",
      "Supraclavicular nerves"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
    "previousPresentation": "{patientName}, a 42-year-old woman, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "presentation": "{patientName}, a 42-year-old woman, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "presentation": "{patientName}, a 42-year-old man, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "presentation": "{patientName}, a 68-year-old woman, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "presentation": "{patientName}, a 68-year-old man, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028e.mis-principles.c3-phrenic-pathway",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c3-phrenic-pathway",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Shoulder ache",
        "revisedPresentation": "{patientName}, a 42-year-old woman, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old woman, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old man, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, returns after laparoscopic cholecystectomy. An ache at the right shoulder tip began after the operation and is diminishing. Shoulder motion and power are preserved, and moving the arm does not reproduce the ache. The patient is breathing comfortably with a soft abdomen and healing incisions.",
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
        "ageYears": 42,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative record review",
    "previousChiefComplaint": "Shoulder ache",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "chiefComplaint": "Shoulder ache"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "chiefComplaint": "Shoulder ache"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "chiefComplaint": "Shoulder ache"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "chiefComplaint": "Shoulder ache"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the later abdominal course requires a different assessment from uncomplicated shoulder referral. Then: Select an anatomical duct-localization study rather than a leak-detection or conventional-fluid study.",
    "reviewerNotes": "The existing WSES-linked leak claim supports the selected stable, post-CT context. It does not endorse MRCP before resuscitation or define a universal study for every postoperative shoulder symptom.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qf2.20261104.f02.d1": "choice.qf20261104.f02.d1",
      "choice.qf2.20261104.f02.d2": "choice.qf20261104.f02.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qf2.20261104.f02.d1": null,
      "choice.qf2.20261104.f02.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.hepatobiliary_contrast_mrcp"
      },
      "choice.qf2.20261104.f02.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.qf2.20261104.f02.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      }
    },
    "question": {
      "id": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
      "stem": "Which additional imaging request would best establish the duct anatomy for {patientName}'s treatment planning at that stage?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "MR cholangiography with a hepatobiliary contrast agent",
          "isCorrect": true,
          "rationale": "After CT has assessed the collection, hepatobiliary-contrast MRCP can localize suspected leakage and assess duct continuity.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f02.d1",
          "label": "Hepatobiliary scintigraphy with dynamic delayed imaging",
          "isCorrect": false,
          "distractorRationale": "This can demonstrate active leakage, but provides less spatial information for the requested duct-continuity assessment."
        },
        {
          "id": "choice.qf2.20261104.f02.d2",
          "label": "MR cholangiography without a hepatobiliary contrast agent",
          "isCorrect": false,
          "distractorRationale": "Conventional duct-fluid imaging depicts fluid-filled ducts but does not show the excretion of hepatobiliary contrast into the collection."
        }
      ],
      "explanation": "The later abdominal findings and drained fluid prevent attributing the course to uncomplicated shoulder referral. After CT has assessed postoperative collections, hepatobiliary-contrast MRCP can localize a suspected bile leak and assess duct continuity. Scintigraphy can demonstrate active leakage but gives less spatial detail. This anatomical assessment follows the initial evaluation of the stable patient.",
      "teachingPoint": "The later abdominal findings and drained fluid prevent attributing the course to uncomplicated shoulder referral. After CT has assessed postoperative collections, hepatobiliary-contrast MRCP can localize a suspected bile leak and assess duct continuity. Scintigraphy can demonstrate active leakage but gives less spatial detail. This anatomical assessment follows the initial evaluation of the stable patient.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain",
        "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary",
        "claim.early.bile-leak.ce-mrcp-anatomic-localization"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
      "nextConceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A nerve-association question becomes a clinical imaging decision after postoperative reassessment. The new workup objective must not inherit the anatomy card history."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r2",
      "whatChanged": "Removed the nerve-list task and local-shoulder exclusions. The owner’s anatomical-outlier problem is resolved by a new application with three genuine biliary imaging competitors; no claim that pain alone diagnoses a leak.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "a0a20925-6852-4fdf-bee4-997d10a89305"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the nerve-list task and local-shoulder exclusions. The owner’s anatomical-outlier problem is resolved by a new application with three genuine biliary imaging competitors; no claim that pain alone diagnoses a leak.",
      "sourceDecision": "The existing WSES-linked leak claim supports the selected stable, post-CT context. It does not endorse MRCP before resuscitation or define a universal study for every postoperative shoulder symptom.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f03",
    "auditId": "F03",
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "previousQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r2",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which proposed treatment should the vascular referral ask the team to assess for {patientName}'s demonstrated reflux?",
    "previousChoiceLabels": [
      "Endovenous truncal ablation",
      "Ambulatory tributary phlebectomy",
      "Iliac venous stent placement"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
    "previousPresentation": "{patientName}, a 43-year-old woman, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.43",
        "presentation": "{patientName}, a 43-year-old woman, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.43",
        "presentation": "{patientName}, a 43-year-old man, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.68",
        "presentation": "{patientName}, a 68-year-old man, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028.varicose-veins.b-limited-mobility",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-limited-mobility",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Aching varicose veins",
        "revisedPresentation": "{patientName}, a 43-year-old woman, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028.varicose-veins.b-limited-mobility.female.43",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.female.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028.varicose-veins.b-limited-mobility.male.43",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.male.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028.varicose-veins.b-limited-mobility.female.68",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.female.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028.varicose-veins.b-limited-mobility.male.68",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.male.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, has aching medial-calf varicosities with prolonged standing. Duplex records retrograde flow along the great saphenous trunk from the groin into the calf, with visible tributary varices.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Aching varicose veins",
    "previousChiefComplaint": "Aching varicose veins",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.43",
        "chiefComplaint": "Aching varicose veins"
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.43",
        "chiefComplaint": "Aching varicose veins"
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.68",
        "chiefComplaint": "Aching varicose veins"
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.68",
        "chiefComplaint": "Aching varicose veins"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the scope of the completed compression study from its acquisition findings. Then: Request the reflux protocol needed for a different clinical decision.",
    "reviewerNotes": "Uses the recorded reflux-study claim and its explicit DVT-protocol limitation. No reflux-duration cutoff, technical candidacy requirement or mandatory procedure is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f03.d1": "choice.qf20261104.f03.d1",
      "choice.qf2.20261104.f03.d2": "choice.qf20261104.f03.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f03.d1": null,
      "choice.qf2.20261104.f03.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf2.20261104.f03.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf2.20261104.f03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "question": {
      "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
      "conceptId": "concept.varicose-veins.reflux-after-compression-study.v1",
      "stem": "Which investigation should {patientName}'s vascular referral request before a treatment is selected?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Request a venous reflux duplex study",
          "isCorrect": true,
          "rationale": "A compression study for thrombus does not supply the superficial reflux distribution needed for intervention assessment. A dedicated reflux study addresses that clinical question.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f03.d1",
          "label": "Request a deep-venous compression duplex study",
          "isCorrect": false,
          "distractorRationale": "This repeats the supplied thrombus-focused protocol rather than obtaining the reflux information relevant to the standing symptoms and visible veins."
        },
        {
          "id": "choice.qf2.20261104.f03.d2",
          "label": "Request a pelvic contrast CT venogram",
          "isCorrect": false,
          "distractorRationale": "Proximal outflow imaging is a real venous investigation, but is not the initial diagnostic study of choice for the stated symptomatic superficial reflux assessment."
        }
      ],
      "explanation": "Compressible deep veins address thrombus; they do not establish the reflux distribution needed for intervention planning. Duplex reflux assessment is the diagnostic study of choice for symptomatic chronic venous reflux. The referral should request that protocol before selecting a treatment from the visible veins.",
      "teachingPoint": "Compressible deep veins address thrombus; they do not establish the reflux distribution needed for intervention planning. Duplex reflux assessment is the diagnostic study of choice for symptomatic chronic venous reflux. The referral should request that protocol before selecting a treatment from the visible veins.",
      "supportingEvidenceClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.varicose-veins.axial-trunk-referral-target.v1",
      "nextConceptId": "concept.varicose-veins.reflux-after-compression-study.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "This is diagnostic-protocol selection rather than matching a named axial vein to an intervention; preserve both earlier candidacy and target-selection constructs."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r2",
      "whatChanged": "Replaced trunk-to-truncal word matching and iliac-stent padding with a real protocol error. All options are specific venous investigations; the key is also ultrasound, so novelty alone cannot select it.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "bb8d30e3-0621-4faa-bc5b-5842aa2b1546"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced trunk-to-truncal word matching and iliac-stent padding with a real protocol error. All options are specific venous investigations; the key is also ultrasound, so novelty alone cannot select it.",
      "sourceDecision": "Uses the recorded reflux-study claim and its explicit DVT-protocol limitation. No reflux-duration cutoff, technical candidacy requirement or mandatory procedure is invented.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f04",
    "auditId": "F04",
    "caseId": "case.gs028d.hyperkalaemia.a-renal-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-renal-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r2",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Under the UK Kidney Association adult pathway, what disposition should be arranged for {patientName} now?",
    "previousChoiceLabels": [
      "Send for hospital assessment now",
      "Repeat potassium in the community later today",
      "Begin an outpatient potassium-binder plan"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
    "previousPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
        "presentation": "{patientName}, a 52-year-old woman with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
        "presentation": "{patientName}, a 52-year-old man with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
        "presentation": "{patientName}, a 70-year-old woman with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
        "presentation": "{patientName}, a 70-year-old man with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028d.hyperkalaemia.a-renal-result",
        "patientPresentationVariantId": "presentation.gs028d.hyperkalaemia.a-renal-result",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Potassium result review",
        "revisedPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028d.hyperkalaemia.a-renal-result.female.52",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028d.hyperkalaemia.a-renal-result.male.52",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028d.hyperkalaemia.a-renal-result.female.70",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old woman with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028d.hyperkalaemia.a-renal-result.male.70",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old man with advanced kidney disease, returns after an outside laboratory reports potassium 6.7 mmol/L. The laboratory confirms the result on a non-haemolysed sample. The patient reports feeling well, and the clinic ECG shows sinus rhythm without new conduction changes.",
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
        "ageYears": 52,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Potassium treatment review",
    "previousChiefComplaint": "Potassium result review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
        "chiefComplaint": "Potassium result review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret what the calcium-associated ECG response does and does not show. Then: Choose potassium-shifting treatment for the still-elevated concentration.",
    "reviewerNotes": "The recorded UKKA mechanism claim supports calcium versus insulin/glucose. This is not a full emergency algorithm; no medication dose, repeat-calcium timing or outcome probability is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qf2.20261104.f04.d1": "choice.qf20261104.f04.d1",
      "choice.qf2.20261104.f04.d2": "choice.qf20261104.f04.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qf2.20261104.f04.d1": null,
      "choice.qf2.20261104.f04.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f04.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f04.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v1.r3",
      "conceptId": "concept.hyperkalaemia.post-calcium-treatment.v1",
      "stem": "Which next plan is most appropriate at that point in {patientName}'s hospital care?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Administer insulin with glucose",
          "isCorrect": true,
          "rationale": "ECG improvement after calcium does not demonstrate a potassium fall. Insulin with glucose supplies a potassium-shifting action that calcium does not.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f04.d1",
          "label": "Administer another intravenous calcium dose",
          "isCorrect": false,
          "distractorRationale": "Calcium can protect cardiac membrane physiology, but another dose is not a potassium-lowering action for the unchanged result after the documented ECG response."
        },
        {
          "id": "choice.qf2.20261104.f04.d2",
          "label": "Continue telemetry-guided observation",
          "isCorrect": false,
          "distractorRationale": "This is a plausible plan after successful biochemical treatment, but the unchanged severe potassium means the documented ECG response has not completed that treatment."
        }
      ],
      "explanation": "The ECG changed, but serum potassium did not. Calcium protects cardiac membrane physiology without lowering potassium; insulin with glucose shifts potassium into cells. The unchanged severe concentration therefore still requires potassium-lowering treatment. A narrower QRS does not establish that the biochemical problem has been corrected.",
      "teachingPoint": "The ECG changed, but serum potassium did not. Calcium protects cardiac membrane physiology without lowering potassium; insulin with glucose shifts potassium into cells. The unchanged severe concentration therefore still requires potassium-lowering treatment. A narrower QRS does not establish that the biochemical problem has been corrected.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.gs028d.hyperkalaemia.mechanisms"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.post-calcium-treatment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The original objective is community disposition; the replacement scores treatment-response interpretation after hospital admission. Keep their histories separate."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r2",
      "whatChanged": "Moved the scored decision beyond the easily recognized transfer threshold. Retained confirmed severe potassium, removed availability permission and repeated-community-test elimination, and compared actual post-calcium plans.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "0fe0cca7-0c4d-40e9-af26-db95733f95dd"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Moved the scored decision beyond the easily recognized transfer threshold. Retained confirmed severe potassium, removed availability permission and repeated-community-test elimination, and compared actual post-calcium plans.",
      "sourceDecision": "The recorded UKKA mechanism claim supports calcium versus insulin/glucose. This is not a full emergency algorithm; no medication dose, repeat-calcium timing or outcome probability is authored.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f05",
    "auditId": "F05",
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "previousQuestionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which initial tissue-sampling referral is most appropriate for {patientName}'s assessed lateral neck lymph node?",
    "previousChoiceLabels": [
      "Fine-needle aspiration of the neck node",
      "Open incisional biopsy of the neck node",
      "Open excisional biopsy of the neck node"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
    "previousPresentation": "{patientName}, a 43-year-old woman, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
        "presentation": "{patientName}, a 43-year-old woman, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
        "presentation": "{patientName}, a 43-year-old man, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
        "presentation": "{patientName}, a 58-year-old woman, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
        "presentation": "{patientName}, a 58-year-old man, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028f.neck-mass.c2-completed-needle-record",
        "patientPresentationVariantId": "presentation.gs028f.neck-mass.c2-completed-needle-record",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Persistent neck lump",
        "revisedPresentation": "{patientName}, a 43-year-old woman, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old woman, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old man, has a persistent firm lateral neck lymph node. Specialist examination and contrast neck imaging identify a solid node separate from the thyroid and salivary glands. The cause remains undiagnosed, and tissue sampling is being planned.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent neck lump",
    "previousChiefComplaint": "Persistent neck lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
        "chiefComplaint": "Persistent neck lump"
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
        "chiefComplaint": "Persistent neck lump"
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
        "chiefComplaint": "Persistent neck lump"
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
        "chiefComplaint": "Persistent neck lump"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that cyst contents without lesional cells do not establish the cause. Then: Choose representative needle reassessment before surveillance or an open-first approach.",
    "reviewerNotes": "The recorded guideline supports the cystic-mass boundary and selected core assessment after inadequate material. It does not universally rank repeat FNA over core or establish public ABSITE coverage.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f05.d1": "choice.qf20261104.f05.d1",
      "choice.qf2.20261104.f05.d2": "choice.qf20261104.f05.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f05.d1": null,
      "choice.qf2.20261104.f05.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f05.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
      "conceptId": "concept.head-neck.cyst-fluid-sample-assessment.v1",
      "stem": "Which next diagnostic plan should be requested for {patientName}'s neck lesion?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Repeat image-guided needle assessment of the lesion",
          "isCorrect": true,
          "rationale": "The cyst-fluid specimen does not establish a benign diagnosis. Further representative needle assessment can include FNA or selected core sampling; it is not a fixed repeat-FNA mandate.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f05.d1",
          "label": "Arrange open diagnostic excision of the lesion",
          "isCorrect": false,
          "distractorRationale": "Open tissue is a tempting response to an unrepresentative aspiration, but the supplied record does not establish that an appropriately targeted needle assessment has been exhausted."
        },
        {
          "id": "choice.qf2.20261104.f05.d2",
          "label": "Arrange interval ultrasound surveillance of the lesion",
          "isCorrect": false,
          "distractorRationale": "A refilling cystic adult neck mass and a fluid-only sample do not establish a benign developmental lesion that can be followed as resolved."
        }
      ],
      "explanation": "Fluid and macrophages do not establish the cause of this persistent adult neck lesion. Its cystic appearance does not exclude malignancy. Representative image-guided needle assessment can use FNA or selected core sampling according to the material required. Open biopsy should not replace an appropriately targeted needle workup.",
      "teachingPoint": "Fluid and macrophages do not establish the cause of this persistent adult neck lesion. Its cystic appearance does not exclude malignancy. Representative image-guided needle assessment can use FNA or selected core sampling according to the material required. Open biopsy should not replace an appropriately targeted needle workup.",
      "supportingEvidenceClaimIds": [
        "claim.gs028f.neck.adult-lateral-malignancy-evaluation",
        "claim.gs028f.neck.needle-before-open",
        "claim.gs028f.neck.core-biopsy-alternative",
        "claim.gs028f.neck.imaging-versus-tissue-diagnosis"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
      "nextConceptId": "concept.head-neck.cyst-fluid-sample-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior card asks for the initial FNA route. The replacement scores adequacy and the next diagnostic strategy, so it receives a new construct version."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r2",
      "whatChanged": "Replaced the pair of open-biopsy foils with surveillance and open excision after a real adequacy problem. The key repeats a test class instead of winning as the only untried procedure. Neck anatomy is explicit.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "65a34315-920b-45c8-a101-2e85a1ffcf77"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced the pair of open-biopsy foils with surveillance and open excision after a real adequacy problem. The key repeats a test class instead of winning as the only untried procedure. Neck anatomy is explicit.",
      "sourceDecision": "The recorded guideline supports the cystic-mass boundary and selected core assessment after inadequate material. It does not universally rank repeat FNA over core or establish public ABSITE coverage.",
      "scopeDecision": "RETIRE this exact item from an ABSITE-labelled bank unless permitted public scope verification is supplied. The revised candidate is retained only for owner review as general clinical neck-mass reasoning; clinical relevance does not prove exam scope. No SCORE or recalled items were consulted.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f06",
    "auditId": "F06",
    "caseId": "case.gs028e.immunology.c3-historical-kidney-event",
    "nodeId": "node.gs028e.immunology.c3-historical-kidney-event.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r2",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which immune process best explains the combination of findings in {patientName}'s archived graft-failure record?",
    "previousChoiceLabels": [
      "Pre-existing donor-reactive recipient antibodies",
      "Newly generated donor-reactive recipient antibodies",
      "Activated recipient T lymphocytes against graft tissue"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
    "previousPresentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
        "presentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
        "presentation": "{patientName}, a 41-year-old man, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
        "presentation": "{patientName}, a 64-year-old woman, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
        "presentation": "{patientName}, a 64-year-old man, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028e.immunology.c3-historical-kidney-event",
        "patientPresentationVariantId": "presentation.gs028e.immunology.c3-historical-kidney-event",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Transplant record review",
        "revisedPresentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old man, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old man, brings records of a failed kidney transplant for discussion at a stable clinic visit. After blood flow was restored during the operation, the graft became mottled and stopped producing urine. The major graft vessels were patent. Biopsy showed small-vessel thrombi with immunoglobulin and complement along graft endothelium. Testing of stored serum collected before transplantation showed binding to donor cells.",
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
        "ageYears": 41,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Transplant record review",
    "previousChiefComplaint": "Transplant record review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
        "chiefComplaint": "Transplant record review"
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
        "chiefComplaint": "Transplant record review"
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
        "chiefComplaint": "Transplant record review"
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
        "chiefComplaint": "Transplant record review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Infer the antibody-associated endothelial injury pattern while retaining technical-flow information. Then: Predict which preimplantation material and donor/recipient target direction fit that mechanism.",
    "reviewerNotes": "Uses the recorded transplant mechanism claims. It does not establish a particular antigen, Banff algorithm, crossmatch sensitivity, transplant treatment or universal timing cutoff.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qf2.20261104.f06.d1": "choice.qf20261104.f06.d1",
      "choice.qf2.20261104.f06.d2": "choice.qf20261104.f06.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qf2.20261104.f06.d1": null,
      "choice.qf2.20261104.f06.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f06.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f06.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r3",
      "conceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
      "stem": "Which archived laboratory result would be most consistent with {patientName}'s graft event?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Recipient serum collected before implantation binds donor endothelial cells",
          "isCorrect": true,
          "rationale": "The vascular pattern fits antibodies already present in the recipient and directed at donor endothelium.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f06.d1",
          "label": "Donor serum collected before implantation binds recipient endothelial cells",
          "isCorrect": false,
          "distractorRationale": "This reverses the direction of immune injury relevant to the graft record; donor material attacking recipient cells is not the supported initiating graft-endothelial interaction."
        },
        {
          "id": "choice.qf2.20261104.f06.d2",
          "label": "Recipient lymphocytes collected before implantation destroy donor parenchymal cells",
          "isCorrect": false,
          "distractorRationale": "Cellular alloreactivity is a real transplant mechanism, but does not best account for the immediate endothelial immunoglobulin/complement and thrombotic pattern. Pathways can coexist."
        }
      ],
      "explanation": "The endothelial immunoglobulin/complement and thrombotic pattern favors a preformed recipient-antibody mechanism. Antibodies already present before implantation can bind donor endothelium, predicting the recipient-serum interaction. Reversing donor and recipient would not explain injury to the graft in the same way. Cellular and antibody pathways can coexist; these findings favor the vascular antibody pathway.",
      "teachingPoint": "The endothelial immunoglobulin/complement and thrombotic pattern favors a preformed recipient-antibody mechanism. Antibodies already present before implantation can bind donor endothelium, predicting the recipient-serum interaction. Reversing donor and recipient would not explain injury to the graft in the same way. Cellular and antibody pathways can coexist; these findings favor the vascular antibody pathway.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.gs028e.t_cell_graft_comparison"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
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
      "reason": "The scored clinical meaning remains the pre-existing recipient-antibody mechanism of hyperacute graft injury. Predicting its archived interaction is an application of that same mechanism, not a new treatment or transplant-selection objective."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r2",
      "whatChanged": "Deleted the pretransplant donor-binding sentence. Changed the task from naming its components to predicting an unprovided archived result, with a reversed immune direction and a cellular near miss.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "0dfbbe4f-fbed-457b-bbcc-2053772b6d80"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deleted the pretransplant donor-binding sentence. Changed the task from naming its components to predicting an unprovided archived result, with a reversed immune direction and a cellular near miss.",
      "sourceDecision": "Uses the recorded transplant mechanism claims. It does not establish a particular antigen, Banff algorithm, crossmatch sensitivity, transplant treatment or universal timing cutoff.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f07",
    "auditId": "F07",
    "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r2",
    "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which perioperative risk domain is most liable to be underestimated if {patientName}'s current biochemical profile drives the assessment?",
    "previousChoiceLabels": [
      "Portal hypertension with decompensation",
      "Hepatic synthetic and excretory function",
      "Renal filtration and electrolyte function"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
    "previousPresentation": "{patientName}, a 43-year-old woman, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "presentation": "{patientName}, a 43-year-old woman, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "presentation": "{patientName}, a 43-year-old man, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "presentation": "{patientName}, a 68-year-old man, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Cirrhosis preoperative review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, is being assessed before elective abdominal surgery. Current bilirubin, albumin, INR and creatinine are within the laboratory reference ranges. The records also show a previous variceal haemorrhage, an enlarged spleen and a persistently reduced platelet count.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Hernia preoperative review",
    "previousChiefComplaint": "Cirrhosis preoperative review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "chiefComplaint": "Cirrhosis preoperative review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "chiefComplaint": "Cirrhosis preoperative review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "chiefComplaint": "Cirrhosis preoperative review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "chiefComplaint": "Cirrhosis preoperative review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the new fluid findings as active decompensation rather than merely a historical risk marker. Then: Apply that interpretation to the timing of a nonurgent, reducible-hernia operation.",
    "reviewerNotes": "Single recorded AGA expert review. No mortality estimate, platelet threshold, anaesthetic superiority claim or universal surgical exclusion is taught. Melissa must review the plan ranking.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf2.20261104.f07.d1": "choice.qf20261104.f07.d1",
      "choice.qf2.20261104.f07.d2": "choice.qf20261104.f07.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf2.20261104.f07.d1": null,
      "choice.qf2.20261104.f07.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f07.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f07.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r3",
      "conceptId": "concept.cirrhosis.new-fluid-elective-plan.v1",
      "stem": "Which plan should be taken to {patientName}'s preoperative conference?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Control ascites before finalizing the repair date",
          "isCorrect": true,
          "rationale": "The new fluid findings indicate an active decompensation issue despite reassuring biochemistry. Active decompensation supports optimization before a nonurgent elective operation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f07.d1",
          "label": "Raise the platelet count before finalizing the repair date",
          "isCorrect": false,
          "distractorRationale": "Attention to bleeding risk is a genuine consideration, but it does not address the new active clinical event; no platelet-transfusion threshold is inferred from the stable history."
        },
        {
          "id": "choice.qf2.20261104.f07.d2",
          "label": "Reserve postoperative critical care before finalizing the repair date",
          "isCorrect": false,
          "distractorRationale": "Facility support is a real risk factor, but arranging it does not replace optimization of the newly demonstrated decompensation."
        }
      ],
      "explanation": "The new fluid findings indicate a decompensation issue despite reassuring current biochemistry. The still-reducible hernia allows optimization of ascites and reassessment before elective repair. Addressing a platelet count or arranging postoperative support does not control this active problem. An urgent surgical presentation would require a different timing assessment.",
      "teachingPoint": "The new fluid findings indicate a decompensation issue despite reassuring current biochemistry. The still-reducible hernia allows optimization of ascites and reassessment before elective repair. Addressing a platelet count or arranging postoperative support does not control this active problem. An urgent surgical presentation would require a different timing assessment.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "nextConceptId": "concept.cirrhosis.new-fluid-elective-plan.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior item names an underestimated risk domain. This version scores an operative-timing consequence of a new clinical event; keep the risk-domain history separate."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r2",
      "whatChanged": "Removed the task instruction to discount biochemistry, corrected the historical/current decompensation distinction, and replaced domain labels with actual perioperative plans.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "08837a69-f1de-4fe8-bb7e-4f1a2e481718"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the task instruction to discount biochemistry, corrected the historical/current decompensation distinction, and replaced domain labels with actual perioperative plans.",
      "sourceDecision": "Single recorded AGA expert review. No mortality estimate, platelet threshold, anaesthetic superiority claim or universal surgical exclusion is taught. Melissa must review the plan ranking.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f08",
    "auditId": "F08",
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "previousQuestionVariantId": "question.lymphangitis.heel-inguinal.v1.r2",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which diagnosis best explains the linear extension above {patientName}'s heel wound together with the regional nodal tenderness?",
    "previousChoiceLabels": [
      "Acute lymphangitis",
      "Superficial thrombophlebitis",
      "Localized cellulitis"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has calf varicosities and a split heel callus. Tender redness runs from the foot up the medial leg, with tender groin nodes. Beneath the thick heel skin there is a firm tender swelling; palpation does not reveal its contents. The visible calf veins are also tender along part of the affected area.",
    "previousPresentation": "{patientName}, a 38-year-old woman, has longstanding calf varicosities and a recently opened heel blister. Redness and tenderness have extended from the heel in a narrow line up the leg, while the groin nodes on that side have become tender. The heel has a small rim of surrounding redness.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.lymphangitis.heel-inguinal",
        "patientPresentationVariantId": "presentation.lymphangitis.heel-inguinal",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Painful leg redness",
        "revisedPresentation": "{patientName}, a 38-year-old woman, has longstanding calf varicosities and a recently opened heel blister. Redness and tenderness have extended from the heel in a narrow line up the leg, while the groin nodes on that side have become tender. The heel has a small rim of surrounding redness.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 38,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Painful leg redness",
    "previousChiefComplaint": "Painful leg redness",
    "previousProfileChiefComplaints": [],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the wound-to-regional-node pattern from the coexisting venous tenderness. Then: Select imaging of the uncertain distal source to assess for a collection.",
    "reviewerNotes": "The narrow recognition source supplies no treatment rule. The separate existing skin-infection claim supports ultrasound when examination cannot settle collection versus inflammation; no heel-drainage technique is prescribed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "acute_lymphangitis": "acute_lymphangitis",
      "choice.qf2.20261104.f08.d1": "choice.qf20261104.f08.d1",
      "choice.qf2.20261104.f08.d2": "choice.qf20261104.f08.d2"
    },
    "choiceServiceOverrides": {
      "acute_lymphangitis": null,
      "choice.qf2.20261104.f08.d1": null,
      "choice.qf2.20261104.f08.d2": null
    },
    "choiceTimingOverrides": {
      "acute_lymphangitis": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf2.20261104.f08.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf2.20261104.f08.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.lymphangitis.heel-inguinal.v1.r3",
      "conceptId": "concept.lymphangitis.distal-source-imaging.v1",
      "stem": "Which imaging request should be made next in {patientName}'s assessment?",
      "answerChoices": [
        {
          "id": "acute_lymphangitis",
          "label": "Targeted soft-tissue ultrasound at the heel",
          "isCorrect": true,
          "rationale": "The proximal pattern supports a lymphatic infectious process from the distal entry site. The uncertain heel swelling raises the separate question of a collection that could change source treatment.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f08.d1",
          "label": "Compression venous ultrasound along the calf",
          "isCorrect": false,
          "distractorRationale": "The tender varicosities make a venous explanation tempting, but they do not unite the distal skin break and regional nodal pattern as well."
        },
        {
          "id": "choice.qf2.20261104.f08.d2",
          "label": "Targeted soft-tissue ultrasound at the groin",
          "isCorrect": false,
          "distractorRationale": "The nodes are part of the regional response; their tenderness does not identify them as the primary drainable source in this supplied pattern."
        }
      ],
      "explanation": "The distal entry site, proximal streak and regional nodes favor a lymphatic infectious process over attributing the whole pattern to the varicosities. The separate heel swelling still needs assessment for a collection. Targeted soft-tissue ultrasound can clarify its contents when examination cannot distinguish inflammation from an abscess. Tender draining nodes do not identify the groin as the primary source.",
      "teachingPoint": "The distal entry site, proximal streak and regional nodes favor a lymphatic infectious process over attributing the whole pattern to the varicosities. The separate heel swelling still needs assessment for a collection. Targeted soft-tissue ultrasound can clarify its contents when examination cannot distinguish inflammation from an abscess. Tender draining nodes do not identify the groin as the primary source.",
      "supportingEvidenceClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
        "claim.bread-butter.skin-infection.equivocal-ultrasound"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.lymphangitis.acute-clinical-recognition",
      "nextConceptId": "concept.lymphangitis.distal-source-imaging.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Recognition of a syndrome becomes a source-assessment decision using an additional independently recorded soft-tissue-ultrasound claim. Preserve the recognition card."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.lymphangitis.heel-inguinal.v1.r2",
      "whatChanged": "Removed the morphology/nodal recap from the task and all diagnosis-label options. Three ultrasound requests compete on target and protocol; the new decision has a source-assessment consequence.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "0368a25c-1165-474d-b117-e729a0cd8fdd"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the morphology/nodal recap from the task and all diagnosis-label options. Three ultrasound requests compete on target and protocol; the new decision has a source-assessment consequence.",
      "sourceDecision": "The narrow recognition source supplies no treatment rule. The separate existing skin-infection claim supports ultrasound when examination cannot settle collection versus inflammation; no heel-drainage technique is prescribed.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f09",
    "auditId": "F09",
    "caseId": "case.gs028e.mis-principles.c2-different-phases",
    "nodeId": "node.gs028e.mis-principles.c2-different-phases.1",
    "previousQuestionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r2",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which sequence of venous effects best explains the two phases in {patientName}'s record?",
    "previousChoiceLabels": [
      "Abdominal venous emptying, then restriction of caval inflow",
      "Restriction of caval inflow, then abdominal venous emptying",
      "Dependent venous pooling, then increased central venous return"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
    "previousPresentation": "{patientName}, a 36-year-old woman, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.36",
        "presentation": "{patientName}, a 36-year-old woman, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.36",
        "presentation": "{patientName}, a 36-year-old man, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.61",
        "presentation": "{patientName}, a 61-year-old woman, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.61",
        "presentation": "{patientName}, a 61-year-old man, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028e.mis-principles.c2-different-phases",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c2-different-phases",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Operation record review",
        "revisedPresentation": "{patientName}, a 36-year-old woman, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-different-phases.female.36",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.female.36",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 36-year-old woman, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-different-phases.male.36",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.male.36",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 36-year-old man, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-different-phases.female.61",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.female.61",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 61-year-old woman, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-different-phases.male.61",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.male.61",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 61-year-old man, brings the anaesthetic record from a completed laparoscopic operation. Position, fluid administration and ventilation were unchanged during the two recorded phases. After initial insufflation, left-ventricular end-diastolic volume and stroke volume rose. After the insufflation pressure was raised, both fell; they recovered when the pressure was reduced.",
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
        "ageYears": 36,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Operation record review",
    "previousChiefComplaint": "Operation record review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.36",
        "chiefComplaint": "Operation record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.36",
        "chiefComplaint": "Operation record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.61",
        "chiefComplaint": "Operation record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.61",
        "chiefComplaint": "Operation record review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Attribute the reversible filling change to the pressure challenge rather than positioning. Then: Interpret peak/plateau behaviour at fixed tidal volume before selecting the paired explanation.",
    "reviewerNotes": "Existing recorded physiology claims support pressure-dependent return and diaphragm/compliance effects. The peak/plateau application is a qualitative physical interpretation, with no numeric threshold or new operative-management rule; anaesthesia review is required.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f09.d1": "choice.qf20261104.f09.d1",
      "choice.qf2.20261104.f09.d2": "choice.qf20261104.f09.d2",
      "choice.qf2.20261104.f09.d3": "choice.qf20261104.f09.d1"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f09.d1": null,
      "choice.qf2.20261104.f09.d2": null,
      "choice.qf2.20261104.f09.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f09.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f09.d2": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f09.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.pneumoperitoneum.context-dependent-venous-return.v4.r3",
      "conceptId": "concept.laparoscopy.pressure-cardiopulmonary.v1",
      "stem": "Which paired physiological explanation best accounts for {patientName}'s recorded response?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Caval return restriction with reduced respiratory compliance",
          "isCorrect": true,
          "rationale": "The reversible pressure association supports impaired abdominal venous return. A matched rise in peak and plateau pressures at the same tidal volume fits mechanical compliance restriction rather than a new resistive component.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f09.d1",
          "label": "Positional venous pooling with reduced respiratory compliance",
          "isCorrect": false,
          "distractorRationale": "The respiratory component fits, but the table position did not change; this pair assigns the circulation change to the wrong recorded variable."
        },
        {
          "id": "choice.qf2.20261104.f09.d2",
          "label": "Caval return restriction with increased airway resistance",
          "isCorrect": false,
          "distractorRationale": "The circulation component fits, but a new resistive component does not best explain the unchanged peak-to-plateau difference in the supplied record."
        },
        {
          "id": "choice.qf2.20261104.f09.d3",
          "label": "Positional venous pooling with increased airway resistance",
          "isCorrect": false,
          "distractorRationale": "Both mechanisms can affect anaesthetic observations, but neither best matches the controlled pressure/position and peak/plateau pattern given here."
        }
      ],
      "explanation": "The circulatory changes track abdominal pressure while position is constant, supporting restricted venous return through the abdominal veins/cava. At unchanged tidal volume, inspiratory flow and PEEP, a matched rise in peak and plateau pressures fits increased elastic pressure requirements rather than an isolated resistive change. Pneumoperitoneum-related diaphragmatic displacement can reduce respiratory compliance. Circulatory responses still depend on pressure, volume and position.",
      "teachingPoint": "The circulatory changes track abdominal pressure while position is constant, supporting restricted venous return through the abdominal veins/cava. At unchanged tidal volume, inspiratory flow and PEEP, a matched rise in peak and plateau pressures fits increased elastic pressure requirements rather than an isolated resistive change. Pneumoperitoneum-related diaphragmatic displacement can reduce respiratory compliance. Circulatory responses still depend on pressure, volume and position.",
      "exhibit": {
        "kind": "table",
        "caption": "Observations across the pressure change",
        "columnHeaders": [
          "Before the increase",
          "At higher pressure",
          "After pressure reduction"
        ],
        "rowHeaders": [
          "Left-ventricular end-diastolic volume and stroke volume",
          "Peak and plateau airway pressures",
          "Difference between peak and plateau"
        ],
        "cells": [
          [
            "Baseline",
            "Both smaller",
            "Both return toward baseline"
          ],
          [
            "Baseline",
            "Both rise by the same amount",
            "Both return toward baseline"
          ],
          [
            "Baseline",
            "Unchanged",
            "Unchanged"
          ]
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.caval-compression-venous-return",
        "claim.gs028e.laparoscopy.pressure-position-context",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2",
        "claim.qf2.fixed-volume-peak-plateau-pattern"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "nextConceptId": "concept.laparoscopy.pressure-cardiopulmonary.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective now includes a separate respiratory-mechanics interpretation, not the old two-phase venous sequence. Preserve the previous physiology histories."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r2",
      "whatChanged": "Removed reversed-sign sequences. A balanced four-option matrix contains both close circulatory and respiratory near misses; neither a direction-only shortcut nor component frequency identifies the key.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "58f8c9a8-ad40-479e-b06b-e8c0fd5a52ef"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed reversed-sign sequences. A balanced four-option matrix contains both close circulatory and respiratory near misses; neither a direction-only shortcut nor component frequency identifies the key.",
      "sourceDecision": "Existing recorded physiology claims support pressure-dependent return and diaphragm/compliance effects. The peak/plateau application is a qualitative physical interpretation, with no numeric threshold or new operative-management rule; anaesthesia review is required.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f10",
    "auditId": "F10",
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "previousQuestionVariantId": "question.dcis.sentinel-node-setting.v3.r2",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which axillary plan should accompany {patientName}'s mastectomy?",
    "previousChoiceLabels": [
      "Sentinel-node biopsy with breast removal",
      "Sentinel-node biopsy after invasive final pathology",
      "Axillary dissection during the planned resection"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices.",
    "previousPresentation": "{patientName}, a 43-year-old woman, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
        "presentation": "{patientName}, a 43-year-old woman, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes."
      },
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
        "presentation": "{patientName}, a 59-year-old woman, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028c.dcis.b-oncoplastic-mapping",
        "patientPresentationVariantId": "presentation.gs028c.dcis.b-oncoplastic-mapping",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "DCIS surgical planning",
        "revisedPresentation": "{patientName}, a 43-year-old woman, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
            "approvedInstantiationProfileId": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
            "approvedInstantiationProfileId": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 59-year-old woman, has DCIS in separated regions of one breast and is scheduled for a simple mastectomy. Image-guided breast samples contain DCIS without identified invasion. Examination and axillary ultrasound identify no abnormal lymph nodes.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "DCIS surgical planning",
    "previousChiefComplaint": "DCIS surgical planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
        "chiefComplaint": "DCIS surgical planning"
      },
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
        "chiefComplaint": "DCIS surgical planning"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Reconcile the revised breast operation with the still-limited core and nodal observations. Then: Choose the staging sequence that remains appropriate after the switch from conservation to mastectomy.",
    "reviewerNotes": "One recorded ASBrS source. This conventional scenario excludes a planned delayed magnetic-tracer strategy; no universal claim about every mapping technology or oncoplastic operation is made.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf2.20261104.f10.d1": "choice.qf20261104.f10.d1",
      "choice.qf2.20261104.f10.d2": "choice.qf20261104.f10.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf2.20261104.f10.d1": null,
      "choice.qf2.20261104.f10.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f10.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f10.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.dcis.sentinel-node-setting.v3.r3",
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "stem": "Which axillary management strategy is most appropriate for {patientName}'s current operative plan?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Schedule sentinel-node biopsy at the forthcoming operation",
          "isCorrect": true,
          "rationale": "The changed operation matters: sentinel-node assessment is ordinarily performed with standard mastectomy despite a pure-DCIS core result and unremarkable nodal imaging.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f10.d1",
          "label": "Schedule sentinel-node biopsy if final pathology reveals invasion",
          "isCorrect": false,
          "distractorRationale": "Waiting for invasive final pathology is a credible breast-conservation sequence, but later mapping after standard mastectomy may be unreliable."
        },
        {
          "id": "choice.qf2.20261104.f10.d2",
          "label": "Omit sentinel-node biopsy from the overall treatment course",
          "isCorrect": false,
          "distractorRationale": "Omission is ordinarily appropriate for uncomplicated DCIS breast conservation, not the conventional mastectomy setting now booked."
        }
      ],
      "explanation": "Pure DCIS on the core samples and unremarkable nodal imaging do not exclude occult invasion in the final breast specimen. Standard mastectomy can make later lymphatic mapping unreliable, so concurrent sentinel-node biopsy is ordinarily performed. A strategy appropriate for uncomplicated breast conservation should therefore be reconsidered when the breast operation changes to mastectomy.",
      "teachingPoint": "Pure DCIS on the core samples and unremarkable nodal imaging do not exclude occult invasion in the final breast specimen. Standard mastectomy can make later lymphatic mapping unreliable, so concurrent sentinel-node biopsy is ordinarily performed. A strategy appropriate for uncomplicated breast conservation should therefore be reconsidered when the breast operation changes to mastectomy.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-mastectomy",
        "claim.gs028c.dcis.axilla-omit-bcs",
        "claim.gs028c.dcis.axilla-risk-setting"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "nextConceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored clinical meaning remains conventional DCIS mastectomy axillary staging. The changed operative history and better competing timings apply that same rule rather than add an unverified mapping technique."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.dcis.sentinel-node-setting.v3.r2",
      "whatChanged": "Removed accompany/with-removal mirroring and routine dissection padding. Added the real near miss of carrying a breast-conservation staging strategy into a changed operation; all options specify sentinel-node timing or omission.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "e4354aee-08cf-4fce-beff-44c217f5f8b0"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed accompany/with-removal mirroring and routine dissection padding. Added the real near miss of carrying a breast-conservation staging strategy into a changed operation; all options specify sentinel-node timing or omission.",
      "sourceDecision": "One recorded ASBrS source. This conventional scenario excludes a planned delayed magnetic-tracer strategy; no universal claim about every mapping technology or oncoplastic operation is made.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f11",
    "auditId": "F11",
    "caseId": "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
    "nodeId": "node.gs028se.p2e.perioperative-dnr.v4.perianal-abscess.1",
    "previousQuestionVariantId": "question.statistics-ethics.perioperative-dnr.v4.r2",
    "questionVariantId": "question.statistics-ethics.perioperative-dnr.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which instruction is established by {patientName}'s DNR order itself?",
    "previousChoiceLabels": [
      "Withhold cardiopulmonary resuscitation if arrest occurs",
      "Withhold airway instrumentation for the planned anaesthetic",
      "Withhold treatment directed at the new infection"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
    "previousPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
        "presentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
        "presentation": "{patientName}, a 58-year-old woman, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
        "presentation": "{patientName}, a 77-year-old man, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
        "presentation": "{patientName}, a 77-year-old woman, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
        "patientPresentationVariantId": "presentation.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Abscess care planning",
        "revisedPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old woman, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 77-year-old man, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 77-year-old woman, has a superficial perianal abscess and an existing do-not-resuscitate (DNR) order in the chart. The team is preparing the proposed treatment and anaesthetic discussion with the patient.",
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
        "ageYears": 58,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Anaesthetic planning",
    "previousChiefComplaint": "Abscess care planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
        "chiefComplaint": "Abscess care planning"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
        "chiefComplaint": "Abscess care planning"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
        "chiefComplaint": "Abscess care planning"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
        "chiefComplaint": "Abscess care planning"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish independent breathing from complete resolution of the stipulated anaesthetic cardiopulmonary effects. Then: Apply the agreed physiological endpoint rather than an operating-room or hospital-location endpoint.",
    "reviewerNotes": "Uses recorded ASA ethics claims about agreement, documentation and reinstatement. Patient goals are decision-critical here; no jurisdiction-specific legal mandate or fixed recovery time is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "key-4": "key-4",
      "choice.qf2.20261104.f11.d1": "choice.qf20261104.f11.d1",
      "choice.qf2.20261104.f11.d2": "choice.qf20261104.f11.d2"
    },
    "choiceServiceOverrides": {
      "key-4": null,
      "choice.qf2.20261104.f11.d1": null,
      "choice.qf2.20261104.f11.d2": null
    },
    "choiceTimingOverrides": {
      "key-4": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f11.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f11.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.statistics-ethics.perioperative-dnr.v4.r3",
      "conceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
      "stem": "If that scenario occurs, which order should be communicated in {patientName}'s recovery handover?",
      "answerChoices": [
        {
          "id": "key-4",
          "label": "Use the temporary peri-anaesthetic order until cardiovascular support ends",
          "isCorrect": true,
          "rationale": "Independent ventilation does not establish resolution of the other stipulated anaesthetic cardiopulmonary effect. The agreed recovery condition has not yet been met.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f11.d1",
          "label": "Use the original directive at the recovery-unit handover",
          "isCorrect": false,
          "distractorRationale": "Location change is not the agreed endpoint; the remaining anaesthetic-related support makes that reinstatement premature under the stated agreement."
        },
        {
          "id": "choice.qf2.20261104.f11.d2",
          "label": "Use the temporary peri-anaesthetic order through the remainder of the admission",
          "isCorrect": false,
          "distractorRationale": "The agreement is tied to recovery from anaesthetic effects, not hospital discharge. Extending the change through the admission would exceed that defined interval."
        }
      ],
      "explanation": "Awake and breathing without a ventilator does not establish that all the agreed cardiopulmonary recovery conditions have been met. The anaesthetic-related cardiovascular support is still necessary, so the agreed temporary order continues. Its endpoint is resolution of those effects, rather than transfer location or the end of the hospital admission.",
      "teachingPoint": "Awake and breathing without a ventilator does not establish that all the agreed cardiopulmonary recovery conditions have been met. The anaesthetic-related cardiovascular support is still necessary, so the agreed temporary order continues. Its endpoint is resolution of those effects, rather than transfer location or the end of the hospital admission.",
      "exhibit": {
        "kind": "abstract",
        "title": "Proposed recovery scenario",
        "body": "The patient is awake, follows commands and breathes without a ventilator. An infusion remains necessary for hypotension attributed by the anaesthetic team to the anaesthetic course. Transfer out of the operating room is being arranged."
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.perioperative-dnr.1",
        "claim.gs028se.perioperative-dnr.2",
        "claim.gs028se.perioperative-dnr.3",
        "claim.gs028se.perioperative-dnr.4"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.statistics-ethics.perioperative-dnr",
      "nextConceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A definition of what DNR means becomes application of an agreed peri-anaesthetic modification and recovery criterion. The original scope-of-order construct remains available."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.statistics-ethics.perioperative-dnr.v4.r2",
      "whatChanged": "Replaced the definition task with a concrete, conditional recovery decision. All choices are specific order/handover plans, with no generic individualized key. The hypothetical procedure remains in the future, preserving the later abscess task.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "48111297-73f2-4b4d-9309-9a8fc1e7a587"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced the definition task with a concrete, conditional recovery decision. All choices are specific order/handover plans, with no generic individualized key. The hypothetical procedure remains in the future, preserving the later abscess task.",
      "sourceDecision": "Uses recorded ASA ethics claims about agreement, documentation and reinstatement. Patient goals are decision-critical here; no jurisdiction-specific legal mandate or fixed recovery time is invented.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f12",
    "auditId": "F12",
    "caseId": "case.gs028c.acute-cholecystitis.a-persistent-suspicion",
    "nodeId": "node.gs028c.acute-cholecystitis.a-persistent-suspicion.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which next imaging study would best clarify the cause of {patientName}'s continuing gallbladder-region symptoms?",
    "previousChoiceLabels": [
      "Hepatobiliary scintigraphy",
      "Magnetic resonance cholangiopancreatography",
      "Repeat right-upper-quadrant ultrasonography"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after episodic right-upper-quadrant pain. The pain has settled. Temperature, white-cell count and bilirubin are within their laboratory reference intervals; alkaline phosphatase and GGT remain above the upper reference limits. Ultrasound shows gallstones, a wall that is not thickened and no pericholecystic fluid. No intraductal focus is seen in the visualized common duct.",
    "previousPresentation": "{patientName}, a 45-year-old woman, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.45",
        "presentation": "{patientName}, a 45-year-old woman, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.45",
        "presentation": "{patientName}, a 45-year-old man, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.73",
        "presentation": "{patientName}, a 73-year-old woman, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.73",
        "presentation": "{patientName}, a 73-year-old man, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028c.acute-cholecystitis.a-persistent-suspicion",
        "patientPresentationVariantId": "presentation.gs028c.acute-cholecystitis.a-persistent-suspicion",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Right upper abdominal pain",
        "revisedPresentation": "{patientName}, a 45-year-old woman, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.45",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.45",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old woman, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.45",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.45",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old man, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.73",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.73",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old woman, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.73",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.73",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old man, has fever and persistent right-upper-quadrant pain with focal inspiratory tenderness. Ultrasound shows gallstones and sludge; the wall is not thickened, no surrounding fluid is seen, and the common duct is not dilated.",
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
        "ageYears": 45,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Biliary pain review",
    "previousChiefComplaint": "Right upper abdominal pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.45",
        "chiefComplaint": "Right upper abdominal pain"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.45",
        "chiefComplaint": "Right upper abdominal pain"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.female.73",
        "chiefComplaint": "Right upper abdominal pain"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-persistent-suspicion.male.73",
        "chiefComplaint": "Right upper abdominal pain"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the remaining ductal laboratory question from continuing acute gallbladder inflammation. Then: Choose confirmatory noninvasive imaging rather than an unestablished therapeutic duct procedure.",
    "reviewerNotes": "Uses the recorded ASGE-linked intermediate-likelihood claim and WSES comparison. No exact risk cutoff, invented lab value, universal HIDA ranking or claim that MRCP is superior to EUS is made.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f12.d1": "choice.qf20261104.f12.d1",
      "choice.qf2.20261104.f12.d2": "choice.qf20261104.f12.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f12.d1": null,
      "choice.qf2.20261104.f12.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      },
      "choice.qf2.20261104.f12.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.qf2.20261104.f12.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      }
    },
    "question": {
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r3",
      "conceptId": "concept.gallstones.cholestatic-next-study.v1",
      "stem": "Which next investigation should be requested for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Magnetic resonance cholangiopancreatography",
          "isCorrect": true,
          "rationale": "The residual cholestatic abnormalities keep ductal stone disease in the diagnostic assessment despite the settled episode and absence of a visible duct stone. Noninvasive MRCP can address that question.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f12.d1",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": false,
          "distractorRationale": "This would address continuing concern about acute gallbladder inflammation, but the current symptom/inflammatory pattern and residual laboratory question do not make that the best unresolved target."
        },
        {
          "id": "choice.qf2.20261104.f12.d2",
          "label": "Endoscopic retrograde cholangiopancreatography",
          "isCorrect": false,
          "distractorRationale": "Therapeutic ERCP is a real pathway for a confirmed duct stone, but the supplied record has not established a stone or another direct therapeutic indication."
        }
      ],
      "explanation": "The settled episode and gallbladder observations do not establish continuing acute cholecystitis. Persistent cholestatic abnormalities leave a duct-stone question despite no stone being seen on ultrasound. MRCP provides noninvasive assessment before committing to a therapeutic duct-clearance pathway. EUS can also be an appropriate confirmatory study; scintigraphy addresses a different unresolved gallbladder question.",
      "teachingPoint": "The settled episode and gallbladder observations do not establish continuing acute cholecystitis. Persistent cholestatic abnormalities leave a duct-stone question despite no stone being seen on ultrasound. MRCP provides noninvasive assessment before committing to a therapeutic duct-clearance pathway. EUS can also be an appropriate confirmatory study; scintigraphy addresses a different unresolved gallbladder question.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qq20261028.cholecystitis.comparative-imaging",
        "claim.early.choledocholithiasis.intermediate-mrcp",
        "claim.early.choledocholithiasis.confirmed-stone-therapy",
        "claim.gallstones.ercp-common-bile-duct-stone"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "nextConceptId": "concept.gallstones.cholestatic-next-study.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The keyed clinical decision changes from selected HIDA for suspected cholecystitis to MRCP for possible duct stone disease; a new concept version is required."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v4.r2",
      "whatChanged": "Removed repeat ultrasound as a disposable foil. Three real biliary studies compete, and the findings now change which question should be answered; the key deliberately changes with a new concept version.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "e2e20e22-7640-4126-a0b8-93118a6101af"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed repeat ultrasound as a disposable foil. Three real biliary studies compete, and the findings now change which question should be answered; the key deliberately changes with a new concept version.",
      "sourceDecision": "Uses the recorded ASGE-linked intermediate-likelihood claim and WSES comparison. No exact risk cutoff, invented lab value, universal HIDA ranking or claim that MRCP is superior to EUS is made.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f13",
    "auditId": "F13",
    "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
    "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
    "previousQuestionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r2",
    "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which assessment method should be used to classify {patientName}'s preoperative risk of obstructive sleep apnoea?",
    "previousChoiceLabels": [
      "A sleep-apnoea screening questionnaire",
      "A daytime-sleepiness symptom questionnaire",
      "An anatomic upper-airway examination"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
    "previousPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
        "presentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
        "presentation": "{patientName}, a 46-year-old man, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
        "presentation": "{patientName}, a 68-year-old man, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028d.anesthesia.a-validated-not-impression",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Preoperative sleep history",
        "revisedPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028d.anesthesia.a-validated-not-impression.female.46",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028d.anesthesia.a-validated-not-impression.male.46",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028d.anesthesia.a-validated-not-impression.female.68",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028d.anesthesia.a-validated-not-impression.male.68",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, is being assessed before major surgery. The partner describes loud snoring and pauses in breathing during sleep. The patient reports little daytime sleepiness and has never had a diagnostic sleep study.",
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
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative sleep assessment",
    "previousChiefComplaint": "Preoperative sleep history",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
        "chiefComplaint": "Preoperative sleep history"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
        "chiefComplaint": "Preoperative sleep history"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
        "chiefComplaint": "Preoperative sleep history"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
        "chiefComplaint": "Preoperative sleep history"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the two reported questionnaire domains need not agree. Then: Separate increased perioperative probability from a confirmed sleep diagnosis when documenting the assessment.",
    "reviewerNotes": "One previously recorded SASM guideline. No scale items, numeric scores or cutoffs are reproduced. The named-report framing and domain contrast need anaesthesia review; there was no fresh source retrieval.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f13.d1": "choice.qf20261104.f13.d1",
      "choice.qf2.20261104.f13.d2": "choice.qf20261104.f13.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f13.d1": null,
      "choice.qf2.20261104.f13.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f13.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f13.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.preoperative-osa.validated-risk-screening.v4.r3",
      "conceptId": "concept.osa.discordant-screen-documentation.v1",
      "stem": "Which entry should be made in {patientName}'s preoperative assessment?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Suspected OSA; communicate perioperative risk",
          "isCorrect": true,
          "rationale": "The instruments address different domains, so low reported sleepiness does not cancel the risk-screen result. Screening supports a suspected-risk communication, not a confirmed diagnostic label.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f13.d1",
          "label": "Confirmed OSA; communicate an established diagnosis",
          "isCorrect": false,
          "distractorRationale": "This converts a screening result into a diagnosis without a diagnostic study. It is a real documentation error rather than a different screening method."
        },
        {
          "id": "choice.qf2.20261104.f13.d2",
          "label": "OSA unlikely; communicate low sleep-related risk",
          "isCorrect": false,
          "distractorRationale": "This gives the sleepiness result precedence over the concerning breathing history and the reported preoperative risk screen."
        }
      ],
      "explanation": "Epworth assesses daytime sleepiness, whereas STOP-Bang addresses sleep-apnoea probability. The reassuring sleepiness report does not cancel the breathing history and OSA-risk concern. Communicate suspected OSA and its perioperative implications, while keeping that risk assessment distinct from a confirmed diagnosis.",
      "teachingPoint": "Epworth assesses daytime sleepiness, whereas STOP-Bang addresses sleep-apnoea probability. The reassuring sleepiness report does not cancel the breathing history and OSA-risk concern. Communicate suspected OSA and its perioperative implications, while keeping that risk assessment distinct from a confirmed diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.preoperative-osa.validated-risk-screening",
      "nextConceptId": "concept.osa.discordant-screen-documentation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior task chooses a generic assessment method. This task scores interpretation and communication of completed named reports, with no cutoff calculation or diagnosis by questionnaire."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.preoperative-osa.validated-risk-screening.v4.r2",
      "whatChanged": "Removed generic method labels and task-to-key purpose matching. The named reports are inputs to a documentation decision; every option is a comparably specific chart entry. No alone qualifier or new questionnaire cutoff.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "e1e6012e-485e-4225-8346-b02827868703"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed generic method labels and task-to-key purpose matching. The named reports are inputs to a documentation decision; every option is a comparably specific chart entry. No alone qualifier or new questionnaire cutoff.",
      "sourceDecision": "One previously recorded SASM guideline. No scale items, numeric scores or cutoffs are reproduced. The named-report framing and domain contrast need anaesthesia review; there was no fresh source retrieval.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f15",
    "auditId": "F15",
    "caseId": "case.gs028e.mis-principles.c2-early-central-filling",
    "nodeId": "node.gs028e.mis-principles.c2-early-central-filling.1",
    "previousQuestionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r2",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which venous mechanism best accounts for the initial observations in {patientName}'s operation record?",
    "previousChoiceLabels": [
      "Displacement of blood from abdominal veins toward the chest",
      "Restriction of blood flow through the abdominal vena cava",
      "Redistribution of blood from the chest into dependent leg veins"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
    "previousPresentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.44",
        "presentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.44",
        "presentation": "{patientName}, a 44-year-old man, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.70",
        "presentation": "{patientName}, a 70-year-old woman, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.70",
        "presentation": "{patientName}, a 70-year-old man, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028e.mis-principles.c2-early-central-filling",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c2-early-central-filling",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Operation record review",
        "revisedPresentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-early-central-filling.female.44",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.female.44",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-early-central-filling.male.44",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.male.44",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old man, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-early-central-filling.female.70",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.female.70",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old woman, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028e.mis-principles.c2-early-central-filling.male.70",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.male.70",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old man, reviews a completed laparoscopic hernia operation with the clinic team. During initial insufflation, left-ventricular end-diastolic volume and stroke volume rose together. The patient’s position, fluid administration and ventilation had not changed during that observation.",
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
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Operation record review",
    "previousChiefComplaint": "Operation record review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.44",
        "chiefComplaint": "Operation record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.44",
        "chiefComplaint": "Operation record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.70",
        "chiefComplaint": "Operation record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.70",
        "chiefComplaint": "Operation record review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Use the position reversal at fixed pressure to attribute the later filling change. Then: Interpret the independent CO2/pH/bicarbonate pattern before choosing the paired explanation.",
    "reviewerNotes": "Existing recorded pressure/position and CO2-load claims support qualitative interpretation. No numeric gas, pressure, duration or treatment threshold is invented, and no sole-cause or universal haemodynamic rule is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qf2.20261104.f15.d1": "choice.qf20261104.f15.d1",
      "choice.qf2.20261104.f15.d2": "choice.qf20261104.f15.d2",
      "choice.qf2.20261104.f15.d3": "choice.qf20261104.f15.d1"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qf2.20261104.f15.d1": null,
      "choice.qf2.20261104.f15.d2": null,
      "choice.qf2.20261104.f15.d3": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f15.d1": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f15.d2": {
        "kind": "no_test"
      },
      "choice.qf2.20261104.f15.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.pneumoperitoneum.context-dependent-venous-return.v2.r3",
      "conceptId": "concept.laparoscopy.position-gas-integration.v1",
      "stem": "Which paired interpretation best fits {patientName}'s later observations?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Positional venous pooling and CO2-related respiratory acidemia",
          "isCorrect": true,
          "rationale": "The reversible position-linked volume changes support head-up reduction in venous return; the persistent CO2/pH/bicarbonate pattern supports a separate respiratory CO2-load effect.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f15.d1",
          "label": "Pressure-related caval compression and CO2-related respiratory acidemia",
          "isCorrect": false,
          "distractorRationale": "The gas interpretation fits, but assigning the reversible later volume change to a pressure increase contradicts the recorded constant pressure and position reversal."
        },
        {
          "id": "choice.qf2.20261104.f15.d2",
          "label": "Positional venous pooling and fixed-acid metabolic acidemia",
          "isCorrect": false,
          "distractorRationale": "The volume interpretation fits; the blood-gas pattern does not support new fixed acid as the primary explanation when CO2 rises and bicarbonate is unchanged."
        },
        {
          "id": "choice.qf2.20261104.f15.d3",
          "label": "Pressure-related caval compression and fixed-acid metabolic acidemia",
          "isCorrect": false,
          "distractorRationale": "Both are real physiological categories, but neither best matches the independently recorded position response and gas pattern."
        }
      ],
      "explanation": "Head-up positioning can reduce venous return despite the earlier central-volume rise after insufflation. Recovery on flattening at constant abdominal pressure supports a positional contribution. The independent higher-CO2/lower-pH pattern with unchanged bicarbonate fits respiratory acidemia rather than a new primary fixed-acid process. Absorbed insufflation CO2 can contribute to that load, which need not reverse with the table position.",
      "teachingPoint": "Head-up positioning can reduce venous return despite the earlier central-volume rise after insufflation. Recovery on flattening at constant abdominal pressure supports a positional contribution. The independent higher-CO2/lower-pH pattern with unchanged bicarbonate fits respiratory acidemia rather than a new primary fixed-acid process. Absorbed insufflation CO2 can contribute to that load, which need not reverse with the table position.",
      "exhibit": {
        "kind": "table",
        "caption": "Later position and blood-gas observations",
        "columnHeaders": [
          "After head-up tilt",
          "After returning flat"
        ],
        "rowHeaders": [
          "Left-ventricular end-diastolic volume and stroke volume",
          "Arterial CO2 compared with the earlier sample",
          "Arterial pH compared with the earlier sample",
          "Bicarbonate compared with the earlier sample"
        ],
        "cells": [
          [
            "Both fall",
            "Both recover toward the pre-tilt values"
          ],
          [
            "Higher",
            "Remains higher"
          ],
          [
            "Lower",
            "Remains lower"
          ],
          [
            "Unchanged",
            "Unchanged"
          ]
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.pressure-position-context",
        "claim.gs028e.laparoscopy.caval-compression-venous-return",
        "claim.gs028e.laparoscopy.peritoneal-co2-uptake",
        "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia",
        "claim.qf2.qualitative-co2-acid-base-pattern"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
      "nextConceptId": "concept.laparoscopy.position-gas-integration.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The narrow early-filling direction question becomes integration of position-dependent return and a separate gas interpretation. This new construct is distinct from the pressure/compliance item and retains the old foundational version."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r2",
      "whatChanged": "Removed two same-sign wrong alternatives and the duplicated early-direction task. A balanced four-option matrix requires both observations; all pair components recur equally, limiting convergence.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "08932b5d-1368-4f60-8928-58561c8ddaa4"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed two same-sign wrong alternatives and the duplicated early-direction task. A balanced four-option matrix requires both observations; all pair components recur equally, limiting convergence.",
      "sourceDecision": "Existing recorded pressure/position and CO2-load claims support qualitative interpretation. No numeric gas, pressure, duration or treatment threshold is invented, and no sole-cause or universal haemodynamic rule is claimed.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f16",
    "auditId": "F16",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r2",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which part of {patientName}'s operative assessment is provided by this ultrasound report?",
    "previousChoiceLabels": [
      "Anatomical staging for operative planning",
      "Histological grading for operative planning",
      "Functional imaging for radioiodine planning"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
    "previousPresentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
        "presentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
        "presentation": "{patientName}, a 43-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
        "presentation": "{patientName}, a 68-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
        "presentation": "{patientName}, a 68-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
        "patientPresentationVariantId": "presentation.gs028b.differentiated-thyroid-cancer.a-completed-negative",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Thyroid surgery planning",
        "revisedPresentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist’s preoperative neck-ultrasound report: central and lateral lymph-node compartments were surveyed, no abnormal nodes were identified, and no gross extension beyond the thyroid was seen.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Thyroid surgical planning",
    "previousChiefComplaint": "Thyroid surgery planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
        "chiefComplaint": "Thyroid surgery planning"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
        "chiefComplaint": "Thyroid surgery planning"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
        "chiefComplaint": "Thyroid surgery planning"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
        "chiefComplaint": "Thyroid surgery planning"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the fluid-only sample does not settle the described nodal finding. Then: Select the ancillary assessment relevant to a known differentiated thyroid primary before finalizing surgery.",
    "reviewerNotes": "The existing directly recorded ATA-linked claim already includes a 12-mm fictional observation above its verified criterion; no new cutoff is introduced. Thyroglobulin washout has intact-thyroid limitations and needs endocrine-surgery review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f16.d1": "choice.qf20261104.f16.d1",
      "choice.qf2.20261104.f16.d2": "choice.qf20261104.f16.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f16.d1": null,
      "choice.qf2.20261104.f16.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f16.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f16.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "question": {
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
      "conceptId": "concept.dtc.cystic-node-repeat-sampling.v1",
      "stem": "Which repeat sampling request should be made before {patientName}'s operative plan is finalized?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Node aspiration for cytology and thyroglobulin measurement",
          "isCorrect": true,
          "rationale": "The cyst-fluid sample does not resolve the imaging concern. Targeted cytology with selected thyroglobulin washout can assess the node in this known-primary setting.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f16.d1",
          "label": "Node aspiration for cytology and flow-cytometric assessment",
          "isCorrect": false,
          "distractorRationale": "This is a real lymph-node ancillary strategy, but does not best address possible metastatic differentiated thyroid tissue in the specified node."
        },
        {
          "id": "choice.qf2.20261104.f16.d2",
          "label": "Node aspiration for cytology and microbiological culture",
          "isCorrect": false,
          "distractorRationale": "This is a real nodal-fluid investigation, but does not best resolve the structural findings in the context of the documented thyroid primary."
        }
      ],
      "explanation": "Macrophages and proteinaceous fluid do not settle the suspicious nodal finding in this papillary-primary setting. Repeat targeted cytology with selected thyroglobulin washout can help assess the node before final operative planning. Interpret washout with the intact thyroid in mind. Ultrasound findings alone do not establish nodal metastasis or mandate a neck dissection.",
      "teachingPoint": "Macrophages and proteinaceous fluid do not settle the suspicious nodal finding in this papillary-primary setting. Repeat targeted cytology with selected thyroglobulin washout can help assess the node before final operative planning. Interpret washout with the intact thyroid in mind. Ultrasound findings alone do not establish nodal metastasis or mandate a neck dissection.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.dtc.extent",
        "claim.qq20261102c.thyroid-cystic-node-discordance"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "nextConceptId": "concept.dtc.cystic-node-repeat-sampling.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior question classifies the general contribution of ultrasound. The replacement scores specimen/imaging discordance and a specific node-assessment consequence, requiring a new concept version."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r2",
      "whatChanged": "Retained explicit clinician/radiologist roles and neck anatomy. The actual report now changes the next plan; all options are repeat node-aspiration requests with equally specific ancillary studies, rather than modality categories or a lone untested option.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "2029401b-c009-4286-8ce9-bb9b14ebd2c9",
        "93ea4af9-06cb-4faa-928b-3859d047f6c4"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Retained explicit clinician/radiologist roles and neck anatomy. The actual report now changes the next plan; all options are repeat node-aspiration requests with equally specific ancillary studies, rather than modality categories or a lone untested option.",
      "sourceDecision": "The existing directly recorded ATA-linked claim already includes a 12-mm fictional observation above its verified criterion; no new cutoff is introduced. Thyroglobulin washout has intact-thyroid limitations and needs endocrine-surgery review.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf2.20261104.f17",
    "auditId": "F17",
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "previousQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v11"
    ],
    "previousStem": "Which next diagnostic plan should be arranged for {patientName}'s persistent palpable finding?",
    "previousChoiceLabels": [
      "Arrange tissue sampling of the palpable area",
      "Arrange contrast-enhanced MRI of the palpable area",
      "Arrange repeat ultrasound of the palpable area"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate.",
    "previousPresentation": "{patientName}, a 50-year-old woman, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
        "presentation": "{patientName}, a 50-year-old woman, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review."
      },
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
        "presentation": "{patientName}, a 64-year-old woman, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf20261104.case.gs028c.palpable-breast.b-surgeon-discordance",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-surgeon-discordance",
        "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
        "revisedChiefComplaint": "Persistent breast lump",
        "revisedPresentation": "{patientName}, a 50-year-old woman, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf20261104.profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 50-year-old woman, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf20261104.profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
            "contentVersion": "presentation-revision.question-flags.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, has a persistent firm irregular breast mass on clinical examination. Diagnostic mammography shows no corresponding density, distortion or calcification at the marked site. Targeted ultrasound at that site shows no solid or cystic correlate. The same firm mass is still palpable at review.",
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
        "ageYears": 50,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qf2.20261104.",
      "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Breast lump review",
    "previousChiefComplaint": "Persistent breast lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
        "chiefComplaint": "Persistent breast lump"
      },
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
        "chiefComplaint": "Persistent breast lump"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Match the biopsy site and benign diagnosis to the correct lesion. Then: Resolve the separate concerning clinical/imaging mismatch without requiring an imaging target first.",
    "reviewerNotes": "Existing claims support benign concordant fibroadenoma observation, target discordance and tissue assessment of a concerning palpable finding. They do not universally rank palpation-guided core versus surgical sampling or exclude MRI in every breast presentation.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf2.20261104.f17.d1": "choice.qf20261104.f17.d1",
      "choice.qf2.20261104.f17.d2": "choice.qf20261104.f17.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf2.20261104.f17.d1": null,
      "choice.qf2.20261104.f17.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf2.20261104.f17.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      },
      "choice.qf2.20261104.f17.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3",
      "conceptId": "concept.palpable-mass.separate-benign-target.v1",
      "stem": "Which next diagnostic plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Arrange examination-guided tissue sampling",
          "isCorrect": true,
          "rationale": "The benign sampled target is not the concerning examination finding. Representative tissue assessment is still needed even without an imaging correlate.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf2.20261104.f17.d1",
          "label": "Arrange contrast-enhanced breast MRI",
          "isCorrect": false,
          "distractorRationale": "Further imaging is tempting when the prior core is benign and no current imaging target is seen, but it does not replace tissue assessment of the separate concerning clinical finding in this profile."
        },
        {
          "id": "choice.qf2.20261104.f17.d2",
          "label": "Arrange interval breast examination and imaging",
          "isCorrect": false,
          "distractorRationale": "Concordant benign histology supports follow-up of the sampled lesion, not clearance of a separate concerning examination finding."
        }
      ],
      "explanation": "The benign 2-o'clock sample does not explain the 4-o'clock examination finding. A concerning palpable lesion still requires tissue assessment despite no mammographic or sonographic correlate. The breast specialist should select a representative sampling approach; an absent imaging target does not make benign tissue from a different site representative.",
      "teachingPoint": "The benign 2-o'clock sample does not explain the 4-o'clock examination finding. A concerning palpable lesion still requires tissue assessment despite no mammographic or sonographic correlate. The breast specialist should select a representative sampling approach; an absent imaging target does not make benign tissue from a different site representative.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.bread-butter.fibroadenoma.concordant-observation",
        "claim.qq20261102c.breast-core-target-discordance"
      ],
      "contentVersion": "question-authoring.2026-11-04.v12",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "nextConceptId": "concept.palpable-mass.separate-benign-target.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The replacement adds lesion-identity/histology concordance rather than simply repeating the old imaging-negative biopsy rule. Preserve the earlier scored objective and history."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r2",
      "whatChanged": "Removed repeated persistence language and repeat-ultrasound padding. Added a genuine false-reassurance near miss from a benign but different lesion; three diagnostic strategies remain at the same stage.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "34e373b5-3d0a-45d5-af18-4bd472fee3d1"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed repeated persistence language and repeat-ultrasound padding. Added a genuine false-reassurance near miss from a benign but different lesion; three diagnostic strategies remain at the same stage.",
      "sourceDecision": "Existing claims support benign concordant fibroadenoma observation, target discordance and tissue assessment of a concerning palpable finding. They do not universally rank palpation-guided core versus surgical sampling or exclude MRI in every breast presentation.",
      "status": "awaiting_independent_and_clinician_review"
    }
  }
];

export const QUESTION_FLAG_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.dcis.final-cavity-shave-plan.v1",
    "displayName": "Apply final DCIS cavity-margin findings",
    "learningObjective": "Reconcile oriented main and additional cavity specimens, then apply the pure-DCIS margin rule to the final treatment decision.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.dcis.margin-bcs-wbrt",
    "versioningReason": "The prior question requests more record review for a close edge. This decision uses completed, reconciled final margins to choose treatment; preserve the earlier scored construct and histories.",
    "revisedItemIds": [
      "F01"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.dcis.margin-two-mm",
      "claim.gs028c.dcis.margin-no-routine-wider",
      "claim.gs028c.dcis.margin-narrow-individualize"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
    "displayName": "Plan imaging after a changed postlaparoscopy course",
    "learningObjective": "Interpret the postoperative course, then distinguish biliary leak detection from duct-anatomy localization in a stable CT-assessed record.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
    "versioningReason": "A nerve-association question becomes a clinical imaging decision after postoperative reassessment. The new workup objective must not inherit the anatomy card history.",
    "revisedItemIds": [
      "F02"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain",
      "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary",
      "claim.early.bile-leak.ce-mrcp-anatomic-localization"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.varicose-veins.reflux-after-compression-study.v1",
    "displayName": "Distinguish reflux assessment from DVT imaging",
    "learningObjective": "Interpret a completed compression-only venous study, then select the diagnostic protocol needed for symptomatic superficial venous treatment assessment.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.varicose-veins.axial-trunk-referral-target.v1",
    "versioningReason": "This is diagnostic-protocol selection rather than matching a named axial vein to an intervention; preserve both earlier candidacy and target-selection constructs.",
    "revisedItemIds": [
      "F03"
    ],
    "evidenceClaimIds": [
      "claim.varicose.reflux-duplex",
      "claim.varicose.intervention-referral",
      "claim.varicose.conservative-boundary"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.hyperkalaemia.post-calcium-treatment.v1",
    "displayName": "Interpret treatment response in hyperkalaemia",
    "learningObjective": "Distinguish ECG stabilization from potassium correction and select the remaining treatment mechanism in a completed inpatient record.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
    "versioningReason": "The original objective is community disposition; the replacement scores treatment-response interpretation after hospital admission. Keep their histories separate.",
    "revisedItemIds": [
      "F04"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer",
      "claim.gs028d.hyperkalaemia.mechanisms"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.head-neck.cyst-fluid-sample-assessment.v1",
    "displayName": "Act on an unrepresentative adult neck aspirate",
    "learningObjective": "Interpret a cyst-fluid specimen in a persistent adult neck lesion and request representative needle reassessment rather than presume benignity or jump to open surgery.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
    "versioningReason": "The prior card asks for the initial FNA route. The replacement scores adequacy and the next diagnostic strategy, so it receives a new construct version.",
    "revisedItemIds": [
      "F05"
    ],
    "evidenceClaimIds": [
      "claim.gs028f.neck.adult-lateral-malignancy-evaluation",
      "claim.gs028f.neck.needle-before-open",
      "claim.gs028f.neck.core-biopsy-alternative",
      "claim.gs028f.neck.imaging-versus-tissue-diagnosis"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.cirrhosis.new-fluid-elective-plan.v1",
    "displayName": "Apply new decompensation findings to elective planning",
    "learningObjective": "Interpret new fluid findings despite reassuring biochemical results and select optimization before a nonurgent operation.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
    "versioningReason": "The prior item names an underestimated risk domain. This version scores an operative-timing consequence of a new clinical event; keep the risk-domain history separate.",
    "revisedItemIds": [
      "F07"
    ],
    "evidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.lymphangitis.distal-source-imaging.v1",
    "displayName": "Select source imaging in a lymphangitic presentation",
    "learningObjective": "Localize a distal source from the proximal lymphatic pattern, then choose imaging of an uncertain source swelling rather than the tender veins or draining nodes.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.lymphangitis.acute-clinical-recognition",
    "versioningReason": "Recognition of a syndrome becomes a source-assessment decision using an additional independently recorded soft-tissue-ultrasound claim. Preserve the recognition card.",
    "revisedItemIds": [
      "F08"
    ],
    "evidenceClaimIds": [
      "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "claim.bread-butter.skin-infection.equivocal-ultrasound"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.laparoscopy.pressure-cardiopulmonary.v1",
    "displayName": "Interpret a paired pressure challenge",
    "learningObjective": "Integrate controlled circulatory observations with ventilator-pressure observations to distinguish venous-return and respiratory-mechanics explanations.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
    "versioningReason": "The scored objective now includes a separate respiratory-mechanics interpretation, not the old two-phase venous sequence. Preserve the previous physiology histories.",
    "revisedItemIds": [
      "F09"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.laparoscopy.caval-compression-venous-return",
      "claim.gs028e.laparoscopy.pressure-position-context",
      "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance",
      "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2",
      "claim.qf2.fixed-volume-peak-plateau-pattern"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.perioperative-dnr.recovery-endpoint.v1",
    "displayName": "Apply an agreed perioperative directive endpoint",
    "learningObjective": "Interpret a stipulated recovery state and apply the agreed endpoint for reinstating a baseline directive.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.statistics-ethics.perioperative-dnr",
    "versioningReason": "A definition of what DNR means becomes application of an agreed peri-anaesthetic modification and recovery criterion. The original scope-of-order construct remains available.",
    "revisedItemIds": [
      "F11"
    ],
    "evidenceClaimIds": [
      "claim.gs028se.perioperative-dnr.1",
      "claim.gs028se.perioperative-dnr.2",
      "claim.gs028se.perioperative-dnr.3",
      "claim.gs028se.perioperative-dnr.4"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.gallstones.cholestatic-next-study.v1",
    "displayName": "Select further imaging from the unresolved biliary question",
    "learningObjective": "Distinguish a ductal diagnostic question from ongoing gallbladder inflammation and choose noninvasive duct assessment before a therapeutic pathway.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
    "versioningReason": "The keyed clinical decision changes from selected HIDA for suspected cholecystitis to MRCP for possible duct stone disease; a new concept version is required.",
    "revisedItemIds": [
      "F12"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.cholecystitis.hida-after-equivocal-us",
      "claim.qq20261028.cholecystitis.comparative-imaging",
      "claim.early.choledocholithiasis.intermediate-mrcp",
      "claim.early.choledocholithiasis.confirmed-stone-therapy",
      "claim.gallstones.ercp-common-bile-duct-stone"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.osa.discordant-screen-documentation.v1",
    "displayName": "Interpret discordant sleep-screen information",
    "learningObjective": "Reconcile sleepiness and OSA-probability reports, then document and communicate risk without making a screening diagnosis.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.preoperative-osa.validated-risk-screening",
    "versioningReason": "The prior task chooses a generic assessment method. This task scores interpretation and communication of completed named reports, with no cutoff calculation or diagnosis by questionnaire.",
    "revisedItemIds": [
      "F13"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.osa.validated-screen",
      "claim.qf2.sleep-questionnaire-domain-interpretation"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.laparoscopy.position-gas-integration.v1",
    "displayName": "Integrate venous and acid-base observations",
    "learningObjective": "Use a reversible position change and a persistent arterial-gas pattern to distinguish two simultaneous laparoscopy physiology mechanisms.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.pneumoperitoneum.context-dependent-venous-return",
    "versioningReason": "The narrow early-filling direction question becomes integration of position-dependent return and a separate gas interpretation. This new construct is distinct from the pressure/compliance item and retains the old foundational version.",
    "revisedItemIds": [
      "F15"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.laparoscopy.pressure-position-context",
      "claim.gs028e.laparoscopy.caval-compression-venous-return",
      "claim.gs028e.laparoscopy.peritoneal-co2-uptake",
      "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia",
      "claim.qf2.qualitative-co2-acid-base-pattern"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.dtc.cystic-node-repeat-sampling.v1",
    "displayName": "Resolve a cystic node before thyroid surgery",
    "learningObjective": "Reconcile suspicious nodal morphology with cyst-fluid cytology and select an appropriate ancillary sampling request before planning surgery.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
    "versioningReason": "The prior question classifies the general contribution of ultrasound. The replacement scores specimen/imaging discordance and a specific node-assessment consequence, requiring a new concept version.",
    "revisedItemIds": [
      "F16"
    ],
    "evidenceClaimIds": [
      "claim.dtc.preop-ultrasound",
      "claim.dtc.extent",
      "claim.qq20261102c.thyroid-cystic-node-discordance"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.palpable-mass.separate-benign-target.v1",
    "displayName": "Reconcile a benign biopsy with a different palpable lesion",
    "learningObjective": "Match the sampled lesion to the clinical target before choosing further assessment for a concerning imaging-occult finding.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
    "versioningReason": "The replacement adds lesion-identity/histology concordance rather than simply repeating the old imaging-negative biopsy rule. Preserve the earlier scored objective and history.",
    "revisedItemIds": [
      "F17"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.palpable.biopsy",
      "claim.bread-butter.fibroadenoma.concordant-observation",
      "claim.qq20261102c.breast-core-target-discordance"
    ],
    "contentVersion": "concept.question-flags-round2.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  }
];
