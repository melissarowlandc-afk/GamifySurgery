import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Review candidates only. Ship-manifest acceptance is separate from authoring and clinical approval. */
export const QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.qbp2b.r2.20261104.b2b01",
    "auditId": "B2B01",
    "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
    "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
    "previousQuestionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
    "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which intervention should the hepatobiliary team discuss for {patientName}?",
    "previousChoiceLabels": [
      "ERCP with transpapillary plastic stenting",
      "ERCP with biliary sphincterotomy",
      "Percutaneous transhepatic biliary drainage"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret a continuing side leak with preserved main-duct continuity. Then: Apply the concurrent anticoagulation issue to choose diversion without papillary cutting.",
    "reviewerNotes": "No anticoagulant dose, interruption interval or bleeding probability is taught. Exact source alignment for the no-sphincterotomy strategy is required; no claim that every leak must receive the same intervention.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b01.d1": "choice.qbp2b.20261104.b2b01.d1",
      "choice.qbp2b.r2.20261104.b2b01.d2": "choice.qbp2b.20261104.b2b01.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b01.d1": null,
      "choice.qbp2b.r2.20261104.b2b01.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.therapeutic_ercp"
      },
      "choice.qbp2b.r2.20261104.b2b01.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.therapeutic_ercp"
      },
      "choice.qbp2b.r2.20261104.b2b01.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.therapeutic_ercp"
      }
    },
    "question": {
      "id": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "stem": "Which endoscopic intervention should be planned for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Biliary plastic stenting",
          "isCorrect": true,
          "rationale": "The anatomy supports internal diversion of a communicating minor leak. A stent can be inserted without dividing the papilla, avoiding the additional sphincterotomy bleeding exposure while anticoagulation remains necessary.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b01.d1",
          "label": "Biliary sphincterotomy",
          "isCorrect": false,
          "distractorRationale": "Papillary division can lower resistance but creates a higher-bleeding-risk intervention here. It is not interchangeable with stent diversion in this anticoagulated patient."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b01.d2",
          "label": "Covered biliary metal stenting",
          "isCorrect": false,
          "distractorRationale": "Covered metal stents have a role in selected complex or refractory leaks. Ongoing output after external drainage does not by itself establish failure of initial plastic-stent diversion."
        }
      ],
      "explanation": "The anatomy supports internal diversion of a communicating minor leak. A stent can be inserted without dividing the papilla, avoiding the additional sphincterotomy bleeding exposure while anticoagulation remains necessary. Papillary division can lower resistance but creates a higher-bleeding-risk intervention here. It is not interchangeable with stent diversion in this anticoagulated patient. Covered metal stents have a role in selected complex or refractory leaks. Ongoing output after external drainage does not by itself establish failure of initial plastic-stent diversion.",
      "teachingPoint": "The anatomy supports internal diversion of a communicating minor leak. A stent can be inserted without dividing the papilla, avoiding the additional sphincterotomy bleeding exposure while anticoagulation remains necessary.",
      "supportingEvidenceClaimIds": [
        "claim.early.bile-leak.minor-leak-ercp-stent",
        "claim.early.bile-leak.ce-mrcp-anatomic-localization",
        "claim.qbp2b.r2.b2b01.application",
        "claim.qbp2b.r2.leak-anticoagulation",
        "claim.qbp2b.r2.bile-leak-plastic-versus-metal"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current hepatobiliary and treatment records",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Duct series",
          "Drainage",
          "Medication"
        ],
        "cells": [
          [
            "Contrast passes through both hepatic ducts and the common duct into the duodenum. A side channel at the cystic-duct stump fills the drained cavity."
          ],
          [
            "The cavity has contracted around the drain; bile continues to enter the catheter."
          ],
          [
            "Intravenous heparin is entered on the current administration chart for the pulmonary embolus."
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
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B01",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Moves the patient into the active inpatient discussion, replaces remote drainage and balloon-dilation foils with a covered-metal-stent alternative, and gives a patient-specific reason to distinguish two otherwise overlapping endoscopic interventions.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is reviewed on the ward after laparoscopic cholecystectomy and drainage of a subhepatic collection. The drain still refills with bile. An acute postoperative pulmonary embolus is being treated with intravenous heparin.",
    "previousPresentation": "{patientName}, a 42-year-old woman, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
        "presentation": "{patientName}, a 42-year-old woman, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
        "presentation": "{patientName}, a 42-year-old man, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
        "presentation": "{patientName}, a 68-year-old woman, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds."
      },
      {
        "id": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
        "presentation": "{patientName}, a 68-year-old man, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028e.mis-principles.c3-phrenic-pathway",
        "patientPresentationVariantId": "presentation.gs028e.mis-principles.c3-phrenic-pathway",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Postoperative drainage review",
        "revisedPresentation": "{patientName}, a 42-year-old woman, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.42",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old woman, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.42",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 42-year-old man, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "approvedInstantiationProfileId": "profile.gs028e.mis-principles.c3-phrenic-pathway.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, brings the hospital record after laparoscopic cholecystectomy. Initial shoulder-tip discomfort was followed by upper-abdominal pain and a subhepatic collection. After catheter drainage, the patient eats and walks on the ward; the drain continues to refill with green fluid on successive ward rounds.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative bile leak",
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
    "id": "revision.qbp2b.r2.20261104.b2b02",
    "auditId": "B2B02",
    "caseId": "case.gs028e.immunology.c3-historical-kidney-event",
    "nodeId": "node.gs028e.immunology.c3-historical-kidney-event.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r5",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which transplant-review plan fits {patientName}'s combined records?",
    "previousChoiceLabels": [
      "Review compatibility testing for antibody-mediated injury",
      "Review cellular immunosuppression for T-cell-mediated injury",
      "Review preservation and perfusion for ischemic tubular injury"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Reconcile the DQ signal with what the negative T-cell assay can assess. Then: Choose the B-cell assay and a specimen that establishes timing before the graft event.",
    "reviewerNotes": "No fluorescence threshold, antibody-strength cutoff, desensitization protocol or assertion that a single test proves the entire injury mechanism is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.r2.20261104.b2b02.d1": "choice.qbp2b.20261104.b2b02.d1",
      "choice.qbp2b.r2.20261104.b2b02.d2": "choice.qbp2b.20261104.b2b02.d2",
      "choice.qbp2b.r2.20261104.b2b02.d3": "choice.qbp2b.20261104.b2b02.d1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.r2.20261104.b2b02.d1": null,
      "choice.qbp2b.r2.20261104.b2b02.d2": null,
      "choice.qbp2b.r2.20261104.b2b02.d3": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b02.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b02.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b02.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v1.r6",
      "conceptId": "concept.transplant.class-ii-crossmatch-target-and-window.v1",
      "stem": "Which flow-cytometric crossmatch should be requested for {patientName}'s event review?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Preimplantation serum with donor B cells",
          "isCorrect": true,
          "rationale": "B cells provide the class-II target relevant to the DQ signal; the pre-event specimen can address whether reactivity preceded the injury.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b02.d1",
          "label": "Preimplantation serum with donor T cells",
          "isCorrect": false,
          "distractorRationale": "This uses the correct time window but does not provide the same class-II cell target. A negative earlier T-cell result does not settle that question."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b02.d2",
          "label": "Post-event serum with donor B cells",
          "isCorrect": false,
          "distractorRationale": "This targets the relevant cell population, but a result obtained only from post-event serum cannot establish pre-existing reactivity."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b02.d3",
          "label": "Post-event serum with donor T cells",
          "isCorrect": false,
          "distractorRationale": "This combines a less relevant cell target with a specimen that cannot establish the pre-event state."
        }
      ],
      "explanation": "B cells provide the class-II target relevant to the DQ signal; the pre-event specimen can address whether reactivity preceded the injury. This uses the correct time window but does not provide the same class-II cell target. A negative earlier T-cell result does not settle that question. This targets the relevant cell population, but a result obtained only from post-event serum cannot establish pre-existing reactivity. This combines a less relevant cell target with a specimen that cannot establish the pre-event state.",
      "teachingPoint": "B cells provide the class-II target relevant to the DQ signal; the pre-event specimen can address whether reactivity preceded the injury.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.qf3.preimplantation-specimen-inference",
        "claim.qbp2b.r2.b2b02.application",
        "claim.qbp2b.r2.b-cell-class-ii-crossmatch"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Compatibility archive",
        "columnHeaders": [
          "Record"
        ],
        "rowHeaders": [
          "Before implantation",
          "Stored antibody panel",
          "After the event"
        ],
        "cells": [
          [
            "A donor T-cell complement-dependent crossmatch was negative. Separate preimplantation recipient serum remains archived."
          ],
          [
            "The preimplantation serum reacts with donor-matched HLA-DQ antigen beads."
          ],
          [
            "Recipient serum was also collected after graft failure; donor T-cell and B-cell aliquots are retained."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperacute-rejection.event-and-compatibility-review.v1",
      "nextConceptId": "concept.transplant.class-ii-crossmatch-target-and-window.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes generic antibody-injury review into selection of a specific cell assay and specimen window; retain the earlier mechanism/review card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B02",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaces three mechanism-labelled review plans with a balanced four-cell target/serum matrix. The antibody archive now changes the required assay rather than confirm a diagnosis already named in the key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends a transplant-event review after a kidney graft became mottled and stopped producing urine at reperfusion. Both major vessels were patent. The tissue contains endothelial immunoglobulin and complement with capillary thrombi.",
    "previousPresentation": "{patientName}, a 41-year-old woman, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
        "presentation": "{patientName}, a 41-year-old woman, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
        "presentation": "{patientName}, a 41-year-old man, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
        "presentation": "{patientName}, a 64-year-old woman, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium."
      },
      {
        "id": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
        "presentation": "{patientName}, a 64-year-old man, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028e.immunology.c3-historical-kidney-event",
        "patientPresentationVariantId": "presentation.gs028e.immunology.c3-historical-kidney-event",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Transplant record review",
        "revisedPresentation": "{patientName}, a 41-year-old woman, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.41",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old woman, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.41",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 41-year-old man, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.female.64",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-historical-kidney-event.male.64",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old man, reviews the outside record of a failed kidney graft. At reperfusion it became mottled and stopped making urine. Operative Doppler showed flow through both major vessels. Biopsy showed small-vessel thrombi with immunoglobulin and complement along endothelium.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Transplant event review",
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
    "id": "revision.qbp2b.r2.20261104.b2b03",
    "auditId": "B2B03",
    "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
    "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r5",
    "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which hospital plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Hernia exploration during resuscitation",
      "Nasogastric decompression with interval hernia reassessment",
      "Therapeutic paracentesis with interval hernia reassessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the prolonged INR in cirrhosis alongside observed clot function and bleeding. Then: Avoid an unsupported plasma/PCC normalization request while urgent preparation proceeds.",
    "reviewerNotes": "Single recorded AGA expert review; the exact viscoelastic application remains clinician review. No laboratory number is invented and no bleeding-risk probability is assigned.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b03.d1": "choice.qbp2b.20261104.b2b03.d1",
      "choice.qbp2b.r2.20261104.b2b03.d2": "choice.qbp2b.20261104.b2b03.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b03.d1": null,
      "choice.qbp2b.r2.20261104.b2b03.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b03.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b03.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r6",
      "conceptId": "concept.cirrhosis.urgent-surgery-haemostasis-assessment.v1",
      "stem": "Which clotting-factor plan should accompany {patientName}'s preparation for exploration?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "No prophylactic factor transfusion",
          "isCorrect": true,
          "rationale": "A prolonged cirrhotic INR is not an isolated transfusion target. The observed clot assessment and bleeding examination do not establish a factor-replacement requirement before this urgent operation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b03.d1",
          "label": "Fresh-frozen plasma replacement",
          "isCorrect": false,
          "distractorRationale": "Plasma given merely to normalize the INR can add volume without demonstrating correction of a clinically relevant bleeding problem."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b03.d2",
          "label": "Prothrombin-complex concentrate replacement",
          "isCorrect": false,
          "distractorRationale": "A concentrated factor product does not turn the cirrhotic INR into a validated target; this is not a recorded anticoagulant reversal case."
        }
      ],
      "explanation": "A prolonged cirrhotic INR is not an isolated transfusion target. The observed clot assessment and bleeding examination do not establish a factor-replacement requirement before this urgent operation. Plasma given merely to normalize the INR can add volume without demonstrating correction of a clinically relevant bleeding problem. A concentrated factor product does not turn the cirrhotic INR into a validated target; this is not a recorded anticoagulant reversal case.",
      "teachingPoint": "A prolonged cirrhotic INR is not an isolated transfusion target. The observed clot assessment and bleeding examination do not establish a factor-replacement requirement before this urgent operation.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.qf3.cirrhosis-urgent-hernia-boundary",
        "claim.qbp2b.b2b03.application",
        "claim.qbp2b.r2.b2b03.application",
        "claim.qbp2b.r2.cirrhotic-inr-plan"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Preoperative haemostasis record",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "INR",
          "Other clot assessment",
          "Examination",
          "Medicines"
        ],
        "cells": [
          [
            "Prolonged compared with the laboratory interval."
          ],
          [
            "Platelet count and fibrinogen are within their reporting intervals; the viscoelastic clot trace is within the laboratory reference band."
          ],
          [
            "No bleeding from venepuncture sites or mucosa is observed."
          ],
          [
            "Carvedilol, spironolactone and lactulose; no anticoagulant is recorded."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
      "nextConceptId": "concept.cirrhosis.urgent-surgery-haemostasis-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The score changes from recognizing the need for emergency hernia exploration to a specific perioperative haemostasis decision; preserve the urgent-disposition construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B03",
      "reviewedOn": "2026-11-05",
      "whatChanged": "All pathways now share resuscitation and urgent exploration. The scored decision is a real transfusion error instead of urgent referral against two delays; the hospital chronology is explicit.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is being resuscitated in hospital for a painful nonreducing hernia with vomiting. CT shows two transition points in the herniated loop and fluid around its mesentery. The surgical team is preparing exploration. Cirrhosis with ascites is recorded.",
    "previousPresentation": "{patientName}, a 43-year-old woman, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "presentation": "{patientName}, a 43-year-old woman, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "presentation": "{patientName}, a 43-year-old man, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "presentation": "{patientName}, a 68-year-old woman, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "presentation": "{patientName}, a 68-year-old man, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Painful hernia review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, with cirrhosis and recurrent ascites had an elective hernia repair deferred. At today's clinic visit the bulge stays out when lying flat, pain persists between episodes of vomiting, and the patient has stopped passing flatus. The referral record shows preserved bilirubin and creatinine with a prolonged INR.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Painful persistent hernia",
    "previousChiefComplaint": "Painful hernia review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43",
        "chiefComplaint": "Painful hernia review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43",
        "chiefComplaint": "Painful hernia review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68",
        "chiefComplaint": "Painful hernia review"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68",
        "chiefComplaint": "Painful hernia review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b04",
    "auditId": "B2B04",
    "caseId": "case.lymphangitis.heel-inguinal",
    "nodeId": "node.lymphangitis.heel-inguinal.v1",
    "previousQuestionVariantId": "question.lymphangitis.heel-inguinal.v1.r5",
    "questionVariantId": "question.lymphangitis.heel-inguinal.v1.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which additional treatment should be arranged for {patientName}'s focal calf finding?",
    "previousChoiceLabels": [
      "Incision and drainage of the cavity",
      "Ultrasound-guided aspiration of the cavity",
      "Change the systemic antibiotic regimen"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Reconcile the apparent pocket with actual pulsatile internal flow instead of anchoring on the preceding skin infection. Then: Choose the vascular study that can define the source before source-control planning.",
    "reviewerNotes": "New qualitative application of existing recorded ACEP guidance; exact image/arterial request needs clinician verification. No availability statement, invented size threshold or antibiotic protocol.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "acute_lymphangitis": "acute_lymphangitis",
      "choice.qbp2b.r2.20261104.b2b04.d1": "choice.qbp2b.20261104.b2b04.d1",
      "choice.qbp2b.r2.20261104.b2b04.d2": "choice.qbp2b.20261104.b2b04.d2"
    },
    "choiceServiceOverrides": {
      "acute_lymphangitis": null,
      "choice.qbp2b.r2.20261104.b2b04.d1": null,
      "choice.qbp2b.r2.20261104.b2b04.d2": null
    },
    "choiceTimingOverrides": {
      "acute_lymphangitis": {
        "kind": "test",
        "timingProfileId": "timing.test.vascular_physiology"
      },
      "choice.qbp2b.r2.20261104.b2b04.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2b.r2.20261104.b2b04.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.lymphangitis.heel-inguinal.v1.r6",
      "conceptId": "concept.soft-tissue.vascular-mimic-before-drainage.v1",
      "stem": "Which investigation should be requested next for {patientName}?",
      "answerChoices": [
        {
          "id": "acute_lymphangitis",
          "label": "Duplex arterial study",
          "isCorrect": true,
          "rationale": "Pulsatile flow within a communicating cavity raises a vascular mimic rather than a simple drainable abscess. An arterial study can define that source before an incision is considered.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b04.d1",
          "label": "Duplex deep-venous study",
          "isCorrect": false,
          "distractorRationale": "Venous disease is a credible competitor given the swelling and varicosities, but it does not best explain this pulsatile cavity/channel pattern."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b04.d2",
          "label": "Focused soft-tissue study",
          "isCorrect": false,
          "distractorRationale": "Soft-tissue imaging can characterize an abscess, but treating this as a purely tissue-level pocket leaves the observed flow source unresolved."
        }
      ],
      "explanation": "Pulsatile flow within a communicating cavity raises a vascular mimic rather than a simple drainable abscess. An arterial study can define that source before an incision is considered. Venous disease is a credible competitor given the swelling and varicosities, but it does not best explain this pulsatile cavity/channel pattern. Soft-tissue imaging can characterize an abscess, but treating this as a purely tissue-level pocket leaves the observed flow source unresolved.",
      "teachingPoint": "Pulsatile flow within a communicating cavity raises a vascular mimic rather than a simple drainable abscess. An arterial study can define that source before an incision is considered.",
      "supportingEvidenceClaimIds": [
        "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
        "claim.bread-butter.skin-infection.equivocal-ultrasound",
        "claim.bread-butter.cutaneous-abscess.incision-drainage",
        "claim.qbp2b.r2.b2b04.application",
        "claim.qbp2b.r2.vascular-mimic-map"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Focused ultrasound record",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Grey scale",
          "Colour sequence",
          "Surrounding tissue"
        ],
        "cells": [
          [
            "A cavity contains mobile internal echoes and a narrow channel continuing beyond the sweep."
          ],
          [
            "Repeated frames show pulsatile bidirectional colour entering the cavity through the channel."
          ],
          [
            "The adjacent fat is thickened; compression moves the internal echoes but does not abolish the colour sequence."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.lymphangitis.distal-source-imaging.v2",
      "nextConceptId": "concept.soft-tissue.vascular-mimic-before-drainage.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes an uncomplicated source-control technique question to vascular-mimic evaluation; preserve the old lymphangitis and abscess-drainage meanings."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B04",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the disputed open-versus-aspiration ranking and redundant cavity confirmation. The actual Doppler observation now changes the next action, and the three requests are specific neighboring ultrasound investigations.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after a calf puncture was treated for a red streak and tender groin nodes. The streak has faded, but a soft focal calf swelling persists near visible varicosities. Distal pulses and foot movement are preserved.",
    "previousPresentation": "{patientName}, a 38-year-old woman, returns after antibiotics were started for a red streak extending from a heel fissure toward tender groin nodes. The streak is fading, but a focal medial-calf lump still prevents comfortable walking. Varicosities run across the same region.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.lymphangitis.heel-inguinal",
        "patientPresentationVariantId": "presentation.lymphangitis.heel-inguinal",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Leg swelling review",
        "revisedPresentation": "{patientName}, a 38-year-old woman, returns after antibiotics were started for a red streak extending from a heel fissure toward tender groin nodes. The streak is fading, but a focal medial-calf lump still prevents comfortable walking. Varicosities run across the same region.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent calf swelling",
    "previousChiefComplaint": "Leg swelling review",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b07",
    "auditId": "B2B07",
    "caseId": "case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3",
    "nodeId": "node.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.1",
    "previousQuestionVariantId": "question.statistics-ethics.capacity-refusal.v3.r1",
    "questionVariantId": "question.statistics-ethics.capacity-refusal.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which plan should the team follow for {patientName}'s biopsy?",
    "previousChoiceLabels": [
      "Document informed refusal and offer follow-up",
      "Seek surrogate authorization and schedule the biopsy",
      "Defer the decision pending psychiatric authorization"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the difference between repeating a risk and appreciating its possible personal consequences. Then: Choose assessment before either accepting the refusal as informed or replacing the patient with a surrogate.",
    "reviewerNotes": "No jurisdiction-specific legal threshold, psychiatric diagnosis or automatic guardianship rule. Named clinician and applicable local consent process still required.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "key-3": "key-3",
      "choice.qbp2b.r2.20261104.b2b07.d1": "choice.qbp2b.20261104.b2b07.d1",
      "choice.qbp2b.r2.20261104.b2b07.d2": "choice.qbp2b.20261104.b2b07.d2"
    },
    "choiceServiceOverrides": {
      "key-3": null,
      "choice.qbp2b.r2.20261104.b2b07.d1": null,
      "choice.qbp2b.r2.20261104.b2b07.d2": null
    },
    "choiceTimingOverrides": {
      "key-3": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b07.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b07.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.statistics-ethics.capacity-refusal.v3.r2",
      "conceptId": "concept.consent.decision-specific-appreciation-assessment.v1",
      "stem": "Which next step should the team take with {patientName}'s biopsy decision?",
      "answerChoices": [
        {
          "id": "key-3",
          "label": "Assess decision-specific capacity",
          "isCorrect": true,
          "rationale": "The record raises a concrete concern about appreciation, despite an ability to recite general facts. Assess the actual decision before treating the refusal as informed or transferring authority.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b07.d1",
          "label": "Document refusal and offer surveillance",
          "isCorrect": false,
          "distractorRationale": "That would be appropriate after adequate capacity and informed refusal are established; recital of general risks alone does not settle the displayed personal-appreciation concern."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b07.d2",
          "label": "Seek surrogate consent for biopsy",
          "isCorrect": false,
          "distractorRationale": "A relative does not gain authority merely because the refusal is concerning. Decision-specific assessment and the applicable consent process come first."
        }
      ],
      "explanation": "The record raises a concrete concern about appreciation, despite an ability to recite general facts. Assess the actual decision before treating the refusal as informed or transferring authority. That would be appropriate after adequate capacity and informed refusal are established; recital of general risks alone does not settle the displayed personal-appreciation concern. A relative does not gain authority merely because the refusal is concerning. Decision-specific assessment and the applicable consent process come first.",
      "teachingPoint": "The record raises a concrete concern about appreciation, despite an ability to recite general facts. Assess the actual decision before treating the refusal as informed or transferring authority.",
      "supportingEvidenceClaimIds": [
        "claim.gs028se.capacity-refusal.1",
        "claim.gs028se.capacity-refusal.3",
        "claim.qbp2b.r2.b2b07.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.statistics-ethics.capacity-refusal",
      "nextConceptId": "concept.consent.decision-specific-appreciation-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The old clear-capacity refusal objective changes to assessing an unresolved appreciation deficit; retain the old informed-refusal history."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B07",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the model refusal speech and psychiatric-permission foil. Three concrete consent steps compete at the same point, and the key does not declare global incapacity.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns to discuss a thyroid needle biopsy. The patient can describe the needle procedure and explain that a missed cancer could grow. The patient repeatedly says the cancer risk cannot apply to this lump because a protective object placed under the skin makes malignant cells impossible. When shown the scan and asked about the possibility that the belief is mistaken, the patient repeats that the object prevents any personal risk. A relative asks the team to proceed.",
    "previousPresentation": "{patientName}, a 45-year-old woman, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.45",
        "presentation": "{patientName}, a 45-year-old woman, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.45",
        "presentation": "{patientName}, a 45-year-old man, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.69",
        "presentation": "{patientName}, a 69-year-old woman, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed."
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.69",
        "presentation": "{patientName}, a 69-year-old man, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3",
        "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Declining thyroid sampling",
        "revisedPresentation": "{patientName}, a 45-year-old woman, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.45",
            "approvedInstantiationProfileId": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.45",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old woman, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.45",
            "approvedInstantiationProfileId": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.45",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old man, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.69",
            "approvedInstantiationProfileId": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.69",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 69-year-old woman, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.69",
            "approvedInstantiationProfileId": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.69",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 69-year-old man, returns to discuss a thyroid needle biopsy recommended after the ultrasound review. Treated depression is recorded. Asked what declining the biopsy means, the patient says, “You may miss cancer and it could progress in me. I understand why you recommend the sample. I would accept that uncertainty to avoid the procedure.” The patient describes the alternatives consistently during a second discussion and asks that the biopsy not go ahead. A relative asks the team to proceed.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Biopsy discussion",
    "previousChiefComplaint": "Declining thyroid sampling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.45",
        "chiefComplaint": "Declining thyroid sampling"
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.45",
        "chiefComplaint": "Declining thyroid sampling"
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.female.69",
        "chiefComplaint": "Declining thyroid sampling"
      },
      {
        "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-3.male.69",
        "chiefComplaint": "Declining thyroid sampling"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b08",
    "auditId": "B2B08",
    "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
    "previousQuestionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which breast operation should be discussed for {patientName}?",
    "previousChoiceLabels": [
      "Mastectomy of the affected breast",
      "Oncoplastic resection of the mapped breast field",
      "Wire-localized breast excisions around both markers"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize what the pretreatment skin and dermal-lymphatic record establishes. Then: Use that original phenotype when choosing both breast and axillary treatment despite current response.",
    "reviewerNotes": "No universal rule for every post-neoadjuvant patient; the inflammatory-disease consensus and exact clinical context need breast-specialist verification. Skin response does not establish pathological eradication.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b08.d1": "choice.qbp2b.20261104.b2b08.d1",
      "choice.qbp2b.r2.20261104.b2b08.d2": "choice.qbp2b.20261104.b2b08.d2",
      "choice.qbp2b.r2.20261104.b2b08.d3": "choice.qbp2b.20261104.b2b08.d1"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b08.d1": null,
      "choice.qbp2b.r2.20261104.b2b08.d2": null,
      "choice.qbp2b.r2.20261104.b2b08.d3": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b08.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b08.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b08.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
      "conceptId": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "stem": "Which breast and axillary operation should be discussed for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Mastectomy with axillary dissection",
          "isCorrect": true,
          "rationale": "The initial skin/lymphatic presentation establishes an inflammatory phenotype whose operative approach is not de-escalated merely because skin and nodal appearances respond.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b08.d1",
          "label": "Mastectomy with targeted axillary dissection",
          "isCorrect": false,
          "distractorRationale": "Targeted de-escalation can be considered in selected noninflammatory settings; the pretreatment inflammatory presentation changes the axillary boundary here."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b08.d2",
          "label": "Lumpectomy with axillary dissection",
          "isCorrect": false,
          "distractorRationale": "This recognizes the nodal issue but treats current response as sufficient to substitute breast conservation for the inflammatory-disease operation."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b08.d3",
          "label": "Lumpectomy with targeted axillary dissection",
          "isCorrect": false,
          "distractorRationale": "This applies both breast and axillary de-escalation from a selected noninflammatory pathway to the wrong original phenotype."
        }
      ],
      "explanation": "The initial skin/lymphatic presentation establishes an inflammatory phenotype whose operative approach is not de-escalated merely because skin and nodal appearances respond. Targeted de-escalation can be considered in selected noninflammatory settings; the pretreatment inflammatory presentation changes the axillary boundary here. This recognizes the nodal issue but treats current response as sufficient to substitute breast conservation for the inflammatory-disease operation. This applies both breast and axillary de-escalation from a selected noninflammatory pathway to the wrong original phenotype.",
      "teachingPoint": "The initial skin/lymphatic presentation establishes an inflammatory phenotype whose operative approach is not de-escalated merely because skin and nodal appearances respond.",
      "supportingEvidenceClaimIds": [
        "claim.nact.bcs-selection",
        "claim.nact.response-mapping",
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.brief.ibc.trimodality-sequence",
        "claim.qbp2b.r2.b2b08.application",
        "claim.qbp2b.r2.inflammatory-response-operation"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Before and after systemic therapy",
        "columnHeaders": [
          "Before treatment",
          "Current examination/imaging"
        ],
        "rowHeaders": [
          "Skin",
          "Breast focus",
          "Axilla"
        ],
        "cells": [
          [
            "Diffuse pitting and erythema; dermal lymphatic tumour emboli",
            "Skin thickening and erythema have resolved."
          ],
          [
            "Biopsy-proven invasive carcinoma with an inserted marker",
            "A small enhancing focus remains at the marked site."
          ],
          [
            "Core-biopsy-proven nodal metastasis with an inserted marker",
            "The marked node has a thin cortex and is no longer enlarged."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "nextConceptId": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes an overwhelming residual-field extent quiz into use of the original inflammatory phenotype after response; preserve the old breast-conservation selection concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B08",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the whole-breast residual malignant-field shortcut. A balanced four-operation matrix makes present response a real temptation while the original phenotype changes planning.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns after neoadjuvant therapy for breast cancer. Before treatment, warmth, erythema and skin pitting developed rapidly across most of the breast; a skin biopsy contained carcinoma within dermal lymphatic channels and an axillary core contained metastatic carcinoma. The current examination shows resolution of the skin changes, and the breast and axillary lesions are no longer palpable.",
    "previousPresentation": "{patientName}, a 46-year-old woman, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.46",
        "presentation": "{patientName}, a 46-year-old woman, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared."
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.62",
        "presentation": "{patientName}, a 62-year-old woman, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
        "patientPresentationVariantId": "presentation.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Breast operation planning",
        "revisedPresentation": "{patientName}, a 46-year-old woman, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.46",
            "approvedInstantiationProfileId": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.46",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.62",
            "approvedInstantiationProfileId": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.62",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 62-year-old woman, returns after neoadjuvant therapy for noninflammatory breast cancer. The original palpable mass has disappeared.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Post-treatment breast review",
    "previousChiefComplaint": "Breast operation planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.46",
        "chiefComplaint": "Breast operation planning"
      },
      {
        "id": "profile.gs028b.post-neoadjuvant-breast.b-diffuse-residual.female.62",
        "chiefComplaint": "Breast operation planning"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b09",
    "auditId": "B2B09",
    "caseId": "case.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock",
    "nodeId": "node.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.1",
    "previousQuestionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r1",
    "questionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment sequence should be chosen for {patientName}?",
    "previousChoiceLabels": [
      "Operative bowel assessment with revascularization planning",
      "Catheter revascularization followed by serial abdominal review",
      "Anticoagulation followed by serial abdominal review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret uncertain viable bowel separately from the clearly dead segment already removed. Then: Integrate the current physiology when choosing whether to join bowel and close definitively.",
    "reviewerNotes": "Single recorded WSES guideline; clinician reviews exact operative scenario. No claim that every dusky loop is dead or that every mesenteric operation requires discontinuity.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b09.d1": "choice.qbp2b.20261104.b2b09.d1",
      "choice.qbp2b.r2.20261104.b2b09.d2": "choice.qbp2b.20261104.b2b09.d2",
      "choice.qbp2b.r2.20261104.b2b09.d3": "choice.qbp2b.20261104.b2b09.d1"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b09.d1": null,
      "choice.qbp2b.r2.20261104.b2b09.d2": null,
      "choice.qbp2b.r2.20261104.b2b09.d3": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b09.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b09.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b09.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r2",
      "conceptId": "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
      "stem": "Which bowel plan should be used for {patientName} at this operation?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Stapled ends with planned re-exploration",
          "isCorrect": true,
          "rationale": "Physiological derangement and uncertain remaining viability support staged reassessment rather than immediate anastomosis and definitive closure.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b09.d1",
          "label": "Primary anastomosis with planned re-exploration",
          "isCorrect": false,
          "distractorRationale": "The second look addresses viability uncertainty, but immediate joining of swollen bowel during ongoing physiological derangement adds a separate risk."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b09.d2",
          "label": "Stapled ends with definitive closure",
          "isCorrect": false,
          "distractorRationale": "This avoids an immediate join but omits the planned reassessment needed for uncertain residual viability."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b09.d3",
          "label": "Primary anastomosis with definitive closure",
          "isCorrect": false,
          "distractorRationale": "This assumes both physiological readiness for a join and resolved viability despite the current observations."
        }
      ],
      "explanation": "Physiological derangement and uncertain remaining viability support staged reassessment rather than immediate anastomosis and definitive closure. The second look addresses viability uncertainty, but immediate joining of swollen bowel during ongoing physiological derangement adds a separate risk. This avoids an immediate join but omits the planned reassessment needed for uncertain residual viability. This assumes both physiological readiness for a join and resolved viability despite the current observations.",
      "teachingPoint": "Physiological derangement and uncertain remaining viability support staged reassessment rather than immediate anastomosis and definitive closure.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.ami.peritonitis-exploration",
        "claim.qbp2b.r2.b2b09.application",
        "claim.qbp2b.r2.ischaemic-bowel-staging"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "nextConceptId": "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes recognition of the need for exploration into a distinct intraoperative staging decision; retain the original emergency-exploration concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B09",
      "reviewedOn": "2026-11-05",
      "whatChanged": "All options are concrete operative sequences at the same intraoperative stage. Removes the urgent-versus-observe contrast and differentiates the arterial case from the venous sibling.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is in theatre for mesenteric arterial occlusion. Flow has been restored and a perforated black segment has been removed. The remaining loops contain alternating dusky and pink areas; the edges are swollen. Arterial pH remains below the laboratory interval, the patient is cold and vasopressors are still being used.",
    "previousPresentation": "{patientName}, a 65-year-old woman, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.65",
        "presentation": "{patientName}, a 65-year-old woman, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.65",
        "presentation": "{patientName}, a 65-year-old man, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.80",
        "presentation": "{patientName}, a 80-year-old woman, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.80",
        "presentation": "{patientName}, a 80-year-old man, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock",
        "patientPresentationVariantId": "presentation.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Abdominal pain escalation",
        "revisedPresentation": "{patientName}, a 65-year-old woman, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.65",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.65",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 65-year-old woman, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.65",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.65",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 65-year-old man, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.80",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.80",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 80-year-old woman, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.80",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.80",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 80-year-old man, is reviewed after an emergency admission for sudden abdominal pain. The hospital record shows an embolus in the superior mesenteric artery. After fluid resuscitation the blood pressure and lactate improve. During that interval the abdomen becomes rigid, pain occurs with bed movement, and palpation produces involuntary guarding across several regions.",
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
        "ageYears": 65,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Emergency bowel operation",
    "previousChiefComplaint": "Abdominal pain escalation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.65",
        "chiefComplaint": "Abdominal pain escalation"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.65",
        "chiefComplaint": "Abdominal pain escalation"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.female.80",
        "chiefComplaint": "Abdominal pain escalation"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-guarding-and-shock.male.80",
        "chiefComplaint": "Abdominal pain escalation"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b11",
    "auditId": "B2B11",
    "caseId": "case.gs028c.acute-cholecystitis.b-older-but-fit",
    "nodeId": "node.gs028c.acute-cholecystitis.b-older-but-fit.1",
    "previousQuestionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r1",
    "questionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which gallbladder treatment plan should be discussed for {patientName}'s admission?",
    "previousChoiceLabels": [
      "Early laparoscopic cholecystectomy",
      "Percutaneous gallbladder drainage",
      "Delayed laparoscopic cholecystectomy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Localize the continuing infection to the gallbladder rather than the common duct. Then: Distinguish a current cardiac event from a remote-history risk label when choosing source control.",
    "reviewerNotes": "One recorded WSES guideline. Exact cardiac/source-control application requires surgical/anaesthetic review; neither age nor a biomarker in isolation establishes operative unsuitability.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b11.d1": "choice.qbp2b.20261104.b2b11.d1",
      "choice.qbp2b.r2.20261104.b2b11.d2": "choice.qbp2b.20261104.b2b11.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b11.d1": null,
      "choice.qbp2b.r2.20261104.b2b11.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b11.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b11.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r2",
      "conceptId": "concept.cholecystitis.source-control-during-active-cardiac-event.v1",
      "stem": "Which gallbladder intervention should be planned for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Percutaneous cholecystostomy drainage",
          "isCorrect": true,
          "rationale": "Ongoing gallbladder infection needs source control, but the new active cardiac episode changes immediate operative fitness; drainage is the offered bridge.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b11.d1",
          "label": "Same-admission laparoscopic cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "Early surgery is appropriate for many high-risk patients, but this is a current active cardiac event rather than age or a remote MI used as a proxy."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b11.d2",
          "label": "ERCP with transpapillary duct stenting",
          "isCorrect": false,
          "distractorRationale": "This addresses selected ductal problems; the obstruction and inflammatory focus described here are at the gallbladder neck, not an established common-duct source."
        }
      ],
      "explanation": "Ongoing gallbladder infection needs source control, but the new active cardiac episode changes immediate operative fitness; drainage is the offered bridge. Early surgery is appropriate for many high-risk patients, but this is a current active cardiac event rather than age or a remote MI used as a proxy. This addresses selected ductal problems; the obstruction and inflammatory focus described here are at the gallbladder neck, not an established common-duct source.",
      "teachingPoint": "Ongoing gallbladder infection needs source control, but the new active cardiac episode changes immediate operative fitness; drainage is the offered bridge.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
        "claim.qbp2b.r2.b2b11.application",
        "claim.qbp2b.r2.cholecystitis-active-cardiac-event"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current source-control assessment",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Gallbladder",
          "Ducts",
          "Current course"
        ],
        "cells": [
          [
            "Tenderness remains localized over the distended gallbladder."
          ],
          [
            "The common duct is not enlarged and bilirubin remains within its reporting interval."
          ],
          [
            "Fever and inflammatory markers continue to rise while the cardiac episode is being treated."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "nextConceptId": "concept.cholecystitis.source-control-during-active-cardiac-event.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes routine index-admission timing into a specific current source-control/fitness conflict; retain the older timing objective."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B11",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the highlighted-age trap and stacked ward-recovery reassurance. All choices are named source-control interventions; the new raw cardiac trajectory changes the plan.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is reviewed on the ward for persistent right-upper-quadrant pain and fever despite initial antibiotics. Ultrasound shows a stone fixed at the gallbladder neck, mural thickening and surrounding fluid. During admission, chest pressure recurs with new regional ST changes and a new regional wall-motion abnormality; troponin rises on serial samples.",
    "previousPresentation": "{patientName}, a 72-year-old woman, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.72",
        "presentation": "{patientName}, a 72-year-old woman, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.72",
        "presentation": "{patientName}, a 72-year-old man, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.81",
        "presentation": "{patientName}, a 81-year-old woman, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.81",
        "presentation": "{patientName}, a 81-year-old man, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.acute-cholecystitis.b-older-but-fit",
        "patientPresentationVariantId": "presentation.gs028c.acute-cholecystitis.b-older-but-fit",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Gallbladder admission review",
        "revisedPresentation": "{patientName}, a 72-year-old woman, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-older-but-fit.female.72",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.72",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 72-year-old woman, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-older-but-fit.male.72",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.72",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 72-year-old man, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-older-but-fit.female.81",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.81",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 81-year-old woman, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-older-but-fit.male.81",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.81",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 81-year-old man, brings the current hospital record after admission with right-upper-quadrant pain, fever and a stone lodged at the gallbladder neck. The wall is thickened and fluid surrounds the gallbladder. A remote myocardial infarction and age are highlighted on the referral.",
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
        "ageYears": 72,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Inpatient gallbladder review",
    "previousChiefComplaint": "Gallbladder admission review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.72",
        "chiefComplaint": "Gallbladder admission review"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.72",
        "chiefComplaint": "Gallbladder admission review"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.female.81",
        "chiefComplaint": "Gallbladder admission review"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-older-but-fit.male.81",
        "chiefComplaint": "Gallbladder admission review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b12",
    "auditId": "B2B12",
    "caseId": "case.gs028se.p2e.confidentiality.v4.mondor",
    "nodeId": "node.gs028se.p2e.confidentiality.v4.mondor.2",
    "previousQuestionVariantId": "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r1",
    "questionVariantId": "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment should be discussed for {patientName}'s current chest-wall finding?",
    "previousChoiceLabels": [
      "Warm compresses with nonsteroidal analgesia",
      "Warm compresses with oral antibiotics",
      "Warm compresses with systemic anticoagulation"
    ],
    "previousCurrentUpdate": "At the authorized consultation, {patientName} shows a tender line that becomes more visible when the arm is raised. It is shorter and less painful than at the earlier visit. Ultrasound traces a noncompressible superficial tubular structure without flow; adjacent tissue and the deeper veins retain their usual appearances.",
    "previousExhibit": null,
    "currentUpdate": "At the specialist consultation, {patientName} has a tender chest-wall line that tightens with arm elevation. Ultrasound shows a subcutaneous tubular structure that does not compress and has no internal flow. The deep veins compress and show respiratory flow variation. A recent endoscopy for melaena showed an ulcer at the gastrojejunal anastomosis after naproxen use.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the actual superficial/deep-vein observations instead of escalating every painful cord to systemic anticoagulation. Then: Use the ulcer and naproxen history to choose a non-NSAID analgesic.",
    "reviewerNotes": "No paracetamol dose or guarantee of safety in every comorbidity. Exact analgesic substitution remains clinical review; the first confidentiality node and shared presentation are not edited.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "supportive_care": "supportive_care",
      "choice.qbp2b.r2.20261104.b2b12.d1": "choice.qbp2b.20261104.b2b12.d1",
      "choice.qbp2b.r2.20261104.b2b12.d2": "choice.qbp2b.20261104.b2b12.d2",
      "choice.qbp2b.r2.20261104.b2b12.d3": "choice.qbp2b.20261104.b2b12.d1"
    },
    "choiceServiceOverrides": {
      "supportive_care": null,
      "choice.qbp2b.r2.20261104.b2b12.d1": null,
      "choice.qbp2b.r2.20261104.b2b12.d2": null,
      "choice.qbp2b.r2.20261104.b2b12.d3": null
    },
    "choiceTimingOverrides": {
      "supportive_care": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b12.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b12.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b12.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r2",
      "conceptId": "concept.mondor.supportive-treatment-with-ulcer-risk.v1",
      "stem": "Which treatment plan should be used for {patientName}'s chest-wall pain?",
      "answerChoices": [
        {
          "id": "supportive_care",
          "label": "Warm compresses with paracetamol",
          "isCorrect": true,
          "rationale": "The observations support a localized superficial process managed with local measures; the active marginal-ulcer history changes the analgesic choice.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b12.d1",
          "label": "Warm compresses with ibuprofen",
          "isCorrect": false,
          "distractorRationale": "Local care is appropriate, but exchanging naproxen for another NSAID does not address the ulcer-related medication boundary."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b12.d2",
          "label": "Systemic anticoagulation with paracetamol",
          "isCorrect": false,
          "distractorRationale": "The analgesic avoids the NSAID issue, but routine therapeutic anticoagulation is not established for the localized chest-wall process."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b12.d3",
          "label": "Systemic anticoagulation with ibuprofen",
          "isCorrect": false,
          "distractorRationale": "This adds an unestablished anticoagulation indication and retains the ulcer-relevant analgesic class."
        }
      ],
      "explanation": "The observations support a localized superficial process managed with local measures; the active marginal-ulcer history changes the analgesic choice. Local care is appropriate, but exchanging naproxen for another NSAID does not address the ulcer-related medication boundary. The analgesic avoids the NSAID issue, but routine therapeutic anticoagulation is not established for the localized chest-wall process. This adds an unestablished anticoagulation indication and retains the ulcer-relevant analgesic class.",
      "teachingPoint": "The observations support a localized superficial process managed with local measures; the active marginal-ulcer history changes the analgesic choice.",
      "supportingEvidenceClaimIds": [
        "claim.mondor-disease.ultrasound-phenotype",
        "claim.mondor-disease.supportive-management-and-boundaries",
        "claim.gs028c.marginal-ulcer.nsaid",
        "claim.qbp2b.r2.b2b12.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.mondor-disease.supportive-management",
      "nextConceptId": "concept.mondor.supportive-treatment-with-ulcer-risk.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes uncomplicated supportive-care recall into two treatment components determined by imaging and a specific comorbidity; retain the old supportive-care history."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B12",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes improvement and usual-appearance reassurance from the new update. A balanced local-treatment/analgesic matrix replaces a standard-treatment matching task. The earlier consent-to-share presentation remains because it supplies the frozen first question, and its irrelevance to this second task is disclosed.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b13",
    "auditId": "B2B13",
    "caseId": "case.gs028b.nipple-discharge.b-negative-first-line",
    "nodeId": "node.gs028b.nipple-discharge.b-negative-first-line.1",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r1",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which breast investigation plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Diagnostic mammography with targeted ultrasound",
      "Contrast-enhanced breast MRI with targeted ultrasound",
      "Screening mammography with targeted ultrasound"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Determine which abnormality the benign specimen actually represents. Then: Choose a guidance method that can sample the remaining mammographic target.",
    "reviewerNotes": "No BI-RADS probability, lesion-size threshold or claim that a negative ultrasound resolves calcifications. New guidance/representativity application remains clinician/source-alignment review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b13.d1": "choice.qbp2b.20261104.b2b13.d1",
      "choice.qbp2b.r2.20261104.b2b13.d2": "choice.qbp2b.20261104.b2b13.d2",
      "choice.qbp2b.r2.20261104.b2b13.d3": "choice.qbp2b.20261104.b2b13.d1"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b13.d1": null,
      "choice.qbp2b.r2.20261104.b2b13.d2": null,
      "choice.qbp2b.r2.20261104.b2b13.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b13.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b13.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b13.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.pathologic-nipple-discharge.diagnostic-imaging.v4.r2",
      "conceptId": "concept.breast-discharge.target-representativity-and-guidance.v1",
      "stem": "Which tissue-sampling request should be made for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Target P: mammography-guided vacuum biopsy",
          "isCorrect": true,
          "rationale": "The benign result is from a different sonographic target and has not sampled the calcification field. Mammographic guidance addresses that unresolved target.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b13.d1",
          "label": "Target P: ultrasound-guided core biopsy",
          "isCorrect": false,
          "distractorRationale": "This selects the unresolved field but proposes guidance without a demonstrated sonographic target."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b13.d2",
          "label": "Target R: mammography-guided vacuum biopsy",
          "isCorrect": false,
          "distractorRationale": "This repeats the wrong target and adds a modality that does not address the observed mammographic field P."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b13.d3",
          "label": "Target R: ultrasound-guided core biopsy",
          "isCorrect": false,
          "distractorRationale": "The earlier benign tissue belongs to R; repeating that sample does not resolve the separate calcifications."
        }
      ],
      "explanation": "The benign result is from a different sonographic target and has not sampled the calcification field. Mammographic guidance addresses that unresolved target. This selects the unresolved field but proposes guidance without a demonstrated sonographic target. This repeats the wrong target and adds a modality that does not address the observed mammographic field P. The earlier benign tissue belongs to R; repeating that sample does not resolve the separate calcifications.",
      "teachingPoint": "The benign result is from a different sonographic target and has not sampled the calcification field. Mammographic guidance addresses that unresolved target.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.pathologic-pattern",
        "claim.discharge.imaging",
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.r2.b2b13.application",
        "claim.qbp2b.r2.breast-target-representativity"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Sampling and imaging records",
        "columnHeaders": [
          "Target record",
          "Returned record"
        ],
        "rowHeaders": [
          "Mammographic target P",
          "Ultrasound target R",
          "Earlier specimen"
        ],
        "cells": [
          [
            "Posterior calcification field P",
            "The field remains visible on mammography; it has no sonographic correlate."
          ],
          [
            "Retroareolar duct contents R",
            "Contents move with compression and have no internal flow signal."
          ],
          [
            "Needle images and specimen label identify R",
            "Histology contains benign duct tissue; specimen radiography contains none of the calcifications from P."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "nextConceptId": "concept.breast-discharge.target-representativity-and-guidance.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes initial discharge-imaging recall into target/method selection after a nonrepresentative benign sample; retain the original initial-imaging card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B13",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the screening-versus-diagnostic wording giveaway. Four concrete target/method requests form a balanced matrix; the competing discharge histories no longer substitute for the sampling decision.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has spontaneous blood-stained discharge from a left duct as well as expressed milk-like fluid after metoclopramide. A diagnostic mammogram shows a posterior segment of fine irregular calcifications. An earlier ultrasound-guided sample was reported as benign breast tissue.",
    "previousPresentation": "{patientName}, a 46-year-old woman, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.46",
        "presentation": "{patientName}, a 46-year-old woman, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination."
      },
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.64",
        "presentation": "{patientName}, a 64-year-old woman, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028b.nipple-discharge.b-negative-first-line",
        "patientPresentationVariantId": "presentation.gs028b.nipple-discharge.b-negative-first-line",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Mixed nipple discharge",
        "revisedPresentation": "{patientName}, a 46-year-old woman, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.nipple-discharge.b-negative-first-line.female.46",
            "approvedInstantiationProfileId": "profile.gs028b.nipple-discharge.b-negative-first-line.female.46",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.nipple-discharge.b-negative-first-line.female.64",
            "approvedInstantiationProfileId": "profile.gs028b.nipple-discharge.b-negative-first-line.female.64",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, reports milk-like fluid from both breasts when squeezing after starting metoclopramide. Separately, blood-stained drops mark the bra on the left without squeezing. The clinician sees fluid emerge from one left duct during examination.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Unilateral nipple discharge",
    "previousChiefComplaint": "Mixed nipple discharge",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.46",
        "chiefComplaint": "Mixed nipple discharge"
      },
      {
        "id": "profile.gs028b.nipple-discharge.b-negative-first-line.female.64",
        "chiefComplaint": "Mixed nipple discharge"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b14",
    "auditId": "B2B14",
    "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
    "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
    "previousQuestionVariantId": "question.appendicitis.stable-adult-ct.v4.r1",
    "questionVariantId": "question.appendicitis.stable-adult-ct.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which imaging request should be made next for {patientName}?",
    "previousChoiceLabels": [
      "Abdominopelvic computed tomography",
      "Repeat focused appendiceal ultrasound",
      "Transvaginal pelvic ultrasonography"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Weigh the acute abdominal pattern against the urinary clue rather than equate every red-cell urine result with a stone. Then: Select the CT request that addresses the unresolved abdominal differential.",
    "reviewerNotes": "No invented contrast threshold, dose, phase timing or claim that noncontrast CT never diagnoses appendicitis.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b14.d1": "choice.qbp2b.20261104.b2b14.d1",
      "choice.qbp2b.r2.20261104.b2b14.d2": "choice.qbp2b.20261104.b2b14.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b14.d1": null,
      "choice.qbp2b.r2.20261104.b2b14.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qbp2b.r2.20261104.b2b14.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qbp2b.r2.20261104.b2b14.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "question": {
      "id": "question.appendicitis.stable-adult-ct.v4.r2",
      "conceptId": "concept.appendicitis.ct-request-with-urinary-mimic.v1",
      "stem": "Which CT request should be made for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Contrast-enhanced abdominopelvic CT",
          "isCorrect": true,
          "rationale": "The acute abdominal pattern needs a broad appendiceal/alternative-pathology assessment; microscopic haematuria does not by itself turn the task into a stone-only or excretory-tract study.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b14.d1",
          "label": "Noncontrast renal-colic CT protocol",
          "isCorrect": false,
          "distractorRationale": "This is a credible response to flank pain and haematuria, but it prioritizes the urinary-stone pathway over the combined acute abdominal findings."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b14.d2",
          "label": "Delayed excretory-phase CT urography",
          "isCorrect": false,
          "distractorRationale": "This is used for selected urinary-tract questions; the current concern is an acute inflammatory abdominal process, not an isolated haematuria workup."
        }
      ],
      "explanation": "The acute abdominal pattern needs a broad appendiceal/alternative-pathology assessment; microscopic haematuria does not by itself turn the task into a stone-only or excretory-tract study. This is a credible response to flank pain and haematuria, but it prioritizes the urinary-stone pathway over the combined acute abdominal findings. This is used for selected urinary-tract questions; the current concern is an acute inflammatory abdominal process, not an isolated haematuria workup.",
      "teachingPoint": "The acute abdominal pattern needs a broad appendiceal/alternative-pathology assessment; microscopic haematuria does not by itself turn the task into a stone-only or excretory-tract study.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us",
        "claim.qbp2b.r2.b2b14.application",
        "claim.qbp2b.r2.acute-abdominal-ct-protocol"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.appendicitis.stable-adult-ct",
      "nextConceptId": "concept.appendicitis.ct-request-with-urinary-mimic.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a modality choice against a failed ultrasound into a specific imaging-request decision; retain the prior modality-selection construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B14",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the unsuccessful-ultrasound and benign-ovarian exclusions. All options are actual CT requests at one stage, with necessary pregnancy/contrast context.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed in hospital for pain that started centrally and is now constant in the right lower abdomen and flank. Palpation produces focal right-lower-quadrant guarding. Urinalysis contains red cells, and inflammatory markers are rising. The pregnancy test is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.",
    "previousPresentation": "{patientName}, a 44-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.44",
        "presentation": "{patientName}, a 44-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable."
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.44",
        "presentation": "{patientName}, a 44-year-old man, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable."
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.63",
        "presentation": "{patientName}, a 63-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable."
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.63",
        "presentation": "{patientName}, a 63-year-old man, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.appendicitis.a-competing-diagnoses",
        "patientPresentationVariantId": "presentation.gs028c.appendicitis.a-competing-diagnoses",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Right lower-abdominal pain",
        "revisedPresentation": "{patientName}, a 44-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.appendicitis.a-competing-diagnoses.female.44",
            "approvedInstantiationProfileId": "profile.gs028c.appendicitis.a-competing-diagnoses.female.44",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.appendicitis.a-competing-diagnoses.male.44",
            "approvedInstantiationProfileId": "profile.gs028c.appendicitis.a-competing-diagnoses.male.44",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old man, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.appendicitis.a-competing-diagnoses.female.63",
            "approvedInstantiationProfileId": "profile.gs028c.appendicitis.a-competing-diagnoses.female.63",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 63-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.appendicitis.a-competing-diagnoses.male.63",
            "approvedInstantiationProfileId": "profile.gs028c.appendicitis.a-competing-diagnoses.male.63",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 63-year-old man, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Acute right-sided pain",
    "previousChiefComplaint": "Right lower-abdominal pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.44",
        "chiefComplaint": "Right lower-abdominal pain"
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.44",
        "chiefComplaint": "Right lower-abdominal pain"
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.female.63",
        "chiefComplaint": "Right lower-abdominal pain"
      },
      {
        "id": "profile.gs028c.appendicitis.a-competing-diagnoses.male.63",
        "chiefComplaint": "Right lower-abdominal pain"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b15",
    "auditId": "B2B15",
    "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
    "nodeId": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r1",
    "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which plan should be taken to {patientName}'s elective-surgery conference?",
    "previousChoiceLabels": [
      "Reschedule repair after ascites treatment",
      "Repair with postoperative ascites surveillance",
      "Repair using a smaller hernia-repair approach"
    ],
    "previousCurrentUpdate": "At return, {patientName}'s clothes fit more tightly. The abdomen has shifting dullness and ultrasound shows new free peritoneal fluid. The hernia reduces when lying down and meals pass without vomiting. Bilirubin and creatinine remain close to the earlier values; the planned repair has not changed.",
    "previousExhibit": null,
    "currentUpdate": "Since the previous visit, {patientName} has taken ibuprofen for the hernia discomfort. The abdomen has become more distended, urine output has fallen and creatinine has risen from the earlier result. The hernia still reduces when lying down and there is no vomiting. Spironolactone and furosemide doses have not changed.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the significance of new renal/fluid deterioration after a real medicine exposure. Then: Choose a non-NSAID analgesic instead of assuming another NSAID or COX-2 inhibitor solves the problem.",
    "reviewerNotes": "Necessary shared-presentation revision is versioned separately; the first node remains exact and retains sufficient cirrhosis/elective-procedure context. Renal deterioration needs urgent clinical assessment beyond this analgesic task.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.r2.20261104.b2b15.d1": "choice.qbp2b.20261104.b2b15.d1",
      "choice.qbp2b.r2.20261104.b2b15.d2": "choice.qbp2b.20261104.b2b15.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.r2.20261104.b2b15.d1": null,
      "choice.qbp2b.r2.20261104.b2b15.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b15.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b15.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r2",
      "conceptId": "concept.cirrhosis.analgesic-selection-with-renal-deterioration.v1",
      "stem": "Which analgesic should replace ibuprofen for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Oral acetaminophen",
          "isCorrect": true,
          "rationale": "The new renal/fluid trajectory makes continued NSAID exposure important to address. A non-NSAID option avoids simply switching within a class that can worsen renal perfusion in cirrhosis.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b15.d1",
          "label": "Oral naproxen sodium",
          "isCorrect": false,
          "distractorRationale": "A different conventional NSAID does not remove the renal/fluid concern."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b15.d2",
          "label": "Oral celecoxib",
          "isCorrect": false,
          "distractorRationale": "COX-2 selectivity does not establish renal safety for this cirrhotic decompensation pattern."
        }
      ],
      "explanation": "The new renal/fluid trajectory makes continued NSAID exposure important to address. A non-NSAID option avoids simply switching within a class that can worsen renal perfusion in cirrhosis. A different conventional NSAID does not remove the renal/fluid concern. COX-2 selectivity does not establish renal safety for this cirrhotic decompensation pattern.",
      "teachingPoint": "The new renal/fluid trajectory makes continued NSAID exposure important to address. A non-NSAID option avoids simply switching within a class that can worsen renal perfusion in cirrhosis.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.qbp2b.r2.b2b15.application",
        "claim.qbp2b.r2.cirrhosis-nsaid-renal-boundary"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "nextConceptId": "concept.cirrhosis.analgesic-selection-with-renal-deterioration.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes generic elective deferral into a specific medication safety decision; retain the previous decompensation/elective-plan card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B15",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Deletes the shared referral lecture about albumin and missing risk domains while retaining the earlier assessment question word-for-word. The follow-up tests an actual medication change rather than another automatic postpone-and-treat rule.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has cirrhosis with ascites and attends before elective repair of a reducible hernia.",
    "previousPresentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43",
        "presentation": "{patientName}, a 43-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68",
        "presentation": "{patientName}, a 68-year-old woman with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68",
        "presentation": "{patientName}, a 68-year-old man with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated."
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Hernia planning",
    "previousChiefComplaint": "Surgery risk review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b16",
    "auditId": "B2B16",
    "caseId": "case.gs028b.cirrhosis-perioperative.b-encephalopathy",
    "nodeId": "node.gs028b.cirrhosis-perioperative.b-encephalopathy.1",
    "previousQuestionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r1",
    "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which disposition should be arranged for {patientName} from this visit?",
    "previousChoiceLabels": [
      "Hospital assessment of altered mentation",
      "Anaesthetic clearance for repair with postoperative observation",
      "Day-surgery repair using local anaesthesia"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the volume/electrolyte loss pattern in the actual treatment response. Then: Avoid ammonia-driven cathartic escalation and address the precipitant during hospital assessment.",
    "reviewerNotes": "The data do not prove a single cause of confusion or replace infection/bleeding/neurological assessment. Specific source extension is explicitly pending clinician alignment.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b16.d1": "choice.qbp2b.20261104.b2b16.d1",
      "choice.qbp2b.r2.20261104.b2b16.d2": "choice.qbp2b.20261104.b2b16.d2",
      "choice.qbp2b.r2.20261104.b2b16.d3": "choice.qbp2b.20261104.b2b16.d1"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b16.d1": null,
      "choice.qbp2b.r2.20261104.b2b16.d2": null,
      "choice.qbp2b.r2.20261104.b2b16.d3": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b16.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b16.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b16.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r2",
      "conceptId": "concept.cirrhosis.cathartic-response-and-acute-mentation.v1",
      "stem": "Which treatment adjustment should be made for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Lactulose reduction with fluid-potassium replacement",
          "isCorrect": true,
          "rationale": "The stool, posture and chemistry observations suggest a treatment-related volume/electrolyte precipitant. An elevated ammonia result does not justify driving further watery loss.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b16.d1",
          "label": "Lactulose escalation with fluid-potassium replacement",
          "isCorrect": false,
          "distractorRationale": "This recognizes the volume/electrolyte problem but intensifies the intervention contributing to it."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b16.d2",
          "label": "Lactulose reduction with fluid restriction",
          "isCorrect": false,
          "distractorRationale": "This reduces catharsis but does not address the observed losses and renal trajectory."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b16.d3",
          "label": "Lactulose escalation with fluid restriction",
          "isCorrect": false,
          "distractorRationale": "This responds to the ammonia label while worsening the current loss pattern."
        }
      ],
      "explanation": "The stool, posture and chemistry observations suggest a treatment-related volume/electrolyte precipitant. An elevated ammonia result does not justify driving further watery loss. This recognizes the volume/electrolyte problem but intensifies the intervention contributing to it. This reduces catharsis but does not address the observed losses and renal trajectory. This responds to the ammonia label while worsening the current loss pattern.",
      "teachingPoint": "The stool, posture and chemistry observations suggest a treatment-related volume/electrolyte precipitant. An elevated ammonia result does not justify driving further watery loss.",
      "supportingEvidenceClaimIds": [
        "claim.cirrhosis.optimize-decompensation",
        "claim.qbp2b.r2.b2b16.application",
        "claim.qbp2b.r2.catharsis-volume-precipitant"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current treatment response",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Chemistry",
          "Renal trend",
          "Ammonia"
        ],
        "cells": [
          [
            "Sodium is above and potassium below the laboratory interval."
          ],
          [
            "Creatinine has risen and urine output has fallen from the earlier ward record."
          ],
          [
            "Remains elevated on the repeat report."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "nextConceptId": "concept.cirrhosis.cathartic-response-and-acute-mentation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes recognition of the need for acute hospital assessment into a concrete treatment-response decision; retain the original acute-disposition objective."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B16",
      "reviewedOn": "2026-11-05",
      "whatChanged": "All four options are active hospital treatment plans. Removes surgery-versus-assessment and problem-restating options; a balanced matrix makes both treatment components matter.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed in hospital after new inattention during preparation for hernia surgery. Lactulose was increased after the family noticed repeated questions. The stool chart now records frequent watery motions; standing produces light-headedness and a blood-pressure fall. The hernia reduces on lying down.",
    "previousPresentation": "{patientName}, a 43-year-old woman, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.43",
        "presentation": "{patientName}, a 43-year-old woman, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.43",
        "presentation": "{patientName}, a 43-year-old man, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.68",
        "presentation": "{patientName}, a 68-year-old woman, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval."
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.68",
        "presentation": "{patientName}, a 68-year-old man, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028b.cirrhosis-perioperative.b-encephalopathy",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.b-encephalopathy",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Preoperative cognition change",
        "revisedPresentation": "{patientName}, a 43-year-old woman, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, with cirrhosis attends before repair of a reducible hernia. The family says the patient was managing medicines and finances at the previous visit, but now repeats questions and cannot state which tablets were taken. On examination both outstretched hands intermittently drop at the wrists. The hernia reduces and there is no vomiting. Blood pressure is at the usual level and the point-of-care glucose is within the laboratory interval.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "New confusion",
    "previousChiefComplaint": "Preoperative cognition change",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.43",
        "chiefComplaint": "Preoperative cognition change"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.43",
        "chiefComplaint": "Preoperative cognition change"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.female.68",
        "chiefComplaint": "Preoperative cognition change"
      },
      {
        "id": "profile.gs028b.cirrhosis-perioperative.b-encephalopathy.male.68",
        "chiefComplaint": "Preoperative cognition change"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b17",
    "auditId": "B2B17",
    "caseId": "case.gs028d.dialysis-access.b-arm-swelling",
    "nodeId": "node.gs028d.dialysis-access.b-arm-swelling.1",
    "previousQuestionVariantId": "question.dialysis-access.clinical-dysfunction-referral.v4.r1",
    "questionVariantId": "question.dialysis-access.clinical-dysfunction-referral.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which referral should be prioritized for {patientName}'s arm problem?",
    "previousChoiceLabels": [
      "Dialysis-access team for fistula outflow evaluation",
      "Renal team for target-weight adjustment",
      "Medical team for arm soft-tissue infection treatment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Localize the combined findings to an outflow/central venous problem rather than generalized volume or a hand-perfusion disorder. Then: Choose an investigation covering the actual access and central drainage route.",
    "reviewerNotes": "Single recorded UKKA guideline; exact investigation/protocol requires access-team review. No test availability or permission sentence.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b17.d1": "choice.qbp2b.20261104.b2b17.d1",
      "choice.qbp2b.r2.20261104.b2b17.d2": "choice.qbp2b.20261104.b2b17.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b17.d1": null,
      "choice.qbp2b.r2.20261104.b2b17.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b17.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.vascular_physiology"
      },
      "choice.qbp2b.r2.20261104.b2b17.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.dialysis-access.clinical-dysfunction-referral.v4.r2",
      "conceptId": "concept.dialysis-access.symptomatic-central-outflow-assessment.v1",
      "stem": "Which investigation should be requested for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Fistulography including central venous outflow",
          "isCorrect": true,
          "rationale": "The combined dialysis-performance and collateral pattern points toward an outflow problem extending beyond the cannulation segment; the study must include the central route.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b17.d1",
          "label": "Digital arterial pressures with access compression",
          "isCorrect": false,
          "distractorRationale": "This can address an access-related hand-perfusion problem, but the current swelling/collateral/bleeding pattern is not best localized to that mechanism."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b17.d2",
          "label": "Compression duplex of the deep arm veins",
          "isCorrect": false,
          "distractorRationale": "Arm-vein thrombosis is a credible cause of swelling, but an access/central-outflow study better integrates the dialysis changes, collateral route and catheter history."
        }
      ],
      "explanation": "The combined dialysis-performance and collateral pattern points toward an outflow problem extending beyond the cannulation segment; the study must include the central route. This can address an access-related hand-perfusion problem, but the current swelling/collateral/bleeding pattern is not best localized to that mechanism. Arm-vein thrombosis is a credible cause of swelling, but an access/central-outflow study better integrates the dialysis changes, collateral route and catheter history.",
      "teachingPoint": "The combined dialysis-performance and collateral pattern points toward an outflow problem extending beyond the cannulation segment; the study must include the central route.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.access.dysfunction-referral",
        "claim.qbp2b.r2.b2b17.application",
        "claim.qbp2b.r2.access-central-outflow-map"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.dialysis-access.clinical-dysfunction-referral",
      "nextConceptId": "concept.dialysis-access.symptomatic-central-outflow-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes generic access-team referral into a specific vascular investigation; retain the earlier broad dysfunction/referral card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B17",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaces service-name matching and an unsupported infection treatment with three concrete vascular investigations. Removes generalized weight gain that did not change the prior referral.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, on haemodialysis has progressive swelling of the fistula arm and aching during sessions. Delivered flow has fallen with the same needle arrangement, and puncture sites ooze longer after removal. New veins are visible across the ipsilateral upper chest. A previous dialysis catheter entered the internal jugular vein on that side. The hand is warm and finger movement is preserved.",
    "previousPresentation": "{patientName}, a 36-year-old woman, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.36",
        "presentation": "{patientName}, a 36-year-old woman, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement."
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.36",
        "presentation": "{patientName}, a 36-year-old man, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement."
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.65",
        "presentation": "{patientName}, a 65-year-old woman, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement."
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.65",
        "presentation": "{patientName}, a 65-year-old man, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.dialysis-access.b-arm-swelling",
        "patientPresentationVariantId": "presentation.gs028d.dialysis-access.b-arm-swelling",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Dialysis arm swelling",
        "revisedPresentation": "{patientName}, a 36-year-old woman, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.dialysis-access.b-arm-swelling.female.36",
            "approvedInstantiationProfileId": "profile.gs028d.dialysis-access.b-arm-swelling.female.36",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 36-year-old woman, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.dialysis-access.b-arm-swelling.male.36",
            "approvedInstantiationProfileId": "profile.gs028d.dialysis-access.b-arm-swelling.male.36",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 36-year-old man, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.dialysis-access.b-arm-swelling.female.65",
            "approvedInstantiationProfileId": "profile.gs028d.dialysis-access.b-arm-swelling.female.65",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 65-year-old woman, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.dialysis-access.b-arm-swelling.male.65",
            "approvedInstantiationProfileId": "profile.gs028d.dialysis-access.b-arm-swelling.male.65",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 65-year-old man, on haemodialysis has gained weight between sessions and has ankle swelling. The access arm is also more swollen than before. Dialysis records show progressively reduced delivered flow despite the same needle configuration, and bleeding from the needle sites now continues longer after the needles are removed. The hand remains warm with its usual movement.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Dialysis access change",
    "previousChiefComplaint": "Dialysis arm swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.36",
        "chiefComplaint": "Dialysis arm swelling"
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.36",
        "chiefComplaint": "Dialysis arm swelling"
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.female.65",
        "chiefComplaint": "Dialysis arm swelling"
      },
      {
        "id": "profile.gs028d.dialysis-access.b-arm-swelling.male.65",
        "chiefComplaint": "Dialysis arm swelling"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b18",
    "auditId": "B2B18",
    "caseId": "case.gs028d.hyperkalaemia.a-dialysis-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-dialysis-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v3.r1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Under the UKKA adult pathway, which plan should be arranged now for {patientName}?",
    "previousChoiceLabels": [
      "Emergency hospital assessment and treatment",
      "Community medicine review with another outpatient sample",
      "Earlier routine renal appointment with a dietary plan"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish an improved ECG from reduction of extracellular potassium. Then: Select a potassium-shifting intervention rather than repeat the electrical intervention or substitute bicarbonate.",
    "reviewerNotes": "Recorded UKKA calcium recommendation is weak 2C; no dose, interval, survival benefit or universal re-dosing threshold is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b18.d1": "choice.qbp2b.20261104.b2b18.d1",
      "choice.qbp2b.r2.20261104.b2b18.d2": "choice.qbp2b.20261104.b2b18.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b18.d1": null,
      "choice.qbp2b.r2.20261104.b2b18.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b18.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b18.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v3.r2",
      "conceptId": "concept.hyperkalaemia.ecg-response-versus-potassium-shifting.v1",
      "stem": "Under the UKKA adult pathway, which IV treatment should be given next to {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "IV insulin–glucose",
          "isCorrect": true,
          "rationale": "The electrical response does not establish potassium lowering. Insulin with glucose provides a potassium-shifting intervention while definitive renal management is arranged.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b18.d1",
          "label": "IV calcium gluconate",
          "isCorrect": false,
          "distractorRationale": "Calcium addresses the electrical/membrane question; repeating it is not a response to persistent potassium concentration when the described ECG has improved."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b18.d2",
          "label": "IV sodium bicarbonate",
          "isCorrect": false,
          "distractorRationale": "Bicarbonate is not a routine substitute for the established shifting intervention in the supplied nonacidemic record."
        }
      ],
      "explanation": "The electrical response does not establish potassium lowering. Insulin with glucose provides a potassium-shifting intervention while definitive renal management is arranged. Calcium addresses the electrical/membrane question; repeating it is not a response to persistent potassium concentration when the described ECG has improved. Bicarbonate is not a routine substitute for the established shifting intervention in the supplied nonacidemic record.",
      "teachingPoint": "The electrical response does not establish potassium lowering. Insulin with glucose provides a potassium-shifting intervention while definitive renal management is arranged.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.gs028d.hyperkalaemia.mechanisms",
        "claim.qbp2b.r2.b2b18.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current treatment response",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "ECG",
          "Repeat chemistry",
          "Other current measurements"
        ],
        "cells": [
          [
            "Complexes are narrower and P waves are now visible."
          ],
          [
            "Potassium remains 6.8 mmol/L."
          ],
          [
            "Glucose and arterial pH are within their reporting intervals."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.ecg-response-versus-potassium-shifting.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a community emergency-threshold disposition into a hospital treatment-response decision; retain the old transfer concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B18",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Deletes the irrelevant older potassium row and both outpatient-delay foils. All options are named IV interventions in the same hospital sequence; the persistent potassium and changed ECG must be interpreted together.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, on maintenance haemodialysis is in hospital after a confirmed potassium of 6.8 mmol/L. The first ECG has broad complexes and poorly seen P waves. Intravenous calcium has been given.",
    "previousPresentation": "{patientName}, a 39-year-old woman, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.39",
        "presentation": "{patientName}, a 39-year-old woman, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.39",
        "presentation": "{patientName}, a 39-year-old man, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.73",
        "presentation": "{patientName}, a 73-year-old woman, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.73",
        "presentation": "{patientName}, a 73-year-old man, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.hyperkalaemia.a-dialysis-result",
        "patientPresentationVariantId": "presentation.gs028d.hyperkalaemia.a-dialysis-result",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Potassium result review",
        "revisedPresentation": "{patientName}, a 39-year-old woman, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dialysis-result.female.39",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.39",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 39-year-old woman, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dialysis-result.male.39",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.39",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 39-year-old man, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dialysis-result.female.73",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.73",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old woman, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dialysis-result.male.73",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.73",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old man, on maintenance haemodialysis is called back after a potassium result. The patient feels well and asks whether the next planned dialysis visit can cover the problem.",
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
        "ageYears": 39,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Hospital potassium treatment",
    "previousChiefComplaint": "Potassium result review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.39",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.39",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.female.73",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dialysis-result.male.73",
        "chiefComplaint": "Potassium result review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b19",
    "auditId": "B2B19",
    "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
    "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
    "previousQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which imaging request should be made for {patientName}'s current finding?",
    "previousChoiceLabels": [
      "Ultrasound of the marked lower inner site",
      "Repeat mammography of the marked lower inner site",
      "Contrast-enhanced MRI of the affected breast"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the attachment from the actual acquired series and its tissue coverage. Then: Retrieve/correlate the acquired target rather than infer that the examination was omitted.",
    "reviewerNotes": "No declaration that coverage alone proves image adequacy or benignity. This is a current reconciliation step, not a negative-imaging discharge rule.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b19.d1": "choice.qbp2b.20261104.b2b19.d1",
      "choice.qbp2b.r2.20261104.b2b19.d2": "choice.qbp2b.20261104.b2b19.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b19.d1": null,
      "choice.qbp2b.r2.20261104.b2b19.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b19.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2b.r2.20261104.b2b19.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.palpable-breast.negative-mammogram-targeted-us.v4.r2",
      "conceptId": "concept.palpable-breast.existing-target-series-reconciliation.v1",
      "stem": "Which diagnostic step should be taken next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Review the stored ultrasound series",
          "isCorrect": true,
          "rationale": "The report attachment is not the entire acquired examination. The stored M series can be retrieved and clinically/radiologically correlated before a duplicate request.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b19.d1",
          "label": "Repeat the targeted ultrasound study",
          "isCorrect": false,
          "distractorRationale": "A repeat can be needed when the target was omitted or inadequately acquired; the current archive shows a series at the marked site that has not been reconciled with the attachment."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b19.d2",
          "label": "Sample the palpable area with a core needle",
          "isCorrect": false,
          "distractorRationale": "Tissue remains relevant if clinical concern or discordance persists, but this mobile thickening has not yet had its already acquired target study reconciled."
        }
      ],
      "explanation": "The report attachment is not the entire acquired examination. The stored M series can be retrieved and clinically/radiologically correlated before a duplicate request. A repeat can be needed when the target was omitted or inadequately acquired; the current archive shows a series at the marked site that has not been reconciled with the attachment. Tissue remains relevant if clinical concern or discordance persists, but this mobile thickening has not yet had its already acquired target study reconciled.",
      "teachingPoint": "The report attachment is not the entire acquired examination. The stored M series can be retrieved and clinically/radiologically correlated before a duplicate request.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.r2.b2b19.application",
        "claim.qbp2b.r2.breast-existing-series-reconciliation"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Exam and image-store records",
        "columnHeaders": [
          "Header/position",
          "Recorded contents"
        ],
        "rowHeaders": [
          "Clinical diagram",
          "Attached PDF",
          "PACS clip H",
          "PACS clip M"
        ],
        "cells": [
          [
            "M: lower inner; H: upper outer",
            "Palpable thickening is marked M."
          ],
          [
            "Target H",
            "A thin-walled fluid lesion is described."
          ],
          [
            "Target H",
            "Images show the fluid lesion."
          ],
          [
            "Target M",
            "The skin marker and tissue from the surface to the pectoral fascia are included in orthogonal cine sweeps."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.site-concordant-imaging.v1",
      "nextConceptId": "concept.palpable-breast.existing-target-series-reconciliation.v1",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes repeat-targeted-ultrasound ordering into an acquisition/retrieval distinction; retain the old imaging-order concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B19",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Key contains no quadrant copied from the stem. Neutral acquisition records distinguish review from repeat imaging; all three choices are concrete diagnostic steps.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a reproducible mobile thickening in the lower inner left breast. The clinician marks it M on the skin diagram. Diagnostic mammography shows no mass, distortion or calcification at M. The attached ultrasound PDF describes a simple cyst.",
    "previousPresentation": "{patientName}, a 47-year-old woman, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47",
        "presentation": "{patientName}, a 47-year-old woman, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality."
      },
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61",
        "presentation": "{patientName}, a 61-year-old woman, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.palpable-breast.a-discordant-exam",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Persistent breast thickening",
        "revisedPresentation": "{patientName}, a 47-year-old woman, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.palpable-breast.a-discordant-exam.female.47",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.a-discordant-exam.female.47",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 47-year-old woman, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.palpable-breast.a-discordant-exam.female.61",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.a-discordant-exam.female.61",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 61-year-old woman, has a reproducible thickening in the lower inner left breast. Diagnostic mammography shows no mass, distortion or calcification at the skin marker. The ultrasound attachment describes a simple cyst in the upper outer left breast; its image labels match that site. The clinician again feels the lower inner abnormality.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent breast thickening",
    "previousChiefComplaint": "Persistent breast thickening",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47",
        "chiefComplaint": "Persistent breast thickening"
      },
      {
        "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61",
        "chiefComplaint": "Persistent breast thickening"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b20",
    "auditId": "B2B20",
    "caseId": "case.bread-butter.perianal-abscess.draining-pain",
    "nodeId": "node.bread-butter.perianal-abscess.draining-pain.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v4.r1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Open drainage with systemic antibiotics",
      "Open drainage with local wound care",
      "Needle aspiration with systemic antibiotics",
      "Needle aspiration with local wound care"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Trace the MRI column to its intersphincteric origin instead of treating every high collection as externally accessible. Then: Choose drainage through the appropriate plane and use the separate systemic/extent findings for adjunctive therapy.",
    "reviewerNotes": "Complex infection requires colorectal assessment and appropriate resuscitation; the MRI description and new route claim remain clinician/source-alignment review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_4": "drain_4",
      "choice.qbp2b.r2.20261104.b2b20.d1": "choice.qbp2b.20261104.b2b20.d1",
      "choice.qbp2b.r2.20261104.b2b20.d2": "choice.qbp2b.20261104.b2b20.d2",
      "choice.qbp2b.r2.20261104.b2b20.d3": "choice.qbp2b.20261104.b2b20.d3"
    },
    "choiceServiceOverrides": {
      "drain_4": null,
      "choice.qbp2b.r2.20261104.b2b20.d1": null,
      "choice.qbp2b.r2.20261104.b2b20.d2": null,
      "choice.qbp2b.r2.20261104.b2b20.d3": null
    },
    "choiceTimingOverrides": {
      "drain_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b20.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b20.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b20.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v4.r2",
      "conceptId": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
      "stem": "Which drainage and adjunctive plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_4",
          "label": "Transanal drainage with systemic antibiotics",
          "isCorrect": true,
          "rationale": "An upward intersphincteric route favors internal drainage; spreading inflammation/systemic illness supports adjunctive antibiotics.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b20.d1",
          "label": "Transperineal drainage with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "Antibiotics address the host/extent question, but an external route through uninvolved planes can create an avoidable complex fistula for this origin."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b20.d2",
          "label": "Transanal drainage with local wound care",
          "isCorrect": false,
          "distractorRationale": "The route fits, but local care does not address the supplied spreading/systemic infection indication."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b20.d3",
          "label": "Transperineal drainage with local wound care",
          "isCorrect": false,
          "distractorRationale": "This combines the wrong access-plane inference with inadequate adjunctive scope."
        }
      ],
      "explanation": "An upward intersphincteric route favors internal drainage; spreading inflammation/systemic illness supports adjunctive antibiotics. Antibiotics address the host/extent question, but an external route through uninvolved planes can create an avoidable complex fistula for this origin. The route fits, but local care does not address the supplied spreading/systemic infection indication. This combines the wrong access-plane inference with inadequate adjunctive scope.",
      "teachingPoint": "An upward intersphincteric route favors internal drainage; spreading inflammation/systemic illness supports adjunctive antibiotics.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.r2.b2b20.application",
        "claim.qbp2b.r2.supralevator-origin-drainage"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Pelvic MRI observations",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Lower course",
          "Upper collection"
        ],
        "cells": [
          [
            "Fluid rises between the internal and external sphincters."
          ],
          [
            "The same fluid column continues above the levator muscle; the ischioanal fat is not the route connecting it to the lower focus."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "nextConceptId": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes superficial opening-versus-aspiration recall into an anatomical drainage-route decision; retain the old uncomplicated-abscess construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B20",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaces routine aspiration foils with a balanced anatomical-route/adjunct matrix. MRI is necessary because the disease is not a visible superficial pocket.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has persistent deep anal pain despite antibiotics. The external skin is not fluctuant, but deep examination is painful. Warm erythema extends across the adjacent buttock and fever persists.",
    "previousPresentation": "{patientName}, a 31-year-old woman, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.31",
        "presentation": "{patientName}, a 31-year-old woman, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.31",
        "presentation": "{patientName}, a 31-year-old man, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.52",
        "presentation": "{patientName}, a 52-year-old woman, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.52",
        "presentation": "{patientName}, a 52-year-old man, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.bread-butter.perianal-abscess.draining-pain",
        "patientPresentationVariantId": "presentation.bread-butter.perianal-abscess.draining-pain",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Painful perianal swelling",
        "revisedPresentation": "{patientName}, a 31-year-old woman, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.draining-pain.female.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.draining-pain.female.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old woman, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.draining-pain.male.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.draining-pain.male.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old man, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.draining-pain.female.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.draining-pain.female.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.draining-pain.male.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.draining-pain.male.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man, was given an oral antibiotic for perianal pain. The fever has settled, but sitting remains painful. A superficial bulge beside the anus is fluctuant, and warm erythema extends across the adjacent buttock beyond the bulge. Ultrasound shows a residual subcutaneous pocket with mobile contents.",
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
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Deep anal pain",
    "previousChiefComplaint": "Painful perianal swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.female.52",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.draining-pain.male.52",
        "chiefComplaint": "Painful perianal swelling"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b21",
    "auditId": "B2B21",
    "caseId": "case.gs028d.geriatrics.b-mobility-nutrition",
    "nodeId": "node.gs028d.geriatrics.b-mobility-nutrition.1",
    "previousQuestionVariantId": "question.postoperative-delirium.multicomponent-prevention-plan.v4.r1",
    "questionVariantId": "question.postoperative-delirium.multicomponent-prevention-plan.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which addition should be prioritized in {patientName}'s hospital delirium-prevention plan?",
    "previousChoiceLabels": [
      "Assisted walking, mealtime support and hydration review",
      "Sleep protection, glasses access and repeated reorientation",
      "Analgesia review, bladder assessment and bowel monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize a specific withdrawal possibility from the medication record and observed syndrome. Then: Apply the exception to routine delirium drug avoidance and treat that driver.",
    "reviewerNotes": "Not a universal diagnosis of withdrawal or an order outside monitored hospital care. Source alignment for the named agents is a hold; no dose or blanket superiority over all ICU regimens.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b21.d1": "choice.qbp2b.20261104.b2b21.d1",
      "choice.qbp2b.r2.20261104.b2b21.d2": "choice.qbp2b.20261104.b2b21.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b21.d1": null,
      "choice.qbp2b.r2.20261104.b2b21.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b21.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b21.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.postoperative-delirium.multicomponent-prevention-plan.v4.r2",
      "conceptId": "concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1",
      "stem": "Which medication should be given for {patientName}'s current episode?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Lorazepam",
          "isCorrect": true,
          "rationale": "The actual home exposure and interruption make withdrawal a relevant driver; a benzodiazepine can treat that mechanism rather than merely suppress the behaviour.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b21.d1",
          "label": "Haloperidol",
          "isCorrect": false,
          "distractorRationale": "An antipsychotic can be considered for selected severe behavioural symptoms but does not substitute for treatment of a benzodiazepine-withdrawal mechanism."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b21.d2",
          "label": "Dexmedetomidine",
          "isCorrect": false,
          "distractorRationale": "Monitored sedative strategies have selected roles; they do not replace addressing the withdrawal driver in this presented first medication decision."
        }
      ],
      "explanation": "The actual home exposure and interruption make withdrawal a relevant driver; a benzodiazepine can treat that mechanism rather than merely suppress the behaviour. An antipsychotic can be considered for selected severe behavioural symptoms but does not substitute for treatment of a benzodiazepine-withdrawal mechanism. Monitored sedative strategies have selected roles; they do not replace addressing the withdrawal driver in this presented first medication decision.",
      "teachingPoint": "The actual home exposure and interruption make withdrawal a relevant driver; a benzodiazepine can treat that mechanism rather than merely suppress the behaviour.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.delirium.multicomponent-plan",
        "claim.qbp2b.r2.b2b21.application",
        "claim.qbp2b.r2.withdrawal-delirium-exception"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.postoperative-delirium.multicomponent-prevention-plan",
      "nextConceptId": "concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Replaces an unfair prevention-bundle prioritization with a separate acute medication decision; preserve the prevention-plan concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B21",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Deletes all artificial competing prevention bundles and hydration priority. Current non-drug measures and dangerous behaviour establish why a medication decision is being made; the raw drug history changes it.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is in hospital after gastric surgery. A long-standing home prescription is clonazepam every evening; the inpatient administration record shows several usual evening doses omitted. The patient now has coarse tremor, sweating, inattention and visual misperceptions, and repeatedly pulls at drains despite family presence, reorientation and correction of pain and bladder distension.",
    "previousPresentation": "{patientName}, a 68-year-old woman, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource."
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.68",
        "presentation": "{patientName}, a 68-year-old man, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource."
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.80",
        "presentation": "{patientName}, a 80-year-old woman, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource."
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.80",
        "presentation": "{patientName}, a 80-year-old man, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.geriatrics.b-mobility-nutrition",
        "patientPresentationVariantId": "presentation.gs028d.geriatrics.b-mobility-nutrition",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Perioperative care planning",
        "revisedPresentation": "{patientName}, a 68-year-old woman, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.geriatrics.b-mobility-nutrition.female.68",
            "approvedInstantiationProfileId": "profile.gs028d.geriatrics.b-mobility-nutrition.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.geriatrics.b-mobility-nutrition.male.68",
            "approvedInstantiationProfileId": "profile.gs028d.geriatrics.b-mobility-nutrition.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.geriatrics.b-mobility-nutrition.female.80",
            "approvedInstantiationProfileId": "profile.gs028d.geriatrics.b-mobility-nutrition.female.80",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 80-year-old woman, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.geriatrics.b-mobility-nutrition.male.80",
            "approvedInstantiationProfileId": "profile.gs028d.geriatrics.b-mobility-nutrition.male.80",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 80-year-old man, is preparing for major gastric surgery. The patient is oriented and takes part in planning, but now needs a second person to rise from a chair and leaves much of each meal untouched. The family has been doing the shopping because the patient must stop and rest after a few steps. The ward team is choosing the first additional prevention measures to resource.",
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
        "ageYears": 68,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative agitation",
    "previousChiefComplaint": "Perioperative care planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.68",
        "chiefComplaint": "Perioperative care planning"
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.68",
        "chiefComplaint": "Perioperative care planning"
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.female.80",
        "chiefComplaint": "Perioperative care planning"
      },
      {
        "id": "profile.gs028d.geriatrics.b-mobility-nutrition.male.80",
        "chiefComplaint": "Perioperative care planning"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b22",
    "auditId": "B2B22",
    "caseId": "case.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta",
    "nodeId": "node.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.1",
    "previousQuestionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r1",
    "questionVariantId": "question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which receiving-hospital pathway should be requested for {patientName}?",
    "previousChoiceLabels": [
      "Operating theatre for bowel assessment and vascular planning",
      "Angiography suite for catheter treatment and later bowel review",
      "Monitored ward for anticoagulation and later bowel review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Read the vascular phase to identify the venous rather than arterial target. Then: Use the current examination to choose anticoagulation while continuing clinical reassessment.",
    "reviewerNotes": "Single WSES source and original synthetic CT description; specialist assessment and ongoing reassessment remain necessary.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b22.d1": "choice.qbp2b.20261104.b2b22.d1",
      "choice.qbp2b.r2.20261104.b2b22.d2": "choice.qbp2b.20261104.b2b22.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b22.d1": null,
      "choice.qbp2b.r2.20261104.b2b22.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b22.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b22.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r2",
      "conceptId": "concept.mesenteric-ischaemia.venous-thrombosis-initial-pathway.v1",
      "stem": "Which treatment should be started for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Intravenous unfractionated heparin",
          "isCorrect": true,
          "rationale": "The raw phase findings localize thrombosis to the mesenteric venous route. In the supplied absence of peritonitis, anticoagulation is the offered initial treatment rather than an arterial or operative pathway.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b22.d1",
          "label": "Catheter-directed mesenteric thrombolysis",
          "isCorrect": false,
          "distractorRationale": "Endovascular escalation has selected roles; it is not the routine first step for the supplied venous presentation without the relevant failure/complication boundary."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b22.d2",
          "label": "Exploratory laparotomy",
          "isCorrect": false,
          "distractorRationale": "A changed peritoneal examination or evidence of nonviable bowel would change the operative boundary; the current data do not make exploration the initial route."
        }
      ],
      "explanation": "The raw phase findings localize thrombosis to the mesenteric venous route. In the supplied absence of peritonitis, anticoagulation is the offered initial treatment rather than an arterial or operative pathway. Endovascular escalation has selected roles; it is not the routine first step for the supplied venous presentation without the relevant failure/complication boundary. A changed peritoneal examination or evidence of nonviable bowel would change the operative boundary; the current data do not make exploration the initial route.",
      "teachingPoint": "The raw phase findings localize thrombosis to the mesenteric venous route. In the supplied absence of peritonitis, anticoagulation is the offered initial treatment rather than an arterial or operative pathway.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.ami.peritonitis-exploration",
        "claim.qbp2b.r2.b2b22.application",
        "claim.qbp2b.r2.mesenteric-venous-initial-treatment"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "CT angiographic phases",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Arterial phase",
          "Portal-venous phase",
          "Bowel"
        ],
        "cells": [
          [
            "Contrast fills the superior mesenteric artery and its branches."
          ],
          [
            "A persistent filling defect occupies the superior mesenteric vein and extends into tributaries."
          ],
          [
            "Loops are thickened with mesenteric oedema; the scan shows no free intraperitoneal gas."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      "nextConceptId": "concept.mesenteric-ischaemia.venous-thrombosis-initial-pathway.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a duplicate arterial-peritonitis rule into the distinct venous-ischaemia initial pathway; preserve the original emergency-exploration concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B22",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes clinic/transfer ambiguity and both later-review foils. Distinguishes this sibling by a different vascular compartment and action, not lactate wording.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed in hospital for acute diffuse abdominal pain after a dehydrating illness. The abdomen is tender but moves with breathing and is not rigid between palpations. There is no involuntary guarding.",
    "previousPresentation": "{patientName}, a 59-year-old woman, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.59",
        "presentation": "{patientName}, a 59-year-old woman, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.59",
        "presentation": "{patientName}, a 59-year-old man, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.73",
        "presentation": "{patientName}, a 73-year-old woman, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval."
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.73",
        "presentation": "{patientName}, a 73-year-old man, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta",
        "patientPresentationVariantId": "presentation.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Abdominal pain worsening",
        "revisedPresentation": "{patientName}, a 59-year-old woman, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.59",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.59",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 59-year-old woman, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.59",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.59",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 59-year-old man, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.73",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.73",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old woman, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.73",
            "approvedInstantiationProfileId": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.73",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old man, brings a same-day CTA report showing a superior mesenteric arterial occlusion. The hospital plan had been catheter treatment. Before transfer, pain becomes diffuse; coughing and small movements hurt, and the abdominal wall remains rigid between palpations. The most recent lactate is within the laboratory interval.",
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
        "ageYears": 59,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Acute abdominal pain",
    "previousChiefComplaint": "Abdominal pain worsening",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.59",
        "chiefComplaint": "Abdominal pain worsening"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.59",
        "chiefComplaint": "Abdominal pain worsening"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.female.73",
        "chiefComplaint": "Abdominal pain worsening"
      },
      {
        "id": "profile.gs028c.acute-mesenteric-ischemia.b-peritonitis-after-cta.male.73",
        "chiefComplaint": "Abdominal pain worsening"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b23",
    "auditId": "B2B23",
    "caseId": "case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
    "nodeId": "node.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.1",
    "previousQuestionVariantId": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r1",
    "questionVariantId": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which plan should be taken to {patientName}'s discharge meeting?",
    "previousChoiceLabels": [
      "Early laparoscopic cholecystectomy",
      "ERCP preceding laparoscopic cholecystectomy",
      "Delayed laparoscopic cholecystectomy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the persistent local complication despite symptom and intake recovery. Then: Separate cholecystectomy timing from the independent need for ERCP.",
    "reviewerNotes": "Timing is interval reassessment of the local complication, not an arbitrary wait. Exact complicated-disease source alignment is required; no lipase-normalization gate.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b23.d1": "choice.qbp2b.20261104.b2b23.d1",
      "choice.qbp2b.r2.20261104.b2b23.d2": "choice.qbp2b.20261104.b2b23.d2",
      "choice.qbp2b.r2.20261104.b2b23.d3": "choice.qbp2b.20261104.b2b23.d1"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b23.d1": null,
      "choice.qbp2b.r2.20261104.b2b23.d2": null,
      "choice.qbp2b.r2.20261104.b2b23.d3": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b23.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b23.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b23.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r2",
      "conceptId": "concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1",
      "stem": "Which biliary treatment plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Interval cholecystectomy; no ERCP",
          "isCorrect": true,
          "rationale": "The local complication changes the timing despite clinical improvement; the current duct findings do not establish a separate ERCP indication.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b23.d1",
          "label": "Same-admission cholecystectomy; no ERCP",
          "isCorrect": false,
          "distractorRationale": "This applies the mild uncomplicated pancreatitis timing pathway to a patient with a persisting local complication."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b23.d2",
          "label": "Interval cholecystectomy; ERCP",
          "isCorrect": false,
          "distractorRationale": "Deferring the operation does not itself create a need for duct intervention in the current record."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b23.d3",
          "label": "Same-admission cholecystectomy; ERCP",
          "isCorrect": false,
          "distractorRationale": "This combines the uncomplicated timing assumption with a duct procedure not established by the supplied findings."
        }
      ],
      "explanation": "The local complication changes the timing despite clinical improvement; the current duct findings do not establish a separate ERCP indication. This applies the mild uncomplicated pancreatitis timing pathway to a patient with a persisting local complication. Deferring the operation does not itself create a need for duct intervention in the current record. This combines the uncomplicated timing assumption with a duct procedure not established by the supplied findings.",
      "teachingPoint": "The local complication changes the timing despite clinical improvement; the current duct findings do not establish a separate ERCP indication.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.pancreatitis.index-admission-cholecystectomy",
        "claim.qbp2b.r2.b2b23.application",
        "claim.qbp2b.r2.pancreatitis-local-complication-timing"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
      "nextConceptId": "concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes uncomplicated same-admission timing recall into a complication-dependent timing/duct decision; retain the older mild-disease card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B23",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaces the decorative lipase row with a local complication that changes treatment. A balanced timing/duct matrix removes a uniquely cautious or comprehensive key.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is reviewed during a gallstone-pancreatitis admission. Pain has subsided and meals are now tolerated. The current CT shows a persisting peripancreatic fluid-and-debris collection beside areas that did not enhance on the earlier scan. Gallstones remain; bilirubin is now within its reporting interval and the duct study shows passage into the duodenum without a filling defect.",
    "previousPresentation": "{patientName}, a 30-year-old woman, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.30",
        "presentation": "{patientName}, a 30-year-old woman, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect."
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.30",
        "presentation": "{patientName}, a 30-year-old man, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect."
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.60",
        "presentation": "{patientName}, a 60-year-old woman, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect."
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.60",
        "presentation": "{patientName}, a 60-year-old man, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
        "patientPresentationVariantId": "presentation.gs028c.mild-biliary-pancreatitis.b-discharge-rounds",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Pancreatitis discharge planning",
        "revisedPresentation": "{patientName}, a 30-year-old woman, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.30",
            "approvedInstantiationProfileId": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.30",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 30-year-old woman, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.30",
            "approvedInstantiationProfileId": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.30",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 30-year-old man, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.60",
            "approvedInstantiationProfileId": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.60",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 60-year-old woman, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.60",
            "approvedInstantiationProfileId": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.60",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 60-year-old man, brings the hospital record from a gallstone-pancreatitis admission. Pain has settled and meals are tolerated. The patient is walking on room air with blood pressure at the usual range. Imaging shows enhancing pancreas without necrosis or a persistent collection; gallstones remain. Lipase is still above the laboratory reference interval, while bilirubin has returned within range and the duct contains no visible filling defect.",
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
        "ageYears": 30,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Pancreatitis discharge review",
    "previousChiefComplaint": "Pancreatitis discharge planning",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.30",
        "chiefComplaint": "Pancreatitis discharge planning"
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.30",
        "chiefComplaint": "Pancreatitis discharge planning"
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.female.60",
        "chiefComplaint": "Pancreatitis discharge planning"
      },
      {
        "id": "profile.gs028c.mild-biliary-pancreatitis.b-discharge-rounds.male.60",
        "chiefComplaint": "Pancreatitis discharge planning"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b24",
    "auditId": "B2B24",
    "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
    "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
    "previousQuestionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
    "questionVariantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which endpoints should be requested for {patientName}'s image-guided bracketing?",
    "previousChoiceLabels": [
      "Original marker to current enhancing edge",
      "Original marker to pretreatment outer edge",
      "Current enhancing edge to pretreatment outer edge"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": "Breast conservation is the established operative approach. The surgeon requests image-guided bracketing within the mapped quadrant. The original biopsy bed is marked M. The current MRI enhancement ends at E. A stereotactic specimen from C contains ducts filled by markedly atypical epithelial cells with central necrosis; the examined cores show no stromal invasion.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the C specimen as a residual malignant duct process rather than assume the enhancement edge is the complete disease map. Then: Translate the original site plus residual field into bracketing endpoints.",
    "reviewerNotes": "The unchanged later gate/operation question remains compatible with localized disease in one conservation field. No claim of tumour-free margins or complete exclusion of invasion from sampled cores.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.r2.20261104.b2b24.d1": "choice.qbp2b.20261104.b2b24.d1",
      "choice.qbp2b.r2.20261104.b2b24.d2": "choice.qbp2b.20261104.b2b24.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.diagnostic_breast_imaging",
      "choice.qbp2b.r2.20261104.b2b24.d1": null,
      "choice.qbp2b.r2.20261104.b2b24.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.r2.20261104.b2b24.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qbp2b.r2.20261104.b2b24.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      }
    },
    "question": {
      "id": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "stem": "Which endpoints should be requested for {patientName}'s bracketing?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "M to C",
          "isCorrect": true,
          "rationale": "The residual calcification field has malignant in-situ histology at C, so the MRI enhancement edge is not the complete target. Include the original marked bed and that residual field.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b24.d1",
          "label": "M to E",
          "isCorrect": false,
          "distractorRationale": "This covers the original bed and MRI enhancement but stops short of the biopsy-supported residual calcification field."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b24.d2",
          "label": "M to P",
          "isCorrect": false,
          "distractorRationale": "The old palpable outline is not automatically the current localization boundary; the map identifies the residual field and original marked site."
        }
      ],
      "explanation": "The residual calcification field has malignant in-situ histology at C, so the MRI enhancement edge is not the complete target. Include the original marked bed and that residual field. This covers the original bed and MRI enhancement but stops short of the biopsy-supported residual calcification field. The old palpable outline is not automatically the current localization boundary; the map identifies the residual field and original marked site.",
      "teachingPoint": "The residual calcification field has malignant in-situ histology at C, so the MRI enhancement edge is not the complete target. Include the original marked bed and that residual field.",
      "supportingEvidenceClaimIds": [
        "claim.nact.response-mapping",
        "claim.nact.bcs-selection",
        "claim.qbp2b.r2.b2b24.application",
        "claim.qbp2b.r2.residual-calcification-bracketing"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "image",
        "caption": "Constructed one-quadrant localization map; not to scale.",
        "assetPath": "clinical-exhibits/batch2b-r2-b24-breast-map.png",
        "description": "Along the mapped quadrant from medial to lateral are M, E, C and P. M is the original biopsy marker. Current MRI enhancement extends from M to E. Mammographic calcifications extend from M through E to C. P marks the old outer palpable outline. Sample C was taken at the calcification edge. All points are within the same planned conservation field.",
        "width": 820,
        "height": 1080
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
      "ownerItemId": "B2B24",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Adds the agreed conservation scope and an original spatial exhibit. Every option includes M, and P is no longer eliminated by an explicit negative row. The histology and geometry must determine the endpoint.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b25",
    "auditId": "B2B25",
    "caseId": "case.gs028c.acute-cholecystitis.b-hida-confirmed",
    "nodeId": "node.gs028c.acute-cholecystitis.b-hida-confirmed.1",
    "previousQuestionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r1",
    "questionVariantId": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment plan should be arranged for {patientName}'s admission?",
    "previousChoiceLabels": [
      "Early laparoscopic cholecystectomy",
      "Percutaneous gallbladder drainage",
      "Delayed laparoscopic cholecystectomy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the raw exposure has not established the safe lower anatomy for total removal. Then: Use the remaining tissue quality when choosing the subtotal technique.",
    "reviewerNotes": "No numerical tissue/duct threshold, fixed timing or claim that all conversions are wrong. Clinical and exact source alignment of the completion choice required.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b25.d1": "choice.qbp2b.20261104.b2b25.d1",
      "choice.qbp2b.r2.20261104.b2b25.d2": "choice.qbp2b.20261104.b2b25.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b25.d1": null,
      "choice.qbp2b.r2.20261104.b2b25.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b25.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b25.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r2",
      "conceptId": "concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1",
      "stem": "Which operative completion plan should be used for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Fenestrating subtotal cholecystectomy",
          "isCorrect": true,
          "rationale": "The anatomy calls for a bailout rather than continued total dissection, and the remaining wall is not a sound basis for a closed remnant. An open-remnant subtotal strategy with appropriate drainage is the offered fit.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b25.d1",
          "label": "Reconstituting subtotal cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "This is a genuine subtotal alternative, but it requires a safely closable remnant; the actual wall quality changes that choice."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b25.d2",
          "label": "Fundus-first total cholecystectomy",
          "isCorrect": false,
          "distractorRationale": "A top-down total operation does not itself resolve the fused lower anatomy or justify continuing to the uncertain hilum."
        }
      ],
      "explanation": "The anatomy calls for a bailout rather than continued total dissection, and the remaining wall is not a sound basis for a closed remnant. An open-remnant subtotal strategy with appropriate drainage is the offered fit. This is a genuine subtotal alternative, but it requires a safely closable remnant; the actual wall quality changes that choice. A top-down total operation does not itself resolve the fused lower anatomy or justify continuing to the uncertain hilum.",
      "teachingPoint": "The anatomy calls for a bailout rather than continued total dissection, and the remaining wall is not a sound basis for a closed remnant. An open-remnant subtotal strategy with appropriate drainage is the offered fit.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
        "claim.gs028g.subtotal-cholecystectomy.remnant-classification",
        "claim.qbp2b.r2.b2b25.application",
        "claim.qbp2b.r2.subtotal-remnant-tissue-choice"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      "nextConceptId": "concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes ordinary admission timing into an intraoperative completion decision; retain the older index-admission treatment card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B25",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Deletes the unsupported HIDA adequacy sentence and routine early-versus-drainage comparison. Three named operations compete after actual exposure, not an author label saying the critical view is impossible.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is in theatre for acute gallbladder inflammation. Dense fused tissue joins the infundibulum to the hilum; the lower gallbladder cannot be separated from the liver and both entering tubular structures have not been exposed. Opening the gallbladder releases impacted stones. The remaining neck wall is thin, necrotic and splits under gentle handling.",
    "previousPresentation": "{patientName}, a 47-year-old woman, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.47",
        "presentation": "{patientName}, a 47-year-old woman, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.47",
        "presentation": "{patientName}, a 47-year-old man, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.62",
        "presentation": "{patientName}, a 62-year-old woman, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.62",
        "presentation": "{patientName}, a 62-year-old man, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.acute-cholecystitis.b-hida-confirmed",
        "patientPresentationVariantId": "presentation.gs028c.acute-cholecystitis.b-hida-confirmed",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Biliary admission review",
        "revisedPresentation": "{patientName}, a 47-year-old woman, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.47",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.47",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 47-year-old woman, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.47",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.47",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 47-year-old man, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.62",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.62",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 62-year-old woman, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.62",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.62",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 62-year-old man, brings the hospital record for persistent right-upper-quadrant pain and an ultrasound showing gallstones without a clear wall or surrounding-fluid change. In the subsequent nuclear study, tracer enters the ducts and small bowel, but the gallbladder remains unvisualized through the completed diagnostic acquisition. Fever and tenderness improved during admission, and the patient is eating and walking without circulatory or respiratory support.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Gallbladder operation review",
    "previousChiefComplaint": "Biliary admission review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.47",
        "chiefComplaint": "Biliary admission review"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.47",
        "chiefComplaint": "Biliary admission review"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.female.62",
        "chiefComplaint": "Biliary admission review"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.b-hida-confirmed.male.62",
        "chiefComplaint": "Biliary admission review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b26",
    "auditId": "B2B26",
    "caseId": "case.gs028c.acute-cholecystitis.a-limited-ultrasound",
    "nodeId": "node.gs028c.acute-cholecystitis.a-limited-ultrasound.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r1",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which additional investigation should be requested for {patientName}?",
    "previousChoiceLabels": [
      "Hepatobiliary scintigraphy",
      "Contrast-enhanced abdominal CT",
      "Magnetic resonance cholangiopancreatography"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Separate the new persistent focal inflammatory episode from the earlier dyspeptic history and a ductal-obstruction pathway. Then: Select a test addressing the unresolved acute gallbladder question despite nondiagnostic anatomic observations.",
    "reviewerNotes": "Best offered test in this scoped scenario, not a universal HIDA-over-CT hierarchy. Nuclear preparation/augmentation interpretation is not scored, and no exact test threshold or wait is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b26.d1": "choice.qbp2b.20261104.b2b26.d1",
      "choice.qbp2b.r2.20261104.b2b26.d2": "choice.qbp2b.20261104.b2b26.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b26.d1": null,
      "choice.qbp2b.r2.20261104.b2b26.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.qbp2b.r2.20261104.b2b26.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      },
      "choice.qbp2b.r2.20261104.b2b26.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      }
    },
    "question": {
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v3.r2",
      "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "stem": "Which investigation should be requested next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": true,
          "rationale": "Persistent acute gallbladder-pattern symptoms and inflammation remain unresolved by the wall/fluid observations; scintigraphy is the offered investigation that addresses that discordance.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b26.d1",
          "label": "Magnetic resonance cholangiopancreatography",
          "isCorrect": false,
          "distractorRationale": "A ductal stone pathway is a real competing biliary question, but the current duct/liver-panel observations do not best account for the new gallbladder-localized acute episode."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b26.d2",
          "label": "Upper gastrointestinal endoscopy",
          "isCorrect": false,
          "distractorRationale": "The earlier naproxen/burning history makes an upper-GI source credible, but it does not best account for the changed focal inflammatory episode."
        }
      ],
      "explanation": "Persistent acute gallbladder-pattern symptoms and inflammation remain unresolved by the wall/fluid observations; scintigraphy is the offered investigation that addresses that discordance. A ductal stone pathway is a real competing biliary question, but the current duct/liver-panel observations do not best account for the new gallbladder-localized acute episode. The earlier naproxen/burning history makes an upper-GI source credible, but it does not best account for the changed focal inflammatory episode.",
      "teachingPoint": "Persistent acute gallbladder-pattern symptoms and inflammation remain unresolved by the wall/fluid observations; scintigraphy is the offered investigation that addresses that discordance.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qbp2b.r2.b2b26.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
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
      "ownerItemId": "B2B26",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes contrast CT from an unresolved equal-ranking comparison. Retains credible neighboring ductal and upper-GI questions, supplies raw ultrasound findings and uses no availability or test-property lead-in.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed acutely for constant right-upper-quadrant pain and focal inspiratory tenderness. The temperature and inflammatory markers have risen. Earlier symptoms included intermittent epigastric burning while taking naproxen. Ultrasound now shows gallstones, a wall within its measured reference range and no pericholecystic fluid. The common duct is not enlarged and the liver panel remains within its reporting intervals.",
    "previousPresentation": "{patientName}, a 50-year-old woman, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.50",
        "presentation": "{patientName}, a 50-year-old woman, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.50",
        "presentation": "{patientName}, a 50-year-old man, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.68",
        "presentation": "{patientName}, a 68-year-old man, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.acute-cholecystitis.a-limited-ultrasound",
        "patientPresentationVariantId": "presentation.gs028c.acute-cholecystitis.a-limited-ultrasound",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Persistent right-upper-quadrant pain",
        "revisedPresentation": "{patientName}, a 50-year-old woman, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.50",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.50",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 50-year-old woman, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.50",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.50",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 50-year-old man, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.68",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.68",
            "approvedInstantiationProfileId": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, has constant right-upper-quadrant pain and tenderness after an earlier meal-related episode. Temperature and inflammatory markers have risen. Ultrasound shows gallstones; the wall is not thickened and no surrounding fluid is seen. The liver panel is within its reference intervals and the common duct is not enlarged. Circulation remains stable.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent upper-abdominal pain",
    "previousChiefComplaint": "Persistent right-upper-quadrant pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.50",
        "chiefComplaint": "Persistent right-upper-quadrant pain"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.50",
        "chiefComplaint": "Persistent right-upper-quadrant pain"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.female.68",
        "chiefComplaint": "Persistent right-upper-quadrant pain"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-limited-ultrasound.male.68",
        "chiefComplaint": "Persistent right-upper-quadrant pain"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b29",
    "auditId": "B2B29",
    "caseId": "case.gs028d.hyperkalaemia.a-raas-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-raas-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v2.r1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Under the UKKA adult pathway, which plan should be arranged now for {patientName}?",
    "previousChoiceLabels": [
      "Emergency hospital assessment and treatment",
      "Community medicine review with another outpatient sample",
      "Earlier routine renal appointment with a dietary plan"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Do not equate a lower potassium number with resolution of the current electrical problem. Then: Choose the agent that addresses that problem while the overall potassium plan continues.",
    "reviewerNotes": "No calcium/insulin dose, re-dosing interval or outcome benefit. Recorded UKKA calcium evidence remains weak 2C.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b29.d1": "choice.qbp2b.20261104.b2b29.d1",
      "choice.qbp2b.r2.20261104.b2b29.d2": "choice.qbp2b.20261104.b2b29.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b29.d1": null,
      "choice.qbp2b.r2.20261104.b2b29.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b29.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b29.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v2.r2",
      "conceptId": "concept.hyperkalaemia.ecg-response-versus-potassium-shifting.v1",
      "stem": "Under the UKKA adult pathway, which IV treatment should be given next to {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "IV calcium gluconate",
          "isCorrect": true,
          "rationale": "The new electrical toxicity requires the calcium question to be addressed even though a shifting intervention has begun to lower the measured potassium.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b29.d1",
          "label": "IV insulin–glucose",
          "isCorrect": false,
          "distractorRationale": "Further shifting may have a role in the overall plan, but it does not replace responding to the current electrical/membrane problem."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b29.d2",
          "label": "IV sodium bicarbonate",
          "isCorrect": false,
          "distractorRationale": "Bicarbonate is not a substitute for the offered electrical-protection intervention in this nonacidemic record."
        }
      ],
      "explanation": "The new electrical toxicity requires the calcium question to be addressed even though a shifting intervention has begun to lower the measured potassium. Further shifting may have a role in the overall plan, but it does not replace responding to the current electrical/membrane problem. Bicarbonate is not a substitute for the offered electrical-protection intervention in this nonacidemic record.",
      "teachingPoint": "The new electrical toxicity requires the calcium question to be addressed even though a shifting intervention has begun to lower the measured potassium.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.hyperkalaemia.severe-transfer",
        "claim.gs028d.hyperkalaemia.mechanisms",
        "claim.qbp2b.r2.b2b29.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current bedside record",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "ECG comparison",
          "Blood gas",
          "Glucose"
        ],
        "cells": [
          [
            "QRS complexes have become broader than on admission and P waves are becoming difficult to identify."
          ],
          [
            "pH is within the laboratory interval."
          ],
          [
            "Within the laboratory interval on the current check."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.hyperkalaemia.ecg-response-versus-potassium-shifting.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a community emergency-threshold disposition into a hospital treatment-response decision; retain the old transfer concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B29",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Names ramipril, removes the irrelevant pre-drug normal panel and both outpatient-delay foils. Current rather than earlier data select among three IV agents.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is in hospital after a confirmed potassium of 6.6 mmol/L following a ramipril change. Insulin and glucose have been administered. The next potassium result is lower, but still above range.",
    "previousPresentation": "{patientName}, a 46-year-old woman, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.46",
        "presentation": "{patientName}, a 46-year-old woman, has had a renin–angiotensin-system medicine change and returns after a laboratory callback."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.46",
        "presentation": "{patientName}, a 46-year-old man, has had a renin–angiotensin-system medicine change and returns after a laboratory callback."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has had a renin–angiotensin-system medicine change and returns after a laboratory callback."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.68",
        "presentation": "{patientName}, a 68-year-old man, has had a renin–angiotensin-system medicine change and returns after a laboratory callback."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.hyperkalaemia.a-raas-result",
        "patientPresentationVariantId": "presentation.gs028d.hyperkalaemia.a-raas-result",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Potassium result review",
        "revisedPresentation": "{patientName}, a 46-year-old woman, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-raas-result.female.46",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-raas-result.female.46",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-raas-result.male.46",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-raas-result.male.46",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-raas-result.female.68",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-raas-result.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-raas-result.male.68",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-raas-result.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, has had a renin–angiotensin-system medicine change and returns after a laboratory callback.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Hospital potassium treatment",
    "previousChiefComplaint": "Potassium result review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.46",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.46",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.female.68",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-raas-result.male.68",
        "chiefComplaint": "Potassium result review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b30",
    "auditId": "B2B30",
    "caseId": "case.gs028d.hyperkalaemia.a-dehydration-result",
    "nodeId": "node.gs028d.hyperkalaemia.a-dehydration-result.1",
    "previousQuestionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v4.r1",
    "questionVariantId": "question.hyperkalaemia.severe-community-result-transfer.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Under the UKKA adult pathway, which plan should be arranged now for {patientName}?",
    "previousChoiceLabels": [
      "Emergency hospital assessment and treatment",
      "Community medicine review with another outpatient sample",
      "Earlier routine renal appointment with a dietary plan"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the persisting ketone and acid-base abnormalities despite the falling glucose. Then: Choose continuation of insulin together with substrate support rather than declare recovery from the glucose value.",
    "reviewerNotes": "This is a material objective change, not another potassium variant. No dose, universal stopping threshold, time to resolution or insulin-transition protocol is taught. New treatment alignment requires source/clinician review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b30.d1": "choice.qbp2b.20261104.b2b30.d1",
      "choice.qbp2b.r2.20261104.b2b30.d2": "choice.qbp2b.20261104.b2b30.d2",
      "choice.qbp2b.r2.20261104.b2b30.d3": "choice.qbp2b.20261104.b2b30.d1"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b30.d1": null,
      "choice.qbp2b.r2.20261104.b2b30.d2": null,
      "choice.qbp2b.r2.20261104.b2b30.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b30.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b30.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b30.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.hyperkalaemia.severe-community-result-transfer.v4.r2",
      "conceptId": "concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1",
      "stem": "Which infusion plan should be used now for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Continue insulin with glucose infusion",
          "isCorrect": true,
          "rationale": "Glucose has fallen without resolution of the ketone acidosis. Insulin remains needed for that metabolic process; glucose provides substrate while it continues.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b30.d1",
          "label": "Stop insulin with glucose infusion",
          "isCorrect": false,
          "distractorRationale": "This responds to the glucose trajectory but abandons insulin treatment while substantial ketone acidosis remains."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b30.d2",
          "label": "Continue insulin with isotonic saline infusion",
          "isCorrect": false,
          "distractorRationale": "This continues treatment of ketogenesis but does not address the changed glucose/substrate requirement."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b30.d3",
          "label": "Stop insulin with isotonic saline infusion",
          "isCorrect": false,
          "distractorRationale": "This treats the glucose number as the endpoint despite the persistent metabolic process."
        }
      ],
      "explanation": "Glucose has fallen without resolution of the ketone acidosis. Insulin remains needed for that metabolic process; glucose provides substrate while it continues. This responds to the glucose trajectory but abandons insulin treatment while substantial ketone acidosis remains. This continues treatment of ketogenesis but does not address the changed glucose/substrate requirement. This treats the glucose number as the endpoint despite the persistent metabolic process.",
      "teachingPoint": "Glucose has fallen without resolution of the ketone acidosis. Insulin remains needed for that metabolic process; glucose provides substrate while it continues.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
        "claim.gs028e.sglt2.ketoacidosis-precipitating-context",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.r2.b2b30.application",
        "claim.qbp2b.r2.persistent-ketone-acidosis-substrate"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed simultaneous treatment panels",
        "columnHeaders": [
          "Before insulin",
          "Current"
        ],
        "rowHeaders": [
          "Glucose (mmol/L)",
          "Beta-hydroxybutyrate (mmol/L)",
          "Bicarbonate (mmol/L)",
          "Arterial pH",
          "Arterial CO2 (mmHg)"
        ],
        "cells": [
          [
            "12.8",
            "5.1"
          ],
          [
            "5.8",
            "4.0"
          ],
          [
            "9",
            "11"
          ],
          [
            "7.21",
            "7.24"
          ],
          [
            "23",
            "26"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
      "nextConceptId": "concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a community potassium-transfer objective into inpatient ketone-acidosis treatment-response planning; preserve the original transfer card without history migration."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B30",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaces the first draft’s trivial low-glucose-to-glucose match with serial raw ketone, chemistry and gas data. The four balanced infusion plans test two linked decisions; none is a uniquely comprehensive rescue bundle.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is receiving intravenous insulin during admission after developing postoperative nausea and rapid breathing. Dapagliflozin was stopped on admission. Circulation and urine output have improved during treatment. Potassium is within its reporting interval on the latest specimen.",
    "previousPresentation": "{patientName}, a 31-year-old woman, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.31",
        "presentation": "{patientName}, a 31-year-old woman, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.31",
        "presentation": "{patientName}, a 31-year-old man, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.64",
        "presentation": "{patientName}, a 64-year-old woman, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result."
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.64",
        "presentation": "{patientName}, a 64-year-old man, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.hyperkalaemia.a-dehydration-result",
        "patientPresentationVariantId": "presentation.gs028d.hyperkalaemia.a-dehydration-result",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Potassium result review",
        "revisedPresentation": "{patientName}, a 31-year-old woman, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dehydration-result.female.31",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old woman, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dehydration-result.male.31",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old man, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dehydration-result.female.64",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.64",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old woman, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.hyperkalaemia.a-dehydration-result.male.64",
            "approvedInstantiationProfileId": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.64",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 64-year-old man, returns after gastrointestinal fluid losses. A first chemistry specimen was haemolysed. The patient feels less light-headed after drinking, and the laboratory has now called with the repeat result.",
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
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative metabolic treatment",
    "previousChiefComplaint": "Potassium result review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.31",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.31",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.female.64",
        "chiefComplaint": "Potassium result review"
      },
      {
        "id": "profile.gs028d.hyperkalaemia.a-dehydration-result.male.64",
        "chiefComplaint": "Potassium result review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b31",
    "auditId": "B2B31",
    "caseId": "case.gs028e.immunology.c3-injury-pathway",
    "nodeId": "node.gs028e.immunology.c3-injury-pathway.1",
    "previousQuestionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v4.r1",
    "questionVariantId": "question.immunology.preformed-antibody-hyperacute-rejection.v4.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which explanation and review focus best fit {patientName}'s graft event?",
    "previousChoiceLabels": [
      "Humoral injury; review compatibility testing",
      "Ischemic tubular injury; review perfusion records",
      "Cellular rejection; review immunosuppression records"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the donor/recipient reagent reactions and distinguish that compatibility system from HLA. Then: Choose pre-event records rather than assume a later antibody result establishes timing.",
    "reviewerNotes": "No antibody titre, ABO-incompatible protocol, autoantibody exclusion or claim that the displayed tests alone prove the event mechanism.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.b2b31.d1": "choice.qbp2b.20261104.b2b31.d1",
      "choice.qbp2b.r2.20261104.b2b31.d2": "choice.qbp2b.20261104.b2b31.d2",
      "choice.qbp2b.r2.20261104.b2b31.d3": "choice.qbp2b.20261104.b2b31.d1"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.b2b31.d1": null,
      "choice.qbp2b.r2.20261104.b2b31.d2": null,
      "choice.qbp2b.r2.20261104.b2b31.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b31.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b31.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b31.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.immunology.preformed-antibody-hyperacute-rejection.v4.r2",
      "conceptId": "concept.transplant.abo-versus-hla-and-pre-event-record.v1",
      "stem": "Which typing and antibody records should be reconciled for {patientName}'s event?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "ABO typing; preimplantation recipient serum",
          "isCorrect": true,
          "rationale": "The erythrocyte reactions raise an ABO compatibility question not answered by a negative HLA assay; the pre-event serum can examine the preceding antibody state.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b31.d1",
          "label": "ABO typing; post-event recipient serum",
          "isCorrect": false,
          "distractorRationale": "This addresses the relevant system but not whether the antibody state preceded implantation."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b31.d2",
          "label": "HLA typing; preimplantation recipient serum",
          "isCorrect": false,
          "distractorRationale": "The timing is appropriate, but another HLA record does not resolve the separate red-cell blood-group discrepancy."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b31.d3",
          "label": "HLA typing; post-event recipient serum",
          "isCorrect": false,
          "distractorRationale": "This neither resolves the separate ABO question nor establishes the pre-event state."
        }
      ],
      "explanation": "The erythrocyte reactions raise an ABO compatibility question not answered by a negative HLA assay; the pre-event serum can examine the preceding antibody state. This addresses the relevant system but not whether the antibody state preceded implantation. The timing is appropriate, but another HLA record does not resolve the separate red-cell blood-group discrepancy. This neither resolves the separate ABO question nor establishes the pre-event state.",
      "teachingPoint": "The erythrocyte reactions raise an ABO compatibility question not answered by a negative HLA assay; the pre-event serum can examine the preceding antibody state.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.hyperacute_preformed",
        "claim.gs028e.hyperacute_vascular",
        "claim.qf3.preimplantation-specimen-inference",
        "claim.qbp2b.r2.b2b31.application",
        "claim.qbp2b.r2.abo-versus-hla-record"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Archived compatibility bench record",
        "columnHeaders": [
          "Anti-A reagent",
          "Anti-B reagent"
        ],
        "rowHeaders": [
          "Donor erythrocytes",
          "Recipient erythrocytes"
        ],
        "cells": [
          [
            "Agglutination",
            "No agglutination"
          ],
          [
            "No agglutination",
            "No agglutination"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.immunology.graft-evidence-to-review-focus.v1",
      "nextConceptId": "concept.transplant.abo-versus-hla-and-pre-event-record.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes duplicate humoral-injury labelling into a distinct ABO/HLA record conflict; retain the prior mechanism-review concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B31",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaces another classic rejection explanation with a balanced system/time matrix and an actual bench-record discrepancy, distinct from the class-II cell-target sibling.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is seen after a kidney-graft event. The operative record describes mottling and loss of urine after perfusion. Major anastomoses remained patent; tissue contains endothelial immune deposits and capillary thrombi. The preimplantation HLA cell-binding report was negative.",
    "previousPresentation": "{patientName}, a 52-year-old woman, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.52",
        "presentation": "{patientName}, a 52-year-old woman, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi."
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.52",
        "presentation": "{patientName}, a 52-year-old man, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi."
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.73",
        "presentation": "{patientName}, a 73-year-old woman, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi."
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.73",
        "presentation": "{patientName}, a 73-year-old man, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028e.immunology.c3-injury-pathway",
        "patientPresentationVariantId": "presentation.gs028e.immunology.c3-injury-pathway",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Graft-event explanation",
        "revisedPresentation": "{patientName}, a 52-year-old woman, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-injury-pathway.female.52",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-injury-pathway.female.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-injury-pathway.male.52",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-injury-pathway.male.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-injury-pathway.female.73",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-injury-pathway.female.73",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old woman, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028e.immunology.c3-injury-pathway.male.73",
            "approvedInstantiationProfileId": "profile.gs028e.immunology.c3-injury-pathway.male.73",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 73-year-old man, reviews a previous kidney-transplant admission. The graft initially perfused, then became swollen and mottled during the operation. The arterial and venous anastomoses remained open. The stored preimplantation serum binds donor cells; a recipient-cell control does not. Tissue shows endothelial complement deposition and widespread capillary thrombi.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Transplant event review",
    "previousChiefComplaint": "Graft-event explanation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.52",
        "chiefComplaint": "Graft-event explanation"
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.52",
        "chiefComplaint": "Graft-event explanation"
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.female.73",
        "chiefComplaint": "Graft-event explanation"
      },
      {
        "id": "profile.gs028e.immunology.c3-injury-pathway.male.73",
        "chiefComplaint": "Graft-event explanation"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b32",
    "auditId": "B2B32",
    "caseId": "case.gs028d.acid-base.b-cirrhosis-gap",
    "nodeId": "node.gs028d.acid-base.b-cirrhosis-gap.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which investigation should the hospital team pursue for {patientName}'s reported episode?",
    "previousChoiceLabels": [
      "Serum lactate and blood-ketone testing",
      "Renal acidification testing with urinary electrolytes",
      "Ventilation reassessment with a repeat blood gas"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Calculate the gap and albumin adjustment instead of using the apparently normal raw result. Then: Prioritize an unmeasured-acid workup despite a plausible concurrent gastrointestinal bicarbonate loss.",
    "reviewerNotes": "Exact equation, units and reference mapping are explicitly source-held pending targeted verification. Values are constructed and arithmetic-checked, not extracted patient data or an empirical probability.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.r2.20261104.b2b32.d1": "choice.qbp2b.20261104.b2b32.d1",
      "choice.qbp2b.r2.20261104.b2b32.d2": "choice.qbp2b.20261104.b2b32.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.r2.20261104.b2b32.d1": null,
      "choice.qbp2b.r2.20261104.b2b32.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b32.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b32.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r2",
      "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "stem": "Which cause-directed laboratory request should be made first for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Lactate and beta-hydroxybutyrate",
          "isCorrect": true,
          "rationale": "The raw gap is 12 but the stated correction makes it 19. The loose-stool explanation does not account for all of the displayed metabolic component; initial unmeasured-acid testing is warranted.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b32.d1",
          "label": "Urinary electrolytes and urine pH",
          "isCorrect": false,
          "distractorRationale": "These can address selected non-gap renal acidification questions; accepting the raw gap as the entire classification misses the albumin effect here."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b32.d2",
          "label": "Stool electrolytes and osmotic gap",
          "isCorrect": false,
          "distractorRationale": "The stool history is real, but characterizing diarrhoea does not resolve the additional elevated adjusted-gap component."
        }
      ],
      "explanation": "The raw gap is 12 but the stated correction makes it 19. The loose-stool explanation does not account for all of the displayed metabolic component; initial unmeasured-acid testing is warranted. These can address selected non-gap renal acidification questions; accepting the raw gap as the entire classification misses the albumin effect here. The stool history is real, but characterizing diarrhoea does not resolve the additional elevated adjusted-gap component.",
      "teachingPoint": "The raw gap is 12 but the stated correction makes it 19. The loose-stool explanation does not account for all of the displayed metabolic component; initial unmeasured-acid testing is warranted.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.corrected-gap",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.r2.b2b32.application",
        "claim.qbp2b.r2.gap-calculation-aid"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed laboratory record. Calculation aid: AG = Na − (Cl + HCO3); albumin-adjusted AG = AG + 0.25 × (40 − albumin in g/L). This laboratory uses an upper AG reference of 16 mmol/L.",
        "columnHeaders": [
          "Current value"
        ],
        "rowHeaders": [
          "Sodium (mmol/L)",
          "Chloride (mmol/L)",
          "Bicarbonate (mmol/L)",
          "Albumin (g/L)",
          "Arterial pH",
          "Arterial CO2 (mmHg)"
        ],
        "cells": [
          [
            "140"
          ],
          [
            "112"
          ],
          [
            "16"
          ],
          [
            "12"
          ],
          [
            "7.32"
          ],
          [
            "32"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "nextConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B32",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes every supplied gap conclusion and retrospective testing ambiguity. The calculation aid and coherent current numbers require work, and all alternatives are concrete cause-directed laboratory requests.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, with cirrhosis is being assessed in hospital for rapid breathing and weakness. Lactulose has been associated with more loose stools, and creatinine remains close to the earlier result. The current chemistry and arterial sample were drawn together.",
    "previousPresentation": "{patientName}, a 49-year-old woman, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.49",
        "presentation": "{patientName}, a 49-year-old woman, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.49",
        "presentation": "{patientName}, a 49-year-old man, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.67",
        "presentation": "{patientName}, a 67-year-old woman, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”."
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.67",
        "presentation": "{patientName}, a 67-year-old man, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.acid-base.b-cirrhosis-gap",
        "patientPresentationVariantId": "presentation.gs028d.acid-base.b-cirrhosis-gap",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Hospital acid-base review",
        "revisedPresentation": "{patientName}, a 49-year-old woman, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-cirrhosis-gap.female.49",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-cirrhosis-gap.female.49",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 49-year-old woman, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-cirrhosis-gap.male.49",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-cirrhosis-gap.male.49",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 49-year-old man, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-cirrhosis-gap.female.67",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-cirrhosis-gap.female.67",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 67-year-old woman, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-cirrhosis-gap.male.67",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-cirrhosis-gap.male.67",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 67-year-old man, with cirrhosis brings the completed record of an admission for weakness and rapid breathing. The chemistry report was initially filed as “gap within range”.",
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
        "ageYears": 49,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Acidemia during admission",
    "previousChiefComplaint": "Hospital acid-base review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.49",
        "chiefComplaint": "Hospital acid-base review"
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.49",
        "chiefComplaint": "Hospital acid-base review"
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.female.67",
        "chiefComplaint": "Hospital acid-base review"
      },
      {
        "id": "profile.gs028d.acid-base.b-cirrhosis-gap.male.67",
        "chiefComplaint": "Hospital acid-base review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b33",
    "auditId": "B2B33",
    "caseId": "case.gs028d.acid-base.b-malnutrition-gap",
    "nodeId": "node.gs028d.acid-base.b-malnutrition-gap.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which investigation should the hospital team pursue for {patientName}'s reported episode?",
    "previousChoiceLabels": [
      "Serum lactate and blood-ketone testing",
      "Renal acidification testing with urinary electrolytes",
      "Ventilation reassessment with a repeat blood gas"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the elevated-gap component is not excluded by the reported pH/CO2 combination. Then: Use the specific drug/exposure context to prioritize blood ketones despite current glucose.",
    "reviewerNotes": "Qualitative gas directions do not quantify compensation or prove a single disorder. No glucose, ketone, medication-hold or treatment threshold is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b33.d1": "choice.qbp2b.20261104.b2b33.d1",
      "choice.qbp2b.r2.20261104.b2b33.d2": "choice.qbp2b.20261104.b2b33.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b33.d1": null,
      "choice.qbp2b.r2.20261104.b2b33.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b33.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b33.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r2",
      "conceptId": "concept.acid-base.euglycaemic-risk-with-mixed-gas.v1",
      "stem": "Which assay should be prioritized for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Blood beta-hydroxybutyrate",
          "isCorrect": true,
          "rationale": "A near-normal pH and glucose do not resolve the elevated-gap component. The SGLT2 exposure and perioperative intake context make blood ketone assessment important.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b33.d1",
          "label": "Urinary ammonium excretion",
          "isCorrect": false,
          "distractorRationale": "This targets selected non-gap renal causes; the current gap and drug/context signal point elsewhere first."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b33.d2",
          "label": "Serum salicylate concentration",
          "isCorrect": false,
          "distractorRationale": "This is a credible cause of some mixed respiratory/metabolic patterns, but the documented drug and perioperative context give a specific competing test priority here."
        }
      ],
      "explanation": "A near-normal pH and glucose do not resolve the elevated-gap component. The SGLT2 exposure and perioperative intake context make blood ketone assessment important. This targets selected non-gap renal causes; the current gap and drug/context signal point elsewhere first. This is a credible cause of some mixed respiratory/metabolic patterns, but the documented drug and perioperative context give a specific competing test priority here.",
      "teachingPoint": "A near-normal pH and glucose do not resolve the elevated-gap component. The SGLT2 exposure and perioperative intake context make blood ketone assessment important.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.corrected-gap",
        "claim.gs028d.acidosis.blood-gas",
        "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
        "claim.gs028e.sglt2.ketoacidosis-precipitating-context",
        "claim.qbp2b.r2.b2b33.application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current paired gas and chemistry; all relations use this laboratory's intervals",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "pH",
          "Arterial CO2",
          "Bicarbonate",
          "Raw anion gap",
          "Albumin",
          "Glucose"
        ],
        "cells": [
          [
            "At the upper end of the interval"
          ],
          [
            "Below"
          ],
          [
            "Below"
          ],
          [
            "Above"
          ],
          [
            "Below"
          ],
          [
            "Within"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "nextConceptId": "concept.acid-base.euglycaemic-risk-with-mixed-gas.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a supplied corrected-gap result into interpretation of a potentially masked metabolic component and a drug-specific investigation; retain the previous corrected-gap construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B33",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Acts at the current hospital decision time, removes the prior-author-error label and supplied adjusted result, and tests a concrete assay rather than a generic past-episode review.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is in hospital with nausea and rapid breathing after surgery. The medicine list includes dapagliflozin. Intake has been limited during the admission.",
    "previousPresentation": "{patientName}, a 38-year-old woman, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.38",
        "presentation": "{patientName}, a 38-year-old woman, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result."
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.38",
        "presentation": "{patientName}, a 38-year-old man, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result."
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.63",
        "presentation": "{patientName}, a 63-year-old woman, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result."
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.63",
        "presentation": "{patientName}, a 63-year-old man, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.acid-base.b-malnutrition-gap",
        "patientPresentationVariantId": "presentation.gs028d.acid-base.b-malnutrition-gap",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Hospital acid-base review",
        "revisedPresentation": "{patientName}, a 38-year-old woman, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-malnutrition-gap.female.38",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-malnutrition-gap.female.38",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 38-year-old woman, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-malnutrition-gap.male.38",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-malnutrition-gap.male.38",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 38-year-old man, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-malnutrition-gap.female.63",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-malnutrition-gap.female.63",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 63-year-old woman, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-malnutrition-gap.male.63",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-malnutrition-gap.male.63",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 63-year-old man, brings an admission record after prolonged poor intake. The low bicarbonate had been attributed to rapid breathing during pain. The hospital laboratory subsequently issued the albumin-adjusted result.",
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
        "ageYears": 38,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Postoperative nausea",
    "previousChiefComplaint": "Hospital acid-base review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.38",
        "chiefComplaint": "Hospital acid-base review"
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.38",
        "chiefComplaint": "Hospital acid-base review"
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.female.63",
        "chiefComplaint": "Hospital acid-base review"
      },
      {
        "id": "profile.gs028d.acid-base.b-malnutrition-gap.male.63",
        "chiefComplaint": "Hospital acid-base review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b34",
    "auditId": "B2B34",
    "caseId": "case.gs028d.acid-base.b-sepsis-recovery-gap",
    "nodeId": "node.gs028d.acid-base.b-sepsis-recovery-gap.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r1",
    "questionVariantId": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which episode should receive an unmeasured-anion cause review for {patientName}?",
    "previousChoiceLabels": [
      "Investigate admission causes",
      "Investigate the current episode",
      "Investigate both episodes",
      "Investigate neither episode"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Derive both corrected gaps rather than infer improvement from the raw trend or select the more abnormal-looking column. Then: Request present cause testing rather than substitute old results or a non-gap pathway.",
    "reviewerNotes": "The exact aid/reference has the same explicit source hold as B2B32. Current lactate/ketones are requested now; no late testing is claimed to reconstruct an old specimen.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b34.d1": "choice.qbp2b.20261104.b2b34.d1",
      "choice.qbp2b.r2.20261104.b2b34.d2": "choice.qbp2b.20261104.b2b34.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b34.d1": null,
      "choice.qbp2b.r2.20261104.b2b34.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b34.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b34.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2",
      "conceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "stem": "Which laboratory follow-up should be requested for {patientName} now?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Plasma lactate and ketone assays",
          "isCorrect": true,
          "rationale": "The displayed correction changes admission/current gaps from raw 14/12 to adjusted 14/19. The current specimen needs an unmeasured-acid evaluation despite the falling raw result.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b34.d1",
          "label": "Admission lactate and ketone review",
          "isCorrect": false,
          "distractorRationale": "Those contemporaneous results may remain useful history, but they do not establish the cause of the newly elevated current adjusted gap."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b34.d2",
          "label": "Urinary electrolyte and pH panel",
          "isCorrect": false,
          "distractorRationale": "These can be useful in selected non-gap evaluation; the corrected current pattern should not be misclassified from the raw trend."
        }
      ],
      "explanation": "The displayed correction changes admission/current gaps from raw 14/12 to adjusted 14/19. The current specimen needs an unmeasured-acid evaluation despite the falling raw result. Those contemporaneous results may remain useful history, but they do not establish the cause of the newly elevated current adjusted gap. These can be useful in selected non-gap evaluation; the corrected current pattern should not be misclassified from the raw trend.",
      "teachingPoint": "The displayed correction changes admission/current gaps from raw 14/12 to adjusted 14/19. The current specimen needs an unmeasured-acid evaluation despite the falling raw result.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.corrected-gap",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.r2.b2b34.application",
        "claim.qbp2b.r2.gap-calculation-aid"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed laboratory record. Calculation aid: AG = Na − (Cl + HCO3); albumin-adjusted AG = AG + 0.25 × (40 − albumin in g/L). This laboratory uses an upper AG reference of 16 mmol/L.",
        "columnHeaders": [
          "Admission",
          "Current"
        ],
        "rowHeaders": [
          "Sodium (mmol/L)",
          "Chloride (mmol/L)",
          "Bicarbonate (mmol/L)",
          "Albumin (g/L)",
          "Arterial pH",
          "Arterial CO2 (mmHg)"
        ],
        "cells": [
          [
            "140",
            "140"
          ],
          [
            "108",
            "110"
          ],
          [
            "18",
            "18"
          ],
          [
            "40",
            "12"
          ],
          [
            "7.32",
            "7.32"
          ],
          [
            "36",
            "36"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "nextConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Patient-specific application within the existing scored objective; preserve stable concept history."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B34",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Both episodes are plausible active acid-base problems. The supplied aid requires calculation; the choices are actual current tests or record requests, not admission/current labels.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, remains in hospital after treatment for sepsis. The team receives a current panel alongside the admission panel. The patient is still breathing rapidly.",
    "previousPresentation": "{patientName}, a 45-year-old woman, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45",
        "presentation": "{patientName}, a 45-year-old woman, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45",
        "presentation": "{patientName}, a 45-year-old man, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72",
        "presentation": "{patientName}, a 72-year-old woman, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission."
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72",
        "presentation": "{patientName}, a 72-year-old man, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.acid-base.b-sepsis-recovery-gap",
        "patientPresentationVariantId": "presentation.gs028d.acid-base.b-sepsis-recovery-gap",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Hospital laboratory trend",
        "revisedPresentation": "{patientName}, a 45-year-old woman, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old woman, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 45-year-old man, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 72-year-old woman, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 72-year-old man, is recovering after a sepsis admission. The clinic receives the admission and current laboratory panels; the raw anion gap is higher now than at admission.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Changing inpatient chemistry",
    "previousChiefComplaint": "Hospital laboratory trend",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.45",
        "chiefComplaint": "Hospital laboratory trend"
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.45",
        "chiefComplaint": "Hospital laboratory trend"
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.female.72",
        "chiefComplaint": "Hospital laboratory trend"
      },
      {
        "id": "profile.gs028d.acid-base.b-sepsis-recovery-gap.male.72",
        "chiefComplaint": "Hospital laboratory trend"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b35",
    "auditId": "B2B35",
    "caseId": "case.gs028d.acid-base.a-tachypnea-low-bicarb",
    "nodeId": "node.gs028d.acid-base.a-tachypnea-low-bicarb.1",
    "previousQuestionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r1",
    "questionVariantId": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which additional test should guide {patientName}'s acid-base evaluation at that stage?",
    "previousChoiceLabels": [
      "Blood gas with pH and carbon dioxide",
      "Serum lactate and blood ketones",
      "Repeat chemistry with an albumin-adjusted anion gap"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the incompatible implications of the contemporaneous chemistry and gas. Then: Use the collection record to request a separate-site chemistry rather than repeat the wrong test or begin cause-specific treatment.",
    "reviewerNotes": "Constructed arithmetic consistency, not a universal method-difference threshold or definitive contamination diagnosis. Exact specimen-handling application needs clinician/laboratory review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qbp2b.r2.20261104.b2b35.d1": "choice.qbp2b.20261104.b2b35.d1",
      "choice.qbp2b.r2.20261104.b2b35.d2": "choice.qbp2b.20261104.b2b35.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": null,
      "choice.qbp2b.r2.20261104.b2b35.d1": null,
      "choice.qbp2b.r2.20261104.b2b35.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b35.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.b2b35.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.metabolic-acidosis.confirm-with-blood-gas.v3.r2",
      "conceptId": "concept.acid-base.discordant-chemistry-and-gas-specimen.v1",
      "stem": "Which specimen request should be made next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Peripheral electrolyte panel",
          "isCorrect": true,
          "rationale": "The simultaneous gas does not support the chemistry bicarbonate implication, and the collection record provides a reason to verify that panel from a separate site.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b35.d1",
          "label": "Arterial blood gas and co-oximetry",
          "isCorrect": false,
          "distractorRationale": "Another gas may be appropriate if a gas-specific concern emerges; it does not directly verify the discrepant infusion-lumen chemistry."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b35.d2",
          "label": "Plasma lactate and ketones",
          "isCorrect": false,
          "distractorRationale": "Cause testing may be needed if a real metabolic component is confirmed; it should not substitute for reconciling this internally discordant pair."
        }
      ],
      "explanation": "The simultaneous gas does not support the chemistry bicarbonate implication, and the collection record provides a reason to verify that panel from a separate site. Another gas may be appropriate if a gas-specific concern emerges; it does not directly verify the discrepant infusion-lumen chemistry. Cause testing may be needed if a real metabolic component is confirmed; it should not substitute for reconciling this internally discordant pair.",
      "teachingPoint": "The simultaneous gas does not support the chemistry bicarbonate implication, and the collection record provides a reason to verify that panel from a separate site.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.acidosis.blood-gas",
        "claim.n1r2.gas-record-interpretation",
        "claim.qbp2b.r2.b2b35.application",
        "claim.qbp2b.r2.discordant-gas-chemistry-specimen"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Simultaneous specimen records; values are a constructed consistency example",
        "columnHeaders": [
          "Chemistry specimen",
          "Arterial specimen"
        ],
        "rowHeaders": [
          "Collection record",
          "Sodium / chloride (mmol/L)",
          "Total CO2 or calculated bicarbonate (mmol/L)",
          "pH / CO2"
        ],
        "cells": [
          [
            "From the infusion lumen while its saline flush was running",
            "Radial puncture recorded separately"
          ],
          [
            "146 / 125",
            "140 / 104"
          ],
          [
            "Measured total CO2: 14",
            "Calculated bicarbonate: 24"
          ],
          [
            "Not measured",
            "pH 7.40; CO2 40 mmHg"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.metabolic-acidosis.confirm-with-blood-gas",
      "nextConceptId": "concept.acid-base.discordant-chemistry-and-gas-specimen.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes foundational gas-test selection into a current specimen-quality decision; retain the earlier confirmation-with-blood-gas concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B35",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Gives actual paired results instead of merely withholding a gas; the collection discrepancy determines the next specimen. No old explanatory note tells the learner which conclusion was mistaken.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed in hospital for rapid breathing during pain. Two samples are drawn at the same recorded time. The patient's circulation remains stable.",
    "previousPresentation": "{patientName}, a 28-year-old woman, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.28",
        "presentation": "{patientName}, a 28-year-old woman, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment."
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.28",
        "presentation": "{patientName}, a 28-year-old man, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment."
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.46",
        "presentation": "{patientName}, a 46-year-old woman, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment."
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.46",
        "presentation": "{patientName}, a 46-year-old man, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028d.acid-base.a-tachypnea-low-bicarb",
        "patientPresentationVariantId": "presentation.gs028d.acid-base.a-tachypnea-low-bicarb",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Rapid breathing review",
        "revisedPresentation": "{patientName}, a 28-year-old woman, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.28",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.28",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 28-year-old woman, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.28",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.28",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 28-year-old man, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.46",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.46",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.46",
            "approvedInstantiationProfileId": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.46",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, brings an urgent-care record for rapid breathing during pain. The chemistry panel shows bicarbonate below the laboratory interval. The note suggests hyperventilation; the patient also had reduced intake and loose stools. Circulation was stable during the recorded assessment.",
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
        "ageYears": 28,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Discordant chemistry",
    "previousChiefComplaint": "Rapid breathing review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.28",
        "chiefComplaint": "Rapid breathing review"
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.28",
        "chiefComplaint": "Rapid breathing review"
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.female.46",
        "chiefComplaint": "Rapid breathing review"
      },
      {
        "id": "profile.gs028d.acid-base.a-tachypnea-low-bicarb.male.46",
        "chiefComplaint": "Rapid breathing review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b36",
    "auditId": "B2B36",
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "previousQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which imaging request should be made for {patientName}'s palpable site?",
    "previousChoiceLabels": [
      "Ultrasound at the marked lower inner site",
      "Mammography at the marked lower inner site",
      "Contrast-enhanced MRI of the left breast"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish correct labelling from actual depiction of the palpable target. Then: Choose reacquisition rather than repeat paperwork or advance to another modality without completing that question.",
    "reviewerNotes": "The following ultrasound gate and persistent-lump assessment remain compatible. The imaging request does not replace tissue assessment of an unresolved suspicious examination.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.r2.20261104.b2b36.d1": "choice.qbp2b.20261104.b2b36.d1",
      "choice.qbp2b.r2.20261104.b2b36.d2": "choice.qbp2b.20261104.b2b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.ultrasound",
      "choice.qbp2b.r2.20261104.b2b36.d1": null,
      "choice.qbp2b.r2.20261104.b2b36.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2b.r2.20261104.b2b36.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b36.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "question": {
      "id": "question.palpable-breast.negative-mammogram-targeted-us.v1.r2",
      "conceptId": "concept.palpable-breast.target-acquisition-adequacy.v1",
      "stem": "Which imaging request should be made next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Repeat targeted breast ultrasound",
          "isCorrect": true,
          "rationale": "A labelled M series is not equivalent to an interpretable examination of tissue at M. Reacquisition with direct clinical correlation can resolve the obscured target.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b36.d1",
          "label": "Retrieve the existing breast ultrasound report",
          "isCorrect": false,
          "distractorRationale": "The raw M acquisition itself is obscured; another copy of the current report will not supply the missing tissue depiction."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b36.d2",
          "label": "Request contrast-enhanced breast MRI",
          "isCorrect": false,
          "distractorRationale": "MRI has selected problem-solving roles but does not replace completing the initial target acquisition identified as inadequate by its actual images."
        }
      ],
      "explanation": "A labelled M series is not equivalent to an interpretable examination of tissue at M. Reacquisition with direct clinical correlation can resolve the obscured target. The raw M acquisition itself is obscured; another copy of the current report will not supply the missing tissue depiction. MRI has selected problem-solving roles but does not replace completing the initial target acquisition identified as inadequate by its actual images.",
      "teachingPoint": "A labelled M series is not equivalent to an interpretable examination of tissue at M. Reacquisition with direct clinical correlation can resolve the obscured target.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.r2.b2b36.application",
        "claim.qbp2b.r2.obscured-breast-acquisition"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Target acquisition record",
        "columnHeaders": [
          "Header",
          "Image contents"
        ],
        "rowHeaders": [
          "Clinical diagram",
          "Cyst series",
          "M series"
        ],
        "cells": [
          [
            "M: palpable site; H: upper outer site",
            "The clinician's palpable point is M."
          ],
          [
            "H",
            "A thin-walled fluid lesion is imaged."
          ],
          [
            "M",
            "The cine starts at the marker. A broad shadow extends from the thick adhesive marker to the deep edge throughout the sweep; tissue beneath that stripe is not depicted."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.site-concordant-imaging.v1",
      "nextConceptId": "concept.palpable-breast.target-acquisition-adequacy.v1",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": {
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
      "reason": "Changes repeated quadrant matching into an adequacy decision; preserve the old targeted-imaging-order concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B36",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the narrated site-concordance verdict and location-repeating key. The actual acquisition, not age or the noun lump, distinguishes it from the retrieval sibling.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a persistent firm lump marked M in the lower inner left breast. Mammography at the skin marker shows no mass, distortion or calcification. The attached ultrasound PDF describes a simple cyst at a different labelled target.",
    "previousPresentation": "{patientName}, a 44-year-old woman, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
        "presentation": "{patientName}, a 44-year-old woman, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location."
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
        "presentation": "{patientName}, a 58-year-old woman, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028c.palpable-breast.paired-dense-focal",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-dense-focal",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Persistent breast lump",
        "revisedPresentation": "{patientName}, a 44-year-old woman, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.palpable-breast.paired-dense-focal.female.44",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 44-year-old woman, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028c.palpable-breast.paired-dense-focal.female.58",
            "approvedInstantiationProfileId": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 58-year-old woman, has a persistent lump in the lower inner left breast. Diagnostic mammography at the skin marker shows no mass, distortion or calcification. An attached ultrasound report describes a benign simple cyst in the upper outer quadrant; the image labels agree with that different location.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Persistent breast lump",
    "previousChiefComplaint": "Persistent breast lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44",
        "chiefComplaint": "Persistent breast lump"
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58",
        "chiefComplaint": "Persistent breast lump"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b37",
    "auditId": "B2B37",
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.2",
    "previousQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r1",
    "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which diagnostic plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Palpation-directed core sampling through the breast team",
      "Contrast-enhanced MRI through the breast team",
      "Short-interval clinical and ultrasound review through the breast team"
    ],
    "previousCurrentUpdate": "The radiologist performs targeted ultrasound at the lower inner skin marker. Tissue planes are seen without a focal cystic or solid correlate. The clinician again feels a discrete firm lump at that same marker, with an irregular edge and limited mobility relative to the surrounding tissue.",
    "previousExhibit": null,
    "currentUpdate": "The repeat scan depicts tissue at M without a focal cystic or solid correlate. A later needle sample is reported as containing mature fat and scattered macrophages, with no malignant cells. Its image label is H. The clinician still feels the same irregular firm area at M with limited mobility. The H images show a small post-needle cavity beneath the puncture scar, separate from M.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Use the procedure labels and examination to determine what the prior benign needle result actually represents. Then: Select the clinical target and a method yielding histologic tissue instead of repeating the same limited sample.",
    "reviewerNotes": "Not a claim that FNA is universally inappropriate or that palpation core always succeeds. Specialist assessment may select another definitive sampling strategy if the target cannot be reliably sampled.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qbp2b.r2.20261104.b2b37.d1": "choice.qbp2b.20261104.b2b37.d1",
      "choice.qbp2b.r2.20261104.b2b37.d2": "choice.qbp2b.20261104.b2b37.d2",
      "choice.qbp2b.r2.20261104.b2b37.d3": "choice.qbp2b.20261104.b2b37.d1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qbp2b.r2.20261104.b2b37.d1": null,
      "choice.qbp2b.r2.20261104.b2b37.d2": null,
      "choice.qbp2b.r2.20261104.b2b37.d3": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b37.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b37.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qbp2b.r2.20261104.b2b37.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r2",
      "conceptId": "concept.palpable-breast.representative-target-and-tissue-method.v1",
      "stem": "Which tissue request should be made for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Palpable target: core biopsy",
          "isCorrect": true,
          "rationale": "The benign-appearing cytology belongs to another target and does not resolve the clinically suspicious area. Representative core tissue at the palpable target can supply architecture rather than repeat the same cytology.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b37.d1",
          "label": "Palpable target: needle cytology",
          "isCorrect": false,
          "distractorRationale": "This selects the appropriate target but repeats a limited cytological method rather than obtain representative histologic tissue for the unresolved mass."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b37.d2",
          "label": "Sonographic target: core biopsy",
          "isCorrect": false,
          "distractorRationale": "Changing to core tissue does not solve sampling the separate post-needle cavity rather than the palpable concern."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b37.d3",
          "label": "Sonographic target: needle cytology",
          "isCorrect": false,
          "distractorRationale": "This repeats both the wrong target and the limited tissue question."
        }
      ],
      "explanation": "The benign-appearing cytology belongs to another target and does not resolve the clinically suspicious area. Representative core tissue at the palpable target can supply architecture rather than repeat the same cytology. This selects the appropriate target but repeats a limited cytological method rather than obtain representative histologic tissue for the unresolved mass. Changing to core tissue does not solve sampling the separate post-needle cavity rather than the palpable concern. This repeats both the wrong target and the limited tissue question.",
      "teachingPoint": "The benign-appearing cytology belongs to another target and does not resolve the clinically suspicious area. Representative core tissue at the palpable target can supply architecture rather than repeat the same cytology.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.biopsy",
        "claim.qbp2b.r2.b2b37.application",
        "claim.qbp2b.r2.palpable-core-target-after-cytology"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "nextConceptId": "concept.palpable-breast.representative-target-and-tissue-method.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes first biopsy despite negative imaging into a target/method decision after a nonrepresentative needle sample; retain the old clinical-imaging discordance card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B37",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Moves beyond the simple biopsy-despite-negative-imaging rule. A balanced target/method matrix contains two plausible independent sampling errors; all options are tissue requests.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b38",
    "auditId": "B2B38",
    "caseId": "case.bread-butter.perianal-abscess.tender-perianal-lump",
    "nodeId": "node.bread-butter.perianal-abscess.tender-perianal-lump.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v1.r1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v1.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Open drainage with local wound care",
      "Open drainage with systemic antibiotics",
      "Needle aspiration with systemic antibiotics",
      "Needle aspiration with local wound care"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Trace the high extension to a lateral ischioanal rather than intersphincteric origin. Then: Choose the matching drainage plane and separately assess the antibiotic indication.",
    "reviewerNotes": "No universal no-antibiotic rule. Complex disease and the exact guideline scope require colorectal source/clinical review after adequate drainage.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_1": "drain_1",
      "choice.qbp2b.r2.20261104.b2b38.d1": "choice.qbp2b.20261104.b2b38.d1",
      "choice.qbp2b.r2.20261104.b2b38.d2": "choice.qbp2b.20261104.b2b38.d2",
      "choice.qbp2b.r2.20261104.b2b38.d3": "choice.qbp2b.20261104.b2b38.d3"
    },
    "choiceServiceOverrides": {
      "drain_1": null,
      "choice.qbp2b.r2.20261104.b2b38.d1": null,
      "choice.qbp2b.r2.20261104.b2b38.d2": null,
      "choice.qbp2b.r2.20261104.b2b38.d3": null
    },
    "choiceTimingOverrides": {
      "drain_1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b38.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b38.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b38.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v1.r2",
      "conceptId": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
      "stem": "Which drainage and adjunctive plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_1",
          "label": "Transperineal drainage with local wound care",
          "isCorrect": true,
          "rationale": "The high component comes from the ischioanal route, supporting external drainage. The supplied host/extent findings do not establish a separate systemic-antibiotic indication after source control.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b38.d1",
          "label": "Transanal drainage with local wound care",
          "isCorrect": false,
          "distractorRationale": "The adjunct scope fits the supplied normal-host record, but an internal route would traverse an inappropriate plane for this origin."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b38.d2",
          "label": "Transperineal drainage with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "The access is appropriate; antibiotics are not automatically indicated by every abscess after adequate drainage in the displayed host."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b38.d3",
          "label": "Transanal drainage with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "This combines an inappropriate route inference with an antibiotic scope not established by the supplied record."
        }
      ],
      "explanation": "The high component comes from the ischioanal route, supporting external drainage. The supplied host/extent findings do not establish a separate systemic-antibiotic indication after source control. The adjunct scope fits the supplied normal-host record, but an internal route would traverse an inappropriate plane for this origin. The access is appropriate; antibiotics are not automatically indicated by every abscess after adequate drainage in the displayed host. This combines an inappropriate route inference with an antibiotic scope not established by the supplied record.",
      "teachingPoint": "The high component comes from the ischioanal route, supporting external drainage. The supplied host/extent findings do not establish a separate systemic-antibiotic indication after source control.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.r2.b2b38.application",
        "claim.qbp2b.r2.supralevator-origin-drainage"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Pelvic MRI observations",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Lower cavity",
          "Upper extension"
        ],
        "cells": [
          [
            "A fluid cavity occupies the fat lateral to the external sphincter."
          ],
          [
            "It rises through that lateral space above the levator; the plane between the sphincters is not its communicating route."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "nextConceptId": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes superficial opening-versus-aspiration recall into an anatomical drainage-route decision; retain the old uncomplicated-abscess construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B38",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes redundant superficial imaging and aspiration foils. The sibling tests a different real anatomical route, with the same balanced option structure.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has persistent deep anal pain after a small skin opening released pus. The patient was previously well and takes no regular medicines. Temperature is within the reporting interval, and skin redness remains at the small opening.",
    "previousPresentation": "{patientName}, a 31-year-old woman, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.31",
        "presentation": "{patientName}, a 31-year-old woman, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.31",
        "presentation": "{patientName}, a 31-year-old man, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.52",
        "presentation": "{patientName}, a 52-year-old woman, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.52",
        "presentation": "{patientName}, a 52-year-old man, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.bread-butter.perianal-abscess.tender-perianal-lump",
        "patientPresentationVariantId": "presentation.bread-butter.perianal-abscess.tender-perianal-lump",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Painful perianal swelling",
        "revisedPresentation": "{patientName}, a 31-year-old woman, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.tender-perianal-lump.female.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old woman, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.tender-perianal-lump.male.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old man, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.tender-perianal-lump.female.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.tender-perianal-lump.male.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man, has a painful swelling beside the anus that released a little pus overnight. Pain briefly eased, but a fluctuant bulge remains and ultrasound shows a subcutaneous pocket beneath the small skin opening. The surrounding redness stays at the edge of the bulge; the patient is eating, afebrile and taking no immune-suppressing treatment.",
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
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Deep anal pain",
    "previousChiefComplaint": "Painful perianal swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.female.52",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.tender-perianal-lump.male.52",
        "chiefComplaint": "Painful perianal swelling"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b39",
    "auditId": "B2B39",
    "caseId": "case.bread-butter.perianal-abscess.perianal-swelling",
    "nodeId": "node.bread-butter.perianal-abscess.perianal-swelling.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v2.r1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Open drainage with systemic antibiotics",
      "Open drainage with local wound care",
      "Needle aspiration with systemic antibiotics",
      "Needle aspiration with local wound care"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the high sphincter-crossing course before choosing a tract procedure. Then: Use the actual transplant medicines rather than neutrophil count or fever alone when deciding adjunctive antibiotics.",
    "reviewerNotes": "Not a recommendation for every chemotherapy-associated infection or every transplant patient. No neutrophil/platelet cutoff, drug dose or universal seton rule.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_2": "drain_2",
      "choice.qbp2b.r2.20261104.b2b39.d1": "choice.qbp2b.20261104.b2b39.d1",
      "choice.qbp2b.r2.20261104.b2b39.d2": "choice.qbp2b.20261104.b2b39.d2",
      "choice.qbp2b.r2.20261104.b2b39.d3": "choice.qbp2b.20261104.b2b39.d3"
    },
    "choiceServiceOverrides": {
      "drain_2": null,
      "choice.qbp2b.r2.20261104.b2b39.d1": null,
      "choice.qbp2b.r2.20261104.b2b39.d2": null,
      "choice.qbp2b.r2.20261104.b2b39.d3": null
    },
    "choiceTimingOverrides": {
      "drain_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b39.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b39.d2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b39.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v2.r2",
      "conceptId": "concept.anorectal-fistula.tract-and-transplant-host-plan.v1",
      "stem": "Which tract and adjunctive plan should be used for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_2",
          "label": "Loose draining seton with systemic antibiotics",
          "isCorrect": true,
          "rationale": "The high sphincter-crossing tract favors drainage/staged planning rather than routine division; the transplant immunosuppressive regimen remains relevant despite normal neutrophils and no fever.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b39.d1",
          "label": "Lay-open fistulotomy with systemic antibiotics",
          "isCorrect": false,
          "distractorRationale": "The host component is addressed, but laying open this upper sphincter-crossing tract creates an avoidable continence risk."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b39.d2",
          "label": "Loose draining seton with local wound care",
          "isCorrect": false,
          "distractorRationale": "The tract strategy fits, but normal neutrophils do not remove the supplied immunosuppressive exposure from the antibiotic decision."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b39.d3",
          "label": "Lay-open fistulotomy with local wound care",
          "isCorrect": false,
          "distractorRationale": "This misses both the tract-related function boundary and the host indication."
        }
      ],
      "explanation": "The high sphincter-crossing tract favors drainage/staged planning rather than routine division; the transplant immunosuppressive regimen remains relevant despite normal neutrophils and no fever. The host component is addressed, but laying open this upper sphincter-crossing tract creates an avoidable continence risk. The tract strategy fits, but normal neutrophils do not remove the supplied immunosuppressive exposure from the antibiotic decision. This misses both the tract-related function boundary and the host indication.",
      "teachingPoint": "The high sphincter-crossing tract favors drainage/staged planning rather than routine division; the transplant immunosuppressive regimen remains relevant despite normal neutrophils and no fever.",
      "supportingEvidenceClaimIds": [
        "claim.fistula.loose-seton-for-high-transsphincteric-tract",
        "claim.bread-butter.perianal-abscess.selective-antibiotics",
        "claim.qbp2b.r2.b2b39.application",
        "claim.qbp2b.r2.transplant-regimen-host-assessment"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "MRI and operative tract record",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Course",
          "Remaining cavity"
        ],
        "cells": [
          [
            "The tract crosses the upper part of the external sphincter before reaching the skin opening."
          ],
          [
            "The opened cavity drains freely; inspection identifies no separate undrained pocket."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "nextConceptId": "concept.anorectal-fistula.tract-and-transplant-host-plan.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Replaces the under-specified chemotherapy/neutropenia source-control question with a post-drainage tract/host decision; retain the old source-control concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B39",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the unsupported neutropenia severity/timing premise. Source control is already performed, so no omitted medical-first-versus-drainage decision is hidden. Both remaining decisions have explicit anatomical/host data.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, with a kidney transplant takes tacrolimus, mycophenolate and prednisone. A recurrent perianal cavity has been opened and irrigated under anaesthesia; the cavity has collapsed. The patient is afebrile. Platelet count, neutrophil count and coagulation results are within their laboratory intervals.",
    "previousPresentation": "{patientName}, a 31-year-old woman, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.31",
        "presentation": "{patientName}, a 31-year-old woman, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.31",
        "presentation": "{patientName}, a 31-year-old man, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.52",
        "presentation": "{patientName}, a 52-year-old woman, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.52",
        "presentation": "{patientName}, a 52-year-old man, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.bread-butter.perianal-abscess.perianal-swelling",
        "patientPresentationVariantId": "presentation.bread-butter.perianal-abscess.perianal-swelling",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Painful perianal swelling",
        "revisedPresentation": "{patientName}, a 31-year-old woman, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.perianal-swelling.female.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.perianal-swelling.female.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old woman, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.perianal-swelling.male.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.perianal-swelling.male.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old man, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.perianal-swelling.female.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.perianal-swelling.female.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.perianal-swelling.male.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.perianal-swelling.male.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man, attends during cytotoxic chemotherapy with new perianal pain. The blood count shows neutrophils below the laboratory interval. A superficial fluctuant bulge beside the anus contains a residual pocket on ultrasound; its surrounding redness is limited and the patient has no fever.",
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
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Recurrent perianal infection",
    "previousChiefComplaint": "Painful perianal swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.female.52",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.perianal-swelling.male.52",
        "chiefComplaint": "Painful perianal swelling"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b40",
    "auditId": "B2B40",
    "caseId": "case.bread-butter.perianal-abscess.painful-sitting",
    "nodeId": "node.bread-butter.perianal-abscess.painful-sitting.1",
    "previousQuestionVariantId": "question.perianal-abscess.prompt-drainage.v3.r1",
    "questionVariantId": "question.perianal-abscess.prompt-drainage.v3.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which treatment plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Open drainage with local wound care",
      "Open drainage with systemic antibiotics",
      "Needle aspiration with systemic antibiotics",
      "Needle aspiration with local wound care"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize why the current tract would look suitable for routine lay-open treatment in another patient. Then: Apply the independent baseline function/operation record before dividing more sphincter.",
    "reviewerNotes": "No claim that every low tract needs a seton or that a cutting seton is universally prohibited; precise function/operative strategy requires review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_3": "drain_3",
      "choice.qbp2b.r2.20261104.b2b40.d1": "choice.qbp2b.20261104.b2b40.d1",
      "choice.qbp2b.r2.20261104.b2b40.d2": "choice.qbp2b.20261104.b2b40.d2"
    },
    "choiceServiceOverrides": {
      "drain_3": null,
      "choice.qbp2b.r2.20261104.b2b40.d1": null,
      "choice.qbp2b.r2.20261104.b2b40.d2": null
    },
    "choiceTimingOverrides": {
      "drain_3": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b40.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b40.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.perianal-abscess.prompt-drainage.v3.r2",
      "conceptId": "concept.anorectal-fistula.function-before-low-tract-division.v1",
      "stem": "Which tract procedure should be used for {patientName} at this stage?",
      "answerChoices": [
        {
          "id": "drain_3",
          "label": "Loose draining seton",
          "isCorrect": true,
          "rationale": "The low course does not erase the existing functional deficit and prior sphincter division; drainage with later sphincter-preserving planning avoids automatically adding division now.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b40.d1",
          "label": "Primary fistulotomy",
          "isCorrect": false,
          "distractorRationale": "A low tract can be suitable for selected patients with preserved function, but the actual baseline function changes that boundary."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b40.d2",
          "label": "Cutting seton placement",
          "isCorrect": false,
          "distractorRationale": "Gradual division is still division; the label does not resolve the existing functional risk."
        }
      ],
      "explanation": "The low course does not erase the existing functional deficit and prior sphincter division; drainage with later sphincter-preserving planning avoids automatically adding division now. A low tract can be suitable for selected patients with preserved function, but the actual baseline function changes that boundary. Gradual division is still division; the label does not resolve the existing functional risk.",
      "teachingPoint": "The low course does not erase the existing functional deficit and prior sphincter division; drainage with later sphincter-preserving planning avoids automatically adding division now.",
      "supportingEvidenceClaimIds": [
        "claim.fistula.loose-seton-for-high-transsphincteric-tract",
        "claim.bread-butter.perianal-abscess.prompt-drainage",
        "claim.qbp2b.r2.b2b40.application",
        "claim.qbp2b.r2.baseline-function-before-fistulotomy"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Tract and baseline function records",
        "columnHeaders": [
          "Observation"
        ],
        "rowHeaders": [
          "Current tract",
          "Prior operation"
        ],
        "cells": [
          [
            "The tract enters near the anal verge and crosses only the lowest external sphincter fibres."
          ],
          [
            "The previous operation divided internal sphincter fibres in another quadrant."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
      "nextConceptId": "concept.anorectal-fistula.function-before-low-tract-division.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a duplicate healthy-host abscess plan into a different function-sensitive fistula decision; retain the old uncomplicated-drainage card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B40",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Deletes the misplaced anal-canal haemorrhoid exclusion and repeated normal-host checklist. All choices are named fistula procedures, and a real competing consideration changes the usual low-tract answer.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, has a newly drained perianal abscess and a single tract. Before this episode, the patient had intermittent flatus leakage and staining after a previous anal sphincterotomy. Digital examination shows reduced resting tone.",
    "previousPresentation": "{patientName}, a 31-year-old woman, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
    "previousProfilePresentations": [
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.31",
        "presentation": "{patientName}, a 31-year-old woman, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.31",
        "presentation": "{patientName}, a 31-year-old man, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.52",
        "presentation": "{patientName}, a 52-year-old woman, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment."
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.52",
        "presentation": "{patientName}, a 52-year-old man, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.bread-butter.perianal-abscess.painful-sitting",
        "patientPresentationVariantId": "presentation.bread-butter.perianal-abscess.painful-sitting",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Painful perianal swelling",
        "revisedPresentation": "{patientName}, a 31-year-old woman, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.painful-sitting.female.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.painful-sitting.female.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old woman, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.painful-sitting.male.31",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.painful-sitting.male.31",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 31-year-old man, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.painful-sitting.female.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.painful-sitting.female.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old woman, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.bread-butter.perianal-abscess.painful-sitting.male.52",
            "approvedInstantiationProfileId": "profile.bread-butter.perianal-abscess.painful-sitting.male.52",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 52-year-old man, is a previously well adult whose painful perianal lump was called a haemorrhoid at an earlier visit. Examination now shows a fluctuant skin bulge with a subcutaneous cavity and mobile internal echoes; the anal canal examination does not identify a solid thrombosed nodule. Redness is confined to the immediate rim, temperature is normal, and there is no immune-suppressing illness or treatment.",
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
        "ageYears": 31,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Perianal fistula review",
    "previousChiefComplaint": "Painful perianal swelling",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.31",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.female.52",
        "chiefComplaint": "Painful perianal swelling"
      },
      {
        "id": "profile.bread-butter.perianal-abscess.painful-sitting.male.52",
        "chiefComplaint": "Painful perianal swelling"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b41",
    "auditId": "B2B41",
    "caseId": "case.gs028b.preoperative-nutrition.a-albumin-only",
    "nodeId": "node.gs028b.preoperative-nutrition.a-albumin-only.1",
    "previousQuestionVariantId": "question.preoperative-nutrition.nutritional-risk-screening.v2.r1",
    "questionVariantId": "question.preoperative-nutrition.nutritional-risk-screening.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which nutrition plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Dietitian assessment with oral nutrition support",
      "Albumin follow-up with continuation of the usual diet",
      "Parenteral nutrition with metabolic monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Reconcile the independently recorded meal/supplement contributions with the current individual requirements. Then: Interpret albumin in its inflammatory context before deciding that another route is needed.",
    "reviewerNotes": "Individual numbers are constructed and clinician-review dependent, not population norms. No intake percentage/duration gate or guarantee of absorption is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b41.d1": "choice.qbp2b.20261104.b2b41.d1",
      "choice.qbp2b.r2.20261104.b2b41.d2": "choice.qbp2b.20261104.b2b41.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b41.d1": null,
      "choice.qbp2b.r2.20261104.b2b41.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b41.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b41.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.preoperative-nutrition.nutritional-risk-screening.v2.r2",
      "conceptId": "concept.nutrition.delivered-intake-before-route-escalation.v1",
      "stem": "Which nutrition order should be used for {patientName} now?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Fortified oral nutrition",
          "isCorrect": true,
          "rationale": "The actual recorded intake totals the current individual targets. Falling albumin during rising inflammation is not, by itself, a reason to add another route. Continue the delivered support with clinical reassessment.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b41.d1",
          "label": "Nasogastric tube nutrition",
          "isCorrect": false,
          "distractorRationale": "Tube support is appropriate when oral delivery is inadequate; the current audit does not establish that problem merely because albumin is lower."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b41.d2",
          "label": "Central parenteral nutrition",
          "isCorrect": false,
          "distractorRationale": "An albumin result does not establish failure or contraindication of the oral/enteral routes. This adds an invasive route without the corresponding delivery evidence."
        }
      ],
      "explanation": "The actual recorded intake totals the current individual targets. Falling albumin during rising inflammation is not, by itself, a reason to add another route. Continue the delivered support with clinical reassessment. Tube support is appropriate when oral delivery is inadequate; the current audit does not establish that problem merely because albumin is lower. An albumin result does not establish failure or contraindication of the oral/enteral routes. This adds an invasive route without the corresponding delivery evidence.",
      "teachingPoint": "The actual recorded intake totals the current individual targets. Falling albumin during rising inflammation is not, by itself, a reason to add another route. Continue the delivered support with clinical reassessment.",
      "supportingEvidenceClaimIds": [
        "claim.nutrition.screen",
        "claim.nutrition.oral-enteral",
        "claim.nutrition.pn-boundary",
        "claim.qbp2b.r2.b2b41.application",
        "claim.qbp2b.r2.nutrition-intake-audit"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed current intake audit; these are the recorded individual prescription and delivered amounts, not universal requirements",
        "columnHeaders": [
          "Energy (kcal/day)",
          "Protein (g/day)"
        ],
        "rowHeaders": [
          "Current dietitian target",
          "Consumed meals",
          "Consumed oral supplements"
        ],
        "cells": [
          [
            "1800",
            "75"
          ],
          [
            "1200",
            "50"
          ],
          [
            "600",
            "25"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.preoperative-nutrition.risk-before-route-selection.v1",
      "nextConceptId": "concept.nutrition.delivered-intake-before-route-escalation.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes obvious decline-to-support matching into a delivery/laboratory conflict; retain the prior nutritional-risk assessment card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B41",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removes the overt decline story, failing-baseline foil and route-permission sentence. All options are active named nutrition orders; actual delivery now changes the result.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is preparing for major surgery during inflammatory illness. Albumin has fallen as C-reactive protein has risen. The dietitian has entered current individual intake targets, and the team has weighed actual meal and supplement consumption.",
    "previousPresentation": "{patientName}, a 43-year-old woman, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.43",
        "presentation": "{patientName}, a 43-year-old woman, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.43",
        "presentation": "{patientName}, a 43-year-old man, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.68",
        "presentation": "{patientName}, a 68-year-old man, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028b.preoperative-nutrition.a-albumin-only",
        "patientPresentationVariantId": "presentation.gs028b.preoperative-nutrition.a-albumin-only",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Preoperative nutrition review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.a-albumin-only.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.a-albumin-only.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.a-albumin-only.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.a-albumin-only.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, is preparing for major surgery during active inflammatory disease. Albumin is below range and C-reactive protein is raised. The patient’s weight remains above the usual reference range, but clothes have become looser, meals are often unfinished and rising from a chair is harder than before. Meals and drinks pass without vomiting or abdominal distension.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative nutrition review",
    "previousChiefComplaint": "Preoperative nutrition review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.43",
        "chiefComplaint": "Preoperative nutrition review"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.43",
        "chiefComplaint": "Preoperative nutrition review"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.female.68",
        "chiefComplaint": "Preoperative nutrition review"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.a-albumin-only.male.68",
        "chiefComplaint": "Preoperative nutrition review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.b2b42",
    "auditId": "B2B42",
    "caseId": "case.gs028b.preoperative-nutrition.b-oral-inadequate",
    "nodeId": "node.gs028b.preoperative-nutrition.b-oral-inadequate.1",
    "previousQuestionVariantId": "question.preoperative-nutrition.oral-enteral-first-line.v2.r1",
    "questionVariantId": "question.preoperative-nutrition.oral-enteral-first-line.v2.r2",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2b.v1"
    ],
    "previousStem": "Which nutrition route should be discussed next for {patientName}?",
    "previousChoiceLabels": [
      "Enteral tube feeding",
      "Parenteral venous feeding",
      "A further oral-supplement plan"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Localize the observed delivery failure rather than equate vomiting with failure of every bowel route. Then: Choose an access trial addressing that compartment instead of changing only the skin entry or abandoning enteral support.",
    "reviewerNotes": "No feeding threshold, tube-placement guarantee, aspiration-safety conclusion, duration or formula/dose. Source-specific access recommendation remains clinical alignment.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qbp2b.r2.20261104.b2b42.d1": "choice.qbp2b.20261104.b2b42.d1",
      "choice.qbp2b.r2.20261104.b2b42.d2": "choice.qbp2b.20261104.b2b42.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qbp2b.r2.20261104.b2b42.d1": null,
      "choice.qbp2b.r2.20261104.b2b42.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b42.d1": {
        "kind": "no_test"
      },
      "choice.qbp2b.r2.20261104.b2b42.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.preoperative-nutrition.oral-enteral-first-line.v2.r2",
      "conceptId": "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
      "stem": "Which nutrition access should be discussed next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Nasojejunal feeding",
          "isCorrect": true,
          "rationale": "The observed delivery problem is gastric; a postpyloric trial can address that compartment before treating the entire enteral route as unusable.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b42.d1",
          "label": "Central parenteral feeding",
          "isCorrect": false,
          "distractorRationale": "Parenteral support is appropriate at an oral/enteral failure or contraindication boundary, but the current record has not established failure of postpyloric delivery."
        },
        {
          "id": "choice.qbp2b.r2.20261104.b2b42.d2",
          "label": "Gastrostomy feeding",
          "isCorrect": false,
          "distractorRationale": "A different entry into the stomach does not solve the actual gastric delivery/intolerance pattern."
        }
      ],
      "explanation": "The observed delivery problem is gastric; a postpyloric trial can address that compartment before treating the entire enteral route as unusable. Parenteral support is appropriate at an oral/enteral failure or contraindication boundary, but the current record has not established failure of postpyloric delivery. A different entry into the stomach does not solve the actual gastric delivery/intolerance pattern.",
      "teachingPoint": "The observed delivery problem is gastric; a postpyloric trial can address that compartment before treating the entire enteral route as unusable.",
      "supportingEvidenceClaimIds": [
        "claim.nutrition.oral-enteral",
        "claim.nutrition.pn-boundary",
        "claim.qbp2b.r2.b2b42.application",
        "claim.qbp2b.r2.postpyloric-before-route-abandonment"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.preoperative-nutrition.oral-enteral-first-line",
      "nextConceptId": "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes a failed-oral/patent-gut hierarchy into a specific access decision after gastric feeding intolerance; retain the former oral/enteral escalation card."
    },
    "ownerProgramReview": {
      "ownerItemId": "B2B42",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Gives the real indication for gastrointestinal imaging and actual feeding observations. Removes the repeated oral-plan foil and generic functional-gut permission wording; all options name specific accesses.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is in hospital after repeated vomiting during oral and nasogastric nutrition. After feeds are paused, a substantial amount of unchanged formula remains in the gastric aspirate. Investigation was requested for the vomiting: endoscopy passes through an open pylorus, and the accompanying bowel study shows passage through nondilated small-bowel loops to the colon.",
    "previousPresentation": "{patientName}, a 43-year-old woman, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.43",
        "presentation": "{patientName}, a 43-year-old woman, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.43",
        "presentation": "{patientName}, a 43-year-old man, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.68",
        "presentation": "{patientName}, a 68-year-old woman, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness."
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.68",
        "presentation": "{patientName}, a 68-year-old man, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2b.20261104.case.gs028b.preoperative-nutrition.b-oral-inadequate",
        "patientPresentationVariantId": "presentation.gs028b.preoperative-nutrition.b-oral-inadequate",
        "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
        "revisedChiefComplaint": "Preoperative feeding review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.43",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qbp2b.20261104.profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.68",
            "contentVersion": "presentation-revision.question-bank-batch2b.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, returns after a dietitian-supervised food-fortification and oral-supplement plan. Meal records repeatedly show only a few mouthfuls and sips before fatigue stops intake, and weight continues to fall. A contrast study shows passage through stomach and small bowel without hold-up, and stools continue. Albumin remains below range during the inflammatory illness.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Feeding intolerance",
    "previousChiefComplaint": "Preoperative feeding review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.43",
        "chiefComplaint": "Preoperative feeding review"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.43",
        "chiefComplaint": "Preoperative feeding review"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.female.68",
        "chiefComplaint": "Preoperative feeding review"
      },
      {
        "id": "profile.gs028b.preoperative-nutrition.b-oral-inadequate.male.68",
        "chiefComplaint": "Preoperative feeding review"
      }
    ]
  },
  {
    "id": "revision.qbp2b.r2.20261104.f13",
    "auditId": "F13",
    "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
    "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
    "previousQuestionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r4",
    "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which request should accompany {patientName}'s anaesthetic referral now?",
    "previousChoiceLabels": [
      "Send the apnoea-probability result for planning",
      "Repeat daytime-sleepiness assessment before planning precautions",
      "Obtain diagnostic polysomnography before planning precautions"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the awake physiological signal from the targets of sleepiness and nocturnal tests. Then: Select a current pH/CO2 assessment instead of using those reports as interchangeable reassurance.",
    "reviewerNotes": "Exact SASM/awake-gas prioritization is source-held pending targeted permitted verification. No obesity, CO2, saturation, sleep-score threshold, drug dose, monitoring or automatic surgery-delay rule is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qbp2b.r2.20261104.f13.d1": "choice.qf3.20261104.f13.d1",
      "choice.qbp2b.r2.20261104.f13.d2": "choice.qf3.20261104.f13.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qbp2b.r2.20261104.f13.d1": null,
      "choice.qbp2b.r2.20261104.f13.d2": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2b.r2.20261104.f13.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.overnight_protocol"
      },
      "choice.qbp2b.r2.20261104.f13.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.overnight_protocol"
      }
    },
    "question": {
      "id": "question.preoperative-osa.validated-risk-screening.v4.r5",
      "conceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
      "stem": "Which investigation should be requested next for {patientName}'s preoperative assessment?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Arterial blood-gas analysis",
          "isCorrect": true,
          "rationale": "The awake oxygenation and chemistry observations raise a current ventilation/gas-exchange question not answered by daytime sleepiness or a sleep-probability report. A gas measures pH and CO2 before attributing the problem to sleep events.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2b.r2.20261104.f13.d1",
          "label": "Attended overnight polysomnography",
          "isCorrect": false,
          "distractorRationale": "This can address the sleep diagnosis but does not substitute for resolving the already observed awake gas-exchange/chemistry issue."
        },
        {
          "id": "choice.qbp2b.r2.20261104.f13.d2",
          "label": "Overnight pulse-oximetry recording",
          "isCorrect": false,
          "distractorRationale": "A nocturnal oxygen trace does not measure the daytime CO2 question raised by the current record."
        }
      ],
      "explanation": "The awake oxygenation and chemistry observations raise a current ventilation/gas-exchange question not answered by daytime sleepiness or a sleep-probability report. A gas measures pH and CO2 before attributing the problem to sleep events. This can address the sleep diagnosis but does not substitute for resolving the already observed awake gas-exchange/chemistry issue. A nocturnal oxygen trace does not measure the daytime CO2 question raised by the current record.",
      "teachingPoint": "The awake oxygenation and chemistry observations raise a current ventilation/gas-exchange question not answered by daytime sleepiness or a sleep-probability report. A gas measures pH and CO2 before attributing the problem to sleep events.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation",
        "claim.gs028d.acidosis.blood-gas",
        "claim.qbp2b.r2.f13.application",
        "claim.qbp2b.r2.osa-awake-gas-exchange"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.osa.discordant-screen-documentation.v2",
      "nextConceptId": "concept.preoperative-osa.awake-ventilation-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Adds the previously omitted F13 as a new supported-review candidate rather than reuse a failed risk-label quiz; preserve the manager-kept live screening concept."
    },
    "ownerProgramReview": {
      "ownerItemId": "F13",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Includes F13 explicitly. Replaces all alone/generic risk-message options with three named investigations and a current physiological conflict. The earlier source/difficulty deferral remains visible, not silently treated as an accepted rewrite.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends preoperative review. A partner reports loud snoring and pauses in breathing during sleep; the patient reports little daytime dozing. Repeated room-air oximetry while awake is below the laboratory reference band, and serum total CO2 remains above its reporting interval. The medicine list contains metformin and amlodipine.",
    "previousPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
        "presentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
        "presentation": "{patientName}, a 46-year-old man, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed."
      },
      {
        "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
        "presentation": "{patientName}, a 68-year-old man, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qf3.20261104.case.gs028d.anesthesia.a-validated-not-impression",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression",
        "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
        "revisedChiefComplaint": "Preoperative sleep assessment",
        "revisedPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qf3.20261104.profile.gs028d.anesthesia.a-validated-not-impression.female.46",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.female.46",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028d.anesthesia.a-validated-not-impression.male.46",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.male.46",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028d.anesthesia.a-validated-not-impression.female.68",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.female.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qf3.20261104.profile.gs028d.anesthesia.a-validated-not-impression.male.68",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.a-validated-not-impression.male.68",
            "contentVersion": "presentation-revision.question-flags-round3.2026-11-04.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man, is being assessed before major surgery. The partner describes loud snoring and breathing pauses. The patient reports little daytime sleepiness. The clinic's sleepiness report is within its reference range; a separately completed validated apnoea-risk assessment reports increased probability. Both reports are in the chart, and a diagnostic sleep study has not yet been performed.",
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
      "idPrefix": "ppr.qbp2b.r2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2b-round2.2026-11-04.v1"
    },
    "chiefComplaint": "Preoperative breathing review",
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
    ]
  }
];

