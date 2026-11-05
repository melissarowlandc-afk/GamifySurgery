import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Retained round-two drafts. No automatic manager acceptance or clinical approval. */
export const QUESTION_FLAGS2_ROUND2_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.flags2r2.20261105.g01",
    "auditId": "G01",
    "caseId": "case.persistent-itp.hematology-followup",
    "nodeId": "node.persistent-itp.hematology-followup.2",
    "previousQuestionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r1",
    "questionVariantId": "question.persistent-itp.defer-elective-splenectomy.v3.r2",
    "previousContentVersions": [
      "clinical.question-flags2.2026-11-05.v1"
    ],
    "previousStem": "Which plan should be recommended for {patientName}'s splenectomy consultation?",
    "previousChoiceLabels": [
      "Continue treatment; reassess elective splenectomy when disease duration reaches a year",
      "Arrange vaccination; schedule splenectomy after preoperative immunization is complete",
      "Arrange marrow sampling; schedule splenectomy after the pathology report returns"
    ],
    "previousCurrentUpdate": "The returned HIV and hepatitis-C serology is negative. Platelet counts since the relapse have remained above 30 × 10^9/L. Bruises have recurred, but there has been no mucosal or internal bleeding. Hematology is continuing treatment and follow-up; {patientName} asks about an operation after the relapse.",
    "previousExhibit": null,
    "currentUpdate": "HIV and hepatitis-C serology have returned negative. At this return visit, hemoglobin and the absolute neutrophil count are below their laboratory reference ranges. The smear describes macrocytic red cells and neutrophils with reduced granulation and fewer nuclear lobes. Vitamin B12 and folate are within reference ranges; the reticulocyte count is below range.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Compare the current blood-cell pattern with the initially isolated thrombocytopenia. Then: Choose an investigation that evaluates the new production/morphology problem rather than substituting a blood immunophenotype or molecular clone for tissue assessment.",
    "reviewerNotes": "Key hold: directly verify the ITP-consensus changed-cytopenia/marrow boundary and comparative workup with hematology before acceptance. The existing claim covers isolated-thrombocytopenia evaluation, not this full marrow-versus-flow-versus-sequencing ranking. No exact one-year rule or automatic HIV/HCV-to-marrow sequence is taught.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "defer_3": "defer_3",
      "choice.flags2r2.20261105.g01.d1": "choice.flags2.20261105.g01.d1",
      "choice.flags2r2.20261105.g01.d2": "choice.flags2.20261105.g01.d2"
    },
    "choiceServiceOverrides": {
      "defer_3": null,
      "choice.flags2r2.20261105.g01.d1": null,
      "choice.flags2r2.20261105.g01.d2": null
    },
    "choiceTimingOverrides": {
      "defer_3": {
        "kind": "test",
        "timingProfileId": "timing.test.bone_marrow"
      },
      "choice.flags2r2.20261105.g01.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.advanced_diagnostic"
      },
      "choice.flags2r2.20261105.g01.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.genetic"
      }
    },
    "question": {
      "id": "question.persistent-itp.defer-elective-splenectomy.v3.r2",
      "conceptId": "concept.itp.changed-lineage-pattern-before-treatment.v1",
      "stem": "Which investigation should precede another treatment recommendation for {patientName}'s thrombocytopenia?",
      "answerChoices": [
        {
          "id": "defer_3",
          "label": "Marrow aspirate and core biopsy",
          "isCorrect": true,
          "rationale": "The initial isolated platelet problem has become a multilineage cytopenia with altered cell morphology. Marrow assessment can examine production, morphology and tissue together before this is treated as another uncomplicated ITP relapse. The indication is the changed pattern, not the negative viral serology.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g01.d1",
          "label": "Peripheral-blood flow cytometry assay",
          "isCorrect": false,
          "distractorRationale": "Flow cytometry is a credible investigation of an abnormal blood-cell population. Here the reported changes concern multiple lineages and maturation, and a blood immunophenotype would not supply the marrow morphology and tissue assessment underlying the intended next step. This is not a claim that flow studies have no role in the subsequent workup."
        },
        {
          "id": "choice.flags2r2.20261105.g01.d2",
          "label": "Peripheral-blood myeloid sequencing assay",
          "isCorrect": false,
          "distractorRationale": "Molecular testing could contribute to classification, but a detected clone would not by itself establish the tissue/morphologic explanation of this changed cytopenia pattern. The near-miss is substituting a molecular result for the integrated marrow evaluation."
        }
      ],
      "explanation": "The initial isolated platelet problem has become a multilineage cytopenia with altered cell morphology. Marrow assessment can examine production, morphology and tissue together before this is treated as another uncomplicated ITP relapse. The indication is the changed pattern, not the negative viral serology. Flow cytometry is a credible investigation of an abnormal blood-cell population. Here the reported changes concern multiple lineages and maturation, and a blood immunophenotype would not supply the marrow morphology and tissue assessment underlying the intended next step. This is not a claim that flow studies have no role in the subsequent workup. Molecular testing could contribute to classification, but a detected clone would not by itself establish the tissue/morphologic explanation of this changed cytopenia pattern. The near-miss is substituting a molecular result for the integrated marrow evaluation.",
      "teachingPoint": "The initial isolated platelet problem has become a multilineage cytopenia with altered cell morphology. Marrow assessment can examine production, morphology and tissue together before this is treated as another uncomplicated ITP relapse. The indication is the changed pattern, not the negative viral serology.",
      "supportingEvidenceClaimIds": [
        "claim.persistent-itp.hiv-hcv-secondary-evaluation",
        "claim.flags2r2.20261105.changed-cytopenia-boundary",
        "claim.flags2r2.20261105.marrow-versus-blood-studies"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.persistent-itp.defer-elective-splenectomy",
      "nextConceptId": "concept.itp.changed-lineage-pattern-before-treatment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes the scored objective from elective splenectomy timing to evaluation of a changed blood-cell pattern. Preserve the original timing card and the eight isolated-ITP siblings; negative serology is not a universal trigger for marrow examination."
    },
    "ownerProgramReview": {
      "ownerItemId": "G01",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removed the continuing-treatment declaration, automatic surgery-after-preparation foils and calendar-date key. The follow-up now changes the diagnostic evidence; three specific investigations compete. Explicitly versioned the changed objective and retained the old timing card.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is seen five months after isolated thrombocytopenia was documented. Platelets rose during corticosteroid treatment and fell during tapering. At the initial assessment, hemoglobin, neutrophil count and red-cell morphology were within laboratory reference limits.",
    "previousPresentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
    "previousProfilePresentations": [
      {
        "id": "profile.persistent-itp.hematology-followup.female.57",
        "presentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.57",
        "presentation": "{patientName}, a 57-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
      },
      {
        "id": "profile.persistent-itp.hematology-followup.female.55",
        "presentation": "{patientName}, a 55-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.55",
        "presentation": "{patientName}, a 55-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.persistent-itp.hematology-followup",
        "patientPresentationVariantId": "presentation.persistent-itp.hematology-followup",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Splenectomy consultation",
        "revisedPresentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.female.57",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.female.57",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 57-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.male.57",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.male.57",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 57-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.female.55",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.female.55",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 55-year-old woman, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.persistent-itp.hematology-followup.male.55",
            "approvedInstantiationProfileId": "profile.persistent-itp.hematology-followup.male.55",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 55-year-old man, is seen for bruising five months after isolated thrombocytopenia was first documented. Platelets rose during corticosteroid treatment and fell again during tapering. Hemoglobin and leukocyte counts remain within laboratory reference ranges; smear review describes normal red-cell and white-cell morphology.",
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
      "idPrefix": "ppr.flags2r2.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1"
    },
    "chiefComplaint": "Splenectomy consultation",
    "previousChiefComplaint": "Splenectomy consultation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.persistent-itp.hematology-followup.female.57",
        "chiefComplaint": "Splenectomy consultation"
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.57",
        "chiefComplaint": "Splenectomy consultation"
      },
      {
        "id": "profile.persistent-itp.hematology-followup.female.55",
        "chiefComplaint": "Splenectomy consultation"
      },
      {
        "id": "profile.persistent-itp.hematology-followup.male.55",
        "chiefComplaint": "Splenectomy consultation"
      }
    ]
  },
  {
    "id": "revision.flags2r2.20261105.g02",
    "auditId": "G02",
    "caseId": "case.gs028d.anesthesia.b-family-testing-record",
    "nodeId": "node.gs028d.anesthesia.b-family-testing-record.1",
    "previousQuestionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r1",
    "questionVariantId": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r2",
    "previousContentVersions": [
      "clinical.question-flags2.2026-11-05.v1"
    ],
    "previousStem": "Which general-anaesthetic regimen should be proposed for {patientName}?",
    "previousChoiceLabels": [
      "Propofol infusion with remifentanil; rocuronium for intubation",
      "Sevoflurane maintenance with fentanyl; cisatracurium for intubation",
      "Propofol infusion with fentanyl; succinylcholine for intubation"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": "The anesthesia worksheet lists propofol and remifentanil infusions with rocuronium, workstation preparation under the manufacturer's MH instructions, and the hospital's dantrolene response protocol. {patientName} has not had muscle-contracture testing.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret why the prior anesthetic and panel have not cleared the documented familial risk. Then: Apply that unresolved risk to the testing/prophylaxis sequence under the specified anesthetic preparation.",
    "reviewerNotes": "Key hold: align negative-panel/prior-exposure interpretation, named agents, preparation premise, surgery-before-testing and dantrolene-prophylaxis ranking directly with the recorded JSA/EMHG guidance before acceptance. No new dose, preparation duration, flush protocol or guarantee from a checklist is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.flags2r2.20261105.g02.d1": "choice.flags2.20261105.g02.d1",
      "choice.flags2r2.20261105.g02.d2": "choice.flags2.20261105.g02.d2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.flags2r2.20261105.g02.d1": null,
      "choice.flags2r2.20261105.g02.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.advanced_diagnostic"
      },
      "choice.flags2r2.20261105.g02.d1": {
        "kind": "no_test"
      },
      "choice.flags2r2.20261105.g02.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.advanced_diagnostic"
      }
    },
    "question": {
      "id": "question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2.r2",
      "conceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "stem": "Which recommendation should be sent to {patientName}'s anesthesia team?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Plan propofol–remifentanil anesthesia; arrange contracture testing separately",
          "isCorrect": true,
          "rationale": "The uneventful exposure and negative panel do not clear susceptibility in this family. With the represented nontriggering plan and documented MH preparation, definitive susceptibility testing need not become a prerequisite to surgery.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g02.d1",
          "label": "Plan propofol–remifentanil anesthesia; administer prophylactic dantrolene",
          "isCorrect": false,
          "distractorRationale": "This retains an appropriate intravenous technique but adds prophylaxis as though familial risk requires pretreatment even with trigger avoidance and MH preparation. It confuses readiness to treat a crisis with routinely administering the rescue drug."
        },
        {
          "id": "choice.flags2r2.20261105.g02.d2",
          "label": "Plan propofol–remifentanil anesthesia after muscle-contracture testing",
          "isCorrect": false,
          "distractorRationale": "The family result and negative panel justify continued risk precautions, not necessarily delaying surgery until a definitive susceptibility test is completed. This is a credible sequencing error when an inconclusive genetic result is treated as a barrier to a nontriggering anesthetic."
        }
      ],
      "explanation": "The uneventful exposure and negative panel do not clear susceptibility in this family. With the represented nontriggering plan and documented MH preparation, definitive susceptibility testing need not become a prerequisite to surgery. This retains an appropriate intravenous technique but adds prophylaxis as though familial risk requires pretreatment even with trigger avoidance and MH preparation. It confuses readiness to treat a crisis with routinely administering the rescue drug. The family result and negative panel justify continued risk precautions, not necessarily delaying surgery until a definitive susceptibility test is completed. This is a credible sequencing error when an inconclusive genetic result is treated as a barrier to a nontriggering anesthetic.",
      "teachingPoint": "The uneventful exposure and negative panel do not clear susceptibility in this family. With the represented nontriggering plan and documented MH preparation, definitive susceptibility testing need not become a prerequisite to surgery.",
      "supportingEvidenceClaimIds": [
        "claim.gs028d.mh.trigger-free-plan",
        "claim.flags2r2.20261105.mh-family-panel-boundary",
        "claim.flags2r2.20261105.mh-testing-not-prerequisite",
        "claim.flags2r2.20261105.mh-no-routine-prophylaxis",
        "claim.flags2r2.20261105.mh-named-plan"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.mh.family-history-and-regimen-components.v1",
      "nextConceptId": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The round-one objective compared trigger classes in drug regimens. This version compares preoperative testing/prophylaxis sequencing when every offered plan uses the same acceptable intravenous drugs; retain the original communication and trigger-recognition cards."
    },
    "ownerProgramReview": {
      "ownerItemId": "G02",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Kept the family/prior-exposure chronology, added the actual negative-panel limitation, and made all options use the same acceptable drug technique. The decision is now testing/prophylaxis sequence rather than spotting a volatile or depolarizing drug.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends before colectomy. A sibling has a positive muscle-contracture test after an anesthetic reaction. {patientName}'s previous appendectomy used sevoflurane with an uncomplicated recovery. A subsequent blood gene panel reported no pathogenic variant; no familial causative variant has been identified.",
    "previousPresentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
        "presentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
        "presentation": "{patientName}, a 35-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
        "presentation": "{patientName}, a 60-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
        "presentation": "{patientName}, a 60-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.gs028d.anesthesia.b-family-testing-record",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.b-family-testing-record",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Colectomy anesthesia review",
        "revisedPresentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.female.35",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 35-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.male.35",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 35-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.female.60",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 60-year-old woman, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028d.anesthesia.b-family-testing-record.male.60",
            "approvedInstantiationProfileId": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 60-year-old man, attends before colectomy. A sibling has a documented positive muscle-contracture test after an anaesthetic reaction. {patientName}'s earlier appendectomy record lists sevoflurane and an uncomplicated recovery; {patientName} has not undergone susceptibility testing.",
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
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2r2.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1"
    },
    "chiefComplaint": "Colectomy anesthesia review",
    "previousChiefComplaint": "Colectomy anesthesia review",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.35",
        "chiefComplaint": "Colectomy anesthesia review"
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.35",
        "chiefComplaint": "Colectomy anesthesia review"
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.female.60",
        "chiefComplaint": "Colectomy anesthesia review"
      },
      {
        "id": "profile.gs028d.anesthesia.b-family-testing-record.male.60",
        "chiefComplaint": "Colectomy anesthesia review"
      }
    ]
  },
  {
    "id": "revision.flags2r2.20261105.g03",
    "auditId": "G03",
    "caseId": "case.gs028c.palpable-breast.paired-dense-focal",
    "nodeId": "node.gs028c.palpable-breast.paired-dense-focal.1",
    "previousQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1",
    "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
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
    "intendedInference": "Correlate the two examination markers with the acquired views rather than the word negative. Then: Choose a new site-specific acquisition instead of retrieval of the wrong site or repetition of already adequate mammographic coverage.",
    "reviewerNotes": "One adequate recorded ACR guideline directly supports targeted ultrasound at the persistent mammographically occult clinical site. The complete two-site acquisition record supplies the logical distinction from archive retrieval; no inference is made from a missing export alone. Protocol realism and option ranking still need clinical review, but this is not a new unsupported imaging rule or a fresh source verification.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.flags2r2.20261105.g03.d1": "d1_1",
      "choice.flags2r2.20261105.g03.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.ultrasound",
      "choice.flags2r2.20261105.g03.d1": null,
      "choice.flags2r2.20261105.g03.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.flags2r2.20261105.g03.d1": {
        "kind": "no_test"
      },
      "choice.flags2r2.20261105.g03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mammography"
      }
    },
    "question": {
      "id": "question.palpable-breast.negative-mammogram-targeted-us.v1.r3",
      "conceptId": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
      "stem": "Which radiology request should be made at this visit for {patientName}'s persistent palpable finding?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Request targeted breast ultrasound",
          "isCorrect": true,
          "rationale": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g03.d1",
          "label": "Request archived breast ultrasound images",
          "isCorrect": false,
          "distractorRationale": "Retrieval is a credible near-miss when an acquisition exists but transferred images are missing. The complete recorded acquisition here addresses the other marker, so retrieving that accession would not supply the required clinical-site correlation."
        },
        {
          "id": "choice.flags2r2.20261105.g03.d2",
          "label": "Request spot-compression breast mammography",
          "isCorrect": false,
          "distractorRationale": "This would be reasonable if the mammographic acquisition did not cover the current marker. The supplied views already include it; the unresolved issue is targeted sonographic correlation with the actual clinical finding, not another mammographic view."
        }
      ],
      "explanation": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study. Retrieval is a credible near-miss when an acquisition exists but transferred images are missing. The complete recorded acquisition here addresses the other marker, so retrieving that accession would not supply the required clinical-site correlation. This would be reasonable if the mammographic acquisition did not cover the current marker. The supplied views already include it; the unresolved issue is targeted sonographic correlation with the actual clinical finding, not another mammographic view.",
      "teachingPoint": "The complete acquisition record corresponds to the other marker, not the persistent lower-inner finding. Targeted imaging should be correlated with the current palpable site. This requests a different acquisition rather than simply repeating an adequate study.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.palpable.targeted-us",
        "claim.flags2r2.20261105.breast-acquisition-site",
        "claim.flags2r2.20261105.breast-repeat-versus-retrieve"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
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
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "nextConceptId": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
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
        "resultNarrative": "Targeted ultrasound of the exact palpable area is negative, but the clinician still finds the same distinctly hard or irregular mass.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.in_house",
          "route.ultrasound.outsourced"
        ]
      },
      "reason": "Changes the scored objective from recalling ultrasound after mammography to interpreting clinical/acquisition concordance. Binds directly to the owner-flagged live v1; B2B36 is not used as a revision source or accepted coverage."
    },
    "ownerProgramReview": {
      "ownerItemId": "G03",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Rewrote the exact flagged live v1 directly into a new version. Replaced the named ultrasound omission with two clinical markers and a complete acquisition log; replaced chest CT/MRI foils with credible retrieval and repeat-view requests.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns with a persistent firm, mobile lump in the lower-inner left breast. The clinic diagram places its skin marker at 8 o'clock. A separate longstanding superficial lump is marked at 2 o'clock.",
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
      "idPrefix": "ppr.flags2r2.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1"
    },
    "chiefComplaint": "Persistent breast thickening",
    "previousChiefComplaint": "Persistent breast lump",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.44"
      },
      {
        "id": "profile.gs028c.palpable-breast.paired-dense-focal.female.58"
      }
    ]
  },
  {
    "id": "revision.flags2r2.20261105.g04-r",
    "auditId": "G04-R",
    "caseId": "case.gs028f.gynecology.c1-late-period",
    "nodeId": "node.gs028f.gynecology.c1-late-period.1",
    "previousQuestionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1",
    "questionVariantId": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.2"
    ],
    "previousStem": "Which laboratory test should assess possible pregnancy during this patient's pelvic-pain evaluation?",
    "previousChoiceLabels": [
      "Serum hCG measurement",
      "Complete blood count",
      "Serum lipase testing",
      "Serum creatinine testing"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret what the changing hCG and the actual scan do and do not establish about location. Then: Prioritize a same-day diagnostic pathway under the new focal symptoms, against plausible appendiceal and presumed-miscarriage interpretations.",
    "reviewerNotes": "Key hold: verify the falling-hCG/location boundary, exact transvaginal acquisition and priority over the two offered diagnostic pathways directly with the recorded early-pregnancy guidance before acceptance. No hCG discriminatory threshold, repeat interval, methotrexate rule or definitive ectopic diagnosis is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.flags2r2.20261105.g04-r.d1": "d1_1",
      "choice.flags2r2.20261105.g04-r.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.flags2r2.20261105.g04-r.d1": null,
      "choice.flags2r2.20261105.g04-r.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.flags2r2.20261105.g04-r.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.flags2r2.20261105.g04-r.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "question": {
      "id": "question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1.r1",
      "conceptId": "concept.early-pregnancy.location-before-disposition.v1",
      "stem": "Which same-day diagnostic plan should be prioritized for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Transvaginal ultrasonography with gynecologic assessment",
          "isCorrect": true,
          "rationale": "The early home result, falling but detectable hCG and transabdominal scan do not establish pregnancy location. The new focal symptoms require prompt assessment of an early-pregnancy complication rather than a conclusion of completed miscarriage or a settled appendiceal diagnosis.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g04-r.d1",
          "label": "Appendiceal MRI with general-surgical assessment",
          "isCorrect": false,
          "distractorRationale": "Right lower-quadrant pain and a nonvisualized appendix make this a genuine competing pathway. They do not resolve the simultaneous unlocated pregnancy/spotting problem; the supplied pelvic acquisition cannot establish that a pregnancy complication has been excluded. This does not prohibit subsequent surgical imaging or assessment."
        },
        {
          "id": "choice.flags2r2.20261105.g04-r.d2",
          "label": "Diagnostic uterine aspiration with histopathologic assessment",
          "isCorrect": false,
          "distractorRationale": "Falling hCG and bleeding can tempt a diagnosis of failed intrauterine pregnancy. Neither hCG nor the supplied scan establishes an intrauterine location or makes uterine sampling the immediate first diagnostic procedure in this record."
        }
      ],
      "explanation": "The early home result, falling but detectable hCG and transabdominal scan do not establish pregnancy location. The new focal symptoms require prompt assessment of an early-pregnancy complication rather than a conclusion of completed miscarriage or a settled appendiceal diagnosis. Right lower-quadrant pain and a nonvisualized appendix make this a genuine competing pathway. They do not resolve the simultaneous unlocated pregnancy/spotting problem; the supplied pelvic acquisition cannot establish that a pregnancy complication has been excluded. This does not prohibit subsequent surgical imaging or assessment. Falling hCG and bleeding can tempt a diagnosis of failed intrauterine pregnancy. Neither hCG nor the supplied scan establishes an intrauterine location or makes uterine sampling the immediate first diagnostic procedure in this record.",
      "teachingPoint": "The early home result, falling but detectable hCG and transabdominal scan do not establish pregnancy location. The new focal symptoms require prompt assessment of an early-pregnancy complication rather than a conclusion of completed miscarriage or a settled appendiceal diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.gs028f.pregnancy.early-negative-limit",
        "claim.gs028f.ectopic.symptoms-require-assessment",
        "claim.gs028f.ectopic.hcg-does-not-locate",
        "claim.flags2r2.20261105.pregnancy-falling-hcg-boundary",
        "claim.flags2r2.20261105.pregnancy-localization-before-disposition",
        "claim.flags2r2.20261105.pregnancy-modality-ranking"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "keyValue",
        "caption": "Current examination and imaging record",
        "items": [
          {
            "label": "Abdominal examination",
            "value": "Right lower-quadrant tenderness; no generalized rigidity"
          },
          {
            "label": "Transabdominal pelvic scan",
            "value": "Uterine cavity seen without a gestational sac; adnexal structures not resolved separately"
          },
          {
            "label": "Appendix on the abdominal scan",
            "value": "Not visualized"
          }
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
      "nextConceptId": "concept.early-pregnancy.location-before-disposition.v1",
      "previousKeyServiceId": "service.basic_labs",
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Manager agrees to retire/merge the redundant assay-recognition item only after a harder replacement passes. This new scored clinical objective is separately versioned; original hCG-testing concept/live v1 and all frozen encounters remain unchanged pending acceptance."
    },
    "ownerProgramReview": {
      "ownerItemId": "G04",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Replaced elementary hCG-assay identification with a separately versioned pregnancy-location/diagnostic-disposition decision. The alternatives represent appendiceal disease and presumed intrauterine pregnancy failure; all receive same-day assessment. Original G04 stays live until this replacement passes and the manager accepts it.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old woman, returns with right lower abdominal pain and vaginal spotting. A home urine pregnancy test taken before the expected period was negative. Subsequent serum hCG was detected; its concentration has fallen on the interval sample but remains detectable. Pain is now more persistent and focal; circulation is currently stable.",
    "previousPresentation": "{patientName}, a 24-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028f.gynecology.c1-late-period.female.24",
        "presentation": "{patientName}, a 24-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway."
      },
      {
        "id": "profile.gs028f.gynecology.c1-late-period.female.32",
        "presentation": "{patientName}, a 32-year-old woman, visits the clinic with a new lower abdominal ache and a late menstrual period. Pregnancy is possible, but no pregnancy test has been performed. The patient is alert, has normal current vital signs and no syncope or severe pain; clinical assessment is underway."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 24,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.flags2r2.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1"
    },
    "chiefComplaint": "Right lower abdominal pain",
    "previousChiefComplaint": "Pelvic ache",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028f.gynecology.c1-late-period.female.24"
      },
      {
        "id": "profile.gs028f.gynecology.c1-late-period.female.32"
      }
    ]
  },
  {
    "id": "revision.flags2r2.20261105.g05-staging",
    "auditId": "G05-staging",
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.1",
    "previousQuestionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r1",
    "questionVariantId": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
    "previousContentVersions": [
      "clinical.question-flags2.2026-11-05.v1"
    ],
    "previousStem": "Which baseline skeletal study should be arranged alongside {patientName}'s operative consultation?",
    "previousChoiceLabels": [
      "Dual-energy X-ray absorptiometry at spine, hip and distal forearm",
      "Quantitative CT of the lumbar spine and hip",
      "Radionuclide bone scintigraphy of the axial skeleton"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify which proposed hip acquisition corresponds to native bone. Then: Apply the PHPT forearm-site requirement to distinguish the two radial regions.",
    "reviewerNotes": "Key hold: align the native-versus-prosthetic hip DXA selection and exact radial-region comparison with permitted densitometry guidance before acceptance. The recorded Fifth Workshop claim directly supports the three sites, but does not independently verify every hardware/ROI detail. The operative referral was already ordered, not conditional on DXA. This orders the regions of an already-requested baseline study during a provisional PHPT workup; it does not mandate DXA for confirmed FHH.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "three_site_dxa_1": "three_site_dxa_1",
      "choice.flags2r2.20261105.g05-staging.d1": "choice.flags2.20261105.g05-staging.d1",
      "choice.flags2r2.20261105.g05-staging.d2": "choice.flags2.20261105.g05-staging.d2",
      "choice.flags2r2.20261105.g05-staging.d3": "choice.flags2.20261105.g05-staging.d1"
    },
    "choiceServiceOverrides": {
      "three_site_dxa_1": "service.dxa",
      "choice.flags2r2.20261105.g05-staging.d1": null,
      "choice.flags2r2.20261105.g05-staging.d2": null,
      "choice.flags2r2.20261105.g05-staging.d3": null
    },
    "choiceTimingOverrides": {
      "three_site_dxa_1": {
        "kind": "test",
        "timingProfileId": "timing.test.dxa"
      },
      "choice.flags2r2.20261105.g05-staging.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.dxa"
      },
      "choice.flags2r2.20261105.g05-staging.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.dxa"
      },
      "choice.flags2r2.20261105.g05-staging.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.dxa"
      }
    },
    "question": {
      "id": "question.asymptomatic-phpt.three-site-dxa.v1.r2",
      "conceptId": "concept.phpt.native-hip-and-radial-acquisition.v1",
      "stem": "Which additional DXA acquisition should be requested for {patientName}'s skeletal assessment?",
      "answerChoices": [
        {
          "id": "three_site_dxa_1",
          "label": "Left hip and distal one-third radius",
          "isCorrect": true,
          "rationale": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g05-staging.d1",
          "label": "Right hip and distal one-third radius",
          "isCorrect": false,
          "distractorRationale": "The radial site is appropriate, but the proposed hip region contains the arthroplasty. It does not supply the intended native-hip assessment in this constructed record."
        },
        {
          "id": "choice.flags2r2.20261105.g05-staging.d2",
          "label": "Left hip and ultradistal radius",
          "isCorrect": false,
          "distractorRationale": "The hip is suitable, but the forearm region is not the guideline-specified distal one-third radius. Selecting a native hip does not make different radial acquisition regions interchangeable."
        },
        {
          "id": "choice.flags2r2.20261105.g05-staging.d3",
          "label": "Right hip and ultradistal radius",
          "isCorrect": false,
          "distractorRationale": "This combines the prosthetic hip region with a different radial region. Both components must be checked rather than choosing a familiar hip/forearm label."
        }
      ],
      "explanation": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral. The radial site is appropriate, but the proposed hip region contains the arthroplasty. It does not supply the intended native-hip assessment in this constructed record. The hip is suitable, but the forearm region is not the guideline-specified distal one-third radius. Selecting a native hip does not make different radial acquisition regions interchangeable. This combines the prosthetic hip region with a different radial region. Both components must be checked rather than choosing a familiar hip/forearm label.",
      "teachingPoint": "The native left hip supplies the intended hip measurement, and the distal one-third radius supplies the recommended forearm site for the PHPT workup. This completes the requested site assessment alongside the already-placed referral.",
      "supportingEvidenceClaimIds": [
        "claim.asymptomatic-phpt.three-site-dxa",
        "claim.asymptomatic-phpt.age-under-50-surgery",
        "claim.flags2r2.20261105.phpt-native-hip-acquisition",
        "claim.flags2r2.20261105.phpt-radial-region",
        "claim.flags2r2.20261105.phpt-parallel-referral"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
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
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.asymptomatic-phpt.three-site-dxa",
      "nextConceptId": "concept.phpt.native-hip-and-radial-acquisition.v1",
      "previousKeyServiceId": "service.dxa",
      "nextKeyServiceId": "service.dxa",
      "previousResultGate": {
        "id": "gate.asymptomatic-phpt.dxa.1",
        "resultTypeId": "service.dxa",
        "pendingLabel": "External DXA assessment pending",
        "resultNarrative": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.dxa.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.asymptomatic-phpt.dxa.1",
        "resultTypeId": "service.dxa",
        "pendingLabel": "External DXA assessment pending",
        "resultNarrative": "Three-site DXA at the lumbar spine, hip, and distal one-third radius shows age-appropriate normal bone density.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.dxa.outsourced"
        ]
      },
      "reason": "Replaces routine modality recall with acquisition adequacy in a patient-specific hardware context. Preserve the old three-site-baseline card and keep operative consultation independent of the game result gate."
    },
    "ownerProgramReview": {
      "ownerItemId": "G05",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removed the foundational label and weak alternative modalities. Added an actual lumbar acquisition/hardware record and four parallel two-site DXA orders. Used the precise one-third-radius region and recorded the changed acquisition objective. The referral predates this result gate.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits after repeat samples show calcium above the laboratory reference range and intact PTH within the reference range. An endocrine-surgery referral and baseline skeletal assessment were ordered at that visit. A prior DXA file contains the lumbar-spine acquisition. A right total hip replacement followed a high-energy injury; the left hip has native bone.",
    "previousPresentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
    "previousProfilePresentations": [
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
        "presentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
        "presentation": "{patientName}, a 47-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
        "presentation": "{patientName}, a 46-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
        "presentation": "{patientName}, a 46-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.asymptomatic-phpt.incidental-calcium",
        "patientPresentationVariantId": "presentation.asymptomatic-phpt.incidental-calcium",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "High calcium follow-up",
        "revisedPresentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.female.47",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.female.47",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 47-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.male.47",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.male.47",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 47-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.female.46",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.female.46",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.asymptomatic-phpt.incidental-calcium.male.46",
            "approvedInstantiationProfileId": "profile.asymptomatic-phpt.incidental-calcium.male.46",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits for confirmed primary hyperparathyroidism after repeat calcium and parathyroid-hormone testing. Creatinine is within laboratory reference limits; renal ultrasound shows no calculi, and there is no fragility-fracture history. The referral requests an operative opinion and a baseline skeletal assessment.",
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
      "idPrefix": "ppr.flags2r2.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1"
    },
    "chiefComplaint": "Calcium workup review",
    "previousChiefComplaint": "High calcium follow-up",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.47",
        "chiefComplaint": "High calcium follow-up"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.47",
        "chiefComplaint": "High calcium follow-up"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.female.46",
        "chiefComplaint": "High calcium follow-up"
      },
      {
        "id": "profile.asymptomatic-phpt.incidental-calcium.male.46",
        "chiefComplaint": "High calcium follow-up"
      }
    ]
  },
  {
    "id": "revision.flags2r2.20261105.g05",
    "auditId": "G05",
    "caseId": "case.asymptomatic-phpt.incidental-calcium",
    "nodeId": "node.asymptomatic-phpt.incidental-calcium.2",
    "previousQuestionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r1",
    "questionVariantId": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
    "previousContentVersions": [
      "clinical.question-flags2.2026-11-05.v1"
    ],
    "previousStem": "Which management recommendation should be made for {patientName}?",
    "previousChoiceLabels": [
      "Recommend parathyroidectomy through endocrine surgery",
      "Recommend biochemical surveillance through endocrinology follow-up",
      "Recommend cinacalcet therapy through endocrinology follow-up"
    ],
    "previousCurrentUpdate": "The completed spine, hip and distal-radius bone-density measurements are within the age-appropriate reference range. {patientName} has no hypercalcemic symptoms.",
    "previousExhibit": null,
    "currentUpdate": "The completed lumbar-spine, native-left-hip and one-third-radius density measurements are within age-appropriate reference ranges. A paired serum and complete 24-hour urine collection gives a calcium-to-creatinine clearance ratio below 0.01. Renal function and 25-hydroxyvitamin D are within reference ranges; there is no thiazide use. Earlier adult records show calcium in the same mildly elevated band, and the mother's records show a similar longstanding pattern.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Integrate the calcium/PTH, complete low-ratio collection and longstanding familial pattern as evidence of an inherited mimic rather than established PHPT. Then: Choose genetic clarification before localization; do not use young age or normal DXA to settle the diagnosis.",
    "reviewerNotes": "Recorded PARAT consensus and Fifth Workshop claims directly support the inherited pattern, the exact ratio boundary, its limitations and genetic/family evaluation. Duplicate source IDs for the Fifth Workshop are one publication, not independent corroboration. The new case is a provisional calcium–PTH workup, not a statement that confirmed PHPT should wait for an abnormal DXA. No fresh source access, genetic-test sensitivity, malignancy algorithm or empiric drug regimen is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "surgical_assessment_1": "surgical_assessment_1",
      "choice.flags2r2.20261105.g05.d1": "choice.flags2.20261105.g05.d1",
      "choice.flags2r2.20261105.g05.d2": "choice.flags2.20261105.g05.d2"
    },
    "choiceServiceOverrides": {
      "surgical_assessment_1": null,
      "choice.flags2r2.20261105.g05.d1": null,
      "choice.flags2r2.20261105.g05.d2": null
    },
    "choiceTimingOverrides": {
      "surgical_assessment_1": {
        "kind": "test",
        "timingProfileId": "timing.test.genetic"
      },
      "choice.flags2r2.20261105.g05.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.flags2r2.20261105.g05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.metabolic_workup"
      }
    },
    "question": {
      "id": "question.asymptomatic-phpt.age-based-surgery.v1.r2",
      "conceptId": "concept.phpt.inherited-calcium-before-localization.v1",
      "stem": "Which investigation should guide {patientName}'s parathyroid planning next?",
      "answerChoices": [
        {
          "id": "surgical_assessment_1",
          "label": "Calcium-sensing receptor gene assay",
          "isCorrect": true,
          "rationale": "The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g05.d1",
          "label": "Parathyroid sestamibi scintigraphy",
          "isCorrect": false,
          "distractorRationale": "This is a credible next step if the clinician assumes that the biochemical pattern and young age have already settled PHPT and the need for localization. It would not resolve the inherited mimic raised by the urine/family record; localization is not a substitute for clarifying that diagnosis."
        },
        {
          "id": "choice.flags2r2.20261105.g05.d2",
          "label": "PTH-related peptide assay",
          "isCorrect": false,
          "distractorRationale": "A numerically reference-range intact PTH can tempt a different hypercalcemia workup. It does not exclude the recorded inherited calcium/PTH pattern, and this marker would not answer the family/genetic question supplied by the low urine ratio and longstanding familial findings."
        }
      ],
      "explanation": "The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case. This is a credible next step if the clinician assumes that the biochemical pattern and young age have already settled PHPT and the need for localization. It would not resolve the inherited mimic raised by the urine/family record; localization is not a substitute for clarifying that diagnosis. A numerically reference-range intact PTH can tempt a different hypercalcemia workup. It does not exclude the recorded inherited calcium/PTH pattern, and this marker would not answer the family/genetic question supplied by the low urine ratio and longstanding familial findings.",
      "teachingPoint": "The family/longitudinal pattern and low clearance ratio raise an inherited calcium-sensing disorder as a mimic of PHPT. The ratio supports that suspicion but does not confirm it. Genetic and family evaluation should clarify the disease before operative localization is treated as the remaining step. Normal DXA does not decide this distinction, and age under 50 is an operative criterion only after the relevant diagnosis is established. A negative CASR result would not exclude every suspected FHH case.",
      "supportingEvidenceClaimIds": [
        "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
        "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
        "claim.fhh.low-cccr-supports-but-does-not-confirm",
        "claim.fhh.genetic-and-family-confirmation",
        "claim.primary-hyperparathyroidism.biochemical-pattern",
        "claim.asymptomatic-phpt.age-under-50-surgery",
        "claim.flags2r2.20261105.phpt-fhh-ratio-boundary",
        "claim.flags2r2.20261105.phpt-inherited-before-localization",
        "claim.flags2r2.20261105.phpt-diagnosis-before-age-criterion"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.asymptomatic-phpt.age-based-surgery",
      "nextConceptId": "concept.phpt.inherited-calcium-before-localization.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes age-rule recall into a diagnostic-sequencing application that changes the operative pathway. Preserve the original age-based indication card. The new header records a provisional biochemical workup/referral and the later family/urine record raises an inherited mimic; DXA remains baseline characterization, not eligibility permission."
    },
    "ownerProgramReview": {
      "ownerItemId": "G05",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removed specialty destinations and cinacalcet. Replaced an ambiguous draft operative-ranking comparison during self-check with a sourced inherited-calcium differential. The header now records the provisional raw biochemical pattern and an already-placed referral; the new concept tests genetic clarification before operative localization.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.flags2r2.20261105.g07",
    "auditId": "G07",
    "caseId": "case.gs028b.ptld.b-pathology-returned",
    "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
    "previousQuestionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r1",
    "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r2",
    "previousContentVersions": [
      "clinical.question-flags2.2026-11-05.v1"
    ],
    "previousStem": "Which image-guided sampling request should be made next for {patientName}'s neck lymph node?",
    "previousChoiceLabels": [
      "Core-needle biopsy with a peripheral solid-tissue target",
      "Fine-needle aspiration with a peripheral solid-tissue target",
      "Core-needle biopsy with a central fluid-region target",
      "Fine-needle aspiration with a central fluid-region target"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Neck ultrasound observations",
      "items": [
        {
          "label": "Peripheral portion of the node",
          "value": "Solid tissue with internal Doppler flow"
        },
        {
          "label": "Central portion of the node",
          "value": "Fluid-like material and debris; no internal Doppler flow"
        }
      ]
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret what the same-target aspirate and uninterpretable flow study leave unresolved despite EBV detection. Then: Select a representative new specimen and handling plan rather than solving only the needle label or only the laboratory allocation.",
    "reviewerNotes": "Key hold: directly verify accessible-node excision versus a well-planned core and the fresh/fixed tissue allocation with permitted PTLD/lymphoma guidance and hematopathology before acceptance. Existing PTLD/neck-core claims do not independently establish every technique or laboratory-processing preference. No universal core-versus-excision rule is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.flags2r2.20261105.g07.d1": "choice.flags2.20261105.g07.d1",
      "choice.flags2r2.20261105.g07.d2": "choice.flags2.20261105.g07.d2",
      "choice.flags2r2.20261105.g07.d3": "choice.flags2.20261105.g07.d3"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.flags2r2.20261105.g07.d1": null,
      "choice.flags2r2.20261105.g07.d2": null,
      "choice.flags2r2.20261105.g07.d3": null
    },
    "choiceTimingOverrides": {
      "correct_4": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.flags2r2.20261105.g07.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.flags2r2.20261105.g07.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.flags2r2.20261105.g07.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "question": {
      "id": "question.ptld.tissue-diagnosis-coordination.v4.r2",
      "conceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "stem": "Which specimen plan should be requested next for {patientName}'s neck lymph node?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Excisional biopsy with fresh/fixed allocation",
          "isCorrect": true,
          "rationale": "The accessible intact node can supply representative tissue for classification, while planned fresh and fixed portions allow the unresolved ancillary and histologic questions to be addressed. EBV detection and the limited aspirate do not classify the process.",
          "distractorRationale": null
        },
        {
          "id": "choice.flags2r2.20261105.g07.d1",
          "label": "Core biopsy with fresh/fixed allocation",
          "isCorrect": false,
          "distractorRationale": "This is the closest credible alternative and can be appropriate when excision is unsuitable. It corrects handling but provides a smaller specimen; the represented accessible node and unresolved tissue pattern favor the intended excisional plan."
        },
        {
          "id": "choice.flags2r2.20261105.g07.d2",
          "label": "Excisional biopsy with formalin fixation",
          "isCorrect": false,
          "distractorRationale": "This obtains intact tissue, but a wholly fixed specimen would not preserve a fresh sample for the unresolved flow-cytometry question. Choosing an excisional label does not by itself resolve specimen handling."
        },
        {
          "id": "choice.flags2r2.20261105.g07.d3",
          "label": "Core biopsy with formalin fixation",
          "isCorrect": false,
          "distractorRationale": "This combines a more limited tissue sample with fixation of the complete specimen. Both adequacy and the unresolved ancillary-study pathway require attention rather than a biopsy label in isolation."
        }
      ],
      "explanation": "The accessible intact node can supply representative tissue for classification, while planned fresh and fixed portions allow the unresolved ancillary and histologic questions to be addressed. EBV detection and the limited aspirate do not classify the process. This is the closest credible alternative and can be appropriate when excision is unsuitable. It corrects handling but provides a smaller specimen; the represented accessible node and unresolved tissue pattern favor the intended excisional plan. This obtains intact tissue, but a wholly fixed specimen would not preserve a fresh sample for the unresolved flow-cytometry question. Choosing an excisional label does not by itself resolve specimen handling. This combines a more limited tissue sample with fixation of the complete specimen. Both adequacy and the unresolved ancillary-study pathway require attention rather than a biopsy label in isolation.",
      "teachingPoint": "The accessible intact node can supply representative tissue for classification, while planned fresh and fixed portions allow the unresolved ancillary and histologic questions to be addressed. EBV detection and the limited aspirate do not classify the process.",
      "supportingEvidenceClaimIds": [
        "claim.ptld.tissue",
        "claim.gs028f.neck.core-biopsy-alternative",
        "claim.flags2r2.20261105.ptld-limited-aspirate-classification",
        "claim.flags2r2.20261105.ptld-excision-versus-core",
        "claim.flags2r2.20261105.ptld-fresh-fixed-handling"
      ],
      "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Prior sampling and laboratory record",
        "columnHeaders": [
          "Record",
          "Observation"
        ],
        "rowHeaders": [
          "Prior sampled target",
          "Cytology/cell block",
          "Flow cytometry"
        ],
        "cells": [
          [
            "The same left supraclavicular node; needle tip recorded in its solid portion",
            "Mixed lymphoid cells and scattered large B cells; EBV RNA detected in some large cells"
          ],
          [
            "Cell block",
            "Scattered cell groups; no intact nodal tissue pattern in the sections"
          ],
          [
            "Aspirate submitted for flow analysis",
            "Predominantly nonviable cells; no interpretable clonality result"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
      "nextConceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Changes round one's solid-versus-fluid target selection into tissue-method and handling planning. Both methods target the same solid node, prior target is explicit, and historical coordination/target cards remain intact."
    },
    "ownerProgramReview": {
      "ownerItemId": "G07",
      "reviewedOn": "2026-11-05",
      "whatChanged": "Removed the two fluid-region foils and narrow image-guided-only task. Specified the prior target and actual cytology/ancillary findings. Compared excision/core and fresh/fixed allocation at the same specimen-planning stage; recorded the closest core alternative and retained its key-level hold.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun} with a liver transplant, visits for an enlarging left supraclavicular lymph node. It is mobile beneath the skin; ultrasound places it superficial to the major neck vessels. Plasma EBV DNA is detected.",
    "previousPresentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.43",
        "presentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.43",
        "presentation": "{patientName}, a 43-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.68",
        "presentation": "{patientName}, a 68-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.68",
        "presentation": "{patientName}, a 68-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.gs028b.ptld.b-pathology-returned",
        "patientPresentationVariantId": "presentation.gs028b.ptld.b-pathology-returned",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Enlarging neck node",
        "revisedPresentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.female.43",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 43-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.male.43",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 43-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.female.68",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 68-year-old woman with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028b.ptld.b-pathology-returned.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.ptld.b-pathology-returned.male.68",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 68-year-old man with a liver transplant, visits with an enlarging left supraclavicular lymph node. Plasma testing detects EBV DNA. An outside needle aspirate contains scattered disrupted lymphoid cells and blood; its cell block has no intact tissue fragments.",
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
      "idPrefix": "ppr.flags2r2.20261105.",
      "contentVersion": "presentation-revision.question-flags2-round2.2026-11-05.v1"
    },
    "chiefComplaint": "Enlarging neck node",
    "previousChiefComplaint": "Enlarging neck node",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.43",
        "chiefComplaint": "Enlarging neck node"
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.43",
        "chiefComplaint": "Enlarging neck node"
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.female.68",
        "chiefComplaint": "Enlarging neck node"
      },
      {
        "id": "profile.gs028b.ptld.b-pathology-returned.male.68",
        "chiefComplaint": "Enlarging neck node"
      }
    ]
  }
];

