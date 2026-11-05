import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Additive unapproved drafts; historical and independently reviewed versions remain retained. */
export const QUESTION_BANK_BATCH2B_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.qbp2b.20261104.b2b01",
    "auditId": "B2B01",
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "previousQuestionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which procedure should be requested next for {patientName}?",
    "previousChoiceLabels": [
      "Endoscopic transpapillary plastic-stent placement",
      "Percutaneous exchange for a larger drainage catheter",
      "Operative reconstruction with a hepaticojejunostomy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish a persistent side leak with main-duct continuity from complete duct disruption or obstruction. Then: Select an internal diversion strategy rather than another drainage access or papillary intervention.",
    "reviewerNotes": "Existing WSES/ESGE records support minor-leak stenting. Exact comparative endoscopic ranking requires hepatobiliary/source-alignment review; no output-volume or intervention-time cutoff is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b01.d1": "choice.qf3.20261104.f02.d1",
      "choice.qbp2b.20261104.b2b01.d2": "choice.qf3.20261104.f02.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b01.d1": null,
      "choice.qbp2b.20261104.b2b01.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.therapeutic_ercp"
      },
      "choice.qbp2b.20261104.b2b01.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.therapeutic_ercp"
      },
      "choice.qbp2b.20261104.b2b01.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "stem": "Which intervention should the hepatobiliary team discuss for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "ERCP with transpapillary plastic stenting",
          "isCorrect": true,
          "rationale": "Ongoing stump leakage with a continuous draining main duct supports internal diversion using a plastic stent. The anatomy, not the earlier shoulder symptom, determines the present plan.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b01.d1",
          "label": "ERCP with biliary sphincterotomy",
          "isCorrect": false,
          "distractorRationale": "Sphincterotomy can be part of selected biliary therapy, but treating a demonstrated postoperative leak by papillary division without a bridging/diversion stent is the less favored offered strategy. This is a close endoscopic alternative, not a claim that sphincterotomy is never appropriate."
        },
        {
          "id": "choice.qbp2b.20261104.b2b01.d2",
          "label": "Percutaneous transhepatic biliary drainage",
          "isCorrect": false,
          "distractorRationale": "This can divert bile when an endoscopic route or duct continuity is unsuitable; the current study demonstrates continuity to the duodenum and a minor side leak."
        }
      ],
      "explanation": "Ongoing stump leakage with a continuous draining main duct supports internal diversion using a plastic stent. The anatomy, not the earlier shoulder symptom, determines the present plan. Sphincterotomy can be part of selected biliary therapy, but treating a demonstrated postoperative leak by papillary division without a bridging/diversion stent is the less favored offered strategy. This is a close endoscopic alternative, not a claim that sphincterotomy is never appropriate. This can divert bile when an endoscopic route or duct continuity is unsuitable; the current study demonstrates continuity to the duodenum and a minor side leak.",
      "teachingPoint": "Ongoing stump leakage with a continuous draining main duct supports internal diversion using a plastic stent. The anatomy, not the earlier shoulder symptom, determines the present plan.",
      "supportingEvidenceClaimIds": [
        "claim.early.bile-leak.ce-mrcp-anatomic-localization",
        "claim.early.bile-leak.minor-leak-ercp-stent",
        "claim.qbp2b.b2b01.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Hospital imaging observations",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "CT after drainage",
          "Hepatobiliary-contrast MR series",
          "Distal duct"
        ],
        "cells": [
          [
            "The collection has contracted around the drain."
          ],
          [
            "Contrast enters both hepatic ducts, crosses the common hepatic and common bile ducts, and also enters the drained cavity at the cystic-duct stump."
          ],
          [
            "Contrast reaches the duodenum; no filling defect or focal narrowing is demonstrated."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "nextConceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same currently drafted leak-procedure objective; the manager-kept live phrenic-referred-pain version has a different objective and remains retained. This is a replacement application, not a claim to repair the original anatomy construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "F02",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces distant larger-drain/reconstruction foils with neighboring bile-diversion procedures. Retains the warning trajectory and duct observations rather than a remote-nerve quiz.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
    "previousPresentation": "{patientName}, a 42-year-old woman, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "presentation": "{patientName}, a 42-year-old woman, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "presentation": "{patientName}, a 42-year-old man, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "presentation": "{patientName}, a 68-year-old woman, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "presentation": "{patientName}, a 68-year-old man, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf3.20261104.case.gs028e.mis-principles.c3-phrenic-pathway",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c3-phrenic-pathway",
        "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
        "revisedChiefComplaint": "Postoperative drainage review",
        "revisedPresentation": "{patientName}, a 42-year-old woman, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf3.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old woman, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old man, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, brings the hepatobiliary team's records after laparoscopic cholecystectomy. A subhepatic collection was drained. CT after drainage shows the cavity collapsed around the catheter, without another collection. The patient is afebrile, with a soft abdomen and stable circulation, but bile continues to drain. Hepatobiliary-contrast MR images show contrast passing along the common hepatic and common bile ducts into the duodenum, with a small stream from the cystic-duct stump into the drained cavity.",
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative drainage review",
    "previousChiefComplaint": "Postoperative drainage review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "chiefComplaint": "Postoperative drainage review"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "chiefComplaint": "Postoperative drainage review"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "chiefComplaint": "Postoperative drainage review"
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "chiefComplaint": "Postoperative drainage review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b02",
    "auditId": "B2B02",
    "caseId": "case.gs028e.immunology.c3-historical-kidney-event",
    "nodeId": "node.gs028e.immunology.c3-historical-kidney-event.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r4",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which archived crossmatch record is most informative for interpreting {patientName}'s graft failure?",
    "previousChoiceLabels": [
      "Preimplantation recipient serum against donor cells",
      "Postfailure recipient serum against donor cells",
      "Preimplantation recipient serum against recipient cells",
      "Postfailure recipient serum against recipient cells"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret patent major vessels, endothelial deposits and microthrombi as a small-vessel immune pattern rather than a purely mechanical/tubular account. Then: Use actual donor/control and pre-event results to direct compatibility review instead of inferring new sensitization from the postfailure specimen.",
    "reviewerNotes": "No Banff criterion, assay performance, immunosuppressive treatment or exact graft-failure timing rule is authored. The causal review is an application of existing recorded mechanism claims.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.20261104.b2b02.d1": "choice.qf3.20261104.f06.d1",
      "choice.qbp2b.20261104.b2b02.d2": "choice.qf3.20261104.f06.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.20261104.b2b02.d1": null,
      "choice.qbp2b.20261104.b2b02.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b02.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b02.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r5",
      "conceptId": "concept.hyperacute-rejection.event-and-compatibility-review.v1",
      "stem": "Which transplant-review plan fits {patientName}'s combined records?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Review compatibility testing for antibody-mediated injury",
          "isCorrect": true,
          "rationale": "The microvascular immune deposits and pre-event donor-target reactivity support a pre-existing antibody pathway. Reviewing compatibility testing follows from the combination; a positive postfailure sample by itself would not establish timing.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b02.d1",
          "label": "Review cellular immunosuppression for T-cell-mediated injury",
          "isCorrect": false,
          "distractorRationale": "Cellular rejection is a real alternative after transplantation, but it does not best integrate endothelial antibody/complement deposition with donor reactivity already present before implantation."
        },
        {
          "id": "choice.qbp2b.20261104.b2b02.d2",
          "label": "Review preservation and perfusion for ischemic tubular injury",
          "isCorrect": false,
          "distractorRationale": "Early graft dysfunction commonly raises preservation/perfusion concerns. Patent large vessels do not exclude every ischemic contribution, but the immune deposits and pre-event target pattern direct this review elsewhere."
        }
      ],
      "explanation": "The microvascular immune deposits and pre-event donor-target reactivity support a pre-existing antibody pathway. Reviewing compatibility testing follows from the combination; a positive postfailure sample by itself would not establish timing. Cellular rejection is a real alternative after transplantation, but it does not best integrate endothelial antibody/complement deposition with donor reactivity already present before implantation. Early graft dysfunction commonly raises preservation/perfusion concerns. Patent large vessels do not exclude every ischemic contribution, but the immune deposits and pre-event target pattern direct this review elsewhere.",
      "teachingPoint": "The microvascular immune deposits and pre-event donor-target reactivity support a pre-existing antibody pathway. Reviewing compatibility testing follows from the combination; a positive postfailure sample by itself would not establish timing.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.gs028e.t_cell_graft_comparison",
        "claim.qf3.preimplantation-specimen-inference",
        "claim.qbp2b.b2b02.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Archived laboratory results; binding is reported by the same laboratory method",
        "columnHeaders": [
          "Donor-cell target",
          "Recipient-cell control"
        ],
        "rowHeaders": [
          "Recipient serum drawn before implantation",
          "Recipient serum drawn after graft failure"
        ],
        "cells": [
          [
            "Binding detected",
            "Binding not detected"
          ],
          [
            "Binding detected",
            "Binding not detected"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperacute-rejection.archived-crossmatch-provenance.v1",
      "nextConceptId": "concept.hyperacute-rejection.event-and-compatibility-review.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes crossmatch-design recall into interpretation of results and the consequence for a mechanism-directed case review; retain the old crossmatch and rejection concepts."
    },
    "ownerProgramReview": {
      "ownerItemId": "F06",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Actual balanced donor/control results replace choosing a conventional crossmatch specimen. All options name a concrete record-review target; no rejection diagnosis is supplied before the answer.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
    "previousPresentation": "{patientName}, a 41-year-old woman, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
        "presentation": "{patientName}, a 41-year-old woman, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
        "presentation": "{patientName}, a 41-year-old man, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
        "presentation": "{patientName}, a 64-year-old woman, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
        "presentation": "{patientName}, a 64-year-old man, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf3.20261104.case.gs028e.immunology.c3-historical-kidney-event",
        "patientPresentationVariantId": "presentation.gs028e.immunology.c3-historical-kidney-event",
        "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
        "revisedChiefComplaint": "Transplant record review",
        "revisedPresentation": "{patientName}, a 41-year-old woman, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf3.20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old woman, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old man, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old man, brings a failed kidney-graft record. After reperfusion the graft became mottled and stopped making urine. The major vessels remained patent; biopsy showed small-vessel thrombi and endothelial injury. The hospital laboratory's stored records contain completed crossmatch panels using recipient serum collected just before implantation and after graft failure. Each panel includes donor-cell and recipient-cell targets.",
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
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
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b03",
    "auditId": "B2B03",
    "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r4",
    "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which hospital plan should be arranged now for {patientName}?",
    "previousChoiceLabels": [
      "Urgent surgical assessment with resuscitation",
      "Ascites drainage followed by reconsideration of repair",
      "Coagulation correction followed by reconsideration of repair"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Infer a trapped bowel segment from the examination and paired transition points, rather than attributing all abdominal enlargement to ascites. Then: Apply the urgent-assessment exception to a previously deferred high-risk elective operation.",
    "reviewerNotes": "Urgent surgical assessment is supported by the retained emergency boundary; the exact operative technique and bowel resection decision are not specified. The CT is a constructed observation, not a new risk threshold.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b03.d1": "choice.qf3.20261104.f07.d1",
      "choice.qbp2b.20261104.b2b03.d2": "choice.qf3.20261104.f07.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b03.d1": null,
      "choice.qbp2b.20261104.b2b03.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b03.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b03.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r5",
      "conceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
      "stem": "Which hospital plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Hernia exploration during resuscitation",
          "isCorrect": true,
          "rationale": "The new irreducible bowel-containing hernia and closed-loop pattern change the prior elective problem. Assessment for bowel compromise cannot wait for routine cirrhosis optimization.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b03.d1",
          "label": "Nasogastric decompression with interval hernia reassessment",
          "isCorrect": false,
          "distractorRationale": "Decompression is useful supportive care and may suit selected other obstruction patterns, but is not a substitute for operative assessment of this trapped segment."
        },
        {
          "id": "choice.qbp2b.20261104.b2b03.d2",
          "label": "Therapeutic paracentesis with interval hernia reassessment",
          "isCorrect": false,
          "distractorRationale": "Ascites treatment helped frame the earlier elective decision. It does not resolve the new transition points and persistent hernia findings."
        }
      ],
      "explanation": "The new irreducible bowel-containing hernia and closed-loop pattern change the prior elective problem. Assessment for bowel compromise cannot wait for routine cirrhosis optimization. Decompression is useful supportive care and may suit selected other obstruction patterns, but is not a substitute for operative assessment of this trapped segment. Ascites treatment helped frame the earlier elective decision. It does not resolve the new transition points and persistent hernia findings.",
      "teachingPoint": "The new irreducible bowel-containing hernia and closed-loop pattern change the prior elective problem. Assessment for bowel compromise cannot wait for routine cirrhosis optimization.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.qf3.cirrhosis-urgent-hernia-boundary",
        "claim.qbp2b.b2b03.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Same-day hospital CT sent with the referral",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Abdominal wall defect",
          "Bowel away from the defect"
        ],
        "cells": [
          [
            "Two adjacent transition points involve the bowel within the tense bulge; mesenteric fluid surrounds that segment."
          ],
          [
            "Upstream loops are distended and downstream loops are collapsed."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
      "nextConceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "F07",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Three named hospital approaches replace correction-before-surgery caricatures; no “alone”, normal-lab clearance or uniquely combined cautious key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
    "previousPresentation": "{patientName}, a 43-year-old woman with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "presentation": "{patientName}, a 43-year-old man with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "presentation": "{patientName}, a 68-year-old man with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf3.20261104.case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
        "revisedChiefComplaint": "Hernia preoperative review",
        "revisedPresentation": "{patientName}, a 43-year-old woman with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf3.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man with cirrhosis, variceal bleeding in the past and recurrent ascites, had elective abdominal-wall hernia repair deferred for fluid management. The patient now has continuous pain at the hernia, repeated vomiting and a tense bulge that no longer reduces. CT shows a bowel loop within the defect, with dilated bowel proximally and collapsed bowel distally. Bilirubin and creatinine remain within reference ranges; INR is above its upper reference limit.",
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Painful hernia review",
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
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b04",
    "auditId": "B2B04",
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "previousQuestionVariantId": "question.lymphangitis.heel-inguinal.v1.r4",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which treatment should be arranged for {patientName}'s focal calf problem?",
    "previousChoiceLabels": [
      "Incision and drainage of the calf lesion",
      "Oral antibiotic treatment of the leg inflammation",
      "Compression treatment of the tender calf veins"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate the responding heel-to-node inflammation from the persistent extravascular subcutaneous cavity. Then: Choose drainage rather than equating improving redness with complete source control or substituting a needle procedure.",
    "reviewerNotes": "No organism, antibiotic drug/dose, cavity-size cutoff or fascial-infection protocol is inferred; skin/vascular review must confirm the offered procedure ranking.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "acute_lymphangitis": "acute_lymphangitis",
      "choice.qbp2b.20261104.b2b04.d1": "choice.qf3.20261104.f08.d1",
      "choice.qbp2b.20261104.b2b04.d2": "choice.qf3.20261104.f08.d2"
    },
    "choiceServiceOverrides": {
      "acute_lymphangitis": null,
      "choice.qbp2b.20261104.b2b04.d1": null,
      "choice.qbp2b.20261104.b2b04.d2": null
    },
    "choiceTimingOverrides": {
      "acute_lymphangitis": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b04.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound_guided_aspiration"
      },
      "choice.qbp2b.20261104.b2b04.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.lymphangitis.heel-inguinal.v1.r5",
      "conceptId": "concept.lymphangitis.distal-source-imaging.v2",
      "stem": "Which additional treatment should be arranged for {patientName}'s focal calf finding?",
      "answerChoices": [
        {
          "id": "acute_lymphangitis",
          "label": "Incision and drainage of the cavity",
          "isCorrect": true,
          "rationale": "The persistent focal problem is a superficial collection, despite improvement in the lymphatic inflammatory streak. Opening and draining it addresses the remaining source.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b04.d1",
          "label": "Ultrasound-guided aspiration of the cavity",
          "isCorrect": false,
          "distractorRationale": "Image-guided aspiration is a plausible less invasive competitor, but a superficial cutaneous pus cavity is usually managed by incision and drainage rather than aspiration as the complete source-control procedure."
        },
        {
          "id": "choice.qbp2b.20261104.b2b04.d2",
          "label": "Change the systemic antibiotic regimen",
          "isCorrect": false,
          "distractorRationale": "Antibiotics address spreading inflammation; improvement there does not establish that the separate cavity has emptied. A regimen change does not supply the needed drainage."
        }
      ],
      "explanation": "The persistent focal problem is a superficial collection, despite improvement in the lymphatic inflammatory streak. Opening and draining it addresses the remaining source. Image-guided aspiration is a plausible less invasive competitor, but a superficial cutaneous pus cavity is usually managed by incision and drainage rather than aspiration as the complete source-control procedure. Antibiotics address spreading inflammation; improvement there does not establish that the separate cavity has emptied. A regimen change does not supply the needed drainage.",
      "teachingPoint": "The persistent focal problem is a superficial collection, despite improvement in the lymphatic inflammatory streak. Opening and draining it addresses the remaining source.",
      "supportingEvidenceClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
        "claim.bread-butter.skin-infection.equivocal-ultrasound",
        "claim.bread-butter.cutaneous-abscess.incision-drainage",
        "claim.bread-butter.cutaneous-abscess.antibiotic-nuance",
        "claim.qf3.soft-tissue-ultrasound-application",
        "claim.qbp2b.b2b04.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Targeted ultrasound observations",
        "columnHeaders": [
          "Focal calf lump",
          "Adjacent superficial vein"
        ],
        "rowHeaders": [
          "Compression",
          "Doppler",
          "Depth"
        ],
        "cells": [
          [
            "Mobile echoes swirl within a cavity during pressure.",
            "The lumen flattens with pressure."
          ],
          [
            "No flow signal in the cavity.",
            "Flow is present in the lumen."
          ],
          [
            "The cavity lies in subcutaneous tissue above the fascia.",
            "The vessel runs beside the cavity."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.lymphangitis.distal-source-imaging.v2",
      "nextConceptId": "concept.lymphangitis.distal-source-imaging.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "F08",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Keeps the lymphangitic pattern as context, adds response-source discordance, and compares actual source-control alternatives rather than a remote anatomical site.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after antibiotics were started for a red streak extending from a heel fissure toward tender groin nodes. The streak is fading, but a focal medial-calf lump still prevents comfortable walking. Varicosities run across the same region.",
    "previousPresentation": "{patientName}, a 38-year-old woman, has a split heel callus, redness extending up the medial leg and tender groin nodes. A tender medial-calf swelling overlies longstanding varicosities. Temperature and circulation are stable. The skin is intact over the calf swelling, which is tender but not visibly draining.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf3.20261104.case.lymphangitis.heel-inguinal",
        "patientPresentationVariantId": "presentation.lymphangitis.heel-inguinal",
        "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
        "revisedChiefComplaint": "Painful leg redness",
        "revisedPresentation": "{patientName}, a 38-year-old woman, has a split heel callus, redness extending up the medial leg and tender groin nodes. A tender medial-calf swelling overlies longstanding varicosities. Temperature and circulation are stable. The skin is intact over the calf swelling, which is tender but not visibly draining.",
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Leg swelling review",
    "previousChiefComplaint": "Painful leg redness",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qbp2b.20261104.b2b06",
    "auditId": "B2B06",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-completed-negative.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r4",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which plan should be arranged before {patientName}'s lateral-neck operation is booked?",
    "previousChoiceLabels": [
      "Resample the neck node by an extrathyroidal route",
      "Book ipsilateral lateral-compartment neck dissection",
      "Book thyroidectomy and nodal ultrasound surveillance"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the earlier central-fluid specimen did not represent the abnormal tissue and that detectable washout after a thyroid-crossing pass is not independently diagnostic. Then: Choose a representative tissue target and the relevant thyroid-directed ancillary test.",
    "reviewerNotes": "The original 12-mm observation is retained, not a new cutoff. Repeat sampling must use an appropriate noncontaminating nodal approach in every option; no washout diagnostic threshold or operative extent is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b06.d1": "choice.qf3.20261104.f16.d1",
      "choice.qbp2b.20261104.b2b06.d2": "choice.qf3.20261104.f16.d2",
      "choice.qbp2b.20261104.b2b06.d3": "choice.qf3.20261104.f16.d1"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b06.d1": null,
      "choice.qbp2b.20261104.b2b06.d2": null,
      "choice.qbp2b.20261104.b2b06.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound_guided_aspiration"
      },
      "choice.qbp2b.20261104.b2b06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound_guided_aspiration"
      },
      "choice.qbp2b.20261104.b2b06.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound_guided_aspiration"
      },
      "choice.qbp2b.20261104.b2b06.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound_guided_aspiration"
      }
    },
    "question": {
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5",
      "conceptId": "concept.dtc.representative-node-target-and-assay.v1",
      "stem": "Which repeat neck-node sampling request should be made for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Peripheral tissue: cytology and thyroglobulin washout",
          "isCorrect": true,
          "rationale": "The sampled fluid did not represent the suspicious tissue. Representative nodal cytology with selected thyroglobulin washout addresses the thyroid-metastasis question; use a nodal approach that avoids thyroid contamination.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b06.d1",
          "label": "Central cyst fluid: cytology and thyroglobulin washout",
          "isCorrect": false,
          "distractorRationale": "Repeating a relevant assay on the same nonrepresentative compartment can reproduce an uninterpretable result rather than resolve the tissue/morphology discordance."
        },
        {
          "id": "choice.qbp2b.20261104.b2b06.d2",
          "label": "Peripheral tissue: cytology and flow cytometry",
          "isCorrect": false,
          "distractorRationale": "This targets tissue, but flow cytometry addresses a different competing lymphoid process; it is not the preferred adjunct for this thyroid-cancer nodal question."
        },
        {
          "id": "choice.qbp2b.20261104.b2b06.d3",
          "label": "Central cyst fluid: cytology and flow cytometry",
          "isCorrect": false,
          "distractorRationale": "Both the sampled compartment and ancillary test leave the thyroid-related nodal concern inadequately assessed."
        }
      ],
      "explanation": "The sampled fluid did not represent the suspicious tissue. Representative nodal cytology with selected thyroglobulin washout addresses the thyroid-metastasis question; use a nodal approach that avoids thyroid contamination. Repeating a relevant assay on the same nonrepresentative compartment can reproduce an uninterpretable result rather than resolve the tissue/morphology discordance. This targets tissue, but flow cytometry addresses a different competing lymphoid process; it is not the preferred adjunct for this thyroid-cancer nodal question. Both the sampled compartment and ancillary test leave the thyroid-related nodal concern inadequately assessed.",
      "teachingPoint": "The sampled fluid did not represent the suspicious tissue. Representative nodal cytology with selected thyroglobulin washout addresses the thyroid-metastasis question; use a nodal approach that avoids thyroid contamination.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.dtc.extent",
        "claim.qq20261102c.thyroid-cystic-node-discordance",
        "claim.qf3.thyroid-washout-provenance",
        "claim.qbp2b.b2b06.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dtc.cystic-node-repeat-sampling.v2",
      "nextConceptId": "concept.dtc.representative-node-target-and-assay.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes broad surgery-versus-resampling plans into a target-by-assay acquisition decision; retain prior nodal imaging and cystic-node concepts."
    },
    "ownerProgramReview": {
      "ownerItemId": "F16",
      "reviewedOn": "2026-11-04",
      "whatChanged": "All four options are the same sampling stage with balanced target/assay components. Keeps explicit clinician/radiologist attribution, neck anatomy and no presupposed neck dissection.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends after thyroid cytology reports papillary carcinoma. The clinician reviews the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, fluid in its centre and a peripheral tissue component containing punctate echogenic foci. The earlier aspirate contains macrophages and proteinaceous fluid. Its washout thyroglobulin is detectable, and the procedure images show the needle crossing the thyroid before entering the central fluid.",
    "previousPresentation": "{patientName}, a 43-year-old woman, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
        "presentation": "{patientName}, a 43-year-old woman, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
        "presentation": "{patientName}, a 43-year-old man, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
        "presentation": "{patientName}, a 68-year-old woman, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
        "presentation": "{patientName}, a 68-year-old man, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf3.20261104.case.gs028b.differentiated-thyroid-cancer.a-completed-negative",
        "patientPresentationVariantId": "presentation.gs028b.differentiated-thyroid-cancer.a-completed-negative",
        "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
        "revisedChiefComplaint": "Thyroid surgical planning",
        "revisedPresentation": "{patientName}, a 43-year-old woman, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf3.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.43",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.43",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.female.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-completed-negative.male.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, attends after thyroid cytology reports papillary carcinoma. The clinician discusses the radiologist's neck-ultrasound report: a lateral neck node has a 12-mm short axis, a cystic centre and punctate echogenic foci. An outside node report describes lymphocytes without malignant epithelial cells and detectable thyroglobulin in the washout. The procedural images show the needle passing through the intact thyroid before entering the fluid portion of the neck node.",
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
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
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b07",
    "auditId": "B2B07",
    "caseId": "case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3",
    "nodeId": "node.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.1",
    "previousQuestionVariantId": "question.statistics-ethics.capacity-refusal.v3",
    "questionVariantId": "question.statistics-ethics.capacity-refusal.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "How should the team assess {patientName}'s refusal of thyroid needle sampling when treated depression is recorded but the stated decision-making abilities are intact?",
    "previousChoiceLabels": [
      "Assess current decision-making abilities",
      "Require psychiatric clearance because of depression",
      "Use the family's account of the patient's usual judgment",
      "Judge capacity by agreement with the recommendation"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Evaluate the actual personal appreciation and reasoning rather than agreement with the recommendation or the depression label. Then: Choose who controls the present biopsy decision when a relative disagrees.",
    "reviewerNotes": "Ethics application only; no jurisdiction-specific legal rule, involuntary-treatment policy or thyroid biopsy threshold is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "key-3": "key-3",
      "choice.qbp2b.20261104.b2b07.d1": "wrong-3-1",
      "choice.qbp2b.20261104.b2b07.d2": "wrong-3-2"
    },
    "choiceServiceOverrides": {
      "key-3": null,
      "choice.qbp2b.20261104.b2b07.d1": null,
      "choice.qbp2b.20261104.b2b07.d2": null
    },
    "choiceTimingOverrides": {
      "key-3": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b07.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b07.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.statistics-ethics.capacity-refusal.v3.r1",
      "conceptId": "concept.statistics-ethics.capacity-refusal",
      "stem": "Which plan should the team follow for {patientName}'s biopsy?",
      "answerChoices": [
        {
          "id": "key-3",
          "label": "Document informed refusal and offer follow-up",
          "isCorrect": true,
          "rationale": "The discussion demonstrates understanding, appreciation of personal consequences, reasoning and a communicated choice. A disliked choice and recorded depression do not transfer the decision to the relative.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b07.d1",
          "label": "Seek surrogate authorization and schedule the biopsy",
          "isCorrect": false,
          "distractorRationale": "A surrogate can be appropriate when the patient lacks the relevant abilities; the relative’s disagreement does not displace this demonstrated decision."
        },
        {
          "id": "choice.qbp2b.20261104.b2b07.d2",
          "label": "Defer the decision pending psychiatric authorization",
          "isCorrect": false,
          "distractorRationale": "Psychiatric input may help when assessment is uncertain, but a diagnosis by itself is not a requirement for another clinician to authorize this decision."
        }
      ],
      "explanation": "The discussion demonstrates understanding, appreciation of personal consequences, reasoning and a communicated choice. A disliked choice and recorded depression do not transfer the decision to the relative. A surrogate can be appropriate when the patient lacks the relevant abilities; the relative’s disagreement does not displace this demonstrated decision. Psychiatric input may help when assessment is uncertain, but a diagnosis by itself is not a requirement for another clinician to authorize this decision.",
      "teachingPoint": "The discussion demonstrates understanding, appreciation of personal consequences, reasoning and a communicated choice. A disliked choice and recorded depression do not transfer the decision to the relative.",
      "supportingEvidenceClaimIds": [
        "claim.gs028se.capacity-refusal.3",
        "claim.gs028se.capacity-refusal.1",
        "claim.qbp2b.b2b07.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.statistics-ethics.capacity-refusal",
      "nextConceptId": "concept.statistics-ethics.capacity-refusal",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-1",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removes “abilities intact”, “meets biopsy criteria” and a task that states the capacity conclusion. Options are concrete consent/disposition plans.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
    "previousPresentation": "{patientName}, a 45-year-old woman, has a suspicious thyroid nodule meeting biopsy criteria and is discussing needle sampling. The chart records treated depression. A colleague questions accepting refusal because of that diagnosis. The patient accurately explains the options and personal consequences, reasons coherently and communicates a stable choice against sampling. The procedure has not started.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.45",
        "presentation": "{patientName}, a 45-year-old woman, has a suspicious thyroid nodule meeting biopsy criteria and is discussing needle sampling. The chart records treated depression. A colleague questions accepting refusal because of that diagnosis. The patient accurately explains the options and personal consequences, reasons coherently and communicates a stable choice against sampling. The procedure has not started."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.45",
        "presentation": "{patientName}, a 45-year-old man, has a suspicious thyroid nodule meeting biopsy criteria and is discussing needle sampling. The chart records treated depression. A colleague questions accepting refusal because of that diagnosis. The patient accurately explains the options and personal consequences, reasons coherently and communicates a stable choice against sampling. The procedure has not started."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.69",
        "presentation": "{patientName}, a 69-year-old woman, has a suspicious thyroid nodule meeting biopsy criteria and is discussing needle sampling. The chart records treated depression. A colleague questions accepting refusal because of that diagnosis. The patient accurately explains the options and personal consequences, reasons coherently and communicates a stable choice against sampling. The procedure has not started."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.69",
        "presentation": "{patientName}, a 69-year-old man, has a suspicious thyroid nodule meeting biopsy criteria and is discussing needle sampling. The chart records treated depression. A colleague questions accepting refusal because of that diagnosis. The patient accurately explains the options and personal consequences, reasons coherently and communicates a stable choice against sampling. The procedure has not started."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Declining thyroid sampling",
    "previousChiefComplaint": "Declining thyroid sampling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.45"
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.45"
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.69"
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.69"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b08",
    "auditId": "B2B08",
    "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
    "previousQuestionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which planning direction is most appropriate?",
    "previousChoiceLabels": [
      "Mastectomy-based surgical planning",
      "Conservation based on response alone",
      "No surgery because therapy was given",
      "Remove only the easiest residual focus"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish clinical response from the distribution of residual invasive and in-situ disease. Then: Choose an operation that covers the mapped disease rather than applying a localized-response conservation strategy.",
    "reviewerNotes": "No lesion-distance, breast-volume or universal multicentricity cutoff. Breast clinician must confirm the unique ranking for this distribution and that conservation is not reasonably feasible.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b08.d1": "d1_2",
      "choice.qbp2b.20261104.b2b08.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b08.d1": null,
      "choice.qbp2b.20261104.b2b08.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b08.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b08.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1",
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "stem": "Which breast operation should be discussed for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Mastectomy of the affected breast",
          "isCorrect": true,
          "rationale": "The separated residual invasive sites and extensive intervening/central in-situ field, not the absent palpable mass, make conservation unsuitable in this constructed distribution.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b08.d1",
          "label": "Oncoplastic resection of the mapped breast field",
          "isCorrect": false,
          "distractorRationale": "Oncoplastic conservation can suit selected wider localized resections, but this map involves separated invasive sites and most of the intervening/central tissue. The total distribution changes that balance."
        },
        {
          "id": "choice.qbp2b.20261104.b2b08.d2",
          "label": "Wire-localized breast excisions around both markers",
          "isCorrect": false,
          "distractorRationale": "Two targeted excisions can fit selected distributions, but do not cover the extensive intervening/central in-situ component here."
        }
      ],
      "explanation": "The separated residual invasive sites and extensive intervening/central in-situ field, not the absent palpable mass, make conservation unsuitable in this constructed distribution. Oncoplastic conservation can suit selected wider localized resections, but this map involves separated invasive sites and most of the intervening/central tissue. The total distribution changes that balance. Two targeted excisions can fit selected distributions, but do not cover the extensive intervening/central in-situ component here.",
      "teachingPoint": "The separated residual invasive sites and extensive intervening/central in-situ field, not the absent palpable mass, make conservation unsuitable in this constructed distribution.",
      "supportingEvidenceClaimIds": [
        "claim.nact.bcs-selection",
        "claim.nact.response-mapping",
        "claim.nact.oncoplastic-selection",
        "claim.qbp2b.b2b08.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Post-treatment breast mapping",
        "columnHeaders": [
          "Finding"
        ],
        "rowHeaders": [
          "Upper outer breast",
          "Lower inner breast",
          "Remaining breast field"
        ],
        "cells": [
          [
            "Residual invasive carcinoma around the first biopsy marker"
          ],
          [
            "A separate residual invasive focus around the second biopsy marker"
          ],
          [
            "Branching calcifications extend through the intervening tissue, the central breast and the remaining quadrants to the gland periphery; mapped samples across that field contain in-situ carcinoma"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "nextConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-2",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces “diffuse multicentric” and “not feasible” conclusions with a map; all choices name real breast operations.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared.",
    "previousPresentation": "{patientName}, a 46-year-old woman, presents after neoadjuvant therapy with diffuse multicentric residual disease spanning separate breast regions. A satisfactory single conservation resection is not feasible.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.46",
        "presentation": "{patientName}, a 46-year-old woman, presents after neoadjuvant therapy with diffuse multicentric residual disease spanning separate breast regions. A satisfactory single conservation resection is not feasible."
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.62",
        "presentation": "{patientName}, a 62-year-old woman, presents after neoadjuvant therapy with diffuse multicentric residual disease spanning separate breast regions. A satisfactory single conservation resection is not feasible."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Breast operation planning",
    "previousChiefComplaint": "Choose breast operation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.46"
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.62"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b09",
    "auditId": "B2B09",
    "caseId": "case.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock",
    "nodeId": "node.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.1",
    "previousQuestionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3",
    "questionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which definitive action must accompany resuscitation for this patient's suspected acute mesenteric ischemia with peritonitis?",
    "previousChoiceLabels": [
      "Transfer for emergency exploration",
      "Delay surgery until blood pressure normalizes",
      "Endovascular revascularization alone",
      "Treat with antibiotics alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that new generalized involuntary guarding is not negated by falling lactate or improved pressure. Then: Choose the sequence that includes prompt bowel viability assessment rather than an endovascular/medical-first pathway for a different examination.",
    "reviewerNotes": "No lactate or blood-pressure cutoff, required hybrid technique or universal revascularization method is specified.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b09.d1": "d1_3",
      "choice.qbp2b.20261104.b2b09.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b09.d1": null,
      "choice.qbp2b.20261104.b2b09.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b09.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b09.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r1",
      "conceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "stem": "Which treatment sequence should be chosen for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Operative bowel assessment with revascularization planning",
          "isCorrect": true,
          "rationale": "The evolving examination suggests threatened or infarcted bowel despite improving circulation/chemistry. The operative pathway assesses viability while revascularization is planned.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b09.d1",
          "label": "Catheter revascularization followed by serial abdominal review",
          "isCorrect": false,
          "distractorRationale": "An endovascular-first approach can fit selected patients without peritoneal findings; improvement in lactate does not justify overlooking this examination."
        },
        {
          "id": "choice.qbp2b.20261104.b2b09.d2",
          "label": "Anticoagulation followed by serial abdominal review",
          "isCorrect": false,
          "distractorRationale": "Anticoagulation is part of care in appropriate cases, but an evolving rigid guarded abdomen requires more than a medical observation sequence."
        }
      ],
      "explanation": "The evolving examination suggests threatened or infarcted bowel despite improving circulation/chemistry. The operative pathway assesses viability while revascularization is planned. An endovascular-first approach can fit selected patients without peritoneal findings; improvement in lactate does not justify overlooking this examination. Anticoagulation is part of care in appropriate cases, but an evolving rigid guarded abdomen requires more than a medical observation sequence.",
      "teachingPoint": "The evolving examination suggests threatened or infarcted bowel despite improving circulation/chemistry. The operative pathway assesses viability while revascularization is planned.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.ami.peritonitis-exploration",
        "claim.qbp2b.b2b09.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "nextConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-3",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes the peritonitis/definitive-action labels, availability sentence and delay caricatures; compares three plausible care sequences.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
    "previousPresentation": "{patientName}, a 65-year-old woman, develops a high-risk acute mesenteric ischemia presentation in the clinic with worsening hypotension, diffuse rebound tenderness, and involuntary guarding. Emergency support is underway, and the receiving hospital has operative capability.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.65",
        "presentation": "{patientName}, a 65-year-old woman, develops a high-risk acute mesenteric ischemia presentation in the clinic with worsening hypotension, diffuse rebound tenderness, and involuntary guarding. Emergency support is underway, and the receiving hospital has operative capability."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.65",
        "presentation": "{patientName}, a 65-year-old man, develops a high-risk acute mesenteric ischemia presentation in the clinic with worsening hypotension, diffuse rebound tenderness, and involuntary guarding. Emergency support is underway, and the receiving hospital has operative capability."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.80",
        "presentation": "{patientName}, a 80-year-old woman, develops a high-risk acute mesenteric ischemia presentation in the clinic with worsening hypotension, diffuse rebound tenderness, and involuntary guarding. Emergency support is underway, and the receiving hospital has operative capability."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.80",
        "presentation": "{patientName}, a 80-year-old man, develops a high-risk acute mesenteric ischemia presentation in the clinic with worsening hypotension, diffuse rebound tenderness, and involuntary guarding. Emergency support is underway, and the receiving hospital has operative capability."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 65,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Abdominal pain escalation",
    "previousChiefComplaint": "Abdominal collapse",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.65"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.65"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.80"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.80"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b10",
    "auditId": "B2B10",
    "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
    "previousQuestionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which information should guide the operative map?",
    "previousChoiceLabels": [
      "Longitudinal disease extent",
      "Current palpation as the only map",
      "Baseline imaging as the only map",
      "Treatment completion date alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the changed marker–residual–palpation relationship rather than substituting one time point for the other. Then: Request localization that covers the mapped residual/treated bed.",
    "reviewerNotes": "This is mapping rather than a mandated resection margin or imaging modality. Technique and extent remain for breast review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b10.d1": "d1_2",
      "choice.qbp2b.20261104.b2b10.d2": "d2_2",
      "choice.qbp2b.20261104.b2b10.d3": "d3_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b10.d1": null,
      "choice.qbp2b.20261104.b2b10.d2": null,
      "choice.qbp2b.20261104.b2b10.d3": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.20261104.b2b10.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.20261104.b2b10.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.20261104.b2b10.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      }
    },
    "question": {
      "id": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "stem": "Which localization plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Localize the enhancing focus and original marker",
          "isCorrect": true,
          "rationale": "The response has separated the palpable/enhancing remnant from the original marked bed. Current distribution and the known original site both need to be incorporated.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b10.d1",
          "label": "Localize the enhancing focus and palpable remnant",
          "isCorrect": false,
          "distractorRationale": "Both targets describe the current lateral remnant, leaving the original marked bed unaccounted for. This is tempting if a clinical response is treated as disappearance of the known site."
        },
        {
          "id": "choice.qbp2b.20261104.b2b10.d2",
          "label": "Localize the pretreatment outline and original marker",
          "isCorrect": false,
          "distractorRationale": "The original map and marker matter, but copying the entire old outline does not integrate the changed residual distribution."
        },
        {
          "id": "choice.qbp2b.20261104.b2b10.d3",
          "label": "Localize the pretreatment outline and palpable remnant",
          "isCorrect": false,
          "distractorRationale": "This combines an unchanged original outline with examination rather than integrating the residual imaging and marked biopsy bed."
        }
      ],
      "explanation": "The response has separated the palpable/enhancing remnant from the original marked bed. Current distribution and the known original site both need to be incorporated. Both targets describe the current lateral remnant, leaving the original marked bed unaccounted for. This is tempting if a clinical response is treated as disappearance of the known site. The original map and marker matter, but copying the entire old outline does not integrate the changed residual distribution. This combines an unchanged original outline with examination rather than integrating the residual imaging and marked biopsy bed.",
      "teachingPoint": "The response has separated the palpable/enhancing remnant from the original marked bed. Current distribution and the known original site both need to be incorporated.",
      "supportingEvidenceClaimIds": [
        "claim.nact.response-mapping",
        "claim.qbp2b.b2b10.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Records for operative mapping",
        "columnHeaders": [
          "Original record",
          "Current record"
        ],
        "rowHeaders": [
          "Biopsy-proven site",
          "Palpable finding"
        ],
        "cells": [
          [
            "Marker within the sampled cancer on the pretreatment images",
            "Marker lies in a nonenhancing scarred bed medial to the smaller enhancing focus"
          ],
          [
            "Firm lesion at the biopsy-proven site",
            "Firm remnant lies within the lateral enhancing focus, separate from the marker"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "nextConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-4",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Specific localization choices replace abstract “longitudinal extent” and obviously incomplete maps.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after neoadjuvant therapy. The mass is smaller, with a residual firm area lateral to the original biopsy marker.",
    "previousPresentation": "{patientName}, a 45-year-old woman, returns after neoadjuvant therapy with a smaller but still palpable unifocal breast lesion. Baseline imaging and the biopsy-site marker are available.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.a-residual-palpable.female.45",
        "presentation": "{patientName}, a 45-year-old woman, returns after neoadjuvant therapy with a smaller but still palpable unifocal breast lesion. Baseline imaging and the biopsy-site marker are available."
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.a-residual-palpable.female.61",
        "presentation": "{patientName}, a 61-year-old woman, returns after neoadjuvant therapy with a smaller but still palpable unifocal breast lesion. Baseline imaging and the biopsy-site marker are available."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Residual breast finding",
    "previousChiefComplaint": "Residual breast mass",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.a-residual-palpable.female.45"
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.a-residual-palpable.female.61"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b11",
    "auditId": "B2B11",
    "caseId": "case.gs028c.acute-cholecystitis.b-older-but-fit",
    "nodeId": "node.gs028c.acute-cholecystitis.b-older-but-fit.1",
    "previousQuestionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4",
    "questionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which index-admission treatment pathway should be recommended for this fit patient with acute cholecystitis?",
    "previousChoiceLabels": [
      "Same-admission cholecystectomy",
      "Antibiotics alone because of age",
      "Elective surgery after several months",
      "Hospital gallbladder drainage instead"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate current recovery and baseline function from the age/comorbidity label. Then: Choose index-admission treatment rather than substituting drainage or routine delay.",
    "reviewerNotes": "WSES fit-adult boundary reused offline. This is not an anaesthetic risk score or a claim that these observations alone replace full preoperative assessment.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b11.d1": "d1_4",
      "choice.qbp2b.20261104.b2b11.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b11.d1": null,
      "choice.qbp2b.20261104.b2b11.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b11.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b11.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r1",
      "conceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "stem": "Which gallbladder treatment plan should be discussed for {patientName}'s admission?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Early laparoscopic cholecystectomy",
          "isCorrect": true,
          "rationale": "Recovery of function and unsupported circulation/respiration favors index-admission surgery in this constructed patient; older age and a remote event do not by themselves select drainage.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b11.d1",
          "label": "Percutaneous gallbladder drainage",
          "isCorrect": false,
          "distractorRationale": "Drainage is a real option when operative illness or contraindication changes the balance; the current trajectory does not establish that indication."
        },
        {
          "id": "choice.qbp2b.20261104.b2b11.d2",
          "label": "Delayed laparoscopic cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "An improving episode can tempt discharge with delayed surgery, but routine interval delay is not the preferred fit-adult pathway."
        }
      ],
      "explanation": "Recovery of function and unsupported circulation/respiration favors index-admission surgery in this constructed patient; older age and a remote event do not by themselves select drainage. Drainage is a real option when operative illness or contraindication changes the balance; the current trajectory does not establish that indication. An improving episode can tempt discharge with delayed surgery, but routine interval delay is not the preferred fit-adult pathway.",
      "teachingPoint": "Recovery of function and unsupported circulation/respiration favors index-admission surgery in this constructed patient; older age and a remote event do not by themselves select drainage.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
        "claim.qbp2b.b2b11.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Admission and current ward observations",
        "columnHeaders": [
          "At admission",
          "After initial treatment"
        ],
        "rowHeaders": [
          "Circulation",
          "Breathing",
          "Function"
        ],
        "cells": [
          [
            "Low blood pressure during vomiting",
            "Blood pressure returned to the usual range after fluids; no vasopressor support"
          ],
          [
            "Breathing rapidly with pain",
            "Breathing room air without assistance"
          ],
          [
            "Stayed in bed with pain",
            "Walking to the bathroom and eating; pre-illness independent at home"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "nextConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-5",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces “fit”, multiple exclusion negatives and team-availability permission with a before/current record and parallel treatment plans.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
    "previousPresentation": "{patientName}, a 72-year-old woman, comes to the clinic with outside imaging-confirmed acute calculous cholecystitis. Despite older age, the preoperative assessment finds no shock, decompensated disease, or anesthetic contraindication. An experienced hospital surgical team is available.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.72",
        "presentation": "{patientName}, a 72-year-old woman, comes to the clinic with outside imaging-confirmed acute calculous cholecystitis. Despite older age, the preoperative assessment finds no shock, decompensated disease, or anesthetic contraindication. An experienced hospital surgical team is available."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.72",
        "presentation": "{patientName}, a 72-year-old man, comes to the clinic with outside imaging-confirmed acute calculous cholecystitis. Despite older age, the preoperative assessment finds no shock, decompensated disease, or anesthetic contraindication. An experienced hospital surgical team is available."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.81",
        "presentation": "{patientName}, a 81-year-old woman, comes to the clinic with outside imaging-confirmed acute calculous cholecystitis. Despite older age, the preoperative assessment finds no shock, decompensated disease, or anesthetic contraindication. An experienced hospital surgical team is available."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.81",
        "presentation": "{patientName}, a 81-year-old man, comes to the clinic with outside imaging-confirmed acute calculous cholecystitis. Despite older age, the preoperative assessment finds no shock, decompensated disease, or anesthetic contraindication. An experienced hospital surgical team is available."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 72,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Gallbladder admission review",
    "previousChiefComplaint": "Acute gallbladder infection",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.72"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.72"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.81"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.81"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b12",
    "auditId": "B2B12",
    "caseId": "case.gs028se.p2e.confidentiality.v4.mondor",
    "nodeId": "node.gs028se.p2e.confidentiality.v4.mondor.2",
    "previousQuestionVariantId": "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4",
    "questionVariantId": "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.p2e.1"
    ],
    "previousStem": "Which initial care plan best fits {patientName}'s confirmed uncomplicated Mondor disease after appropriate evaluation, without infection, suspicious findings or a separate indication for anticoagulation?",
    "previousChoiceLabels": [
      "Warm compresses, appropriate NSAID, and follow-up",
      "Incision and drainage with empiric antibiotics",
      "Surgical excision of the involved superficial vein",
      "Routine therapeutic anticoagulation"
    ],
    "previousCurrentUpdate": "The team shares relevant information for {patientName}'s authorized consultation while avoiding unnecessary disclosure. The specialist confirms concordant uncomplicated Mondor disease after appropriate clinical evaluation. There is no suspicious mass, infection, progressive diffuse breast change, adenopathy, recurrent or migratory thrombophlebitis, or known hypercoagulable condition. The same patient wants to discuss initial care now that relevant findings are available to the treating team.",
    "previousExhibit": null,
    "currentUpdate": "At the authorized consultation, {patientName} shows a tender line that becomes more visible when the arm is raised. It is shorter and less painful than at the earlier visit. Ultrasound traces a noncompressible superficial tubular structure without flow; adjacent tissue and the deeper veins retain their usual appearances.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the observed superficial vascular cord and improving course rather than treating any tender line as an abscess or deep-vein event. Then: Choose a specific supportive treatment rather than routine antibiotics or full anticoagulation.",
    "reviewerNotes": "No anticoagulant/NSAID dose, exact vein length or mandatory duration; medicine suitability and atypical findings require clinician review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "supportive_care": "supportive_care",
      "choice.qbp2b.20261104.b2b12.d1": "incision_and_drainage",
      "choice.qbp2b.20261104.b2b12.d2": "venous_excision"
    },
    "choiceServiceOverrides": {
      "supportive_care": null,
      "choice.qbp2b.20261104.b2b12.d1": null,
      "choice.qbp2b.20261104.b2b12.d2": null
    },
    "choiceTimingOverrides": {
      "supportive_care": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b12.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b12.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r1",
      "conceptId": "concept.mondor-disease.supportive-management",
      "stem": "Which treatment should be discussed for {patientName}'s current chest-wall finding?",
      "answerChoices": [
        {
          "id": "supportive_care",
          "label": "Warm compresses with nonsteroidal analgesia",
          "isCorrect": true,
          "rationale": "The superficial vascular finding and improving localized course fit supportive care for uncomplicated Mondor disease, with follow-up.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b12.d1",
          "label": "Warm compresses with oral antibiotics",
          "isCorrect": false,
          "distractorRationale": "Antibiotic treatment can fit an infectious process, but this vascular finding and trajectory do not establish one."
        },
        {
          "id": "choice.qbp2b.20261104.b2b12.d2",
          "label": "Warm compresses with systemic anticoagulation",
          "isCorrect": false,
          "distractorRationale": "A thrombosed superficial structure can prompt reflex anticoagulation; it is not routine for this concordant uncomplicated chest-wall process without a separate indication."
        }
      ],
      "explanation": "The superficial vascular finding and improving localized course fit supportive care for uncomplicated Mondor disease, with follow-up. Antibiotic treatment can fit an infectious process, but this vascular finding and trajectory do not establish one. A thrombosed superficial structure can prompt reflex anticoagulation; it is not routine for this concordant uncomplicated chest-wall process without a separate indication.",
      "teachingPoint": "The superficial vascular finding and improving localized course fit supportive care for uncomplicated Mondor disease, with follow-up.",
      "supportingEvidenceClaimIds": [
        "claim.mondor-disease.supportive-management-and-boundaries",
        "claim.mondor-disease.classic-clinical-phenotype",
        "claim.gs028se.confidentiality.4",
        "claim.qbp2b.b2b12.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.mondor-disease.supportive-management",
      "nextConceptId": "concept.mondor-disease.supportive-management",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-6",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removes the named “confirmed uncomplicated” conclusion, the long exclusion list and the uniquely comprehensive generic care label. Preserves the preceding confidentiality question and its task.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, authorizes sharing relevant records with the treating breast specialist for a painful chest-wall cord. The referral coordinator is preparing the consultation records.",
    "previousPresentation": "{patientName}, a 51-year-old man, has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.male.51",
        "presentation": "{patientName}, a 51-year-old man, has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share."
      },
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.female.51",
        "presentation": "{patientName}, a 51-year-old woman, has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share."
      },
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.male.77",
        "presentation": "{patientName}, a 77-year-old man, has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share."
      },
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.female.77",
        "presentation": "{patientName}, a 77-year-old woman, has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 51,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Chest-wall cord review",
    "previousChiefComplaint": "Authorized specialist coordination",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.male.51"
      },
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.female.51"
      },
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.male.77"
      },
      {
        "id": "profile.gs028se.qi-versus-research-confidentiality.b-confidentiality-4.female.77"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b13",
    "auditId": "B2B13",
    "caseId": "case.gs028b.nipple-discharge.b-negative-first-line",
    "nodeId": "node.gs028b.nipple-discharge.b-negative-first-line.1",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which interpretation is most appropriate?",
    "previousChoiceLabels": [
      "Persistent discharge needs breast review",
      "The discharge is now physiologic",
      "Malignancy has been completely excluded",
      "Routine screening replaces symptom follow-up"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the elicited bilateral milk-like component from the spontaneous single-duct blood-stained component. Then: Select a diagnostic breast pathway rather than letting the medication explanation convert the whole presentation to routine screening.",
    "reviewerNotes": "The medication association is already recorded; no prolactin cutoff or mandate for MRI/duct excision after completed negative imaging is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b13.d1": "d1_4",
      "choice.qbp2b.20261104.b2b13.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b13.d1": null,
      "choice.qbp2b.20261104.b2b13.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.20261104.b2b13.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.combined_diagnostic"
      },
      "choice.qbp2b.20261104.b2b13.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      }
    },
    "question": {
      "id": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r1",
      "conceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "stem": "Which breast investigation plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Diagnostic mammography with targeted ultrasound",
          "isCorrect": true,
          "rationale": "The spontaneous unilateral bloody component still warrants a breast diagnostic pathway; a plausible medication effect on the expressed bilateral component does not explain away both patterns.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b13.d1",
          "label": "Contrast-enhanced breast MRI with targeted ultrasound",
          "isCorrect": false,
          "distractorRationale": "MRI may have a role later in selected persistent cases, but it does not replace the initial age-appropriate diagnostic mammography/targeted ultrasound pathway here."
        },
        {
          "id": "choice.qbp2b.20261104.b2b13.d2",
          "label": "Screening mammography with targeted ultrasound",
          "isCorrect": false,
          "distractorRationale": "Medication review is relevant to the milk-like component, but screening rather than diagnostic evaluation does not address the separate spontaneous duct symptom."
        }
      ],
      "explanation": "The spontaneous unilateral bloody component still warrants a breast diagnostic pathway; a plausible medication effect on the expressed bilateral component does not explain away both patterns. MRI may have a role later in selected persistent cases, but it does not replace the initial age-appropriate diagnostic mammography/targeted ultrasound pathway here. Medication review is relevant to the milk-like component, but screening rather than diagnostic evaluation does not address the separate spontaneous duct symptom.",
      "teachingPoint": "The spontaneous unilateral bloody component still warrants a breast diagnostic pathway; a plausible medication effect on the expressed bilateral component does not explain away both patterns.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.pathologic-pattern",
        "claim.discharge.imaging",
        "claim.qq20261102a.mixed-discharge-medication",
        "claim.qq20261102b.mixed-discharge-parallel-evaluation",
        "claim.qbp2b.b2b13.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "nextConceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-7",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Defines the observed patterns and compares actual named breast-imaging plans instead of “persistent discharge needs review”.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination.",
    "previousPresentation": "{patientName}, a 46-year-old woman, returns with persistent spontaneous unilateral single-duct discharge after diagnostic mammography and targeted ultrasound were negative. The breast specialist is reviewing next steps.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.46",
        "presentation": "{patientName}, a 46-year-old woman, returns with persistent spontaneous unilateral single-duct discharge after diagnostic mammography and targeted ultrasound were negative. The breast specialist is reviewing next steps."
      },
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.64",
        "presentation": "{patientName}, a 64-year-old woman, returns with persistent spontaneous unilateral single-duct discharge after diagnostic mammography and targeted ultrasound were negative. The breast specialist is reviewing next steps."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Mixed nipple discharge",
    "previousChiefComplaint": "Persistent discharge after imaging",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.46"
      },
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.64"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b14",
    "auditId": "B2B14",
    "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
    "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
    "previousQuestionVariantId": "question.appendicitis.stable-adult-ct.v4",
    "questionVariantId": "question.appendicitis.stable-adult-ct.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which next imaging study best evaluates both appendicitis and the competing acute diagnoses in this patient?",
    "previousChoiceLabels": [
      "Abdominopelvic CT",
      "Plain abdominal radiographs",
      "Focused abdominal ultrasound",
      "Abdominal and pelvic MRI"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize nonvisualization as unresolved diagnostic evidence and avoid anchoring on the incidental cyst. Then: Select the next study that evaluates the appendix and alternative abdominal causes.",
    "reviewerNotes": "MRI is not offered as an allegedly wrong definitive alternative. The retained guideline claim has a resource-dependent CT framing; the next-study ranking in this constructed record still requires imaging review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b14.d1": "d1_4",
      "choice.qbp2b.20261104.b2b14.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b14.d1": null,
      "choice.qbp2b.20261104.b2b14.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qbp2b.20261104.b2b14.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2b.20261104.b2b14.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.appendicitis.stable-adult-ct.v4.r1",
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "stem": "Which imaging request should be made next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Abdominopelvic computed tomography",
          "isCorrect": true,
          "rationale": "Persistent uncertainty after the nonvisualized appendix and noncorresponding simple cyst warrants a broader definitive study in this nonpregnant adult.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b14.d1",
          "label": "Repeat focused appendiceal ultrasound",
          "isCorrect": false,
          "distractorRationale": "Repeat focused imaging can be useful when conditions or technique change; repeating the same limited target is less helpful than surveying the competing intra-abdominal causes in this record."
        },
        {
          "id": "choice.qbp2b.20261104.b2b14.d2",
          "label": "Transvaginal pelvic ultrasonography",
          "isCorrect": false,
          "distractorRationale": "A focused adnexal study is a credible response to pelvic pain, but the incidental simple cyst does not account for the evolving location and inflammatory record."
        }
      ],
      "explanation": "Persistent uncertainty after the nonvisualized appendix and noncorresponding simple cyst warrants a broader definitive study in this nonpregnant adult. Repeat focused imaging can be useful when conditions or technique change; repeating the same limited target is less helpful than surveying the competing intra-abdominal causes in this record. A focused adnexal study is a credible response to pelvic pain, but the incidental simple cyst does not account for the evolving location and inflammatory record.",
      "teachingPoint": "Persistent uncertainty after the nonvisualized appendix and noncorresponding simple cyst warrants a broader definitive study in this nonpregnant adult.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us",
        "claim.qbp2b.b2b14.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.appendicitis.stable-adult-ct",
      "nextConceptId": "concept.appendicitis.stable-adult-ct",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-8",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes “inconclusive”, the MRI-availability cue and unrelated radiographs; offers three realistic same-stage imaging requests.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
    "previousPresentation": "{patientName}, a 44-year-old woman, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.44",
        "presentation": "{patientName}, a 44-year-old woman, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable."
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.44",
        "presentation": "{patientName}, a 44-year-old man, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable."
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.63",
        "presentation": "{patientName}, a 63-year-old woman, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable."
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.63",
        "presentation": "{patientName}, a 63-year-old man, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Right lower-abdominal pain",
    "previousChiefComplaint": "Lower abdominal pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.44"
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.44"
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.63"
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.63"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b15",
    "auditId": "B2B15",
    "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
    "nodeId": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1",
    "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which plan is most appropriate now?",
    "previousChoiceLabels": [
      "Optimize before elective surgery",
      "Proceed based on the clinic date",
      "Cancel surgery permanently",
      "Use albumin alone to decide"
    ],
    "previousCurrentUpdate": "The multidimensional review identifies uncontrolled ascites in this nonurgent case without an acute surgical emergency.",
    "previousExhibit": null,
    "currentUpdate": "At return, {patientName}'s clothes fit more tightly. The abdomen has shifting dullness and ultrasound shows new free peritoneal fluid. The hernia reduces when lying down and meals pass without vomiting. Bilirubin and creatinine remain close to the earlier values; the planned repair has not changed.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the new physical/ultrasound findings as a change not captured by stable bilirubin/creatinine. Then: Apply that change to timing rather than treating postoperative location or technique as a substitute for optimization.",
    "reviewerNotes": "No ascites drug regimen, paracentesis rule or numerical operative-risk cutoff. The retained first question/feedback remains visible and is disclosed in the packet.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.20261104.b2b15.d1": "d1_1",
      "choice.qbp2b.20261104.b2b15.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.20261104.b2b15.d1": null,
      "choice.qbp2b.20261104.b2b15.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b15.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b15.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r1",
      "conceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "stem": "Which plan should be taken to {patientName}'s elective-surgery conference?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Reschedule repair after ascites treatment",
          "isCorrect": true,
          "rationale": "The new fluid is evidence of a changed liver-related state despite similar selected laboratory values. A reducing nonobstructed hernia allows optimization before a new date is chosen.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b15.d1",
          "label": "Repair with postoperative ascites surveillance",
          "isCorrect": false,
          "distractorRationale": "Extra postoperative surveillance does not substitute for assessing and controlling the current decompensation before a nonurgent operation."
        },
        {
          "id": "choice.qbp2b.20261104.b2b15.d2",
          "label": "Repair using a smaller hernia-repair approach",
          "isCorrect": false,
          "distractorRationale": "Changing operative burden may matter, but does not by itself resolve the new fluid state; the current clinical change must first be incorporated."
        }
      ],
      "explanation": "The new fluid is evidence of a changed liver-related state despite similar selected laboratory values. A reducing nonobstructed hernia allows optimization before a new date is chosen. Extra postoperative surveillance does not substitute for assessing and controlling the current decompensation before a nonurgent operation. Changing operative burden may matter, but does not by itself resolve the new fluid state; the current clinical change must first be incorporated.",
      "teachingPoint": "The new fluid is evidence of a changed liver-related state despite similar selected laboratory values. A reducing nonobstructed hernia allows optimization before a new date is chosen.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.qbp2b.b2b15.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "nextConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-9",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Raw interval findings replace “multidimensional review identifies uncontrolled ascites”; all options are concrete conference plans.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2b.20261104.b2b16",
    "auditId": "B2B16",
    "caseId": "case.gs028b.cirrhosis-perioperative.b-encephalopathy",
    "nodeId": "node.gs028b.cirrhosis-perioperative.b-encephalopathy.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
    "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which disposition best fits this visit?",
    "previousChoiceLabels": [
      "Pause the elective plan for evaluation",
      "Proceed because vitals are stable",
      "Approve surgery from the diagnosis alone",
      "Set a permanent no-surgery rule"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish a new functional/neurologic change from a stable chronic diagnosis or normal single bedside measurement. Then: Pause the nonurgent pathway for acute assessment rather than changing anaesthetic technique or recovery location.",
    "reviewerNotes": "This does not diagnose every cognitive change as hepatic encephalopathy or prescribe its treatment.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b16.d1": "d1_2",
      "choice.qbp2b.20261104.b2b16.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b16.d1": null,
      "choice.qbp2b.20261104.b2b16.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b16.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b16.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r1",
      "conceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "stem": "Which disposition should be arranged for {patientName} from this visit?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Hospital assessment of altered mentation",
          "isCorrect": true,
          "rationale": "The interval loss of function and asterixis-like observation require assessment for active decompensation or another acute cause; stable pressure does not establish elective readiness.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b16.d1",
          "label": "Anaesthetic clearance for repair with postoperative observation",
          "isCorrect": false,
          "distractorRationale": "Observation after surgery does not address the newly altered state beforehand."
        },
        {
          "id": "choice.qbp2b.20261104.b2b16.d2",
          "label": "Day-surgery repair using local anaesthesia",
          "isCorrect": false,
          "distractorRationale": "Reducing anaesthetic exposure is not a substitute for investigating the current cognitive change."
        }
      ],
      "explanation": "The interval loss of function and asterixis-like observation require assessment for active decompensation or another acute cause; stable pressure does not establish elective readiness. Observation after surgery does not address the newly altered state beforehand. Reducing anaesthetic exposure is not a substitute for investigating the current cognitive change.",
      "teachingPoint": "The interval loss of function and asterixis-like observation require assessment for active decompensation or another acute cause; stable pressure does not establish elective readiness.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.optimize-decompensation",
        "claim.qbp2b.b2b16.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "nextConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-10",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removes the encephalopathy label and blanket “not urgent” summary; the reducing hernia supplies the actual timing boundary.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
    "previousPresentation": "{patientName}, a 43-year-old woman with cirrhosis, arrives for elective surgery clearance with new confusion and asterixis concerning for active encephalopathy. The proposed operation is not urgent.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.43",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, arrives for elective surgery clearance with new confusion and asterixis concerning for active encephalopathy. The proposed operation is not urgent."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.43",
        "presentation": "{patientName}, a 43-year-old man with cirrhosis, arrives for elective surgery clearance with new confusion and asterixis concerning for active encephalopathy. The proposed operation is not urgent."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.68",
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis, arrives for elective surgery clearance with new confusion and asterixis concerning for active encephalopathy. The proposed operation is not urgent."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.68",
        "presentation": "{patientName}, a 68-year-old man with cirrhosis, arrives for elective surgery clearance with new confusion and asterixis concerning for active encephalopathy. The proposed operation is not urgent."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative cognition change",
    "previousChiefComplaint": "Elective operation review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.43"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.43"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.68"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.68"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b17",
    "auditId": "B2B17",
    "caseId": "case.gs028d.dialysis-access.b-arm-swelling",
    "nodeId": "node.gs028d.dialysis-access.b-arm-swelling.1",
    "previousQuestionVariantId": "question.dialysis-access.clinical-dysfunction-referral.v4",
    "questionVariantId": "question.dialysis-access.clinical-dysfunction-referral.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which next step best addresses the possible access dysfunction?",
    "previousChoiceLabels": [
      "Refer promptly to the access team",
      "Continue routine follow-up only",
      "Treat with empiric antibiotics alone",
      "Order unrelated abdominal CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate generalized volume findings from a concordant access-arm/performance pattern. Then: Prioritize a specific access evaluation instead of attributing all swelling to fluid or inflammation.",
    "reviewerNotes": "No access-flow cutoff, stenosis location, mandated intervention or dialysis prescription; exact access-team investigation remains clinical.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b17.d1": "d1_4",
      "choice.qbp2b.20261104.b2b17.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b17.d1": null,
      "choice.qbp2b.20261104.b2b17.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b17.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b17.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.dialysis-access.clinical-dysfunction-referral.v4.r1",
      "conceptId": "concept.dialysis-access.clinical-dysfunction-referral",
      "stem": "Which referral should be prioritized for {patientName}'s arm problem?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Dialysis-access team for fistula outflow evaluation",
          "isCorrect": true,
          "rationale": "The access-specific performance and post-needle changes make dysfunction a concern beyond generalized fluid accumulation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b17.d1",
          "label": "Renal team for target-weight adjustment",
          "isCorrect": false,
          "distractorRationale": "Volume review is relevant to weight and ankle swelling, but does not fully address the focal access-performance change."
        },
        {
          "id": "choice.qbp2b.20261104.b2b17.d2",
          "label": "Medical team for arm soft-tissue infection treatment",
          "isCorrect": false,
          "distractorRationale": "A swollen access limb can be misread as infection; the delivered-flow and post-needle pattern requires assessment of the access rather than empiric infection treatment as the primary response."
        }
      ],
      "explanation": "The access-specific performance and post-needle changes make dysfunction a concern beyond generalized fluid accumulation. Volume review is relevant to weight and ankle swelling, but does not fully address the focal access-performance change. A swollen access limb can be misread as infection; the delivered-flow and post-needle pattern requires assessment of the access rather than empiric infection treatment as the primary response.",
      "teachingPoint": "The access-specific performance and post-needle changes make dysfunction a concern beyond generalized fluid accumulation.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.access.dysfunction-referral",
        "claim.qbp2b.b2b17.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dialysis-access.clinical-dysfunction-referral",
      "nextConceptId": "concept.dialysis-access.clinical-dysfunction-referral",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-11",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Adds a genuine competing volume interpretation and replaces unrelated CT/routine-follow-up foils with named clinical referrals.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
    "previousPresentation": "{patientName}, a 36-year-old woman, has new persistent swelling of the AV-access arm and a dialysis report of reduced delivered flow, without bleeding or acute limb threat.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.36",
        "presentation": "{patientName}, a 36-year-old woman, has new persistent swelling of the AV-access arm and a dialysis report of reduced delivered flow, without bleeding or acute limb threat."
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.36",
        "presentation": "{patientName}, a 36-year-old man, has new persistent swelling of the AV-access arm and a dialysis report of reduced delivered flow, without bleeding or acute limb threat."
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.65",
        "presentation": "{patientName}, a 65-year-old woman, has new persistent swelling of the AV-access arm and a dialysis report of reduced delivered flow, without bleeding or acute limb threat."
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.65",
        "presentation": "{patientName}, a 65-year-old man, has new persistent swelling of the AV-access arm and a dialysis report of reduced delivered flow, without bleeding or acute limb threat."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Dialysis arm swelling",
    "previousChiefComplaint": "Access arm swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.36"
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.36"
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.65"
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.65"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b18",
    "auditId": "B2B18",
    "caseId": "case.gs028d.hyperkalaemia.a-dialysis-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-dialysis-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v3",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which immediate disposition matches the current UKKA adult pathway?",
    "previousChoiceLabels": [
      "Immediate hospital assessment",
      "Routine follow-up next week",
      "Repeat testing before any action",
      "Dietary advice alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the actionable current specimen rather than the earlier or compromised result. Then: Apply the recorded community escalation boundary rather than symptom- or cause-based reassurance.",
    "reviewerNotes": "Uses the existing UKKA ≥6.5 mmol/L source boundary and existing observed values; no new dose, ECG exclusion rule, repeat interval or arrhythmia probability.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b18.d1": "d1_3",
      "choice.qbp2b.20261104.b2b18.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b18.d1": null,
      "choice.qbp2b.20261104.b2b18.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b18.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b18.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v3.r1",
      "conceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "stem": "Under the UKKA adult pathway, which plan should be arranged now for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Emergency hospital assessment and treatment",
          "isCorrect": true,
          "rationale": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b18.d1",
          "label": "Community medicine review with another outpatient sample",
          "isCorrect": false,
          "distractorRationale": "Medication and sample review matter, but should not replace hospital assessment once the current severe result is established."
        },
        {
          "id": "choice.qbp2b.20261104.b2b18.d2",
          "label": "Earlier routine renal appointment with a dietary plan",
          "isCorrect": false,
          "distractorRationale": "A renal/dietary plan can contribute later; it is not the appropriate current disposition for the confirmed result."
        }
      ],
      "explanation": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring. Medication and sample review matter, but should not replace hospital assessment once the current severe result is established. A renal/dietary plan can contribute later; it is not the appropriate current disposition for the confirmed result.",
      "teachingPoint": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.qbp2b.b2b18.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Community laboratory callback; collection order is shown",
        "columnHeaders": [
          "Potassium",
          "Specimen note"
        ],
        "rowHeaders": [
          "Before the previous dialysis session",
          "Current community sample"
        ],
        "cells": [
          [
            "6.8 mmol/L",
            "Result from a completed earlier episode"
          ],
          [
            "6.8 mmol/L",
            "Not haemolysed; identity confirmed by the laboratory"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-12",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes transfer-availability permission and delayed-care caricatures; presents actual collection provenance and three named current care settings.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
    "previousPresentation": "{patientName}, a 39-year-old woman with maintenance haemodialysis, returns to clinic when an outside laboratory calls with a confirmed community potassium of 6.8 mmol/L. The sample is confirmed and the patient is available for immediate transfer.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.39",
        "presentation": "{patientName}, a 39-year-old woman with maintenance haemodialysis, returns to clinic when an outside laboratory calls with a confirmed community potassium of 6.8 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.39",
        "presentation": "{patientName}, a 39-year-old man with maintenance haemodialysis, returns to clinic when an outside laboratory calls with a confirmed community potassium of 6.8 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.73",
        "presentation": "{patientName}, a 73-year-old woman with maintenance haemodialysis, returns to clinic when an outside laboratory calls with a confirmed community potassium of 6.8 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.73",
        "presentation": "{patientName}, a 73-year-old man with maintenance haemodialysis, returns to clinic when an outside laboratory calls with a confirmed community potassium of 6.8 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 39,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Potassium result review",
    "previousChiefComplaint": "Dialysis lab alert",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.39"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.39"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.73"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.73"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b19",
    "auditId": "B2B19",
    "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
    "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
    "previousQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which imaging study should address {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
    "previousChoiceLabels": [
      "Targeted breast ultrasound",
      "Screening mammography next year",
      "Breast MRI as first follow-up",
      "Contrast chest CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that a benign finding in a different quadrant does not answer the current examination. Then: Choose a targeted study at the actual site rather than escalate or repeat a completed concordant modality.",
    "reviewerNotes": "No BI-RADS threshold or universal MRI prohibition; no imaging finding is assumed to exclude a clinically suspicious lesion.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b19.d1": "d1_4",
      "choice.qbp2b.20261104.b2b19.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": "service.ultrasound",
      "choice.qbp2b.20261104.b2b19.d1": null,
      "choice.qbp2b.20261104.b2b19.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2b.20261104.b2b19.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mammography"
      },
      "choice.qbp2b.20261104.b2b19.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      }
    },
    "question": {
      "id": "question.palpable-breast.negative-mammogram-targeted-us.v4.r1",
      "conceptId": "concept.palpable-breast.site-concordant-imaging.v1",
      "stem": "Which imaging request should be made for {patientName}'s current finding?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Ultrasound of the marked lower inner site",
          "isCorrect": true,
          "rationale": "The attached benign cyst study is anatomically discordant with the actual palpable site. Appropriate targeted sonography is still needed.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b19.d1",
          "label": "Repeat mammography of the marked lower inner site",
          "isCorrect": false,
          "distractorRationale": "The mammographic site has already been marked and assessed; repeating that modality does not correct the ultrasound target mismatch."
        },
        {
          "id": "choice.qbp2b.20261104.b2b19.d2",
          "label": "Contrast-enhanced MRI of the affected breast",
          "isCorrect": false,
          "distractorRationale": "MRI is not the first substitute for completing the standard site-concordant targeted examination."
        }
      ],
      "explanation": "The attached benign cyst study is anatomically discordant with the actual palpable site. Appropriate targeted sonography is still needed. The mammographic site has already been marked and assessed; repeating that modality does not correct the ultrasound target mismatch. MRI is not the first substitute for completing the standard site-concordant targeted examination.",
      "teachingPoint": "The attached benign cyst study is anatomically discordant with the actual palpable site. Appropriate targeted sonography is still needed.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b19.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "nextConceptId": "concept.palpable-breast.site-concordant-imaging.v1",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes simple modality recall after negative mammography into assessment of anatomical concordance and a corrective study request; retain the old imaging concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-13",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Defines mammographic observations and the actual ultrasound target; avoids the undefined word negative and an explicit “US not yet done” cue.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality.",
    "previousPresentation": "{patientName}, a 47-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47",
        "presentation": "{patientName}, a 47-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done."
      },
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61",
        "presentation": "{patientName}, a 61-year-old woman, has a reproducible focal thickening on two examinations. Diagnostic mammography is negative and the radiology report recommends clinical correlation; targeted ultrasound has not yet been done."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent breast thickening",
    "previousChiefComplaint": "Imaging does not explain lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47"
      },
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b20",
    "auditId": "B2B20",
    "caseId": "case.bread-butter.perianal-abscess.draining-pain",
    "nodeId": "node.bread-butter.perianal-abscess.draining-pain.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v4",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-09-17.bread-and-butter.1"
    ],
    "previousStem": "Which treatment should {patientName} receive now?",
    "previousChoiceLabels": [
      "Arrange incision and drainage",
      "Give oral antibiotics alone",
      "Use warm compresses alone",
      "Perform needle aspiration alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the persisting superficial collection despite a reassuring or distracting feature. Then: Use the actual surrounding skin/host observations to choose antibiotic scope alongside definitive drainage.",
    "reviewerNotes": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_4": "drain_4",
      "choice.qbp2b.20261104.b2b20.d1": "antibiotic_4",
      "choice.qbp2b.20261104.b2b20.d2": "compress_4",
      "choice.qbp2b.20261104.b2b20.d3": "aspirate_4"
    },
    "choiceServiceOverrides": {
      "drain_4": null,
      "choice.qbp2b.20261104.b2b20.d1": null,
      "choice.qbp2b.20261104.b2b20.d2": null,
      "choice.qbp2b.20261104.b2b20.d3": null
    },
    "choiceTimingOverrides": {
      "drain_4": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b20.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b20.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b20.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v4.r1",
      "conceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "stem": "Which treatment plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_4",
          "label": "Open drainage with systemic antibiotics",
          "isCorrect": true,
          "rationale": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b20.d1",
          "label": "Open drainage with local wound care",
          "isCorrect": false,
          "distractorRationale": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control."
        },
        {
          "id": "choice.qbp2b.20261104.b2b20.d2",
          "label": "Needle aspiration with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity."
        },
        {
          "id": "choice.qbp2b.20261104.b2b20.d3",
          "label": "Needle aspiration with local wound care",
          "isCorrect": false,
          "distractorRationale": "This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity."
        }
      ],
      "explanation": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present. Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control. The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity. This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity.",
      "teachingPoint": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.b2b20.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.prompt-drainage",
      "nextConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes prompt-drainage recall into a two-component source-control/antibiotic decision; retain the original drainage concept and histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-14",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces four one-rule drainage labels with a balanced procedure-by-antibiotic matrix; no “alone” and no uniquely comprehensive key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
    "previousPresentation": "{patientName} is a 31-year-old woman who has focal perianal pain and a clinically evident superficial abscess without spontaneous drainage. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.31",
        "presentation": "{patientName} is a 31-year-old woman who has focal perianal pain and a clinically evident superficial abscess without spontaneous drainage. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.31",
        "presentation": "{patientName} is a 31-year-old man who has focal perianal pain and a clinically evident superficial abscess without spontaneous drainage. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.52",
        "presentation": "{patientName} is a 52-year-old woman who has focal perianal pain and a clinically evident superficial abscess without spontaneous drainage. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.52",
        "presentation": "{patientName} is a 52-year-old man who has focal perianal pain and a clinically evident superficial abscess without spontaneous drainage. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Painful perianal swelling",
    "previousChiefComplaint": "Perianal pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.52"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.52"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b21",
    "auditId": "B2B21",
    "caseId": "case.gs028d.geriatrics.b-mobility-nutrition",
    "nodeId": "node.gs028d.geriatrics.b-mobility-nutrition.1",
    "previousQuestionVariantId": "question.postoperative-delirium.multicomponent-prevention-plan.v4",
    "questionVariantId": "question.postoperative-delirium.multicomponent-prevention-plan.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "How should delirium prevention be structured?",
    "previousChoiceLabels": [
      "Tailored non-drug bundle",
      "Choose one universal intervention",
      "Rely on age alone to choose care",
      "Provide only a discharge handout"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Infer functional/nutritional vulnerability from chair transfer, shopping and meal observations despite intact conversation. Then: Select a specific component set that targets the documented deficits rather than an undifferentiated bundle label.",
    "reviewerNotes": "The guideline supports targeted multicomponent care, not an exclusive bundle or a proven superiority trial between these fictional sets. Clinical review must confirm this priority wording is sufficiently bounded.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b21.d1": "d1_4",
      "choice.qbp2b.20261104.b2b21.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b21.d1": null,
      "choice.qbp2b.20261104.b2b21.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b21.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b21.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.postoperative-delirium.multicomponent-prevention-plan.v4.r1",
      "conceptId": "concept.postoperative-delirium.multicomponent-prevention-plan",
      "stem": "Which addition should be prioritized in {patientName}'s hospital delirium-prevention plan?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Assisted walking, mealtime support and hydration review",
          "isCorrect": true,
          "rationale": "The observed mobility and intake deficits are modifiable contributors that a targeted multicomponent plan should address; intact conversation does not remove postoperative risk.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b21.d1",
          "label": "Sleep protection, glasses access and repeated reorientation",
          "isCorrect": false,
          "distractorRationale": "These are valuable prevention components, but the record does not identify them as the principal newly documented unmet functional/intake needs."
        },
        {
          "id": "choice.qbp2b.20261104.b2b21.d2",
          "label": "Analgesia review, bladder assessment and bowel monitoring",
          "isCorrect": false,
          "distractorRationale": "These are also appropriate components in selected patients; they do not directly address the current paired deficits driving this prioritization."
        }
      ],
      "explanation": "The observed mobility and intake deficits are modifiable contributors that a targeted multicomponent plan should address; intact conversation does not remove postoperative risk. These are valuable prevention components, but the record does not identify them as the principal newly documented unmet functional/intake needs. These are also appropriate components in selected patients; they do not directly address the current paired deficits driving this prioritization.",
      "teachingPoint": "The observed mobility and intake deficits are modifiable contributors that a targeted multicomponent plan should address; intact conversation does not remove postoperative risk.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.delirium.multicomponent-plan",
        "claim.qbp2b.b2b21.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.postoperative-delirium.multicomponent-prevention-plan",
      "nextConceptId": "concept.postoperative-delirium.multicomponent-prevention-plan",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-15",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Three equally sized named non-drug component sets replace the generic individualized key and implausible single-intervention foils.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
    "previousPresentation": "{patientName}, a 68-year-old woman, has mobility and nutrition vulnerabilities before major gastric surgery and will recover in the hospital.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has mobility and nutrition vulnerabilities before major gastric surgery and will recover in the hospital."
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.68",
        "presentation": "{patientName}, a 68-year-old man, has mobility and nutrition vulnerabilities before major gastric surgery and will recover in the hospital."
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.80",
        "presentation": "{patientName}, a 80-year-old woman, has mobility and nutrition vulnerabilities before major gastric surgery and will recover in the hospital."
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.80",
        "presentation": "{patientName}, a 80-year-old man, has mobility and nutrition vulnerabilities before major gastric surgery and will recover in the hospital."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 68,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Perioperative care planning",
    "previousChiefComplaint": "Preoperative team review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.68"
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.68"
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.80"
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.80"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b22",
    "auditId": "B2B22",
    "caseId": "case.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta",
    "nodeId": "node.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.1",
    "previousQuestionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v2",
    "questionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "What is the required next step after this patient with suspected acute mesenteric ischemia develops peritonitis?",
    "previousChoiceLabels": [
      "Transfer for emergency exploration",
      "Repeat CTA before treatment",
      "Continue anticoagulation alone",
      "Observe for laboratory improvement"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the interval rigid painful abdomen independently of a reassuring lactate. Then: Change the prior catheter-first destination to one that permits bowel assessment.",
    "reviewerNotes": "No claim that normal lactate excludes ischemia, and no universal vascular technique or numeric cutoff.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b22.d1": "d1_2",
      "choice.qbp2b.20261104.b2b22.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b22.d1": null,
      "choice.qbp2b.20261104.b2b22.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b22.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b22.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r1",
      "conceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "stem": "Which receiving-hospital pathway should be requested for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Operating theatre for bowel assessment and vascular planning",
          "isCorrect": true,
          "rationale": "The changed examination suggests peritoneal involvement requiring prompt bowel assessment; a normal lactate does not cancel the clinical change.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b22.d1",
          "label": "Angiography suite for catheter treatment and later bowel review",
          "isCorrect": false,
          "distractorRationale": "Catheter-first care can suit a different examination, but should not defer assessment of the newly rigid abdomen."
        },
        {
          "id": "choice.qbp2b.20261104.b2b22.d2",
          "label": "Monitored ward for anticoagulation and later bowel review",
          "isCorrect": false,
          "distractorRationale": "Medical treatment can be part of care, but a monitored bed does not supply the needed bowel assessment now."
        }
      ],
      "explanation": "The changed examination suggests peritoneal involvement requiring prompt bowel assessment; a normal lactate does not cancel the clinical change. Catheter-first care can suit a different examination, but should not defer assessment of the newly rigid abdomen. Medical treatment can be part of care, but a monitored bed does not supply the needed bowel assessment now.",
      "teachingPoint": "The changed examination suggests peritoneal involvement requiring prompt bowel assessment; a normal lactate does not cancel the clinical change.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.ami.peritonitis-exploration",
        "claim.qbp2b.b2b22.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "nextConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-16",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removes the peritonitis label and offers three real hospital destinations with parallel planning scope.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
    "previousPresentation": "{patientName}, a 59-year-old woman, brings a same-day outside CTA to the clinic confirming superior mesenteric arterial occlusion. While emergency transfer is being coordinated, the abdomen becomes diffusely tender with rebound and involuntary guarding.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.59",
        "presentation": "{patientName}, a 59-year-old woman, brings a same-day outside CTA to the clinic confirming superior mesenteric arterial occlusion. While emergency transfer is being coordinated, the abdomen becomes diffusely tender with rebound and involuntary guarding."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.59",
        "presentation": "{patientName}, a 59-year-old man, brings a same-day outside CTA to the clinic confirming superior mesenteric arterial occlusion. While emergency transfer is being coordinated, the abdomen becomes diffusely tender with rebound and involuntary guarding."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.73",
        "presentation": "{patientName}, a 73-year-old woman, brings a same-day outside CTA to the clinic confirming superior mesenteric arterial occlusion. While emergency transfer is being coordinated, the abdomen becomes diffusely tender with rebound and involuntary guarding."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.73",
        "presentation": "{patientName}, a 73-year-old man, brings a same-day outside CTA to the clinic confirming superior mesenteric arterial occlusion. While emergency transfer is being coordinated, the abdomen becomes diffusely tender with rebound and involuntary guarding."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 59,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Abdominal pain worsening",
    "previousChiefComplaint": "Pain suddenly worsened",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.59"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.59"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.73"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.73"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b23",
    "auditId": "B2B23",
    "caseId": "case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
    "nodeId": "node.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.1",
    "previousQuestionVariantId": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3",
    "questionVariantId": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which definitive intervention should have been completed before discharge after this patient's mild biliary pancreatitis?",
    "previousChoiceLabels": [
      "Index-admission cholecystectomy",
      "Elective surgery after a routine delay",
      "Observation until another episode",
      "ERCP with sphincterotomy alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Judge recovery/local complication status from the actual function and imaging rather than lipase in isolation. Then: Choose recurrence-prevention timing rather than a routine delay or duct procedure without a corresponding indication.",
    "reviewerNotes": "No enzyme, duct-calibre or organ-failure time threshold and no ERCP drug/procedural protocol.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b23.d1": "d1_3",
      "choice.qbp2b.20261104.b2b23.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b23.d1": null,
      "choice.qbp2b.20261104.b2b23.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b23.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.therapeutic_ercp"
      },
      "choice.qbp2b.20261104.b2b23.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r1",
      "conceptId": "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
      "stem": "Which plan should be taken to {patientName}'s discharge meeting?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Early laparoscopic cholecystectomy",
          "isCorrect": true,
          "rationale": "The clinical and imaging course fits the improving mild-biliary pathway; a residual enzyme elevation is not itself a reason for routine interval delay.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b23.d1",
          "label": "ERCP preceding laparoscopic cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "A residual lipase rise is not evidence of a retained duct stone requiring this sequence; ERCP does not replace gallbladder treatment in the offered fit-recovery scenario."
        },
        {
          "id": "choice.qbp2b.20261104.b2b23.d2",
          "label": "Delayed laparoscopic cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "Routine delay misses the index-admission recommendation when the patient is improving and no local complication requires a different course."
        }
      ],
      "explanation": "The clinical and imaging course fits the improving mild-biliary pathway; a residual enzyme elevation is not itself a reason for routine interval delay. A residual lipase rise is not evidence of a retained duct stone requiring this sequence; ERCP does not replace gallbladder treatment in the offered fit-recovery scenario. Routine delay misses the index-admission recommendation when the patient is improving and no local complication requires a different course.",
      "teachingPoint": "The clinical and imaging course fits the improving mild-biliary pathway; a residual enzyme elevation is not itself a reason for routine interval delay.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.pancreatitis.index-admission-cholecystectomy",
        "claim.qbp2b.b2b23.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
      "nextConceptId": "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-17",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removes the mild/ready-for-discharge labels and expertise permission; supplies the course needed to apply timing.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
    "previousPresentation": "{patientName}, a 30-year-old woman, asks in clinic about a recent discharge after mild biliary pancreatitis. The hospital record shows resolved pain, tolerated diet, no local pancreatic complication or persistent organ dysfunction, and available surgical expertise before discharge.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.30",
        "presentation": "{patientName}, a 30-year-old woman, asks in clinic about a recent discharge after mild biliary pancreatitis. The hospital record shows resolved pain, tolerated diet, no local pancreatic complication or persistent organ dysfunction, and available surgical expertise before discharge."
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.30",
        "presentation": "{patientName}, a 30-year-old man, asks in clinic about a recent discharge after mild biliary pancreatitis. The hospital record shows resolved pain, tolerated diet, no local pancreatic complication or persistent organ dysfunction, and available surgical expertise before discharge."
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.60",
        "presentation": "{patientName}, a 60-year-old woman, asks in clinic about a recent discharge after mild biliary pancreatitis. The hospital record shows resolved pain, tolerated diet, no local pancreatic complication or persistent organ dysfunction, and available surgical expertise before discharge."
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.60",
        "presentation": "{patientName}, a 60-year-old man, asks in clinic about a recent discharge after mild biliary pancreatitis. The hospital record shows resolved pain, tolerated diet, no local pancreatic complication or persistent organ dysfunction, and available surgical expertise before discharge."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 30,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Pancreatitis discharge planning",
    "previousChiefComplaint": "Ready for discharge",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.30"
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.30"
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.60"
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.60"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b24",
    "auditId": "B2B24",
    "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "previousQuestionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which preoperative plan best maps the treated site?",
    "previousChoiceLabels": [
      "Imaging with marker localization",
      "Planning from current examination alone",
      "Planning without marker localization",
      "Planning from baseline imaging alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the original marked bed and the current-versus-former outer boundaries as different locations after response. Then: Choose endpoints that cover the current target and original known bed rather than the unchanged larger footprint or a lateral segment that misses the bed.",
    "reviewerNotes": "Bracketing is an illustrative specialist localization plan; no margin width, fixed resection radius or universal imaging modality is authored. The unchanged later conservation task remains explicitly disclosed in sequence review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.20261104.b2b24.d1": "d1_1",
      "choice.qbp2b.20261104.b2b24.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.diagnostic_breast_imaging",
      "choice.qbp2b.20261104.b2b24.d1": null,
      "choice.qbp2b.20261104.b2b24.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.20261104.b2b24.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.20261104.b2b24.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      }
    },
    "question": {
      "id": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "stem": "Which endpoints should be requested for {patientName}'s image-guided bracketing?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Original marker to current enhancing edge",
          "isCorrect": true,
          "rationale": "This includes the known original biopsy bed and current residual extent, rather than copying the full pretreatment boundary or omitting the medial known bed.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b24.d1",
          "label": "Original marker to pretreatment outer edge",
          "isCorrect": false,
          "distractorRationale": "This preserves the known site but copies the larger pretreatment outer boundary instead of integrating the observed response."
        },
        {
          "id": "choice.qbp2b.20261104.b2b24.d2",
          "label": "Current enhancing edge to pretreatment outer edge",
          "isCorrect": false,
          "distractorRationale": "Both endpoints lie lateral to the marked bed; this misreads the response map and omits the known medial biopsy site."
        }
      ],
      "explanation": "This includes the known original biopsy bed and current residual extent, rather than copying the full pretreatment boundary or omitting the medial known bed. This preserves the known site but copies the larger pretreatment outer boundary instead of integrating the observed response. Both endpoints lie lateral to the marked bed; this misreads the response map and omits the known medial biopsy site.",
      "teachingPoint": "This includes the known original biopsy bed and current residual extent, rather than copying the full pretreatment boundary or omitting the medial known bed.",
      "supportingEvidenceClaimIds": [
        "claim.nact.response-mapping",
        "claim.qbp2b.b2b24.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Longitudinal breast map",
        "columnHeaders": [
          "Finding"
        ],
        "rowHeaders": [
          "Original biopsy marker",
          "Current enhancing edge",
          "Pretreatment outer edge"
        ],
        "cells": [
          [
            "Remains within the medial part of the known biopsy bed."
          ],
          [
            "Continuous enhancement runs from the marked bed to a lateral edge short of the pretreatment outer edge."
          ],
          [
            "Lies farther lateral; current imaging shows no enhancing or sonographic focus at that former outer extent."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "nextConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "previousKeyServiceId": "service.diagnostic_breast_imaging",
      "nextKeyServiceId": "service.diagnostic_breast_imaging",
      "previousResultGate": {
        "id": "gate.gs028b.marker-residual",
        "resultTypeId": "service.diagnostic_breast_imaging",
        "pendingLabel": "Post-treatment breast mapping pending",
        "resultNarrative": "Post-treatment imaging shows localized unifocal residual disease around the original marker with feasible localization for surgery.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.diagnostic_breast_imaging.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.gs028b.marker-residual",
        "resultTypeId": "service.diagnostic_breast_imaging",
        "pendingLabel": "Post-treatment breast mapping pending",
        "resultNarrative": "Post-treatment imaging shows localized unifocal residual disease around the original marker with feasible localization for surgery.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.diagnostic_breast_imaging.outsourced"
        ]
      },
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-18",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces a uniquely comprehensive integrated-plan key with all three two-endpoint combinations. Each landmark appears twice; the same existing result gate remains.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has completed neoadjuvant therapy for noninflammatory breast cancer. The original mass cannot now be felt. A marker was placed before therapy.",
    "previousPresentation": "{patientName}, a 42-year-old woman, presents after completing neoadjuvant therapy for noninflammatory breast cancer. The mass is no longer palpable, and a marker was placed at the original biopsy site before treatment.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.paired-marker-residual.female.42",
        "presentation": "{patientName}, a 42-year-old woman, presents after completing neoadjuvant therapy for noninflammatory breast cancer. The mass is no longer palpable, and a marker was placed at the original biopsy site before treatment."
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.paired-marker-residual.female.58",
        "presentation": "{patientName}, a 58-year-old woman, presents after completing neoadjuvant therapy for noninflammatory breast cancer. The mass is no longer palpable, and a marker was placed at the original biopsy site before treatment."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Post-treatment breast mapping",
    "previousChiefComplaint": "Plan surgery after therapy",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.paired-marker-residual.female.42"
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.paired-marker-residual.female.58"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b25",
    "auditId": "B2B25",
    "caseId": "case.gs028c.acute-cholecystitis.b-hida-confirmed",
    "nodeId": "node.gs028c.acute-cholecystitis.b-hida-confirmed.1",
    "previousQuestionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2",
    "questionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which definitive treatment plan should occur during this fit patient's admission for acute cholecystitis?",
    "previousChoiceLabels": [
      "Admit for laparoscopic cholecystectomy",
      "Discharge for interval cholecystectomy",
      "Hospital antibiotics with observation",
      "Percutaneous gallbladder drainage"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Reconcile the functional study with the earlier gallstone ultrasound rather than dismissing the episode as simple colic. Then: Use the current recovery state to choose surgery timing rather than a drainage or interval pathway.",
    "reviewerNotes": "No acquisition duration or augmentation protocol is invented. Nuclear-report interpretation and operative eligibility remain clinical review points.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b25.d1": "d1_2",
      "choice.qbp2b.20261104.b2b25.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b25.d1": null,
      "choice.qbp2b.20261104.b2b25.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b25.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b25.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r1",
      "conceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "stem": "Which treatment plan should be arranged for {patientName}'s admission?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Early laparoscopic cholecystectomy",
          "isCorrect": true,
          "rationale": "The returned study supports the acute gallbladder process despite the earlier limited inflammatory ultrasound findings. Current recovery supports the index-admission surgical pathway.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b25.d1",
          "label": "Percutaneous gallbladder drainage",
          "isCorrect": false,
          "distractorRationale": "Drainage can fit ongoing illness or a genuine operative contraindication; improvement does not establish a need to replace surgery with a drain."
        },
        {
          "id": "choice.qbp2b.20261104.b2b25.d2",
          "label": "Delayed laparoscopic cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "Symptom improvement does not by itself convert the demonstrated episode into a reason for routine delayed surgery."
        }
      ],
      "explanation": "The returned study supports the acute gallbladder process despite the earlier limited inflammatory ultrasound findings. Current recovery supports the index-admission surgical pathway. Drainage can fit ongoing illness or a genuine operative contraindication; improvement does not establish a need to replace surgery with a drain. Symptom improvement does not by itself convert the demonstrated episode into a reason for routine delayed surgery.",
      "teachingPoint": "The returned study supports the acute gallbladder process despite the earlier limited inflammatory ultrasound findings. Current recovery supports the index-admission surgical pathway.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qbp2b.b2b25.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "nextConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-19",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces “HIDA confirms”, “fit” and availability/exclusion sentences with raw report and function.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
    "previousPresentation": "{patientName}, a 47-year-old woman, brings an outside HIDA result to the clinic after ongoing biliary pain and inflammatory findings. The study confirms acute cholecystitis after an equivocal ultrasound. There is no shock, anesthetic contraindication, or organ failure, and hospital surgical expertise is available.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.47",
        "presentation": "{patientName}, a 47-year-old woman, brings an outside HIDA result to the clinic after ongoing biliary pain and inflammatory findings. The study confirms acute cholecystitis after an equivocal ultrasound. There is no shock, anesthetic contraindication, or organ failure, and hospital surgical expertise is available."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.47",
        "presentation": "{patientName}, a 47-year-old man, brings an outside HIDA result to the clinic after ongoing biliary pain and inflammatory findings. The study confirms acute cholecystitis after an equivocal ultrasound. There is no shock, anesthetic contraindication, or organ failure, and hospital surgical expertise is available."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.62",
        "presentation": "{patientName}, a 62-year-old woman, brings an outside HIDA result to the clinic after ongoing biliary pain and inflammatory findings. The study confirms acute cholecystitis after an equivocal ultrasound. There is no shock, anesthetic contraindication, or organ failure, and hospital surgical expertise is available."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.62",
        "presentation": "{patientName}, a 62-year-old man, brings an outside HIDA result to the clinic after ongoing biliary pain and inflammatory findings. The study confirms acute cholecystitis after an equivocal ultrasound. There is no shock, anesthetic contraindication, or organ failure, and hospital surgical expertise is available."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Biliary admission review",
    "previousChiefComplaint": "HIDA confirmed inflammation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.47"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.47"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.62"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.62"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b26",
    "auditId": "B2B26",
    "caseId": "case.gs028c.acute-cholecystitis.a-limited-ultrasound",
    "nodeId": "node.gs028c.acute-cholecystitis.a-limited-ultrasound.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which additional imaging study best addresses suspected acute cholecystitis after an equivocal ultrasound?",
    "previousChoiceLabels": [
      "Hepatobiliary scintigraphy",
      "Right-upper-quadrant ultrasound",
      "Contrast-enhanced abdominal CT",
      "Abdominal magnetic resonance imaging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the absence of two structural inflammatory signs does not explain away the continuing gallbladder-inflammatory course. Then: Choose a clarifying study for that remaining question rather than default to duct mapping or a broad complication survey.",
    "reviewerNotes": "WSES permits selected HIDA; it is not universally mandatory or claimed to be the only clinically reasonable imaging. Independent imaging review must confirm single-best ranking among the offered studies.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b26.d1": "d1_3",
      "choice.qbp2b.20261104.b2b26.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b26.d1": null,
      "choice.qbp2b.20261104.b2b26.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.qbp2b.20261104.b2b26.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qbp2b.20261104.b2b26.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      }
    },
    "question": {
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r1",
      "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "stem": "Which additional investigation should be requested for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": true,
          "rationale": "The gallstones and clinical inflammatory course remain discordant with a nondiagnostic structural inflammatory ultrasound pattern. Selected functional confirmation can clarify suspected acute cholecystitis.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b26.d1",
          "label": "Contrast-enhanced abdominal CT",
          "isCorrect": false,
          "distractorRationale": "CT can evaluate complications or competing abdominal causes; it is a credible alternative, but the focused unresolved gallbladder question favors the offered scintigraphic study in this constructed stable course."
        },
        {
          "id": "choice.qbp2b.20261104.b2b26.d2",
          "label": "Magnetic resonance cholangiopancreatography",
          "isCorrect": false,
          "distractorRationale": "Duct imaging is useful for a ductal question; the supplied course does not chiefly suggest obstruction of the common duct."
        }
      ],
      "explanation": "The gallstones and clinical inflammatory course remain discordant with a nondiagnostic structural inflammatory ultrasound pattern. Selected functional confirmation can clarify suspected acute cholecystitis. CT can evaluate complications or competing abdominal causes; it is a credible alternative, but the focused unresolved gallbladder question favors the offered scintigraphic study in this constructed stable course. Duct imaging is useful for a ductal question; the supplied course does not chiefly suggest obstruction of the common duct.",
      "teachingPoint": "The gallstones and clinical inflammatory course remain discordant with a nondiagnostic structural inflammatory ultrasound pattern. Selected functional confirmation can clarify suspected acute cholecystitis.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qbp2b.b2b26.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
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
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-20",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removes “equivocal” and HIDA-availability permission; keeps only the observations needed for fair study comparison.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
    "previousPresentation": "{patientName}, a 50-year-old woman, remains tender in the right upper quadrant at a clinic visit after several hours of constant pain. Ultrasound visualization is limited and the report is explicitly equivocal for acute cholecystitis. The patient has no shock or generalized peritonitis, and timely HIDA is available at the receiving hospital.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.50",
        "presentation": "{patientName}, a 50-year-old woman, remains tender in the right upper quadrant at a clinic visit after several hours of constant pain. Ultrasound visualization is limited and the report is explicitly equivocal for acute cholecystitis. The patient has no shock or generalized peritonitis, and timely HIDA is available at the receiving hospital."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.50",
        "presentation": "{patientName}, a 50-year-old man, remains tender in the right upper quadrant at a clinic visit after several hours of constant pain. Ultrasound visualization is limited and the report is explicitly equivocal for acute cholecystitis. The patient has no shock or generalized peritonitis, and timely HIDA is available at the receiving hospital."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.68",
        "presentation": "{patientName}, a 68-year-old woman, remains tender in the right upper quadrant at a clinic visit after several hours of constant pain. Ultrasound visualization is limited and the report is explicitly equivocal for acute cholecystitis. The patient has no shock or generalized peritonitis, and timely HIDA is available at the receiving hospital."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.68",
        "presentation": "{patientName}, a 68-year-old man, remains tender in the right upper quadrant at a clinic visit after several hours of constant pain. Ultrasound visualization is limited and the report is explicitly equivocal for acute cholecystitis. The patient has no shock or generalized peritonitis, and timely HIDA is available at the receiving hospital."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent right-upper-quadrant pain",
    "previousChiefComplaint": "Persistent biliary pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.50"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.50"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.68"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.68"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b29",
    "auditId": "B2B29",
    "caseId": "case.gs028d.hyperkalaemia.a-raas-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-raas-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v2",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "How should this confirmed severe community result be managed now?",
    "previousChoiceLabels": [
      "Immediate hospital assessment",
      "Routine follow-up next week",
      "Repeat testing before any action",
      "Dietary advice alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the actionable current specimen rather than the earlier or compromised result. Then: Apply the recorded community escalation boundary rather than symptom- or cause-based reassurance.",
    "reviewerNotes": "Uses the existing UKKA ≥6.5 mmol/L source boundary and existing observed values; no new dose, ECG exclusion rule, repeat interval or arrhythmia probability.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b29.d1": "d1_2",
      "choice.qbp2b.20261104.b2b29.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b29.d1": null,
      "choice.qbp2b.20261104.b2b29.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b29.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b29.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v2.r1",
      "conceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "stem": "Under the UKKA adult pathway, which plan should be arranged now for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Emergency hospital assessment and treatment",
          "isCorrect": true,
          "rationale": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b29.d1",
          "label": "Community medicine review with another outpatient sample",
          "isCorrect": false,
          "distractorRationale": "Medication and sample review matter, but should not replace hospital assessment once the current severe result is established."
        },
        {
          "id": "choice.qbp2b.20261104.b2b29.d2",
          "label": "Earlier routine renal appointment with a dietary plan",
          "isCorrect": false,
          "distractorRationale": "A renal/dietary plan can contribute later; it is not the appropriate current disposition for the confirmed result."
        }
      ],
      "explanation": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring. Medication and sample review matter, but should not replace hospital assessment once the current severe result is established. A renal/dietary plan can contribute later; it is not the appropriate current disposition for the confirmed result.",
      "teachingPoint": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.qbp2b.b2b29.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Community laboratory callback; collection order is shown",
        "columnHeaders": [
          "Potassium",
          "Specimen note"
        ],
        "rowHeaders": [
          "Earlier clinic panel",
          "Current callback panel"
        ],
        "cells": [
          [
            "Within the laboratory interval",
            "Collected before the medicine change"
          ],
          [
            "6.6 mmol/L",
            "Repeat specimen; not haemolysed; patient identity verified"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-23",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes transfer-availability permission and delayed-care caricatures; presents actual collection provenance and three named current care settings.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
    "previousPresentation": "{patientName}, a 46-year-old woman with a recent renin-angiotensin-system medication change, returns to clinic when an outside laboratory calls with a confirmed potassium of 6.6 mmol/L. The sample is confirmed and the patient is available for immediate transfer.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.46",
        "presentation": "{patientName}, a 46-year-old woman with a recent renin-angiotensin-system medication change, returns to clinic when an outside laboratory calls with a confirmed potassium of 6.6 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.46",
        "presentation": "{patientName}, a 46-year-old man with a recent renin-angiotensin-system medication change, returns to clinic when an outside laboratory calls with a confirmed potassium of 6.6 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.68",
        "presentation": "{patientName}, a 68-year-old woman with a recent renin-angiotensin-system medication change, returns to clinic when an outside laboratory calls with a confirmed potassium of 6.6 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.68",
        "presentation": "{patientName}, a 68-year-old man with a recent renin-angiotensin-system medication change, returns to clinic when an outside laboratory calls with a confirmed potassium of 6.6 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Potassium result review",
    "previousChiefComplaint": "Medication lab alert",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.46"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.46"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.68"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.68"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b30",
    "auditId": "B2B30",
    "caseId": "case.gs028d.hyperkalaemia.a-dehydration-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-dehydration-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v4",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "What action should follow this confirmed repeat community result?",
    "previousChoiceLabels": [
      "Immediate hospital assessment",
      "Routine follow-up next week",
      "Repeat testing before any action",
      "Dietary advice alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the actionable current specimen rather than the earlier or compromised result. Then: Apply the recorded community escalation boundary rather than symptom- or cause-based reassurance.",
    "reviewerNotes": "Uses the existing UKKA ≥6.5 mmol/L source boundary and existing observed values; no new dose, ECG exclusion rule, repeat interval or arrhythmia probability.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b30.d1": "d1_4",
      "choice.qbp2b.20261104.b2b30.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b30.d1": null,
      "choice.qbp2b.20261104.b2b30.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b30.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b30.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v4.r1",
      "conceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "stem": "Under the UKKA adult pathway, which plan should be arranged now for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Emergency hospital assessment and treatment",
          "isCorrect": true,
          "rationale": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b30.d1",
          "label": "Community medicine review with another outpatient sample",
          "isCorrect": false,
          "distractorRationale": "Medication and sample review matter, but should not replace hospital assessment once the current severe result is established."
        },
        {
          "id": "choice.qbp2b.20261104.b2b30.d2",
          "label": "Earlier routine renal appointment with a dietary plan",
          "isCorrect": false,
          "distractorRationale": "A renal/dietary plan can contribute later; it is not the appropriate current disposition for the confirmed result."
        }
      ],
      "explanation": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring. Medication and sample review matter, but should not replace hospital assessment once the current severe result is established. A renal/dietary plan can contribute later; it is not the appropriate current disposition for the confirmed result.",
      "teachingPoint": "The current confirmed severe result meets the recorded UKKA community escalation boundary, even if an earlier value or symptom impression is reassuring.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.qbp2b.b2b30.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Community laboratory callback; collection order is shown",
        "columnHeaders": [
          "Potassium",
          "Specimen note"
        ],
        "rowHeaders": [
          "First collection",
          "Repeat collection"
        ],
        "cells": [
          [
            "Potassium not released",
            "Haemolysis noted"
          ],
          [
            "6.5 mmol/L",
            "No haemolysis; result confirmed by the laboratory"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-24",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes transfer-availability permission and delayed-care caricatures; presents actual collection provenance and three named current care settings.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
    "previousPresentation": "{patientName}, a 31-year-old woman with recent gastrointestinal fluid loss, returns to clinic when an outside laboratory calls with a repeat non-haemolysed potassium of 6.5 mmol/L. The sample is confirmed and the patient is available for immediate transfer.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.31",
        "presentation": "{patientName}, a 31-year-old woman with recent gastrointestinal fluid loss, returns to clinic when an outside laboratory calls with a repeat non-haemolysed potassium of 6.5 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.31",
        "presentation": "{patientName}, a 31-year-old man with recent gastrointestinal fluid loss, returns to clinic when an outside laboratory calls with a repeat non-haemolysed potassium of 6.5 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.64",
        "presentation": "{patientName}, a 64-year-old woman with recent gastrointestinal fluid loss, returns to clinic when an outside laboratory calls with a repeat non-haemolysed potassium of 6.5 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.64",
        "presentation": "{patientName}, a 64-year-old man with recent gastrointestinal fluid loss, returns to clinic when an outside laboratory calls with a repeat non-haemolysed potassium of 6.5 mmol/L. The sample is confirmed and the patient is available for immediate transfer."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Potassium result review",
    "previousChiefComplaint": "Urgent lab callback",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.31"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.31"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.64"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.64"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b31",
    "auditId": "B2B31",
    "caseId": "case.gs028e.immunology.c3-injury-pathway",
    "nodeId": "node.gs028e.immunology.c3-injury-pathway.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v4",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v4.r1",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.1"
    ],
    "previousStem": "Which injury pathway best explains this patient's documented preformed-antibody hyperacute rejection?",
    "previousChoiceLabels": [
      "Antibody-associated complement vascular injury",
      "IgE-associated mast-cell mediator discharge",
      "T-cell-associated cellular graft rejection",
      "New-antibody-associated injury after sensitization"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Integrate the serum target/timing and endothelial tissue pattern rather than diagnosing from early dysfunction alone. Then: Choose the review pathway linked to that mechanism.",
    "reviewerNotes": "Not a Banff diagnostic algorithm; coexistence of mechanisms is possible and no treatment is prescribed. Near-duplication with B2B02 is proposed for manager merge review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.20261104.b2b31.d1": "d1_4",
      "choice.qbp2b.20261104.b2b31.d2": "d2_4"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.20261104.b2b31.d1": null,
      "choice.qbp2b.20261104.b2b31.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b31.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b31.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v4.r1",
      "conceptId": "concept.immunology.graft-evidence-to-review-focus.v1",
      "stem": "Which explanation and review focus best fit {patientName}'s graft event?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Humoral injury; review compatibility testing",
          "isCorrect": true,
          "rationale": "The tissue localization and serum specificity support pre-existing recipient reactivity against donor endothelium. That points the review toward compatibility rather than a newly formed response or mechanical failure.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b31.d1",
          "label": "Ischemic tubular injury; review perfusion records",
          "isCorrect": false,
          "distractorRationale": "Immediate dysfunction can follow preservation/perfusion injury, but that explanation does not integrate the donor-specific pre-event reactivity and endothelial complement pattern."
        },
        {
          "id": "choice.qbp2b.20261104.b2b31.d2",
          "label": "Cellular rejection; review immunosuppression records",
          "isCorrect": false,
          "distractorRationale": "Cellular rejection is a real transplant mechanism; the supplied vascular/serum pattern is not best explained by a predominantly cellular process."
        }
      ],
      "explanation": "The tissue localization and serum specificity support pre-existing recipient reactivity against donor endothelium. That points the review toward compatibility rather than a newly formed response or mechanical failure. Immediate dysfunction can follow preservation/perfusion injury, but that explanation does not integrate the donor-specific pre-event reactivity and endothelial complement pattern. Cellular rejection is a real transplant mechanism; the supplied vascular/serum pattern is not best explained by a predominantly cellular process.",
      "teachingPoint": "The tissue localization and serum specificity support pre-existing recipient reactivity against donor endothelium. That points the review toward compatibility rather than a newly formed response or mechanical failure.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.gs028e.t_cell_graft_comparison",
        "claim.qbp2b.b2b31.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
      "nextConceptId": "concept.immunology.graft-evidence-to-review-focus.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Replaces a supplied hyperacute diagnosis followed by mechanism recall with interpretation and a concrete case-review consequence; retain the original immunology mechanism concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-25",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes the hyperacute/preformed-antibody conclusions and replaces distant IgE/de novo foils with real transplant-event explanations and named review actions.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
    "previousPresentation": "{patientName}, a 52-year-old woman, is well at a clinic record-review visit. A transplant report definitively attributes a prior hyperacute rejection episode to preformed donor-specific antibodies. The patient asks how those antibodies caused the vascular findings described in the report.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.52",
        "presentation": "{patientName}, a 52-year-old woman, is well at a clinic record-review visit. A transplant report definitively attributes a prior hyperacute rejection episode to preformed donor-specific antibodies. The patient asks how those antibodies caused the vascular findings described in the report."
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.52",
        "presentation": "{patientName}, a 52-year-old man, is well at a clinic record-review visit. A transplant report definitively attributes a prior hyperacute rejection episode to preformed donor-specific antibodies. The patient asks how those antibodies caused the vascular findings described in the report."
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.73",
        "presentation": "{patientName}, a 73-year-old woman, is well at a clinic record-review visit. A transplant report definitively attributes a prior hyperacute rejection episode to preformed donor-specific antibodies. The patient asks how those antibodies caused the vascular findings described in the report."
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.73",
        "presentation": "{patientName}, a 73-year-old man, is well at a clinic record-review visit. A transplant report definitively attributes a prior hyperacute rejection episode to preformed donor-specific antibodies. The patient asks how those antibodies caused the vascular findings described in the report."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Graft-event explanation",
    "previousChiefComplaint": "Graft injury mechanism",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.52"
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.52"
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.73"
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.73"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b32",
    "auditId": "B2B32",
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which calculation best assesses whether unmeasured anions are accumulating in this patient?",
    "previousChoiceLabels": [
      "Albumin-corrected anion gap",
      "Uncorrected anion gap alone",
      "Bicarbonate concentration alone",
      "Uncorrected osmolar gap alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Use pH, carbon dioxide and bicarbonate directions together rather than interpreting low carbon dioxide in isolation. Then: Use the albumin-adjusted gap report to choose an unmeasured-anion workup despite a reassuring raw gap.",
    "reviewerNotes": "The laboratory supplies the adjusted result. No correction formula, pH/CO2/anion threshold, compensation formula or dose is invented. The exact lactate/ketone-versus-urinary-workup application requires French-guideline/source-alignment clinical review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.20261104.b2b32.d1": "d1_1",
      "choice.qbp2b.20261104.b2b32.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.20261104.b2b32.d1": null,
      "choice.qbp2b.20261104.b2b32.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.20261104.b2b32.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.20261104.b2b32.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r1",
      "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "stem": "Which investigation should the hospital team pursue for {patientName}'s reported episode?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Serum lactate and blood-ketone testing",
          "isCorrect": true,
          "rationale": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin. Etiologic testing is warranted rather than classifying from the raw gap.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b32.d1",
          "label": "Renal acidification testing with urinary electrolytes",
          "isCorrect": false,
          "distractorRationale": "Renal acidification can be relevant to a normal-gap process, but that classification cannot be made from the raw gap when the albumin-adjusted result is elevated."
        },
        {
          "id": "choice.qbp2b.20261104.b2b32.d2",
          "label": "Ventilation reassessment with a repeat blood gas",
          "isCorrect": false,
          "distractorRationale": "A repeat gas may be indicated by clinical change, but the supplied panel already establishes an acidifying metabolic contribution; a low carbon dioxide is not by itself proof of primary respiratory alkalosis."
        }
      ],
      "explanation": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin. Etiologic testing is warranted rather than classifying from the raw gap. Renal acidification can be relevant to a normal-gap process, but that classification cannot be made from the raw gap when the albumin-adjusted result is elevated. A repeat gas may be indicated by clinical change, but the supplied panel already establishes an acidifying metabolic contribution; a low carbon dioxide is not by itself proof of primary respiratory alkalosis.",
      "teachingPoint": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin. Etiologic testing is warranted rather than classifying from the raw gap.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.corrected-gap",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.b2b32.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Admission laboratory observations",
        "columnHeaders": [
          "Reported relation to this laboratory’s reference interval"
        ],
        "rowHeaders": [
          "pH",
          "Carbon dioxide",
          "Bicarbonate",
          "Albumin",
          "Raw anion gap",
          "Albumin-adjusted anion gap"
        ],
        "cells": [
          [
            "Below"
          ],
          [
            "Below"
          ],
          [
            "Below"
          ],
          [
            "Substantially below"
          ],
          [
            "Within"
          ],
          [
            "Above"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.albumin-corrected-anion-gap",
      "nextConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes choosing the name of a calculation into selecting the etiologic investigation supported by a laboratory report; retain the original corrected-gap concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-26",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces “which calculation” and four “alone” options with actual reported data and three specific etiologic investigation plans.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
    "previousPresentation": "{patientName}, a 49-year-old woman with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.49",
        "presentation": "{patientName}, a 49-year-old woman with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.49",
        "presentation": "{patientName}, a 49-year-old man with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.67",
        "presentation": "{patientName}, a 67-year-old woman with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.67",
        "presentation": "{patientName}, a 67-year-old man with cirrhosis brings a complete outside panel confirming metabolic acidosis and marked hypoalbuminaemia."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 49,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Hospital acid-base review",
    "previousChiefComplaint": "Acidosis panel review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.49"
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.49"
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.67"
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.67"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b33",
    "auditId": "B2B33",
    "caseId": "case.gs028d.acid-base.b-malnutrition-gap",
    "nodeId": "node.gs028d.acid-base.b-malnutrition-gap.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which reported value should guide classification of anion accumulation?",
    "previousChoiceLabels": [
      "Albumin-corrected anion gap",
      "Raw anion gap only",
      "Albumin concentration alone",
      "Uncorrected osmolar gap alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Use pH, carbon dioxide and bicarbonate directions together rather than interpreting low carbon dioxide in isolation. Then: Use the albumin-adjusted gap report to choose an unmeasured-anion workup despite a reassuring raw gap.",
    "reviewerNotes": "The laboratory supplies the adjusted result. No correction formula, pH/CO2/anion threshold, compensation formula or dose is invented. The exact lactate/ketone-versus-urinary-workup application requires French-guideline/source-alignment clinical review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b33.d1": "d1_2",
      "choice.qbp2b.20261104.b2b33.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b33.d1": null,
      "choice.qbp2b.20261104.b2b33.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.20261104.b2b33.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.20261104.b2b33.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r1",
      "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "stem": "Which investigation should the hospital team pursue for {patientName}'s reported episode?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Serum lactate and blood-ketone testing",
          "isCorrect": true,
          "rationale": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin. Etiologic testing is warranted rather than classifying from the raw gap.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b33.d1",
          "label": "Renal acidification testing with urinary electrolytes",
          "isCorrect": false,
          "distractorRationale": "Renal acidification can be relevant to a normal-gap process, but that classification cannot be made from the raw gap when the albumin-adjusted result is elevated."
        },
        {
          "id": "choice.qbp2b.20261104.b2b33.d2",
          "label": "Ventilation reassessment with a repeat blood gas",
          "isCorrect": false,
          "distractorRationale": "A repeat gas may be indicated by clinical change, but the supplied panel already establishes an acidifying metabolic contribution; a low carbon dioxide is not by itself proof of primary respiratory alkalosis."
        }
      ],
      "explanation": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin. Etiologic testing is warranted rather than classifying from the raw gap. Renal acidification can be relevant to a normal-gap process, but that classification cannot be made from the raw gap when the albumin-adjusted result is elevated. A repeat gas may be indicated by clinical change, but the supplied panel already establishes an acidifying metabolic contribution; a low carbon dioxide is not by itself proof of primary respiratory alkalosis.",
      "teachingPoint": "The blood-gas direction supports a metabolic acidifying process, and the adjusted gap supports an unmeasured-anion component hidden by the low albumin. Etiologic testing is warranted rather than classifying from the raw gap.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.corrected-gap",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.b2b33.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Completed admission panel",
        "columnHeaders": [
          "Reported relation to this laboratory’s reference interval"
        ],
        "rowHeaders": [
          "pH",
          "Carbon dioxide",
          "Bicarbonate",
          "Albumin",
          "Raw anion gap",
          "Albumin-adjusted anion gap"
        ],
        "cells": [
          [
            "Below"
          ],
          [
            "Below"
          ],
          [
            "Below"
          ],
          [
            "Below"
          ],
          [
            "Near the lower end of the interval"
          ],
          [
            "Above"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.albumin-corrected-anion-gap",
      "nextConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes choosing the name of a calculation into selecting the etiologic investigation supported by a laboratory report; retain the original corrected-gap concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-27",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces “which calculation” and four “alone” options with actual reported data and three specific etiologic investigation plans.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
    "previousPresentation": "{patientName}, a 38-year-old woman recovering from prolonged poor intake has a complete outside blood-gas and chemistry panel showing metabolic acidosis with low albumin.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.38",
        "presentation": "{patientName}, a 38-year-old woman recovering from prolonged poor intake has a complete outside blood-gas and chemistry panel showing metabolic acidosis with low albumin."
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.38",
        "presentation": "{patientName}, a 38-year-old man recovering from prolonged poor intake has a complete outside blood-gas and chemistry panel showing metabolic acidosis with low albumin."
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.63",
        "presentation": "{patientName}, a 63-year-old woman recovering from prolonged poor intake has a complete outside blood-gas and chemistry panel showing metabolic acidosis with low albumin."
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.63",
        "presentation": "{patientName}, a 63-year-old man recovering from prolonged poor intake has a complete outside blood-gas and chemistry panel showing metabolic acidosis with low albumin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 38,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Hospital acid-base review",
    "previousChiefComplaint": "Nutrition lab review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.38"
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.38"
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.63"
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.63"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b34",
    "auditId": "B2B34",
    "caseId": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "nodeId": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which interpretation avoids underestimating unmeasured anion accumulation in the admission record?",
    "previousChoiceLabels": [
      "Albumin-corrected anion gap",
      "Uncorrected anion gap alone",
      "Uncorrected osmolar gap alone",
      "Serum lactate level alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the acidifying metabolic admission pattern despite the raw gap. Then: Interpret the adjusted longitudinal trend before deciding which episode has evidence of an anion burden.",
    "reviewerNotes": "A within-range panel does not exclude every disease. This narrow retrospective request concerns the evidence for an unmeasured-anion metabolic contribution, not current sepsis treatment.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b34.d1": "d1_3",
      "choice.qbp2b.20261104.b2b34.d2": "d2_3",
      "choice.qbp2b.20261104.b2b34.d3": "d3_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b34.d1": null,
      "choice.qbp2b.20261104.b2b34.d2": null,
      "choice.qbp2b.20261104.b2b34.d3": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b34.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b34.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b34.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r1",
      "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "stem": "Which episode should receive an unmeasured-anion cause review for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Investigate admission causes",
          "isCorrect": true,
          "rationale": "The admission gas and adjusted gap support an unmeasured-anion metabolic contribution. The higher current raw gap accompanies albumin recovery, while the current adjusted gap and gas are within range.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b34.d1",
          "label": "Investigate the current episode",
          "isCorrect": false,
          "distractorRationale": "A rising raw gap is tempting, but does not establish a new anion burden when albumin and the adjusted report change in this direction."
        },
        {
          "id": "choice.qbp2b.20261104.b2b34.d2",
          "label": "Investigate both episodes",
          "isCorrect": false,
          "distractorRationale": "This applies the admission concern to the current panel without interpreting the recovered gas/albumin-adjusted result."
        },
        {
          "id": "choice.qbp2b.20261104.b2b34.d3",
          "label": "Investigate neither episode",
          "isCorrect": false,
          "distractorRationale": "A raw gap within range at admission does not rule out an unmeasured-anion component during marked hypoalbuminaemia."
        }
      ],
      "explanation": "The admission gas and adjusted gap support an unmeasured-anion metabolic contribution. The higher current raw gap accompanies albumin recovery, while the current adjusted gap and gas are within range. A rising raw gap is tempting, but does not establish a new anion burden when albumin and the adjusted report change in this direction. This applies the admission concern to the current panel without interpreting the recovered gas/albumin-adjusted result. A raw gap within range at admission does not rule out an unmeasured-anion component during marked hypoalbuminaemia.",
      "teachingPoint": "The admission gas and adjusted gap support an unmeasured-anion metabolic contribution. The higher current raw gap accompanies albumin recovery, while the current adjusted gap and gas are within range.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.corrected-gap",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.b2b34.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Both columns use this laboratory’s own reference intervals",
        "columnHeaders": [
          "Admission",
          "Current"
        ],
        "rowHeaders": [
          "pH",
          "Carbon dioxide",
          "Bicarbonate",
          "Albumin",
          "Raw anion gap",
          "Albumin-adjusted anion gap"
        ],
        "cells": [
          [
            "Below",
            "Within"
          ],
          [
            "Below",
            "Within"
          ],
          [
            "Below",
            "Within"
          ],
          [
            "Substantially below",
            "Within"
          ],
          [
            "Within",
            "At the upper end of the interval"
          ],
          [
            "Above",
            "Within"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.albumin-corrected-anion-gap",
      "nextConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes choosing the name of a calculation into selecting the etiologic investigation supported by a laboratory report; retain the original corrected-gap concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-28",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Introduces a consequential time-point choice rather than another calculation-name item; no formula or cutoff is supplied by the author.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
    "previousPresentation": "{patientName}, a 45-year-old woman is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45",
        "presentation": "{patientName}, a 45-year-old woman is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45",
        "presentation": "{patientName}, a 45-year-old man is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72",
        "presentation": "{patientName}, a 72-year-old woman is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72",
        "presentation": "{patientName}, a 72-year-old man is stable after a hospital admission for sepsis. Outside records show metabolic acidosis during admission and a substantially reduced albumin level."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Hospital laboratory trend",
    "previousChiefComplaint": "Hospital panel question",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45"
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45"
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72"
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b35",
    "auditId": "B2B35",
    "caseId": "case.gs028d.acid-base.a-tachypnea-low-bicarb",
    "nodeId": "node.gs028d.acid-base.a-tachypnea-low-bicarb.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3",
    "questionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-10-03.coverage-gaps.1"
    ],
    "previousStem": "Which missing study best distinguishes metabolic acidosis with compensation from respiratory alkalosis or a mixed disorder?",
    "previousChoiceLabels": [
      "External blood gas",
      "Chest radiograph alone",
      "Serum albumin alone",
      "Urine ketones alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Keep metabolic, respiratory and mixed explanations alive instead of accepting the note’s hyperventilation label. Then: Select the specimen needed before a cause-classification test.",
    "reviewerNotes": "No acidemia inferred from bicarbonate alone; no compensation equation, universal arterial preference or blood-gas threshold.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.20261104.b2b35.d1": "d1_3",
      "choice.qbp2b.20261104.b2b35.d2": "d2_3"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.20261104.b2b35.d1": null,
      "choice.qbp2b.20261104.b2b35.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.20261104.b2b35.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.20261104.b2b35.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r1",
      "conceptId": "concept.metabolic-acidosis.confirm-with-blood-gas",
      "stem": "Which additional test should guide {patientName}'s acid-base evaluation at that stage?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Blood gas with pH and carbon dioxide",
          "isCorrect": true,
          "rationale": "The low bicarbonate can participate in metabolic acidosis, compensation for respiratory alkalosis, or a mixed process. Gas assessment establishes the direction before selecting a cause-specific workup.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b35.d1",
          "label": "Serum lactate and blood ketones",
          "isCorrect": false,
          "distractorRationale": "These may identify metabolic causes, but do not settle whether the reduced bicarbonate primarily accompanies an acidifying or respiratory process."
        },
        {
          "id": "choice.qbp2b.20261104.b2b35.d2",
          "label": "Repeat chemistry with an albumin-adjusted anion gap",
          "isCorrect": false,
          "distractorRationale": "Gap assessment helps classify an established metabolic contribution; it does not replace the pH/carbon-dioxide assessment at this unresolved stage."
        }
      ],
      "explanation": "The low bicarbonate can participate in metabolic acidosis, compensation for respiratory alkalosis, or a mixed process. Gas assessment establishes the direction before selecting a cause-specific workup. These may identify metabolic causes, but do not settle whether the reduced bicarbonate primarily accompanies an acidifying or respiratory process. Gap assessment helps classify an established metabolic contribution; it does not replace the pH/carbon-dioxide assessment at this unresolved stage.",
      "teachingPoint": "The low bicarbonate can participate in metabolic acidosis, compensation for respiratory alkalosis, or a mixed process. Gas assessment establishes the direction before selecting a cause-specific workup.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.blood-gas",
        "claim.gs028d.acidosis.corrected-gap",
        "claim.qbp2b.b2b35.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.confirm-with-blood-gas",
      "nextConceptId": "concept.metabolic-acidosis.confirm-with-blood-gas",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-29",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces the explicit missing-pH/CO2 sentence and unrelated imaging foils with three realistic acid-base investigations.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
    "previousPresentation": "{patientName}, a 28-year-old woman, is clinically stable after an outside urgent-care visit for tachypnea. The chemistry panel had reduced bicarbonate, but the record contains no pH or carbon dioxide value.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.28",
        "presentation": "{patientName}, a 28-year-old woman, is clinically stable after an outside urgent-care visit for tachypnea. The chemistry panel had reduced bicarbonate, but the record contains no pH or carbon dioxide value."
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.28",
        "presentation": "{patientName}, a 28-year-old man, is clinically stable after an outside urgent-care visit for tachypnea. The chemistry panel had reduced bicarbonate, but the record contains no pH or carbon dioxide value."
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.46",
        "presentation": "{patientName}, a 46-year-old woman, is clinically stable after an outside urgent-care visit for tachypnea. The chemistry panel had reduced bicarbonate, but the record contains no pH or carbon dioxide value."
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.46",
        "presentation": "{patientName}, a 46-year-old man, is clinically stable after an outside urgent-care visit for tachypnea. The chemistry panel had reduced bicarbonate, but the record contains no pH or carbon dioxide value."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 28,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Rapid breathing review",
    "previousChiefComplaint": "Fast breathing follow-up",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.28"
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.28"
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.46"
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.46"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b36",
    "auditId": "B2B36",
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "previousQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which imaging study should evaluate {patientName}'s persistent palpable breast finding after negative diagnostic mammography?",
    "previousChoiceLabels": [
      "Targeted breast ultrasound",
      "Repeat diagnostic mammography",
      "Breast MRI",
      "Contrast-enhanced chest CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Match the current lump to the actual image labels rather than the reassuring report heading. Then: Request the study that completes evaluation at the correct site.",
    "reviewerNotes": "The gate continues to use the existing ultrasound service/routes; no new imaging execution or biopsy rule is encoded here.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.20261104.b2b36.d1": "d1_1",
      "choice.qbp2b.20261104.b2b36.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.ultrasound",
      "choice.qbp2b.20261104.b2b36.d1": null,
      "choice.qbp2b.20261104.b2b36.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2b.20261104.b2b36.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mammography"
      },
      "choice.qbp2b.20261104.b2b36.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      }
    },
    "question": {
      "id": "question.palpable-breast.negative-mammogram-targeted-us.v1.r1",
      "conceptId": "concept.palpable-breast.site-concordant-imaging.v1",
      "stem": "Which imaging request should be made for {patientName}'s palpable site?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Ultrasound at the marked lower inner site",
          "isCorrect": true,
          "rationale": "The attached cyst is not a correlate for the skin-marker target; site-concordant targeted ultrasound is still needed.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b36.d1",
          "label": "Mammography at the marked lower inner site",
          "isCorrect": false,
          "distractorRationale": "That site has already been marked and assessed mammographically; repeating the same modality does not resolve the sonographic target mismatch."
        },
        {
          "id": "choice.qbp2b.20261104.b2b36.d2",
          "label": "Contrast-enhanced MRI of the left breast",
          "isCorrect": false,
          "distractorRationale": "Escalating to MRI does not substitute for completion of standard targeted evaluation at the actual clinical site."
        }
      ],
      "explanation": "The attached cyst is not a correlate for the skin-marker target; site-concordant targeted ultrasound is still needed. That site has already been marked and assessed mammographically; repeating the same modality does not resolve the sonographic target mismatch. Escalating to MRI does not substitute for completion of standard targeted evaluation at the actual clinical site.",
      "teachingPoint": "The attached cyst is not a correlate for the skin-marker target; site-concordant targeted ultrasound is still needed.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.qbp2b.b2b36.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "nextConceptId": "concept.palpable-breast.site-concordant-imaging.v1",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
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
      "nextResultGate": {
        "id": "gate.gs028c.dense-focal",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted breast ultrasound pending",
        "resultNarrative": "Targeted ultrasound at the lower inner skin marker shows tissue planes without a focal cystic or solid correlate. The clinician can still feel the same discrete firm lump at that marker.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.in_house",
          "route.ultrasound.outsourced"
        ]
      },
      "reason": "Changes simple modality recall after negative mammography into assessment of anatomical concordance and a corrective study request; retain the old imaging concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-30",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Specifies the actual mammographic and ultrasound observations; versions the existing gate narrative to state the returned finding without the word negative.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location.",
    "previousPresentation": "{patientName}, a 44-year-old woman, has a reproducible focal lump in dense breast tissue. Diagnostic mammography is negative, and the exact palpable area has not been assessed with ultrasound.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
        "presentation": "{patientName}, a 44-year-old woman, has a reproducible focal lump in dense breast tissue. Diagnostic mammography is negative, and the exact palpable area has not been assessed with ultrasound."
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
        "presentation": "{patientName}, a 58-year-old woman, has a reproducible focal lump in dense breast tissue. Diagnostic mammography is negative, and the exact palpable area has not been assessed with ultrasound."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent breast lump",
    "previousChiefComplaint": "Persistent breast lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44"
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58"
      }
    ],
    "resultNarrative": "Targeted ultrasound at the lower inner skin marker shows tissue planes without a focal cystic or solid correlate. The clinician can still feel the same discrete firm lump at that marker.",
    "previousResultNarrative": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass."
  },
  {
    "id": "revision.qbp2b.20261104.b2b37",
    "auditId": "B2B37",
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.2",
    "previousQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which next diagnostic step should evaluate {patientName}'s clinically suspicious palpable breast mass despite negative mammography and ultrasound?",
    "previousChoiceLabels": [
      "Breast-specialist biopsy referral",
      "Contrast-enhanced breast MRI",
      "Repeat targeted breast ultrasound",
      "Repeat diagnostic mammography"
    ],
    "previousCurrentUpdate": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
    "previousExhibit": null,
    "currentUpdate": "The radiologist performs targeted ultrasound at the lower inner skin marker. Tissue planes are seen without a focal cystic or solid correlate. The clinician again feels a discrete firm lump at that same marker, with an irregular edge and limited mobility relative to the surrounding tissue.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Verify that the new study really matches the clinical site, then recognize persistent clinical discordance rather than another site mismatch. Then: Choose tissue assessment instead of serial reassurance or escalation to MRI as a substitute.",
    "reviewerNotes": "Palpation-directed core is an illustrative breast-team request, not a mandate where surgical sampling or a different local technique is more suitable.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.20261104.b2b37.d1": "d1_1",
      "choice.qbp2b.20261104.b2b37.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.20261104.b2b37.d1": null,
      "choice.qbp2b.20261104.b2b37.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_core_biopsy"
      },
      "choice.qbp2b.20261104.b2b37.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      },
      "choice.qbp2b.20261104.b2b37.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r1",
      "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "stem": "Which diagnostic plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Palpation-directed core sampling through the breast team",
          "isCorrect": true,
          "rationale": "After completed site-concordant imaging, a persistently suspicious palpable target requires tissue evaluation; the absence of a sonographic target does not remove the clinical one.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b37.d1",
          "label": "Contrast-enhanced MRI through the breast team",
          "isCorrect": false,
          "distractorRationale": "MRI can contribute in selected cases, but should not displace tissue assessment of this persistent clinically suspicious palpable target."
        },
        {
          "id": "choice.qbp2b.20261104.b2b37.d2",
          "label": "Short-interval clinical and ultrasound review through the breast team",
          "isCorrect": false,
          "distractorRationale": "Surveillance can fit a concordant reassuring examination; the present target remains clinically discordant despite a correctly located study."
        }
      ],
      "explanation": "After completed site-concordant imaging, a persistently suspicious palpable target requires tissue evaluation; the absence of a sonographic target does not remove the clinical one. MRI can contribute in selected cases, but should not displace tissue assessment of this persistent clinically suspicious palpable target. Surveillance can fit a concordant reassuring examination; the present target remains clinically discordant despite a correctly located study.",
      "teachingPoint": "After completed site-concordant imaging, a persistently suspicious palpable target requires tissue evaluation; the absence of a sonographic target does not remove the clinical one.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.b2b37.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
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
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-31",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Defines what both modalities showed and makes the new concordant study distinct from the earlier wrong-site attachment; does not teach the biopsy answer in earlier feedback.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2b.20261104.b2b38",
    "auditId": "B2B38",
    "caseId": "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "nodeId": "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-09-17.bread-and-butter.1"
    ],
    "previousStem": "Which treatment should {patientName} receive now?",
    "previousChoiceLabels": [
      "Arrange incision and drainage",
      "Give oral antibiotics alone",
      "Use warm compresses alone",
      "Perform needle aspiration alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the persisting superficial collection despite a reassuring or distracting feature. Then: Use the actual surrounding skin/host observations to choose antibiotic scope alongside definitive drainage.",
    "reviewerNotes": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_1": "drain_1",
      "choice.qbp2b.20261104.b2b38.d1": "antibiotic_1",
      "choice.qbp2b.20261104.b2b38.d2": "compress_1",
      "choice.qbp2b.20261104.b2b38.d3": "aspirate_1"
    },
    "choiceServiceOverrides": {
      "drain_1": null,
      "choice.qbp2b.20261104.b2b38.d1": null,
      "choice.qbp2b.20261104.b2b38.d2": null,
      "choice.qbp2b.20261104.b2b38.d3": null
    },
    "choiceTimingOverrides": {
      "drain_1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b38.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b38.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b38.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v1.r1",
      "conceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "stem": "Which treatment plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_1",
          "label": "Open drainage with local wound care",
          "isCorrect": true,
          "rationale": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b38.d1",
          "label": "Open drainage with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present."
        },
        {
          "id": "choice.qbp2b.20261104.b2b38.d2",
          "label": "Needle aspiration with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity."
        },
        {
          "id": "choice.qbp2b.20261104.b2b38.d3",
          "label": "Needle aspiration with local wound care",
          "isCorrect": false,
          "distractorRationale": "This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity."
        }
      ],
      "explanation": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control. Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present. The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity. This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity.",
      "teachingPoint": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.b2b38.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.prompt-drainage",
      "nextConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes prompt-drainage recall into a two-component source-control/antibiotic decision; retain the original drainage concept and histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-32",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces four one-rule drainage labels with a balanced procedure-by-antibiotic matrix; no “alone” and no uniquely comprehensive key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
    "previousPresentation": "{patientName} is a 31-year-old woman who has an acutely tender, fluctuant superficial swelling beside the anal opening. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.31",
        "presentation": "{patientName} is a 31-year-old woman who has an acutely tender, fluctuant superficial swelling beside the anal opening. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.31",
        "presentation": "{patientName} is a 31-year-old man who has an acutely tender, fluctuant superficial swelling beside the anal opening. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.52",
        "presentation": "{patientName} is a 52-year-old woman who has an acutely tender, fluctuant superficial swelling beside the anal opening. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.52",
        "presentation": "{patientName} is a 52-year-old man who has an acutely tender, fluctuant superficial swelling beside the anal opening. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Painful perianal swelling",
    "previousChiefComplaint": "Painful perianal lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.52"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.52"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b39",
    "auditId": "B2B39",
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v2",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-17.bread-and-butter.1"
    ],
    "previousStem": "Which treatment should {patientName} receive now?",
    "previousChoiceLabels": [
      "Arrange incision and drainage",
      "Give oral antibiotics alone",
      "Use warm compresses alone",
      "Perform needle aspiration alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the persisting superficial collection despite a reassuring or distracting feature. Then: Use the actual surrounding skin/host observations to choose antibiotic scope alongside definitive drainage.",
    "reviewerNotes": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_2": "drain_2",
      "choice.qbp2b.20261104.b2b39.d1": "antibiotic_2",
      "choice.qbp2b.20261104.b2b39.d2": "compress_2",
      "choice.qbp2b.20261104.b2b39.d3": "aspirate_2"
    },
    "choiceServiceOverrides": {
      "drain_2": null,
      "choice.qbp2b.20261104.b2b39.d1": null,
      "choice.qbp2b.20261104.b2b39.d2": null,
      "choice.qbp2b.20261104.b2b39.d3": null
    },
    "choiceTimingOverrides": {
      "drain_2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b39.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b39.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b39.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v2.r1",
      "conceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "stem": "Which treatment plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_2",
          "label": "Open drainage with systemic antibiotics",
          "isCorrect": true,
          "rationale": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b39.d1",
          "label": "Open drainage with local wound care",
          "isCorrect": false,
          "distractorRationale": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control."
        },
        {
          "id": "choice.qbp2b.20261104.b2b39.d2",
          "label": "Needle aspiration with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity."
        },
        {
          "id": "choice.qbp2b.20261104.b2b39.d3",
          "label": "Needle aspiration with local wound care",
          "isCorrect": false,
          "distractorRationale": "This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity."
        }
      ],
      "explanation": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present. Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control. The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity. This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity.",
      "teachingPoint": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.b2b39.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.prompt-drainage",
      "nextConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes prompt-drainage recall into a two-component source-control/antibiotic decision; retain the original drainage concept and histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-33",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces four one-rule drainage labels with a balanced procedure-by-antibiotic matrix; no “alone” and no uniquely comprehensive key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
    "previousPresentation": "{patientName} is a 31-year-old woman who has a focal red, fluctuant superficial perianal swelling with marked tenderness. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.31",
        "presentation": "{patientName} is a 31-year-old woman who has a focal red, fluctuant superficial perianal swelling with marked tenderness. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.31",
        "presentation": "{patientName} is a 31-year-old man who has a focal red, fluctuant superficial perianal swelling with marked tenderness. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.52",
        "presentation": "{patientName} is a 52-year-old woman who has a focal red, fluctuant superficial perianal swelling with marked tenderness. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.52",
        "presentation": "{patientName} is a 52-year-old man who has a focal red, fluctuant superficial perianal swelling with marked tenderness. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Painful perianal swelling",
    "previousChiefComplaint": "Perianal swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.52"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.52"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b40",
    "auditId": "B2B40",
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v3",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r1",
    "previousContentVersions": [
      "development-batch.2026-09-17.bread-and-butter.1"
    ],
    "previousStem": "Which treatment should {patientName} receive now?",
    "previousChoiceLabels": [
      "Arrange incision and drainage",
      "Give oral antibiotics alone",
      "Use warm compresses alone",
      "Perform needle aspiration alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the persisting superficial collection despite a reassuring or distracting feature. Then: Use the actual surrounding skin/host observations to choose antibiotic scope alongside definitive drainage.",
    "reviewerNotes": "The selective-antibiotic recommendation is weak. No drug, dose, exact redness extent, tract division or incision technique is specified; clinician must verify the host/skin boundary.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_3": "drain_3",
      "choice.qbp2b.20261104.b2b40.d1": "antibiotic_3",
      "choice.qbp2b.20261104.b2b40.d2": "compress_3",
      "choice.qbp2b.20261104.b2b40.d3": "aspirate_3"
    },
    "choiceServiceOverrides": {
      "drain_3": null,
      "choice.qbp2b.20261104.b2b40.d1": null,
      "choice.qbp2b.20261104.b2b40.d2": null,
      "choice.qbp2b.20261104.b2b40.d3": null
    },
    "choiceTimingOverrides": {
      "drain_3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b40.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b40.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.20261104.b2b40.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v3.r1",
      "conceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "stem": "Which treatment plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_3",
          "label": "Open drainage with local wound care",
          "isCorrect": true,
          "rationale": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b40.d1",
          "label": "Open drainage with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present."
        },
        {
          "id": "choice.qbp2b.20261104.b2b40.d2",
          "label": "Needle aspiration with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity."
        },
        {
          "id": "choice.qbp2b.20261104.b2b40.d3",
          "label": "Needle aspiration with local wound care",
          "isCorrect": false,
          "distractorRationale": "This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity."
        }
      ],
      "explanation": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control. Definitive incision/drainage addresses the cavity; systemic antibiotics are also supported when spreading cellulitis or impaired host defense is present. The antibiotic component can be appropriate in selected patients, but aspiration is not the preferred complete source-control treatment for this superficial anorectal pus cavity. This is a less invasive option some residents may favor, but it does not provide the recommended definitive drainage of the demonstrated cavity.",
      "teachingPoint": "Drainage is essential. Local aftercare rather than routine systemic antibiotics fits a healthy patient without spreading cellulitis/systemic illness after adequate source control.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.b2b40.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.prompt-drainage",
      "nextConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes prompt-drainage recall into a two-component source-control/antibiotic decision; retain the original drainage concept and histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-34",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces four one-rule drainage labels with a balanced procedure-by-antibiotic matrix; no “alone” and no uniquely comprehensive key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
    "previousPresentation": "{patientName} is a 31-year-old woman who has worsening pain with sitting and a visible fluctuant superficial perianal abscess. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.31",
        "presentation": "{patientName} is a 31-year-old woman who has worsening pain with sitting and a visible fluctuant superficial perianal abscess. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.31",
        "presentation": "{patientName} is a 31-year-old man who has worsening pain with sitting and a visible fluctuant superficial perianal abscess. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.52",
        "presentation": "{patientName} is a 52-year-old woman who has worsening pain with sitting and a visible fluctuant superficial perianal abscess. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.52",
        "presentation": "{patientName} is a 52-year-old man who has worsening pain with sitting and a visible fluctuant superficial perianal abscess. Vitals are normal, with no Crohn disease, recurrence, immune compromise, or deep pelvic symptom."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Painful perianal swelling",
    "previousChiefComplaint": "Pain with sitting",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.31"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.52"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.52"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b41",
    "auditId": "B2B41",
    "caseId": "case.gs028b.preoperative-nutrition.a-albumin-only",
    "nodeId": "node.gs028b.preoperative-nutrition.a-albumin-only.1",
    "previousQuestionVariantId": "question.preoperative-nutrition.nutritional-risk-screening.v2",
    "questionVariantId": "question.preoperative-nutrition.nutritional-risk-screening.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which interpretation is most appropriate?",
    "previousChoiceLabels": [
      "Albumin alone is not a nutrition diagnosis",
      "Severe malnutrition is proven by albumin",
      "Nutrition risk is excluded by normal weight",
      "Parenteral nutrition is automatically required"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate inflammatory albumin and body habitus from the independent intake/functional trajectory. Then: Choose structured assessment and an initial support route rather than no action or automatic parenteral nutrition.",
    "reviewerNotes": "No BMI, weight-loss, albumin, intake-percent or intervention-timing threshold; dietitian/clinician must establish the diagnosis and prescription.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b41.d1": "d1_2",
      "choice.qbp2b.20261104.b2b41.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b41.d1": null,
      "choice.qbp2b.20261104.b2b41.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b41.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b41.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.preoperative-nutrition.nutritional-risk-screening.v2.r1",
      "conceptId": "concept.preoperative-nutrition.risk-before-route-selection.v1",
      "stem": "Which nutrition plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Dietitian assessment with oral nutrition support",
          "isCorrect": true,
          "rationale": "Weight alone does not exclude nutritional risk, and inflammation limits albumin as a diagnosis. Intake, trajectory and function warrant structured assessment with support using the functioning oral/gut route.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b41.d1",
          "label": "Albumin follow-up with continuation of the usual diet",
          "isCorrect": false,
          "distractorRationale": "Inflammation may contribute to albumin, but does not explain away the independent intake, clothing and functional changes."
        },
        {
          "id": "choice.qbp2b.20261104.b2b41.d2",
          "label": "Parenteral nutrition with metabolic monitoring",
          "isCorrect": false,
          "distractorRationale": "A low albumin does not establish a need to bypass the gut, particularly before structured assessment and oral support."
        }
      ],
      "explanation": "Weight alone does not exclude nutritional risk, and inflammation limits albumin as a diagnosis. Intake, trajectory and function warrant structured assessment with support using the functioning oral/gut route. Inflammation may contribute to albumin, but does not explain away the independent intake, clothing and functional changes. A low albumin does not establish a need to bypass the gut, particularly before structured assessment and oral support.",
      "teachingPoint": "Weight alone does not exclude nutritional risk, and inflammation limits albumin as a diagnosis. Intake, trajectory and function warrant structured assessment with support using the functioning oral/gut route.",
      "supportingEvidenceClaimIds": [
        "claim.nutrition.screen",
        "claim.nutrition.oral-enteral",
        "claim.nutrition.pn-boundary",
        "claim.qbp2b.b2b41.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.preoperative-nutrition.nutritional-risk-screening",
      "nextConceptId": "concept.preoperative-nutrition.risk-before-route-selection.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Replaces albumin-interpretation recall with a consequential assessment/support plan; retain the original screening construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-35",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaces “albumin alone” statements with a real preoperative plan and specific competitors.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
    "previousPresentation": "{patientName}, a 43-year-old woman, presents before elective surgery with a low albumin value during active inflammatory disease. Intake, weight trajectory, function, and gastrointestinal tolerance have not been assessed.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.43",
        "presentation": "{patientName}, a 43-year-old woman, presents before elective surgery with a low albumin value during active inflammatory disease. Intake, weight trajectory, function, and gastrointestinal tolerance have not been assessed."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.43",
        "presentation": "{patientName}, a 43-year-old man, presents before elective surgery with a low albumin value during active inflammatory disease. Intake, weight trajectory, function, and gastrointestinal tolerance have not been assessed."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.68",
        "presentation": "{patientName}, a 68-year-old woman, presents before elective surgery with a low albumin value during active inflammatory disease. Intake, weight trajectory, function, and gastrointestinal tolerance have not been assessed."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.68",
        "presentation": "{patientName}, a 68-year-old man, presents before elective surgery with a low albumin value during active inflammatory disease. Intake, weight trajectory, function, and gastrointestinal tolerance have not been assessed."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative nutrition review",
    "previousChiefComplaint": "Low albumin before surgery",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.43"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.43"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.68"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.68"
      }
    ]
  },
  {
    "id": "revision.qbp2b.20261104.b2b42",
    "auditId": "B2B42",
    "caseId": "case.gs028b.preoperative-nutrition.b-oral-inadequate",
    "nodeId": "node.gs028b.preoperative-nutrition.b-oral-inadequate.1",
    "previousQuestionVariantId": "question.preoperative-nutrition.oral-enteral-first-line.v2",
    "questionVariantId": "question.preoperative-nutrition.oral-enteral-first-line.v2.r1",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which route is preferred next?",
    "previousChoiceLabels": [
      "Enteral nutrition through the gut",
      "Exclusive parenteral nutrition first",
      "Stop nutrition intervention",
      "Choose the route from albumin alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Judge the observed response to an oral trial separately from the albumin concentration. Then: Use preserved transit to choose enteral escalation rather than repeating the insufficient route or bypassing the gut.",
    "reviewerNotes": "Transit is not a complete absorption assessment. Tube placement, aspiration risk, formula, dose and timing require review; no specific tube site or numeric intake threshold is prescribed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.20261104.b2b42.d1": "d1_2",
      "choice.qbp2b.20261104.b2b42.d2": "d2_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.20261104.b2b42.d1": null,
      "choice.qbp2b.20261104.b2b42.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b42.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.20261104.b2b42.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.preoperative-nutrition.oral-enteral-first-line.v2.r1",
      "conceptId": "concept.preoperative-nutrition.oral-enteral-first-line",
      "stem": "Which nutrition route should be discussed next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Enteral tube feeding",
          "isCorrect": true,
          "rationale": "The record shows persistent oral inadequacy despite an actual oral trial, with evidence of gut transit. Enteral support is the next preferred route rather than using albumin to choose intravenous feeding.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.20261104.b2b42.d1",
          "label": "Parenteral venous feeding",
          "isCorrect": false,
          "distractorRationale": "Parenteral support can be necessary when oral/enteral routes cannot meet needs, but low albumin does not establish that boundary here."
        },
        {
          "id": "choice.qbp2b.20261104.b2b42.d2",
          "label": "A further oral-supplement plan",
          "isCorrect": false,
          "distractorRationale": "Oral support remains useful where it meets needs, but the recorded response shows that the attempted route is still failing to deliver sufficient intake."
        }
      ],
      "explanation": "The record shows persistent oral inadequacy despite an actual oral trial, with evidence of gut transit. Enteral support is the next preferred route rather than using albumin to choose intravenous feeding. Parenteral support can be necessary when oral/enteral routes cannot meet needs, but low albumin does not establish that boundary here. Oral support remains useful where it meets needs, but the recorded response shows that the attempted route is still failing to deliver sufficient intake.",
      "teachingPoint": "The record shows persistent oral inadequacy despite an actual oral trial, with evidence of gut transit. Enteral support is the next preferred route rather than using albumin to choose intravenous feeding.",
      "supportingEvidenceClaimIds": [
        "claim.nutrition.oral-enteral",
        "claim.nutrition.pn-boundary",
        "claim.qbp2b.b2b42.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.preoperative-nutrition.oral-enteral-first-line",
      "nextConceptId": "concept.preoperative-nutrition.oral-enteral-first-line",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "proposal-36",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deletes functional-gut/safe-access permission labels and supplies the actual intake response and transit observations.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
    "previousPresentation": "{patientName}, a 43-year-old woman, presents before elective surgery with a functional gastrointestinal tract and safe enteral access, but oral intake remains inadequate despite an individualized oral plan.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.43",
        "presentation": "{patientName}, a 43-year-old woman, presents before elective surgery with a functional gastrointestinal tract and safe enteral access, but oral intake remains inadequate despite an individualized oral plan."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.43",
        "presentation": "{patientName}, a 43-year-old man, presents before elective surgery with a functional gastrointestinal tract and safe enteral access, but oral intake remains inadequate despite an individualized oral plan."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.68",
        "presentation": "{patientName}, a 68-year-old woman, presents before elective surgery with a functional gastrointestinal tract and safe enteral access, but oral intake remains inadequate despite an individualized oral plan."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.68",
        "presentation": "{patientName}, a 68-year-old man, presents before elective surgery with a functional gastrointestinal tract and safe enteral access, but oral intake remains inadequate despite an individualized oral plan."
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
      "idPrefix": "ppr.qbp2b.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative feeding review",
    "previousChiefComplaint": "Inadequate oral intake",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.43"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.43"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.68"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.68"
      }
    ]
  }
];

