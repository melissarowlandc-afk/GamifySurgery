import type { QuestionFlagRevision, QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Round-three additive drafts. Prior versions retain their exact identities and approvals. */
export const QUESTION_FLAG_ROUND3_DEFINITIONS: QuestionFlagRevision[] = [
  {
    "id": "revision.qf3.20261104.f02",
    "auditId": "F02",
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "previousQuestionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which additional imaging request would best establish the duct anatomy for {patientName}'s treatment planning at that stage?",
    "previousChoiceLabels": [
      "MR cholangiography with a hepatobiliary contrast agent",
      "Hepatobiliary scintigraphy with dynamic delayed imaging",
      "MR cholangiography without a hepatobiliary contrast agent"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
    "previousPresentation": "{patientName}, a 42-year-old woman, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "presentation": "{patientName}, a 42-year-old woman, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "presentation": "{patientName}, a 42-year-old man, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "presentation": "{patientName}, a 68-year-old woman, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "presentation": "{patientName}, a 68-year-old man, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028e.mis-principles.c3-phrenic-pathway",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c3-phrenic-pathway",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Postoperative record review",
        "revisedPresentation": "{patientName}, a 42-year-old woman, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old woman, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old man, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, attends follow-up after an outside admission following laparoscopic cholecystectomy. The record starts with shoulder-tip aching, then documents increasing right-upper-quadrant tenderness and fever. CT shows a subhepatic collection. A drain returns green-yellow fluid. The patient was haemodynamically stable while the hepatobiliary team planned further imaging.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative drainage review",
    "previousChiefComplaint": "Postoperative record review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "chiefComplaint": "Postoperative record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "chiefComplaint": "Postoperative record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "chiefComplaint": "Postoperative record review"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "chiefComplaint": "Postoperative record review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Determine whether the major ducts remain continuous and whether the collection is controlled. Then: Choose leak-directed treatment rather than more collection drainage or major-duct reconstruction.",
    "reviewerNotes": "Both existing WSES-linked claims apply to this stable, drained, minor-leak setting. No universal endoscopic treatment of complete transection, stent duration or technical dose is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qf3.20261104.f02.d1": "choice.qf2.20261104.f02.d1",
      "choice.qf3.20261104.f02.d2": "choice.qf2.20261104.f02.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qf3.20261104.f02.d1": null,
      "choice.qf3.20261104.f02.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      },
      "choice.qf3.20261104.f02.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qf3.20261104.f02.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "stem": "Which procedure should be requested next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Endoscopic transpapillary plastic-stent placement",
          "isCorrect": true,
          "rationale": "Persistent drainage with demonstrated major-duct continuity and a controlled cavity fits the minor-leak pathway. Transpapillary stenting addresses the ongoing leak rather than repeating collection drainage.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f02.d1",
          "label": "Percutaneous exchange for a larger drainage catheter",
          "isCorrect": false,
          "distractorRationale": "Catheter escalation is appropriate for an inadequately drained collection. Here the postdrainage CT shows a collapsed cavity; the continuing problem is leakage into it."
        },
        {
          "id": "choice.qf3.20261104.f02.d2",
          "label": "Operative reconstruction with a hepaticojejunostomy",
          "isCorrect": false,
          "distractorRationale": "Reconstruction is a credible consideration after a major duct injury, but the demonstrated continuity and localized stump leak do not establish that indication."
        }
      ],
      "explanation": "The images show preserved major-duct continuity and a localized stump leak into an already drained cavity. Persistent minor leakage in this setting supports ERCP with transpapillary plastic-stent treatment. A larger drain would address residual collection, while reconstruction would address a different injury pattern. Sepsis, peritonitis or an uncontrolled collection would change the sequence.",
      "teachingPoint": "The images show preserved major-duct continuity and a localized stump leak into an already drained cavity. Persistent minor leakage in this setting supports ERCP with transpapillary plastic-stent treatment. A larger drain would address residual collection, while reconstruction would address a different injury pattern. Sepsis, peritonitis or an uncontrolled collection would change the sequence.",
      "supportingEvidenceClaimIds": [
        "claim.early.bile-leak.ce-mrcp-anatomic-localization",
        "claim.early.bile-leak.minor-leak-ercp-stent"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
      "nextConceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision changes from selecting localization imaging to treating a demonstrated minor leak. Retain the imaging construct and all earlier anatomy versions."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
      "whatChanged": "Removed the irrelevant shoulder-pain preamble and anatomy-purpose lead-in. Replaced overlapping with/without-contrast studies with three procedures whose ranking depends on the actual duct and drainage findings.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "a0a20925-6852-4fdf-bee4-997d10a89305"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the irrelevant shoulder-pain preamble and anatomy-purpose lead-in. Replaced overlapping with/without-contrast studies with three procedures whose ranking depends on the actual duct and drainage findings.",
      "sourceDecision": "Both existing WSES-linked claims apply to this stable, drained, minor-leak setting. No universal endoscopic treatment of complete transection, stent duration or technical dose is authored.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f03",
    "auditId": "F03",
    "caseId": "case.gs028.varicose-veins.b-limited-mobility",
    "nodeId": "node.gs028.varicose-veins.b-limited-mobility.1",
    "previousQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
    "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which investigation should {patientName}'s vascular referral request before a treatment is selected?",
    "previousChoiceLabels": [
      "Request a venous reflux duplex study",
      "Request a deep-venous compression duplex study",
      "Request a pelvic contrast CT venogram"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns with recurrent aching calf varicosities after previous great-saphenous treatment. The original procedure report ends below the knee. At the new visit, the most prominent veins are behind the calf, with another cluster along the medial ankle. A new duplex sheet records retrograde flow in a posterior-calf superficial trunk and in the medial tributaries, but does not trace their connections to the remaining saphenous segments or assess deep-vein reflux.",
    "previousPresentation": "{patientName}, a 43-year-old woman, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.43",
        "presentation": "{patientName}, a 43-year-old woman, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.43",
        "presentation": "{patientName}, a 43-year-old man, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins."
      },
      {
        "id": "profile.gs028.varicose-veins.b-limited-mobility.male.68",
        "presentation": "{patientName}, a 68-year-old man, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028.varicose-veins.b-limited-mobility",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-limited-mobility",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Aching varicose veins",
        "revisedPresentation": "{patientName}, a 43-year-old woman, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028.varicose-veins.b-limited-mobility.female.43",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.female.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028.varicose-veins.b-limited-mobility.male.43",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.male.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028.varicose-veins.b-limited-mobility.female.68",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.female.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028.varicose-veins.b-limited-mobility.male.68",
            "approvedInstantiationProfileId": "profile.gs028.varicose-veins.b-limited-mobility.male.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, has aching visible calf veins and ankle swelling after standing. An outside ultrasound report describes supine probe-compression views: the femoral and popliteal veins compress fully, with no intraluminal material seen. The patient asks about treatment of the symptomatic veins.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
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
    "intendedInference": "Recognize that recurrence spans territories not explained by the old treatment record or a single visible cluster. Then: Request a connected superficial/deep reflux map before choosing an intervention target.",
    "reviewerNotes": "Qualitative application of the recorded venous guideline. The new mapping-scope claim has an explicit offline source-alignment limitation; no acquisition-position rule, reflux-duration threshold or mandatory procedure is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf3.20261104.f03.d1": "choice.qf2.20261104.f03.d1",
      "choice.qf3.20261104.f03.d2": "choice.qf2.20261104.f03.d2",
      "choice.qf3.20261104.f03.d3": "choice.qf2.20261104.f03.d1"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf3.20261104.f03.d1": null,
      "choice.qf3.20261104.f03.d2": null,
      "choice.qf3.20261104.f03.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf3.20261104.f03.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf3.20261104.f03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qf3.20261104.f03.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r4",
      "conceptId": "concept.varicose-veins.reflux-after-compression-study.v2",
      "stem": "Which duplex request should accompany {patientName}'s vascular referral before another intervention is selected?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Reflux mapping of the superficial and deep leg veins",
          "isCorrect": true,
          "rationale": "The recurrent posterior and medial distributions plus an incomplete connection map do not identify a single treatment target. A complete reflux map can distinguish residual axial, tributary and deep-system contributions.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f03.d1",
          "label": "Obstruction mapping of the superficial and deep leg veins",
          "isCorrect": false,
          "distractorRationale": "A broad venous examination is tempting, but a thrombus/outflow protocol does not supply the reflux connections needed to select treatment for these recurrent superficial symptoms."
        },
        {
          "id": "choice.qf3.20261104.f03.d2",
          "label": "Reflux mapping of the visible calf tributaries",
          "isCorrect": false,
          "distractorRationale": "The largest cluster is a tempting target, but surface prominence does not establish its feeding trunk or explain the additional medial distribution."
        },
        {
          "id": "choice.qf3.20261104.f03.d3",
          "label": "Obstruction mapping of the visible calf tributaries",
          "isCorrect": false,
          "distractorRationale": "Local venous obstruction can cause tender visible veins, but restricting both the purpose and territory this way does not resolve the recurrent connected-reflux question."
        }
      ],
      "explanation": "The existing sheet shows reflux but does not establish its source and connections. Recurrent varicosities after a partial prior treatment need a reflux assessment that addresses both distributions, remaining superficial connections and the deep system before another target is chosen. Restricting the request to either the previous procedure or the largest visible cluster risks treating an incomplete map.",
      "teachingPoint": "The existing sheet shows reflux but does not establish its source and connections. Recurrent varicosities after a partial prior treatment need a reflux assessment that addresses both distributions, remaining superficial connections and the deep system before another target is chosen. Restricting the request to either the previous procedure or the largest visible cluster risks treating an incomplete map.",
      "supportingEvidenceClaimIds": [
        "claim.varicose.reflux-duplex",
        "claim.varicose.intervention-referral",
        "claim.qf3.recurrent-vein-map-scope"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.varicose-veins.reflux-after-compression-study.v1",
      "nextConceptId": "concept.varicose-veins.reflux-after-compression-study.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored distinction is completeness of a recurrent reflux map rather than reflux versus a completed DVT compression protocol."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v4.r3",
      "whatChanged": "Removed the completed compression study and unsupported pelvic-CT foil. All four choices now request duplex mapping in a balanced purpose-by-scope set; the key is neither the only broad study nor the only reflux study.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "bb8d30e3-0621-4faa-bc5b-5842aa2b1546"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the completed compression study and unsupported pelvic-CT foil. All four choices now request duplex mapping in a balanced purpose-by-scope set; the key is neither the only broad study nor the only reflux study.",
      "sourceDecision": "Qualitative application of the recorded venous guideline. The new mapping-scope claim has an explicit offline source-alignment limitation; no acquisition-position rule, reflux-duration threshold or mandatory procedure is invented.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f04",
    "auditId": "F04",
    "caseId": "case.gs028d.hyperkalaemia.a-renal-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-renal-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r3",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which next plan is most appropriate at that point in {patientName}'s hospital care?",
    "previousChoiceLabels": [
      "Administer insulin with glucose",
      "Administer another intravenous calcium dose",
      "Continue telemetry-guided observation"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with advanced kidney disease, brings records from a recent hospital admission. Potassium was confirmed at 6.7 mmol/L with widened QRS complexes. After intravenous calcium the QRS complexes narrowed, while potassium remained 6.7 mmol/L. Arterial pH was within the laboratory reference interval. Potassium-removal treatment was being arranged.",
    "previousPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
        "presentation": "{patientName}, a 52-year-old woman with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
        "presentation": "{patientName}, a 52-year-old man with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
        "presentation": "{patientName}, a 70-year-old woman with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
        "presentation": "{patientName}, a 70-year-old man with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028d.hyperkalaemia.a-renal-result",
        "patientPresentationVariantId": "presentation.gs028d.hyperkalaemia.a-renal-result",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Potassium treatment review",
        "revisedPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028d.hyperkalaemia.a-renal-result.female.52",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028d.hyperkalaemia.a-renal-result.male.52",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028d.hyperkalaemia.a-renal-result.female.70",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old woman with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028d.hyperkalaemia.a-renal-result.male.70",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old man with advanced kidney disease, brings a completed hospital record. Admission potassium was 6.7 mmol/L on a non-haemolysed sample, with broad QRS complexes. After intravenous calcium the QRS complexes narrowed. The next potassium measurement was still 6.7 mmol/L. The following treatment decision is being reviewed.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Potassium treatment review",
    "previousChiefComplaint": "Potassium treatment review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.52",
        "chiefComplaint": "Potassium treatment review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.52",
        "chiefComplaint": "Potassium treatment review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.female.70",
        "chiefComplaint": "Potassium treatment review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-renal-result.male.70",
        "chiefComplaint": "Potassium treatment review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate the ECG response from the persistent extracellular potassium problem. Then: Choose the primary shifting drug from credible active pharmacological alternatives while removal is arranged.",
    "reviewerNotes": "The comparative active-drug claim is an offline synthesis linked to the already recorded UKKA source; direct section alignment and renal review remain explicit release-review requirements. No dose, repeat interval or dialysis threshold is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qf3.20261104.f04.d1": "choice.qf2.20261104.f04.d1",
      "choice.qf3.20261104.f04.d2": "choice.qf2.20261104.f04.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qf3.20261104.f04.d1": null,
      "choice.qf3.20261104.f04.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f04.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f04.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v1.r4",
      "conceptId": "concept.hyperkalaemia.post-calcium-treatment.v1",
      "stem": "Which drug treatment should the hospital team have added for {patientName}'s potassium elevation?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Intravenous insulin with glucose",
          "isCorrect": true,
          "rationale": "Calcium has addressed the observed electrical instability but has not shifted potassium. Insulin with glucose provides the immediate intracellular-shift treatment while potassium removal is arranged.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f04.d1",
          "label": "Inhaled salbutamol by nebulizer",
          "isCorrect": false,
          "distractorRationale": "A beta-agonist can contribute to potassium shifting, but should not displace insulin-glucose as the primary shifting treatment for this severe episode."
        },
        {
          "id": "choice.qf3.20261104.f04.d2",
          "label": "Intravenous sodium bicarbonate infusion",
          "isCorrect": false,
          "distractorRationale": "Bicarbonate is a familiar potassium-lowering proposal, but routine bicarbonate is not the preferred substitute for insulin-glucose in the supplied non-acidemic episode."
        }
      ],
      "explanation": "The narrower QRS does not mean the potassium elevation has resolved: calcium does not lower serum potassium. Insulin with glucose supplies the principal immediate intracellular-shift treatment here. A beta-agonist is an adjunct rather than a replacement, and routine bicarbonate is not the preferred substitute in this non-acidemic record. Monitoring and potassium removal remain necessary parts of hospital care.",
      "teachingPoint": "The narrower QRS does not mean the potassium elevation has resolved: calcium does not lower serum potassium. Insulin with glucose supplies the principal immediate intracellular-shift treatment here. A beta-agonist is an adjunct rather than a replacement, and routine bicarbonate is not the preferred substitute in this non-acidemic record. Monitoring and potassium removal remain necessary parts of hospital care.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.gs028d.hyperkalaemia.mechanisms",
        "claim.qf3.hyperkalaemia-active-treatment-ranking"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.post-calcium-treatment.v1",
      "nextConceptId": "concept.hyperkalaemia.post-calcium-treatment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective remains immediate potassium-shifting treatment after calcium; replacing weak alternatives does not create a new mechanism or removal objective."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.hyperkalaemia.severe-community-result-transfer.v1.r3",
      "whatChanged": "Retained the safety-critical ECG and potassium response. Replaced observation and routine repeat calcium with active potassium treatments and added the pH context needed to rank bicarbonate. The named clinic patient brings a hospital record; the complete task asks about that hospital decision rather than implying acute hospital treatment in the clinic. No transfer-availability permission.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "0fe0cca7-0c4d-40e9-af26-db95733f95dd"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Retained the safety-critical ECG and potassium response. Replaced observation and routine repeat calcium with active potassium treatments and added the pH context needed to rank bicarbonate. The named clinic patient brings a hospital record; the complete task asks about that hospital decision rather than implying acute hospital treatment in the clinic. No transfer-availability permission.",
      "sourceDecision": "The comparative active-drug claim is an offline synthesis linked to the already recorded UKKA source; direct section alignment and renal review remain explicit release-review requirements. No dose, repeat interval or dialysis threshold is authored.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f05",
    "auditId": "F05",
    "caseId": "case.gs028f.neck-mass.c2-completed-needle-record",
    "nodeId": "node.gs028f.neck-mass.c2-completed-needle-record.1",
    "previousQuestionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
    "questionVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which next diagnostic plan should be requested for {patientName}'s neck lesion?",
    "previousChoiceLabels": [
      "Repeat image-guided needle assessment of the lesion",
      "Arrange open diagnostic excision of the lesion",
      "Arrange interval ultrasound surveillance of the lesion"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns with a persistent lateral neck lump separate from the thyroid and salivary glands. The first needle pass entered its fluid-containing centre; the specimen contains macrophages and proteinaceous material without lesional epithelial or lymphoid cells. The lump refills. The radiologist's images show tissue projecting into the cavity from its wall, with internal blood flow on Doppler.",
    "previousPresentation": "{patientName}, a 43-year-old woman, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
        "presentation": "{patientName}, a 43-year-old woman, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
        "presentation": "{patientName}, a 43-year-old man, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
        "presentation": "{patientName}, a 58-year-old woman, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion."
      },
      {
        "id": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
        "presentation": "{patientName}, a 58-year-old man, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028f.neck-mass.c2-completed-needle-record",
        "patientPresentationVariantId": "presentation.gs028f.neck-mass.c2-completed-needle-record",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Persistent neck lump",
        "revisedPresentation": "{patientName}, a 43-year-old woman, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.female.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.male.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.female.58",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old woman, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
            "approvedInstantiationProfileId": "profile.gs028f.neck-mass.c2-completed-needle-record.male.58",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old man, returns with a persistent lateral neck lump separate from the thyroid and salivary glands on specialist imaging. An earlier aspirate yielded brown fluid. The slide description lists macrophages and proteinaceous material, with no lesional epithelial or lymphoid cells. The lump refilled, and ultrasound shows a fluid-containing centre with a mural solid portion.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
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
    "intendedInference": "Determine what the fluid-centre sample does and does not represent. Then: Request representative needle sampling of the mural tissue before moving to an open diagnostic operation.",
    "reviewerNotes": "Single previously recorded UK multidisciplinary guideline supports the neck-mass and needle/core boundaries. The new target claim is a case-specific sampling inference, not a guaranteed result or complete cancer pathway. Scope hold is closed by the explicit owner/manager KEEP decision.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf3.20261104.f05.d1": "choice.qf2.20261104.f05.d1",
      "choice.qf3.20261104.f05.d2": "choice.qf2.20261104.f05.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf3.20261104.f05.d1": null,
      "choice.qf3.20261104.f05.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f05.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r4",
      "conceptId": "concept.head-neck.cyst-fluid-sample-assessment.v1",
      "stem": "Which diagnostic request should be made next for {patientName}'s neck mass?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Ultrasound-guided core biopsy of mural tissue",
          "isCorrect": true,
          "rationale": "The fluid-only result does not establish the nature of the mural tissue. Directing the needle into that component corrects the specific representativeness problem without treating the fluid as a benign diagnosis.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f05.d1",
          "label": "Open excisional biopsy of the entire neck mass",
          "isCorrect": false,
          "distractorRationale": "An intact specimen is tempting after a failed sample, but a representative needle approach remains available before an open diagnostic operation in this at-risk adult neck mass."
        },
        {
          "id": "choice.qf3.20261104.f05.d2",
          "label": "Interval ultrasound surveillance of the neck mass",
          "isCorrect": false,
          "distractorRationale": "Surveillance treats the cyst-fluid result as sufficient reassurance, although it does not represent the vascular mural component in this persistent adult neck mass."
        }
      ],
      "explanation": "A macrophage-rich aspirate from the fluid centre is not a representative diagnosis of the mural component. Request image-guided tissue sampling directed at that component; core biopsy can provide tissue after the inadequate fluid aspirate. Representative targeted FNA can also be appropriate, and the question does not rank it as an incorrect alternative. The fluid result does not establish a basis for surveillance, and an open diagnostic operation need not precede a representative needle approach.",
      "teachingPoint": "A macrophage-rich aspirate from the fluid centre is not a representative diagnosis of the mural component. Request image-guided tissue sampling directed at that component; core biopsy can provide tissue after the inadequate fluid aspirate. Representative targeted FNA can also be appropriate, and the question does not rank it as an incorrect alternative. The fluid result does not establish a basis for surveillance, and an open diagnostic operation need not precede a representative needle approach.",
      "supportingEvidenceClaimIds": [
        "claim.gs028f.neck.adult-lateral-malignancy-evaluation",
        "claim.gs028f.neck.needle-before-open",
        "claim.gs028f.neck.core-biopsy-alternative",
        "claim.gs028f.neck.imaging-versus-tissue-diagnosis",
        "claim.qf3.neck-mural-sampling"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.head-neck.cyst-fluid-sample-assessment.v1",
      "nextConceptId": "concept.head-neck.cyst-fluid-sample-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective remains representative needle assessment after an inadequate cyst-fluid sample; the replacement specifies the corrective target rather than a new disease pathway."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.gs028f.head-neck.initial-fna-not-open-biopsy.v4.r3",
      "whatChanged": "Specified the mural target and needle technique, replacing an underspecified repeat assessment. All options are named diagnostic requests at the same stage; core biopsy is not used as an incorrect foil.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "65a34315-920b-45c8-a101-2e85a1ffcf77"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Specified the mural target and needle technique, replacing an underspecified repeat assessment. All options are named diagnostic requests at the same stage; core biopsy is not used as an incorrect foil.",
      "sourceDecision": "Single previously recorded UK multidisciplinary guideline supports the neck-mass and needle/core boundaries. The new target claim is a case-specific sampling inference, not a guaranteed result or complete cancer pathway. Scope hold is closed by the explicit owner/manager KEEP decision.",
      "scopeDecision": "KEEP: manager/owner decision of 2026-11-04 establishes initial adult neck-mass evaluation as general-surgery scope. Retain explicit neck anatomy. This is an owner scope decision, not a claim to have accessed an ABSITE blueprint or SCORE.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f06",
    "auditId": "F06",
    "caseId": "case.gs028e.immunology.c3-historical-kidney-event",
    "nodeId": "node.gs028e.immunology.c3-historical-kidney-event.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r3",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which archived laboratory result would be most consistent with {patientName}'s graft event?",
    "previousChoiceLabels": [
      "Recipient serum collected before implantation binds donor endothelial cells",
      "Donor serum collected before implantation binds recipient endothelial cells",
      "Recipient lymphocytes collected before implantation destroy donor parenchymal cells"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
    "previousPresentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
        "presentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
        "presentation": "{patientName}, a 41-year-old man, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
        "presentation": "{patientName}, a 64-year-old woman, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
        "presentation": "{patientName}, a 64-year-old man, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028e.immunology.c3-historical-kidney-event",
        "patientPresentationVariantId": "presentation.gs028e.immunology.c3-historical-kidney-event",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Transplant record review",
        "revisedPresentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old woman, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old man, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old man, brings records of a failed kidney graft. After reperfusion the graft became mottled and stopped making urine. The major vessels were patent. Biopsy showed endothelial immunoglobulin and complement deposition with small-vessel thrombosis. Stored donor and recipient materials remain for a retrospective review.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
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
    "intendedInference": "Use the vascular record to identify a mechanism that warrants investigation without declaring a diagnosis. Then: Choose the serum time and cell target capable of establishing preimplantation donor reactivity.",
    "reviewerNotes": "An investigation of a hypothesis, not a new crossmatch performance claim, antigen assignment, Banff diagnosis or transplant-treatment rule. Offline temporal/target inference is mapped separately to existing mechanism claims.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qf3.20261104.f06.d1": "choice.qf2.20261104.f06.d1",
      "choice.qf3.20261104.f06.d2": "choice.qf2.20261104.f06.d2",
      "choice.qf3.20261104.f06.d3": "choice.qf2.20261104.f06.d1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qf3.20261104.f06.d1": null,
      "choice.qf3.20261104.f06.d2": null,
      "choice.qf3.20261104.f06.d3": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f06.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f06.d2": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f06.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r4",
      "conceptId": "concept.hyperacute-rejection.archived-crossmatch-provenance.v1",
      "stem": "Which archived crossmatch record is most informative for interpreting {patientName}'s graft failure?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Preimplantation recipient serum against donor cells",
          "isCorrect": true,
          "rationale": "This directly tests whether recipient reactivity to donor targets was present before the graft event, rather than being detected only afterward or directed at self.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f06.d1",
          "label": "Postfailure recipient serum against donor cells",
          "isCorrect": false,
          "distractorRationale": "The more recent sample is tempting, but donor reactivity found only after failure does not establish that it was already present at implantation."
        },
        {
          "id": "choice.qf3.20261104.f06.d2",
          "label": "Preimplantation recipient serum against recipient cells",
          "isCorrect": false,
          "distractorRationale": "This preserves the relevant collection time but tests self-reactivity rather than donor-directed graft reactivity."
        },
        {
          "id": "choice.qf3.20261104.f06.d3",
          "label": "Postfailure recipient serum against recipient cells",
          "isCorrect": false,
          "distractorRationale": "This is a possible control interaction, but neither the target nor collection time establishes preimplantation donor reactivity."
        }
      ],
      "explanation": "The major-vessel and microvascular findings justify investigating an immune vascular mechanism without proving it. To test a preformed recipient-antibody explanation, use recipient serum obtained before implantation against donor targets. A postfailure positive test cannot by itself establish preimplantation presence; recipient-cell reactivity addresses a different question. Antibody and cellular pathways can coexist.",
      "teachingPoint": "The major-vessel and microvascular findings justify investigating an immune vascular mechanism without proving it. To test a preformed recipient-antibody explanation, use recipient serum obtained before implantation against donor targets. A postfailure positive test cannot by itself establish preimplantation presence; recipient-cell reactivity addresses a different question. Antibody and cellular pathways can coexist.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.gs028e.t_cell_graft_comparison",
        "claim.qf3.preimplantation-specimen-inference"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
      "nextConceptId": "concept.hyperacute-rejection.archived-crossmatch-provenance.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "This task scores investigation design and temporal evidence, rather than naming the preformed-antibody mechanism from explicit immunoglobulin/complement stains."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r3",
      "whatChanged": "Removed the stain-to-mechanism matching sentence. Used a complete balanced time-by-target option set, replacing component-majority convergence and the reversed donor-serum foil. The task explicitly selects a completed record for review; its choices retain the no_test classification.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "0dfbbe4f-fbed-457b-bbcc-2053772b6d80"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the stain-to-mechanism matching sentence. Used a complete balanced time-by-target option set, replacing component-majority convergence and the reversed donor-serum foil. The task explicitly selects a completed record for review; its choices retain the no_test classification.",
      "sourceDecision": "An investigation of a hypothesis, not a new crossmatch performance claim, antigen assignment, Banff diagnosis or transplant-treatment rule. Offline temporal/target inference is mapped separately to existing mechanism claims.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f07",
    "auditId": "F07",
    "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r3",
    "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which plan should be taken to {patientName}'s preoperative conference?",
    "previousChoiceLabels": [
      "Control ascites before finalizing the repair date",
      "Raise the platelet count before finalizing the repair date",
      "Reserve postoperative critical care before finalizing the repair date"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
    "previousPresentation": "{patientName}, a 43-year-old woman with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "presentation": "{patientName}, a 43-year-old man with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "presentation": "{patientName}, a 68-year-old man with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Hernia preoperative review",
        "revisedPresentation": "{patientName}, a 43-year-old woman with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man with cirrhosis and previous variceal bleeding, is planning repair of a reducible abdominal-wall hernia. The hernia remains reducible, without vomiting. Bilirubin, albumin, INR and creatinine remain within the laboratory reference ranges. Since the earlier assessment the abdomen has enlarged, with shifting dullness and free intraperitoneal fluid on ultrasound. The platelet count remains at its longstanding reduced level.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Hernia preoperative review",
    "previousChiefComplaint": "Hernia preoperative review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "chiefComplaint": "Hernia preoperative review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "chiefComplaint": "Hernia preoperative review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "chiefComplaint": "Hernia preoperative review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "chiefComplaint": "Hernia preoperative review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the changed hernia and bowel observations as an urgent presentation. Then: Apply the urgency exception rather than carrying forward the elective cirrhosis-optimization sequence.",
    "reviewerNotes": "The recorded cirrhosis claim explicitly preserves immediate assessment for surgical emergencies. A separate draft application maps the supplied obstructive pattern; no mortality, platelet threshold, INR correction target or diagnosis of bowel viability is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf3.20261104.f07.d1": "choice.qf2.20261104.f07.d1",
      "choice.qf3.20261104.f07.d2": "choice.qf2.20261104.f07.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf3.20261104.f07.d1": null,
      "choice.qf3.20261104.f07.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f07.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f07.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r4",
      "conceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
      "stem": "Which hospital plan should be arranged now for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Urgent surgical assessment with resuscitation",
          "isCorrect": true,
          "rationale": "The changed hernia and bowel pattern make this an urgent obstruction assessment, despite the elevated cirrhosis-related operative risk. The prior elective deferral does not govern this new presentation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f07.d1",
          "label": "Ascites drainage followed by reconsideration of repair",
          "isCorrect": false,
          "distractorRationale": "Fluid control was appropriate to the earlier elective plan, but using that sequence now delays assessment of the changed bowel-containing hernia."
        },
        {
          "id": "choice.qf3.20261104.f07.d2",
          "label": "Coagulation correction followed by reconsideration of repair",
          "isCorrect": false,
          "distractorRationale": "The raised INR merits perioperative assessment, but normalization cannot be made a prerequisite for evaluating the new obstructive presentation."
        }
      ],
      "explanation": "The prior plan concerned a nonurgent reducible hernia. Persistent pain, irreducibility, vomiting and the proximal/distal bowel-calibre pattern change the urgency. Arrange urgent hospital surgical assessment and resuscitation; liver disease and coagulation findings inform that care rather than requiring completion of elective optimization first. These findings do not by themselves prove bowel necrosis or specify an operation.",
      "teachingPoint": "The prior plan concerned a nonurgent reducible hernia. Persistent pain, irreducibility, vomiting and the proximal/distal bowel-calibre pattern change the urgency. Arrange urgent hospital surgical assessment and resuscitation; liver disease and coagulation findings inform that care rather than requiring completion of elective optimization first. These findings do not by themselves prove bowel necrosis or specify an operation.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.qf3.cirrhosis-urgent-hernia-boundary"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis.new-fluid-elective-plan.v1",
      "nextConceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored action changes from deferring a nonurgent repair for ascites control to urgent assessment of a new obstructive presentation. Preserve the elective-risk concept and histories."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r3",
      "whatChanged": "Replaced treat-the-new-fluid matching and the broad conference task with a changed urgency decision. All choices are specific hospital sequences; the cautious optimization choices are credible near misses rather than the key.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "08837a69-f1de-4fe8-bb7e-4f1a2e481718"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced treat-the-new-fluid matching and the broad conference task with a changed urgency decision. All choices are specific hospital sequences; the cautious optimization choices are credible near misses rather than the key.",
      "sourceDecision": "The recorded cirrhosis claim explicitly preserves immediate assessment for surgical emergencies. A separate draft application maps the supplied obstructive pattern; no mortality, platelet threshold, INR correction target or diagnosis of bowel viability is invented.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f08",
    "auditId": "F08",
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "previousQuestionVariantId": "question.lymphangitis.heel-inguinal.v1.r3",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which imaging request should be made next in {patientName}'s assessment?",
    "previousChoiceLabels": [
      "Targeted soft-tissue ultrasound at the heel",
      "Compression venous ultrasound along the calf",
      "Targeted soft-tissue ultrasound at the groin"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a split heel callus, redness extending up the medial leg and tender groin nodes. A tender medial-calf swelling overlies longstanding varicosities. Temperature and circulation are stable. The skin is intact over the calf swelling, which is tender but not visibly draining.",
    "previousPresentation": "{patientName}, a 38-year-old woman, has calf varicosities and a split heel callus. Tender redness runs from the foot up the medial leg, with tender groin nodes. Beneath the thick heel skin there is a firm tender swelling; palpation does not reveal its contents. The visible calf veins are also tender along part of the affected area.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.lymphangitis.heel-inguinal",
        "patientPresentationVariantId": "presentation.lymphangitis.heel-inguinal",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Painful leg redness",
        "revisedPresentation": "{patientName}, a 38-year-old woman, has calf varicosities and a split heel callus. Tender redness runs from the foot up the medial leg, with tender groin nodes. Beneath the thick heel skin there is a firm tender swelling; palpation does not reveal its contents. The visible calf veins are also tender along part of the affected area.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Painful leg redness",
    "previousChiefComplaint": "Painful leg redness",
    "previousProfileChiefComplaints": [],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the separate calf cavity from the adjacent vein and diffuse heel changes. Then: Apply source control to that focal lesion while retaining the separate inflammatory treatment question.",
    "reviewerNotes": "Existing abscess claims support imaging and uncomplicated superficial source control. The new qualitative image interpretation is an offline application. No deep plantar drainage, venous procedure, antibiotic regimen or calf-versus-heel testing priority is inferred.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "acute_lymphangitis": "acute_lymphangitis",
      "choice.qf3.20261104.f08.d1": "choice.qf2.20261104.f08.d1",
      "choice.qf3.20261104.f08.d2": "choice.qf2.20261104.f08.d2"
    },
    "choiceServiceOverrides": {
      "acute_lymphangitis": null,
      "choice.qf3.20261104.f08.d1": null,
      "choice.qf3.20261104.f08.d2": null
    },
    "choiceTimingOverrides": {
      "acute_lymphangitis": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f08.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f08.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.lymphangitis.heel-inguinal.v1.r4",
      "conceptId": "concept.lymphangitis.distal-source-imaging.v2",
      "stem": "Which treatment should be arranged for {patientName}'s focal calf problem?",
      "answerChoices": [
        {
          "id": "acute_lymphangitis",
          "label": "Incision and drainage of the calf lesion",
          "isCorrect": true,
          "rationale": "The discrete superficial cavity with mobile contents supports a drainable collection. Source control is needed; the heel-to-node inflammatory pattern does not explain away the additional focal lesion.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f08.d1",
          "label": "Oral antibiotic treatment of the leg inflammation",
          "isCorrect": false,
          "distractorRationale": "Antibiotics may be part of care for the spreading inflammation, but they do not replace source control for the demonstrated focal collection."
        },
        {
          "id": "choice.qf3.20261104.f08.d2",
          "label": "Compression treatment of the tender calf veins",
          "isCorrect": false,
          "distractorRationale": "The visible veins are a plausible competing explanation before imaging. The separate cavity and compressible flowing adjacent vein favor a different focal treatment."
        }
      ],
      "explanation": "The regional inflammatory pattern can coexist with a focal collection. Here the calf ultrasound shows a discrete superficial cavity separate from the flowing vein and deep fascia. Arrange incision and drainage of that collection; assess the accompanying inflammatory process and antibiotic needs separately. Neither a venous explanation nor antibiotic treatment replaces source control for the focal cavity.",
      "teachingPoint": "The regional inflammatory pattern can coexist with a focal collection. Here the calf ultrasound shows a discrete superficial cavity separate from the flowing vein and deep fascia. Arrange incision and drainage of that collection; assess the accompanying inflammatory process and antibiotic needs separately. Neither a venous explanation nor antibiotic treatment replaces source control for the focal cavity.",
      "exhibit": {
        "kind": "table",
        "caption": "Targeted ultrasound observations",
        "columnHeaders": [
          "Observed structure"
        ],
        "rowHeaders": [
          "Heel skin and subcutaneous tissue",
          "Medial-calf swelling",
          "Adjacent superficial vein"
        ],
        "cells": [
          [
            "Thickened tissue with small interstitial fluid channels; no separate fluid pocket."
          ],
          [
            "A localized subcutaneous cavity contains mobile internal echoes during probe pressure; no internal Doppler flow. Its plane is separate from fascia and vessels."
          ],
          [
            "Lumen collapses with probe pressure; flow is present."
          ]
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
        "claim.bread-butter.skin-infection.equivocal-ultrasound",
        "claim.bread-butter.cutaneous-abscess.incision-drainage",
        "claim.bread-butter.cutaneous-abscess.antibiotic-nuance",
        "claim.qf3.soft-tissue-ultrasound-application"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.lymphangitis.distal-source-imaging.v1",
      "nextConceptId": "concept.lymphangitis.distal-source-imaging.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored choice changes from imaging a source to treating an imaged focal collection. Retain the source-imaging and syndrome-recognition constructs."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.lymphangitis.heel-inguinal.v1.r3",
      "whatChanged": "Removed the uncertainty-to-imaging cue and unrankable heel-versus-calf imaging order. Supplied actual calf/heel/venous observations and asks a bounded treatment decision; the groin-imaging foil is gone.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "0368a25c-1165-474d-b117-e729a0cd8fdd"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the uncertainty-to-imaging cue and unrankable heel-versus-calf imaging order. Supplied actual calf/heel/venous observations and asks a bounded treatment decision; the groin-imaging foil is gone.",
      "sourceDecision": "Existing abscess claims support imaging and uncomplicated superficial source control. The new qualitative image interpretation is an offline application. No deep plantar drainage, venous procedure, antibiotic regimen or calf-versus-heel testing priority is inferred.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f09",
    "auditId": "F09",
    "caseId": "case.gs028e.mis-principles.c2-different-phases",
    "nodeId": "node.gs028e.mis-principles.c2-different-phases.1",
    "previousQuestionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r3",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which paired physiological explanation best accounts for {patientName}'s recorded response?",
    "previousChoiceLabels": [
      "Caval return restriction with reduced respiratory compliance",
      "Positional venous pooling with reduced respiratory compliance",
      "Caval return restriction with increased airway resistance",
      "Positional venous pooling with increased airway resistance"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and measured total PEEP. Plateau readings were taken during passive inspiratory holds. Anaesthetic dosing was unchanged during an increase and subsequent reduction in insufflation pressure.",
    "previousPresentation": "{patientName}, a 36-year-old woman, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.36",
        "presentation": "{patientName}, a 36-year-old woman, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.36",
        "presentation": "{patientName}, a 36-year-old man, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.female.61",
        "presentation": "{patientName}, a 61-year-old woman, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-different-phases.male.61",
        "presentation": "{patientName}, a 61-year-old man, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028e.mis-principles.c2-different-phases",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c2-different-phases",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Operation record review",
        "revisedPresentation": "{patientName}, a 36-year-old woman, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-different-phases.female.36",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.female.36",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 36-year-old woman, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-different-phases.male.36",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.male.36",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 36-year-old man, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-different-phases.female.61",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.female.61",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 61-year-old woman, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-different-phases.male.61",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-different-phases.male.61",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 61-year-old man, reviews a completed laparoscopic anaesthetic record. The table remained flat. Volume-controlled ventilation used the same tidal volume, inspiratory flow and PEEP throughout. The team increased and then reduced insufflation pressure; the recorded observations are shown below.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
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
    "intendedInference": "Interpret ventricular filling and ejection observations rather than attributing every smaller stroke volume to pump failure. Then: Interpret the plateau response under fixed-volume controls and integrate the two explanations.",
    "reviewerNotes": "A controlled-record physiology application with two integrated classifications, not a claim of a separate consequential management step. Anaesthesia/source-alignment review of the new qualitative filling/plateau inference is required; no numeric pressure, ventilator setting or treatment threshold is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf3.20261104.f09.d1": "choice.qf2.20261104.f09.d1",
      "choice.qf3.20261104.f09.d2": "choice.qf2.20261104.f09.d2",
      "choice.qf3.20261104.f09.d3": "choice.qf2.20261104.f09.d3"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf3.20261104.f09.d1": null,
      "choice.qf3.20261104.f09.d2": null,
      "choice.qf3.20261104.f09.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f09.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f09.d2": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f09.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.pneumoperitoneum.context-dependent-venous-return.v4.r4",
      "conceptId": "concept.laparoscopy.pressure-cardiopulmonary.v1",
      "stem": "Which paired interpretation best fits {patientName}'s record?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Reduced cardiac filling; increased respiratory elastic load",
          "isCorrect": true,
          "rationale": "Smaller filling volume with preserved ejection fraction supports reduced preload rather than a new loss of contractility. The increased plateau pressure at the same delivered volume supports an elastic-load component.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f09.d1",
          "label": "Reduced cardiac contractility; increased respiratory elastic load",
          "isCorrect": false,
          "distractorRationale": "The respiratory interpretation fits. Smaller end-diastolic volume with similar ejection fraction does not best support primary loss of contractility as the explanation of lower stroke volume."
        },
        {
          "id": "choice.qf3.20261104.f09.d2",
          "label": "Reduced cardiac filling; increased respiratory resistive load",
          "isCorrect": false,
          "distractorRationale": "The filling interpretation fits. A new resistive load does not by itself account for the higher plateau pressure under the supplied ventilation controls."
        },
        {
          "id": "choice.qf3.20261104.f09.d3",
          "label": "Reduced cardiac contractility; increased respiratory resistive load",
          "isCorrect": false,
          "distractorRationale": "Both are real contributors to perioperative deterioration, but neither is the best primary account of the supplied paired observations."
        }
      ],
      "explanation": "The fall in stroke volume accompanies a smaller end-diastolic volume with a similar ejection fraction, supporting reduced filling rather than new primary contractile failure. Higher plateau pressure at unchanged tidal volume and PEEP indicates an increased elastic pressure requirement. The reversible pressure sequence fits abdominal venous-return restriction and respiratory mechanical restriction, without proving a unique vascular lesion or excluding every mixed mechanism.",
      "teachingPoint": "The fall in stroke volume accompanies a smaller end-diastolic volume with a similar ejection fraction, supporting reduced filling rather than new primary contractile failure. Higher plateau pressure at unchanged tidal volume and PEEP indicates an increased elastic pressure requirement. The reversible pressure sequence fits abdominal venous-return restriction and respiratory mechanical restriction, without proving a unique vascular lesion or excluding every mixed mechanism.",
      "exhibit": {
        "kind": "table",
        "caption": "Observations during the pressure sequence",
        "columnHeaders": [
          "At higher insufflation pressure",
          "After pressure reduction"
        ],
        "rowHeaders": [
          "Left-ventricular end-diastolic volume",
          "Stroke volume",
          "Left-ventricular ejection fraction",
          "Peak airway pressure",
          "Plateau airway pressure"
        ],
        "cells": [
          [
            "Smaller",
            "Returns toward baseline"
          ],
          [
            "Smaller",
            "Returns toward baseline"
          ],
          [
            "Similar to baseline",
            "Similar to baseline"
          ],
          [
            "Higher",
            "Returns toward baseline"
          ],
          [
            "Higher",
            "Returns toward baseline"
          ]
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.caval-compression-venous-return",
        "claim.gs028e.laparoscopy.pressure-position-context",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact3",
        "claim.qf3.controlled-filling-elastic-load"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.laparoscopy.pressure-cardiopulmonary.v1",
      "nextConceptId": "concept.laparoscopy.pressure-cardiopulmonary.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective remains interpretation of the pressure-linked cardiac-filling and respiratory-mechanical response. The new alternatives repair the same construct rather than adding an operative-adjustment rule."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v4.r3",
      "whatChanged": "Kept necessary position/ventilation controls and specified measured total PEEP and passive inspiratory holds, so the plateau interpretation does not depend on an assumed acquisition condition. Replaced impossible position-change foils with contractility alternatives, separated peak and plateau observations, and removed the calculated difference row and equal-rise summary.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "58f8c9a8-ad40-479e-b06b-e8c0fd5a52ef"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Kept necessary position/ventilation controls and specified measured total PEEP and passive inspiratory holds, so the plateau interpretation does not depend on an assumed acquisition condition. Replaced impossible position-change foils with contractility alternatives, separated peak and plateau observations, and removed the calculated difference row and equal-rise summary.",
      "sourceDecision": "A controlled-record physiology application with two integrated classifications, not a claim of a separate consequential management step. Anaesthesia/source-alignment review of the new qualitative filling/plateau inference is required; no numeric pressure, ventilator setting or treatment threshold is authored.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f10",
    "auditId": "F10",
    "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
    "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
    "previousQuestionVariantId": "question.dcis.sentinel-node-setting.v3.r3",
    "questionVariantId": "question.dcis.sentinel-node-setting.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which axillary management strategy is most appropriate for {patientName}'s current operative plan?",
    "previousChoiceLabels": [
      "Schedule sentinel-node biopsy at the forthcoming operation",
      "Schedule sentinel-node biopsy if final pathology reveals invasion",
      "Omit sentinel-node biopsy from the overall treatment course"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has bilateral core-biopsy findings of pure DCIS without identified invasion. On the left, separated areas occupy several breast regions; the planned specimen includes the gland from the clavicle to the inframammary fold, while the skin envelope is retained for reconstruction. On the right, the operation removes the localized DCIS with a rim of surrounding tissue and leaves the remaining breast. No axillary node is palpable; ultrasound on both sides shows oval nodes with retained fatty hila and thin uniform cortices.",
    "previousPresentation": "{patientName}, a 43-year-old woman, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
        "presentation": "{patientName}, a 43-year-old woman, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices."
      },
      {
        "id": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
        "presentation": "{patientName}, a 59-year-old woman, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028c.dcis.b-oncoplastic-mapping",
        "patientPresentationVariantId": "presentation.gs028c.dcis.b-oncoplastic-mapping",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "DCIS surgical planning",
        "revisedPresentation": "{patientName}, a 43-year-old woman, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
            "approvedInstantiationProfileId": "profile.gs028c.dcis.b-oncoplastic-mapping.female.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
            "approvedInstantiationProfileId": "profile.gs028c.dcis.b-oncoplastic-mapping.female.59",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 59-year-old woman, initially planned a localized breast excision after core samples showed pure DCIS. Further extent imaging led the team to book a simple mastectomy instead. The sampled tissue still shows DCIS without identified invasion. No axillary node is palpable; ultrasound shows oval nodes with retained fatty hila and thin uniform cortices.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
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
    "intendedInference": "Interpret the gland-removal versus localized-excision descriptions rather than equating skin retention with conservation. Then: Apply the DCIS staging rule separately to the two operations.",
    "reviewerNotes": "Existing ASBrS source supports the standard mastectomy/conservation distinction. The new anatomical application is explicitly mapped; no delayed magnetic-tracer strategy, invasive diagnosis or universal rule for every oncoplastic operation is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qf3.20261104.f10.d1": "choice.qf2.20261104.f10.d1",
      "choice.qf3.20261104.f10.d2": "choice.qf2.20261104.f10.d2",
      "choice.qf3.20261104.f10.d3": "choice.qf2.20261104.f10.d1"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qf3.20261104.f10.d1": null,
      "choice.qf3.20261104.f10.d2": null,
      "choice.qf3.20261104.f10.d3": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f10.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f10.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f10.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.dcis.sentinel-node-setting.v3.r4",
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "stem": "Which axillary procedure should be planned for {patientName} at this operation?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Left sentinel-node biopsy",
          "isCorrect": true,
          "rationale": "The left specimen is a mastectomy despite retention of the skin envelope. Concurrent sentinel-node staging is ordinarily appropriate there; the right procedure is uncomplicated breast conservation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f10.d1",
          "label": "Right sentinel-node biopsy",
          "isCorrect": false,
          "distractorRationale": "This applies staging to the conserving side while omitting the side whose operation can compromise later mapping. The core diagnosis is the same on both sides, but the operations differ."
        },
        {
          "id": "choice.qf3.20261104.f10.d2",
          "label": "Left and right sentinel-node biopsy",
          "isCorrect": false,
          "distractorRationale": "The bilateral diagnosis tempts symmetric staging, but uncomplicated pure-DCIS breast conservation does not routinely require sentinel-node biopsy."
        },
        {
          "id": "choice.qf3.20261104.f10.d3",
          "label": "No sentinel-node biopsy",
          "isCorrect": false,
          "distractorRationale": "Pure DCIS and unremarkable nodal imaging do not remove the conventional staging consideration accompanying the left mastectomy."
        }
      ],
      "explanation": "Retaining the left skin envelope does not make removal of the gland a breast-conserving operation. Sentinel-node biopsy is ordinarily performed with that mastectomy because later mapping may be unreliable. The right localized excision is breast conservation, where routine axillary surgery for pure DCIS is generally omitted. The bilateral core diagnosis therefore does not imply bilateral axillary surgery.",
      "teachingPoint": "Retaining the left skin envelope does not make removal of the gland a breast-conserving operation. Sentinel-node biopsy is ordinarily performed with that mastectomy because later mapping may be unreliable. The right localized excision is breast conservation, where routine axillary surgery for pure DCIS is generally omitted. The bilateral core diagnosis therefore does not imply bilateral axillary surgery.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-mastectomy",
        "claim.gs028c.dcis.axilla-omit-bcs",
        "claim.gs028c.dcis.axilla-risk-setting",
        "claim.qf3.dcis-specimen-operation-application"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
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
      "reason": "The same conventional DCIS operation-dependent staging rule is applied to two different specimens. Bilaterality and skin retention change case details, not the underlying scored meaning."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.dcis.sentinel-node-setting.v3.r3",
      "whatChanged": "Removed the named switch-to-mastectomy scaffold. Replaced it with an operative/specimen distinction and a bilateral decision, with laterality/omission choices at the same stage and balanced node observations.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "e4354aee-08cf-4fce-beff-44c217f5f8b0"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the named switch-to-mastectomy scaffold. Replaced it with an operative/specimen distinction and a bilateral decision, with laterality/omission choices at the same stage and balanced node observations.",
      "sourceDecision": "Existing ASBrS source supports the standard mastectomy/conservation distinction. The new anatomical application is explicitly mapped; no delayed magnetic-tracer strategy, invasive diagnosis or universal rule for every oncoplastic operation is added.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f11",
    "auditId": "F11",
    "caseId": "case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
    "nodeId": "node.gs028se.p2e.perioperative-dnr.v4.perianal-abscess.1",
    "previousQuestionVariantId": "question.statistics-ethics.perioperative-dnr.v4.r3",
    "questionVariantId": "question.statistics-ethics.perioperative-dnr.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "If that scenario occurs, which order should be communicated in {patientName}'s recovery handover?",
    "previousChoiceLabels": [
      "Use the temporary peri-anaesthetic order until cardiovascular support ends",
      "Use the original directive at the recovery-unit handover",
      "Use the temporary peri-anaesthetic order through the remainder of the admission"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "abstract",
      "title": "Proposed recovery scenario",
      "body": "The patient is awake, follows commands and breathes without a ventilator. An infusion remains necessary for hypotension attributed by the anaesthetic team to the anaesthetic course. Transfer out of the operating room is being arranged."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is planning treatment of a superficial perianal abscess and has an existing DNR order. The patient uses prescribed oxygen at home for chronic lung disease. The patient and responsible clinicians agree to a temporary peri-anaesthetic modification that ends when the pre-anaesthetic cardiopulmonary condition has returned. The original directive then resumes. They consider the following possible recovery handover; the procedure has not yet occurred.",
    "previousPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
        "presentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
        "presentation": "{patientName}, a 58-year-old woman, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
        "presentation": "{patientName}, a 77-year-old man, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred."
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
        "presentation": "{patientName}, a 77-year-old woman, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028se.p2e.perioperative-dnr.v4.perianal-abscess",
        "patientPresentationVariantId": "presentation.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Anaesthetic planning",
        "revisedPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old man, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old woman, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 77-year-old man, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
            "approvedInstantiationProfileId": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 77-year-old woman, has a superficial perianal abscess and an existing DNR order. During planning, the patient and responsible clinicians agree to a temporary peri-anaesthetic modification, ending when the acute cardiopulmonary effects of anaesthesia have resolved. The original directive will then resume. They consider the following possible recovery handover; the procedure has not yet occurred.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Anaesthetic planning",
    "previousChiefComplaint": "Anaesthetic planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.58",
        "chiefComplaint": "Anaesthetic planning"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.58",
        "chiefComplaint": "Anaesthetic planning"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.male.77",
        "chiefComplaint": "Anaesthetic planning"
      },
      {
        "id": "profile.gs028se.perioperative-dnr-error-disclosure.a-perioperative-dnr-4.female.77",
        "chiefComplaint": "Anaesthetic planning"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish chronic baseline oxygen from support newly required because of anaesthesia. Then: Apply the complete agreed reassessment endpoint rather than a single device, location or activity milestone.",
    "reviewerNotes": "The patient-specific agreement is legitimate decision-critical evidence. This item does not impose a default DNR policy or prescribe an oxygen target. The future abscess task and chronology remain intact.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "key-4": "key-4",
      "choice.qf3.20261104.f11.d1": "choice.qf2.20261104.f11.d1",
      "choice.qf3.20261104.f11.d2": "choice.qf2.20261104.f11.d2"
    },
    "choiceServiceOverrides": {
      "key-4": null,
      "choice.qf3.20261104.f11.d1": null,
      "choice.qf3.20261104.f11.d2": null
    },
    "choiceTimingOverrides": {
      "key-4": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f11.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f11.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.statistics-ethics.perioperative-dnr.v4.r4",
      "conceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
      "stem": "Which directive order should be communicated at that handover for {patientName}?",
      "answerChoices": [
        {
          "id": "key-4",
          "label": "Reinstate DNR while oxygen continues",
          "isCorrect": true,
          "rationale": "The agreed endpoint is return to baseline, not independence from a treatment that was already necessary before anaesthesia. Prescribed baseline oxygen continues under the separately agreed care plan.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f11.d1",
          "label": "Reinstate DNR after oxygen discontinuation",
          "isCorrect": false,
          "distractorRationale": "This confuses chronic preoperative support with an unresolved acute anaesthetic effect and would extend the modification beyond the stipulated reassessed endpoint."
        },
        {
          "id": "choice.qf3.20261104.f11.d2",
          "label": "Reinstate DNR after usual activity returns",
          "isCorrect": false,
          "distractorRationale": "Mobility recovery can matter to discharge, but it is not the cardiopulmonary endpoint agreed for this directive."
        }
      ],
      "explanation": "The temporary modification has the endpoint agreed with the patient: reassessed return to the pre-anaesthetic cardiopulmonary condition. Baseline prescribed oxygen does not make that endpoint unmet. Reinstate the original directive and continue other treatment consistent with the separate care plan. Neither stopping chronic oxygen nor waiting for functional recovery was agreed as the endpoint.",
      "teachingPoint": "The temporary modification has the endpoint agreed with the patient: reassessed return to the pre-anaesthetic cardiopulmonary condition. Baseline prescribed oxygen does not make that endpoint unmet. Reinstate the original directive and continue other treatment consistent with the separate care plan. Neither stopping chronic oxygen nor waiting for functional recovery was agreed as the endpoint.",
      "exhibit": {
        "kind": "abstract",
        "title": "Possible recovery observations",
        "body": "The patient is awake and conversing. Blood pressure, breathing pattern and oxygen saturation match the documented preoperative observations on the same prescribed home oxygen. No vasopressor or ventilator is in use."
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.perioperative-dnr.1",
        "claim.gs028se.perioperative-dnr.2",
        "claim.gs028se.perioperative-dnr.3",
        "claim.gs028se.perioperative-dnr.4",
        "claim.qf3.dnr-baseline-support-endpoint"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
      "nextConceptId": "concept.perioperative-dnr.recovery-endpoint.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored meaning remains application of a patient-agreed recovery endpoint. Distinguishing baseline oxygen from unresolved anaesthetic support repairs the same endpoint task without changing DNR semantics."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.statistics-ethics.perioperative-dnr.v4.r3",
      "whatChanged": "Removed authoritative attribution of ongoing hypotension and the narrower stop-when-pressor-stops key. The key now acts after the complete stipulated reassessment; baseline oxygen makes a competing physiological endpoint consequential.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "48111297-73f2-4b4d-9309-9a8fc1e7a587"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed authoritative attribution of ongoing hypotension and the narrower stop-when-pressor-stops key. The key now acts after the complete stipulated reassessment; baseline oxygen makes a competing physiological endpoint consequential.",
      "sourceDecision": "The patient-specific agreement is legitimate decision-critical evidence. This item does not impose a default DNR policy or prescribe an oxygen target. The future abscess task and chronology remain intact.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f13",
    "auditId": "F13",
    "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
    "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
    "previousQuestionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r3",
    "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which entry should be made in {patientName}'s preoperative assessment?",
    "previousChoiceLabels": [
      "Suspected OSA; communicate perioperative risk",
      "Confirmed OSA; communicate an established diagnosis",
      "OSA unlikely; communicate low sleep-related risk"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
    "previousPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
        "presentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
        "presentation": "{patientName}, a 46-year-old man, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
        "presentation": "{patientName}, a 68-year-old man, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028d.anesthesia.a-validated-not-impression",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Preoperative sleep assessment",
        "revisedPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028d.anesthesia.a-validated-not-impression.female.46",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028d.anesthesia.a-validated-not-impression.male.46",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028d.anesthesia.a-validated-not-impression.female.68",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028d.anesthesia.a-validated-not-impression.male.68",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, is being assessed before major surgery. The partner reports loud snoring and breathing pauses. The patient reports little daytime sleepiness. The assessment contains two reports: STOP-Bang is flagged by the reporting service, while Epworth is within that service's reference range. No diagnostic sleep study has been performed.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative sleep assessment",
    "previousChiefComplaint": "Preoperative sleep assessment",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
        "chiefComplaint": "Preoperative sleep assessment"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
        "chiefComplaint": "Preoperative sleep assessment"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
        "chiefComplaint": "Preoperative sleep assessment"
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
        "chiefComplaint": "Preoperative sleep assessment"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Determine which reported domain addresses the breathing-risk question despite low sleepiness. Then: Use that information in current perioperative assessment rather than making another sleepiness screen or diagnostic confirmation a communication prerequisite.",
    "reviewerNotes": "Offline application of the recorded SASM screening/communication claim and instrument-domain inference. No scoring item, numerical cutoff, delay-of-surgery rule or specific postoperative monitoring protocol is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf3.20261104.f13.d1": "choice.qf2.20261104.f13.d1",
      "choice.qf3.20261104.f13.d2": "choice.qf2.20261104.f13.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf3.20261104.f13.d1": null,
      "choice.qf3.20261104.f13.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f13.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f13.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.overnight_protocol"
      }
    },
    "question": {
      "id": "question.preoperative-osa.validated-risk-screening.v4.r4",
      "conceptId": "concept.osa.discordant-screen-documentation.v2",
      "stem": "Which request should accompany {patientName}'s anaesthetic referral now?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Send the apnoea-probability result for planning",
          "isCorrect": true,
          "rationale": "The different domains do not cancel each other. The current probability assessment and witnessed breathing history should inform anaesthetic planning even before diagnostic confirmation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f13.d1",
          "label": "Repeat daytime-sleepiness assessment before planning precautions",
          "isCorrect": false,
          "distractorRationale": "A second sleepiness measure does not resolve the apnoea-risk question. Its reassuring result is the credible but inappropriate basis for delaying risk communication."
        },
        {
          "id": "choice.qf3.20261104.f13.d2",
          "label": "Obtain diagnostic polysomnography before planning precautions",
          "isCorrect": false,
          "distractorRationale": "A diagnostic study can resolve the diagnosis, but making it a prerequisite for communicating and assessing current perioperative risk confuses the purposes of screening and confirmation."
        }
      ],
      "explanation": "The reports address sleepiness and apnoea probability, which can disagree. A reassuring sleepiness result does not cancel the reported breathing pauses or the probability assessment. Send the current apnoea-risk information for perioperative planning while distinguishing it from a confirmed diagnosis. This communication decision does not determine whether surgery must be delayed or prescribe a precaution regimen.",
      "teachingPoint": "The reports address sleepiness and apnoea probability, which can disagree. A reassuring sleepiness result does not cancel the reported breathing pauses or the probability assessment. Send the current apnoea-risk information for perioperative planning while distinguishing it from a confirmed diagnosis. This communication decision does not determine whether surgery must be delayed or prescribe a precaution regimen.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation",
        "claim.qf3.osa-risk-communication-sequence"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.osa.discordant-screen-documentation.v1",
      "nextConceptId": "concept.osa.discordant-screen-documentation.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored task changes from choosing a certainty label to an assessment/communication sequence; retain the documentation construct and original screening-method history."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.preoperative-osa.validated-risk-screening.v4.r3",
      "whatChanged": "Removed confirmed/suspected/unlikely label options and the cautious-middle shortcut. All choices specify a concrete assessment request and an explicit sequence; none claims a diagnosis or a mandatory operative delay.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "e1e6012e-485e-4225-8346-b02827868703"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed confirmed/suspected/unlikely label options and the cautious-middle shortcut. All choices specify a concrete assessment request and an explicit sequence; none claims a diagnosis or a mandatory operative delay.",
      "sourceDecision": "Offline application of the recorded SASM screening/communication claim and instrument-domain inference. No scoring item, numerical cutoff, delay-of-surgery rule or specific postoperative monitoring protocol is invented.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f15",
    "auditId": "F15",
    "caseId": "case.gs028e.mis-principles.c2-early-central-filling",
    "nodeId": "node.gs028e.mis-principles.c2-early-central-filling.1",
    "previousQuestionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r3",
    "questionVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which paired interpretation best fits {patientName}'s later observations?",
    "previousChoiceLabels": [
      "Positional venous pooling and CO2-related respiratory acidemia",
      "Pressure-related caval compression and CO2-related respiratory acidemia",
      "Positional venous pooling and fixed-acid metabolic acidemia",
      "Pressure-related caval compression and fixed-acid metabolic acidemia"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews a completed laparoscopic record before another operation. The team recorded a head-up tilt and a subsequent return to flat, with insufflation pressure, delivered minute ventilation and PEEP unchanged. The laboratory reference intervals accompany the arterial-gas reports.",
    "previousPresentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.44",
        "presentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.44",
        "presentation": "{patientName}, a 44-year-old man, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.female.70",
        "presentation": "{patientName}, a 70-year-old woman, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings."
      },
      {
        "id": "profile.gs028e.mis-principles.c2-early-central-filling.male.70",
        "presentation": "{patientName}, a 70-year-old man, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028e.mis-principles.c2-early-central-filling",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c2-early-central-filling",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Operation record review",
        "revisedPresentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-early-central-filling.female.44",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.female.44",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old woman, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-early-central-filling.male.44",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.male.44",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old man, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-early-central-filling.female.70",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.female.70",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old woman, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028e.mis-principles.c2-early-central-filling.male.70",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c2-early-central-filling.male.70",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 70-year-old man, reviews a completed laparoscopic operation. Initial insufflation while flat was followed by larger left-ventricular end-diastolic volume and stroke volume. The following sequence was then recorded, with the insufflation pressure and minute ventilation held at the same settings.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
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
    "intendedInference": "Attribute the reversible filling change using the controlled position sequence. Then: Use the initial and later reference-interval relationships to distinguish a falling pH from demonstrated acidemia.",
    "reviewerNotes": "No invented numerical gas or cutoff. The new claim is a bounded definition/record-interpretation inference with the existing blood-gas and CO2 claims as its basis. This is an integrated physiology interpretation, not two sequential treatment decisions or proof of a single CO2 source.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qf3.20261104.f15.d1": "choice.qf2.20261104.f15.d1",
      "choice.qf3.20261104.f15.d2": "choice.qf2.20261104.f15.d2",
      "choice.qf3.20261104.f15.d3": "choice.qf2.20261104.f15.d3"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qf3.20261104.f15.d1": null,
      "choice.qf3.20261104.f15.d2": null,
      "choice.qf3.20261104.f15.d3": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f15.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f15.d2": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f15.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.pneumoperitoneum.context-dependent-venous-return.v2.r4",
      "conceptId": "concept.laparoscopy.position-gas-integration.v2",
      "stem": "Which paired conclusion should be carried into {patientName}'s anaesthetic review?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Position-associated reduction in filling; acidemia not demonstrated",
          "isCorrect": true,
          "rationale": "The filling change reverses with position at fixed pressure. The CO2/pH directions are compatible with an acidifying change, but the later pH is within the laboratory interval, not acidemic.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f15.d1",
          "label": "Position-associated reduction in filling; respiratory acidemia demonstrated",
          "isCorrect": false,
          "distractorRationale": "The filling interpretation fits, but a lower pH that remains within the laboratory interval does not establish acidemia."
        },
        {
          "id": "choice.qf3.20261104.f15.d2",
          "label": "Pressure-associated reduction in filling; acidemia not demonstrated",
          "isCorrect": false,
          "distractorRationale": "The gas conclusion fits. Assigning the reversible change to a pressure increase is not supported when pressure stays fixed and position is reversed."
        },
        {
          "id": "choice.qf3.20261104.f15.d3",
          "label": "Pressure-associated reduction in filling; respiratory acidemia demonstrated",
          "isCorrect": false,
          "distractorRationale": "This pair overstates both the pressure attribution and the absolute gas conclusion. Neither follows from the supplied sequence."
        }
      ],
      "explanation": "The smaller filling and stroke volumes reverse on returning flat at unchanged pressure, supporting a positional contribution. CO2 rises and pH falls, but both later measurements lie within their laboratory intervals. That direction of change does not establish acidemia. The earlier low-CO2/high-pH state matters: describing a change as acidifying is different from diagnosing a later acidemic state. These controlled observations do not prescribe a ventilator or fluid adjustment.",
      "teachingPoint": "The smaller filling and stroke volumes reverse on returning flat at unchanged pressure, supporting a positional contribution. CO2 rises and pH falls, but both later measurements lie within their laboratory intervals. That direction of change does not establish acidemia. The earlier low-CO2/high-pH state matters: describing a change as acidifying is different from diagnosing a later acidemic state. These controlled observations do not prescribe a ventilator or fluid adjustment.",
      "exhibit": {
        "kind": "table",
        "caption": "Position and arterial-gas observations",
        "columnHeaders": [
          "Before tilt",
          "During head-up tilt",
          "After returning flat"
        ],
        "rowHeaders": [
          "Left-ventricular end-diastolic volume and stroke volume",
          "Arterial CO2 relative to laboratory interval",
          "Arterial pH relative to laboratory interval",
          "Bicarbonate"
        ],
        "cells": [
          [
            "Reference observations",
            "Both smaller",
            "Both return toward pre-tilt observations"
          ],
          [
            "Below the lower limit",
            "Within the interval",
            "Within the interval"
          ],
          [
            "Above the upper limit",
            "Within the interval",
            "Within the interval"
          ],
          [
            "Within the interval",
            "Similar to pre-tilt value",
            "Similar to pre-tilt value"
          ]
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.pressure-position-context",
        "claim.gs028e.laparoscopy.caval-compression-venous-return",
        "claim.qf2.qualitative-co2-acid-base-pattern",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qf3.direction-versus-acidemia"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.laparoscopy.position-gas-integration.v1",
      "nextConceptId": "concept.laparoscopy.position-gas-integration.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior gas objective wrongly asserted acidemia from relative changes. This version instead scores recognition that a fall toward the reference interval is not demonstrated acidemia; retain the original histories and record the corrected construct explicitly."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.pneumoperitoneum.context-dependent-venous-return.v2.r3",
      "whatChanged": "Corrected the invalid premise with actual reference-interval relationships, and removed acidemia assertions from the appropriate two options. Removed unnecessary early insufflation chronology; preserved pressure/ventilation controls. The paired conclusions are frequency-balanced.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "08932b5d-1368-4f60-8928-58561c8ddaa4"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Corrected the invalid premise with actual reference-interval relationships, and removed acidemia assertions from the appropriate two options. Removed unnecessary early insufflation chronology; preserved pressure/ventilation controls. The paired conclusions are frequency-balanced.",
      "sourceDecision": "No invented numerical gas or cutoff. The new claim is a bounded definition/record-interpretation inference with the existing blood-gas and CO2 claims as its basis. This is an integrated physiology interpretation, not two sequential treatment decisions or proof of a single CO2 source.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f16",
    "auditId": "F16",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which repeat sampling request should be made before {patientName}'s operative plan is finalized?",
    "previousChoiceLabels": [
      "Node aspiration for cytology and thyroglobulin measurement",
      "Node aspiration for cytology and flow-cytometric assessment",
      "Node aspiration for cytology and microbiological culture"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
    "previousPresentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
        "presentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
        "presentation": "{patientName}, a 43-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
        "presentation": "{patientName}, a 68-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
        "presentation": "{patientName}, a 68-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
        "patientPresentationVariantId": "presentation.gs028b.differentiated-thyroid-cancer.a-completed-negative",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Thyroid surgical planning",
        "revisedPresentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, attends clinic after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. Its earlier aspirate contains macrophages and proteinaceous fluid, without lesional epithelial cells.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Thyroid surgical planning",
    "previousChiefComplaint": "Thyroid surgical planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
        "chiefComplaint": "Thyroid surgical planning"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
        "chiefComplaint": "Thyroid surgical planning"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
        "chiefComplaint": "Thyroid surgical planning"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
        "chiefComplaint": "Thyroid surgical planning"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret cytology and washout in relation to the sampled node and needle path. Then: Resolve the discordance before using either line to choose dissection or surveillance.",
    "reviewerNotes": "The existing current ATA-linked claim expressly notes washout limitations with an intact thyroid. The new path/provenance inference requires endocrine/clinical source-alignment review. No detectable-equals-positive threshold, universal washout cutoff or required dissection extent is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf3.20261104.f16.d1": "choice.qf2.20261104.f16.d1",
      "choice.qf3.20261104.f16.d2": "choice.qf2.20261104.f16.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf3.20261104.f16.d1": null,
      "choice.qf3.20261104.f16.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f16.d1": {
        "kind": "no_test"
      },
      "choice.qf3.20261104.f16.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r4",
      "conceptId": "concept.dtc.cystic-node-repeat-sampling.v2",
      "stem": "Which plan should be arranged before {patientName}'s lateral-neck operation is booked?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Resample the neck node by an extrathyroidal route",
          "isCorrect": true,
          "rationale": "The tissue and washout findings do not provide a secure concordant nodal diagnosis. An intact-thyroid needle path limits interpretation of detectable washout thyroglobulin; repeat targeted sampling with cytology and selected washout can clarify the node before committing to a lateral-neck operation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f16.d1",
          "label": "Book ipsilateral lateral-compartment neck dissection",
          "isCorrect": false,
          "distractorRationale": "Thyroglobulin is a useful adjunct, but detectability after this needle path is not equivalent to an independently established nodal metastasis."
        },
        {
          "id": "choice.qf3.20261104.f16.d2",
          "label": "Book thyroidectomy and nodal ultrasound surveillance",
          "isCorrect": false,
          "distractorRationale": "A reassuring cytology phrase does not resolve the suspicious node and the discordant ancillary result. Carrying the uncertainty into surveillance can change the surgical plan without establishing nodal status."
        }
      ],
      "explanation": "The nodal morphology and the mixed specimen results require reconciliation. Detectable washout thyroglobulin is not an unqualified positive criterion with an intact thyroid, particularly after a trans-thyroid needle path. Repeat representative sampling by an appropriate route, with cytology and selected washout interpretation, can clarify nodal status before a lateral-neck operation is chosen. Neither one reassuring cytology line nor marker detectability settles the discordance.",
      "teachingPoint": "The nodal morphology and the mixed specimen results require reconciliation. Detectable washout thyroglobulin is not an unqualified positive criterion with an intact thyroid, particularly after a trans-thyroid needle path. Repeat representative sampling by an appropriate route, with cytology and selected washout interpretation, can clarify nodal status before a lateral-neck operation is chosen. Neither one reassuring cytology line nor marker detectability settles the discordance.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.dtc.extent",
        "claim.qq20261102c.thyroid-cystic-node-discordance",
        "claim.qf3.thyroid-washout-provenance"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dtc.cystic-node-repeat-sampling.v1",
      "nextConceptId": "concept.dtc.cystic-node-repeat-sampling.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The previous objective selects a familiar washout adjunct. The replacement scores interpretation of completed discordant results and their effect on a neck-operation decision."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r3",
      "whatChanged": "Removed the task that preselected repeat sampling and the culture/flow-cytometry foils. All alternatives are thyroid-node workup plans; completed discordant results now affect whether definitive neck surgery can be selected.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "2029401b-c009-4286-8ce9-bb9b14ebd2c9",
        "93ea4af9-06cb-4faa-928b-3859d047f6c4"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the task that preselected repeat sampling and the culture/flow-cytometry foils. All alternatives are thyroid-node workup plans; completed discordant results now affect whether definitive neck surgery can be selected.",
      "sourceDecision": "The existing current ATA-linked claim expressly notes washout limitations with an intact thyroid. The new path/provenance inference requires endocrine/clinical source-alignment review. No detectable-equals-positive threshold, universal washout cutoff or required dissection extent is invented.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qf3.20261104.f17",
    "auditId": "F17",
    "caseId": "case.gs028c.palpable-breast.b-surgeon-discordance",
    "nodeId": "node.gs028c.palpable-breast.b-surgeon-discordance.1",
    "previousQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v12"
    ],
    "previousStem": "Which next diagnostic plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Arrange examination-guided tissue sampling",
      "Arrange contrast-enhanced breast MRI",
      "Arrange interval breast examination and imaging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns with a persistent discrete breast lump at the same marked site used for an outside core biopsy. Raising the arm draws the overlying skin inward, as documented before the biopsy. The lump is palpable beneath the superficial biopsy tract. The outside slides contain mature fat and scant normal breast tissue. Archived needle images place the sampling notch and clip in the superficial fat plane, while the examination diagram places the lump beneath that plane. At the clinical marker, current diagnostic mammography shows no corresponding density, distortion or calcification; targeted ultrasound shows the superficial clip but no solid or cystic correlate for the palpable lump.",
    "previousPresentation": "{patientName}, a 50-year-old woman, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
        "presentation": "{patientName}, a 50-year-old woman, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate."
      },
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
        "presentation": "{patientName}, a 64-year-old woman, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf2.20261104.case.gs028c.palpable-breast.b-surgeon-discordance",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-surgeon-discordance",
        "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Breast lump review",
        "revisedPresentation": "{patientName}, a 50-year-old woman, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf2.20261104.profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 50-year-old woman, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf2.20261104.profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
            "contentVersion": "presentation-revision.question-flags-round2.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, returns with the firm irregular 4-o'clock breast finding recorded at the earlier visit. The prior biopsy diagram marks an ultrasound lesion at 2 o'clock in the same breast; that specimen contains fibroadenoma without atypia. At the 4-o'clock marker, diagnostic mammography shows no corresponding density, distortion or calcification, and targeted ultrasound shows no solid or cystic correlate.",
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
      "idPrefix": "ppr.qf3.20261104.",
      "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Breast lump review",
    "previousChiefComplaint": "Breast lump review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.50",
        "chiefComplaint": "Breast lump review"
      },
      {
        "id": "profile.gs028c.palpable-breast.b-surgeon-discordance.female.64",
        "chiefComplaint": "Breast lump review"
      }
    ],
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Reconcile the same skin-site label with needle-notch depth, clip depth and actual specimen. Then: Choose sampling of the clinical lump rather than using a visible clip as a substitute target.",
    "reviewerNotes": "Existing ACR biopsy and EUSOBI/ASBrS discordance claims support representative tissue assessment. The new depth inference is a draft application, not a universal claim that all clips locate incorrectly or that every clinically benign lump needs biopsy.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qf3.20261104.f17.d1": "choice.qf2.20261104.f17.d1",
      "choice.qf3.20261104.f17.d2": "choice.qf2.20261104.f17.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qf3.20261104.f17.d1": null,
      "choice.qf3.20261104.f17.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f17.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qf3.20261104.f17.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "question": {
      "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r4",
      "conceptId": "concept.palpable-mass.separate-benign-target.v1",
      "stem": "Which next diagnostic plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Repeat tissue sampling under palpation guidance",
          "isCorrect": true,
          "rationale": "The site label is the same, but the depth and specimen do not establish representative sampling of the persistent clinical target. With no imaging correlate for that lump, palpation-directed sampling addresses it.",
          "distractorRationale": null
        },
        {
          "id": "choice.qf3.20261104.f17.d1",
          "label": "Repeat tissue sampling under ultrasound guidance",
          "isCorrect": false,
          "distractorRationale": "The visible clip is a tempting reproducible target. Its superficial location and the old needle notch do not establish that it marks the clinical lump."
        },
        {
          "id": "choice.qf3.20261104.f17.d2",
          "label": "Obtain breast MRI before repeat tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Additional imaging may be useful in selected assessments, but it is not an established prerequisite for representative tissue assessment of the persistent, unsampled clinical target in this record."
        }
      ],
      "explanation": "A matching skin-site label does not establish representative sampling at the correct depth. The specimen, notch and clip relate to superficial fat, while the persistent clinical lump lies beneath that plane. Current imaging identifies the clip but no target corresponding to the lump. Arrange representative tissue assessment directed by examination; repeating the visible clip target would not resolve that localization problem. Technique remains subject to specialist assessment.",
      "teachingPoint": "A matching skin-site label does not establish representative sampling at the correct depth. The specimen, notch and clip relate to superficial fat, while the persistent clinical lump lies beneath that plane. Current imaging identifies the clip but no target corresponding to the lump. Arrange representative tissue assessment directed by examination; repeating the visible clip target would not resolve that localization problem. Technique remains subject to specialist assessment.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qq20261102c.breast-core-target-discordance",
        "claim.qf3.breast-sample-depth-provenance"
      ],
      "contentVersion": "question-authoring.2026-11-04.v13",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-mass.separate-benign-target.v1",
      "nextConceptId": "concept.palpable-mass.separate-benign-target.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective remains representative assessment after benign/nonrepresentative sampling of a different target. The site discrepancy is now depth at one skin site rather than a trivial different clock position."
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-04",
      "beforeVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4.r3",
      "whatChanged": "Removed the different-clock-position and classic firm-irregular shortcuts. The competing ultrasound-guided repeat is now attractive because the clip is visible; the key depends on interpreting specimen depth and current absence of a correlate for the actual lump.",
      "status": "awaiting_independent_re_review"
    },
    "flagReview": {
      "flagIds": [
        "34e373b5-3d0a-45d5-af18-4bd472fee3d1"
      ],
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the different-clock-position and classic firm-irregular shortcuts. The competing ultrasound-guided repeat is now attractive because the clip is visible; the key depends on interpreting specimen depth and current absence of a correlate for the actual lump.",
      "sourceDecision": "Existing ACR biopsy and EUSOBI/ASBrS discordance claims support representative tissue assessment. The new depth inference is a draft application, not a universal claim that all clips locate incorrectly or that every clinically benign lump needs biopsy.",
      "status": "awaiting_independent_and_clinician_review"
    }
  }
];