export const QUESTION_FLAGS2_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.itp.changed-lineage-pattern-before-treatment.v1",
    "displayName": "Reassess changed cytopenias before another ITP treatment",
    "learningObjective": "Interpret a transition from isolated thrombocytopenia to multilineage and morphologic abnormalities, then select diagnostic reassessment before another ITP treatment.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "previousConceptId": "concept.persistent-itp.defer-elective-splenectomy",
    "versioningReason": "Changes the scored objective from elective splenectomy timing to evaluation of a changed blood-cell pattern. Preserve the original timing card and the eight isolated-ITP siblings; negative serology is not a universal trigger for marrow examination.",
    "revisedItemIds": [
      "G01"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.persistent-itp.hiv-hcv-secondary-evaluation",
      "claim.flags2r2.20261105.changed-cytopenia-boundary",
      "claim.flags2r2.20261105.marrow-versus-blood-studies"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.mh.nontriggering-plan-and-testing-sequence.v1",
    "displayName": "Choose the surgical testing sequence under unresolved familial MH risk",
    "learningObjective": "Interpret family history and an uninformative genetic result, then distinguish nontriggering perioperative planning from prophylactic dantrolene or obligatory preoperative contracture testing.",
    "earliestFacilityStage": 0,
    "conceptType": "management",
    "previousConceptId": "concept.mh.family-history-and-regimen-components.v1",
    "versioningReason": "The round-one objective compared trigger classes in drug regimens. This version compares preoperative testing/prophylaxis sequencing when every offered plan uses the same acceptable intravenous drugs; retain the original communication and trigger-recognition cards.",
    "revisedItemIds": [
      "G02"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.gs028d.mh.trigger-free-plan",
      "claim.flags2r2.20261105.mh-family-panel-boundary",
      "claim.flags2r2.20261105.mh-testing-not-prerequisite",
      "claim.flags2r2.20261105.mh-no-routine-prophylaxis",
      "claim.flags2r2.20261105.mh-named-plan"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.palpable-breast.acquisition-site-versus-retrieval.v1",
    "displayName": "Distinguish wrong-site acquisition from missing breast images",
    "learningObjective": "Correlate a persistent examination finding with the complete imaging acquisition record, then choose a new targeted study rather than archive retrieval or repetition of an adequate mammographic acquisition.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
    "versioningReason": "Changes the scored objective from recalling ultrasound after mammography to interpreting clinical/acquisition concordance. Binds directly to the owner-flagged live v1; B2B36 is not used as a revision source or accepted coverage.",
    "revisedItemIds": [
      "G03"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.gs028c.palpable.targeted-us",
      "claim.flags2r2.20261105.breast-acquisition-site",
      "claim.flags2r2.20261105.breast-repeat-versus-retrieve"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.early-pregnancy.location-before-disposition.v1",
    "displayName": "Establish the early-pregnancy assessment pathway from discordant reassurance",
    "learningObjective": "Interpret early negative urine testing, persistent hCG, changing symptoms and limited pelvic acquisition, then prioritize the pregnancy-localization assessment before assigning a miscarriage or appendiceal disposition.",
    "earliestFacilityStage": 0,
    "conceptType": "workup",
    "previousConceptId": "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
    "versioningReason": "Manager agrees to retire/merge the redundant assay-recognition item only after a harder replacement passes. This new scored clinical objective is separately versioned; original hCG-testing concept/live v1 and all frozen encounters remain unchanged pending acceptance.",
    "revisedItemIds": [
      "G04-R"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.gs028f.pregnancy.early-negative-limit",
      "claim.gs028f.ectopic.symptoms-require-assessment",
      "claim.gs028f.ectopic.hcg-does-not-locate",
      "claim.flags2r2.20261105.pregnancy-falling-hcg-boundary",
      "claim.flags2r2.20261105.pregnancy-localization-before-disposition",
      "claim.flags2r2.20261105.pregnancy-modality-ranking"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.phpt.native-hip-and-radial-acquisition.v1",
    "displayName": "Select valid hip and radial DXA acquisition regions in PHPT",
    "learningObjective": "Interpret the acquired lumbar series and hip hardware record, then combine a valid native-hip site with the PHPT forearm region.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "previousConceptId": "concept.asymptomatic-phpt.three-site-dxa",
    "versioningReason": "Replaces routine modality recall with acquisition adequacy in a patient-specific hardware context. Preserve the old three-site-baseline card and keep operative consultation independent of the game result gate.",
    "revisedItemIds": [
      "G05-staging"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.asymptomatic-phpt.three-site-dxa",
      "claim.asymptomatic-phpt.age-under-50-surgery",
      "claim.flags2r2.20261105.phpt-native-hip-acquisition",
      "claim.flags2r2.20261105.phpt-radial-region",
      "claim.flags2r2.20261105.phpt-parallel-referral"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.phpt.inherited-calcium-before-localization.v1",
    "displayName": "Clarify inherited hypercalcemia before operative localization",
    "learningObjective": "Interpret calcium/PTH, relative hypocalciuria and family/longitudinal findings, then pursue genetic clarification instead of assuming that young age establishes PHPT or that localization can establish its diagnosis.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "previousConceptId": "concept.asymptomatic-phpt.age-based-surgery",
    "versioningReason": "Changes age-rule recall into a diagnostic-sequencing application that changes the operative pathway. Preserve the original age-based indication card. The new header records a provisional biochemical workup/referral and the later family/urine record raises an inherited mimic; DXA remains baseline characterization, not eligibility permission.",
    "revisedItemIds": [
      "G05"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria",
      "claim.fhh.paired-urine-serum-calcium-creatinine-evaluation",
      "claim.fhh.low-cccr-supports-but-does-not-confirm",
      "claim.fhh.genetic-and-family-confirmation",
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.asymptomatic-phpt.age-under-50-surgery",
      "claim.flags2r2.20261105.phpt-fhh-ratio-boundary",
      "claim.flags2r2.20261105.phpt-inherited-before-localization",
      "claim.flags2r2.20261105.phpt-diagnosis-before-age-criterion"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  },
  {
    "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
    "displayName": "Plan representative nodal tissue and ancillary handling after limited sampling",
    "learningObjective": "Interpret the prior same-target specimen and failed ancillary result, then combine a representative tissue method with processing that can answer the unresolved classification questions.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "previousConceptId": "concept.ptld.neck-node-target-and-tissue-adequacy.v1",
    "versioningReason": "Changes round one's solid-versus-fluid target selection into tissue-method and handling planning. Both methods target the same solid node, prior target is explicit, and historical coordination/target cards remain intact.",
    "revisedItemIds": [
      "G07"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.ptld.tissue",
      "claim.gs028f.neck.core-biopsy-alternative",
      "claim.flags2r2.20261105.ptld-limited-aspirate-classification",
      "claim.flags2r2.20261105.ptld-excision-versus-core",
      "claim.flags2r2.20261105.ptld-fresh-fixed-handling"
    ],
    "contentVersion": "clinical.question-flags2-round2.2026-11-05.v1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true
  }
];