export const QUESTION_BANK_BATCH2B_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.hyperacute-rejection.event-and-compatibility-review.v1",
    "displayName": "Interpret graft-event evidence before compatibility review",
    "learningObjective": "Integrate vascular/tissue findings with actual pre-event and post-event donor/control results to choose the focus of a transplant-event review.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.hyperacute-rejection.archived-crossmatch-provenance.v1",
    "versioningReason": "Changes crossmatch-design recall into interpretation of results and the consequence for a mechanism-directed case review; retain the old crossmatch and rejection concepts.",
    "revisedItemIds": [
      "B2B02"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.gs028e.t_cell_graft_comparison",
      "claim.qf3.preimplantation-specimen-inference"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.dtc.representative-node-target-and-assay.v1",
    "displayName": "Select a representative node target and thyroid-directed adjunct",
    "learningObjective": "Interpret cyst-fluid adequacy and ancillary-test provenance before choosing a representative nodal target and assay.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.dtc.cystic-node-repeat-sampling.v2",
    "versioningReason": "Changes broad surgery-versus-resampling plans into a target-by-assay acquisition decision; retain prior nodal imaging and cystic-node concepts.",
    "revisedItemIds": [
      "B2B06"
    ],
    "evidenceClaimIds": [
      "claim.dtc.preop-ultrasound",
      "claim.dtc.extent",
      "claim.qq20261102c.thyroid-cystic-node-discordance",
      "claim.qf3.thyroid-washout-provenance"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.palpable-breast.site-concordant-imaging.v1",
    "displayName": "Verify site concordance before interpreting breast imaging",
    "learningObjective": "Interpret clinical and radiology site labels before deciding whether targeted breast imaging has answered the presenting finding.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
    "versioningReason": "Changes simple modality recall after negative mammography into assessment of anatomical concordance and a corrective study request; retain the old imaging concept.",
    "revisedItemIds": [
      "B2B19",
      "B2B36"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
    "displayName": "Select anorectal source control and antibiotic scope",
    "learningObjective": "Interpret residual collection and cellulitis/host findings to select drainage and the appropriate antibiotic scope.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.perianal-abscess.prompt-drainage",
    "versioningReason": "Changes prompt-drainage recall into a two-component source-control/antibiotic decision; retain the original drainage concept and histories.",
    "revisedItemIds": [
      "B2B20",
      "B2B38",
      "B2B39",
      "B2B40"
    ],
    "evidenceClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.immunology.graft-evidence-to-review-focus.v1",
    "displayName": "Use graft tissue and serum specificity to direct event review",
    "learningObjective": "Interpret vascular versus cellular tissue injury and pre-event serum specificity before selecting the focus of a graft-event review.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.immunology.preformed-antibody-hyperacute-rejection",
    "versioningReason": "Replaces a supplied hyperacute diagnosis followed by mechanism recall with interpretation and a concrete case-review consequence; retain the original immunology mechanism concept.",
    "revisedItemIds": [
      "B2B31"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.gs028e.t_cell_graft_comparison"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "displayName": "Apply a corrected-gap report to etiologic investigation",
    "learningObjective": "Interpret blood-gas direction and albumin-adjusted versus raw gap reports before deciding whether an unmeasured-anion investigation is warranted.",
    "conceptType": "diagnosis",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.metabolic-acidosis.albumin-corrected-anion-gap",
    "versioningReason": "Changes choosing the name of a calculation into selecting the etiologic investigation supported by a laboratory report; retain the original corrected-gap concept.",
    "revisedItemIds": [
      "B2B32",
      "B2B33",
      "B2B34"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.preoperative-nutrition.risk-before-route-selection.v1",
    "displayName": "Recognize nutrition risk before choosing support",
    "learningObjective": "Interpret inflammatory albumin and functional/intake trajectory before selecting structured assessment and an initial support route.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.preoperative-nutrition.nutritional-risk-screening",
    "versioningReason": "Replaces albumin-interpretation recall with a consequential assessment/support plan; retain the original screening construct.",
    "revisedItemIds": [
      "B2B41"
    ],
    "evidenceClaimIds": [
      "claim.nutrition.screen",
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  }
];