export const QUESTION_FLAG_ROUND3_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
    "displayName": "Apply leak anatomy to postcholecystectomy treatment",
    "learningObjective": "Interpret duct continuity and adequacy of drainage, then select a procedure for persistent minor leakage.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
    "versioningReason": "The scored decision changes from selecting localization imaging to treating a demonstrated minor leak. Retain the imaging construct and all earlier anatomy versions.",
    "revisedItemIds": [
      "F02"
    ],
    "evidenceClaimIds": [
      "claim.early.bile-leak.ce-mrcp-anatomic-localization",
      "claim.early.bile-leak.minor-leak-ercp-stent"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.varicose-veins.reflux-after-compression-study.v2",
    "displayName": "Select the scope of a recurrent venous reflux map",
    "learningObjective": "Use recurrent anatomical distributions and an incomplete prior reflux record to specify the mapping needed before another intervention.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.varicose-veins.reflux-after-compression-study.v1",
    "versioningReason": "The scored distinction is completeness of a recurrent reflux map rather than reflux versus a completed DVT compression protocol.",
    "revisedItemIds": [
      "F03"
    ],
    "evidenceClaimIds": [
      "claim.varicose.reflux-duplex",
      "claim.varicose.intervention-referral",
      "claim.qf3.recurrent-vein-map-scope"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.hyperacute-rejection.archived-crossmatch-provenance.v1",
    "displayName": "Select an archived test for preformed donor reactivity",
    "learningObjective": "Use sample collection time and cellular target to choose a retrospective test of a preimplantation immune mechanism.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
    "versioningReason": "This task scores investigation design and temporal evidence, rather than naming the preformed-antibody mechanism from explicit immunoglobulin/complement stains.",
    "revisedItemIds": [
      "F06"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.gs028e.t_cell_graft_comparison",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.cirrhosis.new-fluid-elective-plan.v2",
    "displayName": "Recognize an urgent change during cirrhosis optimization",
    "learningObjective": "Interpret new obstructive hernia findings and distinguish emergency assessment from the earlier elective optimization sequence.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cirrhosis.new-fluid-elective-plan.v1",
    "versioningReason": "The scored action changes from deferring a nonurgent repair for ascites control to urgent assessment of a new obstructive presentation. Preserve the elective-risk concept and histories.",
    "revisedItemIds": [
      "F07"
    ],
    "evidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation",
      "claim.qf3.cirrhosis-urgent-hernia-boundary"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.lymphangitis.distal-source-imaging.v2",
    "displayName": "Interpret a focal collection within a lymphangitic presentation",
    "learningObjective": "Distinguish a superficial collection from nearby veins on ultrasound and apply the source-control consequence despite a coexisting ascending inflammatory pattern.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.lymphangitis.distal-source-imaging.v1",
    "versioningReason": "The scored choice changes from imaging a source to treating an imaged focal collection. Retain the source-imaging and syndrome-recognition constructs.",
    "revisedItemIds": [
      "F08"
    ],
    "evidenceClaimIds": [
      "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "claim.bread-butter.skin-infection.equivocal-ultrasound",
      "claim.bread-butter.cutaneous-abscess.incision-drainage",
      "claim.bread-butter.cutaneous-abscess.antibiotic-nuance",
      "claim.qf3.soft-tissue-ultrasound-application"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.osa.discordant-screen-documentation.v2",
    "displayName": "Use discordant sleep reports in perioperative communication",
    "learningObjective": "Distinguish sleepiness from apnoea-probability information and decide what should drive current anaesthetic risk communication without requiring diagnostic confirmation.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.osa.discordant-screen-documentation.v1",
    "versioningReason": "The scored task changes from choosing a certainty label to an assessment/communication sequence; retain the documentation construct and original screening-method history.",
    "revisedItemIds": [
      "F13"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.osa.validated-screen",
      "claim.qf2.sleep-questionnaire-domain-interpretation",
      "claim.qf3.osa-risk-communication-sequence"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.laparoscopy.position-gas-integration.v2",
    "displayName": "Separate gas direction from demonstrated acidemia",
    "learningObjective": "Interpret a controlled positional filling response and distinguish an acidifying gas change from an acidemic state using laboratory intervals.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.laparoscopy.position-gas-integration.v1",
    "versioningReason": "The prior gas objective wrongly asserted acidemia from relative changes. This version instead scores recognition that a fall toward the reference interval is not demonstrated acidemia; retain the original histories and record the corrected construct explicitly.",
    "revisedItemIds": [
      "F15"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.laparoscopy.pressure-position-context",
      "claim.gs028e.laparoscopy.caval-compression-venous-return",
      "claim.qf2.qualitative-co2-acid-base-pattern",
      "claim.gs028d.acidosis.blood-gas",
      "claim.qf3.direction-versus-acidemia"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.dtc.cystic-node-repeat-sampling.v2",
    "displayName": "Resolve thyroid-node specimen discordance",
    "learningObjective": "Use specimen adequacy and an intact-thyroid needle path to interpret discordant node results before selecting lateral-neck surgery or surveillance.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.dtc.cystic-node-repeat-sampling.v1",
    "versioningReason": "The previous objective selects a familiar washout adjunct. The replacement scores interpretation of completed discordant results and their effect on a neck-operation decision.",
    "revisedItemIds": [
      "F16"
    ],
    "evidenceClaimIds": [
      "claim.dtc.preop-ultrasound",
      "claim.dtc.extent",
      "claim.qq20261102c.thyroid-cystic-node-discordance",
      "claim.qf3.thyroid-washout-provenance"
    ],
    "contentVersion": "concept.question-flags-round3.2026-11-04.v1",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  }
];