export const QUESTION_BANK_BATCH2B_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.transplant.class-ii-crossmatch-target-and-window.v1",
    "displayName": "Select the crossmatch cell target and causal specimen window",
    "learningObjective": "Interpret a class-II antibody signal despite a negative T-cell record and choose both the relevant donor-cell population and a pre-event recipient specimen.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.hyperacute-rejection.event-and-compatibility-review.v1",
    "versioningReason": "Changes generic antibody-injury review into selection of a specific cell assay and specimen window; retain the earlier mechanism/review card.",
    "revisedItemIds": [
      "B2B02"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.qf3.preimplantation-specimen-inference",
      "claim.qbp2b.r2.b2b02.application",
      "claim.qbp2b.r2.b-cell-class-ii-crossmatch"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.cirrhosis.urgent-surgery-haemostasis-assessment.v1",
    "displayName": "Interpret cirrhotic INR before an urgent operation",
    "learningObjective": "Integrate the cause of INR prolongation, observed clot function and bleeding assessment before requesting factor replacement during urgent surgical preparation.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cirrhosis.new-fluid-elective-plan.v2",
    "versioningReason": "The score changes from recognizing the need for emergency hernia exploration to a specific perioperative haemostasis decision; preserve the urgent-disposition construct.",
    "revisedItemIds": [
      "B2B03"
    ],
    "evidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation",
      "claim.qf3.cirrhosis-urgent-hernia-boundary",
      "claim.qbp2b.b2b03.application",
      "claim.qbp2b.r2.b2b03.application",
      "claim.qbp2b.r2.cirrhotic-inr-plan"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.soft-tissue.vascular-mimic-before-drainage.v1",
    "displayName": "Investigate a vascular mimic before drainage",
    "learningObjective": "Interpret cavity contents together with pulsatile Doppler flow and choose an arterial map instead of treating every hypoechoic swelling as pus.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.lymphangitis.distal-source-imaging.v2",
    "versioningReason": "Changes an uncomplicated source-control technique question to vascular-mimic evaluation; preserve the old lymphangitis and abscess-drainage meanings.",
    "revisedItemIds": [
      "B2B04"
    ],
    "evidenceClaimIds": [
      "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      "claim.bread-butter.skin-infection.equivocal-ultrasound",
      "claim.bread-butter.cutaneous-abscess.incision-drainage",
      "claim.qbp2b.r2.b2b04.application",
      "claim.qbp2b.r2.vascular-mimic-map"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.consent.decision-specific-appreciation-assessment.v1",
    "displayName": "Assess personal appreciation before acting on refusal",
    "learningObjective": "Distinguish factual understanding from application of consequences to oneself and select a decision-specific capacity assessment without presuming incapacity or surrogate authority.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.statistics-ethics.capacity-refusal",
    "versioningReason": "The old clear-capacity refusal objective changes to assessing an unresolved appreciation deficit; retain the old informed-refusal history.",
    "revisedItemIds": [
      "B2B07"
    ],
    "evidenceClaimIds": [
      "claim.gs028se.capacity-refusal.1",
      "claim.gs028se.capacity-refusal.3",
      "claim.qbp2b.r2.b2b07.application"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
    "displayName": "Retain the inflammatory-disease boundary after response",
    "learningObjective": "Interpret the pretreatment skin/pathology record and apply its breast and axillary surgical implications despite a reassuring current response.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
    "versioningReason": "Changes an overwhelming residual-field extent quiz into use of the original inflammatory phenotype after response; preserve the old breast-conservation selection concept.",
    "revisedItemIds": [
      "B2B08"
    ],
    "evidenceClaimIds": [
      "claim.nact.bcs-selection",
      "claim.nact.response-mapping",
      "claim.brief.ibc.core-biopsy-confirmation",
      "claim.brief.ibc.trimodality-sequence",
      "claim.qbp2b.r2.b2b08.application",
      "claim.qbp2b.r2.inflammatory-response-operation"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
    "displayName": "Stage bowel management after restored mesenteric flow",
    "learningObjective": "Interpret residual viability and current physiology to choose anastomosis and reassessment strategy after emergency revascularization.",
    "conceptType": "disposition",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
    "versioningReason": "Changes recognition of the need for exploration into a distinct intraoperative staging decision; retain the original emergency-exploration concept.",
    "revisedItemIds": [
      "B2B09"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration",
      "claim.qbp2b.r2.b2b09.application",
      "claim.qbp2b.r2.ischaemic-bowel-staging"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.cholecystitis.source-control-during-active-cardiac-event.v1",
    "displayName": "Distinguish high operative risk from current unsuitability",
    "learningObjective": "Integrate the ongoing biliary source and a new active cardiac event before choosing immediate cholecystectomy, gallbladder drainage or duct treatment.",
    "conceptType": "disposition",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
    "versioningReason": "Changes routine index-admission timing into a specific current source-control/fitness conflict; retain the older timing objective.",
    "revisedItemIds": [
      "B2B11"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
      "claim.qbp2b.r2.b2b11.application",
      "claim.qbp2b.r2.cholecystitis-active-cardiac-event"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.mondor.supportive-treatment-with-ulcer-risk.v1",
    "displayName": "Choose local care and an appropriate analgesic in a concurrent ulcer",
    "learningObjective": "Interpret the superficial venous findings and integrate the active NSAID-associated marginal-ulcer history when selecting a treatment regimen.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.mondor-disease.supportive-management",
    "versioningReason": "Changes uncomplicated supportive-care recall into two treatment components determined by imaging and a specific comorbidity; retain the old supportive-care history.",
    "revisedItemIds": [
      "B2B12"
    ],
    "evidenceClaimIds": [
      "claim.mondor-disease.ultrasound-phenotype",
      "claim.mondor-disease.supportive-management-and-boundaries",
      "claim.gs028c.marginal-ulcer.nsaid",
      "claim.qbp2b.r2.b2b12.application"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.breast-discharge.target-representativity-and-guidance.v1",
    "displayName": "Select representative sampling after a discharge workup",
    "learningObjective": "Reconcile the imaging target and actual sampled site before choosing a method for the remaining mammographic abnormality.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
    "versioningReason": "Changes initial discharge-imaging recall into target/method selection after a nonrepresentative benign sample; retain the original initial-imaging card.",
    "revisedItemIds": [
      "B2B13"
    ],
    "evidenceClaimIds": [
      "claim.discharge.pathologic-pattern",
      "claim.discharge.imaging",
      "claim.gs028c.palpable.biopsy",
      "claim.qbp2b.r2.b2b13.application",
      "claim.qbp2b.r2.breast-target-representativity"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.appendicitis.ct-request-with-urinary-mimic.v1",
    "displayName": "Choose an acute abdominal CT protocol despite urinary clues",
    "learningObjective": "Integrate the pain/examination trajectory with haematuria before selecting an abdominal inflammatory, stone or excretory-tract CT request.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.appendicitis.stable-adult-ct",
    "versioningReason": "Changes a modality choice against a failed ultrasound into a specific imaging-request decision; retain the prior modality-selection construct.",
    "revisedItemIds": [
      "B2B14"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.appendicitis.ct-after-nondiagnostic-us",
      "claim.qbp2b.r2.b2b14.application",
      "claim.qbp2b.r2.acute-abdominal-ct-protocol"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.cirrhosis.analgesic-selection-with-renal-deterioration.v1",
    "displayName": "Choose an analgesic class during cirrhotic renal deterioration",
    "learningObjective": "Integrate the changed renal/fluid course with the actual analgesic exposure and avoid a within-NSAID substitution.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
    "versioningReason": "Changes generic elective deferral into a specific medication safety decision; retain the previous decompensation/elective-plan card.",
    "revisedItemIds": [
      "B2B15"
    ],
    "evidenceClaimIds": [
      "claim.cirrhosis.multifactor-risk",
      "claim.cirrhosis.optimize-decompensation",
      "claim.qbp2b.r2.b2b15.application",
      "claim.qbp2b.r2.cirrhosis-nsaid-renal-boundary"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.cirrhosis.cathartic-response-and-acute-mentation.v1",
    "displayName": "Address a treatment-related precipitant during altered mentation",
    "learningObjective": "Interpret stool output, posture and electrolytes before escalating a cathartic solely because ammonia remains elevated.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
    "versioningReason": "Changes recognition of the need for acute hospital assessment into a concrete treatment-response decision; retain the original acute-disposition objective.",
    "revisedItemIds": [
      "B2B16"
    ],
    "evidenceClaimIds": [
      "claim.cirrhosis.optimize-decompensation",
      "claim.qbp2b.r2.b2b16.application",
      "claim.qbp2b.r2.catharsis-volume-precipitant"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.dialysis-access.symptomatic-central-outflow-assessment.v1",
    "displayName": "Select a symptomatic access investigation",
    "learningObjective": "Integrate access performance, collateral distribution and catheter history before choosing the vascular territory and test.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.dialysis-access.clinical-dysfunction-referral",
    "versioningReason": "Changes generic access-team referral into a specific vascular investigation; retain the earlier broad dysfunction/referral card.",
    "revisedItemIds": [
      "B2B17"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.access.dysfunction-referral",
      "claim.qbp2b.r2.b2b17.application",
      "claim.qbp2b.r2.access-central-outflow-map"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.hyperkalaemia.ecg-response-versus-potassium-shifting.v1",
    "displayName": "Interpret the response to calcium before the next intervention",
    "learningObjective": "Use serial ECG and chemistry to distinguish electrical protection from potassium shifting during hospital treatment.",
    "conceptType": "disposition",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
    "versioningReason": "Changes a community emergency-threshold disposition into a hospital treatment-response decision; retain the old transfer concept.",
    "revisedItemIds": [
      "B2B18",
      "B2B29"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.hyperkalaemia.severe-transfer",
      "claim.gs028d.hyperkalaemia.mechanisms",
      "claim.qbp2b.r2.b2b18.application",
      "claim.qbp2b.r2.b2b29.application"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.palpable-breast.existing-target-series-reconciliation.v1",
    "displayName": "Reconcile the acquired study before reordering",
    "learningObjective": "Read acquisition coverage separately from the attached report and choose review of existing target images when that examination has already been recorded.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.palpable-breast.site-concordant-imaging.v1",
    "versioningReason": "Changes repeat-targeted-ultrasound ordering into an acquisition/retrieval distinction; retain the old imaging-order concept.",
    "revisedItemIds": [
      "B2B19"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.gs028c.palpable.biopsy",
      "claim.qbp2b.r2.b2b19.application",
      "claim.qbp2b.r2.breast-existing-series-reconciliation"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.anorectal-abscess.supralevator-origin-and-drainage.v1",
    "displayName": "Choose drainage from the origin of a supralevator collection",
    "learningObjective": "Interpret the communicating anatomical plane and infection extent before choosing access and adjunctive antibiotic scope.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
    "versioningReason": "Changes superficial opening-versus-aspiration recall into an anatomical drainage-route decision; retain the old uncomplicated-abscess construct.",
    "revisedItemIds": [
      "B2B20",
      "B2B38"
    ],
    "evidenceClaimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.bread-butter.perianal-abscess.selective-antibiotics",
      "claim.qbp2b.r2.b2b20.application",
      "claim.qbp2b.r2.supralevator-origin-drainage",
      "claim.qbp2b.r2.b2b38.application"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1",
    "displayName": "Treat a medication-withdrawal driver of postoperative agitation",
    "learningObjective": "Integrate the actual home drug interruption with autonomic/neurobehavioural observations rather than applying a generic delirium drug prohibition.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.postoperative-delirium.multicomponent-prevention-plan",
    "versioningReason": "Replaces an unfair prevention-bundle prioritization with a separate acute medication decision; preserve the prevention-plan concept.",
    "revisedItemIds": [
      "B2B21"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.delirium.multicomponent-plan",
      "claim.qbp2b.r2.b2b21.application",
      "claim.qbp2b.r2.withdrawal-delirium-exception"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.mesenteric-ischaemia.venous-thrombosis-initial-pathway.v1",
    "displayName": "Choose the initial pathway for mesenteric venous thrombosis",
    "learningObjective": "Interpret arterial versus venous phase findings and the current abdominal examination before choosing anticoagulation, endovascular escalation or exploration.",
    "conceptType": "disposition",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.acute-mesenteric-ischemia.peritonitis-exploration",
    "versioningReason": "Changes a duplicate arterial-peritonitis rule into the distinct venous-ischaemia initial pathway; preserve the original emergency-exploration concept.",
    "revisedItemIds": [
      "B2B22"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.ami.peritonitis-exploration",
      "claim.qbp2b.r2.b2b22.application",
      "claim.qbp2b.r2.mesenteric-venous-initial-treatment"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1",
    "displayName": "Use local complications when choosing biliary timing",
    "learningObjective": "Interpret the persistent local collection alongside clinical recovery and current duct findings before choosing timing and a separate duct procedure.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
    "versioningReason": "Changes uncomplicated same-admission timing recall into a complication-dependent timing/duct decision; retain the older mild-disease card.",
    "revisedItemIds": [
      "B2B23"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.pancreatitis.index-admission-cholecystectomy",
      "claim.qbp2b.r2.b2b23.application",
      "claim.qbp2b.r2.pancreatitis-local-complication-timing"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1",
    "displayName": "Choose a subtotal completion from actual tissue findings",
    "learningObjective": "Recognize when total dissection is unsafe and use remnant wall quality to distinguish open- from closed-remnant completion.",
    "conceptType": "disposition",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
    "versioningReason": "Changes ordinary admission timing into an intraoperative completion decision; retain the older index-admission treatment card.",
    "revisedItemIds": [
      "B2B25"
    ],
    "evidenceClaimIds": [
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification",
      "claim.qbp2b.r2.b2b25.application",
      "claim.qbp2b.r2.subtotal-remnant-tissue-choice"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1",
    "displayName": "Continue metabolic treatment after the glucose falls",
    "learningObjective": "Interpret discordant glucose and ketone-acidosis trajectories and choose both continued insulin and its changed substrate support.",
    "conceptType": "disposition",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.hyperkalaemia.severe-community-result-transfer",
    "versioningReason": "Changes a community potassium-transfer objective into inpatient ketone-acidosis treatment-response planning; preserve the original transfer card without history migration.",
    "revisedItemIds": [
      "B2B30"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
      "claim.gs028e.sglt2.ketoacidosis-precipitating-context",
      "claim.gs028d.acidosis.blood-gas",
      "claim.qbp2b.r2.b2b30.application",
      "claim.qbp2b.r2.persistent-ketone-acidosis-substrate"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.transplant.abo-versus-hla-and-pre-event-record.v1",
    "displayName": "Reconcile a separate compatibility system and specimen window",
    "learningObjective": "Interpret red-cell typing despite a negative HLA assay and choose records capable of establishing the preimplantation state.",
    "conceptType": "applied_science",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.immunology.graft-evidence-to-review-focus.v1",
    "versioningReason": "Changes duplicate humoral-injury labelling into a distinct ABO/HLA record conflict; retain the prior mechanism-review concept.",
    "revisedItemIds": [
      "B2B31"
    ],
    "evidenceClaimIds": [
      "claim.gs028e.hyperacute_preformed",
      "claim.gs028e.hyperacute_vascular",
      "claim.qf3.preimplantation-specimen-inference",
      "claim.qbp2b.r2.b2b31.application",
      "claim.qbp2b.r2.abo-versus-hla-record"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.acid-base.euglycaemic-risk-with-mixed-gas.v1",
    "displayName": "Investigate a metabolic component despite pH and glucose reassurance",
    "learningObjective": "Integrate the gap, gas directions and SGLT2/perioperative context before selecting a cause-directed assay.",
    "conceptType": "diagnosis",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
    "versioningReason": "Changes a supplied corrected-gap result into interpretation of a potentially masked metabolic component and a drug-specific investigation; retain the previous corrected-gap construct.",
    "revisedItemIds": [
      "B2B33"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.acidosis.corrected-gap",
      "claim.gs028d.acidosis.blood-gas",
      "claim.gs028e.sglt2.ketoacidosis-without-marked-hyperglycemia",
      "claim.gs028e.sglt2.ketoacidosis-precipitating-context",
      "claim.qbp2b.r2.b2b33.application"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.acid-base.discordant-chemistry-and-gas-specimen.v1",
    "displayName": "Reconcile discordant chemistry and blood gas",
    "learningObjective": "Use simultaneous physiological consistency and actual collection provenance to choose the specimen to verify before acting on an apparent bicarbonate deficit.",
    "conceptType": "diagnosis",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.metabolic-acidosis.confirm-with-blood-gas",
    "versioningReason": "Changes foundational gas-test selection into a current specimen-quality decision; retain the earlier confirmation-with-blood-gas concept.",
    "revisedItemIds": [
      "B2B35"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.acidosis.blood-gas",
      "claim.n1r2.gas-record-interpretation",
      "claim.qbp2b.r2.b2b35.application",
      "claim.qbp2b.r2.discordant-gas-chemistry-specimen"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.palpable-breast.target-acquisition-adequacy.v1",
    "displayName": "Complete an obscured palpable-target acquisition",
    "learningObjective": "Interpret actual tissue coverage rather than report labels and distinguish reacquisition from retrieval or advanced imaging.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.palpable-breast.site-concordant-imaging.v1",
    "versioningReason": "Changes repeated quadrant matching into an adequacy decision; preserve the old targeted-imaging-order concept.",
    "revisedItemIds": [
      "B2B36"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.gs028c.palpable.biopsy",
      "claim.qbp2b.r2.b2b36.application",
      "claim.qbp2b.r2.obscured-breast-acquisition"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.palpable-breast.representative-target-and-tissue-method.v1",
    "displayName": "Select representative tissue after a discordant limited sample",
    "learningObjective": "Reconcile the actual sampled site and specimen type with the persistent clinical target before choosing a repeat tissue request.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
    "versioningReason": "Changes first biopsy despite negative imaging into a target/method decision after a nonrepresentative needle sample; retain the old clinical-imaging discordance card.",
    "revisedItemIds": [
      "B2B37"
    ],
    "evidenceClaimIds": [
      "claim.gs028c.palpable.biopsy",
      "claim.qbp2b.r2.b2b37.application",
      "claim.qbp2b.r2.palpable-core-target-after-cytology"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.anorectal-fistula.tract-and-transplant-host-plan.v1",
    "displayName": "Choose a tract plan and adjunct scope after drainage",
    "learningObjective": "Interpret sphincter involvement separately from the host immune state and avoid equating normal neutrophils with absence of immunosuppression.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
    "versioningReason": "Replaces the under-specified chemotherapy/neutropenia source-control question with a post-drainage tract/host decision; retain the old source-control concept.",
    "revisedItemIds": [
      "B2B39"
    ],
    "evidenceClaimIds": [
      "claim.fistula.loose-seton-for-high-transsphincteric-tract",
      "claim.bread-butter.perianal-abscess.selective-antibiotics",
      "claim.qbp2b.r2.b2b39.application",
      "claim.qbp2b.r2.transplant-regimen-host-assessment"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.anorectal-fistula.function-before-low-tract-division.v1",
    "displayName": "Use baseline function before a low-tract procedure",
    "learningObjective": "Interpret a technically low course alongside pre-existing continence impairment and prior sphincter division before choosing the current tract procedure.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
    "versioningReason": "Changes a duplicate healthy-host abscess plan into a different function-sensitive fistula decision; retain the old uncomplicated-drainage card.",
    "revisedItemIds": [
      "B2B40"
    ],
    "evidenceClaimIds": [
      "claim.fistula.loose-seton-for-high-transsphincteric-tract",
      "claim.bread-butter.perianal-abscess.prompt-drainage",
      "claim.qbp2b.r2.b2b40.application",
      "claim.qbp2b.r2.baseline-function-before-fistulotomy"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.nutrition.delivered-intake-before-route-escalation.v1",
    "displayName": "Reconcile intake delivery with inflammatory albumin change",
    "learningObjective": "Compare actual consumed nutrition with the current assessed targets before adding a feeding route because a laboratory marker deteriorates.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.preoperative-nutrition.risk-before-route-selection.v1",
    "versioningReason": "Changes obvious decline-to-support matching into a delivery/laboratory conflict; retain the prior nutritional-risk assessment card.",
    "revisedItemIds": [
      "B2B41"
    ],
    "evidenceClaimIds": [
      "claim.nutrition.screen",
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary",
      "claim.qbp2b.r2.b2b41.application",
      "claim.qbp2b.r2.nutrition-intake-audit"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
    "displayName": "Choose access from the compartment of feeding failure",
    "learningObjective": "Interpret actual gastric intolerance and the investigation obtained for vomiting before choosing jejunal, gastric or parenteral access.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.preoperative-nutrition.oral-enteral-first-line",
    "versioningReason": "Changes a failed-oral/patent-gut hierarchy into a specific access decision after gastric feeding intolerance; retain the former oral/enteral escalation card.",
    "revisedItemIds": [
      "B2B42"
    ],
    "evidenceClaimIds": [
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary",
      "claim.qbp2b.r2.b2b42.application",
      "claim.qbp2b.r2.postpyloric-before-route-abandonment"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.preoperative-osa.awake-ventilation-assessment.v1",
    "displayName": "Investigate awake physiology separately from a sleep screen",
    "learningObjective": "Integrate actual awake oxygenation and chemistry with the sleep history before selecting the next investigation.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "previousConceptId": "concept.osa.discordant-screen-documentation.v2",
    "versioningReason": "Adds the previously omitted F13 as a new supported-review candidate rather than reuse a failed risk-label quiz; preserve the manager-kept live screening concept.",
    "revisedItemIds": [
      "F13"
    ],
    "evidenceClaimIds": [
      "claim.gs028d.osa.validated-screen",
      "claim.qf2.sleep-questionnaire-domain-interpretation",
      "claim.gs028d.acidosis.blood-gas",
      "claim.qbp2b.r2.f13.application",
      "claim.qbp2b.r2.osa-awake-gas-exchange"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  }
];
